const express = require('express'),
     app = express(),
     mongo = require('mongoose'),
     auth = require('./router/Auth'),
     user = require('./router/User'),
     cart = require('./router/cart'),
     product = require('./router/Product'),
     oreder = require('./router/Order');
require('dotenv').config();

// Connect database mongoDB
const port = process.env.PORT || 1999;
mongo.connect(process.env.MongoURL,{ useNewUrlParser: true ,useUnifiedTopology: true })
    .then(result => {
        app.listen(port, ()=>{
            console.log(`http://localhost:${port}`)
        })
    }).catch(err => console.log(err))

// middleware
require('./middleware/App')(app);

// Routers
app.use(auth);
app.use(user);
app.use(cart);
app.use(oreder);
app.use(product);


// Get main page
app.get('/', (req, res)=>{
    res.send('hi');
})