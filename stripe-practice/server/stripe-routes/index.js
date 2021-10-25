const router = require('express').Router();
const createCheckoutSession = require('../controllers/checkout');
const { users } = require('../db/index');

function dbUsers(req, res, next) {
    const user = 1
    res.user = {...users[user], id: user};
    next();
}


router.post('/checkout', dbUsers, createCheckoutSession)




module.exports = router;