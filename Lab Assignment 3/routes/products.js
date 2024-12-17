const express = require('express');
const multer = require("multer");
const router = express.Router();
const Product = require('../models/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads"); // Directory to store files
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
});
const upload = multer({ storage: storage });

// Render Create Product Form
router.get('/products/create', async (req, res) => {
    res.render('admin/products/create', { layout: "layout/formslayout" });
});

// Handle Create Product Request
router.post("/products/create", upload.single("file"), async (req, res) => {
    const pro = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        picture: req.file ? req.file.filename : null,
    }); 
    await pro.save();
    res.redirect("/products");
});

// Render List of Products with Pagination
router.get('/products', async (req, res) => {
    let page = req.query.page ? Number(req.query.page) : 1; // Current page
    let pageSize = 5; // Number of products per page

    // Fetch products for the current page
    let products = await Product.find()
        .limit(pageSize)
        .skip((page - 1) * pageSize);

    // Get total number of products to calculate total pages
    let totalRecords = await Product.countDocuments();
    let totalPages = Math.ceil(totalRecords / pageSize);

    // Define pagination object
    let pagination = {
        currentPage: page,
        totalPages: totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
    };

    // Pass pagination to the template
    res.render('admin/products/products', {
        layout: "layout/formslayout",
        products,
        pagination, // Send pagination object
    });
});


// Edit Product Form
router.get('/products/edit/:id', async (req, res) => {
    const pro = await Product.findById(req.params.id);
    res.render("admin/products/editProduct", { pro, layout: "layout/formslayout" });
});

// Handle Edit Product Request
// router.post('/products/edit/:id', async (req, res) => {
//     await Product.findByIdAndUpdate(req.params.id, req.body);
//     if (req.file) newProduct.picture = req.file.filename;
//     res.redirect('/products');
// });
router.post('/products/edit/:id', upload.single("file"), async (req, res) => {
    try {
        const updatedData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
        };

        // If a new file is uploaded, add the picture field
        if (req.file) {
            updatedData.picture = req.file.filename;
        }

        // Update the product with the new data
        await Product.findByIdAndUpdate(req.params.id, updatedData);

        res.redirect('/products');
    } catch (err) {
        res.status(500).send("Error updating the product: " + err.message);
    }
});


// Delete Product
router.get("/products/delete/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("back");
});

// Pagination for Products (optional, based on your URL structure)
router.get("/products/:page?", async (req, res) => {
    let page = req.params.page ? Number(req.params.page) : 1; // Current page
    let pageSize = 5; // Items per page

    // Fetch products for the current page
    let products = await Product.find()
        .limit(pageSize)
        .skip((page - 1) * pageSize);

    // Get total records to calculate total pages
    let totalRecords = await Product.countDocuments();
    let totalPages = Math.ceil(totalRecords / pageSize);

    // Define pagination object
    let pagination = {
        currentPage: page,
        totalPages: totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
    };

    // Render template with products and pagination data
    res.render("admin/products/products", {
        products,
        pagination, // Pass pagination object
    });
});

module.exports = router;
