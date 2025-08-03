/**
 * Options for making API requests
 * @interface RequestOptions
 * @property {string} [filterId] - Optional filter ID for the request
 * @property {string} [endpoint2] - Optional secondary endpoint
 * @property {string} [urlVars] - Optional URL variables
 */
export interface RequestOptions {
  filterId?: string;
  endpoint2?: string;
  urlVars?: string;
}

/**
 * Generic API response structure
 * @interface ApiResponse
 * @template T The type of data contained in the response
 * @property {T} data - The response data
 * @property {number} status - HTTP status code
 * @property {string} [message] - Optional response message
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Interface for mutation requests with field data
 * @interface MutationPayload
 * @property {string} endpoint - Target endpoint for the mutation
 * @property {object} payload - Payload containing the fields to be updated
 */
export interface MutationPayload {
  /** Target endpoint for the mutation */
  endpoint: string;
  /** Payload containing the fields to be updated */
  payload: {
    db?: string;
    choiceAsString?: string;
    where?: Record<string, unknown>;
    condition?: Record<string, unknown>;
    /** Key-value pairs of field data */
    fields: Record<string, unknown>;
    limit?: number;
    offset?: number;
    filter?: string;
  };
}

/**
 * Interface for patch operation payloads
 * @interface PatchPayload
 * @property {string} endpoint - Target endpoint for the patch operation
 * @property {Record<string, unknown>} payload - Key-value pairs of fields to be patched
 */
export interface PatchPayload {
  /** Target endpoint for the patch operation */
  endpoint: string;
  /** Key-value pairs of fields to be patched */
  payload: Record<string, unknown>;
}

/**
 * Interface for delete operation payloads
 * @interface DeletePayload
 * @property {string} endpoint - Target endpoint for the delete operation
 * @property {Record<string, unknown>} payload - Key-value pairs of fields to be patched
 */
export interface DeletePayload {
  /** Target endpoint for the patch operation */
  endpoint: string;
  /** Key-value pairs of fields to be patched */
  payload: {
    db: string;
  };
}

/**
 * Interface representing the state structure for the data slice
 * @interface DataState
 * @property {any[]} items - Array of data objects
 * @property {string | null} error - Error message if any operation fails
 * @property {boolean} loading - Loading state indicator
 */
export interface DataState {
  /** Array of data objects */
  data: unknown[];
  /** Error message if any operation fails */
  error: string | null;
  /** Loading state indicator */
  loading: boolean;
}
