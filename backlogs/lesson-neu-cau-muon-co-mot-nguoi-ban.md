# Bài Nếu cậu muốn có một người bạn… — việc còn lại

Bài đã xuất bản (`published`, `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/`) ngày 2026-09-30: `content:check --stats` đạt mọi tiêu chí, `pnpm lesson:walk` 0 FAIL ở 3 khổ, review độc lập 0 lỗi Nghiêm trọng (`review.md` cạnh `lesson.json`).

## Đã quyết

- 2026-09-30: chủ dự án duyệt `source-passage.txt`, `footnotes.txt`, `source-citation.txt` với ảnh `sources/literature/neu-cau-muon-co-mot-nguoi-ban/p21–p25`.
- 2026-09-30: đã sửa hai mục Nên sửa của review: `ex.tu-ghep-bi-mat` dùng câu tự đặt với nhiễu hai tiếng là từ láy ("lấp lánh", "rộn ràng"), recap section `tu-ghep-tu-lay` chép nguyên văn hai câu định nghĩa (review vòng 6–7, chỉ phần đổi).
- 2026-09-30: chủ dự án cho dạy kiến thức lớp dưới theo luật hẹp: thuật ngữ trong glossary có `"prerequisite": "tiểu học"`, câu định nghĩa chuẩn và gọn như sách lớp 6, `sourceRef` ghi "Kiến thức nền (tiểu học); …" (lint kiểm dấu này). Section `tu-ghep-tu-lay` và card `tu-lay`, `tu-ghep` dùng luật này thay cho trang "Tri thức tiếng Việt" không có trong nguồn.

## Góp ý không chặn (sửa thì phải review lại rồi `content:hash --approve`)

- Note đầu section `so-sanh` có "SGK tr.26 cho biết…": bỏ số trang khỏi lời cho trẻ.
- Hình `dan-y` mục 3 và rubric bài viết nói "tiếng gió gợi nhớ bạn"; văn bản chỉ nói cáo "thấy thích" tiếng gió.
- Bước `viet-buoc-cam-xuc` hỏi "Ngay sau khi chia tay" nhưng câu căn cứ là lúc sắp chia tay; đổi thành "Lúc chia tay".
- Bài chưa có câu 8 tr.26 (cáo có phải nhân vật truyện đồng thoại không), câu 1 mục "Nghĩa của từ ngữ" (yếu tố "hoá" trong "cảm hoá": các từ như "tự động hoá"), và bài đặt câu với "cốt lõi".
- Câu trong kho ôn (không nằm trong section) không được walk chạy qua. Đề có đoạn trích dài như `lua-mi-truoc`, `vi-sao-don-dieu`, `mau-lua-mi` có thể phải cuộn trên điện thoại trong phiên ôn; walk chỉ kiểm bố cục trong phần học.
- Recap và card `doi-khac`, `cam-xuc-chia-tay`, hai mục của `noi-doi-khac` và câu `rule` "Màu lúa mì sẽ làm cáo nhớ bạn." (video `bi-mat-cua-cao`, cảnh `s02-mau-lua-mi`) gọi hoàng tử bé là "bạn", dễ nghe như nói với trẻ. Đổi thành "hoàng tử bé" cùng lúc ở recap và kịch bản (build kiểm nguyên văn), rồi `pnpm video:build` lại.

## Chờ chủ dự án nghe duyệt

- Whisper nghe lệch, cần nghe tai: `bi-mat-cua-cao` "Màu lúa mì sẽ làm cáo nhớ bạn." (nghe thành "như bạn", giây ~26), "mắt trần" (nghe thành "mắt chân", giây ~41); `cam-hoa-la-gi` "Chưa cảm hoá thì…" (nghe thành "Chứ", giây ~37). Tệp: `public/media/video/neu-cau-muon-co-mot-nguoi-ban/`.
