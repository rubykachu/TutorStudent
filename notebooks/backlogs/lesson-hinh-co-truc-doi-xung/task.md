# Bàn giao: Bài 21 `hinh-co-truc-doi-xung` (Hình có trục đối xứng)

Bài 21 của sách bài tập (SBT tr.78–83), bài đầu của Chương V "Tính đối xứng của hình phẳng trong tự nhiên". Bài chưa tách: 78 phút các phần, trong mức 60 đến 80 phút (xem "Nếu cần tách" ở cuối).

## Trạng thái

- Cập nhật cuối: 06/10/2026 (commit bài và hình `bebf8d4`). Bài là **bản nháp sẵn sàng review vòng 1**: `status: draft`, chưa có `reviewedHash`, chưa khoá id, chưa có lời đọc giới thiệu (`overview.narration`) và chưa có video. Tác giả (Sonnet) không review, không duyệt, không đọc lời, không làm video.
- Gồm 11 section dạy, section bài tập sách bài tập (SBT 5.1 đến 5.10: 16 câu sách, 18 câu dẫn), 11 thẻ, 90 câu (34 câu ở các section dạy và câu luyện, 22 câu kho ôn, 34 câu của section sách), 4 mẹo, 78 phút (4 + 10 × 5 + 24).
- `pnpm content:check --stats`: 0 lỗi, mọi tiêu chí `PASS`, 16 `bookRef` (SBT 5.1, 5.2, 5.3a, 5.3b, 5.4, 5.5, 5.6a, 5.6b, 5.6c, 5.7, 5.8a, 5.8b, 5.9a, 5.9b, 5.9c, 5.10), 5 dạng câu (đúng mức tối thiểu: `choice` 34, `manipulate` 25, `numeric` 22, `tapRegion` 5, `match` 3, `order` 1), 35 hình tương tác.
- Đọc hiểu (Haiku) lượt 1 trên toàn bài: 215 Hiểu rõ / 1 Hiểu mơ hồ / 0 Khó hiểu; mục mơ hồ là câu của mẹo `cheo-khong-phai-truc` ("ngược lại"), đã viết lại. Tệp ở `.shots/review/hinh-co-truc-doi-xung/doc-hieu.md` (ngoài git). Chữ của bài còn có thể đổi sau review, nên sau các vòng đầy đủ phải chạy lại lượt Haiku chỉ trên mục chữ đổi (`pnpm content:diff`), theo skill `lesson-review`, mục "Đọc hiểu".

## Việc tiếp theo (phiên mới)

1. **Review vòng 1, toàn bài**: ba Reviewer Opus mở song song, rồi một Tổng hợp Opus (skill `lesson-review`, mục "Vòng toàn bài"). Chia nhóm đề xuất:
   - Nhóm 1: section 1 đến 5 (`quanh-ta`, `truc-doi-xung`, `chu-nhat-thoi`, `thang-can-binh-hanh`, `hinh-deu`) cùng thẻ, câu kiểm tra, câu luyện, câu ôn của chúng.
   - Nhóm 2: section 6 đến 11 (`chu-cai-chu-so`, `do-vat-bieu-tuong`, `diem-doi-xung`, `ve-them-hinh`, `truc-cheo`, `gap-giay`) cùng thẻ và câu của chúng.
   - Nhóm 3: section `bai-tap-sach-bai-tap`, một nhóm riêng: mở ảnh `sources/math/hinh-co-truc-doi-xung/sbt-p80.png` đến `sbt-p83.png` và `sbt-p118.png`, `sbt-p119.png`; làm đủ ba việc với câu sách (đủ bài tập, đề y hệt sách, đáp án khớp lời giải) và soát 18 câu dẫn.
2. Sửa Nghiêm trọng và Nên sửa, vòng sau chỉ phần đổi (Sonnet từ vòng 3). Lượt đọc hiểu Haiku chỉ trên chữ đổi trước `pnpm content:hash hinh-co-truc-doi-xung --approve`; sau đó `pnpm content:lock hinh-co-truc-doi-xung` (không chạy lệnh khoá không kèm id bài).
3. Sau khi duyệt (đã có chủ dự án đồng ý cho từng bước ngoài máy): lời đọc giới thiệu và ba video, rồi `pnpm media:upload` và `pnpm deploy:prod` chỉ khi chủ dự án yêu cầu.

## Lời đọc và video (làm sau khi duyệt, ghi trước để khỏi quên)

- **Video phải dùng engine giọng OmniVoice mới** (một agent khác đang tích hợp vào `video/`; đọc skill `lesson-video` bản mới nhất và `video/tts/` trước khi làm, không dùng VieNeu). Không dựng video khi pipeline đó chưa xong.
- **Lời đọc giới thiệu (`pnpm narration:build hinh-co-truc-doi-xung`) dùng Gemini**, giọng cùng giới tính với giọng video của bài; câu đầu của `overview.hook` đã là câu chào có chữ "bạn".
- Giọng đề xuất: Hải Đăng cho video (xen kẽ với Bài 20 dùng Mỹ Duyên) và Gemini Achird cho lời đọc; chủ dự án chốt.
- Ba video đề xuất: `gap-doi-hinh` (section `truc-doi-xung`: gấp hình theo trục, hai nửa chồng khít), `dem-o-tim-diem` (section `ve-them-hinh`: đếm ô từ điểm tới trục rồi đặt điểm đối xứng), `gap-giay-cat-hinh` (section `gap-giay`). Số liệu của video khác số của câu luyện và câu sách.

## Nguồn (sách bài tập, `sources/math/hinh-co-truc-doi-xung/`, không commit)

- Trang in = trang PDF − 1. Đề: tr.78 (PDF 79) đến tr.83 (PDF 84); tr.78 có "Kiến thức cần nhớ", hình 5.1, "Kĩ năng giải toán" và ví dụ 1; tr.79 hình 5.2 đến 5.4 (ví dụ 1 tiếp, ví dụ 2); tr.80 ví dụ 3, bài 5.1, 5.2; tr.81 bài 5.3, 5.4, 5.5; tr.82 bài 5.6, 5.7, 5.8; tr.83 bài 5.9, 5.10. Lời giải: tr.118 (PDF 119) bài 5.1 đến 5.6, tr.119 (PDF 120) bài 5.7 đến 5.10. Bài 22 bắt đầu ở tr.84 và tr.119 (không nạp, không dùng). Ảnh `sbt-p78.png` đến `sbt-p83.png`, `sbt-p118.png`, `sbt-p119.png` (tên theo trang in).
- Nạp bằng `pdftoppm -r 110 -png -f <trang in + 1> -l <trang in + 1> -singlefile /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf sources/math/hinh-co-truc-doi-xung/sbt-p<trang in>`; đã mở và xem từng trang.
- Nội dung nguồn dùng: định nghĩa hình có trục đối xứng và trục đối xứng; ví dụ 1 (dựng điểm đối xứng bằng đường vuông góc và compa), ví dụ 2 (vẽ thêm cho hình có trục d), ví dụ 3 (gấp giấy hai lần và cắt), bài 5.1 đến 5.10.

## Giả định (chủ dự án không hỏi được, ghi theo yêu cầu)

- Hình của sách vẽ lại bằng hình vẽ của bài (không chép hình sách), giữ đúng loại hình và câu hỏi. Những chỗ vẽ lại khác sách:
  - 5.5: hình thứ nhất là hình năm ô vuông lệch (không trục), hình thứ ba là dải ô vuông bậc thang (hai trục chéo), ngôi sao năm cánh (5 trục), như đáp án sách.
  - 5.6 và 5.8: hình vẽ lại trên lưới thưa (7 cột) để chạm được trên màn nhỏ; số điểm cần đặt ít hơn sách (xem "Bài vẽ và cách chấm").
  - 5.7: ba tờ giấy vẽ lại sao cho nếp gấp là cạnh phải (tờ a: dải xiên, tờ b: nửa chữ M) hoặc cạnh dưới (tờ c: dải cong), mở ra thành chữ V, chữ M và chữ O đúng đáp án sách.
  - 5.3: chữ và chữ số vẽ bằng nét thẳng, bề rộng 10 và cao 16 đơn vị: A, B, M, Y, 3 một trục; H, X, 0, 8 hai trục; N, Z, 2, 9 không trục.
  - 5.4: ba biểu tượng vẽ đơn giản (Hòa bình có trục thẳng đứng, dấu cộng Hội Chữ thập đỏ có 4 trục, biểu tượng ngành Y Dược có con rắn nên không trục).
- Các điều không in thành câu trên trang đã nạp nhưng cần để làm bài (Reviewer xét theo luật "Không có trong sách"; đề xuất của người soạn: giữ, vì suy ra trực tiếp từ định nghĩa tr.78 và bài 5.1 đến 5.10):
  1. Điểm nằm trên trục đối xứng thì điểm đối xứng của nó là chính nó (suy ra từ "cách trục 0 ô"); dùng ở các câu `s8-on-diem-tren-truc`, `s9-on-diem-tren-truc`, `s10-on-diem-tren-truc` và ở 5.6, 5.8 (đỉnh nằm trên d giữ nguyên).
  2. Cách tìm điểm đối xứng trên lưới ô vuông: trục thẳng đứng hay nằm ngang thì đếm số ô tới trục rồi đếm số ô bằng vậy ở bên kia; trục nằm nghiêng (đường chéo của ô vuông) thì đi ngang tới trục rồi đi dọc cùng số ô sang bên kia. Sách không nói bằng lời mà dựng bằng êke và compa (ví dụ 1) và vẽ trên lưới (ví dụ 2, bài 5.6, 5.8); section `diem-doi-xung` vẫn dạy cách dựng của sách, hai cách cho cùng kết quả.
  3. Số trục của hình đều n cạnh là n (mẹo `dem-truc-hinh-deu`); sách cho tam giác đều 3, vuông 4, lục giác đều 6, tròn vô số, ngôi sao năm cánh 5 (5.5).
  4. Hình bình hành "lệch" (không phải hình chữ nhật hay hình thoi) không có trục: nói ở section `thang-can-binh-hanh` bằng "hình bình hành lệch như trong hình"; mọi câu hỏi về hình bình hành đều có hình, không có câu chữ chung chung "hình bình hành không có trục".
  5. Số lớp giấy khi gấp đôi n lần (câu `s11-so-lo-*`, mẹo `gap-hai-lan`): suy ra từ ví dụ 3.
- Màu khái niệm: Trục đối xứng pink, Điểm đối xứng teal, Đường chéo amber (đã thêm hai từ "trục đối xứng", "điểm đối xứng" vào `content/glossary/math.json`). Trục đối xứng luôn vẽ nét đứt hồng, điểm đối xứng và phần vẽ thêm màu xanh ngọc; nửa đứng yên của hình gấp màu xanh da trời, nửa lật màu tím (hai màu này chỉ để so hai nửa, không phải khái niệm của bài).
- Số trong bài nhỏ; đơn vị nằm trong đề. Số của các tầng tách nhau: màn dạy (nhà, cổng đền, hình đều, dấu cộng, điểm A B cách trục 2 và 3 ô), câu kiểm tra, câu luyện, kho ôn và câu dẫn dùng hình và số khác nhau; hình lời giải nấc 3 vẽ đúng số của đề, hình gợi ý nấc 2 chỉ đếm ô trên một ví dụ khác (`diem-dem-o`, `cheo-dem-o`) hoặc gấp một hình khác (`truc-nha-cac-buoc`).
- Lời "gấp", không dùng "gập", như sách ("gấp giấy", "gấp lại").

## Cấu trúc bài (11 section dạy, mỗi section một ý và một thẻ cùng tên, rồi section sách)

1. `quanh-ta` Hình đối xứng quanh ta: cánh bướm, chiếc lá, cổng đền, ngôi nhà; "cùng làm" chạm thẻ để gấp đôi (bình hành là thẻ gấp không khít).
2. `truc-doi-xung` Trục đối xứng: hình ngôi nhà gấp từng bước; câu quy tắc (`rule`) "Gấp hình theo đường thẳng d, nếu hai nửa chồng khít nhau thì d là trục đối xứng."; gấp thử bốn đường a, b, c, d.
3. `chu-nhat-thoi` Hình chữ nhật và hình thoi: gấp thử hai hình; mẹo "tránh sai" đường chéo có là trục không.
4. `thang-can-binh-hanh` Hình thang cân (1 trục) và hình bình hành lệch (không trục).
5. `hinh-deu` Hình đều có nhiều trục: thẻ tam giác đều, vuông, lục giác đều, tròn; mẹo "làm nhanh" đếm trục hình đều; chọn trục của tam giác đều.
6. `chu-cai-chu-so` Chữ cái và chữ số: trục thẳng đứng hay nằm ngang (A, B, H, N).
7. `do-vat-bieu-tuong` Đồ vật và biểu tượng: cổng đền, Hòa bình, dấu cộng, con rắn; bảng 0, 1, 2, 4, 6, vô số trục.
8. `diem-doi-xung` Điểm đối xứng qua trục: dựng bằng thước và compa (ví dụ 1), đếm ô, đặt A′ và B′.
9. `ve-them-hinh` Vẽ thêm để hình có trục d (ví dụ 2): nửa dấu cộng; mẹo "làm nhanh" đếm ô từ trục.
10. `truc-cheo` Trục nằm nghiêng (bài 5.8): đi ngang tới trục rồi đi dọc.
11. `gap-giay` Gấp giấy và cắt hình (ví dụ 3, bài 5.7): gấp hai lần cắt góc thành số 0; mẹo "hiểu nhanh" gấp hai lần hai trục.
12. `bai-tap-sach-bai-tap` (cuối bài, `bookPractice`): 16 câu sách, 18 câu dẫn, 4 khối "Nhắc lại".

- Mỗi section dạy: 2 đến 4 màn (hình chạy từng bước, màn quy tắc, màn "cùng làm"), 2 câu kiểm tra, 1 câu luyện, 2 câu ôn của thẻ. Section 8 có thêm câu `order` (xếp các bước dựng).
- Mỗi section có tình huống đời sống: cánh bướm, lá cây, cổng đền, ngôi nhà, cánh cửa, con diều, thang chữ A, gạch lát nghiêng, tổ ong, biển hiệu, số nhà, tờ giấy gấp cắt.
- Câu chọn nhiều đáp án: 9 câu `choice` với `multiple: true`.

## Hình (`src/visuals/math/hinh-co-truc-doi-xung/`)

- Dữ liệu thuần (không React): `geometry.ts` (đối xứng điểm qua đường thẳng, kiểm "đường này là trục của hình" bằng cách gấp số học, tâm hình, đường cong mượt), `shapes.ts` (17 hình: mỗi hình có nét vẽ, danh sách trục, danh sách đường trông giống trục mà không phải), `glyphs.ts` (chữ và chữ số), `paper.ts` (tờ giấy gấp và cắt), `lattice.ts` (đối xứng trên lưới, hình ghép từ đoạn lưới và số trục của nó), `mirror-model.ts`, `edges.ts` (bài vẽ đường gấp khúc và lời giải), `lines.ts` (đường a, b, c của một hình và trạng thái khi chọn), `boards.ts` (các bảng lưới), `visuals.ts` (danh mục: một mục một hình, khoá là phần cuối của id), `catalog.ts` (kiểu), `logic.ts` (hàm chấm, hàm giải, vùng chạm).
- Thành phần React: `draw.tsx`, `fold-view.tsx` (gấp một hình theo trục, hai nửa hai màu), `fold-lab.tsx` ("gấp thử" và "chọn trục"), `fold-player.tsx` (hình chạy từng bước: gấp, mở giấy, gấp hai lần), `cards.tsx` (thẻ chạm để gấp, thẻ chạm để xem trục), `figures.tsx` (hình tĩnh, dải hình chạm vùng, hình có đường a, b, c), `gallery.tsx` (hàng hình, tờ giấy, số ghép từ thẻ, thẻ số), `mirror-board.tsx`, `edge-board.tsx`, `line-badge.tsx`, `layout.ts`, `sticker.tsx`, `examples.tsx`; đăng ký ở `src/visuals/registry.ts` (một khối `symmetryEntries`).
- Test: `tests/visuals/hinh-co-truc-doi-xung.test.tsx` (61 test): từng hình và chữ có đúng các trục khai báo (quét từng độ, tính số học), danh mục khớp đúng tập hình `lesson.json` dùng, mọi bảng đặt điểm đối xứng trong lưới, mọi câu `manipulate` có hàm giải mà hàm chấm nhận và thiếu một mảnh thì không nhận, đáp án sách 5.3 khớp trục chữ, bốn mẹo (xem dưới), 5.10 có đúng mười số, các hình chạm được.
- Hình gợi ý nấc 2 không lộ kết quả của đề (đếm ô trên ví dụ khác, gấp ngôi nhà), hình lời giải nấc 3 vẽ đúng đáp án của đề.

## Bài vẽ và cách chấm (yêu cầu của chủ dự án: bài "vẽ" thành dạng chấm được, giữ lời sách)

- 5.2 và 5.5 ("vẽ tất cả các trục đối xứng"): mỗi hình có vài đường a, b, c… cho sẵn (các trục và vài đường trông giống trục như đường chéo của hình chữ nhật, đường lệch giữa); bé chạm vào các đường là trục; chấm khi đúng đủ tập trục của cả bốn (hay ba) hình. Không vẽ tay đường thẳng.
- 5.6a, 5.6b, 5.6c, 5.8a, 5.8b ("vẽ thêm"): bảng lưới, bé chạm các điểm đối xứng của từng đỉnh (đỉnh trên trục giữ nguyên); chấm khi tập điểm chạm đúng bằng tập điểm đối xứng cần có; các đoạn nối tự hiện khi hai đầu đã đặt đúng trên màn bài học, còn trong câu bài tập thì chỉ hiện khi đã chấm hoặc xem đáp án. Sách in ba hình ở 5.6 và hai hình ở 5.8 trong một bài; app tách mỗi hình thành một câu `bookRef` có chữ a, b, c (trái sang phải ở 5.6; hình dưới trục rồi hình trên trục ở 5.8). Các chữ này là của app, không phải của sách.
- 5.9a, 5.9b, 5.9c: bảng lưới, bé bật các đoạn đơn vị của lưới thành một đường gấp khúc có độ dài đề cho; chấm khi các đoạn bật liền thành một chuỗi, đủ độ dài, và hình gồm đường cho sẵn cộng đường vừa vẽ có đúng số trục đề cho (số trục tính bằng chương trình, nên nhận mọi cách vẽ đúng, kể cả đường vẽ rời đường cho sẵn). Có lời giải cho cả ba ý (a: 1 trục, b: 2 trục, c: 4 trục).
- 5.7: nối ba tờ giấy với chữ V, M, O (có thêm chữ N, U làm nhiễu). Việc cắt giấy thật không chấm được.
- 5.10: đề gồm hai câu; app chấm câu cuối (số cách ghép là 10); câu "ghép ba tấm thẻ" không chấm riêng được, nên hai câu dẫn dạy cách xếp (ba thẻ 1, 8, 0 ghép được 4 số; thẻ 2 và 5 hai bên một thẻ). Ghi cho Reviewer: **5.10 chỉ chấm một phần**.
- 5.1, 5.3a, 5.3b, 5.4: nối, chạm chữ, chọn đáp án; chấm trọn vẹn.
- Giới hạn: máy không đo được nét vẽ tay hay việc cắt giấy; ở 5.2 và 5.5 bé chọn trong các đường cho sẵn.

## Mẹo (bốn khối `tip`; đã thử bằng test, `tests/visuals/hinh-co-truc-doi-xung.test.tsx`)

- `cheo-khong-phai-truc` (tránh sai, section 3): hình chữ nhật có hai cạnh dài ngắn khác nhau thì đường chéo không phải trục; hình thoi thì hai đường chéo là trục. Đã thử hình chữ nhật 160 × 90, 120 × 100, 150 × 20, 100 × 99 (đường chéo không phải trục) và hình thoi nửa đường chéo 90 và 52, 80 và 80 (hình vuông), 100 và 30, 60 và 59 (cả hai đường chéo là trục). Điều kiện "dài ngắn khác nhau" nằm trong câu mẹo.
- `dem-truc-hinh-deu` (làm nhanh, section 5): hình có các cạnh và góc bằng nhau, n cạnh thì n trục. Đã thử n = 3, 4, 5, 6, 8, 10, 12 (đếm trục bằng cách gấp số học, quét nửa độ).
- `dem-o-tu-truc` (làm nhanh, section 9): trục thẳng đứng thì đếm số ô tới d rồi đếm số ô bằng vậy ở bên kia, trên cùng hàng. Đã thử khoảng cách 0, 1, 2, 3, 5 ô với trục đứng và ngang (khoảng cách 0 ra điểm trên trục).
- `gap-hai-lan` (hiểu nhanh, section 11): gấp hai lần theo hai nếp vuông góc rồi cắt, khi mở ra có ít nhất hai trục là hai nếp gấp. Đã thử năm hình cắt (hình chữ nhật ở góc, tam giác sát nếp, hình bốn cạnh chạm nếp, hình sát tâm, hình vuông nhỏ).

## Kiểm đã chạy (06/10/2026)

- `pnpm content:check --stats`: 0 lỗi; `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` đã chạy.
- `pnpm visual:shot` và `pnpm lesson:walk` chạy trong git worktree tạm cổng 3910 (đã gỡ bằng `git worktree remove --force`). `visual:shot` đã sửa mọi lỗi tràn khung của lượt đầu (thẻ gọn hơn, hình bảng co theo chiều cao, nhãn đường kẹp trong khung, trục 5.9 cắt theo lưới) nhưng **chưa chạy lại lần cuối sau các sửa đó**. `lesson:walk` chạy 5 lần: lỗi chạm đường (vùng chạm đường thẳng không có diện tích, các đường cắt nhau ở tâm), vùng chạm trùng, hình `sbt-5-3-chu` hiện hai lần, nhãn dưới 16 px đã sửa; **còn 2 lỗi**, xem mục dưới.
- Cổng: `pnpm format` (tệp của bài), `pnpm lint`, `pnpm typecheck`, `pnpm test` (5273 đạt, 10 bỏ qua) đều đạt.

## Lỗi walk còn lại (để vòng review 1 sửa; điều phối dừng ở lần chạy thứ 5 theo yêu cầu)

- `FAIL [ipad-landscape] s1-03-exercise-s1-chon-hinh-gap-doi-wrong2`: khung trả lời nằm ngoài màn ("[data-answer-area] at -56–692, bar at 716"), ảnh `011-s1-03-exercise-s1-chon-hinh-gap-doi-wrong2.png`.
- `FAIL [ipad-landscape] s1-03-exercise-s1-chon-hinh-gap-doi-wrong3`: cùng lỗi ("at -34–716"), ảnh `012-s1-03-exercise-s1-chon-hinh-gap-doi-wrong3.png`.
- Nguyên nhân (chưa xác nhận): câu `s1-chon-hinh-gap-doi` là câu `choice` đầu tiên của bài, nên là câu được đi đủ ba nấc; đề có bốn phương án là hình (`thumb-*`, mỗi hình rộng 120 px) xếp cao, màn ngang thấp nên khung trả lời bị đẩy lên khỏi màn khi hiện giải thích ở nấc 2 và 3. Hướng sửa: thu nhỏ `thumb-*` dùng làm phương án (đặt `width` nhỏ hơn trong `src/visuals/math/hinh-co-truc-doi-xung/visuals.ts`), hoặc đổi câu này sang phương án chữ; chạy lại walk ở iPad ngang. Hai lỗi chỉ ở iPad ngang; iPad dọc và điện thoại 0 lỗi, 0 cảnh báo.
- Chạy lại: git worktree tạm, `pnpm install --offline --frozen-lockfile`, chép các tệp của bài, `TEST_PORT=3910 pnpm lesson:walk hinh-co-truc-doi-xung`.

## Điểm nghi cho Reviewer

- 5.6 và 5.8 tách thành câu a, b, c: có chấp nhận được không (chữ ý là của app).
- 5.10 chấm một phần (chỉ số cách ghép).
- Các câu `s8-on-diem-tren-truc`, `s9-on-diem-tren-truc`, `s10-on-diem-tren-truc` (điểm trên trục tự đối xứng) và quy tắc trục nghiêng "đi ngang rồi đi dọc cùng số ô": kiểm theo luật "Không có trong sách" (giả định 1 và 2).
- Câu quy tắc và mẹo nói "hình bình hành lệch" (giả định 4) và "hình chữ nhật có hai cạnh dài ngắn khác nhau": đúng với cách sách phân loại bốn hình.
- Vùng chạm của bảng lưới trên điện thoại nhỏ hơn 48 px một chút (bảng 7 cột, mỗi ô 48 px ở cỡ khung 336 px; điểm chạm là ô vuông của lưới).
- Đoạn lưới ở 5.9 chạm được cả hai nửa đoạn; đường a, b, c ở bài chọn trục chạm được ở nửa ngoài của đường (phần gần chữ cái), vì nửa trong các đường cắt nhau ở giữa hình.

## Nếu cần tách (chưa làm, chỉ phương án dự phòng; bài hiện 78 phút)

Nếu review thấy bài dài quá, tách theo `.claude/rules/content.md` mục "Splitting a long lesson": phần 1 (nhận biết trục: section 1 đến 7, SBT 5.1, 5.2, 5.3a, 5.3b, 5.4, 5.5, 5.10) và phần 2 (điểm đối xứng, vẽ thêm, giấy: section 8 đến 11, SBT 5.6a đến c, 5.7, 5.8a, b, 5.9a đến c); `part`, `order` 21 và 21.1. Báo chủ dự án trước khi tách.

## Ngoài phạm vi

Sửa bài khác, `video/`, `src/sync/`. Không `git push`, không deploy, không gọi Gemini ở bước này; không ghi đè media của bài khác; không dừng dev server cổng 3003, không dừng tiến trình theo tên.
