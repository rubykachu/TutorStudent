# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Nguồn đã đọc: `sources/math/luy-thua/` - p22, p23-24
- `content:check`: 1 lỗi (`[review-hash]`, do bài đổi sau lần duyệt trước), 0 cảnh báo của bài
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/luy-thua/` (chạy với `WALK_BASE_URL=http://localhost:3001`, vì server riêng của walk không mở được khi đã có `next dev` chạy từ cùng thư mục; server 3001 phục vụ bản `lesson.json` hiện tại)
- Kết luận: Đã xuất bản

Lần đổi này (so với bản đã duyệt trong git) chỉ thêm ba khối `video` ở đầu section `luy-thua-la-gi`, `nhan-cung-co-so`, `chia-cung-co-so` và mảng `videos[]`. Đã soát lại cả bài: đọc hai trang nguồn, tự giải lại mọi exercise (mỗi câu đúng một đáp án; `chon-phep-dung` đúng tập {a, b}), xem 130 ảnh walk trên iPad dọc và các màn video trên điện thoại, iPad ngang.

Video: đã đọc ba kịch bản `video/projects/luy-thua/<tên>/script.json`, đối chiếu `.vtt` và `renders/report.json` (Whisper nghe lại từng câu), xem khung hình của ba tệp `.mp4` (H.264 1280×720; 67,1 / 63,1 / 73,0 giây, khớp `durationSec`).
- Câu quy tắc trong video khớp nguyên văn `note`/`caption` của bài (đọc `aⁿ` thành "a mũ n", ngoặc thành dấu phẩy, "số a"): định nghĩa luỹ thừa, cơ số và số mũ, câu ô thứ 64, quy tắc nhân, quy tắc chia kèm điều kiện, "Một số khác 0 chia cho chính nó thì được 1.", quy ước số mũ 0.
- Kiến thức khác đúng và có trong tr.22–24: ô 2, 3, 4 có 2, 4, 8 hạt; 2 · 2 · 2 = 2³; 3² · 3⁴ = 3⁶; 9⁴ · 9⁶ = 9¹⁰; 2⁵ : 2³ = 2²; 2³ : 2³ = 2⁰ = 1; 9⁰ = 1. Ví dụ trong video không trùng câu nào trong `exercises`.
- Lỗi Nghiêm trọng của lần review trước đã sửa: hình chốt cuối video chia (`s07-nho`) nay có "a ≠ 0   m ≥ n" dưới aᵐ : aⁿ = aᵐ⁻ⁿ và "a ≠ 0" dưới a⁰ = 1 (khung 64 s và 71,5 s).
- Năm clip gắn đúng card và bao trọn đoạn giảng theo `.vtt`: `viet-gon` (20,2–41,8 s) → `card.viet-luy-thua`; `co-so-so-mu` (42,2–51,2 s) → `card.co-so-so-mu`; `nhan-cung-co-so` (18,7–46,2 s) → `card.nhan-cung-co-so`; `chia-cung-co-so` (10,9–36,5 s) → `card.chia-cung-co-so`; `so-mu-0` (36,9–59,2 s) → `card.so-mu-0`.
- Walk phát được cả ba video trên ba thiết bị, có phụ đề và nút phát lớn (ảnh `002-s1-01-block-playing`, `074-s6-01-block-playing`, `093-s8-01-block-playing`; iPad ngang `002`, `073`, `092`).

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Chuyện bàn cờ kết bằng "nhà vua … thưởng" mà chưa kể phần thưởng

- Vị trí: `$.sections[0].blocks[4].children[2]` (`luy-thua.section.luy-thua-la-gi`, note "Nhiều thóc đến thế, nhà vua không có đủ để thưởng!") và `video/projects/luy-thua/luy-thua-la-gi/script.json`, cảnh `s01-ban-co` / `s07-o-cuoi`
- Nguồn: tr.22, `p22.png` (mở đầu: nhà phát minh chọn phần thưởng là số thóc trên 64 ô; câu hỏi nhà vua có đủ thóc để thưởng không)
- Vấn đề: cả phần mở đầu của bài (caption `ban-co`) lẫn cảnh mở đầu video chỉ nói bàn cờ và hạt thóc, không nói ai được thưởng, ai thưởng. Câu kết nhắc "nhà vua" lần đầu, nên câu chuyện không có câu hỏi để câu kết trả lời; người học chậm khó hiểu vì sao số thóc lớn lại đáng nói. Lỗi có từ bản đã xuất bản, video lặp lại.
- Sửa: thêm một câu mở đầu ở caption `ban-co` và ở cảnh `s01-ban-co`, vd "Nhà vua hứa thưởng thóc cho người làm ra bàn cờ: ô đầu 1 hạt, mỗi ô sau gấp đôi ô trước. Nhà vua có đủ thóc không?" Chỉ đọc lại câu mới của video; mốc clip sẽ dịch, `video:build` ghi lại.

## Góp ý

### 1. Video 1: hạt thóc hiện sau nhãn số hạt, 8 hạt đứng rất ngắn

- Vị trí: `video/projects/luy-thua/luy-thua-la-gi/index.html`, cảnh `s02-gap-doi` (13,5–20,4 s)
- Nguồn: —
- Vấn đề: tiêu đề ô và nhãn số hạt nay đổi cùng lúc (đã sửa góp ý trước), nhưng hạt chỉ hiện ở chữ "hạt" cuối câu, nên khoảng 1 giây khay có 1 hạt khi nhãn ghi "2 hạt", 2 hạt khi ghi "4 hạt", 4 hạt khi ghi "8 hạt". 8 hạt đủ chỉ đứng khoảng 0,5 giây trước khi cảnh mờ đi.
- Sửa: cho hạt mới hiện cùng lúc với nhãn (mốc chữ "ô"), giữ 8 hạt thêm khoảng 1 giây.

### 2. Video 3: hai câu "trừ" Whisper vẫn nghe thành "chữ"

- Vị trí: `video/projects/luy-thua/chia-cung-co-so/script.json`, "Số mũ là 5 trừ 3, bằng 2." (`s03-ket-qua`) và "Số mũ là 3 trừ 3, bằng 0." (`s05-chia-chinh-no`)
- Nguồn: —
- Vấn đề: `renders/report.json` ghi khớp 1 sau khi gộp tr/ch, nhưng cả hai câu phải đọc 4 lần và bản nghe vẫn là "chữ"; chữ "trừ" trong câu quy tắc thì nghe đúng. Nếu giọng đọc thật sự thành "chữ", trẻ nghe sai phép tính.
- Sửa: nghe lại hai câu; nếu "trừ" không rõ thì sinh lại.

### 3. Video 3: điều kiện của a⁰ = 1 ở hình chốt hiện muộn

- Vị trí: `video/projects/luy-thua/chia-cung-co-so/index.html`, cảnh `s07-nho` (`#cond-7b`)
- Nguồn: tr.24, `p23-24.png`
- Vấn đề: a⁰ = 1 hiện từ khoảng 67 s, còn "a ≠ 0" bên dưới hiện ở chữ "khác" thứ hai (khoảng 70 s), chỉ đứng khoảng 2,5 giây trước khi video mờ. Lời đọc cùng lúc có nói đủ điều kiện.
- Sửa: hiện `#cond-7b` cùng lúc với `#rule-7b`, như `#cond-7a` đã hiện gần như ngay sau công thức chia.

### 4. `minutes` của section có video chưa tính thời lượng video

- Vị trí: `$.sections[5].minutes` (`nhan-cung-co-so`, 4) và `$.sections[7].minutes` (`chia-cung-co-so`, 3)
- Nguồn: —
- Vấn đề: khối video không tính là màn nên `minutes` vẫn đúng theo luật 40 giây mỗi màn, nhưng video dài 63 và 73 giây làm hai section thực tế khoảng 5 và 4,5 phút. Luật chưa nói có cộng thời lượng video hay không.
- Sửa: chốt luật cho video (cộng `durationSec` vào `minutes` hay không), rồi áp đồng loạt cho mọi section có video.

### 5. Ảnh bìa video: nút phát che đúng công thức chính

- Vị trí: `poster` trong ba `script.json` (ảnh `001-s1-01-block`, `073-s6-01-block`, `092-s8-01-block`)
- Nguồn: —
- Vấn đề: nút phát nằm giữa khung, đè lên 2³ (video 1), dòng "cơ số 3 / 2 + 4 = 6" (video 2) và 2⁵ : 2³ = 2² (video 3). Không sai kiến thức, chỉ khó nhìn.
- Sửa: chọn khung bìa có công thức ở nửa trên (vd cảnh chuỗi hạt), hoặc báo người làm app đặt nút phát lệch khỏi tâm.
