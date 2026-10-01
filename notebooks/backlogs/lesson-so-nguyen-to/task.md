# Bàn giao: Bài 10 `so-nguyen-to` (Số nguyên tố)

## Trạng thái
- Cập nhật cuối: 01/10/2026. Bài ở `status: draft`, chưa review, chưa `content:hash --approve`, chưa `content:lock`, chưa có lời đọc và video.
- Đã chạy (01/10/2026): `pnpm content:check --stats` 0 lỗi, không cảnh báo `[guides]` của bài (còn cảnh báo "id chưa khoá", đúng vì bài draft); `pnpm visual:shot so-nguyen-to` 128/128 đạt; `pnpm lesson:walk so-nguyen-to` 0 lỗi, 0 cảnh báo; gate (`pnpm lint`, `pnpm typecheck`, `pnpm test` 2 022 test) đạt; `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` đã chạy ở cây chính.
- Đã xem contact sheet điện thoại của walk (đủ 19 sheet), sheet iPad dọc và iPad ngang (mẫu), và sheet của `visual:shot` (điện thoại hầu hết, iPad mẫu).
- Bước kế tiếp: review (subagent mới, Opus vòng 1 và 2), sửa theo review, `content:hash --approve`, `content:lock`, rồi lời đọc tổng quan và 3 video.

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
- Bảng số nguyên tố nhỏ hơn 100 đưa vào bài (sách bài tập chỉ bảo "tra bảng" của sách giáo khoa; app không có sách giáo khoa). Hình dựng bảng bằng cách gạch bội của 2, 3, 5, 7.
- Không dạy "số chẵn, số lẻ" như thuật ngữ mới: dùng "chia hết cho 2" và "không chia hết cho 2" (câu 2.29 và ví dụ 2 của sách dùng tính chất "tổng hai số lẻ là số chẵn", dạy bằng ví dụ số).
- Câu 2.32 (Goldbach, Euler) chỉ lấy dạng "viết số thành tổng các số nguyên tố", không nhắc bài toán chưa có lời giải.

## Cấu trúc bài (13 section, 13 card, 64 bài tập, 6 dạng, 64 hình, 14 hình tương tác)
`order: 10`, `number: 10`, chương II "Tính chia hết trong tập hợp các số tự nhiên", `sourceRef` "Sách bài tập tr.35–37".
1 `dem-uoc` (tìm ước bằng cách xếp ô vuông thành hình chữ nhật, quy tắc tìm ước của Bài 8 nhắc lại nguyên văn); 2 `so-nguyen-to` (định nghĩa 1); 3 `hop-so` (định nghĩa 2, số 1); 4 `bang-so-nguyen-to` (bảng nhỏ hơn 100 và hình gạch bội của 2, 3, 5, 7); 5 `dau-hieu-hop-so` (kĩ năng B: dấu hiệu 2, 3, 5; câu 2.26 dạng nhỏ); 6 `phan-tich-cay` (định nghĩa 3, sơ đồ cây, câu 2.28); 7 `phan-tich-cot` (sơ đồ cột, ví dụ 1, câu 2.27); 8 `viet-luy-thua` (viết gọn, câu 2.23, 2.24); 9 `tim-chu-so-a` (câu 2.25); 10 `so-2` (số chẵn, số lẻ, số 2 là số nguyên tố chẵn duy nhất); 11 `tong-hai-nguyen-to` (ví dụ 2, câu 2.29); 12 `viet-tong` (câu 2.32); 13 `tong-hop-so` (câu 2.31a).
Câu 2.30 (xếp hình vuông thành hình chữ nhật) được dùng làm hình mở đầu các section 1–3 và hai câu ôn (`xep-7-cach`, `xep-18-cach`). Câu 2.31b (tích các số lẻ) không làm: cần "tích các số lẻ là số lẻ", sách bài tập không dạy.
Hình: `src/visuals/math/so-nguyen-to/` (danh mục `catalog.ts`: mỗi hình một dòng dữ liệu; loại mới `rects`, `sieve`, `tree`, `column`; `rows`, `lines`, `chips` dùng lại của `src/visuals/shared/`). Câu chạm chọn dùng validator `chon-dung` của bài tập hợp. Test: `tests/visuals/so-nguyen-to.test.tsx`.
Thuật ngữ mới trong `content/glossary/math.json`: "số nguyên tố" (sky), "hợp số" (pink), "phân tích ra thừa số nguyên tố", "sơ đồ cây", "sơ đồ cột", "bảng số nguyên tố", "số chẵn" (slate) và "số lẻ" (cùng đánh dấu `prerequisite: tiểu học`, vì sách chỉ dùng mà không định nghĩa; section 10 và 11 ghi "Kiến thức nền (tiểu học)" ở `sourceRef`).
Màu: số nguyên tố sky (✚), hợp số pink (◆), ước violet, chữ số tận cùng teal và tổng các chữ số lime (chỉ ở section 5, giống Bài 9), thừa số blue, tích amber.

## Để reviewer soi kĩ
- Mọi đáp án và nhiễu đã được tính bằng chương trình khi dựng (hợp số, số nguyên tố, ước, thừa số), nên tập trung vào lời đề và hai cách hiểu (LL-01, LL-10). Các câu không có `check` tự động vì lint không tính được tính nguyên tố: tự giải lại từng nhiễu.
- Hình bảng số nguyên tố dựng bằng cách gạch bội của 2, 3, 5, 7: sách bài tập chỉ nói "tra bảng" của sách giáo khoa; nếu reviewer cho là ngoài nguồn (LL-09), bỏ block `sang-100` ở section 4 và giữ bảng `bang-100`.
- Section 10 và 11 dùng "số chẵn", "số lẻ" (kiến thức nền tiểu học, có glossary `prerequisite`); kiểm định nghĩa trong note và `sourceRef`.
- Section 11: mệnh đề "muốn tổng hai số nguyên tố là số lẻ thì một số hạng phải là 2" dựa vào "tổng hai số lẻ là số chẵn" và "số chẵn lớn hơn 2 là hợp số" (section 10); kiểm không có chỗ nhảy bước.
- Section 13 (`hs-tong-nhieu`, độ khó 3): tổng `3 · 5 + 6 · 7` là hợp số vì hai số hạng cùng chia hết cho 3; kiểm trẻ làm được với quy tắc "các số hạng cùng chia hết cho một số" của Bài 8.
- Số trong bài tính nhẩm: câu 6 · 6 · 5 ở `gon-6-6-5` và `gon-2-2-3-3-3` có 3 phép tính, có hình từng bước (LL-18). Câu `cot-thieu-150` (độ khó 3) cần chia 75 cho 25 để biết số chia; có hình gợi ý và lời giải.
- Quy ước tích: "k hàng, mỗi hàng m ô" luôn viết `m · k` (m được lấy k lần), kiểm hình `rects` và chú thích cây bánh `cay-12` (LL-05).
- Màn mở đầu của section 6 dài trên điện thoại (quy tắc 2 câu, cây, tích, chú giải, chú thích): trẻ phải cuộn xuống để thấy chú thích cuối; không có chữ chồng hay bị cắt theo walk.
- Màn nhập số của câu 2.27 (`cot-thieu-*`) và 2.28 (`cay-thieu-*`) dùng bàn phím số của app; trẻ chưa gặp "mũ" ở các câu này (không dùng).

## Lời đọc và video
Chưa làm. Theo `.claude/skills/lesson-video`: chọn giọng (Bài 9 dùng Hải Đăng, Bài 8 dùng Mỹ Duyên), ý chính gợi ý cho 3 video: đếm ước bằng hình chữ nhật và định nghĩa số nguyên tố (section 1–3); phân tích bằng sơ đồ cây và sơ đồ cột (section 6–7); viết số thành tổng hai số nguyên tố (section 10–12).
