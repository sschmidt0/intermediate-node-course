const express= require('express');
const cors = require('cors');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const port=8000;
const app= express();
const User = require('./models/User');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// imports our database credentials (stored separately for security)
const db = require('./config/keys').mongoURI;

// initializes our database using the credentials
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
});

app.get('/test', (req, res) => res.json({ msg: 'backend works' }));

app.post('/users',(req,res)=>{
  User.create(
    {...req.body.newData},
    (err,data)=>{sendResponse(res,err,data)}
  )
})

app.route('/users/:id')
.get((req,res)=>{
  User.findById(
    req.params.id,
    (err,data)=>{sendResponse(res,err,data)})
})
.put((req,res)=>{
  User.findByIdAndUpdate(
    req.params.id,
    {...req.body.newData},
    {new:true},
    (err,data)=>{sendResponse(res,err,data)})
})
.delete((req,res)=>{
  User.findByIdAndDelete(
    req.params.id,
    (err,data)=>{sendResponse(res,err,data)})
})


function sendResponse(res,err,data){
  if (err){
    res.json({
      success: false,
      message: err
    })
  } else if (!data){
    res.json({
      success: false,
      message: "Not Found"
    })
  } else {
    res.json({
      success: true,
      data: data
    })
  }
}
