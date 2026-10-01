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

- **Tổng quan bài (`overview`, bắt buộc với bài mới; `content:check` báo lỗi khi bài đã `published` thiếu nó).** Tổng quan phải nối bài với đời sống hằng ngày: kiến thức này nằm ở đâu quanh bé và dùng để làm gì (vd "+ − × :" để đi chợ, đếm và trả tiền). `hook`: câu đầu tiên là câu chào gọi bé là "bạn" ("Chào bạn! Ở bài này, chúng ta sẽ …"; lời đọc giới thiệu mở bằng câu này, `pnpm narration:build` từ chối khi thiếu chữ "bạn"; bài đã có lời đọc trước luật được miễn trong `media.json`), rồi một câu mở là tình huống cụ thể ở nhà, ở chợ, trên đường đi học cần đúng kiến thức bài này (Ngữ văn: tình huống bé từng gặp giống chuyện trong bài). `summary`: Ngữ văn kể lại truyện trong 3–5 câu; môn khác nói bài học gì trong 1–2 câu. `goals`: 2–4 mục, mỗi mục đọc tiếp được sau "Học xong bài này, bạn sẽ:" (màn hình in sẵn câu dẫn này) (không lặp cụm đó trong mục). `whyItMatters`: **một câu nêu một tình huống đời sống cụ thể mà kiến thức này có mặt và việc nó giúp làm được**, vd "Bạn dùng phép nhân khi đi chợ để biết ba gói kẹo giá bốn nghìn hết bao nhiêu tiền." Không viết câu chung chung kiểu "giúp bạn học tốt các bài sau" hay "rất quan trọng": tình huống phải có người, vật, việc làm cụ thể mà bé hình dung ra. Máy chỉ kiểm được overview có mặt, đủ trường và ngắn; tình huống có cụ thể và đúng không là việc của reviewer (checklist trục 3). `narration` do `pnpm narration:build` ghi, không viết tay; việc ghi làm đổi review hash nên sau đó chạy một vòng review phần đổi rồi duyệt lại. Chữ trong overview viết số mũ, kí hiệu bằng lời (build từ chối ² và TeX).
- **Giải thích sau mỗi câu (`explain`, bắt buộc với bài mới).** Sau khi bé trả lời (đúng, hết nấc 3, hay bỏ qua) app hiện khung "Giải thích" ngay dưới câu hỏi rồi mới tới nút "Tiếp". Mọi câu chấm được có `explain` (câu ôn, câu luyện tập, câu kiểm tra, từng bước của `openEnded`; chính câu `openEnded` thì không), `content:check` báo lỗi từng câu thiếu. Hình dạng:

  ```json
  "explain": {
    "text": "Tối đa 3 câu: vì sao đáp án đúng.",
    "tex": "14 = 1 \\cdot 14 = 2 \\cdot 7",
    "visualId": "<bài>.visual.<tên>",
    "wrong": [{ "optionId": "b", "text": "Một câu: vì sao phương án này sai." }]
  }
  ```

  Chỉ `text` bắt buộc. `text` ≤ 3 câu, giọng bình tĩnh, nói thẳng lý do chứ không phán đúng sai (không "Đúng rồi!": cú đã khen); nêu cách nghĩ để bé tự làm được câu tương tự, không chỉ lặp đáp án. Ví dụ "Chọn tất cả các ước của 14": `text` "Tìm ước bằng cách viết 14 thành tích hai thừa số. Mỗi thừa số trong các tích đó là một ước.", `tex` `14 = 1 \cdot 14 = 2 \cdot 7`. `tex` là một công thức hay một dòng tính chứa lý lẽ (nhiều dòng: `\begin{aligned} … \\ … \end{aligned}`; trong JSON mỗi dấu `\` viết đôi), tô màu khái niệm đúng như bài. `visualId` chỉ khi hình mới chở được lý do; đừng dùng đúng hình lời giải của nấc 3 (khung tự bỏ hình đang hiện). `wrong` chỉ cho `choice`, chỉ cho phương án bé dễ chọn nhầm (không phải mọi phương án, không phải phương án đúng), mỗi lý do một câu. Câu cũ của bài đã xuất bản chưa có `explain` thì app tự hiện lời giải (hình lời giải và đáp án); bài nào nằm trong `content/legacy-lessons.json` thì được miễn hay chỉ bị cảnh báo, bài mới không được thêm mình vào danh sách đó.
- **Mẹo (`tip`) khi dạng bài có mẹo thật.** Mẹo là cách làm nhanh, hiểu nhanh hay tránh sai cho một dạng bài (vd nhân với 9: nhân 10 rồi bớt một lần; chia hết cho 3: cộng các chữ số; kiểm tra phép chia bằng phép nhân). Chủ dự án đánh giá cao mẹo; nhưng chỉ viết khi dạng bài có mẹo đúng, không gượng cho đủ số. Mỗi khối `tip` là một màn của section (tính vào giới hạn 4 màn): `kind` ("làm nhanh", "hiểu nhanh", "tránh sai"), `title` là tên dạng bài (≤ 8 chữ, vd "Nhân với 9"), `text` ≤ 3 câu nói mẹo, `tex` là công thức hay ví dụ tính bằng mẹo, `visualId` khi có hình. Đặt mẹo sau phần giải thích đã dạy cách làm bình thường, và trước câu tự làm của dạng đó. Mẹo phải đúng với **mọi** số thuộc dạng bài, kể cả số biên (0, 1, số lớn, số chẵn/lẻ); thử mẹo trên ít nhất 5 số khác nhau, gồm số biên, trước khi viết; mẹo chỉ đúng một số trường hợp thì nói rõ điều kiện trong `text` ("khi số tận cùng là 5") hoặc bỏ. Dùng kiến thức lớp 6, không dùng thứ chưa học. Trang "Mẹo hay" của bài (`/lessons/<id>/tips`, nút "Mẹo hay" ở trang bài) gom mọi khối `tip` của bài và các mẹo ở `tips.json`.
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
2. **Môn có `rules.verbatimPassage` (hiện là Ngữ văn): chép văn bản trước.** Chép văn bản đọc hiểu nguyên văn từ ảnh vào `source-passage.txt` cạnh `lesson.json`. Có `p<trang>.txt` thì so từng dòng: dòng nào ảnh và lớp chữ khác nhau thì giữ bản đọc từ ảnh (lớp chữ PDF hay vỡ dấu) và liệt kê các dòng đó khi xin duyệt. Rồi dừng chờ chủ dự án duyệt với ảnh; chưa duyệt thì chưa soạn tiếp.
3. **Biên soạn lại.** Viết định nghĩa, ví dụ, bài tập bằng lời và số của mình, không chép câu hay hình SGK. Riêng khối `passage` giữ nguyên văn, và đề bài tập của bài ôn tập chương (mục "Bài ôn tập chương" bên dưới). Bài tập theo các dạng bài của sách; có trang đáp án (SBT) thì đối chiếu đáp án với nó.
4. **Dựng khung.** Chép `.claude/skills/lesson-author/templates/lesson.skeleton.json` vào thư mục bài, thay mọi `bai-moi` bằng slug, đặt `subject`, `series`, `title`, `sourceRef` và `order` = số bài trong SGK (Bài 6 → 6): app xếp bài và gợi ý bài kế trong môn theo `order`, nên không trùng bài khác cùng môn, bộ sách. Các `visualId` `fixture.*` chỉ giữ chỗ để khung qua `content:check`; bước 9 thay hết (`content:check` cảnh báo `[placeholder]`, `content:hash --approve` từ chối khi còn).
5. **Khái niệm.** Tên và màu lấy theo `content/glossary/<subject>.json`; chưa có term thì thêm vào đó kèm `color`. Mỗi khái niệm giữ một màu ở mọi công thức, visual, highlight.
6. **Chia phần.** Mỗi section một ý, `sourceRef` đúng trang. Mỗi phần tử của `blocks` là một màn; màn quy tắc là `group` gồm `note` rồi `formula`/`visual`, xem bài mẫu. Mẹo của dạng bài đặt thành khối `tip` ngay sau phần giải thích (mục "Mẹo"). Sau phần giải thích: 1–2 câu `checkIds` (`cardIds: []`, không tính điểm nhớ) và một câu `practiceIds` cho mỗi card của section (lần gặp đầu của card). Chia card ngay lúc này: section có tối đa 4 − số câu `checkIds` card, bài cần ≥ 8 card, nên bài 3 section cần khoảng 3 card mỗi section (1 câu kiểm tra + 3 câu luyện tập).
7. **Card và bài tập.** Đủ để mọi dòng tiêu chí của `pnpm content:check --stats` là `PASS`. Câu ôn còn lại của card chỉ nằm trong `exercises`. `openEnded` của Ngữ văn chia thành các bước nhỏ tự chấm, đặt trước bước viết.
8. **Chi tiết từng câu.**
   - Môn có `rules.checkExpr` trong `content/subjects.json` (hiện là Toán): đặt `check.expr` cho mọi `numeric` (bắt buộc) và `check` cho `choice` có lựa chọn là số, biểu thức hay phép so sánh tính được: `relation` `equal` (mặc định), `notEqual` cho đề "kết quả nào sai", `max`/`min` cho "lớn nhất"/"nhỏ nhất" (không có `expr`), `holds`/`fails` khi mỗi lựa chọn là một phép so sánh. Lint tính mọi lựa chọn và báo lỗi khi nhiễu cũng thoả đề (LL-01).
   - `explain` cho mọi câu (mục "Giải thích sau mỗi câu"): viết khi đã chốt đáp án, và đọc lại nó như bé: có hiểu vì sao chưa?
   - `order.items` viết theo thứ tự đúng; app tự xáo mọi lựa chọn khi hiện.
   - `hints` theo luật 3 nấc trong checklist review. Câu nào hình giúp hiểu rõ hơn thì đặt `hintVisualId`, `solutionVisualId`.
9. **Visual.** Dùng skill `lesson-visual` cho mọi `visualId` mới và mọi chỗ giữ `fixture.*` (cả sticker), kèm vai trò của từng hình (giải thích, tương tác, vùng chạm, gợi ý nấc 2, lời giải nấc 3) và bộ số của nó.
10. **Kiểm tự động.** `pnpm format` rồi `pnpm content:check --stats` tới khi mọi dòng tiêu chí là `PASS`, 0 lỗi và 0 cảnh báo. Được phép còn: `[review-hash]` (bài đã `published`, bước 12 xoá) và "not in ids.lock.json" (bước 13 xoá).
11. **Chạy thử bài.** `pnpm lesson:walk <slug>` (đi hết bài ở iPad dọc, điện thoại, iPad ngang cùng lúc; câu đầu của mỗi dạng sai đủ 3 nấc) tới khi 0 FAIL. Walk dùng lại server đang chạy ở cổng test (`TEST_PORT`, mặc định 3100) hay ở `WALK_BASE_URL`; server đó báo 404 hay phục vụ bản cũ của bài thì tắt nó rồi chạy lại để walk tự mở server mới. Đọc mọi contact sheet `sheet-NN.png` trong `.shots/walk/<slug>/<thiết bị>/` (walk in đường dẫn; mỗi ô là một màn, có tên ảnh), cả điện thoại lẫn iPad (không chỉ đọc dòng PASS/FAIL); chỉ mở riêng một ảnh khi ô của nó cho thấy điều đáng phóng to: chữ rõ, công thức không vỡ, gợi ý đúng luật, không chữ chồng nhau hay bị cắt, không cột hẹp hay hình nhỏ lọt thỏm giữa màn; có lỗi thì sửa rồi walk lại. Xem tay: `CONTENT_INCLUDE_DRAFT=1 pnpm dev` (bài `draft` không bao giờ vào bản build).
12. **Review.** Dùng skill `lesson-review`, phiên này điều phối. Sửa mọi lỗi Nghiêm trọng và các mục Nên sửa hợp lý, rồi gọi vòng sau, tới khi còn 0 Nghiêm trọng. Chỉ mục không chặn mới được ghi vào `notebooks/backlogs/lesson-<slug>/task.md`.
13. **Khoá id.** `pnpm content:lock <id bài>` khi id đã ổn định (sau khi review đạt); luôn kèm id bài của mình, để không khoá nhầm id của bài khác đang soạn (không kèm id thì khoá mọi bài và bỏ qua bài có `reviewedHash` cũ). Id đã khoá không được đổi hay xoá: tiến độ của trẻ gắn vào nó. Buộc phải đổi thì khai trong `retired` của `content/ids.lock.json`.
14. **Video và lời đọc** (nếu đã chọn làm ngay; bài đã `published`). `pnpm narration:build <slug>` đọc `overview` bằng giọng Gemini cùng giới tính với giọng bài, rồi `pnpm content:check` (`overview.narration` không nằm trong hash nên lời đọc không đòi review lại). Video theo skill `lesson-video` (bước 7 của nó gồm review phần đổi). Chỉ dựng media của bài dưới `public/media/`, không dựng lại `public/sounds/`. Xong chạy lại `pnpm lesson:walk <slug>`, chỉ cần xem sheet của màn tổng quan và video.
15. **Rút kinh nghiệm.** Đọc các `review.md` của bài: mỗi Nghiêm trọng thuộc mục nào của `docs/lessons-learned/index.md`. Reviewer đã tăng số đếm; tác giả thêm dòng "Lỗi Nghiêm trọng ở vòng 1 theo bài" cho bài này. Lỗi lặp ở từ 2 bài trở lên mà chưa có mục: thêm mục mới; kiểm được bằng máy thì đề xuất luật `content:check` (trong `src/content/lint/`, lời báo trỏ id mục) với người dùng, rồi ghi vào `notebooks/backlogs/index.md` nếu chưa làm ngay.
16. **Báo lại.** Gửi kết quả `--stats`, đường dẫn `review.md`, việc còn trong backlog, mục lessons-learned đã thêm hay tăng số. Nếu bài và media đã xong, nói rõ bài sẵn sàng lên production và hỏi chủ dự án có chạy `pnpm media:upload <slug>` rồi `pnpm deploy:prod` không (`docs/operations.md`, "Đưa bài mới lên production"); không chạy khi chưa được đồng ý.

## Bài ôn tập chương (`kind: "review"`)

Dùng cho phần "Ôn tập chương" của sách. Bài này chép nguyên văn đề các bài tập của sách; đó là ngoại lệ duy nhất của luật "không chép" (ngoài `passage`).

- `kind: "review"`, không có `number`, có `chapter`. `order` = số của bài cuối chương + 0,5 (bài cuối là Bài 12 thì `order` là 12.5), để bài đứng giữa bài cuối chương và bài đầu chương sau.
- Mỗi bài tập của sách thành các câu trong `exercises`, chia theo từng ý a), b)... Câu nào lấy từ sách có `bookRef` (vd "SBT 2.58") và đề chép đúng lời, đúng số, đúng các lựa chọn của sách. Lời sách đặt trong khối `note` hay `formula` riêng; câu lệnh cho app ("Chọn đáp án đúng.") là khối `note` riêng ở cuối đề. Đáp án lấy từ trang lời giải của sách.
- Chỉ đề được chép. Các bước, phần nhắc lại, `explain`, gợi ý và mẹo vẫn viết bằng lời của mình, như mọi bài khác. Luật máy: `[textbook-copy]` bỏ qua bài này, `[length]` không áp cho chữ trong đề của câu có `bookRef`, các luật khác vẫn áp; `bookRef` ở bài không phải ôn tập là lỗi `[book-ref]`.
- Mẫu cho mỗi bài tập của sách, một section:
  1. Các màn "Nhắc lại Bài X": quy tắc kèm ví dụ, lời của mình.
  2. Các bước dẫn (`checkIds`): câu tự chứa đủ đề, từ dễ đến khó, không có `bookRef`. Các bước mang thẻ (card) của section để phiên ôn hỏi lại được.
  3. Các ý của bài sách đặt cuối: mọi ý trừ ý cuối nằm trong `checkIds` sau các bước, ý cuối nằm trong `practiceIds`.

## Thêm mẹo cho bài đã xuất bản (`tips.json`)

Bài đã `published` nhận mẹo mà không đụng `lesson.json`, nên không đổi `reviewedHash`, video hay lời đọc của bài. Mẹo nằm ở `content/<môn>/<bộ sách>/<slug>/tips.json`:

```json
{
  "lessonId": "<slug>",
  "status": "draft",
  "tips": [
    {
      "id": "<slug>.tip.<tên>",
      "kind": "làm nhanh",
      "title": "Tên dạng bài",
      "text": "Mẹo nói trong ≤ 3 câu.",
      "tex": "9 \\cdot 7 = 70 - 7 = 63"
    }
  ]
}
```

Mỗi mẹo cùng hình dạng và cùng luật với khối `tip` trong section (mục "Mẹo"); id có dạng `<slug>.tip.<tên>`, không trùng id khối `tip` của bài. Quy trình:

1. Viết `tips.json` với `status: "draft"`, thử từng mẹo trên ≥ 5 số gồm số biên, rồi `pnpm content:check` tới 0 lỗi (`[tips]`: độ dài, luật chữ như mọi chữ của bài, hình có trong registry).
2. Review riêng tệp mẹo bằng `lesson-review` (mục "Review mẹo"), reviewer là subagent mới. Đạt thì `pnpm content:hash <slug> --tips --approve` (ghi `reviewedHash`, đặt `published` cho tệp mẹo; không đổi bài), rồi `pnpm content:lock <slug>` khoá id mẹo.
3. Sửa mẹo sau khi duyệt đổi hash của tệp mẹo, `content:check` báo lỗi tới khi review và `--approve` lại. Bài vẫn giữ nguyên.
4. `pnpm lesson:walk <slug>` đi cả trang "Mẹo hay" của bài.

## Nhiều bài một lúc

Mỗi bài một subagent (Agent tool, `isolation: "worktree"`, `model: "sonnet"`), mở song song trong một lượt gọi.

1. Nhận yêu cầu và nạp nguồn cho mọi bài ở cây chính (`sources/` bị gitignore nên worktree không có).
2. Prompt mỗi subagent: slug, môn, bộ sách, `order`, kế hoạch đã chốt, đường dẫn tuyệt đối tới `sources/<môn>/<slug>/` ở cây chính (chép vào worktree của nó), một `TEST_PORT` riêng (3101, 3102…) để walk không dùng chung server với bài khác, và "đọc `.claude/skills/lesson-author/SKILL.md`, chạy `pnpm install`, làm bước 1–11, commit trên nhánh của mình; không review, không `content:lock`". Bài Ngữ văn: subagent dừng sau bước 2 và trả về `source-passage.txt` cùng các dòng lệch; phiên chính xin duyệt rồi gọi tiếp subagent đó bằng SendMessage.
3. Xong hết: merge lần lượt từng nhánh vào nhánh hiện tại. Xung đột ở `content/ids.lock.json`, `content/glossary/*.json`, `src/visuals/registry.ts` thì giữ mục của cả hai phía. Sau mỗi merge: `pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm content:check`.
4. Từng bài làm tiếp bước 12–16 ở cây chính.
