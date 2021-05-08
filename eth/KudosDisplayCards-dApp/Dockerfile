FROM ubuntu:latest
RUN apt-get update && apt-get install nodejs npm -y
RUN mkdir /code
COPY . /code
WORKDIR /code
run npm -g install npm
RUN apt-get install git build-essential -y
RUN npm i
ENTRYPOINT ['npm','start']
