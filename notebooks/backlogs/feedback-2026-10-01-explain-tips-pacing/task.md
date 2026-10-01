# Phản hồi của chủ app (01/10/2026): giải thích sau mỗi câu, mẹo, tổng quan gắn đời sống, nhịp video

Hệ thống đã sẵn sàng cho bài mới; bài và video đã có không bị sửa, dựng lại hay đọc lại.

## Đã làm (nền tảng)

- [x] Tổng quan gắn đời sống: luật trong `lesson-author` (`whyItMatters` là một câu nêu tình huống cụ thể), mục checklist trục 3, lint `overview` bắt buộc với bài mới. Máy không kiểm được "cụ thể hay chung chung" (kiểm chữ sẽ giòn), nên phần đó là việc của reviewer.
- [x] Mẹo: khối `tip` trong section, `tips.json` riêng cho bài đã xuất bản (review và hash riêng, id khoá cùng bài), trang "Mẹo hay" (`/lessons/<id>/tips`) và nút ở trang bài, luật soạn và checklist (thử mẹo trên ≥ 5 đầu vào), `lesson:walk` đi cả trang mẹo.
- [x] Giải thích sau mỗi câu: trường `explain` (có `wrong` cho `choice`), khung "Giải thích" sau đúng, sau nấc 3, sau "Bỏ qua" (bỏ qua nay mở đáp án rồi "Tiếp"), bài chưa có `explain` hiện "Lời giải" suy từ hình lời giải và đáp án. Cổng bắt buộc nằm ở `content/legacy-lessons.json`.
- [x] Nhịp video: `pause` (`think`, `ask`) đổi thành khoảng lặng của dòng thời gian, `checkpoint` thành `videos[].checkpoints` mà player dừng ("Xem tiếp", "Xem lại đoạn này"); luật nhịp cho video mới (`video/pacing-exempt.json` liệt kê 29 video cũ), `video:check` đo khoảng lặng thật.

## Việc kế tiếp

- [x] Viết `explain` cho 4 bài chương II (`quan-he-chia-het-va-tinh-chat` đã xong, 02/10/2026: 68 câu, đã review, đã xoá khỏi `legacy-lessons.json`; `dau-hieu-chia-het` xong 02/10/2026: 82 câu, review vòng 6 (2 Nghiêm trọng, sai toán trong một lý do `wrong` và một câu nói "chỉ có một số") và vòng 7 (0), đã xoá khỏi `legacy-lessons.json`; `so-nguyen-to` xong 02/10/2026: 65 câu, review vòng 5 (1 Nghiêm trọng: `wrong` của `xep-18-cach` gắn nhầm phương án) và vòng 6 (0), đã xoá khỏi `legacy-lessons.json`; `uoc-chung-uoc-chung-lon-nhat` xong 02/10/2026: 65 câu, review vòng 5 (0 Nghiêm trọng, 2 Nên sửa về màu `\concept` trong `tex` đã sửa), đã xoá khỏi `legacy-lessons.json`; cả 4 bài chương II đã xong; mỗi bài một subagent, Sonnet, theo mục "Giải thích sau mỗi câu" của `lesson-author`). Mỗi bài đang `"warn"` trong `content/legacy-lessons.json`: `content:check` cảnh báo một dòng đếm số câu còn thiếu. **Xong một bài thì xoá dòng của bài đó khỏi `content/legacy-lessons.json`**; từ đó câu nào thiếu `explain` là lỗi, và `tests/content/explain-required.test.ts` chặn. Viết `explain` đổi hash của bài nên mỗi bài cần một vòng review phần đổi (`lesson-review`) rồi `content:hash --approve`; không động tới `videos[]`, `overview.narration`.
- [ ] Viết `tips.json` cho Bài 8 đến Bài 11 (task riêng, theo mục "Thêm mẹo cho bài đã xuất bản" của `lesson-author`); review riêng bằng `lesson-review` (mục "Review mẹo") rồi `pnpm content:hash <bài> --tips --approve`.
- [ ] Chủ dự án thêm bài chương I vào danh sách bắt buộc khi muốn: đổi `"exempt"` thành `"warn"` ở `content/legacy-lessons.json` (cảnh báo), viết `explain`, rồi xoá dòng.
- [ ] Dựng lại video cũ theo nhịp mới chỉ khi chủ dự án quyết định: viết lại `script.json` theo `lesson-video`, dựng lại, xoá dòng của video khỏi `video/pacing-exempt.json`. Mỗi video dựng lại là đọc lại giọng, nên cần xin phép từng lần.

## Quyết định thiết kế

- `explain` bắt buộc theo danh sách `content/legacy-lessons.json` thay vì cờ trong từng bài, vì cờ trong bài mới dễ quên còn danh sách là tập đóng của bài cũ: bài nào không có trong danh sách là bài mới.
- Mẹo ở `tips.json` không đụng `lesson.json`, nên không đổi `reviewedHash` của bài, video hay lời đọc.
- Nút của điểm dừng là "Xem tiếp", không phải "Tiếp", vì "Tiếp" là nút rời màn của phần đang nằm cuối màn; hai nút cùng tên làm bé bỏ qua video.
- "Bỏ qua" mở đáp án và giải thích trước khi đi tiếp; cú im lặng (không có câu thoại ghi sẵn cho tình huống này, và thêm câu thoại là dựng lại âm thanh dùng chung).
- `tipCount` trong `index.json` là tuỳ chọn để mọi bản tóm tắt bài cũ vẫn hợp lệ.
