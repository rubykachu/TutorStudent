# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Vòng: 14 - chỉ phần đổi (`pnpm content:diff luy-thua --root content`), section: `luy-thua.section.chia-cung-co-so` (recap thêm câu điều kiện số mũ), `luy-thua.ex.chon-co-so-2` (cặp 2³, 3² đổi thành 2⁹, 9²); soát cùng section `luy-thua.section.co-so-so-mu`
- Nguồn đã đọc: `sources/math/luy-thua/` - `p22.png`, `p23-24.png` có trên máy; chữ quy tắc không đổi so với bản đã review nên không mở lại
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 1 cảnh báo `[guides]` của bài hiện ra (numericPower ở `exercises[12]`, xem Nên sửa 1); các cảnh báo khác thuộc bài khác
- `lesson:walk`: không chạy (điều phối chạy; vòng này chỉ đổi một câu caption và hai lựa chọn công thức)
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 1 Nên sửa, 0 Góp ý
- Bản đã review: `bd2f5ec4acb81619b245df570bf6cd9f5435bbbd27c4db7a4b58ba44b10bfce4` (`pnpm content:diff` so với bản này)

Đã soát đạt:
- Recap `chia-cung-co-so` có đúng hai câu (lint ≤ 2 câu), trùng từng chữ với câu quy tắc `rule: true` của section (so bằng máy: bằng nhau), và lặp lại đúng quy tắc: giữ nguyên cơ số, lấy số mũ thứ nhất trừ số mũ thứ hai, điều kiện số mũ thứ nhất lớn hơn hoặc bằng số mũ thứ hai, cơ số khác 0. Khớp tr.24. Hình recap `tom-tat-chia` (5⁶ : 5² = 5⁶⁻² = 5⁴) không mâu thuẫn.
- Lời video `chia-cung-co-so` (`script.json`): scene `s04-quy-tac` có đúng hai câu `rule: true`, trùng quy tắc và điều kiện số mũ; `s05`, `s06` nói số mũ 0 và quy ước, không trái recap.
- `chon-co-so-2` (chọn tất cả, `answer` = a, c) tự giải: 2⁶ cơ số 2 (đúng); 6² cơ số 6 (sai, đảo cơ số và số mũ của 2⁶); 2⁹ cơ số 2 (đúng); 9² cơ số 9 (sai, đảo của 2⁹). Đúng hai đáp án, hai nhiễu là lỗi nhầm cơ số và số mũ thật, đề ghi "Chọn tất cả".
- LL-07 trong section `co-so-so-mu`: số mới 2⁹, 9², 2⁶, 6² không trùng hình `tao-luy-thua` (mở ra 2³), hình `the-co-so-so-mu` (4³), `bam-mu` (2⁵), recap (chữ tổng quát aⁿ), `viet-4-mu-3` (4³), `tao-5-mu-3` (5³), `viet-gon-3-mu-4` (3⁴), `cham-co-so`. 9² có ở câu `match` của section khác (bài khác section), không ảnh hưởng LL-07.
- Gợi ý của `chon-co-so-2`: nấc 1 trống kèm `hintVisualId` `dinh-nghia` (hình aⁿ chữ tổng quát, không có số của đề, không lộ đáp án); không đổi theo số mới.
- Mọi mục còn lại của hai section khớp checklist: ghi chú quy tắc `co-so-so-mu` và recap trùng từng chữ, `chon-6-mu-3` (6⁵ : 6² = 6³, nhiễu 6⁷ cộng số mũ, 1³ nhầm cơ số) và `chia-9` (9⁸ : 9³ = 9⁵) đúng.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Màn dạy cách nhập luỹ thừa nằm sau câu nhập luỹ thừa đầu tiên

- Vị trí: `$.exercises[?(@.id=="luy-thua.ex.viet-gon-10")]` (`numeric`, card `luy-thua.card.viet-luy-thua`, section đầu) và `$.sections[1].blocks[2].guide` (`luy-thua.section.co-so-so-mu`)
- Nguồn: —
- Vấn đề: `content:check` cảnh báo `[guides]` ở `exercises[12]`: câu đáp án luỹ thừa đầu tiên (luyện card `viet-luy-thua`) đứng trước màn hướng dẫn nhập ở section 2; trẻ gặp ô nhập luỹ thừa mà chưa được chỉ cách bấm phím "mũ" (luật người học chậm: dạy thao tác nhập trước lần dùng đầu). Không do vòng này tạo ra nhưng dấu `guide` mới làm lộ.
- Sửa: chuyển nhóm `guide: numericPower` (note + `bam-mu`) lên section `luy-thua-la-gi`, hoặc thêm một màn hướng dẫn ở section đó.

## Góp ý

Không có.
