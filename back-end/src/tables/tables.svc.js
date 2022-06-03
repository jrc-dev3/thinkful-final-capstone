const knex = require("../db/connection");
const TABLE = "tables";

const list = () => {
  return knex(TABLE).select("*").orderBy("table_name");
};

const read = (table_id) => {
  return knex(TABLE).select("*").where({ table_id }).first();
};

const create = (body) => {
  return knex(TABLE)
    .insert(body)
    .returning("*")
    .then((createdRecords) => createdRecords[0])
    .then((table) => read(table.table_id));
};

const update = (table_id, updateBody) => {

  const {reservation_id} = updateBody
  return knex
    .transaction((trx) => {
      knex(TABLE)
        .where({ table_id })
        .update({ reservation_id }, "*")
        .transacting(trx)
        .then(() =>
          knex("reservations")
            .where({ reservation_id })
            .update({ status: "seated" }, "*")
            .transacting(trx)
        )
        .then(trx.commit)
        .catch(trx.rollback);
    })
};

const destroy = (table_id, reservation_id) => {

  return knex
    .transaction((trx) => {
      knex(TABLE)
        .where({ table_id })
        .update({ reservation_id: null }, "*")
        .transacting(trx)
        .then(() =>
          knex("reservations")
            .where({ reservation_id })
            .update({ status: "finished" }, "*")
            .transacting(trx)
        )
        .then(trx.commit)
        .catch(trx.rollback);
    })
};

module.exports = {
  list,
  create,
  read,
  update,
  delete: destroy,
};
