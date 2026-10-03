# Bàn giao: Bài 20 `chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc` (Chu vi và diện tích của một số tứ giác đã học)

## Trạng thái
- Cập nhật cuối: 03/10/2026. Bài đã soạn xong ở trạng thái `draft`: 11 phần (10 phần bài và phần cuối `bookPractice`), 10 thẻ, 80 câu, 80 hình đang dùng (9 hình tương tác), 4 mẹo, `minutes` tổng 72 phút. Chưa review, chưa `content:hash --approve`, chưa `content:lock` (còn cảnh báo "111 id chưa có trong `ids.lock.json`" của `content:check`), chưa có lời đọc và video, chưa deploy.
- Kiểm đã chạy: xem mục "Kiểm đã chạy".
- Việc kế tiếp: vòng review 1 (3 Opus Reviewer và 1 Opus Tổng hợp) do một phiên mới chạy theo mục "Giao việc review vòng 1". Người soạn không review và không duyệt bài này.

## Nguồn (sách bài tập, `sources/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/`, không commit)
- Đề: tr.70–73 in (PDF 71–74), tệp `sbt-p70.png` đến `sbt-p73.png`. Tr.70 có tên bài, "Kiến thức cần nhớ" (công thức chu vi và diện tích của hình vuông, hình chữ nhật, hình thang, hình bình hành, hình thoi); tr.71 có "Kĩ năng giải toán", ví dụ 1 (nền nhà 8 m và 6 m lát gạch cạnh 40 cm) và ví dụ 2 (hình bình hành đáy 10 cm, chiều cao 4 cm); tr.72 có bài 4.20 đến 4.24 (Hình 4.19, 4.20); tr.73 có bài 4.25 đến 4.28 (ảnh viên đá lục giác và ảnh sân lát đá). Tr.74 là "Ôn tập chương IV" (không thuộc bài này).
- Lời giải: tr.115–116 in (PDF 116–117), tệp `sbt-p115.png` và `sbt-p116.png`: lời giải Bài 20 bắt đầu cuối tr.115 (4.20 đến 4.23) và hết ở giữa tr.116 (4.24 đến 4.28), sau đó là "Ôn tập chương IV". Sách in đủ lời giải cả chín bài.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 70-73 (rồi 115-116) --subject math --series kntt --slug chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc --book sbt --offset 1`.
- Chương IV "Một số hình phẳng trong thực tiễn"; `number: 20`, `order: 20`, `chapter` `{ numeral: "IV", name: "Một số hình phẳng trong thực tiễn" }`.
- Nội dung nguồn: công thức hình vuông `C = 4a`, `S = a²`; hình chữ nhật `C = 2(a + b)`, `S = ab`; hình thang `C = a + b + c + d`, `S = ½(a + b)h`; hình bình hành `C = 2(a + b)`, `S = ah` (h là chiều cao tương ứng); hình thoi `C = 4a`, `S = ½ab` (a, b là hai đường chéo); bài 4.20 đến 4.28 (chín bài, 4.22 có bốn ý a) đến d)).

## Giả định (chủ dự án không hỏi được, ghi theo yêu cầu)
- Slug `chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc` (từ tiêu đề trên trang); nguồn là sách bài tập (không có trang SGK), đã nạp cả trang đề và trang lời giải. Hình của sách vẽ lại bằng hình vẽ của bài, không chép hình sách.
- Ví dụ 1 và 2 của sách không phải bài đánh số nên không có `bookRef`, và không chép: số liệu của bài dạy khác ví dụ (phòng 6 m và 4 m lát gạch 50 cm, hình bình hành đáy 6 cm cao 3 cm).
- Bài 20 chỉ dùng kiến thức trên trang sách bài tập và chuẩn lớp 6. Các điều dưới đây không in thành câu trên các trang đã nạp nhưng cần để làm bài 4.20 đến 4.28 và để người học chậm theo kịp; Reviewer xét theo luật "Không có trong sách" (đề xuất của người soạn: giữ, vì suy ra trực tiếp từ công thức tr.70, ví dụ 1 tr.71 và đề bài):
  1. Ý nghĩa của chu vi và diện tích, ô vuông đơn vị, đơn vị cm² và m² (kiến thức nền tiểu học; glossary đánh dấu `prerequisite` cho "chu vi", "diện tích", "đơn vị đo"; `sourceRef` của phần 1, 4, 9 và thẻ của chúng ghi "Kiến thức nền (tiểu học)").
  2. Đổi đơn vị: 1 m = 100 cm, 0,1 m = 10 cm, 1 m² = 10 000 cm² (ví dụ 1 tr.71 dùng 1 600 cm² = 0,16 m²). Bài dạy đổi số đo độ dài ra cm trước khi tính (phần 9) và dùng cách đếm gạch theo hàng (số viên mỗi hàng bằng chiều dài sân chia cho cạnh gạch, đều đổi ra cm) cho 4.27 và câu dẫn của 4.27, 4.28 để khỏi chia số thập phân; lời giải của sách chia diện tích sân cho diện tích một viên gạch (135 : 0,36). Hai cách cho cùng đáp án 75.
  3. Chu vi hình thang cân bằng tổng bốn cạnh, hai cạnh bên bằng nhau (sách nêu cho hình thang `a + b + c + d`).
  4. Hình khuyết một góc vuông: chu vi bằng chu vi hình chữ nhật bao quanh, diện tích bằng hình chữ nhật lớn trừ phần khuyết (lời giải 4.24 của sách).
  5. Chiều cao của hình bình hành và của hình thang cân là đoạn vuông góc với cạnh đáy; hình bình hành cắt tam giác rồi trượt thành hình chữ nhật, hai hình thang cân ghép thành hình bình hành đáy `a + b`, bốn tam giác nằm ngoài hình thoi xoay nửa vòng quanh trung điểm cạnh thoi thì phủ vừa khít hình thoi (suy ra diện tích hình thoi bằng một nửa hình chữ nhật bao quanh, đúng hình sách vẽ ở tr.70).
  6. Cách kể từ "Hai cạnh kề nhau là hai cạnh nối với nhau ở một đỉnh" (định nghĩa ngắn ở màn đầu phần 3).
- Công thức hình thoi `S = a · b : 2` và hình thang cân `S = (a + b) · h : 2` viết bằng dấu chia, và quy tắc nói "chia cho 2" thay vì phân số ½ (phân số chưa học; sách in ½).
- Màu khái niệm: Chu vi blue, Diện tích teal, Chiều cao violet, Đường chéo amber, Đơn vị đo sky (đã thêm vào `content/glossary/math.json` các từ chu vi, diện tích, đơn vị đo, chiều cao). Màu hình không đứng trong câu chọn hình: hình lựa chọn của câu "Hình nào vẽ đúng chiều cao" đều vẽ đoạn h cùng kiểu (nét đậm tím, nhãn h, không dấu góc vuông).
- Số trong bài nhỏ. Số của các tầng tách nhau: màn dạy (vườn 8 m và 5 m, vuông 6 m, sân 7 m và 4 m, thoi cạnh 5 cm, bình hành 6 cm và 4 cm, thang cân 5 m và 9 m, bình hành 6 cm cao 3 cm, thoi đường chéo 8 cm và 6 cm, thang cân 4 cm và 8 cm cao 3 cm), câu kiểm tra, câu luyện, kho ôn, câu dẫn (9 cm và 6 cm, 72 cm² và 9 cm, 40 cm và 30 cm, 10 m và 6 m, 6 cm và 10 cm cao 5 cm, 600 m² và 20 m, 12 m và 6 m, 0,5 m, 10 m và 6 m), và số của sách (10 cm và 8 cm, 56 cm², 5 cm, 6 cm và 10 cm, 12 cm, Hình 4.19, Hình 4.20, 10 cm và 20 cm cao 8,6 cm, 3 600 m², 15 m và 9 m, 20 m và 30 m).
- Đơn vị nằm trong đề (cm, m, cm², m²), không đặt `unit` của câu `numeric` (lint `[fields]` chưa phân loại trường này). Số thập phân viết bằng dấu phẩy, hàng nghìn ngăn bằng U+202F, đúng như sách.

## Cấu trúc bài (11 phần; 10 phần đầu mỗi phần một ý và một thẻ cùng tên)
1. `chu-vi-la-gi` Chu vi là gì (đi một vòng quanh vườn, chu vi là tổng độ dài các cạnh; đi quanh mảnh đất hình thang cân).
2. `chu-vi-vuong-thoi` Chu vi hình vuông và hình thoi (bốn cạnh bằng nhau, `C = 4 · a`).
3. `chu-vi-chu-nhat-binh-hanh` Chu vi hình chữ nhật và hình bình hành (`C = 2 · (a + b)`, hai cạnh kề nhau).
4. `dien-tich-la-gi` Diện tích là gì (ô vuông đơn vị, cm² và m², đếm ô vuông).
5. `dien-tich-chu-nhat-vuong` Diện tích hình chữ nhật và hình vuông (`S = a · b`, `S = a · a`; xếp gạch theo hàng).
6. `dien-tich-binh-hanh` Diện tích hình bình hành (chiều cao, cắt và trượt thành hình chữ nhật, `S = a · h`); có mẹo "Chọn đúng chiều cao".
7. `dien-tich-thoi` Diện tích hình thoi (hai đường chéo, hình chữ nhật bao quanh, xoay bốn tam giác vào trong; `S = a · b : 2`).
8. `dien-tich-thang-can` Diện tích hình thang cân (ghép hai hình thang thành hình bình hành, `S = (a + b) · h : 2`); có mẹo "Chiều cao hình thang cân".
9. `doi-don-vi` Đổi đơn vị (1 m = 100 cm, 0,1 m = 10 cm, 1 m² = 10 000 cm²); có mẹo "Cùng đơn vị rồi mới tính".
10. `bai-toan-doi-song` Rào vườn, lát sàn, sơn tường (rào quanh hay viền quanh tính chu vi, lát hay sơn kín tính diện tích; rào có cửa, đếm gạch theo hàng); có mẹo "Hàng rào có cửa".
11. `bai-tap-sach-bai-tap` Bài tập sách bài tập (phần cuối, `bookPractice`): bài 4.20 đến 4.28 (12 câu sách: 4.20, 4.21, 4.22a đến 4.22d, 4.23 đến 4.28) và 16 câu dẫn; 4 khối "Nhắc lại" (câu quy tắc lặp nguyên văn câu của các phần trên).
- Mỗi phần dạy có 3 hoặc 4 màn: một hình chạy từng bước, màn quy tắc (`note` có `rule: true` và hình có nhãn), màn "Cùng làm" (hình tương tác); các phần 6, 8, 9, 10 thêm mẹo. Mỗi phần: 2 câu kiểm tra, 1 câu luyện tập (`practiceIds`) và 2 hay 3 câu kho ôn.
- Bảy dạng câu: `choice` 27 (8 câu chọn nhiều đáp án), `numeric` 45, `fillBlank` 3, `tapRegion` 1, `manipulate` 1, `order` 2, `match` 1.
- Đọc `docs/learner.md`: bé chậm, yếu đọc; mỗi câu chữ ≤ 25 âm tiết, mỗi `note` ≤ 2 câu; mỗi phần có tình huống đời sống (vườn, khung ảnh, sân trường, thảm, gạch, tường, diều, mảnh đất).

## Hình (`src/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/`)
- Dùng lại từ `src/visuals/shared/plane/`: `figure-spec.ts`, `figure.tsx` (vẽ hình có nhãn, vạch bằng nhau, dấu góc vuông), `figure-steps.tsx` (hình chạy từng bước), `probe.tsx` (chạm để đổi số đo), `geometry.ts`. Không sửa tệp dùng chung nào.
- Hình riêng của bài:
  - `figures.ts` (đặt tên đỉnh A, B, C, …, ghi số đo ngoài cạnh, lưới ô vuông, tứ giác biết bốn cạnh), `shapes.ts` (tọa độ chung của hình bình hành cắt, hình thoi trong hộp, hình thang và bản sao xoay nửa vòng), `models.ts` (kiểu dữ liệu thuần của các hình tương tác), `spec.ts` (kiểu `VisualSpec`, hình nào tính là tương tác), `logic.ts` (validator và solver `xep-gach`), `builders.ts`.
  - Thành phần tương tác: `walk.tsx` (đi một vòng quanh hình, nút "Đi tiếp", cộng các cạnh đã đi), `tiles.tsx` (chạm từng ô vuông để đếm), `floor.tsx` (xếp ô vuông theo hàng và số hàng, dùng cho cả màn dạy và câu `manipulate`), `stage.tsx` (cắt và trượt, ghép bản sao xoay nửa vòng, chạm xoay tam giác ngoài hình thoi), `calc.tsx` (lời giải từng dòng, dùng cho hình gợi ý nấc 2 dừng ở "?" và hình lời giải nấc 3), `gallery.tsx`, `sticker.tsx`; `examples.tsx` đăng ký vào registry.
  - Catalog: `catalog-chu-vi.ts` (phần 1 đến 3), `catalog-dien-tich.ts` (phần 4 đến 8), `catalog-don-vi.ts` (phần 9, 10), `catalog-book.ts` (hình của bài sách, của câu dẫn, của phần nhắc lại, và với mỗi bài sách một hình gợi ý nấc 2 và một hình lời giải nấc 3), `catalog.ts` gộp và báo lỗi khi trùng khóa.
  - Test: `tests/visuals/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc.test.tsx` (hình học của mọi hình chuyển động, hình lục giác 4.25 gồm 8 hình thang cùng diện tích, đi một vòng, đếm ô vuông, xếp gạch, các stage); mẫu `xep-gach` thêm vào `tests/visuals/registry.test.tsx`.
- Hình gợi ý nấc 2 của câu sách là hình `calc` cùng các bước với số khác và dừng ở "?"; hình lời giải nấc 3 chạy trọn các bước với số của đề.
- Hình 4.19 (ô thoáng 80 cm và 60 cm, khung hình thoi nối trung điểm bốn cạnh, hai đường nối trung điểm đối nhau), Hình 4.20 (mảnh vườn khuyết góc, tên điểm A đến F) vẽ lại đúng nhãn của sách. Hình bên đề 4.25 (ảnh viên đá lát) vẽ lại thành lục giác đều gồm 8 hình thang cân (hai nửa ở giữa và sáu hình quanh, xếp kiểu hoa); ảnh sách xếp các viên theo kiểu xoay, cùng 8 viên và cùng diện tích (lời giải sách nhân 8).

## Bài cần thao tác và cách chấm
- Bài 4.20 và 4.24 có hai đáp án (diện tích và chu vi): `fillBlank` gõ hai ô, như SBT 2.63 của Ôn tập chương II; lời đề giữ nguyên, hai ô là lời của bài.
- Bài 4.23: sách không in lựa chọn; `choice` "Đủ" và "Không đủ" (khối lệnh của app "Chọn đáp án đúng." ở cuối đề).
- Bài 4.21, 4.22a đến 4.22d, 4.25 đến 4.28: `numeric`; đơn vị ghi ở khối lệnh cuối đề ("Nhập số đo, tính bằng cm.").
- `manipulate` `xep-gach` (xếp ô vuông phủ kín sàn): chấm khi số ô mỗi hàng và số hàng đúng với sàn của đề; màn dạy phần 5 dùng cùng hình với sàn 5 m và 3 m.

## Mẹo (4 khối `tip`, đều "tránh sai"; đã thử bằng chương trình tạm, không commit)
- `chon-chieu-cao` (phần 6): chiều cao vuông góc với đáy, cạnh bên nghiêng dài hơn chiều cao. Thử hình bình hành đáy 6, 8, 9, 10, 1, 20, 14 và 100 với các độ nghiêng khác nhau: diện tích bằng đáy nhân chiều cao ở mọi trường hợp, cạnh nghiêng luôn dài hơn chiều cao.
- `chieu-cao-thang` (phần 8): cùng ý cho hình thang cân. Thử các cặp đáy (8, 4), (7, 3), (12, 6), (10, 4), (30, 20), (9, 1), (15, 9), (2, 1): diện tích bằng (a + b) · h : 2 và cạnh bên dài hơn chiều cao.
- `cung-don-vi` (phần 9): đổi cùng đơn vị rồi mới tính. Thử 2 m và 50 cm, 3 m và 20 cm, 0,5 m và 60 cm, 1,5 m và 40 cm, 4 m và 100 cm: nhân m với cm ra số sai, đổi ra cm ra số đúng.
- `rao-co-cua` (phần 10): chu vi trừ chiều rộng cửa. Thử vườn 20 m và 12 m cửa 3 m, 15 và 10 cửa 2, 40 và 90 cửa 5, 30 và 20 cửa 2, 8 và 5 cửa 1, 50 và 30 cửa 4: chu vi trừ cửa bằng độ dài các đoạn hàng rào thật.

## Đọc hiểu (Haiku, `.shots/review/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/`, không commit)
- Lượt 1 (toàn bài, tệp `doc-hieu.md`): 210 mục hiểu rõ, 8 hiểu mơ hồ, 0 khó hiểu. Đã viết lại 8 mục (mục tiêu "đổi mét ra xăng-ti-mét", định nghĩa "kề", cách đọc cm² và m², câu định nghĩa chiều cao, câu xoay tam giác của hình thoi, quy tắc diện tích hình thoi nói "chia cho 2", câu ghép hai hình thang).
- Lượt 2 (mục đã viết lại và các câu mới đổi sang chọn đáp án, tệp `doc-hieu-2.md`): 94 hiểu rõ, 10 hiểu mơ hồ, 1 khó hiểu. Chín trong mười mục mơ hồ chỉ vì từ của bài (mét vuông, tích, vuông góc, đường chéo, hình thang cân, diện tích, đơn vị): các từ này đã dạy ở bài trước hay ở chính bài này, nên giữ. Mục khó hiểu là câu mở phần 7 ("bao quanh", "phủ vừa khít"); đã viết lại thành "đi qua bốn đỉnh của hình thoi" và "lấp đầy hình thoi" (cả `caption` các bước của hình và lời kết của màn "Cùng làm"). Chưa chạy lượt 3 cho mục này.

## Kiểm đã chạy
- (đang chạy lần cuối, xem commit kế tiếp)

## Việc nên làm ở vòng sau
- Reviewer xét độ dài: bài 72 phút (60 đến 80), phần bài tập sách bài tập 22 phút với 28 câu.
- Phần 9 (đổi đơn vị) đọc số thập phân 0,1 m và 0,5 m; xét bé chậm có theo kịp không và thước một mét đã đủ để thấy 0,1 m là 10 cm.
- Số `numeric` chiếm 45 trên 80 câu; câu `choice` có `wrong` đủ cho lỗi hay gặp (nhân thay vì cộng, quên chia cho 2, dùng cạnh bên làm chiều cao, nhầm chu vi và diện tích). Xét có cần thêm dạng câu khác ở phần 5 đến 8.
- Chưa làm theo yêu cầu: lời đọc và video, `content:lock`, review và duyệt.

## Điểm nghi cho Reviewer
- Các điều ngoài trang sách ở mục "Giả định" (định nghĩa chu vi, diện tích, đổi đơn vị, hình khuyết, ghép cắt hình).
- Bài 4.25: hình bên được vẽ lại (xếp kiểu hoa) khác ảnh sách (xếp kiểu xoay); đề giữ nguyên chữ "như hình bên".
- Bài 4.27 và câu dẫn 4.27, 4.28 giải bằng cách đếm gạch theo hàng sau khi đổi ra cm; cách của sách chia diện tích sân cho diện tích một viên gạch. Xét câu `explain` có đúng và dễ theo hơn không.
- Bài 4.20 và 4.24 gõ hai ô; bài 4.23 chỉ có hai lựa chọn.
- Màn "Cùng làm" phần 7: bốn tam giác ngoài hình thoi xoay nửa vòng quanh trung điểm cạnh thoi (không gấp, vì gấp qua cạnh thoi không phủ vừa khít khi hai đường chéo khác nhau).
- Công thức hình thoi và hình thang cân viết với dấu chia và "chia cho 2" thay vì phân số.

## Giao việc review vòng 1 (cho phiên mới, không phải người soạn)
Chạy `.claude/skills/lesson-review` mục "Vòng toàn bài" trên `content/math/kntt/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/lesson.json` (`ROOT` là `content/`).
- **Đối tượng:** chỉ bài này (`lesson.json`, hình của nó trong `src/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/` và `tests/visuals/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc.test.tsx`, bốn từ mới ở `content/glossary/math.json`). Ảnh nguồn: `sources/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/sbt-p70.png` đến `sbt-p73.png` và lời giải `sbt-p115.png`, `sbt-p116.png`.
- **Mô hình:** 3 Reviewer `model: "opus"` mở song song trong một lượt gọi, rồi 1 Tổng hợp `model: "opus"` (vòng 1 và 2 dùng Opus theo `.claude/rules/agents.md`).
- **Nhóm** (mỗi nhóm một tệp `.shots/review/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/nhom-<n>.md`): nhóm 1 gồm tổng quan và các phần 1 đến 5 (`chu-vi-la-gi`, `chu-vi-vuong-thoi`, `chu-vi-chu-nhat-binh-hanh`, `dien-tich-la-gi`, `dien-tich-chu-nhat-vuong`); nhóm 2 gồm các phần 6 đến 10 (`dien-tich-binh-hanh`, `dien-tich-thoi`, `dien-tich-thang-can`, `doi-don-vi`, `bai-toan-doi-song`); nhóm 3 gồm phần `bai-tap-sach-bai-tap` (đủ ba việc so với ảnh sách: đủ bài tập, đề y hệt sách, đáp án khớp lời giải; cùng việc soát câu dẫn).
- **Việc ngoài phạm vi (không làm):** sửa bài khác (kể cả Bài 18 và Bài 19); đụng `src/sync/`, `src/offline/`, `src/lib/brand.ts`; làm lời đọc hay video; gọi Gemini; deploy; push; `content:lock`; `content:hash --approve` ở vòng này. Reviewer chỉ ghi phát hiện, không sửa `lesson.json` hay hình.
- **Hiệu ứng ngoài đĩa được phép:** ghi `.shots/review/...` (ngoài git), ghi `review.md` cạnh `lesson.json`, cập nhật `docs/lessons-learned/` (mục có Nghiêm trọng thì tăng số; thêm dòng "Lỗi Nghiêm trọng ở vòng 1 theo bài"), chạy lệnh cuối vòng của skill (`content:hash --mark` khi còn Nghiêm trọng). Chạy `pnpm lesson:walk` chỉ trong một `git worktree` tạm trên một cổng riêng (ví dụ 3740; `pnpm install --offline`, không `.next`), xoá bằng `git worktree remove --force` ngay sau đó; không dừng máy chủ dev của chủ dự án (cổng 3003) và không dừng tiến trình theo tên.
- **Tệp ngoài git:** thư mục `sources/` không có bản sao nào khác; chỉ đọc, không ghi đè, không xoá, và không dùng `rm`.
- **Điểm dừng:** gặp việc ngoài các điều trên thì dừng và báo, không tự mở rộng phạm vi.
- **Sau vòng 1:** một tác giả mới (không phải Reviewer) sửa Nghiêm trọng và các mục Nên sửa hợp lý, chạy Haiku đọc hiểu cho chữ đã đổi, rồi vòng 2 (Opus); chỉ khi hết Nghiêm trọng mới `content:hash --approve` và `content:lock`; lời đọc và video làm sau đó.
