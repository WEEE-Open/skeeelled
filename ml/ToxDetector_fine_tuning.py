import torch
import pandas as pd
from torch import nn

# Generate train Pandas DF (dataframe)
df = pd.read_csv('italian/haspeede_FB-train.tsv', sep='\t')
train_text = df.loc[:,['comment']]
train_label = df.loc[:,['toxic']]

df = pd.read_csv('italian/haspeede_TW-train.tsv', sep='\t')
train_text = train_text.append(df.loc[:,['comment']])
train_label = train_label.append(df.loc[:,['toxic']])

train_text.dropna()
train_label.dropna()
#print(text.tail(10), label.tail(10))
#print(text[1:10], label[1:10])
#print(text.iloc[5999])

# Generate test Pandas DF (dataframe)
df = pd.read_csv('italian/haspeede_FB-test.tsv', sep='\t')
test_text = df.iloc[:,1]
test_label = df.iloc[:,1]

df = pd.read_csv('italian/haspeede_TW-test.tsv', sep='\t')
test_text = test_text.append(df.iloc[:,1])
test_label = test_label.append(df.iloc[:,1])

test_text.dropna()
test_label.dropna()

# Convert DF to Numpy array and create train, test and validation datasets
from sklearn.model_selection import train_test_split
train_x, valid_x, train_y, valid_y = train_test_split(train_text.to_numpy(), train_label.to_numpy(), test_size=.2, shuffle=True)
test_x, test_y = test_text.to_numpy(), test_label.to_numpy()

# Convert content of Numpy arrays to strings
import numpy as np
np.array(map(str, train_x))
np.array(map(str, valid_x))
np.array(map(str, test_x))

#print(train_text.shape)
#print(train_x.shape)
#print(valid_x.shape)

# Tokenize text inputs in the datasets
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("./model") # neuraly/bert-base-italian-cased-sentiment

train_tkn = tokenizer(train_x.tolist(), truncation=True, padding=True, is_split_into_words=True)
valid_tkn = tokenizer(valid_x.tolist(), truncation=True, padding=True, is_split_into_words=True)
test_tkn = tokenizer(test_x.tolist(), truncation=True, padding=True, is_split_into_words=True)

#tokenized_input = train_tkn["input_ids"][137]
#print(tokenized_input)
#print(tokenizer.decode(tokenized_input))

# Create PyTorch Dataset objects
class TorchSet(torch.utils.data.Dataset):
    def __init__(self, tokens, labels):
        self.tokens = tokens
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.tokens.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

train_dataset = TorchSet(train_tkn, train_y)
valid_dataset = TorchSet(valid_tkn, valid_y)
test_dataset = TorchSet(test_tkn, test_y)

# Initialize and log into the WandB project
import wandb
wandb.login() # API Key: 948b433c0e4757bbde2a79b9bb61678dafc7565c
wandb.init(project="Neuraly")

# Building pre-trained model and Trainer API
from transformers import AutoModelForSequenceClassification, Trainer, TrainingArguments
model = AutoModelForSequenceClassification.from_pretrained("./model") # neuraly/bert-base-italian-cased-sentiment

training_args = TrainingArguments(
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
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=valid_dataset
)

# Fine-tuning on custom dataset
trainer.train()

model.save_pretrained('./model')
tokenizer.save_pretrained('./model')