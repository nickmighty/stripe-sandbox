const router = require('express').Router();
const createCheckoutSession = require('../controllers/checkout');



router.post('/checkout', createCheckoutSession)



module.exports = router;