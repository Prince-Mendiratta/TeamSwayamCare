var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "hospitalmgmt"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/', function(req, res, next) {
  res.send('');
});

/* refer patient to another hospital. */
router.post('/refer', function(req, res, next) {
  console.log(req.body);

  let FinalHID = parseInt(req.body.fHid);//101-104
  let InitialPID = parseInt(req.body.iPid);


  let x = 0;
  let NoOfRecords = 0;


  let sqlNoOfRec = `SELECT COUNT(PID) FROM patients WHERE HID=${FinalHID};`


  //to get the number of existing records
  con.query(sqlNoOfRec, function (err, result) {
    if (err) throw err;
    x = result;

    // var t=JSON.parse(x);
    NoOfRecords = x[0]['COUNT(PID)'];

  });

  let FinalPID = FinalHID * 100 + x + 10;


  //UPDATING THE DATA IN THE SQL

  let sql = `INSERT INTO patients (PID, PNAME, AGE, HID, LINK, STATUS) SELECT ${FinalPID}, PNAME, AGE, ${FinalHID} , LINK, 'REFF' FROM  patients WHERE PID=${InitialPID}`;

  con.query(sql, function (err, result) {
    if (err) {
      res.redirect('/');
      // if(err.message.includes('ER_DUP_ENTRY')){
      //   // Do nothing
      //   console.log('Had an error - ', err.message);
      // }else{
      //   res.redirect('/');
      // }
    };
    console.log(result);
    res.redirect('/');
  });
});

/* appoint page */
router.get('/refer', function(req, res, next) {
  res.render('refer');
});

module.exports = router;
