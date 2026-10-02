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
| [LL-08](LL-08-chep-sgk.md) | Chép câu, ví dụ, bài tập của sách | Khớp nguồn | Máy (khi có lớp chữ) + người | `[textbook-copy]`, `[book-ref]`; checklist trục 1 |
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
| [LL-20](LL-20-sua-review-lam-hong-cho-khac.md) | Bản sửa theo review làm hỏng chỗ khác | Quy trình | Người | checklist vòng chỉ phần đổi |
| [LL-21](LL-21-ky-hieu-hinh-doc-nham.md) | Ký hiệu, nhãn trong hình đọc nhầm thành phép toán | Visual | Người | `lesson-visual` tự xem ảnh; checklist trục 5 |
| [LL-22](LL-22-thieu-cong-cu-tren-man.md) | Câu bảo tra cứu mà màn không có thứ để tra | Bài tập | Người | checklist trục 5 "Người học chậm theo kịp" |
| [LL-23](LL-23-de-sach-lech-nguyen-van.md) | Đề sách ở bài ôn tập hay phần bài tập sách bài tập lệch nguyên văn | Khớp nguồn | Máy (cấu trúc phần) + người | `[book-practice]`; checklist trục 1 "Bài ôn tập" và "Phần bài tập sách bài tập" |
| [LL-24](LL-24-meo-sai-o-dang-bai-khac.md) | Mẹo sai ở số biên hay ở dạng bài khác trong cùng bài | Đúng kiến thức | Người | checklist trục 2 "Mẹo đúng với mọi đầu vào" |
| [LL-25](LL-25-chu-kho-hieu-voi-be.md) | Chữ đúng nhưng bé lớp 6 đọc không hiểu | Ngôn từ | Haiku đọc hiểu + tác giả viết lại | `lesson-review` mục "Đọc hiểu" |
| [LL-26](LL-26-goi-lua-chon-theo-vi-tri.md) | Lời giải thích gọi lựa chọn theo vị trí mà app xáo thứ tự | Đúng kiến thức | Người | checklist trục 2 "Giải thích đúng và giải thích được" |

## Số lần gặp

Đếm từ mọi vòng review tới 02/10/2026 của 20 bài (Toán: `tap-hop`, `phep-cong-phep-tru` bản nháp, `luy-thua`, `thu-tu-thuc-hien-phep-tinh`, `phep-nhan-phep-chia` (Nghiêm trọng vòng 1–2), `quan-he-chia-het-va-tinh-chat` (Nghiêm trọng vòng 1–3), `dau-hieu-chia-het` (Nghiêm trọng vòng 1–3), `uoc-chung-uoc-chung-lon-nhat` (Nghiêm trọng vòng 1–2), `so-nguyen-to` (Nghiêm trọng vòng 1–2 và, ở video, vòng 4), `on-tap-chuong-2` (Nghiêm trọng vòng 1–3), `boi-chung-boi-chung-nho-nhat` (Nghiêm trọng vòng 1–2), `cach-ghi-so-tu-nhien` (Nghiêm trọng vòng 1–2), `thu-tu-trong-tap-hop-cac-so-tu-nhien` (vòng 1), `tap-hop-cac-so-nguyen` (Nghiêm trọng vòng 1–2), `phep-cong-phep-tru-so-nguyen` (Nghiêm trọng vòng 1–3), `quy-tac-dau-ngoac` (Nghiêm trọng vòng 1–2), `phep-chia-het-uoc-va-boi-cua-mot-so-nguyen` (Nghiêm trọng vòng 1–2), `phep-nhan-so-nguyen` (Nghiêm trọng vòng 1–2), `on-tap-chuong-3` (vòng 1); Ngữ văn: `neu-cau-muon-co-mot-nguoi-ban`) và đợt review sản phẩm ngày 01/10/2026. Mỗi phát hiện tính một lần, ở vòng đầu tiên nó xuất hiện; một mục review gộp vài chỗ cùng kiểu vẫn tính là một. Vòng 1–7 của `luy-thua` không còn trong lịch sử git nên không đếm được.

| Id | Nghiêm trọng | Nên sửa | Góp ý | Tổng |
|---|---|---|---|---|
| LL-10 | 5 | 41 | 30 | 76 |
| LL-19 | 2 | 8 | 26 | 36 |
| LL-12 | 13 | 19 | 30 | 62 |
| LL-07 | 1 | 45 | 36 | 82 |
| LL-15 | 5 | 16 | 10 | 31 |
| LL-16 | 0 | 32 | 4 | 36 |
| LL-05 | 12 | 39 | 21 | 72 |
| LL-09 | 15 | 16 | 4 | 35 |
| LL-14 | 2 | 15 | 13 | 30 |
| LL-11 | 4 | 5 | 7 | 16 |
| LL-06 | 1 | 19 | 7 | 27 |
| LL-02 | 8 | 15 | 11 | 34 |
| LL-01 | 19 | 1 | 0 | 20 |
| LL-03 | 2 | 6 | 2 | 10 |
| LL-17 | 52 | 5 | 3 | 60 |
| LL-04 | 0 | 5 | 2 | 7 |
| LL-18 | 0 | 7 | 2 | 9 |
| LL-08 | 36 | 3 | 6 | 45 |
| LL-13 | 2 | 1 | 0 | 3 |
| LL-20 | 12 | 1 | 1 | 14 |
| LL-21 | 5 | 3 | 0 | 8 |
| LL-22 | 1 | 0 | 0 | 1 |
| LL-23 | 4 | 1 | 0 | 5 |
| LL-24 | 17 | 3 | 4 | 24 |
| LL-25 | 0 | 9 | 184 | 193 |
| LL-26 | 2 | 0 | 0 | 2 |

LL-17, LL-08 và LL-01 nhiều Nghiêm trọng nhất; LL-25, LL-07, LL-10, LL-12 gặp nhiều nhất.

## Lỗi Nghiêm trọng ở vòng 1 theo bài

Theo dõi xem kho này có làm giảm lỗi ở bài mới không. Thêm một dòng khi bài mới xong vòng 1.

| Bài | Môn | Nghiêm trọng vòng 1 | Vòng hết Nghiêm trọng | Số vòng tới 02/10/2026 |
|---|---|---|---|---|
| `neu-cau-muon-co-mot-nguoi-ban` | Ngữ văn | 3 | 5 | 14 |
| `tap-hop` | Toán | 3 | 3 (vòng 4 lại có 1, hết ở vòng 5) | 7 |
| `luy-thua` | Toán | không còn ghi nhận | không còn ghi nhận | 12 |
| `thu-tu-thuc-hien-phep-tinh` | Toán | 4 | 3 (video: vòng 4 có 2, vòng 5 có 1) | 5 |
| `phep-cong-phep-tru` | Toán | 3 | 4 (vòng 2 có 3, vòng 3 có 1) | 4 |
| `phep-nhan-phep-chia` | Toán | 4 | chưa (vòng 2 còn 3, vòng 3 còn 1) | 3 |
| `quan-he-chia-het-va-tinh-chat` | Toán | 8 | chưa (vòng 2 còn 3, vòng 3 còn 1) | 3 |
| `dau-hieu-chia-het` | Toán | 5 | chưa (vòng 2 còn 2, vòng 3 còn 1) | 3 |
| `uoc-chung-uoc-chung-lon-nhat` | Toán | 8 | 7 (vòng 2 còn 4; vòng 6, 6 phần bổ sung, có 1; vòng 7 hết) | 7 |
| `so-nguyen-to` | Toán | 9 | 3 (vòng 2 còn 4; video: vòng 4 có 1, sửa ngay) | 4 |
| `on-tap-chuong-2` | Toán | 8 | chưa (vòng 2 còn 7, vòng 3 còn 1) | 3 |
| `boi-chung-boi-chung-nho-nhat` | Toán | 8 | chưa (vòng 2 còn 5) | 2 |
| `cach-ghi-so-tu-nhien` | Toán | 13 | 3 (vòng 2 còn 8) | 3 |
| `thu-tu-trong-tap-hop-cac-so-tu-nhien` | Toán | 10 | 3 (vòng 2 còn 1) | 3 |
| `tap-hop-cac-so-nguyen` | Toán | 4 | 3 (vòng 2 còn 1) | 3 |
| `phep-cong-phep-tru-so-nguyen` | Toán | 8 | 4 (vòng 2 còn 4, vòng 3 còn 1; phần bài tập sách bài tập, vòng 6 có 2 và vòng 7 có 1, hết ở vòng 7) | 7 |
| `quy-tac-dau-ngoac` | Toán | 8 | 3 (vòng 2 còn 3; phần bài tập sách bài tập, vòng 5 có 1, hết ở vòng 6) | 6 |
| `phep-chia-het-uoc-va-boi-cua-mot-so-nguyen` | Toán | 11 | chưa (vòng 2 còn 6) | 2 |
| `phep-nhan-so-nguyen` | Toán | 5 | 3 (vòng 2 còn 1) | 4 |
| `on-tap-chuong-3` | Toán | 7 | chưa | 1 |
