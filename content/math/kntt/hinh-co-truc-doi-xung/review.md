# Review: Hình có trục đối xứng (`hinh-co-truc-doi-xung`)

- Bài: `content/math/kntt/hinh-co-truc-doi-xung/lesson.json`
- Vòng: 7 - chỉ phần đổi (`pnpm content:diff`: video và lời đọc), section: `truc-doi-xung`, `hinh-deu`, `ve-them-hinh` (ba video) và `overview.narration`
- Nguồn đã đọc: không mở ảnh nguồn (diff chỉ có video và lời đọc, không có câu `bookPractice`)
- `content:check`: 0 lỗi (chỉ còn `review-hash` do bản chưa ghi hash của vòng này), 1 cảnh báo của bài (3 id video chưa khoá)
- Đọc hiểu (Haiku): không chạy (chữ bài không đổi); các vòng trước: 215 / 1 / 0 trên toàn bài (trước vòng 1, `.shots/review/hinh-co-truc-doi-xung/doc-hieu.md`); chữ đổi sau vòng 2: lượt 1 72 / 7 / 0 (`doc-hieu-2.md`), lượt 2 7 / 6 / 1 (`doc-hieu-3.md`), lượt 3 8 / 4 / 0 (`doc-hieu-4.md`, hết 3 lượt); chữ đổi sau vòng 5: 6 / 0 / 0 (`doc-hieu-5.md`)
- `lesson:walk`: chưa chạy trong vòng này (điều phối chạy sau); `pnpm video:check hinh-co-truc-doi-xung` ok cả bài và 3 video
- Kết luận: Đã ghi reviewedHash, bài giữ trạng thái hiện tại (0 Nghiêm trọng, 2 Nên sửa và 2 Góp ý về video, không chặn; điều phối chạy `--approve` sau khi chốt các mục Nên sửa)
- Bản đã review: `4d2dee270e58de03520d542c26fd44c9c0f8f2522ba4e320682df1187aefd2c1` (`pnpm content:diff` so với bản này)

Đã soát: kịch bản (`script.json`), `index.html`, báo cáo Whisper (`renders/report.json`, mọi câu khớp 97% trở lên), phụ đề `.vtt`, sheet khung hình và khung riêng cắt từ `.mp4` của cả ba video, lời đọc giới thiệu `overview.vtt` (chữ khớp `overview` từng câu; câu đầu "Chào bạn!" cách đầu 1 giây; giọng Achird cùng giới tính với Hải Đăng). Lưu ý đọc sheet: tên khung `f-NNN` ứng với khoảng giây NNN x 2 cộng thêm gần 1 giây; đã cắt khung riêng từ `dem-truc.mp4` ở 16,0 / 16,6 / 17,0 / 17,4 / 17,8 để xác nhận đường 1 hiện ngay trước chữ "thẳng" (17,39 s), tức hình khớp lời.

Kiến thức, quy tắc, nhịp, hình:
- `gap-doi-hinh`: câu `rule` đúng nguyên văn `note` của section (một nửa trước dấu "."; build đã kiểm); gấp theo d (hai nửa chồng khít), gấp theo đường nằm ngang (nửa dưới dài 170, nửa trên 100, lệch); đúng kiến thức. Câu mở đầu 11 chữ có "bạn"; hình có từ khung đầu; `ask` ở 17,5-20,7 s, hình chưa gấp, gấp bắt đầu ở chữ "đè" (24,3 s); trục d hồng nét đứt, đường ngang xám.
- `dem-truc`: hình vuông 4 trục, hình chữ nhật 2 trục (đường chéo lệch, đánh dấu xám có ✕); `ask` ở 9,8-12,4 s, các đường chỉ hiện từ chữ "thẳng", "nằm", "chéo"; câu kết "gấp khít mới là trục" khớp quy tắc của section 2 (trục đối xứng).
- `ve-them-doi-xung`: câu `rule` đúng nguyên văn; các điểm đối xứng (2 ô, 5 ô) tính đúng trên lưới (đỉnh cách d 2 ô thì điểm đối xứng cách 2 ô bên kia; đỉnh cách 5 ô thì 5 ô); điểm đối xứng xanh ngọc, trục d hồng nét đứt, `ask` ở 15,1-17,5 s, điểm đối xứng chỉ hiện sau "Đếm đúng hai ô bên kia trục".
- Số liệu: lưới của video có khoảng cách 2 và 5; mọi bảng lưới có trục thẳng đứng của bài (`boards.ts`) dùng khoảng cách 0 đến 3, nên 5 ô không trùng câu luyện, ôn hay sách; 2 ô là khoảng cách chung của nhiều câu nhưng hình khác (kim cương, không phải dấu cộng, chiếc bình hay hình của sách).
- Dải dưới (từ y 540) trống ở cả ba video, chữ trong thẻ và chip không bị cắt, cú đứng trên dải đó.
- Ba video đặt ở đầu đúng section, mỗi section một video; clip gắn đúng card (`truc-doi-xung`, `hinh-deu`, `ve-them-hinh`).

## Nghiêm trọng

Không có.

## Nên sửa

### 1. `gap-doi-hinh`: "Diều giấy này chỉ có một trục" mâu thuẫn với "Con diều có hình thoi" của section sau

- Vị trí: `video/projects/hinh-co-truc-doi-xung/gap-doi-hinh/script.json`, câu cuối của cảnh `s05-thu` (khoảng 44,5-46,4 s); `$.videos[?(@.id=='hinh-co-truc-doi-xung.video.gap-doi-hinh')]`
- Nguồn: —
- Vấn đề: video gọi hình cánh diều (hai cạnh dài, hai cạnh ngắn, một trục) là "diều giấy" và chốt "chỉ có một trục". Section `chu-nhat-thoi` ngay sau đó nói "Con diều có hình thoi" (hai trục là hai đường chéo). Bé chậm, nhanh quên sẽ nhớ "diều thì một trục" rồi gặp "diều có hai trục" (cùng lúc câu "Con diều hình thoi gấp đôi theo một đường chéo thì hai nửa khít nhau"). Câu cuối cũng không có hình chứng minh: màn chỉ còn đường e lệch, không cho thấy các đường khác không phải trục.
- Sửa: đổi từ "cánh diều" thành tên không trùng "con diều" của bài (ví dụ "một miếng giấy hình mũi tên") ở câu "Đây là một cánh diều giấy.", câu "Ta kẻ đường thẳng d qua giữa diều." và "Đường d chia diều làm hai nửa."; và thay câu cuối bằng câu có hình đỡ, như "Chỉ đường d làm hai nửa khít." (hình quay lại đường d hồng). Dựng lại video là quyết định của chủ dự án (`.claude/rules/video.md`).

### 2. `dem-truc`: clip của card `hinh-deu` chứa cả đoạn hình chữ nhật mà card không dạy

- Vị trí: `$.videos[?(@.id=='hinh-co-truc-doi-xung.video.dem-truc')].clips[0]` (`start` 9,526, `end` 44,543; `cardIds`: `hinh-co-truc-doi-xung.card.hinh-deu`); kịch bản cảnh `s04-chu-nhat`
- Nguồn: —
- Vấn đề: card `hinh-deu` nhắc "tam giác đều 3 trục, vuông 4 trục, lục giác đều 6 trục, hình tròn vô số trục". Clip chạy từ `s02-hoi` tới `s05-nho` nên có thêm khoảng 12 giây hình chữ nhật (2 trục, đã dạy ở card `chu-nhat-thoi`). Khi bé sai card này rồi bấm "Xem lại đoạn video", bé xem một đoạn không khớp card. Video cũng không nêu tam giác đều, lục giác đều hay hình tròn, nên ý của section ("hình có nhiều trục") chỉ được dạy bằng một hình vuông.
- Sửa: cắt clip chỉ lấy `s02-hoi` tới `s03-vuong` (hỏi rồi đếm 4 trục của hình vuông), hoặc đổi cảnh `s04-chu-nhat` thành hình đều khác (tam giác đều 3 trục) rồi để clip như cũ. Cả hai cách đều cần dựng lại video: chủ dự án quyết.

## Góp ý

### 1. `dem-truc`: lời nói "gấp thử" nhưng hình chỉ vẽ đường, không gấp

- Vị trí: `video/projects/hinh-co-truc-doi-xung/dem-truc/index.html`, cảnh `s03-vuong` và `s04-chu-nhat`
- Nguồn: —
- Vấn đề: ở video `gap-doi-hinh` bé thấy hình gấp thật; ở đây các đường hiện từng cái cùng lời "gấp khít", không có chuyển động hai nửa chồng nhau, nên "khít" và "lệch" chỉ là lời nói và dấu ✕ xám.
- Sửa: tuỳ tác giả; nếu dựng lại, lật một nửa theo đường đang xét như `fold` của `gap-doi-hinh`.

### 2. `ve-them-doi-xung`: "Các đỉnh còn lại làm như vậy" bỏ qua hai đỉnh nằm trên d

- Vị trí: câu cuối của cảnh `s05-nam-o` (khoảng 31,4-33,4 s)
- Nguồn: —
- Vấn đề: hình mẫu có hai đỉnh nằm ngay trên d (trên cùng và dưới cùng), không cần điểm đối xứng mới; câu "các đỉnh còn lại" làm bé hiểu mọi đỉnh còn lại đều cần đếm. Phần này bài đã dạy ở câu `s9-on-diem-tren-truc`, nên không sai kiến thức.
- Sửa: tuỳ tác giả; có thể nói "Đỉnh nằm trên trục thì giữ nguyên." trước câu quy tắc nếu dựng lại.
