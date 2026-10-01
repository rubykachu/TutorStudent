# Review: Tập hợp (`tap-hop`)

- Bài: `content/math/kntt/tap-hop/lesson.json`
- Vòng: 10 - chỉ phần đổi (`pnpm content:diff tap-hop`): thêm `explain` cho cả 58 câu chấm được
- Nguồn đã đọc: `sources/math/tap-hop/` - không có trên máy này; phần đổi chỉ là chữ diễn đạt, đối chiếu với note, recap, glossary và mã visual
- `content:check`: 0 lỗi của bài, 8 cảnh báo `[guides]` có từ trước (match, manipulate, order)
- `lesson:walk`: 0 FAIL sau khi thêm `explain`
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 3 Góp ý (giữ từ vòng 8); 4 gợi ý về lời `explain` đã áp dụng
- Bản đã review: `2e9312f00cdf152de6a0c33f8469e631402cdc05110118dd6639bad5b1f273cf` (`pnpm content:diff` so với bản này)

Đã soát đạt (4 mục trong diff, 2 section):
- `kt-dau-giua`: "số áo ba, tám và mười" bỏ được chuỗi "3, 8 và 10" dễ lẫn với dấu phẩy `phay` trong ô chọn; đề vẫn một cách hiểu (dấu viết giữa hai số). Visual `cham-dau-giua` chỉ vẽ các thẻ dấu, không in số nên không lệch chữ; đáp án `cham-phay` và nấc 1 (`block`) không đổi, không lộ đáp án. Số áo viết bằng chữ không làm trái luật định dạng số của `content:check`.
- Định nghĩa dấu hiệu đặc trưng "phần tử nào cũng có, còn những thứ khác thì không có" giống nhau từng chữ ở note, recap section và recap card `dau-hieu`; cách nói này đúng cả với tập không phải số. Note này không đặt `rule: true` nên không buộc recap nhắc nguyên văn, nhưng ba chỗ vẫn khớp. Hai vế "phần tử nào cũng có" và "thứ khác thì không có" không phủ định kép.
- "Nó được viết sau vạch đứng |" ở recap section và recap card khớp note ("phần sau vạch đứng | là dấu hiệu đó"); visual `dau-hieu-vi-du`, `doc-dau-hieu`, `the-dau-hieu` (`set-property.tsx`) chỉ dùng "dấu hiệu đặc trưng", "vạch đứng", không còn chữ "số khác" nào lệch. Kịch bản video không chứa câu định nghĩa cũ.
- Các mục còn lại của hai section không bị bản sửa làm hỏng: `kt-cham-dau-hieu` (chạm `dau-hieu`, đề nói "số áo" của tập A, không dùng chữ đã đổi), `liet-ke-tu-dau-hieu` (đáp án a duy nhất, nhiễu loại bỏ 0 hay thêm 4), `chon-viet-dung` (đáp án a duy nhất), note và visual `dau-cham-phay`. `content:check` không báo `[length]`, `[recap]`, `[rule-sentence]`, `[vietnamese]` cho bài.

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
