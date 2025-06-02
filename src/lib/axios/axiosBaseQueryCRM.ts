import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import axiosAdmin from './axiosAdmin';

interface BaseQueryArgs {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
}

export const axiosBaseQueryCrm =
  (): BaseQueryFn<Partial<BaseQueryArgs>, unknown, unknown> =>
  async ({ url, method, data, params }) => {
    try {

      const result = await axiosAdmin({
        url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
