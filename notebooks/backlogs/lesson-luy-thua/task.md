# Bài Luỹ thừa với số mũ tự nhiên — việc còn lại

Bài đã `published` (xem `content/math/kntt/luy-thua/review.md`). Mọi câu bài học nằm trong `lesson.json` (`note` trong các `group` của màn quy tắc, `caption` của visual recap), nên sửa câu nào cũng đổi `reviewedHash` và phải review lại. Visual của màn quy tắc và recap (`src/visuals/math/luy-thua/rule-examples.tsx`) chỉ vẽ ví dụ và nhãn ngắn.

- Bài chia thành 11 section (mỗi section tối đa 4 màn, 4 bài tập, recap một câu). Góp ý còn lại của review: câu kiểm tra `viet-4-mu-3`, `viet-1000`, `chon-2-mu-7` có đáp án nằm sẵn trên màn giải thích cùng section (câu kiểm tra không tính điểm nhớ); hình gợi ý nấc 2 của `tach-5-247` chỉ còn một bước tới đáp án.
- Trong hình chia và hình số mũ 0, số trong các hạt bị gạch khó đọc: cách vẽ hạt bị gạch nằm ở `src/visuals/shared/bead-group.tsx` (dùng chung mọi bài), việc của người giữ visual dùng chung.
- Nấc 1 của `lap-phuong-4`, `chon-10-lap-phuong`, `binh-phuong-8`, `tim-o-16-hat`, `chon-6-lap-phuong` tô cả câu đề (đề chỉ có một câu chữ). Checklist review coi đây là quy ước được phép; muốn tô trúng phần thì phải thêm khối `formula` có `\htmlId`, nhưng ghi "4 lập phương" thành 4³ trong đề sẽ bỏ mất bước đọc tên mà câu đang kiểm.
- Khung `fillBlank` trên phone ngắt dòng giữa thừa số và ô trống (`tach-5-247`: "2 ·" rồi ô trống ở dòng sau). Việc của app.
- Số mũ viết bằng ký tự mũ Unicode (aⁿ, 2⁵) trong `note`/`caption` hiện nhỏ so với chữ thân bài. Việc của app (cỡ chữ mũ trong văn bản), không riêng bài này.
- `pnpm lesson:walk` tự mở server ở cổng thử (3100) bằng `next dev`; khi đã có `next dev` khác chạy từ cùng thư mục, Next từ chối server thứ hai. Khi đó chạy walk với `WALK_BASE_URL=http://localhost:<cổng server đang chạy>`; server đó phải mở bằng `CONTENT_INCLUDE_DRAFT=1` mới phục vụ bài `draft`, và walk đi theo nội dung đã emit nên chạy lại `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` sau mỗi lần sửa `lesson.json`.
- Sửa bài khi server của chủ dự án đang chạy từ cùng thư mục: route bài đọc thẳng `content/` nên bài có `reviewedHash` lệch biến mất ngay. Sửa và review trong bản chép (`content:check --root <bản chép>`, `content:hash luy-thua --root <bản chép> --approve`), chỉ chép `lesson.json` đã duyệt về `content/` một lần.
- Câu kết section `luy-thua-la-gi` ("nhà vua không có đủ để thưởng") nhắc nhà vua lần đầu vì phần mở đầu (caption `ban-co` và cảnh `s01-ban-co` của video "Luỹ thừa là gì?") chưa kể chuyện nhà vua hứa thưởng thóc. Sửa cả hai cùng lúc; video đổi thời lượng thì bài phải review lại.
- Ảnh bìa của ba video: nút phát che công thức chính; chọn khung `poster` trong `script.json` có chỗ trống ở giữa.
- `minutes` của section có video chưa tính thời lượng video (60–75 giây); cần chốt luật có cộng hay không.

## Từ các luật lessons-learned (30/09/2026)

- Nên sửa (review vòng 13): màn `guide: "numericPower"` (`bam-mu`) ở section `co-so-so-mu`, nhưng câu kho ôn `ex.viet-gon-10` của card `viet-luy-thua` (section đầu) đã bắt nhập luỹ thừa. Chuyển màn hướng dẫn lên section đầu (cảnh báo `[guides]`, LL-04).
- Cảnh báo `[guides]` về `match`, `order`: hết khi bài `tap-hop` có hai màn hướng dẫn đó.
- Góp ý: recap section `chia-cung-co-so` thiếu câu "Số mũ thứ nhất phải lớn hơn hoặc bằng số mũ thứ hai" mà note và card có.
- Recap section `luy-thua-la-gi` chèn "(đọc là “a mũ n”)" vào câu định nghĩa nên note đó chưa đánh `rule` (LL-05).
