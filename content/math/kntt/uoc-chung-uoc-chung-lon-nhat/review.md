# Review: Ước chung. Ước chung lớn nhất (`uoc-chung-uoc-chung-lon-nhat`)

- Bài: `content/math/kntt/uoc-chung-uoc-chung-lon-nhat/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff`), section: 6 section mới `viet-tu-uclnn`, `cap-so-gioi-han`, `cap-so-tong`, `cap-so-tich`, `cung-so-du`, `so-du-lon-nhat` (6 card cùng tên, 30 bài tập mới, 35 hình mới, 1 khối `tip`)
- Nguồn đã đọc: `sources/math/uoc-chung-uoc-chung-lon-nhat/` - sbt-p38 (kiến thức bổ sung 5, 6; ví dụ 1), sbt-p39 (lời giải ví dụ 1), sbt-p40 (đề 2.41-2.43), sbt-p108 (lời giải 2.41-2.43)
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường), 1 cảnh báo ("43 id(s) not in ids.lock.json")
- Đọc hiểu (Haiku, lượt 1): chưa chạy, sẽ chạy sau vòng này (chữ của 6 section mới là chữ đổi)
- `lesson:walk`: 0 FAIL ở lượt chạy trước, ảnh ở cây tạm (không nằm trong `.shots/walk/`); đã đọc sheet điện thoại của 6 section mới (`walk-phone-s14` đến `s19`) và sheet từng bước của hình mới (`phone-*`)
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng (1 Nghiêm trọng, 10 Nên sửa, 9 Góp ý); đã ghi "Bản đã review" bằng `--mark`, chưa `--approve`, chưa `content:lock`
- Bản đã review: `ef444cbaac698034c403e1da58859fa0537f8aea143b4d3b25983100135c5ee2` (`pnpm content:diff` so với bản này)

Đã soát: toàn bộ diff (6 section, 6 card, 30 bài tập, 35 hình trong `catalog.ts`, khối `tip`, 6 recap) theo 5 trục, "Luật gợi ý 3 nấc" và các mục lessons-learned LL-01, 05, 06, 07, 08, 09, 10, 14, 15, 17, 18, 19, 21, 24.

- Toán: tự giải bằng chương trình (gcd, liệt kê cặp, số dư) mọi `answer`, từng nhiễu và từng lý do `wrong` của 30 bài tập; kiểm các cặp của hình `chips` (`wants` của `cap-chon-4-12`, `tong-chon-10`, `tich-chon-18`, `du-chon-5`, `du-lon-chon-25-43` đều đúng), số trong mọi hình `notation`/`lines`/`rows` (hình lời giải khớp số của đề; hình gợi ý nấc 2 dùng số khác đề và dừng ở "?"). Đáp án, nhiễu, `wrong` đều đúng; không có câu hai đáp án đúng ở dạng chọn.
  - `cap-9-30` = 3 cặp (9-18, 9-27, 18-27); `chon-cap-uclnn-4` = {4 và 12, 12 và 16}; `tong-28-uclnn-4` = {4 và 24, 8 và 20}; `tong-40-uclnn-8` = 2 (8-32, 16-24); `tong-64-uclnn-16` a = 16 (16-48); `tich-200-uclnn-5` b = 40 (5-40); `tich-108-uclnn-3` = {3 và 36, 9 và 12}; `tich-180-uclnn-6` số lớn 30 (6-30); `cung-du-6` = 14 và 26; `cung-du-7` = {9 và 23, 12 và 40}; `so-cung-du-20` x = 26 (duy nhất trong 21..31); `cung-du-30` = 18; `so-du-31-55` a = 24; `so-du-14-26-50` a = 12; `chon-a-26-50` = {4, 6}; `so-du-11-41-71` a = 30.
- Không chép: số của sách (17 và 60, 96 và 16, 384 và 8, 397; 509; 677, 480; 720) không có trong 6 section; chỉ ƯCLN 16 và 8 của hai câu ôn trùng với sách (xem Góp ý 6).
- Kiến thức bổ sung (kí hiệu "nếu ƯCLN(a, b) = d thì a = dm, b = dn") được dạy bằng số cụ thể (12 và 18, 12 và 24) trước khi đưa chữ d, m, n; không dùng ký hiệu tập hợp hay (a, b). Quy tắc `rule` của 6 section đều đúng toán; recap lặp nguyên văn câu quy tắc.

### Bảng mẹo `tip.cung-so-du` (section `cung-so-du`)

Mẹo: "lấy số lớn trừ số bé, hiệu chia hết cho a thì hai số cùng số dư". Ghi số đã thử dưới dạng (số, số, a).

| Đầu vào | Dư của từng số | Hiệu, chia hết? | Mẹo cho kết quả |
|---|---|---|---|
| (19, 4, 5) | 4 và 4 | 15, có | đúng |
| (0, 6, 3) biên số 0 | 0 và 0 | 6, có | đúng |
| (7, 7, 4) hai số bằng nhau | 3 và 3 | 0, có | đúng |
| (2, 9, 7) số bé hơn số chia | 2 và 2 | 7, có | đúng |
| (1, 100, 9) số rất lệch | 1 và 1 | 99, có | đúng |
| (13, 31, 6) | 1 và 1 | 18, có | đúng |
| (10, 20, 1) số chia 1 | 0 và 0 | 10, có | đúng |
| (50, 5, 15) số chia lớn | 5 và 5 | 45, có | đúng |
| (3, 11, 4) | 3 và 3 | 8, có | đúng |
| (14, 23, 5) khác dư | 4 và 3 | 9, không | đúng (khác dư) |
| (15, 21, 7) khác dư | 1 và 0 | 6, không | đúng (khác dư) |

Mẹo đúng ở mọi đầu vào thử; điều kiện "hai số" nằm trong `text`; với ba số (`so-du-14-26-50`, `so-du-11-41-71`) mẹo áp cho từng cặp liền nhau, không mâu thuẫn quy tắc của `so-du-lon-nhat`. Mẹo không sai kiến thức nhưng bị trùng quy tắc (Nên sửa 6).

## Nghiêm trọng

### 1. Hai câu đếm cặp không nói cặp có thứ tự hay không, "3" và "6" cùng có thể đúng

- Vị trí: `$.exercises[cap-9-30].prompt[0].text` và `$.exercises[tong-40-uclnn-8].prompt[0].text` (`uoc-chung-uoc-chung-lon-nhat.ex.cap-9-30`, `uoc-chung-uoc-chung-lon-nhat.ex.tong-40-uclnn-8`); LL-10
- Nguồn: tr.40, `sbt-p40.png` (2.41-2.43); tr.108, `sbt-p108.png` (lời giải 2.42 và 2.43 đếm cả (16; 80) lẫn (80; 16))
- Vấn đề: đề "Hai số khác nhau ... Có bao nhiêu cặp số như vậy?" không nói 9 và 18 với 18 và 9 có tính là hai cặp không. Đáp án của bài là 3 (`cap-9-30`) và 2 (`tong-40-uclnn-8`), tính cặp không thứ tự; đếm có thứ tự như lời giải sách thì là 6 và 4. Màn dạy chỉ liệt kê "1 và 2 cho 5 và 10..." theo thứ tự bé trước, không nói quy ước đếm; hai câu `tong-28-uclnn-4`, `tong-64-uclnn-16`, `tich-200-uclnn-5` thì có "a nhỏ hơn b", riêng hai câu này không có. Bé trả lời 6 hay 4 bị chấm sai dù đọc đề hợp lý (cùng kiểu `so-nguyen-to` vòng 1, `ex.xep-7-cach`).
- Sửa: thêm vào đề, trong một khối `note` thứ hai (note quá 2 câu bị `[length]`): "Cặp 9 và 18 với cặp 18 và 9 chỉ tính là một cặp." (và "8 và 32" với "32 và 8" ở `tong-40-uclnn-8`). Dạy quy ước ngay ở màn đầu section `cap-so-gioi-han` (chỗ "Tìm các cặp số khác nhau") bằng một câu cùng ý để mọi đề dùng nó đều đã được dạy.

## Nên sửa

### 1. `chon-a-26-50` dùng lại số 26 và 50 của câu luyện `so-du-14-26-50` (LL-07)

- Vị trí: `$.exercises[chon-a-26-50].prompt[0].text` (`uoc-chung-uoc-chung-lon-nhat.ex.chon-a-26-50`, card `so-du-lon-nhat`)
- Nguồn: —
- Vấn đề: câu ôn hỏi 26 và 50 cho a; câu luyện của cùng card có 14, 26, 50 và `explain` của nó đã ghi "50 trừ 26 bằng 24". Làm xong câu luyện, bé chỉ việc nhớ hiệu 24 và ước của nó (4, 6 cũng là ước của 12 và 24). Phiên ôn hỏi lại đúng bộ số vừa luyện.
- Sửa: đổi sang bộ số chưa dùng, ví dụ "Chia 22 và 58 cho a được cùng số dư. Chọn tất cả các số a." với hiệu 36 và lựa chọn 4, 5, 6, 8 (đúng 4 và 6; 22 và 58 chia cho 5 dư 2 và 3, chia cho 8 dư 6 và 2).

### 2. `chon-cap-uclnn-4` lặp ƯCLN 4 và hai cặp của màn chạm `cap-chon-4-12` cùng section (LL-07)

- Vị trí: `$.exercises[chon-cap-uclnn-4].options` (`uoc-chung-uoc-chung-lon-nhat.ex.chon-cap-uclnn-4`) và `uoc-chung-uoc-chung-lon-nhat.visual.cap-chon-4-12`
- Nguồn: —
- Vấn đề: màn chạm có chips "4 và 12" (đúng) và "8 và 16" (sai), cũng với ƯCLN 4; câu ôn có đúng hai cặp này với cùng đúng sai. Bé chỉ cần nhớ màn trước thay vì viết thành 4 nhân m, 4 nhân n.
- Sửa: đổi ƯCLN và giới hạn, ví dụ ƯCLN 2, không vượt quá 14, lựa chọn 2 và 6, 4 và 6 (đúng), 4 và 8, 6 và 12 (sai: ƯCLN 4 và 6). Soát lại `wrong` theo số mới.

### 3. `cung-du-30`: ba nhiễu đều lẻ nên loại được bằng mẹo chẵn lẻ (LL-14)

- Vị trí: `$.exercises[cung-du-30].options` (`uoc-chung-uoc-chung-lon-nhat.ex.cung-du-30`)
- Nguồn: —
- Vấn đề: 30 chia 4 dư 2, số chia 4 là số chẵn nên số cần tìm phải chẵn. Đáp án đúng 18 là số chẵn duy nhất trong 18, 25, 27, 31; bé chọn 18 không cần lấy hiệu. Ở `cung-du-6` (14 và 26 so với 13 và 22, 15 và 20) chẵn lẻ cũng loại được hai nhiễu (Góp ý 2).
- Sửa: thay 27 bằng 28 (30 trừ 28 bằng 2, không chia hết cho 4), thêm `wrong` cho 28 ("30 trừ 28 bằng 2, không chia hết cho 4").

### 4. `tich-200-uclnn-5`, `tich-180-uclnn-6` buộc chia cho 25 và 36 (LL-18)

- Vị trí: `$.exercises[tich-200-uclnn-5]` và `$.exercises[tich-180-uclnn-6]`
- Nguồn: —
- Vấn đề: bé yếu nhân chia phải 5 · 5 = 25, rồi 200 : 25 = 8, rồi 5 · 8 = 40 (ba phép, một phép chia cho số hai chữ số); câu kia 6 · 6 = 36, 180 : 36 = 5, 6 · 5 = 30. Luật "Số nhỏ" cho tối đa 2 phép nhẩm. Dạng bài đã đủ khó ở bước m nhân n rồi loại cặp.
- Sửa: giữ dạng, đổi số cho phép chia gọn, ví dụ ƯCLN 3 và tích 72 (9 · m · n = 72, m · n = 8, chỉ 1 và 8 nhận, 2 và 4 loại, b = 24) và ƯCLN 6 và tích 144 (36 · m · n = 144, m · n = 4, chỉ 1 và 4, số lớn 24).

### 5. "Số nhân" là tên thứ ba của m, n, trong khi bài đã dùng "m, n" và "thừa số" (LL-05, LL-25)

- Vị trí: `$.exercises[viet-20-30].prompt[1].text` ("Hai số nhân đó là hai số nào?") và `explain` (cả `wrong` của phương án b: "là số nhân với 5"); `$.exercises[viet-21-35].explain.text`; `$.exercises[dien-viet-tu-uclnn].segments[0].text` và `explain.text` ("hai số nhân"); `$.exercises[chon-cap-uclnn-4].explain.text`; `$.exercises[xep-cap-3-12]` mục `s3` và `explain.text`; `$.exercises[tong-28-uclnn-4].explain.text` và `$.exercises[tich-108-uclnn-3].explain.text` ("các cặp số nhân")
- Nguồn: —
- Vấn đề: quy tắc và recap gọi hai số d nhân với là "m và n"; glossary và bài đã dạy "thừa số". Các câu bài tập lại gọi chúng "số nhân" (nghe như "số được nhân" hay số của phép nhân), một khái niệm hai tên; `viet-20-30` còn đứng sau màn quy tắc đã dùng m, n, và "là số nhân với 5" trong `wrong` dùng cùng cụm với nghĩa khác (nhân với 5).
- Sửa: dùng "m và n" ở mọi câu đứng sau màn quy tắc, ví dụ "Viết 20 và 30 thành 10 nhân m và 10 nhân n. Chọn m và n."; `dien-viet-tu-uclnn`: "... mỗi số bằng d nhân một số, và hai số m, n chỉ có ước chung là ..." hoặc "hai số nhân cùng d" đổi hết thành "m và n".

### 6. Khối `tip.cung-so-du` chỉ nhắc lại quy tắc ngay trên (mẹo gượng, LL-05)

- Vị trí: `$.sections[cung-so-du].blocks[2]` (`uoc-chung-uoc-chung-lon-nhat.tip.cung-so-du`)
- Nguồn: —
- Vấn đề: mẹo (đúng ở mọi đầu vào, xem bảng) nói "lấy số lớn trừ số bé, hiệu chia hết cho a thì cùng số dư", gần y câu quy tắc ở màn trước ("hiệu chia hết cho a thì hai số được cùng số dư") và câu chỉ dẫn ở màn chạm sau ("lấy số lớn trừ số bé rồi xem hiệu có chia hết cho 5 không"). Bé gặp cùng một ý ba lần liên tiếp; checklist coi mẹo chỉ nhắc quy tắc bằng chữ khác là mẹo gượng.
- Sửa: bỏ khối `tip`, hoặc đổi sang mẹo thật mới của dạng này, ví dụ "Muốn tìm số cùng số dư với 20 khi chia cho 6, cứ cộng thêm 6, 12, 18..." (đúng cho mọi số, `tex`: `20 + 6 = 26`; nhớ ghi "chia cho cùng một số" trong `text`) và khi đó thử lại mẹo trên ≥ 5 đầu vào gồm biên.

### 7. Hình `du-hieu` gắn nhãn "Ước chung" cho số chia a, trong khi 4 không là ước chung của 17 và 29 (LL-15)

- Vị trí: `uoc-chung-uoc-chung-lon-nhat.visual.du-hieu` (`legend`, `\concept{teal}{4}`, tag "chia hết cho 4, hai số cùng dư 1"); recap và màn quy tắc của section `cung-so-du`; card `uoc-chung-uoc-chung-lon-nhat.card.cung-so-du` (`conceptIds`: `concept.uoc-chung`); `explain.tex` của `cung-du-6` và `cung-du-30` (`\concept{teal}{6}`, `\concept{teal}{4}`)
- Nguồn: —
- Vấn đề: số 4 chia hết 12 (hiệu) và 16, 28 (sau khi bỏ số dư) nhưng không chia hết 17 hay 29, nên không là "ước chung" của hai số đó. Chú giải teal "Ước chung" ngay trên màn quy tắc và recap dạy bé hiểu a là ước chung của hai số (sai); vòng 5 đã ghi cùng kiểu lệch màu và lời (ƯCLN tô teal) ở `uc-lon-hon-1-32-40`, `chia-het-27-45`.
- Sửa: bỏ `\concept{teal}` và `legend` ở `du-hieu` và ở các `explain.tex` kể trên (a chỉ là "số chia", không có màu khái niệm); đổi `conceptIds` của card `cung-so-du` sang khái niệm đúng hoặc bỏ nếu schema cho phép. Section `so-du-lon-nhat` (a là ước chung của các hiệu) giữ màu teal.

### 8. Recap và quy tắc của `cap-so-gioi-han` thiếu bước chặn bởi giới hạn (LL-06)

- Vị trí: `$.sections[cap-so-gioi-han].blocks[1].children[0].text` và `$.sections[cap-so-gioi-han].recap.caption`, `$.cards[cap-so-gioi-han].recap.caption`
- Nguồn: tr.40 (2.41), tr.108
- Vấn đề: quy tắc "Muốn tìm hai số có ƯCLN là d, ta lấy d nhân m và d nhân n. Hai số m và n chỉ được có ước chung là 1." chỉ nói cách lập cặp, không nói bước đầu của dạng "không vượt quá N": liệt kê các số chia hết cho d và không quá N (d nhân 1, 2, ..., N chia d). Bước này chỉ có ở note ví dụ; bé ôn bằng recap sẽ không có cách chặn số cặp, trong khi đề của dạng này luôn có giới hạn.
- Sửa: thêm vào câu quy tắc (và recap, nguyên văn) ý "Số d nhân m không được quá giới hạn của đề, nên chỉ lấy m trong các số 1, 2, 3... đến hết giới hạn chia cho d", giữ hai câu.

### 9. Section `cap-so-gioi-han` không có tình huống đời sống (LL-16)

- Vị trí: `$.sections[cap-so-gioi-han].blocks[0]` và `uoc-chung-uoc-chung-lon-nhat.visual.cap-5-20-bang`
- Nguồn: —
- Vấn đề: năm section còn lại mở bằng dải băng, tấm bìa hay túi kẹo; section này chỉ có số trần ("Tìm các cặp số khác nhau, khác 0, không vượt quá 20, có ƯCLN là 5"), trong khi bé yếu nhân chia và nhanh quên. Câu dải băng `dai-bang-4-8` chỉ nằm ở kho ôn.
- Sửa: mở màn đầu bằng dải băng như section `viet-tu-uclnn`, ví dụ "Hai dải băng dài không quá 20 dm, đoạn dài nhất cắt vừa hết cả hai dải là 5 dm. Hai dải dài bao nhiêu dm?", rồi mới nêu "các cặp số".

### 10. `dai-bang-4-8`: "Dải dài dài bao nhiêu dm?" và "4 chung ước 2 với 2" (LL-19, LL-10)

- Vị trí: `$.exercises[dai-bang-4-8].prompt[1].text` và `$.exercises[dai-bang-4-8].explain.text`
- Nguồn: —
- Vấn đề: "Dải dài dài" lặp từ, bé có thể đọc là "dải dài, dài" hay sai một từ; "Dải dài hơn nhưng không quá 16 dm" đứng liền ngay trước. `explain` viết "4 chung ước 2 với 2", đọc ngược nghĩa (không nói 4 và 2 có ước chung lớn hơn 1).
- Sửa: "Dải còn lại dài hơn dải 8 dm nhưng không quá 16 dm. Dải còn lại dài bao nhiêu dm?"; `explain`: "... mà 4 và 2 còn chung ước 2, nên m bằng 3."

## Góp ý

### 1. `viet-21-35`: số ƯCLN trong hình gợi ý nấc 2 trùng đáp án (LL-02)

- Vị trí: `uoc-chung-uoc-chung-lon-nhat.visual.viet-goi-y-15-20` và `$.exercises[viet-21-35].answer`
- Nguồn: —
- Vấn đề: hình gợi ý "ƯCLN(15, 20) = 5, 15 = 5 · 3" có số 5 lớn nhất trên màn, đáp án của đề cũng là 5; bé điền 5 theo hình mà không tính.
- Sửa: dùng hình gợi ý với ƯCLN khác 5, ví dụ ƯCLN(18, 30) = 6 (18 = 6 · 3).

### 2. Nhiễu yếu ở `viet-20-30` (phương án "5 và 6") và `cung-du-6` (LL-14)

- Vị trí: `$.exercises[viet-20-30].options[3]`, `$.exercises[cung-du-6].options`
- Nguồn: —
- Vấn đề: "5 và 6" không ứng với lỗi nào (10 nhân 5, 10 nhân 6 là 50, 60); ở `cung-du-6` hai nhiễu cặp khác chẵn lẻ (13 và 22, 15 và 20) loại được ngay vì số chia 6 chẵn.
- Sửa: "5 và 6" đổi thành "20 và 30" (bé lấy chính hai số, lỗi hay gặp); `cung-du-6` đổi "15 và 20" thành "16 và 26" (cùng chẵn, hiệu 10 không chia hết cho 6; thêm `wrong`: "26 trừ 16 bằng 10, không chia hết cho 6").

### 3. Câu luyện `cap-9-30`, `tong-28-uclnn-4`, `tong-40-uclnn-8` không cần bước "loại cặp chung ước"

- Vị trí: `$.sections[cap-so-gioi-han].practiceIds`, `$.sections[cap-so-tong].practiceIds`
- Nguồn: tr.108 (2.42 có loại 2 và 4, 3 và 3)
- Vấn đề: `cap-9-30` (m là 1, 2, 3) và hai câu tổng (m cộng n bằng 7 và 5) đều không có cặp nào bị loại; bé làm đúng chỉ bằng cách ghép đôi. Bước chính của dạng bài (loại cặp còn chung ước) chỉ được rèn ở `cap-uclnn-7`, `chon-cap-uclnn-4`, `xep-cap-3-12` và `tong-64-uclnn-16`.
- Sửa: đổi `cap-9-30` sang ƯCLN 8, không vượt quá 32 (m từ 1 đến 4, loại 2 và 4: 5 cặp) và cho câu tổng một đề có m cộng n là hợp số, ví dụ tổng 27 và ƯCLN 3 (m cộng n bằng 9, loại 3 và 6; ba cặp 3-24, 6-21, 12-15). Khi đổi, soát lại hình gợi ý và lời giải theo số mới.

### 4. Số của câu ôn lặp ví dụ hay mẹo cùng section (LL-07)

- Vị trí: `uoc-chung-uoc-chung-lon-nhat.visual.du-lon-chon-25-43` (25 và 43 là ví dụ ở `du-lon-25-43`), `uoc-chung-uoc-chung-lon-nhat.visual.du-chon-5` (chip "19 và 31", số 19 của ví dụ `tip`)
- Nguồn: —
- Vấn đề: màn chạm của `so-du-lon-nhat` hỏi lại đúng 25 và 43 vừa giải ở màn một; bé chỉ nhớ "ước của 18". Màn chạm `du-chon-5` dùng 19 như ví dụ trong khối mẹo ngay trước.
- Sửa: đổi màn chạm sang cặp khác (ví dụ 21 và 45, hiệu 24); đổi chip "19 và 31" thành "17 và 31" nếu giữ ví dụ mẹo.

### 5. Hình gợi ý `cap-goi-y-6-24` nói "còn chung ước 12", màn dạy nói "2 và 4 còn chung ước 2" (LL-05)

- Vị trí: `uoc-chung-uoc-chung-lon-nhat.visual.cap-goi-y-6-24` (`lines[1]`)
- Nguồn: —
- Vấn đề: cùng bước loại cặp, màn dạy lập lý do ở m và n, hình gợi ý lập lý do ở hai số (12 và 24); hai cách nói cho một bước.
- Sửa: "Bỏ cặp 2 và 4 vì còn chung ước 2" (m và n).

### 6. `tong-64-uclnn-16`, `tong-40-uclnn-8` giữ ƯCLN của đề sách (LL-08)

- Vị trí: `$.exercises[tong-64-uclnn-16].prompt[0].text`, `$.exercises[tong-40-uclnn-8].prompt[0].text`
- Nguồn: tr.40 (2.42 có ƯCLN 16, 2.43 có ƯCLN 8)
- Vấn đề: đề đã đổi tổng (64, 40) nên không chép, nhưng ƯCLN 16 của 2.42 và ƯCLN 8 giữ nguyên; luật không chép là giữ dạng, đổi số.
- Sửa: đổi ƯCLN 16 thành 12 (tổng 60: m cộng n bằng 5) hoặc 14, ƯCLN 8 thành 9 (tổng 45: m cộng n bằng 5).

### 7. Phần tổng quan chưa nhắc 6 phần mới

- Vị trí: `$.overview.goals`, `$.overview.summary`
- Nguồn: —
- Vấn đề: `goals` và `summary` chỉ có tìm ước chung, ƯCLN, chia đều, rút gọn; sáu section mới dạy thêm cách viết hai số từ ƯCLN, tìm cặp số khi biết giới hạn, tổng, tích và số lớn nhất cùng số dư. Đổi chữ tổng quan kéo theo thu lại lời đọc `overview.m4a` nên chỉ là góp ý.
- Sửa: thêm một mục vào `goals` ("dùng ƯCLN để tìm hai số khi biết tổng, tích hay số dư") khi có đợt thu lời đọc lại.

### 8. Chữ a có hai nghĩa giữa các section

- Vị trí: `$.sections[viet-tu-uclnn..cap-so-tich]` (a, b là hai số) và `$.sections[cung-so-du]`, `$.sections[so-du-lon-nhat]` (a là số chia)
- Nguồn: tr.38 (ví dụ 1 dùng a là số chia)
- Vấn đề: cùng chữ a gọi hai thứ khác nhau; mỗi section tự nhất quán nên chỉ là góp ý.
- Sửa: nếu muốn gọn, đổi số chia thành chữ khác (sách dùng a, nên cũng có thể giữ).

### 9. Hai chi tiết nhỏ trên màn

- Vị trí: `$.exercises[viet-20-30].explain.tex`, `$.exercises[cap-9-30].explain.tex` (`gathered` ba dòng xuống dòng giữa "9 ·" và "2" trên điện thoại, ảnh `201-s15-06-exercise-cap-9-30-correct` và `185-s14-05-exercise-viet-20-30-correct`); `$.exercises[cap-9-30].explain.tex` không tô amber 9 là ƯCLN như các `explain` khác
- Nguồn: —
- Vấn đề: khung `explain` xếp `gathered` ngang rồi ngắt dòng giữa phép tính (bố cục app, báo người làm app; cách viết `gathered` đã chốt trong `pitfalls.md`). Riêng chỗ `9 = 9 · 1` không tô màu ƯCLN.
- Sửa: báo người làm app. Ở `cap-9-30` viết `9 = \concept{amber}{9} \cdot 1` cho nhất quán màu.
