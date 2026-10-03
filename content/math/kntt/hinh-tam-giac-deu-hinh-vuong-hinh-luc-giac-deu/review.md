# Review: Hình tam giác đều. Hình vuông. Hình lục giác đều (`hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu`)

- Bài: `content/math/kntt/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/lesson.json`
- Vòng: 2 - toàn bài, 4 reviewer song song + tổng hợp (nhóm 1: tổng quan, phần 1–4; nhóm 2: phần 5–8; nhóm 3: phần 9–11; nhóm 4: phần 12 bài tập sách bài tập)
- Nguồn đã đọc: `sources/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/` - sbt-p63, sbt-p64, sbt-p65, sbt-p66, sbt-p115
- `content:check`: 0 lỗi, 1 cảnh báo của bài (111 id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): chạy sau bản sửa vòng 2
- `lesson:walk`: 0 FAIL, 0 cảnh báo (ba thiết bị, HEAD 251f8aa), ảnh trong `.shots/walk/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/`
- Kết luận: Chưa đạt: còn 4 lỗi Nghiêm trọng. Đã chạy `content:hash --mark`, bài giữ `draft`.
- Bản đã review: `48afa02447e8bf09c46f29b9d1687f3485ead0ca3e3f9e7f2d54442007e738ba` (`pnpm content:diff` so với bản này)

Quyết định của điều phối ở vòng này:
- Các bước vẽ hình tam giác đều bằng thước và compa (phần 8) và hình vuông bằng thước và êke (phần 9) là nội dung chuẩn SGK KNTT lớp 6 Bài 18, dù trang sách bài tập không in; giữ. Reviewer nhóm 2 và nhóm 3 đã kiểm chúng đúng toán và khớp cách SGK (tam giác: vẽ AB, cung tâm A và cung tâm B bán kính AB, nối C; hình vuông: vẽ AB, êke dựng vuông góc tại A và B, lấy AD = BC = AB, nối DC). Chủ dự án có thể đưa trang SGK sau để đối chiếu chính xác. Nên sửa 1 vòng 1 (`sourceRef` phần 8, 9) đóng theo quyết định này.
- Nhiễu bài 4.7a (Nên sửa 12 dưới đây) sửa bằng cách thêm tên vào glossary hoặc chọn nhiễu khác qua lint.

## Trạng thái các mục vòng 1

| Mục vòng 1 | Trạng thái |
|---|---|
| Nghiêm trọng 1 ("hình đều") | Đã sửa. Chữ mới của `ex.hinh-deu-la-gi` sinh lỗi mới (Nghiêm trọng 4); aria-label huy hiệu còn chữ cũ (Góp ý 3) |
| Nghiêm trọng 2 ("tâm", đường chéo phụ ba cách nói) | Đã sửa (phần 6 và phần 12) |
| Nghiêm trọng 3 ("sáu cạnh, nên là lục giác đều") | Đã sửa |
| Nghiêm trọng 4 (nhãn 4,2 cm bị cạnh cắt) | Đã sửa ở `do-duong-cheo-vuong`; hình cùng kiểu `do-cheo-chinh` của phần 6 chưa sửa (Nghiêm trọng 2) |
| Nghiêm trọng 5 (`hai-cung-gap-nhau` thiếu điều kiện) | Đã sửa |
| Nghiêm trọng 6 ("hai ô liền nhau") | Đã sửa |
| Nghiêm trọng 7 (gợi ý 4.5a bị cắt, thiếu tên) | Đã sửa |
| Nghiêm trọng 8 (chép Ví dụ 1) | Đã sửa (`dem-cung-lam`, `dan-4-7b-tam-giac-chia-9`); vòng chạm mới chồng nhau (Nên sửa 6) |
| Nên sửa 1 (`sourceRef` phần 4, 6, 8, 9) | Phần 4, 6 đã sửa; phần 8, 9 đóng theo quyết định của điều phối |
| Nên sửa 2 (đường chéo ba cách nói) | Đã sửa; `overview.goals[1]` còn "của từng hình" (Nghiêm trọng 3) |
| Nên sửa 3 (phần 1 và phần 10 nói khác nhau) | Đã sửa |
| Nên sửa 4 (màu khái niệm trong `tex`, hình lời giải) | Đã sửa trong `tex` và các hình đã nêu; còn ba hình lệch màu (Nên sửa 11) |
| Nên sửa 5 (khoá React trùng) | Đã sửa (walk không còn huy hiệu "Issues") |
| Nên sửa 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 | Đã sửa |
| Nên sửa 16 (bảng vẽ nhỏ) | Sửa một phần: iPad đạt, điện thoại vẫn 188px (Góp ý 12) |
| Nên sửa 17 (4.2 không có lời giải sách) | Ghi nhận; đã tự giải lại, validator và `explain` đúng |
| Nên sửa 18, 19 | Đã sửa |
| Nên sửa 20 (nhiễu 4.7a đếm chữ cái) | Chưa sửa (Nên sửa 12) |
| Nên sửa 21 (bảng vẽ báo "làm xong" khi sai) | Sửa một phần (Nên sửa 1, Nên sửa 2) |
| Nên sửa 22, 24 | Đã sửa |
| Nên sửa 23 (nhiễu "năm cạnh") | Đã sửa; hai nhiễu khác của phần 10 vẫn yếu (Nên sửa 8) |
| Góp ý 1 (`wrong` 45°) | Đã đổi theo câu "Sửa" của vòng 1, nhưng câu đó dạy điều ngoài sách (Nghiêm trọng 1) |
| Góp ý 2 đến 13 | Đã sửa |

## Nghiêm trọng

### 1. Lời `wrong` mới dạy "góc giữa đường chéo và cạnh là 45°", không có trong sách

- Vị trí: `$.exercises[16].explain.wrong[1].text` (`ex.cheo-goc-bang-bao-nhieu`, lựa chọn `a`). LL-20, LL-09.
- Nguồn: tr.63 (`sbt-p63.png`) chỉ có "bốn góc bằng nhau và bằng 90°; hai đường chéo bằng nhau"; tr.65 bài 4.3 và tr.115 chỉ có "vuông góc". Không trang nào nói góc giữa đường chéo và cạnh.
- Vấn đề: câu "Góc 45° là góc giữa đường chéo và cạnh" là câu "Sửa" của Góp ý 1 vòng 1, tác giả chép vào. Nó nêu một số đo mới mà bé không suy ra được ở lớp 6 (cần tam giác vuông cân, tổng ba góc), không bài tập nào cần, không có chữ nào trên trang. Bé chậm dễ nhớ 45° như thêm một quy tắc của hình vuông.
- Sửa: "Góc 45° nhỏ hơn góc vuông, mà hai đường chéo cắt nhau thành góc vuông 90°." (cùng kiểu lời `wrong` của 45° ở `ex.goc-hinh-vuong`). Sửa cùng lúc `wrong[2]` theo Góp ý 2.

### 2. Nhãn "6 cm" ở hình chạm đo đường chéo chính bị cạnh AB cắt, hai nhãn nằm sát cạnh CD, BC nên đọc thành độ dài cạnh

- Vị trí: `visual.do-cheo-chinh` (`catalog.ts`, `parts` với `at: 0.15`, không `textAt`), dùng ở `$.sections[5].blocks[2].children[1]` (`section.duong-cheo-luc-giac`). LL-12, LL-15.
- Nguồn: walk `089-s6-03-block-shown.png` (iPad dọc, điện thoại, iPad ngang).
- Vấn đề: sau khi đo, chữ "6" của AD chạm nét cạnh AB (trên điện thoại "6 cm" bị cạnh cắt mép trái); nhãn của CF nằm ngay dưới cạnh CD, nhãn của BE ngay dưới cạnh BC, nên bé dễ đọc "CD = 6 cm", "BC = 6 cm", trong khi màn phần 5 ngay trước cho bé đo chính hình này với cạnh 3 cm. Đây là màn bé "thấy" ba đường chéo chính bằng nhau, số gắn sai đường làm bé nhớ sai. Cùng kiểu Nghiêm trọng 4 vòng 1 mà bản sửa chỉ làm cho hình vuông.
- Sửa: làm như bản sửa của `do-duong-cheo-vuong`: `textAt` cho ba phần thành ba dòng dưới hình "AD = 6 cm", "BE = 6 cm", "CF = 6 cm" (chữ `text` ghi kèm tên đoạn, tăng `h` của hình cho đủ chỗ). Chỉ sửa trong `catalog.ts` của bài. Chụp lại `visual:shot` và walk điện thoại, tự xem ảnh.

### 3. Mục tiêu tổng quan nói hình tam giác đều cũng có đường chéo

- Vị trí: `$.overview.goals[1]` ("biết cạnh, góc và đường chéo (đoạn nối hai đỉnh không nằm cạnh nhau) của từng hình"). LL-10.
- Nguồn: tr.63 (`sbt-p63.png`): đường chéo chỉ nêu ở hình vuông và hình lục giác đều.
- Vấn đề: "của từng hình" gồm cả hình tam giác đều, mà tam giác không có hai đỉnh nào không nằm cạnh nhau. Tổng quan là chữ đầu tiên bé đọc, câu này nói một điều sai trước khi bài bắt đầu. Nhóm 1 và nhóm 2 cùng nêu ở mức Nên sửa; Tổng hợp nâng lên Nghiêm trọng vì checklist trục 2 xếp tổng quan nói sai vào mức này, và phân vân thì chọn mức cao hơn.
- Sửa: "biết cạnh, góc của từng hình và đường chéo của hình vuông, hình lục giác đều" (16 âm tiết; định nghĩa đường chéo đã có ở màn đầu phần 4, bỏ ở đây để khỏi dài).

### 4. Lời `wrong` của `ex.hinh-deu-la-gi` đọc được thành "góc của ba hình bằng nhau"

- Vị trí: `$.exercises[1].explain.wrong[0].text` ("Các góc của cả ba hình bằng nhau, không khác nhau."), `.wrong[1].text`, `.wrong[2].text`, `.explain.text`, `.prompt[0].text` (`ex.hinh-deu-la-gi`, câu kiểm tra phần 1). LL-20, LL-10.
- Nguồn: tr.63 (`sbt-p63.png`): ba góc 60°, bốn góc 90°, sáu góc 120°.
- Vấn đề: câu mới của bản sửa vòng 1 nói về cả ba hình gộp lại, nên đọc thẳng là góc của hình tam giác đều bằng góc của hình vuông và hình lục giác đều, trái 60°, 90°, 120° bé học ở phần 2, 3, 5. Theo checklist trục 2, một lý do `wrong` nói sai là Nghiêm trọng; nhóm 1 ghi Nên sửa, Tổng hợp nâng mức vì câu đọc theo nghĩa đen là sai. Đề "Ba hình trong bài" cũng không nêu tên ba hình (nhóm 1, Góp ý 2, gộp vào đây).
- Sửa: `prompt[0]`: "Hình tam giác đều, hình vuông và hình lục giác đều giống nhau ở điểm nào? Chọn câu đúng." `explain.text`: "Trong mỗi hình, các cạnh bằng nhau và các góc bằng nhau." `wrong[0]`: "Trong mỗi hình, các góc bằng nhau chứ không khác nhau." `wrong[1]`: "Trong mỗi hình, các cạnh bằng nhau chứ không khác nhau." `wrong[2]`: "Trong mỗi hình, các cạnh bằng nhau, nên không có cạnh dài cạnh ngắn." Tìm cụm "cả ba hình" trong cả `lesson.json` và `catalog.ts` rồi sửa cùng cách.

## Nên sửa

### 1. Bảng vẽ "Cùng làm" phần 8, 9: chọn cạnh khác số đề cho thì bảng nói "Bạn đã làm xong mọi bước." mà "Tiếp" không mở

- Vị trí: `construct.tsx` `warningOf` (nhánh `guided`), dùng ở `visual.ve-td-cung-lam` (`$.sections[7].blocks[2].children[1]`, `goal: 3`) và `visual.ve-hv-cung-lam` (`$.sections[8].blocks[2].children[1]`).
- Nguồn: đọc mã `construct.tsx`, `shared/plane/board.tsx` (dòng chữ mặc định khi hết bước).
- Vấn đề: ở màn bài học `warningOf` chỉ báo khi độ mở khác cạnh (tam giác) hay đoạn lấy thêm khác cạnh (hình vuông). Bé chọn cạnh 4, compa 4 rồi bấm đủ: không cảnh báo, dòng chỉ dẫn hiện "Bạn đã làm xong mọi bước.", nhưng `met` đòi cạnh 3 nên "Tiếp" khoá và không có lời kết. Bé không biết sai ở đâu. Phần còn lại của Nên sửa 21 vòng 1.
- Sửa (trong tệp của bài): nhánh `guided`, khi `len !== spec.goal` trả `{ text: "Cạnh AB phải dài 3 cm.", blocks: "apex" }` cho tam giác và `blocks: "join"` cho hình vuông (tên cạnh, số lấy từ `spec.names`, `spec.goal`). Thêm test cho trạng thái `{ len: 4, open: 4, arcM: 1, arcN: 1, apex: 1, join: 1 }` ở màn bài học.

### 2. Bảng vẽ ở câu hỏi: "Bạn đã bấm đủ các bước. Hãy bấm Kiểm tra." in màu cảnh báo và còn hiện sau khi đã chấm đúng

- Vị trí: `construct.tsx` `warningOf` (nhánh `!guided && current === undefined`); lộ ở `visual.ve-td-tap-lam` (`$.exercises[37]`), `visual.ve-hv-tap-lam` (`$.exercises[42]`), `visual.sbt-4-2-ve` (`$.exercises[60]`), `visual.sbt-4-3-ve` (`$.exercises[62]`). Nhóm 2, 3, 4 cùng nêu.
- Nguồn: walk `126-s8-07-…-wrong1.png`, `129-…-correct.png`, `143-s9-07-exercise-ve-hinh-vuong-efgh-6-correct.png`, `198-s12-10-exercise-sbt-4-2-correct.png`.
- Vấn đề: câu trung tính đi qua kênh `warning` nên `Board` tô chữ đậm màu `retry`. Ở ảnh `correct`, lời khen đi cùng dòng đỏ "Hãy bấm Kiểm tra."; ở ảnh `wrong3` khung đã hiện lời giải mà dòng đỏ vẫn bảo bấm Kiểm tra. Bé chậm đọc màu đỏ là "sai".
- Sửa: cần mã dùng chung: thêm vào `Board` (`src/visuals/shared/plane/board.tsx`) một prop chữ kết trung tính khi hết bước (vd `finished`), không tô màu `retry`, ẩn khi khung đã chấm; `construct.tsx` dùng prop đó thay `warning`. Tệp này Bài 19 đang sửa: làm sau khi phiên Bài 19 xong tệp, hoặc báo người làm Bài 19 thêm prop rồi Bài 18 chỉ đổi `construct.tsx`. Trong riêng các tệp của Bài 18 không có cách sạch: cách duy nhất là bỏ `warning` ở nhánh này để hiện chữ mặc định "Bạn đã làm xong mọi bước.", mà chữ đó lại nói "xong" khi chưa đúng (lỗi Nên sửa 21 vòng 1); không dùng cách này.

### 3. Đề `ex.noi-vat-voi-hinh` không có hình của ba vật

- Vị trí: `$.exercises[0].prompt` (`ex.noi-vat-voi-hinh`), `$.exercises[0].hints.hintVisualId`. LL-10.
- Nguồn: —
- Vấn đề: màn câu hỏi chỉ có chữ "Gạch lát nền", "Tổ ong", "Biển báo nguy hiểm". Gạch lát nền ngoài đời có nhiều hình (chữ nhật, lục giác), nên chỉ đọc chữ bé không chắc gạch là hình vuông; hình `doi-song-ba-vat` chỉ hiện ở nấc 2 sau hai lần sai.
- Sửa: thêm khối `visual` `doi-song-ba-vat` vào `prompt`, đề "Nối mỗi vật trong hình với hình của nó."; nấc 1 tô khối hình đó (`target: "block", index: 1`); nấc 2 đổi sang `ba-hinh-deu` (ba hình có tên, không nối sẵn với vật nào) hoặc bỏ `hintVisualId`.

### 4. Nhiễu "Chỉ có bốn cạnh" của `lg-chon-cau-dung` vô lý

- Vị trí: `$.exercises[23].options[3]` (`ex.lg-chon-cau-dung`, id `bon-canh`). LL-14.
- Nguồn: —
- Vấn đề: tên hình là "lục giác", bé vừa đếm sáu cạnh ở ba màn liền; câu chọn nhiều đáp án chỉ còn một nhiễu thật (90°).
- Sửa: thay bằng "Mỗi góc bằng 60°", `wrong`: "Góc 60° là góc của hình tam giác đều, còn mỗi góc của hình lục giác đều bằng 120°." Không dùng điều của phần sau (đường chéo chính gấp đôi cạnh) vì câu gắn thẻ phần 5 (LL-09).

### 5. Quy tắc vẽ hình vuông không nói lấy hai đoạn về cùng một phía

- Vị trí: `$.sections[8].blocks[1].children[0]` (`rule: true`), `$.sections[8].recap.caption`, `$.cards[8].recap.caption`, khối "Nhắc lại" `$.sections[11].blocks[1].children[2]`; mẹo `$.sections[8].blocks[3]` (`tip.lay-doan-bang-compa`); mục `lay` của `$.exercises[40]` (`ex.xep-buoc-ve-hinh-vuong`). LL-17.
- Nguồn: cách vẽ chuẩn SGK KNTT 6 Bài 18 (lấy AD = BC = AB, C và D cùng phía với AB).
- Vấn đề: làm đúng từng chữ "Trên hai đường ấy, lấy hai đoạn bằng cạnh đã vẽ rồi nối hai điểm vừa lấy" mà lấy D phía trên, C phía dưới AB thì DC cắt ngang AB, không ra hình vuông. Bảng vẽ và mọi hình đều vẽ cùng phía nên trên màn không sai, nhưng vẽ trên giấy (bài 4.3, bài kiểm tra) bé chỉ có câu quy tắc để nhớ. Giữ Nên sửa vì mọi hình của bài đều cho thấy cùng phía.
- Sửa: câu thứ hai thành "Trên hai đường ấy, về cùng một phía, lấy hai đoạn bằng cạnh đã vẽ rồi nối hai điểm vừa lấy." (21 âm tiết); recap phần, recap thẻ, khối "Nhắc lại" đổi nguyên văn theo. Mục `lay`: "Lấy hai đoạn bằng cạnh, cùng một phía, trên hai đường ấy". Mẹo: "… Đặt kim ở A rồi ở B, chấm hai điểm cùng một phía trên hai đường vuông góc."

### 6. Màn "Cùng làm" phần 11: vòng "?" của DGH trùng vòng của tam giác nhỏ ở giữa, bốn vòng nhỏ chồng vùng chạm

- Vị trí: `visual.dem-cung-lam` (`catalog.ts`, `parts[3]` P1P2P3 và `parts[4]` DGH), dùng ở `$.sections[10].blocks[2].children[1]` (`section.dem-hinh`). LL-12, LL-15.
- Nguồn: walk iPad và điện thoại `163-s11-03-block.png`.
- Vấn đề: `bubbleOf` (`probe-model.ts`) đặt vòng của phần `poly` ở trọng tâm các đỉnh; trọng tâm DGH trùng trọng tâm tam giác ngược P1P2P3, nên màn chỉ thấy 7 vòng và một nút cho "Đã tô 0/9". Chạm vòng giữa tam giác nhỏ thì cả DGH được tô (vẽ sau, nằm trên), rồi vòng cũ lại hiện đúng chỗ đó. Trên điện thoại bốn vòng của bốn tam giác nhỏ cách nhau khoảng 28pt, vùng chạm 48pt chồng nhau.
- Sửa: cách sạch cần mã dùng chung: thêm vào `ProbePart` kiểu `poly` một trường tuỳ chọn vị trí vòng (vd `at?: Pt`, mặc định vẫn trọng tâm nên không đổi hình nào của Bài 19), rồi trong `catalog.ts` của Bài 18 đặt vòng DGH sát đỉnh D. Tệp `probe-model.ts` nằm trong `src/visuals/shared/plane/` mà Bài 19 đang sửa: làm sau khi phiên Bài 19 xong, hoặc nhờ phiên đó thêm trường. Trong riêng tệp của Bài 18 chỉ làm được phần cỡ hình: tăng `side` hoặc bớt khoảng trống `h` của `dem-cung-lam` để bốn vòng nhỏ cách nhau từ 48pt; phần trùng vòng DGH không sửa được mà không đụng mã chung. Chụp lại walk điện thoại.

### 7. Vòng "?" của góc chồng vòng "?" của cạnh ở hai hình chạm kiểm tra

- Vị trí: `visual.kiem-hinh-thoi-efgh` (góc E với cạnh EF, HE; `$.exercises[47].prompt[1]`, `ex.kiem-mot-goc-khong-vuong`), `visual.kiem-cung-lam` (góc A với cạnh DA; `$.sections[9].blocks[2].children[1]`). LL-12.
- Nguồn: walk `phone/156-s10-07-exercise-kiem-mot-goc-khong-vuong.png`, `149-s10-03-block.png`.
- Vấn đề: ba vòng quanh E cách nhau khoảng 37–39pt trên điện thoại, vùng chạm 48pt chồng nhau; bé chạm góc dễ trúng cạnh.
- Sửa (trong `catalog.ts` của bài): đặt `at` của phần `seg` xa góc đo (vd 0,65 cho EF, HE theo chiều từ E), tăng cạnh hình thoi (vd 130) để các vòng cách nhau từ 48pt. Không đổi `ANGLE_BUBBLE` (mã dùng chung). Chụp lại walk điện thoại.

### 8. Nhiễu vô lý ở hai câu "Đó là hình nào?" của phần 10

- Vị trí: `$.exercises[49].options` (`ex.kiem-compa-ba-canh`, nhiễu `vuong`, `lg`), `$.exercises[46].options` (`ex.kiem-bon-canh-bon-goc`, nhiễu `td`, `lg`). LL-14.
- Nguồn: —
- Vấn đề: đề đã nói "một hình tam giác" (hay "bốn cạnh"), nên "Hình vuông", "Hình lục giác đều" (hay "Hình tam giác đều", "Hình lục giác đều") không ai chọn; mỗi câu chỉ còn hai lựa chọn thật, không luyện chỗ bé hay phân vân ở phần này (có cần kiểm góc, có cần so lại cạnh không).
- Sửa: `kiem-compa-ba-canh`: thay `vuong`, `lg` bằng một lựa chọn "Chưa biết, phải dùng êke kiểm tra thêm các góc", `wrong`: "Với hình tam giác, ba cạnh bằng nhau là đủ. Không cần kiểm góc." `kiem-bon-canh-bon-goc` đã có nhiễu `canh` "Chưa biết, phải đo thêm hai đường chéo": thay `td`, `lg` bằng một lựa chọn "Chưa biết, phải so thêm các cạnh bằng compa", `wrong`: "Đề đã cho bốn cạnh bằng nhau rồi." (câu còn ba lựa chọn). Không dùng "Hình chữ nhật", "Hình thoi" (hình vuông cũng là hai hình đó).

### 9. Nhiễu "Đoán số hình vuông" vô lý, lựa chọn đúng lộ vì dài và lặp câu quy tắc

- Vị trí: `$.exercises[54].options` (`ex.dem-cach-dem-dung`, id `doan`, `dung`). LL-14.
- Nguồn: —
- Vấn đề: không bé nào chọn "Đoán"; lựa chọn đúng là câu dài nhất và gần nguyên văn câu quy tắc nên chọn được mà không hiểu.
- Sửa: thay `doan` bằng "Đếm các ô vuông nhỏ rồi cộng thêm 1 cho hình lớn nhất", `wrong`: "Có thể có nhiều hình vuông lớn hơn, như mặt sàn hai hàng ba ô có 2 hình. Phải đếm từng hình." Rút gọn lựa chọn đúng cho độ dài gần các lựa chọn khác, vd "Đếm hình nhỏ, rồi đếm thêm hình lớn ghép từ chúng".

### 10. Câu kho ôn `canh-thu-tu-7` gần trùng câu phần 3 và không luyện kỹ năng của thẻ vẽ hình vuông

- Vị trí: `$.exercises[44]` (`ex.canh-thu-tu-7`, `cardIds` `card.ve-hinh-vuong`) so với `$.exercises[10]` (`ex.canh-ab-7`). LL-07.
- Nguồn: —
- Vấn đề: cùng số 7, cùng phép suy "bốn cạnh bằng nhau"; câu dẫn `dan-4-3-ve-7` cũng vẽ hình vuông 7 cm. Thẻ `ve-hinh-vuong` có ba câu ôn mà câu này không hỏi gì về cách vẽ.
- Sửa: thay bằng câu `choice` về bước vẽ với tên mới: "Bạn đã vẽ cạnh MN và hai đường vuông góc ở M và N. Bước tiếp theo là gì?", lựa chọn "Lấy hai đoạn bằng MN, cùng một phía, trên hai đường ấy" (đúng, khớp câu quy tắc sau khi sửa Nên sửa 5), "Nối M với N lần nữa", "Vẽ hai cung tròn từ M và N", `wrong` cho từng nhiễu.

### 11. Ba hình dùng màu của khái niệm khác: viền hình vuông lớn, đường chéo phụ, vạch bằng nhau trên đường chéo

- Vị trí: `visual.dem-cac-buoc` (khung cuối, `outlined` `amber`), `visual.dem-quy-tac` (`amber`; cũng là recap `$.sections[10].recap`, `$.cards[10].recap`), `visual.dem-luoi-giai` (`amber`, `blue`; lời giải `$.exercises[51]`), `visual.dem-cung-lam` (nút "Cả hình lớn DEF" `amber`); `visual.sbt-4-4a-giai` (`figure45({ tone: "teal", boldSecondary: true, … })`, lời giải `$.exercises[64]`); `equalDiagonals` (`tone: "blue"`) trong `visual.hinh-vuong-cheo-cac-buoc` khung cuối và `visual.hinh-vuong-cheo-quy-tac` (màn quy tắc, recap phần 4, thẻ). Nhóm 1 (Góp ý), nhóm 3 và nhóm 4 (Nên sửa) cùng kiểu, gộp ở mức cao hơn. LL-03.
- Nguồn: walk `057-s4-01-block-end`, `058-s4-02-block`; `visual:shot` `sbt-4-4a-giai-ipad.png`.
- Vấn đề: bài gán blue cho "Cạnh", amber cho "Đường chéo", teal cho "Hình tam giác đều", pink cho "Hình vuông". Hình vuông lớn ở phần 11 mang amber và blue, tam giác DEF mang amber, trái `tex` `\concept{pink}{8}` vừa sửa; đường chéo phụ ở lời giải 4.4a mang teal; vạch bằng nhau trên đường chéo mang blue, bé có thể tưởng đó là cạnh.
- Sửa (đều trong `catalog.ts` của bài): viền hình vuông lớn `pink` (hai hình ở `dem-luoi-giai` cùng `pink`, khác kiểu nét: một liền, một đứt); nút "Cả hình lớn DEF" `teal`; `sbt-4-4a-giai` tô sáu đường chéo phụ `amber` đậm, ba đường chéo chính nét đứt xám; `equalDiagonals` dùng `amber` hoặc `ink`. Chụp lại các hình.

### 12. Nhiễu của bài 4.7a vẫn loại được bằng cách đếm chữ cái

- Vị trí: `$.exercises[74].options[2]`, `.options[3]`, `.explain.wrong` (`ex.sbt-4-7a`). LL-14.
- Nguồn: tr.66 bài 4.7a, Hình 4.8 (`sbt-p66.png`); lời giải tr.115.
- Vấn đề: còn từ Nên sửa 20 vòng 1. Hỏi hình lục giác đều mà hai nhiễu "ACE", "BDF" chỉ có ba chữ, bé loại ngay mà không cần quy tắc.
- Sửa (theo quyết định của điều phối): thay hai nhiễu bằng hình sáu cạnh có thật trong Hình 4.8 nhưng không đều. Nhóm 4 đã dò: chỉ ABCDEF và MNPQRS lồi và đều. Nhiễu 1 `acndfr` "ACNDFR" (AC trên AC, CN trên CE, ND trên BD, DF trên DF, FR trên FB, RA trên AE; AC, DF dài gấp ba CN), `wrong`: "ACNDFR có sáu cạnh, nhưng cạnh AC dài hơn cạnh CN." Nhiễu 2 `aepdbs` "AEPDBS", `wrong`: "AEPDBS có sáu cạnh, nhưng cạnh AE dài hơn cạnh EP." Thêm hai tên vào `names` của `content/glossary/math.json` khi không còn phiên nào khác sửa tệp đó; nếu không thêm được thì chọn nhiễu khác mà lint `[vietnamese]` cho qua. Không dùng thứ tự đỉnh xáo của ABCDEF hay MNPQRS (chỉ khác đáp án ở thứ tự chữ: bẫy).

### 13. Hình gợi ý 4.2 và 4.3 dùng đúng tên điểm của đề với độ dài khác đề

- Vị trí: `$.exercises[60].hints.hintVisualId` (`ex.sbt-4-2`, `visual.sbt-4-2-goi-y`), `$.exercises[62].hints.hintVisualId` (`ex.sbt-4-3`, `visual.sbt-4-3-goi-y`). LL-15.
- Nguồn: walk `196-s12-10-exercise-sbt-4-2-wrong2.png`; `visual:shot` `sbt-4-2-goi-y-ipad-step-*`, `sbt-4-3-goi-y-ipad-step-*`.
- Vấn đề: đề "MN = 4 cm" (4.3: "DE = 5 cm"), hình gợi ý ghi "Vẽ cạnh MN dài 3 cm", "Mở compa bằng 3 cm" (4.3: "Lấy DQ và EF cùng dài 3 cm"). Cùng tên đoạn mà hai số trên một màn: bé dễ chỉnh bảng vẽ về 3 cm hay nghĩ đề sai.
- Sửa: hình gợi ý đặt tên khác đề (tam giác ABC cạnh 3 cm "Vẽ cạnh AB dài 3 cm"; hình vuông ABCD cạnh 3 cm), nhãn `label` đổi theo; vẫn dừng trước điểm thứ ba, trước hai đường chéo.

### 14. Hình đề và hình đo của bài sách nhỏ, tên điểm khoảng 11px

- Vị trí: `visual.sbt-4-4b-do`, `visual.sbt-4-5a-do`, `visual.sbt-4-5b-do`, `visual.sbt-hinh-4-6`, `visual.sbt-hinh-4-8` (`$.exercises[67]`, `[69]`, `[70]`, `[74]`, `[76]`), `visual.sbt-hinh-4-4` (`[57]`). LL-12.
- Nguồn: walk iPad `211-s12-17-exercise-sbt-4-4b.png` (lục giác khoảng 210px trên khung 820px, chữ khoảng 11px, sáu vòng "?" sát nhau), `215-s12-19-exercise-sbt-4-5a.png`, `225-s12-24-exercise-sbt-4-7a.png`.
- Vấn đề: bé phải đọc tên đỉnh để gọi tên đường chéo, so cạnh, đếm tam giác; chữ dưới 16px, hình chiếm khoảng một phần tư bề ngang iPad; ở `sbt-4-4b-do` khó biết vòng nào thuộc đoạn nào.
- Sửa: cho các hình rộng theo khung hoặc tăng `w`, `h` và cỡ chữ tên điểm lên tối thiểu 16px; ở `sbt-4-4b-do` đặt vòng "?" ở khoảng một phần ba đoạn tính từ đỉnh (như `at: 0.28` của `sbt-4-5a-do`). Chụp lại `visual:shot` và walk cả hai cỡ.

### 15. Hai cung compa gặp nhau được gọi ba cách: "gặp nhau", "cắt nhau", "chạm nhau"

- Vị trí: `$.exercises[38].explain.wrong` lựa chọn `a` (`ex.mo-compa-bao-nhieu`: "Compa mở 4 cm thì hai cung tròn chỉ chạm nhau, chưa cắt nhau.") so với câu quy tắc phần 8 `$.sections[7].blocks[1].children[0]` ("chỗ hai cung gặp nhau"), `construction.ts` ("Chấm điểm … ở chỗ hai cung gặp nhau."), `construct.tsx` ("Hai cung chưa gặp nhau. Hãy mở compa rộng hơn." cho đúng trường hợp độ mở bằng nửa cạnh). LL-05.
- Nguồn: —
- Vấn đề: phát hiện của Tổng hợp. Cả bài dùng "gặp nhau" cho chỗ hai cung tạo đỉnh thứ ba, còn "cắt nhau" dành cho hai đường chéo. Lời `wrong` này đổi sang "cắt nhau" cho hai cung, và nói "chạm nhau" ở đúng trạng thái mà bảng vẽ gọi là "chưa gặp nhau". Bé chậm có thể nghĩ "chạm nhau" là "gặp nhau" rồi lấy chỗ chạm làm đỉnh.
- Sửa: "Mở compa 4 cm, bằng nửa cạnh, thì hai cung chỉ chạm nhau ngay trên cạnh. Chúng chưa gặp nhau ở phía trên nên không có đỉnh thứ ba."

## Góp ý

### 1. "Góc vuông" dùng ở phần 2, trước khi phần 3 dạy

- Vị trí: `$.exercises[6].explain.wrong[0].text` (`ex.goc-tam-giac-deu`), `$.exercises[8].explain.wrong[0].text` (`ex.td-chon-cau-dung`). LL-09.
- Nguồn: —
- Vấn đề: câu "Góc 90° gọi là góc vuông" nằm ở phần 3; câu tự giải nghĩa và bé đã gặp góc vuông ở tiểu học, nên chỉ là Góp ý.
- Sửa: `ex.goc-tam-giac-deu`: "Góc 90° lớn hơn 60°, mà mỗi góc của hình tam giác đều chỉ bằng 60°."; `ex.td-chon-cau-dung` đổi cùng kiểu.

### 2. "Góc 120° là góc to"

- Vị trí: `$.exercises[16].explain.wrong[2].text` (`ex.cheo-goc-bang-bao-nhieu`, lựa chọn `d`).
- Nguồn: —
- Vấn đề: "góc to" là lời nói thường; các câu khác của bài dùng "lớn hơn góc vuông".
- Sửa: "Góc 120° lớn hơn góc vuông, còn hai đường chéo cắt nhau thành góc vuông 90°."

### 3. Huy hiệu và chú thích mã còn chữ "hình đều"

- Vị trí: `src/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/sticker.tsx` (`aria-label="Huy hiệu hình đều, …"`), `catalog.ts` (chú thích "1. Hình đều quanh ta").
- Nguồn: —
- Vấn đề: aria-label là chữ trình đọc màn hình đọc cho bé, còn khái niệm đã bỏ ở vòng 1.
- Sửa: aria-label "Huy hiệu ba hình, trong hình lục giác đều có hình tam giác đều và hình vuông"; chú thích "1. Ba hình quanh ta".

### 4. Hình lời giải nấc 3 của `ex.chon-hinh-deu` không chỉ lựa chọn nào đúng

- Vị trí: `$.exercises[2].hints.solutionVisualId` (`ex.chon-hinh-deu`) = `visual.ba-hinh-deu`.
- Nguồn: —
- Vấn đề: hình quy tắc có hình vuông (không có trong lựa chọn) và không đánh dấu hai hình đúng trong bốn lựa chọn.
- Sửa: bỏ `solutionVisualId` (khung tự hiện đáp án) hoặc dùng hình bốn lựa chọn có vạch cạnh, cung góc ở hai hình đúng.

### 5. "Ô trong vở ô li có hình vuông"

- Vị trí: `$.sections[2].blocks[0].children[0].text` (`section.hinh-vuong`).
- Nguồn: —
- Vấn đề: dòng li chia ô to thành hình chữ nhật dẹt; "ô trong vở ô li" đọc được là ô nhỏ.
- Sửa: "Viên gạch lát nền và ô to trong vở ô li có hình vuông."

### 6. Nhiễu "Hai đỉnh trùng nhau" của `cheo-chinh-noi-nao` không ai chọn

- Vị trí: `$.exercises[28].options[3]` (`ex.cheo-chinh-noi-nao`, id `cung`). LL-14.
- Nguồn: —
- Vấn đề: hai đỉnh trùng nhau không nối thành đoạn nào; bé loại ngay.
- Sửa: "Hai đỉnh bất kì của hình", `wrong`: "Nối hai đỉnh bất kì có thể ra một cạnh hay một đường chéo phụ, chưa chắc là đường chéo chính."

### 7. Câu quy tắc phần 8 "vẽ hai cung tròn từ hai đầu cạnh" chưa nói đặt kim compa ở đâu

- Vị trí: `$.sections[7].blocks[1].children[0]` (`rule: true`), `$.sections[7].recap.caption`, `$.cards[7].recap.caption`, khối "Nhắc lại" `$.sections[11].blocks[1].children[1]`; mục `cung` của `$.exercises[35]`. LL-10.
- Nguồn: —
- Vấn đề: "từ hai đầu cạnh" đọc được thành cung bắt đầu từ A và B; bảng vẽ thì nói "Đặt kim compa ở A, vẽ một cung tròn".
- Sửa (giữ hai câu theo giới hạn `note`): "Vẽ một cạnh, mở compa bằng đúng cạnh đó, rồi đặt kim ở từng đầu cạnh vẽ hai cung tròn. Nối chỗ hai cung gặp nhau với hai đầu cạnh." Recap phần, thẻ, khối "Nhắc lại" đổi nguyên văn theo; mục `cung` đổi theo.

### 8. Tên mẹo "Độ mở compa" chưa nêu dạng bài

- Vị trí: `$.sections[7].blocks[3].title` (`tip.mo-compa-mot-lan`).
- Nguồn: —
- Vấn đề: mẹo đúng (nhóm 2 thử cạnh 2 đến 7 với độ mở bằng cạnh, cạnh 6 với độ mở 3, 4, 7), nhưng tên chỉ nêu dụng cụ.
- Sửa: "Vẽ hai cung tròn khi vẽ hình tam giác đều".

### 9. Câu quy tắc phần 7 chưa nói cách ghép

- Vị trí: `$.sections[6].blocks[1].children[0]` (`rule: true`), `$.sections[6].recap.caption`, `$.cards[6].recap.caption`, khối "Nhắc lại" `$.sections[11].blocks[3].children[1]`.
- Nguồn: tr.66 bài 4.6, Hình 4.7.
- Vấn đề: sáu tam giác đều bằng nhau còn ghép được thành hình khác (một dải hình bình hành); câu `can-may-mieng` đã nói "Ghép quanh một điểm" mà câu quy tắc thì chưa.
- Sửa: "Sáu hình tam giác đều bằng nhau ghép quanh một điểm thành một hình lục giác đều. Đường chéo chính của hình lục giác đều dài gấp đôi cạnh." Mọi chỗ lặp nguyên văn đổi theo.

### 10. Hình quy tắc vẽ hình vuông chỉ có hình đã xong, không thấy cách vẽ

- Vị trí: `visual.ve-hv-quy-tac` (`$.sections[8].blocks[1].children[1]`, `$.sections[8].recap`, `$.cards[8].recap`). LL-15.
- Nguồn: walk `134-s9-02-block`, `144-s9-08-recap`.
- Vấn đề: câu quy tắc nói các bước, hình chỉ là hình vuông có vạch và góc vuông, giống hình quy tắc phần 3.
- Sửa: giữ hai đường êke nét đứt kéo quá D và C, vạch bằng nhau trên AB, AD, BC.

### 11. Hình `kiem-hinh-thoi-efgh` ghi "vừa khít" mà không có cạnh mẫu

- Vị trí: `visual.kiem-hinh-thoi-efgh` (`sideProbe` cả bốn cạnh "vừa khít").
- Nguồn: walk `157-s10-07-…-correct`.
- Vấn đề: ở `kiem-cung-lam`, "vừa khít" là so với "cạnh mẫu" AB; ở đây không nói vừa khít với cạnh nào.
- Sửa: đánh dấu EF là cạnh mẫu và chỉ đo FG, GH, HE, hoặc ghi "= EF".

### 12. Bảng vẽ trên điện thoại vẫn nhỏ

- Vị trí: `visual.ve-hv-cung-lam`, `visual.ve-hv-tap-lam` và các bảng vẽ khác (`construct.tsx`, cap 188px trên điện thoại).
- Nguồn: walk `phone/135-s9-03-block.png`, `136-s9-03-block-shown.png`.
- Vấn đề: hình vuông 3 cm chỉ khoảng 45px, số trên thước và tên điểm nhỏ.
- Sửa: trên điện thoại cho bảng rộng theo khung (nâng cap lên khoảng 240px) khi màn còn chỗ; sửa trong `construct.tsx` của bài.

### 13. Hình quy tắc phần 10 và câu `dem-dai-ba-tam-giac` nhỏ trong khung

- Vị trí: `visual.kiem-quy-tac` (`triThumb`, `sqThumb`; cũng là recap phần 10 và phần 12), `visual.dem-dai-ba-tam-giac` (`$.exercises[50].prompt[1]`). LL-12.
- Nguồn: walk iPad `148-s10-02-block`, `165-s11-04-exercise-dem-dai-ba-tam-giac`.
- Vấn đề: hai hình quy tắc khoảng 80px trên iPad; dải ba tam giác khoảng 130px giữa khung trống.
- Sửa: dùng cỡ hình thường thay ảnh thu nhỏ ở `kiem-quy-tac`; thu `h` và khoảng trống của `triangleStrip`.

### 14. Hình đo của 4.5b đứng sau câu lệnh của app

- Vị trí: `$.exercises[70].prompt[1]` (`sbt-hinh-4-6`), `.prompt[3]` ("Chọn đáp án đúng."), `.prompt[4]` (`sbt-4-5b-do`) (`ex.sbt-4-5b`).
- Nguồn: walk `217-s12-20-exercise-sbt-4-5b.png`.
- Vấn đề: câu lệnh của app phải là khối cuối đề; 4.4b và 4.5a đặt hình đo ngay sau "Quan sát Hình …"; màn dài, bé phải cuộn.
- Sửa: chuyển `sbt-4-5b-do` lên ngay sau `sbt-hinh-4-6` (hoặc thay luôn `sbt-hinh-4-6`), `hints.highlight[0].index` đổi theo.

### 15. Câu dẫn 4.1 dùng lại đúng hình tam giác đều của câu dẫn trước

- Vị trí: `$.exercises[56].right[2]` (`ex.dan-4-1-noi-ten`, `visual.dan-td-nguoc`) so với `$.exercises[55].options[0]` (`ex.dan-4-1-chon-tam-giac-deu`). LL-07.
- Nguồn: walk `183-s12-06-exercise-dan-4-1-noi-ten.png`.
- Vấn đề: bé nối theo trí nhớ hình vừa chọn.
- Sửa: dùng tam giác đều khác hướng hay khác cỡ (vd quay 30°), có vạch bằng nhau.

### 16. Bài 4.5a chỉ có một câu dẫn, cho trường hợp "đều"

- Vị trí: `$.exercises[68]` (`ex.dan-4-5a-compa-khit`).
- Nguồn: tr.65 bài 4.5a, lời giải tr.115.
- Vấn đề: câu sách cần kết luận "không phải", câu dẫn chỉ luyện trường hợp khít cả ba cạnh; bé vẫn làm được nhờ `dan-4-4b-do-6-6-7`.
- Sửa: thêm câu dẫn thứ hai (tối đa 2 mỗi câu sách): "Mở compa bằng cạnh XY. Compa khít cạnh XZ, nhưng ngắn hơn cạnh YZ. Tam giác XYZ có là hình tam giác đều không?", đáp án "Không, vì ba cạnh chưa bằng nhau".

### 17. Recap phần 12 chỉ nhắc quy tắc bài 4.5

- Vị trí: `$.sections[11].recap` (`visual.kiem-quy-tac`).
- Nguồn: walk `231-s12-27-recap.png`.
- Vấn đề: phần ôn bảy bài tập mà recap chỉ nhắc một quy tắc; vẫn khớp câu `rule: true` duy nhất của phần.
- Sửa: tuỳ tác giả; có thể giữ.
