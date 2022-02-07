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

    moderator = ToxicityDetector(0)
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
  
  if detector.is_present():
    # Check toxicity level in the comment
    from Detectors import ToxicityDetector
    moderator = ToxicityDetector()
    score = moderator.gauge(comment)

    # Banning policy ...
    # ... to be defined !
    #
    # if score < 0.4 (out of 1.0) then ban it; 
    #    if score > 0.4 && < 0.6 then quarantine it;
    #       if score > 0.6 then publish it

infer("Tutto il corso è una merda")
infer("Che risposta inutile! Rivediti un po' di analisi prima di blaterare")