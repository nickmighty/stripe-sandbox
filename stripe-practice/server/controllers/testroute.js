const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { queryAll, updateDatabase } = require('../db/index');

async function testRoute(req, res) {
    const user = req.res.user || undefined;
    const testType = req.params.test
    switch (testType) {
        case 'listSub':
            await listSubscriptions(user);
        break;
        case 'cancelAllSub':
            await cancelUserSubs(user);
        break;
        default:
            console.log('incorrect test')
    }
    await cancelUserSubs(user);
    res.json(`TEST : ${req.params.test}`)
}

async function listSubscriptions(user) {
    const listSubscriptions = await stripe.subscriptions.list({
        customer: user.customerId,
        status: 'active'
    })
    console.log(listSubscriptions);
}

async function cancelUserSubs(user) {
    const listSubscriptions = await stripe.subscriptions.list({
        customer: user.customerId,
        status: 'active'
    })
    console.log('hit')
    console.log(listSubscriptions);
    const lastSeconds = new Date().setUTCHours(23,59,59,999);
    const endOfDay = new Date(lastSeconds);
    const futureDate = new Date();
    let testDate;
        testDate = Date.now();
        // testDate = futureDate.setDate(futureDate.getDate() + 10);
    // const subscriptionIds = listSubscriptions.data.map(e => e.id);
    // console.log(subscriptionIds);
    const updateObject = {}
    if (testDate > endOfDay) {
        updateObject.proration_behavior = 'create_prorations'
    }

    for await (const subs of listSubscriptions.data) {
        updateObject.items = [{ id: subs.items.data[0].id }]
        updateObject.cancel_at = testDate
        // console.log(updateObject)
        try {
            const response = await stripe.subscriptions.update(subs.id ,updateObject);
        } catch (error) {
            console.log(`error : ${error}`)
        }   
    }
    

    
}

module.exports =  testRoute;