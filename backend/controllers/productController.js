const Product = require("../models/productModel");
const ErrorHandelor = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// create product --admin
exports.createProduct = catchAsyncError(async(req,res,next)=>{

  let images = [];

  if(typeof req.body.images === "string"){
    images.push(req.body.images);
  }
  else{
    images = req.body.images;
  }

  const imageLink = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imageLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
    
  }

  req.body.images = imageLink;
  req.body.user = req.user.id;

    req.body.user = req.user.id;


    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product,
    });
});


// get all product
exports.getAllProducts = catchAsyncError(async(req,res, next)=>{

    // result per page
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();


    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();

    let products = await apiFeature.query;
    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query.clone();

    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// get all product --ADMIN
exports.getAdminProducts = catchAsyncError(async(req,res, next)=>{

  const  products = await Product.find();

    res.status(200).json({
        success:true,
        products,
    });
});

// get product detials
exports.getProductDetials = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandelor("product not found",404));
    }

    res.status(200).json({
        success: true,
        product
    });
});

// update product -- admin
exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandelor("product not found",404));
    }

    // image setup
    let images = [];

    if(typeof req.body.images === "string"){
      images.push(req.body.images);
    }
    else{
      images = req.body.images;
    }  

    if(images !== undefined){

      // delete images from cloudinary
      for (let i  = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
      const imageLink = [];
      
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
        
        imageLink.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = imageLink;
      
    }


    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true, 
        runValidators: true, 
        useFindAndModify: false
    });

    res.status(200).json({
        success:true,
        product
    });
});


// delete product

exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandelor("product not found",404));
    }

    // cloudinary delete
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message:"product Deleted"
    })
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHandelor("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  

  
// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandelor("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
});