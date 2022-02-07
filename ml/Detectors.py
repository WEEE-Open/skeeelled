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
    self.vocabulary = ["merda", "cazzo"]

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

  def __init__(self, idx):
    # List of HF hosted transformers (https://huggingface.co/models)
    models = ["neuraly/bert-base-italian-cased-sentiment", #0
              "Hate-speech-CNERG/dehatebert-mono-italian", #1
              "MilaNLProc/feel-it-italian-sentiment",      #2
              "dbmdz/bert-base-italian-xxl-uncased",       #3
              "unideeplearning/polibert_sa"]               #4

    # Initialise WandB project (requires .log files and credentials)
    wandb.init(mode="disabled")
    #wandb.login()
    #wandb.init(project="Neuraly")

    # Initialise tokeniser of the model
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    self.tokenizer = AutoTokenizer.from_pretrained(models[idx])
    self.model = AutoModelForSequenceClassification.from_pretrained(models[idx])

    # Instantiate transformer's arguments (all tunable hyperp. of the model)
    from transformers import TrainingArguments
    self.hyperparams = TrainingArguments(output_dir='./ita_results',
                                         num_train_epochs=3,
                                         per_device_train_batch_size=8,
                                         per_device_eval_batch_size=16,
                                         warmup_steps=500,
                                         weight_decay=0.01,
                                         logging_dir='./ita_logs',
                                         logging_steps=10,
                                         report_to='wandb'
                                         )

  def load_dataset(self):
    # Load full dataset and separate features from labels
    df = pd.read_json("ITA-Dataset.json")
    features = df.loc[:,['text']]
    labels = df.loc[:,['sentiment']]
    # Remove NA values (if present) from features and labels
    features.dropna()
    labels.dropna()

    # Split dataset into train, test and validation sets
    full_train_x, test_x, full_train_y, test_y = train_test_split(features.to_numpy(), labels.to_numpy(), test_size=.2, shuffle=True)
    train_x, valid_x, train_y, valid_y = train_test_split(full_train_x, full_train_y, test_size=.1, shuffle=True)

    # Tokenise input text (features)
    train_tkn = self.tokenizer(train_x.tolist(), truncation=True, padding=True, is_split_into_words=True)
    valid_tkn = self.tokenizer(valid_x.tolist(), truncation=True, padding=True, is_split_into_words=True)
    test_tkn = self.tokenizer(test_x.tolist(), truncation=True, padding=True, is_split_into_words=True)
    
    # Build torch datasets
    from DatasetHandler import Loader
    self.train = Loader(train_tkn, train_y)
    self.valid = Loader(valid_tkn, valid_y)
    self.test = Loader(test_tkn, test_y)

  def train(self):
    self.load_dataset()
    # Initialise Trainer API (https://huggingface.co/docs/transformers/training)
    from transformers import Trainer
    trainer = Trainer(
        model=self.model,
        args=self.hyperparams,
        train_dataset=self.train,
        eval_dataset=self.valid
    )
    # Launch training
    trainer.train()
    # Save and export checkpoint
    self.model.save_pretrained('./model')
    self.tokenizer.save_pretrained('./model')

  def gauge(self, some_text):
    # Tokenise the input text
    tokens = self.tokenizer([some_text], padding=True, truncation=True, is_split_into_words=True, return_tensors="pt")
    # Obtain the logits of the input text
    outputs = self.model(**tokens)
    # Compute the (normalised) porbability  of the input text
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
    # print(outputs, probabilities)
    return probabilities