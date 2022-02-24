const router = require('express').Router(),
      products = require('../model/Product');

// Create Products
router.post('/products/:id', async (req, res)=>{
        const newProduct = await products(req.body);
        try{
            const product = newProduct.save();
            res.status(200).json(product)
        }catch(err){
            res.status(400).json(err);
        }
})

// Get products
router.get('/product/:id', (req, res)=>{
    try {
        const product = await products.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const New = req.query.new;
    const Category = req.query.category;
    try {
    let products;

    if (New) {
        products = await products.find().sort({ createdAt: -1 }).limit(1);
    } else if (Category) {
        products = await products.find({
            categories: {
                $in: [Category],
            },
        });
    } else {
        products = await products.find();
    }

    res.status(200).json(products);
    } catch (err) {
    res.status(500).json(err);
    }
});
module.exports = router;