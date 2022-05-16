const knex = require("../db/connection");
const TABLE = "tables";

const list = () => {
  return knex(TABLE)
          .select("*")
          .orderBy("table_name")
};

const read = (table_id) => {
  return knex(TABLE)
          .select("*")
          .where({ table_id })
          .then(resList => resList[0]);
};

const create = (body) => {
  return knex(TABLE)
    .insert(body)
    .returning("*")
    .then((createdRecords) => createdRecords[0])
    .then((table) => read(table.table_id));
};

const update = (table_id, updateBody) => {

  return knex(TABLE)
          .select("reservation_id")
          .where({table_id})
          .update(updateBody, "reservation_id")
}

const destroy = (table_id) => {
  return knex(TABLE)
          .select("reservation_id")
          .where({table_id})
          .update({reservation_id: null}, "reservation_id")
}

module.exports = {
  list,
  create,
  read,
  update,
  delete: destroy
};
