// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt=require("bcrypt")
const saltRounds = 10;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const twilio = require('twilio')

const app = express();
const port = 5000;
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
// app.use("/send",send)

// Connect to MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'vivekk07',
  database: 'coal_mine',
  // host : 'sql12.freesqldatabase.com',
  // user: 'sql12670769',
  // password: 'm4xqe7AtDt',
  // database: 'sql12670769',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API endpoint to handle mine registeration
app.post('/mine/register', (req, res) => {
  const { user, id, loc  } = req.body;

  if ( !user || !id || !loc) {
    return res.status(400).json({ message: 'All fields are mandatory' });
  }

  // Save data to the database
  const sql = 'INSERT INTO mine_master (mine_name, mine_id,mine_location) VALUES (?, ?,?)';
  connection.query(sql, [user, id,loc], (error, results) => {
    if (error) {
      console.error('Error saving user to MySQL:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'User registered successfully' });
  });
});



// Route to fetch opening entry
app.get('/get-opening-entry', (req, res) => {
  // const mineId = req.query.mine_id;
  const mineId = req.params.mineId;
  if (!mineId) {
    res.status(400).json({ error: 'Missing mine_id parameter' });
  }

  // const query = 'SELECT opening_entry FROM adjustment_entry WHERE mine_id = ?';
  const query = 'SELECT mm.mine_id,mm.mine_name,mm.mine_location,ae.opening_entry FROM mine_master AS mm join adjustment_entry as ae on ae.mine_id = mm.mine_id where ae.mine_id=?';
  connection.query(query, [mineId], (err, results) => {
    if (err) {
      console.error('Error fetching opening entry data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
      // const openingEntry = results.length > 0 ? results[0].opening_entry : null;
    return  res.json(results);
    
  });
});




//user registeration
app.post('/user-data/register', (req, res) => {
  const { name, username, mine_id, mine_name, mine_location, password } = req.body;

  // Check if the username already exists
  const usernameQuery = 'SELECT * FROM user_master WHERE user_name = ?';
  connection.query(usernameQuery, [username], (checkErr, checkResults) => {
    if (checkErr) {
      // Handle database error
      console.error('Database error:', checkErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (checkResults.length > 0) {
      // Username already taken
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash the plaintext password using bcrypt
    bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
      if (hashErr) {
        // Handle hashing error
        console.error('Hashing error:', hashErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Store hashedPassword in the database along with other user details
      const insertQuery = 'INSERT INTO user_master (name, user_name, mine_id, mine_name, location, password) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(insertQuery, [name, username, mine_id, mine_name, mine_location, hashedPassword], (insertErr, insertResults) => {
        if (insertErr) {
          // Handle insertion error
          console.error('Insertion error:', insertErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
});

app.post('/authenticate/login', async(req, res) => {
  const { users, pwd } = req.body;

  if (!users || !pwd) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
  }

  const query = 'SELECT * FROM user_master WHERE user_name = ?';

  connection.query(query, [users], (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    if (results.length === 1) {
      const hashedPassword = results[0].Password;

      // Compare the provided password with the hashed password from the database
      bcrypt.compare(pwd, hashedPassword, (compareErr, match) => {
        if (compareErr) {
          console.error('Bcrypt compare error:', compareErr);
          return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        if (match) {
          // If login is successful, you can send additional data or a success message
          const mineId = results[0];
          //create token
          const token = jwt.sign({mineId}, "our-jsonwebtoken-secret-key", {expiresIn:'1d'});
          console.log('Generated token:', token);
          return res.status(200).json({ success: true, message:mineId,token });
        } else {
          // If login fails, return an error message
          return res.status(401).json({ success: false, error: 'Invalid username or password' });
        }
      });
    } else {
      // If username is not found, return an error message
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  });
});


// Route to fetch mine ID
app.get('/fetch-data/mines', (req, res) => {
  const query = 'SELECT mine_id, mine_name, mine_location FROM mine_master';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching mine data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ mines: results });
    }
  });
});


// twilio setup 

const accountSid = 'AccountID';
const authToken = 'AddToken';
const twilioPhoneNumber = '999999999';

const client = twilio(accountSid, authToken);

//railway requwst
app.post('/Request-entry', (req, res) => {
  const {
    request_id,
    received_quantity, 
    Schedule_in_time,
    Schedule_in_date,
    remark,
    siding_id,
    siding_name,
    no_rake,
  } = req.body;
  console.log(siding_id);
  const query = 'INSERT INTO request_scheduled (Request_ID,siding_id,siding_name,Quantity,no_rake,Scheduled_In_Date,Scheduled_In_Time,remark) VALUES (?, ?,?,?, ?,?, ?, ?) ';
  connection.query(query, [request_id,siding_id,siding_name,received_quantity,no_rake,Schedule_in_date,Schedule_in_time,remark], (err, results) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const messageBody = `A new request from  Siding Id:${siding_id}, siding Name:${siding_name} request Id:${request_id}, quantity: ${received_quantity} tons  asking ${no_rake} of rakes on date${Schedule_in_date},remark:${remark} is available.`;
        const toPhoneNumber = "+91 9589840173"; // Replace with the actual recipient phone number

        client.messages
          .create({
            body: messageBody,
            from:twilioPhoneNumber,
            to: toPhoneNumber,
          })
          .then(() => {
            console.log("SMS sent successfully");
            res.json({ success: true });
          })
          .catch((error) => {
            console.error("Error sending SMS:", error);
            res.status(500).json({ error: "Internal Server Error" });
          });
      res.json({ success: true });
    }
  });
});

//route to send request scheduled data for all mine
// request-scheduled table
app.get('/requestScheduled', (req, res) => {
  
  const query = 'SELECT * from request_scheduled ORDER BY Scheduled_In_Date Desc ';
  connection.query(query, (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Error fetching request-scheduled' });
      res.status(500).send('Internal Server Error');
      console.error('Error fetching data:', error);
    }
    else {

      res.status(500).json({ request_scheduled: result });
    }
  })
})
app.get('/update-request', (req, res) => {

  const query = 'SELECT * from confirm_request';
  connection.query(query, (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Error fetching request-scheduled' });
      res.status(500).send('Internal Server Error');
      console.error('Error fetching data:', error);
    }
    else {
    

      res.status(500).json({ request: result });
    }
  })
})
//to send data of inward entry to db
// inward entry data
app.post('/inward-entry', (req, res) => {
  const {
    Allotment,
    received_quantity,
    mine_id,
    mine_name,
    mine_location,
    time,
    date,
  } = req.body;

  const query = 'INSERT INTO inward_entry (allotment,received_quantity,mine_id, mine_name, mine_location, time,date_) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [Allotment, received_quantity, mine_id, mine_name, mine_location, time, date], (err, results) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});
app.post('/updated-entry',(req,res)=>{
  const {
    siding_name,
    date,
   remark,
  } = req.body;
  const query = 'UPDATE request_scheduled SET Scheduled_In_date =?,remark=? WHERE request_id=?';
  connection.query(query,[date,remark,req.body.request_id],(err,result)=>{
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const messageBody = `A new request has been updated of siding name ${siding_name} request Id:${req.body.request_id}, on date${date},remark:${remark} is recived`;
      const toPhoneNumber = "+91 9589840173"; // Replace with the actual recipient phone number

      client.messages
        .create({
          body: messageBody,
          from:twilioPhoneNumber,
          to: toPhoneNumber,
        })
        .then(() => {
          console.log("SMS sent successfully");
          res.json({ success: true });
        })
        .catch((error) => {
          console.error("Error sending SMS:", error);
          res.status(500).json({ error: "Internal Server Error" });
          });
      res.json({ success: true });
    }
  });
});


// outward-entry 
app.post('/outward-entry',(req,res)=>{
  const {
    out_quantity,
    date,
    rake_no,
   remark
  } = req.body;
  const query = 'INSERT INTO outward_entry (request_id,out_quantity,date,rake_no,remark) VALUES (?,?,?,?,?)';
  connection.query(query,[req.body.request_id,out_quantity,date,rake_no,remark],(err,result)=>{
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/confirm-request', (req, res) => {
  const { requestId, remark } = req.body;

  const checkQuery = 'SELECT * FROM confirm_request WHERE request_id = ?';
  const insertQuery = 'INSERT INTO confirm_request (remark,siding_id,siding_name,request_id) VALUES (?, ?,?,?)';
  const updateQuery = 'UPDATE confirm_request SET remark = ? WHERE request_id = ?';

  connection.query(checkQuery, [requestId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking for requestId in confirm_request table:', checkErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (checkResults && checkResults.length > 0) {
        // If requestId exists, perform update
        connection.query(updateQuery, [remark, requestId], (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating confirmation_requests table:', updateErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            // Perform your Twilio message sending logic here
            sendTwilioMessage(requestId, remark, res);
          }
        });
      } else {
        // If requestId doesn't exist, perform insert
        connection.query(insertQuery, [remark, siding_id,siding_name, requestId], (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Error inserting into confirmation_requests table:', insertErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            // Perform your Twilio message sending logic here
            sendTwilioMessage(requestId, remark, res);
          }
        });
      }
    }
  });
});
function sendTwilioMessage(requestId, remark,siding_id,siding_name, res) {
  // Send message using Twilio
  const toPhoneNumber = '+91 6267224859'; // Replace with the actual recipient phone number
  const messageBody = ` Request of Siding ID ${siding_id},Siding Name ${siding_name} Request ID ${requestId}, Remark ${remark} has been confirmed`;

  client.messages
    .create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: toPhoneNumber,
    })
    .then(() => {
      console.log('Message sent successfully');
      res.json({ success: true });
    })
    .catch((twilioError) => {
      console.error('Error sending Twilio message:', twilioError);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});

app.post('/logout', (req, res) => {
  console.log('token',token);
  res.send('Logged out successfully');
});

app.post('/manager/login', async (req, res) => {
  // Assuming you have a form or JSON payload with manager credentials
  const { pin,prime_id } = req.body;
  const query="SELECT mine_id FROM mine_master WHERE prime_id =?";
  connection.query(query,[pin],(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      try {
        // Replace 'your_req_value' with the actual prime_id you are looking for
        const primeIdToSearch = prime_id;
  
        // Fetch mine IDs for the logged-in manager
        const [rows, fields] = connection.execute(
          'SELECT mine_id FROM mine_master WHERE prime_id = ?',
          [primeIdToSearch]
        );
  
        // Send the mine IDs to the front end
        res.json({ mineIds: rows.map(row => row.mine_id) });
      } catch (error) {
        console.error('Error fetching mine IDs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }})


});

//dashboard
