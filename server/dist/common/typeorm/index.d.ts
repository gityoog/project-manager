import { ColumnOptions } from 'typeorm';
export declare function UpdateDateColumnWithFormat(options?: ColumnOptions): PropertyDecorator;
export declare function CreateDateColumnWithFormat(options?: ColumnOptions): PropertyDecorator;
export declare function NonNullableColumn<T>(options?: ColumnOptions): PropertyDecorator;
