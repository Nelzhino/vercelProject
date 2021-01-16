const { Router } = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const { isAuthenticated } = require('../auth');

const router = Router();


const signToken = (_id) => {
    return jwt.sign({ _id }, 'mi-secreto', {
        expiresIn: 60 * 60 * 24 * 365
    });
};

router.post('/register', (request, response) => {
    const { email, password } = request.body;

    crypto.randomBytes(16, (err, salt) => {
        const newSalt = salt.toString('base64');
        crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (err, key) => {
            const encryptedPassword = key.toString('base64');
            Users.findOne({ email })
                .then(user => {
                    if (user) {
                        return response.send('Exist user!!!');
                    }
                    Users.create({
                        email,
                        passoword: encryptedPassword,
                        salt: newSalt
                    }).then(() => {
                        response.send('User created!!!');
                    });
                });
        });
    });
    response.send('registro');
});

router.post('/login', (request, response) => {
    const { email, password } = request.body;
    Users.findOne({ email }).exec()
        .then(user => {
            if (!user) {
                response.send('User or Password incorrect!!!');
            }
            crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (err, key) => {
                const encryptedPassword = key.toString('base64');
                if (user.password === encryptedPassword) {
                    const token = signToken(user._id);
                    return response.send({ token });
                }
                response.send('User or Password incorrect!!!');
            });
        })
});

router.get('/me', isAuthenticated, (request, response) => {
    response.send(request.user);
})

module.exports = router;