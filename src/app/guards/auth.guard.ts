import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthenticationService){  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      // return this.auth.authState.pipe(
      //   map(authState => {
      //     if (!authState) {
      //       this.router.navigate(['/login']);
      //     }

      //   }),
      //   take(1)
      // );
      return this.auth.authState
     .pipe(
        map(status => {
          let success = status !== null;
          if(!success){
            this.router.navigate(['/login']);
          }
          return success;
        })
     )
  }

}
