# Review: Dấu hiệu chia hết (`dau-hieu-chia-het`)

- Bài: `content/math/kntt/dau-hieu-chia-het/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song (nhóm 1: section 1–5, nhóm 2: section 6–10, nhóm 3: section 11–14) + tổng hợp
- Nguồn đã đọc: `sources/math/dau-hieu-chia-het/` - sbt-p33, sbt-p34, sbt-p105, sbt-p106
- `content:check`: 0 lỗi; còn cảnh báo id chưa khoá (bài chưa xuất bản)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/dau-hieu-chia-het/`
- Kết luận: Chưa đạt: còn 5 lỗi Nghiêm trọng
- Bản đã review: `7403b957093b97f094c4299a54e8acf7146d2b0f81a602debd86f3a35c222edd` (`pnpm content:diff` so với bản này)

Mọi bài tập đã được tự giải trước khi đọc `answer`: mọi câu `choice`, `numeric`, `fillBlank`, `match` có đúng một đáp án (hay đúng một tập khi `multiple`); bốn câu `manipulate` có nhiều chữ số đúng (`o-trong-2`, `o-trong-5`, `o-trong-9`, `o-trong-3`) được validator `chia-het` nhận đủ. Lỗi đáp án chỉ ở hai câu `order` (Nghiêm trọng 3, 4).

## Nghiêm trọng

### 1. Danh sách "các số chia hết cho 9 nhỏ" bỏ số 0 và không nói "nhỏ" là tới đâu

- Vị trí: `$.sections[4].blocks[2].children[0].text` và nhãn hình `dau-hieu-chia-het.visual.bang-chin` ("Các số chia hết cho 9 nhỏ") (section `chia-het-9`) - LL-17
- Nguồn: tr.33, `sbt-p33.png`; Bài 8 (`quan-he-chia-het-va-tinh-chat`) đã dạy 0 là bội của mọi số khác 0
- Vấn đề: "Các số chia hết cho 9 nhỏ là 9, 18, 27, 36 và 45" đọc như danh sách đủ: trẻ mất số 0 vừa học ở Bài 8 và không biết 54 có "nhỏ" không. Cùng kiểu `ex.dien-boi-3` của Bài 8 vòng 1.
- Sửa: nói rõ khoảng: "Các số chia hết cho 9 từ 9 đến 45 là 9, 18, 27, 36 và 45. Khi có tổng các chữ số, bạn so nó với các số này." Đổi nhãn hình `bang-chin` cùng chữ (LL-15).

### 2. Thẻ "18 là số chia hết cho 9, gần 11 nhất" sai toán học, recap lặp mẹo sai

- Vị trí: visual `dau-hieu-chia-het.visual.tim-38a` (section `tim-chu-so`, màn 1) và recap `dau-hieu-chia-het.visual.tom-tat-tim-26c` ("9 chia hết cho 9, gần 8 nhất") của section và `card.tim-chu-so` - LL-17
- Nguồn: tr.33 ví dụ 1, `sbt-p33.png` (sách lập luận "(4 + d) chia hết cho 9, d là chữ số nên d = 5")
- Vấn đề: 9 gần 11 hơn 18. Trẻ học mẹo "chọn số chia hết cho 9 gần nhất" sẽ chọn 9 rồi bế tắc (11 + a = 9), hoặc nhớ sai cách tìm; recap nhắc lại mẹo này trong phiên ôn.
- Sửa: nêu đúng lý do như `giai-4d6`: thẻ "a từ 0 đến 9, nên 11 + a từ 11 đến 20; chỉ có 18 chia hết cho 9". Recap: "c từ 0 đến 9, nên 8 + c là 9".

### 3. Quy tắc `tim-chu-so` nói "dấu hiệu 3, 9 tìm các chữ số còn lại", trái với chính ví dụ của section và của sách

- Vị trí: `$.sections[10].blocks[1].children[0].text` (note `rule`), `$.sections[10].recap.caption`, `card.tim-chu-so` recap; ví dụ `tim-38a`, `tom-tat-tim-26c` - LL-17 (Tổng hợp phát hiện; gộp Góp ý 6 của nhóm 3)
- Nguồn: tr.33 ví dụ 1, `sbt-p33.png`: chữ số tận cùng d của 1111d được tìm bằng dấu hiệu chia hết cho 9
- Vấn đề: câu quy tắc chia việc "2, 5 tìm chữ số tận cùng; 3, 9 tìm các chữ số còn lại". Nhưng màn 1 (38a) và hình recap (26c) đều tìm chữ số tận cùng bằng dấu hiệu chia hết cho 9, và ví dụ 1 của sách cũng vậy. Recap tự mâu thuẫn giữa caption và hình; trẻ nhớ quy tắc sẽ nghĩ không dùng được dấu hiệu 9 cho chữ số tận cùng, hoặc bối rối khi gặp 38a. Câu quy tắc không có trong sách.
- Sửa: viết lại quy tắc (recap chép y nguyên) theo việc thật: "Muốn tìm chữ số chưa biết, ta dùng dấu hiệu mà đề cho. Đề cho chia hết cho 2 hay 5 thì xét chữ số tận cùng. Đề cho chia hết cho 3 hay 9 thì xét tổng các chữ số." Recap nên có một ví dụ hai bước (vd 26c chia hết cho cả 5 và 9) để minh hoạ cả hai câu.

### 4. `xep-1530`: nhiều thứ tự đúng nhưng chỉ chấm một

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.xep-1530")].items` (`card.cho-hai-so`, kho ôn) - LL-01
- Nguồn: tr.34 câu 2.13, `sbt-p34.png`
- Vấn đề: bước "tận cùng 0 nên chia hết cho 5" độc lập với ba bước xét chia hết cho 3; xếp xét 3 trước cũng đúng, và còn là thứ tự đề gợi ý ("chia hết cho cả 3 và 5"). Quy tắc section chỉ nói "xét lần lượt từng dấu hiệu", không định thứ tự (note màn chạm lại nói "xét chữ số tận cùng trước"). Trẻ xếp đúng logic vẫn bị chấm sai.
- Sửa: bỏ bước tận cùng khỏi bài `order` (chỉ xếp ba bước xét chia hết cho 3 rồi "Vậy..."), hoặc nối các bước thành chuỗi phụ thuộc ("Số 1 530 chia hết cho 5. Xét tiếp tổng các chữ số: 1 + 5 + 3 + 0 = 9" → "9 chia hết cho 3 nên 1 530 chia hết cho 3"), hoặc đổi sang `choice`/`fillBlank`.

### 5. `xep-tong-3410`: hai bước đầu đổi chỗ vẫn đúng

- Vị trí: `$.exercises[?(@.id=="dau-hieu-chia-het.ex.xep-tong-3410")].items` (`card.tong-hieu`, kho ôn) - LL-01
- Nguồn: tr.34 câu 2.15, `sbt-p34.png`
- Vấn đề: "3 410 tận cùng 0 nên chia hết cho 2" và "1 274 tận cùng 4 nên chia hết cho 2" độc lập; xét 1 274 trước vẫn đúng nhưng bị chấm sai.
- Sửa: chuỗi phụ thuộc, vd "Nhìn chữ số tận cùng của hai số hạng: 0 và 4" → "0 và 4 đều là chữ số chẵn nên hai số hạng đều chia hết cho 2" → "Vậy tổng chia hết cho 2"; không làm được thì đổi sang `choice`.

## Nên sửa

### 1. Câu tự làm bắt cộng chữ số của nhiều số có 4 chữ số

- Vị trí: `ex.tong-2431` (kiểm tra), `ex.tong-5082`, `ex.chon-chia-het-9`, `ex.chon-chia-het-3` (luyện tập), `ex.chon-tong-12`, `ex.chon-nhieu-tong-9`, `ex.chon-nhieu-9`, `ex.chon-nhieu-3`, `ex.chon-nhieu-3-5` (kho ôn); hình chạm `chon-tong-9`, `chon-9-243` - LL-18
- Nguồn: —
- Vấn đề: mỗi số 4 chữ số cần 3 phép cộng rồi thêm bước xét chia hết; câu chọn trong bốn số thành 12 phép cộng, vượt luật "Số nhỏ" (tối đa 2 phép tính nhẩm) với trẻ yếu tính. Ví dụ mẫu `cong-6384` dài 3 bước là đúng luật vì có hình từng bước.
- Sửa: câu kiểm tra, luyện tập, độ khó 1 dùng số 3 chữ số; câu độ khó 2 muốn giữ 4 chữ số thì có chữ số 0, 1 (như 5 082, 2 010) hoặc in sẵn tổng như `tong-18-chia-het-9`; câu `multiple` có thể giảm còn 3 lựa chọn. Đổi số thì soát lại `[review-bank]` và số recap (LL-07).

### 2. Đề `tan-cung-5` và nhãn hình `so-cuoi-*` viết cụt

- Vị trí: `ex.tan-cung-5` (`prompt[0].text`); chú thích "Chữ số tận cùng cho số chia hết" trong `so-cuoi-2`, `so-cuoi-5`, `so-cuoi-2-5` (màn quy tắc và recap ba section đầu) - LL-10
- Nguồn: —
- Vấn đề: "chữ số tận cùng cho số chia hết cho 5" không tự nhiên; nhãn hình bỏ lửng "chia hết" (cho mấy?), nhất là ở `so-cuoi-2-5` có ba hàng.
- Sửa: đề "Số chia hết cho 5 có thể có chữ số tận cùng là chữ số nào? Chọn tất cả." Nhãn: "Tận cùng như vầy thì chia hết cho 2" (theo từng hàng).

### 3. `chon-2-5-kiem` có đáp án 40 trùng chip trẻ vừa chạm

- Vị trí: `ex.chon-2-5-kiem` (đáp án 40) và hình `chon-2-5-20` (section `chia-het-2-5`) - LL-07
- Nguồn: —
- Vấn đề: màn chạm ngay trước đã xác nhận 40; câu kiểm tra hỏi lại đúng 40, trẻ chọn theo trí nhớ.
- Sửa: đổi đáp án câu kiểm tra sang số chưa xuất hiện (vd 90), hoặc đổi chip 40 thành 50.

### 4. `overview.hook` dùng "chữ số cuối" và không có kết

- Vị trí: `$.overview.hook.text` - LL-05, LL-10
- Nguồn: —
- Vấn đề: (a) "chữ số cuối" trong khi bài và glossary dùng "chữ số tận cùng" (glossary cấm "chữ số cuối cùng"): một khái niệm hai tên. (b) Câu hỏi "được mấy tờ" (135 : 5, quá sức trẻ yếu chia) không được trả lời ở đâu.
- Sửa: "Mẹ nhờ bạn xem 135 nghìn đồng đổi hết ra tờ 5 nghìn đồng được không. Chỉ cần nhìn chữ số tận cùng là bạn biết ngay." và cho section `chia-het-5` một dòng kết (caption hay câu kho ôn "135 có chữ số tận cùng là 5 nên đổi vừa hết").

### 5. Quy tắc `tong-hieu` không nói tính chất là gì; section mở bằng công thức trần

- Vị trí: `$.sections[8].blocks[2].children[0]` (note `rule`), `$.sections[8].recap`, `card.tong-hieu` recap; `$.sections[8].blocks[0..1]` (`tong-1640-3272`, `hieu-4275-1132`) - LL-06, LL-05
- Nguồn: tr.33 mục Kĩ năng, tr.34 câu 2.15–2.16
- Vấn đề: quy tắc và recap chỉ nói "dùng tính chất của tổng hoặc của hiệu", không nhắc tính chất đó; nội dung thật chỉ ở nhãn nhỏ của `tong-40-15`. Hai màn đầu không có câu chữ nối với Bài 8.
- Sửa: quy tắc (recap chép y nguyên) theo Bài 8, giữ phạm vi "ít nhất một số chia hết": "Hai số đều chia hết cho 2 (hay 5) thì tổng và hiệu của chúng chia hết cho số đó. Chỉ một số chia hết thì tổng và hiệu không chia hết cho số đó." Thêm note ngắn trước `tong-1640-3272`: "Nhắc lại Bài 8: ta xét từng số hạng, không cần tính tổng."

### 6. `luy-thua-10` không có ví dụ hay câu hỏi đời sống

- Vị trí: `$.sections[9]`, các câu `tong-10-5-2`, `chon-10-9`, `chon-nhieu-10-3`, `dien-10-7` - LL-16
- Nguồn: tr.34 câu 2.21–2.22
- Vấn đề: luật "Ví dụ đời sống ở mọi section Toán" chưa đạt.
- Sửa: thêm câu luyện hay câu kho ôn số nhỏ, vd "Hộp có 10² viên bi, thêm 2 viên, chia đều cho 3 bạn được không?" (102); tránh trùng `tong-10-4-8`.

### 7. `gop-tien-25-32`: đề lẫn "đổi hết" với "vừa hết", nhiễu c sai hiển nhiên

- Vị trí: `ex.gop-tien-25-32` (kho ôn `tong-hieu`) - LL-10, LL-14
- Nguồn: —
- Vấn đề: "rồi đổi hết ra tờ 5 nghìn đồng. Có đổi vừa hết không?" dễ hiểu ngược; nhiễu "Có, vì 32 chia hết cho 5" loại được không cần tính chất tổng.
- Sửa: "Hai bạn gộp tiền rồi đổi ra tờ 5 nghìn đồng. Có đổi được mà không thừa tiền không?"; nhiễu c thành "Không, vì cả 25 và 32 đều không chia hết cho 5".

### 8. Câu điền dễ sai không có gợi ý

- Vị trí: `ex.dien-hieu-5`, `ex.dien-3-9-5232` (`hints.highlight: []`, không `hintVisualId`) - LL-02
- Nguồn: —
- Vấn đề: hai chỗ trẻ hay nhầm nhất (một số chia hết một số không; chia hết cho 3 mà không cho 9) không có gì sáng lên, không có hình gợi ý.
- Sửa: thêm `hintVisualId` dùng số khác đề, dừng ở "?" (kiểu `hieu-4275-1132` mode hint, kiểu `ba-khac-chin` với số khác), hoặc khối `formula` có `\htmlId` rồi trỏ `target: "part"`.

### 9. Số từ 4 chữ số hiện hai kiểu khoảng cách trên cùng màn (do app)

- Vị trí: chip `chon-tong-9`, `chon-9-243`, `chon-3-1524`, `chon-2-3-1230`; caption `xet-2136`; lựa chọn chữ (`chon-chia-het-9`, `chon-2-3-kiem`, `chon-3-5-2715`...); ảnh `phone/041-s4-03-block.png`, `phone/054-s5-03-block.png`, `phone/058-s5-06-exercise-chon-chia-het-9.png`, `phone/074-s7-01` (gộp nhóm 1, 2, 3)
- Nguồn: —
- Vấn đề: U+202F (đúng luật `docs/spec.md`) bị font chip và lựa chọn vẽ rất hẹp, nhìn thành "2340", "2136", trong khi KaTeX cùng màn hiện "2 136"; số mở đầu bằng 1 trong KaTeX cũng như liền. Lỗi do app (`src/visuals/shared/pick-chips.tsx` và kiểu chữ lựa chọn), không chặn bài.
- Sửa: báo người làm app: hiển thị dấu nhóm hàng nghìn bằng khoảng có độ rộng cố định (bọc nhóm trong `span` có `margin-left` khoảng 0.25em) cho bằng `\,` của KaTeX. Không đổi `lesson.json`, `catalog.ts`.

### 10. `tich-chia-het` ngầm dạy chiều ngược không có trong sách

- Vị trí: `ex.chon-nhieu-tich-5` (kho ôn, `multiple`), chip `chon-tich-5`, `chon-tich-4` (luyện tập), `chon-tich-3` (kiểm tra), note màn chạm "Tìm xem thừa số nào chia hết cho 5" - LL-09
- Nguồn: tr.33 mục Kĩ năng (chỉ một chiều)
- Vấn đề: muốn loại 14 · 3, 9 · 8, 6 · 11, trẻ phải tính tích (trẻ yếu nhân) hoặc dùng suy luận chưa dạy "không thừa số nào chia hết thì tích không chia hết", sai với số chia 4, 9 (2 · 6 = 12 chia hết cho 4), mà `chon-tich-4` lại chia cho 4.
- Sửa: thêm vào note màn chạm và quy tắc: "Không có thừa số nào chia hết cho 5 thì tính tích rồi xét chữ số tận cùng."; nhiễu có tích nhỏ dễ tính (3 · 4, 2 · 7); câu chia cho 4 đổi số chia thành 2, 3, 5 hoặc chỉ giữ dạng một đáp án.

### 11. `nhan-9-ab`: ba bước, có phép chia 126 : 9

- Vị trí: `ex.nhan-9-ab` (`card.tim-chu-so`, kho ôn) - LL-18
- Nguồn: tr.33 ví dụ 1
- Vấn đề: cộng chữ số, tìm d = 6, rồi chia 126 : 9; bước chia làm hỏng câu ôn với trẻ yếu chia.
- Sửa: hỏi "Tìm chữ số d" (đáp án 6), để 126 : 9 = 14 cho hình lời giải; hoặc đổi sang `choice` để trẻ kiểm bằng nhân với 9.

### 12. `mua-vo-65`: ba phép tính sau bước suy luận

- Vị trí: `ex.mua-vo-65` (`card.but-vo`, kho ôn) - LL-18
- Nguồn: —
- Vấn đề: dò bảng 9 tới 45, rồi 65 − 45 = 20, rồi 20 : 5 = 4.
- Sửa: hỏi "Tiền bút là bao nhiêu nghìn đồng?" (45) hoặc "Mẹ mua mấy cái bút?" (5); số vở để hình lời giải `giai-vo-65`.

### 13. `hop-banh-tui`: đề "các túi 3 cái"; lời giải không dùng ý của card

- Vị trí: `ex.hop-banh-tui`, visual `giai-banh-48` (`card.tich-chia-het`) - LL-10, LL-15 (gộp nhóm 2 Góp ý 13, nhóm 3 Nên sửa 3)
- Nguồn: —
- Vấn đề: thiếu "mỗi", dễ đọc thành "3 cái túi"; lời giải đi đường 48 : 3 (phép chia trẻ yếu), không dùng "thừa số 6 chia hết cho 3".
- Sửa: "...rồi xếp hết vào các túi, mỗi túi 3 cái." Lời giải: "6 chia hết cho 3: mỗi hộp xếp được 6 : 3 = 2 túi" → "2 · 8 = 16 túi" (`check.expr` "(6:3)·8").

### 14. Hình lời giải `giai-ab-12d` bỏ bước d = 6

- Vị trí: visual `dau-hieu-chia-het.visual.giai-ab-12d` (`solutionVisualId` của `nhan-9-ab`) - LL-15
- Nguồn: —
- Vấn đề: từ "3 + d = 9" nhảy thẳng tới "ab = 126 : 9 = 14"; hình mẫu `tim-ab-11d` có đủ hàng "d = ..." và "11d = ...".
- Sửa: thêm hàng "d = 6" và "12d = 126" như `tim-ab-11d`.

### 15. Hình ví dụ không ghi đề trên màn (`tim-24a`, `tom-tat-tim-26c`)

- Vị trí: `$.sections[10].blocks[1]` visual `tim-24a`; recap `tom-tat-tim-26c` - LL-10
- Nguồn: —
- Vấn đề: đề "24a chia hết cho cả 3 và 5" chỉ ở `label` (đọc màn hình); trẻ thấy "24a ⋮ 5" rồi bỗng thử chia hết cho 3 (ảnh `123-s11-02-block.png`). Recap không ghi "chia hết cho 9".
- Sửa: thêm hàng đầu hay caption: "Tìm chữ số a để 24a chia hết cho cả 3 và 5", "Tìm chữ số c để 26c chia hết cho 9" (sửa cùng Nghiêm trọng 2, 3).

### 16. Section `diem-thi` hỏi chiều "có thể đạt được", sách chỉ dạy chiều "chắc chắn sai"

- Vị trí: section `diem-thi` `blocks[2]` (`chon-diem-24`, note "Chạm vào các số điểm có thể đạt được. Điểm cả bài phải chia hết cho 3."); `ex.diem-nhieu-9`, `ex.diem-mai-75` - LL-09, LL-10
- Nguồn: tr.33–34 ví dụ 2
- Vấn đề: sách chỉ kết luận "không chia hết cho 3 thì chắc chắn tính sai". Ba chỗ trên bắt kết luận ngược "chia hết cho 3 thì đạt được", note đặt điều kiện cần cạnh lời "có thể đạt được" thành điều kiện đủ (sai khi bài có số câu cố định). Đáp án hiện tại vẫn đúng.
- Sửa: hỏi theo chiều sách: "Chạm vào các số điểm chắc chắn tính sai" / "Chọn tất cả số điểm chắc chắn tính sai" / "Mai báo điểm cả bài nào thì chắc chắn tính sai?" như `diem-khong-dat`, `hoc-tinh-sai-52`.

### 17. `dien-diem-3`: "Điểm mỗi câu là 6 hoặc 3"

- Vị trí: `ex.dien-diem-3` `segments[0]` (`card.diem-thi`, kho ôn) - LL-10
- Nguồn: —
- Vấn đề: mất nghĩa "bị trừ"; câu đứng một mình trong phiên ôn không có bối cảnh.
- Sửa: "Bài trắc nghiệm có mỗi câu đúng được 6 điểm, mỗi câu sai bị trừ 3 điểm, nên điểm cả bài luôn ___ cho 3."

### 18. Nhiễu tự mâu thuẫn, loại được bằng mẹo

- Vị trí: `ex.hoc-tinh-sai-52` lựa chọn c ("Sai, vì 52 chia hết cho 3"); `ex.tong-10-5-2` lựa chọn b ("Không, vì tổng các chữ số là 3") - LL-14, LL-10 (gộp nhóm 2 Góp ý 10 lên Nên sửa)
- Nguồn: —
- Vấn đề: lý do và kết luận ngược nhau nên trẻ loại được không cần tính; nhiễu không phản ánh lỗi thật. `tong-10-5-2` còn không nói tổng các chữ số của số nào.
- Sửa: `hoc-tinh-sai-52` c thành "Đúng, vì 5 + 2 = 7" hay "Đúng, vì 52 chia hết cho 3". `tong-10-5-2`: đáp án "Có, vì 100 002 có tổng các chữ số là 3", nhiễu b "Không, vì 1 + 0 + 5 + 2 = 8" (lỗi cộng chữ số nhìn thấy).

### 19. Đề bút vở "mua bút giá 7 nghìn đồng" đọc được thành một cái bút

- Vị trí: `ex.tien-but-40`, `ex.mua-but-45`, `ex.mua-vo-65` (`prompt[0].text`) - LL-10
- Nguồn: —
- Vấn đề: có thể hiểu là mua một bút một vở (tổng 12).
- Sửa: "Mẹ mua một số cái bút, mỗi cái 7 nghìn đồng, và một số quyển vở, mỗi quyển 5 nghìn đồng, hết 40 nghìn đồng." Sửa luôn note mở đầu section `but-vo` cho đồng bộ.

### 20. Màn `chon-tien-but` không nói vì sao chỉ xét từ 1 đến 7 cái bút

- Vị trí: section `but-vo` `blocks[2]` note - LL-16
- Nguồn: tr.105 lời giải 2.20, `sbt-p105.png`
- Vấn đề: bước giới hạn số bút là một phần cách giải của sách, màn chỉ đưa số 7; trẻ không biết dừng ở đâu khi làm `mua-but-45`, `mua-vo-65`.
- Sửa: "Mua 8 cái đã hết 56 nghìn, nhiều hơn 55 nghìn, nên chỉ xét từ 1 đến 7 cái."

### 21. Section `lap-so` không có ví dụ chữ số 0, trong khi bài tập dùng 0

- Vị trí: section `lap-so`; `ex.lap-so-045`, `ex.chon-lap-2-5` - LL-16, LL-09
- Nguồn: tr.34 câu 2.18, tr.105 lời giải
- Vấn đề: câu 2.18 xoay quanh chữ số 0 (tận cùng 0 hay 5, không đứng đầu); section chỉ có ví dụ 2, 3, 5; luật "0 không đứng đầu" chỉ nằm trong đề `lap-so-045`.
- Sửa: thêm ví dụ 0, 3, 5 chia hết cho 5 (350, 530, 305; 035 bị loại) vào section hay hình `lap-2-chia-het-5`, hoặc hạ `lap-so-045` thành câu có gợi ý từng trường hợp.

### 22. `xep-lap-235` lặp đúng ví dụ màn quy tắc

- Vị trí: `ex.xep-lap-235` (`card.lap-so`, kho ôn) - LL-07
- Nguồn: —
- Vấn đề: cùng bộ 2, 3, 5, cùng chia hết cho 5, cùng kết quả 235 và 325 với `lap-235`, `lap-2-chia-het-5`.
- Sửa: đổi bộ chữ số, vd 3, 7, 5 (375, 735); tránh 1, 4, 5 đã dùng ở `cuoi-5` và `tom-tat-lap`.

### 23. `card.but-vo` gắn khái niệm "Tổng các chữ số"

- Vị trí: `$.cards[?(@.id=="dau-hieu-chia-het.card.but-vo")].conceptIds`
- Nguồn: —
- Vấn đề: section dùng dấu hiệu chia hết cho 5 (chữ số tận cùng), không dùng tổng các chữ số; phiên ôn theo khái niệm xếp nhầm nhóm.
- Sửa: đổi thành `dau-hieu-chia-het.concept.tan-cung`.

## Góp ý

### 1. `xep-tong-3524` xếp được mà không cần tính

- Vị trí: `ex.xep-tong-3524` - LL-14
- Nguồn: —
- Vấn đề: ba bước "Viết các chữ số", "Cộng lần lượt", "Được tổng là 14" có thứ tự hiển nhiên theo chữ.
- Sửa: xếp các dòng cộng dồn (3 + 5 = 8; 8 + 2 = 10; 10 + 4 = 14), hoặc đổi sang `numeric`.

### 2. Hình `hop-27-9` chưa nối với tổng các chữ số

- Vị trí: `$.sections[4].blocks[0]` (`hop-27-9`)
- Nguồn: —
- Vấn đề: ví dụ đời sống chỉ cho 27 = 9 · 3, không dẫn vào quy tắc tổng chữ số.
- Sửa: thêm bước cuối "2 + 7 = 9" màu amber.

### 3. Section `chia-het-2-5` đặt quy tắc trước ví dụ

- Vị trí: `$.sections[2].blocks`
- Nguồn: —
- Vấn đề: các section khác đi từ ví dụ đời sống tới quy tắc; section này ngược lại.
- Sửa: đưa `lop-30-ban` lên trước màn quy tắc.

### 4. `tien-45` luyện phép chia, không luyện dấu hiệu

- Vị trí: `ex.tien-45` (`card.chia-het-5`)
- Nguồn: —
- Vấn đề: hỏi số tờ (45 : 5); dấu hiệu không giúp gì.
- Sửa: hỏi "45 nghìn đồng đổi hết ra tờ 5 nghìn đồng được không?" kèm lý do chữ số tận cùng, hoặc chuyển sang độ khó 3.

### 5. Section `tong-chu-so` không có ví dụ đời sống trên màn

- Vị trí: section `tong-chu-so` - LL-16
- Nguồn: —
- Vấn đề: ba màn và hai câu đầu đều là số trần; tình huống duy nhất (`tong-7316`) nằm ở kho ôn.
- Sửa: đổi `cong-6384` thành số nhà hay biển số xe, hoặc cho `tong-5082` một tình huống.

### 6. Số và cấu trúc lặp giữa câu ôn, câu kiểm tra và ví dụ

- Vị trí: `tong-12-chia-het-3` (4 215) cùng bộ chữ số với ví dụ 2 415; `dien-10-7` trùng lựa chọn d của `chon-10-9`; 2 350 ở cả `chon-2-9` và `chon-nhieu-3-5`; `chon-10-9` đáp án 10³ + 8 cùng kiểu `tong-10-4-8`; `hop-banh-tui` lặp câu chuyện `hop-6-7` - LL-07
- Nguồn: —
- Vấn đề: trẻ nhận ra số đã gặp thay vì áp dụng quy tắc.
- Sửa: đổi một số trong mỗi cặp (vd `dien-10-7` thành 10³ + 5, `chon-10-9` đáp án 10⁵ + 8, câu kiểm tra `chia-het-3` dùng số có tổng 15).

### 7. Recap `chia-het-3` dùng số cũng chia hết cho 9

- Vị trí: `$.sections[5].recap.visualId` (`tom-tat-3204-3`)
- Nguồn: —
- Vấn đề: section nhấn "dấu hiệu 3 khác dấu hiệu 9" nhưng 3 204 (tổng 9) chia hết cho cả 9.
- Sửa: dùng số có tổng 12 hay 15 (như 3 207).

### 8. Câu quy tắc `cho-hai-so` và hình mẫu `xet-2136`

- Vị trí: `$.sections[6].blocks[1].children[0]` (note `rule`), recap; `xet-2136` - LL-19
- Nguồn: —
- Vấn đề: "đúng với dấu hiệu" là cách nói chưa định nghĩa; hình mẫu dừng ở "2 136 ⋮ 3", kết luận chỉ ở caption xám.
- Sửa: "Muốn biết một số có chia hết cho cả hai số không, ta xét từng dấu hiệu. Số đó chỉ chia hết cho cả hai khi xét dấu hiệu nào cũng thấy chia hết." Thêm hàng cuối vào `xet-2136`: "2 136 chia hết cho cả 2 và 3".

### 9. Ví dụ đời sống của `cho-hai-so`, `tong-hieu` chỉ nằm trong kho ôn

- Vị trí: `ex.chia-3-5-45`, `ex.gop-tien-25-32` - LL-16
- Nguồn: —
- Vấn đề: lúc học section trẻ không gặp câu đời sống.
- Sửa: đưa vào `practiceIds`, hoặc thêm caption đời sống cho `tong-40-15`.

### 10. Recap `tom-tat-diem` dùng 9 và 3, trùng luật điểm của hai câu ôn

- Vị trí: recap `tom-tat-diem`; `ex.diem-nhieu-9`, `ex.diem-mai-75` - LL-07
- Nguồn: —
- Vấn đề: trùng cặp 9 điểm, trừ 3 điểm (số điểm hỏi thì khác).
- Sửa: recap dùng cặp khác (12 và 3), hoặc một câu ôn đổi sang 12 điểm, trừ 6 điểm.

### 11. Thẻ chữ "11d", "ab" không có gạch trên

- Vị trí: visual `tim-ab-11d`, `giai-ab-12d`, `giai-4d6`
- Nguồn: —
- Vấn đề: "ab" trong thẻ chữ có thể đọc thành a · b.
- Sửa: viết "số 11d", "số ab".

### 12. `dem-so-124` gọi là "mã số"

- Vị trí: `ex.dem-so-124` `prompt[0]`
- Nguồn: —
- Vấn đề: "mã số chia hết cho 2" hơi lạ.
- Sửa: "lập số ba chữ số chia hết cho 2".

### 13. `lap-so-045`: câu đề gượng

- Vị trí: `ex.lap-so-045` `prompt[0]`
- Nguồn: —
- Vấn đề: ghép hai ý vào một câu.
- Sửa: "Nhớ: chữ số 0 không đứng đầu. Lập được bao nhiêu số?"

### 14. Màn mở đầu `but-vo` không loại trường hợp 0 cái bút

- Vị trí: section `but-vo` `blocks[0]` note
- Nguồn: —
- Vấn đề: 0 bút và 11 vở cũng hết 55 nghìn; bài tập cùng section ghi "mỗi loại ít nhất một cái".
- Sửa: thêm "mỗi loại ít nhất một".

### 15. `diem-mai-75`: "Điểm nào Mai có thể đạt được?"

- Vị trí: `ex.diem-mai-75` `prompt[0]`
- Nguồn: —
- Vấn đề: Mai chưa được giới thiệu; "điểm nào" thiếu "cả bài". Viết lại cùng Nên sửa 16.
- Sửa: "Mai làm bài trắc nghiệm có mỗi câu đúng được 9 điểm... Mai báo điểm cả bài nào thì chắc chắn tính sai?"

### 16. Recap `luy-thua-10` chỉ nêu nửa cách làm

- Vị trí: `$.sections[9].recap`, `card.luy-thua-10` recap (Tổng hợp phát hiện)
- Nguồn: —
- Vấn đề: section dạy "luỹ thừa của 10 cộng thêm một số" nhưng câu quy tắc và recap chỉ nói tổng các chữ số của luỹ thừa của 10 bằng 1, không nói bước dùng: cộng với tổng các chữ số của số thêm vào rồi xét chia hết cho 3, 9.
- Sửa: thêm câu thứ hai, vd "Nên tổng các chữ số của 10ⁿ + 8 là 1 + 8 = 9." (không chép số của câu luyện).
