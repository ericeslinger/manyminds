import { ThingStructure } from './thing';

export const POST: ThingStructure<{ title: string; body: string }> = {
  type: 'post',
  rosters: ['editors', 'commenters', 'readers'],
  defaults: {
    title: '',
    body: '',
  },
};
