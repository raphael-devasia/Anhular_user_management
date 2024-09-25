import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const token = localStorage.getItem('jwt');
  const adminToken = localStorage.getItem('adminToken');
  const protectedRoutes: string[] = ['/profile']; // Add more routes as needed
  const protectedAdminRoutes: string[] = ['/admin/profile']; // Add more routes as needed

  if (protectedRoutes.includes(state.url) && !token) {
    // If the route is protected and no token is present, redirect to /login
    router.navigate(['/login']);
    return false; // Prevent activation of the route
  }
   if (protectedAdminRoutes.includes(state.url) && !adminToken) {
     // If the route is protected and no token is present, redirect to /login
     router.navigate(['/admin/login']);
     return false; // Prevent activation of the route
   }

  return true; // Allow activation of the route
};
