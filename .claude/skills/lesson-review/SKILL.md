---
name: lesson-review
description: Review độc lập một bài học đã soạn (content/**/lesson.json) trước khi xuất bản - đối chiếu ảnh nguồn SGK, kiểm đúng kiến thức, ngôn từ lớp 6 và tính nhất quán, ghi review.md, rồi ghi reviewedHash và đặt published khi không còn lỗi Nghiêm trọng. Dùng khi người dùng nói "review bài", "kiểm duyệt bài học", "duyệt bài", "xuất bản bài", "publish bài", hoặc ngay sau khi soạn hay sửa nội dung một bài.
---

# Review bài học

Tìm lỗi mà `pnpm content:check` không bắt được, trước khi trẻ thấy bài. Không sửa `lesson.json`: tác giả sửa, rồi review lại từ đầu.

## Chỉ chạy trong subagent mới

Người soạn đọc lại bài của mình thường bỏ sót chính lỗi mình tạo. Nếu phiên hiện tại đã soạn hay sửa bài này, hoặc không chắc, không tự review: dùng Agent tool (`general-purpose`) mở subagent mới với prompt "Dùng skill lesson-review cho `<đường dẫn lesson.json>`", rồi chuyển kết quả cho người dùng.

## Đầu vào

- `LESSON`: đường dẫn `lesson.json`. `ROOT`: thư mục cha gần nhất của `LESSON` có `subjects.json` (thường là `content/`).
- Ảnh nguồn: `sources/<subject>/<id bài>/p<trang>.png` (hoặc `.jpg`); `p23-24.png` chứa hai trang.
- Ý nghĩa từng trường: `src/schema/content.ts`. Luật kiểm duyệt và phản hồi 3 nấc khi sai: `docs/spec.md`, mục "Kiểm duyệt nội dung" và "Phản hồi 3 nấc khi sai".

## Quy trình

1. Chạy `pnpm content:check --root <ROOT>`. Mỗi `error` thuộc `LESSON` là một lỗi Nghiêm trọng; vẫn review tiếp.
2. Đọc hết `LESSON`. Với mỗi `sourceRef` (bài, section, card), mở đúng trang ảnh và đọc, không đoán nội dung trang. Không có ảnh nguồn: ghi lỗi Nghiêm trọng "thiếu nguồn", vẫn soát phạm vi theo chương trình lớp 6.
3. Soát mọi section, card và exercise theo bốn trục và "Luật gợi ý 3 nấc" trong `references/checklist.md`; bỏ qua mọi mục trong "Không bắt lỗi" của file đó. Với mỗi exercise, tự giải trước khi đọc `answer`. Soát hết bài, không dừng ở lỗi đầu tiên.
4. Ghi `review.md` cạnh `LESSON` theo `templates/review.md` (ghi đè bản cũ). Không chép dài chữ SGK: trỏ trang là đủ.
5. Không còn lỗi Nghiêm trọng: chạy `pnpm content:hash <id bài> --root <ROOT> --approve`. Lệnh từ chối nếu `content:check` còn lỗi; nếu không, ghi `reviewedHash` và đặt `status: published`, trừ khi `REQUIRE_OWNER_APPROVAL` trong `src/lib/config.ts` bật (khi đó quản trị viên đặt `published`). Còn lỗi Nghiêm trọng: không chạy lệnh, bài giữ `draft`.
6. Ghi kết quả bước 5 vào dòng "Kết luận" của `review.md`, rồi báo người gọi: số phát hiện theo từng mức, kết luận, đường dẫn `review.md`.

## Mức độ

- **Nghiêm trọng**: chặn xuất bản. Trẻ học sai, không làm được bài, hoặc bài vi phạm luật nội dung.
- **Nên sửa**: bài vẫn dùng được nhưng kém hiệu quả hoặc thiếu nhất quán.
- **Góp ý**: tuỳ tác giả, như từ Hán Việt khó.

Mức của từng loại lỗi ghi trong checklist. Phân vân giữa hai mức thì chọn mức cao hơn và nêu lý do.
