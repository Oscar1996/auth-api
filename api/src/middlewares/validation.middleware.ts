import { plainToClass } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { RequestHandler } from 'express';
import HttpException from '../exceptions/HttpException';

const validatorOptions = (skipMissingProperties: boolean = false): ValidatorOptions => {
  return { skipMissingProperties, forbidUnknownValues: true };
};

function validationMiddleware(type: any, skipMissingProperties?: boolean): RequestHandler {
  return (req, _res, next) => {
    validate(plainToClass(type, req.body), validatorOptions(skipMissingProperties)).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
          next(new HttpException(400, message));
        } else {
          next();
        }
      }
    );
  };
}

export default validationMiddleware;
