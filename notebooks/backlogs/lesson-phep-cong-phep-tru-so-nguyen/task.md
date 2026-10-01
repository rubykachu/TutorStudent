# Bàn giao: Bài 14 `phep-cong-phep-tru-so-nguyen` (Phép cộng và phép trừ số nguyên)

## Trạng thái
- Cập nhật cuối: 02/10/2026 (đang giữa review vòng 3). 13 phần, 13 thẻ, 60 câu, 6 dạng câu, 13 hình bấm mũi tên, 3 mẹo. `content:check --stats` 0 lỗi, `visual:shot` 100/100, `lesson:walk` 0 failures 0 cảnh báo (cây tạm `git worktree` cổng 3350, xoá khi xong). Không làm lời đọc và video trong đợt này.
- Review: vòng 1 (Opus, 8 Nghiêm trọng), vòng 2 (Opus, 4 Nghiêm trọng), đã sửa hết; đọc hiểu Haiku 3 lượt (100/25/1, 6/15/2, 7/7/0; bảy mục còn "Hiểu mơ hồ" ở lượt 3 là thuật ngữ cần bài dạy chứ không phải câu rối: ghi ở Nên sửa của `review.md`). Việc kế tiếp: vòng 3 chỉ phần đổi (Sonnet, `pnpm content:diff`), rồi `pnpm content:hash phep-cong-phep-tru-so-nguyen --approve`, `pnpm content:lock phep-cong-phep-tru-so-nguyen`, `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`.
- Tệp tạm của lần soạn (không commit): bộ sinh `lesson.json` và kết quả review ở thư mục scratchpad của phiên (`bai14/gen.py`) và `.shots/review/phep-cong-phep-tru-so-nguyen/`. Sửa chữ thì sửa thẳng `lesson.json`; bộ sinh chỉ là công cụ soạn.

## Tiến độ (đánh dấu khi xong)
- [x] Nạp nguồn: `sources/math/phep-cong-phep-tru-so-nguyen/` (không commit).
- [x] Hình: `src/visuals/math/phep-cong-phep-tru-so-nguyen/` (catalog, hình bấm mũi tên `hopTry`, huy hiệu) và đăng ký ở `src/visuals/registry.ts`; test `tests/visuals/phep-cong-phep-tru-so-nguyen.test.tsx`.
- [x] `lesson.json`, `content:check --stats` 0 lỗi, không `[guides]`.
- [x] `visual:shot`, `lesson:walk` 0 failures, xem contact sheet.
- [x] Review vòng 1, 2 (Opus), đọc hiểu (Haiku).
- [ ] Review vòng 3 (Sonnet, chỉ phần đổi).
- [ ] `content:hash --approve`, `content:lock phep-cong-phep-tru-so-nguyen`, `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`.

## Nguồn (sách bài tập, `sources/math/phep-cong-phep-tru-so-nguyen/`, không commit)
- Đề: tr.50–52 in (PDF 51–53), tệp `sbt-p50.png`, `sbt-p51.png`, `sbt-p52.png`. Bài 15 bắt đầu ở tr.53.
- Lời giải: tr.111 in (PDF 112), tệp `sbt-p111.png`, mục "Bài 14" (3.9, 3.10, 3.15, 3.16, 3.17, 3.18, 3.19). Sách không in đáp án bài 3.8, 3.11 đến 3.14; đáp án các bài này do người soạn tự tính.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 50-52 (rồi 111-111) --subject math --series kntt --slug phep-cong-phep-tru-so-nguyen --book sbt --offset 1`.
- Chương III "Số nguyên"; `number: 14`, `order: 14`, `chapter` `{ numeral: "III", name: "Số nguyên" }`.
- Nội dung nguồn: kiến thức cần nhớ 1 đến 6 (phần dấu và phần số tự nhiên, số đối và −(−x) = x, quy tắc cộng hai số nguyên, trừ hai số nguyên, giao hoán và kết hợp, tổng nhiều số), ví dụ 1 (giá trị biểu thức A = x + (−27) − 234), ví dụ 2 (tính hợp lí), bài 3.8 đến 3.19.

## Kế hoạch bài (12 phần, từ dễ đến khó, mọi phép tính đều dạy bằng đi trên trục số)
1. `phan-dau` Phần dấu và phần số tự nhiên (kiến thức 1; bài 3.8).
2. `so-doi` Số đối và dấu − đứng trước (kiến thức 2; bài 3.9, 3.10).
3. `cong-so-duong` Cộng với số dương: đi sang phải (nhiệt độ ấm lên).
4. `cong-so-am` Cộng với số âm: đi sang trái (thang máy, nợ).
5. `tong-so-doi` Tổng của hai số đối bằng 0 và cộng với 0 (kiến thức 3).
6. `cung-dau` Cộng hai số cùng dấu (kiến thức 3).
7. `khac-dau` Cộng hai số khác dấu (kiến thức 3); mẹo.
8. `tru-so-duong` Trừ đi một số dương: a − b = a + (−b) (kiến thức 4).
9. `tru-so-am` Trừ đi một số âm; mẹo "hai dấu liền nhau".
10. `tinh-chat` Giao hoán, kết hợp, tổng nhiều số (kiến thức 5, 6; ví dụ 2; bài 3.18, 3.19); mẹo ghép số đối.
11. `gia-tri-bieu-thuc` Giá trị của biểu thức (ví dụ 1; bài 3.15).
12. `bai-toan-thuc-te` Bài toán đời sống (bài 3.16, 3.17).
- Màu khái niệm: số nguyên dương lime, số nguyên âm pink, số 0 slate, số đối sky, số hạng blue, tổng amber, hiệu teal (cùng màu với glossary và Bài 13). Mũi tên đi sang phải (cộng số dương) lime, đi sang trái (cộng số âm) pink; điểm xuất phát blue, điểm kết quả amber (tổng) hay teal (hiệu).

## Giả định (chủ dự án đang ngủ, không hỏi được)
- Nguồn là sách bài tập, trang đáp án tr.111. Số trong bài tự chọn nhỏ hơn số của sách (bé học chậm); các số lớn của bài 3.11 đến 3.14 và 3.17 không đưa vào.
- Chỉ mẹo nào đúng với mọi đầu vào mới viết, đã thử bằng chương trình tạm (không commit).
- Không dạy tính chất kết hợp, giao hoán bằng chữ a, b, c ở dạng công thức đại số; dùng số cụ thể.
