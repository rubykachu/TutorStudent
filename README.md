# Tutor

Ứng dụng web (PWA) giúp học sinh lớp 6 tự học: bài học dựng từ sách giáo khoa và sách bài tập, giải thích bằng hình và animation, bài tập tương tác có gợi ý 3 nấc, ôn tập theo mức nhớ (FSRS), video và lời đọc tiếng Việt. Dùng chính trên iPad, chạy tốt trên điện thoại.

Tài liệu chính:

| Tài liệu | Nội dung |
|---|---|
| `docs/architecture.md` | Bản đồ kiến trúc: luồng dữ liệu, module, kiểm tra tự động, pipeline media (đọc đầu tiên) |
| `docs/spec.md` | Yêu cầu sản phẩm, mô hình nội dung, luật kiểm duyệt, tiêu chí từng mốc |
| `docs/design-system.md` | Màu, chữ, bố cục, phản hồi, linh vật |
| `docs/operations.md` | Đưa app lên Vercel và R2, mã gia đình, kiểm trên iPad: các bước ngoài máy kèm lệnh |
| `docs/learner.md` | Hồ sơ học tập của trẻ (dùng khi soạn bài) |
| `docs/lessons-learned/index.md` | Lỗi nội dung đã gặp và cách phòng |
| `notebooks/backlogs/index.md` | Hàng đợi công việc và trạng thái (mỗi việc trỏ tới thư mục spec/plan/task) |
| `CLAUDE.md` | Hướng dẫn cho Claude Code trong dự án |

## Chạy trên máy

Yêu cầu: Node.js ≥ 22, pnpm. Công cụ media (chỉ khi làm video/lời đọc): ffmpeg, poppler (`pdftoppm`), môi trường Python của giọng đọc (`video/.venv`, cài theo `video/requirements.txt`; xem skill `lesson-video`).

```bash
pnpm install
pnpm dev --port 3001                         # http://localhost:3001, iPad cùng wifi: http://<IP máy>:3001
CONTENT_INCLUDE_DRAFT=1 pnpm dev --port 3001 # xem cả bài đang ở trạng thái nháp
```

Tiến độ học lưu trong trình duyệt của từng máy (IndexedDB). Đồng bộ giữa các máy thuộc mốc Go-live.

Máy dev không có cổng mã gia đình. Muốn thử cổng ở máy: đặt `FAMILY_CODE_SECRET` và `SESSION_SECRET` (mẫu ở `.env.example`) rồi chạy bản production như `docs/operations.md` hướng dẫn. Mã gia đình (`OWL…`) in bằng `pnpm family:code` (xem `docs/operations.md`, "Mã gia đình"). `pnpm test:e2e` tự mở thêm một dev server có cổng (cổng `TEST_PORT + 1000`, thư mục build `.next-gate`) cho `e2e/unlock.spec.ts`, và một dev server thứ ba cho đồng bộ nhiều máy (cổng `TEST_PORT + 2000`, thư mục build `.next-sync`, store thư mục trong thư mục tạm của hệ thống) cho `e2e/sync.spec.ts`. Đồng bộ chỉ bật khi đặt bốn biến `R2_*` (xem `docs/operations.md`, "Đồng bộ tiến độ giữa các máy"); không đặt thì app chạy như chưa có đồng bộ.

## Soạn bài mới

Trong Claude Code, gọi skill nhập bài:

```
/import-source Toán 6 tập 1, file ~/Downloads/toan6-tap1.pdf, bài 3, bé đang yếu phần so sánh số
```

Skill hỏi những gì còn thiếu, cắt trang PDF vào `sources/` (không commit), rồi chuyển cho các skill:

| Skill | Việc |
|---|---|
| `import-source` | Thu thập thông tin, cập nhật hồ sơ học tập, nạp trang sách |
| `lesson-author` | Soạn `content/<môn>/<bộ sách>/<bài>/lesson.json` |
| `lesson-visual` | Vẽ hình và animation trong `src/visuals/<môn>/<bài>/` |
| `lesson-review` | Review độc lập trước khi xuất bản |
| `lesson-video` | Video bài giảng và lời đọc giới thiệu |

Soạn bằng Sonnet; review vòng 1–2 bằng Opus, từ vòng 3 bằng Sonnet. Môn Ngữ văn dừng lại chờ chủ dự án duyệt bản chép văn bản gốc.

## Thêm môn mới

1. Thêm một mục vào `content/subjects.json`: `id`, `name`, `color` (một token của bảng màu môn trong `src/schema/content.ts`), `icon`, `language` (`vi` hoặc `en`; luật chữ tiếng Việt chỉ áp cho `vi`), `rules` (`checkExpr`, `verbatimPassage`, `requiresOpenEnded`), `series` (mỗi bộ có `grade` từ 1 đến 12) và `defaultSeries`.
2. Tạo `content/glossary/<id>.json` (thuật ngữ chuẩn của môn; có thể để danh sách rỗng).
3. Nếu cần màu hay icon mới: thêm vào danh sách ở `src/schema/content.ts`, biến `--color-subject-<token>` ở `src/app/globals.css` và bảng ở `src/components/subject-style.ts` (TypeScript báo thiếu).
4. Chạy `pnpm content:check`, rồi soạn bài đầu tiên bằng `/import-source`. Đến khi có bài đã xuất bản đầu tiên, ô môn ở trang chủ hiện khoá "Sắp ra mắt" (suy ra từ nội dung, không cần khai gì).

## Thêm lớp mới

1. Trong `content/subjects.json`, thêm một bộ sách vào `series` của môn với `grade` là lớp đó (1 đến 12; `id` bộ sách không trùng bộ khác của môn, vd `kntt-7`). Môn chưa dạy lớp này thì thêm mục môn (xem "Thêm môn mới") với bộ sách của lớp.
2. Soạn bài vào `content/<môn>/<bộ sách>/<bài>/` với `"grade"` trong `lesson.json` bằng `grade` của bộ sách (`content:check` báo lệch).
3. Không cần sửa code: lớp tự mở ở màn "Chọn lớp" và ở form hồ sơ khi có bài đầu tiên được xuất bản, và trang chủ của lớp đó liệt kê các môn có bộ sách của lớp (môn chưa có bài thì khoá).

## Dọn dẹp và Go-live

- `pnpm clean` xoá những gì lệnh nào cũng dựng lại được; giữ nguyên nội dung, bản đọc đã chốt và môi trường giọng đọc. Dừng dev server trước khi dùng `--deep`.
- Bản đọc từng câu của video (`video/projects/**/audio/`, `video/.cache/`) không nằm trong git và giữ dạng WAV vì pipeline đọc trực tiếp file WAV. Lúc Go-live, sao lưu cây này cùng `public/media/` lên một bucket R2 private để máy khác dựng lại vẫn dùng đúng bản đọc cũ (ví dụ `rclone copy video/.cache r2:<bucket-private>/video-cache`, tương tự cho `audio/`). Đây là bước làm tay; không có mã nào tự upload, và mỗi lần ghi lên R2 phải hỏi chủ dự án.
- Đưa media lên bucket công khai và đặt `NEXT_PUBLIC_MEDIA_BASE_URL`: các bước kèm lệnh ở `docs/operations.md`; mỗi bài mới đi theo mục "Đưa bài mới lên production" (`pnpm media:upload`, `pnpm deploy:prod`); không cần dựng lại gì vì `lesson.json` chỉ ghi đường dẫn tương đối.

## Lệnh thường dùng

| Lệnh | Việc |
|---|---|
| `pnpm lint` / `pnpm format` | Kiểm tra / sửa định dạng (Biome) |
| `pnpm typecheck` | Kiểm tra kiểu TypeScript |
| `pnpm test` / `pnpm test:e2e` | Unit test (Vitest) / E2E (Playwright) |
| `pnpm test:e2e:offline` | E2E offline trên bản build production của `HEAD` (dựng và chạy trong một worktree tạm, cổng `TEST_PORT + 500`; mất vài phút, chạy trước khi phát hành bản đụng tới `src/offline/`) |
| `pnpm test:r2` | Bộ test của store trên bucket R2 thật, chỉ dưới `test/<mã chạy>/`; ghi ra ngoài máy nên chỉ chạy khi chủ dự án đồng ý |
| `pnpm build` | Build production (chạy `content:check` trước) |
| `pnpm content:check [--stats]` | Kiểm nội dung: schema, lint tiếng Việt, đáp án, id, cổng xuất bản |
| `pnpm content:diff <bài>` | Liệt kê phần đổi so với bản đã review |
| `pnpm content:hash <bài> --approve` | Ghi dấu đã review và xuất bản |
| `pnpm content:hash <bài> --tips --approve` | Như trên cho `tips.json` của bài (mẹo có review và hash riêng, không đổi bài) |
| `pnpm content:lock <bài>…` | Khoá id của các bài nêu tên (tiến độ của trẻ gắn vào id); không nêu bài thì khoá mọi bài, bỏ qua bài có `reviewedHash` cũ |
| `pnpm sources:import <pdf> --pages X-Y …` | Cắt trang PDF thành ảnh (và lớp chữ) vào `sources/` |
| `pnpm lesson:walk <bài>` | Đi hết bài ở 3 khổ màn hình, chụp ảnh, báo lỗi bố cục; ghi sheet `sheet-NN.png` mỗi thiết bị |
| `pnpm visual:shot <bài>` | Chụp từng hình của bài; ghi sheet `sheet-<thiết bị>-NN.png` |
| `pnpm shots:sheet <thư mục\|tệp\|mẫu>… [--cols N] [--out <tiền tố>] [--width PX] [--height PX]` | Ghép ảnh chụp thành contact sheet, mỗi ô in tên tệp, tự chia nhiều sheet; đọc một sheet thay cho nhiều ảnh (cần `ffmpeg`) |
| `pnpm video:build <bài> <video>` / `pnpm video:check` | Dựng video / kiểm video đã dựng |
| `pnpm narration:build <bài>` | Lời đọc cho phần giới thiệu bài, bằng giọng Gemini của bài (nam/nữ theo `media.json`); cần key ở `~/.config/gemini/api_key*`; hết hạn mức thì đọc lại cả bài bằng giọng VieNeu |
| `pnpm brand:images` | Vẽ lại icon cú mèo (app, Màn hình chính, favicon) và ảnh xem trước link vào `public/brand/` từ `assets/brand/owl.svg` (chỉ khi đổi cú, màu hoặc chữ trên ảnh) |
| `pnpm sounds:build` | Âm thanh dùng chung của app (chỉ khi đổi câu thoại) |
| `pnpm media:upload <bài>… \| --all [--dry-run]` | Tải media của bài (`public/media/video\|narration/<bài>/`) lên bucket R2 với `Content-Type` đúng, bỏ qua tệp đã giống hệt; ghi ra ngoài máy, chỉ chạy khi chủ dự án đồng ý |
| `pnpm deploy:prod [--dry-run]` | Deploy `HEAD` lên Vercel production từ worktree sạch rồi kiểm nhanh (chuyển về mở khoá, 401, đăng nhập, index 200, media 206); ghi ra ngoài máy, chỉ chạy khi chủ dự án đồng ý. Quy trình đầy đủ: `docs/operations.md`, "Đưa bài mới lên production" |
| `pnpm clean [--deep]` | Xoá ảnh chụp, log, coverage, `renders/` và các bản đọc thử; `--deep` xoá thêm `.next/` khi không có dev server |

## Cấu trúc

```
content/            nội dung bài học (JSON), bảng thuật ngữ, khoá id
src/app/            trang (trẻ, phụ huynh, trang dev)
src/exercises/      8 dạng bài tập, chấm bài, phản hồi 3 nấc
src/visuals/        hình và animation, registry
src/progress/       lưu tiến độ trên máy (Dexie)
src/srs/            ôn tập theo mức nhớ (FSRS)
video/              dựng video và lời đọc (chạy trên máy)
public/sounds/      âm thanh dùng chung (commit)
public/media/       video, lời đọc của từng bài (không commit; `pnpm media:upload` đưa lên R2)
sources/            ảnh trang sách (không commit)
scripts/            công cụ kiểm tra, nạp nguồn, chụp ảnh
e2e/, tests/        kiểm thử
```

## Nguyên tắc

- Không commit `sources/`, `.env*`, file media nặng.
- Mọi thao tác ghi ra ngoài máy (push, deploy, R2, gọi API) phải hỏi chủ dự án trước.
- Id nội dung đã xuất bản không được đổi hay xoá; buộc phải đổi thì khai `retired` trong `content/ids.lock.json`.
