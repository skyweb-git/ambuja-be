import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => "emp-" + Date.now().toString(36),
    },
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
      index: true,
    },
    department: {
      type: String,
      default: "Marketing & Sales",
    },
    designation: {
      type: String,
      default: "Sales & Marketing Executive",
    },
    phone: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      index: true,
    },
    avatar: {
      type: String,
      default: "💼",
    },
    dailyCallTarget: {
      type: Number,
      default: 30,
    },
    dailyEmailTarget: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model("Employee", employeeSchema);
