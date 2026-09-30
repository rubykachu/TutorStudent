# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Nguồn đã đọc: `sources/math/luy-thua/` - p22, p23-24
- `content:check`: 0 lỗi, 1 cảnh báo của bài (12 id chưa có trong `ids.lock.json`: cổng khoá id, không tính là phát hiện)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/luy-thua/` (emit có bài `draft`, chạy trên server cổng 3195)
- Kết luận: Đã xuất bản

Đã tự giải cả 53 exercise trước khi đọc `answer`: mỗi câu có đúng một đáp án (`chon-phep-dung` đúng tập {a, b}; `xep-gia-tri` là 2³ < 3² < 4² < 5²). Kiến thức nằm trong tr.22–24 (định nghĩa, cách đọc, a¹ = a, bình phương/lập phương, luỹ thừa của 10 theo khung bên tr.23, viết số thành tổng theo mẫu 4 257, nhân/chia cùng cơ số, quy ước a⁰ = 1), không vượt số mũ tự nhiên; câu chữ đã biên soạn lại. 11 section đều ≤ 4 màn giải thích và ≤ 4 bài tập; `minutes` khớp số màn × khoảng 40 giây (phần 1: 7 màn → 5 phút; phần 2: 8 → 5; phần 4: 7 → 5; phần 6: 6 → 4; phần 3, 5, 7, 11: 4 → 3; phần 8–10: 5 → 3). 12 card, mỗi card đúng một câu trong `practiceIds` và có câu ôn khác số với câu luyện tập. Recap của 11 section một câu, khớp ý section, ví dụ có nhãn. Không màn giải thích hay câu kiểm tra nào lộ đáp án câu luyện tập: màn phần 3 đã có chiều ngược 5 = 5¹ trước câu `viet-9-mu-1`; hình tương tác phần 10 dừng ở 10⁴ nên không hiện 10⁵ của `tinh-10-mu-5`; hình tương tác phần 4 chỉ tới cơ số 5 nên không hiện 8² hay 10³. Hình gợi ý nấc 2 dừng ở "?" hoặc dùng số khác đề. Phím "mũ" được dạy (`bam-mu`) trước câu đầu dùng phím.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu quy tắc luỹ thừa của 10 không nói số chữ số 0 đếm ở đâu

- Vị trí: `$.sections[9].blocks[0].children[0]`, `$.sections[9].recap.caption` (`luy-thua.section.luy-thua-cua-10`), `$.cards[10].recap.caption` (`luy-thua.card.luy-thua-10`)
- Nguồn: tr.23, `p23-24.png` (khung bên: 100 = 10², 1 000 = 10³, 10 000 = 10⁴)
- Vấn đề: câu "Với luỹ thừa của 10, số mũ bằng số chữ số 0 đứng sau chữ số 1." không nói chữ số 0 đó nằm trong giá trị (kết quả). Trong chính cách viết 10ⁿ, cơ số 10 cũng có một chữ số 0 đứng sau chữ số 1, nên trẻ đọc câu trần (ở màn ôn card, khi không còn nhìn kỹ ví dụ) dễ nhớ lệch thành "đếm số 0 trong 10". Ví dụ có nhãn 10³ = 1 000 và dòng "3 chữ số 0" gỡ được phần nào trên màn, nên chưa tới mức trẻ chắc chắn nhớ sai.
- Sửa: nói rõ số 0 nằm trong giá trị, vd "10ⁿ viết ra là chữ số 1 và n chữ số 0 theo sau." hoặc "Số mũ của 10 bằng số chữ số 0 trong giá trị của luỹ thừa." Sửa đồng thời ở `note` của màn quy tắc, recap section và recap card.
- Người soạn đã sửa sau vòng này: cả ba chỗ thành "10ⁿ viết ra là chữ số 1 và n chữ số 0 theo sau."

Mục này ảnh hưởng tới việc trẻ ghi nhớ quy tắc (câu quy tắc và recap của phần Luỹ thừa của 10).

## Góp ý

### 1. Đáp án ba câu kiểm tra có sẵn trên màn giải thích cùng section

- Vị trí: `$.exercises[8]` (`luy-thua.ex.viet-4-mu-3`) với `$.sections[1].blocks[0]` (hình `the-co-so-so-mu` in 4³ = 4 · 4 · 4, ảnh `018-s2-01-block.png`); `$.exercises[44]` (`luy-thua.ex.viet-1000`) với `$.sections[9].blocks[0]` (hình `quy-tac-luy-thua-10` in 10³ = 1 000, ảnh `106-s10-01-block.png`); `$.exercises[25]` (`luy-thua.ex.chon-2-mu-7`) với `$.sections[5].blocks[2]` (hình `ghep-luy-thua` cơ số 2, số mũ 1–5, ghép được 2³ · 2⁴)
- Nguồn: —
- Vấn đề: câu kiểm tra không tính điểm nên không chặn, nhưng trẻ chép lại hình vừa thấy thay vì tự làm, câu kiểm tra mất tác dụng kiểm tra hiểu.
- Sửa: đổi số của câu kiểm tra (vd cơ số 6 và số mũ 2; 10 000; 2² · 2⁵ nếu hạ số mũ tối đa của hình, hoặc dùng cơ số khác 2), hoặc đổi ví dụ trên màn.

### 2. Hình gợi ý nấc 2 của `tach-5-247` chỉ còn một bước tới đáp án

- Vị trí: `$.exercises[50].hints.hintVisualId` (`luy-thua.ex.tach-5-247`, visual `luy-thua.visual.tong-hang-5-247`)
- Nguồn: —
- Vấn đề: hình hiện "5 247 = 5 · 1 000 + 2 · 100 + 4 · 10 + 7" (ảnh `120-s11-03-exercise-tach-5-247-wrong2.png`); trẻ chỉ còn đổi 1 000 → 10³, 100 → 10². Không hiện đúng kết quả của đề nên đạt luật nấc 2, nhưng gợi ý gần như làm hộ.
- Sửa: để hình dừng ở bảng hàng (nghìn, trăm, chục, đơn vị) với "?" dưới mỗi chữ số, hoặc chấp nhận.
