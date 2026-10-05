# Review: Hình có trục đối xứng (`hinh-co-truc-doi-xung`)

- Bài: `content/math/kntt/hinh-co-truc-doi-xung/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff`), section: `truc-doi-xung`, `chu-cai-chu-so`
- Nguồn đã đọc: không mở ảnh nguồn (diff không có câu `bookPractice`; 5.3 và 5.7 chỉ đối chiếu đáp án trong `lesson.json`)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): 215 / 1 / 0 trên toàn bài (trước vòng 1, `.shots/review/hinh-co-truc-doi-xung/doc-hieu.md`); chữ đổi sau vòng 2: lượt 1 72 / 7 / 0 (`doc-hieu-2.md`), lượt 2 7 / 6 / 1 (`doc-hieu-3.md`), lượt 3 8 / 4 / 0 (`doc-hieu-4.md`, hết 3 lượt); chữ đổi sau vòng 5: 6 / 0 / 0 (`doc-hieu-5.md`)
- `lesson:walk`: 0 FAIL, 0 cảnh báo trên iPad dọc, iPad ngang, điện thoại; ảnh trong `.shots/walk/hinh-co-truc-doi-xung/`. `visual:shot` 250/250: đã mở `chu-t` (chữ T căn giữa, không cắt)
- Kết luận: Đã xuất bản (0 Nghiêm trọng; 5 Nên sửa còn lại không chặn: chữ T lặp ví dụ màn dạy vì mọi chữ một trục khác đã dùng, 4 mục đọc hiểu hết 3 lượt)
- Bản đã review: `f77300e6500d792e4ff03d5cc931631557f1bfbdf70ec5e84f7dd2f49baa450c` (`pnpm content:diff` so với bản này)

Đã tự giải: `s6-on-chu-t-truc` (T: trục thẳng đứng; đúng, lựa chọn "Nằm ngang" sai vì nửa trên là nét ngang dài, nửa dưới chỉ là nét dọc), `s2-on-nhieu-truc` (đáp án `tat`; `explain` mới "Số trục của các hình có thể khác nhau" không còn nói mọi hình khác nhau; `wrong` của `mot`, `hai`, `khong` đều đúng), `s6-chu-u-truc`, `s6-on-chu-mot-truc` (C), `s6-cham-chu-mot-truc` (K, W). Recap của section 6 vẫn khớp `note` quy tắc. Bản sửa không làm hỏng các mục cùng section: câu mới không trùng đáp án 5.3 (A B M Y 3, H X 0 8) hay 5.7. `chu-b` không còn được tham chiếu.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu ôn `s6-on-chu-t-truc` hỏi lại đúng ví dụ màn quy tắc (LL-07)

- Vị trí: `$.exercises[?(@.id=='hinh-co-truc-doi-xung.ex.s6-on-chu-t-truc')]` (visual `chu-t`)
- Nguồn: —
- Vấn đề: `chu-cai-quy-tac` (màn quy tắc và recap của section 6) in đúng dòng "Chữ T: 1 trục thẳng đứng", và thẻ đầu của `chu-cai-the` là T. Câu ôn nhắc lại đúng chữ, đúng đáp án đó, nên bé nhớ lại hình vừa xem chứ chưa tự xét trục. Mức Nên sửa (không Nghiêm trọng): câu kho ôn nằm xa câu sách, không lộ đáp án 5.3 hay 5.7, và chữ lặp là lựa chọn ít hại nhất theo bảng hình của tác giả (mọi chữ một trục khác đều đã ở 5.3, 5.7 hoặc câu dẫn `l53a-chu-mot-truc`).
- Sửa: tốt hơn một chút là chữ V (thêm visual `chu-v` cùng kiểu `chu-t`, đề "Chữ V có đúng một trục... thẳng đứng hay nằm ngang?", đáp án thẳng đứng): V chỉ lặp ở câu dẫn `l53a` (cùng section 9, khác dạng câu, cách xa) và là một đáp án nối của 5.7 chứ không phải 5.3. Chấp nhận giữ T nếu chủ dự án thấy việc thêm một visual không đáng, vì cả hai cách đều lặp một dữ kiện bé đã thấy.

### 2. Đọc hiểu: `ex.s9-buoc-dau` `explain.wrong[0].text` còn "Hiểu mơ hồ"

- Vị trí: `$.exercises[?(@.id=='hinh-co-truc-doi-xung.ex.s9-buoc-dau')].explain.wrong[0].text`
- Nguồn: —
- Vấn đề: Haiku ghi "điểm đối xứng quá trừu tượng"; đã hết 3 lượt. Không chặn: "điểm đối xứng" là từ section 9 đã dạy.
- Sửa: tuỳ tác giả; nếu sửa, thêm vế "điểm ở bên kia trục" ngay sau từ này.

### 3. Đọc hiểu: bài tập sách bài tập, `blocks[2].children[2].text` còn "Hiểu mơ hồ"

- Vị trí: `$.sections[?(@.id=='hinh-co-truc-doi-xung.section.bai-tap-sach-bai-tap')].blocks[2].children[2].text`
- Nguồn: —
- Vấn đề: Haiku ghi "theo cột mơ hồ" ở câu "đếm số ô từ điểm tới d theo cột". Không chặn: "theo cột" khớp màn dạy đếm ô của 5.6 và hình đi kèm.
- Sửa: tuỳ tác giả; có thể đổi thành "đếm số ô từ điểm đó sang trục d, trên cùng một cột".

### 4. Đọc hiểu: `ex.l55-dau-cong` `explain.text` còn "Hiểu mơ hồ"

- Vị trí: `$.exercises[?(@.id=='hinh-co-truc-doi-xung.ex.l55-dau-cong')].explain.text`
- Nguồn: —
- Vấn đề: Haiku ghi "cánh ngang dài hơn cánh dọc chưa rõ". Không chặn: hình chữ thập của câu có cánh ngang dài hơn, chữ chỉ đang nêu đúng hình đó.
- Sửa: tuỳ tác giả; có thể thêm "trong hình trên".

### 5. Đọc hiểu: `ex.sbt-5-10` `explain.text` còn "Hiểu mơ hồ"

- Vị trí: `$.exercises[?(@.id=='hinh-co-truc-doi-xung.ex.sbt-5-10')].explain.text`
- Nguồn: tr.119 (5.10)
- Vấn đề: Haiku ghi "phải suy luận tính toán". Không chặn: bài đếm số ghép từ ba thẻ, mức suy luận này nằm trong đề sách (đếm 4 + 6 = 10).
- Sửa: tuỳ tác giả; Góp ý cũ của vòng 5 (nêu 0, 1, 8 có trục thẳng đứng, 2 và 5 đối xứng nhau) vẫn áp dụng.

## Góp ý

Không có.
