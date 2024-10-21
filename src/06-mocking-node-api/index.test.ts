import {
  doStuffByInterval,
  doStuffByTimeout,
  readFileAsynchronously,
} from '06-mocking-node-api';
import { promises as fs } from 'fs';
import path from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(setTimeout).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 500);

    expect(setInterval).toHaveBeenCalledWith(callback, 500);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 500);

    jest.advanceTimersByTime(1500);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockFilePath = 'mockFile.txt';
  const mockFullPath = path.join(__dirname, mockFilePath);

  beforeAll(async () => {
    await fs.writeFile(mockFullPath, 'Hello, world!');
  });

  afterAll(async () => {
    await fs.unlink(mockFullPath);
  });

  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join');

    await readFileAsynchronously(mockFilePath);

    expect(joinSpy).toHaveBeenCalledWith(__dirname, mockFilePath);
    joinSpy.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    const result = await readFileAsynchronously('nonExistentFile.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const result = await readFileAsynchronously(mockFilePath);
    expect(result).toBe('Hello, world!');
  });
});
