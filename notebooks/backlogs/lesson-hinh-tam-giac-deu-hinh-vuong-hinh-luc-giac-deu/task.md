# Bàn giao: Bài 18 `hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu` (Hình tam giác đều. Hình vuông. Hình lục giác đều)

## Trạng thái
- Cập nhật cuối: 03/10/2026. Bài ở trạng thái `draft`, đã qua review vòng 1 và đã sửa theo vòng 1; chưa review vòng 2, chưa `content:hash --approve`, chưa `content:lock`, chưa có lời đọc và video, chưa deploy.
- Vòng 1 (3 Reviewer Opus song song và 1 Tổng hợp Opus): 8 Nghiêm trọng, 24 Nên sửa, 13 Góp ý; ghi ở `review.md` cạnh `lesson.json` (commit 348e484, kèm `content:hash --mark`, "Bản đã review" `f1ad7433…`). Kết quả sửa ở mục "Sửa sau vòng 1".
- Việc kế tiếp: vòng review 2 (toàn bài, Opus) do một phiên mới chạy theo mục "Giao việc review vòng 2". Phiên đã sửa vòng 1 không review và không duyệt bài này.

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

## Sửa sau vòng 1 (commit 37fa3d1, 60b09db, dc4d2ca)
- Tác giả Sonnet sửa theo `review.md`; điều phối sửa thêm hai lỗi bố cục do `visual:shot` báo. `lesson:walk` (ba kích thước) 0 lỗi, 0 cảnh báo; `visual:shot` 200/200 đạt (chạy trong worktree tạm, cổng 3700).
- Nghiêm trọng 1 đến 8: đã sửa. Bỏ khái niệm chung "hình đều" (quy tắc phần 1 nói về đúng ba hình; tên phần "Ba hình quanh ta"); bỏ "tâm" khỏi bài (đường chéo chính nối hai đỉnh đối diện nhau; đường chéo phụ nối hai đỉnh mà giữa chúng chỉ có một đỉnh; hình `luc-giac-cheo-cac-buoc` còn chấm điểm giữa không gọi tên); sửa `explain` của `noi-vat-voi-hinh` và `dem-hinh-vuong-hai-hang`; nhãn đo "AC = 4,2 cm", "BD = 4,2 cm" dưới hình vuông; `hai-cung-gap-nhau` nêu rõ mở compa bằng cạnh AB; hình gợi ý 4.5a vừa khung, có tên X, Y, Z; màn "Cùng làm" phần 11 dùng tam giác chia 4 nhỏ (9 tam giác đều), câu dẫn 4.7b dùng tam giác chia 9 nhỏ (13), không còn chép Hình 4.1.
- Nên sửa: đã làm 21 trên 24, gồm sửa khoá React trùng trong `src/visuals/shared/plane/probe-model.ts` (hình chạm đo không vẽ một đoạn hai lần; có test), bảng vẽ to hơn trên iPad (cap `max(188px, min(46vw, 282px))`), hình chạm đo cho 4.4b, 4.5a, 4.5b và `kiem-mot-goc-khong-vuong`. Làm khác review: Nên sửa 21, bảng vẽ báo sai độ dài ngay trên màn bài học nhưng trong câu hỏi chỉ nói "Bạn đã bấm đủ các bước. Hãy bấm Kiểm tra." (không lộ đúng sai, theo quy ước `isLessonScreen`).
- Id đổi: `ex.dan-4-7b-tam-giac-bon` thành `ex.dan-4-7b-tam-giac-chia-9` (bài chưa khoá id); hình `dem-tam-giac-bon` bỏ, thêm `dem-tam-giac-chia-9`.
- Đọc hiểu Haiku lượt 6 trên 40 mục chữ đã đổi (`.shots/review/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/doc-hieu-6.md`): 31 Hiểu rõ, 9 Hiểu mơ hồ, 0 Khó hiểu. Các mục mơ hồ là từ "đối diện nhau", "giữa chúng chỉ có một đỉnh", "vuông góc", "êke" và lời giải nghĩa đường chéo trong ngoặc ở `overview.goals[1]`; bé thấy hình kèm theo nên không chặn, vòng 2 xét lại.

## Để ngỏ sau vòng 1 (vòng 2 quyết)
- Nên sửa 1, phần 8 và 9: các bước vẽ tam giác đều bằng thước và compa, hình vuông bằng thước và êke không in trên trang sách bài tập nào đã nạp. `sourceRef` trỏ dòng "Kĩ năng giải toán" tr.63 và bài 4.2, 4.3. Đây là cách vẽ chuẩn lớp 6 lấy theo dòng kĩ năng tr.63; chủ dự án quyết có nạp trang SGK Bài 18 phần cách vẽ hay không.
- Nên sửa 20 (nhiễu của bài 4.7a loại được bằng cách đếm chữ cái): chưa sửa. Nhiễu đề xuất "ACNDFR" bị lint `[vietnamese]` chặn vì chuỗi này chưa có trong `glossary.names`, và glossary đang có agent khác sửa. Cần thêm tên vào `content/glossary/math.json` khi không còn ai sửa tệp đó, rồi thay nhiễu.
- Mục "tâm" trong glossary giữ nguyên (bài này không còn dùng); chỉ bỏ sau khi kiểm không bài nào khác dùng.

## Giao việc review vòng 2 (cho phiên mới, không phải người soạn hay người sửa vòng 1)
Chạy `.claude/skills/lesson-review` mục "Vòng toàn bài" (vòng 2) trên `content/math/kntt/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/lesson.json` (`ROOT` là `content/`).
- **Đối tượng:** chỉ bài này (`lesson.json`, hình trong `src/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/`, phần dùng chung `src/visuals/shared/plane/` chỉ đọc). Ảnh nguồn: `sources/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/sbt-p63.png` đến `sbt-p66.png` và `sbt-p115.png`.
- **Mô hình:** 3 Reviewer `model: "opus"` mở song song (cùng ba nhóm như vòng 1: phần 1 đến 4; phần 5 đến 8; phần 9 đến 11 và `bai-tap-sach-bai-tap`), rồi 1 Tổng hợp `model: "opus"`. Mỗi Reviewer đọc `review.md` vòng 1 và kiểm từng mục đã sửa còn đúng, rồi soát toàn nhóm như vòng đầu (bản sửa có thể tạo lỗi mới: hình mới, câu mới, id đổi). Tệp nhóm `.shots/review/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/nhom-<n>.md` (ghi đè bản vòng 1).
- **Việc ngoài phạm vi (không làm):** sửa bài khác (Bài 19 `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` đang do agent khác soạn, dùng chung `src/visuals/shared/plane/`, `src/visuals/registry.ts` và glossary); đụng `src/sync/`, `src/offline/`, `src/lib/brand.ts`; lời đọc, video; gọi Gemini; deploy; push; `git add -A`; `pkill`.
- **Hiệu ứng được phép:** ghi `.shots/review/...`, ghi `review.md`, cập nhật `docs/lessons-learned/`, lệnh cuối vòng: `content:hash --mark` khi còn Nghiêm trọng; khi 0 Nghiêm trọng: `pnpm content:hash hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu --root content --approve` rồi `pnpm content:lock hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu`, chỉ khi chủ dự án đã giao vòng 2 kèm quyền duyệt. Chạy `pnpm lesson:walk` và `pnpm visual:shot` chỉ trong một `git worktree` tạm (`pnpm install --offline`, nối `public/media`, `TEST_PORT=3700`), xoá bằng `git worktree remove --force`; không dừng máy chủ dev của chủ dự án (cổng 3003).
- **Tệp ngoài git:** `sources/` chỉ đọc, không ghi đè, không xoá; không dùng `rm` dưới mọi dạng.
- **Điểm dừng:** gặp việc ngoài các điều trên thì dừng và báo.
- **Sau vòng 2:** nếu còn Nghiêm trọng, một tác giả mới sửa rồi vòng 3 (Sonnet, chỉ phần đổi); hết Nghiêm trọng thì duyệt, khoá id, rồi lời đọc và video.
