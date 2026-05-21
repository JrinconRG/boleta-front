import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ApiAuthService } from '../ApiAuthService';

import { LoginCrendencials } from '../../domain/AuthToken';

import { User } from '../../../users/domain/user';

import {
  parseApiValidationError,
  FieldErrors
} from '../../../../shared/infrastructure/api/errorMapper';

interface AuthState {
  user: User | null;
  token: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  hasHydrated: boolean;

  globalError: string | null;
  fieldErrors: FieldErrors;

  setHasHydrated: (state: boolean) => void;

  login: (credentials: LoginCrendencials) => Promise<boolean>;

  register: (
    user: Omit<User, 'id'> & { password?: string }
  ) => Promise<boolean>;

  logout: () => Promise<void>;

  forceLogout: () => void;

  clearErrors: () => void;
}

const clearSession = () => ({
  user: null,
  token: null,
  isAuthenticated: false,
  globalError: null,
  fieldErrors: {}
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      token: null,

      isAuthenticated: false,

      isLoading: false,

      hasHydrated: false,

      globalError: null,

      fieldErrors: {},

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },

      clearErrors: () =>
        set({
          globalError: null,
          fieldErrors: {}
        }),

      login: async (credentials) => {
        set({
          isLoading: true,
          globalError: null,
          fieldErrors: {}
        });

        try {
          const response = await ApiAuthService.login(credentials);

          const { user, token } = response;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });

          return true;
        } catch (err: any) {
          const apiErrorString =
            err.response?.data?.error ||
            'Error de conexión con el servidor';

          const status = err.response?.status;

          if (status === 400) {
            const mappedErrors =
              parseApiValidationError(apiErrorString);

            set({
              fieldErrors: mappedErrors,

              globalError:
                'Por favor, corrige los campos marcados.',

              isLoading: false
            });
          } else {
            set({
              globalError: apiErrorString,
              isLoading: false
            });
          }

          return false;
        }
      },

      register: async (userData) => {
        set({
          isLoading: true,
          globalError: null,
          fieldErrors: {}
        });

        try {
          const { name, email, password } = userData;

          await ApiAuthService.register(
            name,
            email,
            password || ''
          );

          set({
            isLoading: false
          });

          return true;
        } catch (err: any) {
          const apiErrorString =
            err.response?.data?.error ||
            'Error de conexión con el servidor';

          const status = err.response?.status;

          if (status === 400) {
            const mappedErrors =
              parseApiValidationError(apiErrorString);

            set({
              fieldErrors: mappedErrors,

              globalError:
                'Por favor, corrige los datos ingresados.',

              isLoading: false
            });
          } else {
            set({
              globalError: apiErrorString,
              isLoading: false
            });
          }

          return false;
        }
      },

      logout: async () => {
        set(clearSession());

        localStorage.removeItem('auth-storage');

        globalThis.location.replace('/login');
      },

      forceLogout: () => {
        set(clearSession());

        localStorage.removeItem('auth-storage');

        globalThis.location.replace('/login');
      }
    }),

    {
      name: 'auth-storage',

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);