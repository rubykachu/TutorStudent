# Review: Cách ghi số tự nhiên (`cach-ghi-so-tu-nhien`)

- Bài: `content/math/kntt/cach-ghi-so-tu-nhien/lesson.json`
- Vòng: 1 - toàn bài, 3 reviewer song song + tổng hợp
- Nguồn đã đọc: `sources/math/cach-ghi-so-tu-nhien/` - sbt-p7, sbt-p8, sbt-p9, sbt-p10, sbt-p94, sbt-p95
- `content:check`: 0 lỗi, 0 cảnh báo của bài
- Đọc hiểu (Haiku, lượt 1): chưa chạy (chạy sau khi hết Nghiêm trọng)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/cach-ghi-so-tu-nhien/`
- Kết luận: Chưa đạt: còn 13 lỗi Nghiêm trọng
- Bản đã review: `09e9ca0781d56f142fd68b553c9f43fb11dd24870f97cd9825cad1734ff51ad8` (`pnpm content:diff` so với bản này)

Ghi chú của Tổng hợp: lúc tổng hợp, thư mục ảnh walk của bài không còn trên đĩa; các phát hiện về hình dựa vào ảnh reviewer đã xem, và tôi kiểm lại bằng mã hình (`gaps.tsx`, `clock.tsx`, `shared/region.tsx`, `catalog.ts`). Phát hiện của Tổng hợp: Nghiêm trọng 2, 9; Nên sửa 26 (một phần), 28. Đổi mức: đồng hồ chạm (Nghiêm trọng 13) nâng từ Nên sửa; câu `la-ma-bang-14`, `chon-la-ma-lon-hon-20` nâng từ Nên sửa vào Nghiêm trọng 8; Góp ý "ví dụ đời sống section 1" và "`summary`, `goals`" gộp lên Nên sửa vì trùng phát hiện Nên sửa của nhóm khác. Không bỏ phát hiện nào.

## Nghiêm trọng

### 1. Quy tắc giá trị và quy tắc hàng dừng ở hàng nghìn, trong khi bài và trang nguồn dùng số 5-7 chữ số

- Vị trí: `$.sections[4].blocks[0].children[0]`, `$.sections[4].recap.caption`, `$.cards[4].recap.caption` (`section.gia-tri`, `card.gia-tri`); `$.sections[2].blocks[0].children[0]` (`section.hang`); hình `gia-tri-kham-pha` (40 618), `goi-y-gia-tri-5` (70 431), `doi-tien` (10 000, 100 000); `overview.hook` (25 000). LL-17, LL-09
- Nguồn: tr.7 (kiến thức cần nhớ 3, không giới hạn hàng), bài 1.17, 1.18 tr.10, lời giải tr.95 (7 × 100 000, 2 × 10 000; 2 × 1 000 000)
- Vấn đề: Câu bé phải nhớ là "nhân với 1, 10, 100, 1 000 theo hàng nó đứng", câu hàng chỉ kể tới hàng nghìn: danh sách đóng. Ngay màn sau (`gia-tri-kham-pha`) hiện "hàng chục nghìn, 4 · 10 000", hình gợi ý `gia-tri-2-trong-12560` hiện "chục nghìn", section 11-14 dùng 98 765, 987 654, 84 152. Bé thuộc quy tắc thì không tìm được giá trị chữ số 4 trong 40 618 và nhớ sai rằng chỉ có bốn mức giá trị.
- Sửa: Viết câu quy tắc cho mọi hàng, không cắt bằng "…", vd "Hàng đơn vị nhân 1, hàng chục nhân 10, hàng trăm nhân 100. Mỗi hàng sang trái, số nhân thêm một chữ số 0." Câu hàng thêm "rồi hàng chục nghìn, hàng trăm nghìn". Recap lặp nguyên văn. Có thể thêm `tip` làm nhanh "viết chữ số đó rồi thêm bao nhiêu chữ số 0 bằng số chữ số đứng sau nó; chữ số 0 thì giá trị là 0" (đã thử, Bảng thử mẹo).

### 2. Bốn câu quy tắc chép khung "Kiến thức cần nhớ" tr.7

- Vị trí: `$.sections[5].blocks[0].children[0]` (`section.tong-gia-tri`, trùng từng chữ "Mỗi số tự nhiên bằng tổng giá trị các chữ số của nó."); `$.sections[3].blocks[0].children[0]` (`section.muoi-don-vi`, chỉ đổi "một" thành "1", "liền trước" thành "liền bên trái"); `$.sections[2].blocks[0].children[0]` câu đầu (`section.hang`, "Vị trí … chữ số … gọi là hàng"); `$.sections[7].blocks[0].children[0]` (`section.doc-so-la-ma`, giữ cụm "bằng tổng giá trị các thành phần"); kèm recap section và recap card lặp các câu đó. LL-08
- Nguồn: tr.7, `sbt-p7.png`, kiến thức cần nhớ 3 và 4
- Vấn đề: Checklist trục 1 "Biên soạn lại, không chép": câu trùng nguyên văn định nghĩa của sách là Nghiêm trọng; LL-08 đã ghi các ca "chỉ bỏ vài chữ" và "giữ nguyên các cụm của khung Kiến thức cần nhớ". Bài không có lớp chữ `p*.txt` nên `[textbook-copy]` không chạy; ba reviewer cũng chưa ghi.
- Sửa: Viết theo cách làm, vd section 6 "Cộng giá trị của tất cả các chữ số thì được chính số đó."; section 4 "Đổi 10 đơn vị ở một hàng thì được 1 đơn vị ở hàng bên trái nó."; section 3 "Mỗi chỗ đứng của chữ số trong một số có một tên, gọi là hàng."; section 8 "Muốn đọc số La Mã, tách số thành các thành phần rồi cộng giá trị của chúng." (khớp cách sửa ở Nghiêm trọng 6). Đổi recap section và recap card theo.

### 3. Mẹo "Viết số từ tổng giá trị" sai khi tổng thiếu hàng bên trái số hạng lớn nhất

- Vị trí: `$.sections[5].blocks[2]` (`tip.viet-so-tu-tong`); dòng kết của hình `viet-so-4` ("Hàng nào không có thì viết chữ số 0.", `src/visuals/math/cach-ghi-so-tu-nhien/slots.tsx`). LL-24
- Nguồn: —
- Vấn đề: "Hàng nào không có số hạng thì viết chữ số 0 ở hàng đó" không có điều kiện. Bé đã học bốn hàng; áp đúng chữ vào 6 · 10 + 5 thì hàng trăm, nghìn "không có số hạng" nên viết 0065; 8 · 100 thành 0800. Trái quy tắc section 2 (chữ số đầu bên trái khác 0). Hàng thiếu ở giữa hay ở cuối thì đúng.
- Sửa: "Bắt đầu từ hàng lớn nhất có trong tổng. Từ đó sang phải, hàng nào không có số hạng thì viết chữ số 0." Sửa dòng kết của hình `slots` cùng câu.

### 4. Hình gợi ý nấc 2 có nhãn tên hàng cho câu bắt bé gọi tên hàng

- Vị trí: `$.exercises[13].hints.hintVisualId` (`ex.hang-cua-chu-so-9`), `$.exercises[14].hints.hintVisualId` (`ex.dien-hang-4-trong-2460`); hình `goi-y-hang` (8 146, `show: "names"`, đã kiểm trong `catalog.ts`). LL-02
- Nguồn: —
- Vấn đề: Hai câu hỏi "chữ số đứng ở hàng nào"; hình gợi ý là số bốn chữ số, cùng độ dài 1 928 và 2 460, dưới mỗi ô có nhãn "nghìn, trăm, chục, đơn vị". Đặt thẳng cột là đọc ra tên hàng: hình chính là đáp án (Luật gợi ý 3 nấc, nấc 2).
- Sửa: Dùng hình đánh số vị trí từ phải ("thứ 1, thứ 2, …") không ghi tên hàng, hoặc bỏ `hintVisualId` và để nấc 1 tô chữ số đang hỏi trong đề (`\htmlId`). Giữ `goi-y-hang` cho câu cho sẵn tên hàng (`chu-so-hang-chuc-3851`, câu chạm).

### 5. `overview.whyItMatters` nói đọc giờ trên đồng hồ số La Mã nhờ biết hàng

- Vị trí: `$.overview.whyItMatters` (cả nhóm 1 và nhóm 2 ghi). LL-17
- Nguồn: tr.7, kiến thức cần nhớ 4 ("Giá trị của các thành phần không thay đổi dù đứng ở bất cứ vị trí nào"; số La Mã bằng tổng các thành phần)
- Vấn đề: "Bạn đọc đúng giá tiền, số nhà và giờ trên đồng hồ số La Mã nhờ biết mỗi chữ số đứng ở hàng nào." gắn số La Mã với hàng. Số La Mã không có hàng; bé dễ nghĩ chữ I cuối là "hàng đơn vị", trái section 8. Tình huống dạy hiểu sai: Nghiêm trọng (checklist trục 3 dẫn trục 2).
- Sửa: Tách hai ý, vd "Bạn đọc đúng giá 25 000 đồng nhờ biết mỗi chữ số đứng ở hàng nào, và đọc được giờ trên đồng hồ ghi số La Mã nhờ cộng các thành phần.", hoặc bỏ đồng hồ khỏi câu (đã có ở section 7).

### 6. Mẹo "Phân biệt IV và VI" sai ở XIV, XIX, XXIV, XXIX, và dạy cách đọc khác sách

- Vị trí: `$.sections[7].blocks[1]` (`tip.i-truoc-i-sau`); kéo theo `$.exercises[31].explain`, `$.exercises[32].explain`, `$.exercises[35].explain`, `$.exercises[40].explain` ("I đứng trước thì bớt 1, đứng sau thì cộng thêm"). LL-24
- Nguồn: tr.7, `sbt-p7.png` (IV, IX là thành phần; giá trị thành phần không đổi dù đứng ở đâu; số La Mã bằng tổng các thành phần)
- Vấn đề: Tổng hợp đã tự thử: trong XIX, chữ I vừa đứng sau X vừa đứng trước X; trong XIV, I đứng sau X và trước V. Làm đúng chữ của mẹo, bé không biết cộng hay trừ (ra 21 hay 19, 16 hay 14). Bài có đúng các số này: XIX (`$.exercises[41]`, `$.exercises[47]` lựa chọn c), XIV, XXIV (`$.exercises[42]`), XXIX (`$.exercises[47]`). Thêm nữa, sách không dạy luật "trừ"; sách dạy tách thành phần (IV, IX là một cụm) rồi cộng, đúng như note quy tắc section 8. Mẹo và các `explain` dạy một cách nghĩ thứ hai, ngược với câu "giá trị không đổi dù đứng ở đâu".
- Sửa: Viết lại mẹo theo cách của sách, vd `title` "Tách cụm IV, IX trước", `text` "Gặp IV hay IX thì khoanh cả cụm trước, rồi mới tách các chữ còn lại. Vậy XIV = X + IV, không phải X + I + V.", `tex` `\mathrm{XIV} = \mathrm{X} + \mathrm{IV} = 10 + 4 = 14` và `\mathrm{XVI} = \mathrm{X} + \mathrm{V} + \mathrm{I} = 16`. Các `explain` đổi "lấy 5 bớt 1" thành "IV là một thành phần, có giá trị 4".

### 7. Câu quy tắc "số bé nhất" của section 12 trái với quy tắc section 11, và sai ở số một chữ số

- Vị trí: `$.sections[11].blocks[1].children[0].text` (`section.chu-so-khac-nhau`), `$.sections[11].recap.caption`, `$.cards[11].recap.caption` (`card.chu-so-khac-nhau`). LL-05, LL-17
- Nguồn: tr.9, `sbt-p9.png` (bài 1.11 chỉ hỏi số lớn nhất; ý số bé nhất là phần suy ra)
- Vấn đề: Bài có hai câu cùng mở bằng "số bé nhất": section 11 "Số bé nhất có từ hai chữ số trở lên thì chữ số đầu là 1, các chữ số sau đều là 0" và section 12 "Muốn viết số bé nhất, chữ số đầu là 1, rồi đến 0, rồi các chữ số tăng dần". Câu section 12 không nói "có các chữ số khác nhau" và "từ hai chữ số trở lên". Ở recap card (ôn riêng, không có tên section), số bé nhất có bốn chữ số ra 1 023, trái 1 000 của section 11; số một chữ số ra 1, trái "Số 0 là số tự nhiên bé nhất" của section 1. "Các chữ số tăng dần" không nói bắt đầu từ 2 và liền nhau (10 357 cũng tăng dần).
- Sửa: "Muốn viết số bé nhất có các chữ số khác nhau (từ hai chữ số trở lên), viết 1, rồi 0, rồi 2, 3, 4 và tiếp tục cho đủ số chữ số." Đổi recap section và recap card theo đúng câu đó.

### 8. Câu ôn dùng đúng yêu cầu, số và đáp án của bài tập 1.11, 1.19, 1.20

- Vị trí: `$.exercises[61]` (`ex.lon-nhat-khac-nhau-6`); `$.exercises[42]` (`ex.la-ma-bang-14`: 14 = XIV, nhiễu XVI, XXIV); `$.exercises[41]` (`ex.chon-la-ma-lon-hon-20`: đọc XIX, XVI). LL-08
- Nguồn: tr.9 (1.11), tr.10 (1.19: XIV, XVI, XIX, XXI; 1.20: 14, 24, 26), đáp án tr.94-95 (987 654; XIV, XXIV)
- Vấn đề: `lon-nhat-khac-nhau-6` là 1.11 đổi câu hỏi thành câu lệnh, giữ nguyên số và đáp án. `la-ma-bang-14` là 1.20 đảo thành câu chọn, cả ba lựa chọn chính là số của sách và đáp án trùng lời giải. Nhóm 2 ghi câu thứ hai là Nên sửa; Tổng hợp nâng lên vì cùng kiểu với câu thứ nhất và với tiền lệ LL-08 (`so-nguyen-to` vòng 1: câu kho ôn dùng đúng số và lời giải của sách).
- Sửa: `lon-nhat-khac-nhau-6` đổi số chữ số (bốn: 9 876, hoặc bảy: 9 876 543), sửa `check.expr`, `answer`, `explain`. `la-ma-bang-14` thành "Số La Mã nào có giá trị 29?" với XXIX (đúng), XXXI, XIXX, XXVIII (không dùng XXVIIII: cộng thành phần cũng ra 29, thành nhiễu đúng, LL-01). `chon-la-ma-lon-hon-20`: XXIII, XVIII, XXVI, XII.

### 9. Section que tính là bài 1.21 kèm đúng hai cách của lời giải sách

- Vị trí: `$.sections[9]` (`section.que-tinh`): note `$.sections[9].blocks[0..1]`, hình `que-goc`, `que-cach-1`, `que-cach-2`, `que-tom-tat`; `$.exercises[49]` (`ex.doi-1-que`). LL-08
- Nguồn: tr.10 (1.21, IV + V = XI, 12 que), lời giải tr.95 (Cách 1 VI + V = XI, Cách 2 IV + V = IX, kèm hình que)
- Vấn đề: Đề, hình que, "Cách 1, Cách 2" và hình lời giải là của sách; câu luyện tập hỏi lại đúng hai cách đó. Tiền lệ LL-08 (`phep-nhan-phep-chia` vòng 1, ví dụ mẫu là bài 1.39 b kèm đúng lời giải; `so-nguyen-to` vòng 2) tính đây là chép. Tổng hợp đã đếm que: I = 1, V = 2, X = 2, "+" = 2, "=" = 2, IV + V = XI đủ 12 que; dời đúng 1 que có 4 phép đúng: VI + V = XI, IV + V = IX (hai cách của sách), V + VI = XI, IV + VI = X.
- Sửa: Màn mẫu dùng một phép que khác sách, vd VI + I = V (sai; dời 1 que được IV + I = V hoặc V + I = VI), rồi để bé tự tìm cách cho IV + V = XI ở câu luyện tập với hai cách sách không ghi (V + VI = XI, IV + VI = X; xem Nên sửa 10). Đổi recap theo (Nên sửa 11).

### 10. Recap "viết thêm chữ số để được số lớn nhất, bé nhất" bỏ điều kiện "khác 0" và vế "viết ở cuối"

- Vị trí: `$.sections[13].recap.caption`, `$.cards[13].recap.caption` (`section.them-lon-be`, `card.them-lon-be`); note `$.sections[13].blocks[1].children[0].text`; hình recap `them-lon-nho-tom-tat`. LL-06, LL-17
- Nguồn: tr.9-10 bài 1.15, 1.16, lời giải tr.95 (1.15b 8 125 749: chữ số 9 viết ở cuối)
- Vấn đề: Recap chỉ còn "Muốn số bé nhất, viết chữ số thêm vào trước chữ số đầu tiên lớn hơn nó." Chữ số thêm là 0 thì mọi chữ số đầu đều lớn hơn 0, nên làm theo recap ra 08 152 (đúng là 80 152), trái quy tắc section 2. Nhóm 3 thử máy: sai với mọi số khi chữ số thêm là 0, đúng hết với 1-9. Trong note, "Chữ số thêm khác 0" đọc như lời khẳng định, không rõ là điều kiện, cũng không nói 0 thì làm gì. Recap còn bỏ vế "không có chữ số nào bé hơn (lớn hơn) thì viết ở cuối", trong khi câu kho ôn `them-1-vao-9863` (đáp án khe cuối) và bài 1.15b cần đúng vế đó; hình recap cũng chỉ có ví dụ chèn ở đầu, ở giữa.
- Sửa: Đưa điều kiện vào câu quy tắc để recap lặp nguyên văn vẫn đúng, vd "Muốn được số lớn nhất, viết chữ số thêm vào trước chữ số đầu tiên bé hơn nó, không có thì viết ở cuối." và "Muốn được số bé nhất, viết chữ số thêm (khác 0) vào trước chữ số đầu tiên lớn hơn nó, không có thì viết ở cuối." Muốn dạy cả trường hợp 0: thêm "Chữ số thêm là 0 thì viết ngay sau chữ số đầu tiên." kèm ví dụ 8 152 → 80 152. Hình recap thêm một ví dụ viết ở cuối.

### 11. Ví dụ của mẹo "Liệt kê có thứ tự" bị cắt trên điện thoại: hiện "15, 26, 37, 48, 5"

- Vị trí: `$.sections[14].blocks[1].tex` (`tip.liet-ke-co-thu-tu`). LL-12
- Nguồn: walk điện thoại `180-s15-02-block.png` (iPad hiện đủ)
- Vấn đề: Dòng `15, \quad 26, …, \quad 59` rộng hơn khung điện thoại, 59 chỉ còn "5". Bé đọc ra dãy sai ở đúng màn dạy liệt kê không sót. Do nội dung (`\quad` quá rộng), không phải bố cục app.
- Sửa: Bỏ `\quad`, viết `15;\ 26;\ 37;\ 48;\ 59` hoặc xếp hai dòng bằng `aligned` (hoặc bỏ cả mẹo theo Nên sửa 20); chạy lại walk.

### 12. Hình chạm khe `gaps`: khe đã chọn thành khung đen dày giống chữ số 0, đè lên chữ số hai bên

- Vị trí: `$.exercises[68]`-`$.exercises[71]` (`ex.them-4-vao-8152`, `ex.them-5-vao-7308`, `ex.them-4-vao-2915`, `ex.them-1-vao-9863`); `src/visuals/math/cach-ghi-so-tu-nhien/gaps.tsx`. LL-21, LL-12
- Nguồn: walk điện thoại `173-s14-03-exercise-them-4-vao-8152-correct.png`, `175-s14-04-exercise-them-5-vao-7308-correct.png`; iPad sheet-29, sheet-30
- Vấn đề: Tổng hợp kiểm mã: khe là `rect` rộng 24 đơn vị nằm trong `Region`; khi chọn, `Region` vẽ viền 20px màu chữ quanh hình, khoảng hở tới ô chữ số chỉ 4 đơn vị, nên viền đè lên chữ số kề và khe thành khung đen bo tròn cao bằng ô số. Màn đọc thành "8 0 1 5 2", ngay sau section dạy "viết thêm chữ số 0"; chữ số 4 bé định viết không hiện ở chỗ đã chọn. Trên iPad hình nhỏ (`max-w-sm`), khe hẹp khó chạm.
- Sửa: Ở khe đã chọn, vẽ chính chữ số cần thêm (màu `sky` của "Chữ số viết thêm") thay khung rỗng; nới khoảng giữa các ô để viền chọn không đè chữ số; cho hình rộng hơn trên iPad. Chụp lại walk.

### 13. Đồng hồ chạm `cham-dong-ho-ix`: chữ số La Mã đã chọn bị tô kín, không đọc được

- Vị trí: visual `cham-dong-ho-ix` (`src/visuals/math/cach-ghi-so-tu-nhien/clock.tsx`, `ClockPick`), câu `$.exercises[32]` (`ex.cham-la-ma-9`). LL-12
- Nguồn: walk `098-s7-05-exercise-cham-la-ma-9-correct.png`
- Vấn đề: Trong `ClockPick`, `<text>` của số La Mã nằm trong `Region`; viền chọn 20px của `Region` (`paintOrder="stroke"`) áp lên cả chữ, cùng màu chữ, nên ô IX thành khối đen đặc. Lúc sai, chữ bị viền cam; lúc hiện đáp án, viền xanh: bé không đọc được cả số mình chọn lẫn số đúng. Hình khác trong repo đặt `stroke="none"` cho chữ trong `Region` (`src/visuals/math/tap-hop/set-tap.tsx`), nên đây là lỗi của hình bài này, không phải của app. Nhóm 2 ghi Nên sửa kèm điều kiện "nếu do app thì Góp ý"; mã cho thấy do hình của bài nên Tổng hợp nâng lên Nghiêm trọng theo checklist trục 5 (chữ bị che do nội dung bài).
- Sửa: Thêm `stroke="none"` cho `<text>` trong `ClockPick` (hay đưa chữ ra ngoài `Region` với `pointer-events-none`); chụp lại walk.

## Nên sửa

### 1. Màn hướng dẫn thao tác section 6 bảo bé viết số, nhưng hình là hình mẫu không chạm được

- Vị trí: `$.sections[5].blocks[3].children[0]` (`section.tong-gia-tri`, group `guide: "manipulate"`). LL-10, LL-16
- Nguồn: walk `080-s6-04-block`, `081-s6-04-block-shown`
- Vấn đề: Note "Bây giờ hãy viết số bằng tổng bên dưới." nhưng khung hiện "Hình mẫu, chưa cần chạm" và khoá hình. Section 6 không có màn bé tự thao tác trước câu kiểm tra.
- Sửa: Đổi note thành lời của màn mẫu, vd "Xem cách viết số từ tổng: bấm + hoặc − ở mỗi hàng để đổi chữ số. Ở câu sau bạn sẽ tự làm như vậy." Muốn có màn cùng làm: thêm một `visual` `slots` thường với số khác 2 054.

### 2. Tờ tiền 10 đồng, 100 đồng bé không gặp ngoài đời

- Vị trí: `$.sections[5].blocks[1].children[0]`, hình `tong-tien` (`section.tong-gia-tri`); `$.exercises[30]` (`ex.dem-tien-3250`)
- Nguồn: —
- Vấn đề: Không còn tờ 10 đồng lưu hành, tờ 100 đồng gần như không dùng; ví dụ đời sống mất tác dụng.
- Sửa: Đếm theo nghìn (tờ 100 nghìn, 10 nghìn, 1 nghìn) hoặc vật khác (hộp 100 viên, gói 10 viên, viên lẻ).

### 3. Nhãn "10 tờ = 1 tờ" trong hình đổi tiền đọc như phép sai

- Vị trí: hình `doi-tien` (`$.sections[3].blocks[1].children[1]`, `section.muoi-don-vi`), `rows[0].tag.text`. LL-21, LL-15
- Nguồn: walk `050-s4-02-block`
- Vấn đề: Bé đọc "mười tờ bằng một tờ", không biết tờ loại nào.
- Sửa: "10 tờ 10 nghìn = 1 tờ 100 nghìn" hay "10 chục nghìn = 1 trăm nghìn".

### 4. Công thức xuống dòng giữa phép tính trên điện thoại

- Vị trí: hình `tong-tien` `rows[0].tex` (`$.sections[5].blocks[1].children[1]`); `$.exercises[85].explain.tex` (`ex.chon-tong-4`). LL-12
- Nguồn: walk `077-s6-02-block`, `078-s6-02-block-end`, `207-s17-04-exercise-chon-tong-4-correct.png`
- Vấn đề: "2 · 1000 + 5 · 100 + 4 ·" rồi "10" ở dòng dưới; "1 + 2 +" rồi "1 = 4". Bé đọc phép nhân, phép cộng lửng.
- Sửa: `tong-tien` tách mỗi số hạng một hàng trong `rows`; `chon-tong-4` dùng `\begin{aligned} 2 + 0 + 2 &= 4 \\ 1 + 2 + 1 &= 4 \end{aligned}`.

### 5. Giải thích câu chọn số có ba chữ số dùng ý chưa dạy và chữ "nằm giữa" mơ hồ

- Vị trí: `$.exercises[6].explain.text` (`ex.chon-ba-chu-so-so`). LL-09
- Nguồn: —
- Vấn đề: "Số có ba chữ số thì nằm giữa 100 và 999" dùng ý số bé nhất, lớn nhất (section 11 mới dạy); "nằm giữa" để bé hỏi 100, 999 có tính không.
- Sửa: "Đếm chữ số của từng số: 305 và 987 có ba chữ số, 54 có hai, 1 200 có bốn."

### 6. Câu kho ôn `dung-bon-chu-so` lặp số của câu luyện tập và câu kho ôn khác

- Vị trí: `$.exercises[9]` (`ex.dung-bon-chu-so`) so với `$.exercises[6]` (`ex.chon-ba-chu-so-so`) và `ex.dem-chu-so-12000`. LL-07
- Nguồn: —
- Vấn đề: 305 trùng câu luyện tập, 12 000 trùng câu kho ôn khác.
- Sửa: 305 thành 760, 12 000 thành 30 500 (hay số khác chưa dùng).

### 7. Giải thích "số này không có chục" nói sai về 7 305

- Vị trí: `$.exercises[11].explain.text` (`ex.cham-hang-chuc`)
- Nguồn: —
- Vấn đề: 7 305 có 730 chục (section 4 dạy đổi hàng); câu dễ làm bé hiểu số không chứa chục nào.
- Sửa: "Chữ số ở hàng chục là 0, nghĩa là hàng chục không có đơn vị nào."

### 8. Màn tương tác thiếu dòng "để làm gì"

- Vị trí: `$.sections[4].blocks[1].children[0]` (section 5); `$.sections[7].blocks[2].children[0]` (section 8); `$.sections[8].blocks[2].children[0]` (section 9); `$.sections[9].blocks[2].children[0]` (section 10); `$.sections[11].blocks[2].children[0]` (section 12); `$.sections[14].blocks[2].children[0]` (section 15); `$.sections[15].blocks[2].children[0]` (section 16); `$.sections[16].blocks[1].children[0]` (section 17). Cả ba nhóm ghi.
- Nguồn: checklist trục 5 "Màn tương tác nói rõ làm gì và để làm gì"
- Vấn đề: Câu thứ hai của các note này là một sự kiện hay cách làm ("Chữ số 0 có giá trị bằng 0.", "Bạn tách thành phần rồi cộng lại.", "Đọc số La Mã rồi cộng.", "Thử từng số một.", "Cộng các chữ số của từng số."), không phải lý do; các màn đã có "Làm vậy bạn…" (section 5 màn 3, section 7, 11, 13) làm đúng.
- Sửa: Thêm một câu "Làm vậy bạn…" cho từng màn, vd section 5 "Làm vậy bạn thấy cùng một chữ số có giá trị khác nhau ở mỗi hàng."; section 8 "Làm vậy bạn quen tách số La Mã dài thành từng thành phần."; section 9 "Làm vậy bạn nhớ chục viết trước, đơn vị viết sau."; section 10 "Làm vậy bạn kiểm được một phép cộng số La Mã trước khi dời que."; section 12 "Làm vậy bạn nhớ số bé nhất bắt đầu bằng 1 rồi 0."; section 15 "Làm vậy bạn quen kiểm từng số theo đề."; section 16 "Làm vậy bạn nhớ tập các chữ số không ghi lặp."; section 17 "Làm vậy bạn thấy số nào có tổng đúng bằng 5."

### 9. Thuật ngữ "thành phần" chỉ có ở nhãn hình; câu ôn dùng sai nghĩa

- Vị trí: `$.sections[6].blocks[0].children[0].text` (`section.chu-la-ma`); dùng ở `$.sections[7].blocks[0].children[0].text`, `$.exercises[34]` (`ex.thanh-phan-lon-hon-4`), `$.exercises[45].prompt[0]` (`ex.ghep-23`). LL-05
- Nguồn: tr.7 (I, V, X, IV, IX "là các thành phần viết nên số La Mã")
- Vấn đề: Câu quy tắc section 7 không có chữ "thành phần" (chỉ nhãn `la-ma-thanh-phan` có), trong khi luật section 8 và `thanh-phan-lon-hon-4` cần bé biết từ đó. `ghep-23` gọi XX và III là "hai thành phần", trái nghĩa sách.
- Sửa: Thêm vào note quy tắc section 7 (recap lặp nguyên văn) "Năm thứ này là các thành phần của số La Mã." `ghep-23` thành "Chọn cách viết chục và cách viết đơn vị để được số 23."

### 10. Câu luyện tập que tính lặp đúng hai cách và bốn lựa chọn vừa hiện trên màn

- Vị trí: `$.exercises[49]` (`ex.doi-1-que`), `$.sections[9].blocks[1]` (`que-cach-1`, `que-cach-2`), `$.sections[9].blocks[2]` (`chon-phep-dung`). LL-07, LL-14
- Nguồn: tr.10 (1.21), tr.95
- Vấn đề: Màn 3 cho chạm đúng bốn phép của câu luyện tập; bé chọn theo trí nhớ. Hai nhiễu chỉ cần kiểm phép cộng, không cần nghĩ tới dời que.
- Sửa: Lựa chọn V + VI = XI (đúng), IV + VI = X (đúng), V + IV = XI (dời được 1 que, 5 + 4 = 9, sai), IV + IV = X (dời được 1 que, 4 + 4 = 8, sai). Tổng hợp đã đếm lại que, bốn phép đều được bằng đúng 1 que.

### 11. Recap que tính không tóm tắt điều gì, chữ lệch hình

- Vị trí: `$.sections[9].recap`, `$.cards[9].recap` (`card.que-tinh`), visual `que-tom-tat` (`VI+V=XI`). LL-06, LL-15
- Nguồn: tr.95
- Vấn đề: Caption "Đổi chỗ 1 que của IV + V = XI để phép cộng đúng." là lời đề; hình lại vẽ VI + V = XI. Bé ôn card không biết phải nhớ gì.
- Sửa: Caption nêu điều cần nhớ, vd "Dời chữ I sang bên kia chữ V hay chữ X thì giá trị đổi: IV là 4, VI là 6; XI là 11, IX là 9." Hình vẽ cặp IV/VI, XI/IX.

### 12. Câu ôn của card que tính không luyện ý của card

- Vị trí: `$.exercises[50]`, `$.exercises[51]`, `$.exercises[52]` (`ex.ix-cong-v`, `ex.vii-cong-v`, `ex.vi-cong-iv`)
- Nguồn: tr.10 (1.21)
- Vấn đề: Cả ba chỉ là đọc số La Mã rồi cộng, như card `doc-so-la-ma`; không câu nào hỏi dời que. `vi-cong-iv` dùng VI + IV của lựa chọn c câu kiểm tra `chon-phep-cong-dung`, và dùng từ "vế trái" bài chưa dạy.
- Sửa: Thay ít nhất một câu bằng câu dời que với số khác, vd "Que xếp thành VI + I = V (sai). Chọn tất cả phép cộng đúng khi dời đúng 1 que." đáp án IV + I = V, V + I = VI; nhiễu V + II = V, V + I = IV (đều 10 que). `vi-cong-iv` đổi lời thành "Tính VI + IV." và đổi số. Nếu dùng VI + I = V làm màn mẫu theo Nghiêm trọng 9 thì câu ôn chọn phép que khác nữa.

### 13. Ví dụ, mẹo, recap lộ đáp án câu luyện tập và câu ôn ở section 11, 12

- Vị trí: `$.sections[10].blocks[2]` (`tip.cong-1-len`, 999 + 1 = 1 000) với `$.exercises[54]` (`ex.be-nhat-4-chu-so`, câu luyện tập); `be-nhat-vd` (10 000) với `$.exercises[56]`; `lon-nhat-vd` và recap `lon-be-tom-tat` (999) với `$.exercises[57]`; recap `khac-nhau-tom-tat` (98 765, 10 234) với `$.exercises[59]` (câu luyện tập), `$.exercises[60]`. LL-07
- Nguồn: —
- Vấn đề: Mẹo ngay trước câu luyện tập in sẵn đáp án; recap và hình ví dụ in sẵn đáp án ba câu ôn.
- Sửa: Mẹo dùng 99 + 1 = 100; `be-nhat-vd`, `lon-nhat-vd` dùng số chữ số khác câu ôn; recap `khac-nhau-tom-tat` dùng bốn chữ số (9 876, 1 023) hoặc đổi câu ôn sang sáu, bảy chữ số.

### 14. Câu quy tắc section 11 "có một số chữ số cho trước" khó hiểu

- Vị trí: `$.sections[10].blocks[0].children[0].text` (`section.lon-be-nhat`), `$.sections[10].recap.caption`, `$.cards[10].recap.caption`. LL-25, LL-10
- Nguồn: tr.9 (1.10)
- Vấn đề: Hai chữ "số" sát nhau, bé dễ đọc thành "có một chữ số".
- Sửa: "Muốn viết số lớn nhất khi biết số có mấy chữ số, viết toàn chữ số 9." Đổi recap theo (xem cả Nên sửa 28).

### 15. Nhiều section Toán không có ví dụ đời sống trên màn học

- Vị trí: `$.sections[0]` (section 1, ví dụ đời sống duy nhất là câu kho ôn `ex.ro-cam-trong`); `$.sections[11]` (section 12, cả ba màn và năm câu là số trần); `$.sections[12]`-`$.sections[16]` (section 13-17, ví dụ đời sống chỉ ở câu kho ôn). LL-16
- Nguồn: luật "Ví dụ đời sống ở mọi section Toán" (`.claude/skills/lesson-author/SKILL.md`)
- Vấn đề: Bé đi hết section (khối, câu kiểm tra, câu luyện) không gặp tình huống đời sống nào. Nhóm 1 ghi section 1 ở mức Góp ý; gộp lên Nên sửa cùng phát hiện của nhóm 2, 3.
- Sửa: Mỗi section thêm một câu đời sống vào note hay đề câu kiểm tra/luyện tập, vd section 1 "Rổ cam hết thì bạn đếm được 0 quả."; section 12 "Mật mã khoá cặp có bốn chữ số khác nhau. Mật mã lớn nhất là số nào?"; section 13 "Giá 25 nghìn đồng, viết thừa một chữ số 0 thành 250 nghìn, gấp 10 lần."; section 16 mã khoá dùng các chữ số 3 và 6; section 17 số nhà có tổng các chữ số cho trước.

### 16. Nấc 1 tô câu lệnh thay vì số La Mã cần đọc

- Vị trí: `$.exercises[37]`-`$.exercises[40]`, `$.exercises[50]`-`$.exercises[52]` (`hints.highlight` = block 0). LL-02
- Nguồn: —
- Vấn đề: Đề có câu lệnh (block 0) và công thức số La Mã (block 1); lần sai đầu sáng câu lệnh chứ không sáng số bé đọc sai. Không thuộc ngoại lệ "đề chỉ có một câu chữ".
- Sửa: `{ "target": "block", "index": 1 }` hoặc `target: "part"` vào cụm IV, IX trong công thức.

### 17. Màn mở đầu que tính không nói mục đích của việc dời que

- Vị trí: `$.sections[9].blocks[0].children[0].text` (`section.que-tinh`). LL-10
- Nguồn: tr.10 (1.21)
- Vấn đề: "… bạn phải đổi chỗ đúng 1 que." thiếu "để phép cộng thành đúng".
- Sửa: "12 que xếp thành phép cộng sai. Bạn dời đúng 1 que để phép cộng thành đúng." (với phép que mới theo Nghiêm trọng 9).

### 18. Nấc 2 của câu 9 863 không có trường hợp "viết ở cuối"

- Vị trí: `$.exercises[71].hints.hintVisualId` (`ex.them-1-vao-9863`, hình `goi-y-them-lon`). LL-15
- Nguồn: tr.9 bài 1.15b, lời giải tr.95
- Vấn đề: Hình gợi ý (935, thêm 6) là ví dụ chèn ở giữa; đáp án câu này là khe cuối, nên gợi ý không chỉ chỗ bé hay sai.
- Sửa: Hình gợi ý riêng với số khác đề, vd 754 thêm 2: 7, 5, 4 đều lớn hơn 2, viết 2 ở cuối, dừng ở "?".

### 19. Section 14 thiếu màn cùng làm; thao tác chạm khe xuất hiện lần đầu ở câu kiểm tra

- Vị trí: `$.sections[13].blocks`, `$.exercises[68]` (`ex.them-4-vao-8152`). LL-16, LL-04
- Nguồn: walk `172-s14-03-exercise-them-4-vao-8152.png`
- Vấn đề: Hai màn quy tắc rồi tới ngay câu kiểm tra; kiểu chạm khe xám mảnh (khác chạm chữ số ở section 3) chưa được làm thử. Đề chỉ nói "Chạm vào chỗ viết chữ số 4", không nói chỗ đó là các khe xám.
- Sửa: Thêm một màn tương tác có hướng dẫn trước câu kiểm tra (hình `gaps` với số khác, note "Chạm vào khe xám giữa hai chữ số để viết chữ số mới vào đó. Làm vậy bạn thấy số mới lớn hay bé."), có dòng kết khi làm xong.

### 20. Mẹo "Liệt kê có thứ tự" chỉ nói lại quy tắc, ví dụ trùng hình và recap

- Vị trí: `$.sections[14].blocks[1]` (`tip.liet-ke-co-thu-tu`)
- Nguồn: checklist trục 5 "Mẹo có mặt khi dạng bài có mẹo thật, không gượng"
- Vấn đề: Quy tắc đã bảo "thử lần lượt các chữ số hàng chục từ 1 đến 9"; mẹo "chữ số hàng chục tăng dần" cùng một ý. Ví dụ 15, 26, 37, 48, 59 là dãy của `hai-chu-so-vd` và recap.
- Sửa: Bỏ mẹo, hoặc đổi sang mẹo tránh sai thật: "Đơn vị hơn chục là k thì hàng chục chỉ đi tới 9 − k" (đã thử, Bảng thử mẹo), ví dụ số khác hình.

### 21. Hình ví dụ section 15 dừng ở hàng chục 5, không cho thấy vì sao 6-9 bị loại

- Vị trí: hình `hai-chu-so-vd` (`$.sections[14].blocks[0].children[1]`), recap `hai-chu-so-tom-tat`
- Nguồn: tr.9 bài 1.9
- Vấn đề: Bước "hàng chục 6 thì đơn vị là 10, không được" là bước bé hay quên (câu `dem-hon-7` cần nó) nhưng ví dụ mẫu không có.
- Sửa: Thêm dòng `6 + 4 = 10` nhãn "chục 6: đơn vị là 10, không được, dừng" trước dòng tập A.

### 22. Quy tắc section 17 thiếu "hàng trăm từ 1"; "các cặp … còn thiếu" mơ hồ

- Vị trí: `$.sections[16].blocks[0].children[0].text`, `$.sections[16].recap.caption`, `$.cards[16].recap.caption` (`section.tong-chu-so`). LL-10
- Nguồn: tr.9 bài 1.13, lời giải tr.94-95
- Vấn đề: Không nói chọn hàng trăm từ 1 (câu kho ôn `tap-hop-tong-2` chấm đúng lỗi 002, 011, 020); "còn thiếu" không nói thiếu gì.
- Sửa: "Muốn liệt kê số có ba chữ số theo tổng các chữ số, thử chữ số hàng trăm từ 1 trở lên. Với mỗi chữ số đó, tìm các cặp chữ số hàng chục và hàng đơn vị có tổng bằng phần còn lại." Đổi recap theo.

### 23. Quy tắc 2 của section 16 là một ví dụ có số cụ thể; bài chưa phân biệt "tập các chữ số là P" với "chữ số lấy trong P"

- Vị trí: `$.sections[15].blocks[1].children[0].text`, `$.sections[15].recap.caption`, `$.cards[15].recap.caption`; `$.exercises[83]` (`ex.mat-khau-3-6`). LL-09
- Nguồn: tr.8-9 ví dụ 2 (a, c), bài 1.12 (a, b), lời giải 1.12 tr.94
- Vấn đề: Câu chỉ nói về {0; 2; 5}; recap card lặp số cụ thể. Ý chính của ví dụ 2 và 1.12 là hai cách hỏi khác nhau; section không dạy, nhưng `mat-khau-3-6` hỏi kiểu "lấy trong tập" (đáp án 4 gồm 33, 66). Bé áp quy tắc section dễ trả lời 2.
- Sửa: "Số có ba chữ số mà tập các chữ số có ba phần tử thì mỗi chữ số có mặt đúng một lần.", giữ {0; 2; 5} ở hình. Thêm câu phân biệt: "Chữ số lấy trong tập {3; 6} thì được lặp và không cần đủ: 33, 36, 63, 66."

### 24. Section 13 gộp hai quy tắc cần nhớ riêng

- Vị trí: `$.sections[12].blocks[0..1]`, `$.sections[12].recap.caption`; `$.sections[13].recap.caption`
- Nguồn: checklist trục 5 "Section ngắn, một ý"
- Vấn đề: Section 13 dạy hai quy tắc độc lập (thêm 0 bên phải gấp 10 lần; thêm 1 bên trái số ba chữ số tăng 1 000) cộng một mẹo; recap phải có hai câu. Section 14 cũng hai quy tắc nhưng soi gương nhau nên đỡ hơn.
- Sửa: Tách section 13 thành hai section (thêm vào cuối, thêm vào đầu). Section 14 giữ được nếu sửa theo Nghiêm trọng 10.

### 25. Câu kho ôn `tap-hop-tong-2` trùng tập số với câu kiểm tra `dem-tong-2`

- Vị trí: `$.exercises[87]` (`ex.tap-hop-tong-2`), `$.exercises[84]` (`ex.dem-tong-2`). LL-07
- Nguồn: luật "Luyện tập và kho ôn khác số" (`lesson-author/SKILL.md`)
- Vấn đề: Giải thích câu kiểm tra in sẵn `{101; 110; 200}`, câu kho ôn hỏi lại đúng tập đó.
- Sửa: Đổi sang tập khác (không lấy tổng 3, trùng ví dụ và recap), vd "hàng trăm là 2, tổng bằng 4" (`{202; 211; 220}`).

### 26. Khái niệm "chữ số viết thêm" có hai màu và ba tên

- Vị trí: hình `gaps` (`gaps.tsx`, ô "Chữ số cần thêm" `border-concept-amber`), `$.exercises[68]`-`$.exercises[71]`; note quy tắc `$.sections[13].blocks[0..1]` và recap section, card 14 ("chữ số thêm"); `concepts` ("Chữ số viết thêm", sky), glossary `chữ số viết thêm` (sky)
- Nguồn: `concepts` của bài (`phan-tu` = amber), `content/glossary/math.json`
- Vấn đề: Nhóm 3 ghi màu: mọi hình section 13, 14 tô chữ số viết thêm bằng sky, riêng `gaps` dùng amber, là màu "Phần tử" của bài. Tổng hợp thêm tên: quy tắc và recap gọi "chữ số thêm", `concepts` và glossary gọi "chữ số viết thêm", `gaps` gọi "Chữ số cần thêm". Một khái niệm hai màu, ba tên (checklist trục 4).
- Sửa: `gaps` dùng `concept-sky`; thống nhất tên "chữ số viết thêm" ở quy tắc, recap và nhãn hình (sửa cùng lúc với Nghiêm trọng 10).

### 27. `overview.summary` và `goals` không nhắc nửa sau của bài

- Vị trí: `$.overview.summary`, `$.overview.goals` (nhóm 1 ghi Góp ý, nhóm 3 ghi Nên sửa; giữ mức cao hơn)
- Nguồn: section 11-17, tr.9-10 (bài 1.8-1.16)
- Vấn đề: Tổng quan chỉ nói hàng, giá trị, viết thành tổng, số La Mã; bảy section 11-17 (số lớn nhất, bé nhất; viết thêm chữ số; tìm, liệt kê số theo đề; tập các chữ số; tổng các chữ số) chiếm gần nửa bài.
- Sửa: Summary thêm vế "và cách tìm, liệt kê số theo điều kiện về chữ số"; thêm goal "tìm và liệt kê các số theo điều kiện về chữ số" (vẫn 2-4 mục: gộp hai mục La Mã, giá trị nếu cần).

### 28. Ba section nói luật "số lớn nhất, số bé nhất" theo ba khuôn câu, không nêu ngữ cảnh ở đầu câu

- Vị trí: `$.sections[10].blocks[0..1]` ("Số lớn nhất có … thì …"), `$.sections[11].blocks[0..1]` ("Muốn viết số lớn nhất có các chữ số khác nhau, ta viết …"), `$.sections[13].blocks[0..1]` ("Muốn số lớn nhất, viết chữ số thêm …"); recap section và card 11, 12, 14. LL-05
- Nguồn: —
- Vấn đề: Phát hiện của Tổng hợp. Sáu câu quy tắc cùng nói "số lớn nhất/bé nhất" nhưng mỗi section một khuôn, và câu section 14 "Muốn số lớn nhất" thiếu động từ, không nói đây là khi viết thêm một chữ số vào số đã có. Ở phiên ôn, card trộn lẫn, bé khó biết câu nào dùng cho bài nào (Nghiêm trọng 7 là một ca đã thành sai).
- Sửa: Mở mọi câu bằng ngữ cảnh theo một khuôn, vd "Số lớn nhất có n chữ số: …", "Số lớn nhất có n chữ số khác nhau: …", "Viết thêm một chữ số để được số lớn nhất: …" (diễn đạt thành câu đủ chủ vị, không dùng "n" nếu bài chưa dùng chữ thay số).

## Góp ý

### 1. `minutes` thấp hơn số màn nhân 40 giây

- Vị trí: `$.sections[0..11].minutes` (nhóm 1, nhóm 2 cùng ghi)
- Nguồn: —
- Vấn đề: Section 1, 2, 4, 5, 7-12 có 6 màn, khoảng 4 phút, ghi 3; section 6 và 11 có 7 màn, khoảng 5 phút, ghi 4 và 3.
- Sửa: Tăng 1 phút (section 11: 5).

### 2. Recap section hàng không có câu thứ tự các hàng

- Vị trí: `$.sections[2].recap.caption`, `$.cards[2].recap.caption` (`section.hang`, `card.hang`). LL-06
- Nguồn: —
- Vấn đề: Caption chỉ lặp câu định nghĩa; câu dùng làm bài (thứ tự các hàng) chỉ còn ở nhãn hình.
- Sửa: Lặp cả hai câu của note (sau khi sửa theo Nghiêm trọng 1, 2).

### 3. Câu kiểm tra section 4 lặp đúng một hàng của hình quy tắc

- Vị trí: `$.exercises[15]` (`ex.muoi-tram-bang-nghin`) so với hình `doi-hang` ("10 trăm = 1 nghìn"). LL-07
- Nguồn: —
- Vấn đề: Bé chép lại từ màn vừa xem.
- Sửa: Dùng số không có trong hình, vd "20 chục bằng bao nhiêu trăm?".

### 4. Đề que tính có 4 cách, sách chỉ ghi 2

- Vị trí: `$.sections[9].blocks[1].children[0].text` (`section.que-tinh`)
- Nguồn: tr.10 (1.21 hỏi "Em tìm được mấy cách làm?"), tr.95 (Cách 1, Cách 2)
- Vấn đề: Tổng hợp đã đếm que (Nghiêm trọng 9): có 4 phép đúng. Bài không viết "chỉ có hai cách" nên không sai, nhưng kịch bản video hay lời đọc sau này dễ nói "có hai cách" như sách.
- Sửa: Tránh câu đếm số cách; dùng hai cách sách không ghi cho câu luyện tập (Nên sửa 10).

### 5. Số nhà 999 trong "một con ngõ nhỏ" không thật

- Vị trí: `$.exercises[57]` (`ex.so-nha-lon-nhat`)
- Nguồn: —
- Vấn đề: Ngõ nhỏ không có 999 nhà; 999 còn trùng recap (Nên sửa 13).
- Sửa: vd "Máy đếm bước chỉ hiện được năm chữ số. Số lớn nhất nó hiện được là bao nhiêu?" (99 999).

### 6. Câu kiểm tra IV = 4 lặp ví dụ đồng hồ ngay trước nó

- Vị trí: `$.exercises[31]` (`ex.gia-tri-iv`), `$.sections[6].blocks[1]` (đồng hồ chỉ IV). LL-07
- Nguồn: —
- Vấn đề: Đáp án vừa in ở màn trước.
- Sửa: Hỏi giá trị của IX hay V (nhiễu 4, 9, 11).

### 7. Recap đọc số La Mã dùng XXV, trùng lựa chọn câu ôn

- Vị trí: visual `doc-la-ma-tom-tat` (XXV = 25), `$.exercises[41]` lựa chọn c. LL-07
- Nguồn: —
- Vấn đề: Câu ôn hỏi lại số vừa in ở recap.
- Sửa: Đổi lựa chọn c thành XXVI hay đổi recap (khi sửa câu này theo Nghiêm trọng 8 thì tránh luôn XXV).

### 8. Thiếu `wrong` cho nhiễu XIIII

- Vị trí: `$.exercises[43].explain.wrong` (`ex.chon-viet-13`)
- Nguồn: —
- Vấn đề: XIIII là lỗi hay gặp (bốn chữ I), cộng lại 14.
- Sửa: Thêm `{ "optionId": "b", "text": "XIIII có bốn chữ I, là 10 + 4 = 14, và 4 viết là IV." }`.

### 9. Mẹo "Từ số lớn nhất sang số bé nhất" dễ bị đem dùng cho số có các chữ số khác nhau

- Vị trí: `$.sections[10].blocks[2]` (`tip.cong-1-len`). LL-24
- Nguồn: —
- Vấn đề: Mẹo đúng với mọi n; nhưng section ngay sau dạy chữ số khác nhau: 987 + 1 = 988, không phải 1 023. Chữ mẹo không hứa nên không sai.
- Sửa: Thêm "Mẹo này không dùng cho số có các chữ số khác nhau."

### 10. "Chữ", "chữ số", "chữ cái" La Mã dùng lẫn

- Vị trí: tên section 7 "Chữ số La Mã", note quy tắc section 7 "Chữ I, V, X", `$.exercises[33]` "Chữ nào…", visual `goi-y-la-ma` "Ba chữ cái La Mã"
- Nguồn: tr.7 ("chữ số I, V, X")
- Vấn đề: Một khái niệm ba tên.
- Sửa: Thống nhất "chữ số La Mã" ở tên section, note, câu và nhãn hình.

### 11. Lý do sai của phương án 10 482 chưa nói lỗi bé mắc

- Vị trí: `$.exercises[64].explain.wrong[1]` (`ex.them-1-482`)
- Nguồn: —
- Vấn đề: Loại bằng so với đáp án, không nói sai ở đâu.
- Sửa: "10 482 là viết thêm hai chữ số 1 và 0; đề chỉ viết thêm một chữ số 1."

### 12. Tình huống "viết thêm chữ số vào số nhà" gượng

- Vị trí: `$.exercises[70].prompt[0].text` (`ex.them-4-vao-2915`)
- Nguồn: —
- Vấn đề: Ngoài đời không ai thêm chữ số vào số nhà.
- Sửa: Thẻ số: "Nam có các thẻ 2, 9, 1, 5 xếp thành 2 915 và thêm một thẻ 4. Đặt thẻ 4 vào đâu để được số bé nhất?"

### 13. `tex` của `them-7-vao-4215`, `them-3-vao-5124` nhóm chữ số sai

- Vị trí: `$.exercises[72].explain.tex`, `$.exercises[73].explain.tex`
- Nguồn: —
- Vấn đề: "7 4215", "3 5124" trông như hai số.
- Sửa: `\concept{sky}{7}\,4\,215 = 74\,215`, `\concept{sky}{3}\,5\,124 = 35\,124`.

### 14. Từ ngữ nhỏ ở section 13

- Vị trí: `$.exercises[63].explain.text` (`ex.them-0-38`); `$.sections[12].blocks[0].children[0].text`
- Nguồn: —
- Vấn đề: "lùi sang trái" ("lùi" thường là đi về sau); "số đó gấp lên 10 lần" (số cũ không đổi, đúng ra là được số mới).
- Sửa: "dịch sang trái một hàng"; "thì được số mới gấp 10 lần số đó" (đổi recap theo).

### 15. Nhãn về "hàng trăm" lúc violet, lúc blue

- Vị trí: hình `lap-so-025`, `tong-chu-so-vd` (blue) so với `hai-chu-so-vd` (violet)
- Nguồn: `concepts`: `hang` = violet, `chu-so` = blue
- Vấn đề: Nhãn nói về hàng mà tô màu chữ số.
- Sửa: Thống nhất violet cho nhãn nói về hàng.

### 16. Section 17 chưa có mẹo tránh sai "hàng trăm từ 1"

- Vị trí: `$.sections[16].blocks`
- Nguồn: lời giải 1.13 tr.94-95
- Vấn đề: Lỗi hay gặp là viết 011, 020; câu kho ôn chấm đúng lỗi đó.
- Sửa: Thêm `tip` "tránh sai": "Hàng trăm luôn từ 1 trở lên; 011 chỉ là số 11." (nếu không đưa vào quy tắc theo Nên sửa 22).

## Bảng thử mẹo

Rút gọn từ ba tệp nhóm `.shots/review/cach-ghi-so-tu-nhien/nhom-{1,2,3}.md`. Ba reviewer đã tự giải mọi exercise trước khi đọc `answer`: mọi đáp án và mọi tập đáp án của câu chọn nhiều đều đúng.

| Mẹo / quy tắc | Đầu vào đã thử | Kết quả |
|---|---|---|
| `tip.viet-so-tu-tong` (hàng không có số hạng viết 0) | 3·1 000 + 7·10 + 2; 5·1 000 + 3·10 + 2; 4·1 000 + 6·10; 2·1 000; 5 + 3·100; 8·100; 6·10 + 5; 9 | Đúng khi hàng thiếu ở giữa, cuối; sai với 8·100 (0800), 6·10 + 5 (0065), 9 (0009) - Nghiêm trọng 3 |
| Quy tắc giá trị (nhân 1, 10, 100, 1 000) | 7 trong 7 214; 0 trong 3 507; 5 trong 5; 2 trong 12 560; 1 trong 12 560; 4 trong 40 618; 7 trong 728 031 | Không làm được từ hàng chục nghìn - Nghiêm trọng 1 |
| Mẹo đề xuất "thêm số chữ số 0 bằng số chữ số đứng sau" | 7 214; 5; 0 trong 3 507; 12 560; 728 031; 5 056 | Đúng hết; cần câu "chữ số 0 thì giá trị là 0" |
| `tip.i-truoc-i-sau` (I trước trừ 1, I sau cộng 1) | IV, VI, IX, XI, XVI; XIV, XIX, XXIV, XXIX | Đúng 5 số đầu; mơ hồ ở XIV, XIX, XXIV, XXIX - Nghiêm trọng 6 |
| `tip.cong-1-len` (lớn nhất n chữ số + 1) | n = 1, 2, 3, 4, 6; chữ số khác nhau n = 3 | Đúng mọi n; không dùng được cho chữ số khác nhau (987 + 1 = 988 ≠ 1 023) - Góp ý 9 |
| Lớn nhất: toàn 9; bé nhất (từ hai chữ số): 1 rồi 0 | 1, 2, 4, 6, 7 chữ số; 2, 3, 4, 5, 7 chữ số | Đúng |
| Lớn nhất chữ số khác nhau: từ lớn đến bé | 1, 2, 3, 6, 10 chữ số | Đúng |
| Bé nhất chữ số khác nhau: 1, 0, tăng dần | 1 chữ số; 2, 3, 5, 10 chữ số | Sai ở 1 chữ số (1, đúng là 0); đúng còn lại nếu "tăng dần" là 2, 3, 4… - Nghiêm trọng 7 |
| Viết số La Mã: chục trước, đơn vị sau | 4, 9, 14, 19, 20, 29, 30 | Đúng |
| Bài que tính (12 que, IV + V = XI) | Mọi cách dời 1 que I; đổi V/X bằng 1 que | 4 phép đúng: VI + V = XI, IV + V = IX, V + VI = XI, IV + VI = X; Tổng hợp đếm lại, khớp - Nghiêm trọng 9, Nên sửa 10, Góp ý 4 |
| `tip.nhan-10-100-1000` | 1·10; 7·100; 10·1 000; 35·100; 999·10; 120·100 | Đúng; 0 đã loại bằng "khác 0" |
| Thêm 0 bên phải gấp 10 lần (số khác 0) | 1, 9, 10, 38, 999 | Đúng |
| Thêm 1 bên trái số ba chữ số tăng 1 000 | 100, 250, 306, 482, 999; ngoài điều kiện 47, 2 915 | Đúng; điều kiện "ba chữ số" cần và đã có |
| Viết thêm chữ số để được số lớn nhất | 8 152 + 4; 7 308 + 5; 9 863 + 1; 4 215 + 7; 812 574 + 9; 812 574 + 6; 8 152 + 0; 553 + 5; máy: mọi số tới 99 999, chữ số 0-9 | Đúng hết (note); recap thiếu vế "ở cuối" - Nghiêm trọng 10 |
| Viết thêm chữ số để được số bé nhất | 2 915 + 4; 5 124 + 3; 2 713 + 5; 358 + 6; 812 574 + 9; 812 574 + 6; 1 000 + 1; máy: mọi số tới 99 999 | Đúng với chữ số 1-9; chữ số 0 sai với mọi số (08 152) - Nghiêm trọng 10 |
| Tìm số hai chữ số (hàng chục 1 đến 9) | hơn 4, hơn 2, hơn 7; chục gấp 3 đơn vị; đơn vị gấp 2 chục; chục hơn đơn vị 9 (1.8) | Đúng, khớp lời giải 1.8, 1.9 |
| `tip.liet-ke-co-thu-tu` | hơn 4, hơn 7, gấp 3, gấp 2, tổng 4 | Không sai, trùng quy tắc - Nên sửa 20 |
| Mẹo đề xuất "đơn vị hơn chục k thì hàng chục tới 9 − k" | k = 2, 4, 7, 8, 9 | Đúng (k = 9: không có số nào); không dùng cho "chục hơn đơn vị" |
| Tập các chữ số | 4 044; 7 337; 4 080; 9 090; 292; 9 922 | Đúng |
| Quy tắc 2 section 16 | {0; 2; 5}; {0; 7; 8}; {1; 3; 6}; {0; 4; 9} | Đúng nhưng chỉ nói về {0; 2; 5}; "lấy trong {3; 6}" không áp được - Nên sửa 23 |
| Tổng các chữ số (hàng trăm trước) | tổng 1, 2, 3, 4 (10 số, khớp 1.13); tổng 5 hàng trăm 3 | Đúng khi hàng trăm từ 1 - Nên sửa 22 |
