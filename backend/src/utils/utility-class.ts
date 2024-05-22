/**
 * ErrorHandler class to handle error we can customise it based on our needs.
 * It extends Error class avaible in js and in the constructor we are passing our own error message and status code.
 */
class ErrorHandler extends Error{
    constructor(public message:string,public statusCode:number){
      super(message);
      this.statusCode = statusCode;
    }
}


export default ErrorHandler;