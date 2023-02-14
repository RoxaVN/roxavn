const urlUtils = {
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
};

export { urlUtils };
