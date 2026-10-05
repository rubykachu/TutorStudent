# Spec: Tutor — app tự học cho học sinh lớp 6

## 1. Mục tiêu

### Vấn đề
Học sinh lớp 6 tiếp thu chậm, nhanh quên (học hôm nay, mai quên, tuần sau không nhớ), thiếu tập trung. Yếu nhất: Toán, đọc hiểu và suy luận ngữ cảnh ở Ngữ văn. Học tốt tiếng Anh. Phụ huynh không có thời gian kèm sát — chỉ có thể cung cấp tài liệu (ảnh/PDF/text sách giáo khoa) để Claude biên soạn.

### Giải pháp
Web app (PWA) để trẻ **tự học** trên iPad:
- Giải thích bằng **animation tương tác** (chính) và video ngắn có giọng đọc (bổ sung), ít chữ.
- **Ôn cách quãng** theo thuật toán FSRS để chống quên.
- Bài tập tương tác, sai thì **gợi ý bằng màu sắc và hình**, không bằng đoạn văn.
- Nội dung do Claude biên soạn từ tài liệu phụ huynh gửi, qua bộ skill trong repo.

### Người dùng
| Vai trò | Thiết bị | Việc chính |
|---|---|---|
| Trẻ (học sinh) | iPad (chính), điện thoại | Chọn hồ sơ, tự chọn bài học, bấm ôn bài bất cứ lúc nào, làm bài tập, sưu tập sticker |
| Phụ huynh | Điện thoại / laptop | Xem tiến độ, thẻ hay quên, đọc bài viết của con, quản lý hồ sơ con. Vào bằng PIN |
| Quản trị viên (chủ dự án) | Laptop + Claude Code | Nạp bài, tạo/thu hồi mã gia đình, sửa nội dung chung. Quyền quản trị = gia đình có cờ admin **và** đã nhập PIN |

Quy mô: 2–3 gia đình, mỗi gia đình 1+ hồ sơ con. Hiện dùng phi thương mại; kiến trúc giữ khả năng chuyển nhà cung cấp (AI, hosting) khi thương mại hoá.

### Môn học và bộ sách
| Môn | Bộ sách mặc định |
|---|---|
| Toán 6 | Kết nối tri thức với cuộc sống |
| Ngữ văn 6 | Chân trời sáng tạo |
| Lịch sử và Địa lí 6 (phần Địa lí) | Kết nối tri thức với cuộc sống |
| Lịch sử và Địa lí 6 (phần Lịch sử) | Kết nối tri thức với cuộc sống |
| Khoa học tự nhiên 6 | Kết nối tri thức với cuộc sống |

Mỗi hồ sơ con khai báo bộ sách cho từng môn. Nội dung chỉ có cho bộ sách đã được soạn.

**Lớp (1–12).** Mỗi bộ sách (`series` trong `content/subjects.json`) thuộc đúng một lớp (`grade`), nên một môn dạy nhiều lớp bằng cách khai một bộ sách cho mỗi lớp; lớp của một bài là lớp của bộ sách của nó (`content:check` báo lỗi khi `grade` trong `lesson.json` lệch). Hồ sơ con lưu `grade` (mặc định 6; hồ sơ lưu trước khi có lớp được chuyển sang 6 khi mở cơ sở dữ liệu, tiến độ giữ nguyên). Trang chủ chỉ liệt kê các môn có bộ sách của lớp đó (thứ tự theo `subjects.json`), bộ sách của một môn trong lớp là bộ bé đã chọn nếu thuộc lớp đó, không thì bộ mặc định của môn nếu thuộc lớp đó, không thì bộ đầu tiên của lớp. Khoá được suy ra từ nội dung, không khai tay: môn không có bài đã xuất bản trong lớp thì khoá; lớp không có bài đã xuất bản nào thì khoá (`openGrades` trong `src/content/grades.ts`). Thêm bài xuất bản đầu tiên cho một môn hay một lớp là đủ để mở khoá.

### User stories chính
1. Trẻ mở app → chọn hồ sơ (máy nhớ lựa chọn cuối) → chọn môn/bài để học. Bài đã học có nút **"Ôn bài này"**, bấm lúc nào cũng được; app hỏi những thẻ bé đang dễ quên nhất (~5 phút). Không có lịch ôn bắt buộc.
2. Trẻ chọn bài → app dẫn qua từng **phần** (3–6 phút, tối đa 4 màn giải thích và 4 bài tập): animation giải thích → câu kiểm tra hiểu → luyện tập → nhắc lại bằng hình. App nhớ vị trí đang dừng.
3. Trẻ trả lời sai → gợi ý 3 nấc (xem "Phản hồi 3 nấc khi sai"). Không chữ đỏ, không đồng hồ đếm ngược.
4. Trẻ lâu chưa học một môn → app nhắc nhẹ ("Toán 4 ngày chưa học"), không ép.
5. Trẻ viết đoạn văn → có khung gợi ý, có thể đọc chính tả thay vì gõ → AI nhận xét dạng checklist tô màu.
6. Phụ huynh nhập PIN → xem ngày học, thời lượng, thẻ hay quên theo môn, bài viết của con; muốn cho con học lại một bài cũ thì bấm "Học lại bài này" ở bài đó.
7. Quản trị viên thả tài liệu vào `sources/` → gọi skill → bài được soạn, **review độc lập** (khớp bài học, đúng kiến thức, ngôn từ dễ hiểu) → có bài học mới trên site sau khi push.
8. Quản trị viên (trên điện thoại) copy prompt → dán vào ChatGPT/Gemini → dán JSON/SVG kết quả ngược lại → bài tập mới hiện ngay, không cần deploy.
9. iPad mất mạng, kể cả mở app từ đầu khi không có mạng → vẫn ôn và học mọi bài đã tải; có mạng lại thì tự đồng bộ.

### Ngoài phạm vi
- Thanh toán, đăng ký tài khoản tự do, mạng xã hội, bảng xếp hạng.
- Chấm điểm số tự động cho bài viết (AI chỉ nhận xét).
- Giao diện tiếng Anh hoặc song ngữ.
- Nhân bản giọng nói.

## 2. Tech stack

| Việc | Lựa chọn | Phiên bản tại thời điểm khởi tạo |
|---|---|---|
| Runtime | Node.js (`engines: >=22`; Vercel dùng 24 LTS) | 22+ |
| Package manager | pnpm | 9+ |
| Framework | Next.js App Router, TypeScript strict, build Turbopack | 16.x |
| UI | React | 19.x |
| CSS | Tailwind CSS | 4.x |
| Component | shadcn/ui (Radix) | CLI 4.x |
| Animation | Motion (`motion/react`) + SVG | 13.x |
| Kéo thả | dnd-kit | 6.x |
| Công thức | KaTeX | 0.18.x |
| Hình học/đồ thị | Mafs (bảo trì chậm — chỉ dùng qua wrapper `src/visuals/shared/plot`, thay được) | 0.21.x |
| Bản đồ | react-simple-maps + TopoJSON Natural Earth, bản ranh giới theo góc nhìn Việt Nam | 5.x |
| IndexedDB | Dexie | 4.x |
| Schema | zod (`z.toJSONSchema` cho prompt — schema không dùng `.transform`/`z.custom`/`z.date`) | 4.x |
| Ôn cách quãng | ts-fsrs | 5.x |
| PWA / offline | service worker viết tay (`src/offline/`), đóng gói bằng `esbuild` | — |
| R2 (S3 API) | aws4fetch | 1.x |
| Lọc SVG (phía client, trước khi lưu) | DOMPurify | 3.x |
| Session cookie | jose (JWT HS256) | latest |
| AI nhận xét | Gemini API qua adapter `AiReviewer` (đổi nhà cung cấp bằng một file) | — |
| Lint + format | Biome | latest |
| Chạy script TypeScript (content, visual, admin) | tsx | latest |
| Unit test | Vitest + Testing Library | 5.x |
| E2E + screenshot | Playwright | 1.x |
| Font | Baloo 2 (tiêu đề), Be Vietnam Pro (thân) qua `next/font` | — |

Hạ tầng (gói miễn phí):
- **Vercel Hobby** — host app, API route. Chuyển gói trả phí hoặc Cloudflare khi thương mại hoá.
- **Cloudflare R2** — bucket private `tutor-progress` (tiến độ và bản chụp, một bucket cho `prod/`, `dev/` và `test/`) và bucket public `tutor-media` (video, lời đọc, SVG overlay).
- **GitHub** — repo code + nội dung bài học, account `rubykachu`.
- **Gemini API** — AI nhận xét bài viết (một key, `GEMINI_API_KEY`).

Công cụ chạy trên máy quản trị viên (không deploy): ffmpeg, mlx-whisper, TTS tiếng Việt chạy trên máy (VieNeu-TTS; lựa chọn cuối cùng chốt sau khi chạy thử trên máy), HyperFrames (render video).

## 3. Commands

```bash
pnpm install                 # cài dependency
pnpm dev                     # dev server http://localhost:3000, --hostname 0.0.0.0 để iPad cùng LAN truy cập
pnpm build                   # production build (chạy content:check trước)
pnpm start                   # chạy bản build
pnpm lint                    # biome check .
pnpm format                  # biome check --write .
pnpm typecheck               # tsc --noEmit
pnpm test                    # vitest run
pnpm test:watch              # vitest
pnpm test:e2e                # playwright test (project ipad + phone)
pnpm test:r2                 # bộ test của store trên bucket R2 thật, chỉ dưới test/<run-id>/ (chạy tay, hỏi trước, cần biến R2_* trong .env.local)
pnpm content:check           # validate content/ + ids.lock + overlay trên R2 (nếu có biến môi trường R2)
pnpm content:lock <lesson>…  # thêm id của các bài nêu tên vào content/ids.lock.json (không nêu: mọi bài, bỏ qua bài có reviewedHash cũ)
pnpm content:hash <lesson>   # in reviewedHash của bài; --mark ghi bản đã review vào review.md; --approve ghi thêm hash và đặt published (skill lesson-review dùng); --tips làm cùng việc cho tips.json của bài (hash và status riêng, không đụng bài)
pnpm content:diff <lesson>   # liệt kê section, màn, card, bài tập, video đổi so với bản review gần nhất (vòng review thứ 3 trở đi)
pnpm content:prompt <lesson> # in prompt sinh bài tập cho ChatGPT/Gemini
pnpm visual:shot <lesson>    # chụp ảnh các visual của bài bằng Playwright vào .shots/
pnpm admin <command>         # CLI quản trị: family:create, family:revoke, pin:reset, restore
```

`pnpm admin` ghi lên R2 → luôn in rõ bucket/key sẽ ghi và yêu cầu `--yes`.

## 4. Cấu trúc dự án

```
.
├── CLAUDE.md                     # lối vào cho Claude: trỏ tới docs/architecture.md và .claude/rules/
├── docs/
│   ├── spec.md                   # tài liệu này
│   ├── design-system.md          # design token, màu khái niệm, linh vật, component spec
│   └── operations.md             # tạo bucket R2, CORS, lifecycle, token, Vercel, mã gia đình, cài PWA
├── notebooks/backlogs/            # spec/plan/task theo feature/bug/bài: <tên>/{spec,plan,task}.md; index.md là hàng đợi; archive/ khi xong
├── sources/                      # tài liệu gốc (ảnh/PDF SGK) — .gitignore, không bao giờ commit
│   └── <subject>/<lesson-slug>/
├── content/                      # nội dung đã biên soạn, commit vào git
│   ├── subjects.json             # môn: màu, icon, ngôn ngữ vi/en, cờ luật (rules), bộ sách
│   ├── ids.lock.json             # mọi id đã publish + map retired (xem "Id bất biến")
│   ├── glossary/<subject>.json   # thuật ngữ chuẩn + từ đồng nghĩa cấm dùng, theo môn
│   └── <subject>/<series>/<lesson-slug>/
│       ├── lesson.json
│       ├── review.md             # báo cáo của skill lesson-review
│       └── source-passage.txt    # (Ngữ văn) bản chép văn bản gốc, quản trị viên đã duyệt với ảnh
│       └── assets/               # SVG tĩnh riêng của bài (tự vẽ, không lấy hình SGK)
├── src/
│   ├── app/
│   │   ├── (child)/              # chọn hồ sơ, trang chủ, môn, bài, phần, ôn bài, sticker
│   │   ├── parent/               # trang phụ huynh (cần PIN)
│   │   ├── unlock/               # nhập mã gia đình
│   │   ├── install/              # hướng dẫn cài PWA (iPad)
│   │   └── api/
│   │       ├── session/          # mã gia đình → cookie tutor_family
│   │       ├── parent-session/   # PIN → cookie tutor_parent
│   │       ├── sync/             # đọc/ghi tiến độ: hồ sơ, tài liệu chính, lịch sử từng tháng
│   │       ├── feedback/         # AI nhận xét bài viết
│   │       └── content/          # GET overlay (mọi gia đình); POST/DELETE (admin + PIN)
│   ├── proxy.ts                  # chặn trang khi chưa có cookie gia đình hợp lệ
│   ├── schema/                   # zod schema — NGUỒN DUY NHẤT cho content, progress, family
│   ├── content/                  # loader content/ lúc build; client merge overlay tải từ /api/content
│   ├── exercises/                # component 8 dạng bài + engine chấm + gợi ý 3 nấc
│   ├── visuals/
│   │   ├── registry.ts           # map visualId → dynamic import
│   │   ├── shared/               # primitive dùng chung: dot grid, bead, highlight, number line, plot…
│   │   └── <subject>/<lesson-slug>/*.tsx
│   ├── srs/                      # bọc ts-fsrs: rating, ước lượng mức nhớ, chọn thẻ ôn
│   ├── progress/                 # Dexie DB, báo cáo phụ huynh, PIN
│   ├── sync/                     # tài liệu đồng bộ, gộp, engine, lịch chạy, nhập sao lưu
│   │   └── store/                # BlobStore (get/put có ETag) + adapter r2, fs, memory, bộ dựng khoá
│   ├── auth/                     # JWT, kiểm family/epoch/isAdmin, khoá PIN
│   ├── ai/                       # AiReviewer interface + adapter Gemini, prompt, hạn mức
│   ├── mascot/                   # linh vật SVG + biểu cảm
│   ├── offline/                  # service worker viết tay: danh sách precache, chiến lược request, cập nhật, trạng thái
│   ├── components/ui/            # shadcn/ui
│   └── lib/                      # config, múi giờ, tiện ích chung
├── scripts/                      # content-check, content-lock, content-prompt, visual-shot, admin CLI
├── video/                        # pipeline video (chạy trên máy, không deploy)
│   ├── tts/                      # adapter TTS: local (mặc định), gemini, edge
│   ├── .venv, .python, .hf       # Python arm64, model TTS/whisper (gitignore; cài ở requirements.txt)
│   └── projects/<lesson>/<video>/  # kịch bản, audio, render — phần nặng gitignore
├── tests/                        # unit/component/API test (song song cấu trúc src/)
├── e2e/                          # Playwright
└── .claude/skills/
    ├── lesson-author/            # biên soạn bài từ sources/ → content/
    ├── lesson-visual/            # viết component animation, chụp ảnh tự kiểm tra
    ├── lesson-review/            # review độc lập bài đã soạn: khớp nguồn, đúng kiến thức, ngôn từ, nhất quán
    ├── lesson-video/             # kịch bản → TTS → căn phụ đề → render → nén → cắt clip → R2
    ├── content-prompt/           # sinh prompt từ schema; gom overlay R2 về git
    └── tutor-admin/              # mã gia đình, PIN, khôi phục (hỏi trước mọi thao tác ghi)
```

## 5. Thiết kế chức năng

### 5.1 Mô hình nội dung (zod, `src/schema/content.ts`)

```
Subject      { id, name, color (token bảng màu), icon, language: "vi" | "en",
               rules: { checkExpr, verbatimPassage, requiresOpenEnded }, series[], defaultSeries }
             # cấu hình theo môn chỉ nằm ở content/subjects.json; luật chữ tiếng Việt (âm tiết, số, độ dài câu) chỉ áp cho môn language "vi"
Series       { id, name, grade (1–12) }   # mỗi bộ sách thuộc một lớp; Subject.series[] liệt kê các bộ
Lesson       { id, subject, series, grade (= grade của series), order, kind?: "review", number?, part?, chapter?: { numeral, name }, title, sourceRef (vd "SGK tr.22–24"),
               status: "draft" | "published", reviewedHash?, concepts[], sections[], cards[], exercises[], sticker,
               videos?, overview? }
             # bài có thể có thêm `tips.json` cạnh `lesson.json` (xem TipsFile)
             # `order` có thể là số thập phân: bài ôn tập chương (`kind: "review"`) đứng giữa hai bài có số, vd 12,5 sau Bài 12 và trước Bài 13; bài ôn tập không có `number`
             # một bài của sách quá dài được tách thành nhiều bài của app: các bài con cùng `number`, `chapter`, mỗi bài có `part` (1, 2, …) và `order` = `number + (part − 1) / 10` (Bài 19: 19 và 19,1)
             # mọi dạng câu hỏi có thêm `bookRef?` (vd "SBT 2.58"): đề của câu lấy nguyên văn từ sách; chỉ bài `kind: "review"` và câu sách của section `bookPractice` được dùng
             # mọi dạng câu hỏi có thêm `leadsTo?` (id câu sách kế tiếp): đánh dấu câu dẫn của section `bookPractice`
Overview     { hook: { text, visualId? }, summary, goals[2..4], whyItMatters,
               narration?: { audioUrl, vttUrl } }        # màn giới thiệu trước phần đầu tiên
Concept      { id, name, color }                 # tên token màu khái niệm (design-system.md)
Section      { id, title, sourceRef, minutes, blocks: SectionBlock[], checkIds[], practiceIds[], recap: RecapBlock, bookPractice?: boolean }
SectionBlock = Block | group { children: (note | formula | visual | image)[] }   # mỗi phần tử là một màn
             | tip { id, kind: "làm nhanh" | "hiểu nhanh" | "tránh sai", title, text, tex?, visualId? }   # mẹo cho một dạng bài; một màn, chỉ ở `Section.blocks`
TipsFile     { lessonId, status: "draft" | "published", reviewedHash?, tips: Tip[1..] }   # content/<môn>/<bộ sách>/<slug>/tips.json; Tip = tip bỏ `type`; có review riêng
Block        = visual { visualId, caption? }
             | formula { tex }
             | passage { paragraphs[], annotations[] }   # văn bản đọc hiểu, chạm được theo câu
             | note { text }                             # chữ ngắn, tối đa ~2 câu
             | video { videoId, clipId? }                # không tính vào số màn; tối đa 1 mỗi section
             | image { src, alt }                        # chỉ URL trong bucket media (SVG nạp nhanh)
RecapBlock   = visual | formula                          # hình/công thức nhắc lại, xem nhanh được; câu cần nhớ ở `caption`
Card         { id, sourceRef, conceptIds[], recap: RecapBlock }
Exercise     = discriminated union theo `type` (xem "Tám dạng bài tập"), mỗi loại có:
               { id, cardIds[], prompt: Block[], hints: Hints, explain?: Explanation, difficulty: 1..3 }
Explanation  { text, tex?, visualId?, wrong?: [{ optionId, text }] }   # vì sao đáp án đúng; `wrong` chỉ cho `choice`
Hints        { highlight: TargetRef[], hintVisualId?, solutionVisualId? }
Video        { id, lessonId, url, vttUrl, posterUrl, durationSec, clips[{ id, start, end, cardIds[] }], voice, checkpoints?: [{ id, at, from }] }   # đường dẫn dưới media base; `checkpoints` là dữ liệu cũ, player bỏ qua, không còn được ghi
```

- Một section dài vài phút: tối đa 4 màn giải thích (`blocks`, một `group` tính là một màn, khối `video` không tính — xem "Video") và 4 bài tập (`checkIds` cộng `practiceIds`), rồi tới recap; ngưỡng là `MAX_SECTION_SCREENS`, `MAX_SECTION_EXERCISES` trong `src/lib/config.ts`. Bài dài hơn chia thành nhiều section, mỗi section một ý và recap một câu. Ngoại lệ: section `bookPractice` (bên dưới) không bị giới hạn 4 bài tập vì số câu theo sách.
- Section bài tập sách bài tập: `Section.bookPractice: true` đánh dấu section cuối của một bài thường chép nguyên văn mọi bài tập SBT của bài (chúng xuất hiện trong bài kiểm tra). Mỗi câu trong `checkIds`/`practiceIds` của nó là câu sách (có `bookRef` không trùng trong bài, và `explain`) hoặc câu dẫn (`leadsTo: <id câu sách>`, không `bookRef`, lời của bài, tối đa 2 cho mỗi câu sách, đứng trước và dẫn tới câu sách kế tiếp). Luật `[book-practice]`: section phải là section cuối, tối đa một, không dùng ở bài `kind: "review"`, câu thiếu cả `bookRef` lẫn `leadsTo`, câu sách thiếu `explain` (kể cả bài trong `legacy-lessons.json`), `bookRef` trùng trong bài, `leadsTo` sai chỗ hay sai đích. Chữ của câu dẫn vẫn chịu `[textbook-copy]` và `[length]`. `[book-ref]` chỉ cho `bookRef` ở bài ôn tập và ở các câu này. Chữ đề (`prompt`, lựa chọn, `segments`, `left`, `right`, `items`) của các câu này không bị `[textbook-copy]` và giới hạn `[length]`; mọi luật khác và mọi chữ khác của bài giữ nguyên. `content:check --stats` in danh sách `bookRef` mỗi bài để đối chiếu độ phủ với sách. Bài của sách đã tách thành nhiều bài con: mỗi bài con có một section `bookPractice` chỉ chứa bài tập SBT của nội dung nó, luật `[split]` (`src/content/split.ts`) giữ mỗi `bookRef` đúng một bài con, `part` liên tục từ 1, `order` theo công thức; `--stats` in các bài con và hợp các `bookRef` của chúng.
- Section hiện mỗi phần tử của `blocks` trên một màn. `group` gom ≥ 2 khối ngắn, tĩnh lên cùng một màn theo thứ tự: câu quy tắc (`note`, chữ thân bài) rồi ví dụ có nhãn (`formula`/`visual`/`image`). Không lồng `group`, không chứa `passage`/`video`; chỉ dùng trong `Section.blocks` (đề bài tập vốn đã hiện mọi khối trên một màn, nên chỉ số `block` của gợi ý vẫn đếm khối đề). Lint, `content:check` và review đọc được chữ trong `group` như mọi khối khác.
- Lời bài học (định nghĩa, quy tắc, cách đọc, câu cần nhớ) nằm trong JSON (`note`, `caption`) để lint và review thấy. Visual chỉ vẽ hình, ví dụ và nhãn ngắn, không mang câu bài học. Recap là một `visual` có `caption`: câu cần nhớ nằm ở `caption`, màn recap hiện nó thành chữ thân bài phía trên ví dụ (schema còn nhận recap `formula` để bài fixture thử đường hiển thị đó; lint chặn ở bài thật).
- Quan hệ card ↔ exercise chỉ khai một chiều ở `Exercise.cardIds`. Loader dựng index card → exercises sau khi gộp overlay; mọi luật về "exercise của card" dùng index này.
- `Card.recap` chỉ hiện sau câu ôn trẻ trả lời sai ở lần đầu (kể cả lần hỏi lại), khi câu đã kết thúc (trạng thái `done`, tức sau cả vòng gợi ý và nhập lại); câu đúng ngay thì sang câu kế luôn. Tóm tắt không tự ẩn, không bỏ qua bằng chạm ngoài nút: chỉ nút "Tiếp" mới đi tiếp. `Section.recap` hiện ở cuối phần.
- `overview` là màn giới thiệu bài, trẻ thấy trước khi vào phần đầu tiên: `hook` mở bài bằng một tình huống đời thường mà bài giải thích (Ngữ văn: đoạn gợi tò mò về câu chuyện), có thể kèm hình; `summary` nói bài học gì (Ngữ văn: tóm tắt câu chuyện 3–5 câu ngắn); `goals` 2–4 ý nối tiếp câu dẫn "Học xong bài này, bạn sẽ:" do màn hình in sẵn; `whyItMatters` một câu về giá trị thật của bài. `narration` là bản đọc giọng người (`pnpm narration:build`) kèm WebVTT karaoke. Mọi chữ của `overview` qua cùng luật lint như lời bài học; lint giới hạn `summary` tối đa 5 câu, `whyItMatters` 1 câu. Schema để `overview` tuỳ chọn, `content:check` cảnh báo bài đã xuất bản còn thiếu.
- **Giải thích (`explain`)** là phần "vì sao đáp án đúng" hiện sau mỗi câu trả lời (xem 5.3). Bài mới bắt buộc có `explain` ở mọi câu chấm được (kể cả câu kho ôn và bước của `openEnded`); chính câu `openEnded` không cần. Ai bị yêu cầu do `content/legacy-lessons.json` quyết: bài không có trong danh sách là bài mới (lỗi từng câu thiếu); bài `"warn"` chỉ nhận một cảnh báo đếm số câu còn thiếu cho tới khi viết xong và xoá khỏi danh sách (từ đó là lỗi); bài `"exempt"` được miễn và app hiện lời giải suy từ hình lời giải và đáp án. Danh sách này là nguồn duy nhất của cổng; bài thêm mình vào để tránh lint là sai luật.
- **Mẹo (`tip`)** là cách làm nhanh, hiểu nhanh hay tránh sai cho một dạng bài, viết khi dạng đó có mẹo thật. Có hai nơi: khối `tip` trong `Section.blocks` (một màn, tính vào giới hạn màn của section) và `tips.json` của bài, nơi bài đã xuất bản nhận mẹo mà không đổi `lesson.json`, hash review, video hay lời đọc. Trang "Mẹo hay" (`/lessons/<id>/tips`, nút "Mẹo hay" ở trang bài khi bài có mẹo) gom cả hai, khối trong section trước rồi tới `tips.json`. `pnpm content:emit` ghi danh sách đã gộp ở `public/content/<id>.tips.json` và `tipCount` trong `index.json`; tệp `tips.json` chỉ được phục vụ khi `published` (nháp: chỉ `CONTENT_INCLUDE_DRAFT=1`). Tệp mẹo có cổng review riêng: `reviewedHash` tính trên `lessonId` và `tips`, sửa mẹo sau review thì `content:check` fail cho tới khi `pnpm content:hash <bài> --tips --approve`; id mẹo (`<bài>.tip.<tên>`) khoá cùng id bài bằng `content:lock`. Lint (`[tips]`): ≤ 3 câu, tiêu đề ≤ 8 chữ, luật chữ như mọi chữ của bài; mẹo đúng với mọi đầu vào là việc của reviewer.
- `openEnded` không gắn card (không vào phiên ôn); các bước con tự chấm của nó có thể gắn card. `openEnded` tính là 1 exercise nhưng không tính vào số dạng bài khác nhau.

Quy tắc:
- Id duy nhất toàn cục, dạng `<lesson-slug>.<kind>.<name>`.
- Kiến thức và bài tập **biên soạn lại**, không chép câu chữ/hình SGK. Văn bản đọc hiểu Ngữ văn giữ nguyên văn kèm nguồn trích.
- `content:check` kiểm tra: schema hợp lệ; id tham chiếu tồn tại; `visualId` có trong registry; mỗi card có ≥ 1 exercise nằm trong `practiceIds` của một section (nếu không, card không bao giờ được mở); mỗi section có ≥ 1 check và không vượt ngưỡng số màn, số bài tập ở trên; id bất biến (dưới đây); overlay trên R2 hợp lệ với schema và nội dung hiện tại. `content:check --stats` in số phần, card, exercise, dạng bài, visual tương tác (registry khai `interactive`) của từng bài.

#### Id bất biến
- Card, exercise, section, lesson id **không đổi sau khi publish** vì tiến độ (FSRS, sticker, vị trí học) gắn vào chúng.
- `content/ids.lock.json` = `{ ids: string[], retired: { [oldId]: newId | null } }`, áp cho mọi loại id. `content:check` fail nếu: một id trong `ids` biến mất mà không có trong `retired`; chuỗi retired có vòng lặp; `newId` cuối chuỗi không tồn tại.
- Runtime: bộ chọn thẻ và màn bài bỏ qua id không còn trong nội dung (không crash).
- Chuyển tiến độ theo `retired` (card state, section progress, sticker, vị trí học) chạy khi tải tiến độ, idempotent: chỉ chuyển khi đích chưa có dữ liệu hoặc dữ liệu đích cũ hơn, rồi xoá key cũ. Cài đặt ở mốc có đồng bộ; trước đó chỉ cần bỏ qua id mồ côi.

#### Kiểm duyệt nội dung
Mục tiêu: không ảo giác, không lệch bài học, không ngôn từ gây khó hiểu hay mâu thuẫn cho trẻ.

**Lớp tự động** (trong `content:check`, không dùng AI; mọi so khớp chuẩn hoá Unicode NFC; **miễn khối `passage`** vì văn bản nguyên tác):
- Ký hiệu theo SGK Việt Nam, chỉ kiểm trong `formula.tex`, `check.expr` và đoạn chữ dạng số–toán tử–số: nhân `·`, chia `:`; cấm `×`, `*`, `÷`, `/`, `\times`, `\div`. Số từ 4 chữ số (ngưỡng trong config) phân cách hàng nghìn bằng dấu cách không ngắt dòng (U+202F; trong TeX là `\,`); miễn năm, số trang, id. Thập phân dùng dấu phẩy.
- Thuật ngữ theo `content/glossary/<subject>.json` (`{ terms: [{ term, forbidden[], color?, prerequisite? }], names[] }`, `names` là tên riêng không phải âm tiết tiếng Việt): cấm từ đồng nghĩa không chuẩn; `Concept.name` khớp `term` thì `Concept.color` phải khớp `color` (nhất quán màu giữa các bài); `sourceRef` của section hay card ghi "Kiến thức nền (<cấp>)" (dạy kiến thức lớp dưới khi trang SGK không định nghĩa) thì section, card đó phải có khái niệm mà `term` mang `prerequisite` đúng cấp đó (hiện chỉ có "tiểu học").
- Chặn tiếng Anh theo allowlist: mọi token chữ phải là âm tiết tiếng Việt hợp lệ (kiểm theo quy tắc âm đầu + vần + dấu) hoặc có trong glossary / danh sách tên riêng.
- Độ dài: câu ≤ 25 âm tiết (không đếm công thức; tách câu có danh sách viết tắt như "tr.", "SGK"); `note` ≤ 2 câu.
- Recap và card (ngưỡng trong `src/content/lint/config.ts`): `caption` của `Section.recap` và `Card.recap` ≤ 2 câu; mỗi card có ≥ 3 exercise (tính cả bước của `openEnded`) để phiên ôn đổi được câu hỏi.
- Luật soạn bài (bỏ qua bài fixture, vốn để thử mọi đường hiển thị): recap không phải `visual` có `caption` → fail; card có hơn 1 câu trong `practiceIds` của các section → fail; màn chỉ một `note` hay một `formula` ngoài `group` → cảnh báo; câu trong kho ôn có cùng tập số trong đề với câu luyện tập của card → cảnh báo; visual `fixture.*` (chỗ giữ tạm trong khung bài mới) → cảnh báo khi `draft`, fail khi `published`, và `content:hash --approve` từ chối.
- Môn có `rules.checkExpr` (hiện là Toán): `numeric`/`choice` có `check.expr` (vd `"2^3·2^2"`, parser nhỏ hỗ trợ `· : ^ ( )`); script tính lại và so với đáp án. Bài của môn đó bắt buộc `check.expr` cho mọi `numeric`. `choice` chọn cách so qua `check.relation`: `equal` (mặc định), `notEqual` ("kết quả nào sai"), `max`/`min` (không cần `expr`), `holds`/`fails` khi mỗi lựa chọn là một phép so sánh; mọi lựa chọn được tính, nhiễu cũng thoả → fail; `choice` Toán mà mọi lựa chọn là phép so sánh tính được thì bắt buộc có `check`.
- Gợi ý và màu: `hints.highlight` trỏ vào lựa chọn, vùng hay câu nằm trong `answer` → fail; trong `choice`, tập màu khái niệm của các đáp án tách hẳn tập màu của các nhiễu → fail.
- Đánh số theo sách: `number` (Bài 4) và `chapter` (Chương I) là tuỳ chọn, chỉ điền khi sách in số; trang môn hiện "Chương I · Bài 4", tiêu đề bài "Bài 4: …" (bài con của bài sách đã tách: "Chương IV · Bài 19 (phần 1)", "Bài 19 (phần 1): …"), tiêu đề phần trong player "Phần n: …" (chữ dựng ở `src/lib/lesson-label.ts`).
- Hướng dẫn thao tác: `group` có `guide` (`tapRegion`, `tapText`, `match`, `order`, `manipulate`, `fillBlankBank`, `numericPower`) là màn dạy thao tác; câu đầu tiên dùng thao tác mà chưa có màn đó ở section trước hay cùng section, hay ở bài đứng trước trong thứ tự app (môn theo `subjects.json`, rồi `order`) → cảnh báo.
- Câu quy tắc: `note` có `rule: true` phải được recap của section lặp nguyên văn; câu recap (section, card) giống quá nửa số từ của câu quy tắc mà không nguyên văn → fail.
- Chép sách: có lớp chữ `sources/<môn>/<bài>/p*.txt` thì chữ của bài trùng từ nửa số cụm 5 từ với sách → cảnh báo. Bài `kind: "review"` được miễn (xem bên dưới).
- Bài ôn tập chương: `kind: "review"` là bài "Ôn tập chương" của sách, chép nguyên văn đề các bài tập của sách (câu nào chép thì có `bookRef`); phần nhắc lại, gợi ý, giải thích, mẹo vẫn là lời của bài. Luật `[book-ref]`: bài không có `kind: "review"` mà có câu mang `bookRef` → fail. Trong bài ôn tập, câu có `bookRef` không bị `[length]` (giới hạn 25 âm tiết, số câu của `note`) ở chữ trong `prompt`, `options`, `segments`, `left`, `right`, `items`; mọi luật khác (`[vietnamese]`, `[numbers]`, `[symbols]`, `[glossary]`, `[explain]`…) vẫn áp. Bài ôn tập không chạy `[textbook-copy]`.
- Giải thích và tổng quan: `explain.text` và mỗi lý do trong `wrong` ≤ 3 câu; `wrong` chỉ ở `choice`, trỏ option có thật và không phải đáp án (`[explain]`); bài mới thiếu `explain` ở một câu chấm được → fail; bài `published` mới thiếu `overview` → fail (bài trong `legacy-lessons.json` chỉ cảnh báo). Tổng quan có nối với đời sống không chỉ review kiểm được (trục 3 của checklist): máy chỉ kiểm có mặt, đủ trường và `whyItMatters` một câu.
- Mỗi luật trên trỏ tới mục tương ứng trong `docs/lessons-learned/` (lỗi đã gặp nhiều lần mà luật sinh ra để chặn).
- Môn có `rules.verbatimPassage` (hiện là Ngữ văn): mọi khối `passage` (cả đoạn trích trong đề bài) nằm nguyên trong `source-passage.txt` (cạnh `lesson.json`) sau chuẩn hoá (NFC, dấu ngoặc kép, gạch nối, xuống dòng); lệch → fail. `source-passage.txt` do quản trị viên duyệt một lần với ảnh gốc.
- Mẹo: `tips.json` có `lessonId` đúng, id bắt đầu bằng id bài, không trùng id khối `tip`, `visualId` có trong registry, chữ qua cùng luật Việt (`[tips]`); cổng review của tệp như bên dưới.
- Cổng review: bài `published` phải có `reviewedHash` bằng hash nội dung hiện tại (đã chuẩn hoá, không tính `status`/`reviewedHash`); sửa bài sau review → fail cho tới khi review lại.

**Lớp review độc lập** (skill `lesson-review`, chạy trong subagent mới, không phải agent đã soạn bài):
- Khớp nguồn: mỗi section/card đối chiếu `sourceRef` với tài liệu gốc; nội dung ngoài phạm vi bài (vd số mũ âm ở lớp 6) hoặc không có trong sách bị loại.
- Đúng kiến thức: mỗi câu hỏi có đúng một đáp án đúng; câu đọc hiểu có câu trích trong văn bản làm căn cứ.
- Ngôn từ lớp 6: không phủ định kép, không câu đánh đố; đáp án nhiễu hợp lý, không bẫy. Từ Hán Việt khó chỉ ghi mức Góp ý (không có nguồn chuẩn để chặn).
- Nhất quán: một khái niệm một từ, một màu trong bài và giữa các bài; gợi ý nấc 1 không lộ đáp án; `hints` khớp đúng phần trẻ có thể sai.
- Mỗi kết luận kèm trích dẫn: vị trí trong `lesson.json` + trang nguồn (ảnh nguồn png hoặc jpg đặt tên theo trang, vd `sources/math/luy-thua/p22.png`; `review.md` chỉ trích vị trí, không chép dài chữ SGK). Kết quả ghi `review.md` với mức Nghiêm trọng / Nên sửa / Góp ý.

**Vòng review** (chi tiết trong skill `lesson-review`):
- Vòng 1–2 soát toàn bài, song song: bài > 4 section chia 3 nhóm section liên tiếp, mỗi nhóm một reviewer mới (đọc trang nguồn của nhóm, cả glossary và mọi recap); rồi một subagent tổng hợp mới chỉ đọc phát hiện đã gộp cùng mọi câu quy tắc, recap, thuật ngữ để bắt mâu thuẫn giữa các phần, và ghi một `review.md`.
- Từ vòng 3 chỉ soát phần đổi: `pnpm content:diff <bài>` so với bản đã review (hash ghi trong `review.md` bởi `content:hash --mark`/`--approve`, nội dung đọc lại từ lịch sử git, nên commit bài sau mỗi vòng); một reviewer mới soát diff và các mục cùng section.
- Video: câu quy tắc, câu trích văn bản đã được `video:build` so nguyên văn; review video chỉ soát lời dẫn, chuyển cảnh, số và clip.

**Cổng xuất bản:** `draft` → review hết lỗi Nghiêm trọng → skill ghi `reviewedHash` và đặt `published`. Bật `REQUIRE_OWNER_APPROVAL` trong config thì skill chỉ ghi `reviewedHash`, quản trị viên đặt `published`. App chỉ hiển thị bài `published`; bài `_fixture` chỉ có khi `CONTENT_INCLUDE_FIXTURE=1` (dev, test).

### 5.2 Tám dạng bài tập (`src/exercises/`)

| type | Mô tả | Chấm |
|---|---|---|
| `choice` | Chọn 1 hoặc nhiều đáp án, đáp án là chữ/công thức/hình | So khớp tập đáp án |
| `numeric` | Nhập số bằng bàn phím số lớn trên màn hình | So số (chấp nhận "−5" và "-5"), hỗ trợ dạng luỹ thừa (cơ số + số mũ). Phím "−" chỉ hiện khi `allowNegative: true`; đáp án âm mà thiếu cờ này thì `content:check` báo lỗi. `check.expr` để lint tính lại đáp án |
| `match` | Kéo thả ghép cặp (có chạm-chọn-rồi-chạm-đặt thay cho kéo) | Mọi cặp đúng |
| `order` | Sắp xếp thứ tự | Đúng thứ tự |
| `fillBlank` | Điền chỗ trống (ngân hàng từ hoặc nhập) | So khớp từng ô; chuẩn hoá Unicode NFC cả hai phía, khoảng trắng, hoa thường; giữ dấu |
| `tapText` | Chạm vào câu/cụm từ trong đoạn văn | Tập vùng chạm đúng |
| `tapRegion` | Chạm vùng trên bản đồ/hình vẽ | Tập vùng chạm đúng |
| `manipulate` | Thao tác trực quan (kéo chấm, trượt thanh…) | `validatorId` trong registry của visual |

`openEnded` là dạng tổ hợp: chuỗi bước dựng từ 8 dạng trên + một bước viết có khung + rubric. Bước nhỏ chấm tự động; bước viết do AI nhận xét.

### 5.3 Phản hồi 3 nấc khi sai
| Lần sai | Phản hồi |
|---|---|
| 1 | Ô trả lời rung nhẹ, viền cam. Các `hints.highlight` sáng lên theo màu khái niệm. Cú nói một câu động viên (bong bóng + giọng đọc). |
| 2 | Phát `hintVisualId` (animation tách bài toán thành hình). Không có visual → highlight đậm hơn. Linh vật biểu cảm "gợi ý". |
| 3 | Phát `solutionVisualId` tới đáp án. Không có visual → mỗi dạng bài tự hiện đáp án đúng ngay trên vùng trả lời (`revealAnswer`), rồi xoá. Trẻ **phải tự nhập lại** đáp án mới qua. |

**Sai không sửa hộ đáp án của bé.** Sau mỗi lần "Kiểm tra" sai, đáp án giữ đúng như bé để lại, ở mọi dạng bài (chọn, chạm câu, chạm vùng, nối, sắp xếp, điền, số, thao tác): máy không bỏ chọn, không thêm, không đổi gì. Ở dạng chọn nhiều ô, chạm câu và chạm vùng, ô bé đang chọn mà sai được đánh dấu (viền cam nét đứt, vòng cam nét đứt ở vùng chạm) và vẫn đang được chọn; bé tự bỏ chọn thì dấu mất theo. Ô đúng mà bé chưa chọn không bao giờ được đánh dấu hay chọn hộ; chỉ nấc 3 hoặc "Bỏ qua" mới hiện đáp án (`machine.ts` không bao giờ sửa `input` sau một lần chấm sai; `tests/exercises/machine.test.ts` khoá điều này cho cả tám dạng).

**Giải thích sau mỗi câu trả lời.** Khi câu đã có đáp án trên màn (đúng; sau lần sai thứ 3; sau "Bỏ qua"; xem lại câu đã xong) khung "Giải thích" hiện ngay dưới thẻ trả lời, trên thanh nút cố định, nên "Tiếp" luôn bấm được. Câu có `explain`: hiện `text`, `tex` và `visualId`; ở `choice`, mỗi lý do trong `wrong` hiện cạnh nội dung của đúng phương án đó. Câu chưa có `explain` (bài cũ) hiện khung "Lời giải" suy từ nội dung có sẵn: hình lời giải (`solutionVisualId`, bỏ khi đang hiện ở nấc 3) và dòng "Đáp án" dựng từ đáp án (`src/exercises/explanation.ts`). "Bỏ qua" không đi tiếp ngay: nó mở đáp án và giải thích như sau lần sai thứ 3 (cú im lặng), nút còn lại là "Tiếp", kết quả vẫn là bỏ qua (không chấm, không tính là sai).

`hintVisualId`/`solutionVisualId` không bắt buộc: chỉ làm cho câu mà hình giúp hiểu rõ hơn. Fallback trên dùng chung trong `ExerciseFrame`.

Đúng: viền xanh lá + dấu ✓, pháo giấy trên thẻ trả lời (bỏ khi giảm chuyển động), nhạc vui ngắn rồi cú đọc lời khen đang hiện trong bong bóng — mọi lần đúng, kể cả đúng sau khi sai hay khi tự nhập lại. Sau khi đúng, cạnh "Tiếp" có nút phụ "Làm lại": làm lại bài từ đầu (xếp lại đáp án, lời khen mới) để luyện; lần làm lại không rating, không ghi là "đúng ngay lần đầu", không đổi tiến độ — kết quả được ghi vẫn là của lần làm đầu.

Âm thanh (`feedbackCue` trong `src/exercises/feedback.ts`): mỗi lần bấm "Kiểm tra" đều có tiếng. Sai lần 1: câu động viên. Sai lần 2, 3: tiếng sai ngắn, nhỏ hơn giọng (`wrong-answer`) rồi câu của cú ở nấc đó. Sai khi đang tự nhập lại: chỉ tiếng sai (cú không nói). Đúng: nhạc vui rồi lời khen. Mọi câu hiện trong bong bóng đều có giọng đọc, và giọng đọc đúng câu đang hiện. Tiếng mới dừng tiếng đang phát, không chồng giọng.

Tạo âm thanh: câu của cú nằm ở `src/mascot/lines.ts`; thông số ở `scripts/lib/sound-spec.ts`. `pnpm sounds:build` tạo tiếng chạm và tiếng nút (ffmpeg), nhập các clip ngoài trong `assets/sounds/` (tiếng đúng, tiếng sai, xong phần, hai tiếng ăn mừng sticker, tạm biệt, các bài nhạc ở bảng sticker và nhạc nền; cắt khoảng lặng đầu và chuẩn hoá độ lớn) và giọng đọc (Gemini TTS `gemini-3.1-flash-tts-preview`, giọng "Sulafat": ấm, nhịp chậm sẵn, không cần giãn; mọi câu đọc trong một yêu cầu rồi cắt ở các khoảng lặng dài để cùng một giọng điệu; từng câu kiểm bằng Whisper phải khớp đúng từng chữ kể cả dấu thanh, không khớp thì đọc lại). Mọi file cùng một định dạng (AAC mono 44,1 kHz 96 kb/s) và cùng độ lớn: giọng −16 LUFS (EBU R128, một mức khuếch đại cố định, không nén), tiếng sai khoảng −20 LUFS, nhạc −22 LUFS, nhạc nền −26 LUFS, đỉnh thật dưới −1 dBFS. Ra `public/sounds/` kèm `manifest.json` (có commit): mỗi id một file, dùng chung mọi nơi; mỗi mục lưu sha256 của nguồn (chữ + engine + thông số), engine, độ khớp Whisper, LUFS và đỉnh, nên chỉ tạo lại câu đã đổi, và test báo lỗi khi sửa câu mà chưa build lại. Khoá API: `GEMINI_API_KEY` hoặc `~/.config/gemini/api_key`. Phát bằng `HTMLAudioElement` trong audio session "playback" để iPhone/iPad ở chế độ im lặng vẫn nghe; mở khoá ở lần chạm đầu.

Công tắc âm thanh: một setting theo từng con (`soundEnabled`), một nút loa tròn 48px luôn ở đầu phải hàng trên cùng: header trình học phần và ôn bài, hàng trên của trang bài và trang môn, header trang chủ.

### 5.4 Ôn tập theo yêu cầu (`src/srs/`)
Bé hoặc phụ huynh **chủ động** bấm "Ôn bài này" trong trang bài, lúc nào cũng được, bao nhiêu lần cũng được. Không có lịch, không khoá theo ngày, không giới hạn số lần. FSRS chỉ dùng để **ước lượng mức nhớ** của từng thẻ và chọn thẻ nào để hỏi.

- **Rating:** đúng ngay lần đầu = `Good`; sai ở lần đầu (kể cả đúng sau gợi ý) = `Again`. Không dùng `Easy`/`Hard`. Gợi ý 3 nấc vẫn chạy để dạy, không ảnh hưởng rating.
- **Câu nào được rating:** câu trong `practiceIds` của phần học và câu trong phiên ôn; rating áp cho mọi `cardIds` của exercise. Câu `checkIds` không rating.
- **Mở thẻ:** câu luyện tập trong phần học là lần gặp đầu tiên của card. Chỉ card đã mở mới vào phiên ôn.
- **Chọn thẻ khi bấm ôn:** các card đã mở của bài, sắp theo mức nhớ ước lượng tại thời điểm bấm (`retrievability` của ts-fsrs, thấp nhất trước), lấy tối đa `REVIEW_SESSION_SIZE` = 10. Mỗi card lấy 1 exercise ngẫu nhiên từ index card → exercises, ưu tiên lần lượt: chưa có trong phiên này, không vừa làm trong `REVIEW_RECENT_MINUTES` = 30 phút gần nhất (vd phần luyện tập vừa xong), không dùng ở lần ôn trước, là câu trong "kho" (không thuộc `practiceIds` của phần mở card đó); ưu tiên nào làm hết lựa chọn thì bỏ qua ưu tiên đó. Bài ít hơn 10 card thì ôn hết.
- **Hỏi lại trong phiên:** card bị `Again` được hỏi lại một lần ở cuối phiên bằng exercise khác (nếu có; không thì cùng exercise). Lần hỏi lại chỉ để dạy, không rating.
- **Gợi ý nhẹ (không ép):** thẻ bài hiển thị số card có mức nhớ dưới `FORGETTING_THRESHOLD` (mặc định 0.7), vd "6 thẻ sắp quên". Không thông báo, không chặn.
- **Thời gian:** mọi code lấy thời điểm hiện tại qua `now()` trong `src/lib/time.ts` (thay được trong test).
- **Config** (`src/lib/config.ts`): `request_retention` 0.9, `enable_short_term` false, `REVIEW_SESSION_SIZE` 10, `FORGETTING_THRESHOLD` 0.7.

### 5.5 Luồng học của trẻ
- **Chọn hồ sơ:** sau khi mở khoá, chọn hồ sơ con (avatar lớn); máy nhớ lựa chọn cuối, đổi được từ góc màn hình. Mỗi lần mở app mới (tab mới, phiên trình duyệt mới, mỗi lần mở app đã cài trên màn hình chính) trang chủ đưa tới màn chọn hồ sơ trước, kể cả khi máy nhớ bé: "Hôm nay ai học?" (nhiều bé) hoặc "Chào <tên>! Học thôi nào" với một thẻ lớn (một bé). Chạm vào bé là lượt chạm mở khoá âm thanh (iOS chỉ cho phát tiếng trong một lượt chạm): nhạc nền vào và cú chào "Cú cú!" (theo công tắc âm thanh của bé), rồi vào trang chủ. Dấu "đã mở" nằm trong `sessionStorage` (`src/lib/cold-launch.ts`), đặt khi chọn hoặc tạo hồ sơ, nên tải lại trang hay đi lại trong app không hỏi lại. Mở thẳng một liên kết vào bài (`/lessons/...`) hay màn khác thì vào đúng màn đó, không qua màn chọn, và cũng đặt dấu, nên về trang chủ sau đó không hỏi lại. Không đọc được `sessionStorage` thì coi như đã mở: màn chọn là lời chào, không bao giờ là cửa chặn.
- **Chọn lớp:** màn `/grades` ("Chọn lớp", nút "Lớp n" dưới lời chào ở trang chủ mở màn này) có 12 ô lớp trên nền vũ trụ, mỗi ô một icon và số lớp; ô lớp đã có bài xuất bản bấm được (lớp đang học có dấu ✓ và viền), chọn thì lưu `grade` vào hồ sơ rồi về trang chủ; các lớp khác hiện khoá và dòng "Sắp ra mắt", không bấm được. Form tạo và sửa hồ sơ có thêm nhóm "Bạn học lớp mấy?" (12 ô số, chỉ lớp đã mở chọn được, lớp khoá mờ nét đứt kèm ổ khoá). Đổi lớp chỉ đổi `grade` của hồ sơ (`setProfileGrade`, `updateProfile`), tiến độ giữ nguyên.
- **Sửa hồ sơ:** gia đình đổi được tên, avatar và lớp sau khi tạo. Lối vào duy nhất là nút nhỏ "Sửa" dưới mỗi thẻ ở màn chọn hồ sơ ("Hôm nay ai học?"), tới được từ nút "Đổi hồ sơ" ở trang chủ. Nút mở lại form tạo hồ sơ (cùng ô tên và lưới avatar, tên giới hạn `PROFILE_NAME_MAX_LENGTH`, không cho tên trống; avatar phát tiếng riêng khi chọn) điền sẵn giá trị hiện tại, tiêu đề "Sửa hồ sơ", nút "Lưu" và "Quay lại" không lưu. Lưu xong màn trở về danh sách, không đổi bé đang học. Chỉ bản ghi hồ sơ đổi (`updateProfile` trong `src/progress/hooks.ts`): `id` (là `childId` của mọi bản ghi tiến độ), bộ sách và ngày tạo giữ nguyên nên tiến độ không mất. Tên không cần khác tên bé khác (không có kiểm trùng khi tạo). Chưa có xoá hồ sơ.
- **Trang chủ:** lời chào kèm avatar của bé + linh vật (chuỗi ngày chỉ còn ở trang phụ huynh) + lưới danh hiệu ngay dưới lời chào ("Danh hiệu của bạn", "Đã nhận n/m": cao tối đa hai hàng ở mọi khổ màn hình, sticker mới nhận nhất trước rồi các sticker chưa nhận dạng bóng xám tô dần từ dưới lên theo số phần đã xong, nên không bao giờ trống và không đẩy nội dung học xuống khi có thêm sticker; quá hai hàng thì ô "+k" và "Xem tất cả" mở bộ sưu tập đủ sticker; chạm một sticker mở bảng chi tiết có hiệu ứng lặp, tiếng và nút "Nghe nhạc" phát một bài ngẫu nhiên, xem `docs/design-system.md` mục Danh hiệu trên trang chủ) + thẻ "Học tiếp" vào thẳng phần đầu tiên chưa xong của bài (bài học gần nhất chưa xong; học xong một bài thì bài kế của môn đó; chưa học gì thì bài đầu tiên, trẻ mới thấy "Bắt đầu học"; nếu một phần sau đang học dở thì thêm dòng phụ "Đang dở: Phần k") + lưới môn học của lớp bé đang học (luôn có dòng phụ: "Sắp ra mắt", "n bài · Chưa học", "n bài · Đang học phần k", "Xong d/n bài") (môn chưa có bài xuất bản là ô khoá: ổ khoá, nền sáng, không bấm được, không dẫn tới trang trống) + nhắc môn lâu chưa học (> 3 ngày).
- **Giới thiệu bài:** bài có `overview` thì lần đầu mở bài (từ danh sách bài, hay từ thẻ "Học tiếp"/"Bắt đầu học" ở trang chủ khi trẻ chưa xem) hiện màn giới thiệu trước: cú, tình huống đời thường (kèm hình nếu có), "Bài này nói về", "Học xong bài này, bạn sẽ:" với danh sách ý có dấu tích, câu "vì sao có ích", nút chính "Bắt đầu học" (đã học dở: "Học tiếp") vào phần kế tiếp, nút phụ "Xem các phần của bài". Có `narration` thì có trình phát nút lớn, không tự phát, chữ đang đọc được tô (`--color-reading`); không có thì màn chỉ có chữ. Đã xem thì trang bài có nút "Giới thiệu bài" để mở lại. Trạng thái "đã xem" là setting theo từng trẻ (`overviewSeen:<id bài>`).
- **Mẹo hay:** bài có mẹo thì trang bài có nút phụ "Mẹo hay" (dưới "Giới thiệu bài") mở trang `/lessons/<id>/tips`: mọi mẹo của bài, mỗi mẹo một thẻ vàng có nhãn loại ("Mẹo làm nhanh", "Mẹo hiểu nhanh", "Mẹo tránh sai") và biểu tượng. Mẹo trong section là một màn của player (chấm tiến độ tên "Mẹo").
- **Không dùng giọng máy của trình duyệt:** app không đọc chữ bằng Web Speech API (giọng máy nghe như robot). Mọi tiếng nói là file ghi sẵn: lời giới thiệu bài (`narration`), video bài và các câu thoại của cú (`public/sounds/`).
- **Bài** → nút "Ôn bài này" (khi đã có card mở; nút phụ khi bài còn phần phải học) + danh sách phần (chưa học / đang học / xong) + sticker của bài tô màu theo số phần đã xong. Không khoá thứ tự phần: trẻ mở được phần nào cũng được, nhưng "Học tiếp" (nhãn trên danh sách, thẻ trang chủ, nút "Học phần tiếp" ở màn xong phần) luôn trỏ phần đầu tiên chưa xong theo thứ tự bài, kể cả khi một phần sau đang học dở → phần: các block giải thích tuần tự (bấm "Tiếp") → check → luyện tập → nhắc lại (`Section.recap`) → màn xong phần (sticker tô thêm, "Xong d/n phần") → nhận sticker khi xong mọi phần của bài.
- **Màn lý thuyết "cùng làm" có chạm:** một màn lý thuyết mà bé phải tự làm (chọn đúng các số, cắt dải, chạm phép tính làm trước) là một bước có hướng dẫn: (a) tôn trọng số lượng cần chọn (cần 1 thì chạm số khác sẽ thay số cũ, không bao giờ "Đã chọn 3/1"; cần n thì chạm thêm đẩy số chọn sớm nhất ra); (b) phản hồi ngay khi bé làm xong: đúng thì tô xanh, dấu ✓, nhạc vui và câu chốt của màn, các ô khoá lại, bé thấy mình đúng rồi tự bấm "Tiếp"; sai thì đánh dấu nhẹ (cam nét đứt), tiếng sai ngắn và lời nhắc "thử lại", không lộ đáp án; (c) "Tiếp" tắt cho tới khi bé làm đúng hoặc bấm nút phụ "Xem cách làm" (nằm trong thanh dưới, bên trái "Tiếp", như nút "Bỏ qua" của bài tập; hiện đáp án, tô xanh, câu trung tính "Các số tô xanh là đáp án", không khen bé; rồi "Tiếp" bấm được). Đã làm đúng một lần thì "Tiếp" không khoá lại dù bé chơi lại. Màn đã qua xem lại bằng chấm tiến độ không bị giữ. Cơ chế dùng chung là `GuidedStepProvider` bọc màn trong `section-player.tsx` và hook `useGuidedTask(finished, show)` trong visual (`src/visuals/shared/guided-step.tsx`; `show` là hàm hiện đáp án, thanh dưới của player gọi nó); visual nào là một "cùng làm" thì gọi hook. Phần chung (câu chốt xanh, nút chọn có giới hạn, nhạc đúng/sai) ở `src/visuals/shared/guided-feedback.tsx`: `useGuidedPick` cho màn chọn, `useGuidedGoal` cho màn chỉnh nút tăng giảm hay làm theo từng bước. Một visual dùng chung cho bài tập và màn lý thuyết chỉ phán khi không có `params` (bài tập có `params` và không bao giờ lộ đúng sai). Hiện dùng ở: `Chips` có `wants` (`src/visuals/shared/pick-chips.tsx`), `CutTry` có `goal` (bài ước chung), `TryIt` (bài thứ tự thực hiện phép tính), bài tập hợp (chọn đồ vào hộp bút, đặt dấu chấm phẩy, vẽ kí hiệu ∈ ∉ theo nét, đổi x xem cả hai trường hợp), bài cộng trừ (chọn cặp số tròn, chuyển số, làm một cột), bài nhân chia (xếp lưới, tách thừa số, điền cột nhân, chia từng vòng, đặt tính chia), bài luỹ thừa (bàn cờ tới ô cuối, ghép hai nhóm thừa số). Màn chỉ để xem hay đổi số tự do (tạo luỹ thừa, bình phương lập phương, bớt luỹ thừa, luỹ thừa của 10), màn chưa khai hook khác (hộp chữ số, túi chia, ngữ văn) thì "Tiếp" không chờ.
- **Nhãn loại màn:** mỗi màn của player có nhãn "Lý thuyết", "Bài tập · Kiểm tra nhanh", "Bài tập · Luyện tập" hay "Ôn tập"; chấm tiến độ của màn đã qua bấm được để nhảy lại, có tên ("Lý thuyết 1", "Câu 2"). Màn đầu của phần có phần giới thiệu thì "Quay lại" về trang giới thiệu.
- **Bỏ qua:** nút "Bỏ qua" ở mọi bài tập (kiểm tra nhanh, luyện tập, ôn tập): hiện đáp án và giải thích rồi "Tiếp" đi tiếp không chấm, ghi lượt làm với `context: "skipped"` (không cập nhật FSRS, không tính là sai, câu luyện tập bỏ qua không mở thẻ); trang phụ huynh có mục "Câu đã bỏ qua".
- **Sticker:** chạm sticker ở trang chủ có hiệu ứng nảy, tia sáng (đã nhận), âm thanh và mở bảng chi tiết (tên, bài, "Xong d/n phần", cách nhận, nút mở bài).
- **Sticker không có nghĩa là bài xong:** sticker là danh hiệu đã nhận và được giữ kể cả khi bài được học lại, nên "bài xong", "Học tiếp", vòng tiến độ của môn và trạng thái môn chỉ đọc bản ghi các phần (`sectionProgress`), không đọc sticker. Sticker vẫn tô đủ màu ở kệ sticker, trang bài và trang phụ huynh.
- **Ôn xong:** cú vui + "Bạn vừa ôn n câu" (n đếm mọi câu đã hỏi, gồm câu hỏi lại) + tiến độ bài (sticker tô theo số phần đã xong, "Xong d/n phần").
- **Chuỗi ngày:** tính theo ngày giờ Việt Nam; tuần từ thứ Hai đến Chủ nhật; mỗi tuần có 1 "ngày nghỉ" tự động giữ chuỗi.
- **Bộ sách:** hồ sơ mới lấy bộ sách mặc định trong `subjects.json`; màn đổi bộ sách chỉ làm khi một môn có từ hai bộ trở lên trong cùng một lớp.

### 5.6 Câu hỏi mở và AI nhận xét
- Bước viết: câu mở đầu gợi ý sẵn, ô viết lớn (dùng được đọc chính tả của iPad), hiện rubric dạng checklist.
- `POST /api/writing-review` → `AiReviewer` (adapter Gemini) → JSON theo schema `{ checks: [{ criterion, met, highlights[] }], praise, nextStep }`, validate bằng zod. Hiển thị checklist tô màu trên chính bài viết.
- Hạn mức: `aiDailyLimit` của gia đình trong `families.json` (mặc định `AI_DAILY_LIMIT_PER_FAMILY` = 5), đếm ở `usage/<familyId>/<yyyy-mm-dd>.json` (ngày giờ Việt Nam); tạo lần đầu bằng `If-None-Match: *`, cập nhật bằng `If-Match`, 412 → đọc lại và thử lại tối đa 3 lần.
- Hết hạn mức / lỗi / phản hồi sai schema → trẻ tự tick checklist. Mọi bài viết lưu vào tiến độ, phụ huynh đọc được.
- Chỉ gửi đề + bài viết + rubric; không gửi tên hay thông tin cá nhân.

### 5.7 Tiến độ và đồng bộ
- **Local-first:** mọi thao tác ghi vào Dexie trước, UI không chờ mạng, màn hình của trẻ không hiện gì về đồng bộ. Bản ghi Dexie giữ `familyId: "local"`; máy nhớ gia đình mình đồng bộ với (setting thiết bị `syncFamilyId`, ghi ở lần đồng bộ thành công đầu tiên). Không đặt biến R2 thì đồng bộ tắt im lặng và app chạy như khi chưa có đồng bộ.
- **Ba loại tài liệu** (zod, `src/sync/schema.ts`; mỗi tài liệu có `schema` và `version`, tài liệu có `version` mới hơn code biết thì không gộp, không ghi):
  - tài liệu hồ sơ của gia đình: danh sách hồ sơ con (tối đa 12);
  - tài liệu chính của từng con, chỉ chứa trạng thái: thẻ ôn, tiến độ và vị trí từng phần, sticker, ngày học, mốc học lại, dấu "đã xem tổng quan", danh sách tháng có lịch sử. Khoảng 0,3 MB sau một năm, giới hạn 1 MB, trang phụ huynh cảnh báo ở 70%;
  - tài liệu lịch sử của từng con theo tháng: lượt làm và bài viết, chỉ thêm, không bao giờ cắt. Giới hạn 512 KB mỗi tháng. Thiết bị mới tải các tháng cũ ngầm, tháng mới nhất trước, trong lúc con đã học được.
- **Kích hoạt sync:** sau khi xong một phần hoặc phiên ôn, sau khi tạo hay sửa hồ sơ, chọn lớp và học lại một bài (gom các lần gọi trong vài giây thành một), mỗi 5 phút khi app mở, khi có mạng lại, khi trang bị ẩn, khi mở app (đồng bộ đủ mọi tháng) và sau khi nhập bản sao lưu. Mỗi lúc một lần đồng bộ; hai tab của một máy nhường nhau bằng khoá Web Locks. Một tài liệu cần gửi khi mã băm của nó khác mã băm lưu ở lần gửi trước (`syncState`); không dùng hook Dexie.
- **Giao thức** (`/api/sync`, một route cho cả ba loại tài liệu: `?doc=profile`, `?child=<id>`, `?child=<id>&month=<yyyy-mm>`):
  - `GET` trả `{ doc, etag }`; kèm `known=<etag>` mà chưa đổi thì trả `{ unchanged }` không có body, nên lần hỏi 5 phút rất rẻ.
  - `PUT { doc, ifMatch }` để thay, `PUT { doc, ifNoneMatch: "*" }` để tạo. Server ghi bucket có điều kiện; điều kiện sai thì 412 kèm tài liệu hiện tại, client gộp rồi gửi lại (tối đa 3 vòng, chờ ngẫu nhiên 100 đến 500 ms); vẫn lỗi thì tài liệu giữ trạng thái cần gửi cho lần sau.
  - Server không gộp. Nó kiểm: cookie ra đúng một gia đình (id gia đình chỉ lấy từ cookie, không từ request), `Origin` cùng domain, `content-type`, cỡ body (cắt khi đọc), schema chặt, id trong header khớp, con có trong hồ sơ gia đình, thời gian ở tương lai bị kẹp về giờ server, tài liệu lịch sử không được thiếu bản ghi đã lưu (409 `shrink`), 30 PUT và 120 GET mỗi phút cho mỗi gia đình trên mỗi instance. Không ghi nội dung tài liệu vào log.
- **Quy tắc gộp** (hàm thuần `src/sync/merge.ts`, giao hoán, kết hợp, lũy đẳng, có property test): dấu học lại áp lên từng phía trước, rồi mỗi trường chọn theo giờ.
  - Thẻ ôn: bản có `lastReviewAt` mới hơn; hoà thì nhiều `reps` hơn.
  - Phần học: `doneAt` là giờ muộn hơn trong hai bên (xong ở đâu thì xong), vị trí lấy từ bản cập nhật muộn hơn.
  - Sticker, ngày học, tháng có lịch sử: hợp tập; học lại không xoá chúng.
  - Dấu "đã xem tổng quan": giờ muộn hơn.
  - Lượt làm và bài viết (tài liệu tháng): hợp theo id.
  - Học lại một bài: `resetLessonProgress` ghi dấu học lại (bài, giờ) trong cùng giao dịch xoá. Bản ghi của bài đó có giờ không muộn hơn dấu thì bị bỏ khi gộp; tài liệu tháng cũ không bao giờ bị ghi lại, lượt làm trước dấu chỉ bị ẩn khi đọc (`visibleHistory`), nên việc học sau khi học lại ở máy khác vẫn được giữ.
- **Bản chụp hằng ngày:** chỉ cho tài liệu chính. Trước lần `PUT` đầu tiên của một ngày (giờ VN), server chép tài liệu đang lưu sang `snapshots/<familyId>/<childId>/<yyyy-mm-dd>.json` với `If-None-Match: *`; tệp của ngày D là trạng thái trước lần ghi đầu của ngày D. Ghi bản chụp lỗi không chặn ghi chính (chỉ log). Tài liệu lịch sử chỉ thêm nên không có bản chụp. Quy tắc lifecycle của bucket xoá `snapshots/` sau 180 ngày.
- **Đổi gia đình trên cùng máy:** nếu cookie thuộc gia đình khác với `syncFamilyId` và máy còn tiến độ chưa gửi, đồng bộ dừng và trang phụ huynh chỉ cho tải bản sao lưu; máy sạch thì có nút "Dùng máy này cho gia đình mới" (hai lần xác nhận) xoá dữ liệu trên máy rồi tải dữ liệu gia đình mới. Đồng bộ không bao giờ ghi bản ghi của gia đình này vào tài liệu của gia đình khác.
- **Trang phụ huynh:** dòng "Đồng bộ lần cuối", thông báo bằng lời thường khi kẹt (quá một ngày chưa gửi, tài liệu chính vượt 70% giới hạn, tài liệu quá lớn, app cũ hơn dữ liệu, mã gia đình bị từ chối), dòng "Đang tải lịch sử học…" khi tháng cũ chưa về. Nút xuất và nút "Nhập bản sao lưu" (tệp xuất phiên bản 1 và 2, hoặc tài liệu chính của một con, ví dụ bản chụp tải từ bucket): nhập là trộn, không xoá gì, nhập hai lần không đổi gì thêm, rồi kết quả tự đồng bộ cho các máy khác. Khôi phục một con từ bản chụp đi qua nút này, xem `docs/operations.md`.

Bố cục bucket private `tutor-progress`, một bucket cho mọi môi trường, tách bằng tiền tố khoá (chỉ hàm `syncKey` ghép khoá):
```
prod/progress/<familyId>/profile.json                         # hồ sơ con của gia đình
prod/progress/<familyId>/<childId>.json                       # tài liệu chính
prod/progress/<familyId>/<childId>/history/<yyyy-mm>.json     # lịch sử một tháng
prod/snapshots/<familyId>/<childId>/<yyyy-mm-dd>.json         # bản chụp hằng ngày
dev/…                                                          # cùng bố cục: máy dev và bản preview
test/<run-id>/…                                                # chỉ bài kiểm tra R2 thật tùy chọn
```
Tiền tố là `prod/` chỉ khi `VERCEL_ENV=production`, còn lại là `dev/`; không biến nào chọn tiền tố trực tiếp, và test khoá điều đó. Chưa dùng: `families.json`, `auth/`, `content-overlay/`, `usage/` (của các tính năng sau).

Bucket public (`R2_MEDIA_BUCKET`, domain `NEXT_PUBLIC_MEDIA_BASE_URL`, CORS cho origin của app, hỗ trợ Range):
```
video/<lessonId>/<videoId>.mp4
video/<lessonId>/<videoId>.vtt
svg/<lessonId>/<id>.svg                         # SVG nạp nhanh (đã lọc)
```

Code dùng một interface `BlobStore { get(key, { ifNoneMatch? }) → { body, etag } | { unchanged } | null; put(key, body, { ifMatch? | ifNoneMatch? }) → { etag } | { conflict }; delete(key) }` (`src/sync/store/`): adapter `r2` (API S3 của R2, request ký bằng `aws4fetch`, ETag chuẩn hoá ở một chỗ), `fs` (thư mục, cho E2E nhiều máy và chạy thử trên máy, không cho phép ở production) và `memory` (test); `delete` chỉ dành cho bài kiểm tra R2 thật và từ chối mọi khoá ngoài tiền tố `test/<run-id>/` của store đó. Chọn store qua `readSyncStoreConfig`: bốn biến `R2_*` (xem `docs/operations.md`) bật R2, `SYNC_STORE=fs:<thư mục>` hay `memory` chỉ cho máy dev và test, không đặt gì thì đồng bộ tắt.

### 5.8 Truy cập và bảo mật
- **Cổng trang:** `proxy.ts` kiểm chữ ký cookie `tutor_family`; thiếu/sai → chuyển `/unlock`. Matcher loại trừ: `/unlock`, `/install`, `/api/session`, `/sw.js`, `/serwist/*`, `/_next/static/*`, font. Cổng cho qua không cần cookie đúng các đường dẫn của `BRAND_PUBLIC_PATHS` (`src/lib/brand.ts`): `/manifest.webmanifest` và các file trong `/brand/` (icon, favicon, ảnh chia sẻ). Header `X-Robots-Tag: noindex` cho mọi response.
- **Cổng mã gia đình:** không có cơ sở dữ liệu gia đình và không có danh sách mã: mã tự chứng minh bằng chữ ký. Mã có dạng `OWL` + phần gia đình (5 ký tự) + chữ ký (8 ký tự), viết `OWL4K7MQ-9QX2P8RT` (16 ký tự, gạch nối chỉ để dễ đọc), toàn chữ hoa và chữ số trong bảng Crockford base32 (bỏ `I`, `L`, `O`, `U` dễ nhầm với `1`, `1`, `0`, `V`). Id gia đình là phần không bí mật `OWL` + 5 ký tự (`OWL4K7MQ`); chữ ký là 40 bit đầu của HMAC-SHA256(`FAMILY_CODE_SECRET`, id gia đình). Khi nhập: bỏ dấu cách và mọi kiểu gạch nối, không phân biệt hoa thường, sau `OWL` thì `O` đọc là `0`, `I`/`L` đọc là `1`. Biến môi trường: `FAMILY_CODE_SECRET` (≥ 32 ký tự, ký mã), `SESSION_SECRET` (≥ 32 ký tự, ký cookie, phải khác `FAMILY_CODE_SECRET`), `FAMILY_CODES_REVOKED` (id gia đình bị thu hồi, cách nhau dấu phẩy; một mục sai dạng làm cổng đóng). Không đặt hai khoá ở máy dev/test: không có cổng; production thiếu hoặc sai, hoặc chỉ đặt một khoá: trả 503, không phục vụ gì. `POST /api/session { code }` kiểm Origin, tính lại chữ ký từ id trong mã (so sánh thời gian hằng), từ chối mã của gia đình bị thu hồi như mã sai, rồi đặt cookie `tutor_family` httpOnly, Secure ở production, SameSite=Lax, 1 năm; giá trị cookie là `v2.<hạn>.<id gia đình>.<dấu vân tay của mã>.<chữ ký HMAC-SHA256 bằng SESSION_SECRET>`, không chứa mã hay chữ ký của mã. Dấu vân tay là hash có khoá của chữ ký mã, nên cookie hết hiệu lực khi id bị thu hồi, khi đổi `FAMILY_CODE_SECRET` (mọi mã đổi theo) hay khi đổi `SESSION_SECRET`. `GET /api/session` (cần cookie hợp lệ, `Cache-Control: no-store`) trả `{ familyId, code }`: mã được tạo lại ở server từ id trong cookie và khoá, không lưu ở đâu; chỉ trang phụ huynh (sau PIN) hiện mã, kèm nút chép và dòng "Dùng mã này để đăng nhập trên máy khác của gia đình."; màn hình của bé không bao giờ hiện. Sai 5 lần trong 10 phút thì khoá địa chỉ đó 10 phút (đếm trong bộ nhớ từng instance, chỉ làm chậm). Chữ ký 40 bit mới là phòng thủ chính: id gia đình không bí mật, nên mỗi lần đoán (cho bất kỳ id nào) trúng với xác suất 2^-40 và trung bình cần khoảng 1,1 nghìn tỉ lần; một địa chỉ thử được tối đa 720 lần/ngày, nên 10 000 địa chỉ cùng thử (7,2 triệu lần/ngày) cần khoảng 150 000 ngày (hơn 400 năm) mới trúng một mã. Bộ đếm nằm trong bộ nhớ từng instance nên số instance nhân tốc độ đoán lên, vẫn còn nhiều chục năm; nghi bị dò thì đổi `FAMILY_CODE_SECRET`. `proxy.ts` chạy trên mọi đường dẫn trừ `/_next/static`, `/_next/image`, `favicon.ico`; `/unlock` và `/api/session` được cho qua trong code; tệp và API chưa có cookie nhận 401, trang nhận chuyển hướng tới `/unlock?next=…`; `/unlock` khi đã mở khoá chuyển về `next`. Trang phụ huynh và mọi tệp dưới `/content`, `/sounds` nằm sau cùng cổng.
- **Id gia đình:** mỗi mã mang id gia đình của nó, nên máy nào mở khoá cũng đồng bộ dưới id đó; id không bao giờ đổi sau khi gia đình đã đồng bộ (nó nằm trong khoá lưu trữ). Id gia đình của một request chỉ lấy từ cookie; đường dẫn dữ liệu do `syncKey` ghép từ id đã kiểm theo đúng dạng `OWL` + 5 ký tự, không bao giờ từ chữ của request. Cấp mã: `pnpm family:code [--count N]` in id và mã mới, `pnpm family:code --id <id>` in lại mã của một gia đình (đọc `FAMILY_CODE_SECRET` từ `.env.production.local`, không in khoá). Thu hồi một gia đình: thêm id vào `FAMILY_CODES_REVOKED` và deploy; mã và cookie của họ hết hiệu lực ở request sau, các gia đình khác không bị ảnh hưởng. Khẩn cấp (nghi lộ khoá): đổi `FAMILY_CODE_SECRET`, mọi mã đổi, id và dữ liệu giữ nguyên, chủ dự án in lại mã cho từng gia đình bằng `--id`. Runbook: `docs/operations.md`, "Mã gia đình".
- **Cài đặt đồng bộ:** trong các setting chỉ dấu "đã xem tổng quan" của từng bài đi theo con; PIN phụ huynh, công tắc âm thanh, hồ sơ đang chọn thuộc riêng từng máy.
- **PIN phụ huynh (riêng từng máy, không lên server):** trang `/parent` đọc Dexie trên máy đang dùng, kèm phần đã đồng bộ từ các máy khác. PIN 4–6 chữ số, nhập hai lần khi đặt, lưu dạng PBKDF2-HMAC-SHA256 có salt trong setting thiết bị (`src/progress/parent-pin.ts`; tự cài bằng TypeScript vì `crypto.subtle` không có khi mở qua http trong mạng LAN). Sai 5 lần → khoá 15 phút, lưu trong Dexie nên tải lại trang không gỡ khoá. Mở khoá chỉ giữ trong bộ nhớ 30 phút (tải lại trang là hỏi lại). Quên PIN → xoá dữ liệu trang web của app (mất phần chưa gửi lên của máy đó; phần đã đồng bộ tải lại sau khi nhập mã gia đình). Trang phụ huynh có nút tải và nút nhập bản sao lưu JSON tiến độ của từng con.
- **Học lại bài (trang phụ huynh, không có ở màn hình của trẻ):** ở mục "Tiến độ bài học", mỗi bài đã có dữ liệu (phần đã học, lượt làm, thẻ ôn hoặc bài viết) có nút "Học lại bài này" (chữ đỏ `--color-destructive`, vùng chạm ≥ 48px). Nút mở bảng `Sheet` hai bước, không dùng `confirm()` của trình duyệt: bước 1 nói rõ sẽ xoá tiến độ các phần và vị trí đang học, dữ liệu ôn tập, các câu đã làm kể cả câu bỏ qua, bài viết đã nộp (và dấu "đã xem tổng quan" của bài), và rằng sticker vẫn được giữ, các bài khác không đổi; bước 2 nhắc tên bài và tên con, nói không hoàn tác được, nút đỏ "Xoá và học lại". "Hủy", nút "Đóng", Escape hay chạm ngoài ở bước nào cũng không xoá gì. Xong, trang hiện dòng "Đã cho <tên> học lại bài “<bài>”. Sticker vẫn được giữ." và số liệu tự cập nhật. Một hàm `resetLessonProgress` (`src/progress/reset.ts`) xoá trong một giao dịch Dexie; giữ sticker, ngày học (chuỗi), hồ sơ và cài đặt khác, các bài khác và các con khác; không lưu lịch sử. Mỗi bảng của schema phải khai báo xoá / giữ / không liên quan nên bảng mới thêm vào mà chưa phân loại làm typecheck và test hỏng.
- **Ghi nội dung chung** (`POST/DELETE /api/content`): cần `isAdmin` **và** cookie `tutor_parent` hợp lệ.
- **POST/PUT API** kiểm header `Origin` khớp domain app.
- **SVG nạp nhanh:** lọc bằng DOMPurify (profile SVG) ở client trước khi gửi; server kiểm MIME, kích thước ≤ 200 KB, lưu vào bucket public; app **chỉ hiển thị qua `<img src>`** (trình duyệt không chạy script trong SVG nạp bằng `<img>`).
- **Secrets** chỉ ở biến môi trường Vercel / `.env.local` (gitignore), không biến nào là `NEXT_PUBLIC_*` trừ địa chỉ media và công tắc gỡ service worker: `SESSION_SECRET`, `FAMILY_CODE_SECRET`, `FAMILY_CODES_REVOKED`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET`, `GITHUB_FEEDBACK_TOKEN`, `GEMINI_API_KEY`. Public: `NEXT_PUBLIC_MEDIA_BASE_URL`, cờ bật offline `NEXT_PUBLIC_OFFLINE_ENABLED` và công tắc `NEXT_PUBLIC_OFFLINE_KILL_SWITCH` (cờ `1`, không phải bí mật). Một token R2 duy nhất của app, chỉ có quyền Object Read & Write trên bucket `tutor-progress`; việc tải media lên bucket `tutor-media` dùng token rclone riêng. Token theo bucket chứ không theo tiền tố, nên mã là chốt chặn duy nhất giữa `dev/` và `prod/`: máy local không đặt `VERCEL_ENV`, và không bao giờ kéo biến production về tệp trên máy (runbook ở `docs/operations.md`). Bước cuối của `pnpm build` (`scripts/bundle-check.ts`) làm build thất bại nếu bundle trình duyệt có tên một biến chỉ dành cho server (`R2_*`, `SESSION_SECRET`, `FAMILY_CODE_SECRET`, `FAMILY_CODES_REVOKED`, `SYNC_STORE`, `GITHUB_FEEDBACK_TOKEN`) hay giá trị của một secret.

### 5.9 Offline và PWA
- **Cài lên Màn hình chính (đã có):** `src/app/manifest.ts` trả manifest (`display: standalone`, `start_url` và `scope` là `/`, tên và tên ngắn "Owl Yeah" (`APP_NAME`, `APP_SHORT_NAME`; tên này cũng là `<title>` và mẫu tiêu đề `%s | Owl Yeah`, `apple-mobile-web-app-title`, `og:site_name`), `lang: vi`, màu nền và màu theme theo token `--background`). Icon cú mèo 192, 512 và maskable 512, `apple-touch-icon` 180 và favicon (`src/app/favicon.ico` cùng `public/brand/favicon.svg`) vẽ từ `assets/brand/owl.svg` bằng `pnpm brand:images`, ra `public/brand/`. Thẻ iOS (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style: default`, `theme-color`) nằm ở layout gốc. Manifest không nhắc service worker: `offline/register.tsx` đăng ký nó (xem "Offline" dưới đây). Mọi hằng số (tên, màu, đường dẫn icon, `SITE_URL`) ở `src/lib/brand.ts`, nơi duy nhất; test so màu với `globals.css`.
- **Mời cài app:** trình duyệt chưa cài thì trang chủ (không phải màn học, `/unlock` hay màn chọn hồ sơ) hiện một thanh nhỏ ở cuối trang: cú, câu "Cài Owl Yeah lên máy để học như app thật, dùng được cả khi không có mạng", nút chính và "Để sau". Thanh hiện sau khi trang chủ đã mở 4 giây kể từ lượt chạm mở khoá âm thanh (không tranh với lời mời chạm cú), tối đa một lần mỗi phiên tab (`sessionStorage`); "Để sau" ẩn 7 ngày, cài xong thì ẩn hẳn (cài đặt của máy trong `localStorage`, không đồng bộ; không đọc được bộ nhớ thì không hiện). Nút theo nền tảng, do một hàm thuần `installAction` (`src/install/platform.ts`) quyết định: trình duyệt có `beforeinstallprompt` (Chrome, Edge, Samsung Internet trên Android và máy tính; sự kiện được giữ từ layout gốc) → "Cài app" gọi `prompt()`; Safari trên iPhone, iPad (kể cả iPad báo là Mac, nhận ra bằng `maxTouchPoints > 1`) → "Xem cách cài" mở bảng hai bước Chia sẻ, "Thêm vào Màn hình chính"; trình duyệt khác trên iOS (Chrome, Firefox, trình duyệt trong Zalo, Facebook, Messenger, Instagram, Line, TikTok) → "Mở bằng Safari" kèm "Chép link"; trình duyệt trong app trên Android → "Mở bằng Chrome" (liên kết `intent://`) kèm "Chép link"; đã mở dạng standalone hoặc không có đường cài (Firefox, Safari trên máy tính) → không hiện. Trang phụ huynh có mục "Cài app lên máy" luôn đưa đúng nút cho máy đang dùng, "Đã cài" khi chạy standalone, hoặc một dòng hướng dẫn mở menu trình duyệt.
- **Mở từ Màn hình chính trên iOS:** vào `/`; chưa có cookie thì tới `/unlock?next=%2F`, nhập mã gia đình một lần rồi vào app. Cookie và IndexedDB của app ở Màn hình chính tách riêng khỏi Safari: hồ sơ và tiến độ tạo trong Safari không có sẵn trong app đã thêm. Có đồng bộ thì sau lần đồng bộ đầu app đó thấy cùng hồ sơ và tiến độ với Safari; chưa có (chưa đặt biến R2) thì cài trước rồi mới tạo hồ sơ từ app đó.
- **Xem trước link:** layout gốc khai Open Graph và Twitter card (`og:type website`, `og:locale vi_VN`, tiêu đề và mô tả tiếng Việt, `og:url` và `og:image` là địa chỉ tuyệt đối theo `metadataBase = SITE_URL`). Ảnh 1200×630 `public/brand/share.png` vẽ cú mèo cạnh tên "Owl Yeah" trên nền vũ trụ. Trình thu thập của Facebook, Messenger, Zalo, Telegram, iMessage không có cookie nên bị cổng chuyển tới `/unlock`; thẻ nằm ở layout gốc nên trang `/unlock` có đủ thẻ. `X-Robots-Tag: noindex` giữ nguyên, xem trước vẫn chạy.
- **Offline:** bé học ở nhà bằng wifi; offline là lưới an toàn. Mất wifi hay mở app từ Màn hình chính không có mạng, mọi bài đã xuất bản vẫn mở được (kể cả bài chưa từng mở), phần học, ôn tập, mẹo, hình, công thức, font và tiếng ngắn; tiến độ giữ trong Dexie và đồng bộ bù khi có mạng. Phải mở app một lần có mạng sau khi nhập mã gia đình, và đợi worker cài xong (trang phụ huynh có dòng "Dùng khi không có mạng: sẵn sàng", hoặc "đang tải (n/N)", hoặc "chưa sẵn sàng" khi chưa có worker, kể cả ở `next dev`; "chưa bật" khi bản build tắt offline).
- **Service worker viết tay** (`src/offline/`), đóng gói bằng esbuild thành `public/sw.js` sau `next build` (gốc của site nên phạm vi là `/`; tệp được cổng cho qua không cần cookie và trả `Cache-Control: no-cache`). Chỉ có một cache duy nhất, precache của bản build hiện tại (`offline-<buildId>`), ghi một lần cho cả bản (lỗi một tệp thì xoá cả cache, trình duyệt thử lại ở lần kiểm tra cập nhật sau), tệp không đổi so với bản trước được chép sang chứ không tải lại. Không có runtime cache: khi trả lời request không bao giờ ghi gì. Danh sách precache sinh từ cùng nguồn mà app dùng (`scripts/offline-manifest.ts`: trang tĩnh từ `generateStaticParams`, mỗi trang kèm payload RSC của nó, lesson JSON và tips đã emit, tiếng ngắn từ `allSoundUrls()`, mọi tệp trong `public/` trừ danh sách loại, mọi tệp `_next/static` trừ `.ttf` và `.woff`); build thất bại khi bài đã phục vụ thiếu tệp, khi tổng vượt 50 MB (`PRECACHE_BUDGET_BYTES`), và test thất bại khi một `page.tsx` không nằm trong danh sách cũng không nằm trong `NOT_PRECACHED_ROUTES`.
- **Chiến lược mỗi request** (`strategy.ts`): điều hướng sang trang của app: mạng trước (`no-cache`, chờ tối đa 3 giây), lỗi hay quá giờ thì trang đã precache cùng đường dẫn (bỏ query); lỗi mạng mà trang không có trong precache thì trả trang `/offline` ("Cần mạng để mở trang này", cú mèo, nút "Quay lại" về màn trước hay trang chủ), quá giờ mà không có thì chờ tiếp mạng; mọi trả lời của mạng (200, 3xx, 401, 404, 5xx) đi qua nguyên vẹn. Request RSC khi bấm link trong app (header `RSC`, không có header prefetch): mạng trước, chờ tối đa 3 giây, lỗi hay quá giờ thì payload RSC đã precache của trang cùng đường dẫn (bỏ `_rsc`, `dpl` và query), trả với `content-type: text/x-component`; nhờ vậy offline, router của Next đổi màn ngay trong trang, không tải lại cả trang (tải lại cả trang cắt ngang tiếng bấm và có thể làm app đứng). Prefetch (`Next-Router-Prefetch`, `Next-Router-Segment-Prefetch`) đi thẳng ra mạng: offline nó hỏng, rồi lúc bấm router xin payload đầy đủ. `/content/*.json`: mạng trước (`no-cache`, chờ tối đa 10 giây), lỗi hay quá giờ thì dùng bản precache (không có bản precache thì chờ tiếp mạng). `/_next/static` và tiếng ngắn: precache trước (tham số `dpl` mà Next thêm vào URL tệp build khi có deployment id, như trên Vercel bật Skew Protection, được bỏ qua khi tra), trượt thì ra mạng và không lưu. Request có `Range` tới một tệp đã precache (tiếng ngắn, thẻ `<audio>` của Safari xin như vậy): trả `206` đúng đoạn từ bản precache (`416` khi đoạn nằm ngoài tệp, cả tệp với `200` khi xin nhiều đoạn). Không đụng tới: khác origin, `/api/*`, `/media/**`, mọi `.vtt`, `/unlock`, prefetch, `Range` tới tệp không có trong precache, bài hát, mọi thứ không có trong precache. Chỉ bản ghi 200, không redirect, không opaque, đúng URL đã xin mới được ghi lúc cài (nên 401 hay trang `/unlock` không bao giờ vào cache).
- **Không lưu media:** video, lời đọc, phụ đề và bài hát không bao giờ vào Cache Storage hay IndexedDB. Nhạc nền và hai tiếng ăn mừng thì được lưu như mọi clip ngắn (tổng dưới 1,5 MB, `STORED_MUSIC_BUDGET_BYTES`), nên offline vẫn có nhạc nền. Offline, video nói "Cần mạng để xem video", lời đọc "Cần mạng để nghe đọc bài", nút nhạc "Cần mạng để nghe nhạc", không vòng tiến độ và không phần trăm (`lib/network-status.ts` là nguồn duy nhất: `navigator.onLine` sai, hay một lần tải media vừa lỗi mạng; hết khi có sự kiện `online`, khi trang hiện lại, khi bé chạm vào dòng đó hoặc khi một lần tải thành công; preload video chờ).
- **Cập nhật:** worker mới cài ngầm và chờ, không `skipWaiting()` lúc cài (chunk của bản cũ không bị xoá khi trang đang mở còn cần). Nó nhận quyền khi: vừa mở trang mà đã có worker chờ và trang không phải màn học/ôn (áp dụng ngay, tải lại); bé chạm vào dòng "Có bài mới, tải lại" trên đầu màn hình (không bao giờ hiện trong màn học hay ôn của một bài); hoặc trang hiện lại sau khi ẩn từ 15 phút trở lên ngoài màn học. Sau khi nhận quyền, trang ngoài màn học tải lại ngay, trong màn học thì chờ bé rời đi. Trang kiểm tra cập nhật khi mở, khi hiện lại và mỗi 60 phút khi đang hiện (`updateViaCache: "none"`). Lần cài đầu không tải lại. Sau khi worker hoạt động, app xin `navigator.storage.persist()` một lần.
- **Tắt sẵn, bật bằng cờ build:** chỉ bản build có `NEXT_PUBLIC_OFFLINE_ENABLED=1` mới đăng ký worker và ghi worker có precache vào `public/sw.js`. Thiếu cờ (mặc định ở mọi nơi trừ phòng thử offline và E2E của nó) thì trang không đăng ký, gỡ mọi worker còn sót, `public/sw.js` là worker tự gỡ, và dòng trên trang phụ huynh là "chưa bật". Hai cờ ở một nơi: `src/offline/flags.ts`. Cách bật ở `docs/operations.md`, "Bật offline".
- **Chỉ đăng ký ở bản production**, trong layout của bé và trang phụ huynh, không bao giờ ở `/unlock` (nên chỉ máy đã có cookie mới cài). Ở `next dev` mọi worker tìm thấy trên origin bị gỡ.
- **Công tắc khẩn cấp:** build với `NEXT_PUBLIC_OFFLINE_KILL_SWITCH=1` thì `public/sw.js` là worker tự gỡ (nhận quyền ngay, xoá các cache `offline-*`, huỷ đăng ký; tiến độ Dexie không đụng tới) và trang ngừng đăng ký, kể cả khi cờ bật offline vẫn là `1`; cách dùng ở `docs/operations.md`, "Gỡ service worker lỗi".
- **Không có `/install`** trong hạng mục này; dòng "Dùng khi không có mạng" trên trang phụ huynh là cách chủ dự án kiểm một máy trước khi dựa vào offline.
- **iOS:** dữ liệu của PWA ngoài màn hình chính tách riêng khỏi Safari. Đồng bộ không phụ thuộc offline: Dexie giữ mọi thứ khi mất mạng và đồng bộ bù khi có mạng lại. Luồng `/install` (hướng dẫn "Thêm vào Màn hình chính", mở app, nhập mã gia đình, tiến độ tải về, dùng chính số "đã tải/tổng" mà dòng trên trang phụ huynh đọc) làm sau trong một hạng mục riêng; `/install` không đòi đồng bộ và sẽ phải vào danh sách tệp công khai của cổng. `docs/operations.md` ghi cách cài.

### 5.10 Kênh nạp nội dung
**Kênh chính (Claude Code):** tài liệu vào `sources/<subject>/<lesson-slug>/` → skill `lesson-author` sinh `content/…/lesson.json` → skill `lesson-visual` viết component trong `src/visuals/…` → `pnpm content:check` + `pnpm visual:shot` (Claude tự xem ảnh) → `pnpm content:lock` → quản trị viên xem ở máy → commit/push → Vercel deploy.

**Kênh nhanh (trang phụ huynh, quyền quản trị):**
1. Nút "Tạo thêm bài tập" hiện prompt sinh từ zod schema (`z.toJSONSchema`) + tóm tắt bài + danh sách concept/card id hợp lệ.
2. Quản trị viên dán JSON (và SVG nếu có) → **validate trước khi lưu**: schema; card id tồn tại; exercise id duy nhất so với nội dung git và overlay khác; chỉ tham chiếu `visualId` đã có trong registry; hình mới chỉ qua block `image`; không cho `manipulate` và `tapRegion` (cần code/DOM) → xem trước → lưu.
3. Mọi gia đình tải overlay qua `GET /api/content?lesson=` khi mở bài (cache Dexie + service worker).
4. **Validate lại ở hai chỗ khác**, vì schema hoặc bài gốc có thể đổi sau khi overlay đã lưu:
   - `content:check` lúc build kéo overlay từ R2 về kiểm → thay đổi làm hỏng overlay bị phát hiện trước khi deploy.
   - Client `safeParse` khi tải; mục hỏng bị bỏ qua (không crash) và hiện cảnh báo trên trang quản trị.
5. Skill `content-prompt` gom overlay về `content/` trong git, thêm id vào `ids.lock`, rồi xoá khỏi R2 sau khi deploy (hỏi trước). Trong khoảng giữa, `content:check` coi overlay trùng id với git là "đã gom": cảnh báo, bản git thắng.

### 5.11 Video (bổ sung, không chặn go-live)
- Mỗi video là `video/projects/<id bài>/<tên>/` gồm `script.json` (lời đọc theo cảnh, clip theo card) và `index.html` (hình HyperFrames); một lệnh `pnpm video:build <id bài> <tên>` dựng ra `public/media/video/<id bài>/<tên>.{mp4,vtt,jpg}` và ghi `Video` vào `lesson.json`. Thông số ở `video/config.ts`; quy trình ở skill `lesson-video`. Âm thanh trung gian và bản render nằm trong `audio/`, `renders/` của dự án (gitignore); câu đã đọc được giữ lại nên sửa hình không đọc lại.
- Lớp TTS chung `video/tts/` (interface `TtsEngine`): `omnivoice` đọc video mới (OmniVoice trên GPU, clone giọng "Hải Đăng"/"Mỹ Duyên" từ `video/tts/refs/`, môi trường `video/.venv-omni` cài bằng `pnpm video:setup-omni`; weights CC-BY-NC, chỉ phi thương mại); `local` đọc các video có `script.json` ghi `local` (VieNeu-TTS v3 Turbo, Apache-2.0, chạy ONNX trên CPU bằng Python arm64 riêng của pipeline — Python mặc định của máy chạy qua Rosetta; giọng là preset VieNeu "Hải Đăng" (nam) hoặc "Mỹ Duyên" (nữ), mỗi bài khai một giọng trong `video/projects/<bài>/media.json`; cách cài ở `video/requirements.txt`, môi trường ở `video/.venv`, model ở `video/.hf`). Engine `gemini` (`video/tts/gemini.ts`) đọc lời giới thiệu bài; engine khác thêm bằng một adapter khi cần. Mỗi video và mỗi lời giới thiệu ghi `voice = { engine, voiceName, model }`; một bài khai một giọng, `video/voices.ts` ánh xạ giọng đó sang giọng video (OmniVoice cho video mới, VieNeu cho video cũ; engine chọn theo `script.json` của từng video) và giọng lời giới thiệu (Gemini cùng giới tính). Một video hay một lời giới thiệu luôn do đúng một giọng đọc từ đầu đến cuối.
- Kịch bản cho người học chậm: câu ngắn, tránh chữ cái đơn đứng một mình (viết "số a" thay vì "a") vì TTS và Whisper hay nhầm. Câu quy tắc đánh `rule` phải bằng nguyên văn một `note`/`caption` của bài (hay một câu của nó), chỉ khác cách đọc ký hiệu (`aⁿ` → "a mũ n", ngoặc → phẩy, "số a"); câu trích văn bản đánh `quote` phải nằm nguyên văn trong `source-passage.txt`. `video:build` dừng khi lệch; `pnpm test` kiểm lại mọi kịch bản đã commit.
- Sau khi tổng hợp từng câu: giảm tốc bằng `ffmpeg atempo` 0.9, mlx-whisper phiên âm ngược; câu khớp kịch bản dưới 97% (so ký tự sau khi bỏ dấu thanh, dấu câu, đọc số thành chữ, gộp "tr"/"ch" của giọng Bắc) tự sinh lại, tối đa 3 lần, rồi báo để nghe duyệt.
- Mốc thời gian từng chữ lấy từ mlx-whisper, gióng về chữ của kịch bản → WebVTT karaoke (mỗi chữ một mốc, `src/lib/karaoke-vtt.ts`). Phụ đề không in vào hình: app vẽ, bật sẵn, tắt được; dải dưới của hình để trống cho phụ đề.
- Render HyperFrames 1280×720 → ffmpeg H.264 720p + AAC mono, ≤ 10 MB/phút (build dừng nếu vượt) → clip theo card là đoạn `start`–`end` trong cùng tệp (không cắt tệp riêng).
- **Lưu trữ local trước:** `Video.url`, `vttUrl`, `posterUrl` là đường dẫn tương đối dưới `NEXT_PUBLIC_MEDIA_BASE_URL` (mặc định `/media`, tức `public/media/` do app phục vụ; thư mục này không commit). Lúc go-live: upload nguyên cây `public/media/` lên bucket media (hỏi trước), bật CORS cho domain app, đổi biến môi trường; không phải dựng lại video hay sửa `lesson.json`.
- Phát trong app: khối `video` ở đầu phần (không tính vào số màn, tối đa một video mỗi phần); không tự phát, nút phát ≥ 64px, `playsInline`, phụ đề chữ lớn tô chữ đang đọc. Màn nhắc lại của thẻ ôn có clip thì có nút phụ "Xem lại đoạn video".
- **Nhịp cho người học chậm (video mới):** câu ngắn (≤ 12 chữ trừ câu `rule`/`quote` chép nguyên văn), một ý một câu, ≤ 16 câu, 45–75 giây. Hỏi rồi mới mở: câu hỏi ("Bạn thử đoán xem…") mang `"pause": "ask"` (im lặng `PAUSE.ask`), điều quan trọng vừa hiện mang `"pause": "think"` (im lặng `PAUSE.think`; `think` 1 giây, `ask` 1,5 giây, cảnh 1,3 giây, tất cả trong 1–1,5 giây vì lặng dài làm bé tưởng video đứng); `pause` chỉ đổi khoảng lặng của dòng thời gian, không đổi tiếng đã đọc. Câu `rule` (trừ câu cuối) phải có `pause`; có ít nhất một câu `ask`. Luật chỉ áp cho video không có trong `video/pacing-exempt.json` (video đã dựng giữ nguyên; dựng lại là quyết định riêng của chủ dự án); `video:build` và `video:check` kiểm, `video:check` còn đo khoảng lặng thật trong `.vtt`. Chi tiết: skill `lesson-video`.
- **Phát video:** video không bao giờ tự dừng; không có điểm dừng tự động. Phụ đề: trên màn hẹp (dưới 768 px, điện thoại dọc) hiện thành dải dưới hình trong khung video, từ 768 px đè lên đáy hình như cũ; nút phát và thanh điều khiển gốc không bị che.
- **Lời giới thiệu bài:** `pnpm narration:build <id bài>` đọc `overview` (mở bài, tóm tắt, câu dẫn mục tiêu và từng mục tiêu, câu "vì sao có ích", đúng thứ tự trên màn hình, `src/content/overview.ts`) bằng giọng Gemini của bài (nam/nữ theo giọng bài khai; `GEMINI_NARRATORS` trong `video/voices.ts`, đổi một dòng là đổi giọng): cả lời giới thiệu đọc trong một request (số từ 4 chữ số trở lên gửi dạng "4 376"), cắt thành từng câu theo mốc chữ của Whisper, mỗi câu vẫn kiểm Whisper ≥ 97% (câu lỗi đọc lại riêng, cùng giọng); nhiều key Gemini (`~/.config/gemini/api_key*`) xoay vòng, key bị giới hạn nghỉ rồi dùng lại; hết hạn mức mọi key thì bỏ phần đã đọc bằng Gemini, đọc lại cả lời giới thiệu bằng giọng OmniVoice của bài và cảnh báo. Ra `public/media/narration/<id bài>/overview.{m4a,vtt}` (AAC mono, WebVTT karaoke mỗi chữ một mốc) và ghi `overview.narration` (kèm `voice` của giọng đã đọc). Số chữ trong phụ đề phải bằng số chữ trên màn hình (màn hình tô chữ thứ n khi phụ đề tới chữ thứ n), lệch thì không ghi gì; câu có số mũ viết bằng ký tự mũ hay TeX bị từ chối (viết thành chữ). Âm thanh trung gian ở `video/.cache/narration/` (gitignore).
- Domain media: bucket public cần custom domain trên Cloudflare (URL `r2.dev` bị giới hạn tốc độ, chỉ dùng thử). Chốt trước khi upload.

### 5.12 Giao diện
Chi tiết ở `docs/design-system.md`. Tóm tắt ràng buộc:
- Thuần tiếng Việt. Chữ thân ≥ 18px. Vùng chạm ≥ 48×48px, cách nhau ≥ 12px — trừ vùng chạm nằm trong dòng chữ (`tapText`, `PassageReader`): ở chế độ chạm, line-height ≥ 2.3 (mỗi dòng ≥ 48px), chạm chọn cả câu, có vùng đệm dọc.
- Viewport mục tiêu: iPad dọc 820×1180 và ngang 1180×820; điện thoại 390×844. Không cuộn ngang.
- Đúng = xanh lá + ✓; sai = **cam** (không đỏ). Màu môn: Toán xanh dương, Văn hồng đất, Địa xanh ngọc, Sử vàng đất, Khoa học tự nhiên tím.
- Linh vật cú, biểu cảm: vui, gợi ý, cổ vũ, "vui khi gặp lại" (khi lâu không học — không trách).
- Không đồng hồ đếm ngược, không bảng xếp hạng. Tôn trọng `prefers-reduced-motion`.

### 5.13 Góp ý từ app (`src/user-feedback/`, `POST /api/feedback`)
- **Nút "Góp ý"** (`MessageCircleHeart`, 48 px, chữ "Góp ý" hiện từ `md`) ở đầu phải hàng trên cùng, cạnh nút âm thanh, trên: trang bài (danh sách phần), giới thiệu bài, "Mẹo hay", mọi bước của một phần và màn kết thúc phần, và màn ôn tập. Các màn khác không có. Báo cáo nói về màn đang hiện (khi bé "Quay lại" xem màn trước thì là màn đó). Mở sheet thì dừng lời đọc hay video đang phát, đóng sheet không tự phát lại; bài tập đang làm giữ nguyên.
- **Bé:** năm nút lớn một cột: "Khó hiểu", "Sai nội dung hoặc đáp án", "Hình hoặc video bị lỗi", "Dài quá, chán", "Hay, mình thích". Một chạm là gửi; cú cảm ơn "Cảm ơn bạn! Cú đã ghi lại rồi." hiện ngay khi báo cáo đã nằm trong hộp thư trên máy, có "Học tiếp" và nút đóng, tự đóng sau 5 giây (`FEEDBACK_THANKS_CLOSE_MS`; không tự đóng khi máy bật giảm chuyển động). Cùng lý do cho cùng câu thì hiện "Đã gửi" và khoá cho tới khi rời màn.
- **Phụ huynh:** liên kết "Phụ huynh góp ý kèm ghi chú" dưới các nút; hỏi PIN phụ huynh của máy mỗi lần (cùng ô, cùng đếm sai và khoá như `/parent`, `PinPrompt`), không mở và không dùng phiên của trang phụ huynh. Máy chưa đặt PIN thì không có ô ghi chú. Mẫu: năm lý do dạng radio, "Ghi chú (không bắt buộc)" tối đa 500 ký tự, nhắc không ghi tên bé hay thông tin cá nhân.
- **Hộp thư trên máy:** mỗi báo cáo có id 32 hex tạo trên máy, nằm trong cài đặt `feedbackOutbox` của máy (không đồng bộ, tối đa 20, quá 7 ngày thì bỏ), gửi lần lượt khi vừa tạo, khi có mạng lại và khi mở app. 2xx, 400, 403, 404, 413 thì xoá khỏi hộp; 401, 429, 5xx, mất mạng thì giữ và dừng lượt. Đổi máy sang gia đình khác thì xoá hộp thư.
- **Server:** kiểm Origin, kiểu `application/json`, cổng, cookie gia đình, store, giới hạn (mỗi gia đình 10 báo cáo / 10 phút và 40 / ngày, mỗi địa chỉ 20 / 10 phút, trong bộ nhớ từng instance), thân ≤ 4096 byte, schema zod chặt, `createdAt` trong 8 ngày qua. Lưu bản ghi vào bucket riêng tư trước (`<prefix>feedback/<yyyy-mm>/<id>.json`, tạo bằng `If-None-Match: *`, id trùng thì trả `duplicate`), thêm id vào `<prefix>feedback/pending.json`, rồi mới trả 202. Sau khi trả lời (`after()`, `maxDuration = 60`, ngân sách 30 giây) một lượt chuyển tiếp lấy tối đa 10 id cũ nhất, giành từng báo cáo bằng ghi có điều kiện, tạo nhãn còn thiếu rồi tạo issue trong repo riêng tư `rubykachu/owlyeah-feedback` (token `GITHUB_FEEDBACK_TOKEN`, chỉ Issues đọc ghi trên repo đó; hai lần ghi cách nhau 1 giây; tối đa 30 issue / giờ / instance). GitHub trả 422 hay đã thử 10 lần thì bản ghi thành `failed` và rời danh sách; lỗi khác (token, giới hạn GitHub, 5xx, hết giờ) thì dừng lượt và chờ báo cáo kế tiếp. Không có token thì báo cáo vẫn được lưu và chờ.
- **Issue:** tiêu đề `[Góp ý] <Lý do> · <tên bài> · Phần <n>`; nhãn `feedback`, `nguon:be`/`nguon:phu-huynh`, `ly-do:*`, `bai:<slug>` (slug dài hơn nhãn 50 ký tự thì 39 ký tự đầu và 6 hex SHA-256), `mon:<môn>`, `lop:<lớp>`, `trang-thai:moi`; thân có phần đọc được và khối ẩn `<!-- feedback-data {...} -->` (`v`, `id`, `lesson`, `section`, `item`, `step`, `screen`, `reason`, `source`, `app` = commit đang chạy, `device` = loại máy và hệ điều hành, `family` = bí danh hộ gia đình, `at`). Tên bài và tên phần chỉ giữ chữ, số và vài dấu; ghi chú chỉ nằm trong khối ```` ```text ````, `@` thành `＠`, `<` `>` thành `‹` `›`.
- **Riêng tư:** không gửi id gia đình, mã gia đình, tên bé hay tên hồ sơ, địa chỉ IP, user agent. Bí danh hộ gia đình là 12 hex đầu của HMAC-SHA256(`SESSION_SECRET`, `feedback-family:<id gia đình>`), không bao giờ ghi log. Log chỉ có id báo cáo, mã trạng thái và mã lỗi ngắn. Trang phụ huynh có câu "Góp ý gửi tới người làm app để sửa bài, không kèm tên bé hay mã gia đình."
- Vận hành (đọc issue, gom nhóm, sửa bài, đóng issue, token, vòng đời bản ghi): `docs/operations.md`, "Góp ý từ app".

## 6. Code style

- TypeScript strict, không `any`. Kiểu suy ra từ zod: `type Lesson = z.infer<typeof LessonSchema>`.
- File/thư mục: kebab-case. Component: PascalCase. Hàm/biến: camelCase. Hằng số config: SCREAMING_SNAKE_CASE.
- Server Component mặc định; `"use client"` chỉ ở component tương tác.
- Logic thuần (chấm bài, rating, gộp tiến độ, chọn thẻ, kiểm quyền) tách khỏi React, có unit test.
- Không hardcode config (bucket, hạn mức, tham số FSRS, múi giờ `Asia/Ho_Chi_Minh`) — đọc từ `src/lib/config.ts`.
- Comment tiếng Anh, chỉ giải thích "vì sao". Chuỗi UI tiếng Việt, đặt trong component hoặc `src/lib/copy.ts` khi dùng lại.
- Biome format mặc định (2 space, double quote).

```tsx
// src/exercises/numeric/grade.ts
import type { NumericExercise } from "@/schema/content";

export type GradeResult = { correct: boolean; wrongParts: string[] };

// Power answers are compared part-by-part so the hint can highlight
// only the part the child got wrong (base vs exponent).
export function gradeNumeric(ex: NumericExercise, input: NumericInput): GradeResult {
  if (ex.answer.kind === "power") {
    const wrongParts = (["base", "exponent"] as const).filter(
      (part) => input.power?.[part] !== ex.answer[part],
    );
    return { correct: wrongParts.length === 0, wrongParts };
  }
  // Vietnamese decimals use a comma; an empty pad must never equal 0.
  const raw = input.value?.trim().replace(",", ".") ?? "";
  const correct = raw !== "" && Number(raw) === ex.answer.value;
  return { correct, wrongParts: correct ? [] : ["value"] };
}
```

## 7. Chiến lược kiểm thử

| Mức | Công cụ | Phạm vi | Vị trí |
|---|---|---|---|
| Unit | Vitest (+ `fake-indexeddb` cho Dexie, stub `matchMedia`) | Schema; lint nội dung; chấm 8 dạng bài (NFC, input rỗng); rating; chọn thẻ ôn (bỏ id mồ côi, hỏi lại trong phiên); gộp tiến độ (ba loại tài liệu, property test giao hoán, kết hợp, lũy đẳng) và chuyển `retired`; múi giờ; hash/verify mã; khoá PIN; sinh prompt (`z.toJSONSchema` không throw) | `tests/**` |
| Component | Vitest + Testing Library | Mỗi dạng bài: đúng, và đủ 3 nấc sai ở cả hai nhánh (có visual gợi ý / fallback); bàn phím số; chạm-thay-kéo | `tests/exercises/**` |
| Content | `pnpm content:check` | Schema, tham chiếu, ids.lock, overlay | trước `build` |
| API | Vitest + BlobStore in-memory | session; revoke → 401; truy cập chéo gia đình → 403; ghi nội dung thiếu PIN → 403; `/api/sync` (412 và gộp, tạo mới `If-None-Match`, `shrink`, kẹp giờ, bản chụp, giới hạn tốc độ, Origin sai → 403); hạn mức AI | `tests/api/**` |
| Store và R2 | Vitest: bộ test chung của `BlobStore` chạy trên `memory`, `fs` và adapter `r2` với bucket giả (request ký thật, trả lời như S3: 412, 304, ETag có ngoặc kép); `pnpm test:r2` (tuỳ chọn, chạy tay, hỏi trước) chạy bộ đó trên bucket thật | `If-Match` / `If-None-Match` thật; mọi khoá dưới `test/<run-id>/`, chỉ xoá khoá do chính lần chạy ghi, không đụng `prod/` hay `dev/`; thiếu biến R2 thì bỏ qua kèm thông báo, `pnpm test` không bao giờ ra mạng | `tests/sync/store/**`, `tests/integration/**` |
| E2E | Playwright, project `ipad` (820×1180, touch, WebKit) và `phone` (390×844); đồng hồ giả `page.clock` (cài trước `goto`, đổi ngày bằng `setSystemTime`) | Luồng học: chọn hồ sơ → học một phần → sai 3 lần → sticker → bấm "Ôn bài này" → câu sai được hỏi lại cuối phiên. Luồng đồng bộ nhiều máy (`e2e/sync.spec.ts`: hai ngữ cảnh trình duyệt làm hai máy trên một server dev dùng store thư mục: hồ sơ và phần học sang máy kia, máy kia mất mạng rồi có lại, học lại một bài, nhập sao lưu, gia đình khác không thấy gì, máy mới tải lịch sử nhiều tháng). Luồng mở khoá có E2E riêng. Offline có E2E riêng, `pnpm test:e2e:offline` (`e2e/offline.spec.ts`, Chromium với viewport iPad, bản build production của `HEAD` do `scripts/offline-lab.ts` dựng trong một worktree tạm): reload lạnh khi offline, học khi offline và giữ câu trả lời, video và lời đọc báo cần mạng, không media nào vào cache, cổng vẫn chặn khi online, cập nhật worker. Một case với `reducedMotion: "reduce"` | `e2e/**` |
| Bố cục tự động | Playwright trên mọi route (trừ `/dev/*`) | `scrollWidth <= clientWidth`; mọi phần tử tương tác **không nằm trong dòng chữ** có bounding box ≥ 48×48; vùng chạm trong dòng chữ kiểm line-height ≥ 2.3 ở chế độ chạm | `e2e/layout.spec.ts` |
| Visual | `pnpm visual:shot` | Ảnh từng visual; không tràn khung, không chồng lấn; Claude xem ảnh | `.shots/` (gitignore) |

Yêu cầu: logic thuần (`src/{schema,srs,progress,exercises/grade}`) phủ ≥ 90% dòng, ép bằng threshold của `@vitest/coverage-v8`; bug sửa kèm test tái hiện. `pnpm lint && pnpm typecheck && pnpm test && pnpm content:check` xanh trước mỗi commit.

## 8. Ranh giới

**Luôn làm**
- Validate mọi dữ liệu vào (content, overlay, request API, phản hồi AI) bằng zod.
- Chạy lint, typecheck, test, content:check trước commit.
- Chụp và tự xem ảnh visual trước khi báo xong một bài.
- Giữ nguồn duy nhất: schema zod sinh kiểu, validator, JSON schema cho prompt.
- Ghi IndexedDB trước, mạng sau.
- Giữ id đã publish; đổi thì khai `retired`.
- Chạy `lesson-review` trong subagent mới cho mọi bài mới hoặc sửa nội dung trước khi `published`.

**Hỏi trước**
- Mọi thao tác ghi ra ngoài máy: ghi/xoá R2, deploy Vercel, `git push`, tạo repo, gọi Gemini ngoài lúc test có chủ đích.
- Thêm dependency ngoài danh sách tech stack; thêm dịch vụ bên ngoài.
- Thay đổi schema làm hỏng nội dung/tiến độ đã có (cần migration).
- Sửa hook `~/.claude/hooks/github-identity-guard.sh`.

**Không bao giờ**
- Commit `sources/`, `.env*`, secrets, file render video nặng.
- Chép nguyên văn phần kiến thức/bài tập hoặc hình ảnh từ SGK (trừ văn bản đọc hiểu Ngữ văn có ghi nguồn).
- Màu đỏ cho phản hồi sai, đồng hồ đếm ngược, bảng xếp hạng.
- Chữ tiếng Anh trên giao diện.
- Gửi tên/thông tin cá nhân của trẻ cho dịch vụ AI.
- Render SVG nạp nhanh bằng inline `<svg>`/`dangerouslySetInnerHTML`.
- Dùng account GitHub khác `rubykachu` cho dự án này.

## 9. Tiêu chí thành công

**Mốc "Học được"** (chạy trên máy, iPad truy cập qua LAN)
- Hai bài qua `content:check`: Toán — Luỹ thừa với số mũ tự nhiên; Ngữ văn — Nếu cậu muốn có một người bạn.
- Mỗi bài (đo bằng `content:check --stats`): ≥ 3 phần, mỗi phần ≥ 1 visual trên màn giải thích (không tính recap), số visual tương tác ≥ số phần chia 3 làm tròn lên (4 phần → 2; phần ngắn chỉ nhắc một quy tắc không bắt buộc có hình tương tác riêng), ≥ 8 card (mỗi card ≥ 3 exercise), ≥ 20 exercise dùng ≥ 5 dạng; bài Ngữ văn có ≥ 1 `openEnded` (bước viết dùng checklist tự tick ở mốc này).
- Đủ 8 dạng bài, mỗi dạng có test component cho đúng và đủ 3 nấc sai (có visual và fallback).
- Ôn bài: unit test chứng minh card vừa `Again` có mức nhớ thấp hơn card `Good` nên được chọn trước; chỉ card đã mở vào phiên; card `Again` được hỏi lại cuối phiên (không rating); card mồ côi bị bỏ qua không crash.
- E2E luồng học trên `ipad` + `phone` và `layout.spec.ts` xanh.
- Tiến độ ở mốc này chỉ để thử (IndexedDB theo origin LAN), không chuyển sang bản deploy.
- Skill: từ thư mục mẫu `sources/` của một bài mới, `lesson-author` + `lesson-visual` sinh bài qua `content:check` mà không sửa JSON bằng tay.
- Hai bài có `review.md` không còn lỗi Nghiêm trọng và `reviewedHash` khớp.
- Lint tự động: unit test cho từng luật. Skill review: bản sao bài fixture trong thư mục tạm (`content:check --root <tmp>`) cài 4 lỗi mà lint không bắt được (đáp án đọc hiểu không có căn cứ trong văn bản, gợi ý nấc 1 lộ đáp án, nội dung ngoài bài, câu phủ định kép) → chạy `lesson-review` 3 lần, lần nào cũng bắt đủ.

**Mốc "Go-live"**
- Deploy Vercel; truy cập không cookie → `/unlock`; response có `X-Robots-Tag: noindex`.
- Test API: revoke → 401 trong ≤ 60 giây; truy cập chéo → 403; ghi nội dung thiếu PIN → 403; PIN sai 5 lần → khoá; tạo tiến độ đồng thời từ 2 client → không mất dữ liệu.
- Đồng bộ: offline học được; online lại → tài liệu trên R2 phản ánh thay đổi trong ≤ 10 giây.
- E2E mở khoá và offline cold start xanh trên bản build production.
- Chỉ số hiệu năng (mục Hiệu năng) đạt trên bản deploy.
- Cài PWA ra màn hình chính iPad theo luồng `/install`, tiến độ tải về đúng.
- Bản chụp hằng ngày có trên R2; lifecycle 180 ngày đã cấu hình; `pnpm test:r2` xanh (một lần, khi chủ dự án đồng ý).
- Skill `tutor-admin`: tạo/thu hồi mã, reset PIN, khôi phục (có xác nhận).

**Mốc "Đủ 3 môn"**
- ≥ 1 bài Địa lí có `tapRegion` trên bản đồ theo góc nhìn Việt Nam.
- Trang phụ huynh: ngày học, thời lượng, top thẻ hay quên theo môn, bài viết.
- AI nhận xét có hạn mức theo gia đình; test: hết hạn mức / lỗi AI / phản hồi sai schema → fallback tự tick.

**Mốc "Kênh nhanh"**
- Prompt sinh từ schema; JSON hợp lệ dán vào hiện ngay ở gia đình khác không cần deploy; JSON sai bị từ chối trước khi lưu; SVG chứa `<script>`/`onload` bị lọc và chỉ hiển thị qua `<img>`; chỉ admin + PIN lưu được; overlay hỏng sau khi đổi schema làm `content:check` fail; skill `content-prompt` gom overlay về git.

**Mốc "Video"**
- Một video 60–90 giây (luỹ thừa qua bàn cờ), giọng đọc tiếng Việt từ TTS chạy trên máy, phụ đề karaoke lệch ≤ 200ms so với lời, ≤ 10 MB, phát trong bài; clip phát trong thẻ ôn; tua được trên iPad Safari.

**Hiệu năng** (kiểm ở mốc Go-live; đo bằng Lighthouse mobile, throttling "Slow 4G" mặc định, bản build production): LCP < 2.5s trang chủ. Chuyển giữa các khối trong phần < 300ms. Animation: Performance trace trên iPad có < 5% khung hình trễ.

## 10. Câu hỏi mở
- Linh vật: mặc định cú; đổi nếu trẻ thích con vật khác.
- Tài liệu bài Địa lí đầu tiên: chờ quản trị viên gửi.
- Tên miền app: mặc định `*.vercel.app`.
- Domain cho bucket media (cần trước mốc Video): mua domain trên Cloudflare (~10 USD/năm) hay tạm dùng `r2.dev`.
- Giọng TTS: "Hải Đăng" (quản trị viên đã chọn sau khi nghe mẫu).
