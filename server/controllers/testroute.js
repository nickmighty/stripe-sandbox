const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { queryAll } = require('../db/index');
const products = 'products'

async function testRoute(req, res) {
    const user = req.res.user || undefined;
    const testType = req.params.test
    switch (testType) {
        case 'listSub':
            console.log('list all subs')
            await listSubscriptions(user);
        break;
        case 'cancelAllSub':
            console.log('cancel all subs')
            const lastSeconds = new Date().setUTCHours(23,59,59,999);
            const endOfDay = new Date(lastSeconds);
            const futureDate = new Date();
            let testDate;
                // testDate = Date.now();
                testDate = futureDate.setDate(futureDate.getDate() + 10);
            if (endOfDay < testDate) {
                await cancelUserSubs(user)
            } else {
                await cancelUserSubs(user, testDate);
            }
        break;
        case 'autoSub':
            console.log('autoSub')
            await autoSub(user);
        break;
        case 'portal':
            console.log('portal');
            await launchPortal(user);
        default:
            console.log('incorrect test')
    }
    res.json(`TEST : ${req.params.test}`)
}

async function listSubscriptions(user) {
    const listSubscriptions = await stripe.subscriptions.list({
        customer: user.customerId,
        status: 'active'
    })
    const subscriptionIds = listSubscriptions.data.map(e => e.id);
    console.log(JSON.stringify(subscriptionIds));
    console.log(listSubscriptions.data.length);
}

async function cancelUserSubs(user, setDay) {
    const listSubscriptions = await stripe.subscriptions.list({
        customer: user.customerId,
        status: 'active'
    })
    const subscriptionIds = listSubscriptions.data.map(e => e.id);
    console.log(`total subs: ${subscriptionIds.length} ${JSON.stringify(subscriptionIds)}`);

    if (setDay) {
        console.log(`set day: ${setDay}`);
        for await (const subs of subscriptionIds) {
            try {
                await stripe.subscriptions.update(subs ,{
                    items: [{ id: subs.id }],
                    cancel_at: setDay,
                    proration_behavior: 'create_prorations'
                })
            } catch (error) {
                console.log(`error : ${error}`)
            }   
        }
    } else {
        console.log('cancel immediately.')
        for await (const subs of subscriptionIds) {
            try {
                await stripe.subscriptions.del(subs , {
                    invoice_now: true,
                    prorate: true
                });
            } catch (error) {
                console.log(`error : ${error}`)
            }   
        }  
    }
}

async function autoSub(user) {
    // can auto sub??? // 
    const currentProducts = await queryAll(products);
    const { pricingPlanId, priceId } = currentProducts;
    

}

async function launchPortal(user) {
     
}

module.exports =  testRoute;