# Review: Phép nhân và phép chia số tự nhiên (`phep-nhan-phep-chia`)

- Bài: `content/math/kntt/phep-nhan-phep-chia/lesson.json`
- Vòng: 7 - chỉ phần đổi (`pnpm content:diff`): khối `explain` của cả 75 câu chấm được
- Nguồn đã đọc: `sources/` không có trên máy; mọi số trong `explain` được tính lại bằng python
- `content:check`: 0 lỗi, 0 cảnh báo của bài
- `lesson:walk`: do điều phối chạy sau vòng này
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa (6 mục Nên sửa của reviewer đã sửa trong vòng), 9 Góp ý (một phần đã nhận, phần còn lại không chặn)
- Bản đã review: `7ccc96e83c034841db1d66c19f88dddad792449a9ea2fbb0e7c4d86115f5f877` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

Không có.

## Nên sửa

Không có (6 mục đã sửa: `nhan-cot-54-13`, `dien-48-6`, `chon-nhieu-nho-hon-500`, `chon-du-26-4`, `du-41-7`, `chon-kiem-tra-28-4`).

## Góp ý

- `noi-doi-cho`, `loi-thuong-458-9`, `chon-nhieu-chia-sai`: có thể thêm một vế cho rõ hơn; không chặn.
- `chia-154-12`, `chia-cot-217-15`, `du-185-15`: hai lượt chia trong một `text` hơi dày; không chặn.

## Đã soát

- 75/75 câu chấm được có `explain`; mọi số trong `text`, `tex`, `wrong` đúng khi tính lại.
- `wrong` không đặt trên phương án đúng; câu nhiều đáp án không ngụ ý chỉ có một đáp án.
- Câu lời văn theo quy ước "a · b là a được lấy b lần"; màu khái niệm đúng với bài; `tex` render được bằng KaTeX.
