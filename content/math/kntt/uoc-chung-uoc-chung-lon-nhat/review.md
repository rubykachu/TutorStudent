# Review: Ước chung. Ước chung lớn nhất (`uoc-chung-uoc-chung-lon-nhat`)

- Bài: `content/math/kntt/uoc-chung-uoc-chung-lon-nhat/lesson.json`
- Vòng: 8 - chỉ phần đổi (`pnpm content:diff`), 6 video mới của section 14 đến 19 (`viet-tu-uclnn`, `cap-so-gioi-han`, `cap-so-tong`, `cap-so-tich`, `cung-so-du`, `so-du-lon-nhat`); diff chỉ có 6 khối `video` ở đầu 6 section và 6 mục `videos[]`
- Nguồn đã đọc: `sources/math/uoc-chung-uoc-chung-lon-nhat/` - vòng này không đối chiếu ảnh nguồn mới: diff chỉ có video, các số trong video đều là số của chính bài (section 14 đến 19), đã đối chiếu từng số với `note`, recap và `catalog.ts`; số của sách (sbt-p38, p40, p108) đã soát ở vòng 6 và 7
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường, chờ duyệt), 1 cảnh báo (6 id video chưa khoá, điều phối sẽ chạy `content:lock`); `pnpm video:check uoc-chung-uoc-chung-lon-nhat` ok cả 9 video
- Đọc hiểu (Haiku, lượt 1): 163 / 10 / 0; tệp `.shots/review/uoc-chung-uoc-chung-lon-nhat/doc-hieu.md` (dòng "Tổng cả bài" của tệp ghi 163 / 10 / 0; đếm lại từ các dòng của tệp ra 168 / 8 / 0, tức 8 mục Hiểu mơ hồ, nên số rút kinh nghiệm tính theo 8)
- Đọc hiểu (Haiku, lượt 2): 0 / 8 / 1 trên 9 mục viết lại (`doc-hieu-2.md`); lượt 3: 3 Hiểu rõ / 5 Hiểu mơ hồ / 1 Khó hiểu trên 9 mục (`doc-hieu-3.md`; dòng "Tổng" của tệp ghi 2 Hiểu rõ nhưng liệt kê 3: quy tắc và recap `cap-so-tich`, explain `tich-144-uclnn-6`). Các mục còn lại sau lượt 3 ghi ở Nên sửa 4, 5 và 7 (quy tắc và recap `cap-so-tong`, quy tắc, recap và câu điền `so-du-lon-nhat`, explain `tich-72-uclnn-3`), không chặn duyệt
- Đọc hiểu (Haiku, vòng 8, 6 kịch bản video): 70 / 6 / 1; các câu nhãn "không rõ" đều là câu quy tắc chép nguyên văn từ bài (riêng câu "Có số a hàng" đã sửa), không viết lại được vì là lời của bài
- `lesson:walk`: chưa chạy ở vòng này (điều phối chạy sau khi duyệt); vòng 7 đã chạy 0 FAIL, `visual:shot` 220/220. Vòng 8 đã đọc contact sheet khung hình của 6 video (`frames-<tên>/sheet-01.png`, `sheet-02.png`), poster `.jpg` và xem lại chỗ chuyển cảnh bằng `ffmpeg`
- Kết luận: vòng 8 có 0 Nghiêm trọng; 6 Nên sửa của video đã sửa và dựng lại video liên quan (bảng "Kết quả vòng 8 đã được xử lý"), 4 Góp ý đã sửa, còn 4 Góp ý để mở không chặn; `content:hash --approve` và `content:lock` chạy sau khi sửa; đọc hiểu Haiku lượt 2 trên 4 câu video viết lại: 1 / 2 / 1 (Haiku không thấy hình; các câu nhắc lại cách nói đã có ở video cùng dạng)
- Bản đã review: `caf66cb45ab4d4eb986eb82c40cc601835a9ead1868e015fa9c5f4a6d0ea1bf1` (`pnpm content:diff` so với bản này)

Đã soát: toàn bộ diff theo checklist 5 trục, "Luật gợi ý 3 nấc" và LL-01, 02, 05, 06, 07, 09, 10, 14, 15, 17, 18, 19, 20, 25 (vòng 7); vòng 8: "Lời video khớp bài", "Nhịp video cho bé chậm", "Video xem được" của checklist, `script-rules.md`, `docs/learner.md`, LL-02, 03, 05, 11, 12, 15, 21 cho 6 video (kịch bản, `index.html`, `report.json`, `.vtt`, poster, contact sheet).

## Kết quả vòng 8 đã được xử lý

| Mục vòng 8 | Kết quả |
|---|---|
| Nên sửa 1 (`cap-so-tich`, khung m · n = 12 hiện lúc hỏi) | Đã sửa: khung hiện ở chữ "bằng" của câu đáp án; dựng lại video |
| Nên sửa 2 (`cung-so-du`, dấu "16 chia hết cho 4" lúc hỏi) | Đã sửa: hiện ở chữ "Có" của câu đáp án; dựng lại video |
| Nên sửa 3 (`cung-so-du`, teal ở "chia hết cho 4") | Đã sửa: ba khung đổi sang slate |
| Nên sửa 4 (`so-du-lon-nhat`, hiệu 24 và 36 amber) | Đã sửa: hai hiệu để màu chữ thường, amber chỉ còn ở 12 |
| Nên sửa 5 (`viet-tu-uclnn`, lời không nói 6 là ƯCLN) | Đã sửa: câu "Đoạn lớn nhất cắt vừa hết cả hai là 6."; chỉ câu đó đọc lại |
| Nên sửa 6 (`cap-so-tich`, thiếu tiêu chí nhận cặp) | Đã sửa: thêm câu "Hai cặp còn lại chỉ chung ước 1, nên nhận."; hai khung "nhận" hiện cùng câu đó |
| Góp ý 3 (`cap-so-tich`, bước 2 nhân 2) | Đã sửa: hai câu "Số d là 2, nên số d nhân số d bằng 4." và "Vậy 48 bằng 4 nhân số m nhân số n." (video 16 câu) |
| Góp ý 4 (`cap-so-tong`, tỉ lệ hai dải) | Đã sửa: độ rộng 220 và 560 |
| Góp ý 5 (`cung-so-du`, màn chỉ có tiêu đề) | Đã sửa: hình hiệu giữ đến chữ "chia" của câu quy tắc, khung "cùng số dư" hiện từ đó |
| Góp ý 6 (`viet-tu-uclnn`, số 6 slate) | Đã sửa: số 6 amber ở khung cuối |
| Góp ý 1, 2, 7, 8 | Để mở, không chặn (căn cứ câu hỏi 2 và 4, hình hai dải của `cap-so-gioi-han`, Whisper nghe lại, màu glossary "số dư" có từ trước) |

## Vòng 8: video của 6 section cuối

Phạm vi: 6 video mới (`video/projects/uoc-chung-uoc-chung-lon-nhat/<tên>/`), mỗi video gắn ở đầu một section. Đã đọc `script.json`, `index.html`, `renders/report.json`, `.vtt`, poster và contact sheet khung hình; những chỗ chuyển cảnh và chỗ nghi lộ đáp án được kiểm lại bằng `ffmpeg` (chỉ đọc `public/media`). Câu `rule` đã được `video:build` so nguyên văn với bài; vòng này soát các câu không đánh `rule`: không có câu nào nêu quy tắc hay định nghĩa mà thiếu cờ `rule`. Cả 6 video mở bằng câu chào có "bạn" (`opening`), cách đọc chữ cái đều là "số d, số m, số n, số a, số b" và khớp với bài. Clip: cả 6 clip gắn đúng card cùng tên section, đoạn clip bao trọn câu quy tắc của card và không cắt giữa câu.

### Nghiêm trọng

Không có.

### Nên sửa

#### 1. `cap-so-tich`: hình hiện đáp án "m · n = 12" ngay lúc đọc câu hỏi (LL-02)

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/cap-so-tich/index.html` dòng 124 (`pop("#c4", W(sid, "bằng", 2) ...)`) và 125 (cảnh `s02-viet`); câu số 4 của cảnh (`Bạn thử đoán: 48 chia 4 bằng mấy?`, `pause: "ask"`)
- Vấn đề: trong cảnh `s02-viet`, chữ "bằng" xuất hiện lần 1 ở câu quy tắc, lần 2 ở chính câu hỏi, lần 3 ở câu đáp án. Mã dùng lần 2 nên khung "m · n = 12" hiện khi câu hỏi đang đọc và nằm trên màn suốt quãng im lặng, trong khi "48 : 4 = ?" vẫn còn dấu hỏi (sheet khung f-015; poster của video cũng chụp đúng khoảnh khắc này). Bé không còn gì để đoán.
- Sửa: đổi `W(sid, "bằng", 2)` thành `W(sid, "bằng", 3)` ở cả hai dòng (khung hiện khi đọc "Số m nhân số n bằng 12", sau khi "12" thay dấu hỏi), rồi dựng lại video (`video:build`, không đổi lời nên giọng và âm thanh giữ nguyên) và dựng lại poster.

#### 2. `cung-so-du`: hình hiện dấu "✓ 16 chia hết cho 4" ngay lúc đọc câu hỏi (LL-02)

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/cung-so-du/index.html` dòng 120 (`pop("#ycc", W(sid, "có") ...)`), dòng 86 (khung `yc`); câu số 2 của cảnh `s02-bo` (`Bạn thử đoán: 16 có chia hết cho 4 không?`, `pause: "ask"`)
- Vấn đề: trong cảnh `s02-bo`, chữ "có" đầu tiên nằm trong câu hỏi ("16 có chia hết") chứ không phải câu đáp án ("Có, và 28 cũng..."). Khung "16 chia hết cho 4 ✓" hiện lúc hỏi và còn trên màn suốt quãng im lặng (sheet khung f-009), nên câu hỏi đã có đáp án trên hình.
- Sửa: đổi thành `W(sid, "có", 2)` (chữ "Có," của câu đáp án), rồi dựng lại video. Khung `ydc` của 28 đang đúng chỗ (`W(sid, "28", 2)`), giữ nguyên.

#### 3. `cung-so-du`: màu teal (Ước chung) tô các dấu "chia hết cho 4 ✓", trái với quyết định của bài

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/cung-so-du/index.html` dòng 86 (khung `yc`, `yd`) và dòng 92 (khung `e2`)
- Vấn đề: ở vòng 6 bài đã bỏ màu teal khỏi hình `du-hieu` và lời giải của `cung-du-6`, `cung-du-30` vì số chia a không phải ước chung của hai số cần tô; hình `du-17-29` cũng tô "chia hết cho 4" bằng slate. Video lại tô 3 khung "16 chia hết cho 4 ✓", "28 chia hết cho 4 ✓", "12 chia hết cho 4 ✓" bằng teal (đặc biệt "12 chia hết cho 4" chỉ có một số, không thể là ước chung). Bé dễ nhớ nhầm teal là màu của mọi lần chia hết.
- Sửa: đổi `teal` thành `slate` ở 3 khung này (khớp `du-17-29`), giữ lime cho phần dư. Gộp với dựng lại ở mục 2.

#### 4. `so-du-lon-nhat`: hai hiệu 24 và 36 tô amber (màu của ƯCLN)

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/so-du-lon-nhat/index.html` dòng 72 và 73 (`<span class="am">24</span>`, `<span class="am">36</span>`)
- Vấn đề: amber là màu của ước chung lớn nhất; 24 và 36 là hai hiệu (glossary: "hiệu" teal; hình `du-lon-29-53-89` của bài tô chúng slate). Trên cùng một màn, 24, 36 và ƯCLN(24, 36) = 12 đều amber nên bé không phân biệt được số nào là đáp án; câu hỏi `ask` ngay sau đó chính là "ƯCLN của 24 và 36 là mấy?".
- Sửa: bỏ `class="am"` ở hai số 24 và 36 (để màu mặc định hoặc `sl` như hình của bài), chỉ giữ amber cho "12" ở `d3a` và các hàng của cảnh `s03-thu`.

#### 5. `viet-tu-uclnn`: lời không nói 6 là ƯCLN của 12 và 18

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/viet-tu-uclnn/script.json` cảnh `s02-cat6`, câu số 1 (`Ta cắt thành các đoạn dài 6.`)
- Vấn đề: cả video dựa vào việc 6 là ƯCLN của 12 và 18 (quy tắc "d là ƯCLN", câu "Nên 6 chưa là ước chung lớn nhất" ở cảnh 12 và 24), nhưng lời chỉ nói "cắt thành các đoạn dài 6"; chữ "ƯCLN(12, 18) = 6" chỉ nằm trên khung tiêu đề, không đọc lên. Hai video cùng loại (`cap-so-gioi-han`, `cap-so-tong`) đều nói "Đoạn lớn nhất cắt vừa hết cả hai là ...". Bé nghe không thấy vì sao chọn 6, rồi nghe "6 chưa là ƯCLN" của cặp khác.
- Sửa: đổi câu thành "Đoạn lớn nhất cắt vừa hết cả hai là 6." (9 chữ, cùng cách nói với `cap-so-gioi-han` và `cap-so-tong`). Câu mới vẫn có chữ "cắt" nên `index.html` (các đoạn hiện ở `W(sid, "cắt")`) giữ nguyên. Chỉ một câu đổi lời nên chỉ câu đó đọc lại; giữ nguyên giọng các câu còn lại (xem `video.md`: không xoá `audio/*.wav`).

#### 6. `cap-so-tich`: lời không nêu tiêu chí chọn cặp (m và n chỉ chung ước 1)

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/cap-so-tich/script.json` cảnh `s03-chon`, câu số 1 và 2 (`Có ba cặp: 1 và 12, 2 và 6, 3 và 4.`, `Cặp 2 và 6 còn chung ước 2, nên loại.`)
- Vấn đề: video chỉ nói vì sao loại cặp 2 và 6; không có câu nào nói hai cặp còn lại được nhận vì chỉ chung ước 1 (chỉ có khung hình "✓ nhận"). Bài (section 17, note) nêu tiêu chí này ("Chọn cặp chỉ có ước chung là 1"), và hai video cùng dạng đều nói thành lời ("Các cặp còn lại chỉ chung ước 1, nên nhận", "Cặp 1 và 7: chỉ chung ước 1, nhận"). Clip của card (`cap-so-tich`, bắt đầu từ cảnh `s02-viet`) cũng không có tiêu chí này ở chỗ nào, nên bé ôn lại card không nghe được luật chọn.
- Sửa: thêm sau câu số 2 một câu "Hai cặp còn lại chỉ chung ước 1, nên nhận." (9 chữ, video lên 15 câu, dưới giới hạn 16), cảnh `s03-chon` giữ nguyên, và đổi thời điểm hiện hai khung "✓ nhận" (`#v0`, `#v2`, hiện ở `W(sid, "loại")`) sang chữ "nhận" của câu mới.

### Góp ý

#### 1. `cap-so-gioi-han`: câu hỏi cặp 2 và 4 chưa có căn cứ trong chính video

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/cap-so-gioi-han/script.json` cảnh `s02-bang`, câu số 2 (`Bạn thử đoán: cặp 2 và 4 có nhận không?`)
- Vấn đề: bé chỉ đoán được nếu nhớ luật "m và n chỉ chung ước 1" từ section 14; trong video luật này chỉ được nói ở cảnh sau (`s03-quy`). Với bé chậm, nên có một câu nhắc căn cứ trước câu hỏi.
- Sửa: thêm trước câu hỏi "Hai số m và n chỉ được chung ước 1." hay bỏ nhãn "đoán" cho câu này; tuỳ tác giả.

#### 2. `cap-so-gioi-han`: lời nói "hai dải băng" nhưng hình chỉ có một dải 20 dm

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/cap-so-gioi-han/index.html` dòng 62 đến 66 (cảnh `s01-mo`); câu số 2 của cảnh (`Hai dải băng khác nhau, dài không quá 20.`)
- Vấn đề: khi nghe "hai dải băng khác nhau" màn chỉ có một thanh 20 dm cắt thành 4 đoạn; hình không chỉ vì sao hai dải khác nhau và đều không quá 20.
- Sửa: vẽ hai thanh dưới thanh 20 dm (vd 10 dm và 15 dm) hay đổi lời thành "Mỗi dải dài không quá 20."

#### 3. `cap-so-tich`: bước "2 nhân 2 bằng 4" không được nói

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/cap-so-tich/script.json` cảnh `s02-viet`, câu số 2 (`Ở đây tích là 4 nhân số m nhân số n.`)
- Vấn đề: hình đi từ "48 = 2 · 2 · m · n" sang "48 = 4 · m · n", lời nhảy thẳng sang "4 nhân số m nhân số n"; bé chậm không thấy 4 từ đâu ra. Câu cũng nói "tích là 4 nhân số m nhân số n" trong khi tích của đề là 48.
- Sửa: đổi thành "Số d là 2, nên số d nhân số d bằng 4." rồi "Vậy 48 bằng 4 nhân số m nhân số n." (cả hai dưới 12 chữ; video lên 16 câu nếu đã thêm câu ở mục Nên sửa 6, vẫn đúng giới hạn); đổi `W(sid, "ở")` và `W(sid, "tích", 2)` ở `index.html` sang chữ của hai câu mới.

#### 4. `cap-so-tong`: độ dài hai dải trong hình theo tỉ lệ 1 và 2

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/cap-so-tong/index.html` dòng 72 và 73 (`width:260px`, `width:520px`)
- Vấn đề: dải b dài đúng gấp đôi dải a, dễ gợi b = 2a; hai đáp án thật có tỉ lệ 1 đến 7 (6 và 42) và 3 đến 5 (18 và 30).
- Sửa: chọn hai độ rộng không gợi tỉ lệ nào (vd 220 và 560) hay bỏ độ dài thật, chỉ vẽ hai hộp "a" và "b".

#### 5. `cung-so-du`: màn chỉ có tiêu đề trong khoảng 3 giây ở cảnh cuối

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/cung-so-du/index.html` dòng 132 (`pop("#r1c", W(sid, "cùng") ...)`), cảnh `s03-hieu`
- Vấn đề: từ lúc khung "12 chia hết cho 4" mờ đi (câu "Bạn nhớ nhé") đến chữ "cùng" của câu quy tắc (khoảng 3 giây) màn chỉ còn tiêu đề "Cùng số dư" trong khi lời đang đọc "Hai số chia cho số a được". Đã đủ để bé tưởng hình bị thiếu.
- Sửa: hiện khung "chia cho a" (hay chính khung "cùng số dư") ngay từ chữ "chia" của câu quy tắc.

#### 6. `viet-tu-uclnn`: số 6 trong khung cuối tô slate, còn ở cảnh 12 và 18 tô amber

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/viet-tu-uclnn/index.html` dòng 118 (khung `r4c`, `chip("r4c", "slate", "12 = 6 · 2, 18 = 6 · 3")`)
- Vấn đề: cùng số 6 là ƯCLN của 12 và 18 nhưng khung tóm tắt dùng màu slate, trái với "12 = **6** · 2" amber ở cảnh trước và với `a = d · m` amber ngay trên nó.
- Sửa: đổi khung thành amber, hay viết bằng `<span class="am">6</span>` trong nội dung khung.

#### 7. Whisper: hai chỗ đã đọc lại nhiều lần, nên nghe lại

- Vị trí: `video/projects/uoc-chung-uoc-chung-lon-nhat/cap-so-tich/renders/report.json` câu `Hai số là số d nhân số m và số d nhân số n. Nhân chúng lại, ...` (đọc 4 lần, khớp 0,971); `viet-tu-uclnn/renders/report.json` câu `Gọi số d là ƯCLN của hai số a và b.` (khớp 0,979)
- Vấn đề: Whisper nghe "Nhân chúng lại" thành "nên chúng lại" và "số m nhân số n" thành "số N nhân số N" ở câu đầu; nghe "Gọi" thành "Với" ở câu sau. Cả hai là câu quy tắc, nên khác một chữ là bé nghe nhầm quy tắc. Đây có thể chỉ là nhiễu nhận dạng (các câu khác trong cùng video khớp đủ), nhưng tôi không nghe được âm thanh.
- Sửa: người điều phối hay chủ dự án nghe hai câu này một lần; nếu đọc đúng thì bỏ qua, nếu sai thì thêm `say` cho câu đó.

#### 8. Màu "số dư": glossary ghi pink, bài và video dùng lime

- Vị trí: `content/glossary/math.json` mục `số dư` (`color: pink`); `src/visuals/math/uoc-chung-uoc-chung-lon-nhat/catalog.ts` legend `Số dư` (lime); `video/projects/uoc-chung-uoc-chung-lon-nhat/cung-so-du/index.html`, `so-du-lon-nhat/index.html` (lime)
- Vấn đề: video theo đúng quy ước của bài (lime), nhưng glossary đặt `số dư` màu pink, nên màu khái niệm của cùng từ khác nhau giữa glossary và bài. Có từ trước vòng này, không do video.
- Sửa: không sửa ở vòng này; nếu muốn thống nhất, đổi một nơi cho cả bài (glossary hay catalog và video) ở một vòng riêng.

### Đã tự tính lại

| Video | Đã kiểm | Kết quả |
|---|---|---|
| `viet-tu-uclnn` | 12 = 6·2, 18 = 6·3, ƯCLN(12, 18) = 6, ƯCLN(2, 3) = 1; 12 = 6·2, 24 = 6·4, ƯCLN(2, 4) = 2; ƯCLN(12, 24) = 12 (12 = 12·1, 24 = 12·2); số đoạn 12:6 và 18:6 | Đúng; cặp 2 và 4 còn chung ước 2 |
| `cap-so-gioi-han` | m, n từ 1 đến 4, m < n: 6 cặp, bỏ (2, 4) còn 5 cặp; nhân 5: 5 và 10, 5 và 15, 5 và 20, 10 và 15, 15 và 20, ƯCLN từng cặp đều 5; (10, 20) có ƯCLN 10, loại; không vượt 20 | Đúng, 5 cặp, khớp bài (5 cặp không thứ tự) |
| `cap-so-tong` | 48 : 6 = 8; m + n = 8, m < n: (1, 7), (2, 6), (3, 5), ƯCLN 1, 2, 1; nhân 6: 6 và 42, 18 và 30; 6 + 42 = 48, 18 + 30 = 48; ƯCLN(6, 42) = 6, ƯCLN(18, 30) = 6 | Đúng; cặp (4, 4) bị loại vì a < b |
| `cap-so-tich` | 2·2 = 4; 48 : 4 = 12; m·n = 12, m < n: (1, 12), (2, 6), (3, 4), ƯCLN 1, 2, 1; nhân 2: 2 và 24, 6 và 8; 2·24 = 48, 6·8 = 48; ƯCLN(2, 24) = 2, ƯCLN(6, 8) = 2 | Đúng |
| `cung-so-du` | 17 = 4·4 + 1, 29 = 4·7 + 1; 17 − 1 = 16 = 4·4, 29 − 1 = 28 = 4·7; 29 − 17 = 12 = 4·3; số túi và phần dư trong hình (4 túi + 1, 7 túi + 1) | Đúng |
| `so-du-lon-nhat` | 53 − 29 = 24, 89 − 53 = 36, ƯCLN(24, 36) = 12; 29 = 12·2 + 5, 53 = 12·4 + 5, 89 = 12·7 + 5; 12 lớn hơn số dư 5 | Đúng, cùng dư 5 |

Số trong lời khớp với `note`, `caption` và recap của section tương ứng ở mọi chỗ kiểm; không có câu nào trái với bài.

## Kết quả vòng 6 đã được xử lý

| Mục vòng 6 | Kết quả |
|---|---|
| Nghiêm trọng 1 (đếm cặp có thứ tự hay không) | Đã sửa: quy ước "cặp 5 và 10 với cặp 10 và 5 chỉ tính là một cặp" dạy ở màn 3 của `cap-so-gioi-han`, lặp trong đề `cap-7-28` và `tong-45-uclnn-9`; đã đếm lại bằng chương trình (5 và 2 cặp không thứ tự). Không còn câu đếm cặp nào khác (`grep "Có bao nhiêu cặp"` còn đúng hai câu này) |
| Nên sửa 1 (`chon-a-26-50`) | Đã sửa: `chon-a-22-58`, hiệu 36, đáp án 4 và 6 |
| Nên sửa 2 (`chon-cap-uclnn-4`) | Đã sửa: `chon-cap-uclnn-2` (ƯCLN 2, không quá 14), đáp án 2 và 6, 4 và 6 |
| Nên sửa 3 (`cung-du-30`) | Đã sửa: 27 thành 28, đáp án 18 chẵn nhưng 28 cũng chẵn nên không loại được bằng chẵn lẻ |
| Nên sửa 4 (`tich-200`, `tich-180`) | Đã đổi: `tich-72-uclnn-3` (72 chia 9 là bảng nhân, đạt); `tich-144-uclnn-6` còn chia 144 cho 36 (Nên sửa 9) |
| Nên sửa 5 ("số nhân") | Đã sửa: không còn "số nhân" trong `lesson.json` và `catalog.ts`, mọi câu dùng "m và n" |
| Nên sửa 6 (`tip` nhắc lại quy tắc) | Đã thay bằng mẹo mới "Tìm số cùng số dư", đúng ở mọi đầu vào (bảng dưới); nhưng ví dụ của mẹo trùng số câu `so-cung-du-20` (Nên sửa 1) |
| Nên sửa 7 (màu teal "Ước chung" ở `du-hieu`) | Đã sửa: hình `du-hieu` và `explain.tex` của `cung-du-6`, `cung-du-30` không còn teal; `conceptIds` của card còn `uoc-chung` (Góp ý 5) |
| Nên sửa 8 (quy tắc `cap-so-gioi-han` thiếu giới hạn) | Đã sửa: "không quá giới hạn của đề" ở quy tắc, recap section và recap card (giống nguyên văn) |
| Nên sửa 9 (không có tình huống đời sống) | Đã sửa: mở bằng dải băng dài không quá 20 dm |
| Nên sửa 10 (`dai-bang-4-8`) | Đã sửa: "Dải còn lại dài hơn dải 8 dm ..." và "4 và 2 còn chung ước 2"; đáp án 12 đúng |
| Góp ý 1, 2, 4, 5, 6, 9 | Đã sửa (hình gợi ý `viet-goi-y-16-24` dùng ƯCLN 8, "20 và 30", "16 và 26", chip 21 và 45, `cap-goi-y-6-24` bỏ, ƯCLN 14 và 9 thay 16 và 8, `cap-9-30` bỏ nên hết ngắt dòng `gathered`); nhiễu mới còn thiếu `wrong` (Góp ý 1) |
| Góp ý 3, 7, 8 | Còn nguyên hay còn một phần: Góp ý 3, 6, 7 dưới đây |

## Việc kiểm toán đã làm

- Tự giải bằng chương trình Python (gcd, liệt kê cặp, số dư) mọi câu đã đổi: `cap-7-28` = 5 cặp (7-14, 7-21, 7-28, 14-21, 21-28; loại 14-28); `chon-cap-uclnn-2` đáp án {2 và 6, 4 và 6}, 4 và 8 (ƯCLN 4), 6 và 12 (ƯCLN 6) sai; `tong-36-uclnn-4` đáp án {4 và 32, 8 và 28} (còn 16 và 20 không có trong lựa chọn), 12 và 24 (ƯCLN 12), 6 và 30 (ƯCLN 6) sai; `tong-45-uclnn-9` = 2 (9-36, 18-27); `tong-56-uclnn-14` a = 14 (14 và 42); `tich-72-uclnn-3` b = 24 (duy nhất); `tich-144-uclnn-6` số lớn 24 (duy nhất); `cung-du-6` chỉ 14 và 26 (dư 2 và 2), 16 và 26 dư 4 và 2; `cung-du-30` chỉ 18 (dư 2); `chon-a-22-58` đáp án {4, 6}, 22 và 58 chia 5 dư 2 và 3, chia 8 dư 6 và 2; `viet-20-30` 2 và 3; `dai-bang-4-8` 12.
- `wants` của hình `chips`: `du-lon-chon-21-45` (hiệu 24; chỉ 3, 4, 6, 8 cho cùng số dư: 0-0, 1-1, 3-3, 5-5; 5 dư 1 và 0, 9 dư 3 và 0) = chỉ số 0, 1, 3, 4 đúng; `du-chon-5` (12 và 27 dư 2-2, 8 và 33 dư 3-3; 14 và 23 dư 4-3, 17 và 31 dư 2-1) = chỉ số 0, 2 đúng; `cap-chon-4-12`, `tong-chon-10`, `tich-chon-18` không đổi và còn đúng.
- Hình gợi ý nấc 2 dùng số khác đề và không hiện kết quả của đề: `viet-goi-y-16-24` (ƯCLN 8, không nêu 5), `cap-goi-y-6-18` (kết quả 3, đề cần 5), `tong-goi-y-42-7` (đề: 36 và 4), `tich-goi-y-160-4` (đề: 72 và 3). Hình lời giải khớp số của đề: `cap-7-28-giai` (5 cặp đúng), `tong-36-giai` (4-32, 8-28, 16-20; loại 3 và 6), `tich-72-giai` (9 · m · n = 72, m · n = 8, 3 và 24), `du-lon-14-26-50-giai`, `du-thu-lai` (29, 53, 89 chia 12 dư 5, hiệu 24 và 36).
- Quy tắc viết lại đúng toán: tổng a + b = d(m + n) nên chia tổng cho d được m + n (48 chia 6 được 8, khớp hình `tong-48-6`); tích a · b = d · d · m · n (đúng cho mọi d, m, n nhưng câu mới không nói d là ƯCLN, xem Nên sửa 6); hiệu các số liền nhau có ƯCLN bằng ƯCLN của mọi hiệu nên số lớn nhất cho cùng số dư là ƯCLN của các hiệu (25 và 43 hiệu 18, 29-53-89 hiệu 24 và 36 ra 12). Recap section và recap card của cả 6 section giống nguyên văn câu `rule` (kiểm bằng chương trình). Câu `dien-uclnn-hieu` ghép lại giống nguyên văn quy tắc `so-du-lon-nhat`.

### Bảng mẹo `tip.cung-so-du` (section `cung-so-du`)

Mẹo: "Muốn tìm số cùng số dư với một số khi chia cho a, cứ cộng thêm a, 2a, 3a. Số mới chia cho a vẫn dư như cũ." Ghi (số n, số chia a).

| Đầu vào (n, a) | Dư của n | n + a, n + 2a, n + 3a (dư) | Kết quả |
|---|---|---|---|
| (20, 6) ví dụ của mẹo | 2 | 26, 32, 38 (2, 2, 2) | đúng |
| (0, 3) biên số 0 | 0 | 3, 6, 9 (0, 0, 0) | đúng |
| (7, 7) n bằng a | 0 | 14, 21, 28 (0, 0, 0) | đúng |
| (2, 9) n bé hơn a | 2 | 11, 20, 29 (2, 2, 2) | đúng |
| (1, 100) số chia lớn | 1 | 101, 201, 301 (1, 1, 1) | đúng |
| (13, 5) lẻ, số chia lẻ | 3 | 18, 23, 28 (3, 3, 3) | đúng |
| (10, 1) số chia 1 | 0 | 11, 12, 13 (0, 0, 0) | đúng |
| (50, 15) số tròn chục | 5 | 65, 80, 95 (5, 5, 5) | đúng |
| (99, 10) | 9 | 109, 119, 129 (9, 9, 9) | đúng |
| (4, 2) số chẵn, số chia chẵn | 0 | 6, 8, 10 (0, 0, 0) | đúng |

Mẹo đúng ở mọi đầu vào thử (cộng thêm bội của a không đổi số dư). Còn hai điểm của mẹo ghi ở Nên sửa 1 (ví dụ trùng đề) và 8 (chữ "2a, 3a").

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Ví dụ của mẹo `tip.cung-so-du` đúng là số của câu `so-cung-du-20` (LL-07)

- Vị trí: `$.sections[cung-so-du].blocks[2].tex` (`uoc-chung-uoc-chung-lon-nhat.tip.cung-so-du`) và `$.exercises[so-cung-du-20]`
- Nguồn: —
- Vấn đề: mẹo viết `20 = 6 · 3 + 2` và `26 = 6 · 4 + 2`; câu kho ôn `so-cung-du-20` hỏi "Chia 20 và x cho 6 được cùng số dư, x lớn hơn 20 và nhỏ hơn 32" có đáp án 26. Bé đọc mẹo là có đáp án, không cần tự làm. (Ví dụ này do review vòng 6 gợi ý, nên lỗi thuộc bản gợi ý đó.)
- Sửa: đổi ví dụ của mẹo sang số không xuất hiện ở section này, ví dụ `11 = 8 · 1 + 3` và `19 = 8 · 2 + 3`.

### 2. Câu luyện `cap-7-28` dùng cùng ƯCLN 7 và các số 14, 21, 28 với câu kiểm tra `cap-uclnn-7` (LL-07)

- Vị trí: `$.exercises[cap-7-28]` và `$.exercises[cap-uclnn-7]` (cùng section `cap-so-gioi-han`; ảnh `198-s15-05-exercise-cap-uclnn-7` rồi `200-s15-06-exercise-cap-7-28`)
- Nguồn: —
- Vấn đề: câu kiểm tra "Chọn cặp số có ƯCLN là 7" (đáp án 14 và 21; 14 và 28 có ƯCLN 14, 21 và 42 có ƯCLN 21) đứng ngay trước câu luyện đếm cặp có ƯCLN 7 từ 7, 14, 21, 28. Bé đã biết 14 và 21 nhận, 14 và 28 loại, nên chỉ còn ghép nốt các cặp, không phải tự lập lại bước viết 7 nhân m, 7 nhân n. Trước vòng này câu luyện dùng ƯCLN 9 nên không trùng.
- Sửa: đổi `cap-7-28` sang ƯCLN 9 và giới hạn 36 (9, 18, 27, 36: cũng 5 cặp, loại 18 và 36), đổi câu quy ước thành "Cặp 9 và 18 với cặp 18 và 9 chỉ tính là một cặp." và soát lại hình lời giải, hình gợi ý.

### 3. Ba câu điền chỗ trống không lặp câu quy tắc mới (LL-05, LL-20)

- Vị trí: `$.exercises[dien-tong-uclnn].segments`, `$.exercises[dien-tich-d-d].segments`, `$.exercises[dien-viet-tu-uclnn].segments` (so với quy tắc và recap của `cap-so-tong`, `cap-so-tich`, `viet-tu-uclnn`)
- Nguồn: —
- Vấn đề: `dien-tong-uclnn` còn đọc "Biết tổng của hai số và ƯCLN của chúng là d thì m cộng n bằng tổng đó chia cho ___" trong khi quy tắc, recap đã đổi thành "Biết tổng của hai số và ƯCLN là d. Chia tổng cho d thì được m cộng n, như 48 chia 6 được 8."; `dien-tich-d-d` còn "Nếu ƯCLN của hai số là 5 thì tích ... " trong khi quy tắc mới là "Hai số là d nhân m và d nhân n. Nhân chúng lại ..."; `dien-viet-tu-uclnn` được viết lại ở vòng này thành "Hai số có ƯCLN là d thì bằng d nhân m ..." khác quy tắc "Gọi d là ƯCLN của hai số a và b. Khi đó ...". Hai câu `dien-cung-du` và `dien-uclnn-hieu` thì lặp nguyên văn; bé gặp một quy tắc ba cách nói trong một section.
- Sửa: viết lại câu điền để lặp nguyên văn câu quy tắc (sau khi sửa quy tắc ở Nên sửa 4, 5, 6), chỉ khoét một từ thành chỗ trống như `dien-cung-du`.

### 4. Quy tắc `so-du-lon-nhat` đổi "cùng số dư" thành "dư bằng nhau", lệch từ đã dạy và Haiku vẫn thấy mơ hồ (LL-05, LL-25)

- Vị trí: `$.sections[so-du-lon-nhat].blocks[2].children[0].text`, `$.sections[so-du-lon-nhat].recap.caption`, `$.cards[so-du-lon-nhat].recap.caption`, `$.exercises[dien-uclnn-hieu].segments[0]` (đọc hiểu lượt 3: Hiểu mơ hồ, lý do "dư bằng nhau")
- Nguồn: —
- Vấn đề: tên section, đề của mọi câu, nhãn hình (`cùng số dư 5`) và section `cung-so-du` đều nói "cùng số dư" (từ glossary "số dư"); chỉ câu quy tắc nói "các số chia cho nó dư bằng nhau". Trên màn quy tắc cùng thấy "dư bằng nhau" ở chữ và "cùng số dư 5" ở thẻ hình (ảnh `250-s19-03-block`). Một khái niệm hai cách nói, mà cách mới cũng chưa làm bé hiểu rõ hơn.
- Sửa: quay về "cùng số dư", và làm rõ bằng một vế ví dụ lấy từ màn một: "Xếp các số từ bé đến lớn, tính hiệu của hai số liền nhau. Số lớn nhất để các số chia cho nó được cùng số dư là ƯCLN của các hiệu đó, như 25 và 43 có hiệu 18 nên số đó là 18." (recap, card và câu điền theo, soát `[length]`).

### 5. Quy tắc và recap `cap-so-tong` không nói m, n là gì trong chính câu (LL-25, đọc hiểu lượt 3: Hiểu mơ hồ "m cộng n là gì")

- Vị trí: `$.sections[cap-so-tong].blocks[1].children[0].text`, `$.sections[cap-so-tong].recap.caption`, `$.cards[cap-so-tong].recap.caption`
- Nguồn: —
- Vấn đề: ví dụ số "48 chia 6 được 8" đã có nhưng chữ m, n chỉ được nói ở màn đầu ("a bằng 6 nhân m và b bằng 6 nhân n"); màn recap hiện lại câu này một mình nên bé ôn không biết "m cộng n" là gì. Ví dụ số không đủ khi chữ cái chưa được giải thích trong cùng câu (khác `cap-so-tich`, câu nêu "d nhân m và d nhân n" ngay trước thì Haiku hiểu rõ).
- Sửa: nêu m, n trong câu, ví dụ "Hai số là d nhân m và d nhân n nên tổng của chúng chia cho d bằng m cộng n, như 48 chia 6 được 8." (tác giả cân độ dài; nhớ đổi recap section, recap card và câu điền).

### 6. Quy tắc `cap-so-tich` bỏ điều kiện "ƯCLN là d" (LL-05, LL-20)

- Vị trí: `$.sections[cap-so-tich].blocks[1].children[0].text`, `$.sections[cap-so-tich].recap.caption`, `$.cards[cap-so-tich].recap.caption`
- Nguồn: —
- Vấn đề: câu cũ "Nếu ƯCLN của hai số là d thì tích ... bằng d nhân d nhân m nhân n"; câu mới "Hai số là d nhân m và d nhân n. Nhân chúng lại, tích bằng d nhân d nhân m nhân n." dễ hiểu hơn (Haiku lượt 3: Hiểu rõ) nhưng không còn nói d là ƯCLN, cũng không nói m, n chỉ có ước chung là 1. Công thức tích vẫn đúng cho mọi d, nhưng bé ôn bằng recap không biết d là gì và khi nào dùng, trong khi mọi bước sau của dạng bài (loại cặp m, n còn chung ước) dựa vào điều kiện đó. Cùng kiểu bản sửa bỏ điều kiện đã ghi ở LL-05 (`on-tap-chuong-2` vòng 2).
- Sửa: giữ câu hai vế nhưng thêm điều kiện ở vế đầu: "Hai số có ƯCLN là d thì là d nhân m và d nhân n, với m, n chỉ có ước chung là 1. Nhân chúng lại, tích bằng d nhân d nhân m nhân n." (soát lại bằng Haiku vì chữ đổi).

### 7. Giải thích `tich-72-uclnn-3` vẫn rối, và đã viết lại lần thứ tư sau lượt đọc hiểu cuối (LL-25)

- Vị trí: `$.exercises[tich-72-uclnn-3].explain.text` (đọc hiểu lượt 3: Khó hiểu, lý do "chỉ chung ước 1, b là gì")
- Nguồn: —
- Vấn đề: bản được Haiku đọc ở lượt 3 là "... Chỉ cặp 1 và 8 có m, n chỉ chung ước 1, nên b là 3 nhân 8."; bản hiện tại đã đổi thành "... Chỉ cặp 1 và 8 là hai số chỉ chung ước 1, nên b, số lớn, là 3 nhân 8." (chưa qua Haiku vì đã đủ 3 lượt). Câu vẫn gói ba ý (loại cặp, chọn số lớn, tính b) bằng hai cụm "chỉ chung ước 1" và "b, số lớn," và không nói vì sao cặp 2 và 4 bị loại.
- Sửa: tách thành các câu ngắn: "Các cặp m, n có tích 8 là 1 và 8, 2 và 4. Cặp 2 và 4 còn chung ước 2 nên bị loại, chỉ còn 1 và 8. Vậy hai số là 3 và 24, nên b bằng 24." (câu `tich-144-uclnn-6` cùng kiểu đã Hiểu rõ ở lượt 3, giữ nguyên.)

### 8. Mẹo viết "2a, 3a" liền chữ, bài chưa dạy cách viết này (LL-09, LL-19)

- Vị trí: `$.sections[cung-so-du].blocks[2].text` (`uoc-chung-uoc-chung-lon-nhat.tip.cung-so-du`)
- Nguồn: —
- Vấn đề: cả bài (kể cả quy tắc d nhân m) viết phép nhân bằng chữ "nhân" hay dấu chấm, chưa chỗ nào viết số liền chữ để nghĩa là nhân. Bé có thể đọc "2a" thành "2 và a". Đây là cách viết chưa dạy trong mẹo (phân vân giữa Nên sửa và Nghiêm trọng, chọn Nên sửa vì ví dụ `6 · 4 + 2` ngay dưới cho thấy ý đúng).
- Sửa: "cứ cộng thêm a, hai lần a, ba lần a" hoặc "cộng thêm 1 lần, 2 lần, 3 lần số chia".

### 9. `tich-144-uclnn-6` còn phép chia cho số hai chữ số (LL-18)

- Vị trí: `$.exercises[tich-144-uclnn-6]`
- Nguồn: —
- Vấn đề: bé phải tính 6 · 6 = 36, rồi 144 chia 36 bằng 4, rồi 6 · 4: ba phép, trong đó một phép chia cho số hai chữ số không có trong bảng nhân. Đây là lỗi mục 4 của vòng 6 (`tich-180`: 180 chia 36) và bản gợi ý "144" của vòng 6 không khắc phục nó.
- Sửa: giữ dạng, đổi số cho phép chia nằm trong bảng nhân, ví dụ ƯCLN 4 và tích 112 (16 · m · n = 112, m · n = 7, chỉ 1 và 7, số lớn 28).

## Góp ý

### 1. Nhiễu mới thiếu lý do trong `wrong`

- Vị trí: `$.exercises[cung-du-6].explain.wrong` (thiếu "16 và 26": 26 trừ 16 bằng 10, không chia hết cho 6), `$.exercises[viet-20-30].explain.wrong` (thiếu "1 và 2": 10 nhân 1 bằng 10, không phải 20), `$.exercises[cung-du-30].explain.wrong` (thiếu "31": 31 trừ 30 bằng 1, không chia hết cho 4)
- Nguồn: —
- Vấn đề: sau khi đổi nhiễu, mỗi câu có một nhiễu hay bị chọn không có lý do; vòng 6 đã đề nghị thêm `wrong` cho "16 và 26".
- Sửa: thêm một câu `wrong` cho mỗi nhiễu trên.

### 2. Câu `cap-7-28`: hình gợi ý không có bước loại cặp, lời giải nói bước đó hai cách (LL-05)

- Vị trí: `uoc-chung-uoc-chung-lon-nhat.visual.cap-goi-y-6-18`, `uoc-chung-uoc-chung-lon-nhat.visual.cap-7-28-giai` (dòng "Bỏ cặp 2 và 4 vì còn chung ước 2") và `$.exercises[cap-7-28].explain.text` ("Cặp 14 và 28 có ƯCLN là 14 nên bị loại")
- Nguồn: —
- Vấn đề: hình gợi ý ví dụ 6, 12, 18 không loại cặp nào, nên bước khó của câu (m từ 1 đến 4, loại 2 và 4) chưa được gợi ý; lời giải loại theo m, n còn `explain` loại theo hai số.
- Sửa: dùng ví dụ gợi ý có một cặp bị loại (ví dụ ƯCLN 6, không quá 24), và đặt `explain` cùng cách nói với hình ("2 và 4 còn chung ước 2, nên cặp 14 và 28 bị loại").

### 3. Bước "loại cặp còn chung ước" chưa được rèn ở câu tổng

- Vị trí: `$.exercises[tong-45-uclnn-9]`, `$.exercises[tong-56-uclnn-14]`
- Nguồn: tr.108 (2.42)
- Vấn đề: m cộng n bằng 5 (và 4) không có cặp nào bị loại ngoài cặp bằng nhau, nên bé làm đúng chỉ bằng cách ghép đôi (còn lại từ Góp ý 3 vòng 6; `cap-7-28` và `tong-36-uclnn-4` đã có bước loại).
- Sửa: một câu tổng có m cộng n là hợp số, ví dụ tổng 54 và ƯCLN 6 (m cộng n bằng 9; loại 3 và 6).

### 4. ƯCLN 3 của `tich-72-uclnn-3` trùng `tich-108-uclnn-3` cùng card (LL-07)

- Vị trí: `$.exercises[tich-72-uclnn-3]` và `$.exercises[tich-108-uclnn-3]` (card `cap-so-tich`)
- Nguồn: —
- Vấn đề: hai câu cùng ƯCLN 3 (tích 72 và 108); tuy số khác nhau, bé ôn lặp lại cùng một bước viết 3 nhân m.
- Sửa: đổi một trong hai sang ƯCLN chưa dùng trong section (đã dùng 2, 3, 5, 6), giữ m nhân n chỉ có một cách phân tích ra hai số chỉ chung ước 1; tác giả tự giải lại câu mới.

### 5. Card `cung-so-du` còn `conceptIds` là "Ước chung" dù section không còn tô khái niệm đó

- Vị trí: `$.cards[cung-so-du].conceptIds`
- Nguồn: —
- Vấn đề: số chia a không phải ước chung của hai số; sau khi bỏ màu teal khỏi hình và lời giải, `conceptIds` của card không còn khớp phần nào được tô.
- Sửa: bỏ hay đổi `conceptIds` nếu schema cho phép (vòng 6 đã đề nghị).

### 6. Phần tổng quan chưa nhắc 6 phần mới (còn từ Góp ý 7 vòng 6)

- Vị trí: `$.overview.goals`, `$.overview.summary`
- Nguồn: —
- Vấn đề: không đổi, vì đổi chữ tổng quan kéo theo thu lại lời đọc `overview.m4a`.
- Sửa: thêm một mục vào `goals` khi có đợt thu lời đọc lại.

### 7. Chữ a có hai nghĩa giữa các section (còn từ Góp ý 8 vòng 6)

- Vị trí: `$.sections[viet-tu-uclnn..cap-so-tich]` (a, b là hai số) và `$.sections[cung-so-du]`, `$.sections[so-du-lon-nhat]` (a là số chia)
- Nguồn: tr.38 (ví dụ 1 dùng a là số chia)
- Vấn đề: không đổi; mỗi section tự nhất quán.
- Sửa: nếu muốn gọn thì đổi chữ số chia, hoặc giữ vì sách dùng a.
