# Review: Hình có trục đối xứng (`hinh-co-truc-doi-xung`)

- Bài: `content/math/kntt/hinh-co-truc-doi-xung/lesson.json`
- Vòng: 8 - chỉ phần đổi (góp ý từ app #4, #5, #6: câu dẫn gấp thử ở section 3 và 4, hình gấp thử, nhịp animation)
- Nguồn đã đọc: không mở ảnh nguồn (diff chỉ có bốn câu `note` dẫn vào hình gấp thử, không có câu `bookPractice`; `sourceRef` của hai section không đổi)
- `content:check`: 0 lỗi (chỉ còn `review-hash` do bản chưa ghi hash của vòng này), 0 cảnh báo của bài (kết quả điều phối chạy trong worktree tạm)
- Đọc hiểu (Haiku): lượt 6 (chữ đổi của vòng này, lượt 1): 8 / 1 / 0 (`.shots/review/hinh-co-truc-doi-xung/doc-hieu-6.md`); lượt 7 (lượt 2, chỉ mục viết lại `$.sections[3].blocks[1].children[0].text`): 0 / 1 / 0 (`doc-hieu-7.md`, vẫn "Hiểu mơ hồ" vì từ "hình bình hành lệch"; giữ, xem Góp ý 4). Lượt 8 (sau khi sửa Góp ý 1 và 3, chỉ hai câu dẫn của section 4 và dòng "Đang gấp đôi theo đường a."): 2 / 1 / 0 (`doc-hieu-8.md`; mục mơ hồ vẫn là "hình bình hành lệch", giữ như Góp ý 4). Các vòng trước: 215 / 1 / 0 trên toàn bài (trước vòng 1, `doc-hieu.md`); chữ đổi sau vòng 2: lượt 1 72 / 7 / 0 (`doc-hieu-2.md`), lượt 2 7 / 6 / 1 (`doc-hieu-3.md`), lượt 3 8 / 4 / 0 (`doc-hieu-4.md`, hết 3 lượt); chữ đổi sau vòng 5: 6 / 0 / 0 (`doc-hieu-5.md`)
- `lesson:walk`: 0 FAIL, 0 cảnh báo (điều phối chạy trong worktree tạm); đã xem ảnh phone `058-s4-01-block-shown.png`, `059-s4-02-block.png` và ba ảnh hình gấp thử đang gấp, đổi đường, gấp xong
- Kết luận: Đã xuất bản (0 Nghiêm trọng, 0 Nên sửa; Góp ý 1, 2, 3 đã sửa: câu kết luận chỉ hiện khi hai nửa đã gấp xong, trong lúc gấp hiện "Đang gấp đôi theo đường a.", dòng "mở ra trước" chỉ khi đang đổi đường; dòng kết luận cao đủ 3 dòng (`min-h-20`), nút "Mở hình ra" và số "Đã thử" chung một hàng để hình vẫn vừa khung; câu dẫn hình thang cân mở bằng "Cái xô nhựa nhìn từ bên cạnh", câu gạch lát "Nhiều viên gạch lát nền có dạng hình bình hành lệch như hình dưới đây."; Góp ý 4 giữ)
- Bản đã review: `216d56672fa7276ca31d661355563c52db3e0b9355ffb0b9dcda7041c792fedc` (`pnpm content:diff` so với bản này)

Đã soát:
- Bốn câu `note` đổi (`$.sections[2].blocks[0..1].children[0].text`, `$.sections[3].blocks[0..1].children[0].text`): mỗi câu có đủ hai ý (làm gì, rồi xem gì), 1 câu dẫn vào + 1 câu "Cùng làm", xưng "bạn", từ "chồng khít" là từ đã dạy ở section 1 và 2 (câu quy tắc "Gấp hình theo đường thẳng d, nếu hai nửa chồng khít nhau thì d là trục đối xứng"). Không có phủ định kép, không từ Hán Việt khó, không đánh đố. "gấp đôi" khớp với hành vi mới của hình (gấp theo đường rồi hai nửa chồng lên nhau).
- Cùng hai section: câu `rule` và `recap.caption` của section 3 và 4 không đổi và vẫn khớp nhau nguyên văn; thuật ngữ "trục đối xứng", "trung điểm" (có trong glossary), "hình bình hành lệch" (cùng cách gọi ở note, câu hỏi, giải thích, recap); `checkIds`, `practiceIds` và hình quy tắc không đổi, không câu nào trùng hình gấp thử (hình gấp thử chưa có đáp án hiện sẵn, nhãn đường a, b, c, e không lộ trục). Mẹo `cheo-khong-phai-truc` vẫn đúng (đường chéo hình chữ nhật không phải trục, hai đường chéo hình thoi đều là trục).
- Hình gấp thử (`fold-lab.tsx`, `fold-view.tsx`, `useLineFold`): chạm đường đang gấp thì mở ra; chạm đường khác thì mở ra rồi mới gấp (ảnh `fold-switch.png`: hình mở, đường mới đậm, dòng "Hình mở ra trước, rồi gấp đôi theo đường b."); chạm lại giữa chừng (đang mở, đang gấp) thì huỷ hẹn giờ cũ rồi chạy theo đường mới nên không kẹt; giảm chuyển động thì đổi tức thì. Câu nhận xét đúng kiến thức với cả hai trường hợp ("thì hai nửa chồng khít lên nhau. Vậy đường a là trục đối xứng" và "thì hai nửa không chồng khít. Vậy đường b không phải trục đối xứng"), lớp 6, cùng thuật ngữ bài. Nút "Mở hình ra" chỉ hiện khi có đường đã chọn, giữ chỗ khi ẩn nên các dòng dưới không nhảy; số "Đã thử x/n" và nút "Xem cách làm" không đổi nghĩa. Hợp người học chậm: một đường tại một thời điểm, luôn gấp từ hình nguyên, có cách quay lại hình đầu.
- `StepPlayer` và `VISUAL_STEP_MS`: chỉ chạy khi hiện từ nửa hình trở lên (không có `IntersectionObserver` thì coi là đang hiện), 3 giây mỗi bước (chuyển động mỗi bước tối đa khoảng 0,7 giây nên hình đứng yên hơn 2 giây để đọc chú thích); các bài khác dùng chung đã dùng hằng số này (test của chúng dùng `VISUAL_STEP_MS`, không số cứng). Phù hợp bé đọc chậm; nút "Xem lại" và "Bước tiếp" không đổi.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. Hình gấp thử: câu kết luận hiện ngay lúc hình mới bắt đầu gấp

- Vị trí: `src/visuals/math/hinh-co-truc-doi-xung/fold-view.tsx` (`useLineFold`, trường `settled`) và `fold-lab.tsx` (`data-fold-verdict`)
- Nguồn: —
- Vấn đề: `settled` đúng ngay khi `folded` được đặt, tức đầu lượt gấp 0,7 giây; dòng "hai nửa chồng khít" hay "không chồng khít" đã in đậm trong lúc hai nửa còn đang chồng lên nhau, bé đọc chậm đọc trước khi tự nhìn thấy kết quả. Ở lần chạm đầu tiên (hình đang mở), dòng "Hình mở ra trước, rồi gấp đôi theo đường b." cũng chớp qua khoảng hai khung hình dù hình đã mở sẵn.
- Sửa: tuỳ tác giả; nếu sửa, đặt `settled` sau `FOLD_MS` kể từ khi bắt đầu gấp và chỉ hiện dòng "mở ra trước" khi `line` khác `null` (đang có hình gấp để mở).

### 2. Hình gấp thử trên điện thoại: câu kết luận 3 dòng đẩy nút "Mở hình ra" xuống

- Vị trí: `src/visuals/math/hinh-co-truc-doi-xung/fold-lab.tsx`, `<p data-fold-verdict>` (`min-h-14`)
- Nguồn: `fold-a.png` và `fold-switch.png`
- Vấn đề: câu mới dài hơn câu cũ ("Gấp theo đường a thì hai nửa chồng khít lên nhau. Vậy đường a là trục đối xứng.") chiếm 3 dòng ở rộng điện thoại, trong khi `min-h-14` chỉ đủ khoảng 2 dòng; nút "Mở hình ra" và dòng "Đã thử" nhảy xuống khoảng 25 px mỗi lần chạm đổi đường. Không chồng chữ hay cắt chữ (walk không báo FAIL).
- Sửa: tuỳ tác giả; nâng `min-h` của dòng này lên đủ 3 dòng (khoảng `min-h-24`) để bố cục đứng yên.

### 3. Câu dẫn section 4: hình thang cân chưa có tình huống đời sống, câu gạch lát có hai chữ "có" liền nhau

- Vị trí: `$.sections[3].blocks[0].children[0].text` và `$.sections[3].blocks[1].children[0].text` (`thang-can-binh-hanh`)
- Nguồn: —
- Vấn đề: ba hình còn lại mở bằng một vật quen ("Cánh cửa ra vào", "Con diều", "viên gạch lát nền"), riêng hình thang cân vào thẳng "Cùng làm"; câu gạch lát đọc "Có những viên gạch lát nền có dạng…" lặp "có" nên hơi nặng. Không sai kiến thức, bé vẫn làm được.
- Sửa: tuỳ tác giả; ví dụ "Chiếc rổ nhựa nhìn từ bên có dạng hình thang cân." (hoặc vật bé gặp khác) cho câu đầu, và "Những viên gạch lát nền có hình bình hành lệch như hình dưới đây." cho câu sau.

### 4. Đọc hiểu: "hình bình hành lệch" vẫn "Hiểu mơ hồ" ở lượt 2; đồng ý giữ

- Vị trí: `$.sections[3].blocks[1].children[0].text` (`thang-can-binh-hanh`)
- Nguồn: —
- Vấn đề: Haiku không biết "lệch" là gì. Đây là cách gọi của bài để phân biệt với hình chữ nhật và hình thoi (cũng là hình bình hành nhưng có trục): "lệch" có ở câu quy tắc ngay sau, ở câu hỏi, giải thích và recap, và câu mới đã trỏ bé vào hình ("như hình dưới đây"), nên bé có chỗ để hiểu bằng mắt; đổi sang từ khác sẽ lệch với mọi chỗ còn lại.
- Sửa: giữ nguyên. Không cần lượt 3.
