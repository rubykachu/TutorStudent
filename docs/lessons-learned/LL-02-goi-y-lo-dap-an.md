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
- `on-tap-chuong-2` vòng 1, `ex.bai-2-56b`: câu chọn lý do ("Hợp số, vì là tổng của hai số chia hết cho 7 / 2 / 9"); hình nấc 2 `tn256b-goi-y` dùng số khác đề nhưng xét đúng số chia 2 và kết luận "Tổng chia hết cho 2 và lớn hơn 2: hợp số", tức chỉ thẳng lựa chọn đúng. Với câu chọn lý do, lý do trong hình cũng là đáp án; câu cùng dạng `bai-2-56a` tránh được vì hình xét số chia khác.
- `phep-cong-phep-tru-so-nguyen` phần bài tập sách bài tập vòng 7 (Nghiêm trọng), `ex.dan-3-10-y-duong5`: hình gợi ý `so-doi-vi-du` có dòng "5 → −5" đúng số của đề (y = 5); đã đổi đề sang y = 9. Vòng 6 (Nên sửa): hình gợi ý của SBT 3.16 dùng đúng hai số của đề, chỉ đảo thứ tự; đổi sang hình "−6 − 4".
- `quy-tac-dau-ngoac` phần bài tập sách bài tập vòng 5 (Nên sửa, hai mục): hình gợi ý `sbt-goi-y-khong-co-so-am` ("0 + 4 + 2 = ?") của câu chọn `dan-3-25-co-so-am` là chính lập luận của đáp án (đổi sang ba bộ ba số có tổng âm, dừng ở "?"); câu dẫn `dan-3-21a-20-35` không có cặp số đối mà hình gợi ý là "ghép số đối" (đổi sang hình cùng dạng ngoặc có dấu − ba số hạng).
- `chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc` vòng 1, hình gợi ý `goi-y-4-24` (`ex.sbt-4-24`, `fillBlank` hai ô chu vi và diện tích): ví dụ dùng số khác đề (9 m và 5 m) nhưng hàng chu vi `2 · (9 + 5) = 28 m` ra đúng ô chu vi của đề, và hàng này không bị che vì chế độ gợi ý chỉ che hàng cuối; hàng diện tích còn dùng đúng phần khuyết 2 m và 2 m của đề. Điểm mới: "số khác đề" chưa đủ, phải tính mọi hàng hiện ra của hình gợi ý và so với từng đáp số (câu nhiều ô có nhiều đáp số) và với số trung gian của đề.
- `hinh-binh-hanh-hinh-thang-can` vòng 2, `ex.sbt-4-18`: hình nấc 2 `ghep-thang-can-cac-buoc` dừng ở khung đã ghép xong ba tam giác, giống hình nấc 3 `sbt-4-18-giai`; reviewer nhóm hạ mức vì bảng ghép đã có viền đích nét đứt. Điểm mới: câu ghép hình hay vẽ, hình chạy từng bước dùng làm nấc 2 phải dừng trước khung cuối (khung cuối chính là kết quả của đề), dù bảng làm bài có viền đích.

## Nguyên nhân gốc

Soạn gợi ý như lời giải thu nhỏ thay vì chỉ chỗ cần nhìn lại; không đối chiếu phần được tô với `answer`.

## Cách phòng

- Máy: `content:check` luật `[hint-answer]`: `hints.highlight` trỏ vào `option` nằm trong `answer` của `choice`/`tapRegion`, hay câu nằm trong `answer` của `tapText`, là lỗi.
- Người: checklist "Luật gợi ý 3 nấc" (nấc 2 dừng ở "?", chú thích lề của `passage`, chữ trong `segments` của `fillBlank`).

## Trạng thái

Đang áp dụng. Nấc 2 (hình) và chú thích lề chưa máy hoá.
