# Review: Hình chữ nhật. Hình thoi (`hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can`)

- Bài: `content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/lesson.json` (Bài 19, phần 1)
- Vòng: 2 - toàn bài, 4 reviewer song song + tổng hợp (nhóm 1: section 1–3 `hinh-quanh-ta`, `hinh-chu-nhat`, `cheo-hinh-chu-nhat` và `overview`; nhóm 2: section 4–6 `song-song`, `hinh-thoi`, `cheo-hinh-thoi`; nhóm 3: section 7–9 `ve-hinh-chu-nhat`, `ve-hinh-thoi`, `kiem-thoi-chu-nhat`; nhóm 4: bài tập sách bài tập `bai-tap-sach-bai-tap`; tệp nhóm `.shots/review/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/nhom-<n>.md`, ngoài git)
- Nguồn đã đọc: `sources/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/` - sbt-p67, sbt-p68, sbt-p69, sbt-p115
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi sửa)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ba thiết bị, ảnh trong `.shots/walk/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng (đã chạy `pnpm content:hash hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can --root content --mark`; bài giữ `draft`)
- Bản đã review: `da9d9eca2faf1cb8467139c4b8771ece6fb6a7e5b337789df73dad36104abef6` (`pnpm content:diff` so với bản này)

## Tách bài

Bài 19 của sách (19 phần, 118 câu, 112 phút) quá dài cho bé chậm, nên chủ dự án tách theo hình thành hai bài của app, cùng `number` 19 và `chapter`, `part` 1 và 2, `order` 19 và 19.1 (luật chung: `.claude/rules/content.md`, "Splitting a long lesson"):
- Phần 1 (bài này), "Hình chữ nhật. Hình thoi": 9 phần dạy và phần bài tập sách bài tập; bài tập SBT 4.8, 4.10, 4.11, 4.14, 4.15.
- Phần 2, `hinh-binh-hanh-hinh-thang-can`, "Hình bình hành. Hình thang cân": bài tập SBT 4.9, 4.12, 4.13, 4.16, 4.17, 4.18, 4.19 (4.16 và 4.17 cần hình của cả hai bài nên thuộc phần sau).

| Phần cũ | Id | Bài mới |
|---|---|---|
| 1 | `hinh-quanh-ta` | viết lại thành "Hai hình quanh ta" ở phần 1 |
| 2–6 | `hinh-chu-nhat`, `cheo-hinh-chu-nhat`, `song-song`, `hinh-thoi`, `cheo-hinh-thoi` | phần 1 |
| 7–11 | `hinh-binh-hanh`, `cheo-hinh-binh-hanh`, `hinh-thang-can`, `cheo-hinh-thang-can`, `so-sanh-bon-hinh` | phần 2 |
| 12–13 | `ve-hinh-chu-nhat`, `ve-hinh-thoi` | phần 1 |
| 14–15 | `ve-hinh-binh-hanh`, `ve-binh-hanh-cheo` | phần 2 |
| 16 | `kiem-thoi-chu-nhat` | phần 1 |
| 17–18 | `kiem-binh-hanh`, `ghep-hinh` | phần 2 |
| 19 | `bai-tap-sach-bai-tap` | chia theo bài tập SBT như trên |

Tiêu chí cho điểm ngoài trang sách (như Bài 18, LL-09): giữ khi điều đó cần để làm một bài tập trên các trang đã nạp và lần được về một dòng in (dòng "Kĩ năng giải toán" tr.67, chữ trong đề, lời giải tr.115); các bước vẽ không in trong SBT nhưng là cách vẽ chuẩn SGK KNTT 6 được giữ nếu đúng. Không giữ: dấu hiệu "hai đường chéo bằng nhau thì là hình chữ nhật" (lớp 8), "hình thoi góc 60° có đường chéo ngắn bằng cạnh" (lớp 7), từ "tia", "tâm" của hình. Bước chọn góc 45°, 60°, 75° bằng thước đo góc khi vẽ hình thoi (4.11) giữ theo quyết định của chủ dự án; 4.11 chấp nhận mọi góc trong ba góc.

## Kiểm lại vòng 1

Phát hiện vòng 1 (bài chưa tách, `git show 38c726d:content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/review.md`) thuộc bài này được bốn nhóm kiểm lại từng mục.
- Đúng: Nghiêm trọng 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 15, 18 (mục 9, 16 đã rời sang phần 2); Nên sửa 1 (có tác dụng phụ, xem dưới), 2, 3, 4, 5, 6, 7, 9, 10, 18, 21, 22, 24, 26, 28, 32; Góp ý 1, 2, 6, 14, 15.
- Giữ theo quyết định hay chỉ ghi nhận: Nên sửa 17 (bước chọn góc), 30 (bài vẽ không có lời giải sách, xem Nên sửa 21); Góp ý 3 (đã "bỏ").
- Chưa đúng, thành phát hiện vòng 2: Nên sửa 8 "khung cánh diều" (Nên sửa 1); Nên sửa 11 bảng vẽ nhỏ (Nên sửa 10); bản sửa Nên sửa 1 lại cho câu luyện hỏi đúng chữ trên hình quy tắc (Nên sửa 4, LL-20); khi tách, `sourceRef` phần kiểm tra còn 4.16 (Nên sửa 7); Góp ý 13 `wrong` mới đọc thành dấu hiệu ngược (Nên sửa 12); kiểu Nên sửa 23 gặp lại ở câu dẫn 4.15 (Nên sửa 17); khi tách, nhiễu mới (hình năm cạnh đều) làm `explain` cũ sai (Nghiêm trọng 1).

## Nghiêm trọng

### 1. `explain` của `chon-hinh-thoi` nói "Ba hình còn lại không có bốn cạnh bằng nhau", trong khi một nhiễu là hình năm cạnh đều

- Vị trí: `$.exercises[22].explain.text` (`ex.chon-hinh-thoi`); hình nhiễu `th-ngu-giac` (`src/visuals/shared/quadrilaterals/figures.ts`, `pentagonFigure`, `regularPoints(5, …)`); walk `078-s5-06` - LL-17, LL-20
- Nguồn: tr.67, `sbt-p67.png` (hình thoi: bốn cạnh bằng nhau)
- Vấn đề: nhiễu hình năm cạnh thay hình bình hành khi tách bài; hình vẽ là ngũ giác đều, bé thấy các cạnh bằng nhau, nên câu giải thích sai với điều mắt thấy. Lý do thật là hình đó có năm cạnh. Bé dễ nhớ "có bốn cạnh bằng nhau là đủ", bỏ điều kiện hình có bốn cạnh. `wrong` cũng không có lý do cho `d`.
- Sửa: `explain`: "Hình thoi có bốn cạnh, và bốn cạnh đều bằng nhau." Thêm `wrong` cho `d`: "Hình này có năm cạnh, nên không phải hình thoi." Không gọi lựa chọn theo vị trí (LL-26), không dùng chữ "tứ giác" (section 9 mới dạy).

## Nên sửa

### 1. Vật mẫu "khung cánh diều" / "chiếc diều": câu nối không có hình mà lời giải nói "trong hình"; section `hinh-thoi` nói "chiếc diều trong hình" khi hình không có diều

- Vị trí: `$.exercises[0]` (`ex.noi-vat-voi-hinh`): `left[1].content` ("Khung cánh diều"), `explain.text`; `$.sections[0].blocks[0].children[0].text` ("Nhìn quanh nhà, bạn thấy cánh cửa và khung cánh diều."); `$.sections[4].blocks[0].children[0].text` với hình `thoi-cac-buoc` (`catalog-chu-nhat-thoi.ts`); walk `009-s1-04`, `013-s1-04-…-correct`, `069-s5-01` - LL-15, LL-16, LL-17
- Nguồn: —
- Vấn đề: câu nối chỉ có chữ, hai cặp (nối một cặp là cặp kia tự đúng) và trùng đúng màn "Cùng làm"; làm đúng ngay thì màn không có hình nhưng `explain` viết "Chiếc diều trong hình". Chữ dạy "khung cánh diều là hình thoi" như điều đúng với mọi diều (đa số diều thật có hai cặp cạnh khác nhau). Ở section `hinh-thoi`, hình chạy từng bước chỉ có hình thoi ABCD, nên section không còn ví dụ đời sống thật trên màn. Diều lại thường thấy ngoài trời, không "quanh nhà".
- Sửa: chọn một vật mẫu hình thoi cho cả bài, ví dụ mắt lưới B40 (đã dùng ở kho ôn). Câu nối: cột trái dùng hình vật (`content` kiểu `visual`, như `hai-vat-doi-song`), `explain` "Cánh cửa có bốn góc vuông nên là hình chữ nhật. Mắt lưới này có bốn cạnh bằng nhau nên là hình thoi."; hoặc giữ chữ và thêm hai cặp vật khác "Cùng làm". Note `$.sections[0].blocks[0]`: "Quanh mình, bạn thấy cánh cửa và mắt lưới hàng rào. Mỗi vật có một hình riêng." Note `$.sections[4].blocks[0]`: cho khung đầu `thoi-cac-buoc` vẽ vật đó, hoặc bỏ "trong hình": "Mắt lưới hàng rào B40 có dạng hình thoi. Xem hình chạy từng bước …".

### 2. Câu quy tắc và recap của `hinh-quanh-ta` không nêu điều gì để nhớ

- Vị trí: `$.sections[0].blocks[1].children[0]` (`rule: true`), `$.sections[0].recap.caption`, `$.cards[0].recap.caption` (`card.hinh-quanh-ta`) - LL-06
- Nguồn: tr.67, `sbt-p67.png`
- Vấn đề: "Bài này có hai hình: hình chữ nhật và hình thoi." là câu giới thiệu bài. Ở thẻ ôn (xem ngoài bài) "Bài này" không chỉ tới đâu, và câu không giúp nhận ra hình nào là hình nào.
- Sửa: câu quy tắc nêu cách nhận ra bằng vật quen, lặp nguyên văn ở recap và thẻ, cùng vật mẫu chọn ở Nên sửa 1, ví dụ "Cánh cửa có dạng hình chữ nhật. Mắt lưới B40 có dạng hình thoi."

### 3. Hai nhiễu của `ten-hinh-thoi` không ai chọn

- Vị trí: `$.exercises[1].options` (`tg`, `luc`) (`ex.ten-hinh-thoi`); walk `014-s1-05` - LL-14
- Nguồn: —
- Vấn đề: hình đề có bốn cạnh rõ, nên tên hình ba cạnh, sáu cạnh loại được ngay. Nhầm thật hay gặp là gọi hình thoi là hình vuông (Bài 18 vừa dạy hình vuông bốn cạnh bằng nhau).
- Sửa: thay `luc` bằng "Hình vuông", `wrong`: "Hình vuông có bốn góc vuông, còn các góc của hình này không vuông." (hình đề có góc 60° nên không thành đáp án thứ hai; lựa chọn là chữ, không tô màu khái niệm). Có thể bỏ `tg`.

### 4. Câu kiểm tra và câu luyện của `song-song` hỏi lại đúng hình và chữ của màn quy tắc

- Vị trí: `$.exercises[15]` (`ex.cap-canh-song-song`, hình `chu-nhat-song-song`), `$.exercises[17]` (`ex.canh-song-song-ab`); so với hình `song-song-quy-tac` ở `$.sections[3].blocks[1]` (ghi "AB song song với CD", cũng là hình recap); walk `058-s4-02`, `061-s4-04`, `065-s4-06` - LL-07, LL-20
- Nguồn: —
- Vấn đề: bản sửa Nên sửa 1 vòng 1 đặt hình chữ nhật ABCD có dòng "AB song song với CD" ở màn quy tắc; câu kiểm tra hỏi bốn cặp của đúng hình ABCD cùng hướng, câu luyện hỏi "Cạnh nào song song với cạnh AB?" mà đáp án là dòng chữ trên hình quy tắc và là một phần câu kiểm tra ngay trước.
- Sửa: câu luyện dùng hình chữ nhật khác tên, nằm nghiêng (vd EFGH), hỏi "Cạnh nào song song với cạnh FG?"; câu kiểm tra đổi tên (MNPQ) hoặc hình quy tắc ghi một cặp khác.

### 5. Section `cheo-hinh-thoi` không có ví dụ đời sống

- Vị trí: `$.sections[5].blocks` - LL-16
- Nguồn: —
- Vấn đề: ba màn đều là hình thoi ABCD trừu tượng; section Toán phải có ví dụ đời sống (`docs/learner.md`, luật "Người học chậm theo kịp").
- Sửa: thêm vào note mở đầu một vật quen, cùng vật mẫu ở Nên sửa 1, ví dụ "Ở mắt lưới B40, hai sợi nối các góc đối nhau cắt nhau thành góc vuông. Hai đường chéo của hình thoi cũng vậy." (không nói diều là hình thoi).

### 6. Kho ôn `song-song-chon-cau-dung` có đáp án đúng "Luôn cách nhau một khoảng như nhau" mà quy tắc, recap của thẻ không nói

- Vị trí: `$.exercises[18].options[1]` (`ex.song-song-chon-cau-dung`, thẻ `card.song-song`); `$.cards[3].recap.caption` - LL-06, LL-09
- Nguồn: tr.67 (không có ý cách đều)
- Vấn đề: ý "cách nhau một khoảng như nhau" chỉ ở note thanh ray `$.sections[3].blocks[0]`; bé ôn sau nhiều ngày chỉ có recap, chọn mỗi "Không bao giờ cắt nhau" thì bị chấm sai.
- Sửa: đổi lựa chọn đúng thứ hai thành ý có trong recap, vd "Hai cạnh song song nằm trên hai đường không bao giờ cắt nhau."; hoặc thêm ý cách đều vào câu quy tắc và lặp nguyên văn ở recap, thẻ.

### 7. `sourceRef` của phần kiểm tra và thẻ của nó còn nêu bài 4.16 của phần 2

- Vị trí: `$.sections[8].sourceRef`, `$.cards[8].sourceRef` (`section.kiem-thoi-chu-nhat`, `card.kiem-thoi-chu-nhat`) (nhóm 3 và nhóm 4 cùng nêu)
- Nguồn: tr.69, `sbt-p69.png` (4.16 hỏi hình bình hành và hình chữ nhật, thuộc `hinh-binh-hanh-hinh-thang-can`)
- Vấn đề: sót khi tách; thẻ ôn trỏ tới bài tập không có ở bài này.
- Sửa: "Sách bài tập tr.67–69 (ví dụ 1, bài 4.15)" ở cả hai chỗ.

### 8. Hình mẫu và lời giải nói "lấy C và D cách AB đúng 3 cm", khác câu quy tắc "lấy hai đoạn bằng cạnh kia"

- Vị trí: hình `ve-chu-nhat-cac-buoc` khung 3 (`catalog-drawing.ts`, "Lấy C và D cách AB đúng 3 cm"); `$.exercises[32].explain.text` (`ex.ve-cn-abcd`), `$.exercises[33].explain.text` (`ex.ve-cn-efgh`) - LL-05
- Nguồn: —
- Vấn đề: khoảng cách từ điểm tới đường thẳng chưa dạy; câu quy tắc, mục `s3` của `ve-cn-quy-trinh` và bảng vẽ nói theo độ dài đoạn. Một bước, hai cách nói, ngay ở hình mẫu bé xem trước câu quy tắc.
- Sửa: khung 3 "Lấy BC = AD = 3 cm trên hai đường vuông góc, cùng một phía"; `ve-cn-abcd` "…, lấy D và C sao cho AD = BC = 2 cm rồi nối D với C."; `ve-cn-efgh` tương tự với 3 cm.

### 9. Cung compa cắt ngang tên đỉnh thứ tư trên bảng vẽ hình thoi

- Vị trí: bảng `visual.ve-thoi-efgh` (`$.exercises[37]`), `ve-thoi-tap-lam` (`$.sections[7].blocks[3]`), `visual.ve-thoi-mnpq`, `visual.ve-thoi-xyzt` (section bài tập sách bài tập); bước `arcQ` trong `src/visuals/shared/quadrilaterals/construction.ts`; walk `ipad/122-s8-04`, `131-s8-07-…-correct`, `163`, `165`, `167`, `169` (nhóm 3 và nhóm 4 cùng nêu) - LL-12
- Nguồn: —
- Vấn đề: cung quanh đỉnh thứ tư đi qua chỗ đặt tên đỉnh, nét xuyên chữ "H" ("Q", "T"); hình đã nhỏ (Nên sửa 10) mà lời giải nhắc tên đỉnh đó ("đặt kim ở H").
- Sửa: đặt tên đỉnh thứ tư ra ngoài dọc đường kẻ (xa cung khoảng 1,5 lần chiều cao chữ) hoặc rút ngắn `ARC_HALF_SPAN` ở đỉnh đó; chụp lại, tự xem ở cạnh 3, 4, 5, 6 cm.

### 10. Bảng vẽ và hình mẫu từng bước vẫn quá nhỏ trên iPad (Nên sửa 11 vòng 1 còn lại)

- Vị trí: `ve-chu-nhat-tap-lam`, `ve-chu-nhat-abcd`, `ve-chu-nhat-efgh`, `ve-thoi-tap-lam`, `ve-thoi-efgh`, `ve-thoi-abcd`, bảng 4.10, 4.11, 4.14, hình `ve-chu-nhat-cac-buoc`, `ve-thoi-cac-buoc`; `construction.ts` `UNIT = 18`; walk `ipad/099`, `110`–`114`, `118`, `127`–`131`, `161`, `165`, `169` - LL-12
- Nguồn: —
- Vấn đề: trên iPad dọc, hình chữ nhật 5 × 2 cm rộng khoảng 75 điểm trong khung khoảng 650 điểm; tên đỉnh và số thước khoảng 10 điểm (chữ trong SVG, walk không bắt). Bé phải nhìn cung, đường kẻ, tên đỉnh để làm từng bước.
- Sửa: tính `UNIT` theo số lớn nhất của bảng hay bề rộng khung để hình chiếm ít nhất nửa khung; chữ tên đỉnh, số thước từ 16px; chụp lại cả điện thoại.

### 11. Hình thoi nhiễu của câu chạm "hình có bốn góc vuông" trông như hình vuông xoay

- Vị trí: hình `chon-hinh-bon-goc-vuong` (`catalog-check.ts`, vùng `thoi`), `$.exercises[42]` (`ex.chon-chu-nhat-trong-thoi`); walk `144-s9-07` - LL-14, LL-10
- Nguồn: —
- Vấn đề: góc khoảng 77° và 103°, bé không đo được trên màn; chọn hình thoi vì tưởng là hình vuông thì bị chấm sai vì một khác biệt khó thấy.
- Sửa: kéo dẹt hình thoi rõ (góc 60° và 120°, vd đường chéo 110 và 64), hoặc thêm vào đề cách so bằng góc tờ giấy.

### 12. Lý do `wrong` của `kiem-chac-chan-chu-nhat` dùng "dấu hiệu", "là điều của" và đọc thành dấu hiệu nhận biết hình thoi bằng đường chéo

- Vị trí: `$.exercises[41].explain.wrong[0].text` ("Bốn cạnh bằng nhau là dấu hiệu của hình thoi…"), `.wrong[1].text` ("Hai đường chéo vuông góc là điều của hình thoi…") (`ex.kiem-chac-chan-chu-nhat`) - LL-17, LL-05
- Nguồn: tr.67 (chỉ chiều "hình thoi thì hai đường chéo vuông góc")
- Vấn đề: hai câu đứng liền, cùng khuôn "X là … của hình thoi", nên bé đọc "đường chéo vuông góc thì là hình thoi", đúng lỗi Nghiêm trọng 3 vòng 1 vừa sửa ở `cheo-thoi-chon-hinh`. Chữ "dấu hiệu" chỉ có ở câu này (câu quy tắc section 9 không dùng), "là điều của" khó hiểu.
- Sửa: `wrong[0]`: "Tứ giác có bốn cạnh bằng nhau là hình thoi, mà các góc của hình thoi có thể không vuông."; `wrong[1]`: "Hình thoi cũng có hai đường chéo vuông góc, mà các góc của nó có thể không vuông."

### 13. Nhiễu "Có, vì các góc đều vuông" của `ba-goc-khit` trái ngay dữ kiện đề

- Vị trí: `$.exercises[44].options` (`ex.ba-goc-khit`, lựa chọn `co`) - LL-14
- Nguồn: —
- Vấn đề: đề vừa nói góc thứ ba bị hở; không ai chọn, câu không kiểm được lỗi thật (nghĩ hai góc vuông là đủ). Cùng kiểu Nên sửa 5 vòng 1.
- Sửa: nhiễu "Có, vì đã có hai góc vuông"; `wrong`: "Hình chữ nhật cần cả bốn góc vuông, mà góc thứ ba bị hở."

### 14. Gợi ý nấc 2 của `ve-thoi-efgh` là hình mẹo hai tam giác đều, khác cách vẽ của bảng và khác tên đỉnh

- Vị trí: `$.exercises[37].hints.hintVisualId` (`ex.ve-thoi-efgh`, hình `hai-tam-giac-deu-thoi`); walk `129-s8-07-…-wrong2` - LL-15
- Nguồn: —
- Vấn đề: bé kẹt ở một bước của bảng (chọn góc, mở compa, hai cung) nhưng gợi ý là hình ABCD của mẹo, không có bước nào của bảng.
- Sửa: dùng hình từng bước của bảng với số khác đề (vd `ve-thoi-cac-buoc`, cạnh 3 cm, 75°); giữ hình mẹo cho kho ôn `ve-thoi-hai-tam-giac`.

### 15. Lời giải bài vẽ hình thoi ở section bài tập sách bài tập nói "cung tâm Q", phần dạy nói "đặt kim ở"

- Vị trí: `$.exercises[49].explain.text` (`ex.dan-4-11-ve-3`), `$.exercises[50].explain.text` (`ex.sbt-4-11`), `$.exercises[51].explain.text` (`ex.dan-4-14-ve-3-60`), `$.exercises[52].explain.text` (`ex.sbt-4-14`); khung 4 của `visual.sbt-4-11-giai`, `visual.sbt-4-14-giai` (`catalog-book.ts`, "Vẽ hai cung tâm Q và tâm N") - LL-05
- Nguồn: —
- Vấn đề: câu quy tắc, recap, "Nhắc lại", bảng vẽ và lời giải section `ve-hinh-thoi` đều nói "đặt kim ở … vẽ hai cung"; riêng các câu này đổi sang "cung tâm", từ bài không dạy (chương này đã bỏ "tâm" ở vòng 1). Bé gặp cách nói lạ đúng ở bài làm của sách.
- Sửa: `sbt-4-11`: "Vẽ MN = 4 cm và một đường MQ tạo với MN góc tự chọn, rồi lấy Q sao cho MQ = 4 cm. Mở compa 4 cm, đặt kim ở Q rồi ở N, vẽ hai cung gặp nhau tại P." Ba câu kia tương tự với số của câu; khung hình lời giải "Đặt kim ở Q rồi ở N, vẽ hai cung gặp nhau tại P". Chụp lại hai hình.

### 16. Hình lời giải 4.11 chạy góc 60° mà không nói góc khác cũng đúng

- Vị trí: `visual.sbt-4-11-giai` (`$.exercises[50].hints.solutionVisualId`, `catalog-book.ts`)
- Nguồn: tr.68 bài 4.11 (không cho góc)
- Vấn đề: đề app cho bé tự chọn 45°, 60° hay 75°, nhưng nấc 3 chỉ có "Kẻ đường MQ tạo với MN một góc 60°"; bé chọn 75° rồi sai bước khác sẽ hiểu phải chọn 60°.
- Sửa: khung 2 "Chọn một góc, ví dụ 60°, kẻ đường MQ tạo với MN góc đó" (hoặc thêm "45° hay 75° cũng được").

### 17. Câu dẫn `dan-4-15-do-canh` gần trùng kho ôn `thoi-bon-canh-6-7`

- Vị trí: `$.exercises[53]` (`ex.dan-4-15-do-canh`) so với `$.exercises[43]` (`ex.thoi-bon-canh-6-7`, thẻ `card.kiem-thoi-chu-nhat`) - LL-07
- Nguồn: —
- Vấn đề: cùng dạng "ba cạnh bằng nhau, cạnh thứ tư dài hơn 1 cm", cùng câu hỏi, hai lựa chọn giống nguyên văn; câu dẫn không thêm bước mới cho 4.15. Cùng kiểu Nên sửa 23 vòng 1.
- Sửa: câu dẫn làm đúng việc của 4.15 với số khác, vd "Đo tứ giác EFGH được EF = FG = GH = HE = 3 cm. Tứ giác EFGH có là hình thoi không?" kèm hình chạm để đo nhỏ (đổi tên luôn theo Nên sửa 19).

### 18. Đề 4.15 không có dòng bảo bé chạm để đo

- Vị trí: `$.exercises[55].prompt` (`ex.sbt-4-15`), hình `sbt-hinh-4-13`; walk `174-s10-14` (ba thiết bị) - LL-22
- Nguồn: tr.69
- Vấn đề: màn chỉ có bốn dấu "?" và dòng xám "Đã đo 0/4"; chạm là cách duy nhất có số đo, bé chậm dễ chọn theo mắt.
- Sửa: câu app ở khối cuối đề (lời sách giữ nguyên): "Chạm vào từng dấu ? để đo bốn cạnh. Chọn đáp án đúng."

### 19. Tên XYZT chỉ hai tứ giác khác nhau ở câu dẫn và gợi ý của 4.15

- Vị trí: `$.exercises[53].prompt[0]` (`ex.dan-4-15-do-canh`: XYZT có TX = 5 cm, không phải hình thoi); `visual.kiem-cac-buoc` (`$.exercises[55].hints.hintVisualId`: XYZT bốn cạnh 4 cm, là hình thoi) - LL-10
- Nguồn: —
- Vấn đề: hai màn liền nhau, cùng tên XYZT, một là "không phải hình thoi", một là "hình thoi".
- Sửa: đổi tên tứ giác của câu dẫn (vd EFGH).

### 20. Nấc 1 của `dan-4-15-do-canh` tô câu hỏi thay vì số đo

- Vị trí: `$.exercises[53].hints.highlight[0]` (`target: "block", index: 1`) - LL-02
- Nguồn: —
- Vấn đề: chỗ hay sai là bỏ qua số đo cạnh thứ tư ở khối 0; nấc 1 lại tô câu hỏi.
- Sửa: `index: 0`; muốn tô trúng số thì thêm khối `formula` có `\htmlId` quanh số đó và trỏ `target: "part"`.

### 21. 4.10, 4.11, 4.14 sách không in lời giải: Reviewer đã tự giải

- Vị trí: `$.exercises[48]` (`ex.sbt-4-10`), `[50]` (`ex.sbt-4-11`), `[52]` (`ex.sbt-4-14`)
- Nguồn: tr.115 chỉ có 4.8, 4.9, 4.15–4.17
- Vấn đề: theo checklist ghi Nên sửa. Tự giải khớp `params` và `expectedState`: 4.10 DE = 3, EF = 5; 4.11 cạnh 4, góc nhận 45°, 60°, 75°; 4.14 cạnh 5, góc 60°. `explain` và hình lời giải đúng số.
- Sửa: không cần đổi; chủ dự án ghi nhận.

### 22. Chữ "tứ giác" dùng ở section 3, trước khi section 9 dạy

- Vị trí: `$.exercises[12].explain.wrong[0].text` (`ex.khung-anh-cheo`, "Tứ giác nào cũng có bốn cạnh và bốn góc…"); câu định nghĩa ở `$.sections[8].blocks[0].children[0]` ("Tứ giác là hình có bốn cạnh.") - LL-04, LL-19
- Nguồn: —
- Vấn đề: lời giải dùng từ chưa học (checklist trục 2); bé gặp chữ này lần đầu ở `wrong` của section `cheo-hinh-chu-nhat`, sáu section trước định nghĩa.
- Sửa: "Hình nào có bốn cạnh cũng có bốn góc, nên như vậy chưa đủ để là hình chữ nhật." Khi sửa Nghiêm trọng 1 và các mục khác ở section 1–8, cũng không thêm chữ "tứ giác".

## Góp ý

### 1. Câu luyện `chon-chu-nhat-quanh-ta` chỉ có một nhiễu đáng nghĩ

- Vị trí: `$.exercises[2]` (hình `chon-chu-nhat-quanh-ta`, vùng `tg`, `luc`); walk `019-s1-06` - LL-14
- Sửa: thay lục giác đều bằng tứ giác lệch gần giống hình chữ nhật (một góc hơi khác 90°); không dùng hình vuông (cũng là hình chữ nhật). Sửa `explain` theo.

### 2. Kho ôn `chon-chu-nhat-hoac-thoi`: hai nhiễu cùng là đồ vật tròn

- Vị trí: `$.exercises[3].options` (`xe`, `dia`) - LL-14
- Sửa: đổi một nhiễu sang vật có góc mà không phải hai hình này, vd "Biển báo hình tam giác" (`wrong`: "Biển báo này có ba cạnh, không phải bốn.").

### 3. Hai câu kho ôn của thẻ `hinh-quanh-ta` cùng hỏi mắt lưới B40 là hình thoi

- Vị trí: `$.exercises[3]` (lựa chọn `luoi`), `$.exercises[4]` (`segments[3]`) - LL-07
- Sửa: một câu đổi sang vật hình thoi khác (ô trám hoa văn gạch); cân nhắc cùng lúc với vật mẫu ở Nên sửa 1.

### 4. "Hai cạnh nằm cạnh nhau" đọc vấp

- Vị trí: `$.exercises[8].explain.text`, `.wrong[0].text` (`ex.chu-nhat-chon-cau-dung`) - LL-25
- Sửa: "Hai cạnh chung một đỉnh của hình chữ nhật thường dài ngắn khác nhau." hoặc nêu tên "AB và BC".

### 5. Kho ôn `canh-doi-chu-nhat-9-4`: hình tỉ lệ 3 : 2 với nhãn 9 cm và 4 cm; đáp án 4 cm trùng DA của "Cùng làm"

- Vị trí: `$.exercises[9]` (hình `chu-nhat-mnpq-9-4`, `catalog-chu-nhat-thoi.ts`) - LL-15, LL-07
- Sửa: AB = 9 cm, BC = 6 cm, hỏi DA (đáp án 6); hoặc vẽ khung theo tỉ lệ 9 : 4.

### 6. `cheo-chu-nhat-luon-co` thiếu `wrong` cho nhiễu "Chúng bằng cạnh dài"

- Vị trí: `$.exercises[11].explain.wrong` (lựa chọn `d`)
- Sửa: "Đường chéo nối hai đỉnh không nằm cạnh nhau, nên dài hơn cả cạnh dài."

### 7. `sourceRef` của `hinh-quanh-ta` chỉ trỏ "kiến thức cần nhớ"

- Vị trí: `$.sections[0].sourceRef`, `$.cards[0].sourceRef`
- Sửa: "Sách bài tập tr.67 (kiến thức cần nhớ, kĩ năng giải toán)".

### 8. Thẻ "Cùng làm" `xem-song-song` hiện sẵn mũi tên song song khi còn "?"

- Vị trí: hình `xem-song-song` (`catalog-chu-nhat-thoi.ts`, `parallel: [[0, 1]]`); walk `059-s4-03`
- Sửa: bỏ `parallel` ở hình của thẻ, hoặc chỉ hiện mũi tên sau khi chạm.

### 9. `canh-song-song-np` không có hình

- Vị trí: `$.exercises[19]` (`ex.canh-song-song-np`)
- Sửa: thêm hình chữ nhật MNPQ nằm nghiêng (không dấu song song), hoặc `wrong` cho `pq`: "P là đỉnh chung của NP và PQ, nên hai cạnh này không song song."

### 10. Nhãn O sát nhãn "90°" ở `do-cheo-thoi`; câu kiểm tra `cheo-thoi-goc-aob` hỏi đúng góc vừa đo

- Vị trí: hình `do-cheo-thoi` (`catalog-chu-nhat-thoi.ts`), walk `086-s6-03`; `$.exercises[25]` (`ex.cheo-thoi-goc-aob`, hình `thoi-cheo-o`) - LL-12, LL-07
- Sửa: dời O sang khe phải trên hoặc đẩy nhãn số đo xa tâm; câu kiểm tra dùng hình thoi khác dáng hay hỏi góc BOC.

### 11. Hình chạm `do-thoi` nhỏ, các vòng "?" chạm nhau trên iPad

- Vị trí: hình `do-thoi` (`catalog-chu-nhat-thoi.ts`); walk `072-s5-03` - LL-12
- Sửa: tăng cỡ hình hay giảm `PROBE_MARGIN` cho hình này; nếu do bố cục chung của hình chạm thì báo người làm app.

### 12. `cheo-thoi-chon-hinh` thiếu `wrong` cho hình bốn cạnh lệch

- Vị trí: `$.exercises[26].explain.wrong` (lựa chọn `c`)
- Sửa: "Hai đường chéo của hình này cắt nhau thành một góc nhọn và một góc tù, không phải góc vuông."

### 13. Kho ôn `ve-thoi-hai-tam-giac` có đáp án là chính số trong đề

- Vị trí: `$.exercises[39]` (`ex.ve-thoi-hai-tam-giac`) - LL-14
- Sửa: hỏi góc: "Hình thoi đó có một góc bằng bao nhiêu độ?" (60, góc của tam giác đều ở đỉnh không thuộc cạnh chung).

### 14. Đề `ve-cn-hai-duong` không nói đang vẽ hình chữ nhật

- Vị trí: `$.exercises[34].prompt[0]` (`ex.ve-cn-hai-duong`)
- Sửa: "Khi vẽ hình chữ nhật, ở hai đầu cạnh DE ta kẻ hai đường cùng vuông góc với DE. Hai đường đó có quan hệ gì với nhau?" (tách câu cho ≤ 25 âm tiết).

### 15. Mẹo góc tờ giấy: "hai cạnh trùng nhau" không rõ cạnh nào; hình chỉ có trường hợp khít

- Vị trí: `$.sections[8].blocks[2].text`, hình `to-giay-goc` (`catalog-check.ts`) - LL-10
- Sửa: "Hai mép giấy nằm đúng trên hai cạnh của góc, gọi là khít"; hình thêm hai ô nhỏ "hở" (110°) và "chờm ra" (70°).

### 16. Câu quy tắc vẽ hình thoi dừng ở "vẽ hai cung gặp nhau", thiếu bước nối

- Vị trí: `$.sections[7].blocks[1].children[1]`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption`, `$.sections[9].blocks[1].children[2]` (lặp nguyên văn)
- Sửa: "…vẽ hai cung gặp nhau rồi nối." ở mọi chỗ lặp (kiểm `[rule-sentence]`, `[length]`).

### 17. Hình mẹo tô cạnh chung BD bằng màu đường chéo, lời mẹo gọi nó là cạnh

- Vị trí: hình `hai-tam-giac-deu-thoi` (`catalog-chu-nhat-thoi.ts`, BD `tone: "amber"`) - LL-05
- Sửa: tô BD màu trung tính đậm, hoặc ghi "cạnh chung BD".

### 18. Nhãn đọc màn hình của Hình 4.11 nêu tên hình, cả tên hình của phần 2

- Vị trí: `FIGURE_411` (`src/visuals/shared/quadrilaterals/figures.ts`), dùng ở `visual.sbt-hinh-4-11` (đề 4.8)
- Sửa: "Hình a, tứ giác ABCD", "Hình b, tứ giác EFGH"… (`aria-label` không lộ đáp án và không nêu hình chưa dạy).

### 19. Thứ tự hai câu dẫn của 4.15

- Vị trí: `$.sections[9].checkIds` (`dan-4-15-do-canh` đứng trước `dan-4-15-do-gi`)
- Sửa: đưa "Ta cần đo gì?" (`dan-4-15-do-gi`) lên trước.

### 20. Câu dẫn 4.11 và 4.14 dùng cùng bảng, cùng cạnh 3 cm

- Vị trí: `$.exercises[49]`, `$.exercises[51]` (`visual.ve-thoi-xyzt`, `side: 3`)
- Sửa: câu dẫn 4.11 cạnh khác, vd 6 cm (tránh 2 cm: nhãn góc đè cạnh).

### 21. Recap của section bài tập sách bài tập chỉ nhắc quy tắc của 4.15

- Vị trí: `$.sections[9].recap`
- Sửa: tuỳ tác giả; chấp nhận được vì đó là câu duy nhất có `rule: true` ở section.

## Cần chủ dự án quyết

1. Bước chọn góc 45°, 60°, 75° khi vẽ hình thoi (4.11): giữ theo quyết định đã có; xem Nên sửa 16 để hình lời giải không ngầm đòi 60°.
2. 4.10, 4.11, 4.14 không có lời giải sách: Reviewer vòng 1 và vòng 2 đã tự giải, khớp (Nên sửa 21).
3. Vật mẫu hình thoi cho cả bài (Nên sửa 1, 2, 5; Góp ý 3): đổi "khung cánh diều" sang một vật có bốn cạnh bằng nhau thật (mắt lưới B40), dùng thống nhất ở `hinh-quanh-ta`, `hinh-thoi`, `cheo-hinh-thoi`.
