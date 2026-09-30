# Review: Phép cộng và phép trừ số tự nhiên (`phep-cong-phep-tru`)

- Bài: `content/math/kntt/phep-cong-phep-tru/lesson.json`
- Vòng: 5 - chỉ phần đổi (`pnpm content:diff`): lời đọc giới thiệu, 3 video (`ghep-tron`, `dat-tinh-tru`, `tim-so-hang`) và khối video đầu 3 section
- Nguồn đã đọc: không có trang SGK mới; đối chiếu câu quy tắc với `note` của bài và kịch bản `video/projects/phep-cong-phep-tru/*/script.json`
- `content:check`: 0 lỗi của bài
- `lesson:walk`: 0 FAIL (chạy sau khi duyệt)
- Kết luận: Đã ghi reviewedHash (0 lỗi Nghiêm trọng)
- Bản đã review: `6f20fc9922347e381090955650b76cd8fa686ee295a29efed686071029505639` (`pnpm content:diff` so với bản này)

Đã soát: mọi câu của 3 kịch bản và lời đọc giới thiệu. Toán đúng: 34 + 66 = 100, 100 + 268 = 368 (34 + 268 + 66), 45 + 55 = 100, 100 + 27 = 127; 532 - 247 = 285 (2 thành 12 - 7 = 5, chục còn 2 mượn thành 12 - 4 = 8, trăm còn 4 - 2 = 2) và 285 + 247 = 532; 82 - 35 = 47, 47 + 35 = 82, 60 - 18 = 42. Câu đầu có chữ "bạn", một giọng (Mỹ Duyên) cho cả bài, `pnpm video:check` đạt. Câu `rule` khớp `note`; hình không hiện kết quả trước khi được đọc (368, 285, 47, 42 hiện sau lời). Lời đọc giới thiệu khớp `hook`, `summary`, `goals`, `whyItMatters`.

Âm thanh: các câu Whisper khớp dưới 97% (giá "nghìn đồng", "ba" so với "3", "60-18") đều là cách Whisper viết số, không phải đọc sai; nghe lại bằng Whisper của pipeline cho cùng kết quả ("35.000 đồng" = "35 nghìn đồng"). Bộ chuẩn hoá `video/lib/text.ts` nay đọc "35.000" thành "35 nghìn" và "60-18" thành "60 trừ 18" (test `reads Whisper's written thousands and minus as spoken words`); chữ thật sai không bị che vì các chữ khác vẫn so từng âm.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Phụ đề `ghep-tron` viết "cú" thay vì "cứ" (đã sửa)

- Vị trí: `video/projects/phep-cong-phep-tru/ghep-tron/script.json`, câu "Bạn cứ mua ba món hàng."
- Vấn đề: phụ đề hiện sai chính tả "Bạn cú mua ba món hàng."
- Sửa: đổi thành "cứ", dựng lại video; Whisper nghe "Bạn cứ mua 3 món hàng." khớp 100%.

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
