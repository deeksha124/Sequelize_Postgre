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
                    age: parseInt(item.age), // Ensure age is an integer
                    gender: item.gender,
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
  
  