# Review: Phép cộng và phép trừ số tự nhiên (`phep-cong-phep-tru`)

- Bài: `content/math/kntt/phep-cong-phep-tru/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff`), section: `toan-thoi-gian`, `them-bot-cong`, `dat-tinh-tru`
- Nguồn đã đọc: không có - `sources/math/phep-cong-phep-tru/` không có trên máy; phần đổi chỉ là số liệu của câu và dữ kiện mẫu đã có trong bài nên đối chiếu bằng tự giải và `note` của bài
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường vì bài vừa sửa), 0 cảnh báo
- `lesson:walk`: không chạy (điều phối không chạy ở vòng này); đã xem ảnh `phep-cong-phep-tru.visual.cot-tru-hang-chuc-651-278` bản iPad và điện thoại
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 2 Góp ý
- Bản đã review: `1415b222b53e1a7879dc7512dc3d2f3cc5a0c36f9ccd63b90c38dbfe8b604fc2` (`pnpm content:diff` so với bản này)

Đã soát (tự giải, độc lập với diff):
- `toan-thoi-gian` màn đầu: dữ kiện "Lớp vào học lúc 7 giờ 30 phút" nay là `note` trong cùng group, kèm "Ta tìm giờ Nam ra khỏi nhà"; caption chỉ còn dữ kiện đường đi (8 + 22 + 2 + 8 = 40). Màn sau (7 giờ 30 = 6 giờ 90, 90 - 40 = 50, ra khỏi nhà 6 giờ 50) và recap vẫn khớp. Group có 3 khối, không vượt giới hạn.
- `chon-gio-di`: 8 giờ 15 = 7 giờ 75; 75 - 28 = 47, tức 7 giờ 47, cộng lại 7 giờ 47 + 28 phút = 8 giờ 15. Nhiễu: 103 = 75 + 28 (cộng thay vì trừ), 13 và 57 đều khác 75 - 28 (57 = 75 - 18, 13 = 75 - 62); chỉ đáp án `a` (47) đúng, khớp `check.expr` 75-28. Số 47 và 28 không có ở câu, mẫu hay hình nào của card `toan-thoi-gian` (mẫu 40 và 50, `tim-gio-xuat-phat` 45, `tim-gio-hai-buoc` 40, `tinh-tong-thoi-gian-2` 40); đáp án không còn trùng 40 hay 45.
- `dien-them-bot`: 58 + 37 = 95, 95 - 60 = 35; đáp án 35 khớp `check.expr`. Lấy 2 của 37 cho 58 được 60 và 35. Số hạng 58, 37 không trùng hình gợi ý 47 + 25, 57 + 26, mẫu 46 + 38, `chon-them-bot` 29 + 46, `chon-tong-them-bot` 45 + 18.
- `cot-tru-hang-chuc`: 642 - 275. Hàng đơn vị đã giải sẵn: 12 - 5 = 7. Hàng chục: 4 - 1 = 3, 3 nhỏ hơn 7 nên mượn, 13 - 7 = 6, số mượn 1; khớp `params` `digit: 6`, `carry: 1`, `column: 1` của `column-try` trong catalog. Ảnh iPad và điện thoại: cột hàng chục sáng, "-1" và "+10", "4 - 1 = 3"; ô kết quả hàng chục là "?", không hiện 6; chữ không chồng, không cắt. Đề "hàng chục đã cho mượn nên bớt đi 1" khớp hình. Đáp án (6, mượn 1) khác `cot-tru-kiem-tra` (7, mượn 1); 642 - 275 không trùng 532 - 247, 586 - 243, 361 - 174, 452 - 187, 725 - 48, 913 - 465, 820 - 345. Không còn nhắc id `541-246` hay `651-278` ở đâu.
- Mục khác cùng ba section, không bị bản sửa làm hỏng: recap của `them-bot-cong`, `dat-tinh-tru`, `toan-thoi-gian` vẫn khớp `note` quy tắc từng chữ; `hint-gio-70-25` và `giai-gio-80-35` thuộc `tim-gio-xuat-phat`, không đổi nên vẫn khớp; `chon-them-bot` vẫn chỉ một đáp án đúng. Nấc 1 của các câu đổi tô phần của đề, không lộ đáp án.

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

### 2. Đáp án 35 của `dien-them-bot` trùng số hạng 35 của `tinh-them-bot-2` (LL-07)

- Vị trí: `ex.dien-them-bot` (58 + 37 = 60 + ?, đáp án 35); `ex.tinh-them-bot-2` (49 + 35), cùng card `them-bot-cong`
- Vấn đề: Số 35 xuất hiện ở hai câu cùng card (một là số hạng, một là đáp án); không lộ đáp án, chỉ dễ nhớ lẫn.
- Sửa: Nếu muốn tránh hẳn, đổi thành 68 + 24 = 70 + ? (đáp án 22).
