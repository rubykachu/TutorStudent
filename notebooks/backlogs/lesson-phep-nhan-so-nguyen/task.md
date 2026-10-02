# Bàn giao: Bài 16 `phep-nhan-so-nguyen` (Phép nhân số nguyên)

## Trạng thái
- Cập nhật cuối: 02/10/2026 08:40. Bản nháp đã soạn xong: 12 phần, 12 thẻ, 63 câu, 6 dạng câu, 7 hình bấm (`jumpTry`, `factorTry`), 3 mẹo; `content:check --stats` 0 lỗi, `visual:shot` 94/94, `lesson:walk` 0 failures 0 cảnh báo. Review vòng 1 đang chạy. Không làm lời đọc và video trong đợt này.
- Việc kế tiếp: review (vòng 1–2 đầy đủ, Haiku đọc hiểu, vòng 3 trở đi chỉ phần đổi), `content:hash --approve`, `content:lock`.

## Nguồn (sách bài tập, `sources/math/phep-nhan-so-nguyen/`, không commit)
- Đề: tr.55–57 in (PDF 56–58), tệp `sbt-p55.png`, `sbt-p56.png`, `sbt-p57.png`. Bài 17 bắt đầu ở tr.58.
- Lời giải: tr.112–113 in (PDF 113–114), tệp `sbt-p112.png`, `sbt-p113.png`, mục "Bài 16" (3.28 đến 3.34). Sách không in đáp án bài 3.26, 3.27; đáp án hai bài này do người soạn tự tính.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 55-57 (rồi 112-113) --subject math --series kntt --slug phep-nhan-so-nguyen --book sbt --offset 1`.
- Chương III "Số nguyên"; `number: 16`, `order: 16`, `chapter` `{ numeral: "III", name: "Số nguyên" }`.
- Nội dung nguồn: kiến thức cần nhớ 1 (nhân hai số nguyên âm, khác dấu, nhân với 0), 2 (giao hoán, kết hợp, phân phối), 3 (tích nhiều thừa số: đổi chỗ, nhóm tuỳ ý), ví dụ 1 (tính hợp lí), ví dụ 2 (tích bốn số, giải thích bằng lập luận), ví dụ 3 (tích bằng 0), bài 3.26 đến 3.34.

## Giả định (chủ dự án không hỏi được, ghi theo yêu cầu)
- Slug `phep-nhan-so-nguyen`; nguồn là sách bài tập, đã nạp cả trang đề và trang lời giải.
- Cách viết phép nhân: `m · n` là m lấy n lần (như tiểu học và như Bài 5). Số âm nhân số dương dạy bằng cộng lặp lại trên trục số; số dương nhân số âm và hai số âm dạy bằng quy luật của dãy tích (thừa số thứ hai giảm 1 thì tích giảm hay tăng một lượng bằng thừa số thứ nhất).
- Số trong bài nhỏ hơn số của sách (bé học chậm). Ví dụ 2 và bài 3.34 (chứng minh bằng lập luận về dấu của tích nhiều số) không đưa vào dạng chứng minh; phần dấu của tích nhiều số dạy bằng cách nhân từ trái sang phải và mẹo đếm thừa số âm.
- Chỉ mẹo nào đúng với mọi đầu vào mới viết, đã thử bằng chương trình tạm (không commit).
- Màu khái niệm: số nguyên dương lime, số nguyên âm pink, số 0 slate, thừa số blue, tích amber (cùng glossary và Bài 13, 14). Nhãn bước làm và quy luật trong hình dùng violet, màu duy nhất bài không dùng cho khái niệm.

## Cấu trúc bài (12 phần, mỗi phần một ý, từ dễ đến khó)
1. `cong-lap` Số âm nhân số dương: cộng lặp lại trên trục số (nhiệt độ giảm đều, nợ thêm mỗi ngày).
2. `nhan-voi-0` Nhân với 0 (kiến thức 1).
3. `duong-nhan-am` Số dương nhân số âm: quy luật của dãy tích, thừa số thứ hai giảm 1 thì tích giảm một lượng bằng thừa số thứ nhất.
4. `khac-dau` Nhân hai số khác dấu (kiến thức 1; bài 3.26).
5. `am-nhan-am` Nhân hai số âm: quy luật tích tăng (kiến thức 1; bài 3.26).
6. `dau-cua-tich` Dấu của tích, cùng dấu và khác dấu (bài 3.27 đến 3.30); mẹo "Nhân với −1".
7. `giao-hoan-ket-hop` Đổi chỗ và nhóm các thừa số (kiến thức 2 và 3).
8. `nhieu-thua-so` Tích nhiều thừa số, nhân từ trái sang phải; mẹo "Dấu của tích nhiều số".
9. `phan-phoi` Nhân một số với một tổng (kiến thức 2).
10. `gop-thua-so` Đưa thừa số chung ra ngoài, tính hợp lí (ví dụ 1, bài 3.32); mẹo "Đưa thừa số chung ra ngoài".
11. `tich-bang-0` Tích bằng 0 và tìm x (ví dụ 3, bài 3.31).
12. `bai-toan-thuc-te` Bài toán đời sống (bài 3.33).
- Hình: `src/visuals/math/phep-nhan-so-nguyen/` (`catalog.ts`: mỗi hình một dòng dữ liệu; `jump-try.tsx`: bé bấm mũi tên đi từng bước cùng độ dài, báo `{ p0 }`, dùng validator `dat-diem` của Bài 13; `factor-try.tsx`: bé giảm thừa số thứ hai của một dãy tích từng bước, báo `{ n }`, validator `dat-thua-so` trong `logic.ts`). Bài 3.28 (so sánh hai tích) nằm ở phần 6; bài 3.29 và 3.30 (đoán dấu, nối tích) cũng ở phần 6; ví dụ 2 và bài 3.34 không đưa vào.
- Mẹo (3 khối `tip`, đã thử bằng chương trình trước khi viết): `nhan-voi-am-1` (−30 đến 30, gồm 0 và ±1), `dem-thua-so-am` (200 000 tích ngẫu nhiên 2 đến 6 thừa số trong −6..6, gồm 0, ±1), `gop-thua-so-chung` (a·b + a·c = a·(b+c), a, b trong −30..30, c gồm 0, ±1, ±30).
