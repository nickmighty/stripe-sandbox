const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');
const path = require('path')
const { products, sessions } = require('../db/index');


async function createCheckoutSession(req, res) {  
    try {
        let sessionConfig;
        const user = req.res.user;
        const productId = req.body.item
        const sessionId = updateSession(user.id, productId, "add")
        if (req.body.item) {
            sessionConfig = setupPurchaseItemSession({...req.body, user}, products[req.body.item], sessionId)
        }
        const session = await stripe.checkout.sessions.create(sessionConfig);
        const body = {
            redirectUrl: session.url
        }
        res.status(200).json(body)   
    } catch (error) {
        console.log(error);
        res.status(500).send(`error: ${JSON.stringify(error)}`);
    }
    
}

function setupPurchaseItemSession(request, item, sessionId) {
    const config = setupBaseSessionConfig(request, sessionId);
    config.line_items = [
        { 
            name: item.name,
            description: item.description,
            amount: item.amount,
            currency: item.currency,
            quantity: item.quantity
        }
    ]
    return config;
}

function setupBaseSessionConfig(request, sessionId) {
    const config = {
        payment_method_types: ['card'],
        success_url: `${request.callbackUrl}/?purchaseResult=success`,
        cancel_url: `${request.callbackUrl}/?purchaseResult=failed`,
        client_reference_id: sessionId
    }
    return config
}

let sessionArray = [];
if (sessions.length) {
    sessionArray = sessions;
}
function updateSession(userId, productId, setOption) {
    if (setOption === 'add') {
        let sessionId = Date.now();
        sessionArray.push({ 
            sessionId,
            userId, 
            productId,
            status: "ongoing" 
        })
        const newData = JSON.stringify(sessionArray.flat(), null, 2);
        fs.writeFile(path.resolve('../server/db/sessions.json'), newData, 
            (err) => console.log(err))
        return sessionId;
    }
}

module.exports = createCheckoutSession;