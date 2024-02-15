import { removeZeroes } from './firestore_triggers/container_operations';
import { assumeProfile } from './gateway/profiles/assumeProfile';
import { createProfile } from './gateway/profiles/createProfile';

export const removeZeroesFunction = removeZeroes;
export const assumeProfileCallable = assumeProfile;
export const createProfileCallable = createProfile;
