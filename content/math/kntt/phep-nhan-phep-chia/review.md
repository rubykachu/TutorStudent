# Review: Phép nhân và phép chia số tự nhiên (`phep-nhan-phep-chia`)

- Bài: `content/math/kntt/phep-nhan-phep-chia/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/phep-nhan-phep-chia/` - sbt-p17, sbt-p18, sbt-p19, sbt-p20, sbt-p98, sbt-p99, sbt-p100
- `content:check`: 0 lỗi, 1 cảnh báo của bài (114 id chưa có trong `ids.lock.json`: tác giả chạy `pnpm content:lock` khi duyệt)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-nhan-phep-chia/`
- Kết luận: Chưa đạt: còn 4 lỗi Nghiêm trọng
- Bản đã review: `10ac3097a432b10f88411e77a091c125fb1d690132735b9993c9be8a853e21dd` (`pnpm content:diff` so với bản này)

Đã tự giải cả 74 exercise: mọi đáp án và `check` đúng, mỗi câu có đúng một đáp án (hay một tập đáp án) đúng. Hình nấc 2 dùng số khác đề và dừng ở "?", hình nấc 3 đúng số của đề. Hình đặt tính cột ở section 8, 9 đúng số và số nhớ, cột thẳng hàng trên cả ba khổ màn.

## Nghiêm trọng

### 1. Một bài hai quy ước viết phép nhân a · b, câu quy tắc của section 1 ngược cách trẻ học ở tiểu học

- Vị trí: `$.sections[0].blocks[1].children[0]` (note "Cộng 4 số 6 thì viết là 4 · 6") và công thức `6 + 6 + 6 + 6 = 4 \cdot 6`, visual `nhan-hop-banh`, `xep-luoi-cung-lam`, `nhan-cong-lap-tom-tat`, `tinh-ba-keo-goi-y`/`-giai` (5 bao 8 viên → 5 · 8), `tinh-tuan-ngay-goi-y`/`-giai` (8 tuần 7 ngày → 8 · 7), `$.exercises[0]` (`chon-tong-7`, đáp án 3 · 7). Cùng kiểu "số phần · số mỗi phần": `$.sections[3]` (3 hàng, 7 ghế → 3 · 7), `$.sections[5]` (3 gói, 12 cái → 3 · (10 + 2)), `$.sections[6].blocks[1]` (35 món, 98 nghìn → 35 · 98). Ngược lại, "số mỗi phần · số phần": `$.sections[2].blocks[0].children[0]` (2 gói, 25 nghìn → 25 · 2), `$.sections[7].blocks[0]` (6 hộp, 38 cái → `nhan-cot-38-6`), `$.sections[8].blocks[0]` (24 gói, 36 nghìn → 36 · 24), `$.sections[9].blocks[0]` (8 áo, 62 nghìn → 62 · 8); LL-05
- Nguồn: tr.17, `sbt-p17.png` (sách chỉ ghi 25 · 2 = 50, không nêu quy ước cộng lặp); quy ước tiểu học: "6 được lấy 4 lần, ta viết 6 × 4"
- Vấn đề: section 1 nêu thành luật "cộng 4 số 6 thì viết 4 · 6" (số lần đứng trước), trong khi trẻ đã học 6 + 6 + 6 + 6 = 6 × 4. Chính bài lại viết ngược luật đó ở section 3, 8, 9, 10 và ở hình đặt tính: cùng một tình huống "n gói, mỗi gói m" khi thì n · m, khi thì m · n. Giao hoán chỉ dạy ở section 4, nên ở section 1-3 trẻ chưa có lý do coi hai cách là một. Trẻ học chậm, yếu nhân chia sẽ nhớ sai cách viết hay nghi ngờ điều đã học. Câu `giao-hoan` "Đổi chỗ để số lớn đứng trước thì nhân dễ hơn" cũng mâu thuẫn với luật này (Nên sửa 1). Mức Nghiêm trọng vì câu note nêu một luật viết mà bài làm ngược lại, dù về toán hai cách cùng tích.
- Sửa: chọn một quy ước và dùng khắp bài. Đề xuất theo tiểu học: "6 được lấy 4 lần: 6 + 6 + 6 + 6 = 6 · 4 = 24". Sửa note và công thức section 1; cho `nhan-hop-banh`, `xep-luoi-cung-lam`, `nhan-cong-lap-tom-tat` và các hình gợi ý, lời giải hiện "số mỗi phần · số phần" (8 · 5, 7 · 8, 7 · 3...); đổi đáp án `chon-tong-7` thành 7 · 3; soát caption các ví dụ ở section 4, 6, 7 cho cùng thứ tự (hay viết caption sao cho thứ tự số khớp phép nhân trên hình). Nếu giữ "số phần · số mỗi phần" thì sửa `ten-goi` thành 2 · 25 và các hình đặt tính section 8-10 theo thứ tự đó.

### 2. Chép ví dụ và bài tập của sách bài tập

- Vị trí: `$.sections[2].blocks[0].children[0]` và visual `ten-goi-nhan` (25 · 2 = 50, nhãn Thừa số/Tích bằng mũi tên); `$.sections[2].blocks[1].children[0]` và visual `ten-goi-chia` (36 : 12 = 3); `$.sections[4].blocks[1]` (visual `ket-hop-44-25`: 44 · 25 = 11 · 4 · 25 = 11 · 100 = 1 100); LL-08
- Nguồn: tr.17 mục "Kiến thức cần nhớ" a), b), `sbt-p17.png`; bài 1.39 b), `sbt-p19.png`; lời giải 1.39 b), `sbt-p98.png`
- Vấn đề: hai ví dụ tên gọi dùng đúng bộ số và sơ đồ mũi tên của sách (đã đối chiếu ảnh tr.17). Ví dụ mẫu của section `ket-hop` là bài 1.39 b), từng bước trùng lời giải sách. Trục 1 của checklist xếp ví dụ hay bộ số bài tập trùng sách là Nghiêm trọng (tiền lệ `phep-cong-phep-tru` vòng 1: 25 + 11 = 36).
- Sửa: đổi số, ví dụ "Mua 3 gói bánh, mỗi gói 15 nghìn đồng" (15 · 3 = 45, viết theo quy ước chốt ở mục 1) và "Chia đều 40 cái kẹo cho 8 bạn" (40 : 8 = 5); ví dụ kết hợp dùng 36 · 25 = 9 · 4 · 25 = 900 (không trùng `tinh-thung-sua`, `tinh-125-24`, recap 18 · 25). Cập nhật visual, caption và recap `ten-goi-tom-tat` tương ứng.

### 3. Kiến thức tiểu học không ghi "Kiến thức nền": cộng lặp, đặt tính nhân, đặt tính chia

- Vị trí: `$.sections[0].sourceRef`, `$.cards[0].sourceRef` (`nhan-cong-lap`, "Sách bài tập tr.17"); `$.sections[7].sourceRef`, `$.cards[7].sourceRef` (`nhan-mot-chu-so`), `$.sections[8].sourceRef`, `$.cards[8].sourceRef` (`nhan-hai-chu-so`) ("tr.17"); `$.sections[13].sourceRef`, `$.cards[13].sourceRef` (`dat-tinh-chia`, "tr.17, 20"); glossary `content/glossary/math.json` thiếu "tích riêng", "số nhớ"; LL-09
- Nguồn: tr.17, tr.18 (`sbt-p17.png`, `sbt-p18.png`): không có ý "phép nhân là cộng nhiều số bằng nhau"; về đặt tính sách chỉ ghi "Có thể thực hiện phép nhân, phép chia bằng cách đặt tính" (đầu tr.18), không dạy số nhớ, tích riêng, "chia, nhân, trừ, hạ"
- Vấn đề: đây là kiến thức tiểu học. Trục 1 của checklist chỉ cho dạy kiến thức ngoài trang nguồn khi `sourceRef` của section và card ghi "Kiến thức nền (<cấp>)" và thuật ngữ có `prerequisite` trong glossary, như section `bang-nhan` đã làm. Các section trên ghi thẳng trang sách lớp 6, còn "tích riêng", "số nhớ" chưa khai báo. Nhóm 2 xếp phần đặt tính ở mức Nên sửa; tổng hợp nâng lên cùng mức với section 1 vì cùng một luật.
- Sửa: `nhan-cong-lap` ghi "Kiến thức nền (tiểu học); Sách bài tập tr.17"; `nhan-mot-chu-so`, `nhan-hai-chu-so`, `dat-tinh-chia` ghi "Kiến thức nền (tiểu học); Sách bài tập tr.18" (`dat-tinh-chia` thêm tr.17 nếu giữ ý số dư). Thêm "tích riêng", "số nhớ" vào `content/glossary/math.json` với `prerequisite: "tiểu học"`.

### 4. Nhãn "−1" đứng riêng trong hình diện tích là cách viết số âm, lớp 6 chưa học

- Vị trí: `$.sections[6].blocks[0].children[1]` (visual `gan-tron-12-19`), `$.sections[6].recap`, `$.cards[6].recap` (visual `gan-tron-tom-tat`); LL-09
- Nguồn: tr.19 (1.41), `sbt-p19.png`; lời giải tr.99 - sách chỉ viết phép trừ `25 · (20 − 1)`, không có số −1 đứng riêng
- Vấn đề: dải cột nét đứt bên phải hình chữ nhật mang nhãn "−1" (đã xem ảnh `phone/080-s7-01-block-end.png`; recap `phone/088-s7-06-recap.png`). Trong `(20 − 1)` dấu trừ là phép trừ, còn "−1" đứng một mình là số nguyên âm (chương 3). Trẻ có thể hiểu có "độ dài âm" hay nhớ sai ký hiệu. Trục 1 xếp nội dung vượt phạm vi, kể cả ở chi tiết phụ, là Nghiêm trọng (cùng kiểu `2^{-1}`).
- Sửa: đổi nhãn thành "bớt 1" (khớp dòng `12 · 1 = 12 (bớt đi)` ngay dưới) trong `split-area.tsx` khi `parts[i] < 0`; chụp lại hai hình.

## Nên sửa

### 1. "Đổi chỗ để số lớn đứng trước thì nhân dễ hơn" không có lý do và ngược luật của section 1

- Vị trí: `$.sections[3].blocks[2].children[0]` (`giao-hoan`)
- Nguồn: —
- Vấn đề: theo luật section 1, `2 · 35` là "cộng 2 số 35" = 35 + 35, vốn đã dễ; `35 · 2` theo luật đó là cộng 35 số 2. Câu không nói vì sao dễ hơn, trẻ không áp dụng được cho `tinh-nham-2-45`.
- Sửa: nêu lý do cụ thể, vd "Đổi chỗ để nhân với số một chữ số: 2 · 35 = 35 · 2, nhân 35 với 2 được 70", khớp quy ước chốt ở Nghiêm trọng 1.

### 2. Một quy tắc nói nhiều cách: phép thử của phép chia, "số dư lớn hơn", bài toán chia dư

- Vị trí: `$.sections[10].blocks[1].children[0]` ("Số bị chia bằng số chia nhân thương") so với `$.sections[10].blocks[2].children[0]` ("lấy thương nhân số chia", cùng section); `$.sections[12].blocks[1].children[0]` ("lấy số chia nhân thương rồi cộng số dư") so với `$.sections[15].blocks[1].children[0]` ("nhân thương với số chia rồi cộng số dư"); `$.sections[12].blocks[0].children[0]` ("bằng hay lớn hơn số chia") so với `$.sections[15].blocks[0].children[0]` ("số dư lớn hơn số chia"); `$.sections[14].blocks[2].children[0]` ("phải chở hết … trọn quyển") so với `$.sections[14].recap.caption`, `$.cards[14].recap.caption` ("phải đựng hết … trọn bộ"); LL-05
- Nguồn: tr.17, `sbt-p17.png`
- Vấn đề: cùng một quy tắc viết theo hai thứ tự, có chỗ ngay trong một section; recap `bai-toan-chia` đổi cả động từ lẫn vật so với note. Trẻ học thuộc một câu rồi gặp câu kia sẽ tưởng là hai quy tắc. Lỗi cùng gốc với Nghiêm trọng 1 nhưng ở đây hai cách đều đúng sau giao hoán nên để Nên sửa.
- Sửa: dùng một câu "Số bị chia bằng số chia nhân thương (cộng số dư)" ở cả `chia-het`, `kiem-tra-chia`, `tim-loi-sai`; câu tìm số bị chia viết "lấy số chia nhân thương". `tim-loi-sai` viết "số dư bằng hay lớn hơn số chia". Recap `bai-toan-chia` dùng lại đúng chữ của note.

### 3. Hình gợi ý `dien-7-9-goi-y` đặt "?" ở tích, còn đề hỏi thừa số

- Vị trí: `$.exercises[13].hints.hintVisualId` (`dien-7-9`, visual `dien-7-9-goi-y`); LL-15
- Nguồn: —
- Vấn đề: đề `7 · 9 = 9 · ___` (điền 7), hình kết thúc ở `4 · 6 = 6 · 4 = ?`. Trẻ dễ nghĩ phải tính tích.
- Sửa: vì dùng số khác đề, giải trọn `4 · 6 = 6 · 4 = 24` và làm nổi thừa số 4 đổi chỗ ở vế phải; hoặc dừng ở `4 · 6 = 6 · ?`.

### 4. `chon-tong-7`: hai nhiễu là phép cộng, bị loại ngay bằng chữ "phép nhân" trong đề

- Vị trí: `$.exercises[0].options` (b `7 + 3`, d `3 + 7`); LL-14
- Nguồn: —
- Vấn đề: đề "Chọn phép nhân bằng 7 + 7 + 7" nên hai phép cộng bị loại mà không cần hiểu, lại cùng giá trị.
- Sửa: nhiễu đều là phép nhân phản ánh lỗi hay gặp: `7 · 7`, `3 · 3`, `7 · 4`, cùng đáp án theo quy ước chốt ở Nghiêm trọng 1.

### 5. `cham-tich-42`: bảng hiện sẵn tích, trẻ chỉ cần dò số 42

- Vị trí: `$.exercises[4]` (`cham-tich-42`, visual `bang-nhan-cham`); LL-14
- Nguồn: —
- Vấn đề: bảng hiện đủ 16 tích; trẻ tìm chữ "42" là đúng, không kiểm được việc thuộc bảng. Trên iPad dọc bảng lệch trái (ảnh `ipad/021`).
- Sửa: ẩn tích trong ô, giữ đề; căn giữa bảng.

### 6. `chon-tich-tron-tram` hỏi lại đúng ví dụ của màn liền trước

- Vị trí: `$.exercises[16]` (đáp án `4 · 25`) so với `$.sections[4].blocks[2]` (note "như 4 · 25 = 100", visual `cap-so-tron`); LL-07
- Nguồn: —
- Vấn đề: trẻ chọn theo trí nhớ vài giây trước.
- Sửa: hỏi cặp chưa xuất hiện, vd tích bằng 100 với đáp án `50 · 2`, nhiễu `25 · 2`, `50 · 3`, `20 · 4`.

### 7. `chon-nhieu-tach-16-25`: "giúp tính nhẩm" là tiêu chí chủ quan

- Vị trí: `$.exercises[19].prompt[0]` (đáp án a `4 · 4 · 25`, b `8 · 2 · 25`); LL-10
- Nguồn: —
- Vấn đề: b không ra 100; trẻ bám note "nhân ra số tròn như 4 · 25 = 100" có thể bỏ b và bị chấm sai.
- Sửa: "Chọn tất cả cách viết bằng 16 · 25" với nhiễu sai giá trị, hoặc thay b bằng một cách viết sai giá trị.

### 8. Câu định nghĩa thừa số chỉ nói "số được nhân"

- Vị trí: `$.sections[2].blocks[0].children[0]`; LL-10
- Nguồn: tr.17, `sbt-p17.png` (cả 25 và 2 đều là thừa số)
- Vấn đề: "số được nhân" gợi một số duy nhất, trong khi hình gắn nhãn "Thừa số" cho cả hai.
- Sửa: "Trong phép nhân, các số nhân với nhau gọi là thừa số, kết quả gọi là tích."

### 9. Ba section thiếu ví dụ đời sống hay ví dụ mẫu trong phần dạy

- Vị trí: `$.sections[1].blocks` (`bang-nhan`), `$.sections[4].blocks` (`ket-hop`), `$.sections[12].blocks` (`kiem-tra-chia`); LL-16
- Nguồn: —
- Vấn đề: `bang-nhan` chỉ có bảng và tia số; `ket-hop` chỉ có biểu thức; `kiem-tra-chia` vào thẳng ba note quy tắc (ảnh `147`-`149`). Trái luật "section Toán có ví dụ đời sống".
- Sửa: `bang-nhan`: "6 hộp, mỗi hộp 7 bút: tra hàng, cột được 42". `ket-hop`: đặt ví dụ mẫu vào tình huống (gắn với việc đổi số ở Nghiêm trọng 2). `kiem-tra-chia`: mở bằng "Lan chia 37 cái kẹo cho 5 bạn, ghi mỗi bạn 6 cái, dư 7. Lan ghi đúng chưa?".

### 10. Recap `ket-hop` mở ở trạng thái toàn "?", phải bấm 4 lần mới thấy cách làm

- Vị trí: `$.sections[4].recap`, `$.cards[4].recap` (visual `ket-hop-tom-tat`); LL-06
- Nguồn: —
- Vấn đề: màn "Nhớ nhé!" hiện `18 · 25` và bốn hàng "= ?" (ảnh `ipad/065`); trẻ không bấm "Bước tiếp" thì không thấy ví dụ.
- Sửa: recap hiện sẵn trạng thái cuối, bỏ nút bước.

### 11. Recap `giao-hoan`: hai lưới chấm khác cỡ chấm, nhãn lệch hàng

- Vị trí: `$.sections[3].recap`, `$.cards[3].recap` (visual `giao-hoan-tom-tat`); LL-15
- Nguồn: —
- Vấn đề: lưới 5 × 4 chấm to hơn lưới 4 × 5 (ảnh `ipad/055`, `ipad-landscape/054`); hình chứng minh "tích không đổi" mà hai lưới trông khác lượng.
- Sửa: cùng cỡ chấm, khoảng cách; căn nhãn cùng hàng.

### 12. Tích riêng thứ hai có hai cách viết: hình ghi "720" (0 xám), bài tập ghi "Viết 72, lùi sang trái"

- Vị trí: visual `nhan-cot-36-24` (`$.sections[8].blocks[0]`), `nhan-cot-47-13-xong`, `nhan-hai-chu-so-tom-tat`, `tinh-35-26-giai` so với `$.exercises[36]` (`chon-tich-rieng-2`), `$.sections[8].blocks[1].children[0]`, `nhan-cot-23-14-cung-lam`; LL-05, LL-15
- Nguồn: tr.18, `sbt-p18.png`
- Vấn đề: hình viết 720 với 0 xám thẳng cột đơn vị và ghi "144 + 720 = 864"; note và câu kiểm tra dạy "Viết 72, lùi sang trái một cột"; hình cùng làm bỏ trống cột đơn vị. Trẻ dễ chọn nhiễu "thẳng cột".
- Sửa: chọn một cách cho cả section: giữ 0 xám mọi hình và thêm vào note "Chữ số 0 mờ chỉ để giữ chỗ, có thể không viết"; hoặc bỏ 0 xám và ghi "144 + 72 chục".

### 13. Chú giải "Nhóm tính trước" gắn vào ngoặc của phép phân phối

- Vị trí: visual `phan-phoi-26-12` (`$.sections[5].blocks[2].children[1]`), `gan-tron-35-98` (`$.sections[6].blocks[1]`), `mua-sach-49-goi-y`, `mua-sach-49-giai` (`$.exercises[27].hints`); LL-15
- Nguồn: tr.18, tr.19
- Vấn đề: `steps.tsx` tự thêm chú giải "Nhóm tính trước" cho `(10 + 2)`, `(100 − 2)` (ảnh `phone/071`, `phone/082`), trong khi ý của section là nhân vào từng số trong ngoặc.
- Sửa: cho `steps` đặt tên chú giải (vd "Số được tách"), hoặc ẩn chú giải ở hình phân phối.

### 14. Công thức xuống dòng giữa một tích trên phone

- Vị trí: `$.sections[5].blocks[1].children[1]`, `$.sections[6].blocks[2].children[1]`, `$.sections[9].blocks[2].children[1]`; LL-12
- Nguồn: —
- Vấn đề: "3 ·" / "2", "12 · 20 −" / "12 · 1", "20 ·" / "60" bị tách dòng (ảnh `phone/069`, `phone/083`, `phone/113`).
- Sửa: tách theo dấu "=" / "<" bằng `gathered`, hoặc rút gọn.

### 15. "Số gần số tròn chục" mà ví dụ và bài tập là 98, 99; recap "nhân cả hai số" mơ hồ

- Vị trí: `$.sections[6].title`, `$.sections[6].blocks[0].children[0]`, `$.sections[6].recap.caption`, `$.cards[6].recap.caption`, `$.exercises[26]`, `[28]`, `[29]`, `[30]`; LL-10
- Nguồn: tr.19 (1.41: 29, 98, 998)
- Vấn đề: 98 "gần số tròn chục" dễ bị viết thành 90 + 8 (đúng nhiễu `9 · 90 + 8` của `chon-tinh-9-98`). Recap "nhân cả hai số rồi trừ" không rõ hai số nào, lệch note "nhân với 20 rồi trừ một lần thừa số kia".
- Sửa: "số gần số tròn chục, tròn trăm"; recap "nhân thừa số kia với cả hai số trong hiệu rồi trừ".

### 16. `sourceRef` sai trang: tính chất phân phối và đặt tính nằm ở tr.18

- Vị trí: `$.sections[5].sourceRef`, `$.cards[5].sourceRef` ("tr.17, 19"); `$.sections[7]`, `[8]`, `$.cards[7]`, `[8]` ("tr.17"); `$.sections[13].sourceRef`, `$.cards[13].sourceRef` ("tr.17, 20")
- Nguồn: `sbt-p18.png` (tính chất phân phối, dòng "Đặt tính")
- Vấn đề: tr.17 chỉ có tên gọi, giao hoán, kết hợp, phép chia; tr.20 không nói về đặt tính chia.
- Sửa: section, card 6 ghi "Sách bài tập tr.18, 19"; section 8, 9, 14 sửa cùng lúc với Nghiêm trọng 3.

### 17. `chon-nhieu-nho-hon-500`: lựa chọn 52 · 9 không quyết được bằng cách của section

- Vị trí: `$.exercises[43]`, option `b`
- Nguồn: tr.20 (1.47, 1.49)
- Vấn đề: 450 < 52 · 9 < 540 chứa 500, trẻ làm theo recap sẽ bí hoặc đoán.
- Sửa: đổi `b` thành `47 \cdot 9` (< 450).

### 18. Câu ôn `sap-buoc-38-5` lặp đúng tích riêng thứ nhất của recap section 9

- Vị trí: `$.exercises[35]` so với visual `nhan-hai-chu-so-tom-tat` (38 · 25, hàng đầu 38 · 5 = 190); LL-07
- Nguồn: —
- Vấn đề: ba bước cần xếp trùng số với recap vừa xem.
- Sửa: đổi số câu ôn (vd 47 · 5) hoặc đổi recap.

### 19. Câu quy tắc tính chất phân phối bám sát câu của sách

- Vị trí: `$.sections[5].blocks[1].children[0]`; LL-08
- Nguồn: tr.18, `sbt-p18.png`
- Vấn đề: giữ nguyên cụm dài của sách, chỉ đổi đầu câu; chưa trùng nguyên văn.
- Sửa: "Muốn nhân một số với một tổng, ta nhân số đó với từng số trong ngoặc rồi cộng lại." (khớp recap).

### 20. Cả ba câu của section `tim-loi-sai` lặp nguyên số và chữ của hình quy tắc ngay trước

- Vị trí: `$.exercises[69]` (`chon-loi-36-5`), `$.exercises[70]` (`loi-nhan-47-6`), `$.exercises[73]` (`loi-thuong-367-9`); visual `loi-sai-ba`, `tim-loi-sai-tom-tat`, `loi-sai-soat`; LL-07
- Nguồn: tr.19, `sbt-p19.png` (1.43)
- Vấn đề: đáp án đúng chép y câu lý do trong tab; trẻ chỉ nhận lại câu vừa đọc.
- Sửa: giữ ba kiểu lỗi, đổi số (vd 43 : 6 = 6 dư 7; 38 · 7 viết 216; 458 : 9 thiếu chữ số 0), viết lại lựa chọn đúng khác câu trong hình.

### 21. Câu kiểm tra `chon-du-23-4` trùng ví dụ mở đầu section

- Vị trí: `$.exercises[50]`, visual `chia-keo-23-4` (`$.sections[11].blocks[0]`); LL-07
- Nguồn: —
- Vấn đề: hình vừa chạy "23 cái kẹo cho 4 bạn … dư 3 cái" (ảnh `134-s12-01-block-end.png`).
- Sửa: đổi số (vd 26 kẹo, 4 bạn, dư 2).

### 22. Phép chia 29 : 6 dùng lại ở ba câu liền nhau

- Vị trí: `$.exercises[51]` (`chia-keo-29-6`), `$.exercises[55]` (`chon-du-dung-29-6`), `$.exercises[68]` (`chon-nhieu-them-1`, lựa chọn c); LL-07
- Nguồn: —
- Vấn đề: câu kiểm tra `kiem-tra-chia` hỏi lại phép chia trẻ vừa làm ở câu luyện tập trước đó.
- Sửa: đổi số `chon-du-dung-29-6` (vd 34 : 8 với nhiễu 3 dư 10, 4 dư 3, 4 dư 8) và lựa chọn c.

### 23. Câu kho ôn `dien-du-47-9` trùng số recap `kiem-tra-chia`

- Vị trí: `$.exercises[53]` so với visual `kiem-tra-chia-tom-tat` (47 : 9 = 5 dư 2); LL-07
- Nguồn: —
- Vấn đề: đáp án là số trẻ vừa thấy ở "Nhớ nhé!" (ảnh `157-s13-06-recap.png`).
- Sửa: đổi số recap hoặc câu ôn (vd recap 53 : 8 = 6 dư 5).

### 24. Hình xếp nhóm dùng chữ "đựng" cho người và cho tiền

- Vị trí: visual `xep-xe-50-12`, `mua-vo-100-12` (`$.sections[14].blocks[0]`, `[1]`), `chon-thung-150-24-goi-y`/`-giai`, `bai-toan-chia-tom-tat`; `src/visuals/math/phep-nhan-phep-chia/pack-logic.ts:76`; LL-15, LL-19
- Nguồn: tr.20, `sbt-p20.png` (1.46)
- Vấn đề: "Mỗi xe đựng 12 học sinh", "Mỗi quyển vở đựng 12 nghìn đồng" (ảnh `172`, `174`), lệch caption "chở tối đa", "giá".
- Sửa: thêm tham số động từ cho `pack` (vd `perPhrase`: "chở", "giá", "đựng").

### 25. Hình chia đều luôn nói "chia cho … bạn" dù đề chia vào túi, hộp

- Vị trí: visual `chia-deu-24-6` (`$.sections[10].blocks[0]`), `chia-56-8-giai` (`$.exercises[46]`); `share-logic.ts:75`, `share.tsx:55`; LL-15
- Nguồn: —
- Vấn đề: hình ghi "chia cho 6 bạn" (ảnh `123-s11-01-block.png`) còn caption "vào 6 túi"; lời giải `chia-56-8` nói "bạn" khi đề nói "hộp".
- Sửa: cho `share` nhận tên nhóm như `groupWord` của `pack`.

### 26. Recap `tim-loi-sai-tom-tat` là hình quy tắc có tab, mặc định chỉ thấy một lỗi

- Vị trí: `$.sections[15].recap`, `$.cards[15].recap` (visual `tim-loi-sai-tom-tat`); LL-06
- Nguồn: —
- Vấn đề: caption nhắc ba chỗ soát nhưng màn chỉ hiện tab "Số nhớ"; trên phone dòng "Tích là 282" bị thanh dưới che (ảnh `189-s16-05-recap.png`).
- Sửa: recap tĩnh một màn, ba dòng phép tính sai có viền cam kèm đáp án đúng, bỏ tab.

### 27. Recap `kiem-tra-chia` thiếu quy tắc "tìm thương" mà tên section nêu

- Vị trí: `$.sections[12].recap`, `$.cards[12].recap`; LL-06
- Nguồn: tr.17, `sbt-p17.png`
- Vấn đề: section có ba quy tắc cần nhớ riêng, recap chỉ có hai; câu ôn `tim-thuong-50-2-6` cần quy tắc thứ ba.
- Sửa: tách "tìm thương" ra section riêng, hoặc thêm một câu vào recap và dòng `(47 − 2) : 9 = 5` vào hình.

### 28. `chon-loi-36-5`: đề hỏi "số nào" nhưng lựa chọn là câu, nhiễu quá yếu

- Vị trí: `$.exercises[69].prompt`, `options` b, c, d; LL-10, LL-14
- Nguồn: —
- Vấn đề: "Thương 6 là số chẵn", "Số bị chia 36 quá lớn", "Số chia 5 quá nhỏ" loại được ngay.
- Sửa: đề "Lỗi sai của Lê là gì?"; nhiễu "Thương 6 phải là 5", "5 · 6 + 6 không bằng 36", "Phép chia này đúng".

### 29. Chữ tiếng Việt "dư" nằm trong TeX của `chon-nhieu-chia-sai`

- Vị trí: `$.exercises[72].options[*].content` (`"tex": "47 : 5 = 9 dư 2"`)
- Nguồn: —
- Vấn đề: `pitfalls.md` cấm chữ Việt trong TeX (KaTeX dùng font dự phòng); câu ở kho ôn nên walk không chụp.
- Sửa: đổi bốn lựa chọn sang `{"type": "text", ...}` như `chon-du-dung-29-6`.

### 30. Phép tính bị ngắt giữa dòng trong hình lỗi sai và trong lựa chọn

- Vị trí: `mistakes.tsx` (dòng `reason`, `right`); `$.exercises[70].options[a]`; LL-12
- Nguồn: —
- Vấn đề: "vì 9 · / 40 + 7", "4 · / 6" xuống dòng giữa phép tính trên phone, "4 · 6 / = 24" trên iPad.
- Sửa: bọc từng phép tính trong `whitespace-nowrap`; rút gọn lựa chọn thành "Quên cộng số nhớ 4".

### 31. Lỗi "quên số nhớ" không phải lỗi của bài 1.43 trong sách

- Vị trí: `$.sections[15].blocks[0].children[0]`, visual `loi-sai-ba` tab 1 (`sourceRef` "Sách bài tập tr.19")
- Nguồn: tr.19, `sbt-p19.png`; lời giải tr.99, `sbt-p99.png`
- Vấn đề: lỗi 1 của sách là tích riêng viết sai trong phép chia 458 : 6; bài thay bằng phép nhân 47 · 6 không có trong trang nguồn.
- Sửa: đổi tab 1 thành "nhân sai trong một lượt chia" (số khác sách), hoặc giữ và thêm `sourceRef` tr.18.

## Góp ý

### 1. Chú thích "Nơi đáp" khó hiểu

- Vị trí: visual `bang-nhan-nhay-cach` (`$.sections[1].blocks[1].children[1]`), `tinh-tuan-ngay-goi-y`, `tinh-tuan-ngay-giai`
- Nguồn: —
- Vấn đề: từ lạ với trẻ.
- Sửa: "Chỗ dừng".

### 2. Bàn phím số có phím "mũ" trước bài Luỹ thừa (báo người làm app)

- Vị trí: mọi câu `numeric` (ảnh `ipad/013`, `ipad/026`, `129`, `152`)
- Nguồn: —
- Vấn đề: phím chưa dạy có thể làm trẻ bối rối; do bố cục app, không chặn bài.
- Sửa: chỉ hiện phím mũ khi câu có đáp án luỹ thừa.

### 3. `sap-buoc-32-25`: xếp được bằng cách nối vế

- Vị trí: `$.exercises[20].items`; LL-14
- Nguồn: —
- Vấn đề: vế trái mỗi bước là vế phải bước trước.
- Sửa: "Tách 32 = 8 · 4", "Nhóm 4 · 25 = 100", "Nhân 8 · 100 = 800".

### 4. `chon-nhieu-4-nhan-9`: lựa chọn chín số 4 dài, dễ đếm sai

- Vị trí: `$.exercises[2].options[1]`
- Nguồn: —
- Vấn đề: trẻ phải đếm 9 số hạng; theo luật section 1 hiện tại còn cần giao hoán (dạy sau).
- Sửa: dùng số nhỏ hơn (vd `3 · 6`), soát lại theo quy ước chốt ở Nghiêm trọng 1.

### 5. Số hạng trong `6 + 6 + 6 + 6` được tô màu "Thừa số"

- Vị trí: visual `nhan-hop-banh`, `nhan-cong-lap-tom-tat`, `tinh-ba-keo-goi-y`, `tinh-ba-keo-giai`
- Nguồn: —
- Vấn đề: trong tổng chúng là số hạng.
- Sửa: để màu trung tính, chỉ tô thừa số trong phép nhân.

### 6. Hình `bang-nhan-day-du` đánh dấu cả cột 6 nhưng chú thích chỉ nói "Hàng 6"

- Vị trí: `$.sections[1].blocks[0].children[1]`
- Nguồn: —
- Vấn đề: tam giác ở đầu cột 6 không ứng với phần tô nào (ảnh `ipad/018`).
- Sửa: bỏ tam giác, hoặc tô cả cột và sửa chú thích.

### 7. Trạng thái đầu của `giao-hoan-ghe`, `dien-7-9-goi-y` dùng "…" làm chỗ trống

- Vị trí: `$.sections[3].blocks[0]`, visual `dien-7-9-goi-y`
- Nguồn: —
- Vấn đề: khác quy ước "?" mờ của các hình từng bước khác.
- Sửa: "? · ? = ? · ? = ?" mờ.

### 8. Recap `ten-goi` dùng lại 24 : 6 = 4 của câu kiểm tra ngay trước

- Vị trí: `$.sections[2].recap` so với `$.exercises[8]` (`noi-ten-24-6`); LL-07
- Nguồn: —
- Vấn đề: recap lặp đúng phép chia vừa hỏi.
- Sửa: bộ số khác (không trùng số đổi ở Nghiêm trọng 2).

### 9. "Tăng đều từng bậc" trừu tượng

- Vị trí: `$.sections[1].blocks[1].children[0]`, `$.sections[1].recap.caption`, `$.cards[1].recap.caption`
- Nguồn: —
- Vấn đề: "bậc" không rõ nghĩa.
- Sửa: "Trong mỗi hàng của bảng nhân, ô sau hơn ô trước đúng bằng số của hàng."

### 10. "Chọn cách viết đúng của …" nên thành "Chọn biểu thức bằng …"

- Vị trí: `$.exercises[21]`, `$.exercises[26]`
- Nguồn: —
- Vấn đề: "cách viết đúng" mơ hồ; `chon-nhieu-7-13` đã dùng "biểu thức bằng".
- Sửa: "Chọn biểu thức bằng 4 · (20 + 3)."

### 11. Quy tắc nhớ ở section 8 chưa nói cột cuối viết cả số

- Vị trí: `$.sections[7].blocks[1].children[0]`, `$.sections[7].recap.caption`
- Nguồn: —
- Vấn đề: hình ghi "viết 22" ở cột cuối (`phone/091`), trẻ có thể chỉ viết 2.
- Sửa: thêm "Ở cột cuối cùng thì viết cả số."

### 12. Số nhớ xếp chồng hai tầng; hình cùng làm nhỏ hơn hình mẫu

- Vị trí: `nhan-cot-36-24`, `nhan-hai-chu-so-tom-tat`, `tinh-35-26-giai`; `nhan-cot-23-14-cung-lam`, `nhan-cot-26-4-cung-lam`
- Nguồn: —
- Vấn đề: không rõ số nhớ nào của lượt nào; hình cùng làm lọt thỏm trên iPad ngang (`ipad-landscape/102`).
- Sửa: làm nhạt số nhớ đã dùng; tăng cỡ chữ hình cùng làm khi còn chỗ.

### 13. "không nhỏ hơn" nên đổi thành "lớn hơn"

- Vị trí: visual `loi-sai-ba` tab 2, `rem-check.tsx:172`, lựa chọn a của `chon-loi-36-5`, `tim-loi-61-9`
- Nguồn: —
- Vấn đề: câu khẳng định dễ đọc hơn.
- Sửa: "Số dư 6 lớn hơn số chia 5." (hay "bằng hay lớn hơn" như note `kiem-tra-chia`).

### 14. Nhiễu "Tính sai 7 · 6 = 42" khó hiểu

- Vị trí: `$.exercises[70].options[b]`
- Nguồn: —
- Vấn đề: đọc được hai cách.
- Sửa: "Tính sai 7 · 6 thành 32".

### 15. "Bấm" và "Chạm" trong cùng một màn

- Vị trí: `$.sections[11].blocks[3].children[0]`; `share-try.tsx:36`
- Nguồn: —
- Vấn đề: một thao tác hai tên.
- Sửa: dùng "Bấm".

### 16. Hình "Chữ số 0" vẽ cả bước 9 · 0 = 0 dù đang nói trẻ quên chữ số 0

- Vị trí: visual `loi-sai-ba` tab 3 (`MissingZeroPicture` trong `mistakes.tsx`)
- Nguồn: tr.19, `sbt-p19.png`
- Vấn đề: bài làm sai lại có lượt chia thứ hai.
- Sửa: hình sai dừng ở "07".

### 17. Hình `kiem-tra-du-37-5` vẽ phần dư vượt số chia bằng ô rỗng

- Vị trí: visual `kiem-tra-du-37-5` (`rem-check.tsx`)
- Nguồn: —
- Vấn đề: 5 ô đặc và 2 ô rỗng, dễ đếm thành 5 (ảnh `147`).
- Sửa: vẽ đủ 7 ô hồng, chỉ viền cam 2 ô vượt vạch.

### 18. Trang dev visual có chiều cao cố định làm tab 3 tràn khung (báo người làm app)

- Vị trí: `src/app/dev/visuals/[id]/page.tsx:20` (`h-visual-frame`)
- Nguồn: —
- Vấn đề: chỉ ảnh `visual:shot` bị, trong bài không bị; dễ làm người soát hiểu nhầm.
- Sửa: dùng `min-h-visual-frame`.

### 19. Hình minh hoạ đặt sẵn đủ số ô trước khi giải

- Vị trí: visual `mua-vo-100-12`, `xep-xe-50-12`
- Nguồn: —
- Vấn đề: bước đầu đã cho thấy kết quả, bớt phần "tìm ra".
- Sửa: hiện thêm từng ô sau mỗi lần bấm "Bước tiếp".

### 20. Một màu hai khái niệm: xanh cho cả thừa số và số bị chia, hổ phách cho cả tích và thương

- Vị trí: `$.concepts` (theo `content/glossary/math.json`); `$.sections[3].blocks[1].children[1]` (`3 · 7 = 21`: thừa số xanh, tích hổ phách) so với `$.sections[10].blocks[1].children[2]` (`24 = 6 · 4`: 24 xanh dù là tích, hai thừa số 6 tím và 4 hổ phách)
- Nguồn: —
- Vấn đề: ở `24 = 6 · 4` trẻ vừa học "xanh là thừa số, hổ phách là tích" lại thấy tích màu xanh và thừa số màu hổ phách. Màu do glossary chung của môn quy định nên không chặn bài.
- Sửa: cân nhắc ở glossary cho số bị chia, thương màu riêng; hoặc bỏ màu ở dòng `24 = 6 · 4`.
