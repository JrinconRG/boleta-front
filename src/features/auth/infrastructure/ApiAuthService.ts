// features/auth/infrastructure/api/ApiAuthService.ts
import { httpClient } from '../../../shared/infrastructure/api/httpClient';
import { AuthRepository } from '../domain/AuthRepository';
import { LoginCrendencials } from '../domain/AuthToken';
import { User } from '../../users/domain/user';

export const ApiAuthService: AuthRepository = {
  async login(credentials: LoginCrendencials): Promise<{ user: User; token: string }> {
    // Axios o tu httpClient envuelve la respuesta en .data, y tu API responde con { data: { token, user } }
    const response = await httpClient.post('/auth/login', credentials);
    const apiResponse = response.data; 

    return {
      user: apiResponse.data.user,
      token: apiResponse.data.token,
    };
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const response = await httpClient.post('/auth/register', { name, email, password });
    return response.data.data.user;
  },

};