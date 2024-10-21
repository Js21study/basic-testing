import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '04-test-class';

describe('BankAccount', () => {
  let account: ReturnType<typeof getBankAccount>;
  let targetAccount: ReturnType<typeof getBankAccount>;

  beforeEach(() => {
    account = getBankAccount(100);
    targetAccount = getBankAccount(50);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(150)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(150)).toThrow(
      'Insufficient funds: cannot withdraw more than 100',
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(150, targetAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    account.withdraw(50);
    expect(account.getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    account.transfer(50, targetAccount);
    expect(account.getBalance()).toBe(50);
    expect(targetAccount.getBalance()).toBe(100);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
    expect(balance).toBeGreaterThanOrEqual(0);
    expect(balance).toBeLessThanOrEqual(100);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const mockFetchBalance = jest
      .spyOn(account, 'fetchBalance')
      .mockResolvedValue(80);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(80);
    mockFetchBalance.mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const mockFetchBalance = jest
      .spyOn(account, 'fetchBalance')
      .mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    mockFetchBalance.mockRestore();
  });
});
