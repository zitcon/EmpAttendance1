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
mongoose.connect("mongodb://127.0.0.1/emp_attendance")
    .then(con => console.log("connect successfully"))
    .catch(err => console.log("Error connect: ", err))


app.get("/", async (req, res) => {
    const employees = await Employee.find();
    console.log("employees:", employees);
    res.render("employeeList", { employees });
})

// app.post("/addEmp",async(req,res)=>{
//     const data = req.body;
//     console.log("data: ", data);
//     await Employee.create(data)
//         .then(result=>{
//             res.redirect("/")
//         })
//         .catch(error=>console.log("error create employees: ", error))
//     //res.render("create");
// })
app.post('/addEmp', async (req, res) => {
    const { name, email, phoneNo, jobTitle, department, joinDate, salary } = req.body;
    const newEmployee = new Employee({ name, email, phoneNo, jobTitle, department, joinDate, salary });
    await newEmployee.save();
    res.redirect('/');
  });

//route de lay view create
app.get("/addEmp", (req, res) => {
    res.render("employeeAdd");
})

// GET: Form để sửa nhân viên
app.get('/editEmp/:id', async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    res.render('employeeEdit', { employee }); // render form sửa nhân viên
  });
  
  // POST: Cập nhật thông tin nhân viên
  app.post('/editEmp/:id', async (req, res) => {
    const { name, email, phoneNo, jobTitle, department, joinDate, salary } = req.body;
    await Employee.findByIdAndUpdate(req.params.id, { name, email, phoneNo, jobTitle, department, joinDate, salary });
    res.redirect('/');
  });
  
  // GET: Xóa nhân viên
  app.get('/deleteEmp/:id', async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/');
  });

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`app is listening on http://localhost:${PORT}`);
})