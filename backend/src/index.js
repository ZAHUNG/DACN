const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config();



const app = express();
const port = process.env.PORT || 3001


app.get('/', (req,res) => {
     res.send('Hello anh em xoiws')
})

app.use(cors(
    {
  origin: 'http://localhost:3000',
  credentials: true,
}
))
app.use(bodyParser.json());
app.use(cookieParser())



routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
.then(() =>{
    console.log('Connected to MongoDB');
})
.catch((err) =>{
    console.log(err)
})



app.listen(port, () =>{
    console.log('Server is running on port:', + port);
})