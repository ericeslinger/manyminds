import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { hasMember } from '../rosters/roster';

export interface ListCall {
  uid: string;
}

export interface FetchCall {
  id: string;
  type: 'fetch';
}

export const fetchProfiles = onCall<ListCall>(
  {
    enforceAppCheck: false,
    consumeAppCheckToken: false,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError('permission-denied', 'permission denied');
    }
    if (request.auth?.uid == request.data.uid) {
      const firestore = getFirestore();
      const rosters = await firestore
        .collectionGroup('_rosters')
        .where('resource.type', '==', 'profiles')
        .where('type', '==', 'users')
        .where(`direct.uid#${request.auth!.uid}`, '==', true)
        .get();
      const profiles = await Promise.all(
        rosters.docs.map((doc) =>
          firestore.doc(`/profiles/${doc.data().resource.id}`).get()
        )
      );
      return profiles.map((profile) => profile.data());
    } else {
      throw new HttpsError('permission-denied', 'permission denied');
    }
  }
);
