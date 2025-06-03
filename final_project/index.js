const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization)
    {
        token = req.session.authorization['accesstoken'];

        jwt.verify(token, 'access', (err, user) => {
            if(err)
            {
                res.send("User not authorized");
            }else{
                req.user = user;
                next();
            }
        });
    }
    else
    {
        res.send("User not loged in");
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server is running at ${PORT}`));
