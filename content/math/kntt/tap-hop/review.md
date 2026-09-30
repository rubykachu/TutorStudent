# Review: Tập hợp (`tap-hop`)

- Bài: `content/math/kntt/tap-hop/lesson.json`
- Vòng: 8 - chỉ phần đổi (`pnpm content:diff tap-hop --root content`), phần đổi: `guide: tapRegion` và `guide: fillBlankBank` trên hai màn của `tap-hop.section.thao-tac`; `rule: true` trên note của `tap-hop.section.liet-ke`
- Nguồn đã đọc: `sources/math/tap-hop/` - không mở lại; chữ hiển thị không đổi
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 7 cảnh báo `[guides]` (match, manipulate, order)
- `lesson:walk`: không chạy (vòng này chỉ thêm dấu máy đọc `guide`, `rule`, không hiện trên màn)
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 3 Góp ý (giữ từ vòng trước)
- Bản đã review: `627d83e715099514d5245ae924ac46f9de4df45d86e8c5853bd53daec11d0f75` (`pnpm content:diff` so với bản này)

Đã soát đạt:
- `guide: tapRegion` (blocks[0]): note "Bài tập chạm vùng... chạm lần nữa để bỏ chọn, bấm Kiểm tra" và visual `huong-dan-cham` dạy đúng thao tác chạm vùng. `guide: fillBlankBank` (blocks[1]): note "chạm một thẻ ở dưới, rồi chạm ô trống" và visual `huong-dan-chip` dạy điền từ ngân hàng thẻ.
- `rule: true` trên note của `liet-ke`: câu "Liệt kê là viết hết các phần tử trong hai ngoặc nhọn, giữa hai phần tử có dấu chấm phẩy. Mỗi phần tử chỉ viết một lần." trùng từng chữ với recap section và recap card `liet-ke`.
- Cảnh báo `[guides]` về match, manipulate, order là khoảng trống có từ trước, không thuộc diff này.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. "chữ C quay sang phải" dễ hiểu là xoay chữ C

- Vị trí: `video/projects/tap-hop/thuoc-khong-thuoc/script.json`, cảnh `s03-ve-thuoc`, câu "Nét một: chữ C quay sang phải."
- Nguồn: —
- Vấn đề: hình vẽ đúng chữ C bình thường, nhưng "quay sang phải" có thể hiểu là xoay chữ C; caption `ve-thuoc` của bài chỉ nói "nét một là chữ C".
- Sửa: "Nét một: viết chữ C." hoặc "Nét một: chữ C, mở về bên phải."

### 2. Phụ đề ngắt dòng giữa một từ

- Vị trí: `public/media/video/tap-hop/thuoc-khong-thuoc.vtt` cue 7–8 ("phần / tử"), cue 26–27 ("tập / hợp")
- Nguồn: —
- Vấn đề: người học chậm đọc phụ đề từng dòng, từ bị tách hai dòng khó đọc hơn.
- Sửa: báo người làm công cụ: bộ chia cue của `video:build` tránh ngắt giữa hai tiếng của một từ ghép, hoặc ưu tiên ngắt trước "của", "là".

### 3. Chấm số 2 của nét gạch chéo ∉ bị cắt ở mép trên

- Vị trí: `video/projects/tap-hop/figures.tsx` (`Mark`, viewBox cao `GLYPH_HEIGHT`), video `thuoc-khong-thuoc` khoảng 41,9–42,2 s
- Nguồn: —
- Vấn đề: chấm số của nét thứ hai nằm sát đỉnh viewBox nên chỉ hiện một phần trong lúc vẽ (vẫn còn ở bản dựng lại; chỉ thấy khoảng 0,3 s).
- Sửa: nới viewBox thêm khoảng 16 đơn vị ở trên và dưới.
