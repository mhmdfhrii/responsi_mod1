import { createCrudModel } from "./crudModel.js";

export const MemberModel = createCrudModel({
  table: "members",
  fields: ["name", "email", "phone", "address"],
  required: ["name"],
  label: "Anggota",
});
