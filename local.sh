#!/bin/bash
function local_opt() {
		echo '开始打包'
    pnpm build
		if [ -f 'dist.zip' ]
		then echo '删除已存在的dist文件'
		rm ./dist.zip
		fi
    echo '压缩打包文件'
    7z a -tzip ./dist.zip ./dist/
    # 迁移压缩文件到服务器对应目录下
		echo '上传dist文件'
    scp ./dist.zip ali:/root/nginx-static/temp
    echo '删除dist文件'
    rm ./dist.zip
}

echo '开始发布'
local_opt
echo '已上传到服务器'