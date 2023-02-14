const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
const header = require('./header');
const fileUpload = require('express-fileupload');
const AdminRoute = require('./src/App/Routes');
const app = express(); // Initialize our express app
const port = process.env.PORT || 8000;
app.use(cors());
app.use(fileUpload());
app.use('/admin', AdminRoute); //Admin Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use(header);
app.use(express.urlencoded({ extended: false }));

global.__basedir = __dirname;

app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Mongo DB connection
mongoose.Promise = global.Promise; // Return promise inside app
const devDbUrl =
  // 'mongodb+srv://arpit:arpit12345@cluster0.g6qkt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
  'mongodb+srv://arpit:arpit12345@bartermate.mttz26t.mongodb.net/?retryWrites=true&w=majority'

mongoose
  .connect(devDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongodb Connection establish.');
    app.listen(port, () => {
      console.log(`App listening at ${port}`);
    });
  })
  .catch((err) => {
    console.log('Connection Error => ', err.message);
  });
