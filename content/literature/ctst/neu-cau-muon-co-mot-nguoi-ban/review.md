# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Vòng: 15 - chỉ phần đổi (`pnpm content:diff neu-cau-muon-co-mot-nguoi-ban --root content`), phần đổi: `guide` (tapText, fillBlankBank, match, order) trên bốn màn hướng dẫn; `rule: true` trên note của `cam-hoa-la-gi` và `tu-ghep-tu-lay`; recap card `nghia-cam-hoa`
- Nguồn đã đọc: `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` - p23-24 đã đối chiếu ở vòng trước; bản sửa chỉ chỉnh lời dẫn của Cáo, câu vẫn đúng văn bản
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 1 cảnh báo của bài (2 id chưa có trong `ids.lock.json`, giữ từ vòng trước)
- `lesson:walk`: không chạy (vòng này chỉ thêm dấu máy đọc `guide`, `rule`, không hiện trên màn)
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 3 Góp ý (giữ từ vòng trước)
- Bản đã review: `e1e979ba97878ab125c8cf350efdfd93ded4ee14fcb3cd961ec04f17c0276276` (`pnpm content:diff` so với bản này)

Đã soát đạt:
- Bản sửa recap `nghia-cam-hoa`: "Cáo nói gọn: cảm hoá là “làm cho gần gũi hơn”." khớp từng chữ với note `rule` của `cam-hoa-la-gi`, recap section, và câu lời đọc "Cáo nói gọn: cảm hoá là “làm cho gần gũi hơn”." trong `video/projects/neu-cau-muon-co-mot-nguoi-ban/cam-hoa-la-gi/script.json`. Câu cũ thiếu chủ ngữ "cảm hoá" nên dễ hiểu sai đối tượng được nói gọn; câu mới rõ hơn và khớp sách: Cáo giải nghĩa "cảm hoá" là "làm cho gần gũi hơn".
- Bốn `guide`: `tapText` (visual `huong-dan-cham-cau`, chạm câu, tô vàng), `fillBlankBank` (`huong-dan-dien`), `match` (`huong-dan-noi`, chạm ô trái rồi ô phải hoặc kéo), `order` (`huong-dan-xep`) đều nằm trên màn mà note và visual dạy đúng kiểu bài đó.
- `rule: true` ở `tu-ghep-tu-lay`: note định nghĩa từ ghép, từ láy trùng từng chữ với recap section và các recap card `tu-ghep`, `tu-lay` (mỗi card lặp phần của mình).
- Chữ hiển thị khác không đổi; recap còn khớp note trong section.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. “Lúc chia tay” ở câu 4 và “Khi từ biệt” ở câu 5 nghe như cùng một lúc

- Vị trí: `$.overview.summary`, câu 4 (giữ từ vòng trước; chữ chưa đổi)
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: hai cụm gần nghĩa nên câu 4–5 đọc như cùng một cảnh. Không sai văn bản.
- Sửa: tuỳ tác giả; câu 4 mở bằng “Khi sắp chia tay, cáo buồn đến muốn khóc…”, rồi dựng lại lời đọc (`pnpm narration:build`).

### 2. Đề `ex.chon-tat-ca-loi-cao` gọi cả dòng có lời người kể là “lời thoại”

- Vị trí: `$.exercises[?(@.id=="neu-cau-muon-co-mot-nguoi-ban.ex.chon-tat-ca-loi-cao")].prompt[0].text` (giữ từ vòng trước)
- Nguồn: tr.23–24, `p23-24.png`
- Vấn đề: hình `loi-thoai-mau` dạy “Lời thoại: điều nhân vật nói”, tách khỏi lời người kể “con cáo trả lời”; mỗi lựa chọn lại gồm cả hai phần. Note và recap của section cũng dùng “lời thoại” cho cả dòng nên không sai, chỉ hơi lỏng.
- Sửa: tuỳ tác giả; “Chọn tất cả câu cáo nói.”

### 3. Hai id mới chưa ghi vào `ids.lock.json`

- Vị trí: `content:check` cảnh báo “2 id(s) not in ids.lock.json” (`ex.chon-tat-ca-loi-cao`, `ex.chon-tat-ca-loi-dan`)
- Nguồn: —
- Vấn đề: không chặn; id chưa khoá thì lần sửa sau có thể đổi hay bỏ id mà `content:check` không bắt (bỏ id đã khoá phải khai `retired`).
- Sửa: chạy `pnpm content:lock` rồi commit cùng `lesson.json`.
