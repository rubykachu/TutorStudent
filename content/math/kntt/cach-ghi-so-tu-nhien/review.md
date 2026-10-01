# Review: Cách ghi số tự nhiên (`cach-ghi-so-tu-nhien`)

- Bài: `content/math/kntt/cach-ghi-so-tu-nhien/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/cach-ghi-so-tu-nhien/` - sbt-p7, sbt-p8, sbt-p9, sbt-p10, sbt-p94, sbt-p95
- `content:check`: 0 lỗi, 1 cảnh báo của bài (145 id chưa có trong `ids.lock.json`: đúng với bài chưa duyệt)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/cach-ghi-so-tu-nhien/`; `visual:shot` 176/176
- Kết luận: Chưa đạt: còn 8 lỗi Nghiêm trọng
- Bản đã review: `299b9a64f115b11f6188bd3178ffeb634fe64198908db212621bb0d259fc2cdb` (`pnpm content:diff` so với bản này)

Kết quả kiểm 13 lỗi Nghiêm trọng vòng 1 (sửa ở commit `48b36fa`): 9 lỗi đã sửa dứt (vòng 1 số 3, 4, 5, 7, 9, 10, 11, 12, 13), ba trong số đó còn để lại Nên sửa nhỏ (số 7: điều kiện nằm ở câu riêng nên recap mất nó, Nên sửa 10; số 9: lựa chọn que lặp, Nên sửa 13; số 10: hình recap thiếu ca "đặt cuối", Nên sửa 15). Bốn lỗi sửa chưa dứt hay sinh lỗi mới: số 1 (câu giá trị bỏ vế "theo hàng nó đứng" nên mất cách ghép hàng với số để nhân, Nghiêm trọng 2), số 6 (mẹo mới `tach-cum` đúng 30/30 số nhưng ví dụ là số của bài 1.19, dòng công thức bị cắt trên điện thoại, và ý "khoanh cụm trước" chưa vào câu quy tắc: Nghiêm trọng 3, 4, 6), số 8 (`la-ma-bang-29` làm đúng câu "Sửa" của vòng 1 nhưng nhiễu XIXX cũng bằng 29 theo cách đọc của bài: Nghiêm trọng 5) và số 2 (ba câu đã viết lại, nhưng còn sót câu `chu-so` mà vòng 1 không ghi: Nghiêm trọng 1). Hai câu "Sửa" Nên sửa của vòng 1 (15, 25) đem vào bài thành Nghiêm trọng 7, 8. Năm trong tám Nghiêm trọng vòng này sinh ra từ câu "Sửa" của vòng 1: tác giả nên tự thử lại mỗi câu "Sửa" dưới đây (số, nhiễu, đời sống thật, trùng sách) trước khi chép vào bài.

Ghi chú của Tổng hợp: thư mục ảnh walk không còn trên đĩa lúc tổng hợp; phát hiện về hình dựa vào ảnh reviewer đã xem. Tổng hợp nâng hai mục từ Nên sửa lên Nghiêm trọng: câu quy tắc `chu-so` giữ cụm 8 chữ của khung "Kiến thức cần nhớ" (Nghiêm trọng 1, nhóm 1 ghi Nên sửa; cùng chuẩn với Nghiêm trọng 2 vòng 1 đã tính cụm 6 chữ "bằng tổng giá trị các thành phần" là chép), và câu `chon-tong-4` là bài 1.13 đổi thành câu chọn (Nghiêm trọng 8, nhóm 3 ghi Nên sửa; cùng kiểu `la-ma-bang-14` vòng 1 đã tính Nghiêm trọng). Gộp trùng: mẹo `tach-cum` bị cắt (nhóm 1 ghi ở "Ngoài phạm vi", nhóm 2 Nghiêm trọng 2); chữ thay số ở hai mẹo (nhóm 2 Góp ý 2, nhóm 3 Góp ý 1); các id lệch nội dung (nhóm 1 Góp ý 6, nhóm 2 Góp ý 1). Phát hiện riêng của Tổng hợp: ba cách nói điều kiện "từ hai chữ số trở lên" (gộp vào Nên sửa 10), "thêm" và "viết thêm" (gộp vào Góp ý 15). Không bỏ phát hiện nào. Câu "Sửa" của Nghiêm trọng 3-6 và Nên sửa 11, 14 đã được xếp để không đụng nhau: chỉ còn 29 là số La Mã có cụm mà sách không dùng (sách dùng 14, 19, 24), nên 29 dành cho hình recap đọc số và màn chạm, câu `la-ma-bang-29` đổi số.

## Nghiêm trọng

### 1. Câu quy tắc "mười chữ số" giữ nguyên cụm "chữ số đầu tiên bên trái phải khác 0" của sách

- Vị trí: `$.sections[1].blocks[0].children[0].text`, `$.sections[1].recap.caption`, `$.cards[1].recap.caption` (`section.chu-so`, `card.chu-so`); lặp ở `$.exercises[8].explain.text` (`ex.viet-dung-so`). LL-08
- Nguồn: tr.7 `sbt-p7.png`, kiến thức cần nhớ 3 ý 1
- Vấn đề: Vế thứ hai trùng từng chữ cụm 8 chữ trong ngoặc của khung "Kiến thức cần nhớ". Vòng 1 (Nghiêm trọng 2) đã tính các câu chỉ giữ một cụm của khung này là chép, và LL-08 ghi khung "Kiến thức cần nhớ" là chỗ dễ chép nhất; câu này sót ở vòng 1. Nhóm 1 xếp Nên sửa vì vế đầu đã viết lại; Tổng hợp nâng lên để cùng chuẩn với vòng 1. Cụm này viết khác dễ, không phải kí hiệu ngắn.
- Sửa: "Số tự nhiên viết bằng các chữ số từ 0 đến 9. Số có từ hai chữ số trở lên không bắt đầu bằng chữ số 0." Recap section, recap card lặp nguyên văn; `explain` của `viet-dung-so` đổi theo ("Số có từ hai chữ số trở lên không bắt đầu bằng chữ số 0, nên chỉ 508 và 7 040 viết đúng.").

### 2. Câu quy tắc giá trị không còn nói hàng nào nhân với số nào

- Vị trí: `$.sections[4].blocks[0].children[0].text`, `$.sections[4].recap.caption`, `$.cards[4].recap.caption` (`section.gia-tri`, `card.gia-tri`). LL-20, LL-17
- Nguồn: tr.7 `sbt-p7.png` (kiến thức cần nhớ 3); lời giải 1.17 tr.95 (7 × 100 000, 2 × 10 000, 8 × 1 000, 3 × 10, 1)
- Vấn đề: "Giá trị của một chữ số là chữ số đó nhân với 1, 10, 100, 1 000 và cứ thế. Mỗi hàng sang trái, số nhân thêm một chữ số 0." Bản sửa vòng 1 bỏ vế "theo hàng nó đứng" mà không đặt vào đâu khác. Câu không nói hàng đơn vị nhân 1, hàng chục nhân 10; câu thứ hai chỉ nói "thêm" so với hàng bên phải mà không có hàng mở đầu. Đọc đúng chữ, bé không biết chữ số 7 trong 7 214 nhân với số nào. "Số nhân" là từ bài chưa dạy, và "số nhân thêm một chữ số 0" dễ đọc thành "con số được nhân thêm". Phiên ôn card chỉ có câu này và hình `gia-tri-tom-tat`; hình có cột hàng nên đỡ một phần, nhưng câu bé phải nhớ vẫn thiếu.
- Sửa: "Chữ số ở hàng đơn vị thì nhân với 1, ở hàng chục nhân với 10, ở hàng trăm nhân với 100. Mỗi hàng sang trái, số để nhân có thêm một chữ số 0." Recap section, recap card lặp nguyên văn. Nhóm 1 đã thử câu này với 7 214, 40 618, 728 031, 3 482, 5 056: đúng cả 5.

### 3. Quy tắc và recap "đọc số La Mã" không nói khoanh IV, IX trước, nên đọc XIV ra 16

- Vị trí: `$.sections[7].blocks[0].children[0].text`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption` (`section.doc-so-la-ma`, `card.doc-so-la-ma`); hình recap `doc-la-ma-tom-tat` (XXX, không có cụm). LL-17, LL-06
- Nguồn: tr.7 kiến thức cần nhớ 4 ("các thành phần viết nên nó")
- Vấn đề: "Tách số thành các thành phần rồi cộng giá trị của chúng" không chỉ một cách tách: theo section 7, I và V đều là thành phần, nên tách XIV thành X, I, V vẫn đúng chữ của quy tắc và ra 16. Tách từng chữ như vậy sai ở 6 trong 30 số của bài (4, 9, 14, 19, 24, 29; bảng thử của nhóm 2). Ý quyết định chỉ nằm ở mẹo, không có trong câu bé phải nhớ, không có trong recap card (phiên ôn chỉ hiện recap), và hình recap dùng XXX nên không cho thấy cụm. Đây là lỗi vòng 1 đã ghi cho mẹo cũ (Nghiêm trọng 6), nay nằm ở câu quy tắc.
- Sửa: "Muốn đọc số La Mã, khoanh các cụm IV, IX trước, rồi cộng giá trị của các cụm và các chữ số còn lại." Recap lặp nguyên văn; hình recap dùng XXIX (X + X + IX = 29). Khi đó mẹo `tach-cum` chỉ nhắc lại quy tắc (mẹo gượng): bỏ mẹo, việc này cũng xoá luôn Nghiêm trọng 4 và phần mẹo của Nghiêm trọng 6. Câu `la-ma-bang-29` phải đổi số để khỏi trùng recap (Nghiêm trọng 5).

### 4. Ví dụ của mẹo `tach-cum` bị cắt trên điện thoại: "XIV = X + IV = 10 + 4 = 1"

- Vị trí: `$.sections[7].blocks[1].tex` (`tip.tach-cum`), cả trang "Mẹo hay". LL-12
- Nguồn: walk điện thoại `105-s8-02-block.png`, `001-tips` (iPad hiện đủ)
- Vấn đề: Dòng đầu của `gathered` rộng hơn khung điện thoại, chữ số 4 của 14 mất; bé đọc XIV = 1 ngay ở màn dạy tránh sai khi đọc XIV. Do nội dung (một dòng năm vế; `gathered` không tự xuống dòng), không phải bố cục app.
- Sửa: Bỏ mẹo theo Nghiêm trọng 3. Nếu giữ mẹo: mỗi dòng tối đa ba vế, vd `\mathrm{XXIX} = \mathrm{X} + \mathrm{X} + \mathrm{IX}` rồi dòng `= 10 + 10 + 9 = 29` (số theo Nghiêm trọng 6); chụp lại walk điện thoại.

### 5. Câu `la-ma-bang-29` có hai đáp án đúng theo cách đọc của bài: XIXX cũng bằng 29

- Vị trí: `$.exercises[42].options[2]` (XIXX), `$.exercises[42].explain` (`ex.la-ma-bang-29`). LL-01, LL-20
- Nguồn: tr.7 kiến thức cần nhớ 4 (giá trị bằng tổng giá trị các thành phần)
- Vấn đề: Bé làm đúng quy tắc section 8 và mẹo `tach-cum`: XIXX là X, IX, X, cộng 10 + 9 + 10 = 29, nên chọn cả a lẫn c. Bài chưa dạy "cách ghi sai thứ tự thì không có giá trị"; luật "chục trước, đơn vị sau" chỉ thuộc việc viết (section 9). `explain` chỉ nói chung "không ghép đúng thành phần", không có `wrong` cho c. Lựa chọn này đến từ câu "Sửa" của vòng 1 (Nghiêm trọng 8), vốn loại XXVIIII vì cùng lý do nhưng không thử XIXX.
- Sửa: Vì 29 dành cho recap (Nghiêm trọng 3), đổi câu thành "Số La Mã nào có giá trị 27?" với XXVII (đúng), XVII (17), XXVIII (28), XXIIX (khoanh IX: 10 + 10 + 1 + 9 = 30); đổi id thành `la-ma-bang-27`, `explain` và `wrong` cho cả ba nhiễu. Quy tắc chung: mọi nhiễu của câu đọc phải có tổng thành phần (khoanh cụm trước) khác giá trị hỏi; không dùng XIXX, XXVIIII, IXXX cho 29.

### 6. Số của bài trùng số và đáp án của bài tập 1.10, 1.19 trong sách

- Vị trí: `$.sections[7].blocks[1]` (`tip.tach-cum`: XIV = 14, XVI = 16); hình `lon-nhat-vd` dòng 999 999 "sáu chữ số" (`$.sections[10].blocks[0].children[1]`), kéo theo `be-nhat-vd` dòng 100 000; hình `chon-viet-21` (XXI, `$.sections[8].blocks[2].children[1]`). LL-08, LL-20
- Nguồn: tr.9 bài 1.10 ("số tự nhiên lớn nhất có 6 chữ số"), lời giải tr.94 (999 999); tr.10 bài 1.19 (đọc XIV, XVI, XIX, XXI)
- Vấn đề: Mẹo giải sẵn hai trong bốn ý của 1.19 kèm đáp số (ví dụ này do câu "Sửa" vòng 1 đề xuất); hình ví dụ màn quy tắc section 11 in đúng đáp án 1.10. Cùng kiểu `la-ma-bang-14` vòng 1 đã tính là chép. `chon-viet-21` là ý XXI của 1.19 đảo chiều (đọc thành viết), nhẹ hơn nhưng cùng số.
- Sửa: Mẹo: bỏ theo Nghiêm trọng 3 (giữ thì dùng XXIX và IV/VI). `lon-nhat-vd`, `be-nhat-vd` thay dòng sáu chữ số bằng tám chữ số (99 999 999, 10 000 000; năm chữ số trùng câu ôn `may-dem-buoc-lon-nhat`). `chon-viet-21`: dùng số khác 14, 16, 19, 21, 24, 26 và chưa có ở câu khác, vd "Truyện bạn đọc có chương 28 ghi bằng số La Mã. Chạm vào cách viết đúng số 28." (XXVIII, XXIIX, VIIIXX, XXVII); làm cùng lúc với Nên sửa 11 (màn chạm `chon-xxviii` đổi sang XXIX) để 28 không lặp.

### 7. Tình huống "mật mã khoá cặp bé nhất là 102" sai ngoài đời: khoá số đặt được mật mã bắt đầu bằng 0

- Vị trí: `$.sections[11].blocks[2].children[0].text` (note màn chạm), hình `chon-khac-nhau-3` (`done`: "Mật mã bé nhất có ba chữ số khác nhau là 102."). LL-17, LL-20
- Nguồn: —
- Vấn đề: Khoá số của cặp, vali đặt được 012; mật mã ba chữ số khác nhau bé nhất ngoài đời là 012, không phải 102. Màn khẳng định 102 và bảo "làm vậy bạn nhớ số đó bắt đầu bằng 1 rồi 0": dạy bé điều sai về đồ vật bé đang dùng, đúng ở màn dùng tình huống để nhớ quy tắc "chữ số đầu khác 0". Tình huống đến từ câu "Sửa" của Nên sửa 15 vòng 1, vốn đề xuất cho mật mã lớn nhất.
- Sửa: Dùng đồ vật mà số không bắt đầu bằng 0, vd "Số nhà trên con phố có ba chữ số khác nhau. Chạm vào số nhà bé nhất." hay số trang sách; đổi `done` theo ("Số nhà bé nhất có ba chữ số khác nhau là 102.").

### 8. Câu luyện tập `chon-tong-4` và câu kho ôn `tap-hop-tong-4-tram-2` là bài 1.13 đổi thành câu chọn

- Vị trí: `$.exercises[91]` (`ex.chon-tong-4`, `practiceIds` của `section.tong-chu-so`), `$.exercises[93]` (`ex.tap-hop-tong-4-tram-2`). LL-08, LL-20
- Nguồn: tr.9 bài 1.13 ("các số tự nhiên có ba chữ số mà tổng các chữ số của nó bằng 4"); lời giải tr.94-95 (10 số, có 202, 121, 211, 220, 400)
- Vấn đề: Đề `chon-tong-4` gần nguyên văn bài 1.13 (chỉ bỏ "tự nhiên", "của nó"), cùng số 4; hai đáp án 202, 121 nằm trong lời giải sách. Câu ôn lấy một phần lời giải ({202; 211; 220}) và nhiễu 400 cũng của lời giải. Cùng kiểu `la-ma-bang-14` (bài 1.20 đảo thành câu chọn) vòng 1 đã tính Nghiêm trọng; nhóm 3 xếp Nên sửa, Tổng hợp nâng lên để cùng chuẩn. Câu ôn sinh ra từ câu "Sửa" của Nên sửa 25 vòng 1.
- Sửa: Đổi tổng, không dùng 4 và không dùng 2, 3 (đã có ở câu kiểm tra, ví dụ, recap): câu luyện tập "Chọn tất cả số có ba chữ số mà tổng các chữ số bằng 5." với 203, 131, 302, 412 (đáp án 203, 131, 302); câu ôn "hàng trăm là 4, tổng các chữ số bằng 6" ({402; 411; 420}, nhiễu {402; 411}, {402; 411; 420; 600}, {204; 411; 420}). Đổi màn chạm `chon-tong-5` sang tổng khác (vd 6, bỏ các số trùng câu ôn) để câu luyện tập không lặp màn chạm.

## Nên sửa

### 1. Câu hướng dẫn màn chạm ℕ* chen câu rổ cam không nối với việc phải làm

- Vị trí: `$.sections[0].blocks[2].children[0].text` (`section.so-tu-nhien`). LL-25, LL-10
- Nguồn: walk `010-s1-03-block`
- Vấn đề: "Chạm vào các số thuộc ℕ*, nhớ rằng rổ cam hết thì bạn đếm được 0 quả. Làm vậy bạn nhớ số 0 không thuộc ℕ*." Đọc liền, bé có thể hiểu rổ cam hết là lý do 0 không thuộc ℕ*, trong khi đếm được 0 quả cho thấy 0 là số tự nhiên. Bản vá ví dụ đời sống của Nên sửa 15 vòng 1 đặt sai chỗ.
- Sửa: Đưa ví dụ đời sống thành một câu riêng ở màn quy tắc ℕ ("Rổ cam đã hết, bạn đếm được 0 quả: 0 cũng là một số tự nhiên."). Màn chạm: "Chạm vào các số thuộc ℕ*. Làm vậy bạn nhớ số 0 không thuộc ℕ*."

### 2. Đề "cách viết đúng một số tự nhiên" đọc được thành "đúng một"

- Vị trí: `$.exercises[8].prompt[0].text` (`ex.viet-dung-so`). LL-10
- Nguồn: —
- Vấn đề: "Chọn tất cả cách viết đúng một số tự nhiên." ngắt được thành "viết | đúng một số", trái với câu chọn nhiều đáp án.
- Sửa: "Cách viết nào đúng? Chọn tất cả."

### 3. Câu quy tắc đổi hàng mất chữ "liền", lệch câu ôn của chính section

- Vị trí: `$.sections[3].blocks[0].children[0].text`, `$.sections[3].recap.caption`, `$.cards[3].recap.caption` (`section.muoi-don-vi`); nhãn hình `doi-hang-tom-tat`; so với `$.exercises[19]` (`ex.hang-lien-ben-trai`). LL-20, LL-05
- Nguồn: tr.7 `sbt-p7.png`
- Vấn đề: "… được 1 đơn vị ở hàng bên trái nó": mọi hàng bên trái đều là "hàng bên trái nó", nên theo chữ 10 chục cũng có thể thành 1 nghìn. Câu ôn `hang-lien-ben-trai` lại hỏi với đáp án "hàng liền bên trái". Một quy tắc hai cách nói.
- Sửa: "Đổi 10 đơn vị ở một hàng thì được 1 đơn vị ở hàng liền bên trái nó." Recap section, recap card, nhãn `doi-hang-tom-tat` đổi theo.

### 4. Ví dụ của mẹo "Giá trị của chữ số" không chỉ ra chữ số nào; câu mẹo khó đọc

- Vị trí: `$.sections[4].blocks[2]` (`tip.gia-tri-nhanh`): `tex`, `text`; cả trang "Mẹo hay". LL-15, LL-25
- Nguồn: walk `064-s5-03-block`, `001-tips`
- Vấn đề: `tex` "36 450 → 6 000" không tô chữ số 6 trong 36 450, bé dễ đọc "36 450 biến thành 6 000"; ở trang "Mẹo hay" mẹo đứng một mình. "viết thêm bấy nhiêu chữ số 0 bằng số chữ số đứng sau nó" rối.
- Sửa: `tex` `3\concept{blue}{6}\,450:\ \concept{blue}{6} \to \concept{pink}{6\,000}`. `text`: "Viết chữ số đó, rồi viết thêm các chữ số 0. Sau nó có mấy chữ số thì viết thêm mấy chữ số 0. Chữ số 0 thì giá trị luôn là 0."

### 5. Ô điền giá trị chữ số chỉ nhận "800", không nhận cách viết tích mà hình của bài dạy

- Vị trí: `$.exercises[24].segments[1].accept` (`ex.dien-gia-tri-8-trong-4826`)
- Nguồn: lời giải 1.17 tr.95 ("8 × 1 000"); hình `gia-tri-mau`, `gia-tri-kham-pha`, `gia-tri-tom-tat`
- Vấn đề: Ô gõ tự do; mọi hình giá trị ghi dạng tích, nên bé gõ "8 · 100" hay "8 x 100" bị chấm sai dù đúng.
- Sửa: Thêm "8 · 100", "8.100", "8 x 100", "8x100", "8×100" vào `accept`; hoặc đổi đề thành "… có giá trị bằng số nào? Viết thành một số."

### 6. Giải thích dùng từ mới "giá trị hàng", khác tên khái niệm của bài

- Vị trí: `$.exercises[25].explain.text`, `$.exercises[25].explain.wrong[0].text` (`ex.tong-cua-635`). LL-05
- Nguồn: walk `085-s6-05-exercise-tong-cua-635-correct`
- Vấn đề: "nhân với giá trị hàng của nó", "chưa nhân với giá trị của hàng": bài chỉ có "giá trị của chữ số" (màu hồng); hai tên gần nhau làm bé lẫn giá trị của chữ số với số để nhân.
- Sửa: "Mỗi chữ số nhân với 1, 10 hay 100 theo hàng của nó, rồi cộng lại." và "6 + 3 + 5 chỉ cộng các chữ số, chưa nhân với 100, 10 theo hàng."

### 7. Công thức giải thích xuống dòng giữa phép nhân trên điện thoại

- Vị trí: `$.exercises[26].explain.tex` (`ex.viet-so-5032`); `$.exercises[28].explain.tex` (`ex.viet-so-3405`, cùng độ dài). LL-12
- Nguồn: walk điện thoại `089-s6-06-exercise-viet-so-5032-wrong3`, `090-…-correct`
- Vấn đề: Hiện "5 · 1000 + 0 · 100 + 3 ·" rồi xuống dòng "10 + 2 = 5 032": phép nhân bị bỏ lửng.
- Sửa: `\begin{gathered} 5 \cdot 1\,000 + 0 \cdot 100 + 3 \cdot 10 + 2 \\ = 5\,032 \end{gathered}`, làm giống cho `viet-so-3405`; chạy lại walk.

### 8. Câu quy tắc section 7 thiếu "đến 30" và "giá trị không đổi dù đứng ở đâu", trong khi `explain` dùng ý đó

- Vị trí: `$.sections[6].blocks[0].children[0].text`, `$.sections[6].recap.caption`, `$.cards[6].recap.caption` (`section.chu-la-ma`); `$.exercises[35].explain.text` (`ex.dien-gia-tri-ix`). LL-09, LL-17
- Nguồn: tr.7 kiến thức cần nhớ 4
- Vấn đề: "Số La Mã được ghép từ năm thành phần" là câu đóng không nói phạm vi (`overview.summary` nói "đến 30"). Ý "giá trị không đổi dù đứng ở đâu" chỉ có trong lời giải một câu ôn.
- Sửa: "Số La Mã đến 30 được ghép từ năm thành phần: … Giá trị của chúng là 1, 5, 10, 4 và 9, đứng ở đâu cũng vậy." Recap lặp nguyên văn.

### 9. Màn chạm và câu luyện tập section 7 hỏi cùng một điều: số La Mã có giá trị 9

- Vị trí: `$.sections[6].blocks[2]` (hình `chon-la-ma-9`) và `$.exercises[32]` (`ex.cham-la-ma-9`). LL-07
- Nguồn: walk iPad `095-s7-03-block` … `100-s7-05-…-correct`
- Vấn đề: Hai màn liền nhau, cùng câu hỏi, cùng đáp án IX.
- Sửa: Câu luyện tập trên đồng hồ hỏi số khác, vd "Chạm vào số La Mã có giá trị 4" hay 11; đổi `answer`, `explain`, hình lời giải theo.

### 10. Bốn câu quy tắc "số lớn nhất, bé nhất" của section 11, 12 hai khuôn; recap section 12 rơi mất điều kiện; ba cách nói "từ hai chữ số trở lên"

- Vị trí: `$.sections[10].blocks[0..1].children[0].text`, `$.sections[10].recap.caption`, `$.cards[10].recap.caption` (`section.lon-be-nhat`); `$.sections[11].blocks[1].children[0].text`, `$.sections[11].recap.caption`, `$.cards[11].recap.caption` (`section.chu-so-khac-nhau`); `$.sections[1].blocks[0].children[0].text`. LL-05
- Nguồn: tr.9 bài 1.10, 1.11
- Vấn đề: Section 11 "Khi biết số có mấy chữ số, số bé nhất là …", section 12 "Số bé nhất có các chữ số khác nhau: viết …". Điều kiện ở section 11 nằm trong ngoặc giữa câu, ở section 12 là câu riêng; recap section 12 và recap card chỉ lặp câu thứ nhất nên mất điều kiện (một chữ số: quy tắc cho 1, đúng là 0). Tổng hợp thấy thêm: cùng điều kiện mà ba chỗ ba cách nói ("Số có hai chữ số trở lên" ở section 2, "(từ hai chữ số trở lên)" ở section 11, "Cách này dùng cho số có từ hai chữ số trở lên" ở section 12).
- Sửa: Một khuôn "<đối tượng>: viết …", điều kiện cùng chỗ, cùng cụm "từ hai chữ số trở lên": "Số lớn nhất khi biết số chữ số: viết toàn chữ số 9."; "Số bé nhất khi biết số chữ số (từ hai chữ số trở lên): viết 1 rồi toàn chữ số 0."; "Số bé nhất có các chữ số khác nhau (từ hai chữ số trở lên): viết 1, rồi 0, rồi 2, 3, 4 và cứ thế cho đủ số chữ số." Recap lặp nguyên văn từng câu; câu section 2 theo Nghiêm trọng 1.

### 11. Section 8 không có câu đọc số nào có cụm IV, IX để bé tự làm

- Vị trí: `$.exercises[37]` (`doc-xii`), `$.exercises[38]` (`doc-xxiii`), câu ôn `$.exercises[39]`-`$.exercises[41]`; hình chạm `chon-xxviii`. LL-16
- Nguồn: tr.10 bài 1.19 (ba trong bốn số có cụm)
- Vấn đề: Mọi câu điền số và màn chạm đọc số đều không có cụm (XII, XXIII, XVIII, XI, XXVIII); chỗ bé hay sai nhất không được luyện.
- Sửa: Màn chạm `chon-xxviii` thành XXIX với chips 29, 31, 21, 19 (31 là đọc IX thành 11), đổi `done` theo; hợp với Nghiêm trọng 3 (29 dành cho màn dạy và recap, câu kho ôn không dùng 29).

### 12. Màn chạm "số bé nhất có ba chữ số" đã có đáp án ở hai màn ngay trước

- Vị trí: `$.sections[10].blocks[3]` (hình `chon-be-nhat-3`, đáp án 100) so với hình `be-nhat-vd` dòng 100 và `tip.cong-1-len` "99 + 1 = 100"; recap `lon-be-tom-tat`. LL-07, LL-20
- Nguồn: walk iPad `139-s11-02-block` … `141-s11-04-block`
- Vấn đề: Bé chạm theo trí nhớ; mẹo đổi sang 99 + 1 = 100 theo Nên sửa 13 vòng 1 nên lộ màn chạm.
- Sửa: Màn chạm hỏi số chữ số chưa có ở ví dụ và mẹo, vd "số bé nhất có năm chữ số" (10 000, 10 001, 1 000, 99 999) và đổi số câu ôn `be-nhat-5-chu-so`; hoặc `be-nhat-vd` bỏ dòng ba chữ số và mẹo dùng 9 + 1 = 10.

### 13. Section que tính: câu luyện tập lặp đúng bốn phép của màn chạm, recap in đáp án, nấc 2 chỉ là đề

- Vị trí: `$.exercises[49]` (`ex.doi-1-que`) so với hình `chon-phep-dung` (`$.sections[9].blocks[2]`); `$.exercises[49].hints.hintVisualId` (`que-goc`); recap `que-tom-tat`; câu ôn `$.exercises[50]` (`ex.chuyen-i-truoc-v`). LL-07, LL-15
- Nguồn: walk iPad `126-s10-02-block` … `136-s10-06-recap`
- Vấn đề: Màn 3 cho chạm bốn phép, câu luyện tập hỏi lại đúng bốn phép đó với cùng đáp án; nấc 2 `que-goc` chỉ vẽ lại đề; recap và câu ôn in và hỏi lại cách 1.
- Sửa: Câu luyện tập dùng phép que khác, vd VI + I = V (dời 1 que: IV + I = V, V + I = VI; đếm lại que), nhiễu chỉ một phép dời được bằng 1 que. Nấc 2 đổi màu que có thể dời, không vẽ chỗ đặt. `chuyen-i-truoc-v` đổi sang phép que khác hay hỏi "dời I từ sau V sang trước V thì VI thành gì".

### 14. Câu kho ôn `viet-30` hỏi đúng số in ở recap đọc số

- Vị trí: `$.exercises[47]` (`ex.viet-30`) so với hình recap `doc-la-ma-tom-tat` (XXX = 30). LL-07
- Nguồn: —
- Vấn đề: Recap card đọc số trả sẵn XXX = 30, câu ôn card viết hỏi số 30.
- Sửa: Đổi recap sang XXIX theo Nghiêm trọng 3 (khi đó lựa chọn XXIX của `viet-30` vẫn là nhiễu đúng chỗ, không đổi), hoặc đổi số câu ôn (vd 18: XVIII, XIIX, XVII, IIXX).

### 15. Câu quy tắc viết thêm chữ số không nói "bé hơn" là bé hơn cái gì, cũng không nói đọc từ đâu; hình recap thiếu ca "đặt cuối"

- Vị trí: `$.sections[14].blocks[0..1].children[0].text`, `$.sections[14].recap.caption`, `$.cards[14].recap.caption` (`section.them-lon-be`); hình recap `them-lon-nho-tom-tat`. LL-10, LL-06
- Nguồn: tr.9-10 bài 1.15, 1.16; lời giải tr.95 (1.15b 8 125 749)
- Vấn đề: "đặt nó trước chữ số đầu tiên bé hơn" thiếu "bé hơn nó" và không nói tính từ trái; bé có thể hiểu "bé hơn chữ số sau nó" hay đếm từ phải. Hình recap có ca đặt đầu, đặt giữa, không có ca đặt cuối (đáp án `them-1-vao-9863`, bài 1.15b). Phần còn lại của Nghiêm trọng 10 vòng 1.
- Sửa: "Viết thêm một chữ số để được số lớn nhất: đọc từ trái sang, đặt nó trước chữ số đầu tiên bé hơn nó; không có thì đặt cuối." Câu "bé nhất" cùng khuôn ("… lớn hơn nó …"). Recap lặp nguyên văn. Hình recap thêm ca đặt cuối với số khác mọi câu của bài, vd thêm 1 vào 532 được 5 321.

### 16. Section `them-lon-be` gộp hai quy tắc; quy tắc "số bé nhất" không có câu kiểm tra hay luyện tập nào

- Vị trí: `$.sections[14].checkIds`, `$.sections[14].practiceIds`, `$.sections[14].recap.caption`. Checklist trục 5 "Section ngắn, một ý"
- Nguồn: tr.9-10 bài 1.15b, 1.16b
- Vấn đề: Recap phải hai câu dài (5 dòng trên điện thoại, `188-s15-06-recap`). Màn cùng làm, câu kiểm tra và câu luyện tập chỉ hỏi "số lớn nhất"; quy tắc "bé nhất" chỉ gặp ở hai câu kho ôn.
- Sửa: Tách hai section (lớn nhất, bé nhất), mỗi section một note, màn cùng làm, câu kiểm tra, câu luyện tập, recap một câu. Giữ một section thì đưa `them-4-vao-2915` lên `practiceIds` và thêm một câu kho ôn mới.

### 17. Câu kho ôn `them-7-vao-4215` dùng lại số 4 215 và đúng ca "đặt lên đầu" của màn cùng làm

- Vị trí: `$.exercises[78]` (`ex.them-7-vao-4215`); hình `chon-them-6-4215`. LL-07
- Nguồn: walk `182-s15-03-block`, `183-s15-03-block-shown`
- Vấn đề: Màn cùng làm ra 64 215, câu ôn ra 74 215: bé chỉ cần nhớ màn trước.
- Sửa: Đổi số câu ôn (vd thêm 8 vào 5 316, được 85 316) hay số màn cùng làm, không trùng hình và câu khác của section.

### 18. Câu kho ôn `mat-khau-3-6` có đề và đáp án trùng hình ví dụ `lay-trong-tap-36`

- Vị trí: `$.exercises[89]` (`ex.mat-khau-3-6`); hình `lay-trong-tap-36` (`$.sections[16].blocks[2].children[1]`). LL-07, LL-20
- Nguồn: tr.8 ví dụ 2c, tr.9 bài 1.12b; walk `204-s17-03-block`
- Vấn đề: Màn ví dụ hiện 33, 36, 63, 66; câu ôn hỏi đúng điều đó, đáp án 4 nằm sẵn trên màn. Sinh ra từ câu "Sửa" Nên sửa 23 vòng 1. Tập {3; 6} còn nằm trong tập {0; 3; 6} của ví dụ 2 sách.
- Sửa: Câu ôn "mỗi chữ số là 2 hoặc 7" (22, 27, 72, 77), và đổi hình ví dụ cùng note `$.sections[16].blocks[2].children[0].text` sang tập không có trong sách và không trùng câu khác, vd {5; 8}.

### 19. Quy tắc liệt kê theo tổng các chữ số không nói dừng ở đâu

- Vị trí: `$.sections[17].blocks[0].children[0].text`, `$.sections[17].recap.caption`, `$.cards[17].recap.caption` (`section.tong-chu-so`). LL-10, LL-06
- Nguồn: tr.9 bài 1.13; lời giải tr.94-95
- Vấn đề: "thử chữ số hàng trăm từ 1 trở lên" không có điểm dừng; bé gặp "phần còn lại" âm. Section liền trước có đủ hai đầu ("từ 1 đến 9").
- Sửa: "… thử chữ số hàng trăm từ 1 cho tới khi bằng tổng. Với mỗi chữ số đó, tìm các cặp chữ số hàng chục và hàng đơn vị có tổng bằng phần còn lại (tổng trừ chữ số hàng trăm)." Recap lặp nguyên văn.

### 20. Màn chạm `chon-tap-14` nói "mỗi số phải có cả 1 và 4", nên lựa chọn sai 145 khớp lời dặn

- Vị trí: `$.sections[16].blocks[3].children[0].text` (hình `chon-tap-14`). LL-10
- Nguồn: tr.8 ví dụ 2a; walk `205-s17-04-block`
- Vấn đề: Lời dặn thiếu vế "không có chữ số nào khác"; bé chạm 145 rồi bị chấm sai mà không biết vì sao.
- Sửa: "… làm vậy bạn nhớ mỗi số phải có cả 1 và 4, và không có chữ số nào khác."

### 21. Màu "Chữ số viết thêm" tô cả số mới; nhãn màu này mang dấu chữ thập trông như dấu cộng

- Vị trí: hình `them-0-vd` (`253 \to \concept{sky}{2\,530}`), `them-1-vd` (`\concept{sky}{1\,253}`); nhãn `color: "sky"` của `them-0-tom-tat`, `them-0-vd`, `them-1-tom-tat`, `them-1-vd`, `them-lon-nho-tom-tat`. Checklist trục 4 "Một khái niệm, một từ, một màu"; LL-21
- Nguồn: `concepts` của bài (`chu-so-them` = sky); walk `159-s13-01-block`, `169-s14-01-block`
- Vấn đề: Section 15 chỉ tô chữ số viết thêm; section 13, 14 tô cả 2 530, 1 253 nên bé không thấy chữ số mới nằm đâu. Nhãn "gấp 10 lần", "tăng 1 000", "số lớn nhất" cũng mang sky, đứng sau dấu ✚, dễ đọc thành phép cộng.
- Sửa: Chỉ tô chữ số viết thêm (`25\,3\concept{sky}{0}`, `\concept{sky}{1}\,253`, tương tự ở hai hình recap). Nhãn không nói về chữ số viết thêm dùng màu trung tính hoặc bỏ màu.

### 22. `sourceRef` section `so-hai-chu-so` chỉ ghi bài 1.8, 1.9, trong khi dạng "gấp … lần" lấy từ ví dụ 1

- Vị trí: `$.sections[15].sourceRef`, `$.cards[15].sourceRef`
- Nguồn: tr.7-8 ví dụ 1
- Vấn đề: Màn chạm `chon-chuc-gap-2` và ba câu kho ôn dùng quan hệ "gấp … lần", chỉ có ở ví dụ 1.
- Sửa: "Sách bài tập tr.7–9 (ví dụ 1; bài 1.8 và bài 1.9)".

## Góp ý

### 1. Câu các hàng dừng ở hàng trăm nghìn, còn câu giá trị có "và cứ thế"

- Vị trí: `$.sections[2].blocks[0].children[0].text`, `$.sections[2].recap.caption`, `$.cards[2].recap.caption` (`section.hang`). LL-17
- Nguồn: bài 1.18 tr.10 (có hàng triệu)
- Vấn đề: Danh sách đóng, trong khi section 11, 12 dùng số bảy chữ số.
- Sửa: Thêm "và cứ thế" (hay "hàng triệu") vào cuối câu.

### 2. Câu kho ôn đổi tiền lặp đúng phép tính của câu kiểm tra

- Vị trí: `$.exercises[18]` (`ex.tien-1000-doi-10000`) so với `$.exercises[15]`. LL-07
- Nguồn: —
- Vấn đề: Cả hai là 20 : 10 = 2.
- Sửa: Đổi số tờ thành 40, 50 hay 60 (không dùng 30, đã có ở `ba-muoi-chuc`).

### 3. Thiếu lý do `wrong` cho nhiễu "6 · 100 + 3 + 5"

- Vị trí: `$.exercises[25].explain.wrong` (`ex.tong-cua-635`)
- Nguồn: —
- Vấn đề: Nhiễu phản ánh lỗi quên nhân chữ số hàng chục nhưng không có lời giải thích.
- Sửa: `wrong` cho `d`: "Chữ số 3 ở hàng chục phải nhân với 10, nên 6 · 100 + 3 + 5 chỉ bằng 608."

### 4. Đề `viet-so-3405` bảo "đặt chữ số vào các ô", trong khi hình dùng nút + và −

- Vị trí: `$.exercises[28].prompt[0].text` (`ex.viet-so-3405`)
- Nguồn: walk `082-s6-04-block`
- Vấn đề: Màn dạy thao tác nói "Bấm nút + hoặc −"; đề nghe như kéo thả.
- Sửa: "Bấm nút + hoặc − ở mỗi hàng để được số bằng tổng sau."

### 5. Hai cách ghi số hạng hàng đơn vị: "4 · 1" và "4"

- Vị trí: hình `tong-tien` ("2 · 100 + 5 · 10 + 4 · 1"), `$.exercises[30].explain.tex`, `check.expr` (`ex.dem-tien-3250`, "5 · 1")
- Nguồn: tr.8 ví dụ 1 ("… + 2 · 10 + 1")
- Vấn đề: Cả bài viết chữ số hàng đơn vị đứng riêng, chỉ hai chỗ này viết "· 1".
- Sửa: Bỏ "· 1".

### 6. Ba id không khớp nội dung câu, nên đổi trước khi khoá id

- Vị trí: `$.exercises[15].id` (`ex.muoi-tram-bang-nghin`: hỏi 20 chục bằng mấy trăm), `$.exercises[30].id` (`ex.dem-tien-3250`: đáp án 325), `$.exercises[31].id` (`ex.gia-tri-iv`: hỏi giá trị của V)
- Nguồn: —
- Vấn đề: Id còn từ bản trước; sau `content:lock` không đổi được nữa.
- Sửa: Đổi thành `hai-muoi-chuc-bang-tram`, `dem-tien-325`, `gia-tri-v` (cập nhật `checkIds` của `section.muoi-don-vi`, `section.chu-la-ma`).

### 7. Hai mẹo dùng chữ thay số (n, k) mà bài không dạy

- Vị trí: `$.sections[10].blocks[2].text` (`tip.cong-1-len`), `$.sections[15].blocks[1].text` (`tip.hang-chuc-lon-nhat`). LL-25
- Nguồn: —
- Vấn đề: Các câu quy tắc của bài đều nói "mấy chữ số", "bao nhiêu"; bé học chậm phải hiểu chữ thay số. Cả hai mẹo đúng với mọi đầu vào đã thử.
- Sửa: "Cộng 1 vào số lớn nhất có hai chữ số thì được số bé nhất có ba chữ số; với bốn, năm chữ số cũng vậy." và "Chữ số hàng đơn vị hơn chữ số hàng chục bao nhiêu thì lấy 9 trừ đi số đó: hàng chục chỉ đi tới kết quả. Ví dụ hơn 6 thì hàng chục chỉ đi tới 3, nên có 17, 28 và 39."

### 8. Lý do sai của XIIII không nói giá trị của nó

- Vị trí: `$.exercises[43].explain.wrong[0]` (`ex.chon-viet-13`)
- Nguồn: —
- Vấn đề: Không chỉ ra XIIII là 14.
- Sửa: "XIIII là 10 + 4 = 14, không phải 13. Hơn nữa 4 viết là IV."

### 9. Giải thích `viet-lop-6` tách 6 = 5 + 1, khác cách viết bài vừa dạy

- Vị trí: `$.exercises[46].explain` (`ex.viet-lop-6`)
- Nguồn: —
- Vấn đề: Quy tắc section 9 là tách chục và đơn vị rồi tra bảng đơn vị.
- Sửa: "6 không có chục, chỉ có 6 đơn vị. Bảng đơn vị ghi 6 là VI."

### 10. Gợi ý nấc 2 của `cham-la-ma-9` không giúp tìm IX; đồng hồ nhỏ, lệch trái trên iPad

- Vị trí: `$.exercises[32].hints.hintVisualId` (`goi-y-la-ma`), hình `cham-dong-ho-ix`
- Nguồn: walk iPad `099-s7-05-exercise-cham-la-ma-9`
- Vấn đề: Thẻ I, V, X không đưa bé tới IX (một thành phần riêng); đồng hồ chiếm khoảng một phần ba khung.
- Sửa: Làm cùng Nên sửa 9 (câu đổi số): gợi ý chỉ các vị trí giờ để bé đếm, không ghi số đáp án; cho đồng hồ rộng bằng khung như `dong-ho-4`.

### 11. Giải thích các câu số lớn nhất nói "Số lớn nhất thì tất cả chữ số đều là 9" thiếu ngữ cảnh

- Vị trí: `$.exercises[54].explain.text`, `$.exercises[56].explain.text`, `$.exercises[58].explain.text`. LL-05
- Nguồn: —
- Vấn đề: Câu này sai ngay ở section sau (chữ số khác nhau); khác chữ với câu quy tắc.
- Sửa: Dùng lại câu quy tắc section 11 sau khi sửa theo Nên sửa 10.

### 12. Vài chỗ câu ôn trùng số nhỏ

- Vị trí: `$.exercises[57].explain.wrong[0]` với `$.exercises[58]` (`ex.may-dem-buoc-lon-nhat`, 99 999); `$.exercises[45]` (`ex.ghep-23`) với `$.exercises[38]` (`ex.doc-xxiii`); chips 987 của `chon-khac-nhau-3` với `$.exercises[59]`. LL-07
- Nguồn: —
- Vấn đề: Bé gặp đáp án trước khi được hỏi.
- Sửa: `ex.ghep-23` đổi sang 17; chips `chon-khac-nhau-3` thay 987 bằng 210; `may-dem-buoc-lon-nhat` đổi sang số chữ số chưa dùng ở section 11 (soát cùng lúc với hình ví dụ tám chữ số ở Nghiêm trọng 6).

### 13. Câu "làm vậy bạn thấy / quen …" ở màn chạm đọc gượng

- Vị trí: `$.sections[13].blocks[1].children[0].text`, `$.sections[14].blocks[2].children[0].text`, `$.sections[15].blocks[2].children[0].text`, `$.sections[16].blocks[3].children[0].text`, `$.sections[17].blocks[1].children[0].text`. LL-19
- Nguồn: —
- Vấn đề: Hai mệnh đề nối bằng dấu phẩy hay chấm phẩy, khó đọc.
- Sửa: Tách câu lý do riêng, vd "Chạm vào số nhà mới. Nhờ vậy bạn thấy số tăng thêm bao nhiêu."

### 14. Ví dụ `tong-chu-so-vd` không cho thấy cách tách phần còn lại thành cặp

- Vị trí: hình `tong-chu-so-vd` (`$.sections[17].blocks[0].children[1]`). LL-16
- Nguồn: lời giải 1.13 tr.94
- Vấn đề: Mỗi dòng ghi luôn kết quả; bước liệt kê đủ cặp (0 và 2, 1 và 1, 2 và 0) không có.
- Sửa: Thêm "2 = 0 + 2 = 1 + 1 = 2 + 0" trước "102; 111; 120".

### 15. Một chỗ hai tên ("đầu, cuối" và "bên trái, bên phải"); một việc hai động từ ("thêm" và "viết thêm")

- Vị trí: `$.sections[12].title`, `$.sections[13].title` ("vào cuối số", "vào đầu số") so với note và recap ("vào bên phải", "vào bên trái"); nhãn "thêm 0 vào cuối", "thêm 1 vào đầu"; `$.sections[14].blocks[0..1].children[0].text` ("Thêm một chữ số", "đặt cuối") so với tiêu đề section 15 và note section 13, 14 ("Viết thêm"). LL-05
- Nguồn: tr.9 bài 1.14, 1.15 ("vào sau (tận cùng bên phải)", "Viết thêm")
- Vấn đề: Cùng chỗ hai tên, cùng việc hai động từ; section 15 lại dùng "đặt cuối" theo nghĩa "sau chữ số cuối cùng". Tổng hợp thêm phần động từ.
- Sửa: "bên phải (cuối số)" ở lần đầu rồi chỉ dùng "bên phải"; dùng "viết thêm" ở mọi câu quy tắc (đã theo ở Nên sửa 15).

### 16. Hình chạm khe không hiện chữ số viết thêm ở khe đã chọn

- Vị trí: hình `gaps` (`chen-8152`, `chen-7308`, `chen-2915`, `chen-9863`)
- Nguồn: walk `185-s15-04-exercise-them-4-vao-8152-correct`
- Vấn đề: Làm đúng thì khe chỉ đậm lên, bé không thấy số mới; phần còn lại của Nghiêm trọng 12 vòng 1.
- Sửa: Sau khi chạm, vẽ chữ số viết thêm (màu sky) vào khe đã chọn.

### 17. `them-1-vao-250` gần như bản sao của `them-1-482`; thiếu lý do sai cho nhiễu 251, 12 500

- Vị trí: `$.exercises[73]` (`ex.them-1-vao-250`). LL-07
- Nguồn: —
- Vấn đề: Cùng khuôn đề và khuôn nhiễu với câu kiểm tra; nhiễu 12 500 không có `wrong`.
- Sửa: Đổi sang "Số nào trừ đi 1 000 thì được 250?", hay thêm `wrong` cho c, d.
