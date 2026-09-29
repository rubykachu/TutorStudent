# Bài Luỹ thừa với số mũ tự nhiên — việc còn lại

Bài đã `published` (xem `content/math/kntt/luy-thua/review.md`). Mọi câu bài học nằm trong `lesson.json` (`note` trong các `group` của màn quy tắc, `caption` của visual recap), nên sửa câu nào cũng đổi `reviewedHash` và phải review lại. Visual của màn quy tắc và recap (`src/visuals/math/luy-thua/rule-examples.tsx`) chỉ vẽ ví dụ và nhãn ngắn.

- Các mục Nên sửa và Góp ý của review cuối (`content/math/kntt/luy-thua/review.md`) chưa sửa, vì sửa câu là phải review lại: phần "Luỹ thừa là gì?" chưa có câu nói cơ số, số mũ là gì (chỉ có nhãn trong hình); câu cách tính giá trị luỹ thừa ở màn quy tắc và thẻ `tinh-gia-tri` chưa dùng chung một câu; recap phần bình phương, lập phương chưa nhắc cách tính giá trị.
- Nấc 1 của `lap-phuong-4`, `chon-10-lap-phuong`, `binh-phuong-8`, `tim-o-16-hat`, `chon-6-lap-phuong` tô cả câu đề (đề chỉ có một câu chữ, không có phần `\htmlId` để trỏ vào).
- Số mũ viết bằng ký tự mũ Unicode (aⁿ, 2⁵) trong `note`/`caption` hiện nhỏ so với chữ thân bài. Việc của app (cỡ chữ mũ trong văn bản), không riêng bài này.
- `pnpm lesson:walk` tự mở server ở cổng thử (3100) bằng `next dev`; khi đã có `next dev` khác chạy từ cùng thư mục, Next từ chối server thứ hai. Khi đó chạy walk với `WALK_BASE_URL=http://localhost:<cổng server đang chạy>` sau `CONTENT_INCLUDE_FIXTURE=1 pnpm content:emit` (server đó chỉ phục vụ bài `published`).
