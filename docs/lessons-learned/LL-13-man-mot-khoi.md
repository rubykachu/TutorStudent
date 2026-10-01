# LL-13 — Màn chỉ có một khối

## Triệu chứng

Một màn chỉ có câu `note` hay chỉ có công thức, không có ví dụ có nhãn đi kèm; màn trống trải, quy tắc không gắn ví dụ.

## Ví dụ thật

- Review sản phẩm 30/09/2026: màn chỉ có một note, định nghĩa nằm ở caption xám 16px.
- `uoc-chung-uoc-chung-lon-nhat` vòng 1, section `nhac-thua-so`: màn chỉ có hình sơ đồ cột `chia-dan-12`, cách làm (chia cho số nguyên tố, chia tiếp thương, nhân lại) chỉ nằm ở caption xám, trong khi năm bài tập cần đúng thao tác này. Section "nhắc lại" kiến thức bài trước vẫn phải có note nói cách làm, dùng đúng tên và câu quy tắc của bài trước (ở đây bài `so-nguyen-to` gọi là "sơ đồ cột", bài này lại gọi "chia dần").
- `boi-chung-boi-chung-nho-nhat` vòng 1, section `quy-dong`: câu định nghĩa kiến thức nền "Quy đồng mẫu số là đưa các phân số về cùng một mẫu số" chỉ nằm ở caption xám của hình mở đầu. Thuật ngữ có `prerequisite` trong glossary được dạy lại thì câu định nghĩa vẫn phải là `note`, không phải caption.

## Nguyên nhân gốc

Viết quy tắc thành khối riêng thay vì `group` quy tắc + ví dụ.

## Cách phòng

- Máy: `content:check` luật `[screens]` (cảnh báo) và `[recap]`.
- Người: checklist mục "Quy tắc đọc được và nhớ được".

## Trạng thái

Đang áp dụng.
