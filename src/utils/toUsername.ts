export function toUsername(email: string) {
  return email.replace("@", "-at-");
}
