# LL-12 — Chữ chồng nhau, bị cắt hay bị che

## Triệu chứng

Chữ, số mũ hay lựa chọn bị thanh dưới che, tràn màn điện thoại, dính dấu, cắt mép viewBox.

## Ví dụ thật

- `luy-thua` (review ở commit `311f20a`): thanh dưới che phím "0" và lựa chọn cuối.
- `tap-hop` vòng 4: hai nhãn đè nhau trong `lap-ghep-liet-ke`.
- `neu-cau-muon-co-mot-nguoi-ban` vòng 13: 6 FAIL walk do thanh dưới che nội dung.
- `phep-nhan-phep-chia` vòng 2, visual `gia-dinh-6-4`, `chia-het-tom-tat`: lưới `md:grid-cols-2` trên iPad dọc làm nhãn "Số bị chia", "Thừa số" gãy mỗi từ một dòng. Walk không báo vì chữ không chồng, không tràn; chỉ thấy khi mở ảnh `ipad/`.
- `so-nguyen-to` vòng 3, visual `bang-100`: `max-h-[32vh]` thu lưới 100 số để vừa màn iPad ngang nên chữ số còn khoảng 14,5px và dấu khái niệm khoảng 5px; walk không báo vì chỉ đo cỡ chữ khai báo, không đo cỡ sau khi SVG co. Sửa một hình cho vừa màn thì đo lại cỡ chữ hiển thị trên ảnh walk.

## Nguyên nhân gốc

Chỉ xem một cỡ màn; không mở ảnh walk. Nhãn ngắn trong cột hẹp gãy từng từ mà vẫn qua được mọi phép kiểm máy của walk.

## Cách phòng

- Máy: `pnpm lesson:walk` (3 màn hình, kiểm chồng chữ theo khung mực, chữ dưới 16px, tràn ngang).
- Người: mở từng ảnh walk (checklist trục 5).

## Trạng thái

Đang áp dụng.
