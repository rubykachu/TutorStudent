# Review: Ôn tập chương II (`on-tap-chuong-2`)

- Bài: `content/math/kntt/on-tap-chuong-2/lesson.json`
- Vòng: 6 - chỉ phần đổi (`pnpm content:diff`): `overview.narration`, ba khối `video` đầu các section `tinh-chat-tong`, `bcnn-bai-toan`, `so-mu-uclnn-bcnn`, ba mục `videos[]` (kịch bản `video/projects/on-tap-chuong-2/{khang-dinh-sai,khoang-bcnn,so-mu}/script.json`, lời đọc `overview`)
- Nguồn đã đọc: không đọc lại trang sách: diff không đổi chữ, số hay đáp án của câu nào (đối chiếu số của video với đề `bai-2-58`, `bai-2-63` và các bước dẫn trong `lesson.json`)
- `content:check`: 0 lỗi của bài ngoài `[review-hash]` (bình thường lúc này) và cảnh báo id chưa khoá (khoá sau khi duyệt)
- `lesson:walk`: 0 FAIL, 0 cảnh báo (ipad, phone, ipad-landscape); đã xem sheet các khối video của phần 1 và 11 (phone): nút phát, poster, phụ đề "Chào bạn!..." hiện đúng, poster `so-mu` hiện a = 3, b = 4
- Kết luận: 0 Nghiêm trọng, 2 Nên sửa (đã sửa), 1 Góp ý (giữ nguyên); đã `--approve` và `content:lock`
- Bản đã review: `d1342dcfd3bcac315a35e0da82e30ec8b645c94f960d5c7a05b1442cd424731e` (`pnpm content:diff` so với bản này)

Đã soát và đạt:
- Câu quy tắc của ba video (`rule`) khớp từng chữ `note` của section (`pnpm video:check` qua, `data-rule-text` 0 phần tử vì video không đưa chữ quy tắc lên màn). Màu: xám slate cho sự kiện chia hết, hồng BCNN, hổ phách ƯCLN, xanh trời thừa số nguyên tố, tím số mũ; khớp màu khái niệm của bài.
- `khang-dinh-sai`: 1 + 3 = 4 đúng, hai số không chia hết cho 4 mà tổng chia hết cho 4; 1 + 2 = 3 và 8 + 3 = 11 đúng. Số khác bước dẫn (18 + 27, 2 + 7) và câu trắc nghiệm 1.
- `khoang-bcnn`: 5 = 5, 6 = 2 · 3, 10 = 2 · 5, BCNN(5, 6, 10) = 30; bội 30, 60, 90, 120, 150; cộng 1 được 31, 61, 91, 121, 151; chỉ 121 nằm trong khoảng 100 đến 140 (duy nhất). Số khác 2.58 (10, 12, 15; 195 đến 295) và các bước dẫn.
- Mở đầu: cả ba video mở bằng "Chào bạn!" có cờ `opening`; `pnpm video:check` qua (quãng đệm, nhịp `ask`, `think`, điểm dừng: 3, 4, 3). Mỗi video 53 đến 70 giây, 12 đến 14 câu.
- Contact sheet từng video (khung mỗi 2 đến 3 giây): chữ rõ, không cắt, dải dưới trống cho phụ đề, hình hiện đúng lúc lời đọc.
- Lời đọc tổng quan: một giọng (VieNeu Hải Đăng) từ đầu đến cuối, ghi ở `overview.narration.voice`; chữ trên màn không đổi so với `overview.hook`.

## Nghiêm trọng

Không có.

## Nên sửa (đã sửa)

### 1. Lời đọc mở đầu "Chào bạn!" bị đọc sai ("Xào mạng.")

- Vị trí: `overview.narration` (câu đầu của `overview.hook`)
- Vấn đề: cả bốn lần đọc của câu 2 âm tiết này đều bị Whisper nghe sai (50%); hai lần đọc lại bằng cùng giọng cho 100%, nên không phải lỗi chữ mà do lần đọc đó.
- Sửa: chọn lần đọc "Chào bạn!" đạt 100% của cùng giọng VieNeu Hải Đăng, dựng lại cả lời đọc (không đổi chữ, không gọi Gemini). Whisper nghe cả lời đọc: thấp nhất 94,9% ở hai câu có "chương II" (Whisper viết "chương 2", đọc đúng là "hai").

### 2. Số của video `so-mu` trùng số của bước dẫn và của câu sách

- Vị trí: `video/projects/on-tap-chuong-2/so-mu/script.json`
- Vấn đề: ví dụ cũ 2⁴ · 7ᵃ và 2ᵇ · 7³ dùng lại cặp số mũ "4 và b" của bước dẫn `tim-b-mu-nho`, đáp án a = 5 của bước `tim-a-mu-lon`, và b = 2 của câu 2.63; bé có thể chép đáp án thay vì làm theo cách.
- Sửa: ví dụ mới 2⁶ · 7ᵃ và 2ᵇ · 7², ƯCLN 2⁴ · 7², BCNN 2⁶ · 7³, cho b = 4, a = 3 (duy nhất; kiểm min(6, b) = 4, max(a, 2) = 3, min(a, 2) = 2, max(6, 4) = 6). Mọi số khác bước dẫn (b = 3, a = 5) và câu 2.63 (b = 2, a = 6). Chỉ đọc lại các câu đổi số (câu quy tắc giữ nguyên); Whisper ≥ 97,5%; dựng lại, xem lại sheet.

## Góp ý

### 1. Câu khẳng định ở `khang-dinh-sai` bị cắt làm hai câu

- Vị trí: `video/projects/on-tap-chuong-2/khang-dinh-sai/script.json`, cảnh `s01-mo`
- Vấn đề: "Khẳng định: hai số đều không chia hết cho 4." rồi "Thì tổng của chúng cũng không chia hết cho 4." (vế sau đứng một mình, có điểm dừng). Hình hiện hai khung nối bằng dấu "⇒" nên bé vẫn theo được.
- Sửa: giữ nguyên (dựng lại sẽ đổi giọng đọc cả đoạn mở).
