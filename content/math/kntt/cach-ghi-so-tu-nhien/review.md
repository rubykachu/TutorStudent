# Review: Cách ghi số tự nhiên (`cach-ghi-so-tu-nhien`)

- Bài: `content/math/kntt/cach-ghi-so-tu-nhien/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff` so với bản vòng 2, hash `299b9a64f115`), section: so-tu-nhien, chu-so, hang, muoi-don-vi, gia-tri, tong-gia-tri, chu-la-ma, doc-so-la-ma, viet-so-la-ma, que-tinh, lon-be-nhat, chu-so-khac-nhau, them-0-cuoi, them-1-dau, them-lon-nhat, them-be-nhat (mới, tách từ them-lon-be), so-hai-chu-so, tap-cac-chu-so, tong-chu-so
- Nguồn đã đọc: `sources/math/cach-ghi-so-tu-nhien/` - sbt-p7, sbt-p8, sbt-p9, sbt-p10 (bản sách bài 1.8-1.21, ví dụ 1-2, kiến thức cần nhớ)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (148 id chưa có trong `ids.lock.json`: đúng với bài chưa duyệt)
- Đọc hiểu (Haiku): lượt 1 47/28/0, lượt 2 6/10/8, lượt 3 7/14/0; tệp `.shots/review/cach-ghi-so-tu-nhien/doc-hieu.md`, `doc-hieu-2.md`, `doc-hieu-3.md`
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/cach-ghi-so-tu-nhien/`; `visual:shot` 182/182
- Kết luận: Đạt: 0 Nghiêm trọng (8 lỗi Nghiêm trọng vòng 2 đã sửa dứt; còn 8 Nên sửa, 10 Góp ý)
- Bản đã review: `199d109696e637ca7f300f47b994674ac8885397e134cda61606824717b4045e` (`pnpm content:diff` so với bản này)

Kết quả kiểm 8 lỗi Nghiêm trọng vòng 2 (sửa ở `a287f44`, viết lại chữ ở `d7f49d4`, `7ed0bf7`, `59eff5e`): cả 8 sửa dứt.

| Vòng 2 | Kết quả | Cách kiểm |
|---|---|---|
| 1. Câu `chu-so` giữ cụm 8 chữ của sách | Dứt | Câu mới "Số nào có từ hai chữ số trở lên thì không bắt đầu bằng chữ số 0" không còn cụm "chữ số đầu tiên bên trái phải khác 0"; recap section, recap card, `explain` của `viet-dung-so` khớp nguyên văn; điều kiện "từ hai chữ số trở lên" còn, thêm ca "07 → 7" và "0 vẫn viết 0" |
| 2. Câu giá trị mất hàng nào nhân số nào | Dứt | "Chữ số ở hàng đơn vị nhân 1; sang trái một hàng thì số để nhân thêm một chữ số 0" suy ra đúng hàng chục 10, hàng trăm 100; thử 7 214, 40 618, 728 031, 3 482, 5 056: đúng cả 5. Câu chỉ nói rõ hàng đơn vị, hàng chục và hàng trăm nhờ ví dụ 3 507 và hình `gia-tri-mau` |
| 3. Quy tắc đọc La Mã thiếu "khoanh cụm" | Dứt | Quy tắc, recap section, recap card nói "tìm cụm IV và IX, gạch chân, cộng"; chạy tay cả 30 số 1-30 theo luật này: đúng 30/30 (XIV, XIX, XXIV, XXIX đúng, XVI không có cụm đúng); hình recap đổi sang XXIX |
| 4. Ví dụ mẹo `tach-cum` bị cắt trên điện thoại | Dứt | Mẹo bị xoá; sheet walk điện thoại `103-s8-01-block-end` không còn dòng dài |
| 5. `la-ma-bang-27` (trước là 29) hai đáp án | Dứt | Giá trị theo luật bài: XXVII 27, XVII 17, XXVIII 28, XXIIX 30 (gạch IX: 10 + 10 + 1 + 9); cộng từng chữ cũng cho 27, 17, 28, 32: không cách đọc nào làm nhiễu ra 27; cả ba nhiễu có `wrong` |
| 6. Số của bài trùng số sách | Dứt | Không còn XIV, XVI làm đáp án đọc/viết, không còn XXI (đổi sang 28), `lon-nhat-vd`, `be-nhat-vd` dùng tám chữ số (99 999 999, 10 000 000), không còn 999 999; màn chạm `chon-be-nhat-6` hỏi số bé nhất 100 000 (khác đáp án 1.10 là 999 999) |
| 7. Mật mã khoá cặp bé nhất là 102 | Dứt | Đổi sang "số nhà" (số nhà không bắt đầu bằng 0), chips 100, 102, 120, 210, đáp án 102 duy nhất |
| 8. `chon-tong-4`, `tap-hop-tong-4-tram-2` là bài 1.13 | Dứt | Đổi sang `chon-tong-7` (205, 124 đúng; 215 là 8, 316 là 10) và `tap-hop-tong-6-tram-3` ({303; 312; 321; 330}); máy kiểm lại 28 số tổng 7 và 4 số của tập; không còn tổng 4 ở câu nào |

Việc tự giải và kiểm máy của vòng này (chạy bằng script python vét cạn): 999 990 cặp (số đến 5 chữ số, chữ số thêm 0-9) cho quy tắc "viết thêm chữ số lớn nhất / bé nhất": 0 sai, gồm ca "không có chữ số nào bé hơn / lớn hơn" (viết ở tận cùng bên phải); quy tắc liệt kê theo tổng đúng với mọi tổng 1-27; mọi câu mới và câu đổi số (`them-8-vao-9417` 98 417, `them-9-vao-2138` 21 389, `chon-be-nhat-them-4` 46 531, `chon-tong-7`, `tap-hop-tong-6-tram-3`, `mat-khau-2-7` 4 số, `la-ma-bang-27`, `doi-1-que`: 10 que, IV + I = V và V + I = VI) đều đúng một đáp án; số của bài không trùng số, tập, đáp án sách bài 1.8-1.21 (812 574 + 9, 6; {0; 4; 9}; tổng 4; XIV, XVI, XIX, XXI, 14, 24, 26; IV + V = XI).

Mẹo thử tay (kết quả: đúng cả 5):

| Mẹo | Các đầu vào đã thử | Kết quả |
|---|---|---|
| Giá trị của chữ số (`gia-tri`) | 36 450 (3, 6, 4, 5, 0), 7 214, 5 056 (hai chữ số 5), số một chữ số 7, 100 | 30 000, 6 000, 400, 50, 0; 7 000, 200, 10, 4; 5 000 và 50; 7; 100, 0, 0: đúng |
| Từ số lớn nhất sang số bé nhất (`lon-be-nhat`) | 9 + 1, 99 + 1, 999 + 1, 9 999 + 1, hai chữ số khác nhau (98 + 1) | 10, 100, 1 000, 10 000 đúng; 98 + 1 = 99 không phải số bé nhất có hai chữ số khác nhau (10), bài đã dặn không dùng mẹo khi đề bắt chữ số khác nhau |
| Hàng chục lớn nhất có thể (`so-hai-chu-so`) | hơn 1, 2, 6, 8, 9 | 8, 7, 3, 1 chữ số đúng; hơn 9 ra 0 nghĩa là không có số nào (khớp) |
| Nhân với 10, 100, 1 000 (`them-0-cuoi`) | 35, 64, 7, 10, 100 nhân 100, 10, 1 000 | 3 500, 640, 70, 1 000, 100 000: đúng; đã dặn "số khác 0" |
| Viết số từ tổng giá trị (`tong-gia-tri`) | 3 · 1 000 + 7 · 10 + 2, 5 · 100 + 4, 2 · 10 000 + 3, 9, 6 · 100 | 3 072, 504, 20 003, 9 đúng; 6 · 100 đúng nếu đi tới hàng đơn vị (Góp ý 4) |

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Màn ví dụ "viết thêm chữ số để được số lớn nhất" chỉ có ca đặt ở đầu số; ca "đi tiếp" và ca "không có" bé chưa thấy ví dụ nào trước khi làm câu kiểm tra

- Vị trí: `$.sections[14].blocks[0].children[1]` (note ví dụ), hình `them-lon-vd`, `$.sections[14].blocks[1]` (hình `chon-them-6-4215`) (`section.them-lon-nhat`); `$.sections[15]` (`section.them-be-nhat`). LL-16
- Nguồn: tr.9-10, bài 1.15a, 1.16a, 1.15b, 1.16b
- Vấn đề: Ví dụ "2 713 thêm 5" và màn cùng làm "4 215 thêm 6" của phần lớn nhất đều có chữ số đầu bé hơn chữ số mới, nên bé chỉ thấy cách viết ở đầu số. Câu kiểm tra `them-4-vao-8152` và câu luyện tập `them-5-vao-7308` cần bước "chữ số lớn hơn thì đi tiếp"; bước này chỉ có trong câu quy tắc. Ca "không có chữ số nào" (viết ở tận cùng bên phải) mất ví dụ ở `59eff5e`, hiện chỉ nằm trong quy tắc, hình recap (532 thêm 1, 247 thêm 8) và hai câu kho ôn (`them-1-vao-9863`, `them-9-vao-2138`); hai phần đều không có ca này ở câu kiểm tra và luyện tập, nên bé không gặp nó khi chưa chuẩn bị, nhưng cũng chưa thấy nó chạy từng bước. Phần bé nhất đã có ca đi tiếp (2 713 thêm 5, bước qua chữ số 2) nên chỉ thiếu ca "không có".
- Sửa: Đổi ví dụ phần lớn nhất sang số có chữ số đầu lớn hơn chữ số mới (vd "7 136 thêm 2: 7 lớn hơn 2 nên đi tiếp, 1 bé hơn 2 nên thêm 2 được 72 136"; số này chưa có ở chỗ nào của bài), hình `them-lon-vd` đổi theo; thêm một dòng ca "không có" vào hình `them-lon-vd` và `them-be-vd` (như hai dòng đang có ở hình recap).

### 2. Màn ví dụ "liệt kê theo tổng" không nói đề là "tổng bằng 3" và không cho thấy vì sao hàng trăm dừng ở 3

- Vị trí: `$.sections[18].blocks[0].children[1]` (hình `tong-chu-so-vd`), `$.sections[18].recap` (hình `tong-chu-so-tom-tat`) (`section.tong-chu-so`). LL-16, LL-15
- Nguồn: —
- Vấn đề: Note ví dụ "tổng là 3, hàng trăm là 1, phần còn lại là 3 trừ 1 bằng 2" bị xoá ở `59eff5e` (rút ngắn cho vừa màn phone). Hình giữ lại mở bằng "2 = 0 + 2 = 1 + 1 = 2 + 0" mà số 3 chỉ nằm trong nhãn "phần còn lại 3 − 1 = 2" (nhãn chữ nhỏ), còn tiêu đề hình ("tổng các chữ số bằng 3") không hiện trên màn. Bé đọc hình thấy "2 = ..." trước khi biết đề; bậc "hàng trăm 4 vượt tổng 3 nên bỏ" (điều kiện "không quá tổng" của quy tắc) và bậc phần còn lại 0 ra 300 gộp vào dòng "hàng trăm 2 và 3, làm tương tự". Hình recap ghi sáu số nhưng cũng không hiện đề "tổng bằng 3".
- Sửa: Thêm dòng đề lên đầu hình `tong-chu-so-vd` ("Ba chữ số, tổng bằng 3") và vào hình recap; hoặc đưa lại một note ngắn: "Ví dụ, tổng bằng 3: hàng trăm là 1, 2 hoặc 3 (4 đã quá tổng)." Giữ nhãn các dòng đang có.

### 3. Màn đọc số La Mã: ví dụ XXIX trong note, màn chạm `chon-xxix` và hình recap đều là XXIX, đáp án 29 nằm sẵn ở màn trước

- Vị trí: `$.sections[7].blocks[0].children[1]` (note "Ví dụ, XXIX: gạch chân IX, rồi cộng 10 + 10 + 9 = 29"), `$.sections[7].blocks[1]` (hình `chon-xxix`), hình `doc-xvii` (`section.doc-so-la-ma`); recap hình `doc-la-ma-tom-tat`. LL-07
- Nguồn: tr.10, bài 1.19, 1.20 (sách dùng 14, 19, 24, nên chỉ còn 29 là số có cụm mà bài dùng được)
- Vấn đề: Màn dạy cho đáp án 29 bằng chữ ngay trên màn quy tắc; màn chạm kế tiếp hỏi lại đúng số đó, bé chép được. Hình ví dụ `doc-xvii` (XVII) không có cụm nên ví dụ cụm chỉ là một dòng chữ. Câu kiểm tra, luyện tập (`doc-xii`, `doc-xxiii`) vẫn không có cụm, cụm chỉ được luyện ở màn chạm.
- Sửa: Một trong hai: (a) bỏ câu ví dụ XXIX khỏi note: màn chạm là lần đầu bé gặp XXIX, dòng `done` và hình recap đã có đủ các bước gạch chân IX; (b) giữ ví dụ ở note, đổi màn chạm sang số không cụm (vd XXVIII) và thêm một câu kho ôn đọc số có cụm. Không đổi sang số cụm khác được vì 14, 19, 24 là số của sách.

### 4. Ba thao tác viết lại ở quy tắc nhưng nhãn hình và giải thích còn từ cũ

- Vị trí: (a) hình `doc-xvii` nhãn "tách thành phần" (`catalog.ts`), `$.exercises[37].explain.text`, `$.exercises[38].explain.text`, `$.exercises[39].explain.text` ("Tách XII thành X, I, I rồi cộng giá trị"), so với quy tắc `$.sections[7].blocks[0].children[0].text` ("tìm cụm IV và IX, gạch chân, cộng"); (b) hình ℕ (`catalog.ts`: nhãn "bỏ số 0", `label` "Tập ℕ có số 0, tập ℕ* bỏ số 0"), `$.exercises[0].explain.text`, `$.exercises[3].explain.text`, `$.exercises[3].explain.wrong[0].text`, `$.exercises[4].explain.text` ("ℕ* bỏ số 0"), so với quy tắc `$.sections[0].blocks[1].children[0].text` ("Lấy số 0 ra khỏi ℕ"); (c) `$.exercises[49].explain.text` ("Dời chữ I … Dời chữ I đó") so với "chuyển" ở mọi chỗ khác của phần que tính. LL-05, LL-20
- Nguồn: —
- Vấn đề: Lượt đọc hiểu đổi "bỏ ra" thành "lấy ra", "khoanh" thành "gạch chân", "dời" thành "chuyển" ở quy tắc, đề và recap, nhưng hình và `explain` vẫn giữ từ cũ. Một thao tác hai tên trong cùng phần; ở (a), quy tắc mới không còn nói "tách" nhưng bốn giải thích và hình ví dụ vẫn nói "tách".
- Sửa: Thống nhất theo từ của quy tắc: "gạch chân cụm IV, IX rồi cộng" trong `explain` và nhãn `doc-xvii` ("cộng giá trị" cho bước cuối); "lấy số 0 ra" hay "bỏ số 0" một cách ở mọi chỗ của ℕ*; "chuyển" trong `explain` của `doi-1-que`.

### 5. Câu kiểm tra `gia-tri-v` và câu luyện tập `cham-la-ma-5` hỏi cùng một điều (chữ số V có giá trị 5), hai chiều

- Vị trí: `$.exercises[31]` (`ex.gia-tri-v`, `checkIds`), `$.exercises[32]` (`ex.cham-la-ma-5`, `practiceIds`) (`section.chu-la-ma`). LL-07
- Nguồn: —
- Vấn đề: Bản sửa Nên sửa 9 vòng 2 (câu luyện tập trùng màn chạm IX) đổi luyện tập từ IX sang V, trùng câu kiểm tra: "V bằng mấy" rồi "chạm số có giá trị 5". Bé trả lời lần hai từ câu hỏi lần một. Chiều "chạm số La Mã trên đồng hồ" vẫn còn hợp lý.
- Sửa: Giữ luyện tập V = 5; đổi câu kiểm tra sang hỏi chữ số La Mã X ("Chữ số La Mã X có giá trị bằng bao nhiêu?", đáp án 10, nhiễu 5, 1, 4 có `wrong`), và đổi kho ôn `chu-gia-tri-10` (hiện hỏi "chữ số nào có giá trị 10") sang chữ khác để không lặp.

### 6. Quy tắc "số bé nhất có các chữ số khác nhau" rơi vế "cho đủ số chữ số của đề"; lại có "và cứ thế"

- Vị trí: `$.sections[11].blocks[1].children[0].text`, `$.sections[11].recap.caption`, `$.cards[11].recap.caption` (`section.chu-so-khac-nhau`). LL-25, LL-05
- Nguồn: tr.9, bài 1.11
- Vấn đề: Câu cũ "viết 1, rồi 0, rồi 2, 3, 4 và cứ thế cho đủ số chữ số" rút còn "bắt đầu bằng 1, 0, 2, 3 và cứ thế". Mất vế dừng ở số chữ số đề cho: đề ba chữ số thì số cần tìm là 102, không phải "bắt đầu bằng 1, 0, 2, 3". Bé đọc "bắt đầu bằng" có thể viết 1 023 cho đề ba chữ số, hoặc không biết dừng; Haiku lượt 3 còn xếp "và cứ thế" là mơ hồ. Câu `lon-nhat` đi cùng ("viết các chữ số từ lớn đến bé, bắt đầu từ 9") cũng không nói số chữ số.
- Sửa: "Từ hai chữ số trở lên, số bé nhất có các chữ số khác nhau: viết 1, rồi 0, rồi 2, 3, 4 tăng dần, viết đủ số chữ số của đề." Recap section, recap card lặp nguyên văn; hình `khac-nhau-be` có thể thêm dòng ba chữ số (102).

### 7. Câu ôn `doi-vi-thanh-iv` lặp đúng ca đáp án a của câu luyện tập `doi-1-que`

- Vị trí: `$.exercises[50]` (`ex.doi-vi-thanh-iv`) so với `$.exercises[49]` (`ex.doi-1-que`, đáp án a "IV + I = V", `explain.text` "Dời chữ I của VI ra trước chữ V được IV + I = V"). LL-07, LL-20
- Nguồn: tr.10, bài 1.21
- Vấn đề: Bản sửa Nên sửa 13 vòng 2 đổi luyện tập sang VI + I = V; câu ôn mới (từ gợi ý "hỏi dời I từ sau V sang trước V thì VI thành gì" của vòng 2) hỏi lại đúng bước đó (VI → IV) và giải thích của luyện tập nói sẵn. Câu `doi-vi-thanh-iv` cũng không có `wrong` cho nhiễu XI.
- Sửa: Đổi câu ôn sang ca khác: "Bạn chuyển chữ I của số IV sang sau chữ V. Bạn được số La Mã nào?" (VI; nhiễu IV, VII, XI, có `wrong` cho cả ba), hoặc ca một chữ I giữa hai chữ khác ở số bài chưa dùng.

### 8. Đọc hiểu lượt 3 (sau 3 lượt): 14 mục còn "Hiểu mơ hồ", ghi để tác giả cân nhắc, không chặn duyệt

- Vị trí: Gộp theo section (mỗi section 2 mục: câu quy tắc và recap section; recap card lặp nguyên văn):
  - `$.sections[0].blocks[1].children[0].text`, `$.sections[0].recap.caption` (`section.so-tu-nhien`): "Ký hiệu ℕ lạ" (ℕ, ℕ* là kí hiệu bài mới dạy; Haiku vẫn thấy lạ).
  - `$.sections[4].blocks[0].children[0].text`, `$.sections[4].recap.caption` (`section.gia-tri`): "cứ thế" không rõ.
  - `$.sections[6].blocks[0].children[0].text`, `$.sections[6].recap.caption` (`section.chu-la-ma`): ký hiệu La Mã (chuỗi I, V, X, IV, IX và năm giá trị trong một câu).
  - `$.sections[11].blocks[1].children[0].text`, `$.sections[11].recap.caption` (`section.chu-so-khac-nhau`): "cứ thế" không rõ.
  - `$.sections[14].blocks[0].children[0].text`, `$.sections[14].recap.caption` (`section.them-lon-nhat`): nhiều bước phức tạp.
  - `$.sections[15].blocks[0].children[0].text`, `$.sections[15].recap.caption` (`section.them-be-nhat`): nhiều bước phức tạp.
  - `$.sections[18].blocks[0].children[0].text`, `$.sections[18].recap.caption` (`section.tong-chu-so`): "không quá tổng".
- Nguồn: —
- Vấn đề: Sau lượt 3 theo skill, các mục này không chặn duyệt. Điểm chung: câu quy tắc nhiều điều kiện, đã rút gọn rồi dài ra qua ba lượt; "cứ thế" (3 chỗ), "không quá tổng", ℕ*. Hai nhóm ("cứ thế" ở `chu-so-khac-nhau`, quy tắc liệt kê theo tổng) đã được Nên sửa 6 và Nên sửa 2 ở trên nêu cách sửa cụ thể.
- Sửa: "cứ thế" thay bằng hai ví dụ cụ thể hoặc "và các hàng lớn hơn"; "không quá tổng" thay bằng "không lớn hơn tổng"; quy tắc thêm chữ số tách hai câu ngắn (một câu "so từng chữ số", một câu "không có thì viết ở cuối"); ℕ, ℕ* chấp nhận (kí hiệu của sách).

Bốn note ví dụ viết ở `59eff5e`, bé đọc thử (chưa qua Haiku): "Ví dụ, trong số 3 507, chữ số 5 ở hàng trăm nên có giá trị 5 · 100 = 500." (rõ); hai note "2 713 có chữ số 2 bé hơn 5 nên thêm 5 được 52 713" và "2 713 có chữ số 7 lớn hơn 5 nên thêm 5 được 25 713" (rõ, nhưng không nói thêm vào đâu, bé đọc số mới mà tự thấy; gộp vào Nên sửa 1); câu `chu-la-ma` thành phần/cụm (đọc được). Không có chỗ nào rối thêm.

## Góp ý

### 1. Đặt tên hình `cham-dong-ho-ix` lệch nội dung

- Vị trí: hình `cach-ghi-so-tu-nhien.visual.cham-dong-ho-ix` (`catalog.ts`), dùng ở `$.exercises[32].visualId` (chạm số V, không phải IX). LL-20
- Vấn đề: Id mang tên IX trong khi câu hỏi hiện chạm V; khoá id xong khó đổi.
- Sửa: Đổi id thành `cham-dong-ho` trước khi `content:lock`.

### 2. "Làm vậy bạn…" (14 màn) và "Nhờ vậy bạn…" (5 màn) cho cùng một việc: dòng lý do ở màn chạm

- Vị trí: `$.sections[*].blocks[*].children[0].text` của các màn chạm (14 "Làm vậy bạn", 5 "Nhờ vậy bạn": `them-1-dau`, `them-lon-nhat`, `them-be-nhat`, `so-hai-chu-so`, `tong-chu-so`). LL-05
- Vấn đề: Hai câu nối cho một dòng; lượt đọc hiểu viết lại 5 màn bằng "Nhờ vậy".
- Sửa: Chọn một.

### 3. Màn chạm `chon-phep-dung` lặp hai phép mà note ví dụ ngay trước đã in kèm đáp số

- Vị trí: `$.sections[9].blocks[1]` (note cách 1, cách 2: II + IV = VI, II + V = VII), `$.sections[9].blocks[2]` (hình `chon-phep-dung`, đáp án đúng hai phép đó). LL-07
- Vấn đề: Màn cùng làm đáp án trùng hai ví dụ vừa đọc.
- Sửa: Màn chạm hỏi cách khác trên cùng que (vd III + II = V sai, chuyển một que còn gì).

### 4. Mẹo "Viết số từ tổng giá trị" không nói đi tới hàng đơn vị

- Vị trí: `$.sections[5].blocks[2].text` (`tip.tong-gia-tri`). LL-24
- Vấn đề: "Sau đó đi sang phải từng hàng, hàng nào thiếu số hạng thì viết chữ số 0": với 6 · 100 hay 5 · 100 + 3 · 10, bé dừng ở số hạng cuối sẽ viết 6, 53 thay vì 600, 530. Ví dụ của mẹo kết thúc ở hàng đơn vị nên không thấy ca này.
- Sửa: "… cho tới hàng đơn vị".

### 5. Số 27, XIV, XVI xuất hiện lặp nhẹ ở kho ôn

- Vị trí: `$.exercises[42]` (`la-ma-bang-27`) với hình recap `viet-la-ma-tom-tat` (27 = XXVII, của card viet-so-la-ma) và `$.exercises[41]` (`chon-la-ma-lon-hon-20`, lựa chọn XXVII); `$.exercises[51]` (`ix-cong-v`, kết XIV = số của bài 1.19); `$.exercises[43]` (`chon-viet-13`, nhiễu XVI = số bài 1.19). LL-07, LL-08
- Vấn đề: Khác chiều, khác card, nhưng cùng số; XIV, XVI là số trong bài 1.19 (không phải đáp án câu đọc của bài).
- Sửa: `ix-cong-v` đổi số (vd IX + III = XII); nhiễu XVI của `chon-viet-13` đổi sang XIIX.

### 6. `doi-1-que`: nhiễu "VI + I = VII" đúng về phép tính, chỉ loại được bằng cách đếm que

- Vị trí: `$.exercises[49].options[3]`, `$.exercises[49].explain.wrong[1]`. LL-10
- Vấn đề: Bé phải đếm que (12 que, không phải 10) mới loại; giải thích có nói. Đề "phép cộng đúng có thể có khi chuyển đúng 1 que" nói đủ.
- Sửa: Giữ; hoặc thêm hình que nấc 2 cho thấy số que ban đầu.

### 7. Recap section 1 bỏ câu "Trong đó, số 0 là số tự nhiên bé nhất"

- Vị trí: `$.sections[0].blocks[0].children[0].text` (2 câu) so với `$.sections[0].recap.caption`, `$.cards[0].recap.caption` (câu đầu và câu ℕ*). LL-06
- Vấn đề: Bé ôn card chỉ thấy recap; ý "0 bé nhất" không có, nhưng "lấy số 0 ra khỏi ℕ" đã hàm ý 0 thuộc ℕ; không sai.
- Sửa: Nếu muốn giữ ý, thêm câu "Số 0 là số tự nhiên bé nhất." vào recap (cũng là câu có trong note).

### 8. Thiếu lý do `wrong` cho vài nhiễu mới

- Vị trí: `$.exercises[80]` (`chon-be-nhat-them-4`, nhiễu d "65 431"); `$.exercises[50]` (`doi-vi-thanh-iv`, nhiễu d "XI"); `$.exercises[47]` (`viet-30`, nhiễu XIX, XXV). LL-01
- Vấn đề: Nhiễu hay bị chọn nhầm mà không có lý do.
- Sửa: Thêm một câu cho mỗi nhiễu (vd "65 431 viết 4 giữa 5 và 3, nhưng 6 lớn hơn 4 nên 4 phải đứng trước 6").

### 9. Chữ "Đặt" trong hình và đề tapRegion khác "viết" của quy tắc

- Vị trí: `catalog.ts` hình `chon-them-6-4215.done` ("Đặt 6 trước chữ số 4"); `$.exercises[74].prompt`, `$.exercises[76].prompt` ("chỗ đặt thẻ 4"). LL-05
- Vấn đề: Quy tắc và nhãn hình đã đổi sang "viết ... trước"; ba chỗ còn "đặt". "Thẻ số" của hai đề là vật cầm tay nên đặt hợp lý; chỉ `done` lệch.
- Sửa: `done` đổi sang "Viết 6 trước chữ số 4".

### 10. Mẹo "Hàng chục lớn nhất có thể" chưa nói ca hơn 9

- Vị trí: `$.sections[16].blocks[1].text` (`tip.so-hai-chu-so`). LL-24
- Vấn đề: "hơn 9" cho 9 trừ 9 = 0, hàng chục "từ 1 đến 0": không có số nào (đúng, vì hàng chục khác 0), nhưng mẹo không nói. Hai câu của bài dùng hơn 2 và hơn 7, không gặp ca này.
- Sửa: Thêm "Kết quả 0 thì không có số nào." hoặc bỏ qua.
