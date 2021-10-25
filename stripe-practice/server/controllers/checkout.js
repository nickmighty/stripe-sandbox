const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');
const path = require('path')
const products = require('../db/products.json');
const sessionDB = require('../db/sessions.json');

async function createCheckoutSession(req, res) {
    const user = req.res.user;
    try {
        let sessionConfig;
        if (req.body.item) {
            sessionConfig = setupPurchaseItemSession({...req.body, user}, products[req.body.item])
        }
        // const session = await stripe.checkout.sessions.create(sessionConfig);
        // const body = {
        //     redirectUrl: session.url
        // }
        // res.status(200).json(body)
    } catch (error) {
        console.log(error);
        res.status(500).send(`error: ${JSON.stringify(error)}`);
    }
    
}

function setupPurchaseItemSession(request, item) {
    const config = setupBaseSessionConfig(request);
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

function setupBaseSessionConfig(request) {
    const newSession = updateSession(request.user, "add")
    if (!newSession) {
        return new Error('unable to create session idea');
    }
    const config = {
        payment_method_types: ['card'],
        success_url: `${request.callbackUrl}/?purchaseResult=success`,
        cancel_url: `${request.callbackUrl}/?purchaseResult=failed`,
        client_reference_id: newSession
    }
    return config
}

function updateSession(user, setOption) {
    if (setOption === 'add') {
        const uniqueId = Date.now();
        const session = { [uniqueId]: { user } }
        sessionDB.push(session);
        const newData = JSON.stringify(sessionDB, null, 2);
        fs.writeFile(path.resolve('../server/db/sessions.json'), newData, 
            (err) => console.log(err))
        return uniqueId;
    }
}

module.exports = createCheckoutSession;