# LL-05 — Một quy tắc nói nhiều cách

## Triệu chứng

Câu quy tắc trên màn, recap của section, recap của card và video dùng lời khác nhau, hoặc một khái niệm có hai tên. Trẻ học chậm nhớ lẫn các cách nói.

## Ví dụ thật

- `luy-thua` (review ở commit `efe9635`): "Tính luỹ thừa" và "Tính giá trị luỹ thừa" cho cùng một quy tắc.
- `neu-cau-muon-co-mot-nguoi-ban` vòng 6: định nghĩa từ ghép, từ láy ở recap khác note và card.
- `thu-tu-thuc-hien-phep-tinh` vòng 1: quy tắc luỹ thừa gọi số mũ là "luỹ thừa"; cộng trừ và nhân chia phủ định hai kiểu.
- `neu-cau-muon-co-mot-nguoi-ban`, card `nghia-cam-hoa`: "Cáo nói gọn: “làm cho gần gũi hơn”." thiếu "cảm hoá là" so với note (luật mới bắt được, đã sửa).
- `phep-nhan-phep-chia` vòng 1: note section 1 đặt luật "cộng 4 số 6 thì viết là 4 · 6" (số lần đứng trước, ngược quy ước tiểu học 6 × 4), trong khi `ten-goi` viết "2 gói, mỗi gói 25" thành 25 · 2 và các hình đặt tính cũng theo thứ tự ngược lại. Quy ước viết phép nhân a · b phải chốt một lần cho cả bài, kể cả caption và hình.
- `quan-he-chia-het-va-tinh-chat` vòng 1: sáu quy tắc tính chất gọi số chia theo ba cách ("cho m", "cho một số ... cho số đó", b); `m` chưa từng được giới thiệu mà nằm nguyên trong recap ba card; "một số" vừa là số chia (section `tong-chia-het`) vừa là một số của hiệu (section `hieu-khong-chia-het`, "Một số chia hết cho m, số kia ..."). Cách gọi số chia (chữ đại diện hay lời) phải chốt một lần cho cả bài như quy ước viết phép nhân.
- `quan-he-chia-het-va-tinh-chat` vòng 2: ví dụ thêm ở vòng 1 "52 quyển vở chia đều cho 4 tổ thì mỗi tổ 13 quyển" đi với hình `52 = 4 · 13` (4 nhóm mỗi nhóm 13 phải viết 13 · 4), trong khi cả bài đặt số chia là cỡ một nhóm. Ví dụ thêm lúc sửa bài cũng phải theo quy ước phép nhân và cùng kiểu chia (theo cỡ nhóm hay theo số nhóm) với phần còn lại.
- `on-tap-chuong-2` vòng 2, section `so-mu-uclnn-bcnn`: câu nối thêm khi sửa Góp ý vòng 1 "Với mỗi thừa số nguyên tố, số mũ nhỏ nhất trong các số là số mũ trong ƯCLN" bỏ chữ "chung" của quy tắc Bài 11 ngay trên, nên với 12 và 10 bé đưa cả thừa số 5 vào ƯCLN. Câu nói lại quy tắc cho gọn vẫn phải giữ mọi điều kiện của câu gốc.
- `cach-ghi-so-tu-nhien` vòng 1: hai section liền nhau cùng có câu mở bằng "số bé nhất": section `lon-be-nhat` (1 rồi toàn 0) và section `chu-so-khac-nhau` ("chữ số đầu là 1, rồi đến 0, rồi các chữ số tăng dần", không nói "các chữ số khác nhau"). Ở phiên ôn card trộn lẫn, bé đọc câu thứ hai thành quy tắc chung: số bé nhất có bốn chữ số ra 1 023. Các quy tắc cùng chủ đề trong một bài mở bằng ngữ cảnh theo một khuôn.
- `tap-hop-cac-so-nguyen` vòng 1, section `so-doi`: câu quy tắc định nghĩa hai số đối là hai số "nằm hai bên gốc O" (loại số 0), mẹo "Tìm số đối" và `wrong` của `so-doi-cua-8` lại dạy "số đối của 0 là 0" bằng cách đổi dấu, còn các `explain` thêm cách thứ ba "cùng phần số nhưng khác dấu". Mẹo và lời giải nói một khái niệm phải dùng đúng định nghĩa của câu quy tắc; trường hợp biên (số 0) mà mẹo nhắc tới phải có trong câu quy tắc.
- `quy-tac-dau-ngoac` vòng 1, section `ngoac-mot-so`: section không có note `rule: true` (note chỉ viết "bỏ theo hai cách ở trên"), nên `[rule-sentence]` không so được, và recap section, recap card dạy một quy tắc mới "Hai dấu đứng liền nhau: cùng dấu thì thành dấu +, khác dấu thì thành dấu −", bỏ điều kiện "ngoặc chỉ có một số" (5 − (−3 + 2) thành 5 + 3 + 2). Section nào có recap nêu cách làm thì phải có câu `rule: true` để recap lặp lại, và câu đó dùng lại lời của quy tắc đã dạy.
- `phep-nhan-so-nguyen` vòng 1: quy ước "m · n là m lấy n lần" do câu quy tắc đầu bài chốt ((−2) · 3 = (−2) + (−2) + (−2)) bị viết ngược ở năm section (`nhan-voi-0` "4 túi, mỗi túi 0 viên" thành 4 · 0; `giao-hoan-ket-hop`, `phan-phoi`, `gop-thua-so`, `bai-toan-thuc-te`). Ở `bai-toan-thuc-te`, note viết 20 · x ngay trên câu quy tắc "thay đổi mỗi lần nhân với số lần" của chính section. Khi một câu quy tắc đã nói thứ tự bằng lời, mọi ví dụ, hình và lời giải trong cả bài phải theo đúng thứ tự đó; soát mọi đề có chữ "mỗi".
- Cùng vòng, hai section liền nhau có hai câu `rule: true` trái nhau: `giao-hoan-ket-hop` "ta được đổi chỗ các thừa số và nhóm các thừa số tuỳ ý", `nhieu-thua-so` "Tích nhiều thừa số được tính từ trái sang phải" (trang nguồn nói điều ngược lại, lời giải của chính section cũng không làm từ trái sang phải). Cách làm của một ví dụ mẫu không được nâng thành câu quy tắc khi nó trái quy tắc đã dạy; đọc liền các câu quy tắc của cả bài như thẻ ôn trộn lẫn.
- `quy-tac-dau-ngoac` phần bài tập sách bài tập vòng 5 (Nên sửa): ba lời giải viết "cộng các số âm 40 + 13 = 53" (đọc thành tổng các số âm là số dương) trong khi mẹo của bài nói "phần số tự nhiên của các số hạng âm"; viết lại "cộng các số âm (−40) + (−13) = −53".
- `phep-nhan-so-nguyen` phần bài tập sách bài tập vòng 6 (Nghiêm trọng, một mục): bài 3.33 viết phép nhân ngược quy ước "thay đổi mỗi lần nhân với số lần" của khối nhắc lại ngay trên ("420 · x", "60 · (−3)", "320 · 15" trong lời giải, `check.expr` và năm hình), còn câu dẫn đầu tiên và một hình gợi ý viết đúng thứ tự (4 · 50, 3 · 20); Nên sửa cùng vòng: so sánh hai số âm nói hai chiều khác câu quy tắc đã duyệt, câu nhắc "Muốn nhân hai số nguyên ..." là cách nói thứ ba của quy tắc, "trái dấu, bỏ đi" thay cho "hai số đối nhau cộng lại thì được 0".

## Nguyên nhân gốc

Mỗi chỗ viết lại quy tắc từ trí nhớ thay vì chép câu gốc; recap rút gọn được viết tay.

## Cách phòng

- Máy: `content:check` luật `[rule-sentence]`: `note` có `"rule": true` là câu quy tắc; recap section phải lặp nguyên văn một câu của nó; câu recap (section, card) giống quá nửa số từ của câu quy tắc mà không trùng nguyên văn (hay không là một vế nguyên văn) là lỗi. Video: `pnpm video:check` so chữ quy tắc trên hình với câu của bài.
- Người: checklist mục "Một khái niệm, một từ, một màu" và "`recap` khớp card hay section".

## Trạng thái

Đang áp dụng. Recap rút gọn cũ của các bài đã xuất bản chưa đánh `rule` (xem backlog từng bài).
