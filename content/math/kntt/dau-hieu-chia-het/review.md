# Review: Dấu hiệu chia hết (`dau-hieu-chia-het`)

- Bài: `content/math/kntt/dau-hieu-chia-het/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff dau-hieu-chia-het`: thêm `explain` cho 82 câu, không đổi chữ nào khác)
- Nguồn đã đọc: không có (diff chỉ thêm `explain`; đối chiếu với đề, đáp án, lựa chọn, `accept`, `params` và các câu quy tắc `rule: true` của chính bài)
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường), 0 cảnh báo
- `lesson:walk`: không chạy (không đổi màn)
- Kết luận: Chưa đạt: còn 2 lỗi Nghiêm trọng (lý lẽ sai trong `explain` của `tan-cung-5` và `chon-lap-2-5`); `reviewedHash` chưa ghi
- Bản đã review: chưa ghi (chạy `pnpm content:hash dau-hieu-chia-het --mark` hoặc `--approve` ở vòng sau khi hết Nghiêm trọng)

Đã soát: đủ 82 `explain`. Tự tính lại mọi tổng chữ số, phép chia trong `tex`, danh sách số, số lần lập được (`dem-so-124`, `lap-so-014`), phép mua bút và vở (`tien-but-40`, `mua-vo-45`, `tien-but-60`, `mua-vo-65`), điểm bài trắc nghiệm (nhóm `diem-*`, `hoc-tinh-sai-52`); đối chiếu từng `wrong[].optionId` với `answer` (không có phương án đúng nào bị đưa vào `wrong`, mọi lý do khớp số của phương án đó), đối chiếu `accept`, `params`/`fits` của `manipulate` và thứ tự `order`. Mọi câu `text` đều không quá 3 câu, không "…", không "Đúng rồi/Sai rồi", xưng "bạn" tự nhiên.

## Nghiêm trọng

### 1. `tan-cung-5`: lý do `wrong` của chữ số 8 nói "chưa chắc chia hết cho 5"

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.tan-cung-5")].explain.wrong[0]` (phương án `d`, chữ số 8)
- Nguồn: —
- Vấn đề: lý do ghi "Số tận cùng 8 chia hết cho 2, nhưng chưa chắc chia hết cho 5; ví dụ 18 : 5 còn dư 3". "Chưa chắc" cho bé hiểu số tận cùng 8 đôi khi chia hết cho 5, trái câu quy tắc của bài (chia hết cho 5 thì tận cùng chỉ 0 hoặc 5; tận cùng 8 thì không bao giờ). Bé học chậm sẽ nhớ sai dấu hiệu.
- Sửa: "Số tận cùng 8 không chia hết cho 5, vì chia hết cho 5 thì tận cùng chỉ là 0 hoặc 5; ví dụ 18 : 5 được 3 dư 3." (LL-17)

### 2. `chon-lap-2-5`: "số đó là 250" khẳng định duy nhất, sai vì 520 cũng thoả

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.chon-lap-2-5")].explain.text`
- Nguồn: —
- Vấn đề: đề cho các chữ số 0, 2, 5, nhưng 520 cũng chia hết cho cả 2 và 5 (tận cùng 0). Câu "Với các chữ số 0, 2 và 5, số đó là 250" nói chỉ có một số, dạy bé rằng lập số với các chữ số này chỉ ra đúng 250 (sai toán; đáp án chỉ duy nhất vì 3 lựa chọn không có 520).
- Sửa: "Số chia hết cho cả 2 và 5 phải tận cùng là 0. Trong ba số đã cho, chỉ có 250 tận cùng là 0." (LL-17)

## Nên sửa

### 1. `o-trong-2`: `tex` hiển thị "610,; 612,; ..." thừa dấu

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.o-trong-2")].explain.tex`
- Nguồn: —
- Vấn đề: chuỗi `610,; 612,; 614,; 616,; 618` có dấu phẩy rồi chấm phẩy liền nhau (không phải khoảng trắng), đọc như lỗi gõ.
- Sửa: `"610,\\quad 612,\\quad 614,\\quad 616,\\quad 618"` (cùng kiểu `\\quad` các `tex` khác của bài).

### 2. `chon-nhieu-tich-5`: lý do `wrong` ngầm dạy "không thừa số nào chia hết thì tích không chia hết"

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.chon-nhieu-tich-5")].explain.wrong[0]` và `[1]` (phương án `a`, `d`)
- Nguồn: —
- Vấn đề: "6 và 4 đều không chia hết cho 5 (tích là 24)" suy ngược chiều quy tắc của bài (bài chỉ dạy "có một thừa số chia hết thì tích chia hết"). Chiều ngược đúng với 5 nhưng chưa dạy, và sai với số khác (4 · 9 vẫn chia hết cho 6, dù cả hai thừa số không chia hết cho 6); bé dễ mang mẹo này sang bài khác.
- Sửa: a: "Tích 6 · 4 là 24, tận cùng 4 nên không chia hết cho 5."; d: "Tích 3 · 9 là 27, tận cùng 7 nên không chia hết cho 5."

### 3. Dùng "thoả" (6 câu) hơi khó với bé lớp 6 học chậm

- Vị trí: `explain.text` của `chon-nhieu-5`, `chon-3-5-345`, `chon-nhieu-3-5`, `xep-1530`, `chia-3-5-45`, `dem-2-3`
- Nguồn: —
- Vấn đề: "đều thoả", "thoả cả hai", "không thoả" là từ Hán Việt khó, không có trong chữ khác của bài; các câu khác viết "thì chia hết".
- Sửa: thay bằng chữ thường dùng, ví dụ `chon-nhieu-5`: "160 tận cùng 0 và 245 tận cùng 5 nên đều chia hết cho 5."; `chon-3-5-345`: "...có tổng 3 + 4 + 5 = 12, nên đúng cả hai dấu hiệu."; `xep-1530`: "Cả hai dấu hiệu đều đúng nên..."; `dem-2-3`: "12, 18 và 24 đúng cả hai; 15 ...  nên không đúng."

## Góp ý

### 1. `chon-chia-het-9`: nhắc "chia hết cho 3" trước khi section dạy dấu hiệu 3

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.chon-chia-het-9")].explain.wrong[0]` (phương án `b`)
- Nguồn: —
- Vấn đề: "1 + 5 + 6 = 12, chia hết cho 3 nhưng không chia hết cho 9" nằm ở section dấu hiệu 9 (dạy trước dấu hiệu 3). Ý đúng (12 chia hết cho 3 là phép chia thường) nhưng bé dễ đọc thành "156 chia hết cho 3", chưa học.
- Sửa: "1 + 5 + 6 = 12, mà 12 không chia hết cho 9 (9 · 1 = 9, 9 · 2 = 18)."

### 2. `gop-tien-25-32`: câu `wrong` của phương án `c` có giọng phán

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.gop-tien-25-32")].explain.wrong[1]` (phương án `c`)
- Nguồn: —
- Vấn đề: "vậy lý do này nói sai về 25" phán đúng/sai thay vì nêu lý do toán (rule của mục "Giải thích sau mỗi câu").
- Sửa: "25 tận cùng là 5 nên 25 chia hết cho 5; còn 32 mới là số không chia hết."

### 3. `hop-banh-tui`: `tex` dùng phép chia cho tích chưa dạy

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.hop-banh-tui")].explain.tex`
- Nguồn: —
- Vấn đề: "7 · 8 : 4 = 7 · (8 : 4)" là tính chất chia một tích cho một số mà bài chưa dạy; chỉ đúng vì 8 chia hết cho 4.
- Sửa: bỏ hàng đẳng thức, giữ "7 \\cdot 8 = 56,\\quad 56 : 4 = 14" (cũng ra 14, đúng đáp án).
