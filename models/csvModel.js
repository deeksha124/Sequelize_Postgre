const { DataTypes } = require("sequelize");
const sequelize = require("../config/config"); 
exports.Tutorial = sequelize.define(
  "Tutorial",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Enable auto-increment
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

exports.User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  timestamps: true,
});

exports.Userinfo = sequelize.define("Userinfo", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: { // Foreign key to link to User
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // Ensure this matches the model name
      key: "id",
    },
  },
  age: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  address : {
    type: DataTypes.STRING, 
    allowNull: false,

  },
  gender: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Associations can be defined after model definitions if needed
exports.User.hasOne(exports.Userinfo, { foreignKey: 'userId' });
exports.Userinfo.belongsTo(exports.User, { foreignKey: 'userId' });
