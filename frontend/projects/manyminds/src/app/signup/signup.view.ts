import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'mm-signup',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './signup.view.html',
  styleUrl: './signup.view.scss',
})
export class SignupView {
  password = '';
  username = '';
  private auth: Auth = inject(Auth);

  async doSignup() {
    console.log({ username: this.username, password: this.password });
    const result = await createUserWithEmailAndPassword(
      this.auth,
      this.username,
      this.password
    );
    console.log(result);
  }
}
