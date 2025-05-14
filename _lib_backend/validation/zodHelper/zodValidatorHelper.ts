import {  ZodTypeAny } from "zod";
import { formatZodError } from "./zodError";
import { NextApiResponse } from "next";

/**
 * Validates data using a Zod schema and sends response if validation fails
 * @param zodParseFunction Zod schema to validate against
 * @param data Data to validate (usually `fields` from form-urlencoded)
 * @param res NextApiResponse object
 * @returns Parsed data if valid, or null (after sending error response)
 */
export function zodValidatorHelper(
  zodParseFunction: ZodTypeAny,
  data: unknown,
  res: NextApiResponse
) {
  
  const result = zodParseFunction.safeParse(data);

  if (!result.success) {
    return res.status(400).json({
      error: formatZodError(result.error),
    });
  }

  return result.data;
}
