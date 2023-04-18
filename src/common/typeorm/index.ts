import { ColumnOptions, UpdateDateColumn, CreateDateColumn, Column } from 'typeorm'

export function UpdateDateColumnWithFormat(options?: ColumnOptions): PropertyDecorator {
  return UpdateDateColumn({
    ...options,
    transformer: [{
      to: (value: Date) => value,
      from: (value: Date) => value.toLocaleString(),
    }].concat(options?.transformer || [])
  })
}

export function CreateDateColumnWithFormat(options?: ColumnOptions): PropertyDecorator {
  return CreateDateColumn({
    ...options,
    transformer: [{
      to: (value: Date) => value,
      from: (value: Date) => value.toLocaleString(),
    }].concat(options?.transformer || [])
  })
}

export function NonNullableColumn<T>(options?: ColumnOptions): PropertyDecorator {
  return Column({
    ...options,
    transformer: [{
      to: (value: T) => value ? value : undefined,
      from: (value: T) => value,
    }].concat(options?.transformer || [])
  })
}