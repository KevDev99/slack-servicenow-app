const connectAccount = async ({ body, client, ack }) => {
  try {
    
    await ack();
    
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectAccount;
