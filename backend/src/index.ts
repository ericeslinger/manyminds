import { removeZeroes as removeZeroesImpl } from './firestore_triggers/container_operations';
import { assumeProfile as assumeProfileImpl } from './gateway/profiles/assumeProfile';
import { fetchProfiles as fetchProfilesImpl } from './gateway/profiles/fetchProfiles';
import { make_a_thing as makeAThing } from './gateway/things/make_a_thing';
import * as admin from 'firebase-admin';

admin.initializeApp();
export const removeZeroes = removeZeroesImpl;
export const assumeProfile = assumeProfileImpl;
export const fetchProfiles = fetchProfilesImpl;
export const make_a_thing = makeAThing;
