# Bàn giao: Bài 19 (phần 2) `hinh-binh-hanh-hinh-thang-can` (Hình bình hành. Hình thang cân)

Bài 19 của sách (SBT tr.67–69) quá dài cho bé (112 phút), nên chủ dự án tách theo hình thành hai bài của app. Bài này là phần 2 (hình bình hành và hình thang cân, slug mới, bài học sau phần 1); phần 1 là `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`, handover [`lesson-hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/task.md`](../lesson-hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/task.md). Hai bài đi cùng `number: 19`, `chapter` IV, `part` 1 và 2, `order` 19 và 19.1; màn hình ghi "Bài 19 (phần 2)". Quy tắc chung của việc tách: `.claude/rules/content.md`, mục "Splitting a long lesson". Trong tệp này "phần 1", "phần 2" là hai bài con (`part`); một đơn vị của bài (`sections`) gọi là "phần dạy" hay "section".

## Trạng thái

- Cập nhật cuối: 03/10/2026. Bài đã duyệt: `status: published`, `reviewedHash` `c00de14d…` (commit `53216c0`), id đã khoá (`pnpm content:lock hinh-binh-hanh-hinh-thang-can`, 89 id, commit `a214db2`). Lời đọc giới thiệu và ba video đã xong (commit `a90b0cb`, review vòng 6, `reviewedHash` `0c95357d…`, 92 id đã khoá), media đã tải lên bucket; chưa deploy.
- Bài này: 9 section dạy và section bài tập sách bài tập, 9 thẻ, 60 câu (15 trong section bài tập sách bài tập: 7 câu sách, 8 câu dẫn), 1 mẹo, 58 phút. `content:check` 0 lỗi (cảnh báo id chưa khoá), `--stats` mọi tiêu chí PASS, 5 dạng câu (đúng mức tối thiểu).
- `review.md` cạnh `lesson.json` là bản của vòng 5 (chỉ phần đổi); tệp nhóm vòng 2 và các lượt đọc hiểu ở `.shots/review/hinh-binh-hanh-hinh-thang-can/` (ngoài git). Vòng 1 (bài chưa tách): `git show 38c726d:content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/review.md`.
- Chưa làm: deploy (mục "Việc tiếp theo" ở cuối).

## Cách tách (theo hình, không theo số phần)

- Section dạy ở bài này: `hinh-binh-hanh`, `cheo-hinh-binh-hanh`, `hinh-thang-can`, `cheo-hinh-thang-can`, `so-sanh-bon-hinh` (tổng kết bốn hình: cần cả hai bài), `ve-hinh-binh-hanh`, `ve-binh-hanh-cheo`, `kiem-binh-hanh`, `ghep-hinh`. Bài không có section mở đầu: mỗi section hình mới đã mở bằng vật quanh nhà (gạch lát nghiêng, thang chữ A).
- Bài tập SBT ở bài này: 4.9 (Hình 4.12: hình bình hành, hình thang cân), 4.12, 4.13 (vẽ hình bình hành), 4.16 (Hình 4.14: hình bình hành EFPQ và hình chữ nhật ABCD), 4.17 (Hình 4.15: hình thoi OABC, OCDE và hình thang cân BEDC), 4.18, 4.19 (ghép hình thang cân). 4.16 và 4.17 cần hình của cả hai bài nên thuộc bài này (bé học theo thứ tự). 12 bài tập hợp hai bài, mỗi `bookRef` đúng một lần (dòng "split into" của `pnpm content:check --stats`; luật máy `src/content/split.ts`).
- Id: mọi id của bài bắt đầu bằng slug mới (chưa khoá), nên không trùng id đã khoá của bài nào; id hình giữ khoá hình của bài chưa tách (`<slug mới>.visual.<khoá>`); hình mới: `binh-hanh-thang-can-ten`, `ve-binh-hanh-xong`.
- Phần dạy dùng lại điều đã dạy ở bài phần 1 mà không dạy lại: `song song` (có hình và câu quy tắc ở bài phần 1), `tứ giác`, `đường chéo`, `góc vuông`, hình chữ nhật, hình thoi (khối "Nhắc lại" của 4.16 và 4.17 và `so-sanh-bon-hinh` nhắc lại).

## Nguồn (sách bài tập, `sources/math/hinh-binh-hanh-hinh-thang-can/`, bản sao của thư mục nguồn của bài chưa tách, không commit)

- Đề: tr.67–69 in (PDF 68–70), tệp `sbt-p67.png` đến `sbt-p69.png`; tr.67 có "Kiến thức cần nhớ", "Kĩ năng giải toán", ví dụ 2 là tr.68 (Hình 4.10); tr.68 có bài 4.9 (Hình 4.12), 4.12, 4.13; tr.69 có 4.16 đến 4.19 (Hình 4.14 đến 4.16). Lời giải: tr.115 (PDF 116), `sbt-p115.png`, mục "Bài 19" (4.9, 4.16, 4.17). Sách không in lời giải các bài vẽ và cắt ghép (4.12, 4.13, 4.18, 4.19).
- Nội dung nguồn dùng ở bài này: kiến thức cần nhớ của hình bình hành (cạnh đối bằng nhau, hai đường chéo cắt nhau tại trung điểm mỗi đường, cạnh đối song song, góc đối bằng nhau) và hình thang cân (hai cạnh bên bằng nhau, hai đường chéo bằng nhau, hai đáy song song, hai góc kề một đáy bằng nhau); kĩ năng vẽ hình bình hành bằng dụng cụ; ví dụ 2.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 67-70 (rồi 115-116) --subject math --series kntt --slug hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can --book sbt --offset 1` (thư mục của bài này là bản sao).

## Giả định (chủ dự án không hỏi được, ghi theo yêu cầu; của bài chưa tách, giữ cho bài này)

- Hình của sách được vẽ lại bằng hình vẽ của bài (không chép hình sách), giữ đúng hình dạng và tên điểm.
- Ví dụ 2 của sách không phải bài đánh số nên không có `bookRef`, và không được chép: câu đếm hình thoi trong hình lục giác đều (`ex.dem-thoi-luc-giac`, section `ghep-hinh`) dùng cách dựng khác.
- Bốn điều không in trên trang đã nạp nhưng cần để làm bài vẽ và bài kiểm tra (reviewer xét theo luật "Không có trong sách", đề xuất của người soạn: giữ): (1) cách vẽ hình bình hành bằng thước, thước đo góc và êke (biết hai cạnh và góc) hay bằng thước, compa và êke (biết hai cạnh và một đường chéo, 4.13); (2) dấu hiệu nhận biết dùng cho 4.16 và 4.17: tứ giác có hai đường chéo cắt nhau tại trung điểm của mỗi đường là hình bình hành, hình thang có hai góc kề một đáy bằng nhau là hình thang cân (cộng hai dấu hiệu của bài phần 1); (3) các từ nền: "trung điểm", "hình thang", "cạnh bên", "cạnh đáy", "góc kề đáy", "cạnh đối", "góc đối" (định nghĩa ngắn ở màn đầu hay màn quy tắc của section dùng chúng); (4) ba hình tam giác đều ghép thành hình thang cân, hai hình thang cân có đáy nhỏ bằng cạnh bên ghép thành hình lục giác đều (suy ra từ 4.18, 4.19 và Bài 18).
- Màu khái niệm: Cạnh blue, Góc violet, Đường chéo amber (như Bài 18), Hình bình hành lime, Hình thang cân sky, Hình chữ nhật teal và Hình thoi pink (hai hình của bài phần 1 trong `so-sanh-bon-hinh`), Song song slate. Từ vựng và tên điểm nằm ở `content/glossary/math.json` dùng chung hai bài. Màu hình không đứng trong câu chọn hình để khỏi lộ đáp án; câu chọn hình không đưa hình vuông, và không đưa cả hình chữ nhật lẫn hình thoi vào câu hỏi hình bình hành (hình chữ nhật cũng là hình bình hành theo định nghĩa rộng).
- Số trong bài nhỏ: độ dài vẽ 2 đến 7 cm, góc 45°, 60°, 75°. Số của bài vẽ tách nhau: hình mẫu chạy từng bước (5 và 3 cm; 4, 3 và 6 cm), cùng làm (4 và 6 cm; 5, 4 và 7 cm), luyện (6 và 3 cm; 4, 5 và 6 cm; câu độ mở compa 2, 5 và 6 cm), kho ôn (3 và 5 cm; 2, 4 và 5 cm), câu dẫn (5 và 6 cm; 2, 3 và 4 cm) và sách (3 và 4 cm; 3, 5 và 6 cm). Đơn vị cm nằm trong đề, không đặt `unit` của câu `numeric`.

## Cấu trúc bài (9 section dạy, mỗi section một ý và một thẻ cùng tên, rồi section bài tập sách bài tập)

1. `hinh-binh-hanh` Hình bình hành (cạnh đối bằng nhau và song song, góc đối bằng nhau).
2. `cheo-hinh-binh-hanh` Đường chéo của hình bình hành (trung điểm; cắt nhau tại trung điểm của mỗi đường).
3. `hinh-thang-can` Hình thang cân (cạnh đáy, cạnh bên, hai cạnh bên bằng nhau, hai góc kề một đáy bằng nhau; thang chữ A và túi xách).
4. `cheo-hinh-thang-can` Đường chéo của hình thang cân (bằng nhau).
5. `so-sanh-bon-hinh` So sánh bốn hình (bốn hình cạnh nhau; đường chéo bằng nhau ở hình chữ nhật và hình thang cân, vuông góc ở hình thoi; chạm từng hình để đọc điểm riêng).
6. `ve-hinh-binh-hanh` Vẽ hình bình hành (thước, thước đo góc, êke); mẹo "Vẽ hai đường song song".
7. `ve-binh-hanh-cheo` Vẽ hình bình hành biết đường chéo (compa và êke, 4.13).
8. `kiem-binh-hanh` Kiểm tra hình bình hành và hình thang cân (đo hai đường chéo, hai góc kề đáy).
9. `ghep-hinh` Ghép hình thang cân (ba tam giác đều thành hình thang cân, hai hình thang cân thành hình lục giác đều).
10. `bai-tap-sach-bai-tap` Bài tập sách bài tập (phần cuối, `bookPractice`): bài 4.9, 4.12, 4.13, 4.16, 4.17, 4.18, 4.19 (7 câu sách) và 8 câu dẫn; 4 khối "Nhắc lại" (4.9; 4.12 và 4.13; 4.16 và 4.17 với câu quy tắc kiểm tra hình bình hành, hình thang cân lặp nguyên văn câu của section `kiem-binh-hanh`; 4.18 và 4.19).

- Mỗi section dạy có 3 đến 4 màn: một hình chạy từng bước, màn quy tắc (`note` có `rule: true` và hình có nhãn), màn "Cùng làm" (chạm để đo, chạm thẻ, bảng vẽ, ghép miếng); mỗi section dạy: 2 câu kiểm tra, 1 câu luyện tập và 2 câu kho ôn.
- Năm dạng câu: `choice` 29 (5 câu chọn nhiều đáp án), `numeric` 18, `manipulate` 10, `match` 2, `order` 1.
- Đọc `docs/learner.md`: bé chậm, yếu đọc; mỗi câu chữ ≤ 25 âm tiết, mỗi `note` ≤ 2 câu; mỗi section có tình huống đời sống (gạch lát nghiêng, thang chữ A, túi xách, khay mứt Tết, khung gỗ).

## Hình

- Bộ dựng hình dùng chung cho cả hai bài ở `src/visuals/shared/quadrilaterals/` (figures, construction, `logic.ts` validator và solver, board-visual, gallery, scene, tap-cards, spec, `from-spec.tsx`, `drawing-frames.ts`, `other-shapes.ts`, `builders.ts`); bộ dựng hình phẳng `src/visuals/shared/plane/` giữ nguyên.
- Thư mục bài `src/visuals/math/hinh-binh-hanh-hinh-thang-can/`: `catalog.ts` (gộp, báo lỗi khi trùng khoá) và `catalog-thumbs.ts`, `catalog-binh-hanh-thang-can.ts`, `catalog-drawing.ts`, `catalog-check.ts`, `catalog-book.ts`, `sticker.tsx` (hai hình lime và sky), `examples.tsx`. Mỗi danh mục chỉ liệt kê hình bài dùng; `tests/visuals/quadrilaterals.test.tsx` kiểm danh mục và `lesson.json` nêu đúng cùng một tập hình. Hình `so-sanh-bon-hinh` là gợi ý nấc 2 của 4.9.
- Hình gợi ý nấc 2 của câu chọn hình chỉ dùng chữ đề (không hình); hình gợi ý của câu sách dùng hình chạy từng bước của section dạy với số khác, hình lời giải nấc 3 chạy trọn lời giải với số của đề.

## Bài vẽ và cách chấm (yêu cầu của chủ dự án: bài "vẽ" thành dạng chấm được, giữ lời sách)

- 4.12 ("Vẽ hình bình hành EFHK có EF = 3 cm; FH = 4 cm."): bảng hình bình hành; cũng không có góc nên bé tự chọn góc FEK trong 45°, 60°, 75°; chấm khi EF = 3 và EK = FH = 4.
- 4.13 ("Vẽ hình bình hành ABCD có AB = 3 cm; BC = 5 cm; AC = 6 cm."): bảng biết đường chéo; chấm khi AB = 3, độ mở compa BC = 5 và AC = 6, đã vẽ hai cung, chấm C, hai đường song song và nối.
- 4.18 và 4.19 (cắt giấy): `manipulate` ghép miếng trên màn (3 miếng tam giác đều; 8 miếng hình thang cân), chấm khi đủ số miếng. Việc cắt giấy thật không chấm được.
- 4.16 và 4.17 (kiểm tra): `choice` bốn đáp án ghép (mỗi đáp án một tổ hợp). Hình 4.14 vẽ lại để B, C, D, A nằm trên bốn cạnh EFPQ; EFPQ vừa là hình bình hành vừa có bốn cạnh bằng nhau, đáp án giữ như sách ("là hình bình hành"). Hình 4.15: sách vẽ năm đỉnh A, B, C, D, E của hình lục giác đều (đỉnh F không vẽ), hình vẽ lại giữ vậy.
- 4.9: `match` tên hình với "Hình 4.12a ... d"; hình sách vẽ lại thành bốn hình riêng có chữ a), b), c), d).
- Giới hạn: máy chỉ biết bé chọn đúng số, đúng bước, không đo được nét vẽ thật trên giấy; 4.12 sách không cho góc nên cách chấm nhận mọi góc trong ba góc cho.

## Mẹo (1 khối `tip`, thử bằng chương trình tạm, không commit)

- `ve-hinh-binh-hanh` "Vẽ hai đường song song" (làm nhanh): êke trượt dọc thước thì các đường vẽ theo một cạnh êke song song; thử các hướng cạnh êke (1, 0), (0, 1), (3, 4), (1, 1), (−2, 5) và các vị trí trượt 0, 1, 3,5, 10.
- Ngoài ra đã thử: tam giác 3-5-6, 4-3-6, 5-4-7, 2-5-6, 2-3-4 vẽ được bằng compa; hình lục giác đều có đúng 6 hình thang cân gồm bốn đỉnh liên tiếp; hình học của mọi hình trong test (Hình 4.14 B, C, D, A nằm trên bốn cạnh EFPQ và hai đường chéo EP, FQ cắt nhau ở giữa, Hình 4.15 OA = AB = BC = CO = CD = DE = EO và BE song song CD).

## Review vòng 2 đến 5 (03/10/2026)

- Vòng 2 (toàn bài, 4 Reviewer Opus + Tổng hợp Opus, commit `a21fe18`): 6 Nghiêm trọng, 15 Nên sửa, 15 Góp ý. Nghiêm trọng: hai câu kho ôn có thêm đáp án đúng (tấm bìa, khung ảnh); lời `wrong` "hình thang cân chỉ có một cặp cạnh song song"; nhận hình thang cân chỉ vì "hai cạnh bên bằng nhau"; lời `wrong` hình thoi do vòng 1 đề xuất; tên điểm bị nét cắt (C, P, Q, O); gợi ý nấc 2 của 4.18 là trọn lời giải. Sửa ở `35c92de` (hình dùng chung `construction.ts`), `8bee844` (hình và test của bài), `6aa4e54` (`lesson.json`).
- Nhắc từ nền của bài phần 1 (yêu cầu của chủ dự án: bé có thể mở bài này ở ngày khác): một `note` nhắc "song song" kèm dấu mũi tên ở màn đầu `$.sections[0]`, nơi đầu tiên cần đến; các nhắc ngắn khác (cạnh đối, góc đối; hình chữ nhật, hình thoi, vuông góc ở `so-sanh-bon-hinh`; êke; độ mở compa; hình thang và êke trong "Nhắc lại" của 4.16, 4.17). Không thêm section, không dạy lại.
- Đọc hiểu (Haiku): lượt 1 130 / 9 / 0 (Hiểu rõ / Hiểu mơ hồ / Khó hiểu); viết lại ở `dc43142`; sau 3 lượt còn mơ hồ (ghi Nên sửa trong `review.md`, không chặn): câu quy tắc vẽ bằng compa của `ve-binh-hanh-cheo` và hai note mở đầu, lời giải 4.17, hai đề sách 4.16, 4.17 (chữ sách, giữ nguyên), hai lời `wrong` của vòng 5.
- Vòng 3 (chỉ phần đổi, Sonnet): 1 Nghiêm trọng (lời giải nói như quy tắc chung "hình thang cân có hai đáy dài ngắn khác nhau", "không phải hình bình hành"), sửa ở `fba50e3`. Vòng 4: 0 Nghiêm trọng, duyệt (`db9c2f8`). Vòng 5: hai lời `wrong` viết lại sau Haiku, 0 Nghiêm trọng, duyệt lại (`53216c0`).
- Walk lần đầu sau khi sửa: 1 lỗi điện thoại (câu `ve-bh-quy-trinh` sát thanh 5px), rút ngắn hai thẻ bước ở `e125aec`.

## Kiểm đã chạy khi tách (03/10/2026)

- `pnpm content:check --stats`: 0 lỗi; 7 `bookRef` (SBT 4.9, 4.12, 4.13, 4.16, 4.17, 4.18, 4.19), cả hai bài hợp 12 `bookRef` mỗi cái một lần; `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` đã chạy.
- `pnpm visual:shot` và `pnpm lesson:walk` trong git worktree tạm cổng 3780 (đã gỡ): kết quả ghi ở mục "Kiểm cuối" bên dưới.
- Cổng: `pnpm format` (tệp của bài), `pnpm lint` (chỉ thông báo info ở `video/projects/*/index.html` có từ trước), `pnpm typecheck`, `pnpm test` đạt.

## Kiểm cuối (03/10/2026, sau khi duyệt, commit `a214db2`)

- `pnpm visual:shot hinh-binh-hanh-hinh-thang-can`: 150/150 đạt. `pnpm lesson:walk hinh-binh-hanh-hinh-thang-can`: 0 lỗi, 0 cảnh báo, ba kích thước; cả hai chạy trong git worktree tạm cổng 3810 (đã gỡ); ảnh ở `.shots/hinh-binh-hanh-hinh-thang-can/` và `.shots/walk/hinh-binh-hanh-hinh-thang-can/`.
- `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` đã chạy. Cổng: `pnpm format` (tệp của bài), `pnpm lint` (chỉ cảnh báo ở video chưa commit của bài phần 1), `pnpm typecheck`, `pnpm test` (4935 đạt) đạt.

## Việc nên làm ở vòng sau

- Các câu `choice` có phương án là số chưa có `check` (lint không đòi); xét có cần.
- Bài gồm đúng 5 dạng câu (mức tối thiểu của `--stats`); xét thêm một dạng nếu section nào cần.

## Điểm nghi (đã xét ở review vòng 2, kết quả trong `review.md`)

- Bốn điều ngoài trang sách ở mục "Giả định", nhất là cách dùng thuật ngữ đã dạy ở bài phần 1 (`song song`, `tứ giác`): LL-09 với bài phần 1 là bài trước theo `order`.
- 4.12: bé tự chọn góc trong ba góc cho; xem cách chấm có chấp nhận được không.
- 4.16, 4.17: trên màn bé không đo được; đề là hình sách vẽ lại và các câu dẫn dạy cách kiểm tra bằng đo hai đường chéo, êke, hai góc kề đáy. Xét xem cách làm có đủ cho bé không (hình lời giải nấc 3 có số đo).
- Hình 4.14 vẽ lại để B, C, D, A nằm trên các cạnh của EFPQ; hình 4.15 và hình 4.19 (khay lục giác gồm 8 hình thang cân; lời đề sách không có dấu chấm cuối, được giữ nguyên).
- Câu có "luôn" và câu "chắc chắn" (section `so-sanh-bon-hinh`, `kiem-binh-hanh`): xét LL-01 và LL-10.
- Câu luyện dạng "kiểm tra": một khung gỗ hình thang có hai đường chéo 40 cm và 42 cm (section `cheo-hinh-thang-can`).
- Section `so-sanh-bon-hinh` nằm cuối phần hình, ngay trước các section vẽ: xét có nên cắt nếu bài vẫn dài (còn khoảng 5 phút), như đề xuất của vòng 1.

## Lời đọc giới thiệu và video (03/10/2026)

- **Giọng:** `hai-dang` (`video/projects/hinh-binh-hanh-hinh-thang-can/media.json`), vì bài phần 1 dùng `my-duyen`: xen kẽ giữa hai bài liền nhau. Lời đọc giới thiệu: Gemini Achird (50 giây, mọi câu 100%), không rơi về VieNeu.
- **Ba video** (Hải Đăng, VieNeu; mỗi video đặt ở đầu một section, hai video đầu có hai clip theo card; `video:check` đạt, Whisper mọi câu ≥ 97%):
  - `hinh-binh-hanh` (43,8 giây, 12 câu): cạnh đối bằng nhau và song song, góc đối bằng nhau, hai đường chéo cắt nhau tại trung điểm. Ở đầu section `hinh-binh-hanh`; clip `hinh-binh-hanh` và `cheo-hinh-binh-hanh`.
  - `hinh-thang-can` (41,4 giây, 12 câu): hai đáy song song, hai cạnh bên bằng nhau, hai góc kề đáy bằng nhau, hai đường chéo bằng nhau. Ở đầu section `hinh-thang-can`; clip `hinh-thang-can` và `cheo-hinh-thang-can`. Lời không nói hai đáy dài ngắn khác nhau hay "không phải hình bình hành" như quy tắc chung.
  - `ve-hinh-binh-hanh` (49,6 giây, 13 câu): vẽ hình bình hành bằng thước, thước đo góc và êke. Ở đầu section `ve-hinh-binh-hanh`; clip `ve-hinh-binh-hanh`.
- Review vòng 6 (Sonnet, chỉ phần đổi): 0 Nghiêm trọng, 5 Nên sửa đã sửa hết, chi tiết ở `review.md`. Câu có chữ "êke" ngắn bị Whisper nghe thành "AK" (khớp dưới 97%), nên chữ êke chỉ đứng trong câu dài hay ở chip.
- `lesson:walk`: 0 lỗi, 0 cảnh báo; `visual:shot`: 150/150 đạt; cả hai trong git worktree tạm cổng 3850 (đã gỡ). `media:upload hinh-binh-hanh-hinh-thang-can`: 11 tệp đã tải lên (9 tệp video, 2 tệp lời đọc).

## Việc tiếp theo: deploy

`pnpm deploy:prod --ref <SHA đã kiểm>` theo `docs/operations.md` "Đưa bài mới lên production" (media đã lên bucket trước). Ghi ra ngoài máy: chỉ chạy khi chủ dự án đồng ý cho bản phát hành này.

- **Ngoài phạm vi:** sửa nội dung bài (đã duyệt; sửa thì cần review lại), bài khác (kể cả phần 1), `src/sync/`, `src/offline/`. Media ngoài git: không ghi đè media của bài khác; không dùng `rm`; không dừng dev server cổng 3003, không dừng tiến trình theo tên.
