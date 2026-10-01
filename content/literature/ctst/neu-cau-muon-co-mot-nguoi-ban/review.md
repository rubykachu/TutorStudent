# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Vòng: 16 - chỉ phần đổi (`pnpm content:diff neu-cau-muon-co-mot-nguoi-ban --root content`), section: `cao-xuat-hien`, `so-sanh`, `viet-doan-van`; phần đổi: note đầu `so-sanh` (bỏ "SGK tr.26 cho biết"), bước `viet-buoc-cam-xuc` ("Lúc chia tay"), rubric `viet-cam-xuc-cao` (màu lúa mì / tiếng gió), đề `chon-tat-ca-loi-cao` ("Chọn tất cả câu cáo nói."), và hình `dan-y` (ý 3, `rule-examples.tsx`, không nằm trong diff)
- Nguồn đã đọc: `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` - p25-26 (câu hỏi và bài viết tr.26), đối chiếu `source-passage.txt`; p23-24 đã đối chiếu ở vòng trước
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 1 cảnh báo của bài (2 id chưa có trong `ids.lock.json`, điều phối chạy `content:lock` sau)
- `lesson:walk`: không chạy ở vòng này (điều phối giao ảnh hình `dan-y` iPad và điện thoại; đã xem cả hai: bốn ý hiện đủ, ý 3 xuống hai dòng, không chồng, không cắt)
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 1 Góp ý
- Bản đã review: `75a143677ceab4bd6514e0545110337d48011b6560a0aaefdc359eacc6106566` (`pnpm content:diff` so với bản này)

Đã soát đạt:
- Note đầu `so-sanh`: "Câu này của cáo có biện pháp so sánh. Cáo đặt bước chân của bạn cạnh tiếng nhạc, nối bằng “như là”." đúng văn bản (“Còn bước chân của bạn sẽ gọi mình ra khỏi hang, như là tiếng nhạc.”). Bỏ cụm "SGK tr.26 cho biết" làm lời cho trẻ gọn hơn; "Câu này" trỏ vào câu hiện ngay dưới trong hình cùng màn. Recap section và recap hai card `so-sanh`, `tac-dung-so-sanh` vẫn khớp note; `cham-cau-so-sanh`, `so-sanh-voi-gi`, `tac-dung-tieng-nhac` giữ đúng một đáp án, nhiễu không thành đáp án đúng.
- `viet-buoc-cam-xuc`: "Lúc chia tay, cáo cảm thấy thế nào?" khớp văn bản ("Khi gần đến lúc phải ra đi", “A!… Mình sẽ khóc mất.”, câu `l39-1`) và cách nói của bài (card `cam-xuc-chia-tay`, kịch bản video `bi-mat-cua-cao`: "Chia tay, cáo buồn đến muốn khóc"). Đáp án `buon-nho` duy nhất; "Quên bạn ngay", "Giận", "Vui như mọi ngày" vẫn sai theo văn bản.
- Rubric `viet-cam-xuc-cao`, mục 3: "Nhắc đến màu lúa mì làm cáo nhớ bạn, hoặc cáo thích tiếng gió trên đồng lúa mì." đúng văn bản (“Lúa mì vàng óng ả sẽ làm mình nhớ đến bạn. Và mình sẽ thấy thích tiếng gió trên đồng lúa mì...”): chỉ màu lúa mì gắn với nhớ bạn, tiếng gió chỉ là điều cáo thích. Một cách hiểu, làm được ở lớp 6, khớp đề tr.26 (viết 5 đến 7 câu, tả cảm xúc của cáo) và bước `viet-buoc-nho-ban` (đáp án `l31-17`, câu về màu lúa mì).
- Hình `dan-y` ý 3: "Màu lúa mì gợi nhớ bạn, cáo thích tiếng gió" cùng ý với rubric mục 3 (đủ cả hai vế), khớp recap section ("nỗi buồn, điều làm cáo nhớ bạn và niềm vui còn lại"), recap card `cam-xuc-chia-tay` ("Màu lúa mì sẽ làm cáo nhớ bạn") và kịch bản video ("Màu lúa mì sẽ làm cáo nhớ bạn."). Hình dùng cho cả màn dàn ý lẫn recap section; chữ nằm trong khung ở cả hai thiết bị, không cắt. Ý 1, 2, 4 không đổi.
- `chon-tat-ca-loi-cao`: "Chọn tất cả câu cáo nói." vẫn nói rõ "chọn tất cả" khi `multiple: true`, không phủ định kép. Mỗi lựa chọn là cả dòng gồm lời nhân vật và lời người kể; đáp án `tat-nhien`, `kien-nhan` (cáo nói/trả lời) đúng văn bản, hai nhiễu là lời hoàng tử bé ("hoàng tử bé nói", "Hoàng tử bé hỏi") nên không thành đáp án đúng. "Câu cáo nói" là lời thường, không mâu thuẫn "lời thoại" ở note, recap (`loi-thoai-mau`, card `ai-noi`) và `ai-noi-chua-cam-hoa`: hình gợi ý `loi-thoai-mau` dạy chính khác biệt này. Đáp án không đổi.
- Các mục khác của ba section không bị bản sửa làm hỏng: `htb-dang-buon`, `ai-noi-chua-cam-hoa`, các câu của `so-sanh`, bốn bước của `viet-cam-xuc-cao` (từ láy `lặng lẽ`, từ ghép `lúa mì`), note, recap và `caption` của `cao-xuat-hien`, `viet-doan-van`; lời video `ai-dang-noi`, `bi-mat-cua-cao` không nói điều trái bản mới.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. “Lúc chia tay” ở câu 4 và “Khi từ biệt” ở câu 5 nghe như cùng một lúc

- Vị trí: `$.overview.summary`, câu 4 (giữ từ vòng trước; chữ chưa đổi)
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: hai cụm gần nghĩa nên câu 4–5 đọc như cùng một cảnh. Không sai văn bản. Còn mở vì lời đọc tổng quan đọc đúng chữ này, sửa phải dựng lại lời đọc.
- Sửa: tuỳ tác giả; câu 4 mở bằng “Khi sắp chia tay, cáo buồn đến muốn khóc…”, rồi dựng lại lời đọc (`pnpm narration:build`).
