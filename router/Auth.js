const router = require('express').Router(),
      bcrypt = require('bcrypt'),
      JWT = require('jsonwebtoken'),
      User = require('../model/User');

// Create cookie with JWT 
const maxAge = 3 * 24 * 60 * 60;
const CookieByUserId = (id) => {
    return JWT.sign({id}, 'net', {expiresIn: maxAge})
}
const CookieByUserName = (username) => {
    return JWT.sign({username}, 'net', {expiresIn: maxAge})
}

// Register
router.post('/register', async (req, res)=>{
    const { username, email, password, password2 } = req.body;

    // Errors
    // if user don't insert any data
    if(!username || !email || !password || !password2) return res.status(400).json('there are no data!! Please insert data')
    
    // Check password
    if(password != password2) return res.status(400).json('please input correct password');

    // Check Password length
    if(password.length <= 6) res.status(400).json('password min = 6!! please input correct password');

    // Register section
    try{
        User.findOne({email: email})
            .then(result=>{
                if(result) return res.status(400).json('email is already registered');
                else{
                    const newUser = User({
                        username, 
                        email,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if(err) throw err;
                            newUser.password = hash;
                            
                            // Cookie Section
                            const token_ID = CookieByUserId(newUser.id);
                            const token_Username = CookieByUserName(newUser.username);
                            res.cookie('LUX', token_ID, {httpOnly: true, expiresIn: maxAge * 1000})
                            res.cookie('_SET', token_Username, {httpOnly: true, secure: true, expiresIn: maxAge * 1000})
                            
                            newUser.save()
                                .then(result => {
                                    res.status(200).json('welcome with us')
                                })
                        })
                    })
                }
            })
    }catch(err){
        res.status(400).json('there are error')
    }
})

// Login
router.post('/Login', async(req, res)=>{
    const {email, password} = req.body;
    // Errors
    // if user don't insert any data
    if(!email || !password) return res.status(400).json('there are no data!! Please insert data')
    
    // Check Password length
    if(password.length <= 6) res.status(400).json('password min = 6!! please input correct password');
    
    // Login section
    try{
        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json("user not found")

        const ValidPassword = await bcrypt.compare(password, user.password);
        if(!ValidPassword) return res.status(400).json('wrong Password')

        res.status(200).json('Login..!!')
    }catch(err){
        res.status(400).json('there are error')
    }
})
module.exports = router;