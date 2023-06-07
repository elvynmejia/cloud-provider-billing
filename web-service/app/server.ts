import app from '.';
import http from 'http';

const port = 3001;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  const logger = console;
  logger.info(`Listening on port: ${port}`);
});

export default server;
