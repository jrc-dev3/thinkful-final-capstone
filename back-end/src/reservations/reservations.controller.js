const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const resSvc = require("./reservations.svc");

const validateQuery = (req,res,next) => {
  const { date } = req.query

  if(date){
    res.locals.date = date
    return next()
  }

  next({
    status: 400,
    message: "Missing date URL Parameter."
  })

}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  console.log("GET", req.url, req.query);

  const date = res.locals.date
  const data = await resSvc.list(date);

  res.json({
    data,
  });
}

const add = async (req, res) => {
  console.log("POST", req.url, req.body);

  const body = req.body;
  const data = await resSvc.create(body);

  res.status(201).json({
    data,
  });
};

module.exports = {
  list : [validateQuery, asyncErrorBoundary(list)],
  add,
};
