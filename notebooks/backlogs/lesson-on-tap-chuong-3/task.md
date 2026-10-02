# Bàn giao: `on-tap-chuong-3` (Ôn tập chương III, Toán 6 tập 1, Kết nối tri thức)

## Trạng thái

- Cập nhật cuối: 02/10/2026. Bài `published` sau review vòng 2: `reviewedHash` `94dbb2d8cc14e98720235db20fbf58e437a8b4ab5740b5e788a20e2280a75b4b`, 89 id đã khoá (`content:lock on-tap-chuong-3`). Lời đọc tổng quan và 3 video đã dựng, review xong (xem mục "Lời đọc và video"); `reviewedHash` sau đó `c8cc57b4027bf7596118278a64228798594e4947f7421bba53269e459334166e`, 92 id đã khoá. Chưa tải media, chưa deploy.
- Vòng 1: 7 Nghiêm trọng, 24 Nên sửa, 15 Góp ý, đã sửa (trừ phần cần hình mới và sửa app, xem "Việc còn lại sau review").
- Vòng 2 (toàn bài, 3 Reviewer Opus + Tổng hợp Opus): 0 Nghiêm trọng, 8 Nên sửa, 14 Góp ý, ghi ở `content/math/kntt/on-tap-chuong-3/review.md`; tệp nhóm `.shots/review/on-tap-chuong-3/nhom-{1,2,3}-r2.md` (không commit). Tác giả Sonnet sửa đủ 8 Nên sửa (mục "Đã sửa sau vòng 2"). Câu quy tắc bảng ba ô được xét là không ngoài nguồn (lời giải sách tr.114 suy ra đúng ô 1 bằng ô 4), giữ cờ `rule`; sau lượt đọc hiểu, câu chốt là "Nếu ba ô liền nhau luôn có cùng tích khác 0 (cùng tổng), thì ô 1, ô 4, ô 7 có cùng một số." Đề 3.43b, 3.44b thêm dấu "." như sách (quy ước ghi ở mục "Giả định"). Không có Nghiêm trọng nên không đổi `docs/lessons-learned/`.
- Đọc hiểu (Haiku) trên 116 mục chữ đổi (`doc-hieu-r1-items.txt` cộng chữ đổi vòng 2): 98 / 18 / 0, viết lại 18 mục, lượt 2: 16 / 2 / 0, viết lại 2 mục, lượt 3: 2 / 0 / 0. Một Reviewer Sonnet kiểm phần đổi sau đó (`.shots/review/on-tap-chuong-3/r2-fix-check.md`): 0 Nghiêm trọng, 2 Nên sửa (đã sửa), 5 Góp ý.
- Đã chạy sau khi duyệt: `pnpm content:check` 0 lỗi; `pnpm lesson:walk on-tap-chuong-3` 0 FAIL, 0 cảnh báo ở ipad, phone, ipad-landscape (cây git tạm, cổng 3550, đã gỡ), ảnh ở `.shots/walk/on-tap-chuong-3/` (ảnh cũ của vòng 1 chuyển sang `.shots/walk/on-tap-chuong-3.old-r1/`, xoá tay khi tiện); `pnpm lint`, `pnpm typecheck`, `pnpm test` qua; `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit`.
- Việc tiếp theo: tải media và deploy khi chủ dự án đồng ý (`docs/operations.md` "Đưa bài mới lên production": media trước, deploy sau).

## Lời đọc và video (02/10/2026)

- Giọng: `my-duyen` (Mỹ Duyên), xen kẽ với Bài 17 dùng Hải Đăng; khai ở `video/projects/on-tap-chuong-3/media.json`.
- Lời đọc tổng quan: Gemini Vindemiatrix đọc (`overview.narration.voice.engine` = `gemini`), 56,8 giây, mọi câu Whisper từ 98,8% trở lên; "chương III" đọc "chương ba".
- Ba video (VieNeu Mỹ Duyên, mọi câu Whisper 100%, nhịp theo luật, không checkpoint), mỗi video là khối đầu của một phần:
  - `dau-cua-tich` (47 giây, 12 câu), phần `dau-tich-tong`: dấu của tích hai số khác 0.
  - `tru-so-doi` (48 giây, 13 câu), phần `dau-tich-hieu`: muốn trừ một số, cộng với số đối.
  - `bang-ba-o` (69 giây, 15 câu), phần `bang-tich`: ba ô liền nhau cùng tích thì ô 1, ô 4, ô 7 bằng nhau.
- Review (một Reviewer Sonnet, vòng chỉ phần đổi): 0 Nghiêm trọng, 6 Nên sửa (đã sửa hết), 7 Góp ý. Sửa: `scenes()` ở `video/composition/runtime.js` có tuỳ chọn `leave` (mặc định 0,3, `0` giữ hình qua quãng lặng `pause`; ba video này dùng `0`, video cũ không đổi); mốc chữ của nhãn "số đối của 5"; `bang-ba-o` thêm lập luận ô 4 bằng ô 1 (10 chia âm 10 bằng âm 1; ô 1 và ô 4 cùng nhân với âm 10 ra 10), hiện ô 5, ô 6, ô 7 theo lời; `dau-cua-tich` giữ ba ví dụ trên màn lúc đọc quy tắc.
- Đọc hiểu (Haiku) trên 34 câu lời video: 26 / 6 / 2; các câu còn lại không phải "Hiểu rõ" đều là câu quy tắc chép nguyên văn từ bài đã qua đọc hiểu (không đổi được), và hai câu giới thiệu bảng ô.
- Góp ý chưa làm: nhãn "cùng dấu" hiện sớm hơn lời; không giải thích vì sao âm nhân âm ra dương; màu số dương chưa đều giữa ba video; chữ thẻ quy tắc 30px nhỏ; câu quy tắc của `bang-ba-o` đọc hai lần; clip card `bang-tich` chỉ khớp một nửa recap; câu 1 của `dau-cua-tich` dùng "xét".
- Media cần tải lên (chưa tải; làm theo `docs/operations.md` "Đưa bài mới lên production", media trước, deploy sau; lệnh `pnpm media:upload on-tap-chuong-3 --dry-run` liệt kê đúng 12 tệp này):
  - `public/media/narration/on-tap-chuong-3/overview.m4a`, `overview.vtt`
  - `public/media/video/on-tap-chuong-3/{dau-cua-tich,tru-so-doi,bang-ba-o}.{mp4,vtt,jpg}`

## Nguồn (sách bài tập, `sources/math/on-tap-chuong-3/`, không commit)

- Trang in = trang PDF − 1 (PDF `/Users/minhtang/Documents/MyProject/NhaKy/Toan6-tap1.pdf`, chỉ đọc). Ảnh dựng bằng `pdftoppm` 200 dpi (1363 × 1938), cùng cỡ ảnh các bài khác.
- Đề: tr.60–62 in (PDF 61–63): `sbt-p60.png` (A: sơ đồ tổng kết chương III, không có bài tập), `sbt-p61.png` (B: câu hỏi trắc nghiệm 1–6), `sbt-p62.png` (C: bài tập 3.41 đến 3.49). Trang 63 là mở đầu chương IV (Bài 18), không thuộc bài này.
- Lời giải: tr.114 in (PDF 115): `sbt-p114.png` (đáp án trắc nghiệm và lời giải 3.41 đến 3.49); các bài 3.48 và 3.49 có lời giải và bảng kết quả.
- Còn các ảnh thừa trong thư mục, bài không dùng: `sbt-p63.png` (đầu chương IV, để xác định ranh giới), `sbt-p64.png`, `sbt-p113.png` (lời giải Bài 17), `sbt-p115.png` (lời giải chương IV). Xoá tay khi tiện; ảnh không bao giờ commit.

## Giả định (chủ dự án yêu cầu)

- Đề của bài là 100% đề của sách: mọi bài và mọi ý, đúng số, đúng chữ, vì các câu này xuất hiện trong bài kiểm tra. Ngoại lệ có chủ ý, chỉ cho bài ôn tập (`kind: "review"`, mỗi câu sách có `bookRef`).
- Phần nhắc lại, bước dẫn, giải thích, gợi ý, mẹo, recap: lời của bài. Các màn "Nhắc lại" và recap dùng lại nguyên khối (câu quy tắc cùng hình ví dụ) đã duyệt của Bài 13 đến 17, nên một quy tắc chỉ có một cách nói trong cả app.
- Sách chỉ cho đáp án trắc nghiệm hoặc lời giải mở; bài đổi sang dạng chấm được, đáp án lấy từ trang lời giải và đã tính lại bằng chương trình (không commit): câu hỏi 1 đến 6 (chọn đáp án), 3.41 (điền hai ô chọn từ danh sách), 3.42 (xếp thứ tự), 3.43 và 3.44 (số), 3.45 (chọn nhiều), 3.46 (chọn dãy), 3.47 (chọn nhiều, dạng ±), 3.48 và 3.49 (điền bảng).
- Chỉ khác sách ở: bỏ nhãn (A) đến (D) và dấu ";" "." cuối lựa chọn; lời dẫn "Tìm khẳng định đúng trong các khẳng định sau:" lặp ở đầu đề mỗi câu hỏi trắc nghiệm; tách ý a), b) của 3.43 và 3.44 thành từng câu (nhãn ý nằm ở `bookRef`); lời dẫn "(từ Bài 3.43 đến Bài 3.44)" giữ nguyên văn cho cả 3.43 và 3.44; thêm khối `note` lệnh của app ("Chọn đáp án đúng.", "Chọn tất cả...", "Sắp xếp các số từ bé đến lớn.", "Chạm một số, rồi chạm ô trống cần điền...") và, ở 3.41 và 3.48 và 3.49, một khối `note` hay ô điền thay cho chỗ trống của sách.
- 3.41 hỏi hai việc (viết số a, tìm số đối của a) nên là một câu `fillBlank` có hai ô (`a = ▢; số đối của a là ▢`). 3.46 sách đáp "−18; −12; −6; 0; 6; 12; 18" nên là câu chọn một dãy trong bốn dãy (các nhiễu: thiếu 0, thiếu số âm, thừa ±24). 3.47 sách đáp "±1; ±2; ±3; ±6" nên các lựa chọn viết dạng ±. 3.48 và 3.49 là bảng 11 ô: đề in một dòng "? | ? | 6 | ..." như sách rồi một câu `fillBlank` chọn số từ ngân hàng cho 9 ô trống (số của ô đã cho nằm sẵn trong dòng).
- Mọi số trong bước dẫn khác số của sách.
- Tách ý a), b) của 3.43 và 3.44 thành câu riêng thì ý a) bỏ dấu ";" ngăn ý của sách, ý b) giữ dấu "." cuối như sách.

## Hình: dùng lại hình có sẵn, chưa có hình riêng

- Lượt soạn này không được sửa `src/`, nên bài chưa có module hình riêng (`src/visuals/math/on-tap-chuong-3/`) và không đăng ký thêm hình. Mọi `visualId` là hình của Bài 13, 14, 16, 17 (hình ví dụ của quy tắc, hình "Cùng làm" tương tác; 5 hình tương tác khác nhau nên `--stats` đạt), sticker dùng `tap-hop-cac-so-nguyen.visual.sticker` (trùng sticker Bài 13).
- Hệ quả: (1) số trên hình là số của Bài 13 đến 17, câu luyện và câu sách không dùng lại các số đó; (2) câu sách chưa có hình gợi ý nấc 2 và hình lời giải nấc 3 riêng (nấc 1 tô khối đề, nấc sau hiện đáp án); (3) hai bài đổi hình thì recap của bài này cũng đổi theo. Nếu muốn hình riêng (hình nấc 2 cho các câu sách, sticker riêng): giao skill `lesson-visual` tạo module và đăng ký registry, rồi review phần đổi.

## Cấu trúc bài (13 section, 13 card, 44 câu, 10 mẹo)

Bảng dưới là bản soạn đầu; sau khi sửa vòng 1 bài có 13 section, 13 card, 46 câu, 11 mẹo (đổi id, câu và mẹo ghi ở mục "Trạng thái" và cuối `review.md`).
Loại câu: 25 `choice` (6 chọn nhiều), 14 `numeric`, 3 `fillBlank` (có ngân hàng), 1 `match`, 1 `order`. 17 câu có `bookRef`: câu hỏi 1 đến 6, 3.41, 3.42, 3.43a, 3.43b, 3.44a, 3.44b, 3.45, 3.46, 3.47, 3.48, 3.49. Mỗi section theo mẫu: màn "Nhắc lại" (nguyên khối quy tắc và hình của Bài 13 đến 17, kèm màn "Cùng làm" khi có) rồi một mẹo, các bước dẫn trong `checkIds`, câu sách (mọi ý trừ ý cuối trong `checkIds`, ý cuối trong `practiceIds`). Mỗi section một card; recap là hình ví dụ với câu quy tắc nguyên văn.

| Section              | Câu sách     | Nhắc lại                                                                     | Bước dẫn                                                  | Mẹo (`tip`)                       |
| -------------------- | ------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------- |
| `so-sanh`            | Câu hỏi 1    | Bài 13: số âm, 0, số dương; Cùng làm chọn số nhỏ hơn 0                       | chọn số nhỏ nhất của 0; 5; −8; chọn dãy xếp đúng          | So sánh nhiều số nguyên           |
| `tap-hop-a`          | Câu hỏi 2    | Bài 13: ∈, ≤, ≥; Cùng làm chọn x của −2 < x ≤ 1                              | khẳng định đúng với tập hợp C; chọn các số thuộc D        | không có                          |
| `dau-tich-tong`      | Câu hỏi 3, 4 | Bài 16: dấu của tích; Bài 14: cộng hai số cùng dấu                           | tích dương thì hai số cùng dấu; tổng âm thì cùng âm       | Tích dương và dấu của tổng        |
| `dau-tich-hieu`      | Câu hỏi 5, 6 | Bài 14: trừ là cộng số đối; trừ một số âm; Cùng làm 1 − (−3)                 | a dương b âm thì a − b dương; tích âm thì khác dấu        | Hiệu và thứ tự hai số             |
| `so-doi`             | 3.41         | Bài 14: phần dấu, số đối                                                     | viết b từ phần dấu và phần số tự nhiên; nối số với số đối | Tìm số đối                        |
| `tinh-abcd`          | 3.42         | Bài 14, 16, 17, 13: cộng khác dấu, nhân hai số âm, chia khác dấu, xếp thứ tự | tính (−6) − 4, (−7) · (−4), (−45) : 9                     | không có                          |
| `thua-so-chung-3-43` | 3.43a, 3.43b | Bài 16: đưa thừa số chung ra ngoài, ví dụ mẫu                                | chọn cách đưa 6 ra ngoài; tính 6 · [4 − (−5)]             | Tìm thừa số chung bị giấu         |
| `thua-so-chung-3-44` | 3.44a, 3.44b | Bài 16: nhân một số với một tổng, ví dụ mẫu                                  | tách 12 = 4 · ?; chọn cách đưa 4 ra ngoài                 | Tách thừa số để lộ thừa số chung  |
| `tich-bang-0`        | 3.45         | Bài 16: tích bằng 0, ví dụ mẫu                                               | khẳng định chắc chắn đúng; tìm x của (x − 7) · 5 = 0      | không có                          |
| `boi-trong-khoang`   | 3.46         | Bài 17: tìm bội, bội trong một khoảng; Cùng làm                              | bội của 4; bội của 4 trong khoảng −9 đến 9                | Bội trong khoảng đối xứng         |
| `uoc-chung`          | 3.47         | Bài 17: tìm ước, ước chung; Cùng làm                                         | ước dương của 14; ước chung dương của 12 và 20            | Tìm ước chung của hai số          |
| `bang-tich`          | 3.48         | Bài 17: a = b · q; lập luận ô 1 bằng ô 4                                     | tìm x của x · 3 · (−2) = 18; ô thứ tư khi tích ba ô là 60 | Bảng ba ô nhân lại luôn bằng nhau |
| `bang-tong`          | 3.49         | Bài 14: hai số đối cộng lại bằng 0; lập luận ô 1 bằng ô 4                    | ô còn lại khi biết 4 và −9; ô thứ tư khi tổng ba ô là 0   | Tìm ô còn thiếu khi tổng bằng 0   |

- Tổng quan (`overview`): câu đầu của `hook` là câu chào "Chào bạn!"; tình huống đời sống là xem nhiệt kế dưới 0 và tính ví còn bao nhiêu tiền; không có lời đọc (làm sau khi duyệt).
- Mẹo đã thử bằng chương trình (không commit): so sánh nhiều số (20000 bộ, kể cả toàn số âm, có 0, có số trùng), dấu của tích và tổng (mọi cặp từ −20 đến 20), hiệu và thứ tự (mọi cặp khác nhau từ −30 đến 30), bội trong khoảng đối xứng (k từ 1 đến 24, khoảng từ 1 đến 79, không tính hai đầu), ước chung (mọi cặp khác 0 từ −60 đến 60), bảng ô tích (bốn số khác 0 từ −4 đến 4, khi tích không đổi thì ô 1 bằng ô 4) và bảng ô tổng. Mẹo "thừa số chung bị giấu" và "tách thừa số" là phép biến đổi đúng, có ví dụ tính tay (28 + 20 = 48 và 4 · 12 = 48; 240 − 42 = 198 và 6 · 33 = 198). Mẹo "so sánh hai số âm" nằm trong mẹo so sánh nhiều số.
- Đáp án sách đã đối chiếu với `sbt-p114.png` và tính lại: câu hỏi 1 D, 2 C, 3 A, 4 D, 5 C, 6 B; 3.41 a = −27, số đối 27; 3.42 a = 4, b = −12, c = 60, d = −4 nên b < d < a < c; 3.43a 840, 3.43b 238; 3.44a 3 904, 3.44b −442; 3.45 x = 38 và x = −25; 3.46 và 3.47 như trên; hai bảng 3.48 và 3.49 khớp bảng của sách.

## Đọc hiểu (Haiku, 02/10/2026)

- Lượt 1 trên 199 mục chữ mới (mục có đường dẫn trong `.shots/review/on-tap-chuong-3/doc-hieu-items.txt`; bỏ đề và lựa chọn của câu sách, hình, TeX, và các khối chép nguyên từ Bài 13 đến 17 đã qua đọc hiểu ở bài của chúng): 97 Hiểu rõ / 93 Hiểu mơ hồ / 9 Khó hiểu. Lượt này Haiku gắn nhãn chủ yếu theo độ dài câu và từ chuyên môn, nên nhiều nhãn nhiễu (chê các từ đã dạy như "tích", "bội").
- Đã viết lại 95 mục (câu ngắn hơn, có từ nối, "nhân... thì được..." thay cho "tích" ở chỗ phù hợp, thêm lời giải nghĩa ngắn cho "tích", "bội", "ước chung" ở đề bước dẫn). Lượt 2 (prompt yêu cầu đọc theo nghĩa, không theo độ dài) trên 95 mục đã viết lại: 82 / 13 / 0. Viết lại 13 mục, lượt 3: 13 / 2 / 0. Hai mục còn mơ hồ (mẹo `thua-so-chung-bi-giau`, lời giải `bai-3-44a`) đã viết lại lần nữa, chưa đọc lại.
- Chữ đổi sau lượt đọc hiểu, chưa có lượt Haiku nào đọc: lý do ở bốn mục `wrong` của câu hỏi 2, 3, 4 (sửa vì hai lý do trùng chữ), mẹo `tich-duong-tong` (chỉ đổi TeX thành bốn dòng), hai khối `note` của 3.48 và 3.49, và hai chữ sửa sau lượt 3 ở trên. Theo skill, mọi chữ đổi ở vòng sau đều chạy lượt Haiku trên mục đổi (`pnpm content:diff`) trước khi duyệt.
- Kết quả từng lượt: `.shots/review/on-tap-chuong-3/doc-hieu.md`, `doc-hieu-2.md`, `doc-hieu-3.md` (không commit).

## Phát hiện về công cụ (không sửa trong lượt này vì không được đụng `src/`)

- `src/exercises/explanation-panel.tsx` dùng chữ của lý do làm `key` (`key={reason.text}`), nên hai lý do `wrong` trùng chữ trong cùng một câu làm React báo trùng khoá (hiện ở dev là nhãn "1 Issue" trên màn giải thích). Bài này đã sửa chữ để mọi lý do của một câu khác nhau; nên có luật `content:check` (trong `[explain]`) báo `wrong` trùng chữ, hoặc đổi `key` sang `optionId`.
- `lesson:walk` không báo lỗi khi công thức dài bị cắt bên phải ở trang "Mẹo hay" (mẹo `tich-duong-tong` ban đầu viết hai phép tính trên một dòng); đã sửa bằng cách xếp dọc. Bảng 11 ô bằng `array` của KaTeX tràn màn điện thoại nên bài đặt bảng dạng một dòng chữ có dấu "|".

## Chạy vòng 1 (phiên mới, không phải phiên soạn bài)

Làm đúng skill `lesson-review`, mục "Vòng toàn bài". Phiên điều phối chỉ chạy lệnh, chia nhóm, mở subagent và chuyển kết quả.

1. Đọc `CLAUDE.md`, `docs/lessons-learned/index.md`, `.claude/rules/agents.md`, `.claude/rules/content.md`, `.claude/rules/subagent-briefs.md`, `.claude/skills/lesson-review/SKILL.md` và `references/checklist.md`; đặc biệt trục 1 mục "Bài ôn tập" (đề khác sách là Nghiêm trọng) và LL-08, LL-23, LL-26.
2. `pnpm content:check --root content` và `pnpm lesson:walk on-tap-chuong-3` (cây git tạm, `pnpm install --offline`, nối tắt `public/media`, không có `.next`, cổng riêng như 3530, `CONTENT_INCLUDE_DRAFT=1`; bài `draft` cần server mở với biến đó; gỡ cây bằng `git worktree remove --force`; chỉ dừng tiến trình do chính mình mở, không dừng server cổng 3001 của chủ dự án).
3. Chia 13 section thành 3 nhóm liên tiếp: nhóm 1 gồm `so-sanh`, `tap-hop-a`, `dau-tich-tong`, `dau-tich-hieu` (câu hỏi 1 đến 6); nhóm 2 gồm `so-doi`, `tinh-abcd`, `thua-so-chung-3-43`, `thua-so-chung-3-44`, `tich-bang-0` (3.41 đến 3.45); nhóm 3 gồm `boi-trong-khoang`, `uoc-chung`, `bang-tich`, `bang-tong` (3.46 đến 3.49).
4. Mở 3 Reviewer song song (`subagent_type: "general-purpose"`, `model: "opus"`), mỗi nhóm một Reviewer, mỗi Reviewer ghi `.shots/review/on-tap-chuong-3/nhom-<n>.md`. Prompt từng Reviewer nêu: vai, `LESSON`, nhóm section, tệp ghi, "đọc `.claude/skills/lesson-review/SKILL.md`", phạm vi được và không được đụng (chỉ đọc, không sửa `lesson.json`, không gọi API ngoài, không đụng `src/`, `public/media/` hay bài khác), điểm dừng (gặp việc ngoài phạm vi thì ghi vào tệp nhóm, không tự mở rộng).
5. Xong cả ba, mở một Tổng hợp (`model: "opus"`) gộp thành `content/math/kntt/on-tap-chuong-3/review.md`, chạy lệnh cuối vòng: còn Nghiêm trọng thì `pnpm content:hash on-tap-chuong-3 --root content --mark`; hết Nghiêm trọng thì không `--approve` ngay mà chờ lượt Đọc hiểu (mục "Vòng review" của skill) rồi mới `--approve` và `pnpm content:lock on-tap-chuong-3`.
6. Điều phối cập nhật `docs/lessons-learned/` theo mục "Rút kinh nghiệm" của skill, thêm dòng của bài vào bảng "Lỗi Nghiêm trọng ở vòng 1 theo bài", ghi kết quả vào mục "Trạng thái" của tệp này và vào dòng của bài ở `notebooks/backlogs/index.md`.

Reviewer cần soát kỹ riêng ở bài này:

- Đối chiếu từng câu có `bookRef` với `sbt-p61.png`, `sbt-p62.png` (đề) và `sbt-p114.png` (đáp án): chữ, số, lựa chọn, kể cả khoảng trắng lạ (câu 3.42 dùng khoảng trắng không ngắt quanh dấu "·" và ":" cho khỏi xuống dòng giữa phép tính).
- Mỗi câu chấm được đúng một đáp án (hay đúng một tập đáp án khi chọn nhiều); tự giải từng nhiễu; câu 3.46 (bốn dãy), 3.47 (±) và câu hỏi 2 (∈ ∉ với ≤ và <).
- Bảng 3.48 và 3.49: dòng chữ có "?" khớp bảng sách; ô điền đúng thứ tự từ trái sang phải; ngân hàng chữ có nhiễu hợp lý.
- Mẹo: thử lại mỗi mẹo trên ít nhất 5 đầu vào kể cả số biên (điều kiện đã ghi trong lời mẹo: số khác nhau, tích khác 0, khoảng đối xứng quanh 0 không tính hai đầu).
- Các khối chép nguyên từ Bài 13 đến 17: kiểm số trên hình khớp chữ ở đầu và recap (LL-15); câu quy tắc trong `note` có `rule: true` được recap lặp nguyên văn (một section có nhiều quy tắc thì chỉ giữ cờ `rule` ở câu của recap).
- Tổng quan và `sourceRef` (tr.61, tr.62, lời giải tr.114).

## Chạy vòng 2 (phiên mới, không phải phiên đã sửa bài)

Như mục "Chạy vòng 1" (cùng ba nhóm section, 3 Reviewer Opus song song rồi 1 Tổng hợp Opus, theo skill `lesson-review`, vòng 2 vẫn soát toàn bài), thêm:

- Reviewer đọc `review.md` vòng 1 và mục "Đã sửa sau vòng 1": kiểm từng mục đã sửa thật và bản sửa không làm hỏng chỗ khác (LL-20); mục ghi "chưa làm" thì xét lại mức.
- Đề sách: so lại 17 câu có `bookRef` với ảnh (vòng 1 sửa đề 3.45 thêm dấu "." cuối; 3.44b xếp dọc hai dòng bằng `gathered`; 3.42 thêm khoảng trắng không ngắt quanh "=" sau "c" và "d"; 3.48 và 3.49 đổi câu lệnh của app và ngăn ô điền bằng " | "). Câu 3.48, 3.49 dòng 11 ô điền vẫn gãy dòng trên phone, có dấu "|" đầu dòng (do app, xem "Việc còn lại").
- Soát kỹ phần mới: cách đưa thừa số chung ra ngoài sau khi đổi phép trừ thành cộng số đối (section `thua-so-chung-3-43`, `thua-so-chung-3-44`, câu `tru-hai-tich`, `doi-thua-so-6`, `doi-thua-so-4`, lời giải 3.43a/b, 3.44a/b); lời giải 3.43a, 3.48, 3.49 không trùng chuỗi bước của lời giải sách tr.114 (LL-08).
- Câu quy tắc mới có `rule: true` ở `bang-tich`, `bang-tong` ("Nếu ba ô liền nhau luôn có cùng tích khác 0 (cùng tổng), thì hai ô cách nhau hai ô bằng nhau"): không có trong sách như một quy tắc; xét có phải kiến thức ngoài nguồn (LL-09) hay là kết luận suy ra trực tiếp, có nên giữ cờ `rule`, và recap vẫn dùng hình `chia-het-vi-du`, `tong-doi-vi-du` có khớp không (LL-15).
- Góp ý thấy khi xem ảnh walk sau khi sửa: lời giải 3.44b xuống dòng giữa "13" và "· 40" trên phone (có thể dùng khoảng trắng không ngắt).
- Sau vòng hết Nghiêm trọng: lượt Đọc hiểu (Haiku) trên các mục chữ đổi ở `.shots/review/on-tap-chuong-3/doc-hieu-r1-items.txt` (108 mục, tác giả ghi lúc sửa vòng 1; cộng thêm chữ đổi ở vòng 2 lấy từ `pnpm content:diff`), rồi mới `content:hash --approve` và `pnpm content:lock on-tap-chuong-3`.

## Việc còn lại sau review

- Lời đọc tổng quan và video (mục "Trạng thái"), rồi tải media và deploy (cần chủ dự án đồng ý từng bước ngoài máy này).
- Hình bảng ô cho recap `bang-tich`, `bang-tong` (Nên sửa 23 vòng 1, vẫn mở sau vòng 2): recap có câu quy tắc bảng ba ô nhưng còn gắn hình `chia-het-vi-du` (Bài 17) và `tong-doi-vi-du` (Bài 14), không có bảng ô nào. Cần skill `lesson-visual` (sửa `src/visuals/`, đăng ký registry) làm hình một dòng ô đánh số, tô ô 1, ô 4, ô 7 cùng màu; rồi đổi `visualId` của hai recap section và hai card, review phần đổi.
- Hình riêng khác (không chặn): hình nấc 2 cho các câu sách; hình `uoc-chung-vi-du` đang in sẵn ±1, ±2, ±3, ±6 là đáp án 3.47 (Góp ý vòng 2); hình phép tách số cho card `thua-so-chung-3-44`; sticker riêng.
- Sửa app cho `fillBlank` dạng bảng (Nên sửa 24 vòng 1, việc của `src/`): ô đã cho là chữ trơn không khung, dòng 11 ô gãy dòng nên dấu "|" có thể đứng đầu dòng.
- Luật `content:check` hay sửa `key` cho `wrong` trùng chữ (mục "Phát hiện về công cụ").
- Góp ý vòng 2 chưa làm (14 mục trong `review.md` và 5 mục trong `r2-fix-check.md`): tuỳ tác giả; sửa chữ thì đổi hash, cần vòng chỉ phần đổi (Sonnet) và lượt Haiku trên chữ đổi trước khi duyệt lại.
- Bài 13 (`tap-hop-cac-so-nguyen`) đang được một phiên khác sửa (nội dung và hình); bài này dùng 8 hình của Bài 13, nên khi phiên đó commit cần chạy lại `lesson:walk on-tap-chuong-3`.
