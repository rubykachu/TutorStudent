# Bài Luỹ thừa với số mũ tự nhiên — việc còn lại

Bài đã `published` (xem `content/math/kntt/luy-thua/review.md`). Mọi câu bài học nằm trong `lesson.json` (`note` trong các `group` của màn quy tắc, `caption` của visual recap), nên sửa câu nào cũng đổi `reviewedHash` và phải review lại. Visual của màn quy tắc và recap (`src/visuals/math/luy-thua/rule-examples.tsx`) chỉ vẽ ví dụ và nhãn ngắn.

- `chon-phep-dung` (Nên sửa, phần còn lại): câu đã gắn thêm card `nhan-so-mu-1`, nhưng hình gợi ý `nhan-hai-luy-thua` (3² · 3⁴) không chạm lựa chọn 5 · 5² = 5³. Sửa: hình gợi ý chạm chỗ số không ghi số mũ, hoặc đổi lựa chọn để câu chỉ kiểm một quy tắc.
- `xep-gia-tri` (Nên sửa): tính 2⁴ cần 3 phép nhân, quá ngưỡng 2 phép cho người học chậm. Sửa: thay 2⁴ bằng 4² (vẫn bằng 16), giữ cặp 2³ và 3²; cập nhật hình gợi ý `phan-tich` theo.
- `ghep-thuong` (Nên sửa, phần còn lại): câu đã gắn thêm card `so-mu-0` và `nhan-so-mu-1`, nhưng hình gợi ý `chia-hai-luy-thua` (2⁵ : 2³) vẫn không chạm hai cặp 2⁶ : 2⁶ và 2⁶ : 2. Sửa: hình gợi ý riêng cho hai cặp đó, hoặc đổi hai cặp thành phép chia thường.
- `chia-luy-thua-10` (Nên sửa): trẻ phải tính nhẩm 3 phép (8 − 5, rồi 10 · 10, rồi 100 · 10), quá ngưỡng 2 phép; quy tắc đếm chữ số 0 dạy ở phần sau. Sửa: đổi đề thành "Viết kết quả dưới dạng luỹ thừa của 10." (đáp án 10³), hoặc chuyển câu sang phần luỹ thừa của 10.
- Góp ý chưa sửa: câu "Số không ghi số mũ thì có số mũ là 1" (phần nhân, recap, card `nhan-so-mu-1`) nên nối với quy tắc a¹ = a đã học, như "…viết được thành luỹ thừa có số mũ 1, như 5 = 5¹"; câu viết số thành tổng chưa nói chữ số hàng đơn vị giữ nguyên; câu điền của `dien-quy-tac` đảo trật tự so với câu quy tắc; trong hình chia và hình số mũ 0, số trong các hạt bị gạch khó đọc.
- Nấc 1 của `lap-phuong-4`, `chon-10-lap-phuong`, `binh-phuong-8`, `tim-o-16-hat`, `chon-6-lap-phuong` tô cả câu đề (đề chỉ có một câu chữ, không có phần `\htmlId` để trỏ vào).
- Khung `fillBlank` trên phone ngắt dòng giữa thừa số và ô trống (`tach-5-247`: "2 ·" rồi ô trống ở dòng sau). Việc của app.
- Số mũ viết bằng ký tự mũ Unicode (aⁿ, 2⁵) trong `note`/`caption` hiện nhỏ so với chữ thân bài. Việc của app (cỡ chữ mũ trong văn bản), không riêng bài này.
- `pnpm lesson:walk` tự mở server ở cổng thử (3100) bằng `next dev`; khi đã có `next dev` khác chạy từ cùng thư mục, Next từ chối server thứ hai. Khi đó chạy walk với `WALK_BASE_URL=http://localhost:<cổng server đang chạy>` sau `CONTENT_INCLUDE_FIXTURE=1 pnpm content:emit` (server đó chỉ phục vụ bài `published`).
