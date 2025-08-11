require('dotenv').config();
const path = require('path')
const express = require('express');
const session = require('express-session')
const flash = require('connect-flash')
const sessionStore = require('connect-mongodb-session')(session)
const methodOverride = require('method-override');
const PORT = 9000 || process.env.PORT
const app = express();
const homeRoute = require('./routes/homeRoute')
const productRoute = require('./routes/productRouter')
const authRoute = require('./routes/authRoute')
const cartRoute = require('./routes/cartRoute')
const orderRoute = require('./routes/orderRoute')
const admin = require('./routes/adminRoute');
const { isAdmin } = require('./routes/guards/authGuardAdmin');
const profileRoute = require('./routes/profileRoute')

app.use(express.static(path.join(__dirname,'assets')))
app.use(express.static(path.join(__dirname,'image')))

app.use(flash())

const store = new sessionStore({
    uri:process.env.DATABASE_URI,
    collection: 'session'
})

app.use(session({
    secret: 'Dula Developer',
    saveUninitialized:false,
    store:store
}))

app.set('view engine', 'ejs');
app.set('views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use('/',homeRoute)
app.use(productRoute)
app.use(authRoute)
app.use('/cart',cartRoute)
app.use('/orders',orderRoute);
app.use('/admin',admin)
app.use(profileRoute)


app.get('/error',(req , res)=>{
res.render('error.ejs',{
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin
})
})




app.listen(PORT , (err)=>{


 console.log('http://localhost:9000/');
 
})