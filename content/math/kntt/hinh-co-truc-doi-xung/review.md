# Review: Hình có trục đối xứng (`hinh-co-truc-doi-xung`)

- Bài: `content/math/kntt/hinh-co-truc-doi-xung/lesson.json`
- Vòng: 5 - chỉ phần đổi (`pnpm content:diff`), section: `quanh-ta`, `truc-doi-xung`, `chu-nhat-thoi`, `thang-can-binh-hanh`, `chu-cai-chu-so`, `do-vat-bieu-tuong`, `diem-doi-xung`, `ve-them-hinh`, `bai-tap-sach-bai-tap`
- Nguồn đã đọc: `sources/math/hinh-co-truc-doi-xung/` - sbt-p81 (5.3), sbt-p119 (5.10; lời giải chỉ liệt kê 10 số), đề 5.6 và 5.10 không đổi
- Đọc hiểu (Haiku, lượt 1): 215 / 1 / 0 trên toàn bài (trước vòng 1, `.shots/review/hinh-co-truc-doi-xung/doc-hieu.md`); chữ đổi sau vòng 2: lượt 1 72 / 7 / 0 (`doc-hieu-2.md`), lượt 2 7 / 6 / 1 (`doc-hieu-3.md`), lượt 3 8 / 4 / 0 (`doc-hieu-4.md`, hết 3 lượt)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- `lesson:walk`: 0 FAIL, 0 cảnh báo trên iPad dọc, iPad ngang, điện thoại; ảnh trong `.shots/walk/hinh-co-truc-doi-xung/`. `visual:shot` (02:53, sau commit sửa 02:50): đã mở `chu-b`, `thumb-house`, `cham-gap-doi` (nhãn mới), không chồng, không cắt
- Kết luận: Không còn lỗi Nghiêm trọng (2 Nên sửa); đã ghi reviewedHash bằng `--mark`, chưa `--approve`, chờ lượt đọc hiểu cuối
- Bản đã review: `382586187d4b71d3991df63a8714353e13cde67cb8ec2c6ebcf3f0790e11ce68` (`pnpm content:diff` so với bản này)

Đã tự giải: `s4-on-ghep-so-truc` (ngôi nhà 1, hình bình hành nghiêng 0, hình thoi 2; cả ba đã dạy ở section 1 đến 4, không còn tam giác đều), `s6-on-chu-b-truc` (B: trục nằm ngang), `sbt-5-10` (4 + 6 = 10, đủ 10 số của tr.119), `l55-dau-cong` (2 trục), `s3-cheo-thoi`, `s9-buoc-dau`. "Tam giác lệch" đã đổi hết, còn `scalene` chỉ là id nội bộ. Nhắc lại 5.6 nay khớp màn dạy đếm ô (`theo cột`). Hai điểm tác giả hỏi: chữ B lộ một phần đáp án 5.3 (Nên sửa 1); `sbt-5-10` bỏ liệt kê sáu số là chấp nhận được vì tr.119 chỉ ghi dãy 10 số và hình lời giải có đủ (Góp ý 1).

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu ôn `s6-on-chu-b-truc` dùng chữ B, nằm trong đáp án 5.3a (LL-07)

- Vị trí: `$.exercises[45]` (`ex.s6-on-chu-b-truc`, đề "Chữ B có đúng một trục đối xứng", visual `chu-b`)
- Nguồn: tr.81 (5.3), tr.118 (lời giải 5.3)
- Vấn đề: 5.3a yêu cầu chạm các chữ có đúng một trục, đáp án gồm A, B, M, Y, 3. Đề câu ôn nói thẳng B có đúng một trục, trục nằm ngang, nên bé chưa làm 5.3a đã biết một đáp án. Mức Nên sửa (không Nghiêm trọng) vì câu kho ôn không đứng ngay trước câu sách như câu dẫn, chỉ lộ một trong năm chữ, và `s1-on-cham`, `s1-on-la` cũng đã dùng Z, N của 5.3 làm hình không trục. Vòng 4 chính reviewer đã gợi ý chữ B mà không đối chiếu đáp án 5.3.
- Sửa: bỏ ràng buộc "trục ngang": dùng chữ V (một trục thẳng đứng, không thuộc 5.3; V chỉ là một đáp án nối tờ giấy của 5.7, câu này không nói tờ nào), thêm visual `chu-v` cùng kiểu `chu-b`, đổi đề và `explain` ("Gấp chữ V theo đường thẳng đứng ở giữa thì nửa trái chồng khít nửa phải"; `wrong` cho "Nằm ngang": nửa trên chỉ có một đầu nhọn, nửa dưới là hai nhánh). Hoặc giữ B nếu chủ dự án chấp nhận lộ một chữ.

### 2. `explain` của `s2-on-nhieu-truc` nói "Mỗi hình có số trục khác nhau" (LL-17)

- Vị trí: `$.exercises[?(@.id=='hinh-co-truc-doi-xung.ex.s2-on-nhieu-truc')].explain.text`
- Nguồn: —
- Vấn đề: bản viết lại theo đọc hiểu nghe như mọi hình đều có số trục khác nhau, trái với chính lời giải: ngôi nhà và cánh bướm (ở `wrong`) cùng có một trục.
- Sửa: "Số trục của các hình có thể khác nhau. Bàn chân trái không có trục, ngôi nhà có một trục. Một số hình khác có nhiều trục."

## Góp ý

### 1. `explain` của `sbt-5-10` chưa nêu vì sao các số đó đối xứng

- Vị trí: `$.exercises[?(@.id=='hinh-co-truc-doi-xung.ex.sbt-5-10')].explain.text`
- Nguồn: tr.119 (5.10)
- Vấn đề: bản mới đủ số nhóm và đúng 4 + 6 = 10; sáu số nhóm hai nằm ở hình lời giải `sbt-5-10-giai`, chấp nhận được vì tr.119 cũng chỉ liệt kê 10 số. Câu cuối "Mỗi thẻ chỉ có một tấm, nên hai nhóm cho 10 số" nối "nên" chưa chặt, và chưa nói 0, 1, 8 có trục thẳng đứng, còn 2 và 5 là hình đối xứng của nhau.
- Sửa: tuỳ tác giả, thay câu cuối bằng "Thẻ 0, 1, 8 có trục thẳng đứng, còn 2 và 5 đối xứng với nhau. Cộng lại có 10 số." (vẫn 3 câu).
