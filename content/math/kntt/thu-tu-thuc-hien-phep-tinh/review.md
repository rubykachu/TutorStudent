# Review: Thứ tự thực hiện các phép tính (`thu-tu-thuc-hien-phep-tinh`)

- Bài: `content/math/kntt/thu-tu-thuc-hien-phep-tinh/lesson.json`
- Vòng: 8 - chỉ phần đổi (`pnpm content:diff thu-tu-thuc-hien-phep-tinh`), phạm vi: `explain` thêm vào cả 69 câu `exercises` (không đổi gì khác)
- Nguồn đã đọc: không cần ảnh SGK (`explain` là lời của bài, không có kiến thức mới); đối chiếu với note, quy tắc, recap của từng section, `content/glossary/math.json`, `docs/learner.md`, LL-17, LL-21, LL-22
- Cách soát: tự tính lại mọi dòng `tex` bằng script một lần: mọi dòng của một khối `aligned` bằng cùng một giá trị, phần tô hồng của dòng i thay bằng kết quả của nó đúng bằng dòng i + 1, ô amber bằng đáp án; render thử cả 67 `tex` bằng KaTeX với macro `\concept` (0 lỗi); đối chiếu từng `wrong.optionId` với nội dung phương án thật
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 0 cảnh báo explain, tiếng Việt hay độ dài của bài
- `lesson:walk`: không chạy (chỉ soát nội dung chữ)
- Kết luận: Đã xuất bản: 0 Nghiêm trọng. 4 mục Nên sửa mới (câu "tra bảng nhân", "khoanh hồng" thành "tô hồng", mỗi dòng một phép tính ở 5 câu tính dài và các câu tô hai phép, text của `tinh-ngoac-day-du`) đã sửa trong commit sau vòng này; Nên sửa 1 (video `hoa-don`) đã sửa; còn mở các Góp ý
- Bản đã review: `d6ed894148fd3da0b8d6ba64439bebcfba3d40d25e915074c9d8b9fcaed06152` (`pnpm content:diff` so với bản này)

Đã soát đạt:
- Toán: 69/69 `explain`. Mọi kết quả khớp đáp án của câu (tự tính lại 48 khối nhiều dòng và các câu không có `tex`); mọi dòng trong khối có cùng giá trị; phần tô hồng luôn là phép đúng theo quy tắc (nhân, chia trước cộng, trừ; trong ngoặc, ngoặc tròn rồi vuông rồi nhọn; luỹ thừa trước nhân, chia; cộng trừ, nhân chia từ trái sang phải); chữ trong `text` khớp số trong `tex`.
- `wrong` (36 lý do, 17 câu `choice`): `optionId` nào cũng đúng phương án mà lý do nói (đối chiếu theo nội dung, không theo vị trí); không lý do nào gắn vào đáp án đúng; không lý do nào nói điều sai chung (ví dụ `chon-phep-ngoac-2`: 36 : 2 làm trước khi không có ngoặc, đúng; `chon-dong-dung-3` phương án b: số mũ chỉ thuộc số 3, đúng).
- LL-22: không `explain` nào dùng "ngoặc", "luỹ thừa", "số mũ", "vế phải", "làm ngược", biến chữ ở section đứng trước section dạy chúng (quét từng câu theo section của thẻ, cả câu kho ôn); không câu nào nhắc "đáp án a, b, c" hay vị trí lựa chọn.
- Chữ: tối đa 3 câu mỗi `text`, không khen, chính tả "luỹ thừa" (không có "lũy"), thuật ngữ khớp quy tắc ("làm từ trái sang phải", "trong ngoặc làm trước", "luỹ thừa làm trước nhân, chia").
- `tex`: ngoặc nhọn cân, 67/67 render được, dấu trừ sau ô tô màu vẫn là phép trừ (không bị coi là dấu âm), không dòng nào của khối rộng quá 24 ký tự toán ngoài các dòng biểu thức đã có ở đề; màu amber luôn là kết quả, teal, sky, lime đúng cho ngoặc tròn, vuông, nhọn ở `noi-ngoac-voi-ten` và `sap-thu-tu-ngoac`.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. `ex.nhan-7-8`, `ex.nhan-9-6`: "Tra bảng nhân" nhưng màn không có bảng nhân (LL-22), kèm mẹo khó hiểu

- Vị trí: `explain.text` của hai câu (section `on-nhan-chia`)
- Nguồn: —
- Vấn đề: `nhan-7-8` ghi "Tra bảng nhân: 7 · 8 = 56. Nếu quên, hãy nhớ dãy 5, 6, 7, 8: 56 = 7 · 8." và `nhan-9-6` mở đầu "Tra bảng nhân: ...". Section `on-nhan-chia` không hiện bảng nhân nào, nên lời khuyên tra bảng không làm được. "Dãy 5, 6, 7, 8" là mẹo thuộc lòng không giải thích, bé chậm đọc sẽ không hiểu 5, 6, 7, 8 liên quan gì tới 56.
- Sửa: `nhan-7-8`: "Đây là phép nhân trong bảng nhân, cần nhớ. Nếu quên, tách 7 · 8 = 7 · 5 + 7 · 3 = 35 + 21 = 56." (hay giữ ngắn: "Nhớ bảng nhân: 7 · 8 = 56. Nếu quên, tách 8 = 5 + 3: 7 · 5 + 7 · 3 = 35 + 21 = 56."). `nhan-9-6`: bỏ "Tra bảng nhân:", mở đầu "Cách nhẩm: 10 · 6 = 60, bớt đi một lần 6 thì còn 54." (đã đúng sẵn).

### 2. Câu section `bai-tap-sach`: `explain` làm 2 đến 3 phép tính trong một dòng, trái note và recap "mỗi dòng chỉ làm một phép tính"

- Vị trí: `ex.tinh-day-du-kiem-tra` (dòng 2: 4 · 100 và 3 · 10), `ex.tinh-day-du-1` (dòng 2: ba phép nhân), `ex.tinh-day-du-2` (dòng 1: 1⁹ và 3²; dòng 2: 4 · 1 và 2 · 3), `ex.tinh-day-du-3` (dòng 2: ba phép nhân), `ex.tinh-ngoac-day-du` (dòng 6: 2³ và 3 · 16)
- Nguồn: —
- Vấn đề: note section "Biểu thức dài: mỗi dòng chỉ làm một phép tính", caption hình `tong-hop-tung-buoc` "Mỗi dòng làm một phép tính, phép tính làm trước được khoanh hồng" và bộ dựng bước (`expression.ts`: một phép mỗi bước) đều dạy một phép mỗi dòng; các `explain` này tô hồng nhiều phép một dòng và `text` ghi "làm cả ba phép nhân". Bé vừa học một phép mỗi dòng rồi thấy lời giải làm ngược lại. Số học vẫn đúng.
- Sửa: tách thành một phép mỗi dòng theo thứ tự trái sang phải, ví dụ `tinh-day-du-1`: 3 · 2³ + 5 · 4 − 2 · 7 → 3 · 8 + 5 · 4 − 2 · 7 → 24 + 5 · 4 − 2 · 7 → 24 + 20 − 2 · 7 → 24 + 20 − 14 → 44 − 14 → 30; sửa `text` cho khớp ("Rồi nhân từ trái sang phải: 3 · 8 = 24, 5 · 4 = 20, 2 · 7 = 14"). Hoặc, nếu muốn giữ lời giải ngắn, bỏ cụm "mỗi dòng chỉ làm một phép tính" khỏi note bằng ý "các phép nhân ở xa nhau làm cùng một dòng được" (cần sửa luôn recap và caption cho khớp, nên chọn cách đầu).

### 3. `ex.chon-nhieu-nhan-chia-truoc`, `ex.chon-nhieu-trong-ngoac-truoc`, `ex.chon-nhieu-luy-thua-truoc`: "được khoanh hồng" nhưng `tex` chỉ tô màu chữ

- Vị trí: `explain.text` ba câu: "...được khoanh hồng", "phép trong ngoặc được khoanh hồng", "...được khoanh hồng"
- Nguồn: —
- Vấn đề: `\concept{pink}{...}` trong `Formula` chỉ đổi màu chữ (không có vòng khoanh như hình từng bước), nên trên màn không có thứ nào "khoanh". Chữ nói về một dấu hiệu không có (LL-22).
- Sửa: đổi thành "được tô hồng" (hoặc "màu hồng"): "Ba biểu thức đúng đều có nhân hoặc chia, phép đó được tô hồng."

### 4. `ex.tinh-ngoac-day-du`: `text` không nói phép nhân, trừ bên trong ngoặc, nên lệch với `tex`

- Vị trí: `$.exercises[?(@.id=="thu-tu-thuc-hien-phep-tinh.ex.tinh-ngoac-day-du")].explain.text`
- Nguồn: —
- Vấn đề: `text` "Làm từ ngoặc trong ra ngoài: ngoặc tròn, ngoặc vuông, rồi ngoặc nhọn. Sau đó làm luỹ thừa 2³, rồi nhân, cuối cùng cộng." không có số nào và không nói trong từng ngoặc còn nhân trước trừ, cộng; trong khi `tex` có dòng 5 · 3 (trước − 9) và 2 · 6 (trước 4 +). Bé đọc `text` rồi nhìn `tex` thấy phép nhân chen vào giữa các ngoặc mà không có lời giải thích. Đây là câu khó nhất bài, và là câu bé hay sai (hồ sơ: chỗ yếu "thứ tự thực hiện phép tính").
- Sửa: "Ngoặc tròn làm trước: 7 − 4 = 3. Trong ngoặc vuông, nhân trước trừ sau: 5 · 3 = 15, rồi 15 − 9 = 6. Trong ngoặc nhọn nhân 2 · 6 = 12 rồi cộng 4 được 16; cuối cùng 2³ = 8, 3 · 16 = 48 và 8 + 48 = 56." (nếu quá 3 câu thì bỏ câu cuối, `tex` đã có).

### 5. Video `hoa-don`: mp4 vẫn khoanh hồng cách làm sai của Lan (bản sửa chỉ có trong `index.html`) - Đã sửa

- Vị trí: `public/media/video/thu-tu-thuc-hien-phep-tinh/hoa-don.mp4` cảnh `s03-lan`, 24–31 s; `video/projects/thu-tu-thuc-hien-phep-tinh/hoa-don/index.html` dòng `tl.to("#m-ring", { borderColor: slate … })`
- Nguồn: —
- Vấn đề: Nên sửa 1 vòng 4. `index.html` đã đổi vòng quanh `8 + 5` sang xám, nhưng `hoa-don.mp4` (render 20:39, trước lần sửa) vẫn hiện vòng hồng ở khung 24, 27, 30 s; bản render trong `renders/site/index.html` còn `borderColor: pink`. Hồng trong bài nghĩa là "phép làm trước" (đúng), nên cách làm sai của Lan mang cùng màu với cách đúng của Nam.
- Sửa: Chạy lại `pnpm video:build thu-tu-thuc-hien-phep-tinh hoa-don` trong worktree, xem lại khung 24–31 s, cập nhật `videos[0]` nếu độ dài hay clip đổi.
- Kết quả: đã sửa. `hoa-don.mp4` hiện tại (render 30/9 22:00, sau bản sửa) hiện vòng xám quanh `8 + 5` của Lan ở các khung 24–31 s, vòng hồng chỉ còn ở cách đúng của Nam (`2 · 8`); `index.html` khớp mp4 nên không dựng lại. `pnpm video:check thu-tu-thuc-hien-phep-tinh hoa-don` ok; `lesson.json` không đổi.

## Góp ý

### 1. Một dòng tô hồng hai phép ở câu không thuộc `bai-tap-sach`

- Vị trí: `ex.tinh-luy-thua-2` (dòng 1: 2³ và 3²), `ex.tinh-chu-3` (dòng 2: 3² và 2 · 3), `ex.tim-x-1` (dòng 2: 2 · 9 và 6 : 3), `ex.tim-x-3` (dòng 2: 5 · 4 và 9 : 3)
- Nguồn: —
- Vấn đề: cùng loại với Nên sửa 2 nhưng section của chúng không có note "một phép mỗi dòng"; hai phép độc lập, không sai. Hình từng bước của chính bài vẫn làm một phép mỗi bước.
- Sửa: nếu sửa Nên sửa 2 theo cách tách dòng thì tách luôn bốn câu này cho đồng nhất; không thì để.

### 2. Câu ngoặc lồng: dấu ngoặc trong `tex` chưa mang màu teal, sky, lime

- Vị trí: `ex.chon-phep-ngoac-long`, `ex.tinh-ngoac-long-1`, `ex.tinh-ngoac-long-2`, `ex.tinh-ngoac-long-3`, `ex.tinh-ngoac-day-du`
- Nguồn: —
- Vấn đề: hình của bài vẽ ngoặc tròn teal, vuông sky, nhọn lime (`expr-svg.tsx`), còn các `tex` này để dấu ngoặc đen hoặc hồng, nên `text` nói "ngoặc tròn, ngoặc vuông, ngoặc nhọn" mà bé không thấy màu để nối với hình đã học. Không sai, chỉ chưa nhất quán với màu khái niệm.
- Sửa: nếu muốn, lồng `\concept{teal}{(}` ... cho dấu ngoặc trong phần tô hồng (ví dụ `\concept{pink}{\concept{teal}{(}5+3\concept{teal}{)}}`) sau khi thử trên điện thoại cho không rối; không bắt buộc.

### 3. Hai câu `text` dài hơn mức dễ đọc

- Vị trí: `ex.tinh-ngoac-long-2` ("Làm từ ngoặc trong ra ngoài: ngoặc tròn 5 + 3 = 8, ngoặc vuông 12 − 8 = 4, ngoặc nhọn 1 + 4 = 5." 27 từ một câu); `ex.tinh-day-du-kiem-tra` ("Rồi làm hai phép nhân 4 · 100 = 400 và 3 · 10 = 30, cuối cùng cộng từ trái sang phải được 436." 25 từ)
- Nguồn: —
- Vấn đề: bé chậm khó giữ một câu dài đầy số; vẫn trong giới hạn 3 câu.
- Sửa: tách theo bước: "Ngoặc tròn trước: 5 + 3 = 8. Rồi ngoặc vuông 12 − 8 = 4, ngoặc nhọn 1 + 4 = 5. Cuối cùng nhân 4 · 5 = 20." (giữ 3 câu).

### 4. `ex.chon-nhieu-luy-thua-truoc`: câu "Biểu thức có luỹ thừa thì làm luỹ thừa đầu tiên" thiếu điều kiện không có ngoặc (LL-17)

- Vị trí: `explain.text` của câu
- Nguồn: —
- Vấn đề: ở section này bé đã học ngoặc, nên câu khái quát thiếu điều kiện: 2 · (3 + 4)² có ngoặc làm trước luỹ thừa. Ba lựa chọn của câu đều không có ngoặc nên đáp án đúng, chỉ lời giải thích nói rộng hơn quy tắc của bài ("Có luỹ thừa thì tính luỹ thừa trước, rồi nhân, chia, cuối cùng cộng, trừ" cũng chưa nói tới ngoặc).
- Sửa: "Các biểu thức này không có ngoặc, nên có luỹ thừa thì làm luỹ thừa đầu tiên. Hai biểu thức đúng có 2² và 2³, được tô hồng."

### 5. Whisper vẫn nghe câu thứ tự ngoặc thành "ngọt buông", "ngọt nhọn"

- Vị trí: `video/projects/thu-tu-thuc-hien-phep-tinh/ngoac-long/renders/report.json` (bản render mới), "Rồi làm ngoặc vuông." (match 0,842, 4 lần), "Cuối cùng làm ngoặc nhọn." (0,875, 4 lần); "Ngoặc vuông là hộp vừa." nghe thành "Ngọc Vương" (0,955)
- Nguồn: —
- Vấn đề: Góp ý 3 vòng 4, chưa có ghi nhận đã nghe lại. Đây là các câu nêu thứ tự ngoặc; nếu giọng thật sự méo, trẻ nghe sai tên ngoặc. Reviewer không nghe được âm thanh.
- Sửa: Tác giả nghe lại ba câu này; méo thì đọc lại (đổi seed hoặc tách câu).

### 6. `ex.chon-nhieu-luy-thua-truoc`: ba nhiễu đều không có luỹ thừa

- Vị trí: `$.exercises[?(@.id=="thu-tu-thuc-hien-phep-tinh.ex.chon-nhieu-luy-thua-truoc")].options` (b, d, e)
- Nguồn: —
- Vấn đề: Sau khi bỏ `(1 + 2) · 3²`, cả ba nhiễu là biểu thức không có số mũ, nên câu chỉ kiểm trẻ có nhận ra số mũ hay không, chưa có nhiễu "có luỹ thừa nhưng không làm đầu tiên". Vẫn đúng một tập đáp án (a, c) và không sai kiến thức; nhiễu có luỹ thừa mà luỹ thừa không làm đầu tiên cần ngoặc, mà bài chưa dạy ngoặc đi cùng luỹ thừa (LL-14, LL-09).
- Sửa: Không bắt buộc. Nếu sau này section dạy ngoặc đi cùng luỹ thừa thì thêm lại một nhiễu dạng đó.
