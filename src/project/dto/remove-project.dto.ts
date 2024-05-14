import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class RemoveDto {
  @ApiProperty({
    name: 'ids',
    type: [String],
    example: ['6638b5ee4961ccd64350f013'],
  })
  @IsArray()
  ids: string[];
}
