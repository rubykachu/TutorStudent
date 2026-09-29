# Bài Luỹ thừa với số mũ tự nhiên — việc còn lại

Bài đã `published` (review cuối không còn lỗi Nghiêm trọng, xem `content/math/kntt/luy-thua/review.md`). Sửa `lesson.json` thì phải review lại vì đổi `reviewedHash`; sửa chữ trong visual (`src/visuals/math/luy-thua/rules.tsx`) cũng nên review lại vì hash không bắt được.

- Mục Nên sửa duy nhất của review cuối (tổng theo hàng bỏ số hạng của chữ số 0 mà không nói vì sao) đã được sửa sau review bằng dòng "0 · 10² = 0, nên không cần viết số hạng này." trên màn tách số, recap phần luỹ thừa của 10 và thẻ ôn tổng. Lần review sau cần soát lại dòng này.
- Nấc 1 của `lap-phuong-4`, `chon-10-lap-phuong`, `binh-phuong-8`, `tim-o-16-hat`, `chon-6-lap-phuong` tô cả câu đề (đề chỉ có một câu chữ, không có phần `\htmlId` để trỏ vào).

Về app (không riêng bài này), `pnpm lesson:walk luy-thua` còn báo:
- Điện thoại 390×844: thanh dưới che hàng phím "0" ở `chia-luy-thua-10` (đề hai dòng đẩy bàn phím xuống).
- iPad ngang 1180×820: lựa chọn dạng tổng của `chon-tong-3-062` vỡ thành nhiều dòng trong lưới hai cột và bị thanh dưới che.
