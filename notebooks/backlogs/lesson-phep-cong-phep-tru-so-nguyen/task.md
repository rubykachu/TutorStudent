# Bàn giao: Bài 14 `phep-cong-phep-tru-so-nguyen` (Phép cộng và phép trừ số nguyên)

## Trạng thái
- Cập nhật cuối: 03/10/2026 (thêm phần bài tập sách bài tập, xem mục cuối); trước đó 02/10/2026 (thêm lời đọc và 3 video, xem mục "Lời đọc và video"). Đã duyệt và xuất bản: review vòng 1 (Opus, 8 Nghiêm trọng), vòng 2 (Opus, 4), vòng 3 (Sonnet, chỉ phần đổi, 1), vòng 4 (Sonnet, chỉ phần đổi, 0); `reviewedHash` ghi, `published`; id đã khoá (`content:lock`, 97 id); `content:emit` chạy với bản nháp. 13 phần thường và 1 phần bài tập sách bài tập, 13 thẻ, 105 câu, 6 dạng câu, 13 hình bấm mũi tên, 3 mẹo; `content:check --stats` 0 lỗi, `visual:shot` 100/100, `lesson:walk` 0 failures 0 cảnh báo.
- Đọc hiểu (Haiku): lượt 1 toàn bài 100/25/1 (Hiểu rõ / mơ hồ / khó), lượt 2 trên 23 mục viết lại 6/15/2, lượt 3 trên 14 mục 7/7/0, lượt trên mục đổi sau vòng 3 5/4/3; các mục còn "Hiểu mơ hồ" là thuật ngữ cần bài dạy (phần số tự nhiên, kí hiệu −(−5), quy tắc cộng khác dấu), ghi ở Nên sửa của `review.md`.
- Việc còn lại: (1) `pnpm media:upload phep-cong-phep-tru-so-nguyen` và deploy chưa chạy, cần chủ dự án đồng ý (lời đọc và video đã làm xong ở máy, xem mục "Lời đọc và video"); (2) Nên sửa và Góp ý còn mở trong `review.md` (3 Nên sửa, 5 Góp ý của vòng 4: mẹo `dau-truoc` còn nói "phần lớn trừ phần nhỏ" lệch "phần số tự nhiên", hai note phần 1 và 2 còn "Hiểu mơ hồ", hình quy tắc phần 8 có kết quả −5, −3 trùng đáp án hai câu của phần; màn cùng làm cho phần cộng với 0 chưa có); (3) việc của app, không thuộc bài: bàn phím `numeric` luôn có phím "mũ" kể cả ở bài không dùng luỹ thừa; hình `rows` xếp nhãn lúc bên phải lúc bên dưới; chữ trong note bị ngắt dòng giữa phép tính trên điện thoại. Khi đã làm xong các việc này, lưu trữ thư mục này theo `.claude/rules/agents.md`.
- Sửa chữ bài sau này: chạy `pnpm content:diff phep-cong-phep-tru-so-nguyen`, Haiku đọc hiểu các mục đổi, một vòng review chỉ phần đổi, rồi `pnpm content:hash phep-cong-phep-tru-so-nguyen --approve`.

## Nguồn (sách bài tập, `sources/math/phep-cong-phep-tru-so-nguyen/`, không commit)
- Đề: tr.50–52 in (PDF 51–53), tệp `sbt-p50.png`, `sbt-p51.png`, `sbt-p52.png`. Bài 15 bắt đầu ở tr.53.
- Lời giải: tr.111 in (PDF 112), tệp `sbt-p111.png`, mục "Bài 14" (3.9, 3.10, 3.15, 3.16, 3.17, 3.18, 3.19). Sách không in đáp án bài 3.8, 3.11 đến 3.14; đáp án các bài này do người soạn tự tính.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 50-52 (rồi 111-111) --subject math --series kntt --slug phep-cong-phep-tru-so-nguyen --book sbt --offset 1`.
- Chương III "Số nguyên"; `number: 14`, `order: 14`, `chapter` `{ numeral: "III", name: "Số nguyên" }`.
- Nội dung nguồn: kiến thức cần nhớ 1 đến 6 (phần dấu và phần số tự nhiên, số đối và −(−x) = x, quy tắc cộng hai số nguyên, trừ hai số nguyên, giao hoán và kết hợp, tổng nhiều số), ví dụ 1 (giá trị biểu thức A = x + (−27) − 234), ví dụ 2 (tính hợp lí), bài 3.8 đến 3.19.

## Cấu trúc bài (13 phần, mỗi phần một ý, từ dễ đến khó; mọi phép tính đều dạy bằng đi trên trục số)
1. `phan-dau` Dấu và số của số nguyên (phần dấu, phần số tự nhiên; kiến thức 1; bài 3.8).
2. `so-doi` Số đối của một số (kiến thức 2; bài 3.9, 3.10).
3. `cong-so-duong` Cộng với số dương: từ số đầu đi sang phải (nhiệt độ ấm lên).
4. `cong-so-am` Cộng với số âm: từ số đầu đi sang trái (thang máy, nợ).
5. `tong-so-doi` Tổng của hai số đối nhau (kiến thức 3).
6. `cong-voi-0` Cộng với số 0 (kiến thức 3; tách riêng ở review vòng 1 vì là quy tắc thứ hai).
7. `cung-dau` Cộng hai số cùng dấu (kiến thức 3).
8. `khac-dau` Cộng hai số khác dấu (kiến thức 3); mẹo "Cộng hai số khác dấu".
9. `tru-so-duong` Trừ đi một số dương: trừ là cộng với số đối (kiến thức 4).
10. `tru-so-am` Trừ đi một số âm (kiến thức 2, 4; bài 3.14); mẹo "Cộng hoặc trừ đi một số âm".
11. `tinh-chat` Đổi chỗ và nhóm các số hạng (kiến thức 5, 6; ví dụ 2; bài 3.18, 3.19); mẹo "Tổng có hai số đối nhau".
12. `gia-tri-bieu-thuc` Thay chữ bằng số rồi tính (ví dụ 1; bài 3.15).
13. `bai-toan-thuc-te` Bài toán đời sống (bài 3.16, 3.17).
- Màu khái niệm: số nguyên dương lime, số nguyên âm pink, số 0 slate, số đối sky, số hạng blue, tổng amber, hiệu teal (cùng màu với glossary và Bài 13). Mũi tên cộng số dương lime, cộng số âm pink; điểm "đầu" blue, điểm "tổng" amber hay "hiệu" teal. Nhãn tên bước làm trong hình (`rows`, `lines`) dùng màu violet, màu duy nhất bài không dùng cho khái niệm, vì dấu hình của sky (thập) và slate (gạch ngang) đọc nhầm thành phép tính.
- Hình: `src/visuals/math/phep-cong-phep-tru-so-nguyen/` (`catalog.ts`: mỗi hình một dòng dữ liệu; `walk()` dựng một chuỗi bước đi trên trục số; `hop-try.tsx`: bé bấm mũi tên đi từng vạch, báo `{ p0 }`, dùng validator `dat-diem` của Bài 13; `logic.ts`: vị trí, khoảng trục, số nào được ghi dưới vạch).
- Mẹo (3 khối `tip`, đã thử bằng chương trình trước khi viết): `dau-truoc` (1740 cặp số khác dấu từ −30 đến 30, gồm ±1, ±30, hai phần bằng nhau cho tổng 0), `hai-dau-lien-nhau` (1891 trường hợp a ± b, gồm b = 0, a = 0), `ghep-so-doi` (5000 tổng ngẫu nhiên có và không có cặp đối).

## Giả định (chủ dự án đang ngủ, không hỏi được)
- Nguồn là sách bài tập, trang đáp án tr.111. Số trong bài tự chọn nhỏ hơn số của sách (bé học chậm); các số lớn của bài 3.11 đến 3.14 và 3.17 không đưa vào.
- Chỉ mẹo nào đúng với mọi đầu vào mới viết, đã thử bằng chương trình tạm (không commit).
- Không dạy tính chất kết hợp, giao hoán bằng chữ a, b, c ở dạng công thức đại số; dùng số cụ thể.
- Mẹo `dau-truoc` nói chỉ dùng cho hai số khác dấu mà không đối nhau; phép trừ đổi thành phép cộng trước thì mới dùng (câu này nằm ở mẹo `ghep-so-doi`, sau phần trừ).
- Quy ước thang máy: mặt đất là tầng 0, tầng hầm ghi bằng số âm, nhắc lại ở mọi màn dùng nó.

## Lời đọc và video (02/10/2026)
- Giọng bài: `my-duyen` (Mỹ Duyên), khai trong `video/projects/phep-cong-phep-tru-so-nguyen/media.json`, không có cờ miễn. Lý do: Bài 13 đọc bằng Hải Đăng nên xen kẽ; bài dạy đi từng bước trên trục số, hợp giọng nhẹ nhàng.
- Lời đọc tổng quan: Gemini TTS giọng Vindemiatrix (không cần đọc lại bằng VieNeu), 56,4 giây, mọi câu match ≥ 98,6%.
- Ba video (giọng VieNeu Mỹ Duyên, 14 đến 15 câu, 60 đến 66 giây, mỗi video một ý, trục số dùng màu của bài, Whisper nghe "âm" đúng ở mọi số âm):
  - `di-tren-truc-so` (đầu phần 3 `cong-so-duong`): (−3) + 5 = 2 đi sang phải, 2 + (−5) = −3 đi sang trái; hai clip cho card `cong-so-duong` và `cong-so-am`.
  - `cong-khac-dau` (đầu phần 8 `khac-dau`): 7 + (−4) = 3 và 3 + (−8) = −5; lấy phần số tự nhiên lớn trừ phần nhỏ, tổng mang dấu của số có phần lớn hơn.
  - `tru-la-cong-so-doi` (đầu phần 9 `tru-so-duong`): 4 − 6 = 4 + (−6) = −2 và 1 − 4 = 1 + (−4) = −3.
- Review vòng 5 (Sonnet, chỉ phần đổi: ba khối video và lời đọc): 0 Nghiêm trọng, 2 Nên sửa, 1 Góp ý, cả ba đã sửa và dựng lại; Haiku đọc hiểu 44 câu kịch bản (39 hiểu rõ, còn lại là thuật ngữ nằm nguyên văn trong câu quy tắc). Đã `content:hash --approve`, `content:lock` (3 id video), `lesson:walk` 0 failures 0 cảnh báo, `content:emit` với bản nháp.
- Chưa làm: tải media lên bucket (`pnpm media:upload`) và deploy, cần chủ dự án đồng ý. Sửa chữ bài hay kịch bản sau này: theo mục "Sửa chữ bài sau này" ở trên; dựng lại video là `pnpm video:build phep-cong-phep-tru-so-nguyen <tên>` (câu đã đọc được giữ trong `audio/`, không xoá).

## Phần bài tập sách bài tập (03/10/2026)
- Section cuối (14) `bai-tap-sach-bai-tap` (`bookPractice`): đủ 19 câu sách SBT 3.8, 3.9, 3.10a, 3.10b, 3.11a, 3.11b, 3.12a, 3.12b, 3.13a, 3.13b, 3.14a, 3.14b, 3.15, 3.16, 3.17, 3.18a, 3.18b, 3.19a, 3.19b (đề chép nguyên văn tr.51-52, đáp án khớp tr.111; sách không in lời giải 3.8 và 3.11 đến 3.14 nên tự tính) và 26 câu dẫn (3.8: 2, 3.9: 2, 3.10a: 2, 3.10b: 1, 3.11a: 2, 3.11b: 1, 3.12a: 1, 3.12b: 1, 3.13a: 1, 3.13b: 1, 3.14a: 1, 3.14b: 2, 3.15: 2, 3.16: 1, 3.17: 2, 3.18a: 1, 3.18b: 1, 3.19a: 1, 3.19b: 1), 4 khối "Nhắc lại" (lặp nguyên văn quy tắc của các section đã có; recap lặp "Muốn trừ một số, ta cộng với số đối của số đó."), 50 màn, `minutes` 33.
- Dạng câu: 3.8, 3.9, 3.15 điền từ ngân hàng (3.15: 16 ô xếp theo từng cột của bảng; đề giữ bảng thành bốn dòng chữ ngăn bằng "|" như `on-tap-chuong-3`); 3.10 chọn đáp án; còn lại nhập số (có phím −).
- Hình mới `sbt-*` trong `catalog.ts` (22 hình: nấc 2 và nấc 3 của câu sách); các hình khác dùng lại của bài. Từ "Moscow" thêm vào `names` của `content/glossary/math.json`. `scripts/lesson-walk.ts`: kiểm "thanh dưới che điều khiển" chỉ báo khi điều khiển còn nằm sau thanh ở cuối trang, vì phần trả lời của 3.15 cao hơn màn điện thoại.
- Review: vòng 6 (Opus) 2 Nghiêm trọng (LL-23), 7 Nên sửa, 6 Góp ý; vòng 7 (Sonnet, chỉ phần đổi) 1 Nghiêm trọng (LL-02), 0, 3 Góp ý; đã sửa, duyệt lại, khoá 46 id, `lesson:walk` 0 failures. Chi tiết ở `review.md`.
- Việc còn lại: chủ dự án xác nhận các đáp án tự tính (3.8, 3.11 đến 3.14); câu quy tắc dùng lại ở khối "Nhắc lại" còn "Hiểu mơ hồ" (thuật ngữ); phần này chưa deploy (không có media mới, chỉ cần `pnpm deploy:prod --ref <SHA>` khi chủ dự án đồng ý).
