# Review: Số nguyên tố (`so-nguyen-to`)

- Bài: `content/math/kntt/so-nguyen-to/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/so-nguyen-to/` - sbt-p35, sbt-p36, sbt-p37, sbt-p106, sbt-p107
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá, bài draft)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/so-nguyen-to/`
- Kết luận: Chưa đạt: còn 9 lỗi Nghiêm trọng (đã chạy `pnpm content:hash so-nguyen-to --root content --mark`)
- Bản đã review: `db5d851d8d249d10b0ada029ad6e26a11525626bbcafda21e1d41702806246d8` (`pnpm content:diff` so với bản này)

Đã soát: 64 bài tập (tự giải bằng chương trình trước khi đọc `answer`: mọi đáp án và nhiễu đúng về số, trừ hai câu ở Nghiêm trọng 3 và Nên sửa 11); mọi `note` quy tắc, `recap`, `caption`, recap card, `overview`, glossary Toán; các hình `column`, `sieve`, `le-le`, `chan-le`, `ngto-dau` trong `src/visuals/math/so-nguyen-to/`. Tổng hợp đã mở lại `sbt-p35.png`, `sbt-p36.png`, `sbt-p37.png`, ảnh walk `phone/038`, `phone/081` để kiểm các mục Nghiêm trọng của nhóm.

Đổi số: nhiều mục dưới đây đề xuất số mới. Sau khi đổi, tác giả soát lại toàn bài để các số mới không trùng nhau, không trùng số của recap, ví dụ, câu luyện (LL-07) và không trùng bộ số của sách (LL-08). Các đề xuất trong review này đã được chọn để không đụng nhau.

Quyết định chung cho bài:
- **Block `sang-100`: bỏ** (Nghiêm trọng 4).
- **Câu "tra bảng": hiện bảng ngay trong đề** bằng một hình gọn dùng chung (Nghiêm trọng 6).

## Nghiêm trọng

### 1. Ba câu định nghĩa chép nguyên văn hoặc gần nguyên văn sách bài tập (LL-08)

- Vị trí: `$.sections[1].blocks[0].children[0].text` (số nguyên tố), `$.sections[2].blocks[0].children[0].text` (hợp số), `$.sections[5].blocks[0].children[0].text` (phân tích ra thừa số nguyên tố, câu đầu); kéo theo `$.sections[1].recap.caption`, `$.sections[2].recap.caption`, `$.sections[5].recap.caption`, `$.cards[1].recap.caption`, `$.cards[2].recap.caption`, `$.cards[5].recap.caption`, và caption `$.sections[1].blocks[1].caption` ("Mỗi số nguyên tố chỉ có hai ước là 1 và chính nó.")
- Nguồn: tr.35 mục A "Kiến thức cần nhớ", ý 1, 2, 3 (`sbt-p35.png`)
- Vấn đề: câu số nguyên tố và câu hợp số trùng từng chữ với ý 1, ý 2 của sách. Câu phân tích chỉ bỏ "tự nhiên lớn hơn 1" và "dưới dạng một" khỏi ý 3, nên vừa gần nguyên văn vừa mất điều kiện "lớn hơn 1" mà hai định nghĩa kia có (trẻ có thể thử phân tích 0 hay 1). Checklist trục 1 xếp chép nguyên văn là Nghiêm trọng; `quan-he-chia-het-va-tinh-chat` và `uoc-chung-uoc-chung-lon-nhat` vòng 1 đã bị ghi cùng lỗi. (Gộp Nghiêm trọng 4 nhóm 1 và Nên sửa 2 nhóm 2.)
- Sửa: viết lại theo cách làm, giữ đủ điều kiện, ví dụ:
  - "Ta gọi một số tự nhiên là số nguyên tố khi số đó lớn hơn 1 và chỉ chia hết cho 1 và cho chính nó."
  - "Ta gọi một số tự nhiên là hợp số khi số đó lớn hơn 1 và có từ ba ước trở lên."
  - "Muốn phân tích một số lớn hơn 1 ra thừa số nguyên tố, ta viết số đó thành tích mà mọi thừa số đều là số nguyên tố."
  Sửa cùng lúc note, recap section, recap card (luật `[rule-sentence]`). Caption `xep-11`/`ngto-dau` đổi theo, vd "2, 3, 5, 7 chỉ chia hết cho 1 và cho chính nó."

### 2. Câu kho ôn chép bài tập của sách: cùng số, cùng đề, cùng đáp án (LL-08)

- Vị trí: `$.exercises[9]` (`xep-7-cach`), `$.exercises[58]` (`viet-ba-17`), `$.exercises[59]` (`viet-50`)
- Nguồn: tr.37 câu 2.30a, 2.32a, 2.32b (`sbt-p37.png`); lời giải tr.106, tr.107 (`sbt-p106.png`, `sbt-p107.png`)
- Vấn đề: `xep-7-cach` ("Cho 7 hình vuông đơn vị. Có mấy cách xếp chúng thành hình chữ nhật?", đáp án 1) là câu 2.30a chỉ bỏ "Nếu… thì ta". `viet-ba-17` hỏi đúng số 17 của 2.32a, đáp án `3 + 7 + 7` là lời giải sách; `viet-50` hỏi đúng số 50 của 2.32b, đáp án `13 và 37` là lời giải sách. Bàn giao cũng ghi "số trong bài tự chọn, không dùng số của sách". (Nhóm 3 ghi `viet-ba-17`, `viet-50`; Tổng hợp thêm `xep-7-cach` sau khi so với `sbt-p37.png`.)
- Sửa (đã kiểm bằng chương trình):
  - `xep-7-cach` → `xep-5-cach`: "Mẹ có 5 viên gạch vuông. Mẹ có mấy cách xếp chúng thành hình chữ nhật?" kèm note thứ hai như Nghiêm trọng 3; đáp án 1, nhiễu 2, 3, 5.
  - `viet-ba-17` → `viet-ba-19`: "Chọn tất cả cách viết 19 thành tổng của ba số nguyên tố." Lựa chọn `3 + 3 + 13` (đúng), `5 + 7 + 7` (đúng), `2 + 8 + 9` (8, 9 là hợp số), `1 + 5 + 13` (1 không là số nguyên tố). 19 có đúng 3 cách (3 + 3 + 13, 3 + 5 + 11, 5 + 7 + 7); không đưa `3 + 5 + 11` vào nhiễu.
  - `viet-50` → `viet-44`: "Hai số nào đều là số nguyên tố và có tổng bằng 44?" Lựa chọn `13 và 31` (đúng), `9 và 35`, `15 và 29`, `1 và 43`.
  Đổi id và tự giải lại sau khi sửa.

### 3. `xep-7-cach` có hai cách hiểu: tính cả hình xoay thì nhiễu "2" cũng đúng (LL-10, LL-01)

- Vị trí: `$.exercises[9]` (`xep-7-cach`), card `nguyen-to`; liên quan `$.sections[0].blocks[1]` (visual `xep-8`)
- Nguồn: tr.37 câu 2.30 (sách đếm 6 ô có hai cách: 1 hàng 6 ô và 2 hàng 3 ô, tức không tính hình xoay)
- Vấn đề: đề không nói xoay hình có tính là cách khác không. Trẻ đếm "1 hàng 7 ô" và "7 hàng, mỗi hàng 1 ô" là hai cách thì chọn 2, cũng là lựa chọn có sẵn. Câu cùng dạng `xep-18-cach` có note "Xoay hình chữ nhật thì vẫn tính là một cách.", câu này thì không; bài cũng không có note nào dạy điều đó (chỉ ngầm qua hình `xep-12`, `xep-8`). Nhiễu cũng đúng theo một cách hiểu hợp lý là Nghiêm trọng.
- Sửa: thêm vào `prompt` note "Xoay hình chữ nhật thì vẫn tính là một cách." (cùng câu của `xep-18-cach`). Tốt hơn nữa: đưa câu này vào caption màn `xep-8` ở section 1 ("… có hai cách xếp. Xoay hình chữ nhật thì vẫn tính là một cách.") để trẻ học trước khi gặp; vẫn giữ note trong đề vì câu kho ôn được làm riêng.

### 4. Hình sàng `sang-100` và câu "gạch các bội của 2, 3, 5, 7" nằm ngoài nguồn; quyết định: bỏ block (LL-09)

- Vị trí: `$.sections[3].blocks[0]` (note "Gạch các bội của 2, 3, 5 và 7, trừ chính các số đó. Số không bị gạch là số nguyên tố." và visual `so-nguyen-to.visual.sang-100`), section `bang-so-nguyen-to`; `src/visuals/math/so-nguyen-to/catalog.ts` mục `sang-100`; `sieve.tsx` (nhánh `mode: "steps"`)
- Nguồn: tr.35–37, lời giải tr.106 (`sbt-p35.png`–`sbt-p37.png`, `sbt-p106.png`): sách chỉ bảo "tra bảng số nguyên tố" (2.26), không có cách lập bảng
- Vấn đề: cách lập bảng bằng gạch bội không có trong nguồn và không suy ra trực tiếp được. Câu "Số không bị gạch là số nguyên tố" còn sai với số 1 (1 không bị gạch). Bàn giao đã tự ghi rủi ro này ("nếu reviewer cho là ngoài nguồn, bỏ block `sang-100`").
- Quyết định: **bỏ**. Giữ là phải thêm một ngoại lệ nguồn cho một thủ thuật mà bài không dùng lại ở đâu (mọi câu sau đều tra bảng), và phải sửa câu sai về số 1; bỏ thì section ngắn hơn, đúng một ý "tra bảng".
- Sửa: xoá `$.sections[3].blocks[0]`, mục `sang-100` trong `catalog.ts`, và nhánh từng bước (`STEP_LABELS` các bước gạch, `crossedAt`, `StepPlayer`, gạch chéo hồng) trong `sieve.tsx` để không để mã chết; kind `sieve` chỉ còn bảng tĩnh. Thay block đã bỏ bằng một màn mẫu tra bảng đặt sau màn quy tắc, ví dụ note "Tra 59: 59 có trong bảng, nên 59 là số nguyên tố. Tra 77: 77 không có trong bảng và lớn hơn 1, nên 77 là hợp số." kèm bảng gọn ở Nghiêm trọng 6. Section 4 vẫn đủ mẫu, cùng làm, tự làm.

### 5. Bảng `bang-100` (màn quy tắc, recap section, recap card) dạy ngầm rằng 1 là số nguyên tố (LL-15)

- Vị trí: visual `so-nguyen-to.visual.bang-100` (kind `sieve`, mode `still`) ở `$.sections[3].blocks[1]`, `$.sections[3].recap`, `$.cards[3].recap`; `src/visuals/math/so-nguyen-to/sieve.tsx` (`STEP_LABELS` bước cuối, `Legend`). Ảnh: `phone/038-s4-02-block.png`
- Nguồn: tr.35 mục A ý 1 (số nguyên tố lớn hơn 1)
- Vấn đề: bảng tĩnh in nhãn "Số không bị gạch là số nguyên tố" và chú giải "Hợp số (bị gạch)". Số 1 không bị gạch, cũng không được tô, nên đọc theo nhãn thì 1 là số nguyên tố, trái với note section `hop-so` ("số 1 không phải số nguyên tố, cũng không phải hợp số"). Đây là hình recap trẻ xem một mình khi ôn, và đúng chỗ trẻ hay nhầm nhất. Nhãn còn trỏ về cách gạch đã bỏ ở Nghiêm trọng 4.
- Sửa: nhãn dưới bảng "Bảng các số nguyên tố nhỏ hơn 100"; bỏ gạch chéo và độ mờ, các số không phải số nguyên tố để màu chữ thường; chú giải: "✚ Số nguyên tố" và một dòng "Số 1 không là số nguyên tố, cũng không là hợp số". Chụp lại và tự xem ảnh.

### 6. Các câu và màn "tra bảng" không có bảng trên màn; cách chung: hiện bảng gọn ngay trong đề

- Vị trí: section 4 `$.exercises[16]` (`nha-57`, câu kiểm tra), `[17]` (`tra-bang-nhieu`), `[18]` (`chon-nt-bang-2`), `[19]` (`nt-lon-nhat`), `[20]` (`dien-91`), màn cùng làm `$.sections[3].blocks[2]` (`chon-nt-bang`, note "Tra bảng rồi chạm, không cần thử chia"); section 9 (quy tắc "Ta tra bảng số nguyên tố…") `$.exercises[41..44]` (`a-9a`, `a-5a`, `chon-a-1`, `a-4a-hop-so`), màn `$.sections[8].blocks[1]` (`chon-a-6`); section 11, 12 (note "vì 23 có trong bảng", quy tắc "thử từng số nguyên tố trong bảng") `$.exercises[51..53]` (`tong-21`, `tong-35-khong`, `tong-voi-2`), `$.exercises[55..59]` (`viet-30`, `viet-40`, `noi-tong`, `viet-ba-17`, `viet-50`), màn `tong-25`, `tong-27`, `viet-20`
- Nguồn: tr.36 câu 2.25, 2.26; lời giải tr.106 ("Tra bảng số nguyên tố, ta có…")
- Vấn đề: ba quy tắc của bài bảo trẻ tra bảng, note section 4 còn bảo "không cần thử chia", nhưng bảng chỉ hiện ở màn quy tắc section 4 (sheet `phone/039`, `040`, `042`; `ipad/039`, `040` không có bảng). Trẻ phải nhớ cả 25 số hoặc tự chia; dấu hiệu chia hết để loại 51, 57 chỉ dạy ở section 5. Với người học chậm, nhanh quên, câu kiểm tra `nha-57` thành đoán: trẻ không làm được bài theo cách vừa học.
- Sửa (cách chung, một nguồn dùng lại):
  - Thêm một visual tĩnh gọn `so-nguyen-to.visual.bang-nt` (kind `sieve` mode `still` ở cỡ nhỏ, hoặc một kind mới liệt kê 25 số nguyên tố nhỏ hơn 100 thành 5 hàng, mỗi hàng 5 số, màu sky kèm dấu), có tiêu đề "Bảng số nguyên tố nhỏ hơn 100". Gọn để vừa màn điện thoại cùng bàn phím số.
  - Đặt nó làm block **cuối** của `prompt` ở mọi câu trên, và làm child của group ở các màn chạm trên; giữ highlight nấc 1 ở `block` 0 (câu hỏi). Bảng là công cụ của đề, không đặt ở `hintVisualId` (nấc 2 không được hiện kết quả).
  - Không thêm bảng vào section 5 (dấu hiệu chia hết), 6–8, 10: ở đó trẻ phải tự xét, có bảng thì bỏ qua kĩ năng.
  - Quy tắc từ nay cho bài: câu hay màn nào mà quy tắc của section bảo "tra bảng" thì có bảng gọn trên màn; soát lại bằng cách tìm "bảng" trong `lesson.json`.
  - Ghi vào `notebooks/backlogs/` một ý cho app: nút "Bảng số nguyên tố" dùng chung cho mọi bài cần tra, thay cho việc chèn hình vào từng đề (không chặn bài này).

### 7. Dấu "✚" (màu số nguyên tố) đứng ngay trước số chia trong sơ đồ cột, đọc thành "+2", "+?" (LL-21)

- Vị trí: `src/visuals/math/so-nguyen-to/column.tsx` (`ConceptMark` trước `row.prime`); mọi hình kind `column`: `cot-60` (`$.sections[6].blocks[0]`), `cot-84`, `cot-105`, recap `cot-60-xong` (`$.sections[6].recap`, `$.cards[6].recap`), `cot-thieu-36`, `cot-thieu-150`, `goi-y-cot-90`, `giai-cot-36`, `giai-cot-150`. Ảnh: `phone/081-s7-05-exercise-cot-thieu-150.png`, `phone/074-s7-01-block-end.png`
- Nguồn: tr.35 (sơ đồ cột của 945 chỉ có số), tr.36 câu 2.27
- Vấn đề: đã mở ảnh `phone/081`: cột hiện "150 | ✚2", "75 | ✚?", "25 | ✚5"; dấu thập xanh cùng cỡ, cùng màu với chữ số, đứng sát bên trái số chia, đọc đúng như "+2". Đây là sơ đồ của phép chia mà lại có dấu giống dấu cộng; trẻ học chậm, yếu nhân chia dễ hiểu sai cách làm (cộng 2) và chép dấu "+" khi tự vẽ cột trên giấy. Hình cây có chú giải "✚ Số nguyên tố" và dấu nhỏ ở góc, hình cột thì không. Lỗi cách đọc do hình của bài, không do bố cục app.
- Sửa: bỏ dấu ở từng hàng (mọi số ở cột phải đều là số nguyên tố, màu sky đã đủ phân biệt với cột trái), và thêm một `Legend` dưới cột: "✚ Số chia: số nguyên tố" để vẫn có ký hiệu hình cho trẻ mù màu (`docs/design-system.md`, nguyên tắc 5). Chụp lại mọi hình `column`.

### 8. Quy tắc "tổng là hợp số" thiếu điều kiện số chia lớn hơn 1, nên sai toán học (LL-17)

- Vị trí: `$.sections[12].blocks[0].children[0].text`, `$.sections[12].recap.caption` (`tong-hop-so`), `$.cards[12].recap.caption`
- Nguồn: tr.107 (`sbt-p107.png`, lời giải 2.31a: "chia hết cho 2 … > 2 nên là hợp số")
- Vấn đề: "Các số hạng cùng chia hết cho một số thì tổng chia hết cho số đó. Tổng lớn hơn số đó thì tổng là hợp số." sai khi "số đó" là 1: mọi số hạng chia hết cho 1, tổng nào cũng lớn hơn 1, nên theo câu này 10 + 3 = 13 là hợp số, đúng lựa chọn `10 + 3` của câu luyện `hs-tong-nhieu`. Recap và card lặp câu sai. Thêm nữa, cùng một ý "chia hết cho một số lớn hơn 1 và lớn hơn số đó thì là hợp số" đang được nói ba cách ở section 5 ("Số chia hết cho 2, 3 hoặc 5 mà lớn hơn số chia đó…"), section 10 ("Các số chẵn lớn hơn 2 đều là hợp số") và section 13.
- Sửa: dùng câu Bài 8 cho vế đầu (xem Nên sửa 21) và cùng khuôn với section 5 cho vế sau: "Nếu các số hạng của một tổng đều chia hết cho một số thì tổng chia hết cho số đó. Số đó lớn hơn 1 và tổng lớn hơn số đó thì tổng là hợp số." Sửa cùng lúc note, recap section, recap card.

### 9. Nhãn "Có số 2: tổng là số lẻ" trong hình quy tắc và recap là khái quát sai (LL-17)

- Vị trí: visual `so-nguyen-to.visual.le-le` (`catalog.ts`, hàng `2 + 19 = 21`), dùng ở `$.sections[10].blocks[0]`, `$.sections[10].recap`, `$.cards[10].recap`
- Nguồn: tr.35 ví dụ 2 ("chỉ có thể là tổng của một số lẻ và một số chẵn")
- Vấn đề: nhãn nói chung "có số 2 thì tổng là số lẻ", sai với 2 + 2 = 4 (cả hai đều là số nguyên tố). Nhãn ở recap section và card, màn trẻ xem lại một mình, nên trẻ dễ nhớ "cộng với 2 là ra số lẻ". Điều đúng: 2 cộng một số lẻ thì được số lẻ.
- Sửa: nhãn "2 cộng số lẻ: tổng là số lẻ". Sửa cùng lúc với Nên sửa 19 (thêm hàng "số nguyên tố khác 2 đều lẻ").

## Nên sửa

### 1. "Hình vuông đơn vị" là tên thứ hai cho "viên gạch vuông", "ô" (LL-05)

- Vị trí: `$.exercises[13]` (`xep-18-cach`); `xep-7-cach` đã đổi chữ ở Nghiêm trọng 2
- Nguồn: tr.37 câu 2.30
- Vấn đề: section 1–3 gọi là "viên gạch vuông" (note, caption) và "ô" (nhãn hình `rects`); câu ôn đổi sang "hình vuông đơn vị", từ chưa dạy, không có trong glossary.
- Sửa: "Mẹ có 18 viên gạch vuông. Mẹ có mấy cách xếp chúng thành hình chữ nhật?"

### 2. Recap section `hop-so` thiếu ý số 1 (LL-06)

- Vị trí: `$.sections[2].recap`, `$.cards[2].recap`, note `$.sections[2].blocks[2].children[0]` (không `rule`)
- Nguồn: tr.35 mục A ý 1, 2
- Vấn đề: section dạy hai điều cần nhớ: định nghĩa hợp số và "số 1 không phải số nguyên tố, cũng không phải hợp số". Recap và hình `so-sanh-nt-hs` chỉ có ý đầu, trong khi câu ôn `chi-mot-uoc` của card hỏi đúng ý số 1.
- Sửa: đánh `"rule": true` cho note số 1 và đưa câu đó vào recap section, recap card (hai câu); hình recap thêm hàng `uoc-cua-1`.

### 3. Tag "Ước của …" đổi màu theo loại số, lệch màu khái niệm ước (LL-05)

- Vị trí: visual `ngto-dau` (`$.sections[1].blocks[1]`, recap section 2, `$.cards[1].recap`), visual `so-sanh-nt-hs` (`$.sections[2].blocks[1]`, recap section 3, `$.cards[2].recap`)
- Nguồn: —
- Vấn đề: ở `rects`, `uoc-cua-1` tag ước màu violet (concept `uoc`); ở `ngto-dau` cùng tag màu sky, ở `so-sanh-nt-hs` màu sky và pink. Một khái niệm hai màu. Ở `ngto-dau`, hàng "1, 2" mang màu sky cạnh chú giải "Số nguyên tố", nên trẻ có thể đọc cả số 1 là số nguyên tố, trong khi chính 2, 3, 5, 7 không được tô.
- Sửa: tag ước để violet; tô chính số nguyên tố trong hàng (`1,\ \concept{sky}{2}`); `so-sanh-nt-hs` làm tương tự (7 sky, 6 pink, tag ước violet).

### 4. Màn cùng làm `chon-nt-2-7` dùng đúng các số vừa in ở màn trước (LL-07)

- Vị trí: `$.sections[1].blocks[2]` (visual `chon-nt-2-7`, chips 2–7, đáp án 2, 3, 5, 7)
- Nguồn: —
- Vấn đề: màn `ngto-dau` ngay trước liệt kê đúng 2, 3, 5, 7; trẻ chạm theo trí nhớ, không cần tìm ước như note yêu cầu.
- Sửa: chips 14, 15, 16, 17, 18, 19 (đáp án 17, 19) hoặc dải khác chưa có ở section 1–2.

### 5. Câu kho ôn lặp số và đáp án của recap, ví dụ, câu luyện (LL-07)

- Vị trí và sửa (gộp Nên sửa 5 nhóm 1, Nên sửa 5 nhóm 2, Nên sửa 7 nhóm 3):
  - `$.exercises[12]` `chon-hs-bank` (6, 7, 12, 13, 15, 17) chứa 6, 7 của hình recap `so-sanh-nt-hs`: thay 6, 7 bằng 26 và 83.
  - `$.exercises[7]` `chon-nt-bank` (3, 9, 12, 19, 21, 23) chứa 3 của recap `ngto-dau`, 19 của `chon-nt-nhieu-1`, 9, 21 của `nt-13`, 19, 21, 23 của `chon-hs-nhieu`, 21, 23 của `chon-nt-bang`: đổi thành 34, 43, 47, 58, 62, 86 (đáp án 43, 47; 47 rảnh sau khi `dh-nhieu` đổi sang 49 theo Nên sửa 14).
  - `$.exercises[35]` `tich-28` (28 = 2 · 2 · ?) lặp phân tích 28 của câu kiểm tra `cay-thieu-28`: đổi thành 52 = 2 · 2 · ? (13).
  - `$.exercises[34]` `chia-dau-75` lặp ô "75 | ?" của `cot-thieu-150`: đổi sang 87 = 3 · 29 (đáp án 3), kèm đề theo Nên sửa 11; tránh 63 (câu kiểm tra `dh-63`), 45 và 105 (đã có ở `cay-thieu-45`, `cot-105`).
  - `$.exercises[57]` `noi-tong` dùng lại 18 = 7 + 11 của hình `le-le` và nhiễu `3 + 17` của recap `viet-20-xong`: thay 18 bằng 16 nối `3 + 13` (chỉ đưa `3 + 13` vào cột phải), nhiễu `3 + 17` thay bằng `5 + 17`.
- Nguồn: —
- Vấn đề: phiên ôn hỏi lại đúng số trẻ vừa thấy đáp án.

### 6. Câu `dien-91` suy "không có trong bảng nên là hợp số" mà bỏ điều kiện lớn hơn 1 (LL-17)

- Vị trí: `$.exercises[20]` (`dien-91`), `segments[0]`
- Nguồn: tr.35 mục A ý 2
- Vấn đề: bước "không phải số nguyên tố thì là hợp số" chỉ đúng với số lớn hơn 1; câu in sẵn lý do này như quy tắc chung, sai với số 1 (cũng không có trong bảng), ngay sau section vừa dạy số 1.
- Sửa: "Số 91 lớn hơn 1 và không có trong bảng số nguyên tố, nên 91 là ___."

### 7. `sourceRef` section `dem-uoc` và card `uoc` trỏ trang không có quy tắc tìm ước

- Vị trí: `$.sections[0].sourceRef`, `$.cards[0].sourceRef` ("Sách bài tập tr.35, 37")
- Nguồn: tr.35, tr.37
- Vấn đề: quy tắc tìm ước là của Bài 8 (`quan-he-chia-het-va-tinh-chat`), không có ở tr.35; tr.37 chỉ có câu 2.30.
- Sửa: "Ôn Bài 8 (quan hệ chia hết); câu 2.30 tr.37".

### 8. Bảng số nguyên tố nhỏ trên iPad, số bị gạch mờ khó tra (LL-12)

- Vị trí: `src/visuals/math/so-nguyen-to/sieve.tsx` (`max-w-[300px]`, `opacity={crossed ? 0.55 : 1}`), visual `bang-100`
- Nguồn: —
- Vấn đề: iPad ngang bảng chỉ rộng khoảng một phần ba thẻ (`ipad-landscape/038`), iPad dọc khoảng một nửa (`ipad/038`); số bị gạch hồng và mờ 55%, khó tìm 57 hay 91 khi tra. Giới hạn rộng nằm trong mã hình của bài.
- Sửa: nâng `max-w` (420–480px) cho bảng tĩnh; bỏ gạch và độ mờ theo Nghiêm trọng 5.

### 9. Màn mở đầu section 6 trên điện thoại: câu chuyện bánh bị đẩy khỏi màn, và note gộp hai ý (LL-12)

- Vị trí: `$.sections[5].blocks[0]` (note quy tắc + visual `cay-12` + caption); ảnh `phone/057-s6-01-block.png`, `phone/058-s6-01-block-end.png`
- Nguồn: tr.35 mục A ý 3
- Vấn đề: trên điện thoại caption "Mẹ xếp 12 cái bánh vào 4 hộp…" bị cắt ở mép dưới rồi bị đẩy khỏi màn khi cây mở hết; câu chuyện lại là chữ xám nhỏ. Note gộp định nghĩa phân tích (dùng cho cả section 6, 7) và cách tách bằng cây.
- Sửa: đưa câu chuyện bánh lên làm note ngắn trước cây ("Mẹ xếp 12 cái bánh vào 4 hộp, mỗi hộp 3 cái: 12 = 3 · 4."), bỏ caption; hoặc tách định nghĩa (đã viết lại theo Nghiêm trọng 1) thành màn riêng với ví dụ 12 = 2 · 2 · 3, để màn cây chỉ còn cách tách. Chụp lại ở điện thoại.

### 10. Quy tắc sơ đồ cột mở đầu bằng "Chia số đó" mà chưa nói số nào (LL-06)

- Vị trí: `$.sections[6].blocks[0].children[0].text`, `$.sections[6].recap.caption`, `$.cards[6].recap.caption`
- Nguồn: tr.35 ví dụ 1
- Vấn đề: câu đầu section và recap card xem một mình; "số đó" không có gì đứng trước để chỉ.
- Sửa: "Muốn phân tích một số bằng sơ đồ cột, ta chia số đó cho số nguyên tố nhỏ nhất mà nó chia hết, rồi chia tiếp thương tới khi được 1. Các số chia là các thừa số nguyên tố."

### 11. `chia-dau-75`: số 5 cũng là số chia đầu hợp lệ nếu đề không nhắc "nhỏ nhất" (LL-10)

- Vị trí: `$.exercises[34]` (`chia-dau-75`)
- Nguồn: tr.35 ví dụ 1; tr.106 (2.27)
- Vấn đề: cột 75 | 5, 15 | 3, 5 | 5, 1 vẫn đúng toán; trẻ thấy tận cùng 5 rồi chọn 5 thì bị chấm sai. Đáp án 3 chỉ đúng theo chữ "nhỏ nhất" của quy tắc, mà đề không nhắc. Quy tắc của bài định nghĩa cách làm, nên giữ ở Nên sửa.
- Sửa (cùng lúc đổi số theo Nên sửa 5): "Phân tích 87 bằng sơ đồ cột. Ta chia cho số nguyên tố nhỏ nhất mà 87 chia hết. Đó là số nào?" Lựa chọn 2, 3, 7, 29; đáp án 3 (87 = 3 · 29; 29 là nhiễu "số chia lớn").

### 12. Màn cùng làm `chon-a-6` có cùng tập đáp án {1; 7} với ví dụ `thu-3a` ngay trước (LL-07)

- Vị trí: `$.sections[8].blocks[1]` (visual `chon-a-6`, `wants: [1, 7]`), so với `$.sections[8].blocks[0]` (`thu-3a`: 31, 37)
- Nguồn: tr.36 (2.25)
- Vấn đề: trẻ chỉ cần chép hai chữ số vừa thấy.
- Sửa: đổi sang 7a (71, 73, 79: a = 1; 3; 9); sửa `items`, `wants`, note, `done`.

### 13. Số "9a", "5a", "3a" viết trơn, không gạch trên như Bài 9 và như sách (LL-05)

- Vị trí: `$.exercises[41..44]` (`a-9a`, `a-5a`, `chon-a-1`, `a-4a-hop-so`), `$.sections[8]` (note, caption, recap), visual `thu-3a`, `chon-a-6`
- Nguồn: tr.36 câu 2.25 (viết có gạch trên)
- Vấn đề: Bài 9 (`dau-hieu-chia-het`) viết `\overline{34a}`; bài này viết "9a" bằng chữ thường, trẻ đã học viết tắt phép nhân có thể đọc "9a" là 9 nhân a.
- Sửa: đưa số vào khối `formula` `\overline{9a}` như Bài 9 (đề, nhãn hình); câu quy tắc giữ chữ "số có hai chữ số" và để công thức trong khối riêng.

### 14. Section dấu hiệu: mọi số không chia hết cho 2, 3, 5 đều là số nguyên tố, dễ khiến trẻ nhớ ngược quy tắc (LL-14)

- Vị trí: `$.sections[4]`: visual `chon-hs-dh` (41, 67), `$.exercises[21]` `dh-63` (31, 61, 71), `$.exercises[22]` `dh-nhieu` (23, 47), visual `chon-hs-dh-2` (13, 29, 53)
- Nguồn: tr.35 (kĩ năng B), tr.36 và tr.106 (2.26: "dùng dấu hiệu chia hết hoặc tra bảng")
- Vấn đề: quy tắc một chiều, nhưng mọi số không có dấu hiệu trong section đều là số nguyên tố; trẻ dễ rút ra "không chia hết cho 2, 3, 5 thì là số nguyên tố", sai với 49, 77, 91.
- Sửa: thêm ở màn cùng làm câu "Số không chia hết cho 2, 3, 5 thì tra bảng để biết."; thay 47 của `dh-nhieu` bằng 49 (đáp án thêm 49, hình gợi ý "49 = 7 · 7"). Màn mẫu tra bảng ở Nghiêm trọng 4 đã dùng 77, nên chọn 49 ở đây.

### 15. Ví dụ `gon-6-6-5` (câu 2.23) không có câu nào cho trẻ tự làm dạng đó (LL-16)

- Vị trí: `$.sections[7].blocks[2]` (visual `gon-6-6-5`); exercise của card `luy-thua`
- Nguồn: tr.36 (2.23)
- Vấn đề: section dạy mẫu "tách thừa số là hợp số rồi viết gọn" nhưng mọi câu chỉ viết gọn tích đã toàn số nguyên tố hoặc tính giá trị.
- Sửa: thêm câu `choice` cho card `luy-thua`: "Phân tích 4 · 9 ra thừa số nguyên tố" với `2^2 \cdot 3^2` (đúng), `4 \cdot 3^2`, `2 \cdot 3^2`, `2^2 \cdot 3`; `check` `4*9`.

### 16. "Hà có 72 viên bi" là câu chuyện không có việc gì (LL-16)

- Vị trí: `$.sections[7].blocks[1].children[0].text` (visual `gon-72`)
- Nguồn: —
- Vấn đề: viên bi không dẫn tới phân tích nào; ví dụ đời sống chỉ là tên gắn vào số.
- Sửa: "Hà xếp 72 viên bi vào 8 túi, mỗi túi 9 viên: 72 = 9 · 8 = 2 · 2 · 2 · 3 · 3. Số 2 lặp lại ba lần, số 3 lặp lại hai lần." (giữ quy ước m · k).

### 17. Hook mở bài nói 7 viên gạch "xếp cách nào cũng không được", trái cách đếm của bài (LL-10)

- Vị trí: `$.overview.hook.text`; liên quan `$.sections[1].blocks[0]` (caption `xep-11`: "chỉ có một cách")
- Nguồn: tr.37 câu 2.30a
- Vấn đề: hook đặt điều kiện riêng (ít nhất 2 hàng, mỗi hàng ít nhất 2 viên) nên kết luận "không xếp được", còn cả bài đếm "1 hàng" là một cách. Một việc hai cách đếm, trẻ nhớ hook sẽ trả lời 0 ở câu xếp gạch. (Nhóm 1 ghi Góp ý; Tổng hợp nâng vì hook mâu thuẫn trực tiếp caption `xep-11` và câu ôn.)
- Sửa: "Bạn xếp 7 viên gạch vuông thành hình chữ nhật. Chỉ xếp được một hàng dài 7 viên, vì 7 là số nguyên tố."

### 18. Màu slate của "số chẵn" tô cả nhãn "Số lẻ" (LL-05)

- Vị trí: visual `chan-le` (`catalog.ts`, tag "Số lẻ: không chia hết cho 2", `color: "slate"`), `le-le` (tag "Lẻ cộng lẻ là chẵn", slate); concept `so-nguyen-to.concept.so-chan` (slate); bàn giao `notebooks/backlogs/lesson-so-nguyen-to/task.md` mục "Giả định"
- Nguồn: —
- Vấn đề: hai khái niệm trái nhau mang một màu khái niệm, ngay trên màn định nghĩa. (Nhóm 3 ghi Góp ý; Tổng hợp nâng theo checklist trục 4 "một khái niệm, một màu".) Bàn giao còn ghi "Không dạy số chẵn, số lẻ như thuật ngữ mới", trái với bài và với mục "Thuật ngữ mới" của chính tệp đó.
- Sửa: tag "Số lẻ" bỏ màu khái niệm (chữ trung tính) hoặc dùng màu riêng không trùng concept nào; sửa dòng giả định trong `task.md`.

### 19. Lập luận "một số hạng phải là 2" nhảy qua bước "số nguyên tố khác 2 đều là số lẻ" (LL-16)

- Vị trí: `$.sections[10].blocks[0].children[0].text`, visual `le-le`
- Nguồn: tr.35 ví dụ 2 (đủ ba bước)
- Vấn đề: note đi thẳng từ "Tổng của hai số lẻ là số chẵn" tới "một số hạng phải là số 2"; trẻ thiếu mắt xích vì sao hai số nguyên tố là hai số lẻ.
- Sửa: thêm hàng đầu cho `le-le`: `3,\ 5,\ 7,\ 11` nhãn "Số nguyên tố khác 2: đều là số lẻ" (sky); hoặc một note thường trước group: "Số 2 là số nguyên tố chẵn duy nhất, nên các số nguyên tố khác đều là số lẻ." Giữ note quy tắc hai câu.

### 20. Câu ví dụ 25 dùng sai từ nối và thiếu kết luận (LL-10)

- Vị trí: `$.sections[10].blocks[1].children[0].text`
- Nguồn: tr.35
- Vấn đề: "Thử 25 = 2 + 23, vì 23 có trong bảng." đọc như lý do để thử; không nói 25 viết được. Câu 27 ngay sau thì có kết luận.
- Sửa: "Số 25 là số lẻ nên một số hạng phải là 2. Ta có 25 = 2 + 23, mà 23 có trong bảng, nên 25 viết được thành tổng của hai số nguyên tố." Câu 27: "…nên 27 không viết được thành tổng của hai số nguyên tố."

### 21. Quy tắc tổng chia hết của Bài 8 bị nói lại bằng câu khác (LL-05)

- Vị trí: `$.sections[12].blocks[0].children[0].text`, `$.sections[12].recap.caption`, `$.cards[12].recap.caption`
- Nguồn: —
- Vấn đề: Bài 8 dạy "Nếu các số hạng của một tổng đều chia hết cho một số thì tổng chia hết cho số đó."; bài này viết "Các số hạng cùng chia hết cho một số thì…". Một quy tắc hai cách nói giữa hai bài.
- Sửa: dùng nguyên văn câu Bài 8 (đã có trong câu sửa của Nghiêm trọng 8).

### 22. Hình `tong-hs-2` bỏ bước "tổng lớn hơn 5" mà quy tắc yêu cầu (LL-15)

- Vị trí: visual `tong-hs-2`, `$.sections[12].blocks[1]` và caption
- Nguồn: tr.107 (lời giải có bước "> 2")
- Vấn đề: hình đi từ `= 70 ⋮ 5` thẳng tới "Hợp số"; `tong-hs-1` ngay trước có hàng `> 2`. Bỏ bước này dạy rằng chỉ cần chia hết là đủ (sai với 5).
- Sửa: thêm hàng `70 > 5` trước "Hợp số"; caption: "Số hạng nào cũng chia hết cho 5, nên tổng chia hết cho 5. Tổng lớn hơn 5 nên là hợp số."

### 23. Câu luyện `tong-21` lặp hàng 2 + 19 = 21 của hình quy tắc và không luyện quy tắc (LL-07)

- Vị trí: `$.exercises[51]` (`tong-21`, `practiceIds` section 11, card `tong`)
- Nguồn: tr.37 (2.29)
- Vấn đề: hình `le-le` (quy tắc, recap) có hàng `2 + 19 = 21`; đề cho sẵn số 2 nên chỉ là 21 − 2.
- Sửa: "Hà chia 31 viên kẹo thành hai nhóm, số kẹo mỗi nhóm là số nguyên tố. Nhóm nhiều hơn có bao nhiêu viên?" → 29 (31 = 2 + 29 là cách duy nhất); `check.expr` "31-2".

### 24. Câu luyện `viet-40` chỉ là phép trừ, không luyện "thử rồi loại" (LL-16)

- Vị trí: `$.exercises[56]` (`viet-40`, `practiceIds` section 12)
- Nguồn: tr.37 (2.32b)
- Vấn đề: câu kiểm tra `viet-30` và câu luyện `viet-40` đều cho sẵn số thứ nhất; cả section không có câu nào bắt trẻ thử và loại như hình mẫu ("20 − 2 = 18 là hợp số: bỏ").
- Sửa: "Viết 40 thành tổng của hai số nguyên tố. Thử từ số nguyên tố nhỏ nhất. Số nguyên tố đầu tiên dùng được là số nào?" → 3 (40 − 2 = 38 hợp số, 40 − 3 = 37 số nguyên tố).

### 25. Câu luyện `hs-tong-nhieu` lặp số của hình ví dụ `tong-hs-1` (LL-07)

- Vị trí: `$.exercises[61].options` a, c (`hs-tong-nhieu`)
- Nguồn: tr.37 (2.31a)
- Vấn đề: hình mẫu là `3 · 4 · 5 + 6 · 7`; hai đáp án là hình mẫu bỏ một thừa số, trẻ chọn vì "giống hình mẫu".
- Sửa: a → `4 \cdot 9 + 8 \cdot 5` (76, hai số hạng chia hết cho 2); c → `6 \cdot 5 + 9 \cdot 7` (93, hai số hạng chia hết cho 3). Giữ b `2 \cdot 3 + 5` (11), d `10 + 3` (13).

### 26. Màn "tổng của ba số nguyên tố" nói mơ hồ và không có trong recap (LL-10)

- Vị trí: `$.sections[11].blocks[1].children[0].text`, `$.sections[11].recap`, `$.cards[11].recap`
- Nguồn: tr.37 (2.32a)
- Vấn đề: "Một số nguyên tố được dùng lại nhiều lần." đọc như bắt buộc phải lặp; ý này không có cách làm và không có trong recap card, nhưng câu ôn mức 3 (`viet-ba-17`, sẽ là `viet-ba-19`) hỏi về nó.
- Sửa: "Một số nguyên tố có thể được dùng nhiều lần, như 9 = 2 + 2 + 5." và thêm vào hình `viet-9-ba` dòng "9 − 2 = 7, rồi viết 7 = 2 + 5" (chọn một số nguyên tố trước, phần còn lại viết thành tổng hai số nguyên tố).

## Góp ý

### 1. Màn so sánh `so-sanh-nt-hs` không có câu nào

- Vị trí: `$.sections[2].blocks[1]` (không caption)
- Nguồn: —
- Vấn đề: trẻ phải tự hiểu 7 là số nguyên tố, 6 là hợp số.
- Sửa: caption "7 có hai ước nên là số nguyên tố. 6 có bốn ước nên là hợp số."

### 2. Màn chạm `chon-uoc-10` dạy cách tìm ước khác quy tắc vừa học (LL-05)

- Vị trí: `$.sections[0].blocks[2].children[0]` ("Thử chia 10 cho từng số…")
- Nguồn: —
- Vấn đề: quy tắc là viết thành tích hai số; dòng hướng dẫn lại bảo chia thử.
- Sửa: "Viết 10 thành tích của hai số theo mọi cách rồi chạm vào các thừa số."

### 3. Thứ tự thừa số trong tích kết luận không thống nhất (LL-05)

- Vị trí: `$.exercises[29].items` (`xep-cay-50`: "50 = 5 · 2 · 5"); hình `cay-12` (lá 3, 2, 2, tích 2 · 2 · 3)
- Nguồn: tr.35 (945 = 3³ · 5 · 7)
- Vấn đề: mọi hình ghi tích tăng dần, riêng `xep-cay-50` giữ thứ tự lá.
- Sửa: "50 = 2 · 5 · 5"; thêm vào note cây "Viết các thừa số từ nhỏ đến lớn."

### 4. Hình gợi ý chung `goi-y-cay-40` che đúng tầng mà `cay-thieu-45` cần (LL-02)

- Vị trí: `$.exercises[27].hints.hintVisualId`
- Nguồn: tr.36 (2.28)
- Vấn đề: ô ? của `cay-thieu-45` là 9 có hai con 3, 3; hình gợi ý lại để tầng cuối là "?". Vẫn làm được bằng 45 : 5.
- Sửa: hình gợi ý riêng với số khác đề, dừng ở "? = 2 · 2" (cây 20 = 5 · 4, 4 = 2 · 2).

### 5. Chú thích "Cột của 84" nói tắt (LL-05)

- Vị trí: `$.sections[6].blocks[1].caption`
- Nguồn: —
- Vấn đề: thuật ngữ trong glossary là "sơ đồ cột".
- Sửa: "Sơ đồ cột của 84: chia cho 2, 2, 3, 7. …"

### 6. `chia-bi-54` không luyện kĩ năng của card `cot`

- Vị trí: `$.exercises[33]` (`chia-bi-54`)
- Nguồn: —
- Vấn đề: chỉ là 54 : 2; phiên ôn card "sơ đồ cột" không kiểm việc chọn số chia hay đọc cột.
- Sửa: chuyển sang ô ? trong một cột nhỏ, hoặc "Trong sơ đồ cột của 54, số đứng dưới 54 là số nào?"

### 7. Câu quy tắc luỹ thừa nói khác Bài luỹ thừa (LL-05)

- Vị trí: `$.sections[7].blocks[0].children[0].text` ("Số lần lặp lại là số mũ.")
- Nguồn: —
- Vấn đề: Bài `luy-thua` chốt "số mũ là số thừa số"; không mâu thuẫn nhưng trẻ chậm phải tự nối.
- Sửa: "Số thừa số bằng nhau là số mũ." hoặc nhắc ở note `gon-72`.

### 8. Section dấu hiệu không có ví dụ cho dấu hiệu chia hết cho 2 trên màn (LL-16)

- Vị trí: `$.sections[4].blocks`
- Nguồn: tr.35 (dấu hiệu 2; 3; 5; 9)
- Vấn đề: quy tắc nêu 2, 3, 5 nhưng màn chỉ minh hoạ 5 và 3.
- Sửa: thêm một dòng vào caption hay màn cùng làm, vd "70 tận cùng là 0, chia hết cho 2".

### 9. Hình cây trong bài tập nhỏ so với màn iPad (LL-12)

- Vị trí: hình `tree` (`cay-thieu-28`, `cay-thieu-45`); ảnh `ipad/063-s6-04-exercise-cay-thieu-28.png`
- Nguồn: —
- Vấn đề: SVG cây rộng cố định theo px, trên iPad chỉ chiếm khoảng một phần ba bề ngang; số vẫn đọc được.
- Sửa: cho SVG giãn tới chiều rộng lớn hơn trên màn rộng.

### 10. Câu kiểm tra `le-le-tong` hỏi chưa rõ, trùng ý câu ôn `dien-le-le` (LL-10)

- Vị trí: `$.exercises[50].prompt[0]`, `$.exercises[54]`
- Nguồn: —
- Vấn đề: "Tổng của hai số lẻ là số nào?" mà lựa chọn là "Số chẵn"/"Số lẻ".
- Sửa: "Tổng của hai số lẻ là số chẵn hay số lẻ?"; câu ôn hỏi bằng ví dụ khác, như "17 + 9 là số chẵn hay số lẻ?".

### 11. `hs-tong-nhieu` nên có hình gợi ý cho lựa chọn chia hết cho 3 (LL-02)

- Vị trí: `$.exercises[61]`; hình `tong-hs-1`
- Nguồn: tr.37, tr.107 (2.31a)
- Vấn đề: hai hình mẫu chỉ xét số chia 2 và 5; trẻ thử 2 thấy không chia hết dễ kết luận "không phải hợp số". Section 13 không nhắc quy tắc tích của Bài 9.
- Sửa: thêm `hintVisualId` xét lần lượt chia hết cho 2, rồi cho 3, dừng ở "?"; nhãn amber của `tong-hs-1` đổi thành "Tích có thừa số 4: chia hết cho 2".

### 12. Tổng quan: "viên gạch xây nên mọi số" rộng hơn điều bài dạy

- Vị trí: `$.overview.whyItMatters`
- Nguồn: tr.35 mục A ý 3 (số lớn hơn 1)
- Vấn đề: 0 và 1 không viết được thành tích các số nguyên tố; câu ví von dễ làm trẻ nghĩ 1 cũng phân tích được, trong khi bài nhấn "số 1" ở nhiều chỗ.
- Sửa: "Số nguyên tố là viên gạch xây nên mọi số lớn hơn 1, …".

### 13. Vạch dọc của sơ đồ cột đứt quãng giữa các hàng

- Vị trí: `src/visuals/math/so-nguyen-to/column.tsx` (`border-r-4` trên từng `span` có `py-1`); ảnh `phone/081-s7-05-exercise-cot-thieu-150.png`
- Nguồn: tr.35, tr.36 (vạch liền một nét)
- Vấn đề: vạch gồm từng đoạn ngắn, có khe giữa các hàng; sách vẽ một vạch liền. Không sai, nhưng trẻ chép lên giấy theo hình.
- Sửa: vẽ vạch một lần trên cả `ul` (vd `border-r-4` trên cột số trái bọc chung), sửa cùng lúc với Nghiêm trọng 7.
