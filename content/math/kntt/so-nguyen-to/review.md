# Review: Số nguyên tố (`so-nguyen-to`)

- Bài: `content/math/kntt/so-nguyen-to/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff`): `explain` của cả 65 câu (vòng 5 tìm 1 Nghiêm trọng đã sửa, vòng 6 sạch); trước đó vòng 4: câu chào ở `overview.hook`, lời đọc Gemini, 3 video
- Nguồn đã đọc: `sources/math/so-nguyen-to/` - sbt-p35, sbt-p36, sbt-p37, sbt-p106, sbt-p107
- `content:check`: 0 lỗi của bài; `video:check`: ok; `lesson:walk`: 0 failures, 0 warnings
- Kết luận: Đã xuất bản (0 lỗi Nghiêm trọng còn lại sau khi sửa; đã chạy `pnpm content:hash so-nguyen-to --approve`)
- Bản đã review: `9c611ec783a95cf78d1e8fe58600066471374f48aa4a1766c9b71d3e78ea2dd4` (`pnpm content:diff` so với bản này)

## Vòng 4: video và lời đọc

Đã soát: kịch bản và `report.json` Whisper của 3 video, `overview.hook` và lời đọc, mọi khung hình ba video (sheet mỗi 2 giây, khung đổi xem lại theo từng 1,5 và 2 giây), mốc chữ của mọi hình khớp lời, câu `rule` khớp bài (`video:check`), cách đọc số 1, quy ước tích (m · k: m được lấy k lần).

- Nghiêm trọng (đã sửa): `tra-bang`, câu chốt "Số lớn hơn 1 mà không có trong bảng là hợp số" bỏ vế "nhỏ hơn 100" của quy tắc, nên với số 101 trẻ kết luận sai (101 là số nguyên tố). Câu chốt thành "Bạn nhớ nhé: số nhỏ hơn 100 có trong bảng là số nguyên tố." và "Số lớn hơn 1, nhỏ hơn 100 mà không có trong bảng là hợp số."; màn chốt có thêm nhãn "số nhỏ hơn 100" hiện đúng lúc nói (LL-17).
- Nên sửa (đã sửa): `phan-tich`, dòng "12 = 2 · 2 · 3" hiện ở chữ "tích" của "phân tích", hơn 4 giây trước lúc nói "tích của các số nguyên tố", và 28 giây trước lúc cây ra kết quả; nay hiện ở chữ "tích" thứ hai (LL-11).
- Nên sửa (đã sửa): `xep-gach`, "Còn 1 viên gạch?" đọc được là "còn lại 1 viên"; đổi thành "Xếp 1 viên gạch thì sao? Chỉ có một cách." (LL-10).
- Whisper: "Ta tìm 59/77 trong bảng" nghe "bản" (96,8% và 96,7%). Nghe lại hai câu với và không có gợi ý ngữ cảnh: khi có gợi ý "bảng số nguyên tố" cả hai câu ra đúng "bảng", không gợi ý ra "bản"; giọng Mỹ Duyên miền Nam nuốt âm cuối "ng". Chữ "bảng" luôn hiện trên phụ đề, nhãn "bảng số nguyên tố" và bảng 25 số luôn ở trên màn, nên chấp nhận, không đổi câu. Lời đọc Gemini: "thừa số" nghe "thử số" ở hai câu (98,2% và 97,3%), cùng lý do, nhãn và phụ đề đủ nên chấp nhận.
- Góp ý: `phan-tich` có khoảng 2 giây màn trống (chỉ có bạn cú) ở đầu cảnh sơ đồ cột, trong lúc đọc "Cách thứ hai là sơ đồ cột"; câu "4 bằng 2 nhân 2" chưa nói 4 là hợp số nên tách tiếp (hình đã tô 4 màu hợp số).
- Clip (`videos[].clips`) khớp thẻ: `uoc`, `nguyen-to`, `hop-so`, `bang`, `cay`, `cot`; không clip nào gắn thẻ mà đoạn không giảng.

## Vòng 5 - chỉ phần đổi: explain

- Phạm vi: `pnpm content:diff so-nguyen-to` so với bản đã review ở vòng 4: chỉ thêm `explain` vào 65 câu (không đổi đề, đáp án, hình, note, recap).
- Nguồn đã đọc: không cần (không có kiến thức mới ngoài bài; số liệu đối chiếu `catalog.ts` và `params`).
- `content:check`, `lesson:walk`: do điều phối chạy (reviewer chỉ đọc).
- Kết luận vòng 5: Chưa đạt: còn 1 lỗi Nghiêm trọng (bên dưới). Chưa chạy lệnh cuối vòng; dòng "Bản đã review" ở đầu tệp vẫn là của vòng 4.

Đã soát: tự giải lại cả 65 câu trước khi đọc `explain`; tính lại mọi phép tính và mọi lý do trong `text`, `tex`, `wrong` (mọi tích, hiệu, tổng, phép chia; tính nguyên tố của từng số được nhắc, tra theo bảng dưới 100); đối chiếu mọi `wrong[].optionId` với nội dung phương án; đối chiếu 7 câu `manipulate` (`chon-uoc-18`, `chon-nt-bank`, `chon-hs-bank`, `chon-nt-bang-2`, `chon-hs-dh-2`, `chon-a-1`, `chon-hs-chan-bank`) với `items` và `params` trong `catalog.ts`: tập chip đúng khớp lời giải; đối chiếu 5 hình `cay-thieu-28`, `cay-thieu-45`, `cot-thieu-36`, `cot-thieu-330`, `cot-thieu-78` với chỉ số ô `hide` (ô ẩn đúng là 7, 9, 18, 3, 39); mọi `explain` ≤ 3 câu; không `explain` nào dùng khái niệm chưa học hay lý lẽ sai với số khác (kể cả quy tắc "chia hết cho 2, 3, 5 mà lớn hơn số chia", "số chẵn lớn hơn 2", "tổng lẻ phải có số 2", "tổng chia hết"). Số 1 ở `chi-mot-uoc`, `cach-viet-15`, `viet-ba-19`, `viet-44` đúng quy ước của bài. Tích `m · k` đúng ở `xep-gach-15` (5 · 3), `hs-tong-keo`, `hs-tong-nhieu`, `hs-tong-2`, `dien-tong-5`.

### Nghiêm trọng

#### 1. `wrong` của `xep-18-cach` gắn nhầm phương án (LL-17)

- Vị trí: `$.exercises[13].explain.wrong[0]` (`xep-18-cach`, `optionId: "c"`)
- Nguồn: —
- Vấn đề: phương án `c` là "4", nhưng lý do viết cho nó ("18 · 1, 9 · 2 và 6 · 3 chỉ là xoay hình của ba cách trên, không tính thêm") giải thích lỗi đếm cả hai chiều xoay, tức 3 + 3 = 6, là phương án `d`. Trẻ chọn 4 nhận lý do không liên quan tới số 4; trẻ chọn 6 không nhận lý do nào.
- Sửa: đổi `optionId` thành `"d"`. Nếu muốn có cả lý do cho 4, thêm một mục `c` riêng, ví dụ "4 không phải số cách: 18 viết được thành 1 · 18, 2 · 9 và 3 · 6, chỉ có ba tích."

### Nên sửa

#### 1. Quy ước tích `m · k` bị đảo ở bốn `explain` về xếp hàng (LL-05)

- Vị trí: `$.exercises[10].explain` (`hs-gach-10`), `$.exercises[47].explain` (`lop-38`), `$.exercises[9].explain` (`xep-13-cach`), `$.exercises[13].explain` (`xep-18-cach`)
- Nguồn: quy ước của bài: "n hàng, mỗi hàng m" viết `m · n` (hình `rects` vẽ `perRow · rows`; `xep-gach-15` viết 5 · 3 cho 3 hàng, mỗi hàng 5)
- Vấn đề: `hs-gach-10` viết "2 hàng bằng nhau, mỗi hàng 5 viên, nên 10 = 2 · 5" và `lop-38` viết "2 hàng ... mỗi hàng 19 bạn, nên 38 = 2 · 19": thứ tự ngược quy ước, và ngược chính hình `xep-*` trẻ vừa xem. `xep-13-cach` ghép "13 = 1 · 13" với "1 hàng 13 viên" (đúng quy ước là 13 · 1). `xep-18-cach` coi 18 · 1, 9 · 2, 6 · 3 là bản xoay của 1 · 18, 2 · 9, 3 · 6, trong khi theo quy ước ba cách xếp (1, 2, 3 hàng) chính là 18 · 1, 9 · 2, 6 · 3.
- Sửa: `hs-gach-10`: "... mỗi hàng 5 viên, nên 10 = 5 · 2", `tex` "10 = 10 \\cdot 1 = 5 \\cdot 2". `lop-38`: "... mỗi hàng 19 bạn, nên 38 = 19 · 2", `tex` "38 = 19 \\cdot 2". `xep-13-cach`: "13 chỉ viết được là 13 · 1, nên chỉ có một cách: 1 hàng 13 viên", `tex` "13 = 13 \\cdot 1". `xep-18-cach`: `tex` "18 = 18 \\cdot 1 = 9 \\cdot 2 = 6 \\cdot 3", câu `wrong` (sau khi đổi sang `d`) "1 · 18, 2 · 9 và 3 · 6 chỉ là xoay hình của ba cách trên, không tính thêm."

#### 2. Ba `explain` nói "không có trong bảng nên là hợp số" bỏ vế "nhỏ hơn 100" (LL-17)

- Vị trí: `$.exercises[18].explain.text` (`chon-nt-bang-2`), `$.exercises[19].explain.text` (`nt-lon-nhat`), `$.exercises[45].explain.text` (`a-4a-hop-so`)
- Nguồn: note quy tắc "Muốn biết số nhỏ hơn 100 có là số nguyên tố không, ta tra bảng"; vòng 4 đã ghi Nghiêm trọng đúng kiểu này ở video `tra-bang` (số 101)
- Vấn đề: "Các số 63, 69 và 81 không có trong bảng nên là hợp số" (và hai câu tương tự) phát biểu như quy tắc chung; trẻ mang sang số 101 hay 103 sẽ kết luận sai. Ba câu này đúng với từng số (đều nhỏ hơn 100) nhưng nối "không có trong bảng" thẳng với "hợp số". Bốn câu còn lại cùng kiểu (`nha-57`, `tra-bang-nhieu`, `dien-91`, và `chon-nt-bank`) đã có vế đó hoặc chỉ ra ước.
- Sửa: `chon-nt-bang-2`: "Các số 63, 69 và 81 nhỏ hơn 100 mà không có trong bảng nên là hợp số." `nt-lon-nhat`: "Các số 93, 95 và 99 nhỏ hơn 100 mà không có trong bảng nên là hợp số." `a-4a-hop-so`: "... còn 42 và 49 nhỏ hơn 100 mà không có trong bảng nên là hợp số."

#### 3. `dien-31` chỉ chép lại câu đề, không nêu lý do (checklist: chỉ lặp lại đáp án)

- Vị trí: `$.exercises[8].explain.text` (`dien-31`)
- Nguồn: —
- Vấn đề: "31 lớn hơn 1 và chỉ chia hết cho 1 và 31, đúng với cách gọi số nguyên tố" lặp nguyên câu đề; trẻ chưa biết vì sao không phải "hợp số".
- Sửa: "Số nguyên tố chỉ có hai ước là 1 và chính nó; hợp số có từ ba ước trở lên. 31 chỉ có hai ước là 1 và 31, nên là số nguyên tố. Số 31 cũng có trong bảng số nguyên tố." (3 câu), `tex` "31 = 1 \\cdot 31".

### Góp ý

#### 1. `chi-mot-uoc`: "Số nào cũng có ước 1 và ước là chính nó" quá rộng với số 0

- Vị trí: `$.exercises[15].explain.text`
- Vấn đề: note của bài chỉ nói về "số khác 0"; số 0 không có ước là chính nó. Không ảnh hưởng đáp án và trẻ lớp 6 ít gặp, nên chỉ Góp ý.
- Sửa: "Số tự nhiên khác 0 nào cũng có ước 1 và ước là chính nó."

#### 2. `chon-nt-nhieu-1`: "tích của hai số nhỏ hơn chúng" dễ đọc lệch

- Vị trí: `$.exercises[6].explain.text`
- Vấn đề: 17 = 1 · 17 cũng là tích của hai số, trong đó 1 nhỏ hơn 17; trẻ chậm có thể thấy mâu thuẫn. Các `explain` khác của bài dùng "hai thừa số lớn hơn 1".
- Sửa: "17 và 19 không viết được thành tích của hai số lớn hơn 1, còn 6 và 15 thì viết được."

#### 3. `tong-31` và `tong-35-khong`: thiếu mắt xích vì sao tổng lẻ thì phải có số 2

- Vị trí: `$.exercises[52].explain.text`, `$.exercises[53].explain.text`
- Vấn đề: cả hai viết "Tổng ... là số lẻ, nên ... phải là số 2" mà không nói lý do, trong khi quy tắc của bài dựa vào "hai số lẻ cộng lại là số chẵn" và "số nguyên tố khác 2 đều lẻ". Trẻ chỉ nhớ máy móc.
- Sửa: thêm vế "vì số nguyên tố khác 2 đều lẻ, hai số lẻ cộng lại là số chẵn" vào câu đầu (vẫn ≤ 3 câu; `tong-35-khong` hiện có 2 câu).

#### 4. `hs-tong-keo`: chưa dùng quy tắc tổng của section

- Vị trí: `$.exercises[61].explain.text`
- Vấn đề: giải theo "38 chia hết cho 2" mà quy tắc của section là "các số hạng đều chia hết cho một số thì tổng chia hết cho số đó"; 18 và 20 đều chia hết cho 2 là chỗ để nối với quy tắc.
- Sửa: "Số kẹo của Hà là 9 · 2 + 5 · 4 = 18 + 20 = 38. Cả 18 và 20 chia hết cho 2 nên 38 chia hết cho 2, mà 38 lớn hơn 2 nên là hợp số."

## Vòng 6 - chỉ phần đổi: explain

- Phạm vi: `pnpm content:diff so-nguyen-to` so với bản đã review ở vòng 4: `explain` của cả 65 câu (mọi `exercises[]`).
- Nguồn đã đọc: không cần (không có kiến thức mới; số liệu đối chiếu `catalog.ts`).
- `content:check`, `lesson:walk`: do điều phối chạy (reviewer chỉ đọc). Chưa chạy `content:hash`/`content:lock`.
- Kết luận vòng 6: 0 Nghiêm trọng, 0 Nên sửa, 3 Góp ý. Các bản sửa của vòng 5 đều đạt; điều phối chạy lệnh cuối vòng.

Đã soát: tự giải lại cả 65 câu trước khi đọc `explain`; tính lại mọi tích, hiệu, tổng, phép chia và tính nguyên tố của từng số được nhắc; đối chiếu mọi `wrong[].optionId` với nội dung phương án (không `optionId` nào trỏ tới đáp án đúng hay không có trong `options`); đếm câu bằng script: mọi `text` ≤ 3 câu, mọi lý do `wrong` đúng một câu. Đối chiếu bản sửa vòng 5:
- `xep-18-cach`: `wrong` nay ở `d` ("18 có 6 ước ..."), lý do khớp phương án 6; `tex` `18 = 18 · 1 = 9 · 2 = 6 · 3`.
- Quy ước `m · k` đúng ở `hs-gach-10` (5 · 2), `lop-38` (19 · 2), `xep-13-cach` (13 · 1), `xep-18-cach`, `xep-gach-15` (5 · 3), `hs-tong-keo` (9 · 2 + 5 · 4), `hs-tong-nhieu`, `hs-tong-2`, `dien-tong-5`.
- "nhỏ hơn 100" có ở `chon-nt-bang-2`, `nt-lon-nhat`, `a-4a-hop-so`, `nha-57`, `tra-bang-nhieu`, `dien-91`; các câu còn lại chỉ ra ước, không nối "không có trong bảng" với "hợp số" cho số tuỳ ý.
- `dien-31` nay nêu lý do (số nguyên tố hai ước, hợp số từ ba ước); `chi-mot-uoc` ("Số tự nhiên khác 0"), `chon-nt-nhieu-1` ("hai số lớn hơn 1"), `tong-31`, `tong-35-khong` (vì sao tổng lẻ phải có số 2), `hs-tong-keo` (18 và 20 cùng chia hết cho 2) đều đúng và không tạo lỗi mới. Số 1 không phải số nguyên tố cũng không phải hợp số ở `chi-mot-uoc`, `cach-viet-15`, `viet-ba-19`, `viet-44`.
- 7 câu `manipulate`: tập chip đúng khớp lời giải (`chon-uoc-18` 1, 2, 4, 6, 9, 12, 18; `chon-nt-bank` 43, 47; `chon-hs-bank` 26, 12, 15; `chon-nt-bang-2` 61, 67, 89; `chon-hs-dh-2` 24, 45, 60; `chon-a-1` a = 1, 3, 7, 9; `chon-hs-chan-bank` 64, 68). Hình `cay-thieu-28`, `cay-thieu-45` (ô ẩn 7, 9) đúng với `explain`.
- Mọi `explain` không dùng khái niệm chưa học ("bội", "thương", "thừa số", "luỹ thừa" đều có trong bài trước hay glossary).

### Nghiêm trọng

Không có.

### Nên sửa

Không có.

### Góp ý

#### 1. `chon-uoc-18`: `text` liệt kê ước thiếu 3 trong khi `tex` có 3 · 6

- Vị trí: `$.exercises[2].explain.text` (`chon-uoc-18`)
- Vấn đề: "Vậy 1, 2, 6, 9 và 18 là ước của 18" đúng với chip trên màn (không có chip 3), nhưng `tex` `18 = 1 · 18 = 2 · 9 = 3 · 6` cho thấy 3 cũng là ước; trẻ chậm có thể hỏi vì sao 3 không được kể.
- Sửa: "... Vậy 1, 2, 6, 9 và 18 là ước của 18 (và 3 cũng là ước, nhưng không có trong các số trên màn)." hoặc đổi `tex` thành `18 = 1 \\cdot 18 = 2 \\cdot 9 = 6 \\cdot 3`.

#### 2. `hs-tong-nhieu`: bỏ vế "tổng lớn hơn số chia" ở lý lẽ

- Vị trí: `$.exercises[62].explain.text`
- Vấn đề: "cả hai số hạng chia hết cho 2 nên tổng là hợp số" (và "chia hết cho 3 ...") thiếu điều kiện tổng lớn hơn số chia, trong khi `dien-tong-5` và `hs-tong-2` có vế đó. Đúng với 76 và 93; chỉ lệch với cách nói ở hai câu cùng section.
- Sửa: "36 + 40 = 76, cả hai số hạng chia hết cho 2 và 76 lớn hơn 2, nên tổng là hợp số. 30 + 63 = 93, cả hai chia hết cho 3 và 93 lớn hơn 3, nên tổng là hợp số." (vẫn 3 câu).

#### 3. `cot-thieu-330`: câu đầu "thương của số hàng trên cho số chia" khó đọc

- Vị trí: `$.exercises[32].explain.text`
- Vấn đề: cách nói "thương của số hàng trên cho số chia" vòng vo với trẻ chậm; `cot-thieu-36` đã nói gọn "chia số bên trái cho số nguyên tố bên phải".
- Sửa: "Mỗi hàng, ta chia số hàng trên cho số chia để được số hàng dưới. 165 chia cho số chia được 55, mà 165 : 55 = 3 nên số chia là 3. Số 3 là số nguyên tố nhỏ nhất mà 165 chia hết."

## Phát hiện còn lại của vòng 3 (chưa sửa, không chặn)

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
