// import * as _ from 'lodash';

export const makeupSortKey = (sort) => {
  // {sort: "ascend", }
  // {sort: "descend" }
  // created_at__order
  // Name_Order      string `form:"name__order"`       // asc desc
  // Sort_Order      string `form:"sort__order"`       // asc desc
  let nsort = {};
  Object.keys(sort).forEach((key) => {
    nsort[`${key}__order`] = sort[key];
  });
  return nsort;
};
