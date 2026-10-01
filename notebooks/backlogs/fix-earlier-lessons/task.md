# Sửa các lỗi còn mở của bài đã xuất bản

Chủ dự án yêu cầu sửa các phát hiện review còn mở (Nên sửa, Góp ý, "Để lại", "Còn lại", "Chưa sửa") của các bài đã xuất bản trước. Nguồn kiểm kê: `review.md` của từng bài và bàn giao `notebooks/backlogs/lesson-<slug>/task.md` (bài `phep-cong-phep-tru` ở `archive/`). Mỗi mục đã đối chiếu với `lesson.json` hiện tại: mục đã sửa từ trước (explain của `so-nguyen-to` và `uoc-chung-uoc-chung-lon-nhat` ở vòng cuối) không còn trong danh sách.

Phạm vi sửa lần này: chữ và hình trong `lesson.json` hoặc thư mục visual riêng của bài, không cần lời đọc hay video mới. Không đổi id đã khoá, không đụng `on-tap-chuong-2`, `boi-chung-boi-chung-nho-nhat`, `video/**`, `public/media/**`, `src/` ngoài visual riêng của bài.

Quy trình mỗi bài đổi: commit `lesson.json` + `review.md` (đóng dấu bản đã review) trước khi sửa, sửa, `pnpm content:diff <slug>`, một reviewer Sonnet vòng chỉ phần đổi, sửa Nghiêm trọng, `pnpm content:hash <slug> --approve`, `pnpm content:lock <slug>`, rồi `pnpm content:check`, `pnpm lesson:walk <slug>`.

Cột "Quyết định": **sửa** = làm trong lần này; **bỏ** = không làm, kèm lý do. Cột "Kết quả" cập nhật khi xong.

## `tap-hop`

| Mục | Vấn đề | Quyết định | Kết quả |
|---|---|---|---|
| tap-hop#1 | Recap xét thuộc "Có trong A thì x ∈ A, không có thì x ∉ A." ngắt "A." xuống dòng riêng trên điện thoại | đã sửa từ trước: kí hiệu và tên tập hợp đã nối bằng khoảng trắng không ngắt, không làm gì thêm | đã xong từ trước |
| tap-hop#2 | `kt-dau-giua`: "3, 8 và 10" có dấu phẩy ngay trong câu hỏi về dấu viết giữa hai số | sửa |  đã sửa, review vòng 9 đạt, đã duyệt |
| tap-hop#3 | Định nghĩa dấu hiệu đặc trưng nói "số khác", chỉ hợp với tập số; "Nó viết sau" thiếu "được" | sửa (note, caption section và recap card) |  đã sửa, review vòng 9 đạt, đã duyệt |
| tap-hop#4 | Hình `cham-dau-hieu` trên iPad tách tập hợp thành hai dòng, dồn trái | bỏ: lỗi bố cục theo thiết bị, cần chỉnh và xem ảnh iPad riêng | |
| tap-hop#5 | Mục "Chú ý" (kí hiệu ℕ, viết gọn {x ∈ ℕ \| …}) chưa có trong bài | bỏ: nội dung mới cần cách đọc, ví dụ và câu luyện | |
| tap-hop#6 | Bài 1.6, 1.7 của sách chưa lấy (phân số, 2k + 1) | bỏ: chương chưa dạy phân số, 2k + 1 cần biến k | |
| tap-hop#7 | Dấu ; xuất hiện ở ví dụ section ngoặc nhọn trước khi section dấu chấm phẩy dạy nó | bỏ: phải dựng lại ví dụ của nhiều hình, không chỉ đổi chữ | |
| tap-hop#8 | 9 cảnh báo `[guides]` (match, manipulate, order): thiếu màn hướng dẫn thao tác | bỏ: cần màn và hình hướng dẫn mới, là mục riêng của hàng đợi chung | |
| tap-hop#9 | Recap 7 section không lặp nguyên văn note, chưa đánh `rule` | bỏ: đổi câu quy tắc kéo theo lời video | |
| tap-hop#10 | Lời đọc tổng quan chưa dựng lại được (không có mô hình giọng, không có mạng) | bỏ: dựng media | |
| tap-hop#11 | 3 Góp ý của vòng 8 về video `thuoc-khong-thuoc` (chữ C "quay sang phải", phụ đề ngắt giữa từ, chấm số bị cắt) | bỏ: video và công cụ video | |
| tap-hop#12 | Chip điền `RichText` và ô trống `fillBlank` rộng 80px | bỏ: việc của app | |

## `phep-cong-phep-tru`

| Mục | Vấn đề | Quyết định | Kết quả |
|---|---|---|---|
| phep-cong-phep-tru#1 | Dữ kiện "lớp vào học lúc 7 giờ 30 phút" chỉ nằm ở caption xám của màn đầu `toan-thoi-gian` | sửa: đưa vào một note |  đã sửa, review vòng 6 đạt (0 Nghiêm trọng), đã duyệt |
| phep-cong-phep-tru#2 | Số gần trùng giữa các câu: `chon-gio-di` và `tim-gio-xuat-phat` cùng đáp án 7 giờ 45; `cot-tru-hang-chuc` (541 − 246) gần ví dụ 532 − 247; `dien-them-bot` (47 + 26) gần hình gợi ý 47 + 25 | sửa cả ba |  đã sửa, review vòng 6 đạt (0 Nghiêm trọng), đã duyệt; còn Góp ý nhỏ: đáp án 35 của `dien-them-bot` trùng số hạng 35 của `tinh-them-bot-2` |
| phep-cong-phep-tru#3 | Câu quy tắc mượn dài; "chữ số cuối của kết quả" ở `dat-tinh-cong` dễ lẫn | bỏ: là câu `rule` chép nguyên văn trong kịch bản video | |

## `phep-nhan-phep-chia`

| Mục | Vấn đề | Quyết định | Kết quả |
|---|---|---|---|
| phep-nhan-phep-chia#1 | Nhiễu d của `chon-tich-rieng-2` ("Viết 19, nhớ 2 sang cột bên trái") là lựa chọn duy nhất không mở đầu bằng "Viết 192", đoán được bằng mẹo | sửa: "Viết 192, lùi sang trái hai cột" |  đã sửa, review vòng 6 đạt (0 phát hiện), đã duyệt |
| phep-nhan-phep-chia#2 | `so-sanh-38-50`: chưa có hình gợi ý nấc 2 (hình từng bước chỉ vẽ chuỗi "=") | bỏ: cần loại hình so sánh mới | |
| phep-nhan-phep-chia#3 | "thừa số", "tích" dùng ở section 3 trước khi nhắc lại | bỏ: là câu quy tắc, đổi kéo theo `[rule-sentence]` và lời đọc | |
| phep-nhan-phep-chia#4 | "1 000" và "1000" trong hình; phím "mũ"; `h-visual-frame` của `visual:shot` | bỏ: việc của app dùng chung | |
| phep-nhan-phep-chia#5 | `chon-nhieu-them-1` bốn lựa chọn dài | bỏ: luật "chọn nhiều" của skill đòi 4 lựa chọn | |
| phep-nhan-phep-chia#6 | Số nhớ xếp hai tầng ở `col-mul-figure.tsx`, cỡ chữ hình cùng làm trên iPad ngang | bỏ: đổi bố cục hình tốn công, chưa có reviewer nào chặn | |
| phep-nhan-phep-chia#7 | `mua-vo-100-12`, `xep-xe-50-12` đặt sẵn đủ ô; màu glossary dùng chung (xanh, hổ phách) | bỏ: viết lại `pack.tsx`, glossary chung kéo theo mọi bài Toán | |

## `luy-thua`

| Mục | Vấn đề | Quyết định | Kết quả |
|---|---|---|---|
| luy-thua#1 | Màn `guide: numericPower` ở section `co-so-so-mu` nằm sau câu nhập luỹ thừa đầu tiên (cảnh báo `[guides]`) | bỏ: chuyển lên section đầu làm dùng "cơ số", "số mũ" trước khi dạy; cần màn hướng dẫn mới, chủ dự án quyết | |
| luy-thua#2 | Recap section `chia-cung-co-so` thiếu câu "Số mũ thứ nhất phải lớn hơn hoặc bằng số mũ thứ hai" của note | sửa |  đã sửa, review vòng 14 đạt (0 Nghiêm trọng), đã duyệt |
| luy-thua#3 | Lựa chọn 2³ của `chon-co-so-2` trùng trạng thái đầu của hình `tao-luy-thua` | sửa: 2⁹ và 9² |  đã sửa, review vòng 14 đạt (0 Nghiêm trọng), đã duyệt |
| luy-thua#4 | Câu kiểm tra `viet-4-mu-3`, `viet-1000`, `chon-2-mu-7` có đáp án nằm sẵn trên màn giải thích | bỏ: câu kiểm tra không tính điểm nhớ, tác giả đã chọn giữ | |
| luy-thua#5 | Hình gợi ý nấc 2 của `tach-5-247` chỉ còn một bước tới đáp án | bỏ: dựng hình gợi ý mới | |
| luy-thua#6 | Hạt gạch khó đọc (`bead-group.tsx` dùng chung); khung `fillBlank` ngắt dòng; chữ số mũ Unicode nhỏ; nấc 1 tô cả đề | bỏ: việc của app hoặc visual dùng chung; nấc 1 tô cả đề là quy ước cho phép | |
| luy-thua#7 | Câu "nhà vua không có đủ để thưởng" nhắc nhà vua trước khi kể; ảnh bìa video che công thức; `minutes` chưa tính video | bỏ: sửa phải đổi video, hoặc cần chốt luật | |
| luy-thua#8 | Recap `luy-thua-la-gi` chèn "(đọc là “a mũ n”)" nên note chưa đánh `rule` | bỏ: đánh `rule` kéo theo lời video | |
| luy-thua#9 | Cảnh báo `[guides]` match, order | bỏ: cùng mục tap-hop#8 | |

## `thu-tu-thuc-hien-phep-tinh`

| Mục | Vấn đề | Quyết định | Kết quả |
|---|---|---|---|
| thu-tu-thuc-hien-phep-tinh#1 | mp4 `hoa-don` vẫn khoanh hồng cách làm sai của Lan | bỏ: dựng lại video | |
| thu-tu-thuc-hien-phep-tinh#2 | Whisper nghe méo "ngoặc vuông", "ngoặc nhọn" ở video `ngoac-long` | bỏ: âm thanh, chủ dự án nghe | |
| thu-tu-thuc-hien-phep-tinh#3 | Nhãn cột sai của `tong-hop-dong-viet-lai` là "Sai: cộng trước" | sửa: "Sai: làm 5 + 3 trước" |  đã sửa, review vòng 7 đạt (0 Nghiêm trọng), đã duyệt |
| thu-tu-thuc-hien-phep-tinh#4 | Caption câu chuyện mua quà (ngoặc lồng) không nói 32 là số tiền gì | sửa |  đã sửa, review vòng 7 đạt (0 Nghiêm trọng), đã duyệt |
| thu-tu-thuc-hien-phep-tinh#5 | `chon-nhieu-luy-thua-truoc` có lựa chọn `(1 + 2) · 3²` cần biết ngoặc trước luỹ thừa | sửa: đổi lựa chọn |  đã sửa, review vòng 7 đạt (0 Nghiêm trọng), đã duyệt; còn Góp ý: ba nhiễu của câu này đều không có luỹ thừa |
| thu-tu-thuc-hien-phep-tinh#6 | Hình gợi ý `tim-x-1-goi-y`, `tim-x-2-goi-y` dùng đẳng thức không có nghiệm tự nhiên | sửa |  đã sửa, review vòng 7 đạt (0 Nghiêm trọng), đã duyệt |
| thu-tu-thuc-hien-phep-tinh#7 | Chú thích màn cùng làm dùng "để tính ra nó", đọc vấp | sửa (6 caption) |  đã sửa, review vòng 7 đạt (0 Nghiêm trọng), đã duyệt |
| thu-tu-thuc-hien-phep-tinh#8 | `overview.summary` dài 3 câu, chưa nhắc biểu thức chứa chữ | bỏ: lời đọc tổng quan đọc đúng chữ này | |
| thu-tu-thuc-hien-phep-tinh#9 | Section `bieu-thuc-chu`, `tim-so-chua-biet` chưa có màn "cùng làm" | bỏ: cần visual tương tác mới | |
| thu-tu-thuc-hien-phep-tinh#10 | Bài 1.64a, 1.67 của sách: `expression.ts` chưa nhận luỹ thừa của nhóm ngoặc | bỏ: tính năng app | |
| thu-tu-thuc-hien-phep-tinh#11 | Nấc 1 câu tính dài tô cả biểu thức; hình gợi ý câu chạm phép tính cùng khung với đề | bỏ: cần `\htmlId` từng phép và dựng lại hình | |
| thu-tu-thuc-hien-phep-tinh#12 | Hình `nhan-chia-on`, bảng nhân, tách chục tô khác kiểu "Kết quả"; màu violet trùng "số mũ"; phím "mũ"; kho ôn số gần ví dụ; `tim-x-kiem-tra-giai` lặp dòng | bỏ: dựng lại hình, glossary chung, việc của app, hoặc quá chung để sửa | |
| thu-tu-thuc-hien-phep-tinh#13 | Recap `dau-phep-tinh`, `hon-hop`, `ngoac-long`, card `tinh-day-du` chưa đánh `rule`; cảnh báo `[guides]` | bỏ: đánh `rule` kéo theo lời video; `[guides]` cùng tap-hop#8 | |

## `quan-he-chia-het-va-tinh-chat`

| Mục | Vấn đề | Quyết định | Kết quả |
|---|---|---|---|
| quan-he-chia-het-va-tinh-chat#1 | Hình gợi ý `so-du-goi-y-15-10` kết luận "chia hết cho 5" trong khi đáp án `dien-du-14-7` là "không chia hết" | sửa: hình gợi ý riêng cho `dien-du-14-7` |  đã sửa, review vòng 7 đạt (0 phát hiện), đã duyệt |
| quan-he-chia-het-va-tinh-chat#2 | Caption `tong-12-18-6` "xếp vừa các túi 6 cái" | sửa |  đã sửa, review vòng 7 đạt (0 phát hiện), đã duyệt |
| quan-he-chia-het-va-tinh-chat#3 | Màu "Số hạng" xanh dương trùng "Số bị chia", "Tổng" cam trùng "Thương" | bỏ: màu do glossary chung giữ, bài khác đang dùng | |
| quan-he-chia-het-va-tinh-chat#4 | `nhom-so-hang` thiếu tình huống đời sống | bỏ: không có tình huống tự nhiên | |
| quan-he-chia-het-va-tinh-chat#5 | Nấc 1 tô cả đề ở `tim-tui-40-16`, `mua-hop-10-20`, `du-tong-30-4`; card hiệu thêm "Hiệu" teal; chú giải "Thừa số" cho `tim-uoc-18` | bỏ: đề một khối, đã chốt giữ nguyên ở các vòng trước | |
| quan-he-chia-het-va-tinh-chat#6 | Chưa có video cho các section hiệu trở đi | bỏ: video | |

## `dau-hieu-chia-het`

| Mục | Vấn đề | Quyết định | Kết quả |
|---|---|---|---|
| dau-hieu-chia-het#1 | `hop-banh-tui` lặp khung hình ví dụ `hop-6-7` (cùng 7 hộp, mỗi hộp được 2 túi) | sửa: 5 hộp |  đã sửa, review vòng 8 đạt (0 Nghiêm trọng), đã duyệt; còn 2 Góp ý nhỏ về số trùng (tích 5 · 8 ở explain với nhiễu của `chon-tich-3`; đáp án 10 với recap) |
| dau-hieu-chia-het#2 | `lap-so-014` cùng đáp án 3 và cùng cách tách với hình ví dụ `lap-035` | bỏ: đổi bộ chữ số thì trùng đáp án 4 của `dem-so-124`, và id đã khoá | |
| dau-hieu-chia-het#3 | Màu amber dùng cho "Tích" và cho nhãn khác; xanh dương vừa là tổng đồ vật vừa là "Thừa số" | bỏ: hai nghĩa ở section khác nhau, không cùng màn | |
| dau-hieu-chia-het#4 | Whisper nghe "Đề cho số" thành "Đề chốt số" ở `tim-chu-so` | bỏ: âm thanh, chủ dự án nghe | |

## `so-nguyen-to`

| Mục | Vấn đề | Quyết định | Kết quả |
|---|---|---|---|
| so-nguyen-to#1 | Màn chạm `chon-nt-bang` (section 4) trùng bốn số và đáp án 23, 29 với `chon-nt-2-7` | sửa: 33, 37, 39, 45, 49, 73 (đáp án 37, 73) |  đã sửa, review vòng 7 đạt (0 phát hiện Nghiêm trọng, Nên sửa), đã duyệt (chips 33, 39, 45, 49, 73, 79; đáp án 73, 79) |
| so-nguyen-to#2 | `viet-28` có hai so sánh ("ít hơn" và "ít nhất") trong một câu hỏi | sửa phần chữ; giữ số 28 (id đã khoá, 28 còn ở `cay-thieu-28`, không đổi được id) |  đã sửa, review vòng 7 đạt (0 phát hiện Nghiêm trọng, Nên sửa), đã duyệt |
| so-nguyen-to#3 | Caption `xet-65` nêu dấu hiệu chia hết cho 2 chỉ bằng chữ xám, hình không có hàng | bỏ: hình là một chuỗi suy luận về số 65, thêm hàng 80 làm loãng chuỗi; dấu hiệu chia hết cho 2 đã học ở Bài 9 và reviewer xếp Góp ý | còn mở trong `review.md` |
| so-nguyen-to#4 | Note ngoại lệ (77) đứng trước hình 51 mà hai thứ không nối nhau | sửa |  đã sửa, review vòng 7 đạt (0 phát hiện Nghiêm trọng, Nên sửa), đã duyệt |
| so-nguyen-to#5 | `bang-100` trên iPad ngang: chữ khoảng 14,5px, dấu ✚ khoảng 5px do `max-h-[32vh]` | bỏ: nâng giới hạn có thể che dòng "Số 1", cần thử trên iPad; nút "Bảng số nguyên tố" dùng chung đã ở backlog app | |
| so-nguyen-to#6 | Video: 2 giây màn trống ở `phan-tich`, "4 bằng 2 nhân 2" chưa nói hợp số; chưa có video phần 7 và 10 đến 12 | bỏ: video | |
| so-nguyen-to#7 | Việc của app: bố cục màn khi bảng đẩy câu hỏi, chip section 9 xuống dòng lệch trái, dấu khái niệm trong nhãn | bỏ: việc của app | |

## `uoc-chung-uoc-chung-lon-nhat`

| Mục | Vấn đề | Quyết định | Kết quả |
|---|---|---|---|
| uoc-chung-uoc-chung-lon-nhat#1 | Phần bổ sung a = d·m, b = d·n, câu 2.41 đến 2.43, ví dụ 1 | bỏ: chủ dự án quyết định | |
| uoc-chung-uoc-chung-lon-nhat#2 | `cat-dai-bang`: chủ dự án nghe duyệt; hai video có khoảng trống 1 đến 1,5 giây ở cảnh cuối | bỏ: âm thanh, video | |
| uoc-chung-uoc-chung-lon-nhat#3 | Chú thích sơ đồ cột chưa có "Số mũ" violet ở dòng luỹ thừa (Bài 10 cũng vậy) | bỏ: hình dùng chung với Bài 10, sửa chung khi làm | |
| uoc-chung-uoc-chung-lon-nhat#4 | Câu số hoàn hảo đáp án "là" cần cộng 5 số hạng | bỏ: cố ý không làm (luật số nhỏ) | |

## `neu-cau-muon-co-mot-nguoi-ban`

| Mục | Vấn đề | Quyết định | Kết quả |
|---|---|---|---|
| neu-cau-muon-co-mot-nguoi-ban#1 | Note đầu section `so-sanh` có "SGK tr.26 cho biết…" | sửa: bỏ số trang khỏi lời cho trẻ |  đã sửa, review vòng 16 đạt (0 Nghiêm trọng), đã duyệt |
| neu-cau-muon-co-mot-nguoi-ban#2 | Hình `dan-y` và rubric bài viết nói "tiếng gió gợi nhớ bạn", văn bản chỉ nói cáo "thấy thích" tiếng gió | sửa |  đã sửa, review vòng 16 đạt (0 Nghiêm trọng), đã duyệt |
| neu-cau-muon-co-mot-nguoi-ban#3 | Bước `viet-buoc-cam-xuc` hỏi "Ngay sau khi chia tay" nhưng căn cứ là lúc sắp chia tay | sửa: "Lúc chia tay" |  đã sửa, review vòng 16 đạt (0 Nghiêm trọng), đã duyệt |
| neu-cau-muon-co-mot-nguoi-ban#4 | Đề `chon-tat-ca-loi-cao` gọi cả dòng có lời người kể là "lời thoại" | sửa: "Chọn tất cả câu cáo nói." |  đã sửa, review vòng 16 đạt (0 Nghiêm trọng), đã duyệt |
| neu-cau-muon-co-mot-nguoi-ban#5 | Hai id (`chon-tat-ca-loi-cao`, `chon-tat-ca-loi-dan`) chưa ghi vào `ids.lock.json` | sửa: `pnpm content:lock` sau khi duyệt |  đã sửa, review vòng 16 đạt (0 Nghiêm trọng), đã duyệt |
| neu-cau-muon-co-mot-nguoi-ban#6 | Câu 8 tr.26, câu 1 "Nghĩa của từ ngữ" (yếu tố "hoá"), bài đặt câu với "cốt lõi" chưa có | bỏ: nội dung mới | |
| neu-cau-muon-co-mot-nguoi-ban#7 | Câu kho ôn có đoạn trích dài phải cuộn trên điện thoại, walk không đi qua kho ôn | bỏ: việc của app và công cụ walk | |
| neu-cau-muon-co-mot-nguoi-ban#8 | Recap và `rule` gọi hoàng tử bé là "bạn" (cả kịch bản `bi-mat-cua-cao`) | bỏ: phải đổi kịch bản và dựng lại video | |
| neu-cau-muon-co-mot-nguoi-ban#9 | `overview.summary` câu 4 và 5 "Lúc chia tay", "Khi từ biệt" nghe như một lúc | bỏ: lời đọc tổng quan đọc đúng chữ này | |
| neu-cau-muon-co-mot-nguoi-ban#10 | Whisper nghe lệch ở `bi-mat-cua-cao`, `cam-hoa-la-gi`: chủ dự án nghe | bỏ: âm thanh | |
| neu-cau-muon-co-mot-nguoi-ban#11 | Recap `cao-xuat-hien`, `so-sanh`, `bi-mat`, `lap-lai` chưa đánh `rule` | bỏ: đánh `rule` kéo theo lời video | |

## Tiến độ

Cập nhật khi từng bài xong (commit, review, duyệt, khoá).

Kết quả 02/10/2026: 76 mục kiểm kê (có mục gộp nhiều chỗ nhỏ cùng loại): 23 sửa và đã duyệt, 1 đã sửa từ trước, 52 bỏ kèm lý do. Chín bài đổi (`tap-hop`, `phep-cong-phep-tru`, `phep-nhan-phep-chia`, `luy-thua`, `thu-tu-thuc-hien-phep-tinh`, `quan-he-chia-het-va-tinh-chat`, `dau-hieu-chia-het`, `so-nguyen-to`, `neu-cau-muon-co-mot-nguoi-ban`), mỗi bài một reviewer vòng chỉ phần đổi, 0 Nghiêm trọng, đã `content:hash --approve` và `content:lock`; `uoc-chung-uoc-chung-lon-nhat` không có mục nào sửa được. `content:check` 0 lỗi (9 cảnh báo `[guides]` có từ trước). `lesson:walk`: 0 lỗi ở tám bài; `phep-nhan-phep-chia` báo 4 lỗi "bottom bar covers" ở `tinh-tuan-ngay-correct` (iPad), cũng báo đúng như vậy ở bản trước mọi thay đổi này, nên không do lần sửa này; cần người giữ app xem lời giải `tinh-tuan-ngay` dưới thanh nút.
