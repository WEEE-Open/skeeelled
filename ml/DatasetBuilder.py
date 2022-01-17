import random
import json
from Scraper import Reddit, Facebook

class DatasetBuilder:

	def __init__(self):
		self.reddit_scraper = Reddit()
		self.facebook_scraper = Facebook()

	def build(self):
		self.reddit_scraper.scrape()
		self.facebook_scraper.scrape()

	def shuffle(self):
		# Generate randomly sampled index arrays for the two .csv datasets
		shuffled_reddit_idx = random.sample(range(0, self.reddit_scraper.cardinality), self.reddit_scraper.cardinality)
		shuffled_facebook_idx = random.sample(range(0, self.facebook_scraper.cardinality), self.facebook_scraper.cardinality)

		# Generate json with random samples
		with open('Dataset_ITA.json', 'w+') as dataset:
			reddit_counter = 0
			facebook_counter = 0
			for idx in range(1, self.reddit_scraper.cardinality + self.facebook_scraper.cardinality):
				if random.random() > 0.5:
					if reddit_counter < self.reddit_scraper.cardinality:
						json.dump({"text": self.reddit_scraper.dictionary["text"][shuffled_reddit_idx[reddit_counter]],"sentiment": self.reddit_scraper.dictionary["sentiment"][reddit_counter]},
								  dataset,
								  indent=2)
						dataset.write("\n")
						reddit_counter += 1
				else:
					if facebook_counter < self.facebook_scraper.cardinality:
						json.dump({"text": self.facebook_scraper.dictionary["text"][shuffled_facebook_idx[facebook_counter]],"sentiment": self.facebook_scraper.dictionary["sentiment"][facebook_counter]},
								  dataset,
								  indent=2)
						dataset.write("\n")
						facebook_counter += 1

					else:
						json.dump({"text": self.reddit_scraper.dictionary["text"][shuffled_reddit_idx[reddit_counter]],"sentiment": self.reddit_scraper.dictionary["sentiment"][reddit_counter]},
								  dataset,
								  indent=2)
						dataset.write("\n")
						reddit_counter += 1

		# Delete the csv files
