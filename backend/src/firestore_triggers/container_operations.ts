import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
export const removeZeroes = onDocumentUpdated(
  '/{grouptype}/{groupId}/_rosters/{rosterId}',
  (event) => {
    const indirect = event.data?.after?.data()?.indirect;
    if (indirect) {
      const toDelete = Object.entries(indirect)
        .filter(([, v]) => v === 0)
        .map(([k]) => k);
      if (toDelete.length) {
        const deleting = Object.fromEntries(
          toDelete.map((val) => [`indirect.${val}`, FieldValue.delete()])
        );
        return event.data?.after.ref.update(deleting);
      }
    }
    return;
  }
);
