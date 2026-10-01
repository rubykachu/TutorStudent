# Bàn giao: Bài 3 `thu-tu-trong-tap-hop-cac-so-tu-nhien` (Thứ tự trong tập hợp các số tự nhiên)

## Trạng thái
- Cập nhật cuối: 02/10/2026. Đang soạn (bản nháp, `status: draft`). Bước hiện tại: `lesson.json` đã qua `content:check --stats` (0 lỗi), đang sửa hình sau `visual:shot`.
- Việc tiếp theo: `visual:shot` sạch, `lesson:walk` 0 FAIL, review vòng 1 và 2 (Opus), đọc hiểu (Haiku), `content:hash --approve`, `content:lock`.
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

## Cấu trúc bài (11 section, 17 card, 78 câu)
1 `tia-so` (tia số, điểm biểu diễn, mẹo đếm từ gốc O); 2 `chon-don-vi` (vạch cách nhau 5, cột cây số, bài 1.23 và 1.24); 3 `ben-trai` (số nhỏ hơn nằm bên trái, bài 1.22, màn hướng dẫn xếp thứ tự); 4 `dau-nho-lon` (dấu < và >, mẹo đầu nhọn); 5 `dau-bang` (dấu ≤ và ≥); 6 `so-nhieu-chu-so` (kiến thức nền tiểu học, bài 1.25, mẹo so từ trái sang phải); 7 `bieu-do-cot` (bài 1.26); 8 `lien-tiep` (số liền trước và liền sau, mẹo số tận cùng 9); 9 `bac-cau`; 10 `phan-tia-so` (ví dụ b: đoạn OA, AB, phần còn lại); 11 `tap-hop-so` (ví dụ c và bài 1.27, nhắc lại ℕ và ℕ*, mẹo đếm phần tử từ a đến b).
- Màu khái niệm: điểm biểu diễn amber, số nhỏ hơn blue, số lớn hơn violet, số liền trước sky, số liền sau pink, tập hợp teal, dấu hiệu đặc trưng lime, so sánh số nhiều chữ số slate (glossary có thêm các thuật ngữ này; "so sánh số có nhiều chữ số" có `prerequisite` tiểu học; tên riêng `AB`, `OA`).
- Hình: `src/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/` (danh mục `catalog.ts`, mỗi hình một dòng dữ liệu). Loại hình: `line` (tia số theo lớp), `lineTry` (hình tương tác: bấm − / + dời điểm A, B; báo `{ p0, p1 }`, validator `dat-diem`), `lineTap` (chạm điểm), `bars` (biểu đồ cột, chạm cột), `signs` (hai số với dấu), `digits` (so từng chữ số), `sticker`; dùng chung `rows`, `lines`, `chips`. Màn hướng dẫn xếp thứ tự dùng lại hình `phep-cong-phep-tru.visual.huong-dan-xep`.
- Tia số không cho chạm từng vạch (vạch quá hẹp trên điện thoại, vùng chạm phải ≥ 48px), nên điểm được dời bằng nút − / +; bài chạm chỉ chạm các điểm tên (A, B, C) đặt cách nhau ≥ 3 vạch.

## Mẹo (5 khối `tip`, đã thử bằng chương trình trước khi viết)
- S1 tránh sai "Đếm từ gốc O": đếm các bước giữa hai vạch, không đếm vạch gốc (số ứng với một điểm là số bước từ O).
- S4 hiểu nhanh "Đọc dấu < và >": đầu nhọn chỉ về số bé hơn (đúng với mọi cặp số khác nhau; hình `signs` vẽ đúng chiều này).
- S6 tránh sai "So hai số cùng số chữ số": so từ chữ số bên trái nhất, cặp khác nhau đầu tiên quyết định. Thử 891 198 cặp số 4 chữ số, 0 sai.
- S8 tránh sai "Số liền sau của số tận cùng 9": 9 thành 0 và nhớ 1 sang trái, lặp lại nếu bên trái lại là 9. Thử 20 000 số tận cùng 9 (9, 19, 99, 109, 999, 1 999, 8 999 ...), 0 sai.
- S11 làm nhanh "Đếm phần tử từ a đến b": b − a + 1 với a ≤ b (a = b cho 1; a = 0 cho b + 1). Không mâu thuẫn với câu nào của bài (3..7 là 5, 6..9 là 4, x ≤ 6 trong ℕ là 7, x < 5 trong ℕ* là 4).

## Giả định bổ sung (không hỏi được chủ dự án)
- Ví dụ c ở sách ("mô tả tập hợp M các số có điểm biểu diễn thuộc đoạn AB") và bài 1.27 có chữ "chẵn": bài này chưa dạy "số chẵn" nên dùng điều kiện x < 5, x ≤ 6 cho phép so sánh ℕ với ℕ* (giữ ý chính của bài 1.27: số 0).
- Đoạn AB tính cả hai đầu (theo lời giải ví dụ c của sách); mọi câu hỏi "thuộc đoạn nào" chỉ hỏi số ở giữa, câu có đầu mút (số 4 và số 9) dạy rõ ở `chon-nhieu-doan-ab-dau`.
- Chữ `T2`..`CN` trong nhãn biểu đồ cột có giải thích ở màn đầu của section.
