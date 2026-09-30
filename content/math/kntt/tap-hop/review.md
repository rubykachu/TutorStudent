# Review: Tập hợp (`tap-hop`)

- Bài: `content/math/kntt/tap-hop/lesson.json`
- Vòng: 7 - chỉ phần đổi (`pnpm content:diff`), section: `tap-hop.section.thuoc`; phần đổi là video `tap-hop.video.thuoc-khong-thuoc` (`durationSec` 56,5 thành 60,4; mốc clip `thuoc` kết thúc 29,673, `khong-thuoc` 30,073–50,042)
- Nguồn đã đọc: `sources/math/tap-hop/` - không mở lại; lời video chỉ nói lại định nghĩa, cách viết và cách đọc đã có trong note, recap, caption của section thuoc (trang p5 đã đối chiếu ở vòng trước)
- `content:check`: 1 lỗi (`review-hash`, hết sau lệnh cuối vòng), 0 cảnh báo
- `lesson:walk`: không chạy lại trong vòng này (đã chạy, 0 lỗi); khung hình video soát bằng ffmpeg ở 26,8; 28; 41,9-42,3; 47; 49,5; 54; 58 s và ảnh poster
- Kết luận: Đã xuất bản
- Bản đã review: `e7d329fc866d1e84fa98ea2390588afd75b8080b360e8aab43e7abaf29cf6c1d` (`pnpm content:diff` so với bản này)

Đã soát:
- `thuoc-khong-thuoc.vtt` (58,9 s, 28 cue do 4 câu dài bị chia đôi) đủ 24 câu của `script.json` theo thứ tự, gồm "Viết chậm để tay nhớ." (cue 13) và "Viết chậm từng nét nhé." (cue 23); mọi chữ đúng nguyên văn.
- Lời nêu quy tắc khớp note thuoc, khong-thuoc và recap card: "2 là một phần tử của tập hợp A", "5 không phải là phần tử của tập hợp A", "Có trong tập hợp thì thuộc", "Không có trong tập hợp thì không thuộc".
- Màn cuối (cảnh `s06-nho`, 54 s và 58 s; ảnh poster) hiện "2 ∈ A" kèm chip "đọc: 2 thuộc A" và "5 ∉ A" kèm chip "đọc: 5 không thuộc A", khớp lời đọc "Ta đọc là: 2 thuộc A", "5 không thuộc A" và dạng recap `x ∈ A`, `x ∉ A`. Lỗi "2 ∈ A thuộc" của vòng trước đã hết.
- Màn ở 26,8 s (2 ∈ A, chip "đọc: 2 thuộc A") và 47 s (5 ∉ A, chip "đọc: 5 không thuộc A", số 5 đứng ngoài khung A) khớp lời ở cùng thời điểm.
- Clip: `thuoc` (10,271–29,673 s) phủ cue 5–13, từ "Số 2 nằm trong tập hợp A." đến "Viết chậm để tay nhớ.", đúng card `tap-hop.card.thuoc`; `khong-thuoc` (30,073–50,042 s) phủ cue 14–23, từ "Còn số 5 thì sao?" đến "Viết chậm từng nét nhé.", đúng card `tap-hop.card.khong-thuoc`. Mỗi clip không chứa lời của clip kia; đầu clip cách cue trước 0,2 s trở lên.
- Video đã nằm trong section thuoc (khối `video` đầu section) và bản lock id đã đủ: hai mục Nên sửa về video chưa gắn, kịch bản lệch video của vòng trước đã hết.
- Các mục khác cùng section thuoc không đổi chữ; recap còn khớp note.

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
