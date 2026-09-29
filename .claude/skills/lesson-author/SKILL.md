---
name: lesson-author
description: Soạn một bài học từ ảnh SGK trong sources/<môn>/<bài>/ thành content/<môn>/<bộ sách>/<bài>/lesson.json và đưa tới xuất bản - đọc trang nguồn, biên soạn lại, chia phần, viết card và bài tập, gọi lesson-visual làm hình, lesson-review duyệt, rồi chạy thử bài trên trình duyệt. Dùng khi người dùng nói "soạn bài", "soạn bài mới", "nạp bài mới", "biên soạn bài từ SGK", "thêm bài học", hoặc sửa nội dung một bài đã có.
---

# Soạn bài học

Đầu ra: `content/<subject>/<series>/<slug>/lesson.json` qua `pnpm content:check`, đủ visual, `review.md` không còn lỗi Nghiêm trọng, `status: published`. Bài mẫu đã xuất bản: `content/math/kntt/luy-thua/`.

## Đọc trước

- Trường và kiểu: `src/schema/content.ts`. Không suy schema từ bài mẫu.
- Luật nội dung, id bất biến, cổng xuất bản: `docs/spec.md` mục "Mô hình nội dung". Dạng bài, gợi ý, ôn tập: các mục "Tám dạng bài tập", "Phản hồi 3 nấc khi sai", "Ôn tập theo yêu cầu".
- Màu khái niệm, cỡ chữ, vùng chạm: `docs/design-system.md`.
- Tiêu chí review: `.claude/skills/lesson-review/references/checklist.md`, nhất là "Luật gợi ý 3 nấc" và "Không bắt lỗi". Soạn theo đúng tiêu chí này ngay từ đầu.
- Bẫy đã gặp khi soạn: `references/pitfalls.md`.

## Quy trình

Sửa bài đã có: bỏ bước 1–4, sửa theo bước 5–9 và không đổi id đã khoá, rồi làm tiếp từ bước 10. Bài đã `published` phải review lại vì `reviewedHash` lệch.

1. **Đọc nguồn.** Mở mọi ảnh `sources/<subject>/<slug>/p<trang>.png` (hoặc `.jpg`; `p23-24.png` chứa hai trang). Ghi kiến thức, ví dụ, bài tập theo trang. Chỉ lấy phần thuộc bài này, bỏ phần của bài liền trước hay liền sau in chung trang.
2. **Ngữ văn: chép văn bản trước.** Chép văn bản đọc hiểu nguyên văn vào `source-passage.txt` cạnh `lesson.json`, rồi dừng chờ chủ dự án duyệt với ảnh. Chưa duyệt thì chưa soạn tiếp.
3. **Biên soạn lại.** Viết định nghĩa, ví dụ, bài tập bằng lời và số của mình, không chép câu hay hình SGK. Riêng khối `passage` giữ nguyên văn.
4. **Dựng khung.** Chép `templates/lesson.skeleton.json` vào thư mục bài, thay mọi `bai-moi` bằng slug, đặt `subject`, `series`, `order`, `title`, `sourceRef`. Sticker trỏ `fixture.visual.star-sticker` tới khi có sticker riêng.
5. **Khái niệm.** Tên và màu lấy theo `content/glossary/<subject>.json`; chưa có term thì thêm vào đó kèm `color`. Mỗi khái niệm giữ một màu ở mọi công thức, visual, highlight.
6. **Chia phần.** Mỗi section một ý chính, khoảng 8 phút, `sourceRef` trỏ đúng trang. Mỗi block là một màn hình: visual (có caption) → công thức hay quy tắc → ví dụ. Sau phần giải thích: 1–2 câu `checkIds` (không tính điểm nhớ) và khoảng 5 câu `practiceIds` (mở card).
7. **Card và bài tập.** Đạt số tối thiểu ở `docs/spec.md` mục "Tiêu chí thành công". Mỗi card chỉ có 1 câu trong `practiceIds`; các câu còn lại (khác dạng hoặc khác số) chỉ nằm trong `exercises`, làm kho cho phiên ôn. `openEnded` của Ngữ văn chia thành các bước nhỏ tự chấm, đặt trước bước viết.
8. **Chi tiết từng câu.**
   - Bài Toán: đặt `check.expr` cho mọi `numeric` và `choice`; lint tính lại đáp án và báo lỗi khi có lựa chọn nhiễu cũng ra giá trị đó.
   - `order.items` viết theo đúng thứ tự; không cần tự đảo vị trí đáp án vì app xáo lựa chọn, cột phải `match`, ngân hàng từ và mục `order` mỗi lần làm.
   - `hints` theo luật 3 nấc trong checklist review. Câu nào hình giúp hiểu rõ hơn thì đặt `hintVisualId`, `solutionVisualId`.
9. **Visual.** Dùng skill `lesson-visual` cho mọi `visualId` mới, kèm vai trò của từng hình (giải thích, tương tác, vùng chạm, gợi ý nấc 2, lời giải nấc 3) và bộ số của nó. Sticker riêng của bài cũng làm ở bước này; không xuất bản khi sticker còn trỏ `fixture.*`.
10. **Kiểm tự động.** `pnpm content:check --stats` tới khi bài 0 lỗi và đạt số tối thiểu trong spec. Cảnh báo "not in ids.lock.json" được phép tới bước 13.
11. **Chạy thử bài.** Bài `draft` không được phục vụ, nên đặt tạm `status: published` trên máy, chạy `pnpm dev`, tạo hồ sơ thử ở `/profiles`, mở `/lessons/<slug>`. `pnpm dev` chỉ xuất nội dung lúc khởi động (`content:emit`): bài vừa đổi `status` báo 404 thì chạy lại `pnpm dev`. Ở 820×1180 và 390×844, qua từng màn của mọi section; với mỗi câu, trả lời sai ba lần để xem đủ 3 nấc rồi trả lời đúng. Chụp ảnh và đọc từng ảnh: không tràn ngang, công thức không vỡ, gợi ý đúng luật. Xong, trả `status` về `draft`.
12. **Review.** Dùng skill `lesson-review` (skill tự mở subagent mới). Sửa mọi lỗi Nghiêm trọng và các mục Nên sửa hợp lý, rồi review lại. Lặp tới khi còn 0 Nghiêm trọng; skill review tự ghi `reviewedHash` và đặt `published`. Mục chưa sửa ghi vào `backlogs/lesson-<slug>.md`.
13. **Khoá id.** `pnpm content:lock` khi id đã ổn định (sau khi review đạt). Id đã khoá không được đổi hay xoá: tiến độ của trẻ gắn vào nó. Buộc phải đổi thì khai trong `retired` của `content/ids.lock.json`.
14. **Báo lại.** Gửi kết quả `--stats`, đường dẫn `review.md`, việc còn trong backlog.
