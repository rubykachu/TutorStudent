# Bàn giao: Bài 13 `tap-hop-cac-so-nguyen` (Tập hợp các số nguyên)

## Trạng thái
- Cập nhật cuối: 02/10/2026. Đang soạn (`status: draft`). Chưa soạn nội dung; mới nạp nguồn và lập kế hoạch. Không làm lời đọc và video trong đợt này.
- Việc tiếp theo: từ điển thuật ngữ, hình số nguyên dùng chung, `lesson.json`, kiểm tự động, review.

## Nguồn (sách bài tập, `sources/math/tap-hop-cac-so-nguyen/`, không commit)
- Đề: tr.47–49 in (PDF 48–50), tệp `sbt-p47.png`, `sbt-p48.png`, `sbt-p49.png`. Bài 14 bắt đầu ở tr.50.
- Lời giải: tr.111 in (PDF 112), tệp `sbt-p111.png`, mục "Bài 13" (3.1, 3.2, 3.3, 3.5, 3.6, 3.7; bài 3.4 là hình vẽ nên sách không in đáp án).
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 47-49 (rồi 111-111) --subject math --series kntt --slug tap-hop-cac-so-nguyen --book sbt --offset 1`.
- Chương III "Số nguyên"; bài in là "Bài 13. Tập hợp các số nguyên" (`number: 13`, `order: 13`, `chapter` `{ numeral: "III", name: "Số nguyên" }`). Bài đầu chương nên `order` 13 nằm sau `on-tap-chuong-2` (order 12.5).
- Nội dung nguồn: kiến thức cần nhớ 1 đến 7 (số nguyên dương và âm, tập hợp ℤ, trục số, điểm biểu diễn, so sánh, ≤ và ≥); ví dụ 1 (đổi nhiệt độ −10 °C và độ sâu −318 m sang lời, và ngược lại), ví dụ 2 (so sánh 0 và −100, 1 và −19, −387 và −378); bài 3.1 đến 3.7.

## Kế hoạch cấu trúc (10 phần, mỗi phần một ý, có hình)
1. `nhiet-do` Nhiệt độ dưới 0 (nhiệt kế; đọc "âm ba độ").
2. `so-am-doi-song` Số âm trong đời sống (tầng hầm, dưới mực nước biển, nợ tiền, ngày trước hôm nay; bài 3.1, 3.2, ví dụ 1).
3. `duong-am-khong` Số nguyên dương, số nguyên âm và số 0 (kiến thức cần nhớ 1).
4. `tap-hop-z` Tập hợp ℤ (kiến thức cần nhớ 2).
5. `truc-so` Trục số và điểm biểu diễn (kiến thức cần nhớ 3, 4; bài 3.3, 3.4, 3.5).
6. `doc-diem` Đọc và đặt điểm trên trục số (bài 3.3, 3.4).
7. `so-doi` Hai số đối nhau (mở rộng theo yêu cầu chủ dự án, xem Giả định).
8. `so-sanh-truc` So sánh bằng trục số, ≤ và ≥ (kiến thức cần nhớ 5, 7).
9. `am-duong-khong` Số âm, 0 và số dương (kiến thức cần nhớ 6, ví dụ 2a, 2b).
10. `hai-so-am` So sánh hai số âm và sắp xếp (kiến thức cần nhớ 6, ví dụ 2c, bài 3.6, 3.7).

## Giả định (chủ dự án đang ngủ, không hỏi được)
- Số đối: chủ dự án yêu cầu dạy "số đối" trong bài này, dù sách bài tập đặt định nghĩa ở Bài 14 (lời giải 3.9). Phần `so-doi` dựa trên kiến thức cần nhớ 4 (điểm n và điểm −n cách đều gốc O, nằm hai phía) và ghi rõ ở `sourceRef`. Không dạy phép tính với số đối, không dạy kí hiệu −(−5).
- Ô nhập số (`numeric`) của app chưa có phím dấu trừ (`src/exercises/number-pad.tsx`), nên mọi đáp án âm dùng chọn đáp án, điền từ có ngân hàng, xếp thứ tự, nối hoặc hình tương tác; `numeric` chỉ dùng cho đáp án không âm. Đây là việc của app cho các bài sau của chương (đề xuất: thêm phím "−").
- Số âm trong chữ viết bằng dấu trừ "−" (U+2212); trong công thức dùng `-`. Đọc là "âm ba", không đọc "trừ ba".
- Hồ sơ người học: chưa viết được kí hiệu tập hợp ({ }, ∈, ∉). Bài chỉ nhắc đọc ∈ và ∉; mọi câu viết kí hiệu là chọn đáp án.
- Số trong bài tự chọn, không lấy số của đề sách làm đề bài tự làm (bài 3.5 dùng 4 đơn vị thay cho 16 để vừa trục số trên màn điện thoại).
