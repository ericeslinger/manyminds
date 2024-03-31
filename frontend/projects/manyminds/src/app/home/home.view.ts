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
import { RouterModule, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { Functions, httpsCallable } from '@angular/fire/functions';

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
  private functions: Functions = inject(Functions);
  private router: Router = inject(Router);

  currentUser = user(this.auth);
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

  async createPost() {
    const post = await httpsCallable<{}, string>(
      this.functions,
      'make_a_thing'
    )({ type: 'post' });
    this.router.navigate(['post', post.data, 'edit']);
  }
}
