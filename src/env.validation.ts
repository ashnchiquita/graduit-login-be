import { plainToInstance } from "class-transformer";
import {
  IsNumber,
  validateSync,
  Min,
  Max,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";

class EnvironmentVariables {
  @IsString()
  S1_POSTGRES_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  S1_POSTGRES_PORT: number;

  @IsString()
  S1_POSTGRES_USER: string;

  @IsString()
  S1_POSTGRES_PASSWORD: string;

  @IsString()
  S1_POSTGRES_DATABASE: string;

  @IsString()
  S2_POSTGRES_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  S2_POSTGRES_PORT: number;

  @IsString()
  S2_POSTGRES_USER: string;

  @IsString()
  S2_POSTGRES_PASSWORD: string;

  @IsString()
  S2_POSTGRES_DATABASE: string;

  @IsString()
  AAD_CLIENT_ID: string;

  @IsString()
  AAD_CLIENT_SECRET: string;

  @IsString()
  AAD_TENANT: string;

  @IsString()
  @MinLength(64)
  JWT_SECRET: string;

  @IsString()
  @IsUrl({ require_tld: false })
  AUTH_SERVICE_URL: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  @IsUrl({ require_tld: false })
  LOGIN_FE_URL: string;

  @IsString()
  COOKIE_NAME: string;

  @IsString()
  COOKIE_DOMAIN: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
