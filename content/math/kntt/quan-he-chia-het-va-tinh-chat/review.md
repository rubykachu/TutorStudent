# Review: Quan hệ chia hết và tính chất (`quan-he-chia-het-va-tinh-chat`)

- Bài: `content/math/kntt/quan-he-chia-het-va-tinh-chat/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/quan-he-chia-het-va-tinh-chat/` - sbt-p30, sbt-p31, sbt-p32, sbt-p104, sbt-p105
- `content:check`: 0 lỗi, 1 cảnh báo của bài (103 id chưa khoá, đúng với bài draft)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/quan-he-chia-het-va-tinh-chat/`
- Kết luận: Chưa đạt: còn 3 lỗi Nghiêm trọng
- Bản đã review: `12b2732c0d263c5ef5a73e6cbde242d97df5c1b73f373d6ea7bb770f3d06de35` (`pnpm content:diff` so với bản này)

Ba reviewer và tổng hợp đã tự giải cả 68 bài tập trước khi đọc `answer` (câu kiểm tra `hieu-20-7-5`, `$.exercises[48]`, nằm ngoài phạm vi ghi của ba nhóm, tổng hợp tự giải: 20 − 7 = 13 không chia hết cho 5, đáp án a đúng và duy nhất): mọi đáp án đúng và duy nhất, không nhiễu nào cũng đúng, các câu "chọn tất cả" đủ tập đáp án. Các chỗ vòng 1 yêu cầu sửa đã soát lại: không còn chữ `m` trong bài; sáu quy tắc tính chất cùng khuôn "một số ... số đó", note, recap section và recap card khớp nguyên văn; hình `chia-du-52-4` đã viết `53 = 4 · 13 + 1`; câu "Số 0 cũng là bội của mọi số khác 0" đã có "khác 0"; id đổi tên không còn tham chiếu cũ trong `src/`, `content/`, `tests/`, `scripts/`.

Tổng hợp nâng hai mục reviewer nhóm 1 xếp Nên sửa lên Nghiêm trọng (mục 2, 3), lý do ghi trong từng mục.

## Nghiêm trọng

### 1. Note "Số 1 và chính số đó luôn là ước của số đó" thiếu "khác 0" và không có chủ ngữ trên màn

- Vị trí: `$.sections[4].blocks[3].children[0].text` (`section.tim-uoc`, `phone/056-s5-04-block.png`) - LL-17, LL-10
- Nguồn: tr.30 (`sbt-p30.png`, "Cho hai số tự nhiên a và b (b ≠ 0)")
- Vấn đề: chữ "luôn" làm trẻ nhớ thành quy tắc cho mọi số, nhưng 0 không là ước của 0. Vòng 1 xếp đúng kiểu lỗi này ở câu "Số 0 cũng là bội của mọi số" vào Nghiêm trọng và bài đã sửa ở đó, câu này thì chưa, nên hai câu "luôn là ước/bội" của hai section liền nhau lệch nhau về điều kiện. Màn đứng riêng, "số đó" không trỏ về số nào (ví dụ 30 nằm dưới), trẻ đọc câu một mình thấy vòng vo.
- Sửa: "Mọi số khác 0 đều có ước là 1 và ước là chính nó. Ví dụ 30 có ước 1 và ước 30." (giữ công thức `30 = 1 · 30`). Không viết "có hai ước là 1 và chính nó" như bản nhóm đề xuất: số 1 chỉ có một ước.

### 2. Note "Từ một phép nhân ta tìm được hai ước" sai khi hai thừa số bằng nhau, và nói khác quy tắc `tim-uoc`

- Vị trí: `$.sections[3].blocks[2].children[0].text` (`section.uoc-boi`, `phone/041-s4-02-block.png`) - LL-17, LL-05
- Nguồn: tr.30 mục A ý 2 (`sbt-p30.png`)
- Vấn đề: câu khẳng định chung mà sai toán học: 16 = 4 · 4 chỉ cho một ước là 4, và section ngay sau cho trẻ chạm đúng các ước của 16 (`cham-uoc-16`), nên trẻ áp câu này dễ đếm 4 hai lần hay đi tìm "ước thứ hai". Cùng một ý còn có hai cách nói: note này nói "tìm được hai ước", quy tắc `tim-uoc` nói "Mỗi thừa số trong các tích là một ước". Nâng từ Nên sửa lên Nghiêm trọng theo checklist trục 2 (câu quy tắc sai toán học), cùng mức với câu "Số 0 cũng là bội của mọi số" ở vòng 1.
- Sửa: "Trong một phép nhân, mỗi thừa số là một ước của tích. Ví dụ 24 = 6 · 4 nên 6 và 4 đều là ước của 24." (cùng cụm "mỗi thừa số ... là một ước" với quy tắc `tim-uoc`).

### 3. Ví dụ "52 quyển vở chia đều cho 4 tổ" viết thành 52 = 4 · 13, ngược quy ước phép nhân của bài

- Vị trí: `$.sections[2].blocks[3].children[0].text` và hình `chia-du-52-4` (`$.sections[2].blocks[3].children[1]`, hàng `52 = 4 \cdot 13` trong `catalog.ts`) (`section.kiem-tra`, `phone/033-s3-04-block.png`) - LL-05
- Nguồn: tr.30 mục A ý 1 (`sbt-p30.png`)
- Vấn đề: bài chốt quy ước "n nhóm, mỗi nhóm m viết m · n" (`pitfalls.md`), và mọi câu chuyện khác đặt số chia là cỡ một nhóm (túi 3 cái, hộp 6 cái, túi 10 viên), nên "số bị chia bằng số chia nhân với thương" của section 1 khớp câu chuyện. Ví dụ này đổi số chia thành số nhóm: 4 tổ, mỗi tổ 13 quyển theo quy ước phải viết 13 · 4, nhưng hình ghi 4 · 13 (4 quyển lấy 13 lần). Trẻ vừa học số chia là số cái trong một túi gặp ngay một ví dụ mà số chia là số tổ, và phép nhân trên hình không đọc theo câu chuyện được. Nâng từ Nên sửa lên Nghiêm trọng: trái luật nội dung của `pitfalls.md`, cùng kiểu lỗi đã xếp Nghiêm trọng ở `phep-nhan-phep-chia` vòng 1. Câu "Nam chia đều được số bi cho 2 bạn" ở `so-du` cũng chia theo số người nhưng không viết phép nhân nào, không cần sửa.
- Sửa: đổi ví dụ sang chia theo nhóm có cỡ cố định như cả bài, vd "Ví dụ 52 quyển vở xếp thành các chồng 4 quyển thì được 13 chồng, không thừa quyển nào." Hình và recap giữ nguyên.

## Nên sửa

### 1. Kết quả ẩn của hình gợi ý nấc 2 trùng đúng đáp án của đề

- Vị trí: `$.exercises[1].hints.hintVisualId` (`ex.tinh-thua-26-6`, hình `chia-tui-goi-y-17-5`), `$.exercises[12].hints.hintVisualId` (`ex.tim-du-59-7`, hình `dem-cach-goi-y-7-38`) - LL-02
- Nguồn: —
- Vấn đề: hình dùng số khác đề và dừng ở "?", nhưng 17 = 5 · 3 + 2 cho số thừa 2 đúng bằng đáp án 26 = 6 · 4 + 2, và 38 − 35 = 3 đúng bằng đáp án 59 − 56 = 3. Trẻ điền xong "?" của hình là có số để gõ mà không làm với số của đề.
- Sửa: chọn số gợi ý có số dư khác đáp án, vd `chia-tui-goi-y-19-5` (19 = 5 · 3 + 4), `dem-cach-goi-y-7-37` (37 − 35 = 2); đổi id hình trong `hints`.

### 2. Hai nhiễu của `chon-goi-9-63` loại được bằng khớp chữ

- Vị trí: `$.exercises[19].options[2]`, `options[3]` (`ex.chon-goi-9-63`, card `uoc-boi`) - LL-14
- Nguồn: —
- Vấn đề: đề hỏi "số 9 là gì của 63?", hai nhiễu "Ước của 7", "Bội của 7" nói về 7 nên trẻ loại ngay bằng chữ "của 63", câu còn chọn giữa hai.
- Sửa: bốn lựa chọn cùng khuôn, vd "Ước của 63" (đúng), "Bội của 63", "Thương của phép chia", "Số bị chia"; hoặc đề "Trong phép chia hết 63 : 9 = 7, câu nào đúng?" với "9 là ước của 63", "9 là bội của 63", "63 là ước của 9", "9 là thương" (tránh "7 là ước của 63" vì cũng đúng).

### 3. Quy tắc tìm bội, tìm ước nói "của một số" mà không loại số 0

- Vị trí: `$.sections[5].blocks[1].children[0].text`, `$.sections[5].recap.caption`, `$.cards[5].recap.caption` (`tim-boi`); `$.sections[4].blocks[1].children[0].text`, `$.sections[4].recap.caption`, `$.cards[4].recap.caption` (`tim-uoc`) - LL-17
- Nguồn: tr.30 (`sbt-p30.png`, b ≠ 0)
- Vấn đề: "Muốn tìm các bội khác 0 của một số, nhân số đó lần lượt với 1, 2, 3" áp cho 0 chỉ ra 0, trái với chính chữ "bội khác 0"; câu tiếp theo lại nói "mọi số khác 0", nên trong cùng một note điều kiện có ở câu sau mà không có ở câu trước. Quy tắc tìm ước cũng vậy (0 viết thành tích theo vô số cách). Trẻ ít khi áp cho 0 nên không chặn, nhưng cần khớp với cách sửa Nghiêm trọng 1 để cả bài nói điều kiện "khác 0" một kiểu.
- Sửa: "Muốn tìm các bội khác 0 của một số khác 0, ..." và "Muốn tìm các ước của một số khác 0, ..." (sửa note, recap section, recap card cùng lúc theo `[rule-sentence]`).

### 4. Câu chuyện "12 cái bánh xếp đều vào các hộp" không có kết

- Vị trí: `$.sections[4].blocks[0].caption` (visual `tim-uoc-12`, `phone/052`, `053-s5-01-block*.png`) - LL-16
- Nguồn: —
- Vấn đề: caption mở tình huống xếp 12 cái bánh vào hộp nhưng hình chỉ kết ở dãy ước "1; 2; 3; 4; 6; 12", không màn nào trả lời hộp đựng mấy cái thì vừa hết.
- Sửa: thêm câu kết vào note ngay sau hay caption: "Vậy hộp đựng 1, 2, 3, 4, 6 hay 12 cái thì 12 cái bánh vừa hết."

### 5. Hình bội tô số 0 khác màu "Bội" trong khi quy tắc nói 0 là bội

- Vị trí: visual `tim-boi-tom-tat` (`$.sections[5].recap`, `$.cards[5].recap`, `phone/079-s6-07-recap.png`), `tim-boi-4` (`$.sections[5].blocks[0]`, `phone/070-s6-01-block-end.png`) - LL-15
- Nguồn: tr.30
- Vấn đề: caption recap có câu "Số 0 cũng là bội của mọi số khác 0", nhưng hình ngay dưới vẽ 0 chấm đen, các bội khác chấm xanh có chú giải "Bội". Recap lệch caption.
- Sửa: ở hình không có `range`, tô chấm 0 cùng màu và kiểu "Bội"; `tim-boi-6-khoang` giữ nguyên (0 ngoài khoảng). Có thể thêm dòng `4 · 0 = 0` vào ví dụ `$.sections[5].blocks[1]`.

### 6. Ví dụ hiệu 24 − 12 = 12: số trừ bằng hiệu, không phân biệt được hai phần

- Vị trí: visual `hieu-24-12-6` (`$.sections[8].blocks[0]`, `phone/105-s9-01-block-end.png`), `hieu-chia-het-ba-dong` (`$.sections[8].blocks[1].children[1]`, `phone/106-s9-02-block.png`) - LL-15
- Nguồn: —
- Vấn đề: nhãn "Số trừ: 12" và "Hiệu: 12" cùng số, không trỏ vào nhóm túi nào; trẻ không biết 12 nào là phần bớt, 12 nào là phần còn. Cùng kiểu lỗi vòng 1 đã sửa ở recap phần 1 (16 = 4 · 4).
- Sửa: đổi sang số trừ khác hiệu, vd 24 − 6 = 18 hay 30 − 12 = 18 (túi 6 cái); đổi số trong caption `$.sections[8].blocks[0].caption`.

### 7. Hình lời giải `mua-hop-10-20` ghi "Một túi 5 cái" và không ra số hộp

- Vị trí: `$.exercises[36].hints.solutionVisualId` (`ex.mua-hop-10-20`, visual `tong-giai-10-20`) - LL-15
- Nguồn: —
- Vấn đề: đề nói hộp, hình ghi "Một túi 5 cái" (kiểu `sumBars` in cứng "túi"); hình kết ở "30 ⋮ 5", không trả lời "bao nhiêu hộp", nên nấc 3 không giải trọn câu.
- Sửa: cho `sumBars` nhận tên túi/hộp như `bags.tsx`, đặt "hộp" cho hình này; thêm bước cuối "30 : 5 = 6, dùng 6 hộp".

### 8. Câu kho ôn `chon-nhieu-boi-6` hỏi lại số vừa hiện trên màn ví dụ

- Vị trí: `$.exercises[30].options` (`ex.chon-nhieu-boi-6`) so với `$.sections[5].blocks[2]` (visual `tim-boi-6-khoang`, dãy "24 ; 30 ; 36") - LL-07
- Nguồn: —
- Vấn đề: đáp án 24 nằm nguyên trên màn ví dụ cùng card; trẻ nhớ hình thay vì xét chia hết.
- Sửa: đổi số chia (vd bội của 7: 14, 28 đúng; 16, 24 nhiễu, tránh số của `cham-boi-7`), hoặc giữ 6 và đổi 24 thành 18 hay 42.

### 9. Hàng phụ "5⁴ = 5³ · 5" chen giữa chuỗi đẳng thức

- Vị trí: `$.sections[12].blocks[2]` (visual `nhom-5-mu`), `$.sections[12].blocks[3]` (visual `nhom-2-mu`, hàng "2⁴ = 2³ · 2") - LL-10, LL-15
- Nguồn: lời giải câu 2.9 tr.105 (`sbt-p105.png`)
- Vấn đề: các hàng khác mở bằng "=" nối tiếp biểu thức đầu, riêng hàng này là đẳng thức riêng nhưng cùng cỡ, cùng căn giữa (`phone/155-s13-04-block-end.png`, `ipad/153`, `ipad/155`); trẻ đọc thành chuỗi "5⁴ = 5³ · 5 = 5 · (1 + 5) + ..." sai và dễ chép khi làm `xep-buoc-6-mu`.
- Sửa: tách hàng đó khỏi chuỗi (nhãn nhỏ "vì 5⁴ = 5³ · 5" cạnh hàng dùng nó, hoặc đưa lên trước như bước chuẩn bị, hoặc màu/khung khác). Sửa cả hai hình.

### 10. Lời giải nấc 3 của `tim-x-nho-nhat-18-24` không đi tới x = 6

- Vị trí: `$.exercises[53].hints.solutionVisualId` (`ex.tim-x-nho-nhat-18-24`, visual `tim-x-giai-18-24`) - LL-15
- Nguồn: —
- Vấn đề: hình dừng ở "x ⋮ 6 → E chia hết cho 6", thiếu bước "bội khác 0 nhỏ nhất của 6 là 6", đúng bước trẻ hay sai (nhập 0 hay 12); hình còn đặt tên tổng là E mà đề không có.
- Sửa: thêm hàng cuối "bội khác 0 nhỏ nhất của 6 là 6, nên x = 6" (chữ trong nhãn hay tag, không chữ Việt trong TeX); bỏ tên E, viết thẳng "18 + 24 + x".

### 11. Hình nấc 2 của `chon-nhieu-tong-mu-5` không cho thấy bước trẻ cần

- Vị trí: `$.exercises[65].hints.hintVisualId` (`ex.chon-nhieu-tong-mu-5`, visual `nhom-goi-y-10`) - LL-02
- Nguồn: —
- Vấn đề: hình dùng 10 + 10² = 10 · 11 rồi dừng ở "chia hết cho ?". Bước quyết định là "(1 + 9) = 10 chia hết cho 5 nên cả tích chia hết cho 5" và cách nhóm cặp không bắt đầu từ mũ 1; hình không có cả hai. Cơ số 10 tự chia hết cho 5, dễ gợi mẹo sai "cơ số chia hết cho 5 thì tổng chia hết cho 5".
- Sửa: dùng cặp có thừa số trong ngoặc chia hết mà cơ số không chia hết, số khác đề và lựa chọn, vd 4² + 4³ = 4² · (1 + 4) = 4² · 5, dừng ở "chia hết cho ?" (tránh 7 + 7² của recap).

## Góp ý

### 1. Câu kho ôn hỏi lại ước của 14 như câu kho ôn của card sau

- Vị trí: `$.exercises[20]` (`ex.chon-nhieu-uoc-14`, card `uoc-boi`) với `$.exercises[27]` (`ex.xep-uoc-14`, card `tim-uoc`) - LL-07
- Nguồn: —
- Vấn đề: khác card nên không trái luật, nhưng phiên ôn trộn card có thể hỏi liền hai lần các ước của 14.
- Sửa: đổi sang ước của 22 (2, 11 đúng; 3, 4 nhiễu).

### 2. Hai đáp án của `chon-nhieu-chia-het-7` nằm sẵn trên hình gợi ý và lời giải cùng card

- Vị trí: `$.exercises[13].options` (35, 56) với hình `dem-cach-goi-y-7-38`, `dem-cach-giai-7-59` của `$.exercises[12]` - LL-07
- Nguồn: —
- Vấn đề: câu ôn hỏi đúng hai chỗ dừng trên trục bước 7 trẻ vừa xem.
- Sửa: đổi số chia, vd "Chọn tất cả số chia hết cho 8" với 32, 48 đúng; 36, 44 nhiễu.

### 3. Nhiễu "nhỏ hơn" của `doc-42-7` không ứng với lỗi thật

- Vị trí: `$.exercises[9].bank` (`ex.doc-42-7`) - LL-14
- Nguồn: —
- Vấn đề: "42 nhỏ hơn 7" sai hiển nhiên, không phải cách đọc nhầm kí hiệu nào.
- Sửa: thay bằng "chia cho" (đọc ⋮ như dấu :) hay "là bội của".

### 4. Màn quy tắc kiểm chia hết viết dạng nhân, recap viết dạng chia

- Vị trí: hình `chia-du-52-4` ("52 = 4 · 13 | số dư 0") so với recap `kiem-tra-tom-tat` ("72 : 8 = 9 | số dư 0")
- Nguồn: —
- Vấn đề: câu quy tắc nói "Chia số bị chia cho số chia"; màn quy tắc minh hoạ bằng phép nhân, recap bằng phép chia.
- Sửa: tuỳ tác giả; thêm "52 : 4 = 13" trên dòng "52 = 4 · 13" (dòng 53 giữ `53 = 4 · 13 + 1`). Làm cùng lúc với Nghiêm trọng 3.

### 5. Câu quy tắc kí hiệu không tách cụm cần đọc

- Vị trí: `$.sections[1].blocks[0].children[0].text`, `$.sections[1].recap.caption`, `$.cards[1].recap.caption` - LL-19
- Nguồn: —
- Vấn đề: "Dấu chia hết đọc là chia hết cho." lặp "chia hết" hai lần liền, không rõ cụm nào là lời đọc.
- Sửa: "Dấu chia hết đọc là “chia hết cho”. Gạch chéo qua dấu đó thì đọc là “không chia hết cho”." (sửa cả hai recap).

### 6. Sáu quy tắc tính chất dùng ba khuôn câu và hai từ "đều"/"cùng" cho cùng một ý

- Vị trí: note và recap của `tong-chia-het` ("Nếu ... đều chia hết ... thì"), `tong-khong-chia-het` ("Tổng có ... Khi đó ..."), `hieu-chia-het` ("... cùng chia hết ... thì"), `tim-x` ("... đều chia hết"), tiêu đề `$.sections[6].title` ("cùng chia hết") so với note của nó ("đều chia hết"); note `$.sections[6].blocks[3].children[0].text` nói lại quy tắc bằng lời khác ("không cần cộng vẫn biết tổng chia hết") ngay sau quy tắc - LL-05
- Nguồn: —
- Vấn đề: cùng một ý "mọi số đều chia hết cho số đó" khi viết "đều", khi viết "cùng"; khi có "Nếu", khi không. Không sai toán, nhưng trẻ học chậm nhớ lẫn các cách nói.
- Sửa: tuỳ tác giả: chốt một từ ("đều") và một khuôn ("... thì ...") cho cả sáu quy tắc và tiêu đề section; màn `$.sections[6].blocks[3]` chỉ giữ ý mới ("Chỉ cần xét từng số hạng, không cần cộng"). Phần của `nhom-so-hang` xem Góp ý 13.

### 7. Quy tắc tổng không chia hết có hai chữ "một" nghĩa khác nhau sát nhau

- Vị trí: `$.sections[7].blocks[1].children[0].text`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption` (`phone/095-s8-02-block.png`) - LL-19
- Nguồn: tr.30
- Vấn đề: "Tổng có một số hạng không chia hết cho một số": "một" đầu là đếm, "một" sau là số chia chưa nói tên; trẻ đọc chậm dễ vấp.
- Sửa: "Tổng có đúng một số hạng không chia hết cho một số, ..." (sửa note và hai recap cùng lúc).

### 8. Section `tong-chia-het` không có màn cùng làm; hai màn ví dụ ba số hạng trùng ý

- Vị trí: `$.sections[6].blocks[2]` (visual `tong-ba-so-hang`) và `$.sections[6].blocks[3]` (visual `xet-tung-so-hang`), `phone/084`–`086` - LL-16
- Nguồn: —
- Vấn đề: các section khác của phần tính chất đều có màn "Chạm vào ..." trước câu tự làm; section này chỉ có hai màn ví dụ cùng nói một điều.
- Sửa: gộp hai màn ví dụ, màn còn lại thành chip "Chạm vào các tổng chia hết cho 5".

### 9. Nhiễu `20 + 26` của `chon-tong-9` có hai số hạng đều không chia hết

- Vị trí: `$.exercises[37].options[2]` (`ex.chon-tong-9`) - LL-14
- Nguồn: tr.30
- Vấn đề: loại lựa chọn này bằng khái quát sai "có số hạng không chia hết thì tổng không chia hết" (7 + 8 = 15 chia hết cho 5), đúng điều vòng 1 muốn chặn. Đáp án vẫn đúng.
- Sửa: đổi thành tổng có đúng một số hạng không chia hết cho 9, vd `27 + 10`.

### 10. Hai id bài tập lệch nội dung

- Vị trí: `$.exercises[38]` (`ex.dien-tong-7`, nay xét 28 + 36 cho 4); `$.exercises[22]` (`ex.chon-uoc-10`, là câu `numeric`)
- Nguồn: —
- Vấn đề: id là nhãn cho người soạn và review; id chưa khoá nên đổi lúc này còn rẻ.
- Sửa: `dien-tong-4`, `tim-uoc-10` (sửa cả `checkIds` của `section.tim-uoc`).

### 11. Câu kho ôn `du-tong-30-4` luyện phép chia có dư, không luyện quy tắc của card

- Vị trí: `$.exercises[41]` (`ex.du-tong-30-4`, card `tong-khong-chia-het`)
- Nguồn: —
- Vấn đề: tìm số dư là việc của section `kiem-tra`; vòng 1 đã bỏ câu cùng kiểu `du-hieu-50-8` ở card hiệu.
- Sửa: "Tổng 30 + 4 có chia hết cho 6 không?" theo khuôn `tong-24-10`, hoặc bỏ câu nếu card vẫn đủ 3 exercise.

### 12. Chú giải "Còn thừa" hiện ở hình không có phần thừa

- Vị trí: visual `tong-12-18-6`, `tong-chia-het-tom-tat`, `hieu-24-12-6`, `hieu-chia-het-tom-tat`, `tong-goi-y-8-12`, `tong-giai-10-20`
- Nguồn: —
- Vấn đề: hình chia hết không có túi thừa nhưng chú giải vẫn in "Còn thừa".
- Sửa: kiểu `sumBars` chỉ in mục "Còn thừa" khi có số dư khác 0.

### 13. Câu quy tắc nhóm số hạng "Mỗi nhóm cùng chia hết" gượng; màn quy tắc thiếu dòng kết luận chia hết

- Vị trí: `$.sections[12].blocks[1].children[0].text`, `$.sections[12].recap.caption`, `$.cards[12].recap.caption`; công thức `$.sections[12].blocks[1].children[2]` - LL-05
- Nguồn: —
- Vấn đề: "Mỗi nhóm cùng chia hết" ghép "mỗi" với "cùng"; ví dụ dừng ở "= 5 · 6", chưa nói 5 + 5² chia hết cho 6.
- Sửa: "Các nhóm đều chia hết cho một số thì cả tổng chia hết cho số đó." (note và hai recap cùng lúc, khớp khuôn chọn ở Góp ý 6); thêm dòng `(5 + 5^{2}) \chiahet 6`.

### 14. `chon-hieu-khong-9` viết dấu trừ bằng gạch nối "-"

- Vị trí: `$.exercises[51].options[0..3].content.text` (`ex.chon-hieu-khong-9`)
- Nguồn: —
- Vấn đề: chỗ duy nhất trong bài dùng gạch nối ASCII thay "−".
- Sửa: "63 − 27" v.v. (hoặc `formula`).

### 15. Câu chuyện bánh ở `hieu-khong-chia-het` kết bằng kí hiệu, không có câu trả lời bằng lời

- Vị trí: `$.sections[9].blocks[0]` (visual `hieu-24-10-6`, `phone/115-s10-01-block-end.png`) - LL-16
- Nguồn: —
- Vấn đề: caption hỏi "có xếp vừa các túi 6 cái không?", hình dừng ở "14 ⋮̸ 6", không chỗ nào trả lời bằng lời.
- Sửa: thêm câu kết "Vậy 14 cái bánh còn lại không xếp vừa các túi 6 cái."

### 16. Hình nấc 2 `hieu-goi-y-20-7` chỉ minh hoạ một vế và lặp số câu kiểm tra

- Vị trí: `$.exercises[50].hints.hintVisualId` (`ex.chon-nhieu-hieu-khong-4`)
- Nguồn: —
- Vấn đề: đề xét cho 4 với cả hai vế của quy tắc; hình dùng túi 5 cái, chỉ ca số bị trừ chia hết, lặp số của `hieu-20-7-5`.
- Sửa: hình số khác, có ca số bị trừ không chia hết (vd 22 − 8, túi 4 cái, dừng ở "Hiệu: ?").

### 17. Đề `tim-x-nho-nhat-18-24` ngắt dòng giữa biểu thức trên điện thoại

- Vị trí: `$.exercises[53].prompt[0].text` (`phone/133-s11-06-exercise-tim-x-nho-nhat-18-24.png`) - LL-12
- Nguồn: —
- Vấn đề: dòng sau bắt đầu bằng "+ x".
- Sửa: tách biểu thức vào khối `formula`, hoặc viết lại câu.

### 18. `minutes` của `nhom-so-hang` thấp hơn số màn

- Vị trí: `$.sections[12].minutes`
- Nguồn: —
- Vấn đề: 7 màn, khoảng 4 phút 40 giây; bài ghi 4.
- Sửa: `minutes: 5`.

### 19. `dien-du-20-6` gần như câu 2.10 của sách

- Vị trí: `$.exercises[62].segments` (`ex.dien-du-20-6`) - LL-08
- Nguồn: câu 2.10 tr.32, lời giải tr.105 (`sbt-p32.png`, `sbt-p105.png`)
- Vấn đề: giữ nguyên số dư 6, số xét 4 và lập luận của lời giải sách, chỉ đổi 12 thành 20. Không trùng nguyên văn nên không chặn.
- Sửa: đổi cả số dư và số xét, vd 14 · q + 3 xét cho 7.

### 20. Hai nhiễu của `chon-nhieu-tong-mu-5` trùng biểu thức của hình cùng card

- Vị trí: `$.exercises[65].options[1]` (3 + 3², trùng `nhom-goi-y-3`), `options[3]` (2 + 2², trùng `nhom-2-mu`) - LL-07
- Nguồn: —
- Vấn đề: không sai, câu hỏi chia hết cho 5 khác kết luận của hình, nhưng số lặp.
- Sửa: tuỳ tác giả: 6 + 6² (42) hay 3² + 3³ (36).

### 21. Lint chia hết vẫn tính được khi một vế là hiệu âm

- Vị trí: `src/content/lint/expr.ts` (`divisibilityValue`), `tests/content/lint.test.ts`
- Nguồn: —
- Vấn đề: `(3 - 5) \chiahet 2` trả `true`; quan hệ chia hết của bài chỉ trên số tự nhiên. Chưa bài nào dùng ca này.
- Sửa: trả `undefined` khi một vế âm, thêm một dòng test.
