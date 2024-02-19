import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { hasMember } from '../rosters/roster';
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
          .where('resource.type', '==', 'profiles')
          .where('type', '==', 'users')
          .where('list', 'array-contains', `uid/${request.auth!.uid}`)
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
    } else {
      const allowed = await hasMember({
        thisId: {
          resource: {
            id: request.data.id,
            type: 'profiles',
          },
          type: 'readers',
        },
        member: request.auth.token.trellis_profile,
      });
      if (allowed) {
        return {};
      } else {
        throw new HttpsError('permission-denied', 'permission denied');
      }
    }
  }
);
