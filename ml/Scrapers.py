import os
import time
import praw
from facebook_scraper import get_posts
from dotenv import load_dotenv
load_dotenv()


#----------------#
# REDDIT SCRAPER #
#----------------#
class Reddit():

  def __init__(self):
    # List of subreddits and flairs of threads to scrape
    self.source = [['Universitaly', 'flair:Magistrale', 300],
                   ['Universitaly', 'flair:Ingegneria', 300],
                   ['italy', 'flair:Discussione', 100],
                   ['italy', 'flair:Notizie', 100],
                   ['italy', 'flair:"Economia & Politica"', 100],
                   ['italy', 'flair:"No Flair"', 100],
                   ['Italia', 'flair:Diciamocelo', 100],
                   ['Italia', 'flair:Politica', 100],
                   ['Italia', 'flair:Notizie', 100],
                   ['ITAGLIA', 'flair:ITAGLIANITÀ!!!', 100],
                   ['ITAGLIA', 'flair:"Barbari civilizzati"', 100],
                   ['ITAGLIA', 'flair:"Barbari da civilizzare"', 100],
                   ['ITAGLIA', 'flair:CERCHIONANISMO', 100],
                   ['ITAGLIA', 'flair:"Giovine virgulto"', 100],
                   ['ITAGLIA', 'flair:"ITAGLIA CAPVT MVNDI"', 100],
                   ['ITAGLIA', 'flair:"Cartellino ROSSO!"', 100],]
    # Reddit praw's object initialised by local .env
    self.reddit = praw.Reddit(client_id = os.getenv('reddit_client_id'),
                              client_secret = os.getenv('reddit_client_secret_key'),
                              # username = '', unnecessary as it is a read-only app
                              # password = '', as per above
                              user_agent = os.getenv('reddit_user_agent'))
    # Empty dictionary of scarped comments (cardinality is dictionary's length)
    self.dictionary = []
    self.cardinality = 0

  def scrape(self):

    for subreddit in self.source:
      # Loading threads according to search query sorted by "hot"
      threads = self.reddit.subreddit(subreddit[0]).search(subreddit[1], sort='hot', limit=subreddit[2])
      sub_idx = 0

      for submission in threads:
        # Avoid scraping stickied threads for the sub
        if not submission.stickied:
          # Replacing end-page "more" with additional comments
          submission.comments.replace_more(limit=0)
          # Append all comments to dictionary and label them 'None' (to be classified manually for testing)
          for comment in submission.comments.list():
            self.dictionary.append({"text": str(comment.body), "sentiment": None})
            self.cardinality += 1


#------------------#
# FACEBOOK SCRAPER #
#------------------#
class Facebook():

  def __init__(self):
    # List of pages and groups to scrape
    self.source = [[None, '1650533981900983', 'IngegeriadelSuicidio', 250],
                   [None, 'AIRIricerca', 'AIRIricerca', 250],
                   [None, '249682435410750', 'Matematica&Fisica', 150],
                   [None, '355149558279538', 'GruppodiMatematica', 150],
                   ['saporedimale', None, 'SaporediMale', 100],
                   ['liberonews', None, 'Libero', 100]]
    # Empty dictionary of scarped comments (cardinality is dictionary's length)
    self.dictionary = []
    self.cardinality = 0

  def scrape(self):

    for page in self.source:
      # Loading posts for each page of the specified group
      for post in get_posts(account=page[0], group=page[1], pages=2, cookies="from_browser", options={"comments": True, "allow_extra_requests": True, "posts_per_page": page[3]}):
        # Loading all comments registered (i.e. including GIFs, Images, Links, ...) for the current post
        for comment in list(post['comments_full']):
          # Reqests are delayed to minimise chance of Facebook temporarly blocking the IP
          time.sleep(0.250)
          # Append all comments of the post and label them 'None' (to be classified manually for testing)
          self.dictionary.append({"text": str(comment.get('comment_text')), "sentiment": None})
          self.cardinality += 1
          # For each comment load all the replies
          for reply in list(comment['replies']):
            # Reqests are delayed to minimise chance of Facebook temporarly blocking the IP
            time.sleep(0.250)
            # Append all replis to the comment and label them 'None' (to be classified manually for testing)
            self.dictionary.append({"text": str(comment.get('comment_text')), "sentiment": None})
            self.cardinality += 1    