# LL-02 — Gợi ý nấc 1 hay nấc 2 lộ đáp án, hoặc không chỉ đúng chỗ

## Triệu chứng

Lần sai đầu, phần sáng lên chính là đáp án; hình gợi ý nấc 2 hiện kết quả của đề; chữ in sẵn sau ô trống cho biết kết quả ô trước. Ngược lại, gợi ý tô cả câu đề không chỉ chỗ dễ sai.

## Ví dụ thật

- `neu-cau-muon-co-mot-nguoi-ban` vòng 1, `ex.dien-tu-so-sanh`: hình gợi ý liệt kê "như là", đúng từ duy nhất trong ngân hàng.
- `neu-cau-muon-co-mot-nguoi-ban` vòng 8, chú thích lề `l16-2`, `l18-6`: chú thích trỏ thẳng vào câu đáp án.
- `thu-tu-thuc-hien-phep-tinh` vòng 1, `ex.tim-x-1`: chữ sau ô trống in sẵn "4x = 28 − 8 = ".
- `luy-thua` (review ở commit `ce17203`), `ex.tach-5-247`: hình nấc 2 chỉ cách đáp án một bước.
- `quan-he-chia-het-va-tinh-chat` vòng 1, `ex.chon-12q-9`: hình nấc 2 dùng số khác đề (15 · q + 6) nhưng xét đúng số chia 3 là đáp án của đề và kết luận "a chia hết cho 3". Dùng số khác đề chưa đủ: số được xét trong hình cũng không được là đáp án.
- `uoc-chung-uoc-chung-lon-nhat` vòng 1, `ex.cat-8-12-tu-lam`: hình tương tác `cutTry` luôn bắt đầu ở độ dài 2, đúng một đáp án (2 là ước chung của 8 và 12), và dòng kết luận "... là ước chung" hiện cả khi làm bài, nên màn mở ra đã báo đáp án và mỗi lần bấm hình tự chấm. Hình dùng cho bài tập phải có trạng thái đầu không phải đáp án và không hiện lời kết luận trước khi trẻ nộp.

## Nguyên nhân gốc

Soạn gợi ý như lời giải thu nhỏ thay vì chỉ chỗ cần nhìn lại; không đối chiếu phần được tô với `answer`.

## Cách phòng

- Máy: `content:check` luật `[hint-answer]`: `hints.highlight` trỏ vào `option` nằm trong `answer` của `choice`/`tapRegion`, hay câu nằm trong `answer` của `tapText`, là lỗi.
- Người: checklist "Luật gợi ý 3 nấc" (nấc 2 dừng ở "?", chú thích lề của `passage`, chữ trong `segments` của `fillBlank`).

## Trạng thái

Đang áp dụng. Nấc 2 (hình) và chú thích lề chưa máy hoá.
