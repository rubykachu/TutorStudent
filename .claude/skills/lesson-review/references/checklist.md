# Checklist review bài học

Bốn trục, soát lần lượt trên từng section, card và exercise (cả `steps` của `openEnded`, đáp án nhiễu, mục `order`/`match`, `recap`, `caption`). Mỗi mục ghi mức lỗi khi không đạt. Không soát lại những gì `content:check` đã kiểm (ký hiệu, phân cách hàng nghìn, thuật ngữ cấm, tiếng Anh, độ dài câu, đáp án tính lại từ `check.expr`, văn bản đọc hiểu khớp `source-passage.txt`).

## 1. Khớp nguồn

**Kiến thức nằm trong trang `sourceRef` và trong chương trình lớp 6.** Nội dung vượt phạm vi, dù chỉ ở một đáp án nhiễu hay một mục cần sắp xếp: Nghiêm trọng.
- Không đạt: `2^{-1}` hay "số mũ âm" trong bài Luỹ thừa với số mũ tự nhiên (lớp 6 chỉ học số mũ tự nhiên); phân số trong bài chưa học phân số; biện pháp tu từ hoán dụ khi bài chỉ dạy so sánh.
- Đạt: quy ước `a^0 = 1` (với `a ≠ 0`) khi trang nguồn có quy ước đó.

**Không có trong sách.** Kiến thức, ví dụ hay thuật ngữ mà trang nguồn không có và không suy ra trực tiếp được: Nghiêm trọng.

**Biên soạn lại, không chép.** Câu chữ trùng nguyên văn định nghĩa, ví dụ hay bài tập SGK (trừ khối `passage`): Nghiêm trọng.

**`sourceRef` trỏ đúng trang** có nội dung đó: sai trang là Nên sửa.

## 2. Đúng kiến thức

**Mỗi câu hỏi có đúng một đáp án đúng** (hoặc đúng một tập đáp án khi `multiple: true`). Tự giải trước khi đọc `answer`. Đáp án sai, hai lựa chọn cùng đúng, hoặc không lựa chọn nào đúng: Nghiêm trọng. `fillBlank` thiếu một cách viết đúng khác trong `accept`: Nên sửa.

**Câu đọc hiểu có căn cứ trong văn bản.** Mỗi đáp án đọc hiểu phải chỉ ra được câu làm căn cứ (id câu trong `passage`, của đề bài hoặc của section đứng trước). Không có câu nào làm căn cứ: Nghiêm trọng, kể cả khi đáp án nghe hợp lý.
- Không đạt: hỏi "Vì sao bạn nhỏ khóc?", đáp án "Vì bạn làm mất đồ chơi", trong khi văn bản chỉ tả bạn nhỏ khóc mà không nêu lý do.
- Đạt: hỏi "Bạn nhỏ đã làm gì khi thấy chú chim bị thương?", đáp án "Mang chim về băng cánh", căn cứ câu kể việc đó.
- Câu suy luận (cảm xúc, tính cách nhân vật) đạt khi văn bản có chi tiết dẫn tới kết luận; ghi chi tiết đó vào review.

**Công thức, `recap`, `caption`, chú thích đúng.** Sai toán học hay sai sự thật: Nghiêm trọng. Ví dụ không đạt: recap `2^3 = 6`.

**Rubric `openEnded` làm được ở lớp 6** và khớp đề: yêu cầu quá sức hoặc lệch đề là Nên sửa.

## 3. Ngôn từ lớp 6

**Không phủ định kép**: Nghiêm trọng. Trẻ 11 tuổi dễ hiểu ngược.
- Không đạt: "Chạm vào hình không phải là không tròn.", "Câu nào không sai?", "Không có bạn nào chưa làm bài."
- Đạt: "Chạm vào hình tròn.", "Câu nào đúng?"

**Không đánh đố.** Đáp án đúng dựa vào mẹo chữ, chi tiết gài bẫy hoặc cách đọc lắt léo: Nghiêm trọng.

**Đáp án nhiễu hợp lý.** Nhiễu nên phản ánh lỗi hay gặp, như `2^3` ra 6 do nhân cơ số với số mũ. Nhiễu vô lý đến mức không ai chọn: Nên sửa. Nhiễu chỉ khác đáp án ở một dấu hay một chữ khó thấy: Nghiêm trọng (bẫy).

**Đề nói rõ trẻ phải làm gì**, và ghi "chọn tất cả" khi `multiple: true`. Đề mơ hồ: Nên sửa.

**Từ Hán Việt khó** như "tương ứng", "hiển nhiên": chỉ Góp ý, kèm từ thay thế. Thuật ngữ trong SGK và glossary (`content/glossary/<subject>.json`) như "thừa số", "cơ số" là chuẩn, không ghi.

## 4. Nhất quán

**Gợi ý nấc 1 không lộ đáp án**: Nghiêm trọng. Lần sai đầu, phần được `hints.highlight` trỏ tới sáng lên, không kèm chữ. Lộ đáp án khi highlight trỏ vào chính đáp án:
- `choice`: `target: "option"` với id nằm trong `answer`;
- `tapText` / `tapRegion`: câu hay vùng nằm trong `answer`;
- `match` / `order`: làm lộ cặp hay vị trí đúng.
- Đạt: trỏ vào cơ số và số mũ trong đề (`target: "part"`), hay vào ô `base` / `exponent` của câu `numeric` (ô trống, không lộ giá trị).
`hintVisualId` (nấc 2) chỉ tách bài toán, không chiếu kết quả cuối; kết quả thuộc `solutionVisualId` (nấc 3). Nấc 2 lộ kết quả: Nghiêm trọng.

**Gợi ý khớp chỗ trẻ có thể sai.** Highlight trỏ vào phần không liên quan tới lỗi hay gặp, hoặc rỗng ở câu dễ sai: Nên sửa.

**Một khái niệm, một từ, một màu** trong bài và giữa các bài. Cùng khái niệm mà gọi hai tên, hoặc `conceptId` của highlight không khớp phần được tô (tô số mũ bằng màu cơ số): Nên sửa.

**`recap` khớp card hay section** mà nó tóm tắt: lệch là Nên sửa.
