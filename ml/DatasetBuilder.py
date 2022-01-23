import random
import json
import os
from Scraper import Reddit, Facebook

class DatasetBuilder:

	def __init__(self):
		self.reddit_scraper = Reddit()
		self.facebook_scraper = Facebook()
		if not os.path.exists("ITA-Dataset.json"):
			self.dataset = []

	def build(self):
		self.reddit_scraper.scrape()
		self.facebook_scraper.scrape()

	def shuffle(self):
		# Generate randomly sampled index arrays
		shuffled_reddit_idx = random.sample(range(0, self.reddit_scraper.cardinality), self.reddit_scraper.cardinality)
		shuffled_facebook_idx = random.sample(range(0, self.facebook_scraper.cardinality), self.facebook_scraper.cardinality)

		# Generate json with random samples		
		reddit_counter = 0
		facebook_counter = 0

		for idx in range(1, self.reddit_scraper.cardinality + self.facebook_scraper.cardinality):
			if random.random() > 0.5:
				if reddit_counter < self.reddit_scraper.cardinality:
					self.dataset.append({"text": self.reddit_scraper.dictionary[shuffled_reddit_idx[reddit_counter]]["text"],
										 "sentiment": self.reddit_scraper.dictionary[shuffled_reddit_idx[reddit_counter]]["sentiment"]})
					reddit_counter += 1
			else:
				if facebook_counter < self.facebook_scraper.cardinality:
					self.dataset.append({"text": self.facebook_scraper.dictionary[shuffled_facebook_idx[facebook_counter]]["text"],
										 "sentiment": self.facebook_scraper.dictionary[shuffled_facebook_idx[facebook_counter]]["sentiment"]})
					facebook_counter += 1

				else:
					self.dataset.append({"text": self.reddit_scraper.dictionary[shuffled_reddit_idx[reddit_counter]]["text"],
										 "sentiment": self.reddit_scraper.dictionary[shuffled_reddit_idx[reddit_counter]]["sentiment"]})
					reddit_counter += 1

		with open('ITA-Dataset.json', 'w+') as dataset:
			json.dump(self.dataset, dataset, indent=2, ensure_ascii=False)