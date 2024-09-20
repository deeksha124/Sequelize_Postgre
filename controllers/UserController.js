const User = require("../models/user");

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

exports.insertData = async (req, res) => {
  try {
    const usersData = req.body;
    console.log(usersData);
    // Input validation
    if (!Array.isArray(usersData) || usersData.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid input: expected an array of users." });
    }
    const results = [];
    for (const Data of usersData) {
      if (!Data.name || !Data.email) {
        return res
          .status(400)
          .json({ message: "Name and email are required for each user." });
      }

      const user = await User.upsert(Data);
      results.push(user);
    }

    res.status(201).json({ message: "Users created/updated", results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error });
  }
};
