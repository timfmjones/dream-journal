// src/utils/consolePatch.ts
// Patch console.error to handle React 19's strict error handling

export const patchConsoleError = () => {
  const originalError = console.error;
  
  console.error = (...args: any[]) => {
    // Convert any non-primitive values to safe strings
    const safeArgs = args.map(arg => {
      try {
        // Check if it's a primitive value
        if (arg === null || arg === undefined) {
          return arg;
        }
        
        // Check if it's already a string or number
        if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
          return arg;
        }
        
        // For Error objects, extract message and stack
        if (arg instanceof Error) {
          return `Error: ${arg.message}\n${arg.stack || ''}`;
        }
        
        // For objects, try to stringify safely
        if (typeof arg === 'object') {
          try {
            // Check for circular references
            JSON.stringify(arg);
            return arg;
          } catch {
            // If circular reference, return a safe representation
            return `[Object ${arg.constructor?.name || 'Object'}]`;
          }
        }
        
        // For functions and symbols
        return String(arg);
      } catch {
        // If all else fails, return a safe string
        return '[Unserializable Value]';
      }
    });
    
    // Call original console.error with safe arguments
    originalError.apply(console, safeArgs);
  };
};

// Also patch console.warn for consistency
export const patchConsoleWarn = () => {
  const originalWarn = console.warn;
  
  console.warn = (...args: any[]) => {
    const safeArgs = args.map(arg => {
      try {
        if (arg === null || arg === undefined) {
          return arg;
        }
        
        if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
          return arg;
        }
        
        if (arg instanceof Error) {
          return `Warning: ${arg.message}`;
        }
        
        if (typeof arg === 'object') {
          try {
            JSON.stringify(arg);
            return arg;
          } catch {
            return `[Object ${arg.constructor?.name || 'Object'}]`;
          }
        }
        
        return String(arg);
      } catch {
        return '[Unserializable Value]';
      }
    });
    
    originalWarn.apply(console, safeArgs);
  };
};

// Apply all patches
export const applyConsolePatch = () => {
  patchConsoleError();
  patchConsoleWarn();
};