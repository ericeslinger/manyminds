import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class ThingsService {
  private readonly functions = inject(Functions);
  private readonly makeAThing = httpsCallable<{ type: string }, string>(
    this.functions,
    'make_a_thing'
  );

  constructor() {}

  create(type: string) {
    return this.makeAThing({ type });
  }
}
