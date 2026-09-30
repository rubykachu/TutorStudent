# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Vòng: 13 - chỉ phần đổi (`pnpm content:diff`, so với bản vòng 12), section: `cao-xuat-hien` (màn `ai-noi` thành group 2 note + visual; visual `ai-noi.tsx` thêm dòng "Đã xem n/5", nhãn "Chạm để xem ai nói", câu tổng kết), `bi-mat` (hàng xóm của card `bai-hoc`); hai câu kho ôn mới `ex.chon-tat-ca-loi-cao` (card `ai-noi`), `ex.chon-tat-ca-loi-dan` (card `bai-hoc`)
- Nguồn đã đọc: `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` - p23-24, p25-26; `source-passage.txt` (đối chiếu từng chữ các câu trích)
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường khi bài đổi sau review), 1 cảnh báo (2 id chưa có trong `ids.lock.json`)
- `lesson:walk`: server cổng 3001 phục vụ bản cũ (chưa emit bản mới), walk trên đó 0 FAIL nhưng không có màn mới. Walk lại bản `lesson.json` hiện tại trên một bản sao của repo (server riêng cổng 3100, không đụng 3001): 6 FAIL, 0 cảnh báo, đều do bố cục app (xem Góp ý 2); ảnh bản mới trong `.shots/walk/neu-cau-muon-co-mot-nguoi-ban/` của bản sao, đã xem `007-s1-05-block.png` ở phone, ipad, ipad-landscape
- Kết quả soát:
  - Màn `ai-noi` (phone, iPad): hai note đứng trên visual, mỗi note có nút "Nghe đọc", chữ không chồng, không cắt, cột đủ rộng. "Chạm vào từng lời thoại để biết ai nói câu đó." nói rõ việc phải làm; dùng đúng từ "lời thoại" như note và recap của section (bỏ từ "bóng nói" của caption cũ). Không có "…" cắt chữ ngoài câu trích (dấu "…" trong "Mình ở đây, dưới cây táo…" là của văn bản).
  - Visual: 5 lời thoại gán đúng người nói theo tr.21 (cáo: "Mình ở đây…", "Mình là cáo.", "Mình chưa được cảm hoá."; hoàng tử bé: "Bạn là ai?", "Lại đây chơi với mình đi."), nên câu tổng kết "Đã xem đủ 5 lời thoại: cáo nói 3 câu, hoàng tử bé nói 2 câu." đúng (đọc từ mã; walk không chạm hết 5 lời nên không có ảnh trạng thái này).
  - `ex.chon-tat-ca-loi-cao`: đề ghi "Chọn tất cả". Bốn lựa chọn trích nguyên văn tr.23–24; tập đúng duy nhất {`tat-nhien`, `kien-nhan`} theo lời người kể “con cáo nói”, “con cáo trả lời”; hai nhiễu là lời hoàng tử bé cùng đoạn, hợp lý. Nấc 2 `loi-thoai-mau` dùng câu khác ("Mình là cáo"), không lộ đáp án.
  - `ex.chon-tat-ca-loi-dan`: đề ghi "Chọn tất cả". Passage `l56-1..4` khớp từng chữ tr.25. Căn cứ: `khong-quen` ← `l56-1`, `l56-2`; `trach-nhiem` ← `l56-4`. Hai nhiễu không có trong lời dặn. Không phủ định kép. Không trùng hình với `ex.dien-trach-nhiem` (câu đó hỏi `l56-3`).
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 1 Nên sửa, 5 Góp ý (`pnpm content:hash neu-cau-muon-co-mot-nguoi-ban --root content --approve`)
- Bản đã review: `0582a0674472c23e8c2c01f00adb5f106bf8f4a92788dbfed1f5c7014314e12d` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Nấc 1 của câu chọn nhiều chỉ tô một trong hai câu căn cứ

- Vị trí: `$.exercises[?(@.id=="neu-cau-muon-co-mot-nguoi-ban.ex.chon-tat-ca-loi-dan")].hints.highlight` (`ex.chon-tat-ca-loi-dan`)
- Nguồn: tr.25, `p25-26.png`
- Vấn đề: đáp án có hai mục, căn cứ ở `l56-2` (không được quên) và `l56-4` (trách nhiệm với bông hồng). Highlight chỉ tô `l56-2`: trẻ đã chọn `khong-quen` mà sót `trach-nhiem` (lỗi hay gặp nhất ở câu chọn nhiều) được tô lại đúng câu mình đã tìm ra, không được dẫn tới câu còn thiếu.
- Sửa: `highlight` gồm cả hai phần: `[{ "target": "part", "id": "l56-2" }, { "target": "part", "id": "l56-4" }]`.

## Góp ý

### 1. “Lúc chia tay” ở câu 4 và “Khi từ biệt” ở câu 5 nghe như cùng một lúc

- Vị trí: `$.overview.summary`, câu 4 (giữ từ vòng 11; chữ chưa đổi)
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: hai cụm gần nghĩa nên câu 4–5 đọc như cùng một cảnh. Không sai văn bản.
- Sửa: tuỳ tác giả; câu 4 mở bằng “Khi sắp chia tay, cáo buồn đến muốn khóc…”, rồi dựng lại lời đọc (`pnpm narration:build`).

### 2. Walk bản mới: 6 FAIL do bố cục app (báo người làm app)

- Vị trí: phone `s2-02-block`, `s5-01-block`, `s8-01-block`; ipad-landscape `s1-04-block`, `s1-05-block`, `s4-01-block`
- Nguồn: —
- Vấn đề: năm FAIL là chữ của màn dài cuộn xuống dưới thanh "Tiếp" (overlap), ở cả những section không đổi; walk cùng các màn đó trên server 3001 báo 0 FAIL, nên đây là hành vi của app hay môi trường, không phải nội dung. FAIL `s1-05-block` ở ipad-landscape: màn `ai-noi` cao hơn (thêm hai note) nên lời thoại thứ 5 nằm dưới thanh dưới khi chưa cuộn; màn cuộn được (ảnh phone cuộn tới hết thẻ), trẻ vẫn chạm được.
- Sửa: người làm app xem lại khoảng đệm dưới vùng cuộn và cách walk đo phần tử dưới thanh dưới; nội dung không cần đổi.

### 3. Visual `ai-noi` lệch trái trên iPad ngang

- Vị trí: `src/visuals/literature/neu-cau-muon-co-mot-nguoi-ban/ai-noi.tsx` (khung `max-w-md`)
- Nguồn: —
- Vấn đề: ở ipad-landscape hai note căn giữa, còn danh sách lời thoại rộng `max-w-md` dính lề trái, trông lệch. Chữ vẫn đọc tốt.
- Sửa: thêm `mx-auto` cho khung ngoài của visual.

### 4. Đề `ex.chon-tat-ca-loi-cao` gọi cả dòng có lời người kể là “lời thoại”

- Vị trí: `$.exercises[?(@.id=="neu-cau-muon-co-mot-nguoi-ban.ex.chon-tat-ca-loi-cao")].prompt[0].text`
- Nguồn: tr.23–24, `p23-24.png`
- Vấn đề: hình `loi-thoai-mau` dạy “Lời thoại: điều nhân vật nói”, tách khỏi lời người kể “con cáo trả lời”; mỗi lựa chọn lại gồm cả hai phần. Note và recap của section cũng dùng “lời thoại” cho cả dòng nên không sai, chỉ hơi lỏng.
- Sửa: tuỳ tác giả; “Chọn tất cả câu cáo nói.”

### 5. Hai id mới chưa ghi vào `ids.lock.json`

- Vị trí: `content:check` cảnh báo “2 id(s) not in ids.lock.json” (hai exercise mới)
- Nguồn: —
- Vấn đề: không chặn; id chưa khoá thì lần sửa sau có thể đổi hay bỏ id mà `content:check` không bắt (bỏ id đã khoá phải khai `retired`).
- Sửa: chạy `pnpm content:lock` rồi commit cùng `lesson.json`.
