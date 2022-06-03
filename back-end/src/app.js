const path = require("path");

//require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors")
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");
const app = express();

//Cors + JSON Parser
app.use(express.json());
app.use(cors());

//Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerDocs = require("./swagger")
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//Routes
app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);

//Misc
app.use(notFound);
app.use(errorHandler);

module.exports = app;
