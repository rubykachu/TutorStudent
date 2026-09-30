# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Nguồn đã đọc: `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` - p21, p22, p23-24, p25-26; đối chiếu thêm `footnotes.txt`, `source-citation.txt`, `source-passage.txt`
- `content:check`: 0 lỗi, 0 cảnh báo của bài (bỏ qua "not in ids.lock.json"); `--stats` đạt mọi tiêu chí
- `lesson:walk`: 0 FAIL, 0 cảnh báo ở 3 khổ (ipad, phone, ipad-landscape), ảnh trong `.shots/walk/neu-cau-muon-co-mot-nguoi-ban/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng, lỗi này chờ chủ dự án quyết định chứ tác giả không tự sửa được. Chưa xuất bản: chờ chủ dự án duyệt văn bản (`source-passage.txt`); bài giữ `draft`, không ghi `reviewedHash`.

Cả 115 câu trong các khối `passage` khớp `source-passage.txt` và SGK tr.21-25. Câu trích lại trong đề bài tập trùng từng chữ với câu cùng id trong section. Chú thích và nguồn trích khớp tr.21, 22, 24, 25. Đáp án của mọi exercise đều có câu làm căn cứ trong văn bản. Không highlight nào lộ đáp án. Hình gợi ý từ ghép, từ láy dùng từ nằm ngoài bài tập, còn `so-sanh-cho-trong` dừng ở "?".

## Nghiêm trọng

### 1. Định nghĩa từ ghép, từ láy không có trong các trang nguồn (chờ chủ dự án)

- Vị trí: `$.sections[10]` (`tu-ghep-tu-lay`: note định nghĩa, recap, hình `tu-ghep-tu-lay`, hình tương tác `cham-tu`), `$.cards[12]` (`tu-lay`), `$.cards[13]` (`tu-ghep`), hình gợi ý `goi-y-tu-lay`, `goi-y-tu-ghep`, hình `cau-mau`, cùng các bài tập phân loại từ dựa trên định nghĩa đó (`chon-tu-lay`, `tu-lay-trong-cau`, `chon-tu-ghep`, `chon-tat-ca-tu-lay`, `chon-tu-lay-tieng-gio`, `chon-tat-ca-tu-ghep`, `tu-ghep-vuon-hong`, `viet-buoc-tu-lay`, `viet-buoc-tu-ghep`)
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: ở tr.26, mục "Từ ghép và từ láy" chỉ có đề câu 5 (viết đoạn văn có ít nhất 2 từ ghép và 2 từ láy). Trong tr.21-26 không có định nghĩa từ ghép, từ láy; ví dụ "lung linh", "tiếng nhạc" cũng không lấy từ trang nào. Bài viết đúng với kiến thức phổ thông, nhưng không có trang nào để đối chiếu cách SGK định nghĩa hai khái niệm. Chính định nghĩa này là điều trẻ phải nhớ qua recap, và cũng là tiêu chí để chấm mọi câu phân loại từ.
- Sửa: tác giả không tự gỡ được lỗi này trong phạm vi các trang hiện có. Muốn xếp một từ vào loại nào thì phải có tiêu chí, mà tiêu chí đó không nằm ở trang nào. Chỉ gỡ được theo một trong hai cách, cả hai đều do chủ dự án quyết định:
  - bổ sung ảnh trang "Tri thức tiếng Việt" (trang định nghĩa từ ghép, từ láy) vào `sources/literature/neu-cau-muon-co-mot-nguoi-ban/`; sau đó tác giả trỏ `sourceRef` của section và card tới trang đó, rồi soát lại câu chữ định nghĩa và ví dụ theo trang;
  - hoặc quyết định rõ rằng bài được dùng kiến thức đã học ở tiểu học cho phần này. Quyết định này là đổi luật nội dung, không phải việc tác giả tự sửa.

## Nên sửa

### 1. Đề bài viết không nêu yêu cầu từ ghép, từ láy mà rubric lại chấm

- Vị trí: `$.exercises[55].prompt[0]`, `$.exercises[55].writing.rubric[3]`, `rubric[4]` (`viet-cam-xuc-cao`)
- Nguồn: tr.26, `p25-26.png` (câu 5: "có sử dụng ít nhất 2 từ ghép và 2 từ láy")
- Vấn đề: màn viết (ảnh `139-...-writing.png`) chỉ ghi "Tưởng tượng và viết đoạn văn từ 5 đến 7 câu, tả cảm xúc của cáo sau khi chia tay hoàng tử bé." Trẻ chỉ gặp yêu cầu "Có ít nhất 2 từ ghép", "Có ít nhất 2 từ láy" ở màn tự chấm, tức là sau khi đã viết xong. Recap của section có nhắc "Nhớ dùng từ ghép, từ láy" nhưng recap hiện sau bài tập. Rubric vì thế lệch với đề.
- Sửa: tác giả sửa được. Thêm vào `prompt` một câu, ví dụ: "Trong đoạn văn, dùng ít nhất 2 từ ghép và 2 từ láy."

### 2. `minutes` của section viết đoạn văn quá thấp

- Vị trí: `$.sections[11].minutes` (`viet-doan-van`)
- Nguồn: —
- Vấn đề: section ghi 3 phút, nhưng có 2 màn giải thích, bài `openEnded` gồm 4 bước nhỏ, màn viết, màn tự chấm, rồi recap: khoảng 9 màn, tức khoảng 6 phút theo mức 40 giây mỗi màn, chưa kể thời gian viết 5 đến 7 câu. Trẻ học chậm sẽ thấy phần này dài hơn nhiều so với con số hiển thị.
- Sửa: tác giả sửa được. Đặt `minutes` tối thiểu 6.

### 3. Hình gợi ý so sánh nêu khái niệm chung không có ở trang nguồn

- Vị trí: hình `so-sanh-cho-trong`, nhãn "Từ nào nối hai sự vật có nét giống nhau?" (`$.exercises[24].hints.hintVisualId`, `dien-tu-so-sanh`)
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: phần so sánh đã được viết lại để bám câu 3 tr.26 và không còn định nghĩa chung. Riêng nhãn này vẫn đưa vào cách hiểu chung "hai sự vật có nét giống nhau", một ý trang nguồn không nêu. Nhãn nằm ở gợi ý chứ không ở màn quy tắc nên tôi không xếp mức Nghiêm trọng. Tôi phân vân giữa Góp ý và Nên sửa, và chọn mức cao hơn vì đây là chỗ duy nhất trong phần so sánh còn vượt khỏi trang nguồn.
- Sửa: tác giả sửa được. Đổi nhãn thành câu bám đúng câu của cáo, ví dụ: "Cáo dùng từ nào để nối bước chân của bạn với tiếng nhạc?"

## Góp ý

### 1. Định nghĩa từ ghép được diễn đạt theo ba cách

- Vị trí: `$.sections[10].blocks[0]` (note: "có quan hệ với nhau về nghĩa"), hình `tu-ghep-tu-lay` và recap (`$.sections[10].recap.caption`: "ghép theo nghĩa", "ghép lại theo nghĩa"), hình `goi-y-tu-ghep` ("mỗi tiếng đều góp nghĩa")
- Nguồn: —
- Vấn đề: cùng một quy tắc được nói bằng ba cách. Riêng từ láy thì đã thống nhất là "giống âm đầu hoặc vần".
- Sửa: dùng một cách diễn đạt ở mọi chỗ, lấy theo trang "Tri thức tiếng Việt" khi có (xem Nghiêm trọng 1).

### 2. Màn hướng dẫn điền từ nằm ở section không có câu điền từ

- Vị trí: `$.sections[10].blocks[2]` (hình `huong-dan-dien`)
- Nguồn: —
- Vấn đề: section `tu-ghep-tu-lay` giờ chỉ có câu `choice`. Tám câu `fillBlank` của bài (`dien-nghia-cam-hoa`, `dien-can-den-nhau`, `dien-hanh-tinh`, `dien-tu-so-sanh`, `dien-so-sanh-voi`, `dien-trach-nhiem`, `dien-kien-nhan`, `dien-don-dieu`) đều nằm trong kho ôn của các card thuộc section 2 đến 9. Vì vậy phiên ôn có thể đưa ra câu điền từ trước khi trẻ tới màn hướng dẫn. Thao tác điền từ không thuộc nhóm bắt buộc phải có màn hướng dẫn.
- Sửa: chuyển màn này lên section `cam-hoa-la-gi` (đang có 3 màn), hoặc bỏ.

### 3. `xep-cach-cam-hoa`: một mục là kết quả chứ không phải việc cáo dặn

- Vị trí: `$.exercises[29].prompt[0]`, `$.exercises[29].items[2]` (`xep-cach-cam-hoa`)
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: đề ghi "Xếp các việc hoàng tử bé cần làm để cảm hoá cáo, theo lời cáo dặn", nhưng mục "Hoàng tử bé cảm hoá được cáo" là kết quả (câu l38-1), không phải việc cáo dặn.
- Sửa: đổi đề thành "Xếp theo đúng thứ tự: hai việc cáo dặn rồi đến kết quả", hoặc thay mục thứ ba bằng một việc có trong lời cáo.

### 4. Một số yêu cầu của SGK tr.26 chưa có trong bài

- Vị trí: —
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: bài chưa có câu 8 (cáo có phải nhân vật truyện đồng thoại không) và câu 1 mục "Nghĩa của từ ngữ" (yếu tố "hoá" trong "cảm hoá").
- Sửa: tuỳ tác giả. Có thể thêm một bài tập về các từ có yếu tố "hoá" nếu muốn bài bám đủ phần thực hành.
