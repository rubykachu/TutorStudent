# Review: Hình tam giác đều. Hình vuông. Hình lục giác đều (`hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu`)

- Bài: `content/math/kntt/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/` - sbt-p63, sbt-p64, sbt-p65, sbt-p66, sbt-p115
- `content:check`: 0 lỗi, 1 cảnh báo của bài (111 id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): 437 / 29 / 0; tệp `.shots/review/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/doc-hieu.md`
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/`; `visual:shot` 184/184 đạt
- Kết luận: Chưa đạt: còn 8 lỗi Nghiêm trọng. Đã chạy `content:hash --mark`, bài giữ `draft`; không `--approve`, không `content:lock` ở vòng này.
- Bản đã review: `f1ad743346646f0753fd90bc2e66c625635082d0dd94eba0b31f6c213c866ef2` (`pnpm content:diff` so với bản này)

Phán quyết theo luật "Không có trong sách" (checklist trục 1), dùng một tiêu chí cho mọi điểm ngoài trang: được giữ khi điều đó cần để làm một bài tập trên các trang đã nạp và lần được về một dòng in trên trang (dòng kĩ năng, chữ trong đề, lời giải tr.115); không cần cho bài nào và không có chữ nào trên trang thì là Nghiêm trọng.
- Đạt (giữ, chỉ sửa `sourceRef`, Nên sửa 1): cách vẽ hình tam giác đều bằng thước và compa, hình vuông bằng thước và êke (dòng kĩ năng tr.63, bài 4.2 và 4.3 cần); đường chéo chính và đường chéo phụ định nghĩa bằng đỉnh (tr.63 "ba đường chéo chính", bài 4.4a dùng chữ "đường chéo phụ", lời giải tr.115 liệt kê); hai đường chéo hình vuông vuông góc (bài 4.3 hỏi, lời giải tr.115 "vuông góc với nhau").
- Không đạt: khái niệm chung "hình đều" có câu định nghĩa (Nghiêm trọng 1) và "tâm" của hình lục giác đều (Nghiêm trọng 2). Không bài tập nào cần hai khái niệm này, trang nguồn và glossary (không `prerequisite`) không có.

## Nghiêm trọng

### 1. Khái niệm chung "hình đều" và câu định nghĩa của nó không có trong sách

- Vị trí: `$.sections[0].blocks[1].children[0]` (`note` có `rule: true`), `$.sections[0].recap.caption`, `$.cards[0].recap.caption` (`card.hinh-deu`); `$.exercises[1]` (`ex.hinh-deu-la-gi`, cả `explain` và `wrong`), `$.exercises[2].prompt[0]`, `.explain.text` (`ex.chon-hinh-deu`), `$.exercises[4]` (`ex.canh-bang-nhau-9`), `$.exercises[0].prompt[0]` (`ex.noi-vat-voi-hinh`); chữ "hình đều" ở `$.overview.hook`, `.summary`, `.goals[3]`, `$.sections[0].title`, `$.sections[0].blocks[0].children[0]`, `$.sections[0].blocks[2].children[0]`, `$.sticker.name`. LL-09.
- Nguồn: tr.63 (`sbt-p63.png`), mục "Kiến thức cần nhớ" chỉ nêu tính chất của từng hình trong ba hình; không có chữ "hình đều" hay câu định nghĩa chung.
- Vấn đề: "Hình đều có các cạnh bằng nhau và các góc bằng nhau" là định nghĩa đa giác đều của lớp trên, đặt thành câu quy tắc bé phải nhớ, có câu hỏi "Hình đều là hình thế nào?" và câu áp định nghĩa đó cho "một hình đều" bất kỳ. Thêm vào đó, câu `ex.hinh-deu-la-gi` "Thiếu một trong hai điều thì chưa phải hình đều" mâu thuẫn bề mặt với quy tắc phần 10 (tam giác chỉ cần ba cạnh bằng nhau, Nên sửa 3). Câu "các cạnh của hình đều bằng nhau" ở màn "Cùng làm" phần 1 còn đọc được hai cách (hình [này] đều bằng nhau / hình đều bằng nhau). Bàn giao không nêu điểm này trong ba điểm ngoài trang sách.
- Sửa: nói về đúng ba hình của bài, không định nghĩa chung. Câu quy tắc (recap phần và thẻ đổi theo nguyên văn): "Hình tam giác đều, hình vuông và hình lục giác đều cùng có các cạnh bằng nhau và các góc bằng nhau." `ex.hinh-deu-la-gi`: "Ba hình trong bài giống nhau ở điểm nào? Chọn câu đúng.", `explain` bỏ câu "Thiếu một trong hai điều…". `ex.chon-hinh-deu`: "Chọn tất cả các hình có các cạnh bằng nhau và các góc bằng nhau.", `explain` đổi "thoả" thành "có đủ". `ex.canh-bang-nhau-9`: "Một hình lục giác đều có một cạnh dài 9 cm…". `ex.noi-vat-voi-hinh`: "Nối mỗi vật với hình của nó." Tên phần "Ba hình quanh ta", summary "Bài này nói về ba hình: …", goals[3] "đếm được các hình tam giác đều, hình vuông, hình lục giác đều trong một hình lớn", hook "làm quen với ba hình đặc biệt", huy hiệu "Huy hiệu ba hình", note "Cùng làm" phần 1 "Bạn sẽ thấy bốn cạnh của hình vuông dài bằng nhau."; `ba-hinh-deu` đổi nhãn theo. Nếu chủ dự án muốn giữ "hình đều" thì phải nạp trang SGK có khái niệm này và ghi vào `sourceRef`, rồi ghi quyết định vào bàn giao.

### 2. Câu quy tắc phần 6 dạy "tâm", không có trong sách, định nghĩa mơ hồ, và đường chéo phụ có ba cách nói

- Vị trí: `$.sections[5].blocks[0].children[0]` ("Tâm là điểm chính giữa của hình…"), `$.sections[5].blocks[1].children[0]` (`rule: true`), `$.sections[5].recap.caption`, `$.cards[5].recap.caption` (`card.duong-cheo-luc-giac`), `$.sections[11].blocks[2].children[1]`, `.children[2]` (khối "Nhắc lại"); lời app ở `$.exercises[25].prompt[0]` (`ex.chon-cheo-chinh`), `$.exercises[63].prompt[0]`, `$.exercises[64].prompt[3]` (`ex.sbt-4-4a`, câu lệnh của app, không phải lời sách); `$.exercises[28].explain.text` (`ex.cheo-chinh-noi-nao`), `$.exercises[64].explain.text`, `$.exercises[63].explain.wrong[*]`, `$.exercises[36].explain.text` (`ex.vi-sao-mo-compa`); chú thích khung của `visual.luc-giac-cheo-cac-buoc` trong `catalog.ts`. LL-09, LL-05.
- Nguồn: tr.63 chỉ có "ba đường chéo chính bằng nhau"; tr.65 bài 4.4a có chữ "đường chéo phụ"; lời giải tr.115 liệt kê sáu đường chéo phụ. Không trang nào có "tâm" của hình lục giác đều. Glossary có mục "tâm" nhưng không có `prerequisite`.
- Vấn đề: "tâm" nằm trong câu quy tắc và recap bé phải nhớ, câu định nghĩa "điểm chính giữa của hình" không đủ để bé tự tìm, và không bài tập nào cần nó (bài 4.4a làm được bằng đỉnh). Cùng bài dùng "tâm" với nghĩa khác (chỗ đặt kim compa) ở `ex.vi-sao-mo-compa`, trong khi bảng vẽ gọi chỗ đó là "kim compa": một từ hai nghĩa. Đường chéo phụ còn được nói ba cách: "các đường chéo còn lại" (màn đầu), "những đường không đi qua tâm" (khối "Nhắc lại"), "nối hai đỉnh mà giữa chúng còn một đỉnh khác" (`ex.dan-4-4a-chon-phu`), "hai đỉnh có một đỉnh ở giữa" (`ex.cheo-chinh-noi-nao`).
- Sửa: định nghĩa bằng đỉnh, bỏ "tâm". Câu quy tắc (recap phần, thẻ và khối "Nhắc lại" lặp nguyên văn): "Đường chéo chính của hình lục giác đều nối hai đỉnh đối diện nhau. Ba đường chéo chính bằng nhau." Màn đầu và khối "Nhắc lại" dùng cùng một câu cho đường chéo phụ: "Đường chéo phụ nối hai đỉnh mà giữa chúng chỉ có một đỉnh." Lời app ở `ex.chon-cheo-chinh` thành "tức các đường nối hai đỉnh đối diện nhau", ở `ex.dan-4-4a-chon-phu` và `ex.sbt-4-4a` thành "tức các đường nối hai đỉnh mà giữa chúng chỉ có một đỉnh". Bỏ "và đi qua tâm" ở `ex.cheo-chinh-noi-nao`, `ex.sbt-4-4a`; `ex.dan-4-4a-chon-phu` `wrong` "A và D là hai đỉnh đối diện nhau, nên AD là đường chéo chính". `ex.vi-sao-mo-compa`: "Mỗi điểm trên cung tròn cách chỗ đặt kim compa một đoạn bằng độ mở compa." Hình `luc-giac-cheo-cac-buoc` bỏ "đi qua tâm O", "không qua tâm" (có thể chấm điểm giữa mà không gọi tên). Mục "tâm" trong glossary: chỉ bỏ sau khi kiểm không bài nào khác dùng.

### 3. Lời giải thích nói "sáu cạnh, nên là hình lục giác đều"

- Vị trí: `$.exercises[0].explain.text` (`ex.noi-vat-voi-hinh`). LL-17.
- Nguồn: tr.63 (lục giác đều: sáu cạnh bằng nhau, sáu góc bằng nhau).
- Vấn đề: "Ngăn tổ ong có sáu cạnh, nên là hình lục giác đều" dạy một suy luận sai: hình có sáu cạnh chưa chắc là lục giác đều. Hai câu sau của cùng `explain` (gạch, biển báo) thì có "bằng nhau". Bé học chậm dễ nhớ nguyên câu và gọi mọi hình sáu cạnh là lục giác đều.
- Sửa: "Ngăn tổ ong có sáu cạnh bằng nhau và sáu góc bằng nhau, nên là hình lục giác đều."

### 4. Nhãn "4,2 cm" ở hình chạm đo đường chéo bị cạnh hình vuông cắt qua, không biết số nào của đường nào

- Vị trí: `visual.do-duong-cheo-vuong` (`catalog.ts`, `parts[0].textAt` [104, 98], `parts[1].textAt` [196, 98]), dùng ở `$.sections[3].blocks[2].children[1]` (`section.duong-cheo-hinh-vuong`). LL-12.
- Nguồn: walk `060-s4-03-block-shown.png` (điện thoại và iPad).
- Vấn đề: sau khi đo, cạnh AD cắt qua chữ "4" của nhãn trái, cạnh BC cắt qua chữ "m" của nhãn phải. Hai nhãn nằm ở tam giác AOD và BOC, cách đều hai đường chéo, nên bé không biết số nào là AC, số nào là BD, đúng ở màn dạy "hai đường chéo bằng nhau". Chữ chồng do hình của bài.
- Sửa: ghi tên đoạn kèm số và đặt khỏi nét, ví dụ "AC = 4,2 cm" và "BD = 4,2 cm" thành hai dòng dưới hình vuông, hoặc mỗi nhãn nằm sát nửa dưới đúng đường chéo của nó trong tam giác DOC, không chạm cạnh. Chụp lại `visual:shot` và walk điện thoại.

### 5. Câu `hai-cung-gap-nhau` thiếu điều kiện "mở compa bằng cạnh", nên không lựa chọn nào luôn đúng

- Vị trí: `$.exercises[39].prompt[0].text` (`ex.hai-cung-gap-nhau`, câu luyện thẻ `card.ve-tam-giac-deu`). LL-10, LL-17.
- Nguồn: —
- Vấn đề: đề chỉ nói hai cung vẽ từ hai đầu một cạnh gặp nhau ở C. Không nói độ mở bằng cạnh, nên hình nối được chỉ chắc là một hình tam giác; đáp án "Hình tam giác đều" chỉ đúng khi bán kính bằng cạnh. `explain` tự thêm điều kiện mà đề không có. Câu còn dạy rằng cứ hai cung gặp nhau là ra tam giác đều, trái với `ex.mo-compa-bao-nhieu` và mẹo "Độ mở compa".
- Sửa: "Mở compa bằng đúng cạnh AB, vẽ hai cung tròn từ A và từ B. Hai cung gặp nhau ở C. Nối C với A và B thì được hình gì?" (mỗi câu ≤ 25 âm tiết). `explain` giữ ý.

### 6. Lời giải thích nói "hai ô liền nhau" ghép thành hình vuông

- Vị trí: `$.exercises[51].explain.text` (`ex.dem-hinh-vuong-hai-hang`). LL-17.
- Nguồn: tr.64 ví dụ 2 (đếm hình) - `sbt-p64.png`.
- Vấn đề: "Hai ô liền nhau ở hai hàng ghép thành một hình vuông lớn hơn" đọc thành hai ô ghép thành hình vuông; hai ô chỉ là hình chữ nhật, hình vuông lớn cần bốn ô 2 × 2. Câu còn trái với `ex.dem-hinh-vuong-mot-hang` ("Ghép các ô lại chỉ được hình chữ nhật"). Hình lời giải `dem-luoi-giai` tô đúng 2 × 2 nhưng chữ dạy sai.
- Sửa: "Có 6 hình vuông nhỏ. Bốn ô xếp 2 hàng, 2 cột ghép thành một hình vuông lớn, và có 2 hình như vậy. Vậy có tất cả 6 + 2 = 8 hình vuông."

### 7. Hình gợi ý nấc 2 của bài 4.5a bị cắt ở mép dưới, thiếu tên Y và Z

- Vị trí: `$.exercises[69].hints.hintVisualId` (`ex.sbt-4-5a`) → `visual.sbt-4-5a-goi-y` (`SBT_4_5A_HINT`, `catalog.ts`). LL-12, LL-15.
- Nguồn: tr.65 bài 4.5a - `sbt-p65.png`; ảnh `visual:shot` `sbt-4-5a-goi-y-phone.png`, `-ipad.png`.
- Vấn đề: cung compa tâm X đi xuống dưới cạnh đáy và bị cắt ngang ở mép dưới khung (h 210). Hai đỉnh đáy không có tên, nên dòng "YZ: ?" không chỉ được đoạn nào. Bé xem nấc 2 sau lần sai thứ hai mà không hiểu hình, nên không làm tiếp được.
- Sửa: hiện tên X, Y, Z (`names`); tăng `h` hoặc vẽ cung phía trên đáy (từ hướng XY sang hướng XZ, đi trong tam giác) để cả cung nằm trong khung. Chụp lại `visual:shot` và tự xem ảnh.

### 8. Màn "Cùng làm" phần 11 và câu dẫn bài 4.7b chép Ví dụ 1 của sách kèm lời giải

- Vị trí: `visual.dem-cung-lam` (`$.sections[10].blocks[2].children[1]`, `section.dem-hinh`), `$.exercises[75]` (`ex.dan-4-7b-tam-giac-bon`, `visual.dem-tam-giac-bon`); cả hai dựng từ `triangleOfFour` trong `catalog.ts`. LL-08, LL-07.
- Nguồn: tr.63 Ví dụ 1, Hình 4.1 - `sbt-p63.png`.
- Vấn đề: hình là đúng Hình 4.1 (tam giác ABC, M trên AB, N trên AC, P trên BC), và năm phần bé chạm (AMN, MBP, NPC, MNP, ABC) là đúng lời giải của ví dụ. Câu dẫn hỏi lại đúng hình đó với đáp án 5, nên chỉ lặp màn bé vừa chạm, không luyện thêm. Hình và lời giải của khối "Ví dụ" lấy làm màn mẫu là chép (LL-08: màn cùng làm dựng trên bài sách kèm lời giải). Reviewer nhóm ghi Nên sửa; nâng lên Nghiêm trọng theo trục 1 "Biên soạn lại, không chép".
- Sửa: `dem-cung-lam` dùng hình khác cùng kỹ năng, ví dụ tam giác đều DEF chia 9 tam giác nhỏ bởi các điểm chia ba cạnh, hoặc giữ cách chia bốn nhưng đổi tên điểm và chia thêm một tam giác nhỏ (đáp án khác 5). Câu dẫn 4.7b dùng hình thứ ba, khác cả màn "Cùng làm" lẫn Hình 4.8 (ví dụ tam giác đều chia 9: 9 + 3 + 1 = 13), không trùng số 5 và không trùng 8. Dò lại trang tr.63–66 và tr.115 trước khi chốt số.

## Nên sửa

### 1. `sourceRef` của phần 4, 6, 8, 9 không trỏ tới trang có nội dung đã dạy

- Vị trí: `$.sections[3].sourceRef`, `$.cards[3].sourceRef` (tr.64 ví dụ 2: bài chỉ ra hình vuông, không nói về đường chéo); `$.sections[5].sourceRef`, `$.cards[5].sourceRef` (thiếu tr.65 bài 4.4a có chữ "đường chéo phụ"); `$.sections[7].sourceRef`, `$.cards[7].sourceRef`, `$.sections[8].sourceRef`, `$.cards[8].sourceRef` (các bước vẽ không in trên trang nào đã nạp).
- Nguồn: `sbt-p63.png`, `sbt-p65.png`, `sbt-p115.png`.
- Vấn đề: ba điểm ngoài trang sách được giữ (xem phán quyết ở đầu tệp), nhưng `sourceRef` không trỏ tới căn cứ của chúng, nên vòng sau không lần ra.
- Sửa: phần 4: "Sách bài tập tr.63 (kiến thức cần nhớ), tr.65 (bài 4.3), tr.115 (lời giải 4.3)". Phần 6: thêm "tr.65 (bài 4.4a), tr.115 (lời giải 4.4a)". Phần 8, 9: nạp trang SGK Bài 18 có cách vẽ vào `sources/` và ghi trang đó; nếu không nạp, ghi vào `task.md` rằng các bước vẽ là cách vẽ chuẩn lớp 6 lấy theo dòng kĩ năng tr.63 để chủ dự án quyết.

### 2. Đường chéo được định nghĩa ba cách: "hai góc không kề nhau", "hai đỉnh không nằm cạnh nhau", "hai đỉnh đối diện nhau"

- Vị trí: `$.overview.goals[1]` ("đường nối hai góc không kề nhau"), `$.sections[3].blocks[0].children[0]` ("đoạn thẳng nối hai đỉnh không nằm cạnh nhau"), `$.exercises[18].explain.text` (`ex.hinh-vuong-co-may-duong-cheo`, "hai đỉnh đối diện nhau"). LL-05.
- Nguồn: —
- Vấn đề: một khái niệm ba cách nói; "nối hai góc" sai nghĩa (đoạn nối hai đỉnh), "kề" không dùng ở chỗ nào khác. "Đối diện" lại là chữ phần 6 dành cho đường chéo chính của lục giác.
- Sửa: tổng quan "biết cạnh, góc và đường chéo (đoạn nối hai đỉnh không nằm cạnh nhau) của từng hình"; `ex.hinh-vuong-co-may-duong-cheo` "Hình vuông có bốn đỉnh. Mỗi đường chéo nối hai đỉnh không nằm cạnh nhau, nên hình vuông có hai đường chéo."

### 3. Phần 1 nói phải đủ cả cạnh lẫn góc, phần 10 nói tam giác chỉ cần ba cạnh bằng nhau

- Vị trí: `$.exercises[1].explain.text` (`ex.hinh-deu-la-gi`, "Thiếu một trong hai điều thì chưa phải hình đều") so với `$.sections[9].blocks[1].children[0]` (`rule: true`, "Hình có ba cạnh bằng nhau là hình tam giác đều…") và `$.sections[9].blocks[0].children[0]`. LL-05.
- Nguồn: tr.65 bài 4.5a (chỉ dùng compa), 4.5b (compa và êke).
- Vấn đề: hai câu đúng nhưng đặt cạnh nhau thì như trái nhau; bé không biết vì sao tam giác thì không cần kiểm góc còn hình bốn cạnh thì cần. Sửa Nghiêm trọng 1 bỏ câu "Thiếu một trong hai điều…" thì giảm, nhưng phần 10 vẫn chưa nói lý do.
- Sửa: màn đầu phần 10 thêm một câu: "Với hình tam giác, chỉ cần so ba cạnh. Với hình bốn cạnh, phải kiểm cả cạnh và góc." (theo đúng cách làm của bài 4.5a và 4.5b).

### 4. Màu khái niệm lệch trong `tex` và hình lời giải

- Vị trí: `\concept{amber}` (màu "Đường chéo") tô kết quả không phải đường chéo ở `$.exercises[34].explain.tex` (`ex.canh-tu-cheo-chinh-30`, kết quả là cạnh, màu "Cạnh" là blue), `$.exercises[51].explain.tex`, `$.exercises[75].explain.tex`, `$.exercises[76].explain.tex` (số hình đếm được); `visual.sbt-4-7a-giai` (ABCDEF tô `teal`, màu "Hình tam giác đều"), `visual.sbt-4-7b-giai` (sáu tam giác nhỏ tô `lime`, màu "Hình lục giác đều"; BDF tô `amber`), `visual.sbt-4-4b-giai` (NQS tô `amber`).
- Nguồn: —
- Vấn đề: một khái niệm, một màu (checklist trục 4). Bài gán blue cho cạnh, amber cho đường chéo, teal cho tam giác đều, lime cho lục giác đều; các chỗ trên tô số đếm hay cạnh bằng màu đường chéo và tô lục giác bằng màu tam giác, nên màu làm bé rối.
- Sửa: `ex.canh-tu-cheo-chinh-30` dùng `\concept{blue}{15}`; ba câu đếm hình bỏ `\concept` (hoặc tô bằng màu của hình được đếm: teal cho tam giác đều, pink cho hình vuông). Hình lời giải: lục giác tô `lime`, tam giác đều tô `teal`; cần phân biệt hai tam giác thì cùng `teal` khác số vạch, như đã làm ở 4.4b.

### 5. Hình chạm để đo sinh khóa React trùng (huy hiệu "Issues" của Next từ phần 4, 6, 11)

- Vị trí: mã dùng chung `src/visuals/shared/plane/probe-model.ts` (`probeFigure` đẩy thêm đoạn hay đa giác đã có sẵn trong `figure.segs`/`figure.polys`) và `src/visuals/shared/plane/figure.tsx` (khóa theo tên điểm: dòng 345, 349 `poly.v.join("")`, dòng 356 `${seg.a}${seg.b}`). Lộ ra ở `visual.do-duong-cheo-vuong` (AC, BD; "2 Issues" từ walk `060-s4-03-block-shown`), `visual.do-cheo-chinh` (đường chéo chính; "3 Issues" từ `089-s6-03-block-shown`), `visual.dem-cung-lam` (ABC; "2 Issues" từ `164-s11-03-block-shown`).
- Nguồn: walk iPad và điện thoại.
- Vấn đề: đo xong, hình có hai phần tử cùng khóa; React có thể vẽ lẫn nét đứt và nét đậm khi trạng thái đổi. Walk không bắt vì không đọc console. Bé không thấy huy hiệu (chỉ có ở dev), nên không chặn bài.
- Sửa: trong `probeFigure`, phần đo trùng một đoạn hay đa giác đã có thì thay phần tử đó thay vì thêm mới (hoặc thêm chỉ số vào khóa ở `figure.tsx`). Mã dùng chung nên sửa một lần, chạy lại test của các bài dùng `probe` và walk xem huy hiệu mất.

### 6. Hình gợi ý nấc 2 và hình trong đề là tam giác nhỏ trơn, không giúp gì

- Vị trí: `$.exercises[7].hints.hintVisualId` (`ex.chon-tam-giac-deu`), `$.exercises[9].prompt[1]` và `.hints.highlight[0]` (`ex.td-dien-cho-trong`); `visual.th-tam-giac-deu`. LL-02, LL-15.
- Nguồn: —
- Vấn đề: tam giác cỡ ảnh nhỏ, không vạch, không số; ở `chon-tam-giac-deu` nó không tách bước "so ba số", chỉ cho thấy hình dáng giống lựa chọn đúng; ở `td-dien-cho-trong` nấc 1 tô đúng hình này mà hình không giúp nhớ "ba" hay "60".
- Sửa: `chon-tam-giac-deu` dùng hình gợi ý một tam giác khác (vd 4, 4, ?) kèm "Ba cạnh phải cùng một số", dừng ở "?"; `td-dien-cho-trong` thay hình đề bằng tam giác cỡ đầy đủ có vạch bằng nhau (không ghi 60°), hoặc bỏ highlight vào hình và dùng `hintVisualId` = `tam-giac-deu-quy-tac`.

### 7. Số đo cạnh trong bốn lựa chọn tam giác quá nhỏ

- Vị trí: `$.exercises[7].options[*]` (`ex.chon-tam-giac-deu`), `visual.tam-giac-5-5-5`, `tam-giac-5-5-6`, `tam-giac-4-5-6`, `tam-giac-3-3-5`. LL-12.
- Nguồn: walk iPad `039-s2-06-…`.
- Vấn đề: đề bắt bé đọc số cạnh để chọn, nhưng số ước dưới 16px, hình chiếm khoảng một phần ba ô; bé yếu đọc dễ nhầm 5 với 6.
- Sửa: vẽ bốn hình lớn hơn trong ô (bỏ `maxScale: 1` hoặc tăng kích thước) để số đạt từ 16px.

### 8. Hình quy tắc phần 1 chỉ đánh dấu cạnh, không đánh dấu góc

- Vị trí: `visual.ba-hinh-deu` (`catalog.ts`, dùng `TICKS`), ở `$.sections[0].blocks[1].children[1]`, `$.sections[0].recap`, `$.cards[0].recap`, `$.sections[11].blocks[0]`. LL-15.
- Nguồn: —
- Vấn đề: câu quy tắc nói cạnh và góc bằng nhau, hình chỉ có vạch cạnh; recap cho thấy nửa quy tắc.
- Sửa: dùng `MARKS` (vạch cạnh và cung góc) cho ba hình, như `hinh-deu-vi-du-vuong`.

### 9. Hình "Cùng làm" phần 5 chỉ cho đo ba cạnh, lời dẫn hứa thấy sáu cạnh bằng nhau

- Vị trí: `$.sections[4].blocks[2].children[0]`, `visual.do-luc-giac-deu` (`sideProbe` chỉ AB, CD, EF; `angleProbe` chỉ A, C, E). LL-15.
- Nguồn: walk `072-s5-03-block.png`, `073-s5-03-block-shown.png` ("Đã đo 6/6").
- Vấn đề: bé chạm hết mà mới đo ba cạnh; lời kết "Các cạnh đều dài 3 cm" nói cả cạnh chưa đo.
- Sửa: đo đủ sáu cạnh (thêm BC, DE, FA). Lo nhiều vòng chạm thì bỏ ba góc và sửa lời dẫn thành "chạm vào từng cạnh để đo" (góc 120° đã có ở hình từng bước và màn quy tắc).

### 10. Hình gợi ý nấc 2 của `tim-luc-giac-deu` là bản sao của hình 1 trong đề

- Vị trí: `$.exercises[22].hints.hintVisualId` (`ex.tim-luc-giac-deu`, `visual.th-luc-giac-deu`). LL-02.
- Nguồn: walk `080-s5-06-exercise-tim-luc-giac-deu-wrong2.png`.
- Vấn đề: lục giác đều trơn, cùng hướng với hình 1; bé so dáng là chạm được hình 1 mà không dùng quy tắc, còn hình 4 (quay 30°), chỗ dễ sai, không được giúp.
- Sửa: hình gợi ý lục giác đều quay khác cả hình 1 và hình 4, có vạch cạnh và cung góc 120°, kèm "Đếm cạnh. Các cạnh có dài bằng nhau không?"

### 11. Hình quy tắc phần 7 chỉ đánh dấu OA = OD, không cho thấy mỗi nửa bằng cạnh

- Vị trí: `visual.ghep-quy-tac` (`$.sections[6].blocks[1].children[1]`, `$.sections[6].recap`, `$.sections[11].blocks[3]`), khung cuối `visual.ghep-cac-buoc` (`ticksOnDiagonal` chỉ trên OA, OD). LL-15.
- Nguồn: walk `099-s7-01-block-end.png`, `100-s7-02-block.png`, `110-s7-08-recap.png`.
- Vấn đề: quy tắc nói "dài gấp đôi cạnh", hình không có vạch nào trên cạnh lục giác nên bé không thấy OA bằng cạnh.
- Sửa: cùng một kiểu vạch trên OA, OD và trên cạnh AB (hoặc cả sáu cạnh); khung cuối có thể thêm "AD = cạnh + cạnh".

### 12. Mẹo "Đường chéo chính" chỉ lặp câu quy tắc, tên không nêu dạng bài, không giúp dạng ngược

- Vị trí: `$.sections[6].blocks[3]` (`tip.cheo-chinh-gap-doi`). LL-24.
- Nguồn: —
- Vấn đề: câu đầu trùng nguyên văn câu quy tắc ngay trên, câu sau nói lại cùng ý (mẹo gượng). Đã thử cạnh 1, 4, 5, 7, 9, 10, 30: đúng mọi đầu vào. Nhưng cùng thẻ có `ex.canh-tu-cheo-chinh-30` (biết đường chéo, tìm cạnh); áp máy móc "nhân đôi" ra 60.
- Sửa: title "Tính đường chéo chính hay cạnh", text "Biết cạnh thì nhân 2 ra đường chéo chính. Biết đường chéo chính thì chia 2 ra cạnh.", tex `7 \cdot 2 = 14`, `14 : 2 = 7`.

### 13. Lý do sai của AC, DF ở `chon-cheo-chinh` cũng loại luôn đường chéo chính

- Vị trí: `$.exercises[25].explain.wrong[0].text`, `.wrong[1].text` (`ex.chon-cheo-chinh`). LL-05.
- Nguồn: —
- Vấn đề: "giữa hai đỉnh này còn có đỉnh B, nên AC là đường chéo phụ": giữa A và D cũng có đỉnh, nên lý do này loại cả AD.
- Sửa: dùng đúng câu đường chéo phụ của Nghiêm trọng 2: "AC nối A với C, giữa hai đỉnh này chỉ có một đỉnh B, nên AC là đường chéo phụ." (tương tự DF với E); `explain.text` có thể thêm "Giữa A và D, mỗi phía có hai đỉnh."

### 14. Đề `ghep-cheo-canh-9` không nói số miếng

- Vị trí: `$.exercises[32].prompt[0].text` (`ex.ghep-cheo-canh-9`). LL-10.
- Nguồn: —
- Vấn đề: ghép 24 miếng cạnh 9 cm cũng ra lục giác đều (đường chéo chính 36 cm); đáp án 18 chỉ đúng với sáu miếng.
- Sửa: "Một hình lục giác đều ghép từ sáu hình tam giác đều có cạnh 9 cm. Đường chéo chính của nó dài bao nhiêu cm?"

### 15. Đề `cheo-chinh-eb-14` không đặt tên hình

- Vị trí: `$.exercises[29].prompt[0].text` (`ex.cheo-chinh-eb-14`). LL-10.
- Nguồn: —
- Vấn đề: câu không hình, không tên đỉnh; bé không biết E, B, C, F là đỉnh nào (câu kho ôn hiện xa phần dạy).
- Sửa: "Hình lục giác đều ABCDEF có đường chéo chính BE = 14 cm. Đường chéo chính CF dài bao nhiêu cm?", `explain` đổi theo.

### 16. Bảng vẽ: hình, tên điểm và số trên thước quá nhỏ

- Vị trí: `visual.ve-td-cung-lam` (`$.sections[7].blocks[2].children[1]`), `visual.ve-td-tap-lam` (`ex.ve-tam-giac-deu-def-6`), cùng các bảng `construct` khác và hình mẫu `ve-td-cac-buoc`; `construct.tsx` `FIGURE_MAX_HEIGHT = 188`, `construction.ts` `BOARD_WIDTH = 196`. LL-12.
- Nguồn: walk iPad `113-s8-01-block-end.png`, `115-s8-03-block.png`, `126-s8-07-exercise-ve-tam-giac-deu-def-6-wrong1.png`.
- Vấn đề: hình chiếm khoảng một phần năm bề ngang; chữ D, E, F và số thước ước khoảng 10px; bé khó thấy hai cung gặp nhau và không phân biệt tam giác vẽ sai (7 và 6) với tam giác đều.
- Sửa: tăng `FIGURE_MAX_HEIGHT` hoặc cho hình rộng theo khung trên iPad, thu khoảng trống trong `viewBox`.

### 17. Bài 4.2 không có lời giải trong sách

- Vị trí: `$.exercises[60]` (`ex.sbt-4-2`).
- Nguồn: tr.115 (mục Bài 18 không có 4.2) - `sbt-p115.png`.
- Vấn đề: theo checklist, ý sách không có lời giải thì ghi Nên sửa và tự giải kỹ. Đã tự giải: mở compa 4 cm từ M và N, hai cung gặp nhau tại P, MNP đều cạnh 4 cm; validator `ve-tam-giac-deu` với `side: 4` đòi đúng các bước đó; `explain` đúng.
- Sửa: không đổi nội dung; ghi để chủ dự án biết đáp án là của bài.

### 18. Bài 4.4b, 4.5a, 4.5b bảo đo, dùng compa, êke mà màn không có công cụ; phần 10 không có câu bé tự kiểm

- Vị trí: `$.exercises[67]` (`ex.sbt-4-4b`), `$.exercises[69]` (`ex.sbt-4-5a`), `$.exercises[70]` (`ex.sbt-4-5b`); `$.exercises[45]` (`ex.kiem-do-ba-canh`), `$.exercises[47]` (`ex.kiem-mot-goc-khong-vuong`). LL-22.
- Nguồn: tr.65 bài 4.4b, 4.5 - `sbt-p65.png`.
- Vấn đề: Hình 4.5, 4.6 là hình tĩnh nên bé đoán bằng mắt, trong khi phần 10 vừa dạy phải dùng compa, êke mới chắc. Hai câu của phần 10 cho sẵn kết quả đo, nên kỹ năng bài 4.5 chỉ được tập ở màn "Cùng làm". Hình vẽ đúng tỉ lệ nên bé vẫn làm được.
- Sửa: thêm hình "chạm để đo" (`probe`, như `kiem-cung-lam`) dựng trên `figure45`, `figure46`, đặt làm khối cuối của `prompt` dưới câu lệnh app (giữ nguyên lời sách): 4.4b chạm MP, PR, RM, NQ, QS, SN; 4.5a chạm AB, AC, BC; 4.5b chạm bốn cạnh, bốn góc của MNPQ. Đổi `ex.kiem-mot-goc-khong-vuong` thành câu có hình `probe` (bốn cạnh bằng nhau, một góc không vuông, khác `kiem-cung-lam`).

### 19. Nấc 2 của bài 4.7b dùng hình của câu luyện khác

- Vị trí: `$.exercises[76].hints.hintVisualId` (`ex.sbt-4-7b`) = `visual.dem-luc-giac-ba-cheo`. LL-02.
- Nguồn: tr.66 bài 4.7b - `sbt-p66.png`.
- Vấn đề: hình là lục giác chia bởi ba đường chéo chính (hình của `ex.dem-tam-giac-trong-luc-giac`, đáp án 6), không giống Hình 4.8, không tách hai cỡ tam giác, dễ dẫn bé ghi 6.
- Sửa: hình gợi ý trên `figure48`: tô hai tam giác lớn ACE, BDF, chữ "2 hình tam giác lớn và ? hình tam giác nhỏ ở các đỉnh" (không tô sáu tam giác nhỏ, không ghi 8).

### 20. Nhiễu của bài 4.7a loại được bằng cách đếm chữ cái

- Vị trí: `$.exercises[74].options` (`ex.sbt-4-7a`, nhiễu `ace`, `bdf`). LL-14.
- Nguồn: tr.66 bài 4.7a - `sbt-p66.png`.
- Vấn đề: hỏi lục giác đều mà hai nhiễu chỉ ba chữ; bé loại ngay vì "ba chữ là tam giác".
- Sửa: thay một hay hai nhiễu bằng hình sáu cạnh có thật trong Hình 4.8 nhưng không đều (vd "ACNDFR", các cạnh đều nằm trên nét vẽ), `wrong`: "ACNDFR có sáu cạnh nhưng các cạnh không bằng nhau."

### 21. Bảng vẽ báo "Bạn đã làm xong mọi bước" khi độ dài sai

- Vị trí: `visual.sbt-4-2-ve`, `visual.ve-td-tap-lam`, `visual.ve-hv-tap-lam`, `visual.sbt-4-3-ve` (`construct.tsx`, `warning`).
- Nguồn: walk `195-s12-10-exercise-sbt-4-2-wrong1`.
- Vấn đề: cạnh MN 5, compa 4, bảng vẫn vẽ P và ghi "Bạn đã làm xong mọi bước"; bé tưởng đúng rồi bị chấm sai, không thấy chỗ sai ở độ mở compa.
- Sửa: cảnh báo khi `open ≠ len` ("Độ mở compa phải bằng cạnh MN") ở bảng tam giác và khi `h ≠ len` ("Hai đoạn lấy thêm phải bằng cạnh") ở bảng hình vuông; hoặc lời kết "Bạn đã bấm đủ các bước. Bấm Kiểm tra." khi chưa đúng. Coi luôn `open * 2 <= len` là "Hai cung chưa gặp nhau" (Góp ý 5).

### 22. Mẹo "Lấy hai đoạn bằng nhau" không nói đặt kim compa ở đâu

- Vị trí: `$.sections[8].blocks[3]` (`tip.lay-doan-bang-compa`).
- Nguồn: —
- Vấn đề: đã thử cạnh 1, 3, 4, 6, 7: đoạn lấy được bằng cạnh chỉ khi kim đặt ở A rồi ở B; mẹo không nói chỗ đặt kim.
- Sửa: "Mở compa bằng cạnh AB một lần. Đặt kim ở A rồi ở B, chấm điểm trên hai đường vuông góc."

### 23. Nhiễu "Hình có năm cạnh" vô lý

- Vị trí: `$.exercises[46].options[3]` (`ex.kiem-bon-canh-bon-goc`, id `canh`). LL-14.
- Nguồn: —
- Vấn đề: đề nói rõ "bốn cạnh", nhiễu "năm cạnh" không ai chọn.
- Sửa: thay bằng nhiễu theo chỗ bé hay phân vân, vd "Chưa biết, phải đo thêm hai đường chéo", `wrong`: "Bốn cạnh bằng nhau và bốn góc vuông là đủ để biết đó là hình vuông." Không dùng "Hình chữ nhật" hay "Hình thoi" làm nhiễu (hình vuông cũng là hai hình đó, thành hai đáp án đúng).

### 24. Câu luyện thẻ `ve-hinh-vuong` dùng đúng số 4 cm của hình mẫu

- Vị trí: `$.exercises[43]` (`ex.lay-doan-bao-nhieu`) so với `visual.ve-hv-cac-buoc`, `visual.ve-hv-quy-tac`. LL-07.
- Nguồn: —
- Vấn đề: câu ôn hỏi cạnh 4 cm, đúng số của hình chạy từng bước và hình recap; bé nhớ số chứ không nhớ quy tắc.
- Sửa: đổi sang 2 cm, nhiễu 1, 3, 4.

## Góp ý

### 1. Lời `wrong` cho 45° chưa nói vì sao bé dễ chọn

- Vị trí: `$.exercises[16].explain.wrong[1]` (`ex.cheo-goc-bang-bao-nhieu`, lựa chọn `a`).
- Nguồn: —
- Vấn đề: "Góc 45° là góc nhỏ" không giúp phân biệt góc giữa đường chéo và cạnh với góc ở chỗ hai đường chéo cắt nhau.
- Sửa: "Góc 45° là góc giữa đường chéo và cạnh. Còn ở chỗ hai đường chéo cắt nhau là góc vuông 90°."

### 2. Hình chạm đo đường chéo không cho biết cạnh dài bao nhiêu

- Vị trí: `visual.do-duong-cheo-vuong`.
- Nguồn: —
- Vấn đề: 4,2 cm đúng với cạnh 3 cm (3 · 1,414 ≈ 4,24), nhưng hình không ghi cạnh nên bé không biết số đến từ đâu.
- Sửa: ghi "Hình vuông ABCD cạnh 3 cm" trong lời dẫn hay nhãn hình (làm cùng Nghiêm trọng 4).

### 3. `whyItMatters` chưa nối chặt với kiến thức của bài

- Vị trí: `$.overview.whyItMatters`.
- Nguồn: —
- Vấn đề: gạch chữ nhật cũng xếp khít, nên câu chưa chỉ ra bé dùng điều gì của bài.
- Sửa: "Bạn dùng bài này khi kiểm tra một viên gạch có thật là hình vuông không: đo bốn cạnh bằng nhau và xem bốn góc có vuông không."

### 4. Từ "thoả" trong lời giải thích

- Vị trí: `$.exercises[2].explain.text` (`ex.chon-hinh-deu`). LL-19.
- Nguồn: —
- Vấn đề: từ khó với bé.
- Sửa: "có đủ cả hai điều đó" (đổi cùng Nghiêm trọng 1).

### 5. Bảng vẽ: độ mở compa bằng nửa cạnh cho "tam giác" dẹt mà không báo

- Vị trí: `construction.ts` `apexOf`, `src/visuals/shared/plane/geometry.ts` `meetingPoints`, `construct.tsx` `apexMissing`.
- Nguồn: đọc mã.
- Vấn đề: cạnh 6, độ mở 3 thì hai cung chỉ chạm tại trung điểm; nút "Điểm F" bấm được và "Nối" vẽ đường nằm trên cạnh. Chấm vẫn đúng, nhưng hình dẹt dễ làm bé rối.
- Sửa: coi `open * 2 <= len` là "chưa gặp nhau", hiện "Hãy mở compa rộng hơn".

### 6. Mẹo "Độ mở compa" chưa có chỗ thực hành trên màn

- Vị trí: `$.sections[7].blocks[3]` (`tip.mo-compa-mot-lan`).
- Nguồn: —
- Vấn đề: đã thử cạnh 2, 3, 5, 6, 7: mẹo đúng. Nhưng bảng vẽ chỉ có một ô "Mở compa" cho cả hai cung, nên lỗi mẹo phòng không xảy ra trên màn.
- Sửa: thêm "khi vẽ trên giấy" vào text, hoặc một câu hỏi chuyện gì xảy ra khi cung thứ hai mở rộng hơn.

### 7. `mo-compa-bao-nhieu` dùng lại cạnh 5 cm của hình mẫu

- Vị trí: `$.exercises[38].prompt[0].text` (`ex.mo-compa-bao-nhieu`). LL-07.
- Nguồn: —
- Vấn đề: hình chạy từng bước phần 8 vẽ cạnh 5 cm, câu ôn hỏi 5 cm (câu một bước).
- Sửa: đổi sang 4 cm (nhiễu 2, 4, 6, 8; lời sai cho 2 cm: hai cung chỉ chạm nhau, chưa cắt nhau) hoặc 7 cm.

### 8. `can-may-mieng`: "cần mấy" có thể hiểu là số nhỏ nhất

- Vị trí: `$.exercises[31].prompt[0].text` (`ex.can-may-mieng`). LL-10.
- Nguồn: —
- Vấn đề: 24 miếng cũng ghép được; lựa chọn không có 24 nên vẫn một đáp án, nhưng đề nên gắn với cách ghép đã dạy.
- Sửa: "Ghép quanh một điểm, cần mấy hình tam giác đều bằng nhau để được một hình lục giác đều?"

### 9. Lựa chọn của 4.4b lặp chữ "đều" hai nghĩa

- Vị trí: `$.exercises[67].options` (`ex.sbt-4-4b`, `ca-hai`, `khong`). LL-19.
- Nguồn: —
- Vấn đề: "… đều là tam giác đều", "… đều không phải tam giác đều": bé đọc chậm dễ vấp.
- Sửa: "Tam giác MPR và tam giác NQS cùng là tam giác đều", "… cùng không phải tam giác đều".

### 10. "Hình này" trong lời giải thích câu dẫn 4.1

- Vị trí: `$.exercises[55].explain.text` (`ex.dan-4-1-chon-tam-giac-deu`). LL-26.
- Nguồn: —
- Vấn đề: "Hình này quay đầu xuống" hiện cả khi bé chọn sai; không rõ chỉ hình nào.
- Sửa: "Hình tam giác quay đầu xuống vẫn có ba cạnh bằng nhau, nên là hình tam giác đều."

### 11. Nhãn loại của mẹo "Kiểm tra góc vuông"

- Vị trí: `$.sections[9].blocks[3].kind` (`tip.goc-to-giay`).
- Nguồn: —
- Vấn đề: đã thử góc 45°, 60°, 90°, 120°: mẹo đúng; nhưng đây là cách thay êke, không làm nhanh hơn.
- Sửa: cân nhắc "hiểu nhanh", hoặc giữ nhãn và sửa `title` thành "Không có êke".

### 12. Hình lời giải 4.5a nhiều cung, không có chữ

- Vị trí: `visual.sbt-4-5a-giai`. LL-15.
- Nguồn: —
- Vấn đề: hai cung không có dòng chữ, bé khó biết cung nào nói gì.
- Sửa: chuyển thành `steps` hai khung: "Kim ở A: đầu bút chạm B và C, nên AB = AC", "Kim ở B, mở bằng BA: đầu bút đi quá C, nên BC ngắn hơn".

### 13. Hình gợi ý 4.4b giải trọn tam giác ACE

- Vị trí: `$.exercises[67].hints.hintVisualId` (`visual.sbt-4-4b-goi-y`); đã xét `$.exercises[64].hints.hintVisualId` (`luc-giac-cheo-quy-tac`): đạt. LL-02.
- Nguồn: —
- Vấn đề: hình dùng lục giác khác tên nên không lộ đáp án của đề (đạt theo luật 3 nấc), nhưng giải trọn ACE, bé chỉ cần áp sang MPR.
- Sửa: tuỳ tác giả: vẽ AC, CE, EA và ghi "AC, CE, EA có bằng nhau không? ?" thay cho vạch bằng nhau.
