# Review: Tập hợp các số nguyên (`tap-hop-cac-so-nguyen`)

- Bài: `content/math/kntt/tap-hop-cac-so-nguyen/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/tap-hop-cac-so-nguyen/` - sbt-p47, sbt-p48, sbt-p49, sbt-p111
- `content:check`: 0 lỗi, 1 cảnh báo của bài (91 id chưa có trong `ids.lock.json`, đúng với bài chưa duyệt)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi vòng toàn bài hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/tap-hop-cac-so-nguyen/`
- Kết luận: Chưa đạt: còn 4 lỗi Nghiêm trọng
- Bản đã review: `3e6a06fe69b085e272a9a79521b53bae56cdc1f2dca606ee5b6fe23ef15d0bb2` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

### 1. Bốn câu quy tắc gần nguyên văn ý 1, 2, 4, 6 của "Kiến thức cần nhớ"

- Vị trí (LL-08), mỗi câu kèm recap section và recap card lặp nguyên văn:
  - `$.sections[2].blocks[1].children[0].text` (`duong-am-khong`), `$.cards[2].recap.caption`: chỉ thay dãy "1; 2; 3; 4;…" bằng "1, 2, 3 và cứ thế tiếp", phần còn lại giữ từng chữ ý 1.
  - `$.sections[3].blocks[1].children[0].text` (`tap-hop-z`), `$.cards[3].recap.caption`: chỉ bỏ chữ "bao" của ý 2.
  - `$.sections[5].blocks[0].children[0].text` (`diem-bieu-dien`), `$.cards[5].recap.caption`: giữ khuôn hai gạch đầu dòng của ý 4, chỉ đổi "một khoảng bằng n" thành "n đơn vị" và bỏ "là điểm" (Tổng hợp phát hiện; cùng kiểu câu "điểm biểu diễn số a" đã ghi ở `thu-tu-trong-tap-hop-cac-so-tu-nhien`).
  - `$.sections[8].blocks[0].children[0].text` (`am-khong-duong`), `$.cards[8].recap.caption`: chỉ đổi "do đó" thành "nên" ở ý 6.
- Nguồn: tr.47, `sbt-p47.png`, ý 1, 2, 4, 6
- Vấn đề: câu trong khung "Kiến thức cần nhớ" là chỗ dễ chép nhất; bài không có lớp chữ `p*.txt` nên `[textbook-copy]` không chạy. Ba reviewer nhóm bắt được ba câu, câu thứ tư (ý 4) chỉ thấy khi đặt mọi câu quy tắc cạnh trang nguồn.
- Sửa: viết lại theo cách làm hay cách nhận ra, giữ `rule: true`, chép y hệt sang recap section và recap card; rồi tìm cả bài các `explain` còn lặp câu cũ. Gợi ý:
  - `duong-am-khong`: "Số nguyên dương là các số 1, 2, 3, 4 và lớn hơn nữa. Thêm dấu − đằng trước, ta được số nguyên âm: −1, −2, −3, −4." (sửa theo `$.exercises[10].explain.text`, `$.exercises[11].explain.text`).
  - `tap-hop-z`: "Gộp các số nguyên âm, số 0 và các số nguyên dương lại, ta được tập hợp các số nguyên, kí hiệu ℤ."
  - `diem-bieu-dien`: viết theo việc đếm, không dùng chữ n: "Số 3 nằm sau gốc O, cách O 3 đơn vị. Số −3 nằm trước gốc O, cũng cách O 3 đơn vị." (chọn một cách gọi khoảng cách, xem mục 8).
  - `am-khong-duong`: "Số nguyên âm nằm trước 0 trên trục số nên nhỏ hơn 0. Số 0 lại nhỏ hơn số dương, vì vậy số âm nhỏ hơn mọi số dương." (sửa theo `explain` của `so-sanh-100-voi-0` và các câu ở mục 39).

### 2. Hai câu dùng lại cặp số và lời giải của ví dụ 2a, 2b

- Vị trí: `$.exercises[38]` (`so-sanh-100-voi-0`, câu kiểm tra của `am-khong-duong`), `$.exercises[40]` (`chon-nhieu-nho-hon-1`) (LL-08)
- Nguồn: tr.48, `sbt-p48.png`, ví dụ 2 a), b) kèm lời giải
- Vấn đề: `so-sanh-100-voi-0` hỏi đúng cặp 0 và −100, `explain` nói lại lời giải a; `chon-nhieu-nho-hon-1` dựng trên cặp 1 và −19, `explain` nói lại lời giải b. Bàn giao ghi không lấy số của sách cho câu tự làm.
- Sửa: đổi số, vd "−60 và 0" (đổi id nếu id mang số; bài chưa khoá id) và lựa chọn −14, 0, 2, 9 với đề "nhỏ hơn 2"; viết `explain` theo câu quy tắc mới ở mục 1, không theo khuôn "Mọi số âm… Nói riêng…". Tránh số đã có trên màn dạy và hình (−4, 3, −5, 12) (LL-07).

### 3. Câu kho ôn "số liền sau của −8" cần thứ tự và phép cộng số nguyên chưa dạy ở card `tap-hop-z`

- Vị trí: `$.exercises[17]` (`dien-so-lien-sau`, card `tap-hop-z`) (LL-09)
- Nguồn: tr.47 không có "số liền sau" của số nguyên; thứ tự số âm là ý 5, 6
- Vấn đề: muốn ra −7 phải biết −7 lớn hơn −8 (dạy ở `so-sanh-truc`, `hai-so-am`) hoặc đi sang phải một vạch (dạy ở `truc-so`); `explain` "hơn số đó 1 đơn vị" là phép cộng số nguyên (bài sau). Câu gắn card của section 4 nên ra được ngay sau section 4; bé dễ chọn −9 trong ngân hàng vì 9 đứng sau 8.
- Sửa: gắn câu vào card `so-sanh-truc` và viết lại `explain` bằng trục số: "Số liền sau nằm ngay bên phải trên trục số. Bên phải −8 là −7."; hoặc thay ở card `tap-hop-z` bằng câu về ba nhóm của ℤ.

### 4. Số đối được nói theo ba cách, và mẹo "số đối của 0 là 0" trái câu quy tắc

- Vị trí: note `rule` `$.sections[6].blocks[1].children[0].text` (`so-doi`), recap section, `$.cards[6].recap.caption`; mẹo `$.sections[6].blocks[3]` (`tip.tim-so-doi`); `explain` của `$.exercises[28]` (`so-doi-cua-8`, cả `wrong` c "Chỉ số đối của 0 mới là 0"), `$.exercises[29]` (`noi-so-doi`), `$.exercises[30]` (`chon-cap-so-doi`), `$.exercises[32]` (`dien-so-doi-13`) (LL-05)
- Nguồn: tr.47 ý 4 (điểm n, điểm −n cách đều gốc O, nằm hai phía); tr.111 lời giải 3.9 (bài sau) dùng "phần số tự nhiên"; không trang nào có "số đối của 0 là 0"
- Vấn đề: câu quy tắc định nghĩa hai số đối là hai số "nằm hai bên gốc O", nên số 0 (ở ngay gốc O) không có số đối. Mẹo lại dạy "số đối của 0 là 0" bằng cách "đổi dấu", và `wrong` c của `so-doi-cua-8` khẳng định lại điều đó; các `explain` thêm cách nói thứ ba "cùng phần số nhưng khác dấu" (cũng loại số 0 vì 0 không có dấu). Bé gặp ba định nghĩa, hai trong đó nói ngược nhau ở số 0, và không biết tin câu nào. Ý "số đối của 0 là 0" không suy ra được từ trang nguồn (Reviewer nhóm 2 ghi Nên sửa; Tổng hợp nâng mức vì quy tắc và mẹo nói ngược nhau, bé nhớ sai một trong hai).
- Sửa: chọn một trong hai cách và dùng nhất quán ở note, recap, mẹo, `explain`:
  - Giữ số 0: thêm vào câu quy tắc một câu quy ước, chép nguyên văn sang recap section và card: "Hai số cách đều gốc O và nằm hai bên gốc O gọi là hai số đối nhau. Riêng số đối của 0 là chính nó." Mẹo chỉ nói cách tìm nhanh (xem mục 7), không đưa lý do "đổi dấu vẫn là 0".
  - Hoặc bỏ số 0 khỏi mẹo, `tex` (`0 \leftrightarrow 0`) và lựa chọn c của `so-doi-cua-8` (thay bằng nhiễu −7 hay −9).
  - Các `explain` nói số đối bằng đúng câu của quy tắc hay mẹo, không thêm cách thứ ba.

## Nên sửa

### 5. Câu luyện `dien-day-so-nguyen` lặp dãy của màn quy tắc và dựa vào thứ tự chưa dạy

- Vị trí: `$.exercises[15]` (`dien-day-so-nguyen`, practice của `tap-hop-z`) (LL-07, LL-09)
- Nguồn: tr.47, ý 2
- Vấn đề: dãy "−5; −4; _; −2; −1; 0; _; 2" chính là dãy trong công thức ℤ ở màn trước và hình recap `z-ba-phan`, nên bé chép lại. Đề "từ nhỏ đến lớn" và `explain` "hơn kém nhau 1" dùng thứ tự và phép tính chưa dạy tới section này. Nấc 1 tô cả khối lệnh "Chọn số điền vào hai chỗ trống".
- Sửa: đổi sang ý của section (điền "số nguyên âm"/"số 0"/"số nguyên dương" cho nhóm của một số, hay chọn số thuộc ℤ mà không thuộc ℕ với số khác màn quy tắc); nếu giữ dạng điền dãy thì đề "Điền tiếp theo thứ tự như khi viết tập hợp ℤ", bỏ "hơn kém nhau 1", chỉ tô khối đầu.

### 6. Câu `so-du-giam` dựng lại bài 3.2 của sách, giữ nguyên nhân vật

- Vị trí: `$.exercises[7]` (`so-du-giam`, card `so-am-doi-song`) (LL-08)
- Nguồn: tr.48, `sbt-p48.png`, bài 3.2; lời giải tr.111
- Vấn đề: "ông Tám", "tin nhắn ngân hàng", "số dư thay đổi" lấy từ bài 3.2, chỉ đổi số (khuôn trùng sách, số khác).
- Sửa: đổi tình huống và nhân vật, vd "Mẹ ghi vào sổ chi tiêu: −35 000 đồng tiền chợ".

### 7. Phần số sau khi bỏ dấu − có hai tên, một tên chưa được dạy; mẹo "giữ nguyên số và đổi dấu" đọc theo nghĩa đen là không đổi gì

- Vị trí: mẹo `$.sections[6].blocks[3].text` (`tip.tim-so-doi`), `$.sections[9].blocks[3].text` (`tip.so-sanh-hai-so-am`), `$.sections[10].blocks[2].text` (`tip.xep-tu-be-den-lon`); câu quy tắc `hai-so-am` ("Số nào còn lại"); `explain` của `so-doi-cua-8`, `noi-so-doi`, `chon-cap-so-doi`, `dien-so-doi-13`, `so-sanh-am-45-54` (wrong c), `so-nho-hon-130-120`, `so-nho-nhat-trong-bon`, `xep-5-so`, `so-nho-nhat-trong-bon-so` (LL-05, LL-25)
- Nguồn: tr.111 lời giải 3.9 ("phần số tự nhiên")
- Vấn đề: từ "phần số" xuất hiện 12 lần mà không note nào và glossary cũng không định nghĩa; câu quy tắc `hai-so-am` lại gọi cùng thứ đó là "số còn lại", mẹo tìm số đối gọi là "số" ("giữ nguyên số"). Với số 7 bé cũng không thấy "dấu" nào để đổi.
- Sửa: chọn tên "phần số", định nghĩa một lần ở màn đầu cần nó (section `so-doi`): "Bỏ dấu − của −12 thì được 12, gọi là phần số của −12. Phần số của 12 cũng là 12."; mẹo: "Muốn tìm số đối, giữ nguyên phần số, chỉ đổi dấu: số dương thì thêm dấu −, số âm thì bỏ dấu −."; câu quy tắc `hai-so-am` dùng đúng tên đó (xem mục 22), recap đổi theo.

### 8. Một khoảng cách gọi bằng ba từ: "vạch", "bước", "đơn vị"

- Vị trí: note quy tắc `diem-bieu-dien` và hình `diem-q-p`, `so-doi-5`, `doc-diem-giai` ("đơn vị"); `tip.dem-buoc` và hình `dem-buoc` ("bước"); note và hình `kien-4`, note cùng làm `truc-so` ("vạch"); `explain` của `dat-diem-a-am-2`, `doc-diem-n`, `noi-diem-so`, `doc-diem-m`, `chon-diem-am-5`, `dat-ba-diem`, chữ `done` của `dat-diem-a-am-3` (LL-05)
- Nguồn: tr.47 ý 4 ("một khoảng bằng n"), tr.49 bài 3.5 ("16 đơn vị")
- Vấn đề: màn `086` ghi "4 vạch", màn `087` ngay sau ghi "5 đơn vị"; ở section 6 quy tắc nói "đơn vị", mẹo "đếm số bước" và "đừng đếm vạch của gốc O" trộn hai cách đếm trong một câu. Bé chậm nghĩ đây là ba cách đếm khác nhau.
- Sửa: "đơn vị" là tên khoảng giữa hai vạch liền nhau (như hình `truc-so-ve` đã ghi "1 đơn vị"); thao tác đếm viết một kiểu, vd "đếm số đơn vị từ gốc O tới điểm". Sửa nhãn hình `dem-buoc`, `kien-4`, chữ mẹo và các `explain` theo cách đã chọn.

### 9. Quy tắc so sánh thiếu "trong hai điểm", dễ đọc thành "điểm nằm trước gốc O"

- Vị trí: `$.sections[7].blocks[0].children[0].text` (`so-sanh-truc`), recap section, `$.cards[7].recap.caption` (LL-10)
- Nguồn: tr.47 ý 5
- Vấn đề: "điểm nằm trước biểu diễn số nhỏ hơn" không nói nằm trước điểm nào; hai section trước vừa dạy "số âm nằm trước O", nên bé dễ đọc thành "nằm trước gốc O thì nhỏ hơn" và không so sánh được −6 với −2.
- Sửa: "Trong hai điểm trên trục số, điểm nằm trước biểu diễn số nhỏ hơn, điểm nằm sau biểu diễn số lớn hơn." (đổi cùng recap section và card; viết lại khác câu sách nếu cần, xem mục 1).

### 10. "Trước, sau" và "trái, phải" dùng lẫn mà không câu nào nối hai cách gọi

- Vị trí: quy tắc `truc-so`, `diem-bieu-dien`, `so-sanh-truc` ("trước", "sau"); note cùng làm `diem-bieu-dien` ("Số dương đi sang phải, số âm đi sang trái"), `tip.dem-buoc` ("đi sang trái thì số có dấu −"), `$.cards[10].recap.caption` ("từ trái sang phải thì lớn dần"), lựa chọn của `phia-cua-goc-o` (LL-05)
- Nguồn: tr.47 ý 3, 4, 5
- Vấn đề: quy tắc chỉ nói "trước O", "sau O"; màn cùng làm, mẹo và recap card `sap-xep` lại nói "trái", "phải". Câu "trước là bên trái" không có trên màn nào, chỉ suy được từ vị trí nhãn trong hình. Bé ôn card `sap-xep` gặp một quy tắc với tên khác. Reviewer nhóm 2 ghi Góp ý; Tổng hợp nâng mức vì cùng khái niệm mang hai tên ở quy tắc, mẹo và recap của ba section.
- Sửa: thêm vào quy tắc `truc-so` (và recap) một vế nối: "Trục số có gốc O ứng với số 0. Số dương nằm sau O, bên phải. Số âm nằm trước O, bên trái."; từ đó các câu khác dùng một cặp từ, hoặc nói cả hai như quy tắc.

### 11. Hai màn cùng làm bảo nhìn trục số, nhưng màn không có trục số

- Vị trí: `$.sections[7].blocks[1]` (hình `chon-lon-hon-am-2`, `so-sanh-truc`), `$.sections[6].blocks[2]` (hình `chon-doi-6`, `so-doi`) (LL-22)
- Nguồn: —
- Vấn đề: màn `099` viết "nằm sau −2 trên trục số" nhưng chỉ có bốn ô số, không có trục và không có −2; màn `088` "cách gốc O 6 đơn vị, ở bên kia gốc O" cũng không có trục. Ở `chon-lon-hon-am-2`, đáp án là số dương duy nhất nên bé chọn đúng mà không cần trục.
- Sửa: đổi hai hình sang `lineTap` trên trục số có tô mốc −2 (hay 6, mở rộng trục); thêm một số âm lớn hơn −2 (như −1) vào `chon-lon-hon-am-2`.

### 12. Note nói con kiến, hình chỉ có hai điểm A, B mà chữ không nhắc

- Vị trí: `$.sections[6].blocks[0]` (note và hình `kien-4`, `so-doi`) (LL-15)
- Nguồn: tr.49 bài 3.5
- Vấn đề: note kể con kiến đi 4 vạch, hình (màn `086`) chỉ có hai ô A, B, không có con kiến; bé phải tự đoán A, B là chỗ kiến dừng.
- Sửa: vẽ con kiến (hay chấm có nhãn "kiến") ở hai chỗ dừng, hoặc bỏ tên A, B và ghi nhãn "kiến dừng ở 4", "kiến dừng ở −4".

### 13. Bài chưa có màn mẫu đọc cột nhiệt kế trước câu luyện đọc nhiệt kế

- Vị trí: `$.sections[0].blocks[0]` (hình `nhiet-ke-buoc`), recap `nhiet-ke-tom-tat`, `$.exercises[1]` (`doc-nhiet-ke`) (LL-16, LL-15)
- Nguồn: —
- Vấn đề: ở hình mẫu (ảnh `006-s1-01-block`, `007-s1-01-block-end`, `021-s1-06-recap`) cột nhiệt kế luôn đứng ở 0 trong khi nhãn ghi 3 °C và −3 °C; câu `doc-nhiet-ke` lại bắt đọc theo đỉnh cột, việc chưa màn nào làm mẫu.
- Sửa: bước 1 cột ở 3, bước 2 hạ cột xuống −3 kèm nhãn "Cột dừng ở −3: nhiệt kế chỉ −3 °C"; hình recap không để cột ở 0 khi ghi ±3.

### 14. Năm section không có ví dụ đời sống

- Vị trí: `duong-am-khong`, `tap-hop-z`, `truc-so`, `diem-bieu-dien`, `so-sanh-truc` (mọi khối và exercise của các section này) (LL-16)
- Nguồn: —
- Vấn đề: luật "Ví dụ đời sống ở mọi section Toán" chưa đạt: các section này chỉ có số trơn và trục số; section 1, 2 có nhiệt kế, tầng hầm, tiền nợ nhưng không được nối lại.
- Sửa: mỗi section một ví dụ hay một câu, số nhỏ: `duong-am-khong` "Nhiệt độ sáng nay của bốn thành phố: 3, −2, 0, −5 độ C. Chọn tất cả nhiệt độ là số nguyên âm."; `tap-hop-z` gom −3 tầng, 30 nghìn đồng, 0 độ vào ba nhóm của ℤ; `truc-so` nhắc nhiệt kế là trục số đặt dọc; `diem-bieu-dien` đọc mực nước −3 m trên thước đo; `so-sanh-truc` "−3 độ C và 2 độ C, trời nào lạnh hơn?" kèm trục số.

### 15. Section `tap-hop-z` không có màn cùng làm trước câu tự làm

- Vị trí: `$.sections[3].blocks` (`tap-hop-z`) (LL-16)
- Nguồn: —
- Vấn đề: section 1, 2, 3 đều có màn "Cùng làm"; section 4 đi thẳng từ quy tắc sang câu kiểm tra `so-nguyen-khong-tu-nhien`.
- Sửa: thêm màn `chips` "Cùng làm: chạm vào số là số nguyên nhưng không phải số tự nhiên. Số nguyên âm thì không phải số tự nhiên." với số khác câu kiểm tra (vd 9, −2, 0, 14).

### 16. Màn mở đầu của năm section chỉ có hình, không một dòng chữ

- Vị trí: `$.sections[0].blocks[0]`, `$.sections[1].blocks[0]`, `$.sections[2].blocks[0]`, `$.sections[4].blocks[0]` (hình `truc-so-ve`), `$.sections[9].blocks[0]` (hình `lanh-hon`); `$.sections[10].blocks[0]` xem mục 19
- Nguồn: —
- Vấn đề: ảnh `006-s1-01-block`, `023-s2-01-block`, `034-s3-01-block`, `057`, `119-s10-01-block`: bé thấy nhiệt kế, toà nhà, trục số mà không biết đang xem gì. Ở `hai-so-am`, ý "−7 < −2" chỉ nằm trong nhãn trợ năng của hình. Hình ở section 3 là trục số có gốc O, hai section trước khi trục số được dạy. (Nhóm 1, 2 ghi Góp ý, nhóm 3 ghi Nên sửa; giữ mức cao hơn.)
- Sửa: đặt mỗi hình trong `group` kèm một `note` ngắn, vd "Toà nhà có tầng ở trên mặt đất và tầng hầm ở dưới mặt đất."; `hai-so-am`: "Trời −7 độ C lạnh hơn trời −2 độ C, vì vạch −7 nằm thấp hơn. Vậy −7 nhỏ hơn −2." kèm `formula` `\concept{blue}{-7} < \concept{violet}{-2}`; section 3 thay trục số bằng ba hàng số như hình `z-ba-phan`, hoặc không gọi tên trục số.

### 17. Câu `chon-x-tan-cung-2`: điều kiện "tận cùng là 2" không loại lựa chọn nào, bốn lựa chọn là bốn số đầu của lời giải 3.6

- Vị trí: `$.exercises[54].options` (`chon-x-tan-cung-2`) (LL-14, LL-08)
- Nguồn: tr.49 bài 3.6, lời giải tr.111
- Vấn đề: cả bốn lựa chọn −12, −2, 2, 12 đều tận cùng là 2, nên câu chỉ kiểm dấu < ở −12; khuôn bài 3.6 chỉ cắt bớt khoảng.
- Sửa: đổi chữ số tận cùng và khoảng, thêm nhiễu bị loại bởi từng điều kiện, vd "x có chữ số tận cùng là 5" với `-15 < x \le 15`, lựa chọn −15, −5, 5, 15, −25, 3; đáp án −5, 5, 15; câu ghi chú đổi theo.

### 18. Câu `chon-x-giua-3-0` thiếu −1 trong lựa chọn mà `explain` nói "Hai số −2 và 0 thoả"

- Vị trí: `$.exercises[50].prompt[0]`, `$.exercises[50].explain.text` (`chon-x-giua-3-0`) (LL-10)
- Nguồn: —
- Vấn đề: các số nguyên thoả `-3 < x \le 0` là −2, −1, 0; màn cùng làm ngay trước dạy chọn đủ cả khoảng. Bé liệt kê đúng sẽ tìm −1 không thấy, và lời giải khiến bé nghĩ −1 không thoả.
- Sửa: thêm lựa chọn −1 vào đáp án, hoặc đề "Trong các số dưới đây, chọn tất cả số nguyên x thoả mãn điều kiện." và `explain` "Các số nguyên x là −2, −1 và 0. Trong các lựa chọn có −2 và 0."

### 19. Section `sap-xep-liet-ke`: cách sắp xếp không được nói thành chữ; recap section bỏ mất ý sắp xếp, lệch recap card

- Vị trí: `$.sections[10].blocks[0]` (hình `xep-hang` đứng một mình), `$.sections[10].recap`, `$.cards[10].recap.caption` (`sap-xep`) (LL-06)
- Nguồn: tr.47 ý 7, tr.49 bài 3.6
- Vấn đề: màn `132`, `133` chỉ có trục số với bốn điểm hiện lần lượt. Câu "các số xếp từ trái sang phải thì lớn dần" chỉ có ở recap card `sap-xep` (bé gặp lần đầu khi ôn), recap section chỉ có quy tắc ≤, ≥. Cách làm duy nhất bé đọc được là khối mẹo "làm nhanh", nên mẹo đứng thay cho cách làm thường. Section gộp hai ý cần nhớ mà recap giữ một.
- Sửa: thêm `note` `rule: true` cạnh hình `xep-hang`, vd "Trên trục số, số nằm sau lớn hơn số nằm trước. Vì vậy đọc các điểm từ trái sang phải là được các số từ bé đến lớn.", cho recap card `sap-xep` lặp nguyên văn câu đó; hoặc tách thành hai section `sap-xep`, `liet-ke` khớp hai card.

### 20. Mẹo "Xếp các số từ bé đến lớn" chỉ nói số âm nào đứng đầu

- Vị trí: `$.sections[10].blocks[2]` (`tip.xep-tu-be-den-lon`)
- Nguồn: —
- Vấn đề: "Trong nhóm số âm, số có phần số lớn nhất đứng đầu" chỉ xác định số đầu; với ba số âm trở lên bé có thể xếp phần còn lại theo thói quen số dương (−11, −2, −7). Thứ tự ba nhóm chỉ thấy qua `tex`. Reviewer nhóm 3 đã thử các bộ {3, −9, 0, −4, 8}, {−1, −10}, {0, 3, 1}, {−20, 20, 0}, {−1, 1}: đúng; {−7, −2, −11, 5}, {−3, −30, −13, 0}: chữ không nói thứ tự các số âm sau số đầu. Bài chưa có câu nào ba số âm nên chưa ra sai.
- Sửa: "Xếp số âm trước, rồi số 0, rồi số dương. Các số âm xếp theo phần số từ lớn đến bé." và ví dụ có ba số âm, vd `-9 < -6 < -4 < 0 < 3 < 8` (đổi số câu ở mục 25 theo).

### 21. Quy tắc ≤, ≥ trùng ý 7 và không dạy cách đọc dấu ≤, ≥ hay điều kiện kép

- Vị trí: `$.sections[10].blocks[1].children[0].text`, recap section, `$.cards[11].recap.caption` (`liet-ke`); màn cùng làm `$.sections[10].blocks[3]` (LL-08)
- Nguồn: tr.47 ý 7
- Vấn đề: câu trùng ý 7 (chỉ đổi ";" thành "."); câu thuần kí hiệu ngắn tự nó chỉ là Góp ý, nhưng câu thiếu điều bé cần: bài dạy "Dấu < đọc là nhỏ hơn" mà không có "Dấu ≤ đọc là nhỏ hơn hoặc bằng", trong khi `wrong` của `chon-dau-nho-hon-bang` dùng sẵn cách đọc đó; màn cùng làm cho `-2 < x \le 1` mà không đọc thành lời.
- Sửa: "Dấu ≤ đọc là nhỏ hơn hoặc bằng: a ≤ b đúng khi a < b, và cũng đúng khi a = b. Dấu ≥ đọc là lớn hơn hoặc bằng." (recap đổi theo); thêm vào note cùng làm "Điều kiện này đọc là: x lớn hơn −2 và x nhỏ hơn hoặc bằng 1."

### 22. Câu quy tắc so sánh hai số âm có cụm "Số nào còn lại" đọc được hai cách

- Vị trí: `$.sections[9].blocks[1].children[0].text`, recap section, `$.cards[9].recap.caption` (`hai-so-am`) (LL-10)
- Nguồn: tr.47 ý 6
- Vấn đề: trong lời nói hằng ngày "số còn lại" là "số kia", nên bé có thể đọc "số kia lớn hơn thì số âm này nhỏ hơn", tức hiểu ngược; "số âm đó" không rõ trỏ về số nào.
- Sửa: "Muốn so sánh hai số âm, bỏ dấu − của cả hai số rồi so sánh phần số. Số âm nào có phần số lớn hơn thì nhỏ hơn." (dùng tên "phần số" như mục 7; `rule: true`, recap đổi theo).

### 23. `explain` của `chon-so-sanh-sai-hai-am` lập luận ngược

- Vị trí: `$.exercises[46].explain.text` (`chon-so-sanh-sai-hai-am`)
- Nguồn: —
- Vấn đề: "Bỏ dấu − thì 6 nhỏ hơn 3 là sai, vì 6 lớn hơn 3." ngầm đổi "−6 > −3" thành "6 < 3", bước bài không dạy, và có hai lần "sai" chồng nhau; các `wrong` cùng câu đi đúng chiều quy tắc.
- Sửa: "Bỏ dấu − thì 6 lớn hơn 3, nên −6 nhỏ hơn −3. Vì vậy −6 > −3 là phép so sánh sai."

### 24. `explain` của `chon-dau-nho-hon-bang` nói "khi hai số nhỏ hơn hoặc bằng nhau"

- Vị trí: `$.exercises[48].explain.text` (`chon-dau-nho-hon-bang`)
- Nguồn: —
- Vấn đề: không nói số nào nhỏ hơn số nào; bé có thể hiểu ≤ là "hai số bằng nhau".
- Sửa: "a ≤ b đúng khi a nhỏ hơn b hoặc a bằng b. Hai số −2 và −2 bằng nhau nên −2 ≤ −2 đúng."

### 25. Câu `so-nho-nhat-trong-bon-so` dùng đúng bộ số của ví dụ trong mẹo ngay trước

- Vị trí: `$.exercises[52].prompt[0]` (`so-nho-nhat-trong-bon-so`), `$.sections[10].blocks[2].tex` (LL-07)
- Nguồn: —
- Vấn đề: mẹo hiện `-9 < -4 < 0 < 3 < 8`; câu hỏi là bốn số trong đó, bé chỉ cần nhớ số đầu dòng mẹo.
- Sửa: đổi số câu hỏi, vd "−6; 0; 2; −11" (không trùng ví dụ mới của mẹo ở mục 20).

### 26. Nhiễu −33 ở `chon-3-tang-ham` vô lý

- Vị trí: `$.exercises[4].options[3]` (`chon-3-tang-ham`) (LL-14)
- Nguồn: —
- Vấn đề: không cách nghĩ sai nào dẫn từ "dưới mặt đất 3 tầng" tới −33; bé loại ngay.
- Sửa: đổi thành nhiễu theo lỗi đếm tầng, vd −2 hay −4, và thêm `wrong` cho nó.

## Góp ý

### 27. "Số nguyên âm là số có dấu − đằng trước" nói như định nghĩa thứ hai

- Vị trí: `$.exercises[9].explain.text` (`chon-so-nguyen-am`), `$.exercises[12].explain.text` (`chon-nhieu-am-trong-day`) (LL-05)
- Nguồn: tr.47 ý 1
- Vấn đề: hai `explain` dùng "là" nên đọc như một định nghĩa khác câu quy tắc; màn cùng làm đã viết đúng dạng dấu hiệu.
- Sửa: "Số nguyên âm có dấu − đằng trước." ở cả hai câu.

### 28. "Số âm" và "số nguyên âm" dùng lẫn mà không câu nào nói là một

- Vị trí: quy tắc `nhiet-do`, `so-am-doi-song`, `truc-so`, `hai-so-am` ("số âm", "số dương"); quy tắc `duong-am-khong`, `tap-hop-z`, `am-khong-duong` ("số nguyên âm", "số nguyên dương") (LL-05)
- Nguồn: tr.47 ý 1 (sách dùng cả hai)
- Vấn đề: section 1 dạy "số âm", section 3 dạy "số nguyên âm" như khái niệm mới; bé chậm có thể nghĩ là hai loại số. Cả hai đều có trong glossary nên không sai.
- Sửa: thêm vào note `duong-am-khong` một câu không đánh `rule`: "Số nguyên âm còn gọi gọn là số âm, số nguyên dương gọi gọn là số dương."

### 29. Ngân hàng từ của `doc-so-am-8` thiếu nhiễu "trừ"

- Vị trí: `$.exercises[3].bank` (`doc-so-am-8`)
- Nguồn: —
- Vấn đề: lỗi hay gặp nhất là đọc −8 thành "trừ tám", nhưng ngân hàng không có "trừ".
- Sửa: thay "không" bằng "trừ"; thêm vào `explain` "Chữ trừ dùng cho phép tính, còn số có dấu − đằng trước đọc là âm."

### 30. Tên hình `chon-4-duoi-0` lệch nội dung (6 độ dưới 0)

- Vị trí: `$.sections[0].blocks[2].children[1].visualId`
- Nguồn: —
- Vấn đề: hình và câu cùng làm hỏi 6 độ dưới 0 nhưng id ghi 4; người sửa sau dễ nhầm.
- Sửa: đổi id thành `chon-6-duoi-0` (cả `catalog.ts`) trước khi khoá id.

### 31. Lựa chọn là số mà viết dạng chữ nên nhỏ, dấu − khó thấy

- Vị trí: `$.exercises[10].options`, `$.exercises[12].options`, `$.exercises[16].options`
- Nguồn: —
- Vấn đề: ảnh `041-s3-05-exercise-chon-tat-ca-duong`: số trong lựa chọn `text` nhỏ và mảnh hơn số `formula` ở câu ngay trước.
- Sửa: viết các lựa chọn số bằng `formula`.

### 32. Đáp án nhiễu yếu

- Vị trí: `so-doi-cua-8` lựa chọn d (−80); `diem-lon-hon-ab` lựa chọn c ("Hai số bằng nhau"); `chon-so-sanh-dung-6-3` lựa chọn c (−6 = 3) (LL-14)
- Nguồn: —
- Vấn đề: ít bé chọn, câu dễ hơn mức cần.
- Sửa: `so-doi-cua-8` thay −80 bằng −7 hay −9; hai câu kia thay bằng nhiễu theo lỗi hay gặp.

### 33. So sánh hai số âm không có trục số trên màn, trước khi section `hai-so-am` dạy

- Vị trí: `chon-so-sanh-sai`, `chon-nhieu-nho-hon-am-1`, `chon-so-sanh-dung-6-3` (−6 ngoài trục −5..5 bé vừa xem)
- Nguồn: —
- Vấn đề: bé phải tự hình dung vị trí của −6, −5; suy ra được từ quy tắc section 6 và 8 nên không chặn bài.
- Sửa: đặt trục số −6..5 vào đề, hoặc dùng số trong khoảng −5..5 đã thấy.

### 34. Màu so sánh trong hình khác màu trong công thức

- Vị trí: hình `so-sanh-buoc`, `so-sanh-xong` (A, B cùng amber); công thức `\concept{blue}{-3} < \concept{violet}{2}` cùng section
- Nguồn: —
- Vấn đề: cùng cặp −3 và 2, hình tô amber cả hai, công thức tô xanh dương và tím.
- Sửa: trong hai hình, tô A màu blue, B màu violet.

### 35. Hai điểm P, Q ở `doc-diem-mnpq` sát nhau, nhãn nhỏ trên điện thoại

- Vị trí: hình `doc-diem-mnpq` (màn `076`)
- Nguồn: —
- Vấn đề: P (−6) và Q (−5) gần dính nhau; trên điện thoại khó đếm vạch.
- Sửa: bỏ P hoặc Q, hoặc dời một điểm cho thoáng.

### 36. Mẹo "So sánh hai số âm" phần lớn nói lại câu quy tắc

- Vị trí: `$.sections[9].blocks[3]` (`tip.so-sanh-hai-so-am`)
- Nguồn: —
- Vấn đề: "Số âm có phần số càng lớn thì càng nhỏ" là quy tắc viết bằng chữ khác; phần có ích là vế cảnh báo và hình ảnh nhiệt độ. Reviewer nhóm 3 đã thử (−12, −2), (−1, −2), (−10, −9), (−100, −1), (−5, −50), (−3, −3): đúng cả.
- Sửa: giữ vế cảnh báo, đổi câu sau thành cách tự kiểm tra: "Muốn chắc, hãy nghĩ tới nhiệt kế: −12 độ C nằm thấp hơn −2 độ C nên lạnh hơn."

### 37. Viết "thỏa" và "thoả" lẫn nhau

- Vị trí: `$.sections[10].blocks[3].children[0].text`, đề `chon-x-giua-3-0`, `dem-so-nguyen-x`, `chon-x-tan-cung-2` ("thỏa") và `explain` `chon-x-giua-3-0` ("thoả")
- Nguồn: —
- Vấn đề: hai cách bỏ dấu trong một section; các bài Toán khác viết "thoả".
- Sửa: thống nhất "thoả".

### 38. Câu quy tắc ≤, ≥ xuống dòng để "b." đứng một mình trên iPad

- Vị trí: `$.sections[10].blocks[1].children[0]`; ảnh `134-s11-02-block`, `147-s11-08-recap`
- Nguồn: —
- Vấn đề: dòng thứ hai chỉ còn "b.".
- Sửa: viết lại câu theo mục 21 rồi xem lại sheet iPad.

### 39. Lời giải nhắc "số âm nhỏ hơn số dương" bằng nhiều câu khác nhau

- Vị trí: `explain` của `so-lon-hon-am-25-4`, `chon-so-sanh-sai-am-duong`, `chon-nhieu-nho-hon-1`, `so-nho-nhat-trong-bon-so` (LL-05)
- Nguồn: —
- Vấn đề: không câu nào sai, nhưng bé gặp bốn cách nói của cùng quy tắc ngoài câu quy tắc chính.
- Sửa: sau khi viết lại câu quy tắc (mục 1), các lời giải dùng đúng một cụm ngắn của nó.
