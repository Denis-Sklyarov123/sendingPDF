import type { IQueryPost } from "../types/interfaces/request";

export const createAttachments = (prm: { [key: string]: any }): IQueryPost => {
  const query: IQueryPost = {
    serverModel: "Sharan.Attachment",
    action: "create",
    objectId: prm.id,
    changes: [
      { key: "_id", to: prm.id },
      { key: "type", to: prm.type },
      { key: "iForm", to: false },
      { key: "fileName", to: prm.fileName },
      { key: "description", to: "automatic blood test result" },
      { key: "date", to: prm.date },
    ],
    hasMany: [],
    belongsTo: [
      {
        key: "patient",
        serverModel: "Sharan.Patient",
        to: prm.cs_id,
      },
    ],
  };

  return query;
};
