import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const SECRET = 'ALAMI-REST-API';

export const random = async () => {
  const randomBytes = await bcrypt.genSalt(SALT_ROUNDS);
  return randomBytes;
};


export const authentication = async (salt: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return bcrypt.hash([hashedPassword, SECRET].join('/'), SALT_ROUNDS);
};

