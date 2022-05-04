# syntax=docker/dockerfile:1
FROM python:3.9-slim-buster

ENV PYTHONUNBUFFERED=1

WORKDIR /src
COPY ./requirements.txt ./
COPY ./docker/FastAPI/entrypoint.sh /

RUN pip install -r requirements.txt

ENTRYPOINT ["sh", "/entrypoint.sh"]