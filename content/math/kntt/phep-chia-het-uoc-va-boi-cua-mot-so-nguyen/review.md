# Review: Phép chia hết. Ước và bội của một số nguyên (`phep-chia-het-uoc-va-boi-cua-mot-so-nguyen`)

- Bài: `content/math/kntt/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/` - sbt-p58, sbt-p59, sbt-p113
- `content:check`: 0 lỗi, 1 cảnh báo của bài (103 id chưa có trong `ids.lock.json`, đúng với bài nháp)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi vòng toàn bài hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL (theo ba reviewer nhóm), ảnh trong `.shots/walk/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/`
- Kết luận: Chưa đạt: còn 6 lỗi Nghiêm trọng (`pnpm content:hash phep-chia-het-uoc-va-boi-cua-mot-so-nguyen --root content --mark` đã chạy)
- Bản đã review: `bc9df83fb13836553c74f706e3e6eb2fad352e371c51a333d19772684d8c72e2` (`pnpm content:diff` so với bản này)

Bản review: `lesson.json` và `catalog.ts` của commit `f87e1e3`. Lúc tổng hợp, `catalog.ts` trong cây làm việc đã có sửa chưa commit (nhãn `bon-phep-chia`, hàng "±3" của `uoc-vi-du`, `boi-4-vi-du`, hàng khoảng của `boi-khoang-vi-du`, "ước chung dương", chip "5 · 5", số của `chon-tong-6`, hàng x = −3 của `tim-x-thu`); các sửa đó chưa được review. Riêng `chon-tong-6` đã đổi sang −24 trong khi `explain` của `ex.chon-tong-6-chips` vẫn nói −18: sửa cả hai cùng lúc.

Đã đối chiếu mọi câu quy tắc, recap, caption với Bài 8 `quan-he-chia-het-va-tinh-chat`, Bài 11 `uoc-chung-uoc-chung-lon-nhat` (đã xuất bản) và Bài 16 `phep-nhan-so-nguyen`. Câu quy tắc dấu thương khớp khuôn Bài 16; câu ước, bội khớp Bài 8; mọi recap section và card lặp đúng câu quy tắc (trừ Góp ý 8). Mâu thuẫn còn lại: câu tìm bội lệch Bài 8 (Nghiêm trọng 2), định nghĩa và cách tìm ước chung lệch Bài 11 (Góp ý 16).

## Nghiêm trọng

### 1. `explain` gọi lựa chọn theo vị trí "Hai phép đầu" (LL-26)

- Vị trí: `$.exercises[23].explain.text` (`ex.chon-thuong-nho-nhat`, câu kho ôn card `suy-ra-thuong`)
- Nguồn: —
- Vấn đề: "Hai phép đầu có hai số khác dấu nên thương âm…". App xáo lựa chọn, nên phần lớn lần làm "hai phép đầu" có cả (−15) : (−5), và câu bảo phép cùng dấu đó cho thương âm. Câu mới thêm ở vòng sửa (thay `xep-thuong`), tức bản sửa sinh lỗi (LL-20).
- Sửa: gọi bằng nội dung: "Phép 12 : (−2) và phép (−20) : 5 có hai số khác dấu nên thương âm: −6 và −4. Phép (−15) : (−5) có hai số cùng dấu nên thương là 3. Trong ba thương, −6 nhỏ nhất." (đổi số (−15) : (−5) theo Nên sửa 6.)

### 2. Quy tắc tìm bội dừng ở "1, 2, 3", hình quy tắc chỉ nhân với 1, 2, không có "…" (LL-17)

- Vị trí: `$.sections[6].blocks[1].children[0].text`, `$.sections[6].recap.caption`, `$.cards[6].recap.caption` (`tim-boi`); hình `boi-4-vi-du` (`catalog.ts`, màn quy tắc và recap); `$.sections[6].blocks[2].children[0].text` (cùng làm)
- Nguồn: tr.58 kiến thức cần nhớ 3, lời giải 3.37 tr.113 (nhân 11 lần lượt với 1; 2; …; 9), `sbt-p58.png`, `sbt-p113.png`
- Vấn đề: "nhân số đó với 1, 2, 3 rồi viết thêm số đối của tích" là danh sách đóng; câu "Sửa" vòng 1 và câu quy tắc đã xuất bản của Bài 8 đều có "lần lượt … và cứ thế tiếp", bản sửa bỏ mất (LL-20). Hình chỉ có 4 · 1, 4 · 2, −4, −8, 0, không có `\ldots`, nên recap đọc thành "bội của 4 là 4, 8, −4, −8, 0". Làm đúng từng chữ thì sai ở cùng làm `chon-boi-5-cung-lam` (20), `ex.chon-boi-cua-am3` (−12), `ex.chon-boi-6-chips` (24), `ex.boi-7-lon-nhat-nho-hon-30` (ra 21).
- Sửa: "Muốn tìm các bội của số nguyên khác 0, nhân số đó lần lượt với 1, 2, 3 và cứ thế tiếp, rồi viết thêm số đối của các tích. Số 0 cũng là bội của số đó." (recap section, card lặp nguyên văn). Hình: thêm hàng `4 \cdot 3 = 12`, hàng bội dương `4,\ 8,\ 12,\ \ldots`, hàng bội âm `-4,\ -8,\ -12,\ \ldots`. Cùng làm: "Nhân 5 lần lượt với 1, 2, 3, 4 và cứ thế tiếp giúp bạn nhận ra các bội."

### 3. Lời giải thích liệt kê bội như một danh sách đủ (LL-17)

- Vị trí: `$.exercises[44].explain.text` (`ex.boi-7-lon-nhat-nho-hon-30`); cùng kiểu nhẹ hơn ở `$.exercises[41].explain.text` (`ex.chon-boi-4-khoang`)
- Nguồn: —
- Vấn đề: "Các bội dương của 7 là 7, 14, 21, 28, 35." là câu sai: bội dương của 7 không dừng ở 35. Cùng kiểu câu điền `dien-boi-3` đã tính Nghiêm trọng ở vòng 1, và cộng với Nghiêm trọng 2 thì bé nhớ "bội chỉ có vài số". `chon-boi-4-khoang` viết "Các bội của 4 là −8, −4, 0, 4, 8, 12 và cứ thế tiếp", đọc như bội của 4 bắt đầu từ −8. Reviewer nhóm để Nên sửa; tổng hợp nâng lên vì checklist xếp giải thích nói sai kiến thức là Nghiêm trọng.
- Sửa: "Các bội dương của 7 là 7, 14, 21, 28, 35 và cứ thế tiếp. Trong chúng, 28 là số lớn nhất nhỏ hơn 30." `chon-boi-4-khoang`: "Các bội của 4 là 0, ±4, ±8, ±12 và cứ thế tiếp." (theo cách viết chốt ở Nghiêm trọng 4).

### 4. Kí hiệu "±" dùng ở màn quy tắc, recap và năm lời giải mà bài không dạy (LL-09)

- Vị trí: hình `uoc-vi-du` (màn quy tắc và recap của `tim-uoc`), `uoc-chung-vi-du`, `tim-x-3`, `tim-x-vi-du` (`catalog.ts`); `$.exercises[30].explain`, `$.exercises[31].explain.text`, `$.exercises[34].explain.text`, `$.exercises[38].explain.text`, `$.exercises[42].explain.text`
- Nguồn: lời giải 3.36 tr.113 ("viết gọn là ±1; ±3; …"), `sbt-p113.png`
- Vấn đề: hình quy tắc `tim-uoc` chỉ gồm hai hàng `±1, ±3, ±9` và `±1, ±2, ±7, ±14`. Chữ "viết gọn bằng dấu ±" chỉ nằm ở `label`, mà `label` là `aria-label` của `<figure>` (`src/visuals/shared/formula-rows.tsx`), không hiện trên màn. Không note nào nói ±3 là "3 và −3", không bài nào trước dùng "±". Ví dụ duy nhất của câu quy tắc và recap bé ôn viết bằng kí hiệu bé chưa đọc được; bé đọc ±1 thành "cộng 1" thì sót đúng các ước âm mà section dạy. LL-09 đã chốt: kí hiệu lấy từ lời giải sách phải có câu dạy cách đọc trước lần dùng đầu.
- Sửa: thêm vào note `$.sections[5].blocks[0]` (sau hình `uoc-6`): "Ta viết gọn 1 và −1 là ±1, đọc là "cộng trừ 1"."; hình `uoc-vi-du` có hàng nhìn thấy được "±3 là hai số 3 và −3". Hoặc bỏ "±", viết đủ hai số ở mọi hình và `explain`.

### 5. Câu kiểm tra `chon-uoc-cua-am21` dùng số 21 của bài 3.36 và `tex` là đúng dòng lời giải (LL-08)

- Vị trí: `$.exercises[30]` (`ex.chon-uoc-cua-am21`), `explain.text`, `explain.tex`
- Nguồn: bài 3.36 tr.59 ("Tìm các ước của 21 và −66"), lời giải tr.113 ("viết gọn là ±1; ±3; ±7; ±21"), `sbt-p59.png`, `sbt-p113.png`
- Vấn đề: số −21 lấy từ câu "Sửa" vòng 1 (Nên sửa 8: "−14 hay −21"), nhưng 21 là số của chính bài 3.36, và `explain` "Các ước của −21 giống các ước của 21: ±1, ±3, ±7, ±21" cùng `tex` là nguyên dòng lời giải. Vòng 1 đã đổi màn `chon-tich-21-cung-lam` khỏi số 21 của 3.39 vì cùng lý do.
- Sửa: đổi sang số chưa dùng trong bài và trong sách, vd −22 (lựa chọn −11, −2, 22 đúng, −4 sai) hay −35; tránh 6, 8, 9, 10, 12, 14, 15, 18, 21, 66. Viết lại `explain`, `tex`, `wrong` theo số mới và theo cách viết của Nghiêm trọng 4.

### 6. Lý do sai và gợi ý cùng làm dạy "một số không chia hết thì tổng không chia hết" (LL-17)

- Vị trí: `$.exercises[58].explain.wrong[0]`, `$.exercises[58].explain.wrong[1]`, `$.exercises[58].explain.text` (`ex.chon-tong-chia-het-9`); `$.exercises[57].explain.text` (`ex.chon-tong-6-chips`: "Số 10 và 7 không chia hết cho 6."); `$.sections[10].blocks[2].children[0].text` (cùng làm `chon-tong-4-cung-lam`)
- Nguồn: —
- Vấn đề: "20 không chia hết cho 9, nên kết quả −16 không chia hết cho 9." lấy một số không chia hết làm nguyên nhân; bé nhớ "một số hạng không chia hết thì tổng không chia hết", sai với 20 + 7 = 27. Vòng 1 (Nên sửa 18) đã nêu câu này cùng `chon-tong-chia-het-5`; bản sửa chỉ sửa câu 5. Bản sửa còn thêm vào cùng làm "Xét xem hai số trong mỗi phép tính có chia hết cho 4 không", dẫn bé tới cùng suy luận, trong khi quy tắc section chỉ nói chiều "cả hai cùng chia hết" (chiều "đúng một số không chia hết" là quy tắc Bài 8 mà bài không nhắc). Mức cuối: Nghiêm trọng (nhóm 3 đề nghị, tổng hợp giữ): checklist xếp lý do `wrong` nói sai là Nghiêm trọng, LL-17 đã tính Nghiêm trọng cho đúng kiểu này ở `on-tap-chuong-2` vòng 1, và đây là lần sửa thứ hai vẫn sót.
- Sửa: hai `wrong`: "(−36) + 20 = −16, mà −16 không chia hết cho 9.", "45 − 7 = 38, mà 38 không chia hết cho 9." `explain.text` của hai câu: thay "Số 20 và 7 không chia hết cho 9." bằng "Còn −16 và 38 không chia hết cho 9." (tương tự cho câu 6). Note cùng làm: "Tính từng phép, hoặc xem hai số có cùng chia hết cho 4 không." Tìm cả bài và `catalog.ts` mọi câu "… không chia hết …, nên …" có kết luận về tổng, hiệu.

## Nên sửa

### 1. Hình quy tắc và recap `bon-phep-chia` không chỉ ra việc đổi dấu (LL-15)

- Vị trí: hình `bon-phep-chia` (`catalog.ts`; màn `$.sections[3].blocks[0]`, `$.sections[3].recap`, `$.cards[3].recap`)
- Nguồn: tr.58–59 ví dụ 1, `sbt-p58.png`, `sbt-p59.png`
- Vấn đề: câu quy tắc nói "đổi dấu một trong hai số… đổi dấu cả hai số", nhãn bốn dòng vẫn "cùng dấu +", "cùng dấu −", "khác dấu", "khác dấu", tức lặp quy tắc section 2, 3.
- Sửa: nhãn theo phép gốc 72 : 8 = 9: "đổi dấu số bị chia", "đổi dấu số chia", "đổi dấu cả hai số".

### 2. Hai trong bốn câu kho ôn của card `suy-ra-thuong` không ôn ý của card (LL-06)

- Vị trí: `$.exercises[21]` (`ex.tinh-81-chia-am9`), `$.exercises[23]` (`ex.chon-thuong-nho-nhat`)
- Nguồn: —
- Vấn đề: một câu là phép chia khác dấu không cho phép gốc, một câu so sánh thương âm; card ôn quy tắc "đổi dấu".
- Sửa: chuyển hai câu sang card hợp (`chia-khac-dau`), hoặc viết lại theo ý đổi dấu, vd "Biết 81 : 9 = 9. Tính (−81) : (−9)."

### 3. Mẹo "Kiểm tra phép chia" thiếu điều kiện chia hết và số chia khác 0 (LL-24)

- Vị trí: `$.sections[3].blocks[1]` (`tip.kiem-tra-bang-nhan`)
- Nguồn: —
- Vấn đề: "nếu không thì bạn đã sai số hoặc sai dấu" chỉ đúng khi phép chia là chia hết; với (−7) : 2, (−16) : 6 của chính bài, mọi thương đoán đều lệch mà kết luận đúng là "không chia hết". Với 0 : 0 = 5, phép nhân khớp nên mẹo bảo "đúng". Bảng thử 8 đầu vào ở `.shots/review/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/vong2-nhom-1.md`. Không câu tính thương nào của bài ra sai nên giữ Nên sửa.
- Sửa: "Nhân số chia (khác 0) với thương. Được đúng số bị chia thì phép chia đúng. Nếu không, bạn đã sai số hoặc sai dấu; thử mọi số mà không số nào được thì phép chia đó không chia hết."

### 4. Câu `kiem-tra-42-chia-6` hỏi "đúng hay sai" mà có hai lựa chọn mở bằng "Sai" (LL-10)

- Vị trí: `$.exercises[19].prompt[0]`, `$.exercises[19].options` (`ex.kiem-tra-42-chia-6`)
- Nguồn: —
- Vấn đề: nhiễu mới "Sai, vì (−42) : 6 = −6" trả lời đúng câu hỏi "đúng hay sai?", chỉ sai lý do; đề không nói phải chọn cả lý do.
- Sửa: "Nam tính (−42) : 6 = 7. Dùng phép nhân để kiểm tra. Chọn câu có kết luận và lý do đều đúng."

### 5. Nấc 1 của hai câu điền chỉ tô dòng hướng dẫn (LL-02)

- Vị trí: `$.exercises[4].hints.highlight` (`ex.dien-thuong-30`), `$.exercises[17].hints.highlight` (`ex.dien-thuong-khac-dau`)
- Nguồn: —
- Vấn đề: dữ kiện nằm trong `segments`, `prompt` chỉ có "Chọn số điền vào chỗ trống.", không có `hintVisualId`; cùng kiểu Nên sửa 23 vòng 1 ở ba câu khác.
- Sửa: đưa phép chia lên `prompt` (note hay khối `formula`) rồi tô khối đó.

### 6. Câu ôn, mẹo và cùng làm lặp số của hình quy tắc, recap, câu luyện (LL-07)

- Vị trí: `$.exercises[23].options` ((−15) : (−5), dòng đầu recap `cung-dau-vi-du`); `$.sections[3].blocks[1].tex` ((−72) : 8 = −9, dòng ba của `bon-phep-chia` ngay màn trước); hình `chon-thuong-am5-cung-lam` (chip (−45) : (−9) là đề `ex.tinh-cung-dau-45`)
- Nguồn: —
- Vấn đề: bé làm đúng nhờ nhớ số trên màn.
- Sửa: đổi sang số chưa dùng (tìm trong cả `lesson.json` và `catalog.ts`), vd (−64) : (−8), mẹo (−60) : 5 = −12, cùng làm 70 : 7 = 10.

### 7. Section `suy-ra-thuong` không có ví dụ đời sống (LL-16)

- Vị trí: `$.sections[3]`
- Nguồn: —
- Vấn đề: ba section trước mở bằng tình huống; section này vào thẳng câu quy tắc.
- Sửa: note mở đầu dùng lại tình huống nợ: "Bốn bạn chia đều khoản nợ 20 nghìn: (−20) : 4 = −5. Chia đều 20 nghìn tiền thưởng thì 20 : 4 = 5: đổi dấu số bị chia, thương đổi dấu."

### 8. Hình quy tắc bội trong khoảng không cho thấy bội của số nào, khoảng nào (LL-15)

- Vị trí: hình `boi-khoang-vi-du` (màn quy tắc và recap `boi-trong-khoang`)
- Nguồn: —
- Vấn đề: "bội của 3, lớn hơn −10 và nhỏ hơn 10" chỉ ở `label` (không hiện); hình cũng bỏ bước "liệt kê rồi giữ" của câu quy tắc.
- Sửa: hàng đầu nhìn thấy được nêu số và khoảng; một hàng cho thấy 12, −12 bị bỏ vì ngoài khoảng.

### 9. Bội của 4 lặp ở màn quy tắc, ví dụ đời sống, hai câu kiểm tra và câu ôn (LL-07)

- Vị trí: hình `boi-4-vi-du` rồi `$.exercises[36]` (`ex.chon-boi-cua-4`, −8); `thang-may-boi-4` rồi `$.exercises[41]` (`ex.chon-boi-4-khoang`, 8 và −4); `$.exercises[43]` (`ex.dem-boi-4-khoang`)
- Nguồn: —
- Vấn đề: câu kiểm tra hỏi lại số vừa in trên màn trước; câu ôn là bội của 4 lần thứ năm.
- Sửa: `chon-boi-cua-4` sang bội của 9; `chon-boi-4-khoang` sang bội của 5 với khoảng khác màn cùng làm; hoặc đổi số ví dụ thang máy.

### 10. Câu ôn `dien-boi-3` gần trùng recap `boi-khoang-vi-du` và gắn card section trước (LL-07)

- Vị trí: `$.exercises[39]` (`ex.dien-boi-3`, `cardIds` `card.tim-boi`)
- Nguồn: —
- Vấn đề: sáu số đầu của hàng recap (cùng số 3, cùng cận −10); câu hỏi bội trong khoảng mà gắn card `tim-boi`.
- Sửa: đổi số (vd bội của 7 lớn hơn −15 và nhỏ hơn 10) và chuyển sang `card.boi-trong-khoang`; hoặc bỏ khoảng ("Số nào là bội của −3?").

### 11. Ví dụ của mẹo "Xét chia hết khi có số âm" là lựa chọn đúng của câu ôn (LL-07)

- Vị trí: `$.sections[4].blocks[2].tex` (`tip.bo-dau-xet-chia-het`), `$.exercises[28]` (`ex.chon-chia-het-bo-dau`)
- Nguồn: —
- Vấn đề: `(-35) \chiahet 7` có ở cả mẹo và câu ôn cùng card; câu ôn dùng −35 cho cả bốn lựa chọn.
- Sửa: đổi số câu ôn (vd −28 với 7, −4 đúng; −6, 3 sai), sửa `explain`, `wrong`.

### 12. Câu kiểm tra `dem-uoc-cua-12` có đáp số bằng số trong đề (LL-14)

- Vị trí: `$.exercises[29]` (`ex.dem-uoc-cua-12`)
- Nguồn: —
- Vấn đề: đáp 12, gõ lại số của đề cũng đúng; câu luyện liền trước vừa cho chọn ước của 12.
- Sửa: số có số ước khác chính nó và chưa dùng, vd 20 (12 ước) hay 16 (10 ước, thử số chính phương).

### 13. Câu quy tắc và tên section `tim-x` có hai cách đọc (LL-10)

- Vị trí: `$.sections[11].blocks[2].children[0].text`, `$.sections[11].recap.caption`, `$.cards[11].recap.caption`, `$.sections[11].title`
- Nguồn: lời giải 3.40 tr.113, `sbt-p113.png`
- Vấn đề: "x cộng thêm một số chia hết cho x" đọc được thành "x cộng với (một số chia hết cho x)"; "số đó" phải dò ngược.
- Sửa: "Tổng của x và một số chia hết cho x khi x là ước của số cộng thêm. Mọi ước của số cộng thêm đều làm được." (recap lặp nguyên văn); tên section "Tìm x khi tổng của x và một số chia hết cho x".

### 14. Màn `tim-x` còn thiếu bậc cho bé học chậm (LL-16; tiếp Nên sửa 15, 16 vòng 1)

- Vị trí: `$.sections[11].blocks[0].children[0].text`, hình `tim-x-thu`; `$.sections[11].blocks[1].children[0].text`, hình `tim-x-3`, `tim-x-vi-du`
- Nguồn: —
- Vấn đề: (a) màn thử không nói điều cần thấy (1, 3, −1 là ước của 3, còn 2 thì không); (b) `tim-x-3` kết luận x = −3 mà màn thử chưa thử −3; (c) quy tắc nói "chính là" (hai chiều) mà bài chỉ lập luận một chiều, nhãn `tim-x-vi-du` "x là một ước của 6" cũng một chiều.
- Sửa: (a) "Thay x bằng vài số rồi xem x + 3 có chia hết cho x không. Các số làm được là 1, 3, −1, −3, đều là ước của 3. Số 2 không là ước của 3 nên không làm được." (b) hàng x = −3 trong `tim-x-thu`. (c) thêm "Ngược lại, x là ước của 3 thì x và 3 cùng chia hết cho x, nên x + 3 chia hết cho x."; nhãn "x + 6 chia hết cho x khi x là ước của 6".

### 15. Chip nhiễu không ứng lỗi nào ở hai màn chips (LL-20)

- Vị trí: hình `chon-tich-35-cung-lam` (chip "1 · 12", màn `$.sections[9].blocks[2]`), `chon-tich-14` (chip "7 · 7", `ex.chon-tich-14-chips`)
- Nguồn: —
- Vấn đề: đổi 21 sang 35 nhưng giữ chip "1 · 12" của bản cũ; "7 · 7" = 49 chưa sửa từ Góp ý 18 vòng 1. Bé loại ngay mà không cần nghĩ về dấu.
- Sửa: nhiễu sai dấu, vd "(−1) · 35", "(−2) · 7"; tính lại `wants`, `done`, `explain` của `ex.chon-tich-14-chips` (đang nhắc "7 · 7 = 49").

### 16. Câu luyện `chon-tong-6-chips` lặp số của hình quy tắc ngay trước (LL-07)

- Vị trí: `$.exercises[57]` (`ex.chon-tong-6-chips`), hình `chon-tong-6`; so với `tong-hieu-vi-du`, `tong-no`
- Nguồn: —
- Vấn đề: cùng hai số −12, 18 đổi vai, cùng số chia 6, đáp số −30 trùng hình quy tắc.
- Sửa: số chia và cặp số khác, vd chia hết cho 7: (−21) + 14, 35 − (−14); tính lại `params` và `explain`.

### 17. Phép tính trong chữ bị ngắt dòng giữa biểu thức (LL-12, LL-21)

- Vị trí: `$.sections[11].blocks[0].children[0].text`, `$.sections[11].blocks[3].children[0].text` (dòng sau đọc thành "8 chia hết cho x"), `$.sections[9].blocks[0].children[0].text`; `explain.text` của `$.exercises[0]`, `[2]`, `[7]`, `[8]`, `[14]`, `[20]`, `[50]`, `[52]`, `[55]`, `[57]` (ảnh phone và iPad ghi trong `vong2-nhom-1.md` Góp ý 6, `vong2-nhom-3.md` Nên sửa 5)
- Nguồn: —
- Vấn đề: chữ gãy ở +, −, ·, =; nửa sau đứng đầu dòng thành một phép tính khác. Bài không có dấu cách không ngắt (U+00A0) nào, trong khi `quy-tac-dau-ngoac`, `phep-nhan-phep-chia` dùng nó.
- Sửa: dấu cách quanh +, −, ·, = và giữa "x" với "=" trong phép tính viết trong chữ đổi thành U+00A0, hoặc đưa phép tính ra `tex`/`formula`. Soát cả bài.

## Góp ý

### 1. "Nhân thương với số chia" mà phép nhân viết số chia trước (LL-05; Góp ý 1 vòng 1, chưa sửa)

- Vị trí: `$.sections[3].blocks[1].text`, `.tex`; `$.exercises[19].explain.text`; `$.exercises[21].explain`
- Nguồn: —
- Vấn đề: `tex` `8 \cdot (-9)`; ở `tinh-81-chia-am9` số chia và thương cùng là −9.
- Sửa: "Nhân số chia với thương."; đổi `tinh-81-chia-am9` sang số có thương khác số chia.

### 2. Đề `chia-no-ba-ban` báo trước thương âm (LL-02; Góp ý 4 vòng 1, chưa sửa)

- Vị trí: `$.exercises[12].prompt[0]`
- Nguồn: —
- Vấn đề: "viết bằng số âm?".
- Sửa: "Số tiền mỗi bạn thay đổi bao nhiêu nghìn? Viết bằng số nguyên."

### 3. Nhiễu (−7) : 2 của `chon-chia-het` thiếu `wrong` (Góp ý 6 vòng 1, chưa sửa)

- Vị trí: `$.exercises[1].explain.wrong`
- Nguồn: —
- Vấn đề: bé dễ nghĩ ra −3.
- Sửa: thêm "Không có số nguyên nào nhân với 2 để được −7."

### 4. Nhiều câu cùng đáp số −9, câu ôn trùng hình gợi ý (LL-07; Góp ý 5 vòng 1, chưa sửa)

- Vị trí: `$.exercises[22]` (`ex.chon-thuong-am9`, trùng `goi-y-khac-dau`), `$.exercises[5]` (`ex.chon-chia-het-nhieu`); `ex.tinh-bon-phep`, `ex.tinh-81-chia-am9`, `ex.chon-thuong-am9`, mẹo và recap `bon-phep-chia` đều ra −9
- Nguồn: —
- Vấn đề: ở phiên ôn card `suy-ra-thuong`, ba câu cùng đáp số −9.
- Sửa: đổi sang số chưa có trong `lesson.json`, `catalog.ts`; ít nhất hai câu của card ra đáp số khác −9.

### 5. Nhãn hình nấc 2 nói "chia trước, dấu sau", ngược câu quy tắc (LL-05)

- Vị trí: `catalog.ts` mục `goi-y-cung-dau`, `goi-y-khac-dau` (label)
- Nguồn: —
- Vấn đề: câu quy tắc section 2, 3 đã đổi sang xét dấu trước.
- Sửa: "Chia hai số cùng dấu: thương là số dương, rồi chia hai phần số tự nhiên"; tương tự cho khác dấu.

### 6. Câu quy tắc `suy-ra-thuong` chưa nói "hai số" là số nào (LL-10)

- Vị trí: `$.sections[3].blocks[0].children[0].text`, `$.sections[3].recap.caption`, `$.cards[3].recap.caption`
- Nguồn: —
- Vấn đề: ở card ôn, câu đứng riêng không có phép chia đi kèm.
- Sửa: "Trong một phép chia, đổi dấu số bị chia hoặc số chia thì thương đổi dấu. Đổi dấu cả hai số thì thương giữ nguyên." (recap lặp nguyên văn).

### 7. Mẹo "Kiểm tra số ước" không ghi "khác 0" (LL-24)

- Vị trí: `$.sections[5].blocks[2].text` (`tip.so-uoc-chan`)
- Nguồn: —
- Vấn đề: trang "Mẹo hay" gom mẹo ra khỏi section; bài không hỏi ước của 0 nên chỉ Góp ý. Đã thử 1, −1, 6, 9, 7, 12, −21: đúng.
- Sửa: "Với số nguyên khác 0, số ước âm bằng số ước dương, …".

### 8. Câu thứ hai trong khung quy tắc `tong-hieu-chia-het` không có trong recap (LL-06)

- Vị trí: `$.sections[10].blocks[1].children[0].text` so với `$.sections[10].recap.caption`, `$.cards[10].recap.caption`
- Nguồn: —
- Vấn đề: "Với số nguyên, số bị trừ nhỏ hơn số trừ vẫn trừ được." là lời nhắc nhưng nằm trong khung quy tắc.
- Sửa: chuyển sang nhãn hình `tong-hieu-vi-du` hoặc note mở đầu.

### 9. Còn giữ khung câu và chuỗi bước của sách ở ba chỗ (LL-08)

- Vị trí: `$.sections[11].blocks[1].children[0].text` và hình `tim-x-3`; `$.sections[10].blocks[1].children[0].text`; `$.sections[9].blocks[1].children[0].text`
- Nguồn: lời giải 3.40 tr.113, đề 3.40 và ví dụ 2 tr.59, `sbt-p113.png`, `sbt-p59.png`
- Vấn đề: số đã đổi, nhưng "Số x khác 0 luôn chia hết cho chính nó" và hàng `3 = (x + 3) - x` đi đúng chuỗi lời giải; quy tắc tổng hiệu giữ khung câu dẫn 3.40; quy tắc phân tích đi đúng hai bước của ví dụ 2. Câu toán khó nói khác nên chỉ Góp ý.
- Sửa: tuỳ tác giả; `tim-x` có thể đi từ chiều tổng (quy tắc section 11) rồi mới tới chiều hiệu.

### 10. Đề `dien-uoc-x-15` thiếu việc phải làm (LL-10)

- Vị trí: `$.exercises[65].prompt[0]` (`ex.dien-uoc-x-15`)
- Nguồn: —
- Vấn đề: "Xét x + 15 chia hết cho x." không phải câu hỏi; "Các số x đó" phải dò ngược.
- Sửa: "Ta tìm các số x để x + 15 chia hết cho x. Chọn từ điền vào chỗ trống."

### 11. Câu kho ôn `noi-tich-gia-tri` chỉ ôn dấu của tích

- Vị trí: `$.exercises[53]` (`ex.noi-tich-gia-tri`, card `phan-tich-thanh-tich`)
- Nguồn: —
- Vấn đề: nối tích với giá trị là việc của Bài 16; không câu ôn nào hỏi viết một số thành tích theo mọi cách.
- Sửa: vd nối 12, −12 với một cách viết thành tích, hoặc hỏi số cách viết 22 thành tích hai số nguyên.

### 12. "ước dương chung" và "ước chung dương" (LL-05; Góp ý 12 vòng 1, chưa sửa trong bản review)

- Vị trí: hình `uoc-chung-6-9`, `$.exercises[48].prompt`
- Nguồn: —
- Vấn đề: một khái niệm hai cách nói.
- Sửa: "ước chung dương" ở cả hai chỗ (cây làm việc đã đổi nhãn, còn tiêu đề hình).

### 13. `overview` chưa nhắc phân tích một số thành tích (Nên sửa 25 vòng 1, sửa một phần)

- Vị trí: `$.overview.summary`, `$.overview.goals`
- Nguồn: —
- Vấn đề: section `phan-tich-thanh-tich` không có trong `summary` hay `goals`.
- Sửa: thêm "… viết một số thành tích hai số nguyên, …" vào `summary` hoặc một mục `goals`.

### 14. Câu kho ôn `dien-uoc-chung` gần số của hình recap (LL-07)

- Vị trí: `$.exercises[49]` (`ex.dien-uoc-chung`) so với hình `uoc-chung-vi-du`
- Nguồn: —
- Vấn đề: recap có ±3 là ước chung của 6 và −9; câu ôn hỏi −3 với 9 và −15 (số do câu "Sửa" vòng 1 đề xuất).
- Sửa: tuỳ tác giả, vd −4 với 16 và −20.

### 15. Ví dụ nhiệt độ gọi tích của −3 là "bội của 3" (Góp ý 7 vòng 1, chưa sửa)

- Vị trí: `$.sections[6].blocks[0].children[0].text`, hình `boi-nhiet-do`
- Nguồn: —
- Vấn đề: câu quy tắc ngay sau bảo "nhân số đó với…", mà hình nhân −3 rồi gọi là bội của 3.
- Sửa: "… đó là các bội của −3 (cũng là bội của 3)."

### 16. Định nghĩa và cách tìm ước chung khác lời Bài 11 (LL-05; Góp ý 11 vòng 1, chưa sửa)

- Vị trí: `$.sections[8].blocks[1].children[0].text`, `$.sections[8].blocks[2].children[0].text`
- Nguồn: tr.58 kiến thức cần nhớ 2, `sbt-p58.png`
- Vấn đề: Bài 11 (đã xuất bản): "Một số là ước của tất cả các số đã cho thì gọi là ước chung của các số đó." và "viết các ước của từng số, rồi chọn những số có mặt ở cả hai danh sách"; bài này "của cả hai số", cùng làm "Thử từng số với cả hai số", còn hình `uoc-chung-vi-du` đi theo hai danh sách.
- Sửa: dùng lại câu của Bài 11 và gợi ý cùng làm theo cách hai danh sách.

## Báo nhầm của nhóm

Không có phát hiện nào của ba nhóm là báo nhầm. Tổng hợp đổi mức hai mục: Nên sửa 6 của nhóm 2 (`ex.boi-7-lon-nhat-nho-hon-30`) nâng lên Nghiêm trọng 3; Nghiêm trọng 1 của nhóm 3 (`ex.chon-tong-chia-het-9`) giữ Nghiêm trọng. Góp ý 6 nhóm 1 gộp vào Nên sửa 17.

## Vòng 1: đã sửa

Cả 11 Nghiêm trọng của vòng 1 đã xử lý (ba nhóm kiểm lại trong bản `f87e1e3`):
1. Mẹo "Dấu của thương" sai với biểu thức có dấu −: đã bỏ mẹo.
2. Quy tắc tìm bội, bội trong khoảng bỏ số 0: đã thêm số 0 (riêng danh sách "1, 2, 3" sinh lỗi mới, Nghiêm trọng 2).
3. `dien-boi-3` như thể bội của 3 chỉ có sáu số: đã nói rõ khoảng.
4. "chia hết" thiếu "cho": đã thêm "cho" ở `done` và hai `explain`.
5. Mẹo "Kiểm tra số ước" cho qua lỗi quên ước âm: đã đổi sang đếm ước âm.
6. Cặp (6, −6) bị cắt trên điện thoại: `tex` đã xếp hai dòng.
7. `chon-so-can-tim-7` có ba lựa chọn đúng: nay chỉ 7 đúng.
8. "Số x luôn chia hết cho x" thiếu "khác 0": đã thêm.
9. Cùng làm `phan-tich-thanh-tich` là bài 3.39: đã đổi sang 35.
10. Section `tim-x` và `dem-x-5` dựng trên 3.40: đã đổi sang x + 3 và `dem-x-4`.
11. Câu quy tắc `tong-hieu-chia-het` chép câu dẫn 3.40: đã viết bằng lời.
