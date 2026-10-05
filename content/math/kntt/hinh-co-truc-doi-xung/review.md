# Review: Hình có trục đối xứng (`hinh-co-truc-doi-xung`)

- Bài: `content/math/kntt/hinh-co-truc-doi-xung/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/hinh-co-truc-doi-xung/` - sbt-p78, sbt-p79, sbt-p80, sbt-p81, sbt-p82, sbt-p83, sbt-p118, sbt-p119
- `content:check`: 0 lỗi, 1 cảnh báo của bài (121 id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): chưa chạy, sau vòng toàn bài
- `lesson:walk`: 2 FAIL (iPad ngang, `s1-03-exercise-s1-chon-hinh-gap-doi-wrong2`, `-wrong3`), 0 cảnh báo, ảnh trong `.shots/walk/hinh-co-truc-doi-xung/`
- Kết luận: Chưa đạt: còn 15 lỗi Nghiêm trọng
- Bản đã review: `f41302a3ac625ce63c10ae441b8f636310184838f8127bc01840c7b257e8ed7b` (`pnpm content:diff` so với bản này)

Đáp án của mọi câu sách khớp lời giải tr.118, tr.119; bài đủ 16 `bookRef` (SBT 5.1 đến 5.10), đề câu sách khớp nguyên văn ảnh. Lỗi nằm ở giải thích, gợi ý, hình và câu dẫn.

## Nghiêm trọng

### 1. Walk FAIL iPad ngang: khung trả lời của `s1-chon-hinh-gap-doi` trôi khỏi màn (LL-12)

- Vị trí: `$.exercises[0].options[*]` (`ex.s1-chon-hinh-gap-doi`); ảnh `ipad-landscape/011-s1-03-exercise-s1-chon-hinh-gap-doi-wrong2.png` ("[data-answer-area] at -56–692, bar at 716") và `012-…-wrong3.png`
- Nguồn: —
- Vấn đề: bốn phương án là hình `thumb-*` (`THUMB_WIDTH = 120` trong `src/visuals/math/hinh-co-truc-doi-xung/visuals.ts`) xếp một cột ở iPad ngang, mỗi ô cao khoảng 250 px, nên ở nấc 2 và 3 khung bị đẩy lên khỏi mép trên, mất đề và dòng đầu. Đây là câu kiểm tra đầu tiên của bài. `ex.s4-chon-hinh-co-truc` (`$.exercises[11]`), `ex.s1-on-la` (`[34]`), `ex.s5-on-nhieu-hon-mot` (`[43]`) cũng có bốn phương án `thumb-*` và walk không đi trạng thái sai của chúng.
- Sửa: thêm cỡ riêng cho hình làm phương án (ví dụ `OPTION_THUMB_WIDTH` khoảng 84–90) dùng cho mọi `thumb-*` nằm trong `options`, hoặc gom bốn hình vào một hình đề có nhãn rồi đổi phương án thành chữ. Chạy lại walk iPad ngang, xem cả bốn câu kể trên. Phần bố cục app: Góp ý 1.

### 2. Lý do `wrong` của `s2-ten-duong-gap` dạy "đường chéo không phải đường gấp cho hai nửa khít", trái quy tắc hình thoi (LL-17)

- Vị trí: `$.exercises[4].explain.wrong[0].text` (`ex.s2-ten-duong-gap`, lựa chọn `cheo`): "Đường chéo là đoạn nối hai đỉnh không nằm cạnh nhau, không phải đường gấp cho hai nửa khít."
- Nguồn: tr.78; câu quy tắc của chính bài `$.sections[2].blocks[2].children[0].text`
- Vấn đề: câu nói chung cho mọi hình rằng đường chéo không làm hai nửa khít. Một section sau, bài dạy "Hình thoi có hai trục đối xứng, là hai đường chéo", và hình vuông cũng có hai trục là đường chéo. Bé nhớ câu `wrong` này sẽ trả lời sai ở `s3-cheo-thoi`, `s3-chon-truc-thoi` và 5.2. Lựa chọn sai vì nó gọi sai **tên** đường, không phải vì đường chéo không bao giờ là trục.
- Sửa: "Đường làm hai nửa chồng khít có tên riêng là trục đối xứng. Đường chéo là đoạn nối hai đỉnh đối nhau: có hình nó là trục, có hình thì không." (gộp luôn góp ý chữ "hai đỉnh không nằm cạnh nhau" của nhóm 1).

### 3. Gợi ý nấc 2 `truc-nha-cac-buoc` chiếu kết quả của `s2-duong-nao-la-truc` và chỉ sai chữ "d" (LL-02)

- Vị trí: `$.exercises[3].hints.hintVisualId` = `truc-nha-cac-buoc` (`ex.s2-duong-nao-la-truc`); cùng hình ở `$.exercises[6]` (`ex.s3-truc-chu-nhat`), `$.exercises[8]` (`ex.s3-chon-truc-thoi`), `$.exercises[60]` (`ex.sbt-5-2`)
- Nguồn: —
- Vấn đề: câu hỏi gấp chính ngôi nhà đó theo bốn đường a, b, c, d; hình gợi ý gấp ngôi nhà theo đường đứng giữa, tức là kết quả của đề. Chú thích hình viết "Đường d là trục đối xứng", trong khi ở `lines-house` đường d là đường xiên, một phương án sai (`explain` ghi "Đường d chạy xiên"): bé xem gợi ý sẽ chọn d và sai thêm lần nữa. Ở `s3-truc-chu-nhat`, `s3-chon-truc-thoi`, d tình cờ là một trục nên chú thích lộ một nửa đáp án.
- Sửa: với `s2-duong-nao-la-truc`, gợi ý gấp một hình khác (chiếc lá, cánh bướm) và dừng ở bước "gấp" trước "hai nửa chồng khít", hoặc bỏ `hintVisualId`. Hình gợi ý dùng cho câu có đường tên a, b, c, d không được gọi đường bằng chữ cái: thêm biến thể `foldSteps` có chú thích "đường gấp" thay "d".

### 4. Giải thích dạy lý do sai: "có n cạnh (cánh) bằng nhau nên có n trục" (LL-17)

- Vị trí: `$.exercises[12].explain.text` (`ex.s5-luc-giac-bao-nhieu`) "…có 6 cạnh bằng nhau nên có 6 trục"; `$.exercises[42].explain.text` (`ex.s5-on-tam-giac-bao-nhieu`) "…có 3 cạnh bằng nhau nên có 3 trục"; `$.exercises[47].explain.wrong` (`ex.s7-on-khong-truc`) "Dấu cộng có bốn cánh giống nhau nên có bốn trục."; `$.exercises[67].explain.text` (`ex.l55-dau-cong`) "Dấu cộng có 4 cánh giống nhau nên có 4 trục: hai đường thẳng giữa các cánh và hai đường chéo."; `$.exercises[57].explain.text` (`ex.sbt-5-1`) "Hình đều có bao nhiêu cạnh thì có bấy nhiêu trục…"
- Nguồn: tr.118 (lời giải 5.1, 5.5 chỉ nêu số trục)
- Vấn đề: hình thoi có 4 cạnh bằng nhau mà chỉ có 2 trục, bé vừa học ở section `chu-nhat-thoi`; một chong chóng bốn cánh giống nhau xoay cùng chiều không có trục nào. Chính mẹo `dem-truc-hinh-deu` cần thêm "các góc bằng nhau". Năm chỗ bỏ điều kiện đó dạy bé một quy tắc sai, bé sẽ đáp "4" cho hình thoi. `sbt-5-1` còn dùng "hình đều", chữ bài chưa định nghĩa (Nên sửa 8). Ở `l55-dau-cong`, "hai đường thẳng giữa các cánh" lại chỉ nhầm sang đường chéo (hai trục đứng và ngang đi qua giữa từng cánh), gộp từ Nên sửa 9 của nhóm 3.
- Sửa: lục giác đều: "Hình lục giác đều có 6 cạnh bằng nhau và 6 góc bằng nhau, nên có 6 trục đối xứng."; tam giác đều cùng khuôn. Dấu cộng (`s7-on-khong-truc`, `l55-dau-cong`): "Gấp dấu cộng theo đường thẳng đứng, đường nằm ngang đi qua giữa các cánh, hay theo hai đường chéo, hai nửa đều chồng khít. Vậy có 4 trục." `sbt-5-1`: "Tam giác đều có 3 trục, hình vuông 4 trục, lục giác đều 6 trục, như hình ở màn quy tắc. …" Soát cả bài tìm mọi câu "… bằng nhau / giống nhau nên có … trục".

### 5. Đề `s5-tong-so-truc` hiểu được hai cách, mỗi cách một đáp án (LL-10)

- Vị trí: `$.exercises[14].prompt[0].text` (`ex.s5-tong-so-truc`): "Một hình lục giác đều và một hình tam giác đều đặt cạnh nhau. Cả hai hình có tất cả bao nhiêu trục đối xứng?"
- Nguồn: —
- Vấn đề: "đặt cạnh nhau" đọc được thành một hình ghép; hình ghép đó có nhiều nhất 1 trục, khác đáp án 9 (6 + 3). Bài dạy trục là của một hình, nên cách hiểu "hình ghép" là hợp lý.
- Sửa: "Bạn có một hình lục giác đều và một hình tam giác đều. Đếm trục của từng hình rồi cộng lại: được bao nhiêu trục?"

### 6. Quy tắc trục nằm nghiêng thiếu điều kiện "trục đi theo đường chéo của các ô vuông" (LL-17)

- Vị trí: `$.sections[9].blocks[1].children[0].text` (câu `rule` của section `truc-cheo`), `$.sections[9].recap.caption`, `$.cards[9].recap.caption` (`card.truc-cheo`), `$.sections[11].blocks[2].children[2].text` (khối "Nhắc lại cho bài 5.6 và bài 5.8"), `$.exercises[29].explain.text` (`ex.s10-huong-di`), câu mở `$.sections[9].blocks[0].children[0].text`
- Nguồn: tr.82 bài 5.8, tr.119 lời giải (hai trục nghiêng 45°, đi theo đường chéo các ô)
- Vấn đề: "đi ngang tới trục, rồi đi dọc cùng số ô" chỉ đúng khi trục là đường chéo của các ô (mọi bảng của bài đều thế). Với trục qua gốc có hướng (1; 2), điểm (1; 0) đi theo quy tắc ra (0; 1), còn điểm đối xứng thật là (−0,6; 0,8). Câu mở section chỉ nói "trục d chạy xiên qua các ô vuông". Bé học quy tắc không điều kiện sẽ dùng sai.
- Sửa: "Với trục đi theo đường chéo của các ô vuông, đi ngang từ điểm tới trục. Rồi đi dọc cùng số ô, sang bên kia trục." Sửa cùng lúc, giữ nguyên văn ở cả sáu chỗ trên; câu mở: "Ở hình này, trục d đi chéo qua góc các ô vuông." (gộp Góp ý 2 của nhóm 2).

### 7. Gợi ý nấc 2 của `s10-ve-truc-xien` đi đúng một cặp điểm đáp án (LL-02)

- Vị trí: `$.exercises[30].hints.hintVisualId` = `cheo-dem-o` (`ex.s10-ve-truc-xien`); `DIAGONAL_DEMO` trong `boards.ts`, `from: [4, 1]` trong `visuals.ts`
- Nguồn: —
- Vấn đề: hình gợi ý và bảng bài tập (`DIAGONAL_EXERCISE`) cùng lưới 6 × 6, cùng trục. Gợi ý đếm từ (4; 1) tới "?" ở (1; 4); bài tập có đỉnh (1; 4) với điểm đối xứng cần chạm là (4; 1). Nấc 2 chỉ đúng chỗ một trong ba điểm đáp án, trái luật "ví dụ giải trọn chỉ dùng số khác đề".
- Sửa: đổi điểm của `DIAGONAL_DEMO` sang chỗ không trùng đỉnh hay đáp án của `DIAGONAL_EXERCISE` (đỉnh (4; 4), (1; 4), (0; 2), (1; 2); đáp án (4; 1), (2; 0), (2; 1)), ví dụ `from: [5, 2]`. Soát lại các câu dẫn và câu sách 5.8 cũng dùng `cheo-dem-o` xem có trùng đỉnh hay đáp án không.

### 8. "Đường chéo của tờ giấy" có thể cũng là trục; lý do "không phải nếp gấp nên không phải trục" sai (LL-01)

- Vị trí: `$.exercises[54]` (`ex.s11-on-nep-gap`, `multiple: true`, `options` và `explain.wrong[0]`); `$.exercises[31].explain.wrong[1]` (`ex.s11-truc-sau-khi-mo`)
- Nguồn: tr.80 ví dụ 3
- Vấn đề: `s11-on-nep-gap` không có hình, không nói tờ giấy hình gì hay cắt gì. Tờ giấy vuông gấp hai lần rồi cắt hình vuông ở góc có hai nếp thì mở ra hai đường chéo cũng là trục, nên "Đường chéo của tờ giấy" có thể đúng; mẹo `gap-hai-lan` cũng nói "ít nhất hai trục". Lý do "không phải nếp gấp nên không phải trục" sai: hình thoi ở `gap-giay-quy-tac` (gấp một lần) có thêm trục nằm ngang không phải nếp gấp, và section 3 dạy hai đường chéo hình thoi là trục.
- Sửa: `s11-on-nep-gap` thêm hình tờ giấy đã mở có kích thước (như `gap-giay-cung-lam`: tờ 3 × 5, lỗ chữ nhật không vuông), hoặc thay nhiễu bằng "Một cạnh của tờ giấy". Hai câu `wrong`: "Nếp gấp chắc chắn là trục. Đường chéo chỉ là trục khi gấp theo nó hai nửa cũng chồng khít; ở hình này thì không."

### 9. Thẻ số 5 ở bài 5.10 vẽ thành chữ số 2 lật ngược, không đọc ra số 5 (LL-15)

- Vị trí: `src/visuals/math/hinh-co-truc-doi-xung/glyphs.ts` (`"5": [mirrored(TWO)]`), dùng ở `$.exercises[89].prompt[1]` (`ex.sbt-5-10`, `sbt-5-10-the`), `sbt-5-10-giai`, `$.exercises[88]` (`ex.l510-hai-nam`)
- Nguồn: tr.83 `sbt-p83.png` (thẻ 2 và 5 kiểu khối vuông); tr.119
- Vấn đề: ở sách, 2 và 5 là nét khối nên ảnh gương của 2 vẫn đọc là 5. Ở app, 2 có nét chéo nên ảnh gương là "Ƨ" (ảnh `253-s12-38-exercise-sbt-5-10.png`, thẻ thứ tư). Bé không nhận ra số 5, nên không ghép được 205, 502, 215, 512, 285, 582 (6 trên 10 số đáp án).
- Sửa: vẽ 2 kiểu khối như sách (thanh trên, cột phải trên, thanh giữa, cột trái dưới, thanh dưới), 5 là ảnh gương của nó. Kiểm lại 5.3 nếu dùng chung `TWO` (2 vẫn không có trục). Chạy lại test thẻ số.

### 10. Hình thoi của tờ giấy "t" gần như hình vuông (LL-15)

- Vị trí: `paper.ts` `T_HALF`, dùng ở `$.exercises[75]` (`ex.l57-hinh-thoi`, visual `paper-t`), khối "Nhắc lại" thứ tư (`gap-giay-quy-tac`), nấc 2 của `ex.sbt-5-7`
- Nguồn: —
- Vấn đề: mở ra là hình thoi hai đường chéo 112 và 100, góc khoảng 84° và 96°, trên màn trông như hình vuông xoay (ảnh `176`, `177`, `225`). `explain` nói "hai góc nhọn và hai góc tù", `wrong` bảo hình vuông sai vì "có góc nhọn", nhưng bé không thấy được góc 84°: chọn "Hình vuông" là hợp lý theo hình.
- Sửa: tam giác hẹp hẳn, ví dụ `[[90,120],[120,60],[120,180]]` (góc khoảng 53° và 127°), rồi xem lại ba chỗ dùng hình này.

### 11. Giải thích của câu dẫn `l59a-dan` sai hình và sai trục (LL-17)

- Vị trí: `$.exercises[81].explain.text` (`ex.l59a-dan`)
- Nguồn: —
- Vấn đề: hình cho sẵn là "┐" (hai đầu chéo nhau), nên không có "đoạn nối hai đầu" dài 1. Các cách vẽ hàm chấm nhận cho chữ ∩, ⊐ hay T, có trục thẳng đứng hoặc nằm ngang (hình lời giải, ảnh `238`, vẽ trục thẳng đứng). Câu "chữ U gấp khít theo đường chéo" dạy sai trục của chữ U.
- Sửa: "Thêm một đoạn đi xuống từ đầu bên trái thì được hình giống chữ ∩. Gấp theo đường thẳng đứng ở giữa thì hai nửa khít, nên hình có đúng một trục."

### 12. Câu dẫn `l59b-dan` chỉ có một lời giải là đường rời xa hình, bé gần như không tìm ra (LL-27)

- Vị trí: `$.exercises[83]` (`ex.l59b-dan`), bảng `LEAD_59` trong `boards.ts`
- Nguồn: tr.119 hình 5.9b (đường vẽ thêm nối vào hình cho sẵn)
- Vấn đề: duyệt hết mọi cách vẽ 2 đoạn: hàm chấm chỉ nhận đường "└" ở góc dưới bên trái, không chạm hình cho sẵn (ảnh `242`); không cách nối vào hình nào ra đúng hai trục. Đề "Vẽ thêm một đường gấp khúc" khiến bé vẽ nối vào hình, `explain` chỉ nói "Thử vài cách vẽ", câu không có nấc 2, nấc 3. Bé không làm được, và cách làm khác cách của sách ở 5.9b.
- Sửa: đổi độ dài để lời giải nối liền vào hình. Trên cùng `LEAD_59`, độ dài 4, hai trục có đúng hai cách, cả hai nối hai đầu "┐" thành hình chữ nhật 2 × 1 ô (ví dụ (1,1)→(0,1)→(0,2)→(1,2)→(2,2)). `explain` nêu đúng hình đó và hai trục của nó; thêm test liệt kê mọi lời giải hàm chấm nhận.

### 13. Gợi ý nấc 2 của 5.5 hiện ngôi sao năm cánh với 5 trục, chính là kết quả của đề (LL-02)

- Vị trí: `$.exercises[68].hints.hintVisualId` = `goi-y-dem-canh` (`ex.sbt-5-5`); cùng hình ở `$.exercises[57]` (`ex.sbt-5-1`)
- Nguồn: tr.81 (5.5 có ngôi sao năm cánh), tr.118
- Vấn đề: hình vẽ ngôi sao năm cánh đủ trục, chú thích "5 cánh: 5 trục". Ngôi sao là hình thứ hai của 5.5, nên nấc 2 lộ kết quả; bé còn thấy nó ở 5.1 trước khi tới 5.5.
- Sửa: nấc 2 của 5.5 và 5.1 dùng hình khác đề (dấu cộng bốn cánh, một hình đều khác), hoặc chỉ gấp thử một đường của ngôi sao rồi dừng ở "?".

### 14. Hai câu dẫn của 5.10 dùng đúng thẻ của sách và tính sẵn một phần đáp án (LL-07)

- Vị trí: `$.exercises[87]` (`ex.l510-ba-the`), `$.exercises[88]` (`ex.l510-hai-nam`)
- Nguồn: tr.83, tr.119
- Vấn đề: `l510-ba-the` đếm số ghép từ đúng ba thẻ 1, 8, 0 của sách, ra 4 (số hạng 4 trong 4 + 6 = 10 của đáp án); `l510-hai-nam` ghép 285, một trong mười số của lời giải. Câu dẫn không được dùng đúng số của câu sách kế tiếp.
- Sửa: dùng thẻ khác sách, ví dụ ba thẻ chữ H, O, X (đều có trục nằm ngang); hai thẻ gương nhau như b và d quanh một thẻ có trục thẳng đứng. Giữ cùng kỹ năng.

### 15. Ngôi sao ở 5.5 có tám đường dày đặc, nhãn chồng nhau, khó chạm đúng đường (LL-12)

- Vị trí: visual `sbt-5-5-chon` (`$.exercises[68].visualId`), `visuals.ts`
- Nguồn: —
- Vấn đề: ảnh `212` (iPad), `211`, `212` (điện thoại): nhãn "f" và "g" chồng nhau, "c" và "a" dính nhau; trên điện thoại ngôi sao rộng khoảng 130 px với tám đường qua tâm, đường giả sát trục thật. Bé khó biết nhãn nào của đường nào và chạm nhầm.
- Sửa: bớt đường giả của ngôi sao (một hay hai), đặt nhãn cách nhau, trên màn hẹp xếp mỗi hàng một hình.

## Nên sửa

### 1. Câu kiểm tra và câu luyện lặp đúng hình của màn "Cùng làm" vừa xem (LL-07)

- Vị trí: `$.exercises[3]` (`ex.s2-duong-nao-la-truc`, `lines-house`) so với `gap-thu-ngoi-nha`; `$.exercises[6]` (`ex.s3-truc-chu-nhat`) so với `chu-nhat-gap-thu`; `$.exercises[8]` (`ex.s3-chon-truc-thoi`) so với `thoi-gap-thu`; `$.exercises[10]` (`ex.s4-binh-hanh-gap-cheo`) so với `binh-hanh-gap-thu`
- Nguồn: —
- Vấn đề: cùng hình, cùng bốn đường, lời kết màn đã nói đáp án. Bé chỉ nhớ lại, câu kiểm tra không đo được hiểu bài.
- Sửa: hình khác hẳn màn dạy (chữ nhật dựng đứng hay tỉ lệ khác, thoi dẹt hơn, bình hành nghiêng ngược chiều, đường nhiễu khác).

### 2. Bốn câu của thẻ `quanh-ta` dùng cùng một bộ hình (LL-07)

- Vị trí: `$.exercises[0]` (`ex.s1-chon-hinh-gap-doi`), `[2]` (`ex.s1-vat-gap-doi`), `[34]` (`ex.s1-on-la`), `[35]` (`ex.s1-on-cham`)
- Nguồn: —
- Vấn đề: cả bốn có nhiễu biểu tượng con rắn và hình bình hành, ba câu có cánh bướm làm đáp án, hai câu có chữ N. Câu ôn thành nhớ lại câu cũ.
- Sửa: mỗi câu dùng hình đời sống khác (kéo mở, lá khác, mặt trống đồng, con diều; dấu hỏi, bàn chân, đám mây lệch).

### 3. Nhãn chữ của hai đường thẳng đứng sát nhau (LL-21)

- Vị trí: `lines-house` (ảnh 031: "b c"), `lines-gate` (ảnh 035: "c b"), `gap-thu-ngoi-nha` (ảnh 029: "a d"); câu `$.exercises[3]`, `[5]`
- Nguồn: —
- Vấn đề: trục và đường lệch giữa cách nhau 26 đơn vị, hai nhãn gần chạm nhau đúng ở chỗ câu hỏi xoay quanh.
- Sửa: đặt nhãn của đường lệch ở đầu trên, hoặc dời đường lệch xa trục hơn (ví dụ x = 160).

### 4. Biểu tượng Y Dược nhỏ: phần làm hình mất đối xứng là nét rắn mảnh (LL-14)

- Vị trí: `thumb-medical` trong `$.exercises[0].options`, `$.exercises[34].options`; hình `cham-gap-doi`
- Nguồn: tr.81 (5.4)
- Vấn đề: ở 120 px chỉ con rắn làm mất đối xứng, mà nó vẽ nét `thin` khó thấy (ảnh 009, 011), ở câu đầu tiên của bài.
- Sửa: vẽ con rắn nét đậm hơn, hoặc thay nhiễu này ở section 1 bằng hình mất đối xứng rõ (để dành biểu tượng Y Dược cho section `do-vat-bieu-tuong`, xem thêm Nên sửa 9).

### 5. Nói "hình bình hành" chung chung, trái cách gọi "hình bình hành lệch" của bài (LL-05)

- Vị trí: `$.exercises[2]` (`ex.s1-vat-gap-doi`, lựa chọn `gach` "Viên gạch hình bình hành" và `wrong` của nó); `$.exercises[36].explain.text` (`ex.s2-on-nhieu-truc`) "Hình bình hành không có trục…"; `$.exercises[60].explain.text` (`ex.sbt-5-2`) "Hình bình hành không có trục nào"
- Nguồn: tr.118 (5.2: "không có trục" ghi dưới hình vẽ cụ thể)
- Vấn đề: câu quy tắc section 4 và khối "Nhắc lại" thứ nhất nói "hình bình hành lệch như trong hình", vì hình chữ nhật, hình thoi cũng là hình bình hành. Ba chỗ này nói chung, thành một khái niệm hai cách nói và dạy ý sai.
- Sửa: "hình bình hành lệch" (hay "hình bình hành lệch này") ở cả ba chỗ; ở `s1-vat-gap-doi` có thể thay lựa chọn này bằng vật khác.

### 6. Hình gợi ý nấc 2 `truc-nha-cac-buoc` dùng cho mọi câu, không chỉ vào lỗi hay gặp

- Vị trí: `hintVisualId` của `$.exercises[2]`, `[6]`, `[8]`, `[10]`, `[11]` (`ex.s4-chon-hinh-co-truc`), `ex.s3-on-cua-cheo`, `ex.s4-on-truc-thang-can`, `$.exercises[60]` (`ex.sbt-5-2`), `$.exercises[82]`, `[84]`, `[86]` (`ex.sbt-5-9a`, `-9b`, `-9c`)
- Nguồn: —
- Vấn đề: lỗi hay gặp là chọn đường chéo hình chữ nhật, đường nối trung điểm hình thoi, đường ngang hình thang cân, hay (5.9) không biết vẽ hình gì; hình gấp ngôi nhà theo trục đứng không giúp được (ảnh 051). Riêng nấc 2 lộ đáp án là Nghiêm trọng 3.
- Sửa: mỗi dạng câu một hình gợi ý chỉ cách kiểm mà không cho kết quả (gấp thử hình khác rồi dừng ở "mép có trùng không"; với 5.9: một dấu cộng nhỏ có trục). Không có hình hợp thì bỏ `hintVisualId`.

### 7. Mẹo `dem-truc-hinh-deu` và tên "hình đều" đi xa hơn sách (LL-09)

- Vị trí: section `hinh-deu`: tiêu đề "Hình đều có nhiều trục", `$.sections[4].blocks[0].children[0].text` "Gạch lát nền, tổ ong và đĩa tròn có các hình đều", `$.sections[4].blocks[2]` (`tip.dem-truc-hinh-deu`); liên quan `$.exercises[56]` (`ex.l51-nam-canh`, Góp ý 20)
- Nguồn: tr.78 (H.5.1), tr.118 (5.1): sách chỉ nêu tam giác đều, hình vuông, lục giác đều, hình tròn
- Vấn đề: mẹo đúng (đã thử n = 3, 4, 5, 6, 8) nhưng nói cho mọi hình "cạnh bằng nhau và góc bằng nhau", lớp 6 chỉ biết ba hình như vậy. "Hình đều" không có trong glossary, và bài gọi cả đĩa tròn là "hình đều" dù hình tròn không có cạnh.
- Sửa: "Tam giác đều, hình vuông, lục giác đều: hình có bao nhiêu cạnh thì có bấy nhiêu trục." Đổi tiêu đề section và câu note, không gọi hình tròn là "hình đều" (ví dụ "Tam giác đều, hình vuông, lục giác đều và hình tròn").

### 8. Màn dạy lộ sẵn đáp án bài 5.3 và 5.4 của sách (LL-07)

- Vị trí: `$.sections[5].blocks[0]`, `[1]` (`chu-cai-the`, `chu-cai-quy-tac`: A, B, H, N kèm số trục); `$.sections[6].blocks[0]` (`bieu-tuong-the`: Hòa bình 1 trục, Chữ thập đỏ 4 trục, Y Dược không trục); `$.exercises[18]` (`ex.s7-khong-co-truc`), `$.exercises[47]` (`ex.s7-on-khong-truc`)
- Nguồn: tr.81 (5.3, 5.4), tr.118
- Vấn đề: section 7 dạy đúng ba biểu tượng của 5.4 kèm đáp án; section 6 cho đáp án 4 trên 13 chữ của 5.3. Tới section sách, bé chỉ nhớ lại, không tự xét hình lạ.
- Sửa: màn dạy dùng chữ không có trong 5.3 (E, T, U, D, K, L) và biểu tượng không có trong 5.4 (biển báo cấm, trái tim, mũi tên). Bỏ biểu tượng Y Dược khỏi câu kiểm tra và câu ôn section 7.

### 9. Câu luyện và câu ôn section 6, 7 lặp hình của câu kiểm tra, ví dụ hay section khác (LL-07)

- Vị trí: `$.exercises[17]` (`ex.s6-cham-chu-mot-truc`), `[44]` (`ex.s6-on-chu-hai-truc`), `[45]` (`ex.s6-on-chu-e-truc`), `[46]` (`ex.s7-on-nhieu-nhat`), `[47]` (`ex.s7-on-khong-truc`), `[20]` (`ex.s7-mot-truc`)
- Nguồn: —
- Vấn đề: gần như không câu nào hỏi hình mới. `s7-on-nhieu-nhat` có đúng bốn lựa chọn và đáp án của `s5-vo-so-truc` (và bài 5.1), dù gắn thẻ `do-vat-bieu-tuong`.
- Sửa: mỗi tầng chữ, hình riêng (luyện: U, D, K, V, W; ôn: C, O, Z, F; đồ vật: lá cờ, kéo, biển báo, logo). Viết lại `s7-on-nhieu-nhat` về đồ vật.

### 10. Câu quy tắc section 7 là câu của section 2 nói khác chữ, không nêu ý riêng (LL-05)

- Vị trí: `$.sections[6].blocks[1].children[0].text` (`rule`), `$.sections[6].recap.caption`, `$.cards[6].recap.caption`, `$.sections[11].blocks[1].children[2].text` (Nhắc lại 5.3, 5.4); so với `$.sections[1].blocks[1].children[0].text`
- Nguồn: tr.78
- Vấn đề: section 2 viết "… có một trục hay có nhiều trục.", section 7 và "Nhắc lại" viết "… có nhiều trục đối xứng." Một quy tắc hai cách nói; ý mới của section 7 không có câu nhớ.
- Sửa: chốt một cách viết ở mọi nơi; section 7 có câu nhớ riêng, ví dụ "Muốn biết đồ vật có trục không, hãy tưởng tượng gấp đôi nó: hai nửa chồng khít thì có trục."

### 11. Câu mở section 7 nói "biển báo" nhưng màn không có biển báo (LL-15)

- Vị trí: `$.sections[6].blocks[0].children[0].text`
- Nguồn: —
- Vấn đề: bốn thẻ là cổng đền, Hòa bình, dấu cộng, Y Dược.
- Sửa: bỏ "biển báo", hoặc thay một thẻ bằng biển báo (theo Nên sửa 8).

### 12. Điểm nằm trên trục tự đối xứng với chính nó: câu ôn hỏi nhưng chưa màn nào dạy, quy tắc lại nói "hai bên d" (LL-09, LL-16)

- Vị trí: `$.exercises[49]` (`ex.s8-on-diem-tren-truc`), `[51]` (`ex.s9-on-diem-tren-truc`), `[53]` (`ex.s10-on-diem-tren-truc`); câu `rule` `$.sections[7].blocks[1].children[0].text`; màn dạy `$.sections[8]`
- Nguồn: tr.78, tr.118 (lời giải 5.6 giữ đỉnh trên d)
- Vấn đề: giả định 1 của bàn giao chấp nhận được, nhưng chỉ `explain` của ba câu ôn nói ra. Câu quy tắc section 8 nói hai điểm đối xứng "nằm hai bên d", nên bé chỉ dựa vào quy tắc sẽ chọn "Ở bên kia d". Hình `ve-cac-buoc`, `ve-cung-lam` có đầu đoạn trên d mà không có lời nào.
- Sửa: thêm một câu ở màn dạy section 9 (hay lời cuối `ve-cac-buoc`): "Đỉnh nằm trên d thì giữ nguyên, vì điểm đối xứng của nó là chính nó." Không cần đưa vào câu `rule`.

### 13. Câu hỏi theo "cột", "hàng" có số mà bài chưa cho thấy; trục nằm ngang chưa dạy trước câu ôn (LL-10, LL-22)

- Vị trí: `$.exercises[25]` (`ex.s9-cot-cua-diem-doi-xung`), `$.exercises[50]` (`ex.s9-on-hang-cua-diem`)
- Nguồn: tr.82 (5.6, hình thứ ba có trục nằm ngang)
- Vấn đề: không lưới nào đánh số cột, hàng; hai câu không có hình. "Trục đi qua cột 5" hiểu được hai cách. `s9-on-hang-cua-diem` dùng trục nằm ngang mà mọi màn dạy, câu luyện section 8, 9 và mẹo chỉ có trục thẳng đứng.
- Sửa: thêm hình lưới đánh số cột (hàng), trục d, điểm và "?" (không lộ đáp án). Dạy trục nằm ngang ở section 9 trước câu ôn này (có thể gộp vào mẹo, Nên sửa 14).

### 14. Mẹo `dem-o-tu-truc` chỉ nhắc lại cách đã dạy ở section 8

- Vị trí: `$.sections[8].blocks[2]` (`tip.dem-o-tu-truc`); so với `$.sections[7].blocks[2].children[0].text` và `$.exercises[24].explain.text` (`ex.s8-dat-diem-doi-xung`)
- Nguồn: —
- Vấn đề: cách đếm ô đã là cách chính ở "Cùng làm" và câu luyện section 8; nhắc lại với nhãn "làm nhanh" là mẹo gượng. Tên "Tìm điểm đối xứng trên lưới" rộng hơn nội dung (chỉ trục thẳng đứng). Mẹo đúng với mọi đầu vào đã thử: trục cột 3, điểm (0, 1) → (6, 1); (3, 2) trên d → chính nó; (2, 0) → (4, 0); (5, 4) → (1, 4); trục cột 5, (0, 3) → (10, 3).
- Sửa: chuyển mẹo về section 8, làm thành mẹo dùng lưới thay thước và compa, thêm vế trục nằm ngang ("trục nằm ngang thì đếm số ô theo cột, trên cùng cột"); hoặc bỏ khối mẹo ở section 9.

### 15. Câu đếm số lỗ khi gấp giấy chưa có màn mẫu (LL-16)

- Vị trí: `$.exercises[32]` (`ex.s11-so-lo-gap-mot-lan`), `[33]` (`ex.s11-so-lo-gap-hai-lan`), `[55]` (`ex.s11-on-so-lo`); màn dạy `$.sections[10]`
- Nguồn: tr.80 ví dụ 3
- Vấn đề: giả định 5 chấp nhận được, nhưng mọi màn dạy chỉ có nhát cắt chạm nếp gấp, chưa màn nào cho lỗ không chạm nếp hay nói "lớp giấy", mà `explain` giải bằng số lớp.
- Sửa: thêm khung vào `gap-giay-cac-buoc` hay một màn ngắn: gấp đôi, cắt lỗ tròn không chạm nếp, mở ra 2 lỗ đối xứng qua nếp. `explain` theo đối xứng: "Mở ra, lỗ có thêm một lỗ đối xứng với nó qua nếp gấp, nên có 2 lỗ."

### 16. Hình gợi ý của `s11-so-lo-gap-hai-lan` cho ra 1 lỗ, dẫn tới đáp án sai (LL-15)

- Vị trí: `$.exercises[33].hints.hintVisualId` = `gap-giay-cac-buoc`
- Nguồn: —
- Vấn đề: đề nói lỗ không chạm nếp nào (đáp án 4); hình gợi ý cắt ở góc có hai nếp, mở ra một lỗ "giống chữ số 0". Bé dễ nhập 1.
- Sửa: hình gợi ý gấp hai lần rồi cắt lỗ không chạm nếp, dừng ở "?" trước khi mở hết; hoặc số khác đề (gấp một lần, ra 2 lỗ).

### 17. Section 8, 9, 10 thiếu ví dụ đời sống (LL-16)

- Vị trí: `$.sections[7].blocks[0]`, `$.sections[8].blocks[0]`, `$.sections[9].blocks[0]`
- Nguồn: —
- Vấn đề: ba section mở bằng điểm, đường thẳng, nửa dấu cộng, không tình huống đời sống nào.
- Sửa: thêm nửa câu đời sống: soi gương (section 8), vẽ nốt nửa kia của con bướm trên giấy kẻ ô (section 9), gạch lát xếp chéo (section 10).

### 18. Nhiễu vô lý, không ai chọn (LL-14)

- Vị trí: `$.exercises[49].options[2]` ("Ở rất xa d", `ex.s8-on-diem-tren-truc`, không có `wrong`); `$.exercises[26].options[1]` ("Tô màu cho cả hình", `ex.s9-buoc-dau`)
- Nguồn: —
- Vấn đề: loại được ngay, câu chỉ còn 2 lựa chọn thật.
- Sửa: thay bằng lỗi hay gặp, ví dụ "Nối các đỉnh đã có rồi mới tìm điểm đối xứng" (sai thứ tự).

### 19. Hình lời giải nấc 3 của 5.9a khác lời giải của sách (LL-27)

- Vị trí: `$.exercises[82].hints.solutionVisualId` (`ex.sbt-5-9a`, `sbt-5-9a-giai`), `edges.ts` `solveEdges`
- Nguồn: tr.119 hình 5.9a (nối hai đầu thành hình chữ L có một trục chéo)
- Vấn đề: `solveEdges` lấy "cách đầu tiên": một ô vuông kèm một móc thừa (ảnh `240`), khó hiểu và khác sách.
- Sửa: visual lời giải nhận danh sách đoạn cố định theo lời giải sách: a) (2,1)→(3,1)→(3,2)→(3,3)→(2,3); b) (2,1)→(3,1)→(3,2)→(2,2)→(2,3); c) như hiện tại.

### 20. 5.9: `explain` giống hệt nhau ở a, b, c, không nêu bước với số của câu

- Vị trí: `$.exercises[82]`, `[84]`, `[86]` `.explain.text` (`ex.sbt-5-9a`, `-9b`, `-9c`)
- Nguồn: tr.119
- Vấn đề: "Chọn các đoạn nối liền nhau cho đủ độ dài. Rồi gấp thử…" không nói vẽ hình gì; câu dẫn `l59a`, `l59b` sai hoặc không làm được (Nghiêm trọng 11, 12), nên 5.9 thiếu hướng dẫn từng bước đúng. (Phần nấc 2: Nên sửa 6.)
- Sửa: mỗi ý một `explain` nêu hình cần được (a: hình chữ L, trục là đường chéo; b: hai ô vuông chạm góc, hai trục là hai đường chéo; c: dấu cộng năm ô, bốn trục).

### 21. 5.10: lời giải không liệt kê đủ 10 số, không nói mỗi thẻ chỉ dùng một lần

- Vị trí: `$.exercises[89].explain.text` (`ex.sbt-5-10`), visual `sbt-5-10-giai` (chỉ 108 và 285)
- Nguồn: tr.119
- Vấn đề: sách liệt kê 180, 810, 108, 801, 205, 502, 215, 512, 285, 582; app nêu bốn số đầu và "6 số". Bé không thấy sáu số đó, không hiểu vì sao 181, 888 không được.
- Sửa: hình lời giải nấc 3 hiện đủ 10 số chia hai nhóm (trục nằm ngang; trục thẳng đứng); thêm ý "mỗi thẻ chỉ có một tấm".

### 22. `l510-ba-the` giải bằng phép đếm hoán vị chưa học; chữ và công thức lệch nhau (LL-09)

- Vị trí: `$.exercises[87].explain` (`ex.l510-ba-the`)
- Nguồn: —
- Vấn đề: "3 cách chọn chữ số đầu, rồi 2 cách…" là quy tắc nhân lớp 6 chưa học; `text` ghi "3 · 2 = 6", `tex` ghi "3 · 2 · 1 = 6". (Câu còn phải đổi thẻ theo Nghiêm trọng 14.)
- Sửa: liệt kê các số ghép được rồi đếm.

### 23. Khối "Nhắc lại" thứ tư nêu điều chưa section nào dạy: 0, 1, 8 có hai trục; 2 và 5 gấp khít nhau (LL-09)

- Vị trí: `$.sections[11].blocks[3].children[2].text`
- Nguồn: tr.83 (chỉ có ở đề 5.10)
- Vấn đề: "Nhắc lại" nhưng không section dạy nào nói chữ số 1, 8, cặp 2 và 5; câu là chìa khoá của 5.10, đặt trước bài như quy tắc, và phụ thuộc kiểu chữ của thẻ (Nghiêm trọng 9).
- Sửa: đổi thành điều đã dạy (gấp chữ theo đường thẳng đứng, nằm ngang của section `chu-cai-chu-so`); để việc phát hiện 0, 1, 8 và cặp 2, 5 cho câu dẫn và lời giải.

### 24. Trục d trong hình không có nhãn "d" (LL-15)

- Vị trí: `mirror-board.tsx` (bảng của `ex.sbt-5-6a`, `-6b`, `-6c`, `ex.sbt-5-8a`, `-8b`, câu dẫn `l56*`, `l58*`); `truc-nha-quy-tac` (màn quy tắc và recap section `truc-doi-xung`, ảnh 028, 037)
- Nguồn: tr.82 (sách ghi chữ d cạnh trục)
- Vấn đề: đề và câu quy tắc nói "đường thẳng d", "trục d" nhưng hình chỉ có nét đứt hồng (ảnh `215`, `219`, `223`, `231`, `235`). Gộp Góp ý 2 của nhóm 1.
- Sửa: vẽ chữ "d" màu hồng ở một đầu trục, như sách.

### 25. 5.6b: "đầu bên phải của nửa vòng tròn" dễ hiểu sai (LL-10)

- Vị trí: `$.exercises[72].explain.text` (`ex.sbt-5-6b`)
- Nguồn: tr.82, tr.118
- Vấn đề: hai đầu của nửa vòng tròn nằm trên d; điểm cần chạm là điểm đối xứng của điểm xa d nhất.
- Sửa: "điểm đối xứng của điểm xa d nhất trên nửa vòng tròn".

### 26. Câu dẫn `l54-co-truc` dùng đúng hình thứ nhất của 5.5 và nói nó không có trục (LL-07)

- Vị trí: `$.exercises[65]` (`ex.l54-co-truc`, lựa chọn `lech`, `thumb-pentomino`, `wrong`)
- Nguồn: tr.81
- Vấn đề: `thumb-pentomino` là hình `pentomino` của `sbt-5-5-chon`; lời giải câu dẫn cho 5.4 nói sẵn hình này không có trục, lộ một phần đáp án 5.5.
- Sửa: dùng một hình không trục khác hình 5.5.

### 27. Hình thứ nhất và thứ ba của 5.5 khác hình sách dù vẽ lại y nguyên được trên lưới (LL-15)

- Vị trí: `shapes.ts` `pentomino()`, `staircase()`; visual `sbt-5-5-chon`, `sbt-5-5-giai`
- Nguồn: tr.81, tr.118
- Vấn đề: bài kiểm tra ra đúng hình sách; hai hình này nằm trên lưới, vẽ lại đúng ô được, đổi hình thì bé luyện hình khác hình sẽ gặp. Số trục vẫn khớp (0 và 2).
- Sửa: vẽ đúng hai hình theo ô lưới của tr.81.

### 28. Tờ giấy ở 5.7 và `l57` nhỏ, viền tờ giấy nét đứt giống nét cắt (LL-12)

- Vị trí: visual `sbt-5-7-hinh`, `paper-t` (`gallery.tsx`, kiểu `paperFolded`); `$.exercises[76]`, `[75]`
- Nguồn: tr.82 (viền nét liền, nét cắt nét đứt)
- Vấn đề: mỗi tờ khoảng 55 × 110 px trên iPad (ảnh `227`), tờ của `l57` còn nhỏ hơn (ảnh `225`); viền tờ giấy và nét cắt cùng là nét đứt, bé khó phân biệt.
- Sửa: viền tờ giấy nét liền, chỉ đường cắt nét đứt; tăng cỡ hình.

## Góp ý

### 1. Bố cục app: phương án hình xếp một cột ở iPad ngang

- Vị trí: khung `choice` có `options` là `visual` (ảnh `ipad-landscape/011`, `012`)
- Nguồn: —
- Vấn đề: iPad dọc xếp 2 × 2, iPad ngang xếp dọc; đây là phần phía app của Nghiêm trọng 1.
- Sửa: báo người làm app giữ lưới 2 cột cho phương án hình ở iPad ngang. Không thay cho việc sửa Nghiêm trọng 1.

### 2. Hình của mẹo `cheo-khong-phai-truc` không vẽ đường chéo của hình chữ nhật

- Vị trí: `$.sections[2].blocks[3].visualId` = `chu-nhat-thoi-quy-tac` (ảnh 044)
- Nguồn: —
- Vấn đề: mẹo nói về đường chéo hình chữ nhật, hình chỉ vẽ hai trục.
- Sửa: hình có đường chéo hình chữ nhật nét xám mảnh, đánh dấu "không phải trục".

### 3. Câu quy tắc "Hình chữ nhật có hai trục" không nói điều kiện mà mẹo và câu ôn nói (LL-05)

- Vị trí: `$.sections[2].blocks[2].children[0].text` (`rule`), recap section và `card.chu-nhat-thoi`, "Nhắc lại" thứ nhất; so với `tip.cheo-khong-phai-truc` ("Hình chữ nhật có hai cạnh dài ngắn khác nhau…") và `$.exercises[38].prompt` (`ex.s3-on-chu-nhat-bao-nhieu`)
- Nguồn: tr.78, tr.118 (5.2)
- Vấn đề: câu quy tắc giữ cách nói của sách, còn mẹo và câu ôn thêm "hai cạnh dài ngắn khác nhau"; bài lại dạy hình vuông có 4 trục. Bài đã chọn nói "hình bình hành lệch" vì hình chữ nhật cũng là hình bình hành, nhưng chưa nói tương tự cho hình vuông. Không sai với sách, chỉ thiếu nhất quán.
- Sửa: tuỳ tác giả: thêm vào màn quy tắc một dòng "Hình vuông là trường hợp riêng: có 4 trục (section sau)", hoặc giữ nguyên.

### 4. Nhiễu yếu ở hai câu (LL-14)

- Vị trí: `$.exercises[4]` (`ex.s2-ten-duong-gap`): "Góc của hình" không phải một đường; `$.exercises[36]` (`ex.s2-on-nhieu-truc`): ba nhiễu đều mở bằng "Luôn…"
- Sửa: nhiễu gần hơn ("Đường nối hai đỉnh của hình", "Đường nằm ngang của hình"); viết nhiễu theo khuôn khác nhau.

### 5. Chữ nhỏ cần chỉnh

- `$.exercises[5].prompt[0].text` (`ex.s2-truc-cua-cong`): "gấp cánh cổng đền" nên là "gấp hình cổng đền".
- Section `quanh-ta`, `$.sections[0].blocks[0]`: hình có ngôi nhà nhưng câu note chỉ kể cánh bướm, chiếc lá, cổng đền; thêm "ngôi nhà".

### 6. Màu khái niệm trùng màu glossary của khái niệm khác

- Vị trí: `$.concepts[0]` Trục đối xứng pink, `$.concepts[1]` Điểm đối xứng teal; `content/glossary/math.json`: hình thoi, hình vuông pink; hình chữ nhật teal
- Vấn đề: trong bài này chưa lẫn trên màn (hình thoi, hình chữ nhật không tô màu khái niệm), nhưng giữa các bài một màu đang chỉ hai khái niệm.
- Sửa: chủ dự án quyết; không bắt buộc ở vòng này.

### 7. Câu đề ngôi sao đọc được hai cách

- Vị trí: `$.exercises[19].prompt[0].text` (`ex.s7-sao-nam-canh`)
- Nguồn: tr.78
- Vấn đề: "Ngôi sao năm cánh đều có các cánh giống hệt nhau" đọc được "ngôi sao năm cánh đều" hoặc "… đều có …"; câu "Mỗi trục đi qua đỉnh một cánh" gần như cho cách đếm.
- Sửa: "Ngôi sao này có năm cánh giống hệt nhau."; chuyển câu về trục sang `explain`.

### 8. "góc xiên" không phải từ bài đã dạy

- Vị trí: `$.exercises[22].explain.wrong[2].text` (`ex.s8-duong-noi-hai-diem`)
- Sửa: "…cắt d tạo góc vuông, không phải góc nghiêng khác."

### 9. `s10-tong-so-o` hỏi tổng số bước, không phải kỹ năng của section

- Vị trí: `$.exercises[28]` (`ex.s10-tong-so-o`)
- Vấn đề: đề nói hết cách làm, chỉ còn cộng 2 + 2; bé dễ hiểu nhầm "A cách A′ 4 ô".
- Sửa: hỏi "Từ chỗ chạm trục, đi dọc mấy ô để tới A′?" với số khác 5, hoặc câu chạm điểm trên lưới nhỏ.

### 10. Ba câu ôn "điểm nằm trên trục" gần như giống nhau

- Vị trí: `$.exercises[49]`, `[51]`, `[53]`
- Sửa: giữ một câu; hai câu còn lại hỏi ý khác của thẻ (trục nằm ngang ở `ve-them-hinh`, chọn điểm đúng trên lưới nghiêng ở `truc-cheo`).

### 11. Mẹo `gap-hai-lan` và recap section 11 dùng hình chạy từng bước

- Vị trí: `$.sections[10].blocks[2].visualId` (trùng hình khối đầu `gap-giay-cac-buoc`); `$.sections[10].recap.visualId` (`gap-giay-quy-tac`)
- Vấn đề: mẹo chiếu lại hình vừa xem; recap dừng ở khung đầu (chưa mở giấy) nên "Nhớ nhé!" không cho thấy nếp gấp là trục nếu bé không bấm. Mẹo đúng với mọi đầu vào đã thử: tờ 3 × 5 cắt góc có hai nếp, lỗ tròn không chạm nếp (4 lỗ), tam giác sát một nếp, tờ vuông 4 × 4 (4 trục, "ít nhất hai"), cắt góc ngoài.
- Sửa: mẹo dùng hình tĩnh tờ giấy đã mở có hai nếp được tô; recap dùng hình tĩnh khung cuối.

### 12. Câu đầu section 11 chưa nói cắt ở góc nào

- Vị trí: `$.sections[10].blocks[0].children[0].text`
- Vấn đề: cắt ở góc ngoài thì không ra chữ số 0.
- Sửa: "…ở góc có hai nếp gấp."

### 13. Nên cho thấy vì sao cách "đi ngang rồi đi dọc" đúng

- Vị trí: `$.sections[9].blocks[0]` (`cheo-cac-buoc`)
- Vấn đề: sách dựng bằng êke và compa; bé chậm nhớ lâu hơn khi thấy lý do (sau khi sửa Nghiêm trọng 6).
- Sửa: thêm khung vào hình chạy từng bước: gấp một ô vuông theo đường chéo, cạnh ngang chồng lên cạnh dọc.

### 14. Vùng chạm bảng lưới trên điện thoại hơi nhỏ (bố cục app)

- Vị trí: `diem-cung-lam`, `diem-tap-lam`, `ve-cung-lam`, `ve-tap-lam`, `cheo-cung-lam`, `cheo-tap-lam`
- Vấn đề: ô 48 px ở khung 336 px, điểm chạm hơi dưới 48 px; walk không báo lỗi. Báo người làm app, không chặn bài.

### 15. Tách 5.6 thành a, b, c và 5.8 thành a, b: chấp nhận

- Vị trí: `ex.sbt-5-6a`, `-6b`, `-6c`, `ex.sbt-5-8a`, `-8b`
- Nguồn: tr.82
- Vấn đề: mỗi câu giữ nguyên lời sách và thêm dòng nêu hình nào; không coi là `bookRef` sách không có.
- Sửa: tuỳ chọn, gọi 5.8 là "hình nằm dưới/trên trục d" thay "chiếc lá" vì hình vẽ lại không giống lá.

### 16. 5.10 chỉ chấm số cách ghép: chấp nhận

- Vị trí: `$.exercises[89]`
- Vấn đề: phần "ghép" không chấm được; chấp nhận khi lời giải nấc 3 hiện đủ 10 số (Nên sửa 21).
- Sửa: tuỳ chọn, thêm câu dẫn `choice` `multiple` "chọn các số ghép được có trục đối xứng" với thẻ khác sách.

### 17. `l53b-so-mot`: "gấp nét thẳng đứng theo chính nó" trừu tượng

- Vị trí: `$.exercises[63]`
- Sửa: thêm hình thẻ số 1 (hình chữ nhật dài) có hai trục.

### 18. Recap section sách chỉ nhắc quy tắc chữ cái (LL-06)

- Vị trí: `$.sections[11].recap`
- Vấn đề: section ôn mười bài nhưng recap chỉ nhắc quy tắc của 5.3, 5.4.
- Sửa: câu chung hơn, ví dụ quy tắc gấp hình theo d của section `truc-doi-xung`.

### 19. Khung chọn chữ ở 5.3 chồng lên chữ bên cạnh

- Vị trí: visual `sbt-5-3-chu` (ảnh `200`)
- Sửa: giãn khoảng cách giữa các chữ hay làm khung mảnh hơn.

### 20. `l51-nam-canh` hỏi hình đều năm cạnh, sách không có

- Vị trí: `$.exercises[56]` (`ex.l51-nam-canh`)
- Nguồn: tr.78, tr.80
- Vấn đề: suy ra từ mẹo `dem-truc-hinh-deu` (giả định 3); chấp nhận nếu giữ mẹo, nhưng nếu thu hẹp mẹo theo Nên sửa 7 thì câu này phải đổi theo.
- Sửa: tuỳ chọn, dùng hình vẽ để bé đếm thay vì chỉ có chữ.

## Ghi chú cho tác giả

- Nghiêm trọng 6 phải sửa cùng lúc khối "Nhắc lại" ở section sách để note, recap và "Nhắc lại" giữ nguyên văn.
- Sửa Nghiêm trọng 2, 4, 8 thì soát cả bài tìm mọi `explain`, `wrong` cùng lập luận ("đường chéo không phải trục", "… bằng nhau nên có … trục", "không phải nếp gấp nên không phải trục").
- Đã soát, đạt: câu `note` quy tắc section 2, 3, 4, 5, 6, 8, 9, 11 khớp recap section và recap thẻ; khối "Nhắc lại" chép đúng các câu quy tắc; không có phủ định kép; mọi câu `multiple: true` có "Chọn tất cả"; mẹo `cheo-khong-phai-truc`, `dem-truc-hinh-deu`, `dem-o-tu-truc`, `gap-hai-lan` đúng với mọi đầu vào đã thử.
