import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import {toast} from "react-hot-toast";

export const useUserStore = create((set,get) => ({
    user:null,
    loading:false,
    checkingAuth:true,

    signup: async() => {}
}))