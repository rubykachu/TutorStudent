# Review: Ước chung. Ước chung lớn nhất (`uoc-chung-uoc-chung-lon-nhat`)

- Bài: `content/math/kntt/uoc-chung-uoc-chung-lon-nhat/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: `liet-ke-uc`, `uoc-chung-lon-nhat`, `so-nho-chia-het`, `nhac-thua-so`, `uclnn-phan-tich`, `uclnn-ba-so`, `uc-tu-uclnn`, `chia-deu-nhieu-nhat`, `bai-toan-uc`, `so-hoan-hao`, `phan-so-toi-gian`, `rut-gon-phan-so` (kèm `uoc-chung` là mục cùng section có bài tập đổi)
- Nguồn đã đọc: `sources/math/uoc-chung-uoc-chung-lon-nhat/` - sbt-p38, sbt-p39, sbt-p40, sbt-p107, sbt-p108
- `content:check`: 0 lỗi, 0 cảnh báo của bài (trừ cảnh báo id chưa khoá)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/uoc-chung-uoc-chung-lon-nhat/`; đã xem sheet điện thoại của section 2 đến 13 và sheet iPad của section 9, 10, 12
- Kết luận: Không còn lỗi Nghiêm trọng (0 Nghiêm trọng, 2 Nên sửa, 7 Góp ý); đã ghi "Bản đã review" bằng `--mark`, chưa `--approve` (điều phối chạy sau khi xử lý Nên sửa)
- Bản đã review: `3b276cc047429ec642c045f6aab1789db2e385458a4e2a6990d656865b9fb00b` (`pnpm content:diff` so với bản này)

Đã soát: mọi mục trong diff (6 khái niệm, 11 section, 9 card, 13 bài tập mới, 17 bài tập đổi, 13 bài tập bỏ) và các mục khác cùng section. Tự giải mọi bài tập đổi hay mới, kể cả từng nhiễu: `dem-doan-15-20` (7), `cap-uclnn-bang-so-nho` (8 và 24; 10 và 50), `dien-tich-thua-so-nguyen-to`, `chon-chung-28-42` (2, 7), `tinh-uclnn-50-70` (10), `uclnn-24-56` (8), `chon-uclnn-42-70` (2 · 7), `uclnn-15-45-50` (5), `uclnn-18-54-81` (9), `chon-chung-30-42-66` (2, 3), `uclnn-7-28-49` (7), `uclnn-24-60-84` (12), `dem-uc-36-63` (3), `chia-nhom-16-28` (2, 4), `dia-10-35` (5), `but-vo-16-36` (4), `hop-but-21-28` (7), `tui-ke-32-48` (16), `so-lon-nhat-44-66` (22), `dien-tong-uoc`, `toi-gian-4-15`, `chon-toi-gian` (7/10), `rut-gon-18-24` (3/4), `uc-lon-hon-1-32-40`, `mau-toi-gian-33-55`. Mỗi câu đúng một đáp án hay một tập đáp án; không nhiễu nào thành đáp án đúng (LL-01). Nấc 1 của mọi câu đổi trỏ vào khối đề (số liệu, khối công thức), không vào lựa chọn; hình gợi ý và lời giải đi kèm (`bang-50-70`, `bang-18-54-81`, `bang-24-60-84`, `cat-giai-15-20`, các hình gợi ý `bang-goi-y-*`) vẽ đúng số của đề hoặc dùng số khác đề.

Bản sửa vòng 2: 4 Nghiêm trọng cũ đã sửa đúng. Note màn chạm ƯCLN đã hỏi 20 và 24 khớp hình `chon-uclnn-20-24`. Section `nhac-thua-so` tự diễn đạt lại định nghĩa số nguyên tố và phân tích ra thừa số nguyên tố (không còn trùng câu tr.35 mà LL-08 đã ghi, giữ điều kiện "lớn hơn 1"), recap section và card chép đúng câu phân tích, câu điền `dien-sn-chinh-no` đã thay bằng `dien-tich-thua-so-nguyen-to` dựng từ chính câu quy tắc. `dien-tong-uoc` khớp câu quy tắc số hoàn hảo. Câu rút gọn phân số nêu điều kiện "ước chung lớn hơn 1". 15 Nên sửa và Góp ý 1 đến 17 của vòng 2 đã sửa; không sửa làm hỏng chỗ khác (LL-20): đã đọc cả chữ bị bỏ, số nào đổi thì note, hình, `done`, hình lời giải và recap đều theo. Máy kiểm: 13 recap section khớp từng chữ câu `rule`, 13 recap card trùng recap section; không còn "bé", "nhóm", "các số kia", "cơ số" trong bài và hình. Màu khái niệm nhất quán: ƯC teal, ƯCLN amber, số nguyên tố sky, thừa số nguyên tố blue, số mũ violet, phân số tối giản pink; đồ vật, chấm dải băng, "Còn thừa" dùng slate, lime; ô trống bảng thừa số là ô nét đứt, có hàng tiêu đề "Thừa số".

Không ghi lại (đã có trong `notebooks/backlogs/lesson-uoc-chung-uoc-chung-lon-nhat/task.md`): `sourceRef` section 5 không trỏ được trang bài Số nguyên tố; căn định nghĩa, cách viết phân tích và màu của section 5 với bài `so-nguyen-to` sau khi bài đó xuất bản; Góp ý 14 vòng 2 (câu số hoàn hảo đáp án "là").

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu kiểm tra `toi-gian-4-15`: đáp án là lựa chọn duy nhất bắt đầu bằng "Có" (LL-14)

- Vị trí: `$.exercises[62].options` (`ex.toi-gian-4-15`, `checkIds` của `section.phan-so-toi-gian`)
- Nguồn: Kiến thức nền (tiểu học); tr.38, 40 (kĩ năng nhận biết phân số tối giản)
- Vấn đề: ba nhiễu đều mở bằng "Không, vì …", đáp án là câu duy nhất "Có, vì …" (và cũng là câu dài nhất, nhắc lại luôn quy tắc ngay trên). Trẻ chọn được bằng cách loại ba câu "Không" mà không cần xét 4 và 15 có ước chung nào. Câu này do Góp ý 11 vòng 2 đề xuất ("đổi thành 4/15 có tối giản không") và bản sửa giữ đúng khuôn một "Có" ba "Không". Đáp án đúng duy nhất, nên không phải Nghiêm trọng.
- Sửa: đổi đề thành "Phân số này có là phân số tối giản không? Chọn câu trả lời có lý do đúng." và để hai lựa chọn "Có", hai lựa chọn "Không": "Có, vì tử và mẫu chỉ có ước chung là 1" (đúng); "Có, vì tử nhỏ hơn mẫu" (sai lý do: chọn nhầm tối giản là tử nhỏ hơn mẫu); "Không, vì tử và mẫu đều chia hết cho 2"; "Không, vì tử và mẫu đều chia hết cho 3". Bỏ "Không, vì tử nhỏ hơn mẫu" (không ai nghĩ vậy). Nấc 1 giữ `index: 1`.

### 2. Câu kho ôn `dem-uc-36-63` cùng ƯCLN 9 với câu luyện `chon-uc-18-27` của cùng card (LL-07)

- Vị trí: `$.exercises[37]` (`ex.dem-uc-36-63`, card `uc-tu-uclnn`); `$.exercises[36]` (`chon-uc-18-27`, luyện tập của `section.uc-tu-uclnn`)
- Nguồn: tr.38 ý 4, tr.39 câu 2.35
- Vấn đề: cả hai câu cho "Biết ƯCLN(…) = 9" rồi bắt xét các ước của 9. Câu luyện kết thúc bằng dòng "Đã chọn 3" (các ước 1, 3, 9); phiên ôn hỏi "bao nhiêu ước chung" đáp án 3, trẻ nhớ lại số 3 mà không phải liệt kê. Bản sửa Góp ý 6 vòng 2 tránh được ƯCLN 8 của câu kiểm tra nhưng rơi vào ƯCLN 9 của câu luyện (cặp 36, 63 không có ở nơi nào khác trong bài, nhưng ƯCLN thì có).
- Sửa: dùng ƯCLN khác 8, 9, 12, 15, 20 đã có ở section 8: "Biết ƯCLN(110, 130) = 10. Hai số 110 và 130 có bao nhiêu ước chung?" Đáp án 4 (các ước của 10 là 1, 2, 5, 10), `check` "4". Đã soát: cặp 110, 130 không có ở chỗ nào khác trong bài (`lesson.json`, `catalog.ts`).

## Góp ý

### 1. Section 10: câu nối "Vậy số bút trong một hộp là ước chung của 22 và 33" bị cắt đáy trên điện thoại

- Vị trí: `$.sections[9].blocks[0].children[1].caption` (hình `ds-22-33`, `section.bai-toan-uc`)
- Nguồn: —
- Vấn đề: bản sửa Nên sửa 12 vòng 2 đưa câu này vào caption xám của hình. Ở bước cuối của hình, thẻ cao hơn màn điện thoại, dòng thứ hai của caption nằm dưới thanh "Tiếp" (ảnh `phone/118-s10-01-block-end.png`); trên iPad vừa màn (`ipad/118`). Câu này nối truyện mua bút với "ước chung" trước màn quy tắc kế tiếp, nên đáng để trẻ đọc được. Do bố cục thẻ trên điện thoại, không phải định nghĩa nằm trong caption, nên chỉ là Góp ý.
- Sửa: đưa câu vào note (note thành ba câu, bỏ caption), hoặc rút note xuống "Hộp bút nào cũng có số bút như nhau, từ 2 bút trở lên. An mua trọn các hộp được 22 bút, Bình mua trọn các hộp được 33 bút." để thẻ vẫn vừa.

### 2. Ba chỗ còn dùng chung số giữa câu kiểm tra, luyện tập, kho ôn hoặc recap của cùng section (LL-07)

- Vị trí: `$.exercises[44]` (`but-vo-16-36`) với `$.exercises[38]` (`chia-nhom-16-28`); `$.exercises[41]` (`dia-10-35`) với `$.exercises[42]` (`dia-14-35`); `$.exercises[28]` (`chon-uclnn-42-70`) với `$.exercises[26]` (`tinh-uclnn-50-70`); `$.exercises[31]` (`uclnn-18-54-81`) với recap `bang-18-24-30-xong`
- Nguồn: tr.39 ví dụ 2
- Vấn đề: `but-vo-16-36` và `chia-nhom-16-28` cùng "16 cây bút chì", cùng "cô giáo" và cùng đáp án 4. `dia-10-35` (kiểm tra) và `dia-14-35` (luyện tập) cùng số 35, lại còn lấy đáp án 7 của câu luyện làm nhiễu "chỉ là ước của 35". `chon-uclnn-42-70` và `tinh-uclnn-50-70` cùng dòng "70 = 2 · 5 · 7". `uclnn-18-54-81` có dòng "18 = 2 · 3²" như dòng đầu bảng recap. Đáp án không lộ (ƯCLN khác nhau), nên chỉ là Góp ý.
- Sửa: tuỳ tác giả. Đổi 16 của `but-vo-16-36` sang một số chưa dùng (vd 12 bút chì và 30 quyển vở, đáp án 6, nhiễu 2, 3, 10 hoặc 15); đổi 35 của `dia-14-35` (vd 14 bánh quy và 21 cái kẹo, đáp án 7 nhưng không còn 35). Khi đổi, sửa cả hình gợi ý và lời giải `dia-14-35`.

### 3. Màn chạm `chon-dia-8-12` hứa "thấy số nhiều nhất" nhưng lời kết chưa nói

- Vị trí: hình `chon-dia-8-12`, trường `done` (`catalog.ts`); `$.sections[8].blocks[1].children[0].text`
- Nguồn: tr.39 ví dụ 2
- Vấn đề: note ghi "Tìm đủ các số này giúp bạn thấy số nhiều nhất là số nào", nhưng lời kết chỉ là "Bạn đã chọn đủ các số đĩa chia đều không thừa." Màn quy tắc kế tiếp lại dùng 18 và 30, không quay về 8 và 12, nên trẻ không được nối "2 và 4, nhiều nhất là 4" với quy tắc.
- Sửa: `done`: "Bạn đã chọn đủ các số đĩa chia đều không thừa. Nhiều nhất là 4 đĩa." (đúng với 8 quả táo và 12 quả lê).

### 4. Section 12: "Ngược lại" đứng trước ví dụ đạt 5/7

- Vị trí: `$.sections[11].blocks[1].children[1].text` (`section.phan-so-toi-gian`)
- Nguồn: —
- Vấn đề: thứ tự màn là quy tắc, phản ví dụ 2/8 ("Ngược lại, ƯC(2, 8) = …"), rồi mới tới hình 5/7. "Ngược lại" không có ví dụ đạt nào ngay trước để làm đối lập, trẻ có thể đọc thành phát biểu đảo của quy tắc.
- Sửa: bỏ "Ngược lại,", viết "Còn ƯC(2, 8) = {1; 2} có số 2 lớn hơn 1, nên phân số của Mai chưa tối giản."

### 5. Section 5: định nghĩa nói "chia hết", hình `sn-vi-du` nói "ước" (LL-05)

- Vị trí: `$.sections[4].blocks[0].children[0].text`; hình `sn-vi-du` (nhãn "7 chỉ có ước 1 và 7", "6 còn có ước 2 và 3, nên 6 không là số nguyên tố"); `$.sections[4].blocks[3].children[0].text`
- Nguồn: —
- Vấn đề: bản sửa vòng 2 đổi định nghĩa sang "chỉ chia hết cho 1 và cho chính nó" để khỏi chép sách; hình ngay dưới vẫn nói theo "ước". Hai cách nói cho cùng một điều kiện trên một màn.
- Sửa: nhãn hình thành "7 chỉ chia hết cho 1 và 7", "6 còn chia hết cho 2 và 3, nên 6 không là số nguyên tố".

### 6. `minutes` của section 11 còn 5 sau khi bỏ màn `hh-28`

- Vị trí: `$.sections[10].minutes` (`section.so-hoan-hao`)
- Nguồn: —
- Vấn đề: section chỉ còn 3 màn, như section 8 và 13 (`minutes` 4).
- Sửa: `minutes: 4`.

### 7. Chú thích cũ trong `logic.ts` nói "cơ số"

- Vị trí: `src/visuals/math/uoc-chung-uoc-chung-lon-nhat/logic.ts`, chú thích trên `texPower`
- Nguồn: —
- Vấn đề: chú thích ghi màu blue là của "cơ số"; bài đã đổi khái niệm blue thành "Thừa số nguyên tố" (LL-20).
- Sửa: "with the base painted blue (prime factor) and the exponent violet (exponent)".
