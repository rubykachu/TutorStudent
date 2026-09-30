# Review: Thứ tự thực hiện các phép tính (`thu-tu-thuc-hien-phep-tinh`)

- Bài: `content/math/kntt/thu-tu-thuc-hien-phep-tinh/lesson.json`
- Vòng: 4 - phần đổi (`pnpm content:diff`, so với bản `99ac6942…` của vòng 3): `overview.summary`, `overview.narration`, ba video `hoa-don`, `hon-hop`, `ngoac-long` (khối `video` đầu section và `videos[]` kèm clip), section: hoa-don, hon-hop, ngoac-long; kèm kịch bản và hình `video/projects/thu-tu-thuc-hien-phep-tinh/{hoa-don,hon-hop,ngoac-long}/`
- Nguồn đã đọc: không có (diff chỉ có overview và video; không đổi card hay bài tập)
- `content:check`: 1 lỗi (`[review-hash]`, sẽ hết khi chạy lệnh cuối vòng), 1 cảnh báo của bài (3 id chưa có trong `ids.lock.json`)
- `lesson:walk`: không chạy, điều phối sẽ chạy sau duyệt (server dev chưa phục vụ bài trước khi duyệt)
- Kết luận: Chưa đạt: còn 2 lỗi Nghiêm trọng
- Bản đã review: `80c879788764915af9fcbac1b1db92373882960e477d38c7b9e20c6c5d88c4f0` (`pnpm content:diff` so với bản này)

Đã soát:
- `overview.summary` nay 2 câu, nhắc biểu thức có ngoặc, luỹ thừa và chữ: đúng luật overview, hết Nên sửa 14 của vòng 2. Lời đọc `overview.vtt` khớp nguyên văn hook, summary, goals (sau câu dẫn "Học xong bài này, bạn sẽ:") và whyItMatters; `overview.m4a` có.
- Số trong ba kịch bản đều đúng: 2 · 8 + 5 = 21; Lan 8 + 5 = 13, 2 · 13 = 26; 20 + 6 · 3 − 8 : 4: 18, 2, 38, 36; {10 + 2 · [5 + (3 · 2)]}: 6, 11, 22, 32. Câu nêu quy tắc đều đánh `rule` trừ câu thứ tự ngoặc của `ngoac-long` cảnh `s03-mo` ("Vậy ta làm ngoặc tròn trước. Rồi làm ngoặc vuông. Cuối cùng làm ngoặc nhọn."): không nguyên văn note (note có kí hiệu ngoặc không đọc được) nhưng đúng kiến thức, cùng thứ tự với note và recap.
- Màu trong hình: phép làm trước khoanh hồng, kết quả hổ phách gạch chân, ngoặc tròn teal, vuông sky, nhọn lime, nhãn "( ) ngoặc tròn / [ ] ngoặc vuông / { } ngoặc nhọn" khớp note và `bang-ngoac`.
- Clip: `hoa-don` (s02–s05, 13,7–51,5 s), `hon-hop` (s02–s06, 13,3–60,1 s), `ngoac-long` (s02–s06, 11,4–59,2 s) đều giảng đúng card gắn vào.
- Các mục khác của ba section không đổi; recap vẫn khớp note.
- Mục vòng 3 (Nên sửa 1–3, Góp ý 1–5) đã có trong `backlogs/lesson-thu-tu-thuc-hien-phep-tinh.md`, không ghi lại.

## Nghiêm trọng

### 1. Video `hon-hop`: hình làm hai phép một dòng và bỏ dòng 38 − 2, đúng lúc lời đọc nói "Mỗi dòng chỉ làm một phép tính"

- Vị trí: `video/projects/thu-tu-thuc-hien-phep-tinh/hon-hop/` cảnh `s03-nhan`, `s04-cong` (`index.html`); video `thu-tu-thuc-hien-phep-tinh.video.hon-hop`, 22–47 s, nằm trong clip của `card.hon-hop`
- Nguồn: —
- Vấn đề: Khung 22–27 s: dòng thứ hai "20 + 18 − 2" điền cả 18 lẫn 2 (hai phép một dòng). Khung 39–47 s: dòng ba lặp lại "20 + 18 − 2" rồi nhảy thẳng xuống "36"; số 38 và dòng "38 − 2" không bao giờ hiện, trong khi lời đọc "20 cộng 18 bằng 38. 38 trừ 2 bằng 36." Ngay sau đó (44,7 s) lời đọc "Mỗi dòng chỉ làm một phép tính." trong lúc màn hình hiện hai chỗ trái điều đó. "Mỗi dòng chỉ làm một phép tính" là quy tắc trình bày của bài (note `bai-tap-sach`), và hình `hon-hop-tung-buoc` ngay dưới video trong cùng section tính đúng biểu thức này theo từng phép một dòng (20 + 18 − 8 : 4, 20 + 18 − 2, 38 − 2, 36). Trẻ học chậm nhìn hình sẽ nhớ cách trình bày ngược với câu vừa nghe và với màn kế tiếp. Xếp Nghiêm trọng (không phải sai số) vì hình phản ví dụ ngay chính quy tắc được đọc lên; phân vân nên chọn mức cao hơn.
- Sửa: Dựng lại cảnh `s03-nhan`/`s04-cong` theo từng phép một dòng như `hon-hop-tung-buoc`: `20 + 18 − 8 : 4` → `20 + 18 − 2` → `38 − 2` → `36`, mỗi dòng khoanh hồng một phép, kết quả hổ phách; lời "8 chia 4 bằng 2" đi với dòng thứ hai, "20 cộng 18 bằng 38" hiện dòng `38 − 2`. Nếu giữ hình hai phép một dòng thì bỏ câu "Mỗi dòng chỉ làm một phép tính." và vẫn phải hiện dòng `38 − 2`.

### 2. Video `ngoac-long`: "Hai phần quà hết 32 nghìn đồng" sai với câu chuyện của bài, số 10 không được giải thích

- Vị trí: `video/projects/thu-tu-thuc-hien-phep-tinh/ngoac-long/script.json` cảnh `s04-tron` (câu "Thử với hai phần quà.") và `s05-nhon` (câu "Hai phần quà hết 32 nghìn đồng."), 34–53 s, nằm trong clip của `card.ngoac-long`
- Nguồn: —
- Vấn đề: Theo caption `ngoac-long-tung-buoc` ngay dưới video, mỗi phần quà là hộp bút 5 nghìn và 3 gói kẹo 2 nghìn (11 nghìn), hai phần quà là 2 · 11 = 22 nghìn; 10 nghìn là tiền túi đựng quà, không thuộc phần quà nào. Câu "Hai phần quà hết 32 nghìn đồng" vì vậy nói sai số tiền của hai phần quà. Video cũng không nói 3 · 2, 5, 10 là tiền gì, nên trẻ không nối được phép tính với câu chuyện (cùng lỗi "32 là số tiền gì" vòng 3 ghi cho caption, nay lại xuất hiện ở lời đọc, và nói sai).
- Sửa: Cảnh `s04-tron` thay "Thử với hai phần quà." bằng lời dẫn câu chuyện, ví dụ "Mua 2 phần quà. Mỗi phần có hộp bút 5 nghìn đồng và 3 gói kẹo, mỗi gói 2 nghìn đồng. Thêm túi đựng quà 10 nghìn đồng." Câu cuối `s05-nhon` đổi thành "Cả hai phần quà và túi hết 32 nghìn đồng." (hoặc "Cần tất cả 32 nghìn đồng."). Chạy lại `video:build` và Whisper cho các câu đổi.

## Nên sửa

### 1. Video `hoa-don`: cách làm sai của Lan khoanh bằng màu hồng "phép làm trước"

- Vị trí: `video/projects/thu-tu-thuc-hien-phep-tinh/hoa-don/index.html` cảnh `s03-lan`, 24–31 s (vòng hồng quanh `8 + 5`)
- Nguồn: —
- Vấn đề: Trong cả bài và cả video, khoanh hồng nghĩa là "phép tính làm trước" (đúng). Ở cảnh Lan, `8 + 5` là phép bị làm trước sai nhưng vẫn khoanh hồng giống hệt vòng `2 · 8` của Nam, nên một màu mang hai nghĩa; dấu ✗ của Lan chỉ hiện sau đó ở 42 s. Video `hon-hop` cảnh `s05-sai` đã làm đúng: vòng xám tối kèm nhãn "✗ … sai". Các cột sai của bài cũng xám có ×.
- Sửa: Cảnh `s03-lan` đổi vòng quanh `8 + 5` sang kiểu vòng sai xám như `s05-sai` của `hon-hop`, và hiện dấu ✗ cạnh "Lan: cộng trước" ngay từ đầu cảnh.

### 2. Video `ngoac-long`: khoảng 4 giây hiện `10 + 2 · 5 + 3 · 2` không có ngoặc

- Vị trí: `video/projects/thu-tu-thuc-hien-phep-tinh/ngoac-long/index.html` chuyển từ `s01-ba-loai` sang `s02-hop`, 11–15 s (đầu clip `card.ngoac-long` ở 11,4 s), hộp ngoặc vuông và nhọn chỉ hiện ở khoảng 17–18 s
- Nguồn: —
- Vấn đề: Kí hiệu ngoặc bị xoá trước khi các hộp hiện, nên màn hình còn `10 + 2 · 5 + 3 · 2`: một biểu thức khác (giá trị 26), đúng dạng bỏ ngoặc mà bài dặn tránh. Clip ôn của card bắt đầu đúng ở đoạn này.
- Sửa: Giữ kí hiệu ngoặc (mờ dần) cho tới khi hộp tương ứng hiện, hoặc vẽ cả ba hộp cùng lúc rồi mới xoá kí hiệu ngoặc.

## Góp ý

### 1. Video `hon-hop`: số 18 mất màu kết quả khi số 2 hiện

- Vị trí: `hon-hop/index.html` cảnh `s03-nhan`, 23–25 s
- Nguồn: —
- Vấn đề: 18 hiện hổ phách gạch chân, đến khi 2 hiện thì dòng vẽ lại, 18 thành chữ đen (khoảng 25 s dòng còn nháy mờ nhỏ). Hai kết quả cùng dòng một màu, một không. Sẽ tự hết nếu sửa theo Nghiêm trọng 1.
- Sửa: Giữ kiểu kết quả cho mỗi số vừa tính ở dòng của nó.

### 2. Video `hon-hop`: câu "Đừng làm từ trái sang phải ngay." và nhãn cuối chỉ có nửa quy tắc

- Vị trí: `hon-hop/script.json` cảnh `s05-sai` (47,5 s); `hon-hop/index.html` cảnh `s06-nho` (nhãn "nhân, chia trước")
- Nguồn: —
- Vấn đề: 8 giây trước đó lời đọc vừa nói "Trong mỗi nhóm, làm từ trái sang phải."; câu "Đừng làm từ trái sang phải ngay" nghe như trái lại. Cảnh nhớ đọc "Nhân, chia làm trước; cộng, trừ làm sau." nhưng nhãn chỉ ghi "nhân, chia trước" (video `hoa-don` ghi đủ "nhân trước, cộng sau").
- Sửa: "Đừng cộng 20 với 6 trước."; nhãn cuối "nhân, chia trước; cộng, trừ sau".

### 3. Whisper nghe câu thứ tự ngoặc thành "ngọt buông", "ngọt nhọn"

- Vị trí: `video/projects/thu-tu-thuc-hien-phep-tinh/ngoac-long/renders/report.json`, câu "Rồi làm ngoặc vuông." (match 0,842, 4 lần) và "Cuối cùng làm ngoặc nhọn." (0,875, 4 lần); "Ngoặc vuông là hộp vừa." nghe thành "Ngọc Vương" (0,955)
- Nguồn: —
- Vấn đề: Đây là các câu nêu thứ tự ngoặc; nếu giọng đọc thật sự méo, trẻ nghe sai tên ngoặc. Reviewer không nghe được âm thanh để xác nhận.
- Sửa: Tác giả nghe lại ba câu này; méo thì đọc lại (đổi seed hoặc tách câu).
