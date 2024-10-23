<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Verdict OJ Dispatcher

Getting Started with Verdict OJ Backend
## Prerequisites
- Node.js (v20)
- Docker (for Redis and PostgreSQL)
- PostgreSQL or other relational datbase (for hosting database)
- Redis

If you have already set up Redis and the database for Backend, use the same variable.
#### 1. Clone the Repository
```bash
git clone https://github.com/nathang0147/verdict-oj
cd verdict-oj/backend
```
#### 2. Environment Setup
- Create a `.env` file based on the example below. Customize the variables to match your environment setup.
- Here i'm using Azure cache for Redis, Supabase for database.
- Remember! If you change variable in `.env`, you must make change  in `src/configs/env/configuration.config.ts`

Example `.env` for dispatcher
```bash

NODE_ENV=development# development | production

PORT=4000 

#demo database
DB_PORT= //fill with your own db
DB_HOST=//fill with your own db
DB_USERNAME=//fill with your own db
DB_PASSWORD=//fill with your own db
DB_NAME=postgres
DB_URI=//fill with your own db

#JWT setup
JWT_ACCESS_TOKEN_EXPIRATION_TIME= //fill with your own number
JWT_REFRESH_TOKEN_EXPIRATION_TIME= //fill with your own number

#Redis setup
REDIS_PORT=6379
REDIS_SSL_PORT=6380
AZURE_CACHE_FOR_REDIS_HOST_NAME= //change it or deploy yourself
REDIS_SERVICE_PRINCIPAL_ID= //change it or deploy yourself
KEY_ACCESS= //change it or deploy yourself


PAGINATION_PER_PAGE= 10

//Judger verdict
CODE_TMP_BASEDIR=tmp
CODE_TMP_FILENAME=Main
TIMEOUT=5000
OUTPUT_MAXLENGTH=1024
JAVASCRIPT_EXECUTABLE=node
CLIKE_COMPLILER_EXECUTABLE=clike_compiler //THIS WILL BE DEPLOYED LATER
CLIKE_CONTAINER_EXECUTABLE=clike_container //THIS WILL BE DEPLOYED LATER
C_COMPILER=gcc
C_STD=gnu11
CPP_COMPILER=g++
CPP_STD=gnu++14
C_SUFFIX=c
CPP_SUFFIX=cpp
```
#### 3. Run Dispatcher Locally
1. Install dependencies:

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
The Dispatcher service should now be running on http://localhost:4000. (or any port you changed before)

#### 4. Running PostgreSQL and Redis Locally via Docker
To run PostgreSQL and Redis locally:

PostgreSQL:
```
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=verdict_db -p 5432:5432 -d postgres:latest
```
Redis:
```
docker run --name redis -p 6379:6379 -d redis:latest
```
#### 5. Hosting dispatch
1. Build Docker Image:

```
docker build -t your_dockerhub_username/verdict-oj-backend .
```
2. Push Image to Docker Hub:

```
docker push your_dockerhub_username/verdict-oj-backend
```
3. Deploy to Cloud Service: Deploy the Docker image on a cloud platform like **Azure App Service**,**AWS ECS**, or **Google Cloud Run**.

4. Update `.env`: Use the cloud-hosted PostgreSQL and Redis instances in your `.env`:

```
REDIS_HOST=your-redis-host
DB_HOST=your-db-host
```
