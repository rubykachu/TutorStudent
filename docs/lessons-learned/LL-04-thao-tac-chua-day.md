# LL-04 — Dùng thao tác trả lời trước khi dạy

## Triệu chứng

Câu đầu tiên dùng chạm vùng, nối cặp, sắp xếp, kéo thả, ngân hàng từ hay phím "mũ" xuất hiện trước màn hướng dẫn thao tác đó; trẻ không biết phải làm gì.

## Ví dụ thật

- `tap-hop` vòng 1: câu điền chip đứng trước màn `huong-dan-chip`; câu chạm vùng đầu không có hướng dẫn.
- `tap-hop` vòng 2, `ex.chon-x-thuoc`: bấm −/+ trước màn đổi x.
- `phep-cong-phep-tru` vòng 2, `ex.cham-tong`: chạm vùng trước màn hướng dẫn chạm.
- Review sản phẩm 30/09/2026: phím "mũ" chưa được dạy khi gặp câu `numeric` dạng luỹ thừa.

## Nguyên nhân gốc

Tác giả không biết bài nào (kể cả bài trước) đã dạy thao tác; câu kho ôn của card ở section đầu có thể ra trong phiên ôn trước khi trẻ tới màn hướng dẫn ở section sau.

## Cách phòng

- Máy: `content:check` luật `[guides]` (cảnh báo). Màn hướng dẫn là `group` có `"guide": "<thao tác>"` (`tapRegion`, `tapText`, `match`, `order`, `manipulate`, `fillBlankBank`, `numericPower`). Câu đầu tiên dùng thao tác phải đứng ở section có màn đó hoặc sau nó, hay thao tác đã được dạy ở bài trước trong thứ tự của app (môn theo `subjects.json`, rồi `order`). `manipulate` còn đạt khi cùng visual đã hiện ở màn khám phá trước đó.
- Người: luật "Dạy thao tác nhập trước lần dùng đầu" trong `lesson-author/SKILL.md`.

## Trạng thái

Đang áp dụng. Bài đã xuất bản còn thiếu màn hướng dẫn `match`, `order` cho môn Toán: xem `notebooks/backlogs/lesson-tap-hop/task.md`.
