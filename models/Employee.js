const { Schema, default: mongoose } = require("mongoose");

const empSchema = new Schema({
    name: String,
    email: String,
    phoneNo: String,
    jobTitle: String,
    department: String,
    joinDate: Date,
    salary: Number
})
const Employee = mongoose.model("empInfo",empSchema);
module.exports =Employee;