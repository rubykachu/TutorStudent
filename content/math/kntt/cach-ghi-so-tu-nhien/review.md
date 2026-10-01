# Review: Cách ghi số tự nhiên (`cach-ghi-so-tu-nhien`)

- Bài: `content/math/kntt/cach-ghi-so-tu-nhien/lesson.json`
- Vòng: 4 - chỉ phần đổi (video và lời đọc) (`pnpm content:diff` so với bản vòng 3, hash `199d109696e6`), section: hang, gia-tri, chu-la-ma (khối video đầu section; kịch bản `cac-hang`, `gia-tri-chu-so`, `dong-ho-la-ma`) và `overview.narration` (phụ đề, engine, giọng)
- Nguồn đã đọc: không đọc ảnh nguồn (diff chỉ có video, khối video, lời đọc); đối chiếu chữ video với `note`, `caption`, `recap` của `lesson.json`
- `content:check`: không chạy lại ở vòng này; `pnpm video:check cach-ghi-so-tu-nhien` ok cả ba video và lời đọc
- Đọc hiểu (Haiku, chữ ba video): lượt 1 29 / 5 / 1 (tệp `.shots/review/cach-ghi-so-tu-nhien/doc-hieu-video.md`); câu "Khó hiểu" ("nhích") viết lại thành "chạy", lượt 2 trên câu đó và câu kết `gia-tri-chu-so` viết lại: 2 / 0 / 0. Lời đọc tổng quan: chữ không đổi nên không chạy
- `lesson:walk`: 0 FAIL; khối video hiện đúng ở đầu ba section (ipad, phone) và không làm hỏng phần còn lại của section
- Kết luận: Đạt: 0 Nghiêm trọng; 2 Nên sửa và Góp ý 1, 3 đã xử lý sau vòng (mục "Đã xử lý"), còn 3 Góp ý và 3 nhóm mục chưa kiểm được vì chưa nghe âm thanh (cuối tệp)
- Bản đã review: `8987b09aa2a000b40e775488d17dbeed3abf15596c97ac63d07de720f8b93b29` (`pnpm content:diff` so với bản này)

Vòng 3 (chỉ phần đổi, toàn bài): 0 Nghiêm trọng, 8 Nên sửa, 10 Góp ý; cả 8 lỗi Nghiêm trọng của vòng 2 đã sửa dứt.

## Phạm vi và cách soát vòng này

- Ba kịch bản đã đọc đủ câu, đối chiếu từng câu `rule` với `note`/`recap` (khớp nguyên văn câu đầu hoặc câu hai của note: `cac-hang` hai câu, `gia-tri-chu-so` hai câu, `dong-ho-la-ma` ba câu), tự tính lại số liệu: 42 731 (năm chữ số, chữ số 1 hàng đơn vị, chữ số 4 hàng chục nghìn), 3 507 (5 hàng trăm = 500, 7 hàng đơn vị = 7), 3 570 (7 hàng chục = 70), kim giờ IV = 4 giờ, IX = 9 giờ (góc 120° và 270°): đúng hết.
- Nhịp: 10, 13, 11 câu; không câu thường nào quá 12 chữ; câu đầu "Chào bạn!" có `opening`; mỗi video một câu `ask` và không phải câu cuối; mọi câu `rule` (trừ câu cuối) có `think`; điểm dừng 2, 3, 2, cách nhau từ 4 câu trở lên, đặt cuối một ý; thời lượng 48, 66, 58 giây.
- Clip: `hang` (cả video) gắn card `hang`, `gia-tri` (từ `s02-gia-tri`) gắn card `gia-tri`, `chu-la-ma` (từ `s02-thanh-phan`) gắn card `chu-la-ma`: đúng card.
- Màu và ký hiệu: chữ số xanh dương (ô số, chip "● 5 chữ số"), hàng tím ▲, giá trị của chữ số hồng ◆, số La Mã lime ★: đúng bài ở cả ba video.
- Hình khớp lời đã đối chiếu `index.html` với khung hình 2 giây: câu hỏi `ask` của `cac-hang` và `gia-tri-chu-so` chỉ hiện dấu "?", đáp án (đơn vị, 500) hiện sau quãng im; hình `gia-tri-chu-so` dựng nhân 1, 10, 100 đúng lúc đọc; đổi chỗ 0 và 7 đúng lúc đọc "570".
- Lời đọc tổng quan: `overview.vtt` khớp nguyên chữ `hook`, `summary`, `goals` (sau câu "Học xong bài này, bạn sẽ:") và `whyItMatters`; câu đầu "Chào bạn!" gọi "bạn"; cue đầu bắt đầu ở 1,0 giây (sau quãng đệm); `lesson.json` ghi engine `gemini`, giọng `Vindemiatrix`, model `gemini-3.1-flash-tts-preview`; `media.json` không có `narrationOpeningExempt` nên luật câu chào áp dụng và đạt.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Video `dong-ho-la-ma`: câu hỏi "có mấy thành phần?" hiện sẵn năm ô trống, lộ đáp án, và bé không đoán được

- Vị trí: `video/projects/cach-ghi-so-tu-nhien/dong-ho-la-ma/script.json` cảnh `s02-thanh-phan` câu 1 (`pause: "ask"`); `index.html` các ô `#bs0` đến `#bs4` hiện cùng lúc với chữ "bạn" của câu hỏi (khung hình 13, 15 giây). Cùng kiểu LL-02, LL-15
- Nguồn: —
- Vấn đề: lúc hỏi "số La Mã có mấy thành phần?", màn có đúng năm ô "?" nên bé đếm ô là biết "năm" mà không phải đoán; câu rule ngay sau nói "năm thành phần". Ngoài ra "thành phần" chỉ được giải nghĩa ở note thứ hai của bài ("Thành phần là mảnh nhỏ để ghép nên số La Mã"), video không giải nghĩa nên bé chưa biết đang đoán điều gì.
- Sửa: khi hỏi chỉ hiện một dấu "?" (hoặc giữ đồng hồ IV), năm ô chỉ hiện khi đọc "năm thành phần". Nếu chủ dự án cho đổi lời: hỏi điều bé đoán được từ hình, vd "Kim giờ chỉ vào số IV. Bạn thử đoán xem: đó là mấy giờ?", rồi mới vào câu rule về năm thành phần. Đổi lời thì phải dựng lại video (xin ý chủ dự án theo luật video).

### 2. Video `gia-tri-chu-so`: câu kết nêu một nhận xét chung mà không có cờ `rule`, và nói khác chữ của bài

- Vị trí: `video/projects/cach-ghi-so-tu-nhien/gia-tri-chu-so/script.json` cảnh `s03-doi-hang` câu 5 "Cùng một chữ số, ở hàng khác thì giá trị khác." (câu cuối video). LL-05
- Nguồn: —
- Vấn đề: câu này là kết luận rút ra từ so sánh 3 507 với 3 570, đúng kiến thức và không phải quy tắc phải nhớ (quy tắc là nhân với 1, 10, 100 và đã có hai câu `rule`), nên không xếp Nghiêm trọng. Nhưng cùng một ý, bài lại nói bằng chữ khác ("Mỗi chữ số có giá trị riêng, tuỳ hàng nó đứng" ở hình `gia-tri-kham-pha`; "cùng một chữ số có giá trị khác nhau ở mỗi hàng" ở note), nên bé nghe một cách, đọc một cách; `video:build` cũng không kiểm câu này vì không có cờ.
- Sửa: chọn một trong hai. (a) Đưa đúng câu này vào chữ của bài (note hay caption của khối khám phá) rồi đánh `rule: true` cho câu video; (b) bỏ câu, để video kết bằng ví dụ 3 570 và câu `rule` ở câu 4 (khi đó câu `rule` cuối video không cần `think`). Cả hai đều phải dựng lại video.

## Góp ý

### 1. Poster của `gia-tri-chu-so` hiện sẵn đáp án của câu hỏi trong video

- Vị trí: `script.json` của `gia-tri-chu-so`, `poster: { "scene": "s02-gia-tri", "at": 0.95 }`; ảnh walk `061-s5-01-block.png`
- Vấn đề: ảnh bìa là khung cuối cảnh có "◆ 500" và "◆ 7" cùng chip "giá trị = chữ số nhân 1, 10, 100…", bé thấy đáp án trước khi video hỏi "chữ số 5 có giá trị bao nhiêu?".
- Sửa: đặt `poster.at` sớm hơn trong `s02-gia-tri` (lúc đã có dấu "?" và chưa có 500) hoặc dùng `s01-so`; cần dựng lại ảnh bìa.

### 2. Hai câu `rule` bị Haiku chấm "Hiểu mơ hồ"

- Vị trí: `cac-hang` `s03-ten#1` ("Từ phải sang trái, các hàng lần lượt là đơn vị, chục, … và cứ thế."), `gia-tri-chu-so` `s03-doi-hang#4` ("Chữ số ở hàng đơn vị nhân 1; sang trái một hàng thì số để nhân thêm một chữ số 0.")
- Vấn đề: cả hai là chữ chép nguyên văn quy tắc của bài đã qua vòng đọc hiểu của chính bài, không sửa riêng ở video được; hình đã dựng từng bước theo lời (tên hàng lần lượt hiện, bội 1, 10, 100, 1 000 lần lượt hiện).
- Sửa: không cần sửa ở video; nếu sau này đổi chữ quy tắc trong `lesson.json` thì đổi theo.

### 3. Lượt Haiku 2 chưa chạy cho câu đã viết lại

- Vị trí: `dong-ho-la-ma/script.json` `s03-chi-gio` câu 2 "Kim giờ chạy đến số IX." (trước là "nhích")
- Vấn đề: skill yêu cầu lượt đọc hiểu sau chỉ trên mục đã viết lại; chưa thấy kết quả lượt này. "Chạy" là chữ quen với kim đồng hồ nên rủi ro thấp.
- Sửa: điều phối chạy lượt Haiku 2 chỉ cho mục này, và cập nhật cột LL-25 trong `docs/lessons-learned/index.md` theo lượt 1 (1 Khó hiểu, 5 Hiểu mơ hồ).

### 4. Phụ đề lời đọc tổng quan: chữ "000" và "đồng" cùng một mốc thời gian

- Vị trí: `public/media/narration/cach-ghi-so-tu-nhien/overview.vtt` cue 4 ("25 <00:00:07.020>000 <00:00:07.020>đồng")
- Vấn đề: hai chữ có cùng mốc nên phụ đề karaoke tô "000" và "đồng" cùng lúc (số "25 000" được đọc liền một cụm "hai mươi lăm nghìn"). Chỉ là hiệu ứng tô chữ, không sai chữ.
- Sửa: tuỳ chủ dự án; cue 24 cùng cụm (46,192 đến 47,492) đã đúng mốc.

## Đã xử lý sau vòng

- Nên sửa 1 (`dong-ho-la-ma`): lúc hỏi chỉ hiện một ô "?"; năm ô hiện khi đọc "năm thành phần" (chỉ đổi `index.html`, lời không đổi). Phần "thành phần" chưa giải nghĩa trong video: giữ nguyên, bước vào bài bé thấy năm thẻ I, V, X, IV, IX hiện lần lượt ngay sau câu quy tắc.
- Nên sửa 2 (`gia-tri-chu-so`): câu kết đổi thành "Cùng một chữ số có giá trị khác nhau ở mỗi hàng." (lấy theo chữ của note "cùng một chữ số có giá trị khác nhau ở mỗi hàng"), 11 chữ; lượt Haiku 2 "Hiểu rõ".
- Góp ý 1: ảnh bìa `gia-tri-chu-so` lấy ở `s01-so` (0,6), chưa có đáp án.
- Góp ý 3: lượt Haiku 2 đã chạy (2 / 0 / 0); cột LL-25 đã cập nhật.

## Chưa kiểm được (reviewer không nghe được âm thanh, cần người thật nghe lại)

1. Bốn câu La Mã có `say` của `dong-ho-la-ma` (câu "Số La Mã đến 30 ghép từ năm thành phần: I, V, X, IV và IX.", "I bằng 1, V bằng 5, …", "Kim giờ chạy đến số IX.", "IX bằng 9, nên đó là 9 giờ."): Whisper nghe thành "Y, V, tích YV, YX" (tỉ lệ khớp 0,83 đến 0,96, đã thử 4 lần), vì Whisper viết chữ "I" thành "Y" khi nghe chữ cái. Cần nghe xem giọng có đọc đúng "i, vê, ích, i-vê, i-ích" không.
2. Nhất quán cách đọc IV, IX giữa các câu: bốn câu không có `say` ("Kim giờ đang chỉ vào số IV.", "IV và IX là cụm: …", "Kim giờ chỉ vào IV, nên là 4 giờ.", "Nhớ nhé: IV là 4, còn IX là 9.") Whisper ghi thẳng "IV", "IX" (khớp 1,0), còn câu có `say` ghi "YV", "Y x". Hai nhóm có thể đang được đọc khác nhau (vd "ai-vi" so với "i-vê"); bé phải nghe một tên duy nhất cho một ký hiệu. Cần nghe cả mười một chỗ có I, V, X, IV, IX.
3. Ba chỗ Whisper nghe khác chữ: "Bạn cú" nghe thành "Bạn cứu" ở `cac-hang` câu 2 và `gia-tri-chu-so` câu 2 (đúng "cú" ở `dong-ho-la-ma`); "Chữ số 5 đứng ở hàng trăm" nghe thành "Chữ số nằm đứng…" (`gia-tri-chu-so` câu 3, 5 bị đọc thành "nằm"?); "gọi là hàng" nghe thành "Hàn" (`cac-hang` câu 4, khớp 0,984). Cần nghe xem "cú", "năm", "hàng" có rõ không.
