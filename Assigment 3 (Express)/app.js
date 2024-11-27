const express = require('express');
const app = express();
const path = require('path');

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory where EJS templates are stored
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route for Checkout Page
app.get('/checkout', (req, res) => {
    res.render('layout', {
        title: 'Checkout | ETHNC',
        content: 'checkout'  // This includes the checkout.ejs file
    });
});

// Route for Home Page
app.get('/', (req, res) => {
    res.render('layout', {
        title: 'Home Page - Express Server',
        content: 'home'  // This includes the checkout.ejs file
    });
});

// Route for CV Page
app.get('/cv', (req, res) => {
    res.render('layout', {
        title: 'CV - Ali Naqi Khan',
        content: 'cv'  // This includes the cv.ejs file
    });
});

// Route for Landing Page
app.get('/landing', (req, res) => {
    res.render('layout', {
        title: 'Landing Page | Ethnc',
        content: 'landingpage'  // This includes the landingpage.ejs file
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
