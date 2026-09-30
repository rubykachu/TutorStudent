# Review: Thứ tự thực hiện các phép tính (`thu-tu-thuc-hien-phep-tinh`)

- Bài: `content/math/kntt/thu-tu-thuc-hien-phep-tinh/lesson.json`
- Vòng: 3 - phần đổi (`pnpm content:diff`, so với bản `2547d353…` của vòng 2), section: hoa-don, dau-phep-tinh, cong-tru, on-nhan-chia, nhan-hai-chu-so, nhan-chia, hon-hop, ngoac-tron, ngoac-long, luy-thua, bieu-thuc-chu, bai-tap-sach, tim-so-chua-biet; kèm spec trong `src/visuals/math/thu-tu-thuc-hien-phep-tinh/catalog.ts`, `statics.tsx`, `expr-svg.tsx`
- Nguồn đã đọc: `sources/math/thu-tu-thuc-hien-phep-tinh/` - p24, p26, p102
- `content:check`: 0 lỗi, 1 cảnh báo của bài (104 id chưa có trong `ids.lock.json`)
- `lesson:walk`: 0 FAIL, cảnh báo "text below 16px" chỉ ở màn done (của app), ảnh trong `.shots/walk/thu-tu-thuc-hien-phep-tinh/` (chụp 19:52–19:54, trước commit 79b84b9 lúc 19:55, cùng nội dung)
- Kết luận: Đã xuất bản
- Bản đã review: `99ac69420b46e1986b6a809ba949aa2d06e70a7870cb7a5fa196a0a41c36af8b` (`pnpm content:diff` so với bản này)

Đã tự giải mọi câu đổi hay thêm trước khi đọc `answer`: `tinh-cong-tru-1` (18), `tinh-hon-hop-1` (16), `tinh-day-du-1` (30), `tinh-day-du-3` (25), `tim-x-kiem-tra` (4), `tim-x-1` (20; 15; 3), `tim-x-2` (32; 24; 4), ba câu nhiều đáp án (a, b, d; a, b, e; a, c): đều đúng. Mọi `solutionVisualId` đổi chạy đúng số của đề; các hình gợi ý đổi dừng ở "?".

Mục của vòng 2:
- Đã hết: Nghiêm trọng 1 (note `cong-tru`, `nhan-chia`, recap `hon-hop`, `bai-tap-sach` nay cùng một cách nói "làm từ trái sang phải"; nhãn cột sai của `cong-tru-so-sanh`, `nhan-chia-so-sanh`, `hon-hop-so-sanh`, `luy-thua-so-sanh` nói đúng phép bị làm sai chỗ; có câu cộng đứng đầu `9 + 15 − 6`), trừ nhãn `tong-hop-dong-viet-lai` (Nên sửa 1 dưới đây). Nên sửa 1, 2, 3 (ảnh phone, iPad không còn ngắt giữa phép tính), 4 (cột Lan xám, có ×), 6, 7, 8, 10, 11, 12, 13. Góp ý 2, 4 (vòng chọn không còn đè chữ số, ảnh phone và iPad `033-s3-03-block.png`), 14 (đề), 16.
- Đã chuyển vào `backlogs/lesson-thu-tu-thuc-hien-phep-tinh.md`: Nên sửa 9, 16; Góp ý 1, 5, 10, 18 và một phần Góp ý 9.
- Còn, gộp vào vòng này: Nên sửa 5 (Nên sửa 2), Nên sửa 15 (Góp ý 3), Góp ý 11 (Góp ý 4).
- Còn mở, ngoài phần đổi, chưa có trong backlog (không soát lại ở vòng này): Nên sửa 14 (`overview.summary` ba câu, không nhắc biểu thức chứa chữ); Góp ý 3, 6, 7, 8, 12, 13, 15, 17. Tác giả sửa hoặc ghi vào backlog.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Nhãn cột sai của `tong-hop-dong-viet-lai` vẫn là "Sai: cộng trước"

- Vị trí: spec `tong-hop-dong-viet-lai` (`wrongLabel`) trong `src/visuals/math/thu-tu-thuc-hien-phep-tinh/catalog.ts`; `$.sections[11].blocks[3].children[1]` (`section.bai-tap-sach`)
- Nguồn: tr.24, `p24.png`
- Vấn đề: Ảnh phone `130-s12-04-block.png`. Mọi nhãn cột sai khác của bài nay ghi "Sai: làm … trước"; riêng nhãn này còn là câu chung "Sai: cộng trước", đọc tách khỏi hình là "cộng trước thì sai", trái với `9 + 15 − 6` trẻ vừa làm ở section `cong-tru`. Vòng 2 đã nêu nhãn này trong Nghiêm trọng 1. Không xếp Nghiêm trọng vì trong biểu thức `5 + 3 · 2` của hình nhãn vẫn đúng, và không câu nào sau đó trong section có phép cộng được làm trước.
- Sửa: `wrongLabel: "Sai: làm 5 + 3 trước"`.

### 2. Câu chuyện mua quà của section ngoặc lồng vẫn không có kết

- Vị trí: `$.sections[8].blocks[2].caption` (visual `ngoac-long-tung-buoc`)
- Nguồn: —
- Vấn đề: Ảnh phone `097-s9-03-block-end.png`. Caption đã rõ giá mỗi gói kẹo và 10 nghìn đồng là tiền túi, nhưng không nói 32 là số tiền gì; trẻ thấy hình ra 32 mà không biết câu chuyện hỏi gì (luật "câu chuyện có kết"). Phần còn lại của vòng 2 Nên sửa 5.
- Sửa: Thêm câu kết: "… Tiền túi đựng quà là 10 nghìn đồng. Cần tất cả 32 nghìn đồng."

### 3. Câu kho ôn luỹ thừa có lựa chọn cần quy tắc ngoặc mà card luỹ thừa không dạy

- Vị trí: `$.exercises[?(@.id=="thu-tu-thuc-hien-phep-tinh.ex.chon-nhieu-luy-thua-truoc")].options[4]` (`(1 + 2) \cdot 3^{2}`), `cardIds: [card.luy-thua]`
- Nguồn: tr.24, `p24.png` (hàng "Có các loại dấu ngoặc")
- Vấn đề: Đáp án đúng (không chọn e) đòi hỏi biết ngoặc làm trước luỹ thừa. Card `luy-thua` mà câu này ôn lại nói "Có luỹ thừa thì tính luỹ thừa trước…" và bậc thang `luy-thua-bac-uu-tien` chỉ có ba bậc: luỹ thừa, nhân chia, cộng trừ. Trẻ áp đúng quy tắc của card sẽ chọn e và bị chấm sai. Quy tắc ngoặc trước luỹ thừa có trong bài (section `bai-tap-sach`, card `tinh-day-du`), nên đây là lệch card chứ không phải kiến thức ngoài bài.
- Sửa: Thêm `card.tinh-day-du` vào `cardIds` (bậc thang của card đó có đủ bốn bậc), hoặc thay e bằng một biểu thức không có ngoặc, ví dụ `3^{2} + 2 \cdot 5` (luỹ thừa làm đầu, thêm một đáp án đúng).

## Góp ý

### 1. Chú thích màn cùng làm dùng "để tính ra nó"

- Vị trí: caption của `$.sections[2].blocks[3]`, `[5].blocks[3]`, `[6].blocks[3]`, `[7].blocks[3]`, `[8].blocks[3]`, `[9].blocks[3]`
- Nguồn: —
- Vấn đề: "Chạm phép tính bên trái nhất để tính ra nó" đọc hơi vấp; "nó" chỉ phép tính vừa chạm, trẻ phải đọc lại.
- Sửa: "Chạm phép tính bên trái nhất để tính trước, vì cộng và trừ làm từ trái sang phải." (các caption khác đổi theo).

### 2. Hai câu tính dài dùng chung phần đầu `3 · 2³ + 5 · 4`

- Vị trí: `$.exercises[…]` `tinh-day-du-1` (`3 \cdot 2^{3} + 5 \cdot 4 - 2 \cdot 7`) và `tinh-day-du-3` (`3 \cdot 2^{3} + 5 \cdot 4 - 14 \cdot 2 + 9`), cùng card `tinh-day-du`
- Nguồn: tr.26 bài 1.63
- Vấn đề: Câu kho ôn chép lại hai tích đầu của câu luyện tập; trẻ nhớ 24 + 20 từ lần trước thay vì tính lại.
- Sửa: Đổi phần đầu của `tinh-day-du-3`, ví dụ `2 \cdot 3^{2} + 4 \cdot 5 - 14 \cdot 2 + 9` (= 19), sửa `check.expr` và hai visual `tinh-day-du-3-*`.

### 3. Note "giữa hai chữ" nay không còn ví dụ; lỗi "hai mươi bốn" chỉ có bằng chữ

- Vị trí: `$.sections[10].blocks[1].children[0].text`, visual `chu-bo-dau-nhan` (nay là 2x, x = 4)
- Nguồn: tr.24 (`p24.png`, ví dụ S = ab)
- Vấn đề: Ảnh phone `117-s11-02-block.png`. Hình đổi từ ab sang 2x nên phần "hay giữa hai chữ" của note không có hình, trong khi câu kho ôn `tinh-chu-2` hỏi `ab − 4`. Cách đọc sai "24" vẫn chỉ viết bằng chữ, không có cột sai như các màn so sánh khác (phần còn lại của vòng 2 Nên sửa 15).
- Sửa: Thêm dòng "ab = a · b" vào hình, hoặc bỏ "hay giữa hai chữ" khỏi note; nếu làm được, thêm cột sai "24 ×" cạnh 2 · 4 = 8.

### 4. Hình gợi ý của `tim-x-1` và `tim-x-2` là cùng một đẳng thức không có nghiệm tự nhiên

- Vị trí: spec `tim-x-1-goi-y` và `tim-x-2-goi-y` (cả hai `4x + 4 = 4 · 2² + 9 : 3`)
- Nguồn: tr.26 bài 1.66 ("Tìm số tự nhiên x")
- Vấn đề: Vế phải bằng 19 nên 4x = 15, không chia hết cho 4 (vòng 2 Góp ý 11 chưa hết: `tim-x-1-goi-y` được đổi sang đúng spec của `tim-x-2-goi-y`). Hình dừng ở "?" nên trẻ không thấy 4x = 15, nhưng trẻ tính tiếp theo hình sẽ gặp phép chia không hết. Hai câu cùng card lại cùng một hình gợi ý.
- Sửa: `tim-x-1-goi-y`: `4x + 4 = 3 · 2² + 8` (vế phải 20, x = 4); `tim-x-2-goi-y`: `2x + 1 = 4 · 2² + 9 : 3` (vế phải 19, x = 9).

### 5. Hình lời giải `tim-x-kiem-tra-giai` lặp dòng "2x + 6 = 14"

- Vị trí: spec `tim-x-kiem-tra-giai` (findx, `rhs: "14"`); `TimSoChuaBiet` trong `statics.tsx` (việc của người làm visual)
- Nguồn: —
- Vấn đề: Ảnh phone `143-s13-02-exercise-tim-x-kiem-tra-wrong3.png`: khi vế phải là một số, dòng tiêu đề và dòng đầu của phần làm ngược giống hệt nhau, trẻ thấy cùng một dòng hai lần.
- Sửa: Trong `TimSoChuaBiet`, bỏ dòng đầu của phần làm ngược khi vế phải chỉ có một số.
