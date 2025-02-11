/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.ctl");

router
  .route("/:table_id/seat")
  .delete(controller.delete)
  .put(controller.update)

router
  .route("/")
  .get(controller.list)
  .post(controller.create);

module.exports = router;
