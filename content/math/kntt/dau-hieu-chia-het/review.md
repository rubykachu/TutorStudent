# Review: Dấu hiệu chia hết (`dau-hieu-chia-het`)

- Bài: `content/math/kntt/dau-hieu-chia-het/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song (nhóm 1: section 1–5, nhóm 2: section 6–10, nhóm 3: section 11–14) + tổng hợp
- Nguồn đã đọc: `sources/math/dau-hieu-chia-het/` - sbt-p33, sbt-p34, sbt-p105, sbt-p106
- `content:check`: 0 lỗi; còn cảnh báo id chưa khoá (bài chưa xuất bản)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/dau-hieu-chia-het/`
- Kết luận: Chưa đạt: còn 2 lỗi Nghiêm trọng
- Bản đã review: `76391b461a29ccf9847d0f0bc4080fd33e96f209168a51dd819e3fbe0af91542` (`pnpm content:diff` so với bản này)

Mọi bài tập đã được tự giải trước khi đọc `answer`: mọi câu `choice`, `numeric`, `fillBlank`, `match`, `order` có đúng một đáp án (hay đúng một tập khi `multiple`); `xep-1530`, `xep-tong-3410`, `xep-tong-3524`, `xep-lap-375` nay là chuỗi phụ thuộc, chỉ một thứ tự đúng; các câu `manipulate` được validator `chia-het` nhận đủ chữ số đúng. Năm Nghiêm trọng của vòng 1 đã sửa đúng. Câu quy tắc của 14 section trùng nguyên văn recap section và recap card. Tổng hợp đã tự kiểm hai Nghiêm trọng dưới đây trên `lesson.json`, `catalog.ts`, ảnh walk và `sbt-p34.png`: cả hai đúng.

## Nghiêm trọng

### 1. Câu quy tắc `luy-thua-10` sai khi phép cộng có nhớ

- Vị trí: `$.sections[9].blocks[0].children[0].text` (note `rule`), `$.sections[9].recap.caption`, `card.luy-thua-10` recap (section `luy-thua-10`) - LL-17
- Nguồn: tr.34 câu 2.21–2.22, `sbt-p34.png`; lời giải tr.106, `sbt-p106.png` (sách chỉ cộng 1, 2, 7, 8)
- Vấn đề: "Cộng thêm một số thì tổng các chữ số là 1 cộng tổng các chữ số của số được thêm" sai khi cộng có nhớ: 10 + 95 = 105 có tổng các chữ số 6, không phải 1 + 9 + 5 = 15; 10⁰ + 9 = 10 có tổng 1, không phải 10. Đây là câu quy tắc và recap, trẻ nhớ như điều luôn đúng. Vế đầu "là số 1 theo sau các chữ số 0" cũng khó đọc.
- Sửa: giới hạn đúng phạm vi bài dùng (mọi câu của section cộng số có một chữ số), sửa note, recap section, recap card cùng một câu, vd: "Luỹ thừa của 10 viết bằng chữ số 1 và các chữ số 0, nên tổng các chữ số của nó bằng 1. Cộng thêm một số có một chữ số thì tổng các chữ số là 1 cộng với số đó." (10⁰ + 9 vẫn sai với câu này nếu bài có 10⁰; bài hiện không dùng 10⁰, có thể ghi "10, 100, 1 000, …" thay cho "luỹ thừa của 10".) Sửa hình recap cùng lúc (Nên sửa 9). Soát lại `[rule-sentence]`.

### 2. Màn quy tắc và recap `diem-thi` đặt số điểm báo sai ngay dưới "Điểm cả bài", đọc như kết quả phép tính

- Vị trí: visual `dau-hieu-chia-het.visual.tom-tat-diem` (recap `$.sections[11].recap`, `card.diem-thi`), visual `dau-hieu-chia-het.visual.diem-chia-het-3` (`$.sections[11].blocks[1]`) - LL-15
- Nguồn: tr.33–34 ví dụ 2, `sbt-p33.png`, `sbt-p34.png`
- Vấn đề: recap có bốn hàng `12 ⋮ 3`, `3 ⋮ 3`, `(12 · 2 − 3 · 5) ⋮ 3` nhãn "Điểm cả bài", rồi `31 ⋮̸ 3` nhãn "Chắc chắn tính sai" (ảnh `phone/148-s12-06-recap.png`). Không hàng nào nói 31 là số ai đó báo; trẻ đọc thành điểm cả bài là 31 (thật ra 12 · 2 − 3 · 5 = 9), thấy cùng một điểm vừa chia hết vừa không chia hết cho 3. Màn quy tắc `diem-chia-het-3` cũng vậy (`6 · 7 − 3 · 2` rồi `29 ⋮̸ 3`, trong khi màn trước vừa tính điểm của Lan là 36; ảnh `phone/142-s12-02-block.png`). Recap được gặp lại một mình trong phiên ôn, không có màn trước làm bối cảnh: trẻ học chậm nhớ sai phép tính.
- Sửa: hàng 3 ghi luôn kết quả `12 · 2 − 3 · 5 = 9 ⋮ 3`, nhãn "Điểm cả bài, chia hết cho 3"; hàng 4 nhãn "Bạn báo 31 điểm: 31 không chia hết cho 3, chắc chắn tính sai". Sửa `diem-chia-het-3` cùng kiểu (`6 · 7 − 3 · 2 = 36 ⋮ 3`; "Ai báo 29 điểm thì chắc chắn tính sai"). Chụp lại và xem ảnh.

## Nên sửa

### 1. Màu teal "Chữ số tận cùng" tô cả số và tô nhãn không nói về chữ số tận cùng

- Vị trí: visual `tien-135-5` (`$.sections[1].blocks[3]`), `lop-30-ban` (`$.sections[2].blocks[0]`) trong `src/visuals/math/dau-hieu-chia-het/catalog.ts` - LL-03
- Nguồn: —
- Vấn đề: `\concept{teal}{135}`, `\concept{teal}{30}` tô cả số; hai nhãn "Xếp cặp 2 bạn, vừa hết", "Xếp nhóm 5 bạn, vừa hết" mang dấu teal. Các màn khác chỉ tô chữ số cuối (ảnh `phone/022-s2-04-block.png`, `phone/030-s3-01-block-end.png`).
- Sửa: chỉ tô chữ số cuối (`13\concept{teal}{5}`, `3\concept{teal}{0}`); nhãn xếp cặp, xếp nhóm bỏ màu khái niệm.

### 2. Màu amber mang ba nghĩa: số túi, "Tổng các chữ số" và "Tích"

- Vị trí: hình `tui-16-2`, `tui-20-5`, `hop-27-9` (số túi màu amber) so với `tong-1746-9`, `tom-tat-2439-9`, `tong-5214`, `tom-tat-tong-8215`; `$.concepts` gán amber cho cả `concept.tong-cs` và `concept.tich` - LL-03, LL-05 (Tổng hợp gộp phần `concepts`)
- Nguồn: —
- Vấn đề: section `chia-het-9` màn 1 tô 3 (số hộp) amber, màn 2 tô 18 amber với legend "Tổng các chữ số"; section `tich-chia-het` lại tô tích amber. Một màu ba nghĩa làm trẻ nối sai "3 hộp", "tích" với "tổng các chữ số".
- Sửa: hình `bags` không tô số túi bằng màu khái niệm; đổi màu `concept.tich` sang màu chưa dùng trong bài.

### 3. Hình gợi ý nấc 2 `goi-y-9816-2`, `goi-y-cong-4152` không hiện số đang xét

- Vị trí: `ex.chon-chia-het-2` → `goi-y-9816-2`; `ex.tong-7316` → `goi-y-cong-4152` (`mode: "hint"`) - LL-02, LL-15
- Nguồn: —
- Vấn đề: `label` chỉ là `aria-label`; `goi-y-cong-4152` hiện "4 + 1 = 5", "5 + 5 = 10", "?" mà trên màn không có số 4 152 (ảnh `phone/013-s1-06-exercise-chon-chia-het-2-wrong2.png`). Số khác đề rồi dừng ở "?" vẫn đúng luật nấc 2 (nhóm 2 xác nhận `goi-y-7062-9`, `goi-y-hieu-3460-1213` cùng kiểu), nhưng trẻ không biết hình đang nói về số nào nên không áp được vào đề.
- Sửa: thêm dòng hay hàng ô chữ số hiện số đang xét ("Số 4 152", như `tong-5214`). Vì số đã khác đề, tác giả có thể cho chạy trọn (`mode: "steps"`), luật cho phép.

### 4. Hình gợi ý `goi-y-tien-30` chỉ vào ô "còn thừa", trong khi đề hỏi số tờ

- Vị trí: `ex.tien-45` → `goi-y-tien-30` (`bags`, `mode: "hint"`) - LL-15
- Nguồn: —
- Vấn đề: hình xếp đủ 6 tờ, viết `30 = 5 · 6 + □` và ô "?" xám cho phần còn thừa; đề hỏi số tờ, ô "?" không liên quan và gợi ý có thể dư tiền.
- Sửa: `mode: "steps"` (trọn ví dụ 30 nghìn = 6 tờ, số khác đề) hoặc hình dừng ở `45 = 5 · ?`.

### 5. Ô chữ số của câu `manipulate` mở ra đã hiện 0, nút Kiểm tra còn khoá

- Vị trí: `ex.o-trong-2-5`, `ex.o-trong-2`, `ex.o-trong-5`, `ex.o-trong-9`; `src/visuals/math/dau-hieu-chia-het/digit-box.tsx` (`useState(DIGIT_RANGE.min)`)
- Nguồn: —
- Vấn đề: màn hiện "840", "610", "720", "405" đều đã đúng; với `o-trong-2-5`, 0 là đáp án duy nhất mà trẻ phải bấm + rồi − mới nộp được.
- Sửa: trong bài tập, ô mở ra trống ("?") tới lần bấm đầu (báo người làm visual); câu khác có thể đổi số để 0 không là đáp án.

### 6. `tong-7316` cần 3 phép cộng nhẩm ở độ khó 2

- Vị trí: `ex.tong-7316` (`card.tong-chu-so`, kho ôn) - LL-18
- Nguồn: —
- Vấn đề: 7 + 3 + 1 + 6 vượt luật "tối đa 2 phép tính nhẩm"; các câu khác của nhóm đã đổi ở vòng 1.
- Sửa: đổi số có chữ số 0 (vd 7 036, sửa hình `giai-cong-7316` và id) hoặc chuyển sang độ khó 3.

### 7. `nhom-it-nhat` hỏi "ít nhất" mà section không có mẫu, không có gợi ý

- Vị trí: `ex.nhom-it-nhat` (`card.chia-het-2-5`, kho ôn) - LL-16
- Nguồn: dạng câu 2.17 tr.34, lời giải tr.105
- Vấn đề: cần bước "số chia hết cho cả 2 và 5 là 10, 20, 30…, nhỏ nhất khác 0 là 10" chưa dạy; nấc 1 tô cả đề, không `hintVisualId`; dễ trả lời 0 hay 30.
- Sửa: hình gợi ý liệt kê số tận cùng 0 rồi dừng ở "số nhỏ nhất khác 0 là ?", hoặc một dòng mẫu ở note `so-cuoi-2-5`.

### 8. Câu quy tắc `tong-hieu` "cho 2 hay 5" đọc được thành mỗi số chia hết cho một số khác nhau

- Vị trí: `$.sections[8].blocks[2].children[0].text` (note `rule`), `$.sections[8].recap.caption`, `card.tong-hieu` recap - LL-10
- Nguồn: tr.33 mục Kĩ năng, tr.34 câu 2.15–2.16
- Vấn đề: 4 và 5 "đều chia hết cho 2 hay 5" mà 4 + 5 = 9 không chia hết cho số nào; "số đó" không rõ. Tổng hợp: tên section viết "2 hoặc 5", câu quy tắc viết "2 hay 5".
- Sửa: "Hai số cùng chia hết cho 2 (hoặc cùng chia hết cho 5) thì tổng và hiệu của chúng chia hết cho số đó. Chỉ một trong hai số chia hết cho số đó thì tổng và hiệu không chia hết cho số đó." Recap section và card chép y nguyên.

### 9. Hình recap `tom-tat-10-3` chỉ vẽ nửa đầu câu quy tắc

- Vị trí: `$.sections[9].recap.visualId`, `card.luy-thua-10` recap - LL-06, LL-15
- Nguồn: —
- Vấn đề: hình chỉ có 10³ = 1 000 và 1 + 0 + 0 + 0 = 1, không có bước "cộng thêm một số" là bước trẻ dùng để xét chia hết (ảnh `phone/120-s10-06-recap.png`).
- Sửa: sửa cùng Nghiêm trọng 1; thêm hàng ví dụ với số thêm chưa dùng ở câu nào, vd 10³ + 1 = 1 001, "1 + 1 = 2".

### 10. Màn quy tắc và recap `cho-hai-so` vẽ quy tắc của section `tim-chu-so`

- Vị trí: visual `hai-dau-hieu` (`$.sections[6].blocks[1]`), `tom-tat-hai-dau-hieu` (`$.sections[6].recap`, `card.cho-hai-so`); note `rule` `$.sections[10].blocks[1]` - LL-06, LL-05 (Tổng hợp gộp phần màn quy tắc)
- Nguồn: —
- Vấn đề: cả hai hình là bảng "2, 5: Xét chữ số tận cùng; 3, 9: Xét tổng các chữ số". Đó là nội dung câu quy tắc `tim-chu-so` ("Đề cho chia hết cho 2 hay 5 thì xét chữ số tận cùng..."), không phải ý của `cho-hai-so` (xét lần lượt, chia hết cho cả hai khi dấu hiệu nào cũng thấy chia hết). Một quy tắc xuất hiện hai nơi bằng hai cách nói, recap không có ví dụ.
- Sửa: recap `cho-hai-so` vẽ một ví dụ có hai hàng xét và một hàng kết luận, số mới, vd 312: "tận cùng 2 → chia hết cho 2", "3 + 1 + 2 = 6 → chia hết cho 3", "Vậy chia hết cho cả 2 và 3". Bảng 2, 5 / 3, 9 để cho section `tim-chu-so`.

### 11. `dien-10-5` dễ nhầm 3 với 9 mà không có gợi ý

- Vị trí: `ex.dien-10-5` `hints` (`highlight: []`, không `hintVisualId`) (`card.luy-thua-10`, kho ôn) - LL-02
- Nguồn: —
- Vấn đề: 10³ + 5 có tổng 6, chia hết cho 3 không chia hết cho 9: đúng chỗ section `chia-het-3` dặn; lần sai đầu không có gì sáng lên.
- Sửa: `hintVisualId` kiểu `goi-y-7062-9` với số khác đề (vd 10² + 5), hoặc khối `formula` có `\htmlId` rồi `target: "part"`.

### 12. `chon-3-5-2715` cộng bốn chữ số ở câu luyện độ khó 1

- Vị trí: `ex.chon-3-5-2715` (`practiceIds` của `cho-hai-so`) - LL-18
- Nguồn: —
- Vấn đề: 2 + 7 + 1 + 5 là 3 phép cộng rồi xét chia hết, vượt luật "Số nhỏ".
- Sửa: số 3 chữ số, vd 345 (đáp án), 902, 410, 648; đổi id theo đáp án.

### 13. Màn `hop-6-7` vẫn viết "xếp vừa các túi 3 cái"

- Vị trí: `$.sections[7].blocks[0].children[0].text` - LL-10
- Nguồn: —
- Vấn đề: thiếu "mỗi", đọc thành "3 cái túi"; vòng 1 đã sửa đúng lỗi này ở `hop-banh-tui` nhưng màn mở đầu còn cách viết cũ.
- Sửa: "Mỗi hộp có 6 cái bánh, mẹ mua 7 hộp. Mỗi hộp xếp vừa hết vào các túi, mỗi túi 3 cái, nên cả 7 hộp cũng xếp vừa hết."

### 14. Bước 2 của `xep-tong-3410` dùng lại cách nói "chữ số tận cùng cho số chia hết"

- Vị trí: `ex.xep-tong-3410` `items[1]` - LL-10, LL-19
- Nguồn: —
- Vấn đề: cách nói vòng 1 đã sửa ở `tan-cung-5`, `so-cuoi-*` còn sót ở đây.
- Sửa: "Số có chữ số tận cùng là 0 hay 4 thì chia hết cho 2, nên hai số hạng đều chia hết cho 2."

### 15. Năm màn chạm thiếu dòng lý do

- Vị trí: note đầu `chon-3-1410` (`$.sections[5].blocks[3]`), `chon-2-3-1230` (`$.sections[6].blocks[2]`), `chon-tich-5` (`$.sections[7].blocks[2]`), `chon-tong-hieu-30` (`$.sections[8].blocks[3]`), `chon-10-3` (`$.sections[9].blocks[2]`)
- Nguồn: —
- Vấn đề: dòng thứ hai là cách làm, không nói làm để được gì; section `chia-het-2` làm đúng ("Thử nhiều chữ số giúp bạn thấy...").
- Sửa: thêm câu lý do ngắn, vd `chon-tong-hieu-30`: "Làm vậy giúp bạn biết tổng có chia hết không mà không cần tính."

### 16. Câu quy tắc `tim-chu-so` cụt chủ ngữ, không nói để làm gì

- Vị trí: `$.sections[10].blocks[1].children[0].text` (note `rule`), `$.sections[10].recap.caption`, `card.tim-chu-so` recap - LL-06, LL-19
- Nguồn: tr.33 ví dụ 1, tr.34 câu 2.19
- Vấn đề: "Đề cho chia hết cho 2 hay 5..." thiếu "số" và không nói đang tìm chữ số chưa biết; đứng riêng trong phiên ôn đọc như luật chung. Cách làm hai bước (cả 5 và 9) không được nhắc.
- Sửa: "Muốn tìm chữ số chưa biết, ta xem đề cho số chia hết cho mấy. Chia hết cho 2 hay 5 thì xét chữ số tận cùng. Chia hết cho 3 hay 9 thì xét tổng các chữ số." Có thể thêm note ở `tim-24a`: "Đề cho cả hai thì tìm chữ số tận cùng trước, rồi thử từng chữ số với tổng." Sửa cùng Nên sửa 10.

### 17. Recap `tom-tat-but-vo` dùng bút 4 nghìn, tổng 30 nghìn mà không nói ở đâu

- Vị trí: visual `tom-tat-but-vo` (`$.sections[12].recap`, `card.but-vo`) - LL-15, LL-10
- Nguồn: —
- Vấn đề: ba hàng `5 · y ⋮ 5`, `30 ⋮ 5`, `4 · x ⋮ 5` (ảnh `phone/159-s13-07-recap.png`); 4 và 30 chỉ có trong `label`. Trẻ không biết 4, x là gì.
- Sửa: dòng đầu "Bút 4 nghìn, vở 5 nghìn, cả hai hết 30 nghìn"; nhãn hàng 3 "Tiền bút: x cái, mỗi cái 4 nghìn, chia hết cho 5"; có thể thêm dòng kết "x = 5, tiền bút 20 nghìn".

### 18. Hình `lap-035` không cho thấy vì sao 035 bị loại

- Vị trí: visual `lap-035`, note `$.sections[13].blocks[2].children[0]` - LL-16, LL-15
- Nguồn: tr.34 câu 2.18, lời giải tr.105
- Vấn đề: hình chỉ liệt kê 350, 530, 305 (ảnh `phone/164-s14-03-block.png`); 035 không xuất hiện, hình không theo bước "chọn chữ số tận cùng trước" của câu quy tắc vừa học.
- Sửa: hình từng bước "Tận cùng 0: 350, 530" → "Tận cùng 5: 305" → dòng mờ "035: chữ số 0 đứng đầu, không phải số ba chữ số" → "Được 3 số"; note bỏ phần liệt kê.

### 19. `lap-so-045` lặp dạng và đáp án của ví dụ `lap-035`

- Vị trí: `ex.lap-so-045` (kho ôn `card.lap-so`) - LL-07
- Nguồn: —
- Vấn đề: chỉ đổi 3 thành 4, cùng chia hết cho 5, cùng đáp án 3.
- Sửa: đổi sang chia hết cho 2 với bộ có 0 (vd 0, 4, 7) hoặc `choice` "Số nào không lập được?"; soát `[review-bank]`.

### 20. `tien-but-60`: "vở giá 5 nghìn đồng" hiểu được là cả tiền vở

- Vị trí: `ex.tien-but-60` `prompt[0].text` (kho ôn `card.but-vo`) - LL-10
- Nguồn: —
- Vấn đề: thiếu "mỗi quyển"; đọc thành tiền vở 5 nghìn thì không lựa chọn nào đúng.
- Sửa: "Mẹ mua bút và một số quyển vở, mỗi quyển 5 nghìn đồng, hết tất cả 60 nghìn đồng. Chọn tất cả số có thể là tiền mua bút, tính bằng nghìn đồng."

### 21. Hình `cong-6384` gọi chữ số tận cùng là "chữ số cuối", tô amber, không ghi số đang cộng

- Vị trí: visual `cong-6384` (`$.sections[3].blocks[1]`), nhãn hàng 3 "Cộng chữ số cuối"; ảnh `phone/041-s4-02-block-end.png` - LL-05 (Tổng hợp phát hiện; gộp Góp ý 2 của nhóm 1 lên Nên sửa)
- Nguồn: —
- Vấn đề: vòng 1 đã bỏ "chữ số cuối" khỏi hook vì bài và glossary dùng "chữ số tận cùng"; nhãn này còn sót, lại mang màu amber "Tổng các chữ số" trong khi chữ số tận cùng là teal. Số 6 384 chỉ có trong caption xám ở cuối, trẻ chưa biết đang cộng chữ số của số nào.
- Sửa: nhãn bước không dùng màu khái niệm, viết "Cộng chữ số 4" (hay "Cộng chữ số tận cùng"); chỉ tô 21 amber; thêm hàng ô chữ số 6 3 8 4 hay dòng "Số nhà 6 384" ở đầu hình.

### 22. Caption và hàng cuối `xet-2136` lệch câu quy tắc vừa đổi

- Vị trí: `$.sections[6].blocks[0].caption` ("đúng với cả hai dấu hiệu"), visual `xet-2136` hàng 4 - LL-05, LL-15 (Tổng hợp nâng Góp ý 1 của nhóm 2)
- Nguồn: —
- Vấn đề: câu quy tắc nay nói "xét dấu hiệu nào cũng thấy chia hết", caption ngay màn trước vẫn dùng "đúng với cả hai dấu hiệu" (cách nói chưa định nghĩa, vòng 1 Góp ý 8); hàng cuối ghi `2 136 ⋮ 3` mà nhãn nói "cả 2 và 3". Một quy tắc hai cách nói trên hai màn liền nhau.
- Sửa: caption "Xét dấu hiệu nào cũng thấy chia hết, nên 2 136 chia hết cho cả 2 và 3."; hàng cuối thành chữ "Vậy 2 136 chia hết cho cả 2 và 3".

## Góp ý

### 1. Gần như mọi số của section `chia-het-9` có tổng chữ số 18

- Vị trí: `tong-1746-9`, `tom-tat-2439-9`, `ex.tong-18-chia-het-9`, `ex.chon-chia-het-9`, `ex.chon-nhieu-9`, `ex.dien-9-7308` - LL-14
- Nguồn: —
- Vấn đề: trẻ có thể nhớ "tổng 18 thì chia hết" thay vì so với cả bảng 9 đến 45.
- Sửa: đổi một hai đáp án sang tổng 9 hay 27.

### 2. Hình `bags` hiện chú thích "Còn thừa" khi không còn thừa

- Vị trí: `tui-16-2`, `tui-20-5`, `hop-27-9` (`src/visuals/shared/bag-groups.tsx`, `bagLegend`)
- Nguồn: —
- Vấn đề: legend luôn có "Còn thừa" ngay dưới dòng "Không còn thừa".
- Sửa: chỉ hiện khi `left > 0` (báo người làm app).

### 3. Hàng ô chữ số `so-cuoi-*` dồn trái trên iPad ngang (do app)

- Vị trí: `so-cuoi-2`, `so-cuoi-5`, `so-cuoi-2-5`; ảnh `ipad-landscape/031-s3-02-block.png`
- Nguồn: —
- Vấn đề: lưới 10 ô chiếm nửa trái khung (`end-digits.tsx`, `max-w-md`).
- Sửa: báo người làm app canh giữa (`mx-auto`).

### 4. Hai màn chỉ có hình, không câu nào nói màn đó cho thấy gì

- Vị trí: `$.sections[8].blocks[1]` (`hieu-4275-1132`), `$.sections[9].blocks[1]` (`tong-10-4-8`)
- Nguồn: —
- Vấn đề: lần đầu gặp trường hợp chỉ một số chia hết, lần đầu dùng quy tắc xét chia hết cho 9; trẻ dễ bấm qua.
- Sửa: bọc trong `group` với note ngắn, vd "Với hiệu cũng làm vậy. Ở đây chỉ một số chia hết cho 5."

### 5. Note mở đầu `tong-hieu` gọi là "số hạng" cả khi là hiệu

- Vị trí: `$.sections[8].blocks[0].children[0].text`
- Nguồn: —
- Vấn đề: section dạy cả hiệu (số bị trừ, số trừ có trong glossary).
- Sửa: "Nhớ lại bài trước: ta xét từng số trong tổng hay hiệu, không cần tính kết quả."

### 6. Câu kho ôn `luy-thua-10` lặp phần quyết định của hình trên màn

- Vị trí: `ex.chon-nhieu-10-3` so với chip `chon-10-3` (cùng +2, +5 đúng; +3, +4 nhiễu); `ex.chon-10-9` (10⁵ + 8) so với `tong-10-4-8` (10⁴ + 8) - LL-07
- Nguồn: —
- Vấn đề: số mũ không ảnh hưởng kết quả, câu ôn chỉ là câu trên màn đổi số mũ.
- Sửa: `chon-nhieu-10-3` dùng tập khác (vd 10⁴ + 8, 10⁶ + 5 đúng; 10³ + 6, 10⁵ + 1 nhiễu); đổi `tong-10-4-8` sang trường hợp không chia hết.

### 7. Đề `hop-bi-102` nên nói "ít nhất"

- Vị trí: `ex.hop-bi-102` `prompt[0].text` - LL-10
- Nguồn: —
- Vấn đề: thêm 2, 5, 8… viên đều được; lựa chọn chỉ có 2 nên không sai, nhưng đề chưa chặt.
- Sửa: "Hộp có 10² viên bi, tức là 100 viên. Thêm vào ít nhất mấy viên bi thì chia đều cho 3 bạn được vừa hết?"

### 8. Ví dụ đời sống `tui-24-3` chưa nối với tổng các chữ số

- Vị trí: `$.sections[5].blocks[0]` - LL-16
- Nguồn: —
- Vấn đề: câu chuyện 24 cái kẹo không quay lại 2 + 4 = 6 (section `chia-het-9` đã làm điều này ở `hop-27-9`).
- Sửa: caption thêm "Ở số 24, 2 + 4 = 6, chia hết cho 3."

### 9. `hop-banh-tui` lặp câu chuyện màn `hop-6-7`

- Vị trí: `ex.hop-banh-tui` so với `hop-6-7` - LL-07
- Nguồn: —
- Vấn đề: chỉ đổi số hộp, cùng 6 cái và túi 3 cái.
- Sửa: bộ số khác (vd mỗi hộp 10 cái, túi 5 cái, 6 hộp); sửa `giai-banh-48` và `check.expr`.

### 10. Số mũ viết bằng kí tự ² ³ trong chip và đề rất nhỏ (do cách vẽ)

- Vị trí: chip `chon-10-3` (ảnh `phone/109-s10-03-block.png`); đề `hop-bi-102`, `dien-10-5`
- Nguồn: —
- Vấn đề: khó phân biệt 10³ với 10⁵.
- Sửa: chip nhận TeX, hoặc đưa luỹ thừa của đề vào khối `formula`.

### 11. Bước 2 của `xep-1530` mở đầu giống bước 1

- Vị trí: `ex.xep-1530` `items[1]`
- Nguồn: —
- Vấn đề: s1 và s2 cùng mở bằng "Số 1 530 … chia hết cho 5".
- Sửa: s2 thành "Đã có chia hết cho 5. Xét tiếp tổng các chữ số: 1 + 5 + 3 + 0 = 9".

### 12. Hình lời giải sau `tim-38a` bỏ lý do chọn tổng 9 hay 18

- Vị trí: `tim-ab-11d`, `giai-ab-12d`, `giai-4d6`, `giai-vo-65` - LL-16
- Nguồn: tr.33 ví dụ 1
- Vấn đề: viết thẳng `1 + 1 + d = 9`, `10 + d = 18`; `tim-ab-11d` không nói vì sao 11d chia hết cho 9; `giai-vo-65` thiếu bước giới hạn số bút.
- Sửa: nhãn ngắn "10 + d từ 10 đến 19, chỉ 18 chia hết cho 9", "11d là tích có thừa số 9 nên chia hết cho 9"; `giai-vo-65` thêm dòng liệt kê tiền bút 9, 18, …, 54.

### 13. Nhãn "hợp" / "không hợp"

- Vị trí: `tim-24a`, `tom-tat-tim-58c` - LL-19
- Nguồn: —
- Vấn đề: cách nói tắt trẻ lớp 6 không quen.
- Sửa: "Thử a = 0: được" / "Thử a = 5: không được".

### 14. Đề của các hình ví dụ chỉ nằm ở `caption` xám

- Vị trí: `tim-38a`, `tim-24a`, `tim-ab-11d`, `lap-235` - LL-10
- Nguồn: —
- Vấn đề: trẻ thấy `3 + 8 + a = 11 + a` trước khi biết đang tìm gì (ảnh `phone/122-s11-01-block.png`); `tom-tat-tim-58c` đã có dòng đầu nêu đề.
- Sửa: thêm dòng đầu nêu đề, hoặc chuyển đề thành note trước hình.

### 15. Câu quy tắc `diem-thi` nói vòng; câu kiểm tra đổi sang "không thể đạt được"

- Vị trí: `$.sections[11].blocks[1].children[0].text` và recap; `ex.diem-khong-dat` - LL-19, LL-05
- Nguồn: tr.34 lời giải ví dụ 2
- Vấn đề: "Nếu mỗi câu đều được hay bị trừ số điểm chia hết cho 3" khó đọc; câu kiểm tra hỏi "không thể đạt được" trong khi mọi chỗ khác nói "chắc chắn tính sai".
- Sửa: "Nếu điểm mỗi câu đúng và điểm trừ mỗi câu sai đều chia hết cho 3 thì điểm cả bài chia hết cho 3. Điểm cả bài không chia hết cho 3 thì chắc chắn tính sai." Câu kiểm tra: "Điểm cả bài nào chắc chắn tính sai?".

### 16. Mọi bài bút và vở đều ra "5 cái bút"

- Vị trí: section `but-vo`, `ex.tien-but-40`, `ex.mua-but-45`, `ex.mua-vo-65` - LL-07, LL-14
- Nguồn: tr.34 câu 2.20, lời giải tr.105
- Vấn đề: `mua-but-45` hỏi số bút, đáp án 5 trùng ví dụ vừa giải.
- Sửa: `mua-but-45` hỏi tiền vở hoặc số vở.

### 17. Nấc 1 tô cả hai khối đề ở các câu bút và vở

- Vị trí: `ex.tien-but-40`, `ex.mua-but-45`, `ex.mua-vo-65` (`hints.highlight` gồm `block` 0 và 1) - LL-02
- Nguồn: —
- Vấn đề: lần sai đầu không chỉ chỗ cần nhìn lại.
- Sửa: gom giá vở và tổng tiền vào một khối rồi chỉ tô khối đó.

### 18. `diem-mai-83`, `diem-nhieu-9` gần ví dụ 2 của sách

- Vị trí: `ex.diem-mai-83`, `ex.diem-nhieu-9` - LL-08
- Nguồn: tr.33–34 ví dụ 2
- Vấn đề: cùng luật 9 điểm, trừ 3 điểm, cùng tên Mai; không chép nguyên văn nên không chặn.
- Sửa: đổi tên và luật điểm (vd đúng 12, sai trừ 6).

### 19. Recap `tom-tat-lap` dùng bộ chữ số của câu kiểm tra; `lap-2-chia-het-5` lặp `lap-235`

- Vị trí: `tom-tat-lap` (recap section và `card.lap-so`), `ex.cuoi-5`; `lap-2-chia-het-5` - LL-07
- Nguồn: —
- Vấn đề: recap hiện 145, 415 (bộ của `cuoi-5`) không ghi bộ chữ số; màn quy tắc dùng lại 235, 325.
- Sửa: recap dùng bộ mới và dòng đầu nêu đề (vd chia hết cho 2 từ 3, 6, 7); màn quy tắc minh hoạ chia hết cho 2.

### 20. `cuoi-5` thiếu "mỗi chữ số một lần"

- Vị trí: `ex.cuoi-5` `prompt[0].text` - LL-10
- Nguồn: —
- Vấn đề: các câu khác của section đều ghi.
- Sửa: "Dùng các chữ số 1, 4 và 5, mỗi chữ số một lần, lập số ba chữ số chia hết cho 5. Chữ số nào đứng cuối?"

### 21. `chon-chu-so-3`: "Chọn tất cả chữ số x" trong khi 0 và 9 cũng đúng mà không có trong lựa chọn

- Vị trí: `ex.chon-chu-so-3` `prompt[0].text` - LL-10
- Nguồn: —
- Vấn đề: trẻ kĩ băn khoăn vì đề nói "tất cả".
- Sửa: "Trong các chữ số dưới đây, chọn tất cả chữ số x để số sau chia hết cho 3."
