# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Nguồn đã đọc: `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` - p21, p22, p23-24, p25-26; đối chiếu thêm `footnotes.txt`, `source-citation.txt`, `source-passage.txt`
- `content:check`: 0 lỗi, 0 cảnh báo của bài (bỏ qua "not in ids.lock.json")
- `lesson:walk`: 0 FAIL, 0 cảnh báo ở 3 khổ (ipad, phone, ipad-landscape), ảnh trong `.shots/walk/neu-cau-muon-co-mot-nguoi-ban/`
- Kết luận: Chưa đạt: còn 3 lỗi Nghiêm trọng. Chưa xuất bản: chờ chủ dự án duyệt văn bản (`source-passage.txt`), bài giữ `draft`, không ghi `reviewedHash`.

Văn bản trong các khối `passage` khớp từng câu với SGK tr.21-25 và `source-passage.txt`; chú thích và nguồn trích khớp tr.21, 22, 24, 25. Đáp án của các exercise còn lại đều có câu căn cứ trong văn bản.

## Nghiêm trọng

### 1. "chăm chú" được coi chắc chắn là từ láy, trong khi theo chính định nghĩa của bài nó cũng có thể là từ ghép

- Vị trí: `$.exercises[50]` (`tu-lay-trong-cau`, đáp án), `$.exercises[51]` (`chon-tu-ghep`, lựa chọn nhiễu), `$.exercises[54]` (`chon-tat-ca-tu-ghep`, lựa chọn nhiễu)
- Nguồn: tr.26, `p25-26.png` (mục "Từ ghép và từ láy" chỉ có đề, không có ví dụ này)
- Vấn đề: bài dạy "từ ghép gồm các tiếng có quan hệ với nhau về nghĩa". Cả hai tiếng của "chăm chú" đều có nghĩa ("chăm" như trong chăm chỉ, "chú" như trong chú ý), nên trẻ làm đúng định nghĩa vẫn có thể xếp nó vào từ ghép. Tài liệu tham khảo cũng không thống nhất về từ này. Hậu quả: `tu-lay-trong-cau` có thể không có đáp án đúng, còn `chon-tu-ghep` và `chon-tat-ca-tu-ghep` có thể có thêm một đáp án đúng.
- Sửa: bỏ "chăm chú" khỏi cả ba câu. `tu-lay-trong-cau`: đổi sang câu có từ láy rõ ràng, ví dụ câu mẫu "Cáo ngẩn ngơ nhìn theo con đường mòn" hoặc một câu có "lặng lẽ" (không dùng lại l22-1 vì `dien-tu-lay` đã dùng câu đó); nhiễu là từ ghép rõ ràng. Ở hai câu từ ghép, thay nhiễu "chăm chú" bằng từ láy rõ ràng như "lặng lẽ", "xinh xắn".

### 2. Hình gợi ý nấc 2 của `dien-tu-so-sanh` lộ đáp án

- Vị trí: `$.exercises[25].hints.hintVisualId` (`dien-tu-so-sanh`, hình `visual.dau-hieu-so-sanh`)
- Nguồn: —
- Vấn đề: đề bắt chọn từ so sánh cho chỗ trống, ngân hàng từ gồm "như là", "nhưng", "bởi vì". Hình gợi ý ghi "Tìm từ so sánh" rồi liệt kê "như", "như là", "giống như". Trong ngân hàng chỉ có "như là" nằm trong danh sách đó, nên trẻ chỉ cần dò chữ, không phải hiểu câu. Hình này dùng được cho `cham-cau-so-sanh` (trẻ vẫn phải tự tìm câu), nhưng với câu điền từ thì nó chính là đáp án.
- Sửa: dùng hình gợi ý khác cho `dien-tu-so-sanh`: tách câu thành "bước chân của bạn" … "?" … "tiếng nhạc" và hỏi "Từ nào nối hai sự vật giống nhau?", không liệt kê từ so sánh. Hoặc bỏ `hintVisualId` và dùng `highlight` tô khối đề (`target: "block"`).

### 3. Kiến thức tiếng Việt (so sánh, từ ghép, từ láy) không có trong các trang nguồn

- Vị trí: `$.sections[5]` (`so-sanh`, note định nghĩa và `sourceRef: "SGK tr.23, tr.26"`), `$.sections[10]` (`tu-ghep-tu-lay`, note định nghĩa, `sourceRef: "SGK tr.26"`), cùng các card `so-sanh`, `tu-lay`, `tu-ghep`
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: tr.26 chỉ có đề bài (mục "Biện pháp tu từ" câu 3, mục "Từ ghép và từ láy" câu 5). Trong tr.21-26 không có định nghĩa so sánh, từ ghép, từ láy hay tên các phần của phép so sánh ("sự vật được so sánh", "từ so sánh", "sự vật dùng để so sánh"). Kiến thức này có trong chương trình lớp 6 và nội dung hiện tại đúng, nhưng không có trang nguồn để đối chiếu cách SGK định nghĩa và gọi tên (ví dụ SGK có chia từ láy toàn bộ và từ láy bộ phận hay không). Vì vậy không kiểm được các lời định nghĩa bài dạy trẻ ghi nhớ. Xếp mức cao hơn vì trẻ sẽ nhớ nguyên các định nghĩa này.
- Sửa: thêm vào `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` ảnh trang "Tri thức tiếng Việt" của bài học chứa văn bản này (SGK Ngữ văn 6 Chân trời sáng tạo, tập 1), trỏ `sourceRef` của hai section và các card trên tới trang đó, rồi soát lại câu chữ định nghĩa theo trang ấy.

## Nên sửa

### 1. `dem-lan-hoi` bắt đếm số lần hỏi nhưng màn bài tập không hiện đoạn văn

- Vị trí: `$.exercises[5].prompt` (`dem-lan-hoi`)
- Nguồn: tr.22, `p22.png`
- Vấn đề: đề chỉ có câu hỏi "Trong đoạn vừa đọc…". Trên màn (`018-s2-04-exercise-dem-lan-hoi.png`) không có câu nào để đếm, trẻ học chậm phải nhớ lại ba lần hỏi xen giữa lời cáo. Nấc 1 tô khối đề cũng không giúp được gì.
- Sửa: thêm khối `passage` gồm các câu l11-1 đến l16-2 vào `prompt`. Nấc 1 tô một câu hỏi, ví dụ l11-1 (không lộ đáp án, trẻ vẫn phải tự đếm).

### 2. `xep-cach-cam-hoa` xếp thành hai bước hai việc diễn ra cùng lúc

- Vị trí: `$.exercises[30].items` (`xep-cach-cam-hoa`)
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: theo lời cáo, "ngồi xa một chút" và "không nói gì" diễn ra cùng lúc. Chính hình `xich-lai-gan` của section cũng gộp "Ngồi xa một chút, không nói gì" vào Ngày 1. Tách thành bước 1 và bước 2 thì thứ tự giữa hai thẻ này không có căn cứ rõ ràng, và bài tập lệch với hình vừa học.
- Sửa: gộp thành một thẻ "Ngồi xa cáo một chút trên cỏ, không nói gì", thêm thẻ cuối theo l38-1, ví dụ "Hoàng tử bé cảm hoá được cáo". Ba thẻ: ngồi xa, không nói → mỗi ngày ngồi xích lại gần hơn → cảm hoá được cáo.

### 3. Nghĩa của "cốt lõi", "mắt trần", "đơn điệu", "kiên nhẫn" bị hỏi trước khi được dạy

- Vị trí: `$.exercises[40]` (`noi-nghia-tu`, luyện tập của section `bi-mat`), `$.exercises[43]` (`dien-kien-nhan`), `$.exercises[44]` (`dien-don-dieu`), `$.cards[10].recap` (`nghia-tu`)
- Nguồn: tr.24 (chú thích 1, 2), tr.26 câu 2, `p23-24.png`, `p25-26.png`
- Vấn đề: section `bi-mat` không có khối nào giải nghĩa các từ này. Hình `nghia-tu` chỉ xuất hiện làm recap của card, nên trẻ gặp nghĩa "cốt lõi", "mắt trần", "đơn điệu" lần đầu ngay trong bài nối (`107-s9-08-exercise-noi-nghia-tu.png`). Chú thích SGK tr.24 cũng không hiện trên màn đọc. Ngoài ra `dien-kien-nhan` và `dien-don-dieu` gắn card `nghia-tu`, nhưng caption recap của card chỉ nói về "cốt lõi" và "mắt trần", hình không có "kiên nhẫn".
- Sửa: thêm vào section `bi-mat` (trước bài tập) một `group` gồm note giải nghĩa và hình `nghia-tu`, hoặc thêm annotation giải nghĩa ở l52-4. Bổ sung "kiên nhẫn" vào hình và cập nhật caption recap của card `nghia-tu` cho đủ bốn từ.

### 4. `mau-lua-mi`: câu làm căn cứ không có trong đề, nấc 1 tô sai chỗ

- Vị trí: `$.exercises[35].prompt`, `$.exercises[35].hints.highlight[0]` (`mau-lua-mi`)
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: đáp án "làm cáo nhớ đến mái tóc vàng của bạn" dựa vào l31-15 ("bạn có mái tóc vàng óng") và l31-17 ("Lúa mì vàng óng ả sẽ làm mình nhớ đến bạn"), nằm ở section `doi-khac` từ trước đó khá lâu. Đề chỉ có l45-1, và nấc 1 tô l45-1, câu này không chứa căn cứ nên trẻ sai lần đầu không biết nhìn lại đâu.
- Sửa: thêm l31-15 và l31-17 vào `prompt`, cho nấc 1 tô l31-17.

## Góp ý

### 1. Ví dụ từ ghép "mái tóc", "bông hoa", "cánh đồng" dễ gây tranh cãi

- Vị trí: `$.sections[10].blocks[0]` (note), `$.cards[13].recap` (`tu-ghep`), hình `tu-ghep-tu-lay`, `$.exercises[51]` (`chon-tu-ghep`, đáp án "cánh đồng"), step `viet-buoc-tu-ghep`
- Nguồn: —
- Vấn đề: tiếng đầu của các từ này ("mái", "bông", "cánh") thường làm loại từ, nên có tài liệu coi đây là cụm từ chứ không phải từ ghép. Đáp án hiện tại vẫn là lựa chọn duy nhất đúng (các nhiễu đều là từ láy), nhưng dùng những ví dụ này làm mẫu thì chưa chuẩn.
- Sửa: ưu tiên các ví dụ có trong bài và không gây tranh cãi: "hoa hồng", "lúa mì", "trái tim", "hành tinh", "thời gian".

### 2. `vi-sao-tho-dai`: đáp án lẫn cả lý do cáo vui

- Vị trí: `$.exercises[15].options[0]` (`vi-sao-tho-dai`)
- Nguồn: tr.22, `p22.png`
- Vấn đề: "Vì ở đó không có thợ săn, nhưng cũng không có gà". Vế "không có thợ săn" là lý do cáo thấy thú vị, không phải lý do thở dài. Vẫn đúng ý "chẳng có gì hoàn hảo", nhưng câu dài và dễ làm trẻ lẫn hai cảm xúc.
- Sửa: rút gọn thành "Vì ở đó có cái hay (không có thợ săn) nhưng cũng có cái dở (không có gà)" hoặc "Vì hành tinh ấy không có gà cho cáo săn".

### 3. Hình `cam-xuc-cao` (bước 3) ghi "vẫn thấy mình được nhiều"

- Vị trí: visual `cam-xuc-cao`, `cam-xuc-tom-tat`
- Nguồn: tr.24, `p23-24.png`
- Vấn đề: văn bản chỉ viết "Mình được chứ… bởi vì còn có màu lúa mì". Chữ "nhiều" là thêm vào.
- Sửa: "vẫn thấy mình được điều quý: màu lúa mì".

### 4. Một số yêu cầu của SGK tr.26 chưa có trong bài

- Vị trí: —
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: chưa có câu hỏi 8 (cáo có phải nhân vật truyện đồng thoại không) và mục "Nghĩa của từ ngữ" câu 1 (yếu tố "hoá" trong "cảm hoá").
- Sửa: tuỳ tác giả, có thể thêm một bài tập về các từ có "hoá" (ví dụ "xanh hoá", "tự động hoá") nếu muốn bài bám đủ phần thực hành.
