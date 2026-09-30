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
Đã xong (chạy trên máy, chưa upload): pipeline `pnpm video:build` (TTS `local` VieNeu "Hải Đăng", kiểm từng câu bằng mlx-whisper, HyperFrames, H.264 720p, phụ đề karaoke WebVTT, clip theo card), player trong bài và nút "Xem lại đoạn video" ở thẻ ôn, skill `lesson-video`, ba video bài Luỹ thừa, lời đọc giới thiệu và video cho Bài 7 (`thu-tu-thuc-hien-phep-tinh`) và Bài 1 (`tap-hop`) (file ở `public/media/`, gitignore). Còn lại:
- Chốt domain cho bucket media (Cloudflare) hay tạm `r2.dev`.
- Lúc go-live: upload `public/media/` lên bucket media, CORS, đặt `NEXT_PUBLIC_MEDIA_BASE_URL` (các bước ở skill `lesson-video`, mục "Lên go-live"; hỏi trước khi ghi R2).
- Quản trị viên nghe duyệt giọng của các video; kiểm tua và phụ đề trên iPad Safari thật.
- Làm video cho các bài khác khi bài xuất bản, bắt đầu với bài Ngữ văn đầu tiên.

## Ý tưởng chờ bàn (chưa chốt)
- Bài tập bổ trợ ngoài sách giáo khoa cho từng môn, cùng phong cách hướng dẫn và luyện tập. Nhu cầu thực tế: trẻ lớp 6 vẫn sai phép nhân/chia đã học ở tiểu học, không thuộc bài nào của lớp 6. Hướng đã nêu để cân nhắc: mạch "Nền tảng" theo môn (dùng lại toàn bộ hệ thống bài học), bài tập sinh số tự động cho phép tính, bài kiểm tra đầu vào tìm kỹ năng hổng. Chưa quyết cách tổ chức cho các môn khác.

## Hàng đợi soạn bài Toán 6 tập 1 (chủ dự án yêu cầu 2026-09-30)
Nguồn: `/Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf` — đây là **Sách bài tập** Toán 6 KNTT tập 1 (có "Kiến thức cần nhớ", ví dụ, đề bài và phần lời giải cuối sách). Trang in = trang PDF − 1.
Thứ tự: Bài 7 và Bài 1 đã xong (xuất bản, có lời đọc và video, walk 0 lỗi); còn Bài 5, 4, 3, 2 (song song theo worktree). Bài nào cần thì thêm các bước dẫn dắt từ dễ tới khó. Bé đã học hết chương 1, đang ôn tập chương.
Yêu cầu: bám sách; chỗ nào khó thì thêm các bước dẫn dắt từ dễ tới khó (kiến thức nền của bài trước được phép, ghi `sourceRef` rõ). Dùng phần lời giải làm đáp án đối chiếu.

| Bài | Trang in (đề) | Trang PDF (đề) | Trang in (lời giải) | Trang PDF (lời giải) |
|---|---|---|---|---|
| 7. Thứ tự thực hiện các phép tính | 24–26 | 25–27 | 102–103 | 103–104 |
| 1. Tập hợp | 5–6 | 6–7 | 94 | 95 |
| 5. Phép nhân và phép chia số tự nhiên | 17–20 | 18–21 | 98–100 | 99–101 |
| 4. Phép cộng và phép trừ số tự nhiên | 14–16 | 15–17 | 96–98 | 97–99 |
| 3. Thứ tự trong tập hợp các số tự nhiên | 11–13 | 12–14 | 96 | 97 |
| 2. Cách ghi số tự nhiên | 7–10 | 8–11 | 94–96 | 95–97 |

## Trạng thái khi tạm dừng vì hết hạn mức (tối 2026-09-30)
- Xong hoàn toàn (xuất bản, lời đọc, video, `lesson:walk` 0 lỗi trên ba thiết bị): Bài 1 `tap-hop`, Bài 7 `thu-tu-thuc-hien-phep-tinh` (cùng Luỹ thừa, bài cáo).
- Bài 5 `phep-nhan-phep-chia`: nhánh `worktree-agent-a36c64bad7802c3d9`, commit "wip: paused…" (đang dựng visual song song).
- Bài 4 `phep-cong-phep-tru`: nhánh `worktree-agent-a9710b34e396f6fe3`, đã sửa theo review vòng 1; việc tiếp: gate, shot, walk, review vòng 2.
- Chưa bắt đầu: Bài 3, Bài 2.
- Chờ chủ dự án: lệnh `pnpm clean` + chuyển môi trường giọng đọc sang `video/.venv`.
- Bài 5: visual chia (share, pack, đặt tính chia…) đã xong trong worktree. Việc app cần làm khi tiếp tục: truyền `params` của bài tập xuống visual `manipulate` (`VisualProps`, `RegistryVisual`, `ManipulateAnswer`) để `shareFill`, `colDivFill`, `colMulFill`, `gridFill` vẽ đúng số của đề.
- Bài 4: review vòng 2 nhóm 3 (section 13–18) đã có kết quả ở `.claude/worktrees/agent-a9710b34e396f6fe3/.shots/review/phep-cong-phep-tru/nhom-3.md` (3 Nghiêm trọng: `chon-uoc-luong-kt`, `chon-tong-sai`, `chon-cap-day-so-2` có hai đáp án đúng; 6 Nên sửa). Kiểm tra kết quả nhóm 1–2 cùng thư mục khi tiếp tục, rồi gộp vào `review.md`.

## Hàng đợi (làm lần lượt, mỗi lần một subagent)
1. Thêm kiểm tra tự động vào `video:build` (không tốn token): mỗi câu trong `script.json` phải có trong phụ đề thật (VTT) của video; chữ trên màn cuối/màn quy tắc phải khớp câu quy tắc của bài. Chỉ thêm kiểm tra, không đổi cách dựng hình, giọng, nhịp. Nếu kiểm tra buộc phải đổi gì ảnh hưởng chất lượng video (ví dụ cắt câu, đổi nhịp, bỏ hiệu ứng) thì dừng và báo chủ dự án trước.
2. Bài 4 (theo `backlogs/handover-phep-cong-phep-tru.md` trong worktree bài 4).
3. Bài 5 (theo `backlogs/handover-phep-nhan-phep-chia.md`).
4. Bài 3, Bài 2.
