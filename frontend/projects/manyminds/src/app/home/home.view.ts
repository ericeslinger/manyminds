import { Component, inject } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  query,
  collectionData,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';

interface Post {
  handle: string;
}

@Component({
  selector: 'mm-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.view.html',
  styleUrl: './home.view.scss',
})
export class HomeView {
  someDoc: Observable<unknown>;
  topPosts: Observable<Post[]>;
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  constructor() {
    this.someDoc = docData(doc(this.firestore, 'site/meta'));
    this.topPosts = collectionData(
      query(
        collection(this.firestore, 'posts').withConverter<Post>({
          fromFirestore: (doc) => {
            return { handle: doc.data()['handle'] };
          },
          toFirestore: (doc) => doc,
        }),
        where('public', '==', true)
      )
    );
  }
  logout() {
    this.auth.signOut();
  }
}
