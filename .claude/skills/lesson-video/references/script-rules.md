# Luật viết kịch bản

Người xem là trẻ lớp 6 học chậm, xem trên iPad, nghe giọng TTS.

- Câu ngắn (video mới: ≤ 12 chữ), một ý một câu, từ quen thuộc; thuật ngữ đúng glossary (`content/glossary/<môn>.json`).
- Câu nêu quy tắc, định nghĩa: chép nguyên văn một `note`/`caption` của bài (hay một câu của nó) và đặt `"rule": true`. Chỉ được khác: `aⁿ` → "a mũ n", dấu ngoặc → dấu phẩy, chữ cái đứng một mình → "số a" (TTS và Whisper hay nuốt chữ cái trơ trọi).
- Câu trích văn bản đọc hiểu đặt `"quote": true`: phần trong ngoặc kép “…” (không có ngoặc thì cả câu) phải nằm nguyên văn trong `source-passage.txt`.
- `pnpm video:build` dừng khi câu `rule`/`quote` lệch bài (`video/lib/verbatim.ts`); `pnpm test` cũng kiểm lại mọi kịch bản đã commit.
- Số viết bằng chữ số hay bằng chữ đều được, đọc tự nhiên ("64", "sáu mươi tư"). Không viết chỉ số trên (`2³`) trong `text`: viết "2 mũ 3".
- Chữ viết tắt (ƯCLN, BCNN, ƯC, BC) cứ viết nguyên trong `text`: giọng tự đọc đủ chữ ("ước chung lớn nhất"), phụ đề giữ chữ viết tắt. Bảng chữ viết tắt duy nhất ở `SPOKEN_ABBREVIATIONS` trong `video/lib/text.ts`; chữ mới thì thêm vào đó, không viết `say` riêng từng câu. `pnpm video:check` cảnh báo (`WARN`) chữ in hoa còn bị đọc rời từng chữ cái, và câu giới thiệu chữ viết tắt ("… viết tắt là BC": muốn giọng đọc tên chữ cái thì thêm `say` "bê-xê").
- `text` là phụ đề hiện đúng như viết. Khi giọng đọc sai một chữ, thêm `say` (cách viết cho giọng đọc) cùng số chữ với `text`.
- Câu đầu tiên của video là câu chào và giới thiệu gọi bé là "bạn", đánh `"opening": true` (chi tiết ở `SKILL.md`, mục "Câu mở đầu"). Giọng đọc không khai ở đây mà ở `media.json` của bài.
- Kể theo một câu chuyện có kết, hình trước lời sau: ví dụ cụ thể (bàn cờ, chuỗi hạt) → phép tính → quy tắc → một ví dụ thử → câu "Nhớ nhé".
- Mỗi cảnh (`scenes[]`) là một bước hình, 1–5 câu. Id `sNN-<tên>` dùng trong `index.html`.
- `clips[]`: đoạn cảnh `from`–`to` giảng một card; trẻ xem lại đoạn đó khi ôn sai card.
- Độ dài: video cũ khoảng 20–24 câu cho 60–90 giây. Video mới ngắn hơn: **45–75 giây, tối đa 16 câu, ít ý hơn** (một video chỉ giảng một ý của phần, mỗi ý một cảnh); bé chậm, khó tập trung nên một video dài hay nhiều ý là quá tải (tốc độ 0.9 và các quãng nghỉ trong `PAUSE` của `video/config.ts`).
- Giọng miền Bắc đọc "tr" như "ch" và "d" như "gi", Whisper ghi "trừ" thành "chữ", "dải" thành "giải": đã chuẩn hoá trong `video/lib/text.ts`, không cần đổi lời.

## Nhịp cho bé chậm (video mới)

Người lớn xem còn phải dừng lại nghĩ; bé chậm không theo kịp nếu mọi thứ liền nhau. Video mới (không nằm trong `video/pacing-exempt.json`) theo các luật dưới đây, `pnpm video:build` và `pnpm video:check` báo lỗi khi vi phạm (hằng số ở `PACING` và `PAUSE` của `video/config.ts`).

- **Một ý một câu, ≤ 12 chữ.** Câu dài tách ra (câu `rule` và `quote` chép nguyên văn bài nên không bị giới hạn chữ).
- **Hỏi rồi mới mở:** trước khi lộ đáp án hay quy tắc, hỏi bé tự đoán: "Bạn thử đoán xem: 6 nhân 9 bằng mấy?" đánh `"pause": "ask"` (im lặng ≥ `PAUSE.ask` = 1,5 giây), rồi mới nói đáp án. Có ít nhất một câu `ask`, và câu cuối video không phải `ask`.
- **Dừng nghĩ sau mỗi điều quan trọng vừa lộ:** mọi câu `"rule": true` (trừ câu cuối video) đánh `"pause": "think"` (im lặng ≥ `PAUSE.think` = 1 giây); nên đặt cả sau kết quả của ví dụ chính. Build đổi cờ `pause` thành khoảng lặng thật sau câu đó (lấy giá trị lớn hơn giữa quãng nghỉ thường và `PAUSE.think`/`PAUSE.ask`), và `video:check` đối chiếu phụ đề đã dựng. Mọi quãng lặng giữa câu hay giữa cảnh nằm trong 1–1,5 giây (`PAUSE_MAX`): lặng dài hơn làm bé tưởng video đứng hình và làm file nặng thêm, nên đừng nâng `PAUSE` lên quá mức đó; bé muốn xem chậm hơn thì tự bấm tạm dừng hoặc tua lại bằng nút của trình phát.
- Video chạy liền một mạch: không có điểm dừng tự động trong app (không đánh `checkpoint` vào câu; cờ `checkpoint` và `videos[].checkpoints` của video cũ bị bỏ qua). Chỉ bé mới tạm dừng; lặng ngắn của `pause` là chỗ bé nghĩ.
- Phần hình cũng phải chờ: khi lời im lặng vì `pause`, hình giữ nguyên kết quả vừa hiện, không đổi cảnh trong khoảng đó.
- Video đã dựng trước các luật này được liệt kê trong `video/pacing-exempt.json` (mỗi dòng `<id bài>/<tên>`). Dựng lại một video theo luật mới là quyết định riêng của chủ dự án (đọc lại giọng, đổi video và phụ đề); khi làm thì xoá dòng của nó khỏi danh sách để luật áp dụng. Không thêm video mới vào danh sách để qua kiểm tra.
