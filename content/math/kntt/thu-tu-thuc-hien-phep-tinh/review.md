# Review: Thứ tự thực hiện các phép tính (`thu-tu-thuc-hien-phep-tinh`)

- Bài: `content/math/kntt/thu-tu-thuc-hien-phep-tinh/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff thu-tu-thuc-hien-phep-tinh --root content`), phần đổi: `guide: tapRegion` trên màn của `cong-tru`; `rule: true` trên note của 7 section (hoa-don, cong-tru, on-nhan-chia, nhan-hai-chu-so, nhan-chia, luy-thua, tim-so-chua-biet)
- Nguồn đã đọc: `sources/math/thu-tu-thuc-hien-phep-tinh/` - không mở lại; chữ hiển thị không đổi
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 2 cảnh báo `[guides]` (match, order)
- `lesson:walk`: không chạy (vòng này chỉ thêm dấu máy đọc `guide`, `rule`, không hiện trên màn)
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 1 Nên sửa và 1 Góp ý (giữ từ vòng trước)
- Bản đã review: `ce4bbe1688deb59393100e15ad4c051caa4003140b9b324b482c470ff25036cb` (`pnpm content:diff` so với bản này)

Đã soát đạt:
- `guide: tapRegion` (`cong-tru` blocks[2]): note "chạm vào phép tính bạn chọn, vòng đen hiện quanh nó... bấm Kiểm tra" và visual `huong-dan-cham-phep-tinh` dạy đúng thao tác chạm vùng.
- `rule: true` ở 7 note: câu quy tắc khớp từng chữ với recap section và recap card ở cong-tru, on-nhan-chia, nhan-hai-chu-so, nhan-chia, luy-thua. Ở `hoa-don` và `tim-so-chua-biet` note có thêm câu dẫn (hoá đơn 2 · 8 = 16 nghìn đúng; "Vế phải là phần bên phải dấu =") đứng trước; câu quy tắc cuối note ("Có cả nhân và cộng thì làm nhân trước, cộng sau."; "Tính vế phải trước, rồi làm ngược: cộng thì trừ, nhân thì chia.") được recap lặp đúng.
- Cảnh báo `[guides]` về match, order là khoảng trống có từ trước, không thuộc diff này.

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
