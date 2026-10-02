# Review: Phép chia hết. Ước và bội của một số nguyên (`phep-chia-het-uoc-va-boi-cua-mot-so-nguyen`)
- Bản đã review: `f38d12f8d56e4463a922adc78cd305cbbc2d45002868cbe83555eb2fddd39391` (`pnpm content:diff` so với bản này)

- Bài: `content/math/kntt/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff`, so với bản `4ec8a78819`), section: `chia-cung-dau`, `chia-khac-dau` và video `dau-cua-thuong`; kết quả vòng 6 ở mục "Vòng 6" bên dưới, bản vòng 4 và 5 giữ ở các mục sau
- Nguồn đã đọc: `sources/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/` - sbt-p58, sbt-p59, sbt-p113
- `content:check`: 0 lỗi, 0 cảnh báo của bài (bản vòng 6, sau `--approve` và `content:lock`)
- Lịch sử: Vòng 1: 11 Nghiêm trọng; vòng 2: 6 Nghiêm trọng, 17 Nên sửa, 16 Góp ý; vòng 3: 0 Nghiêm trọng, 13 Nên sửa, 12 Góp ý; vòng 4: 0 Nghiêm trọng, 9 Nên sửa (5 đã sửa, 1 mới), 14 Góp ý (2 mới); vòng 5 (video, lời đọc): 0 Nghiêm trọng, 0 Nên sửa, 5 Góp ý; vòng 6: 0 Nghiêm trọng, 1 Nên sửa mới (cùng dấu, đọc hiểu mơ hồ), 1 Góp ý mới; Nên sửa 13 (khớp Bài 16) đã xử lý
- Đọc hiểu (Haiku): lượt 1 (bản trước vòng 2, quá nhiễu: 85 / 276 / 228, bỏ); lượt 2 toàn bài trên bản sau vòng 2: 235 / 3 / 0 (`doc-hieu-2.md`); lượt 3 trên 3 mục viết lại: 1 / 2 / 0 (`doc-hieu-3.md`); lượt 4 trên 8 mục viết lại: 6 / 2 / 0 (`doc-hieu-4.md`); hai mục còn mơ hồ (`goals[3]`, note thử `tim-x`) đã viết lại lần cuối, quá 3 lượt nên không đọc lại, ghi ở Nên sửa. Lượt đọc không phủ `options` và `hints`; vòng 6: lượt 5 trên câu cùng dấu mới (3 mục): 0 / 3 / 0 (`doc-hieu-5.md`), lượt 6 trên câu khác dấu mới (3 mục): 3 / 0 / 0 (`doc-hieu-6.md`); vòng 6 (đổi câu quy tắc): lượt 5 câu cùng dấu 0 / 3 / 0 mơ hồ (`doc-hieu-5.md`), lượt 6 câu khác dấu 3 / 0 / 0 (`doc-hieu-6.md`), lượt 7 và 8 thử thêm câu ví dụ 0 / 2 / 0 mỗi lần (`doc-hieu-7.md`, `doc-hieu-8.md`), câu ví dụ đã gỡ
- `lesson:walk`: 0 FAIL, 0 cảnh báo (bản vòng 6, chạy trên worktree tạm, cổng 3420; trước đó bản `0e8d510` cũng 0 FAIL); `visual:shot` 100/100; ảnh trong `.shots/walk/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/`
- Kết luận (vòng 6): 0 Nghiêm trọng; đã `--approve` và `content:lock` (0 id mới), `lesson:walk` 0 FAIL. Còn 1 Nên sửa mới (mục "Vòng 6", câu cùng dấu), không chặn duyệt. Kết luận vòng 4: Đạt: 0 Nghiêm trọng sau vòng 4; đã chạy `pnpm content:hash phep-chia-het-uoc-va-boi-cua-mot-so-nguyen --root content --approve` và `pnpm content:lock phep-chia-het-uoc-va-boi-cua-mot-so-nguyen`. Còn Nên sửa chưa xử lý: 2, 3, 7, 8, 9, 10, 11 (chiều ngược của quy tắc `tim-x`), 13 (khớp Bài 16 khi xuất bản)

Phạm vi vòng 3: mọi mục đổi so với bản `f87e1e3` (toàn bộ diff của `lesson.json` tới commit `3517f40`, và `catalog.ts`). Cây làm việc lúc review không còn sửa chưa commit. Đã so từng chuỗi chữ của `lesson.json` bằng script (hiện cả U+00A0), tự giải mọi exercise bị đổi, đọc ba trang nguồn và sheet walk các section `suy-ra-thuong`, `tim-uoc`, `tim-boi`, ảnh phone của năm hình đổi (`bon-phep-chia`, `boi-4-vi-du`, `boi-khoang-vi-du`, `tim-x-thu`, `uoc-vi-du`: chữ không cắt, không còn ±, công thức không vỡ).

Kiểm sáu Nghiêm trọng vòng 2: cả sáu đã xử lý.
1. `chon-thuong-nho-nhat` thay bằng `chon-thuong-7`, `explain` gọi theo nội dung: đạt.
2. Câu quy tắc bội, recap, card, cùng làm có "lần lượt ... và cứ thế tiếp", ba nơi lặp nguyên văn: đạt (hình còn thiếu "…", Nên sửa 4).
3. `ex.boi-7-lon-nhat-nho-hon-30` có "và cứ thế tiếp": đạt (câu cùng kiểu ở `chon-boi-7-khoang`, Nên sửa 5).
4. "±" nay có hàng nhìn thấy được "±3 là hai số 3 và −3" ở đầu hình `uoc-vi-du`, trước mọi chỗ dùng ±: đạt.
5. Số 21 của bài 3.36 đổi sang −55, `explain`, `tex`, `wrong` khớp, không trùng sách: đạt.
6. `wrong` và `explain` của `chon-tong-chia-het-9`, `chon-tong-6-chips`, cùng làm `chon-tong-4-cung-lam` không còn lấy "một số không chia hết" làm nguyên nhân: đạt; không còn câu nào kết luận tổng, hiệu từ số không chia hết.

NBSP: sau sửa, không còn phép tính nào trong chữ của `lesson.json` (note, prompt, option, segment, explain, wrong, caption, recap) có dấu cách thường quanh +, −, ·, :, =. Chỗ mới viết (`ex.chon-thuong-7`, `ex.dien-boi-3-nhan`, `ex.tinh-48-chia-8`, `ex.dien-uoc-x-15`, `wrong` của `ex.kiem-tra-42-chia-6`, `ex.chon-tong-chia-het-9`) đều giữ U+00A0 sau toán tử, cùng quy ước với `quy-tac-dau-ngoac`. Chữ trong `catalog.ts` (nhãn dòng, chip) vẫn dùng dấu cách thường; ảnh phone không thấy gãy.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu quy tắc và tên section `tim-x` vẫn đọc được hai cách, "số đó" mơ hồ hơn (LL-10, LL-20) [ĐÃ SỬA vòng 4: title, câu quy tắc, recap, card dùng x + 3 và "Số cộng thêm là số nào thì x là ước của số đó"; chỉ còn một cách đọc. Hình recap lệch số, xem Nên sửa 14]

- Vị trí: `$.sections[11].blocks[2].children[0].text`, `$.sections[11].recap.caption`, `$.cards[11].recap.caption`, `$.sections[11].title`
- Nguồn: lời giải 3.40 tr.113, `sbt-p113.png`
- Vấn đề: "Tổng của x và một số chia hết cho x khi x là ước của số đó." đọc được thành x + (một số chia hết cho x), luôn đúng. "Số đó" có thể trỏ "một số" đó, không phải số cộng thêm. Câu gợi ý của review vòng 2 cũng còn hai cách đọc; bản sửa chép gần nguyên nó nên lỗi ở lại. Tên section "Tìm số x để tổng của x và một số chia hết cho x" cùng kiểu.
- Sửa: dùng số cụ thể như các bài tập: "Tổng x + 3 chia hết cho x khi x là ước của 3. Cộng với số nào thì x là ước của số đó." (recap và card lặp nguyên văn). Tên section: "Tìm số x khi x + một số chia hết cho x".

### 2. Ví dụ mẹo "Kiểm tra phép chia" trùng câu luyện section trước và câu ôn cùng section (LL-07, LL-20)

- Vị trí: `$.sections[3].blocks[1].tex`; `$.exercises[14]` (`ex.tinh-khac-dau-48`); `$.exercises[21]` (`ex.tinh-48-chia-8`)
- Nguồn: —
- Vấn đề: bản sửa đổi (−72) : 8 (trùng hình `bon-phep-chia`) sang (−48) : 6 = −8, nhưng đó là cùng số và cùng thương của `ex.tinh-khac-dau-48` (48 : (−6) = −8) vừa làm ở section 3; `ex.tinh-48-chia-8` lại dùng 48 một lần nữa. Bé làm đúng nhờ nhớ −8.
- Sửa: ví dụ mẹo dùng số chưa có trong bài, vd (−60) : 5 = −12 và 5 · (−12) = −60; đổi `ex.tinh-48-chia-8` sang số khác 48.

### 3. Câu kiểm tra `chon-boi-cua-4` có hai đáp án đúng nằm ngay trên hình quy tắc (LL-07, LL-20)

- Vị trí: `$.exercises[36]` (`ex.chon-boi-cua-4`); hình `boi-4-vi-du` (`catalog.ts`)
- Nguồn: —
- Vấn đề: vòng 2 (Nên sửa 9) nêu −8 trùng hình; bản sửa đổi hai câu khác nhưng không đổi câu này, và hình mới thêm hàng 4 · 3 = 12, hàng −12, nên cả hai đáp án đúng −8 và 12 đều in trên màn ngay trước. Câu kiểm tra ngay sau quy tắc không còn kiểm gì.
- Sửa: đổi sang bội của 9 (vd −18 và 27 đúng; −12 và 20 sai), tính lại `explain`, `wrong`.

### 4. Hình quy tắc `boi-4-vi-du` không có "…", đọc như danh sách đóng (LL-17) [ĐÃ SỬA vòng 4: hai hàng đã có \ldots]

- Vị trí: hình `boi-4-vi-du` (`catalog.ts`; màn quy tắc `$.sections[6].blocks[1]` và recap `$.cards[6].recap`)
- Nguồn: lời giải 3.37 tr.113, `sbt-p113.png`
- Vấn đề: câu chữ đã có "cứ thế tiếp", nhưng hình chỉ liệt kê 4, 8, 12, −4, −8, −12, 0 (đã xem ảnh iPad và phone). Vòng 2 đã yêu cầu hàng `\ldots`; bản sửa thêm hàng 12 mà không thêm "…".
- Sửa: thêm `\ldots` vào hai hàng: "4, 8, 12, …" và "−4, −8, −12, …".

### 5. `explain` của `chon-boi-7-khoang` liệt kê bội như bắt đầu từ −14 (LL-17) [ĐÃ SỬA vòng 4: "0, ±7, ±14, ±21"; ± đã dạy ở hàng nhìn thấy được của `uoc-vi-du` (section tim-uoc) trước chỗ này]

- Vị trí: `$.exercises[41].explain.text` (`ex.chon-boi-7-khoang`)
- Nguồn: —
- Vấn đề: "Các bội của 7 là −14, −7, 0, 7, 14, 21 và cứ thế tiếp." Đây là nửa còn lại của Nghiêm trọng 3 vòng 2 (cách viết chốt là "0, ±7, ±14, ..."); danh sách mở một đầu, bé hiểu bội của 7 bắt đầu từ −14.
- Sửa: "Các bội của 7 là 0, ±7, ±14, ±21 và cứ thế tiếp." (cùng cách viết với `ex.xep-boi-6-khoang`).

### 6. `explain` của `dien-uoc-boi` có "Số chia hết cho 8" đọc thành "số chia" (LL-10, LL-25) [ĐÃ SỬA vòng 4: đã bỏ câu thứ hai]

- Vị trí: `$.exercises[25].explain.text` (`ex.dien-uoc-boi`)
- Nguồn: —
- Vấn đề: "Số chia 8 là ước, còn số bị chia −24 là bội. Số chia hết cho 8 thì là bội của 8." Ngay sau "Số chia 8", cụm "Số chia hết cho 8" đọc thành "số chia | hết cho 8", mà "số chia" là thuật ngữ của bài.
- Sửa: "Mọi số mà 8 là ước của nó đều là bội của 8." hay bỏ câu thứ hai.

### 7. Nấc 1 của hai câu điền mới chỉ tô dòng hướng dẫn (LL-02, LL-20)

- Vị trí: `$.exercises[65].hints.highlight` (`ex.dien-uoc-x-15`), `$.exercises[39].hints.highlight` (`ex.dien-boi-3-nhan`); cùng dạng: `$.exercises[25]`, `$.exercises[33]`
- Nguồn: —
- Vấn đề: vòng 2 (Nên sửa 5) bắt hai câu điền chuyển dữ kiện lên `prompt`. Hai câu viết lại ở vòng này lại để dữ kiện trong `segments`, `prompt` chỉ là "Chọn từ/số điền vào chỗ trống.", nên nấc 1 sáng đúng dòng hướng dẫn. Hai câu còn lại cùng dạng, chưa đổi.
- Sửa: đưa phần dữ kiện lên `prompt` (vd "Xét tổng x + 15 chia hết cho x. Chọn từ điền vào chỗ trống." với segment chỉ còn "x là … của 15"; "Tìm số nhân với 3 để được −18. Chọn số điền vào chỗ trống.") rồi tô khối đó.

### 8. Section `suy-ra-thuong` vẫn không có ví dụ đời sống (LL-16, tiếp Nên sửa 7 vòng 2)

- Vị trí: `$.sections[3].blocks[0]`
- Nguồn: —
- Vấn đề: ba section trước mở bằng tình huống, section này vào thẳng câu quy tắc; bản sửa không đụng tới.
- Sửa: note mở đầu dùng lại tình huống nợ: "Bốn bạn chia đều khoản nợ 20 nghìn: (−20) : 4 = −5. Chia đều 20 nghìn tiền thưởng thì 20 : 4 = 5. Đổi dấu số bị chia, thương đổi dấu."

### 9. Câu luyện `chon-tong-6-chips` còn cùng khuôn với hình quy tắc ngay trước (LL-07)

- Vị trí: hình `chon-tong-6`; so với `tong-hieu-vi-du`, `tong-no` (`catalog.ts`); `$.exercises[57]`
- Nguồn: —
- Vấn đề: chỉ đổi −12 thành −24; vẫn số chia 6, vẫn thừa số 18, vẫn hai chip đúng "(…) + 18" và "(…) − 18", giống hệt hai hàng của `tong-hieu-vi-du`.
- Sửa: đổi số chia và cả hai số (vd chia hết cho 7: (−21) + 14, (−21) − 14, nhiễu (−21) + 10, (−21) − 4), tính lại `explain`.

### 10. Chip nhiễu "5 · 5" và "7 · 7" không ứng lỗi nào (LL-14, tiếp Nên sửa 15 vòng 2)

- Vị trí: hình `chon-tich-35-cung-lam` (chip "5 · 5"; `$.sections[9].blocks[2]`), `chon-tich-14` (chip "7 · 7"; `$.exercises[52]`, `explain` nhắc "7 · 7 = 49")
- Nguồn: —
- Vấn đề: vòng 2 đề nghị nhiễu sai dấu; bản sửa thay "1 · 12" bằng "5 · 5" (25) và không đổi "7 · 7". Cả hai là tích sai giá trị hiển nhiên, bé loại ngay mà không nghĩ về dấu.
- Sửa: nhiễu sai dấu như "(−1) · 35" và "(−2) · 7"; tính lại `wants`, `done`, `explain` của `ex.chon-tich-14-chips`.

### 11. Màn `tim-x` còn hai trong ba chỗ thiếu bậc (LL-16, tiếp Nên sửa 14 vòng 2) [ĐÃ SỬA vòng 4 MỘT PHẦN vòng 4: note thử đã nêu "đều là ước của 3" và thêm x = −3; chiều ngược của quy tắc vẫn chưa lập luận, còn Nên sửa]

- Vị trí: `$.sections[11].blocks[0].children[0].text`; `$.sections[11].blocks[2].children[0].text`; hình `tim-x-vi-du`
- Nguồn: —
- Vấn đề: hàng x = −3 đã thêm vào `tim-x-thu`, nhưng note vẫn kể chỉ "x = 1, x = 3 và x = −1" và không nói điều cần thấy (các số làm được đều là ước của 3). Chiều ngược của quy tắc ("x là ước thì x + 3 chia hết cho x") vẫn chưa được lập luận, trong khi quy tắc và `explain` của `ex.chon-so-can-tim-7` dùng "khi" như hai chiều.
- Sửa: note thử: "Các số làm được là 1, 3, −1, −3, đều là ước của 3. Số 2 không là ước của 3 nên không làm được." Thêm vào note kế: "Ngược lại, x là ước của 3 thì x và 3 cùng chia hết cho x, nên x + 3 chia hết cho x."

### 12. `overview` bỏ mất ước chung, phân tích thành tích, tổng và hiệu (LL-20, LL-16) [ĐÃ SỬA vòng 4: summary thêm ước chung và thành tích hai số; còn thiếu tổng, hiệu, xem Góp ý 14]

- Vị trí: `$.overview.summary`, `$.overview.goals[2]`
- Nguồn: —
- Vấn đề: viết lại cho dễ đọc làm mất "ước chung" khỏi cả `summary` lẫn `goals`; từ vòng 2 đã thiếu phân tích thành tích. Bốn trong mười hai section (`uoc-chung`, `phan-tich-thanh-tich`, `tong-hieu-chia-het`, kể cả nửa đầu của `tim-x`) không có trong tổng quan, mà "ước chung" là kiến thức cần nhớ 2 của sách.
- Sửa: thêm vào `summary` một câu: "Bạn còn tìm ước chung của hai số, viết một số thành tích hai số nguyên, và dùng tổng, hiệu cùng chia hết." Giữ câu ngắn như bản đã qua đọc hiểu.

### 14. Hình recap `tim-x-vi-du` là x + 6, caption và quy tắc mới nói x + 3 (LL-20, LL-16) [MỚI vòng 4]

- Vị trí: hình `tim-x-vi-du` (`catalog.ts`, nhãn "Với x + 6 chia hết cho x, x là một ước của 6", hàng `x = ±1, ±2, ±3, ±6`); `$.sections[11].blocks[2]`, `$.sections[11].recap`, `$.cards[11].recap`
- Nguồn: —
- Vấn đề: câu quy tắc, recap và card nay viết "Tổng x + 3 chia hết cho x khi x là ước của 3", nhưng hình đi kèm cả ba chỗ dạy x + 6 và ước của 6. Bé nhìn câu nói 3, hình nói 6, phải tự suy ra "số cộng thêm" là gì; hình không còn minh hoạ đúng câu. Cả hai đều đúng kiến thức, nên không chặn.
- Sửa: đổi hình sang x + 3 (đổi nhãn và hàng thành x + 3, x = ±1, ±3; hàng này trùng `tim-x-3`, chấp nhận vì là hình ôn quy tắc), hoặc giữ x + 6 và đổi câu quy tắc, recap, card sang x + 6 và ước của 6 (ba nơi cùng chữ).

### 13. Khớp Bài 16 (`phep-nhan-so-nguyen`, chỉ đọc) [ĐÃ XỬ LÝ vòng 6: câu cùng dấu bỏ "nguyên" và "cho nhau", câu khác dấu bỏ "nguyên"; còn một hệ quả về độ dễ đọc ở Nên sửa 1 của mục "Vòng 6"]

- Vị trí: `$.sections[1].blocks[1].children[0].text` (+ recap, card), `$.sections[2].blocks[1].children[0].text` (+ recap, card), hình `cung-dau-vi-du`, `khac-dau-vi-du`
- Nguồn: —
- Vấn đề: câu khác dấu cùng mẫu với Bài 16: "Hai số khác dấu thì tích là số âm: nhân hai phần số tự nhiên rồi viết dấu − ở trước." so với "Hai số nguyên khác 0 khác dấu thì thương là số âm: chia hai phần số tự nhiên rồi viết dấu − ở trước." Chỉ lệch "khác 0" (bài này thêm vì chia cho 0 không được, hợp lý). Câu cùng dấu: Bài 16 "Hai số âm nhân với nhau thì tích là số dương: nhân hai phần số tự nhiên." và "Hai số khác 0 cùng dấu thì tích dương, khác dấu thì tích âm."; bài này "Hai số nguyên khác 0 cùng dấu thì thương là số dương: chia hai phần số tự nhiên cho nhau." Lệch: "số nguyên" thừa trong khi Bài 16 chỉ nói "số", và đuôi "cho nhau" không có ở Bài 16. Màu khớp: số dương lime, số âm pink ở cả hai bài.
- Sửa: khi Bài 16 xuất bản, bỏ "nguyên" và "cho nhau" ở câu cùng dấu để cùng mẫu "Hai số khác 0 cùng dấu thì thương là số dương: chia hai phần số tự nhiên."; giữ khuôn khác dấu như hiện tại.

## Góp ý

### 1. Mẹo "Kiểm tra phép chia" vẫn viết "Nhân thương với số chia" mà phép nhân viết số chia trước (LL-05; Góp ý 1 vòng 2, chưa sửa)

- Vị trí: `$.sections[3].blocks[1].text`, `.tex`
- Nguồn: —
- Vấn đề: `tex` `6 · (−8)`, số chia đứng trước.
- Sửa: "Nhân số chia với thương."

### 2. Đề `chia-no-ba-ban` báo trước thương âm (LL-02; chưa sửa)

- Vị trí: `$.exercises[12].prompt[0]`
- Nguồn: —
- Vấn đề: "viết bằng số âm?".
- Sửa: "Mỗi bạn thay đổi bao nhiêu nghìn? Viết bằng số nguyên."

### 3. Nhiễu (−7) : 2 của `chon-chia-het` thiếu `wrong` (chưa sửa)

- Vị trí: `$.exercises[1].explain.wrong`
- Nguồn: —
- Vấn đề: bé dễ nghĩ ra −3.
- Sửa: "Không có số nguyên nào nhân với 2 để được −7."

### 4. Số lặp: câu ôn trùng ví dụ của hình gợi ý, số 35 xuất hiện ở bốn chỗ (LL-07)

- Vị trí: `$.exercises[22]` (`ex.chon-thuong-am9`, đúng ví dụ (−36) : 4 của hình `goi-y-khac-dau`); `$.exercises[8]`, `$.exercises[23]`, hình `khac-dau-vi-du`, `chon-tich-35-cung-lam` (cùng bộ 35, 5, 7); mẹo `$.sections[4].blocks[2].tex` ((−45) chia hết cho 9) so với chip (−45) : 9 của `chon-thuong-am5-cung-lam`
- Nguồn: —
- Vấn đề: số chéo section làm bé nhớ đáp số thay vì tính; hai câu (`tinh-bon-phep`, `chon-thuong-am9`) vẫn cùng đáp số −9.
- Sửa: đổi `chon-thuong-am9` sang số không có ở hình gợi ý (vd 45 : 5 = 9 suy ra 4 phép −9), và một trong các nơi dùng 35.

### 5. Nhãn hình nấc 2 nói "chia trước, dấu sau", ngược câu quy tắc (LL-05; chưa sửa)

- Vị trí: `catalog.ts` mục `goi-y-cung-dau`, `goi-y-khac-dau` (label)
- Nguồn: —
- Vấn đề: câu quy tắc đã xét dấu trước.
- Sửa: "Chia hai số cùng dấu: thương là số dương, rồi chia hai phần số tự nhiên"; tương tự khác dấu.

### 6. Câu quy tắc `suy-ra-thuong` chưa nói "hai số" là số nào (LL-10; chưa sửa)

- Vị trí: `$.sections[3].blocks[0].children[0].text`, recap, card
- Nguồn: —
- Vấn đề: ở card ôn, câu đứng riêng không có phép chia đi kèm.
- Sửa: "Trong một phép chia, đổi dấu số bị chia hoặc số chia thì thương đổi dấu. Đổi dấu cả hai số thì thương giữ nguyên." (recap lặp nguyên văn).

### 7. Câu thứ hai trong khung quy tắc `tong-hieu-chia-het` không có trong recap (LL-06; chưa sửa)

- Vị trí: `$.sections[10].blocks[1].children[0].text` so với `$.sections[10].recap.caption`, `$.cards[10].recap.caption`
- Nguồn: —
- Vấn đề: "Với số nguyên, số bị trừ nhỏ hơn số trừ vẫn trừ được." là lời nhắc nhưng nằm trong khung quy tắc.
- Sửa: chuyển sang nhãn hình `tong-hieu-vi-du` hay note mở đầu.

### 8. Cùng làm `chon-tong-4-cung-lam` không còn dẫn bé tới quy tắc của section

- Vị trí: `$.sections[10].blocks[2].children[0].text`
- Nguồn: —
- Vấn đề: "Tính từng kết quả rồi kiểm tra." sửa đúng lỗi vòng 2 nhưng bỏ chiều dùng quy tắc "hai số cùng chia hết".
- Sửa: "Tính từng kết quả, hoặc xem hai số trong phép tính có cùng chia hết cho 4 không."

### 9. Hình quy tắc `boi-khoang-vi-du` chưa hiện "bội của 3" và số bị loại (LL-15; xử lý một phần Nên sửa 8 vòng 2)

- Vị trí: hình `boi-khoang-vi-du` (`catalog.ts`)
- Nguồn: —
- Vấn đề: khoảng −10 < x < 10 đã nhìn thấy được, nhưng "của 3" chỉ ở `label` (không hiện) và hình không có hàng "12, −12 bị bỏ vì ngoài khoảng".
- Sửa: hàng đầu "Bội của 3, −10 < x < 10"; thêm hàng "12, −12: ngoài khoảng".

### 10. Còn giữ khung câu và chuỗi bước của sách ở ba chỗ (LL-08; chưa sửa, tuỳ tác giả)

- Vị trí: `$.sections[11].blocks[1].children[0].text` và hình `tim-x-3`; `$.sections[10].blocks[1].children[0].text`; `$.sections[9].blocks[1].children[0].text`
- Nguồn: lời giải 3.40 tr.113, đề 3.40 và ví dụ 2 tr.59
- Vấn đề: hàng `3 = (x + 3) − x` và câu "Số x khác 0 luôn chia hết cho chính nó" đi đúng chuỗi lời giải 3.40.
- Sửa: tuỳ tác giả.

### 11. Câu kho ôn `noi-tich-gia-tri` chỉ ôn dấu của tích; `dien-uoc-chung` gần số hình recap (chưa sửa)

- Vị trí: `$.exercises[53]`, `$.exercises[49]`
- Nguồn: —
- Vấn đề: `noi-tich-gia-tri` là việc của Bài 16; `dien-uoc-chung` (−3 với 9 và −15) gần ±3 của `uoc-chung-vi-du`.
- Sửa: tuỳ tác giả, vd nối 12, −12 với một cách viết thành tích; đổi sang −4 với 16 và −20.

### 12. Câu ước chung khác lời Bài 11 (LL-05; chưa sửa)

- Vị trí: `$.sections[8].blocks[1].children[0].text`, `$.sections[8].blocks[2].children[0].text`
- Nguồn: tr.58 kiến thức cần nhớ 2, `sbt-p58.png`
- Vấn đề: Bài 11 (đã xuất bản): "Một số là ước của tất cả các số đã cho thì gọi là ước chung của các số đó."; cùng làm "Thử từng số với cả hai số" còn hình đi theo hai danh sách.
- Sửa: dùng lại câu của Bài 11; gợi ý cùng làm theo cách hai danh sách.

### 13. Note thử `tim-x` có dấu hai chấm rồi viết hoa (LL-05) [MỚI vòng 4]

- Vị trí: `$.sections[11].blocks[0].children[0].text`
- Nguồn: —
- Vấn đề: "Thử vài số x với x + 3: Các số làm được là ..." viết hoa sau dấu hai chấm; nên là hai câu riêng.
- Sửa: gộp thành hai câu: "Thử vài số x với x + 3: các số làm được là 1, 3, −1 và −3, đều là ước của 3, còn số 2 thì không." (viết thường "các", giữ NBSP sau "+").

### 14. `overview` còn thiếu tổng và hiệu cùng chia hết (LL-20) [MỚI vòng 4, phần còn lại của Nên sửa 12]

- Vị trí: `$.overview.summary`, `$.overview.goals`
- Nguồn: —
- Vấn đề: summary đã có ước chung và thành tích hai số, chưa nhắc "tổng, hiệu" và `tim-x`; `goals` chưa đổi.
- Sửa: tuỳ tác giả, thêm một mục `goals` về tổng, hiệu cùng chia hết.

## Báo nhầm

Không có.

## Vòng 6: chỉ đổi chữ quy tắc dấu của thương

Phạm vi: `pnpm content:diff` (4 mục chữ: note `rule: true` của `chia-cung-dau` và `chia-khac-dau`, hai recap section, hai recap card; video `dau-cua-thuong`: `durationSec` và hai clip). Đã đọc hai section đầy đủ, `script.json`, `index.html` (hai thẻ `data-rule-text`), `.vtt` trong `public/media/video/...`, `renders/report.json`, hai contact sheet khung hình (`sheet2-01.png`, `sheet2-02.png`), `doc-hieu-5.md`, `doc-hieu-6.md`, và các câu quy tắc của Bài 16 `phep-nhan-so-nguyen` (chỉ đọc). `pnpm video:check`: ok cả ba video của bài (`dau-cua-thuong`: rule text on screen 2). `content:check`: chỉ còn lỗi `review-hash` của bài (lesson đổi sau review, đúng với vòng này).

Đã kiểm, đạt:
- Toán không đổi: mọi ví dụ, số, màu (số dương lime, số âm pink) giữ nguyên; "số nguyên" bỏ khỏi câu quy tắc vẫn đúng vì cả bài là số nguyên.
- Note, recap section và recap card của cả hai section giống nhau từng ký tự (script so sánh); hai câu `rule` của `script.json` và hai thẻ `data-rule-text` trong `index.html` khớp từng chữ với note.
- Grep `lesson.json` và `src/visuals/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/`: không còn "cho nhau" ở câu quy tắc, không còn "số nguyên khác 0 cùng/khác dấu" (hai chỗ "số nguyên khác 0" còn lại là quy tắc ước và bội, đúng). Không có `tips.json`. Hình `cung-dau-vi-du`, `khac-dau-vi-du`, `goi-y-cung-dau`, `goi-y-khac-dau`, ba câu "Cùng làm" và `explain` của hai section không nhắc câu cũ và không mâu thuẫn câu mới.
- Khớp Bài 16: câu khác dấu giống Bài 16 trừ "khác 0" (cần vì không chia cho 0). Bài 16 không có câu cùng dấu kèm "chia hai phần số tự nhiên" ở dạng "Hai số khác 0 cùng dấu": câu có vế hành động là "Hai số âm nhân với nhau thì tích là số dương: nhân hai phần số tự nhiên." (chủ ngữ có "với nhau"); câu "Hai số khác 0 cùng dấu thì tích dương, khác dấu thì tích âm." không có vế hành động. Màu lime và pink khớp ở cả hai bài.
- Video: lời đọc khớp chữ trên màn (Whisper nghe "khác không" cho "khác 0", "viết dấu trừ" cho "−", cả hai câu rule 100%, đúng với `say`). Phụ đề `.vtt` cắt câu theo ý ("...thì thương là số dương: / chia hai phần số tự nhiên."), cue karaoke khớp thời gian. Thẻ quy tắc hai dòng, vừa khung, không bị cắt, không đè cú; chữ "số dương" lime, "số âm" pink (khung f-008, f-009, f-017 đến f-019). Quãng dừng: sau câu hỏi 1,0 giây, sau hai câu rule 0,81 và 0,85 giây, hình giữ nguyên trong quãng dừng. Clip: `chia-cung-dau` 0,7 đến 20,515 bao cue 1,0 đến 20,402; `chia-khac-dau` 20,915 đến 40,31 bao cue 21,215 đến 40,159; `durationSec` 46,87 khớp mp4 (46,867 giây); cả hai clip vẫn gắn đúng card cùng tên.

### Nghiêm trọng

Không có.

### Nên sửa

#### 1. Câu cùng dấu mới đọc mơ hồ ở cả ba chỗ bé thấy chữ và trong lời video (LL-25, LL-20) [CÒN LẠI sau 3 lượt đọc hiểu: giữ câu theo Bài 16, chờ quyết định của chủ dự án]

- Vị trí: `$.sections[1].blocks[2].children[0].text`, `$.sections[1].recap.caption`, `$.cards[1].recap.caption` (`chia-cung-dau`); lặp ở `video/projects/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/dau-cua-thuong/script.json` (câu `rule` đầu) và `index.html` (`#rule1`)
- Nguồn: —
- Vấn đề: Haiku (`doc-hieu-5.md`): cả 3 mục Hiểu mơ hồ, "chia hai phần số tự nhiên" chưa rõ; bản cũ có đuôi "cho nhau" từng Hiểu rõ, và câu khác dấu mới (có "rồi viết dấu − ở trước" nối tiếp) Hiểu rõ cả 3 (`doc-hieu-6.md`). Nguyên nhân: "phần số tự nhiên" là thuật ngữ học ở Bài 15 (glossary `phần số tự nhiên`), bài này không nhắc lại và không có ví dụ nào gắn thuật ngữ với 12 và 3 trước câu quy tắc (chỉ hình gợi ý `goi-y-cung-dau`, hiện sau khi bé sai, mới có hàng "= 40 : 5"); câu kết thúc ngay sau cụm đó nên "hai phần" không có vật để trỏ. Bài 16 dạy cùng thuật ngữ bằng "Ví dụ mẫu" ngay trước câu quy tắc. Mức: theo bảng LL-25 "mơ hồ" là Góp ý, nhưng đây là bản sửa làm câu đang rõ thành mơ hồ (LL-20), lặp ở note, recap, card và video, và thuật ngữ này đã gây mơ hồ ở Bài 15 và Bài 16, nên tôi chọn Nên sửa; không chặn duyệt vì kiến thức đúng và chủ dự án chỉ định câu này.
- Đã thử: thêm một câu ví dụ vào note nhiệt độ, hai bản ("Phần số tự nhiên của −12 và −3 là 12 và 3, và 12 : 3 = 4." rồi "Bỏ dấu của −12 và −3, ta được hai phần số tự nhiên là 12 và 3, và 12 : 3 = 4."). Haiku đọc lại (`doc-hieu-7.md`, `doc-hieu-8.md`): câu quy tắc vẫn Hiểu mơ hồ, câu ví dụ cũng bị gắn Hiểu mơ hồ. Đã gỡ câu ví dụ; chữ của bài trở lại đúng phần diff vòng 6. Quá 3 lượt nên ghi lại, không chặn duyệt. Lựa chọn còn lại cho chủ dự án: giữ câu khớp Bài 16 như hiện tại, hoặc quay về đuôi "cho nhau" (phải đọc lại một câu và dựng lại video `dau-cua-thuong`).
- Sửa đề xuất ban đầu của reviewer (giữ nguyên câu theo Bài 16, không phải dựng lại video): thêm ví dụ gắn thuật ngữ vào note ngay trước, `$.sections[1].blocks[1].children[0].text`: "Mỗi giờ nhiệt độ giảm 3 độ, tức thay đổi −3 độ. Muốn thay đổi tổng cộng −12 độ, cần (−12) : (−3) = 4 giờ. Phần số tự nhiên của −12 và −3 là 12 và 3, và 12 : 3 = 4." (giữ U+00A0 quanh toán tử, chạy lại đọc hiểu cho note này và câu quy tắc). Hoặc thêm vào hình `cung-dau-vi-du` mỗi hàng đuôi "= 15 : 5 = 3" như hình gợi ý. Nếu sau lượt đọc lại câu quy tắc vẫn mơ hồ, phương án dự phòng cần dựng lại video: "Hai số khác 0 cùng dấu chia cho nhau thì thương là số dương: chia hai phần số tự nhiên." (đuôi "chia cho nhau" đã có ở `explain` của `ex.chon-thuong-duong`, cùng cấu trúc "với nhau" của câu Bài 16 "Hai số âm nhân với nhau thì tích là số dương: nhân hai phần số tự nhiên."); phương án này lệch Bài 16 thêm "khác 0" và "cùng dấu".

### Góp ý

#### 1. `explain` của hai câu kiểm tra còn nói "chia cho nhau", quy tắc không còn (LL-05)

- Vị trí: `$.exercises[7].explain.text` (`ex.chon-thuong-duong`), `$.exercises[13].explain.text` (`ex.chon-thuong-am`)
- Nguồn: —
- Vấn đề: "Hai số cùng dấu chia cho nhau thì được thương dương." và "Hai số khác dấu chia cho nhau thì được thương âm." là quy tắc nói bằng cách khác với câu quy tắc mới; chữ này hợp lý (đã Hiểu rõ ở lượt trước) và `explain` chỉ hiện sau khi làm, nên chỉ ghi để tác giả cân nhắc nếu chọn lại "cho nhau" cho câu quy tắc.
- Sửa: nếu câu quy tắc giữ như hiện tại, đổi hai câu này thành "Hai số khác 0 cùng dấu thì thương là số dương." và "Hai số khác 0 khác dấu thì thương là số âm."; nếu câu quy tắc quay lại "chia cho nhau", giữ nguyên.

### Kết quả vòng 6

0 Nghiêm trọng, 1 Nên sửa, 1 Góp ý. Mục 13 cũ (khớp Bài 16) đã xử lý. Không có Nghiêm trọng nên không cập nhật `docs/lessons-learned/` (LL-25 và LL-20 chỉ tính theo bảng của lượt 1 và Nghiêm trọng). Bản đã review để điều phối cập nhật sau lệnh cuối vòng.

## Vòng 4: kết quả

Đã soát từng mục của `content:diff` (`overview.summary`, section `tim-x`: title, note thử, câu quy tắc, recap, card; `ex.dien-uoc-boi`, `ex.chon-boi-7-khoang`) và hình `boi-4-vi-du`. 0 Nghiêm trọng.
- Kiến thức đúng: x + 3 chia hết cho x khi x là ước của 3 (x khác 0), kể cả x = −3 (0 chia hết cho −3). "Số cộng thêm là số nào thì x là ước của số đó": "số đó" chỉ trỏ tới số cộng thêm, một cách đọc; khớp `ex.chon-so-can-tim-7`, `ex.dien-uoc-x-15`, `ex.dem-x-4`, `ex.chon-x-12`, `chon-x-8-cung-lam` (cùng tên section, cùng cách nói "x là ước của số cộng thêm").
- Recap và card lặp nguyên văn với note quy tắc: đạt (so từng ký tự, kể cả U+00A0 sau "+").
- NBSP quanh toán tử ở title, note thử, note quy tắc, recap, card: đạt. Note thử 2 câu (có dấu hai chấm viết hoa, Góp ý 13).
- Hình `tim-x-thu` (nhãn "1, 2, 3, −1 và −3") khớp note thử mới: đạt. Hình `tim-x-vi-du` lệch số, Nên sửa 14.
- Hình `boi-4-vi-du`: đã có `\ldots` ở hai hàng, khớp "cứ thế tiếp" trong câu quy tắc. Ảnh chụp lại (`.shots/recheck/`) chưa có khi review nên chưa xem được độ tràn chữ; hàng thêm ngắn (`, …` khoảng hai ký tự), rủi ro thấp, điều phối xem khi chụp.
- "±" trong `ex.chon-boi-7-khoang`: đã dạy bằng hàng nhìn thấy được ở `uoc-vi-du` (section tim-uoc, đứng trước tim-boi và boi-trong-khoang): đạt.
- Mục Nên sửa còn tồn của vòng 3 (2, 3, 7, 8, 9, 10, 11 một phần, 13) giữ nguyên mức Nên sửa, không xét lại.

## Vòng 3 và vòng 2: lịch sử

Mục "Vòng 3" ở trên và các mục sau giữ nguyên từ vòng 3 (Nghiêm trọng, Nên sửa, Góp ý phía trên đã đánh dấu tình trạng vòng 4).

## Vòng 2: đã sửa

Sáu Nghiêm trọng đã đạt (xem đầu tệp). Nên sửa vòng 2 đã đạt: 1 (nhãn `bon-phep-chia`), 2 (hai câu kho ôn `suy-ra-thuong`), 3 (mẹo thêm "dùng cho phép chia hết"), 4 (`kiem-tra-42-chia-6` hỏi cả lý do), 5 (hai câu điền, riêng `ex.dien-uoc-x-15` lặp lỗi, Nên sửa 7), 10 (`dien-boi-3` thành `dien-boi-3-nhan` đúng card), 11 (mẹo bỏ dấu đổi số), 12 (`dem-uoc-cua-16`), 17 (NBSP), cùng các Góp ý 7, 10, 12, 15; Nên sửa 6, 9, 13, 14, 15, 16 và Góp ý 13 xử lý một phần hay chưa, tính lại ở danh sách trên.

## Vòng 5: video và lời đọc

Phạm vi: diff chỉ thêm `videos[]`, khối video đầu ba section (`chia-cung-dau`, `phep-chia-het`, `tim-uoc`) và `overview.narration`. Đã đọc ba `script.json`, ba `.vtt`, `renders/report.json`, sheet khung hình (hai sheet mỗi video), `index.html` của `dau-cua-thuong`, `overview.vtt` và `overview.*`. `pnpm video:check` ok cho cả ba video và lời đọc. Kết luận: 0 Nghiêm trọng.

### Nghiêm trọng

Không có.
- Toán đúng: (−12) : (−3) = 4; (−20) : 4 = −5; −12 = 3 · (−4); 18 = (−6) · (−3) nên 18 chia hết cho −6; 6 = (−1)(−6) = (−2)(−3); ước dương 1, 2, 3, 6; ước âm −1, −2, −3, −6; 6 có 8 ước.
- Ba câu `rule` khớp note của bài (build đã so nguyên văn); câu "số chia phải khác 0" khớp note "Ta không chia được cho số 0".
- Số âm đọc "âm" (report Whisper nghe "âm 12", "âm 3", "âm 6"); câu "Vậy số 6 có tất cả 8 ước." khớp 100%.
- Màu đúng bài: dấu của thương dùng lime cho số dương và pink cho số âm; `chia-het-so-nguyen` dùng blue cho số bị chia, violet cho số chia, amber cho thương; `uoc-cua-6` dùng violet cho ước, teal cho nhãn bước.
- Hỏi rồi mới mở: cả ba video có câu `ask` trước đáp án; mọi câu quy tắc (trừ câu cuối) có `think`. Hình giữ nguyên trong quãng lặng. Dải dưới trống cho phụ đề, chữ không bị cắt. Câu mở đầu có "bạn". Chữ gọi "Bạn cú" không xuất hiện trong lời video.
- Clip đúng card: `chia-cung-dau` (0,7–21,1 s) và `chia-khac-dau` (21,5–41,6 s) đúng hai card cùng tên; `phep-chia-het` và `tim-uoc` phủ cả video và đúng card.
- Lời đọc giới thiệu: câu chào "Chào bạn!", hook, summary, goals, whyItMatters khớp chữ trên màn; giọng Hải Đăng khớp `media.json` (dự phòng khi hết hạn mức Gemini, đúng một engine từ đầu đến cuối).

### Nên sửa

Không có.

### Góp ý

1. `video/projects/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/dau-cua-thuong/script.json`, cảnh `s02-no`: video đặt ở đầu section `chia-cung-dau` nhưng cũng giảng luôn quy tắc khác dấu, nên bé nghe quy tắc đó trước khi tới section `chia-khac-dau`. Không sai kiến thức và clip `chia-khac-dau` gắn đúng card; chỉ lệch ranh giới "một video một ý của phần". Cách sửa (nếu chủ dự án muốn): tách thành hai video, mỗi video một section; không cần làm ngay.
2. `uoc-cua-6`, cảnh `s02-so-doi`, câu "Vậy số 6 có tất cả 8 ước.": hình chỉ có 8 ô ước, không hiện số 8 hay nhãn đếm. Bé phải tự đếm. Cách sửa: thêm một nhãn "8 ước" hiện đúng lúc nói câu đó.
3. `uoc-cua-6`: thẻ quy tắc ở cảnh `s02-so-doi` (một dòng, chữ nhỏ) khác thẻ ở cảnh `s03-nho` (hai dòng, chữ lớn hơn). Cách sửa: dùng cùng cỡ chữ cho hai thẻ.
4. `chia-het-so-nguyen`, câu cuối "Bạn nhớ nhé: số chia phải khác 0.": Whisper nghe "số chưa phải khác không" (khớp 97,1%, ngưỡng 97%). Có thể do Whisper nhầm "chia" thành "chưa"; nên nghe lại một lần khi duyệt tay. Câu cùng tên "số chia" ở các câu trước vẫn nghe đúng.
5. `overview.summary` và `overview.goals` chưa nhắc tổng, hiệu cùng chia hết (đã ghi ở Nên sửa 14 của vòng 4); lời đọc đọc đúng chữ trên màn nên lỗi này kéo theo, không thêm lỗi mới.
