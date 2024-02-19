import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from '@angular/fire/auth';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'mm-auth-create',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './auth.create.html',
  styleUrls: ['./auth.create.scss', '../../scss/page.scss'],
})
export class AuthCreate {
  password = '';
  username = '';
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  async doSignup() {
    const result = await createUserWithEmailAndPassword(
      this.auth,
      this.username,
      this.password
    );
    this.router.navigate(['auth', 'me']);
  }
}
