# Bàn giao: Bài 19 (phần 1) `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` (Hình chữ nhật. Hình thoi)

Bài 19 của sách (SBT tr.67–69) quá dài cho bé (112 phút), nên chủ dự án tách theo hình thành hai bài của app. Bài này là phần 1 (hình chữ nhật và hình thoi, giữ slug cũ, nên slug dài hơn nội dung); phần 2 là `hinh-binh-hanh-hinh-thang-can`, handover [`lesson-hinh-binh-hanh-hinh-thang-can/task.md`](../lesson-hinh-binh-hanh-hinh-thang-can/task.md). Hai bài đi cùng `number: 19`, `chapter` IV, `part` 1 và 2, `order` 19 và 19.1; màn hình ghi "Bài 19 (phần 1)". Quy tắc chung của việc tách: `.claude/rules/content.md`, mục "Splitting a long lesson". Trong tệp này "phần 1", "phần 2" là hai bài con (`part`); một đơn vị của bài (`sections`) gọi là "phần dạy" hay "section".

## Trạng thái
- Cập nhật cuối: 03/10/2026. Bài ở `draft`; vòng 1 của bài chưa tách đã chạy và đã sửa (commit `38c726d` review, `36ff39a` hình và test, `cabb254` nội dung); việc tách là bước sau đó. Chờ review vòng 2 (toàn bài, Opus, phiên mới).
- Bài này: 9 phần dạy và phần bài tập sách bài tập, 9 thẻ, 56 câu (11 trong phần bài tập sách bài tập: 5 câu sách, 6 câu dẫn), 3 mẹo, 55 phút. `content:check` 0 lỗi (cảnh báo id chưa khoá), `--stats` mọi tiêu chí PASS, 7 dạng câu.
- `review.md` cạnh `lesson.json` mang phát hiện vòng 1 thuộc bài này (số thứ tự của báo cáo gốc, vị trí đã đổi sang bài này, "Tình trạng sau vòng 1"), bảng phần cũ → bài mới và các chỗ tách đã đổi nội dung. Tệp nhóm vòng 1: `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/nhom-{1,2,3}.md` (ngoài git, theo bài chưa tách).
- Chưa làm: review vòng 2, lượt Haiku "đọc hiểu" cho chữ mới và chữ đổi khi tách, `content:hash --approve`, `content:lock`, lời đọc, video, deploy.

## Cách tách (theo hình, không theo số phần)
- Section dạy ở bài này: `hinh-quanh-ta` (mới, hai hình), `hinh-chu-nhat`, `cheo-hinh-chu-nhat`, `song-song`, `hinh-thoi`, `cheo-hinh-thoi`, `ve-hinh-chu-nhat`, `ve-hinh-thoi`, `kiem-thoi-chu-nhat`. Section cũ `hinh-quanh-ta` (bốn hình) viết lại hai bản, mỗi bài chỉ hai hình; các section còn lại giữ id section và id hình.
- Bài tập SBT ở bài này: 4.8 (Hình 4.11: hình chữ nhật, hình thoi), 4.10, 4.11, 4.14 (vẽ hình chữ nhật, hình thoi), 4.15 (hình thoi MNPQ). 12 bài tập hợp hai bài, mỗi `bookRef` đúng một lần (dòng "split into" của `pnpm content:check --stats`; luật máy `src/content/split.ts`).
- Bài tập cần hình bình hành hay hình thang cân thuộc bài phần 2: 4.9, 4.12, 4.13, 4.18, 4.19. 4.16 (hình bình hành và hình chữ nhật) và 4.17 (hình thoi và hình thang cân) cần hình của cả hai bài, nên cũng thuộc bài phần 2 (bé học theo thứ tự).
- Id: giữ nguyên id của bài chưa tách (chưa khoá), thêm id mới của section `hinh-quanh-ta` (`ex.ten-hinh-thoi`, `ex.chon-chu-nhat-quanh-ta`; `ex.ten-hinh-binh-hanh`, `ex.chon-hinh-thang-can` không còn). Bài phần 2 dùng tiền tố slug mới nên không trùng id nào.
- Chỗ nhiễu hay lời có tên hình của bài phần 2 đã đổi: `ex.chon-hinh-chu-nhat` (nhiễu hình năm cạnh), `ex.chon-hinh-thoi` (hình tứ giác lệch, hình năm cạnh), hình `chon-hinh-bon-goc-vuong` (tứ giác lệch thay hình bình hành), `ex.dan-4-8-noi-ten`, `ex.sbt-4-8` (gợi ý hình `so-sanh-hai-hinh`, `explain`, hình lời giải gọi hai hình còn lại "hình khác"). Hình sách 4.11 (có hình thang và hình bình hành, không tên trên màn) giữ nguyên.

## Nguồn (sách bài tập, `sources/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`, không commit)
- Đề: tr.67–69 in (PDF 68–70), tệp `sbt-p67.png` đến `sbt-p69.png`; tr.67 có "Kiến thức cần nhớ", "Kĩ năng giải toán", ví dụ 1 (Hình 4.9); tr.68 có bài 4.8 (Hình 4.11), 4.10, 4.11, 4.14; tr.69 có 4.15 (Hình 4.13). Lời giải: tr.115 (PDF 116), `sbt-p115.png`, mục "Bài 19" (4.8, 4.9, 4.15, 4.16, 4.17). Sách không in lời giải các bài vẽ (4.10, 4.11, 4.14).
- Nội dung nguồn dùng ở bài này: kiến thức cần nhớ của hình chữ nhật (bốn góc 90°, cạnh đối bằng nhau, hai đường chéo bằng nhau) và hình thoi (bốn cạnh bằng nhau, hai đường chéo vuông góc, cạnh đối song song, góc đối bằng nhau); kĩ năng vẽ hình chữ nhật, hình thoi bằng dụng cụ; ví dụ 1.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 67-70 (rồi 115-116) --subject math --series kntt --slug hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can --book sbt --offset 1`.

## Giả định (chủ dự án không hỏi được, ghi theo yêu cầu; của bài chưa tách, giữ cho bài này)
- Hình của sách được vẽ lại bằng hình vẽ của bài (không chép hình sách), giữ đúng hình dạng và tên điểm.
- Ví dụ 1 của sách không phải bài đánh số nên không có `bookRef`, và không được chép: câu tìm hình chữ nhật nằm trong hình thoi (`ex.chon-chu-nhat-trong-thoi`, section `kiem-thoi-chu-nhat`) dùng cách dựng khác.
- Bốn điều không in trên trang đã nạp nhưng cần để làm bài vẽ và bài kiểm tra (reviewer xét theo luật "Không có trong sách", đề xuất của người soạn: giữ): (1) cách vẽ hình chữ nhật bằng thước và êke, hình thoi bằng thước, thước đo góc và compa; (2) dấu hiệu nhận biết dùng cho 4.15: tứ giác có bốn cạnh bằng nhau là hình thoi, tứ giác có bốn góc vuông là hình chữ nhật; (3) các từ nền: "song song" (kiến thức tiểu học, `sourceRef` của section `song-song` ghi "Kiến thức nền (tiểu học)", glossary có `prerequisite`), "tứ giác", "cạnh đối", "góc đối"; (4) ghép hình thang cân không có ở bài này (thuộc bài phần 2).
- Màu khái niệm: Cạnh blue, Góc violet, Đường chéo amber (như Bài 18), Hình chữ nhật teal, Hình thoi pink, Song song slate. Từ vựng và 43 tên điểm/đoạn/hình nằm ở `content/glossary/math.json` dùng chung hai bài. Màu hình không đứng trong câu chọn hình để khỏi lộ đáp án. Câu "luôn" chỉ dùng ở câu nói chung.
- Số trong bài nhỏ: độ dài vẽ 2 đến 7 cm, góc 45°, 60°, 75°. Số của bài vẽ tách nhau: hình mẫu chạy từng bước (4 và 3 cm; 3 cm và 75°), cùng làm (6 và 2 cm; 6 cm và 45°), luyện (5 và 2 cm; 4 cm và 60°), kho ôn (7 và 3 cm; 5 cm và 75°), câu dẫn (4 và 6 cm; 3 cm; 3 cm và 60°) và sách (3 và 5 cm; 4 cm; 5 cm và 60°). Đơn vị cm nằm trong đề, không đặt `unit` của câu `numeric`.

## Cấu trúc bài (9 section dạy, mỗi section một ý và một thẻ cùng tên, rồi section bài tập sách bài tập)
1. `hinh-quanh-ta` Hai hình quanh ta (cánh cửa, khung cánh diều; tên hai hình; nối vật với hình, gọi tên hình thoi, chạm hình chữ nhật trong bốn hình).
2. `hinh-chu-nhat` Hình chữ nhật (bốn góc vuông, cạnh đối bằng nhau; định nghĩa góc vuông và cạnh đối).
3. `cheo-hinh-chu-nhat` Đường chéo của hình chữ nhật (bằng nhau); mẹo "Kiểm tra khung hình chữ nhật".
4. `song-song` Hai cạnh song song (kiến thức nền tiểu học).
5. `hinh-thoi` Hình thoi (bốn cạnh bằng nhau, cạnh đối song song, góc đối bằng nhau).
6. `cheo-hinh-thoi` Đường chéo của hình thoi (vuông góc).
7. `ve-hinh-chu-nhat` Vẽ hình chữ nhật (thước và êke).
8. `ve-hinh-thoi` Vẽ hình thoi (thước, thước đo góc, compa); mẹo "Vẽ hình thoi có góc 60°".
9. `kiem-thoi-chu-nhat` Kiểm tra hình thoi và hình chữ nhật (đo bốn cạnh, êke); mẹo "Kiểm tra góc vuông".
10. `bai-tap-sach-bai-tap` Bài tập sách bài tập (phần cuối, `bookPractice`): bài 4.8, 4.10, 4.11, 4.14, 4.15 (5 câu sách) và 6 câu dẫn; 3 khối "Nhắc lại" (4.8; 4.10, 4.11 và 4.14; 4.15 với câu quy tắc kiểm tra hình thoi, hình chữ nhật lặp nguyên văn câu của section `kiem-thoi-chu-nhat`).
- Mỗi section dạy có 3 đến 4 màn: một hình chạy từng bước, màn quy tắc (`note` có `rule: true` và hình có nhãn), màn "Cùng làm" (chạm để đo, chạm thẻ, bảng vẽ); mỗi section dạy: 2 câu kiểm tra, 1 câu luyện tập và 2 câu kho ôn.
- Bảy dạng câu: `choice` 27 (6 câu chọn nhiều đáp án), `numeric` 11, `manipulate` 10, `match` 3, `tapRegion` 2, `order` 2, `fillBlank` 1.
- Đọc `docs/learner.md`: bé chậm, yếu đọc; mỗi câu chữ ≤ 25 âm tiết, mỗi `note` ≤ 2 câu; mỗi section có tình huống đời sống (cánh cửa, khung cánh diều, thanh ray, khung ảnh, mắt lưới hàng rào).

## Hình
- Bộ dựng hình dùng chung cho cả hai bài đã chuyển sang `src/visuals/shared/quadrilaterals/` (figures, construction, `logic.ts` validator và solver, board-visual, gallery, scene, tap-cards, spec, `from-spec.tsx`, `drawing-frames.ts`, `other-shapes.ts`, `builders.ts`); bộ dựng hình phẳng `src/visuals/shared/plane/` giữ nguyên. Bài chưa tách dùng thư mục `src/visuals/math/<slug>/`; bây giờ thư mục đó chỉ còn danh mục hình của riêng bài.
- Thư mục bài `src/visuals/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`: `catalog.ts` (gộp, báo lỗi khi trùng khoá) và `catalog-thumbs.ts`, `catalog-chu-nhat-thoi.ts`, `catalog-drawing.ts`, `catalog-check.ts`, `catalog-book.ts`, `sticker.tsx` (hai hình teal và pink), `examples.tsx`. Mỗi danh mục chỉ liệt kê hình bài dùng; `tests/visuals/quadrilaterals.test.tsx` kiểm danh mục và `lesson.json` nêu đúng cùng một tập hình. Id hình giữ nguyên khi không đổi nội dung; hình mới: `hai-vat-doi-song`, `hai-hinh-ten`, `chon-chu-nhat-quanh-ta`, `so-sanh-hai-hinh`, `ve-hai-hinh`; hình đổi: `vat-va-hinh`, `xem-vat-tim-hinh`, `chon-hinh-bon-goc-vuong`, `sbt-4-8-giai`.
- Hình gợi ý nấc 2 của câu chọn hình chỉ dùng chữ đề (không hình); hình gợi ý của câu sách dùng hình chạy từng bước của phần dạy với số khác, hình lời giải nấc 3 chạy trọn lời giải với số của đề.

## Bài vẽ và cách chấm (yêu cầu của chủ dự án: bài "vẽ" thành dạng chấm được, giữ lời sách)
- 4.10 ("Vẽ hình chữ nhật DEFG có DE = 3 cm; EF = 5 cm."): `manipulate` với bảng hình chữ nhật; chấm khi DE = 3, EF = 5 và đã vẽ hai đường vuông góc và nối. Sách không in lời giải.
- 4.11 ("Vẽ hình thoi MNPQ có cạnh MN = 4 cm."): bảng hình thoi; sách không cho góc nên bé tự chọn góc NMQ trong 45°, 60°, 75° (mọi lựa chọn đều được chấp nhận), câu app ghi "Bạn tự chọn góc NMQ".
- 4.14 ("Vẽ hình thoi MNPQ có cạnh bằng 5 cm và một góc bằng 60°."): chấm khi cạnh 5 và góc NMQ = 60°.
- 4.15 (kiểm tra): `choice`; hình sách vẽ lại có số: ở Hình 4.13, AB = 8 cm và AD = 6 cm theo tỉ lệ 30 điểm một cm nên bốn cạnh MNPQ dài 5 cm (số này chỉ hiện ở hình lời giải, không có trong đề).
- 4.8: `match` tên hình với "Hình 4.11a ... d"; hình sách vẽ lại thành bốn hình riêng có chữ a), b), c), d).
- Giới hạn: máy chỉ biết bé chọn đúng số, đúng bước, không đo được nét vẽ thật trên giấy; 4.11 sách không cho góc nên cách chấm nhận mọi góc trong ba góc cho.

## Mẹo (3 khối `tip`, thử bằng chương trình tạm, không commit)
- `cheo-hinh-chu-nhat` "Kiểm tra khung hình chữ nhật" (làm nhanh), chỉ theo chiều "hình chữ nhật thì hai đường chéo bằng nhau" (chiều ngược là kiến thức lớp 8).
- `ve-hinh-thoi` "Vẽ hình thoi có góc 60°" (làm nhanh): hai tam giác đều chung một cạnh ghép thành hình thoi; thử cạnh 1, 2, 3, 5, 7, 10.
- `kiem-thoi-chu-nhat` "Kiểm tra góc vuông" (làm nhanh): góc tờ giấy khít là góc vuông, hở hay chờm ra thì không; thử góc 30°, 60°, 89°, 90°, 91°, 120°, 150°.

## Đọc hiểu (Haiku, `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`, không commit)
- Lượt đọc hiểu của bài chưa tách (đã chạy ở vòng 1, trước khi tách): `doc-hieu*.md`. Chữ mới và chữ đổi khi tách (section `hinh-quanh-ta`, `overview`, nhiễu và lời đổi ở "Cách tách", khối "Nhắc lại" của section bài tập sách bài tập) chưa qua lượt Haiku: chạy lượt "Đọc hiểu" của `lesson-review` cho bài này trước `content:hash --approve`.

## Kiểm đã chạy khi tách (03/10/2026)
- `pnpm content:check --stats`: 0 lỗi; 5 `bookRef` (SBT 4.8, 4.10, 4.11, 4.14, 4.15), cả hai bài hợp 12 `bookRef` mỗi cái một lần; `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` đã chạy.
- `pnpm visual:shot` và `pnpm lesson:walk` trong git worktree tạm cổng 3780 (đã gỡ): kết quả ghi ở mục "Kiểm cuối" bên dưới.
- Cổng: `pnpm format` (tệp của bài), `pnpm lint` (chỉ thông báo info ở `video/projects/*/index.html` có từ trước), `pnpm typecheck`, `pnpm test` đạt.

## Việc nên làm ở vòng sau
- Các câu `choice` có phương án là số chưa có `check` (lint không đòi); xét có cần.
- Bài phần 2 dùng từ "song song" mà không dạy lại (dạy ở section `song-song` của bài này); xét ở review của bài phần 2.

## Điểm nghi cho Reviewer
- Ba điều ngoài trang sách ở mục "Giả định".
- 4.11: bé tự chọn góc trong ba góc cho; xem cách chấm có chấp nhận được không.
- 4.15: trên màn bé không đo được; đề là hình sách vẽ lại và các câu dẫn dạy cách kiểm tra bằng đo cạnh. Xét xem cách làm có đủ cho bé không (hình lời giải nấc 3 có số đo).
- Section `hinh-quanh-ta` mới: nối hai cặp là ít; câu `ten-hinh-thoi`, `chon-chu-nhat-quanh-ta` dùng hình tam giác đều, lục giác đều của Bài 18 làm nhiễu; lời không nêu hình của bài phần 2.
- Câu có "luôn" và câu "chắc chắn" (section 3 và 9): xét LL-01 và LL-10.
- Câu luyện dạng "kiểm tra": một khung có hai đường chéo 30 cm và 34 cm (section 3).

## Giao việc review vòng 2 (cho phiên mới, không phải người soạn hay người sửa)
Chạy `.claude/skills/lesson-review` mục "Vòng toàn bài" (vòng 2) trên `content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/lesson.json` (`ROOT` là `content/`). Đọc `review.md` trước (phát hiện vòng 1 thuộc bài này và chỗ đã đổi khi tách). Bài còn `draft` và chưa có `reviewedHash`, nên không dùng `content:diff`.
- **Đối tượng:** chỉ bài này (`lesson.json`, `src/visuals/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`, `src/visuals/shared/quadrilaterals/` và `src/visuals/shared/plane/` mà bài dùng, mục glossary của bài). Ảnh nguồn `sources/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/sbt-p67.png` đến `sbt-p69.png`, lời giải `sbt-p115.png`. Bài phần 2 review riêng sau (phiên khác).
- **Mô hình:** 4 Reviewer `model: "opus"` song song, rồi 1 Tổng hợp `model: "opus"`. Nhóm 1: section 1–3 (`hinh-quanh-ta`, `hinh-chu-nhat`, `cheo-hinh-chu-nhat`); nhóm 2: section 4–6 (`song-song`, `hinh-thoi`, `cheo-hinh-thoi`); nhóm 3: section 7–9 (`ve-hinh-chu-nhat`, `ve-hinh-thoi`, `kiem-thoi-chu-nhat`); nhóm 4: section bài tập sách bài tập (đủ ba việc với 5 câu sách, soát 6 câu dẫn). Mỗi Reviewer kiểm từng mục vòng 1 thuộc nhóm mình đã sửa đúng chưa (`review.md`, "Tình trạng sau vòng 1"), rồi soát toàn nhóm như vòng 1 (cùng các loại lỗi: khái niệm ngoài sách như "tâm", "tia"; lập luận ngược chiều trong `explain`; nhãn số đo bị nét cắt; thiếu điều kiện compa, thước; hình gợi ý tràn hay lộ đáp án; chép hình sách vào "Cùng làm"), và soát riêng chỗ tách: lời hay nhiễu còn tên hình của phần 2, ba "Nhắc lại" của section bài tập sách bài tập, `overview`.
- **Trước khi mở Reviewer:** chạy `pnpm lesson:walk hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` trong `git worktree` tạm trên cổng riêng (`TEST_PORT`, `pnpm install --offline`), chép ảnh sang `.shots/walk/` của cây chính sau khi dời bộ ảnh cũ ra scratchpad bằng `mv` (để không lẫn ảnh cũ), rồi `git worktree remove --force`.
- **Ngoài phạm vi:** sửa bài khác (kể cả Bài 18, Bài 20 và phần 2); `src/sync/`, `src/offline/`, `src/lib/brand.ts`; lời đọc, video; Gemini; deploy; push; `content:lock`. Reviewer không sửa `lesson.json` hay hình.
- **Kết thúc vòng:** còn Nghiêm trọng thì `content:hash --mark`; hết Nghiêm trọng thì chạy lượt Haiku cho chữ mới và chữ đổi rồi mới `content:hash --approve` và `content:lock hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`. Cập nhật `docs/lessons-learned/` theo skill.
- **Tệp ngoài git:** `sources/` chỉ đọc; không dùng `rm`; không dừng máy chủ dev cổng 3003, không dừng tiến trình theo tên.
- **Điểm dừng:** gặp việc ngoài các điều trên thì dừng và báo.
