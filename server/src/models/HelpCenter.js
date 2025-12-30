import mongoose from "mongoose";

const helpCenterSchema=new mongoose.Schema({
    title:{type:String, default:""}
})

export default mongoose.model("HelpCenter",helpCenterSchema)