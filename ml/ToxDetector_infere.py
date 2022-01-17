import torch
import pandas as pd
from torch import nn

# Import fine-tuned model/tokenizer
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("./model") # neuraly/bert-base-italian-cased-sentiment

from transformers import AutoModelForSequenceClassification, Trainer, TrainingArguments
model = AutoModelForSequenceClassification.from_pretrained("./model") # neuraly/bert-base-italian-cased-sentiment

# Create and tokenize input examples
text = ["Se non capisci sta roba al terzo anno stai messo male", "Ma lascia stare ingegneria che non fa per te", "Analisi 2 è uno schifo ma con un po di pazienza la si supera"]
text_tkn = tokenizer(text, padding=True, truncation=True, is_split_into_words=True, return_tensors="pt")
tokens = tokenizer.tokenize(text, padding=True, truncation=True, is_split_into_words=True, return_tensors="pt")

#print(tokens)
#for idx in text_tkn['input_ids']:
#    print(idx)
#    print(tokenizer.decode(idx))

# Infere the inputs' labels through the model and obtain the logits
outputs = model(**text_tkn, labels=torch.tensor([1,0]))
print(outputs)
probabilities = nn.functional.softmax(outputs.logits, dim=-1)
print(probabilities)