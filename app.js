const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const Employee = require("./models/Employee");
const Leave = require("./models/Leave");

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

  // GET all leave requests
  app.get("/leave", async (req, res) => {
  try {
    const leaveRequests = await Leave.find().populate('employeeId');
    res.render("leave", { leaveRequests });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// POST a new leave request
app.post('/leave', async (req, res) => {
  const { employeeId, leaveType, startDate, endDate, status } = req.body;
  const newLeaveRequest = new Leave({ employeeId, leaveType, startDate, endDate, status });
  
  try {
    await newLeaveRequest.save();
    res.redirect('/leave');
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// GET form to add a leave request
app.get("/leave/add", (req, res) => {
  res.render("leaveAdd"); // Render form to add leave request
});

app.post('/leave/:id', async (req, res) => {
  console.log('Updating leave request with ID:', req.params.id);
  console.log('Update data:', req.body);

  // Extract fields from request body
  const { employeeId, leaveType, startDate, endDate, status } = req.body;

  // Validate employeeId
  if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      console.error('Invalid employeeId:', employeeId);
      return res.status(400).send("Invalid employee ID");
  }

  try {
      // Update the leave request and return the updated document
      const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, {
          employeeId,
          leaveType,
          startDate,
          endDate,
          status
      }, { new: true });

      // Check if the leave request was found and updated
      if (!updatedLeave) {
          console.log('Leave request not found');
          return res.status(404).send("Leave request not found");
      }

      res.redirect('/leave');
  } catch (error) {
      console.error('Error updating leave request:', error);
      res.status(500).send("Internal Server Error");
  }
});


// GET to delete a leave request
app.get('/leave/delete/:id', async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.redirect('/leave');
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = app;
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`app is listening on http://localhost:${PORT}`);
})