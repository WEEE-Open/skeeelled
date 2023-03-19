# syntax=docker/dockerfile:1
FROM python:3.9-slim-buster

ENV PYTHONUNBUFFERED=1

WORKDIR /server/src
COPY ./src/requirements.txt /server/src/
COPY ./docker/FastAPI/entrypoint.sh /

RUN  apt-get -y update
RUN  apt-get -y install libmagic1

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ENTRYPOINT ["sh", "/entrypoint.sh"]