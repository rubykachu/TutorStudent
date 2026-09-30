# Bàn giao: Bài 5 `phep-nhan-phep-chia` (Phép nhân và phép chia số tự nhiên)

## Trạng thái
- Nội dung đã xuất bản (`status: published`) sau 4 vòng review, `content:lock` xong, id đã khoá. Lời đọc giới thiệu (45,8 s) và 3 video đã dựng, đang chờ reviewer mới duyệt vòng chỉ phần đổi (diff chỉ có `overview.narration`, `videos[]` và 3 khối video).
- Nguồn: sách bài tập tr.17–20 (PDF 18–21), lời giải tr.98–100 (PDF 99–101), trong `sources/math/phep-nhan-phep-chia/`.
- Quy ước viết phép nhân của cả bài: a · b là "a được lấy b lần" (số được cộng viết trước, số lần lấy viết sau), dạy một lần ở section `nhan-cong-lap`.

## Lời đọc và video (giọng Hải Đăng)
- Giọng `hai-dang` khai trong `video/projects/phep-nhan-phep-chia/media.json`. Lý do: bài trước (Bài 4) là Mỹ Duyên nên đổi giọng cho bé đỡ nhàm; bài nhiều bước thủ tục (đặt tính, tính chất) nên hai giọng đều hợp. Bài 6 và 7 cũng Hải Đăng, nên nếu sau này muốn xen kẽ hơn thì đổi cả lời đọc lẫn video của bài này (đọc lại toàn bộ).
- Video (đặt ở đầu phần, `pnpm video:check` đạt): `nhan-cong-lap` 52,2 s (phần `nhan-cong-lap`, 4 hộp bánh đến 6 · 4); `chia-co-du` 58,9 s (phần `chia-co-du`, 23 kẹo cho 4 bạn, 23 = 4 · 5 + 3, số dư nhỏ hơn số chia); `nhom-thua-so` 54,2 s (phần `ket-hop`, 36 · 25 = 9 · 4 · 25). Chọn vì đây là ba ý bé dễ hụt nhất: nghĩa phép nhân, phép chia có dư và kiểm tra, nhân nhẩm bằng số tròn.
- Còn lại: reviewer mới duyệt (vòng chỉ phần đổi, `model: sonnet`), rồi `pnpm content:hash --approve`, `pnpm content:lock` (khoá 3 id video mới; hiện `content:lock` dừng vì `[review-hash]`), `pnpm lesson:walk phep-nhan-phep-chia`, rồi lưu trữ thư mục này.

## Việc tiếp theo
1. Review lời đọc và video như trên.
2. Còn một ý Nên sửa nhỏ chưa làm (sửa sẽ đổi hash, cần review diff): nhiễu d của `chon-tich-rieng-2` ("Viết 19, nhớ 2 sang cột bên trái") là lựa chọn duy nhất không mở đầu bằng "Viết 192", đề xuất "Viết 192, lùi sang trái hai cột".

## Lịch sử sửa
## Sau review vòng 1
- Quy ước viết phép nhân của cả bài: a · b là "a được lấy b lần" (số được cộng viết trước, số lần lấy viết sau), dạy một lần ở section `nhan-cong-lap`. Mọi đề, hình, đáp án theo quy ước này; giao hoán (section `giao-hoan`) dạy rằng đổi chỗ thì tích không đổi. Đã sửa 4 Nghiêm trọng và các mục Nên sửa, Góp ý còn lại ngoài danh sách dưới. Id đề có số đã đổi theo số mới (vd `chon-du-26-4`, `loi-nhan-38-7`); chưa khoá id nên không cần `retired`.

## Sau review vòng 2
- Đã sửa 3 Nghiêm trọng (đáp án `dien-7-9`, thuật ngữ "số tròn chục liền trước/liền sau" thay "làm tròn", nhãn fact-family không gãy ở iPad dọc) và các Nên sửa 1-12 trừ mục ghi ở "Chưa sửa vòng 2" dưới đây; Góp ý 3-9 đã sửa. Id đổi (chưa khoá): `mua-vo-100-15` thành `mua-so-90-13`, `du-163-15` thành `du-185-15`, `chia-cot-268-12-xong` thành `chia-cot-268-12`. Thêm câu `tim-so-chia-30-5`. Hình diện tích xoay: cạnh ngang là thừa số thứ nhất, số hàng là tổng hay hiệu được tách.

## Chưa sửa vòng 2
- Nên sửa 5 (phần `hintVisualId` cho `so-sanh-38-50`): hình từng bước có sẵn (`CalcSteps`) chỉ vẽ chuỗi nối bằng dấu "=", không vẽ được chuỗi bất đẳng thức; làm hình so sánh mới là việc riêng. Phần note đã viết đủ bước giữa và kết luận.
- Góp ý 1 ("thừa số", "tích" trước section 3): câu ở section 3 là câu quy tắc, recap lặp nguyên văn; đổi sang "Nhắc lại" kéo theo `[rule-sentence]` và lời đọc. Hai thuật ngữ đã có nhãn chú giải từ section 1.
- Góp ý 2 ("1 000" và "1000" trong hình): `formatInteger` là hàm dùng chung cả app; báo người làm app.
- Góp ý 10 (`chon-nhieu-them-1` bốn lựa chọn dài): luật "Chọn nhiều" của skill đòi 2-3 đáp án đúng trong 4 lựa chọn; rút còn ba làm mất luật đó.
- Góp ý 11 đã sửa bằng ba hình dùng chung một ô lưới (khối giữ chiều cao lớn nhất).

## Chưa sửa
- Góp ý 12: số nhớ xếp chồng hai tầng ở hình đặt tính nhân hai chữ số và cỡ chữ hình cùng làm trên iPad ngang. Đổi bố cục `col-mul-figure.tsx` tốn nhiều công, đã có dòng ghi chú "0 mờ chỉ giữ chỗ"; để vòng sau nếu reviewer còn thấy khó đọc.
- Góp ý 2 (phím "mũ" của bàn phím số hiện trước bài Luỹ thừa): thuộc bố cục chung của app, không thuộc nội dung bài; báo người làm app.
- Góp ý 18 (`h-visual-frame` ở trang dev visual làm `visual:shot` báo tràn khung): đổi sang `min-h` sẽ làm mất phép kiểm tràn của `visual:shot`; báo người làm app.
- Góp ý 19 (`mua-vo-100-12`, `xep-xe-50-12` đặt sẵn đủ ô): thêm ô từng bước là viết lại `pack.tsx`, giá trị sư phạm thấp vì đề đã có câu hỏi riêng.
- Góp ý 20 (xanh cho cả thừa số và số bị chia, hổ phách cho cả tích và thương): màu do glossary chung của môn quy định, đổi sẽ kéo theo mọi bài Toán; dòng `24 = 6 · 4` giữ màu vì nó chỉ vai số bị chia, số chia, thương.
