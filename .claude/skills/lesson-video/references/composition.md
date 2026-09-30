# Dựng hình

`index.html` là một trang HyperFrames 1280×720: GSAP chạy trên một timeline dừng, trình render tua từng khung, nên mọi mốc thời gian lấy từ `window.TIMING` (không `Date`, không CSS animation, không `Math.random`; cần ngẫu nhiên thì dùng số giả ngẫu nhiên có seed).

## Có sẵn

- `video/composition/base.css`: màu từ token của app (`tokens.css` sinh từ `src/app/globals.css`), Baloo 2 cho số và tiêu đề, Be Vietnam Pro cho chữ; lớp `.pow` (cơ số xanh, số mũ tím), `.bead`, `.pill` (nền vàng cho kết quả), `.tag.base` (● xanh), `.tag.exp` (▲ tím), `.board`, `.tray`, `.grain`, `.brace`.
- `video/composition/runtime.js` (`window.LV`): `W(cảnh, chữ, lần)` mốc bắt đầu một chữ được đọc (chữ thường, giữ dấu thanh, bỏ dấu câu), `WE` mốc kết thúc, `start`/`end` của cảnh; `pow`, `op`, `beads`, `owl` (cú vẽ đúng như app, các tư thế `idle`, `happy`, `cheer`); `pop`, `rise`, `fade`, `hide`, `cross` (gạch hạt), `light` (tô ô bàn cờ), `pose` (đổi tư thế cú), `scenes` (hiện/ẩn cảnh), `finish`.
- Mẫu đầy đủ: `video/projects/luy-thua/*/index.html`.

## Luật

- Dải dưới cùng (từ y ≈ 540 trở xuống) để trống: app vẽ phụ đề ở đó. Cú đứng bên trái, trên dải này.
- Hình trước chữ: số, hạt, bàn cờ; chữ trên màn chỉ là nhãn ngắn ("cơ số", "3 thừa số").
- Mỗi thứ hiện đúng lúc chữ tương ứng được đọc: `pop("#x", W("s03-noi", "nối"))`, không "0.8 giây sau đầu cảnh".
- Màu mang nghĩa như trong bài và luôn kèm ký hiệu hình (● cơ số, ▲ số mũ).
- `tl.set` với `className` không chạy (GSAP 3); đổi màu bằng thuộc tính cụ thể và `color("<token>")`.
- `fromTo` trên phần tử dùng lại nhiều lần cần `immediateRender: false`.
- Không chạy `pnpm video:build` khác trong lúc một bản đang render cùng thư mục.
