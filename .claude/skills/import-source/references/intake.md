# Nhận yêu cầu soạn bài

Nguồn duy nhất cho bước nhận yêu cầu, dùng bởi `/import-source` và `lesson-author`. Mỗi mục: điều cần chốt, suy từ đâu, khi nào mới hỏi.

## Cách hỏi

- Suy trước, hỏi sau: lời chủ dự án → tên tệp và mục lục PDF → `docs/learner.md` → bài đã có trong `content/`.
- Chỉ hỏi điều còn thiếu hay có thể đã cũ, bằng tool AskUserQuestion: tối đa 4 câu mỗi lượt (cần hơn thì hỏi nhiều lượt, câu quan trọng trước), mỗi câu 2–4 lựa chọn cụ thể, lựa chọn suy ra được đặt đầu kèm "(Recommended)". Chủ dự án luôn chọn được "Other", nên không thêm lựa chọn "Khác".
- Hồ sơ đã ghi thì hỏi "còn đúng không?" (lựa chọn "Vẫn đúng (Recommended)" / "Đã đổi"), không hỏi lại từ đầu.
- Đề xuất sư phạm của Claude (thêm section kiến thức nền, màn tập viết ký hiệu, đổi thứ tự bài) đưa vào câu hỏi như một lựa chọn "(Recommended)" kèm lý do ngắn, không tự làm mà không hỏi.
- Slug và tên bài lấy từ tiêu đề trên trang (slug không dấu, kebab-case), không hỏi.

## Danh mục

1. **Nguồn.**
   - Đường dẫn PDF (hay ảnh). Không có thì hỏi trước tiên, không đoán.
   - Sách: SGK, sách bài tập (SBT) hay cả hai. Có SBT thì nạp cả trang bài tập lẫn trang đáp án của bài (`--book sbt`, tệp `sbt-p<trang>.png`, `sourceRef` ghi "SBT tr.<n>"); trang đáp án là đáp án chuẩn để đối chiếu.
   - Môn, bộ sách: từ tên tệp (`toan` → `math`, `van`/`ngu-van` → `literature`, `dia`/`lich-su-dia-li` → `geography`; `kntt`/`ket-noi`, `ctst`/`chan-troi`, `cd`/`canh-dieu`), đối chiếu `content/subjects.json`. Bộ sách chưa có ở đó thì thêm lựa chọn "Thêm bộ sách <id> vào `content/subjects.json`". Tập (1 hay 2): từ tên tệp hay bìa.
   - Bài: theo số, tên hay khoảng trang. Mục lục: `pdftotext -f 1 -l 8 <pdf> -`, không thấy "Mục lục" thì đọc 8 trang cuối (`pdfinfo` cho số trang); không có lớp chữ thì `pdftoppm -f 1 -l 8 -r 60 -png <pdf> <scratchpad>/toc` rồi đọc ảnh. Dòng "Bài <n> … <trang>" cho trang đầu; trang cuối = trang đầu bài kế − 1. Số trong mục lục là số trang in.
   - Độ lệch: `--offset` = trang PDF − trang in. Ước từ một trang giữa sách (`pdftotext -f <k> -l <k>`, hay ảnh `pdftoppm` khi không có lớp chữ); kiểm lại bằng ảnh ở "Nạp nguồn". PDF SGK và PDF SBT có độ lệch riêng.
2. **Bài và thứ tự.** Bài nào, bài nào trước: chủ đề trẻ yếu nhất đi trước. Các bài không phụ thuộc nhau làm song song được (mỗi bài một worktree).
3. **Tình trạng người học** (`docs/learner.md`). Đang ở đâu trong chương trình, chủ đề yếu nhất, lỗ hổng cụ thể (vd chưa viết được { }, ∈, ∉; yếu nhân chia), sở thích (thích vừa nghe vừa đọc). Chủ dự án báo đổi thì cập nhật tệp, kèm ngày.
4. **Bắc thang.** Sách quá khó so với trẻ thì dựng từ dễ tới khó. Lỗ hổng rõ thì đề xuất một section kiến thức nền ở đầu bài (term trong glossary có `prerequisite`, `sourceRef` ghi "Kiến thức nền (<cấp>)"). Chỉ đề xuất bài nền riêng khi có trang nguồn để nạp (SGK lớp dưới).
5. **Media.** `overview` luôn soạn (luật ở "Sư phạm" của `lesson-author`). Hỏi: lời đọc tổng quan và 2–3 video cho ý chính làm ngay sau xuất bản hay để sau. Lưu trên máy; tải lên khi go-live.
6. **Ngữ văn.** Nói trước trong bảng kế hoạch: bài dừng chờ chủ dự án duyệt văn bản chép (bước 2 của `lesson-author`).
7. **Xưng hô.** Theo `docs/learner.md` (hiện là "bạn"); không hỏi. Chủ dự án tự nêu muốn "con" thì sửa ở đó.

## Bảng kế hoạch

Trước khi nạp, trình một bảng ngắn. Môn, bộ sách, tập, tệp PDF ghi một lần trên bảng. Mỗi bài một dòng: thứ tự, bài (số, tên), slug, trang in SGK, trang SBT và trang đáp án, song song hay không, media ngay hay để sau, đề xuất thêm. Chủ dự án đồng ý thì nạp nguồn.

## Nạp nguồn

`pnpm sources:import <pdf> --pages X-Y --subject <môn> --series <bộ> --slug <slug> [--book sbt] [--offset <n>]` cho từng bài (và các trang SBT của bài đó). Mở ảnh trang đầu: số trang in trên ảnh khác số trong tên tệp thì cộng phần chênh (số trong tên tệp − số trang in) vào `--offset` rồi chạy lại với `--force`. Thiếu poppler thì lệnh in lệnh cài: đưa cho chủ dự án tự chạy, không tự cài. Ảnh rời: chép vào `sources/<môn>/<slug>/p<trang>.png` (trang SBT: `sbt-p<trang>.png`).
