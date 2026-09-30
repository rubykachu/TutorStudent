# Dựng hình

`index.html` là một trang HyperFrames 1280×720: GSAP chạy trên một timeline dừng, trình render tua từng khung, nên mọi mốc thời gian lấy từ `window.TIMING` (không `Date`, không CSS animation, không `Math.random`; cần ngẫu nhiên thì dùng số giả ngẫu nhiên có seed).

## Có sẵn

- `video/composition/base.css`: màu từ token của app (`tokens.css` sinh từ `src/app/globals.css`), Baloo 2 cho số và tiêu đề, Be Vietnam Pro cho chữ; lớp `.pow` (cơ số xanh, số mũ tím), `.bead`, `.pill` (nền vàng cho kết quả), `.tag.base` (● xanh), `.tag.exp` (▲ tím), `.board`, `.tray`, `.grain`, `.brace`; bài đọc: `.line` (một dòng văn bản trên thẻ, `.dash` gạch ngang xanh, `.mark` phần được tô), `.chip` (nhãn viền, màu khái niệm qua `--c`).
- `video/composition/runtime.js` (`window.LV`): `W(cảnh, chữ, lần)` mốc bắt đầu một chữ được đọc (chữ thường, giữ dấu thanh, bỏ dấu câu), `WE` mốc kết thúc, `start`/`end` của cảnh; `pow`, `op`, `beads`, `owl` (cú vẽ đúng như app, các tư thế `idle`, `happy`, `cheer`); `figure(cha, [tên…], style)` hình của bài (mỗi tên một lớp, `pose` đổi lớp); `pop`, `rise`, `fade`, `hide`, `cross` (gạch hạt), `light` (tô ô bàn cờ), `tint` (tô nền một chữ hay dòng), `pose` (đổi tư thế cú hay hình), `scenes` (hiện/ẩn cảnh), `finish`.
- Hình dùng chung với visual của bài (nhân vật…): `video/projects/<id bài>/figures.tsx` export default một map tên → phần tử React, import từ `src/visuals/<môn>/<bài>/`; build vẽ sẵn thành `window.FIGURES` (`figures.js`), nên video vẽ đúng như app. Mẫu: `video/projects/neu-cau-muon-co-mot-nguoi-ban/`.
- Mẫu đầy đủ: `video/projects/luy-thua/*/index.html` (Toán), `video/projects/neu-cau-muon-co-mot-nguoi-ban/*/index.html` (Ngữ văn).

## Luật

- Dải dưới cùng (từ y ≈ 540 trở xuống) để trống: app vẽ phụ đề ở đó. Cú đứng bên trái, trên dải này.
- Hình trước chữ: số, hạt, bàn cờ; chữ trên màn chỉ là nhãn ngắn ("cơ số", "3 thừa số").
- Mỗi thứ hiện đúng lúc chữ tương ứng được đọc: `pop("#x", W("s03-noi", "nối"))`, không "0.8 giây sau đầu cảnh".
- Cảnh không để màn trống chờ chữ nằm cuối câu dài: hình nền của cảnh (nhân vật, tiêu đề) hiện từ `start(sid)`, chi tiết hiện theo chữ.
- Màu mang nghĩa như trong bài và luôn kèm ký hiệu hình (● cơ số, ▲ số mũ).
- `tl.set` với `className` không chạy (GSAP 3); đổi màu bằng thuộc tính cụ thể và `color("<token>")`.
- `fromTo` trên phần tử dùng lại nhiều lần cần `immediateRender: false`.
- Không chạy `pnpm video:build` khác trong lúc một bản đang render cùng thư mục.
