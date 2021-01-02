import { measureMemory } from 'vm';

class HttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;

// import HttpException from './HttpException';

// class PostNotFoundException extends HttpException {

//   constructor(id: number) {
//     super(404, `Post with id ${id} not found!`);
//   }
// }

// export default PostNotFoundException;
