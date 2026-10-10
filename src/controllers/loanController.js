import { LoanModel } from "../models/loanModel.js";
import { handleError } from "../utils/httpError.js";

export const LoanController = {
  async getAll(req, res) {
    try {
      const { status, member_id, book_id } = req.query;
      const loans = await LoanModel.getAll({ status, member_id, book_id });
      res.json(loans);
    } catch (err) {
      handleError(res, err);
    }
  },

  async getById(req, res) {
    try {
      res.json(await LoanModel.getById(req.params.id));
    } catch (err) {
      handleError(res, err);
    }
  },

  async create(req, res) {
    try {
      res.status(201).json(await LoanModel.create(req.body));
    } catch (err) {
      handleError(res, err);
    }
  },

  async update(req, res) {
    try {
      res.json(await LoanModel.update(req.params.id, req.body));
    } catch (err) {
      handleError(res, err);
    }
  },

  async remove(req, res) {
    try {
      res.json(await LoanModel.remove(req.params.id));
    } catch (err) {
      handleError(res, err);
    }
  },
};
