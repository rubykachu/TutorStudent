# Review: Ước chung. Ước chung lớn nhất (`uoc-chung-uoc-chung-lon-nhat`)

- Bài: `content/math/kntt/uoc-chung-uoc-chung-lon-nhat/lesson.json`
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`), section: `nhac-thua-so` (kèm `uclnn-phan-tich`, `uclnn-ba-so`, và `phan-so-toi-gian`, `rut-gon-phan-so` vì đổi màu phân số tối giản)
- Nguồn đã đọc: `sources/math/uoc-chung-uoc-chung-lon-nhat/` - sbt-p38 (đã đối chiếu ở vòng 3, phần đổi chỉ là căn chữ theo Bài 10); chữ chuẩn lấy từ `content/math/kntt/so-nguyen-to/lesson.json`
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường), 0 cảnh báo
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/uoc-chung-uoc-chung-lon-nhat/`; đã xem sheet điện thoại của section 5, 6, 7, 12, 13
- Kết luận: Không còn lỗi Nghiêm trọng (0 Nghiêm trọng, 0 Nên sửa, 2 Góp ý); đã ghi "Bản đã review" bằng `--mark`, chưa `--approve`
- Bản đã review: `06f609621fbeb63494f46f7922eabb2d3987f1efafefbee1284b7bcd8203615f` (`pnpm content:diff` so với bản này)

Đã soát: 2 khái niệm đổi (Hợp số pink, Phân số tối giản blue; "Thừa số nguyên tố" đã retired, không còn `conceptId` nào trỏ tới), section `nhac-thua-so` (4 khối, recap), card `nhac-thua-so`, `uclnn-phan-tich`, `uclnn-ba-so`, bài `dien-tich-thua-so-nguyen-to`, `xep-chia-dan-45`.

- Câu định nghĩa số nguyên tố, hợp số, quy tắc sơ đồ cột, quy tắc phân tích, quy tắc luỹ thừa khớp từng chữ với Bài 10; recap section và recap card trùng nhau và khớp note quy tắc; `dien-tich-thua-so-nguyen-to` chỉ có đáp án "tích" (nhiễu "tổng", "thương" sai).
- Màu: số nguyên tố và các thừa số nguyên tố sky ở `sn-vi-du`, `chia-dan-*`, `bang-*`; hợp số pink; số mũ violet; phân số tối giản blue (`tg-5-7`, `tg-tom-tat`, sheet section 12, 13 không lẫn pink). Chỉ còn blue ở `sticker.tsx` (trang trí, không mang nghĩa khái niệm).
- Không còn "chia dần" hay "thừa số nguyên tố" như tên khái niệm trong `lesson.json`; `xep-chia-dan-45` đã gọi "sơ đồ cột".

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. Hình sơ đồ cột có số mũ violet nhưng chú thích chỉ có "Số chia: số nguyên tố"

- Vị trí: `src/visuals/math/uoc-chung-uoc-chung-lon-nhat/ladder.tsx` (`Legend`), dùng ở `chia-dan-36-xong` và `chia-dan-12`
- Nguồn: —
- Vấn đề: dòng "= 2² · 3²" tô số mũ violet mà chú thích không có "Số mũ". Bài 10 (`column.tsx`) cũng vậy, nên đang khớp Bài 10; chỉ ghi để cân nhắc sửa chung hai bài.
- Sửa: thêm `{ color: "violet", name: "Số mũ" }` vào chú thích khi `resultLines` có dòng luỹ thừa.

### 2. Section `nhac-thua-so`: câu sơ đồ cột không đánh `rule` và không có trong recap

- Vị trí: `$.sections[nhac-thua-so].blocks[1].children[0]`
- Nguồn: tr.38
- Vấn đề: ở Bài 10 câu này là quy tắc có recap riêng; ở đây section là bản nhắc ngắn, recap chỉ nhắc quy tắc phân tích và luỹ thừa (hình recap vẫn vẽ sơ đồ cột). Không sai, trẻ vẫn thấy cách làm ở hình.
- Sửa: tuỳ tác giả, thêm một câu về sơ đồ cột vào recap hoặc giữ nguyên.
