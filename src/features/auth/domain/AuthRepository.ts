import { LoginCrendencials, AuthToken } from './AuthToken';
import { User } from '../../users/domain/user';

export interface AuthRepository {
  login(credentials: LoginCrendencials): Promise<{ user: User; token: string }>;
  register(name: string, email: string, password: string): Promise<User>;
}
