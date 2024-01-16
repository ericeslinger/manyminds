import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mm-signup',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './signup.view.html',
  styleUrl: './signup.view.scss',
})
export class SignupView {
  password: String = '';
  username: String = '';

  doSignup() {
    console.log({ username: this.username, password: this.password });
  }
}
