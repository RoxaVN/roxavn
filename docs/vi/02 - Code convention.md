## Code Convention

### 1. Git

RoxaVN tuân thủ chuẩn [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) để đảm bảo tính nhất quán trong lịch sử commit.

- Mỗi commit **chỉ thực hiện một nhiệm vụ duy nhất** (ví dụ: *fix bug*, *update UI*, *refactor code*).  
- Tuyệt đối không gộp nhiều loại thay đổi (như vừa sửa lỗi, vừa cập nhật giao diện) trong cùng một commit.  
- Tên commit phải tuân theo định dạng chuẩn, ví dụ:

  ```
  feat(auth): add login via Google
  fix(ui): correct button alignment on mobile
  chore(deps): update eslint config
  ```

### 2. JavaScript Packages

RoxaVN chỉ sử dụng **ES Module** nhằm tối ưu hóa quá trình build client (đặc biệt là hỗ trợ **tree-shaking**).

Vì vậy, trong file `package.json` của mỗi package cần khai báo rõ:

```json
{
  "type": "module"
}
```

> ⚠️ Không sử dụng CommonJS (`require`, `module.exports`) trong bất kỳ package nào.

Khi import các file trong dự án, bắt buộc phải thêm đuôi **`.js`** để tương thích với chuẩn **ES Module**.  

Ví dụ:

```ts
import { program } from './program.js';
```

> ⚠️ Nếu thiếu phần mở rộng .js, quá trình build hoặc runtime có thể gặp lỗi ERR_MODULE_NOT_FOUND trong môi trường Node.js ESM.

### 3. Quy tắc đặt tên

| Thành phần                   | Quy tắc đặt tên| Ví dụ                        |
|------------------------------|----------------|------------------------------|
| **Class**                    | PascalCase     | `UserService`, `AuthManager` |
| **Biến / Hàm thông thường**  | camelCase      | `userList`, `fetchData()`    |
| **React Component Function** | PascalCase     | `ApiTable`, `ApiFetcher`     |
| **Hằng số (constant)**       | UPPER_CASE     | `MAX_RETRY_COUNT`, `API_URL` |

### 4. Độ dài mã nguồn

Để giữ cho mã nguồn dễ đọc, dễ bảo trì và dễ review, cần tuân thủ các giới hạn sau:

| Loại mã nguồn        | Giới hạn khuyến nghị | Giới hạn tối đa |
|-----------------------|----------------------|-----------------|
| **File**              | 100 – 200 dòng       | < 500 dòng      |
| **Function / Method** | 10 – 50 dòng         | < 100 dòng      |

> ✅ Nếu một file hoặc function vượt quá giới hạn, cần xem xét **tách nhỏ** hoặc **refactor** để tăng khả năng tái sử dụng và dễ kiểm thử.

### 5. Môi trường phát triển

Khuyến nghị sử dụng VSCode làm trình soạn thảo chính để đảm bảo đồng bộ môi trường làm việc giữa các thành viên trong dự án. Sau khi khởi tạo dự án, nên chạy lệnh `npx roxavn gen module convention` để tạo các cấu hình tiêu chuẩn:

- Cấu hình BiomeJS để định dạng và lint code (thay thế ESLint + Prettier)
- Thiết lập Lefthook để kiểm tra:
    - commit message có tuân theo Conventional Commits hay không
    - đảm bảo format code và lint tự động trước khi commit.

> 💡 BiomeJS giúp cải thiện tốc độ lint/format đáng kể và giảm độ phức tạp trong cấu hình.

Ngoài việc khởi tạo convention ban đầu, bạn có thể chạy lệnh `npx roxavn gen editor vscode` để tối ưu trải nghiệm phát triển trên **VSCode**. Lệnh này sẽ tự động:
- Tạo code snippets giúp viết nhanh các đoạn mã RoxaVN phổ biến.
- Thiết lập cấu hình launch cho phép debug các RoxaVN module.
- Cấu hình thuộc tính "importModuleSpecifierEnding" trong VSCode để đảm bảo tự động thêm đuôi `.js` khi import module ES.
