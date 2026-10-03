# LL-15 — Hình gợi ý, lời giải hay recap lệch chữ

## Triệu chứng

Hình vẽ số khác đề, thiếu phần caption nhắc tới, hay dạy khác quy tắc chữ.

## Ví dụ thật

- `thu-tu-thuc-hien-phep-tinh` vòng 1, `ex.nhan-7-8`: hình lời giải 7 · 8 lại vẽ 14 · 6 = 84.
- `tap-hop` vòng 2: `the-doi-cach` thiếu vạch đứng mà caption nhắc.
- `dau-hieu-chia-het` vòng 2, section `diem-thi`: hình quy tắc `diem-chia-het-3` và recap `tom-tat-diem` đặt hàng `31 ⋮̸ 3` ("Chắc chắn tính sai") ngay dưới hàng `(12 · 2 − 3 · 5) ⋮ 3` ("Điểm cả bài"), không nói 31 là số ai đó báo; trẻ đọc thành điểm cả bài là 31 (thật ra 9). Hình hàng `rows` ghép hai ý (điểm thật, điểm báo sai) phải ghi kết quả của phép tính và nói rõ số nào là số được báo, nhất là ở recap được xem một mình.
- `uoc-chung-uoc-chung-lon-nhat` vòng 1, hình `ds-lon-12-18` (màn đầu khái niệm ƯCLN) và lời giải `ds-lon-10-25`: ở bước cuối, mọi ước chung trong hàng Ư(12), Ư(18) đổi sang màu cam và dấu của "Ước chung lớn nhất" (code `uc-lists.tsx` dùng một `pickedTone` cho cả tập `common`), nên hình nói 1, 2, 3 cũng là ƯCLN. Màu "lớn nhất" chỉ được gắn cho đúng một giá trị; soát bước cuối của hình `steps`, không chỉ bước đầu.
- `so-nguyen-to` vòng 1, hình `bang-100` (màn quy tắc, recap section và card): bảng tĩnh in "Số không bị gạch là số nguyên tố", chú giải "Hợp số (bị gạch)", mà số 1 không bị gạch, không được tô; đọc theo nhãn thì 1 là số nguyên tố, trái note số 1 của section trước. Hình dùng lại nhãn của hình từng bước (`sieve` mode `steps`) cho bản tĩnh; nhãn bản tĩnh phải đọc đúng khi đứng một mình và nói rõ phần tử đặc biệt (số 1).
- `tap-hop-cac-so-nguyen` vòng 2, hình gợi ý `nhiet-ke-goi-y` (`ex.doc-nhiet-ke`): chế độ `hint` của `scale.tsx` ẩn mọi thứ thuộc bước cuối (bước kết quả), mà dấu "?" ở đỉnh cột lại đặt ở bước cuối, nên "?" không bao giờ hiện; con số duy nhất bé thấy là "2 °C" ở đầu ống, trong khi câu có nhiễu cho đúng lỗi đọc thiếu dấu −. Hình chế độ `hint` phải có một bước cuối chứa đúng kết quả (để bị ẩn), còn "?" đặt ở bước trước đó; xem ảnh `visual:shot` của bước cuối có hiện "?". Đếm ở LL-12 (cùng mục review với chữ chồng).
- `chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc` vòng 1, hình quy tắc `m2-cm2` (1 m² = 10 000 cm²): lưới vẽ 10 × 10 = 100 ô mà không ghi cỡ ô, dòng dưới viết `100 · 100 = 10 000 cm²`, và nhãn "1 m²" bị nét lưới cắt. Bài vừa dạy diện tích là số ô vuông đơn vị phủ kín hình, nên bé đếm được 100 ô và nhớ 1 m² = 100 cm², đúng nhiễu của câu kiểm tra. Điểm mới: hình lưới minh hoạ đổi đơn vị phải ghi cỡ một ô và số đo của ô đó; số ô đếm được trên hình không được là một nhiễu của bài.

## Nguyên nhân gốc

Visual dùng lại từ câu khác hoặc sửa chữ mà không sửa hình.

## Cách phòng

- Người: `lesson-visual` chụp và tự xem ảnh; checklist trục 5.

## Trạng thái

Chỉ người soát.
