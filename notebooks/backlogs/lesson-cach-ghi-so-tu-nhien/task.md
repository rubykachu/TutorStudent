# Bàn giao: Bài 2 `cach-ghi-so-tu-nhien` (Cách ghi số tự nhiên)

## Trạng thái
- Cập nhật cuối: 02/10/2026. Bài đã duyệt: `status: published`, `reviewedHash` ghi, id đã khoá (`content:lock`), `content:emit` xong. 19 section. Review: vòng 1 (13 Nghiêm trọng), vòng 2 (8), vòng 3 chỉ phần đổi (0). Đọc hiểu Haiku ba lượt: `47/28/0`, `6/10/8`, `7/14/0`.
- Media xong (02/10/2026): giọng Mỹ Duyên (`video/projects/cach-ghi-so-tu-nhien/media.json`; Bài 1 là Hải Đăng, Bài 3 sẽ là Hải Đăng, xen kẽ), lời đọc tổng quan đọc bằng Gemini Vindemiatrix (không hết hạn mức, không phải VieNeu), ba video 48 đến 66 giây gắn đầu section `hang` (`cac-hang`, 2 điểm dừng), `gia-tri` (`gia-tri-chu-so`, 3 điểm dừng) và `chu-la-ma` (`dong-ho-la-ma`, 2 điểm dừng). Review vòng 4 (chỉ video và lời đọc, Sonnet): 0 Nghiêm trọng, 2 Nên sửa đã sửa; `content:hash --approve` và `content:lock` đã chạy lại.
- Việc tiếp theo: các mục "Việc còn lại" dưới đây. Chưa tải media lên và chưa deploy (cần chủ dự án đồng ý, theo `.claude/skills/lesson-video/SKILL.md` mục "Đưa lên production").

## Nguồn (sách bài tập, `sources/math/cach-ghi-so-tu-nhien/`, không commit)
- Đề: tr.7–10 in (PDF 8–11), tệp `sbt-p7.png` … `sbt-p10.png`. Lời giải: tr.94–95 (đầu tr.94 là Bài 1, phần Bài 2 bắt đầu từ giữa trang; tr.96 là Bài 3, 4), tệp `sbt-p94.png`, `sbt-p95.png`, `sbt-p96.png`.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 7-10 (rồi 94-96) --subject math --series kntt --slug cach-ghi-so-tu-nhien --book sbt --offset 1`. Ảnh trang đầu in "BÀI 2. CÁCH GHI SỐ TỰ NHIÊN", đúng tên bài.
- Chương I "Tập hợp các số tự nhiên"; `number: 2`, `order: 2`.
- Nội dung nguồn: kiến thức cần nhớ (ℕ, ℕ*, ghi số trong hệ thập phân: mười chữ số, hàng, giá trị chữ số, tổng giá trị các chữ số; số La Mã không quá 30), ví dụ 1 (tìm số có ba chữ số theo quan hệ giữa các chữ số), ví dụ 2 (lập số từ tập chữ số C = {0; 3; 6}), bài 1.8 – 1.21.

## Cấu trúc bài (17 section, khó dần)
Cơ bản: 1 `so-tu-nhien` (ℕ, ℕ*), 2 `chu-so` (mười chữ số, chữ số đầu khác 0), 3 `hang`, 4 `muoi-don-vi`, 5 `gia-tri`, 6 `tong-gia-tri` (mẹo viết số từ tổng, màn thao tác dạy `manipulate`). Số La Mã (đọc được trên đồng hồ): 7 `chu-la-ma`, 8 `doc-so-la-ma` (mẹo IV và VI), 9 `viet-so-la-ma`, 10 `que-tinh` (bài 1.21). Bài tìm số, khó nhất ở cuối: 11 `lon-be-nhat` (bài 1.10, mẹo cộng 1), 12 `chu-so-khac-nhau` (bài 1.11), 13 `them-dau-cuoi` (bài 1.14, mẹo nhân 10, 100, 1 000), 14 `them-lon-be` (bài 1.15, 1.16), 15 `so-hai-chu-so` (bài 1.8, 1.9, mẹo liệt kê có thứ tự), 16 `tap-cac-chu-so` (ví dụ 2, bài 1.12), 17 `tong-chu-so` (bài 1.13).
- Hình: `src/visuals/math/cach-ghi-so-tu-nhien/` (danh mục `catalog.ts`, mỗi hình một dòng dữ liệu). Loại hình của bài: `places` (chữ số với hàng, giá trị, tổng), `placesExplore` (chạm từng chữ số), `placesPick` (vùng chạm chữ số), `slots` (hình thao tác viết số bằng nút + −, validator `viet-so`), `gaps` (vùng chạm chỗ viết thêm chữ số), `clock`, `clockPick` (đồng hồ số La Mã), `sticks` (que tính), `romanCards`, `sticker`; dùng chung `rows`, `lines`, `chips` ở `src/visuals/shared/`. Bài có `tests/visuals/cach-ghi-so-tu-nhien.test.tsx`.
- Màu khái niệm: tập hợp teal, phần tử amber, chữ số blue, hàng violet, giá trị của chữ số pink, số La Mã lime, chữ số viết thêm sky (glossary: thêm "chữ số", "hàng", "giá trị của chữ số", "số La Mã", "chữ số viết thêm", "hệ thập phân", và các tên riêng ℕ, số La Mã II đến XXX). Sao "sky" cho chữ số viết thêm, "lime" cho số La Mã: hình dấu cộng của màu sky nằm cạnh chữ La Mã làm bé đọc nhầm thành phép cộng.
- Mẹo (5 khối `tip`): 6 tránh sai "Viết số từ tổng giá trị" (hàng thiếu số hạng thì viết 0), 8 tránh sai "Phân biệt IV và VI" (I trước V, X thì trừ), 11 hiểu nhanh "Từ số lớn nhất sang số bé nhất" (cộng 1), 13 làm nhanh "Nhân với 10, 100, 1 000" (viết thêm chữ số 0), 15 tránh sai "Liệt kê có thứ tự". Đã thử bằng chương trình khi dựng bài (số La Mã 1 đến 30, số có hàng thiếu, số lớn nhất và bé nhất có 2 đến 10 chữ số khác nhau, viết thêm 1, 2, 3 chữ số 0).

## Giả định (chủ dự án đang ngủ, không hỏi được)
- Slug `cach-ghi-so-tu-nhien` suy từ tiêu đề in trên trang; bộ sách `kntt`, chương I (`numeral: "I"`).
- Trẻ yếu số học tiểu học: mở bằng ℕ và ℕ*, rồi chữ số, hàng, giá trị, tổng giá trị, mỗi ý một section ngắn, ví dụ lấy từ tiền, số nhà, đồng hồ số La Mã. Bài khó của sách (ví dụ 1, 1.11, 1.13, 1.15, 1.16, 1.21) được bắc thang bằng các bước nhỏ trước.
- Số trong bài tự chọn, không lấy số của đề sách làm đề bài (trừ vài số khó tránh như bài que tính IV + V = XI, và "lớn nhất có sáu chữ số khác nhau" vẫn giữ dạng của sách 1.11).
- Số La Mã chỉ đến 30 như sách; các số La Mã II đến XXX được thêm vào `names` của glossary để chữ La Mã trong lời và ô điền không bị luật `[vietnamese]` chặn.
- Thứ tự section khác sách: sách xếp bài tập theo trang (1.8 đến 1.21), bài này đưa số La Mã (dễ, có đồng hồ) lên trước các bài tìm số (khó) để bé nghỉ sau phần hàng và giá trị.
- Ví dụ 1 của sách (số ba chữ số có chữ số hàng chục gấp 2 lần hàng đơn vị, hàng trăm gấp 3 lần hàng chục) chưa lấy: cần suy luận từng trường hợp; section 15 dạy cách thử từng chữ số hàng chục cho số có hai chữ số.
- Bài 1.12(b) (số ba chữ số lấy từ tập chữ số, 16 số) chỉ lấy dạng hai chữ số mỗi chữ số lấy từ {3; 6} (4 số) vì liệt kê 16 số quá dài cho bé.
- Bản quyền: `sources/` không commit; mọi đề viết bằng lời và số của mình.
- Chạy `lesson:walk` và `visual:shot` trong `git worktree` tạm (cổng 3310, `pnpm install --offline`, chép `.next/dev/cache`, `public/media` là symlink), đã gỡ sau khi xong.

## Việc còn lại
- Người thật nghe lại (reviewer và Whisper không nghe được cách đọc chữ cái): bốn câu của `dong-ho-la-ma` có chữ I, V, X, IV, IX (ba câu có `say` "i-vê", "i-ích"), và tên "Bạn cú" trong `cac-hang`, `gia-tri-chu-so` (Whisper nghe "cứu"); bé cần nghe một cách đọc duy nhất cho mỗi ký hiệu. Nếu sai thì sửa `say` rồi `pnpm video:build cach-ghi-so-tu-nhien dong-ho-la-ma` (chỉ câu đổi được đọc lại).
- Góp ý còn lại của vòng 4 (`review.md`): phụ đề lời đọc tổng quan tô chữ "000" và "đồng" cùng lúc (cue 4); video `dong-ho-la-ma` chưa giải nghĩa "thành phần" (chữ của bài chỉ giải nghĩa ở note thứ hai).
- Nên sửa của vòng 3 (`review.md`, không chặn duyệt): thiếu ví dụ cho ca "đi tiếp" và "không có chữ số nào" của quy tắc viết thêm chữ số; hình `tong-chu-so-vd` không nêu đề "tổng bằng 3"; ví dụ XXIX lặp ở note, màn chạm và recap; nhãn hình và `explain` còn từ cũ ("tách thành phần", "bỏ số 0", "dời"); `gia-tri-v` và `cham-la-ma-5` hỏi cùng một điều; quy tắc số bé nhất khác nhau rơi vế "cho đủ số chữ số"; `doi-vi-thanh-iv` lặp ca của `doi-1-que`; 14 mục còn "Hiểu mơ hồ" ở lượt đọc hiểu 3. Sửa chữ nào của bài thì chạy `pnpm content:diff`, lượt Haiku trên mục đổi, vòng chỉ phần đổi, rồi `content:hash --approve` lại.
- Lưu trữ: sau khi hết các mục trên, `git mv` thư mục này vào `notebooks/backlogs/archive/` kèm dòng "Archived: ...".
