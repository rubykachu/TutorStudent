# LL-05 — Một quy tắc nói nhiều cách

## Triệu chứng

Câu quy tắc trên màn, recap của section, recap của card và video dùng lời khác nhau, hoặc một khái niệm có hai tên. Trẻ học chậm nhớ lẫn các cách nói.

## Ví dụ thật

- `luy-thua` (review ở commit `efe9635`): "Tính luỹ thừa" và "Tính giá trị luỹ thừa" cho cùng một quy tắc.
- `neu-cau-muon-co-mot-nguoi-ban` vòng 6: định nghĩa từ ghép, từ láy ở recap khác note và card.
- `thu-tu-thuc-hien-phep-tinh` vòng 1: quy tắc luỹ thừa gọi số mũ là "luỹ thừa"; cộng trừ và nhân chia phủ định hai kiểu.
- `neu-cau-muon-co-mot-nguoi-ban`, card `nghia-cam-hoa`: "Cáo nói gọn: “làm cho gần gũi hơn”." thiếu "cảm hoá là" so với note (luật mới bắt được, đã sửa).
- `phep-nhan-phep-chia` vòng 1: note section 1 đặt luật "cộng 4 số 6 thì viết là 4 · 6" (số lần đứng trước, ngược quy ước tiểu học 6 × 4), trong khi `ten-goi` viết "2 gói, mỗi gói 25" thành 25 · 2 và các hình đặt tính cũng theo thứ tự ngược lại. Quy ước viết phép nhân a · b phải chốt một lần cho cả bài, kể cả caption và hình.

## Nguyên nhân gốc

Mỗi chỗ viết lại quy tắc từ trí nhớ thay vì chép câu gốc; recap rút gọn được viết tay.

## Cách phòng

- Máy: `content:check` luật `[rule-sentence]`: `note` có `"rule": true` là câu quy tắc; recap section phải lặp nguyên văn một câu của nó; câu recap (section, card) giống quá nửa số từ của câu quy tắc mà không trùng nguyên văn (hay không là một vế nguyên văn) là lỗi. Video: `pnpm video:check` so chữ quy tắc trên hình với câu của bài.
- Người: checklist mục "Một khái niệm, một từ, một màu" và "`recap` khớp card hay section".

## Trạng thái

Đang áp dụng. Recap rút gọn cũ của các bài đã xuất bản chưa đánh `rule` (xem backlog từng bài).
