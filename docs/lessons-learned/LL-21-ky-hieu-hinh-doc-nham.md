# LL-21 — Ký hiệu, nhãn trong hình đọc nhầm thành phép toán

## Triệu chứng

Một ký hiệu trang trí hay ký hiệu khái niệm (dấu hình của màu khái niệm, mũi tên, gạch) đứng sát số trong hình và trông giống một dấu phép tính, nên trẻ đọc ra một phép tính khác với điều hình muốn nói. Thường gặp khi dấu khái niệm có hình thập (`sky` là `cross`, trông như "+"), hình gạch chéo (trông như "/" hay "−"), đặt cùng cỡ, cùng màu với chữ số và không có chú giải.

## Ví dụ thật

- `so-nguyen-to` vòng 1, mọi hình kind `column` (`cot-60`, recap `cot-60-xong`, `cot-thieu-150`, lời giải…): `ConceptMark` màu sky (hình thập) đứng ngay trước mỗi số chia, nên sơ đồ cột hiện "150 | ✚2", "75 | ✚?", đọc thành "+2" trong một sơ đồ của phép chia. Hình cây cùng bài đặt dấu nhỏ ở góc và có chú giải, hình cột thì không. Ảnh walk `phone/081-s7-05-exercise-cot-thieu-150.png`.

## Nguyên nhân gốc

Dấu hình được thêm để trẻ mù màu phân biệt khái niệm (`docs/design-system.md`, nguyên tắc 5), nhưng người làm hình chỉ kiểm có dấu, không đọc lại hình như một trẻ chưa biết quy ước: dấu đứng sát số thành một phần của biểu thức.

## Cách phòng

- `lesson-visual`: dấu khái niệm đặt ở góc trên của số với cỡ nhỏ hơn chữ số rõ rệt, hoặc thay bằng một chú giải chung khi mọi số trong cột, hàng cùng một khái niệm; không đặt dấu thập hay gạch ngay trước hay sau một số. Hình có dấu khái niệm thì có `Legend`.
- Người: khi tự xem ảnh và khi review, đọc to từng hàng của hình như trẻ đọc ("một trăm năm mươi, cộng hai…"); hàng nào đọc ra phép tính không có trong bài thì sửa. Checklist trục 5.

## Trạng thái

Chỉ người soát.
