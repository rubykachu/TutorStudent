# Rút kinh nghiệm soạn bài

Kho lỗi nội dung đã gặp nhiều lần khi soạn và review bài học, để lỗi cũ không quay lại ở bài sau. Thư mục tên `lessons-learned` (không phải `lessons`) để khỏi lẫn với nội dung bài học trong `content/`.

Mỗi mục là một tệp `<id>-<slug>.md` gồm: Triệu chứng, Ví dụ thật (bài, id câu hay section, vòng review phát hiện), Nguyên nhân gốc, Cách phòng (luật `content:check`, bước kiểm của `lesson:walk`/`video:check`, hay dòng checklist của skill), Trạng thái.

## Cách dùng

- `lesson-author` và `lesson-review` đọc tệp này trước khi làm việc.
- Reviewer gặp lỗi Nghiêm trọng thuộc một mục đã có: tăng số đếm ở bảng dưới và thêm ví dụ vào tệp mục. Lỗi Nghiêm trọng kiểu mới: thêm mục mới (id kế tiếp) và dòng trong hai bảng.
- Cuối mỗi bài, tác giả soát lại: lỗi lặp ở từ 2 bài trở lên mà kiểm được bằng máy thì đề xuất luật `content:check` (thêm ở `src/content/lint/`, lời báo trỏ tới id mục) và ghi luật vào cột "Nơi chặn".
- Skill chỉ trỏ tới id mục, không chép lại nội dung mục.

## Mục lục

| Id | Lỗi | Nhóm | Cách phòng | Nơi chặn |
|---|---|---|---|---|
| [LL-01](LL-01-hai-dap-an-dung.md) | Hai đáp án đúng, nhiễu cũng đúng | Đúng kiến thức | Máy + người | `[check-expr]`; checklist trục 2 |
| [LL-02](LL-02-goi-y-lo-dap-an.md) | Gợi ý lộ đáp án hoặc không chỉ đúng chỗ | Gợi ý | Máy (nấc 1) + người | `[hint-answer]`; checklist "Luật gợi ý 3 nấc" |
| [LL-03](LL-03-mau-khai-niem-lo-dap-an.md) | Màu khái niệm lộ đáp án | Gợi ý | Máy (`choice`) + người | `[color-leak]`; `pitfalls.md` Màu khái niệm |
| [LL-04](LL-04-thao-tac-chua-day.md) | Dùng thao tác trả lời trước khi dạy | Sư phạm | Máy | `[guides]` |
| [LL-05](LL-05-quy-tac-nhieu-cach-noi.md) | Một quy tắc nói nhiều cách | Nhất quán | Máy + người | `[rule-sentence]`, `video:check`; checklist trục 4 |
| [LL-06](LL-06-recap-thieu-y-hoac-dai.md) | Recap thiếu ý, trừu tượng, dài | Nhất quán | Máy (độ dài) + người | `[recap]`; checklist trục 5 |
| [LL-07](LL-07-lap-so-giua-luyen-tap-va-on.md) | Câu ôn lặp số của câu luyện, ví dụ, hình | Bài tập | Máy (đề) + người | `[review-bank]`; checklist vòng chỉ phần đổi |
| [LL-08](LL-08-chep-sgk.md) | Chép câu, ví dụ, bài tập của sách | Khớp nguồn | Máy (khi có lớp chữ) + người | `[textbook-copy]`; checklist trục 1 |
| [LL-09](LL-09-ngoai-pham-vi.md) | Kiến thức ngoài nguồn hoặc chưa dạy | Khớp nguồn | Người | checklist trục 1 |
| [LL-10](LL-10-de-mo-ho.md) | Đề mơ hồ, hai cách hiểu | Ngôn từ | Người | checklist trục 3 |
| [LL-11](LL-11-video-lech-bai.md) | Video lệch kịch bản, phụ đề, bài | Video | Máy + người | `video:build`, `video:check`; checklist trục 2 |
| [LL-12](LL-12-chu-chong-bi-cat.md) | Chữ chồng, bị cắt, bị che | Màn hình | Máy + người | `lesson:walk`; checklist trục 5 |
| [LL-13](LL-13-man-mot-khoi.md) | Màn chỉ có một khối | Màn hình | Máy | `[screens]`, `[recap]` |
| [LL-14](LL-14-nhieu-yeu.md) | Nhiễu yếu, loại được bằng mẹo | Bài tập | Người | checklist trục 3 |
| [LL-15](LL-15-hinh-lech-chu.md) | Hình gợi ý, lời giải, recap lệch chữ | Visual | Người | `lesson-visual` tự xem ảnh; checklist trục 5 |
| [LL-16](LL-16-thieu-vi-du-mau.md) | Thiếu ví dụ mẫu, cùng làm, đời sống | Sư phạm | Người (máy đếm màn) | `--stats`; `lesson-author` Sư phạm |
| [LL-17](LL-17-sai-kien-thuc.md) | Sai kiến thức | Đúng kiến thức | Người (máy phần số) | `[check-expr]`; checklist trục 2 |
| [LL-18](LL-18-cau-qua-dai.md) | Câu luyện quá nhiều phép tính | Sư phạm | Người | `lesson-author` luật "Số nhỏ" |
| [LL-19](LL-19-ngon-tu.md) | Xưng hô, câu dài, từ khó | Ngôn từ | Máy một phần + người | `[vietnamese]`, `[length]`, `[overview]`; checklist trục 3 |

## Số lần gặp

Đếm từ mọi vòng review tới 01/10/2026 của 7 bài (Toán: `tap-hop`, `phep-cong-phep-tru` bản nháp, `luy-thua`, `thu-tu-thuc-hien-phep-tinh`, `phep-nhan-phep-chia` (Nghiêm trọng vòng 1–2), `quan-he-chia-het-va-tinh-chat` (Nghiêm trọng vòng 1–3); Ngữ văn: `neu-cau-muon-co-mot-nguoi-ban`) và đợt review sản phẩm cùng ngày. Mỗi phát hiện tính một lần, ở vòng đầu tiên nó xuất hiện; một mục review gộp vài chỗ cùng kiểu vẫn tính là một. Vòng 1–7 của `luy-thua` không còn trong lịch sử git nên không đếm được.

| Id | Nghiêm trọng | Nên sửa | Góp ý | Tổng |
|---|---|---|---|---|
| LL-10 | 1 | 17 | 16 | 34 |
| LL-19 | 1 | 8 | 24 | 33 |
| LL-12 | 1 | 11 | 21 | 33 |
| LL-07 | 1 | 17 | 16 | 34 |
| LL-15 | 1 | 11 | 6 | 18 |
| LL-16 | 0 | 16 | 2 | 18 |
| LL-05 | 5 | 9 | 6 | 20 |
| LL-09 | 6 | 9 | 3 | 18 |
| LL-14 | 1 | 8 | 7 | 16 |
| LL-11 | 4 | 4 | 7 | 15 |
| LL-06 | 0 | 11 | 2 | 13 |
| LL-02 | 3 | 4 | 5 | 12 |
| LL-01 | 10 | 1 | 0 | 11 |
| LL-03 | 2 | 6 | 2 | 10 |
| LL-17 | 9 | 3 | 3 | 15 |
| LL-04 | 0 | 5 | 2 | 7 |
| LL-18 | 0 | 3 | 1 | 4 |
| LL-08 | 4 | 0 | 1 | 5 |
| LL-13 | 0 | 1 | 0 | 1 |

LL-01 ít lần nhưng nhiều Nghiêm trọng nhất, kế đến LL-17; LL-10, LL-19, LL-07, LL-12 gặp nhiều nhất.

## Lỗi Nghiêm trọng ở vòng 1 theo bài

Theo dõi xem kho này có làm giảm lỗi ở bài mới không. Thêm một dòng khi bài mới xong vòng 1.

| Bài | Môn | Nghiêm trọng vòng 1 | Vòng hết Nghiêm trọng | Số vòng tới 30/09/2026 |
|---|---|---|---|---|
| `neu-cau-muon-co-mot-nguoi-ban` | Ngữ văn | 3 | 5 | 14 |
| `tap-hop` | Toán | 3 | 3 (vòng 4 lại có 1, hết ở vòng 5) | 7 |
| `luy-thua` | Toán | không còn ghi nhận | không còn ghi nhận | 12 |
| `thu-tu-thuc-hien-phep-tinh` | Toán | 4 | 3 (video: vòng 4 có 2, vòng 5 có 1) | 5 |
| `phep-cong-phep-tru` | Toán | 3 | 4 (vòng 2 có 3, vòng 3 có 1) | 4 |
| `phep-nhan-phep-chia` | Toán | 4 | chưa (vòng 2 còn 3, vòng 3 còn 1) | 3 |
| `quan-he-chia-het-va-tinh-chat` | Toán | 8 | chưa (vòng 2 còn 3, vòng 3 còn 1) | 3 |
