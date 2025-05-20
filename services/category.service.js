const ApiError = require('../errors/api-error');
const Category = require('../model/Category');
const Products = require('../model/Products');

// create category service
exports.createCategoryService = async (data) => {
  const category = await Category.create(data);
  return category;
}

// create all category service
exports.addAllCategoryService = async (data) => {
  await Category.deleteMany();
  const categories = await Category.insertMany(data);
  return categories;
}

// get all show category service
exports.getShowCategoryServices = async () => {
  const categories = await Category.find({ status: 'Show' })
    .populate({
      path: 'products',
      select: '_id title price discount status'
    })
    .sort({ order: 1, parent: 1 });
  
  return {
    success: true,
    result: categories
  };
}

// get all category 
exports.getAllCategoryServices = async () => {
  const categories = await Category.find({})
    .populate({
      path: 'products',
      select: '_id title price discount status'
    })
    .sort({ order: 1, parent: 1 });
  
  return {
    success: true,
    data: categories
  };
}

// get type of category service
exports.getCategoryTypeService = async (param) => {
  const categories = await Category.find({ 
    productType: param,
    status: 'Show'
  })
    .populate({
      path: 'products',
      select: '_id title price discount status'
    })
    .sort({ order: 1, parent: 1 });
  
  return {
    success: true,
    result: categories
  };
}

// delete category service
exports.deleteCategoryService = async (id) => {
  const result = await Category.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(404, 'Category not found!');
  }
  return result;
}

// update category
exports.updateCategoryService = async (id, payload) => {
  const isExist = await Category.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(404, 'Category not found!');
  }

  const result = await Category.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      runValidators: true
    }
  ).populate({
    path: 'products',
    select: '_id title price discount status'
  });
  
  return result;
}

// get single category
exports.getSingleCategoryService = async (id) => {
  const result = await Category.findById(id)
    .populate({
      path: 'products',
      select: '_id title price discount status'
    });
  
  if (!result) {
    throw new ApiError(404, 'Category not found!');
  }
  
  return result;
}