# Bàn giao: Bài 5 `phep-nhan-phep-chia` (Phép nhân và phép chia số tự nhiên)

## Trạng thái
- Worktree `.claude/worktrees/agent-a36c64bad7802c3d9`, nhánh `worktree-agent-a36c64bad7802c3d9`: commit `0d0f6b2` (khung `lesson.json` nháp + catalog visual) và `e4aa074` (wip lúc dừng).
- Nguồn: sách bài tập tr.17–20 (PDF 18–21), lời giải tr.98–100 (PDF 99–101), đã nạp vào `sources/math/phep-nhan-phep-chia/`.
- Visual: đang dựng song song theo nhóm "kind". Nhóm phép chia (share, pack, remCheck, factFamily, colDiv, colDivTry, shareTry, shareFill, colDivFill — 9 kind) đã xong và qua test riêng. Các nhóm kind khác (nhân, lưới, tính chất…) chưa có báo cáo — kiểm file trong `src/visuals/math/phep-nhan-phep-chia/` và `pnpm visual:shot phep-nhan-phep-chia` để biết kind nào còn thiếu.
- Chưa: walk, review, approve, lock, overview hoàn chỉnh.

## Việc tiếp theo
1. Trong worktree: `pnpm install`, dev server cổng riêng (vd 3230) với `CONTENT_INCLUDE_DRAFT=1`; `git merge main`.
2. Sửa app cho `manipulate`: truyền `params` của bài tập xuống visual (`VisualProps`, `RegistryVisual`, `ManipulateAnswer`) để `shareFill`, `colDivFill`, `colMulFill`, `gridFill` vẽ đúng số của đề (xem báo cáo trong `notebooks/backlogs/index.md`). Thêm mẫu vào `samples` của registry test: chia `{ total: 29, people: 6 }` → `{ q: 4, r: 5 }`; thương-dư `{ dividend: 217, divisor: 15 }` → `{ q1: 1, q0: 4, r1: 0, r0: 7 }`.
3. Hoàn thiện các kind còn thiếu → `pnpm visual:shot phep-nhan-phep-chia` pass, đọc ảnh.
4. Hoàn thiện `lesson.json` theo skill `lesson-author` (overview, câu chọn nhiều, ví dụ đời sống, không cắt chữ) → `pnpm content:check --stats` PASS → walk 0 lỗi.
5. Review (Opus, ≤2 vòng đầy đủ rồi vòng phần đổi) → approve → lock → gate → gộp main.
