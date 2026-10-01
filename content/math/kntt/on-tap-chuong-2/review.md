# Review: Ôn tập chương II (`on-tap-chuong-2`)

- Bài: `content/math/kntt/on-tap-chuong-2/lesson.json` (bản commit `d2c0455`)
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`), section: `tong-hop-so`, `bcnn-bai-toan`, `quy-dong`; thêm toàn bộ ảnh phone của section 2 (`dau-hieu-9-5`, chưa có sheet ở vòng 3)
- Nguồn đã đọc: `sources/math/on-tap-chuong-2/` - sbt-p45, sbt-p46, sbt-p110 (từ vòng 3; vòng này không có câu `bookRef` nào đổi chữ)
- `content:check`: 0 lỗi, 0 cảnh báo của bài
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/on-tap-chuong-2/`
- Kết luận: Đã ghi reviewedHash, chờ điều phối `--approve` (0 Nghiêm trọng, 1 Nên sửa)
- Bản đã review: `d7a8228fa0f061e5fe91ea5dfd76f8e227881998392cd0ed67ad04f3806e78d0` (`pnpm content:diff` so với bản này)

Đã soát và đạt:
- Bốn mục của diff đều sửa đúng lỗi vòng 3, không làm hỏng mục khác cùng section:
  - `ex.chon-so-trong-khoang`: ảnh `phone/171-s10-07-...-correct` cho thấy bốn phép cộng, mỗi phép một dòng, không số nào bị cắt; danh sách 20, 38, 56, 74, 92 trong đề và giải thích khớp, `wrong` của 38, 74, 92 đúng, đáp án 56 duy nhất trong khoảng 50 đến 70.
  - `ex.bai-2-56b`: `explain.text` có U+00A0 quanh mọi dấu "·"; ảnh `phone/074-s4-07-...-correct` hai tích `3 · 4 · 5` và `2 020 · 2 021 · 2 022` nằm trọn trên một dòng. Đề (formula) và lựa chọn không đổi, vẫn khớp tr.45; đáp án b khớp tr.110.
  - Ví dụ băng giấy: 5/6 - 3/4 = 10/12 - 9/12 = 1/12 đúng, khớp hình `tru-vi-du` (ảnh `207`, `208`: cùng 5/6, 3/4, 12 là BCNN(4, 6), ra 1/12); 3/4 < 5/6 nên "cắt đi" hợp lý; không có ở Bài 12.
  - Mẹo `bcnn-hai-mau`: ảnh `209` nêu rõ hai mẫu 6 và 15; `tex` không có chữ Việt; `kind` "làm nhanh" đúng. Cặp 6, 15 không trùng số nào trong bài ôn (2.64b dùng 15 và 12).
- Tự tính mẹo `bcnn-hai-mau` ("liệt kê bội của mẫu lớn, số đầu tiên chia hết cho mẫu nhỏ là BCNN"): (6, 15) ra 30; (4, 12) ra 12 và (3, 9) ra 9 và (7, 14) ra 14 (mẫu nhỏ là ước của mẫu lớn); (5, 7) ra 35 và (2, 3) ra 6 (nguyên tố cùng nhau); (6, 6) ra 6 (hai mẫu bằng nhau); (8, 12) ra 24, (4, 6) ra 12, (9, 6) ra 18, (10, 4) ra 20, (1, 7) ra 7, (14, 21) ra 42, (12, 18) ra 36, (9, 15) ra 45. Máy so với công thức a·b/UCLN trên mọi cặp 1..199: trùng hết. Mẹo đúng với mọi đầu vào.
- Câu quy tắc và recap của ba section nguyên vẹn: `tong-hop-so`, `bcnn-bai-toan`, `quy-dong` đều có recap section và recap card lặp lại từng chữ câu `rule`. Các mẹo khác cùng section (`tich-tong-chan`, `nho-cong-so-du`) và bảng mẹo vòng 3 không đổi, vẫn đúng.
- Section 2 trên điện thoại (19 ảnh `-s2-`): không chữ nào bị cắt, dấu chia hết và "không chia hết" đọc rõ, nút và bàn phím không che nội dung, màn recap và màn xong phần đủ; mẹo `chia-het-9` hiện đủ ví dụ.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Ví dụ băng giấy đứng ngay dưới câu "cùng mẫu" nhưng không nói phải quy đồng trước (LL-10, LL-16)

- Vị trí: `$.sections[12].blocks[1].children[0]` và `children[1]` (`on-tap-chuong-2.section.quy-dong`), hình `tru-vi-du` ở `children[2]`
- Nguồn: ảnh walk `phone/207-s13-02-block.png`, `phone/208-s13-02-block-end.png`
- Vấn đề: câu trên nói "hai phân số cùng mẫu thì cộng hoặc trừ hai tử, giữ nguyên mẫu", câu "Ví dụ" ngay dưới là 5/6 - 3/4, hai mẫu khác nhau. Câu ví dụ không nói "quy đồng rồi mới trừ", nên bé chậm có thể áp luôn quy tắc "trừ hai tử, giữ mẫu" cho 5/6 và 3/4 (ra 2/6 hay 2/4). Bước quy đồng chỉ có trong hình, sau khi bấm "Bước tiếp"; bé đọc chữ trước khi bấm.
- Sửa: thêm vào câu ví dụ chữ "quy đồng rồi trừ", vd "Ví dụ: mảnh băng dài năm phần sáu mét, cắt đi ba phần tư mét. Hai mẫu khác nhau, nên quy đồng mẫu số trước rồi mới trừ hai tử; còn một phần mười hai mét."; hay sửa câu đầu thành "Sau khi quy đồng, hai phân số cùng mẫu thì cộng hoặc trừ hai tử, giữ nguyên mẫu."

## Góp ý

Không có. Các góp ý của vòng 3 nằm ngoài diff, giữ nguyên, tuỳ tác giả.

## Cần đối chiếu Bài 12 (`boi-chung-boi-chung-nho-nhat`, còn draft; không tính mức lỗi)

Đã soát toán mọi chỗ BCNN và quy đồng, đều đúng. Khi Bài 12 được duyệt, so lại:

1. Câu quy tắc `$.sections[9].blocks[0]` và recap đã trùng từng chữ câu của Bài 12 (hai vế, có số dư): giữ nếu Bài 12 giữ.
2. Mẹo `tip.nho-cong-so-du` cùng ý với mẹo "Bài toán xếp hàng còn dư" của Bài 12 nhưng khác lời; ví dụ khác nhau (10 + 3, Bài 12: 36 + 1).
3. Mẹo `tip.bcnn-hai-mau` cùng ý mẹo "BCNN của hai số" của Bài 12, khác lời; sau khi Bài 12 xuất bản bé sẽ gặp hai mẹo cùng ý. Ví dụ mới của mẹo (6 và 15, bội 15, 30) trùng đúng cặp và lời giải của câu "BCNN(6, 15) là số nào?" ở Bài 12 (explain "Liệt kê bội của 15 là 15, 30, 45. Số đầu tiên chia hết cho 6 là 30"); khi Bài 12 duyệt, đổi cặp ở một bên.
4. `$.sections[8].blocks[1]` "Bội chung của hai số đều là bội của BCNN của hai số đó." không có nguyên văn trong Bài 12 (Bài 12: nhân BCNN lần lượt với 1, 2, 3); Bài 12 quy ước bội chung chỉ xét khác 0, bài ôn dùng chữ "các bội" không ghi điều kiện đó.
5. Câu BCNN theo số mũ lớn nhất (`$.sections[10].blocks[1].children[0]`) viết "Viết mỗi số", Bài 12 viết "Viết mỗi số lớn hơn 1"; chốt một cách cho cả hai câu và recap.
6. Câu quy đồng (`$.sections[12].blocks[0].children[0]`, recap section, recap card): bài ôn viết "của hai mẫu", "mẫu của từng phân số", "với kết quả"; Bài 12 viết "của hai mẫu số", "mẫu số mỗi phân số", "với thương" (LL-05). Dùng câu Bài 12 khi được duyệt.
7. Câu ƯCLN nhân BCNN trùng Bài 12: giữ nếu Bài 12 giữ.
8. Màu: BCNN `pink` khớp glossary và Bài 12, nhưng `pink` cũng là khái niệm "Hợp số" ở section 3, 4 của bài này; "Quy đồng mẫu số" là `blue` ở bài ôn, `slate` ở Bài 12. Chốt ở cấp glossary.
9. Trùng số với Bài 12: cặp 6, 8 (chips `chon-bc-6-8` so với `xe-6-8`, `bc-6-8` của Bài 12); danh sách bội chung của 6 và 9 (`chon-so-trong-khoang`, `bc-6-9` so với `so-6-9`, `chon-bc-6-9`); cặp 4, 6 (`khoang-bcnn`, `thua-xep`, `tn258-goi-y`, `bc-24-4-6`, `c-12-4-6` so với `chon-bc-4-6`, `so-4-6-xong`); 12 và 18 (`mu-ucln`, `tich-12-18` so với mẹo "ƯCLN và BCNN khi phân tích"); cặp 6, 15 (mẹo `bcnn-hai-mau` so với câu BCNN(6, 15), xem mục 3).
