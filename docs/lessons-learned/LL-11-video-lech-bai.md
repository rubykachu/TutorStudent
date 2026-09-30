# LL-11 — Video lệch kịch bản, phụ đề hay bài

## Triệu chứng

Lời đọc, hình, phụ đề, thời lượng hay mốc clip của video không khớp nhau hoặc không khớp `lesson.json`.

## Ví dụ thật

- `thu-tu-thuc-hien-phep-tinh` vòng 4, video `hon-hop`: hình làm hai phép một dòng trong khi lời đọc "mỗi dòng một phép".
- `thu-tu-thuc-hien-phep-tinh` vòng 5: `durationSec` và clip `ngoac-long` lệch mp4, cắt mất câu kết.
- `tap-hop` vòng 6: kịch bản có hai câu không có trong mp4.
- `luy-thua`: khung cuối video chia thiếu điều kiện a ≠ 0.

## Nguyên nhân gốc

Sửa kịch bản mà không dựng lại video, hoặc dựng ở cây khác cây đang review.

## Cách phòng

- Máy: `pnpm video:check` (chạy sau `video:build`): mọi câu kịch bản có trong WebVTT đúng thứ tự, chữ quy tắc trên hình bằng câu của bài; `video:build` so câu `rule`/`quote` nguyên văn với bài và ghi `videos[]` từ tệp đã dựng.
- Người: checklist mục "Lời video khớp bài".

## Trạng thái

Đang áp dụng.
