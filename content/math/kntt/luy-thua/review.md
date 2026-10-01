# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Vòng: 17 - chỉ phần đổi (`pnpm content:diff`), section: `luy-thua.section.luy-thua-la-gi`, `luy-thua.section.tinh-gia-tri`
- Nguồn đã đọc: không mở lại ảnh nguồn (diff chỉ đổi chỗ xếp câu `chon-tich-5-mu-4` và chữ của `buoc-tiep-6-mu-4`; quy tắc, recap, note không đổi)
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 0 cảnh báo của bài; cảnh báo `[guides]` (LL-04) đã hết
- Đọc hiểu (Haiku): lượt 1 là 3 / 1 / 0; đề viết lại theo Góp ý của reviewer ("lấy 36 nhân tiếp với cơ số"), lượt 2 báo mơ hồ chỉ vì không biết bài đã dạy "cơ số" ở section `co-so-so-mu`; giữ nguyên
- `lesson:walk`: 0 FAIL; đã xem ảnh 070-081 (section "Tính giá trị luỹ thừa", cả hai câu, nhánh sai và gợi ý), `.shots/walk/luy-thua/ipad/`
- Kết luận: 0 Nghiêm trọng, 0 Nên sửa; Góp ý về đề đã áp dụng; đã duyệt và khoá id
- Bản đã review: `90420213de40378d94b4f058082c5de339c5dd3fd7eca5f6cab54b2b8110ce4b` (`pnpm content:diff` so với bản này)

Đã soát đạt:
- Chuyển `luy-thua.ex.chon-tich-5-mu-4` sang đầu `checkIds` của `tinh-gia-tri`: câu dùng "cơ số/số mũ" (gợi ý tô `co-so`, `so-mu`) nay đứng sau section `co-so-so-mu` đã dạy hai từ đó; màn guide `numericPower` (section `co-so-so-mu`) đứng trước mọi câu nhập luỹ thừa, hết cảnh báo `[guides]`. Câu hợp section mới: bước viết 5⁴ thành tích 5·5·5·5 là bước đầu của quy tắc "nhân hai thừa số đầu, rồi lấy kết quả nhân tiếp với cơ số"; `explain` dùng đúng "thừa số", "số mũ".
- Tự giải `chon-tich-5-mu-4`: 5⁴ = 5·5·5·5 = 625; 5·4 = 20; 4·4·4·4·4 = 4⁵ = 1024. Đúng một đáp án (a); `wrong` khớp b, c.
- Tự giải `buoc-tiep-6-mu-4`: tích 6·6·6·6, đã có 6·6 = 36. Mọi thừa số của tích đều là 6, nên "nhân 36 với thêm một thừa số của tích" chỉ cho 36·6 = 216 (a). 36·36 = 1296 cũng bằng 6⁴ nhưng 36 không phải thừa số của tích, đề nay loại được (hết LL-10, LL-01); 36·4 sai vì 4 là số mũ. Đúng một đáp án; `explain.wrong` đúng và không bác đáp án đúng.
- Cả hai section còn đủ: `luy-thua-la-gi` còn `tim-o-16-hat` (manipulate), recap khớp note định nghĩa; `tinh-gia-tri` có 2 câu kiểm tra + `tinh-3-mu-3` luyện, recap khớp câu `rule: true` word-for-word.
- LL-07: không câu nào khác trong bài dùng 5⁴, 6⁴, 625, 1296, 216; số trong `explain.tex` (36, 216) khớp phép tính.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. `buoc-tiep-6-mu-4`: đề dùng "thừa số của tích", quy tắc bài dùng "cơ số", và câu đề dài

- Vị trí: `$.exercises[15].prompt[0].text` (`luy-thua.ex.buoc-tiep-6-mu-4`)
- Nguồn: —
- Vấn đề: quy tắc của section nói "lấy kết quả nhân tiếp với cơ số", còn đề nói "nhân 36 với thêm một thừa số của tích" (LL-05, nói một việc hai cách); câu có mệnh đề chen giữa nên bé chậm phải đọc hai lần (LL-25). Không sai kiến thức, chỉ cần khớp quy tắc cho gọn.
- Sửa: "Đã tính xong bước đầu. Bước tiếp theo là lấy 36 nhân tiếp với cơ số. Đó là phép nào?" (36·6 vẫn là đáp án duy nhất: 6 là cơ số, 4 là số mũ, 36 là kết quả vừa tính). Khi đó `explain.text` đổi "một thừa số 6 của tích" thành "cơ số 6"; `wrong[0]`: "36 là kết quả vừa tính, không phải cơ số; cơ số là 6."; `wrong[1]`: "Số 4 là số mũ, không phải cơ số; cơ số là 6." Gợi ý tô `co-so` giữ nguyên, nay khớp hẳn với đề.
