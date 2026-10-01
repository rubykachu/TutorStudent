# Bàn giao: Bài 8 `quan-he-chia-het-va-tinh-chat` (Quan hệ chia hết và tính chất)

## Trạng thái
- Nội dung đã xuất bản (`status: published`, hash đã duyệt, id đã khoá). Review 5 vòng: vòng 1 (8 Nghiêm trọng), vòng 2 (3), vòng 3 (1), vòng 4 (0 Nghiêm trọng, 0 Nên sửa, 1 Góp ý), vòng 5 (video và lời đọc: 0 Nghiêm trọng, 4 Nên sửa đã sửa, 3 Góp ý).
- Lời đọc và 3 video đã dựng và đã review vòng 5 (chỉ phần đổi, 0 Nghiêm trọng, 4 Nên sửa về lời video đã sửa và dựng lại, 02/10/2026). Id 3 video đã khoá, `reviewedHash` đã ghi, `content:check` 0 lỗi, `lesson:walk` 0 lỗi.
- Giải thích sau mỗi câu (`explain`) đã có cho cả 68 câu (02/10/2026): review chỉ phần đổi 2 lượt (0 Nghiêm trọng; Nên sửa và Góp ý đã sửa, xem `review.md`), `reviewedHash` mới, `content:check` 0 lỗi, `lesson:walk` 0 lỗi; bài đã xoá khỏi `content/legacy-lessons.json`. Video, lời đọc và id không đổi.
- Soạn đêm 01/10/2026 thay cho buổi hỏi đáp đầu vào vì chủ dự án đang ngủ; các giả định ở mục "Giả định".

## Nguồn (sách bài tập, `sources/math/quan-he-chia-het-va-tinh-chat/`, không commit)
- Đề: tr.30–32 in (PDF 31–33), tệp `sbt-p30.png` tới `sbt-p32.png`. Bài 9 "Dấu hiệu chia hết" bắt đầu ở tr.33.
- Lời giải: tr.104 (phần dưới, câu 2.1–2.6) và tr.105 (câu 2.7–2.11), tệp `sbt-p104.png`, `sbt-p105.png`. Nhập bằng `pnpm sources:import <pdf> --pages 30-32 (rồi 104-105) --subject math --series kntt --slug quan-he-chia-het-va-tinh-chat --book sbt --offset 1`.
- Chương II "Tính chia hết trong tập hợp các số tự nhiên"; bài in là "Bài 8. Quan hệ chia hết và tính chất".
- Nội dung nguồn: kiến thức (a = k · b; ước, bội; tính chất của tổng), 2 ví dụ, câu 2.1–2.11.
- Đáp án câu 2.5 trong sách chỉ ghi ý a); ý b) tự tính: 1 930 + 100 + 2 021 không chia hết cho 5 vì 2 021 không chia hết cho 5.

## Lời đọc và video
- Giọng: `my-duyen` (Mỹ Duyên), khai ở `video/projects/quan-he-chia-het-va-tinh-chat/media.json`. Lý do: Bài 5, 6, 7 đều Hải Đăng nên xen giọng nữ cho bé đỡ nhàm; bài mở đầu một mạch kiến thức mới (chia đều, ước, bội), nhẹ nhàng, không có lý do riêng để giữ giọng nam.
- Video (id `quan-he-chia-het-va-tinh-chat.video.<tên>`, gắn ở đầu section):
  - `chia-het` 57,3 s, section `chia-deu`, clip `chia-deu` cho card `chia-deu`.
  - `uoc-boi` 65,9 s, section `uoc-boi`, clip `uoc-boi` cho card `uoc-boi`.
  - `tinh-chat-tong` 77,8 s, section `tong-chia-het`, hai clip: `tong-chia-het` (card `tong-chia-het`) và `tong-khong-chia-het` (card `tong-khong-chia-het`, dạy luôn ở video này vì mỗi section chỉ một video).
- Lời đọc tổng quan 51 s. `pnpm video:check` đạt. Whisper: mọi câu >= 97%. Vòng 5 đổi lời: "Bạn cú xếp đều ..." (hai video đầu, tránh nhầm "Bạn" với "Bạn cú"), `uoc-boi` dùng nguyên văn câu "mỗi thừa số khác 0 là một ước của tích", `tinh-chat-tong` bỏ cách nói "xếp vừa các túi 6 cái" (khó hiểu) dùng "xếp đều vào các túi, mỗi túi 6 cái". Độ dài nay: `chia-het` 57,3 s, `uoc-boi` 65,9 s, `tinh-chat-tong` 77,8 s.
- Chưa có video cho hiệu (section `hieu-chia-het`, `hieu-khong-chia-het`) và các section sau; làm thêm nếu chủ dự án muốn.

## Giả định (không hỏi được chủ dự án)
- Trẻ yếu nhân chia và chưa viết được kí hiệu tập hợp: bài bắc thang từ "chia đều không thừa" (kẹo, túi), kiểm bằng bảng nhân hay phép chia có dư, chưa dùng kí hiệu ∈ ∉ hay tập hợp.
- Kí hiệu chia hết viết trong công thức bằng `\chiahet` và `\khongchiahet` (hai macro TeX trong `src/lib/tex.ts`), lint tính được mệnh đề chia hết.
- Tính chất của hiệu (sách có ở "Kĩ năng" và câu 2.7) dạy cùng cách với tổng.
- Quy ước "a · b là a được lấy b lần" của Bài 5 giữ nguyên.

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
Không còn việc chặn. Hình gợi ý của `dien-du-14-7` và caption `tong-12-18-6` đã sửa (review vòng 7, 02/10/2026). Phần còn lại là các mục ở "Để lại" bên dưới, kiểm kê và quyết định từng mục tại `notebooks/backlogs/fix-earlier-lessons/task.md`.

## Vòng 1 review đã sửa (02/10/2026)
- Cả 8 Nghiêm trọng và Nên sửa 1–8, 10–13, 15–28 đã sửa; Góp ý 1–11, 14–17 đã sửa.
- Cách nói số chia trong sáu quy tắc tính chất: "chia hết cho một số ... cho số đó", không dùng chữ m. Note, recap section, recap card khớp từng chữ. Quy tắc số dư giới thiệu a, b, q, r ngay trong note.
- Chưa có video, lời đọc hay glossary video nào cần đồng bộ. Glossary môn thêm "chia hết", "ước", "bội".
- Kiểm: content:check 0 lỗi, visual:shot 152/152 đã xem ảnh, lesson:walk do điều phối chạy.

## Vòng 2 review đã sửa (02/10/2026)
- Cả 3 Nghiêm trọng, cả 11 Nên sửa và cả 21 Góp ý đã sửa; không bỏ mục nào.
- Ví dụ 52 quyển vở đổi thành "các chồng 4 quyển thì được 13 chồng" để số chia là số cái trong một nhóm; hình `chia-du-52-4` thêm dòng `52 : 4 = 13` và giữ `52 = 4 · 13`.
- Quy tắc tìm ước, tìm bội thêm "khác 0"; hai quy tắc tính chất của tổng và hiệu dùng khuôn "Nếu ... thì ..." với chữ "đều" (quy tắc tổng không chia hết phải chia hai câu vì giới hạn 25 âm tiết). Note, recap section, recap card khớp từng chữ.
- Hình đổi số: gợi ý `chia-tui-goi-y-19-5`, `dem-cach-goi-y-7-37`, `hieu-goi-y-22-8`, `nhom-goi-y-2`; ví dụ hiệu `hieu-36-12-6`. `sumBars` nhận tên hộp/túi (`bag`), thêm dòng "dùng mấy hộp" (`countBags`) và chỉ in "Còn thừa" khi có phần thừa; hình bội tô số 0 cùng màu "Bội"; hàng phụ "vì ..." của `nhom-5-mu`, `nhom-2-mu` vẽ trong khung nét đứt (`aside`).
- Section `tong-chia-het`: gộp hai màn ví dụ, màn thứ hai thành chip `chon-tong-5`. Lint chia hết trả `undefined` khi một vế âm.
- Id đã đổi (bài chưa khoá id): `ex.dien-tong-4`, `ex.tim-uoc-10`, `ex.chon-nhieu-uoc-22`, `ex.chon-nhieu-chia-het-8`, `ex.tong-30-4` (nay là câu chọn, không còn hỏi số dư).

## Để lại
- Nên sửa 9 (màu Số hạng xanh dương trùng Số bị chia, Tổng cam trùng Thương): màu của "số hạng", "tổng" do glossary môn giữ và bài khác đang dùng; đổi chỉ trong bài này bị lint chặn, đổi glossary ảnh hưởng bài đã xuất bản. Đã sửa phần của bài: hình bước nhảy dùng xanh dương cho số bị chia, chỗ dừng trung tính.
- Nên sửa 14, riêng section `nhom-so-hang`: không có tình huống đời sống tự nhiên cho việc đặt thừa số chung của luỹ thừa.
- Góp ý 11 (nấc 1 tô cả đề) còn ở `tim-tui-40-16`, `mua-hop-10-20`, `du-tong-30-4`: đề một khối, không chặn; chỉ `chon-so-hang-khong-7` đã tách công thức.
- Góp ý 12 (khái niệm của card hiệu): thêm "Hiệu" màu teal trùng màu thẻ "chia hết" của hình; giữ nguyên.
- Góp ý 13 (chú giải "Thừa số" cho hình `tim-uoc-18`): thuật ngữ đã học ở Bài 5, giữ nguyên.
