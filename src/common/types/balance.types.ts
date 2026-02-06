/**
 * Tipos e DTOs relacionados a saldo
 */

export interface BalanceCreditDTO {
  userId: number;
  amount: number;
}

export interface BalanceResponse {
  userId: number;
  balance: number;
}

