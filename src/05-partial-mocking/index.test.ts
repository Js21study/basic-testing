import {
  mockOne,
  mockThree,
  mockTwo,
  unmockedFunction,
} from '05-partial-mocking';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    console.log = jest.fn();

    mockOne();
    mockTwo();
    mockThree();

    expect(console.log).not.toHaveBeenCalled();

    expect(mockOne).toHaveBeenCalled();
    expect(mockTwo).toHaveBeenCalled();
    expect(mockThree).toHaveBeenCalled();
  });

  test('unmockedFunction should log into console', () => {
    console.log = jest.fn();

    unmockedFunction();

    expect(console.log).toHaveBeenCalled();
  });
});
