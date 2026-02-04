// repositories/users.repository.ts
import { User } from "../models/User";

export async function findUserByEmail(email: string) {
  return User.findOne({ email }).lean();
}

export async function createUser(
  email: string,
  nome = "",
  cpf = "",
  dataNascimento = ""
) {
  const user = await User.create({
    email,
    nome,
    cpf,
    dataNascimento,
  });

  return user.toObject();
}
