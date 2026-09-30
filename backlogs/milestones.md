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
Đã xong (chạy trên máy, chưa upload): pipeline `pnpm video:build` (TTS `local` VieNeu "Hải Đăng", kiểm từng câu bằng mlx-whisper, HyperFrames, H.264 720p, phụ đề karaoke WebVTT, clip theo card), player trong bài và nút "Xem lại đoạn video" ở thẻ ôn, skill `lesson-video`, ba video bài Luỹ thừa (file ở `public/media/`, gitignore). Còn lại:
- Chốt domain cho bucket media (Cloudflare) hay tạm `r2.dev`.
- Lúc go-live: upload `public/media/` lên bucket media, CORS, đặt `NEXT_PUBLIC_MEDIA_BASE_URL` (các bước ở skill `lesson-video`, mục "Lên go-live"; hỏi trước khi ghi R2).
- Quản trị viên nghe duyệt giọng của ba video; kiểm tua và phụ đề trên iPad Safari thật.
- Làm video cho các bài khác khi bài xuất bản, bắt đầu với bài Ngữ văn đầu tiên.

## Ý tưởng chờ bàn (chưa chốt)
- Bài tập bổ trợ ngoài sách giáo khoa cho từng môn, cùng phong cách hướng dẫn và luyện tập. Nhu cầu thực tế: trẻ lớp 6 vẫn sai phép nhân/chia đã học ở tiểu học, không thuộc bài nào của lớp 6. Hướng đã nêu để cân nhắc: mạch "Nền tảng" theo môn (dùng lại toàn bộ hệ thống bài học), bài tập sinh số tự động cho phép tính, bài kiểm tra đầu vào tìm kỹ năng hổng. Chưa quyết cách tổ chức cho các môn khác.
