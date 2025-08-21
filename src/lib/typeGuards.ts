/**
 * TypeScript Utility Functions for Safe Type Handling
 * 
 * This module provides reusable type guards and error handling utilities
 * to replace unsafe `any` types throughout the application.
 * 
 * Part of TypeScript hardening cleanup (Issue #4)
 */

// Reusable error handling without any types
export interface ErrorWithMessage {
  message: string;
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;
  
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

// Generic type guard for objects with required properties
export function hasRequiredProperties<T extends Record<string, unknown>>(
  obj: unknown,
  requiredProps: (keyof T)[]
): obj is T {
  if (!obj || typeof obj !== 'object') return false;
  
  const record = obj as Record<string, unknown>;
  return requiredProps.every(prop => prop in record);
}

// Type guard for Supabase query responses
export function isValidSupabaseResponse<T>(
  data: unknown,
  validator: (item: unknown) => item is T
): data is T[] {
  if (!Array.isArray(data)) return false;
  return data.every(validator);
}

// Common Supabase response types
export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export function isSupabaseError(error: unknown): error is SupabaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

// Type guard for string IDs
export function isValidId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

// Type guard for numeric values
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

// Type guard for nullable strings
export function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

// Type guard for nullable booleans
export function isNullableBoolean(value: unknown): value is boolean | null {
  return value === null || typeof value === 'boolean';
}

// Safe JSON parsing with type validation
export function safeJsonParse<T>(
  json: string,
  validator: (value: unknown) => value is T
): T | null {
  try {
    const parsed = JSON.parse(json);
    return validator(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// Function response type guards for common patterns
export interface FunctionResponse<T> {
  data?: T;
  error?: SupabaseError | null;
}

export function isFunctionResponse<T>(
  response: unknown,
  dataValidator?: (data: unknown) => data is T
): response is FunctionResponse<T> {
  if (!response || typeof response !== 'object') return false;
  
  const resp = response as Record<string, unknown>;
  const hasValidData = !dataValidator || !resp.data || dataValidator(resp.data);
  const hasValidError = !resp.error || isSupabaseError(resp.error);
  
  return hasValidData && hasValidError;
}