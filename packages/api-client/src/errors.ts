/**
 * Thrown for any non-2xx response, and for a response whose envelope reports
 * `success: false`. `status` is 0 when the request never reached the API at
 * all (DNS failure, connection refused, CORS rejection), which is the common
 * case in local development before the API is running.
 */
export class BlogsApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "BlogsApiError";
    this.status = status;
  }

  /** True when the API was unreachable rather than returning an error. */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}
