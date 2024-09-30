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
  console.log("users", users)

  while (users.size < count) {
      const name = `${genrateRendomstring(5)} ${genrateRendomstring(7)}`;
      const email = `${genrateRendomstring(10)}@example.com`;
      users.add(JSON.stringify({ name, email }));
  }

  return Array.from(users).map(user => JSON.parse(user));

}


function UniqueUsers(count) {
  const users = [];
  console.log("users" , users)
  let size = 0

  while (size < count) {
      const name = `${generateRandomString(5)} ${generateRandomString(7)}`;
      const email = `${generateRandomString(10)}@example.com`;
      // users.add(JSON.stringify({ name, email }));
      users.push(JSON.stringify({ name, email }));
      size++;
  }

  // return Array.from(users).map(user => JSON.parse(user));
  return users
}





const fs = require('fs');

const createCSV = (numRecords) => {
  const records = [];
  records.push('name,email,address,age,gender'); // CSV header

  for (let i = 0; i < numRecords; i++) {
    const name = `deeksha${i}`;
    const email =`test${i + 1}@gmail.com`;
    const address = `fakeraddress${i}`;
    const age  = Math.floor(Math.random() * (80 - 18 + 1)) + 18;
    const options = ['f', 'M'];
    const gender = options[Math.floor(Math.random() * options.length)];

    records.push(`${name},${email},${address},${age},${gender}`);
  }



  const csvContent = records.join('\n');
  fs.writeFileSync('records.csv', csvContent, 'utf8');
  console.log('CSV file created successfully!');
};

createCSV(100000);
