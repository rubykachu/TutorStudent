# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Nguồn đã đọc: `sources/math/luy-thua/` - p22, p23-24
- `content:check`: 0 lỗi, 0 cảnh báo của bài
- Kết luận: Đã xuất bản (`pnpm content:hash luy-thua --root content --approve` ghi reviewedHash `0a889877…be3bb`, đặt `status: published`)

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu kiểm tra và câu luyện tập chạm vùng dùng chung một hình 6⁴ chỉ có hai vùng

- Vị trí: `$.exercises[1]` (`luy-thua.ex.cham-co-so`, check của `luy-thua.section.luy-thua-la-gi`) và `$.exercises[5]` (`luy-thua.ex.cham-so-mu`, practice của cùng section, card `luy-thua.card.co-so-so-mu`)
- Nguồn: tr.22, `p22.png`
- Vấn đề: cả hai câu dùng `luy-thua.visual.cham-luy-thua`, hình cố định 6⁴ với đúng hai vùng `base` / `exponent`. Trẻ vừa chạm "6" ở câu kiểm tra thì câu luyện tập chỉ cần chạm "số còn lại", không cần hiểu số mũ là gì. Câu luyện tập được chấm điểm và mở card `co-so-so-mu`, nên kết quả đúng này làm FSRS đánh giá cao mức nhớ; phiên ôn lấy lại câu này cũng gặp đúng hình cũ.
- Sửa: cho câu luyện tập một luỹ thừa khác (vd 3⁵, cơ số và số mũ khác nhau, không phải 6 và 4). Có thể dựng visual chạm vùng nhận số qua `src/visuals/math/luy-thua/examples.tsx` như các visual dùng chung khác, rồi đăng ký thêm một id (vd `luy-thua.visual.cham-luy-thua-3-mu-5`) cho `cham-so-mu`.

## Góp ý

### 1. Công thức định nghĩa chỉ ghi "n" dưới ngoặc, thiếu chữ "thừa số"

- Vị trí: `$.sections[0].blocks[3]` (`luy-thua.section.luy-thua-la-gi`)
- Nguồn: tr.22, `p22.png` (khung định nghĩa ghi "n thừa số" dưới ngoặc)
- Vấn đề: dưới ngoặc chỉ có chữ `n` màu tím. Trẻ hay quên có thể không nối được "n" với "số thừa số"; visual `la-gi` ngay trước có dòng "5 thừa số" nhưng công thức tổng quát lại bỏ chữ này.
- Sửa: đổi nhãn ngoặc thành `\concept{violet}{n}` kèm chữ "thừa số" (vd `_{\concept{violet}{n} \text{ thừa số}}`), nếu `content:check` chấp nhận chữ trong TeX.

### 2. Gợi ý nấc 1 tô cả câu hỏi thay vì chỗ trẻ hay sai

- Vị trí: `$.exercises[0].hints.highlight[0]` (`luy-thua.ex.tim-o-16-hat`), `$.exercises[14].hints.highlight[0]` (`luy-thua.ex.lap-phuong-4`), `$.exercises[16].hints.highlight[0]` (`luy-thua.ex.chon-10-lap-phuong`), `$.exercises[19].hints.highlight[0]` (`luy-thua.ex.binh-phuong-8`)
- Nguồn: tr.22 và tr.23, `p22.png`, `p23-24.png`
- Vấn đề: đề chỉ có một câu chữ, nên `target: "block", index: 0` làm sáng cả câu hỏi. Không lộ đáp án, nhưng không chỉ vào chỗ hay sai (đọc "lập phương" thành nhân 3, "bình phương" thành nhân 2). Nấc 2 của ba câu sau đã có visual tách phép nhân nên ảnh hưởng nhỏ.
- Sửa: nếu muốn nấc 1 có ích hơn, thêm một khối đề chứa `\htmlId` quanh cụm cần chú ý (vd số cần tính) rồi trỏ highlight vào phần đó. Không được ghi sẵn số mũ, vì đọc "lập phương" thành số mũ 3 chính là điều câu hỏi kiểm tra.

### 3. Tổng theo hàng bị ngắt dòng ngay trước dấu "+"

- Vị trí: `$.sections[4].recap` (`luy-thua.section.luy-thua-cua-10`), `$.cards[11].recap` (`luy-thua.card.tong-luy-thua-10`)
- Nguồn: tr.23, `p23-24.png`
- Vấn đề: `gathered` căn giữa, dòng hai bắt đầu bằng `+ 8 · 10 + 4`; trẻ dễ mất tập trung có thể đọc hai dòng như hai phép tính riêng.
- Sửa: nếu màn hình đủ rộng thì giữ tổng trên một dòng; nếu phải ngắt, dùng `aligned` để dòng hai thụt vào dưới vế phải.
