const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const Employee = require("./models/Employee");
const app = express();

//middleware chuyen du lieu thanh doi tuong
app.use(express.urlencoded({ extended: true }))
//tim dia chi cua file view
console.log("dirname: ", __dirname);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//mongodb://localhost:27017/ OR mongodb://127.0.0.1/day5DB
mongoose.connect("mongodb+srv://huongvu:123@hdb1.4wtpp.mongodb.net/?retryWrites=true&w=majority&appName=HDB1/emp_attendance")
    .then(con => console.log("connect successfully"))
    .catch(err => console.log("Error connect: ", err))


app.get("/", async (req, res) => {
    const employees = await Employee.find();
    console.log("employees:", employees);
    res.render("list", { employees });
})
//route de lay view create
app.get("/create", (req, res) => {
    res.render("create");
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`app is listening on http://localhost:${PORT}`);
})