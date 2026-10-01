# Review: Ước chung. Ước chung lớn nhất (`uoc-chung-uoc-chung-lon-nhat`)

- Bài: `content/math/kntt/uoc-chung-uoc-chung-lon-nhat/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/uoc-chung-uoc-chung-lon-nhat/` - p38-40, p107-108
- `content:check`: 0 lỗi, 0 cảnh báo của bài (trừ cảnh báo id chưa khoá)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/uoc-chung-uoc-chung-lon-nhat/`; `visual:shot` 152/152
- Kết luận: Chưa đạt: còn 4 lỗi Nghiêm trọng (đã chạy `pnpm content:hash uoc-chung-uoc-chung-lon-nhat --root content --mark`)
- Bản đã review: `efda49d6f824f553af298b0c4f5746170b399e530375ad6069f0337b3bf473f2` (`pnpm content:diff` so với bản này)

Đã soát: 65 bài tập (cả ba reviewer tự giải trước khi đọc `answer`: mọi đáp án, `accept`, `check` đúng, mỗi câu đúng một đáp án hay một tập đáp án, các câu `order` chỉ có một thứ tự đúng); mọi `note` quy tắc, `recap`, `caption`, recap card, glossary Toán. Recap của 13 card trùng recap section.

Bản sửa vòng 1: 8 Nghiêm trọng cũ đã sửa đúng ở các chỗ được nêu (chiều chia hết section 10, định nghĩa ƯCLN, quy tắc section 6, 8, 11, `CutTry`, màu hàng Ư(n), note chia dần, kiến thức nền phân số). Còn sót hay sinh lỗi mới ở 4 chỗ (LL-20): note màn chạm section 3 chưa đổi theo bảng số mới (Nghiêm trọng 1); câu điền `dien-tong-uoc` chưa viết lại theo định nghĩa số hoàn hảo mới (Nghiêm trọng 3); Nên sửa 7 vòng 1 bảo chép câu quy tắc của bài `so-nguyen-to`, mà câu đó chép sách (Nghiêm trọng 2); câu nhắc rút gọn phân số do chính vòng 1 đề xuất thiếu điều kiện (Nghiêm trọng 4). Góp ý 15 vòng 1 ("bé" và "nhỏ") chưa sửa (Góp ý 2).

Không ghi lại (đã có trong `notebooks/backlogs/lesson-uoc-chung-uoc-chung-lon-nhat/task.md`): `sourceRef` section 5 không trỏ được trang bài Số nguyên tố; căn tên cách chia ("chia dần" hay "sơ đồ cột"), cách viết phân tích và màu "số nguyên tố" của section 5 với bài `so-nguyen-to` sau khi bài đó xuất bản.

## Nghiêm trọng

### 1. Màn chạm ƯCLN bảo chọn cho 8 và 12, lời kết của hình lại nói 20 và 24 (LL-20, LL-15)

- Vị trí: `$.sections[2].blocks[3].children[0].text` (`section.uoc-chung-lon-nhat`), hình `chon-uclnn-20-24` (`catalog.ts`, trường `done`)
- Nguồn: —
- Vấn đề: note "Chạm vào ước chung lớn nhất của 8 và 12", hình `done: "Bạn đã chọn đúng ước chung lớn nhất của 20 và 24."`. Đáp án tình cờ trùng (cả hai là 4) nên walk không bắt, nhưng ngay lúc làm đúng trẻ đọc một câu về hai số khác đề. Bảng Nên sửa 16 vòng 1 đổi màn này sang 20 và 24; tác giả đổi id và `done` mà quên note.
- Sửa: note thành "Chạm vào ước chung lớn nhất của 20 và 24. Tìm các ước chung trước rồi chọn số lớn nhất." Không quay về 8 và 12: cặp này đã có ở `chon-dia-8-12` và `uclnn-8-12-20`, cùng ra 4. Giữ dãy chip 1, 2, 4, 5, 6, 8 (5 chỉ là ước của 20; 6, 8 chỉ là ước của 24). Đã soát: cặp 20, 24 không có ở chỗ nào khác trong bài.

### 2. Hai định nghĩa của section `nhac-thua-so` chép câu sách bài Số nguyên tố (LL-08)

- Vị trí: `$.sections[4].blocks[0].children[0].text`, `$.sections[4].blocks[2].children[0].text` (cả hai `rule`), `$.sections[4].recap.caption`, `$.cards[4].recap.caption`; câu kéo theo: `$.sections[4].blocks[3].children[0].text` (note màn chạm `chon-sn`), `$.exercises[23].segments` (`dien-sn-chinh-no`) (`section.nhac-thua-so`, `card.nhac-thua-so`)
- Nguồn: "Kiến thức cần nhớ" ý 1, 3 tr.35 SBT (bài 10). Trang này không có trong `sources/` của bài, nhưng LL-08 đã ghi (review `so-nguyen-to` vòng 1, có đọc trang): câu số nguyên tố trùng từng chữ ý 1; câu phân tích là ý 3 bỏ "tự nhiên lớn hơn 1" và "dưới dạng một".
- Vấn đề: "Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó." chép nguyên câu sách. "Phân tích một số ra thừa số nguyên tố là viết số đó thành tích của các số nguyên tố." vừa chép vừa mất điều kiện: sách chỉ định nghĩa phân tích cho số lớn hơn 1 (số 0 và số 1 không phân tích được). Mất điều kiện này là có thật, nhưng không câu nào bắt trẻ phân tích 0 hay 1, nên mức Nghiêm trọng ở đây là do chép sách. Lỗi đến từ Nên sửa 7 vòng 1 (bảo chép câu của bài `so-nguyen-to`, lúc đó chính câu ấy đang chép sách).
- Sửa: bài này tự diễn đạt lại, giữ điều kiện:
  - Số nguyên tố (rule): "Một số lớn hơn 1 mà chỉ chia hết cho 1 và cho chính nó thì gọi là số nguyên tố. Ví dụ 2, 3, 5, 7 và 11 là các số nguyên tố."
  - Phân tích (rule): "Với một số lớn hơn 1, viết nó thành tích mà mọi thừa số đều là số nguyên tố: đó là phân tích số ấy ra thừa số nguyên tố. Thừa số nào lặp lại thì viết bằng luỹ thừa."
  - Recap section và recap card: chép nguyên văn câu mới (xem cả Nên sửa 5 về số câu của recap).
  - Note `chon-sn`: "Chạm vào các số nguyên tố. Số nguyên tố chỉ chia hết cho 1 và cho chính nó."; `dien-sn-chinh-no`: "Một số lớn hơn 1 mà chỉ chia hết cho 1 và cho ___ thì gọi là số nguyên tố." (`accept: ["chính nó"]`, giữ ngân hàng).
  - Khi bài `so-nguyen-to` chốt câu đã viết lại của nó, vòng căn chỉnh section 5 trong backlog chép theo câu đó (miễn câu đó không còn chép sách).

### 3. Câu điền `dien-tong-uoc` vẫn là câu 2.38 đảo vế, và là cách nói thứ hai của quy tắc số hoàn hảo (LL-08, LL-05)

- Vị trí: `$.exercises[56].segments` (`ex.dien-tong-uoc`, kho ôn card `so-hoan-hao`)
- Nguồn: tr.40, `sbt-p40.png`, câu 2.38
- Vấn đề: "Số hoàn hảo là số bằng ___ các ước của nó, không kể chính nó." chỉ đảo vế câu định nghĩa của 2.38, giữ từng cụm. Nghiêm trọng 4 vòng 1 đã viết lại quy tắc theo cách làm, nhưng câu ôn còn giữ câu sách, nên trẻ gặp hai cách nói của một quy tắc: một ở màn học và recap, một ở kho ôn.
- Sửa: dựng câu điền từ đúng câu `rule`, như `dien-rut-gon`: "Cộng tất cả các ước của một số, không kể chính nó. Nếu ___ đúng bằng số đó thì số đó là số hoàn hảo." (`accept: ["tổng"]`, ngân hàng "tổng", "tích", "số lượng").

### 4. Câu nhắc rút gọn phân số thiếu điều kiện của số chia (LL-17)

- Vị trí: `$.sections[12].blocks[0].children[0].text` (`section.rut-gon-phan-so`); caption hình `rg-20-28` (`$.sections[12].blocks[1]`)
- Nguồn: Kiến thức nền (tiểu học); tr.38 (kĩ năng đưa phân số về tối giản), tr.107 lời giải 2.40
- Vấn đề: "Chia cả tử và mẫu của phân số cho cùng một số thì được phân số bằng nó mà gọn hơn. Làm vậy gọi là rút gọn phân số." sai khi số đó là 0 (không chia được), là 1 (không gọn hơn), hay không là ước của cả tử và mẫu (5/7 chia cho 2 không còn là phân số có tử, mẫu là số tự nhiên). Đây là câu duy nhất nói "rút gọn phân số" là gì (thuật ngữ glossary có `prerequisite`), trẻ nhớ nguyên câu; cùng kiểu lỗi mất "khác 0", "lớn hơn 1" đã tính Nghiêm trọng ở các bài trước. Câu này do Nghiêm trọng 8 vòng 1 đề xuất.
- Sửa: nêu điều kiện bằng kiến thức của bài: "Chọn một ước chung lớn hơn 1 của tử và mẫu, rồi chia cả tử và mẫu cho số đó: ta được phân số bằng phân số cũ, có tử và mẫu nhỏ hơn. Làm vậy gọi là rút gọn phân số." Caption `rg-20-28`: "2 là ước chung của tử và mẫu: chia cả hai cho 2, rồi lại cho 2, tới khi tử và mẫu chỉ còn ước chung là 1." (khớp định nghĩa tối giản của section trước, thay cho "không chia tiếp được nữa").

## Nên sửa

### 1. Định nghĩa ước chung có hai câu quy tắc khác nhau (section 1 và 10) (LL-05)

- Vị trí: `$.sections[0].blocks[2].children[0].text` (`section.uoc-chung`); `$.sections[9].blocks[1].children[0].text`, `$.sections[9].recap.caption`, `$.cards[9].recap.caption` (`section.bai-toan-uc`)
- Nguồn: tr.38, `sbt-p38.png`, ý 1
- Vấn đề: section 1 "Một số là ước của tất cả các số đã cho thì gọi là ước chung của các số đó."; section 10 "Nếu hai số đều chia hết cho một số thì số đó là ước chung của hai số." Cả hai đúng, nhưng là hai câu `rule` cho cùng một khái niệm; câu sau còn hẹp lại thành "hai số".
- Sửa: section 10 chỉ giữ phần riêng của nó (cách đọc đề), không định nghĩa lại: "Đề hỏi số mà mọi số đã cho đều chia hết cho nó thì ta tìm ước chung. Đề hỏi số lớn nhất như vậy thì ta tìm ƯCLN." Chép cùng câu vào recap section, recap card. Giữ đúng chiều chia hết đã sửa ở vòng 1.

### 2. Quy tắc section 9 gọi mỗi loại đồ vật là "nhóm"; câu điền nói cách khác và bỏ "không thừa" (LL-10, LL-05)

- Vị trí: `$.sections[8].blocks[1].children[0].text` (rule), `$.sections[8].recap.caption`, `$.cards[8].recap.caption` (`section.chia-deu-nhieu-nhat`); `$.exercises[45].segments` (`dien-so-phan-nhieu-nhat`); `$.exercises[38].prompt[0]` (`chia-nhom-16-28`)
- Nguồn: tr.39 ví dụ 2
- Vấn đề: "Chia đều các nhóm đồ vật vào các phần như nhau, không thừa. Số phần nhiều nhất là ƯCLN của số đồ vật mỗi nhóm." Câu kiểm tra ngay trước (`chia-nhom-16-28`) lại gọi bên nhận là "nhóm"; trẻ dễ hiểu "nhóm" là "đĩa" và "số đồ vật mỗi nhóm" là số quả trên mỗi đĩa. Câu điền "Khi chia đều nhiều nhóm đồ vật, số phần nhiều nhất là ___ của số đồ vật mỗi nhóm." khác câu quy tắc và thiếu "không thừa" (được thừa thì chia được nhiều phần hơn).
- Sửa: rule, recap section, recap card: "Khi chia đều các loại đồ vật vào các phần như nhau, không thừa, số phần nhiều nhất là ƯCLN của số đồ vật mỗi loại." Câu điền dựng từ đúng câu này, chỉ khoét "ƯCLN". Ở `chia-nhom-16-28` đổi "trong một nhóm" thành "trong một tổ".

### 3. Màu cam (ƯCLN) tô lên những thứ không phải ƯCLN

- Vị trí: hình `tg-5-7` (dòng `\frac{5}{7}` màu `amber` cạnh chú giải "Ước chung lớn nhất"; màn quy tắc `$.sections[11].blocks[1]`, recap section và card `phan-so-toi-gian`); nhãn `amber` trong `hh-6`, `hh-6-xong`, `hh-28`, `rg-20-28`, `tg-tom-tat`, `rg-giai-18-24`, `rg-goi-y-6-15` (`catalog.ts`)
- Nguồn: —
- Vấn đề: cả bài, cam là ƯCLN. Ở `tg-5-7` phân số 5/7 mang ô vuông cam đúng như chú giải "Ước chung lớn nhất" (ảnh `phone/142-s12-02-block.png`), ở số hoàn hảo và rút gọn nhãn kết quả cũng mang màu ƯCLN. Để Nên sửa vì dòng chữ bên dưới vẫn nói đúng "ƯCLN(5, 7) = 1".
- Sửa: dòng 5/7 của `tg-5-7` màu `slate`; nhãn kết quả không phải ƯCLN dùng `slate`. Nhãn "ƯCLN(20, 28) = 4", "ƯCLN(18, 24) = 6" trong hình rút gọn thì đổi sang cam.

### 4. Xanh dương, hồng, xanh trời mang nhiều nghĩa; khái niệm "Cơ số" lệch chú giải "Thừa số nguyên tố"

- Vị trí: `$.concepts[2]` (`concept.co-so`, "Cơ số", blue), `$.cards[4..6].conceptIds`; hình `chia-dan-*`, `bang-*` (chú giải blue "Thừa số nguyên tố"), `sn-vi-du` (thẻ "7 chỉ có ước 1 và 7" màu blue), `cut-bars.tsx` (chấm trong dải blue, "Còn thừa" pink), `dia-18-30`, `dia-18-30-xong`, `dia-14-35`, `dia-goi-y-8-12` (quả màu blue, pink); `$.concepts[4]` (`phan-so`, pink), `$.concepts[5]` (`rut-gon-phan-so`, sky); `content/glossary/math.json` ("số nguyên tố" sky, "thừa số" blue)
- Nguồn: —
- Vấn đề: bài khai blue là "Cơ số" nhưng màn trẻ thấy gọi nó là "Thừa số nguyên tố"; section 5 không dạy cơ số mà card vẫn gắn "Cơ số". Blue còn tô thẻ số nguyên tố, chấm dải băng, quả cam. Pink khai là "Phân số" nhưng hình nào cũng dùng cho "Còn thừa" và quả quýt, không tô phân số nào. Sky khai cho "Rút gọn phân số" (không hình nào dùng) trùng màu glossary của "số nguyên tố".
- Sửa: đổi `concept.co-so` thành khái niệm "Thừa số nguyên tố" (blue, khớp glossary "thừa số"), cập nhật `conceptIds` các card. Chấm dải băng, thẻ `sn-vi-du`, quả trong các hình đĩa dùng màu không thuộc `concepts` (`slate`, hay một màu đồ vật trung tính). "Còn thừa" giữ pink thì bỏ khái niệm "Phân số" khỏi `concepts` (không hình nào tô phân số bằng pink), hoặc đổi "Còn thừa" sang màu khác. Bỏ hay đổi màu `rut-gon-phan-so` để không trùng sky. Màu "số nguyên tố" giữa hai bài để vòng căn chỉnh trong backlog.

### 5. Section `nhac-thua-so` gộp hai quy tắc, recap phải ghép hai câu dài

- Vị trí: `$.sections[4]` (hai note `rule: true`), `$.sections[4].recap.caption`, `$.cards[4].recap.caption`
- Nguồn: —
- Vấn đề: recap ghép hai định nghĩa (ảnh `phone/068-s5-07-recap.png`: năm dòng chữ trước khi tới hình). Checklist trục 5: section gộp hai quy tắc cần nhớ riêng.
- Sửa: tách thành hai section: "Nhắc lại: số nguyên tố" (note quy tắc + `sn-vi-du`, màn chạm `chon-sn`; kiểm tra `chon-sn-13`; card kho ôn `dien-sn-chinh-no`) và "Nhắc lại: phân tích ra thừa số nguyên tố" (note chia dần + `chia-dan-12`, quy tắc + `chia-dan-36-xong`; kiểm tra `thieu-thua-so-30`, luyện `phan-tich-24`; kho ôn `xep-chia-dan-45`), mỗi section một recap một câu. Hoặc giữ một section và bỏ `rule` ở câu số nguyên tố, recap chỉ còn câu phân tích (khi đó đổi card của `chon-sn-13`, `dien-sn-chinh-no` sao cho kho ôn không hỏi điều recap không có).

### 6. Kí hiệu ƯC(12, 18) và dấu ngoặc nhọn hiện từ section 2 mà chưa câu nào đọc (LL-10)

- Vị trí: `$.sections[1].blocks[0]` (hình `ds-12-18`, hàng "ƯC(12, 18)"), `$.sections[2].blocks[2].children[0].text` và hình `ky-hieu-12-18`
- Nguồn: tr.107, `sbt-p107.png` (lời giải 2.33)
- Vấn đề: màn đầu section 2 đã có nhãn "ƯC(12, 18)" (ảnh `019`), section 3 chỉ đọc dòng ƯCLN, còn dòng "ƯC(12, 18) = {1; 2; 3; 6}" (ảnh `037`) có ngoặc nhọn, chấm phẩy không ai nhắc; `docs/learner.md` ghi trẻ còn yếu kí hiệu { }.
- Sửa: caption `ds-12-18` thêm "ƯC(12, 18) là các ước chung của 12 và 18."; note section 3 thêm câu: "ƯC(12, 18) = {1; 2; 3; 6} đọc là: các ước chung của 12 và 18 là 1, 2, 3 và 6."

### 7. Section `liet-ke-uc` không có ví dụ đời sống (LL-16)

- Vị trí: `$.sections[1]` (`section.liet-ke-uc`)
- Nguồn: —
- Vấn đề: bốn màn và hai câu chỉ có danh sách số, trái luật "Ví dụ đời sống ở mọi section Toán" của `lesson-author`.
- Sửa: caption `ds-12-18` nối với dải băng section 1: "Các ước chung 1, 2, 3, 6 cũng là các độ dài (dm) cắt vừa hết cả dải 12 dm và dải 18 dm."

### 8. Quy tắc section 4 dùng "các số kia" không rõ chỉ số nào (LL-10)

- Vị trí: `$.sections[3].title`, `$.sections[3].blocks[1].children[0].text`, `$.sections[3].recap.caption`, `$.cards[3].recap.caption` (`section.so-nho-chia-het`)
- Nguồn: tr.39 câu 2.34, tr.107 lời giải
- Vấn đề: "Nếu các số kia đều chia hết cho số bé nhất thì ƯCLN là số bé nhất." Recap card được xem một mình trong phiên ôn, "các số kia" không có gì để trỏ về.
- Sửa: "Nếu mọi số còn lại đều chia hết cho số nhỏ nhất thì ƯCLN chính là số nhỏ nhất. Ví dụ 21 chia hết cho 7 nên ƯCLN(7, 21) = 7." Tên section "Khi số lớn chia hết cho số nhỏ"; chép đúng câu vào hai recap (xem Góp ý 2).

### 9. Câu kho ôn, câu kiểm tra dùng lại số và kết quả của recap hay màn ngay trước (LL-07, LL-18)

- Vị trí: các mục trong bảng
- Nguồn: tr.39 ví dụ 2 (16, 24, 40)
- Vấn đề: recap card `uclnn-ba-so` (`bang-18-24-30-xong`) cho sẵn 18, 30 có thừa số chung 2, 3 và ƯCLN 6, đúng đáp án `chon-chung-12-18-30`, `uclnn-18-30-42`; `uclnn-9-18-45` lặp 9, 45 và đáp án 9 của `uclnn-9-45`; `uclnn-20-30-50` có đúng hai dòng 20, 30 và kết quả 10 của màn cùng làm `bang-20-30`, thêm 50 không đổi kết quả. Recap `uclnn-uc-24-36` in "ƯCLN(24, 36) = 12", đáp án `tinh-uclnn-24-36`. `but-vo-20-30` là phép tính của `bang-20-30`. Câu kiểm tra `uclnn-8-12-20` lặp dòng 12, 20 của màn chạm `chon-chung-12-20-28` ngay trước; `dia-12-20` lặp táo, lê, 12 và kết quả 4 của `chon-dia-8-12`. `uclnn-24-56`, `chon-chung-12-18-30`, `uclnn-18-30-42` bắt trẻ tự phân tích hai, ba số, quá 2 phép tính nhẩm trong khi các câu cùng card cho sẵn phân tích.
- Sửa: đổi theo bảng; đổi id, đề, `check`, `params` và các hình gợi ý, lời giải đi kèm (LL-15); tự giải lại từng câu, từng nhiễu (LL-01). Đã soát: mọi cặp số mới không trùng cặp nào trong bài (cả id, đề, hình) và không trùng nhau.

  | Mục | Số mới, đề | Đáp án; nhiễu |
  |---|---|---|
  | `$.exercises[32]` `chon-chung-12-18-30` | "Ta có 30 = 2 · 3 · 5, 42 = 2 · 3 · 7 và 66 = 2 · 3 · 11. Chọn tất cả thừa số nguyên tố chung của 30, 42 và 66." | 2 và 3; nhiễu 6 (ước chung nhưng không là số nguyên tố), 7 (chỉ có ở 42) |
  | `$.exercises[34]` `uclnn-18-30-42` (lời giải `bang-18-30-42`) | "Ta có 24 = 2³ · 3, 60 = 2² · 3 · 5 và 84 = 2² · 3 · 7. Tìm ƯCLN của 24, 60 và 84." | 12; nhiễu 4 (quên 3), 6 (lấy 2¹), 24 (lấy số mũ lớn nhất) |
  | `$.exercises[33]` `uclnn-9-18-45` | 7, 28 và 49 | 7 |
  | `$.exercises[31]` `uclnn-20-30-50` (lời giải `bang-20-30-50`) | "Ta có 18 = 2 · 3², 54 = 2 · 3³ và 81 = 3⁴. Tìm ƯCLN của 18, 54 và 81." (ƯCLN của hai số đầu là 18; thêm 81 làm mất thừa số 2) | 9 |
  | `$.exercises[30]` `uclnn-8-12-20` | "Ta có 15 = 3 · 5, 45 = 3² · 5 và 50 = 2 · 5². ƯCLN(15, 45, 50) bằng bao nhiêu?" | 5; nhiễu 3 (chỉ chung 15, 45), 15 (ƯCLN của hai số đầu), 25 (lấy 5²) |
  | `$.exercises[26]` `tinh-uclnn-24-36` (lời giải `bang-24-36`) | "Ta có 50 = 2 · 5² và 70 = 2 · 5 · 7. Tính ƯCLN(50, 70)." | 10 |
  | `$.exercises[27]` `uclnn-24-56` | giữ số, thêm vào đề "Ta có 24 = 2³ · 3 và 56 = 2³ · 7." | 8 |
  | `$.exercises[44]` `but-vo-20-30` | "Cô giáo có 16 cây bút chì và 36 quyển vở, chia đều cho các học sinh, không thừa. Nhiều nhất chia được cho bao nhiêu học sinh?" (bỏ "các bạn" vì app gọi trẻ là "bạn") | 4; nhiễu 2, 8 (chỉ là ước của 16), 12 (chỉ là ước của 36) |
  | `$.exercises[41]` `dia-12-20` | "Có 10 quả cam và 35 quả mận chia đều vào các đĩa như nhau, không thừa. Nhiều nhất được bao nhiêu đĩa?" | 5; nhiễu 1 (ước chung nhưng không nhiều nhất), 2 (chỉ là ước của 10), 7 (chỉ là ước của 35) |

### 10. Câu kiểm tra `chia-nhom-16-28` là bài toán lời văn khi section 8 chưa dạy cách đọc đề; nấc 1 tô câu hỏi (LL-09, LL-16)

- Vị trí: `$.exercises[38]` (`chia-nhom-16-28`, `checkIds` của `section.uc-tu-uclnn`), `$.exercises[38].hints.highlight[0]`
- Nguồn: tr.38 ý 4, tr.39 câu 2.35 (chỉ có bài tìm ƯC từ ƯCLN bằng số)
- Vấn đề: section 8 chỉ dạy bằng số, câu kiểm tra lại bắt trẻ tự hiểu "chia đều bút và tẩy, không thừa" nghĩa là số học sinh là ước chung, cách đọc đề này chỉ dạy ở section 9, 10. Câu cũng không cho ƯCLN như `uc-uclnn-16-40`, nên trẻ phải phân tích 16, 28, tìm ƯCLN rồi liệt kê ước. Nấc 1 (`index: 1`) tô câu hỏi, không tô hai số 16, 28 ở `block 0`.
- Sửa: thêm vào câu đầu "Biết ƯCLN(16, 28) = 4." và một câu nối "Số học sinh phải là ước chung của 16 và 28."; đổi nấc 1 sang `index: 0`. Hoặc thay câu kiểm tra bằng câu chỉ dùng số và chuyển `chia-nhom-16-28` sang kho ôn card `bai-toan-uc`.

### 11. Bảng thừa số dùng "—" cho ô trống, đọc như dấu trừ (LL-21)

- Vị trí: mọi hình `expTable` (`exp-table.tsx`): `bang-36-60`, `bang-36-60-xong` (màn quy tắc, recap section 6), `bang-20-30`, `bang-18-24-30`, `bang-18-24-30-xong`, các hình gợi ý, lời giải `bang-*`
- Nguồn: —
- Vấn đề: hàng "20 = 2² — 5", "36 = 2² 3² —" (ảnh `phone/074-s6-04-block.png`, `080-s6-07-recap.png`, `092-s7-07-recap.png`) không có dấu "·" nên không còn là tích; gạch giữa hai thừa số dễ đọc thành "trừ". Ô thừa số có khung nên ít nhầm, để Nên sửa. Đây là kiểu đã ghi ở LL-21, không cần mục mới.
- Sửa: để ô trống thật (hay chấm mờ nhỏ không giống dấu phép tính) thay cho "—"; thêm hàng tiêu đề cột "Thừa số 2 | 3 | 5"; đổi nhãn "Mũ nhỏ nhất" thành "Số mũ nhỏ nhất" cho khớp glossary.

### 12. Truyện mua bút, mua kẹo không nói mỗi bạn mua trọn hộp, trọn túi (LL-10)

- Vị trí: `$.sections[9].blocks[0].children[0].text`, `$.exercises[46].prompt[0]` (`hop-but-21-28`), `$.exercises[50].prompt[0]` (`tui-ke-32-48`)
- Nguồn: tr.40 câu 2.37
- Vấn đề: "An mua 22 bút, Bình mua 33 bút, theo hộp có số bút như nhau" khó đọc và không nói mỗi bạn mua một số hộp nguyên, mà chính điều đó làm số bút một hộp thành ước chung.
- Sửa: "Bút bán theo hộp, hộp nào cũng có số bút như nhau, từ 2 bút trở lên. An mua mấy hộp được 22 bút, Bình mua mấy hộp được 33 bút. Vậy số bút trong một hộp là ước chung của 22 và 33." Hai đề kia viết theo cùng khuôn (kẹo theo túi, từ 10 cái trở lên).

### 13. Màn `hh-28` lặp lời giải 2.38, câu tháng Hai không liên quan (LL-08)

- Vị trí: `$.sections[10].blocks[3]` (hình `hh-28` và caption, `section.so-hoan-hao`)
- Nguồn: tr.107 lời giải 2.38
- Vấn đề: màn 28 là đúng lời giải 2.38 (cùng dãy ước, cùng kết luận). Để Nên sửa vì số hoàn hảo nhỏ chỉ có 6 và 28, câu chữ đã viết lại. "Tháng Hai của năm thường có 28 ngày" (do Nên sửa 12 vòng 1 gợi ý) không nói gì về số hoàn hảo.
- Sửa: bỏ màn `hh-28` (ví dụ 6 và phản ví dụ 14 đã đủ, section còn 3 màn). Nếu giữ thì bỏ câu tháng Hai.

### 14. Section phân số tối giản không có phản ví dụ trước câu luyện (LL-16)

- Vị trí: `$.sections[11].blocks` (`section.phan-so-toi-gian`), câu luyện `$.exercises[61]` (`chon-nhieu-toi-gian`)
- Nguồn: tr.40 câu 2.40
- Vấn đề: màn học chỉ có ví dụ đạt (5/7); câu luyện bắt loại 9/12, 10/15, kiểu xét trẻ chưa thấy làm mẫu.
- Sửa: thêm vào hình `tg-5-7` (hay note quy tắc) dòng "ƯC(2, 8) = {1; 2}, nên 2/8 chưa tối giản", dùng lại 2/8 của màn đầu; dòng này nối sang section sau, nơi phân số được rút gọn.

### 15. "Phân số tối giản" chưa có trong glossary (LL-09)

- Vị trí: `$.sections[11].blocks[1].children[0]`; `content/glossary/math.json`
- Nguồn: tr.38 (kĩ năng "nhận biết phân số tối giản"), tr.40 câu 2.40 chỉ dùng từ, không định nghĩa
- Vấn đề: định nghĩa đúng và gọn, nhưng glossary đã có "phân số", "tử", "mẫu", "rút gọn phân số" với `prerequisite` mà thiếu chính thuật ngữ của section.
- Sửa: thêm `{"term": "phân số tối giản", "prerequisite": "tiểu học"}`; có thể thêm "số hoàn hảo" (tr.40 có định nghĩa, không cần `prerequisite`).

## Góp ý

### 1. `dem-doan-15-20` không luyện ước chung

- Vị trí: `$.exercises[4]` (`ex.dem-doan-15-20`, card `uoc-chung`)
- Nguồn: —
- Vấn đề: chỉ cần 20 : 5, dải 15 dm không dùng tới.
- Sửa: hỏi "Đoạn 5 dm có cắt vừa hết cả hai dải không? Vậy 5 có là ước chung của 15 và 20 không?"

### 2. "bé" và "nhỏ" dùng lẫn cho cùng một ý (LL-05)

- Vị trí: section 4 ("số bé nhất", tiêu đề), `ex.cap-uclnn-bang-so-be` ("số bé hơn"), ngân hàng `dien-so-phan-nhieu-nhat`, `dien-rut-gon` ("số bé hơn"), `dien-tim-uclnn` ("số bé nhất"); section 5, 6 ("nhỏ nhất")
- Nguồn: —
- Vấn đề: Góp ý 15 vòng 1 chưa sửa.
- Sửa: dùng "nhỏ" cho cả bài (xem Nên sửa 8).

### 3. `sourceRef` section 2 và 4 nên ghi cả trang lời giải

- Vị trí: `$.sections[1].sourceRef`, `$.sections[3].sourceRef` và card tương ứng
- Nguồn: tr.107, lời giải 2.33, 2.34
- Vấn đề: cách liệt kê và quy tắc "số lớn chia hết cho số nhỏ" chỉ suy ra được từ lời giải.
- Sửa: thêm "tr.107 (lời giải 2.33)", "tr.107 (lời giải 2.34)".

### 4. Lời kết màn chạm section 4 chưa nối về ƯCLN

- Vị trí: hình `chon-cap-chia-het`, trường `done`
- Nguồn: —
- Vấn đề: chỉ nói về chia hết.
- Sửa: thêm "Với mỗi cặp này, ƯCLN chính là số nhỏ."

### 5. Nhiễu `chon-chung-28-42` loại được ngay (LL-14)

- Vị trí: `$.exercises[25].options[2]` (lựa chọn 5)
- Nguồn: —
- Vấn đề: 5 không có ở số nào.
- Sửa: thay bằng 4 (nhầm 2² là thừa số nguyên tố).

### 6. `dem-uc-24-40` dùng cặp con của ví dụ 2 sách, cùng ƯCLN 8 với `uc-uclnn-16-40` (LL-07)

- Vị trí: `$.exercises[37]` (`dem-uc-24-40`)
- Nguồn: tr.39 ví dụ 2
- Vấn đề: trả lời ngay bằng danh sách 1, 2, 4, 8 của câu kiểm tra cùng section.
- Sửa: "Biết ƯCLN(36, 63) = 9. Hai số 36 và 63 có bao nhiêu ước chung?" (đáp án 3; cặp chưa có trong bài, không trùng bảng Nên sửa 9).

### 7. Bước "lấy thừa số chung" nói ba cách trong hai section (LL-05)

- Vị trí: `$.sections[5].blocks[1].children[0]` (rule), `$.sections[5].blocks[3].children[0]` (note cùng làm), `$.sections[6].blocks[2].children[0]` (rule)
- Nguồn: tr.38 ý 3
- Vấn đề: quy tắc section 6 nói "thừa số có ở mọi số", note cùng làm và quy tắc section 7 nói "thừa số (nguyên tố) chung".
- Sửa: rule section 6 "... Lấy các thừa số nguyên tố chung, tức có ở mọi số, mỗi thừa số với số mũ nhỏ nhất, rồi nhân lại: kết quả là ƯCLN." (sửa cả hai recap); note cùng làm chỉ còn "Cùng làm với 20 và 30 theo quy tắc trên."

### 8. Section 9 nêu quy tắc "nhiều nhất" trước khi trẻ thấy vì sao là nhiều nhất (LL-16)

- Vị trí: `$.sections[8].blocks` (`dia-18-30` → rule → `chon-dia-8-12`)
- Nguồn: —
- Vấn đề: `dia-18-30` chỉ cho thấy 6 đĩa; màn chạm tìm mọi số đĩa đứng sau quy tắc.
- Sửa: đặt `chon-dia-8-12` trước quy tắc, hoặc thêm vào `dia-18-30` bước "2, 3, 6 đĩa đều được; 6 là nhiều nhất".

### 9. Caption mở đầu section 6 nêu trước quy tắc của section 9

- Vị trí: `$.sections[5].blocks[0].caption` (`bang-36-60`)
- Nguồn: —
- Vấn đề: "chia đều 36 cái kẹo và 60 cái bánh ... số túi nhiều nhất là ƯCLN(36, 60)" là quy tắc chưa dạy.
- Sửa: dùng dải băng đã học: "Muốn biết dải 36 dm và dải 60 dm cắt vừa hết thành đoạn dài nhất bao nhiêu, ta tìm ƯCLN(36, 60)."

### 10. Phân tích trong đề bị ngắt giữa biểu thức trên điện thoại (LL-12)

- Vị trí: `$.exercises[31].prompt[0]` (ảnh `phone/090-s7-06-exercise-uclnn-20-30-50.png`), các đề có phân tích trong note
- Nguồn: —
- Vấn đề: "50 = 2 ·" cuối dòng, "5²" xuống dòng.
- Sửa: đưa các phân tích vào khối `formula` `\begin{gathered} … \end{gathered}`, note chỉ giữ câu hỏi (áp luôn cho các đề mới ở Nên sửa 9).

### 11. Câu kiểm tra section 12 chỉ hỏi tên tử, mẫu

- Vị trí: `$.exercises[62]` (`tu-mau-4-15`)
- Nguồn: Kiến thức nền (tiểu học)
- Vấn đề: không thử quy tắc của section (tối giản).
- Sửa: đổi thành "Phân số 4/15 có tối giản không?" với nhiễu theo ước chung, hoặc thêm một câu kiểm tra về tối giản.

### 12. Nhiễu 12/16 của `rut-gon-18-24` không ứng với lỗi nào (LL-14)

- Vị trí: `$.exercises[58].options[3]`
- Nguồn: —
- Vấn đề: không ra được từ 18/24 bằng một phép chia cả tử và mẫu cho cùng một số.
- Sửa: thay bằng 2/3 (chia tử cho 9, mẫu cho 8).

### 13. Màn đầu section 12 chưa nối 2/8 với phần bánh Mai ăn

- Vị trí: `$.sections[11].blocks[0].children[0].text`
- Nguồn: —
- Vấn đề: "Ở phân số dưới đây, 2 là tử và 8 là mẫu" không nói phân số đó là gì.
- Sửa: "Mai đã ăn 2/8 chiếc bánh: 2 là tử, 8 là mẫu."

### 14. Ba câu số hoàn hảo đều có đáp án "không là" (LL-14)

- Vị trí: `$.exercises[51]`, `$.exercises[53]`, `$.exercises[54]`
- Nguồn: —
- Vấn đề: trẻ có thể học mẹo loại lựa chọn "là số hoàn hảo"; ba nhiễu "không là" còn lại vẫn buộc phải cộng.
- Sửa: tuỳ tác giả; có thể thêm câu kho ôn đáp án "là" (cho sẵn các ước của 28 nếu bỏ màn `hh-28`).

### 15. `so-lon-nhat-45-60` cùng số 45 và kết quả 15 với hình gợi ý `bai-goi-y-30-45` (LL-07)

- Vị trí: `$.exercises[48]`
- Nguồn: —
- Vấn đề: trẻ đã xem hình gợi ý của câu luyện có thể nhớ "45 thì ra 15".
- Sửa: đổi sang 44 và 66 (đáp án 22; `check` "2·11"; cặp chưa có trong bài, không trùng bảng Nên sửa 9).

### 16. Phân số trong đề và lựa chọn hiện nhỏ trên iPad (LL-12)

- Vị trí: `$.sections[11].blocks[0].children[1]`, `$.exercises[61].options`, `$.exercises[62].prompt[1]` (ảnh `ipad/141`, `143`, `145`)
- Nguồn: —
- Vấn đề: `\frac` nhỏ hơn hẳn chữ note, dù walk không báo dưới 16px.
- Sửa: dùng `\dfrac` cho phân số đứng riêng, hoặc báo người làm app tăng cỡ công thức.

### 17. Lựa chọn 7/12 của `chon-toi-gian` là đáp số câu 2.40a (LL-08)

- Vị trí: `$.exercises[57].options[2]`
- Nguồn: tr.107 lời giải 2.40a
- Vấn đề: lấy đúng số của lời giải sách.
- Sửa: đổi sang 7/10.
