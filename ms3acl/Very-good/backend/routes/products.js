const express = require('express');
const {
    createProduct,
    getProducts,
    searchbyname,
    getavailableProducts,
    putProducts,
    filterProductsByPrice,deleteProductsBySeller,addReviewToProduct ,
    archiveProduct,
    unarchiveProduct,uploadPhoto,getProductNameById,getfullproductbyid
} = require('../controllers/productController');
const uploadProduct = require('../middlewares/uploadMiddlewareProduct'); // middleware is different from the controller, something the controller uses

const router = express.Router();
router.post('/uploadPhoto/:id', 
    uploadProduct.single('photo'), // Only one file named 'photo'
    uploadPhoto // Controller function to handle storing the photo URL in the database
);
router.get('/fetchproductNameandIDbyID/:productId',getProductNameById)
router.get('/', getProducts);
router.get('/available', getavailableProducts);
router.get('/FetchTheEntireProductById/:productId',getfullproductbyid);
// Distinct paths for archive and unarchive
router.patch('/:id/archive', archiveProduct);
router.patch('/:id/unarchive', unarchiveProduct);
router.post('/review',addReviewToProduct)
router.delete('/:sellerId/products', deleteProductsBySeller);

router.post('/', createProduct);
router.get('/search', searchbyname);

router.patch('/:sellerId/products/:productId', putProducts);  // Update product route

// Filter products by price
router.get('/filter', filterProductsByPrice);


module.exports = router;
