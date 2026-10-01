# Bàn giao: Bài 10 `so-nguyen-to` (Số nguyên tố)

## Trạng thái
- Cập nhật cuối: 01/10/2026. Bài ở `status: draft`, đã sửa xong theo review vòng 1 (toàn bộ Nghiêm trọng, hầu hết Nên sửa và Góp ý, xem "Đã sửa theo review vòng 1"), chờ review vòng 2 (Opus, `content:diff` so với bản đã review). Chưa `content:hash --approve`, chưa `content:lock`, chưa có lời đọc và video.
- Đã chạy sau khi sửa: `pnpm content:check` 0 lỗi (còn cảnh báo "id chưa khoá", đúng vì bài draft); `pnpm test` bài này 17 test đạt (toàn bộ: chỉ `tests/learn/section-player.test.tsx` fail do file `src/learn/section-player.tsx` đang sửa dở của agent khác, và vài test `sources-import` hết giờ khi máy tải nặng); `pnpm typecheck`, `biome lint` và `biome format` trên file của bài sạch; `pnpm visual:shot so-nguyen-to` 140/140 đạt; `pnpm lesson:walk so-nguyen-to` 0 lỗi, 0 cảnh báo (đã xem contact sheet điện thoại của mọi màn đổi, iPad dọc mẫu).
- Bước kế tiếp: review vòng 2, `content:hash --approve`, `content:lock`, rồi lời đọc tổng quan và 3 video.

## Đã sửa theo review vòng 1
- Định nghĩa số nguyên tố, hợp số, phân tích ra thừa số nguyên tố viết lại bằng lời của bài (giữ điều kiện "lớn hơn 1"); note, recap section, recap card đổi cùng lúc. Quy tắc tổng chia hết có thêm điều kiện "số đó lớn hơn 1", dùng nguyên văn câu Bài 8.
- Bỏ hẳn hình sàng từng bước và block `sang-100` (mã `sieve.tsx`, mục catalog). Hình bảng là `prime-table.tsx` (kind `table`): `bang-100` (lưới 1..100, chỉ tô số nguyên tố, ghi "Số 1 không là số nguyên tố, cũng không là hợp số", rộng tới 460px) và `bang-nt` (25 số nguyên tố nhỏ hơn 100, năm số một hàng). Section 4 có thêm màn mẫu "Tra 59, tra 77".
- Mọi câu và màn bảo "tra bảng" (section 4, 9, 11, 12) đặt `bang-nt` làm block cuối của đề hay child cuối của group; không đặt ở hình gợi ý. Section 5 giữ không có bảng.
- Câu chép sách đổi số: `xep-5-cach` (kèm note "xoay vẫn là một cách", caption `xep-8` dạy trước), `viet-ba-19`, `viet-44`; id cũ đổi theo (bài chưa khoá id).
- Sơ đồ cột: bỏ dấu ✚ ở từng số chia, thêm Legend "Số chia: số nguyên tố", vạch dọc liền một nét, hàng sát hơn để nút "Bước tiếp" không bị thanh dưới che trên điện thoại.
- Nhãn `le-le` ("2 cộng số lẻ: tổng là số lẻ") và hàng "Số nguyên tố khác 2: đều là số lẻ"; hàng "Số lẻ" của `chan-le` không mang màu khái niệm (không còn nhãn có màu, hàng trên là "Số chẵn" slate, chú thích ở caption).
- Tag "Ước" luôn violet, số nguyên tố/hợp số tô ngay trong hàng; recap `hop-so` có ý số 1 (`so-sanh-nt-hs-xong`, note số 1 đánh `rule`).
- Đổi số để hết trùng (`chon-nt-2-7`, `chon-nt-bank`, `chon-hs-bank`, `chon-a-6` thành 7a, `tich-52`, `chia-dau-87` có "nhỏ nhất", `noi-tong`, `tong-31`, `viet-40` dạng chọn "thử từ nhỏ", `hs-tong-nhieu`); số `\overline{9a}` viết trong khối formula; thêm câu `phan-tich-4-9` cho card luỹ thừa; câu cột `cot-thieu-54` thay `chia-bi-54`.
- Màn mở đầu section 6 tách hai màn (định nghĩa + 12 = 2 · 2 · 3, rồi cây với câu chuyện bánh làm note); hook, whyItMatters, sourceRef section 1, các câu dẫn mơ hồ ("Chia số đó", ví dụ 25, `dien-91`, `le-le-tong`, `viet-9-ba`...) sửa như review.
- Góp ý đã làm: caption `so-sanh-nt-hs`, `chon-uoc-10`, thứ tự thừa số, hình gợi ý riêng `goi-y-cay-20` cho `cay-thieu-45`, "Sơ đồ cột của 84", cột `cot-thieu-54`, "Số thừa số bằng nhau là số mũ", ví dụ chia hết cho 2 (80), `dien-le-le` ví dụ khác, hình gợi ý `goi-y-tong-hs` và nhãn "Tích có thừa số ...", vạch dọc cột liền.

## Mục đã bỏ hay đổi cách làm
- Hình cây to hơn trên iPad: bỏ. Cho SVG cây giãn 1,4 lần trên màn rộng làm walk báo thanh dưới che nút ở section 6 và hình lời giải `cay-thieu-28` (iPad dọc và ngang); số vẫn đọc được ở cỡ cũ.
- Dòng thêm ở màn cùng làm section 5 "Số không chia hết cho 2, 3, 5 thì tra bảng để biết": đổi thành "chưa chắc là số nguyên tố" đặt ở caption `xet-51`, vì section 5 không có bảng (một câu bảo tra bảng mà không có bảng là lỗi mà review đã nêu); hình gợi ý "49 = 7 · 7" thay bằng `goi-y-xep-21` (hai cách xếp 21 ô, ước ẩn) để không lộ kết quả.
- `phan-tich-4-9`: không đặt `check` vì nhiễu `4 · 3^2` cũng bằng 36; chỉ một lựa chọn gồm toàn số nguyên tố.
- Recap section 12 không thêm ý "tổng ba số nguyên tố": recap tối đa 2 câu và đã đủ hai câu của note quy tắc; ý này nằm ở note và hình `viet-9-ba`.
- Một số `rule` thành hai câu (section 3 ý số 1 là một câu, recap hai câu) để qua luật độ dài (câu tối đa 25 âm tiết, note tối đa 2 câu).

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
Câu 2.30 (xếp hình vuông thành hình chữ nhật) được dùng làm hình mở đầu các section 1–3 và hai câu ôn (`xep-7-cach`, `xep-18-cach`). Câu 2.31b (tích các số lẻ) không làm: cần "tích các số lẻ là số lẻ", sách bài tập không dạy.
Hình: `src/visuals/math/so-nguyen-to/` (danh mục `catalog.ts`: mỗi hình một dòng dữ liệu; loại mới `rects`, `table`, `tree`, `column`; `rows`, `lines`, `chips` dùng lại của `src/visuals/shared/`). Câu chạm chọn dùng validator `chon-dung` của bài tập hợp. Test: `tests/visuals/so-nguyen-to.test.tsx`.
Thuật ngữ mới trong `content/glossary/math.json`: "số nguyên tố" (sky), "hợp số" (pink), "phân tích ra thừa số nguyên tố", "sơ đồ cây", "sơ đồ cột", "bảng số nguyên tố", "số chẵn" (slate, chỉ số chẵn mang màu) và "số lẻ" (không màu; cả hai đánh dấu `prerequisite: tiểu học`, vì sách chỉ dùng mà không định nghĩa; section 10 và 11 ghi "Kiến thức nền (tiểu học)" ở `sourceRef`).
Màu: số nguyên tố sky (✚), hợp số pink (◆), ước violet, chữ số tận cùng teal và tổng các chữ số lime (chỉ ở section 5, giống Bài 9), thừa số blue, tích amber.

## Để reviewer soi kĩ
- Mọi đáp án và nhiễu đã được tính bằng chương trình khi dựng (hợp số, số nguyên tố, ước, thừa số), nên tập trung vào lời đề và hai cách hiểu (LL-01, LL-10). Các câu không có `check` tự động vì lint không tính được tính nguyên tố: tự giải lại từng nhiễu.
- Bảng số nguyên tố (`bang-100`, `bang-nt`) chỉ liệt kê, không dạy cách lập (đã bỏ hình sàng vì ngoài nguồn); kiểm mọi chỗ quy tắc bảo "tra bảng" đều có `bang-nt` trên màn (LL-22).
- Section 10 và 11 dùng "số chẵn", "số lẻ" (kiến thức nền tiểu học, có glossary `prerequisite`); kiểm định nghĩa trong note và `sourceRef`.
- Section 11: mệnh đề "muốn tổng hai số nguyên tố là số lẻ thì một số hạng phải là 2" dựa vào "tổng hai số lẻ là số chẵn" và "số chẵn lớn hơn 2 là hợp số" (section 10); kiểm không có chỗ nhảy bước.
- Section 13 (`hs-tong-nhieu`, độ khó 3): tổng `3 · 5 + 6 · 7` là hợp số vì hai số hạng cùng chia hết cho 3; kiểm trẻ làm được với quy tắc "các số hạng cùng chia hết cho một số" của Bài 8.
- Số trong bài tính nhẩm: hình `gon-6-6-5` và câu `gon-2-2-3-3-3` có nhiều hơn 2 phép tính; hình `gon-6-6-5` có từng bước (LL-18). Câu `cot-thieu-150` (độ khó 3) cần chia 75 cho 25 để biết số chia; có hình gợi ý và lời giải.
- Quy ước tích: "k hàng, mỗi hàng m ô" luôn viết `m · k` (m được lấy k lần), kiểm hình `rects` và chú thích cây bánh `cay-12` (LL-05).
- Màn mở đầu của section 6 dài trên điện thoại (quy tắc 2 câu, cây, tích, chú giải, chú thích): trẻ phải cuộn xuống để thấy chú thích cuối; không có chữ chồng hay bị cắt theo walk.

## Lời đọc và video
Chưa làm. Theo `.claude/skills/lesson-video`: chọn giọng (Bài 9 dùng Hải Đăng, Bài 8 dùng Mỹ Duyên), ý chính gợi ý cho 3 video: đếm ước bằng hình chữ nhật và định nghĩa số nguyên tố (section 1–3); phân tích bằng sơ đồ cây và sơ đồ cột (section 6–7); viết số thành tổng hai số nguyên tố (section 10–12).
