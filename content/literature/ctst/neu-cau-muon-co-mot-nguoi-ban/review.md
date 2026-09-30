# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Nguồn đã đọc: `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` - p21, p22, p23-24, p25-26; đối chiếu thêm `footnotes.txt`, `source-citation.txt`, `source-passage.txt`
- `content:check`: 0 lỗi, 0 cảnh báo của bài (bỏ qua "not in ids.lock.json")
- `lesson:walk`: 0 FAIL, 0 cảnh báo ở 3 khổ (ipad, phone, ipad-landscape), ảnh trong `.shots/walk/neu-cau-muon-co-mot-nguoi-ban/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng (chờ chủ dự án quyết định; không còn lỗi Nghiêm trọng nào tác giả tự sửa được). Chưa xuất bản: chờ chủ dự án duyệt văn bản (`source-passage.txt`); bài giữ `draft`, không ghi `reviewedHash`.

Các khối `passage` ghép lại khớp từng chữ với `source-passage.txt` (so bằng script, 4822/4822 ký tự) và với SGK tr.21-25. Câu trích lại trong đề bài tập trùng với câu cùng id trong section. Chú thích và nguồn trích khớp tr.21, 22, 24, 25. Tôi đã tự giải cả 56 exercise và 4 bước của `viet-cam-xuc-cao` trước khi đọc `answer`: mọi đáp án đều khớp và có câu làm căn cứ trong văn bản. Không highlight nào lộ đáp án; các hình gợi ý từ ghép, từ láy dùng từ nằm ngoài bài tập; `so-sanh-cho-trong` dừng ở "?". Số lần lặp trong hình `loi-lap-lai` đúng với văn bản (3, 2, 2, 3).

Các lỗi vòng trước đã được sửa: `cham-cao-buon` đã bỏ `l40-1` khỏi đề nên chỉ còn một câu đúng; ví dụ từ ghép "tiếng nhạc" đã thay bằng "lúa mì", "hoa hồng" ở note, hai recap và hình `tu-ghep-tu-lay`; dấu câu ba lựa chọn của `khong-hoi-tiec` đã thống nhất.

## Nghiêm trọng

### 1. Định nghĩa từ ghép, từ láy không có trong các trang nguồn (chờ chủ dự án, tác giả không tự gỡ được)

- Vị trí: `$.sections[10]` (`tu-ghep-tu-lay`: note định nghĩa, recap, hình `tu-ghep-tu-lay`, hình tương tác `cham-tu`), `$.cards[12]` (`tu-lay`), `$.cards[13]` (`tu-ghep`), hình gợi ý `goi-y-tu-lay`, `goi-y-tu-ghep`, hình `cau-mau`, cùng các bài tập phân loại từ dựa trên định nghĩa đó (`chon-tu-lay`, `tu-lay-trong-cau`, `chon-tu-ghep`, `chon-tat-ca-tu-lay`, `chon-tu-lay-tieng-gio`, `chon-tat-ca-tu-ghep`, `tu-ghep-bi-mat`, `viet-buoc-tu-lay`, `viet-buoc-tu-ghep`)
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: ở tr.26, mục "Từ ghép và từ láy" chỉ có đề câu 5 (viết đoạn văn có ít nhất 2 từ ghép và 2 từ láy). Các trang tr.21-26 không định nghĩa từ ghép, từ láy; các ví dụ "buồn bã", "lung linh" cũng không lấy từ trang nào. Nội dung bài đúng với kiến thức phổ thông, nhưng không có trang nào để đối chiếu cách SGK định nghĩa hai khái niệm này. Trẻ phải nhớ chính định nghĩa đó qua recap, và mọi câu phân loại từ đều chấm theo nó.
- Sửa: chủ dự án chọn một trong hai cách:
  - bổ sung ảnh trang "Tri thức tiếng Việt" (trang định nghĩa từ ghép, từ láy) vào `sources/literature/neu-cau-muon-co-mot-nguoi-ban/`; sau đó tác giả trỏ `sourceRef` của section và card tới trang đó, rồi soát lại câu chữ định nghĩa và ví dụ theo trang;
  - hoặc quyết định rõ rằng bài được dùng kiến thức đã học ở tiểu học cho phần này. Đây là thay đổi luật nội dung nên chủ dự án quyết định, tác giả không tự làm.

## Nên sửa

Không có.

## Góp ý

### 1. Một số yêu cầu của SGK tr.26 chưa có trong bài

- Vị trí: —
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: bài chưa có câu 8 (cáo có phải nhân vật truyện đồng thoại không), câu 1 mục "Nghĩa của từ ngữ" (yếu tố "hoá" trong "cảm hoá"), và trong câu 2 mới luyện đặt câu với "kiên nhẫn", "đơn điệu", chưa có "cốt lõi".
- Sửa: tuỳ tác giả. Có thể thêm một câu điền từ với "cốt lõi", và một bài tập về các từ có yếu tố "hoá" nếu muốn bài bám đủ phần thực hành.

### 2. Hình `ai-noi` trích lời thoại đã rút gọn

- Vị trí: `$.sections[0].blocks[3]` (hình `ai-noi`, mảng `LINES` trong `src/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/ai-noi.tsx`)
- Nguồn: tr.21, `p21.png`
- Vấn đề: các bóng nói có dấu gạch ngang như lời thoại thật nhưng câu chữ đã đổi: "Mình ở đây, dưới cây táo…" (văn bản: "Mình ở đây – giọng nói vang lên – dưới cây táo…"), "Lại đây chơi với mình đi." và "Mình là cáo." đã cắt lời người kể chuyện. Ngay trước đó note vừa dạy "hãy tìm lời người kể chuyện" để biết ai nói, nhưng hình lại bỏ chính phần đó, nên trẻ không dùng được cách vừa học.
- Sửa: tuỳ tác giả. Giữ nguyên câu theo văn bản (kể cả lời người kể chuyện), hoặc đổi dấu gạch ngang thành ngoặc kép để thấy đây là câu trích gọn.
