module.exports = {
  "paths": {
    "/tables": {
      "get": {
        "tags": ["Tables"],
        "summary": "Get all tables in system",
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/Tables"
            }
          }
        }
      },
      "post": {
        "tags": ["Tables"],
        "summary": "Create a table in system",
        "responses": {
          "201": {
            "description": "Created",
            "schema": {
              "$ref": "#/definitions/Table"
            }
          }
        }
      },
    },
    "/tables/{table_id}/seat": {
      "parameters": [
        {
          "name": "table_id",
          "in": "path",
          "required": true,
          "description": "ID of the table to edit.",
          "type": "integer"
        }
      ],
      "put": {
        "tags": ["Tables"],
        "summary": "Occupies selected table for reservation.",
        "responses": {
          "200": {
            "description": "OK",
          }
        }
      },
      "delete": {
        "tags": ["Tables"],
        "summary": "Opens a table in system so it can be used again for other reservations.",
        "responses": {
          "200": {
            "description": "OK",
          }
        }
      },
    }
  },
  "definitions": {
    "Table":{
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
    "Tables":{
      "type": "array",
      "$ref": "#/definitions/Table"
    }
  }
}