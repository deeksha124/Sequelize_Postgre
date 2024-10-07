const { Tutorial, User, Userinfo } = require("../models/csvModel");
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

// exports.importBulkDatafromCSV = async (req, res) => {
//   try {
//     if (req.file === undefined) {
//       return res.status(400).send("Please upload a CSV file!");
//     }

//     const path = basedir + "/uploads/" + req.file.filename;

//     // Read the CSV file using the reusable function
//     const results = await helper.readfile(path);
//     console.log("Results:", results);

//     for (let item of results) {
//       console.log("item.email:", item.email);
//       let user = await User.findOne({ where: { email: item.email } });

//       if (!user) {
//         user = await User.create({
//           name: item.name,
//           email: item.email,
//           age: item.age,
//           gender: item.gender,
//         });

//         user = await Userinfo.create({
//           address: item.address,
//           city: item.city,
//           zip: item.zip,
//           state: item.state,
//           country: item.country,
//           latitude: item.latitude,
//           longitude: item.longitude,
//           userId: user.id,
//         })
//       } else {
//         user = await Userinfo.create({
//           address: item.address,
//           city: item.city,
//           zip: item.zip,
//           state: item.state,
//           country: item.country,
//           latitude: item.latitude,
//           longitude: item.longitude,
//           userId: user.id,
//         })
//         // console.log(`User with email ${item.email} already exists. Skipping creation.`);
//         // continue;
//       }

//       // if (item.userinfo && item.userinfo.trim() !== "") {
//       //   try {
//       //     const userInfoArray = JSON.parse(item.userinfo);
//       //     console.log("userInfoArray:", userInfoArray);

//       //     for (const userinfo of userInfoArray) {
//       //       if (
//       //         !userinfo.address ||
//       //         !userinfo.city ||
//       //         !userinfo.zip ||
//       //         !userinfo.state ||
//       //         !userinfo.country
//       //       ) {
//       //         continue;
//       //       }

//       //       await Userinfo.create({
//       //         address: userinfo.address,
//       //         city: userinfo.city,
//       //         zip: userinfo.zip,
//       //         state: userinfo.state,
//       //         country: userinfo.country,
//       //         latitude: userinfo.latitude,
//       //         longitude: userinfo.longitude,
//       //         userId: user.id,
//       //       });
//       //     }
//       //   } catch (jsonError) {
//       //     console.error(`Error parsing userInfo for ${item.email}:`, jsonError);
//       //     continue;
//       //   }
//       // } else {
//       //   console.log(`userInfo is undefined or empty for ${item.email}. Skipping UserInfo creation.`);
//       // }
//     }

//     console.log("Data inserted successfully!");
//     res.status(200).send({ message: "Data inserted successfully!" });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send({
//       message: error.message || "Some error occurred while processing the CSV.",
//     });
//   }
// };


// ******************************************************************************************************



exports.importBulkDatafromCSV = async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    const path = basedir + "/uploads/" + req.file.filename;

    // Read the CSV file using the reusable function
    const results = await helper.readfile(path);
    console.log("Results:", results);

    console.log("-----+++-->>>>>",results[0]._0)

    // for (let item in results)
      for(let i = 0; i<results.length;i++) {
      // console.log("item.email:", item.email);
      console.log("item------>>>>" ,i , Object.values(results[i]))
      let Data = Object.values(results[i])
      if(i>0)
      {

      for(let j  =0 ;j<Data.length-4; j++ )
      {
        console.log("=======",Data[j+4])
      }
      }
      // let user = await User.findOne({ where: { email: item.email } });

      // if (!user) {

        // console.log("item.name" ,item.name)
        // console.log("item.email" ,item.email)
        // console.log("item.age" ,item.age)
        // console.log("item.gender" ,item.gender)

        // console.log("item.userinfo" , item.userinfo)

        // let  Data = inputString.split(';')
        // user = await User.create({
        //   name: item.name,
        //   email: item.email,
        //   age: item.age,
        //   gender: item.gender,
        // });

        // user = await Userinfo.create({
        //   address: item.address,
        //   city: item.city,
        //   zip: item.zip,
        //   state: item.state,
        //   country: item.country,
        //   latitude: item.latitude,
        //   longitude: item.longitude,
        //   userId: user.id,
        // })
      // } else {
        // user = await Userinfo.create({
        //   address: item.address,
        //   city: item.city,
        //   zip: item.zip,
        //   state: item.state,
        //   country: item.country,
        //   latitude: item.latitude,
        //   longitude: item.longitude,
        //   userId: user.id,
        // })
        // console.log(`User with email ${item.email} already exists. Skipping creation.`);
        // continue;
      // }

      // if (item.userinfo && item.userinfo.trim() !== "") {
      //   try {
      //     const userInfoArray = JSON.parse(item.userinfo);
      //     console.log("userInfoArray:", userInfoArray);

      //     for (const userinfo of userInfoArray) {
      //       if (
      //         !userinfo.address ||
      //         !userinfo.city ||
      //         !userinfo.zip ||
      //         !userinfo.state ||
      //         !userinfo.country
      //       ) {
      //         continue;
      //       }

      //       await Userinfo.create({
      //         address: userinfo.address,
      //         city: userinfo.city,
      //         zip: userinfo.zip,
      //         state: userinfo.state,
      //         country: userinfo.country,
      //         latitude: userinfo.latitude,
      //         longitude: userinfo.longitude,
      //         userId: user.id,
      //       });
      //     }
      //   } catch (jsonError) {
      //     console.error(`Error parsing userInfo for ${item.email}:`, jsonError);
      //     continue;
      //   }
      // } else {
      //   console.log(`userInfo is undefined or empty for ${item.email}. Skipping UserInfo creation.`);
      // }
    }

    console.log("Data inserted successfully!");
    res.status(200).send({ message: "Data inserted successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: error.message || "Some error occurred while processing the CSV.",
    });
  }
};






// ==============================================================================================================



// let data = "Address: 890 Pine St, City: Greenwood, Zip: 67890, State: IN, Country: USA, Latitude: 99998, Longitude: 0004; Address: 112 Birch Rd, City: Greenwood, Zip: 67890, State: IN, Country: USA, Latitude: 99998, Longitude: 0005";

// // Split the data into separate entries using the semicolon as a delimiter
// let entries = data.split(";");

// // Map each entry to an object with properties
// let structuredData = entries.map(entry => {
//     // Trim whitespace and split by comma to get individual fields
//     let fields = entry.split(",").map(field => field);
//     console.log("=======",fields[0].Address)
//     let entryObj = {};
    
//     // Loop through fields to populate the entry object
//     fields.forEach(field => {
//         let [key, value] = field.split(":").map(part => part.trim());
//         entryObj[key] = value; // Assign key-value pairs to the object
//     });

//     return entryObj; // Return the populated entry object
// });

// // Accessing the values
// structuredData.forEach((item, index) => {
//     console.log(`Entry ${index + 1}:`);
//     console.log(`Address: ${item['Address']}`);
//     console.log(`City: ${item['City']}`);
//     console.log(`Zip: ${item['Zip']}`);
//     console.log(`State: ${item['State']}`);
//     console.log(`Country: ${item['Country']}`);
//     console.log(`Latitude: ${item['Latitude']}`);
//     console.log(`Longitude: ${item['Longitude']}`);
//     console.log('-------------------------');
// });
