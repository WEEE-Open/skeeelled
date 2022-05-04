<img src=".readme/skeeelled.svg" alt="skeeelled logo" height="150">

[![Lint](https://github.com/WEEE-Open/skeeelled/actions/workflows/linter.yml/badge.svg?branch=master)](https://github.com/WEEE-Open/skeeelled/actions/workflows/linter.yml)
[![CD](https://github.com/WEEE-Open/skeeelled/actions/workflows/cd.yml/badge.svg?branch=master)](https://github.com/WEEE-Open/skeeelled/actions/workflows/cd.yml)

A tutoring web platform which allows professors and students to collaborate:  
- **professors** can post exam questions, exercises, and give advice to students  
- **students** can answer questions, rate each other's answers, and simulate exams.

## How to develop

This repository is structured in the following way:
- a `client` directory for the ReactJS frontend
- an `ml` directory for the PyTorch auto-moderation ML pipelines
- a `server` directory for the FastAPI backend

You can run the whole package in one command: 
```bash
docker compose up -d
```
after having installed [Docker Desktop](https://www.docker.com/products/docker-desktop/) on your macOS or Windows machine, or the `docker.io` package on your Linux machine.  
This command will bring up all the necessary Docker containers that are needed to run the project in development mode, plus some bonuses, exposed to you as follows:

| Service                                             | Address                                |
|-----------------------------------------------------|----------------------------------------|
| ReactJS Frontend Client                             | http://localhost:3000                  |
| Backend APIs                                        | http://localhost:8000/v1               |
| Backend APIs Documentation                          | http://localhost:8000/docs             |
| Mongo Express web UI for MongoDB                    | http://localhost:8081                  |
| Backend APIs (reverse proxied by nginx)             | http://localhost/v1                    |
| Backend static resources (reverse proxied by nginx) | http://localhost/static                |
| MongoDB                                             | mongodb://root:example@localhost:27017 |

It may be useful using the Docker Desktop dashboard to open a container's service port directly or to follow a specific container's logs, as shown below:

| Containers                                                                  | Single Container Logs                                                        |
|-----------------------------------------------------------------------------|------------------------------------------------------------------------------|
| ![Docker Desktop containers](.readme/screenshot_docker_desktop_compose.png) | ![Docker Desktop container logs](.readme/screenshot_docker_desktop_logs.png) |

If you're on Linux, [lazydocker](https://github.com/jesseduffield/lazydocker) is an excellent CLI alternative to display the same kind of information.

### `client`

To develop the client stand-alone:  

0. Install [Node.js](https://nodejs.org/en/) 
1. `cd client`
2. `npm i`
3. `npm start`

If you intend to commit any changes, please also run `npm i` in the root (`skeeelled`) directory, so that the git pre-commit hooks can run correctly.  
At the moment we have configured husky to lint all the files residing in the `client` directory with `prettier`.  
All your changed files should be properly linted by this procedure to avoid unnecessary merge conflicts.

The latest commit to the `master` branch gets automatically deployed to our staging instance [👉 here 👈](https://weee-open.github.io/skeeelled).

### `server`

To develop the backend, we recommend to run `docker-compose up -d` as suggested above, since both MongoDB and FastAPI are required, and Mongo Express may be useful.

If you really want to go down the FastAPI stand-alone route (and note that you will have to run a MongoDB instance separately), you can run the following commands:  

0. Install [Python](https://www.python.org/downloads/)
1. `cd server`
2. `python3 -m venv venv`
3. `source venv/bin/activate` (or `source venv\Scripts\activate` on Windows)
4. `pip install -r requirements.txt`
5. `uvicorn main:app --host=0.0.0.0 --reload`

If you're using PyCharm Professional, I suggest you to add this configuration:

| Edit Configurations                                                                | Add Configuration                                                              |
|------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| ![PyCharm edit configurations](.readme/screenshot_pycharm_edit_configurations.png) | ![PyCharm add configuration](.readme/screenshot_pycharm_add_configuration.png) |

The APIs documentation is made automatically available by FastAPI at http://localhost:8000/docs, but if you want to add any details you are free to do so by adding a docstring such as:
```py
@app.get("/v1")
def index():
    """
    This API lets you test if the backend is working properly.
    This is an info docstring that will also appear at the Swagger link.
    """
    return {"msg": "You successfully reached API v1"}
```

### `ml`

A machine-learning model is deployed to automatically monitor and moderate the comment activity of each post. Its primary objective is __to prevent users to abuse the forum by posting profanity, blasphemy, hate-speech toxic content in the comments section__. This is achieved by performing _Sentiment Analysis_, a common form of text classification used in _Natural Language Processing_ (an interdisciplinary subset of Machine Learning) where one of multiple sentiment labels (e.g. anger, fear, joy etc...) is inferred by the model based on the content of the text. 

The resulting mini-library called `Modalii - Moderatore Automatico per le Lingue Italiana & Inglese` uses the [HuggingFace Transformers](https://huggingface.co/docs/transformers/index) library in order to assemble the full pipeline of the moderator. The models hosted in the library are imported locally and fine-tuned on purposely-built datasets for toxicity detection in STEM-oriented comments.

#### Pipeline
Given an input string, representing the __comment__ to be classified, the library offers a high-level `infer` function to retrieve its __sentiment__

| Full-input pipeline                                                                   |
|---------------------------------------------------------------------------------------|
|__comment__ ➡️ `Polyglot` ➡️ `ProfanityDetector` ➡️ `ToxicityDetector` ➡️ __sentiment__|

The `Modalii` library uses a binary-classification paradigm where a normalised __score__ variable represents the above __sentiment__ and contains the degree of toxicity detected within the comment. The actions taken by the library are either to `pass` the comment or to `quarantine` it according to a specific _banning policy_ acting on __score__ as returned by the pipeline.
The `Polyglot` model is a [language identification](https://huggingface.co/papluca/xlm-roberta-base-language-detection) class which discern the language with which the comment is written (either __english__, __italian__ or __neither__). According to which language is identified a `ProfanityDetector` class is instantiated which is a simple Bag of Words (BoW) model, based on two language-specific vocabularies, that detects the presence of any blasphemic word and automatically bans the comment. Finally, if the comments passes the `purity_check` performed by the latter, a `ToxicityDetector` class takes care of the last hate-speech/toxicity assessment. This step is also language-specific with one model for the [italian](https://huggingface.co/Hate-speech-CNERG/dehatebert-mono-italian) language and another for the [english](https://huggingface.co/martin-ha/toxic-comment-model) language. While the latter is used _"as is"_, the former is fine-tuned on an ad-hoc built and manually labelled dataset (see __Datasets__ section) using the `train` high-level function provided by the library

| Training pipeline                             |
|-----------------------------------------------|
|`Builder` ➡️ `Reddit` ➡️ `Facebook` ➡️ `Loader`|

We remark that correct use of the library's APIs is to instantiate the function on _string_ variables. Should the user want to use `infer` on a dataset (either `.csv`, `.json` etc...) then a miminalistic pre-processing (not provided by the library) is required. An example of such action is given in `test.py`.

#### Transformers
Both the `Polyglot` and the two language-specific `ToxicityDetector`s classes are based on HuggingFace hosted [Transformers](https://huggingface.co/docs/transformers/philosophy). Simply put a `Transformer`, in the context of deep-learning, is a combination of two mechanics:
* A _Sequence-2-Sequence_ translation of the input text (also known as encoder-decoder architecture);
* An _Attention mechanism_ that focuses the important keywords of a given input sequence.
For our purposes we identify each hosted model with:
* a `Tokenizer` which takes the input text and vectorise it (according to a pre-defined dictionary) to make it digestible for the input layer of neural network;
* a `Classifier` that elaborates the input through the _Attention_ mechanism discussed above and returning a vector with the probabilities of each label.
These deep neural networks are very large architectures that revolutionised the world of automatic text interaction, including the tasks required by common-days chatbots, translators, word masking etc...
The reader might refer to this well-written [article](https://medium.com/inside-machine-learning/what-is-a-transformer-d07dd1fbec04) for a preliminary but thorough introduction to the architecture.

#### Datasets
We previously mentioned that `Modalii` comes with a secondary high-level `train` function that provides a straight-forward fine-tuning facility for the italian `ToxicityDetector` model. The fine-tuning is performed on a specific dataset that is composed by `Reddit`'s threads and `Facebook` groups scraped comments. The `Builder` class is automatically instantiate by the training pipeline if neither `ITA-Dataset.json` not `ENG-Dataset.json` are present in the top-level directory (where `Modalii.py` is located); such class scrapes both `Reddit` and `Facebook` comments found in the __Subreddits__ and __Groups__ (respectively) that are specified by the `source` variable in the _initialiser_ of each class. The user can change those to her/his own liking to build a separate dataset (notice that the new scraped dataset will not be automatically labelled). Finally the `Loader` class takes care of the interaction with the scraped `.json` dataset and the HuggingFace Transformer model.

To be able to use the `Builder` class the user must have both a Reddit and Facebook active account. The `Facebook` class is based on the [facebook-scraper](https://github.com/kevinzg/facebook-scraper) library and uses the `get_posts` API to retrieve all the comments in the posts of the groups specified in the `source` variable. The user must ensure to be logged it to her/his account to use the library as no further action are required. On the contrary the `Reddit` class is based on [praw](https://praw.readthedocs.io/en/stable/) which required the `reddit_client_id`, `reddit_client_secret_key` and `reddit_user_agent` to be manually input in its instance. Those are imported from a `.env` file in which they are specified. The user can retrieve those by creating an app on the bottom button [here](https://www.reddit.com/prefs/apps), name it as it likes, and using the information provided there

| `.env`                                                   |
|----------------------------------------------------------|
|reddit_client_id = 'code-you-find-below-username'         |
|reddit_client_secret_key = 'code-you-find-on-"secret"-tab'|
|reddit_user_agent = 'name-you-gave-to-the-app'            |

Also the training is performed using the [Weights & Biases](https://wandb.ai/site) monitoring tool. To be able to use that the user must create an account with the library and retrieve its [API key](https://docs.wandb.ai/guides/track/public-api-guide)

| `.env`                                 |
|----------------------------------------|
|api_key = 'wand-key-given-on-the-prompt'|
