# Review: Ôn tập chương III (`on-tap-chuong-3`)

- Bài: `content/math/kntt/on-tap-chuong-3/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp (nhóm 1: `so-sanh`, `tap-hop-a`, `dau-tich-tong`, `dau-tich-hieu`; nhóm 2: `so-doi`, `tinh-abcd`, `thua-so-chung-3-43`, `thua-so-chung-3-44`, `tich-bang-0`; nhóm 3: `boi-trong-khoang`, `uoc-chung`, `bang-tich`, `bang-tong`, `overview`)
- Nguồn đã đọc: `sources/math/on-tap-chuong-3/` - sbt-p60, sbt-p61, sbt-p62, sbt-p114 (Tổng hợp đối chiếu thêm `phep-nhan-so-nguyen/sbt-p55.png` và `lesson.json` của Bài 16)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (86 id chưa khoá)
- Đọc hiểu (Haiku): không chạy ở vòng này (lượt Haiku đã chạy lúc soạn, xem handover `notebooks/backlogs/lesson-on-tap-chuong-3/task.md`; chạy lại trên chữ đổi trước `--approve`)
- `lesson:walk`: 0 FAIL, 0 cảnh báo (ipad, phone, ipad-landscape), ảnh trong `.shots/walk/on-tap-chuong-3/`
- Kết luận: Chưa đạt: còn 7 lỗi Nghiêm trọng
- Bản đã review: `5d7ca2e3e127a8245893497d479d62549085b8a794a3da1870022b03a87fd937` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

### 1. Mẹo "So sánh nhiều số nguyên" sai khi đề bảo xếp từ lớn đến bé

- Vị trí: `$.sections[0].blocks[2].text`, `.title` (`on-tap-chuong-3.tip.so-sanh-nhieu-so`) - LL-24
- Nguồn: —
- Vấn đề: "Xếp nhóm số âm trước, rồi tới số 0, sau cùng là nhóm số dương" chỉ đúng khi xếp từ bé đến lớn, nhưng lời mẹo và tiêu đề không nói điều kiện đó. Xếp từ lớn đến bé là dạng bài của chương (Bài 13). Áp đúng chữ cho −3; 5; 0; −8 khi đề bảo xếp từ lớn đến bé thì ra −8, −3, 0, 5 (sai). Trang "Mẹo hay" gom mẹo ra khỏi section nên điều kiện phải nằm trong `text`.
- Sửa: "Muốn xếp từ bé đến lớn, chia các số thành ba nhóm: ... Muốn xếp từ lớn đến bé thì viết theo thứ tự ngược lại." Tiêu đề: "Xếp nhiều số nguyên từ bé đến lớn".

### 2. Đề 3.45 mất dấu "." cuối câu sau công thức

- Vị trí: `$.exercises[31].prompt[1].tex` (`on-tap-chuong-3.ex.bai-3-45`) - LL-23
- Nguồn: tr.62, `sbt-p62.png`, 3.45
- Vấn đề: đề tách thành khối chữ "Tìm x, nếu" và khối công thức `(38 - x) \cdot (x + 25) = 0`; dấu "." kết câu của sách rơi mất. Đề khác sách một dấu là Nghiêm trọng (checklist trục 1, "Bài ôn tập"). Lặp đúng kiểu lỗi của `on-tap-chuong-2`.
- Sửa: `(38 - x) \cdot (x + 25) = 0.`

### 3. Lời giải bị cắt bên phải trên điện thoại ở 3.43a, 3.44a, 3.44b; 3.44b mất kết quả −442

- Vị trí: `$.exercises[23].explain.tex` (`bai-3-43a`), `$.exercises[27].explain.tex` (`bai-3-44a`), `$.exercises[28].explain.tex` (`bai-3-44b`) - LL-12
- Nguồn: walk `phone/118-s7-06-exercise-bai-3-43a-correct.png` (dòng cuối hiện "84(" thay cho 840), `phone/132-s8-06-exercise-bai-3-44a-correct.png`, `phone/134-s8-07-exercise-bai-3-44b-correct.png` (Tổng hợp đã mở: hai dòng cụt "13 · (2", "13 · (−3", không thấy "= −442"). iPad hiện đủ; walk không đo tràn trong KaTeX.
- Vấn đề: dòng `gathered` quá dài nên bé không thấy bước cuối hay thấy số sai.
- Sửa: mỗi dòng `gathered` một phép, tối đa khoảng 20 ký tự và ba vế (luật đã ghi ở LL-12). Viết lại cùng lúc với cách sửa của mục 4 và 5, ví dụ 3.44b: `13 \cdot 6 + 13 \cdot (-40)` / `= 13 \cdot [6 + (-40)]` / `= 13 \cdot (-34)` / `= -442`. Chụp lại phone và mở từng ảnh `*-correct.png` của ba câu.

### 4. Đưa thừa số chung ra ngoài khi hai tích trừ nhau chưa được dạy; làm đúng chữ quy tắc thì ra nhiễu

- Vị trí: `$.sections[6].blocks[0].children[0]` (quy tắc "Khi cộng hai tích ... rồi cộng hai thừa số còn lại.") so với `$.exercises[21]` (`doi-thua-so-6`, đáp án `6 · (4 − (−5))`), `$.sections[6].blocks[2]` (mẹo `thua-so-chung-bi-giau`, `4 · [7 − (−5)]`), `explain` của `bai-3-43a` (`21 · [23 − (−17)]`), `bai-3-44a` ("−13" trong ngoặc), `bai-3-44b` (`13 · [6 − 40]`) - LL-09
- Nguồn: tr.62, tr.114; Bài 16 của app (`phep-nhan-so-nguyen`, section `gop-thua-so`, `phan-phoi`) và trang `phep-nhan-so-nguyen/sbt-p55.png` ("Phân phối đối với phép cộng") chỉ có trường hợp cộng; glossary không có mục nào về phép trừ.
- Vấn đề: Tổng hợp đã kiểm Bài 16: không câu, ví dụ, mẹo hay bài tập nào có a · b − a · c = a · (b − c); mọi khối đều là tổng hai tích. Bài ôn này dùng phép trừ ở mọi bước dẫn và lời giải của hai section. Bé làm theo đúng chữ "rồi cộng hai thừa số còn lại" sẽ viết 6 · [4 + (−5)], tức nhiễu `b` của `doi-thua-so-6`; lý do `wrong` của nhiễu đó không nói vì sao phải giữ dấu −.
- Sửa: chọn một, không thêm quy tắc ngoài nguồn:
  (a) chỉ dùng điều đã dạy: đổi phép trừ thành cộng số đối trước rồi mới đưa thừa số ra ngoài ("Muốn trừ một số, ta cộng với số đối của số đó" có ở section `dau-tich-hieu`), ví dụ `6 · 4 − 6 · (−5) = 6 · 4 + 6 · 5 = 6 · (4 + 5)`; `13 · 6 − 13 · 40 = 13 · 6 + 13 · (−40) = 13 · [6 + (−40)]`. Câu chữ cần một ý nối: "6 · (−5) là số âm, trừ nó tức là cộng số đối của nó, là 6 · 5". Đổi đáp án `doi-thua-so-6` thành `6 · (4 + 5)` và viết lại nhiễu cho khớp; sửa mẹo `thua-so-chung-bi-giau` theo cùng cách.
  (b) thêm một màn nhắc có ví dụ hai tích trừ nhau trước `doi-thua-so-6`, dựng từ hai quy tắc đã dạy (a · b − a · c = a · b + a · (−c) = a · [b + (−c)]), với số khác sách và khác các bước dẫn, rồi lý do `wrong` của nhiễu `b` nói rõ "hai tích trừ nhau thì trong ngoặc cũng trừ".

### 5. Lời giải 3.43a trùng nguyên chuỗi bước lời giải sách

- Vị trí: `$.exercises[23].explain.tex` và câu cuối `$.exercises[23].explain.text` (`bai-3-43a`) - LL-08
- Nguồn: tr.114, `sbt-p114.png`, 3.43a
- Vấn đề: `tex` là ba vế đầu của lời giải sách đúng thứ tự (thay 3 · 7 bằng 21, viết hiệu hai tích, đưa 21 ra ngoài với ngoặc vuông `[23 − (−17)]`), phần chữ thêm vế `21 · 40 = 840` còn lại. Tổng hợp cân nhắc mức: số của đề ép thừa số chung 21, nhưng chuỗi bước không bị ép, vì có cách trình bày khác hợp lệ và chỉ dùng điều đã dạy (đổi phép trừ thành cộng số đối, mục 4 cách (a)), nên giữ Nghiêm trọng theo LL-08 ("đổi lời mà giữ số và chuỗi bước của lời giải vẫn là chép").
- Sửa: gộp với mục 4 cách (a): "3 · 7 = 21. 21 · (−17) là số âm, trừ nó tức là cộng 21 · 17, nên đưa 21 ra ngoài." `tex`: `21 \cdot 23 + 21 \cdot 17` / `= 21 \cdot (23 + 17)` / `= 21 \cdot 40 = 840`. Nếu chọn cách (b) của mục 4 thì vẫn phải đổi trình bày (ví dụ tính 23 − (−17) = 40 bằng một dòng riêng trước), không để nguyên dòng sách.

### 6. Màn lập luận bảng ba ô và lời giải 3.48 chép lời giải sách của 3.48

- Vị trí: `$.sections[11].blocks[1]` (`bang-tich`: "Gọi bốn ô liền nhau là a, b, c, d. Hai phép nhân a · b · c và b · c · d đều cho kết quả 120." kèm công thức và "nên a = d"), `$.sections[12].blocks[1]` (`bang-tong`, cùng lập luận với tổng 0), `$.exercises[40].explain` (`bai-3-48`: "Ô còn thiếu là số x có x · 6 · (−4) = 120. Vậy x = −5.") - LL-08, LL-10. Phát hiện của Tổng hợp, gộp Nên sửa 6 của nhóm 3 (chữ a, b hai nghĩa).
- Nguồn: tr.114, `sbt-p114.png`, lời giải 3.48 (bốn ô a, b, c, d; abc = bcd = 120; suy ra a = d; "Các ô còn lại chứa số x thoả mãn x · 6 · (−4) = 120. Vậy x = −5.") và 3.49 ("Lập luận tương tự Bài 3.48").
- Vấn đề: màn "Nhắc lại" của `bang-tich` là lời giải sách viết lại lời mà giữ nguyên chữ a, b, c, d, số 120 và chuỗi bước; `explain` của 3.48 gần như nguyên câu cuối của lời giải sách. Checklist trục 1: phần nhắc lại và lời giải của câu `bookRef` phải là lời của bài. Thêm nữa, ngay màn trước a, b là số bị chia và số chia ("a = b · q"), nên một chữ có hai nghĩa trên hai màn liền nhau, còn mọi lời giải lại gọi "ô 1, ô 2".
- Sửa: (1) màn lập luận dùng ví dụ số của bài, gọi ô bằng "ô 1, ô 2, ô 3, ô 4" (chữ để trong `note`, không đặt chữ Việt trong TeX), số khác 3.48, 3.49 và khác mẹo (mẹo dùng 2, −3, 5), ví dụ bảng −1, 4, −2, ?: (−1) · 4 · (−2) = 8 và 4 · (−2) · ? = 8 nên ? = −1, tức ô 4 bằng ô 1; làm tương tự cho `bang-tong` (ví dụ 1, −6, 5, ?). (2) `explain` 3.48 đi theo cách khác sách, ví dụ đi từ ô đã cho: "Ô 10 là −4; lùi mỗi lần 3 ô thì ô 7, ô 4, ô 1 cũng là −4. Ô 3 là 6 nên ô 6, ô 9 cũng là 6. Ô còn lại là 120 : [(−4) · 6] = 120 : (−24) = −5." (3) Câu "Sửa" của Nên sửa 4 dưới đây phải theo luật này, không chép câu sách.

### 7. Lời giải `uc-duong-12-20` viết "20 : 1, 2, 4", đọc thành phép chia hay thành "ước của 20 là 1, 2, 4"

- Vị trí: `$.exercises[36].explain.tex` (`on-tap-chuong-3.ex.uc-duong-12-20`) - LL-21
- Nguồn: walk `phone/169-s11-06-exercise-uc-duong-12-20-correct.png` (Tổng hợp đã mở: hai dòng "12 : 1, 2, 3, 4, 6, 12" và "20 : 1, 2, 4")
- Vấn đề: trong chương này ":" là dấu chia (section kế tiếp dạy "a : b = q"), nên dòng đọc thành "12 chia 1, 2, 3...". Hai dòng cùng dạng mà dòng trên là đủ các ước của 12, nên bé hiểu dòng dưới là đủ các ước của 20, tức nhớ sai "ước của 20 là 1, 2, 4" (thiếu 5, 10, 20). Lặp đúng mẫu đã ghi ở LL-21 (`on-tap-chuong-2` vòng 2: trong TeX, ":" chỉ dùng cho phép chia). Tổng hợp giữ Nghiêm trọng vì hình dạy một điều sai kiến thức.
- Sửa: bỏ ":" trong TeX; dòng 1 `1,\ 2,\ 3,\ 4,\ 6,\ 12`, dòng 2 `1,\ 2,\ 4`, còn ý từng dòng nói trong `text` ("Các ước dương của 12 là ...; trong đó 20 chỉ chia hết cho 1, 2, 4"). Hoặc viết mỗi ước chung thành phép chia hết thật (`20 = 4 \cdot 5`). Không đặt chữ Việt trong TeX.

## Nên sửa

### 1. Ví dụ của mẹo so sánh cho thấy luôn đáp án câu hỏi 1, và cùng hình xếp hàng hiện sẵn thứ tự ba số của 3.42

- Vị trí: `$.sections[0].blocks[2].tex` (`tip.so-sanh-nhieu-so`, `−12 < −4 < 0 < 3`) so với `ex.tn1`; `$.sections[5].blocks[3]` và `recap` (hình `xep-hang`, `xep-hang-xong`: −4, −1, 2, 4) - LL-07. Gộp Nên sửa 1 nhóm 1 và Góp ý 2 nhóm 2.
- Nguồn: tr.61 câu 1; tr.114 (3.42: b = −12, d = −4, a = 4)
- Vấn đề: ví dụ dùng đúng ba số 0; 3; −12 của câu 1, bé chỉ cần bỏ −4 là ra đáp án `−12 < 0 < 3`; trái giả định của handover "Mọi số trong bước dẫn khác số của sách". Ví dụ đó cùng hình xếp hàng còn đặt sẵn −12 < −4 < 4 của 3.42.
- Sửa: đổi `tex` của mẹo sang số không có trong câu 1, 3.42 và hình `am-0-duong`, ví dụ `−11 < −6 < 0 < 8`. Hình xếp hàng dùng lại từ Bài 13 thì giữ.

### 2. Câu `cung-dau-tong-am` dùng tổng −7 đã có trên ví dụ và mẹo ngay trước

- Vị trí: `$.exercises[7].prompt[0].text`, `.explain.tex` (`ex.cung-dau-tong-am`) - LL-07
- Nguồn: —
- Vấn đề: tổng −7 trùng note "(−3) + (−4) ... được −7", hình `cung-dau-vi-du` và dòng cuối mẹo `tich-duong-tong`; `explain.tex` lặp đúng phép tính đó.
- Sửa: đổi tổng sang −11 và `explain.tex` thành `(-5) + (-6) = -11` (số không có ở các màn trước và ở câu 3, 4).

### 3. Section `tap-hop-a` không nhắc ký hiệu ∉, trong khi ba trong bốn lựa chọn câu hỏi 2 có ∉

- Vị trí: `$.sections[1].blocks[3]`, `ex.thuoc-c`, `ex.thuoc-d` - LL-16
- Nguồn: tr.61 câu 2
- Vấn đề: phần nhắc chỉ dạy "Dấu ∈ đọc là thuộc"; ví dụ B nói "2 không thuộc B" bằng chữ; hai bước dẫn không dùng ∉. Lần đầu bé gặp lại ∉ là ở câu sách (`docs/learner.md`: bé chưa viết được ký hiệu tập hợp).
- Sửa: thêm vào ví dụ B "Ta viết −3 ∈ B và 2 ∉ B; dấu ∉ đọc là không thuộc." (hay dòng `2 \notin B` trong khối công thức); cho `thuoc-c` một lựa chọn dạng ∉ (ví dụ đáp án "−4 ∉ C"), các nhiễu viết đều bằng ∈ hay ∉.

### 4. Bước dẫn, lời giải và mẹo của 3.48, 3.49 thiếu bước nối ô ở xa về ba ô đầu; mẹo `bang-o-lien-nhau` chỉ nói lại câu của màn trước

- Vị trí: `ex.o-thu-tu-bang-tich`, `ex.bai-3-48` `explain`, `ex.o-thu-tu-bang-tong`, `ex.bai-3-49` `explain`, `$.sections[11].blocks[2]` (`tip.bang-o-lien-nhau`). Gộp Nên sửa 4 và 8 nhóm 3.
- Nguồn: `sbt-p62.png` (ô đã cho: 3.48 ô 3 và ô 10; 3.49 ô 2 và ô 9)
- Vấn đề: bước dẫn chỉ cho thấy ô 1 bằng ô 4, còn câu sách cho số ở ô 10, ô 9; không bước nào dạy ô 10 = ô 7 = ô 4 = ô 1. Lời giải nhảy từ "bảng cứ lặp lại ba số" sang phép tính. Mẹo nói lại "các ô cách nhau hai ô bằng nhau" (mẹo gượng) và "tìm ba ô đầu" không dùng thẳng được cho 3.48 vì ba ô đầu chỉ biết một ô.
- Sửa: (a) thêm hoặc đổi một bước dẫn hỏi ô xa, số khác sách, ví dụ "Ba ô liền nhau bất kì nhân lại đều được 60, ô thứ bảy là 2. Ô thứ nhất là số nào?"; (b) lời giải 3.48, 3.49 theo cách ở Nghiêm trọng 6 (đi từ ô đã cho, lùi hay tiến mỗi lần 3 ô; không chép câu sách); (c) mẹo thành cách làm thật, ví dụ "Hai ô cách nhau 3 bước luôn cùng một số. Từ ô đã biết, cứ tiến hay lùi 3 ô là gặp lại số đó." với ví dụ trên một bảng khác độ dài và khác số 3.48.

### 5. Recap section và card `dau-tich-hieu` không phải ý dùng để giải câu hỏi 5, 6

- Vị trí: `$.sections[3].recap`, `$.cards[3].recap`, cờ `rule` ở `$.sections[3].blocks[1].children[0]`
- Nguồn: tr.61 câu 5, 6
- Vấn đề: recap là cách đi sang phải trên trục số khi trừ số âm, còn bước dẫn và lời giải câu 5, 6 dùng "trừ một số là cộng với số đối" cùng dấu của tích.
- Sửa: chuyển cờ `rule` sang note "Muốn trừ một số, ta cộng với số đối của số đó." (khối đã duyệt ở Bài 14), recap section và card dùng hình `tru-vi-du` kèm câu đó.

### 6. Một quy tắc nói nhiều cách trong lời giải (dấu của tích, phép trừ)

- Vị trí: `explain` của `ex.tich-duong-cung-dau`, `ex.tich-am-khac-dau` ("Nhân hai số cùng dấu thì được số dương, nhân hai số khác dấu thì được số âm.") so với câu `rule` `$.sections[2].blocks[0]` ("Hai số khác 0 cùng dấu thì tích dương, khác dấu thì tích âm."); `explain` của `ex.duong-tru-am`, `ex.hieu-am-6-tru-4` ("Trừ một số thì giống như cộng với số đối của nó.") so với note `$.sections[3].blocks[0]` ("Muốn trừ một số, ta cộng với số đối của số đó.") - LL-05. Phát hiện của Tổng hợp.
- Nguồn: —
- Vấn đề: cùng một quy tắc có hai cách nói trong cùng bài, cách nói trong lời giải bỏ điều kiện "khác 0"; bé ôn card thấy một câu, làm bài thấy câu khác.
- Sửa: lời giải trích nguyên câu quy tắc ("Hai số khác 0 cùng dấu thì tích dương, khác dấu thì tích âm.", "Muốn trừ một số, ta cộng với số đối của số đó.") rồi mới áp vào số của câu.

### 7. Section "nhân một số với một tổng" nhắc và tóm tắt một quy tắc mà không câu nào trong section dùng

- Vị trí: `$.sections[7]` (`thua-so-chung-3-44`): `title`, `blocks[0]`, `blocks[1]`, `recap`; `$.cards[7].recap`
- Nguồn: tr.62, tr.114
- Vấn đề: màn nhắc, ví dụ mẫu, recap dạy nhân phá ngoặc a · (b + c) = a · b + a · c, còn các bước dẫn và lời giải 3.44a, 3.44b đều tách số rồi đưa thừa số chung ra ngoài (quy tắc của section trước). Recap lệch việc của section (checklist trục 4).
- Sửa: đổi màn nhắc, ví dụ mẫu, recap sang "đưa thừa số chung ra ngoài" với ví dụ có bước tách số (gộp với mẹo `tach-thua-so`), sửa `title`; hoặc giữ quy tắc nhân phá ngoặc và cho `explain` 3.44b đi theo nó bằng lời của bài (không chép dòng sách tr.114).

### 8. 3.43b ở section 7 nhưng cách tính hợp lí cần mẹo tách số của section 8; lời giải tính thẳng

- Vị trí: `$.sections[6].practiceIds`, `$.exercises[24].explain` (`bai-3-43b`)
- Nguồn: tr.62 ("tìm cách tính hợp lí")
- Vấn đề: `explain` tính thẳng 126 + 112; cách tách 42 = 7 · 6 chỉ được dạy ở mẹo `tach-thua-so` của section sau.
- Sửa: chuyển 3.43b sang section `thua-so-chung-3-44` hoặc đưa mẹo `tach-thua-so` lên trước; `explain` nêu tách 42 = 7 · 6 rồi đưa 7 ra ngoài bằng lời của bài, có thể thêm "Tính thẳng cũng ra 238" để bé tự kiểm; không chép dòng `7·(18 + 34 – 18)` của sách. Phần trong ngoặc có phép trừ thì theo cách sửa đã chọn ở Nghiêm trọng 4.

### 9. Lời giải 3.42 chỉ đưa bốn kết quả, không có bước tính

- Vị trí: `$.exercises[20].explain` (`bai-3-42`)
- Nguồn: tr.114
- Vấn đề: "a = 4, b = −12, c = 60 và d = −4" là đúng dòng kết quả của sách; bé yếu dấu cần thấy từng phép.
- Sửa: `tex` xếp dọc bốn phép (32 + (−28) = 4; (−7) − 5 = −12; (−12) · (−5) = 60; (−28) : 7 = −4), giữ phần chữ cho bước xếp thứ tự.

### 10. Màn nhắc và bước dẫn của section `tinh-abcd` không khớp nhau

- Vị trí: `$.sections[5].blocks[0]` (cộng khác dấu 7 + (−4)), `ex.hieu-am-6-tru-4`
- Nguồn: tr.62
- Vấn đề: màn nhắc cộng khác dấu không có bước dẫn; bước dẫn (−6) − 4 không có màn nhắc trong section.
- Sửa: thêm bước dẫn cộng khác dấu (số khác sách và hình, ví dụ 25 + (−21)), hoặc thêm màn nhắc "Muốn trừ một số, ta cộng với số đối của số đó." trước bước (−6) − 4; kiểm giới hạn 4 bài tập mỗi section.

### 11. Câu luyện trùng số của mẹo và hình ở section `so-doi`

- Vị trí: `ex.viet-so-b` (9 → −9), `ex.noi-so-doi` (cặp 12 và −12) - LL-07
- Nguồn: —
- Vấn đề: mẹo `tim-so-doi` hiện `9 ↔ −9`, màn nhắc nói "như −2 hay 9"; cặp 12 là một dòng hình `so-doi-vi-du`.
- Sửa: `viet-so-b` dùng số chưa xuất hiện trong bài, ví dụ 31 (đáp án −31; tránh 14 vì đã có ở hình `uoc-vi-du`); `noi-so-doi` đổi cặp 12 thành 11 và −11.

### 12. Lý do `wrong` ở `doi-thua-so-6` cho sẵn đáp án bước sau

- Vị trí: `$.exercises[21].explain.wrong[0]`, `[1]`; bước sau `ex.tinh-6-4-tru-am-5` (đáp án 54)
- Nguồn: —
- Vấn đề: hai lý do kết thúc "không phải 54", đúng đáp án của câu kế tiếp; lý do chỉ so giá trị, không nói lỗi.
- Sửa: lý do nói lỗi, không nêu giá trị, theo cách sửa đã chọn ở Nghiêm trọng 4 (ví dụ nhiễu đổi dấu: "Đổi phép trừ thành cộng thì phải đổi cả (−5) thành số đối của nó."; nhiễu nhân: "Đưa 6 ra ngoài thì hai số còn lại nối bằng dấu cộng hay trừ, không nhân với nhau.").

### 13. Lý do `wrong` "Hai số đối nhau" lập luận ngược chiều

- Vị trí: `$.exercises[29].explain.wrong[1]` (`ex.tich-0-it-nhat-mot`)
- Nguồn: —
- Vấn đề: "3 và −3 nhân nhau được −9" chứng minh đối nhau thì tích khác 0, không bác được "tích bằng 0 thì hai số đối nhau"; còn dễ khiến bé nghĩ hai số đối nhau không bao giờ nhân ra 0 (sai với 0 và 0).
- Sửa: "Như 0 · 5 = 0, nhưng 0 và 5 không phải hai số đối nhau."

### 14. Lời giải 3.45 nói quy tắc tích bằng 0 khác câu quy tắc

- Vị trí: `$.exercises[31].explain.text` (`bai-3-45`) - LL-05
- Nguồn: —
- Vấn đề: "thì có một số bằng 0" khác câu `rule` "ít nhất một số trong hai số đó bằng 0"; "có một số" dễ đọc thành "đúng một số".
- Sửa: "Hai số có tích bằng 0 thì ít nhất một số trong hai số đó bằng 0." rồi áp vào hai thừa số.

### 15. Lời giải `tach-12-bang-4` nói "cả hai phép nhân" khi màn chỉ có một đẳng thức

- Vị trí: `$.exercises[25].explain.text` - LL-10
- Nguồn: —
- Vấn đề: đề chỉ có `12 = 4 · □`; bé chưa thấy "hai phép nhân" nào.
- Sửa: "Chia 12 cho 4 được 3, nên 12 = 4 · 3." (bỏ câu sau, hay nói "Câu sau sẽ dùng cách tách này.").

### 16. Cách viết ngoặc trong lựa chọn khác lời giải và câu kế tiếp

- Vị trí: `$.exercises[21].options`, `$.exercises[26].options` so với `$.exercises[21].explain.tex`, `$.exercises[22].prompt[1]`; `$.exercises[28].explain.tex` (`13 · [6 − 40]`)
- Nguồn: —
- Vấn đề: cùng biểu thức viết `6 · (4 − (−5))` ở lựa chọn và `6 · [4 − (−5)]` ở lời giải, câu sau; ngược lại `13 · [6 − 40]` dùng ngoặc vuông khi trong không có ngoặc.
- Sửa: ngoặc lồng nhau thì ngoặc vuông ở ngoài, như Bài 16 (`6 \cdot [4 - (-5)]`, `4 \cdot [5 \cdot 3 + (-3)]`); không lồng thì ngoặc tròn (`13 \cdot (6 - 40)`). Sau khi sửa Nghiêm trọng 4, áp luật này cho biểu thức mới.

### 17. Mẹo `tim-so-doi` chỉ nói lại câu quy tắc số đối

- Vị trí: `$.sections[4].blocks[3]` (`tip.tim-so-doi`)
- Nguồn: —
- Vấn đề: đúng ở mọi số đã thử nhưng chỉ là câu quy tắc nói theo thao tác, ví dụ `−(−5) = 5` ở màn trước đã chỉ thao tác đó (mẹo gượng, checklist trục 5).
- Sửa: mẹo kiểm `kind: "tránh sai"`: "Cộng một số với số đối của nó phải được 0." với ví dụ số khác 3.41 (Bài 14 đã dạy); hoặc bỏ mẹo.

### 18. Section `tich-bang-0` thiếu mẹo dù dạng bài có mẹo kiểm thật

- Vị trí: `$.sections[8].blocks`
- Nguồn: —
- Vấn đề: 3.45 có nhiễu sai dấu (x = 25, x = −38). Mẹo "thay x vừa tìm vào thừa số đó, phải ra 0" đúng mọi trường hợp và đúng cách các lý do `wrong` đang làm. Không dùng mẹo "đổi dấu số đi kèm x" (sai với 38 − x = 0).
- Sửa: thêm `tip` `kind: "tránh sai"`, ví dụ số khác sách và hình (x − 9 = 0 nên x = 9, thay lại 9 − 9 = 0; x + 6 = 0 nên x = −6, thay lại −6 + 6 = 0).

### 19. Đề 3.44b trên điện thoại xuống dòng giữa ngoặc

- Vị trí: `$.exercises[28].prompt[1].tex` (`bai-3-44b`) - LL-12
- Nguồn: walk `phone/133-s8-07-exercise-bai-3-44b.png`
- Vấn đề: công thức ngắt thành "... − 13 · (23 +" / "17)".
- Sửa: `\begin{gathered} 13 \cdot (23 - 17) \\ -\ 13 \cdot (23 + 17). \end{gathered}`, không đổi chữ, số, dấu của đề.

### 20. Đáp án `boi-4-trong-khoang` nằm sẵn trên hình ví dụ và trong mẹo ngay trước

- Vị trí: `ex.boi-4-trong-khoang`; hình `boi-4-vi-du` ở `$.sections[9].blocks[0]`; `$.sections[9].blocks[3].tex` (`tip.boi-doi-xung`) - LL-07
- Nguồn: —
- Vấn đề: đáp án −8, −4, 0, 4, 8 in sẵn trên hình và mẹo (4, 8, 12, −4, −8, −12, 0); bé chỉ cần bỏ ±12.
- Sửa: đổi bước dẫn sang bội của 7 lớn hơn −16 và nhỏ hơn 16 (đáp án −14, −7, 0, 7, 14), đổi `boi-cua-4` theo số 7; đổi ví dụ mẹo sang số khác 3 đến 7 (xem Nên sửa 22).

### 21. Đáp án `uoc-duong-14` in sẵn trên màn nhắc ngay trước

- Vị trí: `ex.uoc-duong-14`; `$.sections[10].blocks[0]` (chữ "Số −14 có cùng các ước dương với 14" và hình `uoc-vi-du`) - LL-07
- Nguồn: —
- Vấn đề: hình in đủ ±1, ±2, ±7, ±14.
- Sửa: đổi sang ước dương của 22 (1, 2, 11, 22; nhiễu 4 hay 3); không dùng 15 (số của mẹo `uoc-chung-nhanh`).

### 22. Ví dụ của hai mẹo thiếu số đề nên bé không theo được

- Vị trí: `$.sections[9].blocks[3]` (`tip.boi-doi-xung`), `$.sections[10].blocks[3]` (`tip.uoc-chung-nhanh`)
- Nguồn: —
- Vấn đề: `boi-doi-xung` nói khoảng −15 đến 15 mà không nói bội của số nào, rồi `tex` hiện 4, 8, 12; `uoc-chung-nhanh` không nói số thứ hai nên bé không kiểm được vì sao 3 và 15 bị bỏ.
- Sửa: ghi đủ số đề trong `text`, ví dụ "Ví dụ tìm bội của 8 lớn hơn −20 và nhỏ hơn 20: bội dương là 8, 16; thêm −8, −16 và 0." (đổi `tex` theo); "Ví dụ ước chung của 15 và 25: ước dương của 15 là 1, 3, 5, 15; 25 chỉ chia hết cho 1 và 5."

### 23. Recap section và card `bang-tich` không tóm ý của section; recap `bang-tong` chỉ tóm một nửa

- Vị trí: `$.sections[11].recap`, `$.cards[11].recap`, `$.sections[12].recap`, `$.cards[12].recap`
- Nguồn: —
- Vấn đề: cả ba câu của `bang-tich` dùng ý "hai ô cách nhau hai ô thì bằng nhau", nhưng recap là câu chia hết "Nếu a = b · q ..." với hình 12 : 3 = 4; recap `bang-tong` thiếu ý ô 1 bằng ô 4.
- Sửa: tách câu "Vậy hai ô cách nhau hai ô thì bằng nhau." thành `note` riêng có `rule: true` (cùng một câu cho cả hai section), recap lặp nguyên văn kèm ví dụ số của Nghiêm trọng 6; câu quy tắc Bài 17 để ở màn nhắc, bỏ cờ `rule` của nó.

### 24. Dòng ô điền 3.48, 3.49 xuống dòng; ô đã cho là chữ nhỏ không khung

- Vị trí: `$.exercises[40].segments`, `$.exercises[43].segments` - LL-12
- Nguồn: walk `phone/181-s12-06-exercise-bai-3-48.png`, `phone/192-s13-06-exercise-bai-3-49.png`, `ipad/181-...`, `ipad/192-...`
- Vấn đề: 11 ô gãy thành 4 / 3 / 4 (phone), 8 / 3 (iPad); ô đã cho ("6", "−4", "−7", "3") là chữ trơn dính viền ô trống, khó biết ô nào thứ mấy, trong khi lời giải dựa vào vị trí ô. Không chồng hay cắt chữ.
- Sửa: đặt " | " ở đoạn chữ giữa các ô cho giống dòng đề; lời dặn "Các ô xếp theo thứ tự như dòng trên, từ trái sang phải, hết dòng thì sang dòng dưới." Phần app (ô đã cho có khung, hay số thứ tự ô trong `fillBlank`) ghi backlog, không sửa ở bài này.

## Góp ý

### 1. Lời giải câu hỏi 6 chưa nói kết luận

- Vị trí: `$.exercises[13].explain.text` (`ex.tn6`)
- Nguồn: tr.61 câu 6
- Vấn đề: dừng ở bước kiểm tra, không loại trường hợp a âm, b dương và không nói "Vậy ..." như câu 5.
- Sửa: thêm "Còn nếu a âm và b dương thì a − b âm. Vậy a dương và b âm." (gộp câu để ≤ 3 câu).

### 2. Nhiễu "Một số âm, một số dương" tự trái với đề

- Vị trí: `$.exercises[7].options[2]` (`ex.cung-dau-tong-am`) - LL-14
- Nguồn: —
- Vấn đề: đề đã cho "hai số cùng dấu" nên lựa chọn bị loại ngay.
- Sửa: nhiễu ứng với lỗi thật, ví dụ "Không biết được, vì chưa biết hai số".

### 3. Mẹo `tich-duong-tong` suy luận ngược chiều

- Vị trí: `$.sections[2].blocks[2].text`
- Nguồn: —
- Vấn đề: "Nhân hai số dương, hay nhân hai số âm, đều được số dương. Vậy tích dương thì hai số cùng dấu." đi ngược chiều câu trước.
- Sửa: "Hai số khác dấu thì tích âm, nên tích dương thì hai số cùng dấu."

### 4. Lý do `wrong` của "Có thể bằng 0" chưa nói tới lựa chọn

- Vị trí: `$.exercises[10].explain.wrong[1]` (`ex.duong-tru-am`)
- Nguồn: —
- Vấn đề: "Hai số dương cộng lại luôn lớn hơn 0." chỉ hiểu khi đọc liền lời giải.
- Sửa: "a dương, số đối của b cũng dương, cộng lại luôn lớn hơn 0 nên không thể bằng 0."

### 5. Tiêu đề section 4 nhắc Bài 16 nhưng phần nhắc không có khối nào của Bài 16

- Vị trí: `$.sections[3].title`
- Nguồn: —
- Vấn đề: "Nhắc lại Bài 14 và Bài 16: dấu khi nhân và khi trừ" nhưng các màn chỉ có phép trừ.
- Sửa: thêm khối quy tắc dấu của tích làm màn đầu, hoặc đổi tiêu đề.

### 6. Màn nhắc đầu section `so-doi` nói "−2 hay 9" nhưng hình hiện −7, 12, −20

- Vị trí: `$.sections[4].blocks[0]` (hình `dau-va-so-vi-du`) - LL-15
- Nguồn: —
- Vấn đề: số trong chữ không có trên hình (khối chép nguyên từ Bài 14).
- Sửa: dùng hình `dau-va-so` (−2, 9), hoặc giữ như Bài 14.

### 7. 3.42 trên điện thoại ngắt dòng ngay sau "c ="

- Vị trí: `$.exercises[20].prompt[1].text`
- Nguồn: walk `phone/102-s6-08-exercise-bai-3-42.png`
- Vấn đề: giá trị (−12) · (−5) sang dòng sau.
- Sửa: khoảng trắng không ngắt sau "c =" và "d =", như đã làm quanh "·", ":".

### 8. Thẻ xếp thứ tự 3.42 chỉ có chữ a, b, c, d

- Vị trí: `$.exercises[20].items`
- Nguồn: —
- Vấn đề: bé phải nhớ bốn kết quả khi kéo thẻ.
- Sửa: tuỳ tác giả, ghi kèm biểu thức trên thẻ; đề sách giữ nguyên.

### 9. Câu "giống phần số tự nhiên" thiếu vế so sánh

- Vị trí: `$.exercises[16].explain.text` (`bai-3-41`)
- Nguồn: —
- Vấn đề: không nói giống với số nào.
- Sửa: "Số đối của −27 có cùng phần số tự nhiên 27 nhưng khác dấu."

### 10. Câu lệnh của app ở 3.41 khác dấu phẩy với 3.48, 3.49

- Vị trí: `$.exercises[16].prompt[1].text` ("Chạm một số rồi chạm ô trống cần điền.") so với `$.exercises[40]`, `$.exercises[43]` ("Chạm một số, rồi chạm ô trống cần điền.")
- Nguồn: —
- Vấn đề: một câu lệnh hai cách viết.
- Sửa: thống nhất một cách cho cả ba câu.

### 11. Một khoảng nói theo hai cách

- Vị trí: `$.sections[9].blocks[3].text`, `$.exercises[34].explain.wrong[1].text`
- Nguồn: `sbt-p62.png` ("lớn hơn −19 và nhỏ hơn 19")
- Vấn đề: mẹo nói "từ ... đến ..., không tính hai đầu", lý do sai nói "từ −19 đến 19", còn đề, hình nói "lớn hơn ... và nhỏ hơn ...".
- Sửa: dùng "lớn hơn ... và nhỏ hơn ..." ở mẹo và `wrong`.

### 12. Mẹo ước chung nói "số nhỏ hơn" trong khi bài có số âm

- Vị trí: `$.sections[10].blocks[3].text`
- Nguồn: —
- Vấn đề: với 8 và −12 (màn Cùng làm), "số nhỏ hơn" là −12; kết quả vẫn đúng, chỉ mất ý làm nhanh.
- Sửa: "Viết các ước dương của số có phần số tự nhiên nhỏ hơn".

### 13. `whyItMatters` và `hook`: "ví ... đang nợ"

- Vị trí: `$.overview.whyItMatters`, `$.overview.hook.text`
- Nguồn: —
- Vấn đề: ví không chứa số tiền âm; câu hook không cần số âm.
- Sửa: "biết mình còn tiền hay đang nợ bạn bao nhiêu sau khi mượn và trả"; hook ví dụ "Bạn có 3 nghìn mà mua món 5 nghìn thì còn nợ 2 nghìn, tức là 3 − 5 = −2."

### 14. Lời giải `o-thu-tu-bang-tong` không nói hai tổng nào

- Vị trí: `$.exercises[42].explain.text`
- Nguồn: —
- Vấn đề: khác câu cùng kiểu `o-thu-tu-bang-tich` vốn nói rõ hai tích cùng có ô 2 và ô 3.
- Sửa: "Ô 1 + ô 2 + ô 3 = 0 và ô 2 + ô 3 + ô 4 = 0. Hai tổng cùng có ô 2 và ô 3, nên ô 1 bằng ô 4. Vậy ô thứ tư là −6."

### 15. Tên section "Nhắc lại Bài 17/Bài 14: bảng ba ô ..."

- Vị trí: `$.sections[11].title`, `$.sections[12].title`
- Nguồn: —
- Vấn đề: bảng ba ô không có trong Bài 17 hay Bài 14, chỉ quy tắc nhắc lại là của hai bài đó.
- Sửa: ví dụ "Bảng ba ô liền nhau có tích 120 (nhắc lại Bài 17)".

## Đã soát và đạt

- Đề 17 câu sách (câu hỏi 1 đến 6, 3.41 đến 3.49) khớp `sbt-p61.png`, `sbt-p62.png` từng chữ, số, ký hiệu, dấu (trừ dấu "." của 3.45, Nghiêm trọng 2); các chỗ khác sách đều nằm trong mục "Giả định" của handover (bỏ nhãn lựa chọn, tách ý a), b), khối lệnh của app ở cuối đề, khoảng trắng không ngắt ở 3.42).
- Đáp án khớp `sbt-p114.png` và đã tự tính lại: 1 D, 2 C, 3 A, 4 D, 5 C, 6 B; 3.41 −27 và 27; 3.42 b < d < a < c; 3.43a 840, 3.43b 238; 3.44a 3 904, 3.44b −442; 3.45 x = 38, x = −25; 3.46, 3.47 như sách; bảng 3.48, 3.49 khớp bảng sách, mỗi bảng một cách điền.
- Mỗi câu có đúng một đáp án hay một tập đáp án; mọi nhiễu tự giải đều sai đúng như `wrong` nói; mọi số học trong `explain` đúng; không lời giải nào gọi lựa chọn theo vị trí (LL-26); không phủ định kép; câu chọn nhiều có "Chọn tất cả".
- Gợi ý nấc 1 tô khối đề hay khối công thức, không lộ đáp án.
- Hình dùng lại từ Bài 13, 14, 16, 17: số trên hình khớp chữ cạnh hình (trừ Góp ý 6). Mỗi câu `rule: true` được recap section và card lặp nguyên văn; các khối nhắc chép đúng câu đã duyệt của bài gốc. Màu khái niệm khớp glossary.
- `overview`, `sourceRef` của bài, section, card đúng phạm vi và đúng trang (tr.60 đến 62, lời giải tr.114).
- Tổng hợp soát chéo: các câu quy tắc của 13 section không mâu thuẫn nhau về nội dung; cách gọi ô (a, b, c, d / ô 1 / ô thứ nhất) và cách nói quy tắc trong lời giải đã ghi ở Nghiêm trọng 6, Nên sửa 6, 14.
- Sheet walk phone và iPad của cả 13 section: ngoài Nghiêm trọng 3, 7, Nên sửa 19, 24 và Góp ý 7, không thấy chữ chồng, bị cắt hay tràn.

## Bảng thử mẹo

| Mẹo | Các số đã thử | Kết quả |
|---|---|---|
| `so-sanh-nhieu-so` | {0; 3; −12}; {−9; −4; 0; 5}; {−1; −10; −5}; {−4; −4; 2}; {0; 7; 1}; −3; 5; 0; −8 xếp từ lớn đến bé | Đúng ở 5 bộ xếp từ bé đến lớn; sai khi xếp từ lớn đến bé (Nghiêm trọng 1) |
| `tich-duong-tong` | (2, 5); (−2, −5); (−1, −1); (1, 1); (−20, −1); (0, 5); (3, −3) | Đúng mọi bộ; có số 0 hay khác dấu thì tích không dương nên mẹo không áp dụng |
| `hieu-va-thu-tu` | (5, 3); (3, 5); (−2, −7); (0, 4); (0, −1); (4, −4); (−3, 2) | Đúng mọi bộ (lời mẹo đòi hai số khác nhau) |
| `tim-so-doi` | 9; 1; 100; −15; −1; 0; −27 | Đúng mọi số; là câu quy tắc nói lại (Nên sửa 17) |
| `thua-so-chung-bi-giau` | 4·7 − 2·2·(−5) = 48; 6·4 − 2·3·(−5) = 54; 21·23 − 3·7·(−17) = 840; 10·3 + 2·5·(−4) = −10; 1·7 + 1·1·5 = 12; biên 12·5 + 3·2·2, 6·4 − 2·(−5)·3 | Phép biến đổi luôn đúng; ca biên mẹo không tìm ra nhưng không cho kết quả sai. Ví dụ là hiệu hai tích, chưa dạy (Nghiêm trọng 4) |
| `tach-thua-so` | 48·5 + 6·(−7) = 198; 5·12 + 4·(−3) = 48; 71·64 + 32·(−7) − 13·32 = 3 904; 42·3 − 7·[(−34) + 18] = 238; (−12)·5 + 4·3 = −48; 0·5 + 6·(−7) = −42; biên 7·5 + 3·(−2) | Đúng mọi đầu vào; ca không tách được mẹo chỉ bảo "thử" (đặt sau 3.43b: Nên sửa 8) |
| `boi-doi-xung` | k = 1 đến 12, −3, −5 với mọi khoảng đối xứng m = 0 đến 39, tính và không tính hai đầu; 6 trong (−19; 19); 4 trong (−9; 9); 5 trong [−15; 15]; 7 trong (−5; 5); khoảng (−1; 1) | Đúng mọi trường hợp (thiếu số đề ở ví dụ: Nên sửa 22) |
| `uoc-chung-nhanh` | mọi cặp khác 0 từ −40 đến 40; (36, 42); (12, 20); (8, −12); (6, −9); (6, 6); (1, 7); (5, −15) | Kết quả đúng mọi cặp; với số âm "số nhỏ hơn" chọn số có phần số tự nhiên lớn hơn, chỉ mất ý làm nhanh (Góp ý 12) |
| `bang-o-lien-nhau` | mọi dãy 5 số khác 0 từ −4 đến 4 có ba tích liền nhau bằng nhau; (−4, −5, 6); (−3, 4, −5); (1, 2, −4); (−1, −1, −1); tích 0 với (0, 1, 2, 0, 5) | Đúng khi tích khác 0 (lời mẹo đã có điều kiện); "tìm ba ô đầu" không dùng thẳng được cho 3.48 (Nên sửa 4) |
| `o-con-thieu-tong-0` | mọi dãy 5 số từ −5 đến 5 có ba tổng liền nhau bằng 0; (4, −9); (−7, 3); (0, 0); (6, −6); (−3, −5); (10, 2) | Đúng mọi trường hợp, kể cả tổng hai ô bằng 0 |

## Đã sửa sau vòng 1

Tác giả sửa `lesson.json` theo vòng 1; chưa review lại, chưa chạy lượt đọc hiểu (danh sách mục chữ đổi: `.shots/review/on-tap-chuong-3/doc-hieu-r1-items.txt`). Hai phép trừ tích dùng cách đã dạy: "Muốn trừ một số, ta cộng với số đối của số đó" rồi mới đưa thừa số chung ra ngoài. Các lựa chọn của câu có `check` viết ngoặc tròn không lồng vì bộ tính `check.expr` không đọc ngoặc vuông.

### Nghiêm trọng

1. Mẹo `so-sanh-nhieu-so`: nêu rõ "xếp từ bé đến lớn", thêm câu xếp từ lớn đến bé là viết ngược lại; tiêu đề "Xếp nhiều số nguyên từ bé đến lớn".
2. 3.45: thêm lại dấu "." cuối công thức `(38 - x) \cdot (x + 25) = 0.`
3. Lời giải 3.43a, 3.44a, 3.44b viết lại mỗi dòng một phép, dài nhất khoảng 20 ký tự; 3.44b có đủ `= -442`. Điều phối chạy lại `pnpm lesson:walk on-tap-chuong-3` sau khi sửa: 0 FAIL, 0 cảnh báo; ảnh phone `120-s7-07-...-bai-3-43a-correct.png`, `134-s8-06-...-bai-3-44b-correct.png` hiện đủ 840 và −442, không bị cắt.
4. Cách (a): bỏ ngoặc `[a − (−b)]`; đổi phép trừ tích thành cộng số đối trước rồi đưa thừa số ra. Sửa `doi-thua-so-6` (đáp án `6 · (4 + 5)`, nhiễu viết lại), mẹo `thua-so-chung-bi-giau`, lời giải 3.43a, 3.43b, 3.44a, 3.44b; câu `tinh-6-4-tru-am-5` đổi thành `tru-hai-tich` (10 · 3 − 10 · (−4)) để luyện chính bước đổi trừ thành cộng.
5. Lời giải 3.43a đi theo chuỗi khác sách: `21·23 + 21·17`, `21·(23 + 17)`, `21·40`; ý nối "trừ 21 · (−17) là cộng 21 · 17" nằm ở chữ.
6. Bỏ màn lập luận chép sách: `bang-tich`, `bang-tong` dùng ví dụ số riêng (−1, 5, −2 và 2, 3, −5), gọi ô là "ô 1, ô 2, ...", không dùng chữ a, b, c, d. Lời giải 3.48, 3.49 đi từ ô đã cho, lùi hay tiến 3 ô, rồi tính ô còn lại.
7. Lời giải `uc-duong-12-20`: TeX chỉ còn hai dãy số, bỏ ":"; ý "dòng trên là ước của 12, dòng dưới là ước chung" nằm ở chữ.

### Nên sửa

1. Ví dụ mẹo so sánh đổi sang −11 < −6 < 0 < 8.
2. `cung-dau-tong-am` dùng tổng −11 và lời giải (−5) + (−6).
3. Thêm khối "−3 ∈ B, 2 ∉ B" và câu "∉ đọc là không thuộc"; `thuoc-c` có đáp án "−4 ∉ C", nhiễu dùng ∈ hay ∉.
4. Thêm câu `o-xa-bang-tich` (ô 7 → ô 1) và `o-xa-bang-tong` (ô 8 → ô 2); lời giải 3.48, 3.49 theo Nghiêm trọng 6; mẹo `bang-o-lien-nhau` nói cách làm (tiến hay lùi 3 ô), bảng 7 ô, mỗi dòng TeX một phép.
5. Quy tắc của section `dau-tich-hieu` là "Muốn trừ một số, ta cộng với số đối của số đó" (cờ `rule`, recap section và card dùng hình `tru-vi-du`).
6. Lời giải của bốn câu trích nguyên câu quy tắc (dấu của tích, trừ là cộng số đối); thêm cho `bai-3-41`, `noi-so-doi` (số đối) và `tich-0-it-nhat-mot`, `bai-3-45` (tích bằng 0).
7. Section `thua-so-chung-3-44` đổi sang quy tắc "đưa thừa số chung ra ngoài" (cùng câu và hình `gop-thua-so-vi-du` với section trước), ví dụ mẫu 18 · 5 + 9 · (−4) có bước tách số; recap, card, tiêu đề theo.
8. Mẹo `tach-thua-so` chuyển lên section `thua-so-chung-3-43` (trước 3.43b); lời giải 3.43b tách 42 = 7 · 6, đổi trừ thành cộng, nói "tính thẳng cũng ra 238".
9. Lời giải 3.42 xếp dọc bốn phép tính và dòng `b < d < a < c`.
10. Chọn cách "nhắc trong bước dẫn": đề `hieu-am-6-tru-4` mở bằng câu quy tắc trừ (section đã đủ 4 màn, thêm màn thứ 5 bị `[screens]` chặn).
11. `viet-so-b` dùng 31 (đáp án −31); `noi-so-doi` dùng cặp 8 và 11 (bỏ 7 và 12 vì đã có trên hình).
12. Lý do `wrong` của `doi-thua-so-6` nói lỗi, không nêu giá trị 54.
13. Lý do `wrong` "Hai số đối nhau" của `tich-0-it-nhat-mot` dùng 0 và 7.
14. Lời giải 3.45 mở bằng nguyên câu quy tắc tích bằng 0.
15. Lời giải `tach-12-bang-4`: "Chia 12 cho 4 được 3, nên 12 = 4 · 3. Câu sau sẽ dùng cách tách này."
16. Lựa chọn của `doi-thua-so-6`, `doi-thua-so-4` viết ngoặc tròn không lồng (không dùng ngoặc vuông được vì bộ tính `check.expr` chỉ đọc ngoặc tròn); lời giải có ngoặc lồng dùng ngoặc vuông ngoài, không lồng dùng ngoặc tròn (`13 · (-34)`, `32 · [142 + (-20)]`).
17. Mẹo `tim-so-doi` đổi thành mẹo "tránh sai" kiểm lại: hai số đối nhau cộng lại thì được 0 (ví dụ −15 + 15, 40 + (−40)).
18. Thêm mẹo `kiem-lai-x` (`tránh sai`) cho section `tich-bang-0`: ví dụ x − 9 = 0 và x + 6 = 0.
19. 3.44b: đề xếp dọc `13 · (23 − 17)` rồi `− 13 · (23 + 17)` bằng `gathered`; chữ, số, dấu giữ nguyên.
20. Bước dẫn đổi sang bội của 7 (`boi-cua-7`, `boi-7-trong-khoang`, khoảng −16 đến 16); mẹo `boi-doi-xung` dùng bội của 9.
21. `uoc-duong-22` thay `uoc-duong-14` (nhiễu 4).
22. Mẹo `boi-doi-xung` và `uoc-chung-nhanh` ghi đủ số đề (bội của 9 trong khoảng −30 đến 30; ước chung của 15 và 25).
23. `bang-tich`, `bang-tong` thêm câu quy tắc "Nếu ba ô liền nhau luôn có cùng tích khác 0 (cùng tổng), thì hai ô cách nhau hai ô bằng nhau" thành `note` có `rule`, recap và card lặp nguyên văn kèm câu cũ của Bài 17, 14. Chưa đủ: recap vẫn dùng hình `chia-het-vi-du` và `tong-doi-vi-du`, chưa có hình bảng ô vì lượt này không tạo hình mới (cần `lesson-visual`).
24. Dòng 11 ô điền ngăn cách bằng " | " như dòng đề; câu lệnh "Các ô xếp theo thứ tự như dòng trên, từ trái sang phải, hết dòng thì sang dòng dưới." Chưa làm phần app: ô đã cho vẫn là chữ trơn không khung, dòng 11 ô vẫn tự gãy dòng; cần ghi backlog sửa `src/` (ô đã cho có khung hoặc số thứ tự ô trong `fillBlank`).

### Góp ý đã làm

1. `tn6`: thêm kết luận "vậy a dương và b âm".
2. `cung-dau-tong-am`: nhiễu thành "Chưa thể biết được".
3. Mẹo `tich-duong-tong`: "Hai số khác dấu thì tích âm, nên tích dương thì hai số cùng dấu."
4. Lý do `wrong` "Có thể bằng 0" nói rõ vì sao.
5. Tiêu đề section 4 đổi thành "Nhắc lại Bài 14: trừ là cộng với số đối".
6. Màn đầu `so-doi` dùng hình `dau-va-so` (−2, 9) khớp chữ.
9. `bai-3-41`: câu số đối nói rõ "cùng phần số tự nhiên".
10. Ba câu lệnh "Chạm một số, rồi chạm ô trống cần điền." thống nhất có dấu phẩy.
11. Mẹo và `wrong` dùng "lớn hơn ... và nhỏ hơn ...".
12. Mẹo ước chung nói "số có phần số tự nhiên nhỏ hơn".
13. `hook` và `whyItMatters` dùng tình huống mượn, nợ tiền.
14. `o-thu-tu-bang-tong` nói rõ hai tổng và ô 2, ô 3.
7. 3.42: khoảng trắng không ngắt sau "c =" và "d =".
15. Tiêu đề section 11, 12 bỏ số 120 và nhắc đúng bài.

Chưa làm: Góp ý 8 (thẻ xếp thứ tự ghi kèm biểu thức), vì thẻ dài làm hẹp vùng kéo trên điện thoại và mục này không bắt buộc.
