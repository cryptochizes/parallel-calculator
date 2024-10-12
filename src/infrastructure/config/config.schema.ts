import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

import { ConfigSchema } from "@application/common/config";

export class ConfigSchemaImpl implements ConfigSchema {
  @IsString()
  @IsNotEmpty()
  readonly APP_NAME!: string;

  @IsInt()
  @IsPositive()
  readonly APP_PORT!: number;
}
