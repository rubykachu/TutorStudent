# Luật viết kịch bản

Người xem là trẻ lớp 6 học chậm, xem trên iPad, nghe giọng TTS.

- Câu ngắn (≤ 15 chữ), một ý một câu, từ quen thuộc; thuật ngữ đúng glossary (`content/glossary/<môn>.json`).
- Câu nêu quy tắc, định nghĩa: đúng nguyên văn `note`/`caption` của bài. Ký hiệu đọc thành lời: `aⁿ` → "a mũ n", dấu ngoặc → dấu phẩy.
- Chữ cái đứng một mình ở cuối câu viết "số a", không để "a" trơ trọi: TTS và Whisper hay nuốt mất.
- Số viết bằng chữ số hay bằng chữ đều được, đọc tự nhiên ("64", "sáu mươi tư"). Không viết chỉ số trên (`2³`) trong `text`: viết "2 mũ 3".
- `text` là phụ đề hiện đúng như viết. Khi giọng đọc sai một chữ, thêm `say` (cách viết cho giọng đọc) cùng số chữ với `text`.
- Kể theo một câu chuyện có kết, hình trước lời sau: ví dụ cụ thể (bàn cờ, chuỗi hạt) → phép tính → quy tắc → một ví dụ thử → câu "Nhớ nhé".
- Mỗi cảnh (`scenes[]`) là một bước hình, 1–5 câu. Id `sNN-<tên>` dùng trong `index.html`.
- `clips[]`: đoạn cảnh `from`–`to` giảng một card; trẻ xem lại đoạn đó khi ôn sai card.
- Độ dài: khoảng 20–24 câu cho 60–90 giây (tốc độ 0.9 và các quãng nghỉ trong `PAUSE` của `video/config.ts`).
- Giọng miền Bắc đọc "tr" như "ch", Whisper ghi "trừ" thành "chữ": đã chuẩn hoá trong `video/lib/text.ts`, không cần đổi lời.
