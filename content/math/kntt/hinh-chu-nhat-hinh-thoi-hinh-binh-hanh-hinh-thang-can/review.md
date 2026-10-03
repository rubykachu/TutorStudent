# Review: Hình chữ nhật. Hình thoi (`hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Bài: `content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/lesson.json`
- Vòng: 1 - toàn bài của bài chưa tách `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` (3 reviewer song song + tổng hợp, commit `38c726d`, nhóm 1: phần 1–6; nhóm 2: phần 7–15; nhóm 3: phần 16–18 và phần bài tập sách bài tập; tệp nhóm ở `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/nhom-<n>.md`, ngoài git). Bài này là phần 1 của Bài 19 sau khi tách; vòng kế là vòng 2, toàn bài, Opus.
- Nguồn đã đọc: `sources/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/` - sbt-p67, sbt-p68, sbt-p69, sbt-p115 (bản sao của `sources/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`)
- Kết luận vòng 1: chưa đạt, 21 Nghiêm trọng, 32 Nên sửa, 15 Góp ý cho cả bài chưa tách; đã sửa hết Nghiêm trọng (commit `36ff39a`, `cabb254`). Sau đó chủ dự án quyết tách bài. Bài giữ `draft`, chưa ghi `reviewedHash`, chưa `content:lock`; vòng 2 chưa chạy.

## Tách bài

Bài 19 chưa tách (19 phần, 118 câu, 112 phút) quá dài cho bé chậm, nên chủ dự án tách theo hình thành hai bài của app (`part` 1 và 2, cùng `number` 19 và `chapter`; `order` 19 và 19.1):
- Phần 1, `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`, "Hình chữ nhật. Hình thoi": 9 phần dạy và phần bài tập sách bài tập, 9 thẻ, 56 câu, 55 phút; bài tập SBT: 4.8, 4.10, 4.11, 4.14, 4.15.
- Phần 2, `hinh-binh-hanh-hinh-thang-can`, "Hình bình hành. Hình thang cân": 9 phần dạy và phần bài tập sách bài tập, 9 thẻ, 60 câu, 58 phút; bài tập SBT: 4.9, 4.12, 4.13, 4.16, 4.17, 4.18, 4.19.

Mỗi bài tập SBT thuộc bài có hình của nó; bài cần hình của cả hai bài thì thuộc phần 2. Bài này (phần 1) giữ: 4.8, 4.10, 4.11, 4.14, 4.15. Phần bài tập sách bài tập của bài này là 5 câu sách và 6 câu dẫn.

Phần của bài chưa tách và nơi chúng ở bây giờ (`<phần cũ>` theo thứ tự của bài chưa tách):

| Phần cũ | Id | Bài mới |
|---|---|---|
| 1 | `hinh-quanh-ta` | viết lại thành "Hai hình quanh ta" ở phần 1; phần 2 không có mở đầu riêng (mỗi phần dạy hình mới đã mở bằng vật quanh nhà) |
| 2 | `hinh-chu-nhat` | phần 1 |
| 3 | `cheo-hinh-chu-nhat` | phần 1 |
| 4 | `song-song` | phần 1 |
| 5 | `hinh-thoi` | phần 1 |
| 6 | `cheo-hinh-thoi` | phần 1 |
| 7 | `hinh-binh-hanh` | phần 2 |
| 8 | `cheo-hinh-binh-hanh` | phần 2 |
| 9 | `hinh-thang-can` | phần 2 |
| 10 | `cheo-hinh-thang-can` | phần 2 |
| 11 | `so-sanh-bon-hinh` | phần 2 |
| 12 | `ve-hinh-chu-nhat` | phần 1 |
| 13 | `ve-hinh-thoi` | phần 1 |
| 14 | `ve-hinh-binh-hanh` | phần 2 |
| 15 | `ve-binh-hanh-cheo` | phần 2 |
| 16 | `kiem-thoi-chu-nhat` | phần 1 |
| 17 | `kiem-binh-hanh` | phần 2 |
| 18 | `ghep-hinh` | phần 2 |
| 19 | `bai-tap-sach-bai-tap` | chia: phần 1 giữ SBT 4.8, 4.10, 4.11, 4.14, 4.15; phần 2 giữ SBT 4.9, 4.12, 4.13, 4.16 đến 4.19 |

Điểm tách đổi nội dung (soát ở vòng 2):
- Phần `hinh-quanh-ta` mới, chỉ hai hình (cánh cửa, khung cánh diều): hình, lời, câu và hình chạm viết lại; không còn tên hình bình hành, hình thang cân.
- Nhiễu của `chon-hinh-chu-nhat`, `chon-hinh-thoi`, hình `chon-hinh-bon-goc-vuong` (phần kiểm tra) và `dan-4-8-noi-ten` thay hình bình hành, hình thang cân bằng hình năm cạnh và tứ giác lệch (không tên); lời `explain` và `wrong` của chúng không nêu hình của phần 2.
- SBT 4.8: gợi ý nấc 2 là hình hai hình `so-sanh-hai-hinh`; `explain` và hình lời giải gọi hai hình còn lại của Hình 4.11 là "hình khác".
- `overview` viết lại cho hai hình (chào bạn ở câu đầu); phần bài tập sách bài tập có ba khối "Nhắc lại" và recap là câu quy tắc kiểm tra hình thoi, hình chữ nhật.

Tiêu chí cho điểm ngoài trang sách (như Bài 18, LL-09): được giữ khi điều đó cần để làm một bài tập trên các trang đã nạp và lần được về một dòng in (dòng "Kĩ năng giải toán" tr.67, chữ trong đề, lời giải tr.115). Các bước vẽ không in trong SBT nhưng là cách vẽ chuẩn SGK KNTT 6 được giữ nếu đúng (đã quyết với Bài 18). Không giữ: dấu hiệu "đường chéo bằng nhau thì là hình chữ nhật" (Nghiêm trọng 1), "hình thoi góc 60° có đường chéo ngắn bằng cạnh" (Nghiêm trọng 2), từ "tia" (Nghiêm trọng 7), "tâm" của hình lục giác (Nghiêm trọng 21).

Phát hiện của vòng 1 thuộc bài này ở dưới, giữ số thứ tự của báo cáo gốc (`git show 38c726d:content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/review.md`). Vị trí `$.…[n]` đã đổi sang vị trí trong `lesson.json` của bài này; vị trí thuộc bài kia ghi `[phần n] $.…` (vị trí trong bài phần n); vị trí đã bỏ khi sửa vòng 1 ghi `[đã bỏ khi sửa vòng 1]`; số phần trong lời phát hiện ("phần 12", "phần 14") là số thứ tự trong bài chưa tách (bảng trên cho biết phần đó ở bài nào); "Tình trạng" là kết quả sửa sau vòng 1, vòng 2 kiểm lại từng mục.

## Nghiêm trọng

### 1. Mẹo "Kiểm tra khung" và `whyItMatters` dạy dấu hiệu nhận biết hình chữ nhật bằng đường chéo (lớp 8) (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.sections[2].blocks[2]` (`tip` kiểm khung); `$.overview.whyItMatters` - LL-09
- Nguồn: tr.67, `sbt-p67.png` (chỉ có chiều "hình chữ nhật thì hai đường chéo bằng nhau")
- Vấn đề: "Hai đường chéo bằng nhau thì khung là hình chữ nhật" là chiều đảo, lớp 8; không bài nào từ 4.8 đến 4.19 cần (4.16 kiểm bằng êke bốn góc). `whyItMatters` lặp đúng ý đó ở màn đầu bài.
- Sửa: mẹo theo chiều sách có: "Khung hình chữ nhật thì hai đường chéo bằng nhau. Đo thấy hai đường chéo khác nhau là khung bị lệch." `whyItMatters` cùng ý. Có thể đổi `kind` sang tránh sai.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 2. Mẹo "Hình thoi có góc 60°" và câu luyện `thoi-bd-4` dựa vào kiến thức lớp 7

- Vị trí: `$.sections[5].blocks[2]` (`tip.thoi-60-do`); `[đã bỏ khi sửa vòng 1] $.exercises[27]` (`ex.thoi-bd-4`) và `explain` - LL-09
- Nguồn: tr.67–69
- Vấn đề: suy "tam giác ABD có AB = AD, góc A = 60° nên là tam giác đều" cần tổng ba góc tam giác (lớp 7). Không bài sách nào cần. `thoi-bd-4` chỉ làm được nhờ mẹo; mẹo về độ dài đường chéo lại nằm ở phần có quy tắc "hai đường chéo vuông góc".
- Sửa: bỏ mẹo khỏi phần 6; thay `thoi-bd-4` bằng câu luyện quy tắc vuông góc (vd hình thoi EFGH, đường chéo cắt nhau tại I, hỏi góc FIG), số khác câu kiểm tra và kho ôn. Chiều "hai tam giác đều chung cạnh ghép thành hình thoi" đã có ở mẹo phần 13, giữ ở đó.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 3. `explain` của `cheo-thoi-chon-hinh` nói "Hai đường chéo vuông góc là dấu hiệu của hình thoi"

- Vị trí: `$.exercises[26].explain.text` (`ex.cheo-thoi-chon-hinh`) - LL-17
- Nguồn: tr.67
- Vấn đề: đảo chiều quy tắc và sai (tứ giác hình cánh diều có hai đường chéo vuông góc). Bài dùng chữ "dấu hiệu" cho cách nhận biết ở phần 16, 17 nên bé nhớ đây là một cách nhận biết hình thoi.
- Sửa: "Hình thoi có hai đường chéo vuông góc với nhau, nên chọn hình thoi. Ở hai hình còn lại, hai đường chéo cắt nhau không thành góc vuông."
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 4. Dấu mũi tên song song chỉ có trên lựa chọn đúng của `chon-hinh-song-song`

- Vị trí: `$.exercises[16].options` (`ex.chon-hinh-song-song`); hình `th-hai-duong-song-song` (`src/visuals/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/catalog-chu-nhat-thoi.ts:22`, `parallel: [[0, 1]]`); walk `065-s4-05-exercise-chon-hinh-song-song.png` - LL-03
- Vấn đề: màn trước vừa dạy "song song đánh dấu bằng hai mũi tên giống nhau"; bé chọn theo dấu. Ba hình lựa chọn cũng giống hệt ba thẻ "Cùng làm" `xem-song-song`.
- Sửa: bỏ dấu song song ở hình lựa chọn; đổi góc nghiêng, khoảng cách của ba cặp đường cho khác thẻ "Cùng làm".
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 5. Đỉnh bị gọi là "góc" trong định nghĩa đường chéo, câu quy tắc vẽ và lời giải (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.overview.goals[1]`; `$.sections[2].blocks[0].children[0].text` ("đường nối hai góc không kề nhau"); `$.exercises[14].explain` và hai `wrong` (`ex.chon-duong-cheo`); câu quy tắc `[phần 2] $.sections[6].blocks[1].children[0]` ("để tìm góc còn lại") cùng `[phần 2] $.sections[6].recap.caption`, `[phần 2] $.cards[6].recap.caption`, `$.sections[9].blocks[1].children[4]`; `$.exercises[35].explain.text` (`ex.ve-thoi-quy-trinh`); `[phần 2] $.exercises[41].explain.text` (`ex.dem-thoi-luc-giac`: "nối O với một góc của lục giác", trong khi đề cùng câu viết "chung đỉnh O") - LL-05, LL-17
- Nguồn: tr.67; Bài 18 dạy "Đường chéo là đoạn thẳng nối hai đỉnh không nằm cạnh nhau", glossary có `đỉnh`
- Vấn đề: góc không phải một điểm; thứ tìm bằng hai cung là đỉnh. Cả bài không dùng chữ "đỉnh" lần nào trong phần dạy, nên một khái niệm có hai định nghĩa trong cùng chương và bé nhớ "góc" là một điểm, trái "góc 60°" ngay trong bài. Nhóm 1, 2, 3 cùng gặp.
- Sửa: dùng lại câu Bài 18 ở định nghĩa và `goals[1]`: "Đường chéo là đoạn thẳng nối hai đỉnh không nằm cạnh nhau." `chon-duong-cheo`: "Đường chéo nối hai đỉnh không nằm cạnh nhau: A với C, B với D." / "A và B nằm cạnh nhau, nên AB là cạnh." Quy tắc phần 15 và `ve-thoi-quy-trinh`: "để tìm đỉnh còn lại" (đổi recap, thẻ, "Nhắc lại" nguyên văn). `dem-thoi-luc-giac`: "nối O với một đỉnh của lục giác". Soát lại bằng tìm "góc còn lại", "góc không kề", "góc kề nhau", "một góc của".
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 6. Tên điểm O bị dấu góc vuông đè ở màn "Cùng làm" phần 6

- Vị trí: hình `do-cheo-thoi` (`catalog-chu-nhat-thoi.ts:632`), `$.sections[5].blocks[3]`; walk `089-s6-04-block-shown.png` (iPad, điện thoại) - LL-12
- Vấn đề: bốn dấu góc vuông ghép thành ô vuông quanh O, cạnh trái cắt ngang chữ "O".
- Sửa: dời nhãn O xa tâm (khoảng 26px) hoặc thu nhỏ dấu góc vuông của bộ đo; sửa cùng Góp ý 2.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 7. Từ "tia" chưa dạy, không có trong sách và glossary (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: định nghĩa `$.sections[7].blocks[1].children[0]`; câu quy tắc `$.sections[7].blocks[1].children[1]`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption`, `$.sections[9].blocks[1].children[2]`; mục `order` `$.exercises[35].items[1]`, `[phần 2] $.exercises[25].items[1]`, `[phần 2] $.exercises[25].items[2]`; `explain` của `$.exercises[35]`, `[62]`, `[63]`, `[65]`, `[67]`, `[68]`, `[96]`–`[99]`, `[103]`, `[104]`; chữ bước bảng vẽ `construction.ts:91`, `:123`, `:151`; chú thích khung `catalog-drawing.ts:110`, `:114`, `:174`, `:178`, `catalog-book.ts:165`, `:169`, `:199`, `:203`, `:270`, `:274` - LL-09
- Nguồn: tr.67–69 không có chữ "tia"; glossary chỉ có "tia số"
- Vấn đề: tia là khái niệm của chương hình học cơ bản (học sau), không phải kiến thức nền. Một câu định nghĩa không đủ để bé phân biệt tia với đoạn thẳng. Lượt Haiku 1 xếp mơ hồ khoảng 16 mục vì "tia là gì". Cùng kiểu "tâm" ở Bài 18 vòng 1.
- Sửa: bỏ khái niệm tia, dùng "đường kẻ": "Dùng thước đo góc kẻ đường AD tạo với AB một góc 75°", "Lấy D trên đường đó". Xoá câu định nghĩa tia, giữ câu "Độ mở compa là ...". Đổi đồng loạt trong `lesson.json` và ba tệp hình.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 8. Quy tắc vẽ hình thoi thiếu điều kiện compa (độ mở bằng cạnh, tâm ở hai đầu) (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.sections[7].blocks[1].children[1]`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption`, `$.sections[9].blocks[1].children[2]`; mục `s4` của `$.exercises[35]` ("Vẽ hai cung tròn từ Q và từ N, cùng độ mở.") và `explain` - LL-17
- Nguồn: bài 4.11, 4.14 tr.68
- Vấn đề: làm đúng chữ với hai cung cùng độ mở khác cạnh (cạnh 4 cm, cung 5 cm) ra hình hai cạnh 4 cm, hai cạnh 5 cm, không phải hình thoi; câu cũng không nói tâm cung. Bảng vẽ tự giữ độ mở nên trên màn không lộ, nhưng bé vẽ 4.11, 4.14 và bài kiểm tra trên giấy chỉ nhờ câu này. Các `explain` (vd `[62]`, `[96]`) đã nói đủ "cùng độ mở 2 cm từ H và từ F"; chỉ câu nhớ thiếu. Cùng kiểu Nghiêm trọng 5 vòng 1 Bài 18.
- Sửa (tách hai câu cho vừa `[rule-sentence]`, recap lặp nguyên văn): "Vẽ một cạnh, kẻ một đường từ đầu cạnh, lấy trên đó cạnh thứ hai bằng cạnh đầu. Mở compa bằng cạnh, đặt kim ở hai đầu mút còn lại vẽ hai cung." Mục `s4`: "Mở compa bằng MN, vẽ cung tâm Q và cung tâm N."
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 9. Quy tắc vẽ hình bình hành biết đường chéo thiếu điều kiện compa và điểm đi qua (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[phần 2] $.sections[6].blocks[1].children[0]`, `[phần 2] $.sections[6].recap.caption`, `[phần 2] $.cards[6].recap.caption`, `$.sections[9].blocks[1].children[4]` - LL-17
- Nguồn: bài 4.13 tr.68
- Vấn đề: "Vẽ tam giác bằng compa" không nói tam giác nào, không nói cung tâm A bán kính AC và tâm B bán kính BC; bài chưa dạy vẽ tam giác biết ba cạnh ở chỗ nào khác. Hai đường song song không nói qua điểm nào, song song với cạnh nào. Chỉ nhớ câu này bé không vẽ được 4.13 trên giấy.
- Sửa (hai câu, recap lặp nguyên văn, rút cho vừa `[length]`): "Vẽ AB, rồi vẽ cung tâm B bán kính BC và cung tâm A bán kính AC, gặp nhau tại C. Dùng êke vẽ qua C đường song song với AB, qua A đường song song với BC, gặp nhau tại D."
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 10. Quy tắc vẽ hình chữ nhật và hình bình hành thiếu "cùng một phía", "bằng cạnh kia", "qua đầu cạnh" (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.sections[6].blocks[1].children[0]`, recap phần 12, `$.cards[6].recap.caption`, `$.sections[9].blocks[1].children[1]`, mục `s3` của `ex.ve-cn-quy-trinh`; `[phần 2] $.sections[5].blocks[1].children[0]`, recap phần 14, `[phần 2] $.cards[5].recap.caption`, `$.sections[9].blocks[1].children[3]`, mục `s4` của `[phần 2] $.exercises[25]` ("vẽ qua F và qua K hai đường song song" không nói song song với gì) - LL-17
- Nguồn: cách vẽ SGK KNTT 6; bài 4.10, 4.12 tr.68
- Vấn đề: "lấy hai đoạn bằng nhau rồi nối" không nói bằng cạnh nào (ra hình chữ nhật sai kích thước của 4.10) và không nói cùng phía; "vẽ hai đường song song với hai cạnh đó" không nói đi qua đâu, hình không khép. Nhóm 2 ghi Nên sửa vì bảng vẽ làm đúng; nhóm 3 ghi Nghiêm trọng vì đây là chữ bé đọc ngay trước 4.10, 4.12 và mang ra bài làm trên giấy. Giữ mức cao hơn.
- Sửa: "Vẽ một cạnh, kẻ hai đường vuông góc ở hai đầu cạnh. Về cùng một phía, lấy hai đoạn bằng cạnh kia rồi nối." "Vẽ hai cạnh liền nhau. Dùng êke vẽ qua đầu mỗi cạnh một đường song song với cạnh kia." Mục `s4`: "Dùng êke vẽ qua F đường song song với EK, qua K đường song song với EF." Đổi recap, thẻ, "Nhắc lại" nguyên văn.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 11. Lý do `wrong` của `ve-thoi-do-mo` sai: cung 2 cm vẫn gặp nhau, cung 8 cm không "đi quá xa"

- Vị trí: `$.exercises[36].explain.wrong[0].text`, `.wrong[1].text` (`ex.ve-thoi-do-mo`) - LL-17
- Vấn đề: hình thoi cạnh 4 cm góc 45°: QN ≈ 3,1 cm < 2 + 2, nên hai cung 2 cm cắt nhau; cung 8 cm luôn cắt nhau. Cả hai lý do sai và giấu lý do thật (điểm cần tìm phải cách Q và N đúng 4 cm).
- Sửa: "Cung 2 cm cho điểm cách hai đỉnh 2 cm, mà hai cạnh còn lại phải dài 4 cm." / "Cung 8 cm cho điểm cách hai đỉnh 8 cm, nên hai cạnh mới dài 8 cm, không bằng 4 cm."
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 15. Bảng vẽ cạnh 2 cm: nhãn "60°" đè cạnh, cung và tên điểm (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `visual.ve-thoi-efgh` (`$.exercises[37]`), `visual.ve-binh-hanh-tap-lam` (`[phần 2] $.sections[5].blocks[3].children[1]`), `visual.ve-binh-hanh-abcd` (`[phần 2] $.exercises[27]`); `construction.ts:459–467`, `:519–527` (`textDistance: 46` lớn hơn cạnh 2 cm = 36 đơn vị); walk `199-s13-07-…`, `207-s14-04-block-shown.png`, `213-s14-07-…-correct.png` - LL-12
- Vấn đề: chữ số đo góc nằm ngoài hình, trên cạnh đối diện; hình rộng khoảng 45 điểm trên iPad; câu luyện có chấm và màn "Cùng làm".
- Sửa: (a) cạnh từ 3 cm trở lên cho bảng có góc, soát lại bảng số tách nhau trong `task.md`; (b) `textDistance` theo cạnh ngắn (vd `Math.min(46, 0.6 * min(len, side) * UNIT)`). Chụp lại và tự xem.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 16. Quy tắc ghép hình phần 18 thiếu "bằng nhau" và điều kiện để ra lục giác đều (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[phần 2] $.sections[8].blocks[1].children[0]`, `[phần 2] $.sections[8].recap.caption`, `[phần 2] $.cards[8].recap.caption`, `$.sections[9].blocks[3].children[1]`; note `[phần 2] $.sections[8].blocks[0].children[0]` ("Ba hình tam giác đều cạnh nhau"); đề và `explain` của `[phần 2] $.exercises[42]` (`ex.ghep-hai-thang-can-thanh`), `[đã bỏ khi sửa vòng 1] $.exercises[116]` (`ex.dan-4-19-hai-ghep`) - LL-17
- Nguồn: tr.69 bài 4.18 ("ba hình tam giác đều có cạnh 4 cm"), 4.19
- Vấn đề: hai hình thang cân đáy nhỏ = cạnh bên = 3 cm, đáy lớn 4 cm ghép theo đáy lớn ra hình sáu cạnh bằng nhau nhưng góc khoảng 161° và 100°, không phải lục giác đều. Cần đáy lớn gấp đôi đáy nhỏ (ghép từ ba tam giác đều bằng nhau). Ba tam giác đều khác cỡ không ghép được.
- Sửa (recap, thẻ, "Nhắc lại" nguyên văn): "Ba hình tam giác đều bằng nhau ghép thành một hình thang cân. Hai hình thang cân như thế ghép thành một hình lục giác đều." Đề `ghep-hai-thang-can-thanh`: "Hai hình thang cân, mỗi hình ghép từ ba tam giác đều bằng nhau, ghép theo đáy lớn. Chúng ghép thành hình gì?"; `explain`: "Ba tam giác đều là một nửa hình lục giác đều, nên hai hình thang cân này ghép thành hình lục giác đều." Note đầu phần: "Ba hình tam giác đều bằng nhau, đặt sát nhau, ghép được thành ...". Câu dẫn 4.19 đổi theo Nên sửa 23.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 18. Lời giải lấy tính chất của hình để kết luận tứ giác là hình đó (suy ngược)

- Vị trí: `$.exercises[40].explain.text` (`ex.kiem-thoi-bon-canh`), `[đã bỏ khi sửa vòng 1] $.exercises[109].explain.text` (`ex.dan-4-16-eke`), `$.exercises[54].explain.text` và `.wrong[0].text` (`ex.dan-4-15-do-gi`: "Bốn góc bằng nhau là dấu hiệu của hình chữ nhật", khác câu quy tắc "bốn góc vuông") - LL-17
- Vấn đề: "Hình thoi có bốn cạnh bằng nhau. XYZT có bốn cạnh bằng nhau, nên là hình thoi" là suy ngược; phần 16 dạy đúng chiều "Tứ giác có bốn cạnh bằng nhau là hình thoi". Đây là câu kiểm tra đầu tiên của phần dạy dấu hiệu nên bé học đúng kiểu suy sai.
- Sửa: "XYZT có bốn cạnh đều dài 4 cm. Tứ giác có bốn cạnh bằng nhau là hình thoi, nên XYZT là hình thoi." Tương tự cho `dan-4-16-eke` ("Tứ giác có bốn góc vuông là hình chữ nhật, nên ..."), `dan-4-15-do-gi` ("Tứ giác có bốn cạnh bằng nhau là hình thoi, nên ta đo bốn cạnh rồi so sánh."); `wrong[0]`: "Đo góc để tìm hình chữ nhật: tứ giác có bốn góc vuông là hình chữ nhật."
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

## Nên sửa

### 1. Phần 4 không có hình nào có cạnh song song trước câu hỏi về hình chữ nhật

- Vị trí: `$.sections[3]` (hình `ray-tau`, `song-song-quy-tac`, `xem-song-song`); `$.exercises[15]`, `$.exercises[17]` - LL-16
- Sửa: hình quy tắc là hình chữ nhật ABCD có mũi tên song song trên AB, CD và BC, DA kèm "AB song song với CD".
- Tình trạng sau vòng 1: đã sửa

### 2. Câu kiểm tra lặp số của hình quy tắc, màn mẫu hay "Cùng làm" (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[đã bỏ khi sửa vòng 1] $.exercises[21]` (`thoi-goc-c`: góc A = 60° như hình quy tắc và recap); `ex.binh-hanh-canh-cd`, `ex.binh-hanh-goc-c` (số của `do-binh-hanh`); `ex.ve-thoi-abcd` (6 cm, 45° như `ve-thoi-tap-lam`); `ex.ve-bh-canh-dc` (số của `ve-binh-hanh-cac-buoc`) - LL-07
- Sửa: đổi số (vd thoi góc B 110° hỏi góc D; bình hành 7 và 5 cm, góc A 110°; kho ôn thoi 5 cm 75°; DC: AB = 6, AD = 4); soát lại bảng số trong `task.md`.
- Tình trạng sau vòng 1: đã sửa

### 3. Nhãn "AC = 8 cm" nằm sát dưới cạnh DC

- Vị trí: hình `chu-nhat-cheo-ac-8` (`catalog-chu-nhat-thoi.ts:343`), `$.exercises[10]`; walk `050-s3-05-…` - LL-12, LL-15
- Sửa: đặt nhãn dọc theo AC trong hình hoặc ngoài hình cạnh C, có đường dẫn.
- Tình trạng sau vòng 1: đã sửa

### 4. Đường chéo hình chữ nhật ghi 5 cm, ngắn hơn cạnh 6 cm của cùng hình ở phần trước

- Vị trí: `do-cheo-chu-nhat` (`catalog-chu-nhat-thoi.ts:304`) so với `do-chu-nhat` (6 cm, 4 cm) - LL-15
- Sửa: cạnh 4 cm và 3 cm (vẽ tỉ lệ 4 : 3, đường chéo 5 cm), hoặc ghi đường chéo đúng với hình.
- Tình trạng sau vòng 1: đã sửa

### 5. Nhiễu Có/Không trái ngay dữ kiện đề (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.exercises[12].options` (`khung-anh-cheo`: đề 30 và 34 cm, nhiễu "Có, vì hai đường chéo bằng nhau"); `[phần 2] $.exercises[17].options[0]` (`khung-go-cheo`, 40 và 42 cm); nhiễu `khong` của `$.exercises[40]`, `co` của `$.exercises[53]`, `co` của `[phần 2] $.exercises[36]` - LL-14
- Sửa: nhiễu nêu lỗi thật: "Có, vì khung có bốn cạnh và bốn góc"; "Có, vì nó có hai cạnh đáy song song" (`wrong`: "Hình thang nào cũng có hai đáy song song; hình thang cân còn cần ..."); "Chưa biết, phải đo thêm các góc".
- Tình trạng sau vòng 1: đã sửa

### 6. Ba câu phần 1 hỏi lại đúng bộ ghép vật–hình của màn "Cùng làm"

- Vị trí: `$.exercises[0]` (`noi-vat-voi-hinh`), `$.exercises[3]` (`chon-chu-nhat-hoac-thoi`), `$.exercises[4]` (`dien-ten-hinh`) - LL-07
- Sửa: giữ một câu nối có hình vật; hai câu kho ôn đổi sang vật khác (khung ảnh, mắt lưới B40, mặt bàn) hoặc hình không tên để gọi tên.
- Tình trạng sau vòng 1: đã sửa

### 7. Lời giải nhận hình theo dáng hay hướng nằm, không theo tính chất (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[đã bỏ khi sửa vòng 1] $.exercises[1].explain.text` (`ten-hinh-binh-hanh`: "nghiêng sang một bên và có hai cặp cạnh giống nhau"); `$.exercises[45].explain.text` ("nằm như một viên kim cương"); `[phần 2] $.exercises[46].explain.text` và `[phần 2] $.exercises[12].explain.text`, `.wrong[0].text` ("một cạnh bên thẳng đứng") - LL-17
- Sửa: nêu tính chất: "các cạnh đối bằng nhau và song song, nhưng không có góc vuông và bốn cạnh không bằng nhau"; "Hình thoi có bốn cạnh bằng nhau."; "hai cạnh bên dài khác nhau". Dùng "bằng nhau", không "giống nhau".
- Tình trạng sau vòng 1: đã sửa

### 8. "Khung cánh diều có bốn cạnh bằng nhau" không đúng với phần lớn diều thật

- Vị trí: `$.sections[0].blocks[0]`, `$.sections[4].blocks[0].children[0].text`, `explain` của `$.exercises[0]`, `$.exercises[4]`; hình `scene.tsx` - LL-17
- Sửa: đổi vật mẫu hình thoi (mắt lưới B40, hoa văn ô trám); nếu giữ diều thì "chiếc diều này có dạng hình thoi", thanh ngang ở giữa.
- Tình trạng sau vòng 1: đã sửa

### 9. Lý do `wrong` của `cheo-thoi-tao-goc` đọc như mọi hình thoi có góc 60°

- Vị trí: `$.exercises[28].explain.wrong` - LL-17
- Sửa: "60° có thể là số đo một góc của hình thoi, không phải góc giữa hai đường chéo. Hai đường chéo luôn tạo góc vuông." (tương tự 120°).
- Tình trạng sau vòng 1: đã sửa

### 10. Bảng vẽ báo "Bạn đã làm xong mọi bước." khi chọn sai số (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `board-visual.tsx:66–87` (không truyền `finished`); walk `179-s12-06-exercise-ve-cn-abcd-wrong1.png`
- Sửa: truyền `finished` ("Bạn đã bấm đủ các bước. Hãy bấm Kiểm tra."); ở màn có `goal`, `warning` khi số khác `goal`. Thêm test.
- Tình trạng sau vòng 1: đã sửa

### 11. Bảng vẽ, hình mẫu từng bước và hình "Nhắc lại" quá nhỏ trên iPad (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `construction.ts:31` (`UNIT = 18`), `board.tsx` `DEFAULT_MAX_HEIGHT = 188`; hình `ve-*-cac-buoc`, hình quy tắc phần 12–15, mọi bảng; `visual.ve-ba-hinh` (`$.sections[9].blocks[1].children[5]`, ba hình cao khoảng 30 px); walk `167`, `168`, `178`, `186`, `204`, `218`, `274-s19-02`, `305-s19-17` - LL-12
- Sửa: hình quy tắc cắt khung theo hình thật; bảng tính khung theo số lớn nhất của đề hoặc nâng `maxHeight` trên iPad; `ve-ba-hinh` xếp một cột.
- Tình trạng sau vòng 1: làm một phần: hình quy tắc to hơn; bảng vẽ vẫn nhỏ trên iPad (muốn to hơn phải đổi bố cục `src/visuals/shared/plane/board.tsx`)

### 17. Bước "dùng thước đo góc, chọn 45°, 60° hay 75°" khi vẽ hình thoi, hình bình hành (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: bước `angle` (`construction.ts:86–92`), note đầu phần 13, 14, mục `s2` của `$.exercises[35]`, `[phần 2] $.exercises[25]`; câu app của 4.11, 4.12
- Vấn đề: SGK KNTT vẽ bằng "một đường thẳng bất kỳ qua A", không đo góc; 4.11, 4.12 không cho góc. Đo góc học ở tiểu học, nhưng vẽ góc cho trước bằng thước đo góc chưa có trên trang. Chấm 4.11 (mọi góc trong ba góc đều đúng) là hợp lý.
- Sửa: xem "Cần chủ dự án quyết", mục 2.
- Tình trạng sau vòng 1: giữ bước chọn góc theo phương án (a): quy tắc nói "tạo góc cho trước", mục thước đo góc trong note và `overview.goals`

### 18. `explain` của `ve-cn-hai-duong` nêu định lí chưa học

- Vị trí: `$.exercises[34].explain.text` - LL-09
- Sửa: "Hai đường ấy chứa hai cạnh đối của hình chữ nhật, mà các cạnh đối của hình chữ nhật song song. Vậy chúng song song với nhau."
- Tình trạng sau vòng 1: đã sửa

### 21. Câu dùng lại hình hay tên điểm của màn mẫu hoặc câu khác cùng phần (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `visual.binh-hanh-cheo-ten` ở `[phần 2] $.exercises[5]`–`[37]`; `$.exercises[40]` dùng tứ giác XYZT của `visual.kiem-cac-buoc`; `[phần 2] $.exercises[19]` dùng hình `thang-can-cheo-ten` của `[phần 2] $.exercises[15]` - LL-07
- Sửa: câu luyện và kho ôn dùng tên khác (MNPQ, GHIK, giao điểm I) hoặc hình nghiêng khác.
- Tình trạng sau vòng 1: đã sửa

### 22. Đề 4.15, 4.16 là hình tĩnh, lời giải nêu số đo bé không thấy (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.exercises[55]` (`explain` "đều dài 5 cm"), `[phần 2] $.exercises[53]` (hình không vẽ EP, FQ mà `explain` dựa vào) - LL-22
- Sửa: hình đề thành hình chạm để đo (`kind: "probe"`): 4.15 chạm bốn cạnh; 4.16 chạm hai nửa EP, FQ và bốn góc ABCD. Lời đề giữ nguyên.
- Tình trạng sau vòng 1: đã sửa

### 23. Câu dẫn trùng câu phần dạy (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `dan-4-16-cheo` (`[đã bỏ khi sửa vòng 1] $.exercises[108]`) trùng `kiem-bh-cheo-co` (`[80]`); `dan-4-19-hai-ghep` (`[116]`) trùng nguyên văn `ghep-hai-thang-can-thanh` (`[87]`); `dan-4-18-day-lon` (`[114]`) gần trùng `ghep-day-lon` (`[85]`); `dan-4-16-eke` (`[109]`) gần trùng `ba-goc-khit` (`[79]`) - LL-07
- Sửa: bỏ `dan-4-16-cheo`, `dan-4-18-day-lon`; `dan-4-19-hai-ghep` thành câu đếm ("Hai miếng ghép thành hình lục giác giữa khay. Còn mấy miếng xếp quanh?", đáp án 6); đổi tên và cách hỏi của `dan-4-16-eke`.
- Tình trạng sau vòng 1: đã sửa

### 24. Câu dẫn 4.8, 4.9 dùng đúng bộ bốn hình của Hình 4.11, 4.12 (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.exercises[45].right`, `[phần 2] $.exercises[45].right` - LL-02
- Sửa: đổi nhiễu và hướng (hình chữ nhật xoay nghiêng, hình thang cân lộn ngược).
- Tình trạng sau vòng 1: đã sửa

### 26. Câu luyện `chon-chu-nhat-trong-thoi` chép cấu hình Hình 4.9, 4.14 và đề lộ đáp án

- Vị trí: `$.exercises[42]` (`visual.thoi-trong-hinh`) - LL-08, LL-14
- Sửa: hình chữ nhật, hình bình hành, hình thoi nằm riêng; đề "Chạm vào hình có bốn góc vuông", không kể trước có những hình gì.
- Tình trạng sau vòng 1: đã sửa

### 28. Kho ôn `thoi-bon-canh-6` của thẻ "kiểm tra" chỉ ôn tính chất phần 5

- Vị trí: `[đã bỏ khi sửa vòng 1] $.exercises[78]` (`card.kiem-thoi-chu-nhat`) - LL-07
- Sửa: "Đo một tứ giác được bốn cạnh 6 cm, 6 cm, 6 cm, 7 cm. Tứ giác đó có là hình thoi không?"
- Tình trạng sau vòng 1: đã sửa

### 30. Bài 4.10–4.14, 4.18, 4.19 không có lời giải sách: Reviewer đã tự giải

- Vị trí: `$.exercises[48]`, `[97]`, `[99]`, `[102]`, `[104]`, `[115]`, `[117]`
- Nguồn: tr.115 chỉ có 4.8, 4.9, 4.15–4.17
- Vấn đề: theo checklist ghi Nên sửa. Tự giải khớp `validators` trong `logic.ts` và `explain` (4.13: tam giác 3-5-6 dựng được; 4.19: 2 nửa lục giác giữa + 6 quanh).
- Sửa: không cần đổi; chủ dự án ghi nhận.
- Tình trạng sau vòng 1: chỉ ghi nhận: sách không in lời giải, Reviewer đã tự giải

### 31. Màu teal vừa là hình chữ nhật vừa là miếng tam giác đều (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `figures.ts:29` (`"chu-nhat": "teal"`), `figures.ts:1079` (miếng tam giác của dải ghép), `board-visual.tsx:116` (`strip`, `color: "teal"`); glossary `hình chữ nhật` và `hình tam giác đều` cùng `teal` (tương tự `hình thoi`/`hình vuông` cùng `pink`, `hình bình hành`/`hình lục giác đều` cùng `lime`) - LL-05
- Vấn đề: trong bài này teal là màu hình chữ nhật ở phần 1–17, rồi phần 18 và 4.18 tô tam giác đều cũng bằng teal; bài liền trước dạy teal là tam giác đều.
- Sửa: tác giả chọn cho bốn hình của bài các màu chưa dùng cho hình của Bài 18 (sửa glossary và `figures.ts` cùng lúc), hoặc tô miếng ghép bằng màu trung tính.
- Tình trạng sau vòng 1: làm một phần: miếng tam giác đều tô xám; màu glossary của bốn hình không đổi

### 32. Câu kiểm tra phần 3 `cheo-chu-nhat-luon-co` dùng "vuông góc" trước phần 6 và nói điều chưa dạy

- Vị trí: `$.exercises[11]` (lựa chọn b, `explain.text`, `wrong[0]`) - LL-09
- Vấn đề: "vuông góc" chỉ được giải nghĩa ở phần 6; `explain` "cắt nhau ở giữa hình" là ý phần 8 dạy cho hình bình hành; nhiễu "Một đường dài gấp đôi đường kia" không ai chọn.
- Sửa: bỏ vế "cắt nhau ở giữa hình"; thay nhiễu "vuông góc" bằng "Chúng song song với nhau" và nhiễu "gấp đôi" bằng "Chúng bằng cạnh dài".
- Tình trạng sau vòng 1: đã sửa

## Góp ý

### 1. "Liền nhau", "kề", "nằm cạnh nhau" cho một ý

- Vị trí: `$.exercises[8].explain`, `$.exercises[15].explain`, quy tắc phần 14 ("hai cạnh liền nhau"); `$.sections[2].blocks[0]` ("không kề nhau"). Sửa: chọn một cách nói ("nằm cạnh nhau", như Bài 18) khi sửa Nghiêm trọng 5.
- Tình trạng sau vòng 1: đã làm

### 2. Chữ O chạm nét ở các hình đường chéo hình thoi và `hex-ten` (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `cheo-thoi-cac-buoc`, `cheo-thoi-quy-tac`, `thoi-cheo-o` (walk `085`, `086`, `090`); `visual.hex-ten` (walk `267-s18-06`). Sửa: nhích nhãn O, cùng lúc với Nghiêm trọng 6.
- Tình trạng sau vòng 1: đã làm

### 3. Mũi tên song song chạm cung góc ở hình quy tắc hình thoi

- Vị trí: `thoi-quy-tac`, `thoi-cac-buoc` (walk `073-s5-02-block.png`). Sửa: tách dấu song song và số đo góc ra hai khung, hoặc dời mũi tên.
- Tình trạng sau vòng 1: bỏ

### 6. `sourceRef` các phần vẽ chỉ trỏ SBT tr.67

- Vị trí: `$.sections[6]`–`[14].sourceRef`, `$.cards[6]`–`[14].sourceRef`. Sửa: ghi thêm "cách vẽ theo SGK KNTT 6" như Bài 18.
- Tình trạng sau vòng 1: đã làm

### 9. `thang-can-ba-canh-4` dùng đúng 4 cm của 4.18 và nói "cạnh trên, đáy dưới" khi không có hình (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[đã bỏ khi sửa vòng 1] $.exercises[89]` - LL-07. Sửa: 7 cm; dùng "đáy nhỏ", "đáy lớn".
- Tình trạng sau vòng 1: đã làm

### 12. Hình 4.16 vẽ lại cắt lục giác giữa theo đường ngang, sách cắt nghiêng (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `figures.ts:1103` (cắt `i0-i3`). Nếu muốn khớp sách thì cắt `i1-i4`.
- Tình trạng sau vòng 1: đã làm

### 13. `kiem-chac-chan-chu-nhat` thiếu `wrong` cho nhiễu "hai đường chéo vuông góc"

- Vị trí: `$.exercises[41].explain.wrong`. Thêm: "Hai đường chéo vuông góc là điều của hình thoi, các góc có thể không vuông."
- Tình trạng sau vòng 1: đã làm

### 14. Mẹo phần 16 kiểm góc vuông bằng góc tờ giấy, còn "Cùng làm" và 4.16 dùng êke

- Vị trí: `$.sections[8].blocks[2]` (`tip`), `$.sections[8].blocks[3]`. Hai dụng cụ cho một việc; Haiku cũng chấm mơ hồ "khít", "hở", "chờm ra". Sửa: mẹo nói "Không có êke thì dùng góc tờ giấy vở, cũng đặt khít như êke."
- Tình trạng sau vòng 1: đã làm

### 15. `overview.goals[2]` không kể thước đo góc mà bài dùng (cũng thuộc bài `hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.overview.goals[2]` ("bằng thước, êke và compa"). Sửa theo quyết định ở "Cần chủ dự án quyết", mục 2.
- Tình trạng sau vòng 1: đã làm

## Cần chủ dự án quyết

1. Tách bài: đã quyết (xem "Tách bài").
2. Bước chọn góc 45°, 60°, 75° bằng thước đo góc khi vẽ hình thoi (SBT 4.11): đang giữ theo phương án (a) như bài chưa tách; chấp nhận mọi góc trong ba góc cho.
3. SBT 4.10, 4.11, 4.14 sách không in lời giải; Reviewer vòng 1 đã tự giải và thấy khớp. Chủ dự án ghi nhận.
