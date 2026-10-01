# Review: Phép cộng và phép trừ số nguyên (`phep-cong-phep-tru-so-nguyen`)

- Bài: `content/math/kntt/phep-cong-phep-tru-so-nguyen/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/phep-cong-phep-tru-so-nguyen/` - sbt-p50, sbt-p51, sbt-p52, sbt-p111
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi vòng 1-2 hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-cong-phep-tru-so-nguyen/`
- Kết luận: Chưa đạt: còn 8 lỗi Nghiêm trọng
- Bản đã review: `803b8a1ebb0670a1b24269820b2bd54781221160d0a22aa388c3cd40f5c61ff4` (`pnpm content:diff` so với bản này)

Ba reviewer đã tự giải mọi exercise trước khi đọc `answer`: mọi đáp án, `check`, `explain`, `wrong` và hàng hình (`catalog.ts`) đúng số; không câu nào có hai đáp án đúng. Bảng thử mẹo nằm trong `.shots/review/phep-cong-phep-tru-so-nguyen/nhom-2.md` (`tip.dau-truoc`) và `nhom-3.md` (`tip.hai-dau-lien-nhau`, `tip.ghep-so-doi`).

## Nghiêm trọng

### 1. Câu quy tắc phần 1 chỉ bỏ chữ "có" so với câu sách (LL-08)

- Vị trí: `$.sections[0].blocks[1].children[0].text`, `$.sections[0].recap.caption`, `$.cards[0].recap.caption` (`section.phan-dau`, `card.phan-dau`) - LL-08
- Nguồn: tr.50, `sbt-p50.png`, Kiến thức cần nhớ ý 1
- Vấn đề: "Mỗi số nguyên gồm hai phần: phần dấu và phần số tự nhiên." trùng câu sách, chỉ bỏ "có". Bài không có lớp chữ `p*.txt` nên `[textbook-copy]` không chạy. Câu lặp ở recap section và recap card.
- Sửa: "Ta tách một số nguyên thành hai phần: phần dấu đứng trước và phần số tự nhiên đứng sau. Số dương có dấu +, nhưng ta thường không viết dấu này." (câu 2 giải luôn Nên sửa 2). Recap section và recap card lặp nguyên văn.

### 2. Ví dụ mở đầu phần 1 dùng đúng ví dụ "Chẳng hạn" của sách: −3 và 5 (LL-08)

- Vị trí: `$.sections[0].blocks[0].children[0].text` ("Số −3 gồm dấu − và số 3."), hình `visual.dau-va-so` (hàng −3 "dấu −, số 3" và 5 "dấu +, số 5") (`section.phan-dau`) - LL-08
- Nguồn: tr.50, `sbt-p50.png`, ý 1 (câu "Chẳng hạn")
- Vấn đề: cả hai số và cách tách đều là ví dụ kèm lời của sách. Ở `tap-hop-cac-so-nguyen` vòng 1, dùng đúng cặp số ví dụ của sách đã tính là Nghiêm trọng.
- Sửa: đổi sang số chưa dùng trong card `phan-dau`, vd "Nhiệt kế chỉ −2 độ, tức là 2 độ dưới 0. Số −2 gồm dấu − và phần số tự nhiên 2." và hình `dau-va-so` có hai hàng −2, 9. Không dùng −4, −6, −8, −14 (đã có ở câu của card).

### 3. Quy tắc số đối không nói hai số đối nhau có cùng phần số tự nhiên; khái niệm có ba cách nói (LL-05)

- Vị trí: `$.sections[1].blocks[0..2]` (note 1, note quy tắc, note 3), `$.sections[1].recap.caption`, `$.cards[1].recap.caption`; `explain.text` của `ex.so-doi-cua-am-9`, `ex.so-doi-cua-23`, `ex.noi-so-doi`; câu điền `ex.dien-so-doi` (`section.so-doi`, `card.so-doi`) - LL-05
- Nguồn: tr.50 `sbt-p50.png` ý 2; tr.111 `sbt-p111.png` lời giải 3.9 ("Hai số đối nhau thì có phần số tự nhiên giống nhau")
- Vấn đề: câu quy tắc và hai recap chỉ nói "Số đối của số dương là số âm, và số đối của số âm là số dương": đúng nhưng không cho biết số âm nào, nên bé chỉ nhớ recap (thứ duy nhất hiện ở phiên ôn card) có thể trả lời số đối của 23 là −20. Ý quyết định "cùng phần số tự nhiên" chỉ nằm trong `explain`. Note 1 lại định nghĩa bằng "cách gốc O bằng nhau" (cách nói của quy tắc Bài 13), nên một khái niệm có ba cách nói. Note 3 "Vì số đối của số âm là số dương nên −(−5) = 5" cũng không cho lý do ra đúng 5.
- Sửa: câu quy tắc "Hai số đối nhau có cùng phần số tự nhiên nhưng khác dấu. Riêng số đối của 0 là 0." Note 1: "5 và −5 cách gốc O bằng nhau, nên có cùng phần số tự nhiên 5." Note 3: "−5 có phần số tự nhiên là 5, nên số đối của nó là 5: −(−5) = 5." Recap section, recap card lặp nguyên văn câu quy tắc mới; `dien-so-doi` đổi theo câu mới.

### 4. Dấu khái niệm hình thập (sky) đứng trước nhãn đọc thành dấu cộng (LL-21)

- Vị trí: mọi nhãn `tag` màu `OPPOSITE` (sky) trong `src/visuals/math/phep-cong-phep-tru-so-nguyen/catalog.ts`: `so-doi-vi-du` (màn quy tắc và recap phần 2, recap card `so-doi`), `tong-doi-vi-du`, `tong-doi-va-0` (phần 5), `PAIR_ROWS` "nhóm cặp số đối nhau" (`ghep-so-doi`, `ghep-so-doi-xong`, phần 10), `goi-y-ghep`, `gia-tri-x-am3` "trừ là cộng với số đối"; cùng cơ chế với nhãn màu `ZERO` (slate, dấu hình gạch ngang) "đứng yên", "cộng với 0" ở `cong-voi-0-vi-du`, `tong-doi-va-0` - LL-21
- Nguồn: —
- Vấn đề: theo `CONCEPT_SHAPES` (`src/visuals/shared/concept.ts`), sky là hình thập, slate là gạch ngang. Nhãn hiện thành "✚ số đối của −5", "✚ số đối của −18" (ảnh walk `phone/021-s2-02-block.png`, `phone/027-s2-06-recap.png`), và gạch ngang trước "cộng với 0" đọc thành "− cộng với 0". Bài này dạy cộng, trừ và "cộng với số đối", nên bé dễ đọc nhãn thành phép tính. Đúng lỗi `so-nguyen-to` vòng 1.
- Sửa: trong hình dạng `rows`/`lines` của bài, nhãn màu sky và slate không đặt dấu hình ngay trước chữ (bỏ dấu, chỉ giữ màu chữ hay viền, hoặc dời dấu nhỏ lên góc và thêm `legend`); đọc to lại từng hàng sau khi sửa.

### 5. Hình gợi ý nấc 2 của `tinh-am6-cong4` làm nổi đúng đáp án −2 (LL-02)

- Vị trí: `$.exercises[10].hints.hintVisualId` = `visual.goi-y-am2-cong6` (`ex.tinh-am6-cong4`, section `cong-so-duong`) - LL-02
- Nguồn: —
- Vấn đề: đề (−6) + 4 = −2. Hình dùng số khác đề, (−2) + 6, nhưng điểm xuất phát −2 là chấm xanh to và số −2 dưới trục được tô (walk `phone/038-s3-05-exercise-tinh-am6-cong4-wrong2.png`). Sai một lần là bé thấy đáp án được làm nổi. Theo LL-02 (`quan-he-chia-het-va-tinh-chat` vòng 1), số được làm nổi trong hình cũng không được là đáp án.
- Sửa: dùng số của đề và dừng trước kết quả: `walk(-6, [4], SUM, "hint")` (điểm cuối ẩn). Nếu giữ số khác đề thì chọn bộ không chạm −2, vd `walk(-5, [2], SUM, "hint")`.

### 6. Ba câu quy tắc phần 5, 6, 7 chỉ bỏ vài chữ so với Kiến thức cần nhớ mục 3 (LL-08)

- Vị trí: câu quy tắc, recap section, recap card của `section.tong-so-doi` (`$.sections[4].blocks[1]`, "Tổng của hai số đối nhau luôn bằng 0."), `section.cung-dau` (`$.sections[5].blocks[1]`), `section.khac-dau` (`$.sections[6].blocks[1]`); `$.cards[4..6].recap.caption` - LL-08
- Nguồn: tr.50, `sbt-p50.png`, mục 3, gạch đầu dòng 1, 2, 3
- Vấn đề: câu 1 chỉ bỏ "nguyên"; câu 2 giữ khung "Muốn cộng hai số … ta cộng … rồi đặt dấu − trước kết quả"; câu 3 giữ "Muốn cộng hai số … khác dấu không đối nhau, ta" và "đặt trước hiệu … dấu của số có phần số tự nhiên lớn hơn". Câu 3 còn dễ đọc ngắt thành "đặt trước | hiệu dấu" (cụm vô nghĩa).
- Sửa (đã thử trên 7 + (−4), 3 + (−8), (−5) + 2, (−3) + (−4), 5 + (−5)); đổi cùng lúc note, recap section, recap card:
  - `tong-so-doi`: "Hai số đối nhau cộng lại thì được 0."
  - `cung-dau`: "Hai số âm cộng nhau: lấy hai phần số tự nhiên cộng lại, rồi viết dấu − ở trước."
  - `khac-dau`: "Cộng hai số khác dấu mà không đối nhau: lấy phần số tự nhiên lớn trừ phần số tự nhiên nhỏ. Số nào có phần số tự nhiên lớn hơn thì tổng mang dấu của số đó."

### 7. Mẹo `dau-truoc` chỉ ghi điều kiện ở tiêu đề, ra sai ở phép cộng cùng dấu và phép trừ (LL-24)

- Vị trí: `$.sections[6].blocks[3].text` (`tip.dau-truoc`, section `khac-dau`) - LL-24
- Nguồn: tr.50, `sbt-p50.png`, mục 3 và 4
- Vấn đề: `text` "xem số nào ở xa 0 hơn, kết quả mang dấu của số đó, rồi lấy phần lớn trừ phần nhỏ" không nói chỉ dùng cho phép cộng hai số khác dấu (điều kiện chỉ ở `title`). Áp từng chữ: (−5) + (−2) ra −3 (đúng nhiễu b của `tinh-am5-am2`), 3 − 8 ra 5, (−2) − 5 ra 3, 4 − (−3) ra 1, (−3) − (−5) ra −2 (bảng trong `nhom-2.md`). Trang "Mẹo hay" gom mẹo ra khỏi section nên câu phải tự nói phạm vi; đúng kiểu `tip.boi-so-lon`.
- Sửa: `text` "Khi cộng hai số khác dấu, xem số nào ở xa gốc O hơn: tổng mang dấu của số đó. Rồi lấy phần số tự nhiên lớn trừ phần nhỏ." Nói thêm về phép trừ trong một câu khác của section (mẹo tối đa 2 câu), vd ở bảng thử: phép trừ đổi thành cộng với số đối trước rồi mới dùng mẹo.

### 8. Câu quy tắc phần 10 chỉ đổi hai cụm của câu sách (LL-08)

- Vị trí: `$.sections[9].blocks[1].children[0].text`, `$.sections[9].recap.caption`, `$.cards[9].recap.caption` (`section.tinh-chat`, `card.tinh-chat`) - LL-08
- Nguồn: tr.50, `sbt-p50.png`, ý 6, gạch đầu dòng 2
- Vấn đề: "Trong một tổng, ta có thể đổi chỗ các số hạng và nhóm chúng một cách tuỳ ý." giữ "Trong một tổng", "ta có thể", "nhóm", "một cách tuỳ ý", chỉ đổi "đổi vị trí" thành "đổi chỗ".
- Sửa: "Đổi chỗ các số hạng, hay nhóm vài số hạng để cộng trước, thì tổng không đổi." (cùng cách nói với Bài 2 `phep-cong-phep-tru`). Sửa cùng lúc note, recap section, recap card.

## Nên sửa

### 1. Phần số tự nhiên có hai tên trong cùng màn: "phần số tự nhiên" ở câu quy tắc, "số 3", "số 12" ở hình

- Vị trí: `$.sections[0].blocks[0].children[0].text` ("dấu − và số 3"); nhãn hình `dau-va-so`, `dau-va-so-vi-du` ("dấu +, số 12"), hình này là recap của `section.phan-dau` và `card.phan-dau`; cách gọi tắt "phần 7", "phần 5" ở `khac-dau-vi-du`, note `$.sections[6].blocks[2]`, `explain` của `ex.tinh-7-cong-am10`, `ex.tinh-am9-cong4`, `ex.tinh-am6-cong15` - LL-05
- Nguồn: tr.50, ý 1
- Vấn đề: recap hiện caption "phần số tự nhiên" ngay trên hình ghi "số 12": một khái niệm hai tên trên cùng màn ôn. Các quy tắc cộng ở sau đều dựa vào thuật ngữ này.
- Sửa: nhãn hình ghi "dấu +, phần số tự nhiên 12" (hay "dấu +, phần số 12" nếu chật, rồi dùng đúng một cách gọi tắt đó trong cả bài); note 1 viết như đề xuất ở Nghiêm trọng 2.

### 2. Dấu + của số dương chỉ được dạy trong nhãn hình mà câu và recap dùng tới

- Vị trí: `$.sections[0].blocks[0..1]`; `explain` của `ex.chon-dau-tru` ("7 và 25 là số dương nên có dấu +"), `wrong` c của `ex.phan-dau-cua-so`; hình recap `dau-doi-song` của phần 12 viết "+35", "+4" (`section.phan-dau`, `section.bai-toan-thuc-te`)
- Nguồn: tr.50, ý 1 (số 5 có phần dấu "+")
- Vấn đề: không note nào nói số dương có dấu + nhưng thường không viết; ý này chỉ ở nhãn "dấu +, số 5". Câu kho ôn, lời giải và recap phần 12 (chỗ duy nhất của bài viết dấu + trước số) lại dựa vào nó.
- Sửa: thêm câu đó vào note quy tắc phần 1 (câu 2 của đề xuất ở Nghiêm trọng 1).

### 3. `sourceRef` sai trang ở hai section

- Vị trí: `$.sections[1].sourceRef`, `$.cards[1].sourceRef` (`so-doi`: ghi bài 3.10 ở tr.51); `$.sections[8].sourceRef`, `$.cards[8].sourceRef` (`tru-so-am`: trỏ Ví dụ 1, nơi không có phép trừ số âm)
- Nguồn: `sbt-p52.png` (3.10 ở đầu trang; 3.14 b) 6 591 − (−386)); `sbt-p51.png` (Ví dụ 1 chỉ có 140 − 234)
- Sửa: `so-doi`: "Sách bài tập tr.50 (kiến thức cần nhớ 2), tr.51 (bài 3.9), tr.52 (bài 3.10)". `tru-so-am`: "Sách bài tập tr.50 (kiến thức cần nhớ 2, 4), tr.52 (bài 3.14)".

### 4. Hình quy tắc số đối dùng −18, số và đáp án của bài 3.9

- Vị trí: hình `so-doi-vi-du`, hàng "−18 → 18" (`section.so-doi`) - LL-08
- Nguồn: `sbt-p51.png` bài 3.9; `sbt-p111.png` lời giải 3.9
- Sửa: đổi thành −16 → 16 (cập nhật `label` của hình).

### 5. Phần 2 không có ví dụ đời sống

- Vị trí: `$.sections[1].blocks` (`section.so-doi`) - LL-16
- Nguồn: —
- Vấn đề: section và các câu của nó chỉ có số trên trục, trái luật "Ví dụ đời sống ở mọi section Toán", dù phần 1 đã có chuyện nợ và có tiền.
- Sửa: thêm vào note 1 hay một câu luyện: "Có 5 nghìn đồng ghi 5, nợ 5 nghìn đồng ghi −5. Hai số này đối nhau."

### 6. Ba câu quy tắc đi trên trục số không nói đi từ đâu và đi bao nhiêu đơn vị

- Vị trí: câu quy tắc, recap section, recap card của `section.cong-so-duong` (`$.sections[2].blocks[1]`), `section.cong-so-am` (`$.sections[3].blocks[1]`), `section.tru-so-am` (`$.sections[8].blocks[1]`) - LL-10
- Nguồn: tr.50, ý 3, 4
- Vấn đề: hai câu phần 3, 4 nói "đi sang phải/trái bấy nhiêu đơn vị": "bấy nhiêu" không có số nào đứng trước để chỉ tới, với số âm bé không biết là 5 hay −5. Câu phần 9 "Trừ đi một số âm thì đi sang phải, giống cộng với số dương" không nói bao xa và "số dương" là số nào. Ở phiên ôn, recap card chỉ hiện các câu này. Ba câu nên cùng một khuôn và dùng "phần số tự nhiên" mà phần 1 vừa dạy.
- Sửa (mỗi câu 23 âm tiết):
  - `cong-so-duong`: "Cộng với một số dương thì từ số đầu đi sang phải, số đơn vị bằng phần số tự nhiên của số đó."
  - `cong-so-am`: "Cộng với một số âm thì từ số đầu đi sang trái, số đơn vị bằng phần số tự nhiên của số đó."
  - `tru-so-am`: "Trừ đi một số âm thì từ số đầu đi sang phải, số đơn vị bằng phần số tự nhiên của số âm."
  Recap section, recap card lặp nguyên văn.

### 7. Câu kho ôn phần 1-4 lặp số của hình quy tắc, màn cùng làm và câu cùng card

- Vị trí: `ex.chon-tong-bang-1` b (−4) + 4 (trùng hàng của `cong-duong-vi-du`); `ex.chon-tong-am` b 1 + (−4) (đúng màn cùng làm `cung-1-cong-am4`) và d (−3) + (−2) (cùng cặp với `ex.di-trai-tu-am2`); `ex.chon-so-am-doi` "số đối của 12" (hàng của `so-doi-vi-du`), "số đối của −9" (câu kiểm tra `so-doi-cua-am-9`), "số đối của −3" (`noi-so-doi`) - LL-07
- Nguồn: —
- Vấn đề: phiên ôn hỏi lại đúng phép tính bé vừa thấy kết quả.
- Sửa: (−5) + 5 thay (−4) + 4; 1 + (−6) thay 1 + (−4) (2 + (−5) đã ở màn mở đầu); (−4) + (−1) thay (−3) + (−2); `chon-so-am-doi` dùng 14, −7, 15, −10 (sửa `explain`).

### 8. Bảy câu chuyện mở đầu dừng ở phép tính, không có câu kết bằng lời

- Vị trí: note mở đầu `$.sections[2].blocks[0]` (nhiệt độ −3 ấm lên 5; cũng là `overview.hook`), `$.sections[3].blocks[0]` (thang máy), `$.sections[5].blocks[0]` (nợ 3 rồi nợ 4), `$.sections[6].blocks[0]` (được 7 chi 4), `$.sections[7].blocks[0]` (4 độ giảm 6), `$.sections[9].blocks[0]` (tiền của An, hình `ghep-so-doi` kết bằng nhãn "kết quả"), `$.sections[11].blocks[0]` (Sa Pa ban đêm) - LL-16
- Nguồn: —
- Vấn đề: luật "Câu chuyện mở đầu phải có kết trong cùng section". Kết quả chỉ hiện bằng chấm trên trục hay số trong hình, không câu nào trả lời câu hỏi của chuyện. Phần 5 và phần 9 đã làm đúng ("Vậy 4 + (−4) = 0", "Hà về 0").
- Sửa: thêm một câu kết ngay sau hình hay vào note quy tắc, vd "Vậy trưa nhiệt độ là 2 độ.", "Vậy thang máy tới tầng −3.", "Vậy (−3) + (−4) = −7: bạn nợ 7 nghìn đồng.", "Vậy An còn 3 nghìn đồng.", "Vậy chiều nhiệt độ là −2 độ."; nhãn cuối của `PAIR_ROWS` đổi thành "An còn 2 nghìn đồng"; Sa Pa "Vậy ban đêm nhiệt độ là −7 độ."

### 9. Chuyện thang máy dùng trước khi nói mặt đất là tầng 0

- Vị trí: `$.sections[3].blocks[0].children[0].text` (`section.cong-so-am`), `$.sections[11].blocks[3].children[0].text` (màn cùng làm), `$.exercises[51].prompt` (`ex.thang-may-tang-2`, câu kiểm tra phần 12) - LL-10
- Nguồn: —
- Vấn đề: nhiều toà nhà ở Việt Nam gọi mặt đất là tầng 1, tầng hầm là B1; khi đó từ tầng 2 xuống 6 tầng là B5, không có trong lựa chọn. Quy ước "mặt đất là tầng 0" chỉ nằm ở note phần 5, sau lần dùng đầu ở phần 4, và câu kiểm tra, phiên ôn không có nó.
- Sửa: thêm "Mặt đất là tầng 0, tầng hầm ghi bằng số âm." vào note phần 4, màn cùng làm phần 12 và đề `thang-may-tang-2` (thay câu ngoặc hiện có).

### 10. Lời giải của `chon-tong-am` không giải thích được lựa chọn d

- Vị trí: `$.exercises[16].explain.text` (`ex.chon-tong-am`)
- Nguồn: —
- Vấn đề: "Đi sang trái qua số 0 thì kết quả là số âm" không đúng với (−3) + (−2): điểm xuất phát đã ở bên trái 0 nên không đi qua 0.
- Sửa: "Đi sang trái mà dừng ở bên trái số 0 thì kết quả là số âm: 1 + (−4) = −3 và (−3) + (−2) = −5."

### 11. Phần 5 gộp hai quy tắc cần nhớ riêng

- Vị trí: `$.sections[4]` (`section.tong-so-doi`), hai note `rule: true` ở `blocks[1]`, `blocks[2]`, recap hai câu
- Nguồn: tr.50, mục 3 (gạch đầu dòng 2 và 4)
- Vấn đề: recap phải có hai câu mới đủ; câu luyện `so-cong-am9` chỉ luyện ý "tổng hai số đối bằng 0", ý "cộng với 0" chỉ có ở kho ôn `dien-tong-doi` và một nhiễu.
- Sửa: tách "Cộng với 0" thành section ngắn riêng (note quy tắc, hình `cong-voi-0-vi-du`, một câu kiểm tra, một câu luyện, recap), hoặc ghi lý do giữ chung vào `notebooks/backlogs/lesson-phep-cong-phep-tru-so-nguyen/task.md`.

### 12. Chuyện nợ của phần 6 nói "Nợ tất cả là (−3) + (−4)", âm hai lần

- Vị trí: `$.sections[5].blocks[0].children[0].text` (`section.cung-dau`) - LL-10
- Nguồn: —
- Vấn đề: tổng −7 đọc thành "nợ −7 nghìn đồng", nghĩa ngược là có tiền. Các câu khác của bài nói đúng khuôn "Số tiền của … là … (Số âm là nợ.)".
- Sửa: "Số tiền của bạn là (−3) + (−4) nghìn đồng. Số âm là nợ."

### 13. Câu kho ôn phần 6, 7 lặp bộ số của câu luyện, hình quy tắc, chuyện mở đầu

- Vị trí: `ex.xep-tong-khac-dau` s1 4 + (−9) (cùng bộ số câu luyện `tinh-am9-cong4`); `ex.chon-tong-duong` a (−8) + 3 = −5 (dòng 2 của `khac-dau-vi-du`, recap); `ex.noi-tong-cung-dau` l1 (−4) + (−3) = −7 (chuyện mở đầu, `cung-dau-vi-du`, recap) - LL-07
- Nguồn: —
- Sửa: `xep-tong-khac-dau` s1 thành 5 + (−9) (= −4, thứ tự vẫn duy nhất); `chon-tong-duong` a thành (−7) + 2 (sửa `wrong`); `noi-tong-cung-dau` l1 thành (−5) + (−1) (= −6, đổi r1, `explain`; kiểm không trùng l3 và r4).

### 14. Công thức dài bị ngắt dòng giữa ngoặc trên điện thoại

- Vị trí: `explain.tex` của `ex.tinh-am5-am2` (walk `phone/073-…-correct.png`: "−(5 +" / "2) = −7"), `ex.tinh-am8-am5` (`phone/075-…`), `ex.hung-no-tien`, `ex.tinh-9-am4-am9-3` (`phone/122-…`: "[(−4) +" / "3]"), `ex.tinh-am8-5-8-am3`, `ex.gia-tri-a-x-am4` (`phone/133-…`), `ex.tien-cua-nam` (`phone/146-…`); dòng `= [8 + (-8)] + [(-3) + 5]` của `PAIR_ROWS` (`phone/115-s10-02-block.png`, `123-s10-07-recap.png`) - LL-12
- Nguồn: —
- Vấn đề: số bị tách khỏi ngoặc ("2) = −7", "5]" đứng riêng như một số mới). Walk không đo ngắt dòng trong TeX; iPad hiện đủ một dòng.
- Sửa: viết các `explain.tex` từ ba vế trở lên bằng `\begin{gathered} … \\ … \end{gathered}` như hàm `steps` của `catalog.ts`, mỗi dòng tối đa hai dấu "="; `PAIR_ROWS` tách thành `= [8 + (-8)]` / `+ [(-3) + 5]`. Xem lại ảnh `phone/…-correct`.

### 15. Câu ôn `xep-tong-khac-dau` cần 4 phép cộng rồi mới sắp xếp

- Vị trí: `$.exercises[31]` (`ex.xep-tong-khac-dau`) - LL-18
- Nguồn: —
- Vấn đề: luật "Số nhỏ": câu luyện, câu ôn tối đa 2 phép tính nhẩm.
- Sửa: đổi thành `choice` "Tổng nào bé nhất?" với 4 tổng, hoặc giảm còn 3 tổng (cùng số mới của Nên sửa 13).

### 16. Câu kiểm tra phần 8 hỏi lại đúng phép tính của màn cùng làm ngay trước

- Vị trí: `$.exercises[32]` (`ex.chon-phep-tru-dung`, 1 − 4 = −3), so với `$.sections[7].blocks[2]` (`cung-1-tru-4`) và màn cùng làm phần 4 (1 + (−4) = −3) - LL-07
- Nguồn: —
- Vấn đề: bé chỉ cần nhớ số vừa thấy, câu kiểm tra không cho biết bé hiểu quy tắc chưa.
- Sửa: "Lúc 8 giờ nhiệt độ là 2 độ, đến 10 giờ giảm 5 độ." với lựa chọn 2 − 5 = −3 (đúng), 2 − 5 = 3, 2 + 5 = −3, 2 − 5 = −7; sửa `explain`.

### 17. "Giảm" được viết hai cách: câu quy tắc phần 12 bảo ghi số âm, các chỗ khác viết phép trừ

- Vị trí: câu quy tắc `$.sections[11].blocks[1].children[0].text` và recap phần 12; chuyện mở đầu phần 12 `$.sections[11].blocks[0]` ("(−4) − 3"); chuyện mở đầu phần 8 `$.sections[7].blocks[0]` ("4 − 6"); `ex.chon-phep-tru-dung`, `ex.nhiet-do-toi` ("Giảm 6 độ là trừ 6, cũng là cộng với −6") - LL-05
- Nguồn: tr.52 bài 3.16; tr.111 lời giải 3.16
- Vấn đề: quy tắc nói "giảm đi ghi bằng số âm" (cộng −3), còn chuyện ngay trước viết "− 3". Bé áp cả hai dễ viết (−4) − (−3) = −1, lỗi "trừ hai lần". Phát hiện của tổng hợp: lệch này có cả ở phần 8 và hai câu bài tập, không chỉ phần 12.
- Sửa: câu quy tắc nói cả hai cách là một: "Tăng lên và thu vào là cộng số dương. Giảm đi và chi ra là trừ, tức là cộng số âm." (recap lặp nguyên văn); chuyện phần 12 viết "nên nhiệt độ ban đêm là (−4) + (−3)". Phần 8 và hai câu bài tập giữ nguyên vì đã khớp câu mới.

### 18. Mẹo "Hai dấu đứng liền nhau" dễ đọc thành quy tắc dấu của hai số cùng dấu

- Vị trí: `$.sections[8].blocks[3]` (`tip.hai-dau-lien-nhau`)
- Nguồn: tr.50, ý 2, 4
- Vấn đề: mẹo đúng với mọi đầu vào (bảng trong `nhom-3.md`), nhưng "Hai dấu giống nhau thì thành dấu +" rất gần "hai số cùng dấu" của phần 6; bé chậm dễ áp cho (−3) + (−4) và ra 7, lỗi hay gặp nhất. Hai ví dụ `tex` đều bắt đầu bằng 6 nên không cho thấy dấu của kết quả vẫn phải tính.
- Sửa: `text` "Dấu cộng hay trừ đứng liền dấu − trong ngoặc thì gộp thành một dấu: giống nhau thành +, khác nhau thành −. Sau đó tính như thường."; đổi một dòng `tex` thành `(-3) + (-4) = (-3) - 4 = -7`.

### 19. Hình gợi ý của `tinh-2-tru-am6` không có phép trừ nên không chỉ chỗ dễ sai

- Vị trí: `$.exercises[38].hints.hintVisualId` (`ex.tinh-2-tru-am6`, hình `goi-y-3-tru-am2`) - LL-02
- Nguồn: —
- Vấn đề: hình chỉ vẽ "bắt đầu ở 3, sang phải 2", không có 3 − (−2) hay 3 + 2. Lỗi hay gặp ở câu này là đi sang trái; hình không cho thấy vì sao "trừ −2" thành "sang phải 2". Hình không lộ kết quả.
- Sửa: thêm dòng phép tính trên trục, vd "3 − (−2) = 3 + 2" với nhãn "trừ −2 là sang phải 2", dừng trước "= 5".

### 20. Câu kho ôn `tinh-am8-5-8-am3` trùng bộ số và kết quả của chuyện mở đầu và recap phần 10

- Vị trí: `$.exercises[43]` (`ex.tinh-am8-5-8-am3`); hình `ghep-so-doi`, `ghep-so-doi-xong` (`PAIR_ROWS`) - LL-07
- Nguồn: —
- Vấn đề: bốn số 8, −3, −8, 5 và kết quả 2 là đúng ví dụ mà recap card đang hiện.
- Sửa: (−7) + 4 + 7 + (−1) = 3 (cập nhật `check.expr`, `answer`, `explain`, id).

### 21. Câu kiểm tra và câu kho ôn phần 10 dùng lại cặp 6 và −6 của mẹo ngay trước

- Vị trí: `$.exercises[41]` (`ex.chon-cap-doi-trong-tong`), `$.exercises[44]` (`ex.dien-ghep-tong`), so với `tip.ghep-so-doi` (6 + (−4) + (−6)) và hình `goi-y-ghep` (6 + (−2) + (−6) + 1) - LL-07
- Nguồn: —
- Vấn đề: bé chọn được theo trí nhớ mặt số, không cần tìm cặp đối.
- Sửa: câu kiểm tra 7 + (−5) + (−7) + 2, đáp án "7 và (−7)"; `dien-ghep-tong` (−9) + 5 + 9 + (−2) = 0 + 3.

### 22. Mẹo "Tính tổng nhiều số" thiếu điều kiện có cặp số đối

- Vị trí: `$.sections[9].blocks[2]` (`tip.ghep-so-doi`); câu bị ảnh hưởng `$.exercises[45]` (`ex.chon-tong-bang-0-ba-so`) - LL-24
- Nguồn: tr.51 Ví dụ 2; tr.111 lời giải 3.18, 3.19
- Vấn đề: `title` nói cho mọi tổng nhiều số, `text` chỉ dùng được khi có cặp đối. Ở `chon-tong-bang-0-ba-so`, hai đáp án đúng không có cặp đối, còn nhiễu (−4) + (−1) + 4 thì có, nên bé làm theo mẹo dễ chọn nhiễu và bỏ đáp án.
- Sửa: `title` "Tổng có hai số đối nhau"; `text` "Nếu trong tổng có hai số đối nhau, ghép chúng trước vì tổng của chúng bằng 0. Không có cặp nào thì cộng lần lượt từ trái sang phải."

### 23. Màn cùng làm phần 10 không luyện đổi chỗ hay nhóm số hạng

- Vị trí: `$.sections[9].blocks[3]` (hình `cung-5-tru-3-tru-4`) - LL-16
- Nguồn: —
- Vấn đề: màn chỉ bấm trái 3 rồi trái 4 để tính 5 + (−3) + (−4) từ trái sang phải, không có cặp đối, không đổi chỗ, không nhóm.
- Sửa: đổi sang tổng có cặp đối, vd 4 + (−2) + (−4): note "Cùng làm: ghép 4 với −4 trước, điểm về 0. Rồi bấm mũi tên trái 2 lần." (`tryWalk(0, -2, …)`).

### 24. Phần 11 không có ví dụ đời sống

- Vị trí: `$.sections[10]` (`section.gia-tri-bieu-thuc`) và các câu của card (`$.exercises[46..50]`) - LL-16
- Nguồn: —
- Sửa: thêm một câu kho ôn "Trưa nhiệt độ là x độ. Chiều giảm 4 độ, tối giảm thêm 6 độ, nên tối là x + (−4) + (−6) độ. Trưa 7 độ thì tối bao nhiêu độ?" (đáp án −3).

### 25. Câu ở phần sau lặp đúng phép tính của câu luyện, câu kiểm tra phần trước

- Vị trí: `ex.dien-bang-x-y` (x = −6, y = 4 cho (−6) + 4 = −2, đúng câu luyện `tinh-am6-cong4` phần 3); `ex.thang-may-tang-2` (2 + (−6) = −4, đúng câu luyện `tinh-2-cong-am6` phần 4); `ex.chon-tinh-huong-no` c (nợ 5 rồi nợ 2: (−5) + (−2), đúng câu kiểm tra `tinh-am5-am2` phần 6) - LL-07
- Nguồn: —
- Vấn đề: phát hiện của tổng hợp (khác card nên reviewer từng nhóm không thấy). Bé gặp lại phép tính đã biết kết quả nên câu không đo được việc áp quy tắc.
- Sửa: `dien-bang-x-y` x = −7, y = 2 (x + y = −5, x − y = −9, đổi ngân hàng từ); `thang-may-tang-2` "tầng 1 đi xuống 5 tầng" (đáp án −4, nhiễu 4, −6, 6); `chon-tinh-huong-no` c "nợ 6 nghìn đồng rồi nợ thêm 1 nghìn đồng" (sửa `explain`).

### 26. Màu của kết quả và màu xanh dương mang hai nghĩa giữa hình và lời giải

- Vị trí: hình đi trên trục (`walk`, điểm kết quả màu `SUM` amber, phép trừ màu `DIFFERENCE` teal) so với `explain.tex` của `ex.nhiet-do-am-ap-len`, `ex.tinh-am6-cong4`, `ex.no-tien-an`, `ex.tinh-2-cong-am6`… (kết quả tô theo dấu pink/lime, số hạng đầu khi tô khi không); `ex.tinh-9-am4-am9-3` tô số giữa `(-1)` mà không tô kết quả cuối; `hopTry` (`cung-am5-cong3`, `cung-1-cong-am4`) vẽ điểm đang đi là ô vuông amber ngay ở điểm xuất phát; nhãn màu `FIRST` (blue, glossary: "số hạng") dùng cho cả số hạng đầu lẫn "đổi chỗ các số", "tính từ trái sang phải", "thay x bằng 12" - LL-05
- Nguồn: —
- Vấn đề: cùng là "tổng" mà khi màu amber, khi màu theo dấu; cùng màu xanh dương mà khi là số hạng, khi là một bước làm. Phát hiện của tổng hợp gộp góp ý màu của hai nhóm.
- Sửa: chọn một cách tô kết quả cho cả bài (vd luôn tô theo dấu trong lời giải, và ghi rõ trong hình rằng amber là tổng); điểm đang đi của `hopTry` màu blue tới khi tới đích; nhãn bước làm trong `lines`/`rows` không mang màu khái niệm, hay mang màu riêng không trùng "số hạng".

## Góp ý

### 1. Lý do `wrong` c của `phan-dau-cua-so` nói "Số nguyên nào cũng có phần dấu"

- Vị trí: `$.exercises[0].explain.wrong[1].text` (`ex.phan-dau-cua-so`)
- Nguồn: —
- Vấn đề: bé đã học 0 không dương cũng không âm, dễ hỏi "0 có dấu gì?".
- Sửa: "Số −8 có dấu − đứng trước, nên nó có phần dấu."

### 2. Glossary chưa có "phần dấu", "phần số tự nhiên"

- Vị trí: `content/glossary/math.json`
- Nguồn: tr.50 ý 1
- Sửa: khai báo hai thuật ngữ của sách này (các quy tắc cộng ở sau dựa vào chúng).

### 3. Nhiễu −1 của `so-doi-cua-am-9` không ứng với lỗi nào

- Vị trí: `$.exercises[4].options[3]` (`ex.so-doi-cua-am-9`) - LL-14
- Sửa: thay bằng 8 hay −8 (lẫn số liền kề), hoặc bỏ để còn 3 lựa chọn.

### 4. Nhiễu "8 + 8" của câu kiểm tra `chon-tong-bang-0` ít ai chọn

- Vị trí: `$.exercises[17].options[2]` (`ex.chon-tong-bang-0`) - LL-14
- Sửa: thay bằng "8 + (−7)" (kiểm "cùng phần số tự nhiên"), vẫn chỉ một đáp án bằng 0.

### 5. Màn cùng làm phần 5 lặp ví dụ đầu của màn quy tắc

- Vị trí: `$.sections[4].blocks[3]` (`cung-5-cong-am5`, 5 + (−5)), so với dòng 1 của `tong-doi-vi-du` và recap `tong-doi-va-0`
- Sửa: đổi sang (−2) + 2 (bấm phải 2 lần).

### 6. Tên phần 6 "Cộng hai số cùng dấu" rộng hơn câu quy tắc "hai số âm"

- Vị trí: `$.sections[5].title`, `overview.goals[1]`, so với câu quy tắc `$.sections[5].blocks[1]`
- Nguồn: tr.50 mục 3 (sách chỉ nêu cộng hai số âm)
- Vấn đề: phát hiện của tổng hợp. Hình và câu nối có cả 3 + 4, nhưng câu để nhớ chỉ nói số âm; bé có thể hỏi hai số dương có đặt dấu − không.
- Sửa: thêm vào note cùng làm hay hình một câu "Hai số dương thì cộng như số tự nhiên.", hoặc đặt tên phần "Cộng hai số âm".

### 7. "điểm đi xa hơn về bên trái" không nói xa hơn cái gì

- Vị trí: `$.sections[5].blocks[2].children[0].text` (`section.cung-dau`)
- Sửa: "Cộng thêm một số âm thì điểm đi tiếp sang trái, nên tổng vẫn là số âm."

### 8. Hình gợi ý nấc 2 của ba câu luyện không nối với số của đề

- Vị trí: `$.exercises[23]` (`goi-y-am1-am3` cho (−8) + (−5)), `$.exercises[28]` (`goi-y-4-am7` cho (−9) + 4), `$.exercises[33]` (`goi-y-2-tru-6` cho 3 − 8) - LL-02
- Vấn đề: hình đúng luật (không lộ kết quả) nhưng chỉ đi trên trục −5..5 với số khác đề, không có bước của quy tắc; bé khó chuyển sang −8, −5 nằm ngoài trục.
- Sửa: dùng hình `lines` tách đúng số của đề rồi dừng ở "?", vd "(−8) + (−5) = −(8 + 5) = ?", "3 − 8 = 3 + (−8) = ?".

### 9. Mẹo nói "xa 0", quy tắc nói "phần số tự nhiên lớn hơn", Bài 13 nói "cách gốc O"

- Vị trí: `$.sections[6].blocks[3].text` (`tip.dau-truoc`) - LL-05
- Sửa: dùng "xa gốc O" như đề xuất ở Nghiêm trọng 7; nếu còn chỗ, nối với quy tắc bằng "(tức có phần số tự nhiên lớn hơn)".

### 10. Hình `khac-dau-vi-du` trên iPad dọc: dòng đầu lệch so với hai dòng dưới

- Vị trí: hình `khac-dau-vi-du` (walk `ipad/080-s7-02-block.png`) - LL-12
- Vấn đề: dòng 1 đặt nhãn bên phải, hai dòng dưới đặt nhãn bên dưới; do bố cục `rows` của app.
- Sửa: báo người làm app; hoặc rút ngắn nhãn để ba dòng cùng một kiểu.

### 11. "giống 1 + (−4) ở phần trước" trỏ nhầm phần

- Vị trí: `$.sections[7].blocks[2].children[0].text` (`section.tru-so-duong`)
- Vấn đề: phần ngay trước là cộng hai số khác dấu; 1 + (−4) ở phần 4.
- Sửa: "giống 1 + (−4) bạn đã làm".

### 12. Câu luyện `tinh-3-tru-8` đổi ra đúng ví dụ 3 + (−8) = −5 của phần trước

- Vị trí: `$.exercises[33]` (`ex.tinh-3-tru-8`), so với dòng 2 của `khac-dau-vi-du` - LL-07
- Sửa: đổi sang 2 − 7 hay 3 − 9.

### 13. `kind` và `title` của mẹo "Hai dấu đứng liền nhau"

- Vị trí: `$.sections[8].blocks[3]` (`tip.hai-dau-lien-nhau`)
- Vấn đề: mẹo là cách viết lại phép tính cho nhanh, hợp "làm nhanh" hơn "hiểu nhanh"; `title` gọi tình huống chứ không gọi dạng bài.
- Sửa: `kind` "làm nhanh"; `title` "Trừ đi số âm, cộng số âm" (hay giữ nếu tác giả thấy dễ nhớ hơn).

### 14. Từ "tài khoản", "giao dịch" khó với bé lớp 6

- Vị trí: `$.sections[11].blocks[2].children[0].text` (màn `tai-khoan`), nhãn hình `tai-khoan` - LL-19
- Sửa: "Ví của Lan có 50 nghìn đồng. Lan tiêu 20 nghìn, được cho 35 nghìn, rồi tiêu 45 nghìn." (giữ số và hình, đổi `label`).

### 15. Bàn phím số có phím "mũ" ở bài không dùng luỹ thừa (bố cục app)

- Vị trí: mọi câu `numeric` (walk `phone/013-s1-05-exercise-phan-so-cua-so.png`)
- Sửa: báo người làm app: chỉ hiện phím mũ ở câu cần luỹ thừa. Không chặn bài.

## Bảng LL của vòng 1

| Id LL | Nghiêm trọng | Nên sửa | Góp ý |
|---|---|---|---|
| LL-02 | 1 | 1 | 1 |
| LL-05 | 1 | 3 | 1 |
| LL-07 | 0 | 6 | 1 |
| LL-08 | 4 | 1 | 0 |
| LL-10 | 0 | 3 | 0 |
| LL-12 | 0 | 1 | 1 |
| LL-14 | 0 | 0 | 2 |
| LL-16 | 0 | 4 | 0 |
| LL-18 | 0 | 1 | 0 |
| LL-19 | 0 | 0 | 1 |
| LL-21 | 1 | 0 | 0 |
| LL-24 | 1 | 1 | 0 |

Không gắn mục LL: Nên sửa 2, 3, 10, 11, 18; Góp ý 1, 2, 5, 6, 7, 11, 13, 15. Tổng vòng này: 8 Nghiêm trọng, 26 Nên sửa, 15 Góp ý.
