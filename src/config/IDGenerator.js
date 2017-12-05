let dateToInt = +new Date();

let getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let generateID = maxLength => {
  let dts = dateToInt.toString();
  let rev = dts.split("").reverse();
  let id = "";

  for (let i = 0; i < maxLength; i++) {
    let index = getRandomInt(0, rev.length - 1);
    id += rev[index];
  }
  return id;
};

let getRandomID = maxLength => {
  return generateID(maxLength);
};

module.exports = getRandomID;
