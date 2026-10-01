# Bàn giao: Bài 10 `so-nguyen-to` (Số nguyên tố)

## Trạng thái
- Cập nhật cuối: 01/10/2026. Đang soạn (`status: draft`). Chưa review, chưa duyệt.
- Bước đã xong: nạp nguồn. Bước kế tiếp: lập khung bài, hình, kiểm tra.

## Nguồn (sách bài tập, `sources/math/so-nguyen-to/`, không commit)
- Đề: tr.35–37 in (PDF 36–38), tệp `sbt-p35.png`, `sbt-p36.png`, `sbt-p37.png`. Bài 11 bắt đầu ở tr.38.
- Lời giải: tr.106 (câu 2.23–2.30) và tr.107 (câu 2.31–2.32, đầu trang), tệp `sbt-p106.png`, `sbt-p107.png`.
- Nhập bằng `pnpm sources:import <pdf> --pages 35-37 (rồi 106-107) --subject math --series kntt --slug so-nguyen-to --book sbt --offset 1`.
- Chương II "Tính chia hết trong tập hợp các số tự nhiên"; bài in là "Bài 10. Số nguyên tố".
- Nội dung nguồn: số nguyên tố, hợp số, phân tích ra thừa số nguyên tố (3 ý kiến thức cần nhớ); kĩ năng xét hợp số bằng dấu hiệu chia hết cho 2, 3, 5, 9 và phân tích bằng sơ đồ cột; ví dụ 1 (945), ví dụ 2 (2 017 là tổng hai số nguyên tố không); câu 2.23–2.32.

## Giả định (không hỏi được chủ dự án)
- Trẻ yếu nhân chia: dạy từ dễ tới khó, số nhỏ, ví dụ đời sống (xếp gạch, xếp kẹo, chia nhóm), hình gợi ý từng bước.
- Dùng lại kí hiệu `\chiahet`, `\khongchiahet`, quy ước "a · b là a được lấy b lần", quy tắc tìm ước của Bài 8, các dấu hiệu của Bài 9.
- Số trong bài tự chọn, không dùng số của sách. Số lớn (945, 2 017, 1 470…) thay bằng số nhỏ hơn 100 hay vài trăm; các câu cần tra bảng số nguyên tố lớn (829, 971) bỏ vì app chỉ có bảng nhỏ hơn 100.
- Bảng số nguyên tố nhỏ hơn 100 đưa vào bài (sách bài tập chỉ bảo "tra bảng" của sách giáo khoa; app không có sách giáo khoa). Hình dựng bảng bằng cách gạch bội của 2, 3, 5, 7.
- Không dạy "số chẵn, số lẻ" như thuật ngữ mới: dùng "chia hết cho 2" và "không chia hết cho 2" (câu 2.29 và ví dụ 2 của sách dùng tính chất "tổng hai số lẻ là số chẵn", dạy bằng ví dụ số).
- Câu 2.32 (Goldbach, Euler) chỉ lấy dạng "viết số thành tổng các số nguyên tố", không nhắc bài toán chưa có lời giải.
