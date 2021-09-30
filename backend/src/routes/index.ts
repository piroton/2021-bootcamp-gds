import { Router } from "express";
import {
  createTodo,
  createRandomTodo,
  getAllTodos,
  deleteTodoById,
  updateTodoById,
  getTodoById,

} from "./methods";
// import {  } from "./newMethods";

const todoRouter = Router();
todoRouter.post("/todos", createTodo);
todoRouter.post("/todos/random", createRandomTodo);
todoRouter.get("/todos", getAllTodos);
todoRouter.get("/todos/:id", getTodoById);
todoRouter.put("/todos/:id", updateTodoById);
todoRouter.delete("/todos/:id", deleteTodoById);

export default todoRouter;
