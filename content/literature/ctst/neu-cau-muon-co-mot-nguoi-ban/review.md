# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Vòng: 12 - chỉ phần đổi, khối `overview.narration` (thêm `audioUrl`, `vttUrl`); chữ của `overview` và mọi section không đổi. `pnpm content:diff` không chạy được vì bản đã review ở vòng 11 chưa được commit; đã xác nhận phần đổi bằng hash: bỏ `overview.narration` thì hash của bài bằng đúng "Bản đã review" của vòng 11 (`3e2824…216c`)
- Nguồn đã đọc: không cần (phần đổi không mang kiến thức mới; lời đọc là chính chữ `overview` đã duyệt ở vòng 11)
- Kết quả soát: hai tệp có trong `public/media/narration/neu-cau-muon-co-mot-nguoi-ban/` (`overview.m4a`: AAC, 58,6 giây; `overview.vtt`: 33 cue). Tách chữ `overview` theo `overviewParts` (`src/content/overview.ts`: hook, summary, "Học xong bài này, bạn sẽ:", 4 goals, whyItMatters) được 186 từ; `parseKaraokeVtt` (`src/lib/karaoke-vtt.ts`) đọc được 186 từ, khớp từng từ theo đúng thứ tự (0 lệch, kể cả dấu câu và ngoặc kép “cảm hoá”, “làm cho gần gũi hơn”, “người ta chỉ thấy rõ với trái tim”), mốc thời gian tăng dần, từ cuối bắt đầu ở 56,2 giây, trước khi âm thanh hết. Chưa nghe lại âm thanh bằng Whisper trên máy này (không cài); `pnpm narration:build` đã so từng câu với chữ bằng Whisper khi dựng.
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường khi bài đổi sau review), 0 cảnh báo; ngoài bài này còn lỗi của `content/math/kntt/luy-thua/lesson.json` (`[length]` ở `overview.hook.text` và `overview.summary`, `[review-hash]`)
- `lesson:walk`: không chạy. Phần đổi chỉ có lời đọc của `overview`, walk không chụp màn giới thiệu bài.
- Kết luận: Đã xuất bản (`status: published`, `reviewedHash` mới): 0 Nghiêm trọng, 0 Nên sửa, 1 Góp ý (giữ từ vòng 11) (`pnpm content:hash neu-cau-muon-co-mot-nguoi-ban --root content --approve`)
- Bản đã review: `3adef91373498e1f6316b9841f40048e8d8b61226a6ed657525ad2f1322e2227` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. “Lúc chia tay” ở câu 4 và “Khi từ biệt” ở câu 5 nghe như cùng một lúc

- Vị trí: `$.overview.summary`, câu 4 (giữ từ vòng 11; chữ chưa đổi)
- Nguồn: tr.23, `p23-24.png` (“Khi gần đến lúc phải ra đi, con cáo nói: – A!… Mình sẽ khóc mất.”)
- Vấn đề: cáo nói sắp khóc khi hoàng tử bé sắp đi, rồi mới gửi cậu đi thăm vườn hồng; bí mật được tặng ở lần vĩnh biệt sau đó. Hai cụm “Lúc chia tay” và “Khi từ biệt” gần nghĩa nhau nên câu 4–5 đọc như cùng một cảnh. Không sai văn bản (recap `chia-tay` cũng gọi là “Chia tay”).
- Sửa: tuỳ tác giả; câu 4 mở bằng “Khi sắp chia tay, cáo buồn đến muốn khóc…”. Nếu sửa thì phải dựng lại lời đọc (`pnpm narration:build`) để VTT khớp chữ mới.
