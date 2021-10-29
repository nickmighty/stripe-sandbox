const router = require('express').Router();
const createCheckoutSession = require('../controllers/checkout');
const testRoute = require('../controllers/testroute');
const { queryAll } = require('../db/index');

const users = "users";

async function dbUsers(req, res, next) {
    const currentUsers = await queryAll(users);
    const user = 1
    const thisUser = currentUsers.find(allUsers => allUsers.id === user);
    res.user = thisUser;
    next();
}


router.get('/test/:test', dbUsers, testRoute)

router.post('/checkout', dbUsers, createCheckoutSession)




module.exports = router;