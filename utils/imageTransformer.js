/**
 * Utility functions for transforming image URLs in product responses
 */

// Check if the URL is valid
const isValidUrl = (url) => {
  try {
    if (!url) return false;
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Get a fallback image based on product type
const getFallbackImage = (productType) => {
  const fallbacks = {
    'chopping-boards': '/assets/img/product/chopping-board-placeholder.jpg',
    'platters': '/assets/img/product/platter-placeholder.jpg',
    'bowls': '/assets/img/product/bowl-placeholder.jpg',
    'gifting': '/assets/img/product/gift-placeholder.jpg',
    'wedding': '/assets/img/product/wedding-gift-placeholder.jpg',
    'corporate': '/assets/img/product/corporate-gift-placeholder.jpg',
    'festive': '/assets/img/product/festive-gift-placeholder.jpg',
    'default': '/assets/img/product/placeholder.jpg'
  };
  
  return fallbacks[productType] || fallbacks.default;
};

// Transform an individual image URL
const transformImageUrl = (url, productType) => {
  if (!url) return getFallbackImage(productType);
  
  // If already valid URL, return as is
  if (isValidUrl(url)) return url;
  
  // If URL starts with /, it's a relative path
  if (url.startsWith('/')) return url;
  
  // Add proper prefix for relative paths
  return `/assets/img/product/${url}`;
};

// Transform product object with all its images
const transformProductImages = (product) => {
  if (!product) return product;
  
  const productObj = product.toObject ? product.toObject() : { ...product };
  const productType = productObj.productType || 'default';
  
  // Transform main image
  productObj.img = transformImageUrl(productObj.img, productType);
  
  // Transform imageURLs array if it exists
  if (productObj.imageURLs && Array.isArray(productObj.imageURLs)) {
    productObj.imageURLs = productObj.imageURLs.map(item => {
      return {
        ...item,
        img: transformImageUrl(item.img, productType)
      };
    });
  }
  
  return productObj;
};

// Transform array of products
const transformProductsImages = (products) => {
  if (!products || !Array.isArray(products)) return products;
  return products.map(product => transformProductImages(product));
};

module.exports = {
  transformImageUrl,
  transformProductImages,
  transformProductsImages,
  getFallbackImage
}; 