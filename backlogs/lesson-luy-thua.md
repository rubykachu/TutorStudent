# Bài Luỹ thừa với số mũ tự nhiên — việc còn lại

Bài đã `published` (review cuối không còn lỗi Nghiêm trọng, xem `content/math/kntt/luy-thua/review.md`). Còn lại, sửa thì phải review lại vì đổi `reviewedHash`:

- `luy-thua.ex.cham-so-mu` (luyện tập) dùng lại đúng hình 6⁴ của `luy-thua.ex.cham-co-so` (kiểm tra): trẻ chỉ cần chạm "số còn lại". Cho visual chạm vùng nhận số (qua `src/visuals/math/luy-thua/examples.tsx`) và dùng luỹ thừa khác, vd 3⁵.
- Công thức định nghĩa chỉ ghi `n` dưới ngoặc, chưa có chữ "thừa số": KaTeX hiển thị chữ Việt trong `\text{}` bằng font dự phòng (thiếu metric), cần cách hiển thị nhãn chữ Việt trong công thức trước.
- Nấc 1 của `lap-phuong-4`, `chon-10-lap-phuong`, `binh-phuong-8`, `tim-o-16-hat` tô cả câu đề (đề chỉ có một câu chữ, không có phần `\htmlId` để trỏ vào).

Về app (không riêng bài này):
- `choice`, cột phải `match` và ngân hàng từ `fillBlank` hiện đúng thứ tự trong JSON, chỉ `order` được xáo. Tác giả phải tự rải vị trí đáp án; nên cho app xáo ổn định theo id bài tập.
- Highlight `target: "option"` không `conceptId` trùng màu với dấu "làm sai" khung tự tô, nên ô trẻ làm đúng trông như sai. Cân nhắc cho highlight của tác giả một kiểu tô khác hẳn.
