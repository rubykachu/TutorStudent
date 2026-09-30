# Review: Phép cộng và phép trừ số tự nhiên (`phep-cong-phep-tru`)

- Bài: `content/math/kntt/phep-cong-phep-tru/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/phep-cong-phep-tru/` - sbt-p14, sbt-p15, sbt-p16, sbt-p96, sbt-p97, sbt-p98
- `content:check`: 0 lỗi, 0 cảnh báo của bài (138 id chưa khoá)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-cong-phep-tru/`
- Kết luận: Chưa đạt: còn 3 lỗi Nghiêm trọng
- Bản đã review: `37dccaf4536e81f8e26d72ba8b0190b3600632005c641792dad910cd1aacf2b5` (`pnpm content:diff` so với bản này)
- Bản đã review: (ghi bởi `pnpm content:hash --mark`)

## Nghiêm trọng

### 1. `chon-uoc-luong-kt` có hai đáp án đúng: 399 cũng chắc chắn sai (LL-01)

- Vị trí: `$.exercises[84].options[3]` (`ex.chon-uoc-luong-kt`)
- Nguồn: tr.16 bài 1.35b, tr.97 (`sbt-p16.png`, `sbt-p97.png`)
- Vấn đề: Bốn số tự nhiên nhỏ hơn 100 có tổng lớn nhất là 396, nên 399 cũng không thể là tổng, giống 450. Đề cho chọn một.
- Sửa: Thay 399 bằng số nhỏ hơn 396 (360) và thêm `check.relation: "max"` để lint chứng minh chỉ 450 là đáp án.

### 2. `chon-tong-sai`: 120 cũng chắc chắn sai nếu trẻ tính ra tổng (LL-01)

- Vị trí: `$.exercises[81].options[1]`, `answer` (`ex.chon-tong-sai`)
- Nguồn: tr.16 bài 1.35a, tr.97
- Vấn đề: 25 + 38 + 47 = 110 nên 120 sai thật, nhưng không nằm trong đáp án. Trẻ tính ra 110 rồi chọn cả 120 bị chấm sai: đáp án phụ thuộc cách làm.
- Sửa: Nhiễu đều có chữ số cuối khác 0 (124, 115, 118), `check` `notEqual` 110.

### 3. `chon-cap-day-so-2`: một đáp án đúng chính là biểu thức in trong đề (LL-01, LL-10)

- Vị trí: `$.exercises[77].prompt[0].text`, `options[0]` (`ex.chon-cap-day-so-2`)
- Nguồn: tr.16 bài 1.34a, tr.97
- Vấn đề: Đề hỏi "cặp có tổng bằng 30 + 38" mà đáp án a là "30 + 38"; trẻ hiểu là tìm cặp khác và bỏ a.
- Sửa: Đề "… có tổng bằng 68", `check.expr` 68.

## Nên sửa

### 1. Quy tắc mượn không nói so chữ số trên sau khi đã bớt 1; hàng chỉ cho mượn không có chip "−1"; dòng "3 − 1 − 7" khó hiểu

- Vị trí: `$.sections[9].blocks[1].children[0].text`, recap section và card; `ex.cot-tru-hang-chuc`; `borrowChip`, `workingSum` trong `column.tsx`
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Mọi ví dụ có chữ số gốc đã nhỏ hơn nên trẻ không thử gặp 541 − 246 (4 − 1 = 3 nhỏ hơn 4 nên vẫn mượn). Nửa "bớt đi 1" không có chip trên hình. Dòng "3 − 1 − 7" không tính được trong số tự nhiên.
- Sửa: Câu quy tắc nói rõ "sau khi đã bớt 1 nếu hàng đó cho mượn"; đổi câu sang 541 − 246; chip "−1"; dòng làm việc "4 − 1 = 3".

### 2. `them-bot-cong` chỉ luyện một chiều chuyển số, câu ôn lặp số của màn mẫu

- Vị trí: `ex.tinh-them-bot-2`, `ex.dien-them-bot`, `ex.chuyen-so-cham`, recap `them-bot-tom-tat` (LL-07)
- Nguồn: tr.16 câu 1.31
- Vấn đề: Sách lấy từ số hạng thứ hai cho số hạng thứ nhất; bài chỉ luyện chiều ngược lại. Hai câu ôn trùng số màn tự làm và ví dụ mẫu.
- Sửa: `tinh-them-bot-2` lấy 1 của số hạng thứ hai; recap đi chiều ngược; quy tắc thêm "số hạng nào gần tròn chục hơn thì làm tròn số đó"; đổi số hai câu ôn.

### 3. `chon-tim-x` có hai nhiễu bằng nhau (LL-14)

- Vị trí: `$.exercises[59].options` (`ex.chon-tim-x`)
- Vấn đề: 61 + 28 và 28 + 61 cùng giá trị, loại được mà không cần hiểu.
- Sửa: Ba lựa chọn khác giá trị.

### 4. "Cùng bớt" chưa có ví dụ mẫu mà kho ôn đã hỏi (LL-16)

- Vị trí: `sections[7].blocks[1]` (`tru-them-tron`)
- Sửa: Màn 2 là ví dụ cùng bớt (67 − 24 thành 63 − 20); section có cả hai chiều.

### 5. Hình "bốn phép tính" tô một số bằng hai màu (LL-15, LL-05)

- Vị trí: `FactFamily` (`names: "difference"`), `quan-he-ba-so`, `quan-he-tom-tat`
- Sửa: Với tên hiệu, chỉ vẽ "52 − 17 = 35" và "35 + 17 = 52".

### 6. Thao tác nối, thao tác (manipulate), xếp thứ tự dùng trước khi được dạy (LL-04)

- Vị trí: `ex.noi-ten-tru`, `ex.chon-cap-cham` và sáu câu thao tác khác, `ex.sap-buoc-tim-x`
- Sửa: Ba màn hướng dẫn (`guide`) ở section đầu tiên dùng mỗi thao tác (`y-nghia-tru`, `ghep-tron`, `tim-so-hang`).

### 7. Recap `ket-hop`, `uoc-luong`, `toan-thoi-gian`, `tim-so-tru` lệch caption hoặc trùng số (LL-06, LL-07, LL-15)

- Vị trí: recap section và card; `ex.dien-ten-tong` (cùng tổng 42 với recap `cong-ten-tom-tat`); `ex.chon-x-bang-25` (60 − x = 35 trùng recap)
- Sửa: Recap `ket-hop` vẽ cả hai cách nhóm; `uoc-luong` dùng câu của quy tắc và ví dụ mẫu có kết quả bị loại (323); `toan-thoi-gian` vẽ bước cộng, đổi giờ, trừ; `tim-so-tru` đổi sang 80 − x = 35; `dien-ten-tong` đổi sang 26 + 13 = 39. Hình gợi ý và lời giải của `tim-gio-xuat-phat` thêm bước đổi giờ.

### 8. Quy tắc và recap chữ số cuối không nói so với cái gì (LL-05)

- Vị trí: `sections[15]` note, recap section và card
- Sửa: Một câu: so với chữ số cuối của kết quả đã tính, khác nhau thì kết quả sai; hình recap thêm dòng "Kết quả 86: cuối 6 ≠ 7".

### 9. Quy tắc nhiều section chưa đánh dấu `rule: true`, recap chưa lặp nguyên văn (LL-05)

- Vị trí: mọi section
- Sửa: Đánh dấu note quy tắc, recap lặp nguyên văn.

## Góp ý

### 1. Đã sửa cùng đợt

- Câu tự làm đặt tính cộng có thêm cột trống bên trái khi không có số nhớ ra; "chữ số hàng đơn vị" dễ lẫn với cột đơn vị; "làm tròn số trừ" là tên khái niệm khác; câu tìm x không có câu kết bằng lời; `tim-gio-hai-buoc` trùng đáp án với ví dụ mẫu; note quy tắc thời gian lẫn dữ kiện; `tinh-nhom-1`, `tinh-tien-nhom` lặp cặp số của ví dụ.

### 2. Chưa sửa

- Dấu "?" trong công thức dính sát dấu cộng; dấu khái niệm "Giao hoán" là chữ thập; section cộng với 0 chưa có term `trừ đi 0` trong glossary; hình gợi ý nấc 2 của `dien-quan-he` để "?" ở phép trừ; `sourceRef` thời gian chưa ghi kiến thức nền (glossary cần term có `prerequisite`).
