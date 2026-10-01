# Review: Phép cộng và phép trừ số nguyên (`phep-cong-phep-tru-so-nguyen`)

- Bài: `content/math/kntt/phep-cong-phep-tru-so-nguyen/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: tất cả section có trong diff (13 section, 1 reviewer duy nhất)
- Nguồn đã đọc: `sources/math/phep-cong-phep-tru-so-nguyen/` - sbt-p50, sbt-p51, sbt-p52, sbt-p111
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): 100 / 25 / 1 (lượt 2 trên 23 mục: 6 / 15 / 2; lượt 3 trên 14 mục: 7 / 7 / 0); tệp `.shots/review/phep-cong-phep-tru-so-nguyen/doc-hieu.md`
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-cong-phep-tru-so-nguyen/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `aa23c42231a5533513fb1f122b391f5498421a0c282e60e001cfa8ed3ec3a403` (`pnpm content:diff` so với bản này)

## Phạm vi và cách soát

- Đã soát mọi mục của diff (chữ, câu mới, câu bị bỏ, hình của `catalog.ts`) và các mục khác cùng section.
- Tính lại 109 đẳng thức nằm trong chữ, lời giải, `wrong`, `segments` và `tex` (không sai đẳng thức nào); đối chiếu `check.expr` với `answer` của 37 câu có `check` (đúng hết); tự giải tay các câu còn lại, kể cả `match`, `order`, `fillBlank` và ba câu `manipulate` (đích −1, −5, 0). Không câu nào có hai đáp án đúng. Phép tính mới đã tìm trong `lesson.json` và `catalog.ts`: các phép của `tinh-am6-cong3`, `gia-tri-b-x-1`, `gia-tri-c-x-am4`, `nhiet-do-chieu-toi`, `tien-cua-nam`, `cung-2-cong-am3` và ví dụ của mẹo `dau-truoc` không trùng phép nào khác (chỉ trùng kết quả, xem Nên sửa 3 và Góp ý 2, 3).
- Mọi câu quy tắc (`rule: true`) khớp recap section và recap card từng chữ (13/13 section). Mọi câu quy tắc ≤ 25 âm tiết (cao nhất 24, tính cả dấu −, +, =); mọi note ≤ 2 câu; cả ba mẹo đều 3 câu hoặc ít hơn.
- Đã xem sheet walk điện thoại (sheet 01, 04, 14, 18), iPad dọc (sheet 01, 12), iPad ngang (sheet 06), các ảnh `phone/066`, `083`, `090`, `095`, `113`, `137`, `001`-`004` và hình gợi ý `goi-y-am5-cong2`. Câu kho ôn (không gắn `checkIds`/`practiceIds`, như `dien-so-doi`) không có ảnh walk nên chưa xem được cách bố trí trên màn.

## Kiểm bản sửa vòng 2

| Mục vòng 2 | Kết quả | Ghi chú |
|---|---|---|
| Nghiêm trọng 1: hình `dung-yen-tai-3` | Đã sửa đúng | `dung-yen-tai-4`, điểm ở 4 tên "đầu và tổng", nhãn trợ năng "điểm ở 4"; `visualId` trong note đổi theo; ảnh `phone/066` đúng |
| Nghiêm trọng 2: nhãn "đứng yên" của 0 + 9 | Đã sửa đúng | hàng 2 thành "từ 0 sang phải 9", hàng 1 giữ "đứng yên"; nhãn trợ năng theo câu quy tắc mới |
| Nghiêm trọng 3: `wrong` "hiệu của 5 và 2" | Đã sửa đúng | đúng câu đề xuất, 5 − 2 = 3 nên −3 là "lấy 5 trừ 2 rồi viết dấu − ở trước" |
| Nghiêm trọng 4: ví dụ mẹo bị cắt | Đã sửa đúng | `6 − (−2) = 6 + 2 = 8` và `3 + (−4) = 3 − 4 = −1` hiện đủ trên điện thoại (`phone/113`, trang "Mẹo hay") |
| Nên sửa 1: "của số đó" thành "của số thứ hai" | Đã sửa đúng | cả 9 chỗ (note, recap section, recap card của phần 3, 4, 10); 24 âm tiết |
| Nên sửa 2: số đối "cách gốc O bằng nhau" | Đã sửa, khác chữ đề xuất | nay "ở hai bên điểm 0 và cùng cách điểm 0 là 5 đơn vị": đúng nghĩa, Haiku "Hiểu rõ"; chỉ còn lệch tên "điểm 0" với "gốc O" (Góp ý 4) |
| Nên sửa 3: `dien-so-doi` | Đã sửa đúng | hai chỗ trống, ngân hàng "phần số tự nhiên", "dấu", "số 0"; chỉ một cách điền đúng |
| Nên sửa 4: nhiễu d của `chon-tong-bang-0` | Đã sửa đúng | còn 3 lựa chọn, `wrong` còn b, c |
| Nên sửa 5: quy tắc cộng với 0 | Đã sửa đúng | note, recap, hình, lời giải, `dien-cong-voi-0` cùng một cách nói |
| Nên sửa 6: "đặt dấu −" | Đã sửa đúng | không còn "đặt dấu" trong `lesson.json` và `catalog.ts` |
| Nên sửa 7: gọi tắt phần số tự nhiên | Sửa được ở lời giải, hình, note cùng làm; sinh lỗi mới ở câu quy tắc | Nên sửa 1 của vòng này |
| Nên sửa 8: mẹo `dau-truoc` | Sửa chữ, sinh lỗi mới | câu 3 "Gặp phép trừ…" đặt ở phần chưa dạy phép trừ: Nghiêm trọng 1 |
| Nên sửa 9: tô kết quả cuối `tinh-9-am4-am9-3` | Đã sửa đúng | `0 + (−1) = −1` tô hồng ở kết quả cuối |
| Nên sửa 10: `gia-tri-b-x-2` | Đã sửa đúng | `gia-tri-b-x-1`, 1 + (−9) = −8, nhiễu 8, 10, −10 đều có `wrong`; card chỉ còn một đáp án −3 (`gia-tri-m-x-2`) |
| Nên sửa 11: chuyện ví của Lan | Đã sửa đúng | "chi ra", "thu vào" khớp câu quy tắc và hình `tai-khoan`, `dau-doi-song` |

## Bảng thử mẹo

Cả ba mẹo đều đúng với mọi đầu vào thuộc dạng bài; chỉ còn một điều kiện biên chưa nói (Góp ý 1) và một câu đặt sai chỗ (Nghiêm trọng 1).

| Mẹo | Các đầu vào đã thử | Kết quả |
|---|---|---|
| `tip.dau-truoc` (`$.sections[7].blocks[3]`) | 2 + (−9) = −7; (−6) + 15 = 9; 1 + (−2) = −1; (−100) + 99 = −1; (−1) + 10 = 9; 10 + (−1) = 9; 9 + (−4) = 5; (−9) + 4 = −5; 7 + (−7), 5 + (−5) | Đúng với 8 đầu vào hai phần khác nhau (dấu và hiệu khớp tổng thật). Hai phần bằng nhau: mẹo không nêu "dấu", tổng thật là 0 (Góp ý 1) |
| `tip.hai-dau-lien-nhau` (`$.sections[9].blocks[3]`) | 6 − (−2) = 6 + 2 = 8; 3 + (−4) = 3 − 4 = −1; (−3) + (−4) = (−3) − 4 = −7; (−3) − (−5) = (−3) + 5 = 2; 0 − (−7) = 7; 10 − (−10) = 20; 1 − (−1) = 2; 4 + (−4) = 4 − 4 = 0 | Đúng với 8 đầu vào, gồm số 0, số tròn chục, hai số âm, hai số đối nhau |
| `tip.ghep-so-doi` (`$.sections[10].blocks[2]`) | 6, −4, −6 → −4; 4, −2, −4 → −2; 8, −3, −8, 5 → 2; 5, −4, 4 → 5; 1, −1, 1, −1 → 0; −7, 4, 7, −1 → 3; 100, −37, −100 → −37; 8, −8 → 0; 9 − 4 + (−4) đổi thành 9, −4, −4 (không có cặp, tổng 1); 4 − (−4) đổi thành 4, 4 (không có cặp, tổng 8) | Đúng với 10 đầu vào; mẹo đặt ở phần sau phần trừ nên câu "Có phép trừ…" đã được dạy |

## Kiểm chữ viết lại theo Đọc hiểu

- Các chữ viết lại đều giữ đúng kiến thức và khớp nguồn tr.50 (kiến thức cần nhớ 1 đến 6), tr.51 (ví dụ 1, 2), tr.52 (bài 3.8 đến 3.19). Không câu nào chép sách: câu quy tắc phần 7 dùng cụm "phần số tự nhiên của chúng" (5 chữ liền) của sách nhưng thứ tự và cấu trúc khác, vẫn là biên soạn lại.
- Hai chỗ viết lại làm lệch cách nói: câu quy tắc phần 8 (Nên sửa 1) và phần 12 (Nên sửa 4).
- Bảy mục còn "Hiểu mơ hồ" ở lượt 3 được ghi như sau: `$.sections[0].blocks[0]` (Nên sửa 5), `$.sections[0].blocks[1]` và `$.sections[0].recap.caption` (Nên sửa 5), `$.sections[1].blocks[2]` (Nên sửa 6), `$.sections[7].blocks[1]` và `$.sections[7].recap.caption` (Nên sửa 1), `$.sections[7].blocks[3]` (Nghiêm trọng 1). Không mục nào chặn riêng.
- Các mục chữ sẽ đổi theo review này cần một lượt Haiku trên đúng các mục đó trước lệnh duyệt.

## Nghiêm trọng

### 1. Mẹo `dau-truoc` ở phần 8 bảo "Gặp phép trừ thì đổi thành phép cộng trước", trong khi phép trừ chỉ được dạy từ phần 9 (LL-09, LL-20)

- Vị trí: `$.sections[7].blocks[3].text` (`tip.dau-truoc`, `section.khac-dau`), cùng chữ ở trang "Mẹo hay" (`phone/001-tips`) - LL-09, LL-20
- Nguồn: tr.50, `sbt-p50.png`, kiến thức cần nhớ 4 (a − b = a + (−b)); bài dạy quy tắc này ở `section.tru-so-duong` (phần 9), đứng sau phần 8
- Vấn đề: câu thứ ba của mẹo là câu của đề xuất vòng 2 (Nên sửa 8, Góp ý 14), nhưng mẹo nằm trong màn thứ tư của phần 8 (`phone/090-s8-04-block.png`). Bé đọc "Gặp phép trừ thì đổi thành phép cộng trước, rồi mới dùng mẹo" khi chưa gặp phép trừ số nguyên nào, chưa biết "đổi thành phép cộng" nghĩa là gì. Haiku lượt 3 cũng ghi mục này "Hiểu mơ hồ - câu cuối khó hiểu". Mẹo dùng kiến thức chưa dạy: Nghiêm trọng (trục 1, LL-09).
- Sửa: bỏ câu thứ ba, còn hai câu: "Khi cộng hai số khác dấu, hãy tìm dấu của tổng trước rồi mới trừ. Tổng mang dấu của số có phần số tự nhiên lớn hơn, dù số đó đứng trước hay đứng sau." (15 và 20 âm tiết; vẫn đúng với mọi đầu vào ở bảng thử mẹo). Câu "Có phép trừ thì đổi thành phép cộng trước" chỉ giữ ở mẹo `ghep-so-doi` (phần 11, sau phần trừ). Giữ `kind` "tránh sai" và `tex` `2 + (−9)`.

## Nên sửa

### 1. Câu quy tắc phần 8 gọi "phần lớn trừ phần nhỏ", lệch tên "phần số tự nhiên" của chính câu sau nó (LL-05, LL-20)

- Vị trí: `$.sections[7].blocks[1].children[0].text` (`rule`), `$.sections[7].recap.caption`, `$.cards[7].recap.caption` (`section.khac-dau`, `card.khac-dau`) - LL-05, LL-20
- Nguồn: tr.50, `sbt-p50.png`, kiến thức cần nhớ 3, gạch đầu dòng 3
- Vấn đề: "lấy phần lớn trừ phần nhỏ" dùng "phần lớn", "phần nhỏ" cho phần số tự nhiên; câu thứ hai cùng note lại nói đủ "phần số tự nhiên lớn hơn". Một quy tắc hai cách gọi, đúng điều vòng 2 (Nên sửa 7) yêu cầu bỏ; "phần lớn" còn là cụm thường mang nghĩa "đa số". Haiku lượt 3 vẫn ghi cả note và recap "Hiểu mơ hồ - điều kiện phức tạp" vì vế "khi hai phần số tự nhiên không bằng nhau" chen giữa câu.
- Sửa: bỏ vế điều kiện khỏi câu đầu, nói trường hợp hai phần bằng nhau ở câu hai, mỗi câu một ý: "Cộng hai số khác dấu: lấy phần số tự nhiên lớn trừ phần số tự nhiên nhỏ. Tổng mang dấu của số có phần số tự nhiên lớn hơn; nếu hai phần bằng nhau thì tổng bằng 0." (17 và 21 âm tiết, 2 câu; dùng đúng ý đã dạy ở phần 5). Đổi cùng lúc note, recap section, recap card. Không câu luyện nào của phần 8 có hai phần bằng nhau nên không câu nào bị ảnh hưởng.

### 2. Lời giải `gia-tri-c-x-am4` gọi biểu thức là A, hình gợi ý của nó gọi là B, trùng tên với chính câu kiểm tra B cùng x = 1 (LL-15, LL-20)

- Vị trí: `$.exercises[51].explain.text` (`ex.gia-tri-c-x-am4`); hình `goi-y-bieu-thuc` (`catalog.ts`: nhãn "Tính B = x + 2 − 5 khi x = 1", hàng "B = 1 + 2 - 5"); câu kiểm tra `$.exercises[50]` (`ex.gia-tri-b-x-1`: B = x + (−9), x = 1) - LL-15, LL-20
- Nguồn: —
- Vấn đề: bản sửa vòng 2 (Góp ý 12) đổi đề thành "C = x + 6 − 9" nhưng lời giải vẫn viết "Thay x bằng −4: A = (−4) + 6 − 9" (ảnh `phone/139-140`, tile `140-s12-05-exercise-gia-tri-c-x-am4-correct`); trong khi recap ngay phần đó ghi A = x + (−4) − 6, nên bé thấy hai "A" khác nhau. Hình gợi ý của câu C lại tên B; từ khi câu kiểm tra thành "B = x + (−9), thay x bằng 1", bé gặp hai biểu thức tên B cùng x = 1 trong một phần.
- Sửa: lời giải: "Thay x bằng −4: C = (−4) + 6 − 9. Tính từ trái sang phải: 2 − 9 = −7." Hình `goi-y-bieu-thuc`: nhãn "Tính C = x + 2 − 5 khi x = 3", các hàng "C = 3 + 2 - 5" (nhãn "thay x bằng 3"), "= 5 - 5", "= 0" (x = 3 chưa dùng ở phần 12; hàng cuối do chế độ gợi ý ẩn đi).

### 3. Đáp án −3 của `tinh-am6-cong3` trùng điểm đến của chính hình gợi ý, và trùng hàng 2 của hình quy tắc cùng phần (LL-02, LL-07, LL-20)

- Vị trí: `$.exercises[10]` (`ex.tinh-am6-cong3`: (−6) + 3 = −3, `hintVisualId` `goi-y-am5-cong2`), `$.sections[2].practiceIds[0]`; hình `cong-duong-vi-du` hàng 2 `(-5) + 2 = -3` (recap `section.cong-so-duong`) - LL-02, LL-07, LL-20
- Nguồn: —
- Vấn đề: bản sửa vòng 2 (Góp ý 2) đổi −2 thành −3 để thoát chuyện "tới −2", nhưng hình gợi ý vẽ (−5) + 2 và mũi tên dừng ở −3 (ảnh `goi-y-am5-cong2-phone.png`, nấc 2 chỉ ẩn điểm "tổng"), còn recap của phần có `(−5) + 2 = −3`. Bé xem gợi ý thấy mũi tên tới −3 rồi gõ −3 mà không tính (−6) + 3. Trước bản sửa, gợi ý tới −3 và đáp án −2 nên không lộ.
- Sửa: đổi câu luyện thành (−8) + 3 = −5: `prompt` `(-8)+3`, `check.expr` `(-8)+3`, `answer.value` −5, `explain` "Cộng với 3 là đi sang phải 3 đơn vị từ −8. Ta tới −5." với `tex` `(-8) + 3 = \concept{pink}{-5}`, đổi id thành `tinh-am8-cong3` (sửa cả `practiceIds`). (−8) + 3 chưa có ở đâu; kết quả −5 chưa có trong phần 3 (phần có 2, −3, 0, 4, −2, −1, 1); giữ hình gợi ý (đích −3 khác −5).

### 4. Màn mở đầu phần 12 bỏ từ "biểu thức", trong khi câu quy tắc, recap và câu `chon-bieu-thuc-am` vẫn dùng (LL-05, LL-20)

- Vị trí: `$.sections[11].blocks[0].children[0].text` (`section.gia-tri-bieu-thuc`) so với `$.sections[11].blocks[1]` (rule), `$.sections[11].recap.caption`, `$.cards[11].recap.caption`, `$.exercises[55].prompt` (`ex.chon-bieu-thuc-am`) - LL-05, LL-20
- Nguồn: tr.51, `sbt-p51.png`, ví dụ 1 ("Tính giá trị của biểu thức A = x + (−27) − 234")
- Vấn đề: viết lại theo Đọc hiểu, note đổi từ "Biểu thức A = …" thành "A = … là một dãy phép tính có chữ x". Câu quy tắc ngay sau nói "Muốn tính giá trị biểu thức", nên bé không nối được "dãy phép tính có chữ x" với "biểu thức" (từ học ở Bài 6, nhưng bài này chưa gọi lại tên). Một khái niệm hai tên.
- Sửa: "A = x + (−4) − 6 là một biểu thức, tức là dãy phép tính có chữ x. Cho x = −3, ta thay chữ x bằng số −3 rồi tính, được giá trị của A." (16 và 17 âm tiết, 2 câu). Sau khi sửa cần đọc hiểu lại mục này.

### 5. Ba mục phần 1 còn "Hiểu mơ hồ" ở lượt 3: "phần số tự nhiên" chưa quen, câu quy tắc gói ba khái niệm mới

- Vị trí: `$.sections[0].blocks[0].children[0].text`, `$.sections[0].blocks[1].children[0].text`, `$.sections[0].recap.caption`, `$.cards[0].recap.caption` (`section.phan-dau`)
- Nguồn: tr.50, `sbt-p50.png`, kiến thức cần nhớ 1
- Vấn đề: Haiku ghi: "tự nhiên chưa rõ" (note đầu, dùng "phần số tự nhiên" trước khi định nghĩa) và "khái niệm mới quá" (câu quy tắc gói phần dấu, phần số tự nhiên, dấu +). Từ do sách định nghĩa nên không thể bỏ, chỉ giảm được tải ở note đầu. Không chặn.
- Sửa: note đầu: "Nhiệt kế chỉ −2 độ, nghĩa là trời lạnh hơn 0 độ. Số −2 gồm dấu − và số 2; số 2 này gọi là phần số tự nhiên." (câu hai 16 âm tiết). Giữ câu quy tắc và recap như hiện tại (23 và 17 âm tiết, đã khớp nhau); nếu sau lượt Haiku sau vẫn mơ hồ thì tách ý dấu + thành một màn riêng (phần 1 mới có 3 màn, tối đa 4) và để recap hai câu, mỗi câu một ý.

### 6. Note về kí hiệu −(−5) còn "Hiểu mơ hồ" ở lượt 3

- Vị trí: `$.sections[1].blocks[2].children[0].text` (`section.so-doi`)
- Nguồn: tr.50, `sbt-p50.png`, kiến thức cần nhớ 2 (kí hiệu −x là số đối của x, −(−x) = x)
- Vấn đề: Haiku ghi "ký hiệu −(−5) mới". Kí hiệu này là của sách nên chỉ cần giải thích dấu − ngoài ngoặc nghĩa gì; câu hiện tại ("Ta ghi số đối của −5 là −(−5), vậy −(−5) = 5") chưa nói dấu − ngoài ngoặc làm gì. Không chặn.
- Sửa: "−5 có phần số tự nhiên là 5, nên số đối của nó là 5. Ta viết số đối của −5 là −(−5), tức là đặt thêm dấu − ngoài ngoặc: −(−5) = 5." (câu hai 17 âm tiết, 2 câu). Công thức dưới note giữ nguyên.

## Góp ý

### 1. Mẹo `dau-truoc` không nói trường hợp hai phần số tự nhiên bằng nhau (LL-24)

- Vị trí: `$.sections[7].blocks[3].text` (`tip.dau-truoc`) - LL-24
- Nguồn: tr.50, kiến thức cần nhớ 3, gạch đầu dòng 3 ("không đối nhau")
- Vấn đề: 7 + (−7) hay 5 + (−5) cũng là "hai số khác dấu", mẹo bảo tìm dấu của số có phần lớn hơn nhưng không có số nào. Không cho kết quả sai, chỉ bỏ ngỏ; câu quy tắc cùng phần có nêu.
- Sửa: câu một thành "Khi cộng hai số khác dấu mà không đối nhau, hãy tìm dấu của tổng trước rồi mới trừ." (19 âm tiết). Đã tự thử: vẫn đúng với mọi đầu vào ở bảng; cần đọc hiểu lại câu này (từ "không đối nhau" từng bị Haiku ghi mơ hồ ở lượt 2). Nếu áp Nên sửa 1 thì giữ nguyên câu một.

### 2. Ví dụ trong câu quy tắc phần 7 lặp đúng chuyện nợ ngay trước, và kết quả −7 trùng đáp án câu kiểm tra (LL-07, LL-20)

- Vị trí: `$.sections[6].blocks[1].children[0].text`, `$.sections[6].recap.caption`, `$.cards[6].recap.caption` (ví dụ (−3) + (−4) = −7) so với `$.sections[6].blocks[0]` (cùng phép tính) và `$.exercises[26]` (`ex.tinh-am5-am2`, đáp án −7) - LL-07, LL-20
- Nguồn: —
- Vấn đề: ví dụ thêm vào câu quy tắc theo lượt Đọc hiểu trùng chuyện nợ, hàng 1 của hình `cung-dau-vi-du`, và recap hiện cả ba nơi cùng −7; bé ôn phần này rồi gặp câu kiểm tra đáp án −7. Không phải cùng phép tính nên không chặn.
- Sửa: đổi câu kiểm tra thành (−3) + (−2): `prompt` `(-3)+(-2)`, đáp án −5, lựa chọn −5, −1, 5, 1, `explain` "Hai số cùng là số âm: cộng 3 với 2 được 5, rồi viết dấu − ở trước. Vậy kết quả là −5.", `wrong` b (−1): "−1 là lấy 3 trừ 2 rồi viết dấu − ở trước. Hai số âm thì ta cộng hai phần số tự nhiên, không trừ.", đổi id (`tinh-am3-am2`). (−3) + (−2) và kết quả −5 chưa có trong phần 7.

### 3. Hai câu cuối phần 13 cùng đáp án −4 (LL-07, LL-20)

- Vị trí: `$.exercises[56]` (`ex.thang-may-tang-2`: 1 + (−5) = −4, câu kiểm tra) và `$.exercises[57]` (`ex.tien-cua-nam`: 2 + (−10) + 4 = −4, câu luyện) - LL-07, LL-20
- Nguồn: —
- Vấn đề: bản sửa vòng 2 (Góp ý 15) đổi số cho `tien-cua-nam` mà không để ý đáp án −4 của câu kiểm tra cùng phần; bé gõ lại −4 theo trí nhớ.
- Sửa: `tien-cua-nam`: "Nam có 2 nghìn đồng, chi 12 nghìn đồng (ghi nợ phần còn thiếu), rồi mẹ cho thêm 8 nghìn đồng." Đáp án −2 (2 + (−12) = −10, rồi (−10) + 8 = −2); sửa `check.expr` `2+(-12)+8`, `explain` "Chi 12 là −12 và mẹ cho 8 là +8. Tính từ trái sang phải: 2 + (−12) = −10, rồi (−10) + 8 = −2." và `tex`. Hai phép này, và đáp án −2, chưa có trong phần 13.

### 4. Vài tên gọi lệch nhẹ sau khi viết lại chữ (LL-05)

- Vị trí: `$.sections[1].blocks[0].children[0].text` ("điểm 0") so với hình `so-doi-truc`, `cung-am2-cong2` và note `$.sections[4].blocks[2]` ("gốc O"); `$.sections[10].blocks[2].text` ("cộng chúng trước") so với "ghép" ở note cùng làm `$.sections[10].blocks[3]`, hình `ghep-so-doi`, lời giải `tinh-9-am4-am9-3` - LL-05
- Nguồn: —
- Vấn đề: cùng một điểm hay cùng một thao tác mà gọi hai cách. Không sai nghĩa, bé hiểu được qua ngữ cảnh.
- Sửa: phần 2: "Hai số này ở hai bên gốc O (điểm 0) và cùng cách gốc O là 5 đơn vị, nên là hai số đối nhau." (25 âm tiết, đúng giới hạn); mẹo `ghep-so-doi`: "hãy ghép chúng trước, được 0" (cùng "ghép" ở mọi chỗ). Nếu đổi thì cần đọc hiểu lại hai mục này.

### 5. Mục tiêu bài bỏ ý chính của quy tắc trừ

- Vị trí: `$.overview.goals[2]`
- Nguồn: tr.50, kiến thức cần nhớ 4
- Vấn đề: "trừ được hai số nguyên bằng cách đi sang trái hoặc sang phải trên trục số" đúng, nhưng quy tắc phần 9 là "ta cộng với số đối của số đó" và không mục tiêu nào nêu ý này; hai mục tiêu khác đã nói về trục số.
- Sửa: "trừ được hai số nguyên bằng cách cộng với số đối của số bị trừ đi" hay giữ câu hiện tại nếu coi trục số là ý chính (Haiku đã đọc rõ câu hiện tại).

### 6. Câu bị ngắt dòng giữa phép tính trên điện thoại (bố cục app, báo người làm app)

- Vị trí: `$.sections[6].blocks[1].children[0].text` (`phone/083-s7-06-recap.png`: "dấu −" xuống dòng khỏi "ở trước", "3 +" và "4 = 7" ở hai dòng); `$.sections[9].blocks[3].text` ("6" và "+ 2" ở hai dòng, `phone/090`, `phone/113`) - LL-12
- Nguồn: —
- Vấn đề: tiếp tục Góp ý 17 vòng 2; chữ viết lại dài hơn nên có thêm hai chỗ.
- Sửa: báo người làm app (không ngắt dòng quanh dấu phép tính và dấu − đi kèm số); không chặn bài. Các Góp ý vòng 2 chưa xử lý (3, 7, 16, 18) vẫn không chặn.

## Bảng LL của vòng 3

Chỉ đếm phát hiện mới của vòng này, mỗi phát hiện một lần theo id LL đầu tiên ghi ở mục.

| Id LL | Nghiêm trọng | Nên sửa | Góp ý |
|---|---|---|---|
| LL-02 | 0 | 1 | 0 |
| LL-05 | 0 | 2 | 1 |
| LL-07 | 0 | 0 | 2 |
| LL-09 | 1 | 0 | 0 |
| LL-12 | 0 | 0 | 1 |
| LL-15 | 0 | 1 | 0 |
| LL-24 | 0 | 0 | 1 |
| LL-25 | 0 | 2 | 0 |

Sinh từ bản sửa vòng 2 và từ viết lại theo Đọc hiểu (LL-20, ghi kèm, chưa đếm ở bảng trên): Nghiêm trọng 1; Nên sửa 1, 2, 3, 4; Góp ý 2, 3. Nếu tính LL-20 là mục chính cho các phát hiện này thì LL-20 có 1 Nghiêm trọng, 4 Nên sửa, 2 Góp ý. Không gắn mục LL: Góp ý 5. Tổng vòng này: 1 Nghiêm trọng, 6 Nên sửa, 6 Góp ý, tất cả là phát hiện mới.
