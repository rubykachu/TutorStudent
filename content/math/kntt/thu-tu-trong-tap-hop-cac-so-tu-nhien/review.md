# Review: Thứ tự trong tập hợp các số tự nhiên (`thu-tu-trong-tap-hop-cac-so-tu-nhien`)

- Bài: `content/math/kntt/thu-tu-trong-tap-hop-cac-so-tu-nhien/lesson.json`
- Vòng: 4 - chỉ phần đổi (video và lời đọc; `pnpm content:diff`), section: `ben-trai`, `cung-chu-so`, `lien-tiep`; phạm vi: ba video `ben-trai-tren-tia-so`, `so-tung-cap-chu-so`, `lien-truoc-lien-sau`, lời đọc tổng quan `overview.narration`, các khối `video` và `videos[]` (ba video, ba clip, bảy điểm dừng)
- Nguồn đã đọc: không cần (diff chỉ có media; số liệu và quy tắc đối chiếu với `lesson.json`, `catalog.ts`)
- `content:check`: 1 lỗi, 1 cảnh báo của bài. Lỗi là `$.reviewedHash` ([review-hash]: bài đổi sau lần duyệt trước, do ba khối video và lời đọc thêm vào; hết khi chạy `--approve`); cảnh báo là 3 id chưa có trong `ids.lock.json` (ba video mới, `pnpm content:lock` sau khi duyệt). Không có lỗi nội dung. `pnpm video:check` ok cả ba video
- Đọc hiểu (Haiku, lượt 1): 27 / 3 / 0 (ba video: 9/2/0, 10/0/0, 8/1/0; tệp `haiku-output.md` trong thư mục làm việc của điều phối). Ba mục mơ hồ đều chỉ vì tên "Bạn cú" (tên con cú, không phải lỗi), nên không viết lại và không chạy lượt 2
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong cây tạm của điều phối (`.shots/walk/thu-tu-trong-tap-hop-cac-so-tu-nhien/{phone,ipad-landscape}/`); đã đọc sheet ba section: khối video đứng đầu section, poster và nút phát hiện đúng, phụ đề bật tắt và phần còn lại của section không đổi
- Kết luận: Đạt: 0 Nghiêm trọng, 1 Nên sửa và 3 Góp ý ở vòng này, đã xử lý ở mục "Đã xử lý sau vòng 4" (trừ phần nghe âm thanh); còn lại từ vòng 3: 3 Nên sửa, 6 Góp ý.
- Bản đã review: `5a94ac81dd64ce7a192ea41392e448ca2670a03185daaa33f03a07c800a9cf4e` (`pnpm content:diff` so với bản này)

Đã soát ở vòng này (đều đạt, trừ các mục ghi dưới):
- Số liệu tự tính lại: 6 218 và 6 247 (cùng 4 chữ số; hàng nghìn 6 và 6, hàng trăm 2 và 2, hàng chục 1 và 4, 1 < 4 nên 6 218 < 6 247, xe đạp rẻ hơn); trang 24, 25, 26; A ở 3 và B ở 8 (3 < 8, A trước), đổi chỗ A ở 9 và B ở 5 (5 < 9, B trước); số liền sau của 25 là 26, liền trước là 24; số 0 không có số liền trước, liền sau của 0 là 1. Whisper nghe "6 218 nghìn đồng" thành "6.218.000 đồng" (khớp 89,6% và 91,2% trong `report.json`): đúng số, chỉ khác cách viết.
- Màu và ký hiệu khớp khái niệm của bài: điểm biểu diễn và "trang bạn đọc" amber (đúng như hình `trang-25`), số nhỏ hơn blue ●, số lớn hơn violet ▲, liền trước sky ◀, liền sau pink ▶, chip so sánh nhiều chữ số slate. Mọi màu có ký hiệu hình hoặc chữ đi kèm.
- Câu `rule` của cả ba video (8 câu) khớp note hay caption; ngoại lệ chữ cái đã có `say` ("cộng"). Mọi câu không phải `rule` dài tối đa 12 chữ.
- Nhịp (đo trên mp4 trong `public/media/video`): khoảng lặng sau câu `ask` 1,52 đến 1,53 giây (cần ≥ 1,5), sau câu `think` 1,02 đến 1,04 giây (cần ≥ 1); điểm dừng cách ≥ 3 câu (ben-trai: câu 4, 9, 12; so-tung: câu 4, 9; lien-truoc: câu 4, 9); hình giữ nguyên trong quãng lặng (dấu "?" của `ask` còn đến sát câu sau); khung tại các điểm dừng (11,7 s; 32,8 s; 43,7 s; 13,5 s; 30,8 s; 13,3 s; 33,2 s) đều đang hiện kết quả của ý, chưa chuyển cảnh.
- Hình khớp lời ở mốc trong .vtt (kiểm bằng khung ffmpeg ở các giây gần mốc, vì ảnh `renders/frames` lệch khoảng 1 giây so với .vtt); chữ trên màn từ 30px trở lên, không cắt; dải dưới từ y ≈ 540 trống ở cả ba video.
- Lời đọc tổng quan: `overview.vtt` khớp từng chữ `hook`, `summary`, ba `goals` và `whyItMatters`; câu đầu "Chào bạn!" gọi "bạn", cue đầu bắt đầu ở 1,0 giây sau quãng đệm; giọng Gemini Achird và giọng video Hải Đăng cùng là nam; `media.json` không có `narrationOpeningExempt` và `video:check` xác nhận câu mở đầu.
- Clip gắn đúng card: `ben-trai` -> card `ben-trai`; `cung-chu-so` -> card `cung-chu-so`; `lien-truoc` -> card `lien-sau` và `lien-truoc`; cả ba bắt đầu ngay sau điểm dừng đầu và kết thúc trước cảnh kết.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu kết của `ben-trai-tren-tia-so` nêu quy tắc bằng lời rút gọn, không có cờ `rule`, và nói "số" thay cho "điểm biểu diễn số"

- Vị trí: `video/projects/thu-tu-trong-tap-hop-cac-so-tu-nhien/ben-trai-tren-tia-so/script.json` `$.scenes[2].sentences[3]` ("Số nhỏ hơn luôn đứng bên trái.", câu cuối, 44,2 đến 46,4 s trong .vtt); card `ben-trai`. LL-05, LL-11.
- Nguồn: tr.11 kiến thức cần nhớ 2, `sbt-p11.png`
- Vấn đề: Đây là câu tóm tắt quy tắc nhưng không chép nguyên văn note (note: "điểm biểu diễn số nhỏ hơn luôn đứng bên trái điểm biểu diễn số lớn hơn") và không có `"rule": true`, nên `video:build` không kiểm nó. Nội dung không sai (trùng tên section "Số nhỏ hơn nằm bên trái"), nhưng bé nghe cuối cùng là "số ... đứng bên trái", còn card, recap và hai câu `rule` trước đó nói "điểm biểu diễn": một quy tắc hai cách nói (LL-05). Vì câu đứng cuối nên bé mang câu này đi.
- Sửa: Nếu dựng lại video theo quyết định của chủ dự án: đổi thành "Nhớ nhé: điểm của số nhỏ hơn luôn đứng bên trái." (câu dẫn, không phải quy tắc nguyên văn), hoặc chép nguyên câu thứ hai của note và đánh `rule`. Không dựng lại chỉ vì mục này nếu chủ dự án không muốn đổi video đã dựng.

## Góp ý

### 2. Hai chỗ Whisper nghe khác chữ cần nghe lại bằng tai (chưa kiểm được vì chưa nghe âm thanh)

- Vị trí: `lien-truoc-lien-sau` câu 7 "Số liền trước của số a + 1 là số a." (`say`: "...a cộng 1 là số a"), `renders/report.json`: nghe "Số A tộng 1 là số A", khớp 0,974 (lần 1 duy nhất); `ben-trai-tren-tia-so` câu 3 "Bạn cú đặt điểm A ở số 3.", nghe "Bạn cú đắt điểm A" (2 lần thử). LL-11.
- Nguồn: —
- Vấn đề: Điểm khớp vượt ngưỡng nên build cho qua, nhưng nếu giọng thật sự nuốt "cộng" thành "tộng" thì bé nghe sai đúng câu quy tắc "liền trước"; "đắt" thay "đặt" đổi nghĩa câu. Tôi chưa nghe được giọng nên không kết luận.
- Sửa: Chủ dự án nghe hai câu này một lần; nếu sai thì chọn take khác hoặc đổi `say` rồi dựng lại câu đó (cần chủ dự án đồng ý, vì đổi giọng đọc).

### 3. Poster của hai video hiện sẵn đáp án trước khi bé bấm phát

- Vị trí: `public/media/video/thu-tu-trong-tap-hop-cac-so-tu-nhien/ben-trai-tren-tia-so.jpg` (đã hiện mũi tên "bên trái", nhãn "Số nhỏ hơn", "Số lớn hơn"), `lien-truoc-lien-sau.jpg` (đã hiện 24 "lùi 1" và 26); `script.json` `poster.scene` = `s02-ben-trai`, `s02-lien-tiep`, `at: 0.95`. LL-02.
- Nguồn: —
- Vấn đề: Video nhắc "bạn thử đoán" nhưng poster nằm trên đầu section đã lộ đáp án; bé chậm nhìn thấy trước khi nghe câu hỏi. Poster của `so-tung-cap-chu-so` chỉ lộ cặp 1 và 4, nhẹ hơn.
- Sửa: Chọn `poster.at` sớm hơn (cảnh đang hỏi, chưa lộ kết quả), hoặc cảnh đầu (tia số có điểm A, B; ba trang sách). Là chọn của chủ dự án vì phải xuất lại poster.

### 4. Điểm dừng cuối của `ben-trai-tren-tia-so` chỉ cách câu kết một câu

- Vị trí: `ben-trai-tren-tia-so` `checkpoints[2]` (`cp-03`, `at: 43,685`; câu "Số 5 nhỏ hơn số 9, nên điểm B đứng trước."), `$.scenes[2].sentences[2]`.
- Nguồn: —
- Vấn đề: Luật cấm điểm dừng ở câu cuối video, nên điểm dừng đứng trước câu kết 2 giây: bé bấm "Xem tiếp" chỉ để nghe một câu ngắn. Cách ≥ 3 câu với điểm trước (câu 9) vẫn đạt, nên không vi phạm luật.
- Sửa: Bỏ `cp-03` (còn hai điểm dừng, mỗi điểm cách nhau 5 câu) khi chủ dự án dựng lại video; hoặc giữ nếu muốn bé chốt "B đứng trước" rồi mới nghe kết luận.

## Đã xử lý sau vòng 4

- Nên sửa 1: câu kết `ben-trai-tren-tia-so` đổi thành "Nhớ nhé: điểm của số nhỏ hơn luôn đứng bên trái." (chỉ câu đó đọc lại, Whisper khớp 100%).
- Góp ý 3: poster `ben-trai-tren-tia-so` lấy ở cuối cảnh tia số (hai điểm A, B chưa tô màu), `lien-truoc-lien-sau` và `so-tung-cap-chu-so` lấy đầu cảnh hỏi (ô "?"): poster không còn lộ đáp án.
- Góp ý 4: bỏ điểm dừng cuối của `ben-trai-tren-tia-so`; còn hai điểm dừng.
- Góp ý 2 (chưa kiểm được vì chưa nghe âm thanh): người thật nghe lại "Số liền trước của số a cộng 1 là số a" (`lien-truoc-lien-sau`, Whisper nghe "A tộng 1", khớp 0,974) và "Bạn cú đặt điểm A ở số 3" (`ben-trai-tren-tia-so`, Whisper nghe "đắt"). Nếu sai thì sửa `say` hoặc dựng lại đúng câu đó.

## Còn lại từ vòng 3

Tên viết tắt dưới đây: id đầy đủ có tiền tố `thu-tu-trong-tap-hop-cac-so-tu-nhien.` (vd `ex.kt-dem-vach-c-5`). Hình ghi theo khoá trong `src/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/catalog.ts`.

Đối chiếu vòng 2 (40 mục): mục 1 đến 32, 34, 36, 38, 39 đã sửa đúng (36 mục). Mục 35 và 37 sửa một phần, phần còn lại thành Góp ý 6 và 8. Mục 33 và 40 cố ý không sửa, giữ thành Góp ý 4 và 5. Bản sửa sinh một vấn đề mới (LL-20), ghi ở mục 1. Tôi tự giải mọi câu đã thêm hoặc đổi trước khi đọc `answer` (`kt-dem-vach-c-5` = 5, `doc-q-35` = 35, `kt-doc-vach-5` = 40, `dat-diem-5-45` = 45, `cham-diem-55` = điểm B, `chon-nhieu-xa-15` = K và N, `kt-xep-16-7-11` = 7, 11, 16, `xep-minh-tu-long` = Long, Tú, Minh, `chon-nhieu-doan-4-10` = 4 và 9, `liet-ke-5-9`, ba câu đếm `7 - 3 + 1`, `9 - 6 + 1`, `6 - 0 + 1`): đáp án khớp, không nhiễu nào thành đáp án đúng thứ hai. Recap section lặp đúng nguyên văn câu quy tắc ở cả 14 section, recap card chỉ giữ nguyên câu của quy tắc (card `diem-bieu-dien`, `tap-hop-doan` bỏ câu mà câu kho ôn của card không dùng).

## Mẹo đã đổi: các số đã thử

| Mẹo | Các số đã thử | Kết quả |
|---|---|---|
| `tip.dem-tu-goc-o` (mỗi bước 1 đơn vị) | điểm ở 0, 1, 3, 7, 10 | số bước = số của điểm, đúng; đứng ở gốc là 0 bước |
| `tip.doc-dau` (đầu nhọn chỉ về số nhỏ hơn) | 0 < 1, 3 < 8, 99 < 100, 9 > 4, 140 > 135 | đúng cả `<` lẫn `>` |
| `tip.doi-loi-thanh-dau` | "tối đa" 0, 1, 8, 9, 100 (thử N−1, N, N+1); "từ ... trở lên" 0, 1, 10, 99, 100 (thử M−1, M, M+1) | `n ≤ N` và `t ≥ M` đúng ở mọi số, kể cả biên 0 và đúng số đề cho |
| `tip.so-cung-chu-so` | 3 658 và 3 706; 90 và 89; 100 và 101; 5 000 và 4 999; 12 345 và 12 354; khác số chữ số: 0 và 10, 999 và 1 000 | luôn đúng; so từ phải sai ở 90 và 89, 3 658 và 3 706 |
| `tip.lien-sau-tan-cung-9` | 9, 19, 89, 99, 199, 909, 1 999 | 10, 20, 90, 100, 200, 910, 2 000, đúng |
| `tip.dem-so-hay-do-khoang` | (a, b) = (0, 0), (3, 3), (11, 16), (0, 10), (10, 99) | đếm = b − a + 1: 1, 1, 6, 11, 90; khoảng cách = b − a: 0, 0, 5, 10, 89, đúng khi đếm kể cả hai đầu (xem mục 3) |

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu quy tắc `phan-tia-so` đổi chủ ngữ thành "Số x nằm trên đoạn OA", lệch với "điểm biểu diễn số x" và với "thuộc"

- Vị trí: `$.sections[11].blocks[1].children[0].text` (note `rule`), `$.sections[11].recap.caption`, `$.cards[14].recap.caption` (`card.phan-tia-so`). LL-20, LL-05.
- Nguồn: tr.11 ví dụ b, `sbt-p11.png`; tr.12 lời giải b, `sbt-p12.png`
- Vấn đề: Bản sửa mục 39 vòng 2 viết "Số x nằm trên đoạn OA khi x ≤ a, trên đoạn AB khi a ≤ x ≤ b, và ở phần còn lại khi x > b." Bản trước nói "điểm biểu diễn số x". Giờ quy tắc nói số nằm trên đoạn, còn các đề hỏi "Điểm biểu diễn số 11 nằm ở phần nào?", lời giải dùng "thuộc đoạn AB", màn `chon-doan-ab-6-12` hỏi "điểm biểu diễn thuộc đoạn AB". Một ý mà ba cách nói ("nằm trên", "ở phần", "thuộc"), và quy tắc gọi số là vật nằm trên đoạn. Haiku lượt 2 vẫn gán Hiểu mơ hồ cho cả ba chỗ vì kí hiệu ≤, > (bé chưa quen; `dau-bang` đã dạy ≤ trước đó và hình `ba-phan-rows` ngay dưới ghi từng trường hợp), không chặn.
- Sửa: Viết lại, giữ nguyên văn ở note, recap section, recap card: "Điểm biểu diễn số x thuộc đoạn OA khi x ≤ a, thuộc đoạn AB khi a ≤ x ≤ b, và thuộc phần còn lại khi x > b." Recap vẫn gồm hai câu nên không vượt luật `[recap]`.

### 2. Lượt đọc hiểu chưa phủ 49 câu kho ôn chỉ gắn card; sáu đề kho ôn còn nguyên câu mà lượt 1 gán "Khó hiểu"

- Vị trí: `$.exercises[73]` (`ex.liet-ke-5-9`), `[74]` (`ex.liet-ke-7-10`), `[76]` (`ex.liet-ke-nho-hon-5-n`), `[77]` (`ex.liet-ke-nho-hon-5-nsao`): prompt "Liệt kê các phần tử của tập hợp sau."; `[80]` (`ex.dem-phan-tu-6-9`), `[81]` (`ex.dem-nho-bang-6-n`): prompt "Tập hợp sau có bao nhiêu phần tử?". LL-25.
- Nguồn: —
- Vấn đề: Tệp `doc-hieu.md` chỉ có 34 câu của `checkIds`, `practiceIds`; 49 câu kho ôn (bé gặp khi ôn card) chưa được đọc. Hai câu của lượt 1 ("Liệt kê các phần tử của tập hợp sau.", "Tập hợp sau có bao nhiêu phần tử?") được gán Khó hiểu "từ lạ" và đã viết lại ở bốn câu (`kt-liet-ke-4-8`, `liet-ke-2-6`, `kt-dem-2-5`, `dem-phan-tu-3-7`), nhưng sáu câu kho ôn giống hệt vẫn giữ chữ cũ. Bảy câu kho ôn thêm mới ở vòng này (`dat-diem-10`, `cach-goc-2`, `dat-diem-5-45`, `cham-diem-55`, `chon-nhieu-xa-15`, `xep-minh-tu-long`, `chon-nhieu-doan-4-10`) cũng chưa ai đọc hiểu.
- Sửa: Đổi sáu prompt thành "Liệt kê (viết ra) tất cả các phần tử của tập hợp sau." và "Tập hợp sau có bao nhiêu phần tử (bao nhiêu số)?". Chạy một lượt Haiku trên các câu kho ôn đổi hay thêm (chữ do tác giả nhập, ngắn) trước lần sửa tiếp theo.

### 3. Mẹo `dem-so-hay-do-khoang` không nói "kể cả hai đầu", và chưa nói a, b là gì

- Vị trí: `$.sections[13].blocks[2].text` (`tip.dem-so-hay-do-khoang`). LL-24, LL-25.
- Nguồn: tr.11 ví dụ c, `sbt-p11.png`
- Vấn đề: Mẹo viết "Lấy b trừ a rồi cộng 1 để đếm xem có bao nhiêu số." Dùng cho tập có đầu mở như `2 < x < 8` (hoặc `7 ≤ x < 10` vừa học ở section trước) thì ra 7 (đúng là 5) và 4 (đúng là 3). Điều kiện "kể cả a và b" chỉ nằm ở câu quy tắc màn trước. Mọi câu của bài đều kể cả hai đầu, và quy tắc màn trước có điều kiện, nên giữ mức Nên sửa. Haiku lượt 2 gán Hiểu mơ hồ vì a, b chưa được nói là gì ngay trong mẹo.
- Sửa: "Muốn đếm các số từ a đến b, kể cả a và b, hãy lấy b trừ a rồi cộng 1. Còn muốn biết hai điểm cách nhau mấy đơn vị thì chỉ lấy b trừ a, không cộng 1."

## Góp ý

### 4. Dấu hình của màu ở nhãn hình vẫn đứng sát chữ, đọc được thành dấu phép tính (giữ từ vòng 2, cố ý chưa sửa)

- Vị trí: hình `lien-tiep-rows` ("✚ Số liền trước của a + 1"), hình `bang-xong` ("▬ Hai số bằng nhau"). LL-21.
- Nguồn: —
- Vấn đề: Dấu thập đọc thành "a cộng…", dấu thanh đọc thành "trừ"; dấu nằm trong khung nhãn nên ít nhầm hơn vòng 1 (ảnh `phone/141-s10-02-block.png`, `phone/088-s6-01-block.png`).
- Sửa: Báo người làm app đặt dấu hình ở góc khung hay đổi kiểu dấu.

### 5. Khái niệm "So sánh số có nhiều chữ số" mang màu slate, cũng là màu trung tính của nhãn thường (giữ từ vòng 2, cố ý chưa sửa)

- Vị trí: `$.concepts[7]` (`concept.so-sanh-so-nhieu-chu-so`, `color: "slate"`). LL-05.
- Nguồn: —
- Vấn đề: `docs/design-system.md` ghi slate là màu phụ, trung tính; bài đã dùng đủ tám màu khái niệm.
- Sửa: Bỏ khái niệm này (card `so-chu-so`, `cung-chu-so` dùng `so-nho-hon`, `so-lon-hon`), hoặc ghi vào `docs/design-system.md` khi nào slate là màu khái niệm.

### 6. Dấu kép trong câu quy tắc `phan-tia-so` còn bị ngắt dòng trên điện thoại

- Vị trí: `$.sections[11].blocks[1].children[0].text`, `$.sections[11].recap.caption`, `$.cards[14].recap.caption`. LL-12.
- Nguồn: —
- Vấn đề: Mục 37 vòng 2: dấu cách không ngắt đã thêm ở nhiều note, nhưng ảnh `phone/166-s12-02-block.png` vẫn ngắt "a ≤ x ≤" ở cuối dòng và "b" xuống dòng sau. Bố cục, không sai nội dung.
- Sửa: Khi sửa mục 1, đặt dấu cách không ngắt quanh ≤ và > trong cả ba chỗ (ba chỗ phải giống nhau từng chữ).

### 7. Tên section nói "cắt", màn đầu nói "chia"

- Vị trí: `$.sections[11].title` ("Hai điểm cắt tia số thành ba phần"); `$.sections[11].blocks[0].children[1].text` ("A và B chia tia số thành ba phần"). LL-05.
- Nguồn: tr.11 ví dụ b, `sbt-p11.png`
- Vấn đề: Một việc hai động từ. Haiku lượt 1 gán "cắt" mơ hồ nên tác giả đổi câu sang "chia", chưa đổi tên section. Câu đầu mới đã khác sách (thêm "từ O tới A", "sau B"), cụm "chia tia số thành" là cách nói toán chuẩn, nên không tính là chép (mục 1 vòng 2 coi như đã sửa).
- Sửa: Đổi tên section thành "Hai điểm chia tia số thành ba phần".

### 8. Chưa nói điểm A thuộc cả đoạn OA lẫn đoạn AB (giữ từ mục 35 vòng 2)

- Vị trí: `$.sections[11].blocks[1].children[1].text`; hình `ba-phan-rows` (dòng `x ≤ a` và dòng `a ≤ x ≤ b`).
- Nguồn: tr.12 lời giải c, `sbt-p12.png`
- Vấn đề: Note mới nói "kể cả a và b" cho đoạn AB, nhưng "chia thành ba phần" vẫn gợi mỗi số chỉ thuộc một phần; số bằng a thuộc cả hai dòng. Chưa câu nào hỏi số bằng a.
- Sửa: Thêm vào note: "Số bằng a thuộc cả đoạn OA lẫn đoạn AB."

### 9. Đáp án 45 của `dat-diem-5-45` trùng đáp án thứ ba của bài 1.23

- Vị trí: `$.exercises[8]` (`ex.dat-diem-5-45`, `params.p0: 45`); điểm C ở 45 trong hình `cham-diem-55`. LL-08.
- Nguồn: tr.96 lời giải 1.23 (E, F, G biểu diễn 20; 35 và 45), `sbt-p96.png`
- Vấn đề: Ba số của sách đã nằm ở màn mẫu (K = 20), câu luyện (Q = 35) và giờ câu ôn (45), trên cùng kiểu tia số ghi hai số 0 và 10. Chỉ là số, không chép chữ, nên là Góp ý; nhưng số của bài nên tự chọn.
- Sửa: Đổi 45 sang số khác của tia số 0 đến 50, vd 15 (đổi id, `params`, `explain`: "bấm ba lần"), và đổi điểm C của `cham-diem-55` khỏi 45. Tia số này chỉ còn ít số chưa dùng, nên có thể giữ nếu tác giả muốn.
