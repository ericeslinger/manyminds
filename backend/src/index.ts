import { removeZeroes } from './firestore_triggers/container_operations';
import { assumeProfile } from './gateway/profiles/assumeProfile';
import { createProfile } from './gateway/profiles/createProfile';
import * as admin from 'firebase-admin';

admin.initializeApp();
export const removeZeroesFunction = removeZeroes;
export const assumeProfileCallable = assumeProfile;
export const createProfileCallable = createProfile;
