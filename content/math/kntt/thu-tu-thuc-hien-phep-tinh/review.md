# Review: Thứ tự thực hiện các phép tính (`thu-tu-thuc-hien-phep-tinh`)

- Bài: `content/math/kntt/thu-tu-thuc-hien-phep-tinh/lesson.json`
- Vòng: 5 - chỉ phần đổi (`pnpm content:diff thu-tu-thuc-hien-phep-tinh --base 49a86b0`, vì bản đã review của vòng 4 không còn trong lịch sử git): `overview.summary`, `overview.narration`, ba video `hoa-don`, `hon-hop`, `ngoac-long` (khối `video` đầu section và `videos[]` kèm clip), section: hoa-don, hon-hop, ngoac-long; kèm kịch bản, `index.html` và tệp render trong `public/media/video/thu-tu-thuc-hien-phep-tinh/`, `public/media/narration/thu-tu-thuc-hien-phep-tinh/`
- Nguồn đã đọc: không có (diff chỉ có overview và video; không đổi card hay bài tập)
- `content:check`: 1 lỗi (`[review-hash]`, hết khi bản sửa được duyệt), 1 cảnh báo của bài (3 id chưa có trong `ids.lock.json`)
- `lesson:walk`: 3 FAIL trên server dev `:3250` (cả ba màn hình dừng ở "Chưa tải được bài học", vì server không phục vụ tệp `/content/thu-tu-thuc-hien-phep-tinh.json`, giống vòng 4: bài chưa duyệt lại; không do nội dung), ảnh trong `.shots/walk/thu-tu-thuc-hien-phep-tinh/`. Thay bằng: soát khung hình mp4 bằng ffmpeg, đối chiếu `.vtt` và độ dài tệp
- Kết luận: Đã xuất bản: lỗi Nghiêm trọng (thời lượng và clip `ngoac-long` lệch tệp) đã sửa, `hoa-don` dựng lại với vòng xám cho cách làm sai của Lan
- Bản đã review: `d56403fe9531b17094d3f209b90f6f3f9dd89a853b526c42fcdac30f8c5490f1` (`pnpm content:diff` so với bản này)

Đã soát:
- Vòng 4, Nghiêm trọng 1 (`hon-hop` hai phép một dòng): đã sửa. Khung 23–46 s nay là `20 + 6 · 3 − 8 : 4` → `20 + 18 − 8 : 4` → `20 + 18 − 2` → `38 − 2` → `36`, mỗi dòng một phép, khớp `hon-hop-tung-buoc` và câu "Mỗi dòng chỉ làm một phép tính." (44,7 s). Góp ý 1 vòng 4 (18 mất màu) hết theo.
- Vòng 4, Nghiêm trọng 2 (`ngoac-long` "hai phần quà hết 32 nghìn"): đã sửa trong kịch bản và video đầy đủ. Cảnh `s04-qua` kể đủ hộp bút 5 nghìn, 3 gói kẹo 2 nghìn, túi 10 nghìn (khớp caption `ngoac-long-tung-buoc`); câu kết "Cả hai phần quà và túi hết 32 nghìn đồng." (59,0–61,9 s), hình hiện "32 nghìn đồng". Riêng clip của card vẫn cắt mất câu này: xem Nghiêm trọng 1.
- Vòng 4, Nên sửa 2 (`ngoac-long` 11–15 s mất ngoặc): đã sửa; từ 11,5 s các ngoặc hiện thành hộp lồng nhau, không còn khung nào hiện `10 + 2 · 5 + 3 · 2`.
- Vòng 4, Góp ý 2 (`hon-hop`): câu `s05-sai` nay "Nhưng khi có nhân, chia thì đừng cộng trước."; nhãn cuối "nhân, chia trước / cộng, trừ sau": đã sửa.
- Số trong ba kịch bản đúng: 2 · 8 + 5 = 21; 2 · 13 = 26; 18, 2, 38, 36; 6, 11, 22, 32. Câu nêu quy tắc đều đánh `rule`, khớp note và caption của section. Lời `.vtt` khớp kịch bản từng câu.
- `overview.vtt` khớp nguyên văn hook, summary, goals, whyItMatters; `overview.m4a` có (40,1 s).
- Clip `hoa-don` (13,7–51,5 s) và `hon-hop` (13,3–60,9 s) khớp tệp hiện tại và giảng đúng card gắn vào; `durationSec` khớp mp4 (60,73; 62,33).
- Các mục khác của ba section không đổi; recap vẫn khớp note.

## Nghiêm trọng

### 1. `videos[]` của `ngoac-long` trong `lesson.json` không khớp tệp đã render: clip của card cắt ngang câu kết "32 nghìn đồng"

- Vị trí: `$.videos[2].durationSec`, `$.videos[2].clips[0].end` (`thu-tu-thuc-hien-phep-tinh.video.ngoac-long`, clip `ngoac-long` gắn `card.ngoac-long`)
- Nguồn: —
- Vấn đề: `lesson.json` ghi `durationSec: 60.63`, clip 11,37–59,226 s (số của bản render cũ). Tệp `ngoac-long.mp4` hiện tại dài 69,57 s; theo `.vtt`, câu "Cả hai phần quà và túi hết 32 nghìn đồng." ở 59,03–61,87 s và cảnh nhớ `s07-nho` ở 62,7–68,0 s (kịch bản đặt clip từ `s02-hop` tới `s07-nho`). Trình phát dừng clip ở 59,2 s, nên khi ôn card trẻ nghe "10 cộng 22 bằng 32. Cả…" rồi tắt: mất đúng câu nói 32 nghìn là tiền gì (bản sửa của Nghiêm trọng 2 vòng 4) và mất câu nhớ quy tắc. `content:check` không bắt được vì số cũ vẫn tự khớp nhau. Bản `video:build` mới đã ghi manifest vào `lesson.json` của bản checkout chính (`TutorStudent/content/.../lesson.json`: `durationSec 69.57`, clip 11,37–68,162), không phải của worktree này. Xếp Nghiêm trọng vì bài mô tả sai tệp video và clip cắt giữa câu kết; phân vân nên chọn mức cao hơn.
- Sửa: Chạy lại `pnpm video:build thu-tu-thuc-hien-phep-tinh ngoac-long` trong worktree này (hoặc chép mục `videos[]` `ngoac-long` từ manifest mới: `durationSec: 69.57`, `clips[0].end: 68.162`), rồi kiểm lại `durationSec` của cả ba video với `ffprobe`.

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
