# Modali - MODeratore Automatico per la Lingua Italiana

import sys
import os
from DatasetBuilder import DatasetBuilder

if os.path.exists('Dataset_ITA.json'):
	print("Italian Dataset .json file has already been created!")

else:
	print("Building the italian toxicity Dataset!")
	builder = DatasetBuilder()
	builder.build()
	builder.shuffle()
	print("Dataset has been build!")

