# Bài Luỹ thừa với số mũ tự nhiên — việc còn lại

Bài đã `published` (xem `content/math/kntt/luy-thua/review.md`). Mọi câu bài học nằm trong `lesson.json` (`note` trong các `group` của màn quy tắc, `caption` của visual recap), nên sửa câu nào cũng đổi `reviewedHash` và phải review lại. Visual của màn quy tắc và recap (`src/visuals/math/luy-thua/rule-examples.tsx`) chỉ vẽ ví dụ và nhãn ngắn.

- Recap phần 1 (`luy-thua.section.luy-thua-la-gi`) cố ý chỉ giữ một câu ("Trong aⁿ, cơ số a là thừa số…") với một ví dụ có nhãn (2⁵); quy tắc a¹ = a do màn quy tắc của phần và recap card `luy-thua.card.so-mu-1` mang. Chủ dự án muốn đưa a¹ = a trở lại recap phần thì thêm câu thứ hai "Số mũ bằng 1 thì luỹ thừa bằng chính cơ số." và một dòng 6¹ = 6 vào visual `tom-tat-dinh-nghia`.
- Góp ý chưa sửa: câu viết số thành tổng chưa nói chữ số hàng đơn vị giữ nguyên; câu điền của `dien-quy-tac` đảo trật tự so với câu quy tắc; trong hình chia và hình số mũ 0, số trong các hạt bị gạch khó đọc.
- Nấc 1 của `lap-phuong-4`, `chon-10-lap-phuong`, `binh-phuong-8`, `tim-o-16-hat`, `chon-6-lap-phuong` tô cả câu đề (đề chỉ có một câu chữ, không có phần `\htmlId` để trỏ vào).
- Khung `fillBlank` trên phone ngắt dòng giữa thừa số và ô trống (`tach-5-247`: "2 ·" rồi ô trống ở dòng sau). Việc của app.
- Số mũ viết bằng ký tự mũ Unicode (aⁿ, 2⁵) trong `note`/`caption` hiện nhỏ so với chữ thân bài. Việc của app (cỡ chữ mũ trong văn bản), không riêng bài này.
- `pnpm lesson:walk` tự mở server ở cổng thử (3100) bằng `next dev`; khi đã có `next dev` khác chạy từ cùng thư mục, Next từ chối server thứ hai. Khi đó chạy walk với `WALK_BASE_URL=http://localhost:<cổng server đang chạy>` (server đó chỉ phục vụ bài `published`).
- Sửa bài khi server của chủ dự án đang chạy từ cùng thư mục: route bài đọc thẳng `content/` nên bài có `reviewedHash` lệch biến mất ngay. Sửa và review trong bản chép (`content:check --root <bản chép>`, `content:hash luy-thua --root <bản chép> --approve`), chỉ chép `lesson.json` đã duyệt về `content/` một lần.
