# Bàn giao: Bài 12 `boi-chung-boi-chung-nho-nhat` (Bội chung. Bội chung nhỏ nhất)

## Trạng thái
- Cập nhật cuối: 01/10/2026. **Đã xuất bản** (`status: published`, id đã khoá, `lesson:walk` 0 FAIL). Lời đọc và 3 video đã dựng (xem mục "Lời đọc và video"), chờ review vòng chỉ phần đổi.
- Review: vòng 1 (8 Nghiêm trọng), vòng 2 (5 Nghiêm trọng, 16 Nên sửa, 20 Góp ý) và vòng 3 chỉ phần đổi (Sonnet, 0 Nghiêm trọng, 2 Nên sửa, 3 Góp ý) đã sửa hết phần Nghiêm trọng và Nên sửa; vòng 3 đã áp luôn 2 Nên sửa và 3 Góp ý. Còn bỏ ngỏ (Góp ý vòng 2, không chặn): 3, 4, 6, 7, 10, 16, 20; việc của app: nhãn ô đếm thiếu đơn vị ("1 chuyến") và phép kiểm `solveMeet` nằm trong `ROUND_RANGE` cho mọi bài dùng `gap-nhau`.
- Việc tiếp theo: review vòng chỉ phần đổi (subagent mới, Sonnet) cho 3 khối `video` và `overview.narration`, rồi `pnpm content:lock boi-chung-boi-chung-nho-nhat` (đang báo 3 id video chưa khoá) và `pnpm lesson:walk`; sửa nội dung bài sau khi xuất bản đổi hash nên cần review lại. Ôn tập chương II (`on-tap-chuong-2`) phải soát lại các câu BCNN theo Bài 12 (cặp số, cách nói quy tắc "nhiều nhất" của ƯCLN, mẹo `chon-cong-cu`).
- Số mới ở vòng 1 cần reviewer vòng 3 soát lại: `chon-bc-4-15-nho-hon-200`, `ba-chu-so-7-9`, `dien-bc-56`, `khong-la-bc-4-9`, `dien-bcnn-28`, `hai-chu-so-8-10`, `tim-loi-bcnn-3-4-8`, `chon-dang-24-40`, `hang-2-3-5-du-1`; hình bánh răng mới `gears.tsx`.

## Lời đọc và video (01/10/2026)
- Giọng bài: `my-duyen` (nữ), khai ở `video/projects/boi-chung-boi-chung-nho-nhat/media.json`. Lý do: Bài 11 (`uoc-chung-uoc-chung-lon-nhat`) là Hải Đăng nên xen sang Mỹ Duyên; bài cũng là mạch kể chuyện (xe buýt, đèn nháy), không có lý do giữ nam.
- Lời đọc giới thiệu: Gemini (giọng Vindemiatrix, `gemini-3.1-flash-tts-preview`), 59,4 giây, 12 câu, mọi câu từ 98,5% trở lên; câu đầu của `overview.hook` đã là "Chào bạn!".
- Video (VieNeu Mỹ Duyên, mỗi video đặt đầu một phần, đã gắn khối `video`):
  - `xe-buyt` (phần `boi-chung`), 54,6 giây, 11 câu, dừng ở 14,2 s và 46,3 s: hai xe buýt 6 và 8 phút, hai hàng bội trên một trục, bội chung 24 và 48 màu lime.
  - `liet-ke` (phần `liet-ke-bcnn`), 71,4 giây, 13 câu, dừng ở 41,1 s và 60,3 s: bội của 9 và 12 trên một trục, BCNN 36 màu pink, rồi cách nhanh chỉ thử bội của số lớn.
  - `phan-tich` (phần `bcnn-phan-tich`), 56,6 giây, 10 câu, dừng ở 18,3 s và 44,1 s: 12 = 2² · 3 và 18 = 2 · 3², khoanh số mũ lớn nhất mỗi cột, BCNN 36.
- Whisper dưới 97% (đều do Whisper nghe chữ cái): `xe-buyt` "Xe B cứ 8 phút có một chuyến." 96,8% (nghe "xe bề"), "Bội chung viết tắt là BC." 95,8% (nghe "mỗi trung"; câu quy tắc giữ nguyên văn nên không đổi chữ).
- Số dùng trong video (9 và 12, 12 và 18, 6 và 8) là ví dụ của hình trong bài; không dùng số của bài tập tự làm (10 và 15, 20 và 30, 4 và 6).
- Chưa chạy `lesson:walk` sau khi gắn video.

## Nguồn (sách bài tập, `sources/math/boi-chung-boi-chung-nho-nhat/`, không commit)
- Đề: tr.41–43 in (PDF 42–44), tệp `sbt-p41.png`, `sbt-p42.png`, `sbt-p43.png`. "Ôn tập chương II" bắt đầu ở tr.44.
- Lời giải: tr.108 (từ giữa trang, bài 2.44–2.48) và tr.109 (bài 2.49–2.55), tệp `sbt-p108.png`, `sbt-p109.png`.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 41-43 (rồi 108-109) --subject math --series kntt --slug boi-chung-boi-chung-nho-nhat --book sbt --offset 1`.
- Chương II "Tính chia hết trong tập hợp các số tự nhiên"; bài in là "Bài 12. Bội chung. Bội chung nhỏ nhất" (`number: 12`, `order: 12`).
- Nội dung nguồn: bội chung (BC), bội chung nhỏ nhất (BCNN), tìm BCNN bằng phân tích ra thừa số nguyên tố (3 bước), tìm BC từ BCNN; kiến thức bổ sung (ƯCLN(a, b) · BCNN(a, b) = a · b, kí hiệu [a, b]); kĩ năng (BC, BCNN của hai hay ba số, quy đồng mẫu số, bài toán BC); ví dụ 1 (cột mốc), ví dụ 2 (số bốn chữ số chia hết cho 3, 4, 5, 8); bài 2.44–2.55.

## Cấu trúc bài
1 `boi-chung` (hai xe buýt, bội chung, số 0); 2 `boi-chung-nho-nhat` (BCNN, kí hiệu, hình tương tác đếm chuyến xe `meetTry`); 3 `liet-ke-bcnn` (bài 2.44, mẹo); 4 `so-lon-chia-het` (bài 2.48a); 5 `uclnn-nhan-bcnn` (kiến thức bổ sung 5, bài 2.51, mẹo); 6 `bcnn-phan-tich` (kiến thức cần nhớ 3, bài 2.46, mẹo); 7 `bcnn-ba-so` (ví dụ 2, bài 2.48b, mẹo); 8 `bc-tu-bcnn` (kiến thức cần nhớ 4, bài 2.47); 9 `lap-lai` (bài 2.49); 10 `banh-rang` (bài 2.55); 11 `so-trong-khoang` (ví dụ 2, bài 2.50, 2.53, 2.54; mẹo); 12 `quy-dong` (bài 2.52, kiến thức nền tiểu học); 13 `uclnn-hay-bcnn` (đối chiếu với Bài 11, mẹo).
- Màu khái niệm: bội chung lime, BCNN pink, số nguyên tố sky, số mũ violet, ƯCLN amber, quy đồng mẫu số blue (glossary: "bội chung" lime, "bội chung nhỏ nhất" pink; thêm "quy đồng mẫu số", "mẫu số chung" với `prerequisite` tiểu học; tên riêng BC, BCNN, B).
- Hình: `src/visuals/math/boi-chung-boi-chung-nho-nhat/` (danh mục `catalog.ts`, mỗi hình một dòng dữ liệu). Loại hình của bài: `bcLists` (danh sách bội, bội chung lime, BCNN pink), `bcnnTable` (bảng thừa số nguyên tố, số mũ lớn nhất), `meetTry` (hình tương tác: bấm + cho từng bên chạy thêm một vòng, báo `{ a, b }`, validator `gap-nhau`), `contrast` (hai thẻ ƯCLN và BCNN cạnh nhau), `sticker`; dùng chung `rows`, `lines`, `chips` ở `src/visuals/shared/`. Bài có `tests/visuals/boi-chung-boi-chung-nho-nhat.test.tsx`.

## Mẹo (6 khối `tip`, đã thử bằng chương trình trước khi viết)
Thử ở máy: 13 cặp số gồm số biên (1 và 1, 6 và 6, 1 và 9, số nguyên tố 97 và 89, 100 và 75), 9 bộ ba, 7 trường hợp xếp hàng còn dư.
- S3 làm nhanh "BCNN của hai số": liệt kê bội của số lớn, số đầu tiên chia hết cho số bé là BCNN.
- S5 làm nhanh "Tìm BCNN từ ƯCLN": tích hai số khác 0 chia cho ƯCLN (đúng cho mọi cặp).
- S6 tránh sai "ƯCLN và BCNN khi phân tích": ƯCLN lấy thừa số chung với số mũ nhỏ nhất, BCNN lấy mọi thừa số với số mũ lớn nhất.
- S7 tránh sai "Kiểm lại kết quả BCNN": BCNN phải chia hết cho từng số và không nhỏ hơn số lớn nhất; chỉ nói kết quả không chia hết là sai, không nói chia hết là đúng.
- S11 tránh sai "Bài toán xếp hàng còn dư": bớt số dư, tìm bội chung, cộng số dư lại (đúng khi mọi hàng cùng dư một số).
- S13 hiểu nhanh "Chọn ƯCLN hay BCNN": kết quả nhỏ hơn hoặc bằng các số đã cho thì ƯCLN, lớn hơn hoặc bằng thì BCNN (đúng vì ƯCLN ≤ số bé nhất và BCNN ≥ số lớn nhất).

## Giả định (không hỏi được chủ dự án)
- Số trong bài tự chọn, không lấy số của đề sách làm đề bài (vài cặp số nhỏ như 8 và 12, 5 và 6 trùng với sách do số nhỏ, nhưng ngữ cảnh và câu hỏi khác).
- Trẻ yếu nhân chia: mở bài bằng hai xe buýt rời bến, mỗi hàng là các bội viết ra từng số (cộng thêm bước cố định), rồi mới tới "chung" và "nhỏ nhất". Quy trình khó dần: liệt kê, số lớn chia hết số bé, phân tích, ba số, rồi các bài toán đời sống.
- Số 0: chỉ nói một lần ở section 1 (0 là bội của mọi số khác 0 nên cũng là bội chung; từ đó chỉ xét bội chung khác 0). Danh sách bội luôn bắt đầu từ bội đầu tiên khác 0.
- Chưa dạy kí hiệu tập hợp để trẻ phải gõ (hồ sơ người học: chưa viết được { }), nên bài 2.44 (viết tập B(8), B(12), BC(8, 12)) chỉ có phần đọc danh sách và chạm chọn; kí hiệu BC(a, b), BCNN(a, b) chỉ để đọc.
- Không làm: kiến thức bổ sung 7 (kí hiệu [a, b]), ví dụ 1 (cột mốc, cần chia dư và đếm khoảng cách; nâng cao), bài 2.45 (điền từ "bội chung", "bội chung nhỏ nhất" vào chỗ chấm với chữ cái a, b: có hai bài điền từ tương đương ở section 1 và 2), bài 2.51 bản đầy đủ (tìm a, b khi biết ƯCLN và BCNN cần chữ cái m, n nguyên tố cùng nhau; section 5 chỉ làm dạng tìm số còn lại), bài 2.53 và 2.54 dạng chữ số abcd (viết bằng "số có ba chữ số nhỏ nhất chia hết cho 8 và 12" ở section 11; bài 2.53 gốc cần 25 và 79 cho số bốn chữ số), bài 2.50 gốc ba số 5, 6, 8 (section 11 dùng 5 và 6).
- Quy đồng mẫu số (bài 2.52) là kiến thức nền tiểu học, có section riêng với `sourceRef` ghi "Kiến thức nền (tiểu học)"; phân số chỉ có tử và mẫu nhỏ, viết bằng khối công thức (lint cấm "số/số" trong chữ).
- Mẹo đặt sau phần dạy cách làm thường và trước câu tự làm; mỗi mẹo có `tex` ví dụ tính.

## Để reviewer soi kĩ
- Đáp án và nhiễu: đáp án các câu `choice` có số đã tính bằng chương trình khi dựng; tập trung vào lời đề (LL-01, LL-10): `chon-cap-bcnn-la-so-lon`, `khong-la-bc-4-6`, `tim-loi-bcnn-4-6-9` (lựa chọn "24 lớn hơn 9" đúng nhưng không phải lý do; đã có lý do ở `wrong`), `chon-dang-24-36` và `chon-bcnn-nhieu` (hai tình huống ƯCLN, hai tình huống BCNN).
- Câu xếp hàng còn dư (`hang-5-6-du-2`, hình `hang-3-4`): viết "mỗi hàng 5 người" để khỏi hiểu thành 5 hàng.
- Các mẹo (xem danh sách thử ở trên), nhất là S7 (chỉ nói điều kiện cần) và S13 (heuristic nhỏ hơn hay lớn hơn).
- `meetTry`: hình tương tác mới ở section 2 (lesson screen) và `gap-4-5-tu-lam`, `gap-rang-6-4`; validator `gap-nhau` chấp nhận mọi vị trí gặp nhau khi `first` = 0, chỉ vị trí đầu tiên khi `first` = 1; khoảng bấm 1 đến 12 vòng.
- Section 12 dùng phân số (tử, mẫu, quy đồng) là kiến thức tiểu học: xem có thuộc phạm vi bài không (LL-09); glossary có `prerequisite` cho hai thuật ngữ.
- Câu `order` (`xep-liet-ke-4-6`, `xep-buoc-phan-tich`) chỉ có một thứ tự đúng; kiểm lại.
- Số bài tập mỗi section: 5 (S6 là 6, vì có 4 câu kho ôn); đủ 3 câu gắn card.

## Ngoài nội dung bài
- `src/visuals/registry.ts`: thêm khối `multipleEntries` và dòng `EXAMPLE_MODULES` của bài (chỉ phần của bài); `tests/visuals/registry.test.tsx`: thêm mẫu cho validator `gap-nhau`.
- `content/glossary/math.json`: thêm 4 thuật ngữ và tên riêng BC, BCNN, B.
- Đề xuất cho chủ dự án (chưa làm, không thuộc phạm vi bài): `numeric.unit` chưa được khai trong `src/content/lint/walk.ts` nên `content:check` báo `[fields]` khi dùng đơn vị cạnh ô nhập; bài này bỏ `unit` và ghi đơn vị trong đề. Hình `Notation`, `ExpTable`, `Ladder` của Bài 11 và `bcnnTable` của bài này cùng ý (bảng thừa số nguyên tố); có thể gom về `shared/` khi cả hai bài đã xuất bản.
