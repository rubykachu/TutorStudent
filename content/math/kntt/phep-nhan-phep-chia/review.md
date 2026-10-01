# Review: Phép nhân và phép chia số tự nhiên (`phep-nhan-phep-chia`)

- Bài: `content/math/kntt/phep-nhan-phep-chia/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff`): `options[3]` của `chon-tich-rieng-2`, section: nhan-hai-chu-so
- Nguồn đã đọc: `sources/` không có trên máy nên không đối chiếu ảnh; kiến thức là phép nhân đặt tính tiểu học (sourceRef "Kiến thức nền", SBT tr.18), tự giải lại bằng tay
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường vì bài đổi sau lần review trước), 0 cảnh báo của bài
- `lesson:walk`: không chạy (điều phối không chạy trong vòng này); đổi chỉ là một dòng chữ lựa chọn
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 0 Góp ý
- Bản đã review: `b0a5a7e6a429df17e8cc1359d35ecc448af85b081baa219dd0ac106a2bcbc6ed` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

Không có.

## Đã soát

Phần đổi: nhiễu d của `phep-nhan-phep-chia.ex.chon-tich-rieng-2` (`$.exercises[?].options[3]`) từ "Viết 19, nhớ 2 sang cột bên trái" thành "Viết 192, lùi sang trái hai cột".

- Tự giải: 64 · 32, chữ số 3 là 3 chục nên tích riêng thứ hai 64 · 3 = 192 viết lùi sang trái một cột. Đáp án `a` đúng và `answer: ["a"]` còn khớp.
- `b` (thẳng cột, quên lùi), `c` (lùi sai chiều sang phải), `d` (lùi quá, hai cột như thể 3 là hàng trăm): đều sai, đều là lỗi đặt cột thật của trẻ; không có hai đáp án đúng.
- Cả bốn lựa chọn cùng mở "Viết 192, ...", cùng độ dài và cùng hình thức, chỉ khác ở vị trí cột, nên không đoán được bằng mẹo hình thức (LL-14 đã được xử lý). `d` khác `a` ở một chữ "hai" nhưng là khác biệt về kiến thức (lùi một cột hay hai cột), không phải bẫy chữ.
- Đề đủ dữ kiện (64 · 32, tích riêng thứ hai là 64 · 3 = 192) và nói rõ việc phải làm.
- Cùng section: note quy tắc ("tích riêng thứ hai viết lùi sang trái một cột"), recap (lùi một cột), `visualId` `col-mul-digits` ("Hàng chục, lùi một cột") đều nhất quán, không mâu thuẫn với nhiễu mới. Câu luyện `tinh-35-26` là câu số có lời văn, không trùng hình với câu kiểm tra.
