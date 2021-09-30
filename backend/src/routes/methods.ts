import { Request, Response } from "express";
import { v4 } from "uuid";
import { Todo } from "types/Todo";
import fetch from "node-fetch";

const todoList: { [id: string]: Todo } = {};

const ERROR_MSGS = {
  NO_SUCH_UUID: {message:"UUID does not exist"},
  TASK_REQUIRED: {message:"Input task required"},
  UUID_MISMATCH: {message:"UUID in path and body do not match"},
  API_TIMEOUT: {message: "Request from external api timed out"},
  GENERIC_ERR: {message:"An unexpected error occured."}
}

export async function createTodo(req: Request, res: Response) {
  const body = req.body;
  if (!("description" in body)) {
    return res.status(400).json(ERROR_MSGS.TASK_REQUIRED);
  }
  const newTaskDescription = body.description;
  const newTodo = {
    id: v4(),
    description: newTaskDescription,
    done: false,
  };
  todoList[newTodo.id] = newTodo;
  return res.status(200).json(newTodo);
}

export async function createRandomTodo(req: Request, res: Response) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 3000);
  try {
    const responseJson = await fetch("https://www.boredapi.com/api/activity",
  {
    signal:abortController.signal,
  }).then(apiResponse => apiResponse.json());
  
  const randomActivity = responseJson.activity;
  const randomTodo = {
    id: v4(),
    description: randomActivity,
    done: false,
  };
  todoList[randomTodo.id] = randomTodo;
  return res.status(200).json(randomTodo);
  } catch {
    return res.status(500).json(ERROR_MSGS.API_TIMEOUT);
  }
  // const responseJson = await fetch("https://www.boredapi.com/api/activity")
  //   .then(apiResponse => apiResponse.json());
}


export async function getTodoById(req: Request, res: Response) {
  const { id } = req.params;
  if (id in todoList) {
    return res.status(200).json(todoList[id]);
  } else {
    return res.status(400).json(ERROR_MSGS.NO_SUCH_UUID);
  }
}

// Can mention unused request param
export async function getAllTodos(_req: Request, res: Response) {
  return res.status(200).json(todoList);
}

export async function updateTodoById(req: Request, res: Response) {
  const {id} = req.params;
  const updatedTodo = req.body;
  if ( updatedTodo.id !== id){
      return res.status(400).json(ERROR_MSGS.UUID_MISMATCH);
  } else if (id in todoList){
      todoList[id] = updatedTodo;
      return res.status(200).send();
  } else{
      return res.status(400).json(ERROR_MSGS.NO_SUCH_UUID);
  }
}

export async function deleteTodoById(req: Request, res: Response) {
  const { id } = req.params;
  if (id in todoList) {
    delete todoList[id];
    return res.status(200).json(todoList);
  } else {
    return res.status(400).json(ERROR_MSGS.NO_SUCH_UUID);
  }
}
