import { ACTIVE_PROFILE_KEY, DEVICE_SCOPE, type TutorDb } from "@/progress/db";
import { SYNC_FAMILY_KEY } from "@/sync/state";

// Makes this device a blank one for another family: deletes every profile and
// every child's records, the sync bookkeeping, and the two device settings
// that name the old family and the child using the device. What stays is the
// device's own: the parent PIN and its lock, the clock offset. The caller
// syncs afterwards to pull the new family's docs.
//
// Every table is cleared except `settings`, so a table added later is
// cleared too without anyone remembering to list it here.
export async function clearLocalFamilyData(db: TutorDb): Promise<void> {
  const tables = db.tables.filter((t) => t.name !== db.settings.name);
  await db.transaction("rw", [...tables, db.settings], async () => {
    for (const table of tables) await table.clear();
    await db.settings
      .filter((row) => row.childId !== DEVICE_SCOPE.childId)
      .delete();
    await db.settings.bulkDelete(
      [SYNC_FAMILY_KEY, ACTIVE_PROFILE_KEY].map(
        (key): [string, string, string] => [
          DEVICE_SCOPE.familyId,
          DEVICE_SCOPE.childId,
          key,
        ],
      ),
    );
  });
}
