const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/insertdata' , UserController.insertData)

module.exports = router;
