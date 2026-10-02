# Review: Tập hợp các số nguyên (`tap-hop-cac-so-nguyen`)

- Bài: `content/math/kntt/tap-hop-cac-so-nguyen/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: mọi section có mục đổi (12 section, gồm `sap-xep` và `liet-ke` mới tách, soát như bài mới)
- Nguồn đã đọc: `sources/math/tap-hop-cac-so-nguyen/` - sbt-p47, sbt-p48, sbt-p49, sbt-p111
- `content:check`: 0 lỗi, 1 cảnh báo của bài (95 id chưa có trong `ids.lock.json`, đúng với bài chưa duyệt)
- Đọc hiểu (Haiku): lượt 1 (cả bài, gồm câu hỏi) 123 / 44 / 0; lượt 2 trên 50 mục viết lại 44 / 6 / 0; lượt 3 trên 6 mục còn lại 0 / 6 / 0 (lí do chung: nhiều khái niệm mới, câu có hai ý); tệp `.shots/review/tap-hop-cac-so-nguyen/doc-hieu.md`, `doc-hieu-2.md`, `doc-hieu-3.md`. Sáu mục còn lại ghi ở Nên sửa 4 đến 7.
- `lesson:walk`: 0 FAIL sau khi thêm phần bài tập sách bài tập (13 section, iPad, điện thoại, iPad nằm ngang)
- Kết luận: Đã ghi reviewedHash (0 lỗi Nghiêm trọng)
- Bản đã review: `20be05332350d20e024fd35064c9008967dcc09782fc22be57b3eee6ec4ac24d` (`pnpm content:diff` so với bản này)

Vòng 2 có 1 Nghiêm trọng và 14 Nên sửa; tất cả đã hết, xác nhận bằng ảnh:
- Nghiêm trọng (hình gợi ý `nhiet-ke-goi-y`): ảnh `visual:shot` iPad và điện thoại cho thấy "Trên 0" ở đỉnh, "Dưới 0" ở đáy, dấu "?" hiện ở −2, không còn "2 °C"; bước cuối (−2 °C) bị ẩn. Test khoá: `shows the question mark of a hint on its last step, not the answer` và `never draws two texts beside the ruler at the same height` trong `tests/visuals/tap-hop-cac-so-nguyen.test.tsx`.
- Các mục cũ khác đã xử lý: `dem-buoc` làm lại theo từng khoảng, trục chỉ ghi 0 (mục 2); ví dụ đời sống cho `diem-bieu-dien`, `sap-xep`, `liet-ke` (mục 3); lý do `wrong` của `so-doi-cua-8` (4); `dien-so-lien-sau` có trục và định nghĩa trong đề (5); số câu ôn đã đổi (6, 13, 24); điểm chữ thập sky đã bỏ, có test `draws no cross` (7); nhãn mẹo "Tìm số đối" là "làm nhanh" (8); `chon-x-tan-cung-5` đổi cả hai cận (9); hai recap `liet-ke`, `sap-xep` lặp đủ quy tắc của mình sau khi tách section (10, 11); `explain` của `so-nho-nhat-trong-bon` (12); note `tap-hop-z` khớp hình (14); số trên thước nhiệt kế đạt 17 px, có test (15).
- Góp ý cũ đã xử lý: 16 (nhiễu "còn lại"), 17 (cá dưới mặt hồ, −36 và −52), 18 (`doc-diem-mnp`), 19, 21 (mục số viết bằng công thức), 22, 23 (hình `so-sanh-ab` có vòng O, không ghi số), 26, 27, 28 (điểm C, D), 29.
- Soát chép sách (LL-08) với tr.48, 49, 111 cho các câu đổi hay mới: `chon-do-sau-ca-8` (sách: 318 m dưới mực nước biển), `so-sanh-am-36-52` (sách: −387 và −378), `chon-x-tan-cung-5` (sách: tận cùng 2, −15 < x ≤ 32), `doc-diem-mnp`, `doc-diem-e`, `xep-nhiet-do-4-ngay`: số, nhân vật và lời đề khác sách, không câu nào trùng.
- Mẹo, thử trên số biên: `tim-so-doi` (7, −12, 0, 1, −1, 100, −100: đúng), `dem-buoc` (điểm tại −5, −1, 0, 1, 4: đúng), `so-sanh-hai-so-am` (−12 và −2, −3 và −7, −100 và −99, −1 và −10, −5 và −4: đúng), `xep-tu-be-den-lon` (−8, −3, 0, 1, 6; −4, −1, 0, 2; chỉ số dương; không có số 0: đúng). Hai mẹo `so-sanh-hai-so-am` (nghĩ nhiệt kế) và `xep-tu-be-den-lon` (bỏ dấu −) cùng dẫn tới một kết quả, không nói ngược nhau.
- Recap và note: recap của 12 section và 12 card lặp đúng câu `rule: true` (soát từng cặp), `explain` của `chon-tat-ca-duong`, `noi-nhom-so` đã theo cụm "và cứ thế tiếp".

## Vòng 4: lời đọc và video

Reviewer mới (Sonnet), chỉ phần đổi: 3 video (`nhiet-ke`, `truc-so`, `so-sanh`), 3 khối `video` đầu các phần `nhiet-do`, `truc-so`, `so-sanh-truc` và lời đọc giới thiệu. Kết quả: 0 Nghiêm trọng, 4 Nên sửa, 7 Góp ý; đã sửa 4 Nên sửa và 4 Góp ý, dựng lại cả 3 video, `pnpm video:check` ok.

- Lời đọc giới thiệu: Gemini hết hạn mức ở cả 2 khoá nên cả lời đọc được đọc lại bằng giọng VieNeu Hải Đăng (đúng cơ chế dự phòng, một lời đọc một giọng, `overview.narration.voice` ghi `local`); 12 câu, 47,3 giây, mọi câu từ 98,8% trở lên; "−5" ở mục tiêu cuối được đọc "âm năm".
- Số âm trong lời đọc: dấu − trước chữ số được đọc "âm" (`spokenNegatives` ở `video/lib/text.ts`, test `says each negative sign as one word joined to its number`); Whisper nghe đúng "âm 3", "âm 6" ở cả 3 video.
- Nên sửa đã xử lý: (1) vòng khoanh −3 của `nhiet-ke` chỉ hiện lúc đọc "âm", sau câu hỏi, không còn lộ đáp án; (2) "viết là −3" được đọc "viết là dấu trừ 3 và đọc là âm ba" (trường `say` cùng số chữ), tai nghe phân biệt cách viết với cách đọc; (3) nhãn cuối `so-sanh` dời lên y 436, nằm trên dải phụ đề; (4) câu mời thử "6 độ dưới 0" thành câu hỏi `ask`, `−6` chỉ hiện sau chữ "viết" của câu sau.
- Góp ý đã xử lý: nhãn trung tính dùng màu chữ thường (slate chỉ cho số 0); "Bạn cú dừng ở số −3"; nhãn "−3 · âm ba" hiện lúc đọc "âm"; dấu "?" của `truc-so` mờ xong trước khi nhãn "số dương" hiện.
- Góp ý giữ nguyên (không chặn): câu hỏi "số nào lớn hơn?" của `so-sanh` được trả lời sau 17 giây (kiến thức và thứ tự đúng); Whisper nghe "góc O" ở `truc-so` và "âm bà" ở câu cuối `so-sanh` (khớp 100% sau chuẩn hoá); hook của lời đọc giới thiệu kết bằng câu hỏi, quãng nghỉ sau đó 0,83 giây (lời đọc giới thiệu không có quãng `ask`).
- Đã kiểm và đúng: "âm ba", không câu nào đọc "trừ ba"; số dương bên phải, số âm bên trái; −3 nhỏ hơn 2; màu số dương lime, số âm pink, số 0 slate, điểm amber, số nhỏ hơn blue, số lớn hơn violet; 11, 12 và 10 câu, mỗi video có câu `ask` và 2 điểm dừng cuối một ý; clip đúng card `nhiet-do`, `truc-so`, `so-sanh-truc`.

## Vòng 5: video `so-doi` và `hai-so-am`

Reviewer mới (Sonnet), chỉ phần đổi: 2 video mới (`so-doi`, `hai-so-am`), 2 khối `video` đầu các phần `so-doi` và `hai-so-am`, 2 mục `videos[]` tương ứng; soát thêm note, recap, mẹo cùng section. Kết quả: 0 Nghiêm trọng, 3 Nên sửa (12 đến 14), 3 Góp ý (15 đến 17); đã sửa 3 Nên sửa và 2 Góp ý (15, 17), dựng lại cả hai video, `pnpm video:check` ok.

- Nhịp: `so-doi` 13 câu (46,97 giây), `hai-so-am` 13 câu (49,13 giây); câu thường dài nhất 10 chữ; mỗi video có câu `ask`, câu cuối không phải `ask`, mọi câu `rule` trừ câu cuối có `think`; chào "bạn" ở câu đầu; không có checkpoint trong `videos[]`; hình hiện ngay từ khung đầu (tiêu đề và biểu thức cạnh cú).
- Whisper: 13 câu mỗi video, mọi câu từ 97,5% trở lên. Nghe "âm bùn", "ấm 3", "Chơi âm 7", "Bỏ dấu chữ", "cốc ô", "bạn cứ": khớp sau chuẩn hoá, cùng kiểu đã giữ nguyên ở vòng 4, không chặn.
- Kiến thức đúng: số đối của 4, 3, 5 và 0 (số đối của 0 là chính nó); "−12 nhỏ hơn −2 vì bỏ dấu thì 12 lớn hơn 2", "−7 nằm thấp hơn −2 nên lạnh hơn". Lời khớp note, recap và mẹo `tim-so-doi`, `so-sanh-hai-so-am` của hai section: cùng một quy tắc, không nói trái nhau. Số âm đọc "âm", dấu − riêng đọc "dấu trừ" (`say` của 5 câu `hai-so-am`).
- Thứ tự hỏi rồi mới mở: đúng ở `hai-so-am` (câu hỏi 8,5 giây, câu trả lời 12 giây; câu hỏi thứ hai 31,2 giây, "12 lớn hơn 2" hiện 35,4 giây) và ở câu hỏi đầu của `so-doi` (nhãn "4 đơn vị" hiện lúc đọc 17,5 giây); lỗi ở câu hỏi thứ hai của `so-doi` ghi ở mục 12.
- Màu: số dương lime, số âm pink, số 0 slate, số đối sky, −7 và −12 blue, −2 violet ở các ô so sánh; ngoại lệ ở vòng khoanh nhiệt kế (mục 13). Dải dưới (y từ 540) trống ở cả hai video, chỉ có cú ở góc; không chữ bị cắt hay chồng; màn không trống khi chờ chữ.
- Clip: `so-doi` 12,752 đến 45,545 giây (card `so-doi`), `hai-so-am` 20,347 đến 47,721 giây (card `hai-so-am`), cuối clip trùng cuối lời nói; mp4, vtt, jpg có mặt, độ dài khớp `durationSec`.

- Đã xử lý vòng 5: (12, 14) câu hỏi thứ hai của `so-doi` đổi sang số đối của 2 (không trùng "Cùng làm" của số 3), lúc hỏi hình chỉ hiện "2 ↔ ?", "−2" và điểm −2 hiện đúng lúc đọc đáp án; (13) vòng khoanh nhiệt kế màu trung tính lúc hỏi, chỉ tô blue cho số nhỏ hơn và violet cho −2 lúc hiện ô so sánh; (15) màn cuối `so-doi` vẽ điểm 5, −5 và hai mũi tên, nhãn "cùng cách gốc O, ở hai bên gốc O"; (17) thuỷ ngân của `hai-so-am` tụt xuống −12 lúc đọc "Bỏ dấu trừ", không phải lúc hỏi. Whisper sau khi dựng lại: mọi câu từ 97,5% trở lên.
- Đọc hiểu (Haiku) trên lời hai video: `so-doi` 6 / 7 / 0, `hai-so-am` 5 / 7 / 2 (`.shots/review/tap-hop-cac-so-nguyen/doc-hieu-video-so-doi-hai-so-am.md`). Hai mục "Khó hiểu" là câu quy tắc "Số âm nào có số lớn hơn sau khi bỏ dấu − thì nhỏ hơn số âm kia" (nói ở `s03-bo-dau` và lặp ở `s05-nho`), chép nguyên văn từ note và recap của bài nên video không đổi được; cùng câu đã ghi ở Nên sửa 6 về chữ của bài. Các mục "Hiểu mơ hồ" là câu dẫn cần hình, hình đã đi kèm. Không chặn duyệt.
- Góp ý 16 giữ nguyên: "Bạn cú" là nhân vật dẫn của mọi video, note kể về con kiến là ví dụ riêng của section.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu luyện `doc-muc-nuoc` có cùng đáp án −2 và cùng bộ lựa chọn với câu kiểm tra `doc-diem-n`

- Vị trí: `$.exercises[28]` (`doc-muc-nuoc`, luyện tập của `diem-bieu-dien`), `$.exercises[22]` (`doc-diem-n`, kiểm tra cùng section) (LL-07)
- Nguồn: —
- Vấn đề: bản sửa mục 6 vòng 2 đổi tàu ngầm từ −3 sang −2 trong khi `doc-diem-n` đã có đáp án −2. Cả hai có đúng bốn lựa chọn −2, 2, −3, −1, chỉ khác hình (trục ngang và thước đứng). Bé làm xong câu kiểm tra có thể chọn lại −2 mà không cần đọc hình.
- Sửa: đổi tàu ngầm sang −4 (hình `muc-nuoc-tau-ngam` thước từ −4 đến 3, nên đổi `marks.at`, lựa chọn thành −4, 4, −3, −5), kèm `check.expr`, `explain` và `wrong`.

### 2. Câu kiểm tra `xep-nhiet-do-4-ngay` dùng lại số của hình màn quy tắc và của mẹo `sap-xep`

- Vị trí: `$.exercises[51].items` (`xep-nhiet-do-4-ngay`), hình `xep-hang` và `xep-hang-xong` (`$.sections[10].blocks[0]`, `$.sections[10].recap`), `$.sections[10].blocks[1].tex` (LL-07)
- Nguồn: —
- Vấn đề: hình quy tắc và recap vẽ −4, −1, 2, 4; mẹo ghi −9 < −6 < −4 < 0 < 3 < 8. Câu kiểm tra xếp −4, −1, 0, 2: ba số trùng hình vừa xem, mà chỉ cần xếp lại đúng thứ tự trên hình.
- Sửa: đổi bốn nhiệt độ của câu kiểm tra, ví dụ −6, −2, 1, 3 hay −7, −3, 0, 5; đổi `explain` và `tex` theo (tránh −4, −1, 2, 4 của hình và −9, −6, −4, 3, 8 của mẹo).

### 3. Bản sửa đổi nửa chừng "trước, sau" sang "bên trái, bên phải": `dien-truoc-sau` hỏi từ mà quy tắc và recap của section không còn dùng

- Vị trí: quy tắc và recap `$.sections[7]` (`so-sanh-truc`), `$.exercises[36]` (`dien-truoc-sau`, ngân hàng "trước, sau"), `$.exercises[37].explain` (`chon-so-sanh-sai`: "Điểm nằm sau biểu diễn số lớn hơn"), `$.exercises[34].explain.wrong[0]` (`chon-so-sanh-dung-4-1`: "nằm sau −4" cạnh "ở bên trái" trong `explain.text`), `$.sections[8].blocks[0]` (quy tắc "nằm trước số 0" còn cùng làm ngay sau nói "bên trái") (LL-05, LL-20)
- Nguồn: tr.47 ý 5, 6
- Vấn đề: vòng này quy tắc `so-sanh-truc` được viết lại chỉ còn "bên trái, bên phải". Điểm nối "trước = bên trái, sau = bên phải" chỉ nằm ở màn quy tắc của `truc-so`, cách bốn section. Câu `dien-truoc-sau` bắt điền "trước, sau" cho một section mà quy tắc, recap không có hai từ này; `explain` trong cùng section lúc "bên trái", lúc "nằm sau".
- Sửa: chọn một cặp từ cho `so-sanh-truc` và `am-khong-duong`. Hoặc đổi `dien-truoc-sau` thành "Điểm −5 ở bên ___ điểm 1, nên −5 ___ 1" (ngân hàng "trái, phải, nhỏ hơn, lớn hơn") và `explain` các câu còn lại sang "bên trái, bên phải"; hoặc thêm vào quy tắc `so-sanh-truc` một vế "bên trái cũng gọi là nằm trước".

### 4. Đọc hiểu lượt 3: `overview.summary` còn "Hiểu mơ hồ" (lí do Haiku: quá nhiều khái niệm mới)

- Vị trí: `$.overview.summary` (LL-25)
- Nguồn: —
- Vấn đề: "Bài này dạy số âm và các số nguyên. Bạn tìm chỗ của chúng trên trục số. Sau đó bạn so sánh và sắp xếp chúng." Bé chưa biết "trục số", "số nguyên" nên câu chỉ nêu tên chưa nêu việc làm được. Không chặn duyệt.
- Sửa: nối với điều bé đã biết, ví dụ "Bài này dạy các số nhỏ hơn 0, như −3 độ C. Bạn sẽ xếp chúng lên một đường thẳng, rồi biết số nào lớn hơn, số nào nhỏ hơn."

### 5. Đọc hiểu lượt 3: màn mở đầu `tap-hop-z` còn "Hiểu mơ hồ" (từ "thuộc", cần hình)

- Vị trí: `$.sections[3].blocks[0].children[0].text` (LL-25)
- Nguồn: tr.47 ý 2
- Vấn đề: "Mỗi số nguyên thuộc đúng một trong ba nhóm…" dùng "thuộc" trước khi màn sau dạy dấu ∈, và nhắc "số nguyên" khi bé chưa có định nghĩa. Không chặn duyệt.
- Sửa: "Các số này chia làm ba nhóm: số nguyên âm, số 0 và số nguyên dương. Mỗi hàng của hình là một nhóm."

### 6. Đọc hiểu lượt 3: câu định nghĩa tập hợp ℤ ở note, recap section và recap card còn "Hiểu mơ hồ"; recap không nhắc tên ba nhóm

- Vị trí: `$.sections[3].blocks[1].children[0].text`, `$.sections[3].recap.caption`, `$.cards[3].recap.caption` (LL-25, LL-06)
- Nguồn: tr.47 ý 2
- Vấn đề: "Gộp ba nhóm đó lại thành một nhóm lớn. Nhóm lớn này là tập hợp các số nguyên, viết gọn là ℤ." Hai ý trong một câu; "ba nhóm đó" chỉ hiểu nhờ câu trước, mà màn "Nhớ nhé!" chỉ có câu này và hình. Cả ba chỗ là một câu nên sửa cùng lúc. Không chặn duyệt.
- Sửa: "Số nguyên âm, số 0 và số nguyên dương gộp lại là tập hợp các số nguyên, viết gọn là ℤ." (đổi cả ba chỗ giống nhau).

### 7. Đọc hiểu lượt 3: mẹo `dem-buoc` còn "Hiểu mơ hồ" (câu dài, nhiều từ mới)

- Vị trí: `$.sections[5].blocks[2].text` (`tip.dem-buoc`) (LL-25)
- Nguồn: —
- Vấn đề: một mẹo gồm ba câu, câu đầu có hai ý và câu thứ hai nói "khoảng" rồi "vạch". Không chặn duyệt.
- Sửa: "Muốn biết điểm là số nào, đếm các khoảng từ gốc O tới điểm đó. Đếm khoảng, đừng đếm vạch. Điểm ở bên trái O thì số có dấu −."

### 12. (vòng 5) Video `so-doi`: đáp án −3 hiện trên màn từ lúc hỏi, 4,5 giây trước khi được đọc

- Vị trí: `video/projects/tap-hop-cac-so-nguyen/so-doi/index.html` (cảnh `s03-thu`, ô `pair` "3 ↔ −3"), câu `ask` "Thử nhé: số đối của 3 là số nào?" (28,9 đến 31,6 giây), câu đáp án "Số đối của 3 là −3." (32,5 giây) (LL-02, LL-11)
- Nguồn: —
- Vấn đề: khung giây 28 và 30 của contact sheet (f-014, f-015) đã có ô hồng "−3" cạnh "3". Bé chưa kịp nghĩ đã đọc được đáp án; hai điểm của trục chỉ hiện ở giây 32, nên chữ hiện trước hình.
- Sửa: lúc hỏi chỉ hiện "3 ↔ ?" (trục chỉ có điểm 3 hoặc không có điểm), đổi "?" thành "−3" và hiện điểm −3 đúng lúc đọc "−3" (khoảng 33 giây).

### 13. (vòng 5) Video `hai-so-am`: hai vòng khoanh trên nhiệt kế cùng màu blue, −2 (số lớn hơn) lẽ ra là violet

- Vị trí: `video/projects/tap-hop-cac-so-nguyen/hai-so-am/index.html` (`ring("r2", -2, "blue")`, `ring("r7", -7, "blue")`, `ring("r12", -12, "blue")`), các khung f-003 đến f-023 (LL-03)
- Nguồn: —
- Vấn đề: màu blue chỉ số nhỏ hơn, violet chỉ số lớn hơn. Từ giây 6 đến 36 vòng khoanh −2 màu blue trong khi các ô so sánh cùng video tô −2 violet, nên cùng một số hai màu. Đổi ngay −2 sang violet và −7 sang blue lúc hỏi lại lộ đáp án.
- Sửa: vòng khoanh màu trung tính (màu chữ thường) lúc hỏi; chỉ tô −7 hay −12 blue và −2 violet đồng thời với ô "−7 < −2" (giây 18) và "−12 < −2" (giây 38).

### 14. (vòng 5) Video `so-doi` hỏi lại đúng ví dụ của câu "Cùng làm" liền sau

- Vị trí: câu `ask` "Thử nhé: số đối của 3 là số nào?" trong `video/projects/tap-hop-cac-so-nguyen/so-doi/script.json`, `$.sections[6].blocks[3]` ("Cùng làm: chạm vào số đối của 3", hình `chon-doi-3`) (LL-07)
- Nguồn: —
- Vấn đề: bé nghe video đọc "số đối của 3 là −3" rồi gặp lại câu chạm vào số đối của 3 ngay trong section, không cần nghĩ. Số 4 và 5 của video thì khớp note và quy tắc nên không sao.
- Sửa: đổi ví dụ "Thử nhé" của video sang một số chưa dùng trong section và bài tập số đối (tránh 3, 4, 5, 8, 13, 15), ví dụ 6; sửa các hình và câu đáp án theo.


## Góp ý

### 8. Số đối nói ba cách

- Vị trí: quy tắc `$.sections[6].blocks[1]` ("cách gốc O bằng nhau nhưng ở hai bên gốc O"), `$.exercises[31].explain.text` và `wrong[0]` (`chon-cap-so-doi`: "cách đều gốc O", "không cách đều"), `$.exercises[30].prompt[0]` (`noi-so-doi`: "ở bên kia gốc O và cách O bằng nhau") (LL-05)
- Nguồn: —
- Vấn đề: quy tắc được viết lại vòng này nhưng `explain` của `chon-cap-so-doi` vẫn theo bản cũ. Ý không sai.
- Sửa: dùng cụm "cách gốc O bằng nhau, ở hai bên gốc O" ở `explain` và `wrong`.

### 9. `dat-ba-diem` lặp −4 của màn cùng làm cùng section

- Vị trí: `$.exercises[27]` (`dat-ba-diem`: −4, −2, 3), `$.sections[5].blocks[1]` (cùng làm: C tới −4, D tới 2) (LL-07)
- Nguồn: —
- Vấn đề: chỉ trùng một số; bé gặp −4 ở màn cùng làm rồi lại ở câu ôn.
- Sửa: đổi `dat-ba-diem` sang −3, −1, 4 hay đổi cùng làm sang −5.

### 10. Tên section `diem-bieu-dien` trùng tên mẹo `dem-buoc`

- Vị trí: `$.sections[5].title`, `$.sections[5].blocks[2].title` ("Điểm trên trục số là số nào")
- Nguồn: —
- Vấn đề: hai tiêu đề giống hệt, bé không phân biệt đâu là mẹo.
- Sửa: tên mẹo nêu dạng việc, ví dụ "Đếm khoảng để đọc điểm".

### 11. Hai việc của app còn mở từ vòng 2

- Vị trí: `src/visuals/shared/number-line.tsx` (mũi tên ở cả hai đầu trục số, khác Hình 3.1 tr.49), bố cục iPad nằm ngang (trục số chỉ chiếm khoảng một phần ba bề ngang thẻ)
- Nguồn: tr.49 Hình 3.1
- Vấn đề: do app, không do nội dung bài.
- Sửa: báo người làm app (chỉ vẽ mũi tên chiều dương; hình giãn theo bề ngang thẻ).

### 15. (vòng 5) Video `so-doi`: màn cuối vẽ quy tắc mà không có hình của quy tắc

- Vị trí: `video/projects/tap-hop-cac-so-nguyen/so-doi/index.html` (cảnh `s04-nho`, nhãn "cùng cách gốc O, hai bên"), khung f-019 đến f-022 (38,6 đến 45,4 giây)
- Nguồn: —
- Vấn đề: lời nói "như 5 và −5" nhưng trục chỉ có điểm 0, không có điểm 5 và −5 như các cảnh trước; nhãn kết thúc ở "hai bên", cụt so với "hai bên gốc O" của lời nói. Cũng vậy lúc đọc quy tắc đầu (20 đến 25 giây): lời nói 5 và −5, hình còn 4 và −4. Không sai kiến thức.
- Sửa: vẽ hai điểm 5 và −5 cùng hai mũi tên "5 đơn vị" ở màn cuối, nhãn "cùng cách gốc O, ở hai bên gốc O".

### 16. (vòng 5) Video `so-doi` kể về bạn cú, note ngay dưới kể về con kiến

- Vị trí: `video/projects/tap-hop-cac-so-nguyen/so-doi/script.json` ("Bạn cú đứng ở gốc O", "Bạn cú đi sang phải 4 đơn vị"), `$.sections[6].blocks[1].children[0].text` ("Con kiến đứng ở gốc O…"), hình `kien-4`
- Nguồn: —
- Vấn đề: cùng một tình huống đi 4 đơn vị sang hai bên, video đặt cho cú, note đặt cho kiến; trên màn cú đứng ở góc, chấm đi thay cú. Bé có thể tưởng là hai chuyện.
- Sửa: lời video nói "Một chấm đứng ở gốc O", hoặc đổi note thành "Chấm đứng ở gốc O" (và `kien-4`) nếu giữ cú làm người kể.

### 17. (vòng 5) Video `hai-so-am`: thủy ngân tụt xuống −12 trong lúc hỏi

- Vị trí: `video/projects/tap-hop-cac-so-nguyen/hai-so-am/index.html` (cảnh `s04-thu`), câu `ask` "Thử nhé: −12 và −2, số nào nhỏ hơn?" (31,2 đến 34,4 giây), khung f-016 (giây 32)
- Nguồn: —
- Vấn đề: cột thủy ngân hạ xuống −12 giữa lúc hỏi, bé nhìn thấy −12 thấp hơn trước khi nghe câu "Bỏ dấu −". Kiến thức và thứ tự lời nói đúng; chỉ là gợi ý hơi sớm.
- Sửa: hạ thủy ngân cùng lúc đọc "Bỏ dấu trừ" (khoảng 35,4 giây) hay lúc đọc "Vậy −12 nhỏ hơn −2" (38,6 giây).

## Vòng 6 và 7: phần bài tập sách bài tập (section cuối, 19 câu)

Bài đã xuất bản được thêm một section cuối `bookPractice` ("Bài tập sách bài tập"): 8 câu sách (SBT 3.1, 3.2, 3.3, 3.4, 3.5a, 3.5b, 3.6, 3.7, đủ mọi bài tập và mọi ý của Bài 13 ở tr.48-49), 11 câu dẫn (`leadsTo`), 4 khối "Nhắc lại" (lặp nguyên văn câu quy tắc của các section đã có), recap, 21 hình mới `sbt-*` (gồm hình tương tác `sbt-dat-sau-diem` của bài 3.4). Các section 1 đến 12, id, video, media không đổi.

Hai vòng chỉ soát phần mới (reviewer mới mỗi vòng, đọc ảnh `sbt-p47..p49`, `sbt-p111`, không dùng lớp chữ):
- Vòng 6 (Opus, soát đầy đủ phần mới): 1 Nghiêm trọng, 5 Nên sửa, 8 Góp ý. Đề 8 câu sách khớp từng chữ với ảnh; Hình 3.1 khớp (P -8, N -5, Q -3, M 2; chỉ ghi số 0 và 1; mũi tên ở đầu dương); 7 đáp án khớp tr.111; bài 3.4 sách không in đáp án nên tự giải (4, -4, -6, 6, -1, 1: đúng).
- Vòng 7 (Sonnet, chỉ phần đổi): 0 Nghiêm trọng, 0 Nên sửa, 4 Góp ý. Đề sách không câu nào bị sửa.

Đã sửa sau vòng 6:
- Nghiêm trọng (LL-14), `$.exercises[60]` `dan-rut-tien`: nhiễu -3 000 chỉ thiếu một chữ số 0 so với đáp án -30 000; đã bỏ, thêm lời `wrong` cho lựa chọn "0".
- Nên sửa: bốn `explain` dùng từ "phần số" chưa dạy và nói lại quy tắc theo cách khác (LL-05), nay nói theo quy tắc của section `hai-so-am`; khối "Nhắc lại cho bài 3.7" thiếu câu quy tắc, đã thêm nguyên văn; hình nhắc lại và recap đặt P, Q khác Hình 3.1 (LL-10), nay dùng hình `sbt-nhac-lai-diem` với điểm U, V; sáu chấm của hình bài 3.4 giãn ra như nằm trên các vạch -3 đến 2 và nhãn dính "-4-6" (LL-21), nay một đống từ 3 chấm cùng vạch trở lên vẽ thành một chấm không tên (`dotPlaces`, test `the places of the dots of a crowded line`).
- Góp ý đã nhận: lời `explain` bài 3.1, `tex` bài 3.3, lý do "từ -9" của câu dẫn tận cùng 4, số lặp giữa câu dẫn và hình gợi ý (LL-07), nấc 2 bài 3.4 lặp hình khối nhắc, cặp -5 312 và -5 231 thay cặp theo khuôn ví dụ 2c của sách (LL-08), quy ước "chữ số tận cùng của số âm" thêm vào khối nhắc cho bài 3.6 (LL-10), số 5 lặp giữa câu dẫn 3.4 và hình gợi ý (nay B ở 3), `wrong` cho lựa chọn "0".
- Còn mở (không chặn): (1) bài 3.4 sách không in lời giải; chủ dự án xác nhận đáp án tự giải. (2) Câu quy tắc so sánh hai số âm ở khối nhắc bài 3.7 vẫn được Haiku gắn "Hiểu mơ hồ": đó là đúng câu của section `hai-so-am` (một quy tắc một cách nói); muốn viết lại phải sửa cả section đó, recap, video, mẹo. (3) `dat-hai-diem-a-b` (section 8) dùng 4 và -1, hai số của bài 3.4: ngoài phạm vi.

Đọc hiểu (Haiku) trên chữ mới của section: lượt 1 (cả chữ mới) 75 / 4 / 0, 4 mục "Hiểu mơ hồ" là câu quy tắc so sánh số âm và ba `explain` bài 3.7 viết lại; lượt 2 trên 4 mục viết lại 0 / 4 / 0; lượt 3 2 / 2 / 0 (còn hai `explain` số lớn, sau đó viết lại bằng cặp số mới); sau review, lượt 4 trên 14 mục sửa 11 / 3 / 0 và lượt 5 trên 2 mục viết lại 1 / 1 / 0 (mục còn lại tham chiếu "sáu số dưới đây", đã viết lại bằng danh sách cụ thể). Tệp: `.shots/review/tap-hop-cac-so-nguyen/doc-hieu.md`, `doc-hieu-bai-tap-sach-2.md` đến `-5.md`; kết quả của hai vòng review: `bai-tap-sach-vong-1.md`, `bai-tap-sach-vong-2.md`.

Chỉnh sau vòng 7 để `lesson:walk` đạt 0 FAIL (đã duyệt lại, hash ở dòng "Bản đã review"): chấm tiến độ của phần 24 màn tràn ngang nên `SectionStepper` vẽ chấm nhỏ khi có hơn 10 màn; bỏ hai hình nấc 2 của bài 3.3 và 3.5 (nội dung gợi ý chiếm quá chỗ, nấc 2 dùng khung tô đậm hơn, nấc 3 vẫn có hình lời giải) và một nhiễu của bài 3.3 (còn năm số để nối); ba lựa chọn của bài 3.7 viết bằng chữ thay cho công thức cho vừa khung điện thoại (đề không đổi); `lesson:walk` không còn HEAD vào địa chỉ `blob:` của trình phát video.
