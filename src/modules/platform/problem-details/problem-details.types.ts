/** RFC 9457 problem details, plus the `requestId` extension so clients can quote it in support requests. */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance: string;
  requestId?: string | undefined;
  errors?: string[];
}
