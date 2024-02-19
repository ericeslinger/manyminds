import { getFirestore } from 'firebase-admin/firestore';
import { AuthData } from 'firebase-functions/lib/common/providers/https';

export async function authorize(
  target: { type: string; id: string },
  actor: AuthData,
  role: { contains: string }
): Promise<boolean> {
  const firestore = getFirestore();
  const roster = await firestore
    .doc(`/${target.type}/${target.id}/_rosters/${role.contains}`)
    .get();
  if (roster.exists) {
    const data = roster.data()! as { list: string[] };

    return (
      (actor.token['trellis_profile'] &&
        data.list.indexOf(`profiles#${actor.token['trellis_profile']}`) >= 0) ||
      data.list.indexOf(`uid#${actor.uid}`) >= 0
    );
  } else {
    return false;
  }
}
