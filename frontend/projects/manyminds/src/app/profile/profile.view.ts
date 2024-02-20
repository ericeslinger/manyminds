import { Component, Input, OnInit, inject } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  query,
  collectionData,
  where,
} from '@angular/fire/firestore';
import { Profile } from '../../../../../../types/profile';
import { Observable, filter, pipe } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mm-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.view.html',
  styleUrl: './profile.view.scss',
})
export class ProfileView implements OnInit {
  private firestore = inject(Firestore);
  @Input() id = '';
  profile$!: Observable<Profile>;
  ngOnInit() {
    console.log(this.id);
    this.profile$ = docData(
      doc(this.firestore, `/profiles/${this.id}`)
    ) as Observable<Profile>;
  }
}
