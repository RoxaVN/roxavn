import { BadRequestException } from '@roxavn/core/share';
import { baseModule } from '../module';

export class UserExistsException extends BadRequestException {
  i18n = {
    default: { key: 'Error.UserExistsException', ns: baseModule.escapedName },
  };
}
