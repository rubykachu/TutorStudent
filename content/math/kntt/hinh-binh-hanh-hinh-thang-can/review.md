# Review: Hình bình hành. Hình thang cân (`hinh-binh-hanh-hinh-thang-can`)

- Bài: `content/math/kntt/hinh-binh-hanh-hinh-thang-can/lesson.json`
- Vòng: 2 - toàn bài (4 reviewer Opus song song + tổng hợp); nhóm 1: `$.sections[0]`–`[2]`; nhóm 2: `$.sections[3]`–`[5]`; nhóm 3: `$.sections[6]`–`[8]`; nhóm 4: section bài tập sách bài tập `$.sections[9]` và `overview`; tệp nhóm `.shots/review/hinh-binh-hanh-hinh-thang-can/nhom-{1,2,3,4}.md` (ngoài git)
- Nguồn đã đọc: `sources/math/hinh-binh-hanh-hinh-thang-can/` - sbt-p67, sbt-p68, sbt-p69, sbt-p115; bài phần 1 `content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/lesson.json` (chỉ đọc, để biết đã dạy gì)
- `content:check`: 0 lỗi, chỉ cảnh báo id chưa khoá
- Đọc hiểu (Haiku, lượt 1): không chạy (chạy sau khi hết Nghiêm trọng, trước `--approve`)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ba thiết bị (iPad, điện thoại, iPad ngang), ảnh trong `.shots/walk/hinh-binh-hanh-hinh-thang-can/`
- Kết luận: Chưa đạt: còn 6 lỗi Nghiêm trọng (15 Nên sửa, 15 Góp ý); đã chạy `pnpm content:hash hinh-binh-hanh-hinh-thang-can --root content --mark`, bài giữ `draft`
- Bản đã review: `da1386e447618096070e2f67b0401d17dc1b36c9934cd676a28490fd5e07aeb3` (`pnpm content:diff` so với bản này)

## Lịch sử: vòng 1 và tách bài

Vòng 1 chạy trên bài chưa tách `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` (19 phần, 112 phút): 21 Nghiêm trọng, 32 Nên sửa, 15 Góp ý, báo cáo đầy đủ ở commit `38c726d` (`git show 38c726d:content/math/kntt/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/review.md`); đã sửa ở `36ff39a`, `cabb254`. Sau đó chủ dự án tách theo hình thành hai bài (`part` 1 và 2): bài này giữ 9 section dạy (`hinh-binh-hanh` đến `ghep-hinh`) và SBT 4.9, 4.12, 4.13, 4.16–4.19 (bài cần hình của cả hai bài thuộc phần 2); phần 1 giữ SBT 4.8, 4.10, 4.11, 4.14, 4.15. Vòng 2 kiểm lại mọi mục vòng 1 thuộc bài này (bảng trong từng tệp nhóm): đã sửa đúng, trừ ba chỗ bản sửa sinh lỗi mới hay sót chỗ cùng kiểu (Nghiêm trọng 1, 3, 4).

## Nghiêm trọng

### 1. Hai câu kho ôn "vật này có dạng hình gì" có thêm đáp án đúng, lời giải đi từ hình sang tính chất

- Vị trí: `$.exercises[23]` (`ex.tam-bia-bon-canh`), `$.exercises[24]` (`ex.khung-anh-bon-goc`): đề, `options`, `explain` - LL-01, LL-17
- Nguồn: tr.69 bài 4.16 và lời giải tr.115 (tứ giác bốn cạnh bằng nhau EFPQ được gọi là "hình bình hành")
- Vấn đề: tấm bìa bốn cạnh bằng nhau, hai đường chéo vuông góc cũng là hình bình hành (theo chính câu quy tắc `$.sections[7]` và câu sách 4.16 của bài); khung bốn góc vuông cũng là hình bình hành và, theo định nghĩa của bài ("hình thang là tứ giác có hai cạnh đối song song", "hình thang có hai góc kề một đáy bằng nhau là hình thang cân"), cũng là hình thang cân. Bé chọn các lựa chọn đó bị chấm sai. Hai `explain` nói "chỉ hình thoi/hình chữ nhật luôn có…", đi từ hình sang tính chất, trong khi đề cho tính chất và hỏi hình (cùng kiểu lỗi đảo chiều vòng 1 đã sửa ở mẹo "Kiểm tra khung").
- Sửa: dùng câu nhận biết của phần 1 (đã nhắc ở `$.sections[9].blocks[2].children[1]`) và bỏ lựa chọn rộng hơn:
  - `tam-bia-bon-canh`: đề "Một tấm bìa có bốn cạnh bằng nhau và không có góc vuông nào. Tấm bìa này có dạng hình gì?"; lựa chọn Hình thoi, Hình vuông, Hình chữ nhật; `explain` "Tứ giác có bốn cạnh bằng nhau là hình thoi. Tấm bìa không có góc vuông nên không phải hình vuông."; `wrong` cho Hình vuông và Hình chữ nhật nói "cần bốn góc vuông, tấm bìa thì không có góc vuông nào".
  - `khung-anh-bon-goc`: đề "Một khung ảnh có bốn góc vuông, hai cạnh dài 30 cm và hai cạnh dài 20 cm. Khung ảnh này có dạng hình gì?"; lựa chọn Hình chữ nhật, Hình vuông, Hình thoi; `explain` "Tứ giác có bốn góc vuông là hình chữ nhật. Bốn cạnh không bằng nhau nên không phải hình vuông."
  - Hình vuông (học ở Bài 18) đứng được ở đây vì đề đã loại nó bằng điều kiện, nên không trái giả định "câu chọn hình không đưa hình vuông" của handover.

### 2. Lời `wrong` "Hình thang cân chỉ có một cặp cạnh song song" trái định nghĩa của bài; `ve-bh-cheo-hinh-gi` thiếu "chắc chắn"

- Vị trí: `$.exercises[2].explain.wrong[0].text` (`ex.chon-hinh-binh-hanh`), `$.exercises[34].explain.wrong[2].text` và `$.exercises[34].prompt[1].text` (`ex.ve-bh-cheo-hinh-gi`) - LL-17, LL-10
- Nguồn: định nghĩa của bài `$.sections[2].blocks[0].children[0]`, quy tắc `$.sections[7].blocks[2].children[0]`
- Vấn đề: hai nhóm (1 và 3) cùng nêu câu này; gộp và giữ mức Nghiêm trọng. Theo hai câu của chính bài, hình chữ nhật là hình thang (hai cạnh đối song song) có hai góc kề một đáy bằng nhau, tức là hình thang cân có hai cặp cạnh song song. Câu `wrong` là một quy tắc sai về hình thang cân mà bé sẽ phải bỏ ở lớp 8, và mâu thuẫn với Nghiêm trọng 1 (khung bốn góc vuông). Ở `$.exercises[34]`, đề "là hình gì?" với A, B, C bất kỳ: nếu góc B vuông thì ABCD là hình chữ nhật; lời `wrong` "đề không nói vậy" chỉ đúng với câu hỏi "chắc chắn".
- Sửa: `$.exercises[2].explain.wrong[0]` nói về hình bé đang thấy: "Hình này chỉ có hai cạnh đáy song song, hai cạnh bên thì không, nên không phải hình bình hành." `$.exercises[34]`: đề "Tứ giác ABCD chắc chắn là hình gì?"; `wrong[2]`: "Hình thang cân cần hai góc kề một đáy bằng nhau, mà đề không nói vậy." Tìm cả bài cụm "chỉ có một cặp".

### 3. Lời giải nhận hình thang cân vì "hai cạnh bên bằng nhau"

- Vị trí: `$.exercises[43].explain.text` (`ex.luc-giac-gom-thang-can`), `$.exercises[46].explain.text` (`ex.sbt-4-9`), `$.exercises[12].explain` (`ex.chon-hinh-thang-can-hai-ben`) - LL-17, LL-20
- Nguồn: tr.67 (hai cạnh bên bằng nhau là tính chất); quy tắc nhận biết của bài `$.sections[7].blocks[2].children[0]` ("hai góc kề một đáy bằng nhau")
- Vấn đề: nhóm 3 nêu `[43]` (Nghiêm trọng) và gợi ý xét `[46]`, `[12]`; giữ Nghiêm trọng và gộp cả ba vì cùng một lập luận: "có hai đáy song song và hai cạnh bên bằng nhau nên là hình thang cân". Hình bình hành cũng có một cặp cạnh song song và hai cạnh còn lại bằng nhau, nên lý do này dạy một dấu hiệu sai, trái câu quy tắc bé học ở `kiem-binh-hanh`. Ở 4.9 lập luận đó áp được cả vào Hình 4.12c (hình bình hành). Vòng 1 Nghiêm trọng 19 đã bắt đúng lỗi này ở 4.17 và chỉ sửa chỗ đó.
- Sửa (mỗi `explain` ≤ 3 câu):
  - `[43]`: "Mỗi nửa gồm ba tam giác đều. Đáy lớn song song với đáy nhỏ, hai góc kề đáy lớn đều là góc của tam giác đều nên cùng bằng 60°. Vậy mỗi nửa là hình thang cân."
  - `[46]`: "Hình 4.12c có hai cặp cạnh đối song song: đó là hình bình hành. Hình 4.12b là hình thang có hai góc kề một đáy bằng nhau, nên là hình thang cân. Hình 4.12a có hai góc kề một đáy khác nhau, hình 4.12d có năm cạnh."
  - `[12]` (section 3, trước khi dạy dấu hiệu): `text` "Hình thang cân có hai cạnh bên bằng nhau và hai góc kề một đáy bằng nhau. Chỉ hình này có đủ cả hai điều đó." (không gọi "hình thang kia", LL-26); thêm `wrong` cho `b`: "Hình này không có cặp cạnh nào song song, nên không phải hình thang."
  - Tìm cả `lesson.json` và `catalog-*.ts` cụm "hai cạnh bên bằng nhau, nên" / "bằng nhau nên là hình thang cân".

### 4. Lời `wrong` "Hình thoi chỉ chắc chắn có bốn cạnh bằng nhau" sai

- Vị trí: `$.exercises[21].explain.wrong[0].text` (`ex.so-sanh-bon-goc-vuong`, lựa chọn `thoi`) - LL-20, LL-17
- Nguồn: tr.67 (hình thoi: bốn cạnh bằng nhau, hai đường chéo vuông góc, cạnh đối song song, góc đối bằng nhau)
- Vấn đề: "chỉ" nói hình thoi chắc chắn có đúng một tính chất, trong khi câu quy tắc ở màn trước của cùng section nói hai đường chéo hình thoi vuông góc. Câu này là câu "Sửa" của chính review vòng 1 (Nghiêm trọng 12), tác giả chép nguyên văn.
- Sửa: "Hình thoi có bốn cạnh bằng nhau, nhưng góc của nó thường không phải góc vuông."

### 5. Tên điểm bị nét của hình cắt ngang (C, P, Q, O)

- Vị trí: (a) bảng vẽ hình bình hành `visual.ve-binh-hanh-abcd` (`$.exercises[27]`), cùng hàm `parallelogramFigure` ở `src/visuals/shared/quadrilaterals/construction.ts` mà `ve-binh-hanh-tap-lam` và bảng 4.12 `ve-binh-hanh-efhk` dùng: nét đứt qua C cắt ngang chữ "C" (walk `090`, `091`); (b) bảng vẽ biết đường chéo `visual.ve-bh-cheo-tap-lam` (`$.sections[6].blocks[2].children[1]`), `visual.ve-bh-cheo-mnpq` (`$.exercises[32]`) và mọi bảng `parallelogram-diagonal`: cung và nét đi qua chữ "P", nét đứt đâm vào "Q" (walk `098`, `104`); (c) `visual.binh-hanh-cheo-ghik` (`$.exercises[7].prompt[2]`): đường chéo HK chạy qua chữ "O", đúng điểm câu hỏi hỏi (walk `031`); (d) `visual.so-sanh-cheo` (`$.sections[4].blocks[1].children[1]`, recap section và thẻ): "O" nằm trên cạnh hình thoi và sát vạch "‖" ở hình bình hành, đọc thành "o‖", mà section không nói O là gì (walk `063`, `072`); (e) hình chạm đo 4.16 `visual.sbt-hinh-4-14` (`$.exercises[53]`): ô "?" che chữ O ("?O?", walk `166`) - LL-12, LL-21
- Nguồn: —
- Vấn đề: ba nhóm nêu cùng kiểu với ba mức (nhóm 2 Nghiêm trọng cho C; nhóm 1, 3, 4 Nên sửa cho O, P, Q). Chọn chung mức Nghiêm trọng: checklist trục 5 xếp chữ bị cắt do nội dung bài (hình của bài, không phải bố cục app) là Nghiêm trọng, và các chữ bị cắt là đúng điểm bé phải đọc (O là điểm của đề `[7]`; C, P, Q là đỉnh bé vừa dựng, nút bước gọi tên chúng). Gộp một mục vì gốc là cách đặt nhãn đỉnh trong hai hàm dựng dùng chung; sửa một chỗ chữa mọi bảng.
- Sửa: trong `construction.ts`, đặt nhãn đỉnh thứ ba, thứ tư ra ngoài hình theo hướng từ tâm hình ra đỉnh, xa đầu cung, và cho nét đứt kéo dài dừng trước ô nhãn; `binh-hanh-cheo-ghik` thêm `nameShift` cho O (như O của `binh-hanh-cheo-ten`); `so-sanh-cheo` bỏ tên giao điểm ở hình thu nhỏ (giữ chấm); `sbt-hinh-4-14` dời ô "?" khỏi O (xem Nên sửa 13). Chụp lại `pnpm visual:shot` mọi bảng hình bình hành ở ba góc 45°, 60°, 75° và ba thiết bị, tự xem.

### 6. Hình gợi ý nấc 2 của 4.18 là trọn lời giải

- Vị trí: `$.exercises[57].hints.hintVisualId` (`visual.ghep-thang-can-cac-buoc`, khung cuối `count: 3, finished: true`) so với `solutionVisualId` (`visual.sbt-4-18-giai`) (`ex.sbt-4-18`) - LL-02
- Nguồn: tr.69 bài 4.18
- Vấn đề: nhóm 4 ghi Nên sửa vì bảng ghép đã có viền nét đứt của dải ba tam giác. Nâng lên Nghiêm trọng: "Luật gợi ý 3 nấc" là luật cố định, nấc 2 hiện kết quả của đề là Nghiêm trọng; hình này ghép xong đúng việc 4.18 bắt làm, nên nấc 2 trùng nấc 3 và bé mất một nấc gợi ý. Viền đích của bảng không thay được việc nấc 2 dừng ở "?".
- Sửa: nấc 2 dừng ở khung hai tam giác (xuôi rồi ngược) kèm dòng "Thêm hình thứ ba đặt thế nào?", hoặc một hình gợi ý riêng không có khung xong; nấc 3 giữ `sbt-4-18-giai`.

## Nên sửa

### 7. Từ nền của phần 1 ("song song", "cạnh đối", "góc đối", "vuông góc", "êke", "độ mở compa") dùng mà không có câu nhắc ở chỗ đầu tiên cần đến

- Vị trí: (a) `$.sections[0].blocks[0]` (màn đầu bài, hình `binh-hanh-cac-buoc` khung 3 "Các cạnh đối song song" có dấu mũi tên) và câu quy tắc `$.sections[0].blocks[1].children[0]`; (b) cùng câu quy tắc ("cạnh đối", "góc đối"); (c) `$.sections[4].blocks[0]` (chỗ đầu tiên dùng "hình chữ nhật", "hình thoi", "vuông góc"); (d) `$.sections[5].blocks[0].children[0]` (chỗ đầu tiên dùng "êke"); (e) `$.sections[6].blocks[0].children[0]` ("bán kính là độ mở compa"); (f) `$.sections[9].blocks[2]` (Nhắc lại cho 4.16, 4.17: câu dẫn hỏi "dùng êke kiểm tra", "khít góc vuông"; quy tắc hình thang cân cần biết BEDC là hình thang) - LL-09
- Nguồn: bài phần 1: `$.sections[3].blocks[1].children[0]` (song song), `$.sections[1].blocks[1].children[0]` (cạnh đối), `$.sections[4].blocks[1].children[0]` (góc đối), `$.sections[5].blocks[1].children[0]` (vuông góc), `$.sections[6].blocks[0].children[0]` (êke), `$.sections[7].blocks[1].children[0]` (độ mở compa)
- Vấn đề: gộp nhóm 1 (Nên sửa 1, 2), nhóm 2 (Nên sửa 4), nhóm 3 (Nên sửa 1), nhóm 4 (Nên sửa 3, 4). Bài dùng "song song" khoảng 60 lần mà không câu nào nói nghĩa hay nói dấu mũi tên trên hình là gì; câu quy tắc đầu tiên của bài dựa trọn vào "cạnh đối", "góc đối", "song song". Dùng lại điều phần 1 đã dạy là đúng luật tách bài (nên không Nghiêm trọng), nhưng bé nhanh quên (`docs/learner.md`) và có thể mở phần 2 ở ngày khác. Cần một câu nhắc ngắn ở chỗ đầu tiên mỗi từ được dùng, lặp nguyên văn câu phần 1 (LL-05), không dạy lại section nào.
- Sửa (không thêm màn, không thêm section; mỗi `note` ≤ 2 câu, không `rule`):
  - (a) Thêm `note` thành `$.sections[0].blocks[0].children[1]` (sau câu "Gạch lát nghiêng…", trước hình): "Nhắc lại: hai đường thẳng song song là hai đường không bao giờ cắt nhau. Trên hình, hai cạnh song song có cùng dấu mũi tên." Các section sau không nhắc lại "song song".
  - (b) Thêm `note` thành `$.sections[0].blocks[1].children[0]`, trước câu quy tắc (như màn quy tắc của `hinh-thang-can`): "Hai cạnh nằm đối diện nhau gọi là cạnh đối. Hai góc nằm đối diện nhau gọi là góc đối."
  - (c) Thêm `note` thành `$.sections[4].blocks[0].children[0]`: "Nhắc lại: hình chữ nhật có bốn góc vuông, hình thoi có bốn cạnh bằng nhau. Vuông góc nghĩa là cắt nhau tạo thành góc vuông."
  - (d) Sửa câu thứ hai của `$.sections[5].blocks[0].children[0]`: "Êke là thước có một góc vuông, giúp ta kẻ các đường song song."
  - (e) Sửa câu thứ hai của `$.sections[6].blocks[0].children[0]`: "Compa vẽ cung tròn: tâm là chỗ đặt kim, bán kính là độ mở compa (khoảng cách giữa kim và đầu bút)." (khoảng 24 âm tiết; `[length]` báo thì tách thành note riêng "Độ mở compa là khoảng cách giữa kim và đầu bút.").
  - (f) Thêm `note` vào `$.sections[9].blocks[2]`, trước câu quy tắc: "Êke có một góc vuông: đặt êke khít vào góc thì góc đó là góc vuông. Hình thang là tứ giác có hai cạnh đối song song." (câu sau lặp nguyên văn `$.sections[2].blocks[0].children[0]`).
  - Chụp lại walk điện thoại các màn (a), (c), (f) để chắc màn không dài quá.

### 8. Hình chạy từng bước của hình thang cân dùng "cạnh đáy", "cạnh bên", "góc kề đáy" trước câu định nghĩa

- Vị trí: `visual.thang-can-cac-buoc` (`catalog-binh-hanh-thang-can.ts`, khoá `thang-can-cac-buoc`) ở `$.sections[2].blocks[0].children[2]`; định nghĩa ở màn sau `$.sections[2].blocks[1].children[0]`; walk `036`, `037` - LL-09
- Nguồn: tr.67
- Vấn đề: ba khung nói "Hai cạnh đáy…", "Hai cạnh bên…", "Hai góc kề đáy DC bằng nhau" khi bé chưa đọc nghĩa các từ.
- Sửa: chữ khung tự giải nghĩa: "AB và DC song song: đó là hai cạnh đáy"; "AD và BC là hai cạnh bên, chúng bằng nhau"; "Góc D và góc C ở hai đầu đáy DC, chúng bằng nhau"; tiêu đề "Hình thang cân ABCD". Chụp lại ba thiết bị.

### 9. Lời giải các câu đường chéo hình bình hành không nêu câu quy tắc

- Vị trí: `$.exercises[7].explain.text` (`cheo-bh-trung-diem`), `$.exercises[5]`, `[6]`, `[8]`, `[9]` (`cheo-bh-oc`, `cheo-bh-ao`, `cheo-bh-oq`, `cheo-bh-mo`) - LL-17
- Nguồn: tr.67
- Vấn đề: `cheo-bh-trung-diem` "O nằm chính giữa mỗi đường chéo, nên O là trung điểm" lặp định nghĩa trung điểm, không nói vì sao; bốn câu số bắt đầu bằng "O là trung điểm của AC" không lý do. Bé chậm cần thấy câu quy tắc được dùng.
- Sửa: mở mỗi `explain` bằng câu quy tắc nguyên văn: `cheo-bh-trung-diem` "Hai đường chéo của hình bình hành cắt nhau tại trung điểm của mỗi đường. Vậy O là trung điểm của GI và của HK. GH và HI là cạnh, O không nằm trên chúng."; `cheo-bh-oc` "Hai đường chéo của hình bình hành cắt nhau tại trung điểm của mỗi đường. Vậy O là trung điểm của AC, nên OC = OA = 4 cm."; ba câu còn lại cùng khuôn (giữ `tex`).

### 10. Câu luyện `chon-hinh-thang-can-hai-ben` dùng lại ba hình của Hình 4.12 cùng dáng, cùng hướng

- Vị trí: `$.exercises[12].options` (`th-thang-vuong`, `th-thang-can`, `th-ngu-giac`); walk `045` - LL-07, LL-08
- Nguồn: tr.68 Hình 4.12a, b, d
- Vấn đề: giải trước một nửa bài 4.9 (`$.exercises[46]`); vòng 1 Nên sửa 24 đã đổi hướng hình ở câu dẫn 4.9 vì lý do này, câu luyện chưa đổi.
- Sửa: lật hình thang vuông (cạnh vuông góc bên phải, đáy dài ở trên), thay ngũ giác bằng hình khác (tam giác hay lục giác không đều). Không đưa hình bình hành hay hình chữ nhật vào câu này. Sửa cùng lúc với Nghiêm trọng 3.

### 11. "Tứ giác lệch" trông gần như có hai cạnh song song và hai cạnh bên gần bằng nhau

- Vị trí: `th-tu-giac-lech` (`src/visuals/shared/quadrilaterals/other-shapes.ts`, `looseQuadrilateral` ở `figures.ts`) ở `$.exercises[2].options[2]`, `$.exercises[12].options[1]`; walk `015`, `045` - LL-10, LL-14
- Vấn đề: AB và DC chỉ lệch nhau khoảng 4°, hai cạnh còn lại dài 102 và 92 đơn vị; bé dễ thấy "hình thang cân hơi lệch", và `wrong` "không có cặp cạnh nào song song" trái điều bé nhìn thấy.
- Sửa: hình dùng chung với bài phần 1 (năm chỗ) nên không sửa hình chung; thêm một hình riêng trong `catalog-thumbs.ts` của bài này, hai cạnh trên dưới nghiêng ngược chiều rõ (vd D(50, 170), C(250, 140)), hai cạnh bên khác hẳn nhau, cho hai câu trên.

### 12. Câu quy tắc của `so-sanh-bon-hinh` mở bằng "Hai đường chéo bằng nhau", dễ nhớ thành chiều đảo, và nói khác câu quy tắc `cheo-hinh-thang-can`

- Vị trí: `$.sections[4].blocks[1].children[0]` (`rule`), `$.sections[4].recap.caption`, `$.cards[4].recap.caption` - LL-10, LL-05
- Nguồn: tr.67
- Vấn đề: "Hai đường chéo bằng nhau ở hình chữ nhật và hình thang cân" đặt tính chất lên đầu, cùng note "So sánh giúp bạn không nhầm hình…", nên bé dễ nhớ "đường chéo bằng nhau thì là hình chữ nhật hay hình thang cân" (chiều vòng 1 Nghiêm trọng 1 đã loại); `$.sections[3]` lại nói "Hai đường chéo của hình thang cân bằng nhau" (chủ ngữ là hình).
- Sửa (recap và thẻ lặp nguyên văn): "Hình chữ nhật và hình thang cân có hai đường chéo bằng nhau. Hai đường chéo của hình thoi vuông góc với nhau."

### 13. Hình chạm đo của 4.16: ô chạm chồng nhau và màn không nói phải chạm

- Vị trí: `$.exercises[53].prompt[1]` (`visual.sbt-hinh-4-14`, `catalog-book.ts`; `figure414` ở `figures.ts`); walk `166` (iPad, iPad ngang) - LL-22
- Nguồn: tr.69 Hình 4.14
- Vấn đề: tám ô "?" dồn trong ABCD cao 64 đơn vị, ô góc chạm ô nửa đường chéo (phần che chữ O: Nghiêm trọng 5); bé dễ chạm nhầm. Màn chỉ có lời sách và "Chọn đáp án đúng.", không câu nào bảo chạm để đo.
- Sửa: phóng hình, ô góc đặt ra ngoài góc, ô nửa đường chéo đặt trên phần đường chéo ngoài ABCD; thêm khối app trước "Chọn đáp án đúng.": "Chạm từng nửa đường chéo và từng góc của ABCD để đo." Chụp lại ba thiết bị.

### 14. 4.17: bé không kiểm được trên màn điều lời giải dựa vào

- Vị trí: `$.exercises[56].prompt[1]` (`visual.sbt-hinh-4-15`), `$.exercises[56].explain.text` (`ex.sbt-4-17`); walk `175` - LL-22
- Nguồn: tr.69 Hình 4.15; lời giải tr.115
- Vấn đề: hình tĩnh không số đo; `explain` dựa vào các đoạn bằng nhau, BE song song CD, hai góc 60° mà màn không cho cách thấy (OD không vẽ). Vòng 1 Nên sửa 22 đã làm cho 4.16, chưa làm cho 4.17.
- Sửa: đổi thành hình chạm để đo (`kind: "probe"`) như `sbt-hinh-4-14`: OA, AB, BC, CO, CD, DE, EO cùng số đo, góc B, góc E "60°"; thêm khối app "Chạm từng đoạn và hai góc B, E để đo." trước "Chọn đáp án đúng."; ô chạm không chồng nhau.

### 15. Câu dẫn `dan-4-17-thoi` tự trả lời trong đề

- Vị trí: `$.exercises[54].prompt[0].text`, `.options`, `.explain` (`ex.dan-4-17-thoi`); walk `171` - LL-14
- Vấn đề: đề nói sẵn "Vậy OU, OV, OW cũng dài 5 cm" rồi hỏi bốn cạnh có bằng nhau không; nhiễu "có cạnh dài hơn 5 cm" trái đề. Câu không tập bước 4.17 cần.
- Sửa: bỏ câu "Vậy OU, OV, OW cũng dài 5 cm"; hỏi "Tứ giác OUVW là hình gì?" với Hình thoi, Hình chữ nhật, Hình thang cân; `explain` "OU, UV, VW, WO đều là cạnh của các tam giác đều có cạnh 5 cm, nên OUVW có bốn cạnh bằng nhau. Vậy OUVW là hình thoi."; `wrong` cho hai nhiễu.

### 16. Mẹo "Vẽ hai đường song song" thiếu bước đặt cạnh êke trùng cạnh đã có

- Vị trí: `$.sections[5].blocks[2]` (`tip.truot-eke`), hình `visual.truot-eke` (`catalog-drawing.ts`) - LL-24
- Nguồn: cách vẽ SGK Toán 6 (thước và êke)
- Vấn đề: nhóm 2 thử sáu đầu vào (bảng trong `nhom-2.md`): lời mẹo đúng ("các đường kẻ theo một cạnh êke khi trượt dọc thước thì song song"), nhưng không nói kẻ theo cạnh không áp vào thước, và không nói phải đặt cạnh đó trùng cạnh cần song song trước khi trượt; thiếu bước này thì đường qua B không song song với AD. Mẹo đúng như đã viết nên không Nghiêm trọng; nó là chỗ duy nhất của hai bài nói cách đặt êke.
- Sửa: `text` "Đặt một cạnh êke trùng với cạnh đã có, áp thước vào cạnh khác của êke. Giữ thước yên, trượt êke tới điểm cần vẽ rồi kẻ theo cạnh đã đặt: đường mới song song với cạnh đã có."; hình thêm đoạn AD trùng cạnh êke lúc đầu và điểm B lúc sau.

### 17. Câu quy tắc đường chéo hình bình hành nói nhiều cách

- Vị trí: `$.sections[7].blocks[0].children[0]` ("Hình bình hành có hai đường chéo cắt nhau tại trung điểm…"); chú thích `COMPARE_DIAGONALS["binh-hanh"].caption` và `facts` của thẻ hình bình hành trong `visual.so-sanh-the` (`catalog-binh-hanh-thang-can.ts`: "cắt nhau tại trung điểm"); `aria-label` của `kiem-hinh-quy-tac` (`catalog-check.ts`) và `sbt-4-16-giai` (`catalog-book.ts`) còn "cắt nhau ở giữa" - LL-05
- Vấn đề: câu quy tắc `$.sections[1].blocks[1].children[0]` là "Hai đường chéo của hình bình hành cắt nhau tại trung điểm của mỗi đường."; các chỗ trên đảo chủ ngữ, bỏ "của mỗi đường", hay còn "ở giữa" (vòng 1 Nên sửa 14 đã thống nhất bỏ). Gộp nhóm 2 Góp ý 1, nhóm 3 Góp ý 6, nhóm 4 Góp ý 4 và phát hiện của Tổng hợp.
- Sửa: dùng đúng câu quy tắc ở `$.sections[7].blocks[0].children[0]` (câu đầu) và ở `facts`; chú thích "Hình bình hành: cắt nhau tại trung điểm của mỗi đường"; hai `aria-label` đổi "ở giữa" thành "tại trung điểm của mỗi đường".

### 18. "Điểm riêng", "dấu riêng" gọi các tính chất mà hình khác cũng có

- Vị trí: `$.sections[4].blocks[0].children[0]`, `$.sections[4].blocks[2].children[0]`; nhãn và `facts` của `visual.so-sanh-the`, nhãn `visual.so-sanh-bon-hinh` - LL-10
- Vấn đề: thẻ hình chữ nhật ghi "Các cạnh đối bằng nhau" (hình bình hành cũng có), "Hai đường chéo bằng nhau" (hình thang cân cũng có); gọi là "điểm riêng" dạy bé nhận hình bằng chúng.
- Sửa: "Cùng làm: chạm vào từng hình để đọc tính chất của nó."; note đầu "Xem bốn hình đặt cạnh nhau, mỗi hình với dấu trên hình của nó."; nhãn hình "Bốn hình và tính chất của mỗi hình", `done` "Bạn đã xem tính chất của cả bốn hình."

### 19. Hai section không có ví dụ đời sống

- Vị trí: `$.sections[4]` (`so-sanh-bon-hinh`), `$.sections[5]` (`ve-hinh-binh-hanh`) - LL-16
- Sửa: một câu trong note mở đầu, vd `so-sanh-bon-hinh` "Cánh cửa, khung diều, viên gạch lát nghiêng và chiếc thang chữ A có bốn hình khác nhau."; `ve-hinh-binh-hanh` "Muốn cắt một viên gạch hình bình hành bằng giấy, ta vẽ nó trước." (gộp vào note của Nên sửa 7 (c), (d) sao cho mỗi note ≤ 2 câu).

### 20. `explain` của `ve-bh-cheo-hinh-gi` lập luận bằng định nghĩa bài không dạy

- Vị trí: `$.exercises[34].explain.text` - LL-09
- Vấn đề: "ABCD có hai cặp cạnh đối song song. Vậy ABCD là hình bình hành" dùng chiều định nghĩa lớp 8; bài chỉ dạy chiều "hình bình hành thì cạnh đối song song" và dấu hiệu đường chéo.
- Sửa: "Đây đúng là các bước vẽ hình bình hành ở phần trước: hai đường song song vẽ bằng êke gặp nhau tại D. Vậy ABCD là hình bình hành." (sửa cùng Nghiêm trọng 2).

### 21. Nhiễu "Không, vì hai góc kề đáy khác nhau" trái ngay dữ kiện đề

- Vị trí: `$.exercises[37].options[1]`, `explain.wrong[0]` (`ex.kiem-thang-can-goc`) - LL-14
- Sửa: nhiễu "Chưa biết, phải đo hai cạnh bên"; `wrong` "Hai góc kề một đáy bằng nhau là đủ để biết hình thang là hình thang cân, không cần đo cạnh bên."

## Góp ý

### 1. Mũi tên song song trên BC chạm cung góc 60° ở hình quy tắc

- Vị trí: `visual.binh-hanh-quy-tac` ở `$.sections[0].blocks[1].children[1]`, recap section và thẻ; walk `005`, `020` - LL-12
- Sửa: đặt mũi tên song song giữa cạnh hoặc lùi xa đỉnh khi hình có cung góc.

### 2. Câu hỏi về đường chéo mà hình đề không vẽ đường chéo

- Vị trí: `$.exercises[16]` (`ex.cheo-tc-cap-bang-nhau`, hình `thang-can-ten`)
- Sửa: dùng hình có hai đường chéo nét thường, khác hình của câu ngay trước.

### 3. Câu kho ôn của thẻ "Vẽ hình bình hành" hỏi tính chất cạnh đối

- Vị trí: `$.exercises[29]` (`ex.ve-bh-canh-dc`)
- Sửa: hỏi theo bước vẽ, hoặc gắn câu sang thẻ `hinh-binh-hanh`.

### 4. Chú thích bước cuối để chữ "C" đứng một mình ở dòng dưới

- Vị trí: `visual.ve-binh-hanh-cac-buoc` khung cuối (`catalog-drawing.ts`); walk `075`
- Sửa: "Hai đường gặp nhau tại C. Nối C với D và với B."

### 5. Nấc 1 của hai câu kiểm tra section 7 tô câu hỏi, không tô dữ kiện

- Vị trí: `$.exercises[30].hints.highlight[0]`, `$.exercises[31].hints.highlight[0]`
- Sửa: `index: 0` (khối dữ kiện AB, BC, AC).

### 6. `ve-bh-cheo-do-mo` dùng đúng BC = 5 cm, AC = 6 cm của bài 4.13

- Vị trí: `$.exercises[31].prompt[0]` - LL-07
- Sửa: bộ số chưa dùng, vd AB = 3 cm, BC = 6 cm, AC = 7 cm.

### 7. Câu luyện `ve-bh-cheo-mnpq` trùng tên MNPQ với "Cùng làm" cùng section

- Vị trí: `$.exercises[32]`, `$.sections[6].blocks[2]` - LL-07
- Sửa: đổi tên điểm câu luyện (vd GHIK).

### 8. `dem-thoi-luc-giac` dùng lại Hình 4.10 với đúng tên đỉnh

- Vị trí: `$.exercises[41]`, `visual.hex-ten` (`catalog-check.ts`), `visual.ghep-quy-tac` - LL-08
- Nguồn: tr.68 ví dụ 2
- Sửa: đổi tên đỉnh (vd MNPQRS) và xoay lục giác.

### 9. "Cùng làm" section 8 lặp đúng hình và số của hình chạy từng bước

- Vị trí: `visual.do-kiem-binh-hanh` (`$.sections[7].blocks[3].children[1]`) và `visual.kiem-bh-cac-buoc` - LL-07
- Sửa: hình bình hành khác dáng, khác số (vd nửa đường chéo 5 và 2).

### 10. "Đáy lớn", "đáy nhỏ" dùng mà chưa nói

- Vị trí: `$.exercises[40].prompt[1]`, `$.exercises[42].prompt[0]`; `$.sections[8]`
- Sửa: thêm vào note đầu `$.sections[8].blocks[0]`: "Đáy dài hơn gọi là đáy lớn, đáy ngắn hơn gọi là đáy nhỏ." (giữ ≤ 2 câu).

### 11. "Thẳng hàng", "dấu hiệu" chưa có trong glossary hay phần dạy

- Vị trí: `$.exercises[34].prompt[0]`; `$.exercises[39].explain.text`
- Sửa: "ba điểm A, B, C không nằm trên một đường thẳng"; `explain` của `kiem-chac-chan-binh-hanh` lặp câu quy tắc thay cho "là dấu hiệu của hình bình hành".

### 12. `whyItMatters` chỉ nói hình thang cân "trông thế nào"

- Vị trí: `$.overview.whyItMatters`
- Sửa (gợi ý): "Khi đóng khung hay cắt miếng ghép khay mứt Tết, bạn đo cạnh, góc và đường chéo để biết miếng đó có đúng là hình bình hành hay hình thang cân không."

### 13. Câu dẫn `dan-4-19-xep-quanh` chỉ là phép trừ, không có hình

- Vị trí: `$.exercises[58]`
- Sửa (gợi ý): thêm hình khay nét đứt không tô để đếm, hoặc hỏi hai hình thang cân có đáy nhỏ bằng cạnh bên ghép theo đáy lớn thành hình gì (khác lời `ghep-hai-thang-can-thanh`).

### 14. `dan-4-17-thang-can` gọi "cạnh đáy" cho một tứ giác chưa biết là hình thang

- Vị trí: `$.exercises[55].prompt[0].text`
- Sửa: "Một hình thang có hai góc kề một đáy bằng nhau." hoặc "Một tứ giác có hai cạnh đối song song…".

### 15. 4.12: thêm một câu cho bé khỏi lo chọn góc sai

- Vị trí: `$.exercises[48].explain` (điểm nghi của handover: cách chấm nhận mọi góc trong ba góc là đúng với đề)
- Sửa: thêm "Sách không cho góc, nên góc nào bạn chọn cũng đúng."

## Cần chủ dự án quyết

1. Section `so-sanh-bon-hinh`: nhóm 2 đề xuất giữ (chỗ duy nhất của phần dạy nhắc hình chữ nhật, hình thoi trước 4.16, 4.17; hình của nó là gợi ý nấc 2 của 4.9; bài 58 phút, dưới mức tách), sau khi sửa Nghiêm trọng 1, 4, 5 và Nên sửa 7, 12, 17, 18.
2. Bước chọn góc 45°, 60°, 75° khi vẽ hình bình hành (SBT 4.12): giữ như vòng 1, chấp nhận mọi góc trong ba góc.
3. SBT 4.12, 4.13, 4.18, 4.19 sách không in lời giải; reviewer vòng 1 và vòng 2 đã tự giải, khớp `answer`.
