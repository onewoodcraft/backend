const Category = require('../model/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    
    if (type) {
      query.type = type;
    }

    const categories = await Category.find(query)
      .sort({ order: 1, name: 1 })
      .populate('products');

    res.status(200).json({
      status: 'success',
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get a single category by ID or slug
exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let category;

    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await Category.findById(id).populate('products');
    } else {
      category = await Category.findOne({ slug: id }).populate('products');
    }

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get featured categories
exports.getFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ featured: true })
      .sort({ order: 1, name: 1 })
      .populate('products');

    res.status(200).json({
      status: 'success',
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}; 