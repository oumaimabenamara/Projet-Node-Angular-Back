const express = require ('express');
const router = express.Router();


router.get('/logout', (req, res)=>{
    req.logout();
    res.json({message: 'logged out successfully'});
});


module.exports = router;