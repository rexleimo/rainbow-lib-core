import { AxiosRequestConfig, Method } from "axios";
import { CustomResponse, IHttpClient, IHttpInterceptors } from "../interface";
import AxiosClient from "../nettool/axios-client";
import RequestInterceptors from "../observe/request-interceptors";

export default class HttpClient implements IHttpClient {

    private okHttp: AxiosClient;
    private interceptors: RequestInterceptors;

    public constructor() {
        this.okHttp = new AxiosClient();
        this.interceptors = new RequestInterceptors();
        this.interceptors.getInterceptors().subscribe(interceptors => {
            this.okHttp.getOkHttp().interceptors.request.use(config => {
                let result = {};
                for (const interceptor of interceptors) {
                    result = Object.assign(result, interceptor.handleHttpRequst(config))
                }
                return result;
            })

            this.okHttp.getOkHttp().interceptors.response.use(response => {
                let result = {};
                for (const interceptor of interceptors) {
                    result = Object.assign(result, interceptor.hanldHttpResponse(response))
                }
                return result;
            })
        })
    }

    setInterceptors(interceptors: IHttpInterceptors): void {
        this.interceptors.setInterceptors(interceptors);
    }

    Get(uri: string, query: any, options: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Get(uri: string, query: any, options?: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Get(uri: string, query?: any, options?: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Get(uri: any, query?: any, options?: any): Promise<CustomResponse> {
        return this.request('GET', uri, query, options);
    }
    Post(uri: string, data: any, options: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Post(uri: string, data: any, options?: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Post(uri: string, data?: any, options?: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Post(uri: any, data?: any, options?: any): Promise<CustomResponse> {
        return this.request('POST', uri, data, options);
    }
    Put(uri: string, data: any, options: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Put(uri: string, data: any, options?: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Put(uri: string, data?: any, options?: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Put(uri: string, data?: any, options?: any): Promise<CustomResponse> {
        return this.request('PUT', uri, data, options);
    }
    Delete(uri: string, data: any, options: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Delete(uri: string, data: any, options?: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Delete(uri: string, data?: any, options?: AxiosRequestConfig<any>): Promise<CustomResponse>;
    Delete(uri: any, data?: any, options?: any): Promise<CustomResponse> {
        return this.request('DELETE', uri, data, options);
    }

    private request(mode: Method, uri: string, body: any, options?: AxiosRequestConfig) {

        const requestBody = ['GET', 'DELETE'].indexOf(mode) === 0 ?
            {
                params: body
            }
            :
            {
                data: body
            }

        return this.okHttp.getOkHttp().request({
            ...requestBody,
            url: uri,
            method: mode,
        }).then(res => {
            return res.data
        })
    }
}