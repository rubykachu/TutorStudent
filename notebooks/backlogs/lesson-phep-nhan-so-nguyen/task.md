# Bàn giao: Bài 16 `phep-nhan-so-nguyen` (Phép nhân số nguyên)

## Trạng thái
- Cập nhật cuối: 02/10/2026 08:20. Đang soạn (bản nháp, chưa review). Không làm lời đọc và video trong đợt này.
- Việc kế tiếp: dựng `lesson.json`, hình (`src/visuals/math/phep-nhan-so-nguyen/`), `content:check --stats`, `visual:shot`, `lesson:walk`, rồi review (vòng 1–2 đầy đủ, Haiku đọc hiểu, vòng 3 trở đi chỉ phần đổi), `content:hash --approve`, `content:lock`.

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
