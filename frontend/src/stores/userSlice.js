import { createSlice } from "@reduxjs/toolkit";
import { LogOut } from "lucide-react";

const userSlice = createSlice({
    name:"user",
    initialState:{
        user: null,
        loading: null,
        error: null
    },
    reducers:{
        setUser: (state,action)=>
        {
            state.user = action.payload;
        },
        setLoading: (state,action)=>
        {
            state.loading = action.payload;
        },
        setError: (state,action)=>
        {
            state.error = action.payload;
        },
        logOut: (state) =>{
            state.user = null;
            state.error = null;
            state.loading = false;

        }
    }
})

export const{setUser, setLoading,setError,logOut} = userSlice.actions;
export default userSlice.reducer;