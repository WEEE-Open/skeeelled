# syntax=docker/dockerfile:1
FROM python:3.9-slim-buster

ENV PYTHONUNBUFFERED=1

WORKDIR /code
COPY ./requirements.txt ./
RUN pip install -r requirements.txt
COPY ./docker/FastAPI/entrypoint.sh /

ENTRYPOINT ["sh", "/entrypoint.sh"]