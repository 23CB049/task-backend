import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["completed", "incomplete"],
    default: "incomplete",
  },
  archived: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
 startDate: {
    type: Date,
    required: [true, "Please provide a start date"],
    get: (date) => date?.toISOString().slice(0, 16), // Format: "YYYY-MM-DDTHH:mm"
  },
  dueDate: {
    type: Date,
    required: [true, "Please provide a due date"],
    get: (date) => date?.toISOString().slice(0, 16),
    validate: {
      validator: function(value) {
        if (this.startDate && value < this.startDate) {
          return false;
        }
        return true;
      },
      message: "Due date must be after or equal to start date"
    }
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }, {
    timestamps: true,
    toJSON: { getters: true }, // Enable getters when converting to JSON
    toObject: { getters: true }
  });

export const Task = mongoose.model("Task", taskSchema);