# Bàn giao: Bài 5 `phep-nhan-phep-chia` (Phép nhân và phép chia số tự nhiên)

## Trạng thái
- Worktree `.claude/worktrees/agent-a36c64bad7802c3d9`, nhánh `worktree-agent-a36c64bad7802c3d9`. Đã gộp `main`, đã truyền `params` của `manipulate` xuống visual (có test), đã thêm `number`/`chapter`, `content:check` 0 lỗi.
- Nguồn: sách bài tập tr.17–20 (PDF 18–21), lời giải tr.98–100 (PDF 99–101), trong `sources/math/phep-nhan-phep-chia/` ở cây chính.
- Server worktree chạy cổng 3230 (`TEST_PORT=3230` cho `pnpm visual:shot`, `WALK_BASE_URL=http://localhost:3230` cho walk); sau khi sửa `lesson.json` chạy `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`.
- Tác giả xong: `visual:shot` 164/164, `content:check --stats` 0 lỗi, `lesson:walk` 0 FAIL 0 WARN, đã xem ảnh. Chưa review, chưa `content:lock`, còn `status: draft`.

## Việc tiếp theo
1. Review bằng subagent mới (Opus, vòng 1 và 2 đầy đủ) rồi approve, `pnpm content:lock`, gộp vào main.
