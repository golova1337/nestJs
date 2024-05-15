import { ApiProperty } from '@nestjs/swagger';

export class CommonResponse<T> {
  @ApiProperty({ description: 'Status of request fulfillment', required: true })
  status: boolean;

  @ApiProperty({
    description: 'Flag indicating the presence of an error',
    required: true,
    example: false,
  })
  error: boolean;

  @ApiProperty({
    description: 'Reporting success or errors',
    required: true,
    example: 'Successfully',
  })
  message: string;

  @ApiProperty({ description: 'Additional metadata' })
  meta: object;

  @ApiProperty({
    description: 'Response data (optional)',
    required: false,
  })
  data?: T;
}
