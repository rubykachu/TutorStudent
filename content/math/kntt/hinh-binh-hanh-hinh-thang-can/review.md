# Review: Hình bình hành. Hình thang cân (`hinh-binh-hanh-hinh-thang-can`)

- Bài: `content/math/kntt/hinh-binh-hanh-hinh-thang-can/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff` so với bản vòng 2), section: mọi section có mục đổi (`hinh-binh-hanh`, `so-sanh-bon-hinh`, `ve-hinh-binh-hanh`, `ve-binh-hanh-cheo`, `kiem-binh-hanh`, `ghep-hinh`, `bai-tap-sach-bai-tap`) cùng các câu luyện, câu kho ôn và hình dùng chung `construction.ts`
- Nguồn đã đọc: `sources/math/hinh-binh-hanh-hinh-thang-can/` - sbt-p68, sbt-p69, sbt-p115; phần 1 `content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/lesson.json` (chỉ đọc)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): 130 / 9 / 0 (đếm theo mục; dòng "Tổng" cộng các phần ghi 131 Hiểu rõ); tệp `.shots/review/hinh-binh-hanh-hinh-thang-can/doc-hieu.md`; lượt 2 và 3 ở `doc-hieu-2.md`, `doc-hieu-3.md`
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ba thiết bị (iPad, điện thoại, iPad ngang), ảnh trong `.shots/walk/hinh-binh-hanh-hinh-thang-can/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng (1 Nên sửa, 8 Góp ý); đã chạy `pnpm content:hash hinh-binh-hanh-hinh-thang-can --root content --mark`, bài giữ `draft`
- Bản đã review: `5cbbe93f565062c976ac58cdef41795ddc6a8ea6a7cb9d3e9f2aa4b4fed06b60` (`pnpm content:diff` so với bản này)

## Tình trạng các mục vòng 2

Vòng 1 (21 Nghiêm trọng trước khi tách bài) và vòng 2 (6 Nghiêm trọng, 15 Nên sửa, 15 Góp ý): báo cáo vòng 2 ở commit `a21fe18`.

| Mục vòng 2 | Tình trạng |
|---|---|
| Nghiêm trọng 1 (hai câu "vật này có dạng hình gì") | Đã sửa: đề cho tính chất, lựa chọn Hình thoi/Hình vuông/Hình chữ nhật, mỗi câu một đáp án đúng, lời giải đi từ tính chất sang hình |
| Nghiêm trọng 2 (`wrong` "chỉ có một cặp cạnh song song"; "chắc chắn") | Đã sửa; tìm cả bài không còn cụm "chỉ có một cặp" |
| Nghiêm trọng 3 (nhận hình thang cân vì cạnh bên bằng nhau) | Đã sửa ở 4.9, lục giác, câu luyện; nhưng bản sửa và chỗ cùng kiểu sinh lỗi mới: xem Nghiêm trọng 1 |
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
| Nên sửa 15 (`dan-4-17-thoi` tự trả lời) | Đã sửa; lưu ý lời `wrong` mới: xem Nghiêm trọng 1 |
| Nên sửa 16 (mẹo thiếu bước đặt êke) | Đã sửa: lời mẹo và hình `truot-eke` có A, D, B; thử mẹo ở 45°, 60°, 75° và êke đặt trùng AD: các đường kẻ theo cạnh đã đặt đều song song với AD |
| Nên sửa 17 (câu quy tắc đường chéo nhiều cách nói) | Đã sửa: câu quy tắc, `facts`, chú thích, `aria-label` thống nhất "cắt nhau tại trung điểm của mỗi đường" |
| Nên sửa 18 ("điểm riêng") | Đã sửa: "tính chất" ở note, nhãn, `done` |
| Nên sửa 19 (thiếu ví dụ đời sống) | Đã sửa: cánh cửa, khung diều, viên gạch; cắt gạch giấy |
| Nên sửa 20 (`explain` `ve-bh-cheo-hinh-gi` dùng chiều chưa dạy) | Đã sửa |
| Nên sửa 21 (nhiễu trái dữ kiện đề) | Đã sửa: "Chưa biết, phải đo hai cạnh bên" |

Câu `bookPractice` đổi (4.9, 4.12, 4.16, 4.17, 4.18): đề, lựa chọn và đáp án khớp `sbt-p68.png`, `sbt-p69.png` và lời giải `sbt-p115.png` (4.9: c, b; 4.16: EFPQ là hình bình hành, ABCD là hình chữ nhật; 4.17: OABC, OCDE là hình thoi, BEDC là hình thang cân). Ở 4.16 và 4.17 lời sách đứng nguyên văn, chỉ thêm khối app "Chạm … để đo." đứng trước "Chọn đáp án đúng.".

Điểm của chủ dự án (nhắc ngắn "song song"): `$.sections[0].blocks[0].children[1]` "Hai đường thẳng song song là hai đường không bao giờ cắt nhau. Hai cạnh song song nằm trên hai đường như vậy." nằm ở chỗ đầu tiên bài dùng từ này (overview và màn đầu chưa dùng), đúng và đủ cho bé nhớ lại; dấu mũi tên trên hình được chú thích ở khung hình ("cùng dấu mũi tên"); không dạy lại cả phần. Chỉ lệch chữ nhẹ so với phần 1: Góp ý 7.

## Nghiêm trọng

### 1. Lời giải và lời `wrong` nói "hình thang cân có hai đáy dài ngắn khác nhau", trái định nghĩa của chính bài - LL-17, LL-20

- Vị trí: `$.exercises[54].explain.wrong[1].text` (`ex.dan-4-17-thoi`, chữ mới của bản sửa), cùng kiểu ở `$.exercises[13].explain.wrong[0].text` (`ex.thang-can-chon-cau-dung`), `$.exercises[45].explain.text` (`ex.dan-4-9-noi-ten`), `$.exercises[39].explain.wrong[0].text` (`ex.kiem-chac-chan-binh-hanh`)
- Nguồn: định nghĩa của bài `$.sections[2].blocks[0].children[0]` ("hình thang là tứ giác có hai cạnh đối song song"), `$.sections[7].blocks[2].children[0]` ("hình thang có hai góc kề một đáy bằng nhau là hình thang cân"); chính `$.exercises[55].explain.wrong[1]` thừa nhận hình bình hành có hai góc kề đáy bằng nhau khi là góc vuông
- Vấn đề: theo hai câu của bài, hình chữ nhật là hình thang cân có hai đáy bằng nhau, đồng thời là hình bình hành. Các câu trên nói như quy tắc chung: "Hình thang cân có hai cạnh đáy dài ngắn khác nhau" (`[54]`, `[13]`, `[45]`), "Hình thang cân … không phải hình bình hành" (`[39]`). Đây cùng kiểu với Nghiêm trọng 2 của vòng 2 (quy tắc sai về hình thang cân mà bé phải bỏ ở lớp 8). `[54]` là chữ mới do bản sửa Nghiêm trọng của vòng 2 (Nên sửa 15) mang vào; ba chỗ còn lại là chỗ cùng kiểu vòng 2 bỏ sót.
- Sửa: bỏ quy tắc chung về đáy, nêu điều kiện thật của hình.
  - `[54].wrong[1]` (tc): "Hình thang cân có hai góc kề một đáy bằng nhau, còn OUVW có hai góc kề một cạnh là 60° và 120°."
  - `[13].wrong[0]` (c): "Hai cạnh đáy của hình thang cân thường dài ngắn khác nhau, nên bốn cạnh thường không bằng nhau."
  - `[45].explain.text`: "Hình bình hành có hai cặp cạnh đối song song. Hình thang cân chỉ có hai đáy song song, hai cạnh bên bằng nhau nhưng không song song."; hoặc bỏ cụm "dài ngắn khác nhau" và chỉ giữ "hai cạnh bên bằng nhau".
  - `[39].wrong[0]` (b): "Có hình thang cân có hai đường chéo bằng nhau mà không phải hình bình hành."
  - Tìm cả bài cụm "dài ngắn khác nhau" và "không phải hình bình hành" sau khi sửa.

## Nên sửa

### 2. Mục Đọc hiểu còn mơ hồ sau lượt 3, không chặn duyệt

- Vị trí: (a) `$.exercises[53].prompt[0]`, `$.exercises[56].prompt[0]` (lời sách nguyên văn của 4.16, 4.17, không viết lại được); (b) câu quy tắc vẽ bằng compa `$.sections[6].blocks[1].children[0]`, lặp ở `$.sections[6].recap.caption`, `$.cards[6].recap.caption`, `$.sections[9].blocks[1].children[2]`; (c) hai note mở đầu `$.sections[6].blocks[0].children[0]`, `[1]`; (d) `$.exercises[56].explain.text`
- Vấn đề: lượt 3 của Haiku còn 2 Hiểu mơ hồ và 5 Khó hiểu. Với (b) và (c) Haiku đọc lẻ từng mục nên chê cả từ "compa", "tâm", "bán kính", "độ mở compa", đã dạy ở Bài 18 và phần 1; câu (b) dài hai ý nhưng đã chia bước bằng "Sau đó", có hình chạy từng bước ngay trước. (d) cần hình đo của `sbt-hinh-4-15` để thấy BE song song CD.
- Sửa (tuỳ tác giả): (b) tách thành hai câu quy tắc ngắn nếu muốn, sửa đủ bốn chỗ lặp; (d) thêm một câu nói BE nằm trên đường chéo qua O. Không chặn duyệt.

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
