# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Vòng: 11 - chỉ phần đổi (`pnpm content:diff luy-thua --root content`), phần đổi: thêm 2 câu `choice` `multiple: true` vào kho ôn, `luy-thua.ex.chon-co-so-2` (card `co-so-so-mu`) và `luy-thua.ex.chon-bang-1-nhieu` (card `so-mu-0`); section soát lại cùng: `luy-thua.section.co-so-so-mu`, `luy-thua.section.so-mu-0`
- Nguồn đã đọc: `sources/math/luy-thua/` - p22 (cơ số, số mũ), p23-24 (quy ước a⁰ = 1 ở tr.24)
- `content:check`: 1 lỗi của bài (`[review-hash]`, do bài đổi sau lần duyệt trước), 1 cảnh báo (2 id chưa có trong `ids.lock.json`, cần chạy `pnpm content:lock`)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/luy-thua/`. Server ở cổng 3001 đang phục vụ bản cũ hơn `lesson.json`, và walk chỉ đi qua section, không đi kho ôn, nên hai câu mới không có ảnh walk; màu trong lựa chọn công thức soát trên ảnh `095-s6-05-exercise-chon-2-mu-7.png` (lựa chọn giữ màu `\concept`), recap card `so-mu-0` trên ảnh `149-s9-05-recap.png`.
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `8772051d7e9c3aa437a96317aa5eb00058be80208d951522218117490c391f86` (`pnpm content:diff` so với bản này)

Đã soát đạt: mỗi câu có đúng một tập đáp án đúng (2⁵, 2³ có cơ số 2; 4⁰ = 9⁰ = 1, còn 4¹ = 4, 9¹ = 9); đề mở đầu "Chọn tất cả…", 2 đáp án đúng trong 4 lựa chọn; nhiễu phản ánh lỗi hay gặp (đảo cơ số với số mũ ở 5², 3²; lẫn a⁰ với a¹ ở 4¹, 9¹); kiến thức nằm trong tr.22 và tr.24, trong chương trình lớp 6. Nấc 2 `luy-thua.visual.dinh-nghia` (aⁿ có nhãn "Cơ số", "Số mũ", viết bằng chữ) hợp làm gợi ý cho câu tìm luỹ thừa có cơ số 2: câu không bắt gọi tên phần, hình chỉ nhắc lại vị trí cơ số và không chứa số nào của lựa chọn. Nấc 2 `luy-thua.visual.so-mu-0-goi-y` dùng 2³ : 2³ và dừng ở 8 : 8 = ?, khác số với cả bốn lựa chọn. Hai câu không làm hỏng câu kiểm tra, câu luyện tập hay recap của hai section.

## Nghiêm trọng

### 1. Màu khái niệm trên lựa chọn lộ đáp án câu tìm cơ số

- Vị trí: `$.exercises[?(@.id=="luy-thua.ex.chon-co-so-2")].options[*].content.tex` (`luy-thua.ex.chon-co-so-2`)
- Nguồn: tr.22, `p22.png`
- Vấn đề: câu bắt trẻ nhận ra số nào là cơ số, nhưng mọi lựa chọn đều tô cơ số màu xanh (`\concept{blue}{…}`), số mũ màu tím, và app giữ màu này trong ô lựa chọn. Trẻ chỉ cần tìm "số 2 màu xanh" là chọn đúng, không cần biết cơ số nằm ở đâu; nhiễu 5², 3² (số 2 màu tím) mất tác dụng. Đây là trường hợp "màu chính là đáp án" mà luật màu khái niệm cấm ở cả đề, hình lẫn highlight.
- Sửa: bỏ `\concept` khỏi cả bốn lựa chọn, viết trơn như `2^{5}`, `5^{2}`, `2^{3}`, `3^{2}`. Giữ `highlight: []` và nấc 2 `luy-thua.visual.dinh-nghia`.

## Nên sửa

### 1. Lựa chọn 4⁰ trùng ví dụ recap của card `so-mu-0`

- Vị trí: `$.exercises[?(@.id=="luy-thua.ex.chon-bang-1-nhieu")].options[0]` (`luy-thua.ex.chon-bang-1-nhieu`)
- Nguồn: tr.24, `p23-24.png`
- Vấn đề: recap của card và section `so-mu-0` (`luy-thua.visual.the-so-mu-0`, ảnh `149-s9-05-recap.png`) ghi đúng "4⁰ = 1". Câu kho ôn của card phải khác số với ví dụ trên màn quy tắc; phiên ôn hiện recap này rồi hỏi lại 4⁰ thì trẻ chỉ nhớ lại hình vừa xem.
- Sửa: đổi cặp 4⁰, 4¹ sang một cơ số chưa dùng trong card `so-mu-0` (card đã dùng 2, 4, 5, 6, 7), ví dụ 8⁰ (đúng) và 8¹ (nhiễu); `answer` giữ `["a", "c"]`.

## Góp ý

### 1. Lựa chọn 2⁵ trùng ví dụ đã gặp trong bài

- Vị trí: `$.exercises[?(@.id=="luy-thua.ex.chon-co-so-2")].options[0]` (`luy-thua.ex.chon-co-so-2`)
- Nguồn: tr.22, `p22.png`
- Vấn đề: 2⁵ là ví dụ của màn hướng dẫn phím mũ trong cùng section ("Ví dụ: viết 2⁵ trên bàn phím số.") và của màn `la-gi` ở section đầu. Không phải màn quy tắc của card nên không bắt buộc đổi, nhưng đổi số thì câu ôn mới hơn.
- Sửa: dùng cặp khác, ví dụ 2⁶ (đúng) và 6² (nhiễu) thay cho 2⁵ và 5².
