# Tutor

Ứng dụng web (PWA) giúp học sinh lớp 6 tự học: bài học dựng từ sách giáo khoa và sách bài tập, giải thích bằng hình và animation, bài tập tương tác có gợi ý 3 nấc, ôn tập theo mức nhớ (FSRS), video và lời đọc tiếng Việt. Dùng chính trên iPad, chạy tốt trên điện thoại.

Tài liệu chính:

| Tài liệu | Nội dung |
|---|---|
| `docs/spec.md` | Yêu cầu sản phẩm, mô hình nội dung, luật kiểm duyệt, tiêu chí từng mốc |
| `docs/design-system.md` | Màu, chữ, bố cục, phản hồi, linh vật |
| `docs/learner.md` | Hồ sơ học tập của trẻ (dùng khi soạn bài) |
| `docs/lessons-learned/index.md` | Lỗi nội dung đã gặp và cách phòng |
| `backlogs/milestones.md` | Hàng đợi công việc và trạng thái |
| `CLAUDE.md` | Hướng dẫn cho Claude Code trong dự án |

## Chạy trên máy

Yêu cầu: Node.js ≥ 22, pnpm. Công cụ media (chỉ khi làm video/lời đọc): ffmpeg, poppler (`pdftoppm`), môi trường Python của giọng đọc (xem skill `lesson-video`).

```bash
pnpm install
pnpm dev --port 3001                         # http://localhost:3001, iPad cùng wifi: http://<IP máy>:3001
CONTENT_INCLUDE_DRAFT=1 pnpm dev --port 3001 # xem cả bài đang ở trạng thái nháp
```

Tiến độ học lưu trong trình duyệt của từng máy (IndexedDB). Đồng bộ giữa các máy thuộc mốc Go-live.

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

## Lệnh thường dùng

| Lệnh | Việc |
|---|---|
| `pnpm lint` / `pnpm format` | Kiểm tra / sửa định dạng (Biome) |
| `pnpm typecheck` | Kiểm tra kiểu TypeScript |
| `pnpm test` / `pnpm test:e2e` | Unit test (Vitest) / E2E (Playwright) |
| `pnpm build` | Build production (chạy `content:check` trước) |
| `pnpm content:check [--stats]` | Kiểm nội dung: schema, lint tiếng Việt, đáp án, id, cổng xuất bản |
| `pnpm content:diff <bài>` | Liệt kê phần đổi so với bản đã review |
| `pnpm content:hash <bài> --approve` | Ghi dấu đã review và xuất bản |
| `pnpm content:lock` | Khoá id đã xuất bản (tiến độ của trẻ gắn vào id) |
| `pnpm sources:import <pdf> --pages X-Y …` | Cắt trang PDF thành ảnh (và lớp chữ) vào `sources/` |
| `pnpm lesson:walk <bài>` | Đi hết bài ở 3 khổ màn hình, chụp ảnh, báo lỗi bố cục |
| `pnpm visual:shot <bài>` | Chụp từng hình của bài |
| `pnpm video:build <bài> <video>` / `pnpm video:check` | Dựng video / kiểm video đã dựng |
| `pnpm narration:build <bài>` | Lời đọc cho phần giới thiệu bài |
| `pnpm sounds:build` | Âm thanh dùng chung của app (chỉ khi đổi câu thoại) |

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
public/media/       video, lời đọc của từng bài (không commit; upload lên R2 khi Go-live)
sources/            ảnh trang sách (không commit)
scripts/            công cụ kiểm tra, nạp nguồn, chụp ảnh
e2e/, tests/        kiểm thử
```

## Nguyên tắc

- Không commit `sources/`, `.env*`, file media nặng.
- Mọi thao tác ghi ra ngoài máy (push, deploy, R2, gọi API) phải hỏi chủ dự án trước.
- Id nội dung đã xuất bản không được đổi hay xoá; buộc phải đổi thì khai `retired` trong `content/ids.lock.json`.
