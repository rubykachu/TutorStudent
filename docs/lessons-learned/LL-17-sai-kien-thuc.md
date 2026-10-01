# LL-17 — Sai kiến thức

## Triệu chứng

Quy tắc, định nghĩa hay ví dụ sai toán học hoặc sai văn bản.

## Ví dụ thật

- `phep-cong-phep-tru` vòng 1, section `cot-tru`: quy tắc mượn khi trừ đặt tính sai ở hàng chục.
- `tap-hop` vòng 2: định nghĩa dấu hiệu đặc trưng thiếu vế "chỉ các phần tử đó có".
- `quan-he-chia-het-va-tinh-chat` vòng 1: hình quy tắc `chia-du-52-4` ghi "53 : 4 = 13" (số dư chỉ ở nhãn riêng); note `tong-chia-het` "không cần cộng vẫn biết tổng có chia hết hay không" (sai chiều ngược: 7 + 8 chia hết cho 5); quy tắc "Số 0 cũng là bội của mọi số" thiếu "khác 0"; câu `ex.dien-boi-3` in sẵn "các bội của 3 nhỏ hơn 16 là 3; 6; ..." bỏ số 0 ngay sau quy tắc nói 0 là bội.
- `quan-he-chia-het-va-tinh-chat` vòng 2: bản sửa vòng 1 chỉ thêm "khác 0" vào câu bội, còn note `tim-uoc` "Số 1 và chính số đó luôn là ước của số đó" (0 không là ước của 0) vẫn thiếu; note `uoc-boi` "Từ một phép nhân ta tìm được hai ước" sai với 16 = 4 · 4. Khi sửa một điều kiện bị mất ("khác 0"), soát mọi câu "luôn", "mọi", "hai ..." của cả bài, không chỉ câu bị nêu.
- `quan-he-chia-het-va-tinh-chat` vòng 3: khi đổi nhiễu của `ex.chon-nhieu-uoc-22` (7 thành 11, id 14 thành 22) đề vẫn ghi "ước của 14" nên đáp án 2 và 11 sai. Đổi số trong lựa chọn thì đổi cả đề, id và tự giải lại câu; câu `choice` không có `check` nên máy không bắt.
- `dau-hieu-chia-het` vòng 1: note và hình `bang-chin` "Các số chia hết cho 9 nhỏ là 9, 18, 27, 36 và 45" lại bỏ số 0 và không nói "nhỏ" tới đâu (cùng lỗi `ex.dien-boi-3` của bài trước: danh sách bội, ước in sẵn phải nói rõ khoảng và giữ số 0); thẻ `tim-38a` "18 là số chia hết cho 9, gần 11 nhất" (9 gần hơn) dạy mẹo sai, recap `tom-tat-tim-26c` lặp mẹo đó, lý do đúng là "a từ 0 đến 9 nên 11 + a từ 11 đến 20"; quy tắc `tim-chu-so` "2, 5 tìm chữ số tận cùng; 3, 9 tìm các chữ số còn lại" trái với chính hình màn 1, hình recap và ví dụ 1 của sách (chữ số tận cùng tìm bằng dấu hiệu 9). Câu quy tắc tự đặt ra để "chia việc" phải thử lại trên mọi ví dụ của section và của sách.
- `dau-hieu-chia-het` vòng 2, section `luy-thua-10`: quy tắc và recap "Cộng thêm một số thì tổng các chữ số là 1 cộng tổng các chữ số của số được thêm" sai khi phép cộng có nhớ (10 + 95 = 105 có tổng 6, không phải 15). Câu quy tắc khái quát từ vài ví dụ của sách (sách chỉ cộng 1, 2, 7, 8) phải ghi đúng phạm vi đã thử ("cộng thêm một số có một chữ số") và thử thêm một ví dụ có nhớ trước khi viết "một số" chung chung.

## Nguyên nhân gốc

Diễn đạt lại cho gọn làm mất điều kiện của quy tắc.

## Cách phòng

- Máy: `[check-expr]` cho số và biểu thức.
- Người: checklist trục 2 "Đúng kiến thức".

## Trạng thái

Chỉ người soát (trừ phần số).
