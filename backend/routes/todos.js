import express from "express"
const router = express.Router();
import Todo from '../models/todo.model.js'; // ✅ Works now with default export


// Get all todos grouped by category

// GET route for the root URL ('/')
router.get('/', async (req, res) => {
    try {
        // Step 1: Fetch all todos from the database using Mongoose
        const todos = await Todo.find(); // Todo is likely a Mongoose model

        /*
         Step 2: Group todos by their 'category' field.
         Example:
         Input:
         [
           { title: 'Buy milk', category: 'Shopping' },
           { title: 'Code app', category: 'Work' },
           { title: 'Buy bread', category: 'Shopping' }
         ]
         
         Output:
         {
           Shopping: [{...}, {...}],
           Work: [{...}]
         }
        */
        const groupedTodos = todos.reduce((acc, todo) => {
            // If this category hasn't been added to the result object yet, initialize it as an array
            if (!acc[todo.category]) {
                acc[todo.category] = [];
            }

            // Push the current todo item into the appropriate category array
            acc[todo.category].push(todo);

            return acc; // Return the updated accumulator for the next iteration
        }, {}); // Start with an empty object

        // Step 3: Send the grouped todos as a JSON response
        res.json(groupedTodos);
    } catch (err) {
        // If any error occurs (e.g. database issue), respond with status 500 and error message
        res.status(500).json({ message: err.message });
    }
});


// Create a new todo 

// POST route to create a new todo
router.post('/', async (req, res) => {
    // Step 1: Create a new Todo instance using data from the request body
    const todo = new Todo({
        title: req.body.title,              // Title of the todo (e.g., "Buy groceries")
        description: req.body.description,  // Optional description/details
        dueDate: req.body.dueDate,          // Due date for the task
        category: req.body.category,        // e.g., 'Work', 'Personal'
        completed: req.body.completed || false // Defaults to false if not provided
    });

    try {
        // Step 2: Save the new todo document to the MongoDB database
        const newTodo = await todo.save();

        // Step 3: Respond with status 201 (Created) and the saved todo item
        res.status(201).json(newTodo);
    } catch (err) {
        // If there's a validation or saving error, respond with 400 (Bad Request)
        res.status(400).json({
            message: err.message // Send error message as JSON
        });
    }
});


// Get a single todo

// GET a single todo by ID
router.get('/:id', getTodo, (req, res) => {
    // If getTodo middleware succeeds, the matched todo is already attached to res.todo
    res.json(res.todo); // Send it back as JSON response
});


// Update a todo
// PATCH route to update a todo by its ID
router.patch('/:id', getTodo, async (req, res) => {
    // ✅ Check if 'title' was sent in the request body, and update it if so
    if (req.body.title != null) {
        res.todo.title = req.body.title;
    }

    // ✅ Check and update 'description' if provided
    if (req.body.description != null) {
        res.todo.description = req.body.description;
    }

    // ✅ Check and update 'dueDate' if provided
    if (req.body.dueDate != null) {
        res.todo.dueDate = req.body.dueDate;
    }

    // ✅ Check and update 'category' if provided
    if (req.body.category != null) {
        res.todo.category = req.body.category;
    }

    // ✅ Check and update 'completed' status if provided
    if (req.body.completed != null) {
        res.todo.completed = req.body.completed;
    }

    try {
        // ✅ Save the updated todo back to the database
        const updatedTodo = await res.todo.save();

        // ✅ Return the updated todo as a JSON response
        res.json(updatedTodo);
    } catch (err) {
        // ❌ If validation fails or save fails, return 400 error
        res.status(400).json({ message: err.message });
    }
});


// Delete a todo
// DELETE route to remove a specific todo by ID
router.delete('/:id', getTodo, async (req, res) => {
    try {
        // ✅ Delete the fetched todo from the database
        await res.todo.deleteOne(); // 'res.todo' is populated by getTodo middleware

        // ✅ Send a success message as response
        res.json({ message: "Todo deleted" });
    } catch (err) {
        // ❌ Handle any internal server errors during deletion
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get a todo by ID
// This middleware function is used to find a Todo item by ID before executing the main route logic
async function getTodo(req, res, next) {
    let todo; // Declare a variable to hold the fetched todo

    try {
        // Try to find the Todo item using Mongoose and the ID from the URL parameters
        todo = await Todo.findById(req.params.id); // e.g., GET /todos/123

        // If no todo is found, respond with 404 (Not Found) and exit early
        if (todo == null) {
            return res.status(404).json({ message: "Cannot find todo" });
        }
    } catch (err) {
        // If an error occurs (e.g. invalid ID format), respond with 500 (Internal Server Error)
        return res.status(500).json({ message: err.message });
    }

    // If found successfully, attach the todo to the response object so it can be used in the next route handler
    res.todo = todo;

    // Call next() to move on to the next middleware or route handler
    next();
}



// router.get('/:id', getTodo, (req, res) => {
//     res.json(res.todo);
// });

// router.patch('/:id', getTodo, async (req, res) => {
//     // now res.todo is available and ready to be updated
// });

// router.delete('/:id', getTodo, async (req, res) => {
//     // now res.todo is ready to be deleted
// });

// ✅ Correct export (ES Modules)
export default router;

