/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.ctl");

router.route("/:reservation_id/status").put(controller.update);

router.route("/:reservation_id").get(controller.read);

router.route("/").get(controller.list).post(controller.create);

module.exports = router;
