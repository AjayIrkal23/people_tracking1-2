import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { UnprocessableEntity } from "@/utils/exceptions/unprocessable-entity.exception";
import { ErrorCode } from "@/utils/exceptions/root";

type ValidationSchemas = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export const validateSchema = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      if (schemas.body) {
        const bodyParseResult = schemas.body.safeParse(req.body);
        if (!bodyParseResult.success) {
          throw bodyParseResult.error;
        }
        req.body = bodyParseResult.data;
      }

      // Validate query
      if (schemas.query) {
        const queryParseResult = schemas.query.safeParse(req.query);
        if (!queryParseResult.success) {
          throw queryParseResult.error;
        }
        req.query = queryParseResult.data;
      }

      // Validate params
      if (schemas.params) {
        const paramsParseResult = schemas.params.safeParse(req.params);
        if (!paramsParseResult.success) {
          throw paramsParseResult.error;
        }
        req.params = paramsParseResult.data;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new UnprocessableEntity(
            error.issues,
            "Unprocessable Entity",
            ErrorCode.UNPROCESSABLE_ENTITY
          )
        );
      } else {
        next(error);
      }
    }
  };
};
