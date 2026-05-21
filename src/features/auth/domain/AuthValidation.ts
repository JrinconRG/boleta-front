export interface ValidationError {
  field: string;
  message: string;
}

export const validateCredentials = (email: string, password: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'El formato del email no es válido.' });
  }
  if (password.length < 8) {
    errors.push({ field: 'password', message: 'La contraseña debe tener al menos 8 caracteres.' });
  }
  return errors;
};

export const validateRegister = (name: string, email: string, password: string): ValidationError[] => {
  const errors = validateCredentials(email, password);
  
  if (name.length < 2 || name.length > 80) {
    errors.push({ field: 'name', message: 'El nombre debe tener entre 2 y 80 caracteres.' });
  }
  return errors;
};