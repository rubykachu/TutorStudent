# Review: Tập hợp (`tap-hop`)

- Bài: `content/math/kntt/tap-hop/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/tap-hop/` - p5, p6, p94 (sách bài tập tr.5, tr.6, lời giải tr.94)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (77 id chưa có trong `ids.lock.json`)
- `lesson:walk`: 0 FAIL, không có báo cáo cảnh báo lưu lại, ảnh trong `.shots/walk/tap-hop/`
- Kết luận: Chưa đạt: còn 3 lỗi Nghiêm trọng
- Bản đã review: `8cc3ca13548b147156c5430e6cbc148f2014ad672a7a99ae7379c3314820d8fd` (`pnpm content:diff` so với bản này)

Phạm vi "thang kí hiệu" (móc nối đời thường, cách đọc, viết từng nét, chạm chấm, điền chip): ba nhóm cùng chấp nhận, không ghi "không có trong sách". Đây là phần đỡ thao tác viết theo `docs/learner.md` (chưa viết được { }, ∈, ∉), không thêm kiến thức toán; các dấu { } ; ∈ ∉, cách đọc, vạch đứng | và ℕ đều có ở tr.5–6. Mọi exercise đã được tự giải trước khi đọc `answer`: đáp án đều đúng, chỗ lệch duy nhất là cách chấm theo thứ tự phần tử (mục 3).

## Nghiêm trọng

### 1. Chỉ đáp án đúng được tô màu phần tử, trẻ chọn theo màu

- Vị trí: `$.exercises[17].options` (`tap-hop.ex.chon-viet-dung`)
- Nguồn: tr.5, `p5.png`
- Vấn đề: lựa chọn a tô amber 4, 5, 6; hai nhiễu `{4, 5, 6}` và `{4.5.6}` để đen (ảnh `ipad/045-s3-05-exercise-chon-viet-dung.png`). Điểm khác thật giữa ba lựa chọn chỉ là một dấu nhỏ, còn màu thì nổi bật, nên màu thành đáp án: trẻ chọn dòng có số màu cam mà không cần nhận ra dấu ; (trái tinh thần luật "màu không được là đáp án" trong `pitfalls.md`). Đã kiểm lại JSON và ảnh: giữ mức Nghiêm trọng.
- Sửa: tô amber cả 4, 5, 6 ở mọi lựa chọn (như `kt-ngoac-dung`), hoặc bỏ màu ở cả ba.

### 2. Ví dụ màn quy tắc dấu chấm phẩy chép nguyên tập hợp của sách

- Vị trí: `$.sections[2].blocks[0].children[1]` (visual `tap-hop.visual.cham-phay-vi-du`, section `tap-hop.section.dau-cham-phay`)
- Nguồn: tr.5, `p5.png` (tập P trong ví dụ)
- Vấn đề: hình vẽ đúng bộ số của tập P trong ví dụ sách bài tập (ảnh `ipad/039-s3-01-block.png`). Ví dụ trùng nguyên văn sách là Nghiêm trọng. Đã đối chiếu ảnh trang: giữ mức.
- Sửa: đổi bộ số, vẫn giữ một số thập phân để minh hoạ lý do không dùng dấu phẩy, ví dụ {2; 4,5; 9}; kiểm để không trùng số với `kt-dau-giua`, `chon-viet-dung`, kho ôn và lời note (note đang nêu 7,5, nên đổi theo).

### 3. Bài viết tập hợp chấm sai khi trẻ viết phần tử theo thứ tự khác

- Vị trí: `$.exercises[32].segments` (`kt-ghep-hai-phan-tu`), `$.exercises[33].segments` (`ghep-ba-phan-tu`), `$.exercises[34].items` (`xep-ghep-tap-hop`, `order`), `$.exercises[37].segments` (`ghep-quy-ba`), `$.exercises[45].segments` (`dien-liet-ke-tu-dau`), `$.exercises[51].segments` (`dien-liet-ke-chan`)
- Nguồn: tr.5 (kiến thức cần nhớ 2), tr.6 (bài 1.3, 1.4), `p5.png`, `p6.png`
- Vấn đề: tập hợp không phụ thuộc thứ tự phần tử, nhưng mỗi ô chỉ nhận một phần tử cố định (`src/exercises/grade/fill-blank.ts` so từng ô với `accept`) và `order` chỉ nhận đúng một thứ tự (`src/exercises/grade/order.ts`). Trẻ viết {8; 5}, {9; 4}, {8; 7; 6}... là đúng nhưng bị báo sai rồi được xem "đáp án", nên học sai rằng tập hợp phải theo thứ tự cố định; câu `order` có hai đáp án đúng mà chỉ chấm một. Không vá được bằng `accept` (cho mọi ô nhận cả 5 lẫn 8 thì {5; 5} thành đúng). Nhóm 3 xếp `[45]`, `[51]` là Nên sửa theo luật "fillBlank thiếu cách viết đúng khác"; gộp lên Nghiêm trọng vì cùng một lỗi, ảnh hưởng tới hiểu biết về tập hợp chứ không chỉ cách viết.
- Sửa: áp một cách cho cả sáu câu: (a) đề chốt thứ tự ("…theo thứ tự từ bé đến lớn", "…theo thứ tự các tháng trong năm"); hoặc (b) với câu fillBlank, cho sẵn phần tử dạng chữ trong `segments`, chỉ để trống { ; } (vd `K = [ ] 5 [ ] 8 [ ]`). Câu `order` dùng cách (a).

## Nên sửa

### 4. Lời dạy đồng nhất "tập hợp" với cái hộp

- Vị trí: `$.sections[0].blocks[1].children[0].text` ("như hộp bút hay đội bóng"), `$.cards[0].recap.caption` ("như hộp bút"), `$.exercises[3].prompt[0].text` (`cham-tap-hop`), `$.exercises[21].prompt[0].text` (`kt-cham-thuoc`: "bút thuộc hộp bút"), `$.exercises[26].prompt[0].text` (`kt-cham-khong-thuoc`), nhãn "hộp" trong visual `chon-hop-but`, `chon-do-dung`
- Nguồn: tr.5
- Vấn đề: tập hợp là nhóm các đồ trong hộp, không phải chiếc hộp. `overview.hook` nói đúng ("cả nhóm đồ trong hộp chính là một tập hợp") nhưng note, recap card và các đề trên gọi chính cái hộp là tập hợp: hook lệch note và recap. Trẻ dễ nhớ "tập hợp = cái hộp".
- Sửa: note "…, như các đồ trong hộp bút hay các bạn trong đội bóng."; recap card "…, như các đồ trong hộp bút."; `cham-tap-hop` "Chạm vào khung bao quanh cả nhóm đồ."; hai câu kiểm tra thuộc: "bút thuộc nhóm đồ trong hộp bút".

### 5. Nhiễu "một ngoặc nhọn" dùng từ chưa học

- Vị trí: `$.exercises[0].options[2]` (`kt-phan-tu-hop-but`)
- Nguồn: tr.5
- Vấn đề: câu kiểm tra section 1, trẻ chưa gặp "ngoặc nhọn" (dạy ở section 2); nhiễu không phản ánh lỗi hay gặp.
- Sửa: thay bằng nhiễu cùng tầng nghĩa, như "cả hộp bút".

### 6. Câu điền chip xuất hiện trước màn dạy thao tác chip

- Vị trí: `$.exercises[4]`, `[12]`, `[14]`, `[15]`, `[19]` (kho ôn của card section 1–3); màn dạy ở `$.sections[5].blocks[2]` (`huong-dan-chip`)
- Nguồn: —
- Vấn đề: bộ ôn (`src/srs/select.ts`) có thể đưa các câu điền chip ngay sau section 1–3, trong khi thao tác "chạm kí hiệu rồi chạm ô trống" chỉ được dạy ở section 6. Vi phạm "dạy thao tác nhập trước lần dùng đầu".
- Sửa: chuyển màn hướng dẫn chip lên section `ngoac-nhon` (gộp màn khác để giữ ≤ 4 màn); section 6 chỉ nhắc bằng `caption`.

### 7. Câu chạm vùng đầu tiên không có màn hướng dẫn chạm

- Vị trí: `$.exercises[8]` (`kt-cham-ngoac-mo`, câu `tapRegion` đầu tiên trong luồng section); cả `$.exercises[3]` (`cham-tap-hop`, kho ôn)
- Nguồn: —
- Vấn đề: bài chưa dạy thao tác chạm vùng trước lần dùng đầu.
- Sửa: thêm câu hướng dẫn ngắn vào màn tương tác sẵn có (vd `caption` của `$.sections[0].blocks[3]`) hoặc một màn chạm mẫu với hình khác đề.

### 8. Bài chạm chấm: vòng số che mũi nhọn của dấu ngoặc

- Vị trí: `$.exercises[9]` (visual `tap-net-ngoac-mo`), `$.exercises[10]` (visual `tap-net-ngoac-dong`), màn `ve-mo-ngoac` bước 1 (`$.sections[1].blocks[1]`)
- Nguồn: —
- Vấn đề: ảnh `ipad/030-s2-07-exercise-viet-ngoac-mo.png`, `ipad/035-s2-08-exercise-viet-ngoac-dong.png`, `ipad/018-s2-02-block.png`: vòng số 2, 3 nằm sát và che mũi nhọn, chấm dẫn chồng nhau; mũi nhọn là chỗ phân biệt { với (.
- Sửa: vòng số nhỏ hơn, đặt lệch ra ngoài nét có mũi tên chỉ vào; bỏ chấm trùng.

### 9. Ba dấu câu trong `kt-dau-giua` quá nhỏ để phân biệt

- Vị trí: `$.exercises[16].options` (`kt-dau-giua`)
- Nguồn: tr.5
- Vấn đề: lựa chọn chỉ là `;`, `,`, `.` cỡ chữ thường (ảnh `ipad/043-s3-04-exercise-kt-dau-giua.png`), vài pixel mỗi dấu.
- Sửa: đặt mỗi dấu trong ngữ cảnh cỡ lớn (vd `{ 7 ; 9 }`) hoặc dùng thẻ dấu to như `cham-dau-ngan`.

### 10. Dấu ; đứng sát dấu câu khác trong câu quy tắc và recap

- Vị trí: `$.sections[2].blocks[0].children[0].text`, `$.sections[2].recap.caption`, `$.sections[2].blocks[2].caption` (";."); `$.sections[5].recap.caption`, `$.cards[7].recap.caption` (";,")
- Nguồn: tr.5
- Vấn đề: ảnh `ipad/039-s3-01-block.png`, `047-s3-06-recap.png`, `085-s6-06-recap.png` hiện ";." và ";,": trẻ đang học phân biệt ; với . và , lại thấy hai dấu dính nhau ngay trong câu cần nhớ.
- Sửa: đưa kí hiệu vào giữa câu, vd "Ta viết dấu chấm phẩy ; giữa hai phần tử."; recap liệt kê: "Liệt kê là viết các phần tử trong { }. Giữa hai phần tử có dấu chấm phẩy. Mỗi phần tử viết một lần." (sửa cả card và section).

### 11. Bài "Đổi x" hiện sẵn dấu ∈/∉ và câu đọc

- Vị trí: `$.exercises[24]` (visual `chon-x-thuoc`), `$.exercises[29]` (visual `chon-x-khong-thuoc`)
- Nguồn: tr.5
- Vấn đề: hình hiện luôn "1 ∈ A", "x thuộc A" theo giá trị x, nên trẻ chỉ bấm + tới khi câu đổi rồi bấm Kiểm tra; câu không đo kỹ năng xét thuộc.
- Sửa: ẩn dấu và câu đọc tới khi bấm Kiểm tra, hoặc đổi thành `choice` "Số nào thuộc A?".

### 12. Section ∉ thiếu màn chạm chấm tự vẽ ∉

- Vị trí: `$.sections[4].blocks` (`tap-hop.section.khong-thuoc`)
- Nguồn: tr.5
- Vấn đề: {, } và ∈ đều có bước tự chạm chấm, riêng ∉ (dấu khó nhất, trẻ chưa viết được theo `docs/learner.md`) chỉ có màn xem nét.
- Sửa: thêm visual chạm chấm cho ∉ sau `ve-khong-thuoc`, gộp `chon-x-tu-do` để giữ ≤ 4 màn.

### 13. Nấc 1 tô câu lệnh chung thay vì tập hợp cần nhìn lại

- Vị trí: `$.exercises[23].hints.highlight[0]` (`dien-thuoc`), `$.exercises[24]` (`chon-x-thuoc`), `$.exercises[28]` (`dien-khong-thuoc`), `$.exercises[29]` (`chon-x-khong-thuoc`), `$.exercises[41]` (`xet-hai-tap`)
- Nguồn: tr.5–6
- Vấn đề: các đề này có khối công thức tập hợp, nhưng nấc 1 tô khối 0 (câu lệnh). Chỗ trẻ dễ sai là không dò lại tập hợp. Đề nhiều khối nên không thuộc ngoại lệ "đề chỉ một câu chữ".
- Sửa: tô `{"target": "block", "index": 1}` (và thêm index 2 ở `xet-hai-tap`); không lộ đáp án vì câu hỏi bắt chọn dấu.

### 14. Chip nhiễu "+" vô lý

- Vị trí: `$.exercises[23].bank` (`dien-thuoc`)
- Nguồn: tr.5
- Vấn đề: "5 + A" không phải lỗi hay gặp, thực chất còn hai lựa chọn.
- Sửa: thay bằng "{" hoặc ";".

### 15. Ví dụ liệt kê S, A, P, A không nói là chữ cái của từ nào

- Vị trí: `$.sections[5].blocks[1].children[1]` (visual `vi-du-liet-ke`)
- Nguồn: tr.6 (bài 1.3)
- Vấn đề: ảnh `ipad/073-s6-02-block.png` chỉ có bốn ô chữ rồi {S; A; P}, không nói tập hợp gì; trẻ không hiểu vì sao A bị gạch. Địa danh viết đúng là "Sa Pa".
- Sửa: thêm nhãn "Các chữ cái trong từ …", hoặc chọn từ không phải địa danh.

### 16. `overview.summary` có 3 câu, luật cho 1–2 câu

- Vị trí: `$.overview.summary`
- Nguồn: —
- Vấn đề: luật overview ở `.claude/skills/lesson-author/SKILL.md` (mục "Sư phạm cho người học chậm") cho môn không phải Ngữ văn 1–2 câu.
- Sửa: gộp thành 2 câu.

### 17. Dấu hiệu đặc trưng mang nhiều tên; note giới thiệu không nêu tên thuật ngữ

- Vị trí: `$.sections[7].blocks[0].children[0].text` ("dấu hiệu chung", "dấu hiệu đó"), `$.exercises[43].prompt[0].text` ("dấu hiệu chung"), `$.cards[10].recap.caption` ("điều chung"), nhãn trong visual `the-dau-hieu`, `hai-cach-vi-du`, `the-hai-cach`, `doi-tu-liet-ke`, `the-doi-cach`
- Nguồn: tr.5 (kiến thức cần nhớ 2)
- Vấn đề: glossary chỉ có "dấu hiệu đặc trưng" (lime); note chính không nói tên này, còn section sau (`chon-dau-hieu-3456`, `noi-hai-cach`) và recap section dùng đúng tên. Một khái niệm bốn cách gọi; recap section lệch note.
- Sửa: note "Có thể mô tả tập hợp bằng cách nêu dấu hiệu đặc trưng, tức là điều chung của mọi phần tử…"; đề `kt-cham-dau-hieu` "Chạm vào dấu hiệu đặc trưng…"; nhãn visual dùng đúng tên, "điều chung" chỉ để giải thích cạnh tên.

### 18. Màn ℕ dạy cách viết mới mà không dạy cách đọc, không luyện, không có trong recap

- Vị trí: `$.sections[7].blocks[2]`
- Nguồn: tr.6 (mục "Chú ý")
- Vấn đề: một màn đưa ba thứ mới (ℕ, ∈ đặt trong ngoặc, dấu `<` thay "nhỏ hơn" mà mọi chỗ khác dùng chữ), không nói cách đọc, không liệt kê B, không có exercise, recap section và card `dau-hieu` không nhắc. Section thành hai ý mà recap chỉ tóm một.
- Sửa: (a) bỏ màn này (đề xuất); hoặc (b) viết bằng chữ, thêm cách đọc "x thuộc ℕ", hiện B dạng liệt kê và thêm một câu luyện.

### 19. Tên B dùng cho nhiều tập hợp khác nhau trên các màn liền nhau

- Vị trí: visual `dau-hieu-vi-du`, `doc-dau-hieu`, `$.sections[7].blocks[2].children[1].tex`, `$.exercises[44]`, `$.exercises[42]`, visual `doi-tu-liet-ke`
- Nguồn: —
- Vấn đề: riêng section `dau-hieu-dac-trung` có bốn tập B khác nhau; trẻ dễ lẫn.
- Sửa: mỗi màn trong một section dùng một chữ khác; câu luyện dùng chữ chưa xuất hiện trong section.

### 20. `liet-ke-tu-dau-hieu` bảo "Viết" nhưng là câu chọn

- Vị trí: `$.exercises[44].prompt[0].text`
- Nguồn: tr.6 (bài 1.5 là mẫu)
- Vấn đề: đề mơ hồ về việc phải làm.
- Sửa: "Chọn cách viết B bằng cách liệt kê các phần tử."

### 21. `kt-hai-cach`: hai lựa chọn khác kiểu hiển thị, chỉ đáp án có màu

- Vị trí: `$.exercises[48].options`
- Nguồn: —
- Vấn đề: lựa chọn a là công thức to, số amber; b là chữ thường nhỏ (ảnh `ipad/109-s9-03-exercise-kt-hai-cach.png`); chỉ hai lựa chọn nên đoán cũng đúng 50%. Cùng loại với mục 1 nhưng để Nên sửa vì ở đây nội dung hai lựa chọn khác nhau rõ (có hay không có vạch |), màu không phải là điểm phân biệt duy nhất.
- Sửa: hiển thị cả hai cùng kiểu công thức (x amber, phần sau | màu lime) và thêm nhiễu thứ ba.

### 22. Recap card `doi-cach` trùng đáp án câu nối của cùng card

- Vị trí: `$.cards[10].recap` (visual `the-doi-cach`), `$.exercises[50].pairs[0]`, `$.exercises[51]`, `$.exercises[48]`
- Nguồn: —
- Vấn đề: hình recap cho đúng cặp {2; 4; 6} ↔ "số chẵn lớn hơn 0 và nhỏ hơn 8" mà `noi-hai-cach` hỏi; tập {2; 4; 6} lặp ở bốn chỗ, trẻ nhớ hình thay vì tự tìm dấu hiệu.
- Sửa: đổi số trong `the-doi-cach`, tránh trùng các vế của `noi-hai-cach` và `chon-dau-hieu-3456`.

### 23. Kí hiệu ∈, ∉ trong chữ thường chỉ bằng nửa cỡ chữ; recap bị ngắt dòng trước "A."

- Vị trí: `$.sections[3].title`, `$.sections[4].title`, note đầu section `thuoc`, `khong-thuoc`, `xet-thuoc` (`$.sections[6].blocks[1].children[0].text`), `caption` của `ve-thuoc`, `tap-net-thuoc`, `ve-khong-thuoc`, recap `$.sections[3]`, `[4]`, `[6]`, `$.cards[5]`, `[6]`, `[8]`
- Nguồn: —
- Vấn đề: ảnh `ipad/051-s4-02-block.png`, `061-s5-01-block.png`, `089-s7-02-block.png`, `094-s7-05-recap.png`: ∈, ∉ nhỏ hơn hẳn chữ bên cạnh (phông dự phòng), và "A." rơi xuống dòng riêng. Chính người học này chưa nhận ra ∈, ∉ nên kí hiệu trong câu quy tắc phải rõ. Nhóm 2 ghi Góp ý, nhóm 3 ghi Nên sửa; giữ mức cao hơn.
- Sửa: đặt phần kí hiệu vào formula dưới câu chữ, hoặc báo người làm app sửa cỡ phông cho ∈, ∉; rút caption recap để "x ∉ A" không bị ngắt.

### 24. Hình hook: khung tập hợp không dùng màu teal, phần tử không màu amber

- Vị trí: `$.overview.hook.visualId` (`tap-hop.visual.tom-tat-tap-hop`, cũng là recap `$.sections[0].recap`)
- Nguồn: —
- Vấn đề: mọi hình khác vẽ khung tập hợp teal, phần tử amber; hình hook viền xanh đen, đồ vật đen, nhãn "Phần tử" không chỉ vào vật nào. Lệch "một khái niệm, một màu".
- Sửa: viền teal, đồ vật (hoặc vòng quanh) amber, nhãn "Phần tử" có gạch nối tới một vật.

## Góp ý

### 25. Câu tự làm của section 1 dùng lại đúng ví dụ trên màn

- Vị trí: `$.exercises[0]`, `$.exercises[1]`, `$.exercises[2]`
- Nguồn: tr.5
- Vấn đề: ba câu lấy nguyên ví dụ màn giảng; "chiếc thước" vừa là đáp án câu kiểm tra vừa là nhiễu câu sau, trẻ loại bằng trí nhớ.
- Sửa: đổi một câu luyện sang tình huống mới (món ăn sáng, màu cầu vồng).

### 26. Dấu ; dùng ở section 2 trước khi được dạy

- Vị trí: `$.sections[1].blocks[0].children[1]` (`ngoac-vi-du`), `$.sections[1].blocks[3].children[1]` (`ngoac-du-hai-dau`), `$.exercises[7].options`
- Nguồn: tr.5
- Vấn đề: ví dụ { 1 ; 2 ; 3 } có dấu ; mà section 3 mới dạy. Không sai kiến thức.
- Sửa: thêm nhãn nhỏ "dấu ; học ở phần sau", hoặc chấp nhận.

### 27. Tình huống điểm kiểm tra có thể trùng số

- Vị trí: `$.exercises[16].prompt[0].text` (`kt-dau-giua`)
- Nguồn: tr.5
- Vấn đề: ba bài kiểm tra dễ có hai điểm bằng nhau, lệch luật "mỗi phần tử một lần" dạy ở section 6.
- Sửa: đổi sang thứ không trùng, như số áo của ba bạn.

### 28. Chip kí hiệu nhỏ và mảnh: ";" và "," khác nhau một chấm, "{" gần "("

- Vị trí: bank của `$.exercises[12]`, `[14]`, `[15]`, `[19]`, `[33]` và mọi fillBlank có chip kí hiệu
- Nguồn: —
- Vấn đề: ảnh `phone/080-s6-05-exercise-ghep-ba-phan-tu.png`, `ipad/075-s6-04-exercise-kt-ghep-hai-phan-tu.png`: chip vẽ kí hiệu bằng cỡ chữ thường. Việc của app.
- Sửa: báo người làm app tăng cỡ, độ đậm chip khi chip chỉ gồm một kí hiệu.

### 29. Hình đổi x trộn "x" với số cụ thể trong câu đọc; "chưa nằm trong"

- Vị trí: visual `chon-x-tu-do` (`$.sections[4].blocks[2]`), `chon-x-thuoc`, `chon-x-khong-thuoc`
- Nguồn: —
- Vấn đề: ảnh `ipad/064-s5-03-block.png` hiện "4 ∉ A" rồi "x không thuộc A", lệch cách đọc theo số của note, recap; "chưa nằm trong" dễ hiểu là sau này sẽ vào.
- Sửa: "4 không thuộc A" (đổi theo x); "không nằm trong".

### 30. Hình lắp ghép: dấu ; dính số phía sau; nhãn ngoặc rút gọn

- Vị trí: visual `lap-ghep-liet-ke` (`$.sections[5].blocks[0]`, cũng là `hintVisualId` của `$.exercises[33]`)
- Nguồn: tr.5
- Vấn đề: ảnh `ipad/072-s6-01-block-end.png` hiện "{ 2 ;4 ;6 }", khác cách viết "2; 4; 6" của note, recap; nhãn "mở ngoặc", "đóng ngoặc" khác thuật ngữ glossary "mở ngoặc nhọn", "đóng ngoặc nhọn".
- Sửa: ; sát số trước, cách số sau; nhãn đúng thuật ngữ glossary.

### 31. Nhãn "phần tử mẫu" là từ mới

- Vị trí: visual `tap-hop.visual.dau-hieu-vi-du` (tag "x: phần tử mẫu")
- Nguồn: tr.5
- Vấn đề: cách gọi riêng của bài, trẻ có thể nghĩ là loại phần tử khác.
- Sửa: "x: thay cho mỗi phần tử".

### 32. `doc-dau-hieu` viết "x = 0, 1, 2" và không nói vì sao có 0

- Vị trí: visual `tap-hop.visual.doc-dau-hieu` (bước 3, `ipad/098-s8-02-block-end.png`)
- Nguồn: tr.6, tr.94
- Vấn đề: "x = 0, 1, 2" là cách viết lỏng; hình là mẫu cho `liet-ke-tu-dau-hieu` mà nhiễu chính là quên số 0.
- Sửa: "x có thể là 0, 1, 2", thêm tag "0 cũng là số tự nhiên".

### 33. Nấc 1 của `liet-ke-tu-dau-hieu` không trỏ vào chỗ dễ sai

- Vị trí: `$.exercises[44].hints`
- Nguồn: tr.6 (bài 1.5)
- Vấn đề: lỗi hay gặp là bỏ số 0; tô cả đề (đúng luật vì đề một khối) không giúp trẻ để ý "số tự nhiên".
- Sửa: thêm `hintVisualId` dùng số khác đề, tách "số tự nhiên bắt đầu từ 0" rồi dừng ở `{ ? }`.

### 34. `kt-cham-dau-hieu`: chip đúng lặp nguyên cụm trong đề

- Vị trí: `$.exercises[43].prompt[0].text`, visual `tap-hop.visual.cham-dau-hieu`
- Nguồn: —
- Vấn đề: đề nói "số chẵn nhỏ hơn 9", chip đúng ghi "x là số chẵn nhỏ hơn 9"; trẻ chạm đúng nhờ so chữ.
- Sửa: đề liệt kê số áo rồi hỏi phần nào là dấu hiệu đặc trưng.

### 35. ∈ khi gọi "dấu", khi gọi "kí hiệu"

- Vị trí: `$.sections[3].title` ("Dấu ∈ (thuộc)"), `$.sections[3].blocks[1].children[0].text` ("Kí hiệu 2 ∈ A"), `$.overview.summary` ("kí hiệu thuộc"), `$.exercises[21]`, `[26]` ("dấu thuộc", "dấu không thuộc")
- Nguồn: tr.5 (sách dùng "kí hiệu")
- Vấn đề: cùng một thứ gọi ba cách; không sai nhưng trẻ học chậm có thể tưởng là hai thứ.
- Sửa: chọn một cách gọi cho ∈, ∉ (nên theo sách: "kí hiệu"), giữ "dấu" cho { } ;, hoặc ghi rõ một lần "kí hiệu ∈ (dấu thuộc)".

### 36. Dấu ; dùng để ngăn hai mệnh đề ngay sau khi dạy ; ngăn hai phần tử

- Vị trí: `$.exercises[40].segments` ("305 [ ] K; 48 [ ] K"), `$.exercises[41].segments`
- Nguồn: tr.5 (lời giải ví dụ cũng viết như vậy)
- Vấn đề: trẻ vừa học ; chỉ đứng giữa hai phần tử trong { }, có thể lúng túng khi ; ở đây ngăn hai câu. Đúng cách viết của sách nên chỉ Góp ý.
- Sửa: tách mỗi mệnh đề một dòng, hoặc chấp nhận.
