import { MemberModel } from "../models/memberModel.js";
import { createCrudController } from "./crudController.js";

export const MemberController = createCrudController(MemberModel);
