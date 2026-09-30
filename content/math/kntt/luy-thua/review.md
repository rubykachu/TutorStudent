# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Vòng: 10 - chỉ phần đổi (`pnpm content:diff luy-thua --base HEAD`, vì bản vòng 9 chưa được commit), phần đổi: khối `overview` (hook, summary sửa theo 2 lỗi `[length]` vòng trước) và `overview.narration` build lại; không section nào đổi.
- Nguồn đã đọc: `sources/math/luy-thua/` - p22 (chuyện bàn cờ, đã đối chiếu ở vòng 8; phần đổi không thêm kiến thức mới)
- `content:check`: 1 lỗi của bài (`[review-hash]`, do bài đổi sau lần duyệt trước), 0 cảnh báo; 2 lỗi `[length]` đã hết
- `lesson:walk`: không chạy vòng này (diff chỉ có `overview`). Lời đọc kiểm trực tiếp: `public/media/narration/luy-thua/overview.m4a` (49,6 giây) và `overview.vtt` build lại, chữ trong vtt khớp đủ và đúng thứ tự hook mới, summary mới, câu dẫn "Học xong bài này, bạn sẽ:", bốn goals và whyItMatters.
- Kết luận: Đã xuất bản
- Bản đã review: `eac0c28c40dc5fd60cc665982df129223ae277094d7fe446647dc08dd96ba237` (`pnpm content:diff` so với bản này)

Đã sửa đúng từ vòng trước: câu dài nhất của hook còn 18 tiếng, summary còn 23 và 16 tiếng (tối đa 25). Summary nêu ví dụ "hai nhân hai nhân hai viết là hai mũ ba", đúng. Hook giữ tình huống đời sống (tin đồn) theo yêu cầu của chủ bài rồi nối sang bàn cờ, không còn ghép bằng "cũng như" trong một câu dài.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Hook chưa nói tin đồn và bàn cờ cùng một ý "gấp đôi", câu tin đồn đếm người chưa rõ

- Vị trí: `$.overview.hook.text`
- Nguồn: tr.22, `p22.png`
- Vấn đề: hai câu đầu đứng cạnh nhau mà không có chữ nối, người học chậm nghe xong tin đồn rồi sang "Trên bàn cờ này" dễ tưởng là hai chuyện khác nhau và không biết tin đồn để làm gì. Câu tin đồn còn đếm lẫn: "một bạn kể cho hai bạn" rồi "số bạn biết lại gấp đôi" khiến trẻ phân vân ngày đầu có hai hay ba bạn biết. Hai ví dụ cùng ý tưởng nên giữ cả hai, chỉ cần nói ra chỗ giống nhau.
- Sửa: giữ tình huống đời sống, thêm chữ nối "cũng vậy" và bỏ phép đếm người: "Một tin đồn lan rất nhanh: mỗi ngày, số bạn biết lại gấp đôi. Bàn cờ này cũng vậy: ô đầu có một hạt thóc, mỗi ô sau gấp đôi ô trước. Theo bạn, ô cuối có bao nhiêu hạt?" (14, 18 và 8 tiếng). Sửa xong chạy lại `pnpm narration:build luy-thua`.

## Góp ý

Không có.
