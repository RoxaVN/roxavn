## Mô hình hóa

Khi bắt tay thiết kế một module trong RoxaVN, hãy luôn bắt đầu bằng hai câu hỏi:  
1. 🧐 Module này sinh ra để làm gì?  
2. 🔁 Module này có thể tái sử dụng trong trường hợp nào?  

Trả lời được hai câu này, bạn sẽ tự nhiên liệt kê được những tính năng thật sự cần có. Lúc đó module của bạn sẽ gọn gàng, đúng trọng tâm. 

Để code đơn giản và dễ hiểu, hãy mô hình hóa mọi thứ xoay quanh đối tượng (entity) – tư tưởng tương tự như lập trình hướng đối tượng (OOP).  

Mỗi API chỉ cần làm đúng một việc duy nhất với đối tượng đó:

- Tạo → `POST /object`  
- Lấy → `GET /object/:id`  
- Sửa → `PUT /object/:id`  
- Xóa → `DELETE /object/:id`  

Và vì đơn giản là sức mạnh, mỗi module trong RoxaVN chỉ nên có khoảng **4 –> 5 đối tượng (tối đa 10)**. Mỗi đối tượng nên có khoảng từ **7 -> 15 thuộc tính (tối đa 20)**. Mỗi đối tượng này sẽ tương ứng với 1 bảng trong database.

## Khai báo đối tượng

Dưới đây là code mẫu khai báo schema cho đối tượng `Message`
```ts
import { Type } from '@roxavn/core/base';

const messageSchema = Type.Resource({
  type: Type.String(),
  userId: Type.String(),
  content: Type.String(),
});
```

#### Type

Type là schema builder được export lại từ thư viện [TypeBox](https://github.com/sinclairzx81/typebox) — một thư viện nhẹ, mạnh mẽ giúp bạn định nghĩa kiểu dữ liệu vừa:

- Type-safe khi lập trình (được hỗ trợ bởi TypeScript).
- Có thể kiểm tra (validate) ở runtime.

Điều này giúp đảm bảo rằng dữ liệu của bạn luôn đúng kiểu ở cả giai đoạn phát triển và khi chạy thực tế.

#### Type.Resource()

Type.Resource() là utility của RoxaVN giúp khai báo schema cho một đối tượng (resource).
Hàm này sẽ **tự động thêm 4 thuộc tính mặc định** mà mọi đối tượng trong RoxaVN đều có:

| Thuộc tính      | Kiểu dữ liệu                    | Mô tả            | Cột tương ứng trong DB        |
| --------------- | --------------------------------| -----------------| ----------------------------- |
| **id**          | `Type.String()`                  | Mã định danh duy nhất cho đối tượng. Bắt buộc mọi resource trong RoxaVN phải có. Kiểu dữ liệu trong DB có thể là `bigint`, `uuid`, hoặc `text`, **nhưng giá trị trả về từ DB phải là string.** | id *(primary key)*          |
| **createdDate** | `Type.Date()`                    | Ngày tạo đối tượng.   | createdDate (`timestamptz`) |
| **updatedDate** | `Type.Date()`                    | Ngày cập nhật gần nhất của đối tượng. | updatedDate (`timestamptz`) |
| **metadata**    | `Type.Optional(Type.Metadata())` | Lưu các thông tin tuỳ biến cho đối tượng — giúp các **plugin** mở rộng thêm tính năng mà không cần chỉnh sửa schema gốc. | metadata (`jsonb`)          |

#### Ví dụ mở rộng với plugin

Giả sử bạn có `module-message` định nghĩa đối tượng `Message` như trên, với thuộc tính `content` lưu nội dung văn bản của tin nhắn. Khi bạn muốn thêm tính năng gửi kèm hình ảnh, thay vì sửa trực tiếp `Message`, bạn nên tạo một plugin riêng — ví dụ: `plugin-message-media`. Plugin này chỉ cần mở rộng trường `metadata` của `Message` để lưu thông tin hình ảnh, chẳng hạn:

```json
{
  "media": [
    { "type": "image", "url": "https://cdn.example.com/photo1.png" }
  ]
}
```

Cách tiếp cận này giúp:

* Giữ `module-message` nhẹ, đơn giản và dễ tái sử dụng.
* Cho phép các plugin mở rộng linh hoạt mà không phá vỡ cấu trúc ban đầu của đối tượng.
