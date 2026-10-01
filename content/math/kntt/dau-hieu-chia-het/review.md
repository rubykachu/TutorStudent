# Review: Dấu hiệu chia hết (`dau-hieu-chia-het`)

- Bài: `content/math/kntt/dau-hieu-chia-het/lesson.json`
- Vòng: 7 - chỉ phần đổi (`explain`: sửa chữ ở 12 câu sau vòng 6; soát lại đủ 82 `explain`)
- Nguồn đã đọc: không có (phần đổi chỉ là chữ trong `explain`; đối chiếu với đề, đáp án, lựa chọn, `accept`, `params` và các câu quy tắc `rule: true` của chính bài)
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường), 0 cảnh báo
- `lesson:walk`: không chạy (không đổi màn)
- Kết luận: Không còn lỗi Nghiêm trọng; điều phối chạy `pnpm content:hash dau-hieu-chia-het --approve`
- Bản đã review: `dcd12226ada54f60ca9a16f5dba22e236a604ecc9de04b15ab2b40f3a3c912e5` (`pnpm content:diff` so với bản này)
- Bản đã review: chưa ghi (điều phối ghi bằng `--approve`)

Đã soát vòng 6 (`tan-cung-5`, `chon-lap-2-5`, `o-trong-2`, `chon-nhieu-tich-5`, sáu câu "thoả" ở `chon-nhieu-5`, `chon-3-5-345`, `chon-nhieu-3-5`, `xep-1530`, `chia-3-5-45`, `dem-2-3`, `chon-chia-het-9`, `gop-tien-25-32`, `hop-banh-tui`): cả 8 mục đã sửa đúng toán, không sinh lỗi mới.
- `tan-cung-5`: "tận cùng 8 không chia hết cho 5", 18 : 5 được 3 dư 3, khớp câu quy tắc (0 hoặc 5).
- `chon-lap-2-5`: "trong ba số đã cho, chỉ có 250 tận cùng là 0", không còn khẳng định duy nhất.
- `chon-nhieu-tich-5`: `wrong` a, d nay xét tận cùng của tích (24, 27), không suy ngược chiều quy tắc.
- `o-trong-2`: `tex` dùng `\quad` đúng; `hop-banh-tui`: `tex` 56, 8 : 4 = 2, 7 · 2 = 14 khớp đáp án 14.
- "thoả" không còn trong bài; `dem-2-3`, `chon-chia-het-9`, `gop-tien-25-32` (a: tổng 57; c: 32 quyết định) đúng.

Đã soát chung 82 `explain`: tự tính lại mọi tổng chữ số, phép chia trong `tex`, danh sách số và số lần lập (`dem-so-124` = 4, `lap-so-014` = 3), `tim-chu-so-*`, `o-trong-*`, `nhan-9-ab` (d = 6), điểm trắc nghiệm (`diem-*`, `hoc-tinh-sai-52`), tiền bút và vở (`tien-but-40`, `mua-vo-45`, `tien-but-60`, `mua-vo-65`); mọi `wrong[].optionId` có trong phương án, không phương án đúng nào bị đưa vào `wrong`, lý do khớp số của phương án. Mọi `explain.text` không quá 3 câu, không "…", không "Đúng rồi/Sai rồi"; không có mẹo sai với số khác (các câu tích, tổng, hiệu và luỹ thừa của 10 chỉ dùng chiều quy tắc đã dạy).

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

Không có.
