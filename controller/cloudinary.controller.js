const fs = require("fs");
const { cloudinaryServices } = require("../services/cloudinary.service");

// add image
const saveImageCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed"
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB"
      });
    }

    const result = await cloudinaryServices.cloudinaryImageUpload(req.file.buffer);
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        id: result.public_id
      }
    });
  } catch (err) {
    console.error("Image upload error:", err);
    next(err);
  }
};

// add multiple images
const addMultipleImageCloudinary = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images provided"
      });
    }

    // Validate each file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of req.files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type for ${file.originalname}. Only JPEG, PNG, GIF, and WebP images are allowed`
        });
      }
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File ${file.originalname} is too large. Maximum size is 5MB`
        });
      }
    }

    const uploadResults = [];
    for (const file of req.files) {
      const result = await cloudinaryServices.cloudinaryImageUpload(file.buffer);
      uploadResults.push({
        url: result.secure_url,
        id: result.public_id,
        originalName: file.originalname
      });
    }

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: uploadResults
    });
  } catch (err) {
    console.error("Multiple image upload error:", err);
    next(err);
  }
};

// delete image
const cloudinaryDeleteController = async (req, res, next) => {
  try {
    const { folder_name, id } = req.query;
    
    if (!folder_name || !id) {
      return res.status(400).json({
        success: false,
        message: "Both folder_name and id are required"
      });
    }

    const public_id = `${folder_name}/${id}`;
    const result = await cloudinaryServices.cloudinaryImageDelete(public_id);
    
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: result
    });
  } catch (err) {
    console.error("Image delete error:", err);
    next(err);
  }
};

exports.cloudinaryController = {
  cloudinaryDeleteController,
  saveImageCloudinary,
  addMultipleImageCloudinary,
};
