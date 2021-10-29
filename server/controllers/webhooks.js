const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { queryAll, updateDatabase } = require('../db/index');
const sessions = 'sessions';
const users = 'users';
const webhooktypes = {
    checkSessionCompleted: "checkout.session.completed",
    customerSubscriptionUpdated: "customer.subscription.updated",
    customerSubscriptionDeleted: "customer.subscription.deleted",
    // customerSubscriptionSuccess: "customer.subscription.created"
}

async function stripeWebhooks(req, res) {
    try {
        const signature = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        let session;
        switch(event.type) {
            case webhooktypes.checkSessionCompleted:
                console.log(event.type)
                session = event.data.object;
                await onCheckoutSessionCompleted(session);
                break;
            case webhooktypes.customerSubscriptionSuccess:
                console.log(webhooktypes.customerSubscriptionSuccess)
                session = event.data.object;
                await onCheckoutSessionCompleted(session);
                break;
            case webhooktypes.customerSubscriptionUpdated:
                console.log(webhooktypes.checkSessionCompleted);
                session = event.data.object;
                break; 
            case webhooktypes.customerSubscriptionDeleted:
                console.log(webhooktypes.customerSubscriptionDeleted)
                session = event.data.object;
                console.log(event.data.object);
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

//////////////////////////////////
//  checkout.session.completed  //
//////////////////////////////////

async function onCheckoutSessionCompleted(session) {
    try {
        // console.log(session)
        const currentSessions = await queryAll(sessions);
        const purchaseSessionId = session.client_reference_id;
        const stripeCustomerId = session.customer
        
        const sessionsData = currentSessions.find(order => order.sessionId === Number(purchaseSessionId));

        if (session) {
            // products
            await fullfilProductPurchase(sessionsData.userId, sessionsData.productId, purchaseSessionId, stripeCustomerId);
        } else {
            // subscriptions
            await fullfilProductPurchase(sessionsData.userId, sessionsData.priceId, purchaseSessionId, stripeCustomerId);
        }
    } catch (error) {
        console.log(`error: ${error}`)
    }
}
async function fullfilProductPurchase(userId, productId, sessionId, stripeCustomerId) {
    try {
        const currentSessions = await queryAll(sessions);
        const updatedSession = currentSessions.map(order => {
            if (order.sessionId === Number(sessionId)) {
                order.status = "completed";
            }
                return order;
            })     
            // console.log(updatedSession)  
        updateDatabase(sessions, updatedSession);

        const currentUsers = await queryAll(users);
        const updatedUsers = currentUsers.map(user => {
            if (user.id === userId) {
                let tempArray = user.purchasedItems;
                tempArray.push(productId);
                user.purchasedItems = tempArray;
                user.customerId = stripeCustomerId;
            }
            return user;
        })
        updateDatabase(users, updatedUsers);
    } catch (error) {
        console.log(`error : ${error}`)
    } 
}


module.exports = stripeWebhooks;