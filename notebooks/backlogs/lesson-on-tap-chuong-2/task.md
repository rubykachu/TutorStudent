# Bàn giao: `on-tap-chuong-2` (Ôn tập chương II, Toán 6 tập 1, Kết nối tri thức)

## Trạng thái
- Cập nhật cuối: 02/10/2026 (checkpoint giữa review). Bản `draft`, chưa khoá id, chưa lời đọc, chưa video.
- Review: vòng 1 (8 Nghiêm trọng) và vòng 2 (7 Nghiêm trọng) đã xong, đã sửa hết ở commit `5e50603`, `6576c82`, `00df273`, `235555d`. `lesson:walk` 0 FAIL, `content:check` 0 lỗi ở `235555d`. Vòng 3 (chỉ phần đổi, Sonnet) đang chạy, ghi `review.md`; chưa biết kết quả.
- Việc tiếp theo: đọc `review.md`. Còn Nghiêm trọng thì sửa (tác giả), commit, `pnpm content:diff on-tap-chuong-2`, `pnpm lesson:walk on-tap-chuong-2` (worktree tạm, cổng 3140, `CONTENT_INCLUDE_DRAFT=1`, `public/media` nối tắt, gỡ sau khi chạy), vòng sau diff-only. 0 Nghiêm trọng thì: đối chiếu BCNN (section 10, 11, 13, câu 6 trắc nghiệm) với Bài 12 nếu đã xuất bản (nếu chưa, ghi vòng đối chiếu ở mục "Việc còn lại"), `pnpm content:hash on-tap-chuong-2 --approve`, `pnpm content:lock on-tap-chuong-2`, gate, `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`, cập nhật `notebooks/backlogs/index.md`.
- Worktree tạm của review: `.../scratchpad/on-tap-2-review/wt` (cổng 3140); gỡ bằng `git worktree remove --force` khi xong.

## Nguồn (sách bài tập, `sources/math/on-tap-chuong-2/`, không commit)
- Đề: tr.44–46 in (PDF 45–47), tệp `sbt-p44.png` (sơ đồ tổng kết), `sbt-p45.png` (câu hỏi trắc nghiệm 1–6, bài 2.56–2.58), `sbt-p46.png` (bài 2.59–2.64). Bài 13 bắt đầu ở tr.47.
- Lời giải: tr.110 in (PDF 111), tệp `sbt-p110.png` (đáp án trắc nghiệm và lời giải 2.56–2.64).
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 44-46 (rồi 110-110) --subject math --series kntt --slug on-tap-chuong-2 --book sbt --offset 1`. PDF không có lớp chữ nên `[textbook-copy]` không chạy; đối chiếu bằng ảnh.

## Giả định (chủ dự án yêu cầu không hỏi)
- Đề của bài là 100% đề của sách (đúng số, đúng chữ): ngoại lệ có chủ ý của chủ dự án, chỉ cho bài ôn tập này. Cơ chế chung: `kind: "review"` ở cấp bài và `bookRef` ở từng câu (xem "Cơ chế ngoại lệ chép sách").
- Phần nhắc lại, gợi ý, bước dẫn, giải thích, mẹo, recap: lời của bài, không chép.
- Bài ôn tập không có `number` (sách không đánh số "Bài"); có `chapter` II; `order: 12.5` (đứng sau Bài 12, trước Bài 13), nên `order` được phép là số thập phân.
- Câu của sách nhiều ý (a, b, c, d) được tách thành từng câu một; lời dẫn chung của sách đứng nguyên văn ở đầu đề mỗi ý. Chữ "(A)", "(B)"... và dấu ";" hay "." cuối lựa chọn bỏ đi vì app tự xáo và gắn nhãn lựa chọn.
- Sách chỉ cho đáp án trắc nghiệm hoặc lời giải mở; bài đổi sang dạng chấm được (chọn, điền, số) với đáp án lấy đúng từ trang lời giải. Dòng hướng dẫn cách trả lời trong app ("Chọn đáp án đúng.") là một `note` riêng đặt cuối đề.
- Bài 12 (BCNN) đang được soạn bản nháp bởi agent khác, chưa xuất bản khi bài này soạn: mọi chỗ dùng BCNN (phần 2.58, 2.60, 2.63, 2.64, câu 6 trắc nghiệm) phải đối chiếu lại với Bài 12 khi nó xuất bản (cách viết "BCNN(a, b)", câu quy tắc, màu khái niệm).

## Thiết kế
- 14 section, mỗi section một cụm bài sách, 14 card (mỗi card gồm các bước dẫn và câu của sách của section đó), 53 câu, 5 dạng bài, 6 hình tương tác, 6 mẹo (khối `tip`).
- Mỗi section theo một mẫu: các màn "Nhắc lại Bài X" (quy tắc bằng lời đã duyệt của Bài 7 đến 12, kèm ví dụ số khác sách) rồi các bước dẫn trong `checkIds` (câu tự chứa đủ đề, từ dễ đến khó, dùng đúng một số hay một ý của câu sách chứ không chép cả lời giải) rồi các ý của sách (mọi ý trừ ý cuối trong `checkIds`, ý cuối trong `practiceIds`). Bước dẫn và câu sách cùng mang card của section.
- Câu của sách có `bookRef` ("SBT câu hỏi n" hay "SBT 2.nn"); đề chép từng chữ, từng số; đáp án lấy từ trang lời giải tr.110 (đã tự kiểm lại bằng tính toán). Lựa chọn trắc nghiệm giữ đủ lời sách, bỏ chữ (A)...(D) và dấu ";" "." cuối.
- Hình: module `src/visuals/math/on-tap-chuong-2/` chỉ dùng hình dựng sẵn từ số: `rows`, `lines`, `chips`, `sticker` (`catalog.ts` là dữ liệu; `examples.tsx` dựng; test `tests/visuals/on-tap-chuong-2.test.tsx` kiểm các chip đúng theo toán). Nấc 2 của mỗi câu sách là hình `lines` dạng `hint` với số khác đề, dừng ở "?" trước kết quả.

## Câu của sách và cách dẫn
| Câu sách (SBT tr.45–46) | Section (nhắc lại) | Cách dẫn |
|---|---|---|
| Trắc nghiệm 1 (khẳng định sai về tổng, bội của 9, số chẵn) | `tinh-chat-tong` (Bài 8) | 2 bước: tổng hai số chia hết cho 9 (18 + 27), phản ví dụ (2 + 7 = 9); mẹo "Tìm khẳng định sai"; nấc 2 thử ví dụ với số 3 |
| Trắc nghiệm 4, 5 (chia hết cho 9; cho 9 mà không cho 5) | `dau-hieu-9-5` (Bài 9) | 2 bước: tổng chữ số của 2 549, 34 515 có chia hết cho 9 và 5 không; hình chạm "số chia hết cho 9"; mẹo "Chia hết cho 9" (gạch 9 và cặp tổng 9) |
| Trắc nghiệm 2, 3 (số nguyên tố; không là số nguyên tố) | `so-nguyen-to` (Bài 10) | 2 bước: tổng chữ số của 1 143, chọn nhiều số chia hết cho 2, 3, 5 (77 là hợp số nhưng dấu hiệu chưa loại); hình chạm; mẹo "Loại hợp số nhanh" (điều kiện: số lớn hơn 5) |
| 2.56 a, b (tổng là số nguyên tố hay hợp số) | `tong-hop-so` (Bài 8, 10) | 2 bước: mỗi số hạng có chia hết cho 7 không; 91 = 70 + 21 là hợp số; mẹo "Tích và tổng số chẵn"; đáp án là câu "Hợp số, vì ..." như sách |
| 2.59 a, b (A = 27 220 + 31 005 + 510 chia hết cho 2, cho 5) | `tong-dau-hieu-2-5` (Bài 8, 9) | 2 bước: chọn số chia hết cho 2; ba số hạng hai chia hết một không; hình chạm "tổng chia hết cho 5" |
| 2.59 c, d (cho 3, cho 9) | `tong-dau-hieu-3-9` (Bài 9) | 2 bước: chọn số chia hết cho 3; số không chia hết cho 3 thì không chia hết cho 9 |
| 2.57 a, b (tính rồi phân tích ra thừa số nguyên tố) | `phan-tich-so` (Bài 7, 10) | 2 bước: phép tính làm trước tiên (12²), điền 46 = 2 · 23; câu a điền 38 và 19, câu b chọn 2² · 19 (nhiễu từ lỗi thứ tự và quên bình phương) |
| 2.62 (6 chia hết cho n + 1) | `uoc-cua-6` (Bài 8) | 3 bước: chọn ước của 6, n + 1 là ước của 10, n + 1 = 3 thì n = 2; hình chạm ước của 8 và hình chạm đáp án (`manipulate`) |
| Trắc nghiệm 6 (khẳng định sai về ƯC, BC, ƯCLN, BCNN) | `uoc-bcnn-khang-dinh` (Bài 11, 12) | 3 bước: ước chung của 12 và 18, 24 là bội chung và bội của 12, phản ví dụ a = 4, b = 6, c = 12 |
| 2.58 (số học sinh khối 6, hàng 10; 12; 15 thừa 5) | `bcnn-bai-toan` (Bài 12) | 3 bước: BCNN(10, 12, 15) = 60 từ phân tích, n − 5 là bội chung, chọn bội của 60 trong 195..295; đáp án số 245 |
| 2.63 (tìm a, b từ ƯCLN và BCNN) | `so-mu-uclnn-bcnn` (Bài 11, 12) | 2 bước với số khác (tìm b từ số mũ nhỏ nhất, a từ số mũ lớn nhất), rồi điền a = 6, b = 2 |
| 2.60 (tìm số còn lại biết BCNN và ƯCLN) | `tim-so-con-lai` (Bài 12) | 2 bước: cách tìm số còn lại, số mũ của 3 trong tích; mẹo "Tìm số còn lại của hai số"; chọn 3⁴ · 5³ (có `check`) |
| 2.64 a, b (cộng, trừ phân số khác mẫu) | `quy-dong` (Bài 12, kiến thức nền tiểu học) | 2 bước: BCNN(14, 21) = 42, quy đồng 9/14 và 8/21; hai câu chọn kết quả (nhiễu: cộng tử cộng mẫu, quên nhân tử) |
| 2.61 (giải thích 12 345 679 · a · 9) | `giai-thich-111` (Bài 5) | 3 bước: đổi chỗ thừa số, 12 345 679 · 9, 111 111 111 · 4; mẹo "Nhân với 111 111 111"; câu sách là `order` xếp các dòng giải thích |

## Cơ chế ngoại lệ chép sách
- `kind: "review"` ở cấp bài và `bookRef` ở câu: làm bởi một subagent riêng trong commit `a584920`. `[textbook-copy]` bỏ qua bài ôn tập; `[length]` không áp cho chữ trong đề của câu có `bookRef`; `[book-ref]` báo lỗi khi `bookRef` nằm ở bài không phải ôn tập. Các luật chữ khác vẫn áp.
- `order` cho phép số thập phân (12.5). Quy ước nằm ở `.claude/rules/content.md`, `docs/spec.md` mục 5.1, `docs/lessons-learned/LL-08-chep-sgk.md`, checklist review trục 1 và skill `lesson-author` mục "Bài ôn tập chương".

## Kiểm tra đã chạy (02/10/2026)
- `pnpm content:check --stats`: 0 lỗi; cảnh báo duy nhất của bài là "id chưa có trong ids.lock.json" (khoá khi xuất bản). Các cảnh báo `[guides]` còn lại là của `tap-hop`, không phải bài này.
- `pnpm visual:shot on-tap-chuong-2` (worktree tạm, cổng 3140): 148/148, đã xem contact sheet.
- `pnpm lesson:walk on-tap-chuong-2` (worktree tạm, cổng 3140, `CONTENT_INCLUDE_DRAFT=1`, `public/media` nối tắt, đã gỡ sau khi chạy): 0 failures, 0 warnings, đã xem sheet iPad và điện thoại.
- Cổng `pnpm lint && pnpm typecheck && pnpm test` (129 tệp, 2477 test): qua. `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` đã chạy ở cây chính.

## Người review cần kiểm
- Độ khớp với sách: mọi câu có `bookRef` so với ảnh `sbt-p45.png`, `sbt-p46.png` (đề) và `sbt-p110.png` (đáp án). Chỉ được khác sách ở: bỏ nhãn (A)...(D) và dấu cuối lựa chọn, tách ý a), b), thêm khối `note` cuối đề ("Chọn tất cả...", "Sắp xếp...").
- Lời "Em hãy giải thích tại sao." của câu 2.61 giữ nguyên văn sách (xưng "em"); mọi chữ khác của bài xưng "bạn".
- Dạng trả lời là do bài đặt vì sách chỉ cho lời giải mở: 2.56, 2.59 (chọn "kết luận, vì ..."), 2.57a (điền), 2.57b và 2.60 và 2.64 (chọn), 2.58 (số), 2.61 (xếp thứ tự). Soát từng nhiễu có đúng một lựa chọn thoả đề (LL-01, LL-14), đặc biệt 2.56b: tổng cũng chia hết cho 3 và 5 nên các nhiễu của câu này không dùng lý do 3 hay 5.
- Mẹo (6 khối `tip`, chưa có `tips.json`): "Tìm khẳng định sai", "Chia hết cho 9", "Loại hợp số nhanh", "Tích và tổng số chẵn", "Tìm số còn lại của hai số", "Nhân với 111 111 111". Thử mỗi mẹo trên ≥ 5 số kể cả số biên; điều kiện đã ghi trong lời mẹo (số lớn hơn 5; hai số khác 0; chữ số a từ 1 đến 9).
- Quy tắc nhắc lại dùng nguyên câu đã duyệt của Bài 7 đến 11 (và bản nháp Bài 12); các câu viết lại: quy tắc "Một số hạng không chia hết..." của `tinh-chat-tong`, "Một tổng chia hết cho một số lớn hơn 1...", "Chia cho nhiều số đều dư như nhau...", "Biết tích và một thừa số...", "Số chia hết cho 9 thì chia hết cho 3, nên ...".
- Câu 2.58 không đặt `unit` vì `lint/walk.ts` chưa phân loại trường đó; đề đã ghi "Tính số học sinh". Các dòng xếp của câu 2.61 là chữ (không phải TeX) để tự xuống dòng trên điện thoại; công thức dài trong thẻ `order` tràn thẻ ở màn 390px.

## Việc còn lại sau review
- Đối chiếu lại các chỗ dùng BCNN khi Bài 12 xuất bản: câu "Rồi nhân cả tử lẫn mẫu..." của section `quy-dong` đã đổi khỏi câu của Bài 12 ("nhân tử và mẫu") vì từ "nhân tử" bị glossary cấm; cách viết "BCNN(a, b)" (sách dùng cả "BCNN(a; b)" ở câu 6 nên giữ nguyên ở đó); màu khái niệm (bài này không đặt khái niệm cho BC, BCNN để khỏi trùng màu với Bài 12).
- Xuất bản: `pnpm content:hash on-tap-chuong-2 --approve` (reviewer), `pnpm content:lock on-tap-chuong-2`.
- Lời đọc tổng quan và video: chưa làm (chủ dự án chưa yêu cầu).
