// let blankarr = [];
// for (let i = 0; i < 1000; i++) {
//   blankarr.push({
//     name: `deeksha${i}`,
//     email: `test${i + 1}@gmail.com`,
//   });
// }

// console.log(blankarr);



exports.chunkArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

