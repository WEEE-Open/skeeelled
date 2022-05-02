# Dataset

The _ITA-Dataset.json_ is used for fine-tuning the transformer model. It consists of almost 70.000 entries divided in
- 14.457 comments scraped from **Facebook's groups** 
- 55.421 comments scraped from **Reddits' threads**

# Hyper-parameters selection

Both models are BERT-based.

## Italian fine-tuned 
[De-hate-BERT](https://huggingface.co/Hate-speech-CNERG/dehatebert-mono-italian/blob/main/config.json).

## English fine-tuned 
[Toxic-comment-model](https://huggingface.co/martin-ha/toxic-comment-model/blob/main/config.json).

# Models' performances

Performance of [Neuraly](https://huggingface.co/neuraly/bert-base-italian-cased-sentiment) against n=1497 labeled samples of the dataset

- correct                      = 28.17%
- incorrect (originally toxic) = 63.57% [false positives, n=549]
- incorrect (originally non-t) = 76.60% [false negatives, n=949]

Performance of [Dehatebert](https://huggingface.co/Hate-speech-CNERG/dehatebert-mono-italian) against n=1497 labeled samples of the dataset

- correct                      = 66.95%
- incorrect (originally toxic) = 30.60% [false positives, n=549]
- incorrect (originally non-t) = 34.45% [false negatives, n=949]

Performance of [Feel-IT](https://huggingface.co/MilaNLProc/feel-it-italian-sentiment) against n=1497 labeled samples of the dataset

- correct                      = 47.79%
- incorrect (originally toxic) = 07.10% [false positives, n=549]
- incorrect (originally non-t) = 78.29% [false negatives, n=949]