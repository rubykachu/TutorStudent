# Review: Quy tắc dấu ngoặc (`quy-tac-dau-ngoac`)

- Bài: `content/math/kntt/quy-tac-dau-ngoac/lesson.json`
- Vòng: 3 - chỉ phần đổi (một reviewer Sonnet)
- Nguồn đã đọc: `sources/math/quy-tac-dau-ngoac/` - sbt-p53, sbt-p54, sbt-p112
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá trong `ids.lock.json`, chờ `content:lock`)
- Đọc hiểu (Haiku, lượt 1): 243 mục: 243 Hiểu rõ / 0 Hiểu mơ hồ / 0 Khó hiểu (`.shots/review/quy-tac-dau-ngoac/doc-hieu.md`); chữ đã đổi sau lượt này sẽ chạy lượt Haiku chỉ trên mục đổi nếu có
- `lesson:walk`: 0 FAIL, 0 cảnh báo ở lần chạy cuối (sau khi rút nhãn hình phần 11), ảnh trong `.shots/walk/quy-tac-dau-ngoac/`
- Kết luận: Hết lỗi Nghiêm trọng (0); còn 4 Nên sửa và 11 Góp ý. Bản đã review `ff054043d9a567c13941ea97a16c27345077a0f572d1b2ace50c412dfd24dce8` (hash lệnh `content:hash --mark` in); `--approve` và `content:lock` do điều phối chạy sau
- Bản đã review: `6b34bfd9dd2372691b33cd6a674bcae421740072d7f0eb2c9d77641ae3a04665` (`pnpm content:diff` so với bản này)

Phạm vi: mọi mục của `pnpm content:diff` (so với bản đã review ở vòng 2) cùng các mục khác trong 12 section, và phần đổi của `catalog.ts` (`git diff 28150fa HEAD`). Đã tính lại từ đề (bằng tay rồi bằng máy) mọi exercise đổi, cả 26 câu `numeric` và 24 câu `choice` có `check`: `answer`, `check.expr`, từng lựa chọn và từng lý do `wrong` đều khớp; `params` của 7 câu `manipulate`, `pairs` của câu `match` và thứ tự của câu `order` đúng. Tính lại từng dòng của mọi hình đổi số (`WHOLE_ROWS` = −3, `REASONABLE_ROWS` = 10, `PAIR_ROWS` = 5, `goi-y-hop-li` = −10, `goi-y-tong-hop` = 3, `goi-y-ngoac-mot-so` = 7, `chon-ghep-30` còn 10 nghìn) đều đúng. Không câu kiểm tra hay câu luyện nào trùng hình mẫu, hình gợi ý hay recap; hình gợi ý dùng số khác đề. Không `explain` hay `wrong` nào gọi lựa chọn theo vị trí (LL-26). Câu quy tắc `rule: true`, recap section và recap card của 12 section lặp nguyên văn nhau. Đáp số các câu `numeric` không có −6 hay 0; câu kiểm tra `tong-tu-am4-den-4` đáp 0 nhưng là đề khác lời giải 3.22b (tổng các số từ −4 đến 4). Contact sheet phone, iPad, iPad nằm ngang của mọi phần đổi: không chữ chồng, cắt hay xuống dòng giữa dấu và số; ba phần mới và viết lại (10, 11, 12) đọc được trọn.

## Đối chiếu review vòng 2

| Mức vòng 2 | Đã sửa đúng | Còn |
|---|---|---|
| Nghiêm trọng 1, 2, 3 | cả ba: `dien-dau-cong` in " 7."; chuyện nợ phần 5 không còn trả nợ rồi mới xoá nợ; hai lý do `wrong` của `chon-tong-bang-0` nói về số còn lại sau khi ghép cặp | không |
| Nên sửa 1–3, 6–24 | 21 mục (gồm cả hai câu kho ôn đổi card, hai hình `ghep-so-doi` và `vi-du-tong-hop` đổi số, các câu đổi số đủ ≤ 2 phép tính nhẩm trừ chỗ 4 số hạng bắt buộc) | Nên sửa 12 phần `hop-li-120-150` (xuống Góp ý 2 dưới đây) |
| Nên sửa 4, 5 | đã sửa câu quy tắc, mẹo, recap, `explain` và các câu ôn | còn một chỗ mỗi mục: Nên sửa 1, 2 dưới đây |
| Góp ý 1–4, 6, 10–12, 14–16, 19–21 | 14 mục | không |
| Góp ý 5, 7, 8, 9, 13, 17, 18 | không (chưa sửa) | chép lại ở Góp ý 1–6 dưới đây |

## Bảng thử mẹo

| Mẹo | Số đã thử | Kết quả |
|---|---|---|
| `tip.dau-dau-tien` (trước ngoặc có dấu −, số hạng đầu không ghi dấu thì coi như có dấu +, viết dấu + đó ra rồi đổi dấu từng số hạng) | 16 − (5 + 2) = 9 (ví dụ); 10 − (3 − 5) = 12; 10 − (3) = 7 (một số hạng); 10 − (0 − 4) = 14 (số 0 đứng đầu); 50 − (28 + 12) = 10; 100 − (30 − 10) = 80; 1 − (9) = −8 (kết quả âm); 0 − (7 − 7) = 0 (số 0 ngoài ngoặc, kết quả 0); −(3 + 4) + 10 = 3 (ngoặc ở đầu tổng có dấu −); 9 − (−4 + 6) = 7 (số hạng đầu có ghi dấu, mẹo không áp dụng) | Đúng mọi số. Câu "coi như có dấu +" đúng cả với 0; mẹo nói điều kiện "trước ngoặc có dấu −" nên không bị dùng cho ngoặc có dấu + |
| `tip.gom-duong-am` (bỏ hết ngoặc, cộng riêng số hạng dương, cộng riêng phần số tự nhiên của số hạng âm, lấy số lớn trừ số bé, mang dấu nhóm cho số lớn hơn, bằng nhau thì 0) | 7 − 9 + 5 − 3 = 0 (ví dụ, hai nhóm bằng nhau); 6 − 9 + 4 − 5 = −4; −8 + 4 + 5 = 1; 64 − 37 + 36 − 20 = 43 (số lớn); 0 − 5 + 0 = −5 (số 0); 1 − 100 + 99 = 0 và 100 − 1 − 99 = 0 (số biên bằng nhau); sau khi bỏ ngoặc: (−7) + (9 − 2) − (5 − 7) = 2, 30 + (20 − 6) − (4 + 20) = 20; nhóm trống: −3 − 4 = −7, 5 + 2 = 7 | Đúng mọi số. Hai nhóm dương và âm đủ số hạng thì mẹo đúng ngay; với nhóm không có số nào mẹo vẫn đúng nếu bé tự coi nhóm đó bằng 0 (Góp ý 5). Chữ "nhóm cho số lớn hơn" đã hết đọc nhầm của vòng 2 |
| `tip.kiem-tra-hai-cach` (tính trong ngoặc trước rồi so với kết quả khi bỏ ngoặc) | 10 − (4 − 9 + 2) = 13 hai cách; 7 − (3 − 5 + 2) = 7; 0 − (0 − 5) = 5; 9 − (−4) = 13; 120 − (150 + 20 − 80) = 30; (9 − 12) − (5 − 8 + 1) = −1; 10 + (3 − 5) = 8 (ngoặc có dấu +); 1 − (1 − 1) = 1 | Đúng mọi số. Mẹo chỉ nói "hai kết quả phải bằng nhau, nếu khác thì xem lại", không nói bằng nhau là đúng, nên không sai ở ngoặc có tổng 0 |

Cả ba mẹo đúng `kind` (tránh sai, làm nhanh, tránh sai), có ví dụ tính, `title` nêu dạng bài và đặt sau khi đã dạy cách làm thường.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Còn từ vòng 2 (Nên sửa 4): `explain` của `chon-duong-7-10` vẫn nói số hạng đầu không ghi dấu là số hạng dương, cách nói thứ tư của cùng một ý

- Vị trí: `$.exercises[32].explain.text` (`ex.chon-duong-7-10`, card `doi-cho`) - LL-05, LL-17
- Nguồn: tr.53, ý 1 (`sbt-p53.png`)
- Vấn đề: "Số hạng dương có dấu + đứng trước, hoặc là số hạng đầu không ghi dấu." Vòng 2 đã chốt nói theo dấu ("không ghi dấu thì coi như có dấu +") ở câu quy tắc phần 1, recap, card và mẹo; chỗ này còn nói "là số hạng dương" cho số đứng đầu không ghi dấu, đúng điều vòng 2 muốn bỏ (sai với số 0 đứng đầu).
- Sửa: "Số hạng dương có dấu + đứng trước, hoặc là số hạng đầu không ghi dấu nên coi như có dấu +. Trong tổng này đó là +7, +3 và +6."

### 2. Còn từ vòng 2 (Nên sửa 5), thêm một nhãn cùng kiểu: hai chữ ở phần 8 vẫn gọi nhóm ở đầu tổng là "ngoặc có dấu +" hoặc không thành câu

- Vị trí: `catalog.ts` khoá `chon-nhom-7-4`, chữ `done` "Ngoặc có dấu +, nên các số hạng giữ dấu cũ." (hiện khi bé chọn đúng (7 − 4) + (9 − 5)); khoá `nhom-cong-vi-du` dòng 1, nhãn "hai nhóm, dấu giữ dấu cũ" (màn quy tắc và recap phần 8, ảnh `phone/094-s8-02-block.png`, `101-s8-06-recap.png`) - LL-05, LL-19
- Nguồn: tr.53, ý 3
- Vấn đề: nhóm (7 − 4) đứng ở đầu tổng, không có dấu đứng trước; vòng 2 đã đổi note "Cùng làm" liền trên và hai `explain` nhưng bỏ sót chữ `done` đã ghi trong "Sửa". Nhãn "dấu giữ dấu cũ" không thành câu (cùng lỗi với nhãn `aria-label` đã sửa ở Góp ý 1 vòng 2) mà hiện trên recap của card.
- Sửa: `done` "Nhóm ở đầu tổng và nhóm có dấu + đứng trước đều giữ dấu cũ."; nhãn "hai nhóm, mỗi số hạng giữ dấu cũ".

### 3. Sau khi đổi tên màu thành "Số hạng dương/âm", một màn "Cùng làm" vẫn gọi chúng "số âm" và "số đầu tiên"

- Vị trí: `$.sections[3].blocks[2].children[0].text` ("Bạn sẽ thấy số âm −3 đổi thành +3, và số đầu tiên cũng phải đổi dấu", ảnh `phone/051-s4-03-block.png`); `catalog.ts` khoá `thu-chi-cho`, nhãn đọc màn hình "thu vào là số dương, chi ra là số âm" (cùng hình có chú giải "Số hạng âm", "Số hạng dương") - LL-05, LL-20
- Nguồn: —
- Vấn đề: Góp ý 20 vòng 2 chốt một tên "số hạng dương/âm" cho cả bài; cùng câu note mở bằng "chạm vào từng số hạng trong ngoặc" rồi gọi cùng thứ là "số âm", "số đầu tiên" (vòng 2 Nên sửa 21 đã coi kiểu này là Nên sửa). Nhãn `thu-chi-cho` không hiện trên màn nhưng đối nghịch với chú giải ngay dưới.
- Sửa: "Bạn sẽ thấy số hạng âm −3 đổi thành +3, và số hạng đầu tiên cũng phải đổi dấu."; nhãn "thu vào là số hạng dương, chi ra là số hạng âm".

### 4. Hai câu điền quy tắc: nhiễu loại được nhờ ngữ pháp hay mâu thuẫn với đuôi câu, không cần hiểu quy tắc

- Vị trí: `$.exercises[37]` (`ex.dien-nhom-cong`: câu "…mỗi số hạng đưa vào ngoặc vẫn ☐.", ngân hàng "giữ dấu cũ", "đổi dấu", "chỉ đổi dấu số đầu"); `$.exercises[13].bank[2]` (`ex.dien-quy-tac-tru`: điền "chỉ đổi dấu số hạng đầu" vào "…bỏ ngoặc đi và ☐ trong ngoặc, không sót số hạng nào") - LL-14, LL-05
- Nguồn: —
- Vấn đề: "vẫn đổi dấu" và "vẫn chỉ đổi dấu số đầu" đọc không thành câu (chữ "vẫn" đứng trước), nên bé chọn "giữ dấu cũ" chỉ nhờ ghép chữ; "chỉ đổi dấu số hạng đầu … không sót số hạng nào" tự mâu thuẫn. Cùng kiểu với Nên sửa 7 vòng 2, bản sửa mới xử lý nhiễu thứ hai của `dien-quy-tac-tru` chứ chưa xử lý nhiễu thứ ba và câu `dien-nhom-cong`. "số đầu" còn là tên thứ hai của "số hạng đầu".
- Sửa: để ô trống bao cả cụm động từ lẫn chữ đi cùng: `dien-nhom-cong` ô trống "vẫn giữ dấu cũ", ngân hàng "vẫn giữ dấu cũ", "đổi dấu từng số hạng", "chỉ giữ dấu số hạng đầu"; `dien-quy-tac-tru` ô trống bao cả đuôi "đổi dấu từng số hạng trong ngoặc, không sót số hạng nào" với nhiễu "giữ dấu cũ của từng số hạng trong ngoặc", "chỉ đổi dấu số hạng đầu trong ngoặc". Câu ghép lại vẫn phải đúng nguyên văn câu quy tắc (`[rule-sentence]`).

## Góp ý

### 1. Còn từ vòng 2 (Góp ý 5): chip chọn số hạng âm và số hạng dương đã tách sẵn dấu

- Vị trí: `catalog.ts` khoá `chon-am-5-7` (`+5`, `−7`, `+2`, `−1`, `$.exercises[4]`) và `chon-duong-7-10` (`$.exercises[32]`)
- Vấn đề: việc cần học (dấu − đứng trước thuộc về số hạng sau nó) đã được chip làm thay; hai câu kho ôn không phân biệt bé hiểu hay không.
- Sửa: ở hai câu kho ôn, chip chỉ ghi phần số (5, 7, 2, 1) và đề giữ tổng có dấu; màn "Cùng làm" giữ chip có dấu làm mẫu.

### 2. Còn từ vòng 2 (Góp ý 7 và phần `hop-li-120-150` của Nên sửa 12): các câu mà dạng bài buộc 4 số hạng vẫn cần 3 phép tính

- Vị trí: `$.exercises[26]` (`tinh-hai-ngoac`), `[36]` (`nhom-9-4-7-10`), `[38]` (`nhom-thu-chi-40`), `[46]` (`nhom-cap-13-25`), `[49]` (`hop-li-120-150`, các bước 200 − 170 đều tròn chục), `[28]` (`hai-tui-80`, 5 số hạng, gom 70 − 40), và mỗi lựa chọn của `[29]` (`chon-bang-2`), `[39]` (`chon-nhom-20-8`) - LL-18
- Vấn đề: hai ngoặc mỗi ngoặc hai số hạng hay nhóm hai cặp luôn có 3 phép; luật 2 phép tính nhẩm không giữ được mà không bỏ ý của card. Các số đã chọn để mỗi bước là phép nhẩm một chữ số hoặc tròn chục, và `explain` ghi đủ bước.
- Sửa: tuỳ tác giả; giữ và ghi quyết định vào `notebooks/backlogs/lesson-quy-tac-dau-ngoac/task.md` để vòng sau không nêu lại.

### 3. Còn từ vòng 2 (Góp ý 8 và 17): hình mẫu nhảy từ biểu thức dài tới kết quả trong một dòng

- Vị trí: `catalog.ts` khoá `hai-tui-giam-gia` ("= 100 − 40 + 5 − 30 + 10" rồi "= 45"), `LEADING_ROWS` ("= 9 − 12 − 5 + 8 − 1" rồi "= −1"), `thu-chi-lan` ("= 60 + 20 − 5 − 12 − 8" rồi "= 55", nay mở đầu phần 11) - LL-16
- Vấn đề: ba hình gộp 4 phép cộng trừ vào một bước; bé chậm không thấy 45, −1, 55 từ đâu ra.
- Sửa: thêm một dòng gom có nhãn, vd "= 115 − 70", "= 17 − 18", "= (60 + 20) − 5 − (12 + 8)" rồi "= 80 − 5 − 20".

### 4. Còn từ vòng 2 (Góp ý 9): ô thừa "0" của câu nối quá yếu

- Vị trí: `$.exercises[23].right[4]` (`noi-ngoac-ket-qua`, ô `r5`) - LL-14
- Vấn đề: không phép bỏ ngoặc sai nào của bốn tổng ra 0; bốn ô đã tự làm nhiễu cho nhau.
- Sửa: bỏ ô 0, hoặc giữ nếu app cần ô thừa (mọi kết quả sai thường gặp của bốn tổng đã nằm sẵn trong bốn ô đúng nên không có ô nhiễu nào khác để thay).

### 5. Còn từ vòng 2 (Góp ý 13): mẹo `gom-duong-am` không nói khi một nhóm không có số nào

- Vị trí: `$.sections[6].blocks[2].text` (`tip.gom-duong-am`) - LL-24
- Vấn đề: với −3 − 4 hay 5 + 2, "Lấy số lớn trừ số bé" không có số bé; kết quả vẫn đúng nếu bé tự coi nhóm trống là 0 (đã thử, bảng trên).
- Sửa: thêm "nhóm nào không có số thì coi là 0" nếu còn chỗ, hoặc bỏ qua vì câu của bài luôn có cả hai dấu.

### 6. Còn từ vòng 2 (Góp ý 18): hình chạm đổi dấu vẫn sửa luôn dòng đề

- Vị trí: `visual.doi-dau-tong-hop`, `visual.doi-dau-nam-ngoac` (ảnh `phone/133-s11-03-block-shown.png`) - LL-15
- Vấn đề: dòng đề sau khi chạm là một tổng khác tổng ban đầu; do cách vẽ của thành phần `flipTry`, không do chữ của bài.
- Sửa: giữ dòng đề như ban đầu, chỉ tô ô đã chạm; báo người làm app.

### 7. "kết quả" và "giá trị" cùng chỉ giá trị của một tổng

- Vị trí: `$.sections[9].blocks[2].children[0].text` ("mỗi cặp cho cùng một kết quả … cộng các kết quả bằng nhau"), `$.sections[6].blocks[2].text` (`tip.gom-duong-am`: "kết quả mang dấu"), `$.sections[10].blocks[3].text` (`tip.kiem-tra-hai-cach`: "kết quả khi bỏ ngoặc"), so với "giá trị của tổng" ở đề và nhãn hình - LL-05
- Vấn đề: vòng 2 (Nên sửa 3) chốt điều hỏi gọi là "giá trị"; chữ giải thích và mẹo còn dùng "kết quả". Không sai nghĩa.
- Sửa: "mỗi cặp cho cùng một giá trị … cộng các giá trị bằng nhau"; mẹo giữ "kết quả" nếu muốn nói kết quả của một phép tính.

### 8. Nhãn "+ trước ngoặc", "− trước ngoặc" của hình recap phần 5 thiếu chữ "dấu"

- Vị trí: `catalog.ts` khoá `ngoac-mot-so-vi-du` (bốn nhãn, ảnh `phone/060-s5-02-block.png`, `067-s5-06-recap.png`) - LL-21
- Vấn đề: nhãn "− trước ngoặc: +3 đổi dấu" mở đầu bằng một dấu − đứng riêng, đọc như gạch đầu dòng; bé chậm có thể không đọc ra "dấu trừ trước ngoặc". Vòng 2 đề xuất "dấu + trước ngoặc: …".
- Sửa: "dấu + trước ngoặc: +3 giữ dấu cũ", "dấu − trước ngoặc: +3 đổi dấu" (xem độ rộng trên điện thoại; các nhãn khác của hình đã xuống hai dòng được).

### 9. Id của hai câu đổi số còn mang số cũ

- Vị trí: `$.exercises[28].id` (`ex.hai-tui-80`, nay đề 60 nghìn), `$.exercises[42].id` (`ex.nhom-tru-14-6-4`, nay đề 14 − 7 + 3) - LL-20
- Vấn đề: hai id mô tả số của đề cũ; các câu khác đổi số cùng đợt (`gom-6-9-4`, `tinh-tong-hop-7-9`) đã đổi id. Id chưa khoá nên đổi được; sau `content:lock` thì không.
- Sửa: đổi id theo chức năng hay theo số mới (vd `hai-tui-60`, `nhom-tru-14-7-3`) trước khi chạy `content:lock`, và tìm lại mọi chỗ nhắc tới id cũ.

### 10. Câu ôn `gom-6-9-4` gần như lặp `chon-bang-5-8-4` (cùng card) và màn "Cùng làm" phần 7

- Vị trí: `$.exercises[34]` (`ex.gom-6-9-4`: 6 − 9 + 4 = 1), so với `$.exercises[33]` (5 − 8 + 4 = 1) và `visual.chon-so-duong` (6 − 9 + 2 − 1 + 5) - LL-07
- Vấn đề: hai câu ôn cùng card cùng đáp số 1 và gần như cùng số; câu mới mở đầu "6 − 9" giống màn "Cùng làm" liền trước.
- Sửa: vd 8 − 11 + 5 = 2 (dương 8 + 5 = 13, âm 11); sửa `check.expr`, `explain`, `explain.tex`.

### 11. Nhãn "bỏ 0" của `so-doi-mat-nhau` đọc được hai cách

- Vị trí: `catalog.ts` khoá `so-doi-mat-nhau` dòng 3, nhãn "30 và −30 cộng lại bằng 0, bỏ 0" (ảnh `phone/117-s10-02-block-end.png`) - LL-10
- Vấn đề: dòng đó viết "(30 − 30) − 17 − 5" nên "bỏ 0" có thể hiểu là bỏ kết quả của (30 − 30); thật ra là bỏ "− 0" ở cuối dòng trên.
- Sửa: nhãn "30 và −30 cộng lại bằng 0; bỏ luôn − 0".
