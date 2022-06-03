const rSwagger = require("./reservations/rSwagger")
const tSwagger = require("./tables/tSwagger")

const paths = {...rSwagger.paths, ...tSwagger.paths}
const definitions = {...rSwagger.definitions, ...tSwagger.definitions}
const base =  {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Restaurant Reservation System API",
    "description": "All endpoints for the application.",
    "license": {
      "name": "MIT",
      "url": "https://opensource.org/licenses/MIT"
    }
  },
  "host": "https://thinkful-capstone-backend.herokuapp.com",
  "basePath": "/",
  "tags": [
    {
      "name": "Reservations",
      "description": "API to create, get, and edit reservations in the system."
    },
    {
      "name": "Tables",
      "description": "API to create, edit and update tables status in the system."
    }
  ],
  "schemes": ["https"],
  "consumes": ["application/json"],
  "produces": ["application/json"]
}

const merged = {...base, paths, definitions}

module.exports = merged