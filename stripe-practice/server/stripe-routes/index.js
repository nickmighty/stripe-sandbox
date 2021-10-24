const router = require('express').Router();
const createCheckoutSession = require('../controllers/checkout');
const users = require('../db/users.json');

function dbUsers(req, res, next) {
    const user = 1
    res.user = users[user];
    next();
}


router.post('/checkout', dbUsers, createCheckoutSession)



module.exports = router;