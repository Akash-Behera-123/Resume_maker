import mongoose from "mongoose";

const  ResumeSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    title:{type:String,default: 'Untitled Resume'},
    public:{type:Boolean,default:false},
})