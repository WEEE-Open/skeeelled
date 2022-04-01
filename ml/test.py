import numpy as np
import pandas as pd
import torch
import json
import os

from Modali import infer

comment = str("Mi Piaci. Ti Amo")
sample = comment.replace("[", "").replace("]", "").replace('\\n', ' ').replace('\\', ' ').replace("'", ""). replace('"', '')
lebel = infer(sample)