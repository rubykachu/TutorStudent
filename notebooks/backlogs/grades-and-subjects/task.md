# Grades and subjects

Status: built and committed; waiting for the owner to look at the screens.

## What exists

- Grade model: each series in `content/subjects.json` has a `grade` (1 to 12); a lesson's grade is its series' grade (`content:check` fails when `lesson.json` says otherwise). Lookups: `src/content/grades.ts`.
- Subjects Lịch sử (`history`, amber, landmark) and Khoa học tự nhiên (`science`, violet, flask) added the generic way, with empty glossaries.
- Profile stores `grade` (Dexie version 2 moves older profiles to `DEFAULT_GRADE`, 6, and leaves progress alone).
- Home lists the grade's subjects; a subject with no published lesson in that grade is a locked tile ("Sắp ra mắt", not a link). Header chip "Lớp n" opens `/grades`.
- `/grades` ("Chọn lớp"): 12 tiles, only grades with a published lesson open (now 6). The profile form has "Bạn học lớp mấy?" with the same rule.
- Explanation panel after an answer is lifted above the bottom bar and followed while its visual grows (`exercise-frame.tsx`); fixes `lesson:walk` "bottom bar covers" at `tinh-tuan-ngay-correct`.

## Open for the owner

- Grade 6 lessons of Lịch sử and Khoa học tự nhiên: pages not supplied yet; each unlocks by publishing its first lesson.
- Lesson cards on a subject page still use the three original tile scenes (blue, terracotta, teal); amber and violet have a scene on the home tile only.
- The sticker shelf and "Học tiếp" card show the lessons of the child's grade only; stickers earned in another grade stay stored.
