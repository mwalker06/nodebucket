// imports
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';


// authGuard function definition
export const authGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService)

  // if the session_user cookie exists, return true
  if (cookie.get('session_user')) {
    console.log('You are logged in and have a valid session cookie')
    return true
  } else {
    console.log('You must be logged in to access this page')
    const router = inject(Router)
    router.navigate(['/security/signin'], { queryParams: { returnUrl: state.url } })
    return false
  }
};
