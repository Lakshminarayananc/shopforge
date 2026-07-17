import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js"

export const addToCart=async (req,res) => {
  console.log('BODY:', req.body);
console.log('HEADERS:', req.headers['content-type']);
    try {
        const{productId,quantity}=req.body;

    if(!productId||!quantity){
        return res.status(400).json({
             success: false,
        message: "These fields are required",
        })
    }

    let cart=await Cart.findOne({user:req.user._id})
    console.log(cart)
    if (!cart) {
  // cart doesn't exist yet — create a new one
   cart= await Cart.create({
    user:req.user._id,
    items:[],
    totalPrice:0
  })
} 
  // cart exists — check if product already in items
  const existingItem=cart.items.find(item=>item.product.toString()===productId)

  if(existingItem){
    existingItem.quantity+=quantity
  }
  else{
    const product=await Product.findById(productId);
    if(!product){
       return res.status(404).json({
        success:false,message:'Product not found'
      })
    }
    cart.items.push({
      product:productId,
      quantity,
      price:product.price
    })
  }
  cart.totalPrice=cart.items.reduce((total,item)=>{
    return total+item.price*item.quantity
  },0);
  await cart.save();
  return res.status(200).json({
    success:true,
    message:'Cart updated successfully',
    data:{cart}
  })
    } catch (error) {
  return res.status(500).json({ success: false, message: error.message });
}
}
export const getCart=async (req,res) => {
  try {
    let cart=await Cart.findOne({user:req.user._id}).populate('items.product','name images price')
if(!cart){
  return res.status(200).json({
    success:true,message:'Cart is empty',
    data:{
      cart:{items:[],totalPrice:0}
    }
  })
}
return res.status(200).json({
  success:true,data:{cart}
})
  } catch (error) {
     return res.status(500).json({ success: false, message: error.message });
  }
}  
export const removeFromCart =async (req,res) => {
  try {
    const productId=req.params.id
let cart = await Cart.findOne({ user: req.user._id });
    if(!cart){
  return res.status(200).json({
    success:false,message:'Cart Not Found',
    
  })
}
    cart.items=cart.items.filter(item=>item.product.toString()!==productId)
    cart.totalPrice=cart.items.reduce((total,item)=>{
    return total+item.price*item.quantity
  },0);

  await cart.save();
// Add this:
return res.status(200).json({
  success: true,
  message: 'Item removed from cart',
  data: { cart }
});
  } catch (error) {
  return res.status(500).json({ success: false, message: error.message });
}
}
export const updateQuantity =async (req,res) => {
  try {
    const {productId,quantity} =req.body;
    let cart=await Cart.findOne({user:req.user._id});
    if (!cart) {
  return res.status(404).json({ success: false, message: 'Cart not found' });
}
    const existingItem=cart.items.find(item=>item.product.toString()===productId)
    if(existingItem){
    existingItem.quantity=quantity
  }
  else{
    const product=await Product.findById(productId);
    if(!product){
       return res.status(404).json({
        success:false,message:'Product not found'
      })
    }
  }
  cart.totalPrice=cart.items.reduce((total,item)=>{
     return total+item.price*item.quantity
  },0)
  await cart.save()
  return res.status(200).json({
    success:true,
    message:'Cart updated successfully',
    data:{cart}
  })
  } catch (error) {
  return res.status(500).json({ success: false, message: error.message });
}
}
export const clearCart =async (req,res) => {
  try {
     let cart=await Cart.findOne({user:req.user._id});
     cart.items=[];
     cart.totalPrice=0;
       await cart.save()
       return res.status(200).json({
    success:true,
    message:'Cart updated successfully',
    data:{cart}
  })
  }catch (error) {
  return res.status(500).json({ success: false, message: error.message });
}
}