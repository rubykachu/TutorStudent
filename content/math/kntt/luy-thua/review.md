# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Vòng: 12 - chỉ phần đổi (`pnpm content:diff luy-thua --root content`), phần đổi: lựa chọn của `luy-thua.ex.chon-co-so-2` (bỏ `\concept`, đổi thành 2⁶, 6², 2³, 3²) và `luy-thua.ex.chon-bang-1-nhieu` (cặp 4⁰, 4¹ đổi thành 8⁰, 8¹); section soát lại cùng: `luy-thua.section.co-so-so-mu`, `luy-thua.section.so-mu-0`
- Nguồn đã đọc: `sources/math/luy-thua/` - p22 (cơ số, số mũ); quy ước a⁰ = 1 ở tr.24 (`p23-24.png`) không đổi so với vòng trước, không mở lại
- `content:check`: 1 lỗi của bài (`[review-hash]`, do bài đổi sau lần duyệt trước), 1 cảnh báo (2 id chưa có trong `ids.lock.json`, cần chạy `pnpm content:lock`)
- `lesson:walk`: không chạy. Server ở cổng 3001 phục vụ bản cũ hơn `lesson.json`, và walk không đi kho ôn, nên không có ảnh của hai câu đã sửa; soát trên JSON và mã visual trong `src/visuals/math/luy-thua/`.
- Kết luận: Đã xuất bản
- Bản đã review: `7e2a0149acf9cd330b0ae91476ea9b98f6d5105749b6bf103251dfbd4916e0d7` (`pnpm content:diff` so với bản này)

Đã soát đạt:
- `chon-co-so-2`: bốn lựa chọn viết trơn, không còn màu khái niệm, nên trẻ phải tự nhận ra cơ số (lỗi Nghiêm trọng vòng trước đã sửa). Đúng một tập đáp án: 2⁶, 2³ có cơ số 2; 6², 3² là nhiễu đảo cơ số với số mũ (lỗi hay gặp). 2⁵ đã bỏ nên Góp ý vòng trước cũng xong. Nấc 2 `luy-thua.visual.dinh-nghia` (`DinhNghia` trong `rule-examples.tsx`) chỉ có aⁿ = a · a · … · a với nhãn "Cơ số", "Số mũ" viết bằng chữ, không chứa số nào của lựa chọn; câu hỏi không bắt gọi tên phần nên hình có nhãn không lộ đáp án. `highlight: []` hợp lệ vì có `hintVisualId`.
- `chon-bang-1-nhieu`: 8⁰ = 9⁰ = 1, còn 8¹ = 8, 9¹ = 9, đúng một tập đáp án `a`, `c`. Không còn trùng 4⁰ của recap `luy-thua.visual.the-so-mu-0` (Nên sửa vòng trước đã sửa); 8 và 9 chưa là cơ số ở ví dụ hay câu nào của card `so-mu-0` (card dùng 2, 4, 5, 6, 7). Màu `\concept` ở đây không lộ đáp án: cả 8⁰ lẫn 8¹ đều có số mũ màu tím, trẻ vẫn phải đọc số mũ là 0 hay 1. Nấc 2 `luy-thua.visual.so-mu-0-goi-y` dùng 2³ : 2³, dừng ở 8 : 8 = ? (số 8 ở đây là giá trị của 2³, không phải 8⁰), không hiện kết quả.
- Không lựa chọn nào trùng ví dụ màn quy tắc hay câu kiểm tra, luyện tập của hai section: `co-so-so-mu` dùng 4³ (`the-co-so-so-mu`, `viet-4-mu-3`), 6⁴ (`cham-co-so`), 3⁵, 5³, 8³, 3⁴; `so-mu-0` dùng 6⁰ (`chon-luy-thua-bang-1`), 5⁰ (`mu-0-bang`), 7⁰, 2⁰. Recap của hai section vẫn khớp note, không bị bản sửa đụng tới.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. Lựa chọn 2³ trùng trạng thái đầu của hình tạo luỹ thừa trong cùng section

- Vị trí: `$.exercises[?(@.id=="luy-thua.ex.chon-co-so-2")].options[2]` (`luy-thua.ex.chon-co-so-2`)
- Nguồn: tr.22, `p22.png`
- Vấn đề: `luy-thua.visual.tao-luy-thua` (màn khám phá của section `co-so-so-mu`) mở ra với 2³ (`START` trong `tao-luy-thua.tsx`). Không phải màn quy tắc nên không bắt buộc đổi, nhưng đổi thì câu ôn mới hơn.
- Sửa: thay cặp 2³ (đúng), 3² (nhiễu) bằng một cặp chưa dùng trong section, ví dụ 2⁹ và 9²; `answer` giữ `["a", "c"]`.
