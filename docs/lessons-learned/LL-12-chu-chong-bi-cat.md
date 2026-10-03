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
- `cach-ghi-so-tu-nhien` vòng 1: `ClockPick` đặt `<text>` trong `Region`, nên viền chọn 20px (cùng màu chữ, `paintOrder="stroke"`) tô kín chữ số La Mã đã chọn, cả khi hiện đáp án; hình `tap-hop/set-tap.tsx` tránh được nhờ `stroke="none"` trên chữ. Ví dụ của mẹo `liet-ke-co-thu-tu` dùng `\quad` giữa năm số nên bị cắt còn "5" trên điện thoại.
- `cach-ghi-so-tu-nhien` vòng 2, `tip.tach-cum`: dòng đầu của `gathered` "XIV = X + IV = 10 + 4 = 14" (năm vế) bị cắt còn "= 1" trên điện thoại, cả ở trang "Mẹo hay"; dòng lấy nguyên từ câu "Sửa" của review vòng 1. Mỗi dòng `gathered` tối đa ba vế, kể cả công thức review đề xuất.
- `tap-hop-cac-so-nguyen` vòng 2, hình gợi ý `nhiet-ke-goi-y` (`ex.doc-nhiet-ke`): thước dọc `scale` đặt nhãn vùng ("Trên 0") ở đỉnh thước và mark ở cùng hàng chữ; thước dừng ở `to: 2` nên mark "2 °C" và "Trên 0" cùng ở vạch 2, chồng thành "2°CTrên 0". Hình gợi ý chỉ hiện trong lúc làm sai nên walk không chụp; chỉ thấy ở ảnh `visual:shot`. Trong hình `scale`, mark không đặt ở vạch đầu, vạch cuối của thước khi vùng phía đó có nhãn (hay nới `from`, `to` thêm một vạch). Cùng mục là lỗi "?" bị ẩn, ghi ở LL-15.
- `phep-cong-phep-tru-so-nguyen` vòng 2: ví dụ thứ hai của mẹo `hai-dau-lien-nhau` (`(-3) + (-4) = (-3) - 4 = -7`) rộng hơn khung mẹo trên điện thoại, màn chỉ hiện đến dấu "=" cuối (walk không đo tràn trong TeX của khối `tip`). Các `explain.tex` ba vế bị ngắt giữa ngoặc ở vòng 1. Cách làm: viết chuỗi từ hai dấu "=" trở lên bằng `gathered`, mỗi dòng tối đa 22 ký tự.
- `phep-chia-het-uoc-va-boi-cua-mot-so-nguyen` vòng 1: `tex` một dòng `(1, -1),\ (2, -2),\ (3, -3),\ (6, -6)` của mẹo `so-uoc-chan` và lời giải `ex.dem-uoc-cua-6` mất cặp (6, −6) trên điện thoại, cả ở trang "Mẹo hay", nên màn hiện 6 ước cạnh chữ "8 ước". Danh sách cặp trong TeX cũng theo luật `gathered` tối đa 22 ký tự mỗi dòng.
- `on-tap-chuong-3` vòng 1: `explain.tex` của `ex.bai-3-43a`, `ex.bai-3-44a`, `ex.bai-3-44b` có dòng `gathered` mang hai dấu "=" hay chép nguyên biểu thức dài của đề, nên điện thoại hiện "84(" thay cho 840 và mất "= −442" (ảnh `phone/118-…-correct.png`, `phone/134-…-correct.png`). Dòng đầu lời giải của câu sách không chép nguyên biểu thức đề; bắt đầu từ bước đã biến đổi, mỗi dòng một phép.
- `hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu` vòng 1 (hai mục): hình chạm đo `do-duong-cheo-vuong` đặt `textAt` cho hai số "4,2 cm" ngay trên cạnh AD, BC nên nét cạnh cắt qua chữ, và hai số không gần đường chéo nào; hình gợi ý `sbt-4-5a-goi-y` vẽ cung compa vòng xuống dưới đáy, bị mép khung `h` cắt ngang, lại thiếu tên Y, Z mà dòng "YZ: ?" cần. Hình chạm đo chỉ hiện số sau khi chạm hết và hình gợi ý chỉ hiện khi làm sai, nên walk không báo; phải mở ảnh `…-block-shown` và ảnh `visual:shot` của hình gợi ý.
- `hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu` vòng 2, hình chạm đo `do-cheo-chinh` (phần 6): bản sửa vòng 1 chuyển nhãn đo đường chéo của `do-duong-cheo-vuong` thành dòng "AC = 4,2 cm" dưới hình, nhưng hình cùng kiểu của hình lục giác đều vẫn đặt nhãn "6 cm" bằng `at: 0.15`, nên chữ chạm cạnh AB và hai nhãn nằm sát cạnh CD, BC, đọc thành độ dài cạnh. Sửa một hình chạm đo thì tìm mọi hình cùng hàm (`sideProbe`, `parts` có `seg` cắt nhau) trong `catalog.ts` của bài và sửa cùng cách.
- `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` vòng 1 (bốn mục): đúng kiểu Bài 18 lặp lại ở ba hình chạm đo của bài mới: nhãn nửa đường chéo "4 cm", "3 cm" sát cạnh AB (`do-cheo-binh-hanh`, `do-kiem-binh-hanh`), hai nhãn "7 cm" trên cạnh đáy (`do-cheo-thang-can`, `at: 0.2`); thêm tên điểm O bị ô dấu góc vuông đè và chữ "60°" nằm trên cạnh đối diện ở bảng vẽ cạnh 2 cm (`textDistance: 46` cố định lớn hơn cạnh). Bản sửa của Bài 18 (dòng "AC = ... cm" dưới hình) nằm trong hình của bài đó, không thành mặc định của bộ đo dùng chung, nên bài sau gặp lại; khoảng đặt nhãn cố định phải tính theo cạnh ngắn nhất của hình.
- `chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc` vòng 1 (hai mục): dòng công thức `S = a · h`, `S = a · b : 2`, `S = (a + b) · h : 2` đặt sát đáy khung của ba hình quy tắc nên mất nửa dưới chữ ở cả điện thoại lẫn iPad, nhãn "a" của hình thoi nằm trên cạnh; tên đỉnh lõm "E" của hình khuyết góc (`dan-khuyet-10-6`) nằm đúng trên cạnh ED khi phần khuyết là hình vuông, trong khi Hình 4.20 cùng hàm đặt đúng. Walk không báo vì chữ nằm trong SVG. Điểm mới: dòng chữ cuối của SVG phải chừa khoảng dưới bằng cỡ chữ (chân chữ, dấu ngoặc), và tên đỉnh lõm đặt theo phân giác ra ngoài hình chứ không theo vị trí cố định.
- `chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc` vòng 2, `ex.sbt-4-26` và `ex.sbt-4-28`: lời giải đã xếp `gathered` nhưng mỗi dòng còn chép cả biểu thức gộp (`(2 · (40 + 90) − 5) · 2 = 510 m`, `30 · 20 − 0,6 · 0,6 · 1 400 = 96 m²`, 31–36 ký tự), nên điện thoại mất đáp số 510 m, 96 m² và 2 880 000 (ảnh `phone/200-…-correct.png`, `phone/215-…-correct.png`). Dòng 4.26 có từ vòng 1 mà reviewer phần bài tập sách bài tập vòng 1 không mở ảnh `…-correct`; dòng 4.28 dài ra khi sửa theo review vòng 1. Điểm mới: xếp `gathered` chưa đủ, mỗi dòng phải là một phép (tối đa 22 ký tự); luật này đã lặp ở sáu bài nên là ứng viên cho một luật `content:check` đo độ dài từng dòng `gathered` của `explain.tex` và `tip.tex`.
- `hinh-binh-hanh-hinh-thang-can` vòng 2 (một mục, năm hình): nét kéo dài nét đứt, cung compa và đường chéo của hình đi xuyên tên điểm: "C" ở bảng vẽ hình bình hành (`parallelogramFigure`), "P", "Q" ở bảng vẽ biết đường chéo, "O" là điểm của đề ở `binh-hanh-cheo-ghik`, "O" sát vạch "‖" ở `so-sanh-cheo`, ô "?" của hình chạm đo 4.16 che "O". Walk không báo vì chữ nằm trong SVG. Điểm mới: hàm dựng hình dùng chung phải đặt tên đỉnh ra ngoài theo hướng từ tâm hình ra đỉnh và cho nét kéo dài dừng trước ô chữ; nhãn đặt theo vị trí mặc định trên giao điểm của hai đường chéo luôn nằm trên một đường chéo.

## Nguyên nhân gốc

Chỉ xem một cỡ màn; không mở ảnh walk. Nhãn ngắn trong cột hẹp gãy từng từ mà vẫn qua được mọi phép kiểm máy của walk.

## Cách phòng

- Máy: `pnpm lesson:walk` (3 màn hình, kiểm chồng chữ theo khung mực, chữ dưới 16px, tràn ngang).
- Người: mở từng ảnh walk (checklist trục 5).

## Trạng thái

Đang áp dụng.
