// Error dengan status code HTTP
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function handleError(res, err) {
  let status = err.status;

  if (!status) {
    switch (err.code) {
      case "22P02": 
      case "23502": 
      case "23503": 
      case "23514": 
        status = 400;
        break;
      case "23505": 
        status = 409;
        break;
      default:
        status = 500;
    }
  }

  res.status(status).json({ error: err.message });
}

export function pick(obj = {}, fields) {
  const result = {};
  for (const f of fields) {
    if (obj[f] !== undefined) result[f] = obj[f];
  }
  return result;
}
