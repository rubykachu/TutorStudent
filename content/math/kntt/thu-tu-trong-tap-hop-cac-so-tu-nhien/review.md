# Review: Thứ tự trong tập hợp các số tự nhiên (`thu-tu-trong-tap-hop-cac-so-tu-nhien`)

- Bài: `content/math/kntt/thu-tu-trong-tap-hop-cac-so-tu-nhien/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/` - sbt-p11, sbt-p12, sbt-p13, sbt-p96 (nửa đầu, lời giải Bài 3); thêm `sources/math/cach-ghi-so-tu-nhien/sbt-p7.png` (ℕ, ℕ*)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (120 id chưa có trong `ids.lock.json`, đúng với bài chưa duyệt)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau vòng 2)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/thu-tu-trong-tap-hop-cac-so-tu-nhien/` (walk chỉ chạy câu kiểm tra và câu luyện; câu kho ôn soát qua JSON và `catalog.ts`)
- Kết luận: Chưa đạt: còn 10 lỗi Nghiêm trọng
- Bản đã review: `1c859e98046b6057a1b6ad32f5dcd166bb81e5a2ea750e48721064b4fe192713` (`pnpm content:diff` so với bản này)

Tên viết tắt dưới đây: id đầy đủ có tiền tố `thu-tu-trong-tap-hop-cac-so-tu-nhien.` (vd `ex.cot-km-20-15`). Hình ghi theo khoá trong `src/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/catalog.ts`. Ba reviewer tự giải mọi câu trước khi đọc `answer`: đáp án của bài khớp ở mọi câu, trừ các đề cột cây số ở mục 1 có thêm một đáp án đúng.

Về mức của các mục chép sách (LL-08): câu quy tắc bằng lời gần nguyên văn và bộ số kèm lời của ví dụ, bài tập sách là Nghiêm trọng; câu thuần kí hiệu ngắn không viết khác được (bắc cầu, `a` và `a + 1`) là Góp ý; khuôn hình trùng sách mà số chỉ trùng một phần là Nên sửa.

## Nghiêm trọng

### 1. Đề cột cây số không nói thị trấn ở phía trước cột, nên có hai đáp án đúng

- Vị trí: `$.exercises[15]` (`ex.chon-phep-tinh-km`, cả `$.exercises[15].explain.wrong[0]`), `$.exercises[7].prompt[0]` (`ex.kt-cot-km-40-25`), `$.exercises[12].prompt[0]` (`ex.cot-km-45-30`), `$.exercises[13].prompt[0]` (`ex.cot-km-20-15`). LL-10, LL-01.
- Nguồn: tr.12 bài 1.24, `sbt-p12.png`; lời giải tr.96, `sbt-p96.png`
- Vấn đề: Bốn đề viết "thị trấn (trạm nghỉ) cách cột đó … km" mà không nói thị trấn còn ở phía trước. Thị trấn ở phía sau (bạn đã đi qua) thì số của nó là 30 − 20, 40 − 25, 45 − 30, 20 − 15, nên lựa chọn `30 - 20` của `chon-phep-tinh-km` cũng đúng, và lý do `wrong` của nó dựa vào điều đề không nói. Hình `cot-40`, `cot-45`, `cot-20` không vẽ thị trấn nên cũng không chốt chiều. Màn mẫu `cot-km` và sách đều nói "còn … nữa".
- Sửa: Viết mọi đề theo cách nói của màn mẫu, vd "Bạn đi qua cột cây số ghi km 30. Còn 20 km nữa mới tới thị trấn." (tương tự 40/25, 45/30, 20/15). Lý do `wrong` của lựa chọn `30 - 20`: "Thị trấn còn ở phía trước, xa đầu đường hơn cột, nên phải cộng thêm chứ không trừ."

### 2. Câu quy tắc `tia-so` và `ben-trai` gần nguyên văn ý 1, 2 "Kiến thức cần nhớ"

- Vị trí: `$.sections[2].blocks[1].children[0].text` (`section.ben-trai`, note `rule`), `$.sections[2].recap.caption`, `$.cards[3].recap.caption` (`card.ben-trai`); `$.sections[0].blocks[1].children[0].text` (`section.tia-so`, note `rule`), `$.sections[0].recap.caption`, `$.cards[0].recap.caption` (`card.diem-bieu-dien`). LL-08.
- Nguồn: tr.11 ý 1, ý 2 "Kiến thức cần nhớ", `sbt-p11.png`
- Vấn đề: Câu "bên trái" chỉ bỏ chữ "thì" so với câu sách. Câu "điểm biểu diễn số a" giữ nguyên khung câu sách, chỉ đổi "một khoảng bằng a (đơn vị)" thành "đúng a đơn vị" (phát hiện của Tổng hợp). Theo tiền lệ LL-08 (`quan-he-chia-het-va-tinh-chat` chỉ bỏ "ta nói", `uoc-chung-uoc-chung-lon-nhat` chỉ thêm "viết tắt là"), đây là chép. Hai câu có mặt ở note, recap section và recap card.
- Sửa: Viết lại theo cách làm, vd `ben-trai`: "Trên tia số nằm ngang, đi từ trái sang phải thì các số lớn dần. Vì vậy điểm biểu diễn số nhỏ hơn luôn đứng bên trái điểm biểu diễn số lớn hơn." (giữ đúng tên "điểm biểu diễn số", xem mục 19); `tia-so`: "Muốn tìm điểm biểu diễn số a, đi từ gốc O sang phải a đơn vị. Dừng ở đâu, đó là điểm biểu diễn số a." Recap section và recap card lặp nguyên văn câu mới (luật `[rule-sentence]`); soát mọi `explain`, nhãn hình còn dùng câu cũ.

### 3. Câu `dat-7-11` là bài 1.22 với đúng bộ số và lời của sách

- Vị trí: `$.exercises[20]` (`ex.dat-7-11`, đề và `params` {7, 11}). LL-08.
- Nguồn: tr.12 bài 1.22, `sbt-p12.png`
- Vấn đề: Đề "Vẽ tia số: đặt điểm A biểu diễn số 7 và điểm B biểu diễn số 11" trùng cả bộ số lẫn lời của bài 1.22, trái giả định của bàn giao "số trong bài tự chọn".
- Sửa: Đổi sang cặp số khác trong tia 0..12 của `dat-hai-diem` và không trùng màn học (3, 8; 4, 9), vd A ở 5, B ở 12; đổi id theo số mới, sửa `params`, `explain`.

### 4. Section `phan-tia-so` và `tap-hop-so` dạy bằng bộ số và lời của ví dụ a, b, c kèm lời giải sách

- Vị trí: `$.sections[9].blocks[0].children[0].text` (note "Nhà bạn là gốc O … đoạn OA, đoạn AB và phần còn lại"), hình `chia-ba-phan`, `doan-ab-xong` (recap section, recap `card.phan-tia-so`), `chon-doan-ab-5-10` (`$.sections[9].blocks[2]`); `$.sections[10].blocks[1]` với hình `m-liet-ke` (recap section, recap `card.tap-hop-doan`). LL-08.
- Nguồn: tr.11 ví dụ a, b, c, `sbt-p11.png`; tr.12 lời giải, `sbt-p12.png`
- Vấn đề: Màn học dùng đúng A = 5, B = 10 của ví dụ a; câu "Hai điểm A và B chia tia số thành ba phần: đoạn OA, đoạn AB và phần còn lại" chỉ thêm "ba phần" vào câu ví dụ b; màn cùng làm là ví dụ c; hình `m-liet-ke` là đúng lời giải c (`M = {x ∈ ℕ | 5 ≤ x ≤ 10}`) thêm dòng liệt kê. Trùng cả bộ số lẫn lời.
- Sửa: Đổi bộ số của cả hai section, vd màn học A = 6, B = 12 (nhà – trường 6 km, nhà – chợ 12 km), cùng làm hỏi bộ số đó, tập hợp mẫu `{x ∈ ℕ | 6 ≤ x ≤ 12}` (khác các bộ 3..6, 3..7, 2..6, 6..9, 4..9 của câu luyện, và khác 3, 8 của `ben-trai`). Viết lại câu ba phần theo lời của bài, vd "Hai điểm A và B cắt tia số làm ba khúc: từ O tới A là đoạn OA, từ A tới B là đoạn AB, phần sau B là phần còn lại." Giữ nguyên thuật ngữ "đoạn OA", "đoạn AB", "phần còn lại". Soát lại `explain`, hình gợi ý, lời giải cho khớp số mới (LL-15).

### 5. Mẹo "Đọc dấu < và >" chỉ ghi điều kiện ở tiêu đề, nên ra sai với ≤, ≥ ở section ngay sau

- Vị trí: `$.sections[3].blocks[2]` (`tip.doc-dau`). LL-24.
- Nguồn: tr.11 "Kĩ năng giải toán", `sbt-p11.png`
- Vấn đề: Text "Đầu nhọn của dấu luôn chỉ về số bé hơn … Chỉ cần nhìn đầu nhọn là biết số nào bé." không giới hạn ở < và >. Dấu ≤, ≥ ở section `dau-bang` cũng có đầu nhọn; bạn áp mẹo vào `9 ≤ 9` (`ex.chon-dung-nho-bang`), `12 ≥ 12` (`ex.chon-dung-lon-bang`) sẽ cho là câu sai, trong khi đáp án là đúng. Bảng thử của reviewer nhóm 1: đúng ở 3 < 8, 8 > 3, 0 < 1, 99 < 100, 140 > 135; sai ở 9 ≤ 9 và 12 ≥ 12. Mẹo còn gọi "số bé hơn" trong khi cả bài nói "số nhỏ hơn" (mục 18).
- Sửa: Đưa điều kiện vào text và dùng một từ, vd "Với dấu < và >, đầu nhọn luôn chỉ về số nhỏ hơn, phía miệng mở quay về số lớn hơn. Dấu ≤, ≥ thì khác: hai số bằng nhau vẫn đúng." Giữ `tex` và hình.

### 6. Mẹo "So hai số cùng số chữ số" chỉ ghi điều kiện ở tiêu đề, nên ra sai với hai số khác số chữ số

- Vị trí: `$.sections[5].blocks[2].text` (`tip.so-cung-chu-so`). LL-24.
- Nguồn: Kiến thức nền (tiểu học); bài 1.25 tr.12, `sbt-p12.png`
- Vấn đề: Text mở bằng "Luôn so từ chữ số bên trái nhất…" mà không nói chỉ dùng khi hai số cùng số chữ số. Làm đúng từng chữ ở `kt-so-nhieu-chu-so-hon` (9 874 / 10 203), `chon-lon-nhat-nhieu-chu-so`, `chon-nho-nhat-nhieu-chu-so` (980 / 1 050), `dien-dau-742-1305` thì 9 hơn 1 ở chữ số bên trái nhất nên chọn sai. Đúng ở các cặp 4, 5 chữ số reviewer nhóm 2 đã thử.
- Sửa: Đặt điều kiện vào câu đầu, vd "Khi hai số có cùng số chữ số, so từ chữ số bên trái nhất, không so từ bên phải. Cặp chữ số khác nhau đầu tiên quyết định. Hai số khác số chữ số thì đếm chữ số trước." Giữ ví dụ 3 658 và 3 706.

### 7. Mẹo "Đếm phần tử từ a đến b" ra sai ở các câu khoảng cách của chính bài và nói ngược mẹo "Đếm từ gốc O"

- Vị trí: `$.sections[10].blocks[2]` (`tip.dem-phan-tu`); va chạm với `ex.cot-con-lai-70-55`, `ex.kt-dem-vach-c` (cả lý do `wrong` của phương án "5"), `ex.cach-goc-9`, `tip.dem-tu-goc-o` (`$.sections[0].blocks[3]`). LL-24.
- Nguồn: —
- Vấn đề: Mẹo "Từ a đến b … có b trừ a rồi cộng 1 số … Đừng chỉ lấy b trừ a" không nói chỉ dùng để đếm số phần tử. Ba câu hỏi khoảng cách trên tia số (thuộc kho ôn card `cot-cay-so`, `diem-bieu-dien`) có đáp án b − a: từ km 55 tới km 70 theo mẹo ra 16 thay vì 15; điểm C ở vạch 4 theo mẹo ra 5, đúng nhiễu "đếm cả vạch gốc O"; điểm 9 ra 10. Mẹo "Đếm từ gốc O" ở section đầu lại dặn "đừng đếm vạch gốc", hai mẹo nói ngược nhau mà không nêu vì sao hai việc khác nhau.
- Sửa: Ghi rõ trong `text`: mẹo dùng để đếm có bao nhiêu số; muốn biết hai số cách nhau bao nhiêu đơn vị (số km, số bước trên tia số) thì chỉ lấy b − a. `tex` hai dòng (`gathered`) đối nhau, có chữ ở `text`: "từ 11 đến 16 có 16 − 11 + 1 = 6 số" và "từ 11 đến 16 cách nhau 16 − 11 = 5 đơn vị". Nêu luôn dấu <: b là số lớn nhất thật sự thuộc tập hợp (x < 5 thì b = 4).

### 8. Lời giải thích "Số liền trước của một số bằng số đó trừ 1" sai với số 0 và nói quy tắc theo cách thứ hai

- Vị trí: `$.exercises[56].explain.text` (`ex.lien-truoc-80`), `$.exercises[59].explain.text` (`ex.lien-truoc-1`). LL-17, LL-05.
- Nguồn: tr.11 ý 3 "Kiến thức cần nhớ", `sbt-p11.png`
- Vấn đề: Câu nói cho "một số" sai với 0, đúng số section vừa dạy là không có số liền trước (note `so-0`, câu `khong-co-lien-truoc` ngay trước `lien-truoc-1`). Câu quy tắc của bài lại nói "Số liền trước của a + 1 là a", nên bạn gặp hai cách nói cho một quy tắc.
- Sửa: Viết theo câu quy tắc: `lien-truoc-80`: "80 = 79 + 1, nên số liền trước của 80 là 79."; `lien-truoc-1`: "1 = 0 + 1, nên số liền trước của 1 là 0." Giữ cách trừ 1 thì phải ghi đủ "Số liền trước của một số khác 0 bằng số đó trừ 1".

### 9. Tình huống số nhà liền trước, liền sau trái thực tế, nên đáp án 46 có thể bị bạn cãi

- Vị trí: `$.exercises[54]` (`ex.nha-lien-sau-45`); `$.sections[7].blocks[0]` (hình `nha-so-25`, caption "nhà bạn số 25, nhà số 24 nằm liền trước, nhà số 26 nằm liền sau"). LL-10.
- Nguồn: tr.11 ý 3 "Kiến thức cần nhớ", `sbt-p11.png`
- Vấn đề: Nhà trên một phố thường đánh số lẻ một bên, chẵn một bên, nên nhà sát nhà số 45 là nhà số 47. Bạn biết điều này từ phố nhà mình sẽ trả lời 47 và bị chấm sai; màn mở đầu dạy một điều trái thực tế.
- Sửa: Đổi tình huống sang dãy số đếm liền nhau thật, vd số trang sách ("Bạn đang đọc trang 25; trang liền trước là 24, trang liền sau là 26"), số thứ tự bốc khi xếp hàng, số ghế trong một hàng. Đổi caption, nhãn hình `nha-so-25` và đề `nha-lien-sau-45` (đổi id theo tình huống mới).

### 10. Kí hiệu `{x ∈ ℕ | 3 ≤ x ≤ 6}` và dấu kép `3 ≤ x ≤ 6` dùng trong 7 đề mà chưa dạy cách đọc

- Vị trí: `$.sections[10].blocks[1]` (hình `m-liet-ke`), `$.sections[10].blocks[3].children[0].text`; đề `ex.kt-liet-ke-3-6`, `ex.dem-phan-tu-3-7`, `ex.liet-ke-2-6`, `ex.dem-phan-tu-6-9`, `ex.liet-ke-nho-hon-5-n`, `ex.liet-ke-nho-hon-5-nsao`, `ex.dem-nho-bang-6-n`; recap `$.sections[10].recap`, `card.tap-hop-doan`. LL-09.
- Nguồn: tr.12 lời giải c, `sbt-p12.png`
- Vấn đề: Bài 1 (`tap-hop`) chỉ dạy dấu hiệu đặc trưng viết bằng chữ. Ở đây "x ∈ ℕ" trước vạch đứng và dấu kép "5 ≤ x ≤ 10" chỉ hiện trong hình, không câu nào nói "5 ≤ x ≤ 10 nghĩa là x ≥ 5 và x ≤ 10" (phải đọc "5 ≤ x" ngược thành "x lớn hơn hoặc bằng 5"). Màn cùng làm viết kiểu khác ("x ≥ 3 và x ≤ 6"), câu kiểm tra kế tiếp lại dùng `3 ≤ x ≤ 6`. Hồ sơ người học ghi bạn còn yếu kí hiệu tập hợp, nên cả 7 câu dễ thành đoán.
- Sửa: Thêm vào màn M một note dạy cách đọc: "`6 ≤ x ≤ 12` đọc là x lớn hơn hoặc bằng 6 và nhỏ hơn hoặc bằng 12, tức là x nằm từ 6 tới 12. Phần `x ∈ ℕ` trước vạch đứng nói x là số tự nhiên." (số theo bộ mới ở mục 4). Màn cùng làm viết đúng kí hiệu câu kiểm tra dùng, hoặc viết cả hai dạng cạnh nhau.

## Nên sửa

### 11. Section `chon-don-vi` dạy hai việc mà chỉ chốt một; quy tắc cột cây số không có trên màn nào, phép trừ chưa dạy

- Vị trí: `$.sections[1]` (`section.chon-don-vi`, `recap`), `$.sections[1].blocks[2]` (note cột cây số), `$.cards[2].recap.caption` (`card.cot-cay-so`), `$.exercises[14]` (`ex.cot-con-lai-70-55`). LL-06, LL-16, LL-09.
- Nguồn: tr.12 bài 1.23, 1.24, `sbt-p12.png`
- Vấn đề: Section có hai ý (đọc điểm khi vạch cách nhiều đơn vị; số của thị trấn bằng số của cột cộng số km còn lại) nhưng note quy tắc và recap chỉ có ý đầu. Câu "lấy số của cột cây số cộng với số km còn lại" chỉ ở recap card và `explain`; dạng cột cây số không có màn cùng làm trước câu kiểm tra `kt-cot-km-40-25`. Câu kho ôn `cot-con-lai-70-55` cần phép trừ mà không màn nào dạy, cũng không có hình gợi ý.
- Sửa: Tách cột cây số thành section riêng (mẫu, cùng làm, tự làm) với câu quy tắc đánh `rule` khớp recap card, hoặc ít nhất thêm câu đó làm note quy tắc của màn `cot-km` và vào recap section. Thêm màn hoặc hình gợi ý cho chiều ngược ("Số km còn lại = số của thị trấn trừ số của cột"), hoặc đổi `cot-con-lai-70-55` sang card có dạy phép trừ.

### 12. Note "Cột cây số bên đường cũng là một tia số" nói sai đối tượng

- Vị trí: `$.sections[1].blocks[2].children[0].text` (`section.chon-don-vi`). LL-17.
- Nguồn: tr.12 bài 1.24 và ghi chú, `sbt-p12.png`
- Vấn đề: Một cột cây số là một cái cột; sách cho con đường ứng với tia số có gốc là cột km0. Bạn có thể hiểu sai tia số là gì.
- Sửa: "Con đường có cột cây số giống một tia số: gốc O là đầu đường (cột km 0). Cột ghi km 25 cách đầu đường 25 km."

### 13. Ba hình tia số vạch 5 dựng lại khuôn Hình 1.2 của sách

- Vị trí: hình `vach-5` (`$.sections[1].blocks[0]`), `doc-e-45` (`$.exercises[8]`), `ba-diem-d-g` (`$.exercises[11]`). LL-08.
- Nguồn: tr.12 bài 1.23 (Hình 1.2), `sbt-p12.png`; lời giải tr.96 (E, F, G là 20, 35, 45)
- Vấn đề: Ba hình cùng khuôn Hình 1.2 (tia từ 0, vạch cách 5, chỉ ghi 0 và 10, điểm tên E, F, G); số chỉ trùng một phần (`vach-5` đặt E ở 35 là F của sách; `doc-e-45` đặt E ở 45 và `ba-diem-d-g` đặt G ở 45 là G của sách). Bộ số nằm trong `catalog.ts` nên máy không thấy. Tách khỏi mục 3 và hạ mức vì không trùng cả bộ số lẫn lời.
- Sửa: Đổi cách ghi số (vd ghi 0 và 5, hoặc 0, 20, 40) và đổi giá trị, tên điểm cho khỏi trùng E 20, F 35, G 45 (vd `vach-5` dùng điểm K ở 30; `doc-e-45` thành R ở 40 hay 50; `ba-diem-d-g` bỏ 45). Soát `explain`, hình gợi ý, lời giải đi kèm (LL-15) và không đụng các số của mục 21.

### 14. Mũi tên "5 đơn vị" vẽ thành hình thoi nhỏ chồng hai tầng

- Vị trí: hình `vach-5` (`$.sections[1].blocks[0]`), `vach-5-xong` (`$.sections[1].blocks[1]`, recap section, recap `card.vach-don-vi`), `giai-vach-5-45`, `goi-y-vach-5` (`$.exercises[8].hints`). LL-12, LL-15.
- Nguồn: —
- Vấn đề: Mũi tên hai đầu dài một khoảng vạch chỉ còn hai đầu mũi chạm nhau; `vach-5` có hai mũi như vậy xếp hai tầng với hai nhãn lệch nhau (ảnh walk `029-s2-01-block-end`, `030-s2-02-block`, `046-s2-09-recap`, phone và iPad). Ý chính của section lại khó đọc nhất.
- Sửa: Thay mũi tên bằng lớp `span` tô nhạt 0→5 kèm tag "5 đơn vị" (hoặc ghi số 5 dưới vạch đầu), chỉ một lớp; giữ mũi tên thì sửa mã hình cho mũi ngắn vẫn có thân.

### 15. Hình `cot-km`: số 40 trên trục nằm ngay dưới mũi tên "40 km"

- Vị trí: hình `cot-km` (`labelAt: [0, 10, 40, 50]`), `$.sections[1].blocks[2]`, recap `card.cot-cay-so`. LL-21, LL-15.
- Nguồn: —
- Vấn đề: Mũi tên "40 km" đi từ 25 tới 65, ngay dưới là số 40 và 50 của trục (ảnh `032-s2-03-block-end`). Bạn dễ đọc thị trấn ở số 40 hay lẫn quãng 40 km với điểm 40.
- Sửa: Đổi `labelAt` thành số không nằm dưới mũi tên, vd `[0, 10, 20]`.

### 16. Section `tia-so` không nói "một đơn vị" là gì; câu `kt-dem-vach-c` không nói vạch cách nhau mấy đơn vị

- Vị trí: `$.sections[0].blocks[0]` (caption `thuoc-ke`), `$.exercises[1].prompt[0]` (`ex.kt-dem-vach-c`). LL-10.
- Nguồn: tr.11 ý 1 "Kiến thức cần nhớ", `sbt-p11.png`
- Vấn đề: Câu quy tắc dùng "a đơn vị" nhưng không màn nào nói hai vạch liền nhau cách nhau một đơn vị; mô tả tia số chỉ ở caption xám. `kt-dem-vach-c` ("chỉ có số 0 được ghi") vì thế thiếu dữ kiện, trong khi section sau dạy vạch cách 5.
- Sửa: Thêm note ở màn đầu: "Tia số bắt đầu ở gốc O, ứng với số 0. Các vạch cách đều nhau; ở đây hai vạch liền nhau cách nhau 1 đơn vị." Đề `kt-dem-vach-c` thêm "Hai vạch liền nhau cách nhau 1 đơn vị."

### 17. Lời giải thích nói "mỗi vạch là 5 đơn vị", khác câu quy tắc "hai vạch liền nhau cách nhau …"

- Vị trí: `$.exercises[1].explain.text`, `$.exercises[6].explain.wrong[0]`, `$.exercises[11].explain.text`, hình `dat-diem-5` (`done`); `$.exercises[22].explain.text` (`ex.dien-ben-trai`). LL-05.
- Nguồn: —
- Vấn đề: Vạch là một nét, không phải một khoảng; bạn dễ đếm vạch thay vì đếm khoảng (đúng nhiễu 8 của `kt-doc-vach-5`). `dien-ben-trai` viết "Số nhỏ hơn nằm bên trái điểm biểu diễn số lớn hơn", ghép "số" với "điểm".
- Sửa: Thống nhất "hai vạch liền nhau cách nhau 5 đơn vị". `dien-ben-trai`: "Số 14 nhỏ hơn số 20, nên điểm biểu diễn số 14 nằm bên trái điểm biểu diễn số 20."

### 18. Một khái niệm hai tên: "bé hơn" bên cạnh "nhỏ hơn"; caption dấu ≤ không nói số nào

- Vị trí: `$.sections[4].blocks[0].caption` (hình `bang-3-5`), `$.sections[3].blocks[2].text` (`tip.doc-dau`), `$.exercises[27]` (`ex.dien-dau-6-11`). LL-05, LL-10.
- Nguồn: tr.11 "Kĩ năng giải toán", `sbt-p11.png`
- Vấn đề: Glossary, câu quy tắc, màu khái niệm và mọi recap dùng "nhỏ hơn"; ba chỗ này dùng "bé hơn", "số bé". Caption `bang-3-5` "dấu ≤ đúng khi số bé hơn hoặc hai số bằng nhau" còn không nói số nào phải nhỏ hơn số nào, và bỏ qua hàng `7 ≥ 5` của hình.
- Sửa: Đổi mọi "bé hơn", "số bé" thành "nhỏ hơn", "số nhỏ hơn" (mẹo sửa theo mục 5). Caption: "Bấm Bước tiếp: dấu ≤ đúng khi số bên trái nhỏ hơn hoặc bằng số bên phải; dấu ≥ thì ngược lại."

### 19. "Điểm của số x" là tên thứ hai của "điểm biểu diễn số x"

- Vị trí: `$.sections[9].blocks[1].children[0].text` và recap `$.sections[9].recap`, `card.phan-tia-so`; `explain` của `ex.kt-phan-nao-7`, `ex.phan-nao-12`, `ex.phan-nao-2`, `ex.chon-nhieu-doan-ab`. LL-05.
- Nguồn: tr.11 ý 1 (sách có "gọi tắt là điểm a", bài không dạy cách gọi tắt này)
- Vấn đề: Cả bài và đề của chính section dùng "điểm biểu diễn số …", riêng câu quy tắc và lời giải thích đổi sang "điểm của số x". "x ở giữa hai số của A và B" cũng khó đọc.
- Sửa: "Điểm biểu diễn số x thuộc đoạn AB khi x nằm từ số của A tới số của B, kể cả hai số đó." (gộp với mục 34); `explain` viết "điểm biểu diễn số 7".

### 20. Câu nhắc ℕ, ℕ* nói khác câu của Bài 2

- Vị trí: `$.sections[10].blocks[0].children[0].text`, recap `card.n-nsao`. LL-05.
- Nguồn: `sources/math/cach-ghi-so-tu-nhien/sbt-p7.png`
- Vấn đề: Bài 2 dạy "Tập hợp các số tự nhiên kí hiệu là ℕ", "Bỏ số 0 khỏi ℕ thì được ℕ*"; bài này viết "ℕ là tập hợp mọi số tự nhiên, ℕ* là tập hợp các số tự nhiên khác 0". Một kiến thức hai cách nói giữa hai bài liền nhau.
- Sửa: Dùng lại đúng câu đã qua review của Bài 2 (`cach-ghi-so-tu-nhien`) cho note và recap card `n-nsao`.

### 21. Câu kiểm tra và câu kho ôn của các section đầu lặp số của màn cùng làm, recap

- Vị trí: `$.exercises[16]` (`ex.kt-ben-trai-4-9`); `$.exercises[10]` (`ex.cham-diem-30`); `$.exercises[11]` (`ex.chon-nhieu-xa`, điểm E ở 25). LL-07.
- Nguồn: —
- Vấn đề: `kt-ben-trai-4-9` hỏi đúng 4 và 9 mà màn cùng làm `dat-hai-diem` vừa chốt; `cham-diem-30` hỏi điểm 30 mà màn cùng làm `dat-diem-5` đã đẩy tới 30; `chon-nhieu-xa` có điểm 25 trùng hình recap `vach-5-xong`.
- Sửa: `kt-ben-trai-4-9` đổi số (vd 6 và 2, đổi id); `cham-diem-30` đổi sang 35 hay 20 (đổi id, `explain`); `chon-nhieu-xa` đổi điểm 25 thành 35.

### 22. Câu kho ôn của các section giữa lặp số của màn dạy, mẹo, màn cùng làm

- Vị trí: `$.exercises[50]` (`ex.vi-sao-giam-dan`, card `bieu-do`); `$.exercises[57]` (`ex.chon-lien-truoc-100`, card `lien-truoc`); `$.exercises[43]` (`ex.chon-lon-nhat-27408-27840`, card `cung-chu-so`). LL-07.
- Nguồn: —
- Vấn đề: `vi-sao-giam-dan` hỏi lại đúng note màn 3 (10, 4, 1) trên cùng hình `muon-sach-xong`; `chon-lien-truoc-100` có sẵn đáp án trong `tex` của mẹo `lien-sau-tan-cung-9` ("99 + 1 = 100"); `chon-lon-nhat-27408-27840` dùng lại 27 408 của màn cùng làm `chon-27408-27480`.
- Sửa: `vi-sao-giam-dan` hỏi trên biểu đồ câu lạc bộ cờ hay ba ngày khác; `chon-lien-truoc-100` đổi sang 300 hay 1 000; `chon-lon-nhat-27408-27840` đổi sang bộ số không có 27 408 (đổi id theo số mới).

### 23. Câu kiểm tra và câu luyện của `phan-tia-so` dùng chung một hình cố định

- Vị trí: `ex.kt-phan-nao-7` (checkIds), `ex.phan-nao-12` (practiceIds), cùng `ex.phan-nao-2`, `ex.chon-nhieu-doan-ab`, `ex.chon-nhieu-doan-ab-dau` (hình `phan-4-9`). LL-07.
- Nguồn: —
- Vấn đề: Đúng bẫy ghi trong `pitfalls.md`: câu kiểm tra hỏi số 7 (đoạn AB), câu luyện ngay sau cùng hình hỏi số 12 với ba lựa chọn y hệt, nên bạn chỉ cần chọn khác câu trước. Cả 5 câu của card đều dùng A = 4, B = 9 (cũng là 4, 9 của màn cùng làm `ben-trai`).
- Sửa: Câu luyện và câu kho ôn dùng các bộ A, B khác nhau và khác bộ màn học mới ở mục 4 (vd 2 và 7, 5 và 11), mỗi bộ một hình `line`.

### 24. Câu kiểm tra `kt-thap-nhat-an-binh-chi` lặp khuôn màn cùng làm; đáp án luôn là tên nêu đầu tiên

- Vị trí: `ex.kt-thap-nhat-an-binh-chi`; `$.sections[8].blocks[2]` (hình `chon-thap-nhat`). LL-07, LL-14.
- Nguồn: —
- Vấn đề: "Nam thấp hơn Lan, Lan thấp hơn Hà" rồi "An thấp hơn Bình, Bình thấp hơn Chi. Ai thấp nhất?": cùng khuôn, đáp án đều là tên đứng đầu, nên chọn được nhờ vị trí tên mà không cần bắc cầu.
- Sửa: Đổi thứ tự nêu trong câu kiểm tra, vd "Bình thấp hơn Chi, An thấp hơn Bình. Ai cao nhất?".

### 25. Câu chuyện mở đầu không có kết và chỉ nằm trong caption

- Vị trí: `$.sections[3].blocks[0]` (hình `dau-15-25`, caption), `$.sections[5].blocks[0]` (hình `so-9840-12305`, caption). LL-16.
- Nguồn: —
- Vấn đề: Caption kể "bánh 15 nghìn, trà sữa 25 nghìn" và "kênh A 9 840, kênh B 12 305 người theo dõi", nhưng hình chỉ kết ở "15 nhỏ hơn 25", "9840 nhỏ hơn 12305", không nói món nào rẻ hơn, kênh nào nhiều người theo dõi hơn; tình huống chỉ ở chữ xám nhỏ (ảnh `065-s4-01-block`).
- Sửa: Đưa câu chuyện vào note và chốt kết, vd "Bánh giá 15 nghìn, trà sữa giá 25 nghìn. 15 nhỏ hơn 25, nên bánh rẻ hơn. Ta viết 15 < 25."; "… Vậy kênh B có nhiều người theo dõi hơn", ghi "Kênh A", "Kênh B" cạnh hai số trong hình.

### 26. Mẹo "Đếm từ gốc O" chỉ đúng khi hai vạch cách nhau 1 đơn vị mà không nói điều kiện

- Vị trí: `$.sections[0].blocks[3]` (`tip.dem-tu-goc-o`, hình `dem-buoc` "mỗi bước một đơn vị"). LL-24.
- Nguồn: —
- Vấn đề: `tex` 0 → 1 → 2 → 3 và hình cho số bước là số của điểm. Ở section sau (vạch cách 5), điểm ở bước thứ 9 thành 9 thay vì 45 (`doc-e-45`), 8 thay vì 40 (`kt-doc-vach-5`, đúng nhiễu). Text chỉ dặn đếm bước, chưa nói "số bước là số của điểm", nên để Nên sửa; sửa cùng lúc với mục 7.
- Sửa: Thêm điều kiện: "Khi hai vạch liền nhau cách nhau 1 đơn vị, số bước chính là số của điểm. Vạch cách nhau nhiều đơn vị thì mỗi bước cộng thêm chừng ấy đơn vị."

### 27. Câu luyện đọc biểu đồ bắt đọc số qua vạch lưới mà section chưa có mẫu

- Vị trí: `$.exercises[47]` (`ex.doc-cot-clb`); hình `clb-doc` (`values: "none"`). LL-16.
- Nguồn: tr.13 bài 1.26, `sbt-p13.png`
- Vấn đề: Mọi biểu đồ ở màn dạy và câu kiểm tra `kt-cot-10` đều ghi số trên đầu cột; câu luyện đầu tiên bỏ số, lời giải nói "Đầu cột T4 chạm vạch lưới ghi 15", một thao tác chưa có màn mẫu hay cùng làm.
- Sửa: Thêm vào màn `giam-dan` hay màn cùng làm một bước "nhìn ngang từ đầu cột sang cột số bên trái" (sách gợi ý hình dung cột số là tia số đứng), hoặc thêm `tip` "Cột không ghi số: dóng ngang đầu cột sang cột số bên trái"; không thêm thì cho `clb-doc` hiện số.

### 28. Nấc 1 của nhiều câu tô câu lệnh, không tô hình hay công thức là chỗ bạn hay sai

- Vị trí: `hints.highlight[0]` của `ex.kt-doc-diem-b` (`$.exercises[0]`), `ex.kt-dem-vach-c` (`$.exercises[1]`), `ex.doc-diem-a-9` (`$.exercises[2]`), `ex.doc-cot-clb` (`$.exercises[47]`), `ex.chon-ngay-it-nhat-clb` (`$.exercises[49]`), `ex.kt-liet-ke-3-6`, `ex.dem-phan-tu-3-7`, `ex.liet-ke-2-6`, `ex.dem-phan-tu-6-9`, `ex.liet-ke-nho-hon-5-n`, `ex.liet-ke-nho-hon-5-nsao`, `ex.dem-nho-bang-6-n` (đều `{target: "block", index: 0}`). LL-02.
- Nguồn: —
- Vấn đề: Đề có hai khối, lỗi hay gặp nằm ở khối 1 (đếm vạch trên tia số, đọc cột trên biểu đồ, dấu ≤ hay < và ℕ hay ℕ* trong công thức), nhưng nấc 1 tô câu lệnh ở khối 0 (ảnh `015-s1-05-…-wrong2`). Không thuộc ngoại lệ "đề chỉ có một câu chữ". Gộp từ ba nhóm, giữ mức Nên sửa.
- Sửa: Trỏ `{target: "block", index: 1}`; với câu tập hợp có thể bọc `\htmlId{…}` quanh dấu ≤, < và ℕ, ℕ* rồi dùng `target: "part"`.

### 29. Section `dau-bang` không có mẹo cho dạng đổi lời thành dấu

- Vị trí: `$.sections[4]` (section `dau-bang`; câu `thang-may-12`, `tau-cao-100`).
- Nguồn: tr.11 "Kĩ năng giải toán", `sbt-p11.png`
- Vấn đề: Dạng "tối đa 12 người", "từ 100 cm trở lên" có mẹo rõ, đúng với mọi số, và đúng là chỗ nhiễu `n < 12`, `h > 100` bẫy bạn; hồ sơ người học cần mẹo cho từng dạng.
- Sửa: Thêm `tip` loại "hiểu nhanh" sau màn thang máy: "Gặp chữ 'tối đa' hay 'không quá' thì dùng ≤. Gặp 'từ … trở lên' hay 'ít nhất' thì dùng ≥. Hai cách nói này đều tính cả số đề cho." kèm `tex` `n \le 8` và `h \ge 100`.

### 30. Section `so-nhieu-chu-so` gộp hai quy tắc cần nhớ riêng

- Vị trí: `$.sections[5]` (recap, `blocks[1]`), card `so-chu-so`, `cung-chu-so`. LL-06.
- Nguồn: —
- Vấn đề: Recap cần hai câu mới đủ và bài đã tách thành hai card; màn quy tắc còn thêm note thứ ba ("Gặp cặp chữ số khác nhau đầu tiên thì dừng lại"), nên bạn phải nhớ ba ý trong một section.
- Sửa: Tách thành hai section ("Đếm chữ số", "So từng cặp chữ số") theo hai card; hoặc gộp ba ý thành một câu quy tắc hai bước thật ngắn và đưa ý "dừng lại" vào hình.

### 31. Nhiễu của `bac-cau-x-7-12` loại được mà không cần bắc cầu

- Vị trí: `$.exercises[61].options` (`ex.bac-cau-x-7-12`). LL-14.
- Nguồn: —
- Vấn đề: "x = 7" trái ngay dữ kiện "x < 7", "x > 12" trái hiển nhiên; loại cả hai mà không phải nối hai bất đẳng thức.
- Sửa: Dùng nhiễu ứng với lỗi thật, vd "x > 7" (đảo dấu), "12 < x" (viết ngược hai vế), "x = 12" (quên dấu nhỏ hơn).

### 32. Section `tap-hop-so` không có câu quy tắc; recap chỉ là một ví dụ; thiếu ví dụ đời sống

- Vị trí: `$.sections[10]` (không có note `rule: true`), `$.sections[10].recap.caption`, recap `card.tap-hop-doan`. LL-06, LL-16.
- Nguồn: tr.11 ví dụ c, tr.13 bài 1.27
- Vấn đề: Câu luyện chấm hai ý (dấu ≤ lấy cả số ở đầu, dấu < bỏ số đó; ℕ có 0, ℕ* không có) mà không note nào nói. Recap "M gồm … tức là M = {5; …; 10}" chỉ là một ví dụ (lại là lời giải sách, mục 4), khi ôn bạn không có cách làm để nhớ. Section không có tình huống đời sống.
- Sửa: Thêm note `rule: true`, vd "Liệt kê các số x từ a đến b: dấu ≤ thì lấy cả a và b, dấu < thì bỏ số đó. Viết ℕ thì có số 0, viết ℕ* thì không có số 0", recap lặp đúng câu đó. Thêm ví dụ đời sống (vd thang máy chở từ 3 đến 8 người).

### 33. Mẹo đếm phần tử đặt trước khi dạy cách đếm thường; ví dụ tính không nói đang đếm gì

- Vị trí: `$.sections[10].blocks[2]` (`tip.dem-phan-tu`).
- Nguồn: —
- Vấn đề: Section chưa có màn đếm phần tử bằng cách liệt kê rồi đếm mà mẹo "làm nhanh" đã đứng ngay sau màn M (checklist trục 5: mẹo phải sau cách làm thường). `16 − 11 + 1 = 6` không nói 11, 16 là gì.
- Sửa: Thêm một màn đếm mẫu (liệt kê rồi đếm) trước mẹo, hoặc chuyển mẹo xuống sau màn cùng làm. Ví dụ của mẹo dùng chính tập hợp vừa đếm (sửa cùng mục 7).

### 34. Câu quy tắc `phan-tia-so` chỉ nói đoạn AB, câu hỏi đòi biết cả đoạn OA và phần còn lại

- Vị trí: `$.sections[9].blocks[1].children[0].text`, recap `$.sections[9].recap`, `card.phan-tia-so`; câu `ex.kt-phan-nao-7`, `ex.phan-nao-12`, `ex.phan-nao-2`. LL-06.
- Nguồn: tr.12 lời giải b, `sbt-p12.png`
- Vấn đề: Cách xếp số vào đoạn OA hay phần còn lại chỉ có trong lý do `wrong` của câu kiểm tra; khi ôn qua recap bạn không có cách làm.
- Sửa: Câu quy tắc và recap nói đủ ba phần, dùng tên ở mục 19, vd "Số từ 0 tới số của A: điểm biểu diễn thuộc đoạn OA. Từ số của A tới số của B: đoạn AB. Lớn hơn số của B: phần còn lại."

### 35. Lựa chọn "Cả hai tập hợp trên" sai khi app xáo lựa chọn

- Vị trí: `$.exercises[74].options[2]` (`ex.chon-nsao-0`). LL-10.
- Nguồn: —
- Vấn đề: App xáo thứ tự; ảnh `ipad/169-s11-07-exercise-chon-nsao-0.png` cho thấy lựa chọn này đứng đầu, chữ "trên" không trỏ vào đâu.
- Sửa: "Cả ℕ và ℕ*" (sửa cả `wrong` của phương án này).

### 36. Màu khái niệm tô lên phần không phải khái niệm đó

- Vị trí: hình `chia-ba-phan` (đoạn OA blue "Số nhỏ hơn", đoạn AB teal "Tập hợp", phần còn lại slate "So sánh số có nhiều chữ số"); hình `bac-cau-keo` (nhãn hàng tô cả dòng blue, violet). LL-03.
- Nguồn: —
- Vấn đề: Lệch luật một khái niệm một màu (checklist trục 4 xếp Nên sửa; nhóm 3 ghi Góp ý, Tổng hợp nâng mức theo checklist). Ở `bac-cau-keo`, hàng "Lan có ít kẹo hơn Hà" mang màu "Số lớn hơn".
- Sửa: Dùng màu trung tính (không thuộc `concepts`) cho ba phần của tia số và cho nhãn hàng của `bac-cau-keo`, hoặc chỉ tô đúng số nhỏ hơn và số lớn hơn.

## Góp ý

### 37. Nhiễu "142 = 138" không ai chọn

- Vị trí: `$.exercises[30].options[2]` (`ex.chon-chieu-cao-142-138`). LL-14.
- Nguồn: —
- Vấn đề: Hai số khác nhau rõ, không ứng với lỗi hay gặp.
- Sửa: Thay bằng "138 > 142" (lỗi đảo số).

### 38. Mũi tên hai đầu gắn nhãn "sang phải"

- Vị trí: hình `trai-3-8`, `trai-3-8-xong` (màn quy tắc, recap section, recap `card.ben-trai`). LL-15.
- Nguồn: —
- Vấn đề: Mũi tên hai đầu (ảnh `049-s3-01-block-end`) trong khi nhãn nói một chiều.
- Sửa: Dùng mũi tên một chiều, hoặc nhãn "số lớn dần khi sang phải".

### 39. Hình gợi ý `goi-y-dau-4-9` chỉ là "4 ? 9", không tách bài

- Vị trí: `$.exercises[27].hints.hintVisualId` (`ex.dien-dau-6-11`).
- Nguồn: —
- Vấn đề: Nấc 2 chỉ đưa một cặp số khác với dấu "?" (ảnh `077-s4-07-…-wrong2`), không thêm cách nghĩ.
- Sửa: Vẽ 4 và 9 trên tia số (4 bên trái nên nhỏ hơn) rồi dừng ở dấu "?".

### 40. "Thị trấn biểu diễn số mấy" nên nói là điểm của thị trấn

- Vị trí: `$.exercises[7].prompt[1]`, `$.exercises[12].prompt[1]`, `$.exercises[13].prompt[1]`, `$.exercises[14].prompt[0]`.
- Nguồn: —
- Vấn đề: Theo quy tắc, điểm biểu diễn số, thị trấn không biểu diễn số.
- Sửa: "Điểm ứng với thị trấn biểu diễn số mấy?".

### 41. Recap card `viet-dau` trùng recap `doc-dau`

- Vị trí: `$.cards[5].recap` (`card.viet-dau`).
- Nguồn: —
- Vấn đề: Card luyện chọn dấu điền chỗ trống nhưng recap chỉ lặp câu đọc dấu; phiên ôn hai card hiện cùng một màn.
- Sửa: Giữ câu quy tắc nhưng dùng hình khác (vd `giai-dau-6-11`).

### 42. Chữ chung của app ở màn chips: "Các số tô xanh là đáp án" khi thẻ không phải số

- Vị trí: `src/visuals/shared/pick-chips.tsx:145`; hình `chon-dau-140-135` (ảnh `070-s4-04-block-shown`), `chon-thap-nhat` (ảnh `phone/142-s9-03-block-shown.png`).
- Nguồn: —
- Vấn đề: Thẻ là cách viết so sánh hay tên bạn. Lỗi của app, không chặn bài; báo người làm app.
- Sửa: App dùng chữ trung tính, vd "Các thẻ tô xanh là đáp án."

### 43. Vùng chạm của biểu đồ cột che số trên đầu cột và đè lên cột số

- Vị trí: hình `muon-sach-tap` (`ex.kt-cot-10`); ảnh `phone/120-s7-05-exercise-kt-cot-10-correct.png`, `phone/117-s7-05-exercise-kt-cot-10-wrong1.png`. LL-12.
- Nguồn: —
- Vấn đề: Khung tối khi chạm đúng che số "10" và chữ "T6"; vạch sọc khi chạm sai đè lên các số của cột số bên trái.
- Sửa: Báo người làm app cho lớp tô của `Region` để lộ nhãn; hoặc trong `bars.tsx` đặt số ngoài `Region`, thu hẹp vùng chạm.

### 44. Câu kiểm tra và màn cùng làm của `bieu-do-cot` hỏi đúng điều màn trước vừa ghi

- Vị trí: `$.exercises[46]` (`ex.kt-cot-10`), `$.sections[6].blocks[3]` (`chon-ngay-it-nhat`). LL-07.
- Nguồn: —
- Vấn đề: Note màn 3 vừa nói thứ Sáu có 10 quyển; hình màn 2 đã gắn nhãn "Ít nhất" cho Chủ nhật. Trả lời được bằng trí nhớ.
- Sửa: Câu kiểm tra hỏi số chưa nói ra (vd 12 quyển, T3); màn cùng làm hỏi ngày khác.

### 45. Dấu hình của màu số liền trước đứng cạnh biểu thức "a + 1"

- Vị trí: hình `lien-tiep-rows` (màn quy tắc, recap `lien-tiep`, recap card `lien-sau`, `lien-truoc`). LL-21.
- Nguồn: —
- Vấn đề: Hàng đầu đọc thành "a ✚ Số liền trước của a + 1"; dấu của màu sky trông như dấu cộng.
- Sửa: Đặt dấu khái niệm ở góc, hoặc bỏ dấu trong nhãn.

### 46. Màu xanh, tím của chữ số trong mẹo trùng màu "chữ số", "hàng" của glossary

- Vị trí: `$.sections[5].blocks[2].tex` (`tip.so-cung-chu-so`); `content/glossary/math.json`.
- Nguồn: —
- Vấn đề: Trong bài nhất quán (xanh là nhỏ hơn, tím là lớn hơn), nhưng ở Bài 2 xanh là "chữ số", tím là "hàng".
- Sửa: Ghi backlog thống nhất màu trong glossary; hoặc tô hai chữ số bằng màu `slate`.

### 47. Thiếu ví dụ dấu ≥ với hai số bằng nhau

- Vị trí: hình `bang-3-5`, `bang-xong` (`$.sections[4]`).
- Nguồn: —
- Vấn đề: Quy tắc nói "Hai số bằng nhau thì cả hai dấu đều đúng" mà hình chỉ có 5 ≤ 5; `chon-dung-lon-bang` hỏi 12 ≥ 12.
- Sửa: Thêm hàng `5 ≥ 5` vào hai hình.

### 48. Lời giải `xep-4-so-40982` bỏ bước so hàng chục nghìn; `chon-lien-truoc-100` nói "mượn 1 ở hàng trăm"

- Vị trí: `$.exercises[44].explain.text`, `$.exercises[57].explain.text`.
- Nguồn: —
- Vấn đề: Lời giải đầu không nói bốn số cùng 4 ở hàng chục nghìn, trái cách "so từ trái sang phải"; 100 − 1 phải mượn qua cả hàng chục.
- Sửa: "Bốn số cùng có 5 chữ số và cùng 4 ở hàng chục nghìn. So hàng nghìn: 40 982 có 0, nhỏ nhất…"; "100 = 99 + 1, nên số liền trước của 100 là 99."

### 49. Từ "thoả" trong đề

- Vị trí: `$.sections[4].blocks[3].children[0].text`, `$.exercises[34]`, `$.exercises[36]` và các đề khác dùng "thoả" (8 chỗ trong `exercises`). LL-19.
- Nguồn: —
- Vấn đề: Từ Hán Việt chưa giải thích.
- Sửa: "Chạm vào mọi số x làm cho x ≤ 4 đúng", hoặc giải thích một lần ở màn cùng làm.

### 50. `liet-ke-nho-hon-5-nsao` thiếu `wrong` cho phương án {0; 1; 2; 3; 4; 5}

- Vị trí: `$.exercises[76].explain.wrong` (`ex.liet-ke-nho-hon-5-nsao`).
- Nguồn: —
- Vấn đề: Phương án thừa cả số 0 lẫn số 5, dễ được chọn khi quên cả hai luật.
- Sửa: Thêm `{optionId: "c", text: "Thừa số 0 và số 5: ℕ* không có số 0, dấu < không cho x bằng 5."}`.

### 51. Ở `kt-liet-ke-3-6`, đáp án là lựa chọn dài nhất

- Vị trí: `$.exercises[70].options` (`ex.kt-liet-ke-3-6`). LL-14.
- Nguồn: —
- Vấn đề: Ba nhiễu đều thiếu số, nên "chọn tập nhiều số nhất" luôn trúng.
- Sửa: Thay một nhiễu bằng tập thừa số, vd {3; 4; 5; 6; 7}.

### 52. Lý do `wrong` "Dấu ≥ ngược với kết luận của bắc cầu" chưa nói vì sao loại; phần dấu ≤ chưa có ví dụ số

- Vị trí: `$.exercises[63].explain.wrong[0]` (`ex.bac-cau-nho-bang`); `$.sections[8]`.
- Nguồn: —
- Vấn đề: a ≥ b vẫn đúng khi a = b, nên "ngược" chưa giải thích; màn dạy chỉ có ví dụ kẹo với dấu <.
- Sửa: Viết lý do theo trường hợp cụ thể của đề (a ≥ b chỉ đúng khi a bằng b, nên chưa chắc đúng); thêm một dòng ví dụ số với dấu ≤ vào hình `bac-cau-xong`.

### 53. Nhãn nửa dưới hình `bac-cau-xong` chỉ lặp công thức

- Vị trí: hình `bac-cau-xong`, các dòng có dấu ≤.
- Nguồn: —
- Vấn đề: Nửa trên có nhãn giải thích ("a bên trái b"), nửa dưới nhãn trùng công thức.
- Sửa: "a bên trái b hoặc trùng b", "b bên trái c hoặc trùng c", "Nên a bên trái c hoặc trùng c".

### 54. Dải "phần còn lại" dừng ở 20

- Vị trí: hình `chia-ba-phan` (`span` từ 10 tới 20).
- Nguồn: —
- Vấn đề: Bạn có thể nghĩ phần còn lại chỉ tới 20.
- Sửa: Kéo dải tới mũi tên, hoặc thêm "phần còn lại kéo dài mãi về bên phải" (sửa cùng bộ số mới ở mục 4).

### 55. `sourceRef` của `tap-hop-so` thiếu trang lời giải

- Vị trí: `$.sections[10].sourceRef`, `card.tap-hop-doan`, `card.n-nsao`.
- Nguồn: tr.12 (lời giải c), tr.96 (đáp án 1.27)
- Vấn đề: Kí hiệu dấu hiệu đặc trưng lấy từ lời giải tr.12 nhưng `sourceRef` chỉ ghi tr.7, 11, 13.
- Sửa: Thêm "tr.12 (lời giải c), tr.96 (bài 1.27)".

### 56. Câu thuần kí hiệu bắc cầu và câu "a và a + 1" trùng sách

- Vị trí: `$.sections[8].blocks[1].children[0].text` (note `rule`), `$.sections[8].recap.caption`, recap `card.bac-cau`; `$.sections[7].blocks[1].children[1].text` ("Hai số a và a + 1 gọi là hai số tự nhiên liên tiếp."). LL-08.
- Nguồn: tr.11 ý 3, ý 4 "Kiến thức cần nhớ", `sbt-p11.png`
- Vấn đề: "Nếu a < b và b < c thì a < c. Nếu a ≤ b và b ≤ c thì a ≤ c." trùng từng chữ hai dòng sách; câu liên tiếp chỉ thêm "Hai số". Đây là câu kí hiệu ngắn, gần như không viết khác được, nên Tổng hợp hạ từ Nghiêm trọng (nhóm 3) xuống Góp ý.
- Sửa: Tuỳ tác giả: giữ kí hiệu trong khối `formula`, thêm một câu lời của bài ("a nhỏ hơn b, b lại nhỏ hơn c, nên a nhỏ hơn c. Với dấu ≤ cũng vậy."); nếu đổi câu `rule` thì recap đổi theo.

### 57. Số 25 mang hai vai ở hai màn liền nhau của `lien-tiep`

- Vị trí: hình `nha-so-25` (`$.sections[7].blocks[0]`) và hàng ví dụ "a = 24" của hình `lien-tiep-rows` (`$.sections[7].blocks[1]`). LL-15.
- Nguồn: —
- Vấn đề: Màn mở đầu lấy 25 làm số đang xét (24 liền trước, 26 liền sau); màn quy tắc ngay sau tô 25 màu "Số liền sau" (ví dụ a = 24). Bạn vừa thấy 26 là liền sau đã gặp 25 cùng màu đó (phát hiện của Tổng hợp).
- Sửa: Cho ví dụ của `lien-tiep-rows` dùng đúng số của màn mở đầu (a = 25: 25 và 26, hoặc 24 và 25 với nhãn "24 liền trước 25"), khớp với tình huống mới ở mục 9.
