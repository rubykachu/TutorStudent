# LL-12 — Chữ chồng nhau, bị cắt hay bị che

## Triệu chứng

Chữ, số mũ hay lựa chọn bị thanh dưới che, tràn màn điện thoại, dính dấu, cắt mép viewBox.

## Ví dụ thật

- `luy-thua` (review ở commit `311f20a`): thanh dưới che phím "0" và lựa chọn cuối.
- `tap-hop` vòng 4: hai nhãn đè nhau trong `lap-ghep-liet-ke`.
- `neu-cau-muon-co-mot-nguoi-ban` vòng 13: 6 FAIL walk do thanh dưới che nội dung.
- `phep-nhan-phep-chia` vòng 2, visual `gia-dinh-6-4`, `chia-het-tom-tat`: lưới `md:grid-cols-2` trên iPad dọc làm nhãn "Số bị chia", "Thừa số" gãy mỗi từ một dòng. Walk không báo vì chữ không chồng, không tràn; chỉ thấy khi mở ảnh `ipad/`.
- `so-nguyen-to` vòng 3, visual `bang-100`: `max-h-[32vh]` thu lưới 100 số để vừa màn iPad ngang nên chữ số còn khoảng 14,5px và dấu khái niệm khoảng 5px; walk không báo vì chỉ đo cỡ chữ khai báo, không đo cỡ sau khi SVG co. Sửa một hình cho vừa màn thì đo lại cỡ chữ hiển thị trên ảnh walk.
- `on-tap-chuong-2` vòng 1, `ex.bai-2-61`: `explain.tex` là khối `aligned` bốn dòng với số chín chữ số, rộng hơn màn 390px nên mọi dòng bị cắt ("= 12 34", "= aaa") mà walk không báo; nhiều `explain.tex` một dòng khác tự xuống dòng ngay sau "⋮", ":". Công thức dài trong `explain` xếp mỗi phép một dòng (`gathered`) và xem ảnh `phone/…-correct`.
- `on-tap-chuong-2` vòng 2, `tip.loai-hop-so-nhanh`: ví dụ mới viết trên một dòng `2\,133:\ 2 + 1 + 3 + 3 = 9 \chiahet 3` rộng hơn khung 390px, chữ số chia 3 cuối bị cắt (ảnh `phone/051-s3-04-block.png`) mà walk không báo. `tex` của mẹo cũng xếp mỗi phép một dòng như `explain`.
- `on-tap-chuong-2` vòng 3, `ex.chon-so-trong-khoang`: bước mới sinh khi sửa thứ tự cộng số dư có `explain.tex` hai dòng, mỗi dòng hai phép cộng (`18 + 2 = 20, 36 + 2 = 38`), rộng hơn khung 390px nên số cuối mỗi dòng bị cắt (ảnh `phone/171-s10-07-exercise-chon-so-trong-khoang-correct.png`) mà walk không báo. Cùng lỗi đã gặp ở vòng 1 và 2: nội dung mới thêm khi sửa cũng phải qua bước xem ảnh `phone/…-correct`, và mỗi dòng `gathered` chỉ một phép.

## Nguyên nhân gốc

Chỉ xem một cỡ màn; không mở ảnh walk. Nhãn ngắn trong cột hẹp gãy từng từ mà vẫn qua được mọi phép kiểm máy của walk.

## Cách phòng

- Máy: `pnpm lesson:walk` (3 màn hình, kiểm chồng chữ theo khung mực, chữ dưới 16px, tràn ngang).
- Người: mở từng ảnh walk (checklist trục 5).

## Trạng thái

Đang áp dụng.
