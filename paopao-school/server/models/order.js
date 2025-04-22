const db = require('../config/database');

const orderColumns = {
  user_id: { type: 'BIGINT', foreignKey: 'users(id)', required: true },
  worker_id: { type: 'BIGINT', foreignKey: 'users(id)' },
  order_type: { type: 'ENUM("外卖", "快递")', required: true },
  pickup_address: { type: 'VARCHAR(255)' },
  pickup_lat: { type: 'DECIMAL(10,8)' },
  pickup_lng: { type: 'DECIMAL(11,8)' },
  delivery_address: { type: 'VARCHAR(255)' },
  delivery_lat: { type: 'DECIMAL(10,8)' },
  delivery_lng: { type: 'DECIMAL(11,8)' },
  reward: { type: 'DECIMAL(10,2)', unsigned: true },
  description: { type: 'TEXT' },
  status: { 
    type: 'ENUM("PENDING", "ACCEPTED", "DELIVERING", "COMPLETED", "CANCELLED")',
    default: 'PENDING'
  },
  created_at: { type: 'DATETIME', default: 'CURRENT_TIMESTAMP' },
  updated_at: { 
    type: 'DATETIME', 
    default: 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  }
};

const spatialIndexQuery = `
CREATE SPATIAL INDEX idx_pickup_location 
ON orders (POINT(pickup_lat, pickup_lng));
`;

module.exports = {
  create: async (orderData) => {
    return db.executeTransaction(async (connection) => {
      // 冻结120%保证金
      const [currentDeposit] = await connection.query(
        'SELECT deposit FROM users WHERE id = ? FOR UPDATE',
        [orderData.user_id]
      );
      
      if (currentDeposit[0].deposit < orderData.reward * 1.2) {
        throw new Error('INSUFFICIENT_DEPOSIT');
      }
      
      const [user] = await connection.query(
        'UPDATE users SET deposit = deposit - ? WHERE id = ?',
        [orderData.reward * 1.2, orderData.user_id]
      );

      if (user.affectedRows === 0) {
        throw new Error('INSUFFICIENT_DEPOSIT');
      }

      const [result] = await connection.query(
        'INSERT INTO orders SET ?',
        {
          ...orderData,
          status: 'PENDING',
          created_at: new Date(),
          updated_at: new Date(),
          user_id: orderData.user_id,
          order_type: orderData.type
        }
      );
      return result.insertId;
    });
  },

  updateStatus: async (orderId, newStatus) => {
    const [current] = await db.getConnection().query(
      'SELECT status, user_id FROM orders WHERE id = ? FOR UPDATE',
      [orderId]
    );

    if (!statusTransitions[current[0].status].includes(newStatus)) {
      throw new Error('INVALID_STATUS_TRANSITION');
    }

    const [result] = await db.getConnection().query(
      'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
      [newStatus, new Date(), orderId]
    );
    return result.affectedRows;
  },

  statusTransitions: {
    'PENDING': ['ACCEPTED', 'CANCELLED'],
    'ACCEPTED': ['DELIVERING', 'CANCELLED'],
    'DELIVERING': ['COMPLETED', 'CANCELLED']
  }
};