import mongoose from "mongoose";
import { Employee } from "../models/Employee.js";

const buildIdQuery = (id) => {
  if (!id) return { _id: null };
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ id: id }, { _id: id }] };
  }
  return { id: id };
};

// GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch employees", error: error.message });
  }
};

// POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, department, designation, phone, status, avatar, dailyCallTarget, dailyEmailTarget } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const existing = await Employee.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "An employee with this email already exists" });
    }

    const employee = new Employee({
      id: req.body.id || ("emp-" + Date.now().toString(36)),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password || "welcome123",
      role: role || "employee",
      department: department || "Marketing & Sales",
      designation: designation || "Sales & Marketing Executive",
      phone: phone || "",
      status: status || "Active",
      avatar: avatar || "💼",
      dailyCallTarget: Number(dailyCallTarget) || 30,
      dailyEmailTarget: Number(dailyEmailTarget) || 20,
    });

    const saved = await employee.save();
    res.status(201).json({ success: true, message: "Employee registered successfully", data: saved });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ success: false, message: "Failed to create employee", error: error.message });
  }
};

// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, message: "Employee updated", data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update employee", error: error.message });
  }
};

// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete(buildIdQuery(req.params.id));
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    res.json({ success: true, message: "Employee removed", data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete employee", error: error.message });
  }
};
