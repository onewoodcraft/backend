const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
// schema design
const validator = require("validator");

const productsSchema = mongoose.Schema({
  sku: {
    type: String,
    required: false,
  },
  img:{
    type: String,
    required: true,
    validate: [validator.isURL, "Please provide valid url(s)"]
  },
  title: {
    type: String,
    required: [true, "Please provide a name for this product."],
    trim: true,
    minLength: [3, "Name must be at least 3 characters."],
    maxLength: [200, "Name is too large"],
  },
  slug: {
    type: String,
    trim: true,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  imageURLs: [{
    color:{
      name:{
        type: String,
        required: false,
        trim: true,
      },
      clrCode:{
        type: String,
        required: false,
        trim: true,
      }
    },
    img:{
      type: String,
      required: false,
      validate: [validator.isURL, "Please provide valid url(s)"]
    },
    sizes:[String]
  }],
  category: {
    id: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    }
  },
  giftingCategory: {
    id: {
      type: ObjectId,
      ref: "Category",
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    }
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Product price can't be negative"]
  },
  priceINR: {
    type: Number,
    required: true,
    min: [0, "Product price can't be negative"]
  },
  discount: {
    type: Number,
    min: [0, "Product price can't be negative"]
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, "Product quantity can't be negative"]
  },
  brand: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: ObjectId,
      ref: "Brand",
      required: true,
    }
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["in-stock", "out-of-stock", "discontinued"],
      message: "status can't be {VALUE} "
    },
    default: "in-stock",
  },
  reviews: [{type:ObjectId, ref: 'Reviews' }],
  productType:{
    type:String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true
  },
  videoId: {
    type: String,
    required: false
  },
  additionalInformation: [{}],
  materials: [String],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },
  care: [String],
  tags: [String],
  sizes: [String],
  offerDate:{
    startDate:{
      type:Date
    },
    endDate:{
      type:Date
    },
  },
  featured: {
    type: Boolean,
    default: false,
  },
  sellCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
})

// Pre-save middleware to generate slug and calculate INR price
productsSchema.pre('save', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  if (this.price && (!this.priceINR || this.isModified('price'))) {
    const conversionRate = 83;
    this.priceINR = this.price * conversionRate;
  }

  next();
});

const Products = mongoose.model('Products', productsSchema)

module.exports = Products;