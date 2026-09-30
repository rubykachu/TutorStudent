# Review: Quan hệ chia hết và tính chất (`quan-he-chia-het-va-tinh-chat`)

- Bài: `content/math/kntt/quan-he-chia-het-va-tinh-chat/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/quan-he-chia-het-va-tinh-chat/` - sbt-p30, sbt-p31, sbt-p32, sbt-p104, sbt-p105
- `content:check`: 0 lỗi, chỉ cảnh báo id chưa khoá (đúng với bài draft)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/quan-he-chia-het-va-tinh-chat/`
- Kết luận: Chưa đạt: còn 8 lỗi Nghiêm trọng
- Bản đã review: `0e5fa5fff5fb01dda5b8095aeced0fea9faa4a5e34a9c61b9da13fc5e85fe941` (`pnpm content:diff` so với bản này)

Ba reviewer đã tự giải cả 68 bài tập trước khi đọc `answer`: mọi đáp án đúng, không nhiễu nào cũng đúng, các câu "chọn tất cả" đủ tập đáp án. Quy ước "a · b là a được lấy b lần" giữ đúng ở cả bài. Không chép số bài tập của sách.

## Nghiêm trọng

### 1. Hình quy tắc ghi "53 : 4 = 13", một đẳng thức sai

- Vị trí: `$.sections[2].blocks[3].children[1]` (`section.kiem-tra`, visual `chia-du-52-4`, dòng `53 : 4 = 13` trong `catalog.ts`) - LL-17
- Nguồn: —
- Vấn đề: 53 : 4 không bằng 13. Số dư nằm trong nhãn tách riêng bên phải, nên trẻ đọc dòng công thức như một phép tính đúng và nhớ sai. Đây là màn quy tắc của cách kiểm bằng số dư (`phone/033-s3-04-block.png`, `ipad/033-s3-04-block.png`).
- Sửa: viết dòng có dư như sách (tr.104, câu 1.77 ghi "... (dư 12)"): `53 : 4 = 13` kèm "(dư 1)" trong nhãn hay chữ của hình (không chữ Việt trong TeX), hoặc `53 = 4 \cdot 13 + 1`. Dòng chia hết đổi theo cho cân (`52 = 4 \cdot 13`).

### 2. Câu định nghĩa ước và bội gần như chép nguyên câu sách

- Vị trí: `$.sections[3].blocks[1].children[0].text`, `$.sections[3].recap.caption`, `$.cards[3].recap.caption` (`section.uoc-boi`, `card.uoc-boi`) - LL-08
- Nguồn: tr.30, mục A, ý 2 (`sbt-p30.png`)
- Vấn đề: "Nếu a chia hết cho b thì b là ước của a và a là bội của b." chỉ khác câu sách ở chỗ bỏ "ta nói" và viết kí hiệu thành chữ. Checklist trục 1 xếp câu trùng nguyên văn định nghĩa vào Nghiêm trọng; bài không có lớp chữ `p*.txt` nên `[textbook-copy]` không chạy.
- Sửa: viết lại bằng lời của bài, giữ đủ hai vế, vd "Khi a chia hết cho b, ta gọi b là một ước của a, còn a là một bội của b." Sửa cùng lúc note, recap section, recap card để `[rule-sentence]` vẫn khớp.

### 3. Note hứa "chỉ cần xét từng số hạng" là biết tổng có chia hết hay không

- Vị trí: `$.sections[6].blocks[3].children[0].text` (`section.tong-chia-het`, hình `xet-tung-so-hang`, `phone/085-s7-04-block.png`); liên quan `$.overview.summary` ("... xét chia hết mà không cần tính") - LL-17
- Nguồn: tr.30 (`sbt-p30.png`: tính chất chỉ nói trường hợp mọi số hạng chia hết, hoặc đúng một số hạng không chia hết)
- Vấn đề: câu "Không cần cộng vẫn biết tổng có chia hết hay không" hứa rằng xét số hạng luôn quyết định được cả hai chiều. Sai: 7 + 8 = 15 chia hết cho 5 dù 7 và 8 đều không chia hết cho 5. Trẻ dễ khái quát thành "có số hạng không chia hết thì tổng không chia hết", đúng lỗi điều kiện "các số hạng còn lại đều chia hết" ở section 8 muốn chặn.
- Sửa: chỉ nói chiều đã học: "Các số hạng đều chia hết cho một số thì không cần cộng vẫn biết tổng chia hết cho số đó." Hình giữ được. `overview.summary` nói gọn hơn: "... dùng tính chất của tổng, hiệu để xét chia hết nhanh hơn."

### 4. Quy tắc "Số 0 cũng là bội của mọi số" thiếu điều kiện khác 0, recap lại bỏ câu này

- Vị trí: `$.sections[5].blocks[1].children[0].text` (`section.tim-boi`, note `rule: true`, `phone/071-s6-02-block.png`); `$.sections[5].recap.caption`, `$.cards[5].recap.caption` - LL-17
- Nguồn: tr.30 (`sbt-p30.png`: "Cho hai số tự nhiên a và b (b ≠ 0)")
- Vấn đề: 0 không là bội của 0 vì không chia được cho 0; trẻ học thuộc nguyên câu quy tắc. Recap chỉ giữ câu "bội khác 0", nên ý về số 0 có trong quy tắc nhưng không được ôn (recap lệch note), trong khi câu `dien-boi-3` (mục 5) lại cần nó.
- Sửa: "Số 0 cũng là bội của mọi số khác 0." Quyết một trong hai: đưa câu này vào recap, hoặc bỏ khỏi note `rule` (chuyển thành note thường) để note và recap khớp.

### 5. Câu điền "các bội của 3 nhỏ hơn 16" bỏ mất số 0, trái quy tắc vừa dạy

- Vị trí: `$.exercises[32].segments[0].text` (`ex.dien-boi-3`, card `tim-boi`) - LL-17
- Nguồn: tr.30-31 (`sbt-p30.png`, `sbt-p31.png`; câu 2.3 dùng khoảng có cận dưới nên không gặp số 0)
- Vấn đề: màn quy tắc vừa nói số 0 là bội, rồi câu ôn in sẵn "Các bội của 3 nhỏ hơn 16 là 3; 6; 9; ...; 15." Câu hoàn chỉnh là khẳng định sai; trẻ hoặc nghi quy tắc, hoặc nhớ 0 không phải bội.
- Sửa: "Các bội khác 0 của 3 nhỏ hơn 16 là ..." (khớp chữ của quy tắc), hoặc dùng khoảng không chứa 0 ("lớn hơn 2 và nhỏ hơn 16").

### 6. Câu chọn nhiều tổng luỹ thừa cần tính 9³, 9⁴ hoặc kiến thức chưa dạy để loại lựa chọn sai

- Vị trí: `$.exercises[65].options[1]`, `$.exercises[65].options[3]` (`ex.chon-nhieu-tong-mu-5`) - LL-09 (kèm LL-18)
- Nguồn: tr.32 câu 2.9 (`sbt-p32.png`); lời giải tr.105 (`sbt-p105.png`)
- Vấn đề: hai lựa chọn đúng chứng tỏ được bằng cách nhóm đã dạy. Còn (9 + 9³) và (9² + 9⁴) sai, nhưng muốn thấy sai phải biết "tích hai số không chia hết cho 5 thì không chia hết cho 5" (chưa dạy, không có trong nguồn), hoặc tính 729, 6 561 rồi chia cho 5 (quá 2 phép tính nhẩm; dấu hiệu chia hết cho 5 là Bài 9). Section chỉ dạy cách chứng tỏ một tổng chia hết. Trẻ yếu chỉ đoán bằng mẹo.
- Sửa: đổi hai lựa chọn sai thành tổng luỹ thừa nhỏ tính được trong 2 phép tính, vd `(3 + 3^{2}) \chiahet 5` (12), `(2 + 2^{2}) \chiahet 4` (6); giữ `check.relation`. Hoặc đổi cả câu sang "chọn tất cả tổng chia hết cho 10" chỉ với cặp luỹ thừa cạnh nhau của 9 (đúng) và cặp của số khác có giá trị nhỏ (sai).

### 7. Hình gợi ý nấc 2 của câu luyện số dư ra đúng đáp án của đề

- Vị trí: `$.exercises[59].hints.hintVisualId` (`ex.chon-12q-9`, visual `so-du-goi-y-15-6`) - LL-02
- Nguồn: —
- Vấn đề: đề hỏi a = 12 · q + 9 chia hết cho số nào trong 2, 3, 4, 6 (đáp án 3). Hình gợi ý dùng a = 15 · q + 6 nhưng xét đúng cho 3 và kết luận "a chia hết cho 3"; trẻ chép số 3 từ hình. Luật 3 nấc: nấc 2 không được cho biết kết quả của đề, kể cả khi dùng số khác.
- Sửa: ví dụ gợi ý dùng số chia không có trong các lựa chọn (vd a = 10 · q + 5 xét cho 5), hoặc giữ số của đề và dừng ở hàng "9 chia hết cho ?" mờ, không có hàng kết luận.

### 8. Số chia trong các quy tắc tính chất có ba cách gọi; chữ `m` chưa từng được giới thiệu, "một số" mang hai nghĩa

- Vị trí: note `rule` và recap (section lẫn card) của `tong-khong-chia-het` (`$.sections[7].blocks[1].children[0].text`), `hieu-khong-chia-het` (`$.sections[9].blocks[1].children[0].text`), `tim-x` (`$.sections[10].blocks[1].children[0].text`); so với `tong-chia-het` (`$.sections[6].blocks[1]`), `hieu-chia-het` (`$.sections[8].blocks[1]`), `nhom-so-hang` (`$.sections[12].blocks[1]`); chữ b, q, r của `so-du` (`$.sections[11].blocks[1]`) - LL-05 (kèm LL-09, LL-19)
- Nguồn: tr.30 mục A (`sbt-p30.png`: sách viết bằng a, b, m, nhưng có kí hiệu đi kèm)
- Vấn đề: bốn chỗ trong bài nói cùng một điều là "số chia đang xét" theo ba cách: "cho m" (section 8, 10, 11), "cho một số ... cho số đó" (section 7, 9, 13), và b (section 4, 12). Không màn nào nói m là gì; trẻ gặp a, b ở section 4 có ví dụ số ngay sau, còn `m` xuất hiện lần đầu trong một câu quy tắc có ba lần "m", và cả recap lẫn card đều giữ nguyên chữ đó, nên câu trẻ phải nhớ có một kí hiệu trẻ không đọc được. Thêm vào đó, "một số" ở section 7, 9, 13 là số chia ("chia hết cho một số"), còn ở section 10 là một trong hai số của hiệu ("Một số chia hết cho m, số kia ..."); section 9 lại gọi đúng hai số đó là "số bị trừ và số trừ". Nếu làm theo cách sửa gọn "thay m bằng một số" thì section 10 thành "Một số chia hết cho một số, số kia không chia hết cho số đó", khó hiểu hơn. Quy tắc `so-du` dùng b, q, r mà note không nói r là số dư, q là thương. Tổng hợp xếp Nghiêm trọng (reviewer nhóm 2, 3 ghi Nên sửa) vì câu recap trẻ học thuộc của ba card chứa kí hiệu chưa dạy, và ba cách gọi cho một khái niệm khiến bốn quy tắc anh em không đọc thành một họ.
- Sửa: chọn một cách gọi số chia cho cả sáu quy tắc tính chất rồi sửa note, recap section, recap card cùng lúc (`[rule-sentence]`). Đề xuất bỏ `m`, dùng khuôn của section 7: "... chia hết cho một số thì ... chia hết cho số đó"; ở section 10 gọi hai số là số bị trừ, số trừ như section 9: "Số bị trừ chia hết cho một số, số trừ không chia hết cho số đó (hoặc ngược lại) thì hiệu không chia hết cho số đó." Section 11 viết đủ vế cuối: "... không chia hết cho số đó khi x không chia hết cho số đó." Nếu giữ `m`: giới thiệu một lần ở màn quy tắc đầu tiên dùng nó ("m là số ta đang xét chia hết, vd 5"), và dùng `m` ở cả sáu quy tắc. Section `so-du`: thêm vào note "q là thương, r là số dư" (chữ ngoài TeX).

## Nên sửa

### 1. Nấc 1 tô dòng hướng dẫn chung, không tô phần đề cần nhìn lại

- Vị trí: `$.exercises[16].hints.highlight[0]` (`ex.dien-uoc-21-7`), `$.exercises[9].hints.highlight[0]` (`ex.doc-42-7`), `$.exercises[18].hints.highlight[0]` (`ex.dien-boi-uoc-35-5`), `$.exercises[64].hints.highlight[0]` (`ex.dien-8-mu`, ảnh `158-s13-05-exercise-dien-8-mu-wrong1.png`), `$.exercises[49]` (`ex.chon-nhieu-hieu-khong-4`), `$.exercises[65]` (`ex.chon-nhieu-tong-mu-5`), `$.exercises[56]` (`ex.dien-x-9`), `$.exercises[62]` (`ex.dien-du-12-9`) - LL-02
- Nguồn: —
- Vấn đề: `index: 0` sáng lên câu lệnh ("Chọn từ điền vào chỗ trống.", "Chọn tất cả phát biểu đúng."), không chỉ chỗ dễ sai (số đứng trước là bội, số đứng sau là ước; số chia đang xét). Bốn câu cuối còn không có `hintVisualId`.
- Sửa: câu có khối công thức (`dien-uoc-21-7`, `doc-42-7`, `dien-boi-uoc-35-5`, `dien-8-mu`): đổi thành `{ "target": "block", "index": 1 }`; `dien-boi-uoc-35-5` có thể tô từng số qua `\htmlId` với `target: "part"`, không `conceptId`. Các câu còn lại: thêm khối `formula` hay `note` nêu số chia và dữ kiện rồi tô khối đó, hoặc thêm `hintVisualId` với số khác đề.

### 2. Section `kiem-tra` gộp hai quy tắc cần nhớ riêng

- Vị trí: `$.sections[2].blocks[2]`, `$.sections[2].blocks[3]`, `$.sections[2].recap`, `$.cards[2].recap` (`section.kiem-tra`) - LL-06
- Nguồn: tr.30 (mục B), tr.31 (câu 2.1)
- Vấn đề: hai note `rule: true` (đếm cách; số dư bằng 0), recap phải có hai câu. Hình recap `kiem-tra-tom-tat` chỉ vẽ cách đếm, câu thứ hai không có ví dụ.
- Sửa: giữ một quy tắc để nhớ (số dư bằng 0 thì chia hết, dùng lại ở section sau), hình đếm cách làm màn dẫn vào không đánh `rule`; hoặc tách hai section. Hình recap vẽ đúng ví dụ của câu giữ lại.

### 3. Recap phần 1 dùng 16 = 4 · 4, không phân biệt được số chia và thương

- Vị trí: `$.sections[0].recap.visualId`, `$.cards[0].recap.visualId` (visual `chia-deu-tom-tat`) - LL-15
- Nguồn: —
- Vấn đề: câu recap nói "số bị chia bằng số chia nhân với thương" nhưng số chia và thương cùng là 4. Chú thích hình là "▲ Một túi, ♦ Còn thừa" (không có phần thừa trong hình) chứ không phải ba khái niệm như màn quy tắc (`phone/018-s1-07-recap.png` so với `005-s1-03-block.png`).
- Sửa: đổi bộ số cho số chia khác thương (vd 15 = 5 · 3), hoặc dùng kiểu `rows` như `chia-het-12-3` với chú thích ba khái niệm.

### 4. Màn quy tắc phần 1 không có câu ví dụ "12 chia hết cho 3"

- Vị trí: `$.sections[0].blocks[2].children[1]` (visual `chia-het-12-3`)
- Nguồn: tr.30, mục A, ý 1
- Vấn đề: note định nghĩa cụm "chia hết cho" nhưng ví dụ chỉ có 12 = 3 · 4; cả phần 1 không màn nào viết khái niệm vừa học cho một cặp số cụ thể.
- Sửa: thêm nhãn "12 chia hết cho 3" dưới công thức (chữ ngoài TeX), hoặc thêm "Ví dụ 12 chia hết cho 3." vào note.

### 5. Hình từng bước ở trạng thái đầu hiện phép nhân với 0 hay trục trống

- Vị trí: visual `chia-tui-12-3`, `chia-tui-14-3` (`$.sections[0].blocks[0]`, `[1]`), `chia-tui-goi-y-17-5`, `chia-tui-giai-26-6` (`$.exercises[1].hints`), `so-du-34-10` (`$.sections[11].blocks[0]`, ảnh `137-s12-01-block.png`); visual kiểu `hops`: `dem-cach-6-42`, `dem-cach-6-40` (`$.sections[2].blocks[0]`, `[1]`), `tim-boi-4`, `tim-boi-6-khoang`, `tim-boi-giai-8`, `tim-boi-goi-y-5` (section `tim-boi`) - LL-15
- Nguồn: —
- Vấn đề: bước 0 của hình túi in "3 · 0 = 0", "6 · 0 = 0", "10 · 0 = 0" (`phone/001-s1-01-block.png`): phép tính không nói gì về bài, dễ làm trẻ nghĩ có 0 túi. Bước 0 của hình bước nhảy chỉ có trục trống (`phone/028-s3-01-block.png`, `069-s6-01-block.png`), các chỗ dừng ẩn hẳn. Checklist trục 5: hình từng bước để trống thay vì "?" mờ là Nên sửa.
- Sửa: hình túi bước 0 ghi "12 = 3 · ?" (hình bi: "34 = 10 · ? + ?"), điền dần. Hình bước nhảy hiện sẵn vạch và nhãn "?" mờ ở các chỗ dừng sắp tới.

### 6. Hình tìm bội trong khoảng không vẽ hai mốc của khoảng

- Vị trí: visual `tim-boi-6-khoang` (`$.sections[5].blocks[2].children[1]`, kiểu `hops` với `range`; `phone/072-s6-03-block.png`)
- Nguồn: —
- Vấn đề: khoảng "lớn hơn 20 và nhỏ hơn 40" không có mốc 20, 40 trên trục; kết quả chỉ phân biệt bằng chấm mờ và chấm đậm, chú giải không giải thích chấm mờ.
- Sửa: vẽ hai mốc có số 20 và 40, thêm mục chú giải "Nằm ngoài khoảng" cho chấm mờ.

### 7. Hình lời giải hộp bánh ghi chú thích "Một túi"

- Vị trí: `$.exercises[1].hints.solutionVisualId` (`ex.tinh-thua-26-6`, visual `chia-tui-giai-26-6`; `Legend` trong `bags.tsx`) - LL-15
- Nguồn: —
- Vấn đề: đề và hình nói bánh, hộp nhưng chú thích in cứng "▲ Một túi" (`phone/016-s1-06-exercise-tinh-thua-26-6-wrong3.png`).
- Sửa: chú thích lấy theo `spec.bag` ("Một hộp").

### 8. Gợi ý và lời giải của `tim-du-59-7` không chỉ cách ra số dư

- Vị trí: `$.exercises[12].hints` (`ex.tim-du-59-7`, visual `dem-cach-goi-y-7-38`, `dem-cach-giai-7-59`) - LL-15
- Nguồn: —
- Vấn đề: câu hỏi số dư, nhưng hai hình dừng ở "35 < 38 < 42", "56 < 59 < 63", không có bước lấy số cần xét trừ chỗ dừng gần nhất; nấc 3 không giải trọn câu. Màn quy tắc dạy số dư bằng phép chia, gợi ý dùng trục số, không nối hai cách.
- Sửa: nấc 2 thêm "38 − 35 = ?" và dừng ở "?"; nấc 3 thêm "59 − 56 = 3, số dư là 3" (hoặc "59 = 7 · 8 + 3").

### 9. Một màu mang nhiều khái niệm, một khái niệm đổi màu

- Vị trí: `$.concepts` (xanh dương: Số bị chia, Bội, Số hạng; cam: Thương, Tổng; tím: Số chia, Ước); visual `dem-cach-6-42`, `dem-cach-6-40`, `kiem-tra-tom-tat` (`hops.tsx`, `Tint color="lime"`) so với `$.sections[2].blocks[3]`
- Nguồn: —
- Vấn đề: cặp Số chia/Ước (tím) và Số bị chia/Bội (xanh dương) có lý do (ước đứng ở chỗ số chia, bội ở chỗ số bị chia), nhưng Số hạng trùng xanh dương của Số bị chia, Tổng trùng cam của Thương; ở `so-du` (a = b · q + r) cả số chia, thương lẫn số hạng cùng xuất hiện. Trong section `kiem-tra`, số bị chia 42 màu xanh lá ("Số đang xét") ở hình bước nhảy (`phone/029-s3-01-block-end.png`, recap `038`) rồi xanh dương ("Số bị chia") ở màn quy tắc ngay sau (`032-s3-03-block.png`), còn xanh dương trong hình bước nhảy lại là "Chỗ dừng".
- Sửa: hình bước nhảy tô số cần xét màu `blue` với chú thích "Số bị chia", chỗ dừng dùng màu trung tính. Đổi màu Số hạng, Tổng sang màu chưa dùng trong bài (tránh màu đang là đáp án ở câu gọi tên).

### 10. Glossary môn chưa có "ước", "bội", "chia hết"

- Vị trí: `content/glossary/math.json` (concept `uoc`, `boi` của bài)
- Nguồn: tr.30, mục A
- Vấn đề: bài định nghĩa hai khái niệm mới và thuật ngữ "chia hết" nhưng glossary không có; Bài 9–12 dùng ước, bội liên tục mà không có nguồn chung giữ tên và màu.
- Sửa: thêm `ước` (`violet`), `bội` (`blue`), `chia hết` vào glossary.

### 11. Câu của phần kí hiệu bắt xét chia hết trước khi dạy cách kiểm

- Vị trí: `$.exercises[7]` (`ex.chon-dung-45-9`), `$.exercises[8]` (`ex.chon-nhieu-dung-27-50`), `$.exercises[10]` (`ex.noi-doc-30`); thứ tự `$.sections[1]` trước `$.sections[2]` - LL-09
- Nguồn: —
- Vấn đề: card `ky-hieu` dạy đọc, viết kí hiệu, nhưng câu luyện bắt trẻ tự quyết 32 ⋮ 6, 45 ⋮̸ 5 đúng hay sai trong khi cách kiểm đến phần 3 mới dạy; trẻ sai không rõ nhầm kí hiệu hay nhầm phép chia.
- Sửa: đổi thứ tự hai section, hoặc cho câu luyện của `ky-hieu` nêu sẵn sự kiện chia hết như `chon-viet-35-7`.

### 12. Màn cùng làm và câu luyện section 7, 9 cần quy tắc "không chia hết" của section sau

- Vị trí: `$.sections[8].blocks[2].children[0].text` + visual `chon-hieu-6` (chip `48 − 20`, `24 − 10`); `$.exercises[45].options[1]`, `[3]` (`ex.chon-nhieu-hieu-7`); `$.exercises[35].options[1]`, `[3]` (`ex.chon-nhieu-tong-8`); note `$.sections[7].blocks[3]` ("mà không cần cộng") - LL-09
- Nguồn: tr.30 (`sbt-p30.png`)
- Vấn đề: section 9 chỉ dạy "cùng chia hết thì hiệu chia hết", nhưng note bảo "chọn mà không cần trừ"; loại `48 − 20` mà không trừ cần quy tắc của section 10. Tương tự câu luyện section 7 cần quy tắc section 8.
- Sửa: bỏ cụm "mà không cần trừ/cộng" ở màn có nhiễu không chia hết và cho nhiễu bác được bằng phép tính nhẩm; hoặc đổi câu thành "Chọn tất cả tổng (hiệu) mà cả hai số đều chia hết cho 8 (7)", để phần "không chia hết" nằm ở section 8, 10. Cách sửa phải khớp mục Nghiêm trọng 3.

### 13. Hai câu kho ôn chọn cỡ túi đúng ngay ở trạng thái đầu

- Vị trí: `$.exercises[4]` (`ex.tui-24-vua-het`), `$.exercises[5]` (`ex.tui-25-con-thua`) - LL-14
- Nguồn: —
- Vấn đề: `bag-try.tsx` bắt đầu ở cỡ 2; 24 chia hết cho 2, 25 chia 2 còn thừa, nên trạng thái đầu đã đúng. Trong 8 cỡ (2–9), 5 cỡ vừa hết 24, 7 cỡ làm 25 còn thừa.
- Sửa: câu "vừa hết" chọn số ít cỡ vừa và cỡ 2 không vừa (35, 27); câu "còn thừa" chọn số mà cỡ 2 vừa hết và nhiều cỡ vừa (24, 36).

### 14. Nhiều section Toán thiếu ví dụ đời sống

- Vị trí: `$.sections[1]` (`ky-hieu`), `[2]` (`kiem-tra`), `[3]` (`uoc-boi`), `[4]` (`tim-uoc`), `[5]` (`tim-boi`), `[10]` (`tim-x`), `[12]` (`nhom-so-hang`); `$.sections[9].blocks[0]` (`hieu-khong-chia-het`, caption "Bớt 10 cái khỏi 24 cái, các túi đều 6 cái." không nói là đồ vật gì) - LL-16
- Nguồn: tr.31 (`sbt-p31.png`, ví dụ 2 và câu 2.11 là tình huống đời sống)
- Vấn đề: luật "Ví dụ đời sống ở mọi section Toán". Các section trên chỉ dùng số trần, trục số, tổng trừu tượng.
- Sửa: mỗi section một màn hay một câu gắn đời sống, số nhỏ: `kiem-tra` "52 quyển vở chia đều cho 4 tổ"; `uoc-boi` "18 cái bánh xếp đều vào hộp 6 cái, nên 6 là ước của 18"; `tim-uoc` "12 cái bánh xếp đều vào các hộp, mỗi hộp đựng được mấy cái?" (hình `tim-uoc-12`); `tim-boi` "mỗi hộp 4 cái, mua 1, 2, 3 hộp được bao nhiêu cái?"; `tim-x` "đã có 12 và 18 cái bánh, mua thêm x cái để xếp đủ hộp 6 cái"; `hieu-khong-chia-het` "24 cái bánh xếp đủ 4 túi 6 cái, ăn mất 10 cái thì còn xếp đủ túi không?". `nhom-so-hang`: nếu không có tình huống tự nhiên thì ghi lý do vào backlog.

### 15. Câu kho ôn hỏi lại đúng số của màn quy tắc, màn cùng làm hay câu luyện cùng card

- Vị trí: `$.exercises[20]` (`ex.chon-nhieu-uoc-20`, trùng màn cùng làm `chon-uoc-20-cung-lam`); `$.exercises[33]` (`ex.chon-nhieu-boi-4`, trùng `4 · 1`, `4 · 2`, `4 · 3` ở `$.sections[5].blocks[1]` và hình `tim-boi-4`); `$.exercises[62].segments` (`ex.dien-du-12-9`, trùng a = 12 · q + 9 của câu luyện `chon-12q-9` và hình lời giải `so-du-giai-12-9`) - LL-07
- Nguồn: —
- Vấn đề: phiên ôn thành nhớ lại đáp án vừa thấy, không phải xét chia hết. `[review-bank]` không bắt ca `dien-du-12-9` vì số nằm trong `segments`.
- Sửa: `chon-nhieu-uoc-20` đổi sang ước của 14 (2, 7 đúng; 3, 4 nhiễu); `chon-nhieu-boi-4` đổi số (vd bội của 7 hay 9, tránh 3 đã dùng ở `dien-boi-3`); `dien-du-12-9` đổi thành "Vì 20 · q chia hết cho 4 và 6 ___ cho 4 nên 20 · q + 6 không chia hết cho 4."

### 16. Câu kiểm tra nói sẵn tiền đề, đáp án đúng lặp nguyên chữ của đề

- Vị trí: `$.exercises[34]` (`ex.tong-14-21`), `$.exercises[39]` (`ex.tong-24-10`), `$.exercises[44]` (`ex.hieu-36-18-9`) - LL-14
- Nguồn: tr.30 (`sbt-p30.png`)
- Vấn đề: đề ghi "Hai số hạng 14 và 21 đều chia hết cho 7", lựa chọn đúng "Có, vì cả hai số hạng chia hết cho 7" lặp gần nguyên câu đề; nhiễu ("vì tổng lớn hơn 7", "vì 14 không bằng 21") không ứng với lỗi thật. Trẻ chọn bằng khớp chữ.
- Sửa: bỏ câu tiền đề ("Tổng 14 + 21 có chia hết cho 7 không?"), lựa chọn cùng khuôn: "Có, vì 14 và 21 đều chia hết cho 7" / "Không, vì 21 không chia hết cho 7" / "Không, vì 14 không chia hết cho 7". Làm tương tự hai câu kia.

### 17. Ngân hàng từ của `dien-tong-khong-3` có nhiễu sai ngữ pháp, chỗ trống không hỏi quy tắc

- Vị trí: `$.exercises[43].bank`, `segments` (`ex.dien-tong-khong-3`) - LL-14
- Nguồn: tr.30
- Vấn đề: "nhỏ hơn" ghép vào "5 ___ cho 3" sai ngữ pháp, loại ngay; chỗ trống chỉ hỏi "5 có chia hết cho 3", còn kết luận của quy tắc đã in sẵn.
- Sửa: đặt chỗ trống vào kết luận như `dien-tong-7`: "Vì 12 chia hết cho 3 nhưng 5 không chia hết cho 3 nên tổng 12 + 5 ___ 3." với bank `["chia hết cho", "không chia hết cho"]`.

### 18. Đề `tim-tui-40-16` hai cách hiểu

- Vị trí: `$.exercises[46].prompt[0].text` (`ex.tim-tui-40-16`) - LL-10
- Nguồn: tr.31
- Vấn đề: "Có 40 cái kẹo và 16 cái kẹo ... Bớt 16 cái khỏi 40 cái" tả hai đống riêng rồi lại lấy 16 ra khỏi 40; trẻ có thể tính 56 − 16.
- Sửa: một đống: "Có 40 cái kẹo xếp vừa các túi 8 cái. Lấy ra 16 cái (vừa 2 túi). Còn lại mấy túi?"

### 19. Hình hiệu vẽ số trừ và hiệu thành các đống riêng, không thấy phép bớt

- Vị trí: visual `hieu-24-12-6` (`$.sections[8].blocks[0]`), `hieu-chia-het-tom-tat` (recap section, card `hieu-chia-het`), `hieu-24-10-6` (`$.sections[9].blocks[0]`), `hieu-khong-tom-tat` (recap `hieu-khong-chia-het`); kiểu `sumBars` với `op: "minus"` trong `sum-bars.tsx` - LL-15
- Nguồn: —
- Vấn đề: caption "Bớt 12 cái khỏi 24 cái" nhưng hình vẽ ba hàng rời 24, 12, 12 (48 cái trên màn, `phone/105-s9-01-block-end.png`, `112-s9-06-recap.png`); nhãn aria "Hai nhóm 24 và 12 cái". Trẻ thấy ba đống cộng lại.
- Sửa: với `op: "minus"`, vẽ một hàng số bị trừ, làm mờ hay gạch các túi của số trừ ngay trên hàng đó, phần còn lại mang nhãn hiệu.

### 20. Dấu "không chia hết" lệch phải, sát số chia

- Vị trí: macro `\khongchiahet` trong `src/lib/tex.ts` (`\mathrel{\mathrlap{/}\vdots}`); mọi công thức dùng nó, vd `$.exercises[7]` (`ex.chon-dung-45-9`, `phone/024-s2-04-exercise-chon-dung-45-9.png`), `$.exercises[40]` (`ex.chon-nhieu-tong-khong-5`, `phone/100-s8-06-...png`), visual `tong-khong-tom-tat` (`ipad/102-s8-07-recap.png`)
- Nguồn: tr.30 (`sbt-p30.png`: gạch chéo nằm giữa ba chấm)
- Vấn đề: `\mathrlap` đặt gạch từ mép trái ba chấm rồi tràn phải; gạch không chạm số (reviewer nhóm 3 thấy đạt ở điểm này) nhưng khe trái rộng, khe phải hẹp, nên "(15 + 7) ⋮̸5" trông như "/5". Khoảng hai bên khác dấu ⋮ ở dòng trên. Trẻ vừa học phép chia dễ đọc thành phép chia hay phân số.
- Sửa: căn giữa gạch trên ba chấm, vd `\mathrel{\vdots\mathllap{/\mkern1mu}}` hoặc bọc `\mathclap{/}` trong hộp rộng bằng `\vdots`; chụp lại để khoảng hai bên ⋮̸ bằng ⋮.

### 21. `sourceRef` trỏ sai trang hoặc thiếu trang, section và card lệch nhau

- Vị trí: `$.sections[11].sourceRef`, `$.cards[11].sourceRef` (`so-du`: "tr.30"); `$.sections[12]`, `$.cards[12]` (`nhom-so-hang`: "tr.31"); `$.sections[10]`, `$.cards[10]` (`tim-x`: "tr.30, 31"); `$.sections[8]`, `$.cards[8]` (`hieu-chia-het`: "tr.31"); `$.sections[9]`, `$.cards[9]` (`hieu-khong-chia-het`: "tr.31"); `$.sections[6].sourceRef` ("tr.30") khác `$.cards[6].sourceRef` ("tr.30, 31")
- Nguồn: `sbt-p30.png`, `sbt-p31.png`, `sbt-p32.png`
- Vấn đề: ví dụ 2 (số dư) ở tr.31, câu 2.10 ở tr.32, tr.30 không có số dư; câu 2.9 (nhóm luỹ thừa) ở tr.32; câu 2.8 ở tr.32; tính chất của hiệu có ở "Kĩ năng" tr.30 và câu 2.7 tr.31.
- Sửa: `so-du` "Sách bài tập tr.31, 32"; `nhom-so-hang` "tr.32"; `tim-x` "tr.30–32"; `hieu-chia-het`, `hieu-khong-chia-het` "tr.30, 31"; `tong-chia-het` thống nhất section và card. Sửa cả section lẫn card.

### 22. Quy tắc số dư thiếu điều kiện "b chia hết cho số đang xét"

- Vị trí: `$.sections[11].blocks[1].children[0]`, `$.sections[11].recap`, `$.cards[11].recap` (`so-du`) - LL-06
- Nguồn: ví dụ 2 tr.31 (`sbt-p31.png`); câu 2.10 tr.105 (`sbt-p105.png`)
- Vấn đề: câu cần nhớ chỉ là thủ tục; bước quyết định (b chia hết cho số đang xét thì b · q chia hết cho số đó) chỉ nằm trong ví dụ. Mọi bài tập đều hỏi số là ước của b, nên trẻ có thể áp cho số không phải ước của b (như 10 · q + 4 và số 3) rồi kết luận bừa.
- Sửa: "Số a = b · q + r. Nếu b chia hết cho một số thì b · q cũng chia hết cho số đó; khi đó xét số dư r rồi dùng tính chất của tổng." (gộp với cách gọi số chia chọn ở Nghiêm trọng 8).

### 23. Câu chuyện bi của Nam không có kết, hiện sẵn tổng 34, lẫn "cái" và "viên"

- Vị trí: `$.sections[11].blocks[0]` (visual `so-du-34-10`), `$.sections[11].blocks[2].children[0]`, `$.sections[11].blocks[3].children[0]` - LL-16, LL-10
- Nguồn: ví dụ 2 tr.31
- Vấn đề: hình ghi "34 cái bi, mỗi túi 10 cái", caption ghi "10 viên ... 4 viên". Hình cho tổng 34 nên trẻ chia thẳng 34 cho 2, không thấy vì sao phải viết a = 10 · q + 4 với q chưa biết. Hai màn sau không quay lại Nam.
- Sửa: hình không ghi tổng (vài túi và "?" túi, thừa 4 viên), một đơn vị "viên". Thêm câu kết: "Vậy Nam chia đều được số bi cho 2 bạn, nhưng không chia đều được cho 5 bạn."

### 24. Màn mở đầu `tim-x` không nói phải tìm gì và xét chia hết cho mấy

- Vị trí: `$.sections[10].blocks[0]` (visual `tim-x-mau`, caption "Cho tổng A = 20 + 36 + x, với x là số tự nhiên.") - LL-10
- Nguồn: ví dụ 1 tr.30
- Vấn đề: caption chỉ cho tổng, không có câu hỏi; bấm "Bước tiếp" thì hiện "20 ⋮ 4", số 4 không rõ từ đâu.
- Sửa: "Cho tổng A = 20 + 36 + x. Tìm x để A chia hết cho 4, và để A không chia hết cho 4."

### 25. `nhom-so-hang`: hình 4 số hạng đứng trước quy tắc, bỏ qua bước đặt thừa số chung

- Vị trí: `$.sections[12].blocks[0]` (visual `nhom-5-mu`), `$.sections[12].blocks[1]`, `$.sections[12].blocks[2]` (visual `nhom-2-mu`) - LL-16, LL-09
- Nguồn: câu 2.9 tr.32, lời giải tr.105
- Vấn đề: (a) màn đầu chạy 5 + 5² + 5³ + 5⁴ trước khi có quy tắc và ví dụ hai số hạng. (b) Không màn nào viết 5 + 5² = 5 · 1 + 5 · 5 = 5 · (1 + 5), 5⁴ = 5³ · 5; "đặt thừa số chung ra ngoài ngoặc" là tính chất phân phối đọc ngược, Bài 5 chỉ dạy chiều xuôi. (c) "Thừa số chung" chưa được giải thích.
- Sửa: màn quy tắc (hai số hạng) lên đầu, hình 4 số hạng sau. Thêm dòng "= 5 · 1 + 5 · 5" và câu ngắn trong note: "5² = 5 · 5, nên 5 có mặt ở cả hai số hạng, gọi là thừa số chung." Hình thêm bước "5⁴ = 5³ · 5".

### 26. Câu kiểm tra nhóm luỹ thừa: đề khó đọc, nhiễu loại được bằng mẹo

- Vị trí: `$.exercises[63].prompt[0]`, `options[1]`, `options[2]` (`ex.chon-nhom-3-mu`) - LL-10, LL-14
- Nguồn: —
- Vấn đề: "Chọn cách viết bằng 3 + 3² + 3³ + 3⁴ mà mỗi nhóm có thừa số 4" khó hiểu; đề đã cho thừa số 4 nên trẻ loại ngay hai nhiễu không có 4.
- Sửa: "3 + 3² + 3³ + 3⁴ bằng biểu thức nào?"; nhiễu theo lỗi thật: `3 \cdot 4 + 3^{2} \cdot 4`, `3 \cdot 3 + 3^{3} \cdot 3`, `3 \cdot 4 + 3^{3} \cdot 5`. `check.expr` giữ.

### 27. Câu "a = 18 · q + 9": lựa chọn c hai cách hiểu, đề "Nói nào đúng?"

- Vị trí: `$.exercises[61].prompt[0]`, `options[2]` (`ex.chon-du-18-9`) - LL-10
- Nguồn: —
- Vấn đề: "a không chia hết cho cả 3 và 6" đọc được là "không chia hết cho số nào" (sai) hoặc "không chia hết cho cả hai cùng lúc" (đúng). "Nói nào đúng?" không tự nhiên.
- Sửa: đề "Câu nào đúng?"; lựa chọn c "a không chia hết cho 3, cũng không chia hết cho 6".

### 28. Câu luyện `dien-8-mu` chỉ hỏi 1 + 8

- Vị trí: `$.exercises[64]` (`ex.dien-8-mu`)
- Nguồn: —
- Vấn đề: `segments` in sẵn "8 + 8² = 8 · (1 + 8) = 8 · ___"; câu luyện đầu của card không hỏi gì về chia hết.
- Sửa: bớt chữ in sẵn để trẻ tự viết 8 · (1 + 8), hoặc đổi sang `choice` "8 + 8² chia hết cho số nào?" với 5, 7, 9, 10 (chỉ 9 đúng; tránh lựa chọn 8), đặt `check`.

## Góp ý

### 1. "Đếm cách" không phải cách nói quen; section `tim-boi` có hai cách tìm bội mà quy tắc chỉ nói một

- Vị trí: `$.sections[2].blocks[0].caption`, `[1].caption`, `$.sections[2].blocks[2].children[0].text`, recap `kiem-tra`; `$.sections[5].blocks[0].caption` ("Đếm cách 4 từ 0 để tìm các bội"), `$.sections[5].blocks[2].children[0].text` so với note `rule` `$.sections[5].blocks[1]` (nhân lần lượt)
- Nguồn: —
- Vấn đề: tiểu học dạy "đếm thêm 6"; câu quy tắc lẫn "đếm cách" và "nhảy qua". Section `tim-boi` mở bằng đếm cách, quy tắc và recap lại chỉ nói nhân với 1, 2, 3.
- Sửa: một cách nói, vd "Nhảy từng bước bằng số chia từ 0: dừng đúng ở số bị chia thì chia hết, nhảy qua thì không." Ở `tim-boi`, note nối hai cách ("đếm thêm 4 cũng chính là nhân 4 với 1, 2, 3").

### 2. Câu quy tắc số dư thiếu chủ ngữ

- Vị trí: `$.sections[2].blocks[3].children[0].text`, recap `kiem-tra`
- Nguồn: —
- Vấn đề: "Chia cho số chia, số dư bằng 0 thì chia hết." không nói chia số nào.
- Sửa: "Chia số bị chia cho số chia, được số dư bằng 0 thì chia hết." (sửa cả recap).

### 3. Đề `chon-nhieu-tui-5` diễn đạt gượng

- Vị trí: `$.exercises[3].prompt[0].text` (`ex.chon-nhieu-tui-5`) - LL-19
- Nguồn: —
- Vấn đề: "số kẹo có thể chia hết vào các túi 5 cái" ghép "chia hết" với "vào túi".
- Sửa: "Chọn tất cả số kẹo xếp vào các túi 5 cái vừa hết, không còn thừa."

### 4. Hàng công thức trong hình số dư xếp sát sai nhóm

- Vị trí: `$.sections[2].blocks[3].children[1]` (visual `chia-du-52-4`) - LL-12
- Nguồn: —
- Vấn đề: dòng "52 ⋮ 4" nằm sát dòng "53 : 4" bên dưới hơn dòng "52 : 4" bên trên (`phone/033-s3-04-block.png`).
- Sửa: tách hai cặp thành hai khối có khoảng cách rõ, hoặc đặt kết luận cùng hàng với phép chia. Sửa cùng mục Nghiêm trọng 1.

### 5. Hình ước bội tô thừa số còn lại màu "thương" trong khi note nói cả hai là ước

- Vị trí: `$.sections[3].blocks[0]` (visual `uoc-boi-15-3`), recap `uoc-boi-tom-tat`; so với `$.sections[3].blocks[2]`
- Nguồn: —
- Vấn đề: 15 = 3 · 5 với 5 màu cam, 18 = 6 · 3 với 3 màu cam, không chú thích; màn sau tô cả 6 và 4 màu tím trong 24 = 6 · 4. Trẻ có thể hiểu 5 hay 3 không phải ước.
- Sửa: thêm chú thích "Thương" cho số màu cam, hoặc nói rõ ở màn 24 = 6 · 4 rằng thương cũng là một ước.

### 6. Lặp số giữa các card

- Vị trí: `$.exercises[21]` (`ex.chon-boi-7`, đáp án 21) với `$.exercises[16]` (`ex.dien-uoc-21-7`); `$.exercises[15]` (`ex.chon-dung-54`) với `$.exercises[19]` (`ex.chon-goi-9-54`); recap `kiem-tra-tom-tat` (28 = 4 · 7) với `$.exercises[2]` (`ex.chon-chia-het-28-7`); `$.exercises[38]` (`ex.dien-tong-7`) với `$.exercises[34]` (`ex.tong-14-21`); `$.exercises[51]` (`ex.chon-hieu-khong-9`, "36 − 18") với `$.exercises[44]` (`ex.hieu-36-18-9`) - LL-07
- Nguồn: —
- Vấn đề: không cùng card (hoặc câu kiểm tra không gắn card) nên không trái luật, nhưng phiên ôn trộn card có thể hỏi liền cùng một sự kiện chia hết.
- Sửa: đổi một bên mỗi cặp: `chon-boi-7` lấy 49; `chon-goi-9-54` đổi thành 63 : 9 = 7; recap `kiem-tra` đổi bộ số chưa dùng; `dien-tong-7` đổi sang 16 + 40 cho 8; `chon-hieu-khong-9` bỏ 36 − 18.

### 7. `chon-hieu-khong-9`: ba nhiễu cùng bằng 18

- Vị trí: `$.exercises[51].options` (`ex.chon-hieu-khong-9`) - LL-14
- Nguồn: —
- Vấn đề: tính một nhiễu là đoán được cả ba.
- Sửa: nhiễu khác nhau, như 63 − 27, 72 − 45, 54 − 18.

### 8. Nhiễu "Thương của 54", "Số dư của 54" không có nghĩa

- Vị trí: `$.exercises[19].options[2]`, `[3]` (`ex.chon-goi-9-54`) - LL-14
- Nguồn: —
- Vấn đề: "thương của 54" không phải cụm có nghĩa, trẻ loại được mà không cần hiểu ước.
- Sửa: nhiễu theo lỗi thật ("Bội của 54", "Số bị chia"), hoặc hỏi "54 là gì của 9?" để nhiễu "Ước của 9" có lý.

### 9. Note màn chọn bội của 5 chỉ gợi nhân với 1, 2, 3

- Vị trí: `$.sections[5].blocks[3].children[0].text`
- Nguồn: —
- Vấn đề: nhân với 1, 2, 3 chỉ ra 5, 10, 15; chip đúng 25, 30, 40 cần nhân với 5, 6, 8.
- Sửa: "Nhân 5 với 1, 2, 3 và cứ thế tiếp giúp bạn nhận ra các bội."

### 10. Đáp án `mua-hop-10-15` trùng số trong đề

- Vị trí: `$.exercises[36]` (`ex.mua-hop-10-15`)
- Nguồn: —
- Vấn đề: đáp án 5 hộp trùng "hộp 5 cái"; trẻ nhập nhầm cỡ hộp vẫn được chấm đúng.
- Sửa: đổi số, vd 10 và 20 cái vào hộp 5 cái (6 hộp).

### 11. Nấc 1 tô cả đề ở câu có hai câu chữ

- Vị trí: `hints.highlight` của `ex.chon-so-hang-khong-7`, `ex.tim-tui-40-16`, `ex.mua-hop-10-15`, `ex.du-tong-30-4`
- Nguồn: —
- Vấn đề: đề có dữ kiện và câu hỏi, nấc 1 tô cả khối nên không chỉ chỗ cần nhìn lại.
- Sửa: tách phép tính vào khối `formula` có `\htmlId` và trỏ `target: "part"` vào phần hay sai.

### 12. Card hiệu gắn khái niệm "Số chia" dù hình và quy tắc nói về số bị trừ, số trừ

- Vị trí: `$.cards[8].conceptIds`, `$.cards[9].conceptIds`
- Nguồn: —
- Vấn đề: glossary có "số bị trừ" (violet), "số trừ" (pink), "hiệu" (teal) nhưng bài không khai; section tổng có "Số hạng", "Tổng".
- Sửa: tuỳ tác giả; nếu thêm thì tránh trùng màu (violet đang là "Số chia" trong bài), chỉ thêm "Hiệu" (teal) hoặc giữ nguyên.

### 13. "Mỗi thừa số trong các tích là một ước" không nhắc lại nghĩa "thừa số"

- Vị trí: `$.sections[4].blocks[1].children[0].text`
- Nguồn: —
- Vấn đề: thuật ngữ chuẩn, đã học; với trẻ yếu có thể thêm nhãn.
- Sửa: tuỳ tác giả: chú giải "▲ Thừa số" cho hình `tim-uoc-18`.

### 14. Câu kho ôn `du-hieu-50-8` không luyện quy tắc của card

- Vị trí: `$.exercises[50]` (`ex.du-hieu-50-8`)
- Nguồn: —
- Vấn đề: tìm số dư của 42 chia 5 là luyện phép chia có dư (section `kiem-tra`), không phải quy tắc hiệu không chia hết.
- Sửa: "Hiệu 50 − 8 có chia hết cho 5 không?" hoặc tìm số trong một tập để hiệu không chia hết (kiểu câu 2.7, số khác).

### 15. Đề `chon-nhieu-24q-12` kết câu bằng "cho"

- Vị trí: `$.exercises[60].prompt[0]` (`ex.chon-nhieu-24q-12`) - LL-19
- Nguồn: —
- Vấn đề: "Chọn tất cả số mà a chia hết cho." đọc gượng.
- Sửa: "Số a = 24 · q + 12, với q là số tự nhiên. a chia hết cho những số nào? Chọn tất cả."

### 16. Lint chia hết: thiếu chặn số không nguyên, thiếu test vế có ngoặc, luỹ thừa

- Vị trí: `src/content/lint/expr.ts` (`DIVISIBILITY`), `tests/content/lint.test.ts`
- Nguồn: —
- Vấn đề: `a % b` với số thập phân cho "chia hết" dù quan hệ chỉ định nghĩa cho số tự nhiên; test chỉ dùng số trần, trong khi bài dùng `(9 + 9^{2}) \chiahet 5`.
- Sửa: trả `undefined` khi `a` hoặc `b` không nguyên; thêm ca test có ngoặc và luỹ thừa.

### 17. `nhom-2-mu` bỏ bước viết ngoặc nhóm mà `nhom-5-mu` có

- Vị trí: `$.sections[12].blocks[2]` (visual `nhom-2-mu`)
- Nguồn: —
- Vấn đề: `nhom-5-mu` có dòng "= (5 + 5²) + (5³ + 5⁴)", `nhom-2-mu` nhảy thẳng sang dạng đã đặt thừa số chung; hai ví dụ liền nhau làm khác bước.
- Sửa: thêm "= (2 + 2²) + (2³ + 2⁴)" vào `nhom-2-mu`.
