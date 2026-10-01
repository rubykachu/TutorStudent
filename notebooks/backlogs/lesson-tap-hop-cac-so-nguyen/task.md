# Bàn giao: Bài 13 `tap-hop-cac-so-nguyen` (Tập hợp các số nguyên)

## Trạng thái
- Cập nhật cuối: 02/10/2026. Đã duyệt và xuất bản: review vòng 1 (4 Nghiêm trọng), vòng 2 (1), vòng 3 chỉ phần đổi (0), `reviewedHash` ghi, `published`; id đã khoá (`content:lock`), `content:emit` chạy. 12 section (phần `sap-xep` và `liet-ke` tách ở vòng 2), 12 thẻ, 58 câu, 7 dạng câu, 14 hình tương tác. Đọc hiểu (Haiku): lượt 1 123/44/0, lượt 2 trên 50 mục viết lại 44/6/0, lượt 3 trên 6 mục 0/6/0 (còn ghi ở Nên sửa của `review.md`, không chặn).
- Việc còn lại: lời đọc và video (chưa làm, đợt này không làm); sửa 7 Nên sửa còn mở trong `review.md` nếu muốn; việc của app ở mục "Ngoài nội dung bài". Khi đã làm xong video và mọi việc còn lại, lưu trữ thư mục này theo `.claude/rules/agents.md`.

## Nguồn (sách bài tập, `sources/math/tap-hop-cac-so-nguyen/`, không commit)
- Đề: tr.47–49 in (PDF 48–50), tệp `sbt-p47.png`, `sbt-p48.png`, `sbt-p49.png`. Bài 14 bắt đầu ở tr.50.
- Lời giải: tr.111 in (PDF 112), tệp `sbt-p111.png`, mục "Bài 13" (3.1, 3.2, 3.3, 3.5, 3.6, 3.7; bài 3.4 là hình vẽ nên sách không in đáp án).
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 47-49 (rồi 111-111) --subject math --series kntt --slug tap-hop-cac-so-nguyen --book sbt --offset 1`.
- Chương III "Số nguyên"; bài in là "Bài 13. Tập hợp các số nguyên" (`number: 13`, `order: 13`, `chapter` `{ numeral: "III", name: "Số nguyên" }`). `order` 13 nằm sau `on-tap-chuong-2` (12.5).
- Nội dung nguồn: kiến thức cần nhớ 1 đến 7 (số nguyên dương và âm, tập hợp ℤ, trục số, điểm biểu diễn, so sánh, ≤ và ≥); ví dụ 1 (đổi nhiệt độ −10 °C và độ sâu −318 m sang lời, và ngược lại), ví dụ 2 (so sánh 0 và −100, 1 và −19, −387 và −378); bài 3.1 đến 3.7.

## Cấu trúc bài (12 phần, mỗi phần một ý, có hình; dễ đến khó)
1. `nhiet-do` Nhiệt độ dưới 0 (nhiệt kế; đọc "âm ba").
2. `so-am-doi-song` Số âm trong đời sống (tầng hầm, dưới mực nước biển, nợ tiền, số dư giảm; bài 3.1, 3.2).
3. `duong-am-khong` Số nguyên dương, số nguyên âm và số 0 (kiến thức cần nhớ 1).
4. `tap-hop-z` Tập hợp ℤ (kiến thức cần nhớ 2; nhắc ∈ chỉ để đọc).
5. `truc-so` Trục số: gốc O, sau gốc là số dương, trước gốc là số âm (kiến thức cần nhớ 3, 4); hình tương tác đặt điểm.
6. `diem-bieu-dien` Đọc điểm trên trục số (kiến thức cần nhớ 4; bài 3.3, 3.4); mẹo "Đọc điểm trên trục số".
7. `so-doi` Hai số đối nhau (con kiến, bài 3.5; mở rộng theo yêu cầu chủ dự án); mẹo "Tìm số đối".
8. `so-sanh-truc` So sánh bằng trục số (kiến thức cần nhớ 5).
9. `am-khong-duong` Số âm, số 0 và số dương (kiến thức cần nhớ 6; ví dụ 2a, 2b).
10. `hai-so-am` So sánh hai số âm (kiến thức cần nhớ 6; ví dụ 2c; bài 3.7); mẹo "So sánh hai số âm".
11. `sap-xep` Sắp xếp số nguyên (quy tắc trục số, mẹo "Xếp các số từ bé đến lớn"; thẻ `sap-xep`).
12. `liet-ke` Liệt kê số nguyên (kiến thức cần nhớ 7 về ≤ và ≥; bài 3.6; thẻ `liet-ke`).
- Màu khái niệm: số nguyên dương lime, số nguyên âm pink, số 0 slate, tập hợp số nguyên teal, điểm biểu diễn amber, số đối sky, số nhỏ hơn blue, số lớn hơn violet (cùng màu với glossary của Bài 3 cho hai khái niệm nhỏ hơn, lớn hơn). Glossary: thêm "số nguyên", "số nguyên dương", "số nguyên âm", "số dương", "số âm", "tập hợp số nguyên", "trục số", "số đối" và tên riêng ℤ.
- Hình: `src/visuals/math/tap-hop-cac-so-nguyen/` (`catalog.ts`: mỗi hình một dòng dữ liệu). Loại hình: `line` (trục số có lớp: gốc O, điểm, vùng âm và dương, mũi tên khoảng cách), `lineTry` (hình tương tác, bấm mũi tên đưa điểm sang trái hay phải một vạch, báo `{ p0, p1, … }`, validator `dat-diem`), `lineTap` (chạm điểm trên trục, vùng là tên chữ thường), `scale` (thước dọc: nhiệt kế, toà nhà, mực nước biển), `sticker`; dùng chung `rows`, `lines`, `chips` ở `src/visuals/shared/`. Primitive mới dùng cho cả chương III: `src/visuals/shared/number-line.tsx` và `number-line-geometry.ts` (trục số nguyên có mũi tên hai đầu), test `tests/visuals/number-line.test.tsx`; test của bài `tests/visuals/tap-hop-cac-so-nguyen.test.tsx`.

## Mẹo (4 khối `tip`, đã thử bằng chương trình trước khi viết)
Thử bằng `tips_test.py` (tạm, không commit): mọi đầu vào gồm số biên.
- S6 tránh sai "Đọc điểm trên trục số": đếm số bước từ O (n bước sang phải là n, sang trái là −n), không đếm vạch của O (đếm cả vạch O thì thừa 1); 9 điểm gồm ±1, ±9.
- S7 tránh sai "Tìm số đối": giữ nguyên số và đổi dấu; số 0 đổi dấu vẫn là 0; thử với −100, −12, −5, −1, 0, 1, 7, 12, 100 so với định nghĩa cách đều gốc.
- S10 tránh sai "So sánh hai số âm": số âm có phần số càng lớn thì càng nhỏ; thử đủ 2450 cặp số âm từ −50 đến −1, gồm −1.
- S11 làm nhanh "Xếp các số từ bé đến lớn": chia ba nhóm (âm, 0, dương), nhóm âm xếp phần số lớn nhất trước; thử 2000 tập ngẫu nhiên 2 đến 7 số khác nhau trong −20..20, có 0 và có chỉ một dấu.

## Giả định (chủ dự án đang ngủ, không hỏi được)
- Số đối: chủ dự án yêu cầu dạy "số đối" trong bài này, dù sách bài tập đặt định nghĩa ở Bài 14 (lời giải 3.9). Phần `so-doi` dựa trên kiến thức cần nhớ 4 (điểm n và điểm −n cách đều gốc O, nằm hai phía) và ghi rõ ở `sourceRef`. Không dạy phép tính với số đối, không dạy kí hiệu −(−5).
- Ô nhập số (`numeric`) của app chưa có phím dấu trừ (`src/exercises/number-pad.tsx`), nên mọi đáp án âm dùng chọn đáp án, điền từ có ngân hàng, xếp thứ tự, nối hoặc hình tương tác; `numeric` chỉ dùng cho đáp án không âm (đếm số, khoảng cách). Đề xuất cho app các bài sau của chương: thêm phím "−".
- Số âm trong chữ viết bằng dấu trừ "−" (U+2212); trong công thức dùng `-`. Đọc là "âm ba", không đọc "trừ ba" (chữ "trừ" là phép tính, đọc số âm bằng "trừ" dễ nhầm với trừ).
- Hồ sơ người học: chưa viết được kí hiệu tập hợp ({ }, ∈, ∉). Bài chỉ nhắc đọc ∈ (một khối công thức ở phần 4); mọi câu viết kí hiệu là chọn đáp án.
- Số trong bài tự chọn, không lấy số của đề sách làm đề bài tự làm. Bài 3.5 (con kiến đi 16 đơn vị) dùng 4 vạch để vừa trục số trên điện thoại; bài 3.6 dùng khoảng −12 đến 12 với chữ số tận cùng 2, phần liệt kê các số nguyên trong khoảng chia thành hai thẻ.
- Không làm: bài 3.4 gốc có ±6 (trục số trong bài chỉ từ −5 đến 5 để số còn đọc được ở cỡ chữ 16px; câu `dat-ba-diem` thay thế); ví dụ 1a, 1b gốc (Canberra, kỉ lục môn lặn) dùng số khác trong phần 1 và 2.
- "Độ C" trong chữ, "°C" chỉ ở nhãn hình.

## Để reviewer soi kĩ
- Phần `so-doi` không có trong bài này của sách (xem Giả định); soi định nghĩa và mẹo.
- Câu `choice` có nhiều đáp án và số âm (`chon-nhieu-nho-hon-am-1`, `chon-x-giua-3-0`, `chon-x-tan-cung-2`): đề có hai cách hiểu không (LL-10), đặc biệt "chữ số tận cùng của số âm" và "x thỏa mãn" (đã có ghi chú trong đề).
- Các câu so sánh dùng `check` loại `holds`, `fails`, `max`, `min` (máy đã tính lại mọi lựa chọn).
- Hình `scale` (nhiệt kế, toà nhà): số tầng đếm từ mặt đất (0), không dùng cách gọi tầng 1 của nhà Việt Nam.
- Ranh giới giữa lời đọc "âm ba" và dấu − ở cả đề lẫn hình.

## Ngoài nội dung bài
- `src/visuals/registry.ts`: thêm khối `integerEntries` và dòng `EXAMPLE_MODULES` của bài (chỉ phần của bài); `tests/visuals/registry.test.tsx` không đổi (validator `dat-diem` dùng chung mẫu với Bài 3).
- `content/glossary/math.json`: thêm 8 thuật ngữ và tên riêng ℤ (đã stage riêng các hunk này).
- Việc của app (đã làm, không thuộc phạm vi bài): (1) `NumberPad` có phím "−" cho `numeric` khi `allowNegative: true` (đáp án âm bắt buộc có cờ này, `content:check` báo lỗi nếu thiếu); (2) `comparisonValue` đọc đúng `\le`, `\ge`, `\leq`, `\geq`, `≤`, `≥`; (3) trục số dùng chung có tuỳ chọn `arrows: "positive"` (mũi tên chỉ ở đầu dương). Bài này không cần đổi nội dung.
