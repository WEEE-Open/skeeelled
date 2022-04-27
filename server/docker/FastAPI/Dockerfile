# syntax=docker/dockerfile:1
FROM python:3.9
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY ./fastAPI/requirements.txt ./
RUN pip install -r requirements.txt
COPY ./docker/fastAPI/entrypoint.sh /
ENTRYPOINT ["sh", "/entrypoint.sh"]