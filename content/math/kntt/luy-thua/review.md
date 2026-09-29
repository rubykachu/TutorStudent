# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Nguồn đã đọc: `sources/math/luy-thua/` - p22, p23-24
- `content:check`: 1 lỗi, 0 cảnh báo của bài (`$.reviewedHash: Lesson changed after its review`: cổng review mà lần review này gỡ, không tính là phát hiện)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/luy-thua/` (chạy với `WALK_BASE_URL=http://localhost:3001` sau `CONTENT_INCLUDE_FIXTURE=1 pnpm content:emit`)
- Kết luận: Đạt: 0 lỗi Nghiêm trọng; đã chạy `content:hash luy-thua --approve` (reviewedHash ghi, status published)

Visual của màn quy tắc và recap (`src/visuals/math/luy-thua/rule-examples.tsx`, `parts.tsx`, `tach-so.tsx`) chỉ còn hình, phép tính và nhãn ngắn ("Cơ số", "Số mũ", "n thừa số", "Bấm", "một chục", "6 bình phương", "(với a ≠ 0, m ≥ n)"); không còn câu bài học nào trong visual. Mọi câu trong `note`/`caption` đúng kiến thức, khớp tr.22-24 và khớp hình ví dụ đi kèm.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Phần "Luỹ thừa là gì?" không có câu nào nói cơ số, số mũ là gì

- Vị trí: `$.sections[0].blocks[2].children` (nhóm định nghĩa) và `$.sections[0].recap.caption` (`luy-thua.section.luy-thua-la-gi`)
- Nguồn: tr.22, `p22.png` ("a là cơ số, n là số mũ")
- Vấn đề: tên hai phần chỉ có ở nhãn mũi tên trong hình `dinh-nghia` và `tom-tat-luy-thua`; chữ thân bài của section và recap không nhắc. Trong khi đó card `luy-thua.card.co-so-so-mu` có câu "Cơ số là thừa số được nhân lặp lại, số mũ là số thừa số." mà section không dạy bằng lời, và câu kiểm tra `cham-co-so` hỏi ngay sau section. Section, recap và card lệch nhau.
- Sửa: thêm vào note thứ hai của nhóm định nghĩa (`$.sections[0].blocks[2].children[2].text`) câu "Trong aⁿ, a là cơ số (thừa số được nhân lặp lại), n là số mũ (số thừa số)."; nối vào recap caption: "Trong 2⁵, 2 là cơ số, 5 là số mũ."

### 2. Câu cách tính giá trị luỹ thừa thiếu chủ đề, và lệch với card

- Vị trí: `$.sections[1].blocks[2].children[0].text` (`luy-thua.section.binh-phuong-lap-phuong`) và `$.cards[5].recap.caption` (`luy-thua.card.tinh-gia-tri`)
- Nguồn: tr.23, `p23-24.png` (Ví dụ 1b)
- Vấn đề: note mở đầu bằng "Nhân hai thừa số đầu, rồi…" mà không nói đây là cách tính giá trị luỹ thừa; card lại viết "Tính luỹ thừa: nhân lần lượt từng thừa số, ghi kết quả từng bước." Hai cách nói cho một quy tắc, và "Tính luỹ thừa" khác chữ "Tính giá trị của luỹ thừa" trong đề các bài tập (`tinh-3-mu-3`, `tinh-5-mu-3`).
- Sửa: dùng một câu cho cả hai chỗ, ví dụ "Tính giá trị luỹ thừa: nhân hai thừa số đầu, rồi lấy kết quả nhân tiếp với cơ số. Ghi từng kết quả ra nháp."

### 3. Recap của phần "Bình phương và lập phương" bỏ sót cách tính giá trị

- Vị trí: `$.sections[1].recap.caption` (`luy-thua.section.binh-phuong-lap-phuong`)
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: section dạy hai ý (cách đọc a², a³; cách tính giá trị từng bước) và ba câu luyện tập (`tinh-3-mu-3`, `lap-phuong-4`, `xep-gia-tri`) dùng ý thứ hai, nhưng recap chỉ nhắc cách đọc.
- Sửa: nối vào caption câu giống mục 2, ví dụ "Tính giá trị luỹ thừa: nhân lần lượt từng thừa số, ghi từng kết quả ra nháp."; tuỳ chọn thêm một dòng tính trong hình recap.

## Góp ý

### 1. "Số không ghi số mũ thì có số mũ là 1" nói hơi lỏng

- Vị trí: `$.sections[2].blocks[3].children[0].text`, `$.sections[2].recap.caption`, `$.cards[7].recap.caption`
- Nguồn: tr.23 (Chú ý a¹ = a)
- Vấn đề: một số tự nhiên không "có" số mũ; trẻ có thể hiểu nhầm là mọi số đứng một mình đều cộng thêm 1 vào số mũ (như 5 · 5 · 5 · 25).
- Sửa: "Một số không ghi số mũ thì viết được thành luỹ thừa của chính nó với số mũ 1, như 5 = 5¹." (sửa đồng loạt ba chỗ).

### 2. Hàng đơn vị và hàng chục trong hình tách số không khớp chữ "luỹ thừa của 10"

- Vị trí: `src/visuals/math/luy-thua/tach-so.tsx:24` và note `$.sections[4].blocks[2].children[0].text`
- Vấn đề: note nói "nhân mỗi chữ số với luỹ thừa của 10 ở hàng của nó", nhưng cột đơn vị ghi "1" và số hạng "4" đứng một mình. Đúng như SGK, nhưng câu chưa nói chữ số hàng đơn vị giữ nguyên.
- Sửa: thêm vào note "…rồi cộng lại; chữ số hàng đơn vị giữ nguyên."

### 3. Hình card "Tính giá trị" không có dòng kết quả

- Vị trí: `src/visuals/math/luy-thua/rule-examples.tsx:544` (`TheTinhGiaTri`)
- Vấn đề: hình dừng ở 8 · 2 = 16, không có dòng 2⁴ = 16 nối kết quả về luỹ thừa như hình `tinh-tung-buoc` của section.
- Sửa: thêm dòng `2⁴ = 16` cuối hình.

### 4. Câu "phép nâng lên luỹ thừa" sát chữ SGK

- Vị trí: `$.sections[0].blocks[2].children[2].text`
- Nguồn: tr.22
- Vấn đề: "Nhân nhiều thừa số bằng nhau như thế gọi là phép nâng lên luỹ thừa." gần như trùng câu SGK. Chấp nhận được vì là câu gọi tên thuật ngữ; nếu muốn tránh hẳn: "Phép tính aⁿ gọi là phép nâng lên luỹ thừa."
