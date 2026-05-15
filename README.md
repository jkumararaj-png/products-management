# Products Management Case Study

A full-stack application with JWT authentication and product CRUD operations.

## Setup

### Backend

cd backend\
npm i\
cp .env.example .env

# Fill in your .env values

node seedUser.js\
node seedProducts.js\
node server.js

### Frontend

cd frontend\
npm i\
cp .env.example .env\
npm run dev

## Test Credentials

Email: test@test.com\
Password: test

## API Endpoints

POST /user/register\
POST /user/login\
GET /products (protected)\
GET /products/:id (protected)\
POST /products (protected)\
PATCH /products/:id (protected)\
DELETE /products/:id (protected)
