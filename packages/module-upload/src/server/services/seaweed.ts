import { urlUtils } from '@roxavn/core/base';
import FormData from 'form-data';
import http from 'http';
import { Readable } from 'stream';

import { Env } from '../config';

export class SeaweedClient {
  constructor(private baseUrl: string) {}

  private _resolveResponse(
    resp: http.IncomingMessage,
    resolve: (result: any) => void,
    reject: (error: any) => void
  ) {
    let body = '';
    resp.setEncoding('utf8');
    resp.on('data', function (chunk) {
      body += chunk;
    });
    resp.on('end', function () {
      try {
        const result = JSON.parse(body);
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  private _urlWithSchema = (url: string): string =>
    url.startsWith('http') ? url : `http://${url}`;

  lookup(params: { volumeId: number | string }): Promise<{
    locations: Array<{ publicUrl: string; url: string }>;
  }> {
    return new Promise((resolve, reject) => {
      http
        .request(
          new URL(
            'dir/lookup?' + urlUtils.generateQueryStr(params),
            this.baseUrl
          ),
          (resp) => {
            this._resolveResponse(resp, resolve, reject);
          }
        )
        .on('error', function (err) {
          return reject(err);
        })
        .end();
    });
  }

  assign(params?: Record<string, any>): Promise<{
    count: number;
    fid: string;
    publicUrl: string;
    url: string;
    error?: string;
  }> {
    return new Promise((resolve, reject) => {
      http
        .request(
          new URL(
            'dir/assign?' + urlUtils.generateQueryStr(params || {}),
            this.baseUrl
          ),
          (resp) => {
            this._resolveResponse(resp, resolve, reject);
          }
        )
        .on('error', function (err) {
          return reject(err);
        })
        .end();
    });
  }

  write(
    file: Readable,
    params?: any
  ): Promise<{
    fid: string;
    url: string;
    size: number;
    eTag: string;
    error?: string;
  }> {
    return this.assign(params).then((finfo) => {
      return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('file', file);
        const volumeUrl = Env.SEAWEED_USE_PUBLIC_URL
          ? finfo.publicUrl
          : finfo.url;

        const urlParts = new URL(finfo.fid, this._urlWithSchema(volumeUrl));

        const request = http.request({
          method: 'post',
          headers: form.getHeaders(),
          hostname: urlParts.hostname,
          port: urlParts.port,
          pathname: urlParts.pathname,
          path: urlParts.pathname,
        });
        form.pipe(request);

        request
          .on('response', (resp) => {
            this._resolveResponse(
              resp,
              (result) => {
                result.fid = finfo.fid;
                result.url = new URL(
                  finfo.fid,
                  this._urlWithSchema(finfo.publicUrl)
                ).href;
                resolve(result);
              },
              reject
            );
          })
          .on('error', function (err) {
            reject(err);
          });
      });
    });
  }
}

export const seaweedClient = new SeaweedClient(Env.SEAWEED_MASTER_URL);
