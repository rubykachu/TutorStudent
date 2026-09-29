# Implementation Plan: mốc "Học được"

Nguồn yêu cầu: `docs/spec.md` (mục "Tiêu chí thành công", mốc "Học được"), giao diện theo `docs/design-system.md`. Các mốc sau nằm trong `backlogs/milestones.md`.

## Tổng quan
Dựng app Next.js chạy trên máy, iPad truy cập qua LAN. Trẻ chọn hồ sơ, học hai bài hoàn chỉnh (Toán — Luỹ thừa với số mũ tự nhiên; Ngữ văn — Nếu cậu muốn có một người bạn), làm đủ 8 dạng bài với phản hồi 3 nấc, ôn cách quãng bằng FSRS. Tiến độ chỉ lưu IndexedDB và **chỉ để thử** (IndexedDB tách theo origin; bản LAN không chuyển sang bản deploy). Đồng bộ R2, cổng mã gia đình, PWA, đo hiệu năng thuộc mốc "Go-live". Skill `lesson-author`, `lesson-visual`, `lesson-review` được viết sau khi engine và component ổn định, rồi dùng chính chúng để soạn hai bài.

## Quyết định kiến trúc
- **Khung chung trước, bài cụ thể sau.** Schema, engine bài tập, SRS, player hoàn chỉnh với bài fixture trước khi soạn bài thật.
- **Logic thuần tách khỏi React** (`grade*`, `rate`, `selectReview`, lint nội dung) để unit test nhanh.
- **Schema zod là nguồn duy nhất** cho kiểu TS, `content:check`, và JSON schema cho prompt.
- **Nội dung phục vụ dạng file tĩnh sinh lúc build:** `/content/index.json` + `/content/<lessonId>.json`. Trang bài dùng `generateStaticParams`. Mốc Go-live precache được mà không refactor.
- **Visual qua registry + dynamic import**, metadata `interactive` để đếm tiêu chí.
- **Dexie có `familyId` + `childId` trên mọi bản ghi** để schema nhất quán với mốc đồng bộ (`familyId = "local"` ở mốc này).
- **Chạy qua LAN là http, không phải secure context:** không dùng `crypto.randomUUID`; một hàm tạo id chung dùng `crypto.getRandomValues`; `allowedDevOrigins` cho dải IP LAN.
- **Thời gian qua `now()` duy nhất** để test đồng hồ giả.
- **Bài fixture `content/_fixture/` và trang `/dev/*`** chỉ ở dev (`notFound()` khi production), loại khỏi layout test.

## Đồ thị phụ thuộc
```
1 Scaffold + tokens
└── 2 Schema + loader + content:check + nội dung tĩnh
    ├── 3 Visual registry + primitive + visual:shot
    ├── 4 Engine chấm + máy trạng thái 3 nấc + ExerciseFrame
    │   ├── 5 UI chọn/nhập
    │   ├── 6 UI kéo/chạm/thao tác
    │   └── 7 PassageReader + openEnded (fixture)
    └── 8 Dexie + SRS
        └── 9 Hồ sơ + trang chủ + môn
            └── 10 Bài + player + block renderer + sticker
                └── 11 Ôn bài theo yêu cầu
                    └── 12 Linh vật + chuỗi ngày + nhắc môn + âm thanh
                        └── 13 Lint nội dung + glossary + cổng status
                            └── 14a Skill review → 14 Skill author/visual + CLAUDE.md
                                ├── 15 Bài Toán
                                └── 16 Bài Ngữ văn
                                    └── 17 E2E + bố cục + kiểm skill
```

## Thứ tự ưu tiên (điều chỉnh theo người dùng)
Người dùng muốn dùng thử sản phẩm sớm để góp ý, E2E làm sau. Sau khi xong task 5–7:
1. Task 10 (trang bài + player) và task 11 (ôn bài) — để có luồng học thật.
2. Soạn bài Toán (task 15) trực tiếp, kiểm bằng `content:check` + một lượt review độc lập trong subagent; rồi người dùng dùng thử trên iPad qua LAN.
3. Theo góp ý: sửa; sau đó task 12, 13, 14a, 14 (skill viết từ kinh nghiệm soạn bài thật), 16, 17 (E2E đầy đủ).

## Danh sách task

### Nền tảng
- [x] 1. Scaffold dự án + design tokens
- [x] 2. Content schema, loader, `content:check`, `ids.lock`, nội dung tĩnh
- [x] 3. Visual registry, primitive dùng chung, `visual:shot`

**Checkpoint A:** gate + `pnpm build` xanh; ảnh primitive đã xem; mở app từ iPad qua LAN; báo người dùng.

### Bài tập
- [x] 4. Engine chấm 8 dạng + máy trạng thái 3 nấc + `ExerciseFrame`
- [x] 5. UI: `choice`, `numeric` (+ `NumberPad`), `fillBlank`, `order`
- [x] 6. UI: `match`, `tapText`, `tapRegion`, `manipulate`
- [x] 7. `PassageReader` + UI `openEnded` (checklist tự tick)

**Checkpoint B:** `/dev/exercises` đủ 8 dạng + openEnded từ fixture; test component xanh; chạm thử trên iPad.

### Luồng học
- [x] 8. Dexie + SRS (rating, lịch, chọn thẻ ôn)
- [x] 9. Hồ sơ + trang chủ + trang môn
- [x] 10. Trang bài + player phần + block renderer + sticker
- [x] 11. Ôn bài theo yêu cầu (nút "Ôn bài này")
- [ ] 12. Linh vật + chuỗi ngày + nhắc môn + âm "ting"

**Checkpoint C:** với fixture: chọn hồ sơ → học hết một phần → bấm "Ôn bài này" → thẻ vừa sai được hỏi trước. Ảnh nguồn hai bài đã có trong `sources/` (đặt tên theo trang). **Xin người dùng ảnh một bài mẫu** cho task 17.

### Nội dung
- [x] 13. Lint nội dung tự động + glossary + cổng `status`
- [ ] 14a. Skill `lesson-review` (+ kiểm bằng lỗi cài cố ý, 3 lần)
- [ ] 14. Skill `lesson-author` + `lesson-visual` + `CLAUDE.md`
- [ ] 15. Bài Toán — Luỹ thừa với số mũ tự nhiên
- [ ] 16. Bài Ngữ văn — Nếu cậu muốn có một người bạn

**Checkpoint D:** hai bài `published`, `content:check --stats` đạt tiêu chí, `review.md` sạch lỗi Nghiêm trọng; người dùng xem thử trên iPad.

### Hoàn thiện
- [ ] 17. E2E + bố cục + kiểm skill tác giả (soạn bài mẫu) trong git worktree riêng

**Checkpoint cuối:** mọi tiêu chí mốc "Học được"; commit; đề xuất session mới cho mốc "Go-live".

## Rủi ro
| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Next 16 / Tailwind 4 / shadcn 4 / Biome / Vitest 5 lệch cấu hình | Trung bình | Task 1 chỉ scaffold + build xanh; `create-next-app@16 --biome --app --src-dir --use-pnpm --ts --tailwind` đã chạy thử được |
| iPad qua LAN (http) thiếu API chỉ có ở secure context | Trung bình | Hàm tạo id chung; chạm thử ở Checkpoint A; `next dev --experimental-https` nếu cần |
| Kéo thả trên iPad Safari | Trung bình | Chạm-chọn-rồi-chạm-đặt; thử iPad ở Checkpoint B |
| Animation tốn công | Cao | Primitive dùng chung; visual gợi ý không bắt buộc (fallback chung) |
| Nội dung ảo giác, lệch bài, ngôn từ khó hiểu | Cao | Lint tự động + `lesson-review` trong subagent mới có trích dẫn; cổng `status`; người dùng xem ở Checkpoint D |
| Thiếu ảnh bài mẫu cho task 17 | Thấp | Xin ở Checkpoint C |

## Câu hỏi mở
- Linh vật: mặc định cú — đổi nếu trẻ thích con vật khác.
- Xuất bản tự động sau review (đã chốt; `REQUIRE_OWNER_APPROVAL` = false).
- Bản chép văn bản Ngữ văn (`source-passage.txt`) cần người dùng duyệt với ảnh ở task 16.
