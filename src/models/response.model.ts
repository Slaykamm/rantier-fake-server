export interface IResponseDto<T> {
  status: string;
  data?: Array<T>;
  message?: string;
}
