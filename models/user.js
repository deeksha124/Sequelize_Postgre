const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Adjust path as necessary

class User extends Model {}

User.init({
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
}, {
    sequelize,
    modelName: 'User',
    timestamps: true, // Automatically manages createdAt and updatedAt fields
});

module.exports = User;
