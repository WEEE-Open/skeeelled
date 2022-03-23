import numpy as np
import pandas as pd
import torch
import json
import os

from Modali import infer

##################################
#
# In Neuraly the labels are:
#
#   0: negative
#   1: neutral
#   2: positive 
#
# In dataset.json the labels are:
#
#   True:  toxic
#   False: non-toxic
#   /:     can't say
#
#################################

# CONVERT DATASET LABELS INTO NEURALY LABELS
df = pd.read_json("dataset.json")
texts = df.loc[:,['text']]
sentiments = df.loc[:,['label']]

features = texts.to_numpy()
labels = sentiments.to_numpy()

dataset = []
toxic = 0
non_toxic = 0

for j in range(0, len(features)):
    if labels[j] == True: # Toxic
        dataset.append({"text": str(features[j]), "label": 0})
        toxic += 1

    elif labels[j] == False: # Non-Toxic
        dataset.append({"text": str(features[j]), "label": 2})
        non_toxic += 1

# GENERATE NEW, REDUCED DATASET WITH LABELLED ONLY COMMENTS
cardinality = toxic + non_toxic # 549 + 949

with open('ITA-Dataset.json', 'w+') as DS:
      json.dump(dataset, DS, indent=2, ensure_ascii=False)

new_df = pd.read_json("ITA-Dataset.json")
new_texts = new_df.loc[:,['text']]
new_sentiments = new_df.loc[:,['label']]

new_features = new_texts.to_numpy()
new_labels = new_sentiments.to_numpy()

# CLASSIFY NEW DATASET ON PRE-TRAINED (NON-TUNED) MODEL
new_dataset = []
correct = 0
incorrect_toxic = 0
incorrect_non_toxic = 0

for j in range(cardinality):
    sample = str(new_features[j]).replace("[", "").replace("]", "").replace("'", ""). replace('"', '')
    label = infer(sample)

    print(j)
    print(sample)
    print(f"Real label:{new_labels[j]}\nModel's label:{label}\n\n")

    if label == new_labels[j]:
        correct +=1

    elif new_labels[j] == 0:
        incorrect_toxic += 1

    else:
        incorrect_non_toxic += 1

    new_dataset.append({"text": str(features[j]), "label": new_labels[j], "class": label})


print(correct/cardinality)
print(incorrect_toxic/toxic)
print(incorrect_non_toxic/non_toxic)

with open('classified_dataset.json', 'w+') as DS:
      json.dump(new_dataset, DS, indent=3, ensure_ascii=False)