// repositories/users.repository.ts
import { User } from "../models/User";

export async function findUserByEmail(email: string) {
  return User.findOne({ email }); // ❌ remove lean
}

export async function createUserByEmail(email: string) {
  return User.create({
    email,
    firstAccessCompleted: false,
  });
}
