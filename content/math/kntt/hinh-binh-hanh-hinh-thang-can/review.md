# Review: Hình bình hành. Hình thang cân (`hinh-binh-hanh-hinh-thang-can`)

- Bài: `content/math/kntt/hinh-binh-hanh-hinh-thang-can/lesson.json`
- Vòng: 1 - toàn bài của bài chưa tách `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` (3 reviewer song song + tổng hợp, commit `38c726d`, nhóm 1: phần 1–6; nhóm 2: phần 7–15; nhóm 3: phần 16–18 và phần bài tập sách bài tập; tệp nhóm ở `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/nhom-<n>.md`, ngoài git). Bài này là phần 2 của Bài 19 sau khi tách; vòng kế là vòng 2, toàn bài, Opus.
- Nguồn đã đọc: `sources/math/hinh-binh-hanh-hinh-thang-can/` - sbt-p67, sbt-p68, sbt-p69, sbt-p115 (bản sao của `sources/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`)
- Kết luận vòng 1: chưa đạt, 21 Nghiêm trọng, 32 Nên sửa, 15 Góp ý cho cả bài chưa tách; đã sửa hết Nghiêm trọng (commit `36ff39a`, `cabb254`). Sau đó chủ dự án quyết tách bài. Bài giữ `draft`, chưa ghi `reviewedHash`, chưa `content:lock`; vòng 2 chưa chạy.

## Tách bài

Bài 19 chưa tách (19 phần, 118 câu, 112 phút) quá dài cho bé chậm, nên chủ dự án tách theo hình thành hai bài của app (`part` 1 và 2, cùng `number` 19 và `chapter`; `order` 19 và 19.1):
- Phần 1, `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`, "Hình chữ nhật. Hình thoi": 9 phần dạy và phần bài tập sách bài tập, 9 thẻ, 56 câu, 55 phút; bài tập SBT: 4.8, 4.10, 4.11, 4.14, 4.15.
- Phần 2, `hinh-binh-hanh-hinh-thang-can`, "Hình bình hành. Hình thang cân": 9 phần dạy và phần bài tập sách bài tập, 9 thẻ, 60 câu, 58 phút; bài tập SBT: 4.9, 4.12, 4.13, 4.16, 4.17, 4.18, 4.19.

Mỗi bài tập SBT thuộc bài có hình của nó; bài cần hình của cả hai bài thì thuộc phần 2. Bài này (phần 2) giữ: 4.9, 4.12, 4.13, 4.16, 4.17, 4.18, 4.19. Phần bài tập sách bài tập của bài này là 7 câu sách và 8 câu dẫn.

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
- Không còn phần mở đầu "Bốn hình quanh ta"; phần `so-sanh-bon-hinh` (so sánh bốn hình, cần cả hai bài) ở lại làm phần tổng kết.
- `overview` viết lại cho hai hình (chào bạn ở câu đầu); phần bài tập sách bài tập có bốn khối "Nhắc lại" (4.9; 4.12 và 4.13; 4.16 và 4.17, nhắc cả quy tắc hình thoi, hình chữ nhật của phần 1; 4.18 và 4.19), recap là câu quy tắc kiểm tra hình bình hành, hình thang cân.
- Bài này dùng từ `song song`, `tứ giác`, `đường chéo`, `góc vuông` và hai hình của phần 1 mà không dạy lại (đã dạy ở phần 1, bài học trước theo `order`): Reviewer xét theo luật dùng thuật ngữ đã dạy (LL-09) với phần 1 là bài trước.

Tiêu chí cho điểm ngoài trang sách (như Bài 18, LL-09): được giữ khi điều đó cần để làm một bài tập trên các trang đã nạp và lần được về một dòng in (dòng "Kĩ năng giải toán" tr.67, chữ trong đề, lời giải tr.115). Các bước vẽ không in trong SBT nhưng là cách vẽ chuẩn SGK KNTT 6 được giữ nếu đúng (đã quyết với Bài 18). Không giữ: dấu hiệu "đường chéo bằng nhau thì là hình chữ nhật" (Nghiêm trọng 1), "hình thoi góc 60° có đường chéo ngắn bằng cạnh" (Nghiêm trọng 2), từ "tia" (Nghiêm trọng 7), "tâm" của hình lục giác (Nghiêm trọng 21).

Phát hiện của vòng 1 thuộc bài này ở dưới, giữ số thứ tự của báo cáo gốc (`git show 38c726d:content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/review.md`). Vị trí `$.…[n]` đã đổi sang vị trí trong `lesson.json` của bài này; vị trí thuộc bài kia ghi `[phần n] $.…` (vị trí trong bài phần n); vị trí đã bỏ khi sửa vòng 1 ghi `[đã bỏ khi sửa vòng 1]`; số phần trong lời phát hiện ("phần 12", "phần 14") là số thứ tự trong bài chưa tách (bảng trên cho biết phần đó ở bài nào); "Tình trạng" là kết quả sửa sau vòng 1, vòng 2 kiểm lại từng mục.

## Nghiêm trọng

### 1. Mẹo "Kiểm tra khung" và `whyItMatters` dạy dấu hiệu nhận biết hình chữ nhật bằng đường chéo (lớp 8) (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[phần 1] $.sections[2].blocks[2]` (`tip` kiểm khung); `$.overview.whyItMatters` - LL-09
- Nguồn: tr.67, `sbt-p67.png` (chỉ có chiều "hình chữ nhật thì hai đường chéo bằng nhau")
- Vấn đề: "Hai đường chéo bằng nhau thì khung là hình chữ nhật" là chiều đảo, lớp 8; không bài nào từ 4.8 đến 4.19 cần (4.16 kiểm bằng êke bốn góc). `whyItMatters` lặp đúng ý đó ở màn đầu bài.
- Sửa: mẹo theo chiều sách có: "Khung hình chữ nhật thì hai đường chéo bằng nhau. Đo thấy hai đường chéo khác nhau là khung bị lệch." `whyItMatters` cùng ý. Có thể đổi `kind` sang tránh sai.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 5. Đỉnh bị gọi là "góc" trong định nghĩa đường chéo, câu quy tắc vẽ và lời giải (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.overview.goals[1]`; `[phần 1] $.sections[2].blocks[0].children[0].text` ("đường nối hai góc không kề nhau"); `[phần 1] $.exercises[14].explain` và hai `wrong` (`ex.chon-duong-cheo`); câu quy tắc `$.sections[6].blocks[1].children[0]` ("để tìm góc còn lại") cùng `$.sections[6].recap.caption`, `$.cards[6].recap.caption`, `$.sections[9].blocks[1].children[4]`; `[phần 1] $.exercises[35].explain.text` (`ex.ve-thoi-quy-trinh`); `$.exercises[41].explain.text` (`ex.dem-thoi-luc-giac`: "nối O với một góc của lục giác", trong khi đề cùng câu viết "chung đỉnh O") - LL-05, LL-17
- Nguồn: tr.67; Bài 18 dạy "Đường chéo là đoạn thẳng nối hai đỉnh không nằm cạnh nhau", glossary có `đỉnh`
- Vấn đề: góc không phải một điểm; thứ tìm bằng hai cung là đỉnh. Cả bài không dùng chữ "đỉnh" lần nào trong phần dạy, nên một khái niệm có hai định nghĩa trong cùng chương và bé nhớ "góc" là một điểm, trái "góc 60°" ngay trong bài. Nhóm 1, 2, 3 cùng gặp.
- Sửa: dùng lại câu Bài 18 ở định nghĩa và `goals[1]`: "Đường chéo là đoạn thẳng nối hai đỉnh không nằm cạnh nhau." `chon-duong-cheo`: "Đường chéo nối hai đỉnh không nằm cạnh nhau: A với C, B với D." / "A và B nằm cạnh nhau, nên AB là cạnh." Quy tắc phần 15 và `ve-thoi-quy-trinh`: "để tìm đỉnh còn lại" (đổi recap, thẻ, "Nhắc lại" nguyên văn). `dem-thoi-luc-giac`: "nối O với một đỉnh của lục giác". Soát lại bằng tìm "góc còn lại", "góc không kề", "góc kề nhau", "một góc của".
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 7. Từ "tia" chưa dạy, không có trong sách và glossary (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: định nghĩa `[phần 1] $.sections[7].blocks[1].children[0]`; câu quy tắc `[phần 1] $.sections[7].blocks[1].children[1]`, `[phần 1] $.sections[7].recap.caption`, `[phần 1] $.cards[7].recap.caption`, `$.sections[9].blocks[1].children[2]`; mục `order` `[phần 1] $.exercises[35].items[1]`, `$.exercises[25].items[1]`, `$.exercises[25].items[2]`; `explain` của `[phần 1] $.exercises[35]`, `[62]`, `[63]`, `[65]`, `[67]`, `[68]`, `[96]`–`[99]`, `[103]`, `[104]`; chữ bước bảng vẽ `construction.ts:91`, `:123`, `:151`; chú thích khung `catalog-drawing.ts:110`, `:114`, `:174`, `:178`, `catalog-book.ts:165`, `:169`, `:199`, `:203`, `:270`, `:274` - LL-09
- Nguồn: tr.67–69 không có chữ "tia"; glossary chỉ có "tia số"
- Vấn đề: tia là khái niệm của chương hình học cơ bản (học sau), không phải kiến thức nền. Một câu định nghĩa không đủ để bé phân biệt tia với đoạn thẳng. Lượt Haiku 1 xếp mơ hồ khoảng 16 mục vì "tia là gì". Cùng kiểu "tâm" ở Bài 18 vòng 1.
- Sửa: bỏ khái niệm tia, dùng "đường kẻ": "Dùng thước đo góc kẻ đường AD tạo với AB một góc 75°", "Lấy D trên đường đó". Xoá câu định nghĩa tia, giữ câu "Độ mở compa là ...". Đổi đồng loạt trong `lesson.json` và ba tệp hình.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 8. Quy tắc vẽ hình thoi thiếu điều kiện compa (độ mở bằng cạnh, tâm ở hai đầu) (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[phần 1] $.sections[7].blocks[1].children[1]`, `[phần 1] $.sections[7].recap.caption`, `[phần 1] $.cards[7].recap.caption`, `$.sections[9].blocks[1].children[2]`; mục `s4` của `[phần 1] $.exercises[35]` ("Vẽ hai cung tròn từ Q và từ N, cùng độ mở.") và `explain` - LL-17
- Nguồn: bài 4.11, 4.14 tr.68
- Vấn đề: làm đúng chữ với hai cung cùng độ mở khác cạnh (cạnh 4 cm, cung 5 cm) ra hình hai cạnh 4 cm, hai cạnh 5 cm, không phải hình thoi; câu cũng không nói tâm cung. Bảng vẽ tự giữ độ mở nên trên màn không lộ, nhưng bé vẽ 4.11, 4.14 và bài kiểm tra trên giấy chỉ nhờ câu này. Các `explain` (vd `[62]`, `[96]`) đã nói đủ "cùng độ mở 2 cm từ H và từ F"; chỉ câu nhớ thiếu. Cùng kiểu Nghiêm trọng 5 vòng 1 Bài 18.
- Sửa (tách hai câu cho vừa `[rule-sentence]`, recap lặp nguyên văn): "Vẽ một cạnh, kẻ một đường từ đầu cạnh, lấy trên đó cạnh thứ hai bằng cạnh đầu. Mở compa bằng cạnh, đặt kim ở hai đầu mút còn lại vẽ hai cung." Mục `s4`: "Mở compa bằng MN, vẽ cung tâm Q và cung tâm N."
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 9. Quy tắc vẽ hình bình hành biết đường chéo thiếu điều kiện compa và điểm đi qua (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.sections[6].blocks[1].children[0]`, `$.sections[6].recap.caption`, `$.cards[6].recap.caption`, `$.sections[9].blocks[1].children[4]` - LL-17
- Nguồn: bài 4.13 tr.68
- Vấn đề: "Vẽ tam giác bằng compa" không nói tam giác nào, không nói cung tâm A bán kính AC và tâm B bán kính BC; bài chưa dạy vẽ tam giác biết ba cạnh ở chỗ nào khác. Hai đường song song không nói qua điểm nào, song song với cạnh nào. Chỉ nhớ câu này bé không vẽ được 4.13 trên giấy.
- Sửa (hai câu, recap lặp nguyên văn, rút cho vừa `[length]`): "Vẽ AB, rồi vẽ cung tâm B bán kính BC và cung tâm A bán kính AC, gặp nhau tại C. Dùng êke vẽ qua C đường song song với AB, qua A đường song song với BC, gặp nhau tại D."
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 10. Quy tắc vẽ hình chữ nhật và hình bình hành thiếu "cùng một phía", "bằng cạnh kia", "qua đầu cạnh" (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[phần 1] $.sections[6].blocks[1].children[0]`, recap phần 12, `[phần 1] $.cards[6].recap.caption`, `$.sections[9].blocks[1].children[1]`, mục `s3` của `ex.ve-cn-quy-trinh`; `$.sections[5].blocks[1].children[0]`, recap phần 14, `$.cards[5].recap.caption`, `$.sections[9].blocks[1].children[3]`, mục `s4` của `$.exercises[25]` ("vẽ qua F và qua K hai đường song song" không nói song song với gì) - LL-17
- Nguồn: cách vẽ SGK KNTT 6; bài 4.10, 4.12 tr.68
- Vấn đề: "lấy hai đoạn bằng nhau rồi nối" không nói bằng cạnh nào (ra hình chữ nhật sai kích thước của 4.10) và không nói cùng phía; "vẽ hai đường song song với hai cạnh đó" không nói đi qua đâu, hình không khép. Nhóm 2 ghi Nên sửa vì bảng vẽ làm đúng; nhóm 3 ghi Nghiêm trọng vì đây là chữ bé đọc ngay trước 4.10, 4.12 và mang ra bài làm trên giấy. Giữ mức cao hơn.
- Sửa: "Vẽ một cạnh, kẻ hai đường vuông góc ở hai đầu cạnh. Về cùng một phía, lấy hai đoạn bằng cạnh kia rồi nối." "Vẽ hai cạnh liền nhau. Dùng êke vẽ qua đầu mỗi cạnh một đường song song với cạnh kia." Mục `s4`: "Dùng êke vẽ qua F đường song song với EK, qua K đường song song với EF." Đổi recap, thẻ, "Nhắc lại" nguyên văn.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 12. Lời `wrong` dạy "hình thoi thường có các góc 60° và 120°"

- Vị trí: `$.exercises[21].explain.wrong[0].text` (`ex.so-sanh-bon-goc-vuong`) - LL-17
- Nguồn: tr.67 chỉ nói các góc đối bằng nhau
- Vấn đề: góc hình thoi có thể là số đo bất kỳ; mọi hình thoi của các phần dạy đều vẽ 60° và 120°, nên câu này củng cố điều sai, trái ngay 4.11 (bé chọn 45°, 75°).
- Sửa: "Hình thoi chỉ chắc chắn có bốn cạnh bằng nhau; góc của nó thường không phải góc vuông." Thêm ít nhất một hình thoi góc khác 60° ở phần 5.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 13. Nhãn nửa đường chéo nằm sát cạnh AB, đọc thành độ dài cạnh (phần 8 và phần 17)

- Vị trí: `visual.do-cheo-binh-hanh` (`catalog-binh-hanh-thang-can.ts:230–274`, bốn `seg` không `at`/`textAt`), `$.sections[1].blocks[2].children[1]`, walk `118-s8-03-block-shown.png`; `visual.do-kiem-binh-hanh` (`catalog-check.ts:292`), `$.sections[7].blocks[3].children[1]`, walk `249-s17-04-block-shown.png` (iPad, điện thoại) - LL-12, LL-15
- Vấn đề: "4 cm", "3 cm" của hai nửa đường chéo trên nằm ngay dưới AB, nét AB chạm hoặc cắt chữ; bé đọc "AB = 4 cm". Đây là hai màn bé "thấy" O là trung điểm. Nhóm 2 và 3 cùng gặp; cùng kiểu Nghiêm trọng 2 vòng 2 Bài 18.
- Sửa: như bản sửa `do-duong-cheo-vuong` của Bài 18: ghi dòng dưới hình "OA = OC = ... cm", "OB = OD = ... cm" (tăng `h`), hoặc `at` nhỏ gần O; sửa cả hai hình cùng lúc, chụp lại ba thiết bị.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 14. Nhãn "7 cm 7 cm" ở "Cùng làm" phần 10 nằm trên cạnh đáy AB

- Vị trí: `visual.do-cheo-thang-can` (`catalog-binh-hanh-thang-can.ts:420–452`, `at: 0.2`), `$.sections[3].blocks[2].children[1]`; walk `145-s10-03-block-shown.png` - LL-12, LL-15
- Vấn đề: hai nhãn đứng liền nhau, nét AB đi ngang qua chữ; bé đọc "AB = 7 cm".
- Sửa: dòng dưới hình "AC = 7 cm", "BD = 7 cm", hoặc `at` khoảng 0,7. Chụp lại và tự xem.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 15. Bảng vẽ cạnh 2 cm: nhãn "60°" đè cạnh, cung và tên điểm (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `visual.ve-thoi-efgh` (`[phần 1] $.exercises[37]`), `visual.ve-binh-hanh-tap-lam` (`$.sections[5].blocks[3].children[1]`), `visual.ve-binh-hanh-abcd` (`$.exercises[27]`); `construction.ts:459–467`, `:519–527` (`textDistance: 46` lớn hơn cạnh 2 cm = 36 đơn vị); walk `199-s13-07-…`, `207-s14-04-block-shown.png`, `213-s14-07-…-correct.png` - LL-12
- Vấn đề: chữ số đo góc nằm ngoài hình, trên cạnh đối diện; hình rộng khoảng 45 điểm trên iPad; câu luyện có chấm và màn "Cùng làm".
- Sửa: (a) cạnh từ 3 cm trở lên cho bảng có góc, soát lại bảng số tách nhau trong `task.md`; (b) `textDistance` theo cạnh ngắn (vd `Math.min(46, 0.6 * min(len, side) * UNIT)`). Chụp lại và tự xem.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 16. Quy tắc ghép hình phần 18 thiếu "bằng nhau" và điều kiện để ra lục giác đều (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.sections[8].blocks[1].children[0]`, `$.sections[8].recap.caption`, `$.cards[8].recap.caption`, `$.sections[9].blocks[3].children[1]`; note `$.sections[8].blocks[0].children[0]` ("Ba hình tam giác đều cạnh nhau"); đề và `explain` của `$.exercises[42]` (`ex.ghep-hai-thang-can-thanh`), `[đã bỏ khi sửa vòng 1] $.exercises[116]` (`ex.dan-4-19-hai-ghep`) - LL-17
- Nguồn: tr.69 bài 4.18 ("ba hình tam giác đều có cạnh 4 cm"), 4.19
- Vấn đề: hai hình thang cân đáy nhỏ = cạnh bên = 3 cm, đáy lớn 4 cm ghép theo đáy lớn ra hình sáu cạnh bằng nhau nhưng góc khoảng 161° và 100°, không phải lục giác đều. Cần đáy lớn gấp đôi đáy nhỏ (ghép từ ba tam giác đều bằng nhau). Ba tam giác đều khác cỡ không ghép được.
- Sửa (recap, thẻ, "Nhắc lại" nguyên văn): "Ba hình tam giác đều bằng nhau ghép thành một hình thang cân. Hai hình thang cân như thế ghép thành một hình lục giác đều." Đề `ghep-hai-thang-can-thanh`: "Hai hình thang cân, mỗi hình ghép từ ba tam giác đều bằng nhau, ghép theo đáy lớn. Chúng ghép thành hình gì?"; `explain`: "Ba tam giác đều là một nửa hình lục giác đều, nên hai hình thang cân này ghép thành hình lục giác đều." Note đầu phần: "Ba hình tam giác đều bằng nhau, đặt sát nhau, ghép được thành ...". Câu dẫn 4.19 đổi theo Nên sửa 23.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 17. "Cùng làm" thứ hai của phần 18 là khay Hình 4.16 của bài 4.19, dừng ở 2/8 miếng

- Vị trí: `$.sections[8].blocks[3].children[1]` (`visual.ghep-hai-thang-can-cung-lam`, `catalog-check.ts:340`, `which: "tray"`, `goal: 2`); walk `263-s18-04-block.png`, `264-s18-04-block-shown.png` - LL-08
- Nguồn: tr.69 Hình 4.16
- Vấn đề: chép hình sách vào màn "Cùng làm" (kiểu Nghiêm trọng 8 vòng 1 Bài 18); màn báo xong ở "2/8", bé tưởng mình làm thiếu; bài 4.19 về sau là đúng bảng này.
- Sửa: bảng ghép riêng hai miếng (lục giác đều nét đứt cắt theo một đường chéo chính, "0/2 miếng"), hướng cắt khác khay; không dùng `which: "tray"` ở phần dạy.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 19. Lời giải 4.17 nhận BEDC là hình thang cân vì "hai cạnh bên bằng nhau"

- Vị trí: `$.exercises[56].explain.text`, `.explain.wrong[0].text` (`ex.sbt-4-17`); hình `visual.sbt-4-17-giai` (`catalog-book.ts:330`) - LL-17, LL-05
- Nguồn: tr.69 bài 4.17; tr.115 chỉ ghi kết luận
- Vấn đề: không phải dấu hiệu bài dạy (phần 17: hai góc kề một đáy bằng nhau), và sai như quy tắc chung (hai cạnh đối song song, hai cạnh kia bằng nhau có thể là hình bình hành). Câu dẫn và hình gợi ý dạy kiểm góc rồi lời giải dùng cách khác; lý do OABC là hình thoi không nói vì sao các đoạn bằng nhau.
- Sửa: "OA, AB, BC, CO đều bằng cạnh của các tam giác đều chung đỉnh O, nên OABC là hình thoi; OCDE cũng vậy. BEDC có BE song song CD, góc B và góc E đều là góc của tam giác đều nên bằng 60°. Vậy BEDC là hình thang cân." `wrong[0]` theo cùng lý do; hình lời giải thêm cung 60° ở B, E.
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 20. Lời `wrong` của câu dẫn 4.17 nói hai góc kề một đáy của hình bình hành không bằng nhau

- Vị trí: `$.exercises[55].explain.wrong[1].text` và đề `$.exercises[55].prompt` (`ex.dan-4-17-thang-can`) - LL-17, LL-01
- Vấn đề: sai với hình chữ nhật (hình bình hành có bốn góc vuông); đề "Tứ giác này là hình gì?" khi tứ giác là hình chữ nhật thì "Hình bình hành" cũng đúng.
- Sửa: đề "Tứ giác này chắc chắn là hình gì?"; `wrong[1]`: "Hai góc kề một đáy của hình bình hành chỉ bằng nhau khi chúng là góc vuông; đề không nói vậy."
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

### 21. Câu dẫn 4.17 dùng "tâm O" của hình lục giác đều

- Vị trí: `$.exercises[54].prompt[0].text` (`ex.dan-4-17-thoi`); nhãn `visual.sbt-hinh-4-15` "hình có tâm O" (`catalog-book.ts:74`) - LL-09
- Nguồn: tr.69 Hình 4.15 chỉ ghi điểm O; Bài 18 đã bỏ "tâm" của lục giác ở vòng 1
- Vấn đề: "tâm" ở bài này chỉ là chỗ đặt kim compa (phần 15); "tâm của hình lục giác" chưa dạy. Câu dẫn không có hình.
- Sửa: "Hình lục giác đều UVWXYZ cạnh 5 cm được chia thành sáu tam giác đều có chung đỉnh O, nên OU, OV, OW cũng dài 5 cm." kèm hình có tên U…Z; nhãn hình: "Hình 4.15: các điểm A, B, C, D, E và O".
- Tình trạng sau vòng 1: đã sửa (cả 21 Nghiêm trọng, commit `36ff39a` hình và `cabb254` nội dung)

## Nên sửa

### 2. Câu kiểm tra lặp số của hình quy tắc, màn mẫu hay "Cùng làm" (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[đã bỏ khi sửa vòng 1] $.exercises[21]` (`thoi-goc-c`: góc A = 60° như hình quy tắc và recap); `ex.binh-hanh-canh-cd`, `ex.binh-hanh-goc-c` (số của `do-binh-hanh`); `ex.ve-thoi-abcd` (6 cm, 45° như `ve-thoi-tap-lam`); `ex.ve-bh-canh-dc` (số của `ve-binh-hanh-cac-buoc`) - LL-07
- Sửa: đổi số (vd thoi góc B 110° hỏi góc D; bình hành 7 và 5 cm, góc A 110°; kho ôn thoi 5 cm 75°; DC: AB = 6, AD = 4); soát lại bảng số trong `task.md`.
- Tình trạng sau vòng 1: đã sửa

### 5. Nhiễu Có/Không trái ngay dữ kiện đề (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[phần 1] $.exercises[12].options` (`khung-anh-cheo`: đề 30 và 34 cm, nhiễu "Có, vì hai đường chéo bằng nhau"); `$.exercises[17].options[0]` (`khung-go-cheo`, 40 và 42 cm); nhiễu `khong` của `[phần 1] $.exercises[40]`, `co` của `[phần 1] $.exercises[53]`, `co` của `$.exercises[36]` - LL-14
- Sửa: nhiễu nêu lỗi thật: "Có, vì khung có bốn cạnh và bốn góc"; "Có, vì nó có hai cạnh đáy song song" (`wrong`: "Hình thang nào cũng có hai đáy song song; hình thang cân còn cần ..."); "Chưa biết, phải đo thêm các góc".
- Tình trạng sau vòng 1: đã sửa

### 7. Lời giải nhận hình theo dáng hay hướng nằm, không theo tính chất (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[đã bỏ khi sửa vòng 1] $.exercises[1].explain.text` (`ten-hinh-binh-hanh`: "nghiêng sang một bên và có hai cặp cạnh giống nhau"); `[phần 1] $.exercises[45].explain.text` ("nằm như một viên kim cương"); `$.exercises[46].explain.text` và `$.exercises[12].explain.text`, `.wrong[0].text` ("một cạnh bên thẳng đứng") - LL-17
- Sửa: nêu tính chất: "các cạnh đối bằng nhau và song song, nhưng không có góc vuông và bốn cạnh không bằng nhau"; "Hình thoi có bốn cạnh bằng nhau."; "hai cạnh bên dài khác nhau". Dùng "bằng nhau", không "giống nhau".
- Tình trạng sau vòng 1: đã sửa

### 10. Bảng vẽ báo "Bạn đã làm xong mọi bước." khi chọn sai số (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `board-visual.tsx:66–87` (không truyền `finished`); walk `179-s12-06-exercise-ve-cn-abcd-wrong1.png`
- Sửa: truyền `finished` ("Bạn đã bấm đủ các bước. Hãy bấm Kiểm tra."); ở màn có `goal`, `warning` khi số khác `goal`. Thêm test.
- Tình trạng sau vòng 1: đã sửa

### 11. Bảng vẽ, hình mẫu từng bước và hình "Nhắc lại" quá nhỏ trên iPad (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `construction.ts:31` (`UNIT = 18`), `board.tsx` `DEFAULT_MAX_HEIGHT = 188`; hình `ve-*-cac-buoc`, hình quy tắc phần 12–15, mọi bảng; `visual.ve-ba-hinh` (`$.sections[9].blocks[1].children[5]`, ba hình cao khoảng 30 px); walk `167`, `168`, `178`, `186`, `204`, `218`, `274-s19-02`, `305-s19-17` - LL-12
- Sửa: hình quy tắc cắt khung theo hình thật; bảng tính khung theo số lớn nhất của đề hoặc nâng `maxHeight` trên iPad; `ve-ba-hinh` xếp một cột.
- Tình trạng sau vòng 1: làm một phần: hình quy tắc to hơn; bảng vẽ vẫn nhỏ trên iPad (muốn to hơn phải đổi bố cục `src/visuals/shared/plane/board.tsx`)

### 12. Hai nhãn "120°" đứng liền nhau giữa hình ở "Cùng làm" phần 7

- Vị trí: `visual.do-binh-hanh` (`catalog-binh-hanh-thang-can.ts:113–141`); walk `105-s7-03-block-shown.png` - LL-12
- Sửa: `textDistance` nhỏ hơn cho góc tù hoặc đặt nhãn sát đỉnh (như bản sửa hình thoi ở commit `b85bac6`).
- Tình trạng sau vòng 1: đã sửa

### 13. "Góc kề một đáy" chưa được giải nghĩa

- Vị trí: `$.sections[2].blocks[1].children[0]` - LL-10
- Sửa: thêm "Hai góc ở hai đầu một đáy gọi là hai góc kề đáy đó."
- Tình trạng sau vòng 1: đã sửa

### 14. "Cắt nhau ở giữa", "O ở giữa" bên cạnh câu quy tắc "cắt nhau tại trung điểm"

- Vị trí: `$.sections[7].blocks[0].children[0].text`; chú thích "Hình bình hành: cắt nhau ở giữa" (`catalog-binh-hanh-thang-can.ts:61–64`, hình `so-sanh-cheo`, recap phần 11); `$.exercises[20].explain.wrong[1].text`; `$.exercises[35].explain.wrong[0].text`, `[đã bỏ khi sửa vòng 1] $.exercises[108].explain.wrong[0].text` ("O ở giữa mỗi đường chéo") - LL-05
- Sửa: dùng một cách nói: "cắt nhau tại trung điểm của mỗi đường", "O là trung điểm của mỗi đường chéo".
- Tình trạng sau vòng 1: đã sửa

### 15. Kho ôn `ve-bh-cheo-efgh` (EF = FG = 4, EG = 6) ra hình thoi

- Vị trí: `$.exercises[33]`
- Sửa: EF = 3, FG = 4, EG = 6 (soát bất đẳng thức tam giác, khác số đã dùng).
- Tình trạng sau vòng 1: đã sửa

### 16. Hình mẫu phần 15 không nêu số đề, không nói vì sao mở compa 3 cm

- Vị trí: `$.sections[6].blocks[0].children[1]`; chú thích khung `catalog-drawing.ts` - LL-16
- Sửa: "… ABCD có AB = 4 cm, BC = 3 cm và AC = 6 cm."; "Mở compa bằng BC = 3 cm, đặt kim ở B vẽ cung".
- Tình trạng sau vòng 1: đã sửa

### 17. Bước "dùng thước đo góc, chọn 45°, 60° hay 75°" khi vẽ hình thoi, hình bình hành (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: bước `angle` (`construction.ts:86–92`), note đầu phần 13, 14, mục `s2` của `[phần 1] $.exercises[35]`, `$.exercises[25]`; câu app của 4.11, 4.12
- Vấn đề: SGK KNTT vẽ bằng "một đường thẳng bất kỳ qua A", không đo góc; 4.11, 4.12 không cho góc. Đo góc học ở tiểu học, nhưng vẽ góc cho trước bằng thước đo góc chưa có trên trang. Chấm 4.11 (mọi góc trong ba góc đều đúng) là hợp lý.
- Sửa: xem "Cần chủ dự án quyết", mục 2.
- Tình trạng sau vòng 1: giữ bước chọn góc theo phương án (a): quy tắc nói "tạo góc cho trước", mục thước đo góc trong note và `overview.goals`

### 19. Câu kho ôn phần 11 dùng chữ "dấu hiệu" trước phần 16

- Vị trí: `$.exercises[23].explain.text`, `$.exercises[24].explain.text` - LL-09
- Sửa: "Trong bốn hình, chỉ hình thoi luôn có bốn cạnh bằng nhau và hai đường chéo vuông góc." (tương tự hình chữ nhật).
- Tình trạng sau vòng 1: đã sửa

### 20. Phần 11 `so-sanh-bon-hinh` lặp lại phần 3, 6, 8, 10

- Vị trí: `$.sections[4]`. Đề xuất ở mục "Độ dài".
- Tình trạng sau vòng 1: đã sửa

### 21. Câu dùng lại hình hay tên điểm của màn mẫu hoặc câu khác cùng phần (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `visual.binh-hanh-cheo-ten` ở `$.exercises[5]`–`[37]`; `[phần 1] $.exercises[40]` dùng tứ giác XYZT của `visual.kiem-cac-buoc`; `$.exercises[19]` dùng hình `thang-can-cheo-ten` của `$.exercises[15]` - LL-07
- Sửa: câu luyện và kho ôn dùng tên khác (MNPQ, GHIK, giao điểm I) hoặc hình nghiêng khác.
- Tình trạng sau vòng 1: đã sửa

### 22. Đề 4.15, 4.16 là hình tĩnh, lời giải nêu số đo bé không thấy (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[phần 1] $.exercises[55]` (`explain` "đều dài 5 cm"), `$.exercises[53]` (hình không vẽ EP, FQ mà `explain` dựa vào) - LL-22
- Sửa: hình đề thành hình chạm để đo (`kind: "probe"`): 4.15 chạm bốn cạnh; 4.16 chạm hai nửa EP, FQ và bốn góc ABCD. Lời đề giữ nguyên.
- Tình trạng sau vòng 1: đã sửa

### 23. Câu dẫn trùng câu phần dạy (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `dan-4-16-cheo` (`[đã bỏ khi sửa vòng 1] $.exercises[108]`) trùng `kiem-bh-cheo-co` (`[80]`); `dan-4-19-hai-ghep` (`[116]`) trùng nguyên văn `ghep-hai-thang-can-thanh` (`[87]`); `dan-4-18-day-lon` (`[114]`) gần trùng `ghep-day-lon` (`[85]`); `dan-4-16-eke` (`[109]`) gần trùng `ba-goc-khit` (`[79]`) - LL-07
- Sửa: bỏ `dan-4-16-cheo`, `dan-4-18-day-lon`; `dan-4-19-hai-ghep` thành câu đếm ("Hai miếng ghép thành hình lục giác giữa khay. Còn mấy miếng xếp quanh?", đáp án 6); đổi tên và cách hỏi của `dan-4-16-eke`.
- Tình trạng sau vòng 1: đã sửa

### 24. Câu dẫn 4.8, 4.9 dùng đúng bộ bốn hình của Hình 4.11, 4.12 (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[phần 1] $.exercises[45].right`, `$.exercises[45].right` - LL-02
- Sửa: đổi nhiễu và hướng (hình chữ nhật xoay nghiêng, hình thang cân lộn ngược).
- Tình trạng sau vòng 1: đã sửa

### 25. "Hình thang" định nghĩa muộn và sai ("hình có hai cạnh song song")

- Vị trí: `$.sections[7].blocks[1].children[0].text`; `$.exercises[39].explain.wrong[2].text`; phần 9 (`$.sections[2]`) dạy hình thang cân mà chưa nói hình thang là gì - LL-17, LL-05
- Sửa: định nghĩa một lần ở note đầu phần 9: "Hình thang là tứ giác có hai cạnh đối song song." (phần 9 cần thêm "tứ giác là hình có bốn cạnh", hiện chỉ có ở phần 16); phần 17 nhắc đúng câu đó; `wrong[2]`: "Tứ giác có một cặp cạnh song song là hình thang, chưa chắc là hình bình hành."
- Tình trạng sau vòng 1: đã sửa

### 27. Kho ôn `luc-giac-gom-thang-can` có đáp án trong đề

- Vị trí: `$.exercises[43]` - LL-14
- Sửa: "Cắt một hình lục giác đều theo một đường chéo chính. Mỗi phần là hình gì?"
- Tình trạng sau vòng 1: đã sửa

### 29. Lời giải 4.12 nhảy từ FH = 4 sang EK = 4 không nói lý do

- Vị trí: `$.exercises[48].explain.text` (`ex.sbt-4-12`)
- Sửa: "FH và EK là hai cạnh đối nên bằng nhau: lấy EK = 4 cm."
- Tình trạng sau vòng 1: đã sửa

### 31. Màu teal vừa là hình chữ nhật vừa là miếng tam giác đều (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `figures.ts:29` (`"chu-nhat": "teal"`), `figures.ts:1079` (miếng tam giác của dải ghép), `board-visual.tsx:116` (`strip`, `color: "teal"`); glossary `hình chữ nhật` và `hình tam giác đều` cùng `teal` (tương tự `hình thoi`/`hình vuông` cùng `pink`, `hình bình hành`/`hình lục giác đều` cùng `lime`) - LL-05
- Vấn đề: trong bài này teal là màu hình chữ nhật ở phần 1–17, rồi phần 18 và 4.18 tô tam giác đều cũng bằng teal; bài liền trước dạy teal là tam giác đều.
- Sửa: tác giả chọn cho bốn hình của bài các màu chưa dùng cho hình của Bài 18 (sửa glossary và `figures.ts` cùng lúc), hoặc tô miếng ghép bằng màu trung tính.
- Tình trạng sau vòng 1: làm một phần: miếng tam giác đều tô xám; màu glossary của bốn hình không đổi

## Góp ý

### 2. Chữ O chạm nét ở các hình đường chéo hình thoi và `hex-ten` (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `cheo-thoi-cac-buoc`, `cheo-thoi-quy-tac`, `thoi-cheo-o` (walk `085`, `086`, `090`); `visual.hex-ten` (walk `267-s18-06`). Sửa: nhích nhãn O, cùng lúc với Nghiêm trọng 6.
- Tình trạng sau vòng 1: đã làm

### 4. "Cắt nhau nghiêng" mơ hồ

- Vị trí: `$.exercises[20].explain.wrong[0].text`, `explain.text` ("không luôn như vậy"). Sửa: "cắt nhau không thành góc vuông"; "thì không chắc chắn như vậy".
- Tình trạng sau vòng 1: đã làm

### 5. `ve-bh-cheo-hinh-gi` không loại ba điểm thẳng hàng và dùng chiều ngược

- Vị trí: `$.exercises[34]`. Sửa: "Ba điểm A, B, C không thẳng hàng"; `explain` dựa vào chính cách vẽ phần 14.
- Tình trạng sau vòng 1: đã làm

### 7. Câu đề thiếu chủ ngữ

- Vị trí: `$.exercises[16].prompt[0]`, `$.exercises[19].prompt[0]`. Sửa: "Cho hình thang cân ABCD."
- Tình trạng sau vòng 1: đã làm

### 8. 4.14: EFPQ cũng có bốn cạnh bằng nhau

- Vị trí: `$.exercises[53].explain`. Có thể thêm "EFPQ còn có bốn cạnh bằng nhau; hình thoi cũng là hình bình hành."
- Tình trạng sau vòng 1: bỏ

### 9. `thang-can-ba-canh-4` dùng đúng 4 cm của 4.18 và nói "cạnh trên, đáy dưới" khi không có hình (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `[đã bỏ khi sửa vòng 1] $.exercises[89]` - LL-07. Sửa: 7 cm; dùng "đáy nhỏ", "đáy lớn".
- Tình trạng sau vòng 1: đã làm

### 10. `dem-thoi-luc-giac` dùng đúng tên OABC của 4.17

- Vị trí: `$.exercises[41]`. Sửa: đổi tên (OMNP).
- Tình trạng sau vòng 1: đã làm

### 11. "Cùng làm" ghép ba tam giác làm đúng việc của 4.18

- Vị trí: `$.sections[8].blocks[2]`, `$.exercises[57]`. Có thể đổi nhãn, cỡ tam giác ở "Cùng làm".
- Tình trạng sau vòng 1: bỏ

### 12. Hình 4.16 vẽ lại cắt lục giác giữa theo đường ngang, sách cắt nghiêng (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `figures.ts:1103` (cắt `i0-i3`). Nếu muốn khớp sách thì cắt `i1-i4`.
- Tình trạng sau vòng 1: đã làm

### 15. `overview.goals[2]` không kể thước đo góc mà bài dùng (cũng thuộc bài `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Vị trí: `$.overview.goals[2]` ("bằng thước, êke và compa"). Sửa theo quyết định ở "Cần chủ dự án quyết", mục 2.
- Tình trạng sau vòng 1: đã làm

## Cần chủ dự án quyết

1. Tách bài: đã quyết (xem "Tách bài").
2. Bước chọn góc 45°, 60°, 75° bằng thước đo góc khi vẽ hình bình hành (SBT 4.12): đang giữ theo phương án (a) như bài chưa tách; chấp nhận mọi góc trong ba góc cho.
3. SBT 4.12, 4.13, 4.18, 4.19 sách không in lời giải; Reviewer vòng 1 đã tự giải và thấy khớp. Chủ dự án ghi nhận.
