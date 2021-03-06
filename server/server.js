const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config({ path: './.env' });

app.use(cors());

app.use(express.static(process.env.STATIC_DIR));

const stripeRoute = require('./stripe-routes/index');



const stripeWebhooks = require('./controllers/webhooks');
// must be above express.json()
app.post('/stripe-webhooks', express.raw({type: 'application/json'}), stripeWebhooks);


app.use(express.json());
app.get((req, res) => {
  res.sendFile('index.html')
})
app.use('/api', stripeRoute);



app.listen(4242, () => console.log(`Node server listening on port http://localhost:${4242}!`));