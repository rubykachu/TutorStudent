# LL-23 — Đề sách ở bài ôn tập lệch nguyên văn

## Triệu chứng

Câu có `bookRef` ở bài ôn tập (`kind: "review"`) khác lời đề của sách: mất hay thêm dấu câu, chữ, số, lựa chọn. Hay gặp nhất khi tách một câu của sách thành nhiều khối `note` và `formula`: dấu kết câu đứng ngay sau công thức bị bỏ.

## Ví dụ thật

- `on-tap-chuong-2` vòng 1, `ex.bai-2-60`, `ex.bai-2-63`: đề tách thành khối chữ và khối công thức, mất "." sau `3^{2} \cdot 5` và sau `2^{3} \cdot 3^{6}`, mất "," sau `2^{3} \cdot 3^{2} \cdot 5`. Trên điện thoại đề đọc liền "… 3² · 5 / Biết một trong hai số là …", không thấy ranh giới câu; câu `ex.bai-2-61` cùng bài lại giữ dấu trong công thức (`37\,037\,037;`).

## Nguyên nhân gốc

Lời đề được chép lại theo từng khối; dấu câu nằm giữa chữ và công thức không thuộc khối nào nên rơi mất. Lint bỏ qua `[textbook-copy]` ở bài ôn tập nên không có phép so nào với sách.

## Cách phòng

- Người: checklist trục 1, mục "Bài ôn tập (`kind: \"review\"`)": đọc liền các khối của đề như một đoạn và so từng dấu với ảnh đề. Dấu kết câu sau công thức đặt ở cuối TeX của khối công thức (`3^{2} \cdot 5.`).

## Trạng thái

Chỉ người soát.
