import { getFirestore } from 'firebase-admin/firestore';
import { Id, pathId } from './id';
import { Roster } from './roster';

export async function getData<D extends any>(id: Id): Promise<D> {
  return (
    await getFirestore()
      .doc(`/${pathId(id)}`)
      .get()
  ).data() as D;
}

export async function getRoster(id: Id, roster: string): Promise<Roster> {
  return (
    await getFirestore()
      .doc(`/${pathId(id)}/_rosters/${roster}`)
      .get()
  ).data() as Roster;
}
