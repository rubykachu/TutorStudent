# LL-20 — Bản sửa theo review làm hỏng chỗ khác

## Triệu chứng

Tác giả sửa một mục review nhưng ghi vào nhầm khối (lệch chỉ mục), ghi đè câu đang dạy một ý, hoặc để lời hướng dẫn thao tác ở màn không có thao tác đó. Lỗi mới sinh ra ở vòng sửa, `content:check` không bắt được.

## Ví dụ thật

- `dau-hieu-chia-het` vòng 3, section `chia-het-3`: thêm dòng lý do cho màn chạm `chon-3-1410` (`blocks[3]`) nhưng ghi vào `blocks[2]`, màn hình tĩnh `ba-khac-chin`. Note "Dấu hiệu chia hết cho 3 khác dấu hiệu chia hết cho 9" bị mất, màn tĩnh bảo trẻ "Chạm vào các số", màn chạm thật vẫn thiếu dòng lý do.
- `uoc-chung-uoc-chung-lon-nhat` vòng 2, section `uoc-chung-lon-nhat`: bảng đổi số của vòng 1 đổi màn chạm `chon-uclnn-8-12` sang 20 và 24; tác giả đổi id hình và lời kết `done` nhưng quên note ngay trên, nên note hỏi "8 và 12" còn hình khen "đúng ước chung lớn nhất của 20 và 24" (đáp án cùng là 4 nên walk không bắt). Khi đổi số theo bảng, tìm số cũ trong cả `lesson.json` lẫn `catalog.ts`, không chỉ trong mục có id.
- `so-nguyen-to` vòng 2: review vòng 1 đề xuất thêm 49 vào câu luyện `dh-nhieu` kèm một câu hướng dẫn và hình gợi ý "49 = 7 · 7"; bản sửa giữ 49 nhưng bỏ câu hướng dẫn (chỉ còn câu "chưa chắc là số nguyên tố" trong caption xám) và đổi hình gợi ý sang xếp 21 ô, nên trẻ làm đúng quy tắc vừa học vẫn bị chấm sai. Cùng vòng, bốn câu "Sửa" của chính review vòng 1 sinh lỗi mới: hook 7 viên (chép câu 2.30a), nhãn bảng "không là" (lệch câu quy tắc "không phải"), câu ôn 5 viên (trùng recap), số 43, 47, 83 không có bảng. Không làm được trọn một đề xuất thì bỏ cả đề xuất và ghi lý do, đừng giữ phần khó mà bỏ phần dạy; câu "Sửa" trong review phải qua chính checklist (số sách, câu quy tắc, recap) trước khi ghi.

## Nguyên nhân gốc

Sửa theo đường dẫn JSON (`blocks[n]`) mà không đối chiếu id hình hay ảnh của màn đó; chỉ xem lại mục đã sửa, không xem lại chữ cũ bị thay.

## Cách phòng

- Người: sau khi sửa, chạy `pnpm content:diff` và đọc từng dòng `-` / `+`: chữ bị bỏ có còn nơi nào dạy không, chữ mới có đứng cạnh đúng `visualId` không. Reviewer vòng chỉ phần đổi soát cả chữ bị bỏ, không chỉ chữ mới.
- Máy: chưa có luật. Có thể thêm cảnh báo khi note bắt đầu bằng "Chạm vào" mà `visualId` đi kèm không phải loại tương tác (`INTERACTIVE_KINDS` của bài).

## Trạng thái

Chỉ người soát.
