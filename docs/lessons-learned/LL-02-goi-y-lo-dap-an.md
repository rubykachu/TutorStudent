# LL-02 — Gợi ý nấc 1 hay nấc 2 lộ đáp án, hoặc không chỉ đúng chỗ

## Triệu chứng

Lần sai đầu, phần sáng lên chính là đáp án; hình gợi ý nấc 2 hiện kết quả của đề; chữ in sẵn sau ô trống cho biết kết quả ô trước. Ngược lại, gợi ý tô cả câu đề không chỉ chỗ dễ sai.

## Ví dụ thật

- `neu-cau-muon-co-mot-nguoi-ban` vòng 1, `ex.dien-tu-so-sanh`: hình gợi ý liệt kê "như là", đúng từ duy nhất trong ngân hàng.
- `neu-cau-muon-co-mot-nguoi-ban` vòng 8, chú thích lề `l16-2`, `l18-6`: chú thích trỏ thẳng vào câu đáp án.
- `thu-tu-thuc-hien-phep-tinh` vòng 1, `ex.tim-x-1`: chữ sau ô trống in sẵn "4x = 28 − 8 = ".
- `luy-thua` (review ở commit `ce17203`), `ex.tach-5-247`: hình nấc 2 chỉ cách đáp án một bước.

## Nguyên nhân gốc

Soạn gợi ý như lời giải thu nhỏ thay vì chỉ chỗ cần nhìn lại; không đối chiếu phần được tô với `answer`.

## Cách phòng

- Máy: `content:check` luật `[hint-answer]`: `hints.highlight` trỏ vào `option` nằm trong `answer` của `choice`/`tapRegion`, hay câu nằm trong `answer` của `tapText`, là lỗi.
- Người: checklist "Luật gợi ý 3 nấc" (nấc 2 dừng ở "?", chú thích lề của `passage`, chữ trong `segments` của `fillBlank`).

## Trạng thái

Đang áp dụng. Nấc 2 (hình) và chú thích lề chưa máy hoá.
