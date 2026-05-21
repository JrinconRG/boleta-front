export interface FieldErrors {
  [key: string]: string; 
}

export const parseApiValidationError = (errorString: string): FieldErrors => {
  const fieldErrors: FieldErrors = {};

  if (!errorString || typeof errorString !== 'string') return fieldErrors;

  const cleanString = errorString.replace(/^Datos inválidos:\s*/i, '');

  const errorSegments = cleanString.split(';');

  errorSegments.forEach((segment) => {
    const separatorIndex = segment.indexOf(':');
    
    if (separatorIndex !== -1) {
      const field = segment.substring(0, separatorIndex).trim();
      const message = segment.substring(separatorIndex + 1).trim();
      
      if (field && message) {
        fieldErrors[field] = message;
      }
    }
  });

  return fieldErrors;
};