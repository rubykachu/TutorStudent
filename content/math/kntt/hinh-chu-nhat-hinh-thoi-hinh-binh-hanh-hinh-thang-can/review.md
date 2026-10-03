# Review: Hình chữ nhật. Hình thoi (`hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Bài: `content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/lesson.json` (Bài 19, phần 1)
- Vòng 2 (toàn bài, 4 reviewer Opus song song + tổng hợp Opus, tệp nhóm `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/nhom-{1,2,3,4}.md`): 1 Nghiêm trọng, 22 Nên sửa, 21 Góp ý; đã sửa hết Nghiêm trọng và Nên sửa (mục "Kết quả sửa vòng 2").
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: `hinh-quanh-ta`, `hinh-chu-nhat`, `cheo-hinh-chu-nhat`, `song-song`, `hinh-thoi`, `cheo-hinh-thoi`, `ve-hinh-chu-nhat`, `ve-hinh-thoi`, `kiem-thoi-chu-nhat`, `bai-tap-sach-bai-tap` (diff có mục ở 9 section; section `hinh-chu-nhat` đọc cùng section với các mục liên quan)
- Nguồn đã đọc: `sources/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/` - sbt-p67, sbt-p68, sbt-p69, sbt-p115
- `content:check`: 0 lỗi (theo kết quả điều phối chuyển)
- Đọc hiểu (Haiku, lượt 1): 98 / 2 / 0; tệp `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/doc-hieu.md` (lượt 2 trên 2 mục viết lại: 6 / 0 / 0)
- `lesson:walk`: 0 FAIL, 0 cảnh báo (sau sửa), ba thiết bị, ảnh trong `.shots/walk/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`
- Kết luận: Đã xuất bản (0 Nghiêm trọng; `pnpm content:hash hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can --root content --approve`, `status: published`; id đã khoá bằng `pnpm content:lock hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`). Nên sửa 1 của vòng 3 đã sửa trước lệnh duyệt; Góp ý để lại cho vòng sau.
- Bản đã review: `5631cca68024593cd4e006cbd3fa9c1ed570728361055c9d8b0ea30ca118ec88` (`pnpm content:diff` so với bản này)

## Tách bài

Bài 19 của sách quá dài cho bé chậm nên tách theo hình thành hai bài của app, cùng `number` 19, `part` 1 và 2 (luật chung: `.claude/rules/content.md`, "Splitting a long lesson").
- Phần 1 (bài này): 9 phần dạy và phần bài tập sách bài tập; bài tập SBT 4.8, 4.10, 4.11, 4.14, 4.15.
- Phần 2 `hinh-binh-hanh-hinh-thang-can`: SBT 4.9, 4.12, 4.13, 4.16, 4.17, 4.18, 4.19.
- Tiêu chí cho điểm ngoài trang sách: giữ khi cần để làm một bài tập trên các trang đã nạp (dòng "Kĩ năng giải toán" tr.67, chữ trong đề, lời giải tr.115) và cách vẽ chuẩn SGK; không giữ dấu hiệu "hai đường chéo bằng nhau thì là hình chữ nhật", "hình thoi góc 60° có đường chéo ngắn bằng cạnh", từ "tia", "tâm". Bước chọn góc 45°, 60°, 75° ở 4.11 giữ theo quyết định của chủ dự án.

## Kết quả sửa vòng 2

Nghiêm trọng 1 (`explain` của `chon-hinh-thoi`, nhiễu hình năm cạnh): đã sửa đúng. `explain` mới "Hình thoi có bốn cạnh, và bốn cạnh đều bằng nhau."; `wrong` cho `d` nói hình năm cạnh; không gọi theo vị trí, không dùng "tứ giác".

Nên sửa:
- 1 (vật mẫu hình thoi): đã sửa. Mắt lưới hàng rào B40 thay khung cánh diều ở câu nối (cột trái là hình vật), `explain`, note mở bài, note `hinh-thoi`; không còn chữ "diều" trong bài và mã hình; hình vật vẽ đúng mắt lưới bốn cạnh bằng nhau. Chờ chủ dự án xác nhận vật mẫu (mục "Cần chủ dự án quyết").
- 2 (câu quy tắc, recap `hinh-quanh-ta`): đã sửa. Câu quy tắc nêu cánh cửa và B40, recap và thẻ lặp nguyên văn.
- 3 (nhiễu `ten-hinh-thoi`): đã sửa. Nhiễu "Hình vuông" kèm `wrong`; hình đề có góc 60° nên không thành đáp án thứ hai.
- 4 (`song-song` hỏi lại đúng hình quy tắc): đã sửa. Câu kiểm tra dùng PQRS, câu luyện dùng EFGH nằm nghiêng hỏi FG; hình quy tắc vẫn ABCD.
- 5 (`cheo-hinh-thoi` thiếu ví dụ đời sống): đã sửa (note mở đầu dùng B40); còn một lệch nhỏ về chữ, xem Nên sửa 1.
- 6 (đáp án "cách nhau một khoảng như nhau" mà recap không có): đã sửa theo hướng thêm ý vào câu quy tắc, recap, thẻ lặp nguyên văn; lựa chọn của kho ôn khớp.
- 7 (`sourceRef` còn 4.16): đã sửa ở section và thẻ.
- 8 ("cách AB đúng 3 cm"): đã sửa. Khung hình mẫu và ba lời giải nói "lấy BC = AD = 3 cm trên hai đường vuông góc, cùng một phía"; cặp tên đỉnh khớp từng đề (DEFG: DG = EF; EFGH: EH = FG; XYZT: XT = YZ).
- 9 (cung cắt tên đỉnh thứ tư): đã sửa bằng `boardView`; ảnh iPad và điện thoại cho thấy tên H, Q, T, Z tách khỏi cung và đường kẻ.
- 10 (bảng vẽ nhỏ): sửa một phần. Chữ tên đỉnh và số thước đọc rõ; hình chữ nhật 5 × 2 cm còn khoảng 1/5 bề rộng khung iPad dọc (trước khoảng 1/9), xem Góp ý 1.
- 11 (hình thoi nhiễu như hình vuông xoay): đã sửa, hình thoi dẹt rõ ở `chon-hinh-bon-goc-vuong`.
- 12 (`wrong` "dấu hiệu", "là điều của"): đã sửa, hai câu mới đúng chiều và đọc được.
- 13 (nhiễu `ba-goc-khit`): đã sửa ("Có, vì đã có hai góc vuông" kèm `wrong`).
- 14 (nấc 2 của `ve-thoi-efgh`): đã sửa, dùng `ve-thoi-cac-buoc` với số khác đề.
- 15 ("cung tâm"): đã sửa ở bốn lời giải và hai hình lời giải ("đặt kim ở Q rồi ở N, vẽ hai cung gặp nhau tại P").
- 16 (hình lời giải 4.11 ngầm đòi 60°): đã sửa ("Chọn một góc, ví dụ 60°").
- 17 (`dan-4-15-do-canh` gần trùng kho ôn): đã sửa. Câu dẫn mới là EFGH có hình chạm đo, cạnh 3 cm, đáp án khác kho ôn 6-6-6-7; không dùng số của 4.15 (5 cm).
- 18 (đề 4.15 thiếu dòng chạm): đã sửa ("Chạm vào từng dấu ? để đo bốn cạnh. Chọn đáp án đúng." ở khối lệnh cuối, lời sách giữ nguyên, so với `sbt-p69.png`).
- 19 (tên XYZT trùng): đã sửa (EFGH).
- 20 (nấc 1 tô câu hỏi): đã sửa; nấc 1 trỏ `index: 0` là dòng bảo chạm đo (đề không còn số để tô).
- 21 (4.10, 4.11, 4.14 không có lời giải sách): ghi nhận, không đổi; `explain` và hình lời giải khớp `params` (4.10 DE = 3, EF = 5; 4.11 cạnh 4; 4.14 cạnh 5, góc 60°).
- 22 (chữ "tứ giác" ở section 3): đã sửa; không còn "tứ giác" ở section 1-8 (chỉ ở section 9 và 10, và nhãn Hình 4.11 ở section 10).

Góp ý đã làm: 1, 2, 4, 6, 7, 8, 12, 14, 17, 18, 19, 20, đều đúng, không làm hỏng chỗ khác. Chưa làm: 3, 5, 9, 10, 11, 13, 15, 16, 21 (giữ ở mục Góp ý).

Kiểm các mục bị ảnh hưởng: recap của mọi section khớp nguyên văn câu `rule: true`; thẻ khớp recap; kho ôn không trùng số với câu luyện cùng section sau sửa; nhiễu mới (vuông, biển báo tam giác, hình bốn cạnh lệch, hai góc vuông) không thành đáp án đúng; `wrong` có cho mọi nhiễu mới; không gọi lựa chọn theo vị trí; không có "tâm", "tia", hình bình hành, hình thang cân trong chữ của bài; đề SBT 4.8, 4.10, 4.11, 4.14, 4.15 y hệt `sbt-p68.png`, `sbt-p69.png`, đáp án 4.8 (4.11b, 4.11d) và 4.15 (hình thoi) khớp `sbt-p115.png`.

Code dùng chung (đọc mã, không chạy phần 2): `boardView` trả đúng `boardFigure` với mọi bảng không phải hình thoi (phần 2 chỉ dùng `parallelogram`, `parallelogram-diagonal`; test "leaves every other board as boardFigure draws it" khoá); `roomy` mặc định tắt, `maxHeight` không truyền nên về mặc định của `Board`; `trimTop` chỉ gọi từ hình của bài này; cảnh `kite` bị thay bằng `fence` và không còn nơi nào khác dùng; `FIGURE_411` chỉ dùng ở bài này; phần 2 chỉ dùng cảnh `ladder`, `bag`. Không có nghi ngờ.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Note mở đầu `cheo-hinh-thoi` gọi đường chéo là nối "các góc đối nhau", khác định nghĩa "nối hai đỉnh không nằm cạnh nhau" - LL-05

- Vị trí: `$.sections[5].blocks[0].children[0].text` (`section.cheo-hinh-thoi`)
- Nguồn: tr.67, `sbt-p67.png`
- Vấn đề: section `cheo-hinh-chu-nhat` dạy "Đường chéo là đoạn thẳng nối hai đỉnh không nằm cạnh nhau"; ở đây cùng khái niệm nói bằng "nối các góc đối nhau", mà "góc đối" ở section `hinh-thoi` là tên của hai góc đối diện. Một khái niệm hai cách nói, bé chậm dễ hiểu "nối hai góc".
- Sửa: "Trong một mắt lưới B40, nối hai đỉnh không nằm cạnh nhau của hình thoi ta được hai đường chéo. Xem hình chạy từng bước để biết chúng nằm thế nào so với nhau." (kiểm `[length]`)
- Tình trạng: đã sửa sau vòng 3 thành "Mắt lưới B40 có dạng hình thoi. Nối hai đỉnh không nằm cạnh nhau của nó, ta được một đường chéo." (hai câu cho `[length]`; câu "xem hình chạy từng bước" bỏ vì hình nằm ngay dưới); Haiku lượt 3 đọc lại mục này: `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/doc-hieu-3.md`.

## Góp ý

### 1. Bảng vẽ iPad dọc vẫn nhỏ (còn lại của Nên sửa 10 vòng 2) - LL-12

- Vị trí: `ve-chu-nhat-abcd`, `ve-chu-nhat-efgh`, `ve-chu-nhat-defg`, bảng 4.10; walk `ipad/110`-`114`
- Vấn đề: hình chữ nhật 5 × 2 cm khoảng 1/5 bề rộng khung; chữ đọc rõ, nhưng chiều cao bị giữ bởi chỗ trống 7 cm của bảng và `ROOMY_MAX_HEIGHT`.
- Sửa: tuỳ tác giả; nếu làm, cho bảng chữ nhật chỉ chừa chỗ theo cạnh lớn nhất của bài (như `trimTop` ở hình từng bước).

### 2. Recap và quy tắc `hinh-quanh-ta` nhắc cánh cửa, B40 nhưng hình dưới chỉ có hai hình trơn - LL-15

- Vị trí: `$.sections[0].recap` (hình `hai-hinh-ten`), thẻ `card.hinh-quanh-ta`
- Vấn đề: ở thẻ ôn ngoài bài, bé đọc "Cánh cửa... B40..." nhưng hình chỉ có hình chữ nhật và hình thoi; không sai, nhưng hình vật ở `hai-vat-doi-song` sẽ nhắc nhớ tốt hơn.
- Sửa: tuỳ tác giả; hình recap ghép hình vật với tên hình.

### 3. `khung-anh-cheo`: `wrong` mở bằng "Hình nào có bốn cạnh cũng có bốn góc" đọc như câu hỏi - LL-25

- Vị trí: `$.exercises[12].explain.wrong[0].text`
- Sửa: "Hình có bốn cạnh nào cũng có bốn góc, nên chỉ vậy thì chưa đủ để là hình chữ nhật."

### 4. Ba câu liền nhau về bốn cạnh đều trả lời "Có" - LL-14

- Vị trí: `$.exercises[40]` (`ex.kiem-thoi-bon-canh`), `$.exercises[53]` (`ex.dan-4-15-do-canh`), `$.exercises[55]` (`ex.sbt-4-15`)
- Vấn đề: câu dẫn và câu 4.15 cùng đáp án "Có" nên bé có thể chọn theo thói quen thay vì đo; bé vẫn phải chạm đo bốn cạnh mới thấy số.
- Sửa: tuỳ tác giả; cho câu dẫn một cạnh lệch (đáp án "Không") nếu muốn ép đo.

### 5. Từ vòng 2 (Góp ý 3): kho ôn của `card.hinh-quanh-ta` đều lấy B40, `ex.dien-ten-hinh` gần nguyên văn câu quy tắc

- Vị trí: `$.exercises[3]`, `$.exercises[4]` (`segments`: "Mặt bàn học có dạng ___. Mắt lưới hàng rào B40 có dạng ___.") - LL-07
- Sửa: một câu đổi vật hình thoi khác (ô trám hoa văn gạch) hoặc hỏi ngược (hình thoi là vật nào).

### 6. Từ vòng 2 (Góp ý 5): `canh-doi-chu-nhat-9-4`, hình tỉ lệ 3 : 2 với nhãn 9 cm và 4 cm; đáp án 4 cm trùng DA của "Cùng làm" - LL-15, LL-07

- Vị trí: `$.exercises[9]` (hình `chu-nhat-mnpq-9-4`)
- Sửa: AB = 9 cm, BC = 6 cm, hỏi DA (đáp án 6); hoặc vẽ khung theo tỉ lệ 9 : 4.

### 7. Từ vòng 2 (Góp ý 9): `canh-song-song-np` không có hình

- Vị trí: `$.exercises[19]`
- Sửa: thêm hình chữ nhật MNPQ nằm nghiêng, hoặc `wrong` cho `pq`: "P là đỉnh chung của NP và PQ, nên hai cạnh này không song song."

### 8. Từ vòng 2 (Góp ý 10): nhãn O sát nhãn "90°" ở `do-cheo-thoi`; câu kiểm tra `cheo-thoi-goc-aob` hỏi đúng góc vừa đo - LL-12, LL-07

- Vị trí: hình `do-cheo-thoi` (`catalog-chu-nhat-thoi.ts`), walk `086-s6-03`; `$.exercises[25]`
- Sửa: dời O sang khe phải trên hoặc đẩy nhãn số đo xa tâm; câu kiểm tra dùng hình thoi khác dáng hay hỏi góc BOC.

### 9. Từ vòng 2 (Góp ý 11): hình chạm `do-thoi` nhỏ, các vòng "?" chạm nhau trên iPad - LL-12

- Vị trí: hình `do-thoi`; walk `072-s5-03`
- Sửa: tăng cỡ hình hay giảm `PROBE_MARGIN` cho hình này; nếu do bố cục chung của hình chạm thì báo người làm app.

### 10. Từ vòng 2 (Góp ý 13): `ve-thoi-hai-tam-giac` có đáp án là chính số trong đề - LL-14

- Vị trí: `$.exercises[39]`
- Sửa: hỏi góc: "Hình thoi đó có một góc bằng bao nhiêu độ?" (60).

### 11. Từ vòng 2 (Góp ý 15): mẹo góc tờ giấy: "hai cạnh trùng nhau" không rõ cạnh nào; hình chỉ có trường hợp khít - LL-10

- Vị trí: `$.sections[8].blocks[2].text`, hình `to-giay-goc`
- Sửa: "Hai mép giấy nằm đúng trên hai cạnh của góc, gọi là khít"; hình thêm hai ô nhỏ "hở" và "chờm ra".

### 12. Từ vòng 2 (Góp ý 16): câu quy tắc vẽ hình thoi dừng ở "vẽ hai cung gặp nhau", thiếu bước nối

- Vị trí: `$.sections[7].blocks[1].children[1]`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption`, `$.sections[9].blocks[1].children[2]` (lặp nguyên văn)
- Sửa: "…vẽ hai cung gặp nhau rồi nối." ở mọi chỗ lặp (kiểm `[rule-sentence]`, `[length]`).

### 13. Từ vòng 2 (Góp ý 21): recap của section bài tập sách bài tập chỉ nhắc quy tắc của 4.15

- Vị trí: `$.sections[9].recap`
- Sửa: tuỳ tác giả; chấp nhận được vì đó là câu duy nhất có `rule: true` ở section.

## Cần chủ dự án quyết

1. Vật mẫu hình thoi cho cả bài: tác giả đã chọn mắt lưới hàng rào B40 (thay khung cánh diều, vì diều không phải lúc nào cũng là hình thoi), dùng ở `hinh-quanh-ta`, `hinh-thoi`, `cheo-hinh-thoi`, câu nối và kho ôn; chủ dự án chưa hỏi được, chờ xác nhận.
2. Bước chọn góc 45°, 60°, 75° khi vẽ hình thoi (4.11): giữ theo quyết định đã có; hình lời giải nay nói "chọn một góc, ví dụ 60°".
3. 4.10, 4.11, 4.14 không có lời giải sách: Reviewer vòng 1, 2 và 3 tự giải, khớp `params`.
