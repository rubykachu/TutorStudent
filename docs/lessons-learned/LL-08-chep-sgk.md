# LL-08 — Chép câu, ví dụ hay bài tập của sách

## Triệu chứng

Định nghĩa, ví dụ hay bộ số của bài tập trùng nguyên văn SGK/SBT (trừ khối `passage` của Ngữ văn).

## Ví dụ thật

- `tap-hop` vòng 1, `cham-phay-vi-du`: ví dụ dấu chấm phẩy chép tập hợp của SBT.
- `phep-cong-phep-tru` vòng 1, visual `cong-ten`/`tru-ten`: ví dụ tên gọi chép 25 + 11 = 36 của SBT.
- `luy-thua` (review ở commit `efe9635`): câu "phép nâng lên luỹ thừa" sát câu sách.
- `phep-nhan-phep-chia` vòng 1: ví dụ tên gọi 25 · 2 = 50, 36 : 12 = 3 chép sơ đồ "Kiến thức cần nhớ" của SBT; ví dụ mẫu `ket-hop-44-25` là bài tập 1.39 b) kèm đúng lời giải sách.
- `quan-he-chia-het-va-tinh-chat` vòng 1, section `uoc-boi`: định nghĩa "Nếu a chia hết cho b thì b là ước của a và a là bội của b" chỉ bỏ "ta nói" so với câu SBT tr.30; bài không có lớp chữ `p*.txt` nên `[textbook-copy]` không chạy.
- `uoc-chung-uoc-chung-lon-nhat` vòng 1: định nghĩa ƯCLN chỉ thêm "viết tắt là", quy tắc section `uclnn-phan-tich` và `uc-tu-uclnn` giữ nguyên các cụm của "Kiến thức cần nhớ" mục 3, 4 tr.38 ("mỗi thừa số lấy với số mũ nhỏ nhất", "Tích đó là ƯCLN cần tìm"); section `so-hoan-hao` chép định nghĩa, bộ số 10, 28 và lời giải câu 2.38. Câu trong khung "Kiến thức cần nhớ" là chỗ dễ chép nhất vì đã gọn sẵn: viết lại theo cách làm (động từ, thứ tự bước), không chỉ đổi vài chữ.
- `so-nguyen-to` vòng 1: định nghĩa số nguyên tố, hợp số trùng từng chữ ý 1, 2 "Kiến thức cần nhớ" tr.35; định nghĩa phân tích chỉ bỏ "tự nhiên lớn hơn 1" và "dưới dạng một" khỏi ý 3, nên vừa chép vừa mất điều kiện. Câu kho ôn `xep-7-cach` là câu 2.30a chỉ bỏ "Nếu… thì ta"; `viet-ba-17`, `viet-50` dùng đúng số và đúng lời giải câu 2.32. Bàn giao ghi "số trong bài tự chọn" nhưng câu kho ôn soạn sau cùng vẫn lấy số sách: soát cả kho ôn, không chỉ màn dạy.

## Nguyên nhân gốc

Soạn khi đang nhìn trang sách, lấy luôn ví dụ có sẵn.

## Cách phòng

- Máy: `content:check` luật `[textbook-copy]` (cảnh báo): chữ của bài (trừ `passage` và phần trong ngoặc kép) có từ nửa số cụm 5 từ trở lên trùng lớp chữ `sources/<môn>/<bài>/p*.txt`. Không có tệp `.txt` thì luật bỏ qua.
- Người: checklist mục "Biên soạn lại, không chép" (ví dụ số trong hình, bảng).

## Trạng thái

Đang áp dụng khi bài có lớp chữ PDF.
