# node_backend

[![Build Status](https://travis-ci.com/FuFunG/node_backend.svg?token=zpXnqtuWRQ8B3MmnLpnY&branch=master)](https://travis-ci.com/FuFunG/node_backend)

node_backend build with Node.js and tested with Travis CI.

## Start Server

```bash
npm start
```

## Run Test

```bash
npm test
```

## File Structure

* ./config

store both production and testing database config

* ./routers

control all router and http request (GET, POST, PUT, DELETE)

* ./swagger

swagger config file for showing all [API Structure](https://www.ftfung.com/swagger/)

* ./test

travis CI config for testing all API reqeust
