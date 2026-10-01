# Review: Ôn tập chương II (`on-tap-chuong-2`)

- Bài: `content/math/kntt/on-tap-chuong-2/lesson.json` (bản làm việc chưa commit, so với bản đã review `9e8f63f`)
- Vòng: 5 - chỉ phần đổi (`pnpm content:diff`), section: `uoc-bcnn-khang-dinh`, `bcnn-bai-toan`, `so-mu-uclnn-bcnn`, `quy-dong`; đối chiếu chữ với Bài 12 (`boi-chung-boi-chung-nho-nhat`, bản `published`, chỉ đọc)
- Nguồn đã đọc: `sources/math/on-tap-chuong-2/` - không đọc lại trang nào: không câu `bookRef` nào đổi chữ, số hay đáp án (so với `9e8f63f`: cả 21 câu `bookRef` giữ nguyên `prompt`, `options`, `answer`, `check`, `bookRef`)
- `content:check`: 0 lỗi của bài ngoài `[review-hash]` (bình thường lúc này), 0 cảnh báo
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/on-tap-chuong-2/` (đã xem sheet phone và ipad-landscape của section 13, ảnh phone của section 9, 10, 11)
- Kết luận: 0 Nghiêm trọng, 2 Nên sửa (đã sửa đúng như đề xuất: hai câu `wrong` thành "Tử số của...", hai thẻ "Quy đồng" ở hình gợi ý thành slate), 2 Góp ý (giữ nguyên); đã `--approve`
- Bản đã review: `559a9c5e6fdcf0e28bb4d791c145b46c698c1b6c74d09167cf472552b3e177d4` (`pnpm content:diff` so với bản này)

Đã soát và đạt (diff có 24 chỗ đổi chữ, 1 màu; không chỗ nào chạm câu sách):
- Màu khái niệm `on-tap-chuong-2.concept.quy-dong` blue thành slate: khớp Bài 12 (`quy-dong-mau-so` slate), chấm `quy-dong` ở `src/visuals/math/on-tap-chuong-2/sticker.tsx` đã slate; không khái niệm nào khác của bài dùng slate làm màu khái niệm, nên không trùng màu. Còn sót hai thẻ blue trong hình gợi ý, xem Nên sửa 2.
- Câu quy tắc, recap section, recap card trùng Bài 12 đúng từng chữ (so bằng đối chiếu chuỗi với `lesson.json` Bài 12):
  - `bcnn-bai-toan`: "Nếu mọi hàng đều dư cùng một số, ta cộng số dư đó vào từng bội trước khi chọn số nằm trong khoảng đề cho." trùng câu của Bài 12 (note quy tắc và recap của section xếp hàng, hình `so-4-6-xong`), cả recap.
  - `so-mu-uclnn-bcnn`: "Viết mỗi số lớn hơn 1 thành tích các thừa số nguyên tố. Lấy mọi thừa số nguyên tố, chung và riêng, mỗi thừa số với số mũ lớn nhất, rồi nhân lại: kết quả là BCNN." trùng Bài 12 (`bcnn-phan-tich`). Recap section chỉ giữ câu thứ hai của mỗi quy tắc (ƯCLN và BCNN), cũng đúng như recap của Bài 12 ở section đó; lint `[rule-sentence]` qua.
  - `quy-dong`: "Muốn quy đồng mẫu số hai phân số, ta lấy BCNN của hai mẫu số làm mẫu số chung. Lấy mẫu số chung chia cho mẫu số mỗi phân số, rồi nhân cả tử số lẫn mẫu số của phân số đó với thương." trùng Bài 12 từng chữ ở note quy tắc, recap section, recap card (ba nơi của bài ôn giống nhau).
  - `uoc-bcnn-khang-dinh`: "Bội chung khác 0 của hai số đều là bội của BCNN của hai số đó." (note và hai recap giống nhau). Bài 12 không có câu nguyên văn này: nó chỉ ghi "Mọi bội chung khác 0 của 6 và 8 đều bằng 24 nhân với 1, 2, 3..." và dùng "khác 0" ở mọi định nghĩa. Thêm "khác 0" là đúng toán (0 cũng là bội của BCNN nên mệnh đề đúng cả khi không có điều kiện) và hợp quy ước của Bài 12; không ghi lỗi.
  - Câu ƯCLN nhân BCNN và các câu ôn khác trong diff: không đổi.
- Nhất quán "mẫu số" và "tử số" trong section `quy-dong`: note quy tắc, câu nhắc kiến thức tiểu học, câu ví dụ, `ex.bcnn-14-21` (đề), `ex.quy-dong-9-14` (`explain.text`, `wrong` của b và c), `ex.bai-2-64a` và `ex.bai-2-64b` (`explain.text`, `wrong[0]`) đều dùng "mẫu số", "tử số". Sót hai câu `wrong`, xem Nên sửa 1. Còn "mẫu" trơn ở mẹo `bcnn-hai-mau` (Góp ý 1) và nhãn hình.
- Câu ví dụ băng giấy (`$.sections[12].blocks[1].children[1]`): "Ví dụ: băng dài năm phần sáu mét, cắt đi ba phần tư mét. Hai mẫu số khác nhau, nên quy đồng rồi mới trừ." Hết mâu thuẫn với câu "cùng mẫu số" ngay trên: câu trên nói quy tắc khi cùng mẫu số, câu dưới nói rõ ví dụ có hai mẫu số khác nhau và phải quy đồng trước; không lộ "một phần mười hai mét" trước nút "Bước tiếp". Sheet walk phone `207-s13-02-block`, `208-s13-02-block-end`: ba dòng "?" hiện trước khi bấm, thẻ vừa màn hình, không chữ nào bị cắt. Đóng được Nên sửa vòng 4 (LL-10, LL-16).
- Câu bước dẫn và `explain` của các câu còn lại: toán đúng (BCNN(14, 21) = 42 và 27 + 16 = 43; BCNN(15, 12) = 60 và 52 - 35 = 17; 9 · 3 = 27, 8 · 2 = 16); nhiễu của `quy-dong-9-14` (9/42 và 8/42; 27/42 và 8/42; 18/42 và 16/42) đều sai, chỉ đáp án a đúng; `wrong` của b, c, d và của 64a, 64b nói đúng lý do. Hình gợi ý nấc 2 `tn264a-goi-y` (3/8 + 5/12 = 19/24) và `tn264b-goi-y` (7/10 - 1/4 = 9/20) dùng số khác đề, đúng toán, không lộ kết quả của đề.
- Cùng section, bản sửa không làm hỏng mục khác: recap khớp note (quy tắc nguyên văn); `bcnn-14-21` không trùng hình với `bcnn-hai-mau` (tip dùng 15 và 25, đề dùng 14 và 21); số 15 của tip cũng có ở `bai-2-64b` (15 và 12) nhưng cặp và kết quả khác, không lộ đáp án 60; `ex.bcnn-14-21` chỉ đổi "mẫu" thành "mẫu số", đáp án 42 giữ nguyên.
- Ảnh walk các section đổi: section 13 (phone, ipad-landscape) không chữ nào bị cắt hay chồng, dấu chia hết và "không chia hết" của mẹo rõ (`209-s13-03-block`: ba dòng 25 không chia hết 15, 50 không chia hết 15, 75 chia hết 15), recap hiển thị đủ hai câu; recap section 9, 10, 11 (`158`, `178`, `190`) đủ câu, chữ "khác 0" và "mọi hàng đều dư cùng một số" hiện đúng, không lệch nội dung hình.

## Bảng kiểm mẹo `on-tap-chuong-2.tip.bcnn-hai-mau`

Mẹo: "liệt kê các bội của mẫu lớn hơn; số đầu tiên chia hết cho mẫu nhỏ hơn là BCNN". Tự tính từng cặp bằng cách liệt kê bội, rồi so với a · b : ƯCLN(a, b):

| Cặp mẫu (nhỏ, lớn) | Loại | Bội của mẫu lớn đã liệt kê | Số đầu tiên chia hết cho mẫu nhỏ | a · b : ƯCLN | Kết quả |
|---|---|---|---|---|---|
| (15, 25) | ví dụ của mẹo | 25, 50, 75 | 75 | 225 : 5 = 75 | đúng |
| (4, 12) | nhỏ là ước của lớn | 12 | 12 | 48 : 4 = 12 | đúng |
| (3, 9) | nhỏ là ước của lớn | 9 | 9 | 27 : 3 = 9 | đúng |
| (7, 14) | nhỏ là ước của lớn | 14 | 14 | 98 : 7 = 14 | đúng |
| (2, 3) | nguyên tố cùng nhau | 3, 6 | 6 | 6 : 1 = 6 | đúng |
| (5, 7) | nguyên tố cùng nhau | 7, 14, 21, 28, 35 | 35 | 35 : 1 = 35 | đúng |
| (11, 13) | nguyên tố cùng nhau, lớn | 13, 26, ..., 143 | 143 | 143 : 1 = 143 | đúng |
| (6, 6) | hai mẫu bằng nhau | 6 | 6 | 36 : 6 = 6 | đúng |
| (1, 1) | hai mẫu bằng nhau, đều 1 | 1 | 1 | 1 : 1 = 1 | đúng |
| (1, 7) | một mẫu là 1 | 7 | 7 | 7 : 1 = 7 | đúng |
| (8, 12) | có ước chung lớn hơn 1 | 12, 24 | 24 | 96 : 4 = 24 | đúng |
| (6, 9) | có ước chung lớn hơn 1 | 9, 18 | 18 | 54 : 3 = 18 | đúng |
| (4, 10) | có ước chung lớn hơn 1 | 10, 20 | 20 | 40 : 2 = 20 | đúng |
| (14, 21) | có ước chung lớn hơn 1 | 21, 42 | 42 | 294 : 7 = 42 | đúng |
| (12, 15) | có ước chung lớn hơn 1 | 15, 30, 45, 60 | 60 | 180 : 3 = 60 | đúng |
| (12, 18) | có ước chung lớn hơn 1 | 18, 36 | 36 | 216 : 6 = 36 | đúng |
| (16, 24) | có ước chung lớn hơn 1 | 24, 48 | 48 | 384 : 8 = 48 | đúng |
| (10, 25) | có ước chung lớn hơn 1 | 25, 50 | 50 | 250 : 5 = 50 | đúng |

Máy so với ƯCLN trên mọi cặp từ 1 đến 199 (không tính thứ tự): 0 cặp lệch. Mẹo đúng với mọi đầu vào. `tex` không có chữ Việt; `kind` "làm nhanh" đúng nhãn; mẹo đặt sau câu quy tắc và ví dụ làm cách thường, không đặt trước; số nhỏ.

Cặp mới (15, 25), kết quả 75 và các bội 25, 50, 75: không trùng cặp hay kết quả của chính bài ôn (ôn dùng 4 và 6, 6 và 8, 6 và 9, 10, 12 và 15, 14 và 21, 15 và 12) và không trùng Bài 12 (không có "15, 25", không có BCNN bằng 75; Bài 12 chỉ có BCNN(10, 25) = 50 ở `ex` bánh răng, cặp và dạng đề khác nên bé không thấy là cùng ví dụ). Không còn gặp lại cặp (6, 15) của "BCNN(6, 15)".

## Nghiêm trọng

Không có.

## Nên sửa (đã sửa)

### 1. Hai lời `wrong` còn "Tử của phân số..." trong khi cả section đã đổi sang "tử số" (LL-05, LL-20)

- Vị trí: `$.exercises[47].explain.wrong[2].text` (`on-tap-chuong-2.ex.bai-2-64a`, lựa chọn d) và `$.exercises[48].explain.wrong[1].text` (`on-tap-chuong-2.ex.bai-2-64b`, lựa chọn c)
- Nguồn: ảnh walk `phone/215-s13-06-exercise-bai-2-64a-correct.png` ("Tử của phân số thứ hai phải đổi thành 16, không phải 8.") và `phone/217-s13-07-exercise-bai-2-64b-correct.png` ("Tử của phân số thứ hai phải đổi thành 35, không phải 7.")
- Vấn đề: tác giả đã đổi "tử" thành "tử số" ở mọi câu giải thích và `wrong` khác của hai câu này và của `quy-dong-9-14`, nhưng còn hai câu trên sót. Trên cùng một màn giải thích, bé đọc "tử số" ở ba dòng và "tử" ở dòng thứ tư, cùng khái niệm hai tên. Câu sách (`bookRef`) không bị ảnh hưởng: đây là lời giải thích của bài.
- Sửa: "Tử số của phân số thứ hai phải đổi thành 16, không phải 8." và "Tử số của phân số thứ hai phải đổi thành 35, không phải 7."

### 2. Hình gợi ý của hai câu quy đồng còn nhãn "Quy đồng" màu blue, trong khi khái niệm đã đổi sang slate (một khái niệm, một màu)

- Vị trí: `src/visuals/math/on-tap-chuong-2/catalog.ts`, hình `tn264a-goi-y` và `tn264b-goi-y` (gợi ý nấc 2 của `ex.bai-2-64a`, `ex.bai-2-64b`): `tag: { text: "Quy đồng", color: "blue" }` ở hàng thứ hai của mỗi hình (khoảng dòng 937 và 952)
- Nguồn: so `$.concepts[6]` (slate) và `sticker.tsx` (slate) với hai thẻ này; chưa có ảnh walk của nấc 2 (walk không bấm xin gợi ý nấc 2)
- Vấn đề: sau khi chốt "Quy đồng mẫu số" là slate như Bài 12, hai thẻ nhãn cùng khái niệm vẫn blue; bé thấy khái niệm đổi màu giữa phần dạy (slate) và phần gợi ý (blue). Màu xanh lam không còn là màu khái niệm nào của bài, nên cũng không đúng bảng màu của bài.
- Sửa: đổi `color: "blue"` thành `color: "slate"` ở hai thẻ. Đây là sửa trong `src/`, không đổi `lesson.json` hay hash bài.

## Góp ý

### 1. Mẹo `bcnn-hai-mau` và nhãn hình còn viết "mẫu" trơn

- Vị trí: `$.sections[12].blocks[2]` (`title` "Tìm BCNN của hai mẫu", `text` "Ví dụ hai mẫu là 15 và 25 ... mẫu lớn hơn ... mẫu nhỏ hơn"); nhãn hình `tru-vi-du` ("Trừ hai phân số khác mẫu")
- Vấn đề: cả section nay dùng "mẫu số". Mẹo vẫn đọc được ("hai mẫu" ngay sau câu quy tắc nói "hai mẫu số"), và nhãn hình "khác mẫu" cũng có ở Bài 12 nên không sai. Chỉ là cùng khái niệm hai cách nói nhẹ.
- Sửa: tuỳ tác giả; nếu sửa thì "Tìm BCNN của hai mẫu số", "Ví dụ hai mẫu số là 15 và 25. Liệt kê các bội của mẫu số lớn hơn. Số đầu tiên chia hết cho mẫu số nhỏ hơn là BCNN." (có đổi chữ mẹo thì phải chạy lại bảng trên: chữ đổi, số không đổi).

### 2. Hai quy tắc kề nhau ở `so-mu-uclnn-bcnn` mở đầu khác nhau

- Vị trí: `$.sections[10].blocks[0].children[0]` ("Viết mỗi số thành tích...") và `blocks[1].children[0]` ("Viết mỗi số lớn hơn 1 thành tích...")
- Vấn đề: BCNN nay có "lớn hơn 1" (đúng Bài 12), ƯCLN vẫn "Viết mỗi số" (đúng Bài 11, đã xuất bản). Hai câu cùng làm một thao tác, lệch một cụm; không sai toán và mỗi câu trùng bài gốc của nó.
- Sửa: giữ nguyên, trừ khi Bài 11 thêm "lớn hơn 1" ở quy tắc ƯCLN; khi đó đổi theo để hai quy tắc kề nhau cùng một câu mở đầu.

## Đối chiếu Bài 12 (đã xong)

Kết quả đối chiếu với bản `published` của Bài 12 (`content/math/kntt/boi-chung-boi-chung-nho-nhat/lesson.json`):
1. Câu quy tắc xếp hàng còn dư, quy tắc BCNN theo số mũ lớn nhất, quy tắc quy đồng và các recap của chúng: trùng từng chữ (xem trên). Câu "Bội chung khác 0 ..." của `uoc-bcnn-khang-dinh` thêm điều kiện cho khớp quy ước "khác 0" của Bài 12, đúng toán.
2. Mẹo `nho-cong-so-du` cùng ý với mẹo "Bài toán xếp hàng còn dư" của Bài 12 nhưng khác lời, ví dụ khác (10 + 3, 20 + 3 so với 36 + 1, 48 + 1). Không ghi lỗi.
3. Mẹo `bcnn-hai-mau` cùng ý với mẹo "Tìm BCNN bằng bội của số lớn nhất" của Bài 12 (khác lời; Bài 12 dùng 8, 16, 24 với 6). Ví dụ mới (15, 25, kết quả 75) không trùng cặp nào của Bài 12. Trùng cặp (6, 15) của vòng 4 đã hết.
4. Màu: BCNN `pink` khớp glossary và Bài 12; "Quy đồng mẫu số" slate khớp Bài 12; `pink` vẫn cũng là "Hợp số" ở section 3, 4 của bài này (chốt ở cấp glossary, không đổi trong vòng này); hai thẻ blue còn sót ở hình gợi ý xem Nên sửa 2.
5. Trùng số giữa hai bài (cặp 6, 8; danh sách bội chung của 6 và 9; cặp 4, 6; 12 và 18) không đổi so với vòng 4 và không nằm trong diff; không ghi lỗi vì đây là bài ôn lại kiến thức Bài 12.
