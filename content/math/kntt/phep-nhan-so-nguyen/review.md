# Review: Phép nhân số nguyên (`phep-nhan-so-nguyen`)

- Bài: `content/math/kntt/phep-nhan-so-nguyen/lesson.json`
- Lịch sử: vòng 1: 5 Nghiêm trọng, 17 Nên sửa, 20 Góp ý; vòng 2: 1 Nghiêm trọng, 20 Nên sửa, 17 Góp ý; vòng 3: 0 Nghiêm trọng, 5 Nên sửa, 8 Góp ý.
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`, so với bản vòng 3), section: duong-nhan-am, am-nhan-am, dau-cua-tich, giao-hoan-ket-hop, nhieu-thua-so, gop-thua-so, bai-toan-thuc-te (cùng kho ôn của card dau-cua-tich)
- Nguồn đã đọc: `sources/math/phep-nhan-so-nguyen/` - không mở lại trang nào: bản sửa chỉ đổi cách nói, hai cặp của kho ôn và một câu giải thích, không đổi đề hay đáp án của bài sách (đề tr.55 đến tr.57, lời giải tr.112, 113 đã đối chiếu ở vòng 1 và 2)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa có trong `ids.lock.json`: đúng, bài chưa được duyệt nên chưa khoá id)
- Đọc hiểu (Haiku): lượt 1 181 / 47 / 0 (`.shots/review/phep-nhan-so-nguyen/doc-hieu.md`); lượt 2 trên 106 mục đổi 89 / 17 / 0 (`doc-hieu-2.md`); lượt 3 trên 21 mục viết lại 16 / 5 / 0 (`doc-hieu-3.md`); lượt 4 trên 19 mục chữ đổi sau vòng 3 8 / 11 / 0 (`doc-hieu-4.md`). Đã quá 3 lượt: các nhận xét lượt 4 là kiểu "hơi mơ hồ" chung, gộp vào Nên sửa mục 2, không chặn duyệt.
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-nhan-so-nguyen/` (đã đọc contact sheet điện thoại của section 2, 3, 4, 5, 6, 7, 8: chữ mới không chồng, không bị cắt, hình bài vừa màn)
- Kết luận: Đạt: 0 lỗi Nghiêm trọng (0 Nghiêm trọng, 2 Nên sửa, 6 Góp ý). Chưa chạy lệnh cuối vòng: điều phối chạy `pnpm content:hash phep-nhan-so-nguyen --root content --approve`, rồi `pnpm content:lock phep-nhan-so-nguyen`; lệnh đó ghi dòng "Bản đã review".

Kiểm bản sửa vòng 3 (mục 1 đến 11 của review vòng 3): 10 đã sửa đúng và không sinh lỗi mới; mục 11 (kho ôn `noi-tich-voi-ket-qua`) đã bỏ trùng với hai câu luyện ở section khác nhưng hai cặp mới lại gần như trùng một câu kho ôn khác của cùng card (Nên sửa 1).
- Quy tắc tích nhiều thừa số (mục 1): "số chẵn, như 0, 2, 4" và "số lẻ, như 1, 3, 5" phủ mọi số thừa số âm; "số chẵn", "số lẻ", "thừa số" đều có trong glossary. Note `rule: true` của section 8 lặp nguyên văn ở recap section và recap card (đối chiếu bằng script: cả 12 section khớp note, recap section giống recap card). Không còn "2, 4 hay 6" ở chỗ nào trong chữ, hình hay tip.
- Cách nói ghép cặp (mục 2): note section 7, nhãn hình `ghep-nhanh` và `goi-y-ghep-nhanh`, hai `explain` của `tinh-nhanh-am4-3-am5` và `tinh-nhanh-am25-7-4` đều nói "ghép hai số nhân ra …"; tip section 10 giữ "cộng ra 10, 20 hoặc 100" (đúng, đó là phép cộng). Hết "tích tròn chục".
- Mục 3, 4, 5, 6, 7, 8, 9, 10: chữ mới đúng toán, khớp hình; "số đứng sau dấu nhân" khớp nhãn nút của hình; "thừa số chung" ở tip; "3 giờ trước" và "2 giờ trước" không còn "lúc"; lời giải `xep-tich-khac-dau` đã nói thứ tự của −9 và −7; section 6 nói "sau 2 giờ và 2 giờ trước" khớp bốn dòng hình. Phần Haiku lượt 4 còn mơ hồ ghi ở Nên sửa 2; chỗ còn lệch chữ ghi ở Góp ý 3 và 4.
- Kho ôn `noi-tich-voi-ket-qua` (mục 11): `pairs` đúng: (−6) · 3 = −18 (l1-r4), 4 · (−5) = −20 (l2-r2), (−3) · (−3) = 9, 0 · (−6) = 0, (−6) · (−1) = 6; cột phải có 6 tích, chỉ r5 = 18 không thuộc cặp nào và không phải đáp án của dòng nào (LL-01).

Đã tự giải trước khi đọc đáp án mọi exercise đổi: `xep-tich-khac-dau` (−15 < −9 < −7), `nhiet-do-cach-day-4` (12), `noi-tich-voi-ket-qua` (5 cặp như trên), `tinh-nhanh-am4-3-am5` (60), `tinh-nhanh-am25-7-4` (−700), `cach-day-2-gio` (−8); các câu `dau-tich-ba-so`, `chon-so-sanh-ba-so`, `dem-hai-so-am` có `explain`/`wrong` đổi: (−3) · (−2) · (−5) = −30 âm, (−5) · (−1) · (−4) âm nên "> 0" sai, (−2)⁴ dương nên "< 0" sai. Đều khớp `answer`, `check`; không đáp án nhiễu nào cũng đúng (LL-01); không `explain`/`wrong` nào gọi lựa chọn theo vị trí (LL-26); nấc 1 và nấc 2 không đổi. Không câu nào chép lời sách.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Hai cặp mới của `noi-tich-voi-ket-qua` lặp số của `so-sanh-hai-tich`, cùng card `dau-cua-tich`

- Vị trí: `$.exercises[28]` (`ex.noi-tich-voi-ket-qua`): `(-6) · 3` và `4 · (-5)` (cột trái `l1`, `l2`; cột phải `r4`, `r2`); đối chiếu `ex.so-sanh-hai-tich` (đề "(−4) · 5 và 3 · (−6)", tích −20 và −18). LL-07, LL-20.
- Nguồn: —
- Vấn đề: bản sửa vòng 3 bỏ trùng với câu luyện ở section khác nhưng chọn đúng bộ số của câu kho ôn thứ hai gắn cùng card: `(−6) · 3` là `3 · (−6)` đổi chỗ, `4 · (−5)` là `(−4) · 5` đổi chỗ, hai đáp án −18 và −20 cũng trùng. Một phiên ôn card này hiện cả hai câu liền nhau nên bé thấy lại cùng hai tích; gợi ý ở vòng 3 chọn số chưa soát hết kho ôn của card.
- Sửa: đổi hai cặp sang số không có trong câu nào của card này, vd `7 · (−6) = −42` và `(−9) · 5 = −45` (cả hai chưa xuất hiện ở đâu trong bài), sửa `r2`, `r4` tương ứng; cột phải vẫn để một số nhiễu cùng độ lớn khác dấu (vd 45). Soát lại các câu kho ôn khác của card sau khi đổi số.

### 2. Haiku lượt 4: 11 trên 19 mục chữ đổi vẫn "Hiểu mơ hồ" (gộp, không chặn duyệt)

- Vị trí: `$.sections[2].blocks[0]`, `$.sections[4].blocks[0]`, `$.exercises[62].explain` ("Ta ghi … là …" cần đoán); `$.sections[2].blocks[1]`, `$.sections[4].blocks[1]` ("Cứ đi tiếp"); `$.sections[5].blocks[0]` ("nên có bốn tích"); `$.sections[7].blocks[1]`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption` ("số thừa số âm"); `$.sections[9].blocks[3]` ("đưa … ra ngoài"); `$.exercises[19].explain.text` ("phần số"). LL-25.
- Nguồn: —
- Vấn đề: các lý do Haiku nêu đều ngắn ("cần đoán", "phức") và kiểu chung của câu ngắn, đã quá giới hạn 3 lượt. Chỉ hai chỗ đáng sửa tay vì câu mới yếu hơn câu bé cần: (a) câu section 3 và 5 đảo thành "Ta ghi 2 giờ sau là 2 và 2 giờ trước là −2, nên 3 · (−2) = −6 là thấp hơn bây giờ 6 độ": chữ "nên" nối "ghi số" với "thấp hơn" như thể −2 là nguyên nhân của việc thấp hơn, và "ghi" không nói ghi cái gì; (b) câu quy tắc section 8 phải đọc cụm "số thừa số âm" hai lần.
- Sửa (tuỳ chọn, nếu sửa thì chép nguyên văn quy tắc vào hai recap): (a) "Nhiệt độ tăng đều 3 độ mỗi giờ. Ta đặt 2 giờ sau là số 2 và 2 giờ trước là số −2. Vì vậy 2 giờ trước, nhiệt độ thấp hơn bây giờ 6 độ: 3 · (−2) = −6." (b) "Đếm các thừa số âm. Nếu có chẵn thừa số âm (0, 2, 4, …) thì tích là số dương; nếu có lẻ thừa số âm (1, 3, 5, …) thì tích là số âm." (tích các số khác 0). Các mục còn lại giữ, không cần Haiku đọc lại.

## Góp ý

### 3. "2 giờ sau" ở chữ và tiêu đề hình, "sau 2 giờ" ở nhãn hình và section 6

- Vị trí: `$.sections[2].blocks[0].children[0].text` ("Ta ghi 2 giờ sau là 2"); `src/visuals/math/phep-nhan-so-nguyen/catalog.ts` hình `bon-truong-hop` (tiêu đề "xét 2 giờ sau hoặc 2 giờ trước"); đối chiếu nhãn "sau 2 giờ: cao hơn 6 độ" của hình `tang-giam-vi-du` và note section 6 "sau 2 giờ và 2 giờ trước". LL-05.
- Nguồn: —
- Vấn đề: mục 5 của vòng 3 đã đòi chốt "sau 2 giờ"; note section 6 đã đổi nhưng note section 3 (ngay trên nhãn "sau 2 giờ") và tiêu đề hình còn "2 giờ sau".
- Sửa: đổi hai chỗ thành "sau 2 giờ".

### 4. "phần số" trong lời giải so sánh số âm, các chỗ khác nói "phần số tự nhiên"

- Vị trí: `$.exercises[19].explain.text` và `$.exercises[31].explain.text` (`ex.so-sanh-hai-tich`), cùng dòng "số nào có phần số lớn hơn thì số đó bé hơn". LL-05, LL-25.
- Nguồn: —
- Vấn đề: glossary và mọi chỗ khác của bài dùng "phần số tự nhiên"; ở hai lời giải này cụm bị rút còn "phần số", Haiku lượt 4 ghi mơ hồ.
- Sửa: "số nào có phần số tự nhiên lớn hơn thì số đó bé hơn".

### 5. Ba lời giải bỏ "3 là số lẻ" nên không còn nối với quy tắc chẵn/lẻ

- Vị trí: `$.exercises[37].explain.text` (`ex.dau-tich-ba-so`), `$.exercises[39].explain.wrong[0]`, `[1]` (`ex.chon-so-sanh-ba-so`), `$.exercises[42].explain.wrong[0]` (`ex.dem-hai-so-am`). LL-05.
- Nguồn: —
- Vấn đề: bản sửa vòng 3 bỏ "mà 3 là số lẻ" để khỏi lẫn với "2, 4 hay 6"; nay quy tắc đã nói "chẵn", "lẻ" nên câu "Có 3 thừa số âm, nên tích là số âm" nhảy bước, bé không thấy 3 thuộc vế nào của quy tắc.
- Sửa: trả lại "Có 3 thừa số âm, mà 3 là số lẻ, nên tích là số âm" và hai câu tương ứng (4 là số chẵn, 2 là số chẵn).

### 6. Quy tắc nói "10, 20 hoặc 100" mà lời giải `tinh-nhanh-am25-7-4` ghép ra −100

- Vị trí: `$.exercises[33].explain.text` ("nhân ra −100"); `$.sections[6].blocks[2].children[0].text`, nhãn hình `goi-y-ghep-nhanh`.
- Nguồn: —
- Vấn đề: chữ dạy 10, 20, 100 (dương); câu luyện ghép ra −100; bé có thể không nhận ra đó là cùng việc.
- Sửa: note và nhãn: "ghép hai số nhân ra 10, 20, 100 (hay −10, −20, −100)"; hoặc `explain` của câu 33: "nhân ra một số tròn trăm: (−25) · 4 = −100".

### 7. Bố cục điện thoại còn hai chỗ phải cuộn (việc của người làm app, ghi nhận)

- Vị trí: hình `am2-nhan3` (ảnh phone `006-s1-01-block-end`: ba nhãn "−2" cạnh hình thoi đọc thành "♦−2♦−2♦−2"); lời kết của `cung-2-nhan-am2` (`039-s3-04-block-shown`) và `cung-am2-nhan-am3` (`061-s5-04-block-shown`) nằm dưới thanh nút cuối màn. LL-21, LL-12.
- Nguồn: —
- Vấn đề: giữ nguyên từ vòng 3; bản sửa vòng 3 không đụng tới. Không chặn bài.
- Sửa: báo người làm app.

### 8. Mã hình còn một validator không câu nào dùng

- Vị trí: `src/visuals/math/phep-nhan-so-nguyen/logic.ts` (`dat-thua-so`), `catalog.ts` (`VALIDATOR_IDS.factorTry`), `tests/visuals/registry.test.tsx`.
- Nguồn: —
- Vấn đề: giữ nguyên từ vòng 3: không câu `manipulate` nào gọi `dat-thua-so`.
- Sửa: giữ nếu sắp có bài dùng tiếp, không thì xoá cùng dòng test; việc của người giữ mã, không phải của bài.
