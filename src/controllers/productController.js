exports.bulkCreateProducts = async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No products provided'
      });
    }

    // Validate each product
    for (const product of products) {
      if (!product.name || !product.price || !product.category) {
        return res.status(400).json({
          success: false,
          message: 'Each product must have name, price, and category'
        });
      }
    }

    // Create all products
    const createdProducts = await Product.insertMany(products);

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdProducts.length} products`,
      data: createdProducts
    });
  } catch (error) {
    console.error('Bulk product creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating products',
      error: error.message
    });
  }
}; 