import numpy as np
import pandas as pd
import torch
import wandb
from sklearn.model_selection import train_test_split
from nltk import word_tokenize


#--------------------#
# PROFANITY DETECTOR #
#      (Non-ML)      #
#--------------------#
class ProfanityDetector:

  def __init__(self, some_text):
    self.tokenized_comment = word_tokenize((str(some_text)).lower())
    self.stopwords = ["per", "è", "é", "e", "il", "che", "tua", "sua", "un", "uno", "una"]
    self.vocabulary = ["cazzo", "zoccola", "puttana", "pompini", "culo"]

  # Check is each word in input text is present in profanity vocab
  def is_present(self):
    for word in self.tokenized_comment:
      # Exclude evry stopword from the actual check
      if word not in self.stopwords:
        # Swear word/Profanity is found in the input text
        if word in self.vocabulary:
          # Only one occurrence is necessary to return the profanity status check
          print("\n   🤌 💩   Gotcha you naughty boy   💩🤌\n")
          return True

    # The input text does feature any known swear word/profanity
    return False


#-------------------#
# TOXICITY DETECTOR #
#    (Transformer)  #
#-------------------#
class ToxicityDetector:

  def __init__(self):
    # Initialise empyt dataset
    self.train = torch.empty(0,1)
    self.valid = torch.empty(0,1)

    # Initialise WandB project (requires .log files and credentials)
    #wandb.login()
    #wandb.init(project="Neuraly")

    # Initialise tokeniser of the model
    from transformers import AutoTokenizer
    self.tokenizer = AutoTokenizer.from_pretrained("./model")

    # Initialise pre-trained transformer model
    from transformers import AutoModelForSequenceClassification, Trainer, TrainingArguments
    self.training_args = TrainingArguments(
         output_dir='./ita_results',
         num_train_epochs=3,
         per_device_train_batch_size=8,
         per_device_eval_batch_size=16,
         warmup_steps=500,
         weight_decay=0.01,
         logging_dir='./ita_logs',
         logging_steps=10,
         report_to='wandb',
    )
    self.model = AutoModelForSequenceClassification.from_pretrained("./model")

  def load_dataset(self):
    # Load full dataset and separate features from labels
    print("Into load_dataset()\nLoading .json into Pandas dataframe")
    df = pd.read_json("ITA-Dataset.json")
    print("Done!")
    features = features.append(df.loc[:,['text']])
    features.dropna()
    print("Features created")
    labels = labels.append(df.loc[:,['sentiment']])
    labels.dropna()
    print("Labels created")
    # Split full dataset into train, test and validation sets
    train_x, valid_x, train_y, valid_y = train_test_split(features.to_numpy(), labels.to_numpy(), test_size=.2, shuffle=True)
    print("train_test_split() executed")
    np.array(map(str, train_x))
    #np.array(map(str, test_x))
    np.array(map(str, valid_x))

    # Tokenise text input features
    train_tkn = self.tokenizer(train_x.tolist(), truncation=True, padding=True, is_split_into_words=True)
    print("train_x tokenised")
    #test_tkn = tokenizer(test_x.tolist(), truncation=True, padding=True, is_split_into_words=True)
    valid_tkn = self.tokenizer(valid_x.tolist(), truncation=True, padding=True, is_split_into_words=True)
    print("valid_x tokenised")
    
    # Generate torch datasets
    self.train = {key: torch.tensor(val[idx]) for key, val in self.train_tkn.items()}
    self.train['sentiment'] = torch.tensor(self.train_y[idx])
    self.valid = {key: torch.tensor(val[idx]) for key, val in self.valid_tkn.items()}
    self.valid['sentiment'] = torch.tensor(self.valid_y[idx])

  def train(self):
    # Build torch datasets
    print("Pre load_dataset()")
    self.load_dataset()
    # Initialise Trainer API on the torch datasets
    trainer = Trainer(
        model=self.model,
        args=self.training_args,
        train_dataset=self.train,
        eval_dataset=self.valid
    )
    # Launch training
    self.trainer.train()
    # Save and export checkpoint
    self.model.save_pretrained('./model')
    self.tokenizer.save_pretrained('./model')

  def gauge(self, some_text):
    # Tokenise the input text
    tokens = self.tokenizer([some_text], padding=True, truncation=True, is_split_into_words=True, return_tensors="pt")
    # Obtain the logits of the input text
    outputs = self.model(**tokens)#, labels=torch.tensor([1,0]))
    # Compute the (normalised) porbability  of the input text
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
    # print(outputs, probabilities)
    return probabilities