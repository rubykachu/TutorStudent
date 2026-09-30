# Luật viết kịch bản

Người xem là trẻ lớp 6 học chậm, xem trên iPad, nghe giọng TTS.

- Câu ngắn (≤ 15 chữ), một ý một câu, từ quen thuộc; thuật ngữ đúng glossary (`content/glossary/<môn>.json`).
- Câu nêu quy tắc, định nghĩa: chép nguyên văn một `note`/`caption` của bài (hay một câu của nó) và đặt `"rule": true`. Chỉ được khác: `aⁿ` → "a mũ n", dấu ngoặc → dấu phẩy, chữ cái đứng một mình → "số a" (TTS và Whisper hay nuốt chữ cái trơ trọi).
- Câu trích văn bản đọc hiểu đặt `"quote": true`: phần trong ngoặc kép “…” (không có ngoặc thì cả câu) phải nằm nguyên văn trong `source-passage.txt`.
- `pnpm video:build` dừng khi câu `rule`/`quote` lệch bài (`video/lib/verbatim.ts`); `pnpm test` cũng kiểm lại mọi kịch bản đã commit.
- Số viết bằng chữ số hay bằng chữ đều được, đọc tự nhiên ("64", "sáu mươi tư"). Không viết chỉ số trên (`2³`) trong `text`: viết "2 mũ 3".
- `text` là phụ đề hiện đúng như viết. Khi giọng đọc sai một chữ, thêm `say` (cách viết cho giọng đọc) cùng số chữ với `text`.
- Kể theo một câu chuyện có kết, hình trước lời sau: ví dụ cụ thể (bàn cờ, chuỗi hạt) → phép tính → quy tắc → một ví dụ thử → câu "Nhớ nhé".
- Mỗi cảnh (`scenes[]`) là một bước hình, 1–5 câu. Id `sNN-<tên>` dùng trong `index.html`.
- `clips[]`: đoạn cảnh `from`–`to` giảng một card; trẻ xem lại đoạn đó khi ôn sai card.
- Độ dài: khoảng 20–24 câu cho 60–90 giây (tốc độ 0.9 và các quãng nghỉ trong `PAUSE` của `video/config.ts`).
- Giọng miền Bắc đọc "tr" như "ch", Whisper ghi "trừ" thành "chữ": đã chuẩn hoá trong `video/lib/text.ts`, không cần đổi lời.
