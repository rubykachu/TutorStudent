# Bàn giao: lời đọc + video cho Bài 7 (`thu-tu-thuc-hien-phep-tinh`) và Bài 1 (`tap-hop`)

## Trạng thái
- Nhánh `wip/bai7-media` (2 commit wip) chứa thay đổi `lesson.json` (overview.narration, videos[], video block đầu section) và nguồn video (`video/projects/<bài>/<video>/{script.json,index.html}`, `figures.tsx` của Bài 1).
- File media đã dựng (gitignored, nằm ở `public/media/`):
  - Bài 7: `narration/thu-tu-thuc-hien-phep-tinh/overview.{m4a,vtt}`; video `hoa-don`, `hon-hop`, `ngoac-long` (`.mp4/.vtt/.jpg`).
  - Bài 1: `narration/tap-hop/overview.{m4a,vtt}`; video `tap-hop-la-gi`, `thuoc-khong-thuoc`.
- Lúc dừng, agent đang: bỏ một helper thừa (`swap`) và sửa khung hình của `hoa-don` và `ngoac-long` (sau khi xem contact sheet). Chưa review, chưa approve → `content:check` báo `review-hash` cho hai bài trên nhánh này.

## Việc tiếp theo (theo thứ tự)
1. `git switch wip/bai7-media` (hoặc tạo worktree từ nhánh này); `git merge main`.
2. Xem khung hình `hoa-don`, `ngoac-long` bằng skill `webapp-evidence:vision`; nếu còn lỗi, sửa `video/projects/thu-tu-thuc-hien-phep-tinh/<video>/index.html` rồi `pnpm video:build thu-tu-thuc-hien-phep-tinh <video>`. Không dựng lại video đã ổn.
3. Review phần đổi từng bài (skill `lesson-review`, reviewer Opus, `pnpm content:diff <id>`), sửa, `pnpm content:hash <id> --approve`, `pnpm content:lock`.
4. `WALK_BASE_URL=http://<LAN>:3001 pnpm lesson:walk <id>` → 0 lỗi cho cả hai bài.
5. Gate `pnpm lint && pnpm typecheck && pnpm test && pnpm content:check`, rồi gộp vào main, xoá nhánh wip.

## Lưu ý
- Kịch bản video phải trùng nguyên văn câu quy tắc (`"rule": true`) — build tự kiểm.
- Không dựng lại âm thanh dùng chung `public/sounds/`.
