const hasProperties = (arr, obj, next, callbackFn) => {
  for (let requiredProp of arr) {
    const val = obj[requiredProp];
    if (!val) return next({ status: 400, message: `${requiredProp}` });
  }

  callbackFn()
};

module.exports = hasProperties;
