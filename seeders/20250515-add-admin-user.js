'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    // Remove any existing manual admin row to avoid unique-constraint violation
    await queryInterface.bulkDelete('users', { email: 'admin@gmail.com' });

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('admin123', 12),
        role: 'admin',
        provider: 'local',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@gmail.com' });
  },
};
