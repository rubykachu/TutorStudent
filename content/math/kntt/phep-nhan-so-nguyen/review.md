# Review: Phép nhân số nguyên (`phep-nhan-so-nguyen`)

- Bài: `content/math/kntt/phep-nhan-so-nguyen/lesson.json`
- Lịch sử: vòng 1: 5 Nghiêm trọng, 17 Nên sửa, 20 Góp ý.
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/phep-nhan-so-nguyen/` - sbt-p55, sbt-p56, sbt-p57 (đề), sbt-p112, sbt-p113 (lời giải)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (96 id chưa có trong `ids.lock.json`: đúng, bài chưa được duyệt nên chưa khoá id)
- Đọc hiểu (Haiku, lượt 1): 181 / 47 / 0; tệp `.shots/review/phep-nhan-so-nguyen/doc-hieu.md`. 47 mục "Hiểu mơ hồ" sẽ được tác giả viết lại rồi Haiku đọc lại (lượt 2 chỉ trên các mục đó) trước lệnh `--approve`.
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-nhan-so-nguyen/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng (1 Nghiêm trọng, 20 Nên sửa, 17 Góp ý). Đã chạy `pnpm content:hash phep-nhan-so-nguyen --root content --mark`; bài giữ `draft`.
- Bản đã review: `360571e5b980f7a6dbe9ba8d7ac3360c3b430615d02a0be05a435e38e85d3f3c` (`pnpm content:diff` so với bản này)

Ba reviewer đã tự giải cả 63 exercise trước khi đọc đáp án: mọi `answer`, `check`, `pairs`, `accept` khớp, không nhiễu nào cũng đúng (LL-01), không `explain`/`wrong` nào gọi lựa chọn theo vị trí (LL-26). Ba mẹo đã thử trên số biên (`tip.nhan-voi-am-1`, `tip.thua-so-0`, `tip.gop-thua-so-chung`): đúng mọi đầu vào; mẹo gộp thừa số chung nói rõ điều kiện "tổng của hai tích" (bảng số đã thử trong `.shots/review/phep-nhan-so-nguyen/nhom-r2-2.md`, `nhom-r2-3.md`). Recap của 12 section và 12 card lặp nguyên văn câu `rule: true`; màu khái niệm nhất quán cả bài (dương `lime`, âm `pink`, số 0 `slate`, khớp glossary); quy ước "m · n là m lấy n lần" đúng ở mọi note và đề có chữ "mỗi", trừ một hàng hình (mục 5). Bản sửa vòng 1 phần lớn đạt; các lỗi do bản sửa sinh ra ghi LL-20 ở từng mục.

## Nghiêm trọng

### 1. Ví dụ mẫu nhân hai số khác dấu đọc thành chuỗi "6 · 3 = 18 = −18"

- Vị trí: hình `visual.khac-dau-mau` (`$.sections[3].blocks[2].children[1]`, `section.khac-dau`); cùng khuôn ở hình gợi ý `visual.goi-y-khac-dau-9-nhan-am2` (`$.exercises[15].hints.hintVisualId`, `ex.tinh-8-nhan-am4`). LL-21, LL-20.
- Nguồn: tr.55, `sbt-p55.png` (`m(−n) = −mn`)
- Vấn đề: hình xếp ba dòng `6 · (−3)`, `6 · 3 = 18`, `= −18`. Cả bài dùng quy ước dòng mở đầu bằng "=" nối tiếp dòng ngay trên (recap `khac-dau-vi-du`, lời giải `tinh-8-nhan-am4`), nên bé đọc được `6 · 3 = 18 = −18`, một đẳng thức sai, ngay ở màn ví dụ mẫu bé sẽ chép cách viết. Bản sửa mục 9 vòng 1 sinh ra cách xếp này. Hình gợi ý cùng khuôn: dòng cuối bị ẩn nhưng dấu "?" đặt ngay dưới `9 · 2 = 18` mời bé điền tiếp chuỗi sai. Cùng một bước còn được viết hai kiểu trong một section (hình mẫu tính riêng `6 · 3 = 18`, recap viết `= −(7 · 2)`).
- Sửa: viết như recap: `6 \cdot (-3)` → `= -(6 \cdot 3)` (nhãn "nhân hai phần số tự nhiên") → `= -18` (nhãn "khác dấu: viết dấu − ở trước"); hoặc đặt dòng `6 \cdot 3 = 18` thành `aside: true`. Sửa `goi-y-khac-dau-9-nhan-am2` cùng cách. Xem lại ảnh `visual:shot` của hai hình.

## Nên sửa

### 2. Câu thao tác `thu-4-nhan-am2` vẫn không buộc bé tính: bảng tự in tích

- Vị trí: `$.exercises[13]` (`ex.thu-4-nhan-am2`, hình `visual.thu-4-nhan-am2`, validator `dat-thua-so`). LL-02.
- Nguồn: —
- Vấn đề: đề mới "Bấm mũi tên xuống tới dòng có tích bằng −8." chấm được, nhưng `factorTry` in sẵn tích của mỗi hàng mới và dòng quy luật; bé chỉ bấm tới khi thấy chữ −8. Vấn đề của mục 7 vòng 1 còn nguyên, chỉ đổi lời đề. Câu nằm trong kho ôn của card `duong-nhan-am`.
- Sửa: (a) thêm cho `factorTry` cờ ẩn tích của hàng mới nhất (hiện "?") khi dùng làm bài tập, đổi đề thành "Bấm tới dòng 4 · (−2)" kèm câu `numeric` hỏi tích; hoặc (b) đổi thành câu `numeric` "Tính 4 · (−3)" với hình gợi ý là bảng quy luật dừng ở "?".

### 3. Câu luyện `tinh-5-nhan-am2` có kết quả in sẵn trên hình và recap

- Vị trí: `$.exercises[10]` (`ex.tinh-5-nhan-am2`); recap `visual.duong-nhan-am-vi-du` hàng `2 · (−5) = −10`; hình `visual.no-moi-ngay` hàng `5 · (−2) = −10`. LL-07.
- Nguồn: —
- Vấn đề: màn quy tắc ngay trước câu luyện in `2 · (−5) = −10`, section kế tiếp in nguyên `5 · (−2) = −10`; khi gặp lại ở phiên ôn bé chỉ cần nhớ con số.
- Sửa: giữ câu luyện; đổi hàng recap thành `2 · (−8) = −16` (bộ số chưa có trong bài), bỏ hàng `5 · (−2)` của `no-moi-ngay` (mục 5).

### 4. Màn đời sống section `duong-nhan-am` thiếu chủ ngữ và mốc so sánh

- Vị trí: `$.sections[2].blocks[0].children[0].text` (`section.duong-nhan-am`). LL-10, LL-25.
- Nguồn: —
- Vấn đề: "Sau 2 giờ ghi là 2, cách đây 2 giờ ghi là −2, nên 3 · (−2) = −6 là thấp hơn 6 độ." không nói cái gì "ghi là 2" (số giờ), "thấp hơn" so với lúc nào, và "nên" nhảy từ cách ghi số giờ sang kết quả. Màn song song của section `am-nhan-am` nói rõ hơn ("Cách đây 3 giờ, nhiệt độ cao hơn bây giờ 6 độ"). Haiku cũng đánh dấu "Hiểu mơ hồ".
- Sửa: theo khuôn section 5, vd "Nhiệt độ tăng đều 3 độ mỗi giờ. Số giờ trước bây giờ ghi bằng số âm: cách đây 2 giờ là −2. Lúc đó nhiệt độ thấp hơn bây giờ 6 độ, nên 3 · (−2) = −6."

### 5. Hình câu chuyện nợ có hàng `5 · (−2)` viết ngược quy ước "m · n là m lấy n lần"

- Vị trí: hình `visual.no-moi-ngay` hàng 2 (`$.sections[3].blocks[0].children[1]`, `section.khac-dau`). LL-05.
- Nguồn: —
- Vấn đề: hình mang nhãn "Mỗi ngày nợ thêm 2 nghìn đồng, trong 5 ngày"; hàng 2 `5 · (−2) = −10` đứng cùng hình nên đọc như cách viết thứ hai của chính câu chuyện ("5 lấy −2 lần"), trái quy ước cả bài. Nhãn "khác dấu nên tích âm" còn nói trước câu quy tắc của màn sau.
- Sửa: bỏ hàng 2, hoặc thay bằng kết của câu chuyện: `(−2) · 5 = −10`, nhãn "số tiền giảm 10 nghìn đồng".

### 6. Đề câu kiểm tra `quy-luat-4-nhan` ngắt dòng giữa tích trên điện thoại

- Vị trí: `$.exercises[9].prompt[0].text` (`ex.quy-luat-4-nhan`). LL-12.
- Nguồn: —
- Vấn đề: ảnh phone `040-s3-05-exercise-quy-luat-4-nhan`: "Tích 4 ·" cuối dòng một, "(−1) bằng bao nhiêu?" dòng hai.
- Sửa: thêm dòng `4 \cdot (-1) = ?` vào cuối khối `gathered` của `prompt[1]`, lời đề thành "Quan sát quy luật của các tích. Dòng cuối bằng bao nhiêu?".

### 7. Section 7 nói hai lý do chọn cặp để "tính nhanh", và mọi ví dụ để hai lý do trùng nhau

- Vị trí: `$.sections[6].blocks[2].children[0].text` ("ghép hai số có tích tròn chục"); hình `ghep-nhanh`, `goi-y-ghep-nhanh` ("ghép hai số âm trước"); `$.exercises[32].explain.text` (`ex.tinh-nhanh-am4-3-am5`); `$.exercises[33].explain.text` (`ex.tinh-nhanh-am25-3-am4`). LL-05, LL-24.
- Nguồn: tr.55, `sbt-p55.png`
- Vấn đề: chữ bảo ghép cặp tích tròn chục, hình và lời giải bảo ghép hai số âm; ở cả năm ví dụ cặp tròn chục lại là cặp hai số âm, nên bé không thấy lý do thật và sẽ tính chậm ở (−7) · 25 · (−4).
- Sửa: chốt "ghép hai số có tích tròn chục" cho chữ, nhãn hình và `explain` câu 32, 33; đổi một câu (vd `dien-so-ket-hop` hay câu 33) sang bộ số mà cặp tròn chục có một số dương, như (−4) · 7 · 25.

### 8. Ví dụ đời sống mới của section 8 trỏ tới "Nam" bé chưa gặp trên màn và không có kết

- Vị trí: `$.sections[7].blocks[0].children[0].text` (`section.nhieu-thua-so`); hình `nhan-tung-cap`. LL-10, LL-16, LL-20.
- Nguồn: —
- Vấn đề: "Hai bạn như Nam…" trỏ tới nhân vật chỉ có ở câu kiểm tra section 1 (và Nam ở đó nợ 3 nghìn, trái số 2 nghìn ở đây); câu chuyện dừng ở phép tính, không nói −12 nghĩa là gì.
- Sửa: "Lan và Minh, mỗi bạn nợ thêm 2 nghìn đồng mỗi ngày, trong 3 ngày. Số tiền của hai bạn thay đổi (−2) · 3 · 2 nghìn đồng; ta nhân hai số đầu trước." và thêm kết ở nhãn hàng cuối: "−12: số tiền của hai bạn giảm 12 nghìn đồng".

### 9. Câu kho ôn `chon-bang-tich` sau bản sửa trùng số của hình mở đầu và hình quy tắc

- Vị trí: `$.exercises[34]` (`ex.chon-bang-tich`); hình `mua-but` (hàng `3 · 10 = 30`), `giao-hoan-ket-hop-vi-du` (hàng `[(−2) · 5] · 3 = −30`, recap `card.giao-hoan-ket-hop`). LL-07, LL-20.
- Nguồn: —
- Vấn đề: bản sửa mục 30 vòng 1 chọn bộ số {2, 5, 3} của hình `mua-but` (lựa chọn đúng `10 · 3`), và nhiễu `(−2) · 5 · 3` là biểu thức của hàng recap có in sẵn −30.
- Sửa: đổi bộ số, tránh cặp (−4), (−2) của `dien-so-ket-hop`; vd "Chọn tất cả các tích bằng (−9) · (−2) · 4": đúng `(−2) · 4 · (−9)`, `18 · 4`; nhiễu `(−9) · 8`, `(−9) · 2 · 4`; sửa `wrong`.

### 10. Câu kho ôn `tinh-co-0` lặp ví dụ của mẹo ngay trên màn, lời giải làm ngược lời mẹo

- Vị trí: `$.exercises[41]` (`ex.tinh-co-0`); `$.sections[7].blocks[2].tex` (`tip.thua-so-0`). LL-07, LL-20.
- Nguồn: —
- Vấn đề: đề là ví dụ của mẹo bỏ bớt một thừa số; mẹo dạy "khỏi nhân các số còn lại" nhưng lời giải nhân `(−7) · 5 = −35` trước; `explain.tex` viết `-35 \cdot 0` không ngoặc, trái cách viết cả bài.
- Sửa: đổi số, vd `4 · (−9) · 0 · 2`; `explain`: "Có thừa số 0 nên tích bằng 0, không cần nhân các số còn lại."; `tex`: `4 \cdot (-9) \cdot 0 \cdot 2 = \concept{slate}{0}`.

### 11. Câu kho ôn `chon-tich-duong` gần trùng hàng của hình quy tắc và recap section 8

- Vị trí: `$.exercises[39].options[1]`, `$.exercises[39].options[2]`; hình `nhieu-thua-so-vi-du` (recap section và `card.nhieu-thua-so`). LL-07.
- Nguồn: —
- Vấn đề: `(−2) · 3 · 4` chỉ dời dấu trừ trong hàng recap `2 · (−3) · 4 = −24`; `(−1) · (−4) · (−3)` là hàng ba số âm của recap đổi một số.
- Sửa: lựa chọn đúng `3 · (−5) · 4 < 0`; nhiễu `(−5) · (−1) · (−4) > 0`; sửa `explain`, `wrong`.

### 12. Lời giải `b-dau-gi` nói như chỉ hai số âm mới cho tích dương

- Vị trí: `$.exercises[29].explain.text` (`ex.b-dau-gi`). LL-17.
- Nguồn: tr.56, `sbt-p56.png` (bài 3.29)
- Vấn đề: "Số âm nhân với số âm mới cho tích dương." đọc riêng là trái câu quy tắc ngay trên ("cùng dấu thì tích dương", gồm cả hai số dương).
- Sửa: "a là số âm. Số âm nhân với số âm thì tích dương, còn nhân với số dương thì tích âm. Vậy b là số âm."

### 13. Câu kiểm tra section 12 hỏi đúng bộ số của ví dụ section 4 và của hàng recap vừa hiện

- Vị trí: `$.exercises[58]` (`ex.nhiet-do-giam-5-gio`); hình `tang-giam-vi-du` hàng `(−5) · 2 = −10`; `$.sections[3].blocks[0].children[0].text` (`(−2) · 5 = −10`). LL-07.
- Nguồn: —
- Vấn đề: "giảm 2 độ mỗi giờ, sau 5 giờ" ra `(−2) · 5 = −10`, trùng phép tính ví dụ section 4; màn quy tắc ngay trước còn in −10. Câu kiểm tra không đo được việc lập phép nhân.
- Sửa: "Mỗi giờ nhiệt độ giảm 4 độ. Sau 5 giờ, …" (−20; nhiễu 20, −9, 1); sửa `check.expr`, `explain`, `wrong`.

### 14. Ba câu kho ôn của card `bai-toan-thuc-te` cùng ra −8 từ 2 và 4, một câu trùng recap card `cong-lap`

- Vị trí: `$.exercises[60]` (`ex.thang-may-xuong`); `$.exercises[61].options[0]` (`ex.chon-tinh-huong-am`); `$.exercises[62]` (`ex.cach-day-3-gio`); hình `nhan-am-duong-vi-du` hàng `(−4) · 2 = −8`. LL-07, LL-20.
- Nguồn: —
- Vấn đề: lựa chọn a là bản sửa mục 33 vòng 1 nhưng lại đúng hàng đầu của recap card `cong-lap`; ba câu ôn cùng card hỏi lại một kết quả −8.
- Sửa: `thang-may-xuong` "xuống 3 tầng mỗi lần, xuống 3 lần" (−9); lựa chọn a "Nhiệt độ giảm 1 độ mỗi giờ, trong 6 giờ"; giữ `cach-day-3-gio`.

### 15. Ví dụ của mẹo gộp thừa số chung dùng đúng cặp −7, −3 của câu kiểm tra ngay sau

- Vị trí: `$.sections[9].blocks[3].tex` (`tip.gop-thua-so-chung`); `$.exercises[48]` (`ex.gop-6-am3-am7`); cùng cặp ở `$.exercises[49]`, `$.exercises[51]`. LL-07, LL-20.
- Nguồn: —
- Vấn đề: bản sửa mục 14 vòng 1 đổi mẹo sang `9 · (−7) + 9 · (−3)`, in sẵn `(−7) + (−3) = −10` ngay trước câu kiểm tra hỏi đúng tổng đó.
- Sửa: `9 · (−8) + 9 · (−2) = 9 · [(−8) + (−2)] = 9 · (−10) = −90`.

### 16. Tình huống may vải không nói "thay đổi so với gì", một xí nghiệp gọi hai tên

- Vị trí: `$.sections[11].blocks[0].children[0].text`; `$.exercises[59].prompt[0].text` (`ex.vai-20-bo`); nhãn hình `thay-doi-vai`. LL-10.
- Nguồn: tr.57 bài 3.33, `sbt-p57.png`
- Vấn đề: không nói vải đổi vì mẫu mới so với mẫu cũ; câu trước "xí nghiệp", câu sau "xưởng"; hình viết "bớt", đề viết "ít đi".
- Sửa: note "Xí nghiệp may 20 bộ quần áo theo mẫu mới. Mỗi bộ dùng vải nhiều hơn hay ít hơn mẫu cũ bao nhiêu thì nhân với 20, ta được số vải của cả 20 bộ thay đổi bao nhiêu."; đề "Theo mẫu mới, mỗi bộ dùng ít hơn mẫu cũ 4 dm vải."; nhãn hình "mỗi bộ ít hơn 2 dm: giảm 40 dm".

### 17. Đề câu luyện `vai-20-bo` in sẵn phép nhân nên không còn luyện việc lập phép tính

- Vị trí: `$.exercises[59].prompt[2]` (khối `formula` `(-4) \cdot 20`), `$.exercises[59].hints.highlight[0]`. LL-20.
- Nguồn: —
- Vấn đề: bản sửa mục 37 vòng 1 đưa cả phép nhân vào đề; section không còn câu nào để bé tự lập tích có dấu từ lời.
- Sửa: bỏ khối `formula`; nấc 1 trỏ `target: "block", index: 0`; giữ `explain`.

### 18. "Nợ thêm" không nói thay đổi của cái gì, đọc được là nợ tăng hay nợ giảm

- Vị trí: hình `tang-giam-vi-du` hàng 3 (`$.sections[11].blocks[1]`, recap section và `card.bai-toan-thuc-te`); `$.exercises[61].options[2]` (`ex.chon-tinh-huong-am`). LL-10.
- Nguồn: —
- Vấn đề: section 1 và 4 luôn nói "số tiền của Nam (An) thay đổi"; ở đây "nợ thêm … giảm 10 nghìn" đọc được thành "nợ giảm"; lựa chọn c hỏi "thay đổi tổng cộng" mà số nợ thì tăng (dương), bé hiểu theo số nợ sẽ bỏ c và bị chấm sai. "2 triệu đồng" xa đời sống của bé.
- Sửa: nhãn "nợ thêm 5 nghìn mỗi ngày, 2 ngày: số tiền giảm 10 nghìn"; lựa chọn c "Số tiền của Nam khi mỗi ngày nợ thêm 3 nghìn đồng, trong 4 ngày".

### 19. Câu ôn của card "Tích bằng 0" lặp câu của card "Nhân với 0" và không hỏi quy tắc của card mình

- Vị trí: `$.exercises[57]` (`ex.chon-tich-bang-0`); đối chiếu `$.exercises[7]` (`ex.chon-tich-0`). LL-07.
- Nguồn: tr.56 ví dụ 3, `sbt-p56.png`
- Vấn đề: hai câu cùng đề "Chọn tất cả các tích bằng 0." và cùng kiểu nhiễu; cả hai hỏi chiều của section 2, không hỏi chiều ngược "tích bằng 0 thì ít nhất một số bằng 0".
- Sửa: "Biết a · b = 0. Chọn tất cả các cặp số có thể là a và b." với "a = 0, b = −5", "a = 4, b = 0", "a = 0, b = 0" (đúng), "a = 2, b = −2" (sai, `wrong`: "2 · (−2) = −4, khác 0").

### 20. Một khái niệm hai tên: chữ nói "thừa số thứ hai", hình nói "số đứng sau dấu nhân" (Tổng hợp)

- Vị trí: chữ: `$.sections[2].blocks[1].children[0].text`, `$.sections[2].blocks[3].children[0].text`, `$.sections[4].blocks[1].children[0].text`, `$.sections[4].blocks[3].children[0].text`, `explain` của `$.exercises[9]`, `[10]`, `[11]`, `[13]`, `[25]` và `$.exercises[9].explain.wrong[1].text`; hình: tiêu đề `quy-luat-3-nhan`, `quy-luat-am3-nhan`, các hình `goi-y-*` kiểu bảng, lời kết `cung-2-nhan-am2`, `cung-am2-nhan-am3`, nhãn nút và dòng quy luật của `factor-try.tsx`. LL-05.
- Nguồn: —
- Vấn đề: cùng một màn, note "thừa số thứ hai giảm 1 thì tích giảm 3" đứng ngay trên hình có tiêu đề "Số đứng sau dấu nhân giảm 1 thì tích giảm 3"; bé tưởng là hai thứ khác nhau. Haiku đánh dấu "thừa số thứ hai" là "Hiểu mơ hồ" ở 9 mục, nên tác giả có thể đang đổi dần sang "số đứng sau dấu nhân" (hình đã đổi, chữ chưa).
- Sửa: chốt một tên cho cả chữ lẫn hình (gợi ý "số đứng sau dấu nhân", hoặc giữ "thừa số thứ hai" và giải thích một lần ở note đầu section 3: "thừa số thứ hai, tức số đứng sau dấu nhân"); đổi đủ mọi chỗ trên trong cùng lượt viết lại của Đọc hiểu.

### 21. `overview.whyItMatters` nói "nợ tăng bao nhiêu", lệch cách bài ghi nợ thêm là số tiền thay đổi âm (Tổng hợp)

- Vị trí: `$.overview.whyItMatters`. LL-10.
- Nguồn: —
- Vấn đề: cả bài ghi "nợ thêm" thành số tiền thay đổi số âm (`(−2) · 5 = −10`, quy tắc section 12 "Số dương là tăng, số âm là giảm"); "nợ tăng bao nhiêu" thì đáp số là số dương 10, ngược dấu với phép nhân bé sẽ học. Cùng gốc với mục 18.
- Sửa: "Bạn dùng phép nhân số nguyên để tính nhiệt độ giảm bao nhiêu sau vài giờ, hay số tiền thay đổi bao nhiêu khi mỗi ngày nợ thêm một ít."

## Góp ý

### 22. Câu luyện `tinh-0-nhan-am9` còn dùng "0 nhân với số âm" trước section 3

- Vị trí: `$.exercises[6]` (`ex.tinh-0-nhan-am9`). LL-09, LL-20.
- Nguồn: tr.55, `sbt-p55.png`
- Vấn đề: vòng 1 (mục 42) đã đổi recap `0 · (−3)` thành `0 · 6`; câu luyện ngay trong section vẫn là `0 · (−9)`. Không sai kiến thức, nhưng bản sửa chưa đi hết.
- Sửa: đổi thành `(−9) · 0` (sửa `check.expr`, `explain`), hoặc giữ.

### 23. Hai câu kho ôn lặp số của recap hay của nhau

- Vị trí: `$.exercises[18].options[1]` (`ex.chon-tich-am12`, `(−2) · 6`); `$.exercises[19].items[2]` (`ex.xep-tich-khac-dau`, `(−2) · 4`, trùng `$.exercises[2].options[2]`). LL-07.
- Nguồn: —
- Vấn đề: phiên ôn hiện lại tích bé vừa thấy.
- Sửa: `(−1) · 12`; `(−1) · 7` (thứ tự −15 < −9 < −7 không đổi).

### 24. Lời giải `di-trai-am2-nhan2` thiếu hướng đi ở câu kết

- Vị trí: `$.exercises[4].explain.text` (`ex.di-trai-am2-nhan2`).
- Nguồn: —
- Vấn đề: "Từ 0 đi 2 rồi 2 nữa thì tới −4." không nói "sang trái", chỗ bé hay sai.
- Sửa: "Từ 0 sang trái 2 rồi sang trái 2 nữa thì tới −4."

### 25. Bố cục hình và app trên điện thoại (việc của người làm app)

- Vị trí: hình `am2-nhan3` (ảnh phone `006-s1-01-block-end`: ba nhãn "−2" kèm hình thoi đọc thành "♦−2♦−2♦−2"); `cung-2-nhan-am2` (`039-s3-04-block-shown`) và `cung-am2-nhan-am3` (`061-s5-04-block-shown`): dòng quy luật, lời kết nằm dưới thanh nút cuối màn, phải cuộn; note `$.sections[4].blocks[1]` (`058-s5-02-block-end`): chữ "6." rơi một mình xuống dòng. LL-21, LL-12.
- Nguồn: —
- Vấn đề: không chặn bài.
- Sửa: báo người làm app.

### 26. Câu quy tắc section 8 nói "có chẵn thừa số âm"

- Vị trí: `$.sections[7].blocks[1].children[0].text`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption`. LL-25.
- Nguồn: —
- Vấn đề: "có chẵn/lẻ thừa số âm" thiếu chữ "số", bé phải đoán; Haiku đánh dấu "Hiểu mơ hồ" ở cả ba chỗ và ở bốn `explain`/`wrong` dùng "chẵn", "lẻ".
- Sửa: "Tích nhiều thừa số khác 0 là số dương khi số thừa số âm là số chẵn, là số âm khi số thừa số âm là số lẻ." (recap section và card lặp nguyên văn).

### 27. Id câu không khớp đề sau bản sửa vòng 1

- Vị trí: `$.exercises[23].id` (`ex.chon-tich-12`, đề hỏi 15); `$.exercises[38].id` (`ex.tinh-am3-2-am5`, đề `(−6) · 2 · (−3)`); `$.exercises[39].id` (`ex.chon-tich-duong`); `$.exercises[62].id` (`ex.cach-day-3-gio`, đề "cách đây 2 giờ").
- Nguồn: —
- Vấn đề: id chưa khoá nên đổi lúc này còn rẻ.
- Sửa: `chon-tich-15`, `tinh-am6-2-am3`, `chon-so-sanh-ba-so`, `cach-day-2-gio` (sửa `practiceIds`), trước `content:lock`.

### 28. Đề hỏi "là số nào?" khi đáp án là loại số

- Vị trí: `$.exercises[29].prompt[1].text`, `$.exercises[37].prompt[0].text`, `$.exercises[42].prompt[0].text`. LL-10.
- Nguồn: tr.56, `sbt-p56.png` (bài 3.29)
- Vấn đề: "là số nào?" đọc được là hỏi một giá trị cụ thể.
- Sửa: "… là số âm, số dương hay số 0?".

### 29. Câu mở đầu section 7 nói "cách nào" và bị ngắt giữa phép nhân trên điện thoại

- Vị trí: `$.sections[6].blocks[0].children[0].text`; ảnh `phone/077-s7-01-block`. LL-12, LL-25.
- Nguồn: —
- Vấn đề: "cách nào" chưa nói là cách nhóm; "3 · 5 ·" / "2" gãy dòng.
- Sửa: "Nhóm hai số đầu hay hai số sau trước đều được 30 nghìn đồng.", để phép tính trong hình.

### 30. Mẹo `nhan-voi-am-1` đứng ở section không có câu nào nhân với −1

- Vị trí: `$.sections[5].blocks[2]` (`tip.nhan-voi-am-1`).
- Nguồn: tr.57, `sbt-p57.png` (bài 3.30)
- Vấn đề: không câu nào của section 6 dùng mẹo.
- Sửa: thêm vào `noi-tich-voi-ket-qua` một cặp như `(−9) · (−1)` và 9, hoặc chuyển mẹo xuống section 8.

### 31. Hình nấc 2 của `tinh-am6-nhan-am3` dừng trước số âm đầu tiên

- Vị trí: `$.exercises[21].hints.hintVisualId` (`goi-y-am5-nhan-am`).
- Nguồn: —
- Vấn đề: hình dừng ở `(−5) · 0 = 0` rồi "?", chưa có hàng nào có thừa số thứ hai âm.
- Sửa: thêm hàng `(−5) · (−1) = 5` trước "?", hoặc dùng khuôn "nhân hai phần số tự nhiên" (tránh lỗi chuỗi bằng nhau của mục 1).

### 32. Nhãn dài của recap section 12 ngắt dòng giữa số và đơn vị

- Vị trí: hình `tang-giam-vi-du`, nhãn hàng 1 và 2 (ảnh `130-s12-02-block`). LL-12.
- Nguồn: —
- Vấn đề: "… 3 / ngày", "… 12 / nghìn" ở hai dòng.
- Sửa: rút nhãn, vd "để dành 4 nghìn mỗi ngày, 3 ngày", "giảm 3 độ mỗi giờ, 4 giờ".

### 33. Cùng làm section 12 lặp thao tác và số của cùng làm section 1

- Vị trí: hình `cung-giam3-2-gio` (`$.sections[11].blocks[2]`); đối chiếu `cung-am3-nhan2`. LL-07.
- Nguồn: —
- Vấn đề: cùng điểm đầu 0, bước 3, hai lần bấm, đích −6.
- Sửa: vd "nhiệt độ giảm 1 độ mỗi giờ, sau 5 giờ" (`tryJump(0, 1, -5, …)`), sửa note và lời kết.

### 34. Hàng `(−4) · 0` của hình tích bằng 0 không khớp câu chuyện túi kẹo cùng màn

- Vị trí: hình `tich-bang-0-truong-hop` hàng 2 (`$.sections[10].blocks[0]`). LL-15.
- Nguồn: —
- Vấn đề: "−4 viên kẹo mỗi túi" không có trong câu chuyện.
- Sửa: `3 \cdot 0 = 0`.

### 35. Câu chuyện hộp kẹo kết ở "cả hai bạn" mà không nói 70 là gì

- Vị trí: `$.sections[9].blocks[0].children[0].text`; hình `gop-hop-keo`. LL-16.
- Nguồn: —
- Vấn đề: note nói gộp số hộp, kết quả là số kẹo; nhãn không đơn vị.
- Sửa: nhãn "70 viên kẹo của cả hai bạn"; note "Xem cách tính số kẹo của cả hai bạn."

### 36. Đề "Đổi chỗ một thừa số" chưa rõ

- Vị trí: `$.exercises[52].prompt[0].text` (`ex.tinh-gop-doi-cho`). LL-10.
- Nguồn: —
- Vấn đề: đổi chỗ là đổi hai thừa số của một tích.
- Sửa: "Đổi chỗ hai thừa số trong một tích để thấy thừa số chung, rồi tính nhanh."

### 37. Lời giải `tinh-4-nhan-tong-am` không dùng cách của card nó luyện

- Vị trí: `$.exercises[47].explain` (`ex.tinh-4-nhan-tong-am`, card `phan-phoi`).
- Nguồn: —
- Vấn đề: chỉ "tính trong ngoặc trước".
- Sửa: thêm "Nhân với từng số hạng cũng được: 4 · (−5) + 4 · 2 = −20 + 8 = −12."

### 38. "Cách đây 2 giờ" ở chữ, "2 giờ trước" ở hình cho cùng một ý (Tổng hợp)

- Vị trí: note `$.sections[2].blocks[0]`, `$.sections[4].blocks[0]`, `$.sections[5].blocks[0]`, đề `$.exercises[24]`, `$.exercises[62]`; nhãn hình `nhiet-do-cach-day`, `nhiet-do-giam-cach-day`, `bon-truong-hop`. LL-25.
- Nguồn: —
- Vấn đề: Haiku đánh dấu "cách đây" là "Hiểu mơ hồ" ở 5 mục; hình đã dùng "2 giờ trước", dễ hiểu hơn, nhưng chữ ngay trên vẫn "cách đây".
- Sửa: chốt một cách nói cho chữ lẫn hình (gợi ý "2 giờ trước", lần đầu nói "2 giờ trước bây giờ") trong lượt viết lại của Đọc hiểu.

## Ngoài phạm vi của Tổng hợp

- `notebooks/backlogs/lesson-phep-nhan-so-nguyen/task.md`, mục "Cấu trúc bài", còn ghi "tính hợp lí", "bài 3.32" và tên mẹo cũ: tài liệu bàn giao, Tổng hợp không sửa; tác giả cập nhật khi sửa bài.
- Mục 20 và 38: `src/visuals/math/phep-nhan-so-nguyen/catalog.ts` và `factor-try.tsx` đổi lúc 09:07, sau khi `lesson.json` đổi lần cuối; Tổng hợp ghi theo trạng thái lúc review, không sửa.
