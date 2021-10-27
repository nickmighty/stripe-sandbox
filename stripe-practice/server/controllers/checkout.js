const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { queryAll, updateDatabase } = require('../db/index');

const sessions = 'sessions'
const products = 'products'

async function createCheckoutSession(req, res) {  
    try {
        let sessionConfig,
            sessionId;
        const user = req.res.user || undefined;
        const currentProducts = await queryAll(products);
        if (req.body.itemId) {
            sessionId = await updateSession(user.id, req.body.itemId);
            sessionConfig = setupPurchaseItemSession(req.body, currentProducts[req.body.itemId], sessionId, user.customerId)
        } else {
            const priceId = currentProducts[req.body.subscriptionId].priceId
            sessionId = await updateSession(user.id, priceId, "subscribe");
            sessionConfig = setUpSubscriptionSession(req.body, priceId, sessionId, user.customerId)
        }
        const session = await stripe.checkout.sessions.create(sessionConfig);
        const body = {
            redirectUrl: session.url
        }
        res.status(200).json(body);   
    } catch (error) {
        console.log(error);
        res.status(500).send(`error: ${JSON.stringify(error)}`);
    }
    
}

function setUpSubscriptionSession(request, priceId, sessionId, customerId ) {
    const config = setupBaseSessionConfig(request, sessionId, customerId);
    config.line_items = [
        { 
            price: priceId,
            quantity: 1
        }
    ]
    config.mode = 'subscription'
    return config;
}

function setupPurchaseItemSession(request, item, sessionId, customerId) {
    const config = setupBaseSessionConfig(request, sessionId, customerId);
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

function setupBaseSessionConfig(request, sessionId, customerId) {
    const config = {
        payment_method_types: ['card'],
        success_url: `${request.callbackUrl}/?purchaseResult=success `,
        cancel_url: `${request.callbackUrl}/?purchaseResult=failed`,
        client_reference_id: sessionId,
        mode: 'payment'
    }

    customerId ? config.customer = customerId : '';

    return config
}


async function updateSession(userId, productId, setOption) {
    const currentSessions = await queryAll(sessions);
    if (setOption === 'subscribe') {
        console.log(productId)
        let sessionId = Date.now();
        currentSessions.push({ sessionId, userId, priceId: productId , status: "ongoing" });
        updateDatabase(sessions, currentSessions)
        return sessionId;
    }
        let sessionId = Date.now();
        currentSessions.push({ sessionId, userId, productId, status: "ongoing" });
        updateDatabase(sessions, currentSessions)
        return sessionId;
}

module.exports = createCheckoutSession;