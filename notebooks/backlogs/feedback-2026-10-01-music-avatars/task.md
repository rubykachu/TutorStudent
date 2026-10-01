# Phản hồi của chủ app (01/10/2026): âm thanh mới, avatar, hộp nhạc, thẻ phần

Nguồn: phản hồi mới nhất của chủ app. Đánh dấu `[x]` khi xong. Chủ app xác nhận mọi file âm thanh dưới đây được phép dùng.

## Quyết định

- Âm thanh ngoài nhập qua đường ống âm thanh chung (`pnpm sounds:build`) bằng loại mục mới `file`: nguồn nằm trong `assets/sounds/` (có trong git để build lặp lại được), cắt khoảng lặng đầu, chuẩn hoá độ lớn theo `MASTERING`, băm trong `public/sounds/manifest.json` như tone và giọng.
- Hai tiếng ăn mừng không bao giờ chồng nhau: màn xong phần phát `lesson-end`; màn nhận sticker phát nối tiếp `lesson-end` rồi lời chúc mừng của cú (bỏ tiếng jingle "đúng" ở đây, vì `lesson-end` đã là tiếng chúc mừng).
- Nhạc là phần thưởng SAU khi học, không bao giờ phát trong lúc làm bài: chỉ phát ở hộp nhạc (trang chủ) và màn xong phần, do bé bấm; tắt khi rời màn.
- Mở khoá suy ra từ số phần đã xong (Dexie `sectionProgress`), không thêm trạng thái mới: bài đầu mở sau phần xong đầu tiên, rồi thêm một bài sau mỗi 3 phần xong (mốc 1, 4, 7).
- Cú vẫn là linh vật của app ở mọi nơi; avatar chỉ hiện ở lời chào và nút "Đổi hồ sơ" trên trang chủ.

## Việc cần làm

- [x] 1a. `duolingo-end-of-lesson.mp3`: phát ở màn xong phần và lúc nhận sticker (nối tiếp lời chúc mừng).
- [x] 1b. `duolingo-incorrect.mp3`: thay tiếng `oops` ở tín hiệu phản hồi, giữ 3 nấc.
- [x] 1c. `bye-bye-soundbible.mp3`: phát khi bé thoát bằng nút × ở màn phần và màn ôn; vẫn nghe được sau khi chuyển màn.
- [x] 2. Hai avatar mới cho bé trai: anh hùng nhện (thiết kế riêng, lấy cảm hứng mặt nạ đỏ xanh có lưới) và xe đua.
- [x] 3. Hiện avatar đã chọn cạnh "Chào <tên>!" và trong nút "Đổi hồ sơ" (giữ chữ).
- [x] 4. "Hộp nhạc" thay chip chuỗi ngày ở trang chủ; danh sách bài trong một file cấu hình; mở khoá như trên; thưởng ở màn xong phần; một bài phát một lúc; theo công tắc âm thanh; âm lượng nhạc nhỏ hơn giọng.
- [x] 5. Thẻ "Các phần của bài" có hình trang trí "đa vũ trụ" nhạt, khác nhau theo thẻ, không dưới chữ hay mũi tên, tương phản chữ ≥ 4.5:1, không chuyển động. Chụp điện thoại, iPad dọc và ngang, xem contact sheet.
- [x] 6. Test (tiếng sai/xong/thoát, luật mở khoá, hộp nhạc một bài một lúc và tắt tiếng, hiển thị avatar), `pnpm lesson:walk thu-tu-thuc-hien-phep-tinh` 0 lỗi, cập nhật `docs/design-system.md` và `docs/architecture.md`, cổng `pnpm format && pnpm lint && pnpm typecheck && pnpm test`.

## Ghi chú kết quả

- Âm thanh: nhập qua `pnpm sounds:build` loại `file` (`scripts/lib/sound-spec.ts` `FILES`, nguồn trong `assets/sounds/`). Tiếng sai −21,3 LUFS, xong phần −16, tạm biệt −18,1, nhạc −22. "Cắt" chỉ là cắt khoảng lặng đầu và tắt dần 0,4 giây ở bài nhạc; chưa có cắt theo giây vì chưa clip nào cần.
- Tiếng xong phần nối tiếp với lời cú ở màn sticker; tiếng jingle "đúng" bỏ khỏi màn đó. Màn ôn tập xong chưa có tiếng xong phần (chưa được yêu cầu).
- Hàng thưởng "Mở hộp nhạc" phải gọn vì bộ dò `lesson:walk` không cho nút nào nằm dưới thanh dưới; đoạn khen cũng rộng hơn (`max-w-2xl`) cho iPad ngang.
- Mở hộp nhạc ở màn xong phần cắt tiếng xong phần đang phát (một bài nhạc luôn phát một mình).
- `pnpm lesson:walk thu-tu-thuc-hien-phep-tinh`: 0 lỗi (chạy trên cây git riêng, cổng 3130). Ảnh và contact sheet: `.shots/music-avatars/` (`sheet-lesson-01.png`, `sheet-home-01.png`, `sheet-home-02.png`, `profile-form-phone.png`, `walk/<thiết bị>/sheet-NN.png`).
