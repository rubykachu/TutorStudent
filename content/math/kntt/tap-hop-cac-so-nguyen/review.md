# Review: Tập hợp các số nguyên (`tap-hop-cac-so-nguyen`)

- Bài: `content/math/kntt/tap-hop-cac-so-nguyen/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/tap-hop-cac-so-nguyen/` - sbt-p47, sbt-p48, sbt-p49, sbt-p111
- `content:check`: 0 lỗi, 1 cảnh báo của bài (93 id chưa có trong `ids.lock.json`, đúng với bài chưa duyệt)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi vòng toàn bài hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/tap-hop-cac-so-nguyen/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `498ac27db10252b8cdf9eee54a6dda1c6414e8e8a5bc4d82680dde1e466ad4b8` (`pnpm content:diff` so với bản này)

Lỗi của vòng 1 (39 mục) đã hết, trừ những chỗ bản sửa còn để lại hay gây ra vấn đề mới, ghi ở các mục dưới: mục 3 vòng 1 (`dien-so-lien-sau`, nay mục 5), mục 14 (ví dụ đời sống, nay mục 3), mục 17 (`chon-x-tan-cung-5` còn giữ cận dưới của sách, nay mục 9), mục 19 (recap `sap-xep-liet-ke`, nay mục 10). Cả bài không còn "phần số", "số còn lại", "bước", "thỏa", "ông Tám"; mọi câu quy tắc, note, đề và lời giải đã được soát lại với tr.47–49, tr.111, không câu nào trùng nguyên văn (LL-08).

Tổng hợp đã đặt cạnh nhau mọi câu `rule`, recap section, recap card, caption hình và thuật ngữ của cả bài: recap của 10 section đầu và 12 card lặp đúng câu quy tắc; số đối nói một cách (quy tắc có câu quy ước cho số 0, mẹo và `explain` theo cùng ý); "trước, sau" luôn đi kèm "bên trái, bên phải"; khoảng cách chỉ gọi là "đơn vị". Mâu thuẫn còn lại ghi ở mục 10, 14, 26, 27, 28.

## Nghiêm trọng

### 1. Hình gợi ý `nhiet-ke-goi-y` có chữ "2 °C" chồng lên "Trên 0", và dấu "?" ở đỉnh cột không bao giờ hiện

- Vị trí: `$.exercises[1].hints.hintVisualId` (`doc-nhiet-ke`), hình `nhiet-ke-goi-y` trong `src/visuals/math/tap-hop-cac-so-nguyen/catalog.ts` (LL-12, LL-15)
- Nguồn: —
- Vấn đề: mark "2 °C" và nhãn vùng "Trên 0" cùng đặt ở vạch 2 (đỉnh thước `to: 2`), cùng bước 1, nên chồng thành "2°CTrên 0" (ảnh `visual:shot` iPad và điện thoại). Mark "?" ở −2 là bước cuối của hình, mà chế độ `hint` của `scale.tsx` ẩn mọi thứ thuộc bước cuối (`!(hint && stepOf(item) === last)`, và số bước phát là `last`), nên "?" không bao giờ hiện. Bé thấy cột dừng ở −2, nhưng con số duy nhất trên hình là "2 °C" ở đầu ống. Câu này có nhiễu 4 cho đúng lỗi đọc thiếu dấu −; hình gợi ý lại đẩy bé đọc ra số dương. Chữ chồng do hình của bài.
- Sửa: bỏ mark "2 °C" (hoặc dời nhãn vùng "Trên 0" khỏi vạch 2, vd đặt `to: 3`); giữ "?" ở −2 cùng vùng "Dưới 0" ở bước 1 hay 2, và thêm một bước cuối chỉ chứa mark "−2 °C" để chế độ `hint` ẩn đúng bước kết quả đó. Chụp lại `visual:shot` cả hai thiết bị và xem bước cuối hiện "?".

## Nên sửa

### 2. Bé chưa được làm mẫu đọc một điểm khi trục số không ghi số, mà câu kiểm tra bắt làm việc đó; hình của mẹo chỉ lặp lại hình quy tắc

- Vị trí: `$.sections[5].blocks[0]` (hình `diem-q-p`), `$.sections[5].blocks[1]` (hình `dat-hai-diem-p-q`), `$.sections[5].blocks[2].visualId` (hình `dem-buoc`); `$.exercises[22]` (`doc-diem-n`, câu kiểm tra) (LL-16, LL-15)
- Nguồn: tr.49 bài 3.3 (Hình 3.1 chỉ ghi số 0 và 1)
- Vấn đề: ba màn dạy của section đều hiện đủ số từ −5 đến 5 dưới trục, nên bé đọc thẳng nhãn số. Câu kiểm tra `doc-diem-n` là lần đầu bé gặp trục chỉ ghi 0 và 1 và phải tự đếm. Mẹo nói "chỉ đếm khoảng, không đếm vạch", nhưng hình `dem-buoc` giống hình quy tắc (P ở −3, mũi tên "3 đơn vị", số ghi đủ), không cho thấy cách đếm từng khoảng.
- Sửa: vẽ lại `dem-buoc` theo kiểu bài 3.3: `labelAt: [0, 1]`, điểm có `hideNumber`, các khoảng hiện lần lượt theo bước, mỗi khoảng ghi "1", "2", "3", rồi dừng ở số đọc được; dùng số khác −3, −2, −4 và 4 (vd điểm ở −5 hay 1). Có thể đổi hình màn cùng làm sang trục không ghi số.

### 3. Hai section chưa có ví dụ đời sống trong các màn bé đi qua: `diem-bieu-dien`, `sap-xep-liet-ke`

- Vị trí: `$.sections[5]` (`diem-bieu-dien`; câu đời sống duy nhất `$.exercises[28]` `doc-muc-nuoc` chỉ nằm ở card nên chỉ ra trong kho ôn); `$.sections[10]` (`sap-xep-liet-ke`, mọi khối và `xep-5-so`, `chon-x-giua-3-0`, `chon-dau-nho-hon-bang`) (LL-16)
- Nguồn: —
- Vấn đề: luật "ví dụ đời sống ở mọi section Toán" (mục 14 vòng 1). Hai section này chỉ có trục số và số trơn; bàn giao ghi đã đủ ở mọi phần.
- Sửa: `diem-bieu-dien`: đưa câu tàu ngầm vào `practiceIds` thay `noi-diem-so` (đổi `noi-diem-so` sang card), hoặc thêm một câu nối ở màn quy tắc về thước đo mực nước. `sap-xep-liet-ke`: một màn hay một câu nhỏ, vd "Nhiệt độ bốn ngày: 2, −4, 0, −1 độ C. Xếp từ lạnh nhất tới ấm nhất." (số khác `xep-5-so` và mẹo), hay với ≤: "Thang máy đi từ tầng hầm −2 tới tầng 1 thì dừng được ở những tầng nào?" (nói rõ cả −2 và 1 đều tính).

### 4. Lý do `wrong` cho lựa chọn "8" ở `so-doi-cua-8` không giải thích gì

- Vị trí: `$.exercises[29].explain.wrong[0].text` (`so-doi-cua-8`, lựa chọn a)
- Nguồn: —
- Vấn đề: "Số 8 nằm cùng phía với 8, chưa phải số đối." Số 8 là chính nó; câu không chỉ ra điều kiện "nằm hai bên gốc O" mà 8 không đạt.
- Sửa: "Số 8 chính là số đã cho. Số đối của 8 phải nằm ở bên kia gốc O."

### 5. `dien-so-lien-sau`: −8 nằm ngoài mọi trục số bé đã xem, màn không có trục, và "số liền sau" của số nguyên chỉ được nói trong lời giải

- Vị trí: `$.exercises[39]` (`dien-so-lien-sau`, card `so-sanh-truc`) (LL-09, LL-22, LL-20)
- Nguồn: tr.47–49 không có "số liền sau" của số nguyên
- Vấn đề: bản sửa mục 3 vòng 1 đã chuyển câu sang card `so-sanh-truc`. Bé chỉ biết "số liền sau của a là a + 1" với số tự nhiên; −8 + 1 cần phép cộng số nguyên chưa học. Cách hiểu "nằm ngay bên phải trên trục số" chỉ có trong `explain`, sau khi bé đã trả lời. Trục số của bài chỉ từ −5 đến 5 và đề không có hình. Ngân hàng có −9, lựa chọn bé dễ nhặt vì "9 đứng sau 8".
- Sửa: thêm hình `truc-so-tron` vào đề, dùng số nằm trên trục và nói cách tìm ngay trong đề: "Số liền sau là số nằm ngay bên phải trên trục số. Số liền sau của −4 là ___." (ngân hàng −3, −5, 4). Hoặc bỏ câu (card đã đủ câu).

### 6. Câu ôn lặp số của màn dạy và recap

- Vị trí: `$.exercises[28]` (`doc-muc-nuoc`, đáp án −3); `$.exercises[31].options[0]` (`chon-cap-so-doi`, "3 và −3") (LL-07)
- Nguồn: —
- Vấn đề: recap card `diem-bieu-dien` là "Số 3 … Số −3 … cách O 3 đơn vị", hình mẹo `dem-buoc` và màn cùng làm `truc-so` cũng dùng −3, mà câu ôn của chính card có đáp án −3. Cặp "3 và −3" của `chon-cap-so-doi` là đáp án màn cùng làm `so-doi`.
- Sửa: tàu ngầm ở −2 hay −4 (đổi `marks.at` của `muc-nuoc-tau-ngam`, `check.expr`, lựa chọn và `wrong`); `chon-cap-so-doi` thay "3 và −3" bằng cặp khác, vd "6 và −6".

### 7. Dấu điểm hình chữ thập màu sky ở hình số đối trông như dấu cộng

- Vị trí: hình `so-doi-5` (`$.sections[6].blocks[1]`, `$.sections[6].recap`, `$.cards[6].recap`) (LL-21)
- Nguồn: —
- Vấn đề: màu sky của "số đối" vẽ điểm bằng hình chữ thập (`src/visuals/shared/concept.ts`); trên điện thoại, hai dấu "+" xanh đậm đứng ngay trên −5 và 5, ở màn quy tắc và màn "Nhớ nhé!" của một bài đang dạy dấu −. Để mức Nên sửa vì dấu nằm trên trục, không đứng liền trước chữ số như ví dụ Nghiêm trọng của `so-nguyen-to`.
- Sửa: vẽ hai điểm bằng màu POINT và giữ sky cho nhãn số hay mũi tên; hoặc báo người làm app đổi hình của sky sang hình không giống ký hiệu toán.

### 8. Mẹo "Tìm số đối" gắn nhãn "tránh sai" nhưng là cách làm nhanh

- Vị trí: `$.sections[6].blocks[3].kind` (`tip.tim-so-doi`)
- Nguồn: —
- Vấn đề: chữ mẹo là cách tìm số đối bằng dấu; nhãn "Mẹo tránh sai" không nói bé tránh lỗi gì.
- Sửa: đổi `kind` thành "làm nhanh"; hoặc giữ nhãn và nói thẳng lỗi hay gặp.

### 9. `chon-x-tan-cung-5` vẫn là khuôn bài 3.6, giữ nguyên cận dưới −15 < x của sách

- Vị trí: `$.exercises[56].prompt[1]`, `$.exercises[56].prompt[2]`, `$.exercises[56].options` (`chon-x-tan-cung-5`) (LL-08)
- Nguồn: tr.49 bài 3.6, lời giải tr.111
- Vấn đề: đề "x có chữ số tận cùng là … và −15 < x ≤ …" giữ nguyên cận dưới −15 và dấu "<" của sách, chỉ đổi chữ số và cận trên: khuôn trùng sách, số trùng một phần.
- Sửa: đổi cả hai cận, vd tận cùng 5 với `-25 < x \le 5`: đáp án −15, −5, 5; lựa chọn −25 (loại vì "<"), −15, −5, 5, 15 (loại vì ≤ 5), 3 (loại vì chữ số); ghi chú "Số −25 và số −5 đều có chữ số tận cùng là 5."; `explain`, `wrong` đổi theo. Tránh −2, 1 của màn cùng làm và −3, 0 của `chon-x-giua-3-0`.

### 10. Recap section `sap-xep-liet-ke` và recap card `liet-ke` bỏ mất ý chính của dấu ≤; hình recap section không có ý sắp xếp

- Vị trí: `$.sections[10].recap` (caption và `visualId` `nho-hon-hoac-bang`), `$.cards[11].recap.caption` (`liet-ke`); câu quy tắc `$.sections[10].blocks[1].children[0].text` (LL-06)
- Nguồn: tr.47 ý 7
- Vấn đề: câu quy tắc ≤ có hai câu: cách đọc ≤ ≥ và "a ≤ b đúng khi a nhỏ hơn b, và cũng đúng khi hai số bằng nhau". Cả hai recap chỉ giữ câu cách đọc, trong khi ý "cũng đúng khi bằng nhau" là điều bé cần để chọn đầu mút ở `chon-x-giua-3-0`, `dem-so-nguyen-x`, `chon-x-tan-cung-5`. Recap section mở bằng câu sắp xếp nhưng hình đi kèm là `nho-hon-hoac-bang` (ba dòng ≤ ≥), còn card `sap-xep` dùng `xep-hang-xong`: hai nơi tóm tắt cùng ý bằng hai hình. Đây là recap duy nhất của bài không lặp đủ câu quy tắc.
- Sửa: recap card `liet-ke` lặp nguyên văn cả hai câu quy tắc ≤; recap section lặp đủ hai câu quy tắc nếu `[recap]` cho phép, hoặc tách section (mục 11) để mỗi recap lặp đủ quy tắc của mình với đúng hình của nó.

### 11. Section `sap-xep-liet-ke` gộp hai quy tắc và xếp xen kẽ hai ý

- Vị trí: `$.sections[10].blocks`, `checkIds`, `practiceIds` (`sap-xep-liet-ke`)
- Nguồn: tr.47 ý 7, tr.49 bài 3.6
- Vấn đề: hai câu `rule: true` cần nhớ riêng và hai card; thứ tự màn là quy tắc sắp xếp, quy tắc ≤, mẹo sắp xếp, cùng làm ≤, kiểm tra ≤, luyện sắp xếp, luyện ≤. Mẹo xếp số bị tách khỏi quy tắc của nó; bé chậm đổi ý bốn lần trong một section.
- Sửa: tách thành `sap-xep` (quy tắc trục số, mẹo, luyện `xep-5-so`) và `liet-ke` (quy tắc ≤, cùng làm, kiểm tra `chon-dau-nho-hon-bang`, luyện `chon-x-giua-3-0`), khớp hai card có sẵn; ít nhất đưa mẹo lên ngay sau quy tắc sắp xếp.

### 12. `explain` của `so-nho-nhat-trong-bon` có câu "số nào lớn nhất là số nhỏ nhất"

- Vị trí: `$.exercises[47].explain.text` (`so-nho-nhat-trong-bon`) (LL-10, LL-25)
- Nguồn: —
- Vấn đề: "Trong các số âm, bỏ dấu − thì số nào lớn nhất là số nhỏ nhất." Hai từ ngược nhau trong một câu, không nói "lớn nhất" là số sau khi bỏ dấu; câu thứ hai đã nói đúng ý.
- Sửa: "Bỏ dấu − thì 41 lớn nhất, nên −41 là số âm nhỏ nhất. Số 0 lớn hơn mọi số âm."

### 13. Câu ôn `xep-4-so-giam` dùng lại cặp −7, −2 của màn dạy và recap `hai-so-am`

- Vị trí: `$.exercises[53].items` (`xep-4-so-giam`, card `sap-xep`) (LL-07)
- Nguồn: —
- Vấn đề: chỗ khó của câu là đặt −2 trước −7, đúng cặp ở note mở đầu, hình `lanh-hon`, `bo-dau` và recap `bo-dau-xong`.
- Sửa: đổi hai số âm, vd 6, 2, −4, −9; `explain` và `tex` đổi theo.

### 14. Màn mở đầu `tap-hop-z` nói ba nhiệt độ, hình chỉ có bảy số trơn

- Vị trí: `$.sections[3].blocks[0].children[0].text` và hình `z-ba-phan` (`tap-hop-z`; cùng hình làm recap `$.sections[3].recap`, `$.cards[3].recap`) (LL-15)
- Nguồn: tr.47 ý 2
- Vấn đề: note "Ba nhiệt độ −3 độ C, 0 độ C và 3 độ C nằm ở ba nhóm số khác nhau." nhưng hình là ba hàng −3, −2, −1 / 0 / 1, 2, 3, không có nhiệt độ; bé đọc chữ nói ba số mà thấy bảy số. Màn này cũng lặp ý màn mở đầu `duong-am-khong` ngay trước (hình `duong-am-khong` đã là ba nhiệt độ 4, 0, −2 ở ba nhóm).
- Sửa: đổi note theo hình, vd "Các số nguyên chia làm ba nhóm: số nguyên âm, số 0 và số nguyên dương. Nhiệt độ −3 độ C, 0 độ C, 3 độ C mỗi số thuộc một nhóm."; hoặc thêm nhãn "−3 °C", "0 °C", "3 °C" vào hình mở đầu (hình recap giữ như cũ).

### 15. Số trên thước nhiệt kế nhỏ hơn 16px, câu `doc-nhiet-ke` bắt đọc đúng các số đó

- Vị trí: hình `nhiet-ke-doc`, `nhiet-ke-buoc`, `nhiet-ke-tom-tat`, `nhiet-ke-goi-y` (`$.exercises[1]`, `$.sections[0].blocks[0]`, `$.sections[0].recap`, `$.cards[0].recap`) (LL-12)
- Nguồn: —
- Vấn đề: trên iPad, chữ số của thước cao khoảng 10 px trên màn (cỡ chừng 14px) vì SVG co theo `max-w-[19rem]`; walk không cảnh báo vì chữ nằm trong SVG. Bé phải đọc vạch −4, −5 để chọn giữa −3, −4, −5.
- Sửa: tăng `TEXT_SIZE` của thước dọc trong `scale.tsx` (hay thu hẹp khoảng −5..5 của câu luyện) để số đạt ít nhất 16px trên iPad và điện thoại; chụp lại.

## Góp ý

### 16. Nhiễu yếu ở `so-chi-tieu`, và "sổ chi tiêu" làm dấu − thành thừa

- Vị trí: `$.exercises[7].options[2]` (`so-chi-tieu`) (LL-14)
- Nguồn: —
- Vấn đề: "Mẹ không tiêu đồng nào" không cách nghĩ sai nào dẫn tới; sổ chi tiêu vốn chỉ ghi khoản tiêu nên bé có thể thắc mắc vì sao có dấu −.
- Sửa: đổi thành "sổ thu chi", thay lựa chọn c bằng nhiễu theo lỗi hay gặp, vd "Mẹ còn lại 35 000 đồng". Tránh nhiễu "Mẹ nợ 35 000 đồng" vì có thể cũng đúng theo quy tắc "có và nợ" (LL-01).

### 17. Ba câu dựng theo khuôn ví dụ của sách, số khác

- Vị trí: `$.exercises[5]` (`chon-muc-nuoc-bien-8`, khuôn ví dụ 1b), `$.exercises[0]` (`viet-2-do-duoi-0`, khuôn ví dụ 1a đảo chiều), `$.exercises[45]` (`so-sanh-am-45-54`, khuôn ví dụ 2c: hai số âm đảo chữ số, lời giải "…, hay …") (LL-08)
- Nguồn: tr.48 ví dụ 1 a), b), ví dụ 2 c)
- Vấn đề: câu chữ, số và nhân vật khác sách; chỉ khuôn tình huống trùng nên không chặn.
- Sửa: đổi `chon-muc-nuoc-bien-8` sang tình huống khác ("con cá ở sâu 8 m dưới mặt hồ"); `so-sanh-am-45-54` dùng cặp không đảo chữ số, vd −36 và −52 (đổi id theo số, bài chưa khoá id), `explain` kết bằng một câu.

### 18. Tên hình và trục của hình lời giải còn sót từ bản cũ

- Vị trí: hình `doc-diem-mnpq` (chỉ còn M, N, P); hình `doc-diem-giai` (`solutionVisualId` của `doc-diem-n`, trục từ −6 đến 5)
- Nguồn: —
- Vấn đề: id còn chữ "q" dù Q đã bỏ; trục lời giải lệch với trục của đề (−5 đến 5) nên gốc O không ở cùng chỗ.
- Sửa: đổi id thành `doc-diem-mnp`; cho `doc-diem-giai` dùng `R5`.

### 19. "Nhiệt kế chính là một trục số", "số 0 ở giữa" ở màn mở đầu `truc-so`

- Vị trí: `$.sections[4].blocks[0].children[0].text` (`truc-so`)
- Nguồn: tr.47 ý 3
- Vấn đề: chỉ hình này có 0 ở giữa; bé có thể nghĩ mọi trục số đều vậy. "chính là" nói quá.
- Sửa: "Nhiệt kế giống một trục số đặt đứng. Xoay nằm ngang, ta có trục số: hai vạch liền nhau cách nhau 1 đơn vị."

### 20. Trục số có mũi tên ở cả hai đầu, khác Hình 3.1 của sách

- Vị trí: primitive `src/visuals/shared/number-line.tsx`, mọi hình trục số
- Nguồn: tr.49 Hình 3.1, bài 3.5
- Vấn đề: sách chỉ vẽ mũi tên chiều dương; app vẽ hai đầu nên mất ý chiều dương. Việc của app.
- Sửa: cân nhắc chỉ vẽ mũi tên bên phải.

### 21. Mục số của câu nối và thẻ của câu xếp thứ tự viết bằng chữ nên nhỏ, dấu − mảnh

- Vị trí: `$.exercises[23].right` (`noi-diem-so`), `$.exercises[30].left`, `.right` (`noi-so-doi`), `$.exercises[51].items` (`xep-5-so`), `$.exercises[53].items` (`xep-4-so-giam`)
- Nguồn: —
- Vấn đề: "−1", "−8", "−11" nhỏ và mảnh hơn hẳn số ở các câu chọn ngay trước (công thức), cùng kiểu mục 31 vòng 1; cả bài xoay quanh dấu −.
- Sửa: viết các mục số bằng `formula` nếu dạng câu cho phép; không được thì báo người làm app tăng cỡ chữ thẻ.

### 22. Hình so sánh không có vòng gốc O, mà lý do `wrong` lại nhắc gốc O

- Vị trí: hình `so-sanh-ab` (`$.exercises[35]`, `diem-lon-hon-ab`), `so-sanh-buoc`, `so-sanh-xong`
- Nguồn: —
- Vấn đề: ba hình chỉ có vạch dài ở 0, không có vòng và chữ "O" như các hình khác.
- Sửa: thêm `{ type: "origin" }` vào ba hình.

### 23. `diem-lon-hon-ab` chỉ còn hai lựa chọn, số dưới điểm ghi sẵn

- Vị trí: `$.exercises[35].options` (`diem-lon-hon-ab`)
- Nguồn: —
- Vấn đề: đoán bừa đúng một nửa, và −4, −1 ghi sẵn dưới hai điểm.
- Sửa: ẩn số của hai điểm (`hideNumber`, `labelAt: [0]`) để bé dựa vào vị trí, hoặc thêm điểm C.

### 24. Câu ôn của card `truc-so` và `diem-bieu-dien` dùng lại số và hình của nhau

- Vị trí: `$.exercises[27]` (`dat-ba-diem`: −5, −1, 4) lặp `$.exercises[20]` (`dat-hai-diem-a-b`) và `$.exercises[25]` (`chon-diem-am-5`); `$.exercises[24]` (`doc-diem-m`) dùng lại hình của câu kiểm tra `doc-diem-n` (LL-07)
- Nguồn: —
- Vấn đề: khi ôn, bé gặp lại đúng hình và số vừa làm.
- Sửa: đổi `dat-ba-diem` sang vd −4, −2, 3; cho `doc-diem-m` một hình riêng với điểm khác.

### 25. Ở iPad nằm ngang, hình trục số nhỏ giữa khung rộng

- Vị trí: mọi màn có trục số của section 5–8, sheet `ipad-landscape`
- Nguồn: —
- Vấn đề: trục số chiếm khoảng một phần ba bề ngang thẻ. Do bố cục app.
- Sửa: báo người làm app cho hình giãn theo bề ngang thẻ ở chế độ nằm ngang.

### 26. Câu quy tắc `hai-so-am` dùng "Số âm nào cho số lớn hơn", và cùng ý được nói bốn kiểu trong bài

- Vị trí: `$.sections[9].blocks[1].children[0].text`, `$.sections[9].recap.caption`, `$.cards[9].recap.caption` (`hai-so-am`); `$.sections[9].blocks[2].children[0].text` (cùng làm: "Bỏ dấu − thì số nào lớn hơn 4 là số cần tìm"); `$.sections[10].blocks[2].text` (`tip.xep-tu-be-den-lon`: "số nào lớn hơn khi bỏ dấu − thì đứng trước") (LL-25, LL-05)
- Nguồn: —
- Vấn đề: "cho số lớn hơn" là cách nói lạ với bé ("cho" ai?). Cùng một ý (bỏ dấu −, số lớn hơn thì số âm nhỏ hơn) có bốn cách nói ở quy tắc, cùng làm, mẹo sắp xếp và `explain` của `so-nho-nhat-trong-bon` (mục 12); các `explain` còn lại đã theo một khuôn "Bỏ dấu − thì 130 lớn hơn 120. Vậy −130 nhỏ hơn −120." Ý không sai nên để Góp ý.
- Sửa: "Muốn so sánh hai số âm khác nhau, bỏ dấu − của cả hai số rồi so sánh. Số âm nào có số lớn hơn sau khi bỏ dấu − thì nhỏ hơn." (đổi cùng recap section và card); câu cùng làm và mẹo nói theo khuôn của `explain`: "Bỏ dấu −: số nào lớn hơn 4 thì số âm đó nhỏ hơn −4."

### 27. Danh sách vô hạn nói hai cách, "và lớn hơn nữa" và "và cứ thế tiếp"; dấu ≤ còn được nói là "lấy cả hai đầu"

- Vị trí: "và lớn hơn nữa" ở quy tắc `duong-am-khong` (`$.sections[2].blocks[1].children[0].text`, recap) và `explain` của `chon-tat-ca-duong`, `noi-nhom-so`; "và cứ thế tiếp" ở `explain` của `so-nguyen-khong-tu-nhien`, `chon-nhieu-so-tu-nhien`, `chon-cau-dung-z`; "Dấu ≤ cho phép lấy cả hai đầu" ở `$.exercises[55].explain.text` (`dem-so-nguyen-x`) (LL-05)
- Nguồn: —
- Vấn đề: hai section liền nhau nói dãy số kéo dài mãi bằng hai cụm khác nhau; "hai đầu" là từ mới, không có trong câu quy tắc ≤ ("cũng đúng khi hai số bằng nhau").
- Sửa: chọn một cụm cho cả bài, vd "1, 2, 3, 4 và cứ thế tiếp"; `dem-so-nguyen-x`: "Dấu ≤ cũng đúng khi hai số bằng nhau, nên −2 và 2 đều được tính. Vậy có 5 số."

### 28. Tên điểm P, Q mang hai vị trí khác nhau trong ba màn liền nhau của `diem-bieu-dien`

- Vị trí: hình `diem-q-p` (P ở −3, Q ở 3), `dat-hai-diem-p-q` (đưa P tới −4, Q tới 2), `dem-buoc` (P ở −3) (`$.sections[5].blocks[0..2]`)
- Nguồn: —
- Vấn đề: vừa đọc "P ở −3" ở màn quy tắc, màn cùng làm ngay sau lại bảo đưa P tới −4; bé chậm dễ nghĩ mình nhớ sai chỗ của P.
- Sửa: màn cùng làm dùng tên khác, vd điểm C và D.

### 29. Nhãn "2 tầng", "−2 tầng" ở hình `tang-ham` đọc như số lượng tầng

- Vị trí: hình `tang-ham` (`$.sections[1].blocks[0]`)
- Nguồn: —
- Vấn đề: note nói "Ta đếm tầng từ mặt đất, mặt đất là số 0", tức số chỉ vị trí; nhãn "−2 tầng" đọc như "âm hai cái tầng". Hình `doi-lap` cùng section lại dùng "Đi xuống 4 tầng" cho −4 (sự di chuyển).
- Sửa: nhãn "Tầng 2" và "Tầng hầm 2: −2" (hay "tầng −2").
