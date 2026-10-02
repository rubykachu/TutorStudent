# Review: Phép nhân số nguyên (`phep-nhan-so-nguyen`)

- Bài: `content/math/kntt/phep-nhan-so-nguyen/lesson.json`
- Phần bài tập sách bài tập (section 13, thêm sau khi bài đã xuất bản, vòng 6 đến 8): 21 câu sách (SBT 3.26, 3.26a đến c, 3.27a đến c, 3.28a đến c, 3.29a, b, 3.30, 3.31a đến c, 3.32a, b, 3.33a, b, 3.34) và 26 câu dẫn. Vòng 6 (Opus, toàn phần mới): 3 Nghiêm trọng, 9 Nên sửa, 5 Góp ý. Vòng 7 (Sonnet, chỉ phần đổi): 0 Nghiêm trọng, 5 Nên sửa, 3 Góp ý. Vòng 8 (Sonnet, chỉ phần đổi, lựa chọn 3.27 sang chữ): 0, 0, 0. Chi tiết ở các mục "Vòng 6", "Vòng 7", "Vòng 8" và "Tổng kết phần bài tập sách bài tập" cuối tệp.
- Lịch sử: vòng 1: 5 Nghiêm trọng, 17 Nên sửa, 20 Góp ý; vòng 2: 1 Nghiêm trọng, 20 Nên sửa, 17 Góp ý; vòng 3: 0 Nghiêm trọng, 5 Nên sửa, 8 Góp ý.
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`, so với bản vòng 3), section: duong-nhan-am, am-nhan-am, dau-cua-tich, giao-hoan-ket-hop, nhieu-thua-so, gop-thua-so, bai-toan-thuc-te (cùng kho ôn của card dau-cua-tich)
- Nguồn đã đọc: `sources/math/phep-nhan-so-nguyen/` - không mở lại trang nào: bản sửa chỉ đổi cách nói, hai cặp của kho ôn và một câu giải thích, không đổi đề hay đáp án của bài sách (đề tr.55 đến tr.57, lời giải tr.112, 113 đã đối chiếu ở vòng 1 và 2)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa có trong `ids.lock.json`: đúng, bài chưa được duyệt nên chưa khoá id)
- Đọc hiểu (Haiku): lượt 1 181 / 47 / 0 (`.shots/review/phep-nhan-so-nguyen/doc-hieu.md`); lượt 2 trên 106 mục đổi 89 / 17 / 0 (`doc-hieu-2.md`); lượt 3 trên 21 mục viết lại 16 / 5 / 0 (`doc-hieu-3.md`); lượt 4 trên 19 mục chữ đổi sau vòng 3 8 / 11 / 0 (`doc-hieu-4.md`). Đã quá 3 lượt: các nhận xét lượt 4 là kiểu "hơi mơ hồ" chung, gộp vào Nên sửa mục 2, không chặn duyệt.
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-nhan-so-nguyen/` (đã đọc contact sheet điện thoại của section 2, 3, 4, 5, 6, 7, 8: chữ mới không chồng, không bị cắt, hình bài vừa màn)
- Kết luận: Đạt: 0 lỗi Nghiêm trọng (0 Nghiêm trọng, 2 Nên sửa, 6 Góp ý). Đã chạy `pnpm content:hash phep-nhan-so-nguyen --root content --approve` (đặt `published`) và `pnpm content:lock phep-nhan-so-nguyen`. Nên sửa 1 đã sửa trước khi duyệt (hai cặp kho ôn đổi sang `7 · (−6) = −42`, `(−9) · 5 = −45`, nhiễu 42); Nên sửa 2 còn lại (Haiku quá 3 lượt).
- Bản đã review: `a8cb56c48e1085db024d62c595dd261c7ad2e5e6241611bd23f261f44db2e332` (`pnpm content:diff` so với bản này)

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

## Vòng 5 - chỉ phần đổi (video và lời đọc giới thiệu)

- Phạm vi: `pnpm content:diff phep-nhan-so-nguyen`: lời đọc `overview.narration` (Gemini, Vindemiatrix), ba video `cong-lap`, `duong-nhan-am`, `am-nhan-am` (VieNeu, Mỹ Duyên) cùng ba khối video đặt đầu section `cong-lap`, `duong-nhan-am`, `am-nhan-am`. Chữ của bài không đổi (overview.hook/summary/goals/whyItMatters và mọi note, exercise giữ nguyên), nên không chạy lượt Haiku.
- `content:check`: chỉ còn lỗi `[review-hash]` và cảnh báo 3 id chưa có trong `ids.lock.json` (dự kiến). `video:check`: ok cho giọng, câu mở lời đọc, và cả 3 video (chữ rule trên hình mỗi video: 2).
- Kịch bản (`script.json`): đã tự tính lại mọi số: (−2) · 3 = −2 + −2 + −2 = −6; (−3) · 2 = −3 + −3 = −6; dãy 3 · 2, 3 · 1, 3 · 0 = 6, 3, 0 (tích giảm 3), rồi 3 · (−1) = −3, 3 · (−2) = −6, 5 · (−2) = −10; dãy (−3) · 2, (−3) · 1, (−3) · 0 = −6, −3, 0 (tích tăng 3), rồi (−3) · (−1) = 3, (−3) · (−2) = 6, (−2) · (−3) = 6. Đều đúng, và "giảm 1, tích giảm 3" / "giảm 1, tích tăng 3" khớp note section. Ba câu quy tắc chép đúng note (cờ `rule`, `video:check` xác nhận); thuật ngữ "số âm", "số dương", "tích", "nhân" khớp glossary; mọi câu thường ≤ 12 chữ; mỗi video có câu chào "bạn" (`opening`), ba câu `ask` trước khi lộ đáp án, `think` sau mỗi câu quy tắc (trừ câu cuối), câu cuối là câu "Nhớ nhé" + quy tắc không phải `ask`; 15 câu mỗi video, 57 đến 65 giây.
- Hình và khung đã cắt (3 sheet cong-lap, 2 sheet duong-nhan-am, 3 sheet am-nhan-am, thêm cắt riêng đoạn cuối bằng ffmpeg vào tệp tạm để xem kết quả hàng cuối trước khi hết cảnh): trình tự hình theo lời (chip "số dương/số âm" rồi "tìm quy luật", các hàng hiện theo từng câu, hàng hỏi `= ?` hiện trước khi đọc đáp án, thẻ quy tắc rồi ví dụ thử); hàng đáp án cuối cùng (−6 và 6) hiện trước khi cảnh tắt. Màu đúng theo bài: kết quả dương lime, số âm pink, số 0 slate, nhãn bước và chip "tích?" violet; đường số của cong-lap vẽ −2 pink, cung violet. Không chữ chồng, không bị cắt.
- Phụ đề `.vtt` và Whisper (`report.json`): đủ 15 câu mỗi video, mọi `match` = 1; các chỗ Whisper nghe khác ("Nhận", "nền", "x") là kiểu nhận nhầm quen thuộc, không phải lệch lời. Clip: `cong-lap` (18,0 đến 63,4 giây), `duong-nhan-am` (8,7 đến 56,2), `am-nhan-am` (9,5 đến 62,9) mỗi clip một card cùng tên, đoạn clip đúng phần giảng quy tắc của card đó.
- Lời đọc giới thiệu (`overview.vtt`): 27 câu phụ đề, câu đầu "Chào bạn!", chữ khớp từng chữ với hook, summary, 4 goals và whyItMatters; phần thêm duy nhất là câu dẫn "Học xong bài này, bạn sẽ:" trước các goals (do quy trình đọc lời, không phải chữ của bài).
- Kết luận: Đạt: 0 Nghiêm trọng, 0 Nên sửa, 2 Góp ý. Không cập nhật `docs/lessons-learned/index.md` (không có Nghiêm trọng). Chưa chạy `content:hash`; việc đó và `content:lock` để điều phối làm.

### Nghiêm trọng

Không có.

### Nên sửa

Không có.

### Góp ý

#### 9. Thừa số dương trong phép nhân đang in màu tối, chưa theo "số dương lime"

- Vị trí: `video/projects/phep-nhan-so-nguyen/cong-lap/index.html` (hàng `(−2) · 3`, `(−3) · 2`), `duong-nhan-am/index.html` (`3 · 2`, `3 · 1`, `3 · (−1)`, `5 · (−2)`), `am-nhan-am/index.html` (`(−3) · 2`, `(−3) · 1`). LL-05.
- Nguồn: —
- Vấn đề: chip "số dương" tô lime nhưng số dương cụ thể trong phép tính (thừa số 3, 2, 1, 5) cùng màu chữ tối của dấu nhân; chỉ tích dương mới lime. Bé thấy cùng khái niệm hai màu. Không sai kiến thức.
- Sửa: giữ nguyên: hình của bài (`quy-luat-3-nhan`, `quy-luat-am3-nhan`) cũng chỉ tô màu theo dấu ở tích, không tô thừa số; video làm đúng như hình của bài.

#### 10. Thẻ quy tắc xuống dòng để lại một chữ lẻ

- Vị trí: thẻ `rule` của `cong-lap` ("… nên tích / là số âm."), `am-nhan-am` ("… nhân hai phần số tự / nhiên."), khung `sheet-01` đến `sheet-03`. LL-12.
- Nguồn: —
- Vấn đề: ngắt dòng tách "số tự nhiên" của câu quy tắc trong am-nhan-am thành "tự / nhiên.", khó đọc hơn một cụm liền với bé chậm.
- Sửa: đã thêm `text-wrap: balance` cho thẻ quy tắc của cả ba video và dựng lại (chỉ đổi hình, giọng giữ nguyên).

## Vòng 6: phần bài tập sách bài tập (section cuối, Opus, soát đầy đủ phần mới)

- Phạm vi: chỉ phần mới. `$.sections[12]` (`phep-nhan-so-nguyen.section.bai-tap-sach-bai-tap`): 4 khối "Nhắc lại", recap; 47 exercise `$.exercises[63]` đến `[109]` (21 câu sách `bookRef` SBT 3.26 đến 3.34, 26 câu dẫn `leadsTo`); 52 hình `sbt-*` trong `src/visuals/math/phep-nhan-so-nguyen/catalog.ts` và 5 hình cũ dùng lại (`goi-y-khac-dau-9-nhan-am2`, `goi-y-am5-nhan-am`, `goi-y-am8-nhan-am`, `gop-thua-so-vi-du`, `tang-giam-vi-du`). 12 section đầu, id, video, media không soát.
- Nguồn đã đọc (mở ảnh): `sources/math/phep-nhan-so-nguyen/sbt-p55.png` (Kiến thức cần nhớ, Ví dụ 1, 2), `sbt-p56.png` (đề 3.26 đến 3.29, lời giải Ví dụ 2), `sbt-p57.png` (đề 3.30 đến 3.34), `sbt-p112.png`, `sbt-p113.png` (lời giải 3.28 đến 3.34). Sách không in lời giải 3.26, 3.27.
- Đủ bài tập: ảnh có 3.26 (câu đầu + a, b, c), 3.27 a–c, 3.28 a–c, 3.29 a–b, 3.30, 3.31 a–c, 3.32 a–b, 3.33 a–b, 3.34 = 21 mục; dòng "book exercises (21)" của `content:check --stats` khớp từng mục. Tách câu đầu 3.26 thành `SBT 3.26` hợp lý (ba ý dùng tích đó).
- Đề y hệt sách: so từng chữ, số, dấu câu của cả 21 câu (gồm dòng lệnh chung, bảng 3.30 hai hàng x, y và hàng "?", đề dài 3.33, đề 3.34, dấu ";" và "." cuối mỗi công thức): khớp. Lựa chọn của 3.27, 3.28 và câu lệnh app ở khối riêng cuối đề: đúng luật.
- Đáp án: 3.28 đến 3.34 khớp tr.112–113 (3.30 khớp cả 8 ô). 3.26, 3.27 tự tính (mục 14).
- `content:check`: lỗi `[review-hash]` và cảnh báo 48 id chưa khoá (dự kiến, chưa duyệt); không lỗi nội dung.
- Đọc hiểu: đã đọc `.shots/review/phep-nhan-so-nguyen/doc-hieu-bai-tap-sach-1.md` (171/5/0), `-2.md`, `-3.md`; còn `$.exercises[99].explain.text` (mục 22) và `$.exercises[102].explain.text` (mục 12, 17).
- Hình: đã xem ảnh chụp từng hình (phone, iPad) trong thư mục `shots-visuals` của phiên soạn; không có tệp `sheet-phone-0N.png` trong thư mục đó. 6 hình sửa sau ảnh đọc từ `catalog.ts`. Mọi `hintVisualId` là `lines` chế độ `hint` (dòng cuối ẩn thành "?"), chữ rõ, không tràn, màu theo dấu. `lesson:walk` chưa chạy.
- Kết luận vòng: 3 Nghiêm trọng, 9 Nên sửa, 5 Góp ý. Không chạy `content:hash` (ngoài phạm vi vai). Mục lessons-learned cần tăng số khi tổng hợp: LL-05, LL-08 (kèm LL-20), LL-09 (mỗi mục một Nghiêm trọng).

### Nghiêm trọng

#### 11. Bài 3.33 viết phép nhân ngược quy ước "thay đổi mỗi lần nhân với số lần"

- Vị trí: `$.exercises[104].explain` (`sbt-3-33a`: "420 · x", "420 · 18"), `$.exercises[105].explain` và `check.expr` (`dan-3-33b-am3-60`: "60 · (−3)"), `$.exercises[106].explain` (`sbt-3-33b`: "420 · x", "420 · (−7)"); hình `sbt-goi-y-vai-420` ("320 · 15"), `sbt-goi-y-vai-giam` ("30 · (−2)"), `sbt-goi-y-vai-420-am` ("150 · (−6)"), `sbt-3-33a-giai`, `sbt-3-33b-giai`. LL-05.
- Nguồn: tr.57 (đề), tr.113 (lời giải viết 420 · x).
- Vấn đề: khối "Nhắc lại cho bài 3.33" ngay trên lặp câu quy tắc "Thay đổi tổng cộng bằng thay đổi mỗi lần nhân với số lần" và hình `tang-giam-vi-du`, `thay-doi-vai` viết (−3) · 4, 5 · 20 (thay đổi mỗi lần đứng trước). Câu dẫn `dan-3-33a-4-50` và hình `sbt-goi-y-vai-tang` theo đúng (4 · 50, 3 · 20), còn 7 chỗ còn lại của cùng bài đảo thành số lần · thay đổi. Trong cùng một bài tập bé thấy hai thứ tự, trái câu quy tắc vừa đọc; đây đúng kiểu lỗi vòng 1 của bài này đã ghi Nghiêm trọng (LL-05, `bai-toan-thuc-te`). Lời "420 · x" còn là cách viết của lời giải sách.
- Sửa: đổi hết sang thay đổi mỗi lần · số lần: `x · 420`, `18 · 420 = 18 · 400 + 18 · 20 = 7 200 + 360 = 7 560`, `(−7) · 420 = −(7 · 420) = −2 940`, `(−3) · 60 = −180` (cả `check.expr`), hình gợi ý `15 · 320`, `(−2) · 30`, `(−6) · 150`; nhãn "tách 420 = 400 + 20" giữ được. Đáp án không đổi.

#### 12. Lời giải 3.32b chép nguyên dòng hướng dẫn của trang đáp án

- Vị trí: `$.exercises[102].explain.text` và `.tex` (`sbt-3-32b`), hình `sbt-3-32b-giai` (dòng 2 đến 4). LL-08, LL-20.
- Nguồn: tr.113, 3.32b "HD: Viết thành −157 · 127 + 157 · 316 − 127 · 316 + 127 · 157 = (157 − 127) · 316."
- Vấn đề: `explain.text` có đúng dòng "−157 · 127 + 157 · 316 − 127 · 316 + 127 · 157" (cùng thứ tự bốn tích), `tex` và hình lời giải đi tiếp "= (157 − 127) · 316" như sách. Checklist: chép lời giải hay cách trình bày của sách vào `explain`, hình lời giải là Nghiêm trọng, kể cả khi số của đề ép cách làm (tiền lệ `on-tap-chuong-3` vòng 1, `bai-3-43a`). Bản ở lượt Haiku 1 chưa có dòng này ("Nhân từng tích ra và bỏ ngoặc ..."); lần viết lại cho dễ đọc đã chép nó vào (LL-20).
- Sửa: đổi chuỗi bước theo cách của mục 13 (đổi phép trừ thành cộng số đối, nhân với từng số hạng, bỏ cặp số đối, rồi cộng hai tích có chung thừa số 316 và viết `316 · 30` hay `[157 + (−127)] · 316`), áp cho cả `explain` và `sbt-3-32b-giai`, rồi đọc lại đối chiếu tr.113.

#### 13. Hướng dẫn 3.32b dùng phép nhân với một hiệu và đưa thừa số chung ra khi trừ, bài chưa dạy

- Vị trí: `$.exercises[102]` (`explain`, hình `sbt-goi-y-3-32b`, `sbt-3-32b-giai`), câu dẫn `$.exercises[100]` (`dan-3-32b-bo-ngoac`), khối `$.sections[12].blocks[2]` ("Nhắc lại cho bài 3.32"). LL-09.
- Nguồn: tr.55 (Kiến thức cần nhớ chỉ có "phân phối đối với phép cộng"); quy tắc của bài: section `phan-phoi` ("Nhân một số với một tổng ...") và `gop-thua-so` ("Khi cộng hai tích ...").
- Vấn đề: bước "(−157) · (127 − 316) = −157 · 127 + 157 · 316" cần a · (b − c) = a · b − a · c và đổi dấu thừa số trong một hiệu; bước "157 · 316 − 127 · 316 = (157 − 127) · 316" cần đưa thừa số chung ra khi trừ. Cả bài chỉ dạy hai quy tắc với tổng, khối "Nhắc lại cho bài 3.32" cũng chỉ lặp hai câu đó; câu dẫn `dan-3-32b-bo-ngoac` có đúng khuôn đề sách nhưng giải bằng cách tính trong ngoặc trước, không tập bước nào của 3.32b; nhãn hình chỉ ghi "nhân từng tích, chưa tính". Bé học chậm, yếu nhân, không theo được nấc 3 và `explain`, còn cách tính thẳng là nhân số ba chữ số với số ba chữ số.
- Sửa: chỉ dùng quy tắc đã có: thêm vào khối "Nhắc lại cho bài 3.32" hai câu nguyên văn của bài `phep-cong-phep-tru-so-nguyen`: "Muốn trừ một số, ta cộng với số đối của số đó." và "Hai số đối nhau cộng lại thì được 0." (note thường, không `rule`). Viết lời giải: (−157) · [127 + (−316)] + (−127) · [316 + (−157)] = (−157) · 127 + 157 · 316 + (−127) · 316 + 127 · 157; (−157) · 127 và 127 · 157 là hai số đối nhau, cộng lại bằng 0; còn 157 · 316 + (−127) · 316 = [157 + (−127)] · 316 = 30 · 316 = 9 480. Đổi `sbt-goi-y-3-32b` theo cùng các bước với số của nó (dừng ở "?"). Thay `dan-3-32b-bo-ngoac` bằng câu dẫn tập bước đầu với số nhỏ, vd "(−3) · (4 − 6)": (−3) · [4 + (−6)] = −12 + 18 = 6, đối chiếu (−3) · (−2) = 6.

### Nên sửa

#### 14. Sách không có lời giải 3.26 và 3.27

- Vị trí: `$.exercises[64]`, `[66]`, `[68]`, `[70]` (`sbt-3-26`, `sbt-3-26a`, `-b`, `-c`), `$.exercises[71]`, `[73]`, `[75]` (`sbt-3-27a`, `-b`, `-c`).
- Nguồn: tr.112 (mục Bài 16 bắt đầu từ 3.28).
- Vấn đề: theo checklist "Sách không có lời giải cho ý đó". Đã tự tính bằng chương trình: 115 · 8 = 920; (−115) · 8 = −920; 115 · (−8) = −920; (−115) · (−8) = 920; 287 · 522 > 0; (−375) · 959 < 0; (−278) · (−864) > 0. Mọi `answer`, `check.expr`, lựa chọn đúng và `wrong` khớp.
- Sửa: không cần sửa bài; chủ dự án biết các đáp án này do bài tự giải.

#### 15. So sánh hai số âm nói ba cách, lệch câu quy tắc của bài `tap-hop-cac-so-nguyen`

- Vị trí: `$.exercises[80].explain` và `wrong` (`dan-3-28c-am85-am93`: "số có phần số tự nhiên lớn hơn thì bé hơn"), `$.exercises[81]`, `[82]` `explain` và `wrong` ("Số âm có phần số tự nhiên nhỏ hơn thì lớn hơn"), hình `sbt-goi-y-so-sanh-am`, `sbt-3-28c-giai`. LL-05.
- Nguồn: tr.56 (3.28c); quy tắc đã duyệt của bài `tap-hop-cac-so-nguyen`, section `hai-so-am`.
- Vấn đề: cùng một quy tắc có hai chiều nói trong ba câu liền nhau, đều khác câu bé đã học "Muốn so sánh hai số âm khác nhau, bỏ dấu − của cả hai số rồi so sánh. Số âm nào có số lớn hơn sau khi bỏ dấu − thì nhỏ hơn số âm kia."; Haiku lượt 1 cũng vướng "phần số" ở `[80]`. 3.27, 3.28 còn dùng "số âm nhỏ hơn mọi số dương" mà không khối "Nhắc lại" nào nhắc (khối đầu ghi "cho các bài 3.26 đến 3.30" nhưng chỉ có dấu của tích).
- Sửa: thêm khối "Nhắc lại cho bài 3.27 và bài 3.28" với hai câu nguyên văn của `tap-hop-cac-so-nguyen` (section `am-khong-duong` và `hai-so-am`, note thường), và viết `explain`, `wrong` của `[80]`–`[82]` theo đúng chiều câu đó ("Bỏ dấu − được 600 và 630. Số âm nào có số lớn hơn sau khi bỏ dấu − thì nhỏ hơn, nên −630 nhỏ hơn −600."); sửa khối đầu thành "cho các bài 3.26, 3.29, 3.30 và 3.34" nếu tách.

#### 16. Câu nhắc "Muốn nhân hai số nguyên ..." là cách nói mới của quy tắc

- Vị trí: `$.sections[12].blocks[0].children[1].text`. LL-05.
- Nguồn: —
- Vấn đề: "Muốn nhân hai số nguyên, ta nhân hai phần số tự nhiên rồi viết dấu cho tích." không có ở 12 section đầu; các câu quy tắc đã dạy là "Hai số khác dấu thì tích là số âm: nhân hai phần số tự nhiên rồi viết dấu − ở trước." (`khac-dau`) và "Hai số âm nhân với nhau thì tích là số dương: nhân hai phần số tự nhiên." (`am-nhan-am`). Khối "Nhắc lại" phải lặp câu đã có.
- Sửa: thay bằng hai câu nguyên văn trên, hoặc bỏ (câu `rule` "Hai số khác 0 cùng dấu ..." và hình `sbt-nhac-lai-dau-tich` đã đủ).

#### 17. "Trái dấu, bỏ đi" thay cho "hai số đối nhau cộng lại thì được 0"

- Vị trí: `$.exercises[102].explain.text` ("bằng nhau nhưng trái dấu"), hình `sbt-goi-y-3-32b` (nhãn "−2 · 4 và 4 · 2 trái dấu, bỏ đi"), `sbt-3-32b-giai` ("−157 · 127 và 127 · 157 trái dấu, bỏ đi"), nhãn đọc màn hình của `sbt-goi-y-doi-nhau` ("Hai tích giống nhau mà trái dấu"). LL-05, LL-25.
- Nguồn: —
- Vấn đề: bài và câu dẫn `dan-3-32b-doi-nhau` gọi đúng là "hai số đối nhau", "cộng lại bằng 0"; "trái dấu" là từ bài không dạy, "bằng nhau nhưng trái dấu" đọc như tự mâu thuẫn (hai số bằng nhau lại khác dấu), "bỏ đi" giấu lý do (cộng bằng 0). Bản lượt Haiku 1 viết "là hai số đối nhau" đã được đổi đi.
- Sửa: "−157 · 127 và 127 · 157 là hai số đối nhau, cộng lại bằng 0" ở cả `explain` và nhãn hai hình; nhãn `sbt-goi-y-doi-nhau` "Hai số đối nhau cộng lại thì được 0".

#### 18. Câu dẫn của 3.30 khó trước dễ sau, câu dễ nhắc tới "bảng" không có

- Vị trí: `$.sections[12].checkIds` (`dan-3-30-bang-nho` độ khó 2 đứng trước `dan-3-30-am1` độ khó 1), `$.exercises[88].prompt[0]`. LL-10.
- Nguồn: tr.57 (3.30).
- Vấn đề: câu dẫn phải từ dễ đến khó; câu một tích với −1 đứng sau câu bảng bốn cột. Đề "Một cột của bảng có x = −1 và y = 38" nói "của bảng" nhưng màn không có bảng nào.
- Sửa: đưa `dan-3-30-am1` lên trước `dan-3-30-bang-nho`; đề viết "Cho x = −1 và y = 38. Tính x · y."

#### 19. Nhiễu "x = 5" của 3.31c không ứng với lỗi nào và trùng nghiệm của hình gợi ý

- Vị trí: `$.exercises[96].options[3]` và `wrong` (`sbt-3-31c`); hình `sbt-goi-y-am-x-hai` (hiện "x − 5 = 0 → x = 5"). Cùng kiểu, nhẹ hơn: `$.exercises[95].options[3]` "x = 6" (`dan-3-31c-am-x-12`). LL-14, LL-07.
- Nguồn: tr.57, tr.112 (3.31c: x = 0, x = 43).
- Vấn đề: bé mở nấc 2 thấy "x = 5" rồi gặp đúng lựa chọn "x = 5": nhiễu dẫn theo hình chứ không bắt lỗi hiểu; 5 không ra từ cách làm sai nào của (−x) · (x − 43) = 0. "x = 6" của câu dẫn (nửa của 12) cũng không ứng lỗi rõ.
- Sửa: bỏ hai nhiễu đó (còn ba lựa chọn, có nhiễu đổi dấu −43, −12), hoặc thay bằng lỗi thật như quên nghiệm của −x (chọn chỉ 43) đã được phủ bởi `multiple: true`; nếu giữ hình, đổi số trong `sbt-goi-y-am-x-hai` khác mọi lựa chọn.

#### 20. Câu dẫn của 3.32a không tập phần "hợp lí"

- Vị trí: `$.exercises[98]` (`dan-3-32a-hai-tich`), hình `sbt-goi-y-hai-tich`.
- Nguồn: tr.57 (3.32a "Tính một cách hợp lí"), tr.113.
- Vấn đề: cả hai câu dẫn chỉ tính trong ngoặc rồi nhân, cộng; bước làm nên chữ "hợp lí" của 3.32a (thấy (−20) · 21 = 20 · (−21) rồi đưa 20 ra ngoài) chỉ có ở nấc 2, 3 của câu sách. Câu dẫn lệch kỹ năng câu sách kế tiếp.
- Sửa: đổi câu dẫn thứ hai sang khuôn có thừa số chung sau khi tính ngoặc, vd "(7 − 2) · (−3) + (−1 − 4) · 7" = 5 · (−3) + 5 · (−7) = 5 · (−10) = −50 (số khác hình `sbt-goi-y-3-32a` và đề), `explain` đi qua bước đưa 5 ra ngoài; hình gợi ý dừng ở "?" trước −50.

#### 21. Hình gợi ý của câu dẫn 3.34 là chính lập luận của đáp án

- Vị trí: `$.exercises[107].hints.hintVisualId` (`dan-3-34-ba-so-tich-am`), hình `sbt-goi-y-ba-so-khong-am`. LL-02.
- Nguồn: —
- Vấn đề: hai dòng hiện "3 · 5 · 2 = 30: ba số dương: tích dương", "0 · 5 · 2 = 0: có số 0: tích bằng 0" là đúng câu đầu của `explain` ("Nếu ba số đều là số dương hoặc số 0 thì tích không thể âm"), tức lập luận ra đáp án "có ít nhất một số âm", và loại thẳng lựa chọn "có một số bằng 0". Cùng kiểu với `sbt-goi-y-khong-co-so-am` của `quy-tac-dau-ngoac` (vòng 5, Nên sửa).
- Sửa: như bài 15: hiện vài bộ ba số có tích âm (vd (−2) · 3 · 1 = −6, (−1) · (−4) · (−2) = −8) và dừng ở "?", để bé tự thấy điểm chung.

#### 22. Lời giải 3.32a còn mơ hồ sau ba lượt đọc hiểu

- Vị trí: `$.exercises[99].explain.text` (`sbt-3-32a`). LL-25, LL-05.
- Nguồn: `.shots/review/phep-nhan-so-nguyen/doc-hieu-bai-tap-sach-3.md`.
- Vấn đề: Haiku lượt 3 vẫn vướng "Tích (−20) · 21 cũng bằng 20 · (−21)": câu không nói vì sao. Đọc như bé chậm, tôi cũng dừng ở đó; câu cuối lại viết "Viết 20 ra ngoài ngoặc" trong khi câu quy tắc của bài nói "đưa thừa số đó ra ngoài".
- Sửa: "Tích (−20) · 21 và tích 20 · (−21) cùng bằng −420, nên hai tích có chung thừa số 20. Đưa thừa số chung 20 ra ngoài: 20 · [(−9) + (−21)] = 20 · (−30) = −600."

### Góp ý

#### 23. Bước sắp xếp 3.34 còn bám khuôn câu lời giải

- Vị trí: `$.exercises[109].items` (`sbt-3-34`), `s2`, `s4`, `s5`. LL-08, LL-05.
- Nguồn: tr.113 (3.34 "Gọi tích này là p. Khi đó tích của năm số đã cho bằng a · p < 0"), tr.56 (lời giải Ví dụ 2).
- Vấn đề: thứ tự duy nhất đúng (s1 đặt a, s2 dùng a đặt b, s3 dùng a, b đặt q, s4 dùng b, q đặt r, s5 dùng r; đã kiểm bằng chương trình rằng mọi bộ năm số trong [−4; 4] có tính chất của đề đều có tích âm) và lời đã theo khuôn chấp nhận ở `quy-tac-dau-ngoac` 3.25. Riêng "Ta gọi tích này là r" + "Tích của cả năm số là a · r" sát "Gọi tích này là p ... a · p" của sách; `s2` viết "có một số âm" trong khi `s1` viết "có ít nhất một số âm".
- Sửa: bỏ tên r: `s4` "... nên bằng b · q. Số âm nhân số âm được số dương, nên tích của bốn số này dương.", `s5` "Tích của năm số là a nhân với tích của bốn số đó: số âm nhân số dương, nên là số âm."; `s2` thêm "ít nhất". Đổi nhãn `sbt-3-34-giai` theo.

#### 24. Số lặp giữa các câu và hình trong section

- Vị trí: hình `sbt-goi-y-am-nhan-duong` ((−9) · 7 = −63) và cột 2 của `dan-3-30-bang-nho` (9 · (−7) = −63); dòng ẩn của `sbt-goi-y-bang` (0 · (−12)) và cột 4 của `dan-3-30-bang-nho`; `sbt-goi-y-tim-x-mot` (x + 4) và `dan-3-31b-x6-x4` (x + 4); (−9 − 1) ở cả `sbt-goi-y-hai-tich` và `sbt-goi-y-3-32a`; (x − 5) ở `sbt-nhac-lai-tich-0` và `sbt-goi-y-am-x-hai`. LL-07.
- Nguồn: —
- Vấn đề: không lộ đáp án câu nào (đều là hình gợi ý hay dòng ẩn), nhưng bé gặp lại cùng phép tính ở câu sau.
- Sửa: đổi một số trong mỗi cặp khi sửa các mục trên.

#### 25. Quy tắc tích bằng 0 trong nhãn hình nói khác câu quy tắc

- Vị trí: hình `sbt-nhac-lai-tich-0` (nhãn đọc màn hình "Tích bằng 0 thì một trong hai thừa số bằng 0", nhãn "một trong hai thừa số bằng 0"), `sbt-tom-tat` ("a bằng 0 hoặc b bằng 0"). LL-05.
- Nguồn: —
- Vấn đề: câu `rule` và recap viết "ít nhất một số trong hai số đó bằng 0"; nhãn hình là cách nói thứ hai, thứ ba (đều đúng).
- Sửa: nhãn "ít nhất một thừa số bằng 0".

#### 26. Ô của bảng 3.30 viết "x=−28" liền dấu

- Vị trí: `$.exercises[87].segments`, `$.exercises[89].segments` ("Cột 1: x=−28, y=15, x · y=").
- Nguồn: —
- Vấn đề: "x=−28" dính liền khó đọc hơn "x = −28", và lệch cách viết "x · y" có cách ngay bên cạnh.
- Sửa: "Cột 1: x = −28, y = 15, x · y =".

#### 27. Hình gợi ý 3.29 loại trừ gần trọn đáp án

- Vị trí: hình `sbt-goi-y-b-duong` (của `sbt-3-29a`, `dan-3-29a-am6`), `sbt-goi-y-b-am` (của `sbt-3-29b`, `dan-3-29b-am9`). LL-02.
- Nguồn: —
- Vấn đề: dòng hiện "(−7) · 3 = −21, khác dấu: tích âm" cho câu hỏi "tích dương thì b?" đã loại "số dương"; dòng kết luận đúng đã ẩn nên vẫn theo luật nấc 2, nhưng gợi ý gần như là đáp án.
- Sửa: tuỳ tác giả: hiện cả hai thử nghiệm với một a dương (vd a = 4) để bé tự chuyển sang a âm.

### Đã tự tính

Chương trình Node trong thư mục nháp của phiên (`check.js`, `modes.ts`): 239 phép kiểm đạt, 0 sai.

| Đối tượng | Đã kiểm | Kết quả |
|---|---|---|
| `answer` và `check.expr` của 23 câu `numeric` | tính lại `check.expr`, so `answer` | khớp cả 23 |
| Lựa chọn của 12 câu so sánh (`relation: holds`) | tính hai vế từng lựa chọn, so với `answer` | đúng một lựa chọn đúng mỗi câu |
| 4 câu tìm x `multiple` | thay từng lựa chọn vào tích | đúng tập nghiệm (6, −4; 27, −9; 0, 12; 0, 43) |
| 3 câu tìm x `numeric` | nghiệm duy nhất trong [−100; 100] | −15, −28, 0 |
| Mọi lý do `wrong` có số | (−6) · 5, (−9) · (−2), các cặp thừa số khi thay x, −2 · 3 · 4, −1 · −2 · −3 ... | đúng |
| Bảng 3.30 | 8 tích, `accept` (cả khoảng hẹp U+202F của "7 000"), có trong `bank`; so hàng lời giải tr.112 | khớp; nhiễu: 420, −945, −7 000, 364, 293 |
| Bảng câu dẫn 3.30 | 4 tích | −24, −63, 40, 0 |
| Phép tính trong `explain` | 3.26 (tách 100 + 15), 3.32a, 3.32b, 3.33, câu dẫn | đúng (3.32b = 9 480 theo cả hai cách) |
| 52 hình `sbt-*` và 5 hình dùng lại | mọi dòng, kể cả dòng ẩn "?" (540, −63, 27, −12 ...), chế độ `hint` của mọi `hintVisualId` | đúng; mọi hình gợi ý ẩn dòng kết quả |
| 3.34 | thứ tự duy nhất của `order`; mọi bộ năm số trong [−4; 4] có tích ba số bất kì âm | thứ tự duy nhất; mọi bộ đều có tích năm số âm |
| 3.26, 3.27 (sách không có lời giải) | 920; −920; −920; 920; > 0; < 0; > 0 | khớp bài |

## Vòng 7: phần bài tập sách bài tập, chỉ phần đổi sau vòng 6 (Sonnet)

- Phạm vi: `pnpm content:diff phep-nhan-so-nguyen --base 8d6f93ed5ecab273fe01f9b61cd8307d8125f466` (khối "Nhắc lại" 0 đến 3, 17 exercise đổi, 1 câu dẫn thêm, 1 câu dẫn bớt, thứ tự `checkIds` 3.30) và `git diff` của `src/visuals/math/phep-nhan-so-nguyen/catalog.ts` với cùng bản (28 hình `sbt-*` đổi, 2 hình bớt, 2 hình thêm). Soát cả các mục khác của section `phep-nhan-so-nguyen.section.bai-tap-sach-bai-tap` xem bản sửa có làm hỏng chúng không. 12 section đầu, id, video, media không soát.
- Nguồn đã đọc (mở ảnh): `sbt-p56.png` (đề 3.26 đến 3.29), `sbt-p57.png` (đề 3.30 đến 3.34), `sbt-p112.png` (lời giải 3.28 đến 3.31), `sbt-p113.png` (lời giải 3.32 đến 3.34). Đã so lại từng chữ, số, dấu của đề 3.28c, 3.30 (cả hai hàng x, y và 8 ô), 3.31c, 3.32a, 3.32b, 3.33a, 3.33b, 3.34 với ảnh: khớp. Đáp án 3.28c (>), 3.30 (8 ô), 3.31c (x = 0, x = 43), 3.32a (−600), 3.32b (9 480), 3.33a (7 560), 3.33b (−2 940), 3.34 (tích âm) khớp tr.112, 113.
- Câu nguyên văn của các khối "Nhắc lại" đã grep trong các `lesson.json`: câu về dấu, số đối, phân phối, đưa thừa số chung, so sánh số âm, thay đổi mỗi lần đều có nguyên văn ở section đã duyệt của bài này hoặc của `tap-hop-cac-so-nguyen`, `phep-cong-phep-tru-so-nguyen`; recap còn lặp nguyên văn hai câu `rule: true`.
- Đủ bài tập: dòng "book exercises (21)" của `content:check --stats` khớp 21 mục; mỗi câu dẫn `leadsTo` đứng ngay trước câu sách nó dẫn tới (kiểm bằng chương trình), mỗi câu sách tối đa 2 câu dẫn.
- `content:check`: 1 lỗi (`[review-hash]`, dự kiến vì bản đang sửa), 1 cảnh báo (48 id chưa khoá); không lỗi nội dung.
- Đọc hiểu (Haiku, lượt 4 trên chữ đổi): 23 / 5 / 0 (`.shots/review/phep-nhan-so-nguyen/doc-hieu-bai-tap-sach-4.md`). 5 mục "Hiểu mơ hồ": `blocks[1].children[1]`, `[2]` (mục 34) và `$.exercises[98]`, `[99]`, `[102]` `explain.text` (mục 30, 31). Đã quá 3 lượt cho các mục đó nên ghi vào Nên sửa, không chặn duyệt.
- Hình: đã xem ảnh chụp phone và iPad của các hình đổi (`sbt-nhac-lai-so-sanh`, `sbt-nhac-lai-tich-0`, `sbt-goi-y-nhan-hieu`, `sbt-goi-y-hai-tich`, `sbt-goi-y-3-32b`, `sbt-3-32b-giai`, `sbt-goi-y-ba-so-tich-am`, `sbt-3-34-giai`, `sbt-3-28c-giai`, `sbt-goi-y-am-nhan-duong`): chữ rõ, không chồng, không tràn; hình gợi ý hiện "?" thay dòng cuối. Các hình cao (`sbt-3-32b-giai`, `sbt-3-34-giai`) bị cắt phần trên trong ảnh, đã đọc chữ từ `catalog.ts`. `lesson:walk` không chạy (ngoài phạm vi vai), nên chưa xem màn "Nhắc lại" thật (mục 32).
- Kết luận vòng: 0 Nghiêm trọng, 5 Nên sửa, 3 Góp ý. Không chạy `content:hash` (ngoài phạm vi vai). Không có phát hiện Nghiêm trọng nên không đụng `docs/lessons-learned/`.

### Kiểm bản sửa vòng 6

| Mục | Kết quả | Ghi chú |
|---|---|---|
| 11 | Đã sửa đúng | Cả 8 chỗ (`explain` của `[104]`, `[105]`, `[106]`, `check.expr` của ba câu, hình `sbt-goi-y-vai-420`, `-vai-giam`, `-vai-420-am`, `sbt-3-33a-giai`, `sbt-3-33b-giai`) đều theo "thay đổi mỗi lần · số lần": `x · 420`, `18 · 420`, `(−3) · 60`, `(−7) · 420`; đáp án không đổi. Khớp câu quy tắc của khối "Nhắc lại" và câu dẫn `dan-3-33a-4-50`. |
| 12 | Đã sửa đúng | `explain` của `[102]` không còn dòng "Viết thành −157 · 127 + ..." và "= (157 − 127) · 316"; lời giải đi theo cộng số đối, bỏ cặp số đối, đưa 316 ra ngoài với `[157 + (−127)]`. Dòng khai triển bốn tích trong hình `sbt-3-32b-giai` do số đề ép, đúng khuôn mục 12 đề xuất. Còn Haiku mơ hồ: mục 31. |
| 13 | Đã sửa đúng | Khối "Nhắc lại cho bài 3.32 và bài 3.33" có hai câu nguyên văn về số đối; `dan-3-32b-bo-ngoac` thay bằng `dan-3-32b-nhan-hieu` `(−3) · (4 − 6)` (đáp án 6, hình gợi ý `sbt-goi-y-nhan-hieu` dừng ở "?"). Lời giải không còn dùng nhân với một hiệu. Còn một bước chưa được tập: mục 29. |
| 14 | Không đổi | Theo yêu cầu; sách vẫn không có lời giải 3.26, 3.27. |
| 15 | Một phần | Khối "Nhắc lại cho bài 3.28" có hai câu nguyên văn; `explain`, `wrong` của `[80]` đến `[82]` theo đúng chiều câu quy tắc. Còn: hình nói chiều ngược (mục 28), tiêu đề khối chưa nêu hết bài dùng (mục 33). |
| 16 | Đã sửa đúng | Hai câu nguyên văn của `khac-dau`, `am-nhan-am` thay câu mới; câu `rule` và hình giữ. |
| 17 | Đã sửa đúng | Không còn "trái dấu", "bỏ đi" trong section và catalog (grep 0); `explain`, nhãn `sbt-goi-y-3-32b`, `sbt-3-32b-giai`, `sbt-goi-y-doi-nhau` (cả nhãn đọc màn hình) đều viết "hai số đối nhau, cộng lại bằng 0". |
| 18 | Đã sửa đúng | `dan-3-30-am1` (độ khó 1) đứng trước `dan-3-30-bang-nho`; đề "Cho x = −1 và y = 38. Tính x · y." |
| 19 | Đã sửa đúng | Bỏ "x = 5" (3.31c) và "x = 6" (câu dẫn); không còn lựa chọn nào trùng nghiệm hiện trong hình gợi ý; tập nghiệm mỗi câu đúng (tự tính). |
| 20 | Đã sửa đúng | Câu dẫn `(7 − 2) · (−3) + (−1 − 4) · 7` = −50 có bước đưa thừa số chung 5; hình `sbt-goi-y-hai-tich` đổi số (−32) và dừng ở "?". Còn Haiku mơ hồ: mục 30. |
| 21 | Đã sửa đúng | `sbt-goi-y-ba-so-tich-am` chỉ hiện hai bộ ba số có tích âm, dòng thứ ba ẩn "?", không lập luận ra đáp án. |
| 22 | Một phần | Câu sửa đúng như đề xuất, nhưng Haiku lượt 4 vẫn chấm "mơ hồ": mục 30. |
| 23 | Đã sửa đúng | Bỏ tên r; `s2` có "ít nhất"; thứ tự vẫn duy nhất (tự tính); nhãn `sbt-3-34-giai` đổi theo. |
| 24 | Đã sửa đúng | Cả 5 cặp số lặp đã đổi (`−8 · 6`, `0 · (−14)`, `6 · (x + 3)`, `(6 − 2) · (−3) + (−3 − 1) · 5`, `(x − 4) · (x + 1)`). Có vài cặp nhẹ mới: mục 35. |
| 25 | Đã sửa đúng | Ba chỗ (`sbt-nhac-lai-tich-0` nhãn đọc màn hình và nhãn dòng, `sbt-tom-tat`) đều "ít nhất một thừa số bằng 0". |
| 26 | Đã sửa đúng | "x = −28" có khoảng trắng ở `[87]`, `[88]`, `[89]` (cả 4 + 8 cột). |
| 27 | Không đổi | Góp ý, theo yêu cầu. |

### Nghiêm trọng

Không có.

### Nên sửa

#### 28. Hình nói so sánh hai số âm theo chiều ngược câu quy tắc vừa đọc

- Vị trí: hình `sbt-nhac-lai-so-sanh` (nhãn dòng 2: "8 bé hơn 12 nên −8 lớn hơn −12"), `sbt-3-28c-giai` (nhãn dòng 3: "600 bé hơn 630 nên −600 lớn hơn −630"), `sbt-goi-y-so-sanh-am` (nhãn dòng 2: "40 bé hơn 52"); so với `$.sections[12].blocks[1].children[2].text`, `$.exercises[80]`, `[81]`, `[82]` `explain` và `wrong`. LL-05.
- Nguồn: quy tắc đã duyệt của `tap-hop-cac-so-nguyen`, section `hai-so-am`.
- Vấn đề: câu quy tắc và `explain` nói "số có lớn hơn sau khi bỏ dấu − thì nhỏ hơn" (lớn thành nhỏ); ba hình nói "bé hơn nên lớn hơn" (bé thành lớn). Hai chiều đều đúng, nhưng đây chính kiểu "một quy tắc hai cách nói trong các màn liền nhau" của mục 15 vòng 6: hình `sbt-nhac-lai-so-sanh` đứng ngay dưới câu quy tắc và nói ngược lại.
- Sửa: viết theo chiều câu quy tắc: "bỏ dấu −: 12 lớn hơn 8 nên −12 nhỏ hơn −8" (đổi dòng thành `-12 < -8`, hay giữ `-8 > -12` với nhãn này), "bỏ dấu −: 630 lớn hơn 600 nên −630 nhỏ hơn −600", "52 lớn hơn 40". Đọc lại đối chiếu `explain` của `[80]` đến `[82]`.

#### 29. Bước "trừ một tích" của 3.32b chưa được tập và chưa có nhãn

- Vị trí: hình `sbt-3-32b-giai` dòng 2, `sbt-goi-y-3-32b` dòng 2 (nhãn "trừ là cộng với số đối"), `$.exercises[102].explain.text` (câu 1), câu dẫn `$.exercises[100]` (`dan-3-32b-nhan-hieu`). LL-16.
- Nguồn: tr.57 (3.32b `− 127 · (316 − 157)`), tr.113.
- Vấn đề: dòng 2 đổi cùng lúc `− 127 · (316 − 157)` thành `+ (−127) · [316 + (−157)]`. Phần đổi `316 − 157` trong ngoặc đã có nhãn "trừ là cộng với số đối", còn phần "số đối của `127 · (316 − 157)` là `(−127) · (316 − 157)`" không có nhãn, không có khối "Nhắc lại" hay câu dẫn nào tập (`dan-3-32b-nhan-hieu` chỉ có hiệu trong ngoặc, không có dấu − đứng trước một tích). Bé yếu thấy dấu − biến mất và −127 hiện ra mà không biết vì sao.
- Sửa: tách dòng 2 của hai hình thành hai dòng: `(−157) · (127 − 316) + (−127) · (316 − 157)` với nhãn "số đối của 127 · (316 − 157) là (−127) · (316 − 157)", rồi dòng có `[127 + (−316)]` với nhãn "trừ là cộng với số đối"; câu 1 của `explain` nói cùng hai bước. Hoặc cho `dan-3-32b-nhan-hieu` có dạng `5 − 2 · (4 − 6)` để bé tập cả hai bước.

#### 30. Lời giải 3.32a và câu dẫn `hai-tich` vẫn còn mơ hồ ở câu "hai tích có chung thừa số"

- Vị trí: `$.exercises[98].explain.text` (`dan-3-32a-hai-tich`), `$.exercises[99].explain.text` (`sbt-3-32a`). LL-25, LL-05.
- Nguồn: `.shots/review/phep-nhan-so-nguyen/doc-hieu-bai-tap-sach-4.md` (Haiku lượt 4: "tính chất nhân", "dài, nhiều bước"; đã quá 3 lượt cho hai mục này).
- Vấn đề: "Tích (−5) · 7 và tích 5 · (−7) cùng bằng −35, nên hai tích có chung thừa số 5" không nói hai tích nào có chung thừa số: hai tích đứng cạnh nhau là `5 · (−3)` và `(−5) · 7`, còn "chung thừa số" chỉ đúng sau khi viết `(−5) · 7` thành `5 · (−7)`. Cùng chỗ ở `[99]` với thừa số 20.
- Sửa: "Tích (−5) · 7 bằng −35, và 5 · (−7) cũng bằng −35, nên ta viết (−5) · 7 thành 5 · (−7). Khi đó hai tích 5 · (−3) và 5 · (−7) có chung thừa số 5. Đưa thừa số chung 5 ra ngoài: 5 · [(−3) + (−7)] = −50." (tách câu tính trong ngoặc ra câu riêng nếu `[length]` cho phép), áp tương tự cho `[99]` với 20, −9, −21.

#### 31. Lời giải 3.32b còn một câu dài, ghép ba phép tính

- Vị trí: `$.exercises[102].explain.text`. LL-25.
- Nguồn: `doc-hieu-bai-tap-sach-4.md` (Haiku lượt 4: "câu dài phức"; đã quá 3 lượt).
- Vấn đề: câu cuối "Còn lại 157 · 316 + (−127) · 316 = [157 + (−127)] · 316 = 30 · 316 = 9 480." nối ba bước trong một câu, và câu đầu "Đổi phép trừ thành cộng với số đối, rồi nhân từng số hạng" gói hai việc.
- Sửa: "Đổi mỗi phép trừ thành cộng với số đối, rồi nhân từng số hạng. Hai tích (−157) · 127 và 127 · 157 là hai số đối nhau, cộng lại bằng 0. Hai tích còn lại có chung thừa số 316, nên đưa 316 ra ngoài: [157 + (−127)] · 316 = 30 · 316 = 9 480." (kết hợp mục 29 khi sửa câu đầu).

#### 32. Màn "Nhắc lại cho bài 3.32 và bài 3.33" dồn năm câu quy tắc và một hình chỉ minh hoạ một câu

- Vị trí: `$.sections[12].blocks[3]` (5 câu `note` + hình `gop-thua-so-vi-du`). LL-20, LL-16.
- Nguồn: —
- Vấn đề: để giữ 4 màn, bản sửa gộp khối bài 3.33 vào khối 3.32: số đối, hai số đối cộng bằng 0, phân phối, đưa thừa số chung, thay đổi mỗi lần. Năm ý khác nhau trên một màn, hình chỉ nói về đưa thừa số chung, còn câu "Thay đổi tổng cộng ..." (chỉ dùng cho 3.33) không có hình. Vi phạm "section ngắn, một ý" của người học chậm. Chưa xem được màn thật vì không chạy walk: nếu bị cắt trên điện thoại thì nặng hơn.
- Sửa: chuyển câu "Thay đổi tổng cộng ..." sang khối thứ nhất (sửa tiêu đề thành "... bài 3.33 và bài 3.34" vì 3.33 cũng dùng quy tắc dấu), để khối 3.32 còn bốn câu. Hoặc gộp hai câu số đối thành một nhóm đứng ngay sau hình. Chạy `lesson:walk` xem lại màn này.

### Góp ý

#### 33. Tiêu đề hai khối "Nhắc lại" không nêu hết bài dùng quy tắc

- Vị trí: `$.sections[12].blocks[0].children[0].text` ("bài 3.26, bài 3.27, bài 3.29, bài 3.30 và bài 3.34"), `$.sections[12].blocks[1].children[0].text` ("bài 3.28"). LL-10.
- Nguồn: —
- Vấn đề: `explain` của 3.28, 3.32, 3.33 cũng dùng "hai số khác dấu nên tích là số âm" mà khối đầu không nêu; `explain` của 3.27 dùng "tích âm, nhỏ hơn 0" mà khối so sánh chỉ ghi "bài 3.28".
- Sửa: ghi "Nhắc lại cho các bài 3.26 đến 3.30 và 3.32 đến 3.34" và "bài 3.27 và bài 3.28", hoặc bỏ số bài khỏi tiêu đề ("Nhắc lại dấu của tích").

#### 34. Hai câu nguyên văn của `tap-hop-cac-so-nguyen` bị Haiku chấm mơ hồ

- Vị trí: `$.sections[12].blocks[1].children[1].text` ("câu phức"), `.children[2].text` ("logic ngược"). LL-25.
- Nguồn: `doc-hieu-bai-tap-sach-4.md`.
- Vấn đề: hai câu phải giữ nguyên văn câu quy tắc đã duyệt ở `tap-hop-cac-so-nguyen` (và `on-tap-chuong-3`), nên không viết lại riêng ở đây.
- Sửa: không sửa ở bài này; ghi vào `notebooks/backlogs/` để cân nhắc viết lại câu gốc ở cả ba bài một lần (câu 2: "Số âm nào có số lớn hơn sau khi bỏ dấu − thì nhỏ hơn số âm kia" khó vì hai lần so sánh).

#### 35. Vài cặp số lặp nhẹ giữa khối nhắc lại, câu dẫn và hình gợi ý

- Vị trí: hình `sbt-nhac-lai-tich-0` (`(x − 4) · (x + 1) = 0`, "x = 4") và `$.exercises[92]` (`dan-3-31b-x6-x4`: thừa số x + 4, nhiễu "x = 4"); hình `sbt-nhac-lai-so-sanh` ("−8 > −12") và `$.exercises[81]` ((−8) · 15 với 12 · (−11)); hình `sbt-goi-y-hai-tich` (`(6 − 2) · (−3)`), `$.exercises[97]` (`(11 − 1) · (−3)`) và `[98]` (`(7 − 2) · (−3)`); hình `sbt-goi-y-3-32a` (`(−9 − 1) · 7`) và `[98]` (`(−1 − 4) · 7`); hai hình `sbt-goi-y-nhan-hieu` và `sbt-goi-y-3-32b` đều mở bằng `(−2) · (...)`. LL-07.
- Nguồn: —
- Vấn đề: không lộ đáp án câu nào, nhưng bé gặp lại số cũ, và nhiễu "x = 4" của `[92]` trùng giá trị hiện ở màn nhắc lại.
- Sửa: đổi một số trong mỗi cặp, ví dụ `(x − 3) · (x + 8)` ở `sbt-nhac-lai-tich-0`, `(−6) · 15` hay đổi hình nhắc lại thành `−7 > −13`, `(5 − 2) · (−6)` ở `sbt-goi-y-hai-tich`.

### Đã tự tính

Chương trình Node và `tsx` trong thư mục nháp `review-sonnet/` (`check.js`, `vis2.ts`, `order.js`): 81 phép kiểm của exercise (section có 47 câu), 20 chuỗi biến đổi của hình, 0 sai.

| Đối tượng | Đã kiểm | Kết quả |
|---|---|---|
| `answer` và `check.expr` của mọi câu `numeric` trong section (23 câu, gồm 8 câu đổi: −38, −50, −600, 6, 9 480, 7 560, −180, −2 940) | tính lại `check.expr`, so `answer`; câu `answer` âm có `allowNegative` | khớp cả 23 |
| 8 phép của 3.33 (`4 · 50`, `18 · 420`, `(−3) · 60`, `(−7) · 420`, ba hình gợi ý) | tính tích | 200, 7 560, −180, −2 940; hình −60, 4 800, −900 |
| Lựa chọn 3.28c và hai câu dẫn (`relation: holds`) | tính hai vế mỗi lựa chọn: −85 và −93, −120 và −132, −600 và −630 | đúng một lựa chọn đúng mỗi câu, khớp `answer` |
| Câu tìm x `multiple` (`dan-3-31b`, `sbt-3-31b`, `dan-3-31c-am-x-12`, `sbt-3-31c`) | thay từng lựa chọn vào tích | đúng tập nghiệm (6, −4; 27, −9; 0, 12; 0, 43); sau khi bỏ "x = 5", "x = 6" không còn lựa chọn thừa |
| Lý do `wrong` có số (3.31 hai câu mới, 3.28c ba câu, 3.34 hai ví dụ) | thay x; tính tích (−2) · 3 · 4 và (−1) · (−2) · (−3) | đúng: 12 và −24, 43 và −86; −24, −6 |
| Bảng 3.30 và bảng nhỏ | 12 ô: tích, `accept` (cả khoảng hẹp trong "7 000"), có trong `bank` | khớp; nhiễu bảng nhỏ 24, 63, −40 không trùng đáp án; nhiễu 3.30: 420, −945, −7 000, 364, 293 |
| `explain` đổi | 5 · (−3) + (−5) · 7 = −50; 20 · (−9) + (−20) · 21 = −600; (−3) · (4 − 6) = 6; 157 · 316 + (−127) · 316 = 9 480 | đúng |
| 20 hình đổi hoặc liên quan, mọi dòng kể cả dòng ẩn "?" (−32, −110, 8, −14, −48, 0, −12, 4 800 ...) | tính từng dòng của chuỗi biến đổi, so các vế của dấu "=" | đúng; mọi hình gợi ý ẩn dòng kết quả |
| 3.34 `order` | mô hình định nghĩa và dùng a, b, q, tích bốn số, tích năm số; thử 120 hoán vị | duy nhất `s1 > s2 > s3 > s4 > s5` |
| 3.34 tính chất đề | mọi bộ năm số trong [−4; 4] mà mọi ba số có tích âm | 1 024 bộ, cả 1 024 có tích năm số âm |
| Câu dẫn 3.34: bốn lựa chọn | mọi bộ ba số trong [−4; 4] có tích âm | "cả ba âm" sai ở 192 bộ, "có số dương" sai ở 64 bộ, "có số 0" không có bộ nào, "ít nhất một số âm" đúng mọi bộ |
| Dùng lại hình và id | mọi `sbt-*` trong catalog có mặt trong `lesson.json`; `tang-giam-vi-du`, `thay-doi-vai` còn dùng ở section khác; câu dẫn đứng ngay trước câu sách | không hình thừa, không id treo |

## Vòng 8: lựa chọn của bài 3.27 đổi sang chữ (Sonnet, chỉ phần đổi)

- Phạm vi: `pnpm content:diff phep-nhan-so-nguyen --base 5e59189d2b9d67d223b07b50bf20006dd5729155`. Chỉ 5 exercise đổi (không phải 6): `sbt-3-27a`, `dan-3-27b-am48-35`, `sbt-3-27b`, `dan-3-27c-am62-am57`, `sbt-3-27c`. Mỗi câu đổi cả ba lựa chọn từ công thức (`tích > 0`, `< 0`, `= 0`) sang chữ "Tích lớn hơn 0", "Tích nhỏ hơn 0", "Tích bằng 0" và bỏ `check` (`relation: holds`). Không đổi `prompt`, `answer`, `explain`, `hints`. Section cần đọc lại: `bai-tap-sach-bai-tap` (chỉ các câu trên bị ảnh hưởng).
- Đề: mở `sbt-p56.png`. Đề 3.27 "Không thực hiện phép tính, hãy so sánh mỗi tích sau với 0: a) 287 · 522; b) (−375) · 959; c) (−278) · (−864)". Ba câu sách khớp từng chữ, số, dấu với `prompt`; hai câu dẫn dùng (−48) · 35 và (−62) · (−57), số khác sách, đúng khuôn câu dẫn.
- Dấu của tích (tự tính bằng Node, kết quả ở `review-sonnet2/sign.txt`): 287 · 522 = 149 814 (> 0); (−48) · 35 = −1 680 (< 0); (−375) · 959 = −359 625 (< 0); (−62) · (−57) = 3 534 (> 0); (−278) · (−864) = 240 192 (> 0).
- Mỗi câu đúng một đáp án đúng, `answer` ứng đúng lựa chọn đúng: `sbt-3-27a` `a` (lớn hơn 0); `dan-3-27b` `a` (nhỏ hơn 0); `sbt-3-27b` `c` (nhỏ hơn 0); `dan-3-27c` `b` (lớn hơn 0); `sbt-3-27c` `c` (lớn hơn 0). Ba lựa chọn mỗi câu đôi một loại trừ nhau.
- `explain.wrong`: mọi `optionId` trỏ đúng lựa chọn sai và lý do khớp chữ lựa chọn. `sbt-3-27a` b "tích chỉ âm khi khác dấu", c "bằng 0 khi có thừa số 0"; `dan-3-27b` b ("không phải tích dương"), c; `sbt-3-27b` a, b; `dan-3-27c` a, c ("không phải tích âm"); `sbt-3-27c` a, b. Không câu nào bỏ sót lựa chọn sai, không `wrong` nào trỏ vào lựa chọn đúng. `explain.text` của cả năm câu nêu đúng kết luận ("lớn hơn 0" hay "nhỏ hơn 0") khớp chữ lựa chọn.
- Không `explain`, `wrong` hay `hints` nào gọi lựa chọn theo vị trí ("đáp án A", "câu đầu"...); mọi chỗ dùng `optionId` và nói theo nội dung.
- Chữ lựa chọn: "Tích" luôn là tích đứng ngay trên trong `prompt` (khối công thức giữa hai câu `note`, mỗi câu chỉ một tích), nên không mơ hồ; "lớn hơn 0", "nhỏ hơn 0", "bằng 0" là chữ lớp 6 đã học, đọc rõ hơn công thức `... > 0`. Thứ tự lựa chọn khác nhau giữa các câu (đáp án ở `a`, `a`, `c`, `b`, `c`) nên không lộ vị trí.
- Bỏ `check`: hợp lệ. Luật (`.claude/rules/content.md`) chỉ bắt `check` khi lựa chọn "computable"; lựa chọn chữ không phải phép so sánh tính được nên không cần. Hệ quả: lint không còn tự tính lại các lựa chọn của năm câu này, đúng sai của đáp án dựa vào phép tính tay ở trên (đã kiểm).
- `content:check`: 1 lỗi duy nhất `[review-hash]` (dự kiến vì bản đang sửa), 0 cảnh báo; không lỗi nội dung.
- Không chạy `content:hash`, `lock`, `emit`, `lesson:walk` (ngoài phạm vi vai). Chưa xem ảnh phone của `lesson:walk` để xác nhận hết tràn thẻ: việc của điều phối.
- Kết luận vòng: 0 Nghiêm trọng, 0 Nên sửa, 0 Góp ý. Không đụng `docs/lessons-learned/`.

### Nghiêm trọng

Không có.

### Nên sửa

Không có.

### Góp ý

Không có.

## Tổng kết phần bài tập sách bài tập (sau vòng 8)

- Kết luận: Hết lỗi Nghiêm trọng (0 sau vòng 7). Đã chạy `pnpm content:hash phep-nhan-so-nguyen --approve` (đặt `published`) và `pnpm content:lock phep-nhan-so-nguyen` (thêm 48 id); `content:check` 0 lỗi, 0 cảnh báo. `lesson:walk` (cây tạm, cổng 3660): lần 1 có 2 FAIL (đáp án của SBT 3.27c tràn thẻ 5px trên điện thoại vì lựa chọn là công thức dài); sau khi đổi lựa chọn 3.27 sang chữ, vòng 8 và duyệt lại: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-nhan-so-nguyen-bai-tap-sach-cuoi/`. Đã đọc contact sheet điện thoại của năm màn "Nhắc lại" và câu đầu.
- Sách không in lời giải 3.26 và 3.27: đáp án do bài tự tính (920; −920; −920; 920; tích lớn hơn 0, nhỏ hơn 0, lớn hơn 0), reviewer vòng 6 và 7 tính lại bằng chương trình; ghi cho chủ dự án (Nên sửa 14 vòng 6, không có gì để sửa).
- Quyết định thiết kế đã được reviewer chấp nhận: câu đầu của 3.26 "Tính tích 115 · 8." tách thành `SBT 3.26` (ba ý a, b, c dùng tích đó; ý không chữ cái); 3.30 là một câu `fillBlank` bảng 8 cột; 3.34 ("giải thích tại sao") là câu `order` giữ nguyên đề; câu so sánh 3.28 viết "32 · (−25)" ở lựa chọn (lint `check` không tính được dấu + đứng trước); 3.27 dùng lựa chọn chữ vì công thức dài làm đáp án tràn thẻ điện thoại.
- Đã sửa sau vòng 6: Nghiêm trọng 11 (3.33 đảo sang "thay đổi mỗi lần · số lần"), 12 (lời giải 3.32b chép dòng hướng dẫn sách), 13 (3.32b dùng quy tắc chưa dạy; thêm hai câu nguyên văn "muốn trừ một số ..." và "hai số đối nhau ..." vào khối nhắc lại, câu dẫn mới `dan-3-32b-nhan-hieu`); Nên sửa 15 đến 22 (khối "Nhắc lại cho bài 3.28" mới với hai câu nguyên văn, lời giải 3.28c theo chiều "bỏ dấu −", hai câu nguyên văn thay câu nhắc mới, "hai số đối nhau cộng lại bằng 0", câu dẫn 3.30 đổi thứ tự và đề, bỏ nhiễu x = 5 và x = 6, câu dẫn `dan-3-32a-hai-tich` tập bước thừa số chung, hình gợi ý câu dẫn 3.34 đổi sang bộ ba số có tích âm); Góp ý 23 đến 26 (bước 3.34 bỏ tên r, số lặp, nhãn "ít nhất một thừa số bằng 0", chữ "x = −28" có dấu cách).
- Đã sửa sau vòng 7: Nên sửa 28 (ba nhãn hình theo chiều câu quy tắc), 29 (thêm dòng "số đối của 127 · (316 − 157) là (−127) · (316 − 157)" ở hình gợi ý và hình lời giải 3.32b), 30 và 31 (lời giải 3.32a và 3.32b tách ý), 32 (câu nhắc "Thay đổi tổng cộng ..." chuyển sang khối đầu để khối 3.32 còn bốn câu; khối bài 3.33 riêng bị bỏ vì mỗi section tối đa 4 màn); Góp ý 35 (số trong hình nhắc tích bằng 0 đổi sang x − 7).
- Đọc hiểu (Haiku): lượt 1 trên 176 mục: 171 / 5 / 0 (`.shots/review/phep-nhan-so-nguyen/doc-hieu-bai-tap-sach-1.md`); lượt 2 trên 4 mục viết lại 1 / 3 / 0 (`-2.md`); lượt 3 trên 3 mục 1 / 2 / 0 (`-3.md`); lượt 4 trên 28 mục chữ đổi sau vòng 6: 23 / 5 / 0 (`-4.md`); lượt 5 trên 3 lời giải và khối nhắc 3.32: 4 / 3 / 0 (`-5.md`); lượt 6 trên 9 lựa chọn mới của 3.27: 9 / 0 / 0 (`-6.md`).
- Còn lại, không chặn duyệt (Nên sửa còn: 3): ba lời giải còn được Haiku ghi "Hiểu mơ hồ" sau hơn ba lượt: `$.exercises[98].explain.text` (`dan-3-32a-hai-tich`), `$.exercises[99].explain.text` (`sbt-3-32a`), `$.exercises[102].explain.text` (`sbt-3-32b`); lý do: bước viết (−20) · 21 thành 20 · (−21) và "hai tích còn lại" của bài 3.32 là bước khó thật của đề sách, đã nêu từng bước trong hình lời giải. Góp ý còn: 27 (hai hình gợi ý 3.29 cho thấy một trường hợp), 33 (tiêu đề hai khối nhắc nêu thiếu bài dùng quy tắc), 34 (hai câu nguyên văn của bài `tap-hop-cac-so-nguyen` ở khối nhắc 3.28 bị Haiku ghi mơ hồ; phải giữ nguyên văn, sửa ở bài gốc nếu chủ dự án muốn), 35 (vài cặp số lặp nhẹ, còn nhiễu x = 4 của `dan-3-31b-x6-x4` không còn trùng nghiệm hình nhắc sau khi đổi sang x − 7).
- Tổng ba vòng của phần này: Nghiêm trọng 3 (vòng 6), Nên sửa 14 (9 + 5), Góp ý 8 (5 + 3).
