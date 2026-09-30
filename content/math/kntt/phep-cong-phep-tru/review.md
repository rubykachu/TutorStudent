# Review: Phép cộng và phép trừ số tự nhiên (`phep-cong-phep-tru`)

- Bài: `content/math/kntt/phep-cong-phep-tru/lesson.json`
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`), section: them-bot-cong, dat-tinh-cong, quan-he
- Nguồn đã đọc: `sources/math/phep-cong-phep-tru/` - đối chiếu nội dung vòng trước (sbt-p14, p15, p16, p96, p97); vòng này chỉ đổi chữ quy tắc, recap và một nhiễu, không thêm kiến thức mới
- `content:check`: 0 lỗi của bài
- `lesson:walk`: không chạy lại ở vòng này (chỉ đổi chữ, không đổi bố cục); ảnh vòng trước trong `.shots/walk/phep-cong-phep-tru/`
- Kết luận: Đã ghi reviewedHash, chờ quản trị viên đặt published (0 lỗi Nghiêm trọng; điều phối chạy `--approve`)
- Bản đã review: `ba8c88e269b09e75e1a90d47e0925a4efaa8f8dea72124a725155bb5cb4a3cb2` (`pnpm content:diff` so với bản này)

Đã soát: quy tắc them-bot-cong (nay khớp `tinh-them-bot-1`, hai hình gợi ý/lời giải và recap, hết mâu thuẫn "gần tròn chục hơn"); recap section và card dat-tinh-cong khớp nhau và khớp hai câu quy tắc đứng trước (thứ tự cộng, nhớ 1); recap them-bot-cong, quan-he khớp note. `ex.chon-kiem-tra` tự giải 53 − 19 = 34: a (34 + 19 = 53) đúng; b (53 + 19 = 72), c (53 + 34 = 87, ghi 97), d (34 + 53 = 87, ghi 19) đều sai; d khác cấu trúc a nên hết bẫy một chữ số. `ex.chon-them-bot` (29 + 46 = 75): chỉ a đúng. Số không trùng trong ba section.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. Dữ kiện "lớp vào học lúc 7 giờ 30 phút" nằm ở `caption` xám của màn đầu `toan-thoi-gian`

- Vị trí: `sections[toan-thoi-gian].blocks[0].children[1].caption`
- Vấn đề: Màn sau nhắc lại 7 giờ 30 phút nên trẻ không kẹt, nhưng dữ kiện của bài mẫu trên màn đầu chỉ có ở chữ nhỏ.
- Sửa: Đưa câu đó trở lại `note`, hay cho vào hình.

### 2. Số gần trùng giữa các câu (LL-07)

- Vị trí: `ex.tim-gio-xuat-phat` và `ex.chon-gio-di` (cùng đáp án 7 giờ 45 phút); `ex.cot-tru-hang-chuc` (541 − 246) với ví dụ 532 − 247; `ex.dien-them-bot` (47 + 26) với `hint-shift-47-25` (47 + 25)
- Sửa: Đổi một trong mỗi cặp, vd `chon-gio-di` thành 8 giờ 15 phút, đường đi 35 phút.

### 3. Câu quy tắc mượn dài, và "chữ số cuối của kết quả" ở `dat-tinh-cong` dễ lẫn với section "chữ số cuối của tổng"

- Vị trí: `sections[dat-tinh-tru].blocks[1].children[0].text`; `sections[dat-tinh-cong].blocks[1].children[0].text`
- Vấn đề: Câu mượn có mệnh đề chen giữa, khó đọc với người học chậm (đúng về kiến thức). "Kết quả" ở câu nhớ chỉ kết quả của hàng đó nhưng cùng từ với section sau.
- Sửa: Tách câu mượn thành hai câu ngắn; ghi "chữ số cuối của số vừa cộng ở hàng đó".
