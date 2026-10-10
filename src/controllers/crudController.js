import { handleError } from "../utils/httpError.js";

export function createCrudController(Model) {
  return {
    async getAll(req, res) {
      try {
        res.json(await Model.getAll());
      } catch (err) {
        handleError(res, err);
      }
    },
    async getById(req, res) {
      try {
        res.json(await Model.getById(req.params.id));
      } catch (err) {
        handleError(res, err);
      }
    },
    async create(req, res) {
      try {
        res.status(201).json(await Model.create(req.body));
      } catch (err) {
        handleError(res, err);
      }
    },
    async update(req, res) {
      try {
        res.json(await Model.update(req.params.id, req.body));
      } catch (err) {
        handleError(res, err);
      }
    },
    async remove(req, res) {
      try {
        res.json(await Model.remove(req.params.id));
      } catch (err) {
        handleError(res, err);
      }
    },
  };
}
