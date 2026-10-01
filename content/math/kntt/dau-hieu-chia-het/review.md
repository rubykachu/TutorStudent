# Review: Dấu hiệu chia hết (`dau-hieu-chia-het`)

- Bài: `content/math/kntt/dau-hieu-chia-het/lesson.json`
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`), section: tong-chu-so, chia-het-9, chia-het-3, cho-hai-so, tich-chia-het, luy-thua-10, lap-so
- Nguồn đã đọc: `sources/math/dau-hieu-chia-het/` - sbt-p34
- `content:check`: 0 lỗi, 0 cảnh báo của bài
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/dau-hieu-chia-het/`
- Kết luận: 0 lỗi Nghiêm trọng, còn 1 Nên sửa (tong-25-chia-het-9); đã ghi hash bằng --mark, điều phối chạy --approve sau cùng
- Bản đã review: `aba13db65c55e1c752300744c2222c97c402d1558c6474aa9cf6a1388b181346` (`pnpm content:diff` so với bản này)

Đối chiếu vòng 3: Nghiêm trọng 1 đã sửa đúng. Màn `ba-khac-chin` có lại câu "Số chia hết cho 3 chưa chắc chia hết cho 9. Số 2 415 có tổng các chữ số là 12, chia hết cho 3 nhưng không chia hết cho 9", khớp bốn dòng hình (12 ⋮ 3, 12 ⋮̸ 9, 2 415 ⋮ 3, 2 415 ⋮̸ 9) và câu điền `dien-3-9-5232` (ảnh `phone/066-s6-03-block.png`). Màn chạm `chon-3-1410` có dòng việc và dòng lý do ("Làm vậy giúp bạn biết số chia hết cho 3 mà không cần chia"); 1 410 (tổng 6) và 4 080 (tổng 12) là hai số đúng (ảnh `phone/067-s6-04-block.png`). Nên sửa 1-3 và Góp ý 2, 4, 5, 6 của vòng 3 đã sửa đúng: `tong-9031` (tổng 13, chưa trùng tổng nào trong section), `lap-so-014`, `hop-banh-tui`, `xep-1530`, note `lap-035` chỉ còn một câu, `chon-10-9` và `chon-nhieu-10-3` đổi số thêm. Recap vẫn khớp note quy tắc của `tong-chu-so`, `chia-het-9`, `chia-het-3`, `luy-thua-10`, `lap-so`, `tich-chia-het` (đã so từng chữ). Hình `giai-cong-9031`, `giai-banh-56` có trong catalog; hình `giai-cong-7036`, `giai-banh-60` đã bỏ, không còn hình mồ côi; hình lời giải `giai-banh-56` tô slate nên Góp ý 1 phần "tô amber cho nhãn số túi" đã hết. Đã tự giải trước khi xem `answer`: `tong-9031` (13), `tong-25-chia-het-9` (một đáp án đúng "a"), `lap-so-014` (140, 410, 104 = 3 số; 014 bị loại), `hop-banh-tui` (8 : 4 = 2, 2 · 7 = 14), `chon-10-9` (chỉ 10⁵ + 8, tổng 9), `chon-nhieu-10-3` (10⁴ + 8 và 10⁶ + 2, tổng 9 và 3): đều đúng một đáp án hay đúng một tập, nhẩm không quá 2 phép, câu không quá 25 âm tiết. Số thêm vào luỹ thừa của 10 để tổng chia hết cho 3 chỉ có 2, 5, 8 nên việc `+ 2` lặp ở chip, `tong-10-5-2` và `chon-nhieu-10-3` là không tránh được, không ghi. Ghi chú sửa vòng 3: phương án `0, 2, 4 = 5 số` ở Nên sửa 3 cũ là tính nhầm (đúng là 4 số: 240, 420, 402, 204), nên tác giả chọn 0, 1, 4 là hợp lý.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. `tong-25-chia-het-9`: hai lựa chọn cùng kết luận "Không", trẻ đúng kết luận vẫn có thể chọn b - LL-10, LL-14

- Vị trí: `ex.tong-25-chia-het-9` (`checkIds` của `chia-het-9`), `options[1]`
- Nguồn: —
- Vấn đề: đáp án a "Không, vì 25 không chia hết cho 9" và nhiễu b "Không, vì 5 884 có chữ số tận cùng là 4" cùng trả lời "Không" cho câu hỏi "có chia hết cho 9 không?". 5 884 đúng là không chia hết cho 9, nên trẻ chỉ nhìn kết luận sẽ thấy hai ô cùng đúng và phải đoán xem "vì" nào hợp lệ. Tận cùng 4 không quyết định chia hết cho 9 (54 chia hết cho 9), nhưng câu viết bằng "vì" khiến lựa chọn trông như một đáp án đúng khác. Ở `tong-15-chia-het-3` bố cục này không có lỗi vì b có kết luận "Không" sai.
- Sửa: đổi b thành "Có, vì 5 884 có chữ số tận cùng là 4" để chỉ a có kết luận "Không"; vẫn là lỗi hay gặp (nhầm với dấu hiệu chia hết cho 2). Cập nhật `check` nếu có.

## Góp ý

### 1. `lap-so-014` có cùng đáp án và cùng cách tách với hình ví dụ `lap-035`

- Vị trí: `ex.lap-so-014` so với visual `lap-035` (`$.sections[13].blocks[2]`) - LL-07
- Nguồn: tr.34 câu 2.18, `sbt-p34.png`
- Vấn đề: hình ví dụ kết thúc "Được 3 số" (tận cùng 0 được 2 số, tận cùng khác 0 được 1 số, loại số có 0 đứng đầu); câu 014 cũng ra 3 theo đúng cách tách 2 + 1. Mọi bộ có chữ số 0 chỉ cho 2, 3 hoặc 4 số nên khó tránh trùng đáp án; câu vẫn thử được luật "0 không đứng đầu" (bỏ luật thì ra 4).
- Sửa: tuỳ tác giả, hoặc đổi sang bộ hai chữ số chẵn cùng 0 (0, 2 và 4 cho 4 số, khác 3) nhưng khi đó trùng đáp án 4 của `dem-so-124`.

### 2. `hop-banh-tui` lặp khung của hình ví dụ `hop-6-7`

- Vị trí: `ex.hop-banh-tui` so với note và visual `hop-6-7` (`$.sections[7].blocks[0]`) - LL-07
- Nguồn: —
- Vấn đề: ví dụ là "mỗi hộp 6 cái, mua 7 hộp, mỗi túi 3 cái" (mỗi hộp được 2 túi, 7 hộp); câu mới là "mỗi hộp 8 cái, 7 hộp, mỗi túi 4 cái" (cũng 2 túi mỗi hộp, 7 hộp, đáp án 14). Chỉ khác hai số, giữ nguyên số hộp và kết quả mỗi hộp; đáp án 14 không hiện trên màn nên trẻ vẫn phải tính.
- Sửa: đổi số hộp, vd 5 hộp (8 : 4 = 2, 2 · 5 = 10).

### 3. Màu amber còn dùng cho "Tích" và cho nhãn khác của bài

- Vị trí: `concepts[3]` (`concept.tich`) so với `lan-7-2`, `diem-chia-het-3`, `but-vo-55`, `tom-tat-but-vo` (`catalog.ts`)
- Nguồn: —
- Vấn đề: amber vừa là khái niệm "Tích" ở `tich-chia-het`, vừa tô "Điểm được" ở `lan-7-2` và vài nhãn ở section khác (không nằm cùng màn).
- Sửa: tô các nhãn đó bằng slate, hoặc đổi màu `concept.tich` sang màu chưa dùng.

### 4. Màu xanh dương vừa là tổng số đồ vật vừa là "Thừa số"

- Vị trí: hình `bags` (`tui-24-3`, `hop-27-9`: số 24, 27 xanh dương) so với `concept.thua-so` (`hop-6-7`, `tich-12-7`)
- Nguồn: —
- Vấn đề: hai nghĩa của một màu ở hai section khác nhau, không nằm cùng màn.
- Sửa: nếu muốn chặt hơn, đổi màu `concept.thua-so` sang màu chưa dùng.
