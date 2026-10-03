# Checklist review bài học

Năm trục, soát lần lượt trên từng section, card và exercise (cả `steps` của `openEnded`, đáp án nhiễu, mục `order`/`match`, `recap`, `caption`). Mỗi mục có ghi sẵn mức lỗi khi không đạt. Không soát lại những gì `content:check` đã kiểm (`docs/spec.md`, mục "Kiểm duyệt nội dung", phần "Lớp tự động").

## 1. Khớp nguồn

**Kiến thức nằm trong trang `sourceRef` và trong chương trình lớp 6.** Nội dung vượt phạm vi, dù chỉ ở một đáp án nhiễu hay một mục cần sắp xếp: Nghiêm trọng.
- Không đạt: `2^{-1}` hay "số mũ âm" trong bài Luỹ thừa với số mũ tự nhiên (lớp 6 chỉ học số mũ tự nhiên); phân số trong bài chưa học phân số; biện pháp tu từ hoán dụ khi bài chỉ dạy so sánh.
- Đạt: quy ước `a^0 = 1` (với `a ≠ 0`) khi trang nguồn có quy ước đó.

**Không có trong sách.** Kiến thức, ví dụ hay thuật ngữ mà trang nguồn không có và không suy ra trực tiếp được: Nghiêm trọng.
- Ngoại lệ hẹp: thuật ngữ học từ lớp dưới được dạy khi glossary ghi `prerequisite` cho nó (`content/glossary/<subject>.json`), `sourceRef` của section, card ghi "Kiến thức nền (<cấp>)", và câu định nghĩa là câu chuẩn, gọn như sách lớp 6. Soát định nghĩa và ví dụ theo trục 2; ví dụ có thể xếp vào cả hai loại (như từ ghép có hai tiếng cùng âm đầu): Nghiêm trọng.

**Biên soạn lại, không chép.** Câu chữ trùng nguyên văn định nghĩa, ví dụ hay bài tập SGK (trừ khối `passage`): Nghiêm trọng.

**Bài ôn tập (`kind: "review"`).** Thay cho "Biên soạn lại, không chép": đối chiếu từng câu có `bookRef` với ảnh nguồn. Lời đề, số và các lựa chọn phải y hệt sách (chỉ được khác dấu ";" hay "." cuối lựa chọn và nhãn ý a), b)); một câu lệnh của app như "Chọn đáp án đúng." được phép, đặt thành khối riêng ở cuối đề. Đáp án phải bằng lời giải ở trang đáp án của sách. Đề khác sách: Nghiêm trọng. Giải thích, phần nhắc lại, gợi ý, mẹo vẫn phải là lời của bài: chép chúng là Nghiêm trọng như ở bài thường.

**Phần bài tập sách bài tập (section có `"bookPractice": true`).** Phần cuối của bài thường chép đủ bài tập SBT của bài, vì chúng xuất hiện trong bài kiểm tra; mọi câu sách trong `checkIds` và `practiceIds` của nó có `bookRef`, xen các câu dẫn (có `leadsTo`, không `bookRef`). Thay cho "Biên soạn lại, không chép" ở các câu đó, soát ba việc, mỗi việc mở ảnh `sources/<môn>/<slug>/sbt-pNN.png` (đúng trang của `bookRef`; thiếu ảnh là Nghiêm trọng "thiếu nguồn"), không tin lớp chữ `.txt` thay ảnh:
- **Đủ bài tập.** Lập danh sách mọi bài tập và ý a), b)... của bài trên các trang SBT; đối chiếu với dòng "book exercises" của `content:check --stats`. Bài là một phần (`part`) của bài sách đã tách: danh sách của bài con là các bài tập cần nội dung của nó (bài tập cần nhiều bài con thuộc bài con cuối), ghi ở `task.md` của bài; hợp các bài con phải đủ danh sách SBT, mỗi bài tập một lần (dòng "split into" của `--stats`). Thiếu một bài tập hay một ý, hoặc có câu mang `bookRef` mà sách không có: Nghiêm trọng.
- **Đề y hệt sách.** So từng chữ, số, đơn vị, dấu câu, thứ tự và từng lựa chọn của mỗi câu với ảnh. Đọc liền các khối `note`, `formula` của đề như một đoạn (dấu kết câu sau công thức dễ rơi). Chỉ được khác nhãn ý a), b), dấu ";" hay "." cuối lựa chọn, và câu lệnh của app ("Chọn đáp án đúng.") ở khối riêng cuối đề. Đề khác sách dù một số hay một dấu: Nghiêm trọng. Nghi sách in sai thì ghi vào "Nên sửa" kèm trang để chủ dự án quyết; không đòi sửa đề.
- **Đáp án khớp trang lời giải.** Tìm lời giải của từng bài tập ở trang đáp án SBT, so với `answer` (và `check.expr`) của câu; không tự giải rồi coi là đủ. Lệch lời giải của sách: Nghiêm trọng. Sách không có lời giải cho ý đó: ghi "Nên sửa" và tự giải kỹ.
- **Câu dẫn (`leadsTo`).** Không phải đề sách nên không so với trang sách mà soát như câu bài thường: tự chứa đủ đề, từ dễ đến khó, cùng kỹ năng với câu sách kế tiếp, không dùng đúng số hay lời đề của câu sách đó (lộ đáp án: Nghiêm trọng), không chép lời sách. Câu dẫn lệch kỹ năng hay không giúp làm được câu sách: Nên sửa.
- Mọi thứ ngoài đề vẫn là lời của bài và chịu mọi luật như bài thường: `explain` (kèm `wrong`), 3 nấc `hints`, khối "Nhắc lại", recap, mẹo. Chép lời giải hay cách trình bày của sách vào đó: Nghiêm trọng. Hướng dẫn từng bước cho mỗi bài tập phải có (câu dẫn, hoặc nấc 3 của gợi ý và `explain` nêu từng bước với số của câu) và đúng.

**`sourceRef` trỏ đúng trang** có nội dung đó: sai trang là Nên sửa.

## 2. Đúng kiến thức

**Mỗi câu hỏi có đúng một đáp án đúng** (hoặc đúng một tập đáp án khi `multiple: true`). Đáp án sai, hai lựa chọn cùng đúng, hoặc không lựa chọn nào đúng: Nghiêm trọng. `fillBlank` thiếu một cách viết đúng khác trong `accept`: Nên sửa.

**Câu đọc hiểu có căn cứ trong văn bản.** Mỗi đáp án đọc hiểu phải chỉ ra được câu làm căn cứ (id câu trong `passage`, của đề bài hoặc của section đứng trước). Không có câu nào làm căn cứ: Nghiêm trọng, kể cả khi đáp án nghe hợp lý.
- Không đạt: hỏi "Vì sao bạn nhỏ khóc?", đáp án "Vì bạn làm mất đồ chơi", trong khi văn bản chỉ tả bạn nhỏ khóc mà không nêu lý do.
- Đạt: hỏi "Bạn nhỏ đã làm gì khi thấy chú chim bị thương?", đáp án "Mang chim về băng cánh", căn cứ câu kể việc đó.
- Câu suy luận (cảm xúc, tính cách nhân vật) đạt khi văn bản có chi tiết dẫn tới kết luận; ghi chi tiết đó vào review.

**Công thức, `recap`, `caption`, `overview`, chú thích đúng.** Sai toán học hay sai sự thật, tóm tắt truyện sai văn bản: Nghiêm trọng. Ví dụ không đạt: recap `2^3 = 6`.

**Rubric `openEnded` làm được ở lớp 6** và khớp đề: yêu cầu quá sức hoặc lệch đề là Nên sửa.

**Giải thích (`explain`) đúng và giải thích được.** Đọc `explain` của mọi câu như bé: thấy vì sao đáp án đúng chưa, và làm được câu tương tự chưa. Giải thích nói sai kiến thức, hay một lý do trong `wrong` nói sai (vd bảo phương án đúng là sai): Nghiêm trọng. Chỉ lặp lại đáp án ("Đáp án là 18") hay chỉ phán đúng sai mà không nêu lý do: Nên sửa. Dài hơn 3 câu hay dùng từ chưa học: Nên sửa. Câu có phương án nhiễu hay bị chọn nhầm mà `explain` không có `wrong` cho nó (khi lý do đáng nói): Góp ý. Câu thiếu `explain` ở bài mới: `content:check` đã báo lỗi, không ghi lại.

**Mẹo (`tip`, và `tips.json`) đúng với mọi đầu vào.** Với mỗi mẹo, tự thử trên ít nhất 5 đầu vào khác nhau của dạng bài đó, gồm số biên (0, 1, số tròn chục, số một chữ số, số chẵn và lẻ, số lớn nhất bài dùng) và ghi các số đã thử vào review. Mẹo cho kết quả sai ở một đầu vào thuộc dạng bài (không nói điều kiện trong `text`), hoặc mẹo suy ra điều sai (vd "số có chữ số tận cùng chẵn thì chia hết cho 4"): Nghiêm trọng. Mẹo dùng kiến thức chưa học ở lớp 6 hay chưa dạy trong bài: Nghiêm trọng (trục 1). Mẹo đúng nhưng `kind` sai nhãn (mẹo tránh sai gắn "làm nhanh"), `title` không nêu dạng bài, hay không có ví dụ tính (`tex`) khi mẹo cần ví dụ: Nên sửa.

**Lời video khớp bài.** Bài có `videos`: đọc kịch bản `video/projects/<id bài>/<tên video>/script.json` (tên video là phần cuối của id video). Câu đánh `rule`, `quote` đã được `video:build` so nguyên văn với bài và `source-passage.txt`; chỉ soát câu nêu quy tắc hay trích văn bản mà thiếu dấu đó (Nghiêm trọng), lời dẫn, chuyển cảnh và số: câu nói sai kiến thức hay sai văn bản là Nghiêm trọng. Clip (`videos[].clips`) gắn vào card mà đoạn đó không giảng: Nên sửa.

## 3. Ngôn từ lớp 6

**Không phủ định kép**: Nghiêm trọng. Trẻ 11 tuổi dễ hiểu ngược.
- Không đạt: "Chạm vào hình không phải là không tròn.", "Câu nào không sai?", "Không có bạn nào chưa làm bài."
- Đạt: "Chạm vào hình tròn.", "Câu nào đúng?"

**Tổng quan nối bài với đời sống.** `overview.hook` mở bằng tình huống cụ thể, và `overview.whyItMatters` (một câu) nêu một tình huống đời sống mà kiến thức này có mặt cùng việc nó giúp làm được (vd "Bạn dùng phép nhân khi đi chợ để biết ba gói kẹo giá bốn nghìn hết bao nhiêu tiền."). Câu chung chung ("giúp bạn học tốt các bài sau", "rất quan trọng"), tình huống bé không gặp hay không dùng kiến thức bài này: Nên sửa. Tình huống sai sự thật hay dạy bé hiểu sai: Nghiêm trọng (trục 2). Lint chỉ kiểm overview có mặt, đủ trường và ngắn.

**Không đánh đố.** Đáp án đúng dựa vào mẹo chữ, chi tiết gài bẫy hoặc cách đọc lắt léo: Nghiêm trọng.

**Đáp án nhiễu hợp lý.** Nhiễu nên phản ánh lỗi hay gặp, như `2^3` ra 6 do nhân cơ số với số mũ. Nhiễu vô lý đến mức không ai chọn: Nên sửa. Nhiễu chỉ khác đáp án ở một dấu hay một chữ khó thấy: Nghiêm trọng (bẫy).

**Đề nói rõ trẻ phải làm gì**, và ghi "chọn tất cả" khi `multiple: true`. Đề mơ hồ: Nên sửa.

**Không cắt chữ bằng "…".** Chữ nào của bài (note, đề, lựa chọn, caption, nhãn visual) kết thúc bằng "…" mà không phải trích nguyên văn `passage`: Nên sửa.

**Từ Hán Việt khó** như "tương ứng", "hiển nhiên": chỉ Góp ý, kèm từ thay thế. Thuật ngữ trong SGK và glossary (`content/glossary/<subject>.json`) như "thừa số", "cơ số" là chuẩn, không ghi.

## 4. Nhất quán

**Gợi ý theo "Luật gợi ý 3 nấc"** dưới đây.

**Gợi ý khớp chỗ trẻ có thể sai.** Highlight trỏ vào phần không liên quan tới lỗi hay gặp, hoặc rỗng ở câu dễ sai mà không có `hintVisualId`: Nên sửa.

**Một khái niệm, một từ, một màu** trong bài và giữa các bài. Cùng khái niệm mà gọi hai tên, hoặc `conceptId` của highlight không khớp phần được tô (tô số mũ bằng màu cơ số): Nên sửa.

**`recap` khớp card hay section** mà nó tóm tắt: lệch là Nên sửa.

## 5. Trải nghiệm trên màn

Soát trên contact sheet của `pnpm lesson:walk` (mỗi ô một ảnh, in tên ảnh; mở riêng một ảnh chỉ khi cần phóng to), không chỉ trên JSON; chữ nằm trong visual (màn quy tắc, recap) chỉ thấy ở đây nên soát theo cả bốn trục trên.

**Mỗi dòng FAIL của walk** do nội dung bài: Nghiêm trọng (trẻ không làm được bài), ghi kèm tên ảnh. FAIL do bố cục của app: Góp ý để báo người làm app, không chặn bài.

**Quy tắc đọc được và nhớ được.** Định nghĩa hay quy tắc chỉ nằm trong `caption` xám: Nghiêm trọng (trẻ nhớ sai hoặc bỏ qua).

**Section ngắn, một ý.** `content:check` đã chặn section quá 4 màn hay quá 4 bài tập. Section gộp hai quy tắc cần nhớ riêng (recap phải có hai câu mới đủ), hay `minutes` lệch xa số màn nhân khoảng 40 giây: Nên sửa.

**Người học chậm theo kịp.** Vi phạm một luật trong mục "Sư phạm cho người học chậm" của `.claude/skills/lesson-author/SKILL.md` mà `content:check` không kiểm (ví dụ mẫu trước câu tự làm, dạy thao tác nhập trước lần dùng đầu, câu chuyện có kết, số nhỏ, `overview` đúng luật, section Toán hay Địa lí thiếu ví dụ đời sống): Nên sửa.

**Mẹo có mặt khi dạng bài có mẹo thật, không gượng.** Dạng bài có mẹo làm nhanh, hiểu nhanh hay tránh sai rõ ràng, đúng và hợp lớp 6 (nhân với 9, 11; chia hết cho 2, 3, 5, 9; kiểm phép chia bằng phép nhân…) mà bài không có `tip`: Nên sửa. Mẹo gượng (chỉ nhắc lại quy tắc bằng chữ khác, mẹo cho dạng bài không có mẹo, nhiều mẹo cho một ý): Nên sửa. Mẹo đặt trước khi dạy cách làm bình thường: Nên sửa.

**Nhịp video cho bé chậm** (video mới, không nằm trong `video/pacing-exempt.json`; `video:check` đã kiểm số câu, độ dài câu, cờ `pause`): đọc kịch bản như bé. Mỗi câu một ý; câu hỏi "Bạn thử đoán xem…" có thật sự hỏi điều bé đoán được trước khi hình hiện kết quả (hình không hiện đáp án trước lúc đọc xong quãng dừng, đối chiếu `index.html`); quãng dừng nghĩ đặt sau điều quan trọng chứ không rải đều. Hình hiện đáp án trước khi hỏi: Nên sửa. Video dồn nhiều ý đến mức bé chậm không theo kịp: Nên sửa.

**Video xem được.** Walk báo FAIL ở màn video (thiếu tệp, nút phát nhỏ, không có phụ đề): Nghiêm trọng. Cảnh báo "video did not play here" trên máy không giải mã được H.264 (Chromium của walk): bỏ qua.

**Màn tương tác nói rõ làm gì và để làm gì.** Thiếu dòng việc phải làm hay dòng lý do ở đầu màn (hướng dẫn chỉ nằm ở `caption` xám nhỏ), hoặc visual không hiện tiến độ và không có lời kết khi làm xong: Nên sửa.

**Có câu chọn nhiều đáp án.** Bài có dưới 2 câu `multiple: true` dù có chỗ tự nhiên để hỏi nhiều đáp án: Nên sửa.

**Đã xem sheet walk mọi màn, cả điện thoại lẫn iPad.** Chữ chồng nhau, bị cắt, cột hẹp hay hình nhỏ lọt thỏm: Nghiêm trọng nếu do nội dung bài, Góp ý nếu do bố cục app.

**Chữ và số rõ.** Chữ hay số dưới 16px (walk ghi cảnh báo), hình từng bước để hàng trống thay vì hàng "?" mờ: Nên sửa.

## Lỗi hay lặp

Các kiểu lỗi đã gặp ở nhiều bài, kèm ví dụ thật: `docs/lessons-learned/index.md`. Soát kỹ phần máy chưa bắt của từng mục (cột "Nơi chặn"); mức lỗi vẫn theo các trục ở trên.

- Nhiễu cũng đúng ở câu không có `check` (Ngữ văn, thuộc tập hợp, thứ tự khác của `order`/`fillBlank`): LL-01.
- Nấc 2, chú thích lề, chữ trong `segments` lộ kết quả: LL-02. Màu trong hình và video phân biệt đáp án: LL-03.
- Câu ôn trùng số recap, ví dụ màn quy tắc, trạng thái đầu của hình: LL-07.
- Kiến thức chưa dạy (kể cả câu kho ôn gắn card của section sau): LL-09. Đề hai cách hiểu: LL-10. Nhiễu loại được bằng mẹo: LL-14.
- Hình lệch chữ hay lệch số của đề: LL-15. Thiếu mẫu, cùng làm, ví dụ đời sống: LL-16. Câu quá nhiều phép tính: LL-18.
- `explain` và `wrong` của câu `choice` gọi lựa chọn theo vị trí ("hai tổng đầu", "dãy thứ ba") mà app xáo thứ tự: LL-26.

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
- Câu dài hơn giới hạn trong đề của câu có `bookRef` ở bài ôn tập hay ở section `bookPractice` (lời sách không rút gọn được).
- Thứ tự lựa chọn `choice`, cột phải `match`, ngân hàng từ `fillBlank`, mục `order` trong JSON: app xáo mỗi lần làm.
- Câu kiểm tra (`checkIds`) không gắn card.
- Thiếu `hintVisualId` hay `solutionVisualId` (khung có cách hiện thay).
- Nấc 1 tô cả câu đề (`target: "block"`) khi đề chỉ có một câu chữ.
- Các cách viết trong `.claude/skills/lesson-author/references/pitfalls.md` (công thức xếp `gathered`, không chữ Việt trong TeX, phần trẻ phải chạm hay gọi tên không mang màu khái niệm).
- Mục Góp ý và Nên sửa đã ghi trong `notebooks/backlogs/lesson-<id bài>/task.md`.
