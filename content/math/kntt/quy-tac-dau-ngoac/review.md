# Review: Quy tắc dấu ngoặc (`quy-tac-dau-ngoac`)

- Bài: `content/math/kntt/quy-tac-dau-ngoac/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/quy-tac-dau-ngoac/` - sbt-p53, sbt-p54, sbt-p112
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa có trong `ids.lock.json`, đúng với bài chưa duyệt)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi vòng 1-2 hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/quy-tac-dau-ngoac/` (cây tạm, sẽ xoá)
- Kết luận: Chưa đạt: còn 8 lỗi Nghiêm trọng
- Bản đã review: `717b30f76ae08fa43b7b31f3996e013f1d16e8cccc1260e3339c0790e956d9f9` (`pnpm content:diff` so với bản này)

Ba reviewer đã tự giải cả 62 exercise trước khi đọc `answer`: mọi `answer` và `check` đúng; `match` `noi-ngoac-ket-qua` có đúng một cách nối; mặt nạ đích của mọi hình `flipTry` khớp `params` và `explain`. Lỗi đáp án nằm ở một hình "Cùng làm" (Nghiêm trọng 4) và ở chữ giải thích (Nghiêm trọng 6, 7, 8). Tệp nhóm: `.shots/review/quy-tac-dau-ngoac/nhom-1.md`, `nhom-2.md`, `nhom-3.md`.

## Bảng thử mẹo

| Mẹo | Các số đã thử | Kết quả |
|---|---|---|
| `tip.dau-dau-tien` (viết thêm + cho số đầu trong ngoặc rồi đổi dấu từng số hạng) | 10 − (3 − 5) = 12; 10 − (0 − 4) = 14; 10 − (3) = 7; 10 − (−3 + 5) = 8; 6 − (4 − 1) − (2 + 3) = −2 | Đúng khi trước ngoặc là dấu −. Sai ở dạng bài khác của bài: 10 + (3 − 5) ra 12 (đúng 8), (3 − 5) − 2 ra 0 (đúng −4). Nghiêm trọng 2 |
| `tip.gom-duong-am` (cộng riêng dương, riêng âm, lấy lớn trừ bé) | 7 − 9 + 5 − 3 = 0; 6 − 9 + 2 − 1 + 5 = 3; −8 − 5 + 2 = −11; 5 và −4 (một số hạng); 0 − 3 + 3 = 0 | Đúng sau khi đã bỏ ngoặc. Sai khi còn ngoặc: `tinh-ngoac-chuoi` ra 4 (đúng 2), `tinh-hai-ngoac` ra −7 (đúng −1); đọc "nhóm lớn hơn" là nhóm nhiều số thì 10 − 1 − 2 − 3 ra −4 (đúng 4). Nghiêm trọng 5 |
| `tip.kiem-tra-hai-cach` (tính trong ngoặc trước, rồi bỏ ngoặc tính lại) | 10 − (3 − 5 + 2); 0 − (0 − 5); 5 − (−2); 7 + (−3 + 2); 20 − (8 − (3 + 1)); ví dụ tr.53; 15 − (6 + 4) so với 15 − (6 − 4) | Đúng với mọi đầu vào, nhưng không bắt được lỗi khi ngoặc có tổng bằng 0, mà ví dụ duy nhất của mẹo lại là trường hợp đó. Nên sửa 16 |
| Quy tắc đặt ngoặc có dấu − (phần 9) | 9 − 4 − 2; 9 − 4 + 2; 0 − 3 − 0; 5 − 8 + 3 − 1; −4 − 5 − 6; 10 − 3 + 2 + 1; lời giải tr.53, gợi ý 3.22b tr.112 | Đúng mọi đầu vào, suy ra trực tiếp từ nguồn |
| Ghép số đối (phần 12) | từ −3 đến 3 = 0; từ −3 đến 5 = 9; từ −5 đến 2 = −12; chỉ số 0; từ −1 đến 1; bài 3.24 = 20; từ 2 đến 5 = 14 | Đúng khi có bước "cộng các số còn lại"; recap thiếu bước này. Nên sửa 18 |

## Nghiêm trọng

### 1. Ba câu quy tắc đầu gần nguyên văn khung "Kiến thức cần nhớ"

- Vị trí: `$.sections[0].blocks[1].children[0].text` (`section.tong-dai-so`), `$.sections[1].blocks[1].children[0].text` (`section.ngoac-dau-cong`), `$.sections[2].blocks[1].children[0].text` (`section.ngoac-dau-tru`), cùng recap lặp nguyên văn (`$.sections[0..2].recap.caption`, `$.cards[0..2].recap.caption`) và `$.exercises[13].segments` (`ex.dien-quy-tac-tru`); câu quy tắc `$.sections[8].blocks[1].children[0].text` (`section.nhom-ngoac-tru`) giữ cùng cụm - LL-08
- Nguồn: tr.53, `sbt-p53.png`, ý 1 và ý 2
- Vấn đề: "Dãy tính chỉ có phép cộng và phép trừ gọi là một tổng đại số" chỉ đổi "gồm" thành "có" và bỏ "cũng", "(hay …)" so với ý 1. Hai câu bỏ ngoặc giữ nguyên các cụm dài của ý 2: "giữ nguyên dấu của các số hạng trong ngoặc" (9 chữ) và "đổi dấu tất cả các số hạng trong ngoặc" (8 chữ), chỉ chuyển điều kiện lên trước. `tap-hop-cac-so-nguyen` và `phep-cong-phep-tru-so-nguyen` vòng 1 đã tính kiểu chép này là Nghiêm trọng. Ngoài ra cùng một thao tác đang có ba cách nói: "đổi dấu tất cả các số hạng" (quy tắc phần 3, 9), "đổi dấu mọi số hạng" (note "Cùng làm" phần 3), "đổi dấu từng số hạng" (`overview.goals[1]`, `tip.dau-dau-tien`) (LL-05).
- Sửa: viết lại theo cách làm, giữ đủ điều kiện, vd phần 1 "Một dãy tính chỉ dùng dấu + và dấu − là một tổng đại số. Mỗi số hạng của tổng mang dấu đứng trước nó." (gộp với Nên sửa 23); phần 2 "Trước ngoặc là dấu +: bỏ ngoặc đi, mỗi số hạng trong ngoặc vẫn giữ dấu cũ."; phần 3 "Trước ngoặc là dấu −: bỏ ngoặc đi và đổi dấu từng số hạng trong ngoặc, không sót số nào." Chốt một cách nói ("đổi dấu từng số hạng") cho quy tắc phần 3, phần 9, note "Cùng làm", `overview.goals`, mẹo. Sửa theo mọi chỗ lặp: recap section, recap card, `segments` của `dien-quy-tac-tru`, nhãn hình `cong-ngoac-vi-du`, `tru-ngoac-vi-du`, `goi-y-*` trong `catalog.ts` (LL-20).

### 2. Mẹo `dau-dau-tien` không nói chỉ dùng khi trước ngoặc có dấu −

- Vị trí: `$.sections[3].blocks[2]` (`tip.dau-dau-tien`) - LL-24
- Nguồn: tr.53, `sbt-p53.png`, ý 2
- Vấn đề: `text` "Hãy viết thêm dấu + trước nó rồi mới đổi dấu từng số hạng" không có điều kiện. Trang "Mẹo hay" (ảnh walk `001-tips`) hiện mẹo đứng một mình, nên bé áp vào 10 + (3 − 5) ra 12 (đúng 8) và vào (3 − 5) − 2 ra 0 (đúng −4): đúng lỗi mà phần 2 và phần 6 dạy tránh. `title` "Số đầu tiên trong ngoặc" không nêu dạng bài.
- Sửa: đưa điều kiện vào câu đầu và tên mẹo, vd `title` "Bỏ ngoặc có dấu − đứng trước", `text` "Khi trước ngoặc có dấu −, số đầu tiên trong ngoặc không ghi dấu vẫn là số dương. Hãy viết thêm dấu + trước nó rồi đổi dấu từng số hạng." kèm ví dụ (≤ 3 câu, tính lại số tiếng). Xem thêm Nên sửa 6 (vị trí mẹo).

### 3. Recap phần "Ngoặc chỉ có một số" nêu một quy tắc mới, không có câu quy tắc, thiếu điều kiện

- Vị trí: `$.sections[4].recap.caption`, `$.cards[4].recap.caption` (`section.ngoac-mot-so`, `card.ngoac-mot-so`); `$.sections[4].blocks[1].children[0]` (note không có `rule: true`); chữ done của `visual.chon-20-tru-am6` - LL-05
- Nguồn: tr.53, `sbt-p53.png`, mục 2: chỉ có hai quy tắc giữ dấu và đổi dấu
- Vấn đề: phần không có note `rule: true` nên `[rule-sentence]` không so được. Recap dạy câu "Hai dấu đứng liền nhau: cùng dấu thì thành dấu +, khác dấu thì thành dấu −", cách nói thứ hai của quy tắc đổi dấu; chữ "Trừ đi số âm thì thành cộng với số dương." của hình chips là cách nói thứ ba. Recap bỏ điều kiện "ngoặc chỉ có một số", nên ở màn ôn card bé dễ dùng cho ngoặc nhiều số: 5 − (−3 + 2) thành 5 + 3 + 2 = 10 (đúng 6). Note màn quy tắc chỉ viết "bỏ theo hai cách ở trên", trỏ vào màn khác (LL-10).
- Sửa: thêm note `rule: true` dùng lại lời của hai quy tắc cũ, vd "Ngoặc chỉ có một số: trước ngoặc có dấu + thì giữ dấu số đó, trước ngoặc có dấu − thì đổi dấu số đó." Recap section và recap card lặp nguyên văn. Nhãn "+ và − thành −" trong bảng giữ làm nhãn ví dụ, không đưa lên recap. Chữ done của `chon-20-tru-am6` đổi cùng lời, vd "Dấu − trước ngoặc nên −6 đổi thành +6."

### 4. Hình "Cùng làm" đặt ngoặc có hai lựa chọn bằng tổng ban đầu

- Vị trí: `$.sections[7].blocks[2].children[1]` (`visual.chon-nhom-7-4`, `catalog.ts` khoá `chon-nhom-7-4`) - LL-01
- Nguồn: tr.53, `sbt-p53.png`, mục 3
- Vấn đề: đề 7 − 4 + 9 − 5 = 7, `wants: [0]` chỉ nhận (7 − 4) + (9 − 5). Chip thứ ba (7 + 4) − (9 − 5) = 11 − 4 cũng bằng 7. Trong cùng card, `explain` của `chon-nhom-20-8` dạy bé lấy "cùng bằng 14" làm căn cứ, nên bé kiểm bằng cách tính sẽ chọn chip 3 và bị báo sai.
- Sửa: đổi chip 3 sang một lỗi thật có giá trị khác 7, vd (7 + 4) + (9 + 5) = 25 hoặc (7 − 4) − (9 − 5) = −1. Tính lại giá trị mọi chip.

### 5. Mẹo "Tính tổng nhiều số hạng" ra sai khi tổng còn ngoặc, lời mẹo hiểu được hai cách, ví dụ dùng phép đặt ngoặc chưa dạy

- Vị trí: `$.sections[6].blocks[2]` (`tip.gom-duong-am`); `$.exercises[34].explain` (`ex.gom-6-9-4-5-8`) - LL-24, LL-10, LL-09
- Nguồn: tr.53, `sbt-p53.png`, mục 3
- Vấn đề: `text` không nói "sau khi bỏ hết ngoặc". Trang "Mẹo hay" gom mẹo ra khỏi section; dùng mẹo cho câu của chính bài khi chưa bỏ ngoặc thì sai: `tinh-ngoac-chuoi` ra 4 (đúng 2), `tinh-hai-ngoac` ra −7 (đúng −1). "Mang dấu của nhóm lớn hơn" đọc được là nhóm nhiều số hơn: 10 − 1 − 2 − 3 khi đó ra −4 (đúng 4). `tex` viết 7 − 9 + 5 − 3 = (7 + 5) − (9 + 3): vừa đổi chỗ vừa đặt ngoặc có dấu − đứng trước, mà phần `nhom-ngoac-tru` (hai section sau) mới dạy.
- Sửa: `text` mở bằng "Bỏ hết ngoặc trước." và viết "kết quả mang dấu của nhóm có tổng lớn hơn". `tex` không đặt ngoặc có dấu −, vd `7 - 9 + 5 - 3 = 7 + 5 - 9 - 3 = 12 - 12 = 0`. `explain` của `gom-6-9-4-5-8` (đang viết `(6 + 4 + 8) - (9 + 5)`) đổi cùng cách.

### 6. Giải thích của `chon-nhom-20-8` nói sai về phương án d

- Vị trí: `$.exercises[39].explain.text` (`ex.chon-nhom-20-8`) - LL-17
- Nguồn: —
- Vấn đề: "Hai dãy sau đổi dấu của 8 hoặc của −8." sai với d: 20 − (8 + 5) − 3 = 20 − 8 − 5 − 3, số −8 vẫn là −8, chỉ +5 đổi thành −5 (chính `wrong` của d nói đúng). Câu gọi một số hạng bằng hai tên "8" và "−8". Câu này còn gọi lựa chọn theo vị trí ("hai dãy đầu", "hai dãy sau"), xem Nghiêm trọng 8.
- Sửa: gọi từng dãy theo nội dung: "Hai cách viết (20 − 8) + (5 − 3) và 20 − 8 + (5 − 3) vẫn giữ nguyên dấu, nên cùng bằng 14. Cách viết (20 + 8) + (5 − 3) đổi −8 thành +8, cách viết 20 − (8 + 5) − 3 đổi +5 thành −5."

### 7. Giải thích của `chon-duong-7-10` coi mọi số hạng đứng đầu là số dương

- Vị trí: `$.exercises[32].explain.text` (`ex.chon-duong-7-10`) - LL-17
- Nguồn: —
- Vấn đề: "Số hạng dương là số hạng có dấu + đứng trước hoặc đứng đầu tổng." sai với tổng mở đầu bằng số âm, mà bài có những tổng như vậy (lựa chọn b `−8 + 4 + 5` của `chon-bang-5-8-4`, `(−8) + (−5) − 9 + (−2)`). Bé dễ nhớ thành "số đứng đầu luôn dương". Câu quy tắc phần 1 không nói gì về số hạng đứng đầu, nên chỗ duy nhất nói tới nó lại nói sai (Nên sửa 23).
- Sửa: "Số hạng dương là số hạng có dấu + đứng trước, hoặc đứng đầu tổng mà không có dấu −."

### 8. Lời giải thích của câu chọn nhiều đáp án gọi tên lựa chọn theo vị trí, mà app xáo thứ tự lựa chọn

- Vị trí: `$.exercises[61].explain.text` (`ex.chon-tong-bang-0`), `$.exercises[39].explain.text` (`ex.chon-nhom-20-8`) - LL-26
- Nguồn: —
- Vấn đề: `chon-tong-bang-0`: "Hai tổng đầu có đủ các cặp số đối nhau, nên bằng 0. Tổng thứ ba còn lại 3 − 4 = −1 và tổng thứ tư còn lại 3." `chon-nhom-20-8`: "Hai dãy đầu … Hai dãy sau …". `src/exercises/choice/choice-answer.tsx` xáo lựa chọn (`seededShuffle`), nên ở phần lớn các lần làm "hai tổng đầu" trên màn không phải a, b: lời giải thích bảo một tổng có −4 hay có số 3 thừa ra là bằng 0, đúng ý bé đang học nhận ra.
- Sửa: gọi từng lựa chọn theo nội dung: "Tổng từ −2 đến 2 và tổng (−3) + (−2) + 2 + 3 có đủ các cặp số đối, nên bằng 0. Tổng có −4 còn lại 3 − 4 = −1; tổng có thêm số 3 thì bằng 3." Đổi luôn lựa chọn d (Nên sửa 4). `chon-nhom-20-8` sửa theo Nghiêm trọng 6. Soát mọi `explain` của câu `choice` trong bài cho các chữ "đầu", "sau", "thứ ba", "thứ tư".

## Nên sửa

### 1. Màn "Cùng làm" phần 2 nói cách giữ dấu dùng được cho "mọi tổng có ngoặc"

- Vị trí: `$.sections[1].blocks[2].children[0].text` (`section.ngoac-dau-cong`)
- Nguồn: —
- Vấn đề: "Cách này giúp bạn tính đúng mọi tổng có ngoặc." Bé đọc "cách này" là cách vừa làm (giữ nguyên dấu), nên hiểu mọi ngoặc đều giữ dấu, đúng lỗi phần 3 phải sửa.
- Sửa: "Cùng làm: chạm vào cách viết đúng của 8 + (5 − 3) khi bỏ ngoặc. Làm vậy bạn nhớ: trước ngoặc là dấu + thì các dấu trong ngoặc không đổi."

### 2. Ba màn "Cùng làm" thiếu dòng lý do; một câu nối "nên" không hợp lý

- Vị trí: `$.sections[3].blocks[3].children[0].text` (`section.ngoac-tru-so-am`), `$.sections[5].blocks[2].children[0].text` (`section.nhieu-ngoac`), `$.sections[7].blocks[2].children[0].text` (`section.nhom-ngoac-cong`) - LL-25
- Nguồn: —
- Vấn đề: phần 4: "Số hạng âm đổi thành số hạng dương, nên nhớ đổi cả số đầu tiên.": vế sau không suy ra từ vế trước (số đầu tiên +7 là số dương). Câu thứ hai của ba note này là gợi ý cách làm, không nói làm để làm gì, trong khi màn "Cùng làm" của các phần 1, 5, 7 có dòng lý do (checklist trục 5, "Màn tương tác nói rõ làm gì và để làm gì").
- Sửa: phần 4 "Cùng làm: chạm vào từng số hạng trong ngoặc để đổi dấu, kể cả số đầu tiên. Bạn sẽ thấy số âm −3 đổi thành +3."; phần 6 thêm "Làm đúng bước này thì bạn bỏ ngoặc không sai dấu."; phần 8 "Nhóm đúng giúp bạn tính nhanh mà kết quả không đổi."

### 3. Câu kiểm tra `thu-chi-la-so-nao` không có tổng trên màn

- Vị trí: `$.exercises[0].prompt[0].text` (`ex.thu-chi-la-so-nao`) - LL-10
- Nguồn: —
- Vấn đề: "Trong tổng tính tiền, khoản chi này là số hạng nào?" nhắc tới tổng 50 − 20 − 5 chỉ có ở màn đầu section. Bé chỉ thấy màn này thì không biết tổng nào; câu còn lại là đoán dấu của "chi".
- Sửa: thêm khối `formula` "50 - 20 - 5" vào đề, hỏi "Trong tổng tiền của mẹ dưới đây, khoản mua cá 20 nghìn là số hạng nào?", nấc 1 trỏ `\htmlId` quanh "- 20".

### 4. Câu kho ôn và lựa chọn lặp số của màn dạy cùng section

- Vị trí: `$.exercises[7]` (`ex.dien-dau-cong`), `$.exercises[9]` (`ex.tinh-6-cong-ngoac-am`), `$.exercises[61].options[3]` (`ex.chon-tong-bang-0`, lựa chọn d) - LL-07
- Nguồn: —
- Vấn đề: `dien-dau-cong` là đúng 40 + (30 − 10) = 40 + 30 − 10 của màn đầu phần 2 và hình `cong-ngoac-mua`. `tinh-6-cong-ngoac-am` dùng lại ngoặc (−4 + 1) của hình quy tắc `cong-ngoac-vi-du`. Lựa chọn d của `chon-tong-bang-0` là đúng dãy chips của màn "Cùng làm" `chon-khong-doi`, mà lời kết màn đó vừa cho biết số 3 còn lại; lựa chọn a là phần đầu của dãy đó.
- Sửa: `dien-dau-cong` 35 + (12 − 7) = 35 ☐ 12 ☐ 7; `tinh-6-cong-ngoac-am` 6 + (−5 + 2); lựa chọn d (−3) + (−1) + 1 + 2 + 3 (bằng 2), `wrong` "Số 2 không có số đối −2 trong tổng này, nên tổng bằng 2".

### 5. Câu điền quy tắc nói khác câu quy tắc của section

- Vị trí: `$.exercises[13].segments` (`ex.dien-quy-tac-tru`) - LL-05
- Nguồn: —
- Vấn đề: "Bỏ ngoặc có dấu − đứng trước thì ta ☐ tất cả các số hạng trong ngoặc" là cách nói thứ hai của câu quy tắc phần 3. Câu điền nên là đúng câu bé phải nhớ.
- Sửa: dựng `segments` từ đúng câu quy tắc (bản viết lại theo Nghiêm trọng 1), chỉ để trống "đổi dấu".

### 6. Mẹo tránh sai đặt sau phần tự làm đầu tiên của dạng bài

- Vị trí: `$.sections[3].blocks[2]` (`tip.dau-dau-tien`)
- Nguồn: —
- Vấn đề: lỗi "quên đổi dấu số đầu không ghi dấu" có ngay ở phần 3 (20 − (6 + 5), 30 − (8 + 7)), nhưng mẹo đứng ở phần 4, sau câu kiểm tra và câu luyện của phần 3 (checklist trục 5: mẹo đặt trước câu tự làm của dạng đó).
- Sửa: chuyển khối `tip` sang phần 3, sau màn quy tắc và trước màn "Cùng làm", ví dụ đổi sang ngoặc toàn số dương, vd 12 − (4 + 3) = 12 − (+4 + 3) = 12 − 4 − 3.

### 7. Câu luyện phần "Ngoặc chỉ có một số" dùng quy tắc ngoặc ở đầu dãy, phần sau mới dạy

- Vị trí: `$.exercises[21]` (`ex.tinh-bon-ngoac`) và `explain` của nó, hình gợi ý `visual.goi-y-ngoac-mot-so`; quy tắc ở `$.sections[5].blocks[1].children[0]` - LL-09
- Nguồn: tr.54, bài 3.20a, `sbt-p54.png`
- Vấn đề: đề mở đầu bằng (−8); `explain` viết "Các ngoặc có dấu + đứng trước hoặc đứng đầu" trong khi quy tắc ngoặc ở đầu dãy nằm ở phần `nhieu-ngoac`. Hình gợi ý cũng mở đầu bằng (−3).
- Sửa: hoặc đưa câu quy tắc ngoặc ở đầu dãy (kèm ví dụ một số, như (−8) + 5 = −8 + 5) lên phần `ngoac-mot-so`; hoặc đổi đề luyện và hình gợi ý để ngoặc không đứng đầu, vd 3 + (−5) − 4 + (−2) = −8, và bỏ "hoặc đứng đầu" khỏi `explain`.

### 8. "Ngoặc đầu" dễ hiểu thành "ngoặc thứ nhất", lệch lời câu quy tắc

- Vị trí: `$.exercises[25].explain` (`ex.bo-ngoac-hai-8-5`), `$.exercises[26].explain.text` (`ex.tinh-hai-ngoac`), `$.exercises[27].explain.text` (`ex.doi-dau-ba-ngoac`: "Ngoặc đầu và ngoặc thứ ba"), nhãn `LEADING_ROWS` của `ngoac-dau-day-vi-du`, `ngoac-dau-day-vi-du-xong`, `explain` của `tinh-bon-ngoac` ("đứng đầu") - LL-05
- Nguồn: —
- Vấn đề: câu quy tắc gọi là "ngoặc ở đầu dãy"; các chỗ khác nói "ngoặc đầu", "đứng đầu". Bé chậm dễ nhớ thành "ngoặc thứ nhất giữ dấu" rồi dùng cho 100 − (40 − 5) − (30 − 10), nơi ngoặc thứ nhất có dấu − đứng trước.
- Sửa: mọi chỗ viết "ngoặc ở đầu dãy" (nhãn hình viết gọn "ngoặc ở đầu dãy giữ dấu").

### 9. Câu kho ôn của card "Nhiều ngoặc" chỉ có một ngoặc

- Vị trí: `$.exercises[28]` (`ex.hai-tui-80`, card `nhieu-ngoac`)
- Nguồn: tr.54, bài 3.21
- Vấn đề: đề chỉ cho 80 − (25 − 5), dạng của card `ngoac-dau-tru`; không ôn ý của card, và id nói hai túi trong khi đề chỉ có một.
- Sửa: thêm túi thứ hai, vd 80 − (25 − 5) − (30 − 10) = 40; hoặc chuyển câu sang card `ngoac-dau-tru`.

### 10. Công thức và chữ xuống dòng giữa ngoặc trên điện thoại

- Vị trí: `visual.hai-tui-giam-gia` dòng `100 - (40 - 5) - (30 - 10)` (ảnh `phone/069-s6-01-block.png`, `070-s6-01-block-end.png`); note `$.sections[7].blocks[0].children[0]` ("(30 −" / "10)", ảnh `phone/092-s8-01-block.png`); `$.exercises[53].prompt[1].tex` (ảnh `phone/133-s11-05-exercise-tinh-tong-hop-9-14.png`); `explain.tex` của `$.exercises[41]`, `[46]`, `[53]`, `[58]` (ảnh `phone/111-`, `123-`, `134-`, `146-…-correct`); câu kho ôn cùng kiểu chuỗi dài một dòng `$.exercises[47]`, `[49]`, `[55]`, `[59]` - LL-12
- Nguồn: —
- Vấn đề: chữ không bị cắt, nhưng ngoặc và dấu "=" bị tách khỏi số của chúng; bé học chậm phải tự ghép lại một dãy nhiều dấu, ngay trong bài dạy đọc dấu trước ngoặc.
- Sửa: dòng đầu `hai-tui-giam-gia` tách bằng helper `steps` (như `WHOLE_ROWS`): `100 - (40 - 5)` và `- (30 - 10)`; đề 53 tách hai dòng; mỗi `explain.tex` có từ hai dấu "=" viết bằng `gathered`, mỗi dòng một phép, tối đa 22 ký tự; note phần 8 dùng khoảng trắng không ngắt trong ngoặc hoặc bỏ hai ngoặc vì hình đã vẽ. Xem lại ảnh `phone/…-correct`.

### 11. Câu luyện và câu ôn cần nhiều hơn 2 phép tính nhẩm

- Vị trí: `$.exercises[26]` (`tinh-hai-ngoac`, câu luyện, 4 phép), `$.exercises[34]` (`gom-6-9-4-5-8`, 5 số hạng), `$.exercises[21]` (`tinh-bon-ngoac`), `$.exercises[22]` (`tinh-ngoac-chuoi`), `$.exercises[46]` (`nhom-cap-10-20`, câu luyện, 5 phép), `$.exercises[53]` (`tinh-tong-hop-9-14`, câu luyện, 6 số hạng), `$.exercises[49]` (`hop-li-120-150`), `$.exercises[55]` (`tong-hop-nam-30`), `$.exercises[59]` (`thu-chi-lan-40`) - LL-18
- Nguồn: tr.54, bài 3.20 đến 3.22
- Vấn đề: luật "Số nhỏ" giới hạn câu luyện và câu ôn ở 2 phép tính nhẩm; câu 5, 6 số hạng bắt bé chậm giữ nhiều số có dấu trong đầu, dễ sai ở bước giữa dù bỏ ngoặc đúng.
- Sửa: giữ dạng sách nhưng bớt số hạng, vd `tinh-hai-ngoac` (5 − 9) − (3 − 8) = 1; `gom-6-9-4-5-8` 6 − 9 + 4 − 5 = −4; câu 53 (−6) + (9 − 4) − (3 − 6) = 2 (−6 và +6 bằng 0); câu 46 giữ 4 số hạng (2 nhóm), số khác hình `goi-y-hop-li`. Hai câu 4 số hạng dạng 3.20 có thể giữ.

### 12. Câu quy tắc "Tính hợp lí" chỉ nói "để được số tròn chục", hẹp hơn bài tập của phần

- Vị trí: `$.sections[9].blocks[0].children[0]` (rule), `$.sections[9].recap.caption`, `$.cards[9].recap.caption` (`card.tinh-hop-li`)
- Nguồn: tr.54 bài 3.22a, gợi ý tr.112 (nhóm thành các nhóm cùng bằng −2)
- Vấn đề: câu luyện `nhom-cap-10-20` nhóm thành các nhóm bằng nhau, màn ngay sau cho hai số đối cộng bằng 0. Bé làm đúng chữ quy tắc thì đi tìm cặp tròn chục trong 10 − 12 + 14 − 16 + 18 − 20 mà không có. Recap lặp câu này.
- Sửa: "Tính hợp lí là bỏ ngoặc trước, rồi đổi chỗ và nhóm các số hạng để tính nhẩm. Nên nhóm thành số tròn chục, hai số đối nhau hay các nhóm bằng nhau." (recap lặp câu đầu; gộp với Nên sửa 15).

### 13. Dạng "nhóm từng cặp có kết quả bằng nhau" không có ví dụ mẫu trước câu luyện

- Vị trí: `$.exercises[46]` (`ex.nhom-cap-10-20`), `$.sections[9].blocks` - LL-16
- Nguồn: tr.54 bài 3.22a
- Vấn đề: ba màn của phần chỉ có mẫu nhóm tròn chục (`tinh-hop-li-vi-du`) và số đối triệt tiêu (`so-doi-mat-nhau`); cách nhóm (10 − 12) + (14 − 16) chỉ hiện ở hình gợi ý nấc 2 `goi-y-hop-li`, tức là sau khi bé làm sai.
- Sửa: thêm dạng này vào hình mẫu màn quy tắc, bằng số khác câu luyện và hình gợi ý (vd 5 − 8 + 15 − 18 = −6), hoặc đổi câu luyện sang dạng đã có mẫu.

### 14. Phần `tinh-hop-li` không có ví dụ đời sống; phần `vi-du-tong-hop` chỉ có ở kho ôn

- Vị trí: `$.sections[9]` (`section.tinh-hop-li`) và các câu của `card.tinh-hop-li`; `$.sections[10]` (`section.vi-du-tong-hop`), câu đời sống duy nhất là `$.exercises[55]` (kho ôn) - LL-16
- Nguồn: —
- Vấn đề: màn, câu kiểm tra, câu luyện của hai phần đều là dãy số trần; luật "Ví dụ đời sống ở mọi section Toán" chưa đạt.
- Sửa: phần 10 đổi màn "Cùng làm" hay câu luyện thành tình huống có tiền, vd "Bạn được cho 27 nghìn, mua vở 14 nghìn, được cho thêm 3 nghìn, mua bút 6 nghìn" (giữ tập số của màn cùng làm). Phần 11 nhận ví dụ Lan từ phần 12 làm màn mở đầu (Nên sửa 18).

### 15. Hai phần liền nhau nêu cùng một cách làm bằng hai câu quy tắc khác nhau

- Vị trí: `$.sections[9].blocks[0].children[0]` và `$.sections[10].blocks[0].children[0]`, cùng recap của hai phần và hai card (`tinh-hop-li`, `vi-du-tong-hop`) - LL-05
- Nguồn: tr.53 (ví dụ), tr.54 bài 3.22, 3.23
- Vấn đề: "Tính hợp lí là bỏ ngoặc trước, rồi đổi chỗ và nhóm các số hạng để được số tròn chục." và "Tính tổng có ngoặc: bỏ ngoặc trước, rồi đổi chỗ, nhóm các số hạng và tính." cùng là "bỏ ngoặc, đổi chỗ, nhóm" nhưng mở đầu khác nhau. Ở phiên ôn trộn card, bé không biết khi nào dùng câu nào; `[rule-sentence]` chỉ so trong một phần nên không bắt.
- Sửa: phần `vi-du-tong-hop` chỉ áp dụng, không dạy ý mới, nên dùng lại nguyên văn câu quy tắc phần 10 (bản sửa theo Nên sửa 12) cho note và recap; nếu giữ câu riêng thì câu đó nói điều mới, như "Bỏ hết các ngoặc trước khi đổi chỗ".

### 16. Ví dụ của mẹo kiểm tra dùng ngoặc có tổng bằng 0, đúng chỗ phép kiểm không phát hiện lỗi

- Vị trí: `$.sections[10].blocks[2].tex` (`tip.kiem-tra-hai-cach`) - LL-24
- Nguồn: —
- Vấn đề: 3 − 5 + 2 = 0 nên 10 − 0 và 10 + 0 bằng nhau: bé bỏ ngoặc sai thành 10 + 3 − 5 + 2 vẫn ra 10 và phép kiểm báo đúng. Câu "nếu khác thì kiểm tra lại các dấu" bỏ qua trường hợp tính sai trong ngoặc.
- Sửa: ngoặc có tổng khác 0, mỗi dòng ≤ 22 ký tự: `\begin{gathered} 10 - (3 - 8 + 2) \\ = 10 - (-3) = 13 \\ 10 - 3 + 8 - 2 = 13 \end{gathered}` (cách sai 10 + 3 − 8 + 2 = 7 và 10 − 3 − 8 + 2 = 1 đều bị phát hiện). Câu cuối: "nếu khác thì xem lại các dấu và các phép tính".

### 17. Số 0 trong dãy số đối được nói theo hai cách trái nhau

- Vị trí: `$.sections[11].blocks[1].children[0]`, `$.sections[11].blocks[2].children[0]`, `done` của `visual.chon-khong-doi`, so với `$.exercises[57].explain.text`, `$.exercises[58].explain.text`, hình `ghep-so-doi` - LL-10, LL-05
- Nguồn: tr.112 bài 3.24 ("Tách riêng 20, các số khác 0 còn lại chia thành từng cặp")
- Vấn đề: note nói "số nào cũng có số đối. Ghép từng cặp số đối nhau"; màn "Cùng làm" bảo chạm "số không có số đối", lời kết nói chỉ 3 còn lại. Nhưng hình `ghep-so-doi` và lời giải câu 57, 58 ("Còn lại 0, 4 và 5") để số 0 đứng riêng. Bé nghĩ "0 không ghép được" sẽ chạm 0 và bị coi là sai.
- Sửa: note "Trong dãy số nguyên từ −3 đến 3, kể cả −3 và 3, ghép từng cặp số đối nhau, mỗi cặp có tổng bằng 0. Số 0 đứng riêng, cộng vào không làm tổng đổi."; "Cùng làm": "chạm vào số khác 0 mà không ghép được với số đối của nó"; lời kết sửa theo.

### 18. Phần `bai-toan-doi-song` gộp hai ý; recap thiếu bước "cộng các số còn lại" và không khớp câu ôn của card

- Vị trí: `$.sections[11]` (`section.bai-toan-doi-song`), `$.sections[11].recap.caption`, `$.cards[11].recap.caption`, `$.exercises[59]`, `$.exercises[60]` - LL-06
- Nguồn: tr.54 bài 3.24
- Vấn đề: phần dạy hai việc: tính thu chi có ngoặc (Lan, câu 59, 60) và cộng dãy bằng ghép số đối (câu 57, 58, 61). Không có note `rule: true`. Recap "Ghép từng cặp số đối nhau: mỗi cặp có tổng bằng 0." không nói phải cộng các số còn lại, bước quyết định của câu luyện 58 và bài 3.24 (đáp số 20): làm đúng recap thì câu nào cũng ra 0. Câu ôn 59, 60 của card hỏi thu chi, ý recap không nhắc.
- Sửa: note `rule: true` "Ghép từng cặp số đối nhau, mỗi cặp có tổng bằng 0. Rồi cộng các số còn lại.", recap lặp nguyên văn, kèm hình có số thừa (vd từ −1 đến 3 bằng 5). Chuyển ví dụ Lan và câu 59, 60 sang `vi-du-tong-hop`; ví dụ đời sống của phần 12 dùng chuyện ghép số đối, vd tiền một tuần +5, −2, +2, −5, +4 nghìn.

### 19. Câu chuyện thu chi đưa công thức vào lời kể: "nhận thêm cả khoản (30 − 10)", "nhận 20 nghìn trừ 5 nghìn công"

- Vị trí: `$.sections[1].blocks[0].children[0]` (`section.ngoac-dau-cong`); `$.sections[11].blocks[0].children[0]` và nhãn `visual.thu-chi-lan`; `$.exercises[55].prompt[0]` (`ex.tong-hop-nam-30`), `$.exercises[59].prompt[0]` (`ex.thu-chi-lan-40`) - LL-10, LL-19
- Nguồn: —
- Vấn đề: bé lớp 6 khó hiểu "5 nghìn công" là tiền gì và ai trừ. Ngoài đời không ai "nhận cả khoản (30 − 10)", "nhận khoản (20 − 5) nghìn" hay "trả khoản (6 + 4) nghìn"; đề đặt công thức vào chỗ câu chuyện nên bé không thấy vì sao có ngoặc.
- Sửa: kể từng khoản bằng lời rồi mới viết biểu thức, vd "Lan có 60 nghìn đồng. Lan bán giấy vụn được 20 nghìn nhưng trả 5 nghìn tiền gửi xe, rồi mua bút 12 nghìn và vở 8 nghìn."; câu 55 "Nam có 30 nghìn đồng, được thưởng 20 nghìn nhưng làm rơi 5 nghìn, rồi mua kẹo 6 nghìn và nước 4 nghìn." (đổi số để khác ví dụ Lan); câu 59 và note phần 2 theo cùng khuôn ("Bạn có 40 nghìn. Bạn bán đồ cũ được 30 nghìn nhưng tiêu mất 10 nghìn.").

### 20. Đề "Chọn tất cả các cách viết đúng" có lựa chọn là kết quả tính dở, không phải cách đặt ngoặc

- Vị trí: `$.exercises[44].prompt[0]` (`ex.chon-nhom-tru-30`), lựa chọn c "30 − 20" - LL-10
- Nguồn: —
- Vấn đề: ngay sau phần dạy đặt ngoặc, bé hiểu "cách viết" là cách đặt ngoặc, nên dễ bỏ c dù c cùng giá trị và được tính đúng.
- Sửa: "Chọn tất cả các biểu thức có giá trị bằng tổng sau."

### 21. Kết quả của tổng được tô ba màu khác nhau trong các hình

- Vị trí: `catalog.ts`: `REASONABLE_ROWS`, `PAIR_ROWS` (`\concept{slate}{0}`), so với `gom-vao-tui` (`amber` 70), `thu-chi-lan` (`amber` 55), `so-doi-mat-nhau`, `WHOLE_ROWS` (`pink` −22, −4), chỗ tô số 0 bằng `amber`
- Nguồn: —
- Vấn đề: cùng nhãn "giá trị của tổng" mà số kết quả lúc amber, lúc hồng (màu số âm), lúc slate (không có trong `concepts` của bài); số 0 lúc amber, lúc slate. Màu không còn chỉ một khái niệm (checklist trục 4).
- Sửa: chốt một cách tô cho mọi kết quả: luôn amber như nhãn, hoặc theo dấu (dương lime, âm hồng, 0 amber); sửa `REASONABLE_ROWS`, `PAIR_ROWS` theo cách đã chốt.

### 22. Một khái niệm gọi bằng năm tên: "tổng đại số", "tổng", "dãy tính", "dãy", "phép tính"

- Vị trí: `$.sections[0].blocks[1].children[0]` ("Dãy tính … gọi là một tổng đại số"), `$.sections[5].blocks[1].children[0]` ("Ngoặc ở đầu dãy"), `$.exercises[3]` (`ex.tong-nao-la-tong-dai-so`: "các dãy tính là một tổng", `explain` "Một tổng chỉ có phép cộng và phép trừ"), đề "Bỏ ngoặc của tổng sau, ta được dãy nào?" (bốn câu bỏ ngoặc) và một đề "Bỏ ngoặc của phép tính sau", `wrong` "Dãy này …" ở nhiều câu; `$.sections[11].blocks[1..2]` ("dãy số nguyên từ −3 đến 3", "dãy −2, −1, 0, 1, 2, 3") - LL-05
- Nguồn: tr.53, ý 1
- Vấn đề: câu quy tắc phần 1 định nghĩa "tổng đại số"; sau đó cùng một biểu thức được gọi "tổng", "dãy", "dãy tính", "phép tính". Đề "Bỏ ngoặc của tổng sau, ta được dãy nào?" ngầm nói kết quả bỏ ngoặc không còn là tổng. Phần 12 lại dùng "dãy" cho một danh sách số nguyên, nghĩa khác. Bé gặp tên mới mà không biết là cùng một thứ.
- Sửa: sau phần 1 gọi biểu thức là "tổng" (nói rõ một lần trong câu quy tắc phần 1: "gọi tắt là tổng"); đề bỏ ngoặc hỏi "ta được tổng nào?"; `wrong` viết "Tổng này …"; "ngoặc ở đầu tổng" thay "ngoặc ở đầu dãy" nếu đổi câu quy tắc phần 6 (sửa cùng Nên sửa 8). Phần 12 có thể giữ "dãy số" vì là danh sách số, nhưng viết "các số nguyên từ −3 đến 3".

### 23. Câu quy tắc phần 1 không nói số hạng đứng đầu không ghi dấu là số dương; ý này rải ở ba chỗ với ba cách nói

- Vị trí: `$.sections[0].blocks[1].children[0].text` và recap phần 1, card `tong-dai-so`; so với `tip.dau-dau-tien` ("Số đầu tiên trong ngoặc không ghi dấu thì vẫn có dấu +"), `$.exercises[32].explain.text` ("đứng đầu tổng"), câu quy tắc phần 6 ("Ngoặc ở đầu dãy, không có dấu đứng trước, được bỏ như ngoặc có dấu +") - LL-05
- Nguồn: tr.53, ý 1
- Vấn đề: "Mỗi số hạng của tổng mang dấu đứng trước nó." không áp được cho số hạng đầu (9 trong 9 − 4 + 1 − 2 không có dấu đứng trước). Điều bé cần biết (số đầu không ghi dấu là số dương) chỉ có trong mẹo, trong một `explain` nói sai (Nghiêm trọng 7) và gián tiếp trong quy tắc phần 6. Ba cách nói cho một ý.
- Sửa: thêm vào câu quy tắc phần 1 (và recap lặp nguyên văn): "Số hạng đứng đầu không ghi dấu là số dương." Mẹo `dau-dau-tien`, `explain` của `chon-duong-7-10` và câu quy tắc phần 6 dùng lại đúng cụm "không ghi dấu là số dương".

## Góp ý

### 1. Note mở đầu hiện sẵn bước mà hình từng bước đang giấu

- Vị trí: `$.sections[2].blocks[0].children[0].text` (`section.ngoac-dau-tru`, hình `tra-tui-hang`), `$.sections[3].blocks[0].children[0].text` (`section.ngoac-tru-so-am`, hình `giam-gia`), `$.sections[8].blocks[0].children[0].text` (`section.nhom-ngoac-tru`, hình `gom-vao-tui`)
- Nguồn: —
- Vấn đề: note viết sẵn "100 − (30 + 20) = 100 − 30 − 20", "= 100 − 30 + 10 = 80 nghìn đồng", "100 − 20 − 10 = 100 − (20 + 10)" ngay trên hình đang để "?" chờ bấm "Bước tiếp" (ảnh walk `036`, `047`), nên các bước của hình không còn gì để bé đoán.
- Sửa: note chỉ kể chuyện và nêu phép tính ban đầu, để hình hiện từng bước và kết quả.

### 2. Cùng tình huống đưa 100 nghìn mà hỏi hai cách: "trả lại" và "còn lại"

- Vị trí: `$.exercises[18].prompt[0].text` (`ex.giam-gia-45-5`), `$.sections[3].blocks[0].children[0].text`, so với `$.overview.hook`
- Nguồn: —
- Vấn đề: "bạn đưa 100 nghìn đồng. Bạn còn lại bao nhiêu nghìn đồng?": đưa hết 100 nghìn rồi thì số tiền nhận về là tiền thối; `overview.hook` hỏi "cô phải trả lại bạn bao nhiêu tiền".
- Sửa: hỏi thống nhất "Cô bán hàng trả lại bạn bao nhiêu nghìn đồng?", hoặc "Bạn có 100 nghìn đồng … bạn còn bao nhiêu" như `tra-tui-keo-but`.

### 3. Nhiễu "0" và lý do sai của `thu-chi-la-so-nao`

- Vị trí: `$.exercises[0].options[2]`, `$.exercises[0].explain.wrong[0].text` (`ex.thu-chi-la-so-nao`) - LL-14
- Nguồn: —
- Vấn đề: "0" không ứng với lỗi nào. "Số 20 là khoản thu vào" đọc như trong chuyện có khoản thu 20 nghìn, trong khi khoản thu là 50.
- Sửa: khi đề đã có tổng 50 − 20 − 5 (Nên sửa 3), thay "0" bằng "−5"; lý do sai của "20": "Số hạng 20 mang dấu +, là tiền thu vào; mua cá là chi ra nên mang dấu −."

### 4. Câu bấm đổi dấu ở phần 3, 4 luôn có đáp án "chạm hết"

- Vị trí: `$.exercises[12]` (`ex.doi-dau-25-9-6`), `$.exercises[17]` (`ex.doi-dau-35-12-5-4`), hình `flipTry` (`src/visuals/math/quy-tac-dau-ngoac/flip-try.tsx`)
- Nguồn: —
- Vấn đề: mỗi đề chỉ có một ngoặc dấu −, nên chạm mọi chip là đúng; câu không phân biệt bé hiểu quy tắc hay làm theo thói quen. Màn "Cùng làm" nói "dấu − trước ngoặc đổi dấu mọi số hạng" mà hình không cho thấy vì sao (không hiện giá trị tổng trước và sau khi bỏ ngoặc; `sumValue` của `logic.ts` có sẵn).
- Sửa: ở màn "Cùng làm" (chỉ chế độ bài học), thêm dòng so giá trị, vd "10 − (3 + 4) = 3; tổng bạn được: 10 + 3 + 4 = 17". Câu bài tập giữ như hiện tại.

### 5. Chip đã chọn tô xanh lá, trùng màu số dương của bài

- Vị trí: hình `chon-so-hang-am` (`$.sections[0].blocks[2]`), `chon-bo-ngoac-8` (`$.sections[1].blocks[2]`); thành phần `src/visuals/shared/pick-chips`
- Nguồn: —
- Vấn đề: ảnh walk `008-s1-03-block-shown`: chip "−4", "−2" khi chọn thành nền xanh lá có ✓, trong khi bài dùng lime cho số hạng dương. Đây là màu trạng thái của app, không chặn bài.
- Sửa: báo người làm app: màu "đã chọn" của `Chips` khác hẳn lime (vd viền xanh dương đậm).

### 6. Chính tả "hóa đơn" lệch kiểu bỏ dấu của app

- Vị trí: `$.overview.whyItMatters`, `$.sections[3].blocks[0].children[0].text`, `$.exercises[18].explain.text`
- Nguồn: —
- Vấn đề: bài viết "hóa đơn" nhưng viết "xoá"; glossary dùng "luỹ thừa", "tuỳ" (kiểu cũ).
- Sửa: "hoá đơn".

### 7. Chú thích mã của huy hiệu tả sai hình

- Vị trí: `src/visuals/math/quy-tac-dau-ngoac/sticker.tsx` (chú thích đầu hàm), `$.sticker`
- Nguồn: —
- Vấn đề: chú thích ghi "along two curved arrows" nhưng hình chỉ có một mũi tên cong (ảnh `sticker-phone`).
- Sửa: "one curved arrow".

### 8. Câu chuyện thu chi chi nhiều hơn số đang có

- Vị trí: `$.sections[6].blocks[0]` (`section.doi-cho`, hình `doi-cho-thu-chi`)
- Nguồn: —
- Vấn đề: "thu 8 nghìn, chi 12 nghìn, thu 4 nghìn": sau khoản thứ hai bé đang âm 4 nghìn; note nói "số tiền còn lại" mà hình ghi "= 0", bé có thể hiểu là còn 0 đồng.
- Sửa: cho số tiền lúc đầu ("Bạn có 20 nghìn"), hoặc nói "số tiền thêm hay bớt sau cả ngày vẫn như vậy".

### 9. Dòng ví dụ sai của `doi-cho-vi-du` không theo thứ tự của dòng đúng

- Vị trí: `catalog.ts` khoá `doi-cho-vi-du`, dòng `9 + 12 - 5 = 16` (nhãn "bỏ lại dấu − thì sai") - LL-15
- Nguồn: —
- Vấn đề: dòng đúng đưa −12 ra cuối (9 + 5 − 12); dòng sai giữ thứ tự 9, 12, 5 và đổi dấu, nên bé khó thấy "bỏ lại dấu" là gì.
- Sửa: `9 - 5 + 12 = 16`.

### 10. Nhiễu "bỏ đi" của câu điền từ quá yếu

- Vị trí: `$.exercises[37].bank` (`ex.dien-nhom-cong`) - LL-14
- Nguồn: —
- Vấn đề: "bỏ đi dấu các số hạng" không ứng với lỗi nào bé hay mắc.
- Sửa: thay bằng "đổi dấu số đầu tiên" hay một lỗi thật khác, hoặc chỉ giữ "giữ nguyên", "đổi".

### 11. Recap phần "Nhiều ngoặc" chỉ nói ngoặc ở đầu dãy

- Vị trí: `$.sections[5].recap`, `$.cards[5].recap` (`nhieu-ngoac`) - LL-06
- Nguồn: tr.54, bài 3.21
- Vấn đề: ý chính của tên phần (mỗi ngoặc xét riêng theo dấu đứng ngay trước nó) chỉ nằm ở note "Cùng làm" và nhãn hình.
- Sửa: thêm câu đó vào note quy tắc của phần, recap lặp nguyên văn.

### 12. Lý do `wrong` của lựa chọn c `nhom-tru-12-5-3` chưa đúng chỗ sai

- Vị trí: `$.exercises[40].explain.wrong[1]` (`ex.nhom-tru-12-5-3`)
- Nguồn: —
- Vấn đề: "Ngoặc có dấu + giữ nguyên dấu, nên không viết được −5 và −3.": trong 12 + (5 − 3), −3 vẫn giữ; chỉ −5 thành +5.
- Sửa: "Ngoặc có dấu + giữ nguyên dấu, nên 12 + (5 − 3) là 12 + 5 − 3: số −5 đã thành +5."

### 13. Lý do `wrong` của lựa chọn b `chon-nhom-tru-30` nghe như đã sửa xong mà vẫn ra 26

- Vị trí: `$.exercises[44].explain.wrong[0]` (`ex.chon-nhom-tru-30`)
- Nguồn: —
- Vấn đề: "Số −8 phải đổi thành +8, nên dãy này bằng 26": "nên" khiến bé hiểu đổi dấu đúng thì ra 26.
- Sửa: "Đưa −8 vào ngoặc có dấu − thì phải viết +8. Dãy này viết −8 nên bằng 26, không phải 10."

### 14. Từ "mất nhau" bé khó hiểu

- Vị trí: `$.sections[9].blocks[1].children[0]`, nhãn visual `so-doi-mat-nhau`, `$.exercises[47].explain.text` - LL-25
- Nguồn: —
- Vấn đề: "hai số mất nhau" không phải cách nói bé đã gặp.
- Sửa: "cộng lại bằng 0" (vd "30 và −30 cộng lại bằng 0").

### 15. Mẹo kiểm tra: tên không nêu dạng bài, câu đầu đi ngược thứ tự câu quy tắc ngay trên nó

- Vị trí: `$.sections[10].blocks[2].title`, `.text` (`tip.kiem-tra-hai-cach`), so với `$.sections[10].blocks[0].children[0]`
- Nguồn: —
- Vấn đề: "Kiểm tra kết quả" không nói kiểm phép gì. Câu quy tắc của phần nói "bỏ ngoặc trước", mẹo ngay dưới mở bằng "Tính trong ngoặc trước rồi tính tiếp", bé có thể nghĩ hai câu nói ngược nhau.
- Sửa: `title` "Kiểm tra phép bỏ ngoặc"; mở `text` bằng "Muốn kiểm lại, hãy tính thêm một cách: tính trong ngoặc trước …".

### 16. Lời giải câu 49 viết hai kiểu cho một bước và không nhóm theo mẫu

- Vị trí: `$.exercises[49].explain` (`ex.hop-li-120-150`)
- Nguồn: —
- Vấn đề: `text` "100 − 70", `tex` "100 + (−70)"; nhóm (80 − 150) ra số âm, khác hình mẫu (gom số dương, đưa số âm vào ngoặc có dấu −).
- Sửa: (120 + 80) − (150 + 20) = 200 − 170 = 30, viết cùng cách ở `text` và `tex`.

### 17. "Từ −3 đến 3" chưa nói có lấy hai đầu không; dạng một đầu không lấy của 3.24 chưa có câu

- Vị trí: `$.sections[11].blocks[1].children[0]`, nhãn `ghep-so-doi`, `ghep-so-doi-xong`
- Nguồn: tr.54 bài 3.24 (−20 < x ≤ 20)
- Vấn đề: câu 57, 58 ghi "kể cả", note và nhãn hình thì không. Điểm cần để ý của 3.24 (không lấy −20) chưa có câu nào hỏi.
- Sửa: thêm "kể cả −3 và 3" vào note và nhãn; có thể thêm câu kho ôn "Tổng các số nguyên lớn hơn −4 và không quá 4" (bằng 4).

### 18. Hình chạm đổi dấu sửa luôn dòng đề

- Vị trí: `visual.doi-dau-tong-hop` (ảnh `phone/129-s11-02-block-shown.png`), `visual.doi-dau-nam-ngoac`
- Nguồn: —
- Vấn đề: sau khi chạm, dòng đề hiện "−(+3 +2 −8)", một tổng khác tổng ban đầu, đứng ngay trên dòng kết quả; bé có thể chép nguyên dòng này.
- Sửa: giữ dòng đề như ban đầu, chỉ tô ô đã chạm; số đổi dấu hiện ở hàng "Tổng khi bỏ ngoặc".

### 19. Khuôn bài và đáp số trùng bài sách

- Vị trí: `$.exercises[46]` (khuôn 3.22a, đáp số −6), `visual.tinh-hop-li-vi-du` và `$.exercises[45]` (khuôn 3.22b, đáp số 0, cùng cách nhóm của gợi ý tr.112), `so-doi-mat-nhau` và `$.exercises[47]` (khuôn 3.23a) - LL-08
- Nguồn: tr.54, tr.112
- Vấn đề: không có số nào trùng sách nên chưa thành chép, nhưng đáp số trùng lời giải sách.
- Sửa: đổi một số để đáp số khác −6 và 0.

### 20. Ảnh `visual:shot` của hình gợi ý `goi-y-tong-hop` cũ hơn `catalog.ts`

- Vị trí: `visual.goi-y-tong-hop`
- Nguồn: —
- Vấn đề: ảnh `quy-tac-dau-ngoac.visual.goi-y-tong-hop-phone.png` còn dòng đầu xuống dòng giữa ngoặc "(1 − 5 + / 2)", trong khi `catalog.ts` sửa sau đã tách bằng `steps`; chưa xác nhận được bản hiện tại.
- Sửa: chạy lại `pnpm visual:shot` và xem ảnh hình gợi ý của phần 9 đến 12.

### 21. Câu kiểm tra dùng lại ngoặc của hình mẫu ngay trước nó

- Vị trí: `$.exercises[52]` (`ex.bo-ngoac-ba-3-8`) - LL-07
- Nguồn: —
- Vấn đề: "(8 − 5)" là đúng ngoặc thứ hai của hình mẫu `vi-du-tong-hop`, hai dãy cùng mở bằng một số âm trong ngoặc.
- Sửa: đổi ngoặc giữa, vd (7 − 2).

### 22. Hai câu kho ôn của card `tinh-hop-li` không cần tính hợp lí

- Vị trí: `$.exercises[50]` (`xep-gia-tri-bo-ngoac`), `$.exercises[51]` (`chon-bang-0`)
- Nguồn: —
- Vấn đề: chỉ cần bỏ ngoặc rồi tính, không cần đổi chỗ hay nhóm, nên không luyện ý recap của card nhắc.
- Sửa: gắn sang card `ngoac-dau-tru` hay `ngoac-mot-so`, hoặc đổi số để phải nhóm mới tính nhẩm được.

### 23. Chuyện nợ ở phần 5 nói "còn 45 nghìn" khi trong túi vẫn có 50 nghìn

- Vị trí: `$.sections[4].blocks[0].children[0].text` (`section.ngoac-mot-so`, hình `no-xoa-no`) - LL-10
- Nguồn: —
- Vấn đề: "Bạn có 50 nghìn đồng và nợ Lan 5 nghìn, nên còn 50 + (−5) = 45 nghìn đồng.": chưa trả nợ thì bé vẫn cầm 50 nghìn; "còn" phải hiểu là "nếu trả nợ thì còn", bé phải đoán.
- Sửa: "Bạn có 50 nghìn đồng nhưng nợ Lan 5 nghìn. Trả nợ xong bạn còn 50 + (−5) = 45 nghìn. Nếu Lan xoá nợ, ta trừ đi số −5: 45 − (−5) = 50 nghìn đồng."
