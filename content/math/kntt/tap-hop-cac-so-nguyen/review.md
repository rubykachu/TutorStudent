# Review: Tập hợp các số nguyên (`tap-hop-cac-so-nguyen`)

- Bài: `content/math/kntt/tap-hop-cac-so-nguyen/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: mọi section có mục đổi (12 section, gồm `sap-xep` và `liet-ke` mới tách, soát như bài mới)
- Nguồn đã đọc: `sources/math/tap-hop-cac-so-nguyen/` - sbt-p47, sbt-p48, sbt-p49, sbt-p111
- `content:check`: 0 lỗi, 1 cảnh báo của bài (95 id chưa có trong `ids.lock.json`, đúng với bài chưa duyệt)
- Đọc hiểu (Haiku): lượt 1 (cả bài, gồm câu hỏi) 123 / 44 / 0; lượt 2 trên 50 mục viết lại 44 / 6 / 0; lượt 3 trên 6 mục còn lại 0 / 6 / 0 (lí do chung: nhiều khái niệm mới, câu có hai ý); tệp `.shots/review/tap-hop-cac-so-nguyen/doc-hieu.md`, `doc-hieu-2.md`, `doc-hieu-3.md`. Sáu mục còn lại ghi ở Nên sửa 4 đến 7.
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/tap-hop-cac-so-nguyen/` (iPad, điện thoại, iPad nằm ngang)
- Kết luận: Đã ghi reviewedHash (0 lỗi Nghiêm trọng)
- Bản đã review: `eac21fceadc1fa39d1b19499633445a8208f0227a1c1ff9710830eb053f6a2ec` (`pnpm content:diff` so với bản này)

Vòng 2 có 1 Nghiêm trọng và 14 Nên sửa; tất cả đã hết, xác nhận bằng ảnh:
- Nghiêm trọng (hình gợi ý `nhiet-ke-goi-y`): ảnh `visual:shot` iPad và điện thoại cho thấy "Trên 0" ở đỉnh, "Dưới 0" ở đáy, dấu "?" hiện ở −2, không còn "2 °C"; bước cuối (−2 °C) bị ẩn. Test khoá: `shows the question mark of a hint on its last step, not the answer` và `never draws two texts beside the ruler at the same height` trong `tests/visuals/tap-hop-cac-so-nguyen.test.tsx`.
- Các mục cũ khác đã xử lý: `dem-buoc` làm lại theo từng khoảng, trục chỉ ghi 0 (mục 2); ví dụ đời sống cho `diem-bieu-dien`, `sap-xep`, `liet-ke` (mục 3); lý do `wrong` của `so-doi-cua-8` (4); `dien-so-lien-sau` có trục và định nghĩa trong đề (5); số câu ôn đã đổi (6, 13, 24); điểm chữ thập sky đã bỏ, có test `draws no cross` (7); nhãn mẹo "Tìm số đối" là "làm nhanh" (8); `chon-x-tan-cung-5` đổi cả hai cận (9); hai recap `liet-ke`, `sap-xep` lặp đủ quy tắc của mình sau khi tách section (10, 11); `explain` của `so-nho-nhat-trong-bon` (12); note `tap-hop-z` khớp hình (14); số trên thước nhiệt kế đạt 17 px, có test (15).
- Góp ý cũ đã xử lý: 16 (nhiễu "còn lại"), 17 (cá dưới mặt hồ, −36 và −52), 18 (`doc-diem-mnp`), 19, 21 (mục số viết bằng công thức), 22, 23 (hình `so-sanh-ab` có vòng O, không ghi số), 26, 27, 28 (điểm C, D), 29.
- Soát chép sách (LL-08) với tr.48, 49, 111 cho các câu đổi hay mới: `chon-do-sau-ca-8` (sách: 318 m dưới mực nước biển), `so-sanh-am-36-52` (sách: −387 và −378), `chon-x-tan-cung-5` (sách: tận cùng 2, −15 < x ≤ 32), `doc-diem-mnp`, `doc-diem-e`, `xep-nhiet-do-4-ngay`: số, nhân vật và lời đề khác sách, không câu nào trùng.
- Mẹo, thử trên số biên: `tim-so-doi` (7, −12, 0, 1, −1, 100, −100: đúng), `dem-buoc` (điểm tại −5, −1, 0, 1, 4: đúng), `so-sanh-hai-so-am` (−12 và −2, −3 và −7, −100 và −99, −1 và −10, −5 và −4: đúng), `xep-tu-be-den-lon` (−8, −3, 0, 1, 6; −4, −1, 0, 2; chỉ số dương; không có số 0: đúng). Hai mẹo `so-sanh-hai-so-am` (nghĩ nhiệt kế) và `xep-tu-be-den-lon` (bỏ dấu −) cùng dẫn tới một kết quả, không nói ngược nhau.
- Recap và note: recap của 12 section và 12 card lặp đúng câu `rule: true` (soát từng cặp), `explain` của `chon-tat-ca-duong`, `noi-nhom-so` đã theo cụm "và cứ thế tiếp".

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
