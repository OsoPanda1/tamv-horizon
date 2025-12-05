/**
 * TAMV Security Guards - Sistema de Seguridad Integral
 * Implementa validaciones, sanitización y protección contra ataques
 */

import { z } from "zod";

// ============================================================================
// Input Validation Schemas
// ============================================================================

export const emailSchema = z.string()
  .email("Correo electrónico inválido")
  .max(255, "El correo no puede exceder 255 caracteres")
  .transform(val => val.toLowerCase().trim());

export const usernameSchema = z.string()
  .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
  .max(30, "El nombre de usuario no puede exceder 30 caracteres")
  .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos permitidos")
  .transform(val => val.toLowerCase().trim());

export const passwordSchema = z.string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(100, "La contraseña no puede exceder 100 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
  .regex(/[a-z]/, "Debe contener al menos una minúscula")
  .regex(/[0-9]/, "Debe contener al menos un número");

export const messageSchema = z.string()
  .min(1, "El mensaje no puede estar vacío")
  .max(5000, "El mensaje no puede exceder 5000 caracteres")
  .transform(val => sanitizeHtml(val));

export const postContentSchema = z.string()
  .min(1, "El contenido no puede estar vacío")
  .max(10000, "El contenido no puede exceder 10000 caracteres")
  .transform(val => sanitizeHtml(val));

export const uuidSchema = z.string()
  .uuid("ID inválido");

export const amountSchema = z.number()
  .positive("El monto debe ser positivo")
  .max(1000000, "Monto máximo excedido");

// ============================================================================
// Sanitization Functions
// ============================================================================

/**
 * Sanitiza HTML para prevenir XSS
 */
export function sanitizeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return input.replace(/[&<>"'`=/]/g, (char) => map[char] || char);
}

/**
 * Sanitiza URLs para prevenir javascript: y data: schemes
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    
    if (!allowedProtocols.includes(parsed.protocol)) {
      console.warn(`[SECURITY] Blocked URL with protocol: ${parsed.protocol}`);
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitiza nombres de archivo
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
}

// ============================================================================
// Rate Limiting (Client-side tracking)
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  'api:default': { maxRequests: 100, windowMs: 60000 },
  'api:auth': { maxRequests: 5, windowMs: 300000 },
  'api:message': { maxRequests: 30, windowMs: 60000 },
  'api:transaction': { maxRequests: 10, windowMs: 60000 },
  'api:upload': { maxRequests: 20, windowMs: 300000 }
};

export function checkRateLimit(key: string, configKey: string = 'api:default'): boolean {
  const config = DEFAULT_RATE_LIMITS[configKey] || DEFAULT_RATE_LIMITS['api:default'];
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs });
    return true;
  }

  if (entry.count >= config.maxRequests) {
    console.warn(`[SECURITY] Rate limit exceeded for: ${key}`);
    return false;
  }

  entry.count++;
  return true;
}

export function getRateLimitRemaining(key: string, configKey: string = 'api:default'): number {
  const config = DEFAULT_RATE_LIMITS[configKey] || DEFAULT_RATE_LIMITS['api:default'];
  const entry = rateLimitMap.get(key);
  
  if (!entry || Date.now() > entry.resetAt) {
    return config.maxRequests;
  }
  
  return Math.max(0, config.maxRequests - entry.count);
}

// ============================================================================
// Security Event Logging
// ============================================================================

interface SecurityEvent {
  type: 'warning' | 'error' | 'critical';
  category: 'auth' | 'input' | 'access' | 'rate_limit' | 'xss' | 'injection';
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

const securityLog: SecurityEvent[] = [];
const MAX_LOG_SIZE = 1000;

export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
  const fullEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString()
  };

  securityLog.push(fullEvent);
  
  // Mantener tamaño del log
  if (securityLog.length > MAX_LOG_SIZE) {
    securityLog.shift();
  }

  // Log críticos a consola
  if (event.type === 'critical') {
    console.error('[SECURITY CRITICAL]', fullEvent);
  } else if (event.type === 'error') {
    console.warn('[SECURITY]', fullEvent);
  }
}

export function getSecurityLog(): SecurityEvent[] {
  return [...securityLog];
}

// ============================================================================
// CSRF Protection
// ============================================================================

let csrfToken: string | null = null;

export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  csrfToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  return csrfToken;
}

export function validateCsrfToken(token: string): boolean {
  if (!csrfToken || token !== csrfToken) {
    logSecurityEvent({
      type: 'warning',
      category: 'access',
      message: 'Invalid CSRF token'
    });
    return false;
  }
  return true;
}

// ============================================================================
// Content Security Policy Helpers
// ============================================================================

export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://ai.gateway.lovable.dev"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "blob:", "https:"],
  'font-src': ["'self'", "data:"],
  'connect-src': ["'self'", "https://*.supabase.co", "wss://*.supabase.co", "https://ai.gateway.lovable.dev"],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"]
};

export function buildCspHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}

// ============================================================================
// Permission Checks
// ============================================================================

export type Permission = 
  | 'read:profile'
  | 'write:profile'
  | 'read:posts'
  | 'write:posts'
  | 'read:transactions'
  | 'write:transactions'
  | 'admin:users'
  | 'admin:content'
  | 'admin:system';

export type Role = 'user' | 'creator' | 'moderator' | 'admin' | 'superadmin';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  user: ['read:profile', 'write:profile', 'read:posts', 'write:posts', 'read:transactions'],
  creator: ['read:profile', 'write:profile', 'read:posts', 'write:posts', 'read:transactions', 'write:transactions'],
  moderator: ['read:profile', 'write:profile', 'read:posts', 'write:posts', 'read:transactions', 'admin:content'],
  admin: ['read:profile', 'write:profile', 'read:posts', 'write:posts', 'read:transactions', 'write:transactions', 'admin:users', 'admin:content'],
  superadmin: ['read:profile', 'write:profile', 'read:posts', 'write:posts', 'read:transactions', 'write:transactions', 'admin:users', 'admin:content', 'admin:system']
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    logSecurityEvent({
      type: 'warning',
      category: 'access',
      message: `Permission denied: ${permission}`,
      details: { role, permission }
    });
    throw new Error(`Permiso denegado: ${permission}`);
  }
}

// ============================================================================
// Sensitive Data Masking
// ============================================================================

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***@***';
  
  const maskedLocal = local.length > 2 
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : '*'.repeat(local.length);
  
  return `${maskedLocal}@${domain}`;
}

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return '**** **** **** ' + digits.slice(-4);
}

export function maskPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return '***-***-' + digits.slice(-4);
}

// ============================================================================
// Exports
// ============================================================================

export const SecurityGuards = {
  schemas: {
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    message: messageSchema,
    postContent: postContentSchema,
    uuid: uuidSchema,
    amount: amountSchema
  },
  sanitize: {
    html: sanitizeHtml,
    url: sanitizeUrl,
    filename: sanitizeFilename
  },
  rateLimit: {
    check: checkRateLimit,
    remaining: getRateLimitRemaining
  },
  csrf: {
    generate: generateCsrfToken,
    validate: validateCsrfToken
  },
  permissions: {
    has: hasPermission,
    require: requirePermission
  },
  mask: {
    email: maskEmail,
    card: maskCardNumber,
    phone: maskPhoneNumber
  },
  log: logSecurityEvent,
  getLog: getSecurityLog
};

export default SecurityGuards;
