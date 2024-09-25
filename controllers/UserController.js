const User = require("../models/user");
const sequelize = require("../config/config");
const helper = require("../helper/helper");

exports.create = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await User.findByPk(id);
    if (user) {
      user.name = name;
      user.email = email;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error });
  }
};
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error });
  }
};

const bulkProcess = async (usersData) => {
  // Chunk the data
  const chunkedData = helper.chunkArray(usersData, 50);
 
  
  await sequelize.transaction(async (transaction) => {
    console.log("chunkedData" , chunkedData.length)

  // for (const chunk of chunkedData)
    for (let chunk = 0; chunk > chunkedData.length;i++) {

      console.log("chunk-----" , chunk)
      console.log(`chunkedData ${i}` , chunkedData[i])
    // await sequelize.transaction(async (transaction) => {
      const upsertPromises = []; // Array to hold promises
      

      for (let i = 0; i < chunk.length; i++) {
        const user = chunk[i];
        const upsertPromise = await User.upsert(user, { transaction });
        upsertPromises.push(upsertPromise);
      }

      console.log("upsertPromises-----------------")
      await Promise.allSettled(upsertPromises);
    // });
  }
 
})
console.log("Data saved successfully")

};

exports.insertData = async (req, res) => {
  try {
    const usersData = req.body;
    // const usersData = helper.ranndomUser(5000)

    if (!Array.isArray(usersData) || usersData.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid input: expected an array of users." });
    }
    bulkProcess(usersData);
    // Send immediate response
    res.status(202).json({ message: "Data saving in process" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error });
  }
};



