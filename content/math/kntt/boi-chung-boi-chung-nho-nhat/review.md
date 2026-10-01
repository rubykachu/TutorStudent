# Review: Bội chung. Bội chung nhỏ nhất (`boi-chung-boi-chung-nho-nhat`)

- Bài: `content/math/kntt/boi-chung-boi-chung-nho-nhat/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/boi-chung-boi-chung-nho-nhat/` - sbt-p41, sbt-p42, sbt-p43, sbt-p108, sbt-p109 (nhóm 3 mở thêm `sources/math/uoc-chung-uoc-chung-lon-nhat/` sbt-p38, sbt-p39, sbt-p40 cho section 13)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (ids chưa khoá)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/boi-chung-boi-chung-nho-nhat/`
- Kết luận: Chưa đạt: còn 8 lỗi Nghiêm trọng (8 Nghiêm trọng, 28 Nên sửa, 18 Góp ý); đã ghi "Bản đã review" `1aeebfea6cd1606e818148b9450ed7537cce15f5bf2c8bea5131e9fcb383ad23` bằng `--mark`, bài giữ `draft`
- Bản đã review: `1aeebfea6cd1606e818148b9450ed7537cce15f5bf2c8bea5131e9fcb383ad23` (`pnpm content:diff` so với bản này)

Ba reviewer tự giải cả 67 bài tập trước khi đọc `answer`: mọi đáp án trong JSON khớp lời giải tr.108, 109. Tổng hợp đã đối chiếu mọi `note` quy tắc, `recap`, `caption`, `overview`, thuật ngữ với glossary `content/glossary/math.json` và Bài 11 `uoc-chung-uoc-chung-lon-nhat`. Từ cấm "nhân tử" (glossary, mục "thừa số"): không có trong `lesson.json` lẫn `src/visuals/math/boi-chung-boi-chung-nho-nhat/`; câu quy tắc quy đồng đã dùng "nhân cả tử số lẫn mẫu số", mọi câu Sửa dưới đây giữ cách nói đó.

## Nghiêm trọng

### 1. Câu `order` có hai thứ tự đúng: viết bội của 4 trước hay của 6 trước đều được

- Vị trí: `$.exercises[14].items[0]`, `$.exercises[14].items[1]` (`ex.xep-liet-ke-4-6`); LL-01
- Nguồn: tr.42 bài 2.44, `sbt-p42.png`
- Vấn đề: hai bước "Viết các bội của 4…" và "Viết các bội của 6…" không phụ thuộc nhau. Bé xếp bội của 6 lên trước vẫn làm đúng mà bị chấm sai, rồi hiểu nhầm là phải viết bội của số nhỏ trước.
- Sửa: gộp `s1` và `s2` thành một mục: "Viết các bội của từng số: 4, 8, 12, 16 và 6, 12, 18". Thêm mục mới đứng thứ hai: "Tìm các số có ở cả hai danh sách: 12". Giữ "Chọn số nhỏ nhất…: 12" và "Kết luận: BCNN(4, 6) = 12". Tự xếp lại để chắc chỉ còn một thứ tự đúng; sửa `explain.text` theo bốn bước mới.

### 2. Recap và màn kí hiệu viết BC(6, 8) như thể chỉ có 3 bội chung, khác cách viết ƯC của Bài 11

- Vị trí: hình `visual.ky-hieu-6-8` (`catalog.ts`, dòng `\mathrm{BC}(6, 8): …`), dùng ở `$.sections[1].blocks[1].children[2]`, `$.sections[1].recap` (`section.boi-chung-nho-nhat`) và `$.cards[1].recap` (`card.bcnn`); note `$.sections[1].blocks[1].children[1]`; hình `bc-6-8` (`$.sections[1].blocks[0]`) có tiêu đề hàng "BC(6, 8)"; LL-17
- Nguồn: tr.108 lời giải 2.44 và 2.47 (BC viết có "…" ở cuối)
- Vấn đề: "BC(6, 8): 24, 48, 72" không có dấu cho biết danh sách còn tiếp, nên đọc thành "bội chung của 6 và 8 là 24, 48 và 72". Đây là hình recap bé xem lại để nhớ, và ở Bài 11 cùng kiểu dòng này (`ƯC(12, 18) = {1; 2; 3; 6}`) là danh sách đủ, nên bé sẽ hiểu bội chung cũng có hữu hạn. Thêm nữa: dấu ":" trùng với dấu chia mà bài dùng khắp nơi (LL-21), và "BC(6, 8)" xuất hiện ở hình đầu section 2 nhưng không câu nào đọc nó (note chỉ đọc "BCNN(6, 8) = 24"). Bé yếu kí hiệu (`docs/learner.md`).
- Sửa:
  - Dòng TeX của `ky-hieu-6-8`: `\mathrm{BC}(6, 8) = \{\concept{lime}{0};\ \concept{lime}{24};\ \concept{lime}{48};\ \concept{lime}{72};\ \ldots\}`. Dấu `\ldots` là dấu "còn tiếp" của toán, không phải cắt chữ.
  - Thay note `$.sections[1].blocks[1].children[1]` bằng câu đọc cả hai dòng, theo khuôn Bài 11: "BC(6, 8) = {0; 24; 48; 72; …} đọc là các bội chung của 6 và 8 là 0, 24, 48, 72 và cứ thế tiếp. BCNN(6, 8) = 24 đọc là bội chung nhỏ nhất của 6 và 8 bằng 24."
  - Đổi tiêu đề hàng "BC(6, 8)" của hình `bc-6-8` thành chữ "Bội chung của 6 và 8" (kí hiệu chỉ hiện sau câu đọc). Tiêu đề "B(6)", "B(8)" của các hình `bcLists` ở section 2–4 đổi thành "Bội của 6", "Bội của 8" (sửa ở `ROWS` trong `catalog.ts`, dòng `title: \`B(${n})\``).

### 3. Mẹo "Kiểm lại kết quả BCNN" dạy bé rằng chia hết cho mọi số là BCNN đúng

- Vị trí: `$.sections[6].blocks[3]` (`tip.kiem-chia-het`); `$.exercises[36].explain.wrong[2]` (`ex.tim-loi-bcnn-4-6-9`, lý do của lựa chọn d); LL-24
- Nguồn: —
- Vấn đề: từng câu của mẹo đúng (chỉ là điều kiện cần), nhưng tên "Kiểm lại kết quả" và ví dụ duy nhất là một lần kiểm qua (72 chia hết cho 6, 8, 9), nên bé nhớ thành "chia hết cho cả ba số là đúng". Phép kiểm này cho qua chính các lỗi hay gặp nhất của bài: nhân hết các số (432 với 6, 8, 9; 24 với 2, 3, 4, là nhiễu của câu kiểm tra `bcnn-2-3-4` ngay sau mẹo), lấy bội chung chưa nhỏ nhất (72 với 4, 6, 9). Lý do d "…chưa đủ: còn phải chia hết cho 6 và 9" càng nói rằng chia hết cho cả ba là "đủ". Ý "không nhỏ hơn số lớn nhất" thừa (chia hết cho số lớn nhất thì đã không nhỏ hơn nó).
- Sửa:
  - `text`: "Kết quả không chia hết cho một trong các số đã cho thì chắc chắn sai. Chia hết cho mọi số vẫn chưa chắc là BCNN: 144 cũng chia hết cho 6, 8 và 9, nhưng BCNN là 72."
  - `title`: "Bắt lỗi kết quả BCNN".
  - `tex`: một lần kiểm trượt, `\begin{gathered} 24 \chiahet 4 \\ 24 \chiahet 6 \\ 24 \khongchiahet 9 \end{gathered}`. Số này trùng câu `tim-loi-bcnn-4-6-9` cùng section, nên đổi câu đó (cả id) sang "Nam tính BCNN(3, 4, 8) = 12" với các lựa chọn "12 không chia hết cho 8" (đáp án), "12 là số chẵn", "12 lớn hơn 8", "12 chia hết cho 4"; sửa `explain` và `wrong` theo số mới.
  - `wrong` d (theo số mới): "12 chia hết cho 4 là điều BCNN nào cũng có, nên nó không cho thấy 12 sai."

### 4. Mẹo "Chọn ƯCLN hay BCNN" chọn sai công cụ ở bài số vòng bánh răng và bài hỏi giờ của chính bài

- Vị trí: `$.sections[12].blocks[2]` (`tip.chon-cong-cu`); LL-24
- Nguồn: tr.43 bài 2.55, lời giải tr.109; tr.42 bài 2.49
- Vấn đề: mẹo bảo "số cần tìm nhỏ hơn hoặc bằng các số đã cho thì tìm ƯCLN". `rang-9-6-vong` hỏi số vòng, đáp số 3 nhỏ hơn 9 và 6, mẹo bảo tìm ƯCLN (tình cờ ƯCLN(9, 6) = 3, nên bé được khen vì cách làm sai). Hình `rang-12-8-vong`: bánh B quay 3 vòng, còn ƯCLN = 4. Sách 2.55: 3 và 4 vòng, ƯCLN = 5. `bao-thuc-20-30` hỏi lúc mấy giờ, đáp số 8 nhỏ hơn 20 và 30, mẹo bảo ƯCLN(20, 30) = 10. Mẹo còn bắt bé đoán độ lớn của đáp số trước khi biết cách tính. Thêm: `tex` "6 ≤ 12, 18" đọc được thành số thập phân 12,18 (LL-21).
- Sửa: thay `text` bằng mẹo theo chiều chia hết, cùng ý với câu quy tắc Bài 11 section `bai-toan-uc`: "Các số đã cho đều chia hết cho số cần tìm (chia đều, cắt vừa hết) thì tìm ƯCLN. Số cần tìm chia hết cho các số đã cho (số phút, số răng tới lúc gặp lại) thì tìm BCNN. Đề hỏi số vòng hay lúc mấy giờ thì tìm BCNN trước rồi tính tiếp." `tex`: `\begin{gathered} 12 \chiahet \concept{amber}{6} \\ 18 \chiahet \concept{amber}{6} \\ \concept{pink}{36} \chiahet 12 \\ \concept{pink}{36} \chiahet 18 \end{gathered}`. `kind` giữ "hiểu nhanh". Thử lại mẹo mới trên `rang-9-6-vong`, `rang-12-8-vong`, `bao-thuc-20-30`, `chon-dang-24-36`, `chia-30-45`.

### 5. Mẹo "Bài toán xếp hàng còn dư" và câu quy tắc section 11 cho đáp số sai khi đáp số sát đầu khoảng

- Vị trí: `$.sections[10].blocks[3]` (`tip.hang-con-du`); câu quy tắc `$.sections[10].blocks[1].children[0]`; hình `hang-3-4` (`$.sections[10].blocks[2].children[1]`); LL-24
- Nguồn: tr.43 bài 2.50, lời giải tr.109 (sách tìm `n − 1` trước rồi mới chọn `n` trong khoảng)
- Vấn đề: mẹo chỉ nói "bớt số dư, tìm bội chung, cộng số dư lại", còn câu quy tắc bảo "chọn số nằm trong khoảng đề cho". Làm đúng từng chữ vẫn sai ở biên: hàng 3 và hàng 4 đều dư 1, lớp từ 37 đến 48 bạn: bội của 12 trong khoảng là 48, cộng 1 được 49, ra ngoài khoảng (đúng là 37). Hàng 5 và 6 dư 2, từ 31 đến 61: bé ra 62 (đúng là 32). Hình `hang-3-4` có dời khoảng ("Cần số từ 39 đến 54") mà không nói vì sao. Mẹo còn viết "bội chung của các số hàng" (đọc thành số hàng, đúng cách hiểu mà đề `hang-5-6-du-2` cố tránh), `tex` dùng chữ `n` chưa giới thiệu và `\Rightarrow` chưa dạy, và gãy dòng trên điện thoại (ảnh `136`).
- Sửa:
  - `text`: "Hàng nào cũng dư cùng một số bạn thì bớt số dư đó đi trước. Tìm bội chung của số bạn mỗi hàng, cộng số dư vào từng bội chung, rồi mới chọn số nằm trong khoảng."
  - `tex`: `\begin{gathered} \concept{lime}{36} + 1 = 37 \\ \concept{lime}{48} + 1 = 49 \end{gathered}` (không `n`, không `\Rightarrow`).
  - Thẻ hàng "Cần số từ 39 đến 54" của `hang-3-4` đổi thành "Cộng 1 vào từng bội chung", và hàng TeX tương ứng liệt kê `37,\ 49` rồi chọn 49 trong khoảng 40–55. Làm tương tự cho `hang-goi-y-4-5`, `hang-giai-5-6` (nấc 2 vẫn dừng ở "?" trước kết quả).
  - Câu quy tắc section 11 thêm vế: "…rồi chọn số nằm trong khoảng đề cho. Đề có số dư thì cộng số dư vào trước khi chọn." Recap section 11 và card `so-trong-khoang` lặp lại nguyên văn (xem Nên sửa 27).

### 6. `chon-dang-24-36`: nhiễu "36 − 24" có giá trị đúng bằng số đĩa cần tìm

- Vị trí: `$.exercises[62].options[3]` (`ex.chon-dang-24-36`); LL-01
- Nguồn: —
- Vấn đề: 36 − 24 = 12 = ƯCLN(24, 36). Bé tính thử từng lựa chọn thấy "ƯCLN(24, 36)" và "36 − 24" cùng ra 12 đĩa, chọn d bị chấm sai, và có thể rút ra quy luật sai "ƯCLN là hiệu hai số". `wrong` không có lý do cho d.
- Sửa: đổi cặp số thành 24 và 40 (ƯCLN 8, hiệu 16, tổng 64, BCNN 120): đề "Cô chia 24 cái kẹo và 40 cái bánh…", lựa chọn "ƯCLN(24, 40)", "BCNN(24, 40)", "24 + 40", "40 − 24". Sửa `explain.tex` thành `\begin{gathered} 24 \chiahet \concept{amber}{8} \\ 40 \chiahet \concept{amber}{8} \end{gathered}` và thêm `wrong` cho d: "40 − 24 = 16, mà 24 không chia hết cho 16, nên không chia đều được."

### 7. Giải thích nói "Số đĩa phải chia hết cả 24 và 36": bé đọc ra chiều chia hết của BCNN

- Vị trí: `$.exercises[62].explain.text` (`ex.chon-dang-24-36`), `$.exercises[64].explain.text` (`ex.chia-30-45`, "Số túi phải chia hết cả 30 và 45"); LL-17
- Nguồn: Bài 11 tr.39 ví dụ 2
- Vấn đề: cả bài viết "a chia hết cho b". Câu thiếu "cho" này được bé đọc thành "số đĩa chia hết cho 24 và 36", tức quan hệ của BCNN, ngược với kết luận ƯCLN ngay sau. Section 13 dạy đúng việc phân biệt hai chiều này; Bài 11 vòng 1 đã có lỗi đảo chiều cùng kiểu.
- Sửa: "24 và 40 đều phải chia hết cho số đĩa, nên số đĩa là ước chung của 24 và 40. Muốn nhiều đĩa nhất thì lấy ƯCLN." (theo số mới ở Nghiêm trọng 6). `chia-30-45`: "30 và 45 đều phải chia hết cho số túi, nên số túi là ước chung của 30 và 45. Muốn nhiều túi nhất thì lấy ƯCLN."

### 8. Định nghĩa "quy đồng mẫu số" chỉ nằm trong caption xám

- Vị trí: `$.sections[11].blocks[0].caption` (`section.quy-dong`); LL-13
- Nguồn: Kiến thức nền (tiểu học); glossary `quy đồng mẫu số` có `prerequisite`
- Vấn đề: "Quy đồng mẫu số là đưa các phân số về cùng một mẫu số" là câu định nghĩa của thuật ngữ đặt tên section, nhưng chỉ có ở caption nhỏ xám (ảnh `143`). Checklist trục 5 xếp định nghĩa chỉ nằm ở caption vào Nghiêm trọng; nhóm 3 ghi Nên sửa vì là kiến thức nền, Tổng hợp nâng mức theo checklist và theo tiền lệ Bài 11 section `nhac-thua-so` (LL-13).
- Sửa: thêm một `note` (không `rule`) đứng trước hình `quy-dong-4-6`: "Quy đồng mẫu số là đưa các phân số về cùng một mẫu số mà giá trị không đổi." Caption của hình còn lại câu về hình: "Hai phân số có mẫu 4 và 6. Mẫu số chung nhỏ nhất là BCNN(4, 6) = 12."

## Nên sửa

### 1. Câu hỏi mở bài không được trả lời, tên hai xe đổi giữa chừng

- Vị trí: `$.overview.hook.text`; `$.sections[0].blocks[0]` (`visual.xe-6-8`), `$.sections[1].blocks[0].caption` (`visual.bc-6-8`); LL-16
- Nguồn: —
- Vấn đề: hook hỏi "bao lâu sau hai xe lại cùng rời bến?" mà không màn nào đáp "24 phút". Hook gọi "xe số 1, xe số 2", mọi hình gọi "Xe A, Xe B".
- Sửa: hook dùng "xe A", "xe B". Caption `bc-6-8` thêm câu kết: "Vậy sau 24 phút, tức lúc 6 giờ 24 phút, hai xe lại cùng rời bến."

### 2. `whyItMatters` không cần tới "nhỏ nhất" và tình huống gượng

- Vị trí: `$.overview.whyItMatters`
- Nguồn: —
- Vấn đề: muốn số bút bằng số vở thì chỉ cần bội chung (48, 72 cũng được); "nhỏ nhất" mới là mua ít nhất. Câu không nói vì sao cần bằng nhau.
- Sửa: "Bội chung nhỏ nhất giúp bạn biết phải mua ít nhất bao nhiêu bút (vỉ 6 cái) và vở (xếp 8 quyển) để chia mỗi bạn một bút, một vở vừa đủ."

### 3. "Trong 30 phút đầu" có hai cách hiểu

- Vị trí: `$.exercises[3].prompt[1].text` (`ex.dem-lan-gap-5-10`); LL-10
- Nguồn: —
- Vấn đề: đáp án 3 tính cả phút 30; hiểu "trước phút 30" thì ra 2.
- Sửa: "Từ sau lúc 0 phút đến hết phút 30, có mấy lần cả hai xe cùng rời bến?"

### 4. Câu mẹo section 3 đọc được hai nghĩa

- Vị trí: `$.sections[2].blocks[2].text` (`tip.boi-so-lon`); LL-10
- Nguồn: —
- Vấn đề: "số nào chia hết cho số bé đầu tiên là BCNN" đọc được thành "chia hết cho [số bé đầu tiên]". Mẹo đúng với mọi đầu vào (bảng cuối tệp).
- Sửa: "BCNN luôn là bội của số lớn hơn. Chỉ liệt kê các bội của số lớn. Số đầu tiên chia hết cho số nhỏ chính là BCNN." (dùng "số nhỏ", xem Nên sửa 11).

### 5. Câu ôn và câu luyện lặp số của màn dạy và mẹo (section 1–3)

- Vị trí: `$.exercises[4]` (`ex.khong-la-bc-4-6`), `$.exercises[13]` (`ex.chon-bc-6-9-nho-hon-60`), `$.exercises[2]` (`ex.dien-bc-18`); LL-07
- Nguồn: —
- Vấn đề: màn chạm `chon-bc-4-6` (đáp án 12, 24) và `khong-la-bc-4-6` dùng cùng cặp và cùng hai số; cặp 6 và 9 (18) có ở màn `chon-bcnn-6-9`, ví dụ mẹo section 3, `dien-bc-18`, và `chon-bc-6-9-nho-hon-60` lặp 18, 27, 36 của màn `chon-bc-6-9`.
- Sửa: `khong-la-bc-4-6` đổi sang 4 và 9 (bội chung 36, 72, 108; nhiễu 18), đổi id theo; `chon-bc-6-9-nho-hon-60` đổi sang 4 và 10, nhỏ hơn 70 (20, 40, 60; nhiễu 30); `dien-bc-18` đổi sang 20 với 4 và 5. Tự giải lại và soát nhiễu không thành đáp án đúng.

### 6. Bỏ bài 2.45 nhưng ý b) chưa có câu tương đương (phán quyết giữa nhóm 1 và nhóm 2)

- Vị trí: `$.exercises[7]` (`ex.dien-bcnn-ten`), so với `$.exercises[8]` (`ex.noi-ky-hieu`)
- Nguồn: tr.42 bài 2.45, lời giải tr.108
- Vấn đề: nhóm 2 chấp nhận bỏ 2.45 vì "đã có hai câu điền từ ở S1, S2"; nhóm 1 chỉ chấp nhận khi có câu tương đương ý b. Tổng hợp theo nhóm 1: ý a) đúng là có `dien-bc-18`, còn `dien-bcnn-ten` chỉ hỏi BCNN viết tắt của chữ gì, trùng với `noi-ky-hieu` cùng card; không câu nào bắt bé nhận ra BCNN từ định nghĩa có số (số nhỏ nhất khác 0 chia hết cho cả hai), là ý b). Không Nghiêm trọng vì định nghĩa đã dạy ở note và các câu chọn BCNN vẫn dùng nó.
- Sửa: đổi `dien-bcnn-ten` (đổi id, vd `ex.dien-bcnn-28`) thành: prompt note "Chọn từ điền vào chỗ trống." cùng formula `\begin{gathered} 28 \chiahet 4 \\ 28 \chiahet 7 \end{gathered}`; segments "28 là số nhỏ nhất khác 0 chia hết cho cả 4 và 7. Vậy 28 là ___ của 4 và 7."; bank "bội chung nhỏ nhất", "ước chung lớn nhất", "ước chung" (không đưa "bội chung" vào bank vì 28 cũng là bội chung, LL-01). Sửa xong thì việc bỏ 2.45 chấp nhận được.

### 7. Dấu ":" sau B(16) đặt sát phép chia

- Vị trí: `$.exercises[11].explain.tex` (`ex.bcnn-12-16`); LL-21
- Nguồn: —
- Vấn đề: dòng "B(16) : 16, 32, 48" nằm ngay trên "48 : 12 = 4", trông như phép chia.
- Sửa: đưa danh sách ra `explain.text` ("Các bội của 16 là 16, 32, 48.") và để `tex` chỉ còn `\begin{gathered} 32 \khongchiahet 12 \\ \concept{pink}{48} \chiahet 12 \end{gathered}`.

### 8. Giải thích đưa ra BCNN bằng tích hai số mà không nêu lý do

- Vị trí: `$.exercises[9].explain` (`ex.den-nhay-2-7`), `$.exercises[12].explain` (`ex.mua-but-vo-5-8`)
- Nguồn: —
- Vấn đề: bài không dạy "BCNN bằng tích khi ƯCLN bằng 1", vậy mà hai lời giải viết BCNN = tích như một luật; bé dễ rút ra "BCNN = nhân hai số", đúng lỗi mà nhiễu 60, 147, 180 ở các câu khác được đặt ra để bắt.
- Sửa: giải bằng bội của số lớn, khớp mẹo section 3. `den-nhay-2-7`: text "Bội của 7 là 7, 14. Số 7 không chia hết cho 2, số 14 chia hết cho 2, nên lần đầu hai đèn lại cùng nháy là giây 14.", tex `\begin{gathered} 7 \khongchiahet 2 \\ \concept{pink}{14} \chiahet 2 \end{gathered}`. `mua-but-vo-5-8`: bội của 8 là 8, 16, 24, 32, 40; tex `\begin{gathered} 32 \khongchiahet 5 \\ \concept{pink}{40} \chiahet 5 \end{gathered}`.

### 9. "Lần đầu" ở màn `meetTry` lệch với "lần tiếp theo" ở các câu khác

- Vị trí: `$.exercises[6].prompt[0].text` (`ex.gap-4-5-tu-lam`), `$.sections[1].blocks[3].children[0].text`; LL-10
- Nguồn: —
- Vấn đề: section 1 vừa dạy hai xe cùng rời bến lúc 0 phút; hook, `den-nhay-2-7` hỏi "lại cùng…", riêng màn `meetTry` hỏi "cùng rời bến lần đầu".
- Sửa: hai chỗ viết "…tới khi hai xe lại cùng rời bến, lần đầu tiên sau lúc xuất phát", và đặt dữ kiện trước việc phải làm: "Xe A cứ 4 phút một chuyến, xe B cứ 5 phút một chuyến, cùng xuất phát lúc 0 phút. Bấm + tới khi hai xe lại cùng rời bến lần đầu tiên sau lúc xuất phát."

### 10. Section 3 và 4 không có ví dụ đời sống trên màn dạy

- Vị trí: `$.sections[2].blocks[0]`, `$.sections[3].blocks[0]` (`section.liet-ke-bcnn`, `section.so-lon-chia-het`); LL-16
- Nguồn: —
- Vấn đề: hai section chỉ có danh sách bội; tình huống đời sống chỉ ở kho ôn.
- Sửa: caption `ds-4-10` thêm câu "Như đèn A cứ 4 giây nháy, đèn B cứ 10 giây nháy: giây 20 là lần đầu hai đèn lại cùng nháy." Caption `ds-5-15` thêm "Như xe A cứ 5 phút, xe B cứ 15 phút một chuyến: sau 15 phút hai xe lại cùng rời bến."

### 11. "Số bé" ở bài này, "số nhỏ" ở Bài 11

- Vị trí: `$.sections[3].title`, `$.sections[3].blocks[1].children[0].text`, `$.sections[3].blocks[2].children[0].text`, `$.sections[3].recap.caption`, `$.cards[3].recap.caption` (`section.so-lon-chia-het`, `card.so-lon-chia-het`), `tip.boi-so-lon`, mọi `explain` có "số bé"; `catalog.ts` hình `chon-cap-so-lon` (`done`); LL-05
- Nguồn: —
- Vấn đề: Bài 11 gọi section tương ứng "Khi số lớn chia hết cho số nhỏ"; section 13 đặt hai bài cạnh nhau. Nhóm 1 ghi Góp ý; Tổng hợp nâng lên Nên sửa theo checklist trục 4 (một khái niệm hai tên giữa các bài).
- Sửa: thay mọi "số bé" (7 chỗ trong `lesson.json`, 1 chỗ trong `catalog.ts`) bằng "số nhỏ". Câu quy tắc: "Nếu số lớn chia hết cho số nhỏ thì BCNN của hai số là số lớn."; recap section và card lặp lại nguyên văn.

### 12. Quy tắc section 7 là định nghĩa nói lại, còn ý mới (lấy cả thừa số chỉ có ở một số) nằm ở caption

- Vị trí: `$.sections[6].blocks[1].children[0]` (note `rule`), `$.sections[6].blocks[0].caption`, `$.sections[6].recap.caption`, `$.cards[6].recap.caption` (`card.bcnn-ba-so`); LL-05
- Nguồn: tr.41, `sbt-p41.png` (kiến thức cần nhớ 2, 3)
- Vấn đề: "BCNN của ba số là số nhỏ nhất khác 0 chia hết cho cả ba số" là định nghĩa của section 2 nói bằng câu khác. Ý cần nhớ của section (thừa số chỉ có ở một số, như 5 ở 4, 6, 10, vẫn được lấy) chỉ có ở caption và hình; bé vừa học ở Bài 11 "Thừa số chỉ có ở một hay hai số thì bỏ đi" dễ đem sang BCNN.
- Sửa: câu quy tắc, recap section và recap card cùng một câu: "Với ba số, lấy mọi thừa số nguyên tố có ở ít nhất một số, kể cả thừa số chỉ có ở một số, mỗi thừa số với số mũ lớn nhất." Khối formula `60 ⋮ 4, 6, 10` giữ làm ví dụ.

### 13. Mẹo section 5 chỉ nói lại cách làm của section, đặt trước phần cùng làm

- Vị trí: `$.sections[4].blocks[2]` (`tip.tim-bcnn-nhanh`)
- Nguồn: tr.41 (kiến thức bổ sung 5)
- Vấn đề: "nhân hai số rồi chia cho ƯCLN" là đúng cách mà phần cùng làm (`blocks[3]`) và câu kiểm tra `bcnn-tu-uclnn-6-10` dạy: mẹo gượng, đứng trước cách làm thường. "Nhanh khi hai số lớn" ngược với `docs/learner.md` (bé yếu nhân, chia: 16 · 24 = 384).
- Sửa: chuyển câu "Muốn tìm BCNN, nhân hai số rồi chia cho ƯCLN của chúng." thành `note` ngay sau quy tắc (giữ `tex` cũ trong khối formula). Thay mẹo bằng: `text` "Chia một số cho ƯCLN trước rồi mới nhân với số kia: số phải nhân nhỏ hơn.", `tex` `12 : \concept{amber}{6} = 2,\quad 2 \cdot 18 = \concept{pink}{36}` (xếp `gathered` nếu tràn điện thoại), `kind` "làm nhanh", đặt sau phần cùng làm.

### 14. Mẹo section 6 không ghi dòng nào là ƯCLN, dòng nào là BCNN

- Vị trí: `$.sections[5].blocks[3].tex` (`tip.chung-rieng`)
- Nguồn: —
- Vấn đề: chỉ màu amber, pink phân biệt 6 và 36, khung mẹo không có chú giải màu.
- Sửa: `tex` hai dòng cuối viết `\mathrm{ƯCLN}` không được (chữ Việt trong TeX), nên ghi tên ở chữ: thêm vào `text` câu "Với 12 và 18: ƯCLN là 6, BCNN là 36." và đổi dòng BCNN của `tex` thành `\mathrm{BCNN}(12, 18) = 2^{2} \cdot 3^{2} = \concept{pink}{36}`.

### 15. Quy tắc section 9 nói "hai việc", phần cùng làm và bài luyện dùng ba việc

- Vị trí: `$.sections[8].title`, `$.sections[8].blocks[1].children[0]` (note `rule`), `$.sections[8].recap.caption`, `$.cards[8].recap.caption`; liên quan `$.sections[8].blocks[2]`, `$.exercises[44]` (`ex.xe-6-8-12`)
- Nguồn: tr.42 bài 2.49 (ba bạn)
- Vấn đề: bé làm theo chữ, không chắc quy tắc dùng được cho ba việc.
- Sửa: câu quy tắc, recap section và card: "Các việc lặp lại sau các khoảng thời gian khác nhau, cùng xảy ra một lúc, sẽ lại cùng xảy ra sau BCNN của các khoảng đó." Tên section: "Các việc lặp lại cùng lúc".

### 16. Màu khái niệm dùng sai trên thẻ hình: amber (ƯCLN) cho đáp số, pink (BCNN) cho câu về bội chung, lime cho số không phải bội chung

- Vị trí: `catalog.ts`: thẻ "Lúc … giờ" `color: "amber"` của `bus-15-20`, `tin-nhan-10-15-20`, `bao-thuc-goi-y`, `bao-thuc-giai`; thẻ "Lớp có 49 bạn", "Đội có 41 người", "Đội có 62 người" `color: "amber"` của `hang-3-4`, `hang-goi-y-4-5`, `hang-giai-5-6`; thẻ "Số cần tìm là bội của 18", "Số cần tìm là bội của 12" (`so-6-9`, `so-4-6-xong`) và "Bớt 1 bạn thì chia hết cho 3 và 4", "Bớt 1 người…", "Bớt 2 người…" `color: "pink"`; `$.exercises[53].explain.tex` (`ex.hang-5-6-du-2`, `60 + 2 = \concept{lime}{62}`)
- Nguồn: —
- Vấn đề: trong bài amber là ƯCLN (section 5, 6, 13 đặt amber cạnh pink), nên đáp số giờ hay số người tô amber gợi ƯCLN. Các thẻ nói về bội chung lại tô pink của BCNN. 62 không là bội chung của 5 và 6 mà tô lime.
- Sửa: thẻ đáp số "Lúc … giờ", "Lớp có … bạn", "Đội có … người" đổi sang `slate`. Thẻ "Số cần tìm là bội của …" và "Bớt … thì chia hết cho …" đổi sang `lime`. `explain.tex` của `hang-5-6-du-2`: `\concept{lime}{60} + 2 = 62`.

### 17. Kí hiệu "⇒" chưa dạy, và một dòng nhảy từ 60 phút sang giờ không đơn vị

- Vị trí: `$.exercises[15]`, `[16]`, `[18]`, `[19]`, `[21]`, `[23]`, `[43]`, `[48]`, `[49]`, `[50]` `.explain.tex` (`bcnn-7-21`, `bcnn-12-36`, `chuong-17-51`, `dien-so-lon-30`, `tim-b-8-4-24`, `tim-b-12-3-60`, `bao-thuc-20-30`, `rang-9-6-vong`, `rang-10-25`, `rang-14-21`); LL-19, LL-21
- Nguồn: —
- Vấn đề: Bài 1 tới Bài 11 không dùng `\Rightarrow`; bé không biết đọc. Trên điện thoại mũi tên rơi xuống cuối dòng (ảnh `070`, `118`). Riêng `bao-thuc-20-30` viết `\mathrm{BCNN}(20, 30) = 60 \Rightarrow 7 + 1 = 8`: từ 60 sang 7 + 1 không có bước "60 phút = 1 giờ".
- Sửa: thay mỗi `A \Rightarrow B` bằng hai dòng `\begin{gathered} A \\ B \end{gathered}`, chữ "nên" để ở `explain.text`. Ví dụ `tim-b-8-4-24`: `\begin{gathered} a \cdot b = \concept{amber}{4} \cdot \concept{pink}{24} = 96 \\ b = 96 : 8 = 12 \end{gathered}`. `bao-thuc-20-30`: `\begin{gathered} \mathrm{BCNN}(20, 30) = \concept{pink}{60} \\ 7 + 1 = 8 \end{gathered}`, `text` giữ câu "60 phút, tức 1 giờ".

### 18. Bài luyện section 5 là dạng "tìm số còn lại" chưa có mẫu

- Vị trí: `$.exercises[21]` (`ex.tim-b-8-4-24`, `practiceIds` của `section.uclnn-nhan-bcnn`); LL-16
- Nguồn: tr.43 bài 2.51
- Vấn đề: section chỉ làm mẫu chiều "biết ƯCLN, tìm BCNN"; bài luyện đòi chiều ngược lại, có chữ a, b, độ khó 3.
- Sửa: thêm vào phần cùng làm, sau hình `lines-9-15`, một note mẫu: "Biết hai số có ƯCLN là 2, BCNN là 20, một số là 4. Tích hai số là 2 · 20 = 40, nên số kia là 40 : 4 = 10." (số khác cả `tim-b-8-4-24` lẫn `tim-b-12-3-60`).

### 19. Section 8 khi nói "khác 0", khi không

- Vị trí: `$.sections[7].blocks[0].caption`, `$.sections[7].blocks[1].children[0]` (note `rule`), `$.sections[7].recap.caption`, `$.cards[7].recap.caption`, `$.exercises[39].prompt` (`ex.chon-tap-bc-3-4`); LL-05
- Nguồn: tr.41 (kiến thức cần nhớ 4)
- Vấn đề: section 1 nói 0 cũng là bội chung; caption section 8 "Mọi bội chung … đều bằng 24 nhân với 1, 2, 3" bỏ 0; `bc-thu-ba-5-6` nói "khác 0", quy tắc và `chon-tap-bc-3-4` thì không.
- Sửa: câu quy tắc, recap section và card: "Muốn tìm các bội chung khác 0, ta tìm BCNN rồi nhân BCNN đó lần lượt với 1, 2, 3 và cứ thế tiếp." Caption: "Mọi bội chung khác 0 của 6 và 8 đều bằng 24 nhân với 1, 2, 3 và cứ thế tiếp." Đề `chon-tap-bc-3-4`: "Các bội chung khác 0 của 3 và 4…". Note cùng làm `$.sections[7].blocks[2].children[0]` viết "…và cứ thế tiếp" cho khớp.

### 20. Section bánh răng không có hình bánh răng; màn tương tác cho hai bánh quay riêng

- Vị trí: `$.sections[9].blocks[0]` (`visual.rang-12-8`), `$.sections[9].blocks[2]` (`visual.gap-rang-6-4`), đề `rang-6-10`, `rang-9-6-vong`; LL-16, LL-10
- Nguồn: tr.43 bài 2.55 (hình hai bánh, đánh dấu hai răng đang khớp)
- Vấn đề: cả section chỉ có dãy số (ảnh `121`–`129`); bé chưa thấy bánh răng sẽ không hiểu "hai dấu gặp lại nhau". Bài không nói vì sao hai bánh khớp nhau luôn qua cùng số răng. Màn `gap-rang-6-4` hiện được "Bánh A ở 6 răng, bánh B ở 4 răng", trạng thái không thể có với hai bánh khớp nhau.
- Sửa: thêm một hình tĩnh hai bánh răng khớp nhau, hai răng đánh dấu (vẽ mới bằng `lesson-visual`, không chép hình sách) làm khối đầu section, và một note nền trước câu quy tắc: "Hai bánh khớp nhau thì cùng lúc qua cùng một số răng. Dấu của bánh A về chỗ cũ sau mỗi 12 răng, dấu của bánh B sau mỗi 8 răng." Note cùng làm `$.sections[9].blocks[2].children[0]` nói rõ: "Bấm + cho bánh nào quay thêm một vòng thì đếm thêm một vòng của bánh đó; hai dấu gặp nhau khi số răng hai bánh đã qua bằng nhau."

### 21. Câu quy tắc quy đồng bỏ mất bước tìm số để nhân, và dùng lẫn "mẫu", "mẫu số"

- Vị trí: `$.sections[11].blocks[1].children[0]` (`section.quy-dong`, `rule`); hình `quy-dong-*` trong `catalog.ts`
- Nguồn: tr.41 (kĩ năng vận dụng BCNN để quy đồng), tr.43 bài 2.52, lời giải tr.109
- Vấn đề: "nhân cả tử số lẫn mẫu số … với cùng một số" không nói số đó là mẫu số chung chia cho mẫu số; câu luyện `tu-moi-5-12-7-18` cần đúng bước này (36 : 18 = 2), hình chỉ hiện "4 · 3". Cùng câu dùng "hai mẫu" rồi "mẫu số".
- Sửa: "Muốn quy đồng mẫu số hai phân số, ta lấy BCNN của hai mẫu số làm mẫu số chung. Lấy mẫu số chung chia cho mẫu số của từng phân số, rồi nhân cả tử số lẫn mẫu số của phân số đó với thương vừa tìm." Thêm vào mỗi hình `quy-dong-*` một hàng thẻ `slate` dạng "12 : 4 = 3". Recap: xem Nên sửa 27.

### 22. Câu quy tắc section 13 nói khác Bài 11 và section 9, thiếu "cắt đoạn dài nhất"

- Vị trí: `$.sections[12].blocks[1].children[0]`, `$.sections[12].recap.caption`, `$.cards[12].recap.caption` (`card.uclnn-hay-bcnn`), caption `$.sections[12].blocks[0].caption`; LL-05
- Nguồn: Bài 11 tr.39 ví dụ 2; tr.42 bài 2.49
- Vấn đề: Bài 11 viết "Chia đều các loại đồ vật vào các phần như nhau, không thừa…", section 13 rút thành "Chia đều thành nhiều phần nhất", bỏ "như nhau, không thừa". Vế BCNN là cách nói thứ hai của quy tắc section 9. `chon-bcnn-nhieu` (lựa chọn d) và `noi-ket-qua` hỏi "cắt đoạn dài nhất", quy tắc không nói tới.
- Sửa: câu quy tắc, recap section và card: "Chia đều các loại đồ vật vào các phần như nhau, không thừa, hay cắt các dải thành đoạn dài nhất vừa hết: tìm ƯCLN. Các việc lặp lại, cùng xảy ra một lúc, sẽ lại cùng xảy ra lần nữa: tìm BCNN." (vế BCNN khớp câu mới ở Nên sửa 15). Caption hình: "Cùng hai số 12 và 18: chia đều không thừa thì tìm ƯCLN, việc lặp lại cùng lúc thì tìm BCNN."

### 23. `chon-bcnn-nhieu`: đáp án đúng nhận ra được bằng dấu "?"

- Vị trí: `$.exercises[63].options` (`ex.chon-bcnn-nhieu`); LL-14
- Nguồn: —
- Vấn đề: hai lựa chọn đúng (a, c) là câu hỏi "Sau bao lâu…?", hai nhiễu (b, d) là câu kể.
- Sửa: viết cả bốn lựa chọn thành câu hỏi. b: "Chia 18 quả cam và 24 quả quýt vào các đĩa như nhau, không thừa quả nào. Chia được nhiều nhất bao nhiêu đĩa?" d: "Cắt hai dải băng 12 dm và 20 dm thành các đoạn bằng nhau, vừa hết. Mỗi đoạn dài nhất bao nhiêu đề-xi-mét?"

### 24. Thiếu "không thừa" trong tình huống chia đều

- Vị trí: hình `doi-chieu-12-18`, `doi-chieu-12-18-xong` (`catalog.ts`, thẻ chia cam, quýt), `$.exercises[63].options[1]`; LL-10
- Nguồn: Bài 11 tr.39 ví dụ 2
- Vấn đề: "chia vào nhiều đĩa nhất, mỗi đĩa như nhau" không cấm thừa quả, nên 12 đĩa (thừa 6 quýt) cũng hợp lệ.
- Sửa: thêm "không thừa quả nào" vào hai thẻ của hình (lựa chọn b đã sửa ở Nên sửa 23).

### 25. `hai-chu-so-6-8` trùng dạng và đáp số 96 với recap section 11

- Vị trí: `$.exercises[55]` (`ex.hai-chu-so-6-8`), hình `so-4-6-xong` (`$.sections[10].blocks[1]`, `$.sections[10].recap`); LL-07
- Nguồn: —
- Vấn đề: recap hiện "96 là số có hai chữ số lớn nhất" chia hết cho 4 và 6; câu ôn hỏi cùng dạng với 6 và 8, đáp số cũng 96.
- Sửa: đổi sang 8 và 10 (BCNN 40, đáp số 80), đổi id và nhiễu theo.

### 26. `sourceRef` của section 13 trỏ tr.38

- Vị trí: `$.sections[12].sourceRef`, `$.cards[12].sourceRef`
- Nguồn: `sources/math/uoc-chung-uoc-chung-lon-nhat/sbt-p38.png`, `sbt-p39.png`
- Vấn đề: tr.38 chỉ có định nghĩa ƯC, ƯCLN; bài toán chia đều là ví dụ 2 ở tr.39, ảnh nằm trong thư mục nguồn Bài 11.
- Sửa: "Sách bài tập tr.39 (Bài 11, ví dụ 2), tr.41, 42".

### 27. Recap section 11 và section 12 bỏ mất cách làm

- Vị trí: `$.sections[10].recap.caption`, `$.cards[10].recap.caption` (`card.so-trong-khoang`); `$.sections[11].recap.caption`, `$.cards[11].recap.caption` (`card.quy-dong`); LL-06
- Nguồn: tr.42, 43, lời giải tr.109
- Vấn đề: recap section 11 chỉ giữ "Số chia hết cho nhiều số là bội chung" (định nghĩa của section 1), bỏ "chọn trong khoảng". Recap section 12 chỉ giữ câu đầu, bỏ bước nhân.
- Sửa: recap của section và card lặp lại nguyên văn câu quy tắc mới (Nghiêm trọng 5, Nên sửa 21). Quá giới hạn `[recap]` 2 câu thì rút câu quy tắc section 11 thành: "Muốn tìm số chia hết cho nhiều số trong một khoảng, ta liệt kê các bội của BCNN, cộng số dư nếu có, rồi chọn số nằm trong khoảng."

### 28. "≤ 24, 36" đọc được thành số thập phân

- Vị trí: `$.exercises[62].explain.tex` (`ex.chon-dang-24-36`); LL-21
- Nguồn: —
- Vấn đề: bé đã học số thập phân viết bằng dấu phẩy; "12 ≤ 24, 36" đọc được thành "12 ≤ 24,36".
- Sửa: đã thay cả `tex` ở Nghiêm trọng 6 (hai dòng `24 \chiahet 8`, `40 \chiahet 8`). Không dùng dạng "a ≤ b, c" ở chỗ nào khác (`tip.chon-cong-cu` đã thay ở Nghiêm trọng 4).

## Góp ý

### 1. Nhiễu "thương" trong ngân hàng từ quá yếu

- Vị trí: `$.exercises[2].bank` (`ex.dien-bc-18`); LL-14
- Nguồn: —
- Vấn đề: không ai nhầm "thương" với "bội chung".
- Sửa: thay bằng "ước"; không dùng "bội chung nhỏ nhất" (18 là BCNN(6, 9), LL-01).

### 2. Thiếu `wrong` cho vài nhiễu hay bị chọn

- Vị trí: `$.exercises[10]` (`ex.bcnn-6-15`, nhiễu 45), `$.exercises[20]` (`ex.bcnn-tu-uclnn-6-10`, nhiễu 20), `$.exercises[39]` (`ex.chon-tap-bc-3-4`, lựa chọn c), `$.exercises[47]` (`ex.rang-6-10`, nhiễu 16)
- Nguồn: —
- Sửa: thêm "45 chia cho 6 còn dư 3, nên 45 không là bội của 6."; "20 không chia hết cho 6."; "3 không chia hết cho 4, nên 3 không là bội chung của 3 và 4."; "16 là tổng 6 + 10; 16 không chia hết cho 6."

### 3. Lời đề hai câu tác giả nhờ soi: đạt, chỉ chỉnh chữ

- Vị trí: `$.exercises[17].prompt[0].text` (`ex.chon-cap-bcnn-la-so-lon`), `$.exercises[4].prompt[0].text` (`ex.khong-la-bc-4-6`)
- Nguồn: tr.108 lời giải 2.48a
- Vấn đề: tập đáp án đúng duy nhất; "số lớn của cặp" hơi lạ; câu phủ định một lần (không phải phủ định kép) dễ đọc sót chữ "không".
- Sửa: "Chọn tất cả các cặp số mà BCNN bằng số lớn hơn trong cặp."; "Có một số không phải bội chung của 4 và 9. Đó là số nào?" (theo số mới ở Nên sửa 5).

### 4. Chữ và bộ đếm của hình `meetTry`

- Vị trí: `src/visuals/math/boi-chung-boi-chung-nho-nhat/meet-try.tsx`, `logic.ts` (hình `gap-3-4`, `gap-xe`, `gap-rang-6-4`)
- Nguồn: —
- Vấn đề: "Xe A ở 4 phút", "Bánh A ở 6 răng" nói không tự nhiên; "Đã thử 1 lần" khi bé chưa bấm (`tried` bắt đầu từ 1); bấm quá tới 40 thì dòng lime "Cả hai cùng ở 40 phút" trông như đúng.
- Sửa: thêm vào `MeetTrySpec` mẫu câu cho mốc ("rời bến ở phút {n}", "đã qua {n} răng"); `tried` bắt đầu từ 0; dòng "cùng ở" chỉ tô lime khi đó là lần gặp đầu.

### 5. Id khái niệm `uclnn` gõ thừa chữ

- Vị trí: `$.concepts[4].id`, `section.uclnn-nhan-bcnn`, `section.uclnn-hay-bcnn`, `card.uclnn-*`
- Nguồn: —
- Vấn đề: Bài 11 dùng `concept.uoc-chung-lon-nhat`; id bị khoá sau `content:lock`.
- Sửa: đổi trước khi khoá, vd `concept.uoc-chung-lon-nhat`, `section.ucln-nhan-bcnn`, `section.ucln-hay-bcnn`.

### 6. Một màu, hai nghĩa giữa các bài

- Vị trí: `$.concepts` (`bcnn` pink, `quy-dong-mau-so` blue); `content/glossary/math.json`
- Nguồn: —
- Vấn đề: pink là "hợp số" ở Bài 11 và glossary, là BCNN ở bài này (glossary cũng ghi BCNN pink). Blue là "bội", "thừa số" trong glossary mà bài này gán cho "quy đồng mẫu số" (khái niệm này không có màu trong glossary, và trong bài không có chỗ nào tô blue).
- Sửa: bỏ màu của `quy-dong-mau-so` nếu không tô ở đâu, hoặc chọn màu chưa có trong glossary. BCNN pink giữ được.

### 7. Nấc 1 tô cả đề nhiều câu

- Vị trí: `$.exercises[42]` (`bus-8-12`), `[22]` (`xe-16-24`), `[26]` (`bcnn-14-35`), `[32]` (`truc-nhat-5-6-10`), `[43]` (`bao-thuc-20-30`) `.hints.highlight`
- Nguồn: —
- Sửa: chỉ tô khối có các khoảng thời gian (khối 0).

### 8. `xep-buoc-phan-tich`: bước cuối thừa, bước 2 lệch chữ quy tắc

- Vị trí: `$.exercises[29].items` (`ex.xep-buoc-phan-tich`)
- Nguồn: tr.41 (kiến thức cần nhớ 3)
- Sửa: bỏ `s4` "Viết kết quả là BCNN" (giữ ba bước như sách); `s2` viết "Lấy mọi thừa số nguyên tố, chung và riêng, mỗi thừa số với số mũ lớn nhất".

### 9. Chữ nhỏ cần chỉnh

- Vị trí và sửa:
  - `$.exercises[42].explain.wrong[0]` (`bus-8-12`): "…không dùng khi việc lặp lại" → "…không dùng khi hai việc lặp lại".
  - `$.exercises[46].explain.text` (`dien-bcnn-lap-lai`): "là bội của cả hai khoảng thời gian" → "là bội chung của hai khoảng thời gian".
  - `$.exercises[36].explain.wrong[1]` (`tim-loi-bcnn-4-6-9`, lựa chọn c): "BCNN luôn không nhỏ hơn số lớn nhất" → "BCNN luôn lớn hơn hoặc bằng số lớn nhất".
  - `$.exercises[45].options` (`den-3-4-chon`): ghi "6 giây", "12 giây"… cho khớp lời đề.
  - `$.sections[5].blocks[1].children[0]` (quy tắc section 6): có thể thêm "của các số lớn hơn 1" cho khớp sách.

### 10. Hình `lines-12-18`: ƯCLN chỉ là nhãn nhỏ, BCNN là công thức lớn

- Vị trí: `catalog.ts` `lines-12-18`, `lines-12-18-xong` (`$.sections[4].blocks[0]`, `blocks[1].children[1]`, recap section 5 và card)
- Nguồn: —
- Sửa: để hai dòng cùng dạng: `\mathrm{BCNN}(12, 18) = \concept{pink}{36}` có thẻ "Bội chung nhỏ nhất", và một dòng TeX `\concept{amber}{6}` có thẻ "ƯCLN(12, 18)" cùng cỡ.

### 11. Bài luyện section 6, 7 là bài lời văn "lặp lại" trước section 9

- Vị trí: `$.exercises[26]` (`bcnn-14-35`), `$.exercises[32]` (`truc-nhat-5-6-10`)
- Nguồn: —
- Sửa: dùng câu tính trực tiếp (như `bcnn-16-20`) làm bài luyện của section 6, đưa câu lời văn vào kho ôn; hoặc mở `explain` bằng "Hai bạn cùng trực lại vào ngày là bội chung của 14 và 35, sớm nhất là BCNN."

### 12. Section 9 có thể thêm một mẹo tránh sai

- Vị trí: `$.sections[8]` (`section.lap-lai`)
- Nguồn: —
- Sửa: `tip` "tránh sai": "Đề hỏi lúc mấy giờ thì đổi BCNN ra giờ và phút rồi cộng vào giờ bắt đầu." (đúng cả khi BCNN là 90 phút = 1 giờ 30 phút).

### 13. Lặp số giữa các câu cùng card

- Vị trí: `chon-ba-chu-so-5-6` và `ba-chu-so-8-12` (cùng đáp số 120); `chon-ba-chu-so-5-6`, `hang-5-6-du-2`, `chon-5-6-giua-50-100` (cùng cặp 5 và 6); `chon-bcnn-nhieu` lựa chọn a (6 và 8 của hook); LL-07
- Nguồn: —
- Sửa: `ba-chu-so-8-12` đổi sang 9 và 12 (BCNN 36, đáp số 108).

### 14. Thẻ BCNN của hình đối chiếu hỏi "lúc" mà đáp số phút

- Vị trí: hình `doi-chieu-12-18`, `doi-chieu-12-18-xong`
- Nguồn: —
- Sửa: "Hỏi sau bao lâu hai xe lại cùng rời bến?"

### 15. `mau-chung-9-12`: hai phân số cùng tử không cần quy đồng để so sánh

- Vị trí: `$.exercises[57].prompt[0]`
- Nguồn: —
- Sửa: "Hai bạn ăn tất cả bao nhiêu phần chiếc bánh? Để cộng, ta quy đồng mẫu số…".

### 16. Sticker: nhãn "ngôi sao" mà hình là hình thoi

- Vị trí: `src/visuals/math/boi-chung-boi-chung-nho-nhat/sticker.tsx` (`aria-label`, comment)
- Nguồn: —
- Sửa: sửa `aria-label` và comment thành "hình thoi"; cân nhắc đổi hình chữ thập sky ở hàng trên (đọc được thành dấu "+").

### 17. iPad ngang: thẻ đối chiếu nhỏ, lọt thỏm

- Vị trí: hình `doi-chieu-12-18` (ảnh `ipad-landscape` `153`–`161`)
- Nguồn: —
- Sửa: báo người làm app (kind `contrast` giãn theo bề ngang); không chặn bài.

### 18. Phần sách bị bỏ: chấp nhận được

- Vị trí: cả bài
- Nguồn: tr.41 (kiến thức bổ sung 7), tr.42 (ví dụ 1, ví dụ 2, bài 2.45), tr.43 (bài 2.50 ba số, 2.51 bản đầy đủ, 2.52b, 2.53, 2.54), lời giải tr.108, 109
- Vấn đề: cách viết [a, b] dễ lẫn ngoặc vuông của thứ tự phép tính; ví dụ cột mốc cần thêm bước đếm cột; 2.51 đầy đủ cần "nguyên tố cùng nhau" chưa dạy; 2.53, 2.54 thêm số lớn và "thế kỉ XI". Bỏ được. Bài 2.45: chỉ chấp nhận khi làm Nên sửa 6. Số 0 chỉ nói một lần ở section 1: đạt.
- Sửa (tuỳ): thêm một câu kho ôn ba số có dư, vd hàng 2, hàng 3, hàng 4 đều dư 1, từ 20 đến 30, đáp số 25.

## Mẹo đã thử (tóm tắt)

| Mẹo | Số đã thử | Kết quả |
|---|---|---|
| `boi-so-lon` (S3) | (4, 10), (6, 6), (1, 9), (7, 21), (2, 3), (12, 16), (100, 75), (97, 89) | Đúng; chỉ câu chữ (Nên sửa 4) |
| `tim-bcnn-nhanh` (S5) | (1, 1), (1, 7), (4, 9), (7, 21), (6, 6), (16, 24), (97, 89) | Đúng; mẹo gượng (Nên sửa 13) |
| `chung-rieng` (S6) | (12, 18), (4, 8), (7, 7), (8, 15), (1, 6) | Đúng cho BCNN; không nói ƯCLN = 1 khi không có thừa số chung, không sai |
| `kiem-chia-het` (S7) | (6, 8, 9) với 72, 144, 432; (2, 3, 4) với 24; (4, 6, 9) với 24, 72 | Chỉ loại được 24 với (4, 6, 9); 144, 432, 24 với (2, 3, 4) đều qua (Nghiêm trọng 3) |
| `hang-con-du` (S11) | 3 và 4 dư 1 trong 40–55 và 37–48; 5 và 6 dư 2 trong 50–70 và 31–61; 5, 6, 8 dư 1 trong 400–500 | Sai khi đáp số sát đầu khoảng: ra 49, 62 thay vì 37, 32 (Nghiêm trọng 5) |
| `chon-cong-cu` (S13) | `chon-dang-24-36`, `chia-30-45`, (6, 12), `rang-9-6-vong`, `rang-12-8-vong`, sách 2.55, `bao-thuc-20-30` | Sai ở số vòng và lúc mấy giờ (Nghiêm trọng 4) |
