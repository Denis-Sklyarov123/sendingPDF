export interface IClientService {
  _id: string;
  firstName: string;
  lastName: string;
  serviceType: string;
  csid: number;
  order?: IOrder[];
  emailFrom: string;
  host: string;
  emailTo: string;
  password: string;
  userName: string;
  port: string;
}

export interface IOrder {
  _id: string;
  treatment?: ITreatment[];
}

export interface ITreatment {
  _id: string;
  employeePost: string;
  state: string;
  employeeField: string;
  employee?: IEmployee;
}

export interface IEmployee {
  _id: string;
  emailOrg: string;
  fullNameEmployee: string;
}
