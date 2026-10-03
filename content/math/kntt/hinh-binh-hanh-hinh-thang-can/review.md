# Review: Hình bình hành. Hình thang cân (`hinh-binh-hanh-hinh-thang-can`)

- Bài: `content/math/kntt/hinh-binh-hanh-hinh-thang-can/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff` so với bản vòng 5, commit `53216c0532`): `overview.narration` (Gemini, giọng Achird), ba video mới `hinh-binh-hanh`, `hinh-thang-can`, `ve-hinh-binh-hanh` (Hải Đăng) và ba khối video ở đầu section `hinh-binh-hanh`, `hinh-thang-can`, `ve-hinh-binh-hanh`; section đọc cùng: `hinh-binh-hanh`, `hinh-thang-can`, `ve-hinh-binh-hanh` (kèm `cheo-hinh-binh-hanh`, `cheo-hinh-thang-can` vì clip gắn card của hai section này)
- Nguồn đã đọc: vòng 6 không có câu sách đổi nên không đối chiếu ảnh nguồn; đã đọc kịch bản, `index.html`, phụ đề `.vtt`, `renders/report.json`, sheet khung hình `sheet-01.png`, `sheet-02.png` của cả ba video, thêm vài khung tách từ `.mp4` ở các giây 14,2 và 36,2 (hinh-binh-hanh, hinh-thang-can), 29 (ve-hinh-binh-hanh), và `overview.vtt`. Vòng 4, 5: sbt-p68, sbt-p69, sbt-p115
- `content:check`: vòng 6: 1 lỗi `[review-hash]` (bài đổi sau lần duyệt vòng 5, điều phối ghi lại hash sau khi xử lý) và 1 cảnh báo (3 id video chưa vào `ids.lock.json`, điều phối chạy `content:lock`); không có lỗi nội dung. `video:check`: ba video của bài đạt (`rule text on screen`: 3, 3, 1; câu `rule` khớp nguyên văn bài, nhịp hỏi và nghĩ đạt, lời chào có "bạn"); ba video FAIL của bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` không thuộc bài này
- Đọc hiểu: vòng 6 không chạy (chữ `overview` và chữ của section không đổi, chỉ thêm `narration` và khối video). Vòng 5: lượt 1 130 / 9 / 0 (`.shots/review/hinh-binh-hanh-hinh-thang-can/doc-hieu.md`), hết ba lượt, hai mục còn mơ hồ ghi ở "Nên sửa" của vòng 5
- `lesson:walk`: không chạy ở vòng 6 (không đổi hình hay bố cục của bài). Vòng 5: 0 FAIL, 0 cảnh báo, ba thiết bị, ảnh trong `.shots/walk/hinh-binh-hanh-hinh-thang-can/`
- Kết luận: vòng 6 không có Nghiêm trọng (5 Nên sửa, 8 Góp ý của vòng 6; 3 Nên sửa, 10 Góp ý còn từ vòng 5). Lời đọc giới thiệu đạt. Chưa ghi `reviewedHash` của vòng 6: điều phối sửa các mục Nên sửa (hoặc chấp nhận), rồi chạy `content:hash`, `content:lock` và `video:build` khi cần
- Bản đã review: `0c95357ddabf32218620ddf9cc7fb7531fc1456e02882280e8a0fea3c1116687` (`pnpm content:diff` so với bản này)

## Vòng 6: lời đọc giới thiệu và ba video

### Phần đạt (đã soát từng chữ)

- Lời đọc giới thiệu: `overview.vtt` (25 cue, 1,0 đến 48,4 giây) đọc đúng từng chữ `hook`, `summary`, `goals` (kèm câu dẫn "Học xong bài này, bạn sẽ:" do app thêm, `OVERVIEW_GOALS_LEAD`) và `whyItMatters`; câu đầu "Chào bạn!" gọi "bạn"; không số, ký hiệu hay chữ viết tắt cần đọc riêng; kiến thức trong `goals` đúng (đường chéo là đoạn thẳng nối hai đỉnh không nằm cạnh nhau). Không có phát hiện.
- Câu `rule` của ba video khớp nguyên văn `note` hoặc `caption` của bài (`video:check` đạt), chữ trên màn khớp lời; thuật ngữ đúng glossary (cạnh đối, góc đối, cạnh đáy, cạnh bên, đường chéo, trung điểm, êke).
- Màu khái niệm đúng: hình bình hành lime, hình thang cân sky, cạnh blue (dấu bằng nhau), góc violet (60°, 120°), đường chéo amber, song song slate (mũi tên, chip "Hai cạnh đáy song song"). Số đo đúng: hình bình hành 120°, 60°, 120°, 60° ở A, B, C, D (góc đối bằng nhau); hình thang cân hai góc kề đáy DC cùng 60° (đo trên hình: đáy 190 và 110, cao 74, góc khoảng 61°); hình vẽ AB = 5 cm (160 px trên thước 32 px mỗi cm), AD = 3 cm (95 px), góc 60° (59,7° đo trên khung), C = B + AD đúng.
- Bẫy vòng 3: lời, chữ trên màn và hình của cả ba video không nói "hình thang cân có hai đáy dài ngắn khác nhau" hay "hình thang cân không phải hình bình hành"; không nhắc hình chữ nhật. Hình thang cân luôn vẽ đáy trên ngắn hơn chỉ là hình minh hoạ, lời không nêu thành quy tắc.
- Nhịp cho bé chậm: mỗi video có hai câu hỏi `ask` (hình bình hành, hình thang cân) hoặc một (vẽ hình), mọi câu `rule` có `think`, câu cuối không phải `ask`, mọi câu ≤ 12 chữ trừ câu `rule` (17 và 15 chữ là câu quy tắc nguyên văn), hình giữ nguyên trong lúc lặng. Dải dưới màn trống (hình dừng ở khoảng 75% chiều cao), chữ không bị cắt (thẻ quy tắc 2 dòng của `ve-hinh-binh-hanh` vừa khung).
- Clip: `hinh-binh-hanh` 6,802 đến 23,685 (card `hinh-binh-hanh`, đoạn hỏi, cạnh, góc) và `cheo-hinh-binh-hanh` 24,085 đến 42,186 (card `cheo-hinh-binh-hanh`); `hinh-thang-can` 7,088 đến 25,953 và `cheo-hinh-thang-can` 26,353 đến 39,97; `ve-hinh-binh-hanh` 7,755 đến 46,807. Mỗi clip gắn đúng card và đúng đoạn giảng (xem Nên sửa 2 về câu "Nhớ nhé").
- Không lộ đáp án câu kiểm tra: các số của câu hỏi (AB = 7 và BC = 5, góc A 110°, AD = 5, góc D 70°, AO = 4, AC = 10, AC = 9, EF và EK, AB = 6) không có trong video; thứ tự vẽ của video là điều bài dạy, `ex.ve-bh-quy-trinh` chỉ kiểm nhớ lại. Không mâu thuẫn với note, recap, câu hỏi cùng section.
- Cách vẽ đúng: AB = 5 cm, góc 60° bằng thước đo góc, lấy AD = 3 cm, hai đường song song bằng êke qua B và qua D, giao tại C, nối (khớp `ve-binh-hanh-cac-buoc` của bài).

### Nghiêm trọng

Không có.

### Nên sửa

Tình trạng sau vòng 6 (đã dựng lại ba video, `video:check` đạt, Whisper mọi câu ≥ 97%):

- 1: đã sửa. Câu định nghĩa cạnh đối đứng trước câu hỏi, cùng cảnh `s02-hoi`.
- 2: đã sửa. Câu chốt là "Nhớ nhé: hai đường chéo cắt nhau tại trung điểm.", chip "Cắt nhau tại trung điểm", hình có dấu trung điểm.
- 3: đã sửa. "Qua điểm B, kẻ song song với cạnh thứ hai." và "Qua điểm D, kẻ song song với cạnh thứ nhất." (câu có "êke" bị Whisper nghe thành "AK" và khớp dưới 97%, nên chữ êke nằm ở chip và ở câu quy tắc).
- 4: đã sửa. Hai câu "Đặt thước đo góc ở đầu cạnh." và "Kẻ đường tạo với cạnh đó góc 60 độ."
- 5: đã sửa trong `figures.tsx` của video, không đụng hình chung: hai dấu bằng nhau đặt trên AC (gần A) và BD (gần D), không còn cặp dấu nào trên hai nửa đối xứng AO, BO.
- Góp ý đã xử lý thêm: 2 (câu trung điểm theo chữ của bài), 4 (dấu bằng nhau của hình bình hành hiện ở chữ "cạnh" của câu quy tắc), 5 (chip dụng cụ màu trung tính, bỏ violet; phóng hình và tô lime giữ như hình của bài). Góp ý 6 (giải nghĩa êke): thử một câu riêng nhưng Whisper nghe "êke" thành "Ê kè" và khớp dưới 97%, nên không đưa vào. Các Góp ý còn lại giữ nguyên.

#### 1. `hinh-binh-hanh`: câu hỏi dùng "cạnh đối" trước khi nói cạnh đối là gì

- Vị trí: `video/projects/hinh-binh-hanh-hinh-thang-can/hinh-binh-hanh/script.json`, câu ask của `s02-hoi` (7,1 đến 10,4 giây) "Bạn thử đoán xem: các cạnh đối của nó thế nào?"; định nghĩa đến sau ở `s03-canh` (11,4 giây) "Hai cạnh nằm đối diện nhau gọi là cạnh đối."
- Vấn đề: clip `hinh-binh-hanh` mở bằng câu hỏi này, hình lúc đó chưa chỉ cạnh nào là cạnh đối, nên bé chậm, nhanh quên không biết đang được hỏi về cạnh nào. Cùng kiểu ở nhịp "hỏi rồi mới mở": hỏi phải dùng từ bé đã nghe.
- Sửa: đưa câu định nghĩa cạnh đối lên trước câu hỏi, hoặc đổi câu hỏi thành "Bạn thử đoán xem: hai cạnh đối diện nhau thế nào?" (9 chữ). Sửa `script.json` rồi `video:build`, soát lại mốc `clips`.

#### 2. `hinh-binh-hanh`: câu "Nhớ nhé" ở cuối clip đường chéo không nhắc đường chéo

- Vị trí: `hinh-binh-hanh/script.json`, câu cuối `s08-nho` (38,96 đến 42,0 giây) "Nhớ nhé: các cạnh đối và các góc đối bằng nhau."; chip trên màn "Cạnh đối, góc đối: bằng nhau" (`index.html`, `#t8`, hình `bh-rule`); `videos[].clips[1]` (`cheo-hinh-binh-hanh`, 24,085 đến 42,186, card `cheo-hinh-binh-hanh`)
- Vấn đề: bé xem lại clip này khi sai card về đường chéo, nhưng câu chốt ôn cạnh đối và góc đối của card khác, quy tắc đường chéo cắt nhau tại trung điểm không được nhắc lại. Video `hinh-thang-can` làm đúng ("Nhớ nhé: hai cạnh bên và hai đường chéo bằng nhau.").
- Sửa: đổi câu cuối thành câu nêu cả ba ý, ví dụ "Nhớ nhé: cạnh đối, góc đối bằng nhau, hai đường chéo cắt nhau ở trung điểm." (nếu quá 12 chữ thì tách hai câu), đổi chip và hình `bh-rule` cho khớp; hoặc cắt clip `cheo-hinh-binh-hanh` kết thúc ở câu quy tắc (38,131 giây) rồi giữ "Nhớ nhé" cho clip card đầu (khi đó đổi `to`).

#### 3. `ve-hinh-binh-hanh`: hai câu êke thiếu "qua B", "qua D"

- Vị trí: `ve-hinh-binh-hanh/script.json`, `s06-song1` (24,43 đến 27,51 giây) "Dùng êke vẽ một đường song song với cạnh thứ hai." và `s07-song2` (28,34 đến 31,04 giây) "Rồi vẽ đường song song với cạnh thứ nhất."
- Vấn đề: lời không nói đường đi qua điểm nào. Trên hình mới thấy đường qua B (song song AD) rồi qua D (song song AB). Hình bình hành chỉ đúng khi hai đường đi qua đúng hai đầu còn lại; bé chỉ nghe lời sẽ vẽ đường song song ở đâu cũng được. Bài viết rõ "qua B đường song song với AD", "qua D đường song song với AB" (`ve-binh-hanh-cac-buoc`).
- Sửa: "Qua B, dùng êke vẽ đường song song với cạnh thứ hai." (11 chữ) và "Qua D, vẽ đường song song với cạnh thứ nhất." (10 chữ); đổi cả `say` nếu giọng đọc "B", "D" lỡ chữ.

#### 4. `ve-hinh-binh-hanh`: câu vẽ góc "tạo với cạnh góc 60 độ" khó nghe

- Vị trí: `ve-hinh-binh-hanh/script.json`, `s04-goc` (16,08 đến 19,6 giây) "Dùng thước đo góc, kẻ đường tạo với cạnh góc 60 độ."
- Vấn đề: "cạnh góc" nghe như một danh từ, thiếu "đó" và "một", đọc lên khó hiểu hơn chữ bài ("kẻ đường AD tạo với AB một góc 60°").
- Sửa: tách hai câu, "Dùng thước đo góc đặt ở điểm A." và "Kẻ đường tạo với cạnh đó góc 60 độ." (hai câu, mỗi câu ≤ 12 chữ).

#### 5. `hinh-thang-can`: dấu bằng nhau của hai đường chéo đặt trên nửa đường chéo

- Vị trí: `hinh-thang-can/index.html`, hình `tc-bang` (từ 35,1 giây, câu `s08-bang` "Hai đường chéo của hình thang cân bằng nhau."); hình lấy khung 3 của `cheo-thang-can-cac-buoc` (`diagonals: "equal"`, dùng chung ở `src/visuals/math/hinh-binh-hanh-hinh-thang-can/catalog-binh-hanh-thang-can.ts`)
- Vấn đề: hai dấu gạch kép nằm trên AO và BO (hai nửa ở phía đáy ngắn). Trong video hình bình hành ngay trước đó, dấu trên hai nửa của một đường chéo nghĩa là "O là trung điểm". Ở đây bé có thể đọc thành "OA = OB" hay "nửa đường chéo bằng nhau", không phải "cả đường AC bằng cả đường BD". OA = OB là đúng với hình thang cân nhưng không phải điều quy tắc nói.
- Sửa: đặt cặp dấu bằng nhau ở giữa AC và giữa BD, hoặc tô cả hai đường chéo cùng độ đậm; sửa ở builder dùng chung thì bài và các video khác dùng khung này cũng đổi (hỏi chủ dự án), hoặc chỉ vẽ lại trong `figures.tsx` của video này. Khi sửa hình chung phải dựng lại video và chạy `lesson:walk`.

### Góp ý

#### 1. Hai video đầu ngắn hơn 45 giây và mỗi video giảng hai ý

- Vị trí: `videos[].durationSec` 43,6 (`hinh-binh-hanh`) và 41,4 (`hinh-thang-can`); `.claude/skills/lesson-video/references/script-rules.md` ("45–75 giây, một video một ý")
- Vấn đề: phần đường chéo của hai video thuộc section kế tiếp (`cheo-hinh-binh-hanh`, `cheo-hinh-thang-can`, không có khối video) nên bé xem trước ở section `hinh-binh-hanh`, `hinh-thang-can` nội dung section sau mới dạy. Không mâu thuẫn và clip theo card đúng, chỉ khác khuôn "một ý một video". Nhịp vẫn đạt, nên không ép.
- Sửa: nếu muốn theo đúng khuôn, tách thành bốn video và đặt khối video ở đầu hai section `cheo-*`; nếu giữ, ghi quyết định này ở `notebooks/backlogs`.

#### 2. `hinh-binh-hanh`: câu "Trung điểm" khác chữ với note của bài

- Vị trí: `hinh-binh-hanh/script.json`, `s05-cheo` (26,98 giây) "Trung điểm là điểm nằm chính giữa một đoạn thẳng."; note `$.sections[1]` (`cheo-hinh-binh-hanh`) "Trung điểm của một đoạn thẳng là điểm nằm chính giữa đoạn đó."
- Vấn đề: một khái niệm hai cách nói (LL-05); câu video không đánh `rule` nên `video:check` không bắt. Đúng toán, không sai nghĩa.
- Sửa: dùng nguyên câu note (13 chữ, hơi quá 12; chấp nhận nếu đánh `rule`) hoặc để nguyên.

#### 3. `hinh-thang-can`: chưa nói hình thang cân có hai cạnh song song trước khi gọi tên đáy

- Vị trí: `hinh-thang-can/script.json`, `s03-day` (11,5 giây) "Hai cạnh song song là hai cạnh đáy."
- Vấn đề: bài có note "Hình thang là tứ giác có hai cạnh đối song song" nhưng video vào thẳng "hai cạnh song song" khi bé chưa nghe hình này có hai cạnh song song. Hình có mũi tên song song nên bé vẫn theo được.
- Sửa: "Hình thang cân có hai cạnh song song, gọi là cạnh đáy." (11 chữ).

#### 4. Hình hiện dấu bằng nhau trước câu quy tắc, chip còn chữ của cảnh trước

- Vị trí: `hinh-thang-can`: dấu bằng nhau của hai cạnh bên hiện lúc nói "Hai cạnh còn lại là hai cạnh bên" (14,5 đến 16,7 giây), 2,7 giây trước câu quy tắc (17,6 giây), trong khi chip vẫn ghi "Hai cạnh đáy song song"; `hinh-binh-hanh`: dấu bằng nhau của cạnh đối hiện ở 11,4 giây, 3 giây trước quy tắc (14,4 giây); `ve-hinh-binh-hanh`: điểm D hiện ở khoảng 19,9 giây, 0,5 giây trước câu "Trên đường đó, lấy cạnh thứ hai…" (20,42 giây)
- Vấn đề: hình mở quy tắc sớm hơn lời một chút và chip lệch lời ở một đoạn ngắn; không sai, bé chậm có thể thấy "bằng nhau" trước khi nghe.
- Sửa: dời `show(...)` của dấu bằng nhau tới `W(sid, "bằng")` của câu quy tắc, và thêm chip "Hai cạnh bên" cho `s03-day`.

#### 5. `ve-hinh-binh-hanh`: chip đầu màu violet, hình cuối không tô lime, hình nhỏ

- Vị trí: `ve-hinh-binh-hanh/index.html`: `#t1` "Thước, thước đo góc, êke" dùng `--color-concept-violet` (màu của khái niệm Góc); cảnh `s02`, `s08`, `s09`, `s10` dùng hình `ve-6` không tô nền lime còn chip "Hình bình hành" màu lime (hai video kia tô lime); hình chỉ rộng khoảng 300 px trên khung 1280 px (5 cm khoảng 160 px), nửa phải khung trống
- Vấn đề: màu violet cho dụng cụ dễ lẫn với "góc"; hình nhỏ khó đọc nhãn A, B, D, thước 0 đến 7 trên iPad.
- Sửa: chip dụng cụ dùng màu trung tính hoặc slate, tô lime cho hình xong, phóng hình lên khoảng 1,5 lần (còn chỗ ở dải trên và phải; dải dưới vẫn để trống cho phụ đề).

#### 6. `ve-hinh-binh-hanh`: êke chưa được giải nghĩa trong video

- Vị trí: `ve-hinh-binh-hanh/script.json`, `s01-chao` (4,6 đến 7,1 giây) "Ta cần thước, thước đo góc và êke."
- Vấn đề: note của bài viết "Êke là thước có một góc vuông, giúp ta kẻ các đường song song."; video chỉ nêu tên. Bé đã học ở phần 1 nhưng nhanh quên.
- Sửa: thêm một câu ngắn "Êke giúp ta kẻ đường song song." (7 chữ) sau câu dụng cụ.

#### 7. Whisper nghe lệch một chữ ở các câu quan trọng, cần nghe tai

- Vị trí: `renders/report.json`: `hinh-thang-can` 17,6 giây "cạnh bên" nghe thành "cạnh đến" (khớp 0,975); `hinh-binh-hanh` 24,4 giây "Đường chéo nối" nghe thành "Đường treo núi" (0,977) và 4,0 giây "Gạch lát" nghe thành "Vạch lát" (0,974); `ve-hinh-binh-hanh` "êke" nghe thành "EK", "AK", "Ê-ke" ở 4 câu (0,970 đến 0,979, thử tới 4 lần ở câu 2)
- Vấn đề: đều vượt ngưỡng, nhưng "cạnh bên" nằm trong câu quy tắc; reviewer không nghe được giọng đọc. Chủ dự án nên nghe bằng tai ba chỗ này (17,6 giây của `hinh-thang-can`, 24,4 giây của `hinh-binh-hanh`, câu êke).
- Sửa: nếu giọng đọc sai, thêm `say` cho câu đó theo luật `script-rules.md`; không đổi lời.

#### 8. Lời đọc giới thiệu: chỗ đọc ngoặc đơn

- Vị trí: `overview.vtt` cue 16, 17 (29,3 đến 32,7 giây): "(đoạn thẳng nối hai đỉnh không nằm cạnh nhau)" trong mục tiêu thứ hai
- Vấn đề: mục tiêu thứ hai dài 19 chữ và chèn một định nghĩa giữa câu, bé nghe một hơi dễ lạc; chữ trên màn có ngoặc nên vẫn rõ. Không sai.
- Sửa: tuỳ tác giả; nếu muốn, tách "đường chéo là đoạn thẳng nối hai đỉnh không nằm cạnh nhau" thành mục riêng (cần viết lại `goals` và đọc lại lời).

## Tình trạng các mục vòng 2 và vòng 3

Vòng 1 (21 Nghiêm trọng trước khi tách bài) và vòng 2 (6 Nghiêm trọng, 15 Nên sửa, 15 Góp ý): báo cáo vòng 2 ở commit `a21fe18`.

| Mục vòng 2                                                            | Tình trạng                                                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nghiêm trọng 1 (hai câu "vật này có dạng hình gì")                    | Đã sửa: đề cho tính chất, lựa chọn Hình thoi/Hình vuông/Hình chữ nhật, mỗi câu một đáp án đúng, lời giải đi từ tính chất sang hình                                                                                                                                                 |
| Nghiêm trọng 2 (`wrong` "chỉ có một cặp cạnh song song"; "chắc chắn") | Đã sửa; tìm cả bài không còn cụm "chỉ có một cặp"                                                                                                                                                                                                                                  |
| Nghiêm trọng 3 (nhận hình thang cân vì cạnh bên bằng nhau)            | Đã sửa ở 4.9, lục giác, câu luyện                                                                                                                                                                                                                                                  |
| Nghiêm trọng 4 (`wrong` "chỉ chắc chắn")                              | Đã sửa                                                                                                                                                                                                                                                                             |
| Nghiêm trọng 5 (tên điểm bị nét cắt)                                  | Đã sửa: C, P, Q trên bảng vẽ (`ve-bh-cheo-mnpq`, `ve-binh-hanh-abcd`, `ve-bh-cheo-abcd`, `ve-bh-cheo-xyzt`, `ve-binh-hanh-efhk`), O của `binh-hanh-cheo-ghik` đứng ở góc trống, `so-sanh-cheo` bỏ tên O, ô "?" của 4.16 không che O (đã xem ảnh 031, 091, 104, 166, 157, 161, 163) |
| Nghiêm trọng 6 (nấc 2 của 4.18 là lời giải)                           | Đã sửa: `ghep-thang-can-goi-y` dừng ở hai tam giác, không tô xong, không dấu bằng; nấc 3 giữ `sbt-4-18-giai`                                                                                                                                                                       |
| Nên sửa 7 (nhắc từ nền phần 1)                                        | Đã sửa đủ sáu chỗ (a)–(f); đối chiếu nguyên văn phần 1: "cạnh đối", "góc đối", "Vuông góc nghĩa là…", "Êke là thước có một góc vuông"                                                                                                                                              |
| Nên sửa 8 (hình thang cân dùng từ trước định nghĩa)                   | Đã sửa: chữ khung tự giải nghĩa                                                                                                                                                                                                                                                    |
| Nên sửa 9 (lời giải đường chéo không nêu quy tắc)                     | Đã sửa cả năm câu, lặp nguyên văn quy tắc                                                                                                                                                                                                                                          |
| Nên sửa 10 (`chon-hinh-thang-can-hai-ben` dùng lại hình 4.12)         | Đã sửa: hình thang vuông lật, `th-tam-giac` thay ngũ giác                                                                                                                                                                                                                          |
| Nên sửa 11 (tứ giác lệch trông như hình thang)                        | Đã sửa: `th-tu-giac-lech` riêng, hai cạnh trên dưới nghiêng ngược chiều rõ                                                                                                                                                                                                         |
| Nên sửa 12 (câu quy tắc `so-sanh-bon-hinh`)                           | Đã sửa, câu quy tắc, recap, card khớp nguyên văn (viết lại tiếp sau lượt Đọc hiểu)                                                                                                                                                                                                 |
| Nên sửa 13 (hình chạm 4.16)                                           | Sửa một phần, chấp nhận: ô "?" không còn chồng, ô nửa đường chéo nằm ngoài ABCD, đã có dòng "Chạm từng nửa đường chéo và từng góc của ABCD để đo." Ô góc vẫn nằm trong ABCD (Góp ý 8)                                                                                              |
| Nên sửa 14 (4.17 không kiểm được trên màn)                            | Đã sửa: `sbt-hinh-4-15` là hình chạm đo 9 ô, có dòng bảo chạm; ô không chồng                                                                                                                                                                                                       |
| Nên sửa 15 (`dan-4-17-thoi` tự trả lời)                               | Đã sửa; lời `wrong` mới đã đúng ở vòng 4                                                                                                                                                                                                                                           |
| Nên sửa 16 (mẹo thiếu bước đặt êke)                                   | Đã sửa: lời mẹo và hình `truot-eke` có A, D, B; thử mẹo ở 45°, 60°, 75° và êke đặt trùng AD: các đường kẻ theo cạnh đã đặt đều song song với AD                                                                                                                                    |
| Nên sửa 17 (câu quy tắc đường chéo nhiều cách nói)                    | Đã sửa: câu quy tắc, `facts`, chú thích, `aria-label` thống nhất "cắt nhau tại trung điểm của mỗi đường"                                                                                                                                                                           |
| Nên sửa 18 ("điểm riêng")                                             | Đã sửa: "tính chất" ở note, nhãn, `done`                                                                                                                                                                                                                                           |
| Nên sửa 19 (thiếu ví dụ đời sống)                                     | Đã sửa: cánh cửa, khung diều, viên gạch; cắt gạch giấy                                                                                                                                                                                                                             |
| Nên sửa 20 (`explain` `ve-bh-cheo-hinh-gi` dùng chiều chưa dạy)       | Đã sửa                                                                                                                                                                                                                                                                             |
| Nên sửa 21 (nhiễu trái dữ kiện đề)                                    | Đã sửa: "Chưa biết, phải đo hai cạnh bên"                                                                                                                                                                                                                                          |

Câu `bookPractice` đổi (4.9, 4.12, 4.16, 4.17, 4.18): đề, lựa chọn và đáp án khớp `sbt-p68.png`, `sbt-p69.png` và lời giải `sbt-p115.png` (4.9: c, b; 4.16: EFPQ là hình bình hành, ABCD là hình chữ nhật; 4.17: OABC, OCDE là hình thoi, BEDC là hình thang cân). Ở 4.16 và 4.17 lời sách đứng nguyên văn, chỉ thêm khối app "Chạm … để đo." đứng trước "Chọn đáp án đúng.".

Điểm của chủ dự án (nhắc ngắn "song song"): `$.sections[0].blocks[0].children[1]` "Hai đường thẳng song song là hai đường không bao giờ cắt nhau. Hai cạnh song song nằm trên hai đường như vậy." nằm ở chỗ đầu tiên bài dùng từ này (overview và màn đầu chưa dùng), đúng và đủ cho bé nhớ lại; dấu mũi tên trên hình được chú thích ở khung hình ("cùng dấu mũi tên"); không dạy lại cả phần. Chỉ lệch chữ nhẹ so với phần 1: Góp ý 7.

## Vòng 5 (giữ lại): Nghiêm trọng

Không có.

Hai chữ mới của vòng 5, đã soát từng chữ:

| Vị trí                                                                                                    | Chữ mới                                                                                                                                            | Kết quả                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$.exercises[39].explain.wrong[0]` (`ex.kiem-chac-chan-binh-hanh`, lựa chọn b "hai đường chéo bằng nhau") | "Hai đường chéo bằng nhau thì chưa đủ. Ví dụ, cái thang chữ A có hai đường chéo bằng nhau, nhưng nó là hình thang cân, không phải hình bình hành." | Đúng: là một ví dụ cụ thể, không nói quy tắc chung nên không loại hình chữ nhật; khớp lựa chọn b; khớp câu bài đã dạy "Chiếc thang chữ A có dạng hình thang cân" (`$.sections[2]`); hình thang cân có hai đường chéo bằng nhau (quy tắc bài đã dạy) và cạnh bên không song song nên không là hình bình hành. 31 chữ, từ lớp 6. Nên sửa 2 của vòng 4 đã giải. Xem Nên sửa 2. |
| `$.exercises[54].explain.wrong[1]` (`ex.dan-4-17-thoi`, lựa chọn tc "Hình thang cân")                     | "Hình thang cân có hai góc kề một đáy bằng nhau. OUVW có góc U, góc W bằng 60°, còn góc O, góc V bằng 120°."                                       | Đúng số: O là tâm lục giác đều, góc U = góc OUV = 60° (tam giác đều), góc W = góc VWO = 60°, góc V = góc UVW = 120° (góc lục giác đều), góc O = góc WOU = 2 x 60° = 120°. Mỗi cạnh của OUVW có hai góc kề là 60° và 120°, không cạnh nào có hai góc kề bằng nhau nên không là hình thang cân. Khớp lựa chọn tc và hình `hex-uvwxyz`. Xem Nên sửa 3.                         |

Tìm cả bài (vòng 4) không còn câu nói như quy tắc chung mà sai; vòng 5 không thêm cụm nào mới. Cụm "hình thang cân có hai đáy dài ngắn khác nhau" không còn ở `[39]` (grep: còn ở các câu đã duyệt vòng 4 `[13]` có "thường", `ex.chon-hinh-binh-hanh`, `ex.thang-can-ten`, `ex.luc-giac-gom-thang-can`, đều nói hình cụ thể hoặc có "thường").

## Vòng 5 (giữ lại): Nên sửa

### 1. Mục Đọc hiểu còn mơ hồ sau lượt 3, không chặn duyệt

- Vị trí: (a) `$.exercises[53].prompt[0]`, `$.exercises[56].prompt[0]` (lời sách nguyên văn của 4.16, 4.17, không viết lại được); (b) câu quy tắc vẽ bằng compa `$.sections[6].blocks[1].children[0]`, lặp ở `$.sections[6].recap.caption`, `$.cards[6].recap.caption`, `$.sections[9].blocks[1].children[2]`; (c) hai note mở đầu `$.sections[6].blocks[0].children[0]`, `[1]`; (d) `$.exercises[56].explain.text`
- Vấn đề: lượt 3 của Haiku còn 2 Hiểu mơ hồ và 5 Khó hiểu. Với (b) và (c) Haiku đọc lẻ từng mục nên chê cả từ "compa", "tâm", "bán kính", "độ mở compa", đã dạy ở Bài 18 và phần 1; câu (b) dài hai ý nhưng đã chia bước bằng "Sau đó", có hình chạy từng bước ngay trước. (d) cần hình đo của `sbt-hinh-4-15` để thấy BE song song CD.
- Sửa (tuỳ tác giả): (b) tách thành hai câu quy tắc ngắn nếu muốn, sửa đủ bốn chỗ lặp; (d) thêm một câu nói BE nằm trên đường chéo qua O. Không chặn duyệt.

### 2. `ex.kiem-chac-chan-binh-hanh`: bé còn phải đoán "đường chéo" của cái thang

- Vị trí: `$.exercises[39].explain.wrong[0].text`
- Vấn đề: Haiku lượt 3 vẫn ghi Hiểu mơ hồ ("câu so sánh phức tạp"). Câu đúng và không còn đọc được như quy tắc chung; nhưng cái thang thật không vẽ đường chéo, bé phải tự nối hình thang cân của thang với hai đường chéo nối các đỉnh.
- Sửa (tuỳ tác giả): "Ví dụ, mặt bên của thang chữ A là hình thang cân: hai đường chéo của nó bằng nhau, nhưng nó không phải hình bình hành." Không chặn duyệt.

### 3. `ex.dan-4-17-thoi`: lời `wrong` của hình thang cân chưa nêu kết luận

- Vị trí: `$.exercises[54].explain.wrong[1].text`
- Vấn đề: Haiku lượt 3 ghi Hiểu mơ hồ ("không rõ cấu trúc hình"). Câu nêu quy tắc rồi hai số đo nhưng không nói "không bằng nhau nên chưa phải hình thang cân"; bé phải tự so 60° với 120° (bản vòng 4 có câu kết "không bằng nhau" nhưng Haiku lượt 1 cũng chưa hiểu rõ).
- Sửa (tuỳ tác giả): thêm "Hai góc kề cùng một cạnh là 60° và 120°, không bằng nhau, nên OUVW không là hình thang cân." Không chặn duyệt.

## Vòng 5 (giữ lại): Góp ý

### 1. Sáu Góp ý của vòng 2 chưa sửa (tuỳ tác giả)

Mỗi dòng dưới đây là một Góp ý, chưa đổi trong diff:

- Góp ý 2 vòng 2: `$.exercises[16]` (`ex.cheo-tc-cap-bang-nhau`) hỏi về đường chéo mà hình `thang-can-ten` không vẽ đường chéo.
- Góp ý 3 vòng 2: `$.exercises[29]` (`ex.ve-bh-canh-dc`) hỏi tính chất cạnh đối cho thẻ "Vẽ hình bình hành".
- Góp ý 7 vòng 2: `$.exercises[32]` (`ex.ve-bh-cheo-mnpq`) trùng tên MNPQ với "Cùng làm" của `$.sections[6].blocks[2]` (số liệu đã khác).
- Góp ý 8 vòng 2: `$.exercises[41]` (`ex.dem-thoi-luc-giac`) dùng lại Hình 4.10 với đúng tên đỉnh.
- Góp ý 9 vòng 2: `visual.do-kiem-binh-hanh` lặp hình và số của `visual.kiem-bh-cac-buoc`.
- Góp ý 13 vòng 2: `$.exercises[58]` (`ex.dan-4-19-xep-quanh`) chỉ là phép trừ, không có hình.

### 2. Hình chạm đo 4.16: ô góc vẫn nằm trong ABCD

- Vị trí: `visual.sbt-hinh-4-14` ở `$.exercises[53].prompt[1]`; walk `166`
- Vấn đề: bốn ô góc tím nằm trong ABCD nhỏ, sát nhau nhưng không chồng; trên điện thoại ô nhỏ hơn.
- Sửa: nếu muốn, đặt ô góc ra ngoài đỉnh như ô nửa đường chéo.

### 3. Nhắc "song song" của `$.sections[0]` khác chữ với phần 1

- Vị trí: `$.sections[0].blocks[0].children[1]`
- Vấn đề: phần 1 viết "Hai đường thẳng song song luôn cách nhau một khoảng như nhau và không bao giờ cắt nhau"; phần 2 rút còn "là hai đường không bao giờ cắt nhau". Đúng và đủ, nhưng một khái niệm hai cách nói giữa hai bài (LL-05).
- Sửa: dùng nguyên văn câu phần 1 nếu độ dài `[length]` cho phép.

### 4. `ex.dan-4-9-noi-ten`: lời giải chưa phân biệt hai hình

- Vị trí: `$.exercises[45].explain.text`
- Vấn đề: "Hình thang cân có hai đáy song song và hai cạnh bên bằng nhau." đúng, nhưng hình bình hành cũng có cạnh đối song song và bằng nhau, nên bé chưa thấy điều gì tách hình thang cân khỏi hình bình hành (cạnh bên không song song).
- Sửa: nếu muốn, thêm "còn hai cạnh bên không song song" hoặc "hai góc kề một đáy bằng nhau".

### 5. Đọc hiểu cho chữ đổi vòng 4 và 5

- Vị trí: `$.exercises[39].explain.wrong[0]`, `$.exercises[54].explain.wrong[1]`
- Vấn đề: đã hết ba lượt Haiku, hai mục còn Hiểu mơ hồ (Nên sửa 2 và 3).
- Sửa: không cần thêm lượt; xem Nên sửa 2 và 3.
