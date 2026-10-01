# Review: Số nguyên tố (`so-nguyen-to`)

- Bài: `content/math/kntt/so-nguyen-to/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: dem-uoc, so-nguyen-to, hop-so, bang-so-nguyen-to, dau-hieu-hop-so, phan-tich-cay, phan-tich-cot, viet-luy-thua, tim-chu-so-a, so-2, tong-hai-nguyen-to, viet-tong, tong-hop-so (cả 13 section đều có mục đổi)
- Nguồn đã đọc: `sources/math/so-nguyen-to/` - sbt-p35, sbt-p36, sbt-p37, sbt-p106, sbt-p107
- `content:check`: 0 lỗi, 1 cảnh báo của bài (99 id chưa khoá, đúng vì bài draft)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/so-nguyen-to/` (ảnh mới hơn `lesson.json` và mã hình; đã xem sheet từng section ở điện thoại, iPad dọc, iPad ngang)
- Kết luận: Đã xuất bản (0 lỗi Nghiêm trọng; đã chạy `pnpm content:hash so-nguyen-to --root content --approve`)
- Bản đã review: `8ba05addac880b845be68fca535822a94679360901681b53f12992e5a6d2aa5f` (`pnpm content:diff` so với bản này)

Đã soát: mọi mục trong diff (hook, khái niệm, 13 section, 13 card, 10 câu thêm, 10 câu bớt, 11 câu đổi chữ hay hình) và mã hình `catalog.ts`, `rects.tsx`, `prime-table.tsx`, test `so-nguyen-to.test.tsx` (18 test đạt). Tự giải và tính lại bằng python mọi câu đổi hay mới: `chon-nt-2-7` (đáp án 23, 29), `chon-hs-chan-bank` (64, 68), `chon-chan-hs` (16, 26, 34), `dh-nhieu` (27, 35; nhiễu 23, 37 đều là số nguyên tố), `tong-voi-2` (43, 13, 15; 11 − 2 = 9 là hợp số), `viet-28` (5; còn 11 + 17), `viet-40` (3), `tich-66` (11), `tinh-3-2-11` (99), `phan-tich-4-49` (196 = 2² · 7²; ba nhiễu đều sai), `cot-thieu-330` (3, ô `hide: [3]` là số chia của hàng 165), `cot-thieu-78` (39, ô `hide: [2]`), `xep-13-cach` (1), `xep-20` (ước 1, 2, 4, 5, 10, 20), `viet-74` (74 − 3 = 71), các `check`, `params`, `wants` của chips; mỗi câu đúng một đáp án hay một tập đáp án, không nhiễu nào thành đáp án đúng. Số mới (20, 11, 13, 28, 32, 37, 66, 74, 78, 99, 195, 330, 4 · 49, 55 + 30) không trùng đề, ví dụ, lời giải của tr.35–37, tr.106–107; số mới không trùng recap, ví dụ hay câu luyện cùng card (trừ mục Nên sửa 1).

Đã đối chiếu mọi lỗi Nghiêm trọng của hai vòng trước, đều sửa thật: định nghĩa viết lại bằng lời của bài; hình sàng và câu ngoài nguồn đã bỏ; mọi câu và màn bảo "tra bảng" có `bang-nt` trên màn (section 5 không bảo tra bảng); `bang-100` ghi "Số 1 không phải số nguyên tố, cũng không phải hợp số"; câu xếp gạch có "Xoay hình chữ nhật thì vẫn tính là một cách"; sơ đồ cột không còn dấu ✚ trước số chia (chỉ Legend); quy tắc tổng có "Nếu số đó lớn hơn 1", nhãn `le-le` không còn khái quát sai; hình `xep-20`, hook 11 viên, `viet-74`, ba sơ đồ cột `cot-195`, `cot-thieu-330`, `cot-thieu-78` không còn là số hay cột của sách; nhãn `xep-11` có "Lớn hơn 1"; `dh-nhieu` không còn 49 (note ngoại lệ kèm 77 = 7 · 11 và hình gợi ý `goi-y-xet-69` dừng ở "?").

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Màn chạm `chon-nt-bang` (section 4) trùng màn chạm `chon-nt-2-7` (section 2) vừa đổi (LL-07)

- Vị trí: `$.sections[3].blocks[2]` (visual `chon-nt-bang`: 21, 23, 27, 29, 33, 39; đáp án 23, 29) so với `$.sections[1].blocks[2]` (visual `chon-nt-2-7`: 21, 22, 23, 25, 27, 29; đáp án 23, 29)
- Nguồn: —
- Vấn đề: bản sửa đưa chips section 2 xuống số không quá 30, nên bốn trong sáu số và cả tập đáp án {23, 29} trùng màn "tra bảng rồi chạm" của section 4. Màn section 4 dạy tra bảng; trẻ chạm 23 và 29 theo trí nhớ từ section 2, không cần nhìn bảng. Số nhỏ cũng không cần bảng (cùng lý do mà section 2 đã đổi sang số nhỏ).
- Sửa: `chon-nt-bang` đổi sang số trên 30 mà trẻ cần bảng thật: `items` 33, 37, 39, 45, 49, 73 (`wants` [1, 5], tức 37 và 73); các số này chưa dùng làm đáp án ở section 4. Chụp lại, tự giải lại.

## Góp ý

### 1. Bảng `bang-100` trên iPad ngang nhỏ: chữ số khoảng 14,5px, dấu ✚ khoảng 5px (LL-12)

- Vị trí: `src/visuals/math/so-nguyen-to/prime-table.tsx` (`max-h-[32vh]`, `FONT = 18`, `MARK = 3`); ảnh `ipad-landscape/036-s4-01-block.png`
- Nguồn: —
- Vấn đề: giới hạn cao 32vh làm bảng vừa màn (hết lỗi che dòng số 1 và hàng 91–100), nhưng ở viewport 1180×820 lưới chỉ rộng khoảng 290px, chữ số còn 14,5px và dấu ✚ đường kính khoảng 5px; walk không đo chữ trong SVG nên không báo. Điện thoại 16,5px, iPad dọc lớn hơn.
- Sửa: tuỳ tác giả: nâng giới hạn lên khoảng 40vh (chữ khoảng 18px) nếu dòng "Số 1 …" vẫn còn trong màn; hoặc để nguyên và báo người làm app khi có nút "Bảng số nguyên tố" dùng chung.

### 2. `viet-28` có hai so sánh trong một câu hỏi và dùng lại số 28 của `cay-thieu-28` (LL-10)

- Vị trí: `$.exercises[56]` ("Nhóm ít bi hơn có thể có ít nhất bao nhiêu viên?")
- Nguồn: —
- Vấn đề: "ít hơn" ghép với "ít nhất" dễ đọc lệch (trẻ tìm 11 + 17 trước sẽ trả lời 11); câu dẫn "Thử từ số nguyên tố nhỏ nhất" đã giữ đáp án đúng 5. Số 28 còn là số của câu kiểm tra `cay-thieu-28` ở section 6.
- Sửa: "Một nhóm có thể có ít nhất bao nhiêu viên bi?" (đáp án vẫn 5, hai nhóm đối xứng); đổi 28 sang số chưa dùng trong bài có hai cách tách (tính lại `check`).

### 3. Caption `xet-65` đặt dấu hiệu chia hết cho 2 chỉ trong chữ xám, hình chỉ có hàng của 65 (LL-15)

- Vị trí: `$.sections[4].blocks[0].children[1].caption` ("Số tận cùng là 0, 2, 4, 6 hoặc 8 thì chia hết cho 2")
- Nguồn: tr.35 mục B (dấu hiệu chia hết cho 2, 3, 5, 9, kiến thức của Bài 9)
- Vấn đề: bản sửa thay câu về 80 bằng quy tắc chung của số 2, nhưng hình `xet-65` không có hàng nào cho dấu hiệu 2; trẻ chỉ gặp nó ở chữ xám. Không sai và đã học ở Bài 9, nên chỉ Góp ý.
- Sửa: thêm hàng `80 ⋮ 2` với nhãn "Tận cùng là 0" vào `xet-65` và `xet-65-xong`, rồi bỏ câu thứ hai của caption.

### 4. Màn `xet-51`: note ngoại lệ đứng trước, hình ví dụ 51 đứng sau không nối với nhau (LL-20)

- Vị trí: `$.sections[4].blocks[1]` (note "Số không chia hết cho 2, 3, 5 chưa chắc … 77 = 7 · 11", hình `xet-51`)
- Nguồn: —
- Vấn đề: trẻ đọc note về 77 rồi xem hình cộng các chữ số của 51, hình không nhắc tới note. Ý ngoại lệ đúng và đủ ở note, chỉ là thứ tự đọc.
- Sửa: tuỳ tác giả: mở note bằng một câu nối như "Cộng các chữ số của 51 được 6 nên 51 chia hết cho 3." rồi mới "Nhưng số không chia hết cho 2, 3, 5 chưa chắc là số nguyên tố: 77 = 7 · 11 vẫn là hợp số."
