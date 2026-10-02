# Review: Phép chia hết. Ước và bội của một số nguyên (`phep-chia-het-uoc-va-boi-cua-mot-so-nguyen`)

- Bài: `content/math/kntt/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/lesson.json`
- Vòng: 3 - chỉ phần đổi (Sonnet), so với bản vòng 2
- Nguồn đã đọc: `sources/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/` - sbt-p58, sbt-p59, sbt-p113
- `content:check`: 0 lỗi, 1 cảnh báo của bài (103 id chưa có trong `ids.lock.json`, đúng với bài nháp)
- Lịch sử: Vòng 1: 11 Nghiêm trọng; vòng 2: 6 Nghiêm trọng, 17 Nên sửa, 16 Góp ý; vòng 3: 0 Nghiêm trọng, 13 Nên sửa, 12 Góp ý
- Đọc hiểu (Haiku): lượt 1 (bản trước vòng 2): 85 / 276 / 228 (quá nhiễu, bỏ); lượt 2 toàn bài trên bản hiện tại: 235 / 3 / 0; lượt 3 trên 3 mục đã viết lại: xem điều phối
- `lesson:walk`: 0 FAIL, 0 cảnh báo (lần chạy gần nhất, trước hai commit sửa chữ `82bef98`, `3517f40`), ảnh trong `.shots/walk/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/`
- Kết luận: 0 Nghiêm trọng, chờ approve (điều phối chạy `--approve` sau khi đọc hiểu xong)
- Bản đã review: `2274ca1c3673bb4e34b9a69844f4b014fb8adbb1963e22e31ee724e8fe9d6ad8` (`pnpm content:diff` so với bản này)

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

### 1. Câu quy tắc và tên section `tim-x` vẫn đọc được hai cách, "số đó" mơ hồ hơn (LL-10, LL-20)

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

### 4. Hình quy tắc `boi-4-vi-du` không có "…", đọc như danh sách đóng (LL-17)

- Vị trí: hình `boi-4-vi-du` (`catalog.ts`; màn quy tắc `$.sections[6].blocks[1]` và recap `$.cards[6].recap`)
- Nguồn: lời giải 3.37 tr.113, `sbt-p113.png`
- Vấn đề: câu chữ đã có "cứ thế tiếp", nhưng hình chỉ liệt kê 4, 8, 12, −4, −8, −12, 0 (đã xem ảnh iPad và phone). Vòng 2 đã yêu cầu hàng `\ldots`; bản sửa thêm hàng 12 mà không thêm "…".
- Sửa: thêm `\ldots` vào hai hàng: "4, 8, 12, …" và "−4, −8, −12, …".

### 5. `explain` của `chon-boi-7-khoang` liệt kê bội như bắt đầu từ −14 (LL-17)

- Vị trí: `$.exercises[41].explain.text` (`ex.chon-boi-7-khoang`)
- Nguồn: —
- Vấn đề: "Các bội của 7 là −14, −7, 0, 7, 14, 21 và cứ thế tiếp." Đây là nửa còn lại của Nghiêm trọng 3 vòng 2 (cách viết chốt là "0, ±7, ±14, ..."); danh sách mở một đầu, bé hiểu bội của 7 bắt đầu từ −14.
- Sửa: "Các bội của 7 là 0, ±7, ±14, ±21 và cứ thế tiếp." (cùng cách viết với `ex.xep-boi-6-khoang`).

### 6. `explain` của `dien-uoc-boi` có "Số chia hết cho 8" đọc thành "số chia" (LL-10, LL-25)

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

### 11. Màn `tim-x` còn hai trong ba chỗ thiếu bậc (LL-16, tiếp Nên sửa 14 vòng 2)

- Vị trí: `$.sections[11].blocks[0].children[0].text`; `$.sections[11].blocks[2].children[0].text`; hình `tim-x-vi-du`
- Nguồn: —
- Vấn đề: hàng x = −3 đã thêm vào `tim-x-thu`, nhưng note vẫn kể chỉ "x = 1, x = 3 và x = −1" và không nói điều cần thấy (các số làm được đều là ước của 3). Chiều ngược của quy tắc ("x là ước thì x + 3 chia hết cho x") vẫn chưa được lập luận, trong khi quy tắc và `explain` của `ex.chon-so-can-tim-7` dùng "khi" như hai chiều.
- Sửa: note thử: "Các số làm được là 1, 3, −1, −3, đều là ước của 3. Số 2 không là ước của 3 nên không làm được." Thêm vào note kế: "Ngược lại, x là ước của 3 thì x và 3 cùng chia hết cho x, nên x + 3 chia hết cho x."

### 12. `overview` bỏ mất ước chung, phân tích thành tích, tổng và hiệu (LL-20, LL-16)

- Vị trí: `$.overview.summary`, `$.overview.goals[2]`
- Nguồn: —
- Vấn đề: viết lại cho dễ đọc làm mất "ước chung" khỏi cả `summary` lẫn `goals`; từ vòng 2 đã thiếu phân tích thành tích. Bốn trong mười hai section (`uoc-chung`, `phan-tich-thanh-tich`, `tong-hieu-chia-het`, kể cả nửa đầu của `tim-x`) không có trong tổng quan, mà "ước chung" là kiến thức cần nhớ 2 của sách.
- Sửa: thêm vào `summary` một câu: "Bạn còn tìm ước chung của hai số, viết một số thành tích hai số nguyên, và dùng tổng, hiệu cùng chia hết." Giữ câu ngắn như bản đã qua đọc hiểu.

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

## Báo nhầm

Không có.

## Vòng 2: đã sửa

Sáu Nghiêm trọng đã đạt (xem đầu tệp). Nên sửa vòng 2 đã đạt: 1 (nhãn `bon-phep-chia`), 2 (hai câu kho ôn `suy-ra-thuong`), 3 (mẹo thêm "dùng cho phép chia hết"), 4 (`kiem-tra-42-chia-6` hỏi cả lý do), 5 (hai câu điền, riêng `ex.dien-uoc-x-15` lặp lỗi, Nên sửa 7), 10 (`dien-boi-3` thành `dien-boi-3-nhan` đúng card), 11 (mẹo bỏ dấu đổi số), 12 (`dem-uoc-cua-16`), 17 (NBSP), cùng các Góp ý 7, 10, 12, 15; Nên sửa 6, 9, 13, 14, 15, 16 và Góp ý 13 xử lý một phần hay chưa, tính lại ở danh sách trên.
