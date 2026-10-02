# Bàn giao: Bài 18 `hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu` (Hình tam giác đều. Hình vuông. Hình lục giác đều)

## Trạng thái
- Cập nhật cuối: 03/10/2026. Bài đã soạn xong ở trạng thái `draft`: 12 phần (11 phần bài và phần cuối `bookPractice`), 11 thẻ, 77 câu, 92 hình (15 hình tương tác). Chưa review, chưa `content:hash --approve`, chưa `content:lock` (còn cảnh báo "111 id chưa có trong `ids.lock.json`" của `content:check`), chưa có lời đọc và video, chưa deploy.
- Kiểm đã chạy (xem mục "Kiểm đã chạy"): `content:check` 0 lỗi, `content:check --stats` mọi tiêu chí PASS, `visual:shot` đạt, `lesson:walk` đạt, đọc hiểu Haiku năm lượt, mẹo thử bằng chương trình.
- Việc kế tiếp: vòng review 1 (3 Opus Reviewer và 1 Opus Tổng hợp) do một phiên mới chạy theo mục "Giao việc review vòng 1". Người soạn không review và không duyệt bài này.

## Nguồn (sách bài tập, `sources/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/`, không commit)
- Đề: tr.63–66 in (PDF 64–67), tệp `sbt-p63.png` đến `sbt-p66.png`. Tr.63 có "Kiến thức cần nhớ", "Kĩ năng giải toán", ví dụ 1; tr.64 có ví dụ 2 và 3 cùng bài 4.1; tr.65 có bài 4.2 đến 4.5; tr.66 có bài 4.6 và 4.7. Bài 19 bắt đầu ở tr.67 (PDF 68), không thuộc bài này.
- Lời giải: tr.115 in (PDF 116), tệp `sbt-p115.png`, mục "Bài 18" (4.1, 4.3, 4.4, 4.5, 4.6, 4.7). Sách không in lời giải bài 4.2 (bài vẽ), nên bài này tự đặt cách chấm (mục "Bài vẽ và cách chấm").
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 63-67 (rồi 115-116) --subject math --series kntt --slug hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu --book sbt --offset 1`. Hai tệp thừa (tr.67 đầu Bài 19 và tr.116) đã chuyển ra khỏi thư mục nguồn; thư mục chỉ giữ năm tệp của bài.
- Chương IV "Một số hình phẳng trong thực tiễn"; `number: 18`, `order: 18`, `chapter` `{ numeral: "IV", name: "Một số hình phẳng trong thực tiễn" }`.
- Nội dung nguồn: kiến thức cần nhớ (hình tam giác đều: ba cạnh bằng nhau, ba góc bằng 60°; hình vuông: bốn cạnh bằng nhau, bốn góc 90°, hai đường chéo bằng nhau; hình lục giác đều: sáu cạnh bằng nhau, sáu góc 120°, ba đường chéo chính bằng nhau), kĩ năng (mô tả, vẽ hình tam giác đều và hình vuông bằng dụng cụ, giải bài toán thực tế), ví dụ 1 đến 3 (tìm hình đều trong một hình), bài 4.1 đến 4.7.

## Giả định (chủ dự án không hỏi được, ghi theo yêu cầu)
- Slug `hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu`; nguồn là sách bài tập, đã nạp cả trang đề và trang lời giải. Bài này mở chương IV nên chưa có bài hình học nào trước đó.
- Hình của sách được vẽ lại bằng hình vẽ của bài (không chép hình sách): Hình 4.4 đến 4.8 giữ đúng hình dạng và tên điểm; Hình 4.4e là tam giác cân hơi cao hơn bản in để bé thấy rõ cạnh đáy ngắn hơn; Hình 4.6 là tam giác ABC cao 186 rộng 156 với hình vuông MNPQ nội tiếp đúng (cạnh 84,8). Đã kiểm bằng chương trình tạm (không commit) rằng Hình 4.8 có đúng 8 tam giác đều, 2 hình lục giác đều và 12 điểm (A đến F, M đến S).
- Bài 18 chỉ dùng kiến thức trên trang sách bài tập và chuẩn lớp 6. Ba điều không in trên các trang đã nạp nhưng cần để làm bài 4.2, 4.3, 4.4 và 4.5, nên bài dạy chúng ngắn: (1) cách vẽ hình tam giác đều bằng thước và compa và hình vuông bằng thước và êke (kĩ năng nêu ở tr.63); (2) định nghĩa đường chéo chính (nối hai đỉnh đối diện nhau, đi qua tâm) và đường chéo phụ (các đường chéo còn lại), vì bài 4.4a dùng từ "đường chéo phụ"; (3) hai đường chéo của hình vuông vuông góc với nhau, vì bài 4.3 hỏi điều này và đáp án in là "vuông góc". Reviewer cần xét ba điểm này theo luật "Không có trong sách" (đề xuất của người soạn: giữ, vì chúng suy ra trực tiếp từ bài 4.2 đến 4.4 và từ "Kĩ năng giải toán").
- Màu khái niệm: Cạnh blue, Góc violet, Đường chéo amber, Hình tam giác đều teal, Hình vuông pink, Hình lục giác đều lime (đã thêm vào `content/glossary/math.json` cùng các từ đỉnh, tâm, compa, êke, góc vuông, vuông góc, đường chéo chính, đường chéo phụ, thước đo góc và tên điểm). Màu hình không đứng trong câu chọn hình để khỏi lộ đáp án; ở câu chọn hình các hình đều để nét đen.
- Số trong bài nhỏ, độ dài vẽ từ 2 đến 7 cm. Số của bài vẽ tách nhau: hình mẫu chạy từng bước tam giác 5 cm và hình vuông 4 cm; cùng làm 3 cm; luyện 6 cm; câu dẫn 7 cm; sách 4 cm (tam giác) và 5 cm (hình vuông).
- Đơn vị cm nằm trong đề, không đặt `unit` của câu `numeric` (lint chưa phân loại trường này).

## Cấu trúc bài (12 phần; 11 phần đầu mỗi phần một ý và một thẻ cùng tên)
1. `hinh-deu-quanh-ta` Hình đều quanh ta (gạch lát nền, tổ ong, biển báo nguy hiểm; hình đều có các cạnh bằng nhau và các góc bằng nhau).
2. `tam-giac-deu` Hình tam giác đều (ba cạnh bằng nhau, mỗi góc 60°).
3. `hinh-vuong` Hình vuông (bốn cạnh bằng nhau, mỗi góc 90°, góc vuông).
4. `duong-cheo-hinh-vuong` Đường chéo của hình vuông (bằng nhau và vuông góc).
5. `luc-giac-deu` Hình lục giác đều (sáu cạnh bằng nhau, mỗi góc 120°).
6. `duong-cheo-luc-giac` Đường chéo của hình lục giác đều (tâm, đường chéo chính và phụ; ba đường chéo chính bằng nhau).
7. `ghep-luc-giac` Ghép hình lục giác đều (sáu tam giác đều ghép thành lục giác đều; đường chéo chính dài gấp đôi cạnh); có mẹo "Đường chéo chính".
8. `ve-tam-giac-deu` Vẽ hình tam giác đều (thước và compa); có mẹo "Độ mở compa".
9. `ve-hinh-vuong` Vẽ hình vuông (thước và êke); có mẹo "Lấy hai đoạn bằng nhau".
10. `kiem-tra-hinh` Kiểm tra bằng compa và êke (bài 4.5); có mẹo "Kiểm tra góc vuông".
11. `dem-hinh` Đếm hình trong một hình (ví dụ 1 đến 3, bài 4.7).
12. `bai-tap-sach-bai-tap` Bài tập sách bài tập (phần cuối, `bookPractice`): bài 4.1 đến 4.7 (10 câu sách) và 12 câu dẫn; 4 khối "Nhắc lại" (câu quy tắc lặp nguyên văn câu của các phần trên).
- Mỗi phần có ba màn dạy: một hình chạy từng bước (hoặc, ở phần 1, ba vật quanh ta), màn quy tắc (`note` có `rule: true` và hình có nhãn), màn "Cùng làm" (hình tương tác: chạm để đo, ghép, hay vẽ trên bảng); phần 7 đến 10 thêm một mẹo.
- Bảy dạng câu: `choice` 37 (9 câu chọn nhiều đáp án), `numeric` 26, `manipulate` 7, `match` 3, `order` 2, `fillBlank` 1, `tapRegion` 1.
- Đọc `docs/learner.md`: bé chậm, yếu đọc; mỗi câu chữ ≤ 25 âm tiết, mỗi `note` ≤ 2 câu; mỗi phần đều có tình huống đời sống (gạch, tổ ong, biển báo, tờ giấy, lá cờ, mặt sàn).

## Hình (`src/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/`)
- `catalog.ts`: mỗi hình một mục dữ liệu (92 mục, đều được `lesson.json` dùng). Loại: `figure` (hình tĩnh, có vùng chạm khi là `tapRegion`), `gallery` (nhiều hình kèm chú thích), `steps` (hình chạy từng khung), `probe` (chạm từng phần để đo), `construct` (bảng vẽ), `assemble` (ghép sáu tam giác), `sticker`.
- `figure-spec.ts`, `figure.tsx`, `figures.ts`, `geometry.ts`: mô tả một hình bằng dữ liệu (điểm có tên, đa giác, đoạn, vạch bằng nhau, góc, cung compa, thước kẻ) và vẽ ra SVG; `figures.ts` dựng ba hình đều, lưới ô vuông, lục giác ghép từ sáu tam giác và các hình của bài 4.4 đến 4.8.
- `construction.ts` và `construct.tsx`: bảng vẽ từng bước. Trạng thái mỗi bước một khóa (số cho bước chọn độ dài, 1 cho nút đã bấm, 1 hoặc 2 cho câu trả lời có/không); mỗi bước đợi các bước trước. Bảng tam giác: độ dài cạnh, độ mở compa, hai cung, điểm, nối. Bảng hình vuông: độ dài cạnh, hai đường êke, độ dài hai đoạn lấy thêm, nối, và (bài 4.3) hai đường chéo cùng câu hỏi vuông góc. Hình được vẽ từ trạng thái (`constructFigure`), nên khung hình mẫu, bảng và validator dùng chung một mô hình. Bảng vẽ giới hạn cao 188px để hình, lời chỉ dẫn và các nút vừa khung 30rem của `/dev/visuals`.
- `probe.tsx`, `probe-model.ts`: hình "chạm để đo": mỗi phần chưa đo hiện vòng "?" (vùng chạm ≥ 48px), chạm xong hiện số đo, "Tiếp" đợi tới khi đủ (hoặc "Xem cách làm"). `assemble.tsx`: nút cộng thêm từng miếng tam giác (trạng thái `{ n }`).
- Validator và solver trong `logic.ts`: `ve-tam-giac-deu`, `ve-hinh-vuong`, `ve-hinh-vuong-cheo` (tham số `{ side }`), `ghep-luc-giac` (`{ n }`); mẫu đã thêm vào `tests/visuals/registry.test.tsx`; test riêng ở `tests/visuals/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu.test.tsx`.
- Hình gợi ý nấc 2 của bài sách dùng số khác đề hoặc một hình tương tự và dừng ở "?"; hình lời giải nấc 3 chạy trọn lời giải với số của đề.

## Bài vẽ và cách chấm (yêu cầu của chủ dự án: bài "vẽ" thành dạng chấm được, giữ lời sách)
- Bài 4.2 ("Vẽ tam giác đều MNP có cạnh MN = 4 cm."): `manipulate` với bảng vẽ tam giác; chấm khi độ dài MN và độ mở compa đều bằng 4 cm, hai cung và điểm P đã vẽ, và đã nối. Sách không in lời giải bài này; đáp án là mô hình của bài.
- Bài 4.3 ("Vẽ hình vuông DEFQ có cạnh DE = 5 cm. Vẽ hai đường chéo DF và EQ. Hãy kiểm tra xem DF và EQ có vuông góc với nhau không."): `manipulate` với bảng vẽ hình vuông có hai đường chéo; chấm khi DE và DQ, EF bằng 5 cm, đã nối QF, đã vẽ DF và EQ và bé chọn "Vuông góc" (lời giải sách: hai đường chéo vuông góc với nhau).
- Bài 4.5 (dùng compa, êke để kiểm tra): chuyển thành `choice` hai đáp án ("là" hoặc "không phải"); hình chạy từng bước và hình "Cùng làm" dạy cách dùng compa và êke.
- Bài 4.6 ("cắt 6 hình tam giác đều … và ghép lại … tính độ dài đường chéo chính"): chuyển thành câu `numeric` hỏi độ dài (đáp án 10); bé có thể cắt giấy thật, nhưng việc cắt giấy thật không chấm được; câu dẫn cho bé ghép sáu miếng trên màn (`assemble`).
- Mọi bài vẽ chấm được trên màn. Giới hạn: máy chỉ biết bé chọn đúng số và bấm đủ các bước, không đo được nét vẽ thật trên giấy.

## Mẹo (4 khối `tip`, đã thử bằng chương trình tạm, không commit)
- `ghep-luc-giac` "Đường chéo chính": đường chéo chính của hình lục giác đều dài gấp đôi cạnh; thử cạnh 1, 2, 3, 5, 6, 7, 9, 10, 12, 15, 30 (toạ độ đỉnh của lục giác đều cạnh a), cả sáu cạnh bằng a và cả ba đường chéo chính bằng 2a.
- `ve-tam-giac-deu` "Độ mở compa" (tránh sai): giữ nguyên độ mở cho cả hai cung; thử cạnh 2 đến 7: điểm gặp nhau cách hai đầu cạnh đúng bằng cạnh.
- `ve-hinh-vuong` "Lấy hai đoạn bằng nhau" (làm nhanh): dùng một độ mở compa cho cả hai đường vuông góc.
- `kiem-tra-hinh` "Kiểm tra góc vuông" (làm nhanh): góc tờ giấy vở thay êke; đúng cho góc nhọn (hở), góc vuông (khít) và góc tù (chờm ra).
- Ngoài ra đã thử: hai đường chéo hình vuông cạnh 1, 2, 3, 5, 7, 10 bằng nhau và vuông góc (tích vô hướng 0); số đo "4,2 cm" ở hình chạm đo là đường chéo hình vuông cạnh 3 cm.

## Đọc hiểu (Haiku, `.shots/review/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/`, không commit)
- Lượt 1 (476 mục chữ bé thấy: tổng quan, tên phần, đề, lựa chọn, lời giải thích, `note`, `caption`, recap, mẹo): 437 Hiểu rõ, 29 Hiểu mơ hồ, 0 Khó hiểu. Các mục mơ hồ xoay quanh từ "đường chéo", "chính" và "phụ", "tâm", "đối nhau", vì Haiku đọc từng mục không có hình.
- Đã viết lại 22 mục: thêm lời giải nghĩa "tâm là điểm chính giữa của hình" ở màn đầu phần 6; "đối nhau" thành "đối diện nhau"; "cách nhau một đỉnh" thành "giữa chúng còn một đỉnh khác"; câu lệnh của app ở các câu về đường chéo chính và phụ giải nghĩa thêm "tức các đường đi qua (không đi qua) tâm"; mục tiêu tổng quan giải nghĩa "đường chéo". Lượt 2 trên 22 mục đã viết lại: 22 Hiểu rõ.
- Bốn câu đếm hình ở phần 11 và câu dẫn bài 4.7b được viết lại cho rõ nghĩa ("Có tất cả bao nhiêu hình …, kể cả hình ghép từ các hình nhỏ?"). Lượt 3 trên 5 mục đó: 2 Hiểu rõ, 3 Hiểu mơ hồ (`$.exercises[50]`, `[52]`, `[75]`), cả ba vì đề nói "như hình" mà Haiku không thấy hình; bé thấy hình nên không chặn.
- Còn mơ hồ không chặn: tên phần "Đường chéo của hình vuông" và "Đường chéo của hình lục giác đều" (tên thuật ngữ, được giảng ngay ở màn đầu của phần).

## Kiểm đã chạy
- `pnpm content:check`: 0 lỗi, 1 cảnh báo (id chưa khóa, do chưa chạy `content:lock`); `--stats`: mọi tiêu chí PASS, 10 `bookRef` (SBT 4.1, 4.2, 4.3, 4.4a, 4.4b, 4.5a, 4.5b, 4.6, 4.7a, 4.7b); `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` đã chạy.
- `pnpm visual:shot`: 184/184 đạt. `pnpm lesson:walk`: 0 lỗi, 0 cảnh báo (ba kích thước: iPad dọc, điện thoại, iPad ngang), chạy trên bản nội dung cuối.
- `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (208 tệp, 4477 đạt) đều đạt.
- Đọc hiểu lượt 4 trên 32 mục: 24 Hiểu rõ, 8 Hiểu mơ hồ; lượt 5 trên 9 mục viết lại: 8 Hiểu rõ, 1 Hiểu mơ hồ (câu "ghép thành ba cặp đỉnh đối diện", từ "ghép"; bé thấy hình nên không chặn). Không mục nào Khó hiểu.

## Việc nên làm ở vòng sau
- Các hình gợi ý nấc 2 của bài 4.4a, 4.4b, 4.5a, 4.5b, 4.7a, 4.7b đã đổi sang hình tương tự hay hình quy tắc (không dùng chính hình của đề) để không lộ kết quả; reviewer xét lại theo "Luật gợi ý 3 nấc".
- Chưa làm theo yêu cầu: lời đọc và video, `content:lock`, review và duyệt.

## Điểm nghi cho Reviewer
- Bài 4.4b: sách bảo "đo độ dài các cạnh"; trên màn không đo được, nên đề thành câu chọn 4 đáp án và hình gợi ý cho thấy các đường chéo phụ bằng nhau. Xét xem cách làm có đủ cho bé không.
- Bài 4.5a, 4.5b: hình 4.6 là hình tự vẽ; ABC cao hơn rộng đủ để bé thấy BC ngắn hơn (tỉ số cạnh bên : đáy ≈ 1,29, như bản in).
- Bài 4.7a: đáp án chọn "ABCDEF" và "MNPQRS" (sách: "Các hình lục giác đều là ABCDEF và MNPQRS"); nhiễu ACE và BDF là hai tam giác lớn của hình.
- Ba mục "ngoài trang sách" ở mục "Giả định".
- Số đo ở hình "chạm để đo" tính từ cạnh 3 cm: đường chéo hình vuông 4,2 cm (làm tròn một chữ số thập phân), đường chéo chính hình lục giác đều 6 cm. Xem chúng có nhất quán với lời "bằng nhau" ở màn quy tắc.

## Giao việc review vòng 1 (cho phiên mới, không phải người soạn)
Chạy `.claude/skills/lesson-review` mục "Vòng toàn bài" trên `content/math/kntt/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/lesson.json` (`ROOT` là `content/`).
- **Đối tượng:** chỉ bài này (`lesson.json`, hình của nó trong `src/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/`, `content/glossary/math.json` các mục mới). Ảnh nguồn: `sources/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/sbt-p63.png` đến `sbt-p66.png` và lời giải `sbt-p115.png`.
- **Mô hình:** 3 Reviewer `model: "opus"` mở song song trong một lượt gọi, rồi 1 Tổng hợp `model: "opus"` (vòng 1 và 2 dùng Opus theo `.claude/rules/agents.md`).
- **Nhóm** (mỗi nhóm một tệp `.shots/review/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/nhom-<n>.md`): nhóm 1 gồm các phần 1 đến 4 (`hinh-deu-quanh-ta`, `tam-giac-deu`, `hinh-vuong`, `duong-cheo-hinh-vuong`); nhóm 2 gồm các phần 5 đến 8 (`luc-giac-deu`, `duong-cheo-luc-giac`, `ghep-luc-giac`, `ve-tam-giac-deu`); nhóm 3 gồm các phần 9 đến 11 (`ve-hinh-vuong`, `kiem-tra-hinh`, `dem-hinh`) và phần `bai-tap-sach-bai-tap` (đủ ba việc so với ảnh sách: đủ bài tập, đề y hệt sách, đáp án khớp lời giải; cùng việc soát câu dẫn).
- **Việc ngoài phạm vi (không làm):** sửa bài khác; đụng `src/sync/`, `src/offline/`, `src/lib/brand.ts`; làm lời đọc hay video; gọi Gemini; deploy; push; `content:lock`; `content:hash --approve` ở vòng này. Reviewer chỉ ghi phát hiện, không sửa `lesson.json` hay hình.
- **Hiệu ứng ngoài đĩa được phép:** ghi `.shots/review/...` (ngoài git), ghi `review.md` cạnh `lesson.json`, cập nhật `docs/lessons-learned/` (mục có Nghiêm trọng thì tăng số; thêm dòng "Lỗi Nghiêm trọng ở vòng 1 theo bài"), chạy lệnh cuối vòng của skill (`content:hash --mark` khi còn Nghiêm trọng). Chạy `pnpm lesson:walk` chỉ trong một `git worktree` tạm trên cổng 3690 (`pnpm install --offline`, nối `public/media`, không `.next`), xoá bằng `git worktree remove --force` ngay sau đó; không dừng máy chủ dev của chủ dự án (cổng 3003) và không dừng tiến trình theo tên.
- **Tệp ngoài git:** thư mục `sources/` không có bản sao nào khác; chỉ đọc, không ghi đè, không xoá, và không dùng `rm`.
- **Điểm dừng:** gặp việc ngoài các điều trên thì dừng và báo, không tự mở rộng phạm vi.
- **Sau vòng 1:** một tác giả mới (không phải Reviewer) sửa Nghiêm trọng và các mục Nên sửa hợp lý, chạy Haiku đọc hiểu cho chữ đã đổi, rồi vòng 2 (Opus); chỉ khi hết Nghiêm trọng mới `content:hash --approve` và `content:lock`; lời đọc và video làm sau đó.
