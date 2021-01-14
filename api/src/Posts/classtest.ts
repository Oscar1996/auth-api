import { IsInt } from 'class-validator';

export default class testObject {
  public name: string;
  public hello: string;
  @IsInt()
  public age: number;
}
