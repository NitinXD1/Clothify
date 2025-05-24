import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useProductStore = create((set) => ({
        products : [],
        loading : false,

        setProducts : (products) => set({products}),
        createProduct : async(productData) => {
            set({loading : true})
            try {
                
                const res = await axios.post("/products",productData)
                set((prev) => ({
                    products : [...prev.products,res.data.product],
                    loading : false
                }))

            } catch (error) {
                toast.error(error.response.data.error)
                set({loading : false})
            }
        },

        fetchAllProducts : async() => {
            set({loading : true})
            try {
                const res = await axios.get("/products")
                set({products : res.data.products , loading : false})
            } catch (error) {
                set({loading : false})
                toast.error(error.res.data.error || "Failed to fetch products")
            }
        },

        deleteProduct : async(id) => {
            set({loading : true})
            try {
                const res = await axios.delete(`/products/${id}`)
                set((prevProduct) => ({
                    products : prevProduct.products.filter( (product) => product._id !== id),
                    loading : false
                }))
            } catch (error) {
                set({loading:false})
                toast.error(error.response.data.error || "Failed to delete the Product")                
            }
        },

        toggleFeaturedProduct : async(id) => {
            set({loading : true})
            try {
                const res = await axios.patch(`/products/${id}`);
                set((prevProduct) => ({
                    products : prevProduct.products.map((product) => (
                        product._id === id ? {...product , isFeatured: res.data.product.isFeatured} : product
                    )),
                    loading : false
                }))
            } catch (error) {
                set({loading:false})
                toast.error(error.response.data.error || "Failed to feature the product") 
            }
        },

        fetchProductsByCategory : async(category) => {
            set({loading : true})
            try {
                const res = await axios.get(`/products/category/${category}`)
                console.log(res)
                set({products : res.data.products , loading : false})            
            } catch (error) {
                set({loading : false})
                toast.error(error.response.data.error || "Failed to Fetch the products")
            }
        },

        fetchFeaturedProducts: async () => {
            set({ loading: true, error: null });
            try {
                const response = await axios.get('/products/featured');
                set({ products: response.data, loading: false });
            } catch (error) {
                console.error("Error fetching featured products:", error);
                set({ error: "Failed to fetch products", loading: false });
            }
        }

    }    
)) 