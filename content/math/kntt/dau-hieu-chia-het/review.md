# Review: Dấu hiệu chia hết (`dau-hieu-chia-het`)

- Bài: `content/math/kntt/dau-hieu-chia-het/lesson.json`
- Vòng: 5 - chỉ phần đổi (`pnpm content:diff`: lời đọc tổng quan và 3 video), section: `chia-het-2`, `chia-het-9`, `tim-chu-so`
- Nguồn đã đọc: không có (diff chỉ có video và lời đọc; đối chiếu với câu quy tắc, recap và quy ước của chính bài)
- `content:check`: 0 lỗi, 0 cảnh báo của bài
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/dau-hieu-chia-het/`
- Kết luận: 0 Nghiêm trọng; 2 mục Nên sửa trong kịch bản video đã sửa và dựng lại trong vòng này
- Bản đã review: `48609ffdb011bf8c2c9cb6de7f30858cc92cbef470ad9852acf91d748e8c5b6a` (`pnpm content:diff` so với bản này)

Đã soát: toàn bộ 47 câu của 3 kịch bản (toán, chữ dùng, "bạn", khớp câu quy tắc và kí hiệu "chia hết" ba chấm), lời đọc tổng quan, câu mở đầu và một giọng Hải Đăng (`pnpm video:check`), mốc thời gian từng chữ, và khung hình cách 2 giây của cả 3 video qua contact sheet (chữ rõ, không chồng, không lộ kết quả trước lời, dải dưới trống). Mọi phép tính trong lời đều đúng: 4 376 tận cùng 6; 135 : 5 và 137 không chia hết cho 5; 5 + 9 + 7 + 6 = 27; 2 + 4 + 1 + 5 = 12; 11 + a nằm từ 11 đến 20, chỉ 18 chia hết cho 9, a = 7, số 387. Các câu Whisper dưới 97% ở lần dựng đầu ("4 376", "5 976", "2 415") là cách Whisper viết số; bộ chuẩn hoá `video/lib/text.ts` nay coi số có nhóm nghìn viết bằng dấu cách, dấu chấm hay liền như nhau (kèm test), nên mọi câu của 3 video từ 98,1% trở lên.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Video `tim-chu-so`: câu "Đề cho số 38 và chữ số a chưa biết" có hai cách hiểu (đã sửa)

- Vị trí: `video/projects/dau-hieu-chia-het/tim-chu-so/script.json`, cảnh `s01-de`, câu 2 và 3
- Nguồn: —
- Vấn đề: nghe "số 38 và chữ số a" bé có thể hiểu hai số rời (38 và a) rồi "Số đó chia hết cho 9" chỉ số 38; số cần tìm là 38a (ba chữ số). Caption của bài ghi rõ "số 38a".
- Sửa: "Đề cho số có ba chữ số: 3, 8 và chữ số a chưa biết."; ô 3, 8, a hiện đúng lúc đọc từng chữ số. Dựng lại, Whisper 98,1%.

### 2. Video `tong-chu-so`: câu mở đầu bị đọc sai "xét" thành "sẽ" (đã sửa)

- Vị trí: `video/projects/dau-hieu-chia-het/tong-chu-so/script.json`, câu 1
- Nguồn: —
- Vấn đề: cả bốn lần đọc Whisper đều nghe "ta sẽ chia hết cho 9" (96,1%), tức giọng đọc thật sự nuốt "xét"; câu thành vô nghĩa với bé.
- Sửa: "Chào bạn! Hôm nay ta học dấu hiệu chia hết cho 9 và cho 3." (14 chữ). Dựng lại, Whisper 100%.

## Góp ý

### 1. Video `tim-chu-so`: Whisper nghe "Đề cho số" thành "Đề chốt số" (98,1%)

- Vị trí: `video/projects/dau-hieu-chia-het/tim-chu-so/script.json`, câu 2
- Nguồn: —
- Vấn đề: qua ngưỡng 97% ở lần đọc đầu nhưng chữ "cho" có thể hơi gắt; chủ dự án nên nghe thử câu này khi duyệt giọng.
- Sửa: nếu nghe không rõ, đổi thành "Đề có số ba chữ số: 3, 8 và chữ số a chưa biết." rồi dựng lại.

### 2. `lap-so-014` có cùng đáp án và cùng cách tách với hình ví dụ `lap-035`

- Vị trí: `ex.lap-so-014` so với visual `lap-035` (`$.sections[13].blocks[2]`) - LL-07
- Nguồn: tr.34 câu 2.18, `sbt-p34.png`
- Vấn đề: hình ví dụ kết thúc "Được 3 số" (tận cùng 0 được 2 số, tận cùng khác 0 được 1 số, loại số có 0 đứng đầu); câu 014 cũng ra 3 theo đúng cách tách 2 + 1. Mọi bộ có chữ số 0 chỉ cho 2, 3 hoặc 4 số nên khó tránh trùng đáp án; câu vẫn thử được luật "0 không đứng đầu" (bỏ luật thì ra 4).
- Sửa: tuỳ tác giả, hoặc đổi sang bộ hai chữ số chẵn cùng 0 (0, 2 và 4 cho 4 số, khác 3) nhưng khi đó trùng đáp án 4 của `dem-so-124`.

### 3. `hop-banh-tui` lặp khung của hình ví dụ `hop-6-7`

- Vị trí: `ex.hop-banh-tui` so với note và visual `hop-6-7` (`$.sections[7].blocks[0]`) - LL-07
- Nguồn: —
- Vấn đề: ví dụ là "mỗi hộp 6 cái, mua 7 hộp, mỗi túi 3 cái" (mỗi hộp được 2 túi, 7 hộp); câu mới là "mỗi hộp 8 cái, 7 hộp, mỗi túi 4 cái" (cũng 2 túi mỗi hộp, 7 hộp, đáp án 14). Chỉ khác hai số, giữ nguyên số hộp và kết quả mỗi hộp; đáp án 14 không hiện trên màn nên trẻ vẫn phải tính.
- Sửa: đổi số hộp, vd 5 hộp (8 : 4 = 2, 2 · 5 = 10).

### 4. Màu amber còn dùng cho "Tích" và cho nhãn khác của bài

- Vị trí: `concepts[3]` (`concept.tich`) so với `lan-7-2`, `diem-chia-het-3`, `but-vo-55`, `tom-tat-but-vo` (`catalog.ts`)
- Nguồn: —
- Vấn đề: amber vừa là khái niệm "Tích" ở `tich-chia-het`, vừa tô "Điểm được" ở `lan-7-2` và vài nhãn ở section khác (không nằm cùng màn).
- Sửa: tô các nhãn đó bằng slate, hoặc đổi màu `concept.tich` sang màu chưa dùng.

### 5. Màu xanh dương vừa là tổng số đồ vật vừa là "Thừa số"

- Vị trí: hình `bags` (`tui-24-3`, `hop-27-9`: số 24, 27 xanh dương) so với `concept.thua-so` (`hop-6-7`, `tich-12-7`)
- Nguồn: —
- Vấn đề: hai nghĩa của một màu ở hai section khác nhau, không nằm cùng màn.
- Sửa: nếu muốn chặt hơn, đổi màu `concept.thua-so` sang màu chưa dùng.
