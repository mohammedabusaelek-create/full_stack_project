const express =require('express')
const app=express()
const dotenv=require('dotenv')
const db=require('./models/db')
const cors = require('cors');
const authRoutes = require('./routers/auth');
const productRoutes = require('./routers/product');
const orderRoutes = require('./routers/order');
app.use(cors()); 
dotenv.config()
app.use(express.json())
///////////////////////
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
PORT=5001
app.listen(PORT,()=>{console.log("server is run ");
})