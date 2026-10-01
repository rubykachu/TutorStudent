# Review: Bội chung. Bội chung nhỏ nhất (`boi-chung-boi-chung-nho-nhat`)

- Bài: `content/math/kntt/boi-chung-boi-chung-nho-nhat/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/boi-chung-boi-chung-nho-nhat/` - sbt-p41, sbt-p42, sbt-p43, sbt-p108, sbt-p109 (nhóm 3 mở thêm `sources/math/uoc-chung-uoc-chung-lon-nhat/` sbt-p39 cho section 13)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (108 id chưa khoá)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/boi-chung-boi-chung-nho-nhat/`
- Kết luận: Chưa đạt: còn 5 lỗi Nghiêm trọng (5 Nghiêm trọng, 16 Nên sửa, 20 Góp ý); đã ghi "Bản đã review" `e2977d6feefcaca4ece03bbe2539e5e80c75c7feb86aa3ff7d71965f07a1ceb4` bằng `--mark`, bài giữ `draft`
- Bản đã review: `e2977d6feefcaca4ece03bbe2539e5e80c75c7feb86aa3ff7d71965f07a1ceb4` (`pnpm content:diff` so với bản này)

Cả 8 lỗi Nghiêm trọng của vòng 1 đã sửa xong (ba reviewer kiểm lại từng mục). Ba reviewer tự giải cả 67 bài tập trước khi đọc `answer`: mọi đáp án, `check.expr`, `accept` đúng, không câu nào có nhiễu cũng đúng. Recap của 13 section và 13 card lặp đúng từng chữ câu quy tắc; không còn "số bé", "⇒", "nhân tử", id `uclnn`. Cả 5 lỗi Nghiêm trọng dưới đây đều sinh ra từ bản sửa vòng 1 hay do vòng 1 chưa thử hết dạng bài (LL-20, LL-24). Tổng hợp đã đối chiếu mọi `note` quy tắc, `recap`, `caption`, `overview`, mẹo, thuật ngữ với glossary `content/glossary/math.json` và các câu quy tắc của Bài 11 `uoc-chung-uoc-chung-lon-nhat`. Mọi câu Sửa dưới đây đã đếm âm tiết theo `[length]` (tối đa 25 âm tiết một câu, note tối đa 2 câu, mẹo tối đa 3 câu), và số mới đề xuất đã soát với `lesson.json`, `catalog.ts` và các số mới của mục khác để không lặp (LL-07).

## Nghiêm trọng

### 1. Quy tắc, recap và mẹo section 13 dạy "chia đều không thừa thì tìm ƯCLN", bỏ mất "nhiều nhất"

- Vị trí: `$.sections[12].blocks[1].children[0]` (note `rule`), `$.sections[12].recap.caption`, `$.cards[12].recap.caption` (`card.ucln-hay-bcnn`), caption `$.sections[12].blocks[0].caption` (`visual.doi-chieu-12-18`), `$.sections[12].blocks[2].text` (`tip.chon-cong-cu`); LL-20
- Nguồn: Bài 11 tr.39 ví dụ 2 ("nhiều nhất bao nhiêu đội"); câu quy tắc Bài 11 section `chia-deu-nhieu-nhat` và `bai-toan-uc` ("Đề hỏi số mà mọi số đã cho đều chia hết cho nó thì ta tìm ước chung. Đề hỏi số lớn nhất như vậy thì ta tìm ƯCLN.")
- Vấn đề: câu quy tắc "Chia đều các loại đồ vật vào các phần như nhau, không thừa, hay cắt các dải thành đoạn dài nhất vừa hết: tìm ƯCLN" nói sai: chia đều không thừa chỉ cho ra một ước chung, chỉ số phần nhiều nhất mới là ƯCLN. Caption ("chia đều không thừa thì tìm ƯCLN") và câu 1 của mẹo ("Các số đã cho đều chia hết cho số cần tìm… thì tìm ƯCLN") cũng thiếu ý "lớn nhất". Ba câu này trái câu quy tắc `bai-toan-uc` của Bài 11, và lệch cả đề của chính section (`chon-dang-24-40`, `chia-30-45`, `chon-bcnn-nhieu` đều có "nhiều nhất"). Đây là recap bé thuộc để chọn công cụ. Bé thuộc câu này sẽ trả lời "ƯCLN" cho câu "chia được thành mấy đĩa" của Bài 11. Câu Sửa 22 của vòng 1 bỏ chữ "nhiều phần nhất" của bản gốc, và câu Sửa của Nghiêm trọng 4 vòng 1 viết lại mẹo mà không có "lớn nhất". Nhóm 3 xếp Nên sửa vì coi đây là "một quy tắc hai cách nói". Tổng hợp nâng lên Nghiêm trọng: câu quy tắc và recap sai kiến thức là Nghiêm trọng theo checklist trục 2.
- Sửa:
  - Câu quy tắc, recap section và recap card (2 câu, 24 và 18 âm tiết): "Chia đều các loại đồ vật thành nhiều phần nhất, không thừa, hay cắt các dải thành đoạn dài nhất vừa hết: tìm ƯCLN. Các việc lặp lại, cùng xảy ra một lúc, sẽ lại cùng xảy ra lần nữa: tìm BCNN."
  - Caption `doi-chieu-12-18` (23 âm tiết): "Cùng hai số 12 và 18: chia đều thành nhiều phần nhất thì tìm ƯCLN, việc lặp lại cùng lúc thì tìm BCNN."
  - `text` của `tip.chon-cong-cu` (3 câu: 23, 18, 15 âm tiết): "Các số đã cho đều chia hết cho số cần tìm, số đó lớn nhất (nhiều phần nhất, đoạn dài nhất): tìm ƯCLN. Số cần tìm nhỏ nhất chia hết cho các số đã cho (lần đầu gặp lại): tìm BCNN. Đề hỏi số vòng hay lúc mấy giờ thì tìm BCNN trước rồi tính tiếp." Giữ `tex`.

### 2. Mẹo "BCNN của hai số" ra kết quả sai khi bé dùng cho ba số, mà điều kiện "hai số" chỉ nằm ở tiêu đề

- Vị trí: `$.sections[2].blocks[2]` (`tip.boi-so-lon`); LL-24
- Nguồn: —
- Vấn đề: với hai số, mẹo đúng ở mọi đầu vào đã thử (bảng cuối tệp). Chữ của mẹo ("số lớn hơn", "số lớn", "số nhỏ") không nói gì khi có ba số. Bé chậm thích mẹo nhanh sẽ đem dùng ở section 7, 9 với số lớn nhất và số nhỏ nhất, và ra sai ở 5 câu của bài: `bcnn-3-8-12` (12 thay vì 24), `bcnn-6-9-15` (30 thay vì 90), `truc-nhat-5-6-10` (10 thay vì 30), `xe-6-8-12` (12 thay vì 24), `bcnn-2-3-4` (4 thay vì 12). Hai reviewer còn hiểu mẹo theo hai cách khác nhau khi có ba số (nhóm 1 ra sai, nhóm 2 ra đúng), nên chính lời mẹo đã mơ hồ. Nhóm 1 xếp Nên sửa vì tiêu đề đã ghi "hai số". Tổng hợp nâng lên Nghiêm trọng: checklist (trục 2, "Mẹo đúng với mọi đầu vào") đòi điều kiện nằm trong `text`. Tiêu đề chỉ là nhãn dạng bài, bé không đọc nó như một điều kiện. Ba số cũng là dạng bài có trong chính bài này. Vòng 1 chỉ thử mẹo trên các cặp số.
- Sửa: viết mẹo đúng cho mọi số lượng số (đã thử đúng trên 6 bộ ba của bài, xem bảng). `title` (8 chữ): "Tìm BCNN bằng bội của số lớn nhất". `text` (3 câu: 8, 9, 13 âm tiết): "BCNN luôn là bội của số lớn nhất. Chỉ liệt kê các bội của số lớn nhất. Số đầu tiên chia hết cho mọi số còn lại chính là BCNN." Đổi luôn ví dụ `tex` sang 8 và 6 để khỏi trùng đáp số 18 của màn chạm `chon-bcnn-6-9` ở section 2 (LL-07), và để nối với hai xe ở đầu bài: `\begin{gathered} 8 \khongchiahet 6 \\ 16 \khongchiahet 6 \\ \concept{pink}{24} \chiahet 6 \end{gathered}`.

### 3. Câu đầu của quy tắc section 9, đọc một mình, là một khẳng định sai

- Vị trí: `$.sections[8].blocks[1].children[0]` (note `rule`), `$.sections[8].recap.caption`, `$.cards[8].recap.caption` (`section.lap-lai`, `card.lap-lai`); LL-20
- Nguồn: tr.42 bài 2.49
- Vấn đề: bản sửa vòng 1 tách câu quy tắc thành hai câu. Câu 1 đứng riêng: "Các việc lặp lại sau những khoảng thời gian khác nhau cùng xảy ra một lúc." Đọc một mình, câu này khẳng định mọi việc lặp lại đều cùng xảy ra một lúc, chứ không nói "nếu lúc đầu chúng cùng xảy ra". Đây là recap, bé học thuộc từng câu nên sẽ nhớ nguyên câu sai này. Vế BCNN ở section 13 lại nói bằng một câu khác. Nhóm 2 xếp Nên sửa. Tổng hợp nâng lên Nghiêm trọng: một câu recap nói sai làm bé nhớ sai quy tắc (checklist trục 2), và theo luật chung, phân vân thì chọn mức cao hơn.
- Sửa: một câu (23 âm tiết), dùng cho câu quy tắc, recap section và recap card: "Các việc lặp lại, cùng xảy ra một lúc, sẽ lại cùng xảy ra sau BCNN của các khoảng thời gian lặp lại." Câu này mở đầu giống hệt vế BCNN của section 13 ở Nghiêm trọng 1, nên hai section chỉ còn một cách nói.

### 4. Màn cùng làm bánh răng nói điều trái với note mở section: "Bánh A đã qua 6 răng, bánh B đã qua 4 răng"

- Vị trí: `$.sections[9].blocks[3].children[0]` (note cùng làm), hình `gap-rang-6-4` (`$.sections[9].blocks[3].children[1]`, hằng `GEAR` trong `src/visuals/math/boi-chung-boi-chung-nho-nhat/catalog.ts`: `at: "đã qua {n} răng"`, `both: "Hai bánh cùng qua {n} răng"`); so với note `$.sections[9].blocks[0]`; LL-20, LL-10
- Nguồn: tr.43 bài 2.55, lời giải tr.109
- Vấn đề: bản sửa vòng 1 thêm note mở section: "Hai bánh khớp nhau thì cùng lúc qua cùng một số răng". Hai màn sau, màn cùng làm hiện dòng "Bánh A đã qua 6 răng, bánh B đã qua 4 răng" (ảnh `phone/132-s10-04-block.png`, cả iPad), một trạng thái không thể có theo chính note đó. Note cùng làm còn nói "Hai dấu gặp nhau khi số răng hai bánh đã qua bằng nhau". Theo note đầu, số răng hai bánh đã qua luôn bằng nhau, vậy câu này thành "hai dấu lúc nào cũng gặp nhau", sai. Bé đọc hai câu trái nhau trong cùng một section. Điều kiện gặp nhau thật (hai dấu cùng về chỗ cũ sau cùng một số răng) không được nói ra. Chính câu Sửa của Nên sửa 20 vòng 1 đã viết hai câu trái nhau này.
- Sửa:
  - `GEAR.at`: "có dấu về chỗ cũ sau {n} răng"; `GEAR.both`: "Hai dấu cùng về chỗ cũ sau {n} răng". Dòng giữa màn sẽ thành "Bánh A có dấu về chỗ cũ sau 6 răng, bánh B có dấu về chỗ cũ sau 4 răng", lời kết thành "Xong rồi! Lần đầu hai dấu cùng về chỗ cũ sau 12 răng." Nhãn chú giải "Cả hai cùng ở đó" đổi thành "Hai dấu cùng về chỗ cũ".
  - Note cùng làm (2 câu, mỗi câu dưới 25 âm tiết): "Cùng làm: bấm + để đếm thêm một vòng của bánh đó; mỗi vòng, dấu của bánh về chỗ cũ một lần. Hai dấu gặp nhau khi cả hai cùng về chỗ cũ sau cùng một số răng."
  - Chụp lại `gap-rang-6-4` trên điện thoại và iPad để xem dòng dài hơn có gãy xấu không.

### 5. Mẹo "ƯCLN và BCNN khi phân tích" bị cắt mất "= 36" trên điện thoại

- Vị trí: `$.sections[5].blocks[3].tex` (`tip.chung-rieng`); LL-20, LL-12
- Nguồn: —
- Vấn đề: bản sửa vòng 1 thêm `\mathrm{BCNN}(12, 18) &=` vào dòng cuối của khối `aligned`. Trên điện thoại (ảnh `phone/083-s6-04-block.png`, Tổng hợp đã mở xem), dòng này rộng hơn khung, chỉ còn "BCNN(12, 18) = 2² · 3² =". Mất đúng kết quả 36 màu pink mà mẹo muốn bé so với ƯCLN. iPad hiện đủ. Walk không báo FAIL vì không đo tràn trong khối TeX của mẹo.
- Sửa: bỏ tên ở đầu dòng cuối để hai dòng kết quả cùng dạng (tên hai kết quả đã có trong `text`: "Với 12 và 18: ƯCLN là 6, BCNN là 36."). `tex`: `\begin{aligned} 12 &= 2^{2} \cdot 3 \\ 18 &= 2 \cdot 3^{2} \\ 2 \cdot 3 &= \concept{amber}{6} \\ 2^{2} \cdot 3^{2} &= \concept{pink}{36} \end{aligned}`. Chụp lại ảnh điện thoại để chắc không tràn.

## Nên sửa

### 1. `whyItMatters` rút gọn mất điều kiện "số bút bằng số vở": "để chia vừa đủ" không rõ chia gì cho ai

- Vị trí: `$.overview.whyItMatters`; LL-10, LL-20
- Nguồn: —
- Vấn đề: bản sửa thêm "ít nhất" nhưng bỏ điều kiện số bút bằng số vở. Bé đọc không biết vì sao lại cần bội chung. Đây là câu nối bài với đời sống, đọc ngay đầu bài.
- Sửa (một câu, 25 âm tiết): "Bội chung nhỏ nhất giúp bạn mua ít nhất số bút vỉ 6 cái và vở xếp 8 quyển mà số bút bằng số vở." Câu ôn `mua-but-vo-5-8` dùng 5 và 8 nên không trùng.

### 2. Cặp 6 và 10 (BCNN 30) lặp ở năm chỗ, hai trong số đó là câu kiểm tra

- Vị trí: `$.exercises[5]` (`ex.chon-bcnn-6-10`, câu kiểm tra section 2); cùng cặp và cùng đáp số ở `ex.bcnn-tu-ucln-6-10` (câu kiểm tra section 5), hình mở đầu `visual.den-6-10` của section 9, `ex.rang-6-10` (câu kiểm tra section 10), lời giải `chon-quy-dong-1-6-3-10`; LL-07
- Nguồn: —
- Vấn đề: tới section 5 và section 10, bé nhớ số 30 chứ không làm phép tính, nên câu kiểm tra không còn đo được bé đã hiểu cách mới chưa. Nhiễu 16, 60 của hai câu kiểm tra cũng giống nhau.
- Sửa: đổi `chon-bcnn-6-10` sang 4 và 22, id `ex.chon-bcnn-4-22`. Đề "Bội chung nhỏ nhất của 4 và 22 là số nào?", lựa chọn 26, 44, 88, 132, đáp án 44, `check.expr` "44". Chỉ 44 đúng: 26 không chia hết cho 4, còn 88 và 132 là bội chung nhưng lớn hơn. `explain`: "Bội của 22 là 22, 44. Số 22 chia cho 4 còn dư 2, số 44 chia hết cho 4, nên BCNN(4, 22) = 44." với tex `\begin{gathered} 22 \khongchiahet 4 \\ \concept{pink}{44} \chiahet 4 \end{gathered}`. `wrong`: 26 "26 là tổng 4 + 22, mà 26 chia cho 4 còn dư 2."; 88 và 132 "Là bội chung nhưng chưa nhỏ nhất, vì 44 cũng là bội chung và nhỏ hơn." Số 22, 44, 88, 132 chưa có ở đâu trong bài. Không bắt buộc: hình `den-6-10` có thể đổi sang 4 và 6 giây (BCNN 12), caption theo số mới.

### 3. Câu ôn `chon-cap-bcnn-la-so-lon` có lựa chọn "4 và 12", trùng ví dụ của màn quy tắc và recap section 4

- Vị trí: `$.exercises[17].options[0]` (`ex.chon-cap-bcnn-la-so-lon`); hình `visual.so-lon-12-4` (`$.sections[3].blocks[1].children[1]`, `$.sections[3].recap`, `$.cards[3].recap`); LL-07
- Nguồn: —
- Vấn đề: recap bé xem ngay trước câu ôn là "12 ⋮ 4, BCNN(4, 12) = 12". Bé chọn "4 và 12" vì nhớ hình, không cần kiểm phép chia.
- Sửa: đổi lựa chọn a thành "8 và 24". `explain.text`: "Có 24 chia hết cho 8 và 18 chia hết cho 6.", tex `\begin{gathered} 24 \chiahet 8 \\ 18 \chiahet 6 \end{gathered}`. Tập đáp án vẫn là {a, c}.

### 4. Caption mở đầu section 1 đọc thành "phút nào xe A cũng rời bến"

- Vị trí: `$.sections[0].blocks[0].caption` (`visual.xe-6-8`); LL-10
- Nguồn: —
- Vấn đề: "Mỗi phút xe A rời bến là một bội của 6" muốn nói "mỗi phút mà xe A rời bến", nhưng "mỗi phút" thường hiểu là "cứ mỗi phút". Câu này trái với "cứ 6 phút một chuyến" ngay trên hình.
- Sửa: "Các phút xe A rời bến là các bội của 6, các phút xe B rời bến là các bội của 8. Các phút 24 và 48 có ở cả hai hàng."

### 5. Section 1 nói "Từ giờ ta chỉ xét các bội chung khác 0", màn kế tiếp viết BC(6, 8) = {0; 24; …}

- Vị trí: `$.sections[0].blocks[3].children[0].text`; so với `$.sections[1].blocks[1].children[1]` và hình `ky-hieu-6-8`; LL-05
- Nguồn: tr.108 lời giải 2.44 (BC có số 0)
- Vấn đề: hai màn liền nhau nói trái nhau: màn trước bảo bỏ số 0, màn sau lại có số 0 trong danh sách bội chung (đúng theo lời giải sách). Bé không biết 0 còn là bội chung không. Nhóm 1 xếp Góp ý. Tổng hợp nâng lên Nên sửa vì đây là mâu thuẫn giữa hai màn dạy, đúng loại mà Tổng hợp phải bắt.
- Sửa (2 câu, 15 và 11 âm tiết): "Số 0 chia hết cho mọi số khác 0, nên 0 cũng là bội chung. Khi tìm bội chung nhỏ nhất, ta không tính số 0." Câu này khớp câu quy tắc section 2 ("Trong các bội chung khác 0…").

### 6. Mẹo "Bắt lỗi kết quả BCNN": ví dụ `tex` không nối với chữ, và chữ "Kết quả" nói chung chung

- Vị trí: `$.sections[6].blocks[3]` (`tip.kiem-chia-het`); LL-15, LL-24
- Nguồn: —
- Vấn đề: `text` nói về 6, 8, 9 (144 và 72), còn `tex` là "24 ⋮ 4, 24 ⋮ 6, 24 ⋮̸ 9" (ảnh `phone/095`). Không câu nào nói 24 là kết quả ai đó tính cho 4, 6 và 9, nên bé không biết ba phép kiểm này kiểm cái gì. Chữ "Kết quả" mà áp cho mọi đáp số thì báo sai cả đáp số đúng của bài xếp hàng còn dư ở section 11 (49 bạn không chia hết cho 3 hay 4).
- Sửa: `text` (3 câu: 18, 17, 23 âm tiết): "Nếu ai đó tính BCNN(4, 6, 9) = 24 thì sai, vì 24 không chia hết cho 9. BCNN tìm được không chia hết cho một trong các số đã cho thì chắc chắn sai. Chia hết cho mọi số vẫn chưa chắc là BCNN: 144 cũng chia hết cho 6, 8 và 9, nhưng BCNN là 72." Giữ `tex`.

### 7. Section 9: mọi ví dụ và câu luyện đều ra 60 phút, nên đoán được đáp số bằng cách "cộng 1 giờ"

- Vị trí: hình `bus-15-20`, `tin-nhan-10-15-20`, `bao-thuc-goi-y`, `bao-thuc-giai`; `$.exercises[43]` (`ex.bao-thuc-20-30`, câu luyện); LL-14
- Nguồn: tr.42 bài 2.49, lời giải tr.109 (sách ra 180 phút = 3 giờ)
- Vấn đề: bốn tình huống hỏi giờ đều có BCNN = 60. Bé ra 8 giờ chỉ bằng cách cộng 1 vào 7, không cần tìm BCNN, và không phải tập đổi phút ra giờ, là việc mà mẹo `hoi-gio` vừa nhắc.
- Sửa: đổi câu luyện sang 20 phút và 45 phút, cùng reo lúc 6 giờ. BCNN(20, 45) = 2² · 3² · 5 = 180 phút = 3 giờ, đáp số 9 (giờ). Id `ex.bao-thuc-20-45`, `check.expr` `6+180:60`. Sửa `explain` và hình `bao-thuc-giai` theo số mới (hàng "180 phút bằng 3 giờ", "6 + 3 = 9"). Giữ nấc 2 `bao-thuc-goi-y` (số khác đề, dừng ở "?").

### 8. Ba câu thực chất là cùng một bài BCNN(8, 12) = 24

- Vị trí: `$.exercises[42]` (`ex.bus-8-12`, câu kiểm tra section 9), `$.exercises[44]` (`ex.xe-6-8-12`, kho ôn card `lap-lai`), `$.exercises[33]` (`ex.bcnn-3-8-12`, kho ôn card `bcnn-ba-so`); liên quan `ex.chon-bc-4-6-8`, `ex.tim-loi-bcnn-3-4-8` (cũng ra 24); LL-07
- Nguồn: —
- Vấn đề: thêm 6 hay 3 vào cặp 8 và 12 không đổi gì (6 và 3 đều là ước của 12), nên cả ba câu ra đúng 24. Kho ôn có năm câu cùng ra 24, bé nhớ số 24 thay vì làm. Hai câu ba số này cũng không luyện ý mới của section 7 (thừa số chỉ có ở một số vẫn được lấy).
- Sửa: `xe-6-8-12` đổi sang 4, 10 và 14 phút: BCNN = 2² · 5 · 7 = 140, id `ex.xe-4-10-14`. Tổng hợp không lấy 6, 9 và 12 (BCNN 36) như nhóm 2 đề xuất, vì 36 đã lặp ở `mau-chung-9-12`, `xe-9-12`, mẹo `chon-cong-cu`, `chung-rieng`. `bcnn-3-8-12` đổi sang 3, 8 và 10: BCNN = 2³ · 3 · 5 = 120 (3 chỉ có ở 3, 5 chỉ có ở 10), id `ex.bcnn-3-8-10`. Sửa `check.expr`, `explain` theo số mới.

### 9. Note mẫu "tìm số còn lại" không có câu dẫn và không viết theo cách của câu luyện

- Vị trí: `$.sections[4].blocks[2].children[2]` (`section.ucln-nhan-bcnn`); câu luyện `$.exercises[21]` (`ex.tim-b-8-4-24`); LL-16
- Nguồn: tr.43 bài 2.51
- Vấn đề: note nằm cuối khối "Cùng làm: … BCNN(9, 15)" và hiện ngay khi hình `lines-9-15` còn "?" (ảnh `phone/069`). Không câu nào báo đây là dạng ngược lại. Note viết bằng chữ ("một số là 6", "số kia"), còn câu luyện ngay sau viết "ƯCLN(a, b) = 4 … Biết a = 8, tìm b". Bé chậm khó nhận ra note là mẫu của câu luyện (độ khó 3).
- Sửa: note (18 âm tiết): "Ngược lại, biết ƯCLN(a, b) = 2, BCNN(a, b) = 42 và a = 6 thì tìm được b." Thêm khối `formula`: `\begin{gathered} a \cdot b = \concept{amber}{2} \cdot \concept{pink}{42} = 84 \\ b = 84 : 6 = 14 \end{gathered}`. Không thêm màn.

### 10. Section 8 không có ví dụ đời sống trên màn dạy

- Vị trí: `$.sections[7].blocks[0].caption` (hình `nhan-6-8`, `section.bc-tu-bcnn`); LL-16
- Nguồn: —
- Vấn đề: cả ba màn chỉ có phép nhân và màn chạm số. Cặp 6 và 8 của hình chính là hai xe ở đầu bài, nhưng caption không nối lại.
- Sửa: thêm vào cuối caption (17 âm tiết): "Như hai xe ở đầu bài: sau 24, 48, 72 phút hai xe lại cùng rời bến."

### 11. Hình gợi ý `rang-goi-y-4-6` có bánh 6 răng quay 2 vòng, trong khi câu luyện hỏi bánh 6 răng (đáp số 3)

- Vị trí: `$.exercises[48].hints.hintVisualId` (`ex.rang-9-6-vong`), spec `rang-goi-y-4-6` trong `catalog.ts`; LL-15, LL-02
- Nguồn: —
- Vấn đề: câu hỏi bánh B 6 răng quay mấy vòng (đáp số 3). Nấc 2 giải trọn với bánh 4 răng và 6 răng, có thẻ "Bánh 6 răng quay 2 vòng" và "Bánh 4 răng quay 3 vòng". Bé dò theo chữ "6 răng" sẽ chép 2 (sai dù đã làm theo gợi ý), hoặc chép số 3 của dòng kia mà không hiểu. Ví dụ dùng chung số với đề và có kết quả trùng đáp số thì không còn là "số khác đề".
- Sửa: đổi sang 16 răng và 20 răng: BCNN(16, 20) = 80, "Sau 80 răng"; 80 : 16 = 5, "Bánh 16 răng quay 5 vòng"; 80 : 20 = 4, "Bánh 20 răng quay 4 vòng". Đổi key thành `rang-goi-y-16-20` và `hintVisualId` theo. Không dùng 8 và 14 như nhóm 3 đề xuất, vì BCNN 56 đã là đáp số của `dien-bc-56`.

### 12. Ví dụ của mẹo `hang-con-du` không cho thấy cái bẫy mà mẹo giúp tránh

- Vị trí: `$.sections[10].blocks[3].tex`, `.text` (`tip.hang-con-du`); LL-24, LL-16
- Nguồn: tr.43 bài 2.50, lời giải tr.109
- Vấn đề: `tex` "36 + 1 = 37; 48 + 1 = 49" lấy lại đúng số của màn cùng làm (khoảng 40 đến 55), nơi cách làm sai (chọn 48 trong khoảng rồi cộng 1) cũng ra 49. Ví dụ không có khoảng, nên bé không thấy vì sao phải cộng trước rồi mới chọn.
- Sửa: thêm câu thứ ba vào `text` (24 âm tiết): "Ví dụ hàng 3, hàng 4 đều dư 1 và lớp có từ 37 đến 48 bạn: lớp có 37 bạn, không phải 49." Giữ `tex` như cũ.

### 13. Giải thích hai câu quy đồng bỏ bước "lấy mẫu số chung chia cho mẫu số" vừa thêm vào câu quy tắc

- Vị trí: `$.exercises[59].explain` (`ex.tu-moi-5-12-7-18`), `$.exercises[60].explain` (`ex.chon-quy-dong-1-6-3-10`); LL-05
- Nguồn: lời giải tr.109 bài 2.52
- Vấn đề: câu quy tắc mới nói "Lấy mẫu số chung chia cho mẫu số mỗi phân số, rồi nhân… với thương". Nhưng `tu-moi-5-12-7-18` giải thích "Mẫu số 18 nhân với 2 thì được 36" (bé phải tự đoán ra 2), còn `chon-quy-dong-1-6-3-10` không nói 5 và 3 từ đâu ra.
- Sửa (mỗi câu dưới 25 âm tiết, tối đa 3 câu):
  - `tu-moi-5-12-7-18`: "Mẫu số chung nhỏ nhất là BCNN(12, 18) = 36. Ta có 36 : 18 = 2, nên nhân cả tử số lẫn mẫu số của phân số thứ hai với 2. Tử số mới là 7 · 2 = 14."
  - `chon-quy-dong-1-6-3-10`: "BCNN(6, 10) = 30. Ta có 30 : 6 = 5 và 30 : 10 = 3. Nhân cả tử số lẫn mẫu số của phân số thứ nhất với 5, của phân số thứ hai với 3." Giữ `tex`.

### 14. Câu kiểm tra section 12 và câu ôn section 13 cùng tính BCNN(9, 12) = 36 bằng một lời giải

- Vị trí: `$.exercises[58]` (`ex.mau-chung-9-12`, câu kiểm tra section 12), `$.exercises[66]` (`ex.xe-9-12`, kho ôn card `ucln-hay-bcnn`); LL-07
- Nguồn: —
- Vấn đề: cùng cặp, cùng đáp số 36, `explain` gần như trùng chữ. Số 36 còn có ở mẹo `chon-cong-cu`, hình `doi-chieu-12-18`, `quy-dong-giai`.
- Sửa: đổi `xe-9-12` sang 15 phút và 25 phút: 15 = 3 · 5, 25 = 5², BCNN = 3 · 5² = 75. Id `ex.xe-15-25`, `check.expr` "75", `explain` và `tex` theo số mới. Số 75 chưa có trong bài.

### 15. Câu quy tắc section 11 nói "Nếu đề có số dư", còn mẹo cùng section đòi "dư cùng một số"

- Vị trí: `$.sections[10].blocks[1].children[0]` (note `rule`), `$.sections[10].recap.caption`, `$.cards[10].recap.caption`; so với `tip.hang-con-du`; LL-05
- Nguồn: tr.43 bài 2.50 (mọi hàng cùng thừa một người)
- Vấn đề: cùng một cách làm mà câu quy tắc và mẹo nói hai điều kiện khác nhau. Câu quy tắc thiếu điều kiện thì sai khi các hàng dư khác nhau. Bài chưa có câu nào như vậy, nhưng bé thuộc câu quy tắc chứ không thuộc mẹo. Nhóm 3 xếp Góp ý. Tổng hợp nâng lên Nên sửa vì đây là một quy tắc nói hai cách trong cùng section.
- Sửa: thay câu 2 của câu quy tắc, recap section và recap card (25 âm tiết): "Nếu mọi hàng đều dư cùng một số, ta cộng số dư đó vào từng bội trước khi chọn số nằm trong khoảng đề cho."

### 16. Section 12 dùng lẫn "mẫu" và "mẫu số"

- Vị trí: caption `$.sections[11].blocks[0].children[1].caption` ("Hai phân số có mẫu 4 và 6"), note cùng làm section 12 ("hai phân số có mẫu 6 và 8"), đề `ex.mau-chung-8-12` ("có mẫu là 8 và 12"); câu quy tắc section 12 và các `explain` dùng "mẫu số"; LL-05
- Nguồn: glossary `content/glossary/math.json` (thuật ngữ "mẫu", "mẫu số chung", "quy đồng mẫu số")
- Vấn đề: vòng 1 (Nên sửa 21) đã nêu, câu quy tắc đã sửa sang "mẫu số", nhưng ba chỗ trên vẫn viết "mẫu". Trong cùng một section, một khái niệm có hai tên.
- Sửa: đổi ba chỗ "có mẫu" thành "có mẫu số". Không bắt buộc: Bài 11 và glossary dùng "tử", "mẫu"; có thể thêm "tử số", "mẫu số" vào glossary làm tên khác cho thống nhất giữa hai bài.

## Góp ý

### 1. `chon-bc-4-15-nho-hon-200`: điều kiện "nhỏ hơn 200" không loại lựa chọn nào

- Vị trí: `$.exercises[13]` (`ex.chon-bc-4-15-nho-hon-200`); LL-14
- Vấn đề: cả bốn lựa chọn đều nhỏ hơn 200, nên điều kiện chỉ làm đề dài thêm.
- Sửa: thay lựa chọn 90 bằng 240 (bội chung nhưng không nhỏ hơn 200), đáp án vẫn là 60, 120, 180; thêm `wrong` "240 là bội chung nhưng không nhỏ hơn 200."

### 2. `xep-liet-ke-4-6`: bước "chọn số nhỏ nhất" chỉ có một số để chọn

- Vị trí: `$.exercises[14].items` (`ex.xep-liet-ke-4-6`); LL-07
- Vấn đề: danh sách dừng ở 16 và 18 nên chỉ có số chung 12. Bước "Chọn số nhỏ nhất trong các số đó: 12" lặp lại bước trước.
- Sửa: kéo danh sách tới 24. s1 "Viết các bội của từng số: 4, 8, 12, 16, 20, 24 và 6, 12, 18, 24", s2 "Tìm các số có ở cả hai danh sách: 12 và 24", s3 "Chọn số nhỏ nhất trong các số đó: 12". Thứ tự đúng vẫn chỉ có một.

### 3. Ví dụ đời sống của section 3, 4 nằm cuối caption xám, trên điện thoại bị thanh nút che

- Vị trí: `$.sections[2].blocks[0].caption` (`visual.ds-4-10`), `$.sections[3].blocks[0].caption` (`visual.ds-5-15`); ảnh `phone/039`, `040`, `055`, `056`; LL-16, LL-12
- Sửa: tách câu đời sống thành `note` đứng trước hình, vd "Đèn A cứ 4 giây nháy, đèn B cứ 10 giây nháy. Hai đèn lại cùng nháy lần đầu ở giây nào?", để caption chỉ còn hai câu về danh sách.

### 4. Màn cùng làm `gap-3-4`: dòng kết quả nằm dưới mép màn điện thoại, ô đếm thiếu đơn vị

- Vị trí: `$.sections[1].blocks[3]` (`visual.gap-3-4`); `meet-try.tsx` (`NumberStepper` `label`); ảnh `phone/029`
- Sửa: rút note (2 câu: 20 và 12 âm tiết): "Cùng làm: xe A cứ 3 phút, xe B cứ 4 phút một chuyến, cùng xuất phát lúc 0 phút. Bấm + tới khi hai xe lại cùng rời bến lần đầu tiên." Nhãn ô đếm thêm đơn vị ("1 chuyến"): việc của app, báo người làm app.

### 5. Chữ nhỏ trong lời giải section 2–4

- `$.exercises[15].explain.wrong` (`ex.bcnn-7-21`): thêm lý do cho nhiễu 28: "28 chia hết cho 7 nhưng chia cho 21 còn dư 7."
- `$.exercises[4]` (`ex.khong-la-bc-4-9`): đề viết "không phải bội chung", `explain.text` viết "không là bội chung". Dùng một cách ("không phải") để bé đọc khớp đề.

### 6. Màu `slate` của khái niệm quy đồng mẫu số trùng màu thẻ trung tính

- Vị trí: `$.concepts[5]` (`concept.quy-dong-mau-so`, `color: "slate"`); `catalog.ts` dùng slate cho các thẻ trung tính ("Nhân hai số", "60 phút bằng 1 giờ", "Bánh A quay 2 vòng"); glossary dùng slate cho "số chẵn", "cộng với 0"
- Sửa: chọn cho khái niệm quy đồng một màu chưa có nghĩa trong glossary và ghi màu đó vào thuật ngữ "quy đồng mẫu số" của glossary; hoặc bỏ màu của khái niệm này vì bài không tô nó ở đâu.

### 7. Nấc 1 tô cả đề hai khối

- Vị trí: `.hints.highlight` của `$.exercises[3]` (`dem-lan-gap-5-10`), `[9]` (`den-nhay-2-7`), `[12]` (`mua-but-vo-5-8`), `[18]` (`chuong-17-51`)
- Sửa: chỉ tô khối dữ kiện (`index: 0`) có hai khoảng thời gian; riêng `dem-lan-gap-5-10` tô khối câu hỏi (`index: 1`), vì lỗi hay gặp là đếm cả phút 0 hay bỏ phút 30.

### 8. Câu 2 của mẹo "Tìm BCNN từ ƯCLN" mơ hồ, `tex` có dấu phẩy sát số

- Vị trí: `$.sections[4].blocks[3]` (`tip.tim-bcnn-nhanh`); LL-10, LL-21
- Vấn đề: "số phải nhân nhỏ hơn" không nói nhỏ hơn cái gì. `tex` "12 : 6 = 2,  2 · 18 = 36" có dấu phẩy ngay sau 2, dễ đọc thành số thập phân.
- Sửa: câu 2: "Như vậy ta nhân 2 · 18 thay cho 12 · 18, dễ tính hơn." `tex`: `\begin{gathered} 12 : \concept{amber}{6} = 2 \\ 2 \cdot 18 = \concept{pink}{36} \end{gathered}`.

### 9. Lời giải `xe-16-24` bắt bé nhân 16 · 24 = 384 ngay sau mẹo chia trước

- Vị trí: `$.exercises[22].explain` (`ex.xe-16-24`)
- Sửa: "Số phút cần tìm là BCNN(16, 24). Chia 16 cho ƯCLN là 8 được 2, rồi nhân 2 với 24." `tex`: `\begin{gathered} 16 : \concept{amber}{8} = 2 \\ 2 \cdot 24 = \concept{pink}{48} \end{gathered}`.

### 10. Màn quy tắc section 7: ví dụ chỉ là phép kiểm chia hết, không minh hoạ ý mới

- Vị trí: `$.sections[6].blocks[1].children[1]` (formula)
- Vấn đề: khối "60 ⋮ 4, 60 ⋮ 6, 60 ⋮ 10" chỉ cho thấy 60 là bội chung, đúng phép kiểm mà mẹo cùng section nói là "chưa chắc là BCNN". Khối này không minh hoạ ý "thừa số chỉ có ở một số vẫn được lấy".
- Sửa: formula thành `2^{2} \cdot 3 \cdot 5 = \concept{pink}{60}` và thêm note "Số 5 chỉ có ở 10 nhưng vẫn được lấy."

### 11. `chon-bc-4-6-nho-hon-40` lặp số của màn chạm section 1

- Vị trí: `$.exercises[37]` (`ex.chon-bc-4-6-nho-hon-40`); hình `chon-bc-4-6` (`$.sections[0].blocks[2]`); LL-07
- Vấn đề: cùng cặp 4 và 6, cùng các số 12, 18, 24 như màn chạm ở section 1.
- Sửa: đổi sang 4 và 13, nhỏ hơn 120, id `ex.chon-bc-4-13-nho-hon-120`: lựa chọn 52, 76, 104, 156, đáp án 52, 104. `wrong`: 76 "76 chia hết cho 4 nhưng không chia hết cho 13."; 156 "156 là bội chung nhưng không nhỏ hơn 120." Các số này chưa có trong bài. Không lấy 3 và 10 như nhóm 2 đề xuất, vì 30, 60, 90 lặp với cặp 6 và 10.

### 12. Nhiễu yếu và thiếu lý do `wrong` ở section 5, 8

- Vị trí: `$.exercises[41].bank` (`ex.dien-boi-cua-bcnn`, "thương"); `$.exercises[24].explain.wrong` (`ex.tich-150-ucln-5`, lựa chọn c "155"); LL-14
- Sửa: thay "thương" bằng "ước chung". Thêm `wrong` cho c: "155 là tổng 150 + 5, không dùng để tìm BCNN."

### 13. `hang-2-3-5-du-1`: giải thích chỉ cộng số dư vào một bội

- Vị trí: `$.exercises[54].explain.text` (`ex.hang-2-3-5-du-1`)
- Sửa: "…nên là bội của BCNN(2, 3, 5) = 30. Cộng 1 vào các bội 30, 60 được 31, 61; chỉ 31 nằm trong khoảng từ 20 đến 40."

### 14. `mau-chung-9-12`: khối đề đầu kết thúc bằng một câu hỏi không được hỏi

- Vị trí: `$.exercises[58].prompt[0]`; LL-10
- Sửa: "Mai ăn một phần chín chiếc bánh, Lan ăn một phần mười hai chiếc bánh. Muốn biết hai bạn ăn tất cả bao nhiêu phần chiếc bánh, ta cộng hai phân số."

### 15. `chon-quy-dong-1-6-3-10`: nhiễu d chưa có `wrong`

- Vị trí: `$.exercises[60].explain.wrong` (lựa chọn d)
- Sửa: thêm "Một phần sáu nhân cả tử số lẫn mẫu số với 5 được năm phần ba mươi, không phải sáu phần ba mươi."

### 16. Hình recap section 11 chỉ minh hoạ nửa đầu câu quy tắc

- Vị trí: `$.sections[10].recap.visualId`, `$.cards[10].recap.visualId` (`so-4-6-xong`)
- Sửa: dùng bản tĩnh của `hang-3-4` (vd `hang-3-4-xong`) làm hình recap, hoặc thêm vào `so-4-6-xong` một hàng ví dụ có dư.

### 17. `chon-bcnn-nhieu`: giải thích gọi "hai xe buýt" mà lựa chọn ghi "Hai xe"; cặp 10 và 15 lặp lại

- Vị trí: `$.exercises[64].explain.text`, `$.exercises[64].options[2]`; LL-07
- Sửa: giải thích viết "…hai đèn nháy và hai xe rời bến."; lựa chọn c đổi sang cặp khác, vd "Hai xe rời bến mỗi 12 và 16 phút. Sau bao lâu lại cùng rời bến?" (chỉ phân loại, không cần tính).

### 18. Ba câu của card `so-trong-khoang` cùng dùng 5 và 6

- Vị trí: `ex.chon-ba-chu-so-5-6` (kiểm tra), `ex.hang-5-6-du-2` (luyện), `ex.chon-5-6-giua-50-100` (kho ôn); LL-07
- Vấn đề: vòng 1 (Góp ý 13) đã nêu, còn nguyên. Đáp án 60, 90 của câu ôn nằm sẵn trong lời giải câu kiểm tra. Đề câu ôn viết "nằm giữa 50 và 100", giải thích viết "từ 50 đến 100".
- Sửa: đổi câu ôn sang 3 và 11, id `ex.chon-3-11-tu-50-den-100`: "Chọn tất cả các số chia hết cho cả 3 và 11, từ 50 đến 100." Lựa chọn 33, 66, 77, 99, đáp án 66, 99. `wrong`: 33 "33 là bội chung nhưng nhỏ hơn 50."; 77 "77 chia hết cho 11 nhưng chia cho 3 còn dư 2." Giải thích dùng "từ… đến…" như đề. Không lấy 6 và 14 như nhóm 3 đề xuất, vì đó chính là cặp của note mẫu section 5 (BCNN 42).

### 19. Mẹo `chon-cong-cu` không nói gì về bài có số dư

- Vị trí: `$.sections[12].blocks[2].text` (`tip.chon-cong-cu`)
- Vấn đề: với `hang-5-6-du-2`, số cần tìm (62) không chia hết cho 5 và 6, nên bé không xếp được bài vào vế nào. Mẹo không sai, chỉ thiếu.
- Sửa: khi viết lại mẹo theo Nghiêm trọng 1, nếu còn chỗ trong giới hạn 25 âm tiết thì thêm vào vế BCNN "(bớt số dư trước nếu có)".

### 20. Bộ giải của validator `gap-nhau` không bị chặn bởi khoảng bấm

- Vị trí: `src/visuals/math/boi-chung-boi-chung-nho-nhat/logic.ts` (`solveMeet`, `ROUND_RANGE`)
- Vấn đề: validator đúng với bài này (mọi cặp cần tối đa 5 vòng). Nhưng một bài sau dùng cặp có số vòng quá 12 (vd 7 và 13) sẽ không làm được mà `content:check` không báo.
- Sửa (việc của app): thêm vào test hay lint một phép kiểm "`solveMeet(params)` nằm trong `ROUND_RANGE`" cho mọi bài `manipulate` dùng `gap-nhau`.

## Mẹo đã thử (tóm tắt)

| Mẹo | Số đã thử | Kết quả |
|---|---|---|
| `boi-so-lon` (S3), lời hiện tại | (9, 6), (1, 7), (5, 5), (4, 12), (7, 5), (12, 16), (17, 51), (6, 10), (9, 12); ba số (3, 8, 12), (6, 9, 15), (5, 6, 10), (6, 8, 12), (2, 3, 4) | Đúng với mọi cặp; sai với cả 5 bộ ba (12, 30, 10, 12, 4 thay vì 24, 90, 30, 24, 12) (Nghiêm trọng 2) |
| `boi-so-lon`, lời đề xuất | 5 bộ ba trên, (4, 6, 10), và mọi cặp trên | Đúng hết: 24, 90, 30, 24, 12, 60 |
| `tim-bcnn-nhanh` (S5) | (12, 18), (9, 15), (6, 10), (16, 24), (7, 21), (5, 8), (4, 4), (1, 9), (10, 25), (14, 21), (7, 9) | Đúng; câu 2 mơ hồ (Góp ý 8) |
| `chung-rieng` (S6) | (12, 18), (20, 30), (18, 24), (14, 35), (16, 20), (7, 11), (8, 8), ba số (6, 9, 15) | Đúng; `tex` bị cắt trên điện thoại (Nghiêm trọng 5) |
| `kiem-chia-het` (S7) | (2, 3, 4) với 6, 12, 24; (3, 4, 8) với 12; (6, 8, 9) với 144; (6, 9, 15) với 45, 180; (4, 6, 9) với 24; số 0; (1, 5) với 5 | Đúng; chữ "Kết quả" áp cho đáp số bài còn dư thì báo sai (Nên sửa 6) |
| `hoi-gio` (S9) | 60 phút từ 6, 7, 9 giờ; 90 phút từ 6 giờ; 180 phút từ 9 giờ (sách 2.49); 24 phút từ 6 giờ | Đúng với mọi bài của bài học (giờ bắt đầu đều tròn giờ) |
| `hang-con-du` (S11) | 3, 4 dư 1 trong 40–55 và 37–48; 5, 6 dư 2 trong 31–61 và 50–70; 2, 3, 5 dư 1 trong 20–40; 5, 6, 8 dư 1 trong 400–500 (sách 2.50); 4, 6 dư 3 trong 10–20 | Đúng ở mọi đầu vào; ví dụ chưa cho thấy cái bẫy (Nên sửa 12) |
| `chon-cong-cu` (S13) | `chon-dang-24-40`, `chia-30-45`, `chon-bcnn-nhieu`, `xe-9-12`, `rang-9-6-vong`, `bao-thuc-20-30`, `mau-chung-*`, `xe-10-15-100`, hai số bằng nhau | Chọn đúng công cụ ở mọi dạng; câu 1 thiếu "lớn nhất" (Nghiêm trọng 1); bài còn dư không khớp vế nào (Góp ý 19) |
