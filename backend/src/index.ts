import { removeZeroes as removeZeroesImpl } from './firestore_triggers/container_operations';
import { assumeProfile as assumeProfileImpl } from './gateway/profiles/assumeProfile';
import { createProfile as createProfileImpl } from './gateway/profiles/createProfile';
import { fetchProfiles as fetchProfilesImpl } from './gateway/profiles/fetchProfiles';
import { createPost as createPostImpl } from './gateway/posts/create';
import * as admin from 'firebase-admin';

admin.initializeApp();
export const removeZeroes = removeZeroesImpl;
export const assumeProfile = assumeProfileImpl;
export const createProfile = createProfileImpl;
export const fetchProfiles = fetchProfilesImpl;
export const createPost = createPostImpl;
