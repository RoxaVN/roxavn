import React from 'react';
import { ApiFilter } from '../../share';

export const ApiFilterIcons: Record<string, React.ReactNode> = {
  [ApiFilter.STARTS_WITH]: '*_',
  [ApiFilter.ENDS_WITH]: '_*',
  [ApiFilter.CONTAINS]: '*',
  [ApiFilter.NOT_CONTAINS]: '!*',
  [ApiFilter.EQUALS]: '=',
  [ApiFilter.NOT_EQUALS]: '!=',
  [ApiFilter.IN]: '∈',
  [ApiFilter.LESS_THAN]: '<',
  [ApiFilter.LESS_THAN_OR_EQUAL_TO]: '<=',
  [ApiFilter.GREATER_THAN]: '>',
  [ApiFilter.GREATER_THAN_OR_EQUAL_TO]: '>=',
};
