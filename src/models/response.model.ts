export interface IResponseDto<T> {
  status: string;
  data?: Array<T> | T;
  message?: string;
}
