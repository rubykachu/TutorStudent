# Review: Bội chung. Bội chung nhỏ nhất (`boi-chung-boi-chung-nho-nhat`)

- Bài: `content/math/kntt/boi-chung-boi-chung-nho-nhat/lesson.json`
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`): lời đọc giới thiệu (Gemini, Vindemiatrix), 3 khối `video` ở đầu section `boi-chung`, `liet-ke-bcnn`, `bcnn-phan-tich`; soát lại 5 chỗ đã sửa sau vòng 3
- Nguồn đã đọc: không đọc lại trang nào: diff không đổi chữ hay số của bài ngoài phần video và lời đọc
- `content:check`: 0 lỗi của bài ngoài `[review-hash]` (bình thường lúc này), 0 cảnh báo của bài sau `content:lock`
- `lesson:walk`: xem dòng Kết luận
- Kết luận: 0 Nghiêm trọng, 0 Nên sửa, 2 Góp ý (giữ nguyên). Không đổi `say` hay dựng lại câu nào.
- Bản đã review: `7e84565d6a82bb6ab36ca31c0253e028f75070358243ad35cf0e485eb25afd20` (`pnpm content:diff` so với bản này)
- Bản đã review: (điều phối viên ghi bằng `content:hash`)

## Vòng 4: lời đọc và video

Đã tự xem contact sheet 2 giây một khung của cả 3 video (thêm khung rời ở 29,8 s, 30,4 s, 31,0 s của `xe-buyt` để kiểm mốc), đọc `.vtt`, `report.json` và nghe lại lời đọc giới thiệu bằng Whisper.

- Mở đầu: cả 3 video mở bằng "Chào bạn!" (`opening`), lời đọc giới thiệu mở bằng "Chào bạn!", cách đệm 1 giây im lặng trước câu đầu; `pnpm video:check`: ok cả bài và 3 video.
- Nhịp: mỗi video có câu `ask` (khoảng lặng sau đạt `video:check`), mọi câu `rule` đều `think`, 2 điểm dừng mỗi video ở cuối một ý (`xe-buyt` 14,2 s sau đề bài và 46,3 s sau "Bội chung viết tắt là BC"; `liet-ke` 41,1 s sau quy tắc và 60,3 s sau "24 không chia hết cho 9"; `phan-tich` 18,3 s sau hai phân tích và 44,1 s sau quy tắc). Cả 6 điểm cách nhau từ 3 câu trở lên, không điểm nào ở câu cuối video.
- Toán và chữ: bội 6 và 8 đến 48 (chung 24, 48); bội 9 (9, 18, 27, 36) và 12 (12, 24, 36), BCNN 36; 12 = 2² · 3, 18 = 2 · 3², số mũ lớn nhất 2 và 2, 4 · 9 = 36. Xưng "bạn", câu ngắn, thuật ngữ đúng glossary, màu: bội chung lime, BCNN pink, số nguyên tố sky, số mũ violet, ƯCLN không xuất hiện.
- Hình khớp lời: đáp án chưa hiện trước khi nói (24 và 48 được khoanh sau "Phút 24" ở 30,7 s, 36 sau "Số 36", ✗ của 24 sau "24 không chia hết", khoanh số mũ sau "là 2"); dải dưới trống cho phụ đề; chữ rõ, không chồng.
- Whisper: "Xe B cứ 8 phút…" 96,8% chỉ khác dấu thanh ("xe bề"); cùng chữ B ở "Xe B rời bến…" nghe đúng "bê", và lời đọc giới thiệu nghe đúng "xe B". "Bội chung viết tắt là BC." 95,8%: `spoken` đã là "bê-xê" nên chữ cái rõ, Whisper chỉ nghe "bội" thành "mỗi"; cả hai là lỗi nghe của Whisper (cũng nghe "bộ trung" ở các câu khác), không phải giọng đọc sai. Giữ nguyên, không thêm `say`.
- Lời đọc giới thiệu: 12 câu, 59,4 giây, đúng chữ `overview` (đã có `whyItMatters` mới), nghe lại đúng từng câu (Whisper chỉ nghe "bội chung" thành "bộ trung" và "vỉ" thành "vì").

## Vòng 4: 5 chỗ sửa sau vòng 3

- `rang-goi-y-20-25` (hình gợi ý của `rang-9-6-vong`): BCNN(20, 25) = 100, 100 : 20 = 5, 100 : 25 = 4; cặp 20 và 25 không là đề của câu nào trong bài, nên không lộ `bcnn-16-20` (80) và cũng không lộ đáp số 3 của `rang-9-6-vong`. Id cũ không còn ở `src/` và `tests/`.
- `overview.whyItMatters`: một câu, một cách đọc (số bút ít nhất để bằng số vở); "vỉ" và "xếp" đã dùng ở câu `mua-but-vo-5-8` (section `liet-ke-bcnn`).
- `xe-18-27`: 18 = 2 · 3², 27 = 3³, BCNN = 2 · 3³ = 54 (đúng với `answer` 54 và `check.expr`); `explain` 2 câu; không còn gần `bus-15-20`.
- Mẹo `chon-cong-cu`: nói theo chiều chia hết, vế ƯCLN có "lớn nhất", vế BCNN không nói "nhỏ nhất"; đúng với mọi câu của section `ucln-hay-bcnn` (`chon-dang-24-40`, `hai-chu-so-8-10`, `chon-3-11-tu-50-den-100`, `chon-bcnn-nhieu`).
- Lựa chọn c của `chon-bcnn-nhieu`: 18 và 30 (BCNN 90), cặp không trùng câu nào khác; đáp án a, c vẫn đúng, b và d vẫn là ƯCLN.

## Góp ý

### 1. Nhãn "(BC)" hiện trước câu "Bội chung viết tắt là BC"

- Vị trí: `video/projects/boi-chung-boi-chung-nho-nhat/xe-buyt/index.html` (`#gta`)
- Vấn đề: chip "bội chung (BC)" hiện ở 40 s theo chữ "gọi", câu nói về chữ viết tắt ở 44 s.
- Sửa: tuỳ tác giả; không chặn, không dựng lại.

### 2. `liet-ke`: 41 giây đầu chưa có điểm dừng

- Vị trí: `video/projects/boi-chung-boi-chung-nho-nhat/liet-ke/script.json`
- Vấn đề: điểm dừng đầu là câu quy tắc ở 41,1 s; trước đó đã có một câu `ask` và `think` nên bé có nhịp nghĩ. Không thể thêm điểm dừng ở "Số 36 có ở cả hai hàng" vì cách câu quy tắc dưới 3 câu.
- Sửa: giữ nguyên.

## Kết quả kiểm 5 lỗi Nghiêm trọng của vòng 2

Cả 5 đã sửa đúng và không sinh lỗi Nghiêm trọng mới.

- (a) Section `ucln-hay-bcnn`: câu quy tắc, recap section, recap card giống từng chữ ("thành nhiều phần nhất", "đoạn dài nhất"); khớp câu quy tắc Bài 11 `chia-deu-nhieu-nhat` ("Số phần nhiều nhất là ƯCLN") và `bai-toan-uc`. Mẹo `tip.chon-cong-cu` nói theo chiều chia hết, có "lớn nhất" ở vế ƯCLN; đúng với `chon-dang-24-40`, `chia-30-45`, `chon-bcnn-nhieu` (b, d), và với mọi bài BCNN của bài: lặp lại, bánh răng (số vòng), giờ, xếp hàng còn dư (bớt số dư trước), quy đồng. Bài 11 không có dạng còn dư nên vế "bớt số dư" chỉ cần ở BCNN. Độ dài: mẹo 3 câu, câu nào cũng đạt `[length]`.
- (b) `tip.boi-so-lon` đúng cho hai và ba số. Đã tính "số đầu tiên trong bội của số lớn nhất chia hết cho mọi số còn lại" so với BCNN thật:

| Đầu vào | BCNN | Kết quả của mẹo |
|---|---|---|
| (3, 8, 10) | 120 | 120 |
| (6, 9, 15) | 90 | 90 |
| (5, 6, 10) | 30 | 30 |
| (4, 10, 14) | 140 | 140 |
| (2, 3, 4) | 12 | 12 |
| (4, 6, 10) | 60 | 60 |
| (6, 8) | 24 | 24 |
| (7, 21), (1, 7), (7, 7) | 21, 7, 7 | 21, 7, 7 |

- (c) Quy tắc section `lap-lai` ("Các việc lặp lại, cùng xảy ra một lúc, sẽ lại cùng xảy ra sau BCNN của các khoảng thời gian lặp lại.") tự đúng khi đứng một mình, khớp vế BCNN của section `ucln-hay-bcnn` ("sẽ lại cùng xảy ra lần nữa: tìm BCNN"). Note quy tắc, recap section, recap card giống từng chữ.
- (d) Section `banh-rang`: note mở ("dấu của bánh A về chỗ cũ sau mỗi 12 răng"), note cùng làm ("mỗi vòng, dấu của bánh về chỗ cũ một lần... cả hai cùng về chỗ cũ sau cùng một số răng"), dòng trong hình `gap-rang-6-4` ("Bánh A có dấu về chỗ cũ sau 6 răng, bánh B có dấu về chỗ cũ sau 4 răng"), lời kết ("Xong rồi! Lần đầu hai dấu cùng về chỗ cũ sau 12 răng."), chú giải ("Hai dấu cùng về chỗ cũ") nói cùng một nghĩa, không còn trái nhau. `meet-try.tsx` thêm trường `shared` bắt buộc, `BUS` và `GEAR` trong `catalog.ts` đều có, `gap-xe` và `gap-3-4` vẫn đúng chữ xe; `tests/visuals/boi-chung-boi-chung-nho-nhat.test.tsx` cập nhật theo chữ mới; chỉ bài này dùng `MeetTry`. Trên iPad dòng dài gãy hai dòng gọn (ảnh `132-s10-04-block.png`). Trạng thái "Xong rồi" trên điện thoại walk không bấm nên không có ảnh; theo mã, dòng tối đa ba dòng chữ trong cột dọc đã cuộn được, không có phần tử cố định chồng lên.
- (e) `tip.chung-rieng`: trên điện thoại hiện đủ "2² · 3² = 36" (ảnh `083-s6-04-block.png`).

## Soát lại các mục vòng 1 và id đổi tên của vòng 3

Đã tự giải trước khi đọc đáp án và tính lại bằng chương trình: `chon-bc-4-15-nho-hon-200` (60, 120, 180 đúng; 240 là bội chung nhưng không nhỏ hơn 200, `wrong` đúng), `ba-chu-so-7-9` (126), `dien-bc-56`, `khong-la-bc-4-9` (18), `dien-bcnn-28`, `hai-chu-so-8-10` (80), `tim-loi-bcnn-3-4-8`, `chon-dang-24-40` (nhiều đĩa nhất là ƯCLN; `wrong` b, d đúng), `hang-2-3-5-du-1` (31, chỉ một số trong 20..40), hình bánh răng `gears.tsx` (không đổi; dấu bánh A tại điểm khớp, dấu bánh B ngay cạnh). Id đổi: `chon-bcnn-4-22` (44; 88, 132 là bội chung lớn hơn, 26 không), `bao-thuc-20-45` (BCNN 180 phút = 3 giờ, 9 giờ; hình gợi ý `bao-thuc-goi-y` dùng 12, 15, 5 giờ nên không lộ; hình `bao-thuc-giai` khớp 6 giờ, 180, 9), `xe-4-10-14` (140), `bcnn-3-8-10` (120), `xe-15-25` (75), `chon-bc-4-13-nho-hon-120` (52, 104), `chon-3-11-tu-50-den-100` (66, 99). `check.expr`, `explain` (không quá 3 câu), `wrong` và id trong `checkIds`, `practiceIds`, `cardIds`, hình đều khớp; không có nhiễu nào thành đáp án đúng. Câu kiểm tra và câu luyện cùng section không trùng số hay hình, trừ hai điểm nêu ở dưới.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Hình gợi ý `rang-goi-y-16-20` hiện sẵn lời giải của câu ôn `bcnn-16-20`

- Vị trí: `$.exercises[?(@.id=="boi-chung-boi-chung-nho-nhat.ex.rang-9-6-vong")].hints.hintVisualId` và `VISUAL_SPECS["rang-goi-y-16-20"]` trong `src/visuals/math/boi-chung-boi-chung-nho-nhat/catalog.ts` (LL-07)
- Nguồn: —
- Vấn đề: hình gợi ý vẽ trọn BCNN(16, 20) = 80 cùng 80 : 16 = 5, 80 : 20 = 4. Cặp 16 và 20 là đề của `bcnn-16-20` (kho ôn card `bcnn-phan-tich`, đáp số 80), nên bé xem gợi ý ở section 10 rồi gặp lại câu ôn thì đã biết đáp án.
- Sửa: đổi sang cặp chưa dùng ở đâu trong bài, vd 20 và 25: id `rang-goi-y-20-25`, nhãn "Hai bánh răng 20 răng và 25 răng khớp nhau", các dòng `BCNN(20, 25) = 100` (tag "Sau 100 răng"), `100 : 20 = 5` ("Bánh 20 răng quay 5 vòng"), `100 : 25 = 4` ("Bánh 25 răng quay 4 vòng"); sửa `hintVisualId` của `rang-9-6-vong` và chỗ nào trong `tests/` nhắc id cũ. Số 5 và 4 khác đáp số 3 của câu nên không lộ.

### 2. `overview.whyItMatters` đọc khó hiểu

- Vị trí: `$.overview.whyItMatters`
- Nguồn: —
- Vấn đề: "mua ít nhất số bút vỉ 6 cái và vở xếp 8 quyển mà số bút bằng số vở" dễ đọc thành "mua ít nhất số vỉ bút", không rõ điều bé làm được (biết cần mua bao nhiêu bút).
- Sửa: "Bội chung nhỏ nhất giúp bạn mua ít nhất bao nhiêu bút vỉ 6 cái để bằng số vở xếp 8 quyển." (một câu, 22 âm tiết).

## Góp ý

### 1. Lựa chọn c của `chon-bcnn-nhieu` lặp cặp 12 và 16 của `bcnn-12-16`

- Vị trí: `$.exercises[?(@.id=="boi-chung-boi-chung-nho-nhat.ex.chon-bcnn-nhieu")].options[2]` (LL-07)
- Nguồn: —
- Vấn đề: bản sửa đổi 10 và 15 (trùng `xe-10-15-100`) sang 12 và 16, trùng cặp của câu luyện `bcnn-12-16` ở section 3. Câu này chỉ hỏi loại bài nên không lộ đáp số, nhưng vẫn là cặp số cũ.
- Sửa: "Hai xe rời bến mỗi 18 và 30 phút. Sau bao lâu lại cùng rời bến?" (16 âm tiết, cùng độ dài nên thanh dưới không che).

### 2. Câu `xe-15-25` gần giống ví dụ màn quy tắc section 9 (`bus-15-20`)

- Vị trí: `$.exercises[?(@.id=="boi-chung-boi-chung-nho-nhat.ex.xe-15-25")]` (LL-07)
- Nguồn: —
- Vấn đề: cùng ngữ cảnh hai xe buýt, 6 giờ, một xe 15 phút; chỉ khác xe kia (25 thay 20). Khác section nhưng bé dễ nhớ nhầm 60.
- Sửa: đổi thành 18 và 27 phút: đáp số 54, `check.expr` `2·3^3`, `explain`: "Ta có 18 = 2 · 3² và 27 = 3³, nên BCNN là 2 · 3³ = 54.", `tex` `\concept{sky}{2} \cdot \concept{sky}{3}^{\concept{violet}{3}} = \concept{pink}{54}`.

### 3. Mẹo `chon-cong-cu` còn nói "nhỏ nhất" trong khi nhiều câu BCNN của bài hỏi số trong khoảng hay số "lớn nhất"

- Vị trí: `$.sections[?(@.id=="boi-chung-boi-chung-nho-nhat.section.ucln-hay-bcnn")].blocks[2]` (`tip.chon-cong-cu`, LL-24)
- Nguồn: —
- Vấn đề: không sai (vế chia hết cho phân biệt được: `hai-chu-so-8-10` có 8 và 10 không chia hết cho 80), nhưng bé đọc "số cần tìm nhỏ nhất" rồi gặp `hai-chu-so-8-10` ("lớn nhất") hay `chon-3-11-tu-50-den-100` có thể phân vân. Mẹo nên dựa vào chiều chia hết.
- Sửa: câu thứ hai thành "Số cần tìm chia hết cho các số đã cho (lần đầu gặp lại, số trong khoảng, bớt số dư trước nếu có): tìm BCNN." (25 âm tiết, đạt `[length]`).
