import random
import torch
import json
import os
from Scrapers import Reddit, Facebook


#-----------------#
# DATASET BUILDER #
#-----------------#
class Builder:

  def __init__(self):
    # Initialise both scrapers' objects
    self.reddit_scraper = Reddit()
    self.facebook_scraper = Facebook()
    # Create empty dict for the dataset (to be later dumped on .json)
    if not os.path.exists("ITA-Dataset.json"):
      self.dataset = []

  def build(self):
    # Really self-explanatory
    self.reddit_scraper.scrape()
    self.facebook_scraper.scrape()

  def shuffle(self):
    # Generate randomly sampled index arrays
    shuffled_reddit_idx = random.sample(range(0, self.reddit_scraper.cardinality), self.reddit_scraper.cardinality)
    shuffled_facebook_idx = random.sample(range(0, self.facebook_scraper.cardinality), self.facebook_scraper.cardinality)

    # Generate json with random samples
    reddit_counter = 0
    facebook_counter = 0

    # Sample uniformly from randomized reddit and facebook's comments
    for idx in range(1, self.reddit_scraper.cardinality + self.facebook_scraper.cardinality):
      # Reddit comment sampled  
      if random.random() > 0.5:
        # Check if not all Reddit comments have been sampled
        if reddit_counter < self.reddit_scraper.cardinality:
          # Append sampled comment to dataset
          self.dataset.append({"text": self.reddit_scraper.dictionary[shuffled_reddit_idx[reddit_counter]]["text"],
                               "sentiment": self.reddit_scraper.dictionary[shuffled_reddit_idx[reddit_counter]]["sentiment"]})
          reddit_counter += 1
      # Facebook comment sampled
      else:
        # Check if not all Faccebook comments have been sampled
        if facebook_counter < self.facebook_scraper.cardinality:
          # Append sampled comment to dataset
          self.dataset.append({"text": self.facebook_scraper.dictionary[shuffled_facebook_idx[facebook_counter]]["text"],
                               "sentiment": self.facebook_scraper.dictionary[shuffled_facebook_idx[facebook_counter]]["sentiment"]})
          facebook_counter += 1
        # Reddit comment sampled (since Facebook comments have all been sampled)
        else:
          # Append sampled comment to dataset
          self.dataset.append({"text": self.reddit_scraper.dictionary[shuffled_reddit_idx[reddit_counter]]["text"],
                               "sentiment": self.reddit_scraper.dictionary[shuffled_reddit_idx[reddit_counter]]["sentiment"]})
          reddit_counter += 1

    # Write to file the uniformly shuffled dataset
    with open('ITA-Dataset.json', 'w+') as dataset:
      json.dump(self.dataset, dataset, indent=2, ensure_ascii=False)


#------------------#
#  DATASET LOADER  #
#------------------#
class Loader(torch.utils.data.Dataset):
    
    def __init__(self, tokens, labels):
        self.tokens = tokens
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.tokens.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)