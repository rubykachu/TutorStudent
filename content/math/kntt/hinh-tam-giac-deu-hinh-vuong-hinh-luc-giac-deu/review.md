# Review: Hình tam giác đều. Hình vuông. Hình lục giác đều (`hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu`)

- Bài: `content/math/kntt/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff` so với bản đã review ở vòng 2), section: `hinh-deu-quanh-ta`, `tam-giac-deu`, `hinh-vuong`, `duong-cheo-hinh-vuong`, `luc-giac-deu`, `duong-cheo-luc-giac`, `ghep-luc-giac`, `ve-tam-giac-deu`, `ve-hinh-vuong`, `kiem-tra-hinh`, `dem-hinh`, `bai-tap-sach-bai-tap`; mã hình đổi: `git diff a6e42a4 4c3473f -- src/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/ src/visuals/shared/plane/`
- Nguồn đã đọc: `sources/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/` - sbt-p65, sbt-p66, sbt-p115
- `content:check`: 0 lỗi, 1 cảnh báo của bài (112 id chưa khoá)
- Đọc hiểu (Haiku, chữ đổi của vòng 3, theo số dòng trong tệp): lượt 7 108 Hiểu rõ / 22 Hiểu mơ hồ / 0 Khó hiểu (dòng Tổng của tệp ghi 89 / 21 / 2, lệch); lượt 8 (22 mục viết lại) 2 / 10 / 10 (dòng Tổng ghi 2 / 12 / 8, lệch), phần lớn do Haiku đọc rời "compa", "êke" đã dạy ở màn trước; lượt 9 (6 mục) 5 / 1 / 0; tệp `.shots/review/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/doc-hieu-7.md`, `doc-hieu-8.md`, `doc-hieu-9.md`. Mục còn mơ hồ không chặn: quy tắc ghép lục giác "ghép chung một đỉnh ở giữa" (4 chỗ lặp, có hình kèm; Góp ý 3), `$.exercises[54].explain.wrong[2]`, `$.exercises[35].items[3]` ("chỗ hai cung gặp nhau", giữ để một tên cho một thứ)
- `lesson:walk`: 2 FAIL, 0 cảnh báo (ba thiết bị, bản 4c3473f), ảnh trong `.shots/walk/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/`. Cả hai là một lỗi của mã dùng chung, không phải của bài (xem "Ghi chú ngoài bài")
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 1 Nên sửa, 5 Góp ý. Đã chạy `content:hash --approve` (reviewedHash ghi, `status` là `published`).
- Bản đã review: `59f87f85430e6760c401511f8e1477ba01375802225617acd52c72d460c924ca` (`pnpm content:diff` so với bản này)

Quyết định của điều phối ở vòng này:
- Các bước vẽ hình tam giác đều bằng thước và compa (phần 8) và hình vuông bằng thước và êke (phần 9) là nội dung chuẩn SGK KNTT lớp 6 Bài 18, dù trang sách bài tập không in; giữ. Toán đã kiểm lại ở vòng này sau khi quy tắc đổi chữ: vẽ hình vuông phải lấy hai đoạn cùng một bên của cạnh mới ra hình vuông; vẽ tam giác đều đặt kim ở từng đầu cạnh với độ mở bằng cạnh thì hai cung gặp nhau ở đỉnh thứ ba.

## Ghi chú ngoài bài (không tính vào mức của bài)

`lesson:walk` báo hai FAIL cùng một lỗi: `[ipad]` và `[ipad-landscape]` `s12-07-exercise-sbt-4-1-wrong2: out of view [data-feedback-visual]`. Mã dùng chung `src/exercises/exercise-frame.tsx`: lệnh `scrollIntoView` tới hình gợi ý bị WebKit iPad trả vị trí cuộn về khi trang vừa đổi chiều cao; gọi lại sau khoảng 100ms là hết. Lỗi có từ trước và chỉ lộ ra vì câu `ex.noi-vat-voi-hinh` bỏ hình gợi ý nên walk đổi sang câu 4.1. Ảnh `187-s12-07-exercise-sbt-4-1-wrong2.png` cho thấy hình gợi ý hiện đủ nội dung, không có chữ nào của bài bị mất; nội dung bài không cần đổi. Báo người làm app.

## Trạng thái các mục vòng 2

Đã mở từng mục trong `lesson.json`, mã hình, ảnh `visual:shot` và sheet walk để kiểm.

| Mục vòng 2 | Trạng thái |
|---|---|
| Nghiêm trọng 1 (`wrong` 45° dạy điều ngoài sách) | Đã sửa: `ex.cheo-goc-bang-bao-nhieu` `wrong[1]` "Góc 45° nhỏ hơn góc vuông, mà hai đường chéo cắt nhau thành góc vuông 90°." |
| Nghiêm trọng 2 (nhãn "6 cm" của `do-cheo-chinh` bị cạnh cắt) | Đã sửa: ba dòng "AD = 6 cm", "BE = 6 cm", "CF = 6 cm" dưới hình; ảnh walk `089-s6-03-block-shown` ba thiết bị đọc rõ, không chạm nét cạnh |
| Nghiêm trọng 3 (`overview.goals[1]` nói tam giác đều có đường chéo) | Đã sửa đúng chữ đề nghị |
| Nghiêm trọng 4 (`ex.hinh-deu-la-gi` đọc thành "góc của ba hình bằng nhau") | Đã sửa: đề nêu tên ba hình, `explain` và ba `wrong` đều "Trong mỗi hình, …"; cụm "cả ba hình" không còn trong `lesson.json` lẫn mã hình |
| Nên sửa 1 (bảng vẽ "Cùng làm" im lặng khi chọn cạnh khác số đề) | Đã sửa: `warningOf` báo "Cạnh AB phải dài 3 cm." ở bước đặt đỉnh (tam giác) và bước nối (hình vuông); `pnpm exec vitest run tests/visuals/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu.test.tsx` 32/32 đạt |
| Nên sửa 2 (dòng "Hãy bấm Kiểm tra." in đỏ, còn sau khi chấm) | Đã sửa: `Board` có prop `finished`, chữ thường, ẩn khi khung đã chấm (ảnh `195`, `198` phone) |
| Nên sửa 3 (`ex.noi-vat-voi-hinh` không có hình ba vật) | Đã sửa: khối hình đứng đầu đề, nấc 1 tô khối hình, bỏ hình nấc 2 |
| Nên sửa 4 (nhiễu "Chỉ có bốn cạnh") | Đã sửa: "Mỗi góc bằng 60°" và `wrong` đúng; lục giác đều 120° đúng, 60° là tam giác đều đã dạy ở phần 2 |
| Nên sửa 5 (quy tắc vẽ hình vuông thiếu "cùng một bên") | Đã sửa: quy tắc, recap phần, recap thẻ, khối "Nhắc lại", mẹo `lay-doan-bang-compa`, mục `lay` và `explain` của `ex.xep-buoc-ve-hinh-vuong`, câu mới `ex.buoc-tiep-theo-ve-hinh-vuong`; ba chỗ lặp nguyên văn giống nhau |
| Nên sửa 6 (vòng "?" của `dem-cung-lam` chồng nhau) | Sửa một phần: DGH thành nút riêng, còn 9 mục (7 vòng + 2 nút) đếm đúng 9 hình; vòng "?" của tam giác nhỏ ở đỉnh D cách vòng giữa khoảng 32pt trên điện thoại (Góp ý 5) |
| Nên sửa 7 (vòng góc chồng vòng cạnh ở hai hình kiểm tra) | Đã sửa: cạnh EF là cạnh mẫu, vòng cạnh HE đặt xa góc E; ảnh phone `kiem-cung-lam`, `kiem-hinh-thoi-efgh` thấy các vòng tách rõ |
| Nên sửa 8 (nhiễu phần 10 vô lý) | Đã sửa theo đề nghị; còn Góp ý 1 |
| Nên sửa 9 (nhiễu "Đoán số hình vuông") | Đã sửa: nhiễu `cong-mot`, lựa chọn đúng rút gọn; còn Góp ý 2 |
| Nên sửa 10 (`ex.canh-thu-tu-7` trùng câu phần 3) | Đã sửa: thay bằng `ex.buoc-tiep-theo-ve-hinh-vuong` (tự giải: đáp án duy nhất là lấy hai đoạn bằng MN cùng một bên; nối thêm MN và vẽ cung đều sai) |
| Nên sửa 11 (màu khái niệm ở ba hình) | Sửa một phần: viền hình vuông lớn, nút DEF, `sbt-4-4a-giai`, `equalDiagonals` đã đổi màu; nhưng `dem-luoi-giai` bỏ luôn khác biệt giữa hai hình vuông lớn (Nên sửa 1) |
| Nên sửa 12 (nhiễu 4.7a loại bằng đếm chữ cái) | Đã sửa: ACNDFR và AEPDBS; kiểm trên Hình 4.8 xong (mục "Câu sách" bên dưới) |
| Nên sửa 13 (hình gợi ý 4.2, 4.3 trùng tên điểm của đề) | Đã sửa: hình gợi ý vẽ ABC và ABCD cạnh 3 cm, đề là MNP cạnh 4 cm và DEFQ cạnh 5 cm; hình dừng trước điểm thứ ba (4.2) và trước hai đường chéo (4.3) |
| Nên sửa 14 (hình đo sách nhỏ, tên điểm khoảng 11px) | Đã sửa: các hình đo cho rộng tới 1,5 lần (hình 4.4b 1,35 lần); tên điểm trên ảnh phone `sbt-4-4b-do`, `sbt-4-5b-do`, iPad `sbt-4-5a-do` cao khoảng 12 đến 14pt (chữ khoảng 17 đến 19px); sáu vòng "?" của 4.4b tách rõ |
| Nên sửa 15 ("gặp nhau", "cắt nhau", "chạm nhau") | Đã sửa: `ex.mo-compa-bao-nhieu` `wrong[1]` không còn "cắt nhau"; "gặp nhau" dành cho đỉnh thứ ba, "chạm nhau" cho độ mở bằng nửa cạnh |
| Góp ý 1, 2, 3, 5, 6, 7, 8, 9, 11, 14, 15, 16 | Đã sửa |
| Góp ý 4 (`solutionVisualId` của `ex.chon-hinh-deu`), 10 (`ve-hv-quy-tac` chỉ hình xong), 12 (bảng vẽ điện thoại nhỏ), 13 (hình `kiem-quy-tac`, `dem-dai-ba-tam-giac` nhỏ) | Chưa sửa, giữ ở Góp ý 4 |
| Góp ý 17 (recap phần 12 chỉ một quy tắc) | Ghi nhận theo quyết định tuỳ tác giả; giữ |

## Câu sách (so với ảnh)

- 4.5a (`ex.sbt-4-5a`): đề y hệt tr.65; hình ABC đo trên ảnh AB = AC khoảng 398, BC khoảng 310, nên "AB và AC bằng nhau, BC ngắn hơn" đúng; đáp án "không phải" khớp tr.115. Hai câu dẫn (`dan-4-5a-compa-khit` đáp án "có", `dan-4-5a-compa-khit-hai-canh` đáp án "không") đều nêu đúng câu sách kế tiếp ở `leadsTo`, đề dùng tên XYZ khác ABC, không lộ số, mỗi câu sách có đúng 2 câu dẫn.
- 4.5b (`ex.sbt-4-5b`): thứ tự khối "Quan sát Hình 4.6." rồi hình 4.6, hình đo MNPQ, "Dùng compa và êke (hoặc thước đo góc) để kiểm tra xem hình MNPQ có là hình vuông không.", "Chọn đáp án đúng." (khối lệnh của app cuối đề). Lời đề đúng từng chữ tr.65; nấc 1 tô hình đo (`index: 2`) đúng chỗ bé cần nhìn lại; MNPQ đo trên ảnh bốn cạnh 169 đến 170, đáp án "là hình vuông" khớp tr.115.
- 4.7a (`ex.sbt-4-7a`): đề "Hãy kiểm tra xem có mấy hình lục giác đều. Đó là những hình nào?" y hệt tr.66; đáp án ABCDEF và MNPQRS khớp tr.115. Tự dựng toạ độ Hình 4.8 (cạnh 1; A(0;0), F(1;0), E(1,5;0,87), D(1;1,73), C(0;1,73), B(−0,5;0,87)): ACNDFR đi A→C trên AC, C→N trên CE, N→D trên BD, D→F trên DF, F→R trên BF, R→A trên AE; N(0,5;1,44), R(0,5;0,29); sáu cạnh dài 1,73; 0,58; 0,58; 1,73; 0,58; 0,58, là đường gấp khúc kín không tự cắt, không đều, `wrong` "AC dài hơn CN" đúng. AEPDBS đi A→E trên AE, E→P trên CE, P→D trên DF, D→B trên BD, B→S trên BF, S→A trên AC; P(1;1,16), S(0;0,58); sáu cạnh 1,73; 0,58; 0,58; 1,73; 0,58; 0,58, đường gấp khúc kín không tự cắt, không đều, `wrong` "AE dài hơn EP" đúng. Mọi cạnh của hai hình đều nằm trên đoạn có vẽ trong Hình 4.8; hai hình không phải thứ tự đỉnh xáo của hình đều nên không thành bẫy; chỉ ABCDEF và MNPQRS đều.
- 4.2, 4.3: đề tr.65 y hệt (không đổi trong diff); hình gợi ý đổi tên và số như đã kiểm ở bảng trên.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Lời giải của `ex.dem-hinh-vuong-hai-hang`: hai hình vuông lớn cùng màu cùng nét, bé chỉ thấy ba cột

- Vị trí: `visual.dem-luoi-giai` (`catalog.ts`, `outlined` hai phần tử `tone: "pink"`), dùng ở `$.exercises[51].hints.solutionVisualId` (`ex.dem-hinh-vuong-hai-hang`). LL-15, LL-20.
- Nguồn: `visual:shot` `dem-luoi-giai-phone.png`, `dem-luoi-giai-ipad.png`.
- Vấn đề: bản sửa vòng 2 (Nên sửa 11) đổi `amber` và `blue` thành cùng `pink` mà không có cách phân biệt khác (hàm `outlined` không có nét đứt). Hai hình vuông lớn (cột 1 đến 2 và cột 2 đến 3) chồng nhau ở cột giữa nên viền của chúng thành bốn đường dọc cùng màu: ảnh chỉ còn ba hình chữ nhật cao một ô, không có hình vuông lớn nào để đếm, trong khi dòng chữ nói "6 + 2 = 8 hình vuông". Đây là nấc 3 của câu khó nhất phần 11, nên hình phải chỉ ra hai hình vuông lớn.
- Sửa: vẽ hai khung liên tiếp (hình vuông lớn bên trái, rồi bên phải) bằng `steps`, hoặc thêm trường nét đứt vào `outlined` của `squareGrid` (`figures.ts` của bài) để một hình liền một hình đứt, cùng màu `pink`. Chụp lại `visual:shot`.

## Góp ý

### 1. Hai lựa chọn "Chưa biết, phải …" đứng cạnh nhau, đáp án đúng là lựa chọn duy nhất khác kiểu

- Vị trí: `$.exercises[46].options` (`ex.kiem-bon-canh-bon-goc`: `canh`, `compa` cùng bắt đầu "Chưa biết"; `vuong` đúng), `$.exercises[49].options` (`ex.kiem-compa-ba-canh`: `eke` "Chưa biết…", `lech`, `td` đúng). LL-14.
- Nguồn: —
- Vấn đề: ở câu 46 bé chọn được đáp án "Hình vuông" chỉ vì hai lựa chọn kia lặp "Chưa biết", không cần kiểm tra gì. Bản sửa theo đúng đề nghị vòng 2 nên không đòi sửa; ghi để tác giả biết.
- Sửa (tuỳ): đổi một lựa chọn "Chưa biết" thành một hình thật như "Hình chữ nhật" chỉ khi đề cho kích thước loại được (không dùng nếu hình vuông cũng là hình đó).

### 2. Nhiễu "Đếm các ô vuông nhỏ rồi cộng thêm 1 cho hình lớn nhất" đúng với hình 2 ô × 2 ô bé vừa xem

- Vị trí: `$.exercises[54].options[3]` (`ex.dem-cach-dem-dung`, id `cong-mot`) và `.explain.wrong[2]`. LL-14.
- Nguồn: walk `161-s11-01-block-end` ("Thêm 1 hình vuông lớn: tất cả 5 hình"), `162-s11-02-block` ("4 + 1 = 5 hình vuông").
- Vấn đề: hai màn ngay trước cho thấy đúng cách "đếm 4 ô nhỏ rồi thêm 1 hình lớn". Đề hỏi cách đếm chung và `wrong` đã nói "có thể có nhiều hình vuông lớn", nên đáp án vẫn đúng một, nhưng bé có thể phân vân vì lựa chọn này khớp ví dụ vừa xem.
- Sửa (tuỳ): trong `wrong` thêm ví dụ bé đã gặp: "Hình hai hàng ba ô có 6 ô nhỏ và 2 hình lớn hơn, cộng thêm 1 là thiếu."

### 3. Ghép hình lục giác đều: ba cách nói "chung một đỉnh ở giữa", "quanh một điểm", "có chung một đỉnh"

- Vị trí: `$.sections[6].blocks[1].children[0]` (`rule: true`), recap phần, recap thẻ, khối "Nhắc lại" `$.sections[11].blocks[3].children[1]` (cụm "ghép chung một đỉnh ở giữa"); `$.exercises[31].prompt[0]`, `.explain.text` (`ex.can-may-mieng`: "ghép quanh một điểm", "xếp quanh một điểm"); `$.exercises[72].explain.text` (`ex.dan-4-6-ghep`: "xếp quanh một điểm"); `$.exercises[74].explain.text` (`ex.sbt-4-6`: "có chung một đỉnh"). LL-05, LL-25.
- Nguồn: tr.66 bài 4.6 (`sbt-p66.png`), `doc-hieu-7.md`.
- Vấn đề: một cách ghép được nói ba cách; Haiku chấm cụm trong quy tắc "mơ hồ" ở cả 4 chỗ lặp. Hình kèm theo cho thấy sáu tam giác quanh điểm giữa nên không chặn.
- Sửa (tuỳ): chọn một cụm, vd "xếp quanh một điểm ở giữa", dùng ở quy tắc (đổi cả bốn chỗ lặp nguyên văn) và ở ba câu trên.

### 4. Bốn Góp ý vòng 2 còn nguyên

- Vị trí: (a) `$.exercises[2].hints.solutionVisualId` = `visual.ba-hinh-deu` không chỉ lựa chọn nào đúng (`ex.chon-hinh-deu`); (b) `visual.ve-hv-quy-tac` (`$.sections[8].blocks[1].children[1]`, recap phần, recap thẻ) chỉ có hình vuông đã xong, lệch trái khung trên điện thoại; (c) `construct.tsx` `BOARD_MAX_HEIGHT` ("max(188px, …)") giữ bảng vẽ nhỏ trên điện thoại; (d) `visual.kiem-quy-tac` (hai hình thu nhỏ, cũng là recap phần 10 và 12), `visual.dem-dai-ba-tam-giac` còn nhỏ giữa khung.
- Nguồn: walk phone `144-s9-08-recap`, `116-s8-03-block-shown`, `148-s10-02-block`.
- Vấn đề và sửa: như Góp ý 4, 10, 12, 13 của vòng 2.

### 5. Điện thoại, màn "Cùng làm" phần 11: hai vòng "?" gần nhau và lời kết bị thanh nút che

- Vị trí: `visual.dem-cung-lam` (`$.sections[10].blocks[2].children[1]`).
- Nguồn: walk phone `163-s11-03-block`, `164-s11-03-block-shown`; `visual:shot` `dem-cung-lam-phone.png`.
- Vấn đề: vòng "?" của tam giác nhỏ trên cùng (đỉnh D) cách vòng của tam giác nhỏ ở giữa khoảng 32pt (65px trên ảnh 2×), vùng chạm 48pt chồng nhau phần rìa; chạm vào tâm vòng nhìn thấy vẫn đúng. Ảnh `164` cho thấy dòng "Có 9 hình tam giác đều: 4 hình nhỏ, …" bị thanh nút ở đáy che mất nửa sau; hai nút xếp hai hàng làm màn dài thêm. iPad hiện đủ.
- Sửa (tuỳ): đặt hai nút cùng một hàng, hoặc rút bớt khoảng trống phía trên hình để lời kết nằm trong khung.

## Câu mới và câu đổi đã tự giải

`ex.buoc-tiep-theo-ve-hinh-vuong` (lấy hai đoạn cùng một bên), `ex.dan-4-5a-compa-khit-hai-canh` ("không"), `ex.lg-chon-cau-dung` (ý đúng: sáu cạnh, sáu góc; 60° và 90° sai), `ex.cheo-chinh-noi-nao` ("Hai đỉnh đối diện nhau"), `ex.kiem-bon-canh-bon-goc` ("Hình vuông"), `ex.kiem-compa-ba-canh` ("Hình tam giác đều"), `ex.dem-cach-dem-dung` ("Đếm hình nhỏ, rồi đếm thêm hình lớn ghép từ chúng"), `ex.noi-vat-voi-hinh` (gạch với hình vuông, tổ ong với hình lục giác đều, biển báo với hình tam giác đều), `ex.dan-4-1-noi-ten` (tam giác đều với `dan-td-xoay`: tam giác đều quay 30°, ba cạnh bằng nhau), `ex.mo-compa-bao-nhieu` (8 cm; `wrong` 4 cm và 6 cm đúng), `ex.xep-buoc-ve-tam-giac-deu` và `ex.xep-buoc-ve-hinh-vuong` (thứ tự duy nhất: cạnh, dụng cụ, điểm hay cung, nối; khớp từng câu quy tắc), `ex.hinh-deu-la-gi`, `ex.sbt-4-5a`, `ex.sbt-4-5b`, `ex.sbt-4-7a`.

Nhất quán trong section: bốn bản của mỗi câu `rule: true` (quy tắc, recap phần, recap thẻ, "Nhắc lại") trùng nguyên văn ở các phần 7, 8, 9; `overview.goals[1]` khớp phần 4 và 6; mẹo `mo-compa-mot-lan` ("Vẽ hai cung tròn của tam giác đều", tránh sai) và `lay-doan-bang-compa` (làm nhanh) đúng với quy tắc mới.

## Vòng 4: lời đọc giới thiệu và ba video (chỉ phần đổi, Sonnet)

- Phạm vi: `overview.narration` (Gemini Achird) và ba video `ba-hinh-deu`, `ve-tam-giac-deu`, `ghep-luc-giac` (giọng Hải Đăng), mỗi video là khối đầu của phần `hinh-deu-quanh-ta`, `ve-tam-giac-deu`, `ghep-luc-giac`.
- Kết quả reviewer: 0 Nghiêm trọng, 4 Nên sửa, 6 Góp ý.
- Nên sửa, đã sửa hết: (1) câu "Bạn cú cần một thước và một compa." đổi thành "Bạn chỉ cần một thước và một compa." vì Whisper nghe thành "cứ"; (2) hình `ve-tam-giac-deu` hiện từng cung theo lời (thêm khung chỉ có cung đầu, dựng bằng `constructFigure`); (3) chip "Hai cung tròn gặp nhau" đổi từ violet (màu của góc) sang slate; (4) bỏ cảnh đường chéo khỏi `ba-hinh-deu` vì card `hinh-deu` chỉ dạy cạnh và góc bằng nhau, đường chéo có hai phần riêng; video còn một ý.
- Góp ý đã nhận: nhãn và tiêu đề dùng "hình tam giác đều", "hình lục giác đều", tiêu đề "Ba hình quanh ta"; chip tên hình lên 8 px để không chạm dải phụ đề.
- Góp ý để nguyên: cảnh đổi giữa khoảng lặng nên thẻ hiện sớm hơn lời khoảng 0,5 s (sửa ở mã dựng dùng chung, đổi mọi video, không làm ở đây); tô lime cho hình lục giác ở `ghep-luc-giac` (hình lấy nguyên từ bài); Whisper nghe "tam giác" thành "tâm giác" ở vài câu dù khớp ≥ 0,98 sau chuẩn hoá (không có công cụ nghe âm thanh; chủ dự án nên nghe lại trên iPad).
