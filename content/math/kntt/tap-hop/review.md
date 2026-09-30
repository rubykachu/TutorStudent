# Review: Tập hợp (`tap-hop`)

- Bài: `content/math/kntt/tap-hop/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff`), section: không section nào đổi chữ; phần đổi là `overview.narration` (audio, vtt) và hai video `tap-hop.video.tap-hop-la-gi`, `tap-hop.video.thuoc-khong-thuoc` kèm clip cho card `tap-hop`, `phan-tu`, `thuoc`, `khong-thuoc` (đối chiếu với section tap-hop-la-gi, ngoac-nhon, thuoc, khong-thuoc, xet-thuoc)
- Nguồn đã đọc: `sources/math/tap-hop/` - không mở lại; lời video chỉ nói lại định nghĩa, cách viết và cách đọc đã có trong note, recap của bài (trang p5 đã đối chiếu ở vòng trước)
- `content:check`: 1 lỗi (`review-hash`, hết sau lệnh cuối vòng), 1 cảnh báo (2 id video chưa có trong `ids.lock.json`)
- `lesson:walk`: không chạy - diff không thêm khối nào lên màn (chưa có khối `video` trong section); khung hình video soát bằng ffmpeg (0,7–58 s của cả hai video)
- Kết luận: Đã xuất bản
- Bản đã review: `9cb337aa834caaa053559224381849f924ac2e407846bc45a1b76c5ead4226ba` (`pnpm content:diff` so với bản này)

Đã soát:
- `overview.vtt` (39,5 s) đọc đúng nguyên văn `overview.hook.text`, `summary`, bốn `goals`, `whyItMatters`.
- `tap-hop-la-gi`: lời đọc (`.vtt`) khớp `script.json` từng câu; định nghĩa tập hợp, phần tử khớp note và recap section tap-hop-la-gi; câu "đặt các phần tử vào giữa hai ngoặc nhọn" khớp note ngoac-nhon; ba nét của dấu {, dấu } là hình soi gương khớp caption `ve-mo-ngoac`, `ve-dong-ngoac`; hình dùng đúng nét của `src/visuals/math/tap-hop/glyphs`.
- `thuoc-khong-thuoc`: "2 thuộc A" nghĩa là "2 là một phần tử của tập hợp A", "5 không phải là phần tử của tập hợp A" khớp note thuoc, khong-thuoc; cách vẽ ∉ (viết ∈ rồi thêm nét gạch chéo) khớp caption `ve-khong-thuoc`; câu nhớ "Có trong tập hợp thì thuộc…" khớp recap xet-thuoc.
- Clip: `tap-hop` (0,7–14,0 s) giảng tập hợp, có đội bóng như recap card; `phan-tu` (14,4–22,8 s) giảng phần tử; `thuoc` (10,3–27,8 s) giảng 2 ∈ A và cách vẽ ∈; `khong-thuoc` (28,2–46,2 s) giảng 5 ∉ A và cách vẽ ∉. Cả bốn đúng card.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Hai video chưa được gắn vào section nào

- Vị trí: `$.sections[0].blocks` (`tap-hop.section.tap-hop-la-gi`), `$.sections[4].blocks` (`tap-hop.section.thuoc`)
- Nguồn: —
- Vấn đề: `videos` có hai video nhưng không section nào có khối `{ "type": "video" }`, nên trẻ không xem được cả video trong bài; chỉ thấy các clip ở màn nhắc lại của thẻ ôn.
- Sửa: thêm `{ "type": "video", "videoId": "tap-hop.video.tap-hop-la-gi" }` làm khối đầu của section tap-hop-la-gi và `{ "type": "video", "videoId": "tap-hop.video.thuoc-khong-thuoc" }` làm khối đầu của section thuoc, rồi `pnpm content:lock`, `pnpm lesson:walk tap-hop` và review phần đổi.

### 2. Kịch bản `thuoc-khong-thuoc` lệch với video đã dựng

- Vị trí: `video/projects/tap-hop/thuoc-khong-thuoc/script.json`, cảnh `s03-ve-thuoc` ("Viết chậm để tay nhớ.") và `s05-ve-khong` ("Viết chậm từng nét nhé.")
- Nguồn: —
- Vấn đề: hai câu này có trong kịch bản nhưng không có trong `public/media/video/tap-hop/thuoc-khong-thuoc.mp4` và `.vtt` (lời đọc nhảy từ "Ta đọc là: 2 thuộc A." ở 27,6 s sang "Còn số 5 thì sao?" ở 28,5 s; báo cáo lần dựng cũng không có hai câu). Video đang phát không sai kiến thức, nhưng kịch bản không còn là nguồn của video: lần dựng sau sẽ đổi thời lượng và mốc clip mà không ai review.
- Sửa: chạy lại `pnpm video:build tap-hop thuoc-khong-thuoc` (mốc clip `thuoc`, `khong-thuoc` sẽ đổi), hoặc xoá hai câu khỏi `script.json` cho khớp video hiện có.

### 3. Màn nhớ cuối video `thuoc-khong-thuoc` ghi "2 ∈ A thuộc"

- Vị trí: `video/projects/tap-hop/thuoc-khong-thuoc/index.html`, `#sum-t`, `#sum-k` (cảnh `s06-nho`, khoảng 48–56 s)
- Nguồn: —
- Vấn đề: chữ "thuộc", "không thuộc" nằm liền sau "2 ∈ A", "5 ∉ A" trên cùng dòng, cùng cỡ, không có dấu ngăn, nên màn đọc thành "2 ∈ A thuộc", "5 ∉ A không thuộc", lệch cách đọc "2 thuộc A" vừa dạy và lệch dạng recap của bài ("x ∈ A: x là phần tử của A"). Lời đọc và chip "đọc: 2 thuộc A" trước đó đúng nên trẻ khó nhớ sai hẳn, vì vậy ghi Nên sửa.
- Sửa: đổi thành "2 ∈ A: 2 thuộc A" và "5 ∉ A: 5 không thuộc A" (hoặc tách nhãn thành chip riêng dưới dòng), rồi dựng lại video.

## Góp ý

### 1. "chữ C quay sang phải" dễ hiểu là xoay chữ C

- Vị trí: `video/projects/tap-hop/thuoc-khong-thuoc/script.json`, cảnh `s03-ve-thuoc`, câu "Nét một: chữ C quay sang phải."
- Nguồn: —
- Vấn đề: hình vẽ đúng chữ C bình thường, nhưng "quay sang phải" có thể hiểu là xoay chữ C; caption `ve-thuoc` của bài chỉ nói "nét một là chữ C".
- Sửa: "Nét một: viết chữ C." hoặc "Nét một: chữ C, mở về bên phải."

### 2. Phụ đề ngắt dòng giữa một từ

- Vị trí: `public/media/video/tap-hop/thuoc-khong-thuoc.vtt` cue 7–8 ("phần / tử"), cue 24–25 ("tập / hợp"); `tap-hop-la-gi.vtt` cue 29–30 ("của / bạn")
- Nguồn: —
- Vấn đề: người học chậm đọc phụ đề từng dòng, từ bị tách hai dòng khó đọc hơn.
- Sửa: báo người làm công cụ: bộ chia cue của `video:build` tránh ngắt giữa hai tiếng của một từ ghép, hoặc ưu tiên ngắt trước "của", "là".

### 3. Chấm số 2 của nét gạch chéo ∉ bị cắt ở mép trên

- Vị trí: `video/projects/tap-hop/figures.tsx` (`Mark`, viewBox cao `GLYPH_HEIGHT`), video `thuoc-khong-thuoc` khoảng 39,8–40,2 s
- Nguồn: —
- Vấn đề: chấm số của nét thứ hai nằm sát đỉnh viewBox nên chỉ hiện một phần trong lúc vẽ.
- Sửa: nới viewBox thêm khoảng 16 đơn vị ở trên và dưới.
