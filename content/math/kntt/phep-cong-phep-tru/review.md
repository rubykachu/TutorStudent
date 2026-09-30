# Review: Phép cộng và phép trừ số tự nhiên (`phep-cong-phep-tru`)

- Bài: `content/math/kntt/phep-cong-phep-tru/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/phep-cong-phep-tru/` - sbt-p14, sbt-p15, sbt-p16, sbt-p96, sbt-p97, sbt-p98
- `content:check`: 0 lỗi, 0 cảnh báo của bài (134 id chưa khoá)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-cong-phep-tru/` (ảnh walk chụp trước khi nạp lại nội dung nên màn công thức `ket-hop` hiện bản cũ; các ảnh khác đúng bản hiện tại)
- Kết luận: Chưa đạt: còn 3 lỗi Nghiêm trọng
- Bản đã review: `cca6a75bb5d36afb1bb2279abe7205c6f391d5262d1789c2b34adc55ab3a1ac8` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

### 1. Quy tắc mượn của đặt tính trừ sai ở hàng chục, và mỗi chỗ nói một kiểu

- Vị trí: `$.sections[9].blocks[1].children[0].text`, `$.sections[9].blocks[2].children[0].text`, `$.sections[9].recap.caption`, `$.cards[9].recap.caption` (`section.dat-tinh-tru`, `card.dat-tinh-tru`); đề `$.exercises[51]` (`ex.cot-tru-hang-chuc`), `$.exercises[53]` (`ex.chon-muon`); nhãn "Số mượn" và chip "−1 +10" trong `src/visuals/math/phep-cong-phep-tru/column.tsx`
- Nguồn: tr.14, `sbt-p14.png` (đặt tính: trừ các chữ số cùng hàng, thẳng cột)
- Vấn đề: Note và cả hai recap nói "mượn 1 chục từ hàng bên trái". Câu này chỉ đúng ở hàng đơn vị; khi trừ ở hàng chục, cái mượn là 1 trăm (10 chục). Hình `cot-tru-co-muon` (532 − 247) và recap `cot-tru-tom-tat` (824 − 359) đều có một lần mượn ở hàng chục, nên quy tắc mâu thuẫn với chính ví dụ của nó. Recap lại bỏ mất nửa sau "hàng bên trái bớt đi 1", là chỗ trẻ hay quên nhất (câu `cot-tru-hang-chuc` hỏi đúng chỗ này). Cùng một thao tác đang được nói bốn cách: "mượn 1 chục" (note, recap, `chon-muon`), "bớt đi 1" (note), "bị mượn mất 1" (`cot-tru-hang-chuc`), "số mượn" bằng 1 trên stepper trong khi chip trên cột ghi "+10". Trẻ phải nhớ một câu recap sai toán học.
- Sửa: Chọn một câu đúng cho mọi hàng và dùng y nguyên ở note, recap section, recap card: "Chữ số trên nhỏ hơn chữ số dưới thì mượn 1 ở hàng bên trái: chữ số trên thêm 10, hàng bên trái bớt đi 1." Đề `cot-tru-hang-chuc` viết "Hàng chục đã cho mượn nên bớt đi 1."; `chon-muon` giữ "mượn 1 chục" vì đang ở hàng đơn vị. Xem thêm mục Nên sửa 6 về chữ "nhớ".

### 2. Ví dụ tên gọi chép đúng hình của sách bài tập (25 + 11 = 36 và 36 − 11 = 25)

- Vị trí: `$.sections[0].blocks[0].children[1]` (visual `cong-ten`, caption "An có 25 nghìn đồng…"), `$.sections[1].blocks[0].children[1]` (visual `tru-ten`, caption "Có 36 nghìn đồng…"); dùng lại cùng cặp số ở `$.sections[10].blocks[0].children[0].text` và `children[1]` (note và visual `quan-he-ba-so` của section `quan-he`)
- Nguồn: tr.14, `sbt-p14.png` (mục A, hai sơ đồ tên gọi của phép cộng và phép trừ)
- Vấn đề: Hai màn quy tắc đầu bài lặp lại đúng hai phép tính, đúng thứ tự nhãn và cách chỉ mũi tên của sơ đồ trong sách bài tập; note và hình của `quan-he` dùng lại đúng bộ 25, 11, 36. Trục "Biên soạn lại, không chép" xếp ví dụ trùng sách vào mức Nghiêm trọng.
- Sửa: Đổi số trong `VISUAL_SPECS["cong-ten"]`, `["tru-ten"]`, `["quan-he-ba-so"]` và note của `quan-he` (vd 32 + 15 = 47, 47 − 15 = 32), sửa caption cho khớp. Chọn cặp số chưa có trong các câu kho ôn của các card đó.

### 3. Câu sắp xếp `sap-day-so` có hai thứ tự đúng

- Vị trí: `$.exercises[78].items` (`ex.sap-day-so`)
- Nguồn: tr.16 bài 1.34a, tr.97 đáp án 1.34a (`sbt-p16.png`, `sbt-p97.png`)
- Vấn đề: Bước `s1` (14 + 20 = 34) và `s2` (16 + 18 = 34) độc lập với nhau. Làm 16 + 18 trước rồi 14 + 20 vẫn đúng và vẫn ra 68, nhưng app chấm sai. Câu hỏi có hai đáp án đúng.
- Sửa: Cho mỗi bước dựa vào bước trước, ví dụ gộp hai cặp thành một mục: `(14 + 20) + (16 + 18)` → `34 + 34` → `68`; hoặc đổi sang `numeric`/`choice`.

## Nên sửa

### 1. Tên "tính chất kết hợp" gán cho việc nhóm hai số bất kỳ, kể cả hai số không đứng cạnh nhau

- Vị trí: `$.sections[3].blocks[0].children[0].text`, `$.sections[3].recap.caption`, `$.cards[3].recap.caption` (`card.ket-hop`); `$.exercises[16]` (`ex.tinh-nhom-1`, 5 + 8 + 5), visual `ket-hop-tu-lam` ([4, 9, 6])
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: "Cộng ba số thì nhóm hai số nào trước cũng được" gộp hai tính chất vào một tên. Ví dụ mẫu chỉ nhóm hai số đứng cạnh nhau, nhưng câu luyện tập và màn tự làm bắt nhóm số thứ nhất với số thứ ba, tức là phải đổi chỗ trước. Section `ghep-tron` ngay sau lại nói "Đổi chỗ và nhóm", nên hai section mô tả cùng thao tác bằng hai quy tắc khác nhau. Trẻ sẽ nhớ "kết hợp = nhóm bất kỳ" và không phân biệt được với giao hoán.
- Sửa: Note và hai recap: "Cộng ba số, cộng hai số đầu trước hay hai số sau trước thì tổng vẫn như nhau. Đó là tính chất kết hợp." Trong section này chỉ dùng số mà cặp tròn chục đứng cạnh nhau (vd `tinh-nhom-1`: 8 + 5 + 5; `ket-hop-tu-lam`: [9, 4, 6]); để dạng ghép số đầu với số cuối cho `ghep-tron`.

### 2. Màn tự làm của `ket-hop` và `ghep-tron` là cùng một hoạt động

- Vị trí: `$.sections[3].blocks[2]` (`ket-hop-tu-lam`, [4, 9, 6], unit 10), `$.sections[5].blocks[1]` (`ghep-tron-tu-lam`, [27, 45, 13], unit 10); câu kho ôn `ex.chon-cap-cham`
- Nguồn: tr.14–15, `sbt-p14.png`, `sbt-p15.png`
- Vấn đề: Hai note gần như trùng chữ ("Chạm hai số có tổng tròn chục…") và hai màn cùng thao tác. Phần mới của `ghep-tron` (tròn trăm, số ba chữ số) không có màn cùng làm.
- Sửa: Màn của `ket-hop` cho chọn cách nhóm (a + b) + c hay a + (b + c). Màn của `ghep-tron` đặt `unit: 100` với số hai–ba chữ số (vd [35, 128, 65]).

### 3. Hình ví dụ cộng với 0 có số đồng xu không khớp số trong phép tính

- Vị trí: `$.sections[4].blocks[0].children[1]` (`cong-0-vi`, n = 12), `$.sections[4].recap`, `$.cards[4].recap` (`cong-0-tom-tat`, n = 9); `ZeroWallet` trong `src/visuals/math/phep-cong-phep-tru/parts.tsx` (`MAX_COINS = 6`)
- Nguồn: Kiến thức nền (tiểu học)
- Vấn đề: Ảnh walk `phone/058-s5-01-block.png`, `phone/066-s5-04-recap.png` vẽ 6 đồng xu cạnh "12 + 0 = 12" và "9 + 0 = 9". Trẻ học chậm hay đếm hình để kiểm tra số.
- Sửa: Chọn n ≤ 6 cho cả hai hình, hoặc ghi số tiền trên ví thay cho các đồng xu rời.

### 4. Màu hổ phách của "Tổng" dùng cho những thứ không phải tổng

- Vị trí: đồng xu của `cong-0-vi`, `cong-0-tom-tat` (`parts.tsx`); số nhớ và stepper "Số nhớ" của `cot-cong-*` (`CARRY_COLOR = "amber"` trong `column.tsx`); "■ Chữ số hàng đơn vị" của `chu-so-cuoi-mau`, `chu-so-cuoi-tom-tat`, `kiem-tra-tom-tat` (`LastDigit` trong `quick-check.tsx`); số của nhóm khi đã thành số hạng ở dòng cuối của `ket-hop-nhom`, `ket-hop-tom-tat`, `ghep-tron-mau`, `ghep-tron-tom-tat` ("7 + 10 = 17", "268 + 100 = 368")
- Nguồn: —
- Vấn đề: Glossary gán `tổng: amber`, và mọi hình ghép cặp có chú giải "■ Tổng". Nhưng cùng màu, có khi cùng dấu ■, đang tô số nhớ (ảnh `110-s9-02-block-end.png`, `123-s9-06-recap.png`), chữ số hàng đơn vị của các số hạng (`213-s16-01-block.png`, `227-s16-06-recap.png`), đồng xu ở vị trí số hạng, và số 10/100 khi nó là số hạng. Một màu mang nhiều nghĩa trên cùng một bài, trẻ dễ hiểu số nhớ là một phần của tổng.
- Sửa: Chỉ tô hổ phách phần là tổng. Số nhớ, chữ số hàng đơn vị của số hạng và đồng xu dùng một màu trung tính (xám như chip mượn của phép trừ), bỏ `ConceptMark` ở đó; số của nhóm ở dòng cuối tô màu số hạng, giữ khung lime quanh nhóm.

### 5. Dòng phép trừ trong hình tô bằng màu của phép cộng

- Vị trí: `$.sections[7].blocks[1].children[1]` (`tru-them-tron`), `$.sections[7].recap`, `$.cards[7].recap` (`tru-them-tom-tat`), `$.exercises[38].hints` (`hint-shift-tru-71-18`, `giai-shift-tru-91-38`); `ResultLine` trong `src/visuals/math/phep-cong-phep-tru/shift.tsx`
- Nguồn: —
- Vấn đề: Ảnh walk `096-s8-02-block.png`, `105-s8-05-recap.png`: "83 − 29 = 54" có 83, 29 xanh dương (số hạng), 54 hổ phách (tổng), trong khi thanh ngay dưới tô số bị trừ tím, số trừ hồng, hiệu teal. `ResultLine` luôn dùng blue/amber. Một khái niệm hai màu ngay trên màn recap.
- Sửa: `ResultLine` chọn màu theo phép tính: `op === "sub"` thì violet, pink, teal (lấy từ `PALETTE` như `column.tsx`).

### 6. Chữ "nhớ" vừa là số nhớ của phép cộng, vừa là "hãy nhớ" ở phép trừ

- Vị trí: `$.sections[9].blocks[2].children[0].text` ("Nhớ mượn thì hàng bên trái bớt đi 1.")
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Section ngay trước dạy "nhớ 1 sang hàng bên trái" và "Số nhớ" là thuật ngữ của đặt tính cộng. Câu "Nhớ mượn thì…" đọc được thành "số nhớ và số mượn", trộn hai thao tác của hai phép tính đúng ở chỗ trẻ đang học phân biệt chúng.
- Sửa: "Đã mượn thì hàng bên trái bớt đi 1." (hoặc câu chung ở mục Nghiêm trọng 1).

### 7. Cùng một ý, hai cách nói giữa note và recap

- Vị trí: `$.sections[7].blocks[0].children[0].text` ("số trừ thành số tròn") so với "số tròn chục" ở mọi chỗ khác; `$.sections[11].blocks[0].children[0].text` ("số hạng kia") so với recap "số hạng đã biết"; `$.sections[13].blocks[0].children[0].text`, `$.sections[13].recap.caption`, `$.cards[13].recap.caption` ("số bị trừ trừ hiệu") so với câu đầu của note ("trừ đi hiệu")
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Người học chậm nhớ theo câu chữ; hai cách nói cho một ý khiến recap không còn khớp note. "Số tròn" chưa được giải thích, còn "số bị trừ trừ hiệu" có hai chữ "trừ" liền nhau, đọc to dễ vấp. Note của `tim-so-bi-tru` và `tim-so-tru` còn nói một ý hai lần.
- Sửa: Dùng "số tròn chục" ở `them-bot-tru`; "số hạng đã biết" ở cả note và recap `tim-so-hang`; mỗi note tìm x giữ một câu, dùng thống nhất "trừ đi" (vd "Muốn tìm số trừ, lấy số bị trừ trừ đi hiệu.") ở note, recap section và recap card.

### 8. Câu kho ôn hỏi lại đúng ví dụ của màn recap

- Vị trí: `$.exercises[3]` (`ex.dien-ten-tong`, 30 + 12 = 42) với recap `cong-ten-tom-tat` (30, 12, nhãn "Tổng" ở 42); `$.exercises[72]` (`ex.tim-x-so-tru-tien`, 60 − x = 25) với recap `tim-so-tru-tom-tat` (ảnh `phone/199-s14-05-recap.png`)
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Luật "Luyện tập và kho ôn khác số" của SKILL tác giả chưa đạt: recap vẽ đúng phép tính của câu và ghi sẵn đáp án, nên phiên ôn chỉ còn là nhớ lại hình.
- Sửa: Đổi số của câu (vd 26 + 13 = 39; "có 70 nghìn, còn 28 nghìn" ra 42) hoặc đổi số của recap.

### 9. Nhiễu vô lý ở câu chọn biểu thức cùng tổng

- Vị trí: `$.exercises[18].options[2]`, `options[3]` (`ex.chon-tong-nhom`)
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Đáp án (4 + 16) + 9 là duy nhất và đúng, nhưng nhiễu "(4 + 9) + 60", "4 + 16 + 90" không đến từ lỗi nào trẻ hay mắc, nên câu thành chỉ cần nhìn là thấy.
- Sửa: Nhiễu theo lỗi nhóm thật, vd "(4 + 16) + 16", "4 + 16 − 9", "(4 + 6) + 9".

### 10. Lựa chọn đúng "5 + 27" không kiểm tra ý của card giao hoán

- Vị trí: `$.exercises[13].options[1]` (`ex.chon-tong-bang`, card `giao-hoan`)
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Đáp án {a, b} đúng, nhưng trẻ vừa học "đổi chỗ" sẽ loại 5 + 27 vì nó không phải phép đổi chỗ và trông giống nhiễu 7 + 52. Câu phạt đúng cách nghĩ card dạy.
- Sửa: Cho hai đáp án đúng cùng dựa vào giao hoán, vd "Chọn tất cả phép tính có tổng bằng 7 + 25 + 3": 25 + 7 + 3, 3 + 25 + 7; hoặc đổi đề thành "…bằng 7 + 25 nhờ đổi chỗ các số hạng".

### 11. Màn hình từng bước không có dòng "làm gì, để làm gì"

- Vị trí: `$.sections[0].blocks[1]` (`cong-thanh-bar`), `$.sections[1].blocks[1]` (`tru-thanh-bar`)
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Hai màn là visual trơn có nút "Bước tiếp", chỉ kèm caption xám (`phone/002-s1-02-block.png`, `phone/018-s2-02-block-end.png`).
- Sửa: Bọc trong `group` có note, vd "Bấm Bước tiếp để gộp hai phần. Thanh dài cho biết tổng." / "Bấm Bước tiếp để bớt đi một phần. Phần còn lại là hiệu."

### 12. "Số chuyển k": chữ k không được giải thích, không nói chuyển từ số nào sang số nào

- Vị trí: `$.sections[6].blocks[1].children[0].text` (`them-bot-tu-lam`), `$.exercises[36].prompt[0].text` (`ex.chuyen-so-cham`)
- Nguồn: tr.16 câu 1.31, `sbt-p16.png`
- Vấn đề: Chữ k không có trên hình (stepper ghi "Số chuyển"). Ví dụ ngay trước chuyển từ số hạng thứ hai sang số hạng thứ nhất (lấy 2 của bánh cho kẹo), còn màn tự làm chuyển theo chiều ngược lại mà không nói.
- Sửa: Bỏ chữ k: "Bấm + để chuyển từ số hạng thứ nhất sang số hạng thứ hai, tới khi số hạng thứ hai tròn chục." Sửa đề `chuyen-so-cham` giống vậy.

### 13. Màn "Dùng phép cộng để kiểm tra phép trừ" không có phép cộng nào

- Vị trí: `$.sections[10].blocks[1].children[1]` (`quan-he-kiem-tra`, bar sub 50 18 still)
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Ảnh `127-s11-02-block.png` chỉ có "50 − 18 = 32"; không có dòng "32 + 18 = 50" mà note nói tới.
- Sửa: Thêm bước kiểm tra "32 + 18 = 50" (32 teal, 18 pink, 50 violet), hoặc dùng hình mới hiện phép trừ rồi phép cộng kiểm tra.

### 14. Hình recap của `quan-he` ghi nhãn Tổng/Số hạng, trong khi câu cần nhớ nói về số bị trừ, hiệu, số trừ

- Vị trí: `$.sections[10].recap`, `$.cards[10].recap` (`quan-he-tom-tat`), cùng hình `quan-he-ba-so`
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Ảnh `151-s11-05-recap.png`: caption "Số bị trừ bằng hiệu cộng số trừ" nhưng hình chỉ có nhãn "Tổng" (72) và "Số hạng" (25, 47); số 72 hổ phách trên thanh và tím ở dòng phép trừ. Recap lệch caption.
- Sửa: Nhãn theo phép trừ (Số bị trừ 72, Số trừ 25, Hiệu 47) kèm dòng "47 + 25 = 72", hoặc đổi caption cho khớp hình.

### 15. Section "cùng thêm hoặc cùng bớt" không có ví dụ hay câu hỏi nào về "cùng bớt"

- Vị trí: `$.sections[7]`, `$.cards[7]`, `$.exercises[37..41]`
- Nguồn: tr.16 câu 1.32b, tr.97, `sbt-p97.png`
- Vấn đề: Tiêu đề, note, recap đều nói "cùng thêm hoặc cùng bớt", nhưng mọi ví dụ và câu hỏi đều là "cùng thêm".
- Sửa: Đổi một câu kho ôn (vd `tinh-tru-them-2`) thành "cùng bớt", số nhỏ: 74 − 32 bớt 2 cả hai số thành 72 − 30 = 42; có thể đổi hình recap sang ví dụ bớt.

### 16. Nhiễu "28 − 6" vô lý

- Vị trí: `$.exercises[59].options[2]` (`ex.chon-tim-x`)
- Nguồn: tr.16 câu 1.33a, `sbt-p16.png`
- Vấn đề: Số 6 không có trong đề x + 28 = 61, nên câu thực chất chỉ còn 2 lựa chọn.
- Sửa: Thay bằng lỗi hay gặp, vd "61" (lấy luôn tổng) hoặc "28 + 61".

### 17. Câu "kiểm tra phép trừ" trả lời được mà không cần hiểu quan hệ

- Vị trí: `$.exercises[54].options` (`ex.chon-kiem-tra`)
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Ba nhiễu đều là đẳng thức sai rõ ràng ("19 − 34" còn không làm được trong số tự nhiên), nên trẻ chỉ cần chọn đẳng thức đúng.
- Sửa: Nhiễu là đẳng thức đúng nhưng không phải phép kiểm tra, vd "53 + 34 = 87", "19 + 15 = 34", giữ "53 + 19 = 34".

### 18. `sourceRef` của hai section thêm/bớt thiếu tr.16

- Vị trí: `$.sections[6].sourceRef`, `$.cards[6].sourceRef`, `$.sections[7].sourceRef`, `$.cards[7].sourceRef`
- Nguồn: `sbt-p16.png` (câu 1.31, 1.32)
- Vấn đề: Dạng bài của hai section nằm ở tr.16; tr.96–97 chỉ là đáp án.
- Sửa: "Sách bài tập tr.15, 16, 96" và "Sách bài tập tr.15, 16, 97".

### 19. Quy tắc dãy cách đều không nói gì về số ở giữa

- Vị trí: `$.sections[14].blocks[0].children[0].text`, `$.sections[14].recap.caption`, `$.cards[14].recap.caption` (`day-so`)
- Nguồn: tr.16 bài 1.34a, tr.97
- Vấn đề: Ví dụ `day-so-mau` (35…43) và recap (2…10) đều có 5 số, hình tự để riêng số giữa mà không câu nào giải thích.
- Sửa: Thêm vào note và recap: "Dãy có số lượng lẻ thì số ở giữa đứng riêng, cộng thêm vào sau.", hoặc đổi ví dụ quy tắc sang dãy 4 số.

### 20. Quy tắc chữ số cuối dùng chữ "đoán", thiếu bước lấy chữ số cuối, thiếu kết luận, và lệch recap card

- Vị trí: `$.sections[15].blocks[0].children[0].text` so với `$.cards[15].recap.caption` (`chu-so-cuoi`)
- Nguồn: tr.16 bài 1.35a, tr.97
- Vấn đề: "đoán" làm trẻ nghĩ cách này không chắc chắn. Note bảo "cộng các chữ số đó" nhưng không nói phải lấy chữ số cuối của kết quả (ví dụ ra 12 → 2; walk: trẻ gõ "10" ở `chu-so-cuoi-1`), trong khi recap card lại có bước này, nên recap lệch note. Note cũng không nói không khớp thì tổng sai (ý của bài 1.35). "Phụ thuộc" là từ Hán Việt khó.
- Sửa: Note và recap card cùng câu: "Cộng các chữ số hàng đơn vị của các số hạng. Chữ số cuối của kết quả đó là chữ số cuối của tổng. Nếu không khớp thì tổng đã tính sai."

### 21. Quy tắc ước lượng chỉ có trường hợp 3 × 100, không có kết luận, trong khi bài tập dùng số khác

- Vị trí: `$.sections[15].blocks[1].children[0].text`, `$.cards[16].recap.caption`; `$.exercises[81]` (`chon-uoc-luong`, 5 số), `$.exercises[84]` (`chon-uoc-luong-2`, giới hạn 50)
- Nguồn: tr.16 bài 1.35b, tr.97
- Vấn đề: Note và recap card chỉ nêu một trường hợp cụ thể, không nêu cách làm chung và không nói vượt giới hạn thì sai; câu luyện tập ngay sau đòi 5 số hạng, câu ôn đòi giới hạn 50.
- Sửa: "Có mấy số hạng, mỗi số nhỏ hơn 100, thì tổng nhỏ hơn bấy nhiêu trăm. Kết quả lớn hơn thế là tính sai." Giữ 68, 74, 91 làm ví dụ có nhãn.

### 22. Section `kiem-tra-nhanh` gộp hai quy tắc, recap hai câu mà hình chỉ vẽ một

- Vị trí: `$.sections[15]`, `$.sections[15].recap` (`kiem-tra-tom-tat`)
- Nguồn: tr.97 (1.35a và 1.35b là hai cách riêng)
- Vấn đề: Section dạy hai quy tắc cần nhớ riêng (hai card `chu-so-cuoi`, `uoc-luong`); hình recap chỉ vẽ chữ số cuối, không có phần ước lượng mà caption nhắc tới.
- Sửa: Tách thành hai section, mỗi section một recap (`chu-so-cuoi-tom-tat`, `uoc-luong-tom-tat`); nếu giữ một section thì recap phải vẽ cả hai cách.

### 23. Đề `chon-tong-sai` bắt chọn cả kết quả sai 120

- Vị trí: `$.exercises[82]` (`ex.chon-tong-sai`)
- Nguồn: tr.16 bài 1.35
- Vấn đề: "Chọn tất cả kết quả có chữ số cuối đúng" bắt chọn cả 120 dù 25 + 38 + 47 = 110. Bài chưa dạy rằng chữ số cuối khớp thì chưa chắc tổng đúng, nên trẻ đọc thành "chọn kết quả đúng" và chỉ chọn 110. Ngược ý bài 1.35 (dùng chữ số cuối để loại kết quả sai).
- Sửa: "Không cần tính, chọn tất cả kết quả chắc chắn sai của 25 + 38 + 47." Đáp án 115, 118; nhiễu 110, 120.

### 24. Section `kiem-tra-nhanh` không có ví dụ đời sống

- Vị trí: `$.sections[15].blocks`, `$.exercises[79]`, `$.exercises[80]`
- Nguồn: —
- Vấn đề: Mọi ví dụ và câu hỏi là dãy số trơn; luật "Ví dụ đời sống ở mọi section Toán" chưa đạt.
- Sửa: Đặt tình huống cho caption, vd "Mua ba món 23, 14 và 35 nghìn đồng, người bán tính 71 nghìn: đúng không?".

### 25. Ví dụ mẫu của `toan-thoi-gian` bị đứt: không có giờ vào học, không thấy 90 từ đâu, không có kết

- Vị trí: `$.sections[16].blocks[0]`, `$.sections[16].blocks[1]`; ảnh `phone/230-s17-01-block-end.png`, `231-s17-02-block.png`
- Nguồn: tr.16 bài 1.36, tr.97
- Vấn đề: Màn 1 chỉ cộng ra 40 (không đơn vị, không giờ vào học). Màn 2 nói "7 giờ 30 phút là 6 giờ 90 phút" rồi 90 − 40 = 50, không nói 40 là thời gian của Nam, không cho thấy 90 = 60 + 30, không kết "Nam phải đi lúc 6 giờ 50 phút". Câu note "cộng … rồi mới trừ" chưa có ví dụ trọn vẹn.
- Sửa: Caption màn 1 thêm "Lớp vào học lúc 7 giờ 30 phút. Nam phải đi lúc mấy giờ?". Màn 2: công thức `60 + 30 = 90`, `90 - 40 = 50` và câu kết "Vậy Nam phải ra khỏi nhà lúc 6 giờ 50 phút."

### 26. Câu `tim-gio-xuat-phat` chép nguyên ví dụ mẫu; gợi ý nấc 2 bỏ qua bước đổi giờ

- Vị trí: `$.exercises[87]` (`ex.tim-gio-xuat-phat`), `hints.hintVisualId` (`hint-bar-gio-80-30`)
- Nguồn: tr.97 đáp án 1.36b
- Vấn đề: Đề dùng đúng 7 giờ 30 phút, 40 phút, 90 − 40 của màn quy tắc và tự đổi sẵn "tức 6 giờ 90 phút". Hình nấc 2 là thanh 80 − 30 không có giờ phút.
- Sửa: Đổi số (vd vào học 8 giờ 20 phút, đường đi 35 phút) và bỏ cụm "tức …". Nấc 2 vẽ bước đổi với số khác đề: "7 giờ 10 phút = 6 giờ 70 phút; 70 − 25 = ?".

### 27. Recap `toan-thoi-gian` nói "rồi trừ" nhưng hình chỉ có phép cộng

- Vị trí: `$.sections[16].recap`, `$.cards[17].recap` (`lo-trinh-tom-tat`)
- Nguồn: tr.97 đáp án 1.36
- Vấn đề: Hình là 10 + 15 + 5 + 20 = 50 kiểu ghép cặp (chú giải "Kết hợp"), không có giờ vào học, phép trừ hay đổi giờ. Recap lệch caption.
- Sửa: Vẽ recap hai bước: cộng các đoạn ra tổng phút, rồi lấy giờ đến trừ đi (có bước đổi giờ), số nhỏ khác đề.

### 28. Không câu nào tập "cộng rồi trừ" trong cùng một bài toán

- Vị trí: `$.exercises[86]`, `$.exercises[87]`, `$.exercises[88]`, `$.exercises[89]` (card `toan-thoi-gian`)
- Nguồn: tr.16 bài 1.36b
- Vấn đề: Note và recap dạy bài toán nhiều bước, nhưng mỗi câu chỉ có một bước.
- Sửa: Thêm câu ôn hai bước số nhỏ, vd "Đi bộ 5 phút, đi xe 20 phút. Vào học lúc 7 giờ 15 phút. Phải đi lúc mấy giờ?", có hình nấc 2 dừng trước kết quả.

### 29. Câu chọn nhiều đáp án của card `tim-so-tru` không có đáp án nào ở dạng tìm số trừ

- Vị trí: `$.exercises[73]` (`ex.chon-x-bang-25`)
- Nguồn: tr.16 bài 1.33c
- Vấn đề: Hai đáp án đúng là dạng tìm số hạng và tìm số bị trừ; dạng a − x = b chỉ có ở nhiễu.
- Sửa: Đổi lựa chọn c thành `60 - x = 35` và thêm c vào `answer`, hoặc thay a bằng một đẳng thức dạng số trừ.

### 30. Gợi ý nấc 1 trỏ vào câu lệnh hay cả đề thay vì chỗ hay sai

- Vị trí: `$.exercises[68].hints.highlight`, `$.exercises[78].hints.highlight` (câu "Xếp các bước…", đề có sẵn `\htmlId{pt}`); `$.exercises[79]`, `$.exercises[80]`, `$.exercises[83]` (tô cả tổng)
- Nguồn: —
- Vấn đề: Hai câu `order` sáng câu lệnh chứ không sáng phép tính. Ba câu chữ số cuối tô cả biểu thức, không chỉ ra chữ số hàng đơn vị, trong khi lỗi hay gặp là cộng cả hàng chục.
- Sửa: Hai câu `order` dùng `{"target":"part","id":"pt"}`. Câu chữ số cuối bọc từng chữ số hàng đơn vị bằng `\htmlId` rồi trỏ `target: "part"`, không `conceptId`.

## Góp ý

### 1. Câu luyện tập chạm tổng dùng lại đúng phép tính của màn vừa xem

- Vị trí: `$.exercises[1]` (`ex.cham-tong`, visual `cham-cong-14-9`) và `$.sections[0].blocks[1]` (`cong-thanh-bar`, 14 + 9)
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Màn ngay trước vừa tô 23 là "Tổng" cho đúng phép 14 + 9, nên câu luyện tập thành nhớ lại hình.
- Sửa: Đổi `cham-cong-14-9` sang số khác, vd 16 + 7.

### 2. Câu chữ của đề

- Vị trí: `$.exercises[25].prompt[0].text` (`ex.chon-cap-tron`); đề `ex.dien-doi-cho`, `ex.dien-doi-cho-2`, `ex.dien-so-0` ("…thay cho dấu ?."); `$.exercises[77].prompt[0].text` (`ex.chon-cap-day-so-2`)
- Nguồn: —
- Vấn đề: "Hai số nào có tổng tròn chục?" trong khi lựa chọn là phép cộng; "?." khó đọc; "cặp có tổng bằng tổng của số đầu và số cuối" có hai chữ "tổng" lồng nhau.
- Sửa: "Phép cộng nào có tổng tròn chục?"; "Điền số vào chỗ có dấu ?"; "Dãy 30, 32, 34, 36, 38. Chọn tất cả cặp có tổng bằng 30 + 38."

### 3. Id visual gợi ý đặt tên lệch với số liệu bên trong

- Vị trí: `VISUAL_SPECS["hint-regroup-4-7-6"]` (số thật [3, 9, 7]), dùng ở `$.exercises[16].hints.hintVisualId`
- Nguồn: —
- Vấn đề: Tên id hứa 4, 7, 6 nhưng hình vẽ 3 + 9 + 7.
- Sửa: Đổi tên thành `hint-regroup-3-9-7` trước khi khoá id.

### 4. `sourceRef` chưa ghi rõ phần kiến thức nền

- Vị trí: `$.sections[4].sourceRef`, `$.cards[4].sourceRef` (cộng với 0, trừ đi 0); `$.sections[16].sourceRef`, `$.cards[17].sourceRef` (đổi 1 giờ = 60 phút)
- Nguồn: `sbt-p14.png`, `sbt-p15.png`, `sbt-p16.png` không có phép cộng, trừ với 0; tr.97 đáp án 1.36b cần đổi giờ nhưng không viết ra
- Vấn đề: Glossary có `prerequisite` cho "cộng với 0" nhưng chưa có cho "trừ đi 0", và tiêu đề section chỉ nói "Cộng với số 0". Section thời gian dùng kiến thức tiểu học mà `sourceRef` không ghi.
- Sửa: Thêm ghi chú kiến thức nền "trừ đi 0" vào glossary; `sourceRef` của section thời gian thành "Kiến thức nền (tiểu học); Sách bài tập tr.16, 97".

### 5. Phép tính trong câu chữ bị ngắt dòng giữa chừng trên điện thoại

- Vị trí: `$.sections[7].blocks[1].children[0].text`, `$.exercises[54].prompt[0].text`, `$.sections[10].blocks[0].children[0].text`
- Nguồn: —
- Vấn đề: Ảnh `096-s8-02-block.png`, `143-s11-03-exercise-chon-kiem-tra.png`, `125-s11-01-block.png`: "83 / − 29", "53 / − 19 = 34?", "25 + 11 = / 36.".
- Sửa: Đưa phép tính ra khối `formula` riêng dưới câu chữ.

### 6. Hình tự làm đặt tính hiện sẵn "0" ở ô kết quả

- Vị trí: `cot-cong-tu-lam`, `cot-tru-tu-lam`, `cot-*-kiem-tra-*`, `cot-*-hang-chuc-*` (`ColumnTry` trong `column.tsx`)
- Nguồn: —
- Vấn đề: Ảnh `111-s9-03-block.png`, `129-s10-03-block.png`: ô kết quả của cột đang làm có sẵn "0" có màu, trông như đã điền.
- Sửa: Để "?" mờ tới khi trẻ bấm lần đầu.

### 7. Câu sắp bước có x trùng số hạng đã biết

- Vị trí: `$.exercises[63]` (`ex.sap-buoc-tim-x`: x + 45 = 90)
- Nguồn: —
- Vấn đề: x = 45 trùng số 45 trong đề, trẻ có thể nghĩ bước cuối chỉ là chép lại số.
- Sửa: Đổi số, vd x + 45 = 92.

### 8. Quy tắc "Số bị trừ bằng hiệu cộng số trừ" dạy ở hai section

- Vị trí: `$.sections[10].blocks[1].children[0].text`, `$.sections[10].recap.caption`, `$.cards[10]` (`quan-he`) và `$.sections[12].blocks[0].children[0].text`, `$.sections[12].recap.caption`, `$.cards[12]` (`tim-so-bi-tru`)
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: Cùng một câu làm note và recap ở hai section; các câu của card `quan-he` (`dien-quan-he`, `-2`, `-3`) cũng chỉ tính lại số bị trừ, nên lượt ôn bị lặp.
- Sửa: Để `quan-he` nói "một phép trừ cho ta phép cộng kiểm tra" (như `chon-quan-he-nhieu`); quy tắc tìm số bị trừ chỉ nằm ở `tim-so-bi-tru`.

### 9. Hình gợi ý nấc 2 của `dien-quan-he` đặt "?" ở chỗ không liên quan

- Vị trí: `$.exercises[55].hints.hintVisualId` (`hint-family-40-15-25`)
- Nguồn: —
- Vấn đề: Đề hỏi một phép cộng, nhưng hình hiện đủ hai phép cộng và để "?" ở phép trừ cuối.
- Sửa: Thêm chế độ của `FactFamily` để "?" ở kết quả phép cộng, hoặc bỏ `hintVisualId`.

### 10. Cách mượn khác cách "nhớ 1 sang số trừ" trẻ học ở tiểu học

- Vị trí: `$.sections[9].blocks[1]`, `cot-tru-*`
- Nguồn: —
- Vấn đề: Bài dạy "gạch chữ số trên, bớt 1"; ở tiểu học trẻ thường học "12 trừ 7 bằng 5, viết 5 nhớ 1; 4 thêm 1 là 5…". Cùng kết quả nhưng người học chậm có thể rối.
- Sửa: Thêm một câu ở caption rằng cách nhớ 1 vào số trừ cũng cho cùng kết quả, hoặc hỏi chủ dự án trẻ quen cách nào.

### 11. Tên section "Cộng và trừ đi ngược nhau" khác cách gọi của sách

- Vị trí: `$.sections[10].title`, `$.sections[10].blocks[0].children[0].text`
- Nguồn: tr.14, `sbt-p14.png`
- Vấn đề: "Đi ngược nhau" là cách nói bình dân, không phải cụm từ sách dùng.
- Sửa: Tiêu đề "Quan hệ giữa phép cộng và phép trừ", giữ "ngược nhau" trong câu giải thích nếu muốn.

### 12. Tên section "Kiểm tra nhanh một phép cộng" trùng nhãn "Kiểm tra nhanh" của app

- Vị trí: `$.sections[15].title`
- Nguồn: —
- Vấn đề: App in nhãn "Kiểm tra nhanh" trên mọi câu `checkIds` (ảnh `phone/218-s16-03-…`), nên cùng màn có hai dòng "Kiểm tra nhanh" hai nghĩa.
- Sửa: Đổi tên, vd "Phát hiện tổng tính sai".

### 13. Hai câu chuyện tìm x không nói kết quả bằng lời

- Vị trí: `$.sections[12].blocks[1]`, `$.sections[13].blocks[1]`
- Nguồn: —
- Vấn đề: Màn thử lại chỉ có `45 - 18 = 27`, `50 - 18 = 32`, không kết "Lan có 45 nghìn đồng", "cho Lan 18 cái kẹo".
- Sửa: Thêm câu kết vào note màn thử lại.

### 14. Khung tô nấc 1 quanh đề chữ dính sát chữ trên điện thoại (bố cục app)

- Vị trí: ảnh `phone/239-s17-04-exercise-tim-gio-xuat-phat-wrong2.png`, `241-…-wrong3.png`
- Nguồn: —
- Vấn đề: Viền tô quanh đoạn đề dài chạm sát chữ đầu dòng. Lỗi bố cục app, không chặn bài.
- Sửa: Báo người làm app thêm padding cho highlight `target: "block"`.
