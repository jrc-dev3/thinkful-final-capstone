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

const search = (mobile_number) => {
  return knex(TABLE)
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
};

const read = (reservation_id) => {
  return knex(TABLE).select("*").where({ reservation_id }).first();
};

const create = (body) => {
  return knex(TABLE)
    .insert(body)
    .returning("*")
    .then((createdRecords) => createdRecords[0])
    .then((rec) => read(rec.reservation_id));
};

const update = (reservation_id, updateBody) => {

  return knex(TABLE)
    .select("*")
    .where({ reservation_id })
    .update(updateBody, "*")
    .then((resList) => resList[0]);
};

module.exports = {
  list,
  search,
  create,
  read,
  update,
};
