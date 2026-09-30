# Việc còn lại của skill soạn bài

Phát hiện khi chạy thử skill `lesson-author` + `lesson-visual` soạn một bài Toán mẫu từ `sources/math/luy-thua/` trong git worktree tạm (bài mẫu qua `content:check` 0 lỗi; worktree đã xoá). Không chặn xuất bản, nhưng làm bài sau tốn công hơn cần thiết.

## Template và tài liệu skill
- `.claude/skills/lesson-author/templates/lesson.skeleton.json` không qua `content:check` (card chỉ có 2 bài tập, tối thiểu 3) và trái luật của chính skill: màn chỉ một `note` / một `formula` thay vì `group`; recap là công thức trần không `caption`; một card có 2 `practiceIds` (luật là 1).
- `.claude/skills/lesson-visual/templates/visual.tsx` ẩn dòng sắp hiện bằng `invisible`, trong khi bước 3 của skill yêu cầu `Reveal` có `placeholder`.
- Skill không nói có được dùng lại visual của bài khác (`luy-thua.visual.*`) và thành phần trong thư mục bài khác (`src/visuals/math/luy-thua/`) hay phải chuyển sang `src/visuals/shared/`.
- Helper `lessonExample` trong registry gắn cứng `luy-thua`, nên mỗi bài mới sẽ chép một helper gần giống; nên có một helper chung.
- Luật "dạy thao tác nhập trước lần dùng đầu" chưa rõ `tapRegion`, `match`, `order` có tính là thao tác mới không, và không áp được cho câu chỉ có trong kho ôn.
- Không nói cách chọn `order` của bài so với bài khác (template để 1).
- Không nhắc chạy `pnpm format` / `biome check --write` cho `lesson.json` viết tay trước `pnpm lint`.
- `docs/spec.md` gọi ảnh nguồn là `p22.jpg`, file thật là `.png`.

## Kiểm tự động còn thiếu
- `content:check --stats` không so với số tối thiểu trong spec (số section, card, bài tập, dạng bài, visual mỗi section, visual tương tác mỗi 3 section); spec cũng chưa nói "mỗi 3 section" làm tròn thế nào.
- Lint chưa bắt: màn một khối đơn, hơn 1 câu luyện tập mỗi card, câu ôn trùng số với câu luyện tập, recap không phải visual có caption.
- Giới hạn "≤ 4 bài tập mỗi section" cộng "1 câu luyện tập mỗi card" và "tối thiểu 8 card" buộc khoảng 3 card mỗi section với bài 3 section; skill nên nói trước để người soạn chia card sớm.

## Công cụ
- `scripts/lib/dev-server.ts` chạy server với `stdio: "ignore"`, nên khi không khởi động được chỉ báo "Dev server did not start" mà không có lý do (vd Turbopack từ chối `node_modules` là symlink trỏ ra ngoài thư mục dự án).
