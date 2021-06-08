const express = require ('express');
const router = express.Router();


router.get('/logout', (req, res)=>{
    try{
        req.logout();
        res.json({message: 'logged out successfully'});
    }
    catch(error)
    {
        res.status(500).json({message:'internal server error'})
    }
});


module.exports = router;