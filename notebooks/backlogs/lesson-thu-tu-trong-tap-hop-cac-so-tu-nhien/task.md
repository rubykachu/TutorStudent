# Bàn giao: Bài 3 `thu-tu-trong-tap-hop-cac-so-tu-nhien` (Thứ tự trong tập hợp các số tự nhiên)

## Trạng thái
- Cập nhật cuối: 02/10/2026. Đang soạn (bản nháp, `status: draft`). Bước hiện tại: đã đọc nguồn và quy tắc, đang dựng hình và nội dung.
- Việc tiếp theo: dựng hình (`src/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/`), viết `lesson.json`, `content:check --stats`, `visual:shot`, `lesson:walk`, review vòng 1 và 2 (Opus), đọc hiểu (Haiku), `content:hash --approve`, `content:lock`.
- Không làm trong lượt này: lời đọc tổng quan và video.

## Nguồn (sách bài tập, `sources/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/`, không commit)
- Đề: tr.11–13 in (PDF 12–14), tệp `sbt-p11.png` … `sbt-p13.png`. Lời giải: tr.96 in (PDF 97), tệp `sbt-p96.png` (đầu trang là Bài 3, nửa sau là Bài 4).
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 11-13 (rồi 96-96) --subject math --series kntt --slug thu-tu-trong-tap-hop-cac-so-tu-nhien --book sbt --offset 1`. Ảnh trang đầu in "BÀI 3. THỨ TỰ TRONG TẬP HỢP CÁC SỐ TỰ NHIÊN", đúng tên bài.
- Chương I "Tập hợp các số tự nhiên"; `number: 3`, `order: 3`.
- Nội dung nguồn: kiến thức cần nhớ (tia số và điểm biểu diễn, số nhỏ hơn nằm bên trái, số liền trước và liền sau, tính chất bắc cầu), ví dụ (vẽ tia số với A, B; ba phần của tia số; tập hợp M các số có điểm biểu diễn thuộc đoạn AB), bài 1.22 – 1.28.

## Giả định (chủ dự án đang ngủ, không hỏi được)
- Slug suy từ tiêu đề in trên trang; bộ sách `kntt`, chương I.
- Trẻ yếu số học tiểu học: dựng từ dễ tới khó (thước kẻ và tia số, đọc điểm, so sánh bằng vị trí, dấu, số nhiều chữ số, biểu đồ cột, số liền trước và liền sau, bắc cầu, tập hợp các số trong một đoạn), ví dụ lấy từ thước kẻ, cột cây số, giá tiền, chiều cao, xếp hàng, số nhà.
- Số trong bài tự chọn, không lấy số của đề sách làm đề bài.
- Bài 1.28 (tập hợp P với phân số 1 phần x) bỏ: chương I chưa học phân số.
- Bài 1.26 (biểu đồ ca nhiễm Covid-19 thật) viết lại thành biểu đồ cột về việc quen thuộc với trẻ (số quyển sách thư viện cho mượn mỗi ngày), cùng ba câu hỏi (ngày có số cho trước, nhiều nhất và ít nhất, giảm dần).
- ℕ và ℕ* là kiến thức của Bài 2 (đang soạn song song) nhưng trang Bài 3 dùng chúng; section cuối nhắc lại hai kí hiệu ở chỗ dùng.
- So sánh số nhiều chữ số là kiến thức tiểu học cần cho bài 1.25: có section riêng, `sourceRef` ghi "Kiến thức nền (tiểu học)", glossary đánh dấu `prerequisite`.
