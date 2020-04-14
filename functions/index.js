const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://article-rest-api.firebaseio.com"
});

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use(cors({ origin: true }));

app.use('/api', require('./api/routes/blogs'));
app.use('/api', require('./api/routes/comments'));

exports.app = functions.https.onRequest(app);

