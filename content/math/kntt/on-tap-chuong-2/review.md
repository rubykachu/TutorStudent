# Review: Ôn tập chương II (`on-tap-chuong-2`)

- Bài: `content/math/kntt/on-tap-chuong-2/lesson.json` (bản commit `dbddf13`)
- Vòng: 1 - toàn bài, 3 reviewer song song (section 1-5, 6-10, 11-14) + tổng hợp
- Nguồn đã đọc: `sources/math/on-tap-chuong-2/` - sbt-p44, sbt-p45, sbt-p46, sbt-p110
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/on-tap-chuong-2/`
- Kết luận: Chưa đạt: còn 8 lỗi Nghiêm trọng (đã chạy `pnpm content:hash on-tap-chuong-2 --root content --mark`, bài giữ `draft`)
- Bản đã review: `6a3b3b01c34f0f0231d3f1c60466dafbd824841b05c8f313f5482c9eea7c9e07` (`pnpm content:diff` so với bản này)

Đã soát: mọi câu có `bookRef` (câu hỏi 1-6, 2.56-2.64) so với ảnh đề tr.45, tr.46: chữ, số và lựa chọn khớp sách, trừ dấu câu ở hai câu (Nghiêm trọng 8). Đáp án mọi câu bằng lời giải tr.110 (đã tự giải và kiểm bằng script: A = 58 735; 2.57 ra 38 và 76; 2.58 chỉ có 245 trong 200..300; 2.62 n ∈ {0; 1; 2; 5}; 2.63 chỉ có a = 6, b = 2; 2.60 ra 3⁴ · 5³; 2.64 ra 43/42 và 17/60). Mọi câu `choice` "kết luận, vì ..." có đúng một lựa chọn đúng, kể cả 2.56b (không nhiễu nào dựa vào 3 hay 5). Sáu mẹo đã thử trên ≥ 5 đầu vào gồm số biên: năm mẹo đúng, mẹo "Loại hợp số nhanh" thiếu điều kiện (Nên sửa 7). Câu quy tắc đối chiếu với câu đã duyệt của Bài 6, 8, 9, 10, 11.

## Nghiêm trọng

### 1. Giải thích nói "chỉ cần một số hạng không chia hết là tổng không chia hết" (LL-17)

- Vị trí: `$.exercises[16].explain.wrong[0]`, `$.exercises[16].options[0]` (`on-tap-chuong-2.ex.ba-so-hang-2`); `$.exercises[17].explain.wrong[0]`, `$.exercises[17].explain.wrong[2]` (`on-tap-chuong-2.ex.bai-2-59a`)
- Nguồn: Bài 8, quy tắc "Tổng có đúng một số hạng không chia hết ..."; note `$.sections[0].blocks[2]` của chính bài
- Vấn đề: "Chỉ cần một số hạng không chia hết cho 2 thì tổng đã không chia hết cho 2", "một số hạng không chia hết cho 2 là đủ để kết luận", và đáp án đúng "Không, vì có một số hạng không chia hết cho 2" đều nói "có ít nhất một" là đủ. Điều đó sai: 3 + 5 = 8 chia hết cho 2. Đây đúng là cái bẫy câu hỏi 1 của sách mà section 1 vừa dạy. Bé học chậm nhớ câu ngắn này hơn quy tắc dài.
- Sửa: luôn nói đủ điều kiện "đúng một, các số hạng kia chia hết": vd `wrong` của 2.59a b, d: "Chỉ có 31 005 không chia hết cho 2, hai số hạng kia chia hết, nên tổng không chia hết cho 2."; option a của `ba-so-hang-2`: "Không, vì chỉ một số hạng không chia hết cho 2, các số hạng kia chia hết". Option của 2.59a là lời của bài (sách không có lựa chọn), giữ nguyên vì đã nói đủ.

### 2. Phủ định kép trong lý do của nhiễu 2.59b (LL-19)

- Vị trí: `$.exercises[18].explain.wrong[1]` (`on-tap-chuong-2.ex.bai-2-59b`, option c)
- Nguồn: —
- Vấn đề: "Chia hết cho 2 không làm tổng không chia hết cho 5." có hai phủ định chồng nhau, bé dễ hiểu ngược.
- Sửa: "Chia hết cho 2 không liên quan tới chia hết cho 5. Ba số hạng đều tận cùng là 0 hoặc 5 nên tổng chia hết cho 5."

### 3. Hình gợi ý nấc 2 của 2.56b chỉ ra đúng lý do của đáp án (LL-02)

- Vị trí: `$.exercises[14].hints.hintVisualId` = `on-tap-chuong-2.visual.tn256b-goi-y` (`on-tap-chuong-2.ex.bai-2-56b`)
- Nguồn: tr.110, 2.56b
- Vấn đề: câu hỏi bắt bé chọn lý do (chia hết cho 7, 2, 9 hay "số nguyên tố"). Hình nấc 2 dùng số khác đề nhưng xét đúng số chia 2 và kết luận "Tổng chia hết cho 2 và lớn hơn 2: hợp số", tức chỉ thẳng lựa chọn đúng. Cùng kiểu `quan-he-chia-het-va-tinh-chat`, `ex.chon-12q-9`: số được xét trong hình cũng không được là đáp án. Hình của 2.56a (`tn256a-goi-y`) tránh được vì dùng số chia khác lựa chọn đúng.
- Sửa: cho nấc 2 dừng ở "?", vd hai dòng "Mỗi số hạng có thừa số chẵn không?" với số khác đề rồi "Tổng chia hết cho ?"; hoặc giải trọn với một số chia không phải lý do đúng của đề (như cách làm của `tn256a-goi-y`).

### 4. Giải thích dùng cách thử "các số nguyên tố nhỏ hơn 22", chưa dạy (LL-09)

- Vị trí: `$.exercises[10].explain.wrong[2]` (`on-tap-chuong-2.ex.tn3`, option d, 499)
- Nguồn: Bài 10 chỉ dạy "Muốn biết số nhỏ hơn 100 có là số nguyên tố không, ta tra bảng số nguyên tố."
- Vấn đề: "499 ... cũng không chia hết cho các số nguyên tố nhỏ hơn 22" dựa vào cách chỉ thử tới căn bậc hai, chưa học ở lớp 6 và không có trong Bài 10. Bé không biết vì sao lại là 22.
- Sửa: "499 không có dấu hiệu chia hết cho 2, 3 hay 5. Trong bốn số, chỉ 2 335 chắc chắn là hợp số vì tận cùng là 5 và lớn hơn 5." (câu hỏi tìm số không là số nguyên tố, không cần chứng minh 499 là số nguyên tố).

### 5. Ký hiệu `min`, `max` chưa học ở lớp 6 (LL-09)

- Vị trí: `$.exercises[39].explain.tex` (`on-tap-chuong-2.ex.tim-b-mu-nho`), `$.exercises[40].explain.tex` (`on-tap-chuong-2.ex.tim-a-mu-lon`), `$.exercises[41].explain.tex` (`on-tap-chuong-2.ex.bai-2-63`); hình nấc 2 `on-tap-chuong-2.visual.tn263-goi-y` (hai dòng `\min(4, b) = 3`, `\max(a, 2) = 5`)
- Nguồn: — (sách lớp 6 và các bài đã xuất bản không dùng `min`, `max`)
- Vấn đề: "min(4, b) = 3" là ký hiệu hàm của lớp trên, trang nguồn không có. Bé gặp ký hiệu lạ đúng ở giải thích và hình gợi ý của câu khó nhất section.
- Sửa: viết bằng lời, giữ đúng chữ của quy tắc Bài 11 ("số mũ nhỏ nhất", "số mũ lớn nhất"): `text` "Thừa số 2 có số mũ 3 và b; số mũ nhỏ nhất là 2 nên b = 2. Thừa số 3 có số mũ a và 5; số mũ lớn nhất là 6 nên a = 6."; bỏ `tex` hoặc xếp `\begin{gathered} 2^{3},\ 2^{b} \to 2^{2} \\ 3^{a},\ 3^{5} \to 3^{6} \end{gathered}` (không chữ Việt trong TeX). Hình `tn263-goi-y`: thay dòng `\min`/`\max` bằng hai luỹ thừa và nhãn "số mũ nhỏ nhất", "số mũ lớn nhất". Bỏ luôn "⇒" (Góp ý 19).

### 6. Câu quy tắc quy đồng không nói nhân với số nào, và đọc được theo nghĩa sai (LL-10)

- Vị trí: `$.sections[12].blocks[0].children[0]` (`rule: true`), `$.sections[12].recap.caption` (`on-tap-chuong-2.section.quy-dong`); liên quan `$.exercises[46]` (`on-tap-chuong-2.ex.quy-dong-9-14`), hình `quy-dong-vi-du`, `quy-dong-vi-du-xong`
- Nguồn: tr.46 (2.64); cách quy đồng của Bài 12
- Vấn đề: "Rồi nhân cả tử lẫn mẫu của mỗi phân số với cùng một số." không nói số đó là mẫu số chung chia cho mẫu của phân số đó; hình chỉ hiện `·3`, `·2` mà không nói từ đâu ra. "Cùng một số" còn đọc được là "hai phân số nhân cùng một số", đúng lỗi của nhiễu d (18/42, 16/42) ở `quy-dong-9-14`. Recap chỉ còn câu này nên bé nhớ thiếu bước, nhớ sai cách làm.
- Sửa: "Muốn quy đồng mẫu số hai phân số, ta lấy BCNN của hai mẫu làm mẫu số chung. Lấy mẫu số chung chia cho mẫu của từng phân số, rồi nhân cả tử lẫn mẫu của phân số đó với kết quả." (recap lặp nguyên văn). Thêm dòng `12 : 4 = 3,\ 12 : 6 = 2` trước dòng nhân ở `quy-dong-vi-du` và bản `-xong`. Bài 12 (draft) có cùng câu: xem mục "Cần đối chiếu Bài 12".

### 7. Công thức giải thích của 2.61 bị cắt trên điện thoại (LL-12)

- Vị trí: `$.exercises[52].explain.tex` (`on-tap-chuong-2.ex.bai-2-61`)
- Nguồn: ảnh walk `phone/221-s14-06-exercise-bai-2-61-correct.png`, `phone/220-…-wrong3.png`
- Vấn đề: khối `aligned` bốn dòng với số chín chữ số rộng hơn khung 390px: dòng đầu cụt ở "= 12 34", các dòng sau còn "= (12 3", "= 111 11", "= aaa". Không có dấu hiệu cuộn ngang, bé thấy công thức cụt ở màn giải thích của câu khó nhất bài. Do độ dài nội dung, không phải bố cục app.
- Sửa: bỏ `tex` (lời giải thích và bốn thẻ `order` đã đủ cả chuỗi), hoặc chỉ giữ dòng chốt `111\,111\,111 \cdot a = \overline{aaa\,aaa\,aaa}`. Chạy lại walk, xem ảnh `phone/…-bai-2-61-correct`.

### 8. Đề 2.60 và 2.63 mất dấu câu của sách khi tách khối (LL-23)

- Vị trí: `$.exercises[44].prompt[3]` (thiếu "." sau `3^{2} \cdot 5`), `$.exercises[44].prompt[5]` (thiếu "," sau `2^{3} \cdot 3^{2} \cdot 5`) (`on-tap-chuong-2.ex.bai-2-60`); `$.exercises[41].prompt[7]` (thiếu "." sau `2^{3} \cdot 3^{6}`) (`on-tap-chuong-2.ex.bai-2-63`)
- Nguồn: tr.46, 2.60 và 2.63
- Vấn đề: lời đề câu `bookRef` phải y hệt sách, chỉ được khác dấu cuối lựa chọn và nhãn ý. Ở đây mất dấu kết câu giữa đề, nên trên điện thoại 2.60 đọc thành "…ƯCLN là / 3² · 5 / Biết một trong hai số là / 2³ · 3² · 5 / tìm số còn lại." không thấy ranh giới câu. Chữ và số vẫn đúng; xếp Nghiêm trọng theo đúng luật "đề khác sách", sửa rất nhỏ. Cùng bài, 2.61 đã giữ dấu trong công thức (`37\,037\,037;`).
- Sửa: đưa dấu vào cuối công thức như 2.61: `3^{2} \cdot 5.`, `2^{3} \cdot 3^{2} \cdot 5,`, `2^{3} \cdot 3^{6}.`

## Nên sửa

### 1. Câu nhắc tính chất "đúng một số hạng không chia hết" nói khác câu đã duyệt của Bài 8 (LL-05)

- Vị trí: `$.sections[0].blocks[1].children[0]`, `$.sections[0].recap.caption` (`section.tinh-chat-tong`); `$.sections[4].blocks[0].children[0]`, `$.sections[4].recap.caption` (`section.tong-dau-hieu-2-5`); `$.sections[5].blocks[2].children[0]` (`section.tong-dau-hieu-3-9`)
- Nguồn: Bài 8: "Tổng có đúng một số hạng không chia hết cho một số, các số hạng còn lại đều chia hết cho số đó. Khi đó tổng không chia hết cho số đó."
- Vấn đề: bản viết lại "Một số hạng không chia hết cho số đó, các số hạng khác chia hết, thì tổng ..." bỏ chữ "đúng" (cùng gốc với Nghiêm trọng 1); ở section 5 nó là màn đầu nên "số đó" không trỏ vào số nào, recap section 5 cũng mở bằng câu này. Bài ôn phải nhắc đúng câu bé đã học.
- Sửa: dùng nguyên văn hai câu của Bài 8 ở section 1, 5 và hai recap; section 6 dùng cùng câu với "cho 3" thay "cho một số" hoặc dùng nguyên câu Bài 8. Sửa cùng Nghiêm trọng 1.

### 2. Section `tong-hop-so` dùng hai câu quy tắc không phải câu đã duyệt (LL-05)

- Vị trí: `$.sections[3].blocks[0].children[0]`, `$.sections[3].blocks[1].children[0]`, `$.sections[3].recap.caption`, `$.cards[3].recap.caption`
- Nguồn: Bài 10: "Nếu các số hạng của một tổng đều chia hết cho một số thì tổng chia hết cho số đó. Nếu số đó lớn hơn 1 và tổng lớn hơn số đó thì tổng là hợp số."; Bài 9: "Trong một tích, nếu có một thừa số chia hết cho một số thì tích chia hết cho số đó."
- Vấn đề: "Một tổng chia hết cho một số lớn hơn 1 và nhỏ hơn tổng thì tổng đó là hợp số." và "Một tích chia hết cho mỗi thừa số của nó." đúng toán nhưng không phải câu bé đã học; câu về tích không có ở bài nào.
- Sửa: dùng câu của Bài 10 và câu tích của Bài 9; hình `tich-chia-het` đổi theo (vd "3 · 5 · 8 có thừa số 5 chia hết cho 5").

### 3. Section `dau-hieu-9-5` chỉ nhắc nửa "chia hết" của dấu hiệu, lệch với section 5, 6 cùng bài (LL-05)

- Vị trí: `$.sections[1].blocks[0].children[0]`, `$.sections[1].blocks[1].children[0]`, `$.sections[1].recap.caption`
- Nguồn: Bài 9, dấu hiệu chia hết cho 9 và cho 5 (mỗi quy tắc hai câu)
- Vấn đề: để loại 2 549, 1 234, 7 895 ở câu 4 và biết 23 454 "không chia hết cho 5" ở câu 5 (chính là đáp án), bé cần nửa "không chia hết". Section 5 (cho 2) và section 6 (cho 3) cùng bài lại nói đủ hai câu, và `explain` của `tn4`, `tn5`, `tong-cs-2549` dùng chiều không chia hết.
- Sửa: dùng đủ hai câu của Bài 9 cho 9 và cho 5 ở màn quy tắc; recap có thể giữ một câu mỗi quy tắc nếu dài.

### 4. Ghi "Bài mấy" chưa đúng hay chưa đủ

- Vị trí: `$.overview.summary`; `$.sections[3].title`, `sourceRef` (`tong-hop-so`); `$.sections[5].title`, `$.sections[5].sourceRef`, `$.cards[5].sourceRef` (`tong-dau-hieu-3-9`); `$.sections[11].title` (`tim-so-con-lai`); `$.sections[12].blocks[1].children[0]` (`quy-dong`)
- Nguồn: —
- Vấn đề: `goals` hứa "biết chúng ở bài nào", nhưng: summary nói "ôn lại các bài 8 đến 12" trong khi section 7, 12, 14 nhắc Bài 7, Bài 6, Bài 5; section 4 ghi "Bài 8 và Bài 10" mà quy tắc tích là của Bài 9; section 6 ghi "Bài 9" mà màn thứ ba là tính chất tổng của Bài 8 (2.59c dựa vào nó); section 12 ghi "Bài 12" mà quy tắc chia luỹ thừa là của Bài 6 và câu "Biết tích và một thừa số ..." là Bài 5; section 13 có câu cộng trừ phân số cùng mẫu là kiến thức tiểu học.
- Sửa: summary "Bài này ôn chương II (Bài 8 đến Bài 12), kèm vài quy tắc của Bài 5, 6, 7 cần dùng: ..."; tiêu đề "Nhắc lại Bài 9 và Bài 10: tổng là hợp số", "Nhắc lại Bài 8 và Bài 9: tổng, chia hết cho 3 và cho 9", "Nhắc lại Bài 6 và Bài 12: ƯCLN nhân BCNN"; câu phân số cùng mẫu mở bằng "Nhắc lại kiến thức tiểu học:".

### 5. Section `tim-so-con-lai` dùng quy tắc nhân luỹ thừa của Bài 6 mà không nhắc (LL-05)

- Vị trí: `$.sections[11].blocks[1]`; `$.exercises[43]` (`on-tap-chuong-2.ex.mu-3-trong-tich`) và `explain` của nó
- Nguồn: tr.110 (2.60 cần 3⁴ · 3² = 3⁶ rồi 3⁶ : 3² = 3⁴); Bài 6
- Vấn đề: bước `mu-3-trong-tich` hỏi số mũ trong tích, `explain` dùng "Nhân hai luỹ thừa cùng cơ số thì giữ nguyên cơ số và cộng các số mũ", nhưng section chỉ nhắc quy tắc chia; câu `explain` cũng khác câu đã duyệt của Bài 6.
- Sửa: thêm câu Bài 6 "Nhân hai luỹ thừa cùng cơ số: giữ nguyên cơ số, cộng các số mũ." vào màn thứ hai, trước câu chia; dùng đúng câu đó trong `explain` của `mu-3-trong-tich`.

### 6. Câu "kết luận, vì ..." không nói bé phải chọn cả lý do đúng (LL-10)

- Vị trí: `$.exercises[13].prompt`, `$.exercises[14].prompt` (`bai-2-56a`, `bai-2-56b`), `$.exercises[17].prompt`, `$.exercises[18].prompt`, `$.exercises[21].prompt`, `$.exercises[22].prompt` (`bai-2-59a` đến `bai-2-59d`)
- Nguồn: bàn giao: câu đổi dạng có `note` lệnh app ở cuối đề
- Vấn đề: ở 2.56a ba lựa chọn cùng kết luận "Hợp số", chỉ khác lý do; ở 2.59a-d có lựa chọn đúng kết luận sai lý do. Bé thấy kết luận đúng, chọn và bị chấm sai mà không hiểu vì sao.
- Sửa: thêm `note` cuối đề: "Chọn câu trả lời có cả kết luận và lý do đều đúng."

### 7. Mẹo "Loại hợp số nhanh": câu thứ hai thiếu kết luận và điều kiện

- Vị trí: `$.sections[2].blocks[3]` (`tip.loai-hop-so-nhanh`)
- Nguồn: Bài 10
- Vấn đề: "Số còn lại: cộng các chữ số để thử chia hết cho 3." không nói "thì là hợp số" và sai với 3 (tổng chữ số chia hết cho 3 nhưng 3 là số nguyên tố). Số qua cả hai bước như 49, 77, 91 vẫn là hợp số; tên mẹo dễ làm bé nghĩ số không bị loại là số nguyên tố. Đã thử: 6, 10, 15, 25, 2 335, 3 576 (câu một đúng; máy: không số nguyên tố nào từ 6 tới 100 000 tận cùng 0, 2, 4, 5, 6, 8); 3, 9, 1 143, 201, 461, 499, 49, 77, 91, 119 (câu hai).
- Sửa: "Số lớn hơn 5 có chữ số tận cùng là 0, 2, 4, 5, 6 hoặc 8 thì là hợp số. Số lớn hơn 3 có tổng các chữ số chia hết cho 3 cũng là hợp số. Không loại được thì chưa chắc là số nguyên tố."

### 8. Ví dụ của mẹo giải sẵn hai lựa chọn của câu 2 (LL-07)

- Vị trí: `$.sections[2].blocks[3].tex` (`tip.loai-hop-so-nhanh`); `$.exercises[7]` (`ex.tong-cs-1143`), `$.exercises[9]` (`ex.tn2`)
- Nguồn: —
- Vấn đề: tex "3 576 ⋮ 2; 1 + 1 + 4 + 3 = 9 ⋮ 3" là đúng hai lựa chọn của câu 2, và màn ngay sau hỏi tổng chữ số của 1 143.
- Sửa: đổi ví dụ của mẹo sang số khác, vd `4\,718 \chiahet 2;\quad 2 + 1 + 3 + 3 = 9 \chiahet 3`.

### 9. Giải thích câu 2 kết luận 461 là số nguyên tố chỉ vì "số còn lại"

- Vị trí: `$.exercises[9].explain.text` (`ex.tn2`)
- Nguồn: note `$.sections[2].blocks[2].children[0]` "Số còn lại chưa chắc là số nguyên tố, ví dụ 91 = 7 · 13."
- Vấn đề: "Số còn lại là 461." dạy đúng cách suy luận mà màn trước vừa nói là chưa đủ.
- Sửa: "... Ba số kia là hợp số, nên trong bốn lựa chọn chỉ 461 có thể là số nguyên tố." (vẫn ≤ 3 câu).

### 10. Hình recap không khớp chữ (LL-15)

- Vị trí: `$.cards[0].recap` (`card.tinh-chat-tong`); `$.sections[8].recap` (`section.uoc-bcnn-khang-dinh`)
- Nguồn: —
- Vấn đề: card 1: caption là quy tắc "các số hạng đều chia hết thì tổng chia hết" nhưng hình `tong-12-19` là ví dụ 12 + 19 = 31 không chia hết. Section 9: chữ là hai quy tắc ƯC → ƯCLN, BC → BCNN, còn hình `uc-bc-12-18` vẽ "ƯCLN là ước của BCNN" không có nhãn ƯCLN, BCNN.
- Sửa: card 1 dùng hình `tong-12-18`; section 9 dùng hình gộp `uc-12-18` và `bc-4-6`, hoặc ghi nhãn "ƯCLN(12, 18) = 6", "BCNN(12, 18) = 36" lên `uc-bc-12-18` và đổi caption cho khớp.

### 11. Recap thiếu cách làm chính của bài sách (LL-06)

- Vị trí: `$.sections[7].recap` (`uoc-cua-6`), `$.sections[9].recap` (`bcnn-bai-toan`), `$.cards[10].recap` (`card.so-mu-uclnn-bcnn`), `$.cards[13].recap` (`card.giai-thich-111`)
- Nguồn: tr.46 (2.62, 2.63, 2.61), tr.45 (2.58)
- Vấn đề: recap section 8 không có bước "8 chia hết cho n + 1 thì n + 1 là ước, trừ 1 để tìm n" của 2.62; recap section 10 bỏ vế "Ta tìm BCNN, liệt kê các bội của nó rồi chọn số nằm trong khoảng đề cho" của 2.58; recap card 11 chỉ nói BCNN trong khi 2.63 cần cả ƯCLN; recap card 14 bỏ tính chất kết hợp, đúng bước "Nhóm..." bé phải xếp.
- Sửa: section 8 thay câu thứ hai của caption bằng câu cách tìm n (nâng note `$.sections[7].blocks[3]` thành `rule` nếu cần); section 10 dùng nguyên câu quy tắc đầu (hai câu) và chuyển câu "chia dư như nhau" sang card; card 11 dùng `mu-tim-b-xong` với caption hai câu như recap section; card 14 dùng caption hai câu của recap section.

### 12. Một màu mang hai nghĩa trong bài (LL-05)

- Vị trí: `src/visuals/math/on-tap-chuong-2/catalog.ts`: nhãn "không chia hết" màu `pink` ở section 1, 5, 6; nhãn BCNN màu `pink` (`mu-bcnn`, `mu-tim-b`, `tich-12-18`, `tn263-goi-y`, `tn264a-goi-y`, `tn264b-goi-y`, `bc-4-6`); nhãn "Ước của 13/9" màu `violet` (`nt-vi-du`); nhãn "Có thừa số ..." và nhãn "Bội" màu `blue` (`tich-chia-het`, `tn256a-goi-y`, `tn256b-goi-y`, hình section 9); nhãn "305 có chữ số tận cùng là 5" màu `teal` trên số không chia hết cho 2 (`tn259a-goi-y`)
- Nguồn: `$.concepts`: `pink` = Hợp số, `violet` = Số mũ, `blue` = Quy đồng mẫu số, `teal` = Chữ số tận cùng
- Vấn đề: section 3-4 dạy hồng là "Hợp số", section 1 dùng hồng cho "không chia hết", section 11-13 dùng hồng cho BCNN; tím là số mũ nhưng tô "Ước của"; teal thường đi với "chia hết" lại gắn lên 305 không chia hết cho 2.
- Sửa: nhãn không phải khái niệm của bài dùng `slate`; "Ước của" bỏ `violet`; dòng 305 dùng màu như các dòng "không chia hết"; chọn màu khác `pink` cho nhãn "không chia hết". Màu BCNN chốt cùng Bài 12 (mục "Cần đối chiếu Bài 12").

### 13. Lý do của nhiễu 2.56b nói ngược logic ("dù") (LL-19)

- Vị trí: `$.exercises[14].explain.wrong[2]` (`ex.bai-2-56b`, option d)
- Nguồn: —
- Vấn đề: "Tổng chia hết cho 2 và lớn hơn 2 thì là hợp số, dù là tổng của hai số chẵn." Chính vì là tổng hai số chẵn nên tổng chia hết cho 2; "dù" làm bé nghĩ tổng hai số chẵn thường là số nguyên tố.
- Sửa: "Tổng của hai số chẵn là số chẵn, nên chia hết cho 2; tổng lớn hơn 2 nên là hợp số."

### 14. Nhiễu vô lý ở bước dẫn `tong-2-7` (LL-14)

- Vị trí: `$.exercises[1].options[2]` (`ex.tong-2-7`)
- Nguồn: —
- Vấn đề: "Không, vì 9 chỉ chia hết cho 1, 3 và 9" không ứng với lỗi nào bé hay mắc.
- Sửa: dùng lỗi thật, vd "Không, vì 2 và 7 đều không chia hết cho 9".

### 15. Công thức trong `explain` xuống dòng giữa một phép trên điện thoại (LL-12)

- Vị trí: `explain.tex` của `$.exercises[14]` (`bai-2-56b`), `[17]` (`bai-2-59a`), `[18]` (`bai-2-59b`), `[19]` (`chon-chia-3`), `[21]` (`bai-2-59c`), `[23]` (`lam-truoc-12-binh`), `[25]` (`bai-2-57a`), `[26]` (`bai-2-57b`), `[41]` (`bai-2-63`), `[44]` (`bai-2-60`)
- Nguồn: sheet `phone`, vd `082-s5-07-exercise-bai-2-59a-correct`, `097-s6-06`, `117-s7-07`, `179-s11-06-exercise-bai-2-63-correct`, `191-s12-06-exercise-bai-2-60-correct`
- Vấn đề: dòng TeX dài tự xuống dòng ngay sau "⋮", ":", "−" hay trong ngoặc ("510 ⋮" / "2, 31 005 ...", "= 144 :" / "6 + 14", "(2³ · 3² ·" / "5) = ..."); bé dễ đọc nhầm số chia.
- Sửa: mỗi phép một dòng bằng `\begin{gathered} … \\ … \end{gathered}` (cách `pitfalls.md` cho), vd `27\,220 \chiahet 2 \\ 510 \chiahet 2 \\ 31\,005 \khongchiahet 2`. 2.63 sửa cùng Nghiêm trọng 5.

### 16. Bước dẫn hỏi lại đúng số màn quy tắc vừa in đáp án (LL-07)

- Vị trí: `$.exercises[31]` (`ex.chon-uc-12-18`) sau màn `$.sections[8].blocks[0]` (hình `uc-12-18`); `$.exercises[32]`, `[33]` (`bc-24-4-6`, `c-12-4-6`) sau hình `bc-4-6`
- Nguồn: —
- Vấn đề: màn quy tắc in "1, 2, 3, 6 – Ước chung của 12 và 18", hai màn sau bé được hỏi đúng câu đó; 4, 6, 12 của "BCNN(4, 6) = 12" cũng lặp. Bé chép từ trí nhớ ngắn hạn, không luyện gì.
- Sửa: đổi số của hình ví dụ (vd ƯC của 8 và 12, BCNN của 6 và 9) hoặc của bước dẫn (vd ước chung của 16 và 24).

### 17. Bước "chọn ước của 6" bỏ mất ước 1, đúng chỗ bé hay sót ở 2.62

- Vị trí: `$.exercises[27]` (`ex.chon-uoc-6`), `explain.text`
- Nguồn: tr.110, 2.62 (n ∈ {0; 1; 2; 5})
- Vấn đề: lựa chọn chỉ có 2, 3, 4, 6 nên bé không phải nghĩ tới ước 1, mà ước 1 cho n = 0 là nghiệm bé dễ quên nhất.
- Sửa: lựa chọn 1, 3, 4, 6 (đáp án 1, 3, 6); `explain` "6 = 1 · 6 = 2 · 3 nên 1, 2, 3, 6 là các ước của 6; đừng quên số 1."

### 18. Hình gợi ý 2.58 không cho biết "bài tương tự" là bài gì (LL-15)

- Vị trí: `$.exercises[38].hints.hintVisualId` = `on-tap-chuong-2.visual.tn258-goi-y` (`ex.bai-2-58`)
- Nguồn: tr.45, 2.58; sheet `163/164-s10-07-exercise-bai-2-58-wrong*`
- Vấn đề: "Thử với một bài tương tự" chỉ ở nhãn ẩn; màn hiện "12 – BCNN(4, 6)" rồi "n − 3 = 96, 108, 120…", bé không biết 4, 6, số 3 và n lấy từ đâu.
- Sửa: thêm dòng đầu nêu đề tương tự (vd "Xếp hàng 4 hay hàng 6 đều thừa 3 em, số em từ 100 đến 120"), giữ dòng cuối "n = ?".

### 19. `explain` của 2.59d dựa vào "câu trước" (LL-10)

- Vị trí: `$.exercises[22].explain.text` (`ex.bai-2-59d`)
- Nguồn: tr.110
- Vấn đề: 2.59d nằm trong `practiceIds`, phiên ôn có thể hỏi riêng nó; "Theo câu trước, A không chia hết cho 3" trỏ vào câu bé không vừa làm.
- Sửa: "27 220 không chia hết cho 3, còn 31 005 và 510 chia hết cho 3, nên A không chia hết cho 3. Số chia hết cho 9 thì chia hết cho 3, nên A không chia hết cho 9."

### 20. Section 6, 7, 8, 9 không có ví dụ đời sống (LL-16)

- Vị trí: `$.sections[5]`, `$.sections[6]`, `$.sections[7]`, `$.sections[8]`
- Nguồn: —
- Vấn đề: luật "Ví dụ đời sống ở mọi section Toán"; bốn section chỉ có số trần.
- Sửa: thêm một câu đời sống vào màn ví dụ hay bước dẫn, số nhỏ: vd "6 cái bánh chia đều cho n + 1 bạn"; "12 bút và 18 vở chia đều thành các phần như nhau"; "216 viên bi chia đều cho 3 bạn".

### 21. Màn chạm của section 8 và 10 thiếu dòng "để làm gì"

- Vị trí: `$.sections[7].blocks[2].children[0]` (`chon-uoc-8`), `$.sections[9].blocks[2].children[0]` (`chon-bc-4-6`)
- Nguồn: —
- Vấn đề: có dòng việc phải làm nhưng không nói vì sao (nối với bài sách).
- Sửa: vd "Tìm đủ ước giúp bạn không sót số n nào ở bài 2.62."; "Biết các bội chung giúp bạn chọn đúng số học sinh trong khoảng đề cho."

### 22. Section 6 (chia hết cho 3) chưa có mẹo dù dạng bài có mẹo thật

- Vị trí: `$.sections[5].blocks` (`tong-dau-hieu-3-9`)
- Nguồn: —
- Vấn đề: bài có mẹo "Chia hết cho 9" ở section 2 mà chưa có mẹo cho 3; section 6 còn chỗ (3 màn).
- Sửa: thêm `tip` "Chia hết cho 3" (làm nhanh): "Gạch các chữ số 0, 3, 6, 9. Cộng các chữ số còn lại: tổng chia hết cho 3 thì số đó chia hết cho 3.", `tex` `31\,005:\ 1 + 5 = 6 \chiahet 3`. Đã thử đúng trên 0, 1, 7, 30, 216, 1 234, 27 220, 31 005, 510, 58 735, 999 999. Đặt sau màn quy tắc tổng chữ số, trước `chon-chia-3`.

### 23. Giải thích 2.60 không nói vì sao thừa số 2 mất

- Vị trí: `$.exercises[44].explain.text` (`ex.bai-2-60`)
- Nguồn: tr.110
- Vấn đề: "Chia tích cho số đã biết ..., ta được 3⁴ · 5³." bỏ qua 2³ : 2³ = 1 và 5⁴ : 5 = 5³, đúng chỗ sinh nhiễu b (giữ 2³).
- Sửa: thêm "Chia từng thừa số: 2³ : 2³ = 1 nên thừa số 2 mất, 3⁶ : 3² = 3⁴, 5⁴ : 5 = 5³." (gộp để ≤ 3 câu).

### 24. Hình mẫu tính chất kết hợp đổi chỗ làm phép tính khó hơn

- Vị trí: hình `on-tap-chuong-2.visual.giao-hoan-ket-hop`, `giao-hoan-ket-hop-xong` (`$.sections[13].blocks[0]`, `$.sections[13].recap`)
- Nguồn: Bài 5 (nhóm các thừa số cho ra số tròn rồi mới nhân)
- Vấn đề: 7 · 4 · 25 đổi thành 7 · 25 · 4 rồi nhóm (7 · 25) = 175, trong khi 4 · 25 = 100 vốn đứng cạnh nhau. Hình dạy ngược mục đích đổi chỗ, khác cấu trúc 2.61 (đổi chỗ để hai số "đẹp" đứng cạnh nhau).
- Sửa: dùng ví dụ đổi chỗ có ích, số khác `tn261-goi-y`, vd `4 \cdot 7 \cdot 25 = 7 \cdot (4 \cdot 25) = 7 \cdot 100 = 700`.

### 25. Bước `nhan-12345679-9` quá nặng phép nhân với bé yếu nhân (LL-18)

- Vị trí: `$.exercises[50]` (`ex.nhan-12345679-9`)
- Nguồn: `docs/learner.md` (chỗ yếu: nhân, chia)
- Vấn đề: bước dẫn bắt nhân số tám chữ số với 9, bảy lần nhớ, gõ đủ chín chữ số; `explain` "Nhân từng chữ số, nhớ sang hàng bên cạnh." không chỉ được chỗ sai.
- Sửa: đổi sang `choice` có `check` (111 111 111; 111 111 101; 11 111 111; 101 111 111), hoặc thêm hình đặt tính dừng ở "?" hàng cuối; `explain` nêu vài cột đầu "9 · 9 = 81, viết 1 nhớ 8; 7 · 9 = 63, thêm 8 là 71, viết 1 nhớ 7; cứ thế mọi cột đều ra 1."

## Góp ý

### 1. Mẹo "Tìm khẳng định sai" khó đọc

- Vị trí: `$.sections[0].blocks[3]` (`tip.tim-khang-dinh-sai`)
- Vấn đề: "Khẳng định có chữ luôn hay đều chỉ sai khi..." thiếu ngoặc kép; tex không nói nó bác khẳng định nào.
- Sửa: 'Khẳng định có chữ "luôn" hay "đều" sai khi có một ví dụ làm nó sai...'; tex `2 \not\vdots 3,\ 4 \not\vdots 3,\ 2 + 4 = 6 \chiahet 3`.

### 2. Mẹo "Chia hết cho 9": nói rõ mỗi chữ số gạch một lần

- Vị trí: `$.sections[1].blocks[3]` (`tip.chia-het-9`)
- Vấn đề: mẹo đúng (máy so mọi số 0..200 000), nhưng bé có thể dùng một chữ số cho hai cặp (454), và ví dụ 7 236 gạch hết không còn gì để cộng.
- Sửa: thêm "Mỗi chữ số chỉ gạch một lần. Gạch hết thì số đó chia hết cho 9."

### 3. Nấc 1 tô câu lệnh thay vì biểu thức

- Vị trí: `$.exercises[3].hints.highlight`, `$.exercises[7].hints.highlight` (`tong-cs-2549`, `tong-cs-1143`), `$.exercises[24].hints.highlight[0]` (`dien-46`), `$.exercises[52].hints.highlight[0]` (`bai-2-61`)
- Sửa: tô `block` chứa số hay biểu thức (index 1 ở ba câu đầu, index 5 `12\,345\,679 \cdot a \cdot 9` ở 2.61).

### 4. Nhiễu "Không chia hết cho cả 9 và 5" có hai cách hiểu (LL-10)

- Vị trí: `$.exercises[4].options[3]` (`hai-dau-hieu-34515`)
- Sửa: "Không chia hết cho 9, cũng không chia hết cho 5".

### 5. Bước dẫn dùng nguyên biểu thức câu sách ngay trước câu đó (LL-07)

- Vị trí: `$.exercises[11].prompt[1]` (`so-hang-chia-7`, biểu thức 2.56a); `$.exercises[23]` (`lam-truoc-12-binh`, biểu thức 2.57a); `$.exercises[19]` (`chon-chia-3`, ba số hạng của 2.59)
- Vấn đề: theo thiết kế bước dẫn dùng số của câu sách, nhưng phiên ôn có thể hỏi cùng biểu thức hai lần liền.
- Sửa: tuỳ tác giả: hỏi riêng một số hạng (vd "49 · 53 có chia hết cho 7 không?") hay biểu thức khác số.

### 6. Số lặp giữa note, bước dẫn và hình gợi ý (LL-07)

- Vị trí: 91 ở `$.sections[2].blocks[2]` và `$.exercises[12]` (`tong-91`); hình `tn263-goi-y` lặp số của `tim-b-mu-nho`, `tim-a-mu-lon`; hình `tn264a-goi-y` (5/6, 3/4) trùng hình `tru-vi-du`
- Sửa: bước `tong-91` dùng số khác (vd 119 = 70 + 49); hình gợi ý 2.63 dùng cặp luỹ thừa mới, dừng ở "?"; hình 2.64a dùng cặp khác (vd 3/8 + 5/12).

### 7. Lời `wrong` của `tong-2-7` có hai chữ "không" khó đọc

- Vị trí: `$.exercises[1].explain.wrong[0]`
- Sửa: "Khi cả hai số hạng đều không chia hết, phải tính tổng mới biết."

### 8. Nhấn chữ "sai", "không" của đề như sách

- Vị trí: `$.exercises[2].prompt[0]`, `$.exercises[6].prompt[0]`, `$.exercises[10].prompt[0]`
- Vấn đề: sách in đậm để bé không bỏ sót chữ phủ định; app hiện chữ thường. Nếu khung hỗ trợ nhấn trong `note` thì dùng (chữ vẫn y sách).

### 9. Recap card `dau-hieu-9-5` chỉ có quy tắc chia hết cho 5

- Vị trí: `$.cards[1].recap`
- Sửa: dùng câu chia hết cho 9 (ý chính của câu 4, 5) hoặc hình `chia-9-4536-xong`.

### 10. Bố cục app (không chặn bài, báo người làm app)

- Vị trí: đề 2.56b xuống dòng giữa tích (`phone/068-s4-07-exercise-bai-2-56b`); khung tô nấc 1 của đề 2.58 không có lề trong (`phone/163-…-bai-2-58-*`)
- Sửa: ngắt dòng công thức ở dấu "+"; thêm padding cho khung highlight `block`.

### 11. `explain` của 2.58 và hình `thua-xep` dùng n mà không nói n là gì

- Vị trí: `$.exercises[38].explain` (`bai-2-58`); hình `thua-xep`
- Sửa: thêm "Gọi n là số học sinh." vào `explain.text`; dòng nhãn "n là số em" trên hình.

### 12. Hình gợi ý câu hỏi 6 không cho thấy a, b, c là số nào

- Vị trí: `$.exercises[34].hints.hintVisualId` (`tn6`) → `tn6-goi-y`
- Vấn đề: "a = 4, b = 10, c = 20" chỉ ở nhãn ẩn; ba chỗ dùng ba phản ví dụ khác nhau (4, 6, 12; 4, 10, 20; 6, 10, 30).
- Sửa: thêm dòng đầu "a = 4, b = 10, c = 20"; cân nhắc cho `explain` dùng lại bộ 4, 6, 12 của bước `c-12-4-6`.

### 13. Bước `chon-bc-60` không nói khoảng 195 đến 295 ở đâu ra

- Vị trí: `$.exercises[37]`
- Sửa: thêm "Bớt 5 em ở cả hai đầu khoảng: từ 200 − 5 = 195 đến 300 − 5 = 295."

### 14. Câu đề bước `bot-5-em` thiếu động từ

- Vị trí: `$.exercises[36].prompt[0]`
- Sửa: "Xếp thành hàng 10, hàng 12 hay hàng 15 người thì lần nào cũng thừa 5 em. Bớt 5 em đi thì xếp vừa hết. Số em còn lại là gì của 10, 12 và 15?"

### 15. Lý do sai của lựa chọn b ở 2.59d nói chưa chính xác

- Vị trí: `$.exercises[22].explain.wrong[0]`
- Sửa: "Một số hạng chia hết cho 9 chưa đủ để biết tổng có chia hết cho 9 không."

### 16. Có thể thêm mẹo tránh sai cho 2.62 và 2.58

- Vị trí: `$.sections[7]`, `$.sections[9]`
- Sửa: section 10 thêm `tip` tránh sai "Tìm được bội chung rồi thì cộng lại số dư: 240 + 5, không phải 240."; section 8 gộp ý "ước 1 cho n = 0" vào note màn `tim-n-8`.

### 17. Màn "ƯCLN là ước của BCNN" thiếu mắt xích

- Vị trí: `$.sections[8].blocks[2].children[0]`
- Sửa: "ƯCLN là ước của a, còn a là ước của BCNN. Vì vậy ƯCLN là ước của BCNN."

### 18. Phân số hiển thị nhỏ

- Vị trí: `$.exercises[46..48]`, hình `quy-dong-vi-du`, `tru-vi-du`, `tn264a-goi-y`, `tn264b-goi-y`
- Sửa: đổi `\frac` sang `\dfrac` như Bài 11.

### 19. Ký hiệu "⇒" chưa có ở bài nào đã xuất bản

- Vị trí: `explain.tex` của `tim-b-mu-nho`, `tim-a-mu-lon`, `bai-2-63`; tip `chia-het-9`
- Sửa: dùng chữ "nên" trong `text`; bỏ khi sửa Nghiêm trọng 5.

### 20. Từ "dòng biến đổi" khó với lớp 6

- Vị trí: `$.exercises[52].prompt[4].text`
- Sửa: "Bắt đầu từ biểu thức sau, sắp xếp các bước giải thích theo thứ tự đúng."

### 21. Lý do cho cùng một kiểu sai ở 2.64a và 2.64b khác nhau

- Vị trí: `$.exercises[48].explain.wrong` (lựa chọn 6/60)
- Sửa: "Mới đổi mẫu thành 60 mà chưa nhân cả tử, nên chưa đúng." (như 2.64a).

### 22. Câu nối section `so-mu-uclnn-bcnn` không nói "nhỏ nhất trong số nào"

- Vị trí: `$.sections[10].blocks[2].children[0]`
- Sửa: "Với mỗi thừa số nguyên tố, số mũ nhỏ nhất trong các số là số mũ trong ƯCLN, số mũ lớn nhất là số mũ trong BCNN."

### 23. Mẹo "Tìm số còn lại của hai số" gần như gộp hai câu quy tắc

- Vị trí: `$.sections[11].blocks[2]` (`tip.tim-so-con-lai`)
- Vấn đề: mẹo đúng (đã thử (12, 18), (1, 7), (5, 5), (10, 20), (4, 6), (9, 1), (360, 10 125); ba số bị loại đúng), nhưng chỉ nối hai quy tắc ngay trên.
- Sửa: tuỳ tác giả; có thể thêm "với số viết dạng luỹ thừa, cộng số mũ ở ƯCLN và BCNN rồi trừ số mũ của số đã biết, từng thừa số".

### 24. Nhiễu yếu ở bước `doi-cho-9-a` (LL-14)

- Vị trí: `$.exercises[49].options[1]` (`12\,345\,679 + 9 + a`)
- Sửa: thay bằng `12\,345\,679 \cdot 9 + a`.

### 25. Dấu ";" lơ lửng sau ô trống của 2.63, id ô nhảy số

- Vị trí: `$.exercises[41].segments[2]`, id `b1`, `b3`
- Sửa: bỏ ";" ở `segments`, đặt id `b1`, `b2`.

### 26. Hình `nhan-111` khai báo mà bài không dùng

- Vị trí: `src/visuals/math/on-tap-chuong-2/catalog.ts`, mục `"nhan-111"`
- Sửa: xoá mục, hoặc gắn vào mẹo `tip.nhan-111`.

### 27. Nhãn ẩn của hình gợi ý câu 2 nói "bốn số" mà hình có ba số (LL-15)

- Vị trí: `catalog.ts`, `tn2-goi-y.label` ("Thử với bốn số khác"), dùng ở `$.exercises[9].hints.hintVisualId`
- Sửa: "Thử với ba số khác".

## Cần đối chiếu Bài 12 (`boi-chung-boi-chung-nho-nhat`, còn draft, không tính mức lỗi)

Mọi chỗ BCNN của bài đã soát độc lập và đúng toán. Khi Bài 12 xuất bản, so lại:

1. `$.sections[8].blocks[1]` "Bội chung của hai số đều là bội của BCNN của hai số đó." không có trong Bài 12 draft (Bài 12 có câu `rule` "Muốn tìm các bội chung, ta tìm BCNN rồi nhân BCNN đó lần lượt với 1, 2, 3 và cứ thế tiếp."). Dùng đúng câu của Bài 12 khi nó được duyệt. Câu này cũng lệch dạng với câu ƯC cùng màn ("của hai hay nhiều số" so với "của hai số").
2. `$.sections[9].blocks[0]` trùng nguyên văn câu `rule` của Bài 12 draft: giữ nếu Bài 12 giữ.
3. `$.sections[9].blocks[1]` "Chia cho nhiều số đều dư như nhau thì bớt số dư đi ..." khác cách nói của Bài 12 draft ("Hàng nào cũng dư cùng một số bạn thì bớt số dư đó đi trước ... nhớ cộng số dư lại ở cuối"): thống nhất một câu.
4. `$.sections[10].blocks[1]` (quy tắc BCNN theo số mũ lớn nhất), `$.sections[11].blocks[0]` (tích ƯCLN và BCNN), `explain` của `bcnn-10-12-15` trùng câu Bài 12 draft: soát lại khi Bài 12 xuất bản.
5. Câu quy đồng (Nghiêm trọng 6): Bài 12 draft "Sau đó nhân cả tử số lẫn mẫu số của mỗi phân số với cùng một số." cùng thiếu bước tìm số nhân. Sửa một câu chung rồi dùng ở cả hai bài.
6. Màu BCNN: nhãn BCNN `pink` khớp glossary và Bài 12 draft, nhưng trong bài này `pink` còn là khái niệm "Hợp số" (Nên sửa 12). Chốt ở cấp glossary khi Bài 12 xuất bản; cân nhắc thêm concept BC, BCNN cho bài ôn.
7. Bài 12 draft dùng BCNN(14, 21) và ví dụ quy đồng mẫu 4, 6: trùng bước `bcnn-14-21`, hình `quy-dong-vi-du` của bài này, và BCNN(14, 21) là số của 2.64a (LL-07 phía Bài 12).
8. Cách viết "BCNN(4, 6)" (dấu phẩy), tên section "Nhắc lại Bài 11 và Bài 12", "Nhắc lại Bài 12", mẹo "Tìm BCNN từ ƯCLN" (điều kiện "hai số khác 0") khớp Bài 12 draft hiện tại. Bài 12 draft cũng dùng "⇒".
