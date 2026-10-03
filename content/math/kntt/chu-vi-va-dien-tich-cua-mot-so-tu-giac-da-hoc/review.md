# Review: Chu vi và diện tích của một số tứ giác đã học (`chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc`)

- Bài: `content/math/kntt/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff` so với bản đã review ở vòng 2), section: `dien-tich-la-gi`, `dien-tich-thoi`, `dien-tich-thang-can`, `doi-don-vi`, `bai-toan-doi-song`, `bai-tap-sach-bai-tap` cùng các câu của phần 1–9 có đổi; thêm hình và test đổi từ vòng 2 (`git diff 0558c1c HEAD` trên `src/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc` và `tests/visuals/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc.test.tsx`)
- Nguồn đã đọc: `sources/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/` - sbt-p72, sbt-p73 (đề 4.20 đến 4.28), sbt-p115, sbt-p116 (lời giải)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku): lượt 5 (42 mục đổi) 30 / 10 / 2; lượt 6 (7 mục viết lại) 2 / 5 / 0; lượt 7 (5 mục) 1 / 3 / 1; tệp `.shots/review/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/doc-hieu-5.md`, `doc-hieu-6.md`, `doc-hieu-7.md`. Hai mục `$.exercises[76].explain.text` và `$.exercises[77].explain.text` được viết lại sau lượt 7 và chưa đọc lại; mục còn lại sau lượt 3 ghi ở Nên sửa 1, 2 và Góp ý 1. Mười mục của lượt 5 bị chấm vì dấu "·" hay vì `bank` là danh sách số (`$.exercises[30]`, `[35]`, `[21]`, `[64].bank`...) không cần sửa: "·" là dấu nhân của cả bài đã dùng từ phần 1, `bank` chỉ là các ô số kéo vào chỗ trống, và thuật ngữ "lục giác" đã có trong đề.
- `lesson:walk`: 0 FAIL, 0 cảnh báo (iPad dọc, điện thoại, iPad ngang); ảnh trong `walk-r2/` của thư mục tạm của phiên điều phối (không commit)
- Kết luận: Đạt (0 Nghiêm trọng, 2 Nên sửa, 5 Góp ý). Điều phối đã sửa sau vòng này: Nên sửa 1 (`explain` 4.24 nói rõ "cạnh trên trừ cạnh dưới", "cạnh trái trừ cạnh phải"), Nên sửa 2 (`explain` 4.27 tính 15 · 9 = 135 m² và 0,6 · 0,6 = 0,36 m² trước khi chia), Góp ý 2 ("xoay" như hình), Góp ý 3 ("hình chữ nhật trước khi cắt"), Góp ý 4 ("6 là số cạnh ngoài của hình"); bỏ Góp ý 1 (câu đi ngay trên hình chạy từng bước) và Góp ý 5 (dòng ½ làm nhãn của bảng quá dài trên điện thoại; hình quy tắc phần 7, 8 đã có). Đọc hiểu lượt 8 (6 mục vừa viết lại, `doc-hieu-8.md`): 3 / 3 / 0; ba mục còn mơ hồ (`$.exercises[67].explain.text` "chỗ bị cắt", `$.exercises[76].explain.text` hai cách trong một lời giải, `$.sections[7].blocks[0].children[0].text` "đặt sát", "đáy lớn lên trên") đã qua ba lượt đọc lại nên ghi lại đây, không chặn duyệt: mỗi câu đi cùng hình có số đo hay hình chạy từng bước cho thấy đúng thao tác đó. Duyệt bằng `content:hash --approve`, rồi `content:lock`.
- Bản đã review: `e850b4832c5c68413cfdd3a9fbd7a24ceb783f982e8736ceede27e0a7e2409ac` (`pnpm content:diff` so với bản này)

## Trạng thái các mục vòng 2

- Nghiêm trọng 1 (công thức lời giải 4.26 và 4.28 bị cắt trên điện thoại): đã sửa đúng. `explain.tex` của 4.26 và 4.28 xếp mỗi dòng một phép, tối đa 22 ký tự, cùng thứ tự hình lời giải (`90 + 40`); ảnh `phone/200`, `phone/215` hiện đủ đáp số 510 m và 2 880 000. Các `explain.tex` dài khác (4.23, 4.25, 4.27, 4.24 dẫn, 4.22b, các câu hình thang) cũng đã xếp dòng; test `the formulas of the explanations and tips` khoá giới hạn.
- Nên sửa 1 (câu luyện 9 ô trùng 9 m²): đã sửa đúng. Hình chữ L 11 ô (3, 3, 5 ô); đề, `explain`, `answer`, `check.expr` khớp; 11 không trùng số nào khác của phần 4 (4, 7, 9, 10, 12). Id đổi `mieng-dan-11-o`, `f-chu-l-11-o`; không còn tham chiếu id cũ trong `lesson.json`, hình hay test (chỉ còn trong `review.md` cũ, nay đã ghi đè, và `task.md` của backlog).
- Nên sửa 2 (`wrong` "không nhân chúng"): đã sửa đúng ở `ex.chu-vi-chon-phep-tinh` và `ex.chon-phep-tinh-cn-9-5` ("không nhân các cạnh với nhau"; đáp án đúng chỉ nhân 2 với cạnh).
- Nên sửa 3 (`wrong` gọi 2 · (13 + 6), 2 · (16 + 9) là phép tính chu vi): đã sửa đúng, nói rõ phép đã làm và phép phải làm.
- Nên sửa 4 (màu chu vi, diện tích tô lên số khác): đã sửa đúng. Blue chỉ còn ở 50 (chu vi vườn), 110, 260, 280/200 và 28; 48, 108, 255, 510 là mực thường; các thẻ hàng 4.23 "tổng", 4.26 "chu vi trừ cửa", "trừ chỗ cửa" là slate; nhãn đáy và "4 + 8 = 12 cm" của bốn hình phần 6, 8 là `ink`.
- Nên sửa 5 (bốn tên cho phần bị cắt): đã sửa đúng. Còn một cặp tên "hình chữ nhật trước khi cắt" và "phần bị cắt" ở câu "Cách làm", `explain` 4.24, `explain` câu dẫn, thẻ hàng; không còn "góc bị cắt", "chỗ thiếu", "hình lớn". Chỉ còn lệch nhẹ ở Góp ý 3.
- Nên sửa 6 (4.24 không chỉ cách tìm cạnh phần bị cắt): đã sửa đúng. Hình gợi ý có hàng `10 − 7 = 3 m`, `5 − 4 = 1 m` (số khác đề, `S = 47` còn "?"); hình lời giải có hai dòng `8 − 6 = 2 m`, `6 − 4 = 2 m` cùng nhãn 4 m, 6 m trên hình; ảnh `giai-4-24-phone` vừa khung điện thoại, hình và chữ không chồng nhau. Còn một chỗ đọc hiểu: Nên sửa 1 dưới.
- Nên sửa 7 ("ra m để tính diện tích"): đã sửa đúng ("đổi hết ra cm để đếm gạch; khi giá tính theo m² thì đổi độ dài ra m"), khớp tip `cung-don-vi` và 4.28.
- Nên sửa 8 (bank 4.23 luôn lớn nhất là đáp án): đã sửa đúng. `bank` là 620, 760, 660, 480, "đủ", "không đủ"; 760 và 660 lớn hơn 620 và đều từ lỗi thật (hai đường chéo tính như chu vi hình chữ nhật 60 × 80; lấy 60 cm làm cạnh hình thoi), không số nào thành đáp án đúng.
- Nên sửa 9 (đếm viên đá ra 6): đã sửa đúng. Hình `dan-luc-giac-3` là lục giác đều ghép từ ba hình thoi, hai viên xanh nhạt một viên xám; đáp án 3 khác 6 và 8; nhiễu 2 (bỏ viên xám), 6, 4 mỗi loại đều có `wrong`. Hình vẫn dẫn tới 4.25: cùng ý "viên khác màu vẫn là một viên, diện tích cả hình bằng số viên nhân diện tích một viên" và `explain` nói đúng câu đó; 4.25 đếm 2 viên giữa tối màu cộng 6 viên quanh. Xem Góp ý 4 về lời `wrong` "6 viên".
- Nên sửa 10 (câu dẫn 4.26 trùng sân 20 m, 30 m, 600 m²): đã sửa đúng. 750 m² và 25 m (đáp số 30 m), rồi dài 30 m, rộng 25 m, cửa 2 m (108 m); không số nào trùng 4.26, 4.27, 4.28.
- Nên sửa 11 ("bị cắt mất một góc vuông"): đã sửa đúng, đổi thành "một hình chữ nhật nhỏ ở góc" cả ở câu "Cách làm", nhãn và caption của `khuyet-cach-lam`.
- Nên sửa 12 (nối "chia cho 2" với ½): đã sửa đúng, theo quyết định của chủ dự án. Hai hình quy tắc phần 7, 8 có dòng "Sách viết ½ · a · b, nghĩa là a · b : 2." và dòng tương ứng cho hình thang cân; không dạy phân số, không đổi câu quy tắc và recap.
- Nên sửa 13 (a · a và a²): đã sửa đúng, "Sách viết a · a là a²." ở hình quy tắc phần 5, kèm "Sách viết ab nghĩa là a · b." và dòng `S = a · a = a²` ở bảng năm công thức.
- Nên sửa 14 (hình quy tắc phần 2, 3, 5 nhỏ trên điện thoại): đã sửa đúng. Sáu hình quy tắc cùng `columns: 1` và cùng `RULE_FIGURE_HEIGHT`; ảnh điện thoại của `c4a`, `dt-cn`, `thoi`, `thang` hiện công thức cỡ thân bài. Test `each show one large figure per rule, in a single column` khoá.
- Góp ý vòng 2: 1, 2, 3, 4, 5, 6, 7, 9, 10, 11 đã làm; Góp ý 8 (hình thang khung đầu nhỏ, lệch trái) chưa làm, không chặn.

## Đã soát khi sửa

- Đề sách 4.20 đến 4.28 so với `sbt-p72.png`, `sbt-p73.png`: đề của 4.21, 4.22c, 4.22d, 4.27, 4.28 chỉ đổi dấu cách thường thành dấu cách không ngắt giữa số và đơn vị (đã so lại bằng cách quy mọi U+00A0 và U+202F về dấu cách, trước và sau: chữ y nguyên), từng chữ, số, đơn vị, dấu câu và thứ tự đúng với ảnh. Đề 4.20, 4.22a, 4.22b, 4.23, 4.24, 4.25, 4.26 không đổi.
- Đáp án và lời giải đối chiếu `sbt-p115.png`, `sbt-p116.png`: 4.20 (80, 36), 4.21 (7), 4.22 (25, 32, 30, 48), 4.23 (620 cm, không đủ), 4.24 (28, 44), 4.25 (1 032), 4.26 (510), 4.27 (75), 4.28 (2 880 000) khớp; các dòng `explain.tex` mới đi cùng các bước của sách (90, 260, 255, 510; 0,36, 504, 96).
- Đã tự giải mọi câu có đổi: 11 ô; (3 + 11) · 3 : 2 = 21; 750 : 25 = 30; 2 · (30 + 25) − 2 = 108; 112 + 80 + 56 = 248; 0,5 · 0,5 = 0,25; các `explain.tex` hình thang (20, 36, 50, 42, 32); 2 · (15 + 10) − 2 = 48; 5 · 4 · 50 000 = 1 000 000; 3 viên đá.
- Phần 9 (đổi đơn vị): câu quy tắc (`rule: true`) và recap cùng đổi dấu cách không ngắt, vẫn giống nhau từng ký tự, `card.doi-don-vi` cũng vậy. Các câu kiểm tra và câu luyện của phần 3 không trùng số sau khi đổi 9 thành 11.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. `explain` bài 4.24 vẫn khó theo cho bé đọc chậm (Haiku lượt 5, 6, 7 đều chấm mơ hồ)

- Vị trí: `$.exercises[67].explain.text` (`ex.sbt-4-24`) - LL-25
- Nguồn: tr.72 Hình 4.20, tr.116
- Vấn đề: "Lấy 8 m bớt đoạn 6 m, lấy 6 m bớt đoạn 4 m" không nói đoạn nào của hình: có hai đoạn 6 m (trái và dưới), nên bé không biết trừ cạnh nào với cạnh nào. Đây là bước bé dễ kẹt nhất của bài, và bài tập sách bài tập đòi hướng dẫn từng bước với số của câu. Số trong hình đúng nên 8 − 6 hay 6 − 4 lấy cạnh nào cũng ra 2, nhưng bé không hiểu vì sao.
- Sửa: "Vẽ thêm hai đoạn vào chỗ bị cắt, ta được hình chữ nhật dài 8 m, rộng 6 m. Cạnh trên 8 m trừ cạnh dưới 6 m nên phần bị cắt rộng 2 m; cạnh trái 6 m trừ cạnh phải 4 m nên phần bị cắt cao 2 m. Vì vậy, chu vi bằng chu vi hình chữ nhật, còn diện tích thì trừ đi phần bị cắt." (vẫn 3 câu). Chạy lại lượt Haiku cho mục này.

### 2. `explain` bài 4.27 nhắc cách của sách mà không giải thích 0,36 m²

- Vị trí: `$.exercises[76].explain.text` (`ex.sbt-4-27`) - LL-25
- Nguồn: tr.116
- Vấn đề: câu cuối "Sách làm cách khác: lấy diện tích sân 135 m² chia cho diện tích một viên 0,36 m², cũng ra 375 viên" đưa hai số bé chưa từng thấy (135, 0,36 không có ở đề hay ở các dòng `tex`), Haiku chấm mơ hồ ở cả ba lượt. Cách khác này chỉ để bé khỏi hoang mang khi so với trang lời giải; nó không nên làm bé khó hiểu cách chính.
- Sửa: giữ cách chính, đổi câu cuối thành một câu tự chứa: "Sách tính cách khác: sân 15 · 9 = 135 m², một viên gạch 0,6 · 0,6 = 0,36 m², rồi 135 : 0,36 = 375 viên." (nén câu thứ hai nếu cần giữ tối đa 3 câu). Mục này và `$.exercises[77].explain.text` mới viết lại, cần Haiku đọc lại.

## Góp ý

### 1. Câu "Cách làm" hình thoi còn bị chấm "Khó hiểu" khi chỉ đọc chữ

- Vị trí: `$.sections[6].blocks[0].children[0].text` - LL-25
- Nguồn: —
- Vấn đề: Haiku (lượt 5 Khó hiểu, 6 và 7 mơ hồ) nói "cần hình", vì Haiku không thấy hình. Câu đã có "như hình dưới", hình `thoi-gap` ngay dưới và màn "Cùng làm" xoay từng tam giác, nên bé có hình để nhìn; chữ đã được viết lại hai lần.
- Sửa: tuỳ tác giả; nếu sửa thì gọi rõ "bốn tam giác nhỏ ở góc hình chữ nhật, nằm ngoài hình thoi".

### 2. Hai từ "quay" và "xoay" cho cùng một thao tác

- Vị trí: `$.sections[7].blocks[0].children[0].text` ("quay một hình cho đáy lớn lên trên") so với hình `stage-thang` (caption "Xoay ngược một hình thang…") và `$.sections[6]` ("xoay") - LL-05
- Nguồn: —
- Vấn đề: cùng một thao tác ghép hình thang gọi hai từ trong cùng phần 8.
- Sửa: dùng "xoay" ở câu "Cách làm" phần 8.

### 3. "diện tích lúc trước" khác "hình chữ nhật trước khi cắt"

- Vị trí: `$.sections[10].blocks[1].children[2].text` (câu thứ hai) - LL-05
- Nguồn: tr.116
- Vấn đề: câu thứ hai nói "diện tích lúc trước", còn `explain` 4.24 và câu dẫn nói "diện tích hình chữ nhật trước khi cắt".
- Sửa: "Còn diện tích thì bằng diện tích hình chữ nhật trước khi cắt, trừ đi phần bị cắt."

### 4. Lời `wrong` "6 viên là đếm mỗi viên hai lần" khó thấy bằng mắt

- Vị trí: `$.exercises[69].explain.wrong[1].text` (`ex.dan-4-25-dem-vien`, lựa chọn "6 viên"), hình `visual.dan-luc-giac-3` - LL-10
- Nguồn: tr.73
- Vấn đề: hợp lý về số (3 · 2) nhưng hình ba hình thoi không có nét nào chia đôi viên đá, nên bé chọn 6 vì đếm sáu cạnh ngoài hay sáu đỉnh chứ không phải vì "đếm hai lần". Hình ba hình thoi còn dễ bị đọc thành khối lập phương.
- Sửa: "6 là số cạnh ngoài của hình, mỗi viên có hai cạnh ngoài. Phải đếm viên đá, không đếm cạnh."; nếu tác giả muốn, đổi nhãn đề "Hình lục giác đều phẳng" cho hình (nhãn đọc màn hình đã nói "ba viên đá hình thoi").

### 5. Bảng năm công thức đã có a² nhưng chưa có ½

- Vị trí: `visual.nam-hinh-cong-thuc` (`catalog-book.ts`, `$.sections[10].blocks[0]`) so với `visual.thoi-quy-tac`, `visual.thang-quy-tac`
- Nguồn: tr.70, `sbt-p70.png`
- Vấn đề: hình quy tắc phần 7, 8 đã nói "Sách viết ½ · …", còn bảng dùng ở phần bài tập sách bài tập (nơi bé gặp công thức trong đề) chỉ thêm `a²`. Bé gặp ½ ở phần cuối vẫn phải nhớ lại từ phần 7, 8.
- Sửa: thêm cùng dòng ½ vào hai dòng hình thoi, hình thang cân của bảng (vd "Hình thoi: a, b là hai đường chéo; sách viết ½ · a · b").
