# Review: Phép cộng và phép trừ số nguyên (`phep-cong-phep-tru-so-nguyen`)

- Bài: `content/math/kntt/phep-cong-phep-tru-so-nguyen/lesson.json`
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`), section: các section có trong diff (7 section: phần 1, 2, 3, 7, 8, 12, 13; 1 reviewer duy nhất)
- Nguồn đã đọc: `sources/math/phep-cong-phep-tru-so-nguyen/` - sbt-p50 (đối chiếu lại kiến thức cần nhớ 1 đến 3); p51, p52, p111 đã đọc ở vòng 3, các mục của chúng không đổi
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): 100 / 25 / 1 (lượt 2 trên 23 mục: 6 / 15 / 2; lượt 3 trên 14 mục: 7 / 7 / 0; lượt trên mục đổi sau vòng 3: 5 / 4 / 3); tệp `.shots/review/phep-cong-phep-tru-so-nguyen/doc-hieu.md`
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-cong-phep-tru-so-nguyen/`
- Kết luận: Đạt: 0 Nghiêm trọng, chờ lệnh duyệt của người điều phối
- Bản đã review: `5a877dda36c673526a790d68300a51a422e8eca46badb819fea969b9403855ae` (`pnpm content:diff` so với bản này)

## Phạm vi và cách soát

- Đã soát mọi mục của diff: 9 chỗ chữ đổi (phần 1, 2, 7, 8 gồm note quy tắc, mẹo `dau-truoc`, recap section và recap card, phần 11), 3 câu mới hay đổi số (`tinh-am8-cong3`, `tinh-am7-am3`, `tien-cua-nam`), lời giải `gia-tri-c-x-am4`, và hai hình của `catalog.ts` (`goi-y-am4-cong2`, `goi-y-bieu-thuc`). Đã soát các mục khác cùng section: mọi câu kiểm tra, luyện tập, câu kho ôn gắn card, hình quy tắc, hình recap, hình gợi ý của phần 1, 2, 3, 7, 8, 12, 13.
- Tự tính lại mọi phép tính trong diff: (−8) + 3 = −5; (−7) + (−3) = −10 (nhiễu −4 = 7 − 3, 10, 4 đều khác −10); (−4) + 6 = 2 rồi 2 − 9 = −7; 2 + (−12) = −10 rồi (−10) + 8 = −2; 2 + (−9) = −7; hình gợi ý (−4) + 2 = −2 và 3 + 2 − 5 = 0. Các `check.expr` và `answer` khớp nhau.
- Quy tắc: 13/13 câu `rule: true` khớp recap section và recap card từng chữ (đã so bằng script); câu quy tắc dài nhất 24 âm tiết (phần 8 là 21 và 12); mọi note ≤ 2 câu; ba mẹo ≤ 3 câu (mẹo `dau-truoc` 24 và 20 âm tiết).
- Hình gợi ý: `goi-y-am4-cong2` bắt đầu ở −4, mũi tên "sang phải 2" dừng trên trục, điểm "tổng" ẩn; số được tô là −4, đáp án của đề là −5 nên không lộ (đã đổi điểm đầu khỏi −5, đúng, vì điểm đầu −5 trùng đáp án). `goi-y-bieu-thuc` dừng ở "?" sau "5 − 5", số dùng (x = 3, 0) khác đề (x = −4, −7). Đã xem ảnh `goi-y-am4-cong2-phone.png`, `goi-y-bieu-thuc-phone.png`.
- Đã xem sheet walk điện thoại (01, 03, 05, 10, 12, 18, 19), iPad ngang (01), iPad dọc (12): màn phần 1, 2, 3 (câu `tinh-am8-cong3` ở cả bốn trạng thái, gồm gợi ý nấc 2 và lời giải), phần 7 (`tinh-am7-am3`), phần 8 (màn quy tắc, mẹo, recap), phần 12 (`gia-tri-c-x-am4`), phần 13 (`tien-cua-nam`), trang "Mẹo hay". Không chữ chồng hay bị cắt do nội dung. Câu kho ôn không có ảnh walk (như vòng 3).
- Không còn tham chiếu tới id cũ (`tinh-am6-cong3`, `tinh-am5-am2`, `goi-y-am5-cong2`) trong `content/`, `src/`, `video/`, `notebooks/`.
- Tệp `doc-hieu-4.md` ghi dòng "Tổng: 5 / 5 / 2" nhưng đếm các dòng có 5 mục Hiểu rõ, 4 Hiểu mơ hồ, 3 Khó hiểu; review này dùng 5 / 4 / 3.

## Kiểm bản sửa vòng 3

| Mục vòng 3 | Kết quả | Ghi chú |
|---|---|---|
| Nghiêm trọng 1: mẹo `dau-truoc` dùng "phép trừ" chưa dạy | Đã sửa đúng | không còn câu "Gặp phép trừ…"; mẹo còn hai câu, chỉ dùng "đối nhau" (dạy ở phần 2 và 5) và phép trừ số tự nhiên; đã thử 15 đầu vào (bảng dưới) |
| Nên sửa 1: "phần lớn trừ phần nhỏ" ở câu quy tắc phần 8 | Sửa đúng ở note, recap section, recap card; sinh lỗi mới ở mẹo | câu quy tắc nay "lấy phần số tự nhiên lớn trừ phần số tự nhiên nhỏ" (20 và 12 âm tiết), ba chỗ giống từng chữ; mẹo `dau-truoc` lại viết "phần lớn trừ phần nhỏ": Nên sửa 1 của vòng này |
| Nên sửa 2: `gia-tri-c-x-am4` gọi A, hình gợi ý gọi B | Đã sửa đúng | lời giải "C = (−4) + 6 − 9. Trước hết (−4) + 6 = 2, rồi 2 − 9 = −7"; hình "C = 3 + 2 - 5" với x = 3, không còn trùng tên B của câu kiểm tra (ảnh `phone/139-140`) |
| Nên sửa 3: đáp án −3 của `tinh-am6-cong3` trùng hình gợi ý và hình quy tắc | Đã sửa đúng | đổi `tinh-am8-cong3` (−8) + 3 = −5, `practiceIds` đổi theo; hình gợi ý còn đổi thêm sang (−4) + 2 để điểm đầu không phải −5; −5 chưa là kết quả của phép nào ở phần 3 |
| Nên sửa 4: màn mở đầu phần 12 bỏ từ "biểu thức" | Đã sửa đúng | "A = … là một biểu thức, tức là dãy phép tính có chữ x"; Haiku "Hiểu rõ" |
| Nên sửa 5: ba mục phần 1 còn "Hiểu mơ hồ" | Sửa một phần | note đầu viết lại đúng đề xuất; Haiku vẫn ghi "phần số tự nhiên chưa quen". Còn: Nên sửa 2 |
| Nên sửa 6: note kí hiệu −(−5) | Chưa sửa xong | bản "tức là đặt thêm dấu − ngoài ngoặc" bị Haiku ghi Khó hiểu nên đã bỏ; bản hiện tại chỉ đổi "ghi" thành "viết". Còn: Nên sửa 3 |
| Góp ý 1: mẹo không nói hai phần bằng nhau | Đã sửa đúng | "mà không đối nhau" ở cả câu quy tắc lẫn mẹo; khớp nguồn tr.50 ("khác dấu không đối nhau") |
| Góp ý 2: ví dụ phần 7 lặp chuyện nợ, kết quả −7 trùng câu kiểm tra | Sửa một phần | câu kiểm tra đổi thành (−7) + (−3) = −10, hết trùng đáp án; ví dụ trong câu quy tắc vẫn lặp chuyện nợ. Còn: Góp ý 1 |
| Góp ý 3: hai câu cuối phần 13 cùng đáp án −4 | Đã sửa đúng | `tien-cua-nam` 2 + (−12) + 8 = −2; câu kiểm tra −4; lời giải, `tex`, `check.expr` đồng bộ |
| Góp ý 4, 5, 6 | Chưa sửa | còn: Góp ý 3, 4, 5 |

## Bảng thử mẹo

Chỉ mẹo `dau-truoc` đổi chữ; hai mẹo còn lại (`hai-dau-lien-nhau`, `ghep-so-doi`) không có trong diff, bảng thử ở vòng 3 vẫn đúng.

| Mẹo | Các đầu vào đã thử | Kết quả |
|---|---|---|
| `tip.dau-truoc` (`$.sections[7].blocks[3]`) | 2 + (−9) = −7; (−6) + 15 = 9; 1 + (−2) = −1; (−100) + 99 = −1; (−1) + 10 = 9; 10 + (−1) = 9; 9 + (−4) = 5; (−9) + 4 = −5; 7 + (−10) = −3; (−8) + 3 = −5; (−1) + 2 = 1; (−99) + 100 = 1; 5 + (−9) = −4; (−4) + 9 = 5; 7 + (−7) và 5 + (−5) (hai số đối nhau) | Đúng với 13 đầu vào hai phần khác nhau (dấu lấy theo số có phần lớn hơn, hiệu khớp tổng thật), gồm số biên 1, hai số liền nhau, số tròn trăm, hai thứ tự cộng. Hai phần bằng nhau bị loại bởi "mà không đối nhau", tổng 0 đã dạy ở phần 5. Kiến thức dùng đều đã dạy trước phần 8 |

## Kiểm chữ viết lại theo Đọc hiểu

- Chữ viết lại giữ đúng kiến thức và khớp tr.50 (kiến thức cần nhớ 1 đến 3). Câu quy tắc phần 8 dùng cụm "khác dấu không đối nhau" của sách như điều kiện, phần còn lại đổi cấu trúc: vẫn là biên soạn lại, không chép.
- Mục chữ đổi sau lượt Haiku cuối chưa có xác nhận đọc hiểu cho bản cuối: `$.sections[1].blocks[2]` (về lại bản cũ), `$.sections[7].blocks[1]` và `$.sections[7].recap.caption` (câu quy tắc phần 8), `$.sections[7].blocks[3]` (mẹo), `$.exercises[26].explain.wrong[0]`, `$.exercises[51].explain.text`. Tự đọc như bé: ba mục sau cùng rõ nghĩa (số ghi đủ, "trước hết … rồi …"); câu quy tắc phần 8 ngắn hơn bản bị ghi Khó hiểu và chỉ giữ một điều kiện; mục đáng đọc lại hơn cả là `$.sections[1].blocks[2]` (Nên sửa 3). Đã đủ ba lượt tối đa của luật nên không chặn.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Mẹo `dau-truoc` gọi "phần lớn trừ phần nhỏ", lệch tên "phần số tự nhiên" của câu quy tắc cùng phần (LL-05, LL-20)

- Vị trí: `$.sections[7].blocks[3].text` (`tip.dau-truoc`, `section.khac-dau`), cùng chữ ở trang "Mẹo hay" (`phone/001-tips`); nhãn trợ năng `goi-y-am9-cong4` ở `catalog.ts` ("lấy phần số tự nhiên lớn trừ phần nhỏ") - LL-05, LL-20
- Nguồn: tr.50, `sbt-p50.png`, kiến thức cần nhớ 3, gạch đầu dòng 3 ("hiệu của hai phần số tự nhiên … số lớn trừ số nhỏ")
- Vấn đề: vòng 3 (Nên sửa 1) bỏ "phần lớn", "phần nhỏ" khỏi câu quy tắc vì cùng một quy tắc mà gọi hai cách, và "phần lớn" thường mang nghĩa "đa số". Bản viết lại mẹo đưa đúng hai cụm đó trở lại: bé đọc quy tắc nói "phần số tự nhiên lớn", đến mẹo lại là "phần lớn", "phần nhỏ". Haiku lượt 3 cũng từng ghi mẹo này mơ hồ ở đúng vế "trừ".
- Sửa: tách ba câu, mỗi câu một ý, không dùng "phần lớn": "Khi cộng hai số khác dấu mà không đối nhau, hãy tìm dấu của tổng trước. Dấu đó là dấu của số có phần số tự nhiên lớn hơn, dù số đó đứng trước hay đứng sau. Sau đó lấy phần số tự nhiên lớn trừ phần số tự nhiên nhỏ." (16, 21, 14 âm tiết, 3 câu). Đã tự thử: vẫn đúng với mọi đầu vào ở bảng thử mẹo; thứ tự "dấu trước, trừ sau" khớp `tex` `-(9 - 2)`. Nhãn trợ năng sửa thành "lấy phần số tự nhiên lớn trừ phần số tự nhiên nhỏ". Cần đọc hiểu lại mẹo sau khi sửa.

### 2. Ba mục phần 1 còn "Hiểu mơ hồ": "phần số tự nhiên" chưa quen, câu quy tắc gói ba khái niệm (còn từ vòng 3, LL-25)

- Vị trí: `$.sections[0].blocks[0].children[0].text`, `$.sections[0].blocks[1].children[0].text`, `$.sections[0].recap.caption`, `$.cards[0].recap.caption` (`section.phan-dau`)
- Nguồn: tr.50, `sbt-p50.png`, kiến thức cần nhớ 1
- Vấn đề: note đầu đã viết lại theo đề xuất ("số 2 này gọi là phần số tự nhiên"), Haiku lượt sau vẫn ghi "phần số tự nhiên chưa quen". Từ do sách định nghĩa nên không bỏ được; câu quy tắc (23 và 17 âm tiết) chưa được đọc lại. Không chặn.
- Sửa: như vòng 3: nếu muốn giảm tải, tách ý dấu + thành một màn riêng (phần 1 mới có 3 màn, tối đa 4) và để recap hai câu mỗi câu một ý, rồi đọc hiểu lại.

### 3. Note kí hiệu −(−5) còn "Hiểu mơ hồ" (còn từ vòng 3, LL-25)

- Vị trí: `$.sections[1].blocks[2].children[0].text` (`section.so-doi`)
- Nguồn: tr.50, `sbt-p50.png`, kiến thức cần nhớ 2 (kí hiệu −x là số đối của x, −(−x) = x)
- Vấn đề: câu "Ta viết số đối của −5 là −(−5), vậy −(−5) = 5" chưa nói dấu − đặt trước một số có nghĩa gì; bản thêm "đặt thêm dấu − ngoài ngoặc" cũng bị Haiku ghi Khó hiểu vì "đặt thêm" gợi thao tác chứ không gợi nghĩa. Không chặn.
- Sửa: nói nghĩa của dấu −, rồi mới viết kí hiệu: "Dấu − đặt trước một số cho ta số đối của nó, nên số đối của −5 viết là −(−5). Mà số đối của −5 là 5, vậy −(−5) = 5." (20 và 11 âm tiết, 2 câu; đúng kiến thức: −(5) = −5 và −(−5) = 5; công thức dưới note giữ nguyên). Cần đọc hiểu lại.

## Góp ý

### 1. Ví dụ trong câu quy tắc phần 7 lặp đúng chuyện nợ ngay trước (còn từ vòng 3, LL-07)

- Vị trí: `$.sections[6].blocks[1].children[0].text`, `$.sections[6].recap.caption`, `$.cards[6].recap.caption` (ví dụ (−3) + (−4) = −7) so với `$.sections[6].blocks[0]` (cùng phép tính) - LL-07
- Nguồn: —
- Vấn đề: ví dụ của câu quy tắc, chuyện nợ và hàng 1 của hình `cung-dau-vi-du` cùng một phép; còn câu kiểm tra (−7) + (−3) ghép đúng hai kết quả −7 và −3 đang hiện trong hình quy tắc. Không trùng đáp án, không chặn.
- Sửa: tuỳ tác giả. Nếu đổi: ví dụ trong câu quy tắc thành "(−1) + (−2) thì lấy 1 + 2 = 3, được −3" (hàng 2 của hình đã có phép này; sửa đồng thời note, recap section, recap card). Giữ nguyên cũng được vì không trùng đáp án.

### 2. Kết quả trong hình quy tắc phần 8 trùng đáp án câu kiểm tra và câu luyện (LL-07)

- Vị trí: hình `khac-dau-vi-du` (`catalog.ts`; hiện ở màn quy tắc `phone/087` và recap `phone/095`): hàng 2 `3 + (-8) = -5`, hàng 3 `(-5) + 2 = -3`; so với `$.exercises` `ex.tinh-am9-cong4` ((−9) + 4 = −5) và `ex.tinh-7-cong-am10` (7 + (−10) = −3) - LL-07
- Nguồn: —
- Vấn đề: bé thấy kết quả −5 và −3 ở màn quy tắc rồi gặp hai câu có đúng các đáp án đó (khác phép, khác số hạng nên không chặn; cùng kiểu vòng 3 đã xếp Góp ý). Phần 3 cũng có kiểu này: đáp án 2 của `nhiet-do-am-ap-len` bằng kết quả hàng 1 của `cong-duong-vi-du`; không cần đổi.
- Sửa: hàng 2 thành `6 + (-8)` = `-(8 - 6)` = `-2` (tag "mang dấu của −8"), hàng 3 thành `(-11) + 3` = `-(11 - 3)` = `-8` (tag "mang dấu của −11"). Đã tự thử: 6 − 8 = −2, −11 + 3 = −8; −2 và −8 chưa là kết quả của phép nào ở phần 8, hai phép chưa có ở phần.

### 3. Vài tên gọi lệch nhẹ (còn từ vòng 3, LL-05)

- Vị trí: `$.sections[1].blocks[0].children[0].text` ("điểm 0") so với hình `so-doi-truc`, `cung-am2-cong2` và note `$.sections[4].blocks[2]` ("gốc O"); `$.sections[10].blocks[2].text` ("cộng chúng trước") so với "ghép" ở note cùng làm `$.sections[10].blocks[3]`, hình `ghep-so-doi`, lời giải `tinh-9-am4-am9-3` - LL-05
- Nguồn: —
- Vấn đề: cùng một điểm hay cùng một thao tác mà gọi hai cách; không sai nghĩa.
- Sửa: như vòng 3: phần 2: "Hai số này ở hai bên gốc O (điểm 0) và cùng cách gốc O là 5 đơn vị, nên là hai số đối nhau." (25 âm tiết); mẹo `ghep-so-doi`: "hãy ghép chúng trước, được 0". Nếu đổi thì đọc hiểu lại hai mục.

### 4. Mục tiêu bài bỏ ý chính của quy tắc trừ (còn từ vòng 3)

- Vị trí: `$.overview.goals[2]`
- Nguồn: tr.50, kiến thức cần nhớ 4
- Vấn đề: "trừ được hai số nguyên bằng cách đi sang trái hoặc sang phải trên trục số" đúng, nhưng quy tắc phần 9 là "ta cộng với số đối của số đó".
- Sửa: "trừ được hai số nguyên bằng cách cộng với số đối của số bị trừ đi", hay giữ nguyên nếu coi trục số là ý chính.

### 5. Câu bị ngắt dòng giữa phép tính trên điện thoại (bố cục app, báo người làm app; còn từ vòng 3, LL-12)

- Vị trí: `$.sections[6].blocks[1].children[0].text` (`phone/083`); `$.sections[9].blocks[3].text` ("6" và "+ 2" ở hai dòng, `phone/001-tips`, `phone/003-tips-2`, `phone/004-tips-3`) - LL-12
- Nguồn: —
- Vấn đề: dấu − và số, hay "6 + 2", bị tách hai dòng.
- Sửa: báo người làm app (không ngắt dòng quanh dấu phép tính và dấu − đi kèm số); không chặn bài. Các Góp ý vòng 2 chưa xử lý (3, 7, 16, 18) vẫn không chặn.

## Bảng LL của vòng 4

Chỉ đếm phát hiện mới của vòng này, mỗi phát hiện một lần theo id LL đầu tiên ghi ở mục. Các mục "còn từ vòng 3" đã đếm ở vòng 3 nên không đếm lại.

| Id LL | Nghiêm trọng | Nên sửa | Góp ý |
|---|---|---|---|
| LL-05 | 0 | 1 | 0 |
| LL-07 | 0 | 0 | 1 |

Sinh từ bản sửa vòng 3 (LL-20, ghi kèm, chưa đếm ở bảng trên): Nên sửa 1. Tổng vòng này: 0 Nghiêm trọng, 3 Nên sửa, 5 Góp ý, trong đó mới 1 Nên sửa và 1 Góp ý; còn lại 2 Nên sửa và 4 Góp ý còn từ vòng 3 (Góp ý 1 là phần chưa sửa của Góp ý 2 vòng 3).
