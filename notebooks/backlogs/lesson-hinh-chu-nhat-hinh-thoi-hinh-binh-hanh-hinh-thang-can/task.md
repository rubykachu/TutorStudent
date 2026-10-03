# Bàn giao: Bài 19 (phần 1) `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` (Hình chữ nhật. Hình thoi)

Bài 19 của sách (SBT tr.67–69) quá dài cho bé (112 phút), nên chủ dự án tách theo hình thành hai bài của app. Bài này là phần 1 (hình chữ nhật và hình thoi, giữ slug cũ, nên slug dài hơn nội dung); phần 2 là `hinh-binh-hanh-hinh-thang-can`, handover [`lesson-hinh-binh-hanh-hinh-thang-can/task.md`](../lesson-hinh-binh-hanh-hinh-thang-can/task.md). Hai bài đi cùng `number: 19`, `chapter` IV, `part` 1 và 2, `order` 19 và 19.1; màn hình ghi "Bài 19 (phần 1)". Quy tắc chung của việc tách: `.claude/rules/content.md`, mục "Splitting a long lesson". Trong tệp này "phần 1", "phần 2" là hai bài con (`part`); một đơn vị của bài (`sections`) gọi là "phần dạy" hay "section".

## Trạng thái
- Cập nhật cuối: 03/10/2026. Bài đã duyệt: `status: published`, `reviewedHash` ghi (commit `2f2c1a7`), id đã khoá (`pnpm content:lock hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`, 85 id). Lời đọc giới thiệu và ba video đã xong (commit `2703067`), media đã tải lên bucket, đã deploy lên production 03/10/2026 (commit `baffae9`, smoke 7/7).
- Bài này: 9 phần dạy và phần bài tập sách bài tập, 9 thẻ, 56 câu (11 trong phần bài tập sách bài tập: 5 câu sách, 6 câu dẫn), 3 mẹo, 55 phút. `content:check` 0 lỗi, `--stats` mọi tiêu chí PASS, 7 dạng câu.
- Review: vòng 1 của bài chưa tách (commit `38c726d` review, `36ff39a` hình và test, `cabb254` nội dung), rồi tách bài; vòng 2 toàn bài (4 Reviewer Opus + Tổng hợp Opus, commit `8844d56`): 1 Nghiêm trọng, 22 Nên sửa, 21 Góp ý, sửa hết Nghiêm trọng và Nên sửa (commit `a3a4c9a`, `bf25827` code dùng chung; `fbdc96f` hình và test; `a91de68` nội dung và glossary; `d3f29a9` hai câu đọc hiểu); vòng 3 chỉ phần đổi (Sonnet): 0 Nghiêm trọng, 1 Nên sửa (đã sửa trước khi duyệt), 13 Góp ý để lại. `review.md` cạnh `lesson.json` là bản vòng 3 (kết quả sửa vòng 2, Góp ý còn lại, "Cần chủ dự án quyết"). Tệp nhóm vòng 2: `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/nhom-{1,2,3,4}.md`; tệp vòng 1 dời vào `vong-1/` cùng thư mục (ngoài git).
- Chủ dự án cần xác nhận: vật mẫu hình thoi của bài là mắt lưới hàng rào B40 (thay khung cánh diều, vì diều thật thường không có bốn cạnh bằng nhau), dùng ở `hinh-quanh-ta`, `hinh-thoi`, `cheo-hinh-thoi`, câu nối và kho ôn.

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
- Lượt của bài chưa tách (vòng 1): `vong-1/doc-hieu*.md`.
- Sau vòng 2, trên chữ mới và chữ đổi khi tách (`overview`, section `hinh-quanh-ta`, section bài tập sách bài tập) và chữ đổi khi sửa vòng 2: lượt 1 `doc-hieu.md` 98 Hiểu rõ / 2 Hiểu mơ hồ / 0 Khó hiểu; hai mục viết lại, lượt 2 `doc-hieu-2.md` 6 / 0 / 0; note mở đầu `cheo-hinh-thoi` viết lại theo vòng 3, lượt 3 `doc-hieu-3.md` 1 / 0 / 0.

## Kiểm đã chạy khi tách (03/10/2026)
- `pnpm content:check --stats`: 0 lỗi; 5 `bookRef` (SBT 4.8, 4.10, 4.11, 4.14, 4.15), cả hai bài hợp 12 `bookRef` mỗi cái một lần; `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` đã chạy.
- `pnpm visual:shot` và `pnpm lesson:walk` trong git worktree tạm cổng 3780 (đã gỡ): kết quả ghi ở mục "Kiểm cuối" bên dưới.
- Cổng: `pnpm format` (tệp của bài), `pnpm lint` (chỉ thông báo info ở `video/projects/*/index.html` có từ trước), `pnpm typecheck`, `pnpm test` đạt.

## Kiểm cuối (03/10/2026, sau duyệt, commit `2f2c1a7`)
- `pnpm visual:shot hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`: 150/150 đạt. `pnpm lesson:walk hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`: 0 lỗi, 0 cảnh báo, ba kích thước (iPad dọc, điện thoại, iPad ngang), chạy trong git worktree tạm cổng 3800 (đã gỡ); ảnh walk ở `.shots/walk/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`. `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` đã chạy.
- Cổng: `pnpm lint` (chỉ thông báo info có từ trước), `pnpm typecheck`, `pnpm test` (211 tệp) đạt.

## Code dùng chung đã đổi ở vòng 2 (cả bài phần 2 dùng `src/visuals/shared/quadrilaterals/`)
- `board-visual.tsx`, `builders.ts`: tuỳ chọn `roomy` của bảng vẽ (mặc định tắt; bài này bật cho 10 bảng). `drawing-frames.ts`: `boardView` dời tên đỉnh thứ tư khỏi cung compa, chỉ ở bảng hình thoi; `trimTop` cắt hàng trống trên khung hình mẫu từng bước. `scene.tsx`: cảnh `kite` thay bằng `fence` (mắt lưới B40). `figures.ts`: nhãn đọc màn hình của Hình 4.11 không còn tên hình. Mặc định bài phần 2 thấy không đổi; `tests/visuals/quadrilaterals.test.tsx` khoá các điều này.

## Việc nên làm ở vòng sau
- Góp ý còn lại trong `review.md` (13 mục, vd bảng vẽ iPad dọc vẫn nhỏ, nhãn O sát "90°", hình chạm `do-thoi` nhỏ): làm khi sửa bài lần sau; mỗi lần sửa chữ bé thấy cần vòng chỉ phần đổi và lượt đọc hiểu.
- Các câu `choice` có phương án là số chưa có `check` (lint không đòi); xét có cần.

## Việc tiếp theo: lời đọc giới thiệu, video, rồi deploy
Một phiên mới, mỗi lần một subagent, theo `.claude/skills/lesson-video/SKILL.md` và `docs/operations.md` "Đưa bài mới lên production".
1. **Giọng của bài:** chưa có `video/projects/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/media.json`. Bài 18 (`hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu`) dùng `hai-dang`; theo mục "Giọng" của skill (xen kẽ bài liền nhau) đề xuất `my-duyen` cho bài này, ghi lý do ở đây khi chọn. Bài phần 2 nên cùng nhịp xen kẽ (chọn khi làm phần 2).
2. **Lời đọc giới thiệu:** `pnpm narration:build hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` gọi Gemini TTS thật (tốn hạn mức, ghi ra ngoài máy): chỉ chạy khi chủ dự án đồng ý cho lần này; câu đầu `overview.hook` đã chào "bạn". Không đọc lại lời đọc hay video của bài khác.
3. **Video:** theo `lesson-video` (VieNeu chạy trên máy), video cho các phần dạy; review kịch bản và lời video bằng `lesson-review` vòng chỉ phần đổi (Sonnet); `pnpm video:check`.
4. **Deploy:** khi lời đọc và video đã duyệt: `pnpm media:upload` rồi `pnpm deploy:prod --ref <SHA đã kiểm>` (ghi ra ngoài máy; chủ dự án đã cho phép deploy từng bài xong, vẫn làm đúng thứ tự media trước, deploy sau).
- **Ngoài phạm vi:** sửa nội dung bài (đã duyệt; sửa thì cần review lại), bài khác (kể cả phần 2), `src/sync/`, `src/offline/`. Media ngoài git: không ghi đè media của bài khác; không dùng `rm`; không dừng dev server cổng 3003, không dừng tiến trình theo tên.

## Lời đọc và video (03/10/2026)
- Giọng bài: `my-duyen` (Mỹ Duyên), vì bài 18 dùng `hai-dang` nên xen kẽ; khai ở `video/projects/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/media.json`.
- Lời đọc giới thiệu: `pnpm narration:build hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`, Gemini Vindemiatrix đọc trọn (52,9 s, mọi câu Whisper ≥ 98,6%), không phải VieNeu.
- Ba video (VieNeu Mỹ Duyên, Whisper ≥ 97%, `pnpm video:check` ok): `hinh-chu-nhat` (51 s, đầu section `hinh-chu-nhat`, hai clip cho thẻ `hinh-chu-nhat` và `cheo-hinh-chu-nhat`), `hinh-thoi` (56 s, đầu section `hinh-thoi`, hai clip cho thẻ `hinh-thoi` và `cheo-hinh-thoi`), `ve-hinh-chu-nhat` (49 s, đầu section `ve-hinh-chu-nhat`). Hình lấy từ catalog của bài qua `figures.tsx`.
- Review vòng 4 (chỉ phần đổi, Sonnet): 0 Nghiêm trọng, 6 Nên sửa đã sửa hết, dựng lại video; `content:hash --approve`, `content:lock` (3 id video); `lesson:walk` 0 lỗi ba thiết bị; `pnpm visual:shot` 150/150 ở bản sạch.
- Media đã tải lên bucket và đã deploy lên production 03/10/2026 (commit `baffae9`, smoke 7/7). Còn lại: chủ dự án xác nhận vật mẫu hình thoi (mắt lưới hàng rào B40); xong thì lưu trữ thư mục backlog này.
