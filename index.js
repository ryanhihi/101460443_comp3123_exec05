const express = require('express');
const app = express();
const router = express.Router();
const path = require("path");
const fs = require('fs');

app.use(express.json());

/*
- Create new html file name home.html - done 
- add <h1> tag with message "Welcome to ExpressJs Tutorial" - done
- Return home.html page to client - done
*/
router.get('/home', (req,res) => {
  //res.send('This is home router');
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req,res) => {
  //res.send('This is profile router');
  const filePath = path.join(__dirname, 'user.json');

  fs.readFile(filePath, 'utf8', (err, data) =>{
    if(err){
      return res.status(500).json({error: 'Failed to read user data'});

    }

    const userData = JSON.parse(data);
    res.json(userData);
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req,res) => {
  //res.send('This is login router');
  const {username, password} = req.body;
  const filePath = path.join(__dirname, 'user.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if(err){
      return res.status(500).json({status:false, message: "Cannot read user data"});
    }

    const userData = JSON.parse(data);

    //Check username
    if(username !== userData.username){
      return res.json({
        staus: false,
        message: "Username is invalid"
      });
    }

    if(password !== userData.password){
      return res.json({
        status: false,
        message: "Pass word is invalid"
      });
    }

    //If both are valid
    res.json({
      status:true,
      message:"User is valid"
    });
  });
  
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req,res) => {
  //res.send('This is logout router');
  const username = req.query.username;

  if(username){
    res.send(`<b>${username} successully logout. </b>`);
  }else{
    res.send(`<b>Username is missing in the query parameter</b>`);
  }
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging purposes
  res.status(500).send('<h1>500 - Server Error</h1><p>Server Error</p>'); // Send 500 page with the message
});

app.use('/', router);


app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));