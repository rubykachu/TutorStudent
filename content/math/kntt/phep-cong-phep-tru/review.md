# Review: Phép cộng và phép trừ số tự nhiên (`phep-cong-phep-tru`)

- Bài: `content/math/kntt/phep-cong-phep-tru/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: y-nghia-cong, y-nghia-tru, giao-hoan, ket-hop, cong-voi-0, ghep-tron, them-bot-cong, them-bot-tru, dat-tinh-cong, dat-tinh-tru, quan-he, tim-so-hang, tim-so-bi-tru, tim-so-tru, day-so, chu-so-cuoi, uoc-luong, toan-thoi-gian
- Nguồn đã đọc: `sources/math/phep-cong-phep-tru/` - đối chiếu nội dung vòng 2 (sbt-p14, p15, p16, p96, p97, p98); vòng này chỉ đổi chữ, số và hình, không thêm kiến thức mới
- `content:check`: 0 lỗi, 0 cảnh báo của bài
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-cong-phep-tru/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `7da2a61160b782d85606bab9e10a1d4cec9d8857640a9fd2a39a2bf8ee7220ea` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

### 1. `chon-kiem-tra`: nhiễu d "34 + 19 = 54" chỉ khác đáp án a "34 + 19 = 53" một chữ số cuối (LL-14)

- Vị trí: `$.exercises[*].options[3]` (`ex.chon-kiem-tra`)
- Nguồn: tr.14, tr.97
- Vấn đề: Vòng 2 sửa c và d; d mới cùng phép cộng với đáp án đúng, chỉ khác kết quả 53 và 54. Trẻ không cộng lại mà chỉ liếc cấu trúc "34 + 19" sẽ chọn nhầm d, hoặc thấy hai dòng giống nhau rồi đoán. Đây là bẫy một chữ số khó thấy theo checklist trục 3.
- Sửa: Đổi d thành phép có cấu trúc khác đáp án a và vẫn sai, vd "34 + 53 = 19". Giữ `check.relation: holds`.

## Nên sửa

### 1. Quy tắc "làm tròn số hạng nào gần tròn chục hơn" trái với câu luyện, hình gợi ý và lời giải của chính section

- Vị trí: `ex.tinh-them-bot-1` (57 + 26), `visual.hint-shift-47-25`, `visual.giai-shift-57-26`; câu quy tắc `sections[them-bot-cong].blocks[0]`
- Nguồn: tr.16 câu 1.31
- Vấn đề: 57 cách 60 là 3, 26 cách 30 là 4; 47 cách 50 là 3, 25 cách 30 là 5. Quy tắc mới bảo làm tròn số gần hơn (57, 47) nhưng đề, nấc 2 và nấc 3 đều làm tròn số xa hơn (lấy 4 của 57 cho 26; -5 và +5). Trẻ theo quy tắc rồi nhìn lời giải sẽ thấy hai cách mâu thuẫn. Hai ví dụ còn lại (46 + 38, 49 + 35, 52 + 27) khớp quy tắc.
- Sửa: Đổi số của `tinh-them-bot-1` thành cặp có số hạng thứ hai gần tròn chục hơn (vd 54 + 28 thì lấy 2 của số thứ nhất), đổi hai hình cho khớp; hoặc bỏ vế "làm tròn số hạng nào gần hơn" khỏi quy tắc.

### 2. Recap `dat-tinh-cong` và `dat-tinh-tru` bỏ câu "cộng/trừ từ hàng đơn vị sang bên trái"

- Vị trí: `sections[dat-tinh-cong].recap`, `cards[dat-tinh-cong].recap`; `sections[dat-tinh-tru].recap`, `cards[dat-tinh-tru].recap`
- Nguồn: tr.14
- Vấn đề: Recap mới ghép câu đầu của note thứ nhất với note nhớ; câu "Rồi cộng từ hàng đơn vị sang bên trái" (cộng) và "Trừ từ hàng đơn vị sang bên trái" (trừ) rơi mất, trong khi vòng 2 còn có ý này. Thứ tự làm là ý cốt lõi của đặt tính.
- Sửa: Thêm câu thứ tự vào recap (vd "Cộng từ hàng đơn vị sang bên trái") và ở phép trừ đánh `rule: true` cho note thứ nhất rồi đưa câu vào recap.

## Góp ý

### 1. Dữ kiện "lớp vào học lúc 7 giờ 30 phút" nằm ở `caption` xám của màn đầu `toan-thoi-gian`

- Vị trí: `sections[toan-thoi-gian].blocks[0].children[1].caption`
- Vấn đề: Màn sau nhắc lại 7 giờ 30 phút nên trẻ không kẹt, nhưng dữ kiện của bài mẫu trên màn đầu chỉ có ở chữ nhỏ.
- Sửa: Đưa câu đó trở lại `note`, hay cho vào hình.

### 2. Số gần trùng giữa các câu

- Vị trí: `ex.tim-gio-xuat-phat` và `ex.chon-gio-di` (cùng đáp án 7 giờ 45 phút); `ex.cot-tru-hang-chuc` (541 − 246) với ví dụ 532 − 247; `ex.dien-them-bot` (47 + 26) với `hint-shift-47-25` (47 + 25) (LL-07)
- Sửa: Đổi một trong mỗi cặp, vd `chon-gio-di` thành 8 giờ 15 phút, đường đi 35 phút.

### 3. Câu quy tắc mượn dài, và "chữ số cuối của kết quả" ở `dat-tinh-cong` dễ lẫn với section "chữ số cuối của tổng"

- Vị trí: `sections[dat-tinh-tru].blocks[1].children[0].text`; `sections[dat-tinh-cong].blocks[1].children[0].text`
- Vấn đề: Câu mượn có mệnh đề chen giữa, khó đọc với người học chậm (đúng về kiến thức; ví dụ 532 − 247 và hình chip "−1" đã giúp). "Kết quả" ở câu nhớ chỉ kết quả của hàng đó nhưng cùng từ với section sau.
- Sửa: Tách câu mượn thành hai câu ngắn; ghi "chữ số cuối của số vừa cộng ở hàng đó".
