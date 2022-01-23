import os
import time
from dotenv import load_dotenv

load_dotenv()

#################################################################################################
#################################################################################################
##                                                                                             ##
##                               Implementing a class for a Reddit                             ##
##                                     scraper using praw                                      ##
##                                                                                             ##
#################################################################################################
#################################################################################################

import praw

class Reddit():

  def __init__(self):

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

    self.reddit = praw.Reddit(client_id = os.getenv('reddit_client_id'),
                              client_secret = os.getenv('reddit_client_secret_key'),
                              # username = '', unnecessary as it is a read-only app
                              # password = '', as per above
                              user_agent = os.getenv('reddit_user_agent'))

    self.dictionary = []
    self.cardinality = 0

  def scrape(self):

    for subreddit in self.source:
      threads = self.reddit.subreddit(subreddit[0]).search(subreddit[1], sort='hot', limit=subreddit[2])
      sub_idx = 0

      for submission in threads:
        if not submission.stickied:
          submission.comments.replace_more(limit=0)
          sub_idx += 1

          print('Subreddit: r/{}\n> Thread n.{} ({}): {}'.format(subreddit[0], sub_idx, submission.link_flair_text, submission.title))
          print(50*'-')

          for comment in submission.comments.list():
            print('  Cardinality: {}\n  Parent ID = {}\n  Comment ID = {}\n  "{}"\n'.format(self.cardinality, comment.parent(), comment.id, comment.body))
            self.dictionary.append({"text": str(comment.body), "sentiment": None})
            self.cardinality += 1

          print(50*'-')
          print('\n\n')

#################################################################################################
#################################################################################################
##                                                                                             ##
##                             Implementing a class for a Facebook                             ##
##                                scraper using facebook-scraper                               ##
##                                                                                             ##
#################################################################################################
#################################################################################################

from facebook_scraper import get_posts

class Facebook():

  def __init__(self):

    self.source = [[None, '1650533981900983', 'IngegeriadelSuicidio', 250],
                   [None, 'AIRIricerca', 'AIRIricerca', 250],
                   [None, '249682435410750', 'Matematica&Fisica', 150],
                   [None, '355149558279538', 'GruppodiMatematica', 150],
                   ['saporedimale', None, 'SaporediMale', 100],
                   ['liberonews', None, 'Libero', 100]]

    self.dictionary = []
    self.posts = 1
    self.cardinality = 0

  def scrape(self):

    for page in self.source:

      print(50*'-')
      print('  PAGE: {}'.format(page[2]))
      print(50*'-')

      for post in get_posts(account=page[0], group=page[1], pages=2, cookies="from_browser", options={"comments": True, "allow_extra_requests": True, "posts_per_page": page[3]}):

        print('\n*************\n* Cardinality: {}\n*************\n*************\n* Post n: {}\n*************\n\n  Post: {}\n\n    Comments:\n'.format(self.cardinality, self.posts, post['text']))
        self.posts += 1
        
        for comment in list(post['comments_full']):
          time.sleep(0.250)
          print('    {}'.format(comment.get('comment_text')))
          self.dictionary.append({"text": str(comment.get('comment_text')), "sentiment": None})
          self.cardinality += 1
          
          for reply in list(comment['replies']):
            time.sleep(0.250)
            print('    {}'.format(reply.get('comment_text')))
            self.dictionary.append({"text": str(comment.get('comment_text')), "sentiment": None})
            self.cardinality += 1    