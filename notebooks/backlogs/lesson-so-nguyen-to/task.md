# Bàn giao: Bài 10 `so-nguyen-to` (Số nguyên tố)

## Trạng thái
- Cập nhật cuối: 01/10/2026. Bài đã xuất bản (`status: published`) sau 3 vòng review (vòng 1: 9 Nghiêm trọng; vòng 2: 4; vòng 3: 0, 1 Nên sửa, 4 Góp ý); đã `content:hash --approve`, `content:lock`. Lời đọc và 3 video đã dựng và đã qua vòng 4 (chỉ phần đổi: câu chào, lời đọc, 3 video; 01/10/2026): 1 Nghiêm trọng, 2 Nên sửa, 1 Góp ý mới, đều đã sửa trừ Góp ý; đã `content:hash --approve`, 3 id video đã thêm vào `content/ids.lock.json`.
- Đã chạy ở bước xuất bản: `pnpm content:check` 0 lỗi; `pnpm lesson:walk so-nguyen-to` 0 lỗi, 0 cảnh báo; `pnpm lint`, `pnpm typecheck`, `pnpm test` (2 150 test) đạt; `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` ở cây chính.
- Bước kế tiếp: không còn việc chặn. Phần Nên sửa của vòng 3 và các Góp ý dưới đây gộp vào lần sửa bài kế tiếp (sửa bài đổi hash, cần review lại phần đổi); khi đó chạy lại `pnpm video:check so-nguyen-to`.

- 02/10/2026: đã thêm `explain` cho cả 65 câu (xoá khỏi `content/legacy-lessons.json`); review phần đổi vòng 5 (1 Nghiêm trọng đã sửa) và vòng 6 (0 Nghiêm trọng), đã `content:hash --approve`. Không đổi `videos[]` hay `overview.narration`.

## Việc còn lại sau review vòng 3 (không chặn)
- Đã sửa ở vòng 7 (02/10/2026): màn chạm `chon-nt-bang` (chips 33, 39, 45, 49, 73, 79), đề `viet-28`, note ngoại lệ trước hình 51. Còn mở (kiểm kê và lý do: `notebooks/backlogs/fix-earlier-lessons/task.md`): `bang-100` ở iPad ngang chữ khoảng 14,5px và dấu ✚ nhỏ do `max-h-[32vh]`; caption `xet-65` nêu dấu hiệu chia hết cho 2 chỉ bằng chữ xám.

## Đã sửa theo review vòng 1 và 2
- Định nghĩa số nguyên tố, hợp số, phân tích ra thừa số nguyên tố viết bằng lời của bài; nhãn kết luận của hình `xep-11` giữ điều kiện "lớn hơn 1"; hợp số luôn nói "từ ba ước trở lên"; số nguyên tố nối với "chỉ có hai ước" ở caption `ngto-dau`; số 1 luôn là "không phải số nguyên tố, cũng không phải hợp số".
- Không dùng số và hình của sách: hình quy tắc section 1 là 20 viên (`xep-20`, `xep-20-xong`), hook là 11 viên; sơ đồ cột `cot-195`, `cot-thieu-330`, `cot-thieu-78`; mẫu tổng `viet-74`; câu ôn `tich-66`, `tinh-3-2-11`, `phan-tich-4-49`.
- Bảng số nguyên tố: `bang-100` (lưới 1..100, cao tối đa 32vh để iPad ngang thấy đủ bảng, chú giải và dòng số 1; dấu ✚ nhỏ ở góc ô, chữ số thấp xuống) và `bang-nt` (danh sách 25 số). Mọi câu và màn bảo "tra bảng" (section 4, 9, 11, 12, câu `chon-nt-bank`, `chon-hs-bank`) đặt `bang-nt` làm block cuối của đề hay group; section 5 không có bảng.
- Section 5: số không chia hết cho 2, 3, 5 chưa chắc là số nguyên tố là note thường kèm ví dụ 77 = 7 · 11; `dh-nhieu` dùng 37 thay 49, hình gợi ý `goi-y-xet-69` dừng ở "?".
- Nhãn hình: không nhãn nào bắt đầu bằng chữ số (test `no tag or verdict label starts with a digit`), nhãn mang màu bắt đầu bằng tên khái niệm hay chữ; hàng `2 + 19 = 21` của `le-le` không nhãn, ý nằm ở caption; sơ đồ cột không có dấu ở từng số chia, chỉ Legend "Số chia: số nguyên tố".
- Số `\overline{9a}`, `5a`, `1a`, `4a` bọc `\htmlId{so}`, nấc 1 tô đúng số; `chon-hs-chan-bank` hỏi "hợp số chẵn"; `chon-chan-hs` chips 2, 9, 16, 21, 26, 34; `viet-28` kiểm "thử rồi loại" với "ít nhất"; nhãn `tong-hs-2` theo "Tích có thừa số ..."; câu rule section 13 có "Nếu"; nhãn hàng "Số chẵn" của `chan-le` ngắn để cùng dòng với số.
- Thẻ `cay`, `cot`, `luy-thua` gắn khái niệm số nguyên tố, tích; bỏ khái niệm thừa số (blue) vì không hình nào dùng.
- Câu chuyện bánh của section 6 là caption của `cay-12`, note quy tắc chỉ còn câu tách thừa số; ví dụ 72 viết từng bước; caption `xet-65` không nhắc số 80.

## Mục đã bỏ hay đổi cách làm
- Hình cây to hơn trên iPad: bỏ (SVG giãn 1,4 lần làm thanh dưới che nút ở section 6).
- `phan-tich-4-49`: không đặt `check` vì nhiễu `4 · 7^2` cũng có cùng giá trị 196.
- Recap section 12 không thêm ý "tổng ba số nguyên tố": recap tối đa 2 câu, đã đủ hai câu của note quy tắc.
- Nấc 1 của các câu tra bảng section 4 vẫn tô block 0 (đề), không tô bảng: vòng 1 đã chốt giữ block 0.
- Không tách section "Số 1" khỏi `hop-so` (tốn không tương xứng: thêm section, card, câu, hình cho một ý).
- `dien-130` vẫn không có nấc 1: mọi câu `fillBlank` của bài chỉ có một câu lệnh chung làm đề, không có khối để tô.
- Dòng thứ hai của các màn chạm vẫn là cách làm, chưa thêm vế lý do (vòng 2 xếp "tuỳ tác giả").
- Việc của app, không thuộc bài: bố cục màn khi bảng đẩy câu hỏi khỏi màn (cuộn tới phần được tô ở nấc 1), hàng 71, 73, 79 dưới mép ở màn chạm section 9 (chip 0–9 xuống dòng lệch trái trên iPad ngang), dấu khái niệm trong nhãn nên nhỏ hơn chữ rõ rệt hay đặt ở góc (dùng chung `TagChip`).

## Backlog cho app (không chặn bài này)
- Nút "Bảng số nguyên tố" dùng chung cho mọi bài cần tra (bài này, Bài 11, các bài sau), mở ngay từ màn bài tập, thay cho việc chèn hình `bang-nt` vào từng đề. Khi có, bỏ `bang-nt` khỏi các prompt và để một nguồn dữ liệu (`primesBelow(100)` ở `src/visuals/math/so-nguyen-to/logic.ts`).

## Nguồn (sách bài tập, `sources/math/so-nguyen-to/`, không commit)
- Đề: tr.35–37 in (PDF 36–38), tệp `sbt-p35.png`, `sbt-p36.png`, `sbt-p37.png`. Bài 11 bắt đầu ở tr.38.
- Lời giải: tr.106 (câu 2.23–2.30) và tr.107 (câu 2.31–2.32, đầu trang), tệp `sbt-p106.png`, `sbt-p107.png`.
- Nhập bằng `pnpm sources:import <pdf> --pages 35-37 (rồi 106-107) --subject math --series kntt --slug so-nguyen-to --book sbt --offset 1`.
- Chương II "Tính chia hết trong tập hợp các số tự nhiên"; bài in là "Bài 10. Số nguyên tố".
- Nội dung nguồn: số nguyên tố, hợp số, phân tích ra thừa số nguyên tố (3 ý kiến thức cần nhớ); kĩ năng xét hợp số bằng dấu hiệu chia hết cho 2, 3, 5, 9 và phân tích bằng sơ đồ cột; ví dụ 1 (945), ví dụ 2 (2 017 là tổng hai số nguyên tố không); câu 2.23–2.32.

## Giả định (không hỏi được chủ dự án)
- Trẻ yếu nhân chia: dạy từ dễ tới khó, số nhỏ, ví dụ đời sống (xếp gạch, xếp kẹo, chia nhóm), hình gợi ý từng bước.
- Dùng lại kí hiệu `\chiahet`, `\khongchiahet`, quy ước "a · b là a được lấy b lần", quy tắc tìm ước của Bài 8, các dấu hiệu của Bài 9.
- Số trong bài tự chọn, không dùng số của sách. Số lớn (945, 2 017, 1 470…) thay bằng số nhỏ hơn 100 hay vài trăm; các câu cần tra bảng số nguyên tố lớn (829, 971) bỏ vì app chỉ có bảng nhỏ hơn 100.
- Bảng số nguyên tố nhỏ hơn 100 đưa vào bài (sách bài tập chỉ bảo "tra bảng" của sách giáo khoa; app không có sách giáo khoa). Bảng chỉ liệt kê các số nguyên tố, không dạy cách lập.
- "Số chẵn", "số lẻ" là thuật ngữ kiến thức nền (tiểu học) được nhắc lại ở section 10: số chẵn chia hết cho 2, số lẻ không chia hết cho 2 (câu 2.29 và ví dụ 2 của sách dùng tính chất "tổng hai số lẻ là số chẵn", dạy bằng ví dụ số).
- Câu 2.32 (Goldbach, Euler) chỉ lấy dạng "viết số thành tổng các số nguyên tố", không nhắc bài toán chưa có lời giải.

## Cấu trúc bài (13 section, 13 card, 65 bài tập, 6 dạng, 14 hình tương tác)
`order: 10`, `number: 10`, chương II "Tính chia hết trong tập hợp các số tự nhiên", `sourceRef` "Sách bài tập tr.35–37".
1 `dem-uoc` (tìm ước bằng cách xếp ô vuông thành hình chữ nhật, quy tắc tìm ước của Bài 8 nhắc lại nguyên văn); 2 `so-nguyen-to` (định nghĩa 1); 3 `hop-so` (định nghĩa 2, số 1); 4 `bang-so-nguyen-to` (bảng nhỏ hơn 100, màn mẫu tra bảng); 5 `dau-hieu-hop-so` (kĩ năng B: dấu hiệu 2, 3, 5; câu 2.26 dạng nhỏ); 6 `phan-tich-cay` (định nghĩa 3, sơ đồ cây, câu 2.28); 7 `phan-tich-cot` (sơ đồ cột, ví dụ 1, câu 2.27); 8 `viet-luy-thua` (viết gọn, câu 2.23, 2.24); 9 `tim-chu-so-a` (câu 2.25); 10 `so-2` (số chẵn, số lẻ, số 2 là số nguyên tố chẵn duy nhất); 11 `tong-hai-nguyen-to` (ví dụ 2, câu 2.29); 12 `viet-tong` (câu 2.32); 13 `tong-hop-so` (câu 2.31a).
Câu 2.30 (xếp hình vuông thành hình chữ nhật) chỉ cho ý tưởng xếp ô; số trong bài khác sách: hình section 1 là 20 ô, section 2 là 11 ô, section 3 là 9 ô, hai câu ôn xếp 13 và 18 viên (`xep-13-cach`, `xep-18-cach`). Câu 2.31b (tích các số lẻ) không làm: cần "tích các số lẻ là số lẻ", sách bài tập không dạy.
Hình: `src/visuals/math/so-nguyen-to/` (danh mục `catalog.ts`: mỗi hình một dòng dữ liệu; loại mới `rects`, `table`, `tree`, `column`; `rows`, `lines`, `chips` dùng lại của `src/visuals/shared/`). Câu chạm chọn dùng validator `chon-dung` của bài tập hợp. Test: `tests/visuals/so-nguyen-to.test.tsx`.
Thuật ngữ mới trong `content/glossary/math.json`: "số nguyên tố" (sky), "hợp số" (pink), "phân tích ra thừa số nguyên tố", "sơ đồ cây", "sơ đồ cột", "bảng số nguyên tố", "số chẵn" (slate, chỉ số chẵn mang màu) và "số lẻ" (không màu; cả hai đánh dấu `prerequisite: tiểu học`, vì sách chỉ dùng mà không định nghĩa; section 10 và 11 ghi "Kiến thức nền (tiểu học)" ở `sourceRef`).
Màu: số nguyên tố sky (✚), hợp số pink (◆), ước violet, chữ số tận cùng teal và tổng các chữ số lime (chỉ ở section 5, giống Bài 9), tích amber.

## Để reviewer soi kĩ
- Mọi đáp án và nhiễu đã được tính bằng chương trình khi dựng (hợp số, số nguyên tố, ước, thừa số), nên tập trung vào lời đề và hai cách hiểu (LL-01, LL-10). Các câu không có `check` tự động vì lint không tính được tính nguyên tố: tự giải lại từng nhiễu.
- Bảng số nguyên tố (`bang-100`, `bang-nt`) chỉ liệt kê, không dạy cách lập (đã bỏ hình sàng vì ngoài nguồn); kiểm mọi chỗ quy tắc bảo "tra bảng" đều có `bang-nt` trên màn (LL-22).
- Section 10 và 11 dùng "số chẵn", "số lẻ" (kiến thức nền tiểu học, có glossary `prerequisite`); kiểm định nghĩa trong note và `sourceRef`.
- Section 11: mệnh đề "muốn tổng hai số nguyên tố là số lẻ thì một số hạng phải là 2" dựa vào "tổng hai số lẻ là số chẵn" và "số chẵn lớn hơn 2 là hợp số" (section 10); kiểm không có chỗ nhảy bước.
- Section 13 (`hs-tong-nhieu`, độ khó 3): tổng `6 · 5 + 9 · 7` là hợp số vì hai số hạng cùng chia hết cho 3; kiểm trẻ làm được với quy tắc "các số hạng cùng chia hết cho một số" của Bài 8.
- Số trong bài tính nhẩm: hình `gon-6-6-5` và câu `gon-2-2-3-3-3` có nhiều hơn 2 phép tính; hình `gon-6-6-5` có từng bước (LL-18). Câu `cot-thieu-330` (độ khó 3) cần chia 165 cho 55 để biết số chia; có hình gợi ý và lời giải.
- Quy ước tích: "k hàng, mỗi hàng m ô" luôn viết `m · k` (m được lấy k lần), kiểm hình `rects` và chú thích cây bánh `cay-12` (LL-05).
- Màn mở đầu của section 6 dài trên điện thoại (quy tắc 2 câu, cây, tích, chú giải, chú thích): trẻ phải cuộn xuống để thấy chú thích cuối; không có chữ chồng hay bị cắt theo walk.

## Lời đọc và video
- Giọng: `my-duyen` (`video/projects/so-nguyen-to/media.json`, không cờ miễn trừ). Bài 9 dùng Hải Đăng nên xen sang giọng nữ; không có lý do riêng để giữ giọng nam.
- Lời đọc tổng quan: đọc bằng Gemini `Vindemiatrix` (không hết hạn mức, không rơi về VieNeu), 47,4 s, 12 câu đều khớp ≥ 97,3%. Câu đầu của `overview.hook` thêm câu chào: "Chào bạn! Hôm nay ta xếp gạch để tìm số nguyên tố." (đổi nội dung, đổi review hash).
- Video (`video/projects/so-nguyen-to/<tên>/`, đều VieNeu Mỹ Duyên, câu đầu là câu chào `opening`; thời lượng mới sau vòng 4: `xep-gach` 79,9 s, `tra-bang` 64,1 s, `phan-tich` 71,7 s):
  - `xep-gach` (79,7 s, đầu phần 1 `dem-uoc`): xếp gạch 8, 11, 9, 1 thành hình chữ nhật, đọc ước, số nguyên tố, hợp số, số 1; clip `uoc`, `nguyen-to`, `hop-so` cho thẻ cùng tên.
  - `tra-bang` (60,5 s, đầu phần 4 `bang-so-nguyen-to`): tra bảng cho 59 (có), 77 và 91 (không có); clip `tra-bang` cho thẻ `bang`.
  - `phan-tich` (71,7 s, đầu phần 6 `phan-tich-cay`): sơ đồ cây của 12 và sơ đồ cột của 60; clip `cay`, `cot` cho thẻ cùng tên.
- Mỗi phần chỉ có một video nên video sơ đồ cột đặt chung ở phần 6; phần 7 chưa có video riêng.
- Whisper: câu thấp nhất 96,7% ("Ta tìm 59/77 trong bảng": Whisper nghe "bảng" thành "bản", giọng Mỹ Duyên miền Nam nuốt âm cuối "ng"; đã đọc lại 3 lần). Vòng 4 nghe lại bằng Whisper có gợi ý ngữ cảnh "bảng số nguyên tố": cả hai câu ra đúng "bảng"; chữ luôn có trên phụ đề và bảng hiện trên màn, nên chấp nhận. Mọi câu khác ≥ 97,2%. Lời đọc Gemini nghe "thừa số" thành "thử số" ở hai câu (98,2% và 97,3%), chấp nhận cùng lý do.
- Sửa ở vòng 4: `tra-bang` câu chốt có "nhỏ hơn 100" (kèm nhãn "số nhỏ hơn 100"); `phan-tich` dòng 12 = 2 · 2 · 3 hiện đúng chữ "tích của các số nguyên tố"; `xep-gach` câu số 1 thành "Xếp 1 viên gạch thì sao? Chỉ có một cách."; ba video dựng lại (chỉ ba câu đổi được đọc lại).
- Góp ý còn lại của video: khoảng 2 giây màn trống ở đầu cảnh sơ đồ cột của `phan-tich`; câu "4 bằng 2 nhân 2" chưa nói 4 là hợp số nên tách tiếp.
- Chưa làm: video cho phần 10–12 (viết số thành tổng hai số nguyên tố) và phần 7 riêng.
