# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Nguồn đã đọc: `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` - p21, p22, p23-24, p25-26; đối chiếu thêm `footnotes.txt`, `source-citation.txt`, `source-passage.txt`
- `content:check`: 0 lỗi, 0 cảnh báo của bài (bỏ qua "not in ids.lock.json")
- `lesson:walk`: 0 FAIL, 0 cảnh báo ở 3 khổ (ipad, phone, ipad-landscape), ảnh trong `.shots/walk/neu-cau-muon-co-mot-nguoi-ban/`
- Kết luận: Chưa đạt: còn 2 lỗi Nghiêm trọng (1 lỗi tác giả sửa được, 1 lỗi chờ chủ dự án quyết định). Chưa xuất bản: chờ chủ dự án duyệt văn bản (`source-passage.txt`); bài giữ `draft`, không ghi `reviewedHash`.

Các khối `passage` ghép lại khớp từng chữ với `source-passage.txt` và SGK tr.21-25 (đoạn l31 được tách thành hai khối, không mất câu nào). Câu trích lại trong đề bài tập trùng với câu cùng id trong section. Chú thích và nguồn trích khớp tr.21, 22, 24, 25. Tôi đã tự giải cả 56 exercise và 4 bước của `viet-cam-xuc-cao` trước khi đọc `answer`. Trừ phát hiện Nghiêm trọng 2, mọi đáp án đều khớp và có câu làm căn cứ trong văn bản. Không highlight nào lộ đáp án. Các hình gợi ý từ ghép, từ láy dùng từ nằm ngoài bài tập; `so-sanh-cho-trong` dừng ở "?", nhãn đã bám câu của cáo. Các lỗi Nên sửa và Góp ý ở vòng trước đã được sửa: đề viết nêu yêu cầu từ ghép, từ láy; `minutes` của section viết là 6; một cách diễn đạt định nghĩa từ ghép; màn hướng dẫn điền từ đã chuyển lên section `cam-hoa-la-gi`; đề `xep-cach-cam-hoa` đã tách việc cáo dặn và kết quả.

## Nghiêm trọng

### 1. Câu chạm "cáo buồn" có hai câu đúng (tác giả sửa được)

- Vị trí: `$.exercises[35]` (`cham-cao-buon`), `prompt[1]` và `answer`
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: đề hỏi "Chạm vào câu cho thấy cáo buồn khi sắp chia tay.", đáp án chỉ có `l39-1` ("A!… Mình sẽ khóc mất."). Đoạn trích trong đề còn có `l40-1`: "mình không muốn làm bạn đau lòng chút nào". Câu này cũng cho thấy cáo buồn, và "đau lòng" lại là từ duy nhất trong đoạn gọi thẳng tên nỗi buồn. Trẻ chạm `l40-1` thì bị chấm sai, dù có căn cứ trong văn bản. Tôi phân vân giữa Nên sửa và Nghiêm trọng vì `l39-1` rõ hơn, nhưng chọn mức cao hơn: trẻ có lý do chính đáng để chọn `l40-1`.
- Sửa: chọn một trong hai cách:
  - bỏ đoạn `l40-1` khỏi `prompt[1]`, giữ `l38-1`, `l38-2`, `l39-1`;
  - hoặc đổi đề thành "Chạm vào lời cáo nói cho thấy cáo buồn khi sắp chia tay." (khi đó `l40-1` là lời hoàng tử bé nên bị loại một cách rõ ràng).

### 2. Định nghĩa từ ghép, từ láy không có trong các trang nguồn (chờ chủ dự án)

- Vị trí: `$.sections[10]` (`tu-ghep-tu-lay`: note định nghĩa, recap, hình `tu-ghep-tu-lay`, hình tương tác `cham-tu`), `$.cards[12]` (`tu-lay`), `$.cards[13]` (`tu-ghep`), hình gợi ý `goi-y-tu-lay`, `goi-y-tu-ghep`, hình `cau-mau`, cùng các bài tập phân loại từ dựa trên định nghĩa đó (`chon-tu-lay`, `tu-lay-trong-cau`, `chon-tu-ghep`, `chon-tat-ca-tu-lay`, `chon-tu-lay-tieng-gio`, `chon-tat-ca-tu-ghep`, `tu-ghep-vuon-hong`, `viet-buoc-tu-lay`, `viet-buoc-tu-ghep`)
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: ở tr.26, mục "Từ ghép và từ láy" chỉ có đề câu 5 (viết đoạn văn có ít nhất 2 từ ghép và 2 từ láy). Các trang tr.21-26 không định nghĩa từ ghép, từ láy; các ví dụ "buồn bã", "lung linh", "tiếng nhạc" cũng không lấy từ trang nào. Nội dung bài đúng với kiến thức phổ thông, nhưng không có trang nào để đối chiếu cách SGK định nghĩa hai khái niệm này. Trẻ phải nhớ chính định nghĩa đó qua recap, và mọi câu phân loại từ đều chấm theo nó.
- Sửa: tác giả không tự gỡ được lỗi này với các trang hiện có, vì tiêu chí phân loại từ không nằm ở trang nào. Chủ dự án chọn một trong hai cách:
  - bổ sung ảnh trang "Tri thức tiếng Việt" (trang định nghĩa từ ghép, từ láy) vào `sources/literature/neu-cau-muon-co-mot-nguoi-ban/`; sau đó tác giả trỏ `sourceRef` của section và card tới trang đó, rồi soát lại câu chữ định nghĩa và ví dụ theo trang;
  - hoặc quyết định rõ rằng bài được dùng kiến thức đã học ở tiểu học cho phần này. Đây là thay đổi luật nội dung nên chủ dự án quyết định, tác giả không tự làm.

## Nên sửa

### 1. Ví dụ từ ghép "tiếng nhạc" dễ gây tranh cãi

- Vị trí: `$.sections[10].blocks[0]` (note), `$.sections[10].recap.caption`, `$.cards[13].recap.caption`, hình `tu-ghep-tu-lay` (cột "Từ ghép": tiếng + nhạc)
- Nguồn: —
- Vấn đề: "tiếng nhạc" là ví dụ đầu tiên của từ ghép trong note và recap, tức là ví dụ trẻ sẽ nhớ. Nhiều cách phân tích lại xếp "tiếng nhạc" (cũng như "tiếng gió", "tiếng chim") vào cụm từ chứ không coi là một từ. Chính bài này cũng dùng "tiếng gió" làm lựa chọn nhiễu ở `chon-tu-lay-tieng-gio` mà không xếp nó là từ ghép. Ví dụ nằm ở ranh giới giữa từ và cụm từ thì không hợp để làm mẫu cho người học chậm.
- Sửa: tác giả sửa được. Thay "tiếng nhạc" bằng một từ ghép rõ ràng có trong văn bản, như "lúa mì", "hoa hồng" hoặc "trái tim" (các từ bài tập đã coi là từ ghép), ở cả note, hai recap và hình `tu-ghep-tu-lay`. Nếu chủ dự án bổ sung trang "Tri thức tiếng Việt" (Nghiêm trọng 2), ưu tiên dùng ví dụ của trang đó.

## Góp ý

### 1. Một số yêu cầu của SGK tr.26 chưa có trong bài

- Vị trí: —
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: bài chưa có câu 8 (cáo có phải nhân vật truyện đồng thoại không), câu 1 mục "Nghĩa của từ ngữ" (yếu tố "hoá" trong "cảm hoá"), và trong câu 2 mới luyện đặt câu với "kiên nhẫn", "đơn điệu", chưa có "cốt lõi".
- Sửa: tuỳ tác giả. Có thể thêm một câu điền từ với "cốt lõi", và một bài tập về các từ có yếu tố "hoá" nếu muốn bài bám đủ phần thực hành.

### 2. Dấu câu trong các lựa chọn của `khong-hoi-tiec` chưa thống nhất

- Vị trí: `$.exercises[33].options` (`khong-hoi-tiec`)
- Nguồn: —
- Vấn đề: lựa chọn đúng ghi `“Mình được chứ”.` (dấu chấm ngoài ngoặc), hai lựa chọn còn lại ghi `“Mình sẽ khóc mất.”`, `“Lỗi do bạn đó.”` (dấu chấm trong ngoặc). Khác biệt nhỏ nhưng làm lựa chọn đúng trông khác hẳn hai lựa chọn kia.
- Sửa: dùng cùng một kiểu ở cả ba lựa chọn.
