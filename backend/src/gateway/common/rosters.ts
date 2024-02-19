import { getFirestore } from 'firebase-admin/firestore';

export async function createRoster(
  {
    id,
    contains,
    type,
  }: {
    id: string;
    contains: string;
    type: string;
  },
  initial: string[] = []
) {
  const firestore = getFirestore();
  await firestore.doc(`${type}/${id}/_rosters/${contains}`).create({
    list: initial,
    meta: {
      type: 'profiles',
      contains: 'users',
      id: id,
    },
  });
}
