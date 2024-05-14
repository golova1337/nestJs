import { ApiProperty } from '@nestjs/swagger';

export class CommonResponse<T> {
  @ApiProperty({ description: 'Статус выполнения запроса', required: true })
  status: boolean;

  @ApiProperty({
    description: 'Флаг, указывающий на наличие ошибки',
    required: true,
    example: false,
  })
  error: boolean;

  @ApiProperty({
    description: 'Сообщение об успешном выполнении или ошибках',
    required: true,
    example: '"Action" successfully',
  })
  message: string;

  @ApiProperty({ description: 'Дополнительные метаданные' })
  meta: object;

  @ApiProperty({
    description: 'Данные ответа (необязательные)',
    required: false,
  })
  data?: T;
}
