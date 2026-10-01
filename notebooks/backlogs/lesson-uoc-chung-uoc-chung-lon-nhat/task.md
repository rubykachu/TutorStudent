# Bàn giao: Bài 11 `uoc-chung-uoc-chung-lon-nhat` (Ước chung. Ước chung lớn nhất)

## Trạng thái
- Cập nhật cuối: 01/10/2026. Đang soạn (bản nháp, `status: draft`). Chưa review, chưa duyệt.
- Đã làm: nạp nguồn, đọc tài liệu và hai bài mẫu (Bài 8, Bài 9), chốt kế hoạch 12 section (mục "Cấu trúc bài").
- Việc kế tiếp: viết hình (`src/visuals/math/uoc-chung-uoc-chung-lon-nhat/`), `lesson.json`, chạy `content:check --stats`, `visual:shot`, `lesson:walk`, gate.

## Nguồn (sách bài tập, `sources/math/uoc-chung-uoc-chung-lon-nhat/`, không commit)
- Đề: tr.38–40 in (PDF 39–41), tệp `sbt-p38.png`, `sbt-p39.png`, `sbt-p40.png`. Bài 12 "Bội chung. Bội chung nhỏ nhất" bắt đầu ở tr.41.
- Lời giải: tr.107 (từ giữa trang, câu 2.33–2.40) và tr.108 (đầu trang, câu 2.41–2.43), tệp `sbt-p107.png`, `sbt-p108.png`.
- Nhập bằng `pnpm sources:import <pdf> --pages 38-40 (rồi 107-108) --subject math --series kntt --slug uoc-chung-uoc-chung-lon-nhat --book sbt --offset 1`.
- Chương II "Tính chia hết trong tập hợp các số tự nhiên"; bài in là "Bài 11. Ước chung. Ước chung lớn nhất" (`number: 11`, `order: 11`).
- Nội dung nguồn: ước chung (ƯC), ước chung lớn nhất (ƯCLN), tìm ƯCLN bằng phân tích ra thừa số nguyên tố (3 bước), tìm ƯC qua ƯCLN; kiến thức bổ sung (kí hiệu (a, b), a = dm, b = dn với (m, n) = 1); kĩ năng (xác định ƯC, ƯCLN của hai hay ba số; dùng tính chất chia hết; nhận biết phân số tối giản và rút gọn); ví dụ 1 (số lớn nhất để ba số có cùng số dư), ví dụ 2 (chia đội nhiều nhất); câu 2.33–2.43.

## Giả định (không hỏi được chủ dự án)
- Số trong bài tự chọn, không dùng số của sách; chỉ giữ dạng bài.
- Trẻ yếu nhân chia: mở bằng việc cắt dải băng thành các đoạn bằng nhau và xếp đồ vật đều vào các đĩa, mỗi bước một ý, số nhỏ.
- Chưa dạy kí hiệu tập hợp để trẻ phải gõ: các danh sách ước chỉ để đọc và chạm chọn (hồ sơ người học: chưa viết được { }).
- Không dạy kiến thức bổ sung (a, b), a = dm, b = dn và câu 2.41–2.43 (cần chữ cái m, n trẻ chưa gặp) và ví dụ 1 (số dư bằng nhau, cần hiệu chia hết, đoán là nâng cao); ghi ở đây để chủ dự án quyết định có bổ sung sau.
- Phân số tối giản và rút gọn (câu 2.40) có một section cuối bài; trẻ đã biết phân số từ tiểu học nhưng chương phân số của lớp 6 chưa tới, nên section chỉ dùng phân số có tử, mẫu nhỏ và dạy luật "tối giản" từ ƯCLN.
- Số hoàn hảo (câu 2.38) có một section ngắn (luyện liệt kê ước); không dùng 496.

## Phụ thuộc Bài 10 (`so-nguyen-to`, đang soạn song song, chưa xuất bản)
- Phương pháp phân tích ra thừa số nguyên tố cần "số nguyên tố" và "phân tích ra thừa số nguyên tố". Bài này dạy tối thiểu tại chỗ ở một section nhắc lại (`nhac-thua-so`), không liên kết id hay nội dung của Bài 10, hình `ladder` là của riêng bài này.
- Khi Bài 10 xuất bản, đối chiếu: định nghĩa số nguyên tố, cách viết phân tích, cách gọi "thừa số nguyên tố", màu khái niệm; có thể bỏ section `nhac-thua-so` nếu trùng. Bài này không thêm term "số nguyên tố" vào `content/glossary/math.json`.
