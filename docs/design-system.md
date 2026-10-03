# Design system — Tutor

Nguồn duy nhất cho giao diện. Token định nghĩa ở `src/app/globals.css` (Tailwind v4 `@theme`); component không dùng mã màu hex trực tiếp.

Điều chỉnh so với bộ đề xuất chung cho app giáo dục trẻ em, theo nhu cầu của trẻ thiếu tập trung:
- Giữ: bảng màu "Kids Learning" (xanh học tập), phong cách tối giản, khoảng trắng rộng.
- Bỏ: font Comic Neue (không có bộ ký tự tiếng Việt), màu đỏ cho trạng thái sai, mẫu bố cục landing page/chuyển đổi (không phù hợp app học).
- Thêm: màu khái niệm, trạng thái phản hồi 3 nấc, linh vật.

## 1. Nguyên tắc

1. **Một màn hình, một việc.** Không sidebar, không nhiều cột nội dung cùng lúc khi đang học.
2. **Hình trước, chữ sau.** Chữ giải thích ≤ 2 câu mỗi khối.
3. **Yên tĩnh khi học, vui khi xong.** Hiệu ứng mạnh chỉ ở khoảnh khắc thưởng (xong phần, nhận sticker).
4. **Sai không đáng sợ.** Sai = cam + linh vật gợi ý, không đỏ, không tiếng báo lỗi gắt (chỉ một tiếng sai ngắn, nhỏ hơn giọng).
5. **Màu mang nghĩa, nhưng không chỉ màu.** Mỗi khái niệm có màu + ký hiệu hình (tròn, vuông, tam giác…) để trẻ mù màu vẫn phân biệt.

## 2. Màu

Chỉ giao diện sáng. Mọi cặp chữ/nền đã kiểm tra tương phản WCAG AA (≥ 4.5:1).

### Nền tảng
| Token | Hex | Dùng cho | Tương phản |
|---|---|---|---|
| `--color-background` | `#F8FAFC` | Nền app | — |
| `--color-surface` | `#FFFFFF` | Thẻ, khung bài tập | — |
| `--color-foreground` | `#1E293B` | Chữ chính | 13.98 trên nền |
| `--color-muted` | `#F1F5F9` | Nền phụ, ô chưa chọn | — |
| `--color-muted-foreground` | `#475569` | Chữ phụ | 7.24 trên nền |
| `--color-border` | `#E2E8F0` | Viền | — |
| `--color-primary` | `#2563EB` | Nút chính, liên kết | 5.17 với chữ trắng |
| `--color-ring` | `#2563EB` | Viền focus (2px, offset 2px) | — |

### Màu môn
| Token | Hex | Môn | Tương phản chữ trắng |
|---|---|---|---|
| `--color-subject-math` | `#2563EB` | Toán | 5.17 |
| `--color-subject-literature` | `#B4533F` | Ngữ văn (hồng đất) | 4.94 |
| `--color-subject-geography` | `#0F766E` | Địa lí (xanh ngọc) | 5.47 |
| `--color-subject-amber` | `#8A5A00` | Lịch sử (vàng đất) | 5.93 |
| `--color-subject-violet` | `#6D28D9` | Khoa học tự nhiên (tím) | 7.10 |

Địa lí dùng xanh ngọc thay vì xanh lá để không trùng màu "đúng".

### Phản hồi
| Token | Hex | Dùng cho |
|---|---|---|
| `--color-correct` | `#15803D` | Viền/biểu tượng đúng (5.02 với trắng) |
| `--color-correct-soft` | `#F0FDF4` | Nền ô đúng; chữ trên nền này dùng `#166534` (6.81) |
| `--color-retry` | `#C2410C` | Viền/biểu tượng sai — "thử lại" (5.18 với trắng) |
| `--color-retry-soft` | `#FFF7ED` | Nền ô sai; chữ trên nền này dùng `#9A3412` (6.88) |
| `--color-highlight` | `#FDE68A` | Nền của thứ đang được chọn (câu đang chọn); không dùng cho gợi ý hay lỗi |
| `--color-tip` | `#A16207` | Viền và nhãn của thẻ mẹo (4.92 với chữ trắng); chữ trên nền `--color-tip-soft` (`#FEFCE8`) dùng `--color-tip-soft-foreground` `#713F12` (8.38). Vàng đậm, tách khỏi cam của "thử lại" và vàng sáng của thứ đang chọn |
| `--color-reading` | `#BAE6FD` | Nền của chữ đang được đọc trong lời giới thiệu bài; chữ vẫn `--foreground` |
| `--color-destructive` | `#DC2626` | **Chỉ** thao tác nguy hiểm ở trang phụ huynh/quản trị (thu hồi mã, xoá). Không bao giờ dùng trong giao diện trẻ |

### Màu khái niệm
Gán qua `Concept.color` trong `lesson.json` bằng tên token, không bằng hex. Mỗi màu đi kèm một ký hiệu hình.

| Tên | Hex | Ký hiệu | Ví dụ gán |
|---|---|---|---|
| `blue` | `#2563EB` | ● tròn | Cơ số |
| `violet` | `#7C3AED` | ▲ tam giác | Số mũ |
| `pink` | `#DB2777` | ◆ thoi | Nhân vật chính |
| `amber` | `#B45309` | ■ vuông | Kết quả / giá trị |
| `teal` | `#0F766E` | ⬟ ngũ giác | Địa danh |
| `sky` | `#0369A1` | ✚ chữ thập | Biện pháp tu từ |
| `lime` | `#4D7C0F` | ★ sao | Từ khoá |
| `slate` | `#475569` | ▬ thanh | Phụ, trung tính |

Trong một bài, mỗi khái niệm giữ một màu cho mọi visual, công thức, highlight, thẻ ôn. Ký hiệu trong công thức cũng tô màu, không chỉ chú thích: TeX viết `\concept{blue}{2}^{\concept{violet}{5}}` (tên màu khái niệm, không mã hex); `content:check` báo lỗi nếu màu không thuộc khái niệm nào của bài.

## 3. Chữ

| Vai trò | Font | Cỡ (iPad / điện thoại) | Độ đậm | Line-height |
|---|---|---|---|---|
| Tiêu đề màn hình | Baloo 2 | 32 / 28px | 700 | 1.2 |
| Tiêu đề khối | Baloo 2 | 24 / 22px | 600 | 1.25 |
| Thân | Be Vietnam Pro | 20 / 18px | 400 | 1.6 |
| Văn bản đọc hiểu | Be Vietnam Pro | 21 / 19px | 400 | 1.75, tối đa 60 ký tự/dòng |
| Nút | Be Vietnam Pro | 20 / 18px | 600 | 1 |
| Chú thích | Be Vietnam Pro | 16 / 16px | 400 | 1.5 |
| Công thức | KaTeX | 1.25× chữ thân | — | — |

Cả hai font có bộ ký tự `vietnamese`; nạp qua `next/font/google` với `subsets: ["latin", "vietnamese"]`, `display: "swap"`. Không chữ nào < 16px.

## 4. Khoảng cách, bo góc, bóng

- Thang khoảng cách (density thấp): 8, 12, 16, 24, 32, 48, 64, 96px. Lề màn hình: 24px iPad, 16px điện thoại.
- Khoảng cách giữa hai vùng chạm ≥ 12px.
- Bo góc: 12px (ô nhỏ), 20px (thẻ, nút lớn), 28px (khung bài tập), tròn hoàn toàn (chip, avatar).
- Bóng: một cấp duy nhất `0 2px 8px rgb(15 23 42 / 0.08)` cho thẻ nổi; không bóng lồng nhau.

## 5. Chạm và bố cục

- Vùng chạm ≥ 48×48px; nút chính cao 64px iPad / 56px điện thoại.
- Ngoại lệ vùng chạm của chấm tiến độ (`SectionStepper`): cao 48px, rộng bằng chấm cộng khoảng đệm hai bên vì cả hàng chấm phải vừa một hàng; chỉ chấm của màn đã qua bấm được, có tên ("Lý thuyết 1", "Câu 2") hiện khi rê hoặc focus. Phần có hơn 10 màn (phần bài tập sách bài tập) vẽ chấm nhỏ hơn (`data-dense`) để cả hàng vẫn vừa một hàng.
- Ngoại lệ vùng chạm trong dòng chữ (`tapText`, `PassageReader`): ở chế độ chạm, line-height ≥ 2.3 (dòng ≥ 48px), chạm chọn cả câu, câu đang chọn có nền `--color-highlight`.
- Viewport mục tiêu: iPad dọc 820×1180, ngang 1180×820; điện thoại 390×844. Không cuộn ngang. Tôn trọng `env(safe-area-inset-*)` khi chạy PWA toàn màn hình.
- Nội dung học: một cột, rộng tối đa 720px, căn giữa. iPad ngang: màn học rộng tối đa 960px, bài tập chia hai cột (đề và hình gợi ý bên trái, ô trả lời bên phải) khi khung bài tập rộng từ 50rem, cột đề rộng ít nhất 26rem, khung hẹp hơn thì giữ một cột; đề có đoạn văn đọc hiểu hoặc câu hỏi dài thì giữ một cột, đề trải hết bề ngang phía trên ô trả lời. Cú đậu ở góc trên phải thẻ trả lời ở mọi khổ, không chiếm cột riêng. Visual rộng hơn cột thì tự thu nhỏ vừa cột.
- Nút "Tiếp" / "Kiểm tra" cố định đáy màn hình, trong vùng ngón cái.
- Màn một khối (giải thích, nhắc lại, xong phần, ôn xong): nội dung căn giữa theo chiều dọc giữa đầu màn và thanh nút, không để khoảng trống lớn phía trên nút. iPad dọc (biến thể `tall:` = rộng ≥ 768px và cao ≥ 992px): visual phóng 1.3×, ô môn cao hơn, linh vật màn xong lớn hơn.
- Kéo thả (dnd-kit): có phương án thay thế chạm-để-chọn rồi chạm-để-đặt cho mọi thao tác kéo.
- Không phụ thuộc hover. Mọi phản hồi chạm hiện trong ≤ 100ms (scale 0.97 khi nhấn).

## 6. Chuyển động

| Loại | Thời lượng | Easing |
|---|---|---|
| Phản hồi chạm | 100–150ms | `ease-out` |
| Chuyển khối/màn | 250–300ms | spring (stiffness 300, damping 30) |
| Rung khi sai | 300ms, biên độ 6px, 3 lần | `ease-in-out` |
| Animation giải thích | theo nội dung, trẻ điều khiển được (phát/tạm dừng/tua lại) | — |
| Thưởng (sticker, xong phần) | 600–900ms | spring có nảy nhẹ |

- Chỉ animate `transform` và `opacity`.
- `prefers-reduced-motion: reduce` → bỏ rung, bỏ nảy, chuyển cảnh bằng fade; animation giải thích vẫn chạy nhưng dạng từng bước bấm "Tiếp".
- Không chuyển động nền (nền vũ trụ ở mục 12 đứng yên), không hiệu ứng lặp vô hạn trong lúc học (trừ linh vật chớp mắt ≥ 4 giây/lần, và bạn cú ở trang chủ nhún nhẹ, xem mục Linh vật), và trừ màn thưởng ở mục dưới.

### Màn thưởng lặp hiệu ứng

Màn thưởng (xong phần, nhận sticker, bảng sticker đã nhận) giữ hiệu ứng chạy suốt lúc còn mở, để bé kịp nhìn. Mọi thứ nằm ở `src/components/looping-celebration.tsx`, màn không tự đặt timer:

- `LoopingConfetti`: pháo giấy nổ khi màn mở, rồi nổ lại sau mỗi 2,5–4 giây (`useCelebrationBeat`, khoảng nghỉ lấy từ số lượt nên lặp lại được), mỗi lượt đổi vị trí và màu (`variant` của `ConfettiBurst`). Mỗi lúc chỉ một đợt (28 mảnh, lượt mới thay lượt cũ), chỉ `transform` và `opacity`, `pointer-events: none`, ngừng khi màn đóng. Dùng ở màn xong phần (`DoneScreen` với `celebrate`), màn nhận sticker (`StickerEarnedCelebration`) và bảng sticker đã nhận.
- `LoopingMotion`: bao một hình để nó nảy nhẹ (`bounce`) hoặc đung đưa (`float`) mãi. Dùng cho sticker ở màn nhận sticker (nảy) và bảng chi tiết sticker (nảy khi đã nhận, đung đưa khi chưa).
- Âm thanh không lặp theo hiệu ứng: tiếng chúc mừng vẫn phát đúng một lần (`usePlayOnce`).
- Giảm chuyển động: không có vòng lặp nào. Pháo giấy, nảy và đung đưa tắt, nên màn đứng yên. `pnpm lesson:walk` chạy với giảm chuyển động nên ảnh chụp là khung tĩnh.

## 7. Phản hồi bài tập (3 nấc)

| Trạng thái | Viền | Nền | Linh vật | Âm thanh |
|---|---|---|---|---|
| Chưa trả lời | `--color-border` 2px | `--color-surface` | — | — |
| Đã chọn | `--color-primary` 3px | `--color-surface` | — | — |
| Đúng | `--color-correct` 3px + dấu ✓ + pháo giấy ~1 giây (bỏ khi giảm chuyển động) | `--color-correct-soft` | vui, bong bóng khen | tiếng đúng ngắn (`correct-jingle`) rồi cú đọc lời khen, mọi lần đúng |
| Sai lần 1 | `--color-retry` 3px nét đứt + rung | `--color-retry-soft` | cổ vũ, bong bóng động viên | cú đọc câu động viên |
| Sai lần 2 | như lần 1 | như lần 1 | gợi ý, chỉ vào visual gợi ý | tiếng sai nhẹ rồi cú đọc câu gợi ý |
| Sai lần 3 | như lần 1 | như lần 1 | cổ vũ, visual lời giải chạy | tiếng sai nhẹ rồi cú đọc câu lời giải |

Nấc 1 không tô vàng; chữ duy nhất là câu động viên trong bong bóng của cú: thẻ trả lời rung và có viền cam nét đứt; phần trả lời sai có viền cam nét đứt (vùng chạm: vòng cam nét đứt). Gợi ý tác giả trỏ vào đề (khối, phần công thức, câu) và phím "mũ" được viền/gạch chân bằng màu khái niệm của đích gợi ý, không có khái niệm thì `--color-concept-slate`. Nấc 2 khi không có visual gợi ý: cùng viền đó, dày hơn. `--color-highlight` chỉ dành cho trạng thái đang chọn.

Ô bé chọn mà sai ở nấc 1-3 giữ nguyên là đã chọn (dấu chọn còn) nhưng viền `--color-retry` nét đứt (`WRONG_PICK_TONE`); đáp án của bé không bao giờ bị máy bỏ chọn hay sửa. Chip của màn lý thuyết "cùng làm" (`Chips` có `wants`): đúng thì chip `--color-correct` nền đặc kèm dấu ✓, sai thì nền `--color-retry-soft`, viền cam nét đứt; nút phụ "Xem cách làm" (viền `--color-border`, biểu tượng mắt) nằm trong thanh dưới bên trái "Tiếp" (đang tắt) khi chưa xong, cùng cách xếp với nút "Bỏ qua" của bài tập.

Sau khi đúng, thanh dưới có hai nút chia đôi: "Làm lại" (phụ, bên trái) và "Tiếp" (chính, bên phải).

**Ô môn khoá và màn "Chọn lớp":** môn chưa có bài xuất bản trong lớp là ô khoá: nền `--color-surface`, viền `--color-border` 2px, biểu tượng môn tô màu môn trên vòng `--color-muted`, ổ khoá trên vòng `--color-muted` ở chỗ vòng tiến độ, dòng "Sắp ra mắt"; không có cảnh vũ trụ, không bấm được. Nút "Lớp n" (huy hiệu viền `--color-border`, nền `--color-surface`, cao ≥ 48px) nằm dưới lời chào ở trang chủ. Màn `/grades`: lưới 3 cột trên điện thoại, 4 cột từ máy tính bảng, mỗi ô một icon vũ trụ, số lớp to (Baloo) và, nếu khoá, ổ khoá ở góc trên phải kèm "Sắp ra mắt" (một dòng). Lớp mở: nền `--color-primary`, chữ trắng; lớp đang học có dấu ✓ ở góc và vòng `--color-ring`. Ô "Bạn học lớp mấy?" trong form hồ sơ: 12 ô số, lớp khoá nét đứt, mờ, có ổ khoá nhỏ.

Khi khung "Giải thích" hiện, trang được kéo lên đủ để cả khung nằm trên thanh dưới nhưng đỉnh khung còn cách mép trên 16px (khung cao hơn màn hình thì hiện từ đầu), và theo dõi 1,5 giây đầu khi hình lời giải nở ra.

**Khung "Giải thích"** (`ExplanationPanel`): hiện ngay dưới thẻ trả lời mỗi khi đáp án đã lộ (đúng, sau lần sai thứ 3, sau "Bỏ qua", xem lại câu đã xong), nằm trong luồng trang, trên thanh nút cố định để "Tiếp" luôn bấm được. Thẻ nền `--color-surface`, viền `--color-primary` mờ 3px, tiêu đề "Giải thích" (Baloo, `--color-primary`, biểu tượng bóng đèn); đã có `explain` thì hiện chữ, công thức và hình, `wrong` thành các dòng "phương án — lý do" (phương án tô nền `--color-retry-soft`, chữ `--color-retry-soft-foreground`, không đỏ); chưa có thì tiêu đề "Lời giải" với hình lời giải và dòng "Đáp án". Chữ tối đa 3 câu, vì vậy không cuộn dài. Sau "Bỏ qua" cú im lặng.

### Âm thanh

- Mọi lần kiểm đều có tiếng (bảng trên); mọi câu trong bong bóng đều có giọng đọc, đúng câu đang hiện. Không có bong bóng nào im lặng.
- Một giọng cho mọi câu của cú, mọi file cùng độ lớn (giọng −16 LUFS; tiếng sai nhỏ hơn giọng 4 LU, nhạc ở bảng sticker nhỏ hơn 6 LU) và không vỡ tiếng (đỉnh < −1 dBFS). Thông số ở `scripts/lib/sound-spec.ts`.
- Không đọc chữ bằng giọng máy của trình duyệt.
- Hai tiếng chạm, khác nhau: chọn đáp án, thẻ, vùng là tiếng click gỗ sáng (`tap`); mọi nút và liên kết khác trên màn của bé (Kiểm tra, Bỏ qua, Quay lại, nút về, ô môn, liên kết quay lại trang bài) là một nốt tròn, mềm, nhỏ hơn (`button`: một nốt sin D5 vào êm, trượt cao độ nhẹ rồi tắt dần, không có mép cắt). Tiếng nút do `ButtonSounds` (`src/lib/feedback-sounds.tsx`) phát cho mọi nút bên dưới nó, nên nút mới tự có tiếng; vùng tự lo tiếng (đáp án, hình tương tác, công tắc loa, sticker) gắn `data-own-sound`. Mọi màn của bé (kể cả màn xong phần) nằm dưới `ButtonSounds`. Tiếng nút phát ngay trong lượt chạm và không bị cắt khi màn kế tiếp mở: clip ngắn chỉ được tải và giải mã một lần (xem "Cách phát" bên dưới), màn mới khai báo lại thì không làm gì. Trang phụ huynh và trang chọn hồ sơ không có tiếng nút (trang chọn hồ sơ chỉ có nhạc nền).
- Âm thanh nhập từ file ngoài (loại `file` của `pnpm sounds:build`): nguồn nằm ở `assets/sounds/` (có trong git để build lặp lại được), cắt khoảng lặng đầu, chuẩn hoá độ lớn như mọi clip và ghi sha256 vào `manifest.json`. Gồm tiếng đúng (`correct-jingle`, tiếng chuông ngắn tải từ Pixabay, −16 LUFS), hai tiếng ăn mừng sticker (`win-victory`, `win-winning`), nhạc nền (`BACKGROUND_MUSIC_IDS`), tiếng sai (`wrong-answer`; vẫn 3 nấc: nấc 1 chỉ có giọng cú, nấc 2 và 3 có tiếng sai rồi giọng), tiếng xong phần (`lesson-end`), tiếng tạm biệt (`leave`) và các bài nhạc ở bảng sticker (`SONGS`).
- Xong phần (`SectionDone` trong `src/learn/section-player.tsx`): phát `lesson-end` một lần. Hai tiếng ăn mừng không bao giờ chồng nhau: ở màn nhận sticker (xong cả bài, `StickerEarnedCelebration`) pháo giấy đi cùng một tiếng ăn mừng chọn ngẫu nhiên trong hai (`pickCelebration`) rồi cú đọc "Chúc mừng bạn! Bạn vừa nhận được một sticker mới!" (`sticker-earned`) nối tiếp bằng `playSequence`; tiếng nhạc vui "đúng" không phát ở đây. Âm thanh chỉ một lần, theo công tắc âm thanh; pháo giấy nổ lặp suốt lúc màn mở (xem "Màn thưởng lặp hiệu ứng"), bỏ khi giảm chuyển động. Mở lại sticker đã nhận ở hàng danh hiệu trang chủ: pháo giấy trên bảng chi tiết và một tiếng ăn mừng ngẫu nhiên, không có lời chúc mừng; nhạc nền nhỏ lại trong lúc đó.
- Nút × (thoát phần hoặc ôn) phát `leave` thay cho tiếng nút (`data-own-sound` + `FeedbackSounds.leave`, chạy qua `playSequence` nên dừng giọng cú đang đọc). Âm thanh sống ở module `src/lib/sound.ts`, không thuộc màn nào, nên vẫn phát hết sau khi màn kế tiếp mở.
- Cách phát (`src/lib/sound.ts`, một nguồn): không bao giờ chờ âm thanh để làm việc khác. Trình xử lý chạm không `await` tiếng; điều hướng và đổi giao diện diễn ra ngay, tiếng đã bắt đầu thì tự phát tiếp hoặc bị dừng, không ai đợi nó.
  - Clip ngắn (mọi clip trừ nhạc: chạm, nút, tiếng đúng/sai, giọng cú, tiếng avatar, ăn mừng, tạm biệt) tải và giải mã một lần thành `AudioBuffer` sau lần chạm đầu tiên (chạm và nút trước), qua một `AudioContext` dùng chung được mở khoá ở lần chạm đầu; phát bằng `AudioBufferSourceNode` rồi bỏ đó. Tổng dung lượng đã giải mã không quá `MAX_DECODED_BYTES` (16 MiB, hiện khoảng 10 MiB); clip vượt trần hoặc giải mã lỗi phát qua thẻ audio dùng chung.
  - Nhạc và mọi clip ngoài danh sách trên phát qua một thẻ `audio` dùng chung duy nhất (đổi `src`, không tạo thẻ mới mỗi lần chạm).
  - Trang chuyển nền (`visibilitychange` → ẩn): mọi tiếng dừng, `AudioContext` tạm ngưng; lần chạm kế tiếp mở lại. Một tiếng phải chờ mở lại quá 1,5 giây thì bỏ, không phát trễ.
  - `navigator.audioSession.type = "playback"` giữ tiếng khi gạt công tắc im lặng, cho cả Web Audio lẫn thẻ audio (Safari 17+).
  - Tệp `/sounds/*` có hash của clip trong query (`?v=`) nên được lưu một năm (`next.config.ts`); `/content/*.json` lưu 60 giây rồi kiểm lại ngầm.
- Nhạc nền (`src/music/background-music.ts`): chỉ ở màn ngoài (trang chủ, danh sách bài của môn, danh sách phần của trang bài, chọn lớp, chọn hồ sơ); im ở lý thuyết, bài tập, ôn, video, phần giới thiệu bài có lời đọc và trang phụ huynh. Ba bài phát lần lượt theo thứ tự xáo, hết bài này sang bài kia, chuyển chồng 1,5 giây, không bao giờ một bài hai lần liền; nhớ chỗ đang phát khi đi giữa các màn ngoài trong một phiên. Vào sau lần chạm đầu tiên (iOS), lên dần 1 giây, tắt dần 0,5 giây khi vào màn học hoặc khi lời đọc, video hay bài nhạc ở bảng sticker bắt đầu; nhỏ lại khi tiếng ăn mừng phát. Độ lớn −26 LUFS, khoảng 30% biên độ của tiếng giao diện. Chỉ phát qua Web Audio (không có điều khiển Now Playing trên iPhone); trang chuyển nền thì dừng, quay lại màn ngoài thì phát tiếp. Theo công tắc âm thanh của bé: bé tắt âm thanh thì nhạc nền cũng tắt.
- Công tắc nhạc nền: nút nốt nhạc tròn 48px (`Music`, gạch chéo khi tắt) ngay trước nút loa ở trang chủ (`MusicToggle`), và khung "Nhạc nền" ở trang phụ huynh; một setting của máy (`BACKGROUND_MUSIC_KEY`, không đồng bộ), mặc định bật.
- Công tắc âm thanh: nút loa tròn 48px (`Volume2`/`VolumeX`, màu `--color-muted-foreground`), luôn ở đầu phải hàng trên cùng của màn hình; một setting cho mỗi con. Bật lại thì phát tiếng đúng để xác nhận.

## 8. Linh vật

- Một bạn cú, vẽ SVG phẳng, 2–3 màu từ bảng màu, nét tròn, mắt to.
- Biểu cảm: `happy`, `hint`, `cheer`, `welcome` (vui khi gặp lại sau nhiều ngày không học — không trách), `idle`.
- Kích thước: 96px trên trang chủ; cạnh bài tập 72px trên iPad dọc, 56px đậu ở góc trên phải thẻ trả lời trên điện thoại và iPad ngang (không chiếm hàng riêng, không nhận chạm). Không che nội dung bài.
- Biểu cảm đổi bằng Motion (xoay đầu, chớp mắt, vỗ cánh ≤ 600ms).
- Chỉ cú ở trang chủ (`loop` của `Owl`) có nhịp chờ lặp mãi, rất nhẹ: nhún lên 3 đơn vị mỗi 3,2 giây và nghiêng ±1,5° mỗi 6,4 giây, chỉ `transform`; giảm chuyển động thì không có. Chạm vào cú: cú vỗ cánh (`cheer`, 1,2 giây) và phát tiếng "Cú cú!" (`owl-tap`, `OWL_TAP_LINE` trong `src/mascot/lines.ts`); tắt âm thanh thì cú vẫn phản ứng nhưng im lặng. Nút chạm có `data-own-sound` nên không có tiếng nút chồng lên.
- Bong bóng lời cạnh bài tập: một câu ngắn (≤ 10 chữ) ở cả ba nấc và khi đúng (câu động viên và lời khen chọn cố định theo lượt làm), luôn kèm giọng đọc. Chữ ≥ 18px, nằm một hàng riêng phía trên thẻ trả lời, bên trái đầu cú, không che câu trả lời hay nút; vùng đọc cho trình đọc màn hình đọc đúng câu đó. Mọi câu nằm ở `src/mascot/lines.ts`.
- Màu: `--color-mascot-body` `#C08457` (thân), `--color-mascot-shade` `#94603A` (tai, cánh), `--color-mascot-belly` `#FDF0DC` (mặt, bụng), `--color-mascot-beak` `#F59E0B` (mỏ, chân, lấp lánh). Chỉ trang trí, không mang chữ.
- Trang chủ: `welcome` khi lần học cuối cách hôm nay ≥ 3 ngày; `happy` khi hôm nay đã học; còn lại `idle`.
- Màu `--color-streak` `#EA8A0C` và `--color-streak-soft` `#FFF4E0` (lửa, chuỗi ngày) chỉ còn ở trang phụ huynh và khung nhắc ở phần giới thiệu bài; trang chủ của bé không còn chip chuỗi ngày.
- Trang chủ: avatar bé chọn hiện cạnh "Chào <tên>!" và trong nút "Đổi hồ sơ". Chạm vào avatar cạnh lời chào thì phát tiếng riêng của avatar đó; nút "Đổi hồ sơ" chỉ còn avatar (tên nút vẫn có cho trình đọc màn hình) ở điện thoại để "Chào <tên>!" nằm một dòng, từ 640px thì có chữ. Bạn cú vẫn là linh vật ở mọi nơi khác; ở trang chủ cú cao 80px (`MASCOT_SIZES.home`), một hàng với câu nói, không còn chip nào bên cạnh (hộp nhạc đã bỏ).
- Màn chọn hồ sơ: mỗi bé là một thẻ (`PanelArt` nền) gồm nút lớn avatar + tên để chọn, và dưới nó nút nhỏ "Sửa" (biểu tượng bút chì, chữ phụ `--color-muted-foreground`, cao 48px) mở form sửa. Hai nút là anh em trong thẻ, không lồng nhau; "Sửa" lấy tên bé làm mô tả (`aria-describedby`) nên nút chọn vẫn giữ tên bé làm tên. Form sửa là form tạo hồ sơ, tiêu đề "Sửa hồ sơ", nút "Lưu", "Quay lại" ở dưới.

## 9. Component chính

| Component | Mô tả |
|---|---|
| `BigButton` | Nút chính, cao 64/56px, bo 20px, chữ 20/18px đậm 600, có trạng thái nhấn và disabled rõ ràng; biến thể `secondary` viền xám, `destructive` nền đỏ chỉ ở trang phụ huynh |
| `SubjectTile` | Ô môn trên trang chủ: màu môn, biểu tượng SVG (Lucide), tiến độ dạng vòng, luôn có dòng phụ (trạng thái môn), nhắc "n ngày chưa học"; trên iPad ba ô dùng chung hàng lưới (subgrid) để tên môn thẳng hàng |
| `ReviewButton` | Nút "Ôn bài này" trong trang bài, kèm nhãn nhỏ "n thẻ sắp quên" khi có |
| `SectionStepper` | Chấm tiến độ các khối trong một phần (không số, không phần trăm); chấm của màn đã qua bấm được, có tên |
| `ScreenBadge` | Nhãn loại màn ở đầu mỗi màn của player: Lý thuyết (xanh), Bài tập (vàng), Ôn tập (tím) |
| `StickerSheet` | Bảng chi tiết một sticker: hình (bóng xám nếu chưa nhận), tên, bài, tiến độ, cách nhận, nút mở bài |
| `TipCard` | Thẻ mẹo (`src/components/blocks/tip-card.tsx`): viền 3px `--color-tip`, nền `--color-tip-soft`, nhãn tròn đặc "Mẹo làm nhanh" (tia chớp) / "Mẹo hiểu nhanh" (bóng đèn) / "Mẹo tránh sai" (khiên) — loại mẹo luôn có cả chữ lẫn biểu tượng —, tên dạng bài in đậm (Baloo), câu mẹo, công thức trong ô trắng, hình trong ô trắng. Là một màn của player (không bọc thêm thẻ) và là mỗi thẻ ở trang "Mẹo hay" |
| `ExplanationPanel` | Khung "Giải thích" / "Lời giải" dưới câu đã trả lời, xem mục 7 |
| `VideoPlayer` caption | Phụ đề karaoke: dưới 768 px một dải `min-h-16` nền `--color-foreground` ngay dưới hình, trong khung video; từ 768 px đè đáy hình trên nền mờ 85%, cao hơn thanh điều khiển gốc khi đã phát. Video không tự dừng, không có lớp phủ |
| `ExerciseFrame` | Khung chung cho 8 dạng bài: đề, vùng trả lời, nút "Kiểm tra", vùng gợi ý, trạng thái 3 nấc |
| `NumberPad` | Khối số 3 cột (phím 0 trải ngang hàng cuối) + cột phụ Xoá / "mũ" / "," — phím "," chỉ hiện khi đáp án có số thập phân; phím 64px (60px ở iPad ngang). Khi nấc 2/3 có hình, bàn phím tạm ẩn để hình vào đúng chỗ, chạm ô đáp số để mở lại |
| `PassageReader` | Hiển thị văn bản đọc hiểu, chạm từng câu để chọn, ghi chú "Theo dõi" dạng thẻ nhỏ bên lề (iPad) hoặc dưới đoạn (điện thoại) |
| `ConceptChip` | Chip màu khái niệm + ký hiệu hình |
| `StickerShelf` | Lưới danh hiệu đầu trang chủ (hai hàng) và bộ sưu tập đủ sticker (bảng `Sheet`), xem mục Danh hiệu trên trang chủ |
| `PanelArt`, `SubjectTileArt`, `CosmosHorizon` | Nền vũ trụ trên thẻ, bảng, ô môn và cuối trang, xem mục Nền vũ trụ |
| `Avatar` | Hình SVG phẳng trên đĩa nền nhạt: mặt thú (mèo, gấu, thỏ, cáo, gấu trúc, gà con), người nhện (mặt nạ đỏ có mạng nhện, mắt trắng viền đen, áo xanh; thiết kế riêng, không chép logo) và xe đua (nhìn ngang, thân đỏ, cánh gió, vạch trắng). Màu lấy từ token `--color-avatar-*`, chỉ để trang trí, không mang chữ. Hiện ở chọn/tạo/sửa hồ sơ (tiêu đề "Chọn hình đại diện"), cạnh lời chào và trong nút "Đổi hồ sơ" trên trang chủ. Mỗi avatar có một tiếng ngắn riêng, phát khi chọn trong form (mỗi lần chạm, kể cả chọn lại) và khi chạm avatar ở trang chủ; bảng id avatar → id tiếng chỉ ở `AVATAR_CLIP_IDS` (`src/lib/sound-manifest.ts`), công tắc âm thanh của bé được tôn trọng (form tạo hồ sơ chưa có bé nên mặc định bật) |
| `Sheet` | Khung bảng trượt lên (điện thoại) hoặc giữa màn (máy tính bảng): nền mờ, đóng bằng chạm ngoài, Escape và nút "Đóng" |
| `SectionCardArt`, `LessonCardArt` | Bầu trời riêng của thẻ phần (trang bài) và thẻ bài (trang môn), xem mục Nền vũ trụ |

Biểu tượng: Lucide (SVG). Không dùng emoji làm biểu tượng giao diện.

### Trang phụ huynh (`src/components/parent/`)

- Người đọc là phụ huynh trên điện thoại: giọng bình tĩnh, câu ngắn, xưng "bạn" với phụ huynh, gọi trẻ là "con". Vẫn thuần tiếng Việt, cùng token chữ và vùng chạm như giao diện trẻ.
- Lối vào: liên kết chữ nhỏ, màu phụ "Phụ huynh" ở cuối màn chọn hồ sơ; không nổi bật để trẻ không tò mò bấm.
- Mỗi mục là một thẻ `bg-surface shadow-card` có tiêu đề khối và một dòng chú thích giải thích số liệu. Nhiều con → thanh chọn dạng segmented (avatar + tên).
- Biểu đồ chỉ là cột bằng `div` (không thư viện biểu đồ); cột hôm nay `--color-primary`, ngày khác `primary/40`; mỗi cột có chữ số phút và nhãn cho trình đọc màn hình.
- Được phép hiện phần trăm "còn nhớ khoảng n%" (chỉ ở trang phụ huynh, không bao giờ ở giao diện trẻ). Nhập sai PIN báo bằng chữ `--color-retry-soft-foreground`, không đỏ. `--color-destructive` chỉ cho thao tác xoá/thu hồi: nút chữ đỏ "Học lại bài này" ở mỗi bài và `BigButton` `variant="destructive"` (nền đỏ, chữ trắng) trong bảng `Sheet` hai bước xác nhận của nó (`reset-lesson-dialog.tsx`).

## 10. Không làm

- Màu đỏ, dấu ✗ lớn, chữ "Sai rồi!" trong giao diện trẻ.
- Đồng hồ đếm ngược, bảng xếp hạng, điểm số phần trăm.
- Popup, quảng cáo nội bộ, thông báo chen ngang lúc đang làm bài.
- Chữ tiếng Anh trên giao diện.
- Hơn 2 câu chữ trong một khối giải thích.
- Hiệu ứng nền chuyển động, parallax, hiệu ứng lặp khi đang học (nền vũ trụ tĩnh ở mục 12 là ngoại lệ duy nhất).

## 11. Kiểm tra trước khi giao

- [ ] Tương phản chữ ≥ 4.5:1 (đã tính cho mọi token ở mục Màu).
- [ ] Vùng chạm ≥ 48px, khoảng cách ≥ 12px.
- [ ] Không cuộn ngang ở 820×1180, 1180×820, 390×844.
- [ ] Focus ring nhìn thấy trên mọi phần tử tương tác.
- [ ] `prefers-reduced-motion` được tôn trọng.
- [ ] Không màu nào mang nghĩa một mình (có ký hiệu/biểu tượng đi kèm).
- [ ] Không emoji làm biểu tượng; biểu tượng dùng Lucide.
- [ ] Safe area iPad khi mở PWA toàn màn hình.

## 12. Nền vũ trụ

Một lớp nền "đa vũ trụ" rất nhạt phía sau mọi màn của bé (trang chủ, môn, bài, player, hồ sơ) để app đẹp và đáng mở với bé 11–12 tuổi. Nằm ở `src/components/cosmos-background.tsx`, gắn một lần trong `src/app/(child)/layout.tsx`; trang phụ huynh ở ngoài nhóm đó nên giữ nền phẳng.

- Thành phần: hai vầng tinh vân (tím góc trên phải, xanh góc dưới trái), lớp sao nhỏ lặp, hành tinh có vành đai ở góc trên phải kèm quỹ đạo nét đứt và một mặt trăng, hành tinh sọc ở góc dưới trái kèm quỹ đạo và hai mặt trăng nhỏ, một mặt trăng nhỏ ở mỗi mép bên (hổ phách, hồng).
- Màu chỉ lấy từ token khái niệm (`--color-concept-violet`, `blue`, `teal`, `amber`, `pink`, `slate`) ở độ mờ thấp; hình lớn đặt nửa ra ngoài góc màn hình (đơn vị `vmin`, có `clamp`), nên không chạm vùng nội dung. Trên điện thoại hành tinh góc trên dời lên để chỉ lộ nửa dưới, không đè hàng nút đầu trang.
- Phía sau mọi thứ: `fixed inset-0 -z-10`, `pointer-events-none`, `aria-hidden`, không có chữ và không phần tử nhận focus. Thẻ trắng (`--color-surface`) che kín nền, nên chỉ phần nền trống (lề, khe giữa thẻ, đầu trang) lộ ra.
- Tương phản: độ mờ mỗi hình ≤ 0.16 (vầng tinh vân ≤ 8%). Điểm tối nhất của nền (nơi hình chồng nhau, đo trên ảnh chụp chỉ còn nền ở 820×1180, 390×844, 1180×820) giữ `--color-muted-foreground` ≥ 4.6:1 và `--color-foreground` ≥ 7.6:1. Tăng độ mờ hay thêm hình thì đo lại.
- Nhẹ: một khối div gradient và vài SVG tĩnh, không ảnh, không script; không chuyển động nên không có gì để tắt khi giảm chuyển động.
- Thanh dưới cố định (`bar-surface`) phủ màu nền phẳng ngang cả màn nên nền vũ trụ không hiện sau nó.

- Thẻ phần của trang bài ("Các phần của bài", `SectionCardArt` trong `src/components/section-card-art.tsx`): mỗi thẻ có một bầu trời riêng, lặp theo thứ tự thẻ: hành tinh có vành đai (tím), hành tinh sọc trên quỹ đạo nét đứt (xanh ngọc), mặt trăng có hố và đốm sao (hổ phách), hành tinh nhỏ trên quỹ đạo nghiêng (xanh trời). Tranh là một cột riêng ở cuối thẻ (rộng 96px điện thoại, 128px máy tính bảng, sát mép thẻ), mờ dần từ trái nên không có cạnh cứng; mũi tên `›` nằm giữa cột, hành tinh ở phần trên, mặt trăng và sao ở phần dưới, quỹ đạo không đi qua mũi tên. Cột chữ kết thúc đúng chỗ cột tranh bắt đầu nên không bao giờ có chữ nằm dưới tranh. Thẻ cắt tranh theo góc bo (`overflow-hidden`).
- Tranh thẻ chỉ là SVG tĩnh, `aria-hidden`, không chữ, không chuyển động nên không có gì để tắt khi giảm chuyển động. Mỗi hình là màu khái niệm ở độ mờ ≤ 0.24 trên nền thẻ trắng, nằm ngoài vùng chữ nên tương phản chữ (`--color-foreground`, `--color-muted-foreground` trên `--color-surface`) không đổi (≥ 7.6:1 và ≥ 4.6:1); riêng mũi tên (không phải chữ) nằm trên nền nhạt, vẫn ≥ 3:1.
- Thẻ bài của trang môn (`LessonCardArt` trong `subject-tile-art.tsx`): cùng ba cảnh của ô môn ở cùng cỡ (khung 320 × 200 vẽ rộng ~350px, 384px trên máy tính bảng), tô màu môn, trong 40% bên phải thẻ nơi chỉ có nhãn trạng thái (cột chữ rộng tối đa 58%), mờ dần từ trái. Mỗi thẻ một kiểu (ba cảnh × hai cách cắt: phần đáy khung hoặc phần giữa) nên thẻ liền nhau không giống nhau. Độ mờ ≤ 0.2; nhãn trạng thái có nền đặc nên giữ nguyên tương phản.
- Ô môn trên điện thoại: tranh nhạt xuống 60% (`max-md:opacity-60`) để vầng hành tinh sau vòng tiến độ không nặng; vòng tiến độ rộng 80px (96px iPad dọc), số phần xong và `/tổng` xếp hai dòng trong vòng nên số ba chữ số không chạm nét vòng.
- Đồng nhất: mọi thẻ, bảng và ô phủ lên nền đều mang cùng bầu trời để app liền một khối, không chỗ nào chỉ là một mảng trắng hay mảng màu phẳng. Hình dùng chung nằm ở `src/components/`:
  - `PanelArt` (`panel-art.tsx`) trên thẻ trắng và bảng: hành tinh có vành đai nửa ra góc trên-phải, mặt trăng sọc nửa ra góc dưới-trái, vài ngôi sao và vầng tinh vân mờ; màu khái niệm, độ mờ ≤ 0.16 nên chữ giữ nguyên độ tương phản như trên nền trắng. Cha phải `relative isolate overflow-hidden`; nội dung cuộn bên trong một khung riêng nên hình đứng yên khi cuộn. Dùng ở mọi `Sheet`, thẻ chọn hồ sơ và thẻ sticker của trang bài, bảng chi tiết sticker, lưới danh hiệu và thẻ "Học tiếp". Thẻ hay bảng mới tự gắn `PanelArt` thay vì tự vẽ.
  - `SubjectTileArt` (`subject-tile-art.tsx`) trong ô môn của trang chủ: mỗi màu môn một cảnh riêng (xanh dương: hành tinh có vành đai và mặt trăng nhỏ; đất nung: mặt trăng có hố trên quỹ đạo nét đứt; xanh ngọc: hành tinh sọc trên cung quỹ đạo), neo ở góc dưới-phải nơi ô còn chỗ, sau chữ (`-z-10` trong ô `isolate`). Mọi hình là màu chữ tối (`text-foreground`) ở độ mờ ≤ 0.2 nên chỉ có thể làm ô tối thêm dưới chữ trắng, không bao giờ làm giảm tương phản. Đo trên ảnh chụp (ẩn chữ, lấy điểm sáng nhất trong khung mọi dòng chữ và số trong vòng tiến độ, ở 390×844, 820×1180 và 1180×820): xanh dương 5.17:1, đất nung 4.94:1, xanh ngọc 5.47:1, đúng bằng màu ô phẳng và ≥ 4.5:1. Tĩnh, không chuyển động.
  - `CosmosHorizon` (`cosmos-background.tsx`) cuối trang chủ: một dải trời (hành tinh có vành mọc từ mép dưới, mặt trăng, vài sao) nằm trong dòng chảy của trang sau nội dung cuối, đẩy xuống đáy màn hình khi trang ngắn (`mt-auto`). Cùng dải này kết thúc trang môn, trang bài, màn chọn hồ sơ và các màn xong phần / nhận sticker (`DoneScreen`, ngay trên thanh nút). Có chỗ riêng nên không bao giờ nằm dưới hay chạm nội dung; độ mờ ≤ 0.18; tĩnh.

## 13. Danh hiệu trên trang chủ

Bé vừa mở app đã thấy các danh hiệu (sticker) mình có: động lực học. Lưới nằm ngay dưới hàng cú, trên thẻ "Học tiếp" và lưới môn; không còn mục sticker ở cuối trang. Code ở `src/app/(child)/sticker-shelf.tsx` (`StickerShelf`), bảng chi tiết ở `sticker-sheet.tsx`.

- Lưới đều như mục sticker cũ nhưng nằm trên đầu và cao tối đa hai hàng ở mọi khổ màn hình (số cột theo bề rộng: 3 điện thoại, 4 từ 40rem, 5 từ 48rem tức iPad; một nơi duy nhất là `SHELF_COLUMNS`, cùng nguồn với số ô nên không lệch). Chiều cao không đổi dù bé có 0, 3 hay 30+ sticker: lưới không bao giờ lớn thêm nên thẻ "Học tiếp" và lưới môn không bị đẩy xuống. Ô: hình 72px, tên bên dưới xuống dòng, không cắt (luật `no-truncation`) và luôn dành chỗ hai dòng nên mọi ô cao như nhau.
- Thứ tự ô (`shelfLayout`): sticker đã nhận, mới nhất trước (theo `at` của bản ghi `stickers`, không lưu thêm gì); rồi sticker chưa nhận, cái tô nhiều nhất trước, cùng mức thì theo thứ tự bài. Nên lưới luôn đầy, không có trạng thái rỗng: bé chưa nhận gì thì thấy toàn bóng xám, tô dần theo phần đã xong.
- Tiêu đề "Danh hiệu của bạn", dòng phụ "Đã nhận n/m" (m là mọi sticker của các bài bé thấy). Còn sticker không vừa hai hàng thì ô cuối là "+k xem tất cả" và có nút "Xem tất cả ›" (cao ≥ 48px) cạnh tiêu đề; cả hai mở bộ sưu tập. Vừa hết thì không có cả hai.
- Bộ sưu tập: bảng `Sheet` "Danh hiệu của bạn" với dòng đếm ("Đã có n/m sticker · k đang tô màu") và lưới 3 cột mọi sticker theo thứ tự bài. Chạm một sticker mở bảng chi tiết; đóng bảng đó thì quay lại bộ sưu tập (từ lưới trang chủ thì đóng là về trang chủ).
- Bảng chi tiết `StickerSheet` (hiệu ứng lặp suốt lúc mở, vẫn đứng yên khi giảm chuyển động): sticker đã nhận phát một tiếng ăn mừng ngẫu nhiên (`pickCelebration`), nảy (`LoopingMotion` `bounce`) và pháo giấy nổ lặp (`LoopingConfetti`); sticker chưa nhận chỉ phát tiếng click nhẹ (`tap`) và đung đưa chậm (`float`), không pháo giấy. Tiếng theo công tắc âm thanh, phát một lần.
- Nút "Nghe nhạc" trong bảng chi tiết (cả sticker chưa nhận): phát một bài ngẫu nhiên trong `SONGS` (không lặp bài vừa nghe khi còn bài khác), bấm lại là "Dừng nhạc"; một bài một lúc (`playMusic` trong `src/lib/sound.ts` dừng mọi tiếng đang phát và ngược lại); đóng bảng, rời màn, tắt loa thì nhạc dừng; tắt âm thanh của bé thì nút khoá và có dòng "Bật loa ở góc màn hình để nghe nhạc". Không có luật mở khoá, không hộp nhạc, không chip trang chủ.
- Danh sách bài một nơi: `SONGS` trong `src/music/songs.ts` (id, tên, tên file nguồn trong `assets/sounds/`). Thêm bài: chép file vào `assets/sounds/`, thêm một mục, chạy `pnpm sounds:build`, commit kết quả. Bài là clip loại `file` ở −22 LUFS (nhỏ hơn giọng 6 LU; iOS bỏ qua `volume` của thẻ audio nên độ lớn đặt khi làm file), cắt khoảng lặng đầu, tắt dần 0,4 giây ở cuối và không giải mã vào bộ nhớ: khi bảng mở, ba bài được tải về dạng nén (blob, dưới 600 KB) để thẻ audio dùng chung bắt đầu phát ngay khi bấm.
