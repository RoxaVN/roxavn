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

Dưới đây là code mẫu khai báo schema cho đối tượng `Project` trong file `src/base/access.ts`

```ts
import { Type, accessManager } from '@roxavn/core/base';
import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  Project: {
    schema: Type.Resource({
      type: Type.String(),
      isPublic: Type.Boolean(),
      name: Type.String(),
      userId: Type.String(),
      rootTaskId: Type.String(),
    }),
  }
});
```

- `accessManager.makeScopes()` là nơi bạn khai báo quyền truy cập (access scope) cho module.
- Mỗi key (ở đây là Project) đại diện cho một đối tượng (entity) mà bạn muốn bảo vệ.
- Thuộc tính schema định nghĩa cấu trúc dữ liệu của đối tượng đó — kiểu như “bản hợp đồng” giữa backend và frontend:

`Type` chính là schema builder được export lại từ [TypeBox](https://github.com/sinclairzx81/typebox) - một thư viện nhẹ nhàng mà mạnh mẽ, giúp bạn định nghĩa kiểu dữ liệu mà vừa check được lúc runtime, vừa type-safe lúc code.
