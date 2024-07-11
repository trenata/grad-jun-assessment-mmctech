# Music Library App

This is a full-stack music library application built with Vue.js, Node.js and MongoDB.


# Installation

## Navigate to both the server and client directory
```
cd server
cd client
```

## Install dependencies in both directories
```
npm install
```


# Setup

## Create a .env file in the server directory with the follwoing structure
```
PORT = [SERVER_PORT]
MONGODB_URL = mongodb://127.0.0.1:[MONGODB_PORT]/
MONGODB_DB_NAME = [DATABASE_NAME]
```

## Create a .env file in the client directory with the follwoing structure
```
VUE_APP_URL=http://localhost:[SERVER_PORT]
```


# Run

## In server directory run server
```
nodemon index
```

## In client directory run client
```
npm run serve
```
