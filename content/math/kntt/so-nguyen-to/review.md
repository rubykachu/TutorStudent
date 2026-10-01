# Review: Số nguyên tố (`so-nguyen-to`)

- Bài: `content/math/kntt/so-nguyen-to/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/so-nguyen-to/` - sbt-p35, sbt-p36, sbt-p37, sbt-p106, sbt-p107
- `content:check`: 0 lỗi, 1 cảnh báo của bài (100 id chưa khoá, đúng vì bài draft)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/so-nguyen-to/` (ảnh mới hơn `lesson.json`)
- Kết luận: Chưa đạt: còn 4 lỗi Nghiêm trọng (đã chạy `pnpm content:hash so-nguyen-to --root content --mark`)
- Bản đã review: `e4231905b1f17859262f823d5ac210671657d078b6356e283d7129315cd01045` (`pnpm content:diff` so với bản này)

Đã soát: 65 bài tập (mỗi nhóm tự giải trước khi đọc `answer`, rồi tính lại bằng python mọi đáp án, nhiễu, `params`, `wants`: tất cả đúng, mỗi câu đúng một đáp án hay một tập đáp án); mọi `note` quy tắc, `recap`, `caption`, recap card, `overview`, glossary Toán; mã `rects.tsx`, `prime-table.tsx`, `column.tsx`, `catalog.ts`. Tổng hợp đã mở lại năm trang nguồn, ảnh walk `phone/016-s2-01-block-end.png`, `phone/054-s5-05-exercise-dh-nhieu-wrong2.png`, mã `VERDICTS` của `rects.tsx` và các mục `xep-12`, `cot-105`, `cot-thieu-150`, `cot-thieu-54` của `catalog.ts` để kiểm từng mục Nghiêm trọng.

Đổi số: các số đề xuất dưới đây đã kiểm bằng python, không trùng bộ số câu 2.23–2.32, ví dụ 945 và 2 017 của sách, và đã chọn để không đụng nhau, không trùng recap, ví dụ, câu luyện cùng card (LL-07). Đổi số nào thì đổi id câu, hình lời giải, `check` theo, rồi tự giải lại.

## Nghiêm trọng

### 1. Hình quy tắc section 1 là câu 2.30b kèm lời giải, hook mở bài là câu 2.30a kèm lời giải (LL-08, LL-20)

- Vị trí: `$.sections[0].blocks[0].children[1]` (visual `xep-12`), `$.sections[0].recap` và `$.cards[0].recap` (visual `xep-12-xong`); `$.overview.hook.text`
- Nguồn: tr.37 câu 2.30a, b (`sbt-p37.png`); lời giải tr.106 "a) 1 cách; b) 3 cách" (`sbt-p106.png`)
- Vấn đề: đã đối chiếu: 2.30b hỏi 12 hình vuông đơn vị xếp được mấy hình chữ nhật; hình `xep-12` (màn quy tắc, recap section, recap card) vẽ đúng 12 ô với ba cách 1 · 12, 2 · 6, 3 · 4, tức cùng số, cùng việc, cùng lời giải. Hook "xếp 7 viên gạch… Chỉ xếp được một hàng dài 7 viên" là 2.30a cùng đáp án "1 cách". Vòng 1 đã đổi câu ôn `xep-7-cach` vì đúng lỗi này; câu hook hiện tại lại là câu do review vòng 1 đề xuất (Nên sửa 17), nên bản sửa đưa lỗi chép trở lại (LL-20). Cùng tiền lệ `phep-nhan-phep-chia` vòng 1 (ví dụ mẫu là bài tập sách kèm lời giải): Nghiêm trọng.
- Sửa:
  - `xep-12`, `xep-12-xong` → 20 viên: `n: 20`, `ways` [1, 20], [2, 10], [4, 5] (ước 1, 2, 4, 5, 10, 20). Đổi id thành `xep-20`, `xep-20-xong`. Chụp lại ở điện thoại, xem hàng 20 ô còn vừa.
  - Câu ôn `$.exercises[3]` (`dien-uoc-20-4`) khi đó trùng số recap: đổi thành "32 chia hết cho 8, nên 8 là ___ của 32." (id `dien-uoc-32-8`).
  - Hook: "Bạn xếp 11 viên gạch vuông thành hình chữ nhật. Chỉ xếp được một hàng dài 11 viên, vì 11 là số nguyên tố." (khớp hình `xep-11` của section 2).
  - Hình `viet-20` ở section 12 cũng dùng 20: đổi cùng lúc theo Góp ý 10.

### 2. Nhãn kết luận của hình `xep-11` thiếu "lớn hơn 1": theo nhãn thì 1 là số nguyên tố (LL-17)

- Vị trí: `$.sections[1].blocks[0].children[1]` (visual `xep-11`, `verdict: "prime"`); `src/visuals/math/so-nguyen-to/rects.tsx` dòng 19, `VERDICTS.prime`. Ảnh `phone/016-s2-01-block-end.png`
- Nguồn: tr.35 mục A ý 1 (`sbt-p35.png`)
- Vấn đề: đã mở ảnh: ngay dưới câu định nghĩa, khung sky có dấu ✚ in "Chỉ chia hết cho 1 và chính nó: số nguyên tố", là một câu quy tắc khái quát. Số 1 cũng chỉ chia hết cho 1 và chính nó, nên đọc theo nhãn thì 1 là số nguyên tố, trái quy tắc số 1 ở section 3. Cùng kiểu nhãn khái quát sai ở trường hợp biên mà vòng 1 xếp Nghiêm trọng (nhãn `le-le`, nhãn bảng "Số không bị gạch là số nguyên tố"). Nhãn hợp số "Có từ ba ước trở lên: hợp số" thì đúng.
- Sửa: `VERDICTS.prime.text` → "Lớn hơn 1, chỉ chia hết cho 1 và chính nó: số nguyên tố". Chụp lại, xem nhãn còn vừa trên điện thoại.

### 3. Câu luyện `dh-nhieu` cần biết 49 là hợp số, mà điều đó chỉ nằm trong caption xám và section không dạy cách xét (LL-20, LL-09)

- Vị trí: `$.exercises[22]` (`dh-nhieu`, lựa chọn `d` 49, `hints.hintVisualId` `goi-y-xep-21`); `$.sections[4].blocks[1].caption` (`xet-51`). Ảnh `phone/052-s5-05-exercise-dh-nhieu.png`, `phone/054-s5-05-exercise-dh-nhieu-wrong2.png`, `phone/047-s5-02-block.png`
- Nguồn: tr.35 mục B; tr.36 câu 2.26 ("dùng dấu hiệu chia hết hoặc tra bảng")
- Vấn đề: quy tắc section 5 chỉ có một chiều (chia hết cho 2, 3 hoặc 5 thì là hợp số). 49 không chia hết cho 2, 3, 5, nên làm đúng cách vừa học thì trẻ bỏ 49 và bị chấm sai. Câu duy nhất nói tới trường hợp này, "Số không chia hết cho 2, 3, 5 chưa chắc là số nguyên tố", là chữ xám dưới ví dụ 51 (mà 51 chia hết cho 3, không ăn nhập), và không nói làm cách nào để biết. Section 5 cố ý không có bảng. Hình gợi ý `goi-y-xep-21` (đã mở ảnh: xếp 21 ô) nói về một số chia hết cho 3, không giúp ở 49. Checklist: quy tắc chỉ nằm trong caption xám là Nghiêm trọng; trẻ không làm được bài theo cách vừa học. Lỗi do bản sửa vòng 1: review đề xuất thêm 49 kèm câu và hình hướng dẫn, bản sửa giữ 49 nhưng bỏ phần hướng dẫn (bàn giao, mục "Mục đã bỏ").
- Sửa (giữ quyết định vòng 1 "section 5 không có bảng"):
  - `dh-nhieu`: thay 49 bằng 37 (số nguyên tố, chưa dùng ở section 5); đáp án còn `b` 27, `c` 35. Mọi hợp số trong câu nhận ra được bằng dấu hiệu 2, 3, 5.
  - Hình gợi ý: thay `goi-y-xep-21` bằng một hình kiểu `xet-51` với số khác đề, dừng ở "?" trước kết luận, ví dụ 69: "6 + 9 = 15", "69 ⋮ 3", "69 > 3", "?".
  - Đưa ý "chưa chắc là số nguyên tố" ra khỏi caption, thành một `note` thường của màn `xet-51` (đổi block thành group note + hình), có ví dụ: "Số 77 không chia hết cho 2, 3, 5, nhưng 77 = 7 · 11 nên 77 vẫn là hợp số." (77 là số mẫu đã dùng ở section 4). Caption `xet-51` bỏ câu cuối.
  - Cách khác, nếu muốn giữ 49 làm bẫy: thêm note như trên và đặt `bang-nt` làm block cuối của `prompt` câu `dh-nhieu` (câu 2.26 cho phép tra bảng); hình gợi ý vẫn phải đổi.

### 4. Ba sơ đồ cột dùng đúng các cột của câu 2.27 và ví dụ 1 sách bài tập (LL-08)

- Vị trí: `$.exercises[32]` (`cot-thieu-150`, hình `cot-thieu-150`, `giai-cot-150`); `$.exercises[33]` (`cot-thieu-54`, hình `cot-thieu-54`, `giai-cot-54`); `$.sections[6].blocks[2]` (hình `cot-105` và note "Xem sơ đồ cột của 105…")
- Nguồn: tr.36 câu 2.27a, b (`sbt-p36.png`); lời giải tr.106 "a) 2; 75; 5; 5; b) 216; 2; 54; 3; 3; 3" (`sbt-p106.png`); tr.35 ví dụ 1, cột 945 (`sbt-p35.png`)
- Vấn đề: đã đối chiếu từng hàng.
  - `cot-thieu-150` (150 | 2, 75 | ?, 25 | 5, 5 | 5, 1) là nguyên phần dưới cột 2.27a từ hàng 150; các ô bài cho sẵn (75, 5, 5) là đáp án sách, ô hỏi (3) là ô sách in sẵn; hình lời giải `giai-cot-150` chính là lời giải sách.
  - `cot-thieu-54` (54 | 2, ? | 3, 9 | 3, 3 | 3, 1) là nguyên phần dưới cột 2.27b từ hàng 54, cùng việc "tìm số còn thiếu trong sơ đồ cột", lời giải trùng lời giải sách.
  - `cot-105` (105 | 3, 35 | 5, 7 | 7, 1) là ba hàng cuối của cột ví dụ 1, không thêm hàng nào của bài.
  Cùng số, cùng dạng bài, cùng lời giải với bài tập và ví dụ sách, chỉ cắt bớt hàng trên: vi phạm "Biên soạn lại, không chép" (bàn giao ghi "số trong bài tự chọn"). Lint `[textbook-copy]` không bắt vì bài không có lớp chữ.
- Sửa (đã tính lại bằng python; không trùng cột 945, 300, 432, hình mẫu `cot-60`, `cot-84`, hình gợi ý `goi-y-cot-90`, câu kiểm tra `cot-thieu-36`, câu ôn `chia-dau-87`, `tich-52`):
  - `cot-105` → `cot-195`: 195 | 3, 65 | 5, 13 | 13, 1. Note: "Xem sơ đồ cột của 195. Số 195 không chia hết cho 2, nhưng chia hết cho 3 nên số chia đầu tiên là 3." (1 + 9 + 5 = 15).
  - `cot-thieu-150` → `cot-thieu-330`: 330 | 2, 165 | ?, 55 | 5, 11 | 11, 1; `hide: [3]`, đáp án 3, `check` "165:55", giữ độ khó 3 (165 tận cùng 5 nên vẫn có bẫy chọn 5, phải xét "nhỏ nhất" bằng dấu hiệu chia hết cho 3: 1 + 6 + 5 = 12). Hình lời giải `giai-cot-330`.
  - `cot-thieu-54` → `cot-thieu-78`: 78 | 2, ? | 3, 13 | 13, 1; `hide: [2]`, đáp án 39, `check` "78:2". Hình lời giải `giai-cot-78`.

## Nên sửa

### 1. Định nghĩa hợp số nói hai cách: "từ ba ước trở lên" và "nhiều hơn hai ước" (LL-05)

- Vị trí: "từ ba ước trở lên" ở note quy tắc `$.sections[2].blocks[0].children[0]`, recap `$.sections[2].recap`, `$.cards[2].recap`, caption `xep-9`, nhãn `VERDICTS.composite`; "nhiều hơn hai ước" ở note màn chạm `$.sections[2].blocks[3].children[0]` ("Hợp số có nhiều hơn hai ước.") và `$.exercises[14].segments[0]` (`dien-25-hs`)
- Nguồn: tr.35 mục A ý 2 (`sbt-p35.png`; "nhiều hơn hai ước" là chữ của sách)
- Vấn đề: một định nghĩa hai cách nói trong cùng section, hai cách đếm khác nhau ("ba", "hai"); trẻ học chậm nhớ lẫn. Lint `[rule-sentence]` không bắt vì note màn chạm không đánh `rule`.
- Sửa: note màn chạm "Chạm vào các hợp số. Hợp số có từ ba ước trở lên."; `dien-25-hs` "Số 25 có các ước 1, 5 và 25, tức là có từ ba ước trở lên, nên 25 là ___."

### 2. Số nguyên tố được định nghĩa bằng "chia hết", còn lý do của số 1 và câu `dien-29` dùng "số ước" (LL-05)

- Vị trí: định nghĩa `$.sections[1].blocks[0].children[0]` và recap section 2, `$.cards[1].recap` ("chỉ chia hết cho 1 và cho chính nó"); note quy tắc số 1 `$.sections[2].blocks[2].children[0]`, recap section 3, `$.cards[2].recap` ("chỉ có một ước nên không phải số nguyên tố"); `$.exercises[8]` (`dien-29`: "chỉ có hai ước là 1 và 29"); nhãn "Ước của 7: hai ước" trong `catalog.ts`
- Nguồn: tr.35 mục A ý 1 (`sbt-p35.png`)
- Vấn đề: theo định nghĩa của bài (lớn hơn 1, chỉ chia hết cho 1 và chính nó), số 1 bị loại vì không lớn hơn 1; lý do "chỉ có một ước" chỉ suy ra được từ cách nói "có đúng hai ước" mà bài không dạy. Trẻ chậm phải tự nối hai cách nói. (Gộp Nên sửa 4 nhóm 1 và Góp ý 11 nhóm 3; giữ mức cao hơn.)
- Sửa: thêm vế nối vào caption `ngto-dau` (`$.sections[1].blocks[1].caption`): "2, 3, 5, 7 chỉ chia hết cho 1 và cho chính nó, tức là chỉ có hai ước." Khi đó note số 1 giữ nguyên. `dien-29` đổi theo Nên sửa 4 (số 29 chuyển vào màn chạm): "Số 31 lớn hơn 1 và chỉ chia hết cho 1 và cho 31, nên 31 là ___." (id `dien-31`).

### 3. Quy tắc số 1 nói "không phải", nhãn bảng `bang-100` nói "không là" (LL-05)

- Vị trí: `src/visuals/math/so-nguyen-to/prime-table.tsx` dòng 89 ("Số 1 không là số nguyên tố, cũng không là hợp số."), hình `bang-100` ở `$.sections[3].blocks[0]`, `$.sections[3].recap`, `$.cards[3].recap`; so với note quy tắc `$.sections[2].blocks[2].children[0]`
- Nguồn: tr.35 mục A ý 1, 2
- Vấn đề: một câu quy tắc đánh `rule` mà hình recap của section sau nói lại bằng chữ khác. Lint `[rule-sentence]` không đọc chữ trong hình. Câu này do review vòng 1 đề xuất.
- Sửa: "Số 1 không phải số nguyên tố, cũng không phải hợp số."

### 4. Số nguyên tố lớn ở màn chạm và câu ôn không có bảng, trẻ phải thử rất nhiều phép chia (LL-18)

- Vị trí: `$.sections[1].blocks[2]` (visual `chon-nt-2-7`: 20, 23, 24, 25, 27, 31); `$.exercises[7]` (`chon-nt-bank`: 43, 47); `$.exercises[12]` (`chon-hs-bank`: phải nhận ra 83 không phải hợp số)
- Nguồn: —
- Vấn đề: section 2, 3 dạy "tìm ước của từng số". Muốn chắc 31, 43, 47, 83 không có ước khác, trẻ yếu nhân chia phải thử rất nhiều phép chia mà bài không dạy thử tới đâu; trẻ sẽ đoán. Các số 43, 47, 83 do review vòng 1 đề xuất.
- Sửa: `chon-nt-2-7` chips 21, 22, 23, 25, 27, 29 (`wants` 23, 29; mọi số không quá 30). Vì 29 vào màn chạm, `dien-29` đổi sang 31 (Nên sửa 2). `chon-nt-bank`, `chon-hs-bank`: thêm `bang-nt` làm block cuối của `prompt`, như các câu của card `bang` (kho ôn chạy sau cả bài, khi trẻ đã học tra bảng).

### 5. Hình `xep-9` tính hình vuông 3 × 3 là một hình chữ nhật mà không nói (LL-10)

- Vị trí: `$.sections[2].blocks[0].children[1]` (visual `xep-9`, caption "Xếp 9 viên gạch vuông: có hai cách, nên 9 có từ ba ước trở lên.")
- Nguồn: tr.37 câu 2.30
- Vấn đề: nhiều trẻ nghĩ hình vuông không phải hình chữ nhật; trẻ đó đếm 9 viên chỉ có một cách và suy ra 9 giống số nguyên tố, ngược với điều màn này dạy.
- Sửa: caption "Xếp 9 viên gạch vuông: có hai cách. Hình vuông cũng là một hình chữ nhật, nên 9 có từ ba ước trở lên." (giữ trong luật độ dài; tách câu nếu cần).

### 6. Câu ôn `xep-5-cach` hỏi số 5 mà recap card vừa in ước (LL-07)

- Vị trí: `$.exercises[9]` (`xep-5-cach`, card `nguyen-to`); recap `$.cards[1].recap` (visual `ngto-dau`, hàng "1, 5 — Ước của 5")
- Nguồn: —
- Vấn đề: recap vừa hiện ước của 5 là 1 và 5, câu ôn chỉ còn là đọc lại recap. Số 5 do review vòng 1 đề xuất.
- Sửa: đổi sang 13 viên (13 chỉ có ở câu kiểm tra `nt-13`, không vào kho ôn; 17, 19 trùng câu luyện `chon-nt-nhieu-1`, 23, 29 ở màn chạm, 11 ở hình quy tắc); đáp án 1, nhiễu 2, 3, 13; id `xep-13-cach`.

### 7. Section `bang-so-nguyen-to` không có ví dụ đời sống ở màn dạy (LL-16)

- Vị trí: `$.sections[3].blocks[1].children[0]` (note "Tra 59… Tra 77…")
- Nguồn: —
- Vấn đề: ba màn dạy chỉ có bảng và số trơn; ví dụ đời sống duy nhất (số nhà) nằm ở câu kiểm tra `nha-57`.
- Sửa: "Phòng học của Lan số 59: 59 có trong bảng, nên 59 là số nguyên tố. Xe buýt số 77: 77 lớn hơn 1 và không có trong bảng, nên 77 là hợp số."

### 8. iPad ngang: bảng `bang-100` đẩy dòng số 1 và hàng 91–100 khỏi màn (LL-12)

- Vị trí: visual `bang-100` ở `$.sections[3].blocks[0]`, `$.sections[3].recap`, `$.cards[3].recap`; `prime-table.tsx` (`max-w-[460px]`). Ảnh `ipad-landscape/036-s4-01-block.png`, `ipad-landscape/043-s4-06-recap.png`
- Nguồn: —
- Vấn đề: ở recap iPad ngang, hàng 91–100 (có 97) bị thanh "Xong phần" che nửa, dòng "Số 1 …" nằm ngoài màn; ở màn quy tắc dòng số 1 cũng bị đẩy xuống. Đây là ý dễ nhầm nhất của bài, nằm đúng chỗ trẻ không thấy nếu không cuộn. Kích thước do mã hình của bài.
- Sửa: giới hạn chiều cao lưới theo màn (vd `max-h-[55vh]` cùng `w-auto`), hoặc đưa dòng số 1 lên trên lưới. Chụp lại cả ba thiết bị.

### 9. Nấc 1 của các câu tìm chữ số a tô cả câu chữ, không tô số có chữ số a (LL-02)

- Vị trí: `$.exercises[42].hints.highlight` (`a-9a`), `[43]` (`a-5a`), `[44]` (`chon-a-1`), `[45]` (`a-4a-hop-so`), đều `{target: "block", index: 0}`
- Nguồn: —
- Vấn đề: đề có nhiều khối (câu chữ, công thức, bảng), không thuộc ngoại lệ "đề một câu chữ". Lỗi hay gặp là ghép sai số hay quên đối chiếu; câu chữ sáng lên không chỉ chỗ đó. Bài 9 cùng dạng (`tim-chu-so-5a`, `tim-chu-so-4d6`) bọc số bằng `\htmlId{so}{\overline{…}}` và tô `target: "part"`.
- Sửa: công thức `\htmlId{so}{\overline{9a}}` (tương tự 5a, 1a, 4a), nấc 1 `{"target": "part", "id": "so"}`.

### 10. Câu ôn `tich-42` và `tinh-3-2-7` dùng đúng nhánh cây của câu 2.28 (LL-08)

- Vị trí: `$.exercises[28]` (`tich-42`), `$.exercises[41]` (`tinh-3-2-7`)
- Nguồn: tr.36 câu 2.28, lời giải tr.106 (cây a: 42 = 6 · 7, 6 = 2 · 3; cây b: 63 = 3 · 21, 21 = 3 · 7)
- Vấn đề: `tich-42` hỏi 42 = 2 · 3 · 7 của nhánh cây a; `tinh-3-2-7` cho 63 = 3 · 3 · 7 của nhánh cây b (63 còn là số của câu kiểm tra `dh-63`). Không xếp Nghiêm trọng như mục 4: đây là nút giữa của một cây, dạng bài khác (tìm thừa số, tính tích) và số nhỏ, hay gặp; nhưng cùng kiểu lấy số sách vào kho ôn.
- Sửa: `tich-42` → "66 = 2 · 3 · ?" (đáp án 11, `check` "66:(2·3)", id `tich-66`); `tinh-3-2-7` → `3^{2} \cdot 11` (99, `check` "3^2·11", id `tinh-3-2-11`).

### 11. Nhãn hàng `2 + 19 = 21` mang màu và dấu ✚ của "số nguyên tố", đứng ngay cạnh 21 là hợp số (LL-05)

- Vị trí: visual `le-le` (`catalog.ts`, hàng 4: `tag: { text: "2 cộng số lẻ: tổng là số lẻ", color: "sky" }`), ở `$.sections[10].blocks[0].children[1]`, `$.sections[10].recap`, `$.cards[10].recap`. Ảnh `phone/117-s11-01-block.png`, `phone/129-s11-06-recap.png`
- Nguồn: —
- Vấn đề: sky và ✚ là màu, dấu của khái niệm "Số nguyên tố". Nhãn nói về chẵn lẻ của tổng nhưng đứng ngay sau 21, số trẻ hay tưởng là số nguyên tố; đây là hình recap trẻ xem một mình.
- Sửa: nhãn trung tính, không màu, không dấu: "Số 2 cộng số lẻ được số lẻ"; tô chính các số nguyên tố trong hàng: `\concept{sky}{2} + \concept{sky}{19} = 21`.

### 12. Dấu ✚, ◆, ▬ đứng ngay trước chữ số hay chữ đầu của nhãn, đọc thành "+2", "+23", "− Lẻ" (LL-21)

- Vị trí: `catalog.ts`, nhãn bắt đầu bằng chữ số: `le-le` "2 cộng số lẻ…"; `tong-25` "23 có trong bảng: số nguyên tố"; `viet-20`, `viet-20-xong` "17 là số nguyên tố", "18 là hợp số: bỏ"; nhãn slate "Lẻ cộng lẻ là chẵn" của `le-le`. Dùng ở `$.sections[10].blocks[0..1]`, `$.sections[11].blocks[0]`, recap section 11, 12, `$.cards[10].recap`, `$.cards[11].recap`. Ảnh `phone/117-s11-01-block.png`, `phone/119-s11-02-block-end.png`, `phone/132-s12-01-block-end.png`. Cùng kiểu, nhẹ hơn: dấu ✚ ở góc ô của bảng `bang-100` dính sát chữ số cuối (19, 29, 79…; `prime-table.tsx`, `MARK = 4`, ảnh `phone/036-s4-01-block.png`)
- Nguồn: —
- Vấn đề: dấu khái niệm cùng cỡ chữ, sát chữ số, giống dấu cộng của công thức ngay trên; trên iPad nhãn đứng cùng hàng nên đọc liền "21 ✚ 2 cộng…". LL-21 cấm đặt dấu thập hay gạch ngay trước một số. Không Nghiêm trọng vì dấu nằm trong viền nhãn, không thay cho một phép tính.
- Sửa: viết lại nhãn để không bắt đầu bằng chữ số: "Có trong bảng: 23 là số nguyên tố", "Số nguyên tố: giữ …", "Hợp số: bỏ …" (số theo Góp ý 10); nhãn `le-le` theo Nên sửa 11. Bảng `bang-100`: dời dấu ra góc ngoài ô hoặc thu nhỏ chữ số. Báo người làm app (không chặn bài): dấu trong nhãn nên nhỏ hơn chữ rõ rệt hay đặt ở góc.

### 13. Câu "Có thể viết một số thành tổng của ba số nguyên tố" đọc như số nào cũng viết được (LL-10)

- Vị trí: `$.sections[11].blocks[1].children[0].text` (`viet-tong`)
- Nguồn: tr.37 câu 2.32a (sách nói "mọi số tự nhiên lớn hơn 5…" là điều chưa có lời giải)
- Vấn đề: không nói số nào; sai với 2, 3, 4, 5 (tổng ba số nguyên tố nhỏ nhất là 6), còn với số lớn hơn 5 là điều sách nói chưa ai chứng minh.
- Sửa: "Nhiều số viết được thành tổng của ba số nguyên tố. Một số nguyên tố có thể được dùng nhiều lần, như 9 = 2 + 2 + 5."

### 14. Câu kiểm tra `viet-30` chỉ là phép trừ 30 − 7, không kiểm "thử rồi loại" (LL-16)

- Vị trí: `$.exercises[56]` (`viet-30`, `checkIds` section 12)
- Nguồn: tr.37 (2.32b)
- Vấn đề: đề cho sẵn nhóm thứ nhất 7 viên, nên dữ kiện "mỗi nhóm là số nguyên tố" không cần dùng; không cho biết trẻ đã biết thử rồi loại như hình mẫu. Vòng 1 (Nên sửa 24) đã nêu cả `viet-30` lẫn `viet-40`, mới sửa `viet-40`.
- Sửa (đã tính bằng python): "Hà chia 28 viên bi thành hai nhóm, số bi mỗi nhóm là số nguyên tố. Thử từ số nguyên tố nhỏ nhất. Nhóm ít bi hơn có thể có ít nhất bao nhiêu viên?" → 5 (28 − 2 = 26 và 28 − 3 = 25 là hợp số, 28 − 5 = 23); `check` "28-23"; "ít nhất" cần vì 28 còn bằng 11 + 17. Giữ `bang-nt` cuối đề; id `viet-28`.

### 15. Màn chạm `chon-chan-hs`: hai trong ba đáp án vừa in ở màn trước (LL-07)

- Vị trí: `$.sections[9].blocks[2]` (note "Chạm vào các số chẵn là hợp số. Số 2 không phải hợp số.", visual `chon-chan-hs`: 2, 4, 6, 9, 12, 13)
- Nguồn: —
- Vấn đề: 4, 6 vừa in ở hàng "Số chẵn lớn hơn 2: hợp số" của `chan-nt` ngay trước, trẻ chạm theo trí nhớ. Câu thứ hai là gợi ý đáp án (bỏ số 2), không phải lý do.
- Sửa: chips 2, 9, 16, 21, 26, 34 (`wants` 16, 26, 34; 9, 21 là hợp số lẻ để trẻ phải xét "chẵn"); note "Chạm vào các số chẵn là hợp số. Biết số chẵn lớn hơn 2 là hợp số, bạn nhận ra hợp số mà không cần tìm ước."

## Góp ý

### 1. Nấc 1 của các câu tra bảng ở section 4 tô câu hỏi thay vì bảng

- Vị trí: `$.exercises[16..19].hints.highlight` (`nha-57`, `tra-bang-nhieu`, `chon-nt-bang-2`, `nt-lon-nhat`), đều `{target: "block", index: 0}`
- Nguồn: —
- Vấn đề: trẻ sai thường vì chưa tra bảng. Vòng 1 bảo giữ block 0, nên chỉ ghi để tác giả cân nhắc.
- Sửa: tuỳ tác giả: `{target: "block", index: 1}` (block `bang-nt`).

### 2. Section `hop-so` có hai câu quy tắc cần nhớ riêng (LL-06)

- Vị trí: `$.sections[2]` (recap hai câu: định nghĩa hợp số, số 1)
- Nguồn: —
- Vấn đề: ý số 1 được đưa vào theo vòng 1 và là biên của hai định nghĩa; ghi để tác giả cân nhắc tách section "Số 1" ngắn.
- Sửa: tuỳ tác giả.

### 3. Note `rule` section 6 chứa cả câu chuyện (LL-06)

- Vị trí: `$.sections[5].blocks[1].children[0]` ("Mẹ xếp 12 cái bánh… Ta tách một số…", `rule: true`)
- Nguồn: —
- Vấn đề: câu chuyện là ví dụ nhưng nằm trong note `rule`, nên recap phải ghép hai câu dài.
- Sửa: chuyển câu chuyện thành `caption` của `cay-12` hay note thường; note `rule` chỉ còn "Ta tách một số thành hai thừa số, rồi tách tiếp tới khi mọi thừa số là số nguyên tố."

### 4. Caption `xet-65` nói tới 80 mà hình không có (LL-15)

- Vị trí: `$.sections[4].blocks[0].children[1].caption`
- Nguồn: —
- Vấn đề: "Số 80 tận cùng là 0, chia hết cho 2" trong khi hình chỉ có các hàng của 65.
- Sửa: thêm hàng `80 ⋮ 2` vào `xet-65` và `xet-65-xong`, hoặc bỏ câu về 80.

### 5. Ví dụ 72 nhảy hai bước (LL-18)

- Vị trí: `$.sections[7].blocks[1].children[0]` ("72 = 9 · 8 = 2 · 2 · 2 · 3 · 3")
- Nguồn: —
- Vấn đề: vừa tách 9, tách 8, vừa đổi thứ tự trong một dấu bằng.
- Sửa: "72 = 9 · 8 = 3 · 3 · 2 · 2 · 2 = 2 · 2 · 2 · 3 · 3", hoặc thêm hàng đó vào đầu hình `gon-72`.

### 6. Màn chạm section 9: hàng 71, 73, 79 của bảng nằm dưới mép màn (LL-12)

- Vị trí: `$.sections[8].blocks[1]`. Ảnh `ipad-landscape/100-s9-02-block.png`, `phone/101-s9-02-block.png`
- Nguồn: —
- Vấn đề: đúng các số cần tra phải cuộn mới thấy; chip 0–9 trên iPad ngang xuống dòng lệch trái (bố cục app).
- Sửa: báo người làm app (nút "Bảng số nguyên tố" dùng chung đã có trong backlog bàn giao); phía bài có thể rút gọn note.

### 7. Card `cay`, `cot`, `luy-thua` gắn khái niệm "Thừa số" (blue) mà hình không có màu blue (LL-05)

- Vị trí: `$.cards[5].conceptIds`, `$.cards[6].conceptIds`, `$.cards[7].conceptIds`
- Nguồn: —
- Vấn đề: thừa số nguyên tố trong mọi hình tô sky; blue không xuất hiện ở đâu.
- Sửa: đổi `conceptIds` sang `so-nguyen-to.concept.nguyen-to` (và `tich`), hoặc bỏ khái niệm `thua-so` nếu bài không dùng.

### 8. Câu ôn `phan-tich-4-9` trùng kết quả lời giải câu kiểm tra `cot-thieu-36` (LL-07)

- Vị trí: `$.exercises[39]` (`phan-tich-4-9`)
- Nguồn: —
- Vấn đề: 4 · 9 = 36 = 2² · 3², đúng số hình `giai-cot-36` vừa viết ra.
- Sửa: `4 \cdot 49` với lựa chọn `2^{2} \cdot 7^{2}` (đúng), `4 \cdot 7^{2}`, `2 \cdot 7^{2}`, `2^{2} \cdot 7`; tránh 9 · 25 (25 là số câu 2.23), 4 · 25 (nhiễu của `chon-phan-tich-100`), 8 · 9 (recap 72). Id `phan-tich-4-49`.

### 9. `dien-130` không có gợi ý nấc 1 (LL-02)

- Vị trí: `$.exercises[25].hints.highlight` (`highlight: []`, không `hintVisualId`)
- Nguồn: —
- Vấn đề: lần sai đầu không có gì sáng lên.
- Sửa: tô `block` 0 (đề) hoặc thêm hình gợi ý.

### 10. Hình mẫu `viet-20` dùng số 20 và 17 của câu 2.32a (LL-08)

- Vị trí: visual `viet-20`, `viet-20-xong` (`$.sections[11].blocks[0]`, `$.sections[11].recap`, `$.cards[11].recap`)
- Nguồn: tr.37 câu 2.32a, lời giải tr.107
- Vấn đề: không chép (sách viết 20 thành tổng ba số, bài viết thành tổng hai số), nhưng dùng đúng cặp số sách; 20 còn sẽ là số của hình section 1 (Nghiêm trọng 1).
- Sửa: 74 = 3 + 71 (74 − 2 = 72 là hợp số: bỏ; thử 3 được); id `viet-74`, `viet-74-xong`.

### 11. Câu ôn `tong-voi-2` có lựa chọn 9 mà hình `viet-9-ba` vừa giải "9 − 2 = 7" (LL-07)

- Vị trí: `$.exercises[54].options[0]`
- Nguồn: —
- Vấn đề: một đáp án đúng là hàng đầu của hình ví dụ section 12.
- Sửa: thay 9 bằng 43 (43 − 2 = 41 có trong bảng); đáp án 43, 13, 15, nhiễu 11.

### 12. `tong-voi-2`: "tổng của 2 và một số nguyên tố" nên viết "số 2" (LL-10)

- Vị trí: `$.exercises[54].prompt[0].text`
- Nguồn: —
- Vấn đề: đọc to dễ nghe thành "tổng của hai số nguyên tố"; tập đáp án không đổi nên chỉ Góp ý.
- Sửa: "Chọn tất cả số viết được thành tổng của số 2 và một số nguyên tố."

### 13. `viet-40`: "Số hạng đầu tiên nào…" khó đọc (LL-19)

- Vị trí: `$.exercises[57].prompt[1].text`
- Nguồn: —
- Vấn đề: ghép "đầu tiên" với "nào" làm câu khó hiểu.
- Sửa: "Số nguyên tố nhỏ nhất nào mà 40 trừ đi số đó vẫn được một số nguyên tố?"

### 14. `chon-chan-lon` không luyện ý "hợp số" và trùng số với `chon-hs-chan` (LL-07)

- Vị trí: `$.exercises[49]` (visual `chon-chan-lon`: 2, 3, 14, 15, 16, 17), `$.exercises[50]` (`chon-hs-chan`: 14, 17, 20, 22)
- Nguồn: —
- Vấn đề: đề chỉ hỏi "chẵn lớn hơn 2", không nối tới "là hợp số"; hai câu ôn cùng card dùng chung 14, 17.
- Sửa: "Chạm vào tất cả các hợp số chẵn." với chips 2, 3, 64, 65, 68, 69 (`wants` 64, 68).

### 15. `dien-tong-5` gần như chép caption của `tong-hs-2` (LL-07)

- Vị trí: `$.exercises[63].segments`, so với caption `$.sections[12].blocks[1]`
- Nguồn: —
- Vấn đề: câu ôn lặp câu caption vừa đọc, chỉ kiểm nhớ chữ.
- Sửa: "Trong tổng 55 + 30, hai số hạng đều chia hết cho 5 và tổng lớn hơn 5, nên tổng là ___." (tránh 15 + 35 = 50, số câu 2.32b).

### 16. Nhãn của `tong-hs-2` nói khác `tong-hs-1` và `goi-y-tong-hs` (LL-05)

- Vị trí: visual `tong-hs-2` (`$.sections[12].blocks[1]`): "Thừa số 10 chia hết cho 5", "Thừa số 5 chia hết cho 5"
- Nguồn: —
- Vấn đề: hai hình kia ghi "Tích có thừa số 4: chia hết cho 2" theo quy tắc tích của Bài 9.
- Sửa: "Tích có thừa số 10: chia hết cho 5", "Tích có thừa số 5: chia hết cho 5".

### 17. Câu thứ hai của quy tắc section 13 thiếu "Nếu" (LL-10)

- Vị trí: `$.sections[12].blocks[0].children[0].text`, `$.sections[12].recap.caption`, `$.cards[12].recap.caption`
- Nguồn: —
- Vấn đề: "Số đó lớn hơn 1 và tổng lớn hơn số đó thì…" mở đầu như một câu khẳng định.
- Sửa: "Nếu số đó lớn hơn 1 và tổng lớn hơn số đó thì tổng là hợp số." Sửa cùng lúc note, recap section, recap card.

### 18. Bố cục app: bảng `bang-nt` trong đề đẩy câu hỏi và phần được tô khỏi màn (LL-12)

- Vị trí: `phone/124-s11-05-exercise-tong-31.png`, `phone/126-s11-05-exercise-tong-31-wrong2.png`, `phone/134-s12-03-exercise-viet-30.png`; `ipad-landscape/117-s11-02-block.png`, `130-s12-01-block.png`
- Nguồn: —
- Vấn đề: lần sai thứ hai cú nói "Nhìn phần được đánh dấu nhé!" khi khối được tô ở ngoài màn; hàng cuối bảng nằm dưới thanh "Tiếp" trên iPad ngang.
- Sửa: báo người làm app (cuộn tới phần được tô khi hiện nấc 1; nút bảng dùng chung trong backlog).

### 19. Nhãn "Số chẵn" của `chan-le` trên điện thoại nằm giữa hai hàng số (LL-12)

- Vị trí: visual `chan-le` (`$.sections[9].blocks[0].children[1]`); ảnh `phone/108-s10-01-block.png`
- Nguồn: —
- Vấn đề: nhãn rơi xuống ngay trên hàng số lẻ, có thể đọc như tiêu đề của hàng đó.
- Sửa: thêm nhãn trung tính, không màu cho hàng dưới ("Số lẻ: không chia hết cho 2").

### 20. Dòng thứ hai của các màn chạm là cách làm, không phải lý do

- Vị trí: note đầu các màn chạm `$.sections[0].blocks[2]`, `[1].blocks[2]`, `[3].blocks[2]`, `[4].blocks[2]`, `[8].blocks[1]`
- Nguồn: —
- Vấn đề: checklist trục 5 cần một dòng việc phải làm và một dòng để làm gì; các màn này có dòng việc và dòng cách làm. Vòng 1 không ghi, trẻ vẫn biết làm gì.
- Sửa: tuỳ tác giả, thêm vế lý do khi viết lại note (như Nên sửa 15).

Ghi chú ngoài bài (không tính phát hiện): `notebooks/backlogs/lesson-so-nguyen-to/task.md` mục "Để reviewer soi kĩ" còn ghi `hs-tong-nhieu` là "3 · 5 + 6 · 7" (nay `6 · 5 + 9 · 7`), mục "Cấu trúc bài" còn tên `xep-7-cach` và câu "Câu 2.30 được dùng làm hình mở đầu các section 1–3"; cập nhật bàn giao sau khi sửa Nghiêm trọng 1.
