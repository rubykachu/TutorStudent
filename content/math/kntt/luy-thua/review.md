# Review: Luỹ thừa với số mũ tự nhiên (`luy-thua`)

- Bài: `content/math/kntt/luy-thua/lesson.json`
- Vòng: 13 - chỉ phần đổi (`pnpm content:diff luy-thua --root content`), phần đổi: `guide: numericPower` trên màn `co-so-so-mu`; `rule: true` trên note quy tắc của 10 section; `check.relation: holds` ở `luy-thua.ex.chon-phep-dung`
- Nguồn đã đọc: `sources/math/luy-thua/` - không mở lại; chữ hiển thị của bài không đổi
- `content:check`: 1 lỗi của bài (`[review-hash]`, hết sau lệnh cuối vòng), 3 cảnh báo `[guides]` (numericPower, match, order)
- `lesson:walk`: không chạy (vòng này chỉ thêm dấu máy đọc `guide`, `rule`, không hiện trên màn)
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 1 Nên sửa, 2 Góp ý
- Bản đã review: `a1cbf287de64afbb786b13ab5696721f312479f574096fa10df35d76970ccfb8` (`pnpm content:diff` so với bản này)

Đã soát đạt:
- `rule: true` nằm đúng 10 note quy tắc, mỗi note là câu quy tắc đầu section (hoặc câu quy tắc của màn ví dụ) và caption recap section lẫn card lặp đúng từng chữ: cơ số/số mũ, số mũ 1, bình phương/lập phương, tính giá trị, nhân cùng cơ số, số không ghi số mũ, chia cùng cơ số, số mũ 0, 10ⁿ, tổng luỹ thừa của 10. Riêng `chia-cung-co-so`: note và card có thêm câu "Số mũ thứ nhất phải lớn hơn hoặc bằng số mũ thứ hai", recap section dừng ở câu trước; không sai, xem Góp ý 1.
- `guide: numericPower` ở `co-so-so-mu` blocks[2]: note "bấm cơ số, bấm phím mũ, rồi bấm số mũ" và visual `bam-mu` đúng là màn dạy cách nhập luỹ thừa cho câu `numeric` đáp án `power`.
- `chon-phep-dung` (chọn tất cả, `answer` = a, b): 4² · 4³ = 4⁵ đúng (a); 8² · 8⁴ = 8⁶ đúng (b); 2³ · 2² = 2⁵ nên 2⁶ sai (c); 3³ · 3² = 3⁵ nên 9⁵ sai (d, nhiễu sai cơ số do nhân cơ số). Tập đáp án đúng bằng tập phương trình đúng, `check.relation: holds` khớp.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Màn dạy cách nhập luỹ thừa nằm sau câu nhập luỹ thừa đầu tiên

- Vị trí: `$.exercises[?(@.id=="luy-thua.ex.viet-gon-10")]` (`numeric`, card `luy-thua.card.viet-luy-thua`, section đầu) và `$.sections[1].blocks[2].guide` (`luy-thua.section.co-so-so-mu`)
- Nguồn: —
- Vấn đề: `content:check` cảnh báo `[guides]` ở `exercises[12]`: câu đáp án luỹ thừa đầu tiên (luyện card `viet-luy-thua`) đứng trước màn hướng dẫn nhập ở section 2; trẻ gặp ô nhập luỹ thừa mà chưa được chỉ cách bấm phím "mũ" (luật người học chậm: dạy thao tác nhập trước lần dùng đầu). Không do vòng này tạo ra nhưng dấu `guide` mới làm lộ.
- Sửa: chuyển nhóm `guide: numericPower` (note + `bam-mu`) lên section `luy-thua-la-gi`, hoặc thêm một màn hướng dẫn ở section đó.

## Góp ý

### 1. Recap section `chia-cung-co-so` thiếu câu điều kiện số mũ của note

- Vị trí: `$.sections[7].recap.caption` (`luy-thua.section.chia-cung-co-so`)
- Nguồn: tr.24, `p23-24.png`
- Vấn đề: note và recap card có câu "Số mũ thứ nhất phải lớn hơn hoặc bằng số mũ thứ hai", recap section thì không, nên điều kiện quan trọng dễ bị quên ở lần ôn cuối section.
- Sửa: chép cả hai câu vào recap section (lint không đòi, nhưng đủ quy tắc hơn).

### 2. Lựa chọn 2³ trùng trạng thái đầu của hình tạo luỹ thừa trong cùng section

- Vị trí: `$.exercises[?(@.id=="luy-thua.ex.chon-co-so-2")].options[2]` (`luy-thua.ex.chon-co-so-2`)
- Nguồn: tr.22, `p22.png`
- Vấn đề: `luy-thua.visual.tao-luy-thua` mở ra với 2³ (`START`). Không bắt buộc đổi (giữ từ vòng trước).
- Sửa: thay cặp 2³, 3² bằng cặp chưa dùng trong section, ví dụ 2⁹ và 9²; `answer` giữ `["a", "c"]`.
