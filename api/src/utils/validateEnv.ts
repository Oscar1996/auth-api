import envalid from 'envalid';

export default function validateEnv() {
  envalid.cleanEnv(process.env, {
    MONGO_USER: envalid.str(),
    MONGO_PASSWORD: envalid.str(),
    MONGO_URI: envalid.str(),
    PORT: envalid.port(),
    SECRET_TOKEN: envalid.str()
  });
}
