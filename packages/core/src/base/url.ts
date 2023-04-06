const urlUtils = {
  parseValue: (k: any, v: any) => {
    if (typeof v === 'string' && v.length > 9) {
      const d = new Date(v);
      return isNaN(d.getDate()) ? v : d;
    }
    return v;
  },

  generatePath(urlPattern: string, params: Record<string, any>) {
    const retParams = { ...params };
    const parts = urlPattern.split('/');
    const result = [] as string[];
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i].startsWith(':')) {
        const key = parts[i].slice(1);
        result.push(params[key]);
        delete retParams[key];
      } else {
        result.push(parts[i]);
      }
    }
    return {
      path: result.join('/'),
      params: retParams,
    };
  },
  generateQueryStr(data: Record<string, any>) {
    const params = new URLSearchParams();

    const appendValue = (k: string, v: any) => {
      let val = v;
      if (v instanceof Date) {
        val = v.toISOString();
      } else if (typeof v === 'boolean') {
        val = v ? '1' : '0';
      }
      if (val) {
        params.append(k, val);
      }
    };

    Object.entries(data).map(([key, value]) => {
      if (Array.isArray(value)) {
        value.map((v) => appendValue(key, v));
      } else {
        appendValue(key, value);
      }
    });
    return params.toString();
  },
  parseQueryStr(queryStr: string) {
    const params = new URLSearchParams(queryStr);
    const result: Record<string, any> = {};

    for (const [k, v] of params) {
      if (k in result) {
        if (Array.isArray(result[k])) {
          result[k].push(urlUtils.parseValue(k, v));
        } else {
          result[k] = [result[k], urlUtils.parseValue(k, v)];
        }
      } else {
        result[k] = urlUtils.parseValue(k, v);
      }
    }
    return result;
  },
};

export { urlUtils };
