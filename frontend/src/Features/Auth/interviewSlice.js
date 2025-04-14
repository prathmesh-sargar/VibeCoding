import { createSlice } from "@reduxjs/toolkit";


const interviewSlice = createSlice({
    name:"interview",
    initialState:{
        AIquestions:{},
        userInterviews :[],
        singleInterview:{}
    },
    reducers:{
        // actions 
        setAIquestions: (state,action)=>{
            state.AIquestions = action.payload;
        },
        setUserInterviews :(state,action)=>{
            state.userInterviews = action.payload
        },
        setSingleInterview :(state,action)=>{
            state.singleInterview = action.payload;
        }
    }
})

export const {setAIquestions,setUserInterviews,setSingleInterview} = interviewSlice.actions;
export default interviewSlice.reducer;