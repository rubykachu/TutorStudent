# Review: Phép chia hết. Ước và bội của một số nguyên (`phep-chia-het-uoc-va-boi-cua-mot-so-nguyen`)

- Bài: `content/math/kntt/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/` - sbt-p58, sbt-p59, sbt-p113
- `content:check`: 0 lỗi, 1 cảnh báo của bài (103 id chưa có trong `ids.lock.json`, đúng với bài nháp)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi vòng toàn bài hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/`
- Kết luận: Chưa đạt: còn 11 lỗi Nghiêm trọng (`pnpm content:hash phep-chia-het-uoc-va-boi-cua-mot-so-nguyen --root content --mark` đã chạy)
- Bản đã review: `b2ecc45d53f486e9bac11bcaa7c06b4f38b0e5e5ce1df096fb9b43c57919a7b9` (`pnpm content:diff` so với bản này)

Đã đối chiếu thêm với Bài 8 `quan-he-chia-het-va-tinh-chat` và Bài 11 `uoc-chung-uoc-chung-lon-nhat` (đã xuất bản), Bài 16 `phep-nhan-so-nguyen` (bản nháp). Mọi `recap` của section và card lặp đúng câu quy tắc của section; màu khái niệm (số chia và ước violet, số bị chia và bội blue, ước chung teal) khớp Bài 8, Bài 11 và glossary.

## Nghiêm trọng

### 1. Mẹo "Dấu của thương" ra sai khi số bị chia là một biểu thức có dấu − (LL-24)

- Vị trí: `$.sections[3].blocks[1]` (`tip` "Dấu của thương", section `suy-ra-thuong`); đầu vào sai: `$.exercises[59]` (`ex.tinh-tong-chia-12`)
- Nguồn: tr.58 kiến thức cần nhớ 1, `sbt-p58.png`
- Vấn đề: "Đếm các dấu − của hai số trong phép chia. Có 0 hoặc 2 dấu − thì thương dương, có 1 dấu − thì thương âm" không nói phải tính số bị chia và số chia ra thành một số trước. Câu ôn `[(−24) + 36] : 12` của chính bài có đúng một dấu −, làm theo mẹo ra −1 (đáp án 1); câu có `allowNegative` nên phím − có sẵn. Trang "Mẹo hay" gom mẹo ra khỏi section nên điều kiện phải nằm trong `text`. Với hai số, "đếm dấu −" cũng chỉ là quy tắc "cùng dấu dương, khác dấu âm" nói cách khác (mẹo gượng), và Bài 16 đếm "số âm" chứ không đếm "dấu −".
- Sửa: bỏ mẹo (khuyến nghị; section đã có câu quy tắc và mẹo "Kiểm tra phép chia" có ích hơn). Nếu giữ: "Tính số bị chia và số chia ra thành hai số trước. Rồi đếm số âm: không có hoặc có 2 số âm thì thương dương, có 1 số âm thì thương âm. Số bị chia bằng 0 thì thương bằng 0.", thêm vào `tex` một ví dụ có ngoặc.

### 2. Quy tắc tìm bội và tìm bội trong khoảng bỏ mất số 0 (LL-17)

- Vị trí: `$.sections[7].blocks[1].children[0].text`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption` (`boi-trong-khoang`); `$.sections[6].blocks[1].children[0].text`, `$.sections[6].recap.caption`, `$.cards[6].recap.caption` (`tim-boi`)
- Nguồn: tr.58 kiến thức cần nhớ 3 ("tương tự đối với bội"), lời giải 3.38 tr.113 (có số 0), `sbt-p58.png`, `sbt-p113.png`
- Vấn đề: quy tắc `boi-trong-khoang` bảo "liệt kê các bội dương và bội âm, rồi chỉ giữ những bội nằm trong khoảng đó": làm đúng từng chữ thì sót số 0, nên sai ở `ex.dem-boi-4-khoang` (ra 5, đáp án 6), `ex.thang-may-dung-may-tang` (ra 4, đáp án 5), `ex.xep-boi-6-khoang` và màn cùng làm `chon-boi-5-khoang-cung-lam`. Quy tắc `tim-boi` chỉ nói "các bội khác 0", bỏ câu "Số 0 cũng là bội của mọi số khác 0" mà câu quy tắc Bài 8 có; số 0 chỉ còn ở nhãn hình (`boi-4-vi-du`, `boi-khoang-vi-du`), trong khi `ex.chon-boi-6-chips` và `ex.dien-boi-3` bắt chọn 0. Hai quy tắc cũng nói bước "số đối" hai cách: `tim-uoc` "viết thêm số đối của chúng", `tim-boi` "Số đối của mỗi bội cũng là một bội" (LL-05).
- Sửa: `tim-boi` (recap lặp nguyên văn): "Muốn tìm các bội khác 0 của một số nguyên khác 0, nhân số đó lần lượt với 1, 2, 3 và cứ thế tiếp, rồi viết thêm số đối của chúng. Số 0 cũng là bội của mọi số nguyên khác 0." `boi-trong-khoang`: "Muốn tìm bội trong một khoảng, liệt kê các bội dương, bội âm và số 0, rồi chỉ giữ những số nằm trong khoảng đó." Tiêu đề hình `boi-4-vi-du` thêm "và số 0".

### 3. Câu điền "Các bội của 3 là 0, 3, 6, −3, −6 và ___" như thể bội của 3 chỉ có sáu số (LL-17)

- Vị trí: `$.exercises[39].segments` (`ex.dien-boi-3`)
- Nguồn: —
- Vấn đề: câu đã điền đọc thành "Các bội của 3 là 0, 3, 6, −3, −6 và −9.", tức tập bội của 3 có sáu số; danh sách bội in sẵn phải nói rõ khoảng. Câu cũng chọn −9 mà bỏ 9 không lý do.
- Sửa: nói rõ khoảng, vd "Các bội của 3 lớn hơn −10 và nhỏ hơn 7 là −9, −6, −3, 0, 3 và ___." (đáp án 6, ngân hàng 6, 9, 4), hay đổi đề thành "Số nào là bội của 3?". Tránh trùng hình `boi-khoang-vi-du` (bội của 3 từ −10 tới 10).

### 4. Viết "chia hết" thiếu "cho", đọc thành đảo chiều chia hết (LL-17)

- Vị trí: `catalog.ts` mục `chon-uoc-10-cung-lam`, tham số `done` ("5, −2, −10 và −1 đều chia hết 10", màn `$.sections[4].blocks[3]`); `$.exercises[45].explain.text` (`ex.uoc-chung-10-15`: "Số 5 và −5 chia hết cả hai số"); `$.exercises[47].explain.text` (`ex.chon-uc-12-18-chips`: "Các số 6, −3 và −6 chia hết cả hai số")
- Nguồn: tr.58 kiến thức cần nhớ 2, `sbt-p58.png`
- Vấn đề: bài dạy "a chia hết cho b" (số bị chia đứng trước). Đọc theo cách đó, ba câu nói 5 chia hết cho 10, 6 chia hết cho 12, tức đảo chiều, đúng ở hai section dạy ước và ước chung. Bé dễ nhớ ngược ước với bội.
- Sửa: "10 chia hết cho 5, −2, −10 và −1, nên chúng là ước của 10. Còn 10 không chia hết cho 3 và 4."; "Cả 10 và 15 đều chia hết cho 5 và cho −5."; "Cả 12 và −18 đều chia hết cho 6, cho −3 và cho −6." Soát mọi câu "chia hết" của cả bài (cả `catalog.ts`) xem đều có "cho".

### 5. Mẹo "Kiểm tra số ước" cho qua lỗi hay gặp nhất và suy ra sai khi đếm thừa (LL-24)

- Vị trí: `$.sections[5].blocks[2]` (`tip` "Kiểm tra số ước", section `tim-uoc`)
- Nguồn: —
- Vấn đề: "số ước luôn là số chẵn" đúng với mọi số nguyên khác 0, nhưng tên "Kiểm tra số ước" làm bé nhớ thành "ra số chẵn là đủ". Lỗi chính section cảnh báo là quên hết ước âm, mà lỗi đó cho số chẵn với 6, 8, 10, 15, 18 nên mẹo cho qua. Vế "đếm ra số lẻ thì bạn còn thiếu ước" sai khi số lẻ do thêm nhầm: ±1, ±5 và 0 (0 có trong ngân hàng của `ex.dien-uoc-am-5`) cho 5, mẹo bảo đi tìm ước còn thiếu trong khi phải bỏ số 0.
- Sửa: đổi thành phép kiểm bắt được lỗi quên ước âm, vd tiêu đề "Đếm ước âm", text "Số ước âm luôn bằng số ước dương, vì mỗi ước dương có một số đối. Vậy số ước gấp đôi số ước dương: 6 có 4 ước dương nên có 8 ước." Nếu giữ ý "số chẵn": thêm "Ra số chẵn chưa chắc đủ: quên hết ước âm của 6 vẫn được 4." và đổi "còn thiếu ước" thành "bạn đã thiếu hoặc thừa một số".

### 6. Cặp (6, −6) bị cắt khỏi màn điện thoại ở mẹo và lời giải (LL-12)

- Vị trí: `$.sections[5].blocks[2].tex`, `$.exercises[29].explain.tex` (`ex.dem-uoc-cua-6`)
- Nguồn: —
- Vấn đề: ảnh phone `088-s6-03-block`, `092-s6-05-exercise-dem-uoc-cua-6-correct`, `005-tips-4` chỉ hiện "(1, −1), (2, −2), (3, −3)," còn cặp thứ tư tràn khỏi khung, không thấy dấu cuộn (hai nhóm reviewer cùng thấy). Bé thấy 3 cặp tức 6 ước ngay cạnh "4 + 4 = 8 ước". iPad hiện đủ.
- Sửa: `\begin{gathered} (1, -1),\ (2, -2) \\ (3, -3),\ (6, -6) \end{gathered}` cho cả hai chỗ (mẹo đổi theo mục 5 thì áp cho `tex` mới).

### 7. `chon-so-can-tim-7` có ba lựa chọn cùng đúng (LL-01)

- Vị trí: `$.exercises[60].options`, `$.exercises[60].explain.wrong` (`ex.chon-so-can-tim-7`)
- Nguồn: tr.59 bài 3.40, lời giải tr.113, `sbt-p59.png`, `sbt-p113.png`
- Vấn đề: "Muốn x + 7 chia hết cho x thì x là ước của số nào?". Khi đó x là ước của 7, nên cũng là ước của 14; và x khác 0 luôn là ước của chính x. Ba lựa chọn 7, 14, x đều đúng. Lý do `wrong` của 14 ("Hiệu (x + 7) − x bằng 7, không phải 14") không bác được "x là ước của 14"; lựa chọn x không có `wrong`.
- Sửa: đổi đề thành câu một đáp án, vd "Các số x để x + 7 chia hết cho x chính là các ước của số nào?" (14 sai vì x = 2 thì 9 không chia hết cho 2). Bỏ lựa chọn "x", thay bằng nhiễu là lỗi hay gặp, vd 8 (cộng nhầm 1 + 7). `wrong` cho từng nhiễu có số thử.

### 8. "Số x luôn chia hết cho x" thiếu điều kiện khác 0 mà sách có (LL-17)

- Vị trí: `$.sections[11].blocks[0].children[0].text` (section `tim-x`); cùng ý ở `$.exercises[60].explain.text`, `$.exercises[65].explain.text` ("Số x chia hết cho x") và nhãn `tag` "x chia hết cho x" của hình `tim-x-5` (`catalog.ts`)
- Nguồn: lời giải 3.40 tr.113, `sbt-p113.png` ("mỗi số nguyên khác 0 đều chia hết cho chính nó")
- Vấn đề: "luôn" sai với x = 0, trong khi section 1 dạy "Ta không chia được cho số 0" và quy tắc section 1 ghi "b khác 0".
- Sửa: "Số x khác 0 luôn chia hết cho x." Ở hai `explain` và nhãn hình: "x khác 0 nên x chia hết cho x".

### 9. Màn cùng làm `phan-tich-thanh-tich` là bài 3.39 kèm lời giải (LL-08)

- Vị trí: `$.sections[9].blocks[2]` (section `phan-tich-thanh-tich`), hình `chon-tich-21-cung-lam` trong `catalog.ts`
- Nguồn: tr.59 bài 3.39, lời giải tr.113, `sbt-p59.png`, `sbt-p113.png`
- Vấn đề: đề 3.39 là phân tích số 21 thành tích hai số nguyên. Màn dùng đúng số 21, ba chip đúng 3 · 7, (−3) · (−7), (−21) · (−1), và dòng `done` "21 = 3 · 7 = (−3) · (−7) = (−21) · (−1)" là lời giải sách bỏ 1 · 21 và đảo thứ tự một tích. Không trùng từng chữ, nhưng bộ số bài tập kèm lời giải tính là chép (cùng kiểu `ket-hop-44-25` của `phep-nhan-phep-chia`).
- Sửa: đổi sang số chưa dùng trong bài và trong sách, vd 22 hay 35, đổi chip nhiễu cho khớp, tính lại `wants` và `done`.

### 10. Section `tim-x` và câu ôn `dem-x-5` dựng trên bài 3.40 nguyên số kèm lời giải (LL-08, LL-07)

- Vị trí: `$.sections[11].blocks[0]` (note và hình `tim-x-5`), `$.exercises[63]` (`ex.dem-x-5`)
- Nguồn: tr.59 bài 3.40, lời giải tr.113, `sbt-p59.png`, `sbt-p113.png`
- Vấn đề: ví dụ mẫu dùng đúng x + 5 của 3.40; câu note đi lại từng bước lời giải ("Số x luôn chia hết cho x… hiệu (x + 5) − x = 5 cũng chia hết cho x" so với "mỗi số nguyên khác 0 đều chia hết cho chính nó. Do đó x + 5 và x cùng chia hết cho x… 5 = (x + 5) − x chia hết cho x"): lời đã đổi, không chép nguyên văn, nhưng cùng số, cùng chuỗi bước, và hình in cả đáp số {−5, −1, 1, 5}. Câu ôn `dem-x-5` hỏi lại đúng 3.40, đáp số 4 ("5 chỉ có bốn ước"), nên ở phiên ôn bé gặp lại câu đã thấy đáp án.
- Sửa: đổi số ví dụ mẫu (vd x + 3), viết lại note theo lời của bài; đổi `dem-x-5` sang số chưa dùng ở note, cùng làm, recap và câu khác (đã dùng 5, 6, 7, 8, 9, 10, 12), vd x + 4 (6 số) hay x + 11 (4 số), tính lại `answer` và `explain`.

### 11. Câu quy tắc `tong-hieu-chia-het` chép câu đề bài 3.40, và nói khác Bài 8 (LL-08, LL-05)

- Vị trí: `$.sections[10].blocks[1].children[0].text`, `$.sections[10].recap.caption`, `$.cards[10].recap.caption`
- Nguồn: tr.59 bài 3.40, `sbt-p59.png`
- Vấn đề: "Nếu a và b cùng chia hết cho c thì a + b và a − b cũng chia hết cho c." trùng câu "Nếu hai số nguyên a và b cùng chia hết cho số nguyên c thì a + b và a − b cũng chia hết cho c." của sách, chỉ bỏ "hai số nguyên" và "số nguyên": đây là chép thật. Bài 8 đã dạy cùng ý bằng hai câu lời ("Nếu các số hạng của một tổng đều chia hết cho một số thì tổng chia hết cho số đó", "Nếu số bị trừ và số trừ đều chia hết cho một số thì hiệu chia hết cho số đó"); bài này đổi sang chữ a, b, c, trong đó b vừa là "ước" ở section 5 nay là số bị chia.
- Sửa: viết bằng lời, nối với Bài 8, vd "Hai số nguyên cùng chia hết cho một số thì tổng và hiệu của chúng cũng chia hết cho số đó." Đổi recap section, recap card, và câu điền nếu lặp câu cũ.

## Nên sửa

### 1. Câu quy tắc dấu của phép chia nói khác Bài 16 và thiếu "khác 0" mà mẹo lại có (LL-05)

- Vị trí: `$.sections[3].blocks[0].children[0].text`, `$.sections[3].recap.caption`, `$.cards[3].recap.caption`; `$.sections[1].blocks[1].children[0].text`, `$.sections[2].blocks[1].children[0].text`
- Nguồn: tr.58 kiến thức cần nhớ 1, `sbt-p58.png`
- Vấn đề: (a) Bài 16 chốt "Hai số khác 0 cùng dấu thì tích dương, khác dấu thì tích âm", còn câu quy tắc section 4 bỏ "khác 0" trong khi mẹo ngay dưới ghi "dùng khi số bị chia khác 0". (b) Bài 16 dạy xét dấu trước rồi nhân hai phần số tự nhiên; bài này dạy chia hai phần số tự nhiên trước rồi chọn dấu. Hai bài liền nhau, bé dễ lẫn thứ tự làm.
- Sửa: chốt một thứ tự cho cả hai bài (đề xuất theo Bài 16: xét dấu trước), vd "Muốn chia hai số nguyên khác 0, xét dấu trước: cùng dấu thì thương dương, khác dấu thì thương âm. Rồi chia hai phần số tự nhiên." Section 2, 3 cùng khuôn; recap lặp nguyên văn; `explain` các câu tính (exercises[8], [9], [14], [15], [17], [20], [21]) đổi thứ tự theo.

### 2. Section `suy-ra-thuong` không có ý riêng trong quy tắc, recap và câu luyện (LL-06)

- Vị trí: `$.sections[3]`, `$.sections[3].recap`, `$.exercises[20]` (`ex.tinh-bon-phep`)
- Nguồn: tr.58–59 ví dụ 1, `sbt-p58.png`, `sbt-p59.png`
- Vấn đề: tên section "Bốn phép chia từ một phép chia" dạy suy ra thương ba phép còn lại, nhưng câu quy tắc và recap chỉ gộp lại quy tắc section 2, 3; ý "đổi dấu một số thì thương đổi dấu" chỉ nằm ở note cùng làm. Câu luyện `tinh-bon-phep` là một phép chia cùng dấu như câu luyện section 2, dùng lại hình nấc 2 `goi-y-cung-dau`. Phiên ôn card không ôn được điều section dạy.
- Sửa: câu quy tắc nêu cách suy ra, vd "Biết thương của hai phần số tự nhiên, đổi dấu một số thì thương đổi dấu, đổi dấu cả hai số thì thương giữ nguyên." Câu luyện đổi thành "Biết 63 : 7 = 9. Tính 63 : (−7)" hay câu chọn mọi phép có thương 9; nấc 2 một hình suy ra riêng.

### 3. Câu kiểm tra dấu thương không có phím "−", lộ dấu đáp án (LL-02)

- Vị trí: `$.exercises[6]` (`ex.gio-giam-20-do`)
- Nguồn: —
- Vấn đề: thiếu `allowNegative: true` nên bàn phím không có "−" (ảnh phone `033`–`036`), báo trước thương dương ở câu kiểm tra của section dạy dấu.
- Sửa: thêm `"allowNegative": true`.

### 4. Câu "Kiểm tra bằng phép nhân" đoán được bằng hình thức lựa chọn (LL-14)

- Vị trí: `$.exercises[19]` (`ex.kiem-tra-42-chia-6`)
- Nguồn: —
- Vấn đề: hai lựa chọn mở bằng "Đúng", đúng một lựa chọn mở bằng "Sai" và dài nhất.
- Sửa: thêm nhiễu "Sai, vì (−42) : 6 = −6" kèm `wrong` "6 · (−6) = −36, khác −42".

### 5. Câu điền in sẵn đáp án trong đề (LL-02)

- Vị trí: `$.exercises[4]` (`ex.dien-thuong-30`)
- Nguồn: —
- Vấn đề: "Vì −30 = 6 · (−5) nên (−30) : 6 = ___" đã có −5 ngay trước ô trống. Nhiễu "−24" lặp nhiễu của `ex.dien-thuong-khac-dau`.
- Sửa: "Vì 6 · ___ = −30 nên (−30) : 6 = ___" hoặc bỏ vế "Vì…"; nhiễu khác nhau giữa hai câu (vd 5, −6).

### 6. Lời giải thích nói "số dư" của phép chia số âm (LL-09)

- Vị trí: `$.exercises[5].explain.text` (`ex.chon-chia-het-nhieu`)
- Nguồn: tr.58, `sbt-p58.png` (chỉ có phép chia hết)
- Vấn đề: "còn hai phép kia có số dư" với (−16) : 6 và (−7) : (−2): phép chia có dư với số âm chưa dạy.
- Sửa: "còn hai phép kia không chia hết."

### 7. Câu ôn xếp thứ tự cần bốn phép chia rồi mới xếp (LL-18)

- Vị trí: `$.exercises[23]` (`ex.xep-thuong`)
- Nguồn: —
- Vấn đề: bốn thương rồi xếp bốn số nguyên, quá mức hai phép nhẩm cho người học chậm.
- Sửa: còn ba phép chia (vd bỏ 0 : 4), hoặc đổi thành câu chọn thương nhỏ nhất của ba phép.

### 8. Câu kiểm tra và cùng làm của `tim-uoc` có đáp án hiện sẵn trên màn trước (LL-07)

- Vị trí: `$.exercises[29]` (`ex.dem-uoc-cua-6`), `$.exercises[30]` (`ex.chon-uoc-cua-am10`), màn `$.sections[5].blocks[3]` (`chon-uoc-8-cung-lam`)
- Nguồn: —
- Vấn đề: note, hình `uoc-6` và `tex` của mẹo liệt kê đủ 8 ước của 6 trước câu hỏi 6 có bao nhiêu ước; hình quy tắc `uoc-vi-du` (cũng là recap) ghi sẵn ước của 8 và của −10, đáp án của cùng làm và của `chon-uoc-cua-am10`.
- Sửa: `dem-uoc-cua-6` đổi sang 10 hay 14; `chon-uoc-cua-am10` đổi sang −14 hay −21; hình `uoc-vi-du` dùng số khác (vd 9 và −14).

### 9. Bài chưa dạy cách tìm ước dương của một số âm (LL-09)

- Vị trí: `$.sections[5].blocks[1]`, hình `uoc-vi-du`, `$.exercises[30]` (`ex.chon-uoc-cua-am10`)
- Nguồn: tr.58 kiến thức cần nhớ 3, lời giải 3.36 tr.113 (ước của −66)
- Vấn đề: quy tắc bảo "tìm các ước dương rồi viết thêm số đối", nhưng bé chưa biết ước dương của −10 là gì; câu "Các ước của −10 giống các ước của 10" chỉ có trong `explain`, sau khi bé đã làm.
- Sửa: thêm vào note đầu hay nhãn hình `uoc-vi-du`: "Số −10 có cùng các ước với 10, nên tìm ước dương của 10."

### 10. Mẹo "Chia hết cho số âm" viết "Kết quả không đổi", dễ đọc thành "thương không đổi" (LL-10, LL-24)

- Vị trí: `$.sections[4].blocks[2]` (`tip` "Chia hết cho số âm"), hiện trên trang "Mẹo hay" ngay sau mẹo "Dấu của thương"
- Nguồn: —
- Vấn đề: mọi chỗ khác trong bài dùng "kết quả" cho giá trị phép tính; đọc theo nghĩa đó mẹo nói bỏ dấu − thì thương không đổi (sai với 12 : (−4) = −3), và ví dụ (−12)⋮(−4) → 12⋮4 có thương bằng nhau, củng cố cách hiểu sai. Mẹo cũng chỉ nói khi số chia âm, không dùng được khi số bị chia âm (`ex.chon-chia-het-bo-dau` (−35)⋮7). Reviewer nhóm để Nghiêm trọng; tổng hợp hạ xuống Nên sửa vì câu mở bằng "Muốn biết một số có chia hết cho một số âm không" nên cách đọc chính là "chia hết hay không vẫn giữ nguyên", điều đúng: đây là câu hai cách hiểu, không phải mẹo suy ra điều sai.
- Sửa: tiêu đề "Xét chia hết khi có số âm", text "Muốn biết một số có chia hết cho một số khác không, bỏ dấu − của cả hai số rồi xét như số tự nhiên. Chia hết hay không vẫn giữ nguyên, còn dấu của thương thì xét riêng.", thêm ví dụ có một số âm: `12 \chiahet (-4) \;\to\; 12 \chiahet 4`.

### 11. Câu kiểm tra `nhiet-do-5-gio` chỉ là phép nhân, không kiểm việc tìm bội

- Vị trí: `$.exercises[35]` (`ex.nhiet-do-5-gio`)
- Nguồn: —
- Vấn đề: đề hỏi (−3) · 5, làm được bằng quy tắc nhân Bài 16; ý "−15 là bội của 3" chỉ nằm ở `explain`.
- Sửa: hỏi về bội, vd "Số nào là bội của −3 nằm giữa −20 và −13?", hoặc câu chọn tất cả các mức thay đổi có thể xảy ra.

### 12. Khoảng "lớn hơn … nhỏ hơn hoặc bằng" không thử ở biên, `explain` nói khoảng khác đề (LL-10)

- Vị trí: `$.exercises[41]` (`ex.chon-boi-4-khoang`), `$.exercises[42].explain` (`ex.xep-boi-6-khoang`)
- Nguồn: tr.59 bài 3.38, `sbt-p59.png`
- Vấn đề: −9 và 9 không là bội của 4 nên "hoặc bằng" không đổi gì, và `explain` viết "nằm giữa −9 và 9"; `xep-boi-6-khoang` hỏi "lớn hơn −14 và nhỏ hơn 14" mà `explain` viết "từ −14 đến 14", trong khi ở `thang-may-dung-may-tang` "từ … đến" tính hai đầu.
- Sửa: `chon-boi-4-khoang` đổi thành "lớn hơn −8 và nhỏ hơn hoặc bằng 8" với −8 (không lấy), 8 (lấy), `wrong` của −8: "Đề nói lớn hơn −8, nên không lấy −8."; `explain` của hai câu lặp đúng chữ của đề.

### 13. Câu quy tắc phân tích thành tích đọc thành "bỏ tích dương, chỉ giữ tích âm" (LL-10, LL-06)

- Vị trí: `$.sections[9].blocks[1].children[0].text`, `$.sections[9].recap.caption`, `$.cards[9].recap.caption`
- Nguồn: tr.59 ví dụ 2, `sbt-p59.png`
- Vấn đề: "tìm tích hai số dương rồi đổi dấu cả hai thừa số" đọc theo chữ là đổi tích dương thành tích âm, nên với 10 bé chỉ còn hai tích âm, trong khi `ex.chon-tich-bang-15` bắt chọn cả 3 · 5; "tìm tích" còn đọc được là nhân ra. Hình recap hiện đủ hai hàng nên giữ mức Nên sửa.
- Sửa: "Muốn phân tích một số dương thành tích hai số nguyên, viết số đó thành tích hai số dương, rồi viết thêm các tích có cả hai thừa số đổi dấu." Recap lặp nguyên văn.

### 14. Quy tắc tìm x chỉ nói một chiều, bài tập cần cả chiều ngược (LL-06)

- Vị trí: `$.sections[11].blocks[1].children[0].text`, `$.sections[11].recap.caption`, `$.cards[11].recap.caption`
- Nguồn: lời giải 3.40 tr.113, `sbt-p113.png`
- Vấn đề: "Muốn x + a chia hết cho x thì x phải là ước của a" chỉ là điều kiện cần, còn `ex.chon-x-10-chips`, `ex.chon-x-12`, `ex.dem-x-5` bắt chọn hay đếm mọi ước, tức cần biết mọi ước của a đều làm được; ý đó không có trong quy tắc hay recap.
- Sửa: "Các số x để x + a chia hết cho x chính là các ước của a." Đổi recap section, card và câu điền `ex.dien-uoc-x-6` theo.

### 15. Trường hợp x + a = 0 chưa có lời giải thích (LL-16)

- Vị trí: hình `chon-x-8-cung-lam` (chip −8, `done`), `$.exercises[62].explain.text` (`ex.chon-x-10-chips`), `$.exercises[64].explain` (`ex.chon-x-12`)
- Nguồn: —
- Vấn đề: đáp án gồm x = −a, khi đó x + a = 0; bé dễ nghĩ "0 không chia hết cho −8". Chỉ `chon-x-12` in `(−12) + 12 = 0` trong `tex` mà không nói vì sao.
- Sửa: thêm vào `done` và hai `explain`: "Với x = −10 thì x + 10 = 0, mà 0 chia hết cho mọi số khác 0."

### 16. Section `tim-x` thiếu bậc thang cho bé học chậm (LL-16)

- Vị trí: `$.sections[11]`, hình `tim-x-5`, `chon-x-8-cung-lam`
- Nguồn: —
- Vấn đề: màn đầu đi thẳng vào lập luận chữ ((x + 5) − x = 5); không màn nào cho thử thay x bằng vài số, không có bước kiểm ngược, câu kiểm tra `ex.x-lon-nhat-9` chỉ có x dương nên ước âm và x = −a gặp lần đầu ở câu luyện.
- Sửa: thêm vào màn mẫu một bảng thử x = 1, 2, 3, 4 với dấu chia hết, rồi mới tới lập luận hiệu; thêm một hàng thử lại với một ước âm; câu kiểm tra thứ hai hỏi một ước âm cụ thể.

### 17. Chữ a, b, c đổi vai giữa các section (LL-05)

- Vị trí: `$.sections[0].blocks[1].children[0].text` (b là số chia), `$.sections[4].blocks[0].children[0].text` (b là ước của a), `$.sections[10].blocks[1].children[0].text` (a, b bị chia, c là số chia), `$.sections[11].blocks[1].children[0].text` (a là số cộng thêm)
- Nguồn: —
- Vấn đề: bé vừa nhớ "b là ước của a" thì section 11 viết "a và b cùng chia hết cho c", section 12 lại dùng a làm số cộng thêm.
- Sửa: section 11 viết bằng lời (Nghiêm trọng 11); section 12 nói "số cộng thêm" thay cho a, hay giải thích a ngay trong câu.

### 18. Lý do `wrong` bỏ điều kiện "số hạng kia chia hết" (LL-17)

- Vị trí: `$.exercises[55].explain.wrong` (`ex.chon-tong-chia-het-5`), `$.exercises[58].explain.wrong` (`ex.chon-tong-chia-het-9`)
- Nguồn: —
- Vấn đề: "21 không chia hết cho 5 nên tổng (−15) + 21 = 6 không chia hết cho 5" lấy một số không chia hết làm lý do; bé dễ nhớ "một số không chia hết thì tổng không chia hết" (sai: 21 + (−16) = 5). Kết luận vẫn đúng nên giữ Nên sửa.
- Sửa: "(−15) + 21 = 6, mà 6 không chia hết cho 5.", hoặc ghi đủ "−15 chia hết cho 5 còn 21 thì không, nên tổng không chia hết cho 5."

### 19. `chon-tong-chia-het-5` giải được bằng dò số trong đề (LL-14)

- Vị trí: `$.exercises[55].prompt`, `$.exercises[55].options`
- Nguồn: —
- Vấn đề: đề nói sẵn "Biết −15 và 20 đều chia hết cho 5" và chỉ một lựa chọn có 20; ba nhiễu +21, +22, +23 không ứng lỗi nào.
- Sửa: bỏ vế "Biết…", cho bốn phép có số khác nhau, vd 25 + (−10), (−15) − 20 với 25 + (−12), 30 − 4; `multiple: true` nếu hai đáp án; không trùng số `ex.chon-tong-chia-het-9`.

### 20. Câu kho ôn lặp số của màn cùng làm và recap (LL-07)

- Vị trí: `$.exercises[49]` (`ex.dien-uoc-chung`), `$.exercises[65]` (`ex.dien-uoc-x-6`)
- Nguồn: —
- Vấn đề: cùng làm `chon-uc-8-12-cung-lam` có −4 là ước chung của 8 và −12, câu ôn hỏi −4 với −8 và 12; recap `tim-x-vi-du` dùng x + 6, câu ôn hỏi lại x + 6.
- Sửa: `dien-uoc-chung` đổi sang cặp chưa dùng (vd −3 với 9 và −15); `dien-uoc-x-6` đổi số (vd x + 15) hoặc đổi số recap.

### 21. Card `phan-tich-thanh-tich` gắn khái niệm "Thương" (LL-05)

- Vị trí: `$.cards[9].conceptIds`
- Nguồn: —
- Vấn đề: card dạy viết một số thành tích nhưng gắn `concept.thuong`; bé thấy nhãn "Thương" ở card về tích.
- Sửa: bỏ `concept.thuong` (giữ `duong`, `am`), hoặc thêm khái niệm "Tích" (amber như glossary).

### 22. Chữ cái và phép tính bị ngắt dòng giữa biểu thức trên điện thoại (LL-12, LL-21)

- Vị trí: `$.sections[10].blocks[1].children[0].text` (ảnh `152-s11-02-block`, `161-s11-07-recap`: "thì a +" / "b và a − b"), `$.sections[11].blocks[0].children[0].text` (ảnh `163-s12-01-block`: "Nên nếu x +" / "5 chia hết…"), `$.exercises[46].explain.tex` (ảnh `133-s9-05-…-correct`: "21 =" / "7 · 3"), `$.exercises[36].explain.tex` (ảnh `106-s7-05-exercise-chon-boi-cua-4-correct`: "12 = 4 ·" / "3")
- Nguồn: —
- Vấn đề: "x +" cuối dòng rồi "5 chia hết cho x" đầu dòng sau đọc thành "5 chia hết cho x"; đẳng thức gãy ở dấu "=" hay "·".
- Sửa: câu quy tắc section 11 viết bằng lời (Nghiêm trọng 11); note section 12 tách phép tính ra khối `formula`; hai `tex` xếp `gathered` mỗi đẳng thức một dòng.

### 23. Nấc 1 của ba câu điền chỉ tô dòng hướng dẫn (LL-02)

- Vị trí: `$.exercises[49].hints.highlight`, `$.exercises[56].hints.highlight`, `$.exercises[65].hints.highlight` (`ex.dien-uoc-chung`, `ex.dien-tong-hieu-7`, `ex.dien-uoc-x-6`)
- Nguồn: —
- Vấn đề: `prompt` chỉ có "Chọn từ (cụm từ) điền vào chỗ trống."; dữ kiện cần nhìn lại nằm trong `segments`, nên lần sai đầu bé không được giúp gì.
- Sửa: đưa câu dữ kiện lên `prompt` (vd "Biết −28 và 35 đều chia hết cho 7.") rồi tô câu đó.

### 24. Quy tắc hiệu chia hết với số nguyên không nói điều kiện của Bài 8 đã bỏ (LL-05)

- Vị trí: `$.sections[10]` (section `tong-hieu-chia-het`), `$.exercises[56]` (`ex.dien-tong-hieu-7`)
- Nguồn: —
- Vấn đề: câu quy tắc hiệu của Bài 8 (đã xuất bản) có "Số bị trừ phải lớn hơn hoặc bằng số trừ". Bài này dùng −28 − 35 mà không nói điều kiện đó không còn với số nguyên, nên hai bài nói ngược nhau về cùng quy tắc. (Reviewer nhóm để Góp ý; tổng hợp nâng lên vì là mâu thuẫn với bài đã xuất bản.)
- Sửa: thêm một câu ở note mở đầu hay ví dụ: "Với số nguyên, số bị trừ nhỏ hơn số trừ vẫn trừ được."

### 25. Tổng quan không nhắc ba section cuối

- Vị trí: `$.overview.goals`, `$.overview.summary`
- Nguồn: —
- Vấn đề: mục tiêu và tóm tắt không nói tới phân tích thành tích, tổng hiệu cùng chia hết và tìm x (ba trong mười hai section).
- Sửa: thêm một mục tiêu, vd "dùng tổng, hiệu cùng chia hết để tìm x", và một vế trong `summary`.

## Góp ý

### 1. "Nhân thương với số chia" nhưng phép nhân viết số chia đứng trước (LL-05)

- Vị trí: `$.sections[3].blocks[2]` (`tip` "Kiểm tra phép chia", `text` và `tex`), `$.exercises[19].explain.text`
- Nguồn: —
- Vấn đề: chữ "Nhân thương với số chia" mà `tex` viết `8 · (−9)`; note cùng làm section 1 nói "nhân số chia với một số nguyên".
- Sửa: "Nhân số chia với thương." ở cả mẹo và `explain`.

### 2. Thứ tự hai thừa số khi kiểm phép chia đời sống không thống nhất (LL-05)

- Vị trí: `$.sections[0].blocks[0].children[0].text`, hình `chia-het-vi-du`, `cung-dau-nhiet-do`, `khac-dau-chia-no` (`catalog.ts`)
- Nguồn: —
- Vấn đề: hình section 2 viết `(−3) · 4` (mỗi lần · số lần, như Bài 16), hình section 3 viết `4 · (−5)` và note section 1 viết `12 = 3 · 4` (số lần · mỗi lần).
- Sửa: note section 1 đổi sang chia theo nhóm ("chia mỗi bạn 3 cái thì được 4 bạn, vì 12 = 3 · 4"); hình section 3 viết `(−5) · 4 = −20`.

### 3. "tức −12 độ", "tức −20 độ" thiếu chữ "thay đổi" (LL-10)

- Vị trí: `$.sections[1].blocks[0].children[0].text`, `$.exercises[6].prompt[0]`
- Nguồn: —
- Vấn đề: đọc như nhiệt độ là −12 độ.
- Sửa: "tức thay đổi −12 độ", "tức thay đổi −20 độ".

### 4. Đề câu kiểm tra thương âm nói trước dấu đáp án (LL-02)

- Vị trí: `$.exercises[12].prompt[0]` (`ex.chia-no-ba-ban`)
- Nguồn: —
- Vấn đề: "viết bằng số âm?" báo sẵn thương âm.
- Sửa: "Số tiền của mỗi bạn thay đổi bao nhiêu nghìn? Viết bằng số nguyên."

### 5. Câu ôn trùng số với câu kiểm tra hay hình gợi ý (LL-07)

- Vị trí: `$.exercises[22]` (`ex.chon-thuong-am9`), `$.exercises[5]` (`ex.chon-chia-het-nhieu`)
- Nguồn: —
- Vấn đề: (−36) : 4 là phép chia trong hình nấc 2 `goi-y-khac-dau`; (−16) : 4 trùng đáp án `ex.chon-thuong-am`.
- Sửa: đổi số, vd 28 : 4 và (−18) : 3.

### 6. Nhiễu (−7) : 2 thiếu lý do `wrong`

- Vị trí: `$.exercises[1].explain.wrong` (`ex.chon-chia-het`)
- Nguồn: —
- Vấn đề: bé dễ nghĩ −7 : 2 "ra −3".
- Sửa: thêm `wrong`: "Không có số nguyên nào nhân với 2 để được −7."

### 7. Ví dụ nhiệt độ gọi tích của −3 là "bội của 3" mà chưa nói vì sao

- Vị trí: `$.sections[6].blocks[0]`, hình `boi-nhiet-do`
- Nguồn: —
- Vấn đề: hình nhân −3 với 1, 2, 3 (theo quy tắc là bội của −3) nhưng gọi là bội của 3.
- Sửa: "… đó là các bội của −3 (cũng là bội của 3)."

### 8. Câu ôn `dem-boi-4-khoang` gần trùng câu kiểm tra `chon-boi-4-khoang` (LL-07)

- Vị trí: `$.exercises[43]`
- Nguồn: —
- Vấn đề: cùng bội của 4, cùng đầu "lớn hơn −9"; note thang máy cũng bội của 4.
- Sửa: đổi sang bội của 5 hay 7, vd "lớn hơn −15 và nhỏ hơn hoặc bằng 10".

### 9. Hai câu kho ôn chỉ dùng số tự nhiên

- Vị trí: `$.exercises[44]` (`ex.boi-7-lon-nhat-nho-hon-30`), `$.exercises[32]` (`ex.dem-uoc-duong-18`)
- Nguồn: —
- Vấn đề: làm được bằng Bài 8, không ôn phần mới.
- Sửa: vd "Bội âm lớn nhất của 7 mà nhỏ hơn −30", "Số −18 có tất cả bao nhiêu ước?".

### 10. Tầng 0 trong ví dụ thang máy (LL-10)

- Vị trí: `$.sections[7].blocks[0]`, `$.exercises[40]` (`ex.thang-may-dung-may-tang`)
- Nguồn: —
- Vấn đề: nhà ở Việt Nam ít gọi "tầng 0".
- Sửa: thêm "(tầng 0 là tầng trệt)".

### 11. Định nghĩa và cách tìm ước chung khác lời Bài 11 (LL-05)

- Vị trí: `$.sections[8].blocks[1].children[0].text`, `$.sections[8].blocks[2].children[0].text`
- Nguồn: tr.58 kiến thức cần nhớ 2, `sbt-p58.png`
- Vấn đề: Bài 11 viết "Một số là ước của tất cả các số đã cho thì gọi là ước chung của các số đó." và dạy "viết các ước của từng số, rồi chọn những số có mặt ở cả hai danh sách"; bài này viết "của cả hai số" và cùng làm dạy "Thử từng số với cả hai số". Hình `uoc-chung-vi-du` lại đi theo cách hai danh sách.
- Sửa: dùng lại câu đã qua review của Bài 11, và gợi ý cùng làm theo cách hai danh sách.

### 12. "ước dương chung" và "ước chung dương" (LL-05)

- Vị trí: hình `uoc-chung-6-9`, `$.exercises[48].prompt` (`ex.dem-uoc-chung-duong-20-30`)
- Nguồn: —
- Vấn đề: một khái niệm hai cách nói trong một section.
- Sửa: "ước chung dương" ở cả hai chỗ.

### 13. `explain` của `uoc-chung-am14-21` có vế không ứng với lựa chọn nào

- Vị trí: `$.exercises[46].explain.text`
- Nguồn: —
- Vấn đề: "hoặc không là ước của số nào" thừa: 14, 2, 3 đều là ước của một trong hai số.
- Sửa: "Các số còn lại chỉ là ước của một trong hai số."

### 14. `explain` của `chon-tong-chia-het-9` kể 27 hai lần

- Vị trí: `$.exercises[58].explain.text`
- Nguồn: —
- Vấn đề: "Các số 27, −18, −36 và 27".
- Sửa: "Các số 27, −18 và −36".

### 15. Ví dụ xếp ghế như thể chỉ có hai cách (LL-10)

- Vị trí: `$.sections[9].blocks[0].children[0].text`, hình `ghe-10`
- Nguồn: —
- Vấn đề: "Ta xếp 1 hàng 10 ghế hay 2 hàng 5 ghế" bỏ 5 hàng 2 ghế, 10 hàng 1 ghế.
- Sửa: "Chẳng hạn ta xếp 1 hàng 10 ghế hay 2 hàng 5 ghế, …".

### 16. Nhãn "tổng" mang màu của "hiệu" (LL-05)

- Vị trí: hình `tong-hieu-vi-du` (`catalog.ts`)
- Nguồn: —
- Vấn đề: glossary cho "tổng" amber, "hiệu" teal; nhãn "tổng" tô teal.
- Sửa: "tổng" amber, "hiệu" teal, hoặc màu trung tính cho cả hai.

### 17. Kí hiệu tập hợp trong hình mẫu và lời giải (LL-09)

- Vị trí: hình `tim-x-5`, `$.exercises[61].explain.tex`, `$.exercises[63].explain.tex`
- Nguồn: —
- Vấn đề: `docs/learner.md` ghi bé chưa viết được { }, ∈; recap `tim-x-vi-du` đã viết "x = ±1, ±2, …".
- Sửa: "x = ±1, ±5", "x = 1, 3, 9".

### 18. Nhiễu yếu ở hai màn chips (LL-14)

- Vị trí: hình `chon-tich-21-cung-lam` (chip "1 · 12"), `chon-tich-14` (chip "7 · 7")
- Nguồn: —
- Vấn đề: 12 và 49 xa đáp số, bé loại ngay.
- Sửa: nhiễu sai dấu, vd (−1) · 14.

### 19. Câu quy tắc phép chia hết giữ khung câu kí hiệu của sách (LL-08)

- Vị trí: `$.sections[0].blocks[1].children[0].text`, `$.sections[0].recap.caption`, `$.cards[0].recap.caption`
- Nguồn: tr.58 kiến thức cần nhớ 1, `sbt-p58.png`
- Vấn đề: "Nếu a = b · q, trong đó b khác 0 và q là số nguyên, thì a chia hết cho b và a : b = q." đã viết lại, không trùng nguyên văn, nhưng giữ khung "nếu … a = bq thì … a : b = q … a chia hết cho b" của sách. Câu thuần kí hiệu ngắn nên chỉ Góp ý; Bài 8 nói cùng ý bằng lời ("số bị chia bằng số chia nhân với thương").
- Sửa: tuỳ tác giả, vd "Số bị chia bằng số chia nhân với một số nguyên q thì phép chia là chia hết, và thương bằng q. Số chia phải khác 0." giữ hai dòng `tex`.
