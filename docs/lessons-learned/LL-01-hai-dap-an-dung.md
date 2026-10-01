# LL-01 — Câu hỏi có hai đáp án đúng, hoặc nhiễu cũng đúng

## Triệu chứng

Một lựa chọn nhiễu cũng thoả đề, đáp án ghi sai, hoặc bài `order`/`fillBlank` chỉ chấm một thứ tự trong khi thứ tự khác cũng đúng. Trẻ làm đúng mà bị chấm sai.

## Ví dụ thật

- `phep-cong-phep-tru` vòng 2, `ex.chon-uoc-luong-kt`: đề hỏi kết quả chắc chắn sai, nhưng 399 cũng chắc chắn sai; `ex.chon-tong-sai` vòng 1: 120 cũng sai.
- `phep-cong-phep-tru` vòng 2, `ex.chon-cap-day-so-2`: đề hỏi cặp có tổng bằng 30 + 38 mà một đáp án đúng chính là 30 + 38.
- `phep-cong-phep-tru` vòng 1, `ex.sap-day-so`: hai thứ tự sắp xếp đều đúng.
- `tap-hop` vòng 1, `ex.kt-ghep-hai-phan-tu`, `ex.xep-ghep-tap-hop`: liệt kê phần tử theo thứ tự khác vẫn đúng nhưng bị chấm sai.
- `neu-cau-muon-co-mot-nguoi-ban` vòng 1, `ex.chon-tu-ghep`: "chăm chú" xếp được vào cả từ ghép; vòng 4, `ex.cham-cao-buon`: câu `l40-1` cũng cho thấy cáo buồn.
- `phep-nhan-phep-chia` vòng 2, `ex.dien-7-9`: lần sửa vòng 1 đảo đề `7 · 9 = 9 · ___` thành `9 · 7 = 7 · ___` nhưng giữ `accept: ["7"]`, nên đáp án đúng 9 bị chấm sai; lời giải của chính câu ra 9. `fillBlank` Toán không có `check`, máy không bắt.
- `phep-nhan-phep-chia` vòng 3, `ex.chon-tich-rieng-2`: nhiễu mới "Viết 1 920, thẳng cột với tích riêng thứ nhất" chính là cách viết 0 mờ mà note và hình mẫu vừa dạy, nên trùng đáp án đúng.
- `dau-hieu-chia-het` vòng 1, `ex.xep-1530`, `ex.xep-tong-3410`: bài `order` có các bước độc lập (xét chia hết cho 5 và xét chia hết cho 3; xét từng số hạng của tổng), đổi chỗ vẫn đúng mà chỉ chấm một thứ tự; `xep-1530` còn ngược với thứ tự đề nêu ("cả 3 và 5"). Mỗi bước của bài `order` phải dùng kết quả của bước trước; bước nào không dùng thì gộp vào bước khác hoặc đổi dạng bài.
- `boi-chung-boi-chung-nho-nhat` vòng 1: `ex.xep-liet-ke-4-6` tách "Viết các bội của 4" và "Viết các bội của 6" thành hai bước độc lập (cùng lỗi `order` của `dau-hieu-chia-het`, Bài 11 đã tránh bằng cách gộp hai danh sách); `ex.chon-dang-24-36` hỏi "cần tìm gì" với nhiễu "36 − 24", mà 36 − 24 = 12 đúng bằng ƯCLN(24, 36), nên bé tính thử thấy hai lựa chọn cùng ra số đĩa đúng. Nhiễu dạng biểu thức (tổng, hiệu, tích của các số đề cho) phải tính ra số và so với đáp số, kể cả khi đề hỏi "tìm gì" chứ không hỏi số.
- `on-tap-chuong-2` vòng 2, `ex.bai-2-56b`: lựa chọn của bài (sách để câu mở) "Hợp số, vì là tổng của hai số chia hết cho 9" đọc được thành "(tổng của hai số) chia hết cho 9", mà 3 · 4 · 5 + 2 020 · 2 021 · 2 022 chia hết cho 9 và lớn hơn 9, nên nhiễu cũng đúng; `wrong` chỉ bác cách đọc "mỗi số hạng chia hết cho 9". Lý do dạng "tổng của hai số chia hết cho k" phải thử k với cả tổng, không chỉ với từng số hạng, hoặc viết "vì cả hai số hạng đều chia hết cho k".
- `thu-tu-trong-tap-hop-cac-so-tu-nhien` vòng 1, `ex.chon-phep-tinh-km`, `ex.kt-cot-km-40-25`, `ex.cot-km-45-30`, `ex.cot-km-20-15`: đề cột cây số "thị trấn cách cột đó 25 km" không nói thị trấn còn ở phía trước, nên phép trừ (thị trấn đã đi qua) cũng đúng và lý do `wrong` dựa vào điều đề không nói. Đề có khoảng cách trên một con đường phải nói chiều ("còn … nữa mới tới"), như màn mẫu đã nói.

## Nguyên nhân gốc

Tác giả chỉ kiểm đáp án mình định, không tự giải từng lựa chọn nhiễu theo đúng câu chữ của đề (nhất là đề phủ định "chắc chắn sai", "lớn nhất"). Bài `choice` Toán không có `check` nên lint không tính lại lựa chọn. Sửa chữ của đề (đảo vế, đổi số) mà không tính lại `accept`/`answer` cũng để lại đáp án cũ đã sai.

## Cách phòng

- Máy: `content:check` luật `[check-expr]`. `numeric` và `choice` Toán có `check`: `relation` mặc định `equal` (đáp án là đúng các lựa chọn bằng `expr`), `notEqual` cho đề "kết quả nào sai", `max`/`min` cho "lớn nhất"/"nhỏ nhất", `holds`/`fails` khi mỗi lựa chọn là một phép so sánh ("2³ · 2² = 2⁵"). Mọi lựa chọn đều là phép so sánh tính được mà thiếu `check` thì báo lỗi.
- Người: checklist review mục "Mỗi câu hỏi có đúng một đáp án đúng"; tác giả tự giải từng nhiễu (`pitfalls.md`, mục Bài tập). Mỗi lần sửa đề, tính lại đáp án của chính câu đó; reviewer tự tính lại mọi `fillBlank` Toán. Bài `order`/`fillBlank` có nhiều thứ tự đúng thì đổi dạng bài hoặc ghi thêm cách đúng vào `accept`.

## Trạng thái

Đang áp dụng. Chưa máy hoá: câu Ngữ văn, câu `choice` mà lựa chọn không phải số (thuộc tập hợp, cơ số), câu `fillBlank` Toán mà `segments` ghép với `accept` thành một đẳng thức tính được (có thể kiểm bằng máy).
