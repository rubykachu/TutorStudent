# Review: Thứ tự thực hiện các phép tính (`thu-tu-thuc-hien-phep-tinh`)

- Bài: `content/math/kntt/thu-tu-thuc-hien-phep-tinh/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/thu-tu-thuc-hien-phep-tinh/` - p24, p25, p26, p102, p103
- `content:check`: 0 lỗi, 1 cảnh báo của bài (89 id chưa có trong `ids.lock.json`)
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/thu-tu-thuc-hien-phep-tinh/`. Ảnh walk chụp lúc 15:46, trước lần sửa cuối của `lesson.json`, `catalog.ts` (15:52) và `statics.tsx`, `steps.tsx` (16:02–16:12), nên vài màn còn hình cũ (ví dụ `095-s8-07-recap.png`, `122-s11-04-block.png`). Màn đã đổi được soát bằng ảnh visual mới trong `.shots/thu-tu-thuc-hien-phep-tinh/`. Ảnh cũ không tính là lỗi nội dung; tác giả chụp lại walk ở vòng sau.
- Kết luận: Chưa đạt: còn 4 lỗi Nghiêm trọng
- Bản đã review: `8f532e2d091b375ce2a81059902918ce9433e0ef633ff5e0db933271566eded6` (`pnpm content:diff` so với bản này)

Ba reviewer đã tự giải mọi exercise trước khi đọc `answer`: mọi đáp án đúng, mỗi câu `choice` có đúng một lựa chọn đúng. Mọi `hintVisualId` dùng số khác đề và dừng ở "?"; mọi `solutionVisualId` dùng số của đề, trừ mục Nghiêm trọng 1.

Đã soát lại và bỏ hai phát hiện của nhóm:
- "Câu nối (`match`) và sắp xếp (`order`) chưa có màn hướng dẫn thao tác trong app": sai. Bài đã xuất bản `neu-cau-muon-co-mot-nguoi-ban` có `huong-dan-noi` (nối cặp) và `huong-dan-xep` (sắp xếp). Luật "Mỗi thao tác dạy một lần cho cả app" đã được đáp ứng, nên `noi-dau-voi-ten` và câu kho ôn `sap-buoc-cong-tru` không cần màn riêng.
- "Ảnh walk cũ hơn bản đang review": đây là việc chụp lại walk, không phải lỗi nội dung (xem dòng `lesson:walk`).

## Nghiêm trọng

### 1. Hình lời giải của câu 7 · 8 giải một bài khác (14 · 6 = 84)

- Vị trí: `$.exercises[12].hints.solutionVisualId` (`ex.nhan-7-8`, câu kiểm tra của section `on-nhan-chia`); spec `nhan-7-8-giai` trong `src/visuals/math/thu-tu-thuc-hien-phep-tinh/catalog.ts` là `{ kind: "split", factor: 14, digit: 6 }`
- Nguồn: —
- Vấn đề: Sau lần sai thứ ba, trẻ thấy "14 · 6 = 84", giống hệt hình mẫu `nhan-hai-chu-so` trên màn quy tắc. Hình không có số của đề, cũng không có 56. Trẻ yếu bảng nhân đang cần xem cách ra 56 thì lại thấy 84, dễ nhớ sai 7 · 8 = 84.
- Sửa: Làm hình lời giải cho đúng 7 · 8 (ví dụ 7 · 7 = 49, 49 + 7 = 56, hoặc kiểu `divide` 56 : 8 = 7 đảo ngược), hoặc bỏ `solutionVisualId` để khung tự hiện 56.

### 2. Hình so sánh đúng/sai: cột sai trông như cột đúng, nhãn và màu mâu thuẫn quy tắc

- Vị trí: component `SoSanhThuTu` trong `statics.tsx`, dùng ở `cong-tru-so-sanh` (`$.sections[2].blocks[1].children[1]`), `nhan-chia-so-sanh` (`$.sections[4].blocks[1].children[1]`), `hon-hop-so-sanh` (`$.sections[5].blocks[1].children[1]`), `ngoac-tron-so-sanh` (`$.sections[6].blocks[2].children[1]`), `luy-thua-so-sanh` (`$.sections[8].blocks[1].children[1]`)
- Nguồn: tr.24, `p24.png`; tr.25, `p25.png` (ví dụ các lời giải ghi rõ "sai vì…")
- Vấn đề: Ảnh `…visual.hon-hop-so-sanh-ipad.png`: cột sai cũng có khung hồng "làm trước" và kết quả gạch chân hổ phách như cột đúng; hai cột chỉ khác ô màu nhỏ ở đầu cột. Trẻ đọc chậm không biết cột nào bị loại, dễ chép cách sai. Ba chỗ mâu thuẫn với phần còn lại của bài:
  - Nhãn cột sai của `hon-hop-so-sanh` là "Làm từ trái sang", đúng cụm mà note section `cong-tru`, `nhan-chia` và bậc thang ("Từ trái sang phải") dạy là quy tắc. Trẻ dễ hiểu "làm từ trái sang" là sai.
  - `ngoac-tron-so-sanh` đặt 3 · 8 + 4 = 28 (tính đúng) dưới nhãn đối lập với "Đúng thứ tự", trong khi note ngay trên nói 3 · 8 + 4 "thì nhân trước", tức là một biểu thức khác được tính đúng.
  - Màu: ô hổ phách của "Đúng thứ tự" trùng màu khái niệm "Kết quả" trong chú thích mọi hình từng bước; ô slate của cột sai trùng màu khái niệm "Bảng nhân" (chấm slate của hình `nhan-chia-on`). Hai màu mang hai nghĩa.
- Sửa: Cột sai dùng màu trung tính (không khung hồng, không gạch chân hổ phách), có dấu ✗ và nhãn nói rõ lỗi: "Sai: cộng trước trừ", "Sai: nhân trước chia", "Sai: trừ trước nhân", "Sai: nhân 2 · 3 trước". Cột đúng dùng dấu ✓, không dùng ô hổ phách. Với `ngoac-tron-so-sanh`, đặt hai nhãn là "Có ngoặc" / "Không ngoặc", cả hai tính đúng, để khớp câu "Ngoặc đổi thứ tự tính".

### 3. Câu tìm x điền chỗ trống in sẵn đáp án của hai ô đầu

- Vị trí: `$.exercises[55].segments[2].text`, `$.exercises[55].segments[4].text` (`tim-x-1`, câu luyện tập của card `tim-so`); `$.exercises[56].segments[2].text`, `$.exercises[56].segments[4].text` (`tim-x-2`)
- Nguồn: tr.26 bài 1.66, tr.102 lời giải 1.66 (`p26.png`, `p102.png`)
- Vấn đề: Ngay sau ô b1 là chữ "; 4x = 28 − 8 = ", sau ô b2 là "; x = 20 : 4 = " (ảnh walk `129-s11-08-exercise-tim-x-1.png`). Trẻ chép 28 và 20 từ chính dòng chữ, bỏ qua kỹ năng câu hỏi muốn luyện là tính vế phải theo thứ tự. `tim-x-2` lộ theo cùng cách ("6x = 20 + 4", "x = 24 : 6"). Tác dụng như highlight lộ đáp án.
- Sửa: Chữ sau mỗi ô không in lại kết quả của ô trước, ví dụ "Vế phải = [b1]. Vậy 4x bằng vế phải trừ 8, được [b2]. Vậy x = [b3]". Hoặc chỉ hỏi vế phải ở một câu và x ở câu khác. Giữ nhiễu 36 và 16 vì chúng ứng với lỗi hay gặp.

### 4. Câu quy tắc "Luỹ thừa chỉ tác động lên số ngay bên dưới nó" gọi sai khái niệm và sai vị trí

- Vị trí: `$.sections[8].blocks[1].children[0].text` (`section.luy-thua`)
- Nguồn: tr.24, `p24.png`
- Vấn đề: Tổng hợp nâng mức từ Nên sửa lên Nghiêm trọng. Đây là câu quy tắc trẻ phải nhớ, nhưng nó gọi số mũ là "luỹ thừa", trong khi bài `luy-thua` và glossary dùng "luỹ thừa" cho cả 3², "số mũ" cho số nhỏ phía trên. Số mũ cũng không nằm "ngay trên" cơ số mà ở góc trên bên phải, nên "số ngay bên dưới nó" không chỉ đúng cơ số. Trẻ nhớ câu này sẽ nhớ sai tên gọi đã học ở bài trước.
- Sửa: "Số mũ chỉ gắn với số ngay bên trái nó: 2 · 3² là 2 · 9, không phải 6²." (không để "2 · 9" bị ngắt dòng, như ảnh `098-s9-02-block.png`).

## Nên sửa

### 1. Hình gợi ý của 7 · 8 dạy tách chục, không hợp với phép nhân trong bảng

- Vị trí: `$.exercises[12].hints.hintVisualId` (`ex.nhan-7-8`), spec `nhan-7-8-goi-y` = `split 12 · 7`
- Nguồn: —
- Vấn đề: 7 · 8 không có chữ số hàng chục để tách; hình 12 · 7 = 70 + 2 · 7 không cho trẻ đường nào tới 7 · 8.
- Sửa: Gợi ý bằng bảng nhân với số khác đề, dừng ở "?" (ví dụ 7 · 6 = 42, 7 · 7 = 49, 7 · 9 = ?), hoặc bằng quan hệ nhân chia như note đầu section.

### 2. Hình lời giải của câu đọc tên dấu lại tính giá trị biểu thức

- Vị trí: `$.exercises[6].hints.solutionVisualId` (`ex.dien-ten-dau`), spec `dien-ten-dau-giai` = `steps 12:3+7 full`
- Nguồn: —
- Vấn đề: Đề hỏi đọc tên dấu, hình lời giải tính 12 : 3 = 4, 4 + 7 = 11 và không có chữ "chia", "cộng". Trẻ lẫn tên dấu không được sửa đúng chỗ sai.
- Sửa: Dùng hình kiểu `doc-bieu-thuc` cho 12 : 3 + 7 kèm các chip "mười hai / chia / ba / cộng / bảy", hoặc bỏ `solutionVisualId`.

### 3. "Đọc biểu thức từ trái sang phải" dễ bị hiểu thành "tính từ trái sang phải"

- Vị trí: `$.sections[1].blocks[1].children[0].text` (`section.dau-phep-tinh`)
- Nguồn: tr.24, `p24.png`
- Vấn đề: Section trước dạy "nhân trước, cộng sau", section sau dạy "tính từ trái sang phải". Câu "Đọc … từ trái sang phải" đặt giữa, với ví dụ 2 · 8 + 5, dễ bị gộp thành "cứ trái sang phải mà làm", ngược với section đầu.
- Sửa: Tách rõ đọc và tính, ví dụ "Đọc biểu thức từ trái sang phải, từng số và từng dấu. Còn tính thì theo thứ tự của bài."

### 4. Luật "cùng loại thì từ trái sang phải" được nói theo hai cách phủ định, và ví dụ phần nhân chia toàn chia đứng đầu

- Vị trí: `$.sections[2].blocks[1].children[0].text` ("Đừng cộng trước: …"), `$.sections[4].blocks[1].children[0].text` ("Nhân không làm trước chia: …"); ví dụ của section `nhan-chia`: `nhan-chia-cam`, `nhan-chia-so-sanh` (48 : 6 · 2), `nhan-chia-tung-buoc` (72 : 6 · 3 : 4), `nhan-chia-tu-lam` (36 : 4 · 3), recap `nhan-chia-tom-tat` (64 : 8 · 3), `$.exercises[17]`, `[18]`, `[20]`
- Nguồn: tr.24, `p24.png` (cộng trừ; nhân chia: từ trái qua phải); tr.25, `p25.png` bài 1.62b bắt đầu bằng nhân
- Vấn đề: Cùng một luật, hai section mở đầu bằng hai lệnh phủ định khác nhau. Đọc riêng vế đầu, "Đừng cộng trước" thành "trừ trước cộng", "Nhân không làm trước chia" thành "chia trước nhân". Mọi ví dụ trên màn, recap, câu kiểm tra và câu luyện tập đầu của section `nhan-chia` đều có dấu chia đứng đầu, nên trẻ theo luật sai "chia trước" vẫn làm đúng hết; chỉ câu kho ôn `sap-buoc-nhan-chia` (3 · 8 : 6 · 5) có nhân đứng đầu.
  Nhóm 2 ghi mục này là Nghiêm trọng. Tổng hợp hạ xuống Nên sửa vì: câu quy tắc đọc trọn vẫn đúng ("dấu nào đứng bên trái thì làm trước"); note đầu section và recap nói đúng "tính từ trái sang phải"; và với phép chia hết, a · b : c tính theo kiểu "chia trước" vẫn ra cùng kết quả, nên hiểu sai này không làm trẻ ra số sai ở câu tính của bài. Nó chỉ lộ ra ở câu chạm vùng hay sắp bước có nhân đứng đầu, mà các câu đó hiện không có ở vị trí kiểm tra.
- Sửa: Nói luật theo một câu khẳng định, dùng chung cho cả hai section: "Cộng và trừ ngang nhau: dấu nào đứng bên trái thì làm trước." và "Nhân và chia ngang nhau: dấu nào đứng bên trái thì làm trước." Giữ hình so sánh chia đứng đầu (chỗ cách làm sai ra số khác), nhưng đổi hình từng bước hay hình cùng làm và câu kiểm tra chạm vùng sang biểu thức có nhân đứng đầu (ví dụ 4 · 6 : 3, đáp án op1 là phép nhân).

### 5. Màn hướng dẫn chạm vùng gọi trẻ là "em"

- Vị trí: `$.sections[2].blocks[3].children[0].text` ("phép tính em chọn"); nhãn trong hình `huong-dan-cham-phep-tinh` ("Vòng đen: phép tính em chọn", `statics.tsx`)
- Nguồn: —
- Vấn đề: `docs/learner.md` quy định linh vật gọi trẻ là "bạn", `overview` của bài cũng dùng "bạn". Hai cách xưng hô trong một bài.
- Sửa: Đổi "em" thành "bạn" ở note và nhãn trong hình.

### 6. Section `on-nhan-chia` gộp hai ý, recap chỉ nhắc một

- Vị trí: `$.sections[3].blocks[2]` (tách chục và đơn vị) so với `$.sections[3].recap.caption`, `$.cards[3].recap.caption`
- Nguồn: Kiến thức nền (tiểu học); tr.24, `p24.png`
- Vấn đề: Section dạy (a) nhân chia đi cùng nhau, chia bằng cách hỏi ngược và (b) nhân số có hai chữ số bằng cách tách chục, có câu kho ôn riêng `nhan-13-4`. Recap chỉ nhắc (a), nên phiên ôn gặp 13 · 4 mà màn "Nhớ nhé!" không có cách làm.
- Sửa: Tách (b) thành section ngắn có recap riêng, hoặc bỏ khối (b) cùng `nhan-13-4` nếu chỉ cần ôn bảng nhân.

### 7. Thuật ngữ nền "bảng nhân" được khai báo nhưng không xuất hiện trong chữ của bài

- Vị trí: `$.concepts[5]` (`concept.bang-nhan`, slate), `$.cards[3].conceptIds`; mọi `note` của `$.sections[3]`
- Nguồn: Kiến thức nền (tiểu học) theo `content/glossary/math.json` (`"bảng nhân"`, `prerequisite: "tiểu học"`)
- Vấn đề: Ngoại lệ "kiến thức nền" dựa vào thuật ngữ "bảng nhân", nhưng không note, caption hay nhãn nào có chữ đó. Hình `nhan-chia-on` nay vẽ chấm màu slate, nhưng không có nhãn nối màu với tên. Khối tách chục (14 = 10 + 4) cũng vượt phạm vi "bảng nhân". Định nghĩa và ví dụ vẫn đúng, và phép nhân hai chữ số với một chữ số cần cho ví dụ tr.24, nên giữ mức Nên sửa.
- Sửa: Dùng thuật ngữ trong note (ví dụ "Thuộc bảng nhân thì chia nhanh: biết 6 · 7 = 42 thì biết 42 : 6 = 7") và cho hình `nhan-chia-on` một nhãn "Bảng nhân" màu slate. Khối tách chục: bỏ (xem mục 6) hoặc thêm thuật ngữ nền tương ứng vào glossary.

### 8. Dấu nhân "·" trong câu nối dấu quá nhỏ

- Vị trí: `$.exercises[4].left[2].content` (`tex: "\\cdot"`, `ex.noi-dau-voi-ten`)
- Nguồn: —
- Vấn đề: Ảnh walk `021-s2-03-…-wrong2.png` (ipad), `phone/019-s2-03-exercise-noi-dau-voi-ten.png`: dấu "·" chỉ là một chấm vài pixel, nhỏ hơn hẳn "+", "−", ":", trong khi câu này kiểm tra đúng việc nhận ra dấu nhân.
- Sửa: Phóng to ký hiệu (ví dụ `\Large\cdot`) hoặc đặt dấu giữa hai số (`4 \cdot 2`, `8 : 2`, …) như hình `bang-dau`.

### 9. Câu luyện tập duy nhất của `cong-tru` cần ba phép tính

- Vị trí: `$.exercises[9]` (`ex.tinh-cong-tru-1`, 25 − 9 + 6 − 12)
- Nguồn: —
- Vấn đề: Luật "Số nhỏ" giới hạn câu luyện tập ở 2 phép tính nhẩm; câu này có 3. Ba số sau còn trùng màn cùng làm `cong-tru-tu-lam` (30 − 9 + 6 − 12).
- Sửa: Rút còn ba số khác màn cùng làm, ví dụ 24 − 8 + 5 (= 21), và đổi hai spec `tinh-cong-tru-1-goi-y`, `-giai` theo.

### 10. Section ngoặc lồng nhau thiếu ví dụ đời sống

- Vị trí: `$.sections[7]` (`section.ngoac-long`)
- Nguồn: —
- Vấn đề: Chỉ có so sánh "quà trong hộp" ở caption, không có tình huống nào có số; trái luật "Ví dụ đời sống ở mọi section Toán".
- Sửa: Thêm một tình huống số nhỏ dùng hai lớp ngoặc (ví dụ mua 2 phần quà, mỗi phần [1 hộp bút 5 nghìn đồng và (2 · 3) nghìn đồng tiền kẹo]).

### 11. Câu quy tắc thứ hai của section ngoặc lồng không khớp hình đi kèm

- Vị trí: `$.sections[7].blocks[1]` (note "Ngoặc tròn nằm trong cùng, …" + visual `bang-ngoac`)
- Nguồn: tr.24, `p24.png`; tr.26, `p26.png`
- Vấn đề: Câu nói về vị trí lồng nhau, hình là ba thẻ rời tả hình dạng từng dấu ("Hai nét cong", …), không vẽ gì bọc gì. Ý lồng nhau đã có ở `ngoac-long-hop` màn trước.
- Sửa: Giữ hình và đổi câu thành câu nhận dạng ("( ) là ngoặc tròn, [ ] là ngoặc vuông, { } là ngoặc nhọn."), đặt màn này trước `ngoac-long-hop`; hoặc giữ câu và thay hình bằng hình hộp lồng nhau.

### 12. Hai recap dùng từ "bậc" chưa được dạy

- Vị trí: `$.sections[5].recap.caption`, `$.cards[5].recap.caption` (`hon-hop`); `$.sections[10].recap.caption` (`bai-tap-sach`)
- Nguồn: tr.24, `p24.png`
- Vấn đề: "cùng bậc thì từ trái sang phải" xuất hiện ở hai màn "Nhớ nhé!", nhưng bài không định nghĩa "bậc", glossary không có. Note của section `cong-tru`, `nhan-chia` và nhãn bậc thang nói cùng ý bằng "từ trái sang phải" mà không dùng "bậc".
- Sửa: "Nhân, chia làm trước; cộng, trừ làm sau. Hai phép cùng hàng trên bậc thang thì làm từ trái sang phải." hoặc bỏ vế sau vì hình bậc thang đã ghi "Từ trái sang phải" ở mỗi bậc. Sửa cả hai recap theo cùng một cách nói.

### 13. `sourceRef` phần ngoặc nhọn thiếu trang có ngoặc nhọn

- Vị trí: `$.sections[7].sourceRef`, `$.cards[7].sourceRef` (`ngoac-long`)
- Nguồn: tr.26, `p26.png` (1.64b)
- Vấn đề: Trang 24 chỉ có ( ) và [ ]; ngoặc nhọn chỉ có ở tr.26.
- Sửa: "Sách bài tập tr.24, 26".

### 14. Không màn nào làm mẫu bước tìm x; hình mẫu, lời giải và recap đều dừng ở vế phải

- Vị trí: `$.sections[10].blocks[3]` (visual `tong-hop-ve-phai`, `3·2^2+8`); `tim-x-1-giai`, `tim-x-2-giai`, `tim-x-3-giai` (chỉ tính vế phải; `tim-x-3-giai` ở mode `still`); `$.cards[12].recap` (`tong-hop-tom-tat-tim-so` vẽ `2·4^2-5`, không có x)
- Nguồn: tr.102, lời giải 1.66a (`p102.png`)
- Vấn đề: Bước "4x + 8 = 20 → 4x = 12 → x = 3" chưa được vẽ ở màn nào; lần đầu trẻ thấy là trong câu luyện tập. `tim-x-3` hỏi thẳng x mà lời giải nấc 3 chỉ hiện 23. Trái luật "Mẫu → cùng làm → tự làm". Recap card `tim-so` không minh hoạ câu caption của nó.
- Sửa: Cho `tong-hop-ve-phai` chạy tới x; lời giải `tim-x-*-giai` chạy tới x (mode `full`); recap card `tim-so` vẽ một ví dụ tìm x có nhãn.

### 15. Section `bai-tap-sach` gộp "tìm số chưa biết" với "tính biểu thức dài"; recap không nhắc tìm x

- Vị trí: `$.sections[10]`, `$.sections[10].recap.caption`
- Nguồn: tr.25–26 (`p25.png`, `p26.png`)
- Vấn đề: Section có hai quy tắc cần nhớ riêng (thứ tự tính; tính vế đã biết trước rồi tìm số chưa biết) và ba dạng câu; recap chỉ nói thứ tự tính.
- Sửa: Tách "Tìm số chưa biết" thành section riêng (note, ví dụ mẫu trọn như mục 14, câu kiểm tra, `tim-x-1`, recap riêng).

### 16. Chưa có ví dụ mẫu cho dạng "chọn dòng viết lại đúng"

- Vị trí: `$.sections[10].blocks`, trước `$.exercises[51]` (`chon-dong-dung-1`)
- Nguồn: tr.25, Ví dụ 4 các lời giải (A)–(D) (`p25.png`)
- Vấn đề: Không màn nào chỉ ra một dòng sai và vì sao sai; trẻ gặp dạng câu này lần đầu ở câu luyện tập.
- Sửa: Thêm một màn mẫu (số khác đề và khác p25) hiện 3 dòng sai và 1 dòng đúng, mỗi dòng sai có nhãn lý do ngắn (dùng `compare` đã sửa theo Nghiêm trọng 2 hoặc mở rộng).

### 17. Đề "Bốn bạn viết dòng thứ hai…" dễ hiểu là chọn lựa chọn thứ hai

- Vị trí: `$.exercises[51..54].prompt[0].text` (`chon-dong-dung-1..4`); `$.cards[11].recap.caption`
- Nguồn: tr.25 (`p25.png`)
- Vấn đề: Lựa chọn hiện thành lưới 2 × 2 (ảnh `127-s11-07-exercise-chon-dong-dung-1.png`); "dòng thứ hai" trùng cách gọi hàng thứ hai của lưới.
- Sửa: "Bốn bạn làm bước đầu tiên của biểu thức này. Bạn nào làm đúng?"; recap card: "Bước đầu đúng là bước làm đúng phép tính phải làm trước."

### 18. `chon-dong-dung-1` giải được bằng mẹo "chọn dòng không còn số mũ"

- Vị trí: `$.exercises[51].options`
- Nguồn: tr.25, lời giải (C) (`p25.png`)
- Vấn đề: Ba nhiễu đều còn luỹ thừa, chỉ đáp án không còn, nên trẻ chọn đúng mà không cần hiểu thứ tự; câu cũng thiếu lỗi hay gặp nhất 3² = 6.
- Sửa: Thay d bằng `6 + 2 \cdot 6 : 3 - 1` (tính 3² thành 6).

### 19. Câu luyện tập `tinh-day-du-1` quá dài và có 2⁵

- Vị trí: `$.exercises[47]` (`tinh-day-du-1`)
- Nguồn: tr.26 bài 1.63c (`p26.png`)
- Vấn đề: 2⁵ cần 4 lần nhân (luật "Số nhỏ": 3⁴ đã không được), cả biểu thức 7 phép tính.
- Sửa: Ví dụ `3 \cdot 2^{3} + 4 \cdot 5 - 9 \cdot 2 + 7` = 33; sửa `check.expr` và hai visual `tinh-day-du-1-*`.

### 20. Thứ tự câu luyện tập của `bai-tap-sach` không tăng dần độ khó

- Vị trí: `$.sections[10].practiceIds` (`tinh-day-du-1` mức 3, `chon-dong-dung-1` mức 2, `tim-x-1` mức 3)
- Nguồn: —
- Vấn đề: Câu tính trọn biểu thức dài đứng trước câu chỉ chọn bước đầu.
- Sửa: Xếp `chon-dong-dung-1` → `tinh-day-du-1` → `tim-x-1` (nếu chưa tách section).

### 21. Ví dụ lát gạch trộn đơn vị m² với viên gạch

- Vị trí: `$.sections[8].blocks[0].children[1].caption` (visual `luy-thua-lat-gach`, `2·3^2+4`)
- Nguồn: —
- Vấn đề: "phòng vuông cạnh 3 m" cho 9 m², cộng "4 viên dự phòng" ra 22 mà không nói 22 là gì, cũng không nói mỗi viên lát 1 m².
- Sửa: "Hai phòng vuông, mỗi cạnh 3 hàng gạch (mỗi phòng 3 · 3 viên), mua thêm 4 viên dự phòng: cần 22 viên."

### 22. Bài toán mua bút ở section `bai-tap-sach` có hai cách hiểu, và câu chuyện nằm trong `note`

- Vị trí: `$.sections[10].blocks[1].children[0].text` (visual `tong-hop-mua-but`, `50-2·3·4`)
- Nguồn: —
- Vấn đề: "mỗi hộp 3 bút giá 4 nghìn đồng" đọc được là mỗi hộp 4 nghìn (thừa 42) hay mỗi bút 4 nghìn (thừa 26); hình chọn cách thứ hai. Đề bài nằm trong `note`, chỗ dành cho câu quy tắc.
- Sửa: Caption của visual: "Mua 2 hộp bút, mỗi hộp 3 cái, mỗi cái 4 nghìn đồng, đưa 50 nghìn đồng."; `note` chỉ giữ "Bài toán đời sống cũng theo thứ tự đó."

### 23. Caption mua vở của section ngoặc tròn có hai cách hiểu

- Vị trí: `$.sections[6].blocks[0].children[1].caption` (visual `ngoac-tron-mua-vo`, `3·(8+4)`)
- Nguồn: —
- Vấn đề: "3 vở, mỗi vở 8 nghìn đồng và 4 nghìn đồng tiền bọc" đọc được là 4 nghìn tiền bọc cho cả ba vở (3 · 8 + 4 = 28), trong khi biểu thức 3 · (8 + 4) = 36 cần 4 nghìn cho mỗi vở. Đây chính là cặp biểu thức mà màn so sánh ngay sau dùng để phân biệt có ngoặc và không ngoặc, nên câu chuyện mơ hồ làm hỏng đúng ý của section.
- Sửa: "Mua 3 vở, mỗi vở 8 nghìn đồng, bọc mỗi vở thêm 4 nghìn đồng."

### 24. Từ "vế", "vế phải", "vế đã biết" chưa được giải thích

- Vị trí: `$.sections[10].blocks[3].children[0].text`, `$.sections[10].blocks[3].children[1].caption`, `$.exercises[55].segments[0].text`, `$.exercises[56].segments[0].text`, `$.cards[12].recap.caption`
- Nguồn: tr.102 (`p102.png`)
- Vấn đề: "vế" không có trong glossary và không được định nghĩa trong bài; trẻ học chậm không biết "vế đã biết" là phần nào.
- Sửa: Định nghĩa tại lần dùng đầu ("Dấu = chia đẳng thức làm hai vế: vế trái và vế phải.", có hình tô hai vế), hoặc nói "phần bên phải dấu =".

### 25. Section `bieu-thuc-chu` không có màn cùng làm

- Vị trí: `$.sections[9].blocks`
- Nguồn: tr.24 (`p24.png`)
- Vấn đề: Mọi section khác có màn trẻ thao tác có hướng dẫn; ý mới "thay chữ bằng số" đi thẳng từ hình mẫu sang câu kiểm tra.
- Sửa: Thêm một màn cùng làm (số khác đề, ví dụ `3x + 1` với x = 2).

### 26. `overview.hook` dài ba câu

- Vị trí: `$.overview.hook.text`
- Nguồn: —
- Vấn đề: `.claude/skills/lesson-author/SKILL.md` ghi "`hook`: một câu mở", cùng cách viết với "`whyItMatters`: một câu" (mà lint giữ đúng 1 câu). `docs/spec.md` và `src/content/lint/overview.ts` không giới hạn số câu của hook, nên `content:check` không bắt; luật soạn bài thì rõ. Hook hiện có ba câu (tình huống, hai kết quả, câu hỏi). Hình `hoa-don-hai-ban` đi kèm đã in sẵn hoá đơn, nên chữ không cần kể lại giá.
- Sửa: Một câu ngắn, dựa vào hình cho phần giá: "Cùng một hoá đơn, Nam tính ra hai mươi mốt nghìn, Lan ra hai mươi sáu nghìn: ai đúng?". Không gộp cả ba câu hiện có thành một câu dài.

## Góp ý

### 1. Nói rõ dấu "·" thay cho dấu "×" quen dùng ở tiểu học

- Vị trí: `$.sections[1].blocks[0].children[0].text`
- Nguồn: tr.24, `p24.png`
- Vấn đề: Không nhắc tới "×" thì trẻ khó nối kiến thức cũ với ký hiệu mới.
- Sửa: "Lớp 6 viết phép nhân bằng dấu chấm ở giữa hai số (thay cho dấu ×). Phép chia viết bằng hai chấm."

### 2. Mọi ví dụ và câu của `hoa-don` có dạng a · b + c, tính từ trái sang phải cũng ra đúng

- Vị trí: `$.sections[0]`; `$.exercises[0]`–`[3]`
- Nguồn: —
- Vấn đề: Section không kiểm được quy tắc "nhân trước".
- Sửa: Đưa ít nhất một câu kho ôn dạng c + a · b (ví dụ 7 + 3 · 4).

### 3. Chú thích "ở bài trước" thực ra là phần trước

- Vị trí: `$.sections[1].blocks[1].children[1].caption`
- Nguồn: —
- Vấn đề: Hoá đơn hai vở nằm ở section ngay trước của cùng bài.
- Sửa: "Hoá đơn hai vở ở phần trước viết là 2 · 8 + 5."

### 4. Nhãn đọc của hình hoá đơn viết "hóa đơn", JSON viết "hoá đơn"

- Vị trí: `label` của `StepPlayer` trong `HoaDonHaiBan` (`statics.tsx`: "Hai bạn tính cùng một hóa đơn")
- Nguồn: —
- Vấn đề: Nhãn này là nhãn đọc cho trình đọc màn hình (không hiện chữ trên ảnh visual mới), nhưng vẫn lệch kiểu bỏ dấu với `overview.hook`, `$.sections[0]` và glossary (kiểu "luỹ").
- Sửa: Đổi thành "hoá đơn".

### 5. Màn hướng dẫn chạm đứng sau màn cùng làm vốn đã bắt trẻ chạm

- Vị trí: `$.sections[2].blocks[2]` (`cong-tru-tu-lam`) và `$.sections[2].blocks[3]` (`huong-dan-cham-phep-tinh`)
- Nguồn: —
- Vấn đề: Trẻ chạm phép tính ở màn cùng làm rồi mới được hướng dẫn cách chạm.
- Sửa: Đổi chỗ hai khối. Vòng đen trong hình hướng dẫn và hình chạm còn đè lên chữ số hai bên (ảnh `034`, `036`); báo người làm visual.

### 6. Nhiễu "27" của `chon-tong-tien-keo` không ứng với lỗi nào hay gặp

- Vị trí: `$.exercises[0].options[3]`
- Nguồn: —
- Vấn đề: 30 và 13 ứng với lỗi thật; 27 thì không.
- Sửa: Thay bằng 12 (quên cộng chai nước) hoặc 42 = (3 + 4) · 6.

### 7. Ngân hàng số của `dien-chia-nhan` có một chip "8" cho hai ô cùng đáp án 8

- Vị trí: `$.exercises[15].bank`
- Nguồn: —
- Vấn đề: App cho dùng lại chip nên câu làm được, nhưng trẻ dễ nghĩ mỗi chip chỉ dùng một lần.
- Sửa: Để hai chip "8" trong `bank`.

### 8. Hình `nhan-chia-on` vẽ gạch ngang thay cho ghế và bạn; dòng kết quả tô vàng khác kiểu "Kết quả" của bài

- Vị trí: `$.sections[3].blocks[0].children[1]` (`visual.nhan-chia-on`, ảnh `…visual.nhan-chia-on-ipad.png`), các hình `chia-hoi-nguoc`, `nhan-hai-chu-so`
- Nguồn: —
- Vấn đề: Caption nói "6 hàng ghế, mỗi hàng 7 bạn" nhưng hình là 42 gạch ngang; dòng cuối của hình tách chục, hỏi ngược tô nền vàng, trong khi cả bài dùng chữ hổ phách gạch chân cho "Kết quả".
- Sửa: Vẽ ghế hay hình người nhỏ; tô kết quả theo kiểu hổ phách của concept `ket-qua`.

### 9. Bàn phím số hiện phím "mũ" ở câu không cần (việc của app)

- Vị trí: `$.exercises[12]`–`[14]` (ảnh `047-s4-04-exercise-nhan-7-8.png`)
- Nguồn: —
- Vấn đề: Phím "mũ" hiện ở 7 · 8, 63 : 9, 13 · 4, gây phân tâm.
- Sửa: Báo người làm app chỉ hiện phím "mũ" khi đáp án là luỹ thừa.

### 10. Nấc 1 của các câu tính tô cả biểu thức

- Vị trí: `hints.highlight` của `$.exercises[1]`, `[3]`, `[9]`, `[11]`, `[22]`, `[32]` (`\htmlId{bt}` bọc cả công thức)
- Nguồn: —
- Vấn đề: Không sai luật (các câu có `hintVisualId`), nhưng không chỉ ra chỗ hay sai.
- Sửa: Với câu `numeric`/`fillBlank`, bọc `\htmlId` quanh phần dễ sai (phép làm trước, hay phép chia ngoài ngoặc) rồi tô phần đó; câu `order` giữ nguyên để không lộ bước đầu.

### 11. Nhiễu "8" của `dien-buoc-hon-hop` không phản ánh lỗi hay gặp

- Vị trí: `$.exercises[25].bank`
- Nguồn: —
- Vấn đề: 8 là số chép từ đề; lỗi hay gặp với 25 − 15 + 8 là cộng trước, ra 2.
- Sửa: Đổi "8" thành "2".

### 12. Lựa chọn "50" của `chon-ket-qua-nhan-chia` không ứng với lỗi nào

- Vị trí: `$.exercises[20].options[2]`
- Nguồn: —
- Vấn đề: 10 và 20 là nhiễu tốt; 50 không ra từ cách tính sai quen thuộc nào của 100 : 5 · 2.
- Sửa: Thay bằng 200 (quên phép chia).

### 13. Hình gợi ý của câu "chạm phép tính làm trước" có cùng cấu trúc với đề

- Vị trí: `$.exercises[17]`, `[21]`, `[26]`, `[31]` `hints.hintVisualId` (`chon-phep-nhan-chia-goi-y`, `chon-phep-hon-hop-goi-y`, `chon-phep-ngoac-goi-y`, `chon-phep-ngoac-long-goi-y`)
- Nguồn: —
- Vấn đề: Đúng luật (số khác đề), nhưng khung hồng dòng đầu nằm đúng vị trí vùng đáp án của đề; trẻ chỉ cần chạm cùng chỗ.
- Sửa: Chọn biểu thức gợi ý có phép làm trước ở vị trí khác đề (ví dụ [(9 − 6) · 2] + 7).

### 14. Kết quả trùng số trong đề làm khó nhận ra số nào vừa tính

- Vị trí: recap `nhan-chia-tom-tat` (64 : 8 · 3, kết quả 8 trùng số chia); `$.exercises[29]` (`sap-buoc-ngoac`, 9 − 4 = 5 rồi 5 · 5)
- Nguồn: —
- Vấn đề: Trẻ theo dõi từng bước khó biết số nào vừa tính ra.
- Sửa: Đổi số, ví dụ 56 : 8 · 3 và 6 · (9 − 4) + 6.

### 15. Chữ hướng dẫn lặp hai lần ở màn cùng làm

- Vị trí: caption của visual `*-tu-lam` ở `$.sections[4..8]` ("Cùng làm: chạm phép tính làm trước.")
- Nguồn: —
- Vấn đề: Hình tương tác đã in "Chạm phép tính làm trước." ngay dưới biểu thức (ảnh `057-s5-04-block.png`); caption lặp lại.
- Sửa: Bỏ caption hoặc đổi thành nhắc quy tắc của section.

### 16. Chú thích hình gợi ý xếp ngoặc có mục không có trong hình

- Vị trí: `$.exercises[34].hints.hintVisualId` (`sap-thu-tu-ngoac-goi-y`, `[4+(8-3)]`)
- Nguồn: —
- Vấn đề: Chú thích liệt kê "Ngoặc nhọn { }" nhưng hình không có ngoặc nhọn.
- Sửa: Thêm lớp { } ngoài cùng (ví dụ {1 + [4 + (8 − 3)]}).

### 17. Câu luyện tập đầu của card ngoặc lồng dài so với mức 1

- Vị trí: `$.exercises[32]` (`tinh-ngoac-long-1`, `difficulty: 1`)
- Nguồn: —
- Vấn đề: 2 + [3 · (10 − 6) − 4] : 4 có năm phép tính và phép chia ngoài ngoặc trước khi cộng.
- Sửa: Dùng biểu thức ba, bốn phép (ví dụ 20 − [3 · (8 − 5)]) cho câu luyện tập đầu, chuyển câu hiện tại vào kho ôn mức 2.

### 18. Câu `sap-buoc-day-du` có một bước độc lập

- Vị trí: `$.exercises[50].items` (kho ôn)
- Nguồn: —
- Vấn đề: Bước `4 · 2 = 8` không dùng kết quả bước nào; trẻ tính đúng mà xếp khác có thể bị chấm sai.
- Sửa: Đổi biểu thức để mỗi bước dùng kết quả bước trước, ví dụ `2 \cdot 3^{2} - 4`.

### 19. Nhắc lỗi "2x với x = 3 thành 23"

- Vị trí: `$.sections[9].blocks[1]` (visual `chu-bo-dau-nhan`)
- Nguồn: tr.24 (`p24.png`)
- Vấn đề: Lỗi ghép số chỉ có trong nhiễu của câu kho ôn `chon-thay-so`; màn quy tắc chưa cảnh báo.
- Sửa: Thêm vế so sánh đúng/sai: "2x khi x = 3 là 2 · 3 = 6, không phải 23."

### 20. `summary` và `goals` không nhắc tới tìm số chưa biết

- Vị trí: `$.overview.summary`, `$.overview.goals`
- Nguồn: —
- Vấn đề: Bài có ba câu tìm x nhưng tổng quan không nói.
- Sửa: Gộp hai mục ngoặc và luỹ thừa thành một để thêm mục "tìm được số chưa biết trong một đẳng thức".

### 21. `sourceRef` của card `tim-so` nên thêm trang lời giải

- Vị trí: `$.cards[12].sourceRef`, `$.sections[10].sourceRef`
- Nguồn: tr.102 (`p102.png`)
- Vấn đề: Cách giải tìm x chỉ có ở trang lời giải tr.102.
- Sửa: "Sách bài tập tr.26, 102".
