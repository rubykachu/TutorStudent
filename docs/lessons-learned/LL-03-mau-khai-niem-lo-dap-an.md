# LL-03 — Màu khái niệm lộ đáp án

## Triệu chứng

Chỉ đáp án đúng mang màu khái niệm (hay mang màu khác các lựa chọn còn lại), nên trẻ chọn theo màu. Cách làm sai được tô cùng màu với cách làm đúng.

## Ví dụ thật

- `luy-thua` vòng 11, `ex.chon-co-so-2`: `\concept` tô cơ số trên các lựa chọn, trẻ nhìn màu là biết.
- `tap-hop` vòng 1, `ex.chon-viet-dung`, `ex.kt-hai-cach`: chỉ đáp án có màu amber.
- `thu-tu-thuc-hien-phep-tinh` vòng 4, video `hoa-don`: vòng hồng ("phép làm trước") khoanh cả cách làm sai của Lan.

## Nguyên nhân gốc

Màu khái niệm được thêm để dễ đọc nhưng không soát lại theo góc nhìn "màu có phân biệt được đáp án không".

## Cách phòng

- Máy: `content:check` luật `[color-leak]`: trong `choice`, tập màu của mọi đáp án khác hẳn tập màu của mọi nhiễu thì báo lỗi.
- Người: `pitfalls.md` mục Màu khái niệm; checklist mục "Một khái niệm, một từ, một màu" cho hình và video.

## Trạng thái

Đang áp dụng. Màu trong visual và video chưa máy hoá.
