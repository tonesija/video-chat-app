module.exports = {
    PORT: process.env.PORT || 7070,

    authentication: {
      jwtSecret: process.env.JWT_SECRET || 'secret'
    },
    
    db: {
        database: 'VideoChatAppDB',
        user: 'postgres',
        password: '',
        dialectOptions: {
          ssl: {
              rejectUnauthorized: false
          }
        },
        options: {
          dialect: 'postgres',
          dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
          },
          protocol: 'postgres',
          url: process.env.DATABASE_URL || "postgres://postgres:111111222@127.0.0.1:5432/VideoChatAppDB"
        }
      }
      //
}