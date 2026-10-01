# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Vòng: 16 - chỉ phần đổi (explain của 55 câu)
- Nguồn đã đọc: không mở lại ảnh nguồn (diff chỉ thêm `explain`; quy tắc, recap, note, đề không đổi)
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 1 cảnh báo `[guides]` đã có từ trước (`exercises[12]`); các cảnh báo khác thuộc bài khác
- `lesson:walk`: không chạy (điều phối chạy; vòng này chỉ thêm lời giải thích)
- Kết luận: 0 lỗi Nghiêm trọng, 1 Nên sửa, 2 Góp ý; lệnh cuối vòng (`content:hash`) do điều phối chạy
- Bản đã review: `bd2f5ec4acb81619b245df570bf6cd9f5435bbbd27c4db7a4b58ba44b10bfce4` (`pnpm content:diff` so với bản này)

Đã soát đạt (cả 55 câu, từ đầu):
- Số có nhóm nghìn: in từng chuỗi `text`, `wrong`, `tex` của mọi `explain` bằng script (U+202F thành "_"); mọi số 4 chữ số trở lên (1_000, 10_000, 100_000, 1_000_000, 5_247, 3_062, 3_602, 30_062, 7_000, 7_409) đủ chữ số, không còn dấu cách hẹp đứng đầu chuỗi, không còn số 4 chữ số trở lên viết liền; `tex` dùng `\,` khớp `text`.
- Toán: tự giải từng câu so với đề và `answer`; mọi phép tính trong `text`, `tex`, `wrong` tính lại đúng (vd 3_062 = 3·10³ + 6·10 + 2; hai tổng nhiễu bằng 3_602 và 30_062; 2³ < 3² < 4² < 5² là 8, 9, 16, 25); `wrong` không bác đáp án đúng, `optionId` khớp nội dung.
- Từ ngữ: khớp câu `rule: true` và caption recap của từng section; section "Luỹ thừa là gì?" không dùng "cơ số/số mũ" trong `text` (chỉ "thừa số", "luỹ thừa"); không có "Đúng rồi", nhãn a/b/c, "phương án", "ở trên"; mọi `explain` tối đa 3 câu.
- `tex`: cú pháp cân ngoặc, cơ số blue và số mũ violet đúng chỗ, khớp `text`.
- Nhiễu dễ chọn nhầm của câu `choice` đều có `wrong`.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. `dien-quy-tac`: lời giải thích của câu nhân nhắc quy tắc chia, section chia dạy sau

- Vị trí: `$.exercises[28].explain.text` (`luy-thua.ex.dien-quy-tac`), section "Nhân hai luỹ thừa cùng cơ số"
- Nguồn: —
- Vấn đề: "Trừ số mũ là quy tắc của phép chia" dùng kiến thức của section "Chia hai luỹ thừa cùng cơ số" (card sau); đến đây trẻ chưa học phép chia luỹ thừa nên câu này gây rối thay vì giải thích. Nhiễu "nhân" (dễ nhầm "nhân các số mũ") cũng chưa được nói tới.
- Sửa: "Nhân hai luỹ thừa cùng cơ số thì giữ nguyên cơ số, còn các số mũ cộng lại, không nhân và không trừ. Ví dụ 3 + 4 = 7 nên 2³ · 2⁴ = 2⁷." (`tex` giữ nguyên)

## Góp ý

### 1. `chon-tich-5-mu-4`: câu `wrong` cho phương án 4·4·4·4·4 hơi vòng

- Vị trí: `$.exercises[3].explain.wrong[1].text` (`luy-thua.ex.chon-tich-5-mu-4`)
- Vấn đề: "4 là số thừa số, còn thừa số là 5" lặp từ "thừa số" nên khó đọc với trẻ chậm.
- Sửa: "Số được nhân lặp lại là 5, không phải 4; số 4 chỉ cho biết có 4 thừa số."

### 2. `nhan-ba-luy-thua-10`: "thừa số" chỉ ba luỹ thừa, dễ lẫn với thừa số trong luỹ thừa

- Vị trí: `$.exercises[33].explain.text` (`luy-thua.ex.nhan-ba-luy-thua-10`)
- Vấn đề: "Ba thừa số cùng cơ số 10" gọi 10², 10, 10⁴ là thừa số, trong khi bài vừa dạy thừa số là số được nhân lặp lại trong một luỹ thừa.
- Sửa: "Số 10 ở giữa không ghi số mũ nên là 10¹. Nhân ba luỹ thừa cùng cơ số 10: giữ nguyên cơ số và cộng các số mũ, 2 + 1 + 4 = 7."
