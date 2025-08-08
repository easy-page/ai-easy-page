import { Framework } from '@/infra';
import { AuthService } from './authService';
import { AuthStateEntity } from './authState';

export function configureAuthModule(framework: Framework) {
	framework.service(AuthService).entity(AuthStateEntity);
}

export { AuthService } from './authService';
export { AuthStateEntity } from './authState';
