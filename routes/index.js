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

router.get('/quanly/del/:id', function(req, res, next) {
  var id = req.params.id;
    var ObjectId = require('mongodb').ObjectId;
    var o_id = new ObjectId(id);


    const removeDocument = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('documents');
        // Delete document where a is 3
        collection.deleteOne({ _id : o_id }, function(err, result) {
            assert.equal(err, null);

        });
    }
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);

        const db = client.db(dbName);

        removeDocument(db, function() {
            client.close();
        });

    });

    res.redirect("/quanly");


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
router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id
    var ObjectId = require('mongodb').ObjectId;
    var o_id = new ObjectId(id);

    const findDocuments = function(db, callback) {
        const collection = db.collection('documents');
        collection.find({_id : o_id }).toArray(function(err, docs) {
            assert.equal(err, null);
            callback(docs);
        });
    }
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        findDocuments(db, function(data) {
            res.render('edit',{data : data[0]});

            client.close();
        });
    });

});
router.post('/edit/:id', function(req, res, next) {
    var id = req.params.id
    var ObjectId = require('mongodb').ObjectId;
    var o_id = new ObjectId(id);
    var data = {
        'username' : req.body.txtFullName,
        'link'     : req.body.txtLink,
        'email'     : req.body.txtemail,
        'intro'     : req.body.txtIntro,
        'titlevideo'  : req.body.txtnamevideo

    };

    const updateDocument = function(db, callback) {
        const collection = db.collection('documents');
        collection.updateOne({ _id : o_id }
            , { $set: data }, function(err, result) {
                assert.equal(err, null);
                callback(result);
            });
    }

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);

        const db = client.db(dbName);

        updateDocument(db, function() {
            client.close();
        });

    });

    res.redirect("/quanly");
    });





router.get('/upload', function(req, res, next) {
    res.render('upload');
});
router.post('/upload', function(req, res, next) {
      var data = {
          'username' : req.body.txtFullName,
          'link'     : req.body.txtLink,
          'email'     : req.body.txtemail,
          'intro'     : req.body.txtIntro,
          'titlevideo'  : req.body.txtnamevideo

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

    res.redirect("/quanly");
});


module.exports = router;
