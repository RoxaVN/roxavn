## Giới thiệu

RoxaVN được thiết kế với kiến trúc module và plugin linh hoạt, cho phép mở rộng nhiều hình thức xác thực người dùng (authentication) khác nhau. Mỗi hình thức xác thực được triển khai như một **module** hoặc **plugin** riêng biệt, dễ dàng thêm hoặc thay thế mà không ảnh hưởng đến phần lõi của hệ thống.

| Module / Plugin                  | Mô tả                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| `@roxavn/module-user`            | Xác thực truyền thống bằng **username** và **password**.                                      |
| `@roxavn/plugin-auth-firebase`   | Xác thực qua **Firebase Authentication**, hỗ trợ email, số điện thoại, Google, Facebook, v.v. |
| `@roxavn/plugin-auth-two-factor` | Kích hoạt **xác thực hai bước (2FA)** qua OTP hoặc ứng dụng xác thực.                         |
| `@roxavn/plugin-auth-webauthn`   | Xác thực bằng **vân tay hoặc Face ID** thông qua chuẩn **WebAuthn**.                          |
| `@roxavn/plugin-auth-web3`       | Xác thực bằng **ví blockchain** như **MetaMask**, **TrustWallet**, hoặc **WalletConnect**.    |

Ngoài các plugin có sẵn, RoxaVN cho phép bạn tự phát triển plugin xác thực của riêng mình.

## Định danh

Mỗi phương thức xác thực trong RoxaVN đều gắn liền với một định danh người dùng — gọi là `Identity`. Identity giúp hệ thống phân biệt các hình thức đăng nhập khác nhau (email, số điện thoại, mật khẩu, ví blockchain, v.v.) của cùng một người dùng. Một đối tượng `Identity` bao gồm hai trường cơ bản:

| Trường     | Kiểu dữ liệu | Mô tả                                                                            |
| ---------- | ------------ | -------------------------------------------------------------------------------- |
| `subject`  | string       | Giá trị định danh — ví dụ địa chỉ email, số điện thoại, userId, địa chỉ ví, v.v. |
| `type`     | string       | Loại định danh — xác định phương thức xác thực tương ứng.                        |
| `metadata` | jsonb        | Lưu thông tin thêm - ví dụ với `password` lưu token để reset mật khẩu            |

Cặp `{ subject, type }` tạo thành **unique key** trong hệ thống, đảm bảo mỗi định danh chỉ tồn tại một lần duy nhất.

Ví dụ về các loại định danh:

| Phương thức xác thực             | subject             | type        |
| -------------------------------- | ------------------- | ----------- |
| Xác thực qua email               | `example@email.com` | email       |
| Xác thực qua số điện thoại       | `+84123456789`      | phone       |
| Xác thực qua username & password | user id             | password    |
| Xác thực qua ví blockchain       | `0x1234...abcd`     | web3Address |

Lợi ích của thiết kế này

- Hỗ trợ **đa dạng hình thức xác thực** mà không cần thay đổi cấu trúc dữ liệu người dùng.
- Cho phép **một người dùng có nhiều định danh** — ví dụ cùng lúc đăng nhập bằng email, số điện thoại, hoặc ví Web3.
- Nhưng vẫn có thể giới hạn một số loại định danh chỉ được phép tồn tại một bản duy nhất, như chỉ có **một mật khẩu (`type = password`)** cho mỗi người dùng.

## Phiên đăng nhập

Sau khi người dùng xác thực thành công, RoxaVN sẽ tạo ra một phiên đăng nhập — gọi là `UserSession`. Mỗi phiên này được lưu trong database và gắn với một `accessToken` duy nhất.

Quy trình hoạt động

1. Xác thực thành công → hệ thống sinh `accessToken` và lưu bản ghi `UserSession` vào cơ sở dữ liệu.
2. Client (trình duyệt hoặc ứng dụng) sẽ nhận `accessToken` này qua `Set-Cookie` header.
3. Trong các request tiếp theo, client cần gửi `accessToken` này để chứng thực người dùng, thông qua:
   - **Cookie**, hoặc
   - **HTTP Authorization Header** (`Authorization: Bearer <accessToken>`)

Lợi ích của việc lưu session trong database

- **Quản lý nhiều thiết bị dễ dàng**:  
  Một người dùng có thể đăng nhập trên nhiều thiết bị khác nhau — mỗi thiết bị là một session riêng.
- **Hỗ trợ đăng xuất chọn lọc hoặc toàn bộ**:  
  Có thể logout một thiết bị cụ thể hoặc toàn bộ session của người dùng.
- **Tăng tính bảo mật**:  
  Có thể vô hiệu hóa accessToken cũ bất cứ lúc nào bằng cách xóa session tương ứng trong DB.

## Luồng xác thực

Dưới dây là ví dụ xác thực username và password đơn giản

### Khai báo API

```ts
const passwordIdentitySource = new ApiSource(scopes.Identity, baseModule);
export const passwordIdentityApi = {
  auth: passwordIdentitySource.api({
    method: 'POST',
    path: passwordIdentitySource.apiPath() + '/authPassword',
    request: Type.Object({
      username: Type.String({ minLength: 1 }),
      password: Type.String({ minLength: 1 }),
    }),
    response: Type.SessionData(),
    // Phải set `authentication` là true để hệ thống biết được đây là api để xác thực
    // Nếu xác thực thành công, sẽ tạo `Set-Cookie` header cho `accessToken`
    metadata: { authentication: true },
  })
};
```

### Backend

```ts
@serverModule.useApi(passwordIdentityApi.auth)
export class AuthPasswordIdentityService extends BaseService {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
    @inject(CreateUserSessionService)
    private createUserSessionService: CreateUserSessionService
  ) {
    super();
  }

  async handle(
    @IpAddress @UserAgent request: InferApiRequestWithContext<
      typeof passwordIdentityApi.auth,
      [typeof IpAddress, typeof UserAgent]
    >
  ) {
    const identity = await this.databaseService.dbSession
      .selectFrom('identity')
      .selectAll('identity')
      .leftJoin('user', 'user.id', 'identity.userId')
      .where('identity.type', '=', constants.IdentityTypes.PASSWORD)
      .where('user.username', '=', request.username)
      .executeTakeFirst();
    if (!identity) {
      throw unauthorizedErrorFactory.make();
    }

    // xác thực username và password
    await this.verifyWithIdentity({ identity, password: request.password });

    // thành công thì gọi CreateUserSessionService để tạo user session và accessToken
    return this.createUserSessionService.handle({
      userId: identity.userId,
      identityId: identity.id,
      authenticator: constants.IdentityTypes.PASSWORD,
      ipAddress: request.ipAddress,
      userAgent: request.userAgent,
    });
  }
}
```

### Frontend

Ví dụ form đăng nhập với username, password

```tsx
import { PasswordInput, TextInput } from '@mantine/core';
import { ApiForm, authService } from '@roxavn/core/web';

<ApiForm
  api={passwordIdentityApi.auth}
  renderForm={({ field }) => [
    field(TextInput, { name: 'username', label: t('username') }),
    field(PasswordInput, { name: 'password', label: t('password') }),
  ]}
  onSuccess={async (data) => {
    await authService.authenticate(data);
  }}
/>
```

Cơ chế hoạt động:

- ApiForm gửi request tới API `passwordIdentityApi.auth` để xác thực username/password.
- Nếu xác thực thành công, server trả về accessToken và thông tin phiên đăng nhập của user.
- Gọi `authService.authenticate(data)` để lấy thông tin user và lưu vào localStorage

Lấy thông tin user đã xác thực thông qua hook:

```ts
import { useAuthUser, authService } from '@roxavn/core/web';

function Component() {
  const user = useAuthUser();
  return (
    <div>
      <div>Hello {user?.username}</div>
      <button onClick={() => authService.logout()}>Logout</button>
    </div>
  );
}
```
