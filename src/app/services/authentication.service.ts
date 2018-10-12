import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

  authState: any = null;
  userId: string;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.authState = this.afAuth.authState
      .pipe(map(user => {
        if (user) {
          this.userId = this.afAuth.auth.currentUser.uid;
          return user;
        } else {
          return null;
        }
      }))
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  loginWithFacebook() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then((data) => {
      this.router.navigate(['/calendar']);
    });
  }

  authorizeUser(data) {
    if (this.isAuthorized(data.user.email)) {
      this.router.navigate(['/calendar']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Cambiar para que vaya a base de datos y cheque por los correos autorizados
  isAuthorized(email: string): boolean {
    return email == "rubencg88@gmail.com" || email == "sarahimirelesr@gmail.com" || email == "rcardenas@tacitknowledge.com"
      || email == "andrescg13@gmail.com";
  }

  loginWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((data) => {
      this.router.navigate(['/calendar']);
    });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  isLogged(): boolean {
    return this.afAuth.auth.currentUser != null;
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }
}
