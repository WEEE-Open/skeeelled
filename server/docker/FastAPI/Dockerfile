# syntax=docker/dockerfile:1
FROM python:3.9-slim-buster

ENV PYTHONUNBUFFERED=1

WORKDIR /src
COPY ./requirements.txt ./
COPY ./docker/FastAPI/entrypoint.sh /

RUN  apt-get -y update
RUN  apt-get -y install gcc pkg-config libxml2-dev libxmlsec1-dev libxmlsec1-openssl

RUN pip install -r requirements.txt
RUN pip install "python-jose[cryptography]"

ENTRYPOINT ["sh", "/entrypoint.sh"]