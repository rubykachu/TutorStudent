# Review: Tập hợp (`tap-hop`)

- Bài: `content/math/kntt/tap-hop/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/tap-hop/` - p5, p6, p94 (sách bài tập tr.5, tr.6, lời giải tr.94)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (80 id chưa có trong `ids.lock.json`)
- `lesson:walk`: 0 FAIL, không có báo cáo cảnh báo lưu lại, ảnh trong `.shots/walk/tap-hop/`
- Kết luận: Chưa đạt: còn 3 lỗi Nghiêm trọng
- Bản đã review: `00a554bcaadd807882a174473a747792704b0e4670dc2b1fa40c4f959a02bf7b` (`pnpm content:diff` so với bản này)

Phạm vi "thang kí hiệu" (móc nối đời thường, cách đọc, viết từng nét, chạm chấm, điền chip) và section `thao-tac` vẫn được chấp nhận như vòng 1: đỡ thao tác theo `docs/learner.md`, không thêm kiến thức toán. Ba nhóm đã tự giải cả 55 exercise trước khi đọc `answer`: mọi đáp án đúng và duy nhất.

Mục vòng 1 (số theo `review.md` vòng 1):
- Đã sửa xong: 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 27, 29, 30, 31, 32, 36.
- Sửa một phần, phần còn lại ghi dưới đây: 4 (nhãn "hộp" trong hình), 8 (chấm dẫn ở `ve-mo-ngoac`), 23 (recap ngắt "A.", ∈ trong tiêu đề), 25 (`nhom-la-tap-hop`), 28 (chip ; ,), 35 (∈ gọi là "dấu").
- Chưa xử lý: 26 (dấu ; trước khi dạy), 34 (`kt-cham-dau-hieu` so chữ). Mục 33 thuộc "Không bắt lỗi", bỏ.

Kiểm lại của Tổng hợp: cả ba mục Nghiêm trọng đã đối chiếu lại với `lesson.json`, `p5.png`, `p6.png` và mã app; giữ mức. Hai nhóm xếp khác mức cho `dem-chu-cai-nha-trang` (nhóm 1 Nghiêm trọng, nhóm 2 Nên sửa): giữ Nghiêm trọng, lý do ở mục 1. Mục "∈ gọi là dấu" nâng từ Góp ý lên Nên sửa theo checklist ("một khái niệm, một từ").

## Nghiêm trọng

### 1. `dem-chu-cai-nha-trang` gắn card `phan-tu`, có thể ra trong phiên ôn trước khi trẻ học "mỗi phần tử chỉ viết một lần"

- Vị trí: `$.exercises[38].cardIds` (`tap-hop.ex.dem-chu-cai-nha-trang`: `liet-ke`, `phan-tu`)
- Nguồn: tr.5 (kiến thức cần nhớ 2, "mỗi phần tử được kê đúng một lần"), tr.6 (bài 1.3)
- Vấn đề: card mở ở câu luyện tập có chấm điểm đầu tiên gắn nó (`src/progress/record.ts`); card `phan-tu` mở ngay ở section 1 (`ngay-trong-tuan`), và nút ôn hiện khi đã có một card mở (`lesson-screen.tsx`). `selectReview` (`src/srs/select.ts`) chọn câu theo từng card đã mở, không đòi mọi card trong `cardIds` đã mở, và ưu tiên câu kho ôn: card `phan-tu` có 4 câu kho ôn, câu này là một. Trẻ chưa qua section `liet-ke` (thứ 7) sẽ đếm 8 chữ, bị chấm sai mà chưa được dạy vì sao là 6. Đây là thiếu kiến thức, không phải thiếu thao tác (khác `chon-x-thuoc`, mục Nên sửa 7), nên là "trẻ không làm được bài": Nghiêm trọng.
- Sửa: `cardIds: ["tap-hop.card.liet-ke"]`. Card `phan-tu` vẫn còn `ngay-trong-tuan`, `noi-tap-hop-phan-tu`, `dem-ban-trong-to`, `chon-do-dung`.

### 2. Định nghĩa "dấu hiệu đặc trưng" thiếu vế "chỉ các phần tử đó có"

- Vị trí: `$.sections[8].blocks[0].children[0].text`, `$.sections[8].recap.caption`, `$.cards[9].recap.caption` (section `dau-hieu-dac-trung`, card `dau-hieu`: "điều chung của mọi phần tử")
- Nguồn: tr.5 (kiến thức cần nhớ 2: dấu hiệu đặc trưng "để nhận biết" các phần tử), `p5.png`
- Vấn đề: "điều chung của mọi phần tử" chưa đủ: với {1; 3; 5}, "x là số lẻ" cũng là điều chung nhưng còn gồm 7, 9. Chính bài dạy đúng ở hình `doi-tu-liet-ke` và `the-hai-cach` ("số lẻ nhỏ hơn 6"), nên câu cần nhớ lệch hình. Trẻ thuộc recap sẽ viết {x | x là số lẻ} cho {1; 3; 5}; bài luyện không có nhiễu "chung nhưng quá rộng" nên không bắt được hiểu sai này.
- Sửa: cả ba chỗ cùng một câu, ví dụ "Dấu hiệu đặc trưng giúp nhận ra đúng các phần tử: phần tử nào cũng có, số khác thì không có." Thêm vào `chon-dau-hieu-3456` (`$.exercises[51]`) một nhiễu quá rộng, như "x là số tự nhiên nhỏ hơn 7".

### 3. `chon-dong-dung` dùng lại tập B = {x; y} của bài 1.2

- Vị trí: `$.exercises[44].prompt[0].text`, `$.exercises[44].options` (`tap-hop.ex.chon-dong-dung`)
- Nguồn: tr.6 (bài 1.2), `p6.png`
- Vấn đề: cùng tên tập, cùng hai phần tử và cùng đáp án (y thuộc B) như bài tập của sách; vòng 1 đã xếp Nghiêm trọng ví dụ trùng tập P của sách, giữ cùng mức. Thêm nữa, x ở đây là một phần tử cụ thể, trong khi note section này và section sau dùng x thay cho phần tử bất kỳ ({x | …}): trẻ dễ lẫn.
- Sửa: đổi tên và phần tử, tránh x, a, b, c, ví dụ "Cho tập hợp R gồm hai phần tử h và k. Dòng nào đúng?" với k ∈ R (đúng), h ∉ R, u ∈ R.

## Nên sửa

### 4. Nhãn trong hình vẫn gọi tập hợp là "hộp bút", "hộp" bằng màu teal

- Vị trí: visual `tap-hop.visual.vi-du-tap-hop` (`$.sections[0].blocks[1].children[1]`), `tap-hop.visual.chon-hop-but` (`$.sections[0].blocks[3]`), `tap-hop.visual.chon-do-dung` (`$.exercises[6]`)
- Nguồn: tr.5
- Vấn đề: note nói "các đồ trong hộp bút" nhưng nhãn teal (màu khái niệm tập hợp) ghi "hộp bút", "hộp" (ảnh `ipad/003-s1-02-block.png`, `ipad/005-s1-04-block.png`): dạy lại "tập hợp là chiếc hộp", phần còn lại của mục 4 vòng 1.
- Sửa: nhãn `vi-du-tap-hop` "đồ trong hộp bút", "các bạn trong đội bóng"; khung thả đồ ghi "hộp bút" màu trung tính.

### 5. Note hướng dẫn chạm gọi trẻ là "em"

- Vị trí: `$.sections[1].blocks[0].children[0].text` (section `thao-tac`)
- Nguồn: —
- Vấn đề: cả bài và `docs/learner.md` gọi trẻ là "bạn"; một câu "em" lệch giọng.
- Sửa: "chạm vào hình bạn chọn".

### 6. `sourceRef` sai: section thao tác và section dấu hiệu đặc trưng

- Vị trí: `$.sections[1].sourceRef` ("Sách bài tập tr.5–6 (cách làm bài tập)"), `$.sections[8].sourceRef` (còn "chú ý")
- Nguồn: tr.5, tr.6
- Vấn đề: tr.5–6 không có hướng dẫn thao tác app; màn ℕ (mục "Chú ý" tr.6) đã bỏ nhưng `sourceRef` vẫn ghi.
- Sửa: section thao tác ghi rõ là hướng dẫn thao tác trong app, không lấy từ sách (nếu schema cho chuỗi tự do); section dấu hiệu: "Sách bài tập tr.5–6 (kiến thức cần nhớ 2; ví dụ; bài 1.5)".

### 7. `chon-x-thuoc` dùng nút − / + mà có thể ra trước màn dạy thao tác đổi x

- Vị trí: `$.exercises[26]` (`tap-hop.ex.chon-x-thuoc`, card `thuoc`); màn đổi x đầu tiên là `$.sections[5].blocks[3]` (`chon-x-tu-do`)
- Nguồn: —
- Vấn đề: card `thuoc` mở ở section `thuoc`; phiên ôn ưu tiên câu kho ôn nên có thể đưa câu này khi trẻ chưa gặp nút − / + (section `thao-tac` chỉ dạy chạm vùng và điền chip).
- Sửa: thêm vào đề "Bấm − hoặc + để đổi x, rồi bấm Kiểm tra." (cả `chon-x-khong-thuoc`), hoặc chuyển `chon-x-tu-do` sang section `thuoc`.

### 8. `chon-viet-dung`: dấu cần phân biệt vẽ cỡ chữ công thức thường

- Vị trí: `$.exercises[19].options` (`tap-hop.ex.chon-viet-dung`)
- Nguồn: tr.5
- Vấn đề: ba lựa chọn chỉ khác ở dấu giữa các số; ảnh `phone/056-s4-05-exercise-chon-viet-dung.png`: ; , . chỉ vài pixel, `{4.5.6}` trông như một số. Câu kiểm tra cùng section đã đổi sang thẻ dấu to vì đúng lý do này. Không xếp "bẫy" vì chỗ khác nhau chính là kỹ năng section dạy.
- Sửa: phóng và giãn dấu trong TeX, hoặc dùng visual dòng kí hiệu cho từng lựa chọn.

### 9. `dat-cham-phay-bai` lặp dãy số của màn tương tác và không có ngoặc nhọn

- Vị trí: `$.exercises[20]` (visual `dat-cham-phay-bon`: 1 _ 2 _ 3 _ 4), màn `$.sections[3].blocks[2]` (visual `dat-cham-phay`: 1 _ 2 _ 3)
- Nguồn: tr.5
- Vấn đề: kho ôn dùng lại dãy của màn hướng dẫn; cả hai hình đặt ; ngoài { }, ngay sau section dạy "tập hợp viết giữa hai ngoặc nhọn".
- Sửa: kho ôn đổi số (vd 5 _ 7 _ 9 _ 11); vẽ { } ở hai đầu cả hai hình.

### 10. Recap có kí hiệu rơi xuống dòng: "A." đứng một mình

- Vị trí: `$.sections[5].recap.caption`, `$.cards[6].recap.caption` (∉); `$.sections[7].recap.caption`, `$.cards[8].recap.caption` (xét thuộc)
- Nguồn: tr.5 (kiến thức cần nhớ 1)
- Vấn đề: ảnh `ipad/081-s6-07-recap.png`, `ipad/102-s8-05-recap.png`: dòng hai chỉ còn "A.", tách kí hiệu khỏi tên tập hợp trong câu cần nhớ (phần còn lại của mục 23 vòng 1).
- Sửa: rút gọn, vd "x ∉ A: x không phải là phần tử của A." (recap ∈ cùng khuôn "x ∈ A: x là phần tử của A."); xét thuộc: "Có trong A thì x ∈ A, không có thì x ∉ A." Card và section giữ cùng câu.

### 11. Kí hiệu ∈, ∉ gọi là "dấu"; dấu { } ; gọi là "kí hiệu"

- Vị trí: `$.exercises[25]`, `[30]` ("Chọn dấu thích hợp…"), `[42]`, `[43]` ("Chọn dấu cho mỗi chỗ trống"); visual `tap-hop.visual.the-khong-thuoc` ("Viết: dấu ∈ và gạch chéo"); ngược lại `$.sections[1]` (title, note, recap: "kí hiệu" cho chip { ; ), `$.exercises[34]` ("Ghép các kí hiệu")
- Nguồn: tr.5 (sách gọi ∈, ∉ là "kí hiệu")
- Vấn đề: tiêu đề, note, caption, overview thống nhất "dấu ngoặc nhọn, dấu chấm phẩy, kí hiệu thuộc, kí hiệu không thuộc"; các chỗ trên đảo tên. Checklist: một khái niệm hai tên là Nên sửa (nhóm xếp Góp ý, Tổng hợp nâng mức).
- Sửa: "Chọn kí hiệu thích hợp…", "Viết: kí hiệu ∈ và gạch chéo"; section thao tác gọi chip là "thẻ" ("chạm một thẻ ở dưới"), `kt-ghep-hai-phan-tu` "Ghép các thẻ".

### 12. `kt-xet-hai-chu-so`: đề không cho biết phố có nhà số nào

- Vị trí: `$.exercises[40].prompt[0].text`
- Nguồn: tr.6 (bài 1.1)
- Vấn đề: Q là "các số nhà có hai chữ số trong phố của Nam", đề không nói phố có nhà số 64; nói chặt thì không lựa chọn nào chắc thuộc Q.
- Sửa: "Phố của Nam có các nhà số 9, 64 và 200. Q là tập hợp các số nhà có hai chữ số. Số nhà nào thuộc Q?"

### 13. Quy tắc "xét thuộc" chỉ nhắc lại định nghĩa, không nói cách xét

- Vị trí: `$.sections[7].blocks[1].children[0].text`, `$.sections[7].recap.caption`, `$.cards[8].recap.caption`
- Nguồn: tr.5 (ví dụ a), tr.6 (bài 1.1)
- Vấn đề: "xem x có là phần tử của A không" lặp chính câu hỏi; ba trên năm bài cho tập hợp bằng lời, việc cần làm là so số với điều mô tả A (như hình `xet-mau`).
- Sửa: "Muốn biết x có thuộc A không, xem x có trong các phần tử của A, hay có đúng điều mô tả A không." Recap rút gọn cùng ý, giữ dòng ngắn (mục 10).

### 14. Hình recap `the-doi-cach` không có vạch đứng mà caption bảo "viết sau vạch đứng |"

- Vị trí: `$.cards[10].recap` (visual `tap-hop.visual.the-doi-cach`)
- Nguồn: tr.5
- Vấn đề: ô dưới chỉ ghi "x là số tự nhiên lớn hơn 6 và nhỏ hơn 10", không có `{ x | … }` (ảnh `.shots/tap-hop/tap-hop.visual.the-doi-cach-ipad.png`).
- Sửa: bỏ `propertyOnly` để hiện đủ `{ x | … }`, hoặc sửa caption khớp hình.

### 15. Hình recap `the-dau-hieu` hở khoảng lớn giữa các phần của tập hợp

- Vị trí: `$.sections[8].recap`, `$.cards[9].recap` (visual `tap-hop.visual.the-dau-hieu`)
- Nguồn: —
- Vấn đề: ảnh `ipad/111-s9-05-recap.png`, `phone/111-s9-05-recap.png`: "{ x |", khoảng trống, "x là số chẵn", khoảng trống, "}"; cột nhãn đẩy các phần ra xa, khó đọc thành một tập hợp ở chính hình mẫu cách viết.
- Sửa: `{ x | x là số chẵn }` liền một dòng, nhãn lime dưới phần sau vạch đứng, không làm giãn dòng.

## Góp ý

### 16. `nhom-la-tap-hop` dùng lại đúng ví dụ trong note

- Vị trí: `$.exercises[1]` (đáp án "các bạn trong đội bóng")
- Nguồn: tr.5
- Vấn đề: đáp án là nguyên cụm ví dụ của note, hình `vi-du-tap-hop` và hình recap `the-tap-hop`; phần còn lại của mục 25 vòng 1.
- Sửa: đổi sang tình huống mới, vd "các màu của cầu vồng".

### 17. Dấu ; xuất hiện từ section 2, trước khi dạy ở section 4

- Vị trí: visual `huong-dan-chip` (`$.sections[1].blocks[1].children[1]`), `ngoac-vi-du`, `ngoac-du-hai-dau`, `$.exercises[9].options` (`kt-ngoac-dung`)
- Nguồn: tr.5
- Vấn đề: mục 26 vòng 1 chưa xử lý; section thao tác đưa ; sớm hơn nữa (ảnh `ipad/018-s2-02-block.png`). Không sai kiến thức.
- Sửa: `huong-dan-chip` dùng chip từ hay chữ số; hoặc chấp nhận.

### 18. `kt-ngoac-dung` dùng đúng tập của ví dụ ngay trước

- Vị trí: `$.exercises[9]` (1, 2, 3), `$.sections[2].blocks[0].children[1]` (`ngoac-vi-du`: {1; 2; 3})
- Nguồn: tr.5
- Vấn đề: trẻ chọn theo trí nhớ hình.
- Sửa: đổi số trong đề (vd 4, 7, 9).

### 19. Kho ôn `cham-dau-cham-phay` trùng câu kiểm tra `kt-dau-giua`

- Vị trí: `$.exercises[22]` (visual `cham-dau-ngan`), `$.exercises[18]` (visual `cham-dau-giua`)
- Nguồn: tr.5
- Vấn đề: cùng bốn thẻ dấu, chỉ đổi thứ tự.
- Sửa: kho ôn đặt dấu trong ngữ cảnh, vd chọn dấu đúng giữa hai số trong { 3 ? 8 }.

### 20. Id `ngay-trong-tuan` không khớp nội dung (đề hỏi mùa)

- Vị trí: `$.exercises[2].id`
- Nguồn: —
- Vấn đề: id chưa khoá trong `ids.lock.json`; sau khi xuất bản không đổi được.
- Sửa: đổi thành `tap-hop.ex.mua-trong-nam` (cả `practiceIds` section 1) trước `content:lock`.

### 21. Nhiễu "một số tự nhiên" của `gom-nhom-hop` không phản ánh lỗi hay gặp

- Vị trí: `$.exercises[3].options[2]`
- Nguồn: tr.5
- Vấn đề: không liên quan tình huống cặp sách, câu chỉ còn hai lựa chọn thật.
- Sửa: "một đồ trong cặp".

### 22. Recap card `tap-hop`: câu nêu hộp bút, hình vẽ đội bóng

- Vị trí: `$.cards[0].recap` (visual `the-tap-hop`)
- Nguồn: tr.5
- Vấn đề: hai ví dụ khác nhau trên cùng một thẻ.
- Sửa: caption "…, như các bạn trong đội bóng." hoặc đổi hình.

### 23. Màn `ve-mo-ngoac` bước 1: chấm dẫn chồng nhau ở mũi nhọn

- Vị trí: `$.sections[2].blocks[1]`
- Nguồn: —
- Vấn đề: ảnh `ipad/032-s3-02-block.png`; phần còn lại của mục 8 vòng 1.
- Sửa: tách nét 2 tại mũi để không có chấm trùng.

### 24. `kt-dau-giua`: câu chuyện số áo không có số áo nào

- Vị trí: `$.exercises[18].prompt[0].text`
- Nguồn: tr.5
- Vấn đề: tình huống treo, hình chỉ có bốn thẻ dấu.
- Sửa: nêu số, vd "Ba bạn đeo số áo 3, 8, 10…".

### 25. Chữ trong section thao tác và section dấu chấm phẩy

- Vị trí: `$.sections[1].blocks[1].children[0].text` và `$.exercises[8]` (`kt-thu-dien`); `$.sections[3].blocks[0].children[0].text`
- Nguồn: —
- Vấn đề: note gọi "bài điền kí hiệu" nhưng câu kiểm tra đầu tiên điền từ; note section 4 thiếu dấu phẩy sau trạng ngữ "Giữa hai phần tử".
- Sửa: "Bài điền: chạm một thẻ ở dưới (từ hoặc kí hiệu), rồi chạm ô trống."; "Giữa hai phần tử, ta viết dấu chấm phẩy."

### 26. Nhiễu `{3; 4; 4}` của `chon-chu-so-343` ít hợp lý

- Vị trí: `$.exercises[37].options[2]`
- Nguồn: tr.5
- Vấn đề: 343 chỉ có một chữ số 4, không lỗi nào dẫn tới lặp 4.
- Sửa: `{ 343 }` (coi cả số là một phần tử).

### 27. Chip ";" và "," vẫn nhỏ, gần giống nhau (việc của app)

- Vị trí: bank `$.exercises[35]` và các fillBlank có chip ;
- Nguồn: —
- Vấn đề: ảnh `ipad/088-s7-04-exercise-ghep-ba-phan-tu.png`; phần còn lại của mục 28 vòng 1.
- Sửa: báo người làm app tăng cỡ, độ đậm cho ; , . trong chip (`src/components/rich-text.tsx`).

### 28. ∈, ∉ trong tiêu đề section vẫn nhỏ (việc của app)

- Vị trí: `$.sections[4].title`, `$.sections[5].title`
- Nguồn: —
- Vấn đề: tiêu đề chưa qua `RichText`, kí hiệu bằng nửa cỡ chữ.
- Sửa: báo người làm app.

### 29. Hình lắp ghép: "{ ?; ?; ? ?" trông như bốn phần tử; nhãn lệch

- Vị trí: visual `tap-hop.visual.lap-ghep-liet-ke` (`$.sections[6].blocks[0]`, cũng là `hintVisualId` của `$.exercises[35]`)
- Nguồn: —
- Vấn đề: ảnh `ipad/083-s7-01-block.png`, `ipad/084`: chỗ trống của } giống chỗ trống phần tử; nhãn "mở ngoặc nhọn" nằm dưới "A =".
- Sửa: vẽ chỗ của } khác kiểu; đặt nhãn ngay dưới kí hiệu.

### 30. Tên K dùng cho hai tập khác nhau trong section liệt kê

- Vị trí: `$.exercises[34]` (K = {5; 8}), visual recap `tap-hop.visual.the-liet-ke` (K = {1; 7; 8})
- Nguồn: —
- Vấn đề: cùng loại mục 19 vòng 1.
- Sửa: đổi tên tập trong recap (vd E).

### 31. Recap liệt kê bỏ chữ "hết" của note; "{ }," dính dấu phẩy

- Vị trí: `$.sections[6].recap.caption`, `$.cards[7].recap.caption`; note `$.sections[6].blocks[1].children[0].text`
- Nguồn: tr.5 (kiến thức cần nhớ 2)
- Vấn đề: "hết" là chỗ trẻ hay sót phần tử; } sát dấu phẩy trong câu cần nhớ.
- Sửa: "Liệt kê là viết hết các phần tử trong hai ngoặc nhọn. Giữa hai phần tử có dấu chấm phẩy. Mỗi phần tử chỉ viết một lần."

### 32. `kt-cham-dau-hieu`: ô đúng lặp nguyên cụm của đề; hình lệch trái

- Vị trí: `$.exercises[45]`, visual `tap-hop.visual.cham-dau-hieu`
- Nguồn: —
- Vấn đề: trẻ chạm đúng nhờ so chữ (mục 34 vòng 1); hình dồn trái (ảnh `ipad/107-s9-03-exercise-kt-cham-dau-hieu.png`).
- Sửa: đề liệt kê số áo rồi hỏi phần nào là dấu hiệu đặc trưng; căn giữa hình.

### 33. Cùng card `xet-thuoc`, `dien-dau-xet-so` dùng lại K, 305 và 48 của `xet-ba-chu-so`

- Vị trí: `$.exercises[42].segments`
- Nguồn: —
- Vấn đề: trẻ nhớ kết quả câu trước.
- Sửa: đổi số, vd 610 và 95.

### 34. Cùng card `doi-cach`, `noi-hai-cach` và `dien-liet-ke-chan` cùng ra {2; 4; 6}

- Vị trí: `$.exercises[52].left[0]`, `$.exercises[53]` (cả `$.exercises[50].options[0]`)
- Nguồn: —
- Vấn đề: phần còn lại của mục 22 vòng 1.
- Sửa: đổi H, vd "số chẵn lớn hơn 3 và nhỏ hơn 10" → {4; 6; 8}.

### 35. Caption "viết sau vạch đứng |." để | dính dấu chấm

- Vị trí: `$.sections[8].recap.caption`, `$.cards[9].recap.caption`, `$.cards[10].recap.caption`
- Nguồn: —
- Vấn đề: cùng loại mục 10 vòng 1.
- Sửa: đưa kí hiệu vào giữa câu, vd "…, viết sau vạch đứng | trong ngoặc nhọn." (gộp với câu mới của mục 2).
