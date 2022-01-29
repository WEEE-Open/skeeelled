import numpy as np
import pandas as pd
import torch
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
		self.vocabulary = ["cazzo", "zoccola", "puttana", "pompini", "culo"]

	# Check is each word in input text is present in profanity vocab
	def is_present(self):
		for word in self.tokenized_comment:
			# Exclude evry stopword from the actual check
			if word not in self.stopwords:
				# Swear word/Profanity is found in the input text
				if word in self.vocabulary:
					# Only one occurrence is necessary to return the profanity status check
					print("\n   🤌💩   Gotcha you naughty boy   💩🤌\n")
					return True

		# The input text does feature any known swear word/profanity
		return False


#-------------------#
# TOXICITY DETECTOR #
#    (Transformer)  #
#-------------------#
class ToxicityDetector:

	def __init__(self):
		return

	def train(self):
		return

	def validate(self):
		return

	def test(self):
		return

	def gauge(self, some_text):
		# Import fine-tuned model/tokenizer
		from transformers import AutoTokenizer
		tokenizer = AutoTokenizer.from_pretrained("./model") # neuraly/bert-base-italian-cased-sentiment
		from transformers import AutoModelForSequenceClassification, Trainer, TrainingArguments
		model = AutoModelForSequenceClassification.from_pretrained("./model") # neuraly/bert-base-italian-cased-sentiment

		# Tokenise the input text
		tokens = tokenizer([some_text], padding=True, truncation=True, is_split_into_words=True, return_tensors="pt")
		# Obtain the logits of the input text
		outputs = model(**tokens)#, labels=torch.tensor([1,0]))
		# Compute the (normalised) porbability  of the input text
		probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
		# print(outputs, probabilities)
		return probabilities