export type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "RESOURCE_NOT_FOUND"
  | "CONFLICT_ERROR"
  | "RATE_LIMIT_ERROR"
  | "EXTERNAL_PROVIDER_ERROR"
  | "DATABASE_ERROR"
  | "BUSINESS_RULE_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;
  readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode = 500,
    details?: Record<string, unknown>,
    isOperational = true,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Dados inválidos", details?: Record<string, unknown>) {
    super("VALIDATION_ERROR", message, 400, details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Não autenticado") {
    super("AUTHENTICATION_ERROR", message, 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Sem permissão para esta operação") {
    super("AUTHORIZATION_ERROR", message, 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super("RESOURCE_NOT_FOUND", message, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflito de dados") {
    super("CONFLICT_ERROR", message, 409);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Muitas requisições. Tente novamente em instantes.") {
    super("RATE_LIMIT_ERROR", message, 429);
    this.name = "RateLimitError";
  }
}

export class ExternalProviderError extends AppError {
  constructor(message = "Falha em serviço externo", details?: Record<string, unknown>) {
    super("EXTERNAL_PROVIDER_ERROR", message, 502, details);
    this.name = "ExternalProviderError";
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Erro de banco de dados") {
    super("DATABASE_ERROR", message, 500, undefined, false);
    this.name = "DatabaseError";
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("BUSINESS_RULE_ERROR", message, 422, details);
    this.name = "BusinessRuleError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
