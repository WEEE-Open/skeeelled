########################################################################
########################################################################
##                                                                    ##
##                               MODALI                               ##
##            MODeratore Automatico per la Lingua Italiana            ##
##                                                                    ##
########################################################################
########################################################################


import sys
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
		from Detectors import ToxicityDetector
		print(" ** Training the transformer model on Dataset_ITA.json **\n")

		# Check if dataset exists
		if os.path.exists('Dataset_ITA.json'):
			pass

		else:
			# Builds unlabelled dataset of scraped comments
			from DatasetBuilder import DatasetBuilder
			print(" ** Building the italian toxicity Dataset **\n")
			
			builder = DatasetBuilder()
			builder.build()
			builder.shuffle()

		# Start training on scraped dataset of comments
		moderator = ToxicityDetector()
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

infer("E Che Cazzo!!")