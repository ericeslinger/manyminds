import { Component, inject } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { Observable, filter, map, mergeMap, startWith } from 'rxjs';
import {
  collection,
  doc,
  docData,
  Firestore,
  query,
  collectionData,
  where,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Profile } from '../../../../../../types/profile';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mm-auth-view',
  standalone: true,
  imports: [MatButtonModule, RouterModule, CommonModule],
  templateUrl: './auth.view.html',
  styleUrl: './auth.view.scss',
})
export class AuthView {
  private auth: Auth = inject(Auth);
  private functions: Functions = inject(Functions);
  private firestore: Firestore = inject(Firestore);
  private fetchProfiles = httpsCallable<{ uid: string }, Profile[]>(
    this.functions,
    'fetchProfiles'
  );
  user$ = user(this.auth);
  profile$: Observable<Profile[]> = this.user$.pipe(
    filter((user) => !!user),
    mergeMap((user) => this.fetchProfiles({ uid: user!.uid })),
    map((result) => result.data),
    startWith([])
  );
}
