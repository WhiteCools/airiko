// Regular expressions for identifying sensitive information
const SENSITIVE_PATTERNS = {
  EMAIL: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
  IP: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
  TOKEN: /Bearer [a-zA-Z0-9\-._~+/]+=*/g,
  API_KEY: /key-[a-zA-Z0-9]{32}/g,
  URL_WITH_PARAMS: /(https?:\/\/[^?]*\?)[^']*/g,
};

// Override console methods to sanitize logs
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
};

// Sanitize sensitive information from strings
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  let sanitized = str;
  Object.entries(SENSITIVE_PATTERNS).forEach(([key, pattern]) => {
    sanitized = sanitized.replace(pattern, `[${key}]`);
  });
  return sanitized;
};

// Sanitize objects recursively
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Skip sanitization for specific safe keys
    const isSafeKey = ['id', 'name', 'title', 'description'].includes(key);
    
    if (typeof value === 'string' && !isSafeKey) {
      acc[key] = sanitizeString(value);
    } else if (typeof value === 'object') {
      acc[key] = sanitizeObject(value);
    } else {
      acc[key] = value;
    }
    
    return acc;
  }, {});
};

// Custom error class with sanitization
export class SafeError extends Error {
  constructor(message, originalError = null) {
    const sanitizedMessage = sanitizeString(message);
    super(sanitizedMessage);
    this.name = 'SafeError';
    if (originalError) {
      this.stack = sanitizeString(originalError.stack);
    }
  }
}

// Override console methods with sanitized versions
export const setupSafeConsole = () => {
  console.log = (...args) => {
    const sanitizedArgs = args.map(arg => 
      typeof arg === 'object' ? sanitizeObject(arg) : sanitizeString(String(arg))
    );
    originalConsole.log(...sanitizedArgs);
  };

  console.error = (...args) => {
    const sanitizedArgs = args.map(arg => 
      arg instanceof Error ? new SafeError(arg.message, arg) : sanitizeObject(arg)
    );
    originalConsole.error(...sanitizedArgs);
  };

  console.warn = (...args) => {
    const sanitizedArgs = args.map(arg => 
      typeof arg === 'object' ? sanitizeObject(arg) : sanitizeString(String(arg))
    );
    originalConsole.warn(...sanitizedArgs);
  };

  console.info = (...args) => {
    const sanitizedArgs = args.map(arg => 
      typeof arg === 'object' ? sanitizeObject(arg) : sanitizeString(String(arg))
    );
    originalConsole.info(...sanitizedArgs);
  };
};

// Safe fetch wrapper that sanitizes errors and responses
export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new SafeError(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    throw new SafeError(error.message, error);
  }
};
