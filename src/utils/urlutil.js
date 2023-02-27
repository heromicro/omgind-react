// import * as _ from 'lodash';


export const makeupSortKey = (sort) => {
    // {sort: "ascend", }
    // {sort: "descend" }
    // created_at__order 
	// Name_Order      string `form:"name__order"`       // asc desc
	// Sort_Order      string `form:"sort__order"`       // asc desc 
    let nsort = {}
    // for (let key in sort) {
    //     nsort[`${key}__order`] = sort[key]
    // }
    // console.log(" -------- -- nsorts ", nsorts);
    for (const [key, val] of Object.entries(sort)) {
        // eslint-disable-next-line
        nsort[`${key}__order`] = val;
    }
    return nsort
}