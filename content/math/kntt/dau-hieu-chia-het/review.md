# Review: Dấu hiệu chia hết (`dau-hieu-chia-het`)

- Bài: `content/math/kntt/dau-hieu-chia-het/lesson.json`
- Vòng: 8 - chỉ phần đổi (`pnpm content:diff`), section: `dau-hieu-chia-het.section.tich-chia-het` (câu `hop-banh-tui`: 7 hộp, đáp án 14 đổi thành 5 hộp, đáp án 10; hình lời giải `giai-banh-56` đổi thành `giai-banh-40`)
- Nguồn đã đọc: `sources/math/dau-hieu-chia-het/` - sbt-p33.png (có trên máy; trang chỉ có kiến thức cần nhớ "trong một tích, nếu có một số chia hết cho m thì tích chia hết cho m", không có bài hộp bánh nên đề không chép sách)
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường), 0 cảnh báo
- `lesson:walk`: không chạy (điều phối không chạy vòng này; phần đổi là chữ, số trong một câu `numeric` và hình `lines` đổi số, đã đọc `lesson.json` và `catalog.ts`)
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 2 Góp ý
- Bản đã review: `5e47c2fa81f7197e9bd5943d5ba98b9d23ff8f370d40b656ffc6fbc7ff467391` (`pnpm content:diff` so với bản này)

## Đã soát

- Tự giải `hop-banh-tui`: 5 · 8 = 40 cái bánh; 40 : 4 = 10 túi (hoặc mỗi hộp 8 : 4 = 2 túi, 5 hộp được 2 · 5 = 10). Đáp án 10 đúng; `check.expr` `(8:4)·5` ra 10, khớp `answer.value`.
- Màn đề chỉ có "5 hộp, mỗi hộp 8 cái, mỗi túi 4 cái, bao nhiêu túi"; không có số 10, 2 hay 40. Nấc 1 là `highlight` `block` 0 trên đề một câu (được phép), không lộ đáp án; câu không có `hintVisualId`.
- `explain`: "Số bánh là 5 · 8 ... mỗi hộp xếp vừa 2 túi. Có 5 hộp thì dùng 5 · 2 = 10 túi" và `tex` `5 · 8 = 40, 8 : 4 = 2, 5 · 2 = 10`: đúng toán, 2 câu, khớp đề, không còn số 7 hay 14 nào sót (đã tìm trong đề, `explain`, `check`, hình).
- Hình lời giải `giai-banh-40` (`catalog.ts`): dòng 1 "8 : 4 = 2, Mỗi hộp xếp được 2 túi", dòng 2 "2 · 5 = 10, 5 hộp xếp được 10 túi": khớp đề và `explain`. Hình là nấc 3 nên được hiện kết quả. Id `giai-banh-56` không còn dùng ở bài.
- Không trùng với phần còn lại của section `tich-chia-het` (ví dụ `hop-6-7`: 6 cái, 7 hộp, 3 túi, tích 42; `tich-12-7`; `chon-tich-5`; recap `tom-tat-tich-10-3`; câu `chon-tich-3`, `chon-tich-2`, `chon-nhieu-tich-5`, `dien-tich-7`): khung hộp bánh, túi giữ nguyên nhưng cả ba số (hộp, bánh mỗi hộp, bánh mỗi túi) khác ví dụ, số 7 không còn lặp. Bản sửa không làm hỏng mục nào của section: recap vẫn khớp note quy tắc, `check`, `practice` không đổi, nhiễu không đổi.
- Số 40 còn ở `tong-40-15` (visual), `tien-but-40`, `chia-3-5-45` (nhiễu), `diem-nhieu-12` (nhiễu), đều ở section khác và đều cùng một sự thật (40 chia hết cho 5, không chia hết cho 3): không gây lẫn. Số 40 chỉ xuất hiện trong `explain` của câu này, không trên màn đề.
- Từ ngữ lớp 6: không phủ định kép, không từ khó mới; "xếp hết vào các túi" rõ, không hai cách hiểu.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. Tích `5 · 8` của câu mới trùng nhiễu `5 · 8` của `chon-tich-3` (LL-07)

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.hop-banh-tui")].explain` và `$.exercises[?(@.id=="dau-hieu-chia-het.ex.chon-tich-3")].options[1]` (cùng section `tich-chia-het`)
- Nguồn: —
- Vấn đề: `explain` của `hop-banh-tui` viết "5 · 8 = 40, chia hết cho 4", còn `chon-tich-3` (hỏi chia hết cho 3) dùng chính `5 · 8` làm đáp án sai. Không sai kiến thức (40 không chia hết cho 3) và trẻ chỉ thấy tích này ở `explain` sau khi làm xong, nên chỉ ghi Góp ý; chỉ lưu ý bé chậm có thể nhớ "5 · 8 chia hết" rồi chọn nhầm.
- Sửa: nếu muốn sạch trùng, đổi nhiễu `5 · 8` của `chon-tich-3` sang tích khác không chia hết cho 3 (vd `4 · 5`), hoặc để nguyên.

### 2. Đáp án 10 trùng thừa số 10 ở recap của card (LL-07)

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.hop-banh-tui")].answer.value` và hình `tom-tat-tich-10-3` (recap section và card `tich-chia-het`)
- Nguồn: —
- Vấn đề: recap của card viết "10 · 3 chia hết cho 5", còn đáp án của câu luyện card này là 10. Hai số không cùng nghĩa (thừa số ở recap, số túi ở câu), và recap không hiện trên màn đề nên không lộ đáp án; chỉ nhắc để tác giả biết có số trùng.
- Sửa: tuỳ tác giả; nếu đổi thì chọn số hộp khác 5 mà đáp án không trùng 10, 12, 7, 6, 3, 42 của section (vd 3 hộp thì đáp án 6, nhưng 6 trùng ví dụ `hop-6-7`), nên giữ nguyên là hợp lý.
