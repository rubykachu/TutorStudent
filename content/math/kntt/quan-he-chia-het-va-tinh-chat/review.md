# Review: Quan hệ chia hết và tính chất (`quan-he-chia-het-va-tinh-chat`)

- Bài: `content/math/kntt/quan-he-chia-het-va-tinh-chat/lesson.json`
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`), section: `uoc-boi`, `tong-khong-chia-het`, `so-du`
- Nguồn đã đọc: `sources/math/quan-he-chia-het-va-tinh-chat/` - sbt-p30 (mục A ý 1-4, b ≠ 0)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (103 id chưa khoá, đúng với bài draft)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/quan-he-chia-het-va-tinh-chat/`
- Kết luận: 0 Nghiêm trọng, chờ điều phối duyệt
- Bản đã review: `8d6599cef67e41b739a8094ab81c3ef28b899d788d0d3e9d490082632d660a4b` (`pnpm content:diff` so với bản này)

Diff gồm 4 mục, đều đúng:

- Note `uoc-boi` "mỗi thừa số khác 0 là một ước của tích": khớp sbt tr.30 (b ≠ 0), khớp note `tim-uoc` ("số khác 0", ảnh `phone/054`); recap section và recap card của `uoc-boi` không nhắc thừa số nên không lệch; ví dụ 24 = 6 · 4 và hình không đổi.
- `chon-nhieu-uoc-22`: đề nay hỏi ước của 22. Ước 1, 2, 11, 22; lựa chọn 3, 2, 11, 4, đáp án b, c (2 và 11) đúng và duy nhất; nhiễu 3 và 4 hợp lý (không là ước của 22), không thành đáp án đúng; không trùng `xep-uoc-14` và `chon-nhieu-uoc-28` ở section `tim-uoc`. Nghiêm trọng của vòng 3 đã được sửa.
- `tong-35-4` (thay `tong-30-4`): 35 chia hết cho 7, 4 không, nên 35 + 4 = 39 không chia hết cho 7; đáp án a duy nhất (b sai vì bỏ qua số hạng 4, c sai vì 35 chia hết cho 7). Khác số và số chia với câu kiểm tra `tong-24-10` (24 + 10, chia cho 6) và với ví dụ, hình của section (10 + 7 cho 5, 20 + 15 + 8 cho 5, chọn tổng không chia hết cho 4). Khớp recap.
- `dien-du-14-7` (id mới, nội dung cũ): 14 · q chia hết cho 7, 3 không chia hết cho 7, nên 14 · q + 3 không chia hết cho 7; `accept` "không chia hết" đúng, bank có nhiễu "chia hết"; đề số 14, 7, 3 không trùng câu khác của section `so-du` (12q + 9, 24q + 12, 18q + 9) và không trùng hình `so-du-34-10`.

Mục khác cùng section: note, recap, caption của `uoc-boi`, `tong-khong-chia-het`, `so-du` không đổi và vẫn khớp nguyên văn; các câu còn lại (`chon-nhieu-40-8`, `dien-boi-uoc-35-5`, `chon-goi-9-63`, `chon-boi-7`, `chon-nhieu-tong-khong-5`, `chon-so-hang-khong-7`, `dien-tong-khong-3`, `chon-12q-9`, `chon-nhieu-24q-12`, `chon-du-18-9`) tự giải lại vẫn đúng và duy nhất. Id cũ `ex.tong-30-4`, `ex.dien-du-20-6` không còn tham chiếu trong `src/`, `content/` (trừ `review.md` cũ, nay đã ghi đè), `tests/`, `scripts/`. Ba câu đổi nằm ở kho luyện của card nên walk không chụp riêng; đã đọc JSON và hình gợi ý thay cho ảnh.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. Hình gợi ý của `dien-du-14-7` chỉ minh hoạ trường hợp chia hết

- Vị trí: `$.exercises` `ex.dien-du-14-7` (`hints.hintVisualId` = `so-du-goi-y-15-10`)
- Nguồn: tr.31, 32
- Vấn đề: hình dùng số khác đề (15 · q + 10, xét cho 5) và kết luận "a chia hết cho 5", trong khi đáp án của câu là "không chia hết"; trẻ có thể thoáng nghiêng về "chia hết". Không lộ đáp án nên không chặn.
- Sửa: tuỳ tác giả, thêm một hình gợi ý riêng với số dư không chia hết (vd 15 · q + 4, xét cho 5) dừng ở "?".
