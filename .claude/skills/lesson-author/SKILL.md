---
name: lesson-author
description: Soạn một bài học từ ảnh SGK trong sources/<môn>/<bài>/ thành content/<môn>/<bộ sách>/<bài>/lesson.json và đưa tới xuất bản - đọc trang nguồn, biên soạn lại, chia phần, viết card và bài tập, gọi lesson-visual làm hình, lesson-review duyệt, rồi chạy thử bài trên trình duyệt. Dùng khi người dùng nói "soạn bài", "soạn bài mới", "nạp bài mới", "biên soạn bài từ SGK", "thêm bài học", hoặc sửa nội dung một bài đã có.
---

# Soạn bài học

Đầu ra: `content/<subject>/<series>/<slug>/lesson.json` chạy `pnpm content:check` không lỗi, đủ visual, `review.md` không còn lỗi Nghiêm trọng, `status: published`. Bài mẫu đã xuất bản: `content/math/kntt/luy-thua/`.

## Đọc trước

- Trường và kiểu: `src/schema/content.ts`. Không suy schema từ bài mẫu.
- Luật nội dung, id bất biến, cổng xuất bản: `docs/spec.md` mục "Mô hình nội dung". Dạng bài, gợi ý, ôn tập: các mục "Tám dạng bài tập", "Phản hồi 3 nấc khi sai", "Ôn tập theo yêu cầu".
- Màu khái niệm, cỡ chữ, vùng chạm: `docs/design-system.md`.
- Tiêu chí review: `.claude/skills/lesson-review/references/checklist.md`, nhất là "Luật gợi ý 3 nấc" và "Không bắt lỗi". Soạn theo đúng tiêu chí này ngay từ đầu.
- Bẫy đã gặp khi soạn: `references/pitfalls.md`.

## Sư phạm cho người học chậm

Bài viết cho trẻ lớp 6 học chậm, hay quên. Mọi bài theo các luật sau.

- **Mẫu → cùng làm → tự làm.** Mỗi ý: một màn ví dụ mẫu giải trọn, rồi một màn trẻ thao tác có hướng dẫn (visual tương tác), rồi mới tới câu kiểm tra và luyện tập.
- **Quy tắc là câu để nhớ, không phải chú thích.** Định nghĩa, quy tắc, quy ước viết thành 1–2 câu trong `note` của một `group`, cùng ví dụ có nhãn (`formula` hay `visual`) ngay dưới. Câu bài học luôn nằm trong JSON để lint và review đọc được; visual không chứa câu bài học, chỉ nhãn ngắn. `caption` xám chỉ dùng cho hướng dẫn thao tác hay nhận xét ngắn.
- **Số nhỏ.** Câu luyện tập và ôn tính nhẩm được trong tối đa 2 phép tính (3³ = 27 được, 3⁴ = 81 thì không). Ví dụ mẫu được dài hơn khi có hình từng bước.
- **Dạy thao tác nhập trước lần dùng đầu.** Cách nhập mới (phím "mũ", kéo thả, chạm vùng) có một màn hướng dẫn tĩnh ngay trước phần bài tập đầu tiên dùng nó, dùng số khác với câu bài tập đó.
- **Câu chuyện mở đầu phải có kết** trong cùng section, bằng kiến thức vừa học.
- **`minutes` tính từ số màn**: khoảng 40 giây mỗi màn (block, câu hỏi, recap), làm tròn phút.
- **Recap = một câu + một ví dụ có nhãn**: một `visual` vẽ ví dụ có nhãn (ký hiệu ● Cơ số ▲ Số mũ hay tương đương), câu cần nhớ đặt ở `caption` của nó (màn recap hiện caption thành chữ thân bài phía trên hình). Không để công thức trần.
- **Recap ≤ 2 câu, card ≥ 3 câu hỏi.** `caption` của mọi `Section.recap`/`Card.recap` tối đa 2 câu và mỗi card có ít nhất 3 exercise trong `cardIds`; `content:check` báo lỗi khi thiếu.
- **Luyện tập và kho ôn khác số.** Mỗi card có ít nhất một câu ngoài `practiceIds`, khác số với câu luyện tập và với ví dụ trên màn quy tắc, để phiên ôn không hỏi lại đúng câu vừa làm.

## Quy trình

Sửa bài đã có: bỏ bước 1–4, sửa theo bước 5–9, rồi làm tiếp từ bước 10. Bài đã `published` phải review lại vì `reviewedHash` lệch.

1. **Đọc nguồn.** Mở mọi ảnh `sources/<subject>/<slug>/p<trang>.png` (hoặc `.jpg`; `p23-24.png` chứa hai trang). Ghi kiến thức, ví dụ, bài tập theo trang. Chỉ lấy phần thuộc bài này, bỏ phần của bài liền trước hay liền sau in chung trang.
2. **Ngữ văn: chép văn bản trước.** Chép văn bản đọc hiểu nguyên văn vào `source-passage.txt` cạnh `lesson.json`, rồi dừng chờ chủ dự án duyệt với ảnh. Chưa duyệt thì chưa soạn tiếp.
3. **Biên soạn lại.** Viết định nghĩa, ví dụ, bài tập bằng lời và số của mình, không chép câu hay hình SGK. Riêng khối `passage` giữ nguyên văn.
4. **Dựng khung.** Chép `templates/lesson.skeleton.json` vào thư mục bài, thay mọi `bai-moi` bằng slug, đặt `subject`, `series`, `order`, `title`, `sourceRef`. Sticker trỏ `fixture.visual.star-sticker` tới khi có sticker riêng.
5. **Khái niệm.** Tên và màu lấy theo `content/glossary/<subject>.json`; chưa có term thì thêm vào đó kèm `color`. Mỗi khái niệm giữ một màu ở mọi công thức, visual, highlight.
6. **Chia phần.** Mỗi section một ý chính, `sourceRef` trỏ đúng trang. Mỗi phần tử của `blocks` là đúng một màn hình, nên không có màn chỉ một `note` hay một `formula`: màn quy tắc là một `group` gồm `note` (câu quy tắc) rồi `formula`/`visual` (ví dụ có nhãn), xem các `group` trong `content/math/kntt/luy-thua/lesson.json`. Sau phần giải thích: 1–2 câu `checkIds` (không tính điểm nhớ) và khoảng 5 câu `practiceIds` (mỗi câu là lần gặp đầu của một card).
7. **Card và bài tập.** Đạt số tối thiểu ở `docs/spec.md` mục "Tiêu chí thành công". Mỗi card chỉ có 1 câu trong `practiceIds`; các câu ôn còn lại chỉ nằm trong `exercises` (xem luật "Luyện tập và kho ôn khác số"). `openEnded` của Ngữ văn chia thành các bước nhỏ tự chấm, đặt trước bước viết.
8. **Chi tiết từng câu.**
   - Bài Toán: đặt `check.expr` cho mọi `numeric` và `choice`; lint tính lại đáp án và báo lỗi khi có lựa chọn nhiễu cũng ra giá trị đó.
   - `order.items` viết theo đúng thứ tự; không cần tự đảo vị trí đáp án vì app xáo lựa chọn, cột phải `match`, ngân hàng từ và mục `order` mỗi lần làm.
   - `hints` theo luật 3 nấc trong checklist review. Câu nào hình giúp hiểu rõ hơn thì đặt `hintVisualId`, `solutionVisualId`.
9. **Visual.** Dùng skill `lesson-visual` cho mọi `visualId` mới, kèm vai trò của từng hình (giải thích, tương tác, vùng chạm, gợi ý nấc 2, lời giải nấc 3) và bộ số của nó. Sticker riêng của bài cũng làm ở bước này; không xuất bản khi sticker còn trỏ `fixture.*`.
10. **Kiểm tự động.** `pnpm content:check --stats` tới khi bài 0 lỗi và đạt số tối thiểu trong spec. Cảnh báo "not in ids.lock.json" được phép tới bước 13.
11. **Chạy thử bài.** `pnpm lesson:walk <slug>` đi hết mọi section ở 820×1180, 390×844 và 1180×820, trả lời đúng mọi câu theo `lesson.json`, câu đầu của mỗi dạng thì sai đủ 3 nấc, chụp vào `.shots/walk/<slug>/`, và báo FAIL khi hình gợi ý hay lời giải nằm ngoài màn hoặc thanh dưới che chỗ cần chạm. Đọc từng ảnh: chữ rõ, công thức không vỡ, gợi ý đúng luật. Xem tay thì chạy `CONTENT_INCLUDE_DRAFT=1 pnpm dev` (bài `draft` được phục vụ trên máy, không bao giờ vào bản build), không cần đổi `status`.
12. **Review.** Dùng skill `lesson-review` (skill tự mở subagent mới). Sửa mọi lỗi Nghiêm trọng và các mục Nên sửa hợp lý khác, rồi review lại. Lặp tới khi còn 0 Nghiêm trọng. Chỉ mục không chặn mới được ghi vào `backlogs/lesson-<slug>.md`.
13. **Khoá id.** `pnpm content:lock` khi id đã ổn định (sau khi review đạt). Id đã khoá không được đổi hay xoá: tiến độ của trẻ gắn vào nó. Buộc phải đổi thì khai trong `retired` của `content/ids.lock.json`.
14. **Báo lại.** Gửi kết quả `--stats`, đường dẫn `review.md`, việc còn trong backlog.
