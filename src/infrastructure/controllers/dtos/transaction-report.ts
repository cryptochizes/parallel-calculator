import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum TransactionReportStatus {
  Irreversible = "irreversible",
  Failed = "failed",
}

export class TransactionReport {
  @IsString()
  @IsNotEmpty()
  readonly trxId!: string;

  @IsEnum(TransactionReportStatus)
  readonly status!: TransactionReportStatus;
}
