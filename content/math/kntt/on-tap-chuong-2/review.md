# Review: Ôn tập chương II (`on-tap-chuong-2`)

- Bài: `content/math/kntt/on-tap-chuong-2/lesson.json` (bản commit `235555d`; hình ở `src/visuals/math/on-tap-chuong-2/catalog.ts` cùng bản)
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: `tinh-chat-tong`, `so-nguyen-to`, `tong-hop-so`, `tong-dau-hieu-2-5`, `tong-dau-hieu-3-9`, `phan-tich-so`, `uoc-cua-6`, `uoc-bcnn-khang-dinh`, `bcnn-bai-toan`, `so-mu-uclnn-bcnn`, `tim-so-con-lai`, `quy-dong`; thêm các hình đổi ở `catalog.ts` (màu nhãn, `tinh-vi-du`, `mu-tim-b`, `khoang-bcnn`, `tn258-goi-y`, bốn hình quy đồng) và section 14 (`giai-thich-111`) trên điện thoại
- Nguồn đã đọc: `sources/math/on-tap-chuong-2/` - sbt-p45, sbt-p46, sbt-p110
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/on-tap-chuong-2/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng (đã chạy `pnpm content:hash on-tap-chuong-2 --root content --mark`, bài giữ `draft`)
- Bản đã review: `17bbaef8fe3f3e359938d17c945ac1454bbe74e93b18613004fd3f9ef7e326d8` (`pnpm content:diff` so với bản này)

Đã soát và đạt:
- Mọi câu có `bookRef`: chữ, số, lựa chọn của đề khớp tr.45, tr.46; chỉ 2.56b đổi cách xuống dòng (hai dòng, dấu "+" đầu dòng sau), chữ và số y hệt sách. Đáp án khớp tr.110 (tự tính lại: câu hỏi 1-6 là C, D, C, D, A, D; 2.56a hợp số vì chia hết cho 7, 2.56b vì chia hết cho 2; 2.57 ra 38 = 2 · 19 và 76 = 2² · 19; 2.58 ra 245 và danh sách 65, 125, 185, 245, 305 của lời giải mới trùng tr.110; 2.60 ra 3⁴ · 5³; 2.62 n ∈ {0; 1; 2; 5}; 2.63 a = 6, b = 2; 2.64 ra 43/42 và 17/60).
- 2.56a, 2.56b: mỗi câu đúng một lựa chọn. 2.56a: 2 · 7 · 12 = 168 chia hết cho 3 nhưng 49 · 53 = 2 597 thì không (tổng chữ số 23), chia hết cho 2 chỉ ở số hạng đầu, chia hết cho 7 ở cả hai; 2.56b: số hạng 60 chia hết cho 2 nhưng không chia hết cho 7 và 8 (tổng 8 254 653 300 còn chia hết cho 3, 4, 5, 9, nhưng lý do nói về hai số hạng và không lựa chọn nào dùng các số đó). Các `wrong` đúng với từng lựa chọn.
- Mẫu ":" sau số không còn (tìm trong `lesson.json` và `catalog.ts`); khoảng viết "từ ... đến" như sách; tex dài đã tách dòng ở `tn1`, `tn2`, tip `Chia hết cho 3`, tip `Loại hợp số nhanh`, 2.56b, `quy-dong-9-14`.
- Câu quy tắc và recap: ở `uoc-cua-6`, `bcnn-bai-toan`, `tim-so-con-lai` recap của section và của card `tim-so-con-lai` nhắc lại đúng từng chữ câu `rule`; câu nối `so-mu-uclnn-bcnn` có chữ "có ở mọi số", "mọi thừa số nguyên tố" nên không còn đọc ra ƯCLN sai; thứ tự "cộng số dư vào từng bội, rồi chọn số trong khoảng" nhất quán ở câu quy tắc, recap, mẹo, bước `chon-so-trong-khoang`, giải thích 2.58, hình `tn258-goi-y`.
- Hình: `tinh-vi-du` đi đúng thứ tự Bài 7 (luỹ thừa, rồi nhân và chia, rồi cộng); `mu-tim-b` ra b = 1, a = 4 đúng (ƯCLN 2¹ · 3¹, BCNN 2⁵ · 3⁴) và khác `tim-b-mu-nho`, `tim-a-mu-lon`, 2.63; `chon-bc-6-8` có ba bội chung 24, 48, 72, hai nhiễu bội của 8 (32, 56) và một nhiễu bội của 6 (60); các màu còn lại khớp khái niệm (`teal` chữ số tận cùng, `lime` tổng các chữ số, `sky` số nguyên tố, `pink` hợp số hay BCNN xem mục cuối, `violet` số mũ, `amber` ƯCLN, `blue` quy đồng), phần còn lại đã `slate`.
- Id đã đổi (`ex.chon-bc-60` thành `ex.chon-so-trong-khoang`, hình `chon-bc-4-6` thành `chon-bc-6-8`): không còn chỗ nào trong bài, `src/`, `tests/` nhắc id cũ; `checkIds` của section 10 trỏ đúng.
- Section 13 và 14 trên điện thoại (sheet `phone-s13`, `phone-s14`): không chữ nào bị cắt, phân số `\frac` đọc rõ, dòng quy đồng tự xuống dòng đúng chỗ.

## Nghiêm trọng

### 1. Giải thích của bước `chon-so-trong-khoang` bị cắt số ở điện thoại (LL-12)

- Vị trí: `$.exercises[37].explain.tex` (`on-tap-chuong-2.ex.chon-so-trong-khoang`)
- Nguồn: ảnh walk `phone/171-s10-07-exercise-chon-so-trong-khoang-correct.png` (dòng "18 + 2 = 20, 36 + 2 = 38" và "54 + 2 = 56, 72 + 2 = 74": số cuối mỗi dòng nằm ngoài khung); iPad không bị
- Vấn đề: bước mới (sinh khi sửa thứ tự cộng số dư) đặt hai phép cộng trên một dòng, rộng hơn khung 390px. Bé thấy "= 3" và "= 7" cắt nửa, mất đúng hai số 38 và 74 mà lý do sai của lựa chọn a và c nhắc tới. Do độ dài nội dung, và là bản sửa sinh lỗi chỗ mới (LL-20).
- Sửa: một phép mỗi dòng, như giải thích 2.58: `\begin{gathered} 18 + 2 = 20 \\ 36 + 2 = 38 \\ 54 + 2 = 56 \\ 72 + 2 = 74 \end{gathered}`; chạy lại walk, xem `phone/…-s10-07-…-correct`.

## Nên sửa

### 1. Câu ví dụ Mai và Lan không khớp hình ngay dưới nó (LL-15, LL-07)

- Vị trí: `$.sections[12].blocks[1].children[1]` (`on-tap-chuong-2.section.quy-dong`), cạnh hình `tru-vi-du` ở `children[2]`
- Nguồn: ảnh walk `phone/207-s13-02-block.png`, `phone/208-s13-02-block-end.png`
- Vấn đề: câu mới nói 1/4 + 1/6 = 5/12, đúng là phép của hình `quy-dong-vi-du` ở màn liền trước; hình ngay dưới câu lại làm 5/6 − 3/4. Bé đọc một phép, nhìn thấy phép khác, và câu đứng dưới quy tắc "cùng mẫu" trong khi hai phân số của nó khác mẫu.
- Sửa: đổi thành ví dụ trừ khớp hình, vd "Ví dụ: mảnh băng dài năm phần sáu mét, cắt đi ba phần tư mét thì còn một phần mười hai mét." (5/6 − 3/4 = 1/12); hay chuyển câu Mai và Lan lên màn quy tắc đầu, dưới hình `quy-dong-vi-du`.

### 2. Mẹo "Tìm BCNN của hai mẫu" không nói hai mẫu là số nào, và dùng lại cặp 6, 8 của hình chạm (LL-16, LL-07)

- Vị trí: `$.sections[12].blocks[2]` (`on-tap-chuong-2.tip.bcnn-hai-mau`)
- Nguồn: ảnh walk `phone/209-s13-03-block.png`
- Vấn đề: ví dụ `8, 16, 24` rồi `24 ⋮ 6` không ghi hai mẫu là 6 và 8, nên số 6 xuất hiện mà không có chỗ từ; bé chậm không biết "mẫu nhỏ hơn" là số nào. Cặp 6, 8 với bội chung 24 lại đúng là cặp của hình chạm `chon-bc-6-8` ở section 10.
- Sửa: thêm vào `text` một câu "Ví dụ hai mẫu 6 và 15." (không viết chữ Việt trong TeX) và đổi sang cặp chưa dùng trong bài và trong Bài 12: `\begin{gathered} 15,\ 30 \\ 30 \chiahet 6 \end{gathered}`.

### 3. Lời giải 2.56b xuống dòng giữa tích 2 020 · 2 021 · 2 022 ở điện thoại (LL-12)

- Vị trí: `$.exercises[14].explain.text` (`on-tap-chuong-2.ex.bai-2-56b`)
- Nguồn: ảnh walk `phone/074-s4-07-exercise-bai-2-56b-correct.png` (dòng kết thúc bằng "và 2 020 ·", dòng sau mở bằng "2 021 · 2 022")
- Vấn đề: tích bị tách đôi giữa hai dòng, bé dễ đọc "2 020 ·" và "2 021 · 2 022" thành hai phần. Câu này không đổi ở vòng trước; thấy khi soát sheet.
- Sửa: dùng dấu cách không ngắt (U+00A0) quanh "·" trong hai tích của câu này, như đã làm cho lời giải 2.61, hay đổi câu để tích không rơi vào cuối dòng.

## Góp ý

### 1. Recap card `bcnn-bai-toan` và hình recap section 10 chưa có vế số dư (LL-06, LL-15)

- Vị trí: `$.cards[9].recap.caption` ("Chia cho nhiều số đều dư như nhau thì bớt số dư đi, số còn lại chia hết cho các số đó."); hình `khoang-bcnn-xong` (`$.sections[9].recap`) chỉ minh hoạ bài không có số dư
- Sửa: tuỳ tác giả: thêm câu "Rồi cộng số dư vào từng bội trước khi chọn số trong khoảng." vào recap card, và một dòng cộng dư vào hình recap.

### 2. Nhãn "Các số từ 30 đến 50" không nói đó là bội chung (LL-15)

- Vị trí: hình `khoang-bcnn`, `khoang-bcnn-xong` (dòng "36, 48")
- Sửa: "Bội chung từ 30 đến 50".

### 3. "Sau 36 ngày lại gặp nhau" nói chưa rõ (LL-10)

- Vị trí: `$.sections[11].blocks[0].children[1]` (`on-tap-chuong-2.section.tim-so-con-lai`)
- Sửa: "... sau 36 ngày lại cùng trực nhật." (`overview.whyItMatters` có cùng cách nói, đổi theo cho đồng bộ).

### 4. Ví dụ của hai mẹo chưa cho thấy bước chính (LL-16)

- Vị trí: `$.sections[5].blocks[1]` (`tip.chia-het-3`: `1 836` rồi `1 + 8`, không thấy chữ số 3 và 6 bị gạch); `$.sections[9].blocks[2]` (`tip.nho-cong-so-du`: chỉ có hai phép cộng, không thấy số bị loại ngoài khoảng)
- Sửa: tuỳ tác giả: ghi trong `text` "Với 1 836, gạch 3 và 6, còn 1 + 8"; thêm một dòng khoảng và số bị loại cho mẹo số dư.

### 5. Bước `chon-so-trong-khoang` dùng lại danh sách bội chung của 6 và 9 vừa hiện ở màn trước (LL-07)

- Vị trí: `$.exercises[37].prompt[0]` (20, 38, 56, 74, 92 sinh từ 18, 36, 54, 72, 90); hình `bc-6-9` ở section 9
- Sửa: tuỳ tác giả: đổi cặp (vd 5 và 8, dư 3) cho khác hình đã xem.

## Cần đối chiếu Bài 12 (`boi-chung-boi-chung-nho-nhat`, còn draft; không tính mức lỗi)

Đã soát toán mọi chỗ BCNN và quy đồng, đều đúng. Khi Bài 12 được duyệt, so lại:

1. Câu quy tắc `$.sections[9].blocks[0]` và recap đã trùng từng chữ câu của Bài 12 (hai vế, có số dư): giữ nếu Bài 12 giữ.
2. Mẹo `tip.nho-cong-so-du` cùng ý với mẹo "Bài toán xếp hàng còn dư" của Bài 12 nhưng khác lời; ví dụ khác nhau (10 + 3, Bài 12: 36 + 1).
3. Mẹo `tip.bcnn-hai-mau` cùng ý mẹo "BCNN của hai số" của Bài 12, khác lời và khác ví dụ; sau khi Bài 12 xuất bản bé sẽ gặp hai mẹo cùng ý.
4. `$.sections[8].blocks[1]` "Bội chung của hai số đều là bội của BCNN của hai số đó." không có nguyên văn trong Bài 12 (Bài 12: nhân BCNN lần lượt với 1, 2, 3); Bài 12 quy ước bội chung chỉ xét khác 0, bài ôn dùng chữ "các bội" không ghi điều kiện đó.
5. Câu BCNN theo số mũ lớn nhất (`$.sections[10].blocks[1].children[0]`) viết "Viết mỗi số", Bài 12 viết "Viết mỗi số lớn hơn 1"; chốt một cách cho cả hai câu và recap.
6. Câu quy đồng (`$.sections[12].blocks[0].children[0]`, recap section, recap card): bài ôn viết "của hai mẫu", "mẫu của từng phân số", "với kết quả"; Bài 12 viết "của hai mẫu số", "mẫu số mỗi phân số", "với thương" (LL-05). Dùng câu Bài 12 khi được duyệt.
7. Câu ƯCLN nhân BCNN trùng Bài 12: giữ nếu Bài 12 giữ.
8. Màu: BCNN `pink` khớp glossary và Bài 12, nhưng `pink` cũng là khái niệm "Hợp số" ở section 3, 4 của bài này; "Quy đồng mẫu số" là `blue` ở bài ôn, `slate` ở Bài 12. Chốt ở cấp glossary.
9. Trùng số với Bài 12: cặp 6, 8 (chips `chon-bc-6-8`, mẹo `bcnn-hai-mau` so với `xe-6-8`, `bc-6-8` của Bài 12: 24, 48, 72); danh sách bội chung của 6 và 9 (`chon-so-trong-khoang`, `bc-6-9` so với `so-6-9`, `chon-bc-6-9`); cặp 4, 6 (`khoang-bcnn`, `thua-xep`, `tn258-goi-y`, `bc-24-4-6`, `c-12-4-6` so với `chon-bc-4-6`, `so-4-6-xong`); 12 và 18 (`mu-ucln`, `tich-12-18` so với mẹo "ƯCLN và BCNN khi phân tích").

## Bảng mẹo (mẹo -> số đã thử -> kết quả)

Máy so với tính trực tiếp trên khoảng cho từng mẹo; số cụ thể ghi ở cột giữa.

| Mẹo | Số / trường hợp đã thử | Kết quả |
|---|---|---|
| `tip.tim-khang-dinh-sai` | Khẳng định có "luôn", "đều" về chia hết: tổng hai số đều không chia hết cho 9 (ví dụ 1 + 8), cho 3 (1 + 2); tổng hai số đều chia hết cho 9; số chia hết cho 9 luôn chia hết cho 3; số chẵn luôn chia hết cho 2; số chia hết cho 5 luôn tận cùng 5 (số 0); số lẻ luôn là số nguyên tố (số 1); tích hai số đều không chia hết cho 2; cả bốn lựa chọn câu hỏi 1 | Đúng: khẳng định sai luôn tìm được ví dụ với số dưới 10 (kể cả biên 0 và 1), khẳng định đúng không có ví dụ nào trong 0..39 |
| `tip.loai-hop-so-nhanh` | 0, 1, 2, 3, 4, 5, 6, 9, 10, 15, 25, 77, 91, 461, 499, 1 143, 2 020, 2 133, 2 335, 3 576, 4 718; máy 0..300 000 | Đúng: không số nguyên tố nào bị loại (2, 3, 5 nằm ngoài điều kiện lớn hơn 5, lớn hơn 3); 49, 77, 91 không loại được, đúng với câu "chưa chắc là số nguyên tố" |
| `tip.chia-het-3` | 0, 1, 3, 7, 30, 216, 510, 1 836, 3 850, 4 521, 27 220, 31 005, 58 735, 999 999; máy 0..1 000 000 | Đúng với 3 (gồm 0 và số gạch hết); dùng sang 9 sai ở 3, 6, 12, 15, 21, 24 và câu "Mẹo này chỉ dùng cho 3, không dùng cho 9" đã chặn |
| `tip.nho-cong-so-du` | 2.58 (10, 12, 15 dư 5, 200..300) ra 245; 6 và 9 dư 2, 50..70 ra 56; 4 và 6 dư 3, 100..120 ra 111; 4 và 6 dư 1, 37..48 ra 37 (biên dưới); 2, 3, 5 dư 1, 20..40 ra 31; 5 và 7 dư 2, 60..70 không có số nào; 4 và 9 dư 2, 30..40 ra 38; khoảng chỉ có một số (111..111, 13..13, 29..29); máy 300 000 bộ ngẫu nhiên | Đúng cả; chỉ sai khi khoảng chứa chính số dư (ứng với bội 0, vd 6 và 9 dư 2 trong 1..30), ngoài dạng bài vì quy ước bội chung khác 0 và khoảng của bài bắt đầu sau số dư |
| `tip.bcnn-hai-mau` | (14, 21), (15, 12), (4, 6), (6, 8), (8, 12), (10, 4), (6, 6), (4, 12), (1, 7), (5, 7), (9, 6); máy mọi cặp 1..199 | Đúng cả (số bằng nhau, số này chia hết số kia, hai số nguyên tố cùng nhau đều ra đúng) |
| Không đổi vòng này: `tip.chia-het-9`, `tip.tich-tong-chan`, `tip.tim-so-con-lai`, `tip.nhan-111` | bảng vòng trước giữ nguyên | Đúng |
