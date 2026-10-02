# Bàn giao: Bài 15 `quy-tac-dau-ngoac` (Quy tắc dấu ngoặc)

## Trạng thái
- Cập nhật cuối: 02/10/2026, dừng giữa review vòng 1 (theo lệnh dừng của chủ dự án). Bài `draft`, 12 phần, 12 thẻ, 62 câu, 6 dạng câu, 19 hình tương tác, 3 mẹo; `content:check --stats` 0 lỗi, `visual:shot` 112/112, `lesson:walk` 0 failures (đã chạy lại trên bản hiện tại). Không làm lời đọc và video trong đợt này.
- Review vòng 1 (Opus): 3 reviewer nhóm xong (`.shots/review/quy-tac-dau-ngoac/nhom-1.md`, `nhom-2.md`, `nhom-3.md`), Tổng hợp đã ghi `content/math/kntt/quy-tac-dau-ngoac/review.md` (54 mục: 8 Nghiêm trọng, phần còn lại Nên sửa và Góp ý) và chạy `content:hash --mark` (bản đã review `717b30f7...`). CHƯA sửa mục nào của review. Subagent Tổng hợp (id nội bộ `a615dde9bebaa500b`) có thể còn đang ghi `docs/lessons-learned/` (tăng số đếm, thêm dòng bài vào bảng "Lỗi Nghiêm trọng ở vòng 1"): kiểm `git diff docs/lessons-learned`, chỉ stage phần của Bài 15, nếu thiếu thì tự bổ sung theo mục "Rút kinh nghiệm" của skill `lesson-review`.
- Cây tạm `git worktree` cổng 3370 đã xoá, không còn tiến trình nào của phiên này. Sheet `lesson:walk` cũ mất theo; reviewer vòng sau cần walk lại (tạo cây tạm cổng 3370 như cũ: `git worktree add --detach <thư mục tạm> HEAD`, `pnpm install --offline`, liên kết `public/media`, `TEST_PORT=3370 CONTENT_INCLUDE_DRAFT=1 pnpm lesson:walk quy-tac-dau-ngoac`).
- 8 Nghiêm trọng của vòng 1 (đọc chi tiết ở `review.md`): (1) ba câu quy tắc đầu (tổng đại số, ngoặc +, ngoặc −) gần nguyên văn sách tr.53, cần viết lại bằng lời của bài và đổi cả recap, thẻ, câu điền `dien-quy-tac-tru`, quy tắc phần 9; (2) mẹo `dau-dau-tien` thiếu điều kiện "khi trước ngoặc có dấu −", đổi tên mẹo nêu dạng bài; (3) recap phần `ngoac-mot-so` nêu quy tắc mới, thiếu điều kiện; (4) hình `chon-nhom-7-4` có hai lựa chọn bằng tổng ban đầu; (5) mẹo `gom-duong-am` ra sai khi tổng còn ngoặc, "nhóm lớn hơn" hiểu hai cách, ví dụ dùng phép đặt ngoặc có dấu − chưa dạy; (6) `explain` của `chon-nhom-20-8` nói sai về phương án d; (7) `explain` của `chon-duong-7-10` coi số hạng đứng đầu luôn dương; (8) `explain` của câu chọn nhiều đáp án gọi lựa chọn theo vị trí ("hai dãy đầu"), mà app xáo thứ tự: soát mọi `explain` của bài (`chon-tong-bang-0`, `chon-nhom-20-8`, `chon-bang-2`, `chon-bang-6`, `chon-bang-am-5`, `chon-bang-0`...).
- Việc kế tiếp, lệnh chính xác: đọc `content/math/kntt/quy-tac-dau-ngoac/review.md`, sửa trực tiếp `content/math/kntt/quy-tac-dau-ngoac/lesson.json` (bộ sinh ở scratchpad `bai15/` có thể không còn, sửa thẳng JSON rồi `npx biome format --write` tệp đó) và `src/visuals/math/quy-tac-dau-ngoac/catalog.ts` nếu cần, `pnpm content:check --stats`, commit riêng `lesson.json` và `review.md` TRƯỚC khi sửa tiếp để `content:diff` có bản nền; rồi review vòng 2 (toàn bài, Opus, 3 reviewer + Tổng hợp theo `lesson-review`), đọc hiểu Haiku (`.shots/review/quy-tac-dau-ngoac/doc-hieu.md`), vòng 3+ Sonnet chỉ phần đổi, `pnpm content:hash quy-tac-dau-ngoac --approve`, `pnpm content:lock quy-tac-dau-ngoac`, `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`.
- Tệp tạm của lần soạn (không commit): bộ sinh `lesson.json` (`gen.py`, `p1.py`, `p2.py`, `lib.py`, `build.sh`) và `tips_test.py` ở thư mục scratchpad của phiên (`bai15/`).

## Tiến độ (đánh dấu khi xong)
- [x] Nạp nguồn: `sources/math/quy-tac-dau-ngoac/` (không commit).
- [x] Hình: `src/visuals/math/quy-tac-dau-ngoac/` (catalog, hình `flipTry` chạm đổi dấu, huy hiệu) và đăng ký ở `src/visuals/registry.ts` (tái dùng `chips` và validator `chon-dung`); test `tests/visuals/quy-tac-dau-ngoac.test.tsx`.
- [x] `lesson.json`, `content:check --stats` 0 lỗi, không `[guides]`.
- [x] `visual:shot`, `lesson:walk` 0 failures, xem contact sheet.
- [ ] Review vòng 1 (Opus) đã chạy, chưa sửa; vòng 2 (Opus), đọc hiểu (Haiku) còn lại.
- [ ] Review vòng 3+ (Sonnet, chỉ phần đổi) tới 0 Nghiêm trọng.
- [ ] `content:hash quy-tac-dau-ngoac --approve`, `content:lock quy-tac-dau-ngoac`, `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`.

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
- Bài 3.25 (giải thích tổng năm số) quá trừu tượng cho bé, bỏ. Bài 3.24 (tổng phần tử tập M) hỏi bằng lời "các số nguyên từ −4 đến 4", không dùng ký hiệu tập hợp vì bé chưa viết được.
- Bộ sinh `lesson.json` và kết quả review ở scratchpad của phiên (`bai15/`) và `.shots/review/quy-tac-dau-ngoac/` (không commit).
