---
name: lesson-author
description: Soạn một hay nhiều bài học từ trang SGK hay sách bài tập (ảnh trong sources/<môn>/<bài>/, nạp từ PDF) thành content/<môn>/<bộ sách>/<bài>/lesson.json và đưa tới xuất bản - biên soạn lại, chia phần, viết tổng quan, card và bài tập, gọi lesson-visual làm hình, chạy thử bài, lesson-review duyệt, rồi làm video và lời đọc. Dùng khi người dùng nói "soạn bài", "soạn 3 bài", "soạn bài mới", "nạp bài mới", "biên soạn bài từ SGK", "thêm bài học", hoặc sửa nội dung một bài đã có.
model: sonnet
---

# Soạn bài học

Đầu ra: `content/<subject>/<series>/<slug>/lesson.json` chạy `pnpm content:check` không lỗi, đủ visual, `review.md` không còn lỗi Nghiêm trọng, `status: published` (hoặc chỉ có `reviewedHash` khi `REQUIRE_OWNER_APPROVAL` bật). Bài mẫu đã xuất bản: `content/math/kntt/luy-thua/`.

## Đọc trước

- Lỗi đã lặp ở các bài trước: `docs/lessons-learned/index.md` (mục lục, số lần gặp, nơi chặn). Đọc tệp của mọi mục có "Người" trong cột "Cách phòng" và soạn tránh chúng ngay từ đầu.
- Người học: `docs/learner.md` (tiến độ, chỗ yếu, sở thích). Bài bắc thang theo đúng các lỗ hổng ghi ở đó.
- Trường và kiểu: `src/schema/content.ts`. Không suy schema từ bài mẫu.
- Luật nội dung, id bất biến, cổng xuất bản: `docs/spec.md` mục "Mô hình nội dung". Dạng bài, gợi ý, ôn tập: các mục "Tám dạng bài tập", "Phản hồi 3 nấc khi sai", "Ôn tập theo yêu cầu".
- Màu khái niệm, cỡ chữ, vùng chạm: `docs/design-system.md`.
- Tiêu chí review: `.claude/skills/lesson-review/references/checklist.md`, nhất là "Luật gợi ý 3 nấc" và "Không bắt lỗi". Soạn theo đúng tiêu chí này ngay từ đầu.
- Bẫy đã gặp khi soạn: `.claude/skills/lesson-author/references/pitfalls.md`.

## Nhận yêu cầu

Bài mới mà chưa có nguồn trong `sources/<môn>/<slug>/` hay còn thiếu thông tin (sách, trang, media ngay hay để sau): làm theo `.claude/skills/import-source/references/intake.md` trước. Đã qua `/import-source` thì dùng luôn kế hoạch đã chốt.

## Sư phạm cho người học chậm

Bài viết cho trẻ lớp 6 học chậm, hay quên. Mọi bài theo các luật sau.

- **Tổng quan bài (`overview`, bắt buộc).** `hook`: một câu mở gần đời sống của trẻ (môn khô như Toán, Địa lí: một tình huống ở nhà, ở chợ, trên đường đi học cần đúng kiến thức bài này). `summary`: Ngữ văn kể lại truyện trong 3–5 câu; môn khác nói bài học gì trong 1–2 câu. `goals`: 2–4 mục, mỗi mục đọc tiếp được sau "Học xong bài này, bạn sẽ:" (màn hình in sẵn câu dẫn này) (không lặp cụm đó trong mục). `whyItMatters`: một câu. `narration` do `pnpm narration:build` ghi, không viết tay; việc ghi làm đổi review hash nên sau đó chạy một vòng review phần đổi rồi duyệt lại. Chữ trong overview viết số mũ, kí hiệu bằng lời (build từ chối ² và TeX).
- **Mẫu → cùng làm → tự làm.** Ý mới có ví dụ mẫu giải trọn trước câu tự làm đầu tiên; ý chính có thêm màn trẻ thao tác có hướng dẫn (visual tương tác, số tối thiểu theo `--stats`).
- **Ví dụ đời sống ở mọi section Toán, Địa lí**: ít nhất một ví dụ hay câu hỏi lấy từ đời sống hằng ngày (tiền, đồ ăn, quãng đường, thời tiết…), số vẫn nhỏ.
- **Quy tắc là câu để nhớ, không phải chú thích.** Định nghĩa, quy tắc, quy ước viết thành 1–2 câu trong `note` của một `group`, cùng ví dụ có nhãn (`formula` hay `visual`) ngay dưới. Note nêu quy tắc mang `"rule": true`; recap section lặp nguyên văn một câu của nó, recap card lặp nguyên văn câu hay một vế của câu đó (luật `[rule-sentence]`, LL-05). Câu bài học luôn nằm trong JSON để lint và review đọc được; visual không chứa câu bài học, chỉ nhãn ngắn. `caption` xám chỉ dùng cho hướng dẫn thao tác hay nhận xét ngắn.
- **Số nhỏ.** Câu luyện tập và ôn tính nhẩm được trong tối đa 2 phép tính (3³ = 27 được, 3⁴ = 81 thì không). Ví dụ mẫu được dài hơn khi có hình từng bước.
- **Dạy thao tác nhập trước lần dùng đầu** (LL-04). Màn hướng dẫn là `group` có `"guide": "<thao tác>"`; `content:check` luật `[guides]` báo câu dùng thao tác trước màn đó. Thao tác cần dạy: phím "mũ" của `numeric` dạng luỹ thừa, nối cặp của `match` (kéo hay chạm), sắp xếp của `order`, chạm vùng của `tapRegion`. Mỗi thao tác dạy một lần cho cả app: trước khi dùng, tìm trong `content/**/lesson.json` màn hướng dẫn thao tác đó (vd `luy-thua.visual.bam-mu` dạy phím mũ); chưa có thì bài này đặt một màn hướng dẫn ngắn ngay trước câu section đầu tiên dùng nó, với số khác câu đó. Câu chỉ có trong kho ôn chỉ dùng thao tác đã dạy. Các dạng khác không cần màn này.
- **Câu chuyện mở đầu phải có kết** trong cùng section, bằng kiến thức vừa học.
- **`minutes` tính từ số màn**: khoảng 40 giây mỗi màn (block, câu hỏi, recap), làm tròn phút.
- **Recap = một `visual` vẽ ví dụ có nhãn** (ký hiệu ● Cơ số ▲ Số mũ hay tương đương), câu cần nhớ ở `caption` (≤ 2 câu; màn recap hiện nó thành chữ thân bài phía trên hình).
- **Section ngắn, card đủ câu.** Section ≤ 4 màn và ≤ 4 câu `checkIds` + `practiceIds`; card ≥ 3 exercise, đúng 1 câu trong `practiceIds`. Ý dài hơn thì tách section, mỗi section một ý.
- **Chọn nhiều đáp án khi câu hỏi tự nhiên có nhiều đáp án đúng.** Mỗi bài có ít nhất 2 câu `choice` với `multiple: true` (vd "Chọn tất cả các luỹ thừa có cơ số 2", "Chọn tất cả lời thoại của cáo"), thường đặt ở kho ôn (mỗi card chỉ 1 câu luyện tập, mỗi section ≤ 4 câu). Đề mở đầu bằng "Chọn tất cả…", tập đáp án đúng có 2–3 ý trong 4 lựa chọn.
- **Màn giải thích tương tác nói rõ làm gì và để làm gì.** `note` đầu màn (cỡ chữ thân bài, trên hình) gồm một dòng việc phải làm ("Chạm vào từng lời thoại để biết ai nói câu đó.") và một dòng lý do ("Biết ai đang nói giúp bạn hiểu câu chuyện."). Visual tương tác hiện tiến độ ("Đã xem 1/5") và một dòng kết khi làm xong. Hướng dẫn không chỉ nằm ở `caption` xám nhỏ dưới hình.
- **Không cắt chữ bằng "…"** trong mọi chữ của bài (note, đề, lựa chọn, caption, nhãn visual, overview). Ngoại lệ duy nhất: trích nguyên văn `passage` mà văn bản gốc có "…". Câu dài thì viết lại cho gọn.
- **Luyện tập và kho ôn khác số.** Câu kho ôn của card (ngoài `practiceIds`) khác số với câu luyện tập và với ví dụ trên màn quy tắc, để phiên ôn không hỏi lại đúng câu vừa làm.

## Quy trình

Subagent phụ soạn nội dung (nếu có) mở với `model: "sonnet"`. Sửa bài đã có: bỏ bước 1–4, sửa theo bước 5–9, rồi làm tiếp từ bước 10; bài đã `published` phải review lại vì `reviewedHash` lệch.

1. **Đọc nguồn.** Mở mọi ảnh `sources/<subject>/<slug>/p<trang>.png` (hoặc `.jpg`; `p23-24.png` chứa hai trang; `sbt-p<trang>.png` là trang sách bài tập). Ảnh là nguồn chính (hình, bảng, công thức, khung bên lề); `p<trang>.txt`, nếu có, chỉ để đối chiếu chữ. Ghi kiến thức, ví dụ, bài tập theo trang. Chỉ lấy phần thuộc bài này, bỏ phần của bài liền trước hay liền sau in chung trang.
2. **Ngữ văn: chép văn bản trước.** Chép văn bản đọc hiểu nguyên văn từ ảnh vào `source-passage.txt` cạnh `lesson.json`. Có `p<trang>.txt` thì so từng dòng: dòng nào ảnh và lớp chữ khác nhau thì giữ bản đọc từ ảnh (lớp chữ PDF hay vỡ dấu) và liệt kê các dòng đó khi xin duyệt. Rồi dừng chờ chủ dự án duyệt với ảnh; chưa duyệt thì chưa soạn tiếp.
3. **Biên soạn lại.** Viết định nghĩa, ví dụ, bài tập bằng lời và số của mình, không chép câu hay hình SGK. Riêng khối `passage` giữ nguyên văn. Bài tập theo các dạng bài của sách; có trang đáp án (SBT) thì đối chiếu đáp án với nó.
4. **Dựng khung.** Chép `.claude/skills/lesson-author/templates/lesson.skeleton.json` vào thư mục bài, thay mọi `bai-moi` bằng slug, đặt `subject`, `series`, `title`, `sourceRef` và `order` = số bài trong SGK (Bài 6 → 6): app xếp bài và gợi ý bài kế trong môn theo `order`, nên không trùng bài khác cùng môn, bộ sách. Các `visualId` `fixture.*` chỉ giữ chỗ để khung qua `content:check`; bước 9 thay hết (`content:check` cảnh báo `[placeholder]`, `content:hash --approve` từ chối khi còn).
5. **Khái niệm.** Tên và màu lấy theo `content/glossary/<subject>.json`; chưa có term thì thêm vào đó kèm `color`. Mỗi khái niệm giữ một màu ở mọi công thức, visual, highlight.
6. **Chia phần.** Mỗi section một ý, `sourceRef` đúng trang. Mỗi phần tử của `blocks` là một màn; màn quy tắc là `group` gồm `note` rồi `formula`/`visual`, xem bài mẫu. Sau phần giải thích: 1–2 câu `checkIds` (`cardIds: []`, không tính điểm nhớ) và một câu `practiceIds` cho mỗi card của section (lần gặp đầu của card). Chia card ngay lúc này: section có tối đa 4 − số câu `checkIds` card, bài cần ≥ 8 card, nên bài 3 section cần khoảng 3 card mỗi section (1 câu kiểm tra + 3 câu luyện tập).
7. **Card và bài tập.** Đủ để mọi dòng tiêu chí của `pnpm content:check --stats` là `PASS`. Câu ôn còn lại của card chỉ nằm trong `exercises`. `openEnded` của Ngữ văn chia thành các bước nhỏ tự chấm, đặt trước bước viết.
8. **Chi tiết từng câu.**
   - Bài Toán: đặt `check.expr` cho mọi `numeric` (bắt buộc) và `check` cho `choice` có lựa chọn là số, biểu thức hay phép so sánh tính được: `relation` `equal` (mặc định), `notEqual` cho đề "kết quả nào sai", `max`/`min` cho "lớn nhất"/"nhỏ nhất" (không có `expr`), `holds`/`fails` khi mỗi lựa chọn là một phép so sánh. Lint tính mọi lựa chọn và báo lỗi khi nhiễu cũng thoả đề (LL-01).
   - `order.items` viết theo thứ tự đúng; app tự xáo mọi lựa chọn khi hiện.
   - `hints` theo luật 3 nấc trong checklist review. Câu nào hình giúp hiểu rõ hơn thì đặt `hintVisualId`, `solutionVisualId`.
9. **Visual.** Dùng skill `lesson-visual` cho mọi `visualId` mới và mọi chỗ giữ `fixture.*` (cả sticker), kèm vai trò của từng hình (giải thích, tương tác, vùng chạm, gợi ý nấc 2, lời giải nấc 3) và bộ số của nó.
10. **Kiểm tự động.** `pnpm format` rồi `pnpm content:check --stats` tới khi mọi dòng tiêu chí là `PASS`, 0 lỗi và 0 cảnh báo. Được phép còn: `[review-hash]` (bài đã `published`, bước 12 xoá) và "not in ids.lock.json" (bước 13 xoá).
11. **Chạy thử bài.** `pnpm lesson:walk <slug>` (đi hết bài ở iPad dọc, điện thoại, iPad ngang cùng lúc; câu đầu của mỗi dạng sai đủ 3 nấc) tới khi 0 FAIL. Walk dùng lại server đang chạy ở cổng test (`TEST_PORT`, mặc định 3100) hay ở `WALK_BASE_URL`; server đó báo 404 hay phục vụ bản cũ của bài thì tắt nó rồi chạy lại để walk tự mở server mới. Mở và đọc từng ảnh của mọi màn trong `.shots/walk/<slug>/`, cả điện thoại lẫn iPad (không chỉ đọc dòng PASS/FAIL): chữ rõ, công thức không vỡ, gợi ý đúng luật, không chữ chồng nhau hay bị cắt, không cột hẹp hay hình nhỏ lọt thỏm giữa màn; có lỗi thì sửa rồi walk lại. Xem tay: `CONTENT_INCLUDE_DRAFT=1 pnpm dev` (bài `draft` không bao giờ vào bản build).
12. **Review.** Dùng skill `lesson-review`, phiên này điều phối. Sửa mọi lỗi Nghiêm trọng và các mục Nên sửa hợp lý, rồi gọi vòng sau, tới khi còn 0 Nghiêm trọng. Chỉ mục không chặn mới được ghi vào `backlogs/lesson-<slug>.md`.
13. **Khoá id.** `pnpm content:lock` khi id đã ổn định (sau khi review đạt). Id đã khoá không được đổi hay xoá: tiến độ của trẻ gắn vào nó. Buộc phải đổi thì khai trong `retired` của `content/ids.lock.json`.
14. **Video và lời đọc** (nếu đã chọn làm ngay; bài đã `published`). `pnpm narration:build <slug>` đọc `overview` bằng giọng Hải Đăng, rồi `pnpm content:check` (còn `[review-hash]` thì review lại phần đổi như bước 12). Video theo skill `lesson-video` (bước 7 của nó gồm review phần đổi). Chỉ dựng media của bài dưới `public/media/`, không dựng lại `public/sounds/`. Xong chạy lại `pnpm lesson:walk <slug>`, chỉ cần xem ảnh màn tổng quan và video.
15. **Rút kinh nghiệm.** Đọc các `review.md` của bài: mỗi Nghiêm trọng thuộc mục nào của `docs/lessons-learned/index.md`. Reviewer đã tăng số đếm; tác giả thêm dòng "Lỗi Nghiêm trọng ở vòng 1 theo bài" cho bài này. Lỗi lặp ở từ 2 bài trở lên mà chưa có mục: thêm mục mới; kiểm được bằng máy thì đề xuất luật `content:check` (trong `src/content/lint/`, lời báo trỏ id mục) với người dùng, rồi ghi vào `backlogs/milestones.md` nếu chưa làm ngay.
16. **Báo lại.** Gửi kết quả `--stats`, đường dẫn `review.md`, việc còn trong backlog, mục lessons-learned đã thêm hay tăng số.

## Nhiều bài một lúc

Mỗi bài một subagent (Agent tool, `isolation: "worktree"`, `model: "sonnet"`), mở song song trong một lượt gọi.

1. Nhận yêu cầu và nạp nguồn cho mọi bài ở cây chính (`sources/` bị gitignore nên worktree không có).
2. Prompt mỗi subagent: slug, môn, bộ sách, `order`, kế hoạch đã chốt, đường dẫn tuyệt đối tới `sources/<môn>/<slug>/` ở cây chính (chép vào worktree của nó), một `TEST_PORT` riêng (3101, 3102…) để walk không dùng chung server với bài khác, và "đọc `.claude/skills/lesson-author/SKILL.md`, chạy `pnpm install`, làm bước 1–11, commit trên nhánh của mình; không review, không `content:lock`". Bài Ngữ văn: subagent dừng sau bước 2 và trả về `source-passage.txt` cùng các dòng lệch; phiên chính xin duyệt rồi gọi tiếp subagent đó bằng SendMessage.
3. Xong hết: merge lần lượt từng nhánh vào nhánh hiện tại. Xung đột ở `content/ids.lock.json`, `content/glossary/*.json`, `src/visuals/registry.ts` thì giữ mục của cả hai phía. Sau mỗi merge: `pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm content:check`.
4. Từng bài làm tiếp bước 12–16 ở cây chính.
