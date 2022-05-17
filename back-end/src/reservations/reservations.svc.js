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
  return knex(TABLE)
    .select("*")
    .where({ reservation_id })
    .first()
};

const create = (body) => {
  return knex(TABLE)
    .insert(body)
    .returning("*")
    .then((createdRecords) => createdRecords[0])
    .then((rec) => read(rec.reservation_id));
};

const update = (reservation_id, updateBody) => {
  // return knex.transaction((trx) => {
  //   knex(TABLE)
  //     .select("status")
  //     .where({ reservation_id })
  //     .update({ status }, "*")
  //     .transacting(trx)
  //     .then(() =>
  //       knex("tables")
  //         .select("reservation_id")
  //         .where({ table_id })
  //         .update({ reservation_id }, "*")
  //         .transacting(trx)
  //     )
  //     .then(trx.commit)
  //     .catch(trx.rollback);
  // })
  // .then(console.log)
  // .catch(console.log)

  return knex(TABLE)
          .select("*")
          .where({reservation_id})
          .update(updateBody, "*")
          .then(resList => resList[0])

};

module.exports = {
  list,
  create,
  read,
  update,
};
