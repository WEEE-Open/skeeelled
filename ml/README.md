# Information of the dataset

The _ITA-Dataset.json_ is used for fine-tuning the transformer model. It consists of almost 70.000 entries divided in
- 14.457 comments scraped from **Facebook's groups** 
- 55.421 comments scraped from **Reddits' threads**

Performance of [Neuraly](https://huggingface.co/neuraly/bert-base-italian-cased-sentiment) against the n=1497 labeled samples

- correct                      = 8.478%
- incorrect (originally toxic) = 88.16% [false positives, n=549]
- incorrect (originally non-t) = 93.46% [false negatives, n=949]
- real time elapsed = 20 hours