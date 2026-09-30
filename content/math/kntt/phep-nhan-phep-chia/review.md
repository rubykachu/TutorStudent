# Review: Phép nhân và phép chia số tự nhiên (`phep-nhan-phep-chia`)

- Bài: `content/math/kntt/phep-nhan-phep-chia/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/phep-nhan-phep-chia/` - sbt-p17, sbt-p18, sbt-p19, sbt-p20, sbt-p98, sbt-p99
- `content:check`: 0 lỗi, 1 cảnh báo của bài (118 id chưa có trong `ids.lock.json`: tác giả chạy `pnpm content:lock` khi duyệt)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-nhan-phep-chia/`
- Kết luận: Chưa đạt: còn 3 lỗi Nghiêm trọng
- Bản đã review: `8d5ee11e70d572c316767cf4e156d0c380745c91b6517e6ffde5772445ef51d0` (`pnpm content:diff` so với bản này)

Các reviewer đã tự giải cả 74 exercise; Tổng hợp tính lại 9 câu `fillBlank` (không có `check` nên máy không kiểm): 73 câu khớp `answer`/`check`/`accept`, riêng `dien-7-9` sai (Nghiêm trọng 1). Các mục của vòng 1 đã được sửa; quy ước "a · b là a được lấy b lần" khớp ở mọi note, caption, đề và hình của phần nhân. Tổng hợp đã đọc mọi note, recap và caption của 16 section, 16 card: recap card trùng recap section, không có khái niệm hai tên hay hai màu; hai chỗ lệch giữa các phần gộp vào Nghiêm trọng 2 (thuật ngữ "làm tròn" lệch "số tròn chục" của section 7) và Nên sửa 11, 12 (quy tắc phép thử nói hai cách; quy ước viết phép nhân ở nửa bài chia).

## Nghiêm trọng

### 1. `dien-7-9` chấm đúng đáp án sai: 9 · 7 = 7 · ___ nhận 7, đáp án đúng là 9

- Vị trí: `$.exercises[13].segments[1].accept` (`dien-7-9`, `["7"]`); LL-01
- Nguồn: tr.17, `sbt-p17.png` (tính chất giao hoán)
- Vấn đề: 9 · 7 = 63 còn 7 · 7 = 49. Trẻ điền 9 bị chấm sai, trẻ điền 7 được khen (ảnh `phone/054-s4-05-exercise-dien-7-9-correct.png`). Bản vòng 1 là `7 · 9 = 9 · ___` với `accept: ["7"]` (đúng); lần sửa vòng 1 đảo chữ của đề nhưng giữ `accept`. Lời giải `dien-7-9-giai` chạy ra `9 · 7 = 7 · 9 = 63`, nên bài tự mâu thuẫn, và đây là câu luyện của chính section dạy giao hoán. `fillBlank` không có `check` nên `content:check` không bắt.
- Sửa: `accept: ["9"]`; chạy lại `lesson:walk`, nhập 9 phải được chấm đúng.

### 2. "Làm tròn xuống / làm tròn lên" ở section 10 là thuật ngữ ngoài nguồn, và trái nghĩa "làm tròn" trẻ đã học

- Vị trí: `$.sections[9].blocks[1].children[0]` (note "làm tròn thừa số xuống rồi lên"), `$.sections[9].recap.caption`, `$.cards[9].recap.caption`; visual `uoc-luong-62-8`, `uoc-luong-tom-tat`, `chon-tich-53-7-goi-y`, `chon-tich-53-7-giai` (nhãn và dòng chữ trong `src/visuals/math/phep-nhan-phep-chia/estimate.tsx:116-117`, `:397-401`); LL-09
- Nguồn: tr.20, `sbt-p20.png` (1.47, 1.49, 1.50 chỉ nói "không đặt tính", không có "làm tròn"); `sourceRef` "Sách bài tập tr.20", không ghi "Kiến thức nền"; glossary không có mục này
- Vấn đề: checklist trục 1 xếp thuật ngữ không có trong trang nguồn là Nghiêm trọng. Ngoài ra trẻ học "làm tròn" là về số gần nhất (47 thành 50, 62 thành 60), và sẽ học lại như thế ở lớp 6. Recap ghi 47 "làm tròn xuống" thành 40, hình mẫu ghi 62 "làm tròn lên" thành 70: trẻ dễ nhớ "47 làm tròn là 40". Section 7 của cùng bài đã dùng "số tròn chục", nên section 10 đang gọi một ý bằng từ thứ hai.
- Sửa: bỏ "làm tròn", dùng từ của section 7: "số tròn chục liền trước" và "số tròn chục liền sau" (62 nằm giữa 60 và 70). Sửa cùng lúc note, recap section và card, nhãn và dòng chữ từng bước trong `estimate.tsx` ("62 nằm giữa hai số tròn chục 60 và 70."). Chụp lại các hình.

### 3. Hình "gia đình phép tính" chia hai cột trên iPad dọc: nhãn "Thừa / số", "Số / bị / chia" gãy thành 2-3 dòng

- Vị trí: visual `gia-dinh-6-4` (`$.sections[10].blocks[2].children[1]`), `chia-het-tom-tat` (`$.sections[10].recap`, `$.cards[10].recap`); `src/visuals/math/phep-nhan-phep-chia/fact-family.tsx:135` (`md:grid-cols-2`), nhãn ở `:23`; LL-12
- Nguồn: —
- Vấn đề: đã tự xem `ipad/126-s11-03-block.png` và `ipad/131-s11-06-recap.png`: mỗi nhãn tên gọi chỉ còn chỗ một từ, "Số", "bị", "chia" xếp dọc dưới 24, "Thừa", "số" dưới 6, chấm màu lệch khỏi chữ. Đây là màn dạy và màn recap tên gọi các số trên máy chính của trẻ; trẻ đọc nhãn ba dòng như ba chữ rời. Phone (một cột) và iPad ngang hiện một dòng, nên lỗi do bố cục của visual trong bài: checklist trục 5 xếp "cột hẹp" do nội dung bài là Nghiêm trọng. Walk không báo vì chữ không chồng, không tràn.
- Sửa: giữ nhãn trên một dòng (`whitespace-nowrap` cho nhãn), hoặc chỉ chia hai cột từ khổ `lg`; chụp lại ảnh iPad dọc để xác nhận.

## Nên sửa

### 1. `chon-5-8`: hai nhiễu là phép cộng, loại được ngay

- Vị trí: `$.exercises[12].options` (`chon-5-8`, b `8 + 5`, d `5 + 5`); LL-14
- Nguồn: —
- Vấn đề: đề hỏi phép tính bằng 8 · 5 = 40; `8 + 5` = 13 và `5 + 5` = 10 quá xa, trẻ loại ngay mà không cần hiểu giao hoán (ảnh `phone/048`). Vòng 1 đã sửa đúng lỗi này ở `chon-tong-7`.
- Sửa: nhiễu đều là phép nhân có số giống đề: `8 · 8`, `5 · 5`, `8 · 4`. Không dùng `4 · 10` hay `10 · 4` vì cũng bằng 40.

### 2. `dien-7-9`: đề kể hai lớp nhưng không nói phép nhân nào là lớp nào

- Vị trí: `$.exercises[13].prompt[0]` (`dien-7-9`); LL-10
- Nguồn: —
- Vấn đề: đề kể lớp A 7 hàng mỗi hàng 9, lớp B 9 hàng mỗi hàng 7, rồi hiện `9 · 7 = 7 · ___`. Không nói hai lớp đông bằng nhau, không nói vế nào là lớp nào; trẻ học chậm dễ điền số hàng hay số bạn mỗi hàng mà không hiểu vì sao.
- Sửa: "Lớp A có 9 · 7 bạn, lớp B có 7 · ___ bạn. Hai lớp có số bạn bằng nhau. Điền số còn thiếu." (đáp án 9 sau khi sửa Nghiêm trọng 1).

### 3. Tích hay công thức bị ngắt giữa dòng trên điện thoại

- Vị trí: note `$.sections[3].blocks[2].children[0]` ("2 ·" / "35", `phone/047-s4-03-block.png`); note `$.sections[4].blocks[2].children[0]` ("như 4" / "· 25", `phone/060-s5-03-block.png`); note `$.sections[9].blocks[2].children[0]` ("20 ·" / "60.", `phone/113-s10-03-block.png`); công thức `$.sections[0].blocks[1].children[1]` ("= 24" rơi xuống dòng, `phone/003`), `$.sections[4].blocks[0].children[1]` ("= 30", `phone/057`); LL-12
- Nguồn: —
- Vấn đề: trẻ đọc "4" cuối dòng này và "· 25" đầu dòng sau thành hai số rời.
- Sửa: dùng khoảng trắng không ngắt (U+00A0) quanh "·" và "=" trong note, hoặc tách tích ra khối `formula`; công thức dài xếp `gathered` theo dấu "=". Nếu cần sửa chung ở app thì báo người làm app.

### 4. Hình diện tích đặt thừa số thứ nhất làm số hàng, ngược cách đọc lưới của section 1

- Vị trí: visual `phan-phoi-goi-banh` (`$.sections[5].blocks[0]`), `phan-phoi-tach` (`$.sections[5].blocks[3].children[1]`), `phan-phoi-tom-tat` (`$.sections[5].recap`, `$.cards[5].recap`), `tinh-tui-keo-goi-y`, `tinh-tui-keo-giai`, `gan-tron-12-19` (`$.sections[6].blocks[0].children[1]`), `gan-tron-tom-tat` (`$.sections[6].recap`, `$.cards[6].recap`); LL-05, LL-15
- Nguồn: —
- Vấn đề: section 1 dạy lưới "3 hàng, mỗi hàng 5 chấm" là 5 · 3. Hình 3 · (10 + 2) lại vẽ 3 hàng mỗi hàng 12 ô, caption "12 gói, mỗi gói 3 cái"; đọc theo section 1 thì hình là 12 · 3. Tương tự 12 · (20 − 1) vẽ 12 hàng mỗi hàng 20 ô. Kết quả không sai (giao hoán đã dạy), nhưng quy ước vừa chốt lệch giữa hình và công thức.
- Sửa: xoay hình trong `split-area.tsx`: cạnh ngang (độ dài mỗi hàng) là thừa số thứ nhất, cạnh đứng (số hàng) là tổng hay hiệu được tách (10 hàng + 2 hàng; 20 hàng bớt 1 hàng).

### 5. Ví dụ so sánh hai tích không nói bước giữa và kết luận, câu `so-sanh-38-50` cần đúng bước đó

- Vị trí: `$.sections[9].blocks[2].children[0..2]` (note "29 · 40 nhỏ hơn 30 · 40, còn 21 · 60 lớn hơn 20 · 60" và công thức hai dòng), exercise `so-sanh-38-50`; LL-16
- Nguồn: tr.20, `sbt-p20.png` (1.47a)
- Vấn đề: note nêu hai bất đẳng thức rời, không nói 30 · 40 và 20 · 60 cùng bằng 1 200, không nói kết luận 29 · 40 < 21 · 60; dòng thứ hai bắt đầu "= 20 · 60" không lời giải thích. `so-sanh-38-50` (độ khó 3) cần chính chuỗi đó thêm bước đổi chỗ, nhưng chỉ có nấc 1 tô cả đề.
- Sửa: note viết đủ: "30 · 40 và 20 · 60 cùng bằng 1 200. Vậy 29 · 40 < 1 200 < 21 · 60." Thêm `hintVisualId` cho `so-sanh-38-50` dùng số khác đề (vd 19 · 30 và 31 · 20), dừng ở "?" trước kết luận. Sửa cùng lúc với Nghiêm trọng 2 (cùng màn).

### 6. Màn 3 của section 7 lặp lại phép tính của màn 1, không chỉ ra lỗi mà note nói

- Vị trí: `$.sections[6].blocks[2]` (note "Lỗi hay gặp là chỉ nhân với số đầu trong ngoặc" và ba công thức 12 · (20 − 1) = 228) so với `gan-tron-12-19` (`$.sections[6].blocks[0].children[1]`); LL-07, LL-16
- Nguồn: tr.19, `sbt-p19.png` (1.41)
- Vấn đề: màn nói về lỗi hay gặp nhưng chỉ chép lại lời giải đúng của màn đầu, không cho thấy cách làm sai (12 · 20 − 1 = 239).
- Sửa: đổi công thức thành cặp sai, đúng với số mới, vd "Sai: 15 · 19 = 15 · 20 − 1", "Đúng: 15 · 19 = 15 · 20 − 15 · 1 = 285".

### 7. `chon-viet-nho-8-7` không nêu phép nhân đủ, nên "Viết 56" cũng hợp quy tắc vừa học

- Vị trí: exercise `chon-viet-nho-8-7`, `prompt[0]`, lựa chọn `c` ("Viết 56, nhớ 0"); LL-10
- Nguồn: —
- Vấn đề: note ngay trước dạy "riêng cột cuối viết cả tích". Đề chỉ cho "Ở cột đơn vị, 8 · 7 = 56"; nếu phép tính là 8 · 7 thì cột đơn vị cũng là cột cuối và phải viết 56.
- Sửa: "Đặt tính 48 · 7. Ở cột đơn vị, 8 · 7 = 56. Viết chữ số nào và nhớ chữ số nào?"

### 8. Hình cùng làm `nhan-cot-23-14-cung-lam` bỏ trống ô đơn vị của tích riêng thứ hai, lệch hình mẫu có "0 mờ"

- Vị trí: `$.sections[8].blocks[2].children[1]` so với `$.sections[8].blocks[1]` (note "chữ số 0 mờ chỉ giữ chỗ", `nhan-cot-47-13-xong`), `nhan-cot-36-24`, `nhan-hai-chu-so-tom-tat`; câu `nhan-cot-54-13` cùng khung; LL-05, LL-15
- Nguồn: —
- Vấn đề: ảnh `103-s9-03-block.png` (cả ba khổ): hàng tích riêng thứ hai chỉ có "? ?" ở cột trăm và chục, cột đơn vị trống, trong khi màn liền trước vừa dạy viết 0 mờ ở đó. Khác Góp ý 12 đã ghi trong `task.md` (số nhớ xếp chồng, cỡ chữ).
- Sửa: vẽ sẵn 0 mờ (không phải ô bấm) ở cột đơn vị của tích riêng thứ hai trong `col-mul-try.tsx` và `col-mul-fill.tsx`.

### 9. Đặt tính chia với số chia hai chữ số không có mẫu từng bước; lời giải nói "từng chữ số một" rồi chia 15 : 12

- Vị trí: `$.sections[13]` (mẫu từng bước chỉ có 95 : 4 và 75 : 6; 268 : 12 là hình tĩnh), `$.exercises[61]` (`chia-154-12`, nấc 2 dùng 87 : 5), câu ôn `chia-cot-217-15`, `du-163-15`; `src/visuals/math/phep-nhan-phep-chia/col-div.tsx:83`; LL-16, LL-15
- Nguồn: tr.18, `sbt-p18.png`
- Vấn đề: câu luyện và các câu ôn chia cho 12, 15, lượt đầu phải lấy hai chữ số, nhưng không màn nào nói điều này. Hình lời giải mở bằng "Chia 154 cho 12 từng chữ số một." rồi bước kế "Chia: 15 : 12 được 1" (`chia-154-12-giai-phone-step-1.png`, `-step-2.png`): hai câu ngược nhau.
- Sửa: khi chữ số đầu nhỏ hơn số chia, câu mở của `colDiv` nói "1 nhỏ hơn 12 nên lấy hai chữ số đầu: 15."; cho 268 : 12 chạy từng bước (mode `steps`), hoặc đổi số gợi ý sang số chia hai chữ số (vd 175 : 14).

### 10. Câu ôn lặp số của hình cùng làm và hình gợi ý

- Vị trí: `$.exercises[54].options[0]` (`chon-nhieu-du-2`, `17 : 5`) so với `chia-keo-17-5-cung-lam` (`$.sections[11].blocks[3]`); `$.exercises[49].options[0]` (`chon-nhieu-chia-dung`, `45 : 9 = 5`) so với nấc 2 `chia-56-8-goi-y`; `$.exercises[67]` (`mua-vo-100-15`) so với hình `mua-vo-100-12`; LL-07
- Nguồn: —
- Vấn đề: 17 : 5 dư 2 là đúng phép chia trẻ vừa bấm ở màn cùng làm, và là một đáp án đúng của câu chọn nhiều.
- Sửa: `17 : 5` thành `27 : 5`; `45 : 9 = 5` thành `54 : 9 = 6`; câu mua vở đổi món hay số tiền (vd 90 nghìn, bút 13 nghìn).

### 11. Quy tắc phép thử nói hai cách; bản ở `tim-loi-sai` thiếu điều kiện số dư và nhận chính bài làm sai của câu ngay sau

- Vị trí: `$.sections[15].blocks[1].children[0]` ("Soát bài bằng phép thử: lấy số chia nhân thương rồi cộng số dư. Kết quả phải bằng số bị chia."); so với recap `$.sections[12].recap` và `$.sections[15].recap` (có "số dư nhỏ hơn số chia"); `$.exercises[69]` (`chon-loi-43-6`); LL-05, LL-10
- Nguồn: tr.17, `sbt-p17.png`
- Vấn đề: 43 : 6 = 6 dư 7 qua được phép thử này (6 · 6 + 7 = 43), cũng như 36 : 5 = 6 dư 6 ở tab 2 của `loi-sai-ba`. Trẻ làm đúng theo câu note sẽ kết luận bài của Lê đúng. Recap của `kiem-tra-chia` và `tim-loi-sai` có đủ hai điều kiện, câu note thì chỉ có một.
- Sửa: "Soát phép chia có dư hai bước: số dư phải nhỏ hơn số chia, và số chia nhân thương cộng số dư phải bằng số bị chia."

### 12. Nửa bài chia viết "số chia · thương" mà không nối với quy ước "a · b là a được lấy b lần"

- Vị trí: `$.sections[10].blocks[1].children[2]` (`24 = 6 · 4` dưới hình `chia-deu-24-6`: 6 đĩa, mỗi đĩa 4 cái); `$.sections[12].blocks[1].children[1]` (`5 · 7 + 2 = 37`, Lan chia cho 5 bạn mỗi bạn 7 cái); `$.exercises[45].options[0]` (`chon-kiem-tra-28-4`, đáp án `7 \cdot 4 = 28`, ngược câu quy tắc "số chia nhân thương" vừa dạy); LL-05
- Nguồn: tr.17, `sbt-p17.png`
- Vấn đề: theo quy ước section 1, `6 · 4` đọc là "6 được lấy 4 lần", còn hình kết thúc ở "mỗi bạn được 4 cái" (tức 4 được lấy 6 lần). Cách đọc khớp quy ước (mỗi vòng phát 6 cái, 4 vòng) chỉ có trong chữ nhỏ của hình. Riêng `chon-kiem-tra-28-4` lại viết thương trước số chia, khác cả câu quy tắc lẫn công thức của section. Không xếp Nghiêm trọng vì phép tính đúng, thứ tự số chia · thương theo công thức của sách, và hình có đếm vòng.
- Sửa: thêm một câu nối ở section 11: "Mỗi vòng phát 6 cái, phát 4 vòng: 24 = 6 · 4." (hoặc hình chia đều ghi "Đã chia 4 vòng, mỗi vòng 6 cái" ở bước cuối); đổi lựa chọn a của `chon-kiem-tra-28-4` thành `4 \cdot 7 = 28` (nhiễu `28 \cdot 7 = 4` thành `4 \cdot 28 = 7`).

## Góp ý

### 1. "Thừa số", "tích" xuất hiện ở section 1-2, trước khi section 3 dạy

- Vị trí: chú giải "Thừa số / Tích" của `nhan-hop-banh`, `nhan-cong-lap-tom-tat`, `xep-luoi-cung-lam`, `tinh-ba-keo-goi-y`/`-giai`, `bang-nhan-day-du`, `bang-nhan-tom-tat`; note `$.sections[1].blocks[0].children[0]` ("cho biết tích của hai số"); LL-09
- Nguồn: tr.17 (hai thuật ngữ có trong sách, trẻ đã học ở tiểu học)
- Vấn đề: không sai, nhưng section 3 mở bằng câu định nghĩa như dạy mới.
- Sửa: viết section 3 là "Nhắc lại: ..." hoặc thêm glossary `prerequisite` cho "thừa số", "tích".

### 2. Viết số nghìn hai cách: "1 000" trong note, "1000" trong hình

- Vị trí: note `$.sections[4].blocks[2].children[0]` ("8 · 125 = 1 000") so với visual `cap-so-tron` ("8 · 125 = 1000", `phone/060`)
- Nguồn: tr.98 (sách viết "1 000")
- Vấn đề: cùng một màn, một số viết hai cách; `formatInteger` không tách nhóm số có 4 chữ số.
- Sửa: cho `formatInteger` tách nhóm từ 4 chữ số (theo sách), hay ít nhất cho hình này; báo người làm app nếu hàm dùng chung.

### 3. Câu luyện, câu ôn và recap dùng lại cùng số

- Vị trí: recap `phan-phoi-tom-tat` (4 · (10 + 3)) so với `tinh-tui-keo` (5 · 13), `chon-nhieu-7-13`, `chon-cach-viet-4-23`; recap `uoc-luong-tom-tat` (47 · 6, mốc 40 và 50) so với `chon-nhieu-nho-hon-500` (lựa chọn 47 · 9); LL-07
- Nguồn: —
- Vấn đề: cùng cách tách 13 = 10 + 3 và cùng số 47 lặp lại, trẻ có thể nhớ số thay vì nhớ cách.
- Sửa: recap `phan-phoi-tom-tat` sang 6 · (10 + 4); lựa chọn 47 · 9 thành 46 · 9.

### 4. Nhiễu yếu ở vài câu chọn

- Vị trí: `chon-tich-rieng-2` lựa chọn `d`; `chon-cach-viet-15-99` lựa chọn `d` (15 · 10 − 9); `chon-tinh-9-98` lựa chọn `c` (9 · 98 + 9); LL-14
- Nguồn: —
- Vấn đề: ít trẻ chọn, không phản ánh lỗi hay gặp.
- Sửa: "Viết 1 920, thẳng cột với tích riêng thứ nhất"; `15 \cdot 100 - 15 \cdot 9` hay `15 \cdot 99 - 1`; `9 \cdot 100 + 9 \cdot 2`.

### 5. Màn tách `phan-phoi-tach` không nói phép nhân đang làm

- Vị trí: `$.sections[5].blocks[3].children[0]`
- Nguồn: —
- Vấn đề: note chỉ nói tách 12; phép nhân 14 · 12 chỉ đọc được qua số 14 ở cạnh hình.
- Sửa: "Tính 14 · 12: bấm + hoặc − để tách 12 thành chục và đơn vị."

### 6. Ba ví dụ của `chia-co-du` đều ra "5 dư 3"

- Vị trí: `chia-keo-23-4`, `ten-goi-chia-du` và công thức `$.sections[11].blocks[2].children[1]` (38 : 7), recap `chia-co-du-tom-tat` (43 : 8)
- Nguồn: —
- Vấn đề: cả ba đều thương 5, dư 3; trẻ dễ nhớ "5 dư 3" như một mẫu.
- Sửa: recap sang phép chia khác thương và dư (vd 46 : 7 = 6 dư 4).

### 7. `du-163-15` có chữ số 0 ở thương trước khi bài dạy lỗi "quên chữ số 0"

- Vị trí: `$.exercises[63]` (card `dat-tinh-chia`); lỗi chữ số 0 dạy ở `$.sections[15]`; LL-09
- Nguồn: —
- Vấn đề: 163 : 15 = 10 dư 13; câu chỉ hỏi số dư nên vẫn làm được, nhưng có thể ra trước section `tim-loi-sai`.
- Sửa: đổi số để thương không có 0 (vd 185 : 15 = 12 dư 5).

### 8. Quy tắc "tìm số chia" của `chia-het` không có câu nào luyện

- Vị trí: `$.sections[10].blocks[2].children[0]`; câu của card `chia-het`
- Nguồn: tr.17, `sbt-p17.png`
- Vấn đề: note dạy hai quy tắc, chỉ quy tắc tìm số bị chia có câu luyện.
- Sửa: thêm câu ôn "Tìm số chia, biết số bị chia là 36 và thương là 4."

### 9. Công thức `50 = 12 · 4 + 2` của `bai-toan-chia` không tô màu khái niệm

- Vị trí: `$.sections[14].blocks[2].children[1]`
- Nguồn: —
- Vấn đề: các công thức chia có dư khác của bài đều tô bốn vai; riêng dòng này đen.
- Sửa: `\concept{blue}{50} = \concept{violet}{12} \cdot \concept{amber}{4} + \concept{pink}{2}`.

### 10. `chon-nhieu-them-1`: bốn lựa chọn là bốn bài toán đầy đủ

- Vị trí: `$.exercises[68]`; LL-18
- Nguồn: —
- Vấn đề: trẻ phải đọc và chia bốn lần trong một câu.
- Sửa: rút còn ba lựa chọn, hoặc tách thành hai câu ngắn hơn.

### 11. Nút tab của `loi-sai-ba` nhảy chỗ khi đổi tab

- Vị trí: visual `loi-sai-ba` (`MistakeTabs` trong `mistakes.tsx`)
- Nguồn: —
- Vấn đề: tab 2 ngắn hơn nên cả khối, gồm hàng nút, căn giữa thấp xuống; trẻ phải tìm lại nút. Trên iPad ngang thẻ tab 1 chạm thanh dưới (`ipad-landscape/182-s16-01-block.png`).
- Sửa: neo hàng nút ở đầu khối, hoặc cho ba thẻ cùng chiều cao tối thiểu; báo người làm app nếu do khung.
