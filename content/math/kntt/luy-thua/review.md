# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Nguồn đã đọc: `sources/math/luy-thua/` - p22, p23-24
- `content:check`: 1 lỗi, 0 cảnh báo của bài (`$.reviewedHash: Lesson changed after its review`: cổng review, không tính là phát hiện)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/luy-thua/` (chạy với `WALK_BASE_URL=http://192.168.0.27:3001` sau `CONTENT_INCLUDE_FIXTURE=1 pnpm content:emit`). Visual recap của 12 card xem thêm qua `/dev/visuals/<visualId>` trên phone.
- Kết luận: Đạt: 0 lỗi Nghiêm trọng (2 mục Nên sửa, 2 mục Góp ý); tác giả đã thêm card `so-mu-0` và `nhan-so-mu-1` vào `cardIds` của `ghep-thuong` (Nên sửa 1, phần card) và card `nhan-so-mu-1` vào `cardIds` của `chon-phep-dung` (cùng dạng lỗi), rồi chạy `content:hash luy-thua --approve` (reviewedHash ghi, status published). Các mục còn lại ghi trong `backlogs/lesson-luy-thua.md`.

Đã tự giải toàn bộ 45 exercise trước khi đọc `answer`: mỗi câu có đúng một đáp án (đúng một tập đáp án với `chon-phep-dung`); đáp án nhiễu phản ánh lỗi hay gặp (nhân cơ số với số mũ, đảo cơ số và số mũ, nhân số mũ thay vì cộng, nhân hoặc chia cơ số, chia số mũ, bỏ qua hàng có chữ số 0). Định nghĩa, cách đọc, quy tắc nhân, chia, quy ước a⁰ = 1 và a¹ = a khớp tr.22–24; câu quy tắc ở màn quy tắc, recap phần và recap card trùng từng chữ cho mọi quy tắc; recap card chia đã có điều kiện m ≥ n ở cả `caption` lẫn visual. Hình gợi ý nấc 2 (`tinh-*-goi-y`, `so-mu-0-goi-y`, `so-mu-an-*`, `phan-tich*`, `tong-hang-5-247`, `so-mu-1`, `nhan-hai-luy-thua`, `chia-hai-luy-thua`) đều dừng ở "?" hoặc dùng số khác đề. Hình chạm (`cham-luy-thua`, `cham-luy-thua-3-mu-5`) vẽ cơ số và số mũ cùng màu chữ, không lộ đáp án. Mỗi card có ít nhất một câu ôn ngoài `practiceIds`. Các mục đã ghi trong `backlogs/lesson-luy-thua.md` (`chon-phep-dung`, `xep-gia-tri`, câu số mũ ẩn, hàng đơn vị, trật tự câu `dien-quy-tac`, nấc 1 tô cả câu, cỡ ký tự mũ Unicode) không ghi lại.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. `ghep-thuong` kiểm ba quy tắc nhưng chỉ gắn card và hình gợi ý của quy tắc chia

- Vị trí: `$.exercises[31].cardIds`, `$.exercises[31].hints.hintVisualId` (`luy-thua.ex.ghep-thuong`)
- Nguồn: tr.24, `p23-24.png` (quy tắc chia, quy ước a⁰ = 1); tr.23 (a¹ = a)
- Vấn đề: cặp 2⁶ : 2⁶ = 1 cần quy ước số mũ 0, cặp 2⁶ : 2 = 2⁵ cần quy tắc số không ghi số mũ có số mũ 1. Câu chỉ gắn `luy-thua.card.chia-cung-co-so`, nên trẻ nối sai hai cặp này ở lượt ôn sẽ thấy recap card chia (không có a⁰ = 1, không có số mũ 1), và hình gợi ý `chia-hai-luy-thua` (2⁵ : 2³) không chạm hai chỗ đó. Recap trẻ được nhắc không khớp quy tắc trẻ vừa làm sai. Cùng dạng với mục `chon-phep-dung` trong backlog.
- Sửa: thêm `luy-thua.card.so-mu-0` và `luy-thua.card.nhan-so-mu-1` vào `cardIds`; hoặc đổi hai cặp đó thành phép chia thường (vd 2⁶ : 2³ = 2³, 2⁵ : 2³ = 2², đổi cột phải cho khớp) để câu chỉ kiểm quy tắc chia, rồi để quy ước số mũ 0 cho `mu-0-bang`, `thuong-2-mu-0`.

### 2. `chia-luy-thua-10` bắt tính nhẩm 3 phép

- Vị trí: `$.exercises[32]` (`luy-thua.ex.chia-luy-thua-10`), câu luyện tập của `$.sections[3]`
- Nguồn: tr.24, `p23-24.png` (HĐ3c viết thương 10⁷ : 10⁴ dưới dạng luỹ thừa của 10)
- Vấn đề: trẻ phải trừ số mũ (8 − 5 = 3) rồi tính 10³ bằng hai phép nhân (10 · 10 = 100, 100 · 10 = 1 000): 3 phép, quá ngưỡng 2 phép cho người học chậm. Quy tắc đếm chữ số 0 của luỹ thừa của 10 chỉ được dạy ở phần sau (`luy-thua-cua-10`), nên ở chỗ này trẻ chưa có đường tắt. Câu cũng không có hình gợi ý nấc 2 cho bước tính giá trị.
- Sửa: đổi đề thành "Viết kết quả dưới dạng luỹ thừa của 10." với đáp án `{ kind: "power", base: 10, exponent: 3 }` (sát HĐ3c); hoặc giữ đề tính số nhưng chuyển câu sang phần `luy-thua-cua-10` (sau quy tắc đếm chữ số 0).

## Góp ý

### 1. `tach-5-247` ngắt dòng giữa "2 ·" và ô trống trên phone

- Vị trí: `$.exercises[42].segments` (`luy-thua.ex.tach-5-247`)
- Nguồn: —
- Vấn đề: ảnh `phone/118-s5-08-exercise-tach-5-247.png`: dòng đầu kết thúc ở "+ 2 ·", ô trống thứ hai xuống dòng. Trẻ vẫn làm được, nhưng số hạng "2 · 10²" bị tách làm hai dòng. Lỗi bố cục của khung `fillBlank` (không giữ chữ đứng trước ô trống cùng dòng với ô), không do nội dung bài.
- Sửa: báo người làm app để khung giữ đoạn chữ ngay trước ô trống dính với ô; không cần sửa bài.

### 2. Hạt bị gạch trong hình chia và số mũ 0 khó đọc số bên trong

- Vị trí: visual `luy-thua.visual.quy-tac-so-mu-0` (`$.sections[3].blocks[2].children[1]`), `luy-thua.visual.chia-hai-luy-thua` (`$.sections[3].blocks[0]`)
- Nguồn: —
- Vấn đề: ảnh `phone/090-s4-03-block-end.png`: số 2 trong hạt xanh nhạt bị nét gạch đè gần hết. Công thức ngay dưới vẫn ghi rõ 2³ : 2³, nên không chặn hiểu bài.
- Sửa: giữ số 2 đọc được sau khi gạch (nét gạch mảnh hơn hoặc chéo lệch khỏi số), trong `src/visuals/shared/bead-group`.
