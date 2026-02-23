export interface IUser {
  id: number | null;
  name: string;
  last_name: string;
  email: string;
}

export class User implements IUser {
  id: number | null = null;
  name: string = '';
  last_name: string = '';
  email: string = '';
  change_password: boolean = false;
  password: string = '';
  password_confirmation: string = '';
  show_password: boolean = false;
  show_password_confirmation: boolean = false;
  constructor(data?: IUser) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
