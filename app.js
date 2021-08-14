const express = require('express')
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const port = 5000


const exphbs = require('express-handlebars')

const app = express()

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//Body Parser
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//Set static folder
app.use(express.static(`${__dirname}/public`))


//Index Route
app.get('/', (req,res)=>{
  res.render('index',{
    stripePublishableKey: keys.stripePublishableKey
  })
})



app.post('/charge',(req,res) => {
  const amount = 2500
  //Stripe API call POST v1/tokens
  //req, res data on stripe backend
  //request body posted here will be the stripeToken, stripeTokenType, stripeEmail (1)

  //Create a customer
  //Stripe API call POST v1/customers
  //req is the data bellow, response is on Stripe backend (2)
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  //Charges the customer based on id
  //Stripe API call POST v1/charges
  //req is the data bellow, response is on Stripe backend (3)
  .then(customer => stripe.charges.create({
    amount,
    description: 'Tryto subscription',
    currency: 'cad',
    customer: customer.id
  }))
  .then(charge => res.render('success'))


})


app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})