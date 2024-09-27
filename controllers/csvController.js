const Tutorial = require("../models/csvModel");
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
  
  