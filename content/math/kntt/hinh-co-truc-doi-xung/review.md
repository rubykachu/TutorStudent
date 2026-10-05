# Review: Hình có trục đối xứng (`hinh-co-truc-doi-xung`)

- Bài: `content/math/kntt/hinh-co-truc-doi-xung/lesson.json`
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`), section: `quanh-ta`, `truc-doi-xung`, `chu-nhat-thoi`, `thang-can-binh-hanh`, `chu-cai-chu-so`, `do-vat-bieu-tuong`, `diem-doi-xung`, `ve-them-hinh`, `bai-tap-sach-bai-tap`
- Nguồn đã đọc: `sources/math/hinh-co-truc-doi-xung/` - sbt-p81, sbt-p82, sbt-p83, sbt-p118, sbt-p119 (đối chiếu 5.5, 5.6, 5.10 với câu sách và câu "Nhắc lại" đổi; đề không đổi)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): 215 / 1 / 0 trên toàn bài (trước vòng 1, `.shots/review/hinh-co-truc-doi-xung/doc-hieu.md`); chữ đổi sau vòng 2: lượt 1 72 / 7 / 0 (`doc-hieu-2.md`), lượt 2 7 / 6 / 1 (`doc-hieu-3.md`), giao tác giả viết lại
- `lesson:walk`: 0 FAIL, 0 cảnh báo trên iPad dọc, iPad ngang, điện thoại; ảnh trong `.shots/walk/hinh-co-truc-doi-xung/`. `visual:shot`: thư mục `.shots/hinh-co-truc-doi-xung/` còn ảnh cũ (giờ ghi 02:17, trước commit sửa 02:33), chưa có ảnh `chu-e`, ảnh `cham-gap-doi` chưa là bản tam giác lệch; hình mới chưa mở xem được
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `2a8695dff091eef44d6a791997cb7d9c3da51903abba816fd67aeb46d5bac6b1` (`pnpm content:diff` so với bản này)

Bốn Nên sửa vòng 3: hai mục đã sửa đúng (`s1-on-cham` thay lá cờ bằng tam giác lệch, khác nhiễu của `s1-chon-hinh-gap-doi`; `s7-on-khong-truc` đổi đáp án sang tam giác lệch và chìa khóa, không còn hình của màn dạy), hai mục sửa chưa xong (`s4-on-ghep-so-truc` thành lỗi Nghiêm trọng dưới đây; `s6-on-chu-d-truc` đổi sang chữ E nay trùng ví dụ màn quy tắc). Lý do `wrong` của `s3-cheo-thoi` đã dễ đọc nhưng thêm chữ "Chỉ" quá rộng. Đã tự giải: `sbt-5-10` (4 + 6 = 10 số, khớp tr.119), `l55-dau-cong` (chữ thập cánh ngang dài: 2 trục), `s6-on-chu-e-truc` (E: trục nằm ngang), `s8-xep-buoc-dung` (thứ tự đúng 1-2-3); các câu viết lại theo đọc hiểu giữ nguyên ý và số liệu; "Biển cấm" khớp nhãn hình `bieu-tuong-the` và `do-vat-quy-tac`. Sheet walk các màn "Nhắc lại 5.6" và `s8-xep-buoc-dung` không chồng, không cắt.

## Nghiêm trọng

### 1. Câu ôn `s4-on-ghep-so-truc` hỏi số trục của tam giác đều, chưa dạy ở section của card (LL-09, LL-20)

- Vị trí: `$.exercises[40].left[2]` (`ex.s4-on-ghep-so-truc`, `deu` = `thumb-triangle`, đáp án "3 trục"; `cardIds` = `card.thang-can-binh-hanh`)
- Nguồn: tr.118 (5.1, 5.2)
- Vấn đề: bản sửa theo vòng 3 (tránh trùng ba hình của câu luyện) đưa tam giác đều vào câu gắn card section 4. "Tam giác đều có 3 trục" chỉ được dạy ở section 5 `hinh-deu` (câu quy tắc và recap), không có chữ nào trước đó. Câu kho ôn gắn card section 4 hiện ra khi bé chưa học điều cần để nối.
- Sửa: dùng hình đã dạy ở section 1 đến 4 và bộ số trục khác câu luyện `ex.s4-chon-hinh-co-truc` (hình thoi, cổng đền, tấm gạch bình hành nghiêng, hình thang cân), hoặc giữ tam giác đều và chuyển `cardIds` sang `card.hinh-deu` (khi đó đổi hai hình còn lại để không trùng câu luyện của card đó).

## Nên sửa

### 1. Câu ôn `s6-on-chu-e-truc` có đáp án trùng ví dụ của màn quy tắc (LL-07, LL-20)

- Vị trí: `$.exercises[45]` (`ex.s6-on-chu-e-truc`); so với visual `chu-cai-quy-tac` (nhãn "Chữ E: 1 trục nằm ngang") và `chu-cai-the` (thẻ T, E, I, L) của section 6
- Nguồn: tr.81 (5.3)
- Vấn đề: bản sửa thay chữ D (trùng câu dẫn 5.3a) bằng chữ E, nhưng E là ví dụ chính của màn dạy: nhãn hình quy tắc đã ghi đúng "1 trục nằm ngang", bé trả lời bằng trí nhớ.
- Sửa: dùng chữ có một trục ngang chưa xuất hiện ở section 6 và ở câu dẫn 5.3 (ví dụ chữ B), cần thêm visual `chu-b` cùng kiểu `chu-e`.

### 2. Lý do `wrong` của `s3-cheo-thoi` nói "Chỉ hình chữ nhật" quá rộng (LL-17)

- Vị trí: `$.exercises[7].explain.wrong[0].text` (`ex.s3-cheo-thoi`)
- Nguồn: tr.80
- Vấn đề: "Chỉ hình chữ nhật có hai cạnh dài ngắn khác nhau thì đường chéo mới không phải là trục" nghe như chỉ hình chữ nhật có đường chéo không phải trục. Section 4 dạy ngay đường chéo hình bình hành cũng không phải trục.
- Sửa: "Với hình thoi, cả hai đường chéo đều là trục. Hình chữ nhật có hai cạnh dài ngắn khác nhau thì đường chéo không phải trục."

## Góp ý

### 1. Câu "Nhắc lại" mới cho 5.6 ngắn hơn ý của màn dạy

- Vị trí: `$.sections[11].blocks[2].children[2]` (section `bai-tap-sach-bai-tap`): "Trục d nằm ngang thì đếm số ô theo cột."
- Nguồn: tr.82 (5.6c)
- Vấn đề: chưa nói đếm từ điểm tới d rồi đếm bằng ấy số ô bên kia d.
- Sửa: tuỳ tác giả, "Trục d nằm ngang thì đếm số ô từ điểm tới d theo cột, rồi đếm bằng ấy số ô bên kia d."

### 2. "Tam giác lệch" và tên hình "ba cạnh khác nhau"

- Vị trí: `$.exercises[35].explain.text`, `$.exercises[47].explain.text`; nhãn `tam-giac-lech` trong visual `cham-gap-doi`; tên hình `scalene` ("Hình tam giác có ba cạnh khác nhau")
- Nguồn: —
- Vấn đề: một hình hai tên; bài chưa dạy từ "tam giác lệch".
- Sửa: tuỳ tác giả, gọi "tam giác ba cạnh khác nhau" ở cả hai chỗ.

### 3. Nhãn đường gấp nhảy từ c sang e

- Vị trí: mọi bảng chọn đường (`LETTERS` trong `lines.ts`; `ex.s2-duong-nao-la-truc`, `ex.s2-truc-cua-cong`, `ex.s3-truc-chu-nhat`)
- Nguồn: —
- Vấn đề: bé thấy a, b, c, e và có thể hỏi đường d đâu. Chấp nhận được vì d dành cho trục.
- Sửa: tuỳ tác giả, dùng 1, 2, 3, 4 cho mọi bảng chọn đường.
