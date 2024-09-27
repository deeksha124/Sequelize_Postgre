const express = require('express');
const UserController = require('../controllers/userController');
const csvController = require("../controllers/csvController");
const upload = require("../middleware/middelware");

// const initRoutes = require("./routes/tutorial.routes");


const router = express.Router();

router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/insertdata' , UserController.insertData)
router.post('/upload/csv' , upload.single("file"), csvController.uploadDataCSV)

module.exports = router;
