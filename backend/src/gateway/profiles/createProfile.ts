import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { createRoster, addMember } from '../rosters/roster';

export const createProfile = onCall<{ name: string; description: string }>(
  {
    enforceAppCheck: false,
    consumeAppCheckToken: false,
  },
  async (request) => {
    if (request.auth?.uid) {
      const firestore = getFirestore();
      const doc = firestore.collection('profiles').doc();
      const created = await doc.create({
        ...request.data,
        type: 'profiles',
        id: doc.id,
      });
      await Promise.all([
        createRoster(
          {
            type: 'users',
            resource: {
              type: 'profiles',
              id: doc.id,
            },
          },
          [`uid#${request.auth.uid}`]
        ),
        createRoster({
          type: 'readers',
          resource: {
            type: 'profiles',
            id: doc.id,
          },
        }),
      ]);
      await addMember({
        thisId: {
          type: 'readers',
          resource: {
            type: 'profiles',
            id: doc.id,
          },
        },
        memberId: {
          type: 'users',
          resource: {
            type: 'profiles',
            id: doc.id,
          },
        },
      });
      await addMember({
        thisId: {
          type: 'readers',
          resource: {
            type: 'profiles',
            id: doc.id,
          },
        },
        memberId: {
          type: 'profiles',
          resource: {
            type: 'profiles',
            id: doc.id,
          },
        },
      });
      return (await doc.get()).data;
    } else {
      throw new HttpsError('permission-denied', 'permission denied');
    }
  }
);
