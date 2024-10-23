# Verdict OJ Backend

Getting Started with Verdict OJ Backend
## Prerequisites
- Node.js (v20)
- Docker (for Redis and MySQL)
- PostgreSQL or other relational datbase (for hosting database)
- Redis
#### 1. Clone the Repository
```bash
git clone https://github.com/nathang0147/verdict-oj
cd verdict-oj/backend
```
#### 2. Environment Setup
- Create a .env file based on the example below. Customize the variables to match your environment setup.
- Here i'm using Azure cache for Redis, Supabase for database.
- Remember! If you change variable in `.env`, you must make change  in `src/configs/env/configuration.config.ts`

Example .env for Backend
```bash

NODE_ENV=development# development | production

PORT=3000 

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
```
#### 3. Run Backend Locally
1. Install dependencies:

```
npm install
```
2. Start the backend:

```
npm run start:dev
```
The backend service should now be running on http://localhost:3000. (or any port you changed before)

#### 4. Running MySQL and Redis Locally via Docker
To run MySQL and Redis locally:

MySQL:
```
docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=verdict_db -p 3306:3306 -d mysql:latest
```
Redis:
```
docker run --name redis -p 6379:6379 -d redis:latest
```
#### 5. Hosting Backend
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
