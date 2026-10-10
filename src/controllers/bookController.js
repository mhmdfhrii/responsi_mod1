import { BookModel } from "../models/bookModel.js";
import { createCrudController } from "./crudController.js";

export const BookController = createCrudController(BookModel);
