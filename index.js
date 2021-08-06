const express = require('express');
const jwt = require('jsonwebtoken');  // see https://github.com/auth0/node-jsonwebtoken

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: "hello from /api"
    });
});

app.post('/api/posts', verifyToken, (req, res) => {

    jwt.verify(req.token, 'some-secret-key', (err, authData) => {
        if ( err ) {
            res.send(403)
        }
        res.json({
            message: "post created.",
            authData
        });
    })
});

app.post('/api/login', (req, res) => {
    // Mock User
    const user = {
        id: 1,
        name: "Chase",
        email: "chase@gmail.com"
    }
    
    jwt.sign({ user: user }, 'some-secret-key', {expiresIn: "30s"}, (err, token) => {
        res.json({token: token})
    });
});


// express middleware
function verifyToken(req, res, next) {
    // get auth token value
    const bearerHeader = req.headers['authorization']
    // check if bearer is undefined
    if ( typeof bearerHeader !== 'undefined' ) {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
        
    } else {
        res.sendStatus( 403 );
    }
}

app.listen(5000, () => console.log("listening on port 5000..."));

