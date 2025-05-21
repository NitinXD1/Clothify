import { create } from "zustand";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
        products : [],
        loading : null,

        setProducts : (products) => set({products}),
        createProduct : async() => {
            set({loading : true})
        }
    }    
)) 