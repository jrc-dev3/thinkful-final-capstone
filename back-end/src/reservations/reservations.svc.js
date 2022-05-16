const knex = require("../db/connection");
const TABLE = "reservations";

const list = (reservation_date) => {
  return knex(TABLE)
    .select("*")
    .where({
      reservation_date,
    })
    .orderBy("reservation_time");
};

const read = (reservation_id) => {
  return knex(TABLE).select("*").where({ reservation_id }).then(resList => resList[0]);
};

const create = (body) => {
  return knex(TABLE)
    .insert(body)
    .returning("*")
    .then((createdRecords) => createdRecords[0])
    .then((rec) => read(rec.reservation_id));
};

module.exports = {
  list,
  create,
  read
};
