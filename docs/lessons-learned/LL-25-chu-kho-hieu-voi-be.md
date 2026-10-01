# LL-25 — Chữ đúng nhưng bé lớp 6 đọc không hiểu

## Triệu chứng

Câu `explain`, `wrong`, `note`, đề bài đúng kiến thức và qua luật độ dài nhưng bé phải đọc lại hay đoán nghĩa: câu cụt thiếu từ nối, phủ định kép, từ chuyên môn chưa dạy, một câu gói nhiều ý.

## Ví dụ thật

Chưa có số liệu: mục này bắt đầu đếm từ lượt "Đọc hiểu" đầu tiên của bài mới. Cột đếm trong `index.md`: mỗi mục "Khó hiểu" của lượt 1 là một Nên sửa, mỗi mục "Hiểu mơ hồ" là một Góp ý. Ví dụ thêm vào đây theo khuôn: bài, đường dẫn mục, chữ gốc, chữ viết lại.

- `uoc-chung-uoc-chung-lon-nhat` (6 section thêm ở vòng 6, đọc hiểu 3 lượt): lượt 1 có 8 mục Hiểu mơ hồ và 0 Khó hiểu (đếm theo các dòng của tệp; dòng tổng của tệp ghi 10 là sai); cả 8 mục đều là quy tắc hay lời giải viết bằng chữ cái d, m, n (quy tắc và recap của `cap-so-tong`, `cap-so-tich`, `so-du-lon-nhat`, lời giải `tich-72-uclnn-3`, `tich-144-uclnn-6`).
  - `cap-so-tich`, quy tắc: "Nếu ƯCLN của hai số là d thì tích của hai số bằng d nhân d nhân m nhân n." (lượt 1 mơ hồ), thêm "d có mặt hai lần" (lượt 2 vẫn mơ hồ), rồi viết thành từng bước "Hai số là d nhân m và d nhân n. Nhân chúng lại, tích bằng d nhân d nhân m nhân n." (lượt 3 Hiểu rõ). Điều hiệu quả là nêu m, n là gì ngay trong câu và đi từng bước, không phải câu "nếu ... thì" gói điều kiện.
  - `cap-so-tong`, quy tắc: thêm ví dụ số "như 48 chia 6 được 8" nhưng lượt 3 vẫn mơ hồ ("m cộng n là gì"). Ví dụ số cụ thể không đủ khi chữ m, n chưa được giải thích trong cùng câu.
  - `so-du-lon-nhat`, quy tắc: "cùng số dư" bị đọc là khó, đổi thành "dư bằng nhau" thì vẫn mơ hồ, lại lệch từ đã dạy ở các màn khác. Đổi sang từ mới không thay được việc giải thích từ cũ.
  - `tich-72-uclnn-3`, lời giải: câu gói ba ý (loại cặp, chọn số lớn, tính b) bị xếp Khó hiểu ở lượt 3 dù đã viết lại hai lần; câu cùng kiểu của `tich-144-uclnn-6` viết thành các câu ngắn nối bằng "mà", "nên" thì Hiểu rõ.

## Nguyên nhân gốc

Người soạn và reviewer đã biết kiến thức nên đọc câu cụt vẫn hiểu; bé chỉ có chữ trên màn.

## Cách phòng

- Người + model rẻ: lượt "Đọc hiểu" của skill `lesson-review` (Haiku gắn nhãn, tác giả viết lại, Haiku đọc lại mục đã viết).
- Máy: `[vietnamese]`, `[length]` chỉ bắt độ dài và từ cấm, không bắt câu rối.

## Trạng thái

Đang áp dụng cho bài mới và chữ đổi từ nay.
