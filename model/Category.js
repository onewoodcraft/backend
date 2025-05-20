const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const CategorySchema = mongoose.Schema({
  img: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  parent: {
    type: String,
    required: true,
    trim: true,
  },
  children: [{
    type: String,
    trim: true,
  }],
  productType: {
    type: String,
    required: true,
    enum: ['electronics', 'fashion', 'beauty', 'woodencraft', 'jewelry'],
    default: 'electronics'
  },
  type: {
    type: String,
    required: true,
    enum: [
      'main',
      'gifting',
      'chopping-boards',
      'platters',
      'trays',
      'planters',
      'bowls',
      'cake-stands'
    ],
    default: 'main'
  },
  giftingType: {
    type: String,
    required: false,
    enum: [
      'wedding',
      'corporate',
      'festive',
      'housewarming',
      'anniversary'
    ]
  },
  description: {
    type: String,
    required: false,
  },
  products: [{
    type: ObjectId,
    ref: "Products"
  }],
  status: {
    type: String,
    enum: ['Show', 'Hide'],
    default: 'Show',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug
CategorySchema.pre('save', function(next) {
  if (this.parent && !this.slug) {
    this.slug = this.parent.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
  next();
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;