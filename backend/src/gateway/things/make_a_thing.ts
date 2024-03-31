import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeRosters, parseRosterPathId } from '../rosters/roster';
import { getAuth } from 'firebase-admin/auth';
import { info } from 'firebase-functions/logger';
import { SUPPORTED_THINGS } from '../../things';

export const make_a_thing = onCall<{ type: keyof typeof SUPPORTED_THINGS }>(
  {
    enforceAppCheck: false,
    consumeAppCheckToken: false,
  },
  async (request) => {
    if (
      !request.auth ||
      !request.auth.uid ||
      !request.auth.token.trellis_profile
    ) {
      throw new HttpsError('permission-denied', 'permission denied');
    }
    if (!SUPPORTED_THINGS[request.data.type]) {
      throw new HttpsError(
        'invalid-argument',
        `cannot create a ${request.data.type}`
      );
    }
    // TODO check permissions
    info({
      uid: request.auth.uid,
      profile: request.auth.token.trellis_profile,
    });
    const building = SUPPORTED_THINGS[request.data.type];
    const firestore = getFirestore();
    const doc = firestore.collection(request.data.type).doc();
    await doc.create({
      ...request.data,
      type: request.data.type,
      id: doc.id,
      data: building.defaults,
    });
    await initializeRosters({
      type: request.data.type,
      id: doc.id,
      chain: building.rosters,
      owner: parseRosterPathId(request.auth.token.trellis_profile),
    });
    if (building.hooks?.create) {
      await building.hooks.create.reduce(
        async (acc, curr) => await curr(request.auth!, doc),
        Promise.resolve()
      );
    }
    return doc.id;
  }
);
