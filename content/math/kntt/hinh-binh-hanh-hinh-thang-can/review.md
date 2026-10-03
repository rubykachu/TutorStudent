# Review: Hình bình hành. Hình thang cân (`hinh-binh-hanh-hinh-thang-can`)

- Bài: `content/math/kntt/hinh-binh-hanh-hinh-thang-can/lesson.json`
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff` so với bản vòng 3, commit `fba50e3`, 4 chữ đổi), section: `hinh-thang-can`, `kiem-binh-hanh`, `bai-tap-sach-bai-tap` cùng các câu luyện chứa chữ đổi; tìm cả bài các cụm "dài ngắn khác nhau", "không phải hình bình hành", "chỉ có", "không bao giờ", "luôn"
- Nguồn đã đọc: `sources/math/hinh-binh-hanh-hinh-thang-can/` - sbt-p68, sbt-p69, sbt-p115; phần 1 `content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/lesson.json` (chỉ đọc)
- `content:check`: 0 lỗi của bài (lỗi `[review-hash]` của bài khác là việc dở của agent khác, bỏ qua)
- Đọc hiểu (Haiku, lượt 1): 130 / 9 / 0 (đếm theo mục; dòng "Tổng" cộng các phần ghi 131 Hiểu rõ); tệp `.shots/review/hinh-binh-hanh-hinh-thang-can/doc-hieu.md`; lượt 2 và 3 ở `doc-hieu-2.md`, `doc-hieu-3.md`; lượt cho 4 chữ đổi vòng 4 (`doc-hieu-vong-4.md`): 2 / 1 / 1; hai mục mơ hồ và khó hiểu đã viết lại, chờ Haiku đọc lại
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ba thiết bị, ảnh trong `.shots/walk/hinh-binh-hanh-hinh-thang-can/` (commit `e125aec`; vòng 4 không đổi hình hay bố cục, lời `wrong` chỉ đổi chữ nên dùng lại)
- Kết luận: Đạt: 0 Nghiêm trọng (2 Nên sửa, 10 Góp ý); Nghiêm trọng của vòng 3 đã sửa đúng; đã chạy `pnpm content:hash hinh-binh-hanh-hinh-thang-can --root content --approve` ; kết quả `status=published`, `reviewedHash` bằng dòng Bản đã review bên dưới (hash tính trên bản đã gồm hai chữ viết lại sau lượt Haiku, Reviewer đã soát hai chữ đó)
- Bản đã review: `3701be57526ea92fd5b6053d6c6a50ce671e0a4f39697cf95c66bfc4456067f9` (`pnpm content:diff` so với bản này)

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

Nghiêm trọng duy nhất của vòng 3 (lời giải nói như quy tắc chung "hình thang cân có hai đáy dài ngắn khác nhau" / "không phải hình bình hành") đã sửa đúng, đã tự kiểm từng chữ mới:

| Vị trí | Chữ mới | Kết quả |
|---|---|---|
| `$.exercises[54].explain.wrong[1]` (`ex.dan-4-17-thoi`, đáp án tc; viết lại sau lượt Haiku vòng 4) | "Hình thang cân có hai góc kề một đáy bằng nhau. Ở OUVW, hai góc ở hai đầu mỗi cạnh là 60° và 120°, không bằng nhau." | Đúng: O là tâm lục giác đều nên góc O của OUVW bằng góc UOW = 120°, góc U và góc W bằng 60° (góc tam giác đều), góc V bằng 120° (góc lục giác đều). Mỗi cạnh của OUVW có hai góc kề là 60° và 120°, không cạnh nào có hai góc kề bằng nhau, nên OUVW không là hình thang cân theo định nghĩa của bài. Khớp `wrong` của cn ("OUVW có góc 60°"). |
| `$.exercises[13].explain.wrong[0]` (`ex.thang-can-chon-cau-dung`, đáp án c) | "Hai đáy của hình thang cân thường dài ngắn khác nhau, nên bốn cạnh chưa chắc bằng nhau." | Đúng: có "thường", "chưa chắc", không nói quy tắc chung; hình chữ nhật (hai đáy bằng nhau) không bị loại. |
| `$.exercises[45].explain.text` (`ex.dan-4-9-noi-ten`) | "Hình thang cân có hai đáy song song và hai cạnh bên bằng nhau." | Đúng với định nghĩa, không còn nói đáy dài ngắn khác nhau. Xem Góp ý 4. |
| `$.exercises[39].explain.wrong[0]` (`ex.kiem-chac-chan-binh-hanh`, đáp án b; viết lại sau lượt Haiku vòng 4) | "Hai đường chéo bằng nhau thì chưa đủ. Hình thang cân có hai đáy dài ngắn khác nhau cũng có hai đường chéo bằng nhau, nhưng không phải hình bình hành." | Đúng về kiến thức nếu đọc là một hình thang cân có hai đáy khác nhau (không phải hình bình hành, hai đường chéo bằng nhau); hình chữ nhật không bị loại. Nhưng câu dùng lại đúng cụm "hình thang cân có hai đáy dài ngắn khác nhau" mà vòng 3 cấm nói như quy tắc chung: xem Nên sửa 2. |

Tìm cả bài các cụm còn lại (`grep` trên `lesson.json`), mỗi chỗ đã đọc câu quanh nó, không còn câu nói như quy tắc chung mà sai:
- "dài ngắn khác nhau": dòng `explain.wrong` của `ex.chon-hinh-binh-hanh` (hình cụ thể trong ảnh), `ex.thang-can-ten` (AC với AD của hình cụ thể), hai dòng "thường dài ngắn khác nhau" của hình thoi và hình bình hành (có "thường"; hình vuông, hình chữ nhật không nằm trong lựa chọn), `ex.luc-giac-gom-thang-can` (hai đáy của nửa lục giác cụ thể, 2a và a) - đúng.
- "không phải hình bình hành": `ex.chon-hinh-binh-hanh` (hình cụ thể "chỉ có hai cạnh song song"), `ex.ve-bh-cheo-mnpq` (OM khác OP, số của câu), `ex.kiem-chac-chan-binh-hanh` (đã nêu ở trên) - đúng.
- "chỉ có", "không bao giờ", "luôn", "chắc chắn": "chỉ có hai cạnh song song" / "chỉ có ba cạnh" của hình trong ảnh; "không bao giờ cắt nhau" là định nghĩa song song; "hình thoi luôn có hai đường chéo vuông góc" và "hình chữ nhật và hình thang cân luôn có hai đường chéo bằng nhau" đúng; "chắc chắn" chỉ trong câu hỏi - đúng.
- Bài không có chỗ nào nói hình vuông là hình thang cân hay hình chữ nhật không là hình thang cân: không có câu sai mới.

## Nên sửa

### 1. Mục Đọc hiểu còn mơ hồ sau lượt 3, không chặn duyệt

- Vị trí: (a) `$.exercises[53].prompt[0]`, `$.exercises[56].prompt[0]` (lời sách nguyên văn của 4.16, 4.17, không viết lại được); (b) câu quy tắc vẽ bằng compa `$.sections[6].blocks[1].children[0]`, lặp ở `$.sections[6].recap.caption`, `$.cards[6].recap.caption`, `$.sections[9].blocks[1].children[2]`; (c) hai note mở đầu `$.sections[6].blocks[0].children[0]`, `[1]`; (d) `$.exercises[56].explain.text`
- Vấn đề: lượt 3 của Haiku còn 2 Hiểu mơ hồ và 5 Khó hiểu. Với (b) và (c) Haiku đọc lẻ từng mục nên chê cả từ "compa", "tâm", "bán kính", "độ mở compa", đã dạy ở Bài 18 và phần 1; câu (b) dài hai ý nhưng đã chia bước bằng "Sau đó", có hình chạy từng bước ngay trước. (d) cần hình đo của `sbt-hinh-4-15` để thấy BE song song CD.
- Sửa (tuỳ tác giả): (b) tách thành hai câu quy tắc ngắn nếu muốn, sửa đủ bốn chỗ lặp; (d) thêm một câu nói BE nằm trên đường chéo qua O. Không chặn duyệt.

### 2. `ex.kiem-chac-chan-binh-hanh`: cụm "hình thang cân có hai đáy dài ngắn khác nhau" đọc được như quy tắc chung

- Vị trí: `$.exercises[39].explain.wrong[0].text`
- Vấn đề: "Hình thang cân có hai đáy dài ngắn khác nhau cũng có hai đường chéo bằng nhau, nhưng không phải hình bình hành." Ý đúng là một hình thang cân có hai đáy khác nhau thì không phải hình bình hành, nhưng bé có thể đọc là mọi hình thang cân có hai đáy khác nhau, đúng kiểu câu của Nghiêm trọng vòng 3 (hình chữ nhật là hình thang cân có hai đáy bằng nhau).
- Sửa: "Một hình thang cân có hai đáy dài ngắn khác nhau cũng có hai đường chéo bằng nhau, nhưng không phải hình bình hành." Không chặn duyệt vì câu không sai.

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

### 5. Mục Đọc hiểu cho 4 chữ đổi vòng 4

- Vị trí: bốn mục ở bảng trên
- Vấn đề: lượt Haiku cho chữ đổi vòng 4 (`doc-hieu-vong-4.md`): 2 Hiểu rõ / 1 Hiểu mơ hồ / 1 Khó hiểu; hai mục `[39].explain.wrong[0]` và `[54].explain.wrong[1]` đã viết lại sau lượt đó (chữ nằm ở bảng Nghiêm trọng), chờ Haiku đọc lại, Reviewer đã tự đọc: câu `[54]` tách hai câu, đúng và rõ.
- Sửa: không cần nếu lượt đọc lại cho "Hiểu rõ".
