# Checklist review bài học

Năm trục, soát lần lượt trên từng section, card và exercise (cả `steps` của `openEnded`, đáp án nhiễu, mục `order`/`match`, `recap`, `caption`). Mỗi mục có ghi sẵn mức lỗi khi không đạt. Không soát lại những gì `content:check` đã kiểm (`docs/spec.md`, mục "Kiểm duyệt nội dung", phần "Lớp tự động").

## 1. Khớp nguồn

**Kiến thức nằm trong trang `sourceRef` và trong chương trình lớp 6.** Nội dung vượt phạm vi, dù chỉ ở một đáp án nhiễu hay một mục cần sắp xếp: Nghiêm trọng.
- Không đạt: `2^{-1}` hay "số mũ âm" trong bài Luỹ thừa với số mũ tự nhiên (lớp 6 chỉ học số mũ tự nhiên); phân số trong bài chưa học phân số; biện pháp tu từ hoán dụ khi bài chỉ dạy so sánh.
- Đạt: quy ước `a^0 = 1` (với `a ≠ 0`) khi trang nguồn có quy ước đó.

**Không có trong sách.** Kiến thức, ví dụ hay thuật ngữ mà trang nguồn không có và không suy ra trực tiếp được: Nghiêm trọng.
- Ngoại lệ hẹp: thuật ngữ học từ lớp dưới được dạy khi glossary ghi `prerequisite` cho nó (`content/glossary/<subject>.json`), `sourceRef` của section, card ghi "Kiến thức nền (<cấp>)", và câu định nghĩa là câu chuẩn, gọn như sách lớp 6. Soát định nghĩa và ví dụ theo trục 2; ví dụ có thể xếp vào cả hai loại (như từ ghép có hai tiếng cùng âm đầu): Nghiêm trọng.

**Biên soạn lại, không chép.** Câu chữ trùng nguyên văn định nghĩa, ví dụ hay bài tập SGK (trừ khối `passage`): Nghiêm trọng.

**`sourceRef` trỏ đúng trang** có nội dung đó: sai trang là Nên sửa.

## 2. Đúng kiến thức

**Mỗi câu hỏi có đúng một đáp án đúng** (hoặc đúng một tập đáp án khi `multiple: true`). Đáp án sai, hai lựa chọn cùng đúng, hoặc không lựa chọn nào đúng: Nghiêm trọng. `fillBlank` thiếu một cách viết đúng khác trong `accept`: Nên sửa.

**Câu đọc hiểu có căn cứ trong văn bản.** Mỗi đáp án đọc hiểu phải chỉ ra được câu làm căn cứ (id câu trong `passage`, của đề bài hoặc của section đứng trước). Không có câu nào làm căn cứ: Nghiêm trọng, kể cả khi đáp án nghe hợp lý.
- Không đạt: hỏi "Vì sao bạn nhỏ khóc?", đáp án "Vì bạn làm mất đồ chơi", trong khi văn bản chỉ tả bạn nhỏ khóc mà không nêu lý do.
- Đạt: hỏi "Bạn nhỏ đã làm gì khi thấy chú chim bị thương?", đáp án "Mang chim về băng cánh", căn cứ câu kể việc đó.
- Câu suy luận (cảm xúc, tính cách nhân vật) đạt khi văn bản có chi tiết dẫn tới kết luận; ghi chi tiết đó vào review.

**Công thức, `recap`, `caption`, `overview`, chú thích đúng.** Sai toán học hay sai sự thật, tóm tắt truyện sai văn bản: Nghiêm trọng. Ví dụ không đạt: recap `2^3 = 6`.

**Rubric `openEnded` làm được ở lớp 6** và khớp đề: yêu cầu quá sức hoặc lệch đề là Nên sửa.

**Lời video khớp bài.** Bài có `videos`: đọc kịch bản `video/projects/<id bài>/<tên video>/script.json` (tên video là phần cuối của id video). Câu đánh `rule`, `quote` đã được `video:build` so nguyên văn với bài và `source-passage.txt`; chỉ soát câu nêu quy tắc hay trích văn bản mà thiếu dấu đó (Nghiêm trọng), lời dẫn, chuyển cảnh và số: câu nói sai kiến thức hay sai văn bản là Nghiêm trọng. Clip (`videos[].clips`) gắn vào card mà đoạn đó không giảng: Nên sửa.

## 3. Ngôn từ lớp 6

**Không phủ định kép**: Nghiêm trọng. Trẻ 11 tuổi dễ hiểu ngược.
- Không đạt: "Chạm vào hình không phải là không tròn.", "Câu nào không sai?", "Không có bạn nào chưa làm bài."
- Đạt: "Chạm vào hình tròn.", "Câu nào đúng?"

**Không đánh đố.** Đáp án đúng dựa vào mẹo chữ, chi tiết gài bẫy hoặc cách đọc lắt léo: Nghiêm trọng.

**Đáp án nhiễu hợp lý.** Nhiễu nên phản ánh lỗi hay gặp, như `2^3` ra 6 do nhân cơ số với số mũ. Nhiễu vô lý đến mức không ai chọn: Nên sửa. Nhiễu chỉ khác đáp án ở một dấu hay một chữ khó thấy: Nghiêm trọng (bẫy).

**Đề nói rõ trẻ phải làm gì**, và ghi "chọn tất cả" khi `multiple: true`. Đề mơ hồ: Nên sửa.

**Từ Hán Việt khó** như "tương ứng", "hiển nhiên": chỉ Góp ý, kèm từ thay thế. Thuật ngữ trong SGK và glossary (`content/glossary/<subject>.json`) như "thừa số", "cơ số" là chuẩn, không ghi.

## 4. Nhất quán

**Gợi ý theo "Luật gợi ý 3 nấc"** dưới đây.

**Gợi ý khớp chỗ trẻ có thể sai.** Highlight trỏ vào phần không liên quan tới lỗi hay gặp, hoặc rỗng ở câu dễ sai mà không có `hintVisualId`: Nên sửa.

**Một khái niệm, một từ, một màu** trong bài và giữa các bài. Cùng khái niệm mà gọi hai tên, hoặc `conceptId` của highlight không khớp phần được tô (tô số mũ bằng màu cơ số): Nên sửa.

**`recap` khớp card hay section** mà nó tóm tắt: lệch là Nên sửa.

## 5. Trải nghiệm trên màn

Soát trên ảnh của `pnpm lesson:walk`, không chỉ trên JSON; chữ nằm trong visual (màn quy tắc, recap) chỉ thấy ở đây nên soát theo cả bốn trục trên.

**Mỗi dòng FAIL của walk** do nội dung bài: Nghiêm trọng (trẻ không làm được bài), ghi kèm tên ảnh. FAIL do bố cục của app: Góp ý để báo người làm app, không chặn bài.

**Quy tắc đọc được và nhớ được.** Định nghĩa hay quy tắc chỉ nằm trong `caption` xám: Nghiêm trọng (trẻ nhớ sai hoặc bỏ qua).

**Section ngắn, một ý.** `content:check` đã chặn section quá 4 màn hay quá 4 bài tập. Section gộp hai quy tắc cần nhớ riêng (recap phải có hai câu mới đủ), hay `minutes` lệch xa số màn nhân khoảng 40 giây: Nên sửa.

**Người học chậm theo kịp.** Vi phạm một luật trong mục "Sư phạm cho người học chậm" của `.claude/skills/lesson-author/SKILL.md` mà `content:check` không kiểm (ví dụ mẫu trước câu tự làm, dạy thao tác nhập trước lần dùng đầu, câu chuyện có kết, số nhỏ, `overview` đúng luật, section Toán hay Địa lí thiếu ví dụ đời sống): Nên sửa.

**Video xem được.** Walk báo FAIL ở màn video (thiếu tệp, nút phát nhỏ, không có phụ đề): Nghiêm trọng. Cảnh báo "video did not play here" trên máy không giải mã được H.264 (Chromium của walk): bỏ qua.

**Chữ và số rõ.** Chữ hay số dưới 16px (walk ghi cảnh báo), hình từng bước để hàng trống thay vì hàng "?" mờ: Nên sửa.

## Luật gợi ý 3 nấc

Luật cố định. Không ghi phát hiện trái với luật này, kể cả khi vòng review trước đã ghi.

**Nấc 1, `hints.highlight`** (lần sai đầu, sáng lên, không kèm chữ).
- Được: phần của đề mà trẻ cần nhìn lại, qua `target: "part"` (`\htmlId` trong công thức, câu trong `passage`) hoặc `target: "block"`.
- Nghiêm trọng khi highlight lộ đáp án: `option` có id nằm trong `answer`; câu hay vùng nằm trong `answer` của `tapText`/`tapRegion`; mục của `match`/`order` (lộ cặp hay vị trí); `conceptId` tô màu lên phần mà câu hỏi bắt trẻ gọi tên.
- Nên sửa: `target: "option"` trỏ vào vùng trả lời. Khung đã tô cam ô làm sai, highlight cùng chỗ khiến ô đúng trông như sai; chuyển sang phần tương ứng trong đề.
- `highlight: []` được khi câu có `hintVisualId`.

**Nấc 2, `hintVisualId`**: tách bài toán rồi dừng ở "?" trước kết quả của đề. Ví dụ giải trọn vẹn chỉ được dùng số khác đề. Nghiêm trọng khi hình hiện kết quả của đề, hoặc khi câu "gọi tên phần" dùng hình có nhãn tên phần (hình đó chính là đáp án).

**Nấc 3, `solutionVisualId`**: được chạy trọn lời giải với số của đề. Không có hình thì khung tự hiện đáp án.

Ví dụ từ bài `luy-thua`:
- `chon-tich-5-mu-4` (5⁴ bằng tích nào): đạt khi nấc 1 tô `co-so` và `so-mu` trong đề bằng màu khái niệm; lộ đáp án nếu tô lựa chọn `5 · 5 · 5 · 5`.
- `dien-ten` (điền "cơ số", "số mũ" cho 8³): đạt khi nấc 1 tô 8 và 3 trong đề, không `conceptId`; lộ đáp án nếu tô bằng màu xanh, tím, hoặc nếu nấc 2 là hình có nhãn "Cơ số", "Số mũ".
- `xep-gia-tri` (xếp 2³, 3², 4², 5² từ bé đến lớn): đạt khi nấc 1 trống và nấc 2 `phan-tich-xep-gia-tri` viết mỗi luỹ thừa thành tích, không ghi giá trị, không theo thứ tự đúng; lộ vị trí nếu nấc 1 tô cặp 2³ và 3².
- `tinh-3-mu-3` (tính 3³): nấc 2 làm 3 · 3 = 9 rồi dừng ở 9 · 3 = ?; hiện 27 là lộ kết quả. `mu-0-bang` (5⁰ bằng bao nhiêu): nấc 2 dùng số khác đề, 2³ : 2³, và dừng ở 8 : 8 = ?.

## Không bắt lỗi

Quy ước đã chốt. Không ghi thành phát hiện ở bất kỳ mức nào:
- Thứ tự lựa chọn `choice`, cột phải `match`, ngân hàng từ `fillBlank`, mục `order` trong JSON: app xáo mỗi lần làm.
- Câu kiểm tra (`checkIds`) không gắn card.
- Thiếu `hintVisualId` hay `solutionVisualId` (khung có cách hiện thay).
- Nấc 1 tô cả câu đề (`target: "block"`) khi đề chỉ có một câu chữ.
- Các cách viết trong `.claude/skills/lesson-author/references/pitfalls.md` (công thức xếp `gathered`, không chữ Việt trong TeX, phần trẻ phải chạm hay gọi tên không mang màu khái niệm).
- Mục Góp ý và Nên sửa đã ghi trong `backlogs/lesson-<id bài>.md`.
