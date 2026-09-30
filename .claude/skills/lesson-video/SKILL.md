---
name: lesson-video
description: Làm video bài giảng 60–90 giây cho một bài đã xuất bản - viết kịch bản tiếng Việt cho người học chậm, đọc bằng giọng TTS chạy trên máy (VieNeu "Hải Đăng"), kiểm từng câu bằng Whisper, dựng hình HyperFrames theo màu của bài, phụ đề karaoke WebVTT, cắt clip theo card, rồi gắn video vào đầu phần tương ứng trong lesson.json. Dùng khi người dùng nói "làm video cho bài", "tạo video bài giảng", "làm lại video", "thêm video vào bài", hoặc khi một môn vừa xong bài và cần video.
model: sonnet
---

# Video bài giảng

`<id bài>` là slug của bài (tên thư mục chứa `lesson.json`).

Mỗi video là một thư mục `video/projects/<id bài>/<tên>/` (commit): `script.json` (lời đọc) và `index.html` (hình). Một lệnh dựng tất cả:

```bash
pnpm video:build <id bài> <tên>
```

Lệnh tổng hợp giọng từng câu, cho mlx-whisper nghe lại và so với kịch bản (bỏ dấu thanh, dấu câu; câu dưới 97% tự đọc lại, tối đa 3 lần), chậm lại `atempo 0.9`, lấy mốc thời gian từng chữ, dựng hình bằng HyperFrames, nén H.264 720p (≤ 10 MB/phút), rồi ghi `public/media/video/<id bài>/<tên>.{mp4,vtt,jpg}` và mục `videos[]` trong `lesson.json` (id `<id bài>.video.<tên>`, clip theo card). Câu đã đọc được giữ trong `audio/` nên sửa hình không đọc lại. Thiết lập và mọi thông số: `video/config.ts`; Python arm64 và model: `video/spikes/vieneu/`.

## Quy trình

1. **Chỉ bài đã `published`.** Đọc `lesson.json`: phần (section), câu quy tắc (`note`, `caption`), card, màu khái niệm; xem visual của bài trong `src/visuals/<môn>/<bài>/` và ảnh `.shots/<bài>/`.
2. **Chọn video.** Mỗi video giảng một ý của một phần, 60–90 giây; đặt ở đầu phần đó. Một phần có tối đa một video (`MAX_SECTION_VIDEOS`); video không tính vào số màn của phần.
3. **Viết `script.json`** từ `.claude/skills/lesson-video/templates/script.example.json`, theo `.claude/skills/lesson-video/references/script-rules.md`: câu quy tắc đánh `rule`, câu trích văn bản đánh `quote`; build kiểm nguyên văn.
4. **Viết `index.html`** từ `.claude/skills/lesson-video/templates/index.example.html`, theo `.claude/skills/lesson-video/references/composition.md`: hình trước, chữ ít, vào đúng lúc chữ được đọc.
5. **Dựng:** `pnpm video:build <id bài> <tên>`. Bài có nhiều video thì chạy tối đa 2 lệnh cùng lúc (Bash `run_in_background`); TTS ăn CPU nên không chạy 3. Hai lệnh cùng ghi `videos[]` của `lesson.json` lúc kết thúc: xong cả hai thì kiểm đủ hai mục, thiếu thì dựng lại video đó (câu đã đọc được giữ nên nhanh). Đọc cuối log: dòng "listen to this sentence" là câu cần người nghe duyệt (thường Whisper nghe nhầm chứ không phải giọng sai). `renders/report.json` có lời Whisper nghe được và tỉ lệ khớp từng câu.
6. **Tự xem.** Skill `webapp-evidence:vision` tạo contact sheet từ mp4 (hoặc `ffmpeg -ss <giây> -i <mp4> -frames:v 1 x.png`), đọc từng ảnh: chữ rõ, không bị cắt, màu đúng khái niệm, dải dưới cùng trống cho phụ đề, hình khớp lời ở mốc trong `.vtt`. Sửa `index.html` rồi dựng lại.
7. **Gắn vào bài:** thêm `{ "type": "video", "videoId": "<id bài>.video.<tên>" }` làm khối đầu của phần; `pnpm content:lock` thêm id mới. Bài đổi nội dung nên phải review lại: vòng chỉ phần đổi của skill `lesson-review` (diff chỉ có video và khối video), reviewer là subagent mới mở với `model: "opus"`, soát lời dẫn, chuyển cảnh, số và clip; câu quy tắc, câu trích đã được build kiểm. Rồi `pnpm lesson:walk <id bài>`.
8. **Commit** kịch bản, `index.html`, `lesson.json`; không commit `public/media/`, `audio/`, `renders/` (đã gitignore). Âm thanh chung của app (`public/sounds/`, dựng bằng `pnpm sounds:build` từ `src/mascot/lines.ts`, có commit) không thuộc bài, không dựng lại ở đây.

## Phát trong app

`src/components/blocks/video-player.tsx`: không tự phát, nút phát lớn, phụ đề bật sẵn (chữ lớn, tô chữ đang đọc), `playsInline` cho iPad. Thẻ ôn có clip thì màn nhắc lại có nút "Xem lại đoạn video". Đường dẫn file ghép với `NEXT_PUBLIC_MEDIA_BASE_URL` (mặc định `/media`, tức `public/media`).

## Lên go-live (chưa làm, hỏi trước khi chạy)

Tải tệp lên bucket media không cần dựng lại, vì `lesson.json` chỉ ghi đường dẫn tương đối:

1. Hỏi chủ dự án trước khi ghi lên R2 (ghi ra ngoài máy).
2. Sao nguyên cây `public/media/` lên gốc bucket media, giữ đường dẫn, ví dụ `rclone copy public/media r2:<R2_MEDIA_BUCKET>` hoặc `aws s3 sync public/media s3://<R2_MEDIA_BUCKET> --endpoint-url https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`, với `Content-Type` `video/mp4`, `text/vtt`, `image/jpeg`.
3. Bucket bật CORS cho domain app (phụ đề `<track>` tải qua CORS, player đặt `crossOrigin="anonymous"`).
4. Đặt `NEXT_PUBLIC_MEDIA_BASE_URL=https://<domain media>` trên Vercel và deploy lại.
