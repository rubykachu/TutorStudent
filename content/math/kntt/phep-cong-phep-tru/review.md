# Review: Phép cộng và phép trừ số tự nhiên (`phep-cong-phep-tru`)

- Bài: `content/math/kntt/phep-cong-phep-tru/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff`), section: `toan-thoi-gian`, `them-bot-cong`, `dat-tinh-tru`
- Nguồn đã đọc: không có - `sources/math/phep-cong-phep-tru/` không có trên máy; phần đổi chỉ là số liệu của câu và dữ kiện mẫu đã có trong bài nên đối chiếu bằng tự giải và `note` của bài
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường vì bài vừa sửa), 0 cảnh báo
- `lesson:walk`: không chạy (điều phối không chạy ở vòng này); đã xem ảnh `phep-cong-phep-tru.visual.cot-tru-hang-chuc-651-278` bản iPad và điện thoại
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 2 Góp ý
- Bản đã review: `1415b222b53e1a7879dc7512dc3d2f3cc5a0c36f9ccd63b90c38dbfe8b604fc2` (`pnpm content:diff` so với bản này)

Đã soát (tự giải, độc lập với diff):
- `toan-thoi-gian` màn đầu: dữ kiện "Lớp vào học lúc 7 giờ 30 phút" nay là `note` trong cùng group, kèm "Ta tìm giờ Nam ra khỏi nhà"; caption chỉ còn dữ kiện đường đi (8 + 22 + 2 + 8 = 40). Màn sau (7 giờ 30 = 6 giờ 90, 90 - 40 = 50, ra khỏi nhà 6 giờ 50) và recap vẫn khớp. Group có 3 khối, không vượt giới hạn.
- `chon-gio-di`: 8 giờ 15 = 7 giờ 75; 75 - 28 = 47, tức 7 giờ 47, cộng lại 7 giờ 47 + 28 phút = 8 giờ 15. Nhiễu: 103 = 75 + 28 (cộng thay vì trừ), 13 và 57 đều khác 75 - 28 (57 = 75 - 18, 13 = 75 - 62); chỉ đáp án `a` (47) đúng, khớp `check.expr` 75-28. Số 47 và 28 không có ở câu, mẫu hay hình nào của card `toan-thoi-gian` (mẫu 40 và 50, `tim-gio-xuat-phat` 45, `tim-gio-hai-buoc` 40, `tinh-tong-thoi-gian-2` 40); đáp án không còn trùng 40 hay 45.
- `dien-them-bot`: 58 + 37 = 95, 95 - 60 = 35; đáp án 35 khớp `check.expr`. Lấy 2 của 37 cho 58 được 60 và 35. Số hạng 58, 37 không trùng hình gợi ý 47 + 25, 57 + 26, mẫu 46 + 38, `chon-them-bot` 29 + 46, `chon-tong-them-bot` 45 + 18.
- `cot-tru-hang-chuc`: 642 - 275. Hàng đơn vị đã giải sẵn: 12 - 5 = 7. Hàng chục: 4 - 1 = 3, 3 nhỏ hơn 7 nên mượn, 13 - 7 = 6, số mượn 1; khớp `params` `digit: 6`, `carry: 1`, `column: 1` của `column-try` trong catalog. Ảnh iPad và điện thoại: cột hàng chục sáng, "-1" và "+10", "4 - 1 = 3"; ô kết quả hàng chục là "?", không hiện 6; chữ không chồng, không cắt. Đề "hàng chục đã cho mượn nên bớt đi 1" khớp hình. Đáp án (6, mượn 1) khác `cot-tru-kiem-tra` (7, mượn 1); 642 - 275 không trùng 532 - 247, 586 - 243, 361 - 174, 452 - 187, 725 - 48, 913 - 465, 820 - 345. Không còn nhắc id `541-246` hay `651-278` ở đâu.
- Mục khác cùng ba section, không bị bản sửa làm hỏng: recap của `them-bot-cong`, `dat-tinh-tru`, `toan-thoi-gian` vẫn khớp `note` quy tắc từng chữ; `hint-gio-70-25` và `giai-gio-80-35` thuộc `tim-gio-xuat-phat`, không đổi nên vẫn khớp; `chon-them-bot` vẫn chỉ một đáp án đúng. Nấc 1 của các câu đổi tô phần của đề, không lộ đáp án.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Phụ đề `ghep-tron` "Bạn cú mua ba món hàng." (rút lại, không phải lỗi)

- Vòng này từng đổi "cú" thành "cứ". "Bạn cú" là tên linh vật cú dùng trong mọi video ("Bạn cú có tập hợp A."), nên câu gốc đúng; đã trả lại "Bạn cú" và dựng lại video.

## Góp ý

### 1. Câu quy tắc mượn dài, và "chữ số cuối của kết quả" ở `dat-tinh-cong` dễ lẫn với section "chữ số cuối của tổng"

- Vị trí: `sections[dat-tinh-tru].blocks[1].children[0].text`; `sections[dat-tinh-cong].blocks[1].children[0].text`
- Vấn đề: Câu mượn có mệnh đề chen giữa, khó đọc với người học chậm (đúng về kiến thức). "Kết quả" ở câu nhớ chỉ kết quả của hàng đó nhưng cùng từ với section sau.
- Sửa: Tách câu mượn thành hai câu ngắn; ghi "chữ số cuối của số vừa cộng ở hàng đó". Còn mở vì là câu `rule` nằm trong kịch bản video, sửa phải dựng lại video.

### 2. Đáp án 35 của `dien-them-bot` trùng số hạng 35 của `tinh-them-bot-2` (LL-07)

- Vị trí: `ex.dien-them-bot` (58 + 37 = 60 + ?, đáp án 35); `ex.tinh-them-bot-2` (49 + 35), cùng card `them-bot-cong`
- Vấn đề: Số 35 xuất hiện ở hai câu cùng card (một là số hạng, một là đáp án); không lộ đáp án, chỉ dễ nhớ lẫn.
- Sửa: Nếu muốn tránh hẳn, đổi thành 68 + 24 = 70 + ? (đáp án 22).

---

# Vòng 7 - chỉ phần đổi: `explain` của 93 câu (commit 42a69d7)

- Bài: `content/math/kntt/phep-cong-phep-tru/lesson.json`
- Vòng: 7 - chỉ phần đổi (`pnpm content:diff`): chỉ thêm `explain` ({text, tex?, wrong?}) cho 93 câu, không đổi gì khác
- Nguồn đã đọc: không có - phần đổi là lời giải thích, đối chiếu bằng tự tính và `note` quy tắc của bài; hình đối chiếu `src/visuals/math/phep-cong-phep-tru/catalog.ts` (chỉ đọc)
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường vì bài vừa đổi), 0 cảnh báo của bài
- `lesson:walk`: không chạy (reviewer chỉ đọc nội dung)
- Kết luận: Chưa duyệt: 1 Nghiêm trọng, 9 Nên sửa, 6 Góp ý (tác giả sửa rồi gọi vòng 8)

Đã soát (tự tính từng số trong `text`, `tex` và `wrong` so với đề, lựa chọn, đáp án): 93/93 câu không có số sai; mọi lý do `wrong` đúng với lựa chọn của nó (đã tính lại 26 + 19 = 45, 9 + 62 = 71, 7 + 52 + 3 = 62, 7 + 25 + 13 = 45, 30 + 46 = 76, 29 + 56 = 85, 45 + 28 = 73, 46 + 19 = 65, 66 - 38 = 28, 64 - 40 = 24, 46 - 11 = 35, 40 - 17 = 23, 53 + 19 = 72, 34 + 53 = 87, 34 + 38 = 72, 30 + 36 = 66, 55 + 55 = 110, 45 + 65 = 110). Màu `\concept`: blue số hạng, amber tổng, violet số bị trừ, pink số trừ, teal hiệu, lime nhóm - nhất quán ở mọi câu có màu. Không câu nào nói duy nhất sai ("Chỉ 450 lớn hơn 400", "chỉ 140 nhỏ hơn 150" đều đúng). Các câu `manipulate`, `tapRegion` khớp tham số trong catalog (`ghep-tron-cham` 16, 38, 24: tổng 54, 40, 62; `them-bot-cham` 52 và 27; `cot-*` khớp `column`). Không có "Đúng rồi!"; mỗi `text` không quá 3 câu.

## Nghiêm trọng

### 1. `ex.chon-x-bang-25`: giải thích gọi lựa chọn bằng chữ a, b, c nhưng màn không hiện chữ cái

- Vị trí: `exercises[phep-cong-phep-tru.ex.chon-x-bang-25].explain.text`
- Vấn đề: "Ba đẳng thức a, b, c đều cho x = 25." Lựa chọn trên màn không có nhãn a, b, c (chỉ có ô chọn) và còn bị xáo thứ tự, nên bé không biết a, b, c là đẳng thức nào, khung giải thích gây hiểu nhầm.
- Sửa: "Giải từng đẳng thức bằng quy tắc tìm số hạng, số bị trừ, số trừ. Ba đẳng thức có x = 25 là x + 15 = 40, x - 10 = 15 và 60 - x = 35." (không dùng chữ cái; phần `tex` đã đúng, giữ nguyên).

## Nên sửa

### 1. `ex.chon-quan-he-nhieu`: dùng quy tắc "tổng trừ số hạng" trước khi section dạy nó

- Vị trí: `explain.text`
- Vấn đề: "lấy tổng trừ số hạng đó thì được số hạng còn lại" là quy tắc của section `tim-so-hang` (đứng sau `quan-he`). Section `quan-he` mới dạy "đi ngược" và "số bị trừ bằng hiệu cộng số trừ".
- Sửa: "Phép cộng và phép trừ đi ngược nhau. 25 cộng 17 được 42, nên 42 trừ 17 thì về lại 25. 17 cộng 25 được 42, nên 42 trừ 25 thì về lại 17."

### 2. `ex.dien-so-0`: dùng quy tắc tìm số hạng chưa biết trước section dạy nó

- Vị trí: `explain.text`
- Vấn đề: "Số hạng chưa biết là 58 − 58 = 0" là quy tắc của `tim-so-hang`; câu này thuộc section `cong-voi-0` (quy tắc cần dùng là "cộng một số với 0 thì được chính số đó").
- Sửa: "Tổng bằng đúng số hạng đã biết, nghĩa là không thêm gì vào. Cộng một số với 0 thì được chính số đó, nên số cần tìm là 0."

### 3-6. `ex.chon-uoc-luong-kt`, `ex.chon-uoc-luong`, `ex.dien-uoc-luong`, `ex.chon-uoc-luong-2`: `\cdot` và "3 lần 50" là phép nhân, bài sau mới học

- Vị trí: `explain.tex` (`4 \\cdot 100 = 400`, `5 \\cdot 100 = 500`, `3 \\cdot 50 = 150`); `chon-uoc-luong-2` còn `text` "3 lần 50"
- Vấn đề: Phép nhân là Bài 5 (`phep-nhan-phep-chia`), sau bài này; ngoài `explain`, bài không dùng dấu nhân ở đâu. Bé yếu nhân, chia (`docs/learner.md`).
- Sửa `tex`: `100 + 100 + 100 + 100 = 400`; `100 + 100 + 100 + 100 + 100 = 500`; `50 + 50 + 50 = 150`. Sửa `text` `chon-uoc-luong-2`: "Ba số hạng, mỗi số nhỏ hơn 50, thì tổng nhỏ hơn 50 + 50 + 50 = 150. Trong các số đã cho, chỉ 140 nhỏ hơn 150."

### 7. `ex.chon-uoc-luong`: lý do `wrong` của "Đúng, vì 560 là số lớn" tự mâu thuẫn, và thiếu lý do cho "Sai, vì 560 là số chẵn"

- Vị trí: `explain.wrong`
- Vấn đề: "Đúng hay sai không phụ thuộc số lớn hay nhỏ, mà do so với 500" nghe như phủ nhận chính lý do vì sao 560 sai (nó lớn hơn 500). Lựa chọn c có kết luận "Sai" trùng đáp án nhưng lý do sai; bé chọn c không thấy lời nào.
- Sửa: b: "560 lớn chưa đủ để kết luận đúng; phải so với 500, mà 560 lớn hơn 500 nên sai." Thêm c: "Chẵn hay lẻ không quyết định tổng đúng hay sai; 560 sai vì lớn hơn 500."

### 8. `ex.chon-tong-them-bot`: câu "thêm 5 bớt 5, ... bớt 2 thêm 2" mơ hồ

- Vị trí: `explain.text`
- Vấn đề: không nói thêm, bớt ở số hạng nào; bé chậm không nối được với 45 và 18.
- Sửa: "Thêm vào số hạng này bao nhiêu thì bớt ở số hạng kia bấy nhiêu, tổng không đổi. 50 + 13: 45 thêm 5, 18 bớt 5. 43 + 20: 45 bớt 2, 18 thêm 2."

### 9. `ex.cham-tong`: nhận biết tổng bằng vị trí

- Vị trí: `explain.text`
- Vấn đề: "tổng là số đứng sau dấu bằng" định nghĩa bằng chỗ đứng, trái với quy tắc của bài (tổng là kết quả của phép cộng); viết 23 = 16 + 7 thì sai.
- Sửa: "Kết quả của phép cộng là tổng, nên tổng ở đây là 23. Hai số được cộng là 16 và 7, gọi là số hạng."

## Góp ý

### 1. `ex.chon-tong-sai`: dùng "tận cùng bằng" trong khi bài dùng "chữ số cuối"

- Vị trí: `explain.text`, `explain.wrong[0].text`
- Sửa: "Chữ số cuối của tổng bằng chữ số cuối của 5 + 8 + 7 = 20, tức là 0. Kết quả nào có chữ số cuối khác 0 thì chắc chắn sai: 124, 115 và 118." và wrong a: "110 có chữ số cuối là 0, khớp với chữ số cuối cần có, nên chưa bị loại."

### 2. `ex.tinh-tong-thoi-gian-kt`: `tex` không thể hiện bước nhóm mà `text` nói

- Sửa `tex`: `6 + 18 + 6 = \\concept{lime}{(6 + 6)} + 18 = 12 + 18 = 30`

### 3. `ex.sap-day-so`: `tex` ba dòng không có dấu bằng

- Sửa `tex`: `\\begin{aligned} 14 + 16 + 18 + 20 &= (14 + 20) + (16 + 18) \\\\ &= 34 + 34 \\\\ &= 68 \\end{aligned}`

### 4. `ex.chon-chu-so-cuoi`: lý do `wrong` của "2" nên nêu nhầm lẫn dễ xảy ra hơn

- Sửa: "2 là chữ số đầu của 21, còn chữ số cuối của 21 mới là 1."

### 5. `ex.chon-so-bi-tru`: hai lý do `wrong` nói tên số bé chọn nhầm, chưa nói vì sao không phải số bị trừ

- Sửa: b: "9 là số bớt đi nên là số trừ, không phải số bị trừ." c: "18 là kết quả của phép trừ nên là hiệu, không phải số bị trừ."

### 6. `ex.chon-quan-he-nhieu`, `ex.chon-hieu-tuoi`, mấy câu tìm x: `tex` chưa tô màu khái niệm

- Vấn đề: các câu `quan-he` khác tô teal, pink, violet, còn `chon-quan-he-nhieu` thì không; câu tìm x không tô số hạng, tổng. Không sai, chỉ kém nhất quán.
- Sửa: tuỳ tác giả.

Mục lessons-learned: Nghiêm trọng mới (1): chữ cái lựa chọn trong lời giải thích khi màn không hiện chữ cái. Gần nhất là LL-22 (câu nhắc thứ màn không có); phiên ghi `docs/lessons-learned/` quyết định (reviewer vòng này chỉ được sửa `review.md`).
