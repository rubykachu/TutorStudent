# LL-15 — Hình gợi ý, lời giải hay recap lệch chữ

## Triệu chứng

Hình vẽ số khác đề, thiếu phần caption nhắc tới, hay dạy khác quy tắc chữ.

## Ví dụ thật

- `thu-tu-thuc-hien-phep-tinh` vòng 1, `ex.nhan-7-8`: hình lời giải 7 · 8 lại vẽ 14 · 6 = 84.
- `tap-hop` vòng 2: `the-doi-cach` thiếu vạch đứng mà caption nhắc.
- `dau-hieu-chia-het` vòng 2, section `diem-thi`: hình quy tắc `diem-chia-het-3` và recap `tom-tat-diem` đặt hàng `31 ⋮̸ 3` ("Chắc chắn tính sai") ngay dưới hàng `(12 · 2 − 3 · 5) ⋮ 3` ("Điểm cả bài"), không nói 31 là số ai đó báo; trẻ đọc thành điểm cả bài là 31 (thật ra 9). Hình hàng `rows` ghép hai ý (điểm thật, điểm báo sai) phải ghi kết quả của phép tính và nói rõ số nào là số được báo, nhất là ở recap được xem một mình.
- `uoc-chung-uoc-chung-lon-nhat` vòng 1, hình `ds-lon-12-18` (màn đầu khái niệm ƯCLN) và lời giải `ds-lon-10-25`: ở bước cuối, mọi ước chung trong hàng Ư(12), Ư(18) đổi sang màu cam và dấu của "Ước chung lớn nhất" (code `uc-lists.tsx` dùng một `pickedTone` cho cả tập `common`), nên hình nói 1, 2, 3 cũng là ƯCLN. Màu "lớn nhất" chỉ được gắn cho đúng một giá trị; soát bước cuối của hình `steps`, không chỉ bước đầu.

## Nguyên nhân gốc

Visual dùng lại từ câu khác hoặc sửa chữ mà không sửa hình.

## Cách phòng

- Người: `lesson-visual` chụp và tự xem ảnh; checklist trục 5.

## Trạng thái

Chỉ người soát.
