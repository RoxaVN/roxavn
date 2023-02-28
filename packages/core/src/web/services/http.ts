import { Subject } from 'rxjs';
import { urlUtils } from '../../base';

export interface HttpException {
  message: string;
  data?: Record<string, any>;
  response: Response;
}

interface PreSentData {
  params: Record<string, any> | undefined;
  config: Record<string, any>;
}

async function checkStatus(response: Response) {
  const text = await response.text();
  let data;
  let errorMsg;
  try {
    data = JSON.parse(text);
  } catch (e) {
    errorMsg = "Can't parse JSON";
  }

  if (response.status >= 200 && response.status < 300 && data) {
    return data;
  }
  throw {
    message: errorMsg || response.statusText,
    response,
    data,
  } as HttpException;
}

const http = {
  Host: '',
  errorObserver: new Subject<HttpException>(),
  successObserver: new Subject<any>(),
  preSentObserver: new Subject<PreSentData>(),

  _bodyParams(path: string, method: string, data?: Record<string, any>) {
    const api = data ? urlUtils.generatePath(path, data) : { path, params: {} };
    const { params } = api;
    const formData = new FormData();
    let hasFile = false;
    Object.keys(params).map((key) => {
      formData.append(key, params[key]);
      if (params[key] instanceof File) {
        hasFile = true;
      }
    });

    const config: RequestInit = { method, headers: {} };
    if (hasFile) {
      config.body = formData;
    } else {
      config.headers = { 'Content-Type': 'application/json' };
      config.body = JSON.stringify(params);
    }

    this.preSentObserver.next({ params, config });
    return fetch(this.Host + api.path, config)
      .then(checkStatus)
      .then((resp) => {
        this.successObserver.next(resp);
        return resp;
      })
      .catch((error) => {
        this.errorObserver.next(error);
        throw error;
      });
  },
  _urlParams(path: string, method: string, params?: Record<string, unknown>) {
    const config = { method, headers: {} };
    this.preSentObserver.next({ params, config });

    return fetch(this.genGetUrl(path, params), config)
      .then(checkStatus)
      .then((resp) => {
        this.successObserver.next(resp);
        return resp;
      })
      .catch((error) => {
        this.errorObserver.next(error);
        throw error;
      });
  },
  genGetUrl(path: string, data?: Record<string, any>) {
    if (path && path[0] !== '/') {
      return path;
    }
    const api = data ? urlUtils.generatePath(path, data) : { path, params: {} };

    return `${this.Host + api.path}?${urlUtils.generateQueryStr(api.params)}`;
  },
};

export { http };
