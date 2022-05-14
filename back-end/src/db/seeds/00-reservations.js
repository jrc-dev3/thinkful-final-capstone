const dummyData = require("../seeds/00-reservations.json");

// exports.seed = function(knex, Promise) {

// };

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(() =>
      knex("reservations").insert(
        dummyData.map(
          ({
            first_name,
            last_name,
            mobile_number,
            reservation_date,
            reservation_time,
            people,
          }) => {
            return {
              first_name,
              last_name,
              mobile_number,
              reservation_date,
              reservation_time,
              people,
            };
          }
        )
      )
    );
};
