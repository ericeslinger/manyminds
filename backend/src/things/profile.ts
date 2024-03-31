import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { ThingStructure } from './thing';
import { getAuth } from 'firebase-admin/auth';
import { rosterPathId } from '../gateway/rosters/roster';

export const PROFILE: ThingStructure<{
  name: string;
  avatar: string;
  description: string;
}> = {
  type: 'profile',
  rosters: ['users', 'commenters', 'readers'],
  defaults: {
    name: '',
    avatar: '',
    description: '',
  },
  hooks: {
    create: [
      async (authData, docRef) => {
        const firestore = getFirestore();
        const usersPath = `/documents/profiles/${docRef.id}/_rosters/users`;
        await firestore
          .doc(usersPath)
          .update({ direct: FieldValue.arrayUnion(`uid#${authData.uid}`) });
        await getAuth().setCustomUserClaims(authData.uid, {
          trellis_profile: rosterPathId({
            type: 'users',
            resource: { type: 'profiles', id: docRef.id },
          }),
        });
      },
    ],
  },
};
