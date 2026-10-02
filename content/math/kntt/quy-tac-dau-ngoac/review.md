# Review: Quy tắc dấu ngoặc (`quy-tac-dau-ngoac`)

- Bài: `content/math/kntt/quy-tac-dau-ngoac/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/quy-tac-dau-ngoac/` - sbt-p53, sbt-p54, sbt-p112
- `content:check`: 0 lỗi của bài
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi vòng 2 hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/quy-tac-dau-ngoac/`
- Kết luận: Chưa đạt: còn 3 lỗi Nghiêm trọng
- Bản đã review: `2aaaf8cd9c51d894134b7e01b47f8ef0303bb41803565fb1ed638896f98d9b90` (`pnpm content:diff` so với bản này)

Ba reviewer đã tự giải cả 64 exercise trước khi đọc `answer`: mọi `answer`, `check`, `params`, `pairs` đúng; `match` `noi-ngoac-ket-qua` có đúng một cách nối; mặt nạ đích của các hình `flipTry` và `wants` của các hình "Cùng làm" khớp đề. Không còn `explain` hay `wrong` nào gọi lựa chọn theo vị trí (LL-26). Các bản sửa Nghiêm trọng của vòng 1 đều đạt. Ba lỗi Nghiêm trọng của vòng này nằm ở chữ in sẵn của một câu điền, ở câu chuyện mở đầu phần 5 và ở một lý do `wrong`; Tổng hợp đã tự tính lại cả ba. Hai trong ba lỗi sinh từ bản sửa vòng 1 (một do chính câu "Sửa" của review vòng 1). Tệp nhóm: `.shots/review/quy-tac-dau-ngoac/nhom-1.md`, `nhom-2.md`, `nhom-3.md`.

Khi sửa: nhiều mục dưới đây đổi câu quy tắc (`rule: true`) hay nhãn hình recap (Nên sửa 4, 5, 9, 10, 14, 15, 16; Góp ý 19, 21). Đổi câu quy tắc thì đổi cùng lúc recap section và recap card lặp nguyên văn, đếm lại theo `[length]`, và chụp lại màn điện thoại. Các câu đổi số (Nên sửa 1, 11, 12, 17, 20, 22) phải tự giải lại, sửa `check.expr`, `explain`, `wrong`, và soát trùng số với hình mẫu, hình gợi ý, recap (LL-07).

## Bảng thử mẹo

| Mẹo | Số đã thử | Kết quả |
|---|---|---|
| `tip.dau-dau-tien` (trước ngoặc có dấu −, số đầu không ghi dấu viết thêm dấu + rồi đổi dấu từng số hạng) | 16 − (4 + 3) = 9 (ví dụ); 10 − (3 − 5) = 12; 10 − (3) = 7; 50 − (28 + 12) = 10; 6 − (4 − 1) − (2 + 3) = −2; −(3 + 4) + 10 = 3; 10 − (0 − 4) = 14; ngoặc có số âm đầu: 9 − (−4) = 13, 9 − (−4) + (−6) − (+5) = 2, −3 − (−7) = 4; hai ngoặc: (8 − 5) − (6 − 9) = 6, (5 − 9) − (3 − 8) = 1, 80 − (25 − 5) − (30 − 10) = 40; chiều đặt ngoặc: 12 − 5 − (8 − 6) = 5, 20 − (8 + 5) − 3 = 4; ngoặc không có dấu − đứng trước: 10 + (3 − 5), (3 − 5) − 2, 12 + (−5) − 8 + (−4) | Đúng mọi số; mẹo đã nói điều kiện "trước ngoặc có dấu −" nên không bị dùng sai ở dạng khác (bản sửa vòng 1 đạt). Biên 0: kết quả đúng nhưng câu "số đầu tiên … vẫn là số dương" sai với 0 (Nên sửa 4) |
| `tip.gom-duong-am` (bỏ hết ngoặc, cộng riêng dương, cộng riêng phần số của âm, lấy lớn trừ bé) | 7 − 9 + 5 − 3 = 0; 6 − 9 + 4 − 5 = −4; −8 + 4 + 5 = 1; 5; 0 − 5 + 0 = −5; 64 − 37 + 36 − 20 = 43; còn ngoặc: 12 + (−5) − 8 + (−4) = −5, 9 − (−4) + (−6) − (+5) = 2, (5 − 9) − (3 − 8) = 1; biên −3 − 4 = −7 | Đúng mọi số. Nhóm trống không được nói là 0 (Góp ý 13). Đọc từng chữ "nhóm có tổng lớn hơn" với tổng nhóm âm là −14 thì ra +4 thay vì −4 (Nên sửa 13) |
| `tip.kiem-tra-hai-cach` (tính trong ngoặc trước, rồi so với kết quả khi bỏ ngoặc) | 10 − (4 − 9 + 2) = 13 (bắt được cách sai −1); 7 − (3 − 5 + 2) = 7; 0 − (0 − 5) = 5; 9 − (−4) = 13; (9 − 12) − (5 − 8 + 1) = −1; 120 − (150 + 20 − 80) = 30; đặt ngoặc 12 − 5 − 3 so với 12 − (5 + 3); nhiễu của `bo-ngoac-47-30-3`, `bo-ngoac-ba-3-8` | Đúng mọi số. Ngoặc có tổng 0 thì không bắt được cách giữ nguyên dấu, nhưng giá trị cuối vẫn đúng; ví dụ đã đổi sang ngoặc có tổng −3 (bản sửa vòng 1 đạt) |

## Nghiêm trọng

### 1. Câu điền dấu `dien-dau-cong` in sẵn một đẳng thức sai: 35 + (12 − 7) = 35 + 12 − 10

- Vị trí: `$.exercises[7].segments[4].text` (`ex.dien-dau-cong`, card `ngoac-dau-cong`) - LL-20 (LL-17, LL-01)
- Nguồn: —
- Vấn đề: ghép `segments` với `accept` được "35 + (12 − 7) = 35 + 12 − 10": vế trái 40, vế phải 37 (Tổng hợp đã tính lại). Câu "Sửa" của vòng 1 (Nên sửa 4) đề xuất "35 ☐ 12 ☐ 7", bản sửa gõ "10" thay cho "7". Bé điền đúng hai dấu theo quy tắc mà nhận một đẳng thức sai; `explain` nói "số 7 vẫn có dấu −" trong khi màn không còn số 7. `fillBlank` Toán không có `check` nên máy không bắt.
- Sửa: `segments[4].text` thành " 7.". Tính lại: 35 + 12 − 7 = 40 = 35 + 5.

### 2. Chuyện nợ mở đầu phần 5 sai ngoài đời: trả nợ xong rồi thì xoá nợ không làm bạn có lại 50 nghìn

- Vị trí: `$.sections[4].blocks[0].children[0].text` (`section.ngoac-mot-so`, hình `no-xoa-no`) - LL-20 (LL-17, LL-10)
- Nguồn: —
- Vấn đề: "nợ Lan 5 nghìn, nên trả nợ xong bạn còn 50 + (−5) = 45 nghìn. Nếu Lan xoá nợ, ta trừ đi số −5: 45 − (−5) = 50 nghìn đồng." Phép tính đúng, nhưng đã trả 5 nghìn thì không còn khoản nợ nào để xoá, và Lan xoá nợ cũng không trả lại 5 nghìn. Câu này là đúng câu "Sửa" của review vòng 1 (Góp ý 23), đặt ở màn mở đầu dạy ý "trừ đi số âm là thêm vào"; bé nghĩ theo chuyện sẽ thấy vô lý hoặc gắn quy tắc với một việc không xảy ra (ảnh `phone/059-s5-01-block.png`).
- Sửa: không cho trả nợ trước khi xoá nợ, vd "Bạn có 50 nghìn đồng nhưng nợ Lan 5 nghìn. Tính cả khoản nợ thì bạn chỉ có 50 + (−5) = 45 nghìn. Nếu Lan xoá nợ, khoản −5 bị trừ đi: 45 − (−5) = 50 nghìn đồng." Nhãn hình `no-xoa-no` giữ. Câu mới phải qua `[length]` và lượt Đọc hiểu; viết các phép tính trong câu không để xuống dòng giữa "50" và "+ (−5)" (Nên sửa 6).

### 3. Lý do sai của tổng có −4 ở `chon-tong-bang-0` dạy một điều sai: "không có số đối thì tổng khác 0"

- Vị trí: `$.exercises[61].explain.wrong[0].text` (`ex.chon-tong-bang-0`, lựa chọn c) - LL-17
- Nguồn: —
- Vấn đề: "Số −4 không có số đối 4 trong tổng này, nên tổng khác 0." Chữ "nên" biến một quan sát thành quy tắc: có một số không ghép được thì tổng khác 0. Điều này sai, và chính bài có phản ví dụ: hình quy tắc phần 10 (`REASONABLE_ROWS`) 38 − 25 + 2 − 15 = 0 và câu kiểm tra `bo-ngoac-47-30-3` 47 − 30 + 3 − 20 = 0 không có cặp số đối nào mà vẫn bằng 0; (−4) + 1 + 3 = 0 cũng vậy. Tổng của c, (−4) + (−1) + 1 + 3, bằng −1 (Tổng hợp đã tính lại) vì −4 và 3 còn lại cộng được −1, không phải vì −4 thiếu số đối.
- Sửa: "Ghép −1 với 1 xong, còn lại −4 và 3. Cộng lại được −1, nên tổng khác 0." Viết lý do của d cùng khuôn để hai lý do không dạy hai cách nghĩ: "Ghép −3 với 3, −1 với 1 xong, còn lại 2, nên tổng bằng 2." (Tổng hợp bổ sung; d hiện đúng nhưng cùng kiểu "không có số đối, nên…").

## Nên sửa

### 1. Hai câu kho ôn gắn card phần 3 nhưng cần cách đổi dấu số âm của phần 4 và ngoặc một số của phần 5

- Vị trí: `$.exercises[50]` (`ex.xep-gia-tri-bo-ngoac`, mục `s2` 4 − (9 − 3), mục `s4` 6 − (−1)), `$.exercises[51].options[2]` (`ex.chon-bang-0`, 8 − (12 − 4)); cả hai `cardIds: ["…card.ngoac-dau-tru"]` - LL-09, LL-20
- Nguồn: —
- Vấn đề: phần 3 chỉ dạy ngoặc toàn số dương; số âm trong ngoặc đổi thành dương là ý của phần 4, "6 − (−1)" là quy tắc ngoặc một số của phần 5. Card `ngoac-dau-tru` có thể đến hạn ôn trước khi bé học hai phần đó.
- Sửa: gắn cả hai câu sang card `ngoac-tru-so-am`, và đổi mục `s4` của câu 50 sang một ngoặc nhiều số vẫn bằng 7, vd `3 - (5 - 9)` (3 − 5 + 9 = 7), để thứ tự −3, −2, 2, 7 giữ nguyên. Tính lại `explain` của câu 50.

### 2. Hai câu "Chọn tất cả các cách viết đúng" có đáp án là kết quả tính trong ngoặc, không phải cách bỏ ngoặc

- Vị trí: `$.exercises[8].prompt[0].text` (`ex.chon-cach-viet-7-cong`, đáp án b `7 + (-2)`), `$.exercises[19].prompt[0].text` (`ex.chon-cach-viet-12-tru`, đáp án b `12 + 1`) - LL-10, LL-20
- Nguồn: —
- Vấn đề: vòng 1 (Nên sửa 20) đã sửa lỗi này ở `chon-nhom-tru-30` nhưng hai câu cùng dạng của phần 2 và phần 4 vẫn "cách viết đúng". Ngay sau màn dạy bỏ ngoặc, bé hiểu "cách viết" là cách bỏ ngoặc nên bỏ qua b và bị chấm thiếu.
- Sửa: cùng khuôn với `chon-nhom-tru-30`: "Chọn tất cả các biểu thức có giá trị bằng tổng sau." (câu 8 đưa `7 + (3 - 5)` ra khối `formula` như câu 19). Từ "biểu thức" ở đây theo cách chốt của Nên sửa 3.

### 3. Một khái niệm nhiều tên trong đề và lời giải: "phép tính", "tổng", "biểu thức"; "kết quả", "giá trị"; "giữ dấu" và "mang theo dấu"

- Vị trí: `$.exercises[23].prompt[0].text`, `$.exercises[23].explain.text` (`noi-ngoac-ket-qua`: "Nối mỗi phép tính với kết quả của nó", "Bỏ ngoặc từng phép tính"), `$.exercises[24].prompt[0].text` (`chon-bang-6`: "các phép tính có kết quả bằng 6"), so với `$.exercises[29].prompt[0].text` (`chon-bang-2`: "các tổng có giá trị bằng 2"); `$.exercises[44].explain.wrong` (`chon-nhom-tru-30`: đề "biểu thức", b "Biểu thức này", d "tổng này"), `$.exercises[60].explain.wrong` (`viet-bieu-thuc-80`: đề "Biểu thức nào", lý do "Tổng này"); `$.exercises[33].explain.text` (`chon-bang-5-8-4`: "Đổi chỗ mà mỗi số hạng giữ dấu") so với câu quy tắc phần 7 "mang theo dấu của nó" - LL-05, LL-20
- Nguồn: tr.53, ý 1, ý 3; nhóm 2 Nên sửa 7, nhóm 3 Góp ý 2 (gộp; Tổng hợp chốt cách gọi vì hai nhóm đề xuất hai hướng)
- Vấn đề: vòng 1 (Nên sửa 22) chốt gọi biểu thức là "tổng"; hai câu của card `ngoac-mot-so` còn gọi là "phép tính", và cùng một ý được hỏi bằng "kết quả" ở câu này, "giá trị" ở câu kia (hình bài dùng nhãn "giá trị của tổng"). Trong một câu, đề gọi lựa chọn là "biểu thức" mà lý do gọi "tổng". "giữ dấu" là tên của quy tắc ngoặc có dấu +; dùng cho việc đổi chỗ làm hai quy tắc nghe như một. Lý do d của `chon-nhom-tru-30` ("…nên tổng này bằng 50") chỉ tính giá trị, không chỉ ra −12 và −8 đã thành +12 và +8.
- Sửa: chốt: một dãy chỉ có + và − gọi là "tổng", điều hỏi gọi là "giá trị"; riêng đề so các lựa chọn với "tổng sau" thì gọi lựa chọn là "biểu thức" (đã chốt ở `chon-nhom-tru-30`) và mọi lý do của câu đó dùng đúng từ của đề. Cụ thể: "Nối mỗi tổng với giá trị của nó.", "Bỏ ngoặc từng tổng: …", "Chọn tất cả các tổng có giá trị bằng 6."; lý do của `chon-nhom-tru-30` và `viet-bieu-thuc-80` dùng "biểu thức này", d của `chon-nhom-tru-30` "Đưa −12 và −8 vào ngoặc có dấu + thì phải giữ dấu −. Biểu thức này đổi thành +12 và +8 nên bằng 50."; `chon-bang-5-8-4` "Đổi chỗ mà mỗi số hạng mang theo dấu của nó thì tổng không đổi."

### 4. Câu quy tắc phần 1 và mẹo nói số đứng đầu không ghi dấu "là số dương" (sai khi số đó là 0), còn câu quy tắc phần 6 nói cùng ý bằng "bỏ như ngoặc có dấu +"

- Vị trí: `$.sections[0].blocks[1].children[0].text` (rule), `$.sections[0].recap.caption`, `$.cards[0].recap.caption`; `$.sections[2].blocks[2].text` (`tip.dau-dau-tien`: "số đầu tiên trong ngoặc không ghi dấu vẫn là số dương"); so với `$.sections[5].blocks[1].children[0].text` (rule phần 6: "Ngoặc ở đầu tổng không có dấu đứng trước, được bỏ như ngoặc có dấu +") - LL-17, LL-05
- Nguồn: tr.53, `sbt-p53.png`, ý 1 (sách không nói về dấu của số đứng đầu); nhóm 1 Nên sửa 3, Tổng hợp bổ sung phần so với câu quy tắc phần 6
- Vấn đề: với 0 − 5 + 3 hay (0 − 4), câu quy tắc bảo 0 là số dương, trái điều bé vừa học (0 không là số nguyên dương, cũng không là số nguyên âm). Bài chưa có tổng nào mở đầu bằng 0 nên không câu nào chấm sai, nhưng đây là câu quy tắc lặp ở recap và card. Thêm nữa, "thứ đứng đầu không ghi dấu" được nói ba cách ở ba chỗ: "là số dương" (phần 1), "vẫn là số dương… viết thêm dấu +" (mẹo phần 3), "được bỏ như ngoặc có dấu +" (phần 6); Nên sửa 5 còn thêm cách thứ tư. Bé không thấy đó là một ý.
- Sửa: nói theo dấu, cùng lời với phần 6: câu quy tắc phần 1 "… gọi tắt là tổng. Số hạng đầu không ghi dấu thì coi như có dấu +, các số hạng khác mang dấu đứng trước nó." (recap section, recap card lặp nguyên văn); mẹo "Khi trước ngoặc có dấu −, số hạng đầu trong ngoặc không ghi dấu thì coi như có dấu +. Hãy viết dấu + đó ra rồi đổi dấu từng số hạng." Đếm lại theo `[length]`; `explain` của `chon-duong-7-10` dùng cùng cụm.

### 5. Ngoặc ở đầu tổng bị gọi là "có dấu + đứng trước" ở phần 8, phần 11 và một câu ôn

- Vị trí: `$.sections[7].blocks[2].children[0].text` ("Mỗi nhóm có dấu + đứng trước nên các số hạng giữ dấu cũ.", với (7 − 4) + (9 − 5)); chữ `done` của `catalog.ts` khoá `chon-nhom-7-4` ("Ngoặc có dấu +, nên…"); `$.exercises[38].explain.text` (`nhom-thu-chi-40`: "Nhóm thành hai ngoặc có dấu +: (40 − 15) + (25 − 20)"); `$.exercises[52].explain.text` (`bo-ngoac-ba-3-8`: "Ngoặc (−3) ở đầu tổng và ngoặc (7 − 2) có dấu + giữ dấu cũ.") - LL-05
- Nguồn: tr.53, ý 3; nhóm 2 Nên sửa 2, nhóm 3 Góp ý 3 (gộp, giữ mức Nên sửa)
- Vấn đề: (7 − 4), (40 − 15), (−3) đứng ở đầu tổng, không có dấu nào đứng trước. Câu quy tắc phần 6 đặt tên riêng cho trường hợp này ("không có dấu đứng trước, được bỏ như ngoặc có dấu +"); các chỗ trên gọi nó là "có dấu + đứng trước", tức một khái niệm hai cách nói, và nói sai điều bé thấy trên màn.
- Sửa: note "Cùng làm" phần 8 và `done` của `chon-nhom-7-4` "Nhóm ở đầu tổng và nhóm có dấu + đứng trước đều giữ dấu cũ."; `nhom-thu-chi-40` "Nhóm thành (40 − 15) + (25 − 20): ngoặc ở đầu tổng và ngoặc có dấu + đều giữ dấu cũ."; `bo-ngoac-ba-3-8` "Ngoặc (−3) ở đầu tổng được bỏ như ngoặc có dấu +, ngoặc (7 − 2) có dấu + nên giữ dấu cũ."

### 6. Phép tính trong chữ và trong hình xuống dòng giữa ngoặc hay giữa số và dấu trên điện thoại

- Vị trí: `$.sections[1].blocks[0].children[0].text` ("(30 −" / "10) nghìn", ảnh `phone/021-s2-01-block.png`), `$.sections[2].blocks[0].children[0].text` ("(30 +" / "20).", ảnh `phone/036-s3-01-block.png`), `$.sections[4].blocks[0].children[0].text` ("50" / "+ (−5) = 45", ảnh `phone/059-s5-01-block.png`), `$.exercises[26].explain.text` ("5 −" / "9 − 3 + 8", ảnh `phone/078-s6-05-exercise-tinh-hai-ngoac-correct.png`); `done` của `doi-dau-10-3-4` ("10 −" / "3 − 4.", ảnh `phone/041-s3-04-block-shown.png`) và `doi-dau-20-7-3-2` ("20 − 7" / "+ 3 − 2.", ảnh `phone/052-s4-03-block-shown.png`); `catalog.ts` khoá `nhom-tru-vi-du` dòng 3 `5 - 8 + 3 - 1 = 5 - (8 - 3 + 1)` (màn quy tắc và recap phần 9, ảnh `phone/105-s9-02-block.png`, `112-s9-06-recap.png`); `$.exercises[53].prompt[1].tex` (ảnh `phone/137-s11-06-exercise-tinh-tong-hop-9-14.png`: "(3 − 7 +" / "2)"); `$.exercises[43].explain.tex` (`nhom-tru-90-35-15`, câu kho ôn walk không chụp, dòng khoảng 26 ký tự) - LL-12
- Nguồn: nhóm 1 Nên sửa 4 và Góp ý 6, nhóm 2 Góp ý 8, nhóm 3 Nên sửa 9 và Góp ý 10 (gộp, giữ mức Nên sửa)
- Vấn đề: chữ không bị cắt, nhưng dấu và số trong ngoặc bị tách sang hai dòng, ngay trên màn quy tắc, recap và hình dạy đọc dấu trong ngoặc. Vòng 1 (Nên sửa 10) đã nêu cùng kiểu, đề `[53]` chưa sửa.
- Sửa: phép tính trong note và chữ `done` dùng khoảng trắng không ngắt (U+00A0) giữa số và dấu, hoặc bỏ phép tính khỏi note vì hình ngay dưới đã viết nó (vd "… nên số tiền thêm vào là 30 nghìn bớt 10 nghìn."); dòng 3 `nhom-tru-vi-du` dùng helper `steps` ("5 - 8 + 3 - 1", "= 5 - (8 - 3 + 1)"); đề `[53]` và `explain.tex` của `[43]` viết `\begin{gathered} … \\ … \end{gathered}` (`[43]`: `90 - (35 + 15) \\ = 90 - 50 = 40`). Chụp lại màn điện thoại.

### 7. Câu điền quy tắc `dien-quy-tac-tru`: hai nhiễu điền vào thì câu sai ngữ pháp, loại được không cần hiểu quy tắc

- Vị trí: `$.exercises[13].bank` (`ex.dien-quy-tac-tru`) - LL-14
- Nguồn: —
- Vấn đề: câu "bỏ ngoặc đi và ☐ từng số hạng trong ngoặc, không sót số nào": điền "giữ dấu cũ" hay "chỉ đổi dấu số đầu" đọc không thành câu, nên bé chọn "đổi dấu" chỉ nhờ ghép chữ.
- Sửa: để trống cả cụm động từ lẫn đối tượng để mọi nhiễu thành câu trọn, vd ô trống thay "đổi dấu từng số hạng", ngân hàng "đổi dấu từng số hạng", "giữ dấu cũ của từng số hạng", "chỉ đổi dấu số hạng đầu"; bỏ đuôi "không sót số nào" khỏi câu điền, hoặc giữ đúng câu quy tắc nếu `[rule-sentence]` yêu cầu.

### 8. Định nghĩa tổng và quy tắc giữ dấu, đổi dấu có thêm cách nói thứ hai ở chữ bé đọc

- Vị trí: nhãn hình `tong-dai-so-vi-du` dòng 1 "một tổng, chỉ có phép cộng và trừ" (`catalog.ts`, màn quy tắc và recap phần 1, ảnh `phone/019-s1-06-recap.png`) và `$.exercises[3].explain.text` ("Một tổng chỉ có phép cộng và phép trừ"), so với câu quy tắc "chỉ dùng dấu + và dấu −"; `$.sections[1].blocks[2].children[0].text` ("các dấu trong ngoặc không đổi") và `done` của `chon-bo-ngoac-8` ("các dấu vẫn như cũ"), so với "giữ dấu cũ"; `$.exercises[13].explain.text` ("mọi số hạng trong ngoặc đổi dấu"), so với "đổi dấu từng số hạng" - LL-05
- Nguồn: —
- Vấn đề: vòng 1 (Nghiêm trọng 1) chốt một cách nói cho mỗi quy tắc; các chỗ trên vẫn nói bằng lời khác ngay trên hay ngay sau câu quy tắc. Recap phần 1 hiện cùng lúc hai định nghĩa tổng.
- Sửa: nhãn `tong-dai-so-vi-du` "một tổng, chỉ dùng dấu + và dấu −"; `explain` câu 3 "Một tổng chỉ dùng dấu + và dấu −."; note "Cùng làm" phần 2 "… trước ngoặc là dấu + thì các số hạng trong ngoặc giữ dấu cũ."; `done` của `chon-bo-ngoac-8` "Ngoặc có dấu +, nên các số hạng giữ dấu cũ."; `explain` câu 13 "… Vì vậy ta đổi dấu từng số hạng trong ngoặc."

### 9. Hình quy tắc và recap phần 5 vẫn dạy cách nói "hai dấu": "+ và − thành −", "− và − thành +"

- Vị trí: `catalog.ts` khoá `ngoac-mot-so-vi-du` (bốn nhãn), hình của `$.sections[4].blocks[1].children[1]`, `$.sections[4].recap` và `$.cards[4].recap`; `$.sections[4].blocks[2].children[0].text` ("không nhầm khi gặp hai dấu liền nhau") - LL-05, LL-20
- Nguồn: tr.53, ý 2 (`sbt-p53.png`): chỉ có giữ dấu và đổi dấu
- Vấn đề: vòng 1 (Nghiêm trọng 3) cho giữ bốn nhãn "chỉ làm nhãn ví dụ, không đưa lên recap", nhưng recap section và recap card dùng chính hình này, nên trên màn "Nhớ nhé!" (`phone/067-s5-06-recap.png`) và ở màn ôn card bé thấy câu quy tắc "giữ dấu cũ / đổi dấu" cùng bốn nhãn chữ to "+ và − thành −", "− và − thành +", không kèm điều kiện "ngoặc chỉ có một số". Bé nhớ "− và − thành +" dễ đem dùng cho 5 − (−3 + 2) thành 5 + 3 + 2.
- Sửa: bốn nhãn theo lời câu quy tắc, vd "dấu + trước ngoặc: +3 giữ dấu cũ", "dấu + trước ngoặc: −3 giữ dấu cũ", "dấu − trước ngoặc: +3 đổi thành −3", "dấu − trước ngoặc: −3 đổi thành +3" (hoặc gọn "giữ dấu cũ", "đổi dấu"); câu lý do màn "Cùng làm" "Làm vậy bạn không quên đổi dấu số trong ngoặc khi trước ngoặc là dấu −."

### 10. Nhãn hình của phần 6 nói quy tắc nhiều ngoặc theo vị trí hay như mọi ngoặc đều đổi dấu: "ngoặc sau đổi dấu", "mỗi ngoặc đổi dấu riêng"

- Vị trí: `catalog.ts` khoá `goi-y-nhieu-ngoac`, nhãn dòng 2 "ngoặc sau đổi dấu" (nấc 2 của `$.exercises[26]`, `ex.tinh-hai-ngoac`); khoá `hai-tui-giam-gia`, nhãn dòng 2 "mỗi ngoặc đổi dấu riêng" (hình mở đầu `$.sections[5].blocks[0]`) - LL-05
- Nguồn: nhóm 2 Nên sửa 3; Tổng hợp bổ sung nhãn `hai-tui-giam-gia`
- Vấn đề: câu quy tắc phần 6 là "Mỗi ngoặc xét riêng theo dấu đứng ngay trước nó". Vòng 1 (Nên sửa 8) đã bỏ "ngoặc đầu / ngoặc sau" ở `explain` và `LEADING_ROWS` vì bé dễ nhớ "ngoặc thứ hai đổi dấu"; hình gợi ý còn sót "ngoặc sau đổi dấu". Nhãn "mỗi ngoặc đổi dấu riêng" ở màn mở đầu cùng phần đúng với hai ngoặc có dấu − của ví dụ, nhưng đọc thành "ngoặc nào cũng đổi dấu", trái câu quy tắc ngay sau và trái `LEADING_ROWS` ("ngoặc ở đầu tổng giữ dấu cũ").
- Sửa: `goi-y-nhieu-ngoac` "ngoặc có dấu − đổi dấu" (hoặc như `LEADING_ROWS`); `hai-tui-giam-gia` "hai ngoặc có dấu − đứng trước: đổi dấu từng số hạng".

### 11. Câu ôn `hai-tui-80` cần 4 phép tính và lặp túi B của câu chuyện mở đầu

- Vị trí: `$.exercises[28]` (`ex.hai-tui-80`, card `nhieu-ngoac`), `explain.tex` - LL-18, LL-07, LL-20
- Nguồn: tr.54, bài 3.21
- Vấn đề: bản sửa theo Nên sửa 9 vòng 1 thành 80 − 25 + 5 − 30 + 10: 4 phép tính, quá luật 2 phép tính nhẩm của câu ôn; `explain.tex` nhảy từ dòng bỏ ngoặc tới "= 40". Túi B "giá 30 nghìn được giảm 10 nghìn" trùng túi B của note và hình mở đầu `hai-tui-giam-gia`.
- Sửa: vd "Mai có 60 nghìn đồng, mua túi A giá 25 nghìn được giảm 5 nghìn và túi B giá 15 nghìn được giảm 5 nghìn": 60 − (25 − 5) − (15 − 5) = 60 − 25 + 5 − 15 + 5 = 70 − 40 = 30 (Tổng hợp đã tính lại); `explain` ghi thêm dòng gom "= 70 − 40". Tính lại `check.expr` và đáp án.

### 12. Câu luyện và câu ôn cần hơn 2 phép tính nhẩm mà bớt được số hạng

- Vị trí: `$.exercises[21]` (`tinh-ngoac-cong-am`, câu luyện, 12 − 5 − 8 − 4), `$.exercises[22]` (`tinh-ngoac-chuoi`, 9 + 4 − 6 − 5), `$.exercises[34]` (`gom-6-9-4-5`); `$.exercises[53]` (`tinh-tong-hop-9-14`, câu luyện, 6 số hạng, 5 phép tính), `$.exercises[55]` (`tong-hop-nam-30`, 4 phép tính), `$.exercises[59]` (`thu-chi-lan-40`, 4 phép tính), `$.exercises[49]` (`hop-li-120-150`, 3 phép tính), `$.exercises[56]` (`chon-bang-am-5`, mỗi lựa chọn 3 phép tính) - LL-18
- Nguồn: tr.54, bài 3.20 đến 3.23; nhóm 2 Nên sửa 5, nhóm 3 Nên sửa 5 (gộp)
- Vấn đề: luật "Số nhỏ" (`pitfalls.md`) giới hạn câu luyện và câu ôn ở 2 phép tính nhẩm. Vòng 1 (Nên sửa 11) đã nêu `[53]`, `[55]`, `[59]`, `[49]`; bản sửa chỉ đổi `[46]` và `[34]` một phần. `tinh-ngoac-cong-am` là câu tự làm đầu tiên của dạng bài; bé chậm dễ sai ở phép giữa dù bỏ ngoặc đúng.
- Sửa (Tổng hợp đã tính lại từng số): `tinh-ngoac-cong-am` 12 + (−5) − (−4) = 12 − 5 + 4 = 11; `tinh-ngoac-chuoi` 9 − (−4) + (−6) = 7; `gom-6-9-4-5` 6 − 9 + 4 = 1; `[53]` (−7) + (9 − 2) − (5 − 7) = −7 + 9 − 2 − 5 + 7 = 2; `[55]` "Nam có 30 nghìn, được thưởng 20 nghìn nhưng làm rơi 6 nghìn, rồi mua kẹo 4 nghìn và trả bạn 20 nghìn": 30 + (20 − 6) − (4 + 20) = 20; `[59]` cùng cách với số khác; `[56]` mỗi lựa chọn một ngoặc, vd 4 − (3 + 6), (2 − 9) + 2. Khi đổi số `tinh-ngoac-chuoi`, xem lại cờ `allowNegative` (Góp ý 11) và hình gợi ý `goi-y-ngoac-mot-so`, `goi-y-tong-hop` (Nên sửa 21). Câu mà dạng bài buộc 4 số hạng: Góp ý 7.

### 13. Mẹo và lời giải dùng "phần số", trong khi glossary và các bài trước gọi "phần số tự nhiên"; "nhóm có tổng lớn hơn" đọc được hai cách

- Vị trí: `$.sections[6].blocks[2].text` (`tip.gom-duong-am`), `$.exercises[34].explain.text` (`gom-6-9-4-5`), `$.exercises[53].explain.text` (`tinh-tong-hop-9-14`: "phần số của số hạng âm") - LL-05, LL-10
- Nguồn: —
- Vấn đề: glossary Toán có thuật ngữ "phần số tự nhiên", bài `phep-cong-phep-tru-so-nguyen` dùng đúng tên đó 51 lần; bài này viết "phần số", một tên thứ hai. Mẹo bảo "kết quả mang dấu của nhóm có tổng lớn hơn": tổng của nhóm số hạng âm là số âm (−14 với 6 − 9 + 4 − 5), nên đọc từng chữ thì nhóm dương luôn "lớn hơn" và kết quả luôn dương (ra +4, đúng là −4).
- Sửa: "phần số tự nhiên" ở cả ba chỗ, và nói theo cách bài cộng hai số khác dấu đã dạy: "Cộng riêng các số hạng dương, cộng riêng phần số tự nhiên của các số hạng âm. Lấy số lớn trừ số bé, kết quả mang dấu của nhóm cho số lớn hơn; hai số bằng nhau thì kết quả bằng 0." Soát lại độ dài.

### 14. Câu quy tắc dùng chung cho phần 10 và 11 liệt kê ba cách nhóm, nhưng ví dụ và lời giải của phần 11 nhóm theo cách thứ tư

- Vị trí: `$.sections[10].blocks[1]` (note `rule: true` và hình `vi-du-tong-hop`), `$.sections[10].recap`, `$.cards[10].recap` (hình `vi-du-tong-hop-xong`, `WHOLE_ROWS`), `$.exercises[53].explain` - LL-05, LL-15
- Nguồn: tr.53 (ví dụ của sách nhóm ra số tròn)
- Vấn đề: "Bỏ ngoặc trước, rồi đổi chỗ và nhóm để tính nhẩm: số tròn chục, số đối nhau, các nhóm bằng nhau." đọc như danh sách đủ. Ngay dưới, hình mẫu phần 11 nhóm (8 + 3) − (4 + 5 + 6) = 11 − 15: cách "gom số dương, gom số âm" của mẹo `gom-duong-am`, không thuộc ba cách kia; lời giải `[53]` cũng vậy. Ở phiên ôn card, chữ và hình nói hai điều khác nhau.
- Sửa: chọn một. (a) Đổi số `WHOLE_ROWS` để bước nhóm gặp một cách trong danh sách, vd (−4) + (8 − 5) − (−4 + 6) = −4 + 8 − 5 + 4 − 6 = (−4 + 4) + 8 − 5 − 6 = −3 (Tổng hợp đã tính lại), và `[53]` theo Nên sửa 12. (b) Thêm cách thứ tư vào câu quy tắc (hai note, hai recap section, hai recap card), vd "...: số tròn chục, số đối nhau, các nhóm bằng nhau, hay số dương với số dương." Kiểm câu mới với `[length]` và `[rule-sentence]`.

### 15. Nhãn "bỏ ngoặc: giữ dấu +, đổi dấu −" đọc được thành "giữ các dấu +, đổi các dấu −"

- Vị trí: `catalog.ts` khoá `vi-du-tong-hop`, `vi-du-tong-hop-xong` (`WHOLE_ROWS` dòng 2; màn quy tắc và recap phần 11, ảnh `phone/131-s11-02-block-end.png`, `139-s11-07-recap.png`); so với nhãn `thu-chi-lan` "ngoặc + giữ dấu cũ, ngoặc − đổi dấu" - LL-10, LL-05
- Nguồn: —
- Vấn đề: viết gọn "giữ dấu +, đổi dấu −", bé chậm dễ đọc thành "số mang dấu + giữ nguyên, số mang dấu − đổi dấu", một quy tắc sai (với −(−3 + 6) bé sẽ giữ +6). Nhãn nằm trên hình recap của card. Cùng phần, màn mở đầu nói cùng ý bằng lời khác.
- Sửa: một nhãn cho cả hai hình, nói rõ "ngoặc", vd "ngoặc có dấu + giữ dấu, ngoặc có dấu − đổi dấu" (xem độ rộng trên điện thoại, nhãn `thu-chi-lan` đã xuống dòng).

### 16. Số 0 trong phép ghép số đối được nói theo ba cách: là "số còn lại", không phải "số còn lại", hay "đứng riêng"

- Vị trí: `$.sections[11].blocks[2].children[0].text` và `done` của `visual.chon-khong-doi` ("Đó là số còn lại", "nên 3 là số còn lại"); `$.exercises[62].explain.text` (`tong-lon-hon-am4`: "còn lại 4", trong khi `tex` cộng "+ 0 + 4"); so với `$.exercises[58].explain.text` (`tong-tu-am3-den-5`: "Còn lại 0, 4 và 5"), hình `ghep-so-doi` (`PAIR_ROWS`), hình gợi ý `goi-y-ghep-doi` ("+ 0 + 3 + 4"), `$.exercises[57].explain.text` ("Số 0 đứng riêng nên cộng vào không đổi") - LL-05, LL-10
- Nguồn: tr.112, gợi ý 3.24
- Vấn đề: câu quy tắc nói "Rồi cộng các số còn lại." Màn "Cùng làm" và lời kết coi chỉ số 3 là "số còn lại", câu 62 nói "còn lại 4", còn câu 58, hình mẫu và hình gợi ý đếm 0 vào. Kết quả không sai, nhưng một khái niệm của câu quy tắc có hai nghĩa.
- Sửa: đếm 0 vào số còn lại ở mọi chỗ: note "Cùng làm" "chạm vào số khác 0 còn lại sau khi ghép cặp. Số 0 cũng còn lại, nhưng cộng 0 không làm tổng đổi, nên số bạn chạm quyết định cả tổng."; lời kết "Số 3 không có số đối −3 trong các số này. Còn lại 0 và 3, cộng lại được 3."; câu 62 "còn lại 0 và 4, nên tổng là 4"; câu 57 "Còn lại số 0, nên tổng bằng 0."

### 17. Ví dụ của câu quy tắc ghép số đối không cho thấy vế "cộng các số còn lại"

- Vị trí: `catalog.ts` khoá `ghep-so-doi`, `ghep-so-doi-xong` (`PAIR_ROWS`), dùng ở `$.sections[11].blocks[1]`, `$.sections[11].recap`, `$.cards[11].recap` - LL-06, LL-15
- Nguồn: tr.54 bài 3.24 (đáp số 20, không phải 0)
- Vấn đề: vòng 1 thêm vế "Rồi cộng các số còn lại." vì làm theo vế đầu thì câu nào cũng ra 0; hình đi kèm vẫn là tổng từ −3 đến 3, kết quả 0, nên vế mới không có ví dụ và hình recap card cho bé thấy đúng điều cần tránh. Câu kiểm tra `[57]` (−4 đến 4, đáp số 0) cũng vậy.
- Sửa: đổi `PAIR_ROWS` sang dãy có số thừa (tránh −2 đến 4 của `goi-y-ghep-doi` và −3 đến 5 của câu luyện), vd từ −1 đến 3: [(−1) + 1] + 0 + 2 + 3 = 5 (Tổng hợp đã tính lại), nhãn "ghép cặp số đối" rồi "cộng các số còn lại"; sửa nhãn tiêu đề hình cho khớp.

### 18. Lời giải `tex` của hai câu thu chi làm ngược câu quy tắc của card, và lời chữ không nói nhóm thế nào

- Vị trí: `$.exercises[55].explain` (`tong-hop-nam-30`), `$.exercises[59].explain` (`thu-chi-lan-40`), card `vi-du-tong-hop` - LL-05
- Nguồn: —
- Vấn đề: `text` bỏ ngoặc ("30 + 20 − 5 − 6 − 4") rồi chỉ phán "Tính được 35"; `tex` lại tính trong ngoặc trước: 30 + (20 − 5) − (6 + 4) = 30 + 15 − 10. Một lời giải, hai cách làm, và cách hiện trên công thức là cách câu quy tắc bảo không làm trước.
- Sửa: `text` và `tex` cùng theo câu quy tắc, có bước nhóm, vd "Bỏ ngoặc được 30 + 20 − 5 − 6 − 4. Nhóm 30 + 20 = 50 và 5 + 6 + 4 = 15, nên còn 35." (viết sau khi đổi số theo Nên sửa 12).

### 19. Câu ôn "Biểu thức nào cho số tiền còn lại?" không ôn ý của card `vi-du-tong-hop`

- Vị trí: `$.exercises[60]` (`viet-bieu-thuc-80`, `cardIds` `card.vi-du-tong-hop`)
- Nguồn: —
- Vấn đề: câu chỉ hỏi viết 80 − (30 + 20) cho "trả cả hai khoản", đúng ý card `nhom-ngoac-tru` (cùng dạng `[43]`). Recap của card `vi-du-tong-hop` không giúp gì cho câu này.
- Sửa: chuyển `cardIds` sang `card.nhom-ngoac-tru` (hoặc `card.ngoac-dau-tru`); muốn giữ ở card `vi-du-tong-hop` thì đổi thành câu có cả ngoặc dấu + và ngoặc dấu −, như câu Lan.

### 20. Ví dụ màn quy tắc "Tính hợp lí" và câu kiểm tra của phần vẫn là khuôn bài 3.22b, cùng cách nhóm và đáp số 0 của lời giải sách

- Vị trí: `catalog.ts` khoá `tinh-hop-li-vi-du`, `tinh-hop-li-vi-du-xong` (`REASONABLE_ROWS`, ở `$.sections[9].blocks[0]`, `$.sections[9].recap`, `$.cards[9].recap`); `$.exercises[45]` (`bo-ngoac-47-30-3`); hình gợi ý `goi-y-hop-li` (đáp số −6) - LL-08
- Nguồn: tr.54 bài 3.22a, 3.22b; tr.112 lời giải "a) −6", "b) 0", gợi ý nhóm (92 + 8) − (55 + 45)
- Vấn đề: 38 − (25 − 2) + (−15) = (38 + 2) − (25 + 15) = 0 chép nguyên khuôn 92 − (55 − 8) + (−45), cách nhóm của gợi ý tr.112 và đáp số 0, chỉ thay số; câu kiểm tra cùng khuôn, cùng giá trị 0; hình gợi ý ra −6, đúng đáp số 3.22a. Vòng 1 (Góp ý 19) đã nêu. Không số nào trùng sách nên chưa là chép.
- Sửa (Tổng hợp đã tính lại): `REASONABLE_ROWS` 38 − (25 − 2) + (−5) = (38 + 2) − (25 + 5) = 10; `[45]` 47 − (30 − 3) + (−30) (giá trị −10, đổi lựa chọn và lý do theo); `goi-y-hop-li` 2 − 7 + 8 − 13 = (−5) + (−5) = −10 (khác đáp số −8 của `nhom-cap-13-25`).

### 21. Hình gợi ý của câu luyện phần 11 hứa "rồi nhóm" mà không có bước nhóm

- Vị trí: `catalog.ts` khoá `goi-y-tong-hop` (`$.exercises[53].hints.hintVisualId`) - LL-15
- Nguồn: —
- Vấn đề: tiêu đề "Bỏ ngoặc rồi nhóm các số hạng", nhưng hình đi thẳng từ −2 + 9 − 4 − 1 + 5 − 2 tới "= 5", bỏ qua đúng bước bé chưa biết.
- Sửa: thêm một dòng nhóm có nhãn theo cách đã chốt ở Nên sửa 14, vd "= (9 + 5) − (2 + 4 + 1 + 2)", "= 14 − 9" rồi "= 5", hoặc chọn số có cặp số đối.

### 22. Câu ôn `nhom-tru-14-6-4` dùng lại các ngoặc của màn "Cùng làm"

- Vị trí: `$.exercises[42]` (`nhom-tru-14-6-4`), so với `visual.chon-nhom-15` (`$.sections[8].blocks[2]`) - LL-07
- Nguồn: —
- Vấn đề: màn "Cùng làm" có ba chip 15 − (6 + 4), 15 − (6 − 4), 15 + (6 − 4); câu ôn có 14 − (6 + 4), 14 − (6 − 4), 14 + (6 − 4): cùng ba ngoặc, chỉ đổi số đầu. Bé nhớ chip đúng "(6 + 4)" sẽ chọn theo trí nhớ (đáp án câu ôn lại là (6 − 4)).
- Sửa: vd 14 − 7 + 3 với các lựa chọn 14 − (7 + 3), 14 − (7 − 3), 14 + (7 − 3) (đáp án 14 − (7 − 3) = 10); sửa `explain`, `wrong` (Góp ý 14), `check.expr`.

### 23. Màn "Cùng làm" phần 9 thiếu dòng lý do

- Vị trí: `$.sections[8].blocks[2].children[0].text` (`section.nhom-ngoac-tru`)
- Nguồn: —
- Vấn đề: câu thứ hai "Nhớ rằng ngoặc có dấu − đứng trước làm các số hạng đổi dấu." là lời nhắc cách làm, không nói làm để làm gì (checklist trục 5); các màn "Cùng làm" phần 10, 11, 12 đều có dòng lý do.
- Sửa: "Cùng làm: chạm vào cách đặt ngoặc đúng cho hai số cuối của 15 − 6 − 4. Đặt ngoặc đúng thì bạn gom được hai khoản trừ mà kết quả không đổi."

### 24. `sourceRef` của phần 12 và phần 10 không trỏ trang gợi ý đã dùng

- Vị trí: `$.sections[11].sourceRef`, `$.cards[11].sourceRef` ("Sách bài tập tr.53–54 (bài 3.24)"); `$.sections[9].sourceRef`, `$.cards[9].sourceRef`
- Nguồn: bài 3.24 chỉ có ở tr.54; cách ghép cặp của 3.24 và cách nhóm của 3.22 nằm ở gợi ý tr.112; nhóm 3 Góp ý 9 (Tổng hợp nâng lên Nên sửa vì checklist trục 1 xếp `sourceRef` không trỏ đúng trang là Nên sửa)
- Vấn đề: phần 12 dựa vào gợi ý tr.112 ("các số khác 0 còn lại chia thành từng cặp có tổng bằng 0"), phần 10 dựa vào gợi ý 3.22a, 3.22b tr.112; `sourceRef` chỉ ghi tr.53–54.
- Sửa: phần 12 "Sách bài tập tr.54 (bài 3.24), tr.112 (gợi ý 3.24)"; phần 10 thêm "tr.112 (gợi ý 3.22)".

## Góp ý

### 1. Nhãn đọc màn hình (`aria-label`) của hai hình quy tắc còn cách nói cũ

- Vị trí: `catalog.ts` khoá `cong-ngoac-vi-du` ("Ngoặc có dấu + đứng trước: các dấu giữ dấu cũ"), `tru-ngoac-vi-du` ("Ngoặc có dấu − đứng trước: mọi số hạng đổi dấu") - LL-05
- Nguồn: —
- Vấn đề: không hiện trên màn, nhưng vòng 1 (Nghiêm trọng 1) đã ghi sửa theo câu quy tắc; "các dấu giữ dấu cũ" không thành câu.
- Sửa: "Ngoặc có dấu + đứng trước: mỗi số hạng giữ dấu cũ", "Ngoặc có dấu − đứng trước: đổi dấu từng số hạng".

### 2. Hình mở đầu phần 4 chỉ ghi số âm đổi dấu và ghi "còn" trong khi chữ nói "trả lại"

- Vị trí: `catalog.ts` khoá `giam-gia` (nhãn "−10 đổi thành +10", "còn 80 nghìn"; ảnh `phone/049-s4-01-block-end.png`), so với `$.sections[3].blocks[0].children[0].text` - LL-15, LL-10
- Nguồn: —
- Vấn đề: dòng 100 − 30 + 10 đổi dấu cả 30 lẫn 10, nhưng nhãn chỉ nói −10, ở phần nhắc "số đầu tiên cũng phải đổi dấu". Note nói "cô bán hàng trả lại cho bạn", nhãn nói "còn 80 nghìn".
- Sửa: nhãn bước "+30 thành −30, −10 thành +10"; nhãn kết quả "trả lại 80 nghìn".

### 3. Câu kiểm tra `thu-chi-la-so-nao`: nhiễu −5 không có lý do sai; lý do của 20 nói tới số hạng không có trong tổng

- Vị trí: `$.exercises[0].explain.wrong` (`ex.thu-chi-la-so-nao`)
- Nguồn: —
- Vấn đề: −5 là nhiễu dễ chọn mà không có `wrong`. "Số hạng 20 mang dấu +" nói như tổng 50 − 20 − 5 có số hạng +20.
- Sửa: thêm `wrong` cho −5 "−5 là khoản mua hành, không phải mua cá."; lý do của 20 "Viết 20 là coi khoản này mang dấu +, tức tiền thu vào; mua cá là chi ra nên mang dấu −."

### 4. Đề `dien-so-hang` bảo "chọn từ" mà ngân hàng là số

- Vị trí: `$.exercises[2].prompt[0].text` (`ex.dien-so-hang`)
- Nguồn: —
- Vấn đề: ngân hàng "−4", "4", "+4", đề ghi "Chọn từ điền vào chỗ trống."
- Sửa: "Chọn số điền vào chỗ trống."

### 5. Chip chọn số hạng âm đã tách sẵn dấu, nên chỉ cần chạm chip có dấu −

- Vị trí: `catalog.ts` khoá `chon-so-hang-am` (`+9`, `−4`, `+1`, `−2`), `chon-am-5-7` (`$.exercises[4]`)
- Nguồn: —
- Vấn đề: việc cần học (dấu − đứng trước thuộc về số hạng sau nó) đã được chip làm thay; câu kho ôn không phân biệt bé hiểu hay không.
- Sửa: ở câu kho ôn, chip chỉ ghi phần số (5, 7, 2, 1) và đề giữ tổng có dấu; màn "Cùng làm" có thể giữ chip có dấu làm mẫu.

### 6. Ngoặc (4 + 3) lặp ở hình quy tắc, mẹo và một câu kho ôn của cùng card

- Vị trí: `tru-ngoac-vi-du` dòng 1 `9 - (4 + 3)`, `tip.dau-dau-tien.tex` `16 - (4 + 3)`, `$.exercises[51].options[0]` `7 - (4 + 3)`; câu 50 mục `s3` `7 - (2 + 3)` gần dòng 2 `7 - (2 + 1 + 3)` - LL-07
- Nguồn: —
- Vấn đề: bé gặp lại đúng ngoặc đã thấy giải sẵn, câu ôn ít giá trị kiểm tra.
- Sửa: đổi ngoặc của ví dụ mẹo (vd `16 - (5 + 2)`) và của lựa chọn a câu 51 (vd `9 - (5 + 4)`, vẫn bằng 0).

### 7. Các câu mà dạng bài buộc 4 số hạng vẫn cần 3 phép tính

- Vị trí: `$.exercises[26]` (`tinh-hai-ngoac`), `$.exercises[36]` (`nhom-9-4-7-10`), `$.exercises[38]` (`nhom-thu-chi-40`) - LL-18
- Nguồn: tr.54, bài 3.21; tr.53, ý 3
- Vấn đề: hai ngoặc mỗi ngoặc hai số, hay nhóm hai cặp, luôn có 3 phép tính; luật 2 phép tính không giữ được mà không bỏ ý của card.
- Sửa: tuỳ tác giả: giữ, chọn số để mỗi bước là phép nhẩm một chữ số hoặc tròn chục, `explain` ghi đủ từng bước; ghi quyết định vào backlog để vòng sau không nêu lại.

### 8. Hình mẫu nhảy 4 phép tính trong một dòng

- Vị trí: `catalog.ts` khoá `hai-tui-giam-gia` ("= 100 − 40 + 5 − 30 + 10" rồi "= 45"), `LEADING_ROWS` ("= 9 − 12 − 5 + 8 − 1" rồi "= −1") - LL-16
- Nguồn: —
- Vấn đề: hai hình từng bước của phần 6 gộp cả 4 phép cộng trừ vào một bước; bé chậm không thấy 45 và −1 từ đâu ra.
- Sửa: thêm một dòng gom số, vd "= 115 − 70" và "= 17 − 18" (cách của mẹo `gom-duong-am`).

### 9. Nhiễu "0" của câu nối quá yếu

- Vị trí: `$.exercises[23].right[4]` (`noi-ngoac-ket-qua`, ô `r5`) - LL-14
- Nguồn: —
- Vấn đề: không phép bỏ ngoặc sai nào của bốn tổng ra 0; bốn ô đã tự làm nhiễu cho nhau.
- Sửa: bỏ ô 0, hoặc giữ nếu app cần ô thừa.

### 10. Lý do `wrong` chưa nói hệ quả cụ thể

- Vị trí: `$.exercises[20].explain.wrong[0]` (`bo-ngoac-9-tru-am4`, "9 − 4 xảy ra khi trong ngoặc là +4, không phải −4."), `$.exercises[35].explain.wrong[1]` (`nhom-12-5-8-6`, "Dấu − đứng trước ngoặc làm các số hạng trong ngoặc đổi dấu.")
- Nguồn: —
- Vấn đề: câu thứ nhất khó hiểu ("xảy ra khi"), không nói bé quên bước nào; câu thứ hai không nói lựa chọn đó thành tổng nào.
- Sửa: "Viết 9 − 4 là quên đổi dấu: trước ngoặc có dấu − thì −4 phải thành +4." và "Bỏ ngoặc thì được 12 − 5 − 8 + 6: số +8 và −6 đã đổi dấu."

### 11. Thiếu phím "−" lộ dấu của đáp số

- Vị trí: `$.exercises[22]` (`tinh-ngoac-chuoi`, đáp số 2), `$.exercises[36]` (`nhom-9-4-7-10`, đáp số 2, bước giữa 5 + (−3))
- Nguồn: —
- Vấn đề: hai câu tính qua số âm mà không có `allowNegative`, nên bé biết trước kết quả không âm; câu cùng dạng `tinh-hai-ngoac` đã bật cờ.
- Sửa: thêm `"allowNegative": true` (với `tinh-ngoac-chuoi`, quyết định lại sau khi đổi số theo Nên sửa 12).

### 12. Dòng sai của `doi-cho-vi-du` là một đẳng thức đúng

- Vị trí: `catalog.ts` khoá `doi-cho-vi-du`, dòng `9 - 5 + 12 = 16` (nhãn "bỏ lại dấu − thì sai") - LL-15
- Nguồn: —
- Vấn đề: 9 − 5 + 12 = 16 đúng về tính toán; cái sai là đổi chỗ làm tổng khác 2. Bé có thể hiểu nhãn là phép tính sai.
- Sửa: nhãn "bỏ lại dấu −: ra 16, khác 2".

### 13. Mẹo `gom-duong-am` không nói khi một nhóm không có số nào

- Vị trí: `$.sections[6].blocks[2].text` (`tip.gom-duong-am`) - LL-24
- Nguồn: —
- Vấn đề: với −3 − 4 hay 5 + 2, "Lấy số lớn trừ số bé" không có "số bé"; kết quả vẫn đúng nếu bé tự coi nhóm trống là 0.
- Sửa: thêm "nhóm nào không có số thì coi là 0" nếu còn chỗ (cùng lúc với Nên sửa 13), hoặc bỏ qua vì câu của bài luôn có cả hai dấu.

### 14. Lý do sai của lựa chọn c `nhom-tru-14-6-4` còn kiểu cũ đã sửa ở `nhom-tru-12-5-3`

- Vị trí: `$.exercises[42].explain.wrong[1].text` (`ex.nhom-tru-14-6-4`)
- Nguồn: —
- Vấn đề: "Ngoặc có dấu + giữ dấu cũ, nên không viết được −6 và +4." khó hiểu: 14 + (6 − 4) là 14 + 6 − 4. Câu cùng dạng `[40]` đã sửa ở vòng 1 (Góp ý 12).
- Sửa: "Ngoặc có dấu + giữ dấu cũ, nên 14 + (6 − 4) là 14 + 6 − 4: số −6 đã thành +6, số +4 đã thành −4." (viết lại theo số mới nếu làm Nên sửa 22).

### 15. Note mở đầu phần 12 nói sẵn kết quả mà hình từng bước đang giấu

- Vị trí: `$.sections[11].blocks[0].children[0].text` (hình `thu-chi-tuan`, ảnh `phone/141-s12-01-block.png`)
- Nguồn: —
- Vấn đề: note viết "… nên chỉ còn khoản thu 4 nghìn" ngay trên hình đang để "?" chờ "Bước tiếp" (cùng kiểu vòng 1 Góp ý 1).
- Sửa: note chỉ kể năm khoản và hỏi "Sau năm ngày, tiền của bạn thêm bao nhiêu?".

### 16. Câu chuyện của màn "Cùng làm" phần 10 không có kết

- Vị trí: `$.sections[9].blocks[3]` (note và `visual.chon-ghep-30`, lời kết `done`)
- Nguồn: —
- Vấn đề: chuyện dừng ở việc chạm hai khoản cộng được 30; bé không biết cuối cùng còn bao nhiêu tiền.
- Sửa: lời kết "Hai số hạng +27 và +3 cộng lại được 30. Hai khoản mua là 14 + 6 = 20, nên còn 30 − 20 = 10 nghìn."

### 17. Hình ví dụ Lan nhảy từ tổng năm số hạng tới kết quả

- Vị trí: `catalog.ts` khoá `thu-chi-lan` (`$.sections[10].blocks[0]`)
- Nguồn: —
- Vấn đề: từ 60 + 20 − 5 − 12 − 8 đi thẳng tới 55, trong phần dạy đổi chỗ và nhóm.
- Sửa: thêm dòng "= (60 + 20) − 5 − (12 + 8)" nhãn "nhóm số tròn chục", rồi "= 80 − 5 − 20 = 55".

### 18. Hình chạm đổi dấu vẫn sửa luôn dòng đề

- Vị trí: `visual.doi-dau-tong-hop`, `visual.doi-dau-nam-ngoac` (ảnh `phone/133-s11-03-block-shown.png`: dòng đề thành "−(+3 +2 −8)")
- Nguồn: —
- Vấn đề: như vòng 1 Góp ý 18; dòng đề sau khi chạm là một tổng khác tổng ban đầu. Do cách vẽ của thành phần `flipTry`, không do chữ của bài.
- Sửa: giữ dòng đề như ban đầu, chỉ tô ô đã chạm; báo người làm app nếu không sửa trong đợt này.

### 19. Hai câu quy tắc đặt ngoặc không cùng khuôn

- Vị trí: `$.sections[8].blocks[1].children[0].text` ("Đặt ngoặc có dấu − đứng trước thì đổi dấu từng số hạng đưa vào ngoặc."), so với `$.sections[7].blocks[1].children[0].text` ("Đặt ngoặc có dấu + đứng trước để nhóm thì mỗi số hạng đưa vào ngoặc vẫn giữ dấu cũ.") - LL-05
- Nguồn: —
- Vấn đề: hai quy tắc đối nhau nhưng một câu có "để nhóm", một câu không; một câu "mỗi số hạng", một câu "từng số hạng".
- Sửa: cùng khuôn, vd phần 9 "Đặt ngoặc có dấu − đứng trước để nhóm thì từng số hạng đưa vào ngoặc đều đổi dấu." (đổi cả recap section, recap card).

### 20. Màu số hạng dương, âm mang hai tên: "Số nguyên dương/âm" ở khái niệm bài, "Số hạng dương/âm" ở chú giải hình

- Vị trí: `$.concepts[0]`, `$.concepts[1]` ("Số nguyên dương" lime, "Số nguyên âm" pink), so với `catalog.ts` `LEGEND_SIGNS` ("Số hạng dương" lime, "Số hạng âm" pink) - LL-05
- Nguồn: Tổng hợp
- Vấn đề: cùng một màu được gọi hai tên. Trong bài này cái được tô là số hạng kèm dấu của nó (vd −4 trong 9 − 4), nên tên "số hạng dương/âm" mới đúng ý bài; bé thấy hai tên cho một màu ở chip khái niệm và ở chú giải hình.
- Sửa: đổi tên hai khái niệm thành "Số hạng dương", "Số hạng âm" (giữ màu), hoặc đổi chú giải theo tên khái niệm; một tên cho cả bài.

### 21. Câu quy tắc phần 3 dùng "số hạng" rồi "số" cho cùng một thứ

- Vị trí: `$.sections[2].blocks[1].children[0].text`, `$.sections[2].recap.caption`, `$.cards[2].recap.caption` ("… đổi dấu từng số hạng trong ngoặc, không sót số nào.") - LL-05
- Nguồn: Tổng hợp
- Vấn đề: các câu quy tắc khác của bài đều nói "số hạng"; đuôi "không sót số nào" đổi sang "số" trong cùng một câu. Không sai, nhưng là chỗ bé phải tự hiểu "số" là "số hạng".
- Sửa: "… không sót số hạng nào." (đổi cùng recap; nếu làm Nên sửa 7 thì câu điền theo câu mới).
