import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Auth, AuthError } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'mm-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './login.view.html',
  styleUrl: './login.view.scss',
})
export class LoginView {
  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  password = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  async doSignin() {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        this.email.getRawValue(),
        this.password.getRawValue()
      );
      this.router.navigate(['auth', 'me']);
    } catch (e) {
      const authError = e as AuthError;
      console.log(authError.code);
      switch (authError.code) {
        case 'auth/user-not-found':
          this.email.setErrors({ error: 'notfound' });
          break;
        default:
          this.email.setErrors({ error: 'unknowns' });
          this.password.setErrors({ error: 'unknowns' });
      }
    }
  }
}
