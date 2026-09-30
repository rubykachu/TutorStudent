# Bàn giao: Bài 8 `quan-he-chia-het-va-tinh-chat` (Quan hệ chia hết và tính chất)

## Trạng thái
- Đang soạn (`status: draft`). Chưa review, chưa duyệt: một reviewer mới làm bước đó.
- Soạn đêm 01/10/2026 thay cho buổi hỏi đáp đầu vào vì chủ dự án đang ngủ; các giả định ở mục "Giả định".

## Nguồn (sách bài tập, `sources/math/quan-he-chia-het-va-tinh-chat/`, không commit)
- Đề: tr.30–32 in (PDF 31–33), tệp `sbt-p30.png` tới `sbt-p32.png`. Bài 9 "Dấu hiệu chia hết" bắt đầu ở tr.33.
- Lời giải: tr.104 (phần dưới, câu 2.1–2.6) và tr.105 (câu 2.7–2.11), tệp `sbt-p104.png`, `sbt-p105.png`. Nhập bằng `pnpm sources:import <pdf> --pages 30-32 (rồi 104-105) --subject math --series kntt --slug quan-he-chia-het-va-tinh-chat --book sbt --offset 1`.
- Chương II "Tính chia hết trong tập hợp các số tự nhiên"; bài in là "Bài 8. Quan hệ chia hết và tính chất".
- Nội dung nguồn: kiến thức (a = k · b; ước, bội; tính chất của tổng), 2 ví dụ, câu 2.1–2.11.
- Đáp án câu 2.5 trong sách chỉ ghi ý a); ý b) tự tính: 1 930 + 100 + 2 021 không chia hết cho 5 vì 2 021 không chia hết cho 5.

## Giả định (không hỏi được chủ dự án)
- Trẻ yếu nhân chia và chưa viết được kí hiệu tập hợp: bài bắc thang từ "chia đều không thừa" (kẹo, túi), kiểm bằng bảng nhân hay phép chia có dư, chưa dùng kí hiệu ∈ ∉ hay tập hợp.
- Kí hiệu chia hết viết trong công thức bằng `\chiahet` và `\khongchiahet` (hai macro TeX trong `src/lib/tex.ts`), lint tính được mệnh đề chia hết.
- Tính chất của hiệu (sách có ở "Kĩ năng" và câu 2.7) dạy cùng cách với tổng.
- Quy ước "a · b là a được lấy b lần" của Bài 5 giữ nguyên.
- Lời đọc và video để sau khi bài được duyệt (đúng quy trình), chưa làm.

## Cấu trúc bài (13 section, 13 card, 68 bài tập, 74 hình)
1 `chia-deu` chia đều không thừa (túi kẹo, hình tự chọn cỡ túi); 2 `ky-hieu` dấu chia hết; 3 `kiem-tra` đếm cách và số dư; 4 `uoc-boi`; 5 `tim-uoc`; 6 `tim-boi`; 7 `tong-chia-het`; 8 `tong-khong-chia-het`; 9 `hieu-chia-het`; 10 `hieu-khong-chia-het`; 11 `tim-x` (ví dụ 1, câu 2.6–2.8); 12 `so-du` (ví dụ 2, câu 2.10); 13 `nhom-so-hang` (câu 2.9, luỹ thừa).
Câu 2.11 (mở két) không làm thành bài riêng: dùng kiểu "chọn tất cả số chia hết" ở section 3, 4, 6.
Hình: `src/visuals/math/quan-he-chia-het-va-tinh-chat/` (danh mục `catalog.ts`, mỗi hình một dòng dữ liệu).

## Kiểm tra đã chạy (01/10/2026)
- `pnpm content:check --stats`: 0 lỗi, không cảnh báo `[guides]` của bài này (còn cảnh báo "id chưa khoá", đúng vì bài draft).
- `pnpm visual:shot`: 148/148 đạt; đã xem ảnh điện thoại và iPad.
- `pnpm lesson:walk`: 0 lỗi, 0 cảnh báo. Máy chủ dev của chủ dự án (cổng 3001) không nạp section của bài mới (chạy từ trước khi bài có), nên walk chạy trên bản sao `git worktree` ở cổng 3100 (đã xoá).
- Gate: format, lint, typecheck, test (1 685) đạt.

## Thay đổi ngoài nội dung bài
- `src/lib/tex.ts`: macro `\chiahet`, `\khongchiahet` (dấu gạch chéo đặt bằng `\mathrlap`, không dùng `\not` vì gạch rộng bằng dấu bằng, chạm số đứng sau).
- `src/content/lint/expr.ts`: `comparisonValue` tính được mệnh đề chia hết (test trong `tests/content/lint.test.ts`).
- `src/visuals/shared/math-parts.tsx`: `Tint`, `Hole`, `Legend`, `MATH_LINE` chuyển từ `parts-nhan.tsx` của Bài 5 (vẫn re-export).

## Việc tiếp theo
1. Reviewer mới (Opus, vòng 1) đọc `docs/lessons-learned/index.md`, đối chiếu ảnh nguồn `sbt-p30` tới `sbt-p32` và lời giải `sbt-p104`, `sbt-p105`.
2. Sau khi sửa lỗi Nghiêm trọng: `pnpm content:lock`, rồi lời đọc và video.
3. Điểm cần soi kỹ: chữ `m` trong câu quy tắc section 8 đến 11 (trẻ chưa gặp biến `m`); section 11 và 13 khó với trẻ yếu nhân chia; hình `hops` ở bước đầu chỉ có trục trống (giống hình `skip` của Bài 5); câu hỏi đáp án nhiều lựa chọn trong section 12 chỉ dùng ước của số chia để kết luận đúng.

## Vòng 1 review đã sửa (02/10/2026)
- Cả 8 Nghiêm trọng và Nên sửa 1–8, 10–13, 15–28 đã sửa; Góp ý 1–11, 14–17 đã sửa.
- Cách nói số chia trong sáu quy tắc tính chất: "chia hết cho một số ... cho số đó", không dùng chữ m. Note, recap section, recap card khớp từng chữ. Quy tắc số dư giới thiệu a, b, q, r ngay trong note.
- Chưa có video, lời đọc hay glossary video nào cần đồng bộ. Glossary môn thêm "chia hết", "ước", "bội".
- Kiểm: content:check 0 lỗi, visual:shot 152/152 đã xem ảnh, lesson:walk do điều phối chạy.

## Để lại
- Nên sửa 9 (màu Số hạng xanh dương trùng Số bị chia, Tổng cam trùng Thương): màu của "số hạng", "tổng" do glossary môn giữ và bài khác đang dùng; đổi chỉ trong bài này bị lint chặn, đổi glossary ảnh hưởng bài đã xuất bản. Đã sửa phần của bài: hình bước nhảy dùng xanh dương cho số bị chia, chỗ dừng trung tính.
- Nên sửa 14, riêng section `nhom-so-hang`: không có tình huống đời sống tự nhiên cho việc đặt thừa số chung của luỹ thừa.
- Góp ý 11 (nấc 1 tô cả đề) còn ở `tim-tui-40-16`, `mua-hop-10-20`, `du-tong-30-4`: đề một khối, không chặn; chỉ `chon-so-hang-khong-7` đã tách công thức.
- Góp ý 12 (khái niệm của card hiệu): thêm "Hiệu" màu teal trùng màu thẻ "chia hết" của hình; giữ nguyên.
- Góp ý 13 (chú giải "Thừa số" cho hình `tim-uoc-18`): thuật ngữ đã học ở Bài 5, giữ nguyên.
