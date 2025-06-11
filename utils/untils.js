function isStringNumber(str) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

function isNumber(value) {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

const getSumFromTransaction = (array) => {
  const sum = array?.reduce((acc, item) => {
    if (isNumber(item.amount)) {
      return (acc += item.amount);
    }
  }, 0);
  return sum;
};

module.exports = {
  getSumFromTransaction,
};
