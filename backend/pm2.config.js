module.exports = {
  apps : [{
    name: 'playergency-backend',
    script: 'npm start',
    log_file: 'playergency-backend.log',
    time: true,
    env: {
      NODE_ENV: 'production'
    }
  }],
};
