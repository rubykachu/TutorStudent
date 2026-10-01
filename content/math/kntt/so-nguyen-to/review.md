# Review: Số nguyên tố (`so-nguyen-to`)

- Bài: `content/math/kntt/so-nguyen-to/lesson.json`
- Vòng: 7 - chỉ phần đổi (`pnpm content:diff`, so với bản đã review ở vòng 6), section: `bang-so-nguyen-to`, `dau-hieu-hop-so`, `viet-tong`
- Nguồn đã đọc: `sources/math/so-nguyen-to/` - không cần đọc lại (không có kiến thức mới; sbt-p35 đến sbt-p37 có trên máy)
- `content:check`: 1 lỗi của bài (`[review-hash]`, bình thường trước lệnh cuối vòng), 0 cảnh báo
- `lesson:walk`: không chạy ở vòng này; đã xem ảnh chụp `chon-nt-bang` (iPad, điện thoại), 0 chồng, 0 cắt; bản chips cuối chỉ đổi hai số, vẫn 6 chip, không chụp lại
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 3 Góp ý
- Bản đã review: `0f144b643686cd08416f4cd3dab94515376961940f26d6ea8dfd86cd6b878be9` (`pnpm content:diff` so với bản này)

## Vòng 7 - chỉ phần đổi

Phạm vi: `pnpm content:diff so-nguyen-to` (2 mục: note màn thứ hai của `dau-hieu-hop-so`, `viet-28`) và màn chạm `chon-nt-bang` (đổi trong `catalog.ts`, không nằm trong diff).

Đã soát:
- `chon-nt-bang` (33, 39, 45, 49, 73, 79; `wants` [4, 5]): tự giải, chỉ 73 và 79 là số nguyên tố (73 và 79 không có ước nào từ 2 đến căn bậc hai của chúng, có trong `bang-nt`); 33 = 3 · 11, 39 = 3 · 13, 45 = 5 · 9, 49 = 7 · 7 đều hợp số, không có trong bảng. Đáp án đúng một tập. 73 và 79 không xuất hiện ở đề, đáp án, nhiễu, `explain` hay hình nào khác của bài (kể cả `dh-nhieu`, `chon-nt-2-7`, `nha-57`, `tra-bang-nhieu` 41, 51, 53, 55, `chon-nt-bang-2` 61, 63, 67, 69, 81, 89, `dien-91`, video `tra-bang`); 33, 39, 45, 49 chỉ là nhiễu hợp số, không trùng tập đáp án của màn khác. Số 37 đã bỏ nên nhiễu 37 của `dh-nhieu` không còn là số vừa thấy ở màn trước. Ảnh iPad và điện thoại (bản chips trước, cùng 6 chip): rõ, không chồng, không cắt.
- `viet-28`: đề mới "Một nhóm có thể có ít nhất bao nhiêu viên bi?" chỉ còn một so sánh; 28 − 2 = 26 và 28 − 3 = 25 hợp số, 28 − 5 = 23 nguyên tố, nên đáp án 5 đúng (hai nhóm đối xứng, 11 + 17 cho nhóm lớn hơn 11, nên nhỏ nhất là 5); `check.expr` `28-23` = 5; `explain` hai câu, khớp đề, `tex` `28 = 5 + 23`.
- Note mới ở `dau-hieu-hop-so`: 5 + 1 = 6, 6 chia hết cho 3 nên 51 chia hết cho 3 (51 = 3 · 17), đúng; nối với hình `xet-51` ("Số nhà của Nam là 51. Cộng các chữ số được 6, chia hết cho 3.") và ý 77 = 7 · 11 ngay sau. Là `note` thường (không `rule`) nên không ảnh hưởng recap; recap `xet-65-xong` vẫn đúng câu `rule` của section. Độ dài lint đạt (`content:check` không còn lỗi nào khác của bài).
- Các mục khác cùng ba section: `rule` và recap của `bang-so-nguyen-to`, `dau-hieu-hop-so`, `viet-tong` còn đúng chữ; `nha-57`, `tra-bang-nhieu`, `dh-63`, `dh-nhieu`, `viet-40` tự giải lại, không nhiễu nào thành đáp án đúng; `explain` của `viet-40` và `dh-nhieu` không bị ảnh hưởng.
- Số mới ở `chon-nt-bang` không trùng đáp án, chip hay ví dụ của các câu cùng card `bang` (LL-07).

### Nghiêm trọng

Không có.

### Nên sửa

Không có.

### Góp ý

Không có.

## Phát hiện còn lại của vòng 3 (chưa sửa, không chặn)

### Góp ý

#### 1. Bảng `bang-100` trên iPad ngang nhỏ: chữ số khoảng 14,5px, dấu ✚ khoảng 5px (LL-12)

- Vị trí: `src/visuals/math/so-nguyen-to/prime-table.tsx` (`max-h-[32vh]`, `FONT = 18`, `MARK = 3`); ảnh `ipad-landscape/036-s4-01-block.png`
- Nguồn: —
- Vấn đề: giới hạn cao 32vh làm bảng vừa màn (hết lỗi che dòng số 1 và hàng 91–100), nhưng ở viewport 1180×820 lưới chỉ rộng khoảng 290px, chữ số còn 14,5px và dấu ✚ đường kính khoảng 5px; walk không đo chữ trong SVG nên không báo. Điện thoại 16,5px, iPad dọc lớn hơn.
- Sửa: tuỳ tác giả: nâng giới hạn lên khoảng 40vh (chữ khoảng 18px) nếu dòng "Số 1 …" vẫn còn trong màn; hoặc để nguyên và báo người làm app khi có nút "Bảng số nguyên tố" dùng chung.

#### 3. Caption `xet-65` đặt dấu hiệu chia hết cho 2 chỉ trong chữ xám, hình chỉ có hàng của 65 (LL-15)

- Vị trí: `$.sections[4].blocks[0].children[1].caption` ("Số tận cùng là 0, 2, 4, 6 hoặc 8 thì chia hết cho 2")
- Nguồn: tr.35 mục B (dấu hiệu chia hết cho 2, 3, 5, 9, kiến thức của Bài 9)
- Vấn đề: bản sửa thay câu về 80 bằng quy tắc chung của số 2, nhưng hình `xet-65` không có hàng nào cho dấu hiệu 2; trẻ chỉ gặp nó ở chữ xám. Không sai và đã học ở Bài 9, nên chỉ Góp ý.
- Sửa: thêm hàng `80 ⋮ 2` với nhãn "Tận cùng là 0" vào `xet-65` và `xet-65-xong`, rồi bỏ câu thứ hai của caption.

## Vòng 4: video và lời đọc (Góp ý còn mở)

- Góp ý: `phan-tich` có khoảng 2 giây màn trống (chỉ có bạn cú) ở đầu cảnh sơ đồ cột, trong lúc đọc "Cách thứ hai là sơ đồ cột"; câu "4 bằng 2 nhân 2" chưa nói 4 là hợp số nên tách tiếp (hình đã tô 4 màu hợp số).
