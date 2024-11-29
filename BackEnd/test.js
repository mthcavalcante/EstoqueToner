const bcrypt = require('bcryptjs');

const generatePassword = async () => {
    const hashedPassword = bcrypt.hashSync('Vitoria0612.', 10);
    console.log('Senha criptografada:', hashedPassword);
};

generatePassword();