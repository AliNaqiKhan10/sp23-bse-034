const express = require('express');
const mongoose = require('mongoose');
const layouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const Product = require('./models/product')

const app = express(); // Initialize app

// Middleware
app.use(express.static('public')); // Serve static files
app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.set('view engine', 'ejs'); // Set view engine to EJS
app.use(layouts); // Use EJS layouts

// Connect to MongoDB
let connectionString = 'mongodb://localhost:27017/panel';

mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`Connected To: ${connectionString}`);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
const prodRout = require('./routes/products'); // Import routes
app.use(prodRout); // Use product routes with a base path
const categoryRout = require('./routes/categories');
app.use(categoryRout); 

// Home Route
app.get('/home', async (req, res) => {
  let product = await  Product.find()

  res.render('index' , {product}); // Render index.ejs
});

// Admin Route
app.get('/admin', (req, res) => {
  res.render('admin/dashboard', { layout: 'layout/formslayout' }); // Render admin dashboard with a custom layout
});
app.get('/', (req, res) => {
  res.render('admin/dashboard', { layout: 'layout/formslayout' }); // Render admin dashboard with a custom layout
});

// Start Server
app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
