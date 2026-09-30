# Bài Nếu cậu muốn có một người bạn… — việc còn lại

Bài ở `draft` (`content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/`), `content:check --stats` đạt mọi tiêu chí, `pnpm lesson:walk` 0 FAIL ở 3 khổ. Review mới nhất: `review.md` cạnh `lesson.json`.

## Chờ chủ dự án

- Duyệt văn bản `source-passage.txt` (cùng `footnotes.txt`, `source-citation.txt`) với ảnh `sources/literature/neu-cau-muon-co-mot-nguoi-ban/p21–p25`. Chưa duyệt thì không chạy `pnpm content:hash neu-cau-muon-co-mot-nguoi-ban --approve`.
- Lỗi Nghiêm trọng duy nhất còn lại của review: định nghĩa từ ghép, từ láy (section `tu-ghep-tu-lay`, card `tu-lay`, `tu-ghep`, các câu phân loại từ và rubric bài viết) không có trong trang nguồn nào; tr.26 chỉ có đề câu 5. Gỡ bằng một trong hai cách:
  - thêm ảnh trang "Tri thức tiếng Việt" định nghĩa từ ghép, từ láy của SGK Ngữ văn 6 Chân trời sáng tạo tập một vào `sources/literature/neu-cau-muon-co-mot-nguoi-ban/`; tác giả trỏ `sourceRef` của section và hai card tới trang đó rồi soát lại câu định nghĩa và ví dụ;
  - hoặc chủ dự án cho phép dùng kiến thức đã học (đổi luật "Không có trong sách" của checklist review).
- Sau khi gỡ cả hai: review lại, `content:hash --approve`, rồi `pnpm content:lock`.

## Góp ý không chặn

- Bài chưa có câu 8 tr.26 (cáo có phải nhân vật truyện đồng thoại không), câu 1 mục "Nghĩa của từ ngữ" (yếu tố "hoá" trong "cảm hoá": các từ như "tự động hoá"), và bài đặt câu với "cốt lõi".
- Câu trong kho ôn (không nằm trong section) không được walk chạy qua. Đề có đoạn trích dài như `lua-mi-truoc`, `vi-sao-don-dieu`, `mau-lua-mi` có thể phải cuộn trên điện thoại trong phiên ôn; walk chỉ kiểm bố cục trong phần học.
