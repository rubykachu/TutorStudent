# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Nguồn đã đọc: `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` - p21, p22, p23-24, p25-26; đối chiếu thêm `footnotes.txt`, `source-citation.txt`, `source-passage.txt`
- `content:check`: 0 lỗi, 0 cảnh báo của bài (bỏ qua "not in ids.lock.json")
- `lesson:walk`: 0 FAIL, 0 cảnh báo ở 3 khổ (ipad, phone, ipad-landscape), ảnh trong `.shots/walk/neu-cau-muon-co-mot-nguoi-ban/`
- Kết luận: Chưa đạt: còn 3 lỗi Nghiêm trọng. Chưa xuất bản: chờ chủ dự án duyệt văn bản (`source-passage.txt`); bài giữ `draft`, không ghi `reviewedHash`.

Cả 115 câu trong các khối `passage` khớp `source-passage.txt` và SGK tr.21-25. Câu trích lại trong đề bài tập trùng từng chữ với câu cùng id trong section. Chú thích và nguồn trích khớp tr.21, 22, 24, 25. Trừ `dem-lan-hoi` (Nghiêm trọng 3), đáp án của mọi exercise đều có câu làm căn cứ trong văn bản.

## Nghiêm trọng

### 1. Định nghĩa so sánh, từ ghép, từ láy không có trong các trang nguồn

- Vị trí: `$.sections[5]` (`so-sanh`: note định nghĩa, hình `so-sanh` với ví dụ "Mặt trăng tròn như quả bóng" và nhãn "Sự vật thứ nhất / Từ so sánh / Sự vật thứ hai"), `$.sections[10]` (`tu-ghep-tu-lay`: note định nghĩa, hình `tu-ghep-tu-lay`, `cham-tu`), `$.cards[5]` (`so-sanh`), `$.cards[6]` (`tac-dung-so-sanh`), `$.cards[12]` (`tu-lay`), `$.cards[13]` (`tu-ghep`), hình gợi ý `goi-y-tu-lay`, `goi-y-tu-ghep`
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: tr.26 chỉ có đề bài (mục "Biện pháp tu từ" câu 3, mục "Từ ghép và từ láy" câu 5). Trong tr.21-26 không có định nghĩa so sánh, từ ghép, từ láy, cũng không có tên gọi các phần của phép so sánh. Nội dung bài viết đúng với kiến thức phổ thông, nhưng không có trang nào để đối chiếu cách SGK định nghĩa và gọi tên. Chính các định nghĩa này là thứ trẻ phải ghi nhớ qua recap.
- Sửa:
  - Từ ghép, từ láy: không viết lại được trong phạm vi các trang hiện có. Muốn xếp một từ vào loại nào thì phải có tiêu chí, mà tiêu chí đó không nằm ở trang nào. Chỉ gỡ được theo một trong hai cách: chủ dự án bổ sung ảnh trang "Tri thức tiếng Việt" (nơi định nghĩa từ ghép, từ láy) vào `sources/literature/neu-cau-muon-co-mot-nguoi-ban/`, sau đó trỏ `sourceRef` của section và card tới trang đó và soát lại câu chữ theo trang; hoặc chủ dự án quyết định rõ rằng được dùng kiến thức đã học ở tiểu học (quyết định này đổi luật nội dung chứ không phải việc tác giả tự sửa được).
  - So sánh: phần lớn gỡ được bằng cách viết lại, nhưng việc bổ sung trang nguồn vẫn là cách tốt hơn. Nếu viết lại, section chỉ bám câu 3 tr.26: SGK đã khẳng định đoạn "Mình sẽ biết thêm… như là tiếng nhạc" có phép so sánh, nên bài dạy trẻ tìm trong đoạn đó hai thứ được đặt cạnh nhau (bước chân của bạn, tiếng nhạc), từ nối "như là", rồi tác dụng. Bỏ định nghĩa chung, ví dụ "Mặt trăng" và các nhãn tên phần không có trong nguồn.

### 2. Thuật ngữ "lời dẫn" không có trong nguồn và lệch thuật ngữ chuẩn

- Vị trí: `$.sections[0].blocks[1].children[2]` (note "hãy tìm lời dẫn như…"), `$.sections[0].recap.caption`, `$.cards[0].recap.caption` (`ai-noi`), hình `loi-thoai-mau` (nhãn "Lời dẫn “con cáo trả lời”: cáo đang nói"), `$.exercises[27].options[1]` (`bo-so-sanh`, nhiễu "Lời dẫn cho biết ai đang nói")
- Nguồn: tr.21, `p21.png` (chú thích 2 dùng "người kể chuyện")
- Vấn đề: bài dạy và bắt trẻ nhớ một thuật ngữ ("lời dẫn") mà trang nguồn không có. Glossary của môn chọn "người kể chuyện" và cấm "người dẫn truyện". Ở lớp trên, "lời dẫn trực tiếp" lại chỉ chính lời nhân vật được dẫn, tức nghĩa ngược với cách bài đang dùng. Trẻ nhớ tên này dễ bị lẫn về sau.
- Sửa: sửa được trong phạm vi các trang hiện có. Đổi thành "lời người kể chuyện", ví dụ: "Muốn biết ai đang nói, hãy tìm lời người kể chuyện như “con cáo nói”, “hoàng tử bé hỏi”." Sửa tương tự ở recap của section, recap của card, nhãn trong hình `loi-thoai-mau` và nhiễu của `bo-so-sanh`.

### 3. `dem-lan-hoi`: đề cắt đoạn còn 2 lần hỏi, trái với lời dặn đếm và với con số "3 lần" của bài

- Vị trí: `$.exercises[5].prompt[1]`, `$.exercises[5].answer` (`dem-lan-hoi`), đối chiếu `$.sections[1].blocks[0].annotations[0]`, hình `loi-lap-lai`, `lap-lai-tac-dung`, `$.exercises[46].prompt[0]` (`hoi-di-hoi-lai`)
- Nguồn: tr.22, `p22.png`
- Vấn đề: ngay trước bài tập, annotation ở l11-1 dặn trẻ "Đếm xem hoàng tử bé hỏi nghĩa của từ “cảm hoá” mấy lần". Trong đoạn của section, câu hỏi này xuất hiện 3 lần (l11-1, l13-2, l15-2). Nhưng đề bài tập chỉ trích l11-1 đến l13-2 và lấy đáp án "2 lần". Trẻ đã đếm theo lời dặn sẽ chọn "3 lần" (một lựa chọn có sẵn) và bị chấm sai; muốn đúng thì phải nhận ra đoạn trích đã bị cắt. Về sau, hình `loi-lap-lai` ghi "3 lần" và `hoi-di-hoi-lai` nói "lần hai, lần ba", nên bài tự mâu thuẫn về cùng một con số. Tôi phân vân giữa Nên sửa và Nghiêm trọng, và chọn mức cao hơn vì đáp án đúng dựa vào chỗ cắt đoạn, tức một chi tiết gài bẫy.
- Sửa: thêm l14-1 đến l15-2 vào `prompt` (hoặc trích đủ l11-1 đến l16-2) và đổi `answer` thành `ba`. Nấc 1 giữ tô l11-1.

## Nên sửa

### 1. Bài điền từ ghép, từ láy đoán được bằng nghĩa, không cần biết loại từ

- Vị trí: `$.exercises[53].bank` (`dien-tu-lay`), `$.exercises[55].bank` (`dien-tu-ghep`), `$.exercises[56].steps[2].bank` (`viet-buoc-tu-lay`), `$.exercises[56].steps[3].bank` (`viet-buoc-tu-ghep`)
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: đề bảo chọn từ láy (hay từ ghép), nhưng các nhiễu không hợp nghĩa với chỗ trống ("Tiếng gió thổi trái tim / hành tinh", "vườn gần gũi / tò mò", "Cáo ngồi cánh đồng nhìn theo bạn"). Trẻ chỉ cần chọn từ hợp nghĩa là đúng, nên bài không kiểm được việc phân biệt từ ghép và từ láy.
- Sửa: chọn nhiễu hợp nghĩa với chỗ trống nhưng thuộc loại từ kia, để trẻ phải dựa vào cấu tạo từ. Ví dụ `viet-buoc-tu-lay`: "Cáo ngồi ___ nhìn theo bạn", ngân hàng từ "lặng lẽ" (đáp án) và "một mình" (từ ghép, cũng hợp nghĩa). Hoặc chuyển các câu này sang dạng `choice`, liệt kê những từ cùng hợp với câu. Kiểm lại để chỉ còn đúng một đáp án.

## Góp ý

### 1. Cách diễn đạt từ láy chưa thống nhất: "giống nhau về âm hoặc vần" và "giống âm đầu hoặc vần"

- Vị trí: `$.sections[10].blocks[0]` (note), `$.cards[12].recap.caption`, hình `tu-ghep-tu-lay` ("giống âm hoặc vần"), so với hình `goi-y-tu-lay` ("hai tiếng giống âm đầu hoặc vần")
- Nguồn: —
- Vấn đề: cùng một quy tắc được nói bằng hai cách. "Âm" thì mơ hồ hơn "âm đầu".
- Sửa: dùng một cách diễn đạt ở mọi chỗ, lấy theo trang "Tri thức tiếng Việt" khi có (xem Nghiêm trọng 1).

### 2. Một số yêu cầu của SGK tr.26 chưa có trong bài

- Vị trí: —
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: bài chưa có câu 8 (cáo có phải nhân vật truyện đồng thoại không) và câu 1 mục "Nghĩa của từ ngữ" (yếu tố "hoá" trong "cảm hoá").
- Sửa: tuỳ tác giả. Có thể thêm một bài tập về các từ có yếu tố "hoá" nếu muốn bài bám đủ phần thực hành.
