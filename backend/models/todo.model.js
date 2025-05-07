import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // 🔄 'require' → 'required'
    },
    description: {
        type: String,
        default: '',
    },
    dueDate: {
        type: Date,
        default: null,
    },
    category: {
        type: String,
        default: 'Personal',
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// ✅ Use `export default` instead of `module.exports`
const Todo = mongoose.model('Todo', todoSchema);
export default Todo;
