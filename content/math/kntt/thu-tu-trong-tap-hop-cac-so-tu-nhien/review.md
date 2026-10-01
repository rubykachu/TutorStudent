# Review: Thứ tự trong tập hợp các số tự nhiên (`thu-tu-trong-tap-hop-cac-so-tu-nhien`)

- Bài: `content/math/kntt/thu-tu-trong-tap-hop-cac-so-tu-nhien/lesson.json`
- Vòng: 2 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/` - sbt-p11, sbt-p12, sbt-p13, sbt-p96 (nửa đầu, lời giải Bài 3); thêm `sources/math/cach-ghi-so-tu-nhien/sbt-p7.png` (ℕ, ℕ*)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa có trong `ids.lock.json`, đúng với bài chưa duyệt)
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/thu-tu-trong-tap-hop-cac-so-tu-nhien/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `574e93803ddca01ce3cfef7341dfc8bc3e9496213e6523af37b0469936a04934` (`pnpm content:diff` so với bản này)

Tên viết tắt dưới đây: id đầy đủ có tiền tố `thu-tu-trong-tap-hop-cac-so-tu-nhien.` (vd `ex.cot-km-20-15`). Hình ghi theo khoá trong `src/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/catalog.ts`. Ba reviewer tự giải cả 83 câu trước khi đọc `answer`: đáp án của bài khớp ở mọi câu, không câu nào có đáp án đúng thứ hai. Bốn mẹo có điều kiện (`tip.doi-loi-thanh-dau`, `tip.so-cung-chu-so`, `tip.lien-sau-tan-cung-9`, `tip.dem-so-hay-do-khoang`) đã thử trên số biên, đúng hết.

Đối chiếu vòng 1: 9 trong 10 mục Nghiêm trọng đã sửa đúng (mục 1, 2, 3, 5, 6, 7, 8, 9, 10 phần dấu kép). Mục 4 (chép ví dụ b của sách) còn câu "ba khúc", ghi ở mục 1 dưới đây. Bản sửa theo vòng 1 sinh 5 vấn đề mới (LL-20): mục 5, 6, 7, 9, 17.

Về mức chép sách (LL-08), giữ cách xếp của vòng 1: câu bằng lời gần nguyên văn là Nghiêm trọng.

## Nghiêm trọng

### 1. Câu "Hai điểm A và B cắt tia số làm ba khúc: đoạn OA, đoạn AB và phần còn lại" vẫn là câu ví dụ b của sách, chỉ đổi động từ

- Vị trí: `$.sections[11].blocks[0].children[1].text` (`section.phan-tia-so`). LL-08.
- Nguồn: tr.11 ví dụ b, `sbt-p11.png`
- Vấn đề: Vòng 1 (mục 4) đã ghi câu này gần nguyên văn và đề nghị viết lại. Bản sửa chỉ đổi "chia … thành" sang "cắt … làm ba khúc", còn khuôn câu và cả dãy tên giữ như sách. Câu cũng không nói mỗi phần đi từ đâu tới đâu, nên bạn phải đoán "đoạn OA" là phần nào từ màu của hình.
- Sửa: Viết lại bằng lời của bài, giữ ba tên và dùng chữ "phần" như các màn sau (xem mục 22): "A và B cắt tia số thành ba phần. Từ O tới A là đoạn OA. Từ A tới B là đoạn AB. Phần sau B là phần còn lại." Có thể thêm "A là đầu chung của đoạn OA và đoạn AB" (mục 35).

## Nên sửa

### 2. Note màn đầu nói "Ở bài này" vạch cách nhau 1 đơn vị, trái với section ngay sau

- Vị trí: `$.sections[0].blocks[1].children[0].text` (`section.tia-so`). LL-10.
- Nguồn: tr.11 ý 1 "Kiến thức cần nhớ", `sbt-p11.png`; tr.12 bài 1.23, `sbt-p12.png`
- Vấn đề: "Ở bài này hai vạch liền nhau cách nhau 1 đơn vị." Section `chon-don-vi` ngay sau dạy vạch cách nhau 5 đơn vị. Bạn đọc đúng từng chữ sẽ nghĩ cả bài luôn là 1 đơn vị, rồi gặp ngay điều ngược lại.
- Sửa: "Trên tia số này, hai vạch liền nhau cách nhau 1 đơn vị."

### 3. Câu quy tắc `chon-don-vi` bảo "tìm số đơn vị giữa hai vạch" mà không màn nào dạy cách tìm; mọi đề đều cho sẵn; recap card bỏ nửa cách đọc

- Vị trí: `$.sections[1].blocks[1].children[0].text` (note `rule`), `$.sections[1].recap.caption`, `$.cards[1].recap.caption` (`card.vach-don-vi`); đề `$.exercises[6].prompt[0]` (`ex.kt-doc-vach-5`), `$.exercises[7].prompt[0]` (`ex.doc-q-35`), `$.exercises[8..10].prompt[0]`. LL-16, LL-10, LL-06.
- Nguồn: tr.12 bài 1.23 (Hình 1.2 chỉ ghi 0 và 10, phải tự suy ra mỗi khoảng 5 đơn vị), `sbt-p12.png`; lời giải tr.96
- Vấn đề: Việc chính của bài 1.23 là suy ra số đơn vị giữa hai vạch từ hai số đã ghi. Quy tắc nêu bước này, nhưng màn mẫu, màn cùng làm và cả năm đề đều viết sẵn "Hai vạch liền nhau cách nhau 5 đơn vị", nên bạn chưa lần nào làm bước "tìm". "Rồi đếm từ gốc O" cũng không nói đếm thế nào (đếm cách 5 chỉ có trong `explain`). Recap card `vach-don-vi` còn bỏ hẳn câu "Muốn đọc điểm…", nên ôn bằng card thì không còn cách đọc.
- Sửa: Màn mẫu `vach-5` chỉ rõ cách tìm: "Từ 0 tới 10 có 2 khoảng, nên mỗi khoảng là 5 đơn vị." Câu quy tắc nói đủ hai bước, vd "Muốn đọc điểm, xem hai số đã ghi để biết hai vạch liền nhau cách nhau mấy đơn vị. Rồi từ gốc O đếm thêm chừng ấy đơn vị cho mỗi bước." Recap section và recap card lặp nguyên văn. Ít nhất câu luyện `doc-q-35` và một câu kho ôn bỏ câu cho sẵn đơn vị, để bạn tự suy từ hình.

### 4. Một việc hai tên: "vạch thứ 4", "4 vạch" bên cạnh "4 bước"

- Vị trí: nhãn điểm của hình `vach-5` ("4 vạch"), `vach-5-xong` ("5 vạch", màn quy tắc, recap section, recap `card.vach-don-vi`), `giai-vach-5-35` ("7 vạch"); `$.sections[1].blocks[0].caption` ("điểm K ở vạch thứ 4"); `$.exercises[0].explain.text`, `$.exercises[2].explain.text`, `$.exercises[6].explain.text`, `$.exercises[7].explain.text`. Phía "bước": `tip.dem-tu-goc-o` (`$.sections[0].blocks[3]`), hình `dem-buoc`, `done` của `dat-diem-5`, `$.exercises[1].explain`, `$.exercises[6].explain.wrong[0]`. LL-05.
- Nguồn: —
- Vấn đề: Mẹo dặn "đếm các bước từ gốc, đừng đếm cả vạch gốc", rồi các màn sau lại đếm "vạch". Từ O tới điểm 25 có 6 vạch nếu tính vạch gốc, nên "5 vạch", "vạch thứ 4" đúng là chỗ bạn hay đếm thừa một (đúng nhiễu "5" của `kt-dem-vach-c`).
- Sửa: Dùng một tên "bước" như mẹo: nhãn "4 bước", "5 bước", "7 bước"; caption "điểm K cách gốc O 4 bước, nên biểu diễn số 20"; `explain` viết "Điểm B cách gốc O 7 bước", "đi thêm 4 bước", "Điểm P cách gốc O 8 bước".

### 5. Hình vạch 5: lớp "5 đơn vị" vẽ thành vệt tròn nằm dưới gốc O, nhãn rời xuống chú thích

- Vị trí: hình `vach-5` (`$.sections[1].blocks[0]`), `vach-5-xong` (`$.sections[1].blocks[1]`, `$.sections[1].recap`, `$.cards[1].recap`), `giai-vach-5-35` (`$.exercises[7].hints.solutionVisualId`), `goi-y-vach-5` (`$.exercises[7].hints.hintVisualId`). LL-15, LL-12, LL-20.
- Nguồn: —
- Vấn đề: Bản sửa mục 14 vòng 1 đổi mũi tên thành lớp `span` 0→5. Trên ảnh walk (`ipad/030-s2-01-block-end`, `phone/031-s2-02-block`, `038-s2-06-recap`) span là vệt tròn cam nhạt chưa tới một khoảng, nửa bị dấu gốc O che; chữ "5 đơn vị" nằm ở chú thích bên dưới, cùng ô cam với nhãn "4 vạch" của điểm K, nên không thấy chữ nào gắn với khoảng nào. Đây là ý chính của section, có ở màn quy tắc và recap.
- Sửa: Ghi số dưới vạch đầu (`labelAt: [0, 5, 10]`) để thấy 0 → 5 là 5 đơn vị; hoặc sửa lớp `span` cho dải tô đủ một khoảng, nằm trên trục, nhãn ngay trên dải. Giữ cùng cách vẽ ở bốn hình.

### 6. Câu kho ôn, câu kiểm tra lặp số của màn quy tắc, câu kiểm tra và câu luyện cùng section

- Vị trí: `$.exercises[1]` (`ex.kt-dem-vach-c`, C ở 4, trùng hình quy tắc và recap `diem-a-4`); `$.exercises[5]` (`ex.cach-goc-9`, trùng 9 của câu luyện `doc-diem-a-9`); `$.exercises[8]` (`ex.dat-diem-5-40`, trùng 40 của `kt-doc-vach-5`); `$.exercises[9]` (`ex.cham-diem-35`, trùng 35 của `doc-q-35`); `$.exercises[10]` (`ex.chon-nhieu-xa`, L ở 35, M ở 40, trùng cả hai). LL-07, LL-20.
- Nguồn: —
- Vấn đề: Câu kiểm tra `kt-dem-vach-c` đến ngay sau màn quy tắc vẽ điểm ở 4 với nhãn "4 đơn vị", nên bạn nhớ số thay vì đếm. Bản sửa mục 21 vòng 1 đổi sang 35, tạo trùng mới với câu luyện `doc-q-35`; ba câu kho ôn của card `vach-don-vi` giờ chỉ quay quanh 35 và 40.
- Sửa: `kt-dem-vach-c` đặt C ở 5 (lựa chọn 4, 5, 6; sửa `explain`, `check`). `cach-goc-9` đổi sang số chưa dùng trong section (đổi id). Card `vach-don-vi` dùng số chưa có ở màn học, câu kiểm tra, câu luyện (đã dùng 20, 25, 30, 35, 40): vd 45, 50; đổi id, `params`, `explain` theo.

### 7. Mẹo `doc-dau` nhắc dấu ≤, ≥ một section trước khi dạy

- Vị trí: `$.sections[4].blocks[2].text` (`tip.doc-dau`). LL-09, LL-20.
- Nguồn: tr.11 "Kĩ năng giải toán", `sbt-p11.png`
- Vấn đề: Câu "Dấu ≤ và ≥ thì khác: hai số bằng nhau vẫn đúng." (thêm theo mục 5 vòng 1) đưa hai kí hiệu chưa dạy vào section `dau-nho-lon`; section `dau-bang` sau mới dạy cách đọc. "Hai số bằng nhau vẫn đúng" cũng không nói điều gì đúng. Câu đầu đã đủ điều kiện ("Với dấu < và >"). Hai nhóm reviewer cùng ghi mục này.
- Sửa: Bỏ câu thứ hai: "Với dấu < và >, đầu nhọn luôn chỉ về số nhỏ hơn, còn phía miệng mở quay về số lớn hơn." Không cần thêm lời nhắc ở `dau-bang`: câu quy tắc ở đó đã có "Hai số bằng nhau thì cả hai dấu đều đúng."

### 8. Bài xếp `kt-xep-9-2-6` hỏi "từ trái sang phải" nhưng thẻ xếp dọc

- Vị trí: `$.exercises[17].prompt[0]` (`ex.kt-xep-9-2-6`). LL-10.
- Nguồn: —
- Vấn đề: Ảnh `phone/062-s4-06-exercise-kt-xep-9-2-6`: ba thẻ xếp từ trên xuống, màn hướng dẫn trước đó nói "Thẻ trên cùng là bước làm trước". Đề không nói thẻ trên cùng ứng với bên trái, nên bạn phải tự đổi chiều dọc sang chiều ngang.
- Sửa: "Xếp các số 9, 2 và 6 theo vị trí điểm biểu diễn trên tia số: thẻ trên cùng là số nằm bên trái nhất."

### 9. Mẹo "Đổi lời thành dấu" cho sẵn đáp án câu luyện `tau-cao-100`, và dùng h mà chưa nói h là gì

- Vị trí: `$.sections[5].blocks[2].text`, `$.sections[5].blocks[2].tex` (`tip.doi-loi-thanh-dau`); `$.exercises[35]` (`ex.tau-cao-100`, trong `practiceIds` của `dau-bang`). LL-07, LL-20, LL-10.
- Nguồn: tr.11 "Kĩ năng giải toán", `sbt-p11.png`
- Vấn đề: Mẹo ghi "Gặp “từ 100 cm trở lên” thì dùng h ≥ 100", ba màn sau câu luyện hỏi đúng "người cao từ 100 cm trở lên … điều kiện nào đúng?". Bạn chỉ cần chép lại mẹo. Đây là bản sửa theo mục 29 vòng 1. Mẹo cũng dùng chữ h mà không nói h là chiều cao; note trước chỉ giới thiệu n.
- Sửa: Đổi ví dụ ≥ của mẹo sang tình huống và số khác câu luyện, nói luôn chữ cái là gì, vd "Gặp “từ 6 tuổi trở lên” (t là số tuổi) thì dùng t ≥ 6", `tex` đổi theo. Cách khác: giữ mẹo, đổi câu luyện sang số và tình huống khác, đổi id.

### 10. Section `lien-tiep` không có màn cùng làm

- Vị trí: `$.sections[9].blocks` (`section.lien-tiep`). LL-16.
- Nguồn: —
- Vấn đề: Mọi section khác có một màn "Cùng làm" trước câu tự làm. `lien-tiep` đi thẳng từ quy tắc, màn số 0 và mẹo sang câu kiểm tra, dù có hai việc (số liền sau, số liền trước). Việc tìm số liền trước từ câu "Số liền trước của a + 1 là a" chưa được thử có hướng dẫn lần nào.
- Sửa: Thêm một màn chips trước mẹo, vd "Cùng làm: chạm vào số liền trước của 31." với 29, 30, 32, lời kết "Bạn chọn đúng: 31 = 30 + 1, nên số liền trước của 31 là 30." Chọn số khác các câu đã có (39, 199, 80, 59, 45, 300, 1, 25, 26).

### 11. Section `cung-chu-so` không có ví dụ đời sống

- Vị trí: `$.sections[7]` (màn `so-6218-6247`, màn quy tắc, mẹo, màn cùng làm, câu `kt-cung-chu-so`, `dien-dau-6305-6350`). LL-16.
- Nguồn: Kiến thức nền (tiểu học); bài 1.25 tr.12, `sbt-p12.png`
- Vấn đề: Từ khi tách khỏi `dem-chu-so` (bản sửa mục 30 vòng 1), câu chuyện kênh A, kênh B ở lại section trước, còn `cung-chu-so` chỉ có số trơn. Luật "Ví dụ đời sống ở mọi section Toán" của `lesson-author` không đạt.
- Sửa: Cho màn mở đầu một câu chuyện có kết, vd note "Xe đạp giá 6 218 nghìn đồng, xe đạp điện giá 6 247 nghìn đồng. Hai số cùng 4 chữ số, so từng cặp thì 1 nhỏ hơn 4, nên xe đạp rẻ hơn." đặt trong `group` cùng hình `so-6218-6247`; hoặc đổi đề `kt-cung-chu-so` thành tình huống đời sống.

### 12. Recap card `cung-chu-so` bỏ mất nửa quy tắc "cặp khác nhau đầu tiên", và câu quy tắc không nói số nào lớn hơn

- Vị trí: `$.cards[9].recap.caption` (`card.cung-chu-so`); `$.sections[7].blocks[1].children[0].text` (note `rule`), `$.sections[7].recap.caption`. LL-06.
- Nguồn: —
- Vấn đề: Recap card chỉ còn câu đầu, bỏ câu "Gặp cặp khác nhau đầu tiên thì dừng lại…" là chỗ quyết định, nên hai recap của cùng ý lệch nhau. Câu quy tắc kết bằng "cặp đó cho biết số nào lớn hơn" mà không nói cho biết thế nào; chỉ hình mới ghi "1 nhỏ hơn 4".
- Sửa: Viết câu quy tắc đủ ý rồi dùng nguyên văn cho note, recap section và recap card: "Khi hai số có cùng số chữ số, so từng cặp chữ số từ trái sang phải. Ở cặp khác nhau đầu tiên, số nào có chữ số lớn hơn thì lớn hơn."

### 13. Lời kết màn cùng làm `bieu-do-cot` nói "cột T4 thấp nhất", trái với màn trước vừa đánh dấu Chủ nhật "Ít nhất"

- Vị trí: hình `chon-ngay-it-nhat` (`$.sections[8].blocks[3].children[2]`), trường `done` trong `catalog.ts`. LL-10.
- Nguồn: —
- Vấn đề: "Bạn chọn đúng: cột T4 thấp nhất, chỉ có 9 quyển." không nói "trong bốn ngày T3 đến T6". Màn quy tắc ngay trước đánh dấu cột Chủ nhật (1 quyển) là "Ít nhất", và trên hình của màn này cột T7, CN đều thấp hơn T4.
- Sửa: "Bạn chọn đúng: trong bốn ngày T3, T4, T5, T6, cột T4 thấp nhất, chỉ có 9 quyển."

### 14. Câu quy tắc liệt kê đọc được thành "có dấu ≤ thì lấy cả hai đầu"; hình mẫu không có ví dụ dấu ≤

- Vị trí: `$.sections[12].blocks[2].children[0].text` (note `rule`), `$.sections[12].recap.caption`, `$.cards[15].recap.caption` (`card.tap-hop-doan`); hình `liet-ke-mau` (`$.sections[12].blocks[2].children[1]`, recap section, recap card). LL-10, LL-06.
- Nguồn: tr.13 bài 1.27, `sbt-p13.png` (đề có cả dấu < và dấu ≤)
- Vấn đề: "dấu ≤ thì lấy cả a và b, dấu < thì bỏ số đó" nói dấu ≤ lấy cả hai số, trong khi luật thật là xét từng đầu. Ở câu kho ôn `liet-ke-7-10` (`7 ≤ x < 10`, `$.exercises[74]`), theo đúng chữ thì lấy cả 10. Hình dưới quy tắc (cũng là recap) chỉ có hai dòng `x < 4` trong ℕ và ℕ*, không dòng nào cho dấu ≤ hay đề hai dấu khác nhau.
- Sửa: Câu quy tắc (và hai recap lặp nguyên văn): "Liệt kê các số x từ a đến b: số đứng cạnh dấu ≤ thì lấy, số đứng cạnh dấu < thì bỏ. Số 0 có trong ℕ, không có trong ℕ*." Thêm vào `liet-ke-mau` một dòng hai dấu khác nhau với số chưa dùng, vd `\{x \in \mathbb{N} \mid 11 ≤ x < 14\} = \{11; 12; 13\}`, nhãn "Có số 11, không có số 14".

### 15. Câu kho ôn `xep-3-ban` lặp đúng dữ kiện và đáp án của câu kiểm tra `kt-cao-nhat-an-binh-chi`

- Vị trí: `$.exercises[63]` (`ex.xep-3-ban`, card `bac-cau`); so với `$.exercises[61]` (`ex.kt-cao-nhat-an-binh-chi`). LL-07.
- Nguồn: —
- Vấn đề: Cả hai câu dùng An, Bình, Chi với cùng quan hệ, nên thứ tự đã nằm sẵn trong lời giải câu kiểm tra. Khi ôn, bạn nhớ tên chứ không dùng bắc cầu.
- Sửa: Đổi tên và đổi chiều, vd "Minh cao hơn Tú, còn Tú cao hơn Long. Xếp ba bạn từ thấp đến cao." (đáp án Long, Tú, Minh), sửa `explain`.

### 16. Cách đọc phần `x ∈ ℕ |` trong kí hiệu tập hợp vẫn chưa có câu nào nói

- Vị trí: `$.sections[12].blocks[1].children[0].text` (note màn M, hình `m-liet-ke`). LL-09.
- Nguồn: tr.12 lời giải c, `sbt-p12.png`
- Vấn đề: Vòng 1 (mục 10) đề nghị dạy cả dấu kép lẫn phần trước vạch đứng. Bản sửa dạy dấu kép, còn phần `x ∈ ℕ |` chỉ được nói gián tiếp; không câu nào nói vạch đứng đọc là "mà", hay `x ∈ ℕ*` là số tự nhiên khác 0. `docs/learner.md` ghi bạn còn yếu kí hiệu ∈ và { }, và 8 câu (từ `kt-liet-ke-4-8` tới `dem-nho-bang-6-n`) cho đề chỉ bằng kí hiệu này.
- Sửa: Thêm vào note màn M: "Phần x ∈ ℕ trước vạch đứng nói x là số tự nhiên. Vạch đứng đọc là 'mà'." Ở màn quy tắc có thể nói thêm "x ∈ ℕ* nghĩa là x là số tự nhiên khác 0."

### 17. Thang máy "chở từ 3 đến 8 người" sai ngoài đời và trái với section `dau-bang`

- Vị trí: `$.sections[13].blocks[0].children[0].text` (`section.dem-phan-tu`), hình `thang-3-8` (nhãn "Số người n"); so với `$.sections[5].blocks[1].children[0].text` (`section.dau-bang`). LL-10, LL-20, LL-05.
- Nguồn: —
- Vấn đề: Thang máy chở được 1 hay 2 người, không có mức tối thiểu 3 người, đúng kiểu lỗi số nhà vòng 1 (mục 9). Tổng hợp thấy thêm: section `dau-bang` cùng bài vừa nói "Thang máy chở tối đa 8 người … thang trống hay đủ 8 người đều được", nên cùng một thang máy, hai section nói hai điều trái nhau. Ví dụ này lấy từ câu "Sửa" của vòng 1 (mục 32).
- Sửa: Chọn tình huống có cả mức thấp nhất lẫn cao nhất thật và khác thang máy, vd "Cô chia lớp thành các nhóm, mỗi nhóm có từ 3 đến 8 bạn. Số bạn n của một nhóm thoả 3 ≤ n ≤ 8, nên n là 3, 4, 5, 6, 7 hoặc 8." Sửa nhãn hình `thang-3-8` theo.

### 18. Màn đầu `bac-cau` chỉ có hình từng bước; câu chuyện và việc phải làm nằm trong caption xám

- Vị trí: `$.sections[10].blocks[0]` (hình `bac-cau-keo`, caption). LL-16.
- Nguồn: —
- Vấn đề: Màn mở section không có note: số kẹo của từng bạn và lời dặn bấm "Bước tiếp" chỉ ở chữ xám nhỏ dưới hình (ảnh `phone/152-s11-01-block.png`). Checklist trục 5: hướng dẫn chỉ ở caption xám là Nên sửa.
- Sửa: Đặt màn thành `group` có note trước hình: "Nam có 3 viên kẹo, Lan có 5 viên, Hà có 8 viên. Bấm Bước tiếp để so từng cặp." Caption bỏ hoặc chỉ giữ lời dặn.

### 19. Câu kho ôn `chon-nhieu-doan-ab` dùng lại hình và bộ A = 2, B = 7 của câu luyện `phan-nao-11`

- Vị trí: `$.exercises[69]` (`ex.chon-nhieu-doan-ab`, hình `phan-2-7`); so với `$.exercises[67]` (`ex.phan-nao-11`). LL-07.
- Nguồn: —
- Vấn đề: Lời giải câu luyện đã nói "Đoạn AB chỉ gồm các số từ 2 đến 7", đúng điều câu kho ôn hỏi.
- Sửa: Cho câu kho ôn một bộ chưa dùng (vd A = 4, B = 10, lựa chọn 3, 4, 9, 11; đáp án 4 và 9) với một hình `line` mới.

### 20. Hai hình liền nhau tô ba phần của tia số hai bộ màu khác nhau

- Vị trí: hình `ba-phan-rows` (`$.sections[11].blocks[1].children[2]`, recap section, recap `card.phan-tia-so`) so với `chia-ba-phan` (`$.sections[11].blocks[0].children[2]`). LL-05.
- Nguồn: —
- Vấn đề: Màn đầu tô đoạn OA xanh dương, đoạn AB xanh ngọc, phần còn lại xám; màn quy tắc ngay sau gắn cả ba nhãn cùng màu cam của "Điểm biểu diễn". Một phần mang hai màu ở hai màn liền nhau, và màu cam là màu của khái niệm khác.
- Sửa: Nhãn của `ba-phan-rows` dùng đúng ba màu của `chia-ba-phan` (đổi theo nếu `chia-ba-phan` đổi màu), hoặc cả hai hình cùng bỏ màu khái niệm.

### 21. Recap card `cot-cay-so` bỏ nửa phép trừ, mà câu kho ôn của card hỏi đúng phép trừ

- Vị trí: `$.cards[2].recap.caption` (`card.cot-cay-so`); so với `$.sections[2].recap.caption` và `$.exercises[14]` (`ex.cot-con-lai-70-55`). LL-06.
- Nguồn: —
- Vấn đề: Recap card chỉ còn câu cộng ("số của thị trấn bằng số của cột cộng số km đó"), bỏ câu "Số km còn lại bằng số của thị trấn trừ số của cột". Câu kho ôn `cot-con-lai-70-55` của card hỏi "Còn bao nhiêu km nữa tới thị trấn?", nên khi ôn bằng card, bạn không có câu nào trên màn cho cách làm câu này. Cùng kiểu với mục 3 (`vach-don-vi`) và mục 12 (`cung-chu-so`): ba card cắt câu quy tắc của section giữa chừng.
- Sửa: Recap card lặp đủ câu quy tắc của section (sau khi viết lại theo mục 23). Soát cả 18 card: card nào có câu kho ôn dùng nửa sau của quy tắc thì recap phải giữ nửa đó.

### 22. Ba phần của tia số mang hai tên "khúc" và "phần"

- Vị trí: `$.sections[11].title` ("Hai điểm cắt tia số làm ba khúc"), `$.sections[11].blocks[0].children[1].text` ("ba khúc"); so với câu quy tắc `$.sections[11].blocks[1].children[0].text` ("ở phần nào"), hình `ba-phan-rows`, `chia-ba-phan` ("Phần còn lại") và đề `ex.kt-phan-nao-6`, `ex.phan-nao-11`, `ex.phan-nao-3` ("nằm ở phần nào?"). LL-05.
- Nguồn: —
- Vấn đề: Tên section và màn đầu gọi là "khúc", quy tắc, hình và mọi đề gọi là "phần". Bạn đọc chậm có thể nghĩ "khúc" và "phần" là hai thứ khác nhau.
- Sửa: Dùng một tên "phần": tên section "Hai điểm cắt tia số thành ba phần", màn đầu viết như mục 1.

## Góp ý

### 23. "Số của thị trấn", "số biểu diễn thị trấn" bên cạnh "điểm ứng với thị trấn biểu diễn số"

- Vị trí: `$.sections[2].blocks[1].children[0].text` (note `rule`), `$.sections[2].recap.caption`, `$.cards[2].recap.caption`; `$.exercises[15].prompt[1]` (`ex.chon-phep-tinh-km`); `$.exercises[11..13].explain.text`. LL-05, LL-25.
- Nguồn: —
- Vấn đề: Đề đã sửa theo mục 40 vòng 1 thành "Điểm ứng với thị trấn biểu diễn số mấy?", còn quy tắc, recap và `chon-phep-tinh-km` vẫn nói "số của thị trấn", "số biểu diễn thị trấn" (ngược vai). Câu quy tắc "Thị trấn còn cách cột bao nhiêu km, thì số của thị trấn bằng …" cũng hơi rối.
- Sửa: Ví dụ quy tắc: "Số của điểm thị trấn bằng số của cột cộng số km còn phải đi. Số km còn phải đi bằng số của điểm thị trấn trừ số của cột." (recap section và recap card lặp lại, xem mục 21); đề `chon-phep-tinh-km`: "Phép tính nào cho số mà điểm thị trấn biểu diễn?".

### 24. Nhiễu `35 · 25` của `chon-phep-tinh-km` khó có ai chọn

- Vị trí: `$.exercises[15].options[2]` (`ex.chon-phep-tinh-km`). LL-14.
- Nguồn: —
- Vấn đề: Section chỉ nói cộng và trừ; phép nhân không ứng với lỗi hay gặp, nên câu thực chất còn hai lựa chọn.
- Sửa: Thay bằng phép tính ứng với lỗi đọc đề, vd `25 + 25`, hoặc bỏ để câu còn hai lựa chọn.

### 25. Hai câu kiểm tra của `ben-trai` dùng chung cặp 2 và 6

- Vị trí: `$.exercises[16]` (`ex.kt-ben-trai-6-2`), `$.exercises[17]` (`ex.kt-xep-9-2-6`). LL-07.
- Nguồn: —
- Vấn đề: Câu đầu chốt 2 nằm bên trái 6; câu xếp ngay sau chỉ còn phải đặt số 9.
- Sửa: Đổi bộ số của câu xếp, vd 10, 3, 7 (đổi id, `items`, `explain`; đề sửa theo mục 8).

### 26. Mũi tên hai đầu vẫn đi với nhãn một chiều "sang phải thì số lớn dần"

- Vị trí: hình `trai-3-8`, `trai-3-8-xong` (`$.sections[3].blocks[0]`, `blocks[1]`, recap section, recap `card.ben-trai`). LL-15.
- Nguồn: —
- Vấn đề: Ảnh `phone/055-s4-01-block-end`, `069-s4-08-recap`: nhãn đã sửa, nhưng mũi tên vẫn hai đầu, nên hình vẫn gợi cả chiều sang trái.
- Sửa: Dùng mũi tên một đầu chỉ sang phải (cần sửa lớp `arrow` nếu chưa có kiểu một đầu).

### 27. `dien-dau-23-32` giải thích bằng so chữ số hàng chục, cách mà section `cung-chu-so` mới dạy

- Vị trí: `$.exercises[28].explain.text` (`ex.dien-dau-23-32`, card `viet-dau`). LL-09.
- Nguồn: —
- Vấn đề: So hai số hai chữ số là kiến thức tiểu học nên không sai, nhưng lời giải dựa vào quy tắc của section sau.
- Sửa: "Khi đếm, 23 đến trước 32, nên 23 nhỏ hơn 32 (điểm của 23 nằm bên trái). Ta viết dấu nhỏ hơn."

### 28. `chon-chieu-cao-142-138` viết "nhiều hơn" cho chiều cao

- Vị trí: `$.exercises[30].explain.text` (`ex.chon-chieu-cao-142-138`). LL-19.
- Nguồn: —
- Vấn đề: "Nam cao 142 cm, nhiều hơn Lan là 138 cm" đọc như so số lượng.
- Sửa: "Nam cao 142 cm, cao hơn Lan (138 cm). Vậy 142 lớn hơn 138, viết 142 > 138."

### 29. Lời giải `lien-sau-199` bỏ bước hàng chục bằng chữ "Cứ thế"

- Vị trí: `$.exercises[53].explain.text` (`ex.lien-sau-199`).
- Nguồn: —
- Vấn đề: Câu chỉ nói hàng đơn vị 9 thành 0 và nhớ 1, rồi "Cứ thế" nhảy tới 200, đúng chỗ bạn hay sai (viết 1 910 hay 190).
- Sửa: "Cộng 1 vào 199: hàng đơn vị 9 thành 0, nhớ 1. Hàng chục cũng là 9 nên thành 0, nhớ 1 sang hàng trăm: 1 thành 2. Vậy 199 + 1 = 200."

### 30. Lời giải `kt-lien-sau-39` nói quy tắc theo cách thứ hai

- Vị trí: `$.exercises[52].explain.text` (`ex.kt-lien-sau-39`). LL-05.
- Nguồn: tr.11 ý 3 "Kiến thức cần nhớ", `sbt-p11.png`
- Vấn đề: "Số liền sau của một số bằng số đó cộng 1" đúng, nhưng câu quy tắc của bài là "Số liền sau của a là a + 1"; mục 8 vòng 1 đã sửa hai lời giải số liền trước theo câu quy tắc.
- Sửa: "Số liền sau của a là a + 1. Vậy số liền sau của 39 là 39 + 1 = 40."

### 31. Hình `giam-dan` viết dấu nối tiếp "10 > 4 > 1" mà bài chưa dạy cách đọc

- Vị trí: hình `giam-dan` (`$.sections[8].blocks[2].children[1]`). LL-09.
- Nguồn: —
- Vấn đề: Bài chỉ dạy cách đọc dấu kép ở section `phan-tia-so` sau đó. Note đã nói bằng lời nên vẫn hiểu được, nhưng đây là lần đầu bạn gặp hai dấu trên một hàng.
- Sửa: Viết thành hai hàng "10 > 4" và "4 > 1"; hoặc thêm vào note: "10 > 4 > 1 đọc là 10 lớn hơn 4, 4 lớn hơn 1."

### 32. Hình `trang-25` vẽ tia số bắt đầu ở 22, không có gốc O

- Vị trí: hình `trang-25` (`$.sections[9].blocks[0]`). LL-15.
- Nguồn: —
- Vấn đề: Section `tia-so` dạy "Tia số bắt đầu ở gốc O, ứng với số 0". Hình này có vạch đầu ghi 22, trông như tia số có gốc ở 22 (ảnh `phone/139-s10-01-block.png`).
- Sửa: Thêm dấu ngắt ở đầu trục, hoặc vẽ thành dãy ô số trang.

### 33. Dấu hình của màu ở nhãn hình vẫn đứng sát chữ, đọc được thành dấu phép tính

- Vị trí: hình `lien-tiep-rows` (`$.sections[9].blocks[1].children[2]`, recap section, recap card `lien-sau`, `lien-truoc`): "✚ Số liền trước của a + 1"; hình `bang-xong` (`$.sections[5].blocks[0].children[1]`): "▬ 5 bằng 5". LL-21.
- Nguồn: —
- Vấn đề: Mục 45 vòng 1 chưa đổi. Dấu thập của màu sky đọc thành "a cộng…", dấu thanh của màu slate đọc thành "trừ 5 bằng 5" (ảnh `phone/141-s10-02-block.png`, `phone/088-s6-01-block.png`). Dấu nằm trong khung nhãn nên ít nhầm hơn vòng 1.
- Sửa: Báo người làm app đặt dấu hình ở góc khung hay đổi kiểu dấu; trong bài có thể bỏ màu khỏi nhãn "5 bằng 5", "Ví dụ: a = 25".

### 34. Lời giải câu đếm phần tử không dùng phép tính vừa học

- Vị trí: `$.exercises[79].explain` (`ex.dem-phan-tu-3-7`), `$.exercises[80].explain` (`ex.dem-phan-tu-6-9`), `$.exercises[81].explain` (`ex.dem-nho-bang-6-n`).
- Nguồn: —
- Vấn đề: Quy tắc là "lấy b trừ a rồi cộng 1", câu kiểm tra `kt-dem-2-5` có `5 - 2 + 1 = 4`, nhưng câu luyện và hai câu kho ôn chỉ liệt kê rồi đếm.
- Sửa: `tex` hai dòng (`gathered`): tập hợp liệt kê và phép tính, vd `\{3; 4; 5; 6; 7\}` và `7 - 3 + 1 = 5`; với `dem-nho-bang-6-n` là `6 - 0 + 1 = 7`.

### 35. Điểm A thuộc cả đoạn OA lẫn đoạn AB mà bài nói "ba khúc"

- Vị trí: `$.sections[11].blocks[0].children[1].text`; hình `ba-phan-rows` (dòng `x ≤ a` là đoạn OA, dòng `a ≤ x ≤ b` là đoạn AB).
- Nguồn: tr.12 lời giải c, `sbt-p12.png`
- Vấn đề: Hình quy tắc đúng với sách (x = a thuộc cả hai đoạn), nhưng "cắt làm ba khúc" khiến bạn nghĩ mỗi số chỉ thuộc một phần. Chưa câu nào hỏi số bằng a.
- Sửa: Thêm nửa câu ở màn đầu (cùng lúc sửa mục 1) hoặc nhãn hình: "A là đầu chung của đoạn OA và đoạn AB."

### 36. Câu kho ôn `liet-ke-5-9`: đáp án là tập nhiều số nhất

- Vị trí: `$.exercises[73].options` (`ex.liet-ke-5-9`). LL-14.
- Nguồn: —
- Vấn đề: Cả ba nhiễu đều thiếu số, nên "chọn tập dài nhất" luôn trúng; vòng 1 (mục 51) đã sửa kiểu này ở câu kiểm tra.
- Sửa: Thay một nhiễu bằng tập thừa số, vd `\{4; 5; 6; 7; 8; 9\}`, thêm `wrong` "Thừa số …".

### 37. Dấu kép trong note bị ngắt dòng giữa hai vế trên điện thoại

- Vị trí: `$.sections[12].blocks[1].children[0].text`, `$.sections[12].blocks[3].children[0].text`. LL-12.
- Nguồn: —
- Vấn đề: Ảnh `phone/175-s13-02-block.png` ngắt "6 ≤" ở cuối dòng và "x ≤ 12" ở dòng sau; `phone/177-s13-04-block.png` để "6." đứng một mình.
- Sửa: Đưa dấu kép vào khối `formula` riêng, hoặc dùng dấu cách không ngắt quanh dấu ≤.

### 38. `sourceRef` của `dem-phan-tu` không có trang nào đếm phần tử

- Vị trí: `$.sections[13].sourceRef`, `$.cards[17].sourceRef` (`card.dem-phan-tu`). LL-09.
- Nguồn: tr.11 ví dụ c, tr.13 bài 1.27 (chỉ liệt kê, không đếm)
- Vấn đề: Câu quy tắc "lấy b trừ a rồi cộng 1" không có trên hai trang được trỏ. Giữ mức Góp ý: cách đếm suy ra trực tiếp từ việc liệt kê của sách, và màn đầu liệt kê rồi đếm trước khi nêu phép tính, nên không phải kiến thức ngoài nguồn.
- Sửa: Ghi rõ trong `sourceRef`, vd "Sách bài tập tr.11 (ví dụ c), tr.13 (bài 1.27): liệt kê rồi đếm".

### 39. Câu quy tắc `phan-tia-so` chỉ nói "so x với a và b", không nói so xong thì ở phần nào

- Vị trí: `$.sections[11].blocks[1].children[0].text` (note `rule`), `$.sections[11].recap.caption`, `$.cards[14].recap.caption` (`card.phan-tia-so`). LL-06.
- Nguồn: —
- Vấn đề: Cùng kiểu mục 12: câu quy tắc nêu việc làm mà không nêu kết luận; ba trường hợp (x ≤ a, a ≤ x ≤ b, x > b) chỉ có trong hình `ba-phan-rows`. Hình là recap nên bạn vẫn thấy, nhưng câu bạn nhớ không tự đủ.
- Sửa: Thêm kết luận vào câu quy tắc (recap lặp nguyên văn), vd "… so x với a và b: x không quá a thì ở đoạn OA, x từ a đến b thì ở đoạn AB, x lớn hơn b thì ở phần còn lại."

### 40. Khái niệm "So sánh số có nhiều chữ số" mang màu slate, cũng là màu trung tính của nhãn thường

- Vị trí: `$.concepts[7]` (`concept.so-sanh-so-nhieu-chu-so`, `color: "slate"`); nhãn slate trung tính ở hình `bang-xong` ("5 bằng 5"), nhãn gốc O của các hình `line` trong `catalog.ts`. LL-05.
- Nguồn: —
- Vấn đề: `docs/design-system.md` ghi slate là màu "Phụ, trung tính". Gán slate cho một khái niệm làm một màu có hai nghĩa trong cùng bài (khái niệm và nhãn không mang khái niệm).
- Sửa: Bài đã dùng hết tám màu khái niệm, nên bỏ khái niệm này (card `so-chu-so`, `cung-chu-so` dùng `so-nho-hon`, `so-lon-hon` như `tex` của `tip.so-cung-chu-so` đã tô xanh dương, tím), hoặc chấp nhận và ghi rõ trong `docs/design-system.md` khi nào slate là khái niệm.
