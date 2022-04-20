##################################################################################
##################################################################################
##                                                                              ##
##                                    MODALII                                   ##
##            MODeratore Automatico per la Lingua Italiana & Inglese            ##
##                                                                              ##
##################################################################################
##################################################################################

import os
import numpy as np
from torch import nn

#--------------------#
# Trainining/testing #
#      pipeline      #
#--------------------#
def train():
  
  # Check if fine-tuned transformer models exist
  if os.path.exists('model'):
    pass

  else:
    # Check if dataset exists
    if os.path.exists('ITA-Dataset.json') or os.path.exists('ENG-Dataset.json'):
      pass

    else:
      # Builds unlabelled dataset of scraped comments
      from DatasetHandler import Builder
      print(" ** Building the italian toxicity Dataset **\n")
      
      builder = Builder()
      builder.build()
      builder.shuffle()

    # Trains on scraped comments
    from Detectors import ToxicityDetector
    print(" ** Training the transformer model on ITA-Dataset.json **\n")

    moderator = ToxicityDetector(1)
    moderator.train()


#-------------------------#
# Language identification #
#        pipeline         #
#-------------------------#
class Polyglot:

  def __init__(self):
    # Select between local and hosted pre-trained models
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    if os.path.exists('LangID'):
      self.tokenizer = AutoTokenizer.from_pretrained("papluca/xlm-roberta-base-language-detection")
      self.model = AutoModelForSequenceClassification.from_pretrained("papluca/xlm-roberta-base-language-detection")
    else:
      self.tokenizer = AutoTokenizer.from_pretrained("papluca/xlm-roberta-base-language-detection")
      self.tokenizer.save_pretrained('./LangID')
      self.model = AutoModelForSequenceClassification.from_pretrained("papluca/xlm-roberta-base-language-detection")
      self.model.save_pretrained('./LangID')

  def identification(self, probabilities):
    # First compute argmax of the distribution
    argmax = np.where(probabilities == np.amax(probabilities, axis=-1))
    # argmax is a tuple of arrays from which we extract the label
    language_id = argmax[0][0]
    # Return the argmax label if it is either italian or english
    if language_id == 5 or language_id == 13:
      return language_id
    # Compare the standard error of english's label w.r.t. the argmax of the distribution
    else:
      std_err = (probabilities[language_id] - probabilities[13])/probabilities[language_id]
      # Lastly check whether the english label is indeed the second most probable in the PMF
      if std_err < 0.95:
        filtered_probabilities = np.delete(probabilities, argmax)
        filtered_argmax = np.where(filtered_probabilities == np.amax(filtered_probabilities, axis=-1))
        # Return the english label accordingly
        if language_id < 13:
          if filtered_argmax[0][0] == 12:
            return 13
          else:
            return None
        else:
          if filtered_argmax[0][0] == 13:
            return 13
          else:
            return None


  def discern(self, input_text):
    # Tokenise the input text
    tokens = self.tokenizer([input_text], padding=True, truncation=True, is_split_into_words=True, return_tensors="pt")
    # Obtain the logits of the input text
    outputs = self.model(**tokens)
    # Compute labels' probability distribution from logits
    probabilities = nn.functional.softmax(outputs.logits, dim=-1).detach().numpy().reshape((-1,))
    # Retrieve language ID from probability distribution
    lang_id = self.identification(probabilities)
    return lang_id


#---------------------#
# Full input pipeline #
#---------------------#
def infer(comment):

  # Perform training if model has not been fine-tuned
  train()

  # Filter unwanted characters out of the input text
  sample = comment.replace("[", "").replace("]", "").replace('\\n', ' ').replace('\\', ' ').replace("'", ""). replace('"', '')

  # Initialise score for swear-words reference (True=ban, False=pass)
  score = True

  # Discern language of the comment between english and italian...
  Linguist = Polyglot()
  language_id = Linguist.discern(sample)

  # ... and instantiate sentiment analysis model accordingly!
  if language_id == 5:
    print("Italian language identified")

    # Instantiate BoW model for swear-words/profanity
    from Detectors import ProfanityDetector
    detector = ProfanityDetector(0)

    # Check abscence of profanity in the comment
    if detector.purity_check(sample):
      # Instantiate toxicity-detection model
      from Detectors import ToxicityDetector
      moderator = ToxicityDetector(0)
      # Infer toxicity in the comment
      score = moderator.gauge(sample)

  elif language_id == 13:
    print("English language identified")
    
    # Instantiate BoW model for swear-words/profanity
    from Detectors import ProfanityDetector
    detector = ProfanityDetector(1)

    # Check abscence of profanity in the comment
    if detector.purity_check(sample):
      # Instantiate toxicity-detection model
      from Detectors import ToxicityDetector
      moderator = ToxicityDetector(1)
      # Infer toxicity in the comment
      score = moderator.gauge(sample)
  
  else:
    print("Neither Italian nor English language has been identified")
  
  
  # Execute ban according to the sentiment scored
  if score:
    print("Toxicity/Profanity has been detected\nComment has been quarantined!")
  else:
    print("Comment has been published!")

  return score