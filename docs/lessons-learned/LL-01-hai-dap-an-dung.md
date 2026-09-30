# LL-01 — Câu hỏi có hai đáp án đúng, hoặc nhiễu cũng đúng

## Triệu chứng

Một lựa chọn nhiễu cũng thoả đề, đáp án ghi sai, hoặc bài `order`/`fillBlank` chỉ chấm một thứ tự trong khi thứ tự khác cũng đúng. Trẻ làm đúng mà bị chấm sai.

## Ví dụ thật

- `phep-cong-phep-tru` vòng 2, `ex.chon-uoc-luong-kt`: đề hỏi kết quả chắc chắn sai, nhưng 399 cũng chắc chắn sai; `ex.chon-tong-sai` vòng 1: 120 cũng sai.
- `phep-cong-phep-tru` vòng 2, `ex.chon-cap-day-so-2`: đề hỏi cặp có tổng bằng 30 + 38 mà một đáp án đúng chính là 30 + 38.
- `phep-cong-phep-tru` vòng 1, `ex.sap-day-so`: hai thứ tự sắp xếp đều đúng.
- `tap-hop` vòng 1, `ex.kt-ghep-hai-phan-tu`, `ex.xep-ghep-tap-hop`: liệt kê phần tử theo thứ tự khác vẫn đúng nhưng bị chấm sai.
- `neu-cau-muon-co-mot-nguoi-ban` vòng 1, `ex.chon-tu-ghep`: "chăm chú" xếp được vào cả từ ghép; vòng 4, `ex.cham-cao-buon`: câu `l40-1` cũng cho thấy cáo buồn.

## Nguyên nhân gốc

Tác giả chỉ kiểm đáp án mình định, không tự giải từng lựa chọn nhiễu theo đúng câu chữ của đề (nhất là đề phủ định "chắc chắn sai", "lớn nhất"). Bài `choice` Toán không có `check` nên lint không tính lại lựa chọn.

## Cách phòng

- Máy: `content:check` luật `[check-expr]`. `numeric` và `choice` Toán có `check`: `relation` mặc định `equal` (đáp án là đúng các lựa chọn bằng `expr`), `notEqual` cho đề "kết quả nào sai", `max`/`min` cho "lớn nhất"/"nhỏ nhất", `holds`/`fails` khi mỗi lựa chọn là một phép so sánh ("2³ · 2² = 2⁵"). Mọi lựa chọn đều là phép so sánh tính được mà thiếu `check` thì báo lỗi.
- Người: checklist review mục "Mỗi câu hỏi có đúng một đáp án đúng"; tác giả tự giải từng nhiễu (`pitfalls.md`, mục Bài tập). Bài `order`/`fillBlank` có nhiều thứ tự đúng thì đổi dạng bài hoặc ghi thêm cách đúng vào `accept`.

## Trạng thái

Đang áp dụng. Chưa máy hoá: câu Ngữ văn, câu `choice` mà lựa chọn không phải số (thuộc tập hợp, cơ số).
