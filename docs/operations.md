# Vận hành: đưa app lên mạng và giữ cho chạy

Sổ tay cho chủ dự án. Bản đầu tiên là bản "dùng được ngay": app chạy trên Vercel, video và lời đọc nằm trên bucket R2 công khai, cả app nằm sau mã gia đình, tiến độ của bé lưu trên từng máy (IndexedDB) và, khi bật đồng bộ ("Đồng bộ tiến độ giữa các máy"), còn được gửi lên một bucket R2 riêng tư để các máy của gia đình thấy chung. PIN phụ huynh vẫn riêng từng máy. Chưa có: PWA ngoại tuyến, trang quản trị (xem các mục "Tiến độ và đồng bộ", "Truy cập và bảo mật", "Offline và PWA" của `docs/spec.md`).

Mọi bước ở phần "Các bước ngoài máy" ghi ra ngoài máy này (R2, Vercel, GitHub), nên mỗi bước cần chủ dự án đồng ý trước khi chạy; tài khoản nào dùng cho bước nào ghi ngay trong bước.

## Bản đang chạy

- Production: `https://owlyeah.vercel.app` (tên hiển thị "Owl Yeah", project Vercel `tutor`, tài khoản `rubykachu`; là domain của project nên mỗi `vercel deploy --prod` cập nhật luôn). Địa chỉ phụ `https://tutor-minhtangs-projects.vercel.app` chưa nằm trong CORS của bucket. Bản đang chạy: commit `5155ae5` (03/10/2026; bật đồng bộ tiến độ giữa các máy và mã gia đình `OWL` có chữ ký thay danh sách `FAMILY_CODES`; biến Production trên Vercel: `FAMILY_CODE_SECRET`, `FAMILY_CODES_REVOKED`, bốn biến `R2_*` (đều Sensitive), `SESSION_SECRET`, `NEXT_PUBLIC_OFFLINE_ENABLED`, `NEXT_PUBLIC_MEDIA_BASE_URL`; kiểm nhanh 7/7; trên Vercel: mã cũ bị từ chối, mã `OWL` của chủ dự án mở app, hai trình duyệt riêng của một gia đình thử thấy chung hồ sơ và phần đã học, `/parent` hiện "Đồng bộ lần cuối" và mã gia đình, khoá mới nằm dưới `prod/progress/<id gia đình>/` và không có gì dưới `dev/`, dòng offline "sẵn sàng"; gia đình thử `OWLCXM2Q` đã bị thu hồi qua `FAMILY_CODES_REVOKED`, nên khi thu hồi gia đình khác phải giữ id này trong danh sách; bản trước là `baffae9`).
- Bucket media: `tutor-media`, địa chỉ công khai `https://pub-26fcfa663ca24297a8512aaf77c47fe8.r2.dev`, CORS chỉ cho origin `https://owlyeah.vercel.app` (origin khác không nhận header CORS, preflight bị từ chối).
- Giá trị thật của các biến môi trường nằm ở `.env.production.local` ở gốc repo (không commit, `chmod 600`). Next chỉ đọc tệp này khi build hay chạy production, nên dev server không có cổng mã. Muốn đổi biến trên Vercel thì sửa tệp này trước, rồi áp lại bằng các lệnh ở "Mã gia đình".
- Deploy lại: `pnpm deploy:prod` (chi tiết ở "Đưa bài mới lên production"). Lệnh luôn dựng từ một worktree sạch của `HEAD`, nên thay đổi chưa commit ở cây chính (kể cả việc dở của agent khác) không bao giờ lên mạng.

## Đưa bài mới lên production

Hai thứ đi ra ngoài máy theo hai đường khác nhau: nội dung bài (đã commit) đi theo bản deploy Vercel; video, phụ đề, ảnh bìa và lời đọc (`public/media/`, không nằm trong git) đi theo bucket R2. Vì vậy phải tải media trước, deploy sau: app không bao giờ trỏ tới tệp chưa có trên bucket. Bước 3 và 4 ghi ra ngoài máy, chỉ chạy khi chủ dự án đồng ý cho bản phát hành này; agent soạn bài chỉ làm bước 1 và 2 rồi báo bài đã sẵn sàng và hỏi có chạy tiếp không.

Cấu hình đích (bucket, project, địa chỉ app, tên tệp env) nằm một chỗ: `scripts/lib/release-config.ts`.

Điều kiện chung, kiểm một lần trước bước 3: `npx wrangler whoami` đăng nhập đúng tài khoản Cloudflare của chủ dự án (chưa thì `npx wrangler login`); `npx vercel whoami` là `rubykachu`; `.env.production.local` có `FAMILY_CODE_SECRET` và `NEXT_PUBLIC_MEDIA_BASE_URL` (dùng cho kiểm nhanh sau deploy và để bỏ qua tệp đã giống hệt trên bucket).

### 1. Soạn, review, xuất bản bài

Theo skill `lesson-author` và `lesson-review`. Xong bước này khi:

- Bài `published` (có `reviewedHash`, review thuộc subagent mới, 0 lỗi Nghiêm trọng) và id đã khoá: `pnpm content:lock <bài>`.
- `pnpm content:check` báo 0 lỗi (bài mới không được còn cảnh báo `[review-hash]` hay "not in ids.lock.json").
- Đã commit: `git status --short -- content src` không còn dòng nào của bài này. Bước 4 chỉ đưa lên bản đã commit.

Kiểm: `pnpm content:check --stats`; `CONTENT_INCLUDE_DRAFT= pnpm content:emit` rồi bài có trong `public/content/index.json` (hay xem trên `pnpm build` ở worktree riêng). Nhớ chạy lại `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` để dev server của chủ dự án vẫn thấy bài nháp.

### 2. Video và lời đọc

Theo skill `lesson-video` (và `pnpm narration:build <bài>` cho phần giới thiệu). Xong bước này khi:

- Bài đã `published` (bước 1) trước khi dựng video; video và lời đọc đã review (vòng review phần đổi của `lesson-video`).
- `pnpm video:check` ok và `pnpm content:check` 0 lỗi sau khi `videos[]` và `overview.narration` được ghi vào `lesson.json`; thay đổi `lesson.json` đó đã commit.
- Media của bài có đủ dưới `public/media/video/<bài>/` và `public/media/narration/<bài>/`.

Kiểm: `pnpm lesson:walk <bài>` xem sheet màn tổng quan và video; `pnpm media:upload <bài> --dry-run` liệt kê đúng các tệp của bài.

### 3. Tải media của bài lên R2 (ghi ra ngoài máy)

```bash
pnpm media:upload <bài> --dry-run      # xem trước: tệp nào sẽ tải, tệp nào đã giống hệt
pnpm media:upload <bài>...             # tải thật (nhiều bài: cách nhau dấu cách)
pnpm media:upload --all                # mọi bài có media (trừ bài fixture); dùng khi dựng lại bucket
```

Lệnh tải từng tệp dưới `public/media/video/<bài>/` và `public/media/narration/<bài>/` bằng `wrangler r2 object put --remote` vào bucket `tutor-media`, giữ nguyên đường dẫn, đặt `Content-Type` theo đuôi tệp (`.mp4` video/mp4, `.vtt` text/vtt, `.jpg` image/jpeg, `.m4a` audio/mp4) và `Cache-Control: public,max-age=3600`. Tệp nào có MD5 trùng `ETag` của đối tượng đang phục vụ ở `NEXT_PUBLIC_MEDIA_BASE_URL` thì bỏ qua (kiểm bằng `HEAD` công khai, không cần khoá). Không đọc được địa chỉ đó thì tải hết tệp của bài. Đuôi tệp lạ làm lệnh dừng; thêm đuôi vào `MEDIA_CONTENT_TYPES` rồi chạy lại.

Kiểm:

```bash
pnpm media:upload <bài> --dry-run      # phải báo "0 to upload"
curl -sI -H 'Range: bytes=0-99' "$(grep ^NEXT_PUBLIC_MEDIA_BASE_URL .env.production.local | cut -d= -f2)/video/<bài>/<tên>.mp4" | grep -iE 'HTTP|content-type|content-range'
```

Cần thấy `206`, `video/mp4`, `content-range: bytes 0-99/...`.

### 4. Deploy lên Vercel (ghi ra ngoài máy)

```bash
pnpm deploy:prod --dry-run   # in các bước, không chạy gì
pnpm deploy:prod
```

Lệnh luôn dựng từ một `git worktree` tạm của `HEAD` (cây chính có thay đổi chưa commit vẫn được, phần đó không lên), theo thứ tự: `pnpm install --frozen-lockfile`, `npx vercel link --yes --project tutor`, `npx vercel deploy --prod`, xoá worktree (kể cả khi một bước lỗi), rồi chạy kiểm nhanh ở bước 5. Khi `main` có commit chưa kiểm, deploy đúng commit đã kiểm bằng `pnpm deploy:prod --ref <commit>` (mặc định `HEAD`; lệnh in SHA đầy đủ sẽ lên). Trước khi chạy: `git log -1 --stat` đúng là commit chứa bài; media của bài đã lên bucket (bước 3). Build trên Vercel chạy `pnpm build` nên `content:check` phải 0 lỗi, nếu không bản deploy hỏng và bản cũ vẫn chạy.

### 5. Kiểm nhanh sau deploy

`pnpm deploy:prod` tự chạy bảy kiểm tra và in từng dòng `PASS` hoặc `FAIL`: `/` chuyển về `/unlock`; `/content/index.json` trả 401 khi chưa có cookie; đăng nhập bằng mã của gia đình kiểm thử `OWLTEST0` (`SMOKE_FAMILY_ID` trong `scripts/lib/release-config.ts`, mã tạo lúc chạy từ `FAMILY_CODE_SECRET` của `.env.production.local`, không in ra; gia đình này không bao giờ đồng bộ và `pnpm family:code` không cấp id này cho ai) được cookie; `/content/index.json` trả 200 với cookie; một URL media trả 206 với `Range`; `/api/sync?doc=profile` trả 401 khi chưa có cookie (cổng chặn trước khi chạm bucket); `/sw.js` trả 200 không cần cookie với `Cache-Control: no-cache` (tệp service worker phải qua cổng và không bao giờ nằm trong cache, nếu không máy giữ worker cũ bấy lâu cache còn sống). Lệnh thoát khác 0 nếu có kiểm tra hỏng. Việc còn lại bằng tay: mở bài mới trên iPad theo mục "Kiểm trên iPad Safari" (video phát, phụ đề chạy, lời đọc phát). Hỏng thì xem "Khi có lỗi"; cần quay về bản trước thì `npx vercel rollback`.

## Biến môi trường

| Tên | Bắt buộc | Đặt ở đâu | Ý nghĩa |
|---|---|---|---|
| `FAMILY_CODE_SECRET` | production | Vercel (Sensitive), `.env.production.local` | Khoá ký mã gia đình, ít nhất 32 ký tự ngẫu nhiên, khác `SESSION_SECRET`. Không có danh sách mã: server kiểm một mã bằng cách ký lại id gia đình trong mã. `pnpm family:code` đọc nó từ `.env.production.local` để in mã. Đổi khoá là đổi mọi mã (id và dữ liệu giữ nguyên) |
| `FAMILY_CODES_REVOKED` | không | Vercel (Sensitive), `.env.production.local` | Id gia đình bị thu hồi (`OWL4K7MQ`), cách nhau dấu phẩy, không phân biệt hoa thường. Mã và cookie của họ không mở app nữa. Một mục không phải id gia đình làm cổng đóng (503), để gõ sai không bao giờ để sót một gia đình đáng lẽ đã bị cắt |
| `SESSION_SECRET` | production | Vercel (Sensitive) | Khoá ký cookie `tutor_family`, ít nhất 32 ký tự ngẫu nhiên. Đổi khoá là mọi máy phải nhập lại mã; mã không đổi |
| `R2_ACCOUNT_ID` | để bật đồng bộ | Vercel (Sensitive), `.env.local` khi chạy thử trên máy | Id tài khoản Cloudflare (32 chữ số hex), ghép thành địa chỉ S3 của bucket riêng tư |
| `R2_ACCESS_KEY_ID` | để bật đồng bộ | như trên | Access key của token R2 chỉ có quyền Object Read & Write trên bucket `tutor-progress` |
| `R2_SECRET_ACCESS_KEY` | để bật đồng bộ | như trên | Secret của token đó. Không in ra log, không dán vào chat |
| `R2_PRIVATE_BUCKET` | để bật đồng bộ | như trên | `tutor-progress`. Thiếu một trong bốn biến (hoặc id, tên bucket sai dạng) thì đồng bộ tắt và log ghi tên biến thiếu, không ghi giá trị; không đặt biến nào thì đồng bộ tắt im lặng |
| `SYNC_STORE` | không | chỉ máy dev và test | `fs:<thư mục>` hay `memory`: store thay cho R2 khi chạy thử trên máy (E2E nhiều máy dùng nó). Được ưu tiên hơn `R2_*`, và server production từ chối nó |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | khi dùng bucket | Vercel, lúc build | Địa chỉ công khai của bucket media, không có dấu `/` ở cuối, ví dụ `https://pub-xxxx.r2.dev`. Để trống thì app đọc video từ `public/media` |
| `NEXT_PUBLIC_OFFLINE_ENABLED` | không | Vercel, lúc build | `1` bật offline (service worker) ở bản deploy đó; cách bật: "Bật offline". Vắng hay khác `1` (mặc định) thì app không đăng ký worker, gỡ worker còn sót trên máy, và `/sw.js` là worker tự gỡ. Chỉ phòng thử offline (`pnpm test:e2e:offline`) tự đặt `1` |
| `NEXT_PUBLIC_OFFLINE_KILL_SWITCH` | không | Vercel, lúc build | `1` gỡ service worker khỏi mọi máy ở bản deploy đó (cách dùng: "Gỡ service worker lỗi"). Để trống hay vắng là chế độ bình thường; đặt nó trong `.env.local` khi chạy thử thì cũng tắt worker ở máy |

Quy tắc đã được code giữ:

- Máy dev và test không đặt hai khoá (`FAMILY_CODE_SECRET`, `SESSION_SECRET`): không có cổng, vào thẳng. Server production thiếu hoặc đặt sai một trong hai khoá, hay `FAMILY_CODES_REVOKED` có mục sai dạng: không phục vụ gì (trả 503, log ghi lý do), để quên biến không bao giờ làm app mở cho người lạ.
- `NEXT_PUBLIC_MEDIA_BASE_URL` được ghép vào mã trình duyệt lúc build. Đổi nó thì phải deploy lại. Giá trị sai (thiếu `https://`, hay `http://` ở production) làm build dừng với thông báo rõ.
- Bốn biến `R2_*` không bao giờ là `NEXT_PUBLIC_*`, nên không vào mã trình duyệt (test kiểm bản build). Tiền tố `prod/` hay `dev/` không do biến nào chọn: chỉ `VERCEL_ENV=production` của Vercel cho `prod/`.
- Mẫu các biến nằm ở `.env.example`; tệp `.env*` thật không bao giờ commit.

## Đồng bộ tiến độ giữa các máy (bucket riêng tư)

Tiến độ của bé nằm trong IndexedDB của từng trình duyệt. Khi bật đồng bộ, app còn gửi nó (ngầm, bé không thấy gì) lên bucket R2 riêng tư `tutor-progress`, để iPad (Safari và app ở Màn hình chính), điện thoại, laptop của cùng gia đình thấy chung hồ sơ, phần đã học, thẻ ôn và sticker. Quy tắc của hệ thống nằm ở `docs/spec.md` mục 5.7; mục này là các việc của chủ dự án.

Trạng thái (03/10/2026): đồng bộ đã bật ở production từ bản `5155ae5`. Bucket `tutor-progress` riêng tư, đủ ba quy tắc vòng đời ở bước 1; token R2 chỉ có quyền trên bucket này; `pnpm test:r2` chạy qua trên bucket thật. Gia đình của chủ dự án có một id `OWL…` như mọi gia đình khác (id ghi ở `notebooks/backlogs/progress-sync/task.md`, Task 20); `.env.production.local` giữ `FAMILY_CODE_SECRET` và `FAMILY_CODES_REVOKED`, không giữ mã nào, mã in lại bằng `pnpm family:code --id <id>`. Còn lại: thông báo mức sử dụng của Cloudflare (bước 1) và việc xem mức dùng sau một tuần (bước 7).

Chưa đặt bốn biến `R2_*` thì đồng bộ tắt im lặng và app chạy như trước. Mỗi mã mang id gia đình của nó, nên máy nào đã mở khoá cũng đồng bộ dưới id đó.

Một bucket cho mọi môi trường, tách bằng tiền tố: `prod/` chỉ do bản production trên Vercel ghi, `dev/` cho máy dev và bản preview, `test/<mã chạy>/` cho bài kiểm tra R2 thật tuỳ chọn. Token R2 giới hạn theo bucket chứ không theo tiền tố, nên chỉ có code giữ hai môi trường tách nhau (`prod/` chỉ khi `VERCEL_ENV=production`). Vì vậy:

- Không bao giờ đặt `VERCEL_ENV` trong tệp trên máy.
- Không bao giờ kéo biến production về máy (`npx vercel env pull` cho môi trường production vào `.env.local` hay tệp nào khác): tệp đó mang `VERCEL_ENV=production` và server trên máy sẽ ghi vào dữ liệu thật.

### Bật đồng bộ lần đầu (chủ dự án làm hoặc duyệt từng bước)

Mỗi bước dưới ghi ra ngoài máy; agent chỉ làm khi chủ dự án đồng ý cho bước đó.

1. **Tạo bucket riêng tư.** Cloudflare dashboard, R2, Create bucket, tên `tutor-progress`. Để Public access tắt: không bật `r2.dev`, không gắn custom domain. Trong Settings của bucket thêm quy tắc vòng đời (Object lifecycle rules):
   - xoá đối tượng có tiền tố `prod/snapshots/` sau 180 ngày;
   - xoá đối tượng có tiền tố `dev/snapshots/` sau 180 ngày;
   - xoá đối tượng có tiền tố `test/` sau 1 ngày.

   Không đặt quy tắc cho `prod/progress/` và `dev/progress/`: lịch sử học không được tự xoá. Thêm một thông báo mức sử dụng ở mục Notifications của Cloudflare, đặt mức thấp (ví dụ 1 USD) để biết ngay nếu có gì bất thường.
2. **Tạo token cho app.** R2, Manage API tokens, Create API token, quyền Object Read & Write, "Apply to specific buckets only" và chỉ chọn `tutor-progress` (token này không được chạm `tutor-media`; việc tải media vẫn dùng token rclone riêng ở phần trên). Chép Access Key ID và Secret Access Key (chỉ hiện một lần) cùng Account ID (trang tổng quan R2). Đặt vào `.env.local` ở gốc repo, không commit, không đặt `VERCEL_ENV`:

   ```bash
   R2_ACCOUNT_ID=<32 chữ số hex>
   R2_ACCESS_KEY_ID=<access key id>
   R2_SECRET_ACCESS_KEY=<secret>
   R2_PRIVATE_BUCKET=tutor-progress
   ```

   Không dán các giá trị này vào chat, issue hay log.
3. **Thử trên máy, dữ liệu vào `dev/`.** In một gia đình thử bằng `pnpm family:code` (một dòng `<id>`, tab, `<mã>`). Chạy một server dev riêng (cổng và thư mục build khác, để không đụng dev server đang chạy) với các khoá đặt ngay trên dòng lệnh, đừng ghi chúng vào `.env.local` vì như vậy dev server thường cũng đòi mã. Khoá ký mã lấy thẳng từ `.env.production.local` (lệnh không in nó); khoá cookie là một khoá thử dùng một lần. Máy không đặt `VERCEL_ENV` nên mọi thứ ghi dưới `dev/`:

   ```bash
   FAMILY_CODE_SECRET="$(sed -n 's/^FAMILY_CODE_SECRET=//p' .env.production.local)" \
   SESSION_SECRET="$(openssl rand -hex 32)" \
   NEXT_DIST_DIR=.next-sync CONTENT_INCLUDE_FIXTURE=1 \
   pnpm exec next dev --port 3520
   ```

   Mở `http://localhost:3520` ở cửa sổ thường và cửa sổ riêng tư, nhập mã thử ở cả hai, tạo hồ sơ và học xong một phần ở cửa sổ đầu: cửa sổ kia thấy hồ sơ và phần đó sau vài giây, và trang `/parent` hiện "Đồng bộ lần cuối" cùng mã gia đình thử. Trong dashboard, các đối tượng mới nằm dưới `dev/progress/<id thử>/` và không có gì dưới `prod/`. Tuỳ chọn, khi đã đồng ý riêng: `pnpm test:r2` chạy bộ test của store trên bucket thật; nó chỉ ghi dưới `test/<mã chạy>/`, chỉ xoá khoá do chính nó ghi, và tự bỏ qua kèm thông báo nếu thiếu biến.
4. **Đặt biến cho production trên Vercel** (môi trường Production, đều Sensitive; giá trị đi qua stdin). Đây là danh sách đầy đủ cho lần bật đồng bộ cùng mã `OWL`: `FAMILY_CODE_SECRET` (cùng giá trị với `.env.production.local`), `FAMILY_CODES_REVOKED` (tuỳ chọn, để trống thì không cần đặt) và bốn biến `R2_*`; `SESSION_SECRET` giữ nguyên; xoá `FAMILY_CODES` cũ (bản mới không đọc nó). Mọi máy nhập lại mã `OWL` một lần.

   ```bash
   sed -n 's/^FAMILY_CODE_SECRET=//p' .env.production.local | tr -d '\n' | npx vercel env add FAMILY_CODE_SECRET production --sensitive
   printf '%s' '<R2_ACCOUNT_ID>'        | npx vercel env add R2_ACCOUNT_ID production --sensitive
   printf '%s' '<R2_ACCESS_KEY_ID>'     | npx vercel env add R2_ACCESS_KEY_ID production --sensitive
   printf '%s' '<R2_SECRET_ACCESS_KEY>' | npx vercel env add R2_SECRET_ACCESS_KEY production --sensitive
   printf '%s' 'tutor-progress'         | npx vercel env add R2_PRIVATE_BUCKET production --sensitive
   npx vercel env rm FAMILY_CODES production --yes
   ```

   Không đặt biến cho Preview: bản preview không có khoá nên trả 503, và nếu sau này có thì nó chỉ ghi dưới `dev/`.
5. **Deploy** theo "Đưa bài mới lên production", bước 4: `pnpm deploy:prod` từ commit đã kiểm. Kiểm nhanh phải `PASS` cả bảy dòng, kể cả `login with the family code` (mã `OWL` của gia đình kiểm thử) và `sync 401 without cookie`.
6. **Thử trên hai máy thật** (iPad Safari và app ở Màn hình chính, hoặc iPad và điện thoại): học xong một phần ở máy này, máy kia thấy sau vài giây; `/parent` hiện thời gian đồng bộ lần cuối; trong dashboard đối tượng mới nằm dưới `prod/progress/<id gia đình>/` và không có gì mới dưới `dev/`. Kiểm lại bucket vẫn riêng tư (Settings: Public access tắt, không có `r2.dev` hay domain).
7. **Một tuần sau:** xem mức dùng R2 và Vercel trên dashboard (số request, dữ liệu truyền), vẫn trong gói miễn phí.

### Việc định kỳ và xử lý sự cố

- **Xoay token:** tạo token mới (cùng quyền, cùng bucket), cập nhật `R2_ACCESS_KEY_ID` và `R2_SECRET_ACCESS_KEY` trên Vercel (xoá rồi thêm lại) và trong `.env.local`, deploy lại, kiểm `/parent` còn đồng bộ, rồi xoá token cũ. Nghi lộ token thì làm ngay và xoá token cũ trước khi kiểm.
- **Khôi phục một bé từ bản chụp:** mỗi ngày server giữ trạng thái của tài liệu chính trước lần ghi đầu của ngày đó, 180 ngày, tại `prod/snapshots/<id gia đình>/<id bé>/<yyyy-mm-dd>.json`. Tải tệp của ngày cần từ dashboard, đưa sang máy đang có hồ sơ của bé, mở `/parent`, bấm "Nhập bản sao lưu" và chọn tệp: app cho xem trước rồi trộn vào máy mà không xoá gì (phần mới hơn trên máy được giữ), và kết quả tự đồng bộ cho các máy khác. Bé phải đã có hồ sơ trên máy đó. Lịch sử làm bài không có bản chụp vì các tháng chỉ được thêm vào.
- **Xoá hồ sơ thử dưới `dev/`:** dữ liệu của lần thử ở bước 3 nằm trong cùng bucket. Khi không cần nữa, vào dashboard, bucket `tutor-progress`, mở `dev/progress/<id gia đình thử>/` và `dev/snapshots/<id gia đình thử>/` rồi xoá. Không xoá gì dưới `prod/` bằng tay trừ khi chủ dự án muốn xoá dữ liệu thật của một gia đình.
- **Thêm gia đình:** `pnpm family:code` in một id và mã mới (xem "Mã gia đình"), không cần đổi biến hay deploy; máy đầu tiên của gia đình đó tạo tài liệu ở lần đồng bộ đầu.
- **Máy đổi sang gia đình khác:** trang `/parent` chặn nếu máy còn tiến độ chưa gửi (chỉ cho tải bản sao lưu), và cho "Dùng máy này cho gia đình mới" khi máy sạch.

## Chuẩn bị trên máy (không ghi ra ngoài)

Tạo hai khoá (mỗi lệnh một khoá, ghi thẳng vào `.env.production.local`, không in ra màn hình). Khoá ký mã chỉ tạo một lần: tạo lại là đổi mã của mọi gia đình.

```bash
printf 'FAMILY_CODE_SECRET=%s\n' "$(openssl rand -hex 32)" >> .env.production.local
printf 'SESSION_SECRET=%s\n' "$(openssl rand -hex 32)" >> .env.production.local
chmod 600 .env.production.local
```

In mã gia đình bằng `pnpm family:code` (xem "Mã gia đình").

Thử bản production ngay trên máy. Dev server của chủ dự án đang giữ thư mục `.next`, nên build trong một worktree riêng:

```bash
git worktree add ../tutor-prod-check HEAD
cd ../tutor-prod-check && pnpm install --frozen-lockfile --prefer-offline
FAMILY_CODE_SECRET='<khoá thử>' SESSION_SECRET='<khoá thử khác>' pnpm build
FAMILY_CODE_SECRET='<khoá thử>' SESSION_SECRET='<khoá thử khác>' pnpm start --port 3200
```

Cần thấy: `/` chuyển sang `/unlock`; nhập đúng mã (ký bằng khoá thử) vào được; `/dev/mascot` là 404; chỉ bài `published` có trong `/content/index.json`. Xong thì `git worktree remove ../tutor-prod-check`.

## Các bước ngoài máy

Thứ tự này để mỗi bước dùng được kết quả của bước trước: bucket có địa chỉ rồi mới tải video lên, có địa chỉ bucket rồi mới đặt biến cho Vercel, có địa chỉ app rồi mới khoá CORS đúng origin.

Dùng đúng một biến shell trong cả phần này, đặt một lần ở đầu phiên:

```bash
export BUCKET=tutor-media          # tên bucket media (đổi nếu muốn)
export APP_ORIGIN=https://tutor-student.vercel.app   # địa chỉ app, điền lại ở bước 6 nếu Vercel cấp tên khác
```

### 1. Tạo bucket media công khai (Cloudflare R2)

Tài khoản Cloudflare của chủ dự án. Dùng `wrangler`; lần đầu cần đăng nhập trình duyệt:

```bash
npx wrangler login
npx wrangler r2 bucket create "$BUCKET"
npx wrangler r2 bucket dev-url enable "$BUCKET"
```

Lệnh cuối in ra địa chỉ `https://pub-<mã>.r2.dev`. Ghi lại, đó là giá trị của `NEXT_PUBLIC_MEDIA_BASE_URL`:

```bash
export MEDIA_URL=https://pub-<mã>.r2.dev
```

Địa chỉ `r2.dev` chỉ dành cho giai đoạn đầu (Cloudflare giới hạn tốc độ và không cache ở CDN). Khi có tên miền riêng: R2, bucket, Settings, Custom Domains, rồi đổi `NEXT_PUBLIC_MEDIA_BASE_URL` và deploy lại; đường dẫn file không đổi nên không phải dựng lại gì.

### 2. Tạo khoá R2 để tải file lên

Công cụ tải là `rclone` (máy chưa có: `brew install rclone`). Khoá chỉ dùng cho nó, không đưa vào app. Trong Cloudflare: R2, Manage API tokens, Create API token, quyền Object Read and Write, giới hạn ở bucket `$BUCKET`. Lấy Access Key ID, Secret Access Key và Account ID, rồi đặt trong phiên shell (không ghi vào tệp, không commit):

```bash
export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID=<Access Key ID>
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY=<Secret Access Key>
export RCLONE_CONFIG_R2_ENDPOINT=https://<Account ID>.r2.cloudflarestorage.com
```

### 3. Tải `public/media` lên bucket

`public/media` (không nằm trong git) có 109 tệp, khoảng 48 MB: `video/<bài>/<tên>.mp4|vtt|jpg` và `narration/<bài>/overview.m4a|vtt`. Giữ nguyên đường dẫn vì `lesson.json` chỉ ghi đường dẫn tương đối. Mỗi loại tệp tải riêng để `Content-Type` đúng (Safari từ chối phụ đề `text/plain`):

```bash
cd /Users/minhtang/Documents/Projects/MyProject/TutorStudent
upload() {  # upload '<mẫu tệp>' <Content-Type> [cờ rclone thêm]
  rclone copy public/media "r2:$BUCKET" --s3-no-check-bucket --progress \
    --header-upload 'Cache-Control:public,max-age=3600' \
    --include "$1" --header-upload "Content-Type:$2" "${@:3}"
}

# thử trước, không ghi gì
upload '*.mp4' video/mp4 --dry-run

upload '*.mp4' video/mp4
upload '*.vtt' text/vtt
upload '*.jpg' image/jpeg
upload '*.m4a' audio/mp4
```

Kiểm: `rclone size "r2:$BUCKET"` phải báo 109 objects. Ghi đè tệp đã có chỉ khi video được dựng lại; `rclone copy` không xoá gì trên bucket.

Sao lưu các bản đọc từng câu (`video/projects/**/audio/`, `video/.cache/`) lên bucket private là việc riêng ở README, mục "Dọn dẹp và Go-live"; không cần cho lần deploy đầu.

Kiểm bucket trả đúng loại tệp và hỗ trợ tua (Range):

```bash
curl -sI -H 'Range: bytes=0-99' "$MEDIA_URL/video/luy-thua/luy-thua-la-gi.mp4" | grep -iE 'HTTP|content-type|content-range|accept-ranges'
curl -sI "$MEDIA_URL/video/luy-thua/luy-thua-la-gi.vtt" | grep -iE 'HTTP|content-type'
```

Cần thấy `206`, `video/mp4`, `bytes 0-99/...`, `accept-ranges: bytes` và `text/vtt`.

### 4. Tạo project Vercel và đặt biến môi trường

Tài khoản Vercel `rubykachu` (đã `vercel login`; kiểm bằng `npx vercel whoami`). Chạy trong thư mục dự án:

```bash
cd /Users/minhtang/Documents/Projects/MyProject/TutorStudent
npx vercel link --yes --project tutor-student
```

Đặt ba biến cho môi trường `production` (giá trị đi qua stdin, không hiện trong lịch sử lệnh; hai biến đầu là Sensitive nên Vercel không cho đọc lại):

```bash
sed -n 's/^FAMILY_CODE_SECRET=//p' .env.production.local | tr -d '\n' | npx vercel env add FAMILY_CODE_SECRET production --sensitive
sed -n 's/^SESSION_SECRET=//p' .env.production.local     | tr -d '\n' | npx vercel env add SESSION_SECRET production --sensitive
printf '%s' "$MEDIA_URL" | npx vercel env add NEXT_PUBLIC_MEDIA_BASE_URL production
```

Cấu hình build đã nằm trong `vercel.json` (`pnpm build`, vì lệnh này chạy kiểm tra nội dung và dựng `public/content` trước `next build`) và `package.json` (`engines.node` là `22.x`). Không đặt biến cho môi trường `preview`: bản preview thiếu khoá nên trả 503, đúng ý muốn (người lạ không vào được bản thử).

### 5. Đẩy mã lên GitHub

Chỉ dùng token `rubykachu`, qua HTTPS với helper đặt ngay trong lệnh (`credential.helper=` rỗng phải đứng trước, nếu không keychain trả nhầm tài khoản). Commit gần nhất phải là bản đã qua `pnpm lint && pnpm typecheck && pnpm test`:

```bash
cd /Users/minhtang/Documents/Projects/MyProject/TutorStudent
TOK="$(gh auth token -u rubykachu)"
git -c credential.helper= \
    -c credential.helper='!f() { echo "username=rubykachu"; echo "password='"$TOK"'"; }; f' \
  push https://github.com/rubykachu/TutorStudent.git main
```

Nội dung bài `draft` có trong git nhưng không được phát hành: bản build chỉ đưa bài `published` ra ngoài.

### 6. Nối Vercel với repo và deploy

Cách 1, tự deploy mỗi lần push (cần cài Vercel GitHub App cho tài khoản `rubykachu`, làm một lần ở trang Vercel):

```bash
npx vercel git connect https://github.com/rubykachu/TutorStudent.git
```

Sau khi nối, mỗi lần push vào `main` Vercel tự build bản production. Lần đầu có thể kích hoạt bằng lệnh dưới.

Cách 2, deploy tay từ máy, không cần GitHub App:

```bash
npx vercel deploy --prod
```

Lệnh in địa chỉ production, thường là `https://tutor-student.vercel.app`. Nếu khác với `APP_ORIGIN` đã đặt thì đặt lại biến shell. Trong log build kiểm dòng `content:check ... 0 errors`; phiên bản Node.js ở Settings, Build and Deployment phải là `22.x`.

### 7. Cho phép app tải phụ đề và video từ bucket (CORS)

Trình phát đặt `crossOrigin="anonymous"` cho video, và lời đọc lấy phụ đề bằng `fetch`, nên bucket phải trả header CORS cho origin của app và cho yêu cầu `Range` (tua video). Tạo `cors.json` tạm ở thư mục bất kỳ:

```bash
cat > /tmp/tutor-cors.json <<EOF
{
  "rules": [
    {
      "allowed": {
        "origins": ["$APP_ORIGIN"],
        "methods": ["GET", "HEAD"],
        "headers": ["Range", "Content-Type"]
      },
      "exposeHeaders": ["Content-Length", "Content-Range", "Accept-Ranges", "Content-Type", "ETag"],
      "maxAgeSeconds": 3600
    }
  ]
}
EOF
npx wrangler r2 bucket cors set "$BUCKET" --file /tmp/tutor-cors.json
npx wrangler r2 bucket cors list "$BUCKET"
rm /tmp/tutor-cors.json
```

Muốn thử với dev server trên máy thì thêm `"http://localhost:3001"` vào `origins`. Có tên miền riêng cho app sau này thì thêm origin đó.

Kiểm bằng yêu cầu giả origin của app:

```bash
curl -sI -H "Origin: $APP_ORIGIN" -H 'Range: bytes=0-99' "$MEDIA_URL/video/luy-thua/luy-thua-la-gi.mp4" | grep -iE 'HTTP|access-control|content-range'
curl -sI -H "Origin: $APP_ORIGIN" "$MEDIA_URL/narration/luy-thua/overview.vtt" | grep -iE 'HTTP|access-control|content-type'
```

Cần thấy `access-control-allow-origin: <APP_ORIGIN>` ở cả hai (và `access-control-expose-headers` ở video). Nếu CLI ở phiên bản chưa có `cors set`, dán cùng nội dung ở Cloudflare: R2, bucket, Settings, CORS policy, dạng `[{"AllowedOrigins":["<APP_ORIGIN>"],"AllowedMethods":["GET","HEAD"],"AllowedHeaders":["Range","Content-Type"],"ExposeHeaders":["Content-Length","Content-Range","Accept-Ranges","Content-Type","ETag"],"MaxAgeSeconds":3600}]`.

### 8. Kiểm nhanh từ máy tính

```bash
curl -sI "$APP_ORIGIN/" | grep -iE 'HTTP|location|x-robots-tag'
curl -s -o /dev/null -w '%{http_code}\n' "$APP_ORIGIN/content/index.json"
curl -s -o /dev/null -w '%{http_code}\n' "$APP_ORIGIN/dev/mascot"
```

Cần thấy `307` về `/unlock?next=%2F` cùng `x-robots-tag: noindex, nofollow`, tiếp theo `401` cho `/content/index.json` khi chưa có cookie, và `307` cho `/dev/mascot` (sau khi có cookie thì là 404).

Manifest, icon và ảnh xem trước link phải tải được không cần cookie (trình thu thập của Zalo, Facebook không có cookie), còn file khác trong cùng thư mục vẫn bị chặn:

```bash
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' "$APP_ORIGIN/manifest.webmanifest" "$APP_ORIGIN/brand/share.png" "$APP_ORIGIN/brand/icon-512.png"
curl -sL "$APP_ORIGIN/" | grep -oE '<meta property="og:(image|title|locale)"[^>]*>'
curl -s -o /dev/null -w '%{http_code}\n' "$APP_ORIGIN/brand/other.png"
```

Cần thấy `200 application/manifest+json`, `200 image/png` hai lần; ba thẻ `og:` với `og:image` là `https://owlyeah.vercel.app/brand/share.png`; rồi `401` cho file khác.

## Kiểm trên iPad Safari

Làm trên chính iPad của bé (hoặc iPad có iOS giống). Mở `APP_ORIGIN`.

1. Mở app: tự chuyển sang trang "Chào bạn!". Gõ mã sai: thấy dòng cam "Chưa đúng rồi", không có chữ đỏ. Gõ sai 5 lần: thấy lời nhắc nghỉ vài phút.
2. Gõ đúng mã `OWL…` (chữ hoa hay thường, có dấu gạch hay không đều được): vào trang chọn hồ sơ. Đóng tab, mở lại: vào thẳng, không hỏi mã nữa. Mở một thẻ riêng tư (Private) vào cùng địa chỉ: phải hỏi mã.
3. Mở `APP_ORIGIN/parent` trong thẻ riêng tư: cũng phải hỏi mã (trang phụ huynh cùng cổng).
4. Tạo hồ sơ, vào bài Luỹ thừa. Màn giới thiệu: nút nghe lời đọc phát tiếng, từng từ sáng lên theo giọng (nghĩa là phụ đề tải được qua CORS).
5. Video của bài: bấm phát, hình hiện trước khi phát (poster), phụ đề từng từ chạy đúng nhịp. Kéo thanh tua giữa video và nhảy đến chỗ khác: video tiếp tục từ đó, không treo (kiểm `Range`). Xoay ngang rồi dọc: video vẫn đúng khung. Video dừng ở chỗ hỏi bé ("Xem tiếp") đúng như đã thiết kế.
6. Tiếng: làm một câu đúng và một câu sai nghe tiếng thưởng và tiếng sai; bấm cú mèo nghe tiếng; tắt rồi bật nút tiếng. Thử cả khi gạt công tắc chuông sang im lặng: tiếng của app vẫn phát (đã đặt phiên âm thanh "playback").
7. Làm xong một phần, tải lại trang: tiến độ còn (IndexedDB trên máy này). Vào `/parent` đặt PIN, xem báo cáo.
8. Thêm vào Màn hình chính (làm sau cùng, vì app ở đó có dữ liệu riêng, tách khỏi Safari): trong Safari bấm nút Chia sẻ, chọn "Thêm vào Màn hình chính". Tên gợi ý là "Owl Yeah", biểu tượng là cú mèo trên nền xanh, không phải chữ cái hay ảnh chụp trang. Bấm "Thêm".
9. Mở app từ biểu tượng mới: toàn màn hình, không có thanh địa chỉ của Safari, thanh trạng thái sáng. Lần đầu hỏi mã gia đình (cookie của Safari không sang đây): gõ mã, vào trang "Chào bạn mới!" vì hồ sơ tạo trong Safari không có ở đây. Tạo hồ sơ, đóng app, mở lại: vào thẳng, không hỏi mã. Mở app thấy khung giống Safari.
10. Offline (chỉ khi bản deploy đã bật offline, xem "Bật offline"; làm sau bước 9, trên app ở Màn hình chính): khi còn mạng, vào `/parent` (đặt PIN nếu chưa có) và đợi dòng "Dùng khi không có mạng: sẵn sàng" (lúc đầu là "đang tải (n/N)"; "chưa sẵn sàng" nghĩa là chưa có worker, ví dụ bản chạy `next dev`, hay chưa cài xong: để app mở thêm ít phút có mạng; "chưa bật" nghĩa là bản deploy chưa bật offline). Bật chế độ máy bay, vuốt đóng app khỏi trình chuyển app, mở lại từ biểu tượng: vào thẳng trang chủ. Học một bài chưa từng mở (phần có hình, công thức), làm một câu, mở "Mẹo hay" và "Ôn bài này". Trong màn học bấm X: nghe trọn câu chào, màn bài hiện ngay, không nháy trắng hay đứng. Video và lời đọc nói "Cần mạng để xem video" và "Cần mạng để nghe đọc bài", không có vòng quay hay phần trăm; nút nhạc nói "Cần mạng để nghe nhạc". Tắt chế độ máy bay: bấm phát video thì video tải và chạy, và nếu đã bật đồng bộ thì `/parent` có "Đồng bộ lần cuối" mới. Khi có bản mới, màn hình chính hiện dòng "Có bài mới, tải lại" (không hiện trong màn học); bấm thì app tải lại.
11. Gửi link `APP_ORIGIN` cho chính mình bằng Zalo, Messenger hoặc iMessage: hiện thẻ có ảnh cú mèo cạnh chữ Owl Yeah, tiêu đề "Owl Yeah: tự học lớp 6 cùng bạn cú" và mô tả tiếng Việt. Facebook lưu thẻ cũ rất lâu: sau khi đổi ảnh hay chữ, dán link vào Sharing Debugger của Facebook (developers.facebook.com/tools/debug) và bấm "Scrape Again".
12. Nếu một bước hỏng, ghi lại bước và ảnh chụp màn hình, rồi xem "Khi có lỗi" dưới đây.

## Mã gia đình

Mã gia đình có dạng `OWL4K7MQ-9QX2P8RT`: `OWL`, 5 ký tự riêng của gia đình, rồi 8 ký tự chữ ký (gạch nối chỉ để dễ đọc; khi gõ, chữ thường, dấu cách và gạch nối đều được bỏ qua). Phần đầu `OWL4K7MQ` là id gia đình: không bí mật, nằm trong khoá lưu trữ tiến độ và không bao giờ đổi. Chữ ký được tạo từ id bằng `FAMILY_CODE_SECRET`, nên không có danh sách mã nào phải giữ trên Vercel: thêm gia đình không cần đổi biến hay deploy. Chữ dùng trong mã bỏ `I`, `L`, `O`, `U`; nếu phụ huynh gõ `O` thay `0` hay `I`/`L` thay `1` sau `OWL`, app vẫn hiểu đúng.

- **Cấp mã cho gia đình mới:** `pnpm family:code` in một gia đình, `pnpm family:code --count 10` in mười. Mỗi dòng là `<id gia đình>`, tab, `<mã>`. Lệnh đọc `FAMILY_CODE_SECRET` từ `.env.production.local` và không in khoá; nó không ghi gì ra ngoài máy. Đưa mỗi mã cho đúng một gia đình và ghi lại id của họ (thu hồi hay in lại mã cần id). Lệnh không bao giờ cấp lại một id trong cùng lần chạy, và không cấp `OWLTEST0` (gia đình kiểm thử của `pnpm deploy:prod`). Với khoảng 33 triệu id, xác suất hai trong 100 gia đình trùng id là khoảng 0,015%; nếu id mới trùng một id đã cấp trong danh sách của bạn thì bỏ dòng đó và chạy lại.
- **Xem lại mã của một gia đình:** `pnpm family:code --id OWL4K7MQ`. Trên máy đã mở khoá, phụ huynh cũng thấy mã ở trang `/parent` (sau PIN), có nút "Chép mã"; màn hình của bé không hiện mã.
- **Thu hồi một gia đình:** thêm id của họ vào `FAMILY_CODES_REVOKED` (cách nhau dấu phẩy) rồi deploy. Mã của họ bị từ chối như mã sai, cookie trên máy của họ hết hiệu lực ở request sau; các gia đình khác không bị ảnh hưởng. Dữ liệu của họ trong bucket vẫn còn (xoá bằng tay trong dashboard nếu cần). Gia đình bị thu hồi muốn dùng lại thì cấp id mới (dữ liệu cũ nằm dưới id cũ), hoặc bỏ id khỏi danh sách.

  ```bash
  npx vercel env rm FAMILY_CODES_REVOKED production --yes
  printf '%s' 'OWL4K7MQ,OWL9X2ZB' | npx vercel env add FAMILY_CODES_REVOKED production --sensitive
  pnpm deploy:prod --ref <commit đã kiểm>
  ```

- **Khẩn cấp, nghi lộ khoá ký mã hay nhiều mã:** tạo `FAMILY_CODE_SECRET` mới (lệnh ở "Chuẩn bị trên máy", thay dòng cũ trong `.env.production.local`), đặt lại trên Vercel, deploy. Mọi mã và mọi cookie hết hiệu lực; id gia đình và dữ liệu giữ nguyên. In lại mã cho từng gia đình bằng `pnpm family:code --id <id>` và gửi cho họ; mỗi máy nhập mã mới một lần.
- **Nghi lộ khoá cookie:** đổi `SESSION_SECRET`, deploy. Mọi máy nhập lại mã một lần; mã không đổi.

Mọi thay đổi biến môi trường chỉ có hiệu lực ở bản deploy mới. Sửa một biến Sensitive: xoá rồi thêm lại.

```bash
npx vercel env rm FAMILY_CODE_SECRET production --yes
sed -n 's/^FAMILY_CODE_SECRET=//p' .env.production.local | tr -d '\n' | npx vercel env add FAMILY_CODE_SECRET production --sensitive
pnpm deploy:prod --ref <commit đã kiểm>
```

Giới hạn thử sai (5 lần trong 10 phút cho mỗi địa chỉ mạng) được đếm trong bộ nhớ của từng instance Vercel, nên chỉ làm chậm việc đoán mã. Chữ ký 40 bit mới là thứ khiến việc đoán vô vọng: id gia đình không bí mật, nên kẻ đoán chọn id nào cũng chỉ có 1 trên khoảng 1,1 nghìn tỉ cơ hội mỗi lần; 10 000 địa chỉ, mỗi địa chỉ 720 lần một ngày, vẫn cần hơn 400 năm. Mã đoán trúng chỉ mở một gia đình trống, không bao giờ mở dữ liệu của gia đình khác.

## Khi có lỗi

| Dấu hiệu | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Mọi trang trả "Ứng dụng chưa sẵn sàng" (503) | Production thiếu hoặc đặt sai `FAMILY_CODE_SECRET` / `SESSION_SECRET`, hai khoá giống nhau, hay `FAMILY_CODES_REVOKED` có mục không phải id gia đình | Vercel, Logs: dòng `family-code gate is closed: <lý do>` nói rõ biến nào; sửa rồi deploy lại |
| Tiến độ không sang máy khác, `/parent` không có dòng "Đồng bộ lần cuối" | Thiếu hay sai một biến `R2_*` | Vercel, Logs: dòng `progress sync is off: <lý do>` nêu tên biến thiếu; sửa rồi deploy lại |
| `/parent` báo máy chưa gửi được tiến độ | Mất mạng lâu, hay bucket từ chối (token hết hạn hoặc bị xoá) | Máy vẫn giữ nguyên tiến độ và gửi bù khi được; kiểm token R2 còn dùng được, xoay token nếu cần ("Việc định kỳ và xử lý sự cố") |
| Nhập đúng mã vẫn quay về trang nhập | Cookie bị chặn (chế độ riêng tư chặn cookie của bên thứ nhất, hay lỗi giờ máy), hoặc truy cập qua một tên miền khác `APP_ORIGIN` | Thử thẻ thường; kiểm giờ của iPad; vào đúng địa chỉ production |
| Video không phát, phụ đề không hiện | Chưa đặt CORS đúng origin, hay build chưa có `NEXT_PUBLIC_MEDIA_BASE_URL` | Chạy lại bước 7 và các lệnh `curl` ở đó; trong Vercel kiểm biến, sửa xong phải deploy lại |
| Video chạy nhưng không tua được | Bucket không trả `206` cho `Range` | Chạy lệnh `curl` có `Range` ở bước 3 |
| Phụ đề báo sai định dạng | `Content-Type` của `.vtt` không phải `text/vtt` | Tải lại các tệp `.vtt` bằng lệnh ở bước 3 |
| Bài mới không hiện sau khi push | Bài chưa `published` (chỉ bài đã qua review mới được đưa ra) | `pnpm content:check`; xem trạng thái trong `notebooks/backlogs/index.md` |
| App trắng, hiện bài cũ hay lỗi lạ trên iPad sau một lần cập nhật, nghi service worker | Worker lỗi giữ trang cũ hay trả sai | Công tắc khẩn cấp: "Gỡ service worker lỗi" ngay dưới bảng |
| Dòng "Dùng khi không có mạng" mãi là "đang tải" hay "chưa sẵn sàng" | Worker chưa cài xong (mạng yếu, mở app quá ngắn), hoặc máy chưa có cookie, hoặc đang chạy `next dev` | Để app mở có mạng vài phút rồi xem lại; ở bản production vẫn không đổi thì kiểm `curl -sI "$APP_ORIGIN/sw.js"` trả 200 với `no-cache`, rồi dùng công tắc khẩn cấp nếu nghi worker |
| Cần quay về bản trước | Bản mới hỏng | Vercel, Deployments, bản cũ, "Promote to Production"; hoặc `npx vercel rollback` |

## Bật offline

Offline (service worker) tắt sẵn ở mọi bản build: chỉ phòng thử offline bật nó, vì E2E offline chạy trên Chromium, chưa ai thử trên Safari của iPad. Khi tắt, trang không đăng ký worker, gỡ mọi worker còn sót, `/sw.js` là worker tự gỡ, và trang phụ huynh ghi "Dùng khi không có mạng: chưa bật". Chủ dự án bật khi sẵn sàng thử trên iPad thật:

1. Đặt biến ở Vercel (Production), rồi deploy lại: biến được in vào mã lúc build nên chỉ bản deploy mới có hiệu lực.

   ```bash
   printf '1' | npx vercel env add NEXT_PUBLIC_OFFLINE_ENABLED production
   pnpm deploy:prod
   ```
2. Kiểm từ máy tính: `curl -s "$APP_ORIGIN/sw.js" | grep -c /_next/static` lớn hơn 0 (worker có danh sách precache, không phải worker tự gỡ); `curl -sI "$APP_ORIGIN/sw.js"` trả `200` và `no-cache`.
3. Kiểm trên iPad theo "Kiểm trên iPad Safari", bước 9 và 10: dòng "Dùng khi không có mạng" đi từ "đang tải (n/N)" tới "sẵn sàng"; chế độ máy bay, đóng hẳn app, mở lại vẫn học được bài chưa mở; video, lời đọc và nhạc báo cần mạng; tắt chế độ máy bay thì video chạy lại; khi có bản mới thì hiện "Có bài mới, tải lại" ngoài màn học.
4. Hỏng ở bước nào: xoá biến (`npx vercel env rm NEXT_PUBLIC_OFFLINE_ENABLED production --yes`) và deploy lại, hoặc dùng công tắc khẩn cấp ngay dưới đây; cả hai đều gỡ worker khỏi máy ở lần mở có mạng sau, tiến độ không mất.

## Gỡ service worker lỗi

Service worker lỗi trên máy của bé là sự cố tệ nhất của phần offline: nó có thể giữ trang cũ hay trả sai ngay cả khi bản mới đã sửa. Công tắc khẩn cấp gỡ nó trên mọi máy mà không cần chạm vào từng máy, và không đụng tới tiến độ (tiến độ nằm trong IndexedDB, worker không bao giờ ghi vào đó). Nó thắng cả khi `NEXT_PUBLIC_OFFLINE_ENABLED` vẫn là `1`; xoá biến bật offline rồi deploy lại cũng gỡ worker theo cùng cách.

1. Đặt biến `NEXT_PUBLIC_OFFLINE_KILL_SWITCH` bằng `1` ở Vercel (Production), rồi deploy lại: biến này được in vào mã lúc build nên chỉ có hiệu lực ở bản deploy mới (`pnpm deploy:prod`, hoặc `npx vercel deploy --prod` sau khi đặt biến).

   ```bash
   printf '1' | npx vercel env add NEXT_PUBLIC_OFFLINE_KILL_SWITCH production
   pnpm deploy:prod
   ```
2. Kiểm: `curl -s "$APP_ORIGIN/sw.js"` phải chứa `unregister` và không chứa `/_next/static`; `curl -sI "$APP_ORIGIN/sw.js"` vẫn `200` và `no-cache`.
3. Điều xảy ra trên máy của bé: lần mở app có mạng kế tiếp (trình duyệt kiểm tra `/sw.js` mỗi lần điều hướng, ngoài worker, tệp qua cổng không cần cookie), worker tự gỡ được cài, nhận quyền ngay, xoá mọi cache `offline-*`, huỷ đăng ký. Trang mở lên cũng không đăng ký lại, và gỡ bất kỳ đăng ký nào còn sót. App chạy như trước khi có offline. Máy đang offline vẫn giữ worker cũ cho tới lần có mạng đầu tiên.
4. Khi đã sửa xong lỗi: xoá biến (`npx vercel env rm NEXT_PUBLIC_OFFLINE_KILL_SWITCH production --yes`), deploy lại; nếu `NEXT_PUBLIC_OFFLINE_ENABLED` là `1` thì worker bình thường được cài lại ở lần mở có mạng sau.

Không dùng tiêu đề `Clear-Site-Data`: giá trị `"storage"` xoá luôn IndexedDB, tức tiến độ chưa gửi của bé; `"cache"` không đụng tới Cache Storage; Safari bỏ qua tiêu đề này. Worker tự gỡ là cơ chế duy nhất.

## Thêm video cho bài cũ

Bài đã lên mạng, nay dựng thêm video hay dựng lại lời đọc: nội dung bài không đổi hình thức phát hành, chỉ `lesson.json` (danh sách `videos[]`, `overview.narration`) và `public/media/` đổi.

1. Dựng trên máy theo `lesson-video` (chỉ bài nêu tên; không dựng lại media của bài khác), review phần đổi, `pnpm video:check` ok và `pnpm content:check` 0 lỗi. Commit phần `lesson.json` đổi.
2. Tải media: `pnpm media:upload <bài> --dry-run`, rồi `pnpm media:upload <bài>`. Tệp cũ giống hệt thì bị bỏ qua; tệp dựng lại có nội dung khác sẽ ghi đè bản trên bucket, nên chỉ chạy khi chủ dự án muốn thay bản cũ.
3. `pnpm deploy:prod` để `lesson.json` mới lên mạng (cần vì tên video nằm trong `lesson.json`), rồi kiểm theo bước 5 ở trên. Không cần đổi biến môi trường.
