# Bàn giao: Bài 5 `phep-nhan-phep-chia` (Phép nhân và phép chia số tự nhiên)

## Trạng thái
- Worktree `.claude/worktrees/agent-a36c64bad7802c3d9`, nhánh `worktree-agent-a36c64bad7802c3d9`. Đã gộp `main`, đã truyền `params` của `manipulate` xuống visual (có test), đã thêm `number`/`chapter`, `content:check` 0 lỗi.
- Nguồn: sách bài tập tr.17–20 (PDF 18–21), lời giải tr.98–100 (PDF 99–101), trong `sources/math/phep-nhan-phep-chia/` ở cây chính.
- Server worktree chạy cổng 3230 (`TEST_PORT=3230` cho `pnpm visual:shot`, `WALK_BASE_URL=http://localhost:3230` cho walk); sau khi sửa `lesson.json` chạy `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`.
- Tác giả xong: `visual:shot` 164/164, `content:check --stats` 0 lỗi, `lesson:walk` 0 FAIL 0 WARN, đã xem ảnh. Chưa review, chưa `content:lock`, còn `status: draft`.

## Việc tiếp theo
1. Review bằng subagent mới (Opus, vòng 1 và 2 đầy đủ) rồi approve, `pnpm content:lock`, gộp vào main.

## Sau review vòng 1
- Quy ước viết phép nhân của cả bài: a · b là "a được lấy b lần" (số được cộng viết trước, số lần lấy viết sau), dạy một lần ở section `nhan-cong-lap`. Mọi đề, hình, đáp án theo quy ước này; giao hoán (section `giao-hoan`) dạy rằng đổi chỗ thì tích không đổi. Đã sửa 4 Nghiêm trọng và các mục Nên sửa, Góp ý còn lại ngoài danh sách dưới. Id đề có số đã đổi theo số mới (vd `chon-du-26-4`, `loi-nhan-38-7`); chưa khoá id nên không cần `retired`.
- Còn việc: review vòng 2 đầy đủ (Opus), rồi `pnpm content:hash --approve`, `pnpm content:lock`.

## Chưa sửa
- Góp ý 12: số nhớ xếp chồng hai tầng ở hình đặt tính nhân hai chữ số và cỡ chữ hình cùng làm trên iPad ngang. Đổi bố cục `col-mul-figure.tsx` tốn nhiều công, đã có dòng ghi chú "0 mờ chỉ giữ chỗ"; để vòng sau nếu reviewer còn thấy khó đọc.
- Góp ý 2 (phím "mũ" của bàn phím số hiện trước bài Luỹ thừa): thuộc bố cục chung của app, không thuộc nội dung bài; báo người làm app.
- Góp ý 18 (`h-visual-frame` ở trang dev visual làm `visual:shot` báo tràn khung): đổi sang `min-h` sẽ làm mất phép kiểm tràn của `visual:shot`; báo người làm app.
- Góp ý 19 (`mua-vo-100-12`, `xep-xe-50-12` đặt sẵn đủ ô): thêm ô từng bước là viết lại `pack.tsx`, giá trị sư phạm thấp vì đề đã có câu hỏi riêng.
- Góp ý 20 (xanh cho cả thừa số và số bị chia, hổ phách cho cả tích và thương): màu do glossary chung của môn quy định, đổi sẽ kéo theo mọi bài Toán; dòng `24 = 6 · 4` giữ màu vì nó chỉ vai số bị chia, số chia, thương.
