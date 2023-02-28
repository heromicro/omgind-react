// {"id": "01GSWGT66YKJTK652JWVJHYWSE","pid": "01GSWGT66SN259NQ5DEVENTFDZ","name": "北京","sname": "北京","abbr": null,"suffix": "市","st_code": "110000","initials": "bj","pinyin": "beijing","longitude": 116.405281,"latitude": 39.904987,"area_code": "","zip_code": "","merge_name": "北京市","merge_sname": "北京","extra": "","is_active": true,"sort": 2,"is_del": false,"is_main": false,"is_hot": true,"is_real": true,"is_direct": true,"is_leaf": false,"tree_id": 1,"tree_level": 2,"tree_left": 2,"tree_right": 39,"tree_path": "01GSWGT66SN259NQ5DEVENTFDZ","creator": "","created_at": "2023-02-23T14:47:41.634339+08:00","updated_at": "2023-02-23T14:47:41.911614+08:00" }

export type DistrctItem = {
    id: string;
    pid: string;
    name: string;
    sname: string;
    abbr: string;
    suffix: string;
    st_code: string;
    initials: string;
    pinyin: string;
    merge_name: string;
    extra: string;

    longitude: number;
    latitude: number;

    is_active: boolean;
    is_del: boolean;
    is_main: boolean;
    is_hot: boolean;
    is_real: boolean;
    is_direct: boolean;

    is_leaf: boolean;
    
    tree_id: number;
    tree_left: number;
    tree_right: number;
    tree_path: string;

    created_at: string;
    updated_at: string;
    creator?: string;
  
}