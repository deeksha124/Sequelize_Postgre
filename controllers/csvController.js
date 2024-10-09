const { Tutorial, User, Userinfo } = require("../models/csvModel");
const sequelize = require("../config/config");
const { Sequelize } = require("sequelize");
// const Tutorial = db;
const helper = require("../helper/helper");

exports.uploadDataCSV = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    let tutorials = [];
    let path = basedir + "/uploads/" + req.file.filename;
    console.log("path------------>>>>>>>", path);

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        tutorials.push(row);
        console.log("tutorials----->>>>", tutorials);
      })
      .on("end", () => {
        Tutorial.bulkCreate(tutorials)
          .then(() => {
            res.status(200).send({
              message:
                "Uploaded the file successfully: " + req.file.originalname,
            });
          })
          .catch((error) => {
            console.log("error---->>", error);
            res.status(500).send({
              message: "Fail to import data into database!",
              error: error.message,
            });
          });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

exports.getTutorials = (req, res) => {
  Tutorial.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// exports.importBulkDatafromCSV = async(req , res)=>{
//   try {
//     if (req.file == undefined) {
//       return res.status(400).send("Please upload a CSV file!");
//     }

//     let results = [];
//     let path  =  basedir + "/uploads/" + req.file.filename;
//     fs.createReadStream(path)
//     .pipe((csv.parse({ headers: true })))
//     .on('data', (data) => results.push(data) )

//     .on('end', async () => {
//       try {
//           // await sequelize.sync(); // Ensure models are in sync with the database
//           console.log("results" ,results)

//           for (const item of results) {
//               // Create a User record
//               const user = await User.create({
//                   name: item.name,
//                   email: item.email,
//                   age: item.age,
//                   gender: item.gender,

//               });

//               // // Create a UserInfo record associated with the user
//               // await Userinfo.create({
//               //     address: item.address,
//               //     age: parseInt(item.age),
//               //     gender: item.gender,
//               //     city : item.city,
//               //     zip : item.zip,
//               //     state : item.state,
//               //     country : item.country,
//               //     userId: user.id, // Link to the created user
//               // });

//                  // Parse userInfo from JSON string
//           const userInfoArray = JSON.parse(item.userInfo);

//           console.log("userInfoArray----" , userInfoArray)

//           // Create UserInfo records for each entry
//           for (const userInfo of userInfoArray) {
//             await Userinfo.create({
//               address: userInfo.address,
//               city: item.city,
//               zip: item.zip,
//               state: item.state,
//               country: item.country,
//               userId: user.id, // Link to the created user
//             });
//           }

//           }
//           console.log('Data inserted successfully!');

//           res.status(200).send({message : "Data inserted successfully!" })
//         }
//           catch (error) {
//             console.error('Error inserting data:', error);
//         }
//     });

//   } catch (error) {
//     console.log(error)
//     res.status(500).send({
//       message :err.message || "Some error occurred while retrieving tutorials."
//     })
//   }
// }

// ******************************************************************************************************

exports.importBulkDatafromCSV = async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    const path = basedir + "/uploads/" + req.file.filename;

    // Read the CSV file using the reusable function
    let results = await helper.readfile(path);


    console.log("results))))" , results)
    const csvTypeLength =  Object.keys(results[0]).length
    console.log("csvtype>>>>>>>>>>" , csvTypeLength)
    if(csvTypeLength > 11){
    await typeTenColumnCSV(results)
    }else{

    await typeMoretoTenColumnCSV(results)
    }
    
    res.status(200).send({ message: "Data inserted successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: error.message || "Some error occurred while processing the CSV.",
    });
  }
};


async function typeTenColumnCSV(results) {
  const transaction = await sequelize.transaction(); // Assuming you have a sequelize instance
  results.shift();
  console.log("Results:------", results);

  let userinfoData = [];
  

  try {
    for (let item of results) {
      let dataArray = Object.values(item);
      let email = dataArray[1];
      console.log("email--||||||||||||||-->>>>", dataArray);

      let user = await User.findOne({ where: { email: email }, transaction });
      console.log("user----", user);

      const address = dataArray[4];
      const city = dataArray[5];
      const zip = dataArray[6];
      const state = dataArray[7];
      const country = dataArray[8];
      const latitude = dataArray[9];
      const longitude = dataArray[10];

      if (!user) {
        user = await User.create({
          name: dataArray[0],
          email: dataArray[1],
          age: dataArray[2],
          gender: dataArray[3],
        }, { transaction });
        console.log("User created:", user);
      }

      userinfoData.push({ address, city, zip, state, country, latitude, longitude, userId: user.id });
      console.log("UserInfoData:", userinfoData);
    }

    console.log("userinfoData-------", userinfoData);
    if (userinfoData.length > 0) {
      await Userinfo.bulkCreate(userinfoData, { transaction });
      console.log("Data inserted successfully!");
    }

    // Commit the transaction if everything is successful
    await transaction.commit();
    return 1;

  } catch (error) {
    console.error("Error processing data:", error);
    await transaction.rollback(); // Rollback transaction on error
    throw error; // Re-throw the error if needed
  }
}

// ******************************************************************************************************




async function typeMoretoTenColumnCSV(results) {
  const transaction = await sequelize.transaction(); // Start a new transaction
  let insertingData = [];

  try {
    for (const item of results) {
      const dataArray = Object.values(item);
      console.log("Data Array:", dataArray);

      // User details
      const [email, name, age, gender] = dataArray;

      // Convert age to an integer
      const ageValue = parseInt(age, 10);
      if (isNaN(ageValue) || ageValue <= 0 || ageValue > 130) {
        console.error(`Invalid age for user ${email}: ${age}`);
        continue; // Skip this user or handle as needed
      }

      console.log("----???????", email, name, age, gender);

      // Create or find user
      let user = await User.findOne({ where: { email }, transaction });

      if (!user) {
        user = await User.create(
          { name, email, age: ageValue, gender },
          { transaction }
        );
        console.log("Created user:", user);
      }

      // Process addresses starting from index 4
      for (let i = 4; i < dataArray.length; i += 7) {
        const address = dataArray[i];
        const city = dataArray[i + 1];
        const zip = dataArray[i + 2];
        const state = dataArray[i + 3];
        const country = dataArray[i + 4];
        const latitude = dataArray[i + 5];
        const longitude = dataArray[i + 6];

        if (address && city && zip && country && latitude && longitude) {
          insertingData.push({
            address,
            city,
            zip,
            state,
            country,
            latitude,
            longitude,
            userId: user.id,
          });
        }
      }
    }

    if (insertingData.length > 0) {
      await Userinfo.bulkCreate(insertingData, { transaction });
    }

    await transaction.commit();
    console.log("Data inserted successfully!");

  } catch (error) {
    console.error("Error processing data:", error);
    await transaction.rollback(); // Rollback transaction on error
  }
}
