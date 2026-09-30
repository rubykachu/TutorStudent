# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Vòng: 14 - chỉ phần đổi (`pnpm content:diff`, so với bản vòng 13), section: `bi-mat` (hàng xóm của card `bai-hoc`); câu kho ôn `ex.chon-tat-ca-loi-dan` (nấc 1 thêm `l56-4`); visual `ai-noi.tsx` (section `cao-xuat-hien`) thêm `mx-auto` cho khung ngoài
- Nguồn đã đọc: `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` - p25-26 (đối chiếu ở vòng 13; passage `l56-1..4` không đổi)
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường khi bài đổi sau review), 1 cảnh báo (2 id chưa có trong `ids.lock.json`)
- `lesson:walk`: không chạy; server cổng 3001 phục vụ bản cũ. Bản sửa chỉ thêm một phần tô ở nấc 1 của câu kho ôn (walk không chạy qua kho ôn) và thêm `mx-auto` (căn giữa khung `max-w-md`, không đổi chữ hay kích thước)
- Kết quả soát:
  - `ex.chon-tat-ca-loi-dan`: `hints.highlight` giờ tô `l56-2` (căn cứ của `khong-quen`) và `l56-4` (căn cứ của `trach-nhiem`), đúng cách sửa của vòng 13. Đây là câu `choice`: luật nấc 1 chỉ cấm tô `option` có id trong `answer`; tô câu trong `passage` của đề là "được", trẻ vẫn phải tự nối hai câu với hai lựa chọn. Hai phần tô là id có thật trong passage của đề. Trẻ chọn sót một ý nay được dẫn tới câu còn thiếu.
  - Cùng section `bi-mat` và card `bai-hoc`: `ex.cham-lap-lai-de-nho`, `ex.hong-khac-biet`, `ex.bi-mat-la-gi`, `ex.noi-nghia-tu`, `ex.dien-trach-nhiem` và recap không đổi; bản sửa chỉ chạm gợi ý của một câu nên không đổi đáp án, nhiễu hay hình của câu khác.
  - `ai-noi.tsx`: khung ngoài `mx-auto flex w-full max-w-md`, căn giữa danh sách lời thoại trên iPad ngang (Góp ý 3 của vòng 13 đã xong); chữ và logic đếm không đổi.
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 3 Góp ý (`pnpm content:hash neu-cau-muon-co-mot-nguoi-ban --root content --approve`)
- Bản đã review: `1009ae631078b18130b711311b6b8401746600bcdf366afc300cda06e743469c` (`pnpm content:diff` so với bản này)

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
