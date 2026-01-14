// AppEventBus.ts
import mitt from 'mitt';

type Events = {
  // liste des événements que tu veux typer
  login: string;
  logout: void;
  message: string;
};

const emitter = mitt<Events>();

export default emitter;
