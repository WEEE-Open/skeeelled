########################################################################
########################################################################
##                                                                    ##
##                               ModBOT                               ##
##                                                                    ##
########################################################################
########################################################################

import os
import numpy as np
from torch import nn

class Polyglot:

  def __init__(self):
    # Select between local and hosted pre-trained models
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    if os.path.exists('LangID'):
      pass
    else:
      self.tokenizer = AutoTokenizer.from_pretrained("papluca/xlm-roberta-base-language-detection")
      self.tokenizer.save_pretrained('./LangID')
      self.model = AutoModelForSequenceClassification.from_pretrained("papluca/xlm-roberta-base-language-detection")
      self.model.save_pretrained('./LangID')

  def discern(self, input_text):
    # Tokenise the input text
    tokens = self.tokenizer([input_text], padding=True, truncation=True, is_split_into_words=True, return_tensors="pt")
    # Obtain the logits of the input text
    outputs = self.model(**tokens)
    # Retrieve language ID from argmax of labels' probability distribution
    probabilities = nn.functional.softmax(outputs.logits, dim=-1).detach().numpy()
    language_id = np.where(probabilities == np.amax(probabilities, axis=1))
    
    return language_id[1]


def moderate(comment):
  # Filter unwanted characters out of the input text
  sample = comment.replace("[", "").replace("]", "").replace('\\n', ' ').replace('\\', ' ').replace("'", ""). replace('"', '')
  # Discern language of the comment between english and italian
  ModBOT = Polyglot()
  language_id = ModBOT.discern(sample)

  if language_id == 5:
    # The Italian language has been identified
    from Modali import infer
    # Infer toxicity level of the comment
    sentiment = infer(sample)

  elif language_id == 13:
    # The English language has been identified
    pass

  else: 
    print("Content is neither in Italian nor English")
