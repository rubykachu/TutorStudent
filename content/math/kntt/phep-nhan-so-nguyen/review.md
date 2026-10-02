# Review: Phép nhân số nguyên (`phep-nhan-so-nguyen`)

- Bài: `content/math/kntt/phep-nhan-so-nguyen/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/phep-nhan-so-nguyen/` - sbt-p55, sbt-p56, sbt-p57 (đề), sbt-p112, sbt-p113 (lời giải)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (96 id chưa có trong `ids.lock.json`: đúng, bài chưa được duyệt nên chưa khoá id)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy trước lệnh `--approve` ở vòng sau)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-nhan-so-nguyen/`
- Kết luận: Chưa đạt: còn 5 lỗi Nghiêm trọng (5 Nghiêm trọng, 17 Nên sửa, 20 Góp ý). Đã chạy `pnpm content:hash phep-nhan-so-nguyen --root content --mark`; bài giữ `draft`.
- Bản đã review: `659b7828c4ac295431c4d8685aeda62e9a0d47c350b1682b15995fb7a43593fe` (`pnpm content:diff` so với bản này)

Ba reviewer đã tự giải cả 63 exercise trước khi đọc đáp án: mọi `answer`, `check`, `accept` khớp, không nhiễu nào cũng đúng (LL-01), không `explain`/`wrong` nào gọi lựa chọn theo vị trí (LL-26). Ba mẹo đã thử trên số biên: `tip.nhan-voi-am-1` và `tip.dem-thua-so-am` đúng mọi đầu vào; `tip.gop-thua-so-chung` sai với hiệu hai tích (mục 3). Recap của 12 section và 12 card lặp nguyên văn câu `rule: true`; màu khái niệm nhất quán cả bài (dương `lime`, âm `pink`, số 0 `slate`, khớp glossary).

## Nghiêm trọng

### 1. Năm section viết phép nhân ngược quy ước "m · n là m lấy n lần"

- Vị trí: LL-05.
  - `$.sections[1].blocks[0].children[0].text`, hình `visual.tui-ke-0` (nhãn "4 túi, mỗi túi 0 viên" với `4 · 0`), `$.exercises[8].explain` và `check.expr` (`ex.tui-ke-trong`, "7 túi" giải là `7 · 0`) (`section.nhan-voi-0`).
  - `$.sections[6].blocks[0].children[0].text` và hình `visual.mua-but` ("2 hộp, mỗi hộp 5 cây, mỗi cây 3 nghìn" viết `2 · 5 · 3`); `$.exercises[36].explain` và `check.expr` (`ex.thung-hop-banh`, "3 thùng, mỗi thùng 5 hộp" giải `3 · 5 = 15`) (`section.giao-hoan-ket-hop`).
  - `$.sections[8].blocks[0].children[0].text` và hình `visual.mua-ba-phan` ("3 phần, mỗi phần 5 + 4 nghìn" viết `3 · (5 + 4)`) (`section.phan-phoi`).
  - `$.sections[9].blocks[0].children[0].text` và hình `visual.gop-hop-keo` ("7 hộp, mỗi hộp 6 xanh và 4 đỏ" viết `7 · 6 + 7 · 4`) (`section.gop-thua-so`).
  - `$.sections[11].blocks[0].children[0].text`, hình `visual.thay-doi-vai` (`20 · x`, `20 · 3`, `20 · (−2)`), `$.exercises[59].explain` và `check.expr` (`ex.vai-20-bo`, `20 · (−3)`) (`section.bai-toan-thuc-te`).
- Nguồn: tr.55, `sbt-p55.png` (sách chỉ có `a · 0 = 0` và các tính chất, không có các tình huống này)
- Vấn đề: câu quy tắc đầu bài ("Nhân một số âm với một số dương là cộng lặp lại số âm đó", `(−2) · 3 = (−2) + (−2) + (−2)`) chốt số đứng trước là lượng của mỗi lần. Section 3, 4, 5, 11 (túi kẹo `x · y`) và cùng làm của section 12 theo đúng quy ước; năm section trên viết ngược. Ngay màn sau quy tắc đầu, section `nhan-voi-0` đã viết `4 · 0 = 0 + 0 + 0 + 0` (cộng lặp lại số đứng sau). Section 12 còn tự mâu thuẫn: câu quy tắc "thay đổi mỗi lần nhân với số lần" (tức `x · 20`) đứng ngay dưới note và hình viết `20 · x`. Bé học chậm gặp hai cách đọc cho cùng một cách viết, dễ cộng lặp nhầm số ở các câu "cộng lặp lại" và nhớ sai quy tắc của section 12. `pitfalls.md` (mục phép nhân "n nhóm, mỗi nhóm m") yêu cầu một thứ tự cả bài, kể cả đề, hình, lời giải; section giao hoán chỉ được đổi chỗ sau khi đã viết đúng thứ tự. Gộp từ nhóm 1 (Nghiêm trọng), nhóm 2 (Nên sửa, mục mua bút và thùng bánh), nhóm 3 (Nên sửa, mục ba tình huống); giữ mức cao hơn vì đây là màn mẫu dạy cách đọc phép nhân và có chỗ trái chính câu quy tắc.
- Sửa:
  - `nhan-voi-0`: "Lan có 4 túi rỗng, mỗi túi 0 viên kẹo. Số kẹo là 0 · 4 = 0 + 0 + 0 + 0 = 0."; hình `tui-ke-0` đổi `4 \cdot 0` thành `0 \cdot 4`; `tui-ke-trong` giải "0 · 7, tức 0 lấy 7 lần", sửa `tex`, `check.expr` thành `0·7`; đề viết "túi rỗng".
  - `giao-hoan-ket-hop`: viết `3 · 5 · 2` (nhóm `(3 · 5) · 2 = 15 · 2` và `3 · (5 · 2) = 3 · 10`), sửa hình `mua-but`. `thung-hop-banh`: `4 · 5 · 3`, giải "4 · 5 = 20 cái mỗi thùng, rồi 20 · 3 = 60", sửa `check.expr`.
  - `phan-phoi`, `gop-thua-so`: kể lại tình huống để số ngoài ngoặc là lượng mỗi nhóm, giữ công thức, vd "Mỗi vé xe buýt 3 nghìn; sáng đi 5 lượt, chiều đi 4 lượt: 3 · 5 + 3 · 4 = 3 · (5 + 4)"; "Mỗi hộp có 7 viên kẹo; Lan có 6 hộp, Minh có 4 hộp: 7 · 6 + 7 · 4 = 7 · (6 + 4)". Sửa hình theo.
  - `bai-toan-thuc-te`: viết `x · 20`, `3 · 20`, `(−2) · 20`, `(−3) · 20` ở note, hình `thay-doi-vai`, `vai-20-bo` (`explain`, `tex`, `check.expr`).
  - Sửa xong, soát lại mọi đề có "mỗi" (đã soát vòng này: `nhiet-do-cach-day-3`, `thang-may-xuong`, `cach-day-3-gio` đúng quy ước).

### 2. Hai câu quy tắc liền nhau trái nhau: "đổi chỗ, nhóm tuỳ ý" và "tính từ trái sang phải"

- Vị trí: `$.sections[7].blocks[1].children[0].text`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption`, hình `visual.nhieu-thua-so-vi-du` (nhãn "nhân từ trái sang phải"); đối chiếu `$.sections[6].blocks[1].children[0].text` và recap `card.giao-hoan-ket-hop`; `$.exercises[42].explain` (`ex.dem-hai-so-am`). LL-05.
- Nguồn: tr.55, `sbt-p55.png` (kiến thức cần nhớ 3: trong tích nhiều thừa số có thể đổi chỗ, nhóm tuỳ ý)
- Vấn đề: section 7 dạy "ta được đổi chỗ các thừa số và nhóm các thừa số tuỳ ý" và các câu "tính nhanh bằng cách đổi chỗ"; ngay sau đó section 8 dạy bằng câu `rule: true` "Tích nhiều thừa số được tính từ trái sang phải", trích đúng trang nguồn nói điều ngược lại. Hai thẻ ôn hiện riêng trong phiên ôn nên bé có thể nhớ "phải tính từ trái sang phải" và thôi đổi chỗ. Chính `explain` của `dem-hai-so-am` và mẹo `dem-thua-so-am` cũng không làm từ trái sang phải. Điều các câu của section thật sự hỏi (dấu của tích nhiều số) chỉ nằm trong mẹo nên thẻ ôn không có. Nhóm 2 xếp Nên sửa vì kết quả tính vẫn đúng; Tổng hợp nâng lên Nghiêm trọng vì hai quy tắc cùng có `rule: true`, nằm trong recap thẻ ôn và cho hai chỉ dẫn trái nhau (trẻ nhớ sai quy tắc).
- Sửa: câu quy tắc thành ý dấu, vd "Tích nhiều thừa số khác 0 có số thừa số âm chẵn thì dương, lẻ thì âm.", recap section và card lặp nguyên văn; nhân lần lượt từng cặp để làm ví dụ mẫu (hình `nhan-tung-cap`), đổi nhãn hình `nhieu-thua-so-vi-du`. Khi đó mẹo `dem-thua-so-am` trùng câu quy tắc: đổi mẹo sang ý khác (vd "có thừa số 0 thì tích bằng 0, không cần nhân") hoặc bỏ. Nếu muốn giữ cách nhân lần lượt trong câu quy tắc thì viết "có thể nhân lần lượt từ trái sang phải" để không trái section 7.

### 3. Quy tắc và mẹo "đưa thừa số chung ra ngoài" cho kết quả sai với hiệu hai tích, dạng của bài 3.32 mà section trích

- Vị trí: `$.sections[9].blocks[3]` (`tip.gop-thua-so-chung`); câu quy tắc `$.sections[9].blocks[1].children[0].text`, `$.sections[9].recap.caption`, `$.cards[9].recap.caption`. LL-24, LL-05.
- Nguồn: tr.57 bài 3.32, `sbt-p57.png`; lời giải tr.113, `sbt-p113.png`
- Vấn đề: `sourceRef` là "tr.55 (ví dụ 1), tr.57 (bài 3.32)"; cả hai ý của bài 3.32 là hiệu hai tích (lời giải viết `20 · (−9) − 20 · 21 = 20 · (−9 − 21)`). Câu quy tắc và mẹo chỉ nói "các tích có chung một thừa số … cộng các thừa số còn lại", không nêu điều kiện "tổng hai tích". Làm đúng từng chữ: `20 · (−9) − 20 · 21` ra 240 thay vì −600; `4 · 7 − 4 · 2` ra 36 thay vì 20. Thêm nữa, quy tắc nói "các tích … các thừa số còn lại" còn mẹo nói "hai tích … hai số còn lại": cùng một ý hai cách nói (Tổng hợp phát hiện).
- Sửa: nói điều kiện ngay trong câu quy tắc, vd "Khi cộng hai tích có chung một thừa số, ta đưa thừa số đó ra ngoài rồi cộng hai thừa số còn lại.", sửa nguyên văn ở note, recap section, recap card; mẹo dùng đúng lời đó ("Nếu đề là tổng hai tích có chung một thừa số …"). Hoặc dạy thêm hiệu `a · b − a · c = a · (b − c)` với một ví dụ nếu muốn giữ bài 3.32 trong `sourceRef` (xem mục 39).

### 4. Ví dụ của mẹo bị cắt trên điện thoại, đọc thành "= −9"

- Vị trí: `$.sections[9].blocks[3].tex` (`tip.gop-thua-so-chung`). LL-12.
- Nguồn: —
- Vấn đề: dòng `= 9 · [(−6) + (−4)] = −90` rộng hơn khung mẹo trên điện thoại; ảnh `phone/112-s10-04-block.png` cho thấy số cuối bị cắt thành "−9". Bé đọc một kết quả sai ngay trong ví dụ mẫu. Lỗi do chữ của bài (dòng TeX dài); walk không đo tràn trong khung mẹo.
- Sửa: ba dòng trong `gathered`: `9 · (−6) + 9 · (−4)`, `= 9 · [(−6) + (−4)]`, `= 9 · (−10) = −90`. Đổi cặp 6 và 4 theo mục 14 thì giữ cách xếp ba dòng.

### 5. Trên điện thoại, dòng đầu của lời giải bị cắt đúng ở bước đổi chỗ

- Vị trí: `$.exercises[32].explain.tex` (`ex.tinh-nhanh-am4-3-am5`), `$.exercises[33].explain.tex` (`ex.tinh-nhanh-am25-3-am4`); soát luôn `$.exercises[35].explain.tex` (`ex.dien-so-ket-hop`, dòng đơn còn dài hơn, walk chưa chụp). LL-12.
- Nguồn: —
- Vấn đề: dòng `(-4)·3·(-5) = (-4)·(-5)·3` trong khối `gathered` rộng hơn màn điện thoại, bị cắt thành "(−4)·3·(−5) = (−4)·(·" (ảnh `phone/082-s7-04-exercise-tinh-nhanh-am4-3-am5-correct.png`); câu 33 mất `·(−4)·3` (ảnh `084-…-correct.png`). Phần mất chính là bước đổi chỗ mà section dạy. iPad hiện đủ.
- Sửa: mỗi bước một dòng: `(-4)·3·(-5) \\ = (-4)·(-5)·3 \\ = 20·3 = 60`; tương tự `(-25)·3·(-4)` và `dien-so-ket-hop`.

## Nên sửa

### 6. Hình gợi ý nấc 2 chỉ hiện lại đề và một dấu "?"

- Vị trí: `$.exercises[1].hints.hintVisualId` (`ex.tinh-am5-nhan3`, hình `goi-y-am4-nhan2`); `$.exercises[15].hints.hintVisualId` (`ex.tinh-8-nhan-am4`, hình `goi-y-khac-dau-9-nhan-am2`). LL-15.
- Nguồn: —
- Vấn đề: hình `lines` chế độ `hint` luôn ẩn dòng cuối; hai hình chỉ có hai dòng nên dòng mang cách làm ("= (−4) + (−4)", "= −(9 · 2)") bị ẩn. Ảnh walk `017-s1-05-exercise-tinh-am5-nhan3-wrong2` và `visual:shot`: bé chỉ thấy đề rồi "?".
- Sửa: thêm dòng kết quả cuối để bị ẩn: `(-4) · 2` → `= (-4) + (-4)` → `= -8`; `9 · (-2)` → `= -(9 · 2)` → `= -18` (nhãn bước theo thứ tự của mục 9). Xem lại ảnh `visual:shot`.

### 7. Câu thao tác `thu-4-nhan-am2` không kiểm được tích bé tìm

- Vị trí: `$.exercises[13]` (`ex.thu-4-nhan-am2`, hình `thu-4-nhan-am2`, validator `dat-thua-so`). LL-02.
- Nguồn: —
- Vấn đề: đề "Tìm 4 · (−2) … rồi đọc tích", nhưng bảng `factorTry` tự in tích mỗi hàng và validator chỉ chấm thừa số thứ hai bằng −2. Bấm xuống bốn lần là đạt, không phải tính, không có chỗ nhập tích.
- Sửa: đổi thành câu `numeric` "Tính 4 · (−3)" (tránh trùng hình `no-moi-ngay`, mục 10) dùng bảng quy luật dừng ở "?" làm hình gợi ý; hoặc cho `factorTry` chế độ bài tập ẩn tích hàng mới nhất rồi hỏi tích bằng câu nhập số.

### 8. Section "Số dương nhân số âm" dùng cách làm của section sau

- Vị trí: `$.sections[2].recap` và `$.sections[2].blocks[2]` (hình `duong-nhan-am-vi-du`, cũng là recap `card.duong-nhan-am`); `$.exercises[11].explain.text` (`ex.tinh-7-nhan-am3`). LL-09.
- Nguồn: tr.55, `sbt-p55.png`
- Vấn đề: hình quy tắc và recap viết `2 · (−5) = −(2 · 5) = −10` mà section chưa giải thích bước `−(2 · 5)`; `explain` của `tinh-7-nhan-am3` dùng "Nhân hai phần số tự nhiên", quy tắc của section `khac-dau`.
- Sửa: hình dùng quy luật (`2 · 0 = 0`, `2 · (−1) = −2`, …) hoặc chỉ ghi `2 · (−5) = −10` với nhãn "tích âm"; `explain` giải bằng quy luật: "7 · 0 = 0, thừa số thứ hai giảm 1 thì tích giảm 7: −7, −14, −21."

### 9. Hai thứ tự bước cho quy tắc nhân hai số khác dấu

- Vị trí: `$.sections[3].blocks[1].children[0].text` và recap (nhân trước rồi viết dấu −); `$.sections[3].blocks[2].children[0].text` (ví dụ mẫu: xét dấu trước rồi nhân); hình `khac-dau-mau` (tag "khác dấu: viết dấu − ở trước" trước bước nhân); nhãn hình `goi-y-khac-dau-9-nhan-am2` ("viết dấu − ở trước rồi nhân"); `$.exercises[28].explain.text` (`ex.noi-tich-voi-ket-qua`, "Xét dấu trước … Rồi nhân", Tổng hợp thêm); `$.exercises[15].explain.text` theo câu quy tắc. LL-05.
- Nguồn: tr.55, `sbt-p55.png`
- Vấn đề: kết quả không đổi, nhưng một quy tắc được dạy với hai thứ tự bước trong cùng section và ở câu ôn.
- Sửa: chốt một thứ tự, gợi ý giữ câu quy tắc; ví dụ mẫu thành "Nhân hai phần số tự nhiên 6 · 3 = 18, rồi viết dấu − ở trước vì hai số khác dấu."; hình `khac-dau-mau` `6 · (−3)` → `6 · 3 = 18` → `= −18`; nhãn hình gợi ý và `explain` câu 28 đổi theo.

### 10. Câu kho ôn nhóm 1 lặp số của recap, hình và của nhau

- Vị trí: `$.exercises[18].options[1]` (6 · (−2), trùng recap `duong-nhan-am-vi-du`); `$.exercises[18].options[3]` và `$.exercises[19].items[1]` ((−2) · 5 ở hai câu cùng card); `$.exercises[12].options[0]` và `$.exercises[19].items[0]` (3 · (−4)); `$.exercises[13]` (4 · (−2) = −8, trùng hình `no-moi-ngay`). LL-07.
- Nguồn: —
- Vấn đề: phiên ôn hỏi lại tích bé vừa thấy kết quả.
- Sửa: `chon-tich-am12` dùng 4 · (−3) và (−2) · 7; `xep-tich-khac-dau` dùng 2 · (−6), (−3) · 3, (−1) · 7; `thu-4-nhan-am2` (nếu giữ) dùng 4 · (−3).

### 11. Câu kho ôn nhóm 2 lặp số của hình và recap

- Vị trí: `$.exercises[24]` (`ex.nhiet-do-cach-day-3`), `$.exercises[23].options[1]` (`ex.chon-tich-12`). LL-07.
- Nguồn: —
- Vấn đề: `nhiet-do-cach-day-3` hỏi (−3) · (−2) = 6 đúng câu chuyện của hình `quy-luat-am3-nhan` và `bon-truong-hop`; lựa chọn đúng (−2) · (−6) = 12 là hàng recap `am-nhan-am-vi-du`.
- Sửa: "giảm đều 4 độ, cách đây 3 giờ" ((−4) · (−3) = 12); lựa chọn b thành (−1) · (−12).

### 12. Đề `dem-hai-so-am` đọc thành "tích có hai số âm"

- Vị trí: `$.exercises[42].prompt[0]` (`ex.dem-hai-so-am`). LL-10.
- Nguồn: —
- Vấn đề: chủ ngữ "Tích của bốn số khác 0 có đúng hai số âm" là "Tích".
- Sửa: "Có bốn số khác 0, trong đó đúng hai số là số âm. Tích của bốn số đó là số nào?"

### 13. Section `nhieu-thua-so` không có ví dụ đời sống

- Vị trí: `$.sections[7]` (`section.nhieu-thua-so`), câu 37 đến 42. LL-16.
- Nguồn: —
- Vấn đề: luật "Ví dụ đời sống ở mọi section Toán"; cả section chỉ có phép tính.
- Sửa: thêm một ví dụ hay câu đời sống ba thừa số số nhỏ, đúng quy ước `m · n` (mục 1).

### 14. Cặp số 6 và 4 lặp khắp section 10, câu ôn `dien-so-gop` có đáp án in sẵn trên màn quy tắc

- Vị trí: `$.exercises[50]` (`ex.dien-so-gop`), `$.exercises[49]` (`ex.tinh-hop-li-am4`); hình `gop-hop-keo`, `gop-thua-so-vi-du`, `$.sections[9].blocks[3].tex`. LL-07.
- Nguồn: —
- Vấn đề: hình đời sống, recap, mẹo, câu luyện đều dùng 6 và 4; câu ôn hỏi đúng ô [(−4) + (−6)] = −10 đã in ở recap và mẹo.
- Sửa: `dien-so-gop` thành 5 · (−3) + 5 · (−8) = 5 · (□), đáp án −11; `tinh-hop-li-am4` thành (−4) · 7 + (−4) · 3; mẹo đổi sang cặp khác (vd 9 · (−7) + 9 · (−3)).

### 15. Câu ôn `tim-x-am` trùng thừa số (x + 2) và đáp án −2 của ví dụ mẫu

- Vị trí: `$.exercises[56]` (`ex.tim-x-am`); hình `tim-x-mau`. LL-07.
- Nguồn: —
- Vấn đề: ví dụ (x − 3) · (x + 2) = 0 cho −2; câu ôn (x − 6) · (x + 2) = 0 hỏi nghiệm âm, cũng −2.
- Sửa: (x − 6) · (x + 5) = 0, đáp án −5 (sửa `check`, `explain`).

### 16. Hình màn quy tắc section 12 trùng số với câu luyện `vai-20-bo`

- Vị trí: hình `thay-doi-vai` (`$.sections[11].blocks[0]`); `$.exercises[59]` (`ex.vai-20-bo`). LL-07.
- Nguồn: tr.57 bài 3.33, `sbt-p57.png`
- Vấn đề: hình "mỗi bộ thêm 3 dm: 60", câu luyện "mỗi bộ ít đi 3 dm", đáp án −60: chỉ cần thêm dấu trừ.
- Sửa: câu luyện "ít đi 4 dm" (−80) hoặc hình "thêm 5 dm"; viết theo quy ước của mục 1.

### 17. Câu ôn `cach-day-3-gio` hỏi mơ hồ và lặp số của ví dụ section 3

- Vị trí: `$.exercises[62].prompt[0].text` (`ex.cach-day-3-gio`). LL-10, LL-07.
- Nguồn: —
- Vấn đề: "Cách đây 3 giờ, nhiệt độ thay đổi so với bây giờ bao nhiêu độ?" hiểu được +6 hay −6; đề nói "tăng đều" mà đáp án âm, ngay sau câu quy tắc "số dương là tăng". Bộ số 2, 3, −6 trùng ví dụ section 3 và cùng làm section 12.
- Sửa: "Nhiệt độ tăng đều 4 độ mỗi giờ. Cách đây 2 giờ, nhiệt độ thấp hơn hay cao hơn bây giờ? Ghi bằng số nguyên: 4 · (−2)." (−8); `explain` "−8 nghĩa là lúc đó thấp hơn bây giờ 8 độ".

### 18. Recap section 12 chỉ còn nửa quy tắc

- Vị trí: hình `tang-giam-vi-du` (`$.sections[11].blocks[1]`, `$.sections[11].recap`, `card.bai-toan-thuc-te.recap`). LL-06.
- Nguồn: —
- Vấn đề: câu quy tắc có hai ý ("thay đổi mỗi lần nhân với số lần", "dương tăng, âm giảm"); hình chỉ có dấu của thay đổi mỗi lần, không có phép nhân nào (ảnh walk 130, 137).
- Sửa: mỗi hàng thêm phép nhân và nghĩa, vd "(−3) · 2 = −6: giảm 3 độ mỗi giờ, trong 2 giờ", số khác số câu ôn.

### 19. Cùng làm "giảm 3 độ, 2 giờ" kết thúc ở trục số, không trả lời câu hỏi nhiệt độ

- Vị trí: hình `cung-giam3-2-gio` (`$.sections[11].blocks[2]`), lời kết trong `catalog.ts`. LL-16.
- Nguồn: —
- Vấn đề: note hỏi nhiệt độ thay đổi bao nhiêu; lời kết chỉ nói "Điểm đã đi sang trái 2 lần … tới −6."
- Sửa: "Tới −6: sau 2 giờ nhiệt độ thay đổi (−3) · 2 = −6 độ, tức là giảm 6 độ."

### 20. "Tính hợp lí" xuất hiện mà chưa dạy, section trước gọi là "tính nhanh"

- Vị trí: `$.exercises[48].prompt[0]`, `$.exercises[49].prompt[0]`, `$.exercises[51].prompt[0]`, `$.exercises[52].prompt[0]` (`gop-6-am3-am7`, `tinh-hop-li-am4`, `tinh-gop-am7`, `tinh-gop-doi-cho`). LL-05, LL-10.
- Nguồn: tr.55 ví dụ 1, `sbt-p55.png`
- Vấn đề: overview và section 7 dùng "tính nhanh"; section 10 đổi sang "tính hợp lí" không giải thích; hai câu chỉ ghi "Tính hợp lí." nên bé không biết dùng cách nào.
- Sửa: một tên cả bài: "Tính nhanh bằng cách đưa thừa số chung ra ngoài." ở cả bốn câu.

### 21. Mẹo của section 10 chỉ nhắc lại câu quy tắc

- Vị trí: `$.sections[9].blocks[3]` (`tip.gop-thua-so-chung`).
- Nguồn: —
- Vấn đề: tiêu đề mẹo trùng tên section, lời mẹo là câu quy tắc nói lại; mẹo gượng (checklist trục 5).
- Sửa: mẹo nhận dạng: "Hai số còn lại cộng ra số tròn chục là dấu hiệu nên đưa thừa số chung ra ngoài." Sửa cùng mục 3 và 4.

### 22. Công thức `explain` dài bị ngắt giữa một tích trên điện thoại

- Vị trí: `$.exercises[43].explain.tex` (`dung-phan-phoi`), `$.exercises[44].explain.tex` (`tinh-am3-nhan-tong`), `$.exercises[48].explain.tex` (`gop-6-am3-am7`), `$.exercises[50].explain.tex`, `$.exercises[52].explain.tex`; `$.exercises[37].explain.tex` (`dau-tich-ba-so`), `$.exercises[38].explain.tex` (`tinh-am3-2-am5`, còn viết `-6 \cdot (-5)` thiếu ngoặc), `$.exercises[40].explain.tex`. LL-12.
- Nguồn: —
- Vấn đề: KaTeX ngắt dòng ngay sau dấu nhân ("4 · 3 + 4 ·" / "5 = 12 + 20 = 32", "= 6 ·" / "(−5) = −30"; ảnh phone 092, 094, 102, 104, 114). Bé dễ đọc dòng dưới thành phép tính riêng. Gộp nhóm 3 (Nên sửa) và nhóm 2 (Góp ý), giữ mức cao hơn.
- Sửa: mỗi bước một dòng trong `\begin{gathered} … \\ = … \end{gathered}`; viết `(-6) \cdot (-5)`.

## Góp ý

### 23. Ví dụ nợ ở section 4 thiếu đơn vị và gần trùng câu kiểm tra section 1

- Vị trí: `$.sections[3].blocks[0].children[0].text` (`section.khac-dau`); hình `no-moi-ngay`
- Nguồn: —
- Vấn đề: "thay đổi (−2) · 4 = −8" không ghi "nghìn đồng"; tình huống gần chép câu `ex.no-moi-ngay`.
- Sửa: "= −8, tức giảm 8 nghìn đồng"; đổi tên hoặc số ngày.

### 24. Câu chuyện "cách đây 2 giờ" không nói vì sao ghi là −2

- Vị trí: `$.sections[2].blocks[0].children[0].text` (`section.duong-nhan-am`)
- Nguồn: —
- Vấn đề: note nhảy từ "cách đây 2 giờ" sang "3 · (−2)".
- Sửa: thêm "Sau 2 giờ ghi là 2, cách đây 2 giờ ghi là −2."

### 25. Lý do sai của "(−3) + 4 = −12" chưa nói phép tính đó cũng sai

- Vị trí: `$.exercises[0].explain.wrong[1]` (`ex.no-moi-ngay`)
- Nguồn: —
- Vấn đề: (−3) + 4 = 1; lý do chỉ nói "chỉ cộng một lần".
- Sửa: "(−3) + 4 = 1, không phải −12; hơn nữa nợ lặp lại bốn lần nên phải nhân."

### 26. Ký hiệu trong hình có thể đọc nhầm thành dấu trừ

- Vị trí: hình `am2-nhan3` (ảnh walk `006-s1-01-block-end`, điện thoại); hình `cung-2-nhan-am2`, `thu-4-nhan-am2` (ảnh `039-s3-04-block-shown`). LL-21.
- Nguồn: —
- Vấn đề: ba nhãn "−2" sát nhau kèm hình thoi đọc thành "♦−2♦−2♦−2"; vạch xám cuối hàng "2 · 0 = 0" trông như dấu "−". Mã hình dùng chung, không chặn bài.
- Sửa: báo người làm hình: giãn nhãn bước nhảy; dùng dấu khác cho hàng tích bằng 0.

### 27. Lý do "hai thừa số đều khác 0" chạm quy tắc của section "Tích bằng 0"

- Vị trí: `$.exercises[5].explain.wrong[1]`, `$.exercises[5].explain.wrong[2]` (`ex.tich-bang-0-nao`); `$.exercises[7].explain.wrong[0]`, `$.exercises[7].explain.wrong[1]` (`ex.chon-tich-0`). LL-09.
- Nguồn: —
- Vấn đề: vế "hai thừa số đều khác 0" ngầm dạy chiều thuộc section `tich-bang-0`.
- Sửa: chỉ giữ phần tính: "8 · 1 = 8, khác 0."

### 28. Lý do sai "tích không âm" kém chính xác

- Vị trí: `$.exercises[42].explain.wrong[0]` (`ex.dem-hai-so-am`)
- Nguồn: —
- Vấn đề: "không âm" gồm cả 0.
- Sửa: "Có hai thừa số âm, là số chẵn, nên tích là số dương."

### 29. Câu kiểm tra và câu luyện tập của section `nhieu-thua-so` dùng cùng bộ số

- Vị trí: `$.exercises[37]` (`ex.dau-tich-ba-so`) và `$.exercises[38]` (`ex.tinh-am3-2-am5`). LL-07.
- Nguồn: —
- Vấn đề: −30 vừa hiện ở câu kiểm tra, câu luyện chỉ cần đổi dấu.
- Sửa: câu 38 thành (−6) · 2 · (−3) = 36.

### 30. Số của câu kho ôn gần với recap

- Vị trí: `$.exercises[34].options[3]` (`ex.chon-bang-tich`), `$.exercises[28].left[1]` (`ex.noi-tich-voi-ket-qua`). LL-07.
- Nguồn: —
- Vấn đề: (−2) · 3 · 5 và 5 · (−2) chỉ là recap đổi chỗ.
- Sửa: đổi bộ số (vd (−2) · (−5) · 3; 7 · (−2)).

### 31. Hình `bon-truong-hop` không nói tích chỉ điều gì

- Vị trí: `$.sections[5].blocks[0]`, hình `bon-truong-hop`
- Nguồn: —
- Vấn đề: nhãn chỉ ghi "tăng, sau 2 giờ"…, không nói 6 hay −6 nghĩa là gì.
- Sửa: nhãn "tăng, sau 2 giờ: cao hơn 6 độ"…, chia hai hàng nếu chật.

### 32. `sourceRef` của section `dau-cua-tich` và `nhieu-thua-so` chưa khớp nội dung

- Vị trí: `$.sections[5].sourceRef`, `$.cards[5].sourceRef`; `$.sections[7].sourceRef`, `$.cards[7].sourceRef`
- Nguồn: tr.57 (bài 3.30, 3.34), `sbt-p57.png`; tr.55 (ví dụ 2)
- Vấn đề: `noi-tich-voi-ket-qua` dựa bài 3.30 nhưng `dau-cua-tich` chỉ trỏ 3.27–3.29; `nhieu-thua-so` trỏ ví dụ 2 "tr.56" và bài 3.34 mà section không dùng.
- Sửa: thêm "tr.57 (bài 3.30)" cho `dau-cua-tich`; `nhieu-thua-so` trỏ đúng phần dùng.

### 33. Câu kho ôn `chon-tinh-huong-am` lặp tình huống câu kiểm tra

- Vị trí: `$.exercises[61].options[0]` (`ex.chon-tinh-huong-am`). LL-07.
- Nguồn: —
- Vấn đề: "giảm 2 độ mỗi giờ, trong 5 giờ" là đề `nhiet-do-giam-4-gio`.
- Sửa: "giảm 4 độ mỗi giờ, trong 2 giờ".

### 34. Câu kiểm tra `biet-tich-0` dùng đúng số 7 của hình quy tắc

- Vị trí: `$.exercises[53]` (`ex.biet-tich-0`); hình `tich-bang-0-vi-du`. LL-07, LL-05.
- Nguồn: —
- Vấn đề: hình "a · 7 = 0 → a = 0", câu ngay sau "a = 7"; `explain` "có một thừa số bằng 0" khác lời quy tắc "ít nhất một số trong hai số đó bằng 0".
- Sửa: a = −6; `explain` mở bằng câu quy tắc nguyên văn.

### 35. Từ "vế" chưa dạy trong lời giải `dung-phan-phoi`

- Vị trí: `$.exercises[43].explain.text` ("Cả hai vế đều bằng 32", Tổng hợp thêm) và `$.exercises[43].explain.wrong[2].text` ("vế phải") (`ex.dung-phan-phoi`). LL-25.
- Nguồn: —
- Vấn đề: lựa chọn chỉ là một biểu thức; "vế", "vế phải" bé chưa học.
- Sửa: "Cách viết này bỏ mất phép nhân với 4, chỉ bằng 12."; `explain` "Cả hai cách đều bằng 32."

### 36. Hàng thứ ba của hình quy tắc section 10 bỏ bước ngoặc

- Vị trí: hình `gop-thua-so-vi-du`, hàng `(−2) · 5 + (−2) · 6`
- Nguồn: —
- Vấn đề: hai hàng trên có bước ngoặc, hàng ba nhảy thẳng tới `(−2) · 11`.
- Sửa: `= (−2) · (5 + 6) = (−2) · 11 = −22`.

### 37. Công thức viết trong chữ của note bị ngắt dòng giữa tích

- Vị trí: `$.sections[9].blocks[0].children[0].text`; `$.exercises[59].prompt[0].text` (`ex.vai-20-bo`). LL-12.
- Nguồn: —
- Vấn đề: ảnh 107, 108, 135: "Cả 7 hộp có 7" / "· 6 + 7 · 4 = 7 ·" / "(6 + 4)"; "x =" / "−3".
- Sửa: bỏ công thức khỏi note, để trong hình; `vai-20-bo` đưa "x = −3" vào khối `formula`.

### 38. Lời đề thang máy chưa tự nhiên

- Vị trí: `$.exercises[60].prompt[1].text` (`ex.thang-may-xuong`). LL-25.
- Nguồn: —
- Vấn đề: "Số tầng của thang máy thay đổi bao nhiêu?" hiểu được là toà nhà đổi số tầng.
- Sửa: "Vị trí của thang máy thay đổi bao nhiêu tầng?"

### 39. `sourceRef` section 10 trích bài 3.32 nhưng section không có nội dung của bài đó

- Vị trí: `$.sections[9].sourceRef`, `$.cards[9].sourceRef`
- Nguồn: tr.57 bài 3.32, `sbt-p57.png`
- Vấn đề: bài 3.32 là hiệu hai tích; section chỉ dạy tổng. Gắn với mục 3.
- Sửa: bỏ "bài 3.32" nếu không dạy hiệu, hoặc giữ khi đã thêm phần hiệu.

### 40. Id câu không khớp đề

- Vị trí: `$.exercises[58].id` (`ex.nhiet-do-giam-4-gio`)
- Nguồn: —
- Vấn đề: id ghi "4 giờ", đề hỏi "Sau 5 giờ".
- Sửa: đổi id thành `nhiet-do-giam-5-gio` (sửa `checkIds`); làm trước khi khoá id.

### 41. "Quy tắc dấu" được dùng như tên riêng mà chưa màn nào đặt tên

- Vị trí: `$.sections[7].blocks[1].children[0].text` và recap ("theo quy tắc dấu"); `overview.summary`, `overview.goals[1]`; đối chiếu `$.sections[5]` (tiêu đề "Dấu của tích", câu quy tắc không có chữ "quy tắc dấu"). LL-05. Tổng hợp phát hiện.
- Nguồn: —
- Vấn đề: câu quy tắc section 8 trỏ tới "quy tắc dấu" nhưng section 6 không gọi câu "cùng dấu thì dương, khác dấu thì âm" bằng tên đó; bé phải đoán đó là câu nào.
- Sửa: section 6 mở câu ví dụ hay tiêu đề bằng tên này (vd tiêu đề "Quy tắc dấu của tích"), hoặc bỏ cụm "theo quy tắc dấu" khi viết lại câu quy tắc ở mục 2.

### 42. Recap "Nhân với 0" dùng phép nhân với số âm trước khi section 3 dạy

- Vị trí: hình `nhan-voi-0-vi-du` (`$.sections[1].blocks[1]`, `$.sections[1].recap`, `card.nhan-voi-0.recap`), hàng `0 · (−3) = 0` (nhãn "0 nhân với số âm" tô màu âm dù tích là 0). LL-09. Tổng hợp phát hiện.
- Nguồn: tr.55, `sbt-p55.png` (sách có `a · 0 = 0 · a = 0` với mọi số nguyên)
- Vấn đề: theo quy ước "m · n là m lấy n lần", `0 · (−3)` là "0 lấy −3 lần", chưa có nghĩa cho tới section 3. Quy tắc có trong sách nên không sai, nhưng bé gặp kiểu tích này trước khi được dạy.
- Sửa: hàng thứ ba dùng `0 · 6` (nhãn "0 nhân với số dương"), hoặc dời ví dụ `0 · (−3)` sang section 3; nhãn tô màu theo tích (`slate`) hoặc màu ghi chú.

## Ngoài phạm vi của Tổng hợp

Không có việc ngoài phạm vi phát sinh. Tổng hợp chỉ ghi tệp này, `docs/lessons-learned/` và dòng hash do `--mark`.
