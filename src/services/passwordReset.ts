const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

// TODO(backend): Replace with a request to send a password-reset email.
export async function requestPasswordReset(email: string): Promise<void> {
  void email;
  await wait(900);
}

// TODO(backend): Replace with server-side token validation and password update.
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  void token;
  void newPassword;
  await wait(900);
}
