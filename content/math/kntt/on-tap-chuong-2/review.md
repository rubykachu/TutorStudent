# Review: Ôn tập chương II (`on-tap-chuong-2`)

- Bài: `content/math/kntt/on-tap-chuong-2/lesson.json` (bản commit `6576c82`; hình ở `src/visuals/math/on-tap-chuong-2/catalog.ts` cùng bản)
- Vòng: 2 - toàn bài, 3 reviewer song song (section 1-5, 6-10, 11-14) + tổng hợp
- Nguồn đã đọc: `sources/math/on-tap-chuong-2/` - sbt-p44, sbt-p45, sbt-p46, sbt-p110
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa khoá)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/on-tap-chuong-2/`
- Kết luận: Chưa đạt: còn 7 lỗi Nghiêm trọng (đã chạy `pnpm content:hash on-tap-chuong-2 --root content --mark`, bài giữ `draft`)
- Bản đã review: `add2ebc14cb93419ae5a2e65c84d4c84a6e7dab67d7145014af505a31ab25f2d` (`pnpm content:diff` so với bản này)

Đã soát: mọi câu có `bookRef` (câu hỏi 1-6, 2.56-2.64) so với ảnh đề tr.45, tr.46: chữ, số, lựa chọn khớp sách, chỉ khác dấu cuối lựa chọn, nhãn ý và khối lệnh app ở cuối đề. Sách in 2.56 là câu hỏi mở (không có lựa chọn), nên bốn lựa chọn của 2.56a, 2.56b là lời của bài và sửa được. Đáp án mọi câu bằng lời giải tr.110 (tự giải và kiểm bằng script: câu 1-6 C, D, C, D, A, D; 2.56a 2 765 = 5 · 7 · 79; A = 58 735; 2.57 ra 38 và 76; 2.58 chỉ có 245; 2.62 n ∈ {0; 1; 2; 5}; 2.63 chỉ có a = 6, b = 2; 2.60 ra 3⁴ · 5³; 2.64 ra 43/42 và 17/60). Mọi hình nấc 2 (21 hình) dùng số khác đề và giấu dòng cuối thành "?" (chế độ `hint` của `Lines`). Tám mẹo đã thử trên ≥ 5 đầu vào gồm số biên: không mẹo nào sai với đầu vào của chính nó; mẹo "Nhớ cộng lại số dư" sai khi ghép với câu quy tắc cùng section (Nghiêm trọng 5). Các mục vòng 1 đã sửa đúng: Nghiêm trọng 1-8 (Nghiêm trọng 3 nay là hình xét số chia 3); phần lớn Nên sửa và Góp ý (còn sót ghi ở dưới).

Không nhận: Nghiêm trọng "hình nấc 2 của câu hỏi 6 (`tn6-goi-y`) và 2.59d (`tn259d-goi-y`) chỉ thẳng lựa chọn đúng" do reviewer nhóm 2 nêu. Cả hai hình dùng số khác đề (a = 4, b = 10, c = 20; số B) và dừng ở "?" trước kết luận ("20 ⋮ 20", "B ⋮̸ 9" không hiện), đúng luật nấc 2 của checklist ("tách bài toán rồi dừng ở "?" trước kết quả của đề"); luật đó cố định, không ghi phát hiện trái với nó. Cùng kiểu với `tn1-goi-y`, `tn256a-goi-y`, `tn259a-goi-y`..`tn259c-goi-y`, đều đạt.

## Nghiêm trọng

### 1. Nhiễu "chia hết cho 9" của 2.56b cũng đúng với tổng (LL-01)

- Vị trí: `$.exercises[14].options[2]`, `$.exercises[14].explain.wrong[1]` (`on-tap-chuong-2.ex.bai-2-56b`); hình nấc 2 `on-tap-chuong-2.visual.tn256b-goi-y`
- Nguồn: tr.45 (2.56b), tr.110
- Vấn đề: 3 · 4 · 5 + 2 020 · 2 021 · 2 022 = 8 254 653 300 chia hết cho 9 (60 chia 9 dư 6, tích chia 9 dư 3). "Hợp số, vì là tổng của hai số chia hết cho 9" đọc được hai cách: "tổng của (hai số chia hết cho 9)" là sai, nhưng "(tổng của hai số) chia hết cho 9" lại đúng, và tổng lớn hơn 9 nên đúng là hợp số. Vậy có hai lựa chọn đúng theo cách đọc thứ hai; `wrong[1]` chỉ bác cách đọc thứ nhất. Hình gợi ý (xét số chia 3, không có lựa chọn 3) còn dễ đẩy bé sang 9.
- Sửa: đổi số chia của lựa chọn c sang số mà cả số hạng 60 lẫn tổng đều không chia hết, vd 8 (tổng chia 8 dư 4) hay 11 (tổng chia 11 dư 3); `wrong[1]` "3 · 4 · 5 = 60 không chia hết cho 8." Tốt hơn nữa, viết lý do ở cả 2.56a và 2.56b thành "vì cả hai số hạng đều chia hết cho ..." để hết cách đọc thứ hai.

### 2. Ví dụ của mẹo "Loại hợp số nhanh" bị cắt mất số chia trên điện thoại (LL-12)

- Vị trí: `$.sections[2].blocks[3].tex` (`on-tap-chuong-2.tip.loai-hop-so-nhanh`)
- Nguồn: ảnh walk `phone/051-s3-04-block.png` (dòng hai "2 133 : 2 + 1 + 3 + 3 = 9 ⋮", số 3 cuối nằm ngoài khung)
- Vấn đề: ví dụ mới (sửa theo Nên sửa 8 vòng 1) rộng hơn khung 390px. Bé thấy "= 9 ⋮" mà không biết chia hết cho số nào, đúng ở ví dụ của câu "tổng các chữ số chia hết cho 3". Do độ dài nội dung; iPad không bị.
- Sửa: tách dòng (sửa chung với Nghiêm trọng 3): `\begin{gathered} 4\,718 \chiahet 2 \\ 2 + 1 + 3 + 3 = 9 \\ 2\,133 \chiahet 3 \end{gathered}`; chạy lại walk, xem `phone/…-s3-04-block`.

### 3. Dấu ":" sau số trong công thức đọc thành phép chia (LL-21)

- Vị trí: `$.sections[2].blocks[3].tex` (`tip.loai-hop-so-nhanh`, `2\,133:\ ...`); `$.exercises[9].explain.tex` (`ex.tn2`, `461:\ 4 + 6 + 1 = 11 ...`); `$.sections[5].blocks[1].tex` (`tip.chia-het-3`, `1\,836:\ 1 + 8 = 9 \chiahet 3`); hình `on-tap-chuong-2.visual.khoang-bcnn`, `khoang-bcnn-xong` (dòng `30 < n < 50:\ n = 36,\ 48`, ở `$.sections[9].blocks[0]` và `$.sections[9].recap`)
- Nguồn: ảnh walk `phone/094-s6-02-block.png` ("1836 : 1 + 8 = 9 ⋮ 3"), `phone/177-s10-09-recap.png` ("30 < n < 50 : n =" rồi xuống dòng "36, 48")
- Vấn đề: ở lớp 6 ":" là dấu chia, và KaTeX in nó có khoảng trắng hai bên như phép chia; chính các màn cạnh đó dùng ":" để chia (`9 : 3`, `60 : 2`). Bé đọc "1 836 chia 1 cộng 8 bằng 9", "50 chia n", là phép tính sai, đúng chỗ bé yếu (thứ tự phép tính). Mẫu "số:" sinh từ câu "Sửa" của Nên sửa 22 vòng 1. Dòng của hình gợi ý `tn258-goi-y` cũng có mẫu này nhưng là dòng cuối, không bao giờ hiện; vẫn nên sửa theo cho đồng bộ.
- Sửa: tách số và phép tính thành hai dòng, nói chữ số gạch trong `text`: `\begin{gathered} 1\,836 \\ 1 + 8 = 9 \chiahet 3 \end{gathered}` ("Với 1 836, gạch 3 và 6, còn 1 + 8 = 9."); `tn2`: `\begin{gathered} 4 + 6 + 1 = 11 \\ 461 \khongchiahet 3 \end{gathered}`; hình: `30 < n < 50` và `n = 36,\ 48` thành hai dòng (xem thêm Nên sửa 4 về cách viết khoảng). Xem lại sheet điện thoại.

### 4. Lý do sai của bước `lam-truoc-9-binh` còn số của câu cũ "2 · 7" (LL-20)

- Vị trí: `$.exercises[23].explain.wrong[1].text` (`on-tap-chuong-2.ex.lam-truoc-9-binh`, lựa chọn c "2 · 5")
- Nguồn: ảnh walk `phone/114-s7-04-exercise-lam-truoc-9-binh-correct.png`
- Vấn đề: bản sửa đổi biểu thức sang `9^{2} : 3 + 2 \cdot 5` (Góp ý 5 vòng 1) nhưng giữ "2 · 7 làm sau luỹ thừa, trước phép cộng." ngay dưới lựa chọn "2 · 5". Bé chọn nhầm thì được giải thích bằng phép tính không có trong đề; "2 · 7" lại là số của 2.57a ngay sau.
- Sửa: "2 · 5 làm sau luỹ thừa, trước phép cộng." Soát lại mọi "12", "2 · 7", "6 +" còn sót của câu cũ trong `$.exercises[23]`.

### 5. Mẹo "Nhớ cộng lại số dư" không nói cộng lúc nào; cùng section có ba thứ tự làm (LL-24)

- Vị trí: `$.sections[9].blocks[2]` (`on-tap-chuong-2.tip.nho-cong-so-du`); câu quy tắc `$.sections[9].blocks[0].children[0]` và `$.sections[9].recap.caption`; bước `$.exercises[37].prompt[0]` (`ex.chon-bc-60`); `$.exercises[38].explain` (`ex.bai-2-58`)
- Nguồn: tr.110, 2.58 (sách cộng 5 vào từng bội rồi mới chọn số trong khoảng)
- Vấn đề: câu quy tắc (và recap, thứ bé nhớ) nói "tìm BCNN, liệt kê các bội của nó rồi chọn số nằm trong khoảng đề cho"; mẹo chỉ nói "Nhớ cộng lại số dư". Bé làm đúng từng chữ (chọn bội trong khoảng đề cho, rồi cộng dư) sai ở số biên, ngay ở 2.58: bội của 60 trong 200..300 là 240 và 300, cộng 5 được 245 và 305. Bước `chon-bc-60` và `explain` 2.58 lại dùng cách thứ hai (bớt 5 ở hai đầu khoảng: 195..295), sách dùng cách thứ ba (cộng dư trước rồi chọn). Không câu nào nói rõ thứ tự. Đã thử sáu bộ (bảng của nhóm 2): "chọn rồi cộng" sai ở 3/6 bộ, hai cách kia đúng cả 6.
- Sửa: chọn một thứ tự cho cả section và nói thẳng ra. Nên theo sách và Bài 12: cộng số dư vào từng bội chung trước, rồi mới chọn số trong khoảng. Mẹo: "Bội chung tìm được là số đã bớt số dư. Cộng số dư vào từng bội chung trước, rồi mới chọn số nằm trong khoảng." với `tex` có một số bị loại, số khác 2.58 (vd hàng 4, 6 dư 3, từ 100 đến 120: `\begin{gathered} 108 + 3 = 111 \\ 120 + 3 = 123 \end{gathered}`); thêm vế số dư vào câu quy tắc và recap (xem "Cần đối chiếu Bài 12" mục 1); `chon-bc-60` liệt kê 65, 125, 185, 245, 305 rồi hỏi số trong khoảng 200..300; `explain` 2.58 nói cùng thứ tự. Nếu giữ cách bớt dư ở hai đầu khoảng thì mẹo phải nói đúng cách đó.

### 6. Hình mẫu thứ tự phép tính dạy "nhân rồi mới chia" (LL-17)

- Vị trí: hình `on-tap-chuong-2.visual.tinh-vi-du` (`$.sections[6].blocks[0].children[1]`): nhãn dòng 2 "Tính luỹ thừa, rồi nhân", dòng 3 "Chia, rồi cộng"
- Nguồn: Bài 7 (đã xuất bản): nhân, chia cùng bậc, "Chỉ có nhân và chia thì tính từ trái sang phải"; ảnh walk `phone/109-s7-01-block-end.png`
- Vấn đề: hình tính 3² và 5 · 4 trong một dòng, để 9 : 3 lại dòng sau, nhãn đọc thành thứ tự luỹ thừa → nhân → chia → cộng, ngay dưới câu quy tắc "rồi nhân, chia". Bé đọc thành "nhân trước chia", đem sang `12 : 2 · 3` sẽ ra 2 thay vì 18. Kết quả 23 vẫn đúng nên đáp án và walk không bắt được.
- Sửa: `= 9 : 3 + 5 \cdot 4` (nhãn "Tính luỹ thừa"), `= 3 + 20` (nhãn "Nhân, chia"), `= 23` (nhãn "Cộng"). Nhãn dùng `slate` (Nên sửa 1).

### 7. Câu nối ở section 11 bỏ chữ "chung", đọc theo chữ thì ra ƯCLN sai (LL-05)

- Vị trí: `$.sections[10].blocks[2].children[0]` (`on-tap-chuong-2.section.so-mu-uclnn-bcnn`)
- Nguồn: Bài 11, quy tắc "Lấy các thừa số nguyên tố chung của mọi số, mỗi thừa số với số mũ nhỏ nhất…"
- Vấn đề: "Với mỗi thừa số nguyên tố, số mũ nhỏ nhất trong các số là số mũ trong ƯCLN." Với 12 = 2² · 3 và 10 = 2 · 5, bé lớp 6 không nghĩ tới "số mũ 0", nên thừa số 5 (chỉ có ở 10, số mũ 1) bị đưa vào ƯCLN. Câu mới ở vòng 2 (sinh khi sửa Góp ý 22 vòng 1), nói khác hai câu quy tắc ngay trên. Reviewer nhóm 3 xếp Nên sửa; nâng lên Nghiêm trọng vì đây là câu nêu cách làm, đọc đúng chữ thì ra kết quả sai (checklist trục 2: chú thích sai toán học).
- Sửa: "Thừa số nguyên tố có ở mọi số: số mũ nhỏ nhất là số mũ trong ƯCLN. Mọi thừa số nguyên tố: số mũ lớn nhất là số mũ trong BCNN."

## Nên sửa

### 1. Màu khái niệm trên nhãn không phải khái niệm đó, khắp bài (LL-05, LL-20)

- Vị trí: `catalog.ts`. `teal` (khái niệm "Chữ số tận cùng") cho nhãn "chia hết": `tong-12-18`, `tn1-goi-y`, `chia-9-4536` ("18 chia hết cho 9", đứng ngay trước `chia-5-7205` dùng `teal` cho "Chữ số tận cùng là 5"), `tong-hs-vi-du`, `tong-3-so-hang`, `chia-3-216`, `bac-3-9`, `tn259b-goi-y`, `tn259d-goi-y`; cho nhãn kết luận ở `tich-12-18`, `mu-tim-b`, `tn260-goi-y`, `quy-dong-vi-du`, `tru-vi-du`, `giao-hoan-ket-hop`, `tn261-goi-y` (cả bản `-xong`). `violet` (Số mũ) ở `uoc-boi-18-6`, `uoc-cua-8`, `tim-n-8`, `tim-n-8-xong`, `tn262-goi-y`, `uc-8-12`, `uc-bc-6-9`. `amber` (ƯCLN) ở `tinh-vi-du`, `khoang-bcnn`, `tn258-goi-y`. `lime` (Tổng các chữ số) ở `bc-6-9`, `uc-bc-tom-tat`, `khoang-bcnn`, `tn258-goi-y`. `blue` (Quy đồng mẫu số) ở `giao-hoan-ket-hop`, `tn261-goi-y` ("Nhóm hai thừa số").
- Nguồn: `$.concepts`; `docs/design-system.md` (`slate` = trung tính); Nên sửa 12 vòng 1 mới sửa nhãn "không chia hết" và `nt-vi-du`
- Vấn đề: cùng một màu mang hai nghĩa, có chỗ trên hai màn liền nhau (section 2; section 13 rồi 14).
- Sửa: các nhãn trên dùng `slate`; giữ mỗi màu khái niệm cho đúng khái niệm của nó. Màu BCNN `pink` xem "Cần đối chiếu Bài 12".

### 2. Công thức giải thích câu hỏi 1 xuống dòng giữa phép tính trên điện thoại (LL-12)

- Vị trí: `$.exercises[2].explain.tex` (`ex.tn1`)
- Nguồn: ảnh walk `phone/024-s1-07-exercise-tn1-wrong3.png`, `phone/025-s1-07-exercise-tn1-correct.png`
- Vấn đề: ngắt thành "4 ∤ 9, 5 ∤ 9, 4 + 5 =" / "9 ⋮ 9"; sót khi sửa Nên sửa 15 vòng 1.
- Sửa: `\begin{gathered} 4 \khongchiahet 9,\ 5 \khongchiahet 9 \\ 4 + 5 = 9 \chiahet 9 \end{gathered}`.

### 3. Đề 2.56b xuống dòng giữa một tích trên điện thoại (LL-12)

- Vị trí: `$.exercises[14].prompt[1]` (`ex.bai-2-56b`)
- Nguồn: ảnh walk `phone/072-s4-07-exercise-bai-2-56b.png` ("3 · 4 · 5 + 2 020 · 2 021 ·" / "2 022")
- Vấn đề: bé dễ đọc "2 022" là một số hạng riêng, đúng ở câu phải xét từng số hạng. Sửa được trong nội dung mà không đổi chữ, số của sách.
- Sửa: `\begin{gathered} 3 \cdot 4 \cdot 5 \\ +\ 2\,020 \cdot 2\,021 \cdot 2\,022 \end{gathered}`; xem lại ảnh phone.

### 4. Cách viết khoảng "30 < n < 50" lệch "từ ... đến" của đề sách (LL-15)

- Vị trí: hình `khoang-bcnn`, `khoang-bcnn-xong` (cạnh câu quy tắc "khoảng đề cho"); dòng ẩn của `tn258-goi-y` (nhãn "từ 100 đến 120", công thức `100 < n < 120`)
- Nguồn: tr.45, 2.58 ("từ 200 đến 300", tính cả hai đầu; 300 là bội của 60)
- Vấn đề: "<" không tính hai đầu, "từ ... đến" thì có; ở 2.58 số biên quyết định đáp án.
- Sửa: dùng cách nói của sách (nhãn "từ 30 đến 50", hay `30 \le n \le 50` nếu bài đã dạy "≤"); sửa cùng Nghiêm trọng 3 và 5.

### 5. Mẹo "Chia hết cho 3" không nói chỉ dùng cho 3 (LL-24)

- Vị trí: `$.sections[5].blocks[1]` (`tip.chia-het-3`); liên quan `$.exercises[22]` (`ex.bai-2-59d`, lựa chọn b)
- Vấn đề: mẹo đúng với 3 (máy so mọi số 0..1 000 000), nhưng section hỏi cả 9 và mẹo đứng ngay trước màn "chia hết cho 9 thì chia hết cho 3". Gạch 0, 3, 6, 9 rồi xét với 9 thì 31 005 ra "không chia hết cho 9" (sai), 33 ra "chia hết cho 9" (sai).
- Sửa: thêm "Mẹo này chỉ dùng cho 3. Với 9, dùng mẹo chia hết cho 9 (gạch 9 và các cặp có tổng 9)."

### 6. Màn chạm bội chung của 4 và 6 hỏi lại dãy màn trước vừa in (LL-07)

- Vị trí: `$.sections[9].blocks[3]` (hình `chon-bc-4-6`, đáp án 12, 24, 36) sau `$.sections[9].blocks[0]` (`khoang-bcnn` in "12, 24, 36, 48, 60, …")
- Sửa: đổi số màn chạm (vd bội chung của 6 và 8) hoặc đổi ví dụ `khoang-bcnn` sang cặp khác (giữ `thua-xep`, `tn258-goi-y` đồng bộ).

### 7. Câu chuyện của bước `dien-46` không có kết, không nối với câu hỏi (LL-16)

- Vị trí: `$.exercises[24].prompt[0]` (`ex.dien-46`)
- Sửa: "Mẹ xếp đều 46 cái bánh vào 2 đĩa. Số bánh mỗi đĩa là số nguyên tố còn thiếu trong phép phân tích sau." và `explain` nhắc "mỗi đĩa 23 cái".

### 8. Lý do sai của 2.59b có hai câu, câu đầu nói quá (LL-19, LL-20)

- Vị trí: `$.exercises[18].explain.wrong[1]` (`ex.bai-2-59b`, lựa chọn c)
- Vấn đề: bản sửa vòng 1 có hai câu (luật: mỗi `wrong` một câu); "Chia hết cho 2 không liên quan tới chia hết cho 5" nói quá (số tận cùng 0 chia hết cho cả hai).
- Sửa: "Chia hết cho 5 chỉ xét chữ số tận cùng, mà ba số hạng đều tận cùng là 0 hoặc 5 nên tổng chia hết cho 5."

### 9. Ví dụ quy đồng không cho thấy mẫu số chung 12 từ đâu ra (LL-20, LL-15)

- Vị trí: hình `quy-dong-vi-du`, `quy-dong-vi-du-xong` (`$.sections[12].blocks[0].children[1]`, `$.sections[12].recap`), `tru-vi-du`, `tru-vi-du-xong` (`$.sections[12].blocks[1].children[1]`, `$.cards[12].recap`)
- Nguồn: ảnh walk `phone/205-s13-01-block-end.png`
- Vấn đề: commit `6576c82` bỏ nhãn mẫu số chung; hình đi thẳng tới "12 : 4 = 3, 12 : 6 = 2", không còn dòng 12 = BCNN(4, 6), bước đầu của quy tắc ngay trên.
- Sửa: thêm dòng `12` kèm nhãn "BCNN(4, 6)" trước dòng chia ở cả bốn hình.

### 10. Phân số trong các hình ví dụ quy đồng nhỏ dưới 16px (LL-12)

- Vị trí: `quy-dong-vi-du`, `quy-dong-vi-du-xong`, `tru-vi-du`, `tru-vi-du-xong` (`\frac`)
- Nguồn: ảnh `phone/205-s13-01-block-end.png` (chữ số trong phân số cao khoảng 12 CSS px)
- Sửa: đổi `\frac` sang `\dfrac` (Góp ý 18 vòng 1 sót bốn hình này); dòng nhân tràn ở 390px thì tách hai dòng, chạy lại walk.

### 11. Giải thích 2.60 nói "chia từng thừa số cho số đã biết" (LL-10)

- Vị trí: `$.exercises[44].explain.text` (`ex.bai-2-60`)
- Sửa: "Tích hai số bằng ƯCLN nhân BCNN, tức là 2³ · 3⁶ · 5⁴. Chia mỗi luỹ thừa cho luỹ thừa cùng cơ số trong số đã biết: 2³ : 2³ = 1 nên thừa số 2 mất. Số còn lại là 3⁴ · 5³."

### 12. Giải thích 2.63 không nói số mũ 2 và 6 lấy từ đâu

- Vị trí: `$.exercises[41].explain.text` (`ex.bai-2-63`)
- Sửa: "ƯCLN có 2², nên số mũ nhỏ nhất của 3 và b là 2, vậy b = 2. BCNN có 3⁶, nên số mũ lớn nhất của a và 5 là 6, vậy a = 6."

### 13. Hình mẫu `mu-tim-b` có cùng phần tìm b với 2.63 (LL-07)

- Vị trí: hình `mu-tim-b` (`$.sections[10].blocks[2]`), `mu-tim-b-xong` (`$.sections[10].recap`, `$.cards[10].recap`); `$.exercises[41]`
- Vấn đề: hình có `2^{b} \cdot 3`, ƯCLN `2^{2} \cdot 3`, ra b = 2; 2.63 có `2^{b} \cdot 3^{5}`, ƯCLN `2^{2} \cdot 3^{5}`, cũng b = 2, và recap vừa in "b = 2".
- Sửa: đổi ƯCLN của hình thành `2^{1} \cdot 3` hay dùng cơ số khác; giữ khác `tim-b-mu-nho` và `tn263-goi-y`.

### 14. Recap card `tim-so-con-lai` thiếu bước chia (LL-06)

- Vị trí: `$.cards[11].recap.caption`
- Sửa: dùng caption hai câu của `$.sections[11].recap` (như đã làm cho card 10 và 13).

### 15. Section quy đồng không có mẹo dù có mẹo dùng ngay cho 2.64

- Vị trí: `$.sections[12]`
- Vấn đề: mẹo "liệt kê bội của mẫu lớn, số đầu tiên chia hết cho mẫu nhỏ là BCNN" đúng ở mọi cặp đã thử (14 và 21, 15 và 12, 4 và 6, 8 và 12, 10 và 4, 6 và 6, 4 và 12) và nhanh hơn phân tích với mẫu nhỏ.
- Sửa: thêm `tip` "làm nhanh" sau màn quy tắc, lời của bài (khớp ý mẹo BCNN của Bài 12 khi bài đó được duyệt); `tex` dùng số khác 2.64 và không dùng mẫu "số:", vd `\begin{gathered} 8,\ 16,\ 24 \\ 24 \chiahet 6 \end{gathered}`.

### 16. Bốn section cuối không có ví dụ đời sống (LL-16)

- Vị trí: `$.sections[10..13]`
- Sửa: section 13: "Mai ăn 1/4 cái bánh, Lan ăn 1/6 cái bánh. Hai bạn ăn tất cả bao nhiêu phần cái bánh?"; section 14: "7 thùng, mỗi thùng 8 hộp, mỗi hộp 125 viên kẹo" cho `8 · 7 · 125`; section 11, 12: một câu ngắn với 12 và 18, hoặc ghi lý do miễn.

### 17. Chữ xuống dòng ngay trước dấu nhân trên điện thoại (LL-12)

- Vị trí: `$.exercises[52].explain.text`, `$.exercises[52].items[2]` (`ex.bai-2-61`, id `s3`)
- Nguồn: ảnh `phone/229-…-wrong2`, `phone/230-…-wrong3`, `phone/231-…-correct`
- Sửa: dấu cách không ngắt (U+00A0) hai bên "·" và "=" trong `12 345 679 · 9 = 111 111 111`.

## Góp ý

### 1. Câu đầu mẹo "Tìm khẳng định sai" đọc ngắt được thành "chữ luôn, đều là sai" (LL-10)

- Vị trí: `$.sections[0].blocks[3]` (`tip.tim-khang-dinh-sai`)
- Sửa: "Muốn biết khẳng định có chữ “luôn” hay “đều” có sai không, hãy thử vài số nhỏ. Chỉ cần một ví dụ làm nó sai là khẳng định sai."; ví dụ `2 + 4 = 6` trùng hình `tong-2-4-5` màn trước, đổi cặp khác (LL-07).

### 2. "Chia hết cho 3 nên là hợp số" bỏ điều kiện "lớn hơn 3"

- Vị trí: `$.exercises[7].explain.text` (`ex.tong-cs-1143`), `$.exercises[9].explain.wrong[1]` (`ex.tn2`)
- Sửa: "... nên 1 143 chia hết cho 3; 1 143 lớn hơn 3 nên là hợp số."

### 3. Giải thích `tong-119` nói "có thêm ước 7" khó hiểu

- Vị trí: `$.exercises[12].explain.text`
- Sửa: "70 và 49 đều chia hết cho 7 nên 119 chia hết cho 7. Ngoài 1 và 119, số 119 còn có ước 7, nên nó là hợp số."

### 4. Hình gợi ý câu hỏi 5 dùng lại số 4 536 của màn quy tắc và recap (LL-07)

- Vị trí: `tn5-goi-y` (`$.exercises[6].hints.hintVisualId`); trùng `chia-9-4536`, `chia-9-4536-xong`
- Sửa: số khác, vd 5 418.

### 5. Lý do sai d của 2.59a dồn ba chữ "không"

- Vị trí: `$.exercises[17].explain.wrong[2]`
- Sửa: "Tổng có đúng một số hạng không chia hết cho 2, nên A là số lẻ, tận cùng không phải 0."

### 6. Hình recap chỉ minh hoạ một trong hai câu của caption (LL-15)

- Vị trí: `$.sections[1].recap` (`chia-9-4536-xong`, thiếu ý chia hết cho 5), `$.sections[5].recap` (`bac-3-9`, thiếu ý tổng chữ số chia hết cho 3), `$.sections[6].recap` (`phan-tich-60-xong`, thiếu ý thứ tự phép tính)
- Sửa: tuỳ tác giả: hình gộp hai ý (như `uc-bc-tom-tat`), hoặc giữ vì màn quy tắc đã có hình riêng.

### 7. Chữ "sai", "không" in đậm trong đề sách vẫn hiện chữ thường (còn mở từ vòng 1)

- Vị trí: `$.exercises[2].prompt[0]`, `$.exercises[6].prompt[0]`, `$.exercises[10].prompt[0]`, `$.exercises[34].prompt[0]`
- Sửa: dùng kiểu nhấn nếu khung hỗ trợ; nếu không, ghi backlog của app.

### 8. Câu "đừng quên ước 1 cho n = 0" khó hiểu

- Vị trí: `$.sections[7].blocks[3].children[0]`, `$.sections[7].recap.caption`
- Sửa: "Liệt kê các ước rồi trừ 1. Đừng quên ước 1, nó cho n = 0." (sửa cả recap cho khớp).

### 9. Bước `c-12-4-6` không nói 4 và 6 đều không chia hết cho 12

- Vị trí: `$.exercises[33].prompt[0]`
- Sửa: "Cho a = 4, b = 6 và c = 12. 4 và 6 đều không chia hết cho 12. BCNN(4, 6) bằng bao nhiêu, và có chia hết cho 12 không?"

### 10. Nhiễu "Có, vì 9 lớn hơn 3" yếu (LL-14)

- Vị trí: `$.exercises[20].options[1]`, `$.exercises[20].explain.wrong[0]` (`ex.khong-3-thi-9`)
- Sửa: nhiễu theo lỗi thật, vd "Có thể, vì có số chia hết cho 9 mà không chia hết cho 3"; lý do "Mọi số chia hết cho 9 đều chia hết cho 3, nên không có số nào như vậy."

### 11. Đáp án `nhan-12345679-9` nhận ra được mà không cần nhân (LL-14)

- Vị trí: `$.exercises[50]`
- Sửa: tuỳ tác giả: đặt mẹo "Nhân với 111 111 111" sau bước này, hoặc thêm nhiễu không "đẹp" (vd 111 111 011).

### 12. Đáp án đúng của `cach-tim-so-con-lai` là nguyên câu mẹo vừa đọc

- Vị trí: `$.exercises[42].options[0]`; `tip.tim-so-con-lai` (`$.sections[11].blocks[3]`)
- Sửa: tuỳ tác giả: đổi mẹo thành cách làm với luỹ thừa (cộng số mũ của ƯCLN và BCNN, trừ số mũ của số đã biết), đúng chỗ 2.60 cần.

### 13. Đề `bcnn-14-21` nói "các mẫu" mà không có phân số nào (LL-10)

- Vị trí: `$.exercises[45].prompt[0]`
- Sửa: "Hai phân số có mẫu là 14 và 21. Phân tích hai mẫu ra thừa số nguyên tố:".

### 14. Hai dòng phân số trong giải thích `quy-dong-9-14` sát nhau

- Vị trí: `$.exercises[46].explain.tex`; ảnh `phone/211-…-correct.png`
- Sửa: thêm khoảng cách giữa hai dòng (`\\[8pt]`).

### 15. Section 11 có thể có mẹo tránh nhầm nhỏ nhất, lớn nhất

- Vị trí: `$.sections[10]`
- Sửa: tuỳ tác giả: "ƯCLN là số nhỏ nên lấy số mũ nhỏ; BCNN là số lớn nên lấy số mũ lớn" (đúng với mọi cặp).

### 16. Câu "Biết tích và một thừa số…" ghi là của Bài 5, nhưng Bài 5 không có câu này

- Vị trí: `$.sections[11].title`, `$.sections[11].blocks[1].children[0]`
- Sửa: tuỳ tác giả: giữ, hoặc ghi "(như tìm số chia ở Bài 5)".

### 17. `mu-tim-b` viết thừa số 3 không ghi số mũ, trong khi `mu-ucln` ghi 3¹

- Vị trí: hình `mu-tim-b`, `mu-tim-b-xong`
- Sửa: viết `3^{1}` như `mu-ucln` (sửa cùng Nên sửa 13).

## Cần đối chiếu Bài 12 (`boi-chung-boi-chung-nho-nhat`, còn draft; không tính mức lỗi)

Mọi chỗ BCNN và quy đồng đã soát độc lập và đúng toán (BCNN(10, 12, 15) = 60, BCNN(4, 6) = 12, BCNN(6, 9) = 18, BCNN(4, 10) = 20, BCNN(14, 21) = 42, BCNN(12, 15) = 60), trừ thứ tự cộng số dư (Nghiêm trọng 5, tính mức vì sai độc lập với Bài 12). Khi Bài 12 được duyệt, so lại:

1. `$.sections[9].blocks[0]` (`rule`) và recap: Bài 12 draft có câu hai vế "... Nếu đề có số dư, ta cộng số dư vào từng bội trước khi chọn số nằm trong khoảng đề cho."; bài ôn dùng bản một vế. Dùng đúng câu Bài 12 khi được duyệt (cũng là cách sửa Nghiêm trọng 5).
2. `$.sections[9].blocks[1]` và `tip.nho-cong-so-du` khác lời mẹo "Bài toán xếp hàng còn dư" của Bài 12; ví dụ `36 + 1 = 37` của Bài 12 gần trùng `36 + 2 = 38` của bài ôn (LL-07 giữa hai bài).
3. `$.sections[8].blocks[1]` "Bội chung của hai số đều là bội của BCNN của hai số đó." không có trong Bài 12 draft (Bài 12: nhân BCNN lần lượt với 1, 2, 3 …); còn lệch dạng với câu ƯC cùng màn ("hai hay nhiều số" và "hai số").
4. `explain` của `bcnn-10-12-15` trùng câu `rule` BCNN theo số mũ lớn nhất của Bài 12: giữ nếu Bài 12 giữ.
5. `$.sections[10].blocks[1].children[0]` (BCNN theo số mũ lớn nhất) trùng bản commit của Bài 12; bản đang sửa của Bài 12 thêm "lớn hơn 1", còn câu ƯCLN của Bài 11 không có. Chốt một cách viết cho cả hai câu và recap.
6. Câu quy đồng `$.sections[12].blocks[0].children[0]`, `$.sections[12].recap.caption`, `$.cards[12].recap.caption`: Bài 12 đang sửa viết "tử số lẫn mẫu số ... với thương", bài ôn viết "cả tử lẫn mẫu ... với kết quả" (LL-05). Dùng câu Bài 12 khi được duyệt.
7. `$.sections[11].blocks[0].children[0]` "Tích của ƯCLN và BCNN của hai số bằng tích của hai số đó." trùng Bài 12: giữ nếu Bài 12 giữ.
8. Màu: BCNN `pink` (`bc-6-9`, `uc-bc-6-9`, `uc-bc-tom-tat`, `tn6-goi-y`, `khoang-bcnn`, `thua-xep`, `tn258-goi-y`, `tn264a-goi-y`…) khớp glossary và Bài 12, nhưng `pink` cũng là concept "Hợp số" của section 3-4; "Quy đồng mẫu số" là `blue` ở bài này, `slate` ở Bài 12, glossary gán `blue` cho "thừa số". Chốt ở cấp glossary.
9. Mẹo "BCNN của hai số" của Bài 12 dùng được cho 2.64 (Nên sửa 15): khi thêm, cùng ý, không chép nếu Bài 12 đổi câu.
10. Mẹo "ƯCLN và BCNN khi phân tích" của Bài 12 dùng ví dụ 12 và 18, trùng `mu-ucln`, `mu-bcnn`, `tich-12-18` của bài này.
11. Bài 12 dùng nhiều ví dụ bội chung của 4 và 6; section 9, 10 bài ôn cũng dựa trên 4 và 6 (`khoang-bcnn`, `thua-xep`, `chon-bc-4-6`, `tn258-goi-y`, `bc-24-4-6`, `c-12-4-6`): soát trùng số giữa hai bài (LL-07).

## Bảng mẹo (mẹo -> số đã thử -> kết quả)

| Mẹo | Số / trường hợp đã thử | Kết quả |
|---|---|---|
| `tip.tim-khang-dinh-sai` | Câu hỏi 1 (A)-(D) với 0, 2, 9, 10, 18, 27, 99, 2 020 và các cặp 4 + 5, 1 + 8, 2 + 7; câu hỏi 6 (D) với a = 4, b = 6, c = 12 | Đúng: chỉ C (và 6D) có phản ví dụ; câu chữ dễ đọc nhầm (Góp ý 1) |
| `tip.chia-het-9` | 0, 1, 9, 18, 90, 99, 454, 1 234, 2 549, 7 236, 9 459, 23 454, 93 240; máy so mọi số 0..300 000 | Đúng hết |
| `tip.loai-hop-so-nhanh` | 0-5, 6, 9, 10, 15, 25, 49, 77, 91, 461, 499, 1 143, 2 020, 2 133, 2 335, 3 576, 4 718; máy 0..200 000 | Đúng: không số nguyên tố nào bị loại; ví dụ bị cắt và dùng mẫu "số:" (Nghiêm trọng 2, 3) |
| `tip.tich-tong-chan` | 0 · 3, 2 · 1, 10 · 3, 5 · 6 · 7, 3 · 4 · 5, 2 020 · 2 021 · 2 022, 3 · 5 · 7; 0 + 0, 2 + 4 | Đúng |
| `tip.chia-het-3` | 0, 1, 3, 7, 30, 216, 510, 1 836, 3 850, 4 521, 27 220, 31 005, 58 735, 999 999; máy 0..1 000 000 | Đúng với 3; dùng sang 9 sai ở 3, 33, 31 005 (Nên sửa 5) |
| `tip.nho-cong-so-du` cùng câu quy tắc | 2.58 (dư 5, 200..300); hàng 4, 6 dư 1, 37..48; dư 3, 100..120; hàng 2, 3, 5 dư 1, 20..40; dư 5, 60..70; hàng 4, 9 dư 2, 30..40 | "Chọn rồi cộng" sai ở 3/6 bộ (2.58 ra cả 305); "cộng rồi chọn" và "bớt dư ở hai đầu khoảng" đúng cả 6 (Nghiêm trọng 5) |
| `tip.tim-so-con-lai` | (12, 18), (1, 7), (5, 5), (1, 1), (9, 1), (10, 20), (4, 6), (30, 45), (18, 60), (100, 250), 2.60 | Đúng cả 11 cặp; ba số và số 0 đã bị loại bằng điều kiện trong `text` |
| `tip.nhan-111` | a = 0..9 | Đúng với 1..9; a = 0 đã bị loại bằng "từ 1 đến 9" |
