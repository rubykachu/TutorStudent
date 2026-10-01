# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Vòng: 15 - chỉ phần đổi (explain của 55 câu)
- Nguồn đã đọc: không mở lại ảnh nguồn (commit cc71e5c chỉ thêm `explain`; quy tắc, recap, note, đề không đổi)
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 1 cảnh báo `[guides]` đã có từ trước (`exercises[12]`); các cảnh báo khác thuộc bài khác
- `lesson:walk`: không chạy (điều phối chạy; vòng này chỉ thêm lời giải thích)
- Kết luận: Chưa đạt: còn 10 lỗi Nghiêm trọng (số trong `explain` bị mất chữ số hoặc sai), 2 Nên sửa, 1 Góp ý
- Bản đã review: `bd2f5ec4acb81619b245df570bf6cd9f5435bbbd27c4db7a4b58ba44b10bfce4` (`pnpm content:diff` so với bản này)

Đã soát đạt: tự giải cả 55 câu so với đề và `answer`; mọi `wrong` còn lại đều đúng toán, `optionId` khớp nội dung lựa chọn và không bác đáp án đúng; mọi câu `choice` có nhiễu đều có `wrong`; không có "Đúng rồi", nhãn a/b/c, "phương án", "ở trên"; tối đa 3 câu mỗi `explain`; cú pháp `tex` cân ngoặc, cơ số blue và số mũ violet đúng chỗ (trừ hai tex không tô, hợp lý); từ ngữ khớp câu `rule: true` của từng section (nhân/chia cùng cơ số, số mũ 0 và 1, luỹ thừa của 10, viết tổng).

## Nghiêm trọng

Nguyên nhân chung của mục 1 đến 10: khi viết `explain`, chữ số đầu của số có dấu cách hẹp ngăn nghìn (`1\u202f000`) bị rơi mất, còn lại `\u202f000`; ba chỗ còn sai cả giá trị. LL-17.

### 1. `chon-10-lap-phuong`: số trong lời giải thích sai hoặc mất chữ số

- Vị trí: `$.exercises[20].explain.text` (`luy-thua.ex.chon-10-lap-phuong`), LL-17
- Nguồn: —
- Vấn đề: Lời giải thích bị mất chữ số: "rồi 100 · 10 = \u202f000." (thiếu chữ số 1 đứng trước dấu cách hẹp, trẻ đọc thành " 000").
- Sửa: 10 lập phương là 10³, tích của ba thừa số 10. 10 · 10 = 100, rồi 100 · 10 = 1 000. (giữ dấu cách hẹp U+202F như các số khác trong bài)

### 2. `viet-1000`: số trong lời giải thích sai hoặc mất chữ số

- Vị trí: `$.exercises[44].explain.text` (`luy-thua.ex.viet-1000`), LL-17
- Nguồn: —
- Vấn đề: Hai chỗ "Số  000 ... Vậy  000" mất chữ số 1 đầu.
- Sửa: Số 1 000 là chữ số 1 và 3 chữ số 0 theo sau. Vậy 1 000 là 10³. (giữ dấu cách hẹp U+202F như các số khác trong bài)

### 3. `tao-10-000`: số trong lời giải thích sai hoặc mất chữ số

- Vị trí: `$.exercises[45].explain.text` (`luy-thua.ex.tao-10-000`), LL-17
- Nguồn: —
- Vấn đề: Sai số: đề cần 10 000 nhưng lời giải viết "1 000 có 4 chữ số 0" (1 000 có 3 chữ số 0), nên bé đếm 3 mà đáp án 4, thành mâu thuẫn.
- Sửa: 10ⁿ viết ra là chữ số 1 và n chữ số 0 theo sau. 10 000 có 4 chữ số 0, nên số mũ là 4. (giữ dấu cách hẹp U+202F như các số khác trong bài)

### 4. `tinh-10-mu-5`: số trong lời giải thích sai hoặc mất chữ số

- Vị trí: `$.exercises[46].explain.text` (`luy-thua.ex.tinh-10-mu-5`), LL-17
- Nguồn: —
- Vấn đề: Sai kết quả: "viết chữ số 1 rồi 5 chữ số 0, được 10 000" (10 000 chỉ có 4 chữ số 0; đúng là 100 000, khác cả tex `100\,000` và `answer` 100000).
- Sửa: 10ⁿ viết ra là chữ số 1 và n chữ số 0 theo sau. Số mũ là 5 nên viết chữ số 1 rồi 5 chữ số 0, được 100 000. (giữ dấu cách hẹp U+202F như các số khác trong bài)

### 5. `ghep-luy-thua-10`: số trong lời giải thích sai hoặc mất chữ số

- Vị trí: `$.exercises[47].explain.text` (`luy-thua.ex.ghep-luy-thua-10`), LL-17
- Nguồn: —
- Vấn đề: "10³ là  000 và 10⁴ là 1 000": mất chữ số 1 ở 10³ và 10⁴ bị ghi thành 1 000 (đúng là 10 000), lệch cả tex và cặp nối.
- Sửa: Số mũ cho biết có bao nhiêu chữ số 0 sau chữ số 1. Vậy 10² là 100, 10³ là 1 000 và 10⁴ là 10 000. (giữ dấu cách hẹp U+202F như các số khác trong bài)

### 6. `viet-1-000-000`: số trong lời giải thích sai hoặc mất chữ số

- Vị trí: `$.exercises[48].explain.text` (`luy-thua.ex.viet-1-000-000`), LL-17
- Nguồn: —
- Vấn đề: "Số  00 000 là chữ số 1 và 6 chữ số 0": mất chữ số, số hiện ra không phải số của đề.
- Sửa: Số 1 000 000 là chữ số 1 và 6 chữ số 0 theo sau. Vậy số mũ là 6 và số đó là 10⁶. (giữ dấu cách hẹp U+202F như các số khác trong bài)

### 7. `chon-luy-thua-hang-tram`: số trong lời giải thích sai hoặc mất chữ số

- Vị trí: `$.exercises[49].explain.wrong[c]` (`luy-thua.ex.chon-luy-thua-hang-tram`), LL-17
- Nguồn: —
- Vấn đề: "10³ là  000" mất chữ số 1.
- Sửa: 10³ là 1 000, giá trị của hàng nghìn; chữ số 3 đứng ở hàng trăm. (giữ dấu cách hẹp U+202F như các số khác trong bài)

### 8. `tach-5-247`: số trong lời giải thích sai hoặc mất chữ số

- Vị trí: `$.exercises[50].explain.text` (`luy-thua.ex.tach-5-247`), LL-17
- Nguồn: —
- Vấn đề: "Chữ số 5 ở hàng nghìn,  000 là 10³" mất chữ số 1.
- Sửa: Mỗi chữ số nhân với luỹ thừa của 10 ở hàng của nó. Chữ số 5 ở hàng nghìn, 1 000 là 10³; chữ số 2 ở hàng trăm, 100 là 10². (giữ dấu cách hẹp U+202F như các số khác trong bài)

### 9. `chon-tong-3-062`: số trong lời giải thích sai hoặc mất chữ số

- Vị trí: `$.exercises[51].explain.wrong[b] và wrong[c]` (`luy-thua.ex.chon-tong-3-062`), LL-17
- Nguồn: —
- Vấn đề: wrong[b] "tổng này bằng  602" mất chữ số 3 (3·10³ + 6·10² + 2 = 3 602). wrong[c] "tổng này bằng 3 062" sai: 3·10⁴ + 6·10 + 2 = 30 062; 3 062 lại chính là đáp án đúng nên bé đọc thành lựa chọn c bằng số đề.
- Sửa: b: "Chữ số 6 ở hàng chục nên nhân với 10, không phải 10²; tổng này bằng 3 602." c: "Chữ số 3 ở hàng nghìn nên nhân với 10³, không phải 10⁴; tổng này bằng 30 062." (giữ dấu cách hẹp U+202F như các số khác trong bài)

### 10. `tinh-tong-7-409`: số trong lời giải thích sai hoặc mất chữ số

- Vị trí: `$.exercises[52].explain.text` (`luy-thua.ex.tinh-tong-7-409`), LL-17
- Nguồn: —
- Vấn đề: Ba chỗ " 000" mất chữ số 7 ("7 · 10³ =  000", "Vậy  000 + 400 + 9 =  409").
- Sửa: Tính từng số hạng rồi cộng lại: 7 · 10³ = 7 000 và 4 · 10² = 400, còn 9 là hàng đơn vị. Vậy 7 000 + 400 + 9 = 7 409. (giữ dấu cách hẹp U+202F như các số khác trong bài)

## Nên sửa

### 1. `chon-tich-5-mu-4`: lý do dùng "số mũ" ở section chưa dạy cơ số, số mũ

- Vị trí: `$.exercises[3].explain.wrong[b]` (`luy-thua.ex.chon-tich-5-mu-4`, section `luy-thua-la-gi`)
- Nguồn: —
- Vấn đề: wrong[b] "5 · 4 chỉ có hai thừa số; số mũ 4 cho biết có 4 thừa số 5, không phải số đem nhân với 5." dùng "số mũ" trước section `co-so-so-mu` (explain và wrong[c] của câu này đã tránh từ đó).
- Sửa: "5 · 4 chỉ có hai thừa số; 5⁴ có 4 thừa số, thừa số nào cũng bằng 5."

### 2. `buoc-tiep-6-mu-4`: "thừa số 6 còn lại" sai số lượng, và lý do của 36 · 36 dễ hiểu thành phép sai

- Vị trí: `$.exercises[15].explain.text` và `explain.wrong[b]` (`luy-thua.ex.buoc-tiep-6-mu-4`)
- Nguồn: —
- Vấn đề: (a) text "lấy 36 nhân tiếp với thừa số 6 còn lại" nói chỉ còn một thừa số, trong khi 6⁴ còn hai thừa số 6 (36 · 6 = 216 mới là 6³). (b) wrong[b] "không nhân kết quả 36 với chính nó": 36 · 36 = 1 296 cũng bằng 6⁴ (và bài đã dạy 6² · 6² = 6⁴ ở section nhân cùng cơ số), nên câu này đọc như cấm một phép đúng. Lý do không nói sai kiến thức nên không tính Nghiêm trọng, nhưng nên nói là luật của bước này, không phải đúng sai của phép nhân. Việc 36 · 36 cũng ra đáp án của cả bài là thiết kế đề có từ trước, không phải do bản thêm `explain`.
- Sửa: text: "Tính luỹ thừa là nhân từng thừa số một. Đã có 6 · 6 = 36, nên lấy 36 nhân tiếp với một thừa số 6; mỗi bước chỉ thêm một thừa số, cho tới khi hết 4 thừa số." wrong[b]: "Ở bước này ta lấy kết quả nhân tiếp với cơ số 6, chưa nhân 36 với 36." (đề nghị thêm "mỗi bước" ở đề: "Bước tiếp theo, nhân thêm một thừa số, là gì?" để loại hẳn hai cách hiểu, LL-01).

## Góp ý

### 1. `cham-co-so`: "nhân lặp lại 4 lần"

- Vị trí: `$.exercises[1].explain.text` (`luy-thua.ex.cham-co-so`)
- Nguồn: —
- Vấn đề: "số 6 được nhân lặp lại 4 lần" đọc như 4 phép nhân (thực ra 3), lệch với quy tắc "số mũ là số thừa số".
- Sửa: "Ở đây có 4 thừa số 6 nhân với nhau nên 6 là cơ số, còn số 4 nhỏ phía trên là số mũ."
