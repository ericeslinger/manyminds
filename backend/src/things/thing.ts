import { AuthData } from 'firebase-functions/lib/common/providers/https';
import { RosterId } from '../gateway/rosters/roster';
import { DocumentReference } from 'firebase-admin/firestore';

export type Hook = (
  authData: AuthData,
  created: DocumentReference
) => Promise<void>;

export const HOOK_TYPES = ['create'] as const;
export type HookTypes = (typeof HOOK_TYPES)[number];

export interface ThingStructure<T extends Record<string, unknown>> {
  type: string;
  rosters: string[];
  defaults: T;
  hooks?: Partial<Record<HookTypes, Array<Hook>>>;
}
