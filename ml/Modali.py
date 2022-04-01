########################################################################
########################################################################
##                                                                    ##
##                               MODALI                               ##
##            MODeratore Automatico per la Lingua Italiana            ##
##                                                                    ##
########################################################################
########################################################################

import os

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
    if os.path.exists('ITA-Dataset.json'):
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


#---------------------#
# Full input pipeline #
#---------------------#
def infer(comment):

  # Perform training if model has not been fine-tuned
  train()

  # Check presence of swear-words/profanity in the comment
  from Detectors import ProfanityDetector
  detector = ProfanityDetector(comment)
  
  # Initialise score for swer-words reference
  score = 0
  # Check toxicity level in the comment
  if detector.purity_check():
    # Check toxicity level in the comment
    from Detectors import ToxicityDetector
    moderator = ToxicityDetector(1)
    distribution = moderator.gauge(comment)
    # Invoke policy to quarantine the comment or not
    score = moderator.banning_policy(distribution)

  return score