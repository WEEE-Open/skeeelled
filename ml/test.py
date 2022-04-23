import numpy as np
import pandas as pd
import torch
import json
import os

from Modali import infer

##################################
#
# In Dehatebert the labels are:
#
#   0: non-hate
#   1: hate
#
# In dataset.json the labels are:
#
#   True:  toxic
#   False: non-toxic
#   /:     can't say
#
#################################

toxic_id = 1
non_toxic_id = 0

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
        dataset.append({"text": str(features[j]), "label": toxic_id})
        toxic += 1
    elif labels[j] == False: # Non-Toxic
        dataset.append({"text": str(features[j]), "label": non_toxic_id})
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
    comment = str(new_features[j])
    sample = comment.replace("[", "").replace("]", "").replace('\\n', ' ').replace('\\', ' ').replace("'", ""). replace('"', '')
    label = infer(sample)
    
    # Redirect model's inferred label (True/False) to numeric values (1/0)
    model_label = 1 if label is True else 0

    # Print on-screen wheter comment is toxic or not (manually classified)
    if new_labels[j] == 0:
        print(f"Comment n.{j} [Non-Toxic]\nText:{sample}")
    else:
        print(f"Comment n.{j} [Toxic]\nText:{sample}")

    # Update the score for the accuracy of the model
    if model_label == new_labels[j]:
        correct +=1

    elif new_labels[j] == 0:
        incorrect_toxic += 1

    else:
        incorrect_non_toxic += 1
    # Append new classified comment to list
    new_dataset.append({"text": str(features[j]), "label": new_labels[j], "class": model_label})


print(correct/cardinality)
print(incorrect_toxic/toxic)
print(incorrect_non_toxic/non_toxic)

with open('classified_dataset.json', 'w+') as DS:
      json.dump(new_dataset, DS, indent=3, ensure_ascii=False)