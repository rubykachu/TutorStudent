# Review: Hình bình hành. Hình thang cân (`hinh-binh-hanh-hinh-thang-can`)

- Bài: `content/math/kntt/hinh-binh-hanh-hinh-thang-can/lesson.json`
- Vòng: 5 - chỉ phần đổi (`pnpm content:diff` so với bản vòng 4, commit `db9c2f8`, 2 chữ đổi: `$.exercises[39].explain.wrong[0].text`, `$.exercises[54].explain.wrong[1].text`), section đọc lại: `kiem-binh-hanh`, `bai-tap-sach-bai-tap`
- Nguồn đã đọc: `sources/math/hinh-binh-hanh-hinh-thang-can/` - sbt-p68, sbt-p69, sbt-p115 (vòng 4, câu sách không đổi ở vòng 5); chữ đổi không thuộc câu sách
- `content:check`: 0 lỗi của bài (lỗi `[review-hash]` của bài khác nếu có là việc của agent khác, bỏ qua)
- Đọc hiểu (Haiku, lượt 1): 130 / 9 / 0 (tệp `.shots/review/hinh-binh-hanh-hinh-thang-can/doc-hieu.md`; lượt 2, 3 ở `doc-hieu-2.md`, `doc-hieu-3.md`); chữ đổi vòng 4 (`doc-hieu-vong-4.md`, `-2`, `-3`): lượt 1 2 / 1 / 1, lượt 2 0 / 1 / 1, lượt 3 0 / 2 / 0 cho hai mục của vòng này (mục `[45]` của tệp lượt 3 đã trả về bản đã duyệt, bỏ qua); hết 3 lượt, hai mục còn mơ hồ ghi ở Nên sửa 2 và 3
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ba thiết bị, ảnh trong `.shots/walk/hinh-binh-hanh-hinh-thang-can/` (commit `e125aec`; vòng 5 chỉ đổi chữ `wrong`, không đổi hình hay bố cục, dùng lại)
- Kết luận: Đạt: 0 Nghiêm trọng (3 Nên sửa, 10 Góp ý); Nên sửa 2 của vòng 4 đã giải; đã chạy `pnpm content:hash hinh-binh-hanh-hinh-thang-can --root content --approve`; kết quả `status=published`, `reviewedHash` bằng dòng Bản đã review bên dưới
- Bản đã review: `c00de14d0687dd7809a4eaf403e3429725646277c08698c119f48df340711cd8` (`pnpm content:diff` so với bản này)

## Tình trạng các mục vòng 2 và vòng 3

Vòng 1 (21 Nghiêm trọng trước khi tách bài) và vòng 2 (6 Nghiêm trọng, 15 Nên sửa, 15 Góp ý): báo cáo vòng 2 ở commit `a21fe18`.

| Mục vòng 2 | Tình trạng |
|---|---|
| Nghiêm trọng 1 (hai câu "vật này có dạng hình gì") | Đã sửa: đề cho tính chất, lựa chọn Hình thoi/Hình vuông/Hình chữ nhật, mỗi câu một đáp án đúng, lời giải đi từ tính chất sang hình |
| Nghiêm trọng 2 (`wrong` "chỉ có một cặp cạnh song song"; "chắc chắn") | Đã sửa; tìm cả bài không còn cụm "chỉ có một cặp" |
| Nghiêm trọng 3 (nhận hình thang cân vì cạnh bên bằng nhau) | Đã sửa ở 4.9, lục giác, câu luyện |
| Nghiêm trọng 4 (`wrong` "chỉ chắc chắn") | Đã sửa |
| Nghiêm trọng 5 (tên điểm bị nét cắt) | Đã sửa: C, P, Q trên bảng vẽ (`ve-bh-cheo-mnpq`, `ve-binh-hanh-abcd`, `ve-bh-cheo-abcd`, `ve-bh-cheo-xyzt`, `ve-binh-hanh-efhk`), O của `binh-hanh-cheo-ghik` đứng ở góc trống, `so-sanh-cheo` bỏ tên O, ô "?" của 4.16 không che O (đã xem ảnh 031, 091, 104, 166, 157, 161, 163) |
| Nghiêm trọng 6 (nấc 2 của 4.18 là lời giải) | Đã sửa: `ghep-thang-can-goi-y` dừng ở hai tam giác, không tô xong, không dấu bằng; nấc 3 giữ `sbt-4-18-giai` |
| Nên sửa 7 (nhắc từ nền phần 1) | Đã sửa đủ sáu chỗ (a)–(f); đối chiếu nguyên văn phần 1: "cạnh đối", "góc đối", "Vuông góc nghĩa là…", "Êke là thước có một góc vuông" |
| Nên sửa 8 (hình thang cân dùng từ trước định nghĩa) | Đã sửa: chữ khung tự giải nghĩa |
| Nên sửa 9 (lời giải đường chéo không nêu quy tắc) | Đã sửa cả năm câu, lặp nguyên văn quy tắc |
| Nên sửa 10 (`chon-hinh-thang-can-hai-ben` dùng lại hình 4.12) | Đã sửa: hình thang vuông lật, `th-tam-giac` thay ngũ giác |
| Nên sửa 11 (tứ giác lệch trông như hình thang) | Đã sửa: `th-tu-giac-lech` riêng, hai cạnh trên dưới nghiêng ngược chiều rõ |
| Nên sửa 12 (câu quy tắc `so-sanh-bon-hinh`) | Đã sửa, câu quy tắc, recap, card khớp nguyên văn (viết lại tiếp sau lượt Đọc hiểu) |
| Nên sửa 13 (hình chạm 4.16) | Sửa một phần, chấp nhận: ô "?" không còn chồng, ô nửa đường chéo nằm ngoài ABCD, đã có dòng "Chạm từng nửa đường chéo và từng góc của ABCD để đo." Ô góc vẫn nằm trong ABCD (Góp ý 8) |
| Nên sửa 14 (4.17 không kiểm được trên màn) | Đã sửa: `sbt-hinh-4-15` là hình chạm đo 9 ô, có dòng bảo chạm; ô không chồng |
| Nên sửa 15 (`dan-4-17-thoi` tự trả lời) | Đã sửa; lời `wrong` mới đã đúng ở vòng 4 |
| Nên sửa 16 (mẹo thiếu bước đặt êke) | Đã sửa: lời mẹo và hình `truot-eke` có A, D, B; thử mẹo ở 45°, 60°, 75° và êke đặt trùng AD: các đường kẻ theo cạnh đã đặt đều song song với AD |
| Nên sửa 17 (câu quy tắc đường chéo nhiều cách nói) | Đã sửa: câu quy tắc, `facts`, chú thích, `aria-label` thống nhất "cắt nhau tại trung điểm của mỗi đường" |
| Nên sửa 18 ("điểm riêng") | Đã sửa: "tính chất" ở note, nhãn, `done` |
| Nên sửa 19 (thiếu ví dụ đời sống) | Đã sửa: cánh cửa, khung diều, viên gạch; cắt gạch giấy |
| Nên sửa 20 (`explain` `ve-bh-cheo-hinh-gi` dùng chiều chưa dạy) | Đã sửa |
| Nên sửa 21 (nhiễu trái dữ kiện đề) | Đã sửa: "Chưa biết, phải đo hai cạnh bên" |

Câu `bookPractice` đổi (4.9, 4.12, 4.16, 4.17, 4.18): đề, lựa chọn và đáp án khớp `sbt-p68.png`, `sbt-p69.png` và lời giải `sbt-p115.png` (4.9: c, b; 4.16: EFPQ là hình bình hành, ABCD là hình chữ nhật; 4.17: OABC, OCDE là hình thoi, BEDC là hình thang cân). Ở 4.16 và 4.17 lời sách đứng nguyên văn, chỉ thêm khối app "Chạm … để đo." đứng trước "Chọn đáp án đúng.".

Điểm của chủ dự án (nhắc ngắn "song song"): `$.sections[0].blocks[0].children[1]` "Hai đường thẳng song song là hai đường không bao giờ cắt nhau. Hai cạnh song song nằm trên hai đường như vậy." nằm ở chỗ đầu tiên bài dùng từ này (overview và màn đầu chưa dùng), đúng và đủ cho bé nhớ lại; dấu mũi tên trên hình được chú thích ở khung hình ("cùng dấu mũi tên"); không dạy lại cả phần. Chỉ lệch chữ nhẹ so với phần 1: Góp ý 7.

## Nghiêm trọng

Không có.

Hai chữ mới của vòng 5, đã soát từng chữ:

| Vị trí | Chữ mới | Kết quả |
|---|---|---|
| `$.exercises[39].explain.wrong[0]` (`ex.kiem-chac-chan-binh-hanh`, lựa chọn b "hai đường chéo bằng nhau") | "Hai đường chéo bằng nhau thì chưa đủ. Ví dụ, cái thang chữ A có hai đường chéo bằng nhau, nhưng nó là hình thang cân, không phải hình bình hành." | Đúng: là một ví dụ cụ thể, không nói quy tắc chung nên không loại hình chữ nhật; khớp lựa chọn b; khớp câu bài đã dạy "Chiếc thang chữ A có dạng hình thang cân" (`$.sections[2]`); hình thang cân có hai đường chéo bằng nhau (quy tắc bài đã dạy) và cạnh bên không song song nên không là hình bình hành. 31 chữ, từ lớp 6. Nên sửa 2 của vòng 4 đã giải. Xem Nên sửa 2. |
| `$.exercises[54].explain.wrong[1]` (`ex.dan-4-17-thoi`, lựa chọn tc "Hình thang cân") | "Hình thang cân có hai góc kề một đáy bằng nhau. OUVW có góc U, góc W bằng 60°, còn góc O, góc V bằng 120°." | Đúng số: O là tâm lục giác đều, góc U = góc OUV = 60° (tam giác đều), góc W = góc VWO = 60°, góc V = góc UVW = 120° (góc lục giác đều), góc O = góc WOU = 2 x 60° = 120°. Mỗi cạnh của OUVW có hai góc kề là 60° và 120°, không cạnh nào có hai góc kề bằng nhau nên không là hình thang cân. Khớp lựa chọn tc và hình `hex-uvwxyz`. Xem Nên sửa 3. |

Tìm cả bài (vòng 4) không còn câu nói như quy tắc chung mà sai; vòng 5 không thêm cụm nào mới. Cụm "hình thang cân có hai đáy dài ngắn khác nhau" không còn ở `[39]` (grep: còn ở các câu đã duyệt vòng 4 `[13]` có "thường", `ex.chon-hinh-binh-hanh`, `ex.thang-can-ten`, `ex.luc-giac-gom-thang-can`, đều nói hình cụ thể hoặc có "thường").

## Nên sửa

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

## Góp ý

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
