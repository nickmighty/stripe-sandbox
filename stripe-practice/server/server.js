const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config({ path: './.env' });

app.use(cors());

app.use(express.static(process.env.STATIC_DIR));

const stripeRoute = require('./stripe-routes/index');


// const testHostedAccount = "acct_1Jn9We2eYdyhFd5u";
// const cus = "cus_KMnpYYZVKgPibR"

const stripeWebhooks = require('./controllers/webhooks');
app.post('/stripe-webhooks', express.raw({type: 'application/json'}), stripeWebhooks);

app.use(express.json());
app.get((req, res) => {
  res.sendFile('index.html')
})
app.use('/api', stripeRoute);



app.listen(4242, () => console.log(`Node server listening on port http://localhost:${4242}!`));