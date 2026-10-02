# Review: Phép nhân số nguyên (`phep-nhan-so-nguyen`)

- Bài: `content/math/kntt/phep-nhan-so-nguyen/lesson.json`
- Lịch sử: vòng 1: 5 Nghiêm trọng, 17 Nên sửa, 20 Góp ý; vòng 2: 1 Nghiêm trọng, 20 Nên sửa, 17 Góp ý.
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: cong-lap, nhan-voi-0, duong-nhan-am, khac-dau, am-nhan-am, dau-cua-tich, giao-hoan-ket-hop, nhieu-thua-so, phan-phoi, gop-thua-so, tich-bang-0, bai-toan-thuc-te
- Nguồn đã đọc: `sources/math/phep-nhan-so-nguyen/` - sbt-p55, sbt-p56, sbt-p57 (đề); sbt-p112, sbt-p113 (lời giải) không mở lại vì không mục nào trong diff đổi đáp án của bài sách
- `content:check`: 0 lỗi, 1 cảnh báo của bài (96 id chưa có trong `ids.lock.json`: đúng, bài chưa được duyệt nên chưa khoá id)
- Đọc hiểu (Haiku): lượt 1 181 / 47 / 0 (`.shots/review/phep-nhan-so-nguyen/doc-hieu.md`); lượt 2 trên 106 mục đổi 89 / 17 / 0 (`doc-hieu-2.md`); lượt 3 trên 21 mục viết lại 16 / 5 / 0 (`doc-hieu-3.md`). Đã đủ 3 lượt: 5 mục còn "Hiểu mơ hồ" ghi ở Nên sửa (mục 3, 4, 5), không chặn duyệt.
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-nhan-so-nguyen/`
- Kết luận: Đạt: 0 lỗi Nghiêm trọng (0 Nghiêm trọng, 5 Nên sửa, 8 Góp ý). Chưa chạy lệnh cuối vòng: điều phối chạy `pnpm content:hash phep-nhan-so-nguyen --root content --approve`, rồi `pnpm content:lock phep-nhan-so-nguyen`; lệnh đó ghi dòng "Bản đã review" (dòng cũ của vòng 2 đã bỏ vì hash không còn đúng).

Review vòng 2 có 38 phát hiện, 37 phát hiện cần kiểm (trừ bố cục hình trên điện thoại, việc của người làm app): 35 đã sửa đúng, gồm lỗi Nghiêm trọng duy nhất (hình `khac-dau-mau` và `goi-y-khac-dau-9-nhan-am2` nay xếp `= -(6 · 3)` rồi `= -18`, không còn chuỗi `6 · 3 = 18 = −18`). Phát hiện về hai cách nói của việc ghép cặp tính nhanh sửa chưa trọn (mục 2 dưới đây); phát hiện về câu quy tắc tích nhiều thừa số đã sửa nhưng câu mới thiếu ý (mục 1). Hai phát hiện về "cách đây" và về câu màn đời sống thiếu mốc so sánh đã có mốc và một cách nói "N giờ trước"; phần Haiku còn mơ hồ ghi ở mục 3 và 5.

Đã tự giải trước khi đọc đáp án mọi exercise mới hay đổi: `tinh-am9-nhan-0` (0), `tinh-6-nhan-am4` (−24), `chon-tich-15` (a, b), `tinh-am8-nhan-am3` (24), `noi-tich-voi-ket-qua` (5 cặp, thêm (−6) · (−1) = 6), `tinh-nhanh-am25-7-4` (−700), `chon-bang-tich` ((−9) · (−2) · 4 = 72: a, b), `tinh-am6-2-am3` (36), `chon-so-sanh-ba-so` (a, c), `tinh-co-0` (0), `chon-tich-bang-0` (a, b, c), `nhiet-do-giam-5-gio` (−20), `vai-20-bo` (−80), `thang-may-xuong` (−15), `chon-tinh-huong-am` (a, c), `cach-day-2-gio` (−8), `quy-luat-4-nhan` (−4), `chon-tich-am12` (a, b), `xep-tich-khac-dau` (−15 < −9 < −7), `so-sanh-hai-tich`, `b-dau-gi`, `dau-tich-ba-so`, `dem-hai-so-am`, `tinh-4-nhan-tong-am` (−12): đều khớp `answer`, `check`, `pairs`; không đáp án nhiễu nào cũng đúng (LL-01); không `explain`/`wrong` nào gọi lựa chọn theo vị trí (LL-26). Nấc 1 không lộ đáp án; nấc 2 của `tinh-6-nhan-am4`, `tinh-am8-nhan-am3`, `tinh-am6-nhan-am3` dừng ở "?" với số khác đề (LL-02). Recap của 12 section và 12 card lặp nguyên văn câu `rule: true` (đã đối chiếu bằng script). Số của câu kiểm tra và câu luyện không trùng hình cùng section; chỗ trùng ở kho ôn khác section ghi ở mục 13. Bản sửa không có câu nào chép lời sách (đối chiếu tr.55 đến tr.57). Ảnh walk (điện thoại 18 tờ, iPad ngang hai tờ lấy mẫu): không chữ chồng hay bị cắt; hình bài đều vừa màn; nhãn hình `tang-giam-vi-du` và `thay-doi-vai` đã ngắt dòng ở dấu hai chấm, không còn ngắt giữa số và đơn vị.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Quy tắc section 8 chỉ kể "2, 4 hay 6" và "1, 3 hay 5" thừa số âm, thiếu trường hợp không có thừa số âm

- Vị trí: `$.sections[7].blocks[1].children[0].text` (`section.nhieu-thua-so`); lặp nguyên văn ở `$.sections[7].recap.caption` và `$.cards[7].recap.caption`. LL-06, LL-20.
- Nguồn: tr.55, `sbt-p55.png` (kiến thức cần nhớ 3, ví dụ 2)
- Vấn đề: bản viết lại để Haiku dễ hiểu thay "chẵn / lẻ" bằng một danh sách. Từng vế vẫn đúng, nhưng quy tắc chỉ phủ 1 đến 6 thừa số âm: tích bốn số dương (không thừa số âm) hay tích có 8 thừa số âm không có câu nào để bé dựa, trong khi bé học quy tắc này để áp cho tích bất kỳ. Quy tắc cũ phủ hết mọi trường hợp.
- Sửa: "Tích nhiều thừa số khác 0 là số dương khi số thừa số âm là số chẵn, như 0, 2, 4. Tích là số âm khi số thừa số âm là số lẻ, như 1, 3, 5." (note, recap section, recap card giống nhau từng chữ); cho Haiku đọc lại ba mục này.

### 2. Hai cách nói cho cùng một việc "ghép cặp để tính nhanh", sửa vòng 2 mới đi một nửa

- Vị trí: chữ: `$.sections[6].blocks[2].children[0].text` ("hai số nhân ra 10, 20 hoặc 100"); `$.exercises[32].explain.text`, `$.exercises[33].explain.text` ("hai số có tích tròn chục"); hình `ghep-nhanh` (tiêu đề và nhãn "tròn chục"), `goi-y-ghep-nhanh` (nhãn "ghép hai số có tích tròn chục"). LL-05, LL-20.
- Nguồn: tr.55, `sbt-p55.png`
- Vấn đề: review vòng 2 đã đòi chốt một cách nói. Tác giả chỉ đổi note (vì Haiku lượt 2 đánh dấu "tích tròn chục" là mơ hồ), còn hình và hai lời giải ngay dưới vẫn nói "tích tròn chục". Ở `tinh-nhanh-am25-7-4` cặp ghép ra −100, không phải "100" như note nói.
- Sửa: chốt một câu cho chữ, nhãn hình và hai `explain`: "ghép hai số nhân ra 10, 20, 100 (hoặc −10, −20, −100)"; sửa `explain.text` của hai câu cho khớp; tip `$.sections[9].blocks[3]` đã nói "cộng ra 10, 20 hoặc 100", giữ.

### 3. Câu "ta viết 2 giờ trước là −2 giờ" vẫn "Hiểu mơ hồ" sau ba lượt đọc hiểu

- Vị trí: `$.sections[2].blocks[0].children[0].text` (`section.duong-nhan-am`), `$.sections[4].blocks[0].children[0].text` (`section.am-nhan-am`). LL-25.
- Nguồn: —
- Vấn đề: Haiku lượt 3: lý do "viết −2 giờ". "−2 giờ" là một quy ước chưa dạy ở đâu trong bài; bé không hiểu vì sao giờ lại âm.
- Sửa: "Nhiệt độ tăng đều 3 độ mỗi giờ. Ta ghi 2 giờ sau là số 2, còn 2 giờ trước là số −2. Vì vậy 2 giờ trước nhiệt độ thấp hơn bây giờ 6 độ, nên 3 · (−2) = −6." Section 5 làm tương tự với "3 giờ trước là số −3". Đã đủ 3 lượt nên không chặn duyệt.

### 4. Câu "Nhìn các dòng đi xuống" chỉ dựa vào hình mà màn đầu hình còn dấu "?"

- Vị trí: `$.sections[2].blocks[1].children[0].text`, `$.sections[4].blocks[1].children[0].text`. LL-25.
- Nguồn: —
- Vấn đề: Haiku lượt 3: lý do "chỉ hình ảnh". Khi bé đọc, hình mới hiện một dòng và các dòng sau là "?", nên "các dòng đi xuống" chưa có gì để nhìn. Câu cũng ngắt dòng giữa tích (`035-s3-02-block`: "và 3 / · (−2) = −6").
- Sửa: "Mỗi dòng đi xuống, số đứng sau dấu nhân giảm 1 và tích giảm 3. Cứ đi tiếp thì được 3 · (−1) = −3, rồi 3 · (−2) = −6." Section 5: "… giảm 1 và tích tăng 3 …". Giữ chú thích "(tức thừa số thứ hai)" ở lần đầu, hoặc bỏ hẳn nếu câu sửa đã đủ rõ. Không chặn duyệt.

### 5. Câu mở đầu section 6 nói "Có bốn trường hợp" mà không nói bốn trường hợp là gì, và đảo "2 giờ sau" so với hình "sau 2 giờ"

- Vị trí: `$.sections[5].blocks[0].children[0].text` (`section.dau-cua-tich`); nhãn hình `bon-truong-hop`. LL-25, LL-05.
- Nguồn: —
- Vấn đề: Haiku lượt 3: lý do "Có bốn trường hợp". Chữ nói "2 giờ sau hoặc 2 giờ trước", hình nói "sau 2 giờ" và "2 giờ trước".
- Sửa: "Nhiệt độ tăng hay giảm 3 độ mỗi giờ. Ta xét sau 2 giờ và 2 giờ trước. Mỗi cách cho một tích, nên có bốn tích." Không chặn duyệt.

## Góp ý

### 6. Chữ viết lại ngắt dòng giữa phép nhân trên điện thoại

- Vị trí: `$.sections[6].blocks[2].children[0].text` (ảnh phone `079-s7-03-block`: "(−5) / · 7 · (−2)"); `$.sections[4].blocks[0].children[0].text` (`056-s5-01-block`: "(−2) · (−3) / = 6"). LL-12.
- Nguồn: —
- Vấn đề: chữ mới dài hơn nên phép tính cuối câu rơi xuống dòng.
- Sửa: để phép tính cho hình, câu chỉ nói việc phải làm (vd "Ví dụ mẫu: đổi chỗ để ghép hai số nhân ra 10, 20 hoặc 100.").

### 7. Note "cùng làm" nói "số n" còn nút trên hình ghi "Số đứng sau dấu nhân"

- Vị trí: `$.sections[2].blocks[3].children[0].text`, `$.sections[4].blocks[3].children[0].text`; nhãn nút của `factor-try.tsx`. LL-05.
- Nguồn: —
- Vấn đề: hình không có chữ n (các dòng là `2 · 3 = 6` …), nên chữ "n" trong note là tên thứ ba cho cùng một số.
- Sửa: "bấm nút mũi tên xuống để giảm số đứng sau dấu nhân, từ 3 xuống −2".

### 8. Mẹo gộp thừa số chung nói "số chung", quy tắc ngay trên nói "thừa số chung"

- Vị trí: `$.sections[9].blocks[3].text` (`tip.gop-thua-so-chung`). LL-05.
- Nguồn: —
- Vấn đề: "thừa số" là từ chuẩn của sách và glossary, đã dạy ở các section trước; tip đổi sang "số" nên cùng khái niệm có hai tên trong một section.
- Sửa: "Hai tích cộng nhau mà có chung một thừa số, thì đưa thừa số chung đó ra ngoài. Nếu hai số còn lại cộng ra 10, 20 hoặc 100 thì nhân rất nhanh."

### 9. "Lúc 3 giờ trước" đọc được như giờ trên đồng hồ

- Vị trí: `$.exercises[24].prompt[0].text` (`ex.nhiet-do-cach-day-4`), `$.exercises[62].prompt[0].text` (`ex.cach-day-2-gio`), `$.exercises[62].explain.text` ("2 giờ trước bây giờ viết là −2"). LL-10.
- Nguồn: —
- Vấn đề: "Lúc 3 giờ" là 3 giờ chiều hay 3 giờ sáng trong cách nói hằng ngày; ngữ cảnh "cao hơn bây giờ" gỡ được nhưng thừa một bước đoán.
- Sửa: "3 giờ trước, nhiệt độ cao hơn bây giờ bao nhiêu độ?"; "So với bây giờ, 2 giờ trước nhiệt độ thay đổi bao nhiêu độ?"; explain "2 giờ trước ghi là −2."

### 10. Lời giải `xep-tich-khac-dau` không nói vì sao −9 bé hơn −7

- Vị trí: `$.exercises[19].explain.text` (`ex.xep-tich-khac-dau`).
- Nguồn: —
- Vấn đề: chỉ giải thích "−15 bé nhất"; thứ tự của hai tích còn lại chỉ có trong `tex`.
- Sửa: thêm "9 lớn hơn 7 nên −9 bé hơn −7." (vẫn trong 3 câu).

### 11. Kho ôn `noi-tich-voi-ket-qua` lặp phép tính của hai câu luyện

- Vị trí: `$.exercises[28]` (`ex.noi-tich-voi-ket-qua`): `5 · (−2)` trùng `ex.tinh-5-nhan-am2`, `(−4) · 3` trùng `ex.nhiet-do-giam-3`. LL-07.
- Nguồn: —
- Vấn đề: phiên ôn hiện lại phép tính bé vừa luyện ở section khác; bé nhớ số thay vì xét dấu.
- Sửa: đổi hai cặp sang số chưa dùng ở câu luyện nào (vd `(−6) · 3 = −18` và `4 · (−5) = −20`), sửa cột phải tương ứng.

### 12. Bố cục điện thoại còn hai chỗ phải cuộn (việc của người làm app, ghi nhận)

- Vị trí: hình `am2-nhan3` (ảnh phone `006-s1-01-block-end`: ba nhãn "−2" cạnh hình thoi đọc thành "♦−2♦−2♦−2"); lời kết của `cung-2-nhan-am2` (`039-s3-04-block-shown`) và `cung-am2-nhan-am3` (`061-s5-04-block-shown`) nằm dưới thanh nút cuối màn. LL-21, LL-12.
- Nguồn: —
- Vấn đề: đã ghi ở review vòng 2; không chặn bài. Hình bài đều vừa màn, các chỗ khác đã ghi ở vòng 2 (chữ "6." rơi một mình, nhãn cắt giữa số và đơn vị) đã hết.
- Sửa: báo người làm app.

### 13. Mã hình còn một validator không câu nào dùng

- Vị trí: `src/visuals/math/phep-nhan-so-nguyen/logic.ts` (`dat-thua-so`), `catalog.ts` (`VALIDATOR_IDS.factorTry`), `tests/visuals/registry.test.tsx`.
- Nguồn: —
- Vấn đề: hai câu `manipulate` dùng `dat-thua-so` đã đổi thành câu `numeric`; `factorTry` vẫn dùng cho hai màn "cùng làm" nhưng validator thì không còn câu nào gọi.
- Sửa: giữ nếu sắp có bài dùng tiếp, không thì xoá cùng dòng test; việc của người giữ mã, không phải của bài.
