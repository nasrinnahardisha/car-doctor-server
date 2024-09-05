// token genarate :
//1. node ,require('crypto).randomBytes(64).toString('hex),

///2.env=ACCESS_TOKEN_SECTRET=c6290dbb114e4b3023dce99e9d0d812b4d61fb9f41e2b412079fc992104b9f6d5e842b24e97943d1b095418c5671f3677ba1eedfb6b89aad28e7543176fc8ce0

//3:index.js: app.post('/jwt) er moddhe (jwt web site)
//       const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECTRET, {expiresIn: '1h'})


//4: app.use({
 // origin:['http://localhost:5173'],
 // credentials:true [cookie gula set korse and client side a cookie gula set korse]
//})


//5: client site:  //get access token
       // axios.post("http://localhost:5000/jwt", user, { withCredentials: true })


//6:  //http://localhost:5000/checkOuts ai tai data show 2
//app.get("/checkOuts", async (req, res) => { 
 //   console.log(req.query.email);
 //ai tuku korte hobe::   console.log('token',req.cookies.token);
 //aibar server nodemon ashow korbe token



//////////////////middleWare/////////
 //7:index.js= const logger = async...
 ///middleWares  google question: how to get the full url in express?
 //const logger = async(req, res, next) =>{
 //      console.log('called', req.host, req.originalUrl)
 //      next();
 //    }
//er por logger use




 /****
 * install jsonwebtoken
 * jwt.sign (payload, secret, {expiresIn:})
 * token client 
 * 
 * 
*/


/***
 * how to store token in the client side
 * 1. memory --> ok type
 * 2. local storage -->ok type (XSS)
 * 3. cookies: http only and s
*/

/**
 * 1. set cookies with http only. for development secure: false, 
 * 
 * 2. cors
 * app.use(cors({
    origin: ['http://localhost:5174'],
    credentials: true
}));
 * 
 * 3. client side axios setting
 * in axios set withCredentials: true
 * 
 * 
*/


/**
 * 1. to send cookies from the client make sure you added withCredentials true for the api call using axios
 * 2. use cookie parser as middleware
*/