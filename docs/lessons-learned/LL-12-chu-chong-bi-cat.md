# LL-12 — Chữ chồng nhau, bị cắt hay bị che

## Triệu chứng

Chữ, số mũ hay lựa chọn bị thanh dưới che, tràn màn điện thoại, dính dấu, cắt mép viewBox.

## Ví dụ thật

- `luy-thua` (review ở commit `311f20a`): thanh dưới che phím "0" và lựa chọn cuối.
- `tap-hop` vòng 4: hai nhãn đè nhau trong `lap-ghep-liet-ke`.
- `neu-cau-muon-co-mot-nguoi-ban` vòng 13: 6 FAIL walk do thanh dưới che nội dung.

## Nguyên nhân gốc

Chỉ xem một cỡ màn; không mở ảnh walk.

## Cách phòng

- Máy: `pnpm lesson:walk` (3 màn hình, kiểm chồng chữ theo khung mực, chữ dưới 16px, tràn ngang).
- Người: mở từng ảnh walk (checklist trục 5).

## Trạng thái

Đang áp dụng.
