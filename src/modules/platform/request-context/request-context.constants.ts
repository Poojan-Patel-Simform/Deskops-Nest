export const REQUEST_ID_HEADER = 'x-request-id';

// Inbound IDs end up in logs and response headers, so accept only a conservative shape.
export const VALID_REQUEST_ID = /^[A-Za-z0-9._-]{1,128}$/;
