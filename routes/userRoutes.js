const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/insertdata' , UserController.insertData)
router.get('/insertdata1' , UserController.insertData1)

module.exports = router;
