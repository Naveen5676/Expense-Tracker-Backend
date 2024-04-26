const e = require('cors');
const filesdownloadedmodal = require('../models/filesdownloaded');

exports.getFilesDownloaded = async (req, res) => {
    try{
        const userid = req.user.id
    const data = await filesdownloadedmodal.findAll({where : {userdatumId : userid}})
    if(data){
        res.status(200).json(data)
    }else{
        throw new Error('no url found')
    }
    }
    catch(error){
        res.status(400).json(error)
    }
    
}