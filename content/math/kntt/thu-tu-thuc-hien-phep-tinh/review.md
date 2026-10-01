# Review: Thứ tự thực hiện các phép tính (`thu-tu-thuc-hien-phep-tinh`)

- Bài: `content/math/kntt/thu-tu-thuc-hien-phep-tinh/lesson.json`
- Vòng: 7 - chỉ phần đổi (`pnpm content:diff thu-tu-thuc-hien-phep-tinh --root content`), section: cong-tru, nhan-chia, hon-hop, ngoac-tron, ngoac-long, luy-thua (6 caption "Chạm …" bỏ cụm "để tính ra nó"; caption `ngoac-long-tung-buoc` thêm tổng 32 nghìn đồng; `ex.chon-nhieu-luy-thua-truoc` lựa chọn e) và hình `tong-hop-dong-viet-lai`, `tim-x-1-goi-y`, `tim-x-2-goi-y` trong `src/visuals/math/thu-tu-thuc-hien-phep-tinh/catalog.ts`
- Nguồn đã đọc: `sources/math/thu-tu-thuc-hien-phep-tinh/` - không có trên máy này; chỉ đổi chữ phụ và số trong hình, không đổi kiến thức nguồn. Soát bằng ảnh `.shots/thu-tu-thuc-hien-phep-tinh/` của worktree sửa (hình `tong-hop-dong-viet-lai` iPad và điện thoại, `tim-x-1-goi-y`, `tim-x-2-goi-y`, `ngoac-long-tung-buoc` bước 4)
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 0 cảnh báo `[length]` hay `[hint-answer]` của bài
- `lesson:walk`: không chạy (dùng ảnh chụp từng hình đã có)
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 1 Nên sửa và 2 Góp ý (Nên sửa 1 và Góp ý 1 giữ từ vòng trước, còn mở)
- Bản đã review: `5fe3a20b4d2ca8b18786c00b8c35a2ecc8318f8d05ccc75c820c53935da28d74` (`pnpm content:diff` so với bản này)

Đã soát đạt:
- 6 caption "Chạm …" (`cong-tru`, `nhan-chia`, `hon-hop`, `ngoac-tron`, `ngoac-long` blocks[4], `luy-thua`): câu mới ngắn hơn, vẫn nói đúng quy tắc của note và recap cùng section ("làm từ trái sang phải", "trong ngoặc làm trước", "luỹ thừa làm trước nhân và chia"). `cong-tru` và `nhan-chia` đổi sang "để làm trước", khớp từ "phép tính làm trước" của bài. Không còn "để tính ra nó" trong `lesson.json`, `catalog.ts`, kịch bản video.
- Caption `ngoac-long-tung-buoc`: 2 · (5 + 3 · 2) = 2 · 11 = 22, 22 + 10 = 32 nghìn đồng, đúng với hình {10 + 2 · [5 + (3 · 2)]} (ảnh bước 4 ghi 5 + 6 = 11, 2 · 11 = 22, 10 + 22 = 32). Đây là ví dụ mẫu chạy trọn nên nói tổng là đúng chỗ; không lặp lại số của câu luyện `tinh-ngoac-long-1`. Caption dài 3 câu, không có cảnh báo độ dài.
- `ex.chon-nhieu-luy-thua-truoc`: tự giải: (a) 4 + 3 · 2²: luỹ thừa 2² làm trước nhân; (c) 2³ − 6 : 3: 2³ làm trước chia; (b) 5 · 3 + 2, (d) 18 − 2 · 4: không có luỹ thừa; (e) 9 − 4 + 2: chỉ cộng trừ, làm từ trái sang phải. Đáp án a, c đúng, b, d, e sai. Lựa chọn (1 + 2) · 3² (cần biết ngoặc làm trước luỹ thừa) đã bỏ, hết kiến thức chưa dạy ở card `luy-thua`. `9 − 4 + 2` không trùng số với câu hay hình khác của bài.
- Hình `tong-hop-dong-viet-lai`: nhãn "Sai: làm 5 + 3 trước" khớp hình (5 + 3 = 8, 8 · 2 = 16), đọc rõ, một dòng trên iPad lẫn điện thoại, không chồng hay cắt.
- Hình `tim-x-1-goi-y`, `tim-x-2-goi-y` (dùng chung cho `ex.tim-x-1` và `ex.tim-x-2`): vế phải 2 · 2² + 12 : 3 = 8 + 4 = 12, 4x + 4 = 12 nên x = 2 (nghiệm tự nhiên). Ảnh bước 1 đến 3 làm 2² = 4, 2 · 4 = 8, 12 : 3 = 4 rồi dừng ở "= ?", không hiện 12 hay x. Nghiệm x = 2 khác nghiệm của `tim-x-1` (x = 3, vế phải 20) và `tim-x-2` (x = 4, vế phải 32); hệ số 4x + 4 khác 5x + 5 và 6x + 8; `tim-x-3` (x = 6) dùng hình khác. Không lộ đáp án (LL-02).
- Các mục khác cùng section: note và recap không đổi, vẫn khớp nhau; `ex.chon-nhieu-nhan-chia-truoc` (section `hon-hop`) có cấu trúc riêng, không bị ảnh hưởng.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Video `hoa-don`: mp4 vẫn khoanh hồng cách làm sai của Lan (bản sửa chỉ có trong `index.html`)

- Vị trí: `public/media/video/thu-tu-thuc-hien-phep-tinh/hoa-don.mp4` cảnh `s03-lan`, 24–31 s; `video/projects/thu-tu-thuc-hien-phep-tinh/hoa-don/index.html` dòng `tl.to("#m-ring", { borderColor: slate … })`
- Nguồn: —
- Vấn đề: Nên sửa 1 vòng 4. `index.html` đã đổi vòng quanh `8 + 5` sang xám, nhưng `hoa-don.mp4` (render 20:39, trước lần sửa) vẫn hiện vòng hồng ở khung 24, 27, 30 s; bản render trong `renders/site/index.html` còn `borderColor: pink`. Hồng trong bài nghĩa là "phép làm trước" (đúng), nên cách làm sai của Lan mang cùng màu với cách đúng của Nam.
- Sửa: Chạy lại `pnpm video:build thu-tu-thuc-hien-phep-tinh hoa-don` trong worktree, xem lại khung 24–31 s, cập nhật `videos[0]` nếu độ dài hay clip đổi.

## Góp ý

### 1. Whisper vẫn nghe câu thứ tự ngoặc thành "ngọt buông", "ngọt nhọn"

- Vị trí: `video/projects/thu-tu-thuc-hien-phep-tinh/ngoac-long/renders/report.json` (bản render mới), "Rồi làm ngoặc vuông." (match 0,842, 4 lần), "Cuối cùng làm ngoặc nhọn." (0,875, 4 lần); "Ngoặc vuông là hộp vừa." nghe thành "Ngọc Vương" (0,955)
- Nguồn: —
- Vấn đề: Góp ý 3 vòng 4, chưa có ghi nhận đã nghe lại. Đây là các câu nêu thứ tự ngoặc; nếu giọng thật sự méo, trẻ nghe sai tên ngoặc. Reviewer không nghe được âm thanh.
- Sửa: Tác giả nghe lại ba câu này; méo thì đọc lại (đổi seed hoặc tách câu).

### 2. `ex.chon-nhieu-luy-thua-truoc`: ba nhiễu đều không có luỹ thừa

- Vị trí: `$.exercises[?(@.id=="thu-tu-thuc-hien-phep-tinh.ex.chon-nhieu-luy-thua-truoc")].options` (b, d, e)
- Nguồn: —
- Vấn đề: Sau khi bỏ `(1 + 2) · 3²`, cả ba nhiễu là biểu thức không có số mũ, nên câu chỉ kiểm trẻ có nhận ra số mũ hay không, chưa có nhiễu "có luỹ thừa nhưng không làm đầu tiên". Vẫn đúng một tập đáp án (a, c) và không sai kiến thức; nhiễu có luỹ thừa mà luỹ thừa không làm đầu tiên cần ngoặc, mà bài chưa dạy ngoặc đi cùng luỹ thừa (LL-14, LL-09).
- Sửa: Không bắt buộc. Nếu sau này section dạy ngoặc đi cùng luỹ thừa thì thêm lại một nhiễu dạng đó.
