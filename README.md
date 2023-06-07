# Gin Admin React - [omgind](https://github.com/heromicro/omgind)

<div align="center">
 基于 Ant Design React 实现的RBAC权限管理脚手架，目的是提供一套轻量的中后台开发框架，方便、快速的完成业务需求的开发。
<br/>

</div>

## TODO
```shell
swagger-codegen generate -i ../../../../kuiper/internal/app/swagger/swagger.yaml -l javascript -o api 
openapi-generator  generate -i ../../../../kuiper/internal/app/swagger/swagger.yaml -g typescript-axios -o open-api --skip-validate-spec 
openapi-generator  generate -i ../../../../kuiper/internal/app/swagger/swagger.yaml -g javascript -o open-api-js --skip-validate-spec 
```

## 获取并运行

```
git clone https://github.com/heromicro/omgind-react.git
cd omgind-react
yarn
yarn start
```

## 打包编译

```
yarn run build
```

## MIT License
