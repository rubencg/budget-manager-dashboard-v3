import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder,
      private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  submitLogin() {
    if (!this.loginForm.valid) {
      console.log("Error en los datos. Verifica tu correo y contraseña.");
    } else {
      console.log("logging");

      try {
        this.authService.loginUser(this.loginForm.value.email,
          this.loginForm.value.password)
          .then((user: firebase.User) => {
            this.router.navigate(['/calendar']);
          })
          .catch(error => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }

    }

  }

}
