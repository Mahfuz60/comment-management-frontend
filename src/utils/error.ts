import axios from "axios";

export type AppError = {
  status?: number;
  message: string;
  details?: unknown;
};

export function toAppError(err: unknown): AppError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as any;
    const message =
      data?.message ??
      data?.error ??
      err.message ??
      "Request failed";
    return { status, message, details: data };
  }

  if (err instanceof Error) {
    return { message: err.message };
  }

  return { message: "Unknown error" };
}
