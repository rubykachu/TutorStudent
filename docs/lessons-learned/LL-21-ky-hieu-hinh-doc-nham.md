# LL-21 — Ký hiệu, nhãn trong hình đọc nhầm thành phép toán

## Triệu chứng

Một ký hiệu trang trí hay ký hiệu khái niệm (dấu hình của màu khái niệm, mũi tên, gạch) đứng sát số trong hình và trông giống một dấu phép tính, nên trẻ đọc ra một phép tính khác với điều hình muốn nói. Thường gặp khi dấu khái niệm có hình thập (`sky` là `cross`, trông như "+"), hình gạch chéo (trông như "/" hay "−"), đặt cùng cỡ, cùng màu với chữ số và không có chú giải.

## Ví dụ thật

- `so-nguyen-to` vòng 1, mọi hình kind `column` (`cot-60`, recap `cot-60-xong`, `cot-thieu-150`, lời giải…): `ConceptMark` màu sky (hình thập) đứng ngay trước mỗi số chia, nên sơ đồ cột hiện "150 | ✚2", "75 | ✚?", đọc thành "+2" trong một sơ đồ của phép chia. Hình cây cùng bài đặt dấu nhỏ ở góc và có chú giải, hình cột thì không. Ảnh walk `phone/081-s7-05-exercise-cot-thieu-150.png`.
- `on-tap-chuong-2` vòng 2: công thức ví dụ viết "số:" rồi phép tính (`1\,836:\ 1 + 8 = 9 \chiahet 3` ở `tip.chia-het-3`, `2\,133:\ ...` ở `tip.loai-hop-so-nhanh`, `461:\ ...` ở `explain` của `ex.tn2`, `30 < n < 50:\ n = 36,\ 48` ở hình `khoang-bcnn`). KaTeX in ":" có khoảng trắng như phép chia nên đọc thành "1 836 chia 1 cộng 8". Mẫu này do chính câu "Sửa" của review vòng 1 đề xuất. Trong TeX, ":" chỉ dùng cho phép chia; số đang xét và phép tính về nó đặt hai dòng (`gathered`) hoặc nói số trong `text`.
- `cach-ghi-so-tu-nhien` vòng 1: hình chạm khe `gaps` vẽ khe đã chọn thành khung đen bo tròn cao bằng ô chữ số, đè lên chữ số hai bên, nên 8 152 đọc thành "8 0 1 5 2" ngay sau section dạy viết thêm chữ số 0. Ô được chọn nên hiện chính thứ bé vừa đặt (chữ số viết thêm), không là một hình rỗng có thể đọc thành ký hiệu.
- `phep-cong-phep-tru-so-nguyen` vòng 1: nhãn màu sky (hình thập) "số đối của −5" hiện thành "✚ số đối của −5" trong bài dạy phép cộng, và nhãn slate (hình gạch ngang) "cộng với 0" hiện thành "− cộng với 0" ở mọi hình `rows`, `lines` của bài. Ảnh walk `phone/021-s2-02-block.png`.

## Nguyên nhân gốc

Dấu hình được thêm để trẻ mù màu phân biệt khái niệm (`docs/design-system.md`, nguyên tắc 5), nhưng người làm hình chỉ kiểm có dấu, không đọc lại hình như một trẻ chưa biết quy ước: dấu đứng sát số thành một phần của biểu thức.

## Cách phòng

- `lesson-visual`: dấu khái niệm đặt ở góc trên của số với cỡ nhỏ hơn chữ số rõ rệt, hoặc thay bằng một chú giải chung khi mọi số trong cột, hàng cùng một khái niệm; không đặt dấu thập hay gạch ngay trước hay sau một số. Hình có dấu khái niệm thì có `Legend`.
- Người: khi tự xem ảnh và khi review, đọc to từng hàng của hình như trẻ đọc ("một trăm năm mươi, cộng hai…"); hàng nào đọc ra phép tính không có trong bài thì sửa. Checklist trục 5.

## Trạng thái

Chỉ người soát.
