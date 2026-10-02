# Review: Ôn tập chương III (`on-tap-chuong-3`)

- Bài: `content/math/kntt/on-tap-chuong-3/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp (nhóm 1: `so-sanh`, `tap-hop-a`, `dau-tich-tong`, `dau-tich-hieu`; nhóm 2: `so-doi`, `tinh-abcd`, `thua-so-chung-3-43`, `thua-so-chung-3-44`, `tich-bang-0`; nhóm 3: `boi-trong-khoang`, `uoc-chung`, `bang-tich`, `bang-tong`, `overview`)
- Nguồn đã đọc: `sources/math/on-tap-chuong-3/` - sbt-p60, sbt-p61, sbt-p62, sbt-p114 (Tổng hợp mở lại `sbt-p62.png` để kiểm dấu cuối 3.43, 3.44)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (89 id chưa khoá)
- Đọc hiểu (Haiku): lượt 1 trên 116 mục chữ đổi (108 mục của `doc-hieu-r1-items.txt` cộng chữ đổi khi sửa vòng 2): 98 Hiểu rõ / 18 Hiểu mơ hồ / 0 Khó hiểu; viết lại 18 mục, lượt 2: 16 / 2 / 0; viết lại 2 mục, lượt 3: 2 / 0 / 0. Kết quả: `.shots/review/on-tap-chuong-3/doc-hieu-r2.md`, `doc-hieu-r2-2.md`, `doc-hieu-r2-3.md` (không commit)
- `lesson:walk`: 0 FAIL, 0 cảnh báo (ipad, phone, ipad-landscape), ảnh trong `.shots/walk/on-tap-chuong-3/` (chỉ ảnh chụp sau bản sửa vòng 1; thư mục còn lẫn ảnh cũ, xem "Việc còn lại")
- Kết luận: 0 Nghiêm trọng, 8 Nên sửa, 14 Góp ý. Đạt về nội dung, chờ sửa Nên sửa và Đọc hiểu trước khi duyệt
- Bản đã review: `c8cc57b4027bf7596118278a64228798594e4947f7421bba53269e459334166e` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Quy tắc bảng ba ô nói hai cách ("cách nhau hai ô" và "tiến hay lùi 3 ô"), màn ví dụ không có kết luận

- Vị trí: `$.sections[11].blocks[1].children[0..2]` và `$.sections[12].blocks[1].children[0..2]` (note ví dụ, công thức có ô □, note `rule: true`), `$.sections[11].recap.caption`, `$.sections[12].recap.caption`, `$.cards[11].recap.caption`, `$.cards[12].recap.caption`, `$.sections[11].blocks[2]` (mẹo `on-tap-chuong-3.tip.bang-o-lien-nhau`), `$.exercises[40].explain.text` (`o-xa-bang-tich`), `$.exercises[41].explain.text` (`bai-3-48`), `$.exercises[44].explain.text` (`o-xa-bang-tong`), `$.exercises[45].explain.text` (`bai-3-49`) - LL-05, LL-10, LL-16
- Nguồn: lời giải sách tr.114, `sbt-p114.png` (3.48: ô thứ nhất, thứ tư, thứ bảy, thứ mười bằng nhau); walk `phone/176-s12-02-block.png`, `phone/189-s13-02-block.png`
- Vấn đề: (a) màn ví dụ dừng ở ô □ mà không nói □ = −1 (`bang-tong`: □ = 2), cũng không nói ô 4 bằng ô 1, rồi sang ngay câu quy tắc. (b) "Hai ô cách nhau hai ô" đúng nghĩa (ô 1 và ô 4) nhưng bé dễ hiểu thành ô 1 và ô 3, trong khi mẹo và lời giải 3.48, 3.49 nói "3 ô": cùng một quan hệ mà bé gặp số 2 và số 3. Recap và card chỉ có câu này, không có hình bảng ô để neo. (c) Lời giải `o-xa-*` rút gọn câu quy tắc, bỏ điều kiện "ba ô liền nhau luôn có cùng tích khác 0". (d) Phát hiện của Tổng hợp: mẹo `bang-o-lien-nhau` lặp nguyên câu `rule` rồi nói thêm cách "tiến hay lùi 3 ô"; khi câu quy tắc đã chứa ý này thì mẹo chỉ còn là quy tắc nói lại (mẹo gượng). Mức: nghĩa đen của câu đúng, mọi câu luyện và lời giải đều cho thấy cặp ô 1, ô 4 bằng số, nên giữ Nên sửa; nhưng đây là câu bé mang theo trong kho thẻ nên phải sửa ở vòng này.
- Sửa: Tổng hợp chốt một câu duy nhất, dùng nguyên văn ở mọi chỗ:
  - `bang-tich`: "Nếu ba ô liền nhau luôn có cùng tích khác 0, thì từ một ô bất kì, tiến hay lùi 3 ô sẽ gặp lại đúng số đó, như ô 1, ô 4, ô 7 bằng nhau."
  - `bang-tong`: "Nếu ba ô liền nhau luôn có cùng tổng, thì từ một ô bất kì, tiến hay lùi 3 ô sẽ gặp lại đúng số đó, như ô 1, ô 4, ô 7 bằng nhau."
  - Note `rule: true` (`children[2]`) của hai section: thay bằng câu trên. Recap section và card: câu Bài 17 (Bài 14) giữ nguyên, câu thứ hai thay bằng câu trên (vẫn 2 câu, đúng giới hạn `[recap]`).
  - Note ví dụ: thêm một note giữa công thức và câu quy tắc: "Vậy ô 4 là −1, bằng ô 1." (`bang-tong`: "Vậy ô 4 là 2, bằng ô 1."). Đã tính: (−1) · 5 · (−2) = 10 và 5 · (−2) · (−1) = 10; 2 + 3 + (−5) = 0 và 3 + (−5) + 2 = 0.
  - Lời giải `o-xa-bang-tich`, `o-xa-bang-tong`: mở bằng nguyên câu quy tắc, rồi "Ô 7 là … nên lùi 3 ô tới ô 4, rồi ô 1, cũng là …" (số theo Nên sửa 2 và Góp ý 12).
  - Lời giải 3.48, 3.49 (giới hạn 3 câu): câu đầu dùng nguyên vế "từ một ô bất kì, tiến hay lùi 3 ô sẽ gặp lại đúng số đó", ví dụ 3.48: "Từ một ô bất kì, tiến hay lùi 3 ô sẽ gặp lại đúng số đó: ô 10 là −4 nên ô 7, ô 4, ô 1 cũng là −4." (3.49 xem Góp ý 10).
  - Mẹo `bang-o-lien-nhau`: bỏ câu quy tắc và câu "tiến hay lùi 3 ô", đổi sang cách tìm ô còn thiếu (song song với mẹo của `bang-tong`), ví dụ tiêu đề "Tìm ô còn thiếu khi biết tích", chữ "Biết tích của ba ô liền nhau (khác 0) và số ở hai ô, hãy nhân hai số đó trước. Ô còn lại bằng tích của ba ô chia cho kết quả vừa nhân.", `tex` `2 \cdot (-3) = -6` / `(-30) : (-6) = 5`. Đã thử: (2, −3; −30) → 5; (6, −4; 120) → −5; (−1, 5; 10) → −2; (1, 1; 1) → 1; (−2, −2; 4) → 1; (3, −1; −3) → 1; tích 0 thì không chia được, nên lời mẹo có điều kiện "khác 0".
  - Câu `rule` đổi nên chạy lượt Đọc hiểu cho các chữ này.

### 2. `o-xa-bang-tich` trùng số với dòng 7 ô của mẹo ngay trước

- Vị trí: `$.exercises[40]` (`on-tap-chuong-3.ex.o-xa-bang-tich`: "ô 7 là 2. Hỏi ô 1"), `$.sections[11].blocks[2].tex` (`2,\ -3,\ 5,\ 2,\ -3,\ 5,\ 2`) - LL-07
- Nguồn: walk `phone/177-s12-03-block.png`, `phone/182-s12-06-exercise-o-xa-bang-tich.png`
- Vấn đề: dòng 7 ô của mẹo có ô 1 = ô 7 = 2; câu hỏi đúng hai vị trí đó với đúng số 2, bé nhìn lại mẹo là có đáp án mà không cần quy tắc. Nếu mẹo đổi theo Nên sửa 1 thì dòng 7 ô mất, nhưng số 2 vẫn nằm trong ví dụ mẹo.
- Sửa: "Trong một bảng, ba ô liền nhau bất kì nhân lại đều được 36, và ô 7 là 9. Hỏi ô 1 là số nào?" (đáp án 9, `check.expr` "9"; bảng 9, 2, 2 có tích 36 nên đề hợp lệ; số 9 chưa có trên màn nào của `bang-tich`).

### 3. Mẹo ước chung: "25 chỉ chia hết cho hai số này" có hai cách hiểu

- Vị trí: `$.sections[10].blocks[3].text` (`on-tap-chuong-3.tip.uoc-chung-nhanh`) - LL-10, LL-20 (câu sinh ra ở bản sửa vòng 1)
- Nguồn: walk `phone/166-s11-04-block.png`
- Vấn đề: đọc riêng, câu thành "25 chỉ có hai ước dương là 1 và 5" (thiếu 25), đúng kiểu nhớ sai mà vòng 1 đã chặn ở `uc-duong-12-20`. Lời mẹo cũng không nói hai số khác 0 (với 0 và 6 thì 0 là "số có phần số tự nhiên nhỏ hơn" mà 0 không liệt kê được ước); phần này nhẹ vì chương không có bài dạng đó.
- Sửa: câu cuối: "Trong bốn số đó, 25 chỉ chia hết cho 1 và 5, nên giữ lại 1 và 5, rồi viết thêm số đối của chúng." Câu đầu mở bằng "Với hai số khác 0, …". Vẫn 3 câu.

### 4. Lý do sai của nhiễu "5 < 0 < −4 < −9" và câu cuối mẹo so sánh để bé nghĩ xếp từ lớn đến bé vẫn dùng dấu <

- Vị trí: `$.exercises[1].explain.wrong[2].text` (`on-tap-chuong-3.ex.xep-day-so`, nhiễu `d`); `$.sections[0].blocks[2].text`, câu cuối (`on-tap-chuong-3.tip.so-sanh-nhieu-so`)
- Nguồn: —
- Vấn đề: lý do "Dãy này xếp từ lớn đến bé." chỉ nói về thứ tự, không nói chuỗi so sánh sai (5 < 0 là sai), nên bé có thể coi `5 < 0 < −4 < −9` là cách viết đúng khi xếp từ lớn đến bé. Mẹo nói "viết theo thứ tự ngược lại" mà ví dụ chỉ có dấu <; làm đúng chữ với −11 < −6 < 0 < 8 ra `8 < 0 < −6 < −11` (sai). Đã thử {−3; 5; 0; −8}, {−9; −4; 0; 5}, {−11; −6; 0; 8}: thứ tự đúng, chuỗi dấu < đều sai.
- Sửa: lý do `d`: "5 < 0 là sai vì 5 lớn hơn 0. Dãy này viết các số từ lớn đến bé, còn đề hỏi từ bé đến lớn." Mẹo: xem câu chốt ở Nên sửa 5 (có "dùng dấu >"); có thể thêm dòng `8 > 0 > -6 > -11` vào `tex` (xếp `gathered`).

### 5. Mẹo so sánh nói lại quy tắc so sánh hai số âm của Bài 13 bằng câu khác

- Vị trí: `$.sections[0].blocks[2].text`, câu thứ hai (`on-tap-chuong-3.tip.so-sanh-nhieu-so`) - LL-05
- Nguồn: Bài 13 của app, `tap-hop-cac-so-nguyen` (note `rule: true`): "Muốn so sánh hai số âm khác nhau, bỏ dấu − của cả hai số rồi so sánh. Số âm nào có số lớn hơn sau khi bỏ dấu − thì nhỏ hơn số âm kia."
- Vấn đề: mẹo viết "Hai số âm thì bỏ dấu − rồi so sánh: số nào lớn hơn thì số âm đó nhỏ hơn." Cùng quy tắc nói cách khác, và "số nào" không rõ là trước hay sau khi bỏ dấu. Giả định của handover: một quy tắc chỉ có một cách nói trong cả app. Section không có màn nhắc quy tắc này nên mẹo là chỗ duy nhất dạy bước cần cho `xep-day-so`.
- Sửa (gộp với Nên sửa 4, giữ 3 câu theo `MAX_TIP_SENTENCES`): "Muốn xếp từ bé đến lớn, xếp số âm trước, rồi số 0, rồi số dương; muốn xếp từ lớn đến bé thì làm ngược lại và dùng dấu >. Muốn so sánh hai số âm khác nhau, bỏ dấu − của cả hai số rồi so sánh. Số âm nào có số lớn hơn sau khi bỏ dấu − thì nhỏ hơn số âm kia."

### 6. Lời giải 3.44a đưa thừa số chung ra ngoài ba tích, trong khi quy tắc chỉ nói "hai tích"; TeX là các phép tính rời

- Vị trí: `$.exercises[27].explain.text`, `.tex` (`on-tap-chuong-3.ex.bai-3-44a`); câu quy tắc `$.sections[7].blocks[0].children[0]` - LL-09. Gộp Góp ý 3 của nhóm 2 (cùng TeX).
- Nguồn: tr.62, `sbt-p62.png` (3.44a có ba số hạng); Bài 16 của app: quy tắc "Khi cộng hai tích có chung một thừa số…", hình `gop-thua-so-vi-du`, `gop-mau`, `phan-phoi-vi-du` và mọi câu luyện chỉ có hai tích
- Vấn đề: chữ nói "Đưa 32 ra ngoài, trong ngoặc là 142 cộng với −7 và −13", tức đưa ra ngoài ba tích cùng lúc; bước dẫn `doi-thua-so-4` và ví dụ mẫu đều chỉ hai tích. TeX năm dòng `64 = 2 · 32`, `71 · 64 = 142 · 32`, `(−7) + (−13) = −20`, `32 · [142 + (−20)]`, … không nối bằng "=" với biểu thức đề, bé không thấy (−7), (−13) từ đâu vào ngoặc. Mở rộng tự nhiên, không bẫy dấu, nên Nên sửa.
- Sửa: hai bước, mỗi bước hai tích, số đã có trong lời giải. Chữ: "Tách 64 = 2 · 32 thì 71 · 64 = 142 · 32. Muốn trừ một số, ta cộng với số đối của số đó, nên trừ 13 · 32 là cộng 32 · (−13); gộp hai tích này với 32 · (−7) trước. Còn lại hai tích có chung 32, đưa 32 ra ngoài." TeX (mỗi dòng ≤ khoảng 20 ký tự, LL-12): `71 \cdot 64 = 142 \cdot 32` / `32 \cdot (-7) + 32 \cdot (-13)` / `= 32 \cdot (-20)` / `142 \cdot 32 + 32 \cdot (-20)` / `= 32 \cdot [142 + (-20)]` / `= 32 \cdot 122 = 3\,904`. Không chép dòng `(142 − 7 − 13) · 32` của sách tr.114. Chụp lại phone, mở ảnh `*-bai-3-44a-correct.png`.

### 7. Lời giải `doi-thua-so-6`, `tru-hai-tich` nói quy tắc trừ như thể chỉ đúng khi trừ một tích âm

- Vị trí: `$.exercises[21].explain.text`, `$.exercises[21].explain.wrong[0].text` (`on-tap-chuong-3.ex.doi-thua-so-6`, nhiễu `b`); `$.exercises[22].explain.text` (`on-tap-chuong-3.ex.tru-hai-tich`) - LL-05
- Nguồn: —
- Vấn đề: câu quy tắc của bài là "Muốn trừ một số, ta cộng với số đối của số đó.", đúng với mọi số, và lời giải 3.43a/b, 3.44a/b đã trích nguyên văn. Ba chỗ này nói lại bằng "Số 6 · (−5) là số âm, nên trừ nó là cộng số đối", "Trừ một tích âm là cộng số đối của nó", "Số 10 · (−4) là số âm.", khiến bé hiểu chỉ trừ số âm mới đổi thành cộng số đối; ngay sau đó 3.44a, 3.44b lại trừ tích dương. Bản sửa vòng 1 (Nên sửa 6) sót các câu này.
- Sửa: `doi-thua-so-6`: "Vì 2 · 3 = 6 nên cả hai phép nhân đều có thừa số 6. Muốn trừ một số, ta cộng với số đối của số đó, nên trừ 6 · (−5) là cộng 6 · 5. Sau đó đưa 6 ra ngoài." Lý do `b`: "Trừ 6 · (−5) là cộng số đối của nó, là 6 · 5, nên trong ngoặc phải là 4 + 5, không phải 4 − 5." `tru-hai-tich`: bỏ câu "Số 10 · (−4) là số âm.", giữ câu quy tắc.

### 8. Đề 3.43b, 3.44b thiếu dấu "." cuối câu mà sách có in

- Vị trí: `$.exercises[24].prompt[1].tex` (`on-tap-chuong-3.ex.bai-3-43b`), `$.exercises[28].prompt[1].tex` (`on-tap-chuong-3.ex.bai-3-44b`); cùng kiểu: dấu ";" cuối ý a) của `bai-3-43a`, `bai-3-44a` - LL-23
- Nguồn: tr.62, `sbt-p62.png`. Tổng hợp đã mở ảnh: sách in "b) 42·3 – 7·[(–34) + 18]." và "b) 13·(23 – 17) – 13·(23 + 17)." (có "."), ý a) kết bằng ";".
- Vấn đề: đề khác sách một dấu. Mức: Nên sửa, không Nghiêm trọng như 3.45 ở vòng 1, vì ở đây ";" và "." là dấu ngăn các ý a), b) in trên cùng một dòng (cùng loại với dấu ";" "." cuối lựa chọn mà checklist cho bỏ), còn dấu "." của 3.45 kết một câu đề trọn vẹn; chữ, số và việc bé phải làm không đổi. Nhưng mục "Giả định" của handover chưa ghi ngoại lệ này, nên bài ôn sau dễ xử khác nhau.
- Sửa (quyết định của Tổng hợp, ưu tiên khớp sách như đã làm ở 3.45): thêm "." vào cuối TeX của 3.43b (`42 \cdot 3 - 7 \cdot [(-34) + 18].`) và dòng thứ hai của 3.44b (`-\ 13 \cdot (23 + 17).`). Ý a) giữ như hiện tại (không thêm ";" vào cuối một câu đứng riêng), và tác giả thêm vào mục "Giả định" của `notebooks/backlogs/lesson-on-tap-chuong-3/task.md` một dòng: "Tách ý a), b) thành câu riêng thì bỏ dấu ';' ngăn ý ở cuối ý a); dấu '.' cuối ý cuối giữ như sách." Không đổi chữ hay số nào khác.

## Góp ý

### 1. Ý "tổng hai số cùng dấu mang dấu đó" nói theo ba cách

- Vị trí: `$.exercises[7].explain.text` (`cung-dau-tong-am`), `$.exercises[8].explain.text`, `$.exercises[9].explain.text` (`tn3`, `tn4`), `$.sections[2].blocks[2].text` (mẹo `tich-duong-tong`) - LL-05
- Nguồn: —
- Vấn đề: không phải câu `rule`, nghĩa giống nhau, nhưng bé đọc ba câu khác nhau trong một section.
- Sửa: dùng một câu cho cả ba `explain`: "Hai số cùng dấu thì tổng mang chính dấu đó."

### 2. Lời giải câu hỏi 6 nói "a âm, b dương thì a − b âm" mà không nói vì sao

- Vị trí: `$.exercises[13].explain.text` (`tn6`)
- Nguồn: tr.61 câu 6
- Vấn đề: câu dẫn `duong-tru-am` chỉ dẫn trường hợp a dương, b âm; trường hợp ngược lại chỉ được nói.
- Sửa: tuỳ tác giả, nối với mẹo `hieu-va-thu-tu`: "… còn nếu a âm và b dương thì a nhỏ hơn b nên a − b âm." (giữ trong 3 câu).

### 3. Trên điện thoại, chữ trong lời giải và mẹo xuống dòng giữa phép tính

- Vị trí: `$.exercises[28].explain.text` ("13 / · 40"), `$.exercises[24].explain.text` ("7 · / (−16)"), `$.exercises[31].explain.text`, `$.exercises[29].explain.text`, `$.sections[6].blocks[2].text` (mẹo `thua-so-chung-bi-giau`), `$.exercises[17].explain.tex` (`hieu-am-6-tru-4`, KaTeX tự ngắt sau "+") - LL-12
- Nguồn: walk phone, ví dụ `phone/134-s8-06-exercise-bai-3-44b-correct.png`, `phone/113-s7-03-block.png`, `phone/098-…-correct.png`
- Vấn đề: không chữ nào bị cắt, nhưng một phép tính bị chẻ hai dòng, bé chậm phải ghép lại.
- Sửa: khoảng trắng không ngắt quanh "·", "−", "=" trong cụm số ở phần chữ (như đề 3.42); `hieu-am-6-tru-4` xếp `gathered` hai dòng `(-6) - 4 = (-6) + (-4)` / `= -10`.

### 4. Lời giải `doi-thua-so-4` chưa đi tới đúng dạng của đáp án

- Vị trí: `$.exercises[26].explain.tex`, `.text`
- Nguồn: —
- Vấn đề: chữ nói "Tách 12 = 4 · 3" mà TeX viết `5 · 3 · 4` rồi dừng; đáp án viết `5 · 3 − 3` trong khi quy tắc nói "cộng hai thừa số còn lại", bé có thể tìm `5 · 3 + (−3)` và nghi đáp án.
- Sửa: TeX `5 \cdot 12 + 4 \cdot (-3)` / `= 4 \cdot 5 \cdot 3 + 4 \cdot (-3)` / `= 4 \cdot [5 \cdot 3 + (-3)]` / `= 4 \cdot (5 \cdot 3 - 3)`, và thêm vào chữ "cộng với −3 cũng là trừ 3". Lựa chọn giữ ngoặc tròn không lồng (vì `check`).

### 5. Thứ tự bước dẫn của section `thua-so-chung-3-43`: câu dễ đứng sau câu khó

- Vị trí: `$.sections[6].checkIds` (`doi-thua-so-6` rồi `tru-hai-tich`); `$.exercises[22].explain.tex`
- Nguồn: —
- Vấn đề: `tru-hai-tich` luyện riêng bước đổi trừ thành cộng mà `doi-thua-so-6` đã đòi trước; lời giải `tru-hai-tich` tính thẳng `30 + 40`, không dùng thừa số chung 10.
- Sửa: đặt `tru-hai-tich` trước `doi-thua-so-6`; TeX thêm `= 10 \cdot 3 + 10 \cdot 4` / `= 10 \cdot (3 + 4) = 70` (xếp dọc).

### 6. Section `thua-so-chung-3-44` lặp màn quy tắc và recap của section trước; `$.cards[6]` và `$.cards[7]` giống hệt nhau

- Vị trí: `$.sections[7].blocks[0]`, `$.sections[7].recap`, `$.cards[7].recap` so với `$.sections[6]`, `$.cards[6]`
- Nguồn: —
- Vấn đề: đúng cách sửa vòng 1 đã đề xuất, nhưng kho thẻ có hai thẻ cùng câu, cùng hình; việc riêng của `thua-so-chung-3-44` (tách số để lộ thừa số chung) không có trên thẻ nào.
- Sửa: tuỳ tác giả, dùng hình có sẵn: `$.sections[7].recap` và `$.cards[7].recap` đổi sang `phep-nhan-so-nguyen.visual.gop-mau` (ví dụ có từng bước của cùng quy tắc, đang là màn "Ví dụ mẫu" `$.sections[6].blocks[1]` của `thua-so-chung-3-43`; số (−5), (−8), 3 không trùng câu nào của `thua-so-chung-3-44`), caption giữ nguyên câu `rule`, để hai thẻ khác hình. Catalog Bài 16 không có hình vẽ phép tách số, nên thẻ thể hiện đúng việc tách số cần hình mới (mục "Việc còn lại").

### 7. Lời giải 3.42 không ghi tên số ở mỗi dòng

- Vị trí: `$.exercises[20].explain.tex`
- Nguồn: walk `phone/107-s6-08-exercise-bai-3-42-correct.png`
- Vấn đề: bốn dòng kết quả rồi `b < d < a < c`; bé phải tự đối chiếu dòng nào là a, b, c, d.
- Sửa: `a = 32 + (-28) = 4` / `b = (-7) - 5 = -12` / `c = (-12) \cdot (-5) = 60` / `d = (-28) : 7 = -4` / `b < d < a < c`; xem lại ảnh phone.

### 8. Lời giải `boi-7-trong-khoang` liệt kê bội dương như một danh sách đủ

- Vị trí: `$.exercises[33].explain.text`
- Nguồn: —
- Vấn đề: "Các bội dương của 7 là 7, 14, 21" đọc như chỉ có ba bội dương.
- Sửa (không dùng "…", checklist trục 3): "Nhân 7 với 1, 2, 3 được 7, 14, 21; 21 đã lớn hơn 16 nên chỉ giữ 7 và 14. Thêm các số đối −7, −14 và số 0, ta được năm số."

### 9. Đáp án `uc-duong-12-20` (1, 2, 4) trùng đáp án màn Cùng làm ngay trước

- Vị trí: `$.exercises[36]`; `$.sections[10].blocks[2]` (Cùng làm ước chung của 8 và −12: ±1, ±2, ±4) - LL-07
- Nguồn: walk `phone/165-s11-03-block-shown.png`
- Vấn đề: hai câu liền nhau cùng ra tập ước chung dương 1, 2, 4.
- Sửa: cặp khác, khác cả ±1, ±2, ±3, ±6 của 3.47, ví dụ 20 và 30 (1, 2, 5, 10; nhiễu 3, 4, 6), viết lại lời giải và `wrong` theo số mới.

### 10. Lời giải 3.49 nói "số đối của −4" mà không cho thấy −4 từ đâu

- Vị trí: `$.exercises[45].explain.text`, `.tex`
- Nguồn: —
- Vấn đề: bước (−7) + 3 = −4 không có trong chữ hay `tex`.
- Sửa: câu cuối "Các ô còn lại: (−7) + 3 = −4, nên là số đối của −4, tức là 4."; `tex` thêm dòng `(-7) + 3 = -4` trước `4 + (-7) + 3 = 0`. Viết cùng lúc với câu đầu ở Nên sửa 1.

### 11. Tiêu đề `bang-tich`, `bang-tong` vẫn gán bảng ba ô cho Bài 17, Bài 14

- Vị trí: `$.sections[11].title`, `$.sections[12].title`
- Nguồn: —
- Vấn đề: góp ý vòng 1 mới làm một nửa; bảng ba ô không có ở Bài 17 hay Bài 14.
- Sửa: "Bảng ba ô liền nhau có cùng tích (nhắc lại Bài 17)" và "Bảng ba ô liền nhau có cùng tổng (nhắc lại Bài 14)".

### 12. Câu số dương không có phím "−" nên bàn phím cho biết dấu của đáp án

- Vị trí: `$.exercises[40]`, `$.exercises[44]` (`o-xa-*`, nhóm 3); thêm phát hiện của Tổng hợp: `$.exercises[22]` (`tru-hai-tich`), `$.exercises[23]` (`bai-3-43a`), `$.exercises[24]` (`bai-3-43b`), `$.exercises[27]` (`bai-3-44a`) không có `allowNegative`, trong khi `bai-3-44b`, `tich-am-7-am-4`, `tim-x-7`, `o-con-lai-4-am-9` có
- Nguồn: walk `phone/182-s12-06-exercise-o-xa-bang-tich.png`, `phone/195-s13-06-exercise-o-xa-bang-tong.png`
- Vấn đề: chương này luyện chính dấu của kết quả; thiếu phím "−" báo trước đáp án dương (3.43a có −3 · 7 · (−17) mà bé biết ngay kết quả dương), và các câu cùng section làm khác nhau.
- Sửa: thêm `"allowNegative": true` cho sáu câu trên (đây là cài đặt của app, không đổi đề sách). Câu `o-xa-bang-tong` có đáp án 5 trùng đáp án `o-con-lai-4-am-9` ngay trước; có thể đổi ô đã cho thành −2 ("ô 8 là −2", đáp án −2, số chưa có trong `bang-tong`).

### 13. Một ô hai cách gọi trong cùng câu

- Vị trí: `$.exercises[39].explain.wrong[2].text` (`o-thu-tu-bang-tich`: "ô thứ tư") so với đề và lời giải cùng câu ("ô 4")
- Nguồn: —
- Vấn đề: lặp kiểu lệch đã sửa ở vòng 1 (ô thứ nhất / ô 1).
- Sửa: "… không phải số ở ô 4."

### 14. "Tích" và "phép nhân" thay nhau cho cùng một thứ ở `thua-so-chung-3-43`, `thua-so-chung-3-44`, `bang-tich`

- Vị trí: câu quy tắc `$.sections[6].blocks[0].children[0]`, `$.sections[7].blocks[0].children[0]` ("hai tích có chung một thừa số") so với `$.exercises[21]`, `[23]`, `[26]`, `[27]`, `$.sections[7].blocks[1].children[0]` ("cả hai phép nhân đều có thừa số …"); đề `$.exercises[39]`, `[40]` ("nhân lại đều được 60") so với `$.exercises[43]`, `[44]` ("tổng ba ô liền nhau luôn bằng 0") và câu quy tắc "cùng tích" - LL-05. Phát hiện của Tổng hợp.
- Nguồn: —
- Vấn đề: lượt đọc hiểu đã thay "tích" bằng "phép nhân" cho dễ đọc, nên quy tắc nói "hai tích" mà lời giải ngay dưới nói "hai phép nhân"; bé chậm có thể không nhận ra đó là cùng hai thứ. Hai section bảng ô hỏi cùng dạng mà một bên "nhân lại đều được", một bên "tổng … luôn bằng".
- Sửa: tuỳ tác giả; ví dụ lời giải nói "cả hai tích đều có thừa số 6" (từ "tích" đã giải nghĩa ở `tich-duong-cung-dau`), và đề bảng ô dùng một khuôn: "ba ô liền nhau bất kì nhân lại đều được 60" / "ba ô liền nhau bất kì cộng lại đều được 0".

## Việc còn lại (không chặn duyệt)

Không tính vào số Nên sửa, Góp ý của vòng này; cần tạo hình mới hay sửa `src/`, mà vòng này không được làm.

- Hình bảng ô cho recap `bang-tich`, `bang-tong` (Nên sửa 23 vòng 1): recap vẫn gắn `chia-het-vi-du`, `tong-doi-vi-du` (khớp câu Bài 17, Bài 14 nhưng không có ví dụ cho câu bảng ô). Catalog Bài 14, Bài 17 không có hình bảng ô dùng được; `[recap]` bắt recap là hình có caption nên không sửa bằng chữ được. Cần `lesson-visual`. Khi có hình, cân nhắc bỏ cờ `rule` của câu Bài 17 (Bài 14) cho recap còn một câu (LL-06).
- Sửa app cho `fillBlank` dạng bảng (Nên sửa 24 vòng 1): ô đã cho (6, −4, −7, 3) là chữ trơn không khung, dòng 11 ô tự gãy dòng (phone 3/3/3/2, iPad 6/4) và "|" có thể đứng đầu dòng (`phone/184-s12-07-exercise-bai-3-48.png`, `ipad/197-s13-07-exercise-bai-3-49.png`). Câu lệnh hiện tại giúp đọc được; khi điền đúng, thứ tự ô khớp bảng sách.
- Đáp án 3.47 (±1, ±2, ±3, ±6) in sẵn trên hình `uoc-chung-vi-du` ở màn quy tắc và recap `uoc-chung` (LL-07, nhóm 3 ghi Góp ý): hình đã duyệt của Bài 17 và đề sách đều cố định; nếu làm hình riêng cho bài thì chọn ví dụ ước chung khác ước của 6.
- Hình vẽ phép tách số (như 18 = 9 · 2 rồi đưa 9 ra ngoài) cho recap và card `thua-so-chung-3-44` (Góp ý 6), nếu muốn thẻ thể hiện đúng việc riêng của section này.
- Thư mục `.shots/walk/on-tap-chuong-3/` lẫn ảnh cũ của vòng 1 (21:22) với ảnh mới (22:05), cùng số thứ tự; cả ba nhóm phải lọc theo giờ chụp. Trước walk vòng sau, điều phối nên chạy walk vào thư mục sạch.
- `content/math/kntt/tap-hop-cac-so-nguyen/lesson.json` và `src/visuals/math/tap-hop-cac-so-nguyen/` đang có thay đổi chưa commit của phiên khác (thêm phần bài tập sách bài tập, sửa `line-try.tsx`); bài này dùng 8 hình và các câu quy tắc của Bài 13. Sau khi thay đổi đó vào git, chạy lại walk các section `so-sanh`, `tap-hop-a`, `tinh-abcd` và so lại câu chép nguyên văn.
- Lượt Đọc hiểu (Haiku) trên chữ đổi trước `--approve`, rồi `pnpm content:lock on-tap-chuong-3`.

## Đã soát mục vòng 1

- 7 Nghiêm trọng vòng 1 đã sửa thật, không thấy bản sửa làm hỏng chỗ khác (LL-20) ngoài các mục ghi ở trên: mẹo so sánh có điều kiện (còn thiếu dấu >: Nên sửa 4); 3.45 có "."; lời giải 3.43a, 3.44a, 3.44b hiện đủ trên phone (840, 3 904, −442); phép trừ tích đổi thành cộng số đối trước khi đưa thừa số ra (còn sót cách nói ở Nên sửa 7); lời giải 3.43a, 3.48, 3.49 khác chuỗi bước sách tr.114; màn bảng ô dùng số riêng và "ô 1, ô 2" (mất câu kết luận: Nên sửa 1); `uc-duong-12-20` chỉ còn hai dãy số.
- Nên sửa 1 đến 22 vòng 1 đã sửa; câu mới của mẹo ước chung (Nên sửa 22) sinh ra Nên sửa 3 ở trên. Nên sửa 23, 24 còn mở (mục "Việc còn lại"). Góp ý vòng 1 đã làm, trừ Góp ý 8 (thẻ 3.42 kèm biểu thức; lý do của tác giả hợp lý, Góp ý 7 ở trên giảm việc phải nhớ) và Góp ý 15 (làm một nửa: Góp ý 11 ở trên).

## Đã soát và đạt

- Đề 17 câu sách khớp `sbt-p61.png`, `sbt-p62.png` từng chữ, số, ký hiệu, dấu (U+2212, U+00B7, ℤ, ∈, ∉, ≤), trừ dấu cuối ý ở Nên sửa 8; các chỗ khác sách nằm trong "Giả định" của handover (bỏ nhãn lựa chọn, tách ý a), b), khối lệnh của app, khoảng trắng không ngắt ở 3.42, 3.44b xếp hai dòng).
- Đáp án khớp `sbt-p114.png`, cả ba nhóm tự giải trước khi đọc `answer`: 1 D, 2 C, 3 A, 4 D, 5 C, 6 B; 3.41 −27 và 27; 3.42 b < d < a < c; 3.43a 840, 3.43b 238; 3.44a 3 904, 3.44b −442; 3.45 x = 38, x = −25; 3.46 −18; −12; −6; 0; 6; 12; 18; 3.47 ±1; ±2; ±3; ±6; bảng 3.48, 3.49 khớp bảng sách.
- Mỗi câu một đáp án hay một tập đáp án; mọi nhiễu sai đúng như `wrong` nói; mọi phép tính trong `explain`, mẹo, ví dụ mẫu đúng; không lời giải nào gọi lựa chọn theo vị trí (LL-26); không phủ định kép; câu chọn nhiều có "Chọn tất cả"; câu dẫn khác số câu sách, không lộ đáp án.
- Gợi ý nấc 1 tô khối đề hay khối công thức, không lộ đáp án.
- Khối chép từ Bài 13, 14, 16, 17: câu chữ trùng nguyên văn bài gốc (Tổng hợp kiểm lại các câu "Số nguyên âm nằm trước số 0…", "bên trái gốc O", "Hai số âm nhân với nhau…", "Hai số âm cộng nhau…", "Trừ đi một số âm thì…"); số trên hình khớp chữ cạnh hình (LL-15). Mỗi câu `rule: true` của 13 section được recap section và card lặp nguyên văn.
- Tổng hợp soát chéo mọi `note`, `recap`, `caption`, mẹo và thuật ngữ cả bài: các câu quy tắc của 13 section không mâu thuẫn nhau về nội dung; "phần dấu", "phần số tự nhiên", "số đối", "thừa số chung", "bội", "ước chung" dùng một tên trong cả bài; câu "Hai số đối nhau cộng lại thì được 0." ở mẹo `tim-so-doi` và câu quy tắc `bang-tong` trùng nguyên văn. Chỗ lệch: Nên sửa 1, 5, 7 và Góp ý 1, 13, 14.
- Câu quy tắc bảng ô không phải kiến thức ngoài nguồn (LL-09): là kết luận "ô thứ nhất, thứ tư, thứ bảy, thứ mười bằng nhau" của lời giải sách nói chung cho mọi bảng; điều kiện "khác 0" ở bản tích cần và đủ (nhóm 3 kiểm mọi bộ 4 số từ −4 đến 4: 0 trường hợp sai; biên (0, 0, 1, 5) cho ô 1 ≠ ô 4). Giữ cờ `rule`.
- `overview` (hook mượn tiền, 3 − 5 = −2; `whyItMatters` một câu đời sống), `sourceRef` của bài, section, card đúng trang (tr.60–62, lời giải tr.114). Màu khái niệm khớp glossary.
- Sheet walk phone và iPad của 13 section (ảnh sau bản sửa): không chữ chồng, cắt hay tràn, ngoài Góp ý 3 và mục fillBlank ở "Việc còn lại".

## Bảng thử mẹo

| Mẹo                     | Các số đã thử                                                                                                                                                                   | Kết quả                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `so-sanh-nhieu-so`      | Từ bé đến lớn: {−11; −6; 0; 8}; {−3; 5; 0; −8}; {−9; −4; 0; 5}; {−100; −99}; {0; 7; 1}; {−4; −4; 2}; {1; 0; −1}. Từ lớn đến bé: {−3; 5; 0; −8}, {−9; −4; 0; 5}, {−11; −6; 0; 8} | Đúng mọi bộ từ bé đến lớn; từ lớn đến bé thứ tự đúng nhưng mẹo không nói đổi sang dấu > (Nên sửa 4)                                                  |
| `tich-duong-tong`       | (3, 4); (−3, −4); (1, 1); (−1, −1); (−20, −1); (1, 100); (0, 5); (3, −3)                                                                                                        | Đúng mọi bộ có tích dương; có 0 hay khác dấu thì mẹo không áp dụng                                                                                   |
| `hieu-va-thu-tu`        | (5, 3); (3, 5); (0, −1); (−1, 0); (−2, −7); (−7, −2); (4, −4); (−30, 30)                                                                                                        | Đúng mọi bộ (lời mẹo có điều kiện hai số khác nhau)                                                                                                  |
| `tim-so-doi`            | −15 và 15; 40 và −40; 0 và 0; −27 và 27; 1 và −1; nhầm −27 và −27; nhầm 9 và 9                                                                                                  | Đúng; bắt được mọi lần tìm nhầm                                                                                                                      |
| `thua-so-chung-bi-giau` | 4 · 7 − 2 · 2 · (−5) = 48; 6 · 4 − 2 · 3 · (−5) = 54; 21 · 23 − 3 · 7 · (−17) = 840; 10 · 3 + 2 · 5 · (−4) = −10; 1 · 7 + 1 · 1 · 5 = 12; biên 6 · 4 − 2 · (−5) · 3             | Đúng; ca biên mẹo không tìm ra thừa số chung nhưng không cho kết quả sai                                                                             |
| `tach-thua-so`          | 48 · 5 + 6 · (−7) = 198; 5 · 12 + 4 · (−3) = 48; 18 · 5 + 9 · (−4) = 54; 42 · 3 − 7 · (−16) = 238; 71 · 64 + 32 · (−7) = 4 320; 0 · 5 + 6 · (−7) = −42; biên 7 · 5 + 3 · (−2)   | Đúng; ca không tách được mẹo chỉ bảo "thử"                                                                                                           |
| `kiem-lai-x`            | x − 9; x + 6; 38 − x; x + 25; x − 7; x − (−3); nhầm x = 25 cho x + 25                                                                                                           | Đúng; bắt được lỗi sai dấu (nhiễu 25, −38 của 3.45)                                                                                                  |
| `boi-doi-xung`          | 9 trong (−30; 30); 6 trong (−19; 19); 7 trong (−16; 16); 5 trong [−15; 15]; 7 trong (−5; 5); 1 trong (−1; 1); bội của −3 trong (−10; 10); khoảng lệch (−10; 20)                 | Đúng mọi khoảng đối xứng; khoảng lệch thì lời mẹo đã nói không dùng                                                                                  |
| `uoc-chung-nhanh`       | (15, 25); (36, 42); (12, 20); (8, −12); (6, 6); (1, 7); (5, −15); mọi cặp khác 0 từ −40 đến 40; biên (0, 6)                                                                     | Đúng mọi cặp khác 0; với 0 không liệt kê được, và câu "25 chỉ chia hết cho hai số này" hai cách hiểu (Nên sửa 3)                                     |
| `bang-o-lien-nhau`      | 3.48 (từ ô 10 lùi tới ô 7, 4, 1; từ ô 3 tiến tới ô 6, 9); 2, −3, 5 (7 ô); (−1, 5, −2); tích 60 với ô 1 = −3; biên tích 0 (0, 0, 1, 5)                                           | Đúng khi tích khác 0; hai cách nói 2 ô / 3 ô và mẹo lặp quy tắc (Nên sửa 1). Mẹo thay thế đề xuất ở Nên sửa 1 đã thử trên 6 bộ, đúng khi tích khác 0 |
| `o-con-thieu-tong-0`    | (5, −8) → 3; (4, −9) → 5; (−7, 3) → 4; (0, 0) → 0; (6, −6) → 0; (−3, −5) → 8; (10, 2) → −12                                                                                     | Đúng mọi trường hợp                                                                                                                                  |

## Đã sửa sau vòng 2

- Nên sửa 1 (`bang-tich`, `bang-tong`): một câu quy tắc chung "Nếu ba ô liền nhau luôn có cùng tích khác 0 (tổng), thì từ một ô, tiến hay lùi 3 ô sẽ gặp lại số đó." cho note `rule`, recap section, card và lời giải `o-xa-*` (câu rút gọn còn 25 từ vì `[length]` giới hạn 25 từ một câu; bỏ "bất kì", "đúng" và ví dụ "như ô 1, ô 4, ô 7"). Thêm note "Vậy ô 4 là −1 (2), bằng ô 1." trước câu quy tắc. Lời giải `o-xa-*` nói "Ô 7 là 9 (ô 8 là 5) nên lùi 3 ô …". Lời giải 3.48, 3.49 mở bằng vế "Từ một ô, tiến hay lùi 3 ô sẽ gặp lại số đó." (tách thành câu riêng vì câu ghép dài hơn 25 từ); 3.49 thêm bước (−7) + 3 = −4 vào chữ và `tex`. Mẹo `bang-o-lien-nhau` đổi thành "Tìm ô còn thiếu khi biết tích".
- Nên sửa 2 (`o-xa-bang-tich`): đề "ô 7 là 9", đáp án 9, `check.expr` "9" (bảng 9, 2, 2: 9 · 2 · 2 = 36, ba ô liền nhau bất kì cùng tích 36).
- Nên sửa 3 (mẹo `uoc-chung-nhanh`): mở bằng "Với hai số khác 0", câu cuối "Trong bốn số đó, 25 chỉ chia hết cho 1 và 5, nên giữ lại 1 và 5, rồi viết thêm số đối của chúng." (câu đầu bỏ "từng ước" cho đủ 25 từ).
- Nên sửa 4 (`xep-day-so`, nhiễu `d`): lý do "5 < 0 là sai vì 5 lớn hơn 0. …"; mẹo `so-sanh-nhieu-so` thêm dòng `8 > 0 > −6 > −11` và nói "dùng dấu >".
- Nên sửa 5 (mẹo `so-sanh-nhieu-so`): hai câu sau là nguyên văn quy tắc so sánh hai số âm của Bài 13; câu đầu viết gọn lại còn 25 từ ("Xếp từ bé đến lớn thì xếp số âm, số 0, rồi số dương; từ lớn đến bé thì làm ngược lại, dùng dấu >.").
- Nên sửa 6 (`bai-3-44a`): lời giải hai bước mỗi bước hai tích; `tex` sáu dòng theo review. Câu thứ hai tách ra, câu cuối "Gộp 32 · (−13) với 32 · (−7) trước, rồi đưa 32 ra ngoài." (giới hạn 25 từ).
- Nên sửa 7 (`doi-thua-so-6`, `tru-hai-tich`): lời giải và lý do `b` dùng nguyên quy tắc "Muốn trừ một số, ta cộng với số đối của số đó"; bỏ câu "Số 10 · (−4) là số âm.".
- Nên sửa 8 (`bai-3-43b`, `bai-3-44b`): thêm "." cuối `42 \cdot 3 - 7 \cdot [(-34) + 18].` và dòng hai của 3.44b; thêm dòng ngoại lệ vào "Giả định" của `task.md`.

## Đã sửa sau Đọc hiểu và kiểm phần đổi

- 18 mục "Hiểu mơ hồ" viết lại (tác giả Sonnet): quy tắc bảng ba ô thành "Nếu ba ô liền nhau luôn có cùng tích khác 0 (cùng tổng), thì ô 1, ô 4, ô 7 có cùng một số.", dùng nguyên văn ở note `rule: true`, recap section và card của `bang-tich`, `bang-tong`, và lời giải `o-xa-*`; lời giải 3.48, 3.49 nêu thẳng các nhóm ô bằng nhau; lời giải 3.43a/b, 3.44a/b và mẹo `thua-so-chung-bi-giau` nói "đưa thừa số chung N ra ngoài dấu ngoặc, tức viết N · (...)".
- Lời giải `bai-3-44a` thêm bước 71 · 64 = 71 · 2 · 32 = 142 · 32; lời giải 3.48 tách 6 · (−4) = −24 trước phép chia (hai mục còn mơ hồ ở lượt 2).
- Kiểm phần đổi (Reviewer Sonnet, `.shots/review/on-tap-chuong-3/r2-fix-check.md`): 0 Nghiêm trọng, 2 Nên sửa, 5 Góp ý; mọi số trong lời giải tính lại đúng. Đã sửa cả hai Nên sửa: lời giải `o-xa-bang-tong` thêm "Cũng vậy, ô 2, ô 5, ô 8 có cùng một số"; lời giải 3.43a, 3.43b, 3.44a, 3.44b dùng nguyên văn "Muốn trừ một số, ta cộng với số đối của số đó" như `doi-thua-so-6`, `tru-hai-tich` và mẹo. Góp ý để tác giả cân nhắc sau.
