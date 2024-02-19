import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Profile } from '../../../../../../types/profile';

@Component({
  selector: 'mm-profile-create',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './profile.create.html',
  styleUrl: './profile.create.scss',
})
export class ProfileCreate {
  name = '';
  description = '';
  private functions: Functions = inject(Functions);
  private createProfile = httpsCallable<
    { name: string; description: string },
    Profile
  >(this.functions, 'createProfile');

  async doCreate() {
    const args = { name: this.name, description: this.description };
    const result = await this.createProfile(args);
    console.log(result);
  }
}
