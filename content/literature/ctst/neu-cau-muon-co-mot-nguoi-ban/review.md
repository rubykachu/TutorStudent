# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Nguồn đã đọc: `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` - p21, p22, p23-24, p25-26
- Văn bản gốc: chủ dự án đã duyệt `source-passage.txt`, `footnotes.txt`, `source-citation.txt` với ảnh ngày 2026-09-30. Mọi câu trong khối `passage` của bài (115 id câu) khớp nguyên văn `source-passage.txt`, không có id nào mang hai cách viết.
- Từ ghép, từ láy: dùng ngoại lệ "Kiến thức nền (tiểu học)". Glossary `content/glossary/literature.json` ghi `prerequisite: "tiểu học"` cho "từ ghép", "từ láy"; `sourceRef` của section `tu-ghep-tu-lay`, card `tu-lay`, `tu-ghep` ghi "Kiến thức nền (tiểu học); câu 5 tr.26"; câu định nghĩa từ láy là câu chủ dự án chọn. Đã soát mọi ví dụ và đáp án (kể cả nhiễu) và các hình `tu-ghep-tu-lay`, `cham-tu`, `goi-y-tu-lay`, `goi-y-tu-ghep`, `cau-mau`: từ ghép (lúa mì, cánh đồng, mái tóc, bước chân, xe đạp, bí mật, đường mòn, cá vàng, mặt trời, bàn ghế, sân trường, bút chì) không có hai tiếng cùng âm đầu hay cùng vần; từ láy (buồn bã, lung linh, vui vẻ, tò mò, gần gũi, lặng lẽ, xào xạc, ngẩn ngơ, xinh xắn, nhỏ nhắn, long lanh, bồi hồi) đều là từ láy chuẩn trong sách tiểu học. Không ví dụ nào xếp được vào cả hai loại. Gạch chân âm lặp trong hình đúng (b, l, x; vần "ồi" của bồi hồi).
- `content:check`: 0 lỗi, 0 cảnh báo của bài (bỏ qua cảnh báo "not in ids.lock.json")
- `lesson:walk`: 0 FAIL, 0 cảnh báo ở 3 khổ (ipad, phone, ipad-landscape), ảnh trong `.shots/walk/neu-cau-muon-co-mot-nguoi-ban/`
- Kết luận: Đã xuất bản (`pnpm content:hash neu-cau-muon-co-mot-nguoi-ban --approve`, 2026-09-30)

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu "từ ghép trong câu" chọn được mà không cần dùng định nghĩa

- Vị trí: `$.exercises[?(@.id=="neu-cau-muon-co-mot-nguoi-ban.ex.tu-ghep-bi-mat")].options` (`ex.tu-ghep-bi-mat`)
- Nguồn: —
- Vấn đề: hai nhiễu "đây", "mình" chỉ có một tiếng, nên trẻ chọn "bí mật" vì đó là lựa chọn duy nhất có hai tiếng, không phải vì các tiếng đều có nghĩa. "Bí mật" lại là từ Hán Việt, trẻ lớp 6 khó tự kiểm "bí", "mật" có nghĩa riêng theo định nghĩa của bài. Nhiễu gần như không ai chọn.
- Sửa: dùng câu có một từ ghép thuần Việt và một từ láy làm nhiễu, ví dụ "Hoàng tử bé ngồi lặng lẽ trên bãi cỏ." với lựa chọn "bãi cỏ" (đúng), "lặng lẽ", "ngồi"; hoặc giữ câu l52-2 nhưng thêm nhiễu hai tiếng là từ láy.

### 2. Recap của section nói định nghĩa khác câu đã dạy

- Vị trí: `$.sections[10].recap.caption` (`section.tu-ghep-tu-lay`)
- Nguồn: —
- Vấn đề: màn "Nhớ nhé!" ghi "Từ láy: các tiếng lặp lại âm đầu, vần hoặc cả tiếng" và "Từ ghép: các tiếng đều có nghĩa", trong khi note của section và recap của card `tu-lay`, `tu-ghep` dùng câu chuẩn "Từ láy gồm các tiếng có âm đầu hoặc vần (hoặc cả tiếng) lặp lại", "Từ ghép gồm hai hoặc nhiều tiếng ghép lại, các tiếng đều có nghĩa". Cùng một quy tắc có hai cách nói, trẻ học chậm dễ nhớ lẫn.
- Sửa: chép đúng hai câu định nghĩa trong note vào `recap.caption` của section (giữ ví dụ "lúa mì", "buồn bã").

## Góp ý

### 1. Lời "SGK tr.26 cho biết…" hiện cho trẻ

- Vị trí: `$.sections[5].blocks[0].children[0].text` (`section.so-sanh`)
- Nguồn: tr.26, `p25-26.png`
- Vấn đề: trẻ đọc app không cần biết số trang sách; câu mở đầu nặng thêm.
- Sửa: "Câu này của cáo có biện pháp so sánh. Cáo đặt bước chân của bạn cạnh tiếng nhạc, nối bằng “như là”."

### 2. "Tiếng gió gợi nhớ bạn" đi xa hơn văn bản một chút

- Vị trí: hình `visual.dan-y` (mục 3) và `$.exercises[?(@.id=="neu-cau-muon-co-mot-nguoi-ban.ex.viet-cam-xuc-cao")].writing.rubric[2]`
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: văn bản nói lúa mì làm cáo nhớ bạn, còn tiếng gió trên đồng lúa mì thì cáo "thấy thích". Liên hệ được bằng suy luận nên không sai, nhưng bám chữ hơn sẽ dễ hiểu hơn.
- Sửa: "Nhắc đến màu lúa mì làm cáo nhớ bạn, hoặc tiếng gió trên đồng lúa mì cáo thấy thích."

### 3. Bước tìm ý hỏi "ngay sau khi chia tay" nhưng căn cứ là câu trước lúc chia tay

- Vị trí: `steps[0]` của `ex.viet-cam-xuc-cao` (`ex.viet-buoc-cam-xuc`)
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: câu l39-1 "Mình sẽ khóc mất." nói lúc sắp ra đi. Đáp án "Buồn và nhớ bạn" vẫn hợp lý cho bài viết tưởng tượng.
- Sửa: đổi đề thành "Lúc chia tay, cáo cảm thấy thế nào?".
