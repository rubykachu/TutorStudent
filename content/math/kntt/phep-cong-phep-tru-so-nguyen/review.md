# Review: Phép cộng và phép trừ số nguyên (`phep-cong-phep-tru-so-nguyen`)

- Bài: `content/math/kntt/phep-cong-phep-tru-so-nguyen/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/phep-cong-phep-tru-so-nguyen/` - sbt-p50, sbt-p51, sbt-p52, sbt-p111
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi vòng 1-2 hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-cong-phep-tru-so-nguyen/`
- Kết luận: Chưa đạt: còn 4 lỗi Nghiêm trọng
- Bản đã review: `73c9d3859b9e91751e61d9512f834e1911b23cc5982f724248f85c95904c9076` (`pnpm content:diff` so với bản này)

Ba reviewer đã tự giải cả 60 exercise trước khi đọc `answer`: mọi đáp án, `check`, `accept`, `pairs` và hàng hình (`catalog.ts`) đúng số, không câu nào có hai đáp án đúng; chỉ một lý do `wrong` nói sai (Nghiêm trọng 3). Bảng thử mẹo nằm trong `.shots/review/phep-cong-phep-tru-so-nguyen/nhom-2-v2.md` (`tip.dau-truoc`) và `nhom-3-v2.md` (`tip.hai-dau-lien-nhau`, `tip.ghep-so-doi`): cả ba mẹo đúng với mọi đầu vào thuộc dạng bài.

Kiểm bản sửa vòng 1: 8 Nghiêm trọng của vòng 1 đã sửa đúng ở phần chữ. Bản sửa sinh lỗi mới ở 8 chỗ (LL-20): Nghiêm trọng 1, 4; Nên sửa 1, 4, 6, 11; Góp ý 3, 11. Còn sót từ vòng 1: Nên sửa 2, 7, 9; Góp ý 6, 18.

Câu đề xuất ở các mục dưới đây đã đếm âm tiết (≤ 25), note giữ ≤ 2 câu, mẹo ≤ 3 câu. Mọi phép tính mới đã tìm trong `lesson.json` và `catalog.ts`: chưa có ở đâu, và không trùng số đề xuất ở mục khác. Ba câu quy tắc đi trên trục số (Nên sửa 1), câu quy tắc cộng với 0 cùng hình của nó (Nghiêm trọng 1, 2, Nên sửa 5), và động từ "viết dấu − ở trước" (Nên sửa 6, Nghiêm trọng 3) được sửa theo cùng một cách nói.

## Nghiêm trọng

### 1. Màn mở đầu phần 6: chuyện nói ví có 4 nghìn, hình vẽ điểm "đầu" ở 3 và không có điểm tổng (LL-15, LL-20)

- Vị trí: `$.sections[5].blocks[0]` (note "Ví của bạn có 4 nghìn đồng…" với hình `visual.dung-yen-tai-3`), mục `dung-yen-tai-3` trong `src/visuals/math/phep-cong-phep-tru-so-nguyen/catalog.ts` (`section.cong-voi-0`) - LL-15, LL-20
- Nguồn: —
- Vấn đề: hình mới thêm khi tách section ở vòng 1. Chữ nói 4, hình chỉ có một chấm xanh tên "đầu" ở 3 (ảnh walk `phone/066-s6-01-block.png`, tổng hợp đã mở xem). Hình không có điểm tổng, cũng không cho thấy "cộng 0 thì đứng yên". Đây là hình duy nhất của phần 6 nối việc cộng 0 với trục số (phần không có màn cùng làm, Góp ý 7). Bé thấy 4 trong chữ và 3 trên hình, có thể nhớ 4 + 0 = 3.
- Sửa: đổi điểm sang 4 và cho điểm mang cả hai tên: `{ type: "point", at: 4, name: "đầu và tổng", color: FIRST }`, nhãn trợ năng "Trục số: điểm ở 4, cộng 0 thì điểm vẫn ở 4", đổi id thành `dung-yen-tai-4` (sửa cả `visualId` trong note). Chụp lại `phone/…-s6-01-block`.

### 2. Nhãn "đứng yên" gắn cho 0 + 9 = 9, trái cách đi trên trục số của chính bài (LL-17)

- Vị trí: hàng 2 của `visual.cong-voi-0-vi-du` (`{ tex: "\\concept{slate}{0} + 9 = 9", tag: tag("đứng yên", NOTE) }`), hình này hiện ở màn quy tắc `$.sections[5].blocks[1]`, `$.sections[5].recap`, `$.cards[5].recap` (`section.cong-voi-0`, `card.cong-voi-0`) - LL-17
- Nguồn: tr.50, `sbt-p50.png`, kiến thức cần nhớ 3, gạch đầu dòng 4 (a + 0 = 0 + a = a)
- Vấn đề: câu quy tắc phần 3, 4 dạy "từ số đầu đi sang phải/trái". Với 0 + 9 thì số đầu là 0, điểm đi từ 0 sang phải 9 đơn vị, không đứng yên. Nhãn chỉ đúng ở hàng 1, (−4) + 0. Bé áp nhãn này vào câu luyện `cong-0-voi-am12`, tức 0 + (−12), sẽ để điểm đứng ở 0 và trả lời 0. Hình hiện ở recap card, thứ duy nhất bé thấy ở phiên ôn.
- Sửa: hàng 2 đổi thành `tag("từ 0 sang phải 9", POSITIVE)`, cùng kiểu nhãn với `cong-duong-vi-du`; hàng 1 giữ "đứng yên". Nhãn trợ năng của hình đổi theo câu quy tắc mới ở Nên sửa 5.

### 3. Lý do `wrong` b của `tinh-am5-am2` nói "−3 là hiệu của 5 và 2", sai toán (LL-17)

- Vị trí: `$.exercises[26].explain.wrong[0].text` (`ex.tinh-am5-am2`, câu kiểm tra của `section.cung-dau`) - LL-17
- Nguồn: —
- Vấn đề: hiệu của 5 và 2 là 5 − 2 = 3; −3 là hiệu 2 − 5. Bài đang dạy phép trừ số nguyên và có khái niệm "hiệu", nên câu sai trong khung "Giải thích" (ảnh `phone/080-s7-04-exercise-tinh-am5-am2-correct.png`) dạy sai đúng khái niệm bé sắp học.
- Sửa: "−3 là lấy 5 trừ 2 rồi viết dấu − ở trước. Hai số âm thì ta cộng hai phần số tự nhiên, không trừ." (dùng động từ của Nên sửa 6).

### 4. Dòng ví dụ thứ hai của mẹo "Cộng hoặc trừ đi một số âm" bị cắt mất kết quả trên điện thoại (LL-12, LL-20)

- Vị trí: `$.sections[9].blocks[3].tex` (`tip.hai-dau-lien-nhau`, `section.tru-so-am`), cùng mẹo ở trang "Mẹo hay" - LL-12, LL-20
- Nguồn: —
- Vấn đề: dòng `(-3) + (-4) = (-3) - 4 = -7` rộng hơn khung mẹo trên điện thoại; màn chỉ hiện "(−3) + (−4) = (−3) − 4 =" rồi hết (tổng hợp đã mở `phone/113-s10-04-block.png`; cùng lỗi ở `phone/003-tips-2.png`, `phone/004-tips-3.png`; iPad hiện đủ). Dòng này do câu "Sửa" của vòng 1 thêm vào để cho thấy dấu của kết quả vẫn phải tính, nay đúng phần đó bị mất và bé thấy phép tính kết thúc bằng dấu "=" treo. Walk không đo tràn trong TeX của mẹo nên không báo. Thêm nữa: dòng 1 dừng ở "6 + 2" không có kết quả, và (−3) + (−4) = −7 lặp đúng chuyện nợ, hình `cung-dau-vi-du` của phần 7 (Góp ý 1 nhóm 3, gộp vào đây).
- Sửa: `\begin{gathered} 6 - (-2) = 6 + 2 = 8 \\ 3 + (-4) = 3 - 4 = -1 \end{gathered}` (mỗi dòng ngắn hơn dòng bị cắt; dòng 2 vẫn là ví dụ "hai dấu khác nhau thành −"; 3 + (−4) chưa có trong bài). Chụp lại màn điện thoại của phần 10 và trang "Mẹo hay"; nếu vẫn chạm mép thì tách mỗi dòng thành hai dòng `gathered`.

## Nên sửa

### 1. Ba câu quy tắc đi trên trục số nói "của số đó"/"của số âm", đọc được là số đầu (LL-10, LL-20)

- Vị trí: câu quy tắc, recap section, recap card của `section.cong-so-duong` (`$.sections[2].blocks[1].children[0].text`, `$.sections[2].recap.caption`, `$.cards[2].recap.caption`), `section.cong-so-am` (`$.sections[3]…`, `$.cards[3]…`), `section.tru-so-am` (`$.sections[9].blocks[1].children[0].text`, `$.sections[9].recap.caption`, `$.cards[9].recap.caption`) - LL-10, LL-20
- Nguồn: tr.50, `sbt-p50.png`, mục 3, 4
- Vấn đề: "Cộng với một số dương thì từ số đầu đi sang phải, số đơn vị bằng phần số tự nhiên của số đó." Danh từ gần "số đó" nhất là "số đầu": bé đọc theo chữ sẽ tính (−3) + 5 bằng cách đi sang phải 3. Câu phần 10 viết "của số âm", nên ba câu cùng khuôn có hai cách nói; và "của số âm" cũng mơ hồ khi cả hai số đều âm, như câu luyện `tinh-am3-tru-am5`, (−3) − (−5). Câu này lấy từ câu "Sửa" của vòng 1 (tổng hợp mở rộng phát hiện của nhóm 1 sang phần 10).
- Sửa: đổi đuôi cả ba câu thành "của số thứ hai" (không dùng "số sau", dễ lẫn với thuật ngữ "số liền sau"):
  - phần 3: "Cộng với một số dương thì từ số đầu đi sang phải, số đơn vị bằng phần số tự nhiên của số thứ hai." (24 âm tiết)
  - phần 4: như trên, "số âm", "sang trái".
  - phần 10: "Trừ đi một số âm thì từ số đầu đi sang phải, số đơn vị bằng phần số tự nhiên của số thứ hai." (24 âm tiết)
  - Đổi cùng lúc note, recap section, recap card của mỗi phần.

### 2. Note mở đầu phần 2 định nghĩa số đối bằng "cách gốc O bằng nhau", bỏ "ở hai bên gốc O" (LL-05)

- Vị trí: `$.sections[1].blocks[0].children[0].text` (`section.so-doi`) - LL-05
- Nguồn: tr.50, `sbt-p50.png`, ý 2; câu quy tắc số đối của Bài 13 (`tap-hop-cac-so-nguyen`): "cách gốc O bằng nhau nhưng ở hai bên gốc O"
- Vấn đề: "Hai số này cách gốc O bằng nhau nên gọi là hai số đối nhau." Theo câu này, một số "cách gốc O bằng nhau" với chính nó. Câu cũng không nối khoảng cách với "phần số tự nhiên" của câu quy tắc ngay sau. Phần còn sót của Nghiêm trọng 3 vòng 1.
- Sửa: "Có 5 nghìn đồng ghi 5, nợ 5 nghìn đồng ghi −5. Hai số này ở hai bên gốc O và cùng cách O 5 đơn vị, nên là hai số đối nhau." (khớp hai mũi tên "5 đơn vị" của hình `so-doi-truc`).

### 3. Câu kho ôn `dien-so-doi` có nhiễu loại được mà không cần kiến thức, lời giải nói quy tắc cách thứ ba (LL-14)

- Vị trí: `$.exercises[7].segments`, `.bank`, `.explain.text` (`ex.dien-so-doi`, card `so-doi`) - LL-14
- Nguồn: —
- Vấn đề: đề in sẵn "cùng phần số tự nhiên và khác ___", ngân hàng "dấu", "phần số", "số 0": "phần số" trái ngay vế đầu, "số 0" vô nghĩa, nên bé chọn "dấu" mà không cần nhớ. Lời giải "chỉ khác nhau ở dấu, còn phần số tự nhiên giống nhau" là cách nói thứ ba của câu quy tắc.
- Sửa: hai chỗ trống "Hai số đối nhau có cùng ___ nhưng khác ___.", ngân hàng "phần số tự nhiên", "dấu", "số 0"; `accept` b1 "phần số tự nhiên", b2 "dấu". Lỗi thật cần đo là đảo chỗ hai từ. Không thêm nhiễu "phần dấu" (nhóm 1 đề xuất): "khác phần dấu" cũng đúng, thành hai đáp án đúng (LL-01). `explain`: "Hai số đối nhau có cùng phần số tự nhiên nhưng khác dấu, ví dụ 5 và −5."

### 4. Lựa chọn d (−8) + 0 của `chon-tong-bang-0` cần quy tắc cộng với 0, nay dạy ở phần sau, và đã mất lý do `wrong` (LL-09, LL-20)

- Vị trí: `$.exercises[17].options[3]`, `.explain.wrong` (`ex.chon-tong-bang-0`, câu kiểm tra của `section.tong-so-doi`) - LL-09, LL-20
- Nguồn: —
- Vấn đề: vòng 1 tách "cộng với 0" thành `section.cong-voi-0` đứng sau, nhưng giữ lựa chọn d. Bé gặp (−8) + 0 trước khi học quy tắc (`pitfalls.md`: nhiễu phải dùng ý đã dạy); chọn d thì bị chấm sai mà khung giải thích không nói vì sao.
- Sửa: bỏ lựa chọn d, còn 3 lựa chọn như `so-doi-cua-am-9` (không thay bằng "8 + 8": vòng 1 đã bỏ nhiễu này vì ít ai chọn). Lỗi "có số 0 thì tổng bằng 0" đã được đo ở `chon-cong-0` của phần 6.

### 5. Câu quy tắc "Cộng với 0 thì số không đổi" không nói tới 0 + a, mà câu luyện và hình dùng 0 + a (LL-06)

- Vị trí: `$.sections[5].blocks[1].children[0].text`, `$.sections[5].recap.caption`, `$.cards[5].recap.caption`; nhãn trợ năng `cong-voi-0-vi-du`; `explain.text` của `$.exercises[22]` (`chon-cong-0`), `[23]` (`cong-0-voi-am12`), `[24]` (`chon-tong-am5-voi-0`); `$.exercises[25]` (`dien-cong-voi-0`) (`section.cong-voi-0`) - LL-06
- Nguồn: tr.50, kiến thức cần nhớ 3, gạch đầu dòng 4 (a + 0 = 0 + a = a)
- Vấn đề: theo chữ, "cộng với 0" là a + 0. Lời giải của `cong-0-voi-am12` áp câu này vào 0 + (−12), trường hợp câu không nói tới; tính chất đổi chỗ dạy ở phần 11, sau phần này.
- Sửa: "Cộng một số với 0, hay cộng 0 với một số, thì được chính số đó." (16 âm tiết) ở note, recap section, recap card, nhãn trợ năng của hình. Lời giải lặp câu này (vd `cong-0-voi-am12`: "Cộng 0 với một số thì được chính số đó. Vậy 0 + (−12) = −12."). `dien-cong-voi-0`: "Cộng một số với 0 thì được ___.", ngân hàng "chính số đó", "0", "số đối của nó".

### 6. Câu quy tắc phần 7 nói "viết dấu − ở trước", lời giải và hình gợi ý cùng bài vẫn nói "đặt dấu −", có chỗ giữ cụm của sách (LL-05, LL-20)

- Vị trí: `explain.text` của `$.exercises[26]` (`tinh-am5-am2`), `[27]` (`tinh-am8-am5`: "rồi đặt dấu − trước kết quả"), `[28]` (`chon-tong-am9`), `[29]` (`hung-no-tien`), `[30]` (`noi-tong-cung-dau`), `[38]` (`tinh-am2-tru-5`); `wrong` của `[26]` (b, c) và `[13]` (`no-tien-an`, d); `visual.goi-y-am8-am5` (nhãn "cộng 8 với 5, đặt dấu −" và nhãn trợ năng) - LL-05, LL-20
- Nguồn: tr.50, kiến thức cần nhớ 3, gạch đầu dòng 1 ("rồi đặt dấu "−" trước kết quả")
- Vấn đề: bản sửa vòng 1 viết lại câu quy tắc, recap section, recap card thành "viết dấu − ở trước" nhưng để nguyên 9 chỗ "đặt dấu −" ở lời giải và hình gợi ý: một thao tác hai tên ngay trong một phần. `tinh-am8-am5` còn giữ nguyên cụm của sách.
- Sửa: đổi mọi "đặt dấu −" thành "viết dấu − ở trước" (nhãn hình: "cộng 8 với 5, viết dấu −"). `tinh-am8-am5`: "Cộng 8 với 5 được 13, rồi viết dấu − ở trước: −13."

### 7. Phần số tự nhiên được gọi tắt bốn cách ở phần 8; "Phần 5" trùng tên section; nhãn chọn dấu mang hai màu (LL-05, LL-10)

- Vị trí: note cùng làm `$.sections[7].blocks[2].children[0].text` ("Phần 5 lớn hơn phần 3"); nhãn ba hàng `visual.khac-dau-vi-du` ("phần 7 lớn hơn: dấu +", màu `POSITIVE`/`NEGATIVE`; hình ở màn quy tắc, recap section, recap card); `visual.goi-y-am9-cong4` (nhãn "phần 9 lớn hơn: dấu −" màu `NOTE`, nhãn trợ năng "phần lớn trừ phần nhỏ, dấu của số xa gốc O hơn"); `explain.text` của `$.exercises[31]` (`tinh-7-cong-am10`: "Phần 10 lớn hơn phần 7 và có dấu −"), `wrong` của `[31]` ("Số có phần lớn hơn", "trừ hai phần số") và `[34]` (`chon-tong-duong`: "vì phần 7 lớn hơn và có dấu −", "vì phần 10 lớn hơn…") - LL-05, LL-10
- Nguồn: tr.50, ý 1
- Vấn đề: vòng 1 (Nên sửa 1) yêu cầu một cách gọi cho cả bài; phần 8 vẫn có "phần 10", "phần lớn", "phần số", "phần nhỏ". App in tiêu đề "Phần 8: Cộng hai số khác dấu", nên "Phần 5 lớn hơn phần 3" ngay dưới đọc được thành so sánh hai section (`phone/088-s8-03-block.png`). "Phần 10 … có dấu −" gán dấu cho phần số tự nhiên, trái câu quy tắc phần 1. Tổng hợp thêm: cùng một kiểu nhãn chọn dấu mà hình quy tắc tô theo dấu, hình gợi ý tô violet.
- Sửa:
  - Lời giải `tinh-7-cong-am10`: "−10 có phần số tự nhiên lớn hơn, nên kết quả mang dấu −. Lấy 10 − 7 = 3, vậy kết quả là −3."; `wrong` c: "17 là tổng của 7 và 10. Hai số khác dấu thì ta trừ hai phần số tự nhiên, không cộng."; `wrong` của `chon-tong-duong`: "(−7) + 3 = −4, vì −7 có phần số tự nhiên lớn hơn."
  - Nhãn hình bỏ chữ "phần": "mang dấu của 7", "mang dấu của −8", "mang dấu của −5" (`khac-dau-vi-du`), "mang dấu của −9" màu `NEGATIVE` (`goi-y-am9-cong4`); nhãn trợ năng của `goi-y-am9-cong4` theo câu quy tắc.
  - Note cùng làm: "Cùng làm: bấm mũi tên trái 5 lần để tính 3 + (−5). −5 có phần số tự nhiên lớn hơn, nên tổng mang dấu −." (nếu áp Góp ý 10 thì dùng số mới ở đó).

### 8. Mẹo `dau-truoc` nói lại câu quy tắc bằng cách nói thứ hai và không chỉ ra lỗi cần tránh (LL-05)

- Vị trí: `$.sections[7].blocks[3]` (`tip.dau-truoc`, `kind` "tránh sai") - LL-05
- Nguồn: tr.50, kiến thức cần nhớ 3, gạch đầu dòng 3
- Vấn đề: mẹo đúng với mọi đầu vào (bảng thử ở `nhom-2-v2.md`), nhưng: "ở xa gốc O hơn" là tên thứ hai cho "có phần số tự nhiên lớn hơn" của câu quy tắc ngay trên; `kind` "tránh sai" mà chữ không nói tránh lỗi nào; ví dụ (−8) + 5 có dấu tổng trùng dấu số đầu nên không cho thấy lỗi hay gặp nhất (lấy dấu của số đầu). Vòng 1 Góp ý 9 mới sửa được một nửa.
- Sửa: `text` "Khi cộng hai số khác dấu, hãy tìm dấu của tổng trước rồi mới trừ. Tổng mang dấu của số có phần số tự nhiên lớn hơn, không phải dấu của số đầu. Gặp phép trừ thì đổi thành cộng với số đối trước." (16, 21, 11 âm tiết; "số đầu" như câu quy tắc phần 3, 4). `tex` `\begin{gathered} 2 + (-9) \\ = -(9 - 2) \\ = -7 \end{gathered}` (số đầu dương, tổng âm; chưa có trong bài). Đã thử: 2 + (−9) ra −7, (−6) + 15 ra 9, 3 − 8 đổi thành 3 + (−8) ra −5, (−2) − 5 đổi thành (−2) + (−5) nên mẹo không dùng.

### 9. Lời giải `tinh-9-am4-am9-3` tô số giữa mà không tô kết quả cuối (LL-05)

- Vị trí: `$.exercises[46].explain.tex` (`ex.tinh-9-am4-am9-3`, `section.tinh-chat`) - LL-05
- Nguồn: —
- Vấn đề: `= \concept{slate}{0} + (\concept{pink}{-1}) = -1`: 0 và −1 ở giữa mang màu, kết quả cuối không (`phone/129-s11-06-…-correct.png`). Mọi lời giải khác tô kết quả cuối theo dấu. Vòng 1 (Nên sửa 26) đã nêu đích danh câu này.
- Sửa: `= 0 + (-1) = \concept{pink}{-1}`, như `tinh-am7-4-7-am1`.

### 10. Câu kiểm tra phần 12 lặp phép tính của chuyện và recap phần 4; card có ba đáp án −3 (LL-07)

- Vị trí: `$.exercises[50]` (`ex.gia-tri-b-x-2`: B = x + (−5), x = 2, tức 2 + (−5) = −3) so với note mở đầu `$.sections[3].blocks[0]`, hình `trai-2-cong-am5` và hàng 1 của `cong-am-vi-du` (recap card `cong-so-am`); cùng card `gia-tri-bieu-thuc` còn `gia-tri-m-x-2` và `nhiet-do-chieu-toi` cũng ra −3 - LL-07
- Nguồn: —
- Vấn đề: thay x xong, bé gặp lại đúng 2 + (−5) = −3 vừa thấy ở recap card nên câu không đo được việc thay chữ bằng số rồi tính. Ba câu cùng card cùng đáp án −3 cho phép đoán theo trí nhớ ở phiên ôn (tổng hợp phát hiện thêm).
- Sửa: B = x + (−9) khi x = 1, đáp án −8; nhiễu 8 (quên dấu), 10 và −10 (cộng hai phần số tự nhiên); đổi `check.expr`, `explain`, `wrong`, id (`gia-tri-b-x-1`). Không dùng 5 + (−8) như nhóm 3 đề xuất: vẫn ra −3, và 5 − 8 = −3 đã có trong lời giải `gia-tri-m-x-2`. Đáp án −3 của `nhiet-do-chieu-toi` đổi ở Góp ý 15.

### 11. Chuyện ví của Lan nói "tiêu", "được cho", ngay sau câu quy tắc nói "chi ra", "thu vào" với cùng hai số (LL-05, LL-20)

- Vị trí: `$.sections[12].blocks[2].children[0].text`, nhãn và nhãn trợ năng của hình `tai-khoan` ("tiêu là số âm, được cho là số dương"), so với câu quy tắc `$.sections[12].blocks[1]` và hình recap `dau-doi-song` ("thu vào 35 nghìn đồng", "chi ra 20 nghìn đồng") - LL-05, LL-20
- Nguồn: —
- Vấn đề: bản sửa Góp ý 14 vòng 1 (bỏ "tài khoản", "giao dịch") dùng chữ mới lệch chữ của câu quy tắc cùng phần, trong khi recap ghi đúng hai số 35, 20 của chuyện Lan. Màn mẫu không minh hoạ chữ của câu quy tắc, và phiên ôn chỉ hiện "thu vào", "chi ra".
- Sửa: note "Ví của Lan có 50 nghìn đồng. Lan chi ra 20 nghìn, thu vào 35 nghìn mẹ cho, rồi chi ra 45 nghìn."; nhãn hình "chi ra là số âm, thu vào là số dương"; nhãn trợ năng theo chữ mới.

## Góp ý

### 1. Bốn câu thiếu lý do `wrong` cho nhiễu hay bị chọn

- Vị trí: `$.exercises[9]` (`nhiet-do-am-ap-len`, c "6"), `[13]` (`no-tien-an`, d "8"), `[31]` (`tinh-7-cong-am10`, d −17), `[36]` (`chon-phep-tru-dung`, d `3 - 7 = -10`)
- Nguồn: —
- Vấn đề: đều là lỗi hay gặp nhất của dạng (bỏ dấu −, hay cộng hai phần số tự nhiên rồi viết dấu −) nhưng không có lý do.
- Sửa: c của `nhiet-do-am-ap-len`: "6 là lấy 2 + 4 mà quên dấu − của −2. Từ −2 đi sang phải 4 thì tới 2."; d của `no-tien-an`: "8 là lấy 3 + 5. Mua hàng làm tiền ít đi, nên phải đi sang trái."; d của `chon-phep-tru-dung`: "−10 là cộng 3 với 7 rồi viết dấu − ở trước. Từ 3 đi sang trái 7 thì tới −4."; d của `tinh-7-cong-am10`: "−17 là cộng 7 với 10 rồi viết dấu − ở trước. Hai số khác dấu thì ta trừ hai phần số tự nhiên."

### 2. Ba màn liền nhau ở phần 3 cùng ra hay cùng bắt đầu ở −2 (LL-07)

- Vị trí: màn cùng làm `$.sections[2].blocks[2]` ((−5) + 3, lời kết "tới −2"), câu kiểm tra `ex.nhiet-do-am-ap-len` (bắt đầu −2), câu luyện `ex.tinh-am6-cong4` ((−6) + 4 = −2) - LL-07
- Nguồn: —
- Vấn đề: bé vừa thấy "tới −2" có thể gõ −2 theo trí nhớ.
- Sửa: câu luyện thành (−6) + 5 = −1 (sửa `check.expr`, `answer`, `explain`, id `tinh-am6-cong5`); hình gợi ý `goi-y-am5-cong2` (tới −3) vẫn dùng được, không chạm −1.

### 3. Nhãn "số đối của 5" màu violet, trong khi khái niệm số đối màu sky (LL-05)

- Vị trí: hình `so-doi-vi-du` (màn quy tắc, recap section và recap card `so-doi`); hình `so-doi-truc` ngay trước dùng sky cho hai mũi tên "5 đơn vị" - LL-05
- Nguồn: —
- Vấn đề: catalog dành violet cho nhãn bước làm, "không phải khái niệm", nhưng "số đối của 5" gọi tên đúng khái niệm số đối (sky trong glossary). Đổi sang violet giải được dấu hình thập (Nghiêm trọng 4 vòng 1) nhưng một khái niệm thành hai màu trên hai màn liền nhau.
- Sửa: cho nhãn `rows` tuỳ chọn không dấu hình như `plainTag` của trục số rồi giữ màu sky; hoặc bỏ nhãn, tô mũi tên "→" màu sky kèm `legend` "Số đối".

### 4. Cách viết −(−5) xuất hiện mà không nói dấu − trước ngoặc nghĩa là "số đối của" (LL-10)

- Vị trí: `$.sections[1].blocks[2].children[0].text` (`section.so-doi`) - LL-10
- Nguồn: tr.50, ý 2 (kí hiệu −x là số đối của x)
- Vấn đề: bé chưa biết kí hiệu này có thể đọc −(−5) thành phép trừ của phần 9, 10.
- Sửa: "−5 có phần số tự nhiên là 5, nên số đối của nó là 5. Số đối của −5 viết là −(−5), nên −(−5) = 5."

### 5. Không câu nào cho bé gặp số dương có viết dấu +

- Vị trí: card `phan-dau` (`ex.chon-dau-tru`, `ex.dien-dau-va-so`)
- Nguồn: tr.51 bài 3.8 (+207), tr.52 bài 3.11
- Vấn đề: câu quy tắc nói "Số dương có dấu +, nhưng ta thường không viết", recap phần 13 viết "+35", "+4", nhưng không câu nào cho bé nhận ra "+9" là số dương.
- Sửa: đổi một lựa chọn số dương của `chon-dau-tru` thành `+9` (không thuộc đáp án), thêm `wrong` "+9 có dấu + nên là số dương."

### 6. Note 3 phần 1 gọi phần số tự nhiên là "số 5" ngay sau câu quy tắc (LL-05)

- Vị trí: `$.sections[0].blocks[2].children[0].text` (`section.phan-dau`) - LL-05
- Nguồn: tr.50, ý 1
- Vấn đề: phần còn sót của Nên sửa 1 vòng 1; dùng đúng tên ngay sau câu quy tắc giúp bé nối tên với nghĩa.
- Sửa: "Bạn nợ 5 nghìn đồng thì ghi −5. Phần dấu − cho biết bạn đang nợ, phần số tự nhiên 5 cho biết nợ bao nhiêu."

### 7. Phần 6 không có màn cùng làm (LL-16)

- Vị trí: `$.sections[5].blocks` (2 màn) (`section.cong-voi-0`) - LL-16
- Nguồn: —
- Vấn đề: các phần cộng khác đều có màn bấm mũi tên; ý này dễ nên không chặn bài.
- Sửa: nếu `hopTry` chấp nhận đích bằng điểm đầu, thêm "Cùng làm: tính (−3) + 0. Điểm không cần đi, nó đã ở tổng." với `tryWalk(-3, -3, "Cộng 0 nên điểm vẫn ở −3.")`; không thì bỏ qua.

### 8. Nhiễu −31 của `so-cong-13` không ứng với lỗi nào (LL-14)

- Vị trí: `$.exercises[19].options[3]` (`ex.so-cong-13`) - LL-14
- Nguồn: —
- Sửa: thay bằng −12 (số liền kề, hay nhầm khi tìm số cần thêm), `wrong` d "13 + (−12) = 1, chưa bằng 0."

### 9. Đề `xep-tong-khac-dau` nói "các số" nhưng hai mục là tổng (LL-10)

- Vị trí: `$.exercises[35].prompt[0].text` (`ex.xep-tong-khac-dau`) - LL-10
- Nguồn: —
- Sửa: "Tính mỗi tổng rồi xếp các kết quả từ bé đến lớn."

### 10. Màn cùng làm phần 8 lặp đúng câu kiểm tra phần 4 (LL-07)

- Vị trí: `$.sections[7].blocks[2]` (3 + (−5) = −2) so với `$.exercises[13]` (`no-tien-an`, cũng 3 + (−5)) - LL-07
- Nguồn: —
- Vấn đề: bé đã biết kết quả −2 nên màn cùng làm không cho bé thử quy tắc dấu mới.
- Sửa: 2 + (−3) = −1: note "Cùng làm: bấm mũi tên trái 3 lần để tính 2 + (−3). −3 có phần số tự nhiên lớn hơn, nên tổng mang dấu −.", `tryWalk(2, -1, "Điểm đã đi sang trái 3 đơn vị, tới −1.")`, đổi id hình. Không dùng 2 + (−6) hay 1 + (−5) (nhóm 2 đề xuất): đã có ở `tinh-2-cong-am6` và `thang-may-tang-2`.

### 11. Câu ôn `dien-ghep-tong` dùng lại cặp 9 và −9 của câu luyện cùng card (LL-07)

- Vị trí: `$.exercises[48]` ((−9) + 5 + 9 + (−2)) so với `$.exercises[46]` (9 + (−4) + (−9) + 3) - LL-07, LL-20
- Nguồn: —
- Sửa: (−11) + 5 + 11 + (−2) = 3 (sửa `segments`, `explain`); không dùng 8 và −8 (đã ở `PAIR_ROWS`).

### 12. Hình recap phần 12 không ghi biểu thức A là gì; câu luyện đặt tên A cho biểu thức khác (LL-15)

- Vị trí: hình `gia-tri-x-12` (`VALUE_ROWS`, recap của `section.gia-tri-bieu-thuc`, `card.gia-tri-bieu-thuc`); `ex.gia-tri-a-x-am4` (A = x + 6 − 9) - LL-15
- Nguồn: —
- Vấn đề: ở phiên ôn bé thấy "A = 12 + (−4) − 6, thay x bằng 12" mà không thấy A = x + (−4) − 6 (chỉ có trong nhãn trợ năng).
- Sửa: thêm dòng đầu `A = x + (-4) - 6` vào `VALUE_ROWS`; câu `gia-tri-a-x-am4` đổi tên biểu thức thành C (id `gia-tri-c-x-am4`).

### 13. Màn cùng làm phần 12 mở bằng "Cùng làm: x = 5." không nói tính gì (LL-10)

- Vị trí: `$.sections[11].blocks[2].children[0].text` - LL-10
- Nguồn: —
- Sửa: "Cùng làm: tính A khi x = 5. Bấm mũi tên trái 4 lần, rồi trái 6 lần để tính 5 + (−4) − 6."

### 14. Mẹo "Tổng có hai số đối nhau" có thể bị áp vào biểu thức có phép trừ (LL-24)

- Vị trí: `$.sections[10].blocks[2]` (`tip.ghep-so-doi`) - LL-24
- Nguồn: —
- Vấn đề: bài không có câu dạng 9 − 4 + (−4) nên không chặn; nhưng phần 12, 13 trộn cộng trừ, bé thấy 4 và (−4) có thể ghép ra 9 (đúng là 1).
- Sửa: thêm câu 3 "Có phép trừ thì đổi thành cộng với số đối trước." (mẹo thành 3 câu, cùng cách nói với câu 3 đề xuất ở Nên sửa 8).

### 15. Bước đầu của hai câu phần 12, 13 lặp ví dụ phần 8 (LL-07)

- Vị trí: `$.exercises[54]` (`nhiet-do-chieu-toi`: 7 + (−4) như chuyện An và hàng 1 `khac-dau-vi-du`), `$.exercises[57]` (`tien-cua-nam`: 4 + (−9) như `tinh-am9-cong4`) - LL-07
- Nguồn: —
- Sửa: `nhiet-do-chieu-toi`: "Chiều giảm 8 độ, tối giảm thêm 2 độ, nên nhiệt độ tối là x + (−8) + (−2) độ. Trưa nhiệt độ là 4 độ." (4 + (−8) = −4, rồi −6; bỏ luôn đáp án −3 thứ ba của card, Nên sửa 10). `tien-cua-nam`: "Nam có 2 nghìn đồng, chi 10 nghìn đồng (ghi nợ phần còn thiếu), rồi mẹ cho thêm 4 nghìn đồng." (2 + (−10) = −8, rồi −4). Không dùng 8 + (−4) + (−6) và 3 + (−8) + 2 (nhóm 3 đề xuất): ra −2, −3 đã dày đặc trong bài. Sửa `check.expr`, `answer`, `explain`.

### 16. Hình `rows` xếp nhãn lúc bên phải, lúc bên dưới (bố cục app, báo người làm app)

- Vị trí: `cong-duong-vi-du` (`phone/031-s3-02-block.png`, `phone/042-s3-06-recap.png`), `cong-am-vi-du` (`phone/046-s4-02-block.png`, `phone/053-s4-06-recap.png`), `khac-dau-vi-du` trên iPad dọc (`ipad/087-s8-02-block.png`, còn từ Góp ý 10 vòng 1) - LL-12
- Nguồn: —
- Vấn đề: các phép tính zigzag, khó dò cột.
- Sửa: báo người làm app: khi có một hàng phải đưa nhãn xuống dưới thì mọi hàng cùng kiểu. Không chặn bài; nhãn ngắn hơn ở Nên sửa 7 có thể làm `khac-dau-vi-du` thẳng hàng.

### 17. Phép tính viết trong chữ bị ngắt dòng giữa chừng trên điện thoại (bố cục app, báo người làm app)

- Vị trí: `$.sections[4].blocks[0]` ("Vậy 4 +" / "(−4) = 0.", `phone/056-s5-01-block-end.png`); `explain.text` của `$.exercises[31]` (`phone/092-…-correct`), `[23]` (`phone/071-…-correct`) - LL-12
- Nguồn: —
- Sửa: báo người làm app (dấu cách không ngắt quanh dấu phép tính trong chữ); không chặn bài.

### 18. Bàn phím số có phím "mũ" ở bài không dùng luỹ thừa (bố cục app, báo người làm app)

- Vị trí: mọi câu `numeric`
- Nguồn: —
- Vấn đề: còn từ Góp ý 15 vòng 1.
- Sửa: báo người làm app; không chặn bài.

## Bảng LL của vòng 2

Chỉ đếm phát hiện mới của vòng này, mỗi phát hiện một lần theo id LL đầu tiên ghi ở mục. Không đếm phần còn sót từ vòng 1 (Nên sửa 2, 7, 9; Góp ý 6, 18).

| Id LL | Nghiêm trọng | Nên sửa | Góp ý |
|---|---|---|---|
| LL-05 | 0 | 3 | 1 |
| LL-06 | 0 | 1 | 0 |
| LL-07 | 0 | 1 | 4 |
| LL-09 | 0 | 1 | 0 |
| LL-10 | 0 | 1 | 3 |
| LL-12 | 1 | 0 | 2 |
| LL-14 | 0 | 1 | 1 |
| LL-15 | 1 | 0 | 1 |
| LL-16 | 0 | 0 | 1 |
| LL-17 | 2 | 0 | 0 |
| LL-24 | 0 | 0 | 1 |

Sinh từ bản sửa vòng 1 (LL-20, ghi kèm, chưa đếm ở bảng trên): Nghiêm trọng 1, 4; Nên sửa 1, 4, 6, 11; Góp ý 3, 11. Nếu tính LL-20 là mục chính cho các phát hiện này thì LL-20 có 2 Nghiêm trọng, 4 Nên sửa, 2 Góp ý. Không gắn mục LL: Góp ý 1, 5. Tổng vòng này: 4 Nghiêm trọng, 11 Nên sửa, 18 Góp ý (mới: 4 Nghiêm trọng, 8 Nên sửa, 16 Góp ý).
