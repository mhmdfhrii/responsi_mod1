import { createCrudModel } from "./crudModel.js";

export const BookModel = createCrudModel({
  table: "books",
  fields: ["isbn", "title", "author", "publisher", "year"],
  required: ["title", "author"],
  label: "Buku",
});
