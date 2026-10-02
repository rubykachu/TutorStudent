# LL-20 — Bản sửa theo review làm hỏng chỗ khác

## Triệu chứng

Tác giả sửa một mục review nhưng ghi vào nhầm khối (lệch chỉ mục), ghi đè câu đang dạy một ý, hoặc để lời hướng dẫn thao tác ở màn không có thao tác đó. Lỗi mới sinh ra ở vòng sửa, `content:check` không bắt được.

## Ví dụ thật

- `dau-hieu-chia-het` vòng 3, section `chia-het-3`: thêm dòng lý do cho màn chạm `chon-3-1410` (`blocks[3]`) nhưng ghi vào `blocks[2]`, màn hình tĩnh `ba-khac-chin`. Note "Dấu hiệu chia hết cho 3 khác dấu hiệu chia hết cho 9" bị mất, màn tĩnh bảo trẻ "Chạm vào các số", màn chạm thật vẫn thiếu dòng lý do.
- `uoc-chung-uoc-chung-lon-nhat` vòng 2, section `uoc-chung-lon-nhat`: bảng đổi số của vòng 1 đổi màn chạm `chon-uclnn-8-12` sang 20 và 24; tác giả đổi id hình và lời kết `done` nhưng quên note ngay trên, nên note hỏi "8 và 12" còn hình khen "đúng ước chung lớn nhất của 20 và 24" (đáp án cùng là 4 nên walk không bắt). Khi đổi số theo bảng, tìm số cũ trong cả `lesson.json` lẫn `catalog.ts`, không chỉ trong mục có id.
- `so-nguyen-to` vòng 2: review vòng 1 đề xuất thêm 49 vào câu luyện `dh-nhieu` kèm một câu hướng dẫn và hình gợi ý "49 = 7 · 7"; bản sửa giữ 49 nhưng bỏ câu hướng dẫn (chỉ còn câu "chưa chắc là số nguyên tố" trong caption xám) và đổi hình gợi ý sang xếp 21 ô, nên trẻ làm đúng quy tắc vừa học vẫn bị chấm sai. Cùng vòng, bốn câu "Sửa" của chính review vòng 1 sinh lỗi mới: hook 7 viên (chép câu 2.30a), nhãn bảng "không là" (lệch câu quy tắc "không phải"), câu ôn 5 viên (trùng recap), số 43, 47, 83 không có bảng. Không làm được trọn một đề xuất thì bỏ cả đề xuất và ghi lý do, đừng giữ phần khó mà bỏ phần dạy; câu "Sửa" trong review phải qua chính checklist (số sách, câu quy tắc, recap) trước khi ghi.
- `on-tap-chuong-2` vòng 2: bản sửa Góp ý vòng 1 đổi biểu thức của bước `lam-truoc-9-binh` từ `12^{2} : 6 + 2 \cdot 7` sang `9^{2} : 3 + 2 \cdot 5`, đổi lựa chọn và hai lý do nhưng giữ "2 · 7 làm sau luỹ thừa…" dưới lựa chọn "2 · 5". Cùng vòng, câu "Sửa" của Nên sửa 22 vòng 1 (`31\,005:\ ...`) sinh mẫu "số:" đọc thành phép chia ở ba section (LL-21), và câu nối mới ở section `so-mu-uclnn-bcnn` bỏ chữ "chung" (LL-05).
- `boi-chung-boi-chung-nho-nhat` vòng 2: bốn lỗi Nghiêm trọng đều sinh từ bản sửa vòng 1. (1) Câu "Sửa" của review vòng 1 viết lại câu quy tắc section `ucln-hay-bcnn` và mẹo `chon-cong-cu`, bỏ chữ "nhiều phần nhất", "lớn nhất". Câu mới "chia đều không thừa: tìm ƯCLN" thành sai kiến thức và trái câu quy tắc Bài 11. (2) Câu quy tắc section `lap-lai` được tách đôi cho vừa giới hạn độ dài, câu 1 đứng một mình thành khẳng định sai ("Các việc lặp lại… cùng xảy ra một lúc."). (3) Câu "Sửa" vòng 1 thêm note "Hai bánh khớp nhau thì cùng lúc qua cùng một số răng", nhưng giữ màn cùng làm `gap-rang-6-4` hiện "Bánh A đã qua 6 răng, bánh B đã qua 4 răng", hai câu trong một section trái nhau. (4) Thêm tên `\mathrm{BCNN}(12, 18)` vào dòng cuối khối `aligned` của mẹo `chung-rieng`, nên trên điện thoại dòng bị cắt mất "= 36" (walk không đo tràn trong TeX của mẹo). Khi phải tách một câu quy tắc quá dài, đọc riêng từng câu xem câu đó có tự đúng không. Câu "Sửa" viết lại một quy tắc thì đặt cạnh câu quy tắc tương ứng của bài trước. Thêm chữ vào công thức thì chụp lại màn điện thoại.
- `cach-ghi-so-tu-nhien` vòng 2: bản sửa câu quy tắc giá trị bỏ vế "theo hàng nó đứng" (thay danh sách đóng bằng "và cứ thế") mà không làm theo câu "Sửa" đã đề xuất, nên câu còn lại không nói hàng nào nhân với số nào. Năm trong tám lỗi Nghiêm trọng của vòng sinh từ câu "Sửa" của vòng 1: ví dụ XIV, XVI của mẹo mới là số bài 1.19, dòng `gathered` năm vế bị cắt trên điện thoại, nhiễu XIXX cũng bằng 29, "mật mã khoá cặp bé nhất là 102" sai ngoài đời (khoá đặt được 012), câu ôn tổng các chữ số bằng 4 là bài 1.13. Câu "Sửa" của review cần được thử như chữ của bài (số sách, nhiễu, đời sống thật, độ rộng trên điện thoại) trước khi ghi và trước khi chép vào bài.
- `phep-cong-phep-tru-so-nguyen` vòng 2: bản sửa vòng 1 sinh 8 lỗi mới. Nghiêm trọng: hình mới `dung-yen-tai-3` của section `cong-voi-0` (tách ra ở vòng 1) vẽ điểm ở 3 trong khi chữ nói 4; dòng ví dụ `(−3) + (−4) = (−3) − 4 = −7` do câu "Sửa" thêm vào bị cắt mất kết quả trên điện thoại. Nên sửa: câu quy tắc "viết dấu − ở trước" mà 9 lời giải vẫn "đặt dấu −"; câu quy tắc đi trên trục số "của số đó" đọc được là số đầu; nhiễu "cộng với 0" đứng trước bài dạy cộng với 0 sau khi tách section. Cách phòng đã dùng: Tổng hợp tự kiểm câu "Sửa" (âm tiết, số trùng) và đếm mọi chỗ có cùng cụm chữ trước khi đề xuất đổi.
- `quy-tac-dau-ngoac` vòng 2: hai lỗi Nghiêm trọng sinh từ vòng sửa. (1) Câu "Sửa" vòng 1 đề xuất `ex.dien-dau-cong` "35 + (12 − 7) = 35 ☐ 12 ☐ 7", bản sửa gõ " 10." cho đoạn cuối, nên bé điền đúng hai dấu mà nhận đẳng thức sai 40 = 37 (`fillBlank` Toán không có `check`). (2) Chính câu "Sửa" của review vòng 1 cho chuyện nợ phần `ngoac-mot-so`, "Trả nợ xong bạn còn 45 nghìn. Nếu Lan xoá nợ … 45 − (−5) = 50", sai ngoài đời: đã trả rồi thì không còn nợ để xoá. Đổi số trong `segments` thì ghép lại cả câu và tính hai vế; câu "Sửa" kể chuyện đời sống phải đọc lại như một chuyện thật (việc trước có làm việc sau vô nghĩa không).

## Nguyên nhân gốc

Sửa theo đường dẫn JSON (`blocks[n]`) mà không đối chiếu id hình hay ảnh của màn đó; chỉ xem lại mục đã sửa, không xem lại chữ cũ bị thay.

## Cách phòng

- Người: sau khi sửa, chạy `pnpm content:diff` và đọc từng dòng `-` / `+`: chữ bị bỏ có còn nơi nào dạy không, chữ mới có đứng cạnh đúng `visualId` không. Reviewer vòng chỉ phần đổi soát cả chữ bị bỏ, không chỉ chữ mới.
- Máy: chưa có luật. Có thể thêm cảnh báo khi note bắt đầu bằng "Chạm vào" mà `visualId` đi kèm không phải loại tương tác (`INTERACTIVE_KINDS` của bài).

## Trạng thái

Chỉ người soát.
