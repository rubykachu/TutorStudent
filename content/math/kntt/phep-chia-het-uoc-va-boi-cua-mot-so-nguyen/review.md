# Review: Phép chia hết. Ước và bội của một số nguyên (`phep-chia-het-uoc-va-boi-cua-mot-so-nguyen`)

- Bài: `content/math/kntt/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/lesson.json`
- Vòng: 8 - phần bài tập sách bài tập (section cuối): vòng 6 toàn bộ phần mới (Opus), vòng 7 và 8 chỉ phần đổi (Sonnet), ghi ở ba mục cuối tệp; 12 section đầu giữ kết quả vòng 4 (commit `39503de` so với `3517f40`) và vòng 5 (video, lời đọc)
- Nguồn đã đọc: `sources/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/` - sbt-p58, sbt-p59, sbt-p113
- `content:check`: 0 lỗi, 0 cảnh báo của bài (sau `--approve` và `content:lock`, 128 id)
- Lịch sử: Vòng 1: 11 Nghiêm trọng; vòng 2: 6 Nghiêm trọng, 17 Nên sửa, 16 Góp ý; vòng 3: 0 Nghiêm trọng, 13 Nên sửa, 12 Góp ý; vòng 4: 0 Nghiêm trọng, 9 Nên sửa (5 đã sửa, 1 mới), 14 Góp ý (2 mới); phần bài tập sách bài tập: vòng 6: 1 Nghiêm trọng, 4 Nên sửa, 7 Góp ý; vòng 7: 0 Nghiêm trọng, 1 Nên sửa, 5 Góp ý; vòng 8: 0 Nghiêm trọng, 0 Nên sửa, 2 Góp ý
- Đọc hiểu (Haiku): lượt 1 (bản trước vòng 2, quá nhiễu: 85 / 276 / 228, bỏ); lượt 2 toàn bài trên bản sau vòng 2: 235 / 3 / 0 (`doc-hieu-2.md`); lượt 3 trên 3 mục viết lại: 1 / 2 / 0 (`doc-hieu-3.md`); lượt 4 trên 8 mục viết lại: 6 / 2 / 0 (`doc-hieu-4.md`); hai mục còn mơ hồ (`goals[3]`, note thử `tim-x`) đã viết lại lần cuối, quá 3 lượt nên không đọc lại, ghi ở Nên sửa. Lượt đọc không phủ `options` và `hints`. Phần bài tập sách bài tập (chữ mới ngoài đề sách, 5 lượt, đếm từ tệp kết quả): lượt 1: 28 / 35 / 3 trên 66 mục (`doc-hieu-bai-tap-sach-1.md`); lượt 2: 25 / 10 / 0 trên 35 mục viết lại; lượt 3: 1 / 8 / 1 trên 10 mục viết lại; lượt 4: 10 / 3 / 0 trên 13 mục chữ đổi sau vòng 6; lượt 5: 5 / 3 / 1 trên 9 mục chữ đổi sau vòng 7. Các mục còn mơ hồ sau lượt 3 và 5 ghi ở Nên sửa 19, 27 và Góp ý 33
- `lesson:walk`: 0 FAIL, 0 cảnh báo (bản đã duyệt, 13 phần, cây tạm cổng 3670); `visual:shot` 146/146; ảnh trong `.shots/walk/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/` (12 phần đầu: 0 FAIL ở bản `0e8d510`)
- Kết luận: Đạt: 0 Nghiêm trọng sau vòng 4 (12 phần đầu) và sau vòng 8 (phần bài tập sách bài tập); đã chạy `pnpm content:hash phep-chia-het-uoc-va-boi-cua-mot-so-nguyen --root content --approve` và `pnpm content:lock phep-chia-het-uoc-va-boi-cua-mot-so-nguyen`. Còn Nên sửa chưa xử lý: 2, 3, 7, 8, 9, 10, 11 (chiều ngược của quy tắc `tim-x`), 13 (khớp Bài 16 khi xuất bản). Phần bài tập sách bài tập còn: Nên sửa 27 (vài mục đọc hiểu còn mơ hồ sau lượt 5, reviewer tự đọc thì hiểu được) và Góp ý 20 đến 26, 33, 34 (xem "Tổng kết phần bài tập sách bài tập" ở cuối tệp)
- Bản đã review: `f4bbe1a8919b8d1f89a7945233b667e737d3e52a6939ac7b37e0fb177da155c1` (`pnpm content:diff` so với bản này)

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

### 13. Khớp Bài 16 (`phep-nhan-so-nguyen`, chỉ đọc)

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

Quyết định của chủ dự án (02/10/2026): giữ nguyên câu quy tắc cùng dấu gốc ("…chia hai phần số tự nhiên cho nhau.") vì đọc rõ nghĩa hơn; không đổi theo Bài 16.

## Vòng 6: phần bài tập sách bài tập (section cuối, Opus, soát đầy đủ phần mới)

- Phạm vi: chỉ phần mới của commit `24f73a7` (so với `cfefb43`). `$.sections[12]` (`phep-chia-het-uoc-va-boi-cua-mot-so-nguyen.section.bai-tap-sach-bai-tap`): 4 khối "Nhắc lại", recap, `checkIds` 24 câu; `$.exercises[66]` đến `[89]` (9 câu sách `bookRef` SBT 3.35a, 3.35b, 3.35c, 3.36a, 3.36b, 3.37, 3.38, 3.39, 3.40; 15 câu dẫn `leadsTo`); 24 hình `sbt-*` trong `src/visuals/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/catalog.ts` và hình cũ `tim-x-vi-du` dùng lại ở khối thứ 4. 12 section đầu, id, video, media, overview không soát.
- Nguồn đã đọc (mở ảnh): `sources/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/sbt-p58.png` (Kiến thức cần nhớ, Ví dụ 1), `sbt-p59.png` (lời giải Ví dụ 1, Ví dụ 2, đề 3.35 đến 3.40), `sbt-p113.png` (lời giải 3.36 đến 3.40). Sách không in lời giải 3.35.
- Đủ bài tập: ảnh có 3.35 a, b, c; 3.36 (một câu, hai số 21 và −66); 3.37; 3.38; 3.39; 3.40 = 8 mục. Dòng "book exercises (9)" của `content:check --stats` phủ đủ cả 8; 3.36 tách thành `SBT 3.36a` (ước của 21) và `SBT 3.36b` (ước của −66), cả hai giữ nguyên câu đề sách, câu lệnh app "Câu này hỏi các ước của ..." ở khối riêng. Sách không có nhãn a, b cho 3.36, nhưng bé không thấy `bookRef` trên màn (đầu màn chỉ ghi "Bài tập · Kiểm tra nhanh") và không có đề nào ngoài sách, nên cách tách đạt. Đáp án viết gọn ± đúng dạng "viết gọn" của lời giải tr.113.
- Đề y hệt sách: so từng chữ, số, dấu câu của cả 9 câu (đọc liền khối `note` và `formula`: "Thực hiện phép chia:" + "735 : (−5);", "(−528) : (−12);", "(−2 020) : 101."; "Tìm các ước của 21 và −66."; đề 3.37; "Liệt kê các phần tử của tập hợp sau:" + "P = {x ∈ ℤ | x ⋮ 3 và −18 < x ≤ 18}."; đề 3.39; đề 3.40 dài): khớp. Câu lệnh app ("Chọn tất cả ...", "Dấu ⋮ đọc là chia hết cho ...", "Chạm vào tất cả các số cần tìm.") ở khối riêng cuối đề: đúng luật. Viết 3.38 bằng `note` có ký hiệu ⋮ thay TeX: đạt (ảnh phone, iPad đọc rõ).
- Đáp án: 3.36 đến 3.40 khớp tr.113 (3.36 cả hai dạng viết gọn; 3.37 đủ 13 số; 3.38 đủ 12 phần tử; 3.39 bốn tích; 3.40 ±1, ±5). 3.35 tự tính (bảng "Đã tự tính"). Mỗi câu có đúng một đáp án: `fillBlank` 3.36, 3.38 xếp từ bé đến lớn nên một thứ tự; `manipulate` 3.37 đúng 13 chip; `choice` 3.39, 3.40 đúng tập đáp án (thay từng lựa chọn bằng chương trình).
- Quy ước nhân số chia · thương: mọi phép nhân trong `explain`, `tex`, hình của phần mới viết b · q (12 · 44 = 528, 101 · 20 = 2 020, (−5) · (−147) = 735, 101 · (−4) = −404, 0 = 6 · 0, 101 · 6 = 606, 12 · 30 = 360): đạt.
- Khối "Nhắc lại": so từng chuỗi với 12 section đầu bằng chương trình. Mọi câu quy tắc là câu nguyên văn của section `chia-cung-dau`, `chia-khac-dau`, `tim-uoc`, `tim-boi`, `boi-trong-khoang`, `phan-tich-thanh-tich`, `tim-x`; ba câu chỉ khác ở dấu cách (Góp ý 22). Recap lặp nguyên văn hai câu `rule` của section: đạt.
- `content:check`: 0 lỗi, 0 cảnh báo của bài (sau `--approve` và `content:lock`, 128 id)
- Đọc hiểu (Haiku, lượt 1 trên phần mới): 28 / 35 / 3; tệp `.shots/review/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/doc-hieu-bai-tap-sach-1.md`; lượt 2: 25 / 10 / 0; lượt 3: 1 / 8 / 1. Đã tự đọc 9 mục còn lại như bé chậm (mục 19).
- Hình: đã đọc sheet walk phone `sheet-23.png` đến `sheet-31.png` và iPad `sheet-31.png`, `sheet-38.png` (0 FAIL); sheet hình riêng `sheet-phone-08.png`, `-09`, `-11` đến `-14`, `-16`, `-18`, `-20`. Tự tính lại mọi dòng của 24 hình `sbt-*`, kể cả dòng ẩn "?" của 9 hình gợi ý (mode `hint` chỉ ẩn dòng cuối, `src/visuals/shared/formula-rows.tsx`): mọi hình gợi ý dùng số khác đề và ẩn đúng dòng kết quả. Ảnh hình riêng của `sbt-3-35a-giai`, `sbt-3-35b-giai` chụp trước bản `catalog.ts` cuối (Góp ý 25).
- Kết luận vòng: 1 Nghiêm trọng, 4 Nên sửa, 7 Góp ý. Không chạy `content:hash` (ngoài phạm vi vai). Mục lessons-learned cần tăng số khi tổng hợp: LL-08 (một Nghiêm trọng, vòng 6 phần bài tập sách bài tập).

### Nghiêm trọng

#### 15. Hình lời giải và hình gợi ý 3.40 chép dòng lời giải của sách

- Vị trí: hình `sbt-3-40-giai` (lời giải của `$.exercises[89]`, `sbt-3-40`, dòng 2 "5 = (x + 5) − x ⋮ x"), hình `sbt-goi-y-x-13` (gợi ý của cùng câu, dòng 2 "13 = (x + 13) − x ⋮ x"). LL-08.
- Nguồn: tr.113, 3.40 "Từ đó ta có 5 = (x + 5) − x chia hết cho x. Nói cách khác, x là một ước của 5. Vì 5 chỉ có bốn ước là ±1 và ±5 ...".
- Vấn đề: ba dòng của `sbt-3-40-giai` (x + 5 ⋮ x; 5 = (x + 5) − x ⋮ x; x = ±1, ±5 "x là ước của 5") là đúng chuỗi lời giải sách của chính bài này, dòng giữa là công thức của sách chỉ thay chữ "chia hết cho" bằng ⋮. Checklist: chép lời giải hay cách trình bày của sách vào hình lời giải là Nghiêm trọng, kể cả khi đề ép cách làm (tiền lệ `phep-nhan-so-nguyen` vòng 6, mục 12). Phân vân vì hình quy tắc `tim-x-3` của section `tim-x` (đã duyệt, Góp ý 10 vòng 3) cũng có khuôn "3 = (x + 3) − x ⋮ x"; chọn mức cao vì ở đây là lời giải sách của đúng bài 3.40 với đúng số. Thêm nữa, "(x + 5) − x ⋮ x" đọc được thành "(x + 5) − (x ⋮ x)", còn nhãn "x khác 0 chia hết cho x" đặt cạnh không nói vì sao 5 chia hết cho x. `explain` của câu không bị tính: nó dùng câu quy tắc của section `tim-x` ("hiệu của x + 3 và x, tức 3, cũng chia hết cho x") và `tex` đã viết theo thứ tự của bài "(x + 5) − x = 5".
- Sửa: viết hình theo thứ tự câu quy tắc của bài, mỗi ý một dòng: "x + 5 ⋮ x" (điều cần có); "(x + 5) − x = 5" (nhãn "hiệu của x + 5 và x"); "5 ⋮ x" (nhãn "x + 5 và x cùng chia hết cho x, nên hiệu cũng vậy"); "x = ±1, ±5" (x là ước của 5). `sbt-goi-y-x-13` đổi theo cùng khuôn với 13 (vẫn ẩn dòng cuối). Đáp án không đổi. Hình `tim-x-3` của section `tim-x` ngoài phạm vi vòng này.

### Nên sửa

#### 16. Bài 3.37 bày sẵn mọi bội của 11 trên màn, bé không phải tìm bội

- Vị trí: `$.exercises[80]` (`sbt-3-37`), hình `sbt-chon-boi-11` (16 chip −55, −44, ..., 99, 110 xếp theo thứ tự, cách nhau 11; nhiễu chỉ có −55, 0, 110). LL-14.
- Nguồn: tr.59 (3.37 "Tìm các bội khác 0 của số 11 ..."), tr.113.
- Vấn đề: cả 16 chip đều là bội của 11 và xếp tăng dần, nên việc chính của đề (tìm các bội) đã làm sẵn; bé chỉ cần bỏ ba số ở hai đầu và số 0. Ba nhiễu đều loại được bằng mẹo nhìn đầu dãy, cuối dãy. Câu dẫn `dan-3-37-boi-8-khoang` (ngân hàng có −32, 40, 0) cũng chỉ tập ranh giới. Bé làm đúng trên app mà vẫn có thể không tự tìm được bội khi gặp đề trong bài kiểm tra.
- Sửa: thêm 4 đến 5 chip không phải bội của 11 nhưng dễ nhầm (vd 21, −12, 101, 45, 98) và bỏ thứ tự tăng dần (danh sách chip không xáo), giữ −55, 0, 110 làm nhiễu ranh giới; đổi `params` theo. Hoặc chuyển thành `fillBlank` 13 ô xếp từ bé đến lớn như 3.38, ngân hàng có số không chia hết cho 11.

#### 17. Lời giải câu dẫn 3.40 trỏ "quy tắc ở trên" mà màn không có

- Vị trí: `$.exercises[87].explain.text` (`dan-3-40-hieu-x-11`: "Theo quy tắc ở trên, hiệu của chúng cũng chia hết cho x."). LL-10, LL-22.
- Nguồn: —
- Vấn đề: màn của câu chỉ có đề và ô nhập; "quy tắc ở trên" là khối "Nhắc lại cho bài 3.40" ở màn trước hoặc section `tong-hieu-chia-het`, bé phải đoán. Câu đầu "Hai số x và x + 11 cùng chia hết cho x" cũng không nói vì sao x chia hết cho x. Haiku lượt 1 xếp mục này "Khó hiểu", lượt 3 vẫn "Hiểu mơ hồ".
- Sửa: nói thẳng quy tắc bằng câu của bài: "Số x khác 0 luôn chia hết cho chính nó, và đề cho x + 11 chia hết cho x. Hai số cùng chia hết cho x thì hiệu của chúng cũng chia hết cho x. Hiệu đó là (x + 11) − x = 11."

#### 18. Hình nhắc lại cho 3.36 đặt "±3" ngay trên 38, mà 3 không là ước của 38

- Vị trí: `$.sections[12].blocks[1].children[3]`, hình `sbt-nhac-lai-uoc-tich` (dòng 1 "±3 | ±3 là hai số 3 và −3", dòng 2 "38 = 1 · 38 = 2 · 19", nhãn đọc màn hình "Các ước của −38 và ..."). LL-21.
- Nguồn: —
- Vấn đề: hình đọc từ trên xuống, dòng đầu "±3" nằm ngay trên phép phân tích 38 trong hình về các ước của −38; bé chậm dễ đọc thành "±3 là ước của 38" rồi điền 3 vào 3.36b hay bài tương tự. Ở hình quy tắc `uoc-vi-du` của section `tim-uoc`, dòng "±3" đứng cạnh ước của 9 (3 là ước thật) nên không có chỗ nhầm này.
- Sửa: dùng một ước thật của 38: "±2 | ±2 là hai số 2 và −2", hoặc chuyển dòng giải thích ± xuống ngay dưới dòng "±1, ±2, ±19, ±38".

#### 19. Chín mục còn mơ hồ sau ba lượt đọc hiểu

- Vị trí: `$.exercises[67]`, `[68]`, `[69]`, `[70]`, `[72]`, `[73]`, `[80]`, `[87]`, `[88]` `.explain.text`. LL-25.
- Nguồn: `.shots/review/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/doc-hieu-bai-tap-sach-3.md`.
- Vấn đề (tự đọc như bé chậm):
  - `[67]`, `[68]` (`dan-3-35a-345-am5`, `sbt-3-35a`): Haiku vướng "dương, âm, khác dấu", là từ của bài đã dạy; câu tách 345 = 300 + 45 rồi chia từng phần đọc được. Không cần sửa.
  - `[69]`, `[70]`, `[72]` (`dan-3-35b-am156-am12`, `sbt-3-35b`, `dan-3-35c-am1515-101`): "12 · 40 = 480, 12 · 4 = 48, cộng lại 12 · 44 = 528" bỏ lửng việc cộng cái gì (480 + 48 và 40 + 4 cùng lúc). Bé chậm, yếu nhân chia dễ dừng ở đây. Nên viết lại.
  - `[73]` (`sbt-3-35c`): "Vì 101 · 2 = 202 nên 101 · 20 = 2 020" nhảy bước nhân thêm 10. Nên viết lại.
  - `[80]` (`sbt-3-37`): dài nhưng đúng ba câu, từ đã dạy; đọc được. Không bắt buộc sửa.
  - `[87]`: mục 17. `[88]`: Góp ý 20.
- Sửa: `[70]` "Ta tìm số nhân với 12 để được 528: 12 · 40 = 480, còn thiếu 528 − 480 = 48 = 12 · 4, nên 12 · 44 = 528." (cùng khuôn cho `[69]` với 156, `[72]` với 101 và 1 515); `[73]` "101 · 2 = 202, mà 2 020 là 202 viết thêm một chữ số 0, nên 101 · 20 = 2 020." Giữ tối đa 3 câu.

### Góp ý

#### 20. Lời giải câu dẫn đếm x nói chiều ngược quy tắc nhắc lại; lời giải 3.40 không nói vì sao x = −5 được

- Vị trí: `$.exercises[88].explain.text` (`dan-3-40-dem-x-9`: "nên x + 9 chia hết cho x khi 9 chia hết cho x"); `$.exercises[89].explain` (`sbt-3-40`).
- Nguồn: —
- Vấn đề: khối "Nhắc lại cho bài 3.40" và 3.40 đi chiều "x + 9 chia hết cho x thì 9 chia hết cho x" (lấy hiệu), còn `[88]` nói chiều ngược (lấy tổng), cùng kiểu Nên sửa 11 của vòng 3 ở section `tim-x`; Haiku lượt 3 vẫn vướng. Ở 3.40, x = −5 cho x + 5 = 0, bé dễ bỏ sót vì nghĩ 0 không chia được; `explain` không nói, trong khi câu cùng làm `chon-x-8-cung-lam` của bài có nói.
- Sửa: `[88]` "Nếu x + 9 chia hết cho x thì hiệu (x + 9) − x, tức 9, cũng chia hết cho x. Như vậy x là ước của 9 ..."; 3.40 thêm một dòng `tex` hay một dòng cuối trong `sbt-3-40-giai`: "x = −5: x + 5 = 0, mà 0 chia hết cho −5".

#### 21. Hình gợi ý 3.35b dùng cách tìm thương khác lời giải

- Vị trí: hình `sbt-goi-y-chia-cung-dau-12` (hint của `$.exercises[70]`, `sbt-3-35b`: "12 · 30 = 360", "372 − 360 = 12", nhãn "chia từng phần").
- Nguồn: —
- Vấn đề: nấc 2 lấy số dư rồi chia tiếp, còn `explain` và `sbt-3-35b-giai` nhân 12 với từng phần (40 rồi 4) rồi cộng; nhãn "chia từng phần" của 3.35a lại nghĩa là tách số bị chia. Bé gặp ba cách làm trong một bài tập.
- Sửa: hình gợi ý theo đúng cách của lời giải: "12 · 30 = 360", "12 · 1 = 12", nhãn "tìm thương từng phần", dòng ẩn "= 31".

#### 22. Ba câu nhắc lại mất dấu cách không ngắt (U+00A0) của câu gốc

- Vị trí: `$.sections[12].blocks[0].children[2].text`, `blocks[3].children[1].text`, `blocks[3].children[2].text`.
- Nguồn: section `chia-khac-dau`, `tim-x`.
- Vấn đề: câu gốc giữ U+00A0 sau "−" và quanh "x + 3", "x + 6" (quy ước NBSP của bài, vòng 3); bản nhắc lại dùng dấu cách thường, nên không trùng từng ký tự và trên màn hẹp "x + 3" hay "dấu −" có thể gãy dòng (ảnh hiện tại chưa gãy). Các `explain` mới cũng dùng dấu cách thường quanh +, −, ·, :, =.
- Sửa: chép lại đúng chuỗi của câu gốc (kể cả U+00A0); áp quy ước NBSP cho chữ mới.

#### 23. Số lặp giữa câu dẫn, hình và 12 section đầu

- Vị trí: `dan-3-40-dem-x-9` (x + 9) và `ex.x-lon-nhat-9` (x + 9, section `tim-x`); `dan-3-37-dem-boi-9` ("Có bao nhiêu bội của 9 ...") và `ex.dem-boi-9-khoang`; recap `sbt-tom-tat` (bội của 6, −13 < x ≤ 20) và `ex.xep-boi-6-khoang` (bội của 6, −14 < x < 14); `dan-3-38-boi-5-khoang` (bội của 5 quanh 0) và cùng làm `chon-boi-5-khoang-cung-lam`. LL-07.
- Nguồn: —
- Vấn đề: không lộ đáp án câu sách nào, nhưng bé gặp lại cùng số, cùng khuôn câu đã làm.
- Sửa: đổi số trong một vế của mỗi cặp (vd x + 7, bội của 7 dưới 50, bội của 4 trong recap).

#### 24. Recap của section chỉ tóm hai trong bốn khối nhắc lại

- Vị trí: `$.sections[12].recap`. LL-06.
- Nguồn: —
- Vấn đề: recap và hình `sbt-tom-tat` chỉ có tìm ước và bội trong khoảng; dấu của thương (3.35), phân tích thành tích (3.39), tìm x (3.40) không có. Recap ngắn là chủ ý, nhưng bé ôn cuối phần sẽ không thấy ba dạng còn lại.
- Sửa: tuỳ tác giả: thêm vào hình `sbt-tom-tat` một dòng mỗi dạng (vd "(−84) : 7 = −12", "x + 7 ⋮ x: x là ước của 7"), giữ caption hai câu `rule`.

#### 25. Bố cục và ảnh chụp

- Vị trí: `$.sections[12].blocks[1]`, `blocks[2]` (ảnh `182-s13-02-block`, `183-s13-03-block` phone); hình `sbt-3-35a-giai`, `sbt-3-35b-giai` (`sheet-phone-08.png`, `sheet-phone-09.png`).
- Nguồn: —
- Vấn đề: bố cục: hai khối nhắc lại thứ 2 và thứ 3 phải cuộn dọc trên điện thoại (dòng cuối "đổi dấu cả hai thừa số", "có thêm số 0" bị khuất dưới nút "Tiếp"); iPad đủ một màn. Ảnh: hai hình lời giải trong sheet còn dòng "700 : 5 = 140, 35 : 5 = 7" và "12 · 40 = 480, 12 · 4 = 48" trên một dòng, chữ số cuối rơi xuống dòng riêng; `catalog.ts` hiện đã xếp hai dòng bằng `steps(...)` (ảnh chụp 02:59, commit 03:05), nên không ghi lỗi nội dung. Walk không mở hình lời giải nên chưa có ảnh của bản cuối.
- Sửa: điều phối chụp lại hai hình bằng `visual:shot` trước khi duyệt; khối nhắc lại dài là việc của bố cục app.

#### 26. Nhiễu "3 · 9" của 3.39 không ứng lỗi nào

- Vị trí: `$.exercises[86].options[6]` (`sbt-3-39`). LL-14.
- Nguồn: —
- Vấn đề: 3 · 9 = 27 không ra từ cách làm sai nào khi phân tích 21; hai nhiễu dấu (−3) · 7, (−1) · 21 đã bắt đúng lỗi hay gặp.
- Sửa: thay bằng tích bé hay nhầm thứ tự dấu như "(−7) · 3", hoặc bỏ.

### Đã tự tính

Chương trình Node trong thư mục nháp của phiên (`check.mjs`, `nhac.mjs`): 79 phép kiểm đạt, 0 sai.

| Đối tượng | Đã kiểm | Kết quả |
|---|---|---|
| 3.35 (sách không có lời giải) | 735 : (−5); (−528) : (−12); (−2 020) : 101, và b · q = a | −147; 44; −20, khớp `answer` |
| 5 câu dẫn 3.35 | (−68) : 4; 345 : (−5); (−156) : (−12); (−404) : 101; (−1 515) : 101 | −17; −69; 13; −4; −15 |
| 3.36a, 3.36b và 2 câu dẫn | ước dương của 21, 66, 26, 52 so với thứ tự ô; nhiễu ngân hàng không là ước | ±1; ±3; ±7; ±21 và ±1; ±2; ±3; ±6; ±11; ±22; ±33; ±66 khớp tr.113; nhiễu 2, 9, 14 / 4, 9, 12 / 4, 6 / 3, 8 |
| 3.37 | bội khác 0 của 11 trong (−50; 100); `params` từng chip | 13 số khớp tr.113; chip không chọn: −55, 0, 110; 0 chip không phải bội của 11 |
| Câu dẫn 3.37 | bội của 9 trong (0; 60); bội khác 0 của 8 trong (−30; 40) | 6; −24; −16; −8; 8; 16; 24; 32 |
| 3.38 và câu dẫn | x ⋮ 3, −18 < x ≤ 18; x ⋮ 5, −15 < x ≤ 15 | 12 phần tử khớp tr.113; −10; −5; 0; 5; 10; 15 |
| 3.39 | giá trị 7 lựa chọn; mọi cặp thừa số nguyên của 21 | đúng a, b, d, e; bốn cặp (1, 21), (3, 7), (−1, −21), (−3, −7) khớp tr.113 |
| 3.40 | x khác 0 trong [−1 000; 1 000] để x + 5 chia hết cho x; thay từng lựa chọn | −5, −1, 1, 5; đúng a, b, c, d |
| Câu dẫn 3.39, 3.40 | 22 : 2; 22 : (−2); (x + 11) − x; số x để x + 9 chia hết cho x | 11; −11; 11; 6 số (±1, ±3, ±9) |
| 24 hình `sbt-*` | mọi dòng, kể cả dòng ẩn "?" của 9 hình gợi ý: −92; 31 (12 · 30 = 360); −60 (101 · 6 = 606); ước của 34, 70, 38, 57, 39; bội của 25 trong (−60; 120), của 7 trong (−21; 21], của 4 trong (−8; 12], của 6 trong (−13; 20]; x + 13 | đúng; mọi hình gợi ý ẩn đúng dòng kết quả |
| Khối "Nhắc lại" và recap | so từng câu với 12 section đầu và các bài khác | trùng nguyên văn; ba câu khác U+00A0 (Góp ý 22) |

## Vòng 7: phần bài tập sách bài tập, chỉ phần đổi sau vòng 6 (Sonnet)

- Phạm vi: `pnpm content:diff phep-chia-het-uoc-va-boi-cua-mot-so-nguyen --base 24f73a7` (2 `checkIds` đổi id, 3 khối "Nhắc lại" đổi dấu cách, 10 exercise đổi, 2 câu dẫn thêm, 2 câu dẫn bớt) và `git diff 24f73a7` của `src/visuals/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/catalog.ts` (hình `sbt-nhac-lai-uoc-tich`, `sbt-tom-tat`, `sbt-goi-y-chia-cung-dau-12`, `sbt-chon-boi-11`, `sbt-goi-y-x-13`, `sbt-3-40-giai`). Soát cả các mục khác của section `phep-chia-het-uoc-va-boi-cua-mot-so-nguyen.section.bai-tap-sach-bai-tap` xem bản sửa có làm hỏng chúng không. 12 section đầu, id đã khoá, video, media không soát.
- Nguồn đã đọc (mở ảnh): `sbt-p59.png` (đề 3.35 đến 3.40), `sbt-p113.png` (lời giải 3.36 đến 3.40). Đã so lại từng chữ, số, dấu của đề 3.37, 3.38, 3.39, 3.40 (cả đoạn "Ta đã biết ... x là ước của x + 5") với `prompt` và các lựa chọn: khớp. Đáp án 3.37 (13 số), 3.38 (12 phần tử), 3.39 (bốn tích), 3.40 (±1, ±5) khớp tr.113; 3.35 sách không in lời giải, tự tính. `bookRef` không đổi, 9 mục khớp dòng "book exercises (9)" của `content:check --stats`.
- Câu dẫn: kiểm bằng chương trình mỗi câu `leadsTo` đứng trước câu sách kế tiếp đúng là đích của nó, tối đa 2 câu dẫn cho mỗi câu sách (3.35a 2, 3.35b 1, 3.35c 2, 3.36a 1, 3.36b 1, 3.37 2, 3.38 2, 3.39 2, 3.40 2); độ khó tăng dần trong mỗi nhóm. Mọi hình `sbt-*` của catalog đều được `lesson.json` dùng, không hình thừa, không id treo; hai id đã bỏ (`dan-3-38-boi-5-khoang`, `dan-3-40-dem-x-9`) chỉ còn nhắc ở `review.md`.
- `content:check`: 0 lỗi, 0 cảnh báo của bài (sau `--approve` và `content:lock`, 128 id)
- Đọc hiểu (Haiku, lượt 4 trên chữ đổi): 10 / 3 / 0 (`.shots/review/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/doc-hieu-bai-tap-sach-4.md`). Ba mục "Hiểu mơ hồ": `$.exercises[80].explain.text`, `$.exercises[82].prompt[1].text`, `$.exercises[87].explain.text`; đã quá 3 lượt nên ghi vào Nên sửa (mục 27), không chặn duyệt. Chữ cuối của `[80]` viết lại sau lượt 4, Haiku chưa đọc lại; đã tự đọc như bé chậm (mục 27).
- Hình: đã đọc sheet walk phone `sheet-23.png` đến `sheet-31.png` và iPad `sheet-30.png`, `sheet-31.png` (0 FAIL); hình riêng `sheet-phone-08.png`, `sheet-phone-09.png` (hai hình lời giải 3.35a, 3.35b chụp lại), `sbt-3-40-giai-phone.png`, `sbt-goi-y-x-13-phone.png`, `sbt-goi-y-chia-cung-dau-12-phone.png`: chữ rõ, không chồng, không tràn, không chữ mồ côi, công thức trong lời giải không bị cắt. Ảnh walk chụp trước chữ cuối của `[80]`; chữ đó đọc trong JSON.
- Kết luận vòng: 0 Nghiêm trọng, 1 Nên sửa, 5 Góp ý. Không chạy `content:hash` (ngoài phạm vi vai). Không có phát hiện Nghiêm trọng nên không đụng `docs/lessons-learned/`.

### Kiểm bản sửa vòng 6

| Mục | Kết quả | Ghi chú |
|---|---|---|
| 15 | Đã sửa đúng | `sbt-3-40-giai` và `sbt-goi-y-x-13` có bốn dòng theo thứ tự câu quy tắc của bài: "x + 5 ⋮ x", "(x + 5) − x = 5", "5 ⋮ x", "x = ±1, ±5"; không còn dòng "5 = (x + 5) − x ⋮ x" của sách. Hình gợi ý dùng 13 và ẩn đúng dòng cuối (ảnh hiện "?"). Còn nhãn dòng 3 gần nguyên một câu sách: mục 32. |
| 16 | Đã sửa đúng | `sbt-chon-boi-11` có 20 chip, không xếp tăng dần; 13 bội đúng đủ mặt; nhiễu −55, 0, 110 và −16, 38, −27, 61 (không số nào là bội của 11); `params` i0 đến i19 khớp từng chip (tự tính). Bốn số mới đều chỉ lệch một chữ số so với một bội có mặt, nhưng là số khác hẳn, nhìn rõ, đúng kiểu nhầm bảng nhân 11: không phải "bẫy khó thấy". Lời giải `[80]` và ảnh walk "Đã chọn 13" khớp. |
| 17 | Đã sửa đúng | `[87]` nói thẳng quy tắc, không còn "quy tắc ở trên"; câu đầu nêu x chia hết cho chính nó. Haiku lượt 4 vẫn "mơ hồ" ở câu quy tắc: mục 27. |
| 18 | Đã sửa đúng | Dòng đầu hình `sbt-nhac-lai-uoc-tich` là "±2 | ±2 là hai số 2 và −2", ngay trên "38 = 1 · 38 = 2 · 19" (2 là ước thật của 38); ảnh phone, iPad đọc rõ. |
| 19 | Một phần | `[69]`, `[70]`, `[72]`, `[73]` đúng khuôn "còn thiếu ... = ...", đúng số học, Haiku lượt 4 "Hiểu rõ" cả bốn. `[80]` chữ cuối mới chưa được đọc lại, `[87]` và khối ký hiệu tập hợp của `[82]` còn "mơ hồ": mục 27. |
| 20 | Một phần | `[88]` (`dan-3-40-dem-x-14`) đi chiều hiệu, khớp khối "Nhắc lại", hình gợi ý và lời giải 3.40; Haiku "Hiểu rõ". 3.40 có thêm dòng `tex` "(−5) + 5 = 0 ⋮ (−5)" nhưng không nói đây là x = −5: mục 30. |
| 21 | Đã sửa đúng | `sbt-goi-y-chia-cung-dau-12` theo cách của lời giải: "12 · 30 = 360", "12 · 1 = 12", nhãn "tìm thương từng phần", dòng cuối ẩn "?"; 372 : 12 = 31 (số khác đề, không lộ 44). Hình không có dòng "còn thiếu": mục 31. |
| 22 | Đã sửa đúng | Sáu câu "Nhắc lại" trùng từng ký tự với câu gốc (so bằng chương trình, kể cả U+00A0). Mọi phép tính ngắn trong `explain` mới (`[69]`, `[70]`, `[72]`, `[73]`, `[80]`, `[87]`, `[88]`, `[89].wrong`) dùng U+00A0 quanh +, −, ·, :, =; ngăn nghìn U+202F như câu cũ; 0 chỗ còn dấu cách thường. Ảnh phone không gãy dòng giữa phép tính. |
| 23 | Một phần | Bốn cặp lặp cũ đã hết: không còn "x + 9", "bội của 9 (0; 60)", "bội của 6 (−13; 20]", "bội của 5 quanh 0" ngoài đề cũ. Nhưng câu dẫn 3.38 mới (bội của 9, −27 < x ≤ 27) có đúng tập đáp án của `ex.dem-boi-9-khoang`, và câu dẫn 3.40 mới (x + 14) có đúng tập đáp án của hình `uoc-vi-du`: mục 28. |
| 24 | Không đổi | Chủ ý recap ngắn; giữ Góp ý. |
| 25 | Đã sửa đúng (phần hình) | `sbt-3-35a-giai`, `sbt-3-35b-giai` chụp lại (`sheet-phone-08.png`, `-09.png`): mỗi hình hai dòng "700 : 5 = 140 / 35 : 5 = 7" và "12 · 40 = 480 / 12 · 4 = 48", không còn chữ số rơi riêng. Bố cục cuộn dọc ở khối "Nhắc lại" 3.36 và 3.37 trên phone (nút Tiếp che dòng cuối, `sheet-23.png`) vẫn còn: việc của người làm app, giữ ghi nhận; iPad vừa một màn. |
| 26 | Đã sửa đúng | `sbt-3-39` còn 6 lựa chọn (a, b, d, e đúng; c, f nhiễu dấu), `wrong` chỉ còn c và f; không còn id `g`; đáp án `a, b, d, e` đúng (tự tính). |

### Nghiêm trọng

Không có.

### Nên sửa

#### 27. Ba mục còn "Hiểu mơ hồ" sau lượt đọc hiểu thứ tư, và chữ cuối của `[80]` chưa được đọc lại

- Vị trí: `$.exercises[80].explain.text` (`sbt-3-37`), `$.exercises[82].prompt[1].text` (`dan-3-38-boi-9-khoang`), `$.exercises[87].explain.text` (`dan-3-40-hieu-x-11`). LL-25.
- Nguồn: `.shots/review/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/doc-hieu-bai-tap-sach-4.md`.
- Vấn đề: đã quá 3 lượt nên không chặn duyệt. `[87]`: "Hai số cùng chia hết cho x thì hiệu của chúng cũng chia hết cho x" là quy tắc chung của section `tong-hieu-chia-het`, nói trừu tượng; Haiku vướng ở đây ở cả ba lượt. `[82]`: khối ký hiệu `A = {x ∈ ℤ | x ⋮ 9 và −27 < x ≤ 27}` y như khuôn đề 3.38; dòng giải thích chỉ có dấu ⋮, còn cách đọc cả tập hợp chỉ xuất hiện trong `explain` sau khi trả lời (hồ sơ người học ghi chưa viết được ký hiệu tập hợp). `[80]`: câu cuối mới "Ta bỏ −55 và 110 vì ngoài khoảng, bỏ số 0, và bỏ −16, 38, −27, 61 vì không chia hết cho 11" có ba "bỏ" và hai "vì" trong một câu 23 chữ; tự đọc thì hiểu được, nhưng "bỏ số 0" không còn lý do đi kèm (lý do "đề cần bội khác 0" đã bị rút khỏi câu).
- Sửa: `[82]` thêm vào khối lệnh `prompt[2]` một câu đọc cả tập hợp: "Đọc cả tập hợp: các số nguyên x chia hết cho 9, lớn hơn −27 và nhỏ hơn hoặc bằng 27." (giữ tối đa 3 câu). `[80]` tách ý trong ba câu sẵn có: câu 2 "Các bội khác 0 trong khoảng là ... 99." giữ; câu 3 "Ta bỏ −55 và 110 vì ngoài khoảng, còn −16, 38, −27 và 61 vì không chia hết cho 11; số 0 cũng bỏ vì đề cần bội khác 0." hoặc để Haiku đọc lại câu cuối trước khi duyệt. `[87]` có thể giữ nguyên vì là câu quy tắc của bài.

### Góp ý

#### 28. Hai tập đáp án của câu dẫn mới trùng với màn đã học

- Vị trí: `$.exercises[82]` (`dan-3-38-boi-9-khoang`, đáp án −18; −9; 0; 9; 18; 27) và `ex.dem-boi-9-khoang` (card `boi-trong-khoang`: "Có bao nhiêu bội của 9 lớn hơn −20 và nhỏ hơn hoặc bằng 27", `explain` liệt kê đúng −18, −9, 0, 9, 18 và 27); `$.exercises[88]` (`dan-3-40-dem-x-14`, đáp án ±1, ±2, ±7, ±14) và hình `uoc-vi-du` của section `tim-uoc` (dòng "±1, ±2, ±7, ±14" các ước của −14; câu quy tắc của khối "Nhắc lại cho bài 3.36" cũng nêu số 14). LL-07.
- Nguồn: —
- Vấn đề: không lộ đáp án câu sách nào, nhưng đây là cách sửa mục 23 vòng 6 đẩy trùng sang cặp khác: bé gặp lại cùng bộ số bội của 9 trong khoảng cận 27 và cùng bộ ước của 14 đã thấy trong bài.
- Sửa: đổi số của câu dẫn 3.38 sang số chưa dùng trong bài, ví dụ `x ⋮ 10 và −30 < x ≤ 30` (−20; −10; 0; 10; 20; 30, vẫn có biên −30 bỏ, 30 giữ; đổi `segments`, `bank`, `explain` theo); câu dẫn 3.40 dùng x + 15 hay x + 16 (số ước khác 8 thì đổi cả đáp án).

#### 29. Id `dan-3-37-dem-boi-9` không còn khớp chữ, và câu dùng đúng cận "nhỏ hơn 100" của đề 3.37

- Vị trí: `$.exercises[78]` (`dan-3-37-dem-boi-9`: "Có bao nhiêu bội của 18 lớn hơn 0 và nhỏ hơn 100?"), `$.sections[12].checkIds[12]`. LL-07.
- Nguồn: tr.59 (3.37 "... lớn hơn −50 và nhỏ hơn 100").
- Vấn đề: tác giả đã đổi id hai câu dẫn khác theo chữ mới (`dan-3-38-boi-9-khoang`, `dan-3-40-dem-x-14`) nhưng câu này giữ "boi-9" trong khi đề đã là bội của 18 (id chưa khoá nên đổi được; để vậy người sau dễ nhầm). Cận trên 100 trùng cận của đề sách 3.37 (đáp án không trùng, nên không lộ).
- Sửa: đổi id thành `dan-3-37-dem-boi-18` (và `checkIds`); nếu muốn tránh cả cận, dùng "nhỏ hơn 90" hay "nhỏ hơn 110" (đáp án 4 hay 6, sửa `explain`, `tex`, `answer`, `check.expr`).

#### 30. Dòng thêm cho x = −5 ở `explain.tex` của 3.40 không nói đây là x = −5

- Vị trí: `$.exercises[89].explain.tex` (`sbt-3-40`, dòng 3 "(−5) + 5 = 0 ⋮ (−5)"); ảnh `sheet-31.png` phone (cuối khối "Giải thích"). LL-25.
- Nguồn: tr.113 (3.40 đáp án ±1, ±5).
- Vấn đề: dòng nằm sau "x = ±1, ±5", cách một khoảng và không có chữ nào đi kèm; bé không thấy "−5" ở đây là giá trị của x, nên khó hiểu vì sao nó có mặt. `explain.text` không nói gì về x = −5 (mục 20 vòng 6 đề xuất "x = −5: x + 5 = 0, mà 0 chia hết cho −5").
- Sửa: viết dòng thành "x = -5:\ (-5) + 5 = 0 \chiahet (-5)" để có chữ "x = −5" đi trước.

#### 31. Hình gợi ý và hình lời giải 3.35b bỏ bước "còn thiếu" mà lời giải đã viết

- Vị trí: hình `sbt-goi-y-chia-cung-dau-12` (dòng 3 "12 · 30 = 360 / 12 · 1 = 12"), `sbt-3-35b-giai` (dòng 3 "12 · 40 = 480 / 12 · 4 = 48"); `$.exercises[70].explain.text`, `[69].explain.text` ("còn thiếu 528 − 480 = 48 = 12 · 4"). LL-15.
- Nguồn: —
- Vấn đề: lời giải nói rõ 48 là phần còn thiếu sau khi trừ 480, còn hình để "12 · 4 = 48" ngay dưới "12 · 40 = 480" không cho thấy 48 từ đâu ra; ở hình gợi ý, "12 · 1 = 12" cũng không nối với 372 − 360. Hình và chữ không mâu thuẫn, nhưng bé xem hình sau khi đọc chữ sẽ thấy thiếu một bước.
- Sửa: thêm vào hai hình một dòng nhãn nhỏ hoặc một dòng `steps`: "528 − 480 = 48" (và "372 − 360 = 12" ở hình gợi ý), rồi đến dòng "12 · 4 = 48"; chụp lại hai hình.

#### 32. Nhãn dòng 3 của hai hình 3.40 gần nguyên một câu của lời giải sách

- Vị trí: hình `sbt-3-40-giai` và `sbt-goi-y-x-13` (nhãn dòng "5 ⋮ x" và "13 ⋮ x": "x + 5 và x cùng chia hết cho x, nên hiệu cũng vậy"). LL-08.
- Nguồn: tr.113, 3.40 "Do đó x + 5 và x cùng chia hết cho x. Từ đó ta có 5 = (x + 5) − x chia hết cho x."
- Vấn đề: bốn dòng đã theo thứ tự câu quy tắc của bài, không còn chép công thức của sách (mục 15 đạt); riêng nhãn dòng 3 giữ nguyên mệnh đề "x + 5 và x cùng chia hết cho x" của sách. Đây là mệnh đề toán ngắn mà đề ép dùng, nên chỉ ghi Góp ý.
- Sửa: dùng chữ của câu quy tắc trong bài: "x chia hết cho x và x + 5 chia hết cho x, nên hiệu cũng chia hết cho x" (hay "x luôn chia hết cho chính nó, nên hiệu cũng vậy"); áp cho cả hai hình.

### Đã tự tính

Chương trình Node và `tsx` trong thư mục nháp `review2/` (`check.js`, `nb.js`, `dup.js`, `vis.ts`): 64 phép kiểm, 0 sai; 6 so chuỗi "Nhắc lại" và quét dấu cách, 0 lỗi.

| Đối tượng | Đã kiểm | Kết quả |
|---|---|---|
| 8 câu 3.35 (5 câu dẫn, 3 câu sách) | a : b, so `answer`, `check.expr`, `allowNegative` | −17; −69; −147; 13; 44; −4; −15; −20, khớp cả 8 |
| `explain` đổi của `[69]`, `[70]`, `[72]`, `[73]` | từng phép: 12 · 10 = 120, 156 − 120 = 36 = 12 · 3, 12 · 13 = 156; 12 · 40 = 480, 528 − 480 = 48 = 12 · 4, 12 · 44 = 528; 101 · 10 = 1 010, 1 515 − 1 010 = 505 = 101 · 5, 101 · 15 = 1 515; 101 · 2 = 202, 101 · 20 = 2 020 | đúng |
| 3.37 (20 chip) | mỗi chip: khác 0, chia hết cho 11, trong (−50; 100); so `params` i0 đến i19; đủ 13 bội; thứ tự | 20/20 khớp; 13 bội đủ mặt; nhiễu −55, 0, 110 (ranh giới) và −16, 38, −27, 61 (không là bội của 11); không xếp tăng dần |
| Câu dẫn 3.37 mới | bội của 18 trong (0; 100) | 18, 36, 54, 72, 90: 5, khớp `answer`; 108 > 100 |
| Câu dẫn 3.38 mới | x ⋮ 9, −27 < x ≤ 27; thứ tự ô; ngân hàng | −18; −9; 0; 9; 18; 27 khớp `segments`; nhiễu −27, 36 không phải đáp án |
| 3.38 sách | x ⋮ 3, −18 < x ≤ 18 | 12 phần tử khớp tr.113 |
| 3.39 | giá trị 6 lựa chọn | 21, 21, −21, 21, 21, −21; đáp án a, b, d, e khớp tr.113; c, f là nhiễu dấu có `wrong` |
| 3.40 và câu dẫn | x khác 0 trong [−1 000; 1 000] để x + 5, x + 14, x + 13 chia hết cho x; thay 7 lựa chọn; (x + 11) − x | ±1, ±5 (đúng a, b, c, d); 8 số ±1, ±2, ±7, ±14 khớp `answer`; ±1, ±13 (hình gợi ý); 11 |
| Hình `sbt-tom-tat` | bội của 12 trong (−25; 40]; ước dương của 57 | −24, −12, 0, 12, 24, 36; 1, 3, 19, 57 |
| Hình gợi ý 3.35b | 372 : 12; 12 · 30; 372 − 360 | 31; 360; 12 = 12 · 1 (số khác đề, ẩn "= 31") |
| Hình `sbt-nhac-lai-uoc-tich` | ước dương của 38 | 1, 2, 19, 38 (±2 đúng là ước) |
| Sáu câu "Nhắc lại" | so từng chuỗi (hiện U+00A0) với 12 section đầu | trùng nguyên văn cả sáu |
| Dấu cách quanh +, −, ·, :, = trong `explain`, `wrong`, `prompt` của 24 câu | tìm dấu cách thường giữa hai toán hạng | 0 chỗ |
| Số lặp với 12 section đầu | grep bội của 18, 9, 10, 12, x + 14, 27, 30, 14 | bội của 9 (−20; 27] và ước của −14 trùng đáp án (mục 28); còn lại không trùng |
| Thứ tự phép nhân số chia · thương | mọi phép nhân đổi hay thêm | đúng dạng b · q (12 · 44, 101 · 20, 101 · 15, 12 · 13) |

## Vòng 8: bản sửa sau vòng 7 của phần bài tập sách bài tập (Sonnet, chỉ phần đổi)

- Phạm vi: `pnpm content:diff phep-chia-het-uoc-va-boi-cua-mot-so-nguyen --base 24f73a7` và `git diff 24f73a7` của `src/visuals/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/catalog.ts`; soát kỹ phần sửa sau vòng 7 (mục 27 đến 32) và các mục khác của section `phep-chia-het-uoc-va-boi-cua-mot-so-nguyen.section.bai-tap-sach-bai-tap` (recap, `checkIds`, câu dẫn `leadsTo`, hình `sbt-*`). 12 section đầu, id đã khoá, video, media không soát.
- Nguồn đã đọc (mở ảnh): `sbt-p113.png` (lời giải 3.37 gồm 13 số, 3.40 "±1 và ±5"). Diff không đổi đề sách nên không so lại lời đề `sbt-p59.png`; `bookRef` không đổi, dòng "book exercises (9)" của `content:check --stats` vẫn đủ 9 mục.
- Câu dẫn: 9 nhóm vẫn đúng thứ tự (`checkIds[12]` đến `[22]` đều đứng trước câu sách là đích `leadsTo`, vị trí exercise `[78]`, `[82]`, `[88]` đúng); không câu dẫn nào dùng số hay lời đề của câu sách kế tiếp. Số mới (bội của 18 dưới 110; x ⋮ 10, −30 < x ≤ 30; x + 23) không xuất hiện ở 12 section đầu hay ở câu khác của section (grep chuỗi, 0 trùng); 108 và 110 chỉ trùng chữ số rời, không trùng bộ số.
- `content:check`: 0 lỗi, 0 cảnh báo của bài (sau `--approve` và `content:lock`, 128 id)
- Đọc hiểu (Haiku, lượt 5, 9 mục chữ đổi): 5 / 3 / 1 (`.shots/review/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/doc-hieu-bai-tap-sach-5.md`). Tự đọc như bé chậm các mục còn mơ hồ: `[80].explain.text` đúng hai ý rõ ("bỏ −55 và 110 vì ngoài khoảng, bỏ số 0 vì đề cần bội khác 0"), đọc được; `[82].prompt[1]` là khối ký hiệu y hệt sách, ngay dưới đã có câu đọc `prompt[2]` (Haiku "Hiểu rõ"), nên không còn thiếu; `[88]` dùng đúng quy tắc hiệu của bài, cùng khuôn `[87]` và khối "Nhắc lại". Không nâng mức (mục 33).
- Hình: đã đọc ảnh phone `241-s13-28-exercise-sbt-3-40-correct.png`, `223-s13-21-exercise-dan-3-38-boi-10-khoang.png`, `216-s13-19-exercise-sbt-3-37.png`, `239-s13-27-exercise-dan-3-40-dem-x-23-correct.png`, hình riêng `sbt-3-40-giai`, `sbt-goi-y-x-13`, `sbt-goi-y-chia-cung-dau-12`, `sbt-3-35b-giai` (phone): chữ rõ, không chồng, không tràn, không chữ mồ côi; ba dòng của hai hình 3.35b và nhãn hai dòng của hình 3.40 vừa khung; hộp "Giải thích" của `sbt-3-40` có thêm hai dòng tex không bị cắt, nhưng dòng cuối cách dòng trên một khoảng rộng vì dấu ⋮. 20 chip của `sbt-chon-boi-11` xếp 5 hàng đủ trong khung. Biểu tượng "N 2 Issues" ở góc dưới là lớp phủ của chế độ dev, không thuộc bài.
- Kết luận vòng: 0 Nghiêm trọng, 0 Nên sửa, 2 Góp ý. Không chạy `content:hash` (ngoài phạm vi vai). Không có phát hiện Nghiêm trọng nên không đụng `docs/lessons-learned/`.

### Kiểm bản sửa vòng 7

| Mục | Kết quả | Ghi chú |
|---|---|---|
| 27 | Đã sửa đúng | `[80]` chỉ còn lý do ngoài khoảng và lý do số 0; ba nhiễu −16, 38, −27, 61 (không là bội của 11) vẫn nằm trong 20 chip và `params` khớp 20/20 (13 bội −44 đến 99 đủ mặt, i15 = 0 cho −27, i16 = 1 cho 88, i17 = 0 cho 61, i18 và i19 = 1). `[82]` thêm `prompt[2]` "Đọc cả tập hợp: ..." đúng nghĩa của ký hiệu (x ⋮ 10, lớn hơn −30, nhỏ hơn hoặc bằng 30); Haiku "Hiểu rõ" cho khối này. `[87]` giữ câu quy tắc của bài, chấp nhận. Còn hai mục Haiku "mơ hồ" ở `[88]`: Góp ý 33. |
| 28 | Đã sửa đúng | Câu dẫn 3.38 là bội của 10 (đáp án −20; −10; 0; 10; 20; 30, không trùng `ex.dem-boi-9-khoang`); câu dẫn 3.40 là x + 23, đáp án 4 số (±1, ±23), 23 không xuất hiện ở 12 section đầu hay hình `uoc-vi-du`. |
| 29 | Đã sửa đúng | Id `dan-3-37-dem-boi-18` khớp chữ, `checkIds[12]` cập nhật, không còn id `dan-3-37-dem-boi-9`; bội của 18 trong (0; 110) là 18, 36, 54, 72, 90, 108 = 6, số kế 126 > 110, khớp `answer`, `check.expr`, `explain.tex`. |
| 30 | Đã sửa đúng | `explain.tex` của `sbt-3-40` có dòng "x = −5" đứng trước "(−5) + 5 = 0 ⋮ (−5)", nên −5 đọc là giá trị của x. Dòng chưa có chữ nói vì sao: Góp ý 34. |
| 31 | Đã sửa đúng | `sbt-goi-y-chia-cung-dau-12`: "12 · 30 = 360", "372 − 360 = 12", "12 · 1 = 12", dòng ẩn "?" (372 : 12 = 31, số khác đề, không lộ 44); `sbt-3-35b-giai`: "12 · 40 = 480", "528 − 480 = 48", "12 · 4 = 48", khớp `explain` ("còn thiếu 528 − 480 = 48 = 12 · 4"); ba dòng, không tràn. |
| 32 | Đã sửa đúng | Nhãn dòng 3 của `sbt-3-40-giai` và `sbt-goi-y-x-13` là "x chia hết cho x, nên hiệu cũng chia hết cho x" (chữ của câu quy tắc trong bài, không còn mệnh đề "x + 5 và x cùng chia hết cho x" của sách); hai dòng, vừa khung. Hình gợi ý vẫn ẩn đúng dòng cuối "x = ±1, ±13". |

### Nghiêm trọng

Không có.

### Nên sửa

Không có.

### Góp ý

#### 33. Hai mục `[88]` còn "Hiểu mơ hồ" ở lượt đọc hiểu thứ năm (không sai, ghi nhận)

- Vị trí: `$.exercises[88].prompt[0].text` và `$.exercises[88].explain.text` (`dan-3-40-dem-x-23`). LL-25.
- Nguồn: `.shots/review/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/doc-hieu-bai-tap-sach-5.md`.
- Vấn đề: đề "Có bao nhiêu số nguyên x để x + 23 chia hết cho x?" và lời giải dùng đúng quy tắc hiệu của bài, đã học ở section `tong-hieu-chia-het` và nhắc ở khối "Nhắc lại cho bài 3.40"; lời giải 3 câu, từ đã dạy, phép tính (x + 23) − x = 23 rõ. Đã quá 3 lượt; tự đọc hiểu được nên không nâng mức.
- Sửa: không bắt buộc; nếu muốn, thêm vào đầu lời giải "Số x khác 0 luôn chia hết cho chính nó." như `[87]`, giữ tối đa 3 câu.

#### 34. Dòng kiểm x = −5 ở lời giải 3.40 không có chữ nói vì sao

- Vị trí: `$.exercises[89].explain.tex` (`sbt-3-40`, hai dòng cuối "x = −5", "(−5) + 5 = 0 ⋮ (−5)"); ảnh `241-s13-28-exercise-sbt-3-40-correct.png`. LL-25.
- Nguồn: tr.113 (3.40 đáp án ±1, ±5).
- Vấn đề: hai dòng nằm sau "x = ±1, ±5" và `explain.text` không nhắc x = −5; bé chậm thấy −5 là một giá trị của x nhưng không biết dòng này để làm gì (cho thấy x + 5 = 0 vẫn chia hết cho −5, nên −5 không bị loại). Không sai.
- Sửa: thêm vào cuối `explain.text` một câu: "Với x = −5 thì x + 5 = 0, và 0 chia hết cho −5." (còn 4 câu thì gộp câu "Vậy x là ước của 5 ..." cho đủ 3 câu).

### Đã tự tính

Chương trình Node trong thư mục nháp `review3/` (kiểm trực tiếp từ `lesson.json` và `catalog.ts`): 48 phép kiểm, 0 sai.

| Đối tượng | Đã kiểm | Kết quả |
|---|---|---|
| 3.37 (20 chip, `params` i0 đến i19) | mỗi chip: khác 0, chia hết cho 11, trong (−50; 100) so với `params` | 20/20 khớp; 13 bội: −44, −33, −22, −11, 11, 22, 33, 44, 55, 66, 77, 88, 99 (khớp tr.113); nhiễu 7: −16, 110, −55, 0, 38, −27, 61 |
| Câu dẫn 3.37 mới | bội của 18 trong (0; 110) | 18, 36, 54, 72, 90, 108: 6, khớp `answer`; 126 > 110 |
| Câu dẫn 3.38 mới | x ⋮ 10, −30 < x ≤ 30; `segments`, `bank` | −20; −10; 0; 10; 20; 30 (6 ô) khớp; nhiễu −30, 40 không phải đáp án |
| Câu dẫn 3.40 mới | x khác 0 trong [−1 000; 1 000] để x + 23 chia hết cho x | −23, −1, 1, 23 = 4, khớp |
| 3.40 | x khác 0 để x + 5 chia hết cho x; thay 7 lựa chọn | −5, −1, 1, 5 (đúng a, b, c, d); (−5) + 5 = 0 chia hết cho −5 |
| Hình 3.35b | 372 − 360; 372 : 12; 12 · 1; 528 − 480; 12 · 4; 12 · 44 | 12; 31; 12; 48; 48; 528 |
| `explain` đổi của `[69]`, `[70]`, `[72]`, `[73]`, `[87]` | từng phép (đã kiểm ở vòng 7; vòng này chỉ đọc lại `[87]`: (x + 11) − x = 11) | đúng |
| Số lặp | tìm bội của 10, x ⋮ 10, x + 23, bội của 18, −30 < x, ±23 trong 12 section đầu, card và exercise ngoài section cuối | 0 trùng |
| Vị trí câu dẫn | `checkIds[12]` đến `[22]` so với exercise `[78]` đến `[88]` và `leadsTo` | đúng thứ tự, đúng đích |

## Tổng kết phần bài tập sách bài tập (sau vòng 8)

- Kết luận: Hết lỗi Nghiêm trọng (1 ở vòng 6, 0 ở vòng 7 và 8). Đã chạy `pnpm content:hash phep-chia-het-uoc-va-boi-cua-mot-so-nguyen --approve` (đặt `published`) và `pnpm content:lock phep-chia-het-uoc-va-boi-cua-mot-so-nguyen` (thêm 25 id: 24 exercise và section cuối); `content:check` 0 lỗi, 0 cảnh báo. `lesson:walk` (cây tạm cổng 3670, bản đã duyệt): 0 FAIL, 0 cảnh báo; đã đọc contact sheet điện thoại của bốn khối "Nhắc lại" và của mọi câu section cuối.
- Sách không in lời giải 3.35: đáp án do bài tự tính (−147; 44; −20), reviewer vòng 6, 7, 8 tính lại bằng chương trình; ghi cho chủ dự án.
- Quyết định thiết kế đã được reviewer chấp nhận: bài 3.36 "Tìm các ước của 21 và −66." tách theo hai số thành `SBT 3.36a` (21) và `SBT 3.36b` (−66), cả hai giữ nguyên câu đề, đáp án nhập bằng dạng viết gọn ± như lời giải tr.113, điền ô theo thứ tự từ bé đến lớn; 3.37 là câu chạm chọn 20 số (13 bội của 11 và 7 nhiễu); 3.38 là câu điền ô xếp từ bé đến lớn, đề viết bằng khối `note` có ký hiệu ⋮ (TeX bị chồng dấu ở chữ "và"); 3.39 và 3.40 là câu chọn nhiều đáp án.
- Đã sửa sau vòng 6: Nghiêm trọng 15 (hình lời giải và hình gợi ý 3.40 viết theo thứ tự câu quy tắc của bài, không còn chuỗi của lời giải sách); Nên sửa 16 (20 chip, có thêm bốn số không là bội của 11, không xếp tăng dần), 17 (câu dẫn `dan-3-40-hieu-x-11` nói thẳng quy tắc), 18 (hình nhắc lại "±2"), 19 (bốn lời giải viết theo khuôn "còn thiếu"); Góp ý 20, 21, 22 (U+00A0), 23, 26.
- Đã sửa sau vòng 7: Nên sửa 27 (câu đọc cả tập hợp ở câu dẫn 3.38, câu cuối của `sbt-3-37`) và Góp ý 28 đến 32 (đổi số hai câu dẫn, đổi id, dòng x = −5, thêm bước "còn thiếu" vào hai hình 3.35b, nhãn hai hình 3.40). Sau vòng 8, lời giải tex của câu dẫn 3.38 xuống hai dòng vì dòng đơn bị cắt ở điện thoại (đã chụp lại, `lesson:walk` 0 FAIL).
- Đọc hiểu (Haiku, 5 lượt trên chữ mới ngoài đề sách; số đếm từ tệp kết quả, hai reviewer đã chép số Haiku tự báo và được sửa lại ở đây): lượt 1: 28 / 35 / 3 trên 66 mục (`doc-hieu-bai-tap-sach-1.md`); lượt 2: 25 / 10 / 0 trên 35 mục viết lại; lượt 3: 1 / 8 / 1 trên 10 mục; lượt 4: 10 / 3 / 0 trên 13 mục chữ đổi; lượt 5: 5 / 3 / 1 trên 9 mục chữ đổi. Haiku chấm mơ hồ cả từ của bài ("khác dấu", "ước dương") khi đọc mục rời khỏi màn; thêm vế giải nghĩa ngay trong câu giảm từ 35 xuống 10 mục.
- Còn lại, không chặn duyệt: Nên sửa 27 (các mục `[80]`, `[87]` còn "Hiểu mơ hồ" sau lượt 5; reviewer tự đọc thì hiểu được), Góp ý 20, 21, 22, 23, 26 đã làm, còn Góp ý 24 và 25 chưa làm (24: recap chỉ tóm tìm ước và bội trong khoảng; 25: hai khối "Nhắc lại" của 3.36 và 3.37 phải cuộn dọc trên điện thoại, việc của người làm app), Góp ý 33 (hai mục `[88]` còn mơ hồ ở lượt 5) và 34 (dòng x = −5 của lời giải 3.40 chưa có chữ nói vì sao).
- Tổng ba vòng của phần này: Nghiêm trọng 1 (vòng 6), Nên sửa 5 (4 + 1), Góp ý 14 (7 + 5 + 2).
