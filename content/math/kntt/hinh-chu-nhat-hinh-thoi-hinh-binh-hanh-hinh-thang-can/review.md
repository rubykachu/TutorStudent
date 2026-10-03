# Review: Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân (`hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Bài: `content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp (nhóm 1: phần 1–6; nhóm 2: phần 7–15; nhóm 3: phần 16–18 và phần bài tập sách bài tập; tệp nhóm ở `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/nhom-<n>.md`)
- Nguồn đã đọc: `sources/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/` - sbt-p67, sbt-p68, sbt-p69, sbt-p115
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): 692 / 61 / 0; tệp `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/doc-hieu.md` (đếm theo dòng của tệp; dòng tổng cuối tệp ghi 597 / 74 / 0 là Haiku cộng sai). Lượt 2 (18 mục viết lại): 5 / 11 / 2, tệp `doc-hieu-2.md`.
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`; `visual:shot` 264/264 đạt
- Kết luận: Chưa đạt: còn 21 lỗi Nghiêm trọng. Đã chạy `content:hash --mark`, bài giữ `draft`; không `--approve`, không `content:lock` ở vòng này.
- Bản đã review: `d1185f0adfc05ae283f69431ac13fc5f6d57166b510bc7b2e41acd3cab2e8555` (`pnpm content:diff` so với bản này)

Tiêu chí cho điểm ngoài trang sách (như Bài 18, LL-09): được giữ khi điều đó cần để làm một bài tập trên các trang đã nạp và lần được về một dòng in (dòng "Kĩ năng giải toán" tr.67, chữ trong đề, lời giải tr.115). Các bước vẽ không in trong SBT nhưng là cách vẽ chuẩn SGK KNTT 6 được giữ nếu đúng (đã quyết với Bài 18).
- Giữ: cách vẽ hình chữ nhật, hình thoi, hình bình hành (4.10–4.14 cần); dấu hiệu "bốn cạnh bằng nhau là hình thoi", "bốn góc vuông là hình chữ nhật", "đường chéo cắt nhau tại trung điểm là hình bình hành", "hình thang có hai góc kề một đáy bằng nhau là hình thang cân" (4.15–4.17 hỏi "kiểm tra xem ... có là ... không"); ghép tam giác đều thành hình thang cân, hình thang cân thành lục giác đều (4.18, 4.19).
- Không giữ: dấu hiệu "đường chéo bằng nhau thì là hình chữ nhật" (Nghiêm trọng 1), "hình thoi góc 60° có đường chéo ngắn bằng cạnh" (Nghiêm trọng 2), từ "tia" (Nghiêm trọng 7), "tâm" của hình lục giác (Nghiêm trọng 21).

Mâu thuẫn giữa các phần (Tổng hợp soát `note`, `recap`, `caption`, glossary): đỉnh gọi là "góc" ở cả ba nhóm (Nghiêm trọng 5); "cắt nhau ở giữa" bên cạnh "cắt nhau tại trung điểm" (Nên sửa 14); "liền nhau", "kề", "nằm cạnh nhau" cho một ý (Góp ý 1); "hình thang" chỉ được định nghĩa ở phần 17 dù phần 9 đã dạy hình thang cân (Nên sửa 25); màu teal vừa là hình chữ nhật vừa là miếng tam giác đều (Nên sửa 31); bốn câu quy tắc vẽ lặp nguyên văn ở khối "Nhắc lại" nên mọi lỗi của chúng lặp ở phần bài tập sách bài tập (Nghiêm trọng 5, 7–10). Recap của từng phần khớp nguyên văn câu quy tắc của phần đó.

## Nghiêm trọng

### 1. Mẹo "Kiểm tra khung" và `whyItMatters` dạy dấu hiệu nhận biết hình chữ nhật bằng đường chéo (lớp 8)

- Vị trí: `$.sections[2].blocks[2]` (`tip` kiểm khung); `$.overview.whyItMatters` - LL-09
- Nguồn: tr.67, `sbt-p67.png` (chỉ có chiều "hình chữ nhật thì hai đường chéo bằng nhau")
- Vấn đề: "Hai đường chéo bằng nhau thì khung là hình chữ nhật" là chiều đảo, lớp 8; không bài nào từ 4.8 đến 4.19 cần (4.16 kiểm bằng êke bốn góc). `whyItMatters` lặp đúng ý đó ở màn đầu bài.
- Sửa: mẹo theo chiều sách có: "Khung hình chữ nhật thì hai đường chéo bằng nhau. Đo thấy hai đường chéo khác nhau là khung bị lệch." `whyItMatters` cùng ý. Có thể đổi `kind` sang tránh sai.

### 2. Mẹo "Hình thoi có góc 60°" và câu luyện `thoi-bd-4` dựa vào kiến thức lớp 7

- Vị trí: `$.sections[5].blocks[2]` (`tip.thoi-60-do`); `$.exercises[27]` (`ex.thoi-bd-4`) và `explain` - LL-09
- Nguồn: tr.67–69
- Vấn đề: suy "tam giác ABD có AB = AD, góc A = 60° nên là tam giác đều" cần tổng ba góc tam giác (lớp 7). Không bài sách nào cần. `thoi-bd-4` chỉ làm được nhờ mẹo; mẹo về độ dài đường chéo lại nằm ở phần có quy tắc "hai đường chéo vuông góc".
- Sửa: bỏ mẹo khỏi phần 6; thay `thoi-bd-4` bằng câu luyện quy tắc vuông góc (vd hình thoi EFGH, đường chéo cắt nhau tại I, hỏi góc FIG), số khác câu kiểm tra và kho ôn. Chiều "hai tam giác đều chung cạnh ghép thành hình thoi" đã có ở mẹo phần 13, giữ ở đó.

### 3. `explain` của `cheo-thoi-chon-hinh` nói "Hai đường chéo vuông góc là dấu hiệu của hình thoi"

- Vị trí: `$.exercises[26].explain.text` (`ex.cheo-thoi-chon-hinh`) - LL-17
- Nguồn: tr.67
- Vấn đề: đảo chiều quy tắc và sai (tứ giác hình cánh diều có hai đường chéo vuông góc). Bài dùng chữ "dấu hiệu" cho cách nhận biết ở phần 16, 17 nên bé nhớ đây là một cách nhận biết hình thoi.
- Sửa: "Hình thoi có hai đường chéo vuông góc với nhau, nên chọn hình thoi. Ở hai hình còn lại, hai đường chéo cắt nhau không thành góc vuông."

### 4. Dấu mũi tên song song chỉ có trên lựa chọn đúng của `chon-hinh-song-song`

- Vị trí: `$.exercises[16].options` (`ex.chon-hinh-song-song`); hình `th-hai-duong-song-song` (`src/visuals/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/catalog-chu-nhat-thoi.ts:22`, `parallel: [[0, 1]]`); walk `065-s4-05-exercise-chon-hinh-song-song.png` - LL-03
- Vấn đề: màn trước vừa dạy "song song đánh dấu bằng hai mũi tên giống nhau"; bé chọn theo dấu. Ba hình lựa chọn cũng giống hệt ba thẻ "Cùng làm" `xem-song-song`.
- Sửa: bỏ dấu song song ở hình lựa chọn; đổi góc nghiêng, khoảng cách của ba cặp đường cho khác thẻ "Cùng làm".

### 5. Đỉnh bị gọi là "góc" trong định nghĩa đường chéo, câu quy tắc vẽ và lời giải

- Vị trí: `$.overview.goals[1]`; `$.sections[2].blocks[0].children[0].text` ("đường nối hai góc không kề nhau"); `$.exercises[14].explain` và hai `wrong` (`ex.chon-duong-cheo`); câu quy tắc `$.sections[14].blocks[1].children[0]` ("để tìm góc còn lại") cùng `$.sections[14].recap.caption`, `$.cards[14].recap.caption`, `$.sections[18].blocks[1].children[4]`; `$.exercises[60].explain.text` (`ex.ve-thoi-quy-trinh`); `$.exercises[86].explain.text` (`ex.dem-thoi-luc-giac`: "nối O với một góc của lục giác", trong khi đề cùng câu viết "chung đỉnh O") - LL-05, LL-17
- Nguồn: tr.67; Bài 18 dạy "Đường chéo là đoạn thẳng nối hai đỉnh không nằm cạnh nhau", glossary có `đỉnh`
- Vấn đề: góc không phải một điểm; thứ tìm bằng hai cung là đỉnh. Cả bài không dùng chữ "đỉnh" lần nào trong phần dạy, nên một khái niệm có hai định nghĩa trong cùng chương và bé nhớ "góc" là một điểm, trái "góc 60°" ngay trong bài. Nhóm 1, 2, 3 cùng gặp.
- Sửa: dùng lại câu Bài 18 ở định nghĩa và `goals[1]`: "Đường chéo là đoạn thẳng nối hai đỉnh không nằm cạnh nhau." `chon-duong-cheo`: "Đường chéo nối hai đỉnh không nằm cạnh nhau: A với C, B với D." / "A và B nằm cạnh nhau, nên AB là cạnh." Quy tắc phần 15 và `ve-thoi-quy-trinh`: "để tìm đỉnh còn lại" (đổi recap, thẻ, "Nhắc lại" nguyên văn). `dem-thoi-luc-giac`: "nối O với một đỉnh của lục giác". Soát lại bằng tìm "góc còn lại", "góc không kề", "góc kề nhau", "một góc của".

### 6. Tên điểm O bị dấu góc vuông đè ở màn "Cùng làm" phần 6

- Vị trí: hình `do-cheo-thoi` (`catalog-chu-nhat-thoi.ts:632`), `$.sections[5].blocks[3]`; walk `089-s6-04-block-shown.png` (iPad, điện thoại) - LL-12
- Vấn đề: bốn dấu góc vuông ghép thành ô vuông quanh O, cạnh trái cắt ngang chữ "O".
- Sửa: dời nhãn O xa tâm (khoảng 26px) hoặc thu nhỏ dấu góc vuông của bộ đo; sửa cùng Góp ý 2.

### 7. Từ "tia" chưa dạy, không có trong sách và glossary

- Vị trí: định nghĩa `$.sections[12].blocks[1].children[0]`; câu quy tắc `$.sections[12].blocks[1].children[1]`, `$.sections[12].recap.caption`, `$.cards[12].recap.caption`, `$.sections[18].blocks[1].children[2]`; mục `order` `$.exercises[60].items[1]`, `$.exercises[65].items[1]`, `$.exercises[65].items[2]`; `explain` của `$.exercises[60]`, `[62]`, `[63]`, `[65]`, `[67]`, `[68]`, `[96]`–`[99]`, `[103]`, `[104]`; chữ bước bảng vẽ `construction.ts:91`, `:123`, `:151`; chú thích khung `catalog-drawing.ts:110`, `:114`, `:174`, `:178`, `catalog-book.ts:165`, `:169`, `:199`, `:203`, `:270`, `:274` - LL-09
- Nguồn: tr.67–69 không có chữ "tia"; glossary chỉ có "tia số"
- Vấn đề: tia là khái niệm của chương hình học cơ bản (học sau), không phải kiến thức nền. Một câu định nghĩa không đủ để bé phân biệt tia với đoạn thẳng. Lượt Haiku 1 xếp mơ hồ khoảng 16 mục vì "tia là gì". Cùng kiểu "tâm" ở Bài 18 vòng 1.
- Sửa: bỏ khái niệm tia, dùng "đường kẻ": "Dùng thước đo góc kẻ đường AD tạo với AB một góc 75°", "Lấy D trên đường đó". Xoá câu định nghĩa tia, giữ câu "Độ mở compa là ...". Đổi đồng loạt trong `lesson.json` và ba tệp hình.

### 8. Quy tắc vẽ hình thoi thiếu điều kiện compa (độ mở bằng cạnh, tâm ở hai đầu)

- Vị trí: `$.sections[12].blocks[1].children[1]`, `$.sections[12].recap.caption`, `$.cards[12].recap.caption`, `$.sections[18].blocks[1].children[2]`; mục `s4` của `$.exercises[60]` ("Vẽ hai cung tròn từ Q và từ N, cùng độ mở.") và `explain` - LL-17
- Nguồn: bài 4.11, 4.14 tr.68
- Vấn đề: làm đúng chữ với hai cung cùng độ mở khác cạnh (cạnh 4 cm, cung 5 cm) ra hình hai cạnh 4 cm, hai cạnh 5 cm, không phải hình thoi; câu cũng không nói tâm cung. Bảng vẽ tự giữ độ mở nên trên màn không lộ, nhưng bé vẽ 4.11, 4.14 và bài kiểm tra trên giấy chỉ nhờ câu này. Các `explain` (vd `[62]`, `[96]`) đã nói đủ "cùng độ mở 2 cm từ H và từ F"; chỉ câu nhớ thiếu. Cùng kiểu Nghiêm trọng 5 vòng 1 Bài 18.
- Sửa (tách hai câu cho vừa `[rule-sentence]`, recap lặp nguyên văn): "Vẽ một cạnh, kẻ một đường từ đầu cạnh, lấy trên đó cạnh thứ hai bằng cạnh đầu. Mở compa bằng cạnh, đặt kim ở hai đầu mút còn lại vẽ hai cung." Mục `s4`: "Mở compa bằng MN, vẽ cung tâm Q và cung tâm N."

### 9. Quy tắc vẽ hình bình hành biết đường chéo thiếu điều kiện compa và điểm đi qua

- Vị trí: `$.sections[14].blocks[1].children[0]`, `$.sections[14].recap.caption`, `$.cards[14].recap.caption`, `$.sections[18].blocks[1].children[4]` - LL-17
- Nguồn: bài 4.13 tr.68
- Vấn đề: "Vẽ tam giác bằng compa" không nói tam giác nào, không nói cung tâm A bán kính AC và tâm B bán kính BC; bài chưa dạy vẽ tam giác biết ba cạnh ở chỗ nào khác. Hai đường song song không nói qua điểm nào, song song với cạnh nào. Chỉ nhớ câu này bé không vẽ được 4.13 trên giấy.
- Sửa (hai câu, recap lặp nguyên văn, rút cho vừa `[length]`): "Vẽ AB, rồi vẽ cung tâm B bán kính BC và cung tâm A bán kính AC, gặp nhau tại C. Dùng êke vẽ qua C đường song song với AB, qua A đường song song với BC, gặp nhau tại D."

### 10. Quy tắc vẽ hình chữ nhật và hình bình hành thiếu "cùng một phía", "bằng cạnh kia", "qua đầu cạnh"

- Vị trí: `$.sections[11].blocks[1].children[0]`, recap phần 12, `$.cards[11].recap.caption`, `$.sections[18].blocks[1].children[1]`, mục `s3` của `ex.ve-cn-quy-trinh`; `$.sections[13].blocks[1].children[0]`, recap phần 14, `$.cards[13].recap.caption`, `$.sections[18].blocks[1].children[3]`, mục `s4` của `$.exercises[65]` ("vẽ qua F và qua K hai đường song song" không nói song song với gì) - LL-17
- Nguồn: cách vẽ SGK KNTT 6; bài 4.10, 4.12 tr.68
- Vấn đề: "lấy hai đoạn bằng nhau rồi nối" không nói bằng cạnh nào (ra hình chữ nhật sai kích thước của 4.10) và không nói cùng phía; "vẽ hai đường song song với hai cạnh đó" không nói đi qua đâu, hình không khép. Nhóm 2 ghi Nên sửa vì bảng vẽ làm đúng; nhóm 3 ghi Nghiêm trọng vì đây là chữ bé đọc ngay trước 4.10, 4.12 và mang ra bài làm trên giấy. Giữ mức cao hơn.
- Sửa: "Vẽ một cạnh, kẻ hai đường vuông góc ở hai đầu cạnh. Về cùng một phía, lấy hai đoạn bằng cạnh kia rồi nối." "Vẽ hai cạnh liền nhau. Dùng êke vẽ qua đầu mỗi cạnh một đường song song với cạnh kia." Mục `s4`: "Dùng êke vẽ qua F đường song song với EK, qua K đường song song với EF." Đổi recap, thẻ, "Nhắc lại" nguyên văn.

### 11. Lý do `wrong` của `ve-thoi-do-mo` sai: cung 2 cm vẫn gặp nhau, cung 8 cm không "đi quá xa"

- Vị trí: `$.exercises[61].explain.wrong[0].text`, `.wrong[1].text` (`ex.ve-thoi-do-mo`) - LL-17
- Vấn đề: hình thoi cạnh 4 cm góc 45°: QN ≈ 3,1 cm < 2 + 2, nên hai cung 2 cm cắt nhau; cung 8 cm luôn cắt nhau. Cả hai lý do sai và giấu lý do thật (điểm cần tìm phải cách Q và N đúng 4 cm).
- Sửa: "Cung 2 cm cho điểm cách hai đỉnh 2 cm, mà hai cạnh còn lại phải dài 4 cm." / "Cung 8 cm cho điểm cách hai đỉnh 8 cm, nên hai cạnh mới dài 8 cm, không bằng 4 cm."

### 12. Lời `wrong` dạy "hình thoi thường có các góc 60° và 120°"

- Vị trí: `$.exercises[51].explain.wrong[0].text` (`ex.so-sanh-bon-goc-vuong`) - LL-17
- Nguồn: tr.67 chỉ nói các góc đối bằng nhau
- Vấn đề: góc hình thoi có thể là số đo bất kỳ; mọi hình thoi của các phần dạy đều vẽ 60° và 120°, nên câu này củng cố điều sai, trái ngay 4.11 (bé chọn 45°, 75°).
- Sửa: "Hình thoi chỉ chắc chắn có bốn cạnh bằng nhau; góc của nó thường không phải góc vuông." Thêm ít nhất một hình thoi góc khác 60° ở phần 5.

### 13. Nhãn nửa đường chéo nằm sát cạnh AB, đọc thành độ dài cạnh (phần 8 và phần 17)

- Vị trí: `visual.do-cheo-binh-hanh` (`catalog-binh-hanh-thang-can.ts:230–274`, bốn `seg` không `at`/`textAt`), `$.sections[7].blocks[2].children[1]`, walk `118-s8-03-block-shown.png`; `visual.do-kiem-binh-hanh` (`catalog-check.ts:292`), `$.sections[16].blocks[3].children[1]`, walk `249-s17-04-block-shown.png` (iPad, điện thoại) - LL-12, LL-15
- Vấn đề: "4 cm", "3 cm" của hai nửa đường chéo trên nằm ngay dưới AB, nét AB chạm hoặc cắt chữ; bé đọc "AB = 4 cm". Đây là hai màn bé "thấy" O là trung điểm. Nhóm 2 và 3 cùng gặp; cùng kiểu Nghiêm trọng 2 vòng 2 Bài 18.
- Sửa: như bản sửa `do-duong-cheo-vuong` của Bài 18: ghi dòng dưới hình "OA = OC = ... cm", "OB = OD = ... cm" (tăng `h`), hoặc `at` nhỏ gần O; sửa cả hai hình cùng lúc, chụp lại ba thiết bị.

### 14. Nhãn "7 cm 7 cm" ở "Cùng làm" phần 10 nằm trên cạnh đáy AB

- Vị trí: `visual.do-cheo-thang-can` (`catalog-binh-hanh-thang-can.ts:420–452`, `at: 0.2`), `$.sections[9].blocks[2].children[1]`; walk `145-s10-03-block-shown.png` - LL-12, LL-15
- Vấn đề: hai nhãn đứng liền nhau, nét AB đi ngang qua chữ; bé đọc "AB = 7 cm".
- Sửa: dòng dưới hình "AC = 7 cm", "BD = 7 cm", hoặc `at` khoảng 0,7. Chụp lại và tự xem.

### 15. Bảng vẽ cạnh 2 cm: nhãn "60°" đè cạnh, cung và tên điểm

- Vị trí: `visual.ve-thoi-efgh` (`$.exercises[62]`), `visual.ve-binh-hanh-tap-lam` (`$.sections[13].blocks[3].children[1]`), `visual.ve-binh-hanh-abcd` (`$.exercises[67]`); `construction.ts:459–467`, `:519–527` (`textDistance: 46` lớn hơn cạnh 2 cm = 36 đơn vị); walk `199-s13-07-…`, `207-s14-04-block-shown.png`, `213-s14-07-…-correct.png` - LL-12
- Vấn đề: chữ số đo góc nằm ngoài hình, trên cạnh đối diện; hình rộng khoảng 45 điểm trên iPad; câu luyện có chấm và màn "Cùng làm".
- Sửa: (a) cạnh từ 3 cm trở lên cho bảng có góc, soát lại bảng số tách nhau trong `task.md`; (b) `textDistance` theo cạnh ngắn (vd `Math.min(46, 0.6 * min(len, side) * UNIT)`). Chụp lại và tự xem.

### 16. Quy tắc ghép hình phần 18 thiếu "bằng nhau" và điều kiện để ra lục giác đều

- Vị trí: `$.sections[17].blocks[1].children[0]`, `$.sections[17].recap.caption`, `$.cards[17].recap.caption`, `$.sections[18].blocks[3].children[1]`; note `$.sections[17].blocks[0].children[0]` ("Ba hình tam giác đều cạnh nhau"); đề và `explain` của `$.exercises[87]` (`ex.ghep-hai-thang-can-thanh`), `$.exercises[116]` (`ex.dan-4-19-hai-ghep`) - LL-17
- Nguồn: tr.69 bài 4.18 ("ba hình tam giác đều có cạnh 4 cm"), 4.19
- Vấn đề: hai hình thang cân đáy nhỏ = cạnh bên = 3 cm, đáy lớn 4 cm ghép theo đáy lớn ra hình sáu cạnh bằng nhau nhưng góc khoảng 161° và 100°, không phải lục giác đều. Cần đáy lớn gấp đôi đáy nhỏ (ghép từ ba tam giác đều bằng nhau). Ba tam giác đều khác cỡ không ghép được.
- Sửa (recap, thẻ, "Nhắc lại" nguyên văn): "Ba hình tam giác đều bằng nhau ghép thành một hình thang cân. Hai hình thang cân như thế ghép thành một hình lục giác đều." Đề `ghep-hai-thang-can-thanh`: "Hai hình thang cân, mỗi hình ghép từ ba tam giác đều bằng nhau, ghép theo đáy lớn. Chúng ghép thành hình gì?"; `explain`: "Ba tam giác đều là một nửa hình lục giác đều, nên hai hình thang cân này ghép thành hình lục giác đều." Note đầu phần: "Ba hình tam giác đều bằng nhau, đặt sát nhau, ghép được thành ...". Câu dẫn 4.19 đổi theo Nên sửa 23.

### 17. "Cùng làm" thứ hai của phần 18 là khay Hình 4.16 của bài 4.19, dừng ở 2/8 miếng

- Vị trí: `$.sections[17].blocks[3].children[1]` (`visual.ghep-hai-thang-can-cung-lam`, `catalog-check.ts:340`, `which: "tray"`, `goal: 2`); walk `263-s18-04-block.png`, `264-s18-04-block-shown.png` - LL-08
- Nguồn: tr.69 Hình 4.16
- Vấn đề: chép hình sách vào màn "Cùng làm" (kiểu Nghiêm trọng 8 vòng 1 Bài 18); màn báo xong ở "2/8", bé tưởng mình làm thiếu; bài 4.19 về sau là đúng bảng này.
- Sửa: bảng ghép riêng hai miếng (lục giác đều nét đứt cắt theo một đường chéo chính, "0/2 miếng"), hướng cắt khác khay; không dùng `which: "tray"` ở phần dạy.

### 18. Lời giải lấy tính chất của hình để kết luận tứ giác là hình đó (suy ngược)

- Vị trí: `$.exercises[75].explain.text` (`ex.kiem-thoi-bon-canh`), `$.exercises[109].explain.text` (`ex.dan-4-16-eke`), `$.exercises[106].explain.text` và `.wrong[0].text` (`ex.dan-4-15-do-gi`: "Bốn góc bằng nhau là dấu hiệu của hình chữ nhật", khác câu quy tắc "bốn góc vuông") - LL-17
- Vấn đề: "Hình thoi có bốn cạnh bằng nhau. XYZT có bốn cạnh bằng nhau, nên là hình thoi" là suy ngược; phần 16 dạy đúng chiều "Tứ giác có bốn cạnh bằng nhau là hình thoi". Đây là câu kiểm tra đầu tiên của phần dạy dấu hiệu nên bé học đúng kiểu suy sai.
- Sửa: "XYZT có bốn cạnh đều dài 4 cm. Tứ giác có bốn cạnh bằng nhau là hình thoi, nên XYZT là hình thoi." Tương tự cho `dan-4-16-eke` ("Tứ giác có bốn góc vuông là hình chữ nhật, nên ..."), `dan-4-15-do-gi` ("Tứ giác có bốn cạnh bằng nhau là hình thoi, nên ta đo bốn cạnh rồi so sánh."); `wrong[0]`: "Đo góc để tìm hình chữ nhật: tứ giác có bốn góc vuông là hình chữ nhật."

### 19. Lời giải 4.17 nhận BEDC là hình thang cân vì "hai cạnh bên bằng nhau"

- Vị trí: `$.exercises[113].explain.text`, `.explain.wrong[0].text` (`ex.sbt-4-17`); hình `visual.sbt-4-17-giai` (`catalog-book.ts:330`) - LL-17, LL-05
- Nguồn: tr.69 bài 4.17; tr.115 chỉ ghi kết luận
- Vấn đề: không phải dấu hiệu bài dạy (phần 17: hai góc kề một đáy bằng nhau), và sai như quy tắc chung (hai cạnh đối song song, hai cạnh kia bằng nhau có thể là hình bình hành). Câu dẫn và hình gợi ý dạy kiểm góc rồi lời giải dùng cách khác; lý do OABC là hình thoi không nói vì sao các đoạn bằng nhau.
- Sửa: "OA, AB, BC, CO đều bằng cạnh của các tam giác đều chung đỉnh O, nên OABC là hình thoi; OCDE cũng vậy. BEDC có BE song song CD, góc B và góc E đều là góc của tam giác đều nên bằng 60°. Vậy BEDC là hình thang cân." `wrong[0]` theo cùng lý do; hình lời giải thêm cung 60° ở B, E.

### 20. Lời `wrong` của câu dẫn 4.17 nói hai góc kề một đáy của hình bình hành không bằng nhau

- Vị trí: `$.exercises[112].explain.wrong[1].text` và đề `$.exercises[112].prompt` (`ex.dan-4-17-thang-can`) - LL-17, LL-01
- Vấn đề: sai với hình chữ nhật (hình bình hành có bốn góc vuông); đề "Tứ giác này là hình gì?" khi tứ giác là hình chữ nhật thì "Hình bình hành" cũng đúng.
- Sửa: đề "Tứ giác này chắc chắn là hình gì?"; `wrong[1]`: "Hai góc kề một đáy của hình bình hành chỉ bằng nhau khi chúng là góc vuông; đề không nói vậy."

### 21. Câu dẫn 4.17 dùng "tâm O" của hình lục giác đều

- Vị trí: `$.exercises[111].prompt[0].text` (`ex.dan-4-17-thoi`); nhãn `visual.sbt-hinh-4-15` "hình có tâm O" (`catalog-book.ts:74`) - LL-09
- Nguồn: tr.69 Hình 4.15 chỉ ghi điểm O; Bài 18 đã bỏ "tâm" của lục giác ở vòng 1
- Vấn đề: "tâm" ở bài này chỉ là chỗ đặt kim compa (phần 15); "tâm của hình lục giác" chưa dạy. Câu dẫn không có hình.
- Sửa: "Hình lục giác đều UVWXYZ cạnh 5 cm được chia thành sáu tam giác đều có chung đỉnh O, nên OU, OV, OW cũng dài 5 cm." kèm hình có tên U…Z; nhãn hình: "Hình 4.15: các điểm A, B, C, D, E và O".

## Nên sửa

### 1. Phần 4 không có hình nào có cạnh song song trước câu hỏi về hình chữ nhật

- Vị trí: `$.sections[3]` (hình `ray-tau`, `song-song-quy-tac`, `xem-song-song`); `$.exercises[15]`, `$.exercises[17]` - LL-16
- Sửa: hình quy tắc là hình chữ nhật ABCD có mũi tên song song trên AB, CD và BC, DA kèm "AB song song với CD".

### 2. Câu kiểm tra lặp số của hình quy tắc, màn mẫu hay "Cùng làm"

- Vị trí: `$.exercises[21]` (`thoi-goc-c`: góc A = 60° như hình quy tắc và recap); `ex.binh-hanh-canh-cd`, `ex.binh-hanh-goc-c` (số của `do-binh-hanh`); `ex.ve-thoi-abcd` (6 cm, 45° như `ve-thoi-tap-lam`); `ex.ve-bh-canh-dc` (số của `ve-binh-hanh-cac-buoc`) - LL-07
- Sửa: đổi số (vd thoi góc B 110° hỏi góc D; bình hành 7 và 5 cm, góc A 110°; kho ôn thoi 5 cm 75°; DC: AB = 6, AD = 4); soát lại bảng số trong `task.md`.

### 3. Nhãn "AC = 8 cm" nằm sát dưới cạnh DC

- Vị trí: hình `chu-nhat-cheo-ac-8` (`catalog-chu-nhat-thoi.ts:343`), `$.exercises[10]`; walk `050-s3-05-…` - LL-12, LL-15
- Sửa: đặt nhãn dọc theo AC trong hình hoặc ngoài hình cạnh C, có đường dẫn.

### 4. Đường chéo hình chữ nhật ghi 5 cm, ngắn hơn cạnh 6 cm của cùng hình ở phần trước

- Vị trí: `do-cheo-chu-nhat` (`catalog-chu-nhat-thoi.ts:304`) so với `do-chu-nhat` (6 cm, 4 cm) - LL-15
- Sửa: cạnh 4 cm và 3 cm (vẽ tỉ lệ 4 : 3, đường chéo 5 cm), hoặc ghi đường chéo đúng với hình.

### 5. Nhiễu Có/Không trái ngay dữ kiện đề

- Vị trí: `$.exercises[12].options` (`khung-anh-cheo`: đề 30 và 34 cm, nhiễu "Có, vì hai đường chéo bằng nhau"); `$.exercises[47].options[0]` (`khung-go-cheo`, 40 và 42 cm); nhiễu `khong` của `$.exercises[75]`, `co` của `$.exercises[105]`, `co` của `$.exercises[81]` - LL-14
- Sửa: nhiễu nêu lỗi thật: "Có, vì khung có bốn cạnh và bốn góc"; "Có, vì nó có hai cạnh đáy song song" (`wrong`: "Hình thang nào cũng có hai đáy song song; hình thang cân còn cần ..."); "Chưa biết, phải đo thêm các góc".

### 6. Ba câu phần 1 hỏi lại đúng bộ ghép vật–hình của màn "Cùng làm"

- Vị trí: `$.exercises[0]` (`noi-vat-voi-hinh`), `$.exercises[3]` (`chon-chu-nhat-hoac-thoi`), `$.exercises[4]` (`dien-ten-hinh`) - LL-07
- Sửa: giữ một câu nối có hình vật; hai câu kho ôn đổi sang vật khác (khung ảnh, mắt lưới B40, mặt bàn) hoặc hình không tên để gọi tên.

### 7. Lời giải nhận hình theo dáng hay hướng nằm, không theo tính chất

- Vị trí: `$.exercises[1].explain.text` (`ten-hinh-binh-hanh`: "nghiêng sang một bên và có hai cặp cạnh giống nhau"); `$.exercises[90].explain.text` ("nằm như một viên kim cương"); `$.exercises[93].explain.text` và `$.exercises[42].explain.text`, `.wrong[0].text` ("một cạnh bên thẳng đứng") - LL-17
- Sửa: nêu tính chất: "các cạnh đối bằng nhau và song song, nhưng không có góc vuông và bốn cạnh không bằng nhau"; "Hình thoi có bốn cạnh bằng nhau."; "hai cạnh bên dài khác nhau". Dùng "bằng nhau", không "giống nhau".

### 8. "Khung cánh diều có bốn cạnh bằng nhau" không đúng với phần lớn diều thật

- Vị trí: `$.sections[0].blocks[0]`, `$.sections[4].blocks[0].children[0].text`, `explain` của `$.exercises[0]`, `$.exercises[4]`; hình `scene.tsx` - LL-17
- Sửa: đổi vật mẫu hình thoi (mắt lưới B40, hoa văn ô trám); nếu giữ diều thì "chiếc diều này có dạng hình thoi", thanh ngang ở giữa.

### 9. Lý do `wrong` của `cheo-thoi-tao-goc` đọc như mọi hình thoi có góc 60°

- Vị trí: `$.exercises[28].explain.wrong` - LL-17
- Sửa: "60° có thể là số đo một góc của hình thoi, không phải góc giữa hai đường chéo. Hai đường chéo luôn tạo góc vuông." (tương tự 120°).

### 10. Bảng vẽ báo "Bạn đã làm xong mọi bước." khi chọn sai số

- Vị trí: `board-visual.tsx:66–87` (không truyền `finished`); walk `179-s12-06-exercise-ve-cn-abcd-wrong1.png`
- Sửa: truyền `finished` ("Bạn đã bấm đủ các bước. Hãy bấm Kiểm tra."); ở màn có `goal`, `warning` khi số khác `goal`. Thêm test.

### 11. Bảng vẽ, hình mẫu từng bước và hình "Nhắc lại" quá nhỏ trên iPad

- Vị trí: `construction.ts:31` (`UNIT = 18`), `board.tsx` `DEFAULT_MAX_HEIGHT = 188`; hình `ve-*-cac-buoc`, hình quy tắc phần 12–15, mọi bảng; `visual.ve-ba-hinh` (`$.sections[18].blocks[1].children[5]`, ba hình cao khoảng 30 px); walk `167`, `168`, `178`, `186`, `204`, `218`, `274-s19-02`, `305-s19-17` - LL-12
- Sửa: hình quy tắc cắt khung theo hình thật; bảng tính khung theo số lớn nhất của đề hoặc nâng `maxHeight` trên iPad; `ve-ba-hinh` xếp một cột.

### 12. Hai nhãn "120°" đứng liền nhau giữa hình ở "Cùng làm" phần 7

- Vị trí: `visual.do-binh-hanh` (`catalog-binh-hanh-thang-can.ts:113–141`); walk `105-s7-03-block-shown.png` - LL-12
- Sửa: `textDistance` nhỏ hơn cho góc tù hoặc đặt nhãn sát đỉnh (như bản sửa hình thoi ở commit `b85bac6`).

### 13. "Góc kề một đáy" chưa được giải nghĩa

- Vị trí: `$.sections[8].blocks[1].children[0]` - LL-10
- Sửa: thêm "Hai góc ở hai đầu một đáy gọi là hai góc kề đáy đó."

### 14. "Cắt nhau ở giữa", "O ở giữa" bên cạnh câu quy tắc "cắt nhau tại trung điểm"

- Vị trí: `$.sections[16].blocks[0].children[0].text`; chú thích "Hình bình hành: cắt nhau ở giữa" (`catalog-binh-hanh-thang-can.ts:61–64`, hình `so-sanh-cheo`, recap phần 11); `$.exercises[50].explain.wrong[1].text`; `$.exercises[80].explain.wrong[0].text`, `$.exercises[108].explain.wrong[0].text` ("O ở giữa mỗi đường chéo") - LL-05
- Sửa: dùng một cách nói: "cắt nhau tại trung điểm của mỗi đường", "O là trung điểm của mỗi đường chéo".

### 15. Kho ôn `ve-bh-cheo-efgh` (EF = FG = 4, EG = 6) ra hình thoi

- Vị trí: `$.exercises[73]`
- Sửa: EF = 3, FG = 4, EG = 6 (soát bất đẳng thức tam giác, khác số đã dùng).

### 16. Hình mẫu phần 15 không nêu số đề, không nói vì sao mở compa 3 cm

- Vị trí: `$.sections[14].blocks[0].children[1]`; chú thích khung `catalog-drawing.ts` - LL-16
- Sửa: "… ABCD có AB = 4 cm, BC = 3 cm và AC = 6 cm."; "Mở compa bằng BC = 3 cm, đặt kim ở B vẽ cung".

### 17. Bước "dùng thước đo góc, chọn 45°, 60° hay 75°" khi vẽ hình thoi, hình bình hành

- Vị trí: bước `angle` (`construction.ts:86–92`), note đầu phần 13, 14, mục `s2` của `$.exercises[60]`, `$.exercises[65]`; câu app của 4.11, 4.12
- Vấn đề: SGK KNTT vẽ bằng "một đường thẳng bất kỳ qua A", không đo góc; 4.11, 4.12 không cho góc. Đo góc học ở tiểu học, nhưng vẽ góc cho trước bằng thước đo góc chưa có trên trang. Chấm 4.11 (mọi góc trong ba góc đều đúng) là hợp lý.
- Sửa: xem "Cần chủ dự án quyết", mục 2.

### 18. `explain` của `ve-cn-hai-duong` nêu định lí chưa học

- Vị trí: `$.exercises[59].explain.text` - LL-09
- Sửa: "Hai đường ấy chứa hai cạnh đối của hình chữ nhật, mà các cạnh đối của hình chữ nhật song song. Vậy chúng song song với nhau."

### 19. Câu kho ôn phần 11 dùng chữ "dấu hiệu" trước phần 16

- Vị trí: `$.exercises[53].explain.text`, `$.exercises[54].explain.text` - LL-09
- Sửa: "Trong bốn hình, chỉ hình thoi luôn có bốn cạnh bằng nhau và hai đường chéo vuông góc." (tương tự hình chữ nhật).

### 20. Phần 11 `so-sanh-bon-hinh` lặp lại phần 3, 6, 8, 10

- Vị trí: `$.sections[10]`. Đề xuất ở mục "Độ dài".

### 21. Câu dùng lại hình hay tên điểm của màn mẫu hoặc câu khác cùng phần

- Vị trí: `visual.binh-hanh-cheo-ten` ở `$.exercises[35]`–`[37]`; `$.exercises[75]` dùng tứ giác XYZT của `visual.kiem-cac-buoc`; `$.exercises[49]` dùng hình `thang-can-cheo-ten` của `$.exercises[45]` - LL-07
- Sửa: câu luyện và kho ôn dùng tên khác (MNPQ, GHIK, giao điểm I) hoặc hình nghiêng khác.

### 22. Đề 4.15, 4.16 là hình tĩnh, lời giải nêu số đo bé không thấy

- Vị trí: `$.exercises[107]` (`explain` "đều dài 5 cm"), `$.exercises[110]` (hình không vẽ EP, FQ mà `explain` dựa vào) - LL-22
- Sửa: hình đề thành hình chạm để đo (`kind: "probe"`): 4.15 chạm bốn cạnh; 4.16 chạm hai nửa EP, FQ và bốn góc ABCD. Lời đề giữ nguyên.

### 23. Câu dẫn trùng câu phần dạy

- Vị trí: `dan-4-16-cheo` (`$.exercises[108]`) trùng `kiem-bh-cheo-co` (`[80]`); `dan-4-19-hai-ghep` (`[116]`) trùng nguyên văn `ghep-hai-thang-can-thanh` (`[87]`); `dan-4-18-day-lon` (`[114]`) gần trùng `ghep-day-lon` (`[85]`); `dan-4-16-eke` (`[109]`) gần trùng `ba-goc-khit` (`[79]`) - LL-07
- Sửa: bỏ `dan-4-16-cheo`, `dan-4-18-day-lon`; `dan-4-19-hai-ghep` thành câu đếm ("Hai miếng ghép thành hình lục giác giữa khay. Còn mấy miếng xếp quanh?", đáp án 6); đổi tên và cách hỏi của `dan-4-16-eke`.

### 24. Câu dẫn 4.8, 4.9 dùng đúng bộ bốn hình của Hình 4.11, 4.12

- Vị trí: `$.exercises[90].right`, `$.exercises[92].right` - LL-02
- Sửa: đổi nhiễu và hướng (hình chữ nhật xoay nghiêng, hình thang cân lộn ngược).

### 25. "Hình thang" định nghĩa muộn và sai ("hình có hai cạnh song song")

- Vị trí: `$.sections[16].blocks[1].children[0].text`; `$.exercises[84].explain.wrong[2].text`; phần 9 (`$.sections[8]`) dạy hình thang cân mà chưa nói hình thang là gì - LL-17, LL-05
- Sửa: định nghĩa một lần ở note đầu phần 9: "Hình thang là tứ giác có hai cạnh đối song song." (phần 9 cần thêm "tứ giác là hình có bốn cạnh", hiện chỉ có ở phần 16); phần 17 nhắc đúng câu đó; `wrong[2]`: "Tứ giác có một cặp cạnh song song là hình thang, chưa chắc là hình bình hành."

### 26. Câu luyện `chon-chu-nhat-trong-thoi` chép cấu hình Hình 4.9, 4.14 và đề lộ đáp án

- Vị trí: `$.exercises[77]` (`visual.thoi-trong-hinh`) - LL-08, LL-14
- Sửa: hình chữ nhật, hình bình hành, hình thoi nằm riêng; đề "Chạm vào hình có bốn góc vuông", không kể trước có những hình gì.

### 27. Kho ôn `luc-giac-gom-thang-can` có đáp án trong đề

- Vị trí: `$.exercises[88]` - LL-14
- Sửa: "Cắt một hình lục giác đều theo một đường chéo chính. Mỗi phần là hình gì?"

### 28. Kho ôn `thoi-bon-canh-6` của thẻ "kiểm tra" chỉ ôn tính chất phần 5

- Vị trí: `$.exercises[78]` (`card.kiem-thoi-chu-nhat`) - LL-07
- Sửa: "Đo một tứ giác được bốn cạnh 6 cm, 6 cm, 6 cm, 7 cm. Tứ giác đó có là hình thoi không?"

### 29. Lời giải 4.12 nhảy từ FH = 4 sang EK = 4 không nói lý do

- Vị trí: `$.exercises[99].explain.text` (`ex.sbt-4-12`)
- Sửa: "FH và EK là hai cạnh đối nên bằng nhau: lấy EK = 4 cm."

### 30. Bài 4.10–4.14, 4.18, 4.19 không có lời giải sách: Reviewer đã tự giải

- Vị trí: `$.exercises[95]`, `[97]`, `[99]`, `[102]`, `[104]`, `[115]`, `[117]`
- Nguồn: tr.115 chỉ có 4.8, 4.9, 4.15–4.17
- Vấn đề: theo checklist ghi Nên sửa. Tự giải khớp `validators` trong `logic.ts` và `explain` (4.13: tam giác 3-5-6 dựng được; 4.19: 2 nửa lục giác giữa + 6 quanh).
- Sửa: không cần đổi; chủ dự án ghi nhận.

### 31. Màu teal vừa là hình chữ nhật vừa là miếng tam giác đều

- Vị trí: `figures.ts:29` (`"chu-nhat": "teal"`), `figures.ts:1079` (miếng tam giác của dải ghép), `board-visual.tsx:116` (`strip`, `color: "teal"`); glossary `hình chữ nhật` và `hình tam giác đều` cùng `teal` (tương tự `hình thoi`/`hình vuông` cùng `pink`, `hình bình hành`/`hình lục giác đều` cùng `lime`) - LL-05
- Vấn đề: trong bài này teal là màu hình chữ nhật ở phần 1–17, rồi phần 18 và 4.18 tô tam giác đều cũng bằng teal; bài liền trước dạy teal là tam giác đều.
- Sửa: tác giả chọn cho bốn hình của bài các màu chưa dùng cho hình của Bài 18 (sửa glossary và `figures.ts` cùng lúc), hoặc tô miếng ghép bằng màu trung tính.

### 32. Câu kiểm tra phần 3 `cheo-chu-nhat-luon-co` dùng "vuông góc" trước phần 6 và nói điều chưa dạy

- Vị trí: `$.exercises[11]` (lựa chọn b, `explain.text`, `wrong[0]`) - LL-09
- Vấn đề: "vuông góc" chỉ được giải nghĩa ở phần 6; `explain` "cắt nhau ở giữa hình" là ý phần 8 dạy cho hình bình hành; nhiễu "Một đường dài gấp đôi đường kia" không ai chọn.
- Sửa: bỏ vế "cắt nhau ở giữa hình"; thay nhiễu "vuông góc" bằng "Chúng song song với nhau" và nhiễu "gấp đôi" bằng "Chúng bằng cạnh dài".

## Góp ý

### 1. "Liền nhau", "kề", "nằm cạnh nhau" cho một ý

- Vị trí: `$.exercises[8].explain`, `$.exercises[15].explain`, quy tắc phần 14 ("hai cạnh liền nhau"); `$.sections[2].blocks[0]` ("không kề nhau"). Sửa: chọn một cách nói ("nằm cạnh nhau", như Bài 18) khi sửa Nghiêm trọng 5.

### 2. Chữ O chạm nét ở các hình đường chéo hình thoi và `hex-ten`

- Vị trí: `cheo-thoi-cac-buoc`, `cheo-thoi-quy-tac`, `thoi-cheo-o` (walk `085`, `086`, `090`); `visual.hex-ten` (walk `267-s18-06`). Sửa: nhích nhãn O, cùng lúc với Nghiêm trọng 6.

### 3. Mũi tên song song chạm cung góc ở hình quy tắc hình thoi

- Vị trí: `thoi-quy-tac`, `thoi-cac-buoc` (walk `073-s5-02-block.png`). Sửa: tách dấu song song và số đo góc ra hai khung, hoặc dời mũi tên.

### 4. "Cắt nhau nghiêng" mơ hồ

- Vị trí: `$.exercises[50].explain.wrong[0].text`, `explain.text` ("không luôn như vậy"). Sửa: "cắt nhau không thành góc vuông"; "thì không chắc chắn như vậy".

### 5. `ve-bh-cheo-hinh-gi` không loại ba điểm thẳng hàng và dùng chiều ngược

- Vị trí: `$.exercises[74]`. Sửa: "Ba điểm A, B, C không thẳng hàng"; `explain` dựa vào chính cách vẽ phần 14.

### 6. `sourceRef` các phần vẽ chỉ trỏ SBT tr.67

- Vị trí: `$.sections[11]`–`[14].sourceRef`, `$.cards[11]`–`[14].sourceRef`. Sửa: ghi thêm "cách vẽ theo SGK KNTT 6" như Bài 18.

### 7. Câu đề thiếu chủ ngữ

- Vị trí: `$.exercises[46].prompt[0]`, `$.exercises[49].prompt[0]`. Sửa: "Cho hình thang cân ABCD."

### 8. 4.14: EFPQ cũng có bốn cạnh bằng nhau

- Vị trí: `$.exercises[110].explain`. Có thể thêm "EFPQ còn có bốn cạnh bằng nhau; hình thoi cũng là hình bình hành."

### 9. `thang-can-ba-canh-4` dùng đúng 4 cm của 4.18 và nói "cạnh trên, đáy dưới" khi không có hình

- Vị trí: `$.exercises[89]` - LL-07. Sửa: 7 cm; dùng "đáy nhỏ", "đáy lớn".

### 10. `dem-thoi-luc-giac` dùng đúng tên OABC của 4.17

- Vị trí: `$.exercises[86]`. Sửa: đổi tên (OMNP).

### 11. "Cùng làm" ghép ba tam giác làm đúng việc của 4.18

- Vị trí: `$.sections[17].blocks[2]`, `$.exercises[115]`. Có thể đổi nhãn, cỡ tam giác ở "Cùng làm".

### 12. Hình 4.16 vẽ lại cắt lục giác giữa theo đường ngang, sách cắt nghiêng

- Vị trí: `figures.ts:1103` (cắt `i0-i3`). Nếu muốn khớp sách thì cắt `i1-i4`.

### 13. `kiem-chac-chan-chu-nhat` thiếu `wrong` cho nhiễu "hai đường chéo vuông góc"

- Vị trí: `$.exercises[76].explain.wrong`. Thêm: "Hai đường chéo vuông góc là điều của hình thoi, các góc có thể không vuông."

### 14. Mẹo phần 16 kiểm góc vuông bằng góc tờ giấy, còn "Cùng làm" và 4.16 dùng êke

- Vị trí: `$.sections[15].blocks[2]` (`tip`), `$.sections[15].blocks[3]`. Hai dụng cụ cho một việc; Haiku cũng chấm mơ hồ "khít", "hở", "chờm ra". Sửa: mẹo nói "Không có êke thì dùng góc tờ giấy vở, cũng đặt khít như êke."

### 15. `overview.goals[2]` không kể thước đo góc mà bài dùng

- Vị trí: `$.overview.goals[2]` ("bằng thước, êke và compa"). Sửa theo quyết định ở "Cần chủ dự án quyết", mục 2.

## Độ dài

- Bài hiện có 19 phần, 18 thẻ, 118 câu (phần dạy 18 × 3 = 54 câu kiểm tra và luyện, 36 câu kho ôn, 28 câu ở phần bài tập sách bài tập gồm 12 câu sách và 16 câu dẫn), tổng `minutes` 112 phút. Đây là bài dài nhất app (bài dài kế tiếp: `uoc-chung-uoc-chung-lon-nhat` 90 phút, `phep-cong-phep-tru-so-nguyen` 88 phút; Bài 18: 73 phút).
- Kết luận: **không hợp bé chậm** (`docs/learner.md`: tiếp thu chậm, nhanh quên, khó tập trung lâu). Mỗi phần riêng ngắn và một ý (5 phút), nhưng bài gộp hai việc khác hẳn nhau: nhận biết bốn hình (phần 1–11) và vẽ, kiểm tra, ghép (phần 12–18), cộng một phần bài tập sách bài tập 22 phút một mạch. Chuỗi bốn phần vẽ liền nhau (12–15), mỗi phần hai bảng nhiều nút, là đoạn nặng nhất. Cắt gọn trong bài vẫn còn khoảng 95 phút.
- Cắt trong bài (tác giả tự làm được, không cần đổi luật):
  - Bỏ phần 11 `so-sanh-bon-hinh` (bớt 5 phút, 3 màn, 3 câu, 1 thẻ): câu quy tắc chỉ ghép lại quy tắc phần 3, 6, 10. Giữ màn chạm `visual.so-sanh-the` làm màn cuối phần 10; chuyển `ex.so-sanh-cheo-bang-nhau` vào kho ôn thẻ `cheo-hinh-thang-can`, `ex.so-sanh-cheo-vuong-goc` vào kho ôn thẻ `cheo-hinh-thoi`; bỏ `ex.so-sanh-bon-goc-vuong`, `ex.tam-bia-bon-canh`, `ex.khung-anh-bon-goc`. Kiểm lại `[guides]` và số câu nhiều đáp án.
  - Cân nhắc gộp phần 1 vào màn đầu phần 2: câu `rule` của phần 1 chỉ kể tên bốn hình.
  - Phần 4 (kiến thức tiểu học): còn 2 màn, đưa thanh ray thành khung đầu của hình quy tắc có hình chữ nhật (cùng Nên sửa 1).
  - Bỏ câu: `ex.song-song-chon-cau-dung` (`[18]`, lặp lời màn quy tắc), một trong hai câu kho ôn phần 1 (`[3]` hoặc `[4]`, Nên sửa 6), `ex.ve-cn-chon-canh` (`[56]`, trùng ý câu `order` và bảng luyện), `ex.truot-eke-song-song` (`[66]`, mẹo ngay trước đã nói), `ex.dan-4-16-cheo` (`[108]`), `ex.dan-4-18-day-lon` (`[114]`) (Nên sửa 23). Thay `thoi-bd-4` (Nghiêm trọng 2) bằng một câu ngắn.
  - Gộp khối "Nhắc lại cho bài 4.8 và bài 4.9" (bốn note) thành một hình bốn hình có tên kèm một câu.
  - Nếu bỏ bước chọn góc (Cần chủ dự án quyết, mục 2), mỗi bảng thoi và bình hành bớt một bước.
- Tách bài (đề xuất của cả ba nhóm, ranh giới chung giữa phần 11 và phần 12): bài A "Nhận biết bốn hình" gồm phần 1–10 (phần 11 bỏ) cùng bài tập sách 4.8, 4.9, khoảng 55 phút; bài B "Vẽ, kiểm tra và ghép hình" gồm phần 12–18 cùng bài tập sách 4.10–4.19, khoảng 55 phút. Không gộp phần 14 với 15 (hai cách vẽ, hai dụng cụ, gộp thành hai quy tắc trong một phần). Việc tách là **quyết định của chủ dự án**: luật `[book-practice]` (`docs/spec.md`) cho mỗi bài thường một phần bài tập sách bài tập cuối bài chép mọi bài tập SBT của bài, nên tách cần đổi luật thành "mỗi bài một phần bài tập SBT, chia theo nội dung". Nếu không tách, ít nhất cắt như trên và để app gợi ý nghỉ sau phần 10 và giữa phần bài tập sách bài tập (sau 4.14).

## Cần chủ dự án quyết

1. **Tách bài 19 thành hai bài** ở ranh giới phần 11/12 (mục "Độ dài"). Cần đổi luật một phần bài tập sách bài tập mỗi bài (mỗi bài nhận một phần bài tập SBT: 4.8, 4.9 cho bài A; 4.10–4.19 cho bài B), đổi id bài, thẻ, `sourceRef`. Chưa tách thì tác giả vẫn sửa mọi Nghiêm trọng trên bài hiện tại.
2. **Bước chọn góc 45°/60°/75° bằng thước đo góc** khi vẽ hình thoi, hình bình hành (Nên sửa 17), thay cho "một đường thẳng bất kỳ qua A" của SGK KNTT. Hai cách: (a) giữ, như đã giữ cách vẽ chuẩn ở Bài 18, vì bảng vẽ cần một góc cụ thể để chấm và 4.14 cần góc 60°; khi đó note phần 13, 14 và `overview.goals[2]` kể thước đo góc, câu quy tắc nói "tạo góc cho trước"; (b) bỏ bước chọn góc ở bảng không có góc (bảng kẻ sẵn một đường nghiêng cố định), chỉ giữ góc 60° của 4.14, vẽ bằng hai tam giác đều (mẹo phần 13, Bài 18 đã dạy). Cách (b) bớt một bước mỗi bảng và bám SGK hơn.
3. Bài 4.10–4.14, 4.18, 4.19 sách không in lời giải; Reviewer đã tự giải và thấy khớp (Nên sửa 30). Chủ dự án ghi nhận.
