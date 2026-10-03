# Bàn giao: Bài 19 `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` (Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân)

## Trạng thái
- Cập nhật cuối: 03/10/2026. Bài đã soạn xong ở trạng thái `draft`: 19 phần (18 phần bài và phần cuối `bookPractice`), 18 thẻ, 118 câu, 132 hình (37 hình tương tác), 5 mẹo. Chưa review, chưa `content:hash --approve`, chưa `content:lock` (còn cảnh báo "169 id chưa có trong `ids.lock.json`" của `content:check`), chưa có lời đọc và video, chưa deploy.
- Kiểm đã chạy (xem mục "Kiểm đã chạy"): `content:check` 0 lỗi, `content:check --stats` mọi tiêu chí PASS, `visual:shot` đạt, `lesson:walk` 0 lỗi 0 cảnh báo, đọc hiểu Haiku, mẹo thử bằng chương trình.
- Việc kế tiếp: vòng review 1 (3 Opus Reviewer và 1 Opus Tổng hợp) do một phiên mới chạy theo mục "Giao việc review vòng 1". Người soạn không review và không duyệt bài này.

## Nguồn (sách bài tập, `sources/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`, không commit)
- Đề: tr.67–69 in (PDF 68–70), tệp `sbt-p67.png` đến `sbt-p69.png`. Tr.67 có tên bài, "Kiến thức cần nhớ", "Kĩ năng giải toán", ví dụ 1 và Hình 4.9; tr.68 có lời giải ví dụ 1, ví dụ 2 (Hình 4.10), bài 4.8 và 4.9 (Hình 4.11, 4.12), bài 4.10 đến 4.14; tr.69 có bài 4.15 đến 4.19 (Hình 4.13 đến 4.16). Tr.70 là đầu Bài 20 (không thuộc bài này); tệp `sbt-p70.png` đã chuyển khỏi thư mục nguồn.
- Lời giải: tr.115 in (PDF 116), tệp `sbt-p115.png`, mục "Bài 19" (4.8, 4.9, 4.15, 4.16, 4.17). Sách không in lời giải các bài vẽ và cắt ghép (4.10 đến 4.14, 4.18, 4.19). Tr.116 không có phần của Bài 19 (đầu trang là lời giải 4.24 của Bài 20); tệp `sbt-p116.png` đã chuyển khỏi thư mục nguồn, thư mục chỉ giữ bốn tệp đề và `sbt-p115.png`.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 67-70 (rồi 115-116) --subject math --series kntt --slug hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can --book sbt --offset 1`.
- Chương IV "Một số hình phẳng trong thực tiễn"; `number: 19`, `order: 19`, `chapter` `{ numeral: "IV", name: "Một số hình phẳng trong thực tiễn" }`.
- Nội dung nguồn: kiến thức cần nhớ (hình chữ nhật: bốn góc 90°, cạnh đối bằng nhau, hai đường chéo bằng nhau; hình thoi: bốn cạnh bằng nhau, hai đường chéo vuông góc, cạnh đối song song, góc đối bằng nhau; hình bình hành: cạnh đối bằng nhau, hai đường chéo cắt nhau tại trung điểm mỗi đường, cạnh đối song song, góc đối bằng nhau; hình thang cân: hai cạnh bên bằng nhau, hai đường chéo bằng nhau, hai đáy song song, hai góc kề một đáy bằng nhau), kĩ năng (mô tả yếu tố, vẽ hình chữ nhật, hình thoi, hình bình hành bằng dụng cụ, giải toán thực tế), ví dụ 1 và 2, bài 4.8 đến 4.19.

## Giả định (chủ dự án không hỏi được, ghi theo yêu cầu)
- Slug `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`; nguồn là sách bài tập, đã nạp cả trang đề và trang lời giải. Hình của sách được vẽ lại bằng hình vẽ của bài (không chép hình sách), giữ đúng hình dạng và tên điểm.
- Ví dụ 1 và 2 của sách không phải bài đánh số nên không có `bookRef`. Hai ví dụ không được chép: phần 16 có câu tìm hình chữ nhật nằm trong hình thoi (cách dựng khác), phần 18 có câu đếm hình thoi trong hình lục giác đều.
- Bài 19 chỉ dùng kiến thức trên trang sách bài tập và chuẩn lớp 6. Bốn điều không in trên các trang đã nạp nhưng cần để làm bài vẽ và bài kiểm tra, nên bài dạy chúng ngắn; reviewer cần xét theo luật "Không có trong sách" (đề xuất của người soạn: giữ, vì chúng suy ra trực tiếp từ "Kĩ năng giải toán" và từ bài 4.10 đến 4.17):
  1. Cách vẽ: hình chữ nhật bằng thước và êke; hình thoi bằng thước, thước đo góc và compa; hình bình hành bằng thước, thước đo góc và êke (biết hai cạnh và góc), hoặc bằng thước, compa và êke (biết hai cạnh và một đường chéo, bài 4.13).
  2. Dấu hiệu nhận biết dùng cho bài 4.15 đến 4.17 (điều ngược lại của kiến thức cần nhớ, đúng với mọi tứ giác): tứ giác có bốn cạnh bằng nhau là hình thoi; tứ giác có bốn góc vuông là hình chữ nhật; tứ giác có hai đường chéo cắt nhau tại trung điểm của mỗi đường là hình bình hành; hình thang có hai góc kề một đáy bằng nhau là hình thang cân.
  3. Các từ nền: "song song" (kiến thức nền tiểu học, `sourceRef` của phần 4 và thẻ có dấu "Kiến thức nền (tiểu học)", từ `song song` có `prerequisite` trong glossary), "trung điểm", "tứ giác", "hình thang", "cạnh bên", "cạnh đáy", "góc kề đáy", "cạnh đối", "góc đối" (định nghĩa ngắn ở màn đầu hay màn quy tắc của phần dùng chúng).
  4. Ba hình tam giác đều ghép thành hình thang cân; hai hình thang cân có đáy nhỏ bằng cạnh bên ghép thành hình lục giác đều (suy ra từ bài 4.18, 4.19 và Bài 18).
- Màu khái niệm: Cạnh blue, Góc violet, Đường chéo amber (như Bài 18), Hình chữ nhật teal, Hình thoi pink, Hình bình hành lime, Hình thang cân sky, Song song slate. Đã thêm vào `content/glossary/math.json` các từ hình chữ nhật, hình thoi, hình bình hành, hình thang cân, hình thang, song song, trung điểm, tứ giác, cạnh đối, góc đối, cạnh bên, cạnh đáy và 43 tên điểm/đoạn/hình mới (`AOB`, `EFHK`, `OABC`...). Màu hình không đứng trong câu chọn hình để khỏi lộ đáp án; ở câu chọn hình các hình đều để nét đen. Câu "luôn" được dùng ở các câu nói chung ("Hai đường chéo của hình chữ nhật luôn ..."); câu chọn hình không đưa hình vuông và không đưa cả hình chữ nhật lẫn hình thoi vào câu hỏi hình bình hành, để mỗi câu chỉ có một đáp án đúng (hình chữ nhật cũng là hình bình hành theo định nghĩa rộng).
- Số trong bài nhỏ, độ dài vẽ từ 2 đến 7 cm, góc 45°, 60°, 75°. Số của bài vẽ tách nhau: hình mẫu chạy từng bước (4 và 3; 3 và 75°; 5 và 3; 4, 3 và 6), cùng làm (6 và 2; 6 và 45°; 2 và 4; 5, 4 và 7), luyện (5 và 2; 2 và 60°; 6 và 2; 4, 5 và 6), kho ôn (7 và 3; 6 và 45°; 2 và 5; 4, 4 và 6), câu dẫn (4 và 6; 3; 4 và 2; 2, 3 và 4; 3 và 60°) và sách (3 và 5; 4; 3 và 4; 3, 5 và 6; 5 và 60°).
- Đơn vị cm nằm trong đề, không đặt `unit` của câu `numeric`.

## Cấu trúc bài (19 phần; 18 phần đầu mỗi phần một ý và một thẻ cùng tên)
1. `hinh-quanh-ta` Bốn hình quanh ta (cánh cửa, khung cánh diều, gạch lát nghiêng, thang chữ A; tên bốn hình).
2. `hinh-chu-nhat` Hình chữ nhật (bốn góc vuông, cạnh đối bằng nhau; định nghĩa góc vuông và cạnh đối).
3. `cheo-hinh-chu-nhat` Đường chéo của hình chữ nhật (hai đường chéo bằng nhau); mẹo "Kiểm tra khung hình chữ nhật".
4. `song-song` Hai cạnh song song (kiến thức nền tiểu học: thanh ray, hai đường song song, cặp cạnh song song của hình chữ nhật).
5. `hinh-thoi` Hình thoi (bốn cạnh bằng nhau, cạnh đối song song, góc đối bằng nhau).
6. `cheo-hinh-thoi` Đường chéo của hình thoi (vuông góc); mẹo "Hình thoi có góc 60°".
7. `hinh-binh-hanh` Hình bình hành (cạnh đối bằng nhau và song song, góc đối bằng nhau).
8. `cheo-hinh-binh-hanh` Đường chéo của hình bình hành (trung điểm; cắt nhau tại trung điểm của mỗi đường).
9. `hinh-thang-can` Hình thang cân (cạnh đáy, cạnh bên, hai cạnh bên bằng nhau, hai góc kề một đáy bằng nhau; thang chữ A và túi xách).
10. `cheo-hinh-thang-can` Đường chéo của hình thang cân (bằng nhau).
11. `so-sanh-bon-hinh` So sánh bốn hình (bốn hình cạnh nhau; đường chéo bằng nhau ở hình chữ nhật và thang cân, vuông góc ở hình thoi; chạm từng hình để đọc điểm riêng).
12. `ve-hinh-chu-nhat` Vẽ hình chữ nhật (thước và êke) .
13. `ve-hinh-thoi` Vẽ hình thoi (thước, thước đo góc, compa); mẹo "Vẽ hình thoi có góc 60°".
14. `ve-hinh-binh-hanh` Vẽ hình bình hành (thước, thước đo góc, êke); mẹo "Vẽ hai đường song song".
15. `ve-binh-hanh-cheo` Vẽ hình bình hành biết đường chéo (compa và êke, bài 4.13).
16. `kiem-thoi-chu-nhat` Kiểm tra hình thoi và hình chữ nhật (đo bốn cạnh, êke); mẹo "Kiểm tra góc vuông".
17. `kiem-binh-hanh` Kiểm tra hình bình hành và hình thang cân (đo hai đường chéo, hai góc kề đáy).
18. `ghep-hinh` Ghép hình thang cân (ba tam giác đều thành hình thang cân, hai hình thang cân thành hình lục giác đều).
19. `bai-tap-sach-bai-tap` Bài tập sách bài tập (phần cuối, `bookPractice`): bài 4.8 đến 4.19 (12 câu sách) và 16 câu dẫn; 4 khối "Nhắc lại" (câu quy tắc lặp nguyên văn câu của các phần trên).
- Mỗi phần dạy có 3 đến 4 màn: một hình chạy từng bước, màn quy tắc (`note` có `rule: true` và hình có nhãn), màn "Cùng làm" (hình tương tác: chạm để đo, chạm thẻ, bảng vẽ, ghép miếng); các phần 3, 6, 13, 14, 16 thêm mẹo. Mỗi phần: 2 câu kiểm tra, 1 câu luyện tập (`practiceIds`) và 2 câu kho ôn.
- Bảy dạng câu: `choice` 56 (11 câu chọn nhiều đáp án), `numeric` 31, `manipulate` 20, `match` 5, `order` 3, `tapRegion` 2, `fillBlank` 1.
- Đọc `docs/learner.md`: bé chậm, yếu đọc; mỗi câu chữ ≤ 25 âm tiết, mỗi `note` ≤ 2 câu; mỗi phần có tình huống đời sống (cánh cửa, khung cánh diều, gạch lát, thang chữ A, túi xách, khung ảnh, thanh ray, khay mứt Tết).

## Hình
- Bộ dựng hình dùng chung đã chuyển từ thư mục Bài 18 sang `src/visuals/shared/plane/` (commit `b201cc0`, `2b0162b`): `figure-spec.ts` (thêm mũi tên song song `arrows`), `geometry.ts`, `figure.tsx`, `figure-steps.tsx`, `probe-model.ts`, `probe.tsx`, `board.tsx` + `board-steps.ts` (bảng vẽ chung), `piece-board.tsx` (ghép miếng chung); Bài 18 chỉ đổi đường import và `construct.tsx`/`assemble.tsx` thành lớp mỏng trên bảng chung (test của Bài 18 vẫn đạt).
- Thư mục bài `src/visuals/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`:
  - `figures.ts`: `quad()` dựng bốn hình (hình chữ nhật 180×120, hình thoi cạnh 90 góc 60°/120°, hình bình hành đáy 150 cạnh 100 góc 60°/120°, hình thang cân đáy 110 và 200 cạnh bên 90 góc 60°) với các dấu (vạch cạnh bằng nhau, mũi tên song song, góc vuông, số đo góc, đường chéo bằng nhau / vuông góc / cắt nhau ở giữa); `isoTrapezoid`, `diagonalParallelogram`, `linesFigure`, `labelSide`, `textInCorner`; các hình của sách (4.9, 4.10 qua `hexagonDiagonals`, 4.11, 4.12, 4.13, 4.14, 4.15, ghép tam giác và khay).
  - `construction.ts` và `board-visual.tsx`: bốn bảng vẽ (hình chữ nhật, hình thoi, hình bình hành biết hai cạnh và góc, hình bình hành biết hai cạnh và đường chéo). Màn chỉ hiện bước cần làm và bước ngay trước nó (bảng đủ mọi nút cao hơn màn điện thoại), có nút "Vẽ lại từ đầu". Trạng thái mỗi bước một khóa; góc chọn trong 45°, 60°, 75°.
  - `logic.ts`: validator và solver `ve-hinh-chu-nhat`, `ve-hinh-thoi`, `ve-binh-hanh-hai-canh`, `ve-binh-hanh-duong-cheo`, `ghep-hinh`; mẫu đã thêm vào `tests/visuals/registry.test.tsx`; test riêng `tests/visuals/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can.test.tsx` (hình học của mọi hình, bảng vẽ, thẻ, ghép miếng).
  - `catalog-*.ts` (một phần mỗi nhóm phần, `catalog.ts` gộp và báo lỗi khi trùng khóa), `scene.tsx` (cánh cửa, khung diều, gạch, thang, túi), `gallery.tsx`, `tap-cards.tsx` (chạm thẻ để xem tên hình), `sticker.tsx`, `examples.tsx`.
- Hình gợi ý nấc 2 của câu chọn hình chỉ dùng chữ đề (không hình); hình gợi ý của câu sách dùng các hình chạy từng bước của phần dạy với số khác, hình lời giải nấc 3 chạy trọn lời giải với số của đề.

## Bài vẽ và cách chấm (yêu cầu của chủ dự án: bài "vẽ" thành dạng chấm được, giữ lời sách)
- Bài 4.10 ("Vẽ hình chữ nhật DEFG có DE = 3 cm; EF = 5 cm."): `manipulate` với bảng hình chữ nhật; chấm khi DE = 3, EF = 5 và đã vẽ hai đường vuông góc và nối. Sách không in lời giải.
- Bài 4.11 ("Vẽ hình thoi MNPQ có cạnh MN = 4 cm."): bảng hình thoi; sách không cho góc nên bé tự chọn góc NMQ trong 45°, 60°, 75° (mọi lựa chọn đều được chấp nhận), câu app ghi "Bạn tự chọn góc NMQ".
- Bài 4.12 ("Vẽ hình bình hành EFHK có EF = 3 cm; FH = 4 cm."): bảng hình bình hành; cũng không có góc nên bé tự chọn góc FEK; chấm khi EF = 3 và EK = FH = 4.
- Bài 4.13 ("Vẽ hình bình hành ABCD có AB = 3 cm; BC = 5 cm; AC = 6 cm."): bảng biết đường chéo; chấm khi AB = 3, độ mở compa BC = 5 và AC = 6, đã vẽ hai cung, chấm C, hai đường song song và nối.
- Bài 4.14 ("Vẽ hình thoi MNPQ có cạnh bằng 5 cm và một góc bằng 60°."): bảng hình thoi; chấm khi cạnh 5 và góc NMQ = 60° (câu app ghi rõ góc NMQ).
- Bài 4.18 và 4.19 (cắt giấy): `manipulate` ghép miếng trên màn (3 miếng tam giác đều; 8 miếng hình thang cân), chấm khi đủ số miếng. Việc cắt giấy thật không chấm được.
- Mọi bài vẽ chấm được trên màn. Giới hạn: máy chỉ biết bé chọn đúng số, đúng bước, không đo được nét vẽ thật trên giấy; bài 4.11 và 4.12 sách không cho góc nên cách chấm nhận mọi góc trong ba góc cho.
- Bài 4.15 đến 4.17 (kiểm tra): `choice`; bài 4.15 hai đáp án, bài 4.16 và 4.17 bốn đáp án ghép (mỗi đáp án một tổ hợp). Hình sách vẽ lại có số: ở Hình 4.13, AB = 8 cm và AD = 6 cm theo tỉ lệ 30 điểm một cm nên bốn cạnh MNPQ dài 5 cm (số này chỉ hiện ở hình lời giải, không có trong đề).
- Bài 4.8 và 4.9: `match` tên hình với "Hình 4.11a ... d" và "Hình 4.12a ... d"; hình sách vẽ lại thành bốn hình riêng có chữ a), b), c), d).

## Mẹo (5 khối `tip`, đã thử bằng chương trình tạm, không commit)
- `cheo-hinh-chu-nhat` "Kiểm tra khung hình chữ nhật" (làm nhanh): khung có các cạnh đối bằng nhau mà hai đường chéo bằng nhau thì là hình chữ nhật; thử hình bình hành cạnh 3 và 5, 5 và 5, 7 và 2, 1 và 1 với góc 90°, và 4 và 6 với góc 1°, 45°, 89°, 91°, 179°, hình thoi 6 và 6 góc 60°: đường chéo bằng nhau khi và chỉ khi góc 90°.
- `cheo-hinh-thoi` "Hình thoi có góc 60°" (hiểu nhanh): đường chéo ngắn bằng cạnh; thử cạnh 1, 2, 3, 4, 5, 6, 7, 10, 100, cả góc 60° và 120°.
- `ve-hinh-thoi` "Vẽ hình thoi có góc 60°" (làm nhanh): hai tam giác đều chung một cạnh ghép thành hình thoi; thử cạnh 1, 2, 3, 5, 7, 10: bốn cạnh bằng nhau, góc 120° và 60°.
- `ve-hinh-binh-hanh` "Vẽ hai đường song song" (làm nhanh): êke trượt dọc thước thì các đường vẽ theo một cạnh êke song song; thử các hướng cạnh êke (1, 0), (0, 1), (3, 4), (1, 1), (−2, 5) và các vị trí trượt 0, 1, 3,5, 10.
- `kiem-thoi-chu-nhat` "Kiểm tra góc vuông" (làm nhanh): góc tờ giấy khít là góc vuông, hở hay chờm ra thì không; thử góc 30°, 60°, 89° (chờm ra), 90° (khít), 91°, 120°, 150° (hở).
- Ngoài ra đã thử: tam giác 3-5-6, 4-5-6, 4-3-6, 5-4-7, 2-5-6, 2-3-4, 4-4-6 vẽ được bằng compa; hình lục giác đều có đúng 6 hình thang cân gồm bốn đỉnh liên tiếp và 6 hình thoi ghép từ hai tam giác cạnh nhau; hình học của mọi hình trong test (Hình 4.13 bốn cạnh MNPQ bằng nhau, Hình 4.14 B, C, D, A nằm trên bốn cạnh EFPQ và hai đường chéo EP, FQ cắt nhau ở giữa, Hình 4.15 OA = AB = BC = CO = CD = DE = EO và BE song song CD).

## Đọc hiểu (Haiku, `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`, không commit)
- Lượt 1 (toàn bài): 692 mục hiểu rõ, 61 mơ hồ, 0 khó hiểu; đã viết lại các mục không hiểu rõ.
- Lượt 2 (18 mục đã viết lại): 5 hiểu rõ, 11 mơ hồ, 2 khó hiểu. Hai mục khó hiểu (mẹo `thoi-60-do` và lời giải câu hình thoi cạnh 4 cm, góc 60°) đã viết lại, tách rõ "tam giác đều có ba cạnh bằng nhau"; chưa chạy lượt 3.
- Các mục còn mơ hồ chỉ vì Haiku đọc chữ không kèm hình (câu "Xem hình chạy từng bước...", từ "compa", "tâm", "bán kính", "song song"); mỗi chỗ đều có hình hoặc từ được giải ngay cạnh. Không chặn; Reviewer đọc lại bằng hình thật.

## Kiểm đã chạy
- `pnpm content:check`: 0 lỗi, 1 cảnh báo của bài này (id chưa khóa, do chưa chạy `content:lock`); `--stats`: mọi tiêu chí PASS, 12 `bookRef` (SBT 4.8, 4.9, 4.10, 4.11, 4.12, 4.13, 4.14, 4.15, 4.16, 4.17, 4.18, 4.19); `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` đã chạy.
- `pnpm visual:shot`: 264/264 đạt sau khi sửa (lần đầu 252/264: bảng vẽ biết đường chéo tràn khung điện thoại, một nhãn chồng nhãn). `pnpm lesson:walk`: 0 lỗi, 0 cảnh báo (ba kích thước: iPad dọc, điện thoại, iPad ngang), chạy trong git worktree tạm trên cổng 3710. Lần chạy cuối ở commit `b85bac6`: `visual:shot` 264/264, `lesson:walk` 0 lỗi 0 cảnh báo (trước đó có 3 lỗi hai nhãn 120° của hình thoi chồng nhau, đã sửa bằng `textDistance` của bộ đo). Lần walk đầu có 2 lỗi và 8 cảnh báo (dev overlay "4 Issues" do hai thẻ cùng tên trùng `key`, hình gợi ý ra ngoài màn ở iPad ngang, chữ 14,8px), đã sửa hết.
- `pnpm format` trên tệp của bài, `pnpm typecheck`, `pnpm test` đạt (một tệp, `tests/scripts/sources-import.test.ts`, quá thời gian khi cả bộ chạy cùng lúc, chạy riêng đạt). `pnpm lint` toàn kho báo lỗi ở ba tệp `video/projects/tap-hop-cac-so-nguyen/*/index.html` (có từ trước, không thuộc bài); `biome check src tests` sạch.

## Việc nên làm ở vòng sau
- Phần 11 `so-sanh-bon-hinh` và phần bài tập sách bài tập dài; tổng `minutes` của bài là 112 phút (19 phần). Reviewer xét có nên tách hay rút bớt.
- Các câu `choice` có phương án là số ("3 cm", "4 cm"...) chưa có `check` (lint không đòi); xét có cần.
- Chưa làm theo yêu cầu: lời đọc và video, `content:lock`, review và duyệt.

## Điểm nghi cho Reviewer
- Bốn điều ngoài trang sách ở mục "Giả định" (cách vẽ, dấu hiệu nhận biết, từ nền, ghép hình).
- Bài 4.11, 4.12: bé tự chọn góc trong ba góc cho; xem cách chấm có chấp nhận được không.
- Bài 4.15, 4.16, 4.17: trên màn bé không đo được; đề là hình sách vẽ lại và các câu dẫn dạy cách kiểm tra bằng đo cạnh, êke, đường chéo, góc kề đáy. Xét xem cách làm có đủ cho bé không (hình lời giải nấc 3 có số đo).
- Hình 4.14 vẽ lại để B, C, D, A nằm trên các cạnh của EFPQ; EFPQ trong hình này vừa là hình bình hành vừa có bốn cạnh bằng nhau, nhưng đáp án giữ như sách ("là hình bình hành").
- Hình 4.15: sách vẽ năm đỉnh A, B, C, D, E của hình lục giác đều (đỉnh F không vẽ); hình vẽ lại giữ vậy, kèm đường tròn.
- Hình 4.19: hình mẫu là khay lục giác gồm 8 hình thang cân (hai nửa ở giữa và sáu hình quanh); lời đề sách không có dấu chấm cuối và được giữ nguyên.
- Câu có "luôn" và câu "chắc chắn" (phần 11, 16, 17): xét LL-01 và LL-10.
- Hai câu luyện dạng "kiểm tra": một khung có hai đường chéo 30 cm và 34 cm (phần 3), một khung gỗ hình thang có hai đường chéo 40 cm và 42 cm (phần 10).

## Giao việc review vòng 1 (cho phiên mới, không phải người soạn)
Chạy `.claude/skills/lesson-review` mục "Vòng toàn bài" trên `content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/lesson.json` (`ROOT` là `content/`).
- **Đối tượng:** chỉ bài này (`lesson.json`, hình của nó trong `src/visuals/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/` và các tệp dùng chung `src/visuals/shared/plane/`, `content/glossary/math.json` các mục mới). Ảnh nguồn: `sources/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/sbt-p67.png` đến `sbt-p69.png` và lời giải `sbt-p115.png`.
- **Mô hình:** 3 Reviewer `model: "opus"` mở song song trong một lượt gọi, rồi 1 Tổng hợp `model: "opus"` (vòng 1 và 2 dùng Opus theo `.claude/rules/agents.md`).
- **Nhóm** (mỗi nhóm một tệp `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/nhom-<n>.md`): nhóm 1 gồm các phần 1 đến 6 (`hinh-quanh-ta`, `hinh-chu-nhat`, `cheo-hinh-chu-nhat`, `song-song`, `hinh-thoi`, `cheo-hinh-thoi`); nhóm 2 gồm các phần 7 đến 15 (`hinh-binh-hanh`, `cheo-hinh-binh-hanh`, `hinh-thang-can`, `cheo-hinh-thang-can`, `so-sanh-bon-hinh`, `ve-hinh-chu-nhat`, `ve-hinh-thoi`, `ve-hinh-binh-hanh`, `ve-binh-hanh-cheo`); nhóm 3 gồm các phần 16 đến 18 (`kiem-thoi-chu-nhat`, `kiem-binh-hanh`, `ghep-hinh`) và phần `bai-tap-sach-bai-tap` (đủ ba việc so với ảnh sách: đủ bài tập, đề y hệt sách, đáp án khớp lời giải; cùng việc soát câu dẫn).
- **Việc ngoài phạm vi (không làm):** sửa bài khác (kể cả Bài 18); đụng `src/sync/`, `src/offline/`, `src/lib/brand.ts`; làm lời đọc hay video; gọi Gemini; deploy; push; `content:lock`; `content:hash --approve` ở vòng này. Reviewer chỉ ghi phát hiện, không sửa `lesson.json` hay hình.
- **Hiệu ứng ngoài đĩa được phép:** ghi `.shots/review/...` (ngoài git), ghi `review.md` cạnh `lesson.json`, cập nhật `docs/lessons-learned/` (mục có Nghiêm trọng thì tăng số; thêm dòng "Lỗi Nghiêm trọng ở vòng 1 theo bài"), chạy lệnh cuối vòng của skill (`content:hash --mark` khi còn Nghiêm trọng). Chạy `pnpm lesson:walk` chỉ trong một `git worktree` tạm trên một cổng riêng (ví dụ 3710; `pnpm install --offline`, không `.next`), xoá bằng `git worktree remove --force` ngay sau đó; không dừng máy chủ dev của chủ dự án (cổng 3003) và không dừng tiến trình theo tên.
- **Tệp ngoài git:** thư mục `sources/` không có bản sao nào khác; chỉ đọc, không ghi đè, không xoá, và không dùng `rm`.
- **Điểm dừng:** gặp việc ngoài các điều trên thì dừng và báo, không tự mở rộng phạm vi.
- **Sau vòng 1:** một tác giả mới (không phải Reviewer) sửa Nghiêm trọng và các mục Nên sửa hợp lý, chạy Haiku đọc hiểu cho chữ đã đổi, rồi vòng 2 (Opus); chỉ khi hết Nghiêm trọng mới `content:hash --approve` và `content:lock`; lời đọc và video làm sau đó.
