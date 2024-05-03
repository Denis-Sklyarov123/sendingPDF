export const takeCsId = (fileName: string): number => {
  const csId = fileName.split(/[._]/)[1];

  return Number(csId);
};
