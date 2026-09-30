---
name: lesson-review
description: Review độc lập một bài học đã soạn (content/**/lesson.json) trước khi xuất bản - đối chiếu ảnh nguồn SGK, kiểm đúng kiến thức, ngôn từ lớp 6 và tính nhất quán, ghi review.md, rồi ghi reviewedHash và đặt published khi không còn lỗi Nghiêm trọng. Dùng khi người dùng nói "review bài", "kiểm duyệt bài học", "duyệt bài", "xuất bản bài", "publish bài", hoặc ngay sau khi soạn hay sửa nội dung một bài.
model: opus
---

# Review bài học

Tìm lỗi mà `pnpm content:check` không bắt được, trước khi trẻ thấy bài. Reviewer không sửa `lesson.json` (chỉ ghi `reviewedHash`, `status` qua lệnh): tác giả sửa rồi gọi vòng sau.

## Vai

- **Điều phối**: phiên gọi skill (có thể là phiên soạn bài). Chỉ chạy lệnh, chia phần, mở subagent và chuyển kết quả; không phán nội dung, không bỏ phát hiện nào.
- **Reviewer**, **Tổng hợp**: luôn là subagent mới, mở bằng Agent tool với `subagent_type: "general-purpose"`; model theo vòng: vòng 1 và 2 (soát toàn bài, gồm reviewer song song lẫn Tổng hợp) dùng `model: "opus"`, từ vòng 3 (chỉ phần đổi, kể cả review kịch bản video/lời đọc) dùng `model: "sonnet"`, không phải phiên đã soạn hay sửa bài, vì người soạn hay bỏ sót chính lỗi mình tạo. Prompt ghi rõ vai, `LESSON`, phạm vi, tệp ghi kết quả, và "đọc `.claude/skills/lesson-review/SKILL.md`".

## Đầu vào

- `LESSON`: đường dẫn `lesson.json`. `ROOT`: thư mục cha gần nhất có `subjects.json` (thường `content/`).
- `<id bài>` là slug của bài (tên thư mục chứa `lesson.json`).
- Ảnh nguồn: `sources/<subject>/<id bài>/p<trang>.png` (`sbt-p<trang>.png`: trang sách bài tập) (hoặc `.jpg`; `p23-24.png` chứa hai trang).
- Trường: `src/schema/content.ts`. Luật: `docs/spec.md` mục "Kiểm duyệt nội dung", "Phản hồi 3 nấc khi sai". Tiêu chí và mức lỗi: `references/checklist.md`.
- Lỗi đã lặp ở các bài trước: `docs/lessons-learned/index.md`. Reviewer và Tổng hợp đọc nó trước khi soát, rồi soát kỹ phần máy chưa bắt của từng mục.

## Vòng review

Vòng này = số ở dòng "Vòng" của `review.md` cũ + 1 (chưa có `review.md`: vòng 1).

- **Vòng 1–2: toàn bài**, song song (dưới đây).
- **Từ vòng 3: chỉ phần đổi.** Không review toàn bài lần thứ ba.

Mỗi vòng kết thúc bằng một trong hai lệnh, cả hai ghi dòng "Bản đã review" (hash) vào `review.md` để vòng sau so với bản này:
- 0 Nghiêm trọng: `pnpm content:hash <id bài> --root <ROOT> --approve` (từ chối nếu `content:check` còn lỗi; ghi `reviewedHash`, đặt `published` trừ khi `REQUIRE_OWNER_APPROVAL` trong `src/lib/config.ts` bật).
- Còn Nghiêm trọng: `pnpm content:hash <id bài> --root <ROOT> --mark`; bài giữ `draft`.

Sau đó tác giả commit `lesson.json` và `review.md` **trước khi sửa**: `pnpm content:diff` đọc bản đã review từ lịch sử git (`scripts/lib/review-baseline.ts`).

## Vòng toàn bài

Điều phối:
1. `pnpm content:check --root <ROOT>`; `ROOT` là `content/` thì thêm `pnpm lesson:walk <id bài>` (ảnh trong `.shots/walk/<id bài>/`; `ROOT` khác thì ghi "không chạy").
2. Chia section thành nhóm liên tiếp: ≤ 4 section thì 1 nhóm, nhiều hơn thì 3 nhóm gần bằng nhau. Card, exercise theo section có nó trong `checkIds`/`practiceIds` hay luyện card của nó; câu kho ôn theo card.
3. Mở song song mỗi nhóm một **Reviewer** (một lượt gọi Agent nhiều tool), kèm kết quả bước 1 và tệp ghi `.shots/review/<id bài>/nhom-<n>.md`.
4. Xong cả nhóm: mở một **Tổng hợp**.

Reviewer:
- Đọc toàn bộ glossary của môn, mọi `note` quy tắc, `recap` của cả bài (để nhất quán), rồi chỉ soát phần của nhóm: mở đúng trang ảnh của từng `sourceRef` (không đoán nội dung trang; thiếu ảnh là Nghiêm trọng "thiếu nguồn"), ảnh walk của các section đó.
- Soát theo năm trục và "Luật gợi ý 3 nấc" của checklist, bỏ qua mục "Không bắt lỗi". Tự giải mỗi exercise trước khi đọc `answer`. Soát hết, không dừng ở lỗi đầu.
- Ghi phát hiện theo khuôn mục của `.claude/skills/lesson-review/templates/review.md` vào tệp nhóm.

Tổng hợp:
- Chỉ đọc các tệp nhóm và mọi câu quy tắc (`note`), `recap`, `caption`, thuật ngữ của cả bài; tìm mâu thuẫn giữa các phần (một quy tắc hai cách nói, một khái niệm hai tên hay hai màu, recap lệch note).
- Gộp mọi phát hiện (bỏ trùng, giữ mức cao hơn) và phát hiện của mình vào `review.md` cạnh `LESSON` theo `.claude/skills/lesson-review/templates/review.md` (ghi đè bản cũ; không chép dài chữ SGK, trỏ trang là đủ), chạy lệnh cuối vòng, ghi kết quả vào dòng "Kết luận".

## Vòng chỉ phần đổi

Điều phối chạy `pnpm content:diff <id bài> --root <ROOT>` (liệt kê mục thêm, bớt, đổi kèm chữ, và section cần đọc lại), `content:check`, `lesson:walk`, rồi mở **một Reviewer** mới kèm kết quả đó. Reviewer đó:
- Soát mọi mục trong diff theo checklist, và soát các mục khác **cùng section** xem bản sửa có làm hỏng chúng không (recap còn khớp note, câu kiểm tra và câu luyện tập không trùng hình, nhiễu không thành đáp án đúng).
- Mục thuộc bài tập hay card: đọc ảnh walk và trang nguồn của section đó. Diff chỉ có video: theo "Lời video khớp bài" trong checklist.
- Làm luôn việc của Tổng hợp: ghi `review.md` (phạm vi ghi ở dòng "Vòng"), chạy lệnh cuối vòng.

## Mức độ

- **Nghiêm trọng**: chặn xuất bản. Trẻ học sai hoặc nhớ sai (định nghĩa, quy tắc, recap, cách đọc), không làm được bài, hoặc bài vi phạm luật nội dung. Ghi vào backlog không thay cho việc sửa.
- **Nên sửa**: bài vẫn dùng được nhưng kém hiệu quả hoặc thiếu nhất quán.
- **Góp ý**: tuỳ tác giả, như từ Hán Việt khó.

Mức từng loại lỗi ghi trong checklist; phân vân thì chọn mức cao hơn và nêu lý do. Cách sửa đề xuất phải theo được luật của bài: không đề xuất điều `.claude/skills/lesson-author/references/pitfalls.md` cấm.

## Rút kinh nghiệm

Phiên ghi `review.md` (Tổng hợp, hay Reviewer của vòng chỉ phần đổi) cập nhật `docs/lessons-learned/` với mỗi phát hiện Nghiêm trọng:
- Thuộc một mục đã có: tăng cột Nghiêm trọng và Tổng của mục đó trong bảng "Số lần gặp", thêm ví dụ (bài, id, vòng) vào tệp mục nếu kiểu lỗi có điểm mới.
- Kiểu mới: thêm tệp `LL-<số kế tiếp>-<slug>.md` theo khuôn các mục có sẵn (Triệu chứng, Ví dụ thật, Nguyên nhân gốc, Cách phòng, Trạng thái), một dòng ở "Mục lục" và ở "Số lần gặp".
- Bài xong vòng 1: thêm dòng của bài vào bảng "Lỗi Nghiêm trọng ở vòng 1 theo bài".
- Mục trong `review.md` ghi id mục lessons-learned bên cạnh vị trí khi có (vd "LL-01").

Báo người gọi: vòng, số phát hiện theo mức, kết luận, đường dẫn `review.md`, mục lessons-learned đã thêm hay tăng số.
