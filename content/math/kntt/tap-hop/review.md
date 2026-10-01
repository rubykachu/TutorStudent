# Review: Tập hợp (`tap-hop`)

- Bài: `content/math/kntt/tap-hop/lesson.json`
- Vòng: 11 - chỉ phần đổi (`pnpm content:diff tap-hop`), section: `tap-hop.section.tap-hop-la-gi`, `tap-hop.section.chon-va-noi`, `tap-hop.section.liet-ke`. Phạm vi ghi: chỉ `review.md`
- Nguồn đã đọc: `sources/math/tap-hop/` - không có trên máy này; phần đổi là màn hướng dẫn thao tác (không lấy từ sách) và một câu kiểm tra thao tác, soát theo note, glossary và ảnh walk
- `content:check`: 1 lỗi `[review-hash]` (bài đã đổi sau vòng 10, chờ duyệt lại), 0 cảnh báo `[guides]`, 1 cảnh báo "2 id chưa vào ids.lock.json" (`tap-hop.section.chon-va-noi`, `tap-hop.ex.kt-thu-noi`; điều phối chạy `pnpm content:lock tap-hop`)
- Đọc hiểu (Haiku): lượt 1 là 13 / 4 / 0; 3 mục chữ cũ không đổi (caption `chon-hop-but`, tên và caption section `liet-ke`) để nguyên; note và caption recap mới viết lại, lượt 3 còn một mơ hồ nhẹ ở cụm "ô đúng cặp với nó" (Nên sửa nhỏ, không chặn duyệt)
- `lesson:walk`: 0 FAIL (theo người gọi), ảnh `*-s2-*` và `*-s8-*` trong `.shots/walk/tap-hop/ipad/` của worktree guides-1-6, đã xem các ảnh 014-018, 023, 027, 103
- Kết luận: 0 Nghiêm trọng; Nên sửa của vòng đã sửa (note thao tác nói chung, không nhắc nút hay chấm); đã duyệt và khoá id sau lượt Haiku
- Bản đã review: `589834e7f7306fbabe52a96bd17534ecb1989d592963c174b7f9f594a217676f` (`pnpm content:diff` so với bản này)
- Bản đã review: chưa ghi (reviewer không chạy `content:hash`); bản vòng 10 là `2e9312f00cdf152de6a0c33f8469e631402cdc05110118dd6639bad5b1f273cf`

Đã soát đạt:
- Hết `[guides]`: `manipulate` và `match` có guide ở `chon-va-noi` (section đầu có `kt-thu-noi`, `mua-trong-nam` và, qua card `phan-tu`, câu `chon-do-dung`), `order` có guide ở `liet-ke` (section của card `liet-ke` mà `xep-ghep-tap-hop` gắn vào). Cả ba guide đứng trước lần dùng đầu.
- `kt-thu-noi` có đúng một cách nối: bút - hộp bút, quả cam - rổ trái cây; "tủ quần áo" không chứa bút hay cam. Đề một cách hiểu (LL-10), không phủ định kép, từ lớp 6, `explain` 3 câu đúng. Nhiễu duy nhất ở cột phải là ô thừa, không thành đáp án.
- Không trùng: `kt-thu-noi` (nối món với chỗ chứa) khác `noi-tap-hop-phan-tu` (nối cụm từ với tên gọi) và khác `kt-phan-tu-hop-but`, `chon-do-dung`; đồ vật cùng chủ đề hộp bút nhưng mỗi câu kiểm một việc khác (thao tác nối, khái niệm, thao tác chạm).
- Hai câu luyện `nhom-la-tap-hop`, `mua-trong-nam` chỉ dùng "tập hợp", "phần tử" đã dạy ở `tap-hop-la-gi`; đáp án a duy nhất, nhiễu đúng lỗi hay gặp (một món, tháng, thứ). Thứ tự màn ở `chon-va-noi`: hướng dẫn chạm, khám phá hộp bút, hướng dẫn nối, kiểm tra, luyện tập: hợp lý. `tap-hop-la-gi` sau khi bỏ `chon-hop-but` vẫn đủ ý (video, hình, hai định nghĩa) và recap còn khớp hai định nghĩa.
- Recap `liet-ke` vẫn lặp nguyên văn note `rule: true`; màn order thêm vào không đổi quy tắc. Walk: chữ không chồng, không cắt ở ảnh s2 và s8.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Note hướng dẫn thao tác nói "hình, chấm hay nút" nhưng hình mẫu chỉ có ô số

- Vị trí: `$.sections[1].blocks[0].children[0].text` (`tap-hop.section.chon-va-noi`), và `$.sections[1].recap.caption`
- Nguồn: — (hướng dẫn thao tác, không lấy từ sách)
- Vấn đề: LL-15. Note bảo chạm "hình, chấm hay nút" còn hình `phep-cong-phep-tru.visual.huong-dan-cham-so` vẽ ba ô số 12, 7, 9 ("Số đã chạm có viền đậm"); màn kế tiếp bé chạm các ô chữ (bút chì, quả cam...), bài này không có "chấm" hay "nút" nào. Bé chậm phải đoán "chấm", "nút" là gì; hình số cũng dễ bị đọc như đề toán.
- Sửa: đổi note thành "Bài thao tác: chạm vào thứ đề bài dặn, như hình, chữ hay số, rồi bấm “Kiểm tra”." và caption recap "Bài thao tác: chạm thứ đề dặn rồi bấm “Kiểm tra”. Bài nối: ..." (giữ câu bài nối). Nếu muốn khớp hẳn, dùng hình hướng dẫn chạm chữ của bài này thay hình số.

## Góp ý

### 1. Recap `chon-va-noi` chỉ nhắc thao tác, bỏ ý khám phá

- Vị trí: `$.sections[1].recap` (`tap-hop.section.chon-va-noi`)
- Nguồn: —
- Vấn đề: LL-06 nhẹ. Section còn màn "chỉ đồ dùng học tập mới thuộc hộp" và hai câu luyện về tập hợp, phần tử, nhưng recap chỉ có hai cách thao tác. Hai ý này đã có ở recap `tap-hop-la-gi` nên bé không mất kiến thức.
- Sửa: thêm vế "Mỗi món bỏ vào hộp là một phần tử." vào caption, hoặc chấp nhận vì section chủ yếu là hướng dẫn.

### 2. Hình mẫu nối có hai cách nối nghe hợp lý

- Vị trí: `phep-cong-phep-tru.visual.huong-dan-noi` (dùng ở `$.sections[1].blocks[2].children[1]`)
- Nguồn: —
- Vấn đề: LL-10. Ô "Nước" nối với "uống", còn "Lửa" với "nóng"; "Nước - nóng" cũng đọc được nên bé có thể thắc mắc vì sao ô đã nối là "uống". Hình không chấm điểm nên không hại, chỉ làm bé chậm phân vân.
- Sửa: đổi chữ trong hình thành cặp một nghĩa (vd "Mèo - kêu", "Chó - sủa" hay "bút - viết"); đây là hình của bài khác nên báo người sở hữu hình, không sửa riêng ở bài này.

### 3. Màn order hướng dẫn xếp dọc "bước làm trước", đề `xep-ghep-tap-hop` nói "viết số bé trước"

- Vị trí: `$.sections[7].blocks[2]` (`tap-hop.section.liet-ke`), liên quan `tap-hop.ex.xep-ghep-tap-hop`
- Nguồn: —
- Vấn đề: hình hướng dẫn dạy "thẻ trên cùng là bước làm trước" (danh sách dọc, nội dung là việc buổi sáng), còn câu order thật xếp các thẻ `{`, `4`, `;`, `9`, `}` thành cột dọc để đọc từ trên xuống; bé phải tự nối "trên cùng" với "viết trước". Câu này thuộc kho ôn, không nằm trong `practiceIds` của section nên bé chạm nó sau, và section `liet-ke` không có bài order nào ngay sau guide.
- Sửa: đổi đề `xep-ghep-tap-hop` thành "Xếp các thẻ từ trên xuống để viết tập hợp D gồm hai số 4 và 9, viết số bé trước." (câu thuộc phần đã duyệt, cần `explain` giữ nguyên). Lint buộc guide đứng trong hoặc trước section của card `liet-ke` nên vị trí hiện tại là hợp lệ.

### 4. `sourceRef` của `chon-va-noi` lẫn hướng dẫn và nội dung sách

- Vị trí: `$.sections[1].sourceRef`
- Nguồn: —
- Vấn đề: section có hai màn hướng dẫn thao tác (không lấy từ sách, như `thao-tac` ghi "Hướng dẫn cách làm bài tập, không lấy từ sách") cùng màn hộp bút và hai câu luyện lấy từ tr.5. Ghi "Sách bài tập tr.5" cho cả section hơi rộng.
- Sửa: ghi "Sách bài tập tr.5 (hộp bút, các mùa); hướng dẫn cách làm bài tập, không lấy từ sách".

### 5. Bài phụ thuộc ba hình của bài `phep-cong-phep-tru`

- Vị trí: `$.sections[1].blocks[0].children[1].visualId`, `$.sections[1].blocks[2].children[1].visualId`, `$.sections[1].recap.visualId`, `$.sections[7].blocks[2].children[1].visualId`
- Nguồn: —
- Vấn đề: đổi hay bỏ ba hình `huong-dan-*` ở bài kia sẽ đổi chữ hình trong `tap-hop` mà hash của `tap-hop` không đổi. Walk hiện đạt, đang là cách dùng chung đã chọn.
- Sửa: không cần sửa bài này; ghi vào ghi chú của hình chung, hoặc đưa ba hình về chỗ dùng chung nếu thêm bài thứ ba.

## Góp ý (giữ từ vòng 8, ngoài phạm vi diff)

### 6. "chữ C quay sang phải" dễ hiểu là xoay chữ C

- Vị trí: `video/projects/tap-hop/thuoc-khong-thuoc/script.json`, cảnh `s03-ve-thuoc`, câu "Nét một: chữ C quay sang phải."
- Nguồn: —
- Vấn đề: hình vẽ đúng chữ C bình thường, nhưng "quay sang phải" có thể hiểu là xoay chữ C; caption `ve-thuoc` của bài chỉ nói "nét một là chữ C".
- Sửa: "Nét một: viết chữ C." hoặc "Nét một: chữ C, mở về bên phải."

### 7. Phụ đề ngắt dòng giữa một từ

- Vị trí: `public/media/video/tap-hop/thuoc-khong-thuoc.vtt` cue 7–8 ("phần / tử"), cue 26–27 ("tập / hợp")
- Nguồn: —
- Vấn đề: người học chậm đọc phụ đề từng dòng, từ bị tách hai dòng khó đọc hơn.
- Sửa: báo người làm công cụ: bộ chia cue của `video:build` tránh ngắt giữa hai tiếng của một từ ghép, hoặc ưu tiên ngắt trước "của", "là".

### 8. Chấm số 2 của nét gạch chéo ∉ bị cắt ở mép trên

- Vị trí: `video/projects/tap-hop/figures.tsx` (`Mark`, viewBox cao `GLYPH_HEIGHT`), video `thuoc-khong-thuoc` khoảng 41,9–42,2 s
- Nguồn: —
- Vấn đề: chấm số của nét thứ hai nằm sát đỉnh viewBox nên chỉ hiện một phần trong lúc vẽ (vẫn còn ở bản dựng lại; chỉ thấy khoảng 0,3 s).
- Sửa: nới viewBox thêm khoảng 16 đơn vị ở trên và dưới.
