'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../infrastructure/store/useAuthStore';
import { validateRegister } from '../../domain/AuthValidation';
import styles from './RegisterPage.module.css';

export const RegisterPage = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

  const { register, globalError, fieldErrors, isLoading, clearErrors } = useAuthStore();

  // Igual que en LoginPage: limpiar al desmontar
  useEffect(() => {
    return () => clearErrors();
  }, [clearErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErrors({});
    clearErrors();

    const domainErrors = validateRegister(name, email, password);
    if (domainErrors.length > 0) {
      const errorsObj = domainErrors.reduce(
        (acc, curr) => ({ ...acc, [curr.field]: curr.message }),
        {}
      );
      setLocalErrors(errorsObj);
      return;
    }

    const success = await register({ name, email, password, role: 'user' });
    if (success) {
      router.push('/login');
    }
  };

  const activeErrors = { ...localErrors, ...fieldErrors };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.brand}>
          <div className={styles.logoMark} aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path d="M10 22 L16 10 L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.5 17.5 H19.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className={styles.brandName}>Acme</span>
        </div>

        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>Completa los datos para comenzar</p>

        {globalError && (
          <div className={styles.alertDanger} role="alert">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm.75 7a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Nombre completo</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} ${activeErrors.name ? styles.inputError : ''}`}
              placeholder="Juan Pérez"
              aria-describedby={activeErrors.name ? 'name-error' : undefined}
              aria-invalid={!!activeErrors.name}
            />
            {activeErrors.name && (
              <span id="name-error" className={styles.errorText} role="alert">
                {activeErrors.name}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} ${activeErrors.email ? styles.inputError : ''}`}
              placeholder="juan@example.com"
              aria-describedby={activeErrors.email ? 'email-error' : undefined}
              aria-invalid={!!activeErrors.email}
            />
            {activeErrors.email && (
              <span id="email-error" className={styles.errorText} role="alert">
                {activeErrors.email}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} ${activeErrors.password ? styles.inputError : ''}`}
              placeholder="Mínimo 8 caracteres"
              aria-describedby={activeErrors.password ? 'password-error' : undefined}
              aria-invalid={!!activeErrors.password}
            />
            {activeErrors.password && (
              <span id="password-error" className={styles.errorText} role="alert">
                {activeErrors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Registrando...
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        <p className={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className={styles.footerLink}>
            Inicia sesión
          </a>
        </p>

      </div>
    </div>
  );
};