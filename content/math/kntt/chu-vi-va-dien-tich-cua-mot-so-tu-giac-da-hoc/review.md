# Review: Chu vi và diện tích của một số tứ giác đã học (`chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc`)

- Bài: `content/math/kntt/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp (nhóm 1: tổng quan và phần 1–5; nhóm 2: phần 6–10; nhóm 3: phần bài tập sách bài tập; tệp nhóm ở `.shots/review/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/nhom-<n>.md`)
- Nguồn đã đọc: `sources/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/` - sbt-p70, sbt-p71, sbt-p72, sbt-p73 (kiến thức, ví dụ, đề), sbt-p115, sbt-p116 (lời giải)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): 210 / 8 / 0; tệp `.shots/review/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/doc-hieu.md`. Người soạn đã chạy lượt 2 (94 / 10 / 1, `doc-hieu-2.md`) và lượt 3 (2 / 0 / 0, `doc-hieu-3.md`) trước vòng này.
- `lesson:walk`: 0 FAIL, 0 cảnh báo (iPad dọc, điện thoại, iPad ngang; worktree tạm trên commit e137dff), ảnh trong `walk-r1/` của thư mục tạm của phiên review (không commit)
- Kết luận: Chưa đạt: còn 5 lỗi Nghiêm trọng. Đã chạy `content:hash --mark`, bài giữ `draft`; không `--approve`, không `content:lock` ở vòng này.
- Bản đã review: `7d0c71674d5396443e984c4c383e6257bf7cb3c84496bd08e5b1b6bfb6ee8c18` (`pnpm content:diff` so với bản này)

Điểm ngoài trang sách (mục "Giả định" của bàn giao), xét theo tiêu chí của LL-09 (giữ khi cần cho một bài tập trên các trang đã nạp và lần được về một dòng in, không thêm điều mới phải nhớ): giữ cả sáu điều. Ý nghĩa chu vi, diện tích, cm², m² là kiến thức nền có `prerequisite`; chu vi hình thang cân suy từ `C = a + b + c + d` tr.70; đổi 1 m = 100 cm, 1 m² = 10 000 cm² cần cho 4.23, 4.27 và ví dụ 1 tr.71; hình khuyết một góc có ở lời giải 4.24 tr.116; cắt trượt hình bình hành, xoay tam giác ngoài hình thoi, ghép hai hình thang cân đều chỉ minh hoạ công thức tr.70; "hai cạnh kề nhau" là tên cho hai cạnh a, b của hình tr.70. Công thức viết "chia cho 2" thay ½ đúng toán và nhất quán ở mọi câu quy tắc, recap, thẻ, mẹo và lời giải (xem Góp ý 8 về việc nối với cách sách viết).

Đã soát nhất quán giữa các phần (Tổng hợp): câu quy tắc, recap của phần và thẻ khớp nguyên văn ở cả 10 phần; bốn khối "Nhắc lại" của phần bài tập sách bài tập lặp đúng câu quy tắc của phần 3, 5, 8, 10. Chỗ lệch tìm thêm được gộp vào Nên sửa 14 ("bao quanh" và "hình chữ nhật lớn" trong câu "Nhắc lại" hình khuyết), 21 (khối "Nhắc lại" dặn đổi ra cm, mẹo phần 9 nói cùng một đơn vị, bài 4.28 dùng m), 28 (10 000 cm² mang hai màu) và 30 (khối "Nhắc lại" có quy tắc chưa phần nào dạy).

## Nghiêm trọng

### 1. Hình gợi ý nấc 2 của bài 4.24 hiện đúng chu vi của đề

- Vị trí: `catalog-book.ts` `PAIRS["4-24"].hint[0]` (`visual.goi-y-4-24`), dùng ở `$.exercises[67].hints.hintVisualId` (`ex.sbt-4-24`) - LL-02
- Nguồn: tr.116, `sbt-p116.png` (chu vi 28 m)
- Vấn đề: hàng đầu của hình gợi ý hiện `C = 2 · (9 + 5) = 28 m`, không bị che (chế độ gợi ý chỉ che hàng cuối). Số khác đề nhưng kết quả trùng đúng ô chu vi của 4.24, nên bé chép 28 là đúng. Hàng hai còn dùng đúng phần khuyết `2 · 2` mà bé phải tự suy ra từ hình.
- Sửa: đổi số của ví dụ gợi ý để chu vi khác 28 và phần khuyết khác 2 m và 2 m, ví dụ hình 10 m và 5 m khuyết 3 m và 1 m: `C = 2 · (10 + 5) = 30 m`, `S = 10 · 5 - 3 · 1`, hàng cuối "?". Soát lại mọi hàng hiện ra của 12 hình gợi ý: không hàng nào bằng đáp án hay số trung gian của đề.

### 2. Câu sắp xếp các bước lát gạch có hai thứ tự đúng

- Vị trí: `$.exercises[51]` (`ex.xep-buoc-lat-gach`), mục `s2`, `s3` - LL-01
- Nguồn: —
- Vấn đề: "chia chiều dài sàn cho cạnh viên gạch để biết số viên mỗi hàng" và "chia chiều rộng sàn cho cạnh viên gạch để biết số hàng" không phụ thuộc nhau, đổi chỗ vẫn đúng. Câu `order` chỉ chấm một thứ tự nên bé làm đúng mà bị chấm sai; `explain` cũng không nói bước nào trước.
- Sửa: gộp hai bước thành một mục ("Chia chiều dài và chiều rộng sàn cho cạnh viên gạch: được số viên mỗi hàng và số hàng"), hoặc thay bằng các bước buộc phải nối tiếp nhau (đổi đơn vị, chia, nhân số viên mỗi hàng với số hàng, chia cho số viên một thùng). Tự thử mọi hoán vị trước khi gửi review.

### 3. Dòng công thức của ba hình quy tắc bị cắt chân chữ; nhãn "a" của hình thoi dính cạnh

- Vị trí: hình `visual.bbh-quy-tac`, `visual.thoi-quy-tac`, `visual.thang-quy-tac` (`$.sections[5].blocks[1]`, `$.sections[6].blocks[1]`, `$.sections[7].blocks[1]`, recap phần 6–8 và thẻ `card.dien-tich-binh-hanh`, `card.dien-tich-thoi`, `card.dien-tich-thang-can`) - LL-12
- Nguồn: tr.70, `sbt-p70.png`
- Vấn đề: dòng `S = a · h`, `S = a · b : 2`, `S = (a + b) · h : 2` đặt sát đáy khung nên mất nửa dưới chữ ở cả điện thoại lẫn iPad (`phone/079-s6-02-block.png`, `ipad/079-s6-02-block.png`, `phone/093-s7-02-block.png`, `phone/106-s8-02-block.png`); ở màn recap (`089`, `102`, `116`) dòng này hiện đủ nhưng dưới 16px. Đây là công thức cần nhớ của ba phần. Ở `thoi-quy-tac` nhãn "a" nằm trên cạnh trên bên trái của hình thoi, nét cạnh cắt qua chữ. Walk không báo vì chữ nằm trong SVG.
- Sửa: tăng chiều cao khung của ba hình rồi hạ dòng công thức, hoặc đưa công thức ra khối `formula` đi kèm câu quy tắc; giữ cỡ chữ ≥ 16px cả ở màn recap. Dời nhãn "a" vào giữa nửa trái đường chéo ngang, phía dưới đường chéo. Chụp lại `visual:shot` và xem ảnh điện thoại của màn quy tắc và recap.

### 4. Hình 1 m² = 10 000 cm²: nhãn "1 m²" bị lưới cắt, lưới 100 ô không ghi cỡ ô

- Vị trí: hình `visual.m2-cm2` (`$.sections[8].blocks[1]`, recap phần 9, `card.doi-don-vi`) - LL-15 (kèm LL-12)
- Nguồn: tr.71 (ví dụ 1), `sbt-p71.png`
- Vấn đề: chữ "1 m²" đặt giữa lưới nên nét lưới cắt qua chữ (`phone/119-s9-02-block.png`, `phone/129-s9-08-recap.png`). Lưới có 10 × 10 = 100 ô mà không ô nào ghi "10 cm" hay "100 cm²", còn dòng dưới viết `100 · 100 = 10 000 cm²`. Phần 4 vừa dạy diện tích là số ô vuông đơn vị phủ kín hình, nên bé đếm được 100 ô và nhớ 1 m² = 100 cm², đúng nhiễu của `ex.mot-met-vuong`. Đây là hình của câu quy tắc và recap.
- Sửa: đưa "1 m²" ra ngoài lưới, nền trắng; tô đậm một ô góc và ghi "1 ô: cạnh 10 cm, có 100 cm²", thêm dòng "100 ô · 100 cm² = 10 000 cm²" (hoặc giữ `100 · 100` kèm nhãn "100 cm" ở cả hai cạnh). Chụp lại ảnh điện thoại.

### 5. Nhãn đỉnh "E" bị cạnh ED cắt ngang trong hình của câu dẫn 4.24

- Vị trí: `catalog-book.ts` hình `dan-khuyet-10-6` (hàm `notched`, `names: true`), dùng ở `$.exercises[65].prompt[1]`, `$.exercises[66].prompt[1]` (`ex.dan-4-24-cv`, `ex.dan-4-24-dt`) - LL-12
- Nguồn: —
- Vấn đề: ở ảnh walk `185-s11-18-exercise-dan-4-24-cv`, `187-…-dan-4-24-dt` (iPad và điện thoại) chữ E nằm đúng trên đường ED, đọc thành "–E–". Hình 4.20 dùng cùng hàm thì đặt đúng, nên lỗi ở cách đặt tên đỉnh lõm khi phần khuyết là hình vuông. Cùng kiểu đã gặp ở Bài 18, 19.
- Sửa: đặt nhãn đỉnh lõm theo phân giác, ra phía ngoài hình, cách hai cạnh một khoảng cố định; chụp lại `dan-khuyet-10-6`, `sbt-hinh-4-20`, `khuyet-nhac-lai` và hình lời giải 4.24. Câu dẫn không cần tên đỉnh thì bỏ `names`.

## Nên sửa

### 1. Phần 5 không nối chiều dài, chiều rộng với số ô mỗi hàng và số hàng

- Vị trí: `$.sections[4].blocks[0].children[0].text`, hình `hang-cot-gach`, `$.sections[4].blocks[2].children[0].text`, hình `floor-lesson` (`dien-tich-chu-nhat-vuong`) - LL-16
- Nguồn: tr.70 (`S = ab`)
- Vấn đề: màn đầu chỉ nói "mỗi hàng 6 ô, có 4 hàng", không nói sàn dài 6 m, rộng 4 m; màn "Cùng làm" không cho số đo sàn (5 m, 3 m chỉ có trong `label`). Rồi câu quy tắc nói "chiều dài nhân với chiều rộng": bé chậm không thấy vì sao chiều dài thành số ô một hàng.
- Sửa: màn đầu viết "Sàn dài 6 m, rộng 4 m, chia thành ô vuông cạnh 1 m: dài 6 m nên mỗi hàng 6 ô, rộng 4 m nên có 4 hàng…"; caption bước cuối `hang-cot-gach` nhắc số đo; màn "Cùng làm" nêu "Sàn dài 5 m, rộng 3 m" trong note hoặc trên hình.

### 2. Recap phần 5 thiếu quy tắc diện tích hình vuông

- Vị trí: `$.sections[4].recap.caption`, `$.cards[4].recap.caption`, `$.sections[4].blocks[1].children[1]` - LL-06
- Nguồn: tr.70 (`S = a²`)
- Vấn đề: tên phần có hình vuông, câu kiểm tra và kho ôn hỏi hình vuông (`gach-vuong-25`, `vuon-vuong-11`), nhưng câu hình vuông là note thường nên recap và thẻ chỉ còn hình chữ nhật. Phần 2 lại gộp hình vuông với hình thoi vào một câu quy tắc.
- Sửa: một câu quy tắc gộp ("Diện tích hình chữ nhật bằng chiều dài nhân với chiều rộng, diện tích hình vuông bằng cạnh nhân với cạnh.", `rule: true`), recap, thẻ và khối "Nhắc lại" lặp nguyên văn.

### 3. "Ô vuông đơn vị" chỉ gán cho ô 1 cm mà câu quy tắc và câu kiểm tra dùng cả ô 1 m

- Vị trí: `$.sections[3].blocks[0].children[0].text`, `$.sections[3].blocks[1].children[0].text` (`dien-tich-la-gi`), `ex.dien-tich-9-o-1m`; `content/glossary/math.json` - LL-10
- Nguồn: Kiến thức nền (tiểu học); tr.71 (cm², m²)
- Vấn đề: "Ô vuông cạnh 1 cm là ô vuông đơn vị", còn ô 1 m chỉ "có diện tích 1 mét vuông"; đọc đúng chữ câu quy tắc thì 9 ô cạnh 1 m không phải ô vuông đơn vị. Từ nền này nằm trong câu quy tắc nhưng glossary không có mục kèm `prerequisite`.
- Sửa: "Ô vuông cạnh 1 cm và ô vuông cạnh 1 m đều là ô vuông đơn vị: ô 1 cm có diện tích 1 cm², ô 1 m có diện tích 1 m²." (tách hai câu nếu dài); thêm "ô vuông đơn vị" vào glossary với `"prerequisite": "tiểu học"`.

### 4. Chữ "rộng" dùng để nói diện tích, trùng với "chiều rộng"

- Vị trí: `$.overview.hook.text` ("đo xem hình rộng bao nhiêu"), `$.exercises[25].explain.text` (`ex.xep-gach-4-3`: "sàn rộng 12 m²") - LL-10
- Nguồn: —
- Vấn đề: cả bài dùng "rộng" cho chiều rộng; `xep-gach-4-3` nói "rộng 3 m nên có 3 hàng" rồi "sàn rộng 12 m²", bé dễ đọc chiều rộng là 12.
- Sửa: hook "tính diện tích của hình"; `explain` "Số ô là 4 · 3 = 12, nên diện tích sàn là 12 m²."

### 5. Câu luyện phần 4 không cần làm gì

- Vị trí: `$.exercises[17]` (`ex.mieng-dan-15-o`), `$.sections[3].practiceIds[0]` - LL-16
- Nguồn: —
- Vấn đề: đề cho sẵn "15 ô vuông, mỗi ô 1 cm²", đáp án là số in trong đề, không có hình để đếm; câu luyện duy nhất của phần dễ hơn câu kiểm tra `dem-o-vuong-7`.
- Sửa: cho hình để đếm (hình chữ L hay bậc thang khác số với `tiles-bac-thang`, `f-do-7-o`), hoặc đưa `cham-hinh-4-o` lên làm câu luyện và chuyển câu này xuống kho ôn sau khi thêm hình.

### 6. Câu luyện phần 3 dùng đúng sân 30 m và 20 m của bài 4.28

- Vị trí: `$.exercises[12]` (`ex.san-truong-chu-vi`) - LL-07
- Nguồn: tr.73 bài 4.28, `sbt-p73.png`
- Vấn đề: sân "dài 30 m, rộng 20 m" trùng sân "20 m × 30 m" của 4.28 ở phần cuối; bàn giao cam kết số các tầng tách khỏi số sách.
- Sửa: đổi số, ví dụ 40 m và 25 m (chu vi 130 m), không trùng số nào của tr.72–73.

### 7. Câu kiểm tra hình vuông cạnh 25 cm cần nhân hai số có hai chữ số

- Vị trí: `$.exercises[21]` (`ex.gach-vuong-25`, `difficulty: 1`) - LL-18
- Nguồn: —
- Vấn đề: 25 · 25 = 625 khó nhẩm với bé yếu nhân (`docs/learner.md`); đây là câu kiểm tra đầu tiên của công thức hình vuông nên bé sai vì tính chứ không vì quy tắc.
- Sửa: cạnh 20 cm (400 cm²) hay 30 cm (900 cm²), giữ nhiễu chu vi và nhiễu "cạnh + cạnh".

### 8. Hai nhiễu không ứng với lỗi thật

- Vị trí: `$.exercises[21].options` lựa chọn `d` "125" (`ex.gach-vuong-25`), `$.exercises[24].options` lựa chọn `d` "33" (`ex.vuon-vuong-11`) - LL-14
- Nguồn: —
- Vấn đề: "125 là 5 · 25", "33 là 3 · 11" không ứng với cách nghĩ sai nào (đề không có số 5 hay 3), bé loại ngay; `wrong` chỉ nêu phép tính.
- Sửa: thay bằng nhiễu ứng lỗi thật ("cạnh · 2" nếu chưa có, cộng thay nhân), `wrong` nêu đúng lỗi đó.

### 9. Nhiễu 28 của câu diện tích hình thoi không ứng với lỗi nào

- Vị trí: `$.exercises[32].options[3]` (`ex.dt-thoi-14-6`) - LL-14
- Nguồn: —
- Vấn đề: 28 không ra từ cách tính sai nào với 14 và 6, và không có `wrong`.
- Sửa: đổi thành 10 ((14 + 6) : 2) hay 40 (2 · (14 + 6)), thêm `wrong`.

### 10. Đáp số câu luyện đổi đơn vị trùng số của câu quy tắc

- Vị trí: `$.exercises[43]` (`ex.bia-2m-50cm`) - LL-07
- Nguồn: —
- Vấn đề: 200 · 50 = 10 000 cm², đúng số "10 000 cm²" của câu quy tắc, recap và hình `m2-cm2`; bé gõ số vừa nhớ là đúng mà không cần đổi 2 m ra cm.
- Sửa: đổi số, ví dụ 3 m và 40 cm (12 000 cm²) hay 2 m và 30 cm (6 000 cm²); sửa `check.expr` và `explain` theo.

### 11. "Sơn tường trừ cửa sổ" chưa có mẫu trong phần

- Vị trí: `$.exercises[48]` (`ex.son-tuong-cua-so`, câu luyện của `section.bai-toan-doi-song`) - LL-16
- Nguồn: tr.71 (kĩ năng giải toán)
- Vấn đề: phần có mẫu rào vườn và lát sàn, còn bước "diện tích tường trừ diện tích cửa sổ" (trừ diện tích, khác mẹo trừ chiều rộng cửa của chu vi) xuất hiện lần đầu ở câu luyện.
- Sửa: thêm một màn mẫu sơn tường với số khác câu luyện (tường 6 m và 3 m, cửa sổ 2 m và 2 m: 18 − 4 = 14 m²), hoặc một câu trong note "Phần không sơn thì trừ đi diện tích của nó".

### 12. Số đo có phần nguyên như 1,5 m chưa được dạy

- Vị trí: `$.sections[8].blocks[0]`, hình `visual.doi-thanh`; `$.exercises[44]` (`ex.doi-1-5-m`) - LL-16
- Nguồn: tr.73 (bài 4.27 dùng 0,6 m)
- Vấn đề: phần 9 chỉ dạy 0,1 m = 10 cm và cho đổi 0,3 m, 0,6 m, 1 m; `explain` của `doi-1-5-m` dùng "nửa mét có 50 cm" mà phần không nói.
- Sửa: một thanh của `doi-thanh` có phần nguyên khác số câu ôn và sách (1,2 m = 100 cm + 20 cm = 120 cm), thêm câu "1,2 m là 1 m và 0,2 m, tức là 100 cm và 20 cm"; `explain` của `doi-1-5-m` theo cùng cách.

### 13. Mẹo và màn "Cùng làm" dùng đúng số 0,6 m của bài 4.27

- Vị trí: `$.sections[8].blocks[2].tex` (`tip.cung-don-vi`), hình `visual.doi-thanh` (thanh `b`) - LL-07
- Nguồn: tr.73, `sbt-p73.png`
- Vấn đề: "0,6 m = 60 cm" là bước đổi đầu tiên của 4.27; màn dạy cho sẵn bước đó.
- Sửa: đổi thành 0,7 m = 70 cm ở mẹo và thanh (cả nhãn và `label`).

### 14. Một hình chữ nhật mang ba tên: "bao quanh", "đi qua bốn đỉnh", "hình chữ nhật lớn"

- Vị trí: `stages.ts` `rhombusFrames()` khung 2 ("Vẽ hình chữ nhật bao quanh…"); `wrong` của `ex.dt-thoi-14-6` (`b`), `ex.chon-phep-tinh-thoi-12-5` (`c`), `ex.dt-thoi-16-9` (`b`); câu "Nhắc lại" `$.sections[10].blocks[1].children[2]` ("chu vi hình chữ nhật bao quanh nó … bằng hình chữ nhật lớn trừ đi phần khuyết") - LL-05, LL-25
- Nguồn: —
- Vấn đề: lượt đọc hiểu 2 chấm "bao quanh" là khó hiểu nên note phần 7 đã đổi thành "hình chữ nhật đi qua bốn đỉnh", nhưng caption khung 2, ba lý do `wrong` và câu "Nhắc lại" của hình khuyết vẫn nói "bao quanh". Câu "Nhắc lại" còn gọi cùng một hình là "hình chữ nhật bao quanh" ở vế đầu và "hình chữ nhật lớn" ở vế sau. (Tổng hợp tìm thêm chỗ ở khối "Nhắc lại".)
- Sửa: hình thoi dùng một tên "hình chữ nhật đi qua bốn đỉnh" ở caption và ba câu `wrong`; hình khuyết dùng một tên, ví dụ "hình chữ nhật trước khi bị cắt góc", ở cả hai vế câu "Nhắc lại", ở `explain` câu dẫn 4.24 và ở hình `khuyet-nhac-lai`.

### 15. Caption cuối của hình cắt ghép nói quy tắc hình bình hành bằng chữ khác

- Vị trí: `stages.ts` `parallelogramFrames()` khung 5 (hình `visual.bbh-cat-ghep`) - LL-05
- Nguồn: —
- Vấn đề: caption "bằng đáy nhân chiều cao" khác câu quy tắc "bằng cạnh đáy nhân với chiều cao".
- Sửa: "Diện tích hình bình hành bằng cạnh đáy nhân với chiều cao: 6 · 3 = 18 cm²."

### 16. "Lật một hình" thang cân đọc được thành lật trái phải

- Vị trí: `$.sections[7].blocks[0].children[0].text`; caption khung 2 `trapezoidFrames()`, caption bước 2 `trapezoidJoin()` - LL-10
- Nguồn: tr.70
- Vấn đề: hình xoay bản sao nửa vòng; "lật" với bé là lật trái sang phải, mà lật hình thang cân trái phải vẫn ra hình cũ, ghép không thành hình bình hành.
- Sửa: "xoay ngược một hình cho đáy lớn lên trên, rồi đặt sát cạnh bên hình kia" ở note và hai caption.

### 17. Hình hình thang cân nói "chiều cao 3 cm" mà không vẽ chiều cao

- Vị trí: hình `visual.thang-ghep` (khung 1), `visual.stage-thang` (bước 3) - LL-15
- Nguồn: —
- Vấn đề: không khung nào vẽ đoạn chiều cao hay ghi "3 cm" (`phone/104`, `105`, `108`, `109`), trong khi chữ và phép 12 · 3 cần nó, ngay sau mẹo "đừng lấy cạnh bên làm chiều cao".
- Sửa: vẽ đoạn chiều cao nét đứt tím, dấu góc vuông, nhãn "3 cm" từ khung 1 tới khung hình bình hành.

### 18. Chỗ cửa trong hình rào vườn gần như không thấy

- Vị trí: hình `visual.rao-vuon-giai` (`gardenWithGate()`, `catalog-don-vi.ts`), `$.sections[9].blocks[0]` - LL-15
- Nguồn: —
- Vấn đề: cửa là đoạn nét đứt xám đè lên cạnh xanh, trên điện thoại chỉ là vệt nhỏ (`phone/132-s10-01-block-end.png`); hàng rào trông như chạy kín.
- Sửa: để trống hẳn đoạn cửa, thêm hai cọc và mũi tên đo "3 m"; giữ nhãn "cửa 3 m".

### 19. Lời giải "Một mét vuông là hình vuông có cạnh 100 cm"

- Vị trí: `$.exercises[42].explain.text` (`ex.mot-met-vuong`), `label` của `visual.m2-cm2` - LL-05
- Nguồn: —
- Vấn đề: 1 m² là diện tích, không phải một hình; phần 4 đã nói đúng "Ô vuông cạnh 1 m có diện tích 1 mét vuông".
- Sửa: "Một mét vuông là diện tích hình vuông cạnh 1 m, tức cạnh 100 cm. Diện tích đó là 100 nhân 100."

### 20. Câu ôn lát gạch dùng lại sàn 5 m và 3 m của màn "Cùng làm" phần 5

- Vị trí: `$.exercises[50]` (`ex.lat-gach-5-3`) - LL-07
- Nguồn: —
- Vấn đề: sàn 5 m và 3 m là hình `floor-lesson` (15 ô); bé dễ chọn 15 vì quen.
- Sửa: sàn khác, ví dụ 4 m và 3 m, gạch 50 cm (8 · 6 = 48 viên); đổi nhiễu theo (12, 14).

### 21. Bài 4.28 không có bước đổi 60 cm ra m; khối "Nhắc lại" và mẹo phần 9 nói hai cách

- Vị trí: `$.exercises[77]` (`ex.dan-4-28-vien`), `$.exercises[79].explain` (`ex.sbt-4-28`), `PAIRS["4-28"]` (hình gợi ý, lời giải), câu "Nhắc lại" `$.sections[10].blocks[3].children[3]`, mẹo `$.sections[8].blocks[2]`, note `$.sections[9].blocks[1]` - LL-15, LL-05
- Nguồn: tr.73, `sbt-p73.png` (viên đá cạnh 60 cm); tr.116 (`0,6 · 0,6 · 1 400`)
- Vấn đề: đề cho cạnh viên đá bằng cm, giá cỏ theo m². Câu dẫn cho sẵn 0,5 m, hình gợi ý dùng 0,5 m, `explain` và lời giải viết thẳng 0,6, không chỗ nào nói 60 cm = 0,6 m. Câu "Nhắc lại" ngay trước dặn "đổi mọi số đo ra cm" (note phần 10 cũng "đổi mét ra cm"), trong khi mẹo phần 9 nói "đổi mọi số đo về cùng một đơn vị". Bé làm theo khối "Nhắc lại" thì ra số rất lớn rồi phải đổi ngược về m². Thêm vào đó, `dan-4-28-vien` (0,5 · 0,5 = 0,25) và 4.28 (0,6 · 0,6) cần nhân hai số thập phân, việc cả bài chưa làm mẫu lần nào (phần 9 chỉ đổi ra cm để khỏi tính với số thập phân). (Tổng hợp gộp ý mâu thuẫn giữa khối "Nhắc lại" và mẹo.)
- Sửa: câu dẫn `dan-4-28-vien` cho cạnh bằng cm (50 cm), hỏi diện tích bằng m² với bước "đổi 50 cm = 0,5 m" và nêu cách nhân 0,5 · 0,5 (hoặc tính 50 · 50 = 2 500 cm² rồi dùng 1 m² = 10 000 cm²); `explain` 4.28 thêm "Đổi 60 cm = 0,6 m"; hàng đầu hình gợi ý ghi bước đổi. Câu "Nhắc lại" nói như mẹo phần 9 ("đổi mọi số đo về cùng một đơn vị") rồi tách hai trường hợp: đếm gạch theo hàng (4.27) đổi ra cm, tính tiền theo m² (4.28) đổi cạnh ra m.

### 22. Câu "Nhắc lại" lát gạch thiếu bước nhân

- Vị trí: `$.sections[10].blocks[3].children[3]`, hình `lat-gach-nhac-lai`
- Nguồn: —
- Vấn đề: câu dừng ở hai phép chia; bé có số viên mỗi hàng và số hàng mà không biết làm gì tiếp; hình chỉ ghi "dài", "rộng".
- Sửa: "…chia chiều dài và chiều rộng của sân cho cạnh viên gạch, rồi nhân hai kết quả để có số viên." (gộp với cách viết mới ở Nên sửa 21); thêm vào hình một dòng `5 · 3 = 15 viên`.

### 23. Lời giải bài sách theo sát cách trình bày của sách và đảo thứ tự phép nhân của câu quy tắc

- Vị trí: `$.exercises[67].explain` (`ex.sbt-4-24`: "Kẻ thêm để được hình chữ nhật 6 m và 8 m", `6 · 8 - 2 · 2`); `PAIRS["4-23"].solution` (`50 · 4`, `60 + 80`), `PAIRS["4-24"].solution`, `PAIRS["4-26"].solution` (`2 · (40 + 90)`); `$.sections[1].blocks[2].children[0].text` ("nhân độ dài một cạnh với 4") - LL-08, LL-05
- Nguồn: tr.115–116, `sbt-p115.png`, `sbt-p116.png`
- Vấn đề: "Kẻ thêm để được hình chữ nhật…" gần như nguyên văn câu mở lời giải 4.24 của sách; các hình lời giải chép cả thứ tự số hạng của sách (`50 · 4`, `6 · 8`), trong khi câu quy tắc là "4 nhân với độ dài một cạnh" (`4 · 25` ở câu dẫn ngay trước) và "chiều dài nhân với chiều rộng". Màn "Cùng làm" phần 2 cũng nói "nhân độ dài một cạnh với 4". Bé thấy hai thứ tự cho cùng một công thức. (Gộp Góp ý 2 của nhóm 1 cùng kiểu.)
- Sửa: `explain` 4.24 bằng lời của bài ("Vẽ thêm hai đoạn bù vào chỗ khuyết thì được hình chữ nhật dài 8 m, rộng 6 m."); các hàng lời giải theo câu quy tắc: `4 · 50`, `80 + 60`, `8 · 6 - 2 · 2`, `2 · (8 + 6)`, `2 · (90 + 40)`; màn "Cùng làm" phần 2: "…nên ta chỉ cần lấy 4 nhân với độ dài một cạnh."

### 24. Bài 4.23 chỉ có hai lựa chọn, bé đoán lại là đúng

- Vị trí: `$.exercises[64]` (`ex.sbt-4-23`)
- Nguồn: tr.72 (sách không in lựa chọn)
- Vấn đề: sai "Đủ" lần đầu thì chỉ còn "Không đủ" (walk `181-…-wrong1`); bé có điểm mà không phải tính 620 cm.
- Sửa: giữ nguyên đề, đổi thành `fillBlank` hai ô như 4.20, 4.24 ("Cần ___ cm sắt. Vật liệu ___.": gõ 620, chọn "đủ"/"không đủ"), khối lệnh cuối đề đổi theo; hoặc giữ `choice` và thêm câu dẫn hỏi tổng độ dài sắt với số khác đề.

### 25. Câu dẫn 4.27 dồn gần cả bài vào một câu và đứng trước câu dễ hơn

- Vị trí: `$.exercises[74]` (`ex.dan-4-27-hang`, difficulty 3) trước `$.exercises[75]` (`ex.dan-4-27-thung`, difficulty 2); `ex.dan-4-25-thang` (2) trước `ex.dan-4-25-luc-giac` (1) - LL-18
- Nguồn: —
- Vấn đề: `dan-4-27-hang` gồm ba lần đổi, hai phép chia và một phép nhân, vượt mức 2 phép tính; câu dẫn khó trước dễ sau.
- Sửa: tách thành "Sân dài 12 m, gạch cạnh 50 cm. Mỗi hàng bao nhiêu viên?" và "Mỗi hàng 24 viên, có 12 hàng. Cần bao nhiêu viên, mua bao nhiêu thùng (4 viên một thùng)?"; đảo thứ tự hai câu dẫn 4.25.

### 26. Bài 4.25: không bước nào tập đếm số viên trên hình

- Vị trí: `$.exercises[69]` (`ex.dan-4-25-luc-giac`), `$.exercises[70].explain` (`ex.sbt-4-25`)
- Nguồn: tr.73, `sbt-p73.png`
- Vấn đề: đề sách không nói số viên, bé phải đếm 8 viên (2 nửa ở giữa khác màu 6 viên quanh). Câu dẫn cho sẵn "6 viên" bằng chữ, `explain` chỉ nói "nhân với 8"; bé dễ đếm 6 và ra 774.
- Sửa: câu dẫn kèm một hình ghép khác và hỏi số viên trước khi nhân; `explain` 4.25 thêm "Đếm trên hình: 2 viên ở giữa và 6 viên quanh, tất cả 8 viên."

### 27. Phần bài tập sách bài tập gần như chỉ có câu gõ số

- Vị trí: `$.sections[10].checkIds` (28 câu: 24 `numeric`; 15 trên 16 câu dẫn là `numeric`)
- Nguồn: —
- Vấn đề: 28 câu liền cùng một thao tác gõ số, dễ mỏi với bé khó tập trung lâu; câu dẫn là chỗ được chọn dạng câu.
- Sửa: đổi 3–4 câu dẫn sang dạng khác: `dan-4-24-cv` thành `choice` chọn biểu thức chu vi đúng; `dan-4-28-co` thành `order` các bước 4.28; câu đếm viên ở Nên sửa 26 dùng `choice`.

### 28. Màu "diện tích" (teal) và "chu vi" (blue) tô lên độ dài, số viên, số tiền; 10 000 cm² mang hai màu

- Vị trí: `explain.tex` của `ex.dan-4-21-so` (8 cm), `ex.sbt-4-21` (7 cm), `ex.dan-4-26-dai` (30 m), `ex.dan-4-27-hang` (288), `ex.dan-4-27-thung` (72), `ex.sbt-4-27` (75), `ex.sbt-4-28` (2 880 000), `ex.lat-gach-5-3` (60 viên); thẻ hàng trong `PAIRS` của `catalog-book.ts`: `sTag("chiều còn lại")`, `sTag("chiều dài vườn")`, `cTag("viên mỗi hàng")`, `cTag("số hàng")`, `cTag("hai đường chéo")` (đường chéo là amber); `ex.mot-met-vuong` tô 10 000 cm² màu sky (đơn vị đo) còn `ex.bia-2m-50cm` và hình `m2-cm2` tô cùng số đo đó màu teal - LL-05
- Nguồn: —
- Vấn đề: bài gắn teal với diện tích, blue với chu vi. Tô một độ dài hay số thùng gạch bằng màu diện tích làm bé hiểu sai kết quả đó là diện tích (7 cm của 4.21 mang màu cm²); cùng số đo 10 000 cm² lại mang hai màu ở hai câu liền nhau. (Tổng hợp mở rộng ra cả phần 9, 10.)
- Sửa: kết quả không phải chu vi hay diện tích để màu mực thường (bỏ `\concept`), thẻ hàng dùng `slate`, thẻ "hai đường chéo" dùng amber; diện tích đổi đơn vị (10 000 cm²) một màu teal ở mọi chỗ, màu sky chỉ cho số đo độ dài vừa đổi.

### 29. Chữ a, b của hình thoi khi là cạnh, khi là đường chéo, mà hình không nói

- Vị trí: hình `nam-hinh-cong-thuc` (`catalog-book.ts`, `$.sections[10].blocks[0].children[4]`); hình `visual.thoi-quy-tac` (phần 7) so với `visual.c4a-quy-tac` (phần 2)
- Nguồn: tr.70, `sbt-p70.png` (sách ghi "a, b là độ dài hai đường chéo")
- Vấn đề: ở phần 2 a là cạnh hình thoi (`C = 4 · a`); ở phần 7 và bảng năm công thức, `S = a · b : 2` đứng ngay dưới `S = a · b` của hình chữ nhật (a, b là hai cạnh) mà không chữ nào nói a, b là đường chéo. Bé dễ nhân hai cạnh hình thoi; 4.22c ngay sau hỏi đúng hình thoi. (Gộp Góp ý 10 của nhóm 2, giữ mức Nên sửa.)
- Sửa: ghi thấy được dưới hình quy tắc phần 7 và trong thẻ hàng của bảng năm công thức "a, b là hai đường chéo", hoặc viết công thức bằng chữ như câu quy tắc ("tích hai đường chéo, chia cho 2").

### 30. Khối "Nhắc lại" có quy tắc chưa phần nào dạy

- Vị trí: `$.sections[10].blocks[1].children[2]` (hình khuyết một góc), hình `khuyet-nhac-lai`; `$.sections[10].blocks[0].children[3]` (biết diện tích và một chiều thì chia); `$.sections[10].blocks[1].children[1]` (cộng chu vi các hình và các đoạn thẳng); `$.sections[10].blocks[3].children[2]` (hai tầng dây thì nhân đôi) - LL-16
- Nguồn: tr.116 (lời giải 4.24)
- Vấn đề: khối tên "Nhắc lại" mà bốn câu này bé chưa gặp ở 10 phần trước. Nặng nhất là hình khuyết: chu vi bằng chu vi hình chữ nhật trước khi cắt là điều mới, chỉ có một câu và một hình tĩnh, hai câu dẫn 4.24 phải gánh việc dạy. (Tổng hợp thêm ba câu còn lại.)
- Sửa: dạy hình khuyết ở phần 10 bằng một màn có hình đi quanh hình khuyết (dùng lại `walk.tsx`) rồi mới nhắc ở đây, hoặc đổi tiêu đề khối thành "Cách làm bài 4.24" kèm hình từng bước cho thấy hai cạnh thụt vào bằng hai đoạn bị cắt. Ba câu còn lại: thêm một câu kiểm tra hay kho ôn ở phần 5 (tìm chiều còn lại) và phần 10 (hai tầng dây), hoặc đặt chúng dưới tiêu đề "Cách làm" thay vì "Nhắc lại".

### 31. `explain` của câu dẫn chu vi hình khuyết chưa nói vì sao

- Vị trí: `$.exercises[65].explain.text` (`ex.dan-4-24-cv`)
- Nguồn: —
- Vấn đề: "Đường viền đi vào rồi đi ra ở chỗ khuyết, dài bằng hai cạnh của góc bị cắt." không nói cái gì bằng cái gì; bé không thấy hai cạnh mới thay đúng hai đoạn đã mất.
- Sửa: "Chỗ khuyết bỏ đi 3 m ở cạnh trên và 3 m ở cạnh phải, nhưng thêm hai cạnh mới cũng dài 3 m và 3 m. Nên chu vi vẫn bằng chu vi hình chữ nhật 10 m và 6 m."; thêm hình tô hai cặp đoạn bằng nhau.

## Góp ý

### 1. Thêm "cạnh kề" vào glossary

- Vị trí: `$.sections[2].blocks[0].children[0].text`; `content/glossary/math.json`
- Nguồn: tr.70
- Vấn đề: "hai cạnh kề nhau" có trong câu quy tắc phần 3 và nhiều câu khác, có câu định nghĩa ở màn đầu, nhưng glossary có "cạnh đối", "cạnh bên", "cạnh đáy" mà không có "cạnh kề".
- Sửa: thêm mục "cạnh kề" (không màu).

### 2. Câu kho ôn hình thang cân trùng hai số với hình dạy

- Vị trí: `$.exercises[3]` (`ex.chu-vi-chon-phep-tinh`) - LL-07
- Nguồn: —
- Vấn đề: đáy 3 cm và 9 cm trùng số 9 và 3 của hình `walk-thang-can`.
- Sửa: hai đáy 4 cm và 8 cm, cạnh bên 3 cm (chu vi 18) hay số khác.

### 3. Luồng câu của các phần 1–8 cùng một khuôn

- Vị trí: `checkIds`/`practiceIds` và kho ôn của `$.sections[0]` đến `$.sections[7]`
- Nguồn: —
- Vấn đề: phần nào cũng một câu gõ số, một câu chọn cùng lời, một câu gõ số đời sống; `tapRegion` (`cham-hinh-4-o`), `manipulate` (`xep-gach-4-3`), `fillBlank` (`chu-vi-dien-tu`) chỉ nằm trong kho ôn.
- Sửa: đưa `xep-gach-4-3` lên làm câu luyện phần 5 (chuyển `phong-hoc-7-5` xuống kho ôn), `cham-hinh-4-o` lên phần 4 (cùng Nên sửa 5); mỗi phần 6–8 đổi một câu ôn sang dạng khác (`match` hình với công thức, chạm vào đoạn chiều cao).

### 4. Hình quy tắc phần 2, 3, 5 nhỏ trên điện thoại

- Vị trí: hình `c4a-quy-tac`, `c2ab-quy-tac`, `dt-cn-quy-tac` (`phone/027-s2-02-block.png`, `040-s3-02-block.png`, `066-s5-02-block.png`)
- Nguồn: —
- Vấn đề: hai hình mẫu đặt cạnh nhau nên trên điện thoại hình vuông chỉ khoảng 60 px, chữ "a", "b" nhỏ.
- Sửa: tăng cỡ hình mẫu hoặc xếp hai hình một cột trên màn hẹp.

### 5. Nhãn đọc màn hình của hình xếp gạch sai số ở câu kho ôn

- Vị trí: hình `floor-lesson` dùng cho `$.exercises[25]` (`ex.xep-gach-4-3`) - LL-15
- Nguồn: —
- Vấn đề: câu dùng sàn 4 m × 3 m qua `params`, nhưng `aria-label` vẫn là "Sàn phòng dài 5 m, rộng 3 m".
- Sửa: tạo nhãn từ `params` hoặc dùng khoá hình riêng.

### 6. Tên nút trong note "Cùng làm" khác nút trên màn

- Vị trí: `$.sections[5].blocks[3].children[0].text`; `parallelogramSlide().actions`
- Nguồn: —
- Vấn đề: note bảo bấm "Cắt", "Trượt"; nút là "Cắt tam giác", "Trượt sang phải".
- Sửa: chép đúng tên nút vào note.

### 7. Ghi dấu kiến thức nền cho các cách cắt ghép

- Vị trí: `sourceRef` của `section.dien-tich-binh-hanh`, `section.dien-tich-thang-can` và thẻ cùng tên
- Nguồn: tr.70
- Vấn đề: cắt trượt và ghép hình là cách tiểu học dùng để ra công thức; `sourceRef` chỉ ghi trang sách bài tập.
- Sửa: "Kiến thức nền (tiểu học); sách bài tập tr.70 (kiến thức cần nhớ)" như phần 1, 4, 9.

### 8. Nối "chia cho 2" với cách sách viết ½

- Vị trí: `$.sections[6].blocks[1]`, `$.sections[7].blocks[1]`, hình `nam-hinh-cong-thuc`
- Nguồn: tr.70 (`S = ½ab`, `S = ½(a + b)h`)
- Vấn đề: bé sẽ gặp ½ trong sách và đề kiểm tra mà bài không nói hai cách viết là một. (Gộp Góp ý 3 nhóm 2 và Góp ý 5 nhóm 3.)
- Sửa: một dòng nhỏ ở hình quy tắc hoặc hình nhắc lại: "Sách viết ½ trước công thức, nghĩa là chia cho 2." Chỉ khi chủ dự án thấy cần.

### 9. Nhiễu chưa có lý do `wrong`

- Vị trí: `ex.lat-gach-5-3` lựa chọn `d` (30), `ex.mot-met-vuong` lựa chọn `d` (100 000)
- Nguồn: —
- Vấn đề: hai nhiễu không có lý do; 30 không ra từ lỗi rõ nào.
- Sửa: đổi 30 thành số của lỗi "chỉ đếm một hàng" và thêm `wrong`; thêm `wrong` cho 100 000 ("thêm một chữ số 0; 100 · 100 = 10 000").

### 10. Hai câu khác phần dùng cùng cặp số 14 và 6

- Vị trí: `ex.dt-bbh-14-6` (kho ôn phần 6), `ex.dt-thoi-14-6` (câu kiểm phần 7) - LL-07
- Nguồn: —
- Vấn đề: đáp số 84 của câu bình hành là nhiễu của câu hình thoi.
- Sửa: hình bình hành đáy 13 cm, cao 6 cm (78 cm²).

### 11. Câu kiểm "chọn việc tính diện tích" lặp đúng bốn ví dụ của màn quy tắc

- Vị trí: `ex.chon-viec-dien-tich`
- Nguồn: —
- Vấn đề: rào vườn, lát sàn, viền, sơn tường là bốn ô của hình `chon-chu-vi-dien-tich` vừa xem.
- Sửa: việc khác: trải thảm, dán giấy kín mặt bàn, căng dây quanh sân, đóng nẹp quanh cửa.

### 12. Note xoay tam giác không nói xoay quanh điểm nào

- Vị trí: `$.sections[6].blocks[0].children[0].text`
- Nguồn: —
- Vấn đề: bé tự làm trên giấy không biết xoay quanh đâu.
- Sửa: "xoay nửa vòng quanh điểm giữa cạnh hình thoi".

### 13. "Phần mười" trong lời giải mà note không dùng

- Vị trí: `ex.doi-0-5-m`, `ex.noi-so-do` (`explain`)
- Nguồn: —
- Vấn đề: note nói "chia một mét thành 10 phần … mỗi phần 0,1 m"; lời giải nói "5 phần mười của mét".
- Sửa: "0,5 m là 5 phần, mỗi phần 0,1 m = 10 cm".

### 14. Số và đơn vị bị ngắt hai dòng

- Vị trí: `$.exercises[59].prompt[1]` (`ex.sbt-4-22b`, walk `170-…-4-22b`); `$.exercises[54].segments[4]` (`ex.sbt-4-20`, iPad)
- Nguồn: —
- Vấn đề: chữ số và đơn vị tách dòng, bé đọc chậm dễ lạc.
- Sửa: khoảng trắng không ngắt (U+00A0) giữa số và đơn vị (chữ sách giữ nguyên); báo người làm app nếu ô `fillBlank` cần co lại.

### 15. Lời câu dẫn còn chỗ đọc vấp

- Vị trí: `$.exercises[56].prompt[0]` (`ex.dan-4-21-so`); `$.exercises[65].prompt[0]`, `$.exercises[66].prompt[0]` (`ex.dan-4-24-*`)
- Nguồn: —
- Vấn đề: "một chiều dài 9 cm" đọc như chiều dài là 9 cm; "một góc hình vuông cạnh 3 m" có thể hiểu là góc của một hình vuông.
- Sửa: "một chiều là 9 cm"; "bị cắt mất một hình vuông cạnh 3 m ở góc".

### 16. Câu dẫn 4.23 dùng đúng nửa số của Hình 4.19

- Vị trí: `$.exercises[63]` (`ex.dan-4-23-tong`, hình `dan-khung-40-30`)
- Nguồn: tr.72, Hình 4.19
- Vấn đề: 40, 30, 25 bằng nửa 80, 60, 50, nên 310 nhân đôi ra 620.
- Sửa: bộ số không tỉ lệ với đề, như 32, 24, 20.

### 17. Cách giải "chia diện tích" của sách chưa xuất hiện lần nào

- Vị trí: `$.exercises[76].explain` (`ex.sbt-4-27`)
- Nguồn: tr.71 ví dụ 1, tr.116
- Vấn đề: đếm theo hàng đúng và dễ hơn, nhưng bé chưa thấy cách của sách ra cùng một số.
- Sửa: thêm "Cách khác: diện tích sân 135 m² chia cho diện tích một viên 0,36 m² cũng được 375 viên." (lời của bài).
