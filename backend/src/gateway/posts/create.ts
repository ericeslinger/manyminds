import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeRosters, rosterPathId } from '../rosters/roster';
import { getAuth } from 'firebase-admin/auth';
import { info } from 'firebase-functions/logger';

const ITEM_TYPE = 'posts';

export const createPost = onCall<{}>(
  {
    enforceAppCheck: false,
    consumeAppCheckToken: false,
  },
  async (request) => {
    if (request.auth?.uid && request.auth.token.trellis_profile) {
      info({
        uid: request.auth.uid,
        profile: request.auth.token.trellis_profile,
      });
      const firestore = getFirestore();
      const doc = firestore.collection(ITEM_TYPE).doc();
      const created = await doc.create({
        ...request.data,
        type: ITEM_TYPE,
        id: doc.id,
      });
      await initializeRosters(
        {
          type: ITEM_TYPE,
          id: doc.id,
        },
        {
          type: 'profiles',
          resource: {
            type: 'profiles',
            id: request.auth.token.trellis_profile,
          },
        }
      );
      return doc.id;
    } else {
      throw new HttpsError('permission-denied', 'permission denied');
    }
  }
);
