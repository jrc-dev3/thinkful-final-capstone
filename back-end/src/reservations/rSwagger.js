module.exports = {
  "paths": {
    "/reservations": {
      "get": {
        "tags": ["Reservations"],
        "summary": "Gets all unfinshed reservations in system",
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/Reservations"
            }
          }
        }
      },
      "post": {
        "tags": ["Reservations"],
        "summary": "Create a reservation in system",
        "responses": {
          "201": {
            "description": "Created",
            "schema": {
              "$ref": "#/definitions/Reservation"
            }
          }
        }
      },
    },
    "/reservations/{reservation_id}": {
      "parameters": [
        {
          "name": "reservation_id",
          "in": "path",
          "required": true,
          "description": "ID of the reservation to edit.",
          "type": "integer"
        }
      ],
      "get": {
        "tags": ["Reservations"],
        "summary": "Gets specified reservation.",
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/Reservation"
            }
          }
        }
      },
      "put": {
        "tags": ["Reservations"],
        "summary": "Updates specified reservation with sent body.",
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/Reservation"
            }
          }
        }
      },
    },
    "/reservations/{reservation_id}/status": {
      "parameters": [
        {
          "name": "reservation_id",
          "in": "path",
          "required": true,
          "description": "ID of the reservation to edit.",
          "type": "integer"
        }
      ],
      "put": {
        "tags": ["Reservations"],
        "summary": "Updates specified reservation with sent body.",
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/Reservation"
            }
          }
        }
      },
    }
  },
  "definitions": {
    "Reservation":{
      "required": ["table_name", "capacity"],
      "properties": {
        "table_name":{
          "type": "string",
          "uniqueItems": true
        },
        "capacity": {
          "type": "number"
        }
      }

    },
    "Reservation": {
      "required": ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"],
      "properties": {
        "first_name": {
          "type": "string",
        },
        "last_name": {
          "type": "string"
        },
        "mobile_number": {
          "type": "string"
        },
        "reservation_date": {
          "type": "string",
        },
        "reservation_time": {
          "type": "string",
        },
        "people": {
          "type": "number"
        }
      }
    },
    "Reservations":{
      "type": "array",
      "$ref": "#/definitions/Reservation"
    }
  }
}