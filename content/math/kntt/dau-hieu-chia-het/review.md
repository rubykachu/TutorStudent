# Review: Dấu hiệu chia hết (`dau-hieu-chia-het`)

- Bài: `content/math/kntt/dau-hieu-chia-het/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: chia-het-2-5, tong-chu-so, chia-het-9, chia-het-3, cho-hai-so, tich-chia-het, tong-hieu, luy-thua-10, tim-chu-so, diem-thi, but-vo, lap-so (kèm đọc lại cả `catalog.ts` và các hình dùng chung `Bags`, `Row`, ô chữ số "?")
- Nguồn đã đọc: `sources/math/dau-hieu-chia-het/` - sbt-p33, sbt-p34
- `content:check`: 0 lỗi, 0 cảnh báo của bài (còn cảnh báo id chưa khoá vì bài chưa xuất bản)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/dau-hieu-chia-het/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `3bd09ff43e8f0d53c73664d378f27a387ce0ea3a2f026481edd967cddba43762` (`pnpm content:diff` so với bản này)

Đối chiếu vòng 2: hai Nghiêm trọng đã sửa đúng. Câu quy tắc `luy-thua-10` chỉ còn "cộng thêm một số có một chữ số", khớp từng chữ với recap section và recap card (đã so máy cả 14 section: note quy tắc, recap section, recap card trùng nguyên văn). Hình `diem-chia-het-3` và `tom-tat-diem` ghi `= 36 ⋮ 3` / `= 9 ⋮ 3` và "Báo 29 / 31 điểm: chắc chắn tính sai" (ảnh `phone/142`, `phone/148`). Các Nên sửa 1-4, 5-14, 16-22 đã sửa đúng, riêng Nên sửa 15 (năm màn chạm thiếu dòng lý do) sửa sai chỗ ở một màn, xem Nghiêm trọng 1. Đã tự giải các câu mới hay đổi trước khi đọc `answer`: `tong-7036`, `tong-27-chia-het-9`, `dien-9-3105`, `chon-3-5-345`, `diem-nhieu-12`, `diem-nam-83`, `mua-vo-45`, `lap-so-037`, `chon-nhieu-10-3`, `hop-bi-102`, `hop-banh-tui`, `tien-but-60`, `chon-chia-het-9`, `chon-nhieu-9`: đều đúng một đáp án (hay đúng một tập), nhiễu không thành đáp án đúng, nhẩm không quá 2 phép. Id mới đều có hình trong catalog, không còn hình mồ côi. Hình dùng chung: `Bags` chỉ ẩn "Còn thừa" khi không còn thừa, `NumberStepper` hiện "?" tới lần bấm đầu; đã chạy lại `pnpm visual:shot quan-he-chia-het-va-tinh-chat` (152/152 qua) và xem ảnh `chia-tui-12-3`, `chia-tui-goi-y-19-5`, `chia-tui-tu-chon`, `chia-tui-giai-26-6`: Bài 8 không bị hỏng.

## Nghiêm trọng

### 1. Sửa nhầm màn: note "3 khác 9" bị thay bằng lời chạm vào hình không chạm được - LL-20

- Vị trí: `$.sections[5].blocks[2].children[0].text` (section `chia-het-3`, màn hình `ba-khac-chin`) và `$.sections[5].blocks[3].children[0].text` (màn `chon-3-1410`)
- Nguồn: tr.33 mục 2 `sbt-p33.png`
- Vấn đề: bản sửa Nên sửa 15 (thêm dòng lý do cho màn chạm `chon-3-1410`) ghi nhầm vào khối đứng trước. Note cũ "Dấu hiệu chia hết cho 3 khác dấu hiệu chia hết cho 9. Số 2 415 chia hết cho 3 nhưng không chia hết cho 9." bị ghi đè bằng "Chạm vào các số chia hết cho 3 bằng cách cộng ... Làm vậy giúp bạn biết ... mà không cần chia." Màn `ba-khac-chin` là hình tĩnh (bốn dòng `12 ⋮ 3`, `12 ⋮̸ 9`, `2 415 ⋮ 3`, `2 415 ⋮̸ 9`), không có gì để chạm: trẻ được bảo chạm vào chỗ không có (ảnh `phone/066-s6-03-block.png`), và bốn dòng không còn câu nào nói chúng cho thấy gì. Ý "chia hết cho 3 chưa chắc chia hết cho 9" chỉ còn ở hình, trong khi câu điền `dien-3-9-5232` (đáp án "không chia hết cho 9") dựa đúng vào ý đó. Màn chạm thật `chon-3-1410` vẫn chỉ có "Chạm vào các số chia hết cho 3. Cộng các chữ số của từng số rồi xét tổng." không có dòng lý do (ảnh `phone/067-s6-04-block.png`).
- Sửa: trả note của `ba-khac-chin` về một câu nói rõ hình cho thấy gì, vd "Số có tổng các chữ số chia hết cho 3 chưa chắc chia hết cho 9: 12 chia hết cho 3 nhưng không chia hết cho 9, nên 2 415 chia hết cho 3 và không chia hết cho 9." Chuyển câu lý do ("Chạm vào các số chia hết cho 3: cộng các chữ số của từng số rồi xét tổng. Làm vậy giúp bạn biết số chia hết cho 3 mà không cần chia.") sang note của `chon-3-1410` (`blocks[3]`). Sau khi sửa soát lại ảnh walk của màn 6-03 và 6-04.

## Nên sửa

### 1. `tong-7036` có đáp án 16 trùng câu kiểm tra và recap

- Vị trí: `ex.tong-7036` (`card.tong-chu-so`, kho ôn) - LL-07
- Nguồn: —
- Vấn đề: đáp án 16 cũng là đáp án của câu kiểm tra `tong-574` (5 + 7 + 4) và là tổng ở hình recap `tom-tat-tong-8215` (8 + 2 + 1 + 5). Trẻ ôn có thể trả lời "16" theo trí nhớ thay vì cộng. Các tổng khác của section đã dùng: 12 (`tong-5214`), 15 (`tong-5082`), 21 (`cong-6384`).
- Sửa: đổi số nhà sang số có tổng chưa dùng và vẫn nhẩm hai phép, vd 9 031 (tổng 13); sửa đề, `check.expr`, hình `giai-cong-7036` và id.

### 2. Câu kiểm tra `tong-27-chia-het-9` cùng tổng và cùng kết luận với hình quy tắc

- Vị trí: `ex.tong-27-chia-het-9` (`checkIds` của `chia-het-9`) so với visual `tong-5976-9` (`$.sections[4].blocks[1]`) - LL-07
- Nguồn: —
- Vấn đề: hình ngay trước câu kiểm tra hiện `5 + 9 + 7 + 6 = 27` rồi `27 ⋮ 9`; câu kiểm tra cho sẵn "tổng là 27" và hỏi có chia hết cho 9 không, đáp án "Có, vì 27 chia hết cho 9". Chỉ đổi số 5 976 thành 5 886; trẻ chép lại hình mà không cần so với bảng 9 đến 45. Ở vòng 2 đây là Góp ý "mọi tổng đều 18"; đổi sang 27 lại trùng hình quy tắc.
- Sửa: đổi kết luận để trẻ phải so với bảng 9 đến 45, vd "Tổng các chữ số của số 5 884 là 25. Số 5 884 có chia hết cho 9 không?" với đáp án "Không, vì 25 không chia hết cho 9", nhiễu "Có, vì 25 chia hết cho 9" và "Không, vì 5 884 có chữ số tận cùng là 4". Sửa id theo số mới.

### 3. `lap-so-037` không thử luật "0 không đứng đầu" và lặp cấu trúc recap

- Vị trí: `ex.lap-so-037` (`card.lap-so`, kho ôn); recap `tom-tat-lap` - LL-07, LL-16
- Nguồn: tr.34 câu 2.18, `sbt-p34.png`
- Vấn đề: với 0, 3, 7 chia hết cho 2, chữ số tận cùng chỉ có thể là 0 nên 037 vốn đã lẻ; câu "Chữ số 0 không đứng đầu" không ảnh hưởng đáp án 2. Cấu trúc y như recap (3, 6, 7 cho 376 và 736: một chữ số chẵn, hai chữ số lẻ xếp hai cách, ra 2 số). Câu độ khó 3 nhưng chỉ là câu recap thay chữ số.
- Sửa: dùng bộ để luật 0 đứng đầu có tác dụng và đáp án khác 2, 3, 4, vd các chữ số 0, 2 và 4 lập số ba chữ số chia hết cho 2: tận cùng 0 được 240, 420; tận cùng 2 được 402 (042 bị loại); tận cùng 4 được 204 (024 bị loại): 5 số. Đổi id, `check.expr`, tự giải lại.

## Góp ý

### 1. Màu amber còn dùng cho "Tích" và cho nhãn khác của bài

- Vị trí: `concepts[3]` (`concept.tich`) so với `giai-banh-60`, `lan-7-2`, `diem-chia-het-3`, `but-vo-55`, `tom-tat-but-vo` (`catalog.ts`)
- Nguồn: —
- Vấn đề: Nên sửa 2 vòng 2 đã gỡ "Tổng các chữ số" khỏi amber (nay lime) và số túi (chữ thường). Amber còn lại vừa là khái niệm "Tích" ở section `tich-chia-het`, vừa tô "Mỗi hộp xếp được 2 túi" ở hình lời giải `giai-banh-60` của chính section đó.
- Sửa: tô nhãn `giai-banh-60` bằng slate, hoặc đổi màu `concept.tich` sang màu chưa dùng.

### 2. Câu ôn `chon-nhieu-10-3` vẫn lặp phép "+ 5" của chip trên màn

- Vị trí: `ex.chon-nhieu-10-3`, `ex.chon-10-9` so với chip `chon-10-3` - LL-07
- Nguồn: —
- Vấn đề: `10⁶ + 5` là `10⁵ + 5` của chip đổi số mũ; `10³ + 6` nằm ở cả hai câu ôn.
- Sửa: thay `10⁶ + 5` bằng số thêm chưa dùng (vd `10⁶ + 2`), `10³ + 6` ở `chon-10-9` bằng `10³ + 3`.

### 3. Hình gợi ý `goi-y-107-9` không nhắc luỹ thừa của 10

- Vị trí: `ex.dien-10-5` `hints.hintVisualId` - LL-15
- Nguồn: —
- Vấn đề: hình chỉ xét chữ số của 107 (tổng 8), không có "10² + 7" nên trẻ không thấy phép "1 cộng số được thêm" của section.
- Sửa: đổi sang hình `lines` có dòng đầu "10² + 7 = 107" rồi "1 + 7 = 8" và dừng ở "?".

### 4. `hop-banh-tui` dùng 10 và 5 như recap `tom-tat-tich-10-3`

- Vị trí: `ex.hop-banh-tui` - LL-07
- Nguồn: —
- Vấn đề: hình recap của card đã là "10 chia hết cho 5, nên tích 10 · 3 chia hết cho 5".
- Sửa: đổi bộ số, vd mỗi hộp 8 cái, túi 4 cái, 7 hộp (8 : 4 = 2, 2 · 7 = 14); sửa `check.expr` và `giai-banh-60`.

### 5. Hai chỗ diễn đạt lạ

- Vị trí: `ex.xep-1530` `items[1]` ("Đã có chia hết cho 5"); visual `goi-y-nhom-it-nhat` hàng 2 ("Đội có bạn, nên bỏ số 0")
- Nguồn: —
- Vấn đề: cả hai câu thiếu chủ ngữ, đọc lên khó hiểu.
- Sửa: "Số này đã chia hết cho 5. Xét tiếp tổng các chữ số: 1 + 5 + 3 + 0 = 9" và "Đội có ít nhất 1 bạn, nên bỏ số 0".

### 6. Note `lap-035` còn liệt kê ba số trong khi hình đã làm việc đó

- Vị trí: `$.sections[13].blocks[2].children[0].text`
- Nguồn: —
- Vấn đề: "ta lập được 350, 530 và 305" lặp hình ngay dưới, lộ trước hai dòng từng bước.
- Sửa: bỏ vế liệt kê, giữ "Chữ số 0 không đứng đầu một số ba chữ số."

### 7. Màu xanh dương vừa là tổng số đồ vật vừa là "Thừa số"

- Vị trí: hình `bags` (`tui-24-3`, `hop-27-9`: số 24, 27 xanh dương) so với `concept.thua-so` (`hop-6-7`, `tich-12-7`)
- Nguồn: —
- Vấn đề: hai nghĩa của một màu ở hai section khác nhau, không nằm cùng màn.
- Sửa: nếu muốn chặt hơn, đổi màu `concept.thua-so` sang màu chưa dùng.
