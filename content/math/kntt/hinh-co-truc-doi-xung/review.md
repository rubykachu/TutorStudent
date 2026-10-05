# Review: Hình có trục đối xứng (`hinh-co-truc-doi-xung`)

- Bài: `content/math/kntt/hinh-co-truc-doi-xung/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: `quanh-ta`, `truc-doi-xung`, `chu-nhat-thoi`, `thang-can-binh-hanh`, `hinh-deu`, `chu-cai-chu-so`, `do-vat-bieu-tuong`, `diem-doi-xung`, `ve-them-hinh`, `gap-giay`, `bai-tap-sach-bai-tap`
- Nguồn đã đọc: `sources/math/hinh-co-truc-doi-xung/` - sbt-p80 đến sbt-p83, sbt-p118, sbt-p119 (đối chiếu đáp án 5.5, 5.9, 5.10 với bản vòng 2, đề không đổi)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): 215 / 1 / 0 trên toàn bài (trước vòng 1, tệp `.shots/review/hinh-co-truc-doi-xung/doc-hieu.md`); lượt 2 trên chữ đổi sau vòng 2: 72 / 7 / 0, tệp `doc-hieu-2.md`, 7 mục mơ hồ giao tác giả viết lại
- `lesson:walk`: 0 FAIL, 0 cảnh báo trên iPad dọc, iPad ngang, điện thoại; `visual:shot` 248/248; ảnh trong `.shots/walk/hinh-co-truc-doi-xung/`
- Kết luận: Đã ghi reviewedHash; 0 lỗi Nghiêm trọng, chờ điều phối duyệt sau lượt đọc hiểu
- Bản đã review: `9e567892a1f01e29b5eb82c45f9e976a2f7bbb4714139bb7941f008dca04e7b6` (`pnpm content:diff` so với bản này)

Cả ba lỗi Nghiêm trọng vòng 2 đã sửa đúng: mặt trống đồng thay bằng gương tròn (câu, `explain`, nhãn vùng, ảnh), hai lý do `wrong` "không phải nếp gấp/đường chéo nên không phải trục" thay bằng lý do đúng, và không còn câu nào trong bài hay `visuals.ts` nói đường chéo không phải trục mà thiếu điều kiện. Mười lăm Nên sửa vòng 2 đã xử lý (nhãn đường bỏ chữ d, trục ngang thành màn dạy, hình recap khớp câu quy tắc, lời giải 5.9a ưu tiên nối hai đầu, 5.10 có lý do bỏ 018 và 081, `l510-the-giua` hiện thẻ rời). Đã tự giải: `l510-the-giua` (H ở vị trí 2), 5.10 (10 số), `l55-dau-cong` (chữ thập cánh ngang dài: 2 trục), thumb mới (mặt nạ, ly, thông, ô, chuông, chai: một trục; chìa khóa, lá cờ, G, J, R, S: không trục); test hình 106/106 qua.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu ôn `s7-on-khong-truc` lặp đáp án của câu luyện và dùng hình của màn dạy (LL-07)

- Vị trí: `$.exercises[47]` (`ex.s7-on-khong-truc`, đáp án hình bình hành lệch, đám mây lệch); so với `$.exercises[18]` (`ex.s7-khong-co-truc`, đáp án tấm gạch hình bình hành nghiêng)
- Nguồn: —
- Vấn đề: bản sửa đổi đáp án "không trục" từ tam giác lệch sang hình bình hành, nhưng đây cũng là đáp án của câu kiểm tra cùng section (khác chiều nghiêng, cùng hình). Đám mây lệch là hình của màn dạy section 7. Bé trả lời bằng trí nhớ.
- Sửa: đáp án "không trục" của câu ôn dùng một hình chưa xuất hiện ở section (ví dụ chữ J hay hình bàn tay, hoặc tam giác lệch đã bỏ khỏi bài), giữ nhiễu lá, dấu cộng.

### 2. Câu ôn `s4-on-ghep-so-truc` nay là đúng ba hình và ba đáp án của câu luyện (LL-07, LL-20)

- Vị trí: `$.exercises[40].left` (`thumb-trapezoid`, `thumb-parallelogram`, `thumb-rectangle`) so với `$.exercises[11]` (`ex.s4-chon-hinh-co-truc`, cùng ba hình và hình thoi)
- Nguồn: tr.118 (5.2)
- Vấn đề: sửa theo góp ý vòng 2 (đổi chữ thành hình) làm câu ôn trùng hệt hình và số trục (1, 0, 2) của câu luyện cùng thẻ.
- Sửa: đổi một hình trong cột trái sang hình khác đã dạy ở section 4 hoặc 5 (hình thoi 2 trục, hình tam giác đều 3 trục), hoặc đổi số trục cần nối.

### 3. Hai câu ôn lặp hình của câu kiểm tra, câu dẫn cùng chủ đề (LL-07)

- Vị trí: `$.exercises[35]` (`ex.s1-on-cham`, nhiễu lá cờ cắm trên cột) so với `$.exercises[0]` (`ex.s1-chon-hinh-gap-doi`, nhiễu lá cờ); `$.exercises[45]` (`ex.s6-on-chu-d-truc`, chữ D nằm ngang) so với `$.exercises[61]` (`ex.l53a-chu-mot-truc`, đáp án chữ D một trục nằm ngang)
- Nguồn: tr.81 (5.3)
- Vấn đề: lá cờ là nhiễu ở hai câu của cùng thẻ `quanh-ta`; vòng 2 đã yêu cầu mỗi tầng một bộ hình riêng và nêu chính chữ D cần tránh vì câu dẫn 5.3a dùng.
- Sửa: `s1-on-cham` thay lá cờ bằng một vật khác không đối xứng (ví dụ cái kéo mở một lưỡi, chiếc giày); `s6-on-chu-d-truc` đổi sang chữ khác có một trục ngang (E, B nếu không thuộc đáp án 5.3) hoặc chữ có trục thẳng đứng chưa dùng.

### 4. Lý do `wrong` của `s3-cheo-thoi` đọc vấp (LL-25)

- Vị trí: `$.exercises[7].explain.wrong[0].text` (`ex.s3-cheo-thoi`): "Hình thoi khác hình chữ nhật dài ngắn khác nhau: cả hai đường chéo của hình thoi đều là trục."
- Nguồn: tr.80
- Vấn đề: kiến thức đúng, nhưng "khác hình chữ nhật dài ngắn khác nhau" dính hai ý, bé đọc không biết "khác" ở đâu.
- Sửa: "Với hình thoi, cả hai đường chéo đều là trục. Chỉ hình chữ nhật có hai cạnh dài ngắn khác nhau mới có đường chéo không phải trục."

## Góp ý

### 1. Nhãn đường gấp nhảy từ c sang e

- Vị trí: mọi bảng chọn đường (`LETTERS` trong `lines.ts`; `ex.s2-duong-nao-la-truc`, `ex.s2-truc-cua-cong`, `ex.s3-truc-chu-nhat`)
- Nguồn: —
- Vấn đề: bé thấy a, b, c, e và có thể hỏi đường d đâu. Chấp nhận được vì d dành cho trục.
- Sửa: tuỳ tác giả, dùng 1, 2, 3, 4 cho mọi bảng chọn đường.

### 2. Nhắc lại cho 5.6 không nói trục nằm ngang

- Vị trí: `$.sections[11].blocks[2]`; `$.sections[8].blocks[2].children[0]` (note trục ngang không đánh `rule`, recap section chỉ một câu)
- Nguồn: tr.82 (5.6c)
- Vấn đề: 5.6c cần trục ngang, chỉ có `explain` và hình gợi ý nói tới.
- Sửa: thêm vào "Nhắc lại" một câu "Trục d nằm ngang thì đếm số ô theo cột."

### 3. "Biển báo" và "biển cấm" cho cùng một hình

- Vị trí: `$.sections[6].blocks[0]` ("Biển báo"), visual `do-vat-quy-tac` ("Biển cấm: 2 trục")
- Nguồn: —
- Vấn đề: một khái niệm hai tên.
- Sửa: gọi "Biển cấm" ở cả hai chỗ.
