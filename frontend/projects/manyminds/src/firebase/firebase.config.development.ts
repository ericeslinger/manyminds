import { connectAuthEmulator, provideAuth, getAuth } from '@angular/fire/auth';
import {
  connectDatabaseEmulator,
  getDatabase,
  provideDatabase,
} from '@angular/fire/database';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import {
  connectFunctionsEmulator,
  provideFunctions,
  getFunctions,
} from '@angular/fire/functions';
import {
  connectStorageEmulator,
  provideStorage,
  getStorage,
} from '@angular/fire/storage';
import { importProvidersFrom, EnvironmentProviders } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../environments/environment';

const firebaseProviders: EnvironmentProviders = importProvidersFrom([
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideFirestore(() => {
    const firestore = getFirestore();
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    return firestore;
  }),
  provideAuth(() => {
    const auth = getAuth();
    connectAuthEmulator(auth, 'http://localhost:9099', {
      disableWarnings: true,
    });
    return auth;
  }),
  provideFunctions(() => {
    const functions = getFunctions();
    connectFunctionsEmulator(functions, 'localhost', 5001);
    return functions;
  }),
  provideStorage(() => {
    const storage = getStorage();
    connectStorageEmulator(storage, 'localhost', 9199);
    return storage;
  }),
  provideDatabase(() => {
    const database = getDatabase();
    connectDatabaseEmulator(database, 'localhost', 9000);
    return database;
  }),
]);

export { firebaseProviders };
