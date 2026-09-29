# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Nguồn đã đọc: `sources/math/luy-thua/` - p22, p23-24
- `content:check`: 0 lỗi, 1 cảnh báo của bài (4 id chưa có trong `ids.lock.json`)
- `lesson:walk`: 3 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/luy-thua/`
- Kết luận: Đã xuất bản

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Số hạng của chữ số 0 biến mất khỏi tổng mà không có câu nào nói vì sao

- Vị trí: `$.sections[4].blocks[2]` (`luy-thua.visual.quy-tac-tach-so`, `TachSo` trong `src/visuals/math/luy-thua/tach-so.tsx`); cùng kiểu ở `$.sections[4].recap` (`TomTatLuyThua10`) và `$.cards[11].recap` (`TheTongLuyThua10`) trong `src/visuals/math/luy-thua/rules.tsx`
- Nguồn: tr.23, `p23-24.png` (Vận dụng 2)
- Vấn đề: câu quy tắc bảo "nhân mỗi chữ số với luỹ thừa của 10 ở hàng của nó, rồi cộng lại". Màn từng bước hiện `0 · 10²` dưới cột hàng trăm, nhưng tổng cuối `6 084 = 6 · 10³ + 8 · 10 + 4` lặng lẽ bỏ số hạng đó; recap (6 084) và thẻ ôn (8 059) cũng bỏ mà không giải thích. Người học chậm thấy tổng không làm đúng như câu quy tắc vừa đọc, trong khi `chon-tong-3-062` và `tinh-tong-7-409` bắt đúng chỗ này (hàng có chữ số 0). Ảnh: `ipad/108-s5-03-block-end.png`, `ipad/121-s5-10-recap.png`.
- Sửa: thêm một dòng ở bước cuối của `TachSo` và ngay dưới tổng trong recap, vd "0 · 10² = 0, nên không cần viết số hạng này." (chữ đặt trong JSX, như câu quy tắc).

## Góp ý

### 1. Walk FAIL trên điện thoại: thanh dưới che hàng phím "0" của bàn phím số

- Vị trí: `$.exercises[32]` (`luy-thua.ex.chia-luy-thua-10`)
- Nguồn: —
- Vấn đề: lỗi bố cục của app (bàn phím số cao hơn phần màn còn lại), không do nội dung bài; walk ghi hai dòng FAIL cho cùng màn. Ảnh: `phone/097-s4-08-exercise-chia-luy-thua-10.png`.
- Sửa: báo người làm app cho vùng trả lời cuộn được hoặc bàn phím gọn hơn. Không chặn bài.

### 2. Walk FAIL trên iPad ngang: thanh dưới che ô lựa chọn dạng tổng

- Vị trí: `$.exercises[43].options` (`luy-thua.ex.chon-tong-3-062`)
- Nguồn: —
- Vấn đề: lưới lựa chọn trong khung trả lời hẹp làm tổng dài xuống nhiều dòng và ô cuối bị thanh dưới che (trên điện thoại một cột thì hiển thị tốt, `phone/119-s5-09-exercise-chon-tong-3-062.png`). Ảnh: `ipad-landscape/119-s5-09-exercise-chon-tong-3-062.png`.
- Sửa: báo người làm app để lựa chọn dạng công thức dài dùng một cột. Không chặn bài.

### 3. Backlog của bài còn ghi một việc đã làm xong

- Vị trí: `backlogs/lesson-luy-thua.md`, mục về `luy-thua.ex.cham-so-mu`
- Nguồn: —
- Vấn đề: `cham-so-mu` đã dùng hình riêng `luy-thua.visual.cham-luy-thua-3-mu-5` (3⁵), khác hình 6⁴ của `cham-co-so`, nhưng backlog vẫn liệt kê là việc còn lại.
- Sửa: xoá mục đó khỏi backlog.
