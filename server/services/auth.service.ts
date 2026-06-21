import { verifyPassword } from "@/server/lib/password";
import { findUserByEmail } from "@/server/services/user.service";

export async function validateLocalCredentials(
  email: string,
  password: string,
) {
  const user = await findUserByEmail(email);
  if (!user?.passwordHash) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  return user;
}
