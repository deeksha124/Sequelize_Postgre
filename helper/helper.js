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


function genrateRendomstring(length){
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for(let i =0 ; i < length;i++)
  {
    result += characters.charAt(Math.floor(Math.random()* characters.length))
  }
  return result;
}


exports.ranndomUser = (count)=>{
  const users = new Set();

  while (users.size < count) {
      const name = `${genrateRendomstring(5)} ${genrateRendomstring(7)}`;
      const email = `${genrateRendomstring(10)}@example.com`;
      users.add(JSON.stringify({ name, email }));
  }

  return Array.from(users).map(user => JSON.parse(user));

}