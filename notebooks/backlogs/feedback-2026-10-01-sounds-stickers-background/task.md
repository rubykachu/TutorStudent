# Phản hồi của chủ app (01/10/2026): âm thanh, sticker, nền

Nguồn: phản hồi mới nhất của chủ app. Đánh dấu `[x]` khi xong.

- [x] 1. Nhấn liên kết quay lại ("‹ Toán") ở trang bài không có tiếng. Tìm nguyên nhân thật và sửa chung để mọi lần bấm điều hướng trên màn của bé đều nghe được, kể cả liên kết rời khỏi trang. Có test.
- [x] 2. Tiếng nút (`button`, hai nốt C5 rồi G5) nghe "nửa vời", cứng và đứt. Thiết kế tiếng một nốt tròn, mềm, dễ chịu; làm 3 phương án thành file nghe thử, chọn một phương án đưa vào spec, chạy `pnpm sounds:build`, kiểm độ lớn và đỉnh theo mastering.
- [x] 3. Nhận sticker (xong cả bài) có pháo giấy; thêm lời chúc mừng bằng giọng cú (Gemini TTS, tạo một lần như các câu chung khác), gọi bé là "bạn", ngắn và ấm. Phát cùng lúc chúc mừng, theo công tắc âm thanh. Kiểm bằng manifest và Whisper.
- [x] 4. Dải sticker ở trang chủ: chạm sticker đã nhận mở bảng chi tiết thì cũng có pháo giấy, kèm nhạc vui như hiện tại, không có lời chúc mừng. Tôn trọng giảm chuyển động.
- [x] 5. Nền "đa vũ trụ" tinh tế cho các màn của bé (hành tinh nhạt, quỹ đạo, sao nhỏ, vầng tinh vân): tương phản thấp, không che nội dung, chữ vẫn ≥ 4.5:1, nhẹ (SVG/CSS), không chuyển động hoặc rất nhẹ và tắt khi giảm chuyển động, không có ở trang phụ huynh. Ghi vào `docs/design-system.md`. Chụp iPad dọc, điện thoại, iPad ngang (trang chủ, môn, bài, một màn player) và chạy `pnpm lesson:walk thu-tu-thuc-hien-phep-tinh` (0 lỗi, bộ dò chồng lấn không bắt nền).

Kết thúc: test đơn vị/component cho mục 1, 3, 4; chạy cổng `pnpm format && pnpm lint && pnpm typecheck && pnpm test`; commit nhỏ.

## Ghi chú kết quả

- Mục 1: nguyên nhân là `preloadSounds` gọi `load()` lại mọi clip mỗi khi một màn mới của bé mount; liên kết rời trang phát tiếng nút rồi màn kế tiếp mount và `load()` dừng clip đang phát. Nay mỗi clip chỉ `load()` một lần. Màn xong phần cũng được bọc `ButtonSounds` (trước đó im lặng).
- Mục 2: tiếng nút mới là một nốt D5 (xem `TONES` trong `scripts/lib/sound-spec.ts`). Phương án khác (ghi thông số để đổi): chuông gỗ tròn E5 `notes [[659.26,0]]`, `overtone 0.12`, `noteDecay 14`, `attack 90`, không glide; bong bóng A4 `notes [[440,0]]`, `overtone 0.06`, `noteDecay 11`, `attack 55`, `glide {amount:-0.18, rate:18}`, `durationS 0.4`, `fadeOutS 0.15`; cả hai `attackPower 2`, `durationS 0.34`.
- Mục 5: nền tĩnh (không chuyển động) vì `docs/design-system.md` cấm chuyển động nền khi học.
