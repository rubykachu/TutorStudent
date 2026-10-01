# LL-20 — Bản sửa theo review làm hỏng chỗ khác

## Triệu chứng

Tác giả sửa một mục review nhưng ghi vào nhầm khối (lệch chỉ mục), ghi đè câu đang dạy một ý, hoặc để lời hướng dẫn thao tác ở màn không có thao tác đó. Lỗi mới sinh ra ở vòng sửa, `content:check` không bắt được.

## Ví dụ thật

- `dau-hieu-chia-het` vòng 3, section `chia-het-3`: thêm dòng lý do cho màn chạm `chon-3-1410` (`blocks[3]`) nhưng ghi vào `blocks[2]`, màn hình tĩnh `ba-khac-chin`. Note "Dấu hiệu chia hết cho 3 khác dấu hiệu chia hết cho 9" bị mất, màn tĩnh bảo trẻ "Chạm vào các số", màn chạm thật vẫn thiếu dòng lý do.

## Nguyên nhân gốc

Sửa theo đường dẫn JSON (`blocks[n]`) mà không đối chiếu id hình hay ảnh của màn đó; chỉ xem lại mục đã sửa, không xem lại chữ cũ bị thay.

## Cách phòng

- Người: sau khi sửa, chạy `pnpm content:diff` và đọc từng dòng `-` / `+`: chữ bị bỏ có còn nơi nào dạy không, chữ mới có đứng cạnh đúng `visualId` không. Reviewer vòng chỉ phần đổi soát cả chữ bị bỏ, không chỉ chữ mới.
- Máy: chưa có luật. Có thể thêm cảnh báo khi note bắt đầu bằng "Chạm vào" mà `visualId` đi kèm không phải loại tương tác (`INTERACTIVE_KINDS` của bài).

## Trạng thái

Chỉ người soát.
