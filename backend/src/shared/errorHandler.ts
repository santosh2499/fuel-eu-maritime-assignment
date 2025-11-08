import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues, // ✅ fully typed because ZodError ensures .errors exists
    });
  }

  console.error("Unexpected Error:", err);

  res.status(500).json({
    error: "Internal Server Error",
  });
}
