import { displayNameFromEmail } from './names';

describe('displayNameFromEmail', () => {
  it('capitalises each word of the local part', () => {
    expect(displayNameFromEmail('maria.lopez@example.com')).toBe('Maria Lopez');
    expect(displayNameFromEmail('jon_snow+cash@example.com')).toBe('Jon Snow Cash');
  });

  it('drops digits and keeps something readable', () => {
    expect(displayNameFromEmail('ana92@example.com')).toBe('Ana');
    expect(displayNameFromEmail('1234@example.com')).toBe('1234');
  });
});
