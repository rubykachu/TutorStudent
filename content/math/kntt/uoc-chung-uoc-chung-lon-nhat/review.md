# Review: Ước chung. Ước chung lớn nhất (`uoc-chung-uoc-chung-lon-nhat`)

- Bài: `content/math/kntt/uoc-chung-uoc-chung-lon-nhat/lesson.json`
- Vòng: 5 - chỉ phần đổi, các explain (`pnpm content:diff`): `explain` của cả 65 câu chấm được; không có mục nào khác đổi
- Nguồn đã đọc: không có (phần đổi chỉ là lời giải thích; đề, đáp án, quy tắc không đổi so với vòng 4)
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường), 0 cảnh báo
- `lesson:walk`: không chạy ở vòng này; đã đọc `explain` trực tiếp từ JSON, đối chiếu validator (`cat-vua-het`) và các chip của `chon-uc-14-21`, `chon-uc-18-27` trong `src/visuals/math/uoc-chung-uoc-chung-lon-nhat/`
- Kết luận: Không còn lỗi Nghiêm trọng (0 Nghiêm trọng, 2 Nên sửa, 3 Góp ý); đã ghi "Bản đã review" bằng `--mark`, chưa `--approve`
- Bản đã review: `d338aad4cbe652893ebe813d9f53e40ec90adf9a8567c1d1634c7169e51a445e` (`pnpm content:diff` so với bản này)

Đã soát: 65 `explain` (text, tex, wrong), kèm các note quy tắc của 12 section.

- Toán: tự tính lại mọi danh sách ước, ƯC, ƯCLN, phân tích thừa số, số mũ nhỏ nhất, tổng ước và phép rút gọn của cả 65 câu: đều đúng. Mọi lý do `wrong` (khoảng 60 mục) đúng toán và đúng nội dung phương án qua `optionId`; không mục nào gắn vào phương án đúng.
- Duy nhất/chỉ có: các chỗ nói "chỉ có" đều đúng thật (`uc-lon-hon-2-16-20`: ƯC là 1, 2, 4 nên chỉ 4 lớn hơn 2; `tui-ke-32-48`: ƯC là 1, 2, 4, 8, 16 nên chỉ 16 từ 10 trở lên; `hop-but-21-28`: ƯC là 1 và 7). Câu `manipulate` `cat-9-21-tu-lam` (validator nhận mọi độ dài chia hết cả 9 và 21, tức 1 và 3) có nêu "(và cho 1)" nên không nói sai; `chon-uc-14-21` và `chon-uc-18-27` nêu đủ số cần chạm (1, 7 và 1, 3, 9) khớp `params`.
- Độ dài: không explain nào quá 3 câu. Không còn "chia dần"; dùng "sơ đồ cột" khớp Bài 10. Quy tắc `so-nho-chia-het`, `uclnn-phan-tich`, `uclnn-ba-so`, `uc-tu-uclnn`, `chia-deu-nhieu-nhat` được nói đúng chữ của note, không mâu thuẫn.
- Màu: ƯC teal, số nguyên tố sky, số mũ violet (`phan-tich-24`, `xep-chia-dan-45`) khớp Bài 10; không `\concept` nào lộ đáp án trước khi trả lời vì explain chỉ hiện sau câu.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. `uc-lon-hon-1-32-40`: số 8 là ƯCLN trong lời nhưng tô teal (ƯC) trong công thức

- Vị trí: `$.exercises[uc-lon-hon-1-32-40].explain.tex`
- Nguồn: —
- Vấn đề: `text` gọi 8 là "ƯCLN của 32 và 40", nhưng `tex` viết `\concept{teal}{8}`. Bài quy ước ƯCLN amber; bé vừa đọc chữ ƯCLN rồi thấy 8 màu teal sẽ lẫn hai khái niệm (mục tiêu chính của các câu này là phân biệt ƯC với ƯCLN).
- Sửa: đổi thành `32 = \concept{amber}{8} \cdot 4, \quad 40 = \concept{amber}{8} \cdot 5`.

### 2. `chia-het-27-45`: tương tự, 9 là ƯCLN trong lời nhưng tô teal

- Vị trí: `$.exercises[chia-het-27-45].explain.tex`
- Nguồn: —
- Vấn đề: `text` nói "ƯCLN của 27 và 45 là 9, nên ước chung là các ước của 9", còn `tex` tô teal `9`. Cùng lỗi màu như mục 1.
- Sửa: đổi `\concept{teal}{9}` thành `\concept{amber}{9}` ở cả hai vế.

## Góp ý

### 1. `uclnn-15-45-50`: chữ 5 của 50 không được tô nên trông như 50 không có thừa số 5

- Vị trí: `$.exercises[uclnn-15-45-50].explain.tex`
- Nguồn: —
- Vấn đề: dòng `50 = 2 \cdot 5^{2}` để 5² không màu trong khi 5 của 15 và 45 amber; bé có thể đọc là 5 "không có ở 50", ngược với ý "có ở cả ba số".
- Sửa: viết `50 = 2 \cdot \concept{amber}{5}^{2}`.

### 2. Câu "chính là các ước của ƯCLN là 9" hai chữ "là" liền nhau dễ đọc vấp

- Vị trí: `$.exercises[chon-uc-18-27].explain.text`, `$.exercises[chia-nhom-16-28].explain.text`
- Nguồn: —
- Vấn đề: "chính là các ước của ƯCLN là 9" và "ước của ƯCLN là 4" có thể bị đọc thành "ước của (ƯCLN là 9)", bé chậm khó tách ý.
- Sửa: "Các ước chung của 18 và 27 chính là các ước của ƯCLN, tức là các ước của 9. Ước của 9 là 1, 3 và 9, nên chạm vào ba số này." và tương tự "tức là ước của 4" ở `chia-nhom-16-28`.

### 3. `hoan-hao-12` (phương án d): câu "Tổng 15 là khi thiếu ước 1" tối nghĩa

- Vị trí: `$.exercises[hoan-hao-12].explain.wrong[1]`
- Nguồn: —
- Vấn đề: toán đúng (2 + 3 + 4 + 6 = 15) nhưng cách nói ngược và cụt, bé khó hiểu vì sao ra 15.
- Sửa: "15 là tổng khi quên ước 1; phải cộng cả 1."
