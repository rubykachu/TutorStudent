# Bàn giao: Bài 9 `dau-hieu-chia-het` (Dấu hiệu chia hết)

## Trạng thái
- Đang soạn (đêm 01/10/2026, thay cho buổi hỏi đáp đầu vào vì chủ dự án đang ngủ). `status: draft`; chưa review, chưa duyệt, chưa khoá id, chưa có lời đọc hay video.
- Lý do ưu tiên: lớp của bé đang học bài này.

## Nguồn (sách bài tập, `sources/math/dau-hieu-chia-het/`, không commit)
- Đề: tr.33–34 in (PDF 34–35), tệp `sbt-p33.png`, `sbt-p34.png`. Bài 10 "Số nguyên tố" bắt đầu ở tr.35.
- Lời giải: tr.105 (nửa dưới, câu 2.12–2.20) và tr.106 (đầu trang, câu 2.21–2.22), tệp `sbt-p105.png`, `sbt-p106.png`.
- Nhập bằng `pnpm sources:import <pdf> --pages 33-34 (rồi 105-106) --subject math --series kntt --slug dau-hieu-chia-het --book sbt --offset 1`.
- Chương II "Tính chia hết trong tập hợp các số tự nhiên"; bài in là "Bài 9. Dấu hiệu chia hết".
- Nội dung nguồn: dấu hiệu chia hết cho 2, 5, 9, 3; kĩ năng (tích có một thừa số chia hết cho m, tổng và hiệu); ví dụ 1 (thay chữ bằng chữ số, phép nhân với 9), ví dụ 2 (điểm trắc nghiệm chia hết cho 3); câu 2.12–2.22.

## Giả định (không hỏi được chủ dự án)
- Trẻ yếu nhân chia: mỗi dấu hiệu dạy từ dễ tới khó (chữ số tận cùng, cộng lần lượt các chữ số, rồi mới xét chia hết), ví dụ đời sống (bi, tờ tiền, hộp bánh, nhóm bạn, điểm bài thi).
- Dùng lại kí hiệu `\chiahet`, `\khongchiahet` và quy ước "a · b là a được lấy b lần" của Bài 8 và Bài 5.
- Số trong bài tự chọn, không dùng số của sách (câu 2.12–2.22 và hai ví dụ chỉ giữ dạng bài). Câu 2.21–2.22 (luỹ thừa của 10 cộng một số) làm với 10 mũ nhỏ (10⁴, 10⁵) để khỏi số 13 chữ số.
- Không nêu "số chẵn, số lẻ" (sách không dùng từ này).
- Lời đọc tổng quan và video để sau, theo yêu cầu của chủ dự án.

## Cấu trúc bài (14 section, 14 card, 79 bài tập, 75 hình)
1 `chia-het-2` (chữ số tận cùng, túi bi, bảng chữ số cuối, thử chữ số ô trống); 2 `chia-het-5` (tờ 5 nghìn đồng); 3 `chia-het-2-5` (chữ số tận cùng 0); 4 `tong-chu-so` (cộng lần lượt các chữ số, bước đệm cho 3 và 9); 5 `chia-het-9` (bảng chín); 6 `chia-het-3` (3 khác 9); 7 `cho-hai-so` (câu 2.12–2.14); 8 `tich-chia-het` (kĩ năng "tích có một thừa số chia hết"); 9 `tong-hieu` (câu 2.15–2.16, chỉ dùng cặp số mà ít nhất một số chia hết, vì tính chất của tổng, hiệu ở Bài 8 không nói về hai số đều không chia hết); 10 `luy-thua-10` (câu 2.21–2.22); 11 `tim-chu-so` (câu 2.19 và ví dụ 1); 12 `diem-thi` (ví dụ 2); 13 `but-vo` (câu 2.20); 14 `lap-so` (câu 2.18). Câu 2.17 là câu "nhóm ít nhất" ở `chia-het-2-5`.
Hình: `src/visuals/math/dau-hieu-chia-het/` (danh mục `catalog.ts`: mỗi hình một dòng dữ liệu; loại hình dùng chung `bags`, `rows`, `lines`, `chips` nay ở `src/visuals/shared/`).
Khái niệm mới trong `content/glossary/math.json`: "chữ số tận cùng" (teal), "tổng các chữ số" (amber), "dấu hiệu chia hết".

## Kiểm tra đã chạy (01/10/2026)
- `pnpm content:check --stats`: 0 lỗi, không cảnh báo `[guides]` của bài (còn cảnh báo "id chưa khoá", đúng vì bài draft); mọi dòng tiêu chí PASS (14 section, 14 card, 81 bài tập, 6 dạng, 20 hình tương tác).
- `pnpm visual:shot`: 150/150 đạt; đã xem ảnh điện thoại (mọi hình) và iPad (mẫu).
- `pnpm lesson:walk`: 0 lỗi, 0 cảnh báo; đã xem ảnh điện thoại và mẫu iPad dọc, ngang. Máy chủ của chủ dự án (cổng 3001) không nạp bài mới nên walk chạy trên bản sao `git worktree` ở cổng 3100 (đã xoá).
- Gate: format, lint, typecheck, test (1 812) đạt.

## Thay đổi ngoài nội dung bài
- Chuyển từ Bài 8 sang `src/visuals/shared/`: `formula-rows.tsx` (Row, FormulaRow, Rows, Lines), `bag-groups.tsx` (Bags, BagBox, DotBlock, packBags), `pick-chips.tsx` (Chips); Bài 8 import từ đó.
- Hình mới của bài: `digits`, `endDigits`, `digitSum`, `digitBox` (có validator `chia-het`), sticker huy chương.

## Để reviewer soi kĩ
- Mọi đáp án và nhiễu của câu chọn số (đã tính bằng chương trình khi dựng, nên tập trung vào lời đề): LL-01, LL-10.
- Section `tong-hieu` chỉ dùng cặp số mà ít nhất một số chia hết, vì Bài 8 không dạy trường hợp hai số đều không chia hết; kiểm không có câu nào rơi vào trường hợp đó.
- `luy-thua-10` không có tình huống đời sống tự nhiên (câu 2.21–2.22 thuần số); `nhan-9-ab`, `mua-vo-65`, `hop-banh-tui` có 3 phép tính nhẩm (độ khó 3, có hình lời giải): LL-18.
- Câu quy tắc của `chia-het-2/5/9/3`, `cho-hai-so`, `tich-chia-het` nêu hai chiều của dấu hiệu bằng hai câu; `cho-hai-so`, `tich-chia-het`, `diem-thi`, `but-vo`, `lap-so` là suy ra trực tiếp từ các dấu hiệu và tính chất của sách (LL-09).
- Chữ trong chip và công thức dùng U+202F cho số từ 4 chữ số; ở chip nhìn như liền nhau.
- Chưa làm: lời đọc tổng quan, video, review, khoá id.
