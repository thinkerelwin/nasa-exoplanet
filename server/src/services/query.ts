import { Request } from "express";
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query: Request["query"]) {
  let limit = Number(query.limit) || DEFAULT_PAGE_LIMIT; // mongoDB will return all data when limit is 0
  let page = Number(query.page) || DEFAULT_PAGE_NUMBER;
  const skip = (page - 1) * limit;

  if (isNaN(limit) || isNaN(page)) {
    console.log("query can't be convert to number", query);
  } else if (page < 0) {
    console.log("page can't be negative", query);
  } else if (limit < 0) {
    console.log("limit can't be negative", query);
  }

  return { skip, limit };
}

export { getPagination };
