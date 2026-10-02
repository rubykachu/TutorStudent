# Bàn giao: Bài 17 `phep-chia-het-uoc-va-boi-cua-mot-so-nguyen` (Phép chia hết. Ước và bội của một số nguyên)

## Trạng thái
- Cập nhật cuối: 02/10/2026, đang soạn (nháp). Việc đã xong: nạp nguồn.
- Việc còn lại: soạn `lesson.json`, hình, `content:check --stats`, `visual:shot`, `lesson:walk`, review vòng 1–2 (Opus) rồi Haiku đọc hiểu, các vòng sau (Sonnet, chỉ phần đổi), `content:hash --approve`, `content:lock`. Không làm lời đọc và video trong đợt này.
- Việc chờ bên ngoài: Bài 16 `phep-nhan-so-nguyen` (quy tắc dấu của phép nhân) đang được soạn song song, chưa có `lesson.json` lúc bắt đầu. Khi Bài 16 xuất bản phải chạy một vòng kiểm khớp cách nói quy tắc dấu và màu giữa hai bài (xem "Việc khớp với Bài 16").

## Nguồn (sách bài tập, `sources/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/`, không commit)
- Đề: tr.58–59 in (PDF 59–60), tệp `sbt-p58.png`, `sbt-p59.png`. Tr.60 là "Ôn tập chương III", không thuộc bài này.
- Lời giải: tr.113 in (PDF 114), tệp `sbt-p113.png`, mục "Bài 17" (3.36 đến 3.40). Sách không in đáp án câu 3.35; đáp án câu này do người soạn tự tính.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 58-59 (rồi 113-113) --subject math --series kntt --slug phep-chia-het-uoc-va-boi-cua-mot-so-nguyen --book sbt --offset 1`.
- Chương III "Số nguyên"; `number: 17`, `order: 17`.
- Nội dung nguồn: kiến thức cần nhớ 1 (phép chia hết, dấu của thương), 2 (ước và bội, ước chung), 3 (cách tìm ước và bội); ví dụ 1 (bốn phép chia từ một phép), ví dụ 2 (phân tích 6 thành tích); bài 3.35 đến 3.40.

## Giả định (chủ dự án vắng, không hỏi được)
- Nguồn là sách bài tập, trang đáp án tr.113. Số trong bài tự chọn nhỏ hơn số của sách (bé học chậm, số nhỏ tính nhẩm được).
- Bài 3.38 (tập hợp P viết bằng dấu `{x ∈ ℤ | …}`) dạy bằng lời ("các số nguyên chia hết cho 3, lớn hơn −18 và không lớn hơn 18"), vì bé chưa viết được kí hiệu tập hợp (`docs/learner.md`).
- Số 0: dạy "0 chia cho số khác 0 bằng 0" và "không chia cho 0" (suy ra từ b ≠ 0 và a = b·q của sách); không đề cập ước của 0.
- Mẹo chỉ viết khi đúng với mọi số thuộc dạng bài (đã thử bằng chương trình tạm, không commit): xem mục "Mẹo".
- Quy tắc dấu của thương viết bằng lời của bài này, cùng màu với Bài 14 (số dương lime, số âm pink); chờ khớp với Bài 16.

## Cấu trúc bài
(sẽ cập nhật sau khi soạn)

## Việc khớp với Bài 16
- Khi Bài 16 `phep-nhan-so-nguyen` xuất bản: đọc câu quy tắc dấu của phép nhân và màu khái niệm của nó, so với câu quy tắc dấu của thương ở các phần 2, 3, 4 của bài này; sửa bài này theo Bài 16 (chữ đổi thì chạy `content:diff`, Haiku đọc hiểu mục đổi, một vòng review chỉ phần đổi, `content:hash --approve`).
