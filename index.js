const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
  origin:[
    "http://localhost:5173",
    "https://car-doctor-122d1.web.app",
    "https://car-doctor-122d1.firebaseapp.com",

  ],
  credentials:true
}));

app.use(express.json());
app.use(cookieParser());


console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xnsnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});





//middleWares  google question: how to get the full url in express?
const logger = async(req, res, next) =>{
  // console.log('called', req.host, req.originalUrl)
  console.log("logInfo:",req.method, req.url);
  next();
}

const verifyToken = async(req, res, next) =>{
  const token = req?.cookies?.token;
  console.log('value of token in middleWare in the :', token);
  if(!token){
    return res.send({message:'not authorized'})
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, decoded) =>{
    //error
    if(err){
      console.log(err);
      return res.status(401).send({message: 'UNAUTHORIZED'})
    }
    // if token is valid then it would be decoded
    console.log('value in the token', decoded);
    req.user = decoded
    next();
  })
 
}


//3:deploy:= vercel.json
//4:deploy: cookie
const cookieOption ={
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure: process.env.NODE_ENV === "production" ? true : false, 
}


async function run() {
  try {
    //1.deploy:
    // await client.connect();

    const servicesCollection = client.db("carDoctor").collection("services");
    const checkOutCollection = client.db("carDoctor").collection("checkOut");


    //auth related /JWT api
    //chatgpt question
// why should i put jwt token in http only Cookie.
// i am using express how can i set it to the cookee and send


    app.post('/jwt',logger,async(req, res)=>{
       const user = req.body;
       console.log('user for token',user);

       const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
       res
       .cookie('token', token,cookieOption)
       .send({token})

       //1..logging thakle token hobe
    })

    //2..logOut holeu jeno token na thake tai /logOut korte hobe post ba get korte hobe
    app.post('/logOut', async(req, res) =>{
      const user = req.body;
      console.log('loggingOut', user);
      res.clearCookie('token', {...cookieOption,maxAge: 0}).send({success:true})
    }) 



///server-api, services related api
    app.get("/services",logger, async (req, res) => {
      const cursor = servicesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // app.get("/services", async (req, res) => {
    //   const cursor = servicesCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };
      const result = await servicesCollection.findOne(query, options);
      res.send(result);
    });

    //checkOut Api create 1
    app.post("/checkOuts", async (req, res) => {
      const checkOut = req.body;
      const result = await checkOutCollection.insertOne(checkOut);
      res.send(result);
    });

    //http://localhost:5000/checkOuts ai tai data show 2
    app.get("/checkOuts",logger, verifyToken , async (req, res) => { 
      console.log(req.query.email);
      console.log('token',req.cookies.token);
      console.log('user in the valid token', req.user);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await checkOutCollection.find(query).toArray();
      res.send(result);
    });

    //delete'3
    app.delete("/checkOuts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await checkOutCollection.deleteOne(query);
      res.send(result);
    });

    //update
    app.patch("/checkOuts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateCheckOut = req.body;
      console.log(updateCheckOut);
      const updateDoc = {
        $set: {
          status: updateCheckOut.status,
        },
      };
      const result = await checkOutCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
//1.2:deploy:
   // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } 
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car Doctor making server is running");
});

app.listen(port, () => {
  console.log(`Car Doctor server is running on port ${port}`);
});
