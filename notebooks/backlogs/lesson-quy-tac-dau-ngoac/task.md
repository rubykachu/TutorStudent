# Bàn giao: Bài 15 `quy-tac-dau-ngoac` (Quy tắc dấu ngoặc)

## Trạng thái
- Cập nhật cuối: 03/10/2026. Bài đã qua review vòng 1–3, đọc hiểu Haiku, vòng video (Sonnet, 0 Nghiêm trọng, 0 Nên sửa), rồi thêm phần cuối "Bài tập sách bài tập" (vòng 5 Opus, vòng 6 Sonnet, xem `review.md` mục "Vòng 5 và 6"), `content:hash --approve`, `content:lock`, `lesson:walk` 0 failures (có video). Xong, chờ chủ dự án quyết ba góp ý video ở `review.md` mục "Vòng video", các mục "Không sửa, ghi cho chủ dự án" của mục "Vòng 5 và 6", và việc tải media lên production.
- Lời đọc giới thiệu: giọng Gemini Achird (đã đọc lại sau khi hạn mức hồi, thay bản VieNeu tạm). Phần giới thiệu viết "dấu cộng", "dấu trừ" bằng chữ vì giọng đọc nuốt ký hiệu "−".
- Giọng cả bài: Hải Đăng (`video/projects/quy-tac-dau-ngoac/media.json`), xen kẽ với Bài 14 (Mỹ Duyên).
- Ba video (đầu các phần 2, 3, 4): `bo-ngoac-dau-cong`, `bo-ngoac-dau-tru`, `ngoac-tru-so-am`, một ý mỗi video, không `checkpoint`, có `ask` và `think`.
- Việc còn lại xem phần "Tiến độ".

## Tiến độ (đánh dấu khi xong)
- [x] Nạp nguồn: `sources/math/quy-tac-dau-ngoac/` (không commit).
- [x] Hình: `src/visuals/math/quy-tac-dau-ngoac/` (catalog, hình `flipTry` chạm đổi dấu, huy hiệu) và đăng ký ở `src/visuals/registry.ts` (tái dùng `chips` và validator `chon-dung`); test `tests/visuals/quy-tac-dau-ngoac.test.tsx`.
- [x] `lesson.json`, `content:check --stats` 0 lỗi, không `[guides]`.
- [x] `visual:shot`, `lesson:walk` 0 failures, xem contact sheet.
- [x] Review vòng 1 và 2 (Opus), đọc hiểu (Haiku).
- [x] Review vòng 3 (Sonnet) và vòng video tới 0 Nghiêm trọng.
- [x] `content:hash quy-tac-dau-ngoac --approve`, `content:lock quy-tac-dau-ngoac`, `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`.
- [x] Phần cuối `bookPractice` (section 13): 10 câu sách SBT 3.20a đến 3.25 (đủ tr.54), 15 câu dẫn, bốn khối "Nhắc lại", recap hai câu quy tắc ngoặc, 24 hình `sbt-*` ở `catalog.ts`; review, duyệt lại, khoá id, walk 0 failures. Không sửa section 1 đến 12, id, video, media.

## Mẹo đã thử bằng chương trình (không commit)
- `dau-dau-tien` (viết thêm dấu + cho số đầu trong ngoặc, đổi dấu từng số hạng khi trước ngoặc có dấu −): 20 000 tổng ngẫu nhiên có ngoặc lồng nhau (tới 3 tầng) và số 0, bỏ ngoặc từ trong ra ngoài luôn giữ giá trị.
- `gom-duong-am` (cộng riêng số dương, cộng riêng phần số của số âm, lấy số lớn trừ số bé, dấu của nhóm lớn hơn, hai nhóm bằng nhau thì 0): 20 000 tổng ngẫu nhiên có số 0, một số hạng, hai nhóm bằng nhau.
- `kiem-tra-hai-cach` (tính trong ngoặc trước và bỏ ngoặc trước phải ra cùng kết quả): 20 000 tổng ngẫu nhiên có ngoặc lồng nhau.
- Ba ví dụ in trong mẹo đã tính tay và bằng chương trình.

## Nguồn (sách bài tập, `sources/math/quy-tac-dau-ngoac/`, không commit)
- Đề: tr.53–54 in (PDF 54–55), tệp `sbt-p53.png`, `sbt-p54.png`. Bài 16 bắt đầu ở tr.55.
- Lời giải: tr.112 in (PDF 113), tệp `sbt-p112.png`, mục "Bài 15" (3.20 đến 3.25; trang 111 chỉ chứa Bài 13 và 14).
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 53-54 (rồi 112-112) --subject math --series kntt --slug quy-tac-dau-ngoac --book sbt --offset 1`.
- Chương III "Số nguyên"; `number: 15`, `order: 15`, `chapter` `{ numeral: "III", name: "Số nguyên" }`.
- Nội dung nguồn: kiến thức cần nhớ 1 (tổng đại số), 2 (quy tắc bỏ ngoặc), 3 (đổi chỗ số hạng kèm dấu, đặt ngoặc nhóm), ví dụ (bỏ ngoặc rồi tính), bài 3.20 đến 3.25. Đáp án tr.112 đã tự tính lại, khớp: 3.20 −237 và −49, 3.21 19 và −75, 3.22 −6 và 0, 3.23 −300 và −150, 3.24 là 20.

## Kế hoạch bài (12 phần, từ dễ đến khó)
1. `tong-dai-so` Tổng đại số, số hạng kèm dấu (kiến thức 1).
2. `ngoac-dau-cong` Ngoặc có dấu + đứng trước: giữ nguyên dấu (kiến thức 2).
3. `ngoac-dau-tru` Ngoặc có dấu − đứng trước, số hạng dương trong ngoặc: đổi dấu tất cả (hoá đơn mua hàng); mẹo "viết thêm dấu + cho số đầu".
4. `ngoac-tru-so-am` Ngoặc có dấu − có số âm trong ngoặc: số âm thành dương (hàng trả lại).
5. `ngoac-mot-so` Ngoặc chỉ chứa một số: +(−a), −(+a), −(−a) (bài 3.20).
6. `nhieu-ngoac` Nhiều ngoặc trong một tổng; ngoặc đứng đầu không có dấu thì giữ dấu (bài 3.21).
7. `doi-cho` Đổi chỗ số hạng kèm dấu (kiến thức 3); mẹo "gom số dương, gom số âm".
8. `nhom-ngoac-cong` Đặt ngoặc có dấu + đứng trước để nhóm: giữ dấu (kiến thức 3, bài 3.22a).
9. `nhom-ngoac-tru` Đặt ngoặc có dấu − đứng trước: đổi dấu các số hạng đưa vào (ví dụ của sách, gợi ý bài 3.22b).
10. `tinh-hop-li` Tính hợp lí: bỏ ngoặc, đổi chỗ, nhóm (bài 3.22, 3.23); mẹo "kiểm tra bằng hai cách".
11. `vi-du-tong-hop` Ví dụ trọn vẹn của sách với số nhỏ hơn.
12. `bai-toan-doi-song` Thu chi có ngoặc; ghép cặp số đối (bài 3.24 bằng lời, số nhỏ).
- Màu khái niệm giữ như Bài 14: số nguyên dương lime, số nguyên âm pink, số hạng blue, tổng đại số amber (thêm thuật ngữ vào glossary), nhãn bước violet. Dấu của số hạng trong hình đổi màu khi đổi dấu (lime thành pink và ngược lại).

## Giả định (chủ dự án đang ngủ, không hỏi được)
- Nguồn là sách bài tập, trang đáp án tr.112. Số trong bài tự chọn nhỏ hơn số của sách (bé học chậm); số lớn của 3.20 đến 3.23 chỉ giữ ở mức bài toán thật, còn lại đổi.
- Không dạy ngoặc lồng nhau (sách không có). Mẹo vẫn được thử bằng chương trình trên cả biểu thức có ngoặc lồng nhau và số 0.
- Các section thường (1 đến 12) bỏ bài 3.25 (giải thích tổng năm số) vì quá trừu tượng cho bé, và hỏi bài 3.24 (tổng phần tử tập M) bằng lời "các số nguyên từ −4 đến 4", không dùng ký hiệu tập hợp vì bé chưa viết được. Phần cuối `bookPractice` chép đủ cả hai theo sách: 3.24 giữ ký hiệu `{x ∈ ℤ | −20 < x ≤ 20}` (hai câu dẫn và một khối nhắc đọc ký hiệu bằng lời), 3.25 thành câu sắp xếp các bước giải thích (`order`) với lời đề của sách và các bước bằng lời của bài.
- Bộ sinh `lesson.json` và kết quả review ở scratchpad của phiên (`bai15/`) và `.shots/review/quy-tac-dau-ngoac/` (không commit).
