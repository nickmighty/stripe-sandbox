const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { users, sessions } = require('../db/index')

async function stripeWebhooks(req, res) {
    try {
        const signature = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        switch(event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                // console.log(session);
                await onCheckoutSessionCompleted(session);
            break;
            default:
                console.log(`default switch: ${event.type}`);
        } 

        res.json({received: true});

    } catch (error) {
        console.log(error);
        return res.status(400).send(`webhook error: ${error.message}`);
    }


}

async function onCheckoutSessionCompleted(session) {
    const purchasedSessionId = sessions.find(order => order.sessionId === Number(session.client_reference_id));
    console.log(purchasedSessionId)
}

module.exports = stripeWebhooks;