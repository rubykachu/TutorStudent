---
name: lesson-video
description: Làm video bài giảng 60–90 giây cho một bài đã xuất bản - viết kịch bản tiếng Việt cho người học chậm, đọc bằng giọng TTS chạy trên máy (VieNeu, mỗi bài một giọng: "Hải Đăng" hoặc "Mỹ Duyên"), kiểm từng câu bằng Whisper, dựng hình HyperFrames theo màu của bài, phụ đề karaoke WebVTT, cắt clip theo card, rồi gắn video vào đầu phần tương ứng trong lesson.json. Dùng khi người dùng nói "làm video cho bài", "tạo video bài giảng", "làm lại video", "thêm video vào bài", hoặc khi một môn vừa xong bài và cần video.
model: sonnet
---

# Video bài giảng

`<id bài>` là slug của bài (tên thư mục chứa `lesson.json`).

Mỗi video là một thư mục `video/projects/<id bài>/<tên>/` (commit): `script.json` (lời đọc) và `index.html` (hình). Một lệnh dựng tất cả:

```bash
pnpm video:build <id bài> <tên>
```

Lệnh tổng hợp giọng từng câu, cho mlx-whisper nghe lại và so với kịch bản (bỏ dấu thanh, dấu câu; câu dưới 97% tự đọc lại, tối đa 3 lần), chậm lại `atempo 0.9`, lấy mốc thời gian từng chữ, dựng hình bằng HyperFrames, nén H.264 720p (≤ 10 MB/phút), rồi ghi `public/media/video/<id bài>/<tên>.{mp4,vtt,jpg}` và mục `videos[]` trong `lesson.json` (id `<id bài>.video.<tên>`, clip theo card). Câu đã đọc được giữ trong `audio/` nên sửa hình không đọc lại. Thiết lập và mọi thông số: `video/config.ts`; Python arm64 và model: `video/requirements.txt`.

## Giọng: mỗi bài một giọng

Giọng khai **một lần cho cả bài** trong `video/projects/<id bài>/media.json` (`{ "voice": "<id giọng>" }`); `pnpm narration:build` (lời đọc giới thiệu) và `pnpm video:build` (mọi video) đều đọc từ đó, `script.json` không có trường giọng. Một bài không xen giọng nam và nữ. Danh sách giọng hợp lệ (id, preset của engine, giới tính) chỉ ở `video/voices.ts`: `hai-dang` (nam, "Hải Đăng"), `my-duyen` (nữ, "Mỹ Duyên", giọng miền Nam). `pnpm video:check` báo lỗi khi bài thiếu `media.json`, khai giọng lạ, hay video đã dựng được đọc bằng giọng khác giọng của bài.

Lời đọc giới thiệu (`pnpm narration:build <id bài>`) đọc bằng Gemini TTS, không phải VieNeu; video vẫn VieNeu. Giọng Gemini cùng giới tính với giọng bài (`narration` trong `video/voices.ts`; tên giọng theo giới tính ở `GEMINI_NARRATORS`, đổi một dòng ở đó là đổi cho mọi bài cùng giới tính, rồi chạy lại lệnh cho từng bài). Lệnh đọc cả phần giới thiệu trong một request, cắt thành câu theo mốc chữ của Whisper, kiểm từng câu (≥ 97%, câu lỗi đọc lại riêng cùng giọng). Key Gemini nằm ở `~/.config/gemini/api_key*` (mọi file `api_key*` đều dùng, xoay vòng); không in, không commit. Hết hạn mức mọi key thì lệnh tự đọc lại **cả** lời giới thiệu bằng giọng VieNeu của bài và cảnh báo (không bao giờ trộn hai engine trong một lời đọc); giọng đã đọc ghi ở `overview.narration.voice`, chạy lại lệnh sau khi hạn mức hồi để về giọng Gemini. Chạy lệnh gọi Gemini thật là ghi ra ngoài máy: theo `.claude/rules/agents.md`, hỏi chủ dự án trước.

Chọn giọng theo không khí của bài, lúc dựng video đầu tiên của bài, rồi giữ nguyên:

- Bài nhẹ nhàng, kể chuyện, động viên (văn, bài mở đầu một mạch kiến thức, bài bé hay sợ): `my-duyen`.
- Bài sôi nổi, dồn dập, nhiều bước thủ tục (quy tắc, thứ tự tính, luyện nhanh): tuỳ ý, hai giọng đều được.
- Xen kẽ giữa các bài liền nhau để bé đỡ nhàm: xem giọng của bài trước trong `media.json` và chọn giọng kia khi không có lý do riêng.
- Ghi lý do chọn vào `task.md` của bài. Đổi giọng một bài đã có video nghĩa là đọc lại mọi video và lời đọc của bài đó (giọng là một phần khoá cache câu), nên không đổi khi không cần.

## Câu mở đầu và quãng đệm

Mọi video mở đầu bằng **một câu chào và giới thiệu**, gọi bé là "bạn", nói video nói về gì: "Chào bạn! Hôm nay ta ghép số cho tròn để tính nhẩm nhanh." Câu đó là câu đầu tiên của cảnh đầu tiên, đánh `"opening": true`, không phải câu `rule` hay `quote`, ngắn (≤ 15 chữ). Trước câu đầu luôn có `PAUSE.leadIn` (1 giây) im lặng (phụ đề chưa hiện), để bé không mất mấy chữ đầu. Build và `pnpm video:check` dừng khi câu đầu không có cờ `opening`, không có chữ "bạn", hay phụ đề đầu bắt đầu trước quãng đệm; cờ `opening` ở câu khác cũng là lỗi. Video dựng trước khi có luật này được liệt kê trong `openingExempt` của `media.json` của bài; dựng lại video nào thì thêm câu mở đầu và xoá tên nó khỏi danh sách.

**Lời đọc giới thiệu** (`overview.narration`) cũng mở đầu bằng câu chào gọi bé là "bạn": câu đầu tiên của `overview.hook` (chữ trên màn tổng quan chính là chữ được đọc), ví dụ "Chào bạn! Ở bài này, chúng ta sẽ …", ngắn, không phải câu quy tắc hay câu trích. `pnpm narration:build` đánh dấu câu đó là `opening` và dừng trước khi đọc nếu nó không có chữ "bạn"; quãng đệm `PAUSE.leadIn` im lặng trước câu đầu như video, và `pnpm video:check` báo lỗi khi phụ đề lời đọc bắt đầu trước quãng đệm. Luật chỉ áp cho lời đọc viết từ nay; bài đã có lời đọc trước luật có `"narrationOpeningExempt": true` trong `media.json`, giữ nguyên chữ và âm thanh; viết lại lời đọc bài nào thì thêm câu chào và xoá cờ đó.

## Quy trình

1. **Chỉ bài đã `published`.** Đọc `lesson.json`: phần (section), câu quy tắc (`note`, `caption`), card, màu khái niệm; xem visual của bài trong `src/visuals/<môn>/<bài>/` và contact sheet `.shots/<bài>/sheet-*-NN.png` (chạy `pnpm visual:shot <bài>` nếu chưa có).
2. **Chọn video.** Mỗi video giảng một ý của một phần, 60–90 giây; đặt ở đầu phần đó. Một phần có tối đa một video (`MAX_SECTION_VIDEOS`); video không tính vào số màn của phần.
3. **Chọn giọng của bài** nếu bài chưa có `media.json` (mục "Giọng"), rồi **viết `script.json`**, câu đầu là câu mở đầu (mục "Câu mở đầu"), từ `.claude/skills/lesson-video/templates/script.example.json`, theo `.claude/skills/lesson-video/references/script-rules.md`: câu quy tắc đánh `rule`, câu trích văn bản đánh `quote`; build kiểm nguyên văn. Chữ quy tắc hiện trên màn thì đánh `data-rule-text` lên phần tử đó (chữ phải là câu `note`/`caption` của bài, hoặc kí hiệu trong "X đọc là Y" như "2 ∈ A").
4. **Viết `index.html`** từ `.claude/skills/lesson-video/templates/index.example.html`, theo `.claude/skills/lesson-video/references/composition.md`: hình trước, chữ ít, vào đúng lúc chữ được đọc.
5. **Dựng:** `pnpm video:build <id bài> <tên>`. Bài có nhiều video thì chạy tối đa 2 lệnh cùng lúc (Bash `run_in_background`); TTS ăn CPU nên không chạy 3. Hai lệnh cùng ghi `videos[]` của `lesson.json` lúc kết thúc: xong cả hai thì kiểm đủ hai mục, thiếu thì dựng lại video đó (câu đã đọc được giữ nên nhanh). Build tự kiểm không tốn token: mỗi câu `script.json` phải có trong `.vtt` (báo câu thiếu/thừa theo số thứ tự) và chữ `data-rule-text` phải khớp bài; chạy lại trên video đã dựng, không dựng lại: `pnpm video:check [<id bài> [<tên>]]`. Đọc cuối log: dòng "listen to this sentence" là câu cần người nghe duyệt (thường Whisper nghe nhầm chứ không phải giọng sai). `renders/report.json` có lời Whisper nghe được và tỉ lệ khớp từng câu.
6. **Tự xem.** Cắt khung hình rồi ghép sheet: `ffmpeg -v error -i <mp4> -vf fps=1/2 -start_number 0 video/projects/<bài>/<tên>/renders/frames/f-%03d.png && pnpm shots:sheet video/projects/<bài>/<tên>/renders/frames` (khung `f-NNN` ở giây NNN×2; thêm `-vf fps=1` cho đoạn cần mịn hơn). Đọc các sheet, không đọc từng khung; mở riêng một khung chỉ khi cần phóng to. Soát: chữ rõ, không bị cắt, màu đúng khái niệm, dải dưới cùng trống cho phụ đề, hình khớp lời ở mốc trong `.vtt`. Sửa `index.html` rồi dựng lại.
7. **Gắn vào bài:** thêm `{ "type": "video", "videoId": "<id bài>.video.<tên>" }` làm khối đầu của phần; `pnpm content:lock` thêm id mới. Bài đổi nội dung nên phải review lại: vòng chỉ phần đổi của skill `lesson-review` (diff chỉ có video và khối video), reviewer là subagent mới mở với `model: "sonnet"` (vòng chỉ phần đổi), soát lời dẫn, chuyển cảnh, số và clip; câu quy tắc, câu trích đã được build kiểm. Rồi `pnpm lesson:walk <id bài>`.
8. **Commit** kịch bản, `index.html`, `lesson.json`; không commit `public/media/`, `audio/`, `renders/` (đã gitignore). Âm thanh chung của app (`public/sounds/`, dựng bằng `pnpm sounds:build` từ `src/mascot/lines.ts`, có commit) không thuộc bài, không dựng lại ở đây.

## Phát trong app

`src/components/blocks/video-player.tsx`: không tự phát, nút phát lớn, phụ đề bật sẵn (chữ lớn, tô chữ đang đọc), `playsInline` cho iPad. Thẻ ôn có clip thì màn nhắc lại có nút "Xem lại đoạn video". Đường dẫn file ghép với `NEXT_PUBLIC_MEDIA_BASE_URL` (mặc định `/media`, tức `public/media`).

## Lên go-live (chưa làm, hỏi trước khi chạy)

Tải tệp lên bucket media không cần dựng lại, vì `lesson.json` chỉ ghi đường dẫn tương đối:

1. Hỏi chủ dự án trước khi ghi lên R2 (ghi ra ngoài máy).
2. Sao nguyên cây `public/media/` lên gốc bucket media, giữ đường dẫn, ví dụ `rclone copy public/media r2:<R2_MEDIA_BUCKET>` hoặc `aws s3 sync public/media s3://<R2_MEDIA_BUCKET> --endpoint-url https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`, với `Content-Type` `video/mp4`, `text/vtt`, `image/jpeg`.
3. Bucket bật CORS cho domain app (phụ đề `<track>` tải qua CORS, player đặt `crossOrigin="anonymous"`).
4. Đặt `NEXT_PUBLIC_MEDIA_BASE_URL=https://<domain media>` trên Vercel và deploy lại.
