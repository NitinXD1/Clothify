import { create } from "zustand";
import axios from "../lib/axios.js";
import {toast} from "react-hot-toast";
import { useCartStore } from "./useCartStore.js";

export const useUserStore = create((set,get) => ({
    user:null,
    loading:false,
    checkingAuth:true,

    signup: async(name,email,password,confirmPassword) => {
        set({loading : true})

        if(password !== confirmPassword){
            set({loading:false})
            return toast.error("Passwords do not match")
        }

        try{
            const res = await axios.post("/auth/signup" , {name,email,password})
            set({user : res.data.user , loading : false})
        }
        catch(error){
            set({loading : false})
            toast.error(error.response.data.message || "An error occurred")
        }
    },

    login : async(email,password) => {
        try{
            
            set({loading : true})

            if(!email.includes('@')){
                set({loading : false})
                return toast.error("@ is necessary for emails")
            }

            const res = await axios.post("/auth/login" , {email,password})
            set({user : res.data.user , loading : false})
            toast.success("Logged In Successfully")
            await useCartStore.getState().getCartItems()
        }
        catch(error){
            set({loading : false})
            toast.error(error?.response?.data?.error) || "Something went wrong"
        }
    },

    logout : async() => {
        try {
            const res = await axios.post("/auth/logout")
            set({user : null})
        } catch (error) {
            console.log(error.data.message || "Something went wrong")
        }
    },

    checkAuth : async() => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

    //refreshing tokens using intercepters
}))