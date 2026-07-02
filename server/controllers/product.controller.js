import Product from "../models/product.model.js";

export  const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      brand,
      category,
      stock,
      isActive
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !brand ||
      !category ||
      !stock
    ) {
      return res.status(400).json({
        success: false,
        message: "These fields are required",
      });
    }
    const images=req.files?req.files.map(file=>file.path):[];
    console.log(req.files);
   const product = await Product.create({
  name,
  description,
  price,
  brand,
  category,
  stock,
  isActive,
  images,
  seller: req.user._id
});


       return res.status(201).json({
  success: true,
  message: 'Product created successfully',
  data: { product }  // just send the whole product
});
  } catch (error) {
  return res.status(500).json({ success: false, message: error.message });
}
};

export const getAllProducts=async (req,res) => {
  try {
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||10;
    const skip=(page-1)*limit;

    // YOUR TURN:
    // 1. Find all products, skip and limit
    const products=await Product.find().skip(skip).limit(limit);
    // 2. Count total products
    const total=await Product.countDocuments();
    // 3. Send response with products + pagination info
    return res.status(200).json({
      success:true,
      page:page,
      limit:limit,
      totalPages:Math.ceil(total/limit),
      data:products
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export const getProductById=async (req,res) => {
  try {
    const id=req.params.id;
    const product=await Product.findById(id);
    if(!product){
     return res.status(404).json({
        success:false,
        message:"Product Not Found"
      })
    }

    return res.status(200).json({
      success:true,
      data:product
    })
  }catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export const updateProduct=async(req,res)=>{
  try {
    const id=req.params.id;
    const details=req.body;
    const product=await Product.findById(id);
    if(!product){
       return res.status(404).json({
        success:false,
        message:"Product Not Found"
      })
    }
    if(!(product.seller.toString()===req.user._id.toString())){
      return res.status(403).json({
        success:false,
        message:"You do have acces to update this product"
      })
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
     return res.status(200).json({
      success:true,
      message:"Product updated Successfully",
      data:updatedProduct
    })

  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}
export const deleteProduct=async(req,res)=>{
  try {
    const id=req.params.id;
   
    const product=await Product.findById(id);
    if(!product){
       return res.status(404).json({
        success:false,
        message:"Product Not Found"
      })
    }
    if(product.seller.toString()!==req.user._id.toString() && req.user.role !== 'admin'){
      return res.status(403).json({
        success:false,
        message:"You do have acces to update this product"
      })
    }
     await Product.findByIdAndDelete(id);
    return res.status(200).json({
      success:true,
      message:"Product deleted Successfully",
      data:product
    })

  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}