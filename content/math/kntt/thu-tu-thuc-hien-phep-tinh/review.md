# Review: Thứ tự thực hiện các phép tính (`thu-tu-thuc-hien-phep-tinh`)

- Bài: `content/math/kntt/thu-tu-thuc-hien-phep-tinh/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/thu-tu-thuc-hien-phep-tinh/` - p24, p25, p26, p102, p103
- `content:check`: 0 lỗi, 1 cảnh báo của bài (101 id chưa có trong `ids.lock.json`)
- `lesson:walk`: 0 FAIL, 0 cảnh báo chặn bài, ảnh trong `.shots/walk/thu-tu-thuc-hien-phep-tinh/` (chụp 16:48–16:49, sau lần sửa cuối của `lesson.json` và `catalog.ts` lúc 16:42)
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `2547d3534329d3b49991996a5029df47b084bd6b6adc3c6bc9244a27c2576dd7` (`pnpm content:diff` so với bản này)

Ba reviewer đã tự giải cả 66 exercise trước khi đọc `answer`: mọi đáp án đúng, mỗi câu `choice` có đúng một lựa chọn đúng. Nấc 1 không lộ đáp án ở câu nào; mọi `hintVisualId` dùng số khác đề và dừng ở "?"; mọi `solutionVisualId` dùng số của đề.

Mục của vòng 1:
- Đã hết: Nghiêm trọng 1, 3, 4; Nghiêm trọng 2 (cột sai nay xám, có dấu ×; `ngoac-tron-so-sanh` là "Có dấu ngoặc" / "Không có dấu ngoặc"), trừ nhãn `nhan-chia-so-sanh` (Nghiêm trọng 1 dưới đây); Nên sửa 2, 3, 5–15, 17, 18, 20–24, 26; Góp ý 1, 2, 3, 6, 11, 12, 15–18, 20, 21.
- Còn, đã gộp vào vòng này: Nên sửa 1 (Nên sửa 1 dưới đây), Nên sửa 4 (Nghiêm trọng 1), Nên sửa 16 (Góp ý 15), Nên sửa 19 (Nên sửa 12), Góp ý 5 (Góp ý 4), Góp ý 8 (Góp ý 5), Góp ý 10 và 13 (Góp ý 10), Nên sửa 25 (Nên sửa 16), Góp ý 4 (Góp ý 16), Góp ý 7 (Góp ý 17), Góp ý 9 (Góp ý 18), Góp ý 14 (Góp ý 9), Góp ý 19 (Nên sửa 15).

## Nghiêm trọng

### 1. Luật "hai phép cùng loại thì làm từ trái sang phải" được nói bằng bốn cách, hai trong đó sai khi đọc như luật chung

- Vị trí:
  - `$.sections[2].blocks[1].children[0].text` (`section.cong-tru`: "Cộng không làm trước trừ: …")
  - spec `cong-tru-so-sanh` (`wrongLabel: "Sai: cộng trước"`) và `nhan-chia-so-sanh` (`wrongLabel: "Sai: nhân trước"`) trong `src/visuals/math/thu-tu-thuc-hien-phep-tinh/catalog.ts`
  - `$.sections[5].blocks[1].children[0].text` (`section.nhan-chia`: "Nhân và chia ngang nhau: …")
  - `$.sections[6].recap.caption`, `$.cards[6].recap.caption`, `$.sections[11].recap.caption` ("Hai phép cùng nhóm …")
  - Nhãn bậc thang `RUNGS` trong `statics.tsx` ("Từ trái sang phải" ở từng bậc)
- Nguồn: tr.24, `p24.png` (hai dòng "Từ trái qua phải", cho cộng trừ và cho nhân chia)
- Vấn đề: Tổng hợp nâng từ Nên sửa (nhóm 1 mục 1, nhóm 2 mục 1 và 2) lên Nghiêm trọng, vì đây là câu quy tắc và nhãn trong hình, hai thứ trẻ nhớ nguyên văn.
  - "Cộng không làm trước trừ" đọc như luật chung là sai: trong 10 + 4 − 3, cộng làm trước. Nhãn "Sai: cộng trước" ngay dưới lặp lại ý đó. Mọi ví dụ và câu hỏi của card `cong-tru` có dấu trừ đứng đầu, nên không câu nào sửa được hiểu sai "trừ trước cộng".
  - Nhãn "Sai: nhân trước" (ảnh `ipad/060-s6-02-block.png`) đọc riêng là "nhân trước thì sai". Màn kế tiếp là câu kiểm tra `chon-phep-nhan-chia` (4 · 6 : 3), đáp án là nhân trước: trẻ nhớ nhãn sẽ chạm phép chia và sai.
  - Cùng nhãn "Sai: cộng trước" được dùng lại ở `tong-hop-dong-viet-lai` (5 + 3 · 2) cho một lỗi khác: cộng trước nhân.
  - Cùng một luật có bốn cách nói: phủ định (`cong-tru`), "ngang nhau" (`nhan-chia`), "cùng nhóm" (recap `hon-hop`, `bai-tap-sach`), "Từ trái sang phải" (bậc thang). "Ngang nhau" và "nhóm" không được định nghĩa, bậc thang cũng không có chữ "nhóm". Recap của `hon-hop` vì vậy lệch note của hai section nó tóm tắt.
- Sửa:
  - Note `cong-tru`: "Cộng và trừ ngang nhau: dấu nào đứng bên trái thì làm trước. Với 10 − 4 + 3, làm 10 − 4 trước, rồi cộng 3."
  - Recap `hon-hop` (section và card): "Nhân, chia làm trước; cộng, trừ làm sau. Hai phép ngang nhau thì làm từ trái sang phải." Recap `bai-tap-sach`: "Thứ tự: ngoặc, luỹ thừa, nhân chia, cộng trừ; hai phép ngang nhau thì làm từ trái sang phải."
  - Nhãn cột sai nói đúng phép bị làm sai chỗ, như `luy-thua-so-sanh` đang làm: `cong-tru-so-sanh` "Sai: làm 4 + 3 trước", `nhan-chia-so-sanh` "Sai: làm 6 · 2 trước", `tong-hop-dong-viet-lai` "Sai: làm 5 + 3 trước".
  - Đổi một câu kho ôn của card `cong-tru` sang biểu thức có dấu cộng đứng đầu, ví dụ `sap-buoc-cong-tru` thành 20 + 15 − 5 − 10 (bước đầu 20 + 15 = 35).

## Nên sửa

### 1. Hình gợi ý của các câu bảng nhân và chia không dẫn tới phép tính của đề

- Vị trí: `$.exercises[12].hints.hintVisualId` (`nhan-7-8`, spec `nhan-7-8-goi-y` là bảng 6: 6 · 5, 6 · 6, 6 · 7 = ?); `$.exercises[14].hints.hintVisualId` (`nhan-9-6`, bảng 8); `$.exercises[13].hints.hintVisualId` (`chia-63-9`, spec `chia-63-9-goi-y` là 56 : 8)
- Nguồn: Kiến thức nền (tiểu học)
- Vấn đề: Trẻ sai 7 · 8 thì thấy bảng 6, sai 9 · 6 thì thấy bảng 8, không dòng nào có thừa số của đề. `chia-63-9-goi-y` lặp lại đúng ví dụ 56 : 8 đã giải trọn trên màn `chia-hoi-nguoc`. Luật nấc 2 cho phép dùng số của đề miễn dừng ở "?". Vòng 1 Nên sửa 1 chưa hết.
- Sửa: `nhan-7-8-goi-y` = 7 · 6 = 42, 7 · 7 = 49, 7 · 8 = ?; `nhan-9-6-goi-y` = 9 · 4 = 36, 9 · 5 = 45, 9 · 6 = ?; `chia-63-9-goi-y` = 63 : 9 = ? (9 · ? = 63), mode `hint`.

### 2. Câu kiểm tra `nhan-7-8` hỏi lại phép nhân vừa hiện trên màn trước

- Vị trí: `$.sections[3].checkIds[0]` (`ex.nhan-7-8`) so với visual `chia-hoi-nguoc` (`$.sections[3].blocks[1].children[1]`, dòng "8 · 7 = 56")
- Nguồn: Kiến thức nền (tiểu học)
- Vấn đề: Ảnh `045-s4-02-block.png` hiện 8 · 7 = 56, màn kế `046-s4-03-exercise-nhan-7-8.png` hỏi 7 · 8. Trẻ chép 56, câu kiểm tra không cho biết trẻ đã thuộc bảng nhân chưa.
- Sửa: Đổi sang một tích không có trên màn quy tắc, luyện tập hay kho ôn (ví dụ 7 · 4 = 28), đổi id và hai spec `nhan-7-8-*` theo.

### 3. Phép tính trong câu quy tắc bị ngắt giữa dòng

- Vị trí: `$.sections[3].blocks[0].children[0].text`, `$.sections[3].recap.caption`, `$.cards[3].recap.caption` ("42 : 6 = 7"); `$.sections[2].blocks[1].children[0].text` ("10 − 4 + 3"); `$.sections[5].blocks[1].children[0].text` ("48 : 6 · 2")
- Nguồn: —
- Vấn đề: Ảnh ipad `044-s4-01-block.png`, `050-s4-05-recap.png` ("42 :" / "6 = 7."); phone `032-s3-02-block.png` ("10 −" / "4 + 3"), phone `060-s6-02-block.png` ("48 : 6" / "· 2"). Câu cần nhớ bị đọc thành hai mẩu rời. Nhóm 2 ghi Góp ý; gộp lên mức Nên sửa của nhóm 1.
- Sửa: Khoảng trắng không ngắt (U+00A0) quanh dấu trong phép tính của `note`/`caption`, hoặc tách phép tính ra khối `formula`; nếu cần app hỗ trợ thì báo người làm app và ghi backlog.

### 4. Hình mở bài tô cách tính sai của Lan bằng màu "Làm trước" và "Kết quả"

- Vị trí: `$.sections[0].blocks[0]`, `$.overview.hook.visualId` (visual `hoa-don-hai-ban`, `HoaDonHaiBan` trong `statics.tsx`)
- Nguồn: tr.24, `p24.png`
- Vấn đề: Ảnh `002-s1-01-block-end.png`: cột Lan có khung hồng quanh "8 + 5", dấu ♦ hồng, kết quả gạch chân hổ phách, giống cột Nam. Từ màn sau, hồng nghĩa là "Làm trước", cách sai là xám có ×; không màn nào đánh dấu cột Lan sai.
- Sửa: Ở trạng thái cuối của `hoa-don-hai-ban`, cột Lan dùng kiểu cột sai của bài (xám, ×, "Sai: làm 8 + 5 trước"), hoặc màn `hoa-don-dung` thêm một dòng nêu Lan sai vì cộng trước.

### 5. Tình huống mua quà của section ngoặc lồng có hai cách hiểu và không có kết

- Vị trí: `$.sections[8].blocks[2].caption` (visual `ngoac-long-tung-buoc`)
- Nguồn: —
- Vấn đề: "3 gói kẹo 2 nghìn đồng" đọc được là cả 3 gói giá 2 nghìn; "10 nghìn đồng tiền túi" không rõ là gì; caption không nói 32 nghìn đồng là số tiền gì (ảnh `094-s9-03-block.png`, `095-s9-03-block-end.png`).
- Sửa: "Mua 2 phần quà, mỗi phần có 1 hộp bút 5 nghìn đồng và 3 gói kẹo, mỗi gói 2 nghìn đồng. Mua thêm 1 thiệp 10 nghìn đồng. Cần tất cả 32 nghìn đồng."

### 6. Câu luyện tập `tinh-hon-hop-1` cần bốn phép tính

- Vị trí: `$.exercises[27]` (`ex.tinh-hon-hop-1`, `30 − 4 · 5 + 12 : 3`)
- Nguồn: —
- Vấn đề: Luật "Số nhỏ" giới hạn câu luyện tập ở 2 phép tính nhẩm; đây là câu tự làm đầu tiên sau quy tắc mà có bốn phép.
- Sửa: Rút còn hai hay ba phép, ví dụ `30 − 4 · 5 + 2` (= 12); chuyển câu hiện tại vào kho ôn nếu muốn giữ; sửa `check.expr` và hai spec `tinh-hon-hop-1-*`.

### 7. Hình mẫu tìm x không viết cả đẳng thức, vế phải không có trong câu chuyện

- Vị trí: `$.sections[12].blocks[0].children[1]`, `$.sections[12].recap`, `$.cards[13].recap` (visual `tim-so-mua-but`, spec `findx` rhs `2·4+12`)
- Nguồn: tr.26 bài 1.66, tr.102 (`p26.png`, `p102.png`)
- Vấn đề: Ảnh `137-s13-01-block.png`: dòng đầu "3x + 5 = ?", dòng riêng "2 · 4 + 12". Note vừa định nghĩa "Vế phải là phần bên phải dấu =" nhưng bên phải dấu = chỉ có "?". Caption "hết 20 nghìn đồng" không có gì ứng với 2 · 4 + 12.
- Sửa: Dòng đầu viết `3x + 5 = 2 · 4 + 12`, gắn nhãn "Vế phải"; câu chuyện có đủ vế phải, hoặc dùng vế phải là số cho ví dụ đời sống rồi thêm ví dụ vế phải là biểu thức.

### 8. "Làm ngược từng bước" không được giải thích ở chữ hay ở hình

- Vị trí: `$.sections[12].blocks[0].children[0].text`, `$.sections[12].recap.caption`, `$.cards[13].recap.caption`; hai dòng cuối của `tim-so-mua-but`
- Nguồn: tr.102 (`p102.png`)
- Vấn đề: Câu quy tắc duy nhất của section không nói ngược phép nào; hình chỉ ghi "3x = 20 − 5 = 15", "x = 15 : 3 = 5", không nhãn vì sao trừ, vì sao chia.
- Sửa: "Muốn tìm số chưa biết, tính vế phải trước. Rồi bỏ phép cộng bằng phép trừ, bỏ phép nhân bằng phép chia." Hình gắn nhãn "bỏ + 5: trừ 5", "bỏ 3 ·: chia 3". Recap đổi theo.

### 9. Section `tim-so-chua-biet` không có màn cùng làm

- Vị trí: `$.sections[12].blocks` (một khối)
- Nguồn: tr.26, tr.102
- Vấn đề: Ý mới (tìm x) đi thẳng từ hình mẫu sang câu kiểm tra, trái luật "Mẫu → cùng làm → tự làm" của `.claude/skills/lesson-author/SKILL.md`; section còn chỗ cho một màn.
- Sửa: Thêm màn cùng làm, số khác đề (ví dụ 2x + 3 = 11): chọn vế phải, rồi chọn phép làm ngược ở từng dòng.

### 10. Ví dụ mẫu, câu kiểm tra và câu luyện tập tìm x cùng ra x = 5

- Vị trí: `tim-so-mua-but` (3x + 5 = 20); `$.exercises[62]` (`tim-x-kiem-tra`, 3x + 4 = 19); `$.exercises[63]` (`tim-x-1`)
- Nguồn: —
- Vấn đề: Ba màn liền nhau cùng đáp án 5, câu kiểm tra cùng hệ số 3 với ví dụ; trẻ chép 5 vẫn đúng.
- Sửa: Câu kiểm tra `2x + 7 = 15` (x = 4), `tim-x-1` `4x + 8 = 2 \cdot 3^{2} + 14` (x = 6); sửa `accept`, `bank` và hình giải theo.

### 11. Hình lời giải câu kiểm tra tìm x tính một biểu thức ngoặc lạ, không có x

- Vị trí: `$.exercises[62].hints.solutionVisualId` (`tim-x-kiem-tra-giai`, spec `steps` source `(19-4):3`)
- Nguồn: tr.102 (`p102.png`)
- Vấn đề: Trẻ thấy "(19 − 4) : 3 = 5", khác cách "3x = 19 − 4 = 15; x = 15 : 3 = 5" vừa học, không có chữ x.
- Sửa: Dùng spec `findx` như các câu tìm x khác, chạy tới "x = 15 : 3 = 5".

### 12. Câu kho ôn `tinh-day-du-3` còn 2⁵ và bảy phép tính

- Vị trí: `$.exercises[59]` (`tinh-day-du-3`, `3 · 2^5 + 4 · 5 − 27 · 2 + 9`)
- Nguồn: tr.26 bài 1.63c (`p26.png`)
- Vấn đề: Vòng 1 Nên sửa 19 chỉ chuyển biểu thức từ câu luyện tập sang kho ôn; luật "Số nhỏ" áp cả câu ôn.
- Sửa: Ví dụ `3 \cdot 3^{2} + 4 \cdot 5 - 6 \cdot 2 + 9` = 44; sửa `check.expr` và hai visual `tinh-day-du-3-*`.

### 13. Câu luyện tập `tinh-day-du-1` cùng dạng và cùng kết quả 32 với ví dụ mẫu

- Vị trí: `$.exercises[57]` (3 · 2³ + 4 · 5 − 2 · 6 = 32); visual `tong-hop-tung-buoc` (2 · 3² + 4 · 5 − 6 = 32)
- Nguồn: —
- Vấn đề: Cùng khung, cùng 32; trẻ nhớ số từ màn mẫu là đúng.
- Sửa: Ví dụ `3 \cdot 2^{3} + 4 \cdot 5 - 3 \cdot 6` = 26; sửa `check.expr`, `tinh-day-du-1-giai`.

### 14. `overview.summary` dài ba câu và bỏ sót biểu thức chứa chữ

- Vị trí: `$.overview.summary`
- Nguồn: —
- Vấn đề: `.claude/skills/lesson-author/SKILL.md` cho môn Toán 1–2 câu; summary không nhắc biểu thức chứa chữ trong khi `goals[2]` có.
- Sửa: "Bài này dạy thứ tự làm các phép tính: cộng trừ, nhân chia, ngoặc và luỹ thừa. Bạn dùng thứ tự đó để tính biểu thức có chữ và tìm số chưa biết."

### 15. Note "2x không phải hai mươi ba" không có hình minh hoạ, lại dùng số của câu kiểm tra

- Vị trí: `$.sections[10].blocks[1].children[0].text`, `$.sections[10].blocks[1].children[1]` (visual `chu-bo-dau-nhan`: ab); `$.exercises[47]` (`thay-chu-2x-1`: 2x + 1, x = 3)
- Nguồn: tr.24 (`p24.png`)
- Vấn đề: Ảnh `115-s11-02-block.png`: note nói về 2x khi x = 3, hình dưới là ab với 5 và 7; lỗi "ghép thành 23" chỉ có chữ, viết số bằng chữ, và trùng số câu kiểm tra.
- Sửa: Note: "Giữa số và chữ, hay giữa hai chữ, dấu nhân thường được bỏ đi: 2x là 2 · x." Thêm hình so sánh đúng/sai số khác đề ("5x khi x = 4: 5 · 4 = 20 ✓, 54 ×"), giữ `chu-bo-dau-nhan` cho ab.

### 16. Section `bieu-thuc-chu` vẫn không có màn cùng làm

- Vị trí: `$.sections[10].blocks` (hai note và hình từng bước `chu-tung-buoc`, không có khối `try`)
- Nguồn: tr.24 (`p24.png`)
- Vấn đề: Mọi section dạy cách tính khác có màn trẻ thao tác có hướng dẫn; ý mới "thay chữ bằng số" đi thẳng từ hình mẫu sang câu kiểm tra, trái luật "Mẫu → cùng làm → tự làm". Vòng 1 Nên sửa 25 chưa sửa.
- Sửa: Thêm một màn cùng làm, số khác đề và khác câu kiểm tra (ví dụ `3x + 1` với x = 2).

## Góp ý

### 1. Hai concept của bài cùng màu violet, trùng màu "số mũ" của glossary

- Vị trí: `$.concepts[5]` (`concept.bang-nhan`), `$.concepts[6]` (`concept.nhan-hai-chu-so`); `content/glossary/math.json` ("số mũ": violet)
- Nguồn: —
- Vấn đề: Hai khái niệm khác nhau cùng một màu, và màu đó đã có nghĩa "số mũ" trong bài có section luỹ thừa. Màu concept của card hiện chưa hiện cho trẻ (chỉ tên dùng trong `src/progress/parent-report.ts`) nên chưa gây nhầm.
- Sửa: Hai màu khác nhau, khác mọi màu đã có nghĩa trong glossary (blue, violet, pink, amber, teal, sky, lime).

### 2. "tính thì theo quy tắc của bài" chưa nói quy tắc nào

- Vị trí: `$.sections[1].blocks[1].children[0].text`
- Nguồn: tr.24
- Vấn đề: Tới đây trẻ mới học "nhân trước, cộng sau"; "quy tắc của bài" mơ hồ.
- Sửa: "Đọc theo thứ tự đó, còn tính thì nhân trước, cộng sau như phần trước."

### 3. Hình gợi ý 15 · 4 trùng câu kho ôn `dien-tach-chuc`

- Vị trí: spec `nhan-25-3-goi-y`, `chon-tach-chuc-goi-y` (`split 15 · 4`) so với `$.exercises[21]`
- Nguồn: —
- Vấn đề: Hình hiện 10 · 4 = 40, đúng ô b1 của câu kho ôn cùng card.
- Sửa: Dùng số khác cho hai hình gợi ý (ví dụ 16 · 3).

### 4. Vòng đen chọn đè lên chữ số hai bên (việc của người làm visual)

- Vị trí: visual `huong-dan-cham-phep-tinh` (`$.sections[2].blocks[2].children[1]`); vòng chọn của câu chạm (ảnh `033-s3-03-block.png`, `ipad/076-s7-05-exercise-chon-phep-hon-hop-correct.png`)
- Nguồn: —
- Vấn đề: Vòng quanh dấu cắt vào hai số bên cạnh; màn này dạy thao tác nên hình nên sạch (vòng 1 Góp ý 5).
- Sửa: Báo người làm visual thu nhỏ vòng hoặc giãn khoảng cách số và dấu.

### 5. Dòng kết quả của hình bảng nhân, tách chục vẫn tô nền vàng; `nhan-chia-on` vẫn là gạch ngang

- Vị trí: visual `nhan-chia-on`, `chia-hoi-nguoc`, `nhan-hai-chu-so`, `nhan-*-giai`, `chia-63-9-giai`
- Nguồn: —
- Vấn đề: Cả bài dùng chữ hổ phách gạch chân cho "Kết quả"; các hình này dùng nền vàng. `nhan-chia-on` là 42 gạch ngang trong khi caption nói hàng ghế (vòng 1 Góp ý 8).
- Sửa: Tô kết quả theo kiểu concept `ket-qua`; vẽ ghế hay hình người nhỏ.

### 6. Ba câu chuyện mở đầu không nói kết quả là gì

- Vị trí: `$.sections[5].blocks[0].children[1].caption` (cam), `$.sections[6].blocks[0].children[1].caption` (mua bút), `$.sections[7].blocks[0].children[1].caption` (mua vở)
- Nguồn: —
- Vấn đề: Hình ra 12, 32, 36 nhưng caption chỉ kể đề; `tong-hop-mua-but` đã nói kết.
- Sửa: Thêm vế kết ("mỗi bạn 12 quả", "còn thừa 32 nghìn đồng", "hết 36 nghìn đồng").

### 7. Note đầu section ngoặc lồng thêm cách đọc ngoặc không có trên hình và trang nguồn

- Vị trí: `$.sections[8].blocks[0].children[0].text`
- Nguồn: tr.24, tr.26 không có cách đọc
- Vấn đề: Note hai ý; hình `bang-ngoac` chỉ minh hoạ ý đầu, không câu nào dùng cách đọc.
- Sửa: Bỏ câu đọc, hoặc đưa vào caption của hình.

### 8. Câu kiểm tra `chon-phep-nhan-chia` chỉ khác màn cùng làm một số

- Vị trí: visual `nhan-chia-tu-lam` (`5·6:3`), `$.exercises[22]` (`4·6:3`)
- Nguồn: —
- Vấn đề: Trẻ vừa chạm phép nhân của 5 · 6 : 3, câu kiểm tra cùng khung.
- Sửa: Ví dụ câu kiểm tra `3·8:4`.

### 9. Vài biểu thức gần trùng hoặc có kết quả trùng số trong đề

- Vị trí: `ngoac-long-hop` (`{2+3·[4+(10−6)]}`) và `$.exercises[38]` (`2+[3·(10−6)−4]:4`); recap `ngoac-long-tom-tat` (`6 − 3 = 3`); `$.exercises[34]` (`sap-buoc-ngoac`, `9 − 4 = 5` rồi `5 · 5`, vòng 1 Góp ý 14)
- Nguồn: —
- Vấn đề: Câu kho ôn dùng lại số màn quy tắc; kết quả trùng số trong đề khó theo dõi.
- Sửa: Kho ôn `3+[2·(9−5)−2]:2`, recap `{2+[7−(1+2)]}`, `sap-buoc-ngoac` `6·(9−4)+6`.

### 10. Hình gợi ý của câu chạm cùng cấu trúc với đề; highlight tô cả biểu thức

- Vị trí: `hintVisualId` của `$.exercises[22]`, `[26]`, `[31]`, `[36]` (ví dụ `chon-phep-ngoac-long-goi-y` `7+[2·(9−6)]` so với đề `5+[3·(8−6)]`); `hints.highlight` của `$.exercises[23]`, `[27]`, `[32]`, `[37]`, `[38]`, `[41]` (tô cả `bt`)
- Nguồn: —
- Vấn đề: Phép làm trước ở đúng vị trí vùng đáp án, trẻ chạm theo vị trí thay vì theo quy tắc (vòng 1 Góp ý 10, 13).
- Sửa: Biểu thức gợi ý có phép làm trước ở vị trí khác đề (`[2·(9−6)]+7`, `(1+5)·4+7`, `9·2+4−5`); câu chỉ có nhân, chia giữ nguyên.

### 11. Hình gợi ý tìm x dùng đẳng thức không có nghiệm tự nhiên

- Vị trí: `$.exercises[63].hints.hintVisualId` (`tim-x-1-goi-y`: 4x = 14); `$.exercises[64].hints.hintVisualId` (`tim-x-2-goi-y`: 4x = 15)
- Nguồn: tr.26 bài 1.66 ("Tìm số tự nhiên x")
- Vấn đề: Trẻ tính tiếp theo hình gặp 14 : 4, 15 : 4 không chia hết, dễ nghĩ mình sai.
- Sửa: `tim-x-1-goi-y`: 4x + 4 = 3 · 2² + 8 (x = 4); `tim-x-2-goi-y`: 2x + 1 = 4 · 2² + 9 : 3 (x = 9).

### 12. Mục tiêu dùng từ "đẳng thức" mà bài không dùng ở đâu khác

- Vị trí: `$.overview.goals[3]`
- Nguồn: —
- Vấn đề: Trẻ chỉ gặp "vế phải", "dấu ="; "đẳng thức" không có trong glossary.
- Sửa: "tìm x trong một phép tính có dấu =".

### 13. Câu kiểm tra chạm luỹ thừa cùng khung với màn cùng làm và hình gợi ý

- Vị trí: `$.exercises[42]` (`5+2·3^2`); visual `luy-thua-tu-lam` (`3+2·2^3`); `chon-phep-luy-thua-goi-y` (`6+3·2^2`)
- Nguồn: —
- Vấn đề: Luỹ thừa luôn ở ô cuối (ảnh `107`, `108`); chạm ô cuối là đúng.
- Sửa: Đặt luỹ thừa ở giữa trong câu kiểm tra, ví dụ `20 - 3^{2} : 3`.

### 14. Hình gợi ý của câu "Bốn bạn làm bước đầu tiên" trôi mất dòng đầu; đề hỏi "Bạn nào" mà lựa chọn không có tên

- Vị trí: `hints.hintVisualId` và `prompt[0].text` của `$.exercises[53]`–`[56]`
- Nguồn: tr.25 (`p25.png`)
- Vấn đề: `steps.tsx` chỉ hiện một cửa sổ dòng, khung cuối mất dòng đầu (bước câu hỏi đang hỏi). Lựa chọn là bốn dòng biểu thức, không có "bạn" nào để chọn (ảnh `131`).
- Sửa: Hình gợi ý dừng ở dòng thứ hai hoặc giữ cố định dòng đầu (báo người làm visual). Đề: "Bốn bạn làm bước đầu tiên của biểu thức này. Chọn dòng viết đúng."

### 15. Màn mẫu bước đầu không có trường hợp luỹ thừa

- Vị trí: `$.sections[11].blocks[3]` (visual `tong-hop-dong-viet-lai`, `5+3·2`)
- Nguồn: tr.25, Ví dụ 4 (`p25.png`)
- Vấn đề: Mọi câu "Bốn bạn làm bước đầu tiên" xoay quanh luỹ thừa, màn mẫu chỉ có cộng và nhân (vòng 1 Nên sửa 16, phần còn lại).
- Sửa: Ví dụ `4 + 3 \cdot 2^{2}` = 16, cột sai "Sai: làm 3 · 2 trước" (4 + 6² = 40).

### 16. Nhãn đọc của hình mở bài viết "hóa đơn", bài viết "hoá đơn"

- Vị trí: `statics.tsx`, `HoaDonHaiBan` (`label="Hai bạn tính cùng một hóa đơn"`) so với `$.overview.hook.text`, `$.sections[0].blocks[0].caption`
- Nguồn: —
- Vấn đề: Nhãn trình đọc màn hình dùng cách bỏ dấu khác phần còn lại của bài ("hoá", "luỹ thừa").
- Sửa: "hoá đơn".

### 17. Ngân hàng số của `dien-chia-nhan` có một chip "8" cho hai ô cùng đáp án 8

- Vị trí: `$.exercises[15].bank`
- Nguồn: —
- Vấn đề: App cho dùng lại chip nên câu làm được, nhưng trẻ dễ nghĩ mỗi chip chỉ dùng một lần (vòng 1 Góp ý 7, chưa đổi).
- Sửa: Để hai chip "8" trong `bank`.

### 18. Bàn phím số hiện phím "mũ" ở câu không cần (việc của app)

- Vị trí: `$.exercises[12]`–`[14]`
- Nguồn: —
- Vấn đề: Phím "mũ" gây phân tâm ở câu bảng nhân, chia (vòng 1 Góp ý 9).
- Sửa: Báo người làm app chỉ hiện phím "mũ" khi đáp án là luỹ thừa.
