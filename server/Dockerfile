# syntax=docker/dockerfile:1
FROM python:3.9
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY wtp/requirements.txt ./
RUN pip install -r requirements.txt

