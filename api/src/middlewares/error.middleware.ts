import express from 'express';
import HttpException from '../exceptions/HttpException';

const errorMiddleware = (
  error: HttpException,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const status = error.status || 500;
  const message = 'Something went wrong!!!';
  res.status(status).json({
    status: status,
    message: message
  });
};

export default errorMiddleware;
