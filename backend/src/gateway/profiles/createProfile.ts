import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export const createProfile = onCall<{ name: string; description: string }>(
  {
    enforceAppCheck: false,
    consumeAppCheckToken: false,
  },
  async (request) => {
    if (request.auth?.uid) {
      const firestore = getFirestore();
      const created = await firestore.collection('profiles').add(request.data);
      await firestore.doc(`profiles/${created.id}/_rosters/users`).create({
        list: [request.auth.uid],
      });
    } else {
      throw new HttpsError('permission-denied', 'permission denied');
    }
  }
);
