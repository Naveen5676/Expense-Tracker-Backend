const express = require('express');
const filesdownloadedControleer = require('../controllers/filesdownloaded');
const authorizationMiddleware = require('../middleware/authorization');

const router = express.Router()

router.get('/getallpreviousurl', authorizationMiddleware.authorization , filesdownloadedControleer.getFilesDownloaded)

module.exports= router