import type { IQueryGet } from "../types/interfaces/request";

export const getClientService = (prm: string): IQueryGet => {
  const query: IQueryGet = {
    model: "Sharan.Patient",
    conditions: {
      customID: prm,
    },
    fields:
      "_id id lastName firstName emailFrom host emailTo password userName port",
  };

  return query;
};
