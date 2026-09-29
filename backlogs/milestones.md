# Các mốc sau "Học được"

Tiêu chí hoàn thành của từng mốc nằm ở `docs/spec.md`, mục "Tiêu chí thành công". File này chỉ liệt kê đầu việc để lập plan chi tiết khi bắt đầu mốc (plan chi tiết ghi vào `tasks/`).

## Go-live
- Người dùng tạo 2 bucket R2 (private, public), token app + token admin, lifecycle `snapshots/` 180 ngày, CORS bucket public — theo `docs/operations.md` (viết ở mốc này).
- Sửa hook `~/.claude/hooks/github-identity-guard.sh` để `TutorStudent` dùng `rubykachu` (đưa diff, chờ duyệt).
- `BlobStore` + adapter R2 + adapter in-memory; `/api/session`, `/api/parent-session`, `/api/sync`; `proxy.ts`; kiểm family/epoch/isAdmin; khoá PIN.
- Sync engine Dexie ↔ R2 (If-Match / If-None-Match, snapshot, giới hạn 1 MB), hàng đợi đồng bộ, hàm `merge`, chuyển tiến độ theo `retired`.
- Đo hiệu năng (Lighthouse, Performance trace iPad).
- `/unlock`, `/install`, PWA `@serwist/turbopack`, precache toàn bộ nội dung.
- `pnpm admin` + skill `tutor-admin`.
- Tạo project Vercel (account `rubykachu`), biến môi trường, deploy (hỏi trước).

## Đủ 3 môn
- Chờ tài liệu bài Địa lí đầu tiên. TopoJSON ranh giới theo góc nhìn Việt Nam; `tapRegion` trên bản đồ.
- Trang phụ huynh: ngày học, thời lượng, thẻ hay quên, bài viết, xuất/nhập JSON.
- `AiReviewer` + adapter Gemini, `/api/feedback`, hạn mức theo gia đình, fallback tự tick.

## Kênh nhanh
- `z.toJSONSchema` → prompt; trang quản trị dán JSON/SVG; validate trước khi lưu; `/api/content` GET/POST/DELETE; DOMPurify client; hiển thị SVG qua `<img>`.
- `content:check` kéo overlay từ R2; client `safeParse`; skill `content-prompt` (sinh prompt, gom overlay về git).

## Video
- TTS mặc định: VieNeu-TTS giọng "Hải Đăng" (đã chạy thử được ở `video/spikes/vieneu/`); chuyển script thử nghiệm thành adapter `video/tts/local`.
- Chốt domain cho bucket media (Cloudflare) hay tạm `r2.dev`.
- Skill `lesson-video`: kịch bản → TTS → mlx-whisper → HyperFrames → ffmpeg 720p → clip theo card → upload (hỏi trước) → ghi `Video` vào `lesson.json`.
- Video đầu tiên: luỹ thừa qua bàn cờ.
