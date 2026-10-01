# Review: Ước chung. Ước chung lớn nhất (`uoc-chung-uoc-chung-lon-nhat`)

- Bài: `content/math/kntt/uoc-chung-uoc-chung-lon-nhat/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/uoc-chung-uoc-chung-lon-nhat/` - p38-40, p107-108
- `content:check`: 0 lỗi, 0 cảnh báo của bài (trừ cảnh báo id chưa khoá: 89)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/uoc-chung-uoc-chung-lon-nhat/`
- Kết luận: Chưa đạt: còn 8 lỗi Nghiêm trọng (đã chạy `pnpm content:hash uoc-chung-uoc-chung-lon-nhat --root content --mark`)
- Bản đã review: `a76950da1ba116abedb13ecd3b4a077fbe9924f8b801aac3d0f81b6afb2667cf` (`pnpm content:diff` so với bản này)

Đã soát: 60 bài tập (tự giải trước khi đọc `answer`: mọi đáp án đúng, mỗi câu `choice` đúng một đáp án hay một tập đáp án, các câu `order` chỉ có một thứ tự đúng); mọi `note` quy tắc, `recap`, `caption`, recap card, glossary Toán; so câu quy tắc nhắc lại ở section 5 với bài `so-nguyen-to` (cùng là bản nháp). Phạm vi bỏ "Kiến thức bổ sung" (a, b), a = dm, b = dn, câu 2.41-2.43 và Ví dụ 1 tr.38: chấp nhận được (xem Góp ý 6).

Bảng đổi số ở Nên sửa 16 gom mọi đề xuất đổi số của review này; các mục khác trỏ về đó để các bộ số mới không trùng nhau.

## Nghiêm trọng

### 1. Quy tắc section 10 nói ngược chiều chia hết: "số chia hết cho cả hai số" là bội chung, không phải ước chung (LL-17, LL-05)

- Vị trí: `$.sections[9].title` ("Số chia hết cho cả hai số", cũng hiện ở màn "Bạn vừa học xong"), `$.sections[9].blocks[1].children[0].text` (`rule: true`), `$.sections[9].recap.caption`, `$.cards[9].recap.caption` (`uoc-chung-uoc-chung-lon-nhat.section.bai-toan-uc`, `uoc-chung-uoc-chung-lon-nhat.card.bai-toan-uc`)
- Nguồn: tr.38 mục 1; tr.40 câu 2.39 ("480 ⋮ a và 720 ⋮ a"), `sbt-p38.png`, `sbt-p40.png`
- Vấn đề: "Số chia hết cho cả hai số đã cho là ước chung của hai số đó." sai kiến thức. Số chia hết cho 20 và 28 (như 140) là bội chung. Câu này trái định nghĩa ước chung ở section 1 và trái chính các note, bài tập cùng section ("số mà cả 60 và 90 đều chia hết cho nó", `chon-uc-20-28`, `so-lon-nhat-40-100`, `chia-het-24-36`). Trẻ ôn bằng recap sẽ nhớ câu sai, và bài Bội chung ngay sau sẽ mâu thuẫn trực tiếp. Đã kiểm lại trong `lesson.json`: câu sai có ở đúng 4 chỗ trên, không có trong visual.
- Sửa: tên section "Bài toán tìm ước chung". Câu quy tắc, recap section và recap card cùng một câu: "Nếu hai số đều chia hết cho một số thì số đó là ước chung của hai số. Đề hỏi số lớn nhất thì ta tìm ƯCLN." Sau khi sửa, tìm cả bài cụm "chia hết cho cả" để chắc không còn chỗ nào.

### 2. Định nghĩa ƯCLN gần như chép nguyên văn sách (LL-08)

- Vị trí: `$.sections[2].blocks[1].children[0].text`, `$.sections[2].recap.caption`, `$.cards[2].recap.caption` (`uoc-chung-uoc-chung-lon-nhat.section.uoc-chung-lon-nhat`, `uoc-chung-uoc-chung-lon-nhat.card.uoc-chung-lon-nhat`)
- Nguồn: tr.38 "Kiến thức cần nhớ" mục 2, `sbt-p38.png`
- Vấn đề: "Ước chung lớn nhất (viết tắt là ƯCLN) của hai hay nhiều số là số lớn nhất trong các ước chung của các số đó." chỉ thêm "viết tắt là" vào câu sách. Định nghĩa ước chung ở section 1 đã viết lại được, nên câu này cũng viết lại được.
- Sửa: "Trong các ước chung của hai hay nhiều số, số lớn nhất gọi là ước chung lớn nhất, viết tắt là ƯCLN." Sửa cùng lúc rule, recap section và recap card (luật `rule-sentence`).

### 3. Quy tắc section 6 và section 8 chép câu sách mục 3, 4; câu section 6 thiếu bước, câu section 8 đọc như cách duy nhất (LL-08, LL-05)

- Vị trí: `$.sections[5].blocks[1].children[0].text`, `$.sections[5].recap.caption`, `$.cards[5].recap.caption` (`uoc-chung-uoc-chung-lon-nhat.section.uclnn-phan-tich`); `$.sections[7].blocks[1].children[0].text`, `$.sections[7].recap.caption`, `$.cards[7].recap.caption` (`uoc-chung-uoc-chung-lon-nhat.section.uc-tu-uclnn`); câu điền `$.exercises[39].segments` (`uoc-chung-uoc-chung-lon-nhat.ex.dien-tim-uclnn`)
- Nguồn: tr.38 "Kiến thức cần nhớ" mục 3 và 4, `sbt-p38.png`
- Vấn đề:
  - Section 6: "Chọn các thừa số nguyên tố chung của các số, mỗi thừa số lấy với số mũ nhỏ nhất. Tích đó là ƯCLN cần tìm." giữ nguyên các cụm của sách ("mỗi thừa số lấy với số mũ nhỏ nhất", "Tích đó là ƯCLN cần tìm"). Câu còn bỏ bước phân tích và không có động từ "nhân", nên "Tích đó" không chỉ tới gì; trẻ ôn riêng recap sẽ không biết phải phân tích trước rồi nhân lại. Note "cùng làm" lại nói "rồi nhân lại": hai chỗ nói khác nhau.
  - Section 8: "Muốn tìm ước chung của hai hay nhiều số, ta tìm ƯCLN của các số đó rồi tìm các ước của ƯCLN." chỉ đổi vài chữ so với mục 4 và bỏ "có thể". Bài có hai câu cùng mở bằng "Muốn tìm ước chung của ..." (section 2: liệt kê; section 8: qua ƯCLN), nên trẻ dễ hiểu cách liệt kê bị bỏ. Câu điền `dien-tim-uclnn` lại nói "của hai số", lệch "hai hay nhiều số" của quy tắc.
- Sửa:
  - Section 6 (rule, recap, recap card): "Viết mỗi số thành tích các thừa số nguyên tố. Lấy các thừa số có ở mọi số, mỗi thừa số với số mũ nhỏ nhất, rồi nhân lại: kết quả là ƯCLN." Giữ chữ "nhỏ nhất" cho khớp hàng "Mũ nhỏ nhất" của các bảng `expTable`.
  - Section 8 (rule, recap, recap card): "Các ước chung của hai hay nhiều số chính là các ước của ƯCLN của chúng. Vì vậy ta cũng có thể tìm ƯCLN trước, rồi viết các ước của ƯCLN." Sửa câu điền `dien-tim-uclnn` theo đúng câu này (ví dụ "Các ước chung của hai hay nhiều số chính là các ước của ___ của chúng.", vẫn chấp nhận "ƯCLN").

### 4. Section số hoàn hảo chép định nghĩa, bộ số và lời giải của câu 2.38 (LL-08)

- Vị trí: `$.sections[10].blocks[1].children[0].text`, `$.sections[10].recap.caption`, `$.cards[10].recap.caption` (định nghĩa); `$.sections[10].blocks[2].children[0].text` (số 10); `$.sections[10].blocks[3].caption` (số 28) (`uoc-chung-uoc-chung-lon-nhat.section.so-hoan-hao`, `uoc-chung-uoc-chung-lon-nhat.card.so-hoan-hao`)
- Nguồn: tr.40 câu 2.38, `sbt-p40.png`; lời giải tr.107, `sbt-p107.png`
- Vấn đề: "Một số bằng tổng các ước của nó, không kể chính nó, thì gọi là số hoàn hảo. Vậy 6 là số hoàn hảo." chỉ đổi ngoặc thành dấu phẩy và thêm "thì" so với câu sách, kể cả câu "Vậy 6 là số hoàn hảo". Ví dụ 10 và 28 là bộ số của câu 2.38; note số 10 gần trùng lời giải in ("1; 2; 5 ... 1 + 2 + 5 = 8 ≠ 10 nên 10 không là số hoàn hảo").
- Sửa: rule, recap section, recap card: "Cộng tất cả các ước của một số, không kể chính nó. Nếu tổng đúng bằng số đó thì số đó là số hoàn hảo." (bỏ câu "Vậy 6 là số hoàn hảo" khỏi rule; ví dụ 6 đã có ở caption `hh-6`). Note số 10 đổi sang 14: "Xét số 14. Các ước của 14, không kể 14, là 1, 2 và 7. Tổng là 10, khác 14, nên 14 không là số hoàn hảo." Giữ 28 (số hoàn hảo nhỏ thứ hai, khó thay) nhưng viết caption theo lời riêng, ví dụ kèm câu đời sống ở Nên sửa 12. Sửa cùng lúc nhãn hình theo Nên sửa 18.

### 5. Câu luyện cắt dải hiện sẵn đáp án ngay khi mở, và hình tự báo đúng sai ở mọi lần thử (LL-02, LL-07)

- Vị trí: `$.exercises[1]` (`uoc-chung-uoc-chung-lon-nhat.ex.cat-8-12-tu-lam`, câu luyện của section 1 và câu kho ôn card `uoc-chung`); hình `uoc-chung-uoc-chung-lon-nhat.visual.cat-thu-8-12` (`src/visuals/math/uoc-chung-uoc-chung-lon-nhat/cut-bars.tsx`, `CutTry`)
- Nguồn: —
- Vấn đề: `CutTry` luôn bắt đầu ở `PIECE_RANGE.min = 2` (`useState(PIECE_RANGE.min)`), mà 2 là ước chung của 8 và 12, nên màn mở ra đã ghi "2 là ước chung của 8 và 12" (walk `012-s1-06-exercise-cat-8-12-tu-lam`). Dòng `Verdict` hiện ở mọi trạng thái, kể cả khi làm bài (không có `goal`), trái chú thích trong code "nothing is revealed"; trẻ chỉ cần bấm + hay − tới khi hình báo "là ước chung". Nút "Kiểm tra" còn tắt cho tới khi trẻ chạm + hay −, nên trẻ thấy hình nói "2 là ước chung" mà không nộp được.
- Sửa: trong `CutTry`, khi không có `goal` thì không hiện `Verdict`, và báo trạng thái đầu cho bài tập ngay khi mở (nút "Kiểm tra" bấm được). Đổi bộ số của câu sang 9 dm và 21 dm (trong khoảng 2-9 chỉ 3 vừa cả hai dải, nên trạng thái đầu 2 không phải đáp án); sửa `params` (`a: 9`, `b: 21`) và đề. Sửa chú thích `CutTry` cho khớp cách chạy thật. Chụp lại `visual:shot`.

### 6. Hình liệt kê ƯCLN tô màu "Ước chung lớn nhất" cho mọi ước chung (LL-15)

- Vị trí: `$.sections[2].blocks[0]` (`uoc-chung-uoc-chung-lon-nhat.visual.ds-lon-12-18`, màn đầu section `uoc-chung-lon-nhat`); `$.exercises[11].hints.solutionVisualId` (`uoc-chung-uoc-chung-lon-nhat.visual.ds-lon-10-25`, lời giải câu `uclnn-10-25`); code `src/visuals/math/uoc-chung-uoc-chung-lon-nhat/uc-lists.tsx`, hàng Ư(n): `pickedTone={shownGreatest ? "greatest" : "common"}` với `picked={common}`
- Nguồn: tr.38 mục 2, `sbt-p38.png`
- Vấn đề: ở bước cuối, trong hàng Ư(12) và Ư(18), cả 1, 2, 3, 6 cùng chuyển sang màu cam và dấu của chú thích "Ước chung lớn nhất" (walk `035-s3-01-block-end`). Ngay ở màn mở đầu khái niệm, hình nói 1, 2, 3 cũng là ước chung lớn nhất; trẻ học chậm dễ hiểu là có nhiều ƯCLN. Lời giải `ds-lon-10-25` mắc cùng lỗi (1 và 5 cùng màu cam). Đã kiểm lại trong code: lỗi ở hàng Ư(n), hàng ƯC đúng (chỉ `best` màu cam).
- Sửa: trong hàng Ư(n), các ước chung giữ `common` (xanh ngọc) ở mọi bước; chỉ số `best` đổi sang `greatest`, như hàng ƯC. Chụp lại `visual:shot` của `ds-lon-12-18` và `ds-lon-10-25`.

### 7. Cách chia dần chỉ nằm trong caption xám, thiếu bước chia lặp và bước nhân, khác tên và khác câu với bài Số nguyên tố (LL-13, LL-05)

- Vị trí: `$.sections[4].blocks[1]` (một hình `uoc-chung-uoc-chung-lon-nhat.visual.chia-dan-12` với `caption` "Chia dần 12 cho các số nguyên tố từ bé đến lớn, cho tới khi được 1.", không có note) (`uoc-chung-uoc-chung-lon-nhat.section.nhac-thua-so`); hình `ladder` (`src/visuals/math/uoc-chung-uoc-chung-lon-nhat/ladder.tsx`)
- Nguồn: tr.38 mục 3 (sách chỉ gọi tên "phân tích ra thừa số nguyên tố"); bài `so-nguyen-to`, section "Phân tích bằng sơ đồ cột"
- Vấn đề: đây là cách duy nhất bài dùng để phân tích một số, và năm bài tập cần đúng thao tác này (`phan-tich-24`, `xep-chia-dan-18`, `uclnn-16-40`, `uclnn-20-30-50`, `uclnn-12-30-42`), nhưng cách làm chỉ ở caption xám (checklist trục 5: Nghiêm trọng). Caption không nói số bên trái mỗi dòng là thương của dòng trên, còn chia hết thì chia tiếp cho chính số nguyên tố đó, và nhân các số ở cột phải để được kết quả. Bài `so-nguyen-to` gọi cách này là "sơ đồ cột" và có câu quy tắc riêng ("Chia số đó cho số nguyên tố nhỏ nhất mà nó chia hết, rồi chia tiếp thương, tới khi được 1. Các số chia là thừa số nguyên tố."); bài này gọi "chia dần" với câu khác, nên cùng một cách có hai tên giữa hai bài liền nhau.
- Sửa: biến màn thành `group` gồm note rồi hình `chia-dan-12`. Note dùng lại đúng câu quy tắc của bài `so-nguyen-to` và tên "sơ đồ cột", thêm câu nhân lại: "Nhắc lại sơ đồ cột: chia số đó cho số nguyên tố nhỏ nhất mà nó chia hết, rồi chia tiếp thương, tới khi được 1. Các số chia là thừa số nguyên tố; nhân chúng lại thì được số ban đầu." Caption chỉ còn mô tả hình ("Sơ đồ cột của 12: 12 = 2² · 3."). Có thể thêm phép chia nhỏ (12 : 2 = 6) cạnh mỗi dòng của `ladder` ở chế độ `steps` cho khớp cách viết "18 : 2 = 9" của `xep-chia-dan-18`. Đổi mọi chữ "chia dần" còn lại trong bài (đề `xep-chia-dan-18`, nhãn hình) sang "sơ đồ cột". Nếu câu quy tắc của bài `so-nguyen-to` đổi sau vòng review của nó, chép theo bản mới.

### 8. Section phân số dùng "phân số", "tử", "mẫu", "rút gọn" mà không nhắc lại, không khai kiến thức nền (LL-09)

- Vị trí: `$.sections[11]` (`uoc-chung-uoc-chung-lon-nhat.section.phan-so-toi-gian`, `sourceRef` "Sách bài tập tr.38, 40"), `$.cards[11].sourceRef`; `$.exercises[56].prompt[0]` (`rut-gon-18-24`, "Rút gọn phân số này"); `$.exercises[59].prompt[0]` (`mau-toi-gian-24-36`, "Mẫu của phân số tối giản đó là số nào?"); `content/glossary/math.json` (không có các mục này)
- Nguồn: tr.38 "Kĩ năng giải toán" gạch 3 và tr.40 câu 2.40 có "phân số tối giản", "rút gọn" nhưng không định nghĩa phân số, tử, mẫu
- Vấn đề: phân số tối giản thuộc phạm vi bài (kĩ năng 3, câu 2.40), nên giữ section ở đây là đúng. Nhưng "phân số", "tử", "mẫu", "rút gọn phân số" là kiến thức tiểu học: section không nhắc lại, glossary không ghi `prerequisite`, `sourceRef` không có dấu "Kiến thức nền (tiểu học)" như ngoại lệ của checklist trục 1 yêu cầu. "Rút gọn" không có trong note nào (note nói "đưa phân số về tối giản") nhưng là động từ chính của đề hai câu. Trẻ nhanh quên mà lẫn tử với mẫu sẽ nhập sai ở `mau-toi-gian-24-36`. Giữ mức Nghiêm trọng vì có câu trẻ có thể không làm được và vì quy ước kiến thức nền chưa được theo.
- Sửa: thêm màn đầu section một note nhắc ngắn kèm phân số mẫu: "Trong phân số 20/28, 20 là tử, 28 là mẫu. Chia cả tử và mẫu cho cùng một số thì được phân số bằng nó mà gọn hơn: đó là rút gọn phân số." `sourceRef` section và card: "Kiến thức nền (tiểu học); Sách bài tập tr.38, 40". Thêm vào glossary "phân số", "tử", "mẫu", "rút gọn" với `"prerequisite": "tiểu học"`. Dùng một cách nói thống nhất "rút gọn về phân số tối giản" ở note, recap và đề. Nên làm cùng Nên sửa 17 (tách section).

## Nên sửa

### 1. Màn thử cắt dải của section 1 đã "Xong rồi!" ngay khi mở

- Vị trí: `$.sections[0].blocks[3].children[1]` (`uoc-chung-uoc-chung-lon-nhat.visual.cat-thu-12-18`, `goal: "fits"`)
- Nguồn: —
- Vấn đề: độ dài bắt đầu 2 vừa cả dải 12 dm và 18 dm, nên màn hiện ngay "Xong rồi! Đoạn 2 dm cắt vừa hết cả hai dải.", nút − tắt (walk `006-s1-04-block`). Trẻ không phải thử gì, mất ý "thử nhiều độ dài" của note.
- Sửa: cho `CutTry` nhận độ dài bắt đầu (ví dụ `start: 4`, 4 không vừa 18) hoặc đổi đích thành "tìm đủ các độ dài vừa" (2, 3, 6). Sửa chung với Nghiêm trọng 5 vì cùng component.

### 2. Chưa nói "đoạn dài nhất cắt vừa hết là ƯCLN" mà câu kho ôn lại hỏi; hình cạnh định nghĩa ƯCLN ghi "6 là ước chung" (LL-09, LL-16)

- Vị trí: `$.sections[2].blocks[1].children[1]` (`uoc-chung-uoc-chung-lon-nhat.visual.cat-lon-nhat-12-18`); `$.sections[6].blocks[0]` (`uoc-chung-uoc-chung-lon-nhat.visual.cat-18-24-30`) và caption; `$.exercises[19]` (`uoc-chung-uoc-chung-lon-nhat.ex.doan-dai-nhat-16-48`)
- Nguồn: tr.38 mục 2
- Vấn đề: cụm "dài nhất" chỉ có ở đề `doan-dai-nhat-16-48`. Hình `cat-lon-nhat-12-18` đặt cạnh định nghĩa ƯCLN chỉ cắt đoạn 6 dm và ghi "6 là ước chung của 12 và 18" (màu xanh ngọc), không so với các đoạn ngắn hơn. Hình mở section 7 `cat-18-24-30` cũng dừng ở "6 là ước chung". `cutTry` đã có `goal: "largest"` nhưng bài không dùng.
- Sửa: ở section 3, thay `cat-lon-nhat-12-18` bằng `cutTry` với `goal: "largest"` cho 12 và 18 (có độ dài bắt đầu không vừa, xem Nên sửa 1), hoặc thêm cờ `greatest` cho `cutBars` (xem Nên sửa 3) để dòng kết luận ghi "6 dm là đoạn dài nhất cắt vừa hết cả hai dải: ƯCLN(12, 18) = 6" màu cam, kèm một câu note nói điều đó. Caption `cat-18-24-30`: "6 dm là đoạn dài nhất cắt vừa cả ba dải: 6 là ƯCLN(18, 24, 30)."

### 3. Hình cắt dải section 4 và recap gọi 7 là "ước chung" màu xanh ngọc, trong khi quy tắc nói ƯCLN và công thức tô 7 màu cam (LL-15)

- Vị trí: `$.sections[3].blocks[0]` (`uoc-chung-uoc-chung-lon-nhat.visual.cat-7-21`), `$.sections[3].recap` và `$.cards[3].recap` (`uoc-chung-uoc-chung-lon-nhat.visual.cat-7-21-xong`)
- Nguồn: tr.39 câu 2.34; tr.107 lời giải
- Vấn đề: dòng kết luận của hình "7 là ước chung của 7 và 21", 7 màu xanh ngọc; caption recap "ƯCLN(7, 21) = 7", công thức `21 ⋮ 7` tô 7 màu cam. Cùng số 7 có hai tên, hai màu; hình recap không nói điều recap muốn trẻ nhớ.
- Sửa: thêm cờ `greatest: true` cho `cutBars` để dòng kết luận ghi "ƯCLN(7, 21) = 7" màu cam; dùng cho `cat-7-21`, `cat-7-21-xong` và hình ở Nên sửa 2.

### 4. Câu đếm đoạn 15 dm và 20 dm cần 3 phép tính, hình lời giải không ra số 7 (LL-18, LL-15)

- Vị trí: `$.exercises[4]` (`uoc-chung-uoc-chung-lon-nhat.ex.dem-doan-15-20`), `hints.solutionVisualId` = `cat-giai-15-20`
- Nguồn: —
- Vấn đề: tính 15 : 5, 20 : 5 rồi 3 + 4 là 3 phép tính, vượt luật "tối đa 2 phép tính nhẩm", và luyện phép chia nhiều hơn khái niệm ước chung. Hình lời giải chỉ cắt hai dải rồi kết luận "5 là ước chung", không dòng nào ra 7.
- Sửa: đổi đề về đúng ý ước chung ("Đoạn 5 dm có cắt vừa hết cả hai dải không?", hay hỏi số đoạn của một dải), hoặc giữ đề và đổi lời giải sang hình `notation` ba dòng `15 : 5 = 3`, `20 : 5 = 4`, `3 + 4 = 7`.

### 5. Kí hiệu "Ư(6)", "Ư(12)" xuất hiện ở màn quy tắc và recap mà chưa dạy (LL-09)

- Vị trí: hình `uoc-chung-uoc-chung-lon-nhat.visual.uclnn-uc-12-18` (`$.sections[7].blocks[0]`), `uoc-chung-uoc-chung-lon-nhat.visual.uclnn-uc-24-36` (`$.sections[7].blocks[1].children[1]`, `$.sections[7].recap`, `$.cards[7].recap`); dữ liệu trong `src/visuals/math/uoc-chung-uoc-chung-lon-nhat/catalog.ts` ("Ư(6) = {1; 2; 3; 6}", "Ư(12) = {…}")
- Nguồn: kí hiệu có ở tr.39 câu 2.33, bài không dạy
- Vấn đề: bài chỉ dạy ƯC(…) và ƯCLN(…) (hình `ky-hieu-12-18`). Dòng Ư(a) ở giữa hai hình này chính là bước nối ƯCLN với ƯC của quy tắc; trẻ đọc không hiểu thì mất đúng bước cần nhớ.
- Sửa: viết dòng đó bằng lời ("Các ước của 6: 1, 2, 3, 6"), hoặc thêm vào note màn đầu section 8: "Ư(6) là tập các ước của 6."

### 6. Bước "số mũ nhỏ nhất bằng 1" dựa vào 3 = 3¹, bài không nhắc (LL-16)

- Vị trí: hình `bang-36-60` (`$.sections[5].blocks[0]`), `bang-20-30`, `bang-18-24-30` (hàng "Mũ nhỏ nhất"); `$.exercises[29]` (`xep-uclnn-12-30`)
- Nguồn: —
- Vấn đề: ở cột 3² và 3, bảng ghi "Mũ nhỏ nhất: 1" mà không màn nào nói "3 cũng là 3¹". Trẻ thấy "3" không số mũ dễ nghĩ số mũ là 0 hoặc bỏ cột đó, đúng chỗ hay sai nhất.
- Sửa: thêm vào note "cùng làm" `$.sections[5].blocks[3].children[0]`: "Thừa số viết không có số mũ thì số mũ là 1, như 3 = 3¹."

### 7. Section 5 nhắc lại: recap thiếu định nghĩa số nguyên tố, và các câu nhắc lại khác chữ bài Số nguyên tố (LL-06, LL-05)

- Vị trí: `$.sections[4].recap`, `$.cards[4].recap`, `$.sections[4].blocks[0].children[0].text`, `$.sections[4].blocks[2].children[0].text` (`uoc-chung-uoc-chung-lon-nhat.section.nhac-thua-so`); `$.exercises[20]` (`chon-sn-13`), `$.exercises[23]` (`dien-sn-chinh-no`)
- Nguồn: bài `so-nguyen-to`, recap section "Số nguyên tố", "Phân tích bằng sơ đồ cây", "Viết gọn bằng luỹ thừa"
- Vấn đề: recap chỉ có ý phân tích, nhưng câu kiểm tra `chon-sn-13` và câu kho ôn `dien-sn-chinh-no` (gắn card này) hỏi định nghĩa số nguyên tố. Các câu nhắc lại cũng lệch bài trước: "Số nguyên tố là số lớn hơn 1, ..." (bài trước: "số tự nhiên lớn hơn 1"), "thành tích của các số nguyên tố. Thừa số nào lặp lại thì viết bằng luỹ thừa" (bài trước: "thành tích các thừa số nguyên tố", "Thừa số nguyên tố nào lặp lại thì viết gọn bằng luỹ thừa"). Một quy tắc nói hai cách giữa hai bài liền nhau.
- Sửa: chép đúng câu quy tắc của bài `so-nguyen-to` cho định nghĩa số nguyên tố và câu luỹ thừa. Recap section 5 (tối đa 2 câu): "Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó. Phân tích một số ra thừa số nguyên tố là viết số đó thành tích các thừa số nguyên tố." Nếu muốn giữ câu luỹ thừa trong recap thì đổi card của `dien-sn-chinh-no`.

### 8. Câu luyện `uclnn-20-30-50` quá nhiều bước, section 7 không có màn làm trọn ƯCLN ba số (LL-18, LL-16)

- Vị trí: `$.exercises[31]` (`uoc-chung-uoc-chung-lon-nhat.ex.uclnn-20-30-50`, câu luyện `uclnn-ba-so`); `$.sections[6].blocks[3]` (chạm `chon-chung-12-20-28`)
- Nguồn: —
- Vấn đề: trẻ phải tự phân tích ba số, chọn thừa số chung, lấy số mũ nhỏ nhất rồi nhân, vượt xa "tối đa 2 phép tính". Màn tương tác duy nhất của section dừng ở chọn thừa số chung.
- Sửa: cho sẵn phân tích trong đề như `uclnn-8-12-20` ("Ta có 20 = 2² · 5, 30 = 2 · 3 · 5, 50 = 2 · 5²."), hoặc cho màn `chon-chung-12-20-28` làm tiếp tới ƯCLN(12, 20, 28) = 4.

### 9. Bước cuối của `xep-chia-dan-18` viết "2 · 3 · 3", trái quy tắc viết bằng luỹ thừa (LL-05)

- Vị trí: `$.exercises[24].items[3]` (`uoc-chung-uoc-chung-lon-nhat.ex.xep-chia-dan-18`, mục `s4`)
- Nguồn: —
- Vấn đề: quy tắc và recap section 5 dặn "Thừa số nào lặp lại thì viết bằng luỹ thừa"; hình `ladder` luôn kết thúc dạng luỹ thừa. Kết quả cuối của câu lại là "18 = 2 · 3 · 3".
- Sửa: "18 = 2 · 3²" (theo số mới ở Nên sửa 16: "45 = 3² · 5").

### 10. Màu tím vừa là "Một đoạn" vừa là "Số mũ" trong section 7 (LL-03)

- Vị trí: `$.sections[6].blocks[0]` (hình `cat-18-24-30`, chú giải "Một đoạn" tím) và `$.sections[6].blocks[1]` (hình `bang-18-24-30`, chú giải "Số mũ" tím); `src/visuals/math/uoc-chung-uoc-chung-lon-nhat/cut-bars.tsx` (`color="violet"`)
- Nguồn: —
- Vấn đề: hai màn liền nhau, cùng màu tím, hai tên. Bài đặt `so-mu` = violet trong `concepts`; độ dài một đoạn (vốn là ước chung) không nên mang màu của số mũ.
- Sửa: đổi viền "Một đoạn" của `cutBars` sang slate (trung tính), áp cho mọi hình `cutBars` của bài.

### 11. `sourceRef` ghi "(kĩ năng 3)" nhưng kĩ năng 3 của trang là phân số tối giản; section 8 thiếu câu 2.35

- Vị trí: `$.sections[4].sourceRef`, `$.sections[5].sourceRef`, `$.sections[6].sourceRef`, `$.cards[4..6].sourceRef`; `$.sections[7].sourceRef`, `$.cards[7].sourceRef`
- Nguồn: tr.38 `sbt-p38.png` (cách tìm ƯCLN bằng phân tích là "Kiến thức cần nhớ" mục 3); tr.39 câu 2.35, lời giải tr.107
- Vấn đề: trỏ sai mục trên đúng trang. Section 5 (số nguyên tố, sơ đồ cột) là kiến thức của bài Số nguyên tố, không có trên trang nguồn nào của bài này.
- Sửa: section 6, 7 và card: "Sách bài tập tr.38 (kiến thức cần nhớ 3)". Section 5 và card: "Nhắc lại bài Số nguyên tố; Sách bài tập tr.38 (kiến thức cần nhớ 3)" (theo dạng lint chấp nhận). Section 8 và card: "Sách bài tập tr.38 (kiến thức cần nhớ 4), câu 2.35 tr.39".

### 12. Section 5, 6, 8, 11, 12 không có ví dụ đời sống (LL-16)

- Vị trí: `$.sections[4]`, `$.sections[5]`, `$.sections[7]`, `$.sections[10]`, `$.sections[11]`
- Nguồn: —
- Vấn đề: luật "Ví dụ đời sống ở mọi section Toán" của `lesson-author`. Các section này chỉ có số trơn, kể cả câu luyện và câu ôn.
- Sửa: mỗi section thêm một câu hay một ví dụ gắn đời sống, số nhỏ. Section 6: "36 cái kẹo và 60 cái bánh chia đều vào các túi, không thừa. Nhiều nhất bao nhiêu túi?" (dùng lại bảng 36, 60). Section 8: "Chia đều 24 bút chì và 40 cục tẩy cho các bạn trong nhóm, không thừa. Chọn tất cả các số bạn có thể có trong nhóm." (câu chọn nhiều đáp án, ƯCLN 8; không dùng `numeric` vì có nhiều đáp án). Section 11: thêm vào caption `hh-28` "Tháng Hai của năm thường có 28 ngày, và 28 cũng là số hoàn hảo." Section 12: "Chiếc bánh cắt thành 8 miếng bằng nhau, bạn ăn 2 miếng: bạn ăn 2/8 chiếc bánh, rút gọn là 1/4." Section 5: "12 cái kẹo chia đôi được 6 cái, 6 cái chia đôi được 3 cái: 12 : 2 = 6, 6 : 2 = 3, nên 12 = 2² · 3." (đi đúng các dòng của sơ đồ cột, không đặt thêm phép nhân "n nhóm, mỗi nhóm m").

### 13. `hoan-hao-8`, `hoan-hao-12`: chỉ một lựa chọn "Không", đoán được bằng mẹo (LL-14)

- Vị trí: `$.exercises[50].options` (`hoan-hao-8`), `$.exercises[52].options` và `$.exercises[52].prompt[0].text` (`hoan-hao-12`)
- Nguồn: tr.40 câu 2.38
- Vấn đề: một lựa chọn "Không, ..." (đáp án, ở `hoan-hao-8` còn dài nhất, xuống hai dòng trên điện thoại `133-s11-05`) và ba lựa chọn "Có, ...". `hoan-hao-12` in sẵn tổng 16 trong đề. Nhiễu "Có, vì 12 là số chẵn", "Có, vì 8 chia hết cho 4" không ứng với lỗi khi cộng ước.
- Sửa: bỏ tổng khỏi đề; mỗi lựa chọn là "tổng + kết luận", nhiễu ứng với lỗi thật. `hoan-hao-8`: "Tổng là 7, nên 8 không là số hoàn hảo" (đúng) / "Tổng là 15, nên 8 không là số hoàn hảo" (cộng cả 8) / "Tổng là 6, nên 8 không là số hoàn hảo" (bỏ sót 1) / "Tổng là 8, nên 8 là số hoàn hảo". `hoan-hao-12`: "Tổng là 16, nên 12 không là số hoàn hảo" (đúng) / "Tổng là 12, nên 12 là số hoàn hảo" (bỏ sót 4) / "Tổng là 28, nên 12 không là số hoàn hảo" (cộng cả 12) / "Tổng là 15, nên 12 không là số hoàn hảo" (bỏ sót 1).

### 14. Điều kiện "mỗi hộp từ 2 bút trở lên" của ví dụ mẫu chỉ nằm trong hình quy tắc (LL-10)

- Vị trí: `$.sections[9].blocks[0].children[0].text` (note "An mua 14 bút, Bình mua 21 bút...") và hình `bai-toan-ket-luan` (`uoc-chung-uoc-chung-lon-nhat.section.bai-toan-uc`)
- Nguồn: tr.40 câu 2.37
- Vấn đề: câu chuyện mở đầu không nêu điều kiện, nên số bút mỗi hộp có thể là 1 hay 7. Điều kiện chỉ xuất hiện như nhãn hình ở màn sau (`117-s10-02-block`), trong khi câu kiểm tra `hop-but-10-15` cần dùng đúng điều kiện này.
- Sửa: đưa điều kiện vào note đầu ("..., mỗi hộp có từ 2 bút trở lên. Mỗi hộp có mấy bút?"), sửa cùng lúc cách nói ở Góp ý 14 và bộ số mới ở Nên sửa 16.

### 15. `banh-moi-tui-18-27` thiếu "không thừa", câu khó đọc (LL-10)

- Vị trí: `$.exercises[42].prompt[0].text` (`uoc-chung-uoc-chung-lon-nhat.ex.banh-moi-tui-18-27`)
- Nguồn: tr.39 Ví dụ 2
- Vấn đề: "chia đều vào nhiều nhất các túi quà như nhau" không có "không thừa", điều kiện có trong quy tắc section và mọi câu khác; được thừa thì số túi không bị chặn. Cụm "vào nhiều nhất các túi" ngược trật tự câu.
- Sửa (với bộ số mới ở Nên sửa 16): "Có 15 cái bánh và 40 cái kẹo chia đều vào các túi quà như nhau, không thừa. Chia được nhiều túi nhất thì mỗi túi có bao nhiêu cái bánh?" (đáp án 3).

### 16. Câu kho ôn, câu kiểm tra, màn chạm lặp số của nhau và của recap (LL-07)

- Vị trí: các mục trong bảng dưới
- Nguồn: —
- Vấn đề: phiên ôn gặp lại bộ số trẻ vừa thấy kết quả. Ví dụ: màn quy tắc `ds-8-12-xong` in sẵn ƯC(8, 12) = 1, 2, 4, là đáp án của `cat-8-12-tu-lam` và màn chạm `chon-uclnn-8-12`; màn chạm `chon-uc-6-9` lặp câu kiểm tra `chon-cat-6-9` ngay trước; câu kiểm tra `uc-uclnn-16-40` in sẵn "ƯCLN(16, 40) = 8", là đáp án câu ôn `uclnn-16-40`; `xep-chia-dan-18` có đúng các dòng của hình nấc 2 `chia-dan-goi-y-18`; `chon-uclnn-18-30` dùng 18 và 30 của câu mở bài và recap section 9; recap `uclnn-uc-24-36` in sẵn ƯCLN(24, 36) = 12 và ƯC(24, 36), là đáp án `chia-het-24-36` và `mau-toi-gian-24-36`; ƯC(12, 18) là ví dụ chính của section 2, 3, 8 nên `tui-ke-12-18` chỉ là nhớ lại; `banh-moi-tui-18-27` lặp cặp của `chon-uc-18-27`; ví dụ 14, 21 section 10 lặp `chon-uc-14-21`; `hop-but-10-15` lặp `uc-10-15` và giữ tên "Tuấn", "Hà", điều kiện, đáp án 5 của câu 2.37 (LL-08 nhẹ); `uclnn-16-24` trùng số và đáp án Ví dụ 2 tr.39; hình gợi ý `rg-goi-y-14-35` in ƯCLN(14, 35) = 7, đáp án `dia-14-35`; `uc-la-uoc-cua` dùng 36, 60 của recap section 6; `uclnn-12-30-42` có cặp 12, 30 và đáp án 6 của `xep-uclnn-12-30`.
- Sửa: đổi theo bảng (đã soát: các cặp mới không là cặp nào đang dùng trong bài, và không trùng nhau). Tự giải lại từng câu, từng nhiễu sau khi đổi (LL-01) và soát trùng lại cả bài.

  | Mục | Số mới | Đáp án mới |
  |---|---|---|
  | `$.exercises[1]` `cat-8-12-tu-lam` | 9 dm và 21 dm | 3 |
  | `$.sections[1].blocks[1].children[1]` `ds-8-12-xong` | 10 và 14 | ƯC 1, 2 |
  | `$.sections[2].blocks[3].children[1]` `chon-uclnn-8-12` | 20 và 24 | 4 |
  | `$.sections[1].blocks[2].children[1]` `chon-uc-6-9` | 15 và 25 | 1 và 5 |
  | `$.exercises[10]` `uclnn-16-24` | 26 và 39 | 13 |
  | `$.exercises[27]` `uclnn-16-40` | 24 và 56 | 8 |
  | `$.exercises[24]` `xep-chia-dan-18` | 45 (45 : 3 = 15, 15 : 3 = 5, 5 : 5 = 1) | 45 = 3² · 5 |
  | `$.exercises[28]` `chon-uclnn-18-30` | 42 = 2 · 3 · 7 và 70 = 2 · 5 · 7; lựa chọn 2 · 7, 2 · 3 · 5 · 7, 7, 2 · 5 | 2 · 7 = 14 |
  | `$.exercises[38]` `uc-la-uoc-cua` | 40 và 60 | ƯCLN 20 |
  | `$.exercises[34]` `uclnn-12-30-42` | 18, 30 và 42 | 6 |
  | `$.exercises[48]` `chia-het-24-36` | 27 và 45; lựa chọn 3, 5, 9, 15 | 3 và 9 |
  | `$.exercises[59]` `mau-toi-gian-24-36` | 33/55 | 3/5, mẫu 5 |
  | `$.exercises[49]` `tui-ke-12-18` | 32 và 48, mỗi túi từ 10 cái trở lên | 16 |
  | `$.exercises[42]` `banh-moi-tui-18-27` | 15 bánh và 40 kẹo | 5 túi, mỗi túi 3 bánh |
  | `$.sections[9].blocks[0]` ví dụ `ds-14-21` | 22 và 33, mỗi hộp từ 2 bút trở lên | 11 |
  | `$.exercises[45]` `hop-but-10-15` | 21 và 28 bút, đổi tên hai bạn (không dùng Tuấn, Hà) | 7 |
  | `$.exercises[56].hints.hintVisualId` `rg-goi-y-14-35` | 6/15 | ƯCLN 3, được 2/5 |

### 17. Section 12 gộp hai quy tắc, recap phải ghép hai câu

- Vị trí: `$.sections[11].blocks[1].children[0]`, `$.sections[11].blocks[2].children[0]` (cả hai `rule: true`), `$.sections[11].recap.caption`
- Nguồn: tr.38 kĩ năng 3
- Vấn đề: section dạy hai điều cần nhớ riêng (nhận biết phân số tối giản; rút gọn bằng cách chia cho ƯCLN) trong 3 màn, không còn chỗ cho phần nhắc tiểu học (Nghiêm trọng 8) và ví dụ đời sống (Nên sửa 12).
- Sửa: tách thành "Phân số tối giản" (nhắc tử, mẫu; định nghĩa; câu `chon-toi-gian`) và "Rút gọn về phân số tối giản" (ví dụ bánh; quy tắc chia cho ƯCLN; câu `rut-gon-18-24`), mỗi section một recap một câu, mỗi section một card.

### 18. Một ý hai cách nói: "không kể chính nó" và "các ước nhỏ hơn 6" (LL-05)

- Vị trí: hình `hh-6`, `hh-6-xong` (nhãn "Các ước nhỏ hơn 6 cộng lại"), `hh-28` (label "Các ước của 28 nhỏ hơn 28 cộng lại bằng 28") trong `catalog.ts`; so với note quy tắc và các đề "không kể 8", "không kể 12" (`uoc-chung-uoc-chung-lon-nhat.section.so-hoan-hao`)
- Nguồn: tr.40 câu 2.38
- Vấn đề: quy tắc và mọi bài tập nói "không kể chính nó", hình recap cuối section (`140-s11-07-recap`) nói "nhỏ hơn 6". Trẻ học chậm dễ nghĩ đó là hai điều kiện khác nhau.
- Sửa: nhãn "Cộng các ước, không kể 6" và "Cộng các ước, không kể 28".

### 19. Section 12 mở bằng cách chia cho 2 nhiều lần, quy tắc lại chia một lần cho ƯCLN, không câu nào nối hai cách (LL-05, LL-16)

- Vị trí: `$.sections[11].blocks[0]` (hình `uoc-chung-uoc-chung-lon-nhat.visual.rg-20-28`, caption "Chia cả tử và mẫu cho 2, rồi lại cho 2, đến khi không chia tiếp được nữa."), `$.sections[11].blocks[2].children[0]` (quy tắc "ta chia cả tử và mẫu cho ƯCLN của chúng. Ví dụ ƯCLN(20, 28) = 4."), recap `tg-tom-tat`
- Nguồn: tr.38 kĩ năng 3 ("vận dụng ƯCLN đưa phân số về tối giản")
- Vấn đề: màn mẫu đầu tiên dạy một cách (chia dần cho 2), quy tắc và recap dạy cách khác (chia một lần cho 4). Không câu nào nói hai cách cùng ra 5/7 hay vì sao chia cho ƯCLN nhanh hơn (2 · 2 = 4). Trẻ có thể nhớ cách ở màn đầu rồi dừng giữa chừng, hoặc không hiểu "Ví dụ ƯCLN(20, 28) = 4" dùng vào đâu.
- Sửa: đổi màn đầu sang đúng cách của quy tắc (hình hai dòng: ƯCLN(20, 28) = 4; 20/28 = (20 : 4)/(28 : 4) = 5/7), hoặc giữ màn chia dần và thêm câu note ngay sau: "Chia cho 2 hai lần cũng là chia cho 4 = ƯCLN(20, 28). Chia luôn cho ƯCLN thì chỉ cần một bước." Câu quy tắc nói hết ví dụ: "... Ví dụ ƯCLN(20, 28) = 4 nên 20/28 rút gọn được 5/7."

## Góp ý

### 1. Section 1 chưa nói thành lời mối nối "cắt vừa hết" với "là ước" (LL-16)

- Vị trí: `$.sections[0].blocks[0..2]` (`uoc-chung-uoc-chung-lon-nhat.section.uoc-chung`)
- Nguồn: tr.38 mục 1
- Vấn đề: màn 1 đã ghi "3 là ước chung của 12 và 18" trước khi định nghĩa; không câu nào nói "dải 12 dm cắt vừa hết thành đoạn 3 dm vì 12 chia hết cho 3, tức 3 là ước của 12".
- Sửa: thêm câu đó vào caption màn 1 hay note màn quy tắc.

### 2. Màn "1 luôn là ước chung" chưa cho thấy 7 và 10 chỉ có ước chung là 1; màn chạm 6 và 9 nhắc "danh sách" mà không hiện danh sách (LL-19)

- Vị trí: `$.sections[1].blocks[3]` (formula `7 = 1 · 7`, `10 = 1 · 10`); `$.sections[1].blocks[2].children[0].text`
- Nguồn: —
- Vấn đề: công thức chỉ cho thấy 1 là ước của từng số. Màn chạm nói "Đối chiếu hai danh sách ước" nhưng không có danh sách; "đối chiếu" là từ Hán Việt khó.
- Sửa: thay công thức bằng hai hàng `ucLists` Ư(7): 1, 7 và Ư(10): 1, 2, 5, 10. Note màn chạm: "So các ước của 15 với các ước của 25 giúp bạn không bỏ sót số nào." (theo số mới ở Nên sửa 16).

### 3. Màn kí hiệu ƯC, ƯCLN chưa nói cách đọc

- Vị trí: `$.sections[2].blocks[2]` (`uoc-chung-uoc-chung-lon-nhat.visual.ky-hieu-12-18`)
- Nguồn: tr.39 câu 2.33
- Vấn đề: từ section 4, quy tắc dùng `ƯCLN(7, 21) = 7` nhưng chưa câu nào đọc kí hiệu thành lời.
- Sửa: thêm vào note "ƯCLN(12, 18) = 6 đọc là: ước chung lớn nhất của 12 và 18 bằng 6."

### 4. Ý "ba số" ở section 4 chỉ nằm trong note thường, recap chỉ nói hai số (LL-06)

- Vị trí: `$.sections[3].blocks[1..2]`, `$.sections[3].recap`, `$.cards[3].recap`; câu ôn `$.exercises[17]` (`uclnn-3-18-27`)
- Nguồn: tr.39 câu 2.34b
- Vấn đề: recap chỉ nói "ƯCLN của hai số là số bé", câu ôn hỏi ba số.
- Sửa: "Nếu các số kia đều chia hết cho số bé nhất thì ƯCLN là số bé nhất. Ví dụ 21 chia hết cho 7 nên ƯCLN(7, 21) = 7." cho rule, recap section và recap card.

### 5. Nhiễu yếu trong các câu điền từ (LL-14)

- Vị trí: `$.exercises[3].bank` (`dien-uc-20-30`: "số dư"), `$.exercises[39].bank` (`dien-tim-uclnn`: "tổng", "tích"), `$.exercises[23].bank` (`dien-sn-chinh-no`: "số 0"), `$.exercises[44].bank` (`dien-so-phan-nhieu-nhat`: "tổng", "tích"), `$.exercises[54].bank` (`dien-tong-uoc`: "tích", "hiệu")
- Nguồn: —
- Vấn đề: các từ này không ứng với lỗi hiểu sai nào của bài, trẻ loại ngay.
- Sửa: `dien-uc-20-30`: "bội" (nhầm ước với bội). `dien-tim-uclnn`: "ước chung", "số bé nhất". `dien-sn-chinh-no`: "số 2", "số 3". `dien-so-phan-nhieu-nhat`: "hiệu" (lỗi lấy 20 − 12), "số bé hơn"; không thêm "ước chung" vì câu đó cũng đúng (LL-01). `dien-tong-uoc`: "số lượng" (đếm các ước thay vì cộng).

### 6. Phạm vi bỏ "Kiến thức bổ sung", câu 2.41-2.43 và Ví dụ 1: chấp nhận được

- Vị trí: toàn bài (giả định trong `notebooks/backlogs/lesson-uoc-chung-uoc-chung-lon-nhat/task.md`)
- Nguồn: tr.38 mục 5-6 và Ví dụ 1; tr.40 câu 2.41-2.43
- Vấn đề: không phải lỗi. Đây là phần "bổ sung", cần biến chữ m, n và lý luận "(m, n) = 1", quá sức trẻ đang yếu nhân chia; Ví dụ 1 cần "hiệu chia hết", chưa dạy. Mọi kĩ năng bắt buộc ở tr.38 đều có section.
- Sửa: giữ như hiện tại.

### 7. Nấc 1 tô cả đề ở các câu mà chỗ dễ sai là số mũ

- Vị trí: `$.exercises[28].hints` (`chon-uclnn-18-30`), `$.exercises[30].hints` (`uclnn-8-12-20`)
- Nguồn: —
- Vấn đề: lỗi hay gặp là lấy số mũ lớn nhất hoặc lấy cả thừa số không chung; highlight `block` tô cả đề, không có `hintVisualId`.
- Sửa: tách phân tích trong đề thành khối `formula` có `\htmlId` quanh các số mũ rồi trỏ `target: "part"`, hoặc thêm hình nấc 2 `expTable` mode `hint` với số khác đề.

### 8. Đề mở bằng "Phân tích 28 = …" đọc như một lệnh (LL-10)

- Vị trí: `$.exercises[25].prompt`, `$.exercises[26].prompt`, `$.exercises[28].prompt`, `$.exercises[30].prompt` (`chon-chung-28-42`, `tinh-uclnn-24-36`, `chon-uclnn-18-30`, `uclnn-8-12-20`)
- Nguồn: —
- Vấn đề: trẻ có thể nghĩ mình phải phân tích lại.
- Sửa: "Ta có 28 = 2² · 7 và 42 = 2 · 3 · 7."

### 9. Màn chạm đứng trước màn "cùng làm" ở section 6

- Vị trí: `$.sections[5].blocks[2]` (chạm `chon-chung-20-30`) và `$.sections[5].blocks[3]` (cùng làm `bang-20-30`)
- Nguồn: —
- Vấn đề: thứ tự mẫu, tự chạm, rồi mới cùng làm, ngược "mẫu → cùng làm → tự làm"; màn chạm là bước nhỏ nên ảnh hưởng ít.
- Sửa: đổi chỗ hai màn, hoặc đổi số màn chạm khác 20 và 30.

### 10. Hình ví dụ số nguyên tố không nói thẳng "6 không là số nguyên tố"

- Vị trí: hình `sn-vi-du` (`$.sections[4].blocks[0].children[1]`)
- Nguồn: —
- Vấn đề: nhãn "6 còn có ước 2 và 3" để trẻ tự suy; kết luận chỉ có ở nhãn đọc màn hình.
- Sửa: "6 còn có ước 2 và 3, nên 6 không là số nguyên tố".

### 11. Quy tắc ƯCLN chưa nói trường hợp không có thừa số chung

- Vị trí: `$.sections[5].blocks[1].children[0]` hoặc màn chạm `$.sections[5].blocks[2]`
- Nguồn: tr.38 mục 3 (điều kiện "các số lớn hơn 1")
- Vấn đề: section 12 dùng ƯCLN bằng 1; theo câu quy tắc, khi không có thừa số chung thì không có gì để nhân. Section 2 đã có ví dụ 7 và 10 nên ảnh hưởng nhỏ.
- Sửa: thêm vào note "cùng làm": "Không có thừa số chung thì ƯCLN bằng 1."

### 12. Câu luyện `tong-uoc-15` không chạm tới khái niệm số hoàn hảo

- Vị trí: `$.exercises[51]` (`tong-uoc-15`, câu luyện duy nhất của section 11)
- Nguồn: tr.40 câu 2.38
- Vấn đề: đề cho sẵn các ước, chỉ hỏi 1 + 3 + 5.
- Sửa: dùng một câu theo khuôn mới ở Nên sửa 13 (ví dụ với 15: "Tổng là 9, nên 15 không là số hoàn hảo" / "Tổng là 24, ..." (cộng cả 15) / "Tổng là 8, ..." (bỏ sót 1) / "Tổng là 15, nên 15 là số hoàn hảo") làm câu luyện, đưa `tong-uoc-15` vào kho ôn.

### 13. Đề "Chạm vào số đĩa ..." nói số ít nhưng có hai đáp án; note thiếu dòng "để làm gì" (LL-10)

- Vị trí: `$.sections[8].blocks[3].children[0].text` (hình `chon-dia-8-12`)
- Nguồn: —
- Vấn đề: "Chạm vào số đĩa" đọc như chỉ một số; bộ đếm "Đã chọn 0/2" gỡ được phần nào.
- Sửa: "Chạm vào tất cả các số đĩa chia đều được 8 quả táo và 12 quả lê, không thừa. Tìm đủ các số này giúp bạn thấy số lớn nhất là ƯCLN."

### 14. Cụm "đều là các hộp bút như nhau" khó hiểu (LL-19)

- Vị trí: `$.sections[9].blocks[0].children[0].text`, `$.exercises[45].prompt[0].text`, `$.exercises[49].prompt[0].text` ("đều theo các túi như nhau")
- Nguồn: —
- Vấn đề: nghe như các hộp giống nhau về hình dạng, không nói rõ số bút trong mỗi hộp bằng nhau.
- Sửa: "Hai bạn mua bút theo hộp, mỗi hộp có số bút như nhau."

### 15. "Bé" và "nhỏ" dùng lẫn trong các câu quy tắc (LL-05)

- Vị trí: `$.sections[3].blocks[1].children[0].text` ("số bé"), `$.sections[3].blocks[2].children[0].text` ("Số bé nhất"), `$.sections[5].blocks[1].children[0].text` ("số mũ nhỏ nhất"), hàng "Mũ nhỏ nhất" trong `exp-table.tsx`, câu nhắc sơ đồ cột ("số nguyên tố nhỏ nhất")
- Nguồn: —
- Vấn đề: hai từ cùng nghĩa, nhưng trẻ học chậm ghép quy tắc bằng chữ. Hiện section 4 dùng "bé", section 5-6 dùng "nhỏ".
- Sửa: chốt "nhỏ nhất" cho số mũ và số nguyên tố (khớp bảng và bài `so-nguyen-to`), "số bé"/"số bé nhất" chỉ cho việc so hai, ba số đã cho ở section 4; không đổi chéo khi sửa các mục trên.
