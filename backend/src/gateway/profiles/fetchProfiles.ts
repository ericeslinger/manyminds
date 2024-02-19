import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { request } from 'http';
import { authorize } from '../common/authorize';
interface ListCall {
  uid: string;
  type: 'list';
}

interface FetchCall {
  id: string;
  type: 'fetch';
}

export const fetchProfiles = onCall<ListCall | FetchCall>(
  {
    enforceAppCheck: false,
    consumeAppCheckToken: false,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError('permission-denied', 'permission denied');
    }
    if (request.data.type === 'list') {
      if (request.auth?.uid == request.data.uid) {
        const firestore = getFirestore();
        const rosters = await firestore
          .collectionGroup('_rosters')
          .where('meta.type', '==', 'profiles')
          .where('meta.contains', '==', 'users')
          .where('list', 'array-contains', `uid/${request.auth!.uid}`)
          .get();
        const profiles = await Promise.all(
          rosters.docs.map((doc) =>
            firestore.doc(`/profiles/${doc.data().meta.id}`).get()
          )
        );
        return profiles.map((profile) => profile.data());
      } else {
        throw new HttpsError('permission-denied', 'permission denied');
      }
    } else {
      const allowed = await authorize(
        { type: 'profiles', id: request.data.id },
        request.auth,
        { contains: 'readers' }
      );
      if (allowed) {
        return {};
      } else {
        throw new HttpsError('permission-denied', 'permission denied');
      }
    }
  }
);
