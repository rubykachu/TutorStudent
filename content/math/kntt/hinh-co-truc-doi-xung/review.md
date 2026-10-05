# Review: Hình có trục đối xứng (`hinh-co-truc-doi-xung`)

- Bài: `content/math/kntt/hinh-co-truc-doi-xung/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/hinh-co-truc-doi-xung/` - sbt-p78, sbt-p79, sbt-p80, sbt-p81, sbt-p82, sbt-p83, sbt-p118, sbt-p119
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- Đọc hiểu (Haiku, lượt 1): chưa chạy, sau vòng toàn bài
- `lesson:walk`: 0 FAIL, 0 cảnh báo trên iPad dọc, iPad ngang, điện thoại; `visual:shot` 236/236; ảnh trong `.shots/walk/hinh-co-truc-doi-xung/`
- Kết luận: Chưa đạt: còn 3 lỗi Nghiêm trọng
- Bản đã review: `6a3065039151f07279555b696b5e1ec2eab141e9e84d09693760bf7a44270c9e` (`pnpm content:diff` so với bản này)

Đáp án của mọi câu và mọi câu sách khớp lời giải tr.118, tr.119; bài đủ 16 `bookRef`, đề câu sách khớp nguyên văn ảnh. Cả ba lỗi Nghiêm trọng nằm ở lời giải thích: một sự thật đời sống sai và hai lý do `wrong` dạy quy tắc sai mà vòng 1 đã yêu cầu tìm và bỏ trong cả bài.

## Nghiêm trọng

### 1. "Mặt trống đồng" được nói là gấp theo đường nào qua tâm cũng khít, sai với mặt trống đồng thật (LL-17)

- Vị trí: `$.exercises[2].options[0]`, `$.exercises[2].explain.text` (`ex.s1-vat-gap-doi`); `$.exercises[35].explain.text` (`ex.s1-on-cham`); nhãn vùng `mat-trong` của visual `cham-gap-doi`
- Nguồn: —
- Vấn đề: mặt trống đồng Đông Sơn (bé gặp ở môn Lịch sử lớp 6) có vòng chim Lạc bay cùng một chiều quanh tâm. Gấp theo một đường qua tâm thì chim ở hai nửa quay ngược chiều nhau, nên hai nửa không giống hệt nhau. Câu sai là đáp án đúng và lời giải thích của câu luyện đầu tiên, nơi bé được dặn phải tin.
- Sửa: thay bằng một vật tròn trơn bé thấy hằng ngày, ví dụ "Chiếc gương tròn" hay "Miệng cốc tròn", ở lựa chọn, `explain` của cả hai câu và nhãn vùng `mat-trong` của `cham-gap-doi`. Giữ ý "gấp theo đường nào qua tâm cũng khít".

### 2. Lý do `wrong` của `s11-on-nep-gap` vẫn dạy "không phải nếp gấp nên không phải trục" (LL-17, LL-20)

- Vị trí: `$.exercises[54].explain.wrong[0].text` (`ex.s11-on-nep-gap`, lựa chọn `canh`): "Cạnh của tờ giấy không phải nếp gấp, nên không chia hình cắt thành hai nửa giống nhau."
- Nguồn: tr.80 ví dụ 3
- Vấn đề: vòng 1 (Nghiêm trọng 8) đã chỉ ra lập luận này sai: chính bài có trục không phải nếp gấp (hai đường chéo hình thoi ở section `chu-nhat-thoi`, trục nằm ngang của hình thoi ở `gap-giay-quy-tac`). Bản sửa bỏ lựa chọn "Đường chéo" nhưng giữ đúng lập luận ở lựa chọn còn lại. Kết luận đúng, lý do sai: bé học "đường nào không phải nếp gấp thì không là trục".
- Sửa: "Cả hình cắt nằm về một bên cạnh tờ giấy, nên gấp theo cạnh đó thì hai nửa không chồng khít." (cùng ý `wrong` lựa chọn `canh` của `ex.s11-truc-sau-khi-mo`).

### 3. `s9-buoc-dau`: lý do `wrong` "Đường chéo không phải trục d của hình" trái section `chu-nhat-thoi` và `truc-cheo`; hai lý do khác lệch lựa chọn (LL-17, LL-20)

- Vị trí: `$.exercises[26].explain.wrong[2].text` (`ex.s9-buoc-dau`, lựa chọn `cheo` "Gấp hình theo đường chéo"): "Đường chéo không phải trục d của hình, nên không dùng để vẽ."; lựa chọn `to` "Nối các đỉnh đã có rồi mới tìm điểm đối xứng" với `wrong` "…vì chưa có điểm thì chưa nối được"; `wrong` của `do` "điểm đối xứng tìm bằng cách đếm ô"
- Nguồn: —
- Vấn đề: câu nói như một quy tắc chung rằng đường chéo không phải trục d, trong khi hai đường chéo hình thoi là trục (section `chu-nhat-thoi`) và section `truc-cheo` ngay sau dạy "trục d đi theo đường chéo của các ô vuông". Vòng 1 (Ghi chú cho tác giả) đã yêu cầu soát cả bài tìm lập luận "đường chéo không phải trục"; câu này bị sót. Thêm nữa: các đỉnh đã có thì đã nối sẵn (nửa hình cho trước), nên lý do của `to` không trả lời đúng lựa chọn; "tìm bằng cách đếm ô" chỉ đúng trên lưới, còn section `diem-doi-xung` dạy dựng bằng thước và compa.
- Sửa: `cheo`: "Hình đã có sẵn trục d, không cần gấp để tìm trục. Việc đầu tiên là tìm điểm đối xứng của từng đỉnh."; `to`: "Các đỉnh đã có đã được nối sẵn; phần còn thiếu là các điểm đối xứng, nên phải tìm chúng trước." (hoặc đổi lựa chọn thành "Nối các điểm đối xứng trước rồi mới tìm chúng"); `do`: "…tìm bằng cách đếm ô trên lưới, hoặc dựng bằng thước và compa." Sau khi sửa, tìm "đường chéo" trong mọi `explain`, `wrong`, `done` của cả bài và `visuals.ts`.

## Nên sửa

### 1. Câu của thẻ `quanh-ta` vẫn lặp hình của màn dạy và của nhau (LL-07)

- Vị trí: `$.exercises[0]` (`ex.s1-chon-hinh-gap-doi`: cánh bướm, cổng đền, hình bình hành, tam giác lệch), `[2]` (`ex.s1-vat-gap-doi`), `[34]` (`ex.s1-on-la`), `[35]` (`ex.s1-on-cham`)
- Nguồn: —
- Vấn đề: vòng 1 (Nên sửa 2) mới sửa một phần. Câu kiểm tra đầu dùng ba trong bốn thẻ của màn "Cùng làm" `gap-doi-vat` vừa gấp (ảnh `008`, `009`), nên bé chỉ nhớ lại kết quả. Đám mây lệch là nhiễu ở ba câu; mặt trống đồng là đáp án của câu luyện và câu ôn `s1-on-cham`; ngôi nhà (`s1-on-cham`) và chiếc lá (`s1-on-la`) là hình của màn dạy.
- Sửa: `s1-chon-hinh-gap-doi` dùng hình chưa xuất hiện ở bài, ví dụ chiếc kéo mở, mặt nạ; không dùng con diều (hình mở đầu section `chu-nhat-thoi`) hay chữ cái của SBT 5.3 (A B H M N X Y Z) để khỏi lộ đáp án sau. Mỗi câu ôn một bộ hình riêng, không trùng đáp án hay nhiễu với câu luyện, và khác các đồ vật mới chọn cho Nên sửa 8 và Góp ý 11.

### 2. Chữ "d" vừa là tên trục đối xứng vừa là tên một đường không phải trục trong các bảng chọn đường (LL-21, LL-05)

- Vị trí: màn quy tắc section `truc-doi-xung` (`$.sections[1].blocks[0..1]`, `truc-nha-cac-buoc`, `truc-nha-quy-tac`: "Đường d là trục đối xứng"), rồi ngay sau là `gap-thu-ngoi-nha` (`$.sections[1].blocks[2]`, `lines: [axis(0), fake(0), fake(2), fake(1)]`: trục mang tên "a", đường lệch giữa mang tên "d", ảnh `029`, `030`); `lines-butterfly`, `lines-gate` (`ex.s2-duong-nao-la-truc`, `ex.s2-truc-cua-cong`: "d" là đường xiên); `gap-giay-cung-lam` (`$.sections[10].blocks[3]`, ảnh `163`, `164`: "d" là đường chéo tờ giấy). Cùng kiểu, đường thứ tư là đường giả ở `chu-nhat-gap-thu`, `thoi-gap-thu`, `thang-can-gap-thu`, `binh-hanh-gap-thu`, `chon-truc-cong`, `chon-truc-la`, hình thoi của `sbt-5-2-chon` (`src/visuals/math/hinh-co-truc-doi-xung/visuals.ts`)
- Nguồn: —
- Vấn đề: câu quy tắc section 2 và các section 8, 9, 10 cùng "Nhắc lại" luôn gọi trục là "d". Hai màn liền nhau trên cùng ngôi nhà: màn trước dạy "d là trục", màn sau chạm "d" thì gấp lệch; ở section 11, bé quen "d là trục" dễ chạm d. Vòng 1 (Nghiêm trọng 3) sửa phần gợi ý nhưng xung đột chữ "d" còn nguyên.
- Sửa: một luật cho mọi bảng chọn đường của bài: không dùng nhãn "d" cho đường không phải trục. Cách gọn nhất là đổi bộ nhãn của bảng chọn đường thành a, b, c, e (hoặc 1, 2, 3, 4) ở một chỗ dùng chung, rồi sửa chữ "Đường d" trong lựa chọn, `answer`, `explain` của các câu đi kèm. Nếu giữ a, b, c, d thì đặt trục ở vị trí thứ tư ở `gap-thu-ngoi-nha` (`lines: [fake(0), fake(2), fake(1), axis(0)]`) và soát từng hình trong danh sách trên. Làm cùng lúc với Góp ý 2.

### 3. `s2-on-nhieu-truc`: nhiễu viết lại theo góp ý vòng 1 đọc được thành đúng (LL-10, LL-20)

- Vị trí: `$.exercises[36].options[2]` ("Đúng hai trục, không hơn không kém", `ex.s2-on-nhieu-truc`) và `$.exercises[36].explain.wrong[1]`
- Nguồn: —
- Vấn đề: đề hỏi "Một hình có thể có bao nhiêu trục đối xứng?". Lựa chọn này không có "hình nào cũng" như hai nhiễu kia, nên đọc được là "một hình có thể có đúng hai trục", đúng với hình chữ nhật. Lý do `wrong` lại nói "không phải hình nào cũng có hai trục", ý mà lựa chọn không nói. Sinh từ bản sửa Góp ý 4 vòng 1.
- Sửa: "Hình nào cũng có đúng hai trục".

### 4. `s4-on-ghep-so-truc` hỏi "Hình bình hành lệch" bằng chữ, không có hình (LL-10)

- Vị trí: `$.exercises[40].left[1]` (`ex.s4-on-ghep-so-truc`)
- Nguồn: tr.118 (5.2: "không có trục đối xứng" ghi dưới hình vẽ cụ thể)
- Vấn đề: "lệch" chỉ được định nghĩa bằng "như trong hình" (câu quy tắc section 4). Câu ôn chỉ có chữ, bé không có hình để biết "lệch" là thế nào, và hình chữ nhật cũng là hình bình hành.
- Sửa: cột trái dùng hình (`thumb-trapezoid`, `thumb-parallelogram`, `thumb-rectangle`) thay chữ, hoặc thêm một hình đề có ba hình gắn nhãn.

### 5. Hình gợi ý `goi-y-gap-thu` nói "đường đã cho" ở câu không cho đường nào (LL-15)

- Vị trí: `$.exercises[2].hints.hintVisualId` (`ex.s1-vat-gap-doi`, lựa chọn chữ), `$.exercises[11].hints.hintVisualId` (`ex.s4-chon-hinh-co-truc`, bốn hình không có đường); khung đầu của `goi-y-gap-thu` "Thử gấp hình theo đường đã cho." (ảnh `021`)
- Nguồn: —
- Vấn đề: hai câu này không có đường nào cho sẵn; bé đọc gợi ý sẽ đi tìm "đường đã cho" mà không thấy.
- Sửa: chú thích chung hơn, ví dụ "Thử gấp đôi hình theo một đường thẳng." (vẫn dùng được cho `s2-duong-nao-la-truc`), hoặc thêm một biến thể có chú thích riêng cho câu không có đường.

### 6. Trục nằm ngang chỉ được dạy trong một khối mẹo gắn nhãn "làm nhanh"

- Vị trí: `$.sections[8].blocks[2]` (`tip.dem-o-tu-truc`, `kind: "làm nhanh"`, tiêu đề "Trục d nằm ngang"); dùng cho `ex.s9-on-hang-cua-diem` (`$.exercises[50]`) và SBT 5.6c
- Nguồn: tr.82 (5.6, hình thứ ba có trục nằm ngang)
- Vấn đề: vòng 1 (Nên sửa 14) đã ghi mẹo cũ chỉ nhắc lại cách dạy. Bản sửa đổi mẹo thành cách tìm điểm đối xứng khi trục nằm ngang: kiến thức mới (không màn nào khác dạy), không phải cách làm nhanh hơn. Nhãn `kind` sai, và kiến thức bé cần cho câu ôn và 5.6c nằm trong khối mẹo dễ bị lướt. Mẹo đúng với mọi đầu vào đã thử (hàng 0 → 6, 1 → 5, 2 → 4, 3 → chính nó, 7 → −1, trục ở hàng 3).
- Sửa: chuyển nội dung thành một màn dạy của section `ve-them-hinh` (note thường cùng hình `diem-dem-o-ngang`, đặt trước "Cùng làm"); nếu giữ là mẹo thì đổi `kind` sang "hiểu nhanh" và thêm một câu nói đây là cách đếm của section `diem-doi-xung` xoay ngang.

### 7. Câu của thẻ `chu-cai-chu-so` lặp chữ giữa các tầng và lộ đáp án 5.3 (LL-07)

- Vị trí: `$.exercises[16]` (`ex.s6-chu-f-bao-nhieu`, F) và `$.exercises[44]` (`ex.s6-on-chu-hai-truc`, lựa chọn F, C, O, Z); `$.exercises[45]` (`ex.s6-on-chu-c-truc`, C nằm ngang); `$.exercises[17]` (`ex.s6-cham-chu-mot-truc`, `explain` "Chữ O có hai trục")
- Nguồn: tr.81 (5.3: A B H M N X Y Z 0 2 3 8 9), tr.118
- Vấn đề: vòng 1 (Nên sửa 9) yêu cầu mỗi tầng một bộ chữ riêng. Câu ôn còn lặp đáp án câu kiểm tra (F), hai câu ôn của cùng thẻ lặp nhau (C), câu ôn lặp câu luyện (O). Glyph O (`glyphs.ts`) gần như trùng glyph chữ số 0 của 5.3, nên "O có hai trục" là đáp án 5.3b; Z là chữ của 5.3.
- Sửa: câu ôn dùng chữ chưa xuất hiện ở màn dạy, câu kiểm tra, câu luyện, 5.3 và đáp án 5.7 (V, M, O), ví dụ S, J, G không trục, D một trục nếu `l53a` không dùng; bỏ C khỏi `s6-on-chu-hai-truc` hoặc đổi `s6-on-chu-c-truc` sang chữ khác; thay O bằng chữ hai trục không giống chữ số của 5.3, hoặc đổi câu sang hỏi "đúng một trục".

### 8. Câu của section `do-vat-bieu-tuong` không hỏi đồ vật, biểu tượng vừa dạy; câu ôn lặp đáp án câu kiểm tra (LL-07)

- Vị trí: `$.exercises[18]` (`ex.s7-khong-co-truc`: cánh bướm, chiếc lá, tam giác lệch, ngôi nhà), `$.exercises[20]` (`ex.s7-mot-truc`: cổng đền, ngôi nhà, hình chữ nhật, ngôi sao), `$.exercises[47]` (`ex.s7-on-khong-truc`: tam giác lệch, hình bình hành lệch, chiếc lá, dấu cộng)
- Nguồn: tr.78 (H.5.1), tr.81 (5.4)
- Vấn đề: màn dạy là biển báo cấm, trái tim, mũi tên, đám mây lệch, nhưng không câu nào hỏi chúng; ba câu dùng lại hình của section `quanh-ta`. Tam giác lệch là đáp án "không có trục" ở `s7-khong-co-truc`, `s7-on-khong-truc`, `s1-chon-hinh-gap-doi` và `l54-co-truc`. Bé trả lời bằng trí nhớ, câu không đo được ý "tưởng tượng gấp đôi đồ vật".
- Sửa: câu kiểm tra và câu luyện dùng đồ vật, biểu tượng khác màn dạy, khác 5.4 và khác hình mới chọn cho Nên sửa 1 và Góp ý 11 (ví dụ lá cờ, chiếc ô, biển báo tam giác, mặt đồng hồ); câu ôn đổi đáp án "không trục" sang hình khác tam giác lệch.

### 9. Hình quy tắc và recap section `do-vat-bieu-tuong` không minh hoạ câu quy tắc (LL-15)

- Vị trí: `$.sections[6].blocks[1].children[1]`, `$.sections[6].recap`, `$.cards[6].recap` (visual `so-truc-tong-hop`)
- Nguồn: —
- Vấn đề: câu quy tắc (sau vòng 1) nói "Muốn biết đồ vật có trục không, hãy tưởng tượng gấp đôi nó…", nhưng hình là bảng số trục của hình bình hành, thang cân, chữ nhật, dấu cộng, lục giác đều, hình tròn (hình của section 3 đến 5): không có đồ vật nào, không có bước gấp. Màn "Nhớ nhé!" cho bé nhớ một bảng không khớp câu (ảnh `099-s7-02-block`, `106-s7-06-recap`). Vòng 1 (Nên sửa 10) đổi câu mà chưa đổi hình.
- Sửa: hình quy tắc gồm hai, ba đồ vật của màn dạy kèm trục (trái tim một trục, biển cấm hai trục, đám mây lệch không trục), hoặc một hình gấp đôi một đồ vật; giữ `so-truc-tong-hop` cho khối "Nhắc lại" của section sách.

### 10. Hai chỗ nói "chỗ đường tròn cắt đường thẳng" mà không nói "khác A" (LL-10)

- Vị trí: `$.exercises[23].items[2].content.text` (`ex.s8-xep-buoc-dung`, "Lấy chỗ đường tròn cắt đường thẳng vừa dựng, đó là A′"); khung cuối `POINT_STEPS` (`diem-cac-buoc`: "Đường tròn cắt đường thẳng vừa dựng tại A′.")
- Nguồn: tr.79 ("cắt lại b tại A′ khác A")
- Vấn đề: đường tròn tâm O bán kính OA cắt đường thẳng tại hai điểm, một điểm là A. Bé đọc theo chữ có thể lấy chính A. `explain` đã nói "cắt lại", mục cần xếp và hình chạy từng bước thì không.
- Sửa: "Lấy chỗ thứ hai đường tròn cắt đường thẳng (khác A), đó là A′"; khung cuối: "Đường tròn cắt lại đường thẳng tại A′, khác A."

### 11. 5.9a: bảng "xem đáp án" vẫn hiện lời giải lạ, trái `explain` và hình nấc 3 (LL-27)

- Vị trí: `$.exercises[82]` (`ex.sbt-5-9a`); `src/visuals/math/hinh-co-truc-doi-xung/logic.ts` (`solutions[VALIDATOR_EDGES]` gọi `solveEdges`), `edges.ts` `solveEdges`; ảnh `ipad/240-s12-31-exercise-sbt-5-9a-correct.png`
- Nguồn: tr.119 hình 5.9a
- Vấn đề: vòng 1 (Nên sửa 19) mới đổi hình nấc 3 (`sbt-5-9a-giai`, nay là chữ L đúng sách). Bảng trả lời khi lộ đáp án vẫn lấy cách đầu tiên của `solveEdges`: (0,1)→(0,2)→(1,2)→(1,1)→(2,1), ra ô vuông kèm hai móc, trục "/". Ngay dưới, `explain` nói "hình chữ L" và hình nấc 3 vẽ chữ L có trục "\". Bé thấy hai đáp án khác nhau cho một câu.
- Sửa: lời giải "xem đáp án" của bài vẽ đường gấp khúc ưu tiên đường nối hai đầu của hình cho sẵn (trong `solveEdges`: thử trước các đường đi từ một đầu và dừng ở đầu kia). Với bảng hiện có, quy tắc này cho đúng lời giải sách ở 5.9a, b, c và đúng `explain` của `l59b-dan`, `l59c-dan`. Thêm test: lời giải "xem đáp án" của 5.9a, 5.9b trùng `path` của `sbt-5-9a-giai`, `sbt-5-9b-giai`.

### 12. 5.10: câu dẫn mới không còn dạy "số không bắt đầu bằng 0", `explain` cũng không nói (LL-20)

- Vị trí: `$.exercises[87]` (`ex.l510-ba-the`), `$.exercises[89].explain.text` (`ex.sbt-5-10`)
- Nguồn: tr.83, tr.119
- Vấn đề: bản cũ của `l510-ba-the` có bước "số 0 ở đầu không phải số có ba chữ số"; bản mới đếm cả 6 cách xếp H, X, E. Làm theo cách vừa học, bé đếm 6 cách xếp 0, 1, 8 cộng 6 số có 2 và 5, ra 12. `explain` của 5.10 liệt kê 108, 180, 801, 810 nhưng không nói vì sao 018, 081 không tính.
- Sửa: thêm vào `explain` của 5.10: "Ba thẻ 0, 1, 8 xếp được 6 cách, nhưng 018 và 081 có số 0 đứng đầu nên không phải số có ba chữ số, còn 4 số." Không đổi câu dẫn sang thẻ của sách.

### 13. Câu dẫn hỏi đúng hình mà bài vừa cho xem kèm đáp án; recap section `gap-giay` dùng chính hình đó (LL-07)

- Vị trí: `$.exercises[67]` (`ex.l55-dau-cong`, hình `chon-truc-dau-cong`); `$.exercises[75]` (`ex.l57-hinh-thoi`, tờ `t`); visual `gap-giay-quy-tac` (tờ `t`, khung cuối "Được hình thoi…") ở `$.sections[11].blocks[3]`, `$.sections[10].recap`, `$.cards[10].recap`
- Nguồn: —
- Vấn đề: `l55-dau-cong` hỏi số trục dấu cộng bốn cánh, mà hình đó đã hiện "4 trục" ở khối "Nhắc lại" thứ nhất (`so-truc-tong-hop`, ảnh `173`), nấc 2 của 5.1 (ảnh `182`) và lời giải 5.4 ngay trước. `l57-hinh-thoi` hỏi tờ `t` cắt tam giác mở ra hình gì, mà khối "Nhắc lại" thứ tư (ảnh `177`), recap section `gap-giay` và recap thẻ vừa chạy hình đó và ghi "Được hình thoi". Recap section `gap-giay` cũng khác hình của câu quy tắc (`gap-giay-lo`). Bé chỉ nhớ lại, câu dẫn không luyện được việc tự gấp thử trước 5.5 và 5.7.
- Sửa: `l55-dau-cong` dùng hình chưa xuất hiện kèm số trục (ví dụ chữ thập có cánh dài, ngắn khác nhau từng cặp, hai trục). Đổi hình của recap section `gap-giay`, recap thẻ và khối "Nhắc lại" thứ tư sang `gap-giay-lo` (hình của câu quy tắc); hoặc giữ `gap-giay-quy-tac` và cho `l57-hinh-thoi` dùng tờ giấy cắt hình khác tờ `t` (ví dụ nửa hình tròn sát nếp, mở ra hình tròn).

### 14. `l510-hai-nam`: hình xếp sẵn b d H ngay trên câu hỏi vị trí của H (LL-10)

- Vị trí: `$.exercises[88].prompt[1]` (visual `l510-the`), `prompt[2]` (`ex.l510-hai-nam`); ảnh `ipad/251-s12-37-exercise-l510-hai-nam.png`
- Nguồn: —
- Vấn đề: đề bảo xếp ba thẻ thành dãy có trục thẳng đứng, rồi hiện ba thẻ đã nằm thành hàng b, d, H, rồi hỏi "Thẻ H đứng ở vị trí thứ mấy". Bé nhìn hàng trên màn và trả lời 3. Đề đọc được hai cách.
- Sửa: "Trong dãy có trục đối xứng, thẻ H đứng ở vị trí thứ mấy, đếm từ trái sang phải?", và hình ghi "Ba thẻ chưa xếp" hoặc vẽ ba thẻ rời, không thành một hàng.

### 15. Khối "Nhắc lại" thứ tư có một câu quy tắc không section nào dạy, là cách nói thứ ba của ý "gấp khít thì là trục" (LL-05)

- Vị trí: `$.sections[11].blocks[3].children[2].text` (`bai-tap-sach-bai-tap`): "Gấp chữ hay chữ số theo đường thẳng đứng hoặc nằm ngang, hai nửa chồng khít thì đường đó là trục."
- Nguồn: —
- Vấn đề: các khối "Nhắc lại" khác chép nguyên văn câu quy tắc của section. Câu này không là câu quy tắc của section nào: nó trộn câu quy tắc section `truc-doi-xung` ("Gấp hình theo đường thẳng d, nếu hai nửa chồng khít nhau thì d là trục đối xứng") với câu section `chu-cai-chu-so`, cạnh câu section `do-vat-bieu-tuong` ("…tưởng tượng gấp đôi nó: hai nửa chồng khít thì có trục"). Bé gặp ba cách nói cho một ý ngay trước câu sách.
- Sửa: thay bằng nguyên văn câu quy tắc section `truc-doi-xung` (cũng là recap của section sách), hoặc câu quy tắc section `chu-cai-chu-so`.

## Góp ý

### 1. Recap section `quanh-ta` thiếu ngôi nhà sau khi note thêm ngôi nhà (LL-06)

- Vị trí: `$.sections[0].recap.caption`, `$.cards[0].recap.caption`: "Cánh bướm, chiếc lá và cổng đền gấp đôi được…"; note `$.sections[0].blocks[0].children[0].text` và hình `quanh-ta` có cả ngôi nhà
- Nguồn: —
- Vấn đề: vòng 1 (Góp ý 5) thêm ngôi nhà vào note nhưng recap chưa đổi theo.
- Sửa: "Cánh bướm, chiếc lá, cổng đền và ngôi nhà gấp đôi được: hai nửa chồng khít nhau."

### 2. Câu kiểm tra và câu luyện section `truc-doi-xung` cùng khuôn đường và cùng đáp án "c" (LL-07, LL-14)

- Vị trí: `lines-butterfly`, `lines-gate` (cùng `[fake(0), fake(1), axis(0), fake(2)]`); `ex.s2-duong-nao-la-truc`, `ex.s2-truc-cua-cong`
- Nguồn: —
- Vấn đề: a ngang, b lệch, c trục, d xiên ở cả hai; bé làm đúng câu trước rồi chọn "c" ở câu sau mà không cần gấp.
- Sửa: đổi thứ tự đường ở một trong hai hình (làm cùng Nên sửa 2, không đặt đường giả ở nhãn "d").

### 3. Câu kho ôn của thẻ `truc-doi-xung` giải thích bằng hình của section sau (LL-09)

- Vị trí: `$.exercises[36].explain` (`ex.s2-on-nhieu-truc`): "hình vuông có nhiều trục", `wrong` "Hình vuông có bốn trục", "Hình thang cân chỉ có một trục", "Hình bình hành lệch không có trục"
- Nguồn: —
- Vấn đề: phiên ôn của thẻ section 2 có thể đến trước khi bé học section 4, 5. Đáp án không cần các ý đó, chỉ lời giải dùng.
- Sửa: dùng hình đã có ở section 1, 2: đám mây lệch (không trục), ngôi nhà (một trục); câu "nhiều trục" nói "nhiều trục" mà không nêu tên hình chưa học.

### 4. Giải thích số trục của hình đều nói cách khác mẹo (LL-05)

- Vị trí: `$.exercises[12].explain.text` (`ex.s5-luc-giac-bao-nhieu`), `$.exercises[42].explain.text` (`ex.s5-on-tam-giac-bao-nhieu`): "… cạnh bằng nhau và … góc bằng nhau, nên có … trục"; mẹo `tip.dem-truc-hinh-deu` chỉ nói cho ba hình, đếm cạnh
- Nguồn: —
- Vấn đề: đúng kiến thức, nhưng là quy tắc chung mà vòng 1 (Nên sửa 7) đã thu hẹp khỏi mẹo; bé gặp hai cách nói cho một ý.
- Sửa: "Hình lục giác đều có 6 cạnh, nên có 6 trục đối xứng, như ở màn quy tắc." (cùng khuôn với mẹo).

### 5. Hình gợi ý `goi-y-gap-sai` gần như cho sẵn kết luận "gấp theo đường nghiêng thì lệch"

- Vị trí: `hintVisualId` của `ex.s3-truc-chu-nhat`, `ex.s3-chon-truc-thoi`, `ex.s4-binh-hanh-gap-cheo`, `ex.s3-on-cua-cheo`, `ex.s4-on-truc-thang-can`
- Nguồn: —
- Vấn đề: hình khác đề nên không trái luật nấc 2, nhưng chạy hết tới "hai nửa không chồng khít" ở một đường nghiêng; bé dễ rút ra "đường nghiêng không phải trục", trái hai trục nghiêng của tam giác đều và hai đường chéo hình thoi.
- Sửa: dừng ở khung "Nhìn mép của hai nửa: có trùng nhau không?" như `goi-y-gap-thu`, hoặc chú thích rõ "chiếc lá này".

### 6. Nấc 1 của `s3-truc-chu-nhat` tô câu đề thay vì hình có các đường

- Vị trí: `$.exercises[6].hints.highlight[0]` (`target: "block", index: 0`)
- Nguồn: —
- Vấn đề: lỗi hay gặp là chọn đường chéo trong hình (khối 1); `s2-duong-nao-la-truc` đã tô khối hình.
- Sửa: `index: 1`.

### 7. Ba câu nói "đường chéo của hình chữ nhật không phải trục" mà bỏ điều kiện của mẹo (LL-05)

- Vị trí: `done` của visual `chu-nhat-gap-thu` ("Hình chữ nhật có hai trục. Đường chéo không phải trục."), `$.exercises[7].explain.wrong[0].text` (`ex.s3-cheo-thoi`: "Đường chéo của hình chữ nhật không phải trục…"), `$.exercises[39].explain.text` (`ex.s3-on-cua-cheo`: "Đường chéo không phải trục của hình chữ nhật.")
- Nguồn: —
- Vấn đề: mẹo `cheo-khong-phai-truc` cùng section nói đúng điều kiện "hình chữ nhật có hai cạnh dài ngắn khác nhau"; ba câu này nói như quy tắc chung, sai với hình vuông (section `hinh-deu` cho hình vuông bốn trục, gồm hai đường chéo). Hình vẽ đều là hình chữ nhật dài, nên không sai với hình bé thấy.
- Sửa: nói về hình đang thấy: "Đường chéo của hình chữ nhật này không phải trục." hay "Cánh cửa dài hơn rộng, nên đường chéo không phải trục."

### 8. `s7-khong-co-truc`: giải thích chỉ xét nếp gấp thẳng đứng

- Vị trí: `$.exercises[18].explain.text` ("Tam giác có ba cạnh khác nhau nên nửa trái khác nửa phải.")
- Nguồn: —
- Vấn đề: bé có thể nghĩ chỉ cần thử gấp đứng.
- Sửa: "Tam giác có ba cạnh dài khác nhau: gấp theo đường nào thì hai nửa cũng không chồng khít."

### 9. Câu mở section `do-vat-bieu-tuong` không nói điều gì bé dùng được

- Vị trí: `$.sections[6].blocks[0].children[0].text` ("Biển báo, hình trái tim, mũi tên và đám mây có nhiều kiểu hình.")
- Nguồn: —
- Vấn đề: câu không đặt câu hỏi cho màn "Cùng làm" ngay sau.
- Sửa: "Biển báo, trái tim, mũi tên, đám mây quanh ta: cái nào có trục đối xứng, có mấy trục?"

### 10. Màn "Cùng làm" section `diem-doi-xung` dùng đúng hai điểm của hình quy tắc vừa xem

- Vị trí: `POINTS_RULE` và `POINTS_GUIDED` trong `boards.ts` (cùng A (1; 1), B (2; 3), trục cột 3); ảnh `110`, `111`
- Nguồn: —
- Vấn đề: hình quy tắc đã hiện A′, B′ ngay màn trước, nên "Cùng làm" chỉ chép lại.
- Sửa: dời A, B của `POINTS_GUIDED` sang chỗ khác (ví dụ A (0; 1), B (2; 4)).

### 11. `l54-co-truc` lặp hình vừa hỏi (LL-07)

- Vị trí: `$.exercises[65]` (`ex.l54-co-truc`)
- Nguồn: —
- Vấn đề: cổng đền và chiếc lá vừa được chọn trục ở `l52-cong`, `l52-la` hai câu trước; `thumb-scalene` đã dùng ở `s1-chon-hinh-gap-doi`, `s7-khong-co-truc`, `s7-on-khong-truc`.
- Sửa: tuỳ chọn, dùng đồ vật mới cùng kỹ năng, khác các hình mới chọn cho Nên sửa 1 và 8.

### 12. Khối "Nhắc lại" thứ nhất cho sẵn gần trọn đáp án 5.1 và 5.2

- Vị trí: `$.sections[11].blocks[0]` (chữ quy tắc và hình `so-truc-tong-hop`)
- Nguồn: tr.80, tr.118
- Vấn đề: câu nhắc nêu đúng bốn số trục của 5.1; hình vẽ đúng hình bình hành, hình thang cân, hình chữ nhật của 5.2 kèm trục. Là quy tắc của bài nên chấp nhận được, nhưng 5.2 thành việc chép hình vừa xem.
- Sửa: tuỳ tác giả: hình của khối nhắc dùng hình khác 5.2 (chỉ dấu cộng, lục giác đều, hình tròn), giữ chữ quy tắc.

### 13. 5.5: "Hình bên trái" khi hình xếp hai cột

- Vị trí: `$.exercises[68].explain.text` (`ex.sbt-5-5`); ảnh `ipad/211`, `phone/211`
- Nguồn: —
- Vấn đề: trên màn, hình tám ô và hình bốn ô xếp chéo cùng nằm cột trái. Câu sau gọi tên hình bốn ô nên vẫn đoán ra được.
- Sửa: "Hình tám ô vuông lệch không có trục."

### 14. Tờ giấy c của 5.7 vẫn nhỏ (LL-12)

- Vị trí: visual `sbt-5-7-hinh` (tờ `o`); ảnh `ipad/227`, `phone/227`
- Nguồn: —
- Vấn đề: viền nét liền đã sửa (vòng 1 Nên sửa 28); tờ c khoảng 95 × 60 px, hai cung cắt nhỏ.
- Sửa: tăng cỡ tờ nằm ngang, hoặc xếp tờ c xuống một hàng riêng.

### 15. 5.9: nấc 2 và nấc 1 chung chung

- Vị trí: `$.exercises[82]`, `[84]`, `[86]` (`hintVisualId: goi-y-ve-hinh`, `highlight` khối 1)
- Nguồn: —
- Vấn đề: chữ T có trục không giúp bé biết nên vẽ hình gì; nấc 1 tô "Em hãy vẽ thêm vào hình đó:" thay vì dòng có độ dài và số trục.
- Sửa: tuỳ chọn, nấc 2 là một hình ô vuông nhỏ nối liền vào một đoạn cho sẵn, dừng ở "Hình có mấy trục?"; nấc 1 tô khối 2.

### 16. `l59b-dan` dùng cùng "4 đơn vị, hai trục" như 5.9b: chấp nhận

- Vị trí: `$.exercises[83]` (`ex.l59b-dan`)
- Nguồn: —
- Vấn đề: cùng số với đề sách nhưng hình cho sẵn khác và lời giải (hình chữ nhật) khác lời giải sách (hai ô vuông chạm góc), nên không lộ đáp án.
- Sửa: không cần.

### 17. Id `l510-hai-nam` không còn tả nội dung

- Vị trí: `$.exercises[88].id`
- Nguồn: —
- Vấn đề: câu nay dùng thẻ b, d, H, không còn hai thẻ 2 và 5; id chưa khoá.
- Sửa: đổi id trước khi chạy `content:lock` (ví dụ `l510-the-giua`), sửa `checkIds` theo.

## Mục vòng 1 chưa sửa đúng

- Nghiêm trọng 3 (gợi ý gọi trục là "d" lệch hình): phần gợi ý đã sửa; xung đột chữ "d" còn ở các bảng chọn đường (Nên sửa 2).
- Nghiêm trọng 8 ("không phải nếp gấp nên không phải trục"): `s11-truc-sau-khi-mo` đã sửa; `s11-on-nep-gap` còn lập luận đó (Nghiêm trọng 2).
- Ghi chú vòng 1 (soát cả bài lập luận "đường chéo không phải trục"): còn sót ở `s9-buoc-dau` (Nghiêm trọng 3) và ba câu thiếu điều kiện (Góp ý 7).
- Nên sửa 2 (bốn câu thẻ `quanh-ta` cùng bộ hình): mới sửa một phần, hình mới (mặt trống đồng) sai sự thật (Nên sửa 1, Nghiêm trọng 1).
- Nên sửa 9 (câu section 6, 7 lặp hình): `s7-on-nhieu-nhat` đã đổi; phần chữ cái và hình section 7 vẫn lặp (Nên sửa 7, 8).
- Nên sửa 10 (câu quy tắc section 7): câu đã có ý riêng, hình quy tắc và recap chưa đổi theo (Nên sửa 9).
- Nên sửa 14 (mẹo `dem-o-tu-truc`): đổi nội dung nhưng thành kiến thức mới mang nhãn "làm nhanh" (Nên sửa 6).
- Nên sửa 19 (5.9a): hình nấc 3 đã đúng sách, bảng "xem đáp án" chưa (Nên sửa 11).
- Nên sửa 23 (khối "Nhắc lại" thứ tư nêu điều chưa dạy): câu thay thế thành cách nói thứ ba của một quy tắc (Nên sửa 15).
- Nghiêm trọng 15 (ngôi sao 5.5) và Nên sửa 28 (tờ giấy 5.7): sửa phần lớn, phần còn lại ở Góp ý 14.
- Góp ý 4 (nhiễu "Luôn…"): bản viết lại tạo nhiễu đọc được thành đúng (Nên sửa 3).
- Góp ý 5 (thêm "ngôi nhà" vào note): recap chưa đổi theo (Góp ý 1).

Các mục khác của vòng 1 đã sửa đúng, không thấy lỗi mới: Nghiêm trọng 1, 2, 4, 5, 6, 7, 9 đến 14; Nên sửa 1, 3 đến 8, 11, 12, 13, 15 đến 18, 20, 21, 22, 24 đến 27; Góp ý 5 (`s2-truc-cua-cong`), 7, 8, 12, 17, 18, 20.

## Ghi chú cho tác giả

- Sửa Nghiêm trọng 2, 3 thì tìm "nếp gấp", "đường chéo", "không phải trục" trong mọi `explain`, `wrong`, `done`, chú thích hình (`lesson.json` và `visuals.ts`): lý do nói về một đường phải đúng với mọi hình bài dạy, kể cả hình thoi, hình vuông và trục nghiêng của section `truc-cheo`, hoặc chỉ nói về hình đang thấy.
- Nên sửa 1, 7, 8 và Góp ý 11 cùng chọn hình mới: lập một bảng hình theo tầng (màn dạy, câu kiểm tra, câu luyện, câu ôn, câu dẫn, câu sách) trước khi sửa để hình mới không lặp nhau và không trùng đáp án SBT 5.3, 5.4, 5.7.
- Đã soát, đạt: câu `note` quy tắc của 11 section khớp nguyên văn recap section và recap thẻ (trừ section `quanh-ta`, Góp ý 1); khối "Nhắc lại" 1 đến 3 chép đúng câu quy tắc; không có phủ định kép; mọi câu `multiple: true` có "Chọn tất cả"; mọi câu tự giải trước khi đọc `answer` đều khớp; màu khái niệm như vòng 1 (Góp ý 6 vòng 1, chủ dự án quyết).
- Mẹo đã thử, đúng với mọi đầu vào: `cheo-khong-phai-truc` (chữ nhật 160 × 90, 120 × 100, 150 × 20, 100 × 99, 2 × 1; thoi nửa đường chéo 90 và 52, 104 và 36, 100 và 30, 60 và 59, 80 và 80; hình vuông bị loại đúng bởi điều kiện "hai cạnh dài ngắn khác nhau"), `dem-truc-hinh-deu` (ba hình mẹo nêu; hình thoi, hình chữ nhật ngoài phạm vi mẹo), `dem-o-tu-truc` (5 đầu vào), `gap-hai-lan` (5 đầu vào), quy tắc `truc-cheo` (6 điểm với trục y = x và x + y = 6).
