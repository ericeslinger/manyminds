import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { createRoster } from '../common/rosters';

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
      await createRoster({ type: 'profiles', contains: 'users', id: doc.id }, [
        `uid/${request.auth.uid}`,
      ]);
      return (await doc.get()).data;
    } else {
      throw new HttpsError('permission-denied', 'permission denied');
    }
  }
);
