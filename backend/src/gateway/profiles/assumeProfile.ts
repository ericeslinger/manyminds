import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getRoster } from '../rosters/roster';
import { rosterPathId } from '../rosters/roster';

export const assumeProfile = onCall<{ profile: string }>(
  { enforceAppCheck: false, consumeAppCheckToken: false },
  async (request) => {
    const profilePermission = await getRoster({
      resource: { id: request.data.profile, type: 'profiles' },
      type: 'owner',
    });
    if (
      request.auth?.uid &&
      profilePermission?.indirect[request.auth?.uid] > 0
    ) {
      await getAuth().setCustomUserClaims(request.auth.uid, {
        trellis_profile: rosterPathId({
          type: 'owners',
          resource: { type: 'profiles', id: request.data.profile },
        }),
      });
      return { trellis_profile: request.data.profile };
    } else {
      throw new HttpsError('permission-denied', 'permission denied');
    }
  }
);
