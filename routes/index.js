var express = require('express');
var router = express.Router();


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'bai1';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/chi-tiet', function(req, res, next) {
  res.render('post');
});

router.get('/quanly', function(req, res, next) {
        const findDocuments = function(db, callback) {
        const collection = db.collection('documents');
        collection.find({}).toArray(function(err, docs) {
          assert.equal(err, null);
          callback(docs);
        });
        }
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            const db = client.db(dbName);
            findDocuments(db, function(data) {
              res.render('manage',{data : data});
              client.close();
        });
      });

});
router.get('/upload', function(req, res, next) {
    res.render('upload');
});
router.post('/upload', function(req, res, next) {
      var data = {
          'username' : req.body.txtFullName,
          'link'     : req.body.txtLink,
          'email'     : req.body.txtemail,
          'intro'     : req.body.txtIntro

      };


        const insertDocuments = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('documents');
        // Insert some documents
        collection.insert(data, function(err, result) {
          assert.equal(err, null);

          console.log("Them du lieu thanh cong");
          callback(result);
        });
      }
            MongoClient.connect(url, function(err, client) {
                assert.equal(null, err);
                console.log("Connected successfully to server");

                const db = client.db(dbName);

                insertDocuments(db, function() {
                  client.close();
            });

          });

    res.redirect("/");
});


module.exports = router;
