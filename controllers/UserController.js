const User = require('../models/user');

class UserController {
    static async create(req, res) {
        const { name, email } = req.body;
        const user = await User.create({ name, email });
        res.status(201).json(user);
    }

    static async getAll(req, res) {
        const users = await User.findAll();
        res.json(users);
    }

    static async update(req, res) {
        const { id } = req.params;
        const { name, email } = req.body;
        const user = await User.findByPk(id);
        if (user) {
            user.name = name;
            user.email = email;
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }

    static async insertData(req, res) {
        const usersData = req.body; // Assuming body is an array of user objects
    
        // Input validation
        if (!Array.isArray(usersData) || usersData.length === 0) {
            return res.status(400).json({ message: 'Invalid input: an array of users is required.' });
        }
    
        try {
            const [results] = await Promise.all(usersData.map(async ({ name, email }) => {
                if (!name || !email) {
                    throw new Error('Name and email are required for each user.');
                }
                return await User.upsert({ name, email });
            }));
    
            res.status(200).json({ message: 'Users processed', results });
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ message: 'Error occurred', error: error.message });
        }
    }
    
    
    
}

module.exports = UserController;
