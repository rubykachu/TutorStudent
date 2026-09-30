# Bàn giao: bài "Phép cộng và phép trừ số tự nhiên" (`phep-cong-phep-tru`)

Nhánh `worktree-agent-a9710b34e396f6fe3`, chưa push. Bài `draft`, `order: 4`, chưa `content:lock`, chưa `--approve`.

## Trạng thái từng pha

- Nguồn: xong. `sources/math/phep-cong-phep-tru/sbt-p14..16.png` (bài) và `sbt-p96..98.png` (đáp án), nạp bằng `sources:import --pages 14-16 / 96-98 --offset 1 --book sbt` (gitignored, nằm trong worktree).
- Nội dung: xong bản 18 section, 18 card, 93 exercise, 7 dạng bài, 11 visual tương tác. `content:check --stats` PASS, 0 lỗi, 0 cảnh báo của bài (chỉ cảnh báo id chưa khoá). Glossary `content/glossary/math.json` đã thêm màu và thuật ngữ mới.
- Visual: xong, code ở `src/visuals/math/phep-cong-phep-tru/` (catalog.ts là nguồn số liệu, đăng ký trong `src/visuals/registry.ts`), test `tests/visuals/phep-cong-phep-tru-*.test.tsx`. `visual:shot` 174/174 pass, `lesson:walk` 0 FAIL, 0 cảnh báo (phone, iPad, iPad ngang; ảnh đã đọc hết phone, mẫu iPad).
- Review: vòng 1 (toàn bài, 3 reviewer opus + tổng hợp) xong, còn 3 Nghiêm trọng, đã sửa hết, `review.md` có dòng "Bản đã review" (`--mark`). Vòng 2 (toàn bài) đã mở 3 reviewer; xong nhóm 1 và nhóm 3, nhóm 2 chưa có tệp lúc bàn giao, chưa có Tổng hợp.

## Đã commit / chưa commit

- Đã commit toàn bộ (`3ecbfc7` là bản sửa sau vòng 1). Cây làm việc sạch ở thời điểm bàn giao, trừ `.shots/` (gitignored) và `public/content` (sinh ra).
- Bộ sinh `lesson.json` nằm ngoài repo (scratchpad của phiên, thư mục `pcpt/`), không nằm trong git. Muốn sửa nội dung thì sửa thẳng `lesson.json` rồi `pnpm format`.

## Kết quả vòng 2 (chưa sửa): `.shots/review/phep-cong-phep-tru/nhom-{1,2,3}.md`

Nhóm 1 (section 1-6): không Nghiêm trọng. Nên sửa: `cham-cong-16-7`/`cham-so-tru` dùng tapRegion mà chưa có màn hướng dẫn thao tác (thu-tu-thuc-hien-phep-tinh có `huong-dan-cham-phep-tinh`, dùng lại hay thêm màn); recap `ket-hop` nói hai cách nhóm mà hình chỉ vẽ một; `dien-ten-tong` hỏi số 42 mà recap `cong-ten-tom-tat` ghi nhãn tổng ở số đó (đổi số câu hoặc recap).
Nhóm 2 (section 7-12): chưa có kết quả; đọc `nhom-2.md` khi có.
Nhóm 3 (section 13-18), Nghiêm trọng: `chon-uoc-luong-kt` (399 cũng chắc chắn sai, sửa lựa chọn); `chon-tong-sai` (120 cũng chắc chắn sai nếu tính ra tổng); `chon-cap-day-so-2` (một đáp án đúng chính là biểu thức in trong đề). Nên sửa: recap `uoc-luong-tom-tat` thiếu kết luận; ví dụ mẫu ước lượng không có kết quả bị loại; recap `lo-trinh-tom-tat` chỉ có phép trừ, trùng số ví dụ, thiếu đổi giờ; hình gợi ý `hint-bar-gio-70-25` của `tim-gio-xuat-phat` bỏ bước đổi giờ; recap `tim-so-tru-tom-tat` (60 − x = 25) trùng bộ số một câu kho ôn; quy tắc chữ số cuối chưa nói "không khớp" là so với gì.

## Các bước kế tiếp (theo thứ tự)

1. Đợi/đọc `nhom-2.md`; gộp vào danh sách. Sửa mọi Nghiêm trọng vòng 2 và các Nên sửa hợp lý trong `lesson.json` (và visual nếu cần); `pnpm format && pnpm content:check --stats`.
2. Mở Tổng hợp opus ghi lại `content/math/kntt/phep-cong-phep-tru/review.md` (vòng 2), chạy `pnpm content:hash phep-cong-phep-tru --root content --mark`, rồi commit `lesson.json` + `review.md` TRƯỚC khi sửa tiếp.
3. Sửa, commit, vòng 3 chỉ phần đổi: `pnpm content:diff phep-cong-phep-tru`, 1 reviewer opus; lặp tới 0 Nghiêm trọng (quy tắc: tối đa vài vòng).
4. Nạp lại nội dung cho server dev rồi walk: `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`; `CONTENT_INCLUDE_DRAFT=1 TEST_PORT=3240 WALK_BASE_URL=http://localhost:3240 pnpm lesson:walk phep-cong-phep-tru` và `pnpm visual:shot phep-cong-phep-tru` (cùng biến môi trường); đọc ảnh các màn đổi.
5. Khi 0 Nghiêm trọng: `pnpm content:hash phep-cong-phep-tru --root content --approve`, `pnpm content:lock`, rồi `pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm content:check`; commit.

## Rủi ro và lưu ý

- Dev server (cổng 3240, `CONTENT_INCLUDE_DRAFT=1`) chỉ đọc nội dung lúc `content:emit`: sửa `lesson.json` xong phải chạy lại emit, nếu không walk chụp bản cũ (đã dính một lần ở vòng 1). Server có thể đã tắt; `pnpm dev --port 3240` khởi động lại.
- Kiểm tra visual bằng reduced motion đo ngay sau khi đổi bước: component animate phải trả DOM cuối ngay khi `usePrefersReducedMotion()` (đã xử lý ở `Regroup`, `Swap`).
- Cách mượn trong đặt tính trừ (chữ số trên thêm 10, hàng trái bớt 1, chip "−1 +10") khác cách "nhớ 1 sang số trừ" ở tiểu học; chưa hỏi chủ dự án trẻ quen cách nào (Góp ý của reviewer).
- Bỏ không soạn: bài 1.37 (tìm chữ số), 1.38 (bảng vuông) của sách bài tập vì quá nâng cao; ví dụ mẫu đều dùng số riêng.
- Thời gian (giờ máy): nhận việc và dựng kế hoạch 20:07-20:20; soạn nội dung + 3 agent visual song song 20:20-20:45; sửa bố cục, shot, walk, đọc ảnh 20:45-21:15; review vòng 1 (reviewer + tổng hợp) 21:15-21:30; sửa theo vòng 1 + shot + walk 21:30-21:39; vòng 2 mở lúc 21:39.

## Cập nhật sau khi dừng
- `nhom-2.md` đã có (section `them-bot-cong` → `tim-so-hang`): 0 Nghiêm trọng, 8 Nên sửa, 5 Góp ý. Đáng sửa nhất: câu quy tắc mượn chưa nói so chữ số trên sau khi đã bớt 1 (vd 541 − 246); hàng chỉ cho mượn thiếu chip "−1"; `them-bot-cong` chỉ luyện một chiều chuyển số; `chon-tim-x` có hai nhiễu bằng nhau (61 + 28 và 28 + 61); dòng "3 − 1 − 7" dưới hình đặt tính khó hiểu. Đủ 3 nhóm → chạy bước Tổng hợp vòng 2.
