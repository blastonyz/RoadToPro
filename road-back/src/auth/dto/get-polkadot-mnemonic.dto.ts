import { IsString, IsNotEmpty } from 'class-validator';

export class GetPolkadotMnemonicDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
