# Review: Chu vi và diện tích của một số tứ giác đã học (`chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc`)

- Bài: `content/math/kntt/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp (nhóm 1: tổng quan và phần 1–5; nhóm 2: phần 6–10; nhóm 3: phần bài tập sách bài tập; tệp nhóm ở `.shots/review/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/nhom-<n>-v2.md`)
- Nguồn đã đọc: `sources/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/` - sbt-p70, sbt-p71, sbt-p72, sbt-p73 (kiến thức, ví dụ, đề), sbt-p115, sbt-p116 (lời giải)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): 210 / 8 / 0; tệp `.shots/review/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/doc-hieu.md`. Lượt 4 (chữ sửa sau vòng 1): 50 / 14 / 0, `doc-hieu-4.md`; 14 mục "Hiểu mơ hồ" chưa viết lại, tác giả viết lại sau vòng này.
- `lesson:walk`: 0 FAIL, 0 cảnh báo (iPad dọc, điện thoại, iPad ngang); dùng lại walk trên commit 137d668 vì bài và hình không đổi từ đó; ảnh trong `walk-r1-fix/` của thư mục tạm của phiên review (không commit)
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng. Đã chạy `content:hash --mark`, bài giữ `draft`; không `--approve`, không `content:lock` ở vòng này.
- Bản đã review: `32ed80e7e35744054c1b9da97aa4118a50cc5b63200805b345dfe7c01197b20f` (`pnpm content:diff` so với bản này)

## Trạng thái các mục vòng 1

- Nghiêm trọng 1–5: đã sửa đúng.
- Nên sửa đã sửa đúng: 1–4, 6–13, 15–20, 22–25, 27, 29–31. Nên sửa 5 đã sửa nhưng câu luyện mới trùng đáp số câu kiểm tra (Nên sửa 1 dưới).
- Nên sửa sửa chưa đủ: 14 (một hình nhiều tên, còn ở bài 4.24: Nên sửa 5), 21 (cách nói đổi đơn vị: Nên sửa 7), 26 (tập đếm viên đá: Nên sửa 9), 28 (màu chu vi, diện tích tô lên số khác: Nên sửa 4).
- Góp ý đã sửa: 1, 2, 5, 6, 7, 9–13, 15, 16, 17. Góp ý 14 (số và đơn vị ngắt dòng) sửa đúng hai chỗ đã nêu, còn chỗ khác: Góp ý 3 dưới.
- Góp ý 3: tác giả bỏ qua, lý do ghi ở `task.md`; không ghi lại.
- Góp ý 4 và Góp ý 8: chủ dự án chọn làm, nay là Nên sửa 14 và Nên sửa 12.

## Nghiêm trọng

### 1. Công thức lời giải bài 4.26 và 4.28 bị cắt bên phải trên điện thoại, mất đáp số

- Vị trí: `$.exercises[73].explain.tex` (`ex.sbt-4-26`), `$.exercises[79].explain.tex` (`ex.sbt-4-28`) - LL-12
- Nguồn: — (ảnh walk `phone/200-s11-26-exercise-sbt-4-26-correct.png`, `phone/215-s11-32-exercise-sbt-4-28-correct.png`)
- Vấn đề: hai `tex` xếp `gathered` nhưng mỗi dòng dài 31–36 ký tự, rộng hơn khung "Giải thích" của điện thoại; KaTeX không ngắt dòng trong `gathered` nên phần cuối bị cắt. Bài 4.26 chỉ còn "(2 · (40 + 90) − 5) · 2 = ¦", mất 510 m; bài 4.28 mất "0,6 m" của dòng đầu, "1 400 = 96 m²" và "2 880 000". Đây là màn bé đọc để biết vì sao đúng, nên bé không thấy phép tính cuối và đáp số. iPad hiện đủ; walk không báo vì chữ nằm trong KaTeX. Dòng 4.26 có từ vòng 1 (vòng 1 bỏ sót); dòng 4.28 dài ra khi sửa Nên sửa 21 vòng 1. Cùng chỗ, `explain` 4.26 cộng `40 + 90` còn hình lời giải cộng `90 + 40` (Nên sửa 23 vòng 1 chọn chiều dài trước).
- Sửa: mỗi dòng `gathered` một phép, tối đa 22 ký tự, cùng thứ tự với hình lời giải. 4.26: `3\,600 : 40 = 90`, `2 \cdot (90 + 40) = 260`, `260 - 5 = 255`, `255 \cdot 2 = 510\ \mathrm{m}`. 4.28: `60\ \mathrm{cm} = 0{,}6\ \mathrm{m}`, `30 \cdot 20 = 600`, `0{,}36 \cdot 1\,400 = 504`, `600 - 504 = 96\ \mathrm{m}^{2}`, `96 \cdot 30\,000`, `= 2\,880\,000`. `explain` giữ tối đa 3 câu chữ. Chạy walk lại và mở hai ảnh `phone/…-correct`.

## Nên sửa

### 1. Câu luyện phần 4 có cùng đáp số 9 với câu kiểm tra ngay trước

- Vị trí: `$.exercises[17]` (`ex.mieng-dan-9-o`, hình `visual.f-chu-l-9-o`); so với `$.exercises[16]` (`ex.dien-tich-9-o-1m`) - LL-07, LL-20
- Nguồn: —
- Vấn đề: câu kiểm tra vừa ra 9 m², câu luyện kế tiếp lại ra 9 cm²; bé dễ gõ lại 9 mà không đếm hình, câu luyện mất tác dụng tập đếm ô mà vòng 1 sửa để có.
- Sửa: hình chữ L có số ô khác mọi số của phần 4 (7, 9, 10, 12, 4, 8), ví dụ 11 ô (hàng 3, 3, 5 trên lưới 5 × 3); đổi khoá hình, nhãn đọc màn hình, `id` câu, `explain`, `tex`, `answer`, `check.expr` theo.

### 2. Lý do `wrong` "không nhân chúng" nằm cạnh đáp án đúng có phép nhân

- Vị trí: `$.exercises[3].explain.wrong[1]` (`ex.chu-vi-chon-phep-tinh`), `$.exercises[13].explain.wrong[1]` (`ex.chon-phep-tinh-cn-9-5`) - LL-10
- Nguồn: —
- Vấn đề: đáp án đúng chứa "2 ·", nhưng lý do của nhiễu viết "Chu vi cộng các cạnh với nhau, không nhân chúng." Bé hiểu "chu vi không có phép nhân" thì nghi luôn đáp án đúng.
- Sửa: "Chu vi cộng các cạnh với nhau, không nhân các cạnh với nhau." ở cả hai câu.

### 3. Lý do `wrong` gọi phép tính dùng chiều cao hay đường chéo là "một phép tính chu vi"

- Vị trí: `$.exercises[30].explain.wrong[1]` (`ex.dt-bbh-13-6`, lựa chọn "38"), `$.exercises[35].explain.wrong[2]` (`ex.dt-thoi-16-9`, lựa chọn "50") - LL-10, LL-17
- Nguồn: tr.70, `sbt-p70.png`
- Vấn đề: "38 là 2 · (13 + 6), một phép tính chu vi" đọc thành chu vi hình bình hành bằng 2 · (đáy + chiều cao); "50 là 2 · (16 + 9)" đọc thành chu vi hình thoi bằng 2 · (tổng hai đường chéo). Cả hai đều sai và gieo đúng lỗi nhầm chiều cao với cạnh mà mẹo phần 6 cảnh báo.
- Sửa: "38 là 2 · (13 + 6): cộng cạnh đáy với chiều cao rồi nhân 2. Diện tích phải nhân cạnh đáy với chiều cao."; "50 là 2 · (16 + 9): cộng hai đường chéo rồi nhân 2. Diện tích phải nhân hai đường chéo rồi chia cho 2."

### 4. Màu chu vi, diện tích còn tô lên số không phải chu vi hay diện tích (Nên sửa 28 vòng 1 sửa chưa đủ)

- Vị trí: `$.exercises[47].explain.tex` (`ex.rao-vuon-15-10`: 48), `$.exercises[72].explain.tex` (`ex.dan-4-26-rao`: 98), `$.exercises[73].explain.tex` (`ex.sbt-4-26`: 510); `stages.ts` `trapezoidFrames()`, `trapezoidJoin()` (nhãn đáy "4 cm", "8 cm" blue, "4 + 8 = 12 cm" teal), `parallelogramFrames()`, `parallelogramSlide()` (nhãn đáy "6 cm" blue), dùng ở `visual.bbh-cat-ghep`, `visual.stage-bbh`, `visual.thang-ghep`, `visual.stage-thang`; `catalog-book.ts` `PAIRS["4-26"]` thẻ `cTag("trừ chỗ cửa")`, `cTag("chu vi trừ cửa")`, `PAIRS["4-23"]` thẻ `cTag("tổng")` - LL-05
- Nguồn: —
- Vấn đề: bài gắn blue với chu vi, teal với diện tích. 48 m, 98 m, 255 m là chu vi đã trừ cửa, 510 m là hai tầng dây, 620 cm gồm cả đường chéo, "12 cm" là đáy, "4 cm", "6 cm" là một cạnh: không số nào là chu vi hay diện tích. Mẹo `phan-bo-ra` để 61 m mực thường nên cùng một dạng số có hai cách tô; hình câu hỏi cùng phần ghi số đo bằng mực thường.
- Sửa: bỏ `\concept{blue}` ở 48, 98, 510; ba thẻ hàng đổi sang `nTag` (slate); trong bốn hình phần 6, 8, nhãn đáy và "4 + 8 = 12 cm" dùng `ink`, giữ teal cho các dòng diện tích và violet cho chiều cao. Chụp lại `visual:shot` các hình đã đổi.

### 5. Bài 4.24 và câu dẫn gọi phần bị cắt và hình chữ nhật ban đầu bằng nhiều tên (Nên sửa 14 vòng 1 sửa chưa đủ)

- Vị trí: `$.sections[10].blocks[1].children[2]`; `$.exercises[66].explain.text` (`ex.dan-4-24-dt`: "góc bị cắt"); `$.exercises[67].explain.text` (`ex.sbt-4-24`: "chỗ thiếu", "phần thiếu"); `catalog-book.ts` `PAIRS["4-24"]` thẻ `sTag("hình lớn trừ phần thiếu")` - LL-05, LL-25
- Nguồn: tr.116
- Vấn đề: câu "Cách làm" dùng "hình chữ nhật trước khi cắt" và "phần bị cắt", nhưng câu dẫn, `explain` 4.24 và hai hình ngay sau dùng "hình lớn", "phần thiếu", "góc bị cắt", "chỗ thiếu". Bé chậm gặp bốn tên cho hai thứ.
- Sửa: một cặp tên ở mọi chỗ, theo câu "Cách làm"; thẻ hàng `sTag("hình chữ nhật trừ phần bị cắt")`; `explain` 4.24 "…trừ đi phần bị cắt 2 m và 2 m".

### 6. Bài 4.24 không chỗ nào chỉ cách tìm cạnh của phần bị cắt

- Vị trí: `$.exercises[67]` (`ex.sbt-4-24`): `explain.text`, `PAIRS["4-24"].solution`, `solutionFigure`, `PAIRS["4-24"].hint` - LL-15, LL-16
- Nguồn: tr.72 Hình 4.20, tr.116
- Vấn đề: đề không cho hai cạnh của phần bị cắt; bé phải suy 8 − 6 = 2 m và 6 − 4 = 2 m. Câu dẫn và hình gợi ý cho sẵn cạnh khuyết, `explain` nói thẳng "2 m và 2 m", hình lời giải nhảy tới `8 · 6 − 2 · 2`. Đây là bước bé dễ kẹt nhất, và phần bài tập sách bài tập đòi hướng dẫn từng bước với số của câu.
- Sửa: hàng đầu lời giải `8 − 6 = 2 m, 6 − 4 = 2 m` (thẻ slate "cạnh phần bị cắt") và nhãn "4 m", "6 m" trên hình lời giải; `explain` thêm "Cạnh của phần bị cắt: 8 − 6 = 2 m và 6 − 4 = 2 m." (giữ tối đa 3 câu); hình gợi ý có hàng tìm cạnh với số của ví dụ (vd `10 − 7 = 3`, `5 − 4 = 1`). Có thể cho câu dẫn `dan-4-24-dt` chỉ ghi các cạnh ngoài, số khác đề.

### 7. Câu "Cách làm" nói "ra m để tính diện tích", trái với phần 9 (Nên sửa 21 vòng 1 sửa chưa đủ)

- Vị trí: `$.sections[10].blocks[3].children[3]` - LL-05, LL-10
- Nguồn: tr.71 ví dụ 1, tr.116
- Vấn đề: đọc như luật chung "tính diện tích thì đổi ra m", trong khi phần 9 (`ex.bia-3m-40cm`, mẹo `cung-don-vi`) đổi ra cm rồi tính cm². Bài 4.28 đổi ra m chỉ vì giá cỏ tính theo mét vuông.
- Sửa: "Đổi các số đo về cùng một đơn vị: ra cm để đếm gạch theo hàng, ra m khi giá tính theo mét vuông."

### 8. Ngân hàng số của bài 4.23: đáp án luôn là số lớn nhất

- Vị trí: `$.exercises[64].bank` (`ex.sbt-4-23`) - LL-14
- Nguồn: tr.115–116
- Vấn đề: 480 và 420 đều là tổng thiếu phần, nên 620 luôn lớn nhất; bé chọn số lớn nhất rồi "không đủ" mà không tính.
- Sửa: thêm nhiễu lớn hơn 620 từ lỗi thật, ví dụ 760 (hai đường chéo tính như chu vi hình chữ nhật: 280 + 200 + 280) và 660 (lấy 60 cm làm cạnh hình thoi: 280 + 240 + 140).

### 9. Câu dẫn đếm viên đá có đáp án 6, đúng số bé hay đếm nhầm ở bài 4.25 (Nên sửa 26 vòng 1 sửa chưa đủ)

- Vị trí: `$.exercises[69]` (`ex.dan-4-25-dem-vien`), hình `visual.dan-luc-giac-6` - LL-07, LL-16
- Nguồn: tr.73
- Vấn đề: lục giác 6 tam giác một màu, đáp án 6: bé vừa được khen "6 viên" ngay trước bài 4.25 (8 viên, 2 viên giữa khác màu) nên dễ đếm 6 hơn. Hình không có mảnh khác màu ở giữa, không tập đúng chỗ dễ sai.
- Sửa: hình có mảnh giữa khác màu, đáp án khác 6 và 8 (vd lục giác ghép từ 3 hình thoi, 1 hình thoi tô xám); nhiễu là số chỉ đếm mảnh nhạt; `wrong` "Viên màu xám cũng là một viên đá, phải đếm cả nó."

### 10. Câu dẫn bài 4.26 dùng lại sân 20 m, 30 m và 600 m² của bài 4.28

- Vị trí: `$.exercises[71]` (`ex.dan-4-26-dai`), `$.exercises[72]` (`ex.dan-4-26-rao`) - LL-07
- Nguồn: tr.73 bài 4.28, tr.116
- Vấn đề: bé gặp 600 m² và cặp 30 m, 20 m hai lần ngay trước bài 4.28 hỏi đúng sân đó; vòng 1 (Nên sửa 6) đã đổi một câu vì cùng cặp số.
- Sửa: vd `dan-4-26-dai` "diện tích 750 m², chiều rộng 25 m" (30 m); `dan-4-26-rao` "dài 30 m, rộng 25 m, cửa 2 m" (108 m); sửa `check.expr`, `explain`; soát số mới không trùng tr.72–73.

### 11. "Bị cắt mất một góc vuông" đọc được thành cắt chéo một góc

- Vị trí: `$.sections[10].blocks[1].children[2]`; hình `visual.khuyet-cach-lam` (`catalog-book.ts`: nhãn "Chu vi hình chữ nhật bị cắt một góc", caption bước 2 "Cắt đi một góc rộng 3 m, cao 2 m.") - LL-10
- Nguồn: tr.116 (Hình 4.27)
- Vấn đề: cắt bỏ cái góc theo đường chéo thì chu vi giảm; câu chỉ đúng khi phần bị cắt là hình chữ nhật nhỏ ở góc, như hình và câu dẫn.
- Sửa: "Hình chữ nhật bị cắt mất một hình chữ nhật nhỏ ở góc có chu vi bằng chu vi hình chữ nhật trước khi cắt." (câu diện tích thêm "diện tích": "…bằng diện tích hình chữ nhật trước khi cắt trừ đi diện tích phần bị cắt."); nhãn và caption bước 2 của `khuyet-cach-lam` nói "cắt đi một hình chữ nhật nhỏ ở góc".

### 12. Chưa nối "chia cho 2" với cách sách viết ½ (Góp ý 8 vòng 1, chủ dự án chọn làm)

- Vị trí: màn quy tắc phần 7 (`$.sections[6].blocks[1]`, hình `visual.thoi-quy-tac`) và phần 8 (`$.sections[7].blocks[1]`, hình `visual.thang-quy-tac`)
- Nguồn: tr.70, `sbt-p70.png` (`S = ½ab`, `S = ½(a + b)h`)
- Vấn đề: sách và đề kiểm tra viết "½", bài chỉ nói "chia cho 2"; bé gặp ½ trong đề sẽ không nhận ra công thức đã học.
- Sửa: thêm một dòng ngắn ở hai chỗ dạy công thức, ví dụ dòng thêm dưới công thức của hình quy tắc (caption nhiều dòng của `gallery.tsx`): hình thoi "Sách viết ½ · a · b, nghĩa là a · b : 2."; hình thang cân "Sách viết ½ · (a + b) · h, nghĩa là (a + b) · h : 2." Không dạy phân số; không đổi câu quy tắc, recap.

### 13. Chưa nối "a · a" với cách sách viết a²

- Vị trí: hình `visual.dt-cn-quy-tac` (caption "Hình vuông: S = a · a"), `$.sections[4].blocks[1]`, kéo theo bảng `visual.nam-hinh-cong-thuc`
- Nguồn: tr.70, `sbt-p70.png` (`S = a²`, `S = ab`)
- Vấn đề: cùng loại với Nên sửa 12: sách và đề kiểm tra viết `S = a²` (và viết liền `ab`, `ah`), bài chỉ viết `a · a`. Xếp cùng mức với ½ vì cùng lý do chủ dự án đã chọn (bé phải nhận ra công thức khi gặp trong đề), lại rẻ và an toàn hơn: luỹ thừa đã dạy ở chương I nên dòng này không đưa kiến thức mới.
- Sửa: thêm dòng dưới công thức hình vuông của `dt-cn-quy-tac`: "Sách viết a · a là a²." Tuỳ tác giả thêm "ab nghĩa là a · b" một lần ở hình chữ nhật.

### 14. Hình quy tắc phần 2, 3, 5 nhỏ trên điện thoại (Góp ý 4 vòng 1, chủ dự án chọn làm)

- Vị trí: `visual.c4a-quy-tac`, `visual.c2ab-quy-tac` (`catalog-chu-vi.ts`), `visual.dt-cn-quy-tac` (`catalog-dien-tich.ts`), thành phần `gallery.tsx` của bài (`src/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/`)
- Nguồn: — (ảnh walk `phone/027-s2-02-block.png`, `phone/040-s3-02-block.png`, `phone/066-s5-02-block.png`)
- Vấn đề: hai hình cạnh nhau, mỗi hình khoảng 1/3 bề ngang, công thức cỡ chú thích, nửa màn trống; hình quy tắc phần 6–8 đã là một hình lớn với công thức chữ đậm cỡ thân bài. Năm hình quy tắc hai kiểu. Sửa được trong code riêng của bài (`gallery.tsx` nằm trong thư mục hình của bài), không cần đổi code dùng chung.
- Sửa: ba hình quy tắc xếp một cột (`columns: 1`) như phần 6–8, hay giữ hai cột nhưng công thức cỡ thân bài và hình rộng hơn; dùng chung một kiểu cho cả năm hình quy tắc. Xem lại ảnh walk điện thoại và iPad ngang (màn quy tắc và recap).

## Góp ý

### 1. Lý do của nhiễu 200 nói tới "chia cho 2" mà bài chưa dạy tới

- Vị trí: `$.exercises[21].explain.wrong[2]` (`ex.gach-vuong-20`) - LL-09, LL-14
- Nguồn: —
- Vấn đề: câu ngay sau phần 5; "chia cho 2" chỉ có ở phần 7, 8. Lỗi nhân nhẩm gặp nhiều hơn ở bé (`docs/learner.md`).
- Sửa: nhiễu 4000, `wrong`: "20 · 20: lấy 2 · 2 = 4 rồi viết thêm hai chữ số 0, được 400."

### 2. Hình đi một vòng ghi số đo cạnh không kèm đơn vị

- Vị trí: `visual.vuon-di-vong`, `visual.vuong-di-vong`, `visual.chu-nhat-di-vong`, `visual.walk-thang-can`, `visual.walk-thoi`, `visual.walk-binh-hanh` (`catalog-chu-vi.ts`, `walk.tsx`) - LL-15
- Nguồn: —
- Vấn đề: nhãn cạnh "8", "5" trong khi hình câu hỏi ghi "5 m", "9 cm".
- Sửa: nhãn cạnh kèm đơn vị nếu khung đủ chỗ trên điện thoại.

### 3. Số và đơn vị còn ngắt hai dòng (Góp ý 14 vòng 1 còn sót)

- Vị trí: câu quy tắc phần 9 `$.sections[8].blocks[1].children[0].text` (kéo theo recap phần 9, thẻ `card.doi-don-vi`: "10 000 / cm²"); `stages.ts` caption khung 1 của `trapezoidFrames()`, `rhombusFrames()`; đề `ex.sbt-4-21`, `ex.sbt-4-22c`, `ex.sbt-4-22d`, `ex.dan-4-26-dai`, `ex.sbt-4-27`, `ex.sbt-4-28` (walk điện thoại `163`, `173`, `175`, `195`, `205`, `214`; iPad dọc `119`)
- Nguồn: —
- Vấn đề: số cuối dòng, đơn vị xuống dòng; một chỗ là câu quy tắc cần nhớ.
- Sửa: U+00A0 giữa mọi số và đơn vị (chữ sách không đổi); có thể gom một hàm ghép "số + đơn vị" cho caption của `stages.ts`.

### 4. Note "Cùng làm" phần 8 không nhắc nút "Đo đáy"

- Vị trí: `$.sections[7].blocks[3].children[0].text`
- Nguồn: —
- Vấn đề: nút thứ hai hiện ra mà note không nói, khác phần 6.
- Sửa: "Cùng làm: bấm "Ghép thêm" rồi "Đo đáy" để ghép hai hình thang giống hệt. …"

### 5. Mẫu sơn tường trong mẹo không hiện phép nhân

- Vị trí: `$.sections[9].blocks[3].tex` (`tip.phan-bo-ra`) - LL-16
- Nguồn: —
- Vấn đề: `tex` chỉ ghi `18 - 4 = 14`, bé phải đoán 18 là 6 · 3, 4 là 2 · 2.
- Sửa: dòng hai thành `6 \cdot 3 - 2 \cdot 2 = \concept{teal}{14}\ \mathrm{m}^{2}`.

### 6. Câu ôn lát gạch cần năm phép tính

- Vị trí: `$.exercises[50]` (`ex.lat-gach-7-3`) - LL-18
- Nguồn: —
- Vấn đề: đổi hai số đo, chia hai lần rồi nhân, vượt mức cho bé yếu nhân chia.
- Sửa: thêm `hintVisualId` dạng `calc` số khác đề, dừng ở "?" trước phép nhân cuối; hoặc cho sẵn một chiều đã đổi.

### 7. Đề sắp xếp bước lát gạch không nói sàn đo bằng m, gạch bằng cm

- Vị trí: `$.exercises[51].prompt[0].text` (`ex.xep-buoc-lat-gach`) - LL-10
- Nguồn: —
- Vấn đề: bước "Đổi … ra cm" chỉ cần khi hai đơn vị khác nhau, đề không cho biết.
- Sửa: "Sàn đo bằng mét, gạch đo bằng xăng-ti-mét. Sắp xếp các bước tính số viên gạch lát kín sàn."

### 8. Hình thang khung đầu nhỏ, lệch trái trên điện thoại

- Vị trí: `visual.thang-ghep` khung 1–2, `visual.stage-thang` trạng thái đầu (`trapezoidGeo`) - LL-12
- Nguồn: — (ảnh `phone/104-s8-01-block.png`, `phone/108-s8-04-block.png`)
- Vấn đề: khung chừa chỗ cho bản sao ghép, hình thang rộng khoảng 140 px sát trái.
- Sửa: căn giữa hình thang ở khung chưa ghép, hay thu khung đầu theo bề rộng hình.

### 9. Công thức lời giải một dòng ngắt giữa ngoặc trên điện thoại

- Vị trí: `$.exercises[63].explain.tex` (`ex.dan-4-23-tong`), `$.exercises[76].explain.tex` (`ex.sbt-4-27`) - LL-12
- Nguồn: — (walk điện thoại `180`, `206`)
- Vấn đề: không mất chữ nhưng ngoặc bị tách hai dòng.
- Sửa: xếp `gathered`, mỗi dòng một phép, tối đa 22 ký tự (như Nghiêm trọng 1).

### 10. Câu dẫn hình thang cân dùng lại hai đáy 6 cm và 10 cm của bài 4.22b

- Vị trí: `$.exercises[68]` (`ex.dan-4-25-thang`) - LL-07
- Nguồn: tr.72 bài 4.22b
- Vấn đề: cùng hai đáy, chỉ khác chiều cao; bé vừa làm 4.22b vài câu trước.
- Sửa: hai đáy khác, ví dụ 3 cm và 11 cm, cao 3 cm (21 cm²), soát không trùng số tr.72–73 và hình gợi ý.

### 11. Bảng năm công thức ghi nghĩa chữ khác hình quy tắc

- Vị trí: `visual.nam-hinh-cong-thuc` (`catalog-book.ts`, `$.sections[10].blocks[0]`) so với `visual.bbh-quy-tac`, `visual.dt-cn-quy-tac`
- Nguồn: —
- Vấn đề: bảng viết "Hình bình hành: a đáy, h chiều cao", "Hình thang cân: a, b hai đáy, h chiều cao" (thiếu "là"), còn hình quy tắc viết "a là cạnh đáy, h là chiều cao"; thuật ngữ glossary là "cạnh đáy". Một khái niệm hai cách gọi giữa phần 6 và phần bài tập.
- Sửa: chép nguyên dòng nghĩa chữ của hình quy tắc vào bảng ("a là cạnh đáy, h là chiều cao"; "a, b là hai đáy, h là chiều cao"); nếu làm Nên sửa 12, 13 thì bảng thêm cùng dòng ½, a².
