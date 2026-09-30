# Review: Phép nhân và phép chia số tự nhiên (`phep-nhan-phep-chia`)

- Bài: `content/math/kntt/phep-nhan-phep-chia/lesson.json`
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`), section: nhan-hai-chu-so, chia-het, chia-co-du
- Nguồn đã đọc: `sources/math/phep-nhan-phep-chia/` - không thêm kiến thức mới ở vòng này; ba mục đổi chỉ thay số hay nhiễu trong phạm vi đã khớp nguồn ở vòng 2 (sbt-p17, sbt-p18)
- `content:check`: 0 lỗi, 0 cảnh báo của bài
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-nhan-phep-chia/` (đã xem `ipad/104-s9-04-exercise-chon-tich-rieng-2.png`)
- Kết luận: Đã xuất bản
- Bản đã review: `d570c3a630fc17ed93ec56d1685cbbde97d80930f2dea8a59f8135fc84de192d` (`pnpm content:diff` so với bản này)

Đã tự giải ba mục đổi. `chon-tich-rieng-2`: 64 · 3 = 192, tích riêng thứ hai lùi sang trái một cột (khớp note và recap của card `nhan-hai-chu-so`); chỉ đáp án a đúng, b và c sai vị trí cột, d sai cách viết. `tim-so-chia-30-5`: 30 : 5 = 6, khớp `answer` và `check`; số 30 : 5 không trùng ví dụ card, recap hay bài khác trong section, số chia 6 không trùng `tim-so-bi-chia` (42). Bỏ `tim-so-chia-36-4` đã tránh trùng "36 : 4 = 9" ở `chon-nhieu-chia-dung`. `chon-nhieu-du-2`: 32 : 5 dư 2 và 22 : 4 dư 2 đúng, 19 : 6 dư 1 và 25 : 7 dư 4 sai; đúng hai đáp án, khớp `multiple: true`, không còn 27 : 5 (dư 2) lẫn trong nhiễu. Không còn tham chiếu tới id `tim-so-chia-36-4` ở `content/`, `src/`.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Nhiễu d của `chon-tich-rieng-2` vô lý, loại được bằng mẹo

- Vị trí: `$.exercises[36].options[3]` (`phep-nhan-phep-chia.ex.chon-tich-rieng-2`)
- Nguồn: —
- Vấn đề: "Viết 19, nhớ 2 sang cột bên trái" mâu thuẫn với đề (đề đã cho 64 · 3 = 192) và là đáp án duy nhất không bắt đầu bằng "Viết 192", nên trẻ loại được không cần hiểu cột (LL-14). Không gây đáp án đúng thứ hai.
- Sửa: thay bằng lỗi có thật về vị trí cột, vd "Viết 192, lùi sang trái hai cột", hoặc lỗi về cách viết vẫn giữ "Viết 192".

## Góp ý

Không có.
