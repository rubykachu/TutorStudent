# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json` 
- Nguồn đã đọc: `sources/math/luy-thua/` - p22, p23-24
- `content:check`: 0 lỗi, 2 cảnh báo của bài (`$.reviewedHash` lệch và 2 id chưa có trong `ids.lock.json`: cổng review, không tính là phát hiện)
- `lesson:walk`: không chạy (bài nháp chưa được phục vụ). Trục "Trải nghiệm trên màn" soát trên ảnh chụp từng visual tại `/dev/visuals/<visualId>` (phone 390px, 59 visual, gồm `tom-tat-dinh-nghia`, `phan-tich-xep-gia-tri`, `so-mu-an-7`), cộng ảnh cũ trong `.shots/walk/luy-thua/` cho phần 1–2.
- Kết luận: Đạt: 0 lỗi Nghiêm trọng, 1 mục Nên sửa (recap phần 1 không nhắc a¹ = a: tác giả giữ recap một câu theo yêu cầu, a¹ = a nằm ở màn quy tắc và recap card `so-mu-1`; ghi trong `backlogs/lesson-luy-thua.md`), 0 Góp ý. Đã chạy `content:hash luy-thua --approve` (reviewedHash ghi, status published).

Đã tự giải cả 47 exercise trước khi đọc `answer`: mỗi câu có đúng một đáp án (đúng một tập {a, b} với `chon-phep-dung`); nhiễu phản ánh lỗi hay gặp (nhân cơ số với số mũ, đảo cơ số và số mũ, nhân số mũ thay vì cộng, nhân cơ số, nhân thay vì chia, bỏ hàng có chữ số 0). Định nghĩa, cách đọc, quy tắc nhân, chia, quy ước a⁰ = 1 và a¹ = a khớp tr.22–24. Hình gợi ý nấc 2 đều dừng ở "?" hoặc dùng số khác đề; mỗi card có ít nhất một câu ôn ngoài `practiceIds`.

Kiểm lại các mục vừa sửa theo `backlogs/lesson-luy-thua.md`:
- `chon-phep-dung`: đạt. Bốn lựa chọn chỉ còn quy tắc nhân (2³ · 2² = 2⁶ nhân số mũ, 3³ · 3² = 9⁵ nhân cơ số là nhiễu); hình gợi ý `nhan-hai-luy-thua` (3² · 3⁴, dừng ở "?") chạm đúng quy tắc; `cardIds` chỉ còn `nhan-cung-co-so`.
- `xep-gia-tri`: đạt. 2³ = 8, 3² = 9, 4² = 16, 5² = 25, mỗi luỹ thừa tối đa 2 phép nhân; hình `phan-tich-xep-gia-tri` viết mỗi luỹ thừa thành tích, không ghi giá trị, không theo thứ tự đúng.
- `ghep-thuong`: đạt. Ba cặp chỉ dùng quy tắc chia (2⁶ : 2² = 2⁴, 2⁷ : 2⁴ = 2³, 2⁷ : 2² = 2⁵), nhiễu 2⁸ là lỗi cộng số mũ; hình gợi ý `chia-hai-luy-thua` (2⁵ : 2³) dùng số khác đề.
- `chia-luy-thua-10`: đạt. Đề "Viết kết quả dưới dạng luỹ thừa của 10.", đáp án 10³ (sát HĐ3c tr.24), chỉ còn một phép trừ số mũ.
- Câu "Số không ghi số mũ thì có số mũ là 1, như 5 = 5¹." (note phần nhân, recap phần, recap card `nhan-so-mu-1`): đạt, ví dụ 5 = 5¹ nối với a¹ = a; visual `quy-tac-so-mu-an` và `tom-tat-nhan` vẽ 5³ · 5 = 5³ · 5¹ = 5⁴.
- Câu mới `tinh-8-mu-1` (card `so-mu-1`): đạt; hình gợi ý `so-mu-1` dùng 5¹ = 5, không lộ 8.
- Câu mới `chon-7-nhan-7-mu-3` (card `nhan-so-mu-1`): đạt; nhiễu 7³ (bỏ quên thừa số 7) và 49³ (nhân cơ số); hình `so-mu-an-7` khoanh 7 = 7¹ rồi dừng ở "1 + 3 = ? thừa số".
- Mọi `caption` recap (phần và card) ≤ 2 câu; recap phần 1 là một câu + visual `tom-tat-dinh-nghia` có nhãn "Cơ số", "Số mũ", "5 thừa số".

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Recap phần 1 bỏ mất quy tắc a¹ = a mà phần này dạy và luyện

- Vị trí: `$.sections[0].recap` (`luy-thua.section.luy-thua-la-gi`), visual `luy-thua.visual.tom-tat-dinh-nghia`
- Nguồn: tr.23, `p23-24.png` ("Chú ý. Ta có a¹ = a")
- Vấn đề: phần 1 dạy riêng quy tắc số mũ 1 (group "Số mũ bằng 1 thì luỹ thừa bằng chính cơ số." + `quy-tac-so-mu-1`) và có câu luyện tập `viet-9-mu-1` cho nó, nhưng recap mới chỉ còn câu cơ số/số mũ và hình 2⁵ = 2 · 2 · 2 · 2 · 2; cả `caption` lẫn visual không còn a¹ = a (bản trước có dòng 6¹ = 6). Recap là màn cuối trẻ mang theo khi rời phần, nên lệch với nội dung phần. Phần 3 lại dựa vào quy tắc này ("5 = 5¹"). Giới hạn 2 câu vẫn còn chỗ cho một câu nữa.
- Sửa: thêm câu thứ hai vào `caption`: "Số mũ bằng 1 thì luỹ thừa bằng chính cơ số." và thêm một dòng ví dụ có nhãn (vd 6¹ = 6) vào `tom-tat-dinh-nghia`. Nếu cố ý giữ recap một câu thì ghi rõ lựa chọn đó vào backlog để vòng review sau không ghi lại.

## Góp ý

Không có.
