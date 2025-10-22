export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ErrorResponse {
  detail: string;
  code?: string;
  field?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
