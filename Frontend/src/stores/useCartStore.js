import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

export const useCartStore = create((set,get) =>({
        cart : [],
        coupon : null,
        total : 0,
        subtotal : 0,
        isCouponApplied : false,
        
        getCartItems : async() => {
            try {
                const res = await axios.get("/cart")
                set({cart : res.data.cartItems})
                get().calculateTotals()
            } catch (error) {
                set({cart : []})
                toast.error(error.response.data.message || "An error Occured")
            }
        },

        addToCart : async(product) => {
            try {
                await axios.post('/cart',{productId : product._id});
                toast.success("Product added to cart successfully")

                set((prevState) => {
                    const existingItem = prevState.cart.find((item) => item._id === product._id)
                    const newCart = existingItem 
                    ? prevState.cart.map((item) => (item._id === product._id ? {...item , quantity : item.quantity+1} : item))
                    : [...prevState.cart , {...product , quantity : 1}];
                    return {cart : newCart} 
                })

                get().calculateTotals();
            } catch (error) {
                toast.error(error.response.data.message || "Something went wrong while adding to the cart")
            }
        },

        calculateTotals : () => {
            const {cart,coupon} = get()

            let subtotal = 0;
            cart.forEach((product) => subtotal += product.price * product.quantity)
            let total = subtotal;
            if(coupon){
                const discount = (subtotal * coupon.discountPercentage)/100
                total = subtotal - discount
            }

            set({total,subtotal})
        },

        updateQuantity : async (productId , quantity) => {
            try {
                if(quantity === 0){
                    get().removeFromCart(productId)
                    return
                }
                
                await axios.put(`/cart/${productId}`,{quantity})

                set((prevState) => ({
                    cart : prevState.cart.map((item) => item._id === productId ? {...item , quantity} : item)
                }))

                get().calculateTotals()
            } catch (error) {
                toast.error(error.response.data.message)
            }

        },

        removeFromCart : async (productId) => {
            try {
                await axios.delete('/cart',{ data: { productId } })
                const {cart} = get()
                const updatedCart = cart.filter((item) => item._id !== productId)

                set({cart : updatedCart})

                get().calculateTotals()

                toast.success("Item removed successfully from the cart")
            } catch (error) {
                toast.error(error.response.data.message || "Failed to remove the item")
            }
        },

        clearCart : async() => {
            set({cart : [] , subtotal : 0 , total : 0 , coupon : null})
        },

        getMyCoupon: async () => {
            try {
                const res = await axios.get('/coupon')
                const coupons = res.data

                if (Array.isArray(coupons) && coupons.length > 0) {
                    set({ coupon: coupons[0] }) 
                } else {
                    set({ coupon: null })
                }
            } catch (error) {
                console.error("Error fetching coupons:", error)
                toast.error("Failed to fetch coupons")
            }
        },

        applyCoupon : async(code) => {
            try {
                const res = await axios.post('/coupon/validate',{code})
                set({coupon : res.data, isCouponApplied : true})
                get().calculateTotals()
                toast.success("Coupon Applied Successfully")
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to apply coupon")
            }
        },

        removeCoupon : async() => {
            set({coupon:null,isCouponApplied:false})
            get().calculateTotals()
            toast.success("Coupon removed successfully")
        }
    }),
)
