# Review: Quy tắc dấu ngoặc (`quy-tac-dau-ngoac`)

- Bài: `content/math/kntt/quy-tac-dau-ngoac/lesson.json`
- Vòng: 5 (Opus, soát đầy đủ phần bài tập sách bài tập) và 6 (Sonnet, chỉ phần đổi của phần đó), xem mục "Vòng 5 và 6" ở cuối; vòng 4 là vòng video (mục "# Vòng video"); vòng 1 đến 3 giữ nguyên bên dưới (vòng 3: chỉ phần đổi, một reviewer Sonnet)
- Nguồn đã đọc: `sources/math/quy-tac-dau-ngoac/` - sbt-p53, sbt-p54, sbt-p112
- `content:check`: 1 lỗi, 1 cảnh báo của bài (lỗi `[review-hash]`: bài đổi sau lần review trước, sẽ duyệt lại sau vòng 6; cảnh báo: 26 id chưa khoá trong `ids.lock.json`, chờ `content:lock`)
- Đọc hiểu (Haiku, lượt 1): 243 mục: 243 Hiểu rõ / 0 Hiểu mơ hồ / 0 Khó hiểu (`.shots/review/quy-tac-dau-ngoac/doc-hieu.md`); chữ đã đổi sau lượt này sẽ chạy lượt Haiku chỉ trên mục đổi nếu có; phần bài tập sách bài tập: tệp `doc-hieu-bai-tap-sach-1.md` đến `-10.md` cùng thư mục (tổng kết ở mục "Vòng 5 và 6")
- `lesson:walk`: 0 FAIL ở lần chạy cuối, sau duyệt lại (phần bài tập sách bài tập), ảnh trong `.shots/walk/quy-tac-dau-ngoac-bai-tap-sach-cuoi/` (lần chạy sau `--approve` và `content:lock`, ở cây tạm; lần chạy sau sửa vòng 5 ở `-vong2/`); các phần 1 đến 12 xem ảnh `.shots/walk/quy-tac-dau-ngoac/` (0 FAIL, 0 cảnh báo ở lần chạy sau khi rút nhãn hình phần 11)
- Kết luận: Hết lỗi Nghiêm trọng (0) sau vòng 6; còn 4 Nên sửa và 13 Góp ý (4 Nên sửa và 11 Góp ý còn từ vòng 3 ở các phần 1 đến 12; phần bài tập sách bài tập còn 0 Nên sửa và 2 Góp ý sau khi sửa các mục vòng 6), cùng các điểm "Không sửa, ghi cho chủ dự án" của vòng 5 và các mục đọc hiểu còn mơ hồ ghi ở mục "Vòng 5 và 6"; `--approve` và `content:lock` do điều phối chạy sau
- Bản đã review: `513c75c0a2113cfd006b5d88882812f033281637e24abdc3c80b38fdc46a04ff` (`pnpm content:diff` so với bản này)

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

---

# Vòng video - chỉ phần đổi (một reviewer Sonnet)

- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`: ba block `video`, ba bản ghi `videos`, lời đọc giới thiệu), section: `ngoac-dau-cong`, `ngoac-dau-tru`, `ngoac-tru-so-am`
- `video:check`: ok cả ba video (`bo-ngoac-dau-cong`, `bo-ngoac-dau-tru`, `ngoac-tru-so-am`: câu `rule` khớp bài, chữ quy tắc trên hình có `data-rule-text`)
- Kết luận: Hết lỗi Nghiêm trọng (0); 0 Nên sửa, 3 Góp ý.

Phạm vi và kết quả đối chiếu:
- Kịch bản: mỗi video 15 câu, câu thường ≤ 12 chữ, mở bằng câu chào "bạn", một câu `ask` ở giữa (không phải câu cuối), câu `rule` đầu có `think`, không `checkpoint`. Lặng đo bằng `silencedetect` trên mp4: sau `ask` 1,53 / 1,54 / 1,56 giây, sau `think` 1,04 giây, mọi quãng khác 0,82-1,37 giây.
- Phép tính đúng: 40 + (30 − 10) = 60; 12 + (4 − 7) = 9; 100 − (30 + 20) = 50; 60 − (25 + 15) = 20; 100 − (30 − 10) = 80; 50 − (20 − 5) = 35. Số trong lời, trên hình và trong ba note của bài khớp nhau (40/30/10; 100/30/20; 30/10/100).
- Câu quy tắc và recap của ba card lặp nguyên văn câu `rule` trong lời và trên hình ("dấu +" đọc "dấu cộng", "dấu −" đọc "dấu trừ" qua `say`; Whisper nghe đúng "cộng", "trừ", "âm 10").
- Hình khớp lời ở mốc `.vtt`: số, phép tính và kết quả (60, 50, 80, 9, 20, 35) hiện đúng lúc lời nói tới (xem lại trên mp4 cuối, vì khung contact sheet lệch khoảng 1 giây). Màu đúng: dương lime, âm pink, mọi chữ rõ không bị cắt, nửa dưới màn trống cho phụ đề.
- Clip theo card: `ngoac-dau-cong` 14,469-43,861, `ngoac-dau-tru` 15,919-55,843, `ngoac-tru-so-am` 13,802-52,783; mỗi clip bắt đầu ở câu hỏi và kết ở câu "Nhớ nhé", đúng đoạn quy tắc của card.
- Lời đọc giới thiệu `overview.vtt`: 25 cue, chữ khớp từng câu của `hook`, `summary`, `goals`, `whyItMatters` (cộng câu dẫn "Học xong bài này, bạn sẽ:"); câu đầu chào "bạn"; số 100/30/10 khớp video `ngoac-tru-so-am`.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. Ba video mở đầu 3 giây chỉ có con cú, chưa có hình theo lời chào

- Vị trí: `bo-ngoac-dau-cong` 1,0-4,0 giây, `bo-ngoac-dau-tru` 1,0-3,7 giây, `ngoac-tru-so-am` 1,0-4,0 giây (câu 1-2 của `.vtt`)
- Vấn đề: màn trắng trong lúc đọc "Hôm nay ta bỏ ngoặc có dấu cộng/trừ/số âm"; bé chậm không thấy tên bài nên có thể tưởng video chưa chạy.
- Sửa: hiện tên bài (hoặc biểu thức mẫu mờ) từ câu chào ở `s01-chuyen` của cả ba `index.html`; không đổi lời nên không cần đọc lại giọng.

### 2. Câu quy tắc của `ngoac-tru-so-am` không nói điều kiện "trước ngoặc có dấu −", và dòng 100 − (30 + 20) của `bo-ngoac-dau-tru` đọc "Cộng 30" khi hình ghi "30"

- Vị trí: `ngoac-tru-so-am/script.json` câu hỏi và câu `rule` ở `s02-quy-tac` (14,1-22,8 giây); `bo-ngoac-dau-tru/script.json` câu "Cộng 30 đổi thành trừ 30." (26,5 giây)
- Vấn đề: video `ngoac-tru-so-am` hỏi "số hạng −10 đổi thành gì?" rồi đọc luôn câu "Khi đổi dấu, …" mà chưa nhắc vì sao phải đổi (trước ngoặc có dấu −); bé chỉ nhớ được nếu vừa xem video ngay trước. Ở `bo-ngoac-dau-tru` số 30 đầu ngoặc không ghi dấu nhưng lời đọc "Cộng 30".
- Sửa: thêm vào lời dẫn một câu ngắn ≤ 12 chữ, vd "Trước ngoặc là dấu trừ, nên ta đổi dấu." (trước câu `ask` của `ngoac-tru-so-am`) và "Số 30 đứng đầu, coi như cộng 30." (trước câu "Cộng 30 đổi thành trừ 30"); cần đọc lại giọng nên hỏi chủ dự án trước khi dựng lại.

### 3. Whisper nghe lệch một số chỗ của giọng đọc, chưa chạm ngưỡng chặn

- Vị trí: `ngoac-tru-so-am` "Tiền trả lại là 100 trừ…" nghe thành "Kiên trả lại" (9,6 giây, khớp 0,982); `bo-ngoac-dau-cong` câu `rule` nghe "bỏ ngoặc bì" thay "bỏ ngoặc đi" (cả hai lần đọc, 20,1 và 40,6 giây) và "Bỏ ngoặc: 12 cộng 4 trừ 7" nghe "Bảo ngoặc" sau 4 lần đọc (33,07 giây, khớp 0,971); `ngoac-tru-so-am` "trong ngoặc" nghe "trong hoặc" sau 4 lần (36,2 giây, khớp 0,962)
- Vấn đề: số đo Whisper cho thấy 4 chỗ giọng có thể đọc mờ âm; chữ "trừ", "âm" đều đúng.
- Sửa: chủ dự án nghe riêng bốn chỗ này; nếu nghe sai thì thêm `say` cho đúng chữ và đọc lại câu đó.

## Vòng 5 và 6: phần bài tập sách bài tập (section cuối, 25 câu)

Bài đã xuất bản được thêm một section cuối `bookPractice` ("Bài tập sách bài tập", `$.sections[12]`): 10 câu sách (SBT 3.20a, 3.20b, 3.21a, 3.21b, 3.22a, 3.22b, 3.23a, 3.23b, 3.24, 3.25; đủ mọi bài tập của Bài 15 ở tr.54), 15 câu dẫn (`leadsTo`), 4 khối "Nhắc lại" (lặp nguyên văn câu quy tắc đã có của các section 2, 3, 6, 10, 12), recap, 24 hình mới `sbt-*` (nấc 2 và nấc 3 của câu sách, hình gợi ý của câu dẫn). Các section 1 đến 12, id, video, media không đổi. Sách in lời giải cho 3.20 đến 3.24 ở tr.112 (3.25 chỉ có lời giải bằng chữ): không có ý nào của sách thiếu đáp án; mọi đáp án và `check.expr` đã tính lại bằng chương trình từ chính đề.

- Vòng 5 (Opus, soát đầy đủ phần mới, đọc ảnh `sbt-p53`, `sbt-p54`, `sbt-p112`, sheet walk điện thoại và iPad ngang, ảnh các hình `sbt-*`): 1 Nghiêm trọng, 7 Nên sửa, 4 Góp ý. Đủ 10 câu sách; đề khớp từng chữ (hai dòng lệnh chung "Bỏ dấu ngoặc rồi tính các tổng sau (từ Bài 3.20 đến Bài 3.21):" và "Tính một cách hợp lí (từ Bài 3.22 đến Bài 3.23):", các dấu + trong ngoặc, số 0 trong (13 + 0), điều kiện −20 < x ≤ 20, đề 3.25); đáp án khớp tr.112 (−237, −49, 19, −75, −6, 0, −300, −150, 20); mọi nhiễu của câu chọn đúng; hai câu sắp xếp có đúng một thứ tự đúng. Báo cáo reviewer: `nhom-bai-tap-sach.md`.
- Vòng 6 (Sonnet, chỉ phần đổi sau vòng 5; `pnpm content:diff quy-tac-dau-ngoac --base 69180015ca256a1b3a9f5ce71e1c2cd1b15fa880`, cùng bốn hình đổi của `catalog.ts` và các mục khác của `$.sections[12]`): 0 Nghiêm trọng, 1 Nên sửa, 3 Góp ý. Bản sửa vòng 5 đúng ở mọi mục trừ một chỗ còn sót cùng kiểu (Nên sửa 1); recap vẫn lặp nguyên văn hai câu quy tắc của khối "Nhắc lại"; mọi `answer` và `check.expr` đúng. Chi tiết ở mục "Kết quả vòng 6".

Đã sửa sau vòng 5:
- Nghiêm trọng (LL-08), `sbt-3-25`: năm bước sắp xếp chép gần nguyên văn lời giải ở tr.112 ("Gọi s là tổng của ba số còn lại", "Lấy ba số khác a. Tương tự, ..."). Nay viết lại bằng lời của bài (chọn ba số, bỏ a ra, bỏ a và b ra, cộng cả năm số, ba số âm), vẫn một thứ tự duy nhất; `explain` và nhãn hình `sbt-3-25-giai` viết lại theo.
- Nên sửa: câu dẫn `dan-3-25-ba-so` lấy khuôn đề 3.25 (LL-08), nay đề và bốn bước bằng lời của bài; hình gợi ý "ghép số đối" của `dan-3-21a-20-35` không có cặp số đối (LL-02), nay hình mới `sbt-goi-y-ngoac-ba-so` cùng dạng, số khác đề; ba lời giải viết "cộng các số âm 40 + 13 = 53" như tổng của số âm là số dương (LL-05), nay "cộng các số âm (−40) + (−13) = −53"; màn "Nhắc lại cho bài 3.24 và bài 3.25" thiếu ý cho 3.25 (LL-23), nay có thêm một khối nói tổng âm thì có ít nhất một số âm; hình gợi ý của `dan-3-25-co-so-am` ("0 + 4 + 2") đi đúng lập luận của đáp án (LL-02), nay hình `sbt-goi-y-ba-so-tong-am` cho ba bộ ba số có tổng âm và dừng ở "?".
- Góp ý đã nhận: lời giải 3.24 ("số 0 cũng bằng 0") viết lại; câu dẫn `(5 − 9) − (3 − 10)` gần trùng câu phần 6 (LL-07), nay `(6 − 11) − (4 − 12)` (id `dan-3-21a-6-11`); nhãn hình gợi ý 3.25 sửa.
- Không sửa, ghi cho chủ dự án: (1) sách in ";" ở cuối đề 3.24 (bài một ý, các bài một ý khác kết bằng "."): app giữ nguyên văn ";". (2) Hình gợi ý của câu dẫn `dan-3-23b-90-55` là hình `sbt-goi-y-ghep-tron-ngoac` (dạng `53 − (24 − 7) + (−26)`) khác dạng đề một ngoặc ba số hạng, cùng kỹ năng; giữ để câu dẫn không dùng chung hình với `sbt-3-23b`.

Đọc hiểu (Haiku) trên chữ mới của section: lượt 1 trên 56 mục: 54 / 2 / 0 (hai câu dẫn 3.24 còn ký hiệu `{x ∈ ℤ | ...}`, tệp `doc-hieu-bai-tap-sach-1.md`; Haiku ghi sai chỉ số exercise lệch một so với JSON path đúng nhưng nêu đúng tên câu). Lượt 2 và 3 trên các mục 3.24 viết lại: 2 / 3 / 0 mỗi lượt (`-2.md`, `-3.md`). Sau review vòng 5, lượt trên 24 mục viết lại: 16 / 3 / 0 (`-4.md`), lượt trên ba lời giải 2 / 1 / 0 (`-5.md`), lượt trên mục còn mơ hồ 0 / 1 / 0 (`-6.md`), lượt trên năm mục rút gọn sau walk 3 / 2 / 0 (`-7.md`) và hai mục cuối 0 / 2 / 0 (`-8.md`). Còn mơ hồ sau tối đa ba lượt, không chặn duyệt (ghi theo luật đọc hiểu): ký hiệu `{x ∈ ℤ | ...}` của đề 3.24 và hai câu dẫn dùng nó (`$.exercises[83].prompt[1].text`, `$.exercises[84].prompt[1].text`, `$.sections[12].blocks[3].children[1].text`, đề của sách nên không bỏ); `$.exercises[71].explain.text` (lượt 4, 5, 6 đều mơ hồ, bản cuối "Bỏ ngoặc theo dấu đứng trước: ..." đã theo mẫu của hai lời giải được ghi "Hiểu rõ" nhưng chưa có lượt đọc lại); `$.exercises[87].prompt[1].text` và `$.exercises[88].items[1].content.text` (từ "cũng", "lại" bị ghi mơ hồ ở lượt 8; bản cuối bỏ hai từ đó, chưa có lượt đọc lại). Các tệp đọc hiểu cùng thư mục `.shots/review/quy-tac-dau-ngoac/`, không tệp nào ghi đè tệp cũ.

Walk: lần đầu 3 FAIL (hai khối hình có bước tương tác trong cùng một màn "Nhắc lại", ô "Tiếp" trùng); nay một hình bước ở mỗi màn, 0 FAIL. Lần chạy sau sửa vòng 5 có một FAIL (`dan-3-25-ba-so`: vùng trả lời cao hơn màn điện thoại 5 px khi sai lần ba), đã rút gọn bốn bước của câu dẫn và các bước của 3.25 rồi chạy lại, 0 FAIL.

### Kết quả vòng 6

Reviewer Sonnet, chỉ phần đổi sau vòng 5. Nguồn đã đọc (mở ảnh): `sbt-p54.png` (đề), `sbt-p112.png` (lời giải). Phạm vi: mọi mục của `content:diff` (một mục thêm của khối "Nhắc lại", ba lời giải sửa chữ cộng số âm, lời giải 3.24, câu dẫn `dan-3-21a-6-11` thay `dan-3-21a-5-9`, đổi hình gợi ý của `dan-3-21a-20-35` và `dan-3-25-co-so-am`, viết lại `dan-3-25-ba-so` và `sbt-3-25`), bốn hình đổi của `catalog.ts` (`sbt-3-25-giai`, `sbt-goi-y-3-25`, `sbt-goi-y-ba-so-tong-am`, `sbt-goi-y-ngoac-ba-so`) và các mục khác của `$.sections[12]` (25 exercise `$.exercises[64]` đến `$.exercises[88]`, bốn khối "Nhắc lại", recap). `content:check`: chỉ còn lỗi `[review-hash]` và cảnh báo id chưa khoá.

Đối chiếu sách: đề 3.21a `(62 − 81) − (12 − 59 + 9);`, 3.24 (kể cả dấu ";" cuối) và 3.25 (hai câu đề nguyên văn, khối `note` riêng "Sắp xếp các bước giải thích theo thứ tự đúng.") khớp từng chữ với tr.54; đáp án 3.21a = 19 và 3.24 = 20 khớp tr.112. Năm bước `items` của `sbt-3-25` và bốn bước của `dan-3-25-ba-so` là lời của bài, không chép tr.112 (không còn câu nào của sách ở dạng "Gọi s là tổng của ba số còn lại"); mỗi bước dùng tên do bước trước đặt (a ở bước 1, "bỏ a ra" ở bước 2, "bỏ cả a và b" ở bước 3, a, b, s ở bước 4 và 5) nên chỉ có đúng một thứ tự đúng. Đề của `dan-3-25-ba-so` ("Có ba số nguyên. Cộng hai số nào trong ba số cũng được số âm.") viết bằng lời của bài, không theo khuôn đề sách.

#### Nghiêm trọng

Không có.

#### Nên sửa

##### 1. Lời giải `dan-3-21a-6-11` còn viết "rồi trừ 11 + 4 = 15", khác ba lời giải đã sửa cùng cách làm (LL-05)

- Vị trí: `$.exercises[69].explain.text` (`quy-tac-dau-ngoac.ex.dan-3-21a-6-11`, câu dẫn của SBT 3.21a)
- Nguồn: —
- Vấn đề: vòng 5 đổi ba lời giải (`dan-3-20b-18-tru-am25`, `dan-3-21a-20-35`, `sbt-3-21a`) sang "cộng các số âm (−40) + (−13) = −53, vậy tổng là 43 + (−53) = −10". Câu dẫn `dan-3-21a-6-11` (id mới, thay câu cũ cùng lời giải) còn "Cộng các số dương 6 + 12 = 18, rồi trừ 11 + 4 = 15, được 3": cùng một cách làm có hai cách nói trong cùng phần, và chính câu này đứng ngay trước `sbt-3-21a`. Cụm "trừ 11 + 4" còn đọc được hai cách (18 − (11 + 4), hay 18 − 11 + 4), bé chậm dễ hiểu thành −11 + 4.
- Sửa: "Ngoặc ở đầu tổng giữ dấu cũ, ngoặc có dấu − đứng trước đổi dấu: 6 − 11 − 4 + 12. Cộng các số dương 6 + 12 = 18, cộng các số âm (−11) + (−4) = −15. Vậy tổng là 18 + (−15) = 3." (vẫn 3 câu; `tex`, `answer`, `check.expr` giữ nguyên; Haiku đọc lại mục này.)

#### Góp ý

##### 1. Lời giải `sbt-3-25` còn sát một câu của sách và có liên từ "nên" nối sai

- Vị trí: `$.exercises[88].explain.text` (`quy-tac-dau-ngoac.ex.sbt-3-25`); cùng kiểu nhẹ hơn ở `$.exercises[87].explain.text`, nhãn "nên có một số âm" của `catalog.ts` khoá `sbt-3-25-giai`
- Nguồn: tr.112, lời giải 3.25
- Vấn đề: câu đầu "Ba số bất kì có tổng âm, nên trong ba số đó phải có một số âm" gần như câu của sách ("nên trong ba số này phải có một số nguyên âm"). Câu cuối "Ba số còn lại có tổng s cũng âm, nên cả năm số cộng lại là a + b + s" dùng "nên" như thể s âm là lý do để tổng bằng a + b + s; thực ra tổng bằng a + b + s vì ba nhóm a, b, s ghép đủ năm số. Các bước `items` nói "có ít nhất một số âm", còn lời giải và nhãn hình nói "có một số âm" (hai cách nói cho một ý).
- Sửa: "Tổng của ba số bất kì là số âm, nên ít nhất một trong ba số là số âm. Ta tìm được hai số âm khác nhau là a và b. Gọi s là tổng của ba số còn lại, s cũng âm. Năm số ghép thành a, b và s, nên tổng năm số là a + b + s, tổng của ba số âm." Đổi nhãn hình thành "nên có ít nhất một số âm tên a".

##### 2. Chưa có ảnh `sbt-3-25` khi sai ba lần, vùng trả lời cao hơn màn

- Vị trí: `$.exercises[88]` (`quy-tac-dau-ngoac.ex.sbt-3-25`); ảnh `.shots/walk/quy-tac-dau-ngoac-bai-tap-sach-vong2/phone/220-s13-29-exercise-sbt-3-25.png`, `ipad-landscape/219-s13-29-exercise-sbt-3-25.png`
- Nguồn: —
- Vấn đề: `lesson:walk` chỉ cho sai ba lần câu đầu tiên của mỗi kiểu (`order` có hình gợi ý đã dành cho `dan-3-25-ba-so`), nên trạng thái sai ba lần của `sbt-3-25` không có ảnh và không được đo. Ảnh trạng thái đầu cho thấy vùng sắp xếp năm thẻ cao khoảng 900 px trên điện thoại (phần nhìn thấy khoảng 755 px) và khoảng 400 px trên iPad ngang (khoảng 315 px), cao hơn `dan-3-25-ba-so` (bốn thẻ, đã từng FAIL hơn 5 px). Khi sai lần ba câu này hiện hình lời giải `sbt-3-25-giai`, nên có thể walk chỉ đo hình đó chứ không đo vùng trả lời; chưa có bằng chứng vùng trả lời bị thanh dưới che chỗ trẻ cần chạm.
- Sửa: không bắt buộc. Nếu muốn chắc, đo riêng trạng thái sai ba lần của câu này trên điện thoại và iPad ngang; trẻ vẫn cuộn được vùng trả lời.

##### 3. Chữ giải thích xuống dòng giữa dấu "=" hay dấu phép tính và số

- Vị trí: `$.exercises[67].explain.text`, `$.exercises[70].explain.text`, `$.exercises[71].explain.text`; ảnh `phone/173-s13-08-exercise-dan-3-20b-18-tru-am25-correct.png` ("(−40) +" cuối dòng, "(−13) = −53." đầu dòng sau), `179-s13-11-exercise-dan-3-21a-20-35-correct.png` ("… =" cuối dòng, "−14." một mình dòng sau)
- Nguồn: —
- Vấn đề: do cách ngắt dòng của app, không do chữ của bài; các phép tính có ngoặc dài hơn sau sửa vòng 5 làm việc này hiện rõ hơn. Không chữ nào bị cắt hay chồng.
- Sửa: báo người làm app (giữ dấu "=" và số cuối cùng của phép tính trên cùng một dòng, vd dùng khoảng trắng không ngắt); không sửa nội dung bài.

#### Kiểm bản sửa vòng 5

| Mục vòng 5 | Đã sửa đúng | Ghi chú |
|---|---|---|
| Nghiêm trọng (LL-08): năm bước sắp xếp của `sbt-3-25` chép lời giải tr.112 | Có | Năm bước và nhãn `sbt-3-25-giai` viết bằng lời của bài; đúng toán; đúng một thứ tự (mỗi bước dùng tên do bước trước đặt); còn một ý nhỏ ở Góp ý 1 |
| Nên sửa 1: câu dẫn `dan-3-25-ba-so` lấy khuôn đề 3.25 | Có | Đề và bốn bước bằng lời của bài; đúng toán; đúng một thứ tự; `explain` đúng |
| Nên sửa 2: hình gợi ý "ghép số đối" của `dan-3-21a-20-35` | Có | Hình `sbt-goi-y-ngoac-ba-so`: `(30 − 42) − (9 − 15 + 7)`, cùng dạng đề, số khác đề, dừng ở "?" (ảnh `sheet-changed-01.png`) |
| Nên sửa 3: "cộng các số âm 40 + 13 = 53" (LL-05) | Một phần | Ba lời giải (`dan-3-20b-18-tru-am25`, `dan-3-21a-20-35`, `sbt-3-21a`) đúng và đã cùng một cách nói; chỗ sót là câu dẫn `dan-3-21a-6-11` (Nên sửa 1 vòng 6) |
| Nên sửa 4: khối "Nhắc lại cho bài 3.24 và bài 3.25" thiếu ý cho 3.25 | Có | Khối `note` mới đúng toán, không phải câu `rule`, nên recap không phải đổi; recap vẫn lặp nguyên văn hai câu quy tắc của hai khối `rule` (đã so bằng chương trình) |
| Nên sửa 5: hình gợi ý `dan-3-25-co-so-am` đi đúng lập luận của đáp án (LL-02) | Có | Hình `sbt-goi-y-ba-so-tong-am` cho ba bộ ba có tổng âm, dừng ở "?", không nêu kết luận, không đi thẳng vào lựa chọn đúng; số không trùng ba phản ví dụ trong `wrong` |
| Góp ý 1: lời giải 3.24 ("số 0 cũng bằng 0") | Có | "còn số 0 cộng vào thì tổng không đổi", đúng toán, khớp hình `sbt-3-24-giai` |
| Góp ý 3: câu dẫn gần trùng câu phần 6 (LL-07) | Có | `(6 − 11) − (4 − 12)` không trùng ngoặc nào trong `lesson.json`; số không trùng hình, recap |
| Góp ý 4: nhãn hình gợi ý 3.25 | Có | "ba số này có tổng âm, trong đó có số âm"; dừng ở "?"; số −6, −5, −4, −1, 3 khác đề |
| Nên sửa 7 (Hiểu mơ hồ sau ba lượt đọc hiểu) | Ghi nhận | Xem mục "Đọc hiểu" dưới đây |

#### Các số đã tự thử (Node, chỉ tính)

- Câu `numeric` đổi: `dan-3-21a-6-11` (6 − 11) − (4 − 12) = 3 (6 − 11 − 4 + 12; 6 + 12 = 18, 11 + 4 = 15, 18 − 15 = 3). Cả 22 câu `numeric` của `$.exercises[64]` đến `[85]`: `check.expr` ra đúng `answer`; `dan-3-24-dem-phan-tu` ra 6 (`3 − (−3)`); tính trực tiếp từ đề `18 − (−25) + (−40) − (+13)` = −10, `(20 − 35) − (8 − 14 + 5)` = −14, `(62 − 81) − (12 − 59 + 9)` = 19; tổng các số nguyên từ −19 đến 20 = 20.
- Phép tính trong lời giải đổi: (−40) + (−13) = −53 và 43 + (−53) = −10; (−35) + (−8) + (−5) = −48 và 34 + (−48) = −14; (−81) + (−12) + (−9) = −102 và 121 + (−102) = 19. Cả bốn đúng.
- Hình mới: −7 + 3 + 2 = −2; −3 − 4 − 1 = −8; −6 − 1 + 5 = −2 (đúng như hình, cả ba tổng âm; trong ba bộ có lần ba số đều âm, có lần một và hai số âm, không có bộ nào có số 0 hay thiếu số âm); (30 − 42) − (9 − 15 + 7) = −13 và 30 − 42 − 9 + 15 − 7 = −13 (kết quả ẩn sau "?", không là đáp án của câu nào trong section; không số nào hiện ra là −14); mười bộ ba của −6, −5, −4, −1, 3 có tổng −15, −12, −8, −11, −7, −4, −10, −6, −3, −2: đều âm; cả năm số cộng lại −13 (hình dừng ở "?").
- Các câu trả lời trắc nghiệm `dan-3-25-co-so-am`: −5 + 1 + 2 = −2, −1 − 2 − 3 = −6, −4 − 2 + 1 = −5 (ba phản ví dụ trong `wrong` đúng); chỉ lựa chọn "ít nhất một số âm" luôn đúng.
- Ảnh walk điện thoại (`sheet-s13-all-01..09`) và iPad ngang (`sheet-s13-all-01..06`), ảnh bốn hình đổi (`visuals/sheet-changed-01.png`): không chữ nào bị cắt, chồng hay tràn; màn "Nhắc lại cho bài 3.24 và bài 3.25" có thêm một khối vẫn đọc trọn khi cuộn (cuối màn không bị thanh dưới che); hai câu sắp xếp ở trạng thái sai ba lần của `dan-3-25-ba-so` (ảnh `218` điện thoại, `217` iPad ngang) hiện đủ bốn thẻ với thứ tự đúng, lời giải ngay bên dưới, thanh dưới không che thẻ nào; lời giải mới của năm câu hiện đủ trên cả hai màn; hình `sbt-goi-y-ngoac-ba-so` xuống dòng ở "+15 − 7" nhưng dấu đi cùng số.

#### Đọc hiểu (đọc như một bé lớp 6 chậm)

Các mục còn "Hiểu mơ hồ" sau lượt 4 đến 8 (không kể các mục chỉ mơ hồ vì ký hiệu `{x ∈ ℤ | ...}` của đề sách), đọc bản cuối trong `lesson.json`:
- `$.exercises[71].explain.text`: "Bỏ ngoặc theo dấu đứng trước: 62 − 81 − 12 + 59 − 9. Cộng các số dương 62 + 59 = 121, cộng các số âm (−81) + (−12) + (−9) = −102. Vậy tổng là 121 + (−102) = 19." Đọc được: cùng khuôn với hai lời giải đã được Haiku ghi "Hiểu rõ", hai cụm gây mơ hồ ở lượt 5 và 6 ("câu đầu dài", "ngoặc sau dấu −") không còn. Ghi nhận.
- `$.exercises[87].prompt[1].text`: "Sắp xếp các bước để giải thích vì sao tổng của ba số là số âm." Đọc được; từ "thấy" và "cũng" gây mơ hồ ở lượt 7 và 8 đã bỏ. Ghi nhận.
- `$.exercises[88].items[1].content.text`: "Bỏ a ra, còn bốn số. Chọn ba số trong bốn số này. Trong ba số này vẫn có một số âm, ta đặt tên là b." Đọc được: ba câu ngắn, mỗi câu một việc, "vẫn" nối với lý do ở đề ("tổng của ba số bất kì là số âm"). Ghi nhận.
- Ba mục trên (bản cuối) chưa có lượt Haiku đọc lại vì đã dùng hết ba lượt cho các mục còn mơ hồ; điều phối quyết định có chạy thêm lượt hay không.

#### Đã sửa sau vòng 6

- Nên sửa 1 (LL-05), `dan-3-21a-6-11`: lời giải nay "Cộng các số dương 6 + 12 = 18, cộng các số âm (−11) + (−4) = −15. Vậy tổng là 18 + (−15) = 3", cùng cách nói với ba lời giải đã sửa ở vòng 5; Haiku lượt 9 ghi "Hiểu rõ".
- Góp ý 1: `explain` của `sbt-3-25` và `dan-3-25-ba-so` nói "ít nhất một số âm" như các bước, câu cuối nối bằng "Vậy" thay "nên", câu đầu nêu rõ "Trong năm số" và "Trong ba số" để lời giải tự đọc được; nhãn hình `sbt-3-25-giai` đổi thành "nên có ít nhất một số âm tên a" và "vẫn có số âm tên b". Haiku lượt 9 và 10 ghi hai lời giải này "Hiểu mơ hồ" hay "Khó hiểu" khi chỉ đưa phần lời giải mà không kèm đề của câu (năm số, ba số), nên bản cuối thêm chính chữ đề vào câu đầu; bản cuối chưa có lượt đọc lại vì đã dùng hết ba lượt (lượt 4, 9, 10).
- Góp ý 2 (chưa có ảnh `sbt-3-25` khi sai ba lần) và Góp ý 3 (app ngắt dòng giữa dấu "=" và số): không sửa; Góp ý 3 để báo người làm app, không do chữ của bài. Vùng trả lời của `dan-3-25-ba-so` ở trạng thái sai ba lần đã được walk đo (0 FAIL); `sbt-3-25` có năm thẻ nhưng các thẻ đã rút ngắn bằng cách bỏ câu thừa.
