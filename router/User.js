const router = require('express').Router(),
      bcrypt = require('bcrypt'),
      User = require('../model/User');

// Get user
router.get('/:id', async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const { password, // Don't get password & id & email
                _id,
                email,
                __v,
                updatedAte,
                ...other
        } = user._doc;
        res.status(200).json(other)
    }catch(err){
        res.status(500).json(err)
    }
})

// Update User Data
router.put('/update/:id', async (req, res)=>{
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        //if user update password
        if (req.body.password) {
          try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
          } catch (err) {
            return res.status(500).json(err);
          }
        }
        try {
          // update data
          const user = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
          });
          res.status(200).json("Account has been updated");
        } catch (err) {
          return res.status(500).json(err);
        }
      } else {
        return res.status(403).json("You can update only your account!");
      }
})

// Delete Account 
router.delete('/delete/:id', async (req, res)=>{
  if(req.body.userId === req.params.id){
    try{
      await User.findByIdAndDelete(req.body.userId)
      res.status(200).json("Account has been deleted");
    }catch(err){
      res.status(400).json(err);
    }
  }
})
module.exports = router;