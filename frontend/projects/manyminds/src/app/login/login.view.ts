import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Auth, AuthError } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mm-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './login.view.html',
  styleUrl: './login.view.scss',
})
export class LoginView {
  password = '';
  username = '';
  error = signal({
    email: false,
    password: false,
  });

  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  emailInvalid = {
    isErrorState: () => this.error().email,
  };

  passwordInvalid = {
    isErrorSate: () => this.error().password,
  };

  async doSignin() {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        this.username,
        this.password
      );
      this.router.navigate(['auth', 'me']);
    } catch (e) {
      const authError = e as AuthError;
      console.log(authError.code);
      switch (authError.code) {
        case 'auth/user-not-found':
          this.error.set({
            email: true,
            password: false,
          });
          break;
        default:
          this.error.set({
            email: true,
            password: true,
          });
      }
    }
  }
}
