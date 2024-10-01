const {Tutorial ,User,Userinfo} = require("../models/csvModel");
// const Tutorial = db;

const fs = require("fs");
const csv = require("fast-csv");
exports.uploadDataCSV = async (req, res) => {
    try {
      if (req.file == undefined) {
        return res.status(400).send("Please upload a CSV file!");
      }
  
      let tutorials = [];
      let path = basedir + "/uploads/" + req.file.filename;
      console.log("path------------>>>>>>>" ,path)
  
      fs.createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {
          tutorials.push(row);
          console.log("tutorials----->>>>" , tutorials)
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

                console.log("error---->>" , error)
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


  exports.importBulkDatafromCSV = async(req , res)=>{
    try {
      if (req.file == undefined) {
        return res.status(400).send("Please upload a CSV file!");
      }

      let results = [];
      let path  =  basedir + "/uploads/" + req.file.filename;
      fs.createReadStream(path)
      .pipe((csv.parse({ headers: true })))
      .on('data', (data) => results.push(data) )
     
     
      .on('end', async () => {
        try {
            // await sequelize.sync(); // Ensure models are in sync with the database
            console.log("results" ,results)

            for (const item of results) {
                // Create a User record
                const user = await User.create({
                    name: item.name,
                    email: item.email,
                });

                // Create a UserInfo record associated with the user
                await Userinfo.create({
                    address: item.address,
                    age: parseInt(item.age), 
                    gender: item.gender,
                    city : item.city,
                    zip : item.zip,
                    state : item.state,
                    country : item.country,
                    userId: user.id, // Link to the created user
                });
            }
            console.log('Data inserted successfully!');

            res.status(200).send({message : "Data inserted successfully!" })
          }
            catch (error) {
              console.error('Error inserting data:', error);
          }
      });

      
    } catch (error) {
      console.log(error)
      res.status(500).send({
        message :err.message || "Some error occurred while retrieving tutorials."
      })
    }
  }
  
  



  
  // exports.importBulkDatafromCSV = async (req, res) => {
  //   try {
  //     if (!req.file) {
  //       return res.status(400).send("Please upload a CSV file!");
  //     }
  
  //     let results = [];
  //     const path = `${basedir}/uploads/${req.file.filename}`;
  
  //     fs.createReadStream(path)
  //       .pipe(csv.parse({ headers: true }))
  //       .on('data', (data) => results.push(data))
  //       .on('end', async () => {
  //         try {
  //           console.log("Results:", results);
  
  //           const usersToCreate = [];
  //           const userInfosToCreate = [];
  
  //           for (const item of results) {
  //             // Check if required fields are present
  //             if (!item.name || !item.email || !item.city) {
  //               console.error('Missing required field in item:', item);
  //               continue; // Skip this record
  //             }
  
  //             // Check if user already exists
  //             const existingUser = await User.findOne({ where: { email: item.email } });
  //             if (existingUser) {
  //               console.warn(`User with email ${item.email} already exists. Skipping...`);
  //               continue; // Skip this record or handle it accordingly
  //             }
  
  //             // Create a User record
  //             usersToCreate.push({ name: item.name, email: item.email });

  //             console.log("item.address--" , item.address)
  
  //             // Create a UserInfo record associated with the user
  //             userInfosToCreate.push({
  //               address: item.address ,
  //               city: item.city ,
  //               zip: item.zip ,
  //               state: item.state,
  //               country: item.country ,
  //               age: parseInt(item.age, 10) || null, // Ensure age is an integer
  //               gender: item.gender ,
  //               userId: null, // Placeholder for userId to be filled after creation
  //             });
  //           }


  //           console.log("\\\\\\\\\\\----" , usersToCreate)

  //           console.log("=======>>>>",userInfosToCreate)
  
  //           // Bulk insert users
  //           const createdUsers = await User.bulkCreate(usersToCreate);
  
  //           // Fill in the userId for each UserInfo record
  //           createdUsers.forEach((user, index) => {
  //             userInfosToCreate[index].userId = user.id;
  //           });

            
  
  //           // Bulk insert user infos
  //           await Userinfo.bulkCreate(userInfosToCreate);
  
  //           console.log('Data inserted successfully!');
  //           res.status(200).send({ message: "Data inserted successfully!" });
  
  //         } catch (error) {
  //           console.error('Error inserting data:', error);
  //           res.status(500).send({ message: error.message || "Some error occurred while inserting data." });
  //         }
  //       })
  //       .on('error', (error) => {
  //         console.error('Error reading CSV file:', error);
  //         res.status(500).send({ message: "Error reading CSV file." });
  //       });
  
  //   } catch (error) {
  //     console.error('General error:', error);
  //     res.status(500).send({ message: error.message || "Some error occurred." });
  //   }
  // };
  