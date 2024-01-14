import { Component } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mm-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.view.html',
  styleUrl: './home.view.scss',
})
export class HomeView {
  someDoc: Observable<unknown>;
  constructor(private firestore: Firestore) {
    this.someDoc = docData(doc(firestore, 'site/meta'));
  }
}
