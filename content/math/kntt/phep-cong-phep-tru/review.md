# Review: Phép cộng và phép trừ số tự nhiên (`phep-cong-phep-tru`)

- Bài: `content/math/kntt/phep-cong-phep-tru/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff`), section: `toan-thoi-gian`, `them-bot-cong`, `dat-tinh-tru`
- Nguồn đã đọc: không có - `sources/math/phep-cong-phep-tru/` không có trên máy; phần đổi chỉ là số liệu của câu và dữ kiện mẫu đã có trong bài nên đối chiếu bằng tự giải và `note` của bài
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường vì bài vừa sửa), 0 cảnh báo
- `lesson:walk`: không chạy (điều phối không chạy ở vòng này); đã xem ảnh `phep-cong-phep-tru.visual.cot-tru-hang-chuc-651-278` bản iPad và điện thoại
- Kết luận: 0 Nghiêm trọng, 0 Nên sửa, 4 Góp ý. Đạt; chờ điều phối chạy `pnpm content:hash phep-cong-phep-tru --root content --approve`.

Đã soát (tự giải, độc lập với diff):
- `toan-thoi-gian` màn đầu: dữ kiện "Lớp vào học lúc 7 giờ 30 phút" nay là `note` trong cùng group, kèm "Ta tìm giờ Nam ra khỏi nhà", nên không còn nằm trong chữ xám; caption chỉ còn dữ kiện đường đi (8 + 22 + 2 + 8 = 40). Màn sau (7 giờ 30 = 6 giờ 90, 90 - 40 = 50, ra khỏi nhà 6 giờ 50) và recap vẫn khớp. Group có 3 khối, không vượt giới hạn.
- `chon-gio-di`: 8 giờ 15 = 7 giờ 75; 75 - 35 = 40, tức 7 giờ 40, cộng lại 7 giờ 40 + 35 phút = 8 giờ 15. Nhiễu: 110 = 75 + 35 (cộng thay vì trừ), 15 và 50 đều không phải 75 - 35 (50 = 90 - 40 của màn mẫu; 15 = 50 - 35); chỉ đáp án `a` (40) đúng, khớp `check.expr` 75-35. Không còn cùng đáp án 7 giờ 45 với `tim-gio-xuat-phat` (80 - 35 = 45).
- `dien-them-bot`: 64 + 29 = 93, 93 - 60 = 33; đáp án 33 khớp `check.expr`. Lấy 4 của 64 cho 29 được 60 và 33. Không còn gần hình gợi ý 47 + 25 (`hint-shift-47-25`), 57 + 26, 49 + 35.
- `cot-tru-hang-chuc`: 651 - 278. Hàng đơn vị đã giải sẵn: 11 - 8 = 3. Hàng chục: 5 - 1 = 4, 4 nhỏ hơn 7 nên mượn, 14 - 7 = 7, số mượn 1; khớp `params` `digit: 7`, `carry: 1` và khớp `column: 1` của `column-try` trong catalog. Ảnh iPad và điện thoại: cột hàng chục sáng, hiện "-1" và "+10" ở hàng đơn vị, "5 - 1 = 4"; ô kết quả hàng chục là "?", không hiện 7; chữ không chồng, không cắt. Đề "hàng chục đã cho mượn nên bớt đi 1" khớp hình. Không còn chỗ nào nhắc `cot-tru-hang-chuc-541-246` trong `src`, `content`, `video`.
- Số mới không trùng ví dụ và hình của section: 651 - 278 khác 532 - 247, 586 - 243, 361 - 174, 452 - 187, 725 - 48, 913 - 465, 820 - 345; `chon-gio-di` (35 phút) khác đường đi của `tim-gio-xuat-phat` (10 + 25), mẫu (40) và `tinh-tong-thoi-gian-kt`.
- Mục khác cùng ba section, không bị bản sửa làm hỏng: recap của `them-bot-cong`, `dat-tinh-tru`, `toan-thoi-gian` vẫn khớp `note` quy tắc (từng chữ); `hint-gio-70-25` và `giai-gio-80-35` thuộc `tim-gio-xuat-phat`, không đổi nên vẫn khớp; `chon-them-bot` (29 + 46 → 30 + 45) vẫn chỉ một đáp án đúng. Nấc 1 của các câu đổi tô phần của đề, không lộ đáp án.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Phụ đề `ghep-tron` "Bạn cú mua ba món hàng." (rút lại, không phải lỗi)

- Vòng này từng đổi "cú" thành "cứ". "Bạn cú" là tên linh vật cú dùng trong mọi video ("Bạn cú có tập hợp A."), nên câu gốc đúng; đã trả lại "Bạn cú" và dựng lại video.

## Góp ý

### 1. Câu quy tắc mượn dài, và "chữ số cuối của kết quả" ở `dat-tinh-cong` dễ lẫn với section "chữ số cuối của tổng"

- Vị trí: `sections[dat-tinh-tru].blocks[1].children[0].text`; `sections[dat-tinh-cong].blocks[1].children[0].text`
- Vấn đề: Câu mượn có mệnh đề chen giữa, khó đọc với người học chậm (đúng về kiến thức). "Kết quả" ở câu nhớ chỉ kết quả của hàng đó nhưng cùng từ với section sau.
- Sửa: Tách câu mượn thành hai câu ngắn; ghi "chữ số cuối của số vừa cộng ở hàng đó". Còn mở vì là câu `rule` nằm trong kịch bản video, sửa phải dựng lại video.

### 2. `chon-gio-di` có đáp án 40 trùng nhiều chỗ trong cùng card (LL-07)

- Vị trí: `ex.chon-gio-di` (đáp án 7 giờ 40 phút); `ex.tim-gio-hai-buoc` (đáp án 6 giờ 40 phút), `ex.tinh-tong-thoi-gian-2` (40 phút), mẫu `lo-trinh-mau` (cả đường 40 phút); cả bốn cùng card `toan-thoi-gian`
- Vấn đề: Con số 40 lặp ở nhiều câu, nên bé chậm có thể chọn "40" vì quen mắt. Nhiễu 50 chính là đáp án của màn mẫu (6 giờ 50) nên vẫn có ích; không phải lỗi đáp án.
- Sửa: Đổi đường đi hay giờ vào học để đáp án khác 40, vd đường đi 28 phút, đáp án 47 (nhiễu 103, 57, 13).

### 3. `dien-them-bot` (64 + 29) gần `chon-them-bot` (29 + 46) trong cùng section (LL-07)

- Vị trí: `ex.dien-them-bot`, `ex.chon-them-bot`
- Vấn đề: Chung số hạng 29, và 64 là 46 đảo chữ số. Đáp án khác nhau (93 và 75) nên không lộ, chỉ dễ nhớ lẫn.
- Sửa: Đổi một câu, vd 58 + 37 = 60 + ? (đáp án 35).

### 4. `cot-tru-hang-chuc` có đáp án (7, mượn 1) giống `cot-tru-kiem-tra` và chữ số 7 đã hiện trên hình

- Vị trí: `ex.cot-tru-hang-chuc` (`params.digit: 7, carry: 1`); `ex.cot-tru-kiem-tra` (725 - 48, `digit: 7, carry: 1`)
- Vấn đề: Hai câu cùng section có chung cặp đáp án, và chữ số 7 của số trừ (278) nằm ngay cột đang làm nên bé có thể bấm 7 mà không tính 14 - 7. Hình gợi ý "-1" đã nêu việc phải làm, nên không chặn học.
- Sửa: Chọn số cho chữ số viết khác 7 và khác chữ số của số trừ ở hàng chục, vd 642 - 275 (hàng chục: 4 - 1 = 3, 13 - 7 = 6, số mượn 1).
