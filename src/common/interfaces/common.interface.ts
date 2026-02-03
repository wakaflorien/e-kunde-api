export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface AuthPayload {
  sub: string; // user id
  email?: string;
  phone?: string;
  role: string;
  user?: any;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}
