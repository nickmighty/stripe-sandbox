const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const products = require('../db/products.json');

async function createCheckoutSession(req, res) {
    const user = req.user
    try {
        let sessionConfig;
        if (req.body.item) {
            sessionConfig = setupPurchaseItemSession(req.body, products[req.body.item])
        }
        const session = await stripe.checkout.sessions.create(sessionConfig);
        const body = {
            // stripeCheckoutSessionId: session.id,
            // stripePublicKey: process.env.STRIPE_PUBLISHABLE_KEY
            redirectUrl: session.url
        }
        res.status(200).json(body)
    } catch (error) {
        console.log(error);
        res.status(500).send(`error: ${JSON.stringify(error)}`);
    }
    
}

function setupPurchaseItemSession(request, item) {
    const config = setupBaseSessionConfig(request);
    // config.line_items = products[request.courseId].line_items;
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
    const config = {
        payment_method_types: ['card'],
        success_url: `${request.callbackUrl}/?purchaseResult=success`,
        cancel_url: `${request.callbackUrl}/?purchaseResult=failed`,
        client_reference_id: ''
    }
    return config
}

module.exports = createCheckoutSession;